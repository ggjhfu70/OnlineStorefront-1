import React, { useState, useEffect } from "react";
import { Product, ProductVariant, ProductSpecification } from "../../../types";
import {
  getAllCategories,
  getCategoryAttributes,
} from "../../../data/categoryHierarchy";
import Button from "../../../components/ui/Button";
import { Plus, Trash2, X } from "lucide-react";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "attributes">(
    "general",
  );
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "", // Will be auto-generated
    category: product?.category || "",
    description: product?.description || "",
    price: product?.price || 0,
    cost: product?.cost || 0,
    currency: product?.currency || "VND",
    images: product?.images || [""],
    attributes: product?.attributes || {},
    specifications: product?.specifications || ([] as ProductSpecification[]),
    variants: product?.variants || [],
    active: true, // Always active by default
    packaging: product?.packaging || [
      { id: "default", unit: "Sản phẩm", quantity: 1, isDefault: true }
    ] as Array<{ id: string; unit: string; quantity: number; isDefault?: boolean }>,
  });

  // Predefined variant types and values
  const variantTypeOptions = {
    "Màu sắc": [
      "Đỏ",
      "Xanh dương",
      "Xanh lá",
      "Vàng",
      "Cam",
      "Tím",
      "Hồng",
      "Nâu",
      "Đen",
      "Trắng",
      "Xám",
    ],
    "Kích thước": ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"],
    "Chất liệu": [
      "Cotton",
      "Polyester",
      "Linen",
      "Wool",
      "Silk",
      "Denim",
      "Leather",
    ],
    "Dung lượng": ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    "Phong cách": [
      "Cổ điển",
      "Hiện đại",
      "Thể thao",
      "Công sở",
      "Dạo phố",
      "Dự tiệc",
    ],
  };

  // State for variant and packaging management
  const [selectedVariantTypes, setSelectedVariantTypes] = useState<string[]>(
    [],
  );
  const [showPackagingForm, setShowPackagingForm] = useState(false);
  const [newPackaging, setNewPackaging] = useState({ unit: "", quantity: 1 });

  const availableCategories = getAllCategories();

  // Load category attributes when category changes
  useEffect(() => {
    if (formData.category) {
      const attributes = getCategoryAttributes(formData.category);

      if (attributes.length > 0) {
        const newSpecs: ProductSpecification[] = attributes.map(
          (attr, index) => ({
            id: attr.id,
            name: attr.name,
            value:
              product?.specifications?.find((s) => s.id === attr.id)?.value ||
              "",
            type: attr.type,
            group: attr.group,
            displayOrder: index,
            required: attr.required,
            unit: attr.unit,
            options: attr.options,
            validation: attr.validation,
          }),
        );

        setFormData((prev) => ({
          ...prev,
          specifications: newSpecs,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        specifications: [],
      }));
    }
  }, [formData.category, product?.specifications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate SKU if not provided
    if (!formData.sku) {
      const skuSuffix = Math.random().toString(36).substr(2, 9).toUpperCase();
      formData.sku = `PRD-${skuSuffix}`;
    }

    // Validate specifications
    const requiredSpecs = formData.specifications.filter(
      (spec) => spec.required && !spec.value,
    );
    if (requiredSpecs.length > 0) {
      alert(
        `Các thuộc tính bắt buộc chưa được điền: ${requiredSpecs.map((s) => s.name).join(", ")}`,
      );
      return;
    }

    // Validate variant types (max 2 types)
    if (selectedVariantTypes.length > 2) {
      alert("Chỉ được phép tối đa 2 loại biến thể cho mỗi sản phẩm");
      return;
    }

    // Prepare form data with new variant types and values
    const submissionData = {
      ...formData,
      // Include new variant types and values for backend processing
      newVariantTypes: Object.keys(newVariantValues).filter(
        (type) => !Object.keys(variantTypeOptions).includes(type),
      ),
      newVariantValues: newVariantValues,
      variants: formData.variants.map((variant) => ({
        ...variant,
        // Only include selling price for variants, not cost and stock
        cost: undefined,
        stock: undefined,
      })),
    };

    onSubmit(submissionData);
  };

  const updateSpecification = (index: number, field: string, value: any) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setFormData({ ...formData, specifications: updatedSpecs });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  // Packaging functions
  const addNewPackaging = () => {
    if (newPackaging.unit && newPackaging.quantity > 0) {
      const newPkg = {
        id: Math.random().toString(36).substr(2, 9),
        unit: newPackaging.unit,
        quantity: newPackaging.quantity,
      };
      setFormData({
        ...formData,
        packaging: [...formData.packaging, newPkg],
      });
      setNewPackaging({ unit: "", quantity: 1 });
      setShowPackagingForm(false);
    }
  };

  const removePackaging = (packageId: string) => {
    // Không cho phép xóa kiểu đóng gói mặc định
    if (packageId === "default") {
      alert("Không thể xóa kiểu đóng gói mặc định");
      return;
    }
    
    setFormData({
      ...formData,
      packaging: formData.packaging.filter((p) => p.id !== packageId),
    });
  };

  // State to store selected values for each variant type
  const [selectedVariantValues, setSelectedVariantValues] = useState<{
    [key: string]: string[];
  }>({});
  const [newVariantTypes, setNewVariantTypes] = useState<{
    [key: string]: string[];
  }>({});
  const [newVariantValues, setNewVariantValues] = useState<{
    [key: string]: string[];
  }>({});

  // Generate all variant combinations
  const generateVariantCombinations = () => {
    if (selectedVariantTypes.length === 0) return [];

    const allValues: { [key: string]: string[] } = {};

    // Combine predefined and new values for each type
    selectedVariantTypes.forEach((type) => {
      const selectedValues = selectedVariantValues[type] || [];
      // Only include values that have been selected
      allValues[type] = selectedValues;
    });

    // Filter out empty value arrays
    const validTypes = Object.keys(allValues).filter(
      (type) => allValues[type].length > 0,
    );

    if (validTypes.length === 0) return [];

    // Generate combinations using cartesian product
    const combinations: ProductVariant[] = [];

    if (validTypes.length === 1) {
      // Single variant type
      const type = validTypes[0];
      allValues[type].forEach((value) => {
        combinations.push(createVariant({ [type]: value }));
      });
    } else if (validTypes.length === 2) {
      // Two variant types - create cartesian product
      const [type1, type2] = validTypes;
      allValues[type1].forEach((value1) => {
        allValues[type2].forEach((value2) => {
          combinations.push(
            createVariant({ [type1]: value1, [type2]: value2 }),
          );
        });
      });
    }

    return combinations;
  };

  // Create individual variant
  const createVariant = (attributes: {
    [key: string]: string;
  }): ProductVariant => {
    const variantName = Object.entries(attributes)
      .map(([type, value]) => `${value}`)
      .join(" - ");

    const skuSuffix = Object.values(attributes)
      .map((v) => v.substring(0, 2).toUpperCase())
      .join("");

    return {
      id: Math.random().toString(36).substr(2, 9),
      product_id: "",
      name: variantName,
      sku: `${formData.sku || "PRD"}-${skuSuffix}`,
      price: formData.price,
      cost: formData.cost,
      stock: 0,
      currency: formData.currency,
      packaging_info: "",
      unit_multiplier: 1,
      attributes: Object.fromEntries(
        Object.entries(attributes).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ]),
      ),
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // Variant functions
  const addVariantType = (type: string) => {
    if (selectedVariantTypes.length >= 2) {
      alert("Chỉ được phép tối đa 2 loại biến thể");
      return;
    }
    if (!selectedVariantTypes.includes(type)) {
      setSelectedVariantTypes([...selectedVariantTypes, type]);
      setSelectedVariantValues((prev) => ({ ...prev, [type]: [] }));
    }
  };

  const removeVariantType = (type: string) => {
    setSelectedVariantTypes(selectedVariantTypes.filter((t) => t !== type));
    const newSelectedValues = { ...selectedVariantValues };
    delete newSelectedValues[type];
    setSelectedVariantValues(newSelectedValues);

    const newCustomValues = { ...newVariantValues };
    delete newCustomValues[type];
    setNewVariantValues(newCustomValues);
  };

  const addVariantValue = (type: string, value: string) => {
    // Check if value is already selected
    if (selectedVariantValues[type]?.includes(value)) {
      alert(`Giá trị "${value}" đã được chọn cho loại biến thể "${type}"`);
      return;
    }

    // For custom values, check for duplicates (case insensitive) with existing predefined and custom values
    const predefinedValues =
      variantTypeOptions[type as keyof typeof variantTypeOptions] || [];
    const customValues = newVariantValues[type] || [];

    const isPredefined = predefinedValues.includes(value);

    if (!isPredefined) {
      // Only check for duplicates when adding custom values
      const allExistingValues = [...predefinedValues, ...customValues];
      const isDuplicate = allExistingValues.some(
        (existing) => existing.toLowerCase() === value.toLowerCase(),
      );

      if (isDuplicate) {
        alert(`Giá trị "${value}" đã tồn tại cho loại biến thể "${type}"`);
        return;
      }
    }

    // Add to selected values
    setSelectedVariantValues((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), value],
    }));

    // If it's a new custom value, add to newVariantValues
    if (!isPredefined) {
      setNewVariantValues((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), value],
      }));
    }
  };

  const removeVariantValue = (type: string, value: string) => {
    setSelectedVariantValues((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((v) => v !== value),
    }));
  };

  const updateVariantsList = () => {
    const newVariants = generateVariantCombinations();
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
  };

  // Auto-update variants when variant types or values change
  useEffect(() => {
    const newVariants = generateVariantCombinations();
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
  }, [selectedVariantTypes, selectedVariantValues]);

  const removeVariant = (variantId: string) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((v) => v.id !== variantId),
    });
  };

  const updateVariant = (variantId: string, field: string, value: any) => {
    const updatedVariants = formData.variants.map((v) =>
      v.id === variantId ? { ...v, [field]: value } : v,
    );
    setFormData({ ...formData, variants: updatedVariants });
  };

  const currencies = [
    { value: "VND", label: "VND - Việt Nam Đồng" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "CNY", label: "CNY - Nhân dân tệ" },
    { value: "THB", label: "THB - Bạt Thái" },
  ];

  const renderGeneralTab = () => (
    <>
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📝 Thông tin cơ bản
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn danh mục</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả sản phẩm
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả chi tiết về sản phẩm"
          />
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Thông tin giá cả
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá vốn
            </label>
            <input
              type="number"
              name="cost"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiền tệ
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.cost > 0 && formData.price > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Lợi nhuận: </span>
              {(
                ((formData.price - formData.cost) / formData.price) *
                100
              ).toFixed(1)}
              % ({(formData.price - formData.cost).toLocaleString()}{" "}
              {formData.currency})
            </div>
          </div>
        )}
      </div>

      {/* Packaging Options */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            📦 Kiểu đóng gói
          </h3>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowPackagingForm(!showPackagingForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm kiểu đóng gói
          </Button>
        </div>

        {showPackagingForm && (
          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">
              Thêm kiểu đóng gói mới
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPackaging.unit}
                  onChange={(e) =>
                    setNewPackaging({ ...newPackaging, unit: e.target.value })
                  }
                  placeholder="VD: Thùng, Hộp, Bó..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newPackaging.quantity}
                  onChange={(e) =>
                    setNewPackaging({
                      ...newPackaging,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button type="button" onClick={addNewPackaging} size="sm">
                  Thêm
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPackagingForm(false)}
                  size="sm"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Các kiểu đóng gói:</h4>
          {formData.packaging.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                pkg.isDefault 
                  ? "border-blue-300 bg-blue-50" 
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  1 {pkg.unit} = {pkg.quantity} sản phẩm
                </span>
                {pkg.isDefault && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                    Mặc định
                  </span>
                )}
              </div>
              {!pkg.isDefault && (
                <button
                  type="button"
                  onClick={() => removePackaging(pkg.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔄 Biến thể sản phẩm
          </h3>
          <span className="text-sm text-gray-500">Tối đa 2 loại biến thể</span>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Hướng dẫn:</strong> Chọn loại biến thể và tích chọn các
            giá trị bạn muốn. Hệ thống sẽ tự động tạo tổ hợp biến thể.
          </p>
        </div>

        {/* Selected Variant Types Display */}
        {selectedVariantTypes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Loại biến thể đã chọn:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedVariantTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeVariantType(type)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add Variant Type Dropdown */}
        {selectedVariantTypes.length < 2 && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Thêm loại biến thể:
            </h4>
            <div className="flex items-center space-x-2">
              <select
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedVariantTypes.includes(value)) {
                    addVariantType(value);
                    e.target.value = ""; // Reset selection
                  }
                }}
              >
                <option value="">Chọn loại biến thể...</option>
                {Object.keys(variantTypeOptions)
                  .filter((type) => !selectedVariantTypes.includes(type))
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom Variant Type */}
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Tạo loại biến thể mới (VD: Dung lượng, Phiên bản)..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !selectedVariantTypes.includes(value)) {
                        addVariantType(value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement)
                      .previousElementSibling as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !selectedVariantTypes.includes(value)) {
                      addVariantType(value);
                      input.value = "";
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo mới
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Variant Values Selection for Each Selected Type */}
        <div className="space-y-6">
          {selectedVariantTypes.map((type) => {
            const predefinedValues =
              variantTypeOptions[type as keyof typeof variantTypeOptions] || [];
            const customValues = newVariantValues[type] || [];
            const selectedValues = selectedVariantValues[type] || [];

            return (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{type}</h4>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {selectedValues.length} giá trị đã chọn
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Selected Values Display */}
                  {selectedValues.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Giá trị đã chọn:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedValues.map((value) => (
                          <span
                            key={value}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {value}
                            {customValues.includes(value) && (
                              <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">
                                Mới
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeVariantValue(type, value)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Values Dropdown - Only show for predefined variant types */}
                  {predefinedValues.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Thêm giá trị có sẵn:
                      </h5>
                      <div className="flex items-center space-x-2">
                        <select
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && !selectedValues.includes(value)) {
                              addVariantValue(type, value);
                              e.target.value = ""; // Reset selection
                            }
                          }}
                        >
                          <option value="">Chọn {type.toLowerCase()}...</option>
                          {predefinedValues
                            .filter((value) => !selectedValues.includes(value))
                            .map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Custom Value Input */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {predefinedValues.length > 0
                        ? "Hoặc tạo giá trị mới:"
                        : "Tạo giá trị cho loại biến thể này:"}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Nhập ${type.toLowerCase()} mới...`}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const value = (
                              e.target as HTMLInputElement
                            ).value.trim();
                            if (value) {
                              addVariantValue(type, value);
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement)
                            .previousElementSibling as HTMLInputElement;
                          const value = input.value.trim();
                          if (value) {
                            addVariantValue(type, value);
                            input.value = "";
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generated Variants Display */}
        {formData.variants.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Biến thể đã tạo ({formData.variants.length})
              </h4>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setFormData({
                    ...formData,
                    variants: formData.variants.map((v) => ({
                      ...v,
                      price: formData.price,
                      cost: formData.cost,
                      currency: formData.currency,
                    })),
                  });
                }}
              >
                Đồng bộ giá & tiền tệ từ sản phẩm chính
              </Button>
            </div>

            <div className="space-y-3">
              {formData.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">
                        {variant.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                        SKU: {variant.sku}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Giá bán
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Giá vốn
                        </label>
                        <input
                          type="number"
                          value={variant.cost}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "cost",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Tiền tệ
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700">
                          {formData.currency}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Xóa biến thể"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedVariantTypes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có loại biến thể nào
            </h3>
            <p className="mb-4">
              Tích chọn các loại biến thể ở trên để bắt đầu
            </p>
          </div>
        )}
      </div>
    </>
  );

  const renderAttributesTab = () => (
    <>
      {/* Product Attributes/Specifications */}
      {formData.category && formData.specifications.length > 0 ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚙️ Thuộc tính sản phẩm
          </h3>

          <div className="space-y-6">
            {Object.entries(
              formData.specifications.reduce((groups: any, spec) => {
                const group = spec.group || "Khác";
                if (!groups[group]) groups[group] = [];
                groups[group].push(spec);
                return groups;
              }, {}),
            ).map(([groupName, specs]: [string, any]) => (
              <div
                key={groupName}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {groupName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specs.map((spec: any) => {
                    const globalIndex = formData.specifications.findIndex(
                      (s) => s.id === spec.id,
                    );
                    return (
                      <div key={spec.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {spec.name}
                          {spec.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          {spec.unit && (
                            <span className="text-gray-500 ml-1">
                              ({spec.unit})
                            </span>
                          )}
                        </label>

                        {spec.type === "number" ? (
                          <input
                            type="number"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                globalIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder={`Nhập ${spec.name.toLowerCase()}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={spec.required}
                            min={spec.validation?.min}
                            max={spec.validation?.max}
                          />
                        ) : (
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                globalIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder={
                              spec.type === "boolean"
                                ? `Nhập Có/Không hoặc True/False`
                                : spec.options?.length
                                  ? `Nhập ${spec.name.toLowerCase()} (VD: ${spec.options.slice(0, 2).join(", ")}...)`
                                  : spec.placeholder ||
                                    `Nhập ${spec.name.toLowerCase()}`
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={spec.required}
                            pattern={spec.validation?.pattern}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có thuộc tính sản phẩm
            </h3>
            <p className="mb-4">
              Vui lòng chọn danh mục ở tab "Thông tin chung" để hiển thị thuộc
              tính sản phẩm
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "general"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📝 Thông tin chung
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("attributes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "attributes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                ⚙️ Thuộc tính sản phẩm
                {formData.specifications.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formData.specifications.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "general" && renderGeneralTab()}
          {activeTab === "attributes" && renderAttributesTab()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button type="submit">
            {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

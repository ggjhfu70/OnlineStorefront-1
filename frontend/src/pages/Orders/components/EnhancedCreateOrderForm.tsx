import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  EnhancedOrder,
  EnhancedCustomer,
  EnhancedPromotion,
  Customer,
  Product,
  ProductVariant,
} from "../../../types";
import Button from "../../../components/ui/Button";
import {
  Search,
  Plus,
  Trash2,
  User,
  ShoppingCart,
  Package,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  mockCustomers,
  mockProducts,
  mockPromotions,
  mockUsers,
} from "../../../data/centralizedMockData";

interface EnhancedCreateOrderFormProps {
  onSubmit: (order: Partial<EnhancedOrder>) => void;
  onCancel: () => void;
  initialOrder?: EnhancedOrder | null;
  mode?: "create" | "view" | "edit";
}

// Định nghĩa loại khuyến mãi trên từng sản phẩm
export interface ItemLevelDiscount {
  id: string; // ID để quản lý trong state
  type: "fixed" | "percentage";
  value: number;
  description: string;
}

// Định nghĩa loại khuyến mãi toàn đơn hàng
export interface OrderLevelDiscount {
  id: string;
  type: "fixed" | "percentage" | "free_shipping";
  value: number;
  description: string;
}

// Interface OrderItem được cập nhật
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number; // Giá cuối cùng sau khi áp dụng tất cả khuyến mãi
  subtotal: number; // Giá ban đầu trước khuyến mãi
  discounts: ItemLevelDiscount[];
  variantId?: string;
  packaging?: {
    unit: string;
    quantity: number;
  };
  totalProducts?: number;
}

// Hàm tiện ích để tính toán giá cuối cùng của một sản phẩm
const calculateItemFinalPrice = (
  basePrice: number,
  quantity: number,
  discounts: ItemLevelDiscount[],
): number => {
  let currentPrice = basePrice * quantity;

  const totalFixedDiscount = discounts
    .filter((d) => d.type === "fixed")
    .reduce((sum, d) => sum + d.value, 0);
  currentPrice -= totalFixedDiscount;

  const totalPercentageRate = discounts
    .filter((d) => d.type === "percentage")
    .reduce((sum, d) => sum + d.value, 0);

  if (totalPercentageRate > 0) {
    currentPrice -= currentPrice * (totalPercentageRate / 100);
  }

  return Math.max(0, currentPrice);
};

const EnhancedCreateOrderForm: React.FC<EnhancedCreateOrderFormProps> = ({
  onSubmit,
  onCancel,
  initialOrder = null,
  mode = "create",
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"order" | "customer">("order");
  const [customer, setCustomer] = useState<EnhancedCustomer | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [appliedPromotion, setAppliedPromotion] =
    useState<EnhancedPromotion | null>(null);
  const [promotionType, setPromotionType] = useState<
    "percentage" | "fixed_amount" | "buy_x_get_y" | "free_shipping" | ""
  >("");

  const [shippingFee, setShippingFee] = useState(0);
  const [shippingCurrency, setShippingCurrency] = useState("VND");
  const [marketingCost, setMarketingCost] = useState(0);
  const [costCurrency, setCostCurrency] = useState("VND");

  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedPackaging, setSelectedPackaging] = useState<{
    id: string;
    unit: string;
    quantity: number;
  } | null>(null);
  const [stockInfo, setStockInfo] = useState<{
    available: number;
    reserved: number;
  } | null>(null);
  const [stockLoading, setStockLoading] = useState(false);

  // State để quản lý các dòng khuyến mãi của sản phẩm đang được chọn
  const [itemDiscounts, setItemDiscounts] = useState<ItemLevelDiscount[]>([]);

  // State để quản lý khuyến mãi toàn đơn hàng
  const [orderDiscounts, setOrderDiscounts] = useState<OrderLevelDiscount[]>(
    [],
  );

  // Dữ liệu mock
  const currencies = [
    { value: "VND", label: "VND - Việt Nam Đồng" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "CNY", label: "CNY - Nhân dân tệ" },
    { value: "THB", label: "THB - Bạt Thái" },
  ];

  const updateCustomerFromForm = () => {
    if (!customerForm.name.trim() || !customerForm.phone.trim()) return;
    const newCustomer: EnhancedCustomer = {
      id: Date.now().toString(),
      name: customerForm.name,
      phone: customerForm.phone,
      email: customerForm.email || undefined,
      address: customerForm.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomer(newCustomer);
  };

  // Load dữ liệu từ initialOrder khi có
  useEffect(() => {
    if (initialOrder && (mode === "view" || mode === "edit")) {
      // Load customer data
      if (initialOrder.customer) {
        setCustomer(initialOrder.customer);
        setCustomerForm({
          name: initialOrder.customer.name || "",
          phone: initialOrder.customer.phone || "",
          email: initialOrder.customer.email || "",
          address: initialOrder.customer.address || "",
        });
      }

      // Load order items
      if (initialOrder.items) {
        const formattedItems: OrderItem[] = initialOrder.items.map((item) => ({
          id: item.id || Date.now().toString(),
          productId: item.productId || "",
          productName: item.productName || "",
          sku: item.sku || "",
          quantity: item.quantity || 1,
          price: item.price || 0,
          total: item.total || 0,
          subtotal: item.subtotal || item.price || 0,
          discounts: [],
        }));
        setItems(formattedItems);
      }

      // Load other order data
      setNotes(initialOrder.notes || "");
      setShippingFee(initialOrder.shippingFee || 0);
    }
  }, [initialOrder, mode]);

  React.useEffect(() => {
    if (customerForm.name.trim() && customerForm.phone.trim()) {
      updateCustomerFromForm();
    }
  }, [customerForm]);

  const checkStock = async (productId: string, variantId?: string) => {
    setStockLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (variantId) {
        const product = mockProducts.find((p) => p.id === productId);
        const variant = product?.variants?.find((v) => v.id === variantId);
        if (variant) {
          setStockInfo({
            available: variant.stock || 0,
            reserved: Math.floor((variant.stock || 0) * 0.1),
          });
        }
      } else {
        setStockInfo({ available: 100, reserved: 10 });
      }
    } catch (error) {
      console.error("Failed to check stock:", error);
      setStockInfo({ available: 0, reserved: 0 });
    } finally {
      setStockLoading(false);
    }
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setSelectedPackaging(null);
    setStockInfo(null);
    setItemDiscounts([]);

    if (!product.variants || product.variants.length === 0) {
      checkStock(product.id);
    }
  };

  const selectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedPackaging(null);
    checkStock(selectedProduct!.id, variant.id);
  };

  const handleAddDiscountField = () => {
    setItemDiscounts([
      ...itemDiscounts,
      { id: Date.now().toString(), type: "fixed", value: 0, description: "" },
    ]);
  };

  const handleRemoveDiscountField = (id: string) => {
    setItemDiscounts(itemDiscounts.filter((d) => d.id !== id));
  };

  const handleDiscountChange = (
    id: string,
    field: keyof Omit<ItemLevelDiscount, "id">,
    value: string | number,
  ) => {
    setItemDiscounts(
      itemDiscounts.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    );
  };

  // Functions for order-level discounts
  const handleAddOrderDiscountField = () => {
    setOrderDiscounts([
      ...orderDiscounts,
      { id: Date.now().toString(), type: "fixed", value: 0, description: "" },
    ]);
  };

  const handleRemoveOrderDiscountField = (id: string) => {
    setOrderDiscounts(orderDiscounts.filter((d) => d.id !== id));
  };

  const handleOrderDiscountChange = (
    id: string,
    field: keyof Omit<OrderLevelDiscount, "id">,
    value: string | number,
  ) => {
    setOrderDiscounts(
      orderDiscounts.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    );
  };

  const addProductToOrder = () => {
    if (!selectedProduct) return;

    const effectivePrice = selectedVariant?.price || selectedProduct.price || 0;
    const effectiveSku = selectedVariant?.sku || selectedProduct.sku;
    const effectiveName = selectedVariant
      ? `${selectedProduct.name} - ${selectedVariant.name}`
      : selectedProduct.name;

    const defaultQuantity = 1;
    const packagingQuantity = selectedPackaging
      ? selectedPackaging.quantity
      : 1;
    const totalProducts = defaultQuantity * packagingQuantity;

    const finalDiscounts = itemDiscounts.filter(
      (d) => d.value > 0 && d.description.trim() !== "",
    );

    const subtotal = effectivePrice * totalProducts;
    const finalTotal = calculateItemFinalPrice(
      effectivePrice,
      totalProducts,
      finalDiscounts,
    );

    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: effectiveName,
      sku: effectiveSku,
      quantity: defaultQuantity,
      price: effectivePrice,
      subtotal: subtotal,
      total: finalTotal,
      discounts: finalDiscounts,
      variantId: selectedVariant?.id,
      packaging: selectedPackaging
        ? {
            unit: selectedPackaging.unit,
            quantity: selectedPackaging.quantity,
          }
        : undefined,
      totalProducts: totalProducts,
    };

    setItems([...items, newItem]);

    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedPackaging(null);
    setStockInfo(null);
    setProductSearch("");
    setItemDiscounts([]);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const packagingQuantity = item.packaging
            ? item.packaging.quantity
            : 1;
          const totalProducts = quantity * packagingQuantity;
          const subtotal = totalProducts * item.price;
          const finalTotal = calculateItemFinalPrice(
            item.price,
            totalProducts,
            item.discounts,
          );

          return {
            ...item,
            quantity,
            totalProducts,
            subtotal,
            total: finalTotal,
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.total, 0);

  // Calculate totals by currency including shipping and discounts
  const calculateTotalsByCurrency = () => {
    const totals: {
      [currency: string]: {
        subtotal: number;
        discount: number;
        shipping: number;
        final: number;
        items: OrderItem[];
      };
    } = {};

    // Initialize VND as default
    totals["VND"] = {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      final: 0,
      items: [],
    };

    // Group items by currency (assuming all items are in VND for now)
    items.forEach((item) => {
      const currency = "VND"; // In future, this could come from item.currency
      if (!totals[currency]) {
        totals[currency] = {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          final: 0,
          items: [],
        };
      }
      totals[currency].subtotal += item.total;
      totals[currency].items.push(item);
    });

    // Calculate discounts for each currency
    Object.keys(totals).forEach((currency) => {
      const subtotal = totals[currency].subtotal;
      // Apply order discounts proportionally
      const orderDiscount = calculateOrderDiscount();
      const totalSubtotal = calculateSubtotal();
      const discountRatio = totalSubtotal > 0 ? subtotal / totalSubtotal : 0;
      totals[currency].discount = orderDiscount * discountRatio;
    });

    // Add shipping fee to appropriate currency
    if (
      shippingFee > 0 &&
      !orderDiscounts.some(
        (d) => d.type === "free_shipping" && d.description.trim() !== "",
      )
    ) {
      if (!totals[shippingCurrency]) {
        totals[shippingCurrency] = {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          final: 0,
          items: [],
        };
      }
      totals[shippingCurrency].shipping = shippingFee;
    }

    // Calculate final totals
    Object.keys(totals).forEach((currency) => {
      totals[currency].final = Math.max(
        0,
        totals[currency].subtotal -
          totals[currency].discount +
          totals[currency].shipping,
      );
    });

    // Remove currencies with zero values
    Object.keys(totals).forEach((currency) => {
      if (
        totals[currency].final === 0 &&
        totals[currency].subtotal === 0 &&
        totals[currency].shipping === 0
      ) {
        delete totals[currency];
      }
    });

    return totals;
  };

  const calculateOrderDiscount = () => {
    const subtotal = calculateSubtotal();
    const validOrderDiscounts = orderDiscounts.filter(
      (d) => d.value > 0 && d.description.trim() !== "",
    );

    if (validOrderDiscounts.length === 0) return 0;

    let currentTotal = subtotal;

    // Áp dụng giảm giá trực tiếp trước (ưu tiên)
    const fixedDiscounts = validOrderDiscounts.filter(
      (d) => d.type === "fixed",
    );
    const totalFixedDiscount = fixedDiscounts.reduce(
      (sum, d) => sum + d.value,
      0,
    );
    currentTotal = Math.max(0, currentTotal - totalFixedDiscount);

    // Sau đó áp dụng giảm % (cộng dồn)
    const percentageDiscounts = validOrderDiscounts.filter(
      (d) => d.type === "percentage",
    );
    const totalPercentageRate = percentageDiscounts.reduce(
      (sum, d) => sum + d.value,
      0,
    );
    const percentageDiscount = currentTotal * (totalPercentageRate / 100);

    return totalFixedDiscount + percentageDiscount;
  };

  const getEffectiveShippingFee = () => {
    const hasFreeShipping = orderDiscounts.some(
      (d) => d.type === "free_shipping" && d.description.trim() !== "",
    );

    if (hasFreeShipping) {
      return 0;
    }

    return shippingFee;
  };

  const calculateTotal = () =>
    calculateSubtotal() - calculateOrderDiscount() + getEffectiveShippingFee();

  // Remove old promotion logic since we're using manual discount entry

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || items.length === 0) {
      alert("Vui lòng nhập thông tin khách hàng và thêm sản phẩm");
      return;
    }
    const orderData: Partial<EnhancedOrder> = {
      customer,
      items,
      subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
      discountAmount: calculateOrderDiscount(),
      shippingFee: getEffectiveShippingFee(),
      shippingCurrency: shippingCurrency,
      total: calculateTotal(),
      orderDiscounts: orderDiscounts.filter(
        (d) => d.value > 0 && d.description.trim() !== "",
      ),
      notes: notes.trim() || undefined,
      status: "draft",
      cost: marketingCost,
      currency: costCurrency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(orderData);
  };

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  // Kiểm tra xem có được phép chỉnh sửa không
  const isReadOnly =
    mode === "view" || (mode === "edit" && initialOrder?.status !== "draft");
  const canEdit = mode === "edit" && initialOrder?.status === "draft";

  const TabButton = ({
    tabKey,
    label,
    icon,
  }: {
    tabKey: "order" | "customer";
    label: string;
    icon: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
        activeTab === tabKey
          ? "border-blue-500 text-blue-600 bg-blue-50"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <TabButton
            tabKey="order"
            label="Thông tin đơn hàng"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <TabButton
            tabKey="customer"
            label="Thông tin khách hàng"
            icon={<User className="h-4 w-4" />}
          />
        </nav>
      </div>

      {activeTab === "order" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin khách hàng
            </h3>
            {customer ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900">{customer.name}</h4>
                <p className="text-sm text-green-700">SĐT: {customer.phone}</p>
                {customer.email && (
                  <p className="text-sm text-green-700">
                    Email: {customer.email}
                  </p>
                )}
                {customer.address && (
                  <p className="text-sm text-green-700">
                    Địa chỉ: {customer.address}
                  </p>
                )}
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("customer")}
                    className="mt-2"
                  >
                    Sửa thông tin khách hàng
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Vui lòng chuyển sang tab "Thông tin khách hàng" để nhập thông
                  tin.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("customer")}
                  className="mt-2"
                >
                  Nhập thông tin khách hàng
                </Button>
              </div>
            )}
          </div>

          {!isReadOnly && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chọn sản phẩm
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm sản phẩm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm hoặc SKU..."
                  />
                </div>
              </div>
            </div>
          )}

          {!isReadOnly && productSearch && (
            <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedProduct?.id === product.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => selectProduct(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {(product.price || 0).toLocaleString("vi-VN")}{" "}
                        {product.currency || "VND"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {product.variants && product.variants.length > 0
                          ? `${product.variants.length} biến thể`
                          : "Không có biến thể"}
                      </p>
                      {product.packaging && product.packaging.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {product.packaging.length} kiểu đóng gói
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isReadOnly && selectedProduct && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Sản phẩm đã chọn: {selectedProduct.name}
              </h4>

              {selectedProduct.variants &&
                selectedProduct.variants.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn biến thể:
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {selectedProduct.variants
                        .sort((a, b) => {
                          // Sắp xếp biến thể mặc định lên đầu
                          if (a.isDefault && !b.isDefault) return -1;
                          if (!a.isDefault && b.isDefault) return 1;
                          return 0;
                        })
                        .map((variant) => (
                          <button
                            key={variant.id}
                            className={`w-full p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedVariant?.id === variant.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => selectVariant(variant)}
                          >
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">
                                  {variant.name}
                                </p>
                                {variant.isDefault && (
                                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                SKU: {variant.sku}
                              </p>
                              <p className="text-sm text-blue-600">
                                {(variant.price || 0).toLocaleString("vi-VN")} ₫
                              </p>
                              <p className="text-xs text-gray-500">
                                Tồn kho: {variant.stock}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

              {/* Packaging Selection - Always show for all products */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn kiểu đóng gói
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Default single item option */}
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${!selectedPackaging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                    onClick={() => setSelectedPackaging(null)}
                  >
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Lẻ</p>
                        <p className="text-xs text-gray-500">1 sản phẩm</p>
                      </div>
                    </div>
                  </div>

                  {/* Custom packaging options if available */}
                  {selectedProduct.packaging &&
                    selectedProduct.packaging.length > 0 &&
                    selectedProduct.packaging.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPackaging?.id === pkg.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => setSelectedPackaging(pkg)}
                      >
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{pkg.unit}</p>
                            <p className="text-xs text-gray-500">
                              {pkg.quantity} sản phẩm
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Show current selection info */}
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Đã chọn:</strong>{" "}
                  {selectedPackaging
                    ? `${selectedPackaging.unit} (${selectedPackaging.quantity} sản phẩm)`
                    : "Lẻ (1 sản phẩm)"}
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Khuyến mãi cho sản phẩm này
                </h5>
                {itemDiscounts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Chưa có khuyến mãi nào được thêm.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {itemDiscounts.map((discount) => (
                      <div
                        key={discount.id}
                        className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-md"
                      >
                        <div className="col-span-5">
                          <label className="text-xs text-gray-600">
                            Mô tả KM
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Giảm giá nhân viên"
                            value={discount.description}
                            onChange={(e) =>
                              handleDiscountChange(
                                discount.id,
                                "description",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-gray-600">
                            Loại khuyến mãi
                          </label>
                          <select
                            value={discount.type}
                            onChange={(e) =>
                              handleDiscountChange(
                                discount.id,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="fixed">Giảm giá trực tiếp</option>
                            <option value="percentage">
                              Giảm theo phần trăm
                            </option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-gray-600">
                            Giá trị (
                            {discount.type === "percentage" ? "%" : "₫"})
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder={`Nhập ${discount.type === "percentage" ? "%" : "số tiền"}`}
                            value={discount.value}
                            onChange={(e) =>
                              handleDiscountChange(
                                discount.id,
                                "value",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveDiscountField(discount.id)
                            }
                            className="text-red-500 hover:text-red-700 p-1 mt-4"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDiscountField}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" /> Thêm dòng khuyến mãi
                </Button>
              </div>

              {(selectedVariant ||
                !selectedProduct.variants ||
                selectedProduct.variants.length === 0) && (
                <div className="my-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Thông tin tồn kho
                  </h5>
                  {stockLoading ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>{" "}
                      Đang kiểm tra...
                    </div>
                  ) : stockInfo ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Có thể bán</p>
                          <p className="text-sm font-semibold text-green-600">
                            {(
                              stockInfo.available - stockInfo.reserved
                            ).toLocaleString()}{" "}
                            sp
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tổng tồn</p>
                          <p className="text-sm font-semibold text-blue-600">
                            {stockInfo.available.toLocaleString()} sp
                          </p>
                        </div>
                      </div>
                      {stockInfo.reserved > 0 && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                          {stockInfo.reserved} sản phẩm đang được đặt trước
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              <Button
                type="button"
                onClick={addProductToOrder}
                disabled={
                  (selectedProduct.variants &&
                    selectedProduct.variants.length > 0 &&
                    !selectedVariant) ||
                  (stockInfo && stockInfo.available - stockInfo.reserved <= 0)
                }
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm vào đơn hàng
                {selectedPackaging
                  ? ` (1 ${selectedPackaging.unit} = ${selectedPackaging.quantity} sp)`
                  : " (1 sp)"}
              </Button>
            </div>
          )}

          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sản phẩm trong đơn hàng
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sản phẩm & KM
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Đơn giá
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      const hasItemDiscount = item.discounts.length > 0;
                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-3 align-top">
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-500">
                                SKU: {item.sku}
                              </p>
                              {hasItemDiscount && (
                                <div className="mt-2 space-y-1">
                                  {item.discounts.map((d) => (
                                    <p
                                      key={d.id}
                                      className="text-xs text-green-700 pl-2"
                                    >
                                      - {d.description}:{" "}
                                      {d.value.toLocaleString("vi-VN")}
                                      {d.type === "percentage" ? "%" : " ₫"}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-right align-top text-gray-900">
                            {item.price.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-4 py-3 text-right align-top font-medium text-gray-900">
                            {hasItemDiscount && (
                              <p className="text-xs text-gray-500 line-through">
                                {item.subtotal.toLocaleString("vi-VN")} ₫
                              </p>
                            )}
                            <p>{item.total.toLocaleString("vi-VN")} ₫</p>
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Khuyến mãi toàn đơn hàng
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              {orderDiscounts.length === 0 ? (
                <p className="text-sm text-gray-500 mb-3">
                  Chưa có khuyến mãi nào được thêm cho đơn hàng.
                </p>
              ) : (
                <div className="space-y-3 mb-4">
                  {orderDiscounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-md"
                    >
                      <div className="col-span-5">
                        <label className="text-xs text-gray-600">
                          Mô tả khuyến mãi
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Khuyến mãi Black Friday"
                          value={discount.description}
                          onChange={(e) =>
                            handleOrderDiscountChange(
                              discount.id,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-gray-600">
                          Loại khuyến mãi
                        </label>
                        <select
                          value={discount.type}
                          onChange={(e) =>
                            handleOrderDiscountChange(
                              discount.id,
                              "type",
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="fixed">Giảm giá trực tiếp</option>
                          <option value="percentage">
                            Giảm theo phần trăm
                          </option>
                          <option value="free_shipping">
                            Miễn phí vận chuyển
                          </option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-gray-600">
                          Giá trị{" "}
                          {discount.type === "free_shipping"
                            ? ""
                            : `(${discount.type === "percentage" ? "%" : "₫"})`}
                        </label>
                        {discount.type === "free_shipping" ? (
                          <div className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-green-50 text-green-700 text-center">
                            Miễn phí vận chuyển
                          </div>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            placeholder={`Nhập ${discount.type === "percentage" ? "%" : "số tiền"}`}
                            value={discount.value}
                            onChange={(e) =>
                              handleOrderDiscountChange(
                                discount.id,
                                "value",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </div>
                      <div className="col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveOrderDiscountField(discount.id)
                          }
                          className="text-red-500 hover:text-red-700 p-1 mt-4"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOrderDiscountField}
              >
                <Plus className="h-4 w-4 mr-2" /> Thêm khuyến mãi đơn hàng
              </Button>

              {orderDiscounts.length > 0 && calculateOrderDiscount() > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Tổng khuyến mãi áp dụng
                  </h4>
                  <div className="space-y-1 text-sm">
                    {orderDiscounts
                      .filter((d) => d.value > 0 && d.description.trim() !== "")
                      .map((d) => (
                        <p key={d.id} className="text-green-700">
                          - {d.description}:{" "}
                          {d.type === "free_shipping"
                            ? "Miễn phí vận chuyển"
                            : `${d.value.toLocaleString("vi-VN")}${d.type === "percentage" ? "%" : " ₫"}`}
                        </p>
                      ))}
                    <div className="pt-2 border-t border-green-300">
                      <p className="font-semibold text-green-800">
                        Tổng giảm:{" "}
                        {calculateOrderDiscount().toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!orderDiscounts.some(
            (d) => d.type === "free_shipping" && d.description.trim() !== "",
          ) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Phí vận chuyển
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phí ship
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={shippingFee}
                      onChange={(e) =>
                        setShippingFee(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập phí vận chuyển"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn vị tiền tệ
                    </label>
                    <select
                      value={shippingCurrency}
                      onChange={(e) => setShippingCurrency(e.target.value)}
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
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chi phí Marketing
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-700 mb-3">
                Chi phí bỏ ra để có được đơn hàng này (quảng cáo, marketing, hoa
                hồng...)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi phí Marketing
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={marketingCost}
                    onChange={(e) =>
                      setMarketingCost(parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập chi phí marketing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiền tệ
                  </label>
                  <select
                    value={costCurrency}
                    onChange={(e) => setCostCurrency(e.target.value)}
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
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Tổng kết đơn hàng
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-blue-700 mb-3">
                    Giá trị đơn hàng theo tiền tệ
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(calculateTotalsByCurrency()).map(
                      ([currency, data]) => {
                        const currencyInfo = currencies.find(
                          (c) => c.value === currency,
                        );
                        const symbol =
                          currency === "VND"
                            ? "₫"
                            : currency === "USD"
                              ? "$"
                              : currency === "CNY"
                                ? "¥"
                                : currency === "THB"
                                  ? "฿"
                                  : currency;

                        return (
                          <div
                            key={currency}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                          >
                            <div className="font-semibold text-gray-800 mb-2 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {currencyInfo?.label || currency}
                            </div>
                            <div className="space-y-1 text-sm">
                              {data.subtotal > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Tổng sản phẩm:
                                  </span>
                                  <span className="font-medium">
                                    {data.subtotal.toLocaleString("vi-VN")}{" "}
                                    {symbol}
                                  </span>
                                </div>
                              )}
                              {data.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Giảm giá:</span>
                                  <span>
                                    -{data.discount.toLocaleString("vi-VN")}{" "}
                                    {symbol}
                                  </span>
                                </div>
                              )}
                              {data.shipping > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Phí ship:
                                  </span>
                                  <span>
                                    {data.shipping.toLocaleString("vi-VN")}{" "}
                                    {symbol}
                                  </span>
                                </div>
                              )}
                              <div className="border-t border-gray-300 pt-1 flex justify-between font-bold text-blue-700">
                                <span>Tổng cộng:</span>
                                <span>
                                  {data.final.toLocaleString("vi-VN")} {symbol}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}

                    {/* Summary of all discounts */}
                    {orderDiscounts.filter(
                      (d) => d.value > 0 && d.description.trim() !== "",
                    ).length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">
                          Chi tiết khuyến mãi
                        </h5>
                        <div className="space-y-1 text-sm">
                          {orderDiscounts
                            .filter(
                              (d) => d.value > 0 && d.description.trim() !== "",
                            )
                            .map((d) => (
                              <p key={d.id} className="text-green-700">
                                - {d.description}:{" "}
                                {d.type === "free_shipping"
                                  ? "Miễn phí vận chuyển"
                                  : `${d.value.toLocaleString("vi-VN")}${d.type === "percentage" ? "%" : " ₫"}`}
                              </p>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-300">
                  <h4 className="font-semibold text-orange-700 mb-3">
                    Chi phí Marketing
                  </h4>
                  <div className="space-y-2">
                    {marketingCost > 0 ? (
                      <div className="p-2 bg-orange-50 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Chi phí Marketing:
                          </span>
                          <span className="font-bold text-orange-700 text-lg">
                            {marketingCost.toLocaleString("vi-VN")}{" "}
                            {costCurrency}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Chưa có chi phí marketing
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {marketingCost > 0 && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                  <h5 className="font-semibold text-green-700 mb-2">
                    Phân tích lợi nhuận (ước tính)
                  </h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Doanh thu:</span>
                      <span className="text-green-600">
                        +{calculateTotal().toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chi phí marketing:</span>
                      <span className="text-red-600">
                        -{marketingCost.toLocaleString("vi-VN")} {costCurrency}
                      </span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-medium">
                      <span>Lợi nhuận thô:</span>
                      <span
                        className={
                          calculateTotal() - marketingCost > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {(calculateTotal() - marketingCost).toLocaleString(
                          "vi-VN",
                        )}{" "}
                        ₫
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              {mode === "view" ? "Đóng" : "Hủy"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" disabled={!customer || items.length === 0}>
                {mode === "edit" ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}
              </Button>
            )}
          </div>
        </form>
      )}

      {activeTab === "customer" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Thông tin khách hàng
            </h3>
            <p className="text-sm text-blue-700">
              Thông tin khách hàng sẽ được tự động gắn vào đơn hàng.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, name: e.target.value })
                  }
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, phone: e.target.value })
                  }
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, email: e.target.value })
                  }
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập email (không bắt buộc)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  rows={3}
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập địa chỉ khách hàng"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => setActiveTab("order")}
                className="w-full"
              >
                Quay về đơn hàng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCreateOrderForm;

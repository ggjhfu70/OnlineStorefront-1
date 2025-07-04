import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { useProducts } from '../../../hooks/useProducts';
import { PurchaseOrder } from '../../../types';
import Button from "../../../components/ui/Button";
import { Plus, Trash2, Search, Package, Building2, X } from 'lucide-react';

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (purchaseOrder: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CURRENCIES = [
  { code: 'VND', symbol: '₫', name: 'Việt Nam Đồng' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Nhân dân tệ' },
  { code: 'THB', symbol: '฿', name: 'Bạt Thái' }
];

interface SupplierItem {
  id: string;
  supplierId?: string;
  supplierName: string;
  isNew: boolean;
}

interface ProductItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  costPrice: number;
  currency: string;
  isNew: boolean;
  variantId?: string | null;
  sku?: string;
}

interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
  currency: string;
  notes: string;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ purchaseOrder, mode, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const { suppliers } = useSuppliers();
  const { products } = useProducts();

  const [formData, setFormData] = useState({
    poNumber: purchaseOrder?.poNumber || '',
    notes: purchaseOrder?.notes || ''
  });

  const [supplierItems, setSupplierItems] = useState<SupplierItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);

  // Initialize form data when in edit/view mode
  useEffect(() => {
    if (purchaseOrder && (mode === 'edit' || mode === 'view')) {
      // Initialize supplier
      if (purchaseOrder.supplier) {
        setSupplierItems([{
          id: 'existing-supplier',
          supplierId: purchaseOrder.supplier.id,
          supplierName: purchaseOrder.supplier.name,
          isNew: false
        }]);
      }

      // Initialize products
      const initialProducts = purchaseOrder.items.map(item => ({
        id: item.id,
        productId: item.product?.id,
        productName: item.productName,
        quantity: item.quantity,
        costPrice: item.costPrice,
        currency: 'VND', // Default currency, you might want to store this in the item
        isNew: !item.product?.id
      }));
      setProductItems(initialProducts);

      // Additional costs would need to be stored in PurchaseOrder type
      // For now, keeping empty as the current type doesn't include additional costs
    }
  }, [purchaseOrder, mode]);

  // Product search states
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  useEffect(() => {
    if (productSearch && showProductSearch) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 10));
    } else {
      setFilteredProducts([]);
    }
  }, [productSearch, products, showProductSearch]);

  // Mock function to get product variants - replace with actual API call
  const getProductVariants = async (productId: string) => {
    // This would be replaced with actual backend call
    const product = products.find(p => p.id === productId);
    if (!product) return [];

    // Mock variants - replace with actual API response
    const mockVariants = [
      {
        id: 'no-variant',
        name: 'Không có biến thể',
        attributes: {},
        price: product.price || 0,
        cost: product.cost || 0,
        sku: product.sku
      }
    ];

    // Add actual variants if product has them
    if (product.variants && product.variants.length > 0) {
      const variants = product.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        attributes: variant.attributes || {},
        price: variant.price || product.price || 0,
        cost: variant.cost || product.cost || 0,
        sku: variant.sku || `${product.sku}-${variant.id}`
      }));
      mockVariants.push(...variants);
    }

    return mockVariants;
  };

  useEffect(() => {
    if (!formData.poNumber && !purchaseOrder) {
      const poNumber = `PN-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, poNumber }));
    }
  }, []);

  // Custom checkbox component
  const CustomCheckbox = ({ checked, onChange, label, icon: Icon }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
          checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-gray-300 hover:border-blue-400 group-hover:border-blue-400'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-gray-600" />}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </label>
  );

  // Supplier management
  const addSupplierItem = () => {
    const newSupplier: SupplierItem = {
      id: Math.random().toString(36).substr(2, 9),
      supplierName: '',
      isNew: true
    };
    setSupplierItems([...supplierItems, newSupplier]);
  };

  const updateSupplierItem = (index: number, field: keyof SupplierItem, value: any) => {
    const updatedItems = [...supplierItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'supplierId' && value) {
      const supplier = suppliers.find(s => s.id === value);
      if (supplier) {
        updatedItems[index].supplierName = supplier.name;
        updatedItems[index].isNew = false;
      }
    }

    setSupplierItems(updatedItems);
  };

  const removeSupplierItem = (index: number) => {
    setSupplierItems(supplierItems.filter((_, i) => i !== index));
  };

  // Product management

  const selectProduct = async (product: any) => {
    setSelectedProduct(product);
    setProductSearch('');
    setFilteredProducts([]);
    setShowProductSearch(false);
    
    // Get product variants
    const variants = await getProductVariants(product.id);
    setProductVariants(variants);
    
    // Auto-select all variants by default
    setSelectedVariantIds(variants.map(v => v.id));
    setShowVariants(true);
  };

  const addSelectedVariants = (selectedVariantIds: string[]) => {
    const newProducts: ProductItem[] = selectedVariantIds.map(variantId => {
      const variant = productVariants.find(v => v.id === variantId);
      if (!variant) return null;

      return {
        id: Math.random().toString(36).substr(2, 9),
        productId: selectedProduct?.id,
        productName: variant.name === 'Không có biến thể' 
          ? selectedProduct?.name 
          : `${selectedProduct?.name} - ${variant.name}`,
        quantity: 1,
        costPrice: variant.cost || 0,
        currency: 'VND',
        isNew: false,
        variantId: variant.id === 'no-variant' ? null : variant.id,
        sku: variant.sku
      };
    }).filter(Boolean) as ProductItem[];

    setProductItems([...productItems, ...newProducts]);
    
    // Reset all states
    setShowVariants(false);
    setSelectedProduct(null);
    setProductVariants([]);
    setSelectedVariantIds([]);
    setProductSearch('');
    setFilteredProducts([]);
    setShowProductSearch(false);
  };

  const updateProductItem = (index: number, field: keyof ProductItem, value: any) => {
    const updatedProducts = [...productItems];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProductItems(updatedProducts);
  };

  const removeProductItem = (index: number) => {
    setProductItems(productItems.filter((_, i) => i !== index));
  };

  // Additional costs management
  const addAdditionalCost = () => {
    const newCost: AdditionalCost = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: 0,
      currency: 'VND',
      notes: ''
    };
    setAdditionalCosts([...additionalCosts, newCost]);
  };

  const updateAdditionalCost = (index: number, field: keyof AdditionalCost, value: any) => {
    const updatedCosts = [...additionalCosts];
    updatedCosts[index] = { ...updatedCosts[index], [field]: value };
    setAdditionalCosts(updatedCosts);
  };

  const removeAdditionalCost = (index: number) => {
    setAdditionalCosts(additionalCosts.filter((_, i) => i !== index));
  };

  // Calculate totals by currency
  const calculateTotals = () => {
    const productTotals: { [currency: string]: number } = {};
    const additionalTotals: { [currency: string]: number } = {};
    const grandTotals: { [currency: string]: number } = {};

    // Calculate product totals
    productItems.forEach(product => {
      const total = product.quantity * product.costPrice;
      productTotals[product.currency] = (productTotals[product.currency] || 0) + total;
      grandTotals[product.currency] = (grandTotals[product.currency] || 0) + total;
    });

    // Calculate additional cost totals
    additionalCosts.forEach(cost => {
      additionalTotals[cost.currency] = (additionalTotals[cost.currency] || 0) + cost.amount;
      grandTotals[cost.currency] = (grandTotals[cost.currency] || 0) + cost.amount;
    });

    return { productTotals, additionalTotals, grandTotals };
  };

  const getCurrencySymbol = (currencyCode: string) => {
    return CURRENCIES.find(c => c.code === currencyCode)?.symbol || currencyCode;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${getCurrencySymbol(currency)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allItems = productItems.map(product => ({
      id: product.id,
      productName: product.productName,
      sku: `AUTO-${product.id.slice(0, 6)}`,
      quantity: product.quantity,
      costPrice: product.costPrice,
      receivedQuantity: 0,
      product: product.productId ? { id: product.productId } : undefined
    }));

    const totals = calculateTotals();
    const totalCost = Object.values(totals.grandTotals).reduce((sum, amount) => sum + amount, 0);

    const purchaseOrderData = {
      ...formData,
      supplier: supplierItems[0] ? {
        id: supplierItems[0].supplierId || `manual-${Date.now()}`,
        name: supplierItems[0].supplierName,
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        paymentTerms: '',
        notes: '',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : null,
      items: allItems,
      totalCost,
      status: 'draft' as const,
      orderDate: new Date().toISOString(),
      createdBy: 'current-user-id'
    };

    onSubmit(purchaseOrderData);
  };

  const { productTotals, additionalTotals, grandTotals } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số phiếu nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.poNumber}
              onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="PN-000001"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú chung
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ghi chú về phiếu nhập kho..."
              disabled={mode === 'view'}
            />
          </div>
        </div>
      </div>

      {/* Suppliers Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Nhà cung cấp</span>
          </h3>
          {mode !== 'view' && (
            <Button
              type="button"
              onClick={addSupplierItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm nhà cung cấp</span>
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {supplierItems.map((supplierItem, index) => (
            <div key={supplierItem.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-800">Nhà cung cấp #{index + 1}</h4>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeSupplierItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-6">
                  <CustomCheckbox
                    checked={!supplierItem.isNew}
                    onChange={(e) => updateSupplierItem(index, 'isNew', !e.target.checked)}
                    label="Chọn nhà cung cấp có sẵn"
                    icon={Building2}
                  />
                  <CustomCheckbox
                    checked={supplierItem.isNew}
                    onChange={(e) => updateSupplierItem(index, 'isNew', e.target.checked)}
                    label="Thêm nhà cung cấp mới"
                    icon={Plus}
                  />
                </div>

                {!supplierItem.isNew ? (
                  <select
                    value={supplierItem.supplierId || ''}
                    onChange={(e) => updateSupplierItem(index, 'supplierId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={supplierItem.supplierName}
                    onChange={(e) => updateSupplierItem(index, 'supplierName', e.target.value)}
                    placeholder="Tên nhà cung cấp mới"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <span>Sản phẩm</span>
          </h3>
          {mode !== 'view' && (
            <Button
              type="button"
              onClick={() => setShowProductSearch(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Thêm sản phẩm</span>
            </Button>
          )}
        </div>

        {/* Product Search */}
        {showProductSearch && (
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm sản phẩm có sẵn..."
              autoFocus
            />

            {filteredProducts.length > 0 && !showVariants && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{product.cost?.toLocaleString() || 0} ₫</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Variants Modal - Show as overlay when variants are being selected */}
        {showVariants && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Chọn biến thể cho: {selectedProduct.name}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVariants(false);
                      setSelectedProduct(null);
                      setProductVariants([]);
                      setSelectedVariantIds([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedVariantIds(productVariants.map(v => v.id))}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVariantIds([])}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {productVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`variant-${variant.id}`}
                          checked={selectedVariantIds.includes(variant.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVariantIds([...selectedVariantIds, variant.id]);
                            } else {
                              setSelectedVariantIds(selectedVariantIds.filter(id => id !== variant.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`variant-${variant.id}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{variant.name}</p>
                              {variant.id !== 'no-variant' && variant.attributes && Object.keys(variant.attributes).length > 0 && (
                                <p className="text-sm text-gray-500">
                                  {Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                </p>
                              )}
                              <p className="text-xs text-gray-400">SKU: {variant.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{variant.cost?.toLocaleString() || 0} ₫</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Đã chọn: {selectedVariantIds.length}/{productVariants.length} biến thể
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVariants(false);
                        setSelectedProduct(null);
                        setProductVariants([]);
                        setSelectedVariantIds([]);
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedVariantIds.length > 0) {
                          addSelectedVariants(selectedVariantIds);
                        }
                      }}
                      disabled={selectedVariantIds.length === 0}
                      className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Thêm {selectedVariantIds.length} biến thể
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-3">
          {productItems.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex-1">
                <div>
                  <p className="font-medium text-gray-900">{product.productName}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Số lượng:</label>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => updateProductItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Đơn giá:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.costPrice}
                  className="w-24 px-2 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>

              <select
                value={product.currency}
                className="w-16 px-1 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol}
                  </option>
                ))}
              </select>

              <div className="text-right min-w-[100px]">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.quantity * product.costPrice, product.currency)}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => removeProductItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Costs */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chi phí phụ</h3>
          {mode !== 'view' && (
            <Button
              type="button"
              onClick={addAdditionalCost}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm chi phí</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {additionalCosts.map((cost, index) => (
            <div key={cost.id} className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tên chi phí (vd: Vận chuyển, Thuế...)"
                  value={cost.name}
                  onChange={(e) => updateAdditionalCost(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Số tiền"
                  value={cost.amount}
                  onChange={(e) => updateAdditionalCost(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={cost.currency}
                  onChange={(e) => updateAdditionalCost(index, 'currency', e.target.value)}
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={cost.notes}
                  onChange={(e) => updateAdditionalCost(index, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => removeAdditionalCost(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Total Summary */}
      {(productItems.length > 0 || additionalCosts.length > 0) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Tổng kết chi phí</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Costs */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Chi phí hàng hóa
              </h4>
              {Object.keys(productTotals).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(productTotals).map(([currency, total]) => (
                    <div key={currency} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{CURRENCIES.find(c => c.code === currency)?.name}</span>
                      <span className="font-semibold text-green-600">{formatCurrency(total, currency)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có sản phẩm</p>
              )}
            </div>

            {/* Additional Costs */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-orange-700 mb-3">Chi phí phụ</h4>
              {Object.keys(additionalTotals).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(additionalTotals).map(([currency, total]) => (
                    <div key={currency} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{CURRENCIES.find(c => c.code === currency)?.name}</span>
                      <span className="font-semibold text-orange-600">{formatCurrency(total, currency)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có chi phí phụ</p>
              )}
            </div>

            {/* Grand Total */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-300">
              <h4 className="font-semibold text-blue-700 mb-3">Tổng toàn bộ</h4>
              <div className="space-y-2">
                {Object.entries(grandTotals).map(([currency, total]) => (
                  <div key={currency} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{CURRENCIES.find(c => c.code === currency)?.name}</span>
                    <span className="font-bold text-blue-700 text-lg">{formatCurrency(total, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {mode === 'view' ? 'Đóng' : t('common.cancel')}
        </Button>
        {mode !== 'view' && (
          <Button 
            type="submit" 
            disabled={productItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {mode === 'edit' ? 'Cập nhật phiếu nhập' : 'Tạo phiếu nhập kho'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
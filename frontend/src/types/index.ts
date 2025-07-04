// Enhanced types following ADR principles

export interface ProductType {
  id: string;
  name: string;
  description: string;
  attributeDefinitions: { [key: string]: AttributeDefinition };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeDefinition {
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  variant: boolean; // Whether this attribute creates variants
  options?: string[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent?: Category;
  children: Category[];
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost: number;
  currency: string;
  productType?: ProductType;
  category: string;
  attributes: { [key: string]: any }; // Dynamic attributes based on product type
  specifications: ProductSpecification[]; // Detailed product specifications
  images: string[];
  packaging?: ProductPackaging[]; // Available packaging options
  variants?: ProductVariant[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPackaging {
  id: string;
  unit: string;
  quantity: number;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit?: string; // For numeric values like "cm", "kg", "inch"
  options?: string[]; // For select/multiselect types
  group?: string; // Group specifications like "Kích thước", "Màu sắc", etc.
  displayOrder: number;
  required: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  packaging_info: string;
  unit_multiplier: number;
  attributes: { [key: string]: any }; // Variant-specific attributes
  active: boolean;
  created_at: string;
  updated_at: string;
  isDefault?: boolean; // Đánh dấu biến thể mặc định
}

export interface Bundle {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  currency: string;
  items: BundleItem[];
  calculatedStock?: number; // Calculated dynamically
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BundleItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  warehouse: string;
  location: string;
  lastUpdated: string;
}

export interface EnhancedOrder {
  id: string;
  customer: EnhancedCustomer;
  salesPerson: User;
  status: 'draft' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  promotion?: EnhancedPromotion;
  notes?: string;
  confirmedAt?: string;
  confirmedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  bundleId?: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

// Removed duplicate Customer and Promotion interfaces - using the ones defined earlier

export interface PromotionRule {
  id: string;
  ruleType: 'condition' | 'action';
  ruleData: { [key: string]: any };
  priority: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: Supplier;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: 'draft' | 'ordered' | 'partially_received' | 'completed' | 'cancelled';
  totalCost: number;
  notes?: string;
  createdBy: string;
  items: PurchaseOrderItem[];
  additionalCosts?: AdditionalCost[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  product?: Product;
  variant?: ProductVariant;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  receivedQuantity: number;
}

export interface OrderReturn {
  id: string;
  order: EnhancedOrder;
  returnNumber: string;
  returnDate: string;
  reason: 'damaged' | 'wrong_item' | 'customer_change_mind' | 'quality_issue' | 'other';
  condition: 'new' | 'damaged' | 'used';
  notes?: string;
  processedBy?: string;
  items: OrderReturnItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderReturnItem {
  id: string;
  orderItem: OrderItem;
  product?: Product;
  variant?: ProductVariant;
  quantity: number;
  condition: 'new' | 'damaged' | 'used';
  restock: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockItems: number;
  currency: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'employee';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface EnhancedCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedPromotion {
  id: string;
  name: string;
  description?: string;

  // Phân loại chính
  level: 'product' | 'order';

  // Loại khuyến mãi
  type: 'percentage_discount' | 'fixed_amount_discount' | 'buy_x_get_y' | 'free_shipping' | 'bundle_discount';

  // Giá trị khuyến mãi
  value: number;
  maxDiscountAmount?: number; // Giới hạn số tiền giảm tối đa

  // Điều kiện áp dụng
  conditions: PromotionCondition[];

  // Trạng thái
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;

  // Ưu tiên (số càng cao càng ưu tiên)
  priority: number;

  // Thời gian
  createdAt: string;
  updatedAt: string;
}

export interface PromotionCondition {
  id: string;
  type: 'min_order_amount' | 'product_category' | 'product_brand' | 'customer_type' | 'item_quantity' | 'specific_products';
  operator: '>=' | '>' | '<=' | '<' | '==' | 'in' | 'not_in';
  value: string | number;
  products?: string[]; // Danh sách product IDs
  categories?: string[]; // Danh sách category IDs
}

// Search and filter interfaces
export interface SearchFilters {
  keyword?: string;
  category?: string;
  productType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  attributes?: { [key: string]: any };
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Additional product attribute type
export interface ProductAttribute {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
  unit?: string;
}

// New types for inventory management
export interface InventoryReceipt {
  id: string;
  supplier_name?: string;
  created_by: string;
  updated_by?: string;
  status: 'draft' | 'confirmed' | 'cancelled';
  total_amount: number;
  currency: 'VND' | 'USD' | 'CNY' | 'THB';
  additional_costs: AdditionalCost[];
  notes?: string;
  items: InventoryReceiptItem[];
  created_at: string;
  updated_at: string;
}

export interface InventoryReceiptItem {
  id: string;
  receipt_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_variants?: ProductVariantValue[];
}

export interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
  currency: 'VND' | 'USD' | 'CNY' | 'THB';
  description?: string;
}

export interface ProductVariantValue {
  attribute_key: string;
  attribute_name: string;
  value: string | number | boolean;
  quantity?: number; // chỉ có khi attribute có role = "variant_option"
}
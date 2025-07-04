// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'department_head' | 'team_leader' | 'employee';
  fullName: string;
  department?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  images: string[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  group: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  sku: string;
  stock: number;
  priceAdjustment: number;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Enhanced Order Types
export interface EnhancedOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: EnhancedOrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  promotionCode?: string;
  trackingNumber?: string;
}

export interface EnhancedOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedCustomer extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  segment: 'new' | 'regular' | 'vip';
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string; // Link to specific product variant
  productName: string;
  sku: string;
  totalStock: number; // Tổng số hàng trong kho
  sellableStock: number; // Hàng có thể bán
  damagedStock: number; // Hàng hỏng/hủy
  holdStock: number; // Hàng tạm giữ
  transitStock: number; // Hàng đang vận chuyển
  stockStatus: 'sellable' | 'damaged' | 'hold' | 'transit'; // Trạng thái chính của item này
  warehouse: string;
  warehouseId?: string; // Link to warehouse table
  location: string;
  lastUpdated: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  manager: string;
  active: boolean;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  taxId?: string;
  bankAccount?: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Purchase Order Types
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  createdBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

// Inventory Receipt Types
export interface InventoryReceipt {
  id: string;
  purchaseOrderId?: string;
  supplierId: string;
  supplierName: string;
  items: InventoryReceiptItem[];
  totalAmount: number;
  status: 'draft' | 'completed';
  receiptDate: string;
  createdBy: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryReceiptItem {
  id: string;
  receipt_id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expiryDate?: string;
  batchNumber?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  productGrowth: number;
  lowStockItems: number;
  pendingOrders: number;
}

// User Management Types (Normalized)
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  manager_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  department_id: number;
  leader_id?: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  assigned_at: string;
  assigned_by: number;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  joined_at: string;
  role_in_team: string;
}

export interface UserWithDetails {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  departments: Department[];
  teams: Team[];
}

export interface TeamWithDetails {
  id: number;
  name: string;
  description: string;
  department: Department;
  leader?: UserWithDetails;
  members: UserWithDetails[];
  created_at: string;
  updated_at: string;
}

export interface DepartmentWithDetails {
  id: number;
  name: string;
  description: string;
  manager?: UserWithDetails;
  teams: Team[];
  employee_count: number;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role_ids: number[];
  department_id?: number;
  team_ids?: number[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role_ids?: number[];
  department_id?: number;
  team_ids?: number[];
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  department_id: number;
  leader_id?: number;
  member_ids?: number[];
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  manager_id?: number;
}

// Filter Types
export interface UserFilters {
  search?: string;
  role_id?: number;
  department_id?: number;
  team_id?: number;
  status?: 'active' | 'inactive' | 'suspended';
  created_after?: string;
  created_before?: string;
}

export interface TeamFilters {
  search?: string;
  department_id?: number;
  leader_id?: number;
}

export interface DepartmentFilters {
  search?: string;
  manager_id?: number;
}

// Statistics Types
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  total_teams: number;
  total_departments: number;
  new_users_this_month: number;
  user_growth_rate: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
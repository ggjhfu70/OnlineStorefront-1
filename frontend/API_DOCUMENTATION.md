# Warehouse Management System - API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Product Management](#product-management)
4. [Invoice Management](#invoice-management)
5. [Order Management](#order-management)
6. [Category Management](#category-management)
7. [Supplier Management](#supplier-management)
8. [Customer Management](#customer-management)
9. [Department Management](#department-management)
10. [Team Management](#team-management)
11. [Packaging Type Management](#packaging-type-management)
12. [Variant Management](#variant-management)
13. [Health Check](#health-check)
14. [Error Codes](#error-codes)

---

## Authentication

### Login
**POST** `/api/auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "username": "string (required, min: 3)",
  "password": "string (required, min: 6)"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "tokenType": "Bearer"
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Authentication failed

---

### Register
**POST** `/api/auth/register`

**Description:** Register new user account

**Request Body:**
```json
{
  "username": "string (required, min: 3, max: 50)",
  "password": "string (required, min: 6)",
  "email": "string (required, valid email)",
  "fullName": "string (required)",
  "phone": "string (optional)",
  "role": "ADMIN|MANAGER|EMPLOYEE (default: EMPLOYEE)"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - Username/Email already exists
- `400` - Validation errors

---

## User Management

### Get All Users
**GET** `/api/users`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "id") - Sort field
- `sortDir` (string, default: "asc") - Sort direction (asc/desc)

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "phone": "string",
      "role": "ADMIN|MANAGER|EMPLOYEE",
      "departmentId": "long",
      "teamId": "long",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get User by ID
**GET** `/api/users/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - User ID

**Response (200):**
```json
{
  "id": "long",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "role": "ADMIN|MANAGER|EMPLOYEE",
  "departmentId": "long",
  "teamId": "long",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - User not found
- `403` - Access denied

---

### Search Users
**GET** `/api/users/search`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Users

**Error Responses:**
- `403` - Access denied

---

### Get Users by Role
**GET** `/api/users/role/{role}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `role` (string, required) - User role (ADMIN/MANAGER/EMPLOYEE)

**Response (200):**
```json
[
  {
    "id": "long",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string",
    "role": "ADMIN|MANAGER|EMPLOYEE",
    "departmentId": "long",
    "teamId": "long",
    "isActive": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Update User
**PUT** `/api/users/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - User ID

**Request Body:**
```json
{
  "fullName": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (optional)",
  "role": "ADMIN|MANAGER|EMPLOYEE",
  "departmentId": "long (optional)",
  "teamId": "long (optional)",
  "isActive": "boolean"
}
```

**Response (200):** Same as Get User by ID

**Error Responses:**
- `404` - User not found
- `403` - Access denied
- `400` - Validation errors

---

### Delete User
**DELETE** `/api/users/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - User ID

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404` - User not found
- `403` - Access denied

---

## Product Management

### Get All Products
**GET** `/api/products`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "id") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "sku": "string",
      "price": "decimal",
      "currency": "USD|VND|THB|CNY",
      "stockQuantity": "int",
      "minStockLevel": "int",
      "category": {
        "id": "long",
        "name": "string"
      },
      "packagingType": {
        "id": "long",
        "name": "string"
      },
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get Product by ID
**GET** `/api/products/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Product ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "sku": "string",
  "price": "decimal",
  "currency": "USD|VND|THB|CNY",
  "stockQuantity": "int",
  "minStockLevel": "int",
  "category": {
    "id": "long",
    "name": "string",
    "description": "string"
  },
  "packagingType": {
    "id": "long",
    "name": "string",
    "description": "string"
  },
  "productVariants": [
    {
      "id": "long",
      "variant": {
        "id": "long",
        "name": "string",
        "value": "string"
      },
      "priceAdjustment": "decimal",
      "stockQuantity": "int",
      "isActive": "boolean"
    }
  ],
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Product not found
- `403` - Access denied

---

### Get Product by SKU
**GET** `/api/products/sku/{sku}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `sku` (string, required) - Product SKU

**Response (200):** Same as Get Product by ID

**Error Responses:**
- `404` - Product not found
- `403` - Access denied

---

### Get Low Stock Products
**GET** `/api/products/low-stock`

**Permissions:** ADMIN, MANAGER

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "sku": "string",
    "stockQuantity": "int",
    "minStockLevel": "int",
    "price": "decimal",
    "currency": "USD|VND|THB|CNY"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Search Products
**GET** `/api/products/search`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Products

**Error Responses:**
- `403` - Access denied

---

### Create Product
**POST** `/api/products`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 200)",
  "description": "string (optional)",
  "sku": "string (required, unique, max: 100)",
  "price": "decimal (required, > 0)",
  "currency": "USD|VND|THB|CNY (default: USD)",
  "stockQuantity": "int (default: 0)",
  "minStockLevel": "int (default: 0)",
  "category": {
    "id": "long (optional)"
  },
  "packagingType": {
    "id": "long (optional)"
  },
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Product by ID

**Error Responses:**
- `400` - SKU already exists
- `400` - Validation errors
- `403` - Access denied

---

### Update Product
**PUT** `/api/products/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Product ID

**Request Body:** Same as Create Product (except SKU cannot be changed)

**Response (200):** Same as Get Product by ID

**Error Responses:**
- `404` - Product not found
- `400` - Validation errors
- `403` - Access denied

---

### Update Stock
**PUT** `/api/products/{id}/stock`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Product ID

**Query Parameters:**
- `quantity` (int, required) - Quantity to add/subtract

**Response (200):**
```json
{
  "message": "Stock updated successfully"
}
```

**Error Responses:**
- `404` - Product not found
- `403` - Access denied

---

### Delete Product
**DELETE** `/api/products/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Product ID

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- `404` - Product not found
- `403` - Access denied

---

## Invoice Management

### Get All Invoices
**GET** `/api/invoices`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "id") - Sort field
- `sortDir` (string, default: "desc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "invoiceNumber": "string",
      "invoiceDate": "date",
      "dueDate": "date",
      "supplier": {
        "id": "long",
        "name": "string",
        "contactPerson": "string",
        "email": "string",
        "phone": "string"
      },
      "status": "DRAFT|PENDING|APPROVED|PAID|CANCELLED",
      "subtotal": "decimal",
      "taxAmount": "decimal",
      "discountAmount": "decimal",
      "totalAmount": "decimal",
      "currency": "USD|VND|THB|CNY",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get Invoice by ID
**GET** `/api/invoices/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Invoice ID

**Response (200):**
```json
{
  "id": "long",
  "invoiceNumber": "string",
  "invoiceDate": "date",
  "dueDate": "date",
  "supplier": {
    "id": "long",
    "name": "string",
    "contactPerson": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "taxNumber": "string"
  },
  "status": "DRAFT|PENDING|APPROVED|PAID|CANCELLED",
  "subtotal": "decimal",
  "taxAmount": "decimal",
  "discountAmount": "decimal",
  "totalAmount": "decimal",
  "currency": "USD|VND|THB|CNY",
  "notes": "string",
  "invoiceItems": [
    {
      "id": "long",
      "product": {
        "id": "long",
        "name": "string",
        "sku": "string"
      },
      "quantity": "int",
      "unitPrice": "decimal",
      "totalPrice": "decimal",
      "notes": "string"
    }
  ],
  "invoiceExpenses": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "amount": "decimal"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Invoice not found
- `403` - Access denied

---

### Get Invoices by Date Range
**GET** `/api/invoices/date-range`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `startDate` (date, required) - Start date (YYYY-MM-DD)
- `endDate` (date, required) - End date (YYYY-MM-DD)

**Response (200):**
```json
[
  {
    "id": "long",
    "invoiceNumber": "string",
    "invoiceDate": "date",
    "supplier": {
      "id": "long",
      "name": "string"
    },
    "status": "DRAFT|PENDING|APPROVED|PAID|CANCELLED",
    "totalAmount": "decimal",
    "currency": "USD|VND|THB|CNY"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Search Invoices
**GET** `/api/invoices/search`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Invoices

**Error Responses:**
- `403` - Access denied

---

### Create Invoice
**POST** `/api/invoices`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "invoiceNumber": "string (required, unique, max: 100)",
  "invoiceDate": "date (required)",
  "dueDate": "date (optional)",
  "supplier": {
    "id": "long (required)"
  },
  "status": "DRAFT|PENDING|APPROVED|PAID|CANCELLED (default: DRAFT)",
  "taxAmount": "decimal (optional, default: 0)",
  "discountAmount": "decimal (optional, default: 0)",
  "currency": "USD|VND|THB|CNY (default: USD)",
  "notes": "string (optional)",
  "invoiceItems": [
    {
      "product": {
        "id": "long (required)"
      },
      "quantity": "int (required, min: 1)",
      "unitPrice": "decimal (required, > 0)",
      "totalPrice": "decimal (calculated)",
      "notes": "string (optional)"
    }
  ],
  "invoiceExpenses": [
    {
      "name": "string (required, max: 200)",
      "description": "string (optional)",
      "amount": "decimal (required, > 0)"
    }
  ]
}
```

**Response (200):** Same as Get Invoice by ID

**Error Responses:**
- `400` - Invoice number already exists
- `400` - Validation errors
- `403` - Access denied

---

### Update Invoice
**PUT** `/api/invoices/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Invoice ID

**Request Body:** Same as Create Invoice

**Response (200):** Same as Get Invoice by ID

**Error Responses:**
- `404` - Invoice not found
- `400` - Validation errors
- `403` - Access denied

---

### Approve Invoice
**PUT** `/api/invoices/{id}/approve`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Invoice ID

**Response (200):** Same as Get Invoice by ID

**Error Responses:**
- `404` - Invoice not found
- `400` - Only pending invoices can be approved
- `403` - Access denied

---

## Order Management

### Get All Orders
**GET** `/api/orders`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "id") - Sort field
- `sortDir` (string, default: "desc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "orderNumber": "string",
      "orderDate": "date",
      "deliveryDate": "date",
      "customer": {
        "id": "long",
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "status": "DRAFT|PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
      "subtotal": "decimal",
      "taxAmount": "decimal",
      "discountAmount": "decimal",
      "totalAmount": "decimal",
      "currency": "USD|VND|THB|CNY",
      "shippingAddress": "string",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get Order by ID
**GET** `/api/orders/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Order ID

**Response (200):**
```json
{
  "id": "long",
  "orderNumber": "string",
  "orderDate": "date",
  "deliveryDate": "date",
  "customer": {
    "id": "long",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "taxNumber": "string"
  },
  "status": "DRAFT|PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
  "subtotal": "decimal",
  "taxAmount": "decimal",
  "discountAmount": "decimal",
  "totalAmount": "decimal",
  "currency": "USD|VND|THB|CNY",
  "shippingAddress": "string",
  "notes": "string",
  "orderItems": [
    {
      "id": "long",
      "product": {
        "id": "long",
        "name": "string",
        "sku": "string"
      },
      "quantity": "int",
      "unitPrice": "decimal",
      "totalPrice": "decimal",
      "notes": "string"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Order not found
- `403` - Access denied

---

### Get Orders by Date Range
**GET** `/api/orders/date-range`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `startDate` (date, required) - Start date (YYYY-MM-DD)
- `endDate` (date, required) - End date (YYYY-MM-DD)

**Response (200):**
```json
[
  {
    "id": "long",
    "orderNumber": "string",
    "orderDate": "date",
    "customer": {
      "id": "long",
      "name": "string"
    },
    "status": "DRAFT|PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
    "totalAmount": "decimal",
    "currency": "USD|VND|THB|CNY"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Search Orders
**GET** `/api/orders/search`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Orders

**Error Responses:**
- `403` - Access denied

---

### Get Orders by Customer
**GET** `/api/orders/customer/{customerId}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `customerId` (long, required) - Customer ID

**Response (200):**
```json
[
  {
    "id": "long",
    "orderNumber": "string",
    "orderDate": "date",
    "status": "DRAFT|PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
    "totalAmount": "decimal",
    "currency": "USD|VND|THB|CNY"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Create Order
**POST** `/api/orders`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "orderNumber": "string (required, unique, max: 100)",
  "orderDate": "date (required)",
  "deliveryDate": "date (optional)",
  "customer": {
    "id": "long (required)"
  },
  "status": "DRAFT|PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED (default: DRAFT)",
  "taxAmount": "decimal (optional, default: 0)",
  "discountAmount": "decimal (optional, default: 0)",
  "currency": "USD|VND|THB|CNY (default: USD)",
  "shippingAddress": "string (optional)",
  "notes": "string (optional)",
  "orderItems": [
    {
      "product": {
        "id": "long (required)"
      },
      "quantity": "int (required, min: 1)",
      "unitPrice": "decimal (required, > 0)",
      "totalPrice": "decimal (calculated)",
      "notes": "string (optional)"
    }
  ]
}
```

**Response (200):** Same as Get Order by ID

**Error Responses:**
- `400` - Order number already exists
- `400` - Validation errors
- `403` - Access denied

---

### Update Order
**PUT** `/api/orders/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Order ID

**Request Body:** Same as Create Order

**Response (200):** Same as Get Order by ID

**Error Responses:**
- `404` - Order not found
- `400` - Cannot update shipped or delivered orders
- `400` - Validation errors
- `403` - Access denied

---

### Update Order Status
**PUT** `/api/orders/{id}/status`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Order ID

**Query Parameters:**
- `status` (string, required) - New status (DRAFT/PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED)

**Response (200):** Same as Get Order by ID

**Error Responses:**
- `404` - Order not found
- `403` - Access denied

---

### Ship Order
**PUT** `/api/orders/{id}/ship`

**Permissions:** ADMIN, MANAGER

**Description:** Ship order and reduce product stock

**Path Parameters:**
- `id` (long, required) - Order ID

**Response (200):** Same as Get Order by ID

**Error Responses:**
- `404` - Order not found
- `400` - Only processing orders can be shipped
- `403` - Access denied

---

### Cancel Order
**DELETE** `/api/orders/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Order ID

**Response (200):**
```json
{
  "message": "Order cancelled successfully"
}
```

**Error Responses:**
- `404` - Order not found
- `400` - Cannot cancel shipped or delivered orders
- `403` - Access denied

---

## Category Management

### Get All Categories
**GET** `/api/categories`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "parentId": "long",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Categories List
**GET** `/api/categories/all`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "parentId": "long",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Category by ID
**GET** `/api/categories/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Category ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "parentId": "long",
  "isActive": "boolean",
  "products": [
    {
      "id": "long",
      "name": "string",
      "sku": "string",
      "price": "decimal",
      "stockQuantity": "int"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Category not found
- `403` - Access denied

---

### Get Categories by Parent
**GET** `/api/categories/parent/{parentId}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `parentId` (long, required) - Parent category ID

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "parentId": "long",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Create Category
**POST** `/api/categories`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 100)",
  "description": "string (optional)",
  "parentId": "long (optional)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Category by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Category
**PUT** `/api/categories/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Category ID

**Request Body:** Same as Create Category

**Response (200):** Same as Get Category by ID

**Error Responses:**
- `404` - Category not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Category
**DELETE** `/api/categories/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Category ID

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

**Error Responses:**
- `404` - Category not found
- `403` - Access denied

---

## Supplier Management

### Get All Suppliers
**GET** `/api/suppliers`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "contactPerson": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "taxNumber": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Suppliers List
**GET** `/api/suppliers/all`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "contactPerson": "string",
    "email": "string",
    "phone": "string",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Supplier by ID
**GET** `/api/suppliers/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Supplier ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "contactPerson": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "taxNumber": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Supplier not found
- `403` - Access denied

---

### Search Suppliers
**GET** `/api/suppliers/search`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Suppliers

**Error Responses:**
- `403` - Access denied

---

### Create Supplier
**POST** `/api/suppliers`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 200)",
  "contactPerson": "string (optional, max: 100)",
  "email": "string (optional, valid email)",
  "phone": "string (optional, max: 20)",
  "address": "string (optional)",
  "taxNumber": "string (optional, max: 50)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Supplier by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Supplier
**PUT** `/api/suppliers/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Supplier ID

**Request Body:** Same as Create Supplier

**Response (200):** Same as Get Supplier by ID

**Error Responses:**
- `404` - Supplier not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Supplier
**DELETE** `/api/suppliers/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Supplier ID

**Response (200):**
```json
{
  "message": "Supplier deleted successfully"
}
```

**Error Responses:**
- `404` - Supplier not found
- `403` - Access denied

---

## Customer Management

### Get All Customers
**GET** `/api/customers`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "taxNumber": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Customers List
**GET** `/api/customers/all`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "email": "string",
    "phone": "string",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Customer by ID
**GET** `/api/customers/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Customer ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "taxNumber": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Customer not found
- `403` - Access denied

---

### Search Customers
**GET** `/api/customers/search`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `keyword` (string, required) - Search keyword
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size

**Response (200):** Same as Get All Customers

**Error Responses:**
- `403` - Access denied

---

### Create Customer
**POST** `/api/customers`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 200)",
  "email": "string (optional, valid email)",
  "phone": "string (optional, max: 20)",
  "address": "string (optional)",
  "taxNumber": "string (optional, max: 50)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Customer by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Customer
**PUT** `/api/customers/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Customer ID

**Request Body:** Same as Create Customer

**Response (200):** Same as Get Customer by ID

**Error Responses:**
- `404` - Customer not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Customer
**DELETE** `/api/customers/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Customer ID

**Response (200):**
```json
{
  "message": "Customer deleted successfully"
}
```

**Error Responses:**
- `404` - Customer not found
- `403` - Access denied

---

## Department Management

### Get All Departments
**GET** `/api/departments`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Departments List
**GET** `/api/departments/all`

**Permissions:** ADMIN, MANAGER

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Department by ID
**GET** `/api/departments/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Department ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Department not found
- `403` - Access denied

---

### Create Department
**POST** `/api/departments`

**Permissions:** ADMIN

**Request Body:**
```json
{
  "name": "string (required, max: 100)",
  "description": "string (optional)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Department by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Department
**PUT** `/api/departments/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Department ID

**Request Body:** Same as Create Department

**Response (200):** Same as Get Department by ID

**Error Responses:**
- `404` - Department not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Department
**DELETE** `/api/departments/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Department ID

**Response (200):**
```json
{
  "message": "Department deleted successfully"
}
```

**Error Responses:**
- `404` - Department not found
- `403` - Access denied

---

## Team Management

### Get All Teams
**GET** `/api/teams`

**Permissions:** ADMIN, MANAGER

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "departmentId": "long",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Teams List
**GET** `/api/teams/all`

**Permissions:** ADMIN, MANAGER

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "departmentId": "long",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Team by ID
**GET** `/api/teams/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Team ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "departmentId": "long",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Team not found
- `403` - Access denied

---

### Get Teams by Department
**GET** `/api/teams/department/{departmentId}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `departmentId` (long, required) - Department ID

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "departmentId": "long",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Create Team
**POST** `/api/teams`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 100)",
  "description": "string (optional)",
  "departmentId": "long (optional)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Team by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Team
**PUT** `/api/teams/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Team ID

**Request Body:** Same as Create Team

**Response (200):** Same as Get Team by ID

**Error Responses:**
- `404` - Team not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Team
**DELETE** `/api/teams/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Team ID

**Response (200):**
```json
{
  "message": "Team deleted successfully"
}
```

**Error Responses:**
- `404` - Team not found
- `403` - Access denied

---

## Packaging Type Management

### Get All Packaging Types
**GET** `/api/packaging-types`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Packaging Types List
**GET** `/api/packaging-types/all`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "description": "string",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Packaging Type by ID
**GET** `/api/packaging-types/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Packaging Type ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Packaging type not found
- `403` - Access denied

---

### Create Packaging Type
**POST** `/api/packaging-types`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 100)",
  "description": "string (optional)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Packaging Type by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Packaging Type
**PUT** `/api/packaging-types/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Packaging Type ID

**Request Body:** Same as Create Packaging Type

**Response (200):** Same as Get Packaging Type by ID

**Error Responses:**
- `404` - Packaging type not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Packaging Type
**DELETE** `/api/packaging-types/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Packaging Type ID

**Response (200):**
```json
{
  "message": "Packaging type deleted successfully"
}
```

**Error Responses:**
- `404` - Packaging type not found
- `403` - Access denied

---

## Variant Management

### Get All Variants
**GET** `/api/variants`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Page size
- `sortBy` (string, default: "name") - Sort field
- `sortDir` (string, default: "asc") - Sort direction

**Response (200):**
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "value": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int"
  },
  "totalElements": "long",
  "totalPages": "int"
}
```

**Error Responses:**
- `403` - Access denied

---

### Get All Variants List
**GET** `/api/variants/all`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Response (200):**
```json
[
  {
    "id": "long",
    "name": "string",
    "value": "string",
    "isActive": "boolean"
  }
]
```

**Error Responses:**
- `403` - Access denied

---

### Get Variant by ID
**GET** `/api/variants/{id}`

**Permissions:** ADMIN, MANAGER, EMPLOYEE

**Path Parameters:**
- `id` (long, required) - Variant ID

**Response (200):**
```json
{
  "id": "long",
  "name": "string",
  "value": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Responses:**
- `404` - Variant not found
- `403` - Access denied

---

### Create Variant
**POST** `/api/variants`

**Permissions:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required, max: 100)",
  "value": "string (required, max: 100)",
  "isActive": "boolean (default: true)"
}
```

**Response (200):** Same as Get Variant by ID

**Error Responses:**
- `400` - Validation errors
- `403` - Access denied

---

### Update Variant
**PUT** `/api/variants/{id}`

**Permissions:** ADMIN, MANAGER

**Path Parameters:**
- `id` (long, required) - Variant ID

**Request Body:** Same as Create Variant

**Response (200):** Same as Get Variant by ID

**Error Responses:**
- `404` - Variant not found
- `400` - Validation errors
- `403` - Access denied

---

### Delete Variant
**DELETE** `/api/variants/{id}`

**Permissions:** ADMIN

**Path Parameters:**
- `id` (long, required) - Variant ID

**Response (200):**
```json
{
  "message": "Variant deleted successfully"
}
```

**Error Responses:**
- `404` - Variant not found
- `403` - Access denied

---

## Health Check

### Health Status
**GET** `/api/health`

**Permissions:** Public

**Response (200):**
```json
{
  "status": "UP",
  "service": "Warehouse Management System"
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Description | When it occurs |
|------|-------------|----------------|
| `200` | OK | Request successful |
| `400` | Bad Request | Validation errors, business logic errors |
| `401` | Unauthorized | Invalid or missing JWT token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Unexpected server error |

### Error Response Format

**Standard Error Response:**
```json
{
  "status": "int",
  "message": "string",
  "timestamp": "datetime"
}
```

**Validation Error Response:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "datetime",
  "fieldErrors": {
    "fieldName": "error message",
    "anotherField": "another error message"
  }
}
```

### Common Error Messages

| Error | Description |
|-------|-------------|
| `Username already exists` | Username is already taken during registration |
| `Email already exists` | Email is already registered |
| `SKU already exists` | Product SKU is already in use |
| `Invoice number already exists` | Invoice number is already used |
| `Order number already exists` | Order number is already used |
| `User not found` | User with specified ID doesn't exist |
| `Product not found` | Product with specified ID doesn't exist |
| `Invoice not found` | Invoice with specified ID doesn't exist |
| `Order not found` | Order with specified ID doesn't exist |
| `Category not found` | Category with specified ID doesn't exist |
| `Supplier not found` | Supplier with specified ID doesn't exist |
| `Customer not found` | Customer with specified ID doesn't exist |
| `Department not found` | Department with specified ID doesn't exist |
| `Team not found` | Team with specified ID doesn't exist |
| `Packaging type not found` | Packaging type with specified ID doesn't exist |
| `Variant not found` | Variant with specified ID doesn't exist |
| `Only pending invoices can be approved` | Invoice status must be PENDING to approve |
| `Only processing orders can be shipped` | Order status must be PROCESSING to ship |
| `Cannot update shipped or delivered orders` | Orders in SHIPPED/DELIVERED status cannot be modified |
| `Cannot cancel shipped or delivered orders` | Orders in SHIPPED/DELIVERED status cannot be cancelled |

### Authentication

All endpoints except `/api/auth/*` and `/api/health` require JWT authentication.

**Authorization Header:**
```
Authorization: Bearer <jwt_token>
```

### Supported Currencies

- `USD` - US Dollar (default)
- `VND` - Vietnamese Dong
- `THB` - Thai Baht
- `CNY` - Chinese Yuan

### Date Format

All dates should be in ISO format: `YYYY-MM-DD`
All datetimes are in ISO format: `YYYY-MM-DDTHH:mm:ss`

### Pagination

Default pagination parameters:
- `page`: 0 (first page)
- `size`: 10 (items per page)
- `sortBy`: varies by endpoint
- `sortDir`: "asc" or "desc"

### Search

Search functionality is available for:
- Users (username, fullName, email)
- Products (name, sku, description)
- Invoices (invoiceNumber, supplier name)
- Orders (orderNumber, customer name)
- Suppliers (name, contactPerson, email)
- Customers (name, email, phone)
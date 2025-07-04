# Inventory Management System

## Overview

This is a comprehensive inventory management system built with React, TypeScript, and Tailwind CSS. The application provides role-based access control with authentication, complete product and inventory management, order processing, customer management, supplier management, and comprehensive reporting for business operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Routing**: React Router DOM for client-side navigation
- **Authentication**: Custom authentication context with role-based permissions
- **State Management**: Custom React hooks with local state management
- **Internationalization**: Vietnamese language support throughout the interface
- **Build Tool**: Vite for fast development and optimized builds

### Authentication & Role System
- **Role-Based Access Control**: Three distinct user roles (Manager, Salesperson, Warehouse)
- **Permission System**: Action-based permissions for different operations
- **Session Management**: Local storage with secure token handling
- **Protected Routes**: Route-level access control based on user permissions

## Key Features Implemented

### 1. Authentication & Role-Based Access Control
- **User Roles**: Manager, Salesperson, Warehouse staff
- **Permission System**: Action-based authorization (create_order, confirm_order, manage_inventory, etc.)
- **Session Management**: Secure login/logout with token-based authentication
- **Role-Specific Navigation**: Dynamic menu filtering based on user permissions

### 2. Enhanced Order Creation Process
- **Customer Search**: Phone number-based customer lookup
- **Auto Customer Creation**: Creates new customer if not found in system
- **Automatic Promotion Application**: Real-time promotion calculation based on order value
- **Product Management**: Dynamic item addition with pricing and quantity controls
- **Vietnamese Localization**: Full Vietnamese language interface and currency formatting

### 3. Role-Based Order Workflow
- **Draft → Confirmed**: Manager approval required for order confirmation
- **Confirmed → Preparing**: Warehouse staff can move orders to preparation
- **Preparing → Shipped**: Warehouse staff updates shipping status
- **Shipped → Delivered**: Final delivery confirmation
- **Cancellation Rights**: Manager can cancel orders at appropriate stages

### 4. Workflow Permissions
- **Salesperson**: Create orders, view own orders only, search customers
- **Manager**: Full order oversight, confirm/cancel orders, view all reports
- **Warehouse**: Inventory management, order fulfillment, shipping updates

### 5. Dashboard & Analytics
- **Role-Specific Stats**: Different metrics based on user role
- **Order Status Tracking**: Real-time status distribution
- **Revenue Analytics**: Financial performance indicators
- **Recent Activity**: Latest order updates and actions required

## Data Flow

### Service Layer Architecture
- **API Abstraction**: Centralized API service for HTTP requests
- **Domain Services**: Specialized services for each business domain
- **Mock Data**: Development-ready mock services simulating backend APIs
- **Error Handling**: Consistent error handling across all services

### State Management Pattern
- **Page → Hook → Service → API**: Consistent architecture pattern throughout application
- **Custom Hooks**: Domain-specific hooks for state management and business logic
- **Service Layer**: Centralized mock data and API abstraction with hybrid backend/mock fallback
- **Async Operations**: Promise-based async operations with loading states
- **Local State**: Component-level state for UI interactions
- **Data Persistence**: LocalStorage for user preferences and settings

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, ReactDOM, React Router DOM
- **TypeScript**: Full type safety with strict configuration
- **Styling**: Tailwind CSS with autoprefixer
- **Internationalization**: i18next with React integration
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Performance**: Memoizee for function memoization

### Development Dependencies
- **Build Tools**: Vite with React plugin
- **Code Quality**: ESLint with TypeScript support
- **Type Checking**: TypeScript with strict configuration
- **PostCSS**: CSS processing with Tailwind integration

## Deployment Strategy

### Database Integration
- **Supabase**: PostgreSQL database with row-level security
- **Migration System**: SQL migrations for schema management
- **Real-time Support**: Prepared for real-time data synchronization

### Architecture Decisions (ADR)
1. **UTF8MB4 Support**: Full Unicode support for multilingual content
2. **JSONB Attributes**: Flexible product attributes and search optimization
3. **Product Type Separation**: Clear distinction between structure and categorization
4. **Rule-based Promotions**: Flexible promotion engine with condition/action rules

### Production Considerations
- **Backend Integration**: Ready for Spring Boot API integration
- **Authentication**: OpenID Connect integration prepared
- **Performance**: Optimized bundle splitting and lazy loading
- **Monitoring**: Error tracking and performance monitoring ready

## Implementation Status

### ✅ Completed Features
1. **Authentication System**
   - Role-based login with Manager, Salesperson, Warehouse roles
   - Permission-based action authorization
   - Secure session management with logout functionality

2. **Enhanced Order Creation**
   - Customer search by phone number with auto-creation
   - Automatic promotion application based on order value
   - Dynamic product item management with real-time calculations
   - Vietnamese currency formatting and validation

3. **Role-Based Workflow**
   - Manager: Order confirmation, cancellation, full system oversight
   - Salesperson: Order creation, view own orders only, customer management
   - Warehouse: Order fulfillment, inventory updates, shipping management

4. **User Interface Enhancements**
   - Role-specific navigation menu filtering
   - Vietnamese language interface throughout
   - Order status workflow with visual indicators
   - Comprehensive order details modal with all information

### 🔄 Current Implementation
- All core authentication and order management features are functional
- Role-based permissions are enforced at both UI and service levels
- Order workflow follows proper business logic with status transitions
- Customer and promotion management integrated into order creation

### Demo Accounts Available
- **Admin**: username `admin`, password `password123`
- **Manager**: username `manager`, password `password123`
- **Employee**: username `employee`, password `password123`

## Recent Changes

July 03, 2025:
- **Code Quality Improvements**: Fixed major ESLint errors including unused variables and imports
- **Error Boundary Implementation**: Added comprehensive error boundary with user-friendly error screens
- **Loading States Enhancement**: Created reusable loading components (LoadingSpinner, PageLoader, SkeletonLoader, TableSkeleton)
- **Better User Experience**: Improved loading indicators throughout the application
- **TypeScript Optimizations**: Removed unused imports and variables for cleaner code

July 02, 2025:
- **Architecture Refactoring**: Successfully implemented Page → Hook → Service → API pattern as requested
- **BaseService Optimization**: Reduced unnecessary API calls and console log spam by implementing proper health check intervals
- **TypeScript Error Fixes**: Resolved InventoryItem type inconsistencies (reorderLevel vs minStock properties)
- **Mock Data Centralization**: All mock data now centralized in services layer instead of direct component access
- **Performance Improvements**: Optimized backend health checks to avoid excessive failed requests
- **System Status**: Vite development server running stable on port 5000 with Vietnamese interface

January 01, 2025:
- **System Restart**: Successfully resolved black screen issue by restarting Dev Server workflow
- **Application Status**: Confirmed Inventory Management System is running properly on port 5000
- **Authentication Ready**: Login page displays correctly with Vietnamese interface
- **Demo Accounts Available**: admin/password123, manager/password123, employee/password123

June 30, 2025:
- **Project Structure Update**: Migrated to single-page application structure with src/ directory
- **Enhanced Order Management**: Updated to comprehensive order management system with role-based access
- **Authentication System**: Implemented role-based authentication with Manager, Salesperson, Warehouse roles
- **Vite Development**: Configured Vite dev server on port 5000 with hot reload
- **Vietnamese Interface**: Full Vietnamese language support throughout the application
- **Workflow Configuration**: Set up "Dev Server" workflow for easy application startup

June 29, 2025:
- **Hierarchical Category System**: Redesigned to use specific subcategories instead of broad categories
- **Category Hierarchy**: Created 10 detailed categories: Thời trang nam, Thời trang nữ, Điện thoại & Tablet, Laptop & Máy tính, Nội thất, Đồ gia dụng nhà bếp, Thể thao & Fitness, Thực phẩm đóng gói, Chăm sóc da, Sách giáo dục
- **Proper Attribute Separation**: Specifications for product descriptions (material, brand, style), Variants for inventory management (size, color, storage)
- **Real-World Approach**: Color, size, storage capacity are now variants for proper inventory tracking and filtering
- **Business Logic**: Categories like "Thời trang nam" vs "Thời trang nữ" for better product organization
- **Complete Product Examples**: Sample products with proper specifications and multiple variants
- **Inventory-Ready**: Variants include full details (SKU, stock, dimensions, weight) for real inventory management

June 28, 2025:
- **Created User Management System**: Built comprehensive user account management page with full CRUD functionality
- **Team Management**: Added team creation, editing, and member management capabilities
- **Advanced Filtering**: Implemented sophisticated filtering system by role, status, department, team, and search
- **User Interface Components**: Created UserCard, UserFilters, UserForm, and TeamCard components
- **Service Layer**: Built UserService with mock data for user and team operations
- **Navigation Integration**: Added user management to sidebar navigation with proper permissions
- **Statistics Dashboard**: Implemented real-time statistics for users, teams, and activity metrics
- **Vietnamese Localization**: Full Vietnamese language support throughout user management interface

June 26, 2025:
- **Updated Role System**: Changed from previous roles to admin, manager, and employee
- **Enhanced Authentication**: Updated user accounts and permissions for new role structure
- **New Service Layer**: Created enhanced order service with role-based filtering and access control
- **Mock Data Update**: Built new mock data with proper role assignments and Vietnamese content
- **Permission System**: Implemented proper access control for each role level
- **Order Workflow**: Enhanced status transitions with role-specific permissions
- **Vietnamese Interface**: Maintained full Vietnamese localization with proper currency formatting
- **Demo Accounts**: Updated with admin, manager, and employee test accounts

## User Preferences

Preferred communication style: Simple, everyday language.
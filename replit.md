# Inventory Management System

## Overview

This is a comprehensive inventory management system built with React, TypeScript, and Tailwind CSS. The application provides role-based access control with authentication, complete product and inventory management, order processing, customer management, and reporting capabilities. The system is designed with a modern frontend architecture that supports both backend API integration and mock data fallback for development and testing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with PostCSS for utility-first responsive design
- **Routing**: React Router DOM for client-side navigation and protected routes
- **Build Tool**: Vite for fast development server and optimized production builds
- **State Management**: Custom React hooks with context-based authentication
- **Internationalization**: i18next with Vietnamese and English language support
- **Form Handling**: React Hook Form with validation resolvers

### Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Five-tier role system (admin, manager, department_head, team_leader, employee)
- **Permission System**: Action-based authorization with granular permissions
- **Session Management**: Local storage with JWT token handling
- **Protected Routes**: Component-level access control based on user roles and permissions

### Service Layer Architecture
- **Hybrid Service Pattern**: BaseHybridService class supporting both backend API and mock data
- **Service Factory**: Centralized service management with dependency injection
- **Fallback Strategy**: Automatic fallback to mock data when backend is unavailable
- **Health Monitoring**: Backend health checks with connection status indicators

## Key Components

### 1. User Management System
- **Normalized Database Schema**: Separate entities for users, roles, departments, and teams
- **Many-to-Many Relationships**: Users can have multiple roles and belong to multiple teams
- **Advanced Filtering**: Search and filter users by role, department, team, and status
- **Bulk Operations**: Mass user operations with role and team assignments

### 2. Product Management
- **Dynamic Product Specifications**: Configurable product attributes based on category
- **Variant Management**: Product variants with individual pricing and inventory
- **Category Hierarchy**: Multi-level categorization with inheritance
- **Inventory Integration**: Real-time stock tracking with low-stock alerts

### 3. Order Processing Workflow
- **Multi-Status Pipeline**: Draft → Confirmed → Preparing → Shipped → Delivered
- **Role-Based Actions**: Different roles can perform specific order transitions
- **Customer Integration**: Automatic customer creation and lookup by phone number
- **Promotion System**: Automatic discount application based on order value

### 4. Inventory Management
- **Multi-Status Tracking**: Sellable, damaged, hold, and transit inventory states
- **Stock Transfer System**: Movement between different inventory statuses
- **Purchase Order Integration**: Automated inventory receipts from suppliers
- **Alert System**: Low stock notifications and reorder suggestions

### 5. Reporting & Analytics
- **Role-Based Dashboards**: Different data visibility based on user permissions
- **Real-Time Statistics**: Live updates of sales, inventory, and order metrics
- **Chart Visualization**: Recharts integration for sales trends and analytics
- **Export Capabilities**: Data export functionality for reports

## Data Flow

### Authentication Flow
1. User submits login credentials
2. AuthService validates against backend/mock data
3. JWT token stored in localStorage
4. User context updated with role and permissions
5. Navigation filtered based on user permissions

### Order Creation Flow
1. Salesperson searches for customer by phone number
2. System auto-creates customer if not found
3. Products added to order with real-time stock validation
4. Automatic promotion calculation and application
5. Order saved in draft status
6. Manager confirmation required for order processing

### Inventory Update Flow
1. Purchase orders trigger inventory receipts
2. Stock levels updated across all variants
3. Low stock alerts generated automatically
4. Audit trail maintained for all inventory changes
5. Real-time dashboard updates reflect new stock levels

## External Dependencies

### Core Libraries
- **React & React DOM**: Frontend framework and virtual DOM
- **TypeScript**: Type safety and development tooling
- **Tailwind CSS**: Utility-first styling framework
- **React Router DOM**: Client-side routing
- **React Hook Form**: Form state management and validation

### Data & State Management
- **@tanstack/react-query**: Server state management and caching
- **i18next**: Internationalization and localization
- **date-fns**: Date manipulation and formatting

### UI & Visualization
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart and data visualization
- **@hookform/resolvers**: Form validation integration

### Backend Integration
- **Drizzle ORM**: Type-safe database queries and schema management
- **@neondatabase/serverless**: Serverless PostgreSQL integration
- **Express & Express Session**: Backend API and session management
- **Passport**: Authentication middleware

### Development Tools
- **Vite**: Build tool and development server
- **ESLint**: Code linting and style enforcement
- **Autoprefixer**: CSS vendor prefix automation

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for rapid development
- **Mock Data Fallback**: Development without backend dependency
- **TypeScript Checking**: Real-time type validation
- **ESLint Integration**: Code quality enforcement

### Production Deployment
- **Static Build**: Optimized bundle with code splitting
- **Environment Variables**: Configuration via VITE_ prefixed variables
- **Backend API Integration**: Production API endpoint configuration
- **CDN Ready**: Optimized assets for content delivery networks

### Configuration Management
- **Environment-Based Config**: Different settings for dev/staging/production
- **Service Mode Switching**: Runtime backend/mock mode selection
- **Health Check Integration**: Automatic service status monitoring
- **Graceful Degradation**: Fallback to cached data when services unavailable

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
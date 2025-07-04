# E-commerce Application

## Overview

This is a modern e-commerce web application built with React frontend and Express.js backend. The application features a product catalog with filtering, search, shopping cart functionality, and a responsive design using shadcn/ui components. The system is designed with a monorepo structure where frontend and backend share type definitions and schemas.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod resolvers for validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API with conventional routes
- **Data Validation**: Zod schemas for request/response validation
- **Storage**: Pluggable storage interface with in-memory implementation
- **Session Management**: Express session with PostgreSQL store support
- **Error Handling**: Centralized error handling middleware

### Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema migrations
- **Schema**: Shared schema definitions between frontend and backend

## Key Components

### Product Management
- Product catalog with categories (electronics, fashion, home, sports)
- Product filtering by category, price range, and search terms
- Product sorting by price, rating, and newest
- Product detail views with image galleries
- Rating and review system

### Shopping Cart
- Add/remove items from cart
- Update item quantities
- Persistent cart state
- Real-time cart updates across components

### User Interface
- Responsive design optimized for mobile and desktop
- Modern component library with consistent styling
- Toast notifications for user feedback
- Modal dialogs for product details
- Side sheet for shopping cart

### API Structure
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

## Data Flow

1. **Product Browsing**: Client fetches products from API with optional filters
2. **Product Selection**: User clicks product to view details in modal
3. **Cart Operations**: Add to cart triggers API call and updates local state
4. **State Synchronization**: TanStack Query manages cache invalidation and refetching

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: TypeScript-first schema validation

### Development Tools
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database migrations and introspection
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for running TypeScript backend with auto-reload
- Shared type definitions prevent API/UI mismatches

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild bundles server code with external dependencies
- Single deployment artifact with static file serving

### Environment Configuration
- Database URL configured via environment variables
- Development vs production mode detection
- Replit-specific plugins conditionally loaded

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
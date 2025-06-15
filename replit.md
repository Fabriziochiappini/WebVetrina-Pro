# replit.md

## Overview

WebPro Italia is a professional Italian web development service offering website creation at competitive prices. The application is a full-stack web platform built with modern technologies, featuring a customer-facing website, contact management system, blog functionality, portfolio showcase, and admin dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component-based development
- **Styling**: Tailwind CSS for utility-first responsive design with custom theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design system
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **API Design**: RESTful API endpoints with proper HTTP methods and status codes
- **Session Management**: Express-session with PostgreSQL store for user authentication
- **File Upload**: Multer middleware for handling image uploads with validation
- **Email Service**: SendGrid integration for contact form notifications

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Well-structured relational database with tables for users, contacts, portfolio items, blog posts, site settings, and logos
- **Migrations**: Drizzle Kit for database schema management and version control

## Key Components

### Customer-Facing Features
- **Landing Page**: Modern hero section with pricing, benefits, and call-to-action elements
- **Portfolio**: Public showcase of completed projects with filtering and responsive design
- **Blog System**: Content management with published articles, SEO optimization, and social sharing
- **Contact Form**: Multi-step form with validation, business type selection, and email notifications
- **Responsive Design**: Mobile-first approach ensuring optimal experience across all devices

### Admin Dashboard
- **Contact Management**: View, filter, and export customer inquiries with date range filtering
- **Portfolio Management**: CRUD operations for showcase items with image upload and featured status
- **Blog Management**: Rich text editor (TinyMCE) for content creation with draft/publish workflow
- **Site Settings**: Configuration for tracking pixels and custom code injection
- **Authentication**: Session-based admin access with middleware protection

### Content Management
- **Rich Text Editor**: TinyMCE integration with custom configuration for blog content
- **Image Upload**: Secure file upload system with validation and storage management
- **SEO Optimization**: Meta tags, structured data, and search-friendly URLs

## Data Flow

### User Journey
1. Visitors land on the homepage with compelling value proposition
2. Browse portfolio of completed projects for credibility
3. Read blog articles for expertise demonstration
4. Fill contact form with business requirements
5. Admin receives notifications and manages leads through dashboard

### Admin Workflow
1. Authentication through session-based login system
2. Dashboard access to view contacts, manage portfolio, and create content
3. Real-time data updates through React Query cache invalidation
4. File uploads processed through secure middleware with validation

### Email Integration
- Contact form submissions trigger automated email notifications
- SendGrid service handles reliable email delivery
- Auto-reply system for customer acknowledgment

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL (compatible with Neon, Supabase, Railway)
- **Email Service**: SendGrid for transactional emails
- **Rich Text Editor**: TinyMCE Cloud for content editing
- **UI Framework**: Radix UI for accessible component primitives
- **Build Tools**: Vite for fast development and optimized production builds

### Development Tools
- **TypeScript**: Full-stack type safety
- **ESBuild**: Fast backend bundling
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Multi-Platform Deployment
The application supports deployment on multiple platforms:

1. **Netlify Deployment** (Recommended)
   - Static site generation with serverless functions
   - Automatic builds from Git repositories
   - Built-in CDN and SSL certificates
   - Environment variable management

2. **Render Deployment**
   - Full-stack hosting with PostgreSQL database
   - Automatic builds and deployments
   - Free tier available with sleep mode
   - European data centers (Frankfurt)

3. **Replit Development**
   - Cloud-based development environment
   - Integrated PostgreSQL database
   - Real-time collaboration features
   - Hot reload for development

### Build Process
- Frontend built with Vite for optimized bundle splitting
- Backend compiled with ESBuild for Node.js deployment
- Static assets served with appropriate caching headers
- Database migrations managed through Drizzle Kit

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secure session encryption key
- `SENDGRID_API_KEY`: Email service authentication
- `TINYMCE_API_KEY`: Rich text editor API access
- `NODE_ENV`: Environment specification

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 15, 2025. Completed FAQ section with 8 professional questions and updated all CTA texts from price-specific to generic "VOGLIO IL MIO SITO" messaging across all pricing tiers
- June 15, 2025. Implemented comprehensive Google Analytics 4 tracking system with complete business event monitoring for conversions, form submissions, portfolio clicks, and user interactions
- June 14, 2025. Initial setup
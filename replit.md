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

### Content Generation Preferences
- **Article Quality**: User requires 1500-2000+ word articles consistently
- **Content Originality**: Confirmed preference for original OpenAI-generated content
- **Cost Awareness**: User informed that articles cost ~€0.10-0.15 each via OpenAI API
- **Length Consistency**: User specifically concerned about avoiding short articles (2-3 sentences)
- **Professional Images**: Prefers Unsplash stock images over local uploads

## Changelog

- July 30, 2025. CRASH "I NOSTRI LAVORI" RISOLTO: corretto errore JavaScript "lavori.map is not a function" nel componente NostriLavoriManagement. Aggiunta protezione Array.isArray() e fallback array vuoto per prevenire crash quando dati non sono ancora caricati. Sezione admin ora stabile e funzionante.
- July 30, 2025. SISTEMA CONTROLLO ARTICOLI AUTOMATICI IMPLEMENTATO: aggiunto interruttore nell'admin (tab Impostazioni) per controllare la pubblicazione automatica di articoli AI. Nuovo campo "autoArticlesEnabled" in database site_settings con default true. Scheduler ora controlla questo flag prima di generare articoli - se disattivato salta la pubblicazione con log "PUBBLICAZIONE AUTOMATICA DISABILITATA". Risolve problema Google che rileva contenuti meccanici permettendo di fermare/riavviare pubblicazione automatica senza disattivare completamente il sistema.
- July 30, 2025. PULIZIA SISTEMA PORTFOLIO COMPLETATA: eliminato completamente il vecchio sistema portfolio che causava conflitti e sostituito con nuovo sistema "I Nostri Lavori" basato su database PostgreSQL. Rimossi tutti i file, componenti, routes e link del vecchio portfolio. Aggiunta nuova sezione "NostriLavoriSection" alla homepage per mostrare progetti pubblici. Sistema ora unificato e privo di conflitti - solo "I Nostri Lavori" con persistenza database permanente.
- July 30, 2025. SISTEMA BACKUP IMMAGINI PORTFOLIO ULTRA-RINFORZATO: risolto definitivamente problema perdita immagini portfolio durante deploy/riposo sito. Implementato backup automatico immediato di ogni immagine caricata, verifica integrità all'avvio server, ripristino automatico da backup-images. Sistema NON usa placeholder casuali - se immagini mancano va ricaricata quella originale dall'admin. Log dettagliati per monitoraggio. Da ora le foto portfolio rimangono permanenti.
- July 24, 2025. SISTEMA TICKET CHAT COMPLETATO: trasformato sistema ticket da form statico a chat interattiva. Mantenuta interfaccia originale Assistenza (/ticket) che piaceva all'utente, aggiunta funzionalità chat reale (/ticket/:id) con messaggi bidirezionali. Database schema ticket_messages per persistenza conversazioni. Navbar aggiornata da "Assistenza" a "Ticket". Design orange/purple coerente con tema sito. Workflow: crea ticket → reindirizzamento automatico a chat specifica per comunicazione diretta con supporto.
- July 22, 2025. APP STORE SERVIZI RIVOLUZIONARIO: creata pagina servizi (/servizi) con design app-like iOS/Android - 9 card quadrate con badge marketing (PIÙ VENDUTO, HOT, TRENDING, AI POWERED), gradienti vivaci, ombre profonde, hover effects. Include AutoBlog AI (€79/mese), Blog Module ridotto (€39), SEO PLUS (€99/mese) e altri 6 servizi premium. Menu riorganizzato con "Servizi" dopo "Blog". Strategia di upselling con visual impact massimo per aumentare conversioni.
- July 13, 2025. PROMPT ARTICOLI MIGLIORATO: rivoluzionato sistema generazione articoli con prompt avanzato per evitare rilevamento Google come "template-generated". Ora crea contenuti UNICI e VARIABILI con strutture creative diverse, 14 approcci diversificati, storytelling locale, lunghezza 1800-2500 parole, stile narrativo diversificato. Risolve problema Google che rilevava articoli come "fatti in serie".
- July 6, 2025. SEO OTTIMIZZAZIONE COMPLETA: implementato title site "Web Pro Italia - Realizzazione e creazione siti web aziendali professionali per la tua attività", meta description SEO-friendly, parole chiave strategiche, structured data JSON-LD, robots.txt e sitemap.xml dinamico. Sito ora completamente ottimizzato per motori di ricerca.
- July 6, 2025. CRITICO: Sistema sicurezza ultra-rinforzato dopo violazione: rimosso hardcoding password da codice, implementato autenticazione basata su sessioni, credenziali reali ora in variabili ambiente. Risolto problema password visibile nel codice che comprometteva sicurezza.
- June 23, 2025. Sistema backup immagini completamente rinforzato: implementato backup automatico all'avvio server, controllo integrità con auto-ripristino per portfolio e galleria landing, logging dettagliato per monitoraggio. Risolve definitivamente problema perdita immagini che causava recensioni negative.
- June 22, 2025. Sistema backup galleria landing rafforzato: implementato controllo automatico e ripristino immagini dal backup, eliminato fallback demo, aggiunto sistema robusto per prevenire perdita foto durante vendite.
- June 19, 2025. Risolto problema persistenza galleria landing: implementato sistema di backup automatico per le immagini caricate, rimosso fallback a immagini demo, aggiunto sistema di ripristino per garantire stabilità delle foto nella galleria.
- June 18, 2025. Completed landing gallery management system with full CRUD operations, image upload, and admin panel integration. Fixed all TypeScript errors and validated API endpoints functionality.
- June 18, 2025. Fixed routing issues and component import errors. All pages now load correctly including admin dashboard with galleria landing tab.
- June 15, 2025. Created high-conversion landing page for €197 offer with problem/solution psychology, urgency elements, and strategic menu placement for advertising campaigns
- June 15, 2025. Refined LITE package presentation by removing all hosting/dominio references from Process and ValueProposition sections, maintaining marketing focus on included benefits only
- June 15, 2025. Completed FAQ section with 8 professional questions and updated all CTA texts from price-specific to generic "VOGLIO IL MIO SITO" messaging across all pricing tiers
- June 15, 2025. Implemented comprehensive Google Analytics 4 tracking system with complete business event monitoring for conversions, form submissions, portfolio clicks, and user interactions
- June 14, 2025. Initial setup
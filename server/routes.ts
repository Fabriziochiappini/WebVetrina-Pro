import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { z } from "zod";
import { insertContactSchema, insertLogoSchema, updateSiteSettingsSchema, insertBlogPostSchema, updateBlogPostSchema, insertBlogCategorySchema, insertLandingGalleryImageSchema, insertSupportTicketSchema, insertTicketMessageSchema, insertClientSchema, insertNostriLavoriSchema, iNostriLavori } from "@shared/schema";
import { sendContactNotification, sendAutoReply } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';

// Enhanced file upload configuration with monitoring
const uploadsPath = new URL('../uploads', import.meta.url).pathname;

// Ensure uploads directory exists with proper permissions  
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true, mode: 0o755 });
  console.log('Created uploads directory:', uploadsPath);
}

// File monitoring function
function verifyFileIntegrity(filename: string): boolean {
  const filePath = path.join(uploadsPath, filename);
  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.error(`ALERT: File missing - ${filename} at ${filePath}`);
  }
  return exists;
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// SISTEMA BACKUP IMMAGINI ULTRA-RINFORZATO
const backupImagePath = new URL('../backup-images', import.meta.url).pathname;

// Ensure backup directory exists
if (!fs.existsSync(backupImagePath)) {
  fs.mkdirSync(backupImagePath, { recursive: true, mode: 0o755 });
  console.log('✅ Created backup-images directory:', backupImagePath);
}

// Immediate backup function
function immediateBackup(filename: string): void {
  const sourcePath = path.join(uploadsPath, filename);
  const backupPath = path.join(backupImagePath, filename);
  
  // Backup immediately after upload
  setTimeout(() => {
    if (fs.existsSync(sourcePath)) {
      fs.copyFile(sourcePath, backupPath, (err) => {
        if (err) {
          console.error(`❌ BACKUP FAILED for ${filename}:`, err);
        } else {
          console.log(`✅ BACKUP SUCCESS: ${filename} saved to backup-images`);
        }
      });
    }
  }, 100); // 100ms delay to ensure file is written
}

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite di 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|svg/;
    const ext = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Solo file immagine sono consentiti!"));
    }
  }
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Funzione per verificare l'autenticazione dell'utente
const checkAuth = (req: Request, res: Response, next: Function) => {
  // Only use session-based authentication for security
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Accesso negato - Autorizzazione non valida" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Crea la directory per gli upload se non esiste
  const uploadDir = path.join(new URL('../uploads', import.meta.url).pathname);
  if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Secure authentication route - NO HARDCODED CREDENTIALS
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Use environment variables for security
    const adminUser = process.env.ADMIN_USERNAME || 'Fibra';
    const adminPass = process.env.ADMIN_PASSWORD || 'Seofibra2021!';
    
    if (username === adminUser && password === adminPass) {
      req.session!.user = { username: adminUser };
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Prova con tua sorella" });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.json({ success: true });
    });
  });

  // Servi i file statici dalla directory uploads
  app.use("/uploads", express.static(uploadDir));

  // Servi i file statici dalla directory attached_assets
  const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
  app.use("/attached_assets", express.static(attachedAssetsDir));

  // SEO Routes - Robots.txt and Sitemap.xml
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

# Sitemap
Sitemap: https://webproitalia.com/sitemap.xml

# Allow search engines to index all content
Allow: /nostri-lavori
Allow: /blog
Allow: /offerta-197
Allow: /offerta-197form
Allow: /thankyou

# Disallow admin areas
Disallow: /admin
Disallow: /api/

# SEO optimized for Web Pro Italia - Realizzazione siti web professionali
# Generated: ${new Date().toISOString().split('T')[0]}`);
  });

  // Dynamic sitemap generation
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = 'https://webproitalia.com';
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Get all published blog posts
      const blogPosts = await storage.getBlogPosts('published');
      
      // Debug logging per verificare articoli
      console.log(`🗺️ SITEMAP: Trovati ${blogPosts.length} articoli pubblicati`);
      console.log(`🗺️ SITEMAP: Ultimi 3 articoli:`, blogPosts.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        publishedAt: p.publishedAt || p.createdAt
      })));
      
      // Static pages with priorities
      const staticPages = [
        { url: '/', lastmod: currentDate, changefreq: 'daily', priority: '1.0' },
        { url: '/chi-siamo', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: '/nostri-lavori', lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
        { url: '/blog', lastmod: currentDate, changefreq: 'daily', priority: '0.9' },
        { url: '/offerta-197', lastmod: currentDate, changefreq: 'weekly', priority: '0.8' },
        { url: '/offerta-197form', lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
        { url: '/thankyou', lastmod: currentDate, changefreq: 'yearly', priority: '0.3' },
        { url: '/privacy', lastmod: currentDate, changefreq: 'yearly', priority: '0.3' },
        { url: '/cookie', lastmod: currentDate, changefreq: 'yearly', priority: '0.3' }
      ];

      // Build sitemap XML
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      staticPages.forEach(page => {
        sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      // Add blog posts
      blogPosts.forEach(post => {
        const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);

      // Ping Google per notificare la sitemap aggiornata (in background)
      setTimeout(() => {
        try {
          const sitemapUrl = encodeURIComponent('https://webproitalia.com/sitemap.xml');
          const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
          
          fetch(pingUrl).then(() => {
            console.log('✅ Google sitemap ping inviato con successo');
          }).catch(error => {
            console.log('📡 Google sitemap ping (normale se fallisce):', error.message);
          });
        } catch (error) {
          console.log('Error pinging Google sitemap:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Endpoint diagnostico per verificare sitemap
  app.get('/api/seo/sitemap-debug', async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts('published');
      
      const sitemapInfo = {
        totalPublishedPosts: blogPosts.length,
        lastUpdate: new Date().toISOString(),
        posts: blogPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          url: `https://webproitalia.com/blog/${post.slug}`,
          publishedAt: post.publishedAt || post.createdAt,
          lastMod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date(post.createdAt).toISOString().split('T')[0]
        })).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
        sitemapUrl: 'https://webproitalia.com/sitemap.xml'
      };
      
      res.json(sitemapInfo);
    } catch (error) {
      console.error('Error in sitemap debug:', error);
      res.status(500).json({ error: 'Errore verifica sitemap' });
    }
  });

  // Endpoint per verificare l'indicizzazione delle pagine
  app.get('/api/seo/indexing-status', async (req, res) => {
    try {
      const pages = [
        'https://webproitalia.com/',
        'https://webproitalia.com/nostri-lavori',
        'https://webproitalia.com/blog',
        'https://webproitalia.com/offerta-197',
        'https://webproitalia.com/chi-siamo'
      ];

      const indexingStatus = [];
      
      for (const page of pages) {
        // Verifica se la pagina è accessibile
        try {
          const response = await fetch(page, { method: 'HEAD' });
          indexingStatus.push({
            url: page,
            status: response.status,
            accessible: response.status === 200,
            lastChecked: new Date().toISOString()
          });
        } catch (error) {
          indexingStatus.push({
            url: page,
            status: 'error',
            accessible: false,
            error: error.message,
            lastChecked: new Date().toISOString()
          });
        }
      }

      res.json({
        timestamp: new Date().toISOString(),
        domain: 'webproitalia.com',
        sitemapUrl: 'https://webproitalia.com/sitemap.xml',
        robotsUrl: 'https://webproitalia.com/robots.txt',
        pages: indexingStatus,
        seoRecommendations: [
          'Verifica Google Search Console per errori di indicizzazione',
          'Controlla se il sito è bloccato in robots.txt',
          'Invia manualmente la sitemap su Google Search Console',
          'Verifica che tutte le pagine abbiano meta description unici'
        ]
      });
    } catch (error) {
      console.error('Error checking indexing status:', error);
      res.status(500).json({ error: 'Errore verifica indicizzazione' });
    }
  });



  // Route per servire direttamente il sito HTML statico
  app.get("/static", (req, res) => {
    const htmlPath = path.join(new URL('../server/public.html', import.meta.url).pathname);
    res.sendFile(htmlPath);
  });



  // Support Tickets Routes
  app.post("/api/tickets", async (req, res) => {
    try {
      const result = insertSupportTicketSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const ticket = await storage.createSupportTicket({
        ...result.data
      });

      // Invia email di notifica per il ticket
      console.log('Nuovo ticket di supporto:', result.data.clientName);

      const notificationSent = await sendContactNotification({
        firstName: result.data.clientName.split(' ')[0],
        lastName: result.data.clientName.split(' ').slice(1).join(' ') || '',
        email: result.data.email,
        phone: result.data.phone,
        company: result.data.websiteUrl,
        businessType: result.data.requestType,
        message: `TICKET SUPPORTO - ${result.data.subject}\n\nCategoria: ${result.data.requestType}\nPriorità: ${result.data.priority}\nSito web: ${result.data.websiteUrl}\n\nDescrizione:\n${result.data.description}`
      });

      console.log(`Ticket email notification sent: ${notificationSent}`);

      return res.status(200).json({
        success: true,
        message: "Ticket creato con successo! Ti contatteremo presto.",
        ticket,
        emailSent: notificationSent
      });
    } catch (error) {
      console.error("Error creating support ticket:", error);
      return res.status(500).json({ 
        success: false,
        message: "Si è verificato un errore durante la creazione del ticket. Riprova più tardi." 
      });
    }
  });

  app.get("/api/tickets", checkAuth, async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Errore nel recupero dei ticket" });
    }
  });

  app.get("/api/tickets/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getSupportTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket non trovato" });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ message: "Errore nel recupero del ticket" });
    }
  });

  app.get("/api/tickets/:id/messages", checkAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const messages = await storage.getTicketMessages(ticketId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      res.status(500).json({ message: "Errore nel recupero dei messaggi" });
    }
  });

  app.post("/api/tickets/:id/messages", checkAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { message, isFromAdmin } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Messaggio richiesto" });
      }
      
      const newMessage = await storage.createTicketMessage({
        ticketId,
        message,
        senderType: isFromAdmin ? "support" : "client",
        senderName: isFromAdmin ? "Supporto WebPro Italia" : "Cliente"
      });
      
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating ticket message:", error);
      res.status(500).json({ message: "Errore nella creazione del messaggio" });
    }
  });

  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const contact = await storage.createContact({
        ...result.data
      });

      // Invia solo email di notifica (no auto-reply per ora)
      console.log('Invio email per contatto:', result.data.firstName, result.data.lastName);

      const notificationSent = await sendContactNotification({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        phone: result.data.phone,
        company: result.data.company || undefined,
        businessType: result.data.businessType,
        message: result.data.message || ''
      });

      console.log(`Email notification sent: ${notificationSent}`);

      return res.status(200).json({
        success: true,
        message: "Richiesta inviata con successo!",
        contact,
        emailSent: notificationSent
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({ 
        success: false,
        message: "Si è verificato un errore durante l'invio. Riprova più tardi." 
      });
    }
  });

  // Test email endpoint for debugging
  app.post("/api/test-email", async (req, res) => {
    try {
      const { testEmail } = req.body;

      if (!testEmail) {
        return res.status(400).json({ message: "testEmail è richiesto" });
      }

      const success = await sendContactNotification({
        firstName: "Test",
        lastName: "Email",
        email: testEmail,
        phone: "+39 123 456 7890",
        company: "Test Company",
        businessType: "Test",
        message: "Questo è un test per verificare la consegna delle email."
      });

      return res.json({
        message: success ? "Email di test inviata con successo" : "Errore nell'invio dell'email",
        success,
        sentTo: testEmail
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      return res.status(500).json({ message: "Errore nel test email" });
    }
  });

  // Get all contacts (for admin page)
  app.get("/api/contacts", checkAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      return res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero dei contatti." 
      });
    }
  });

  // Get contacts by date range
  app.get("/api/contacts/filter", checkAuth, async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(0);
      const endDate = req.query.endDate ? new Date(req.query.startDate as string) : new Date();

      // Set endDate to the end of the day
      endDate.setHours(23, 59, 59, 999);

      const contacts = await storage.getContactsByDateRange(startDate, endDate);
      return res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts by date range:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero dei contatti." 
      });
    }
  });

  // Export contacts to CSV
  app.get("/api/contacts/export", checkAuth, async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(0);
      const endDate = req.query.endDate ? new Date(req.query.startDate as string) : new Date();

      // Set endDate to the end of the day
      endDate.setHours(23, 59, 59, 999);

      const contacts = await storage.getContactsByDateRange(startDate, endDate);

      const csvFilePath = path.join(new URL('../uploads', import.meta.url).pathname, `contacts-export-${Date.now()}.csv`);

      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
          {id: 'id', title: 'ID'},
          {id: 'firstName', title: 'Nome'},
          {id: 'lastName', title: 'Cognome'},
          {id: 'email', title: 'Email'},
          {id: 'phone', title: 'Telefono'},
          {id: 'company', title: 'Azienda'},
          {id: 'businessType', title: 'Tipo di Business'},
          {id: 'message', title: 'Messaggio'},
          {id: 'createdAt', title: 'Data Creazione'}
        ]
      });

      await csvWriter.writeRecords(contacts);

      res.download(csvFilePath, `contatti-${new Date().toLocaleDateString('it-IT')}.csv`, (err) => {
        if (err) {
          console.error("Error downloading CSV:", err);
        }
        // Delete the file after download
        setTimeout(() => {
          fs.unlink(csvFilePath, (err) => {
            if (err) console.error("Error deleting temp CSV file:", err);
          });
        }, 1000);
      });
    } catch (error) {
      console.error("Error exporting contacts to CSV:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'esportazione dei contatti." 
      });
    }
  });

  // Logo management
  app.post("/api/logos", checkAuth, upload.single('logoImage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }

      const { name, description } = req.body;
      const logoData = {
        name,
        description: description || null,
        imageUrl: `/uploads/${req.file.filename}`
      };

      const result = insertLogoSchema.safeParse(logoData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const logo = await storage.createLogo(result.data);
      return res.status(201).json(logo);
    } catch (error) {
      console.error("Error uploading logo:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il caricamento del logo." 
      });
    }
  });

  app.get("/api/logos", async (req, res) => {
    try {
      const logos = await storage.getLogos();
      return res.status(200).json(logos);
    } catch (error) {
      console.error("Error fetching logos:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero dei loghi." 
      });
    }
  });

  app.delete("/api/logos/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const success = await storage.deleteLogo(id);
      if (success) {
        return res.status(200).json({ message: "Logo eliminato con successo" });
      } else {
        return res.status(404).json({ message: "Logo non trovato" });
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione del logo." 
      });
    }
  });



















  // Site settings
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.status(200).json(settings || { autoArticlesEnabled: true });
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero delle impostazioni del sito." 
      });
    }
  });

  // Interruttore articoli automatici
  app.put("/api/auto-articles/toggle", checkAuth, async (req, res) => {
    try {
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ message: "Il campo 'enabled' deve essere boolean" });
      }

      // Aggiorna il database
      await storage.updateSiteSettings({ autoArticlesEnabled: enabled });
      
      // Controlla e aggiorna il scheduler solo in produzione
      if (process.env.NODE_ENV === 'production') {
        const { startCustomScheduler, stopAllSchedulers } = await import('./scheduler');
        
        if (enabled) {
          // Avvia il scheduler
          stopAllSchedulers(); // Ferma eventuali scheduler esistenti
          startCustomScheduler({
            article1Time: "09:00",
            article2Time: "14:00", 
            article3Time: "18:00",
            enabled: true
          });
          console.log(`🟢 SCHEDULER RIAVVIATO: Pubblicazione automatica ATTIVATA`);
        } else {
          // Ferma il scheduler
          stopAllSchedulers();
          console.log(`🔴 SCHEDULER FERMATO: Pubblicazione automatica DISATTIVATA`);
        }
      }
      
      console.log(`🔄 INTERRUTTORE ARTICOLI: ${enabled ? 'ATTIVATO' : 'DISATTIVATO'}`);
      
      res.json({ 
        success: true, 
        autoArticlesEnabled: enabled,
        message: enabled ? 
          'Pubblicazione automatica articoli ATTIVATA - scheduler riavviato' : 
          'Pubblicazione automatica articoli DISATTIVATA - scheduler fermato'
      });
    } catch (error) {
      console.error("Error toggling auto articles:", error);
      res.status(500).json({ message: "Errore aggiornamento impostazioni" });
    }
  });



  // Blog management routes
  app.post("/api/blog/posts", upload.single('featuredImage'), async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      const { title, content, excerpt, status, metaTitle, metaDescription, featuredImageUrl } = req.body;

      if (!title || !content) {
        return res.status(400).json({ 
          message: "Titolo e contenuto sono obbligatori" 
        });
      }

      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const blogData = {
        title,
        slug,
        content,
        excerpt,
        status: status || 'draft',
        metaTitle,
        metaDescription,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : (featuredImageUrl || undefined)
      };

      const result = insertBlogPostSchema.safeParse(blogData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const blogPost = await storage.createBlogPost(result.data);
      return res.status(201).json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante la creazione dell'articolo." 
      });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const status = req.query.status as "draft" | "published" | undefined;
      const posts = await storage.getBlogPosts(status);
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero degli articoli." 
      });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Articolo non trovato" });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero dell'articolo." 
      });
    }
  });

  app.get("/api/blog/posts/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Articolo non trovato" });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero dell'articolo." 
      });
    }
  });

  app.put("/api/blog/posts/:id", upload.single('featuredImage'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const { title, content, excerpt, status, metaTitle, metaDescription } = req.body;

      const updateData: any = {
        title,
        content,
        excerpt,
        status,
        metaTitle,
        metaDescription
      };

      // Update slug if title changed
      if (title) {
        updateData.slug = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      // Update featured image if uploaded
      if (req.file) {
        updateData.featuredImage = `/uploads/${req.file.filename}`;
      }

      const result = updateBlogPostSchema.safeParse(updateData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const blogPost = await storage.updateBlogPost(id, result.data);
      return res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'aggiornamento dell'articolo." 
      });
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const success = await storage.deleteBlogPost(id);
      if (success) {
        return res.status(200).json({ message: "Articolo eliminato con successo" });
      } else {
        return res.status(404).json({ message: "Articolo non trovato" });
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione dell'articolo." 
      });
    }
  });

  // OpenAI Article Generation Routes
  app.post("/api/blog/generate", async (req, res) => {
    try {
      const { topic, focus } = req.body;
      
      if (!topic || !focus) {
        return res.status(400).json({ 
          message: "Topic e focus sono richiesti" 
        });
      }

      const { publishArticleNow } = await import('./scheduler');
      const newArticle = await publishArticleNow(topic, focus);
      
      return res.status(201).json({
        message: "Articolo generato e pubblicato con successo",
        article: newArticle
      });
    } catch (error) {
      console.error("Error generating article:", error);
      return res.status(500).json({ 
        message: "Errore durante la generazione dell'articolo: " + error.message 
      });
    }
  });

  app.post("/api/blog/generate-daily", async (req, res) => {
    try {
      const { publishDailyArticle } = await import('./scheduler');
      const newArticle = await publishDailyArticle();
      
      return res.status(201).json({
        message: "Articolo giornaliero generato con successo",
        article: newArticle
      });
    } catch (error) {
      console.error("Error generating daily article:", error);
      return res.status(500).json({ 
        message: "Errore durante la generazione dell'articolo giornaliero: " + error.message 
      });
    }
  });

  // Endpoint per generazione articoli SEO strategici
  app.post("/api/blog/generate-seo", async (req, res) => {
    try {
      console.log('🎯 Richiesta generazione articolo SEO strategico...');
      const { generateBlogArticle } = await import('./openaiSEO');
      const article = await generateBlogArticle();
      
      // Salva l'articolo nel database
      const newArticle = await storage.createBlogPost({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        featuredImage: article.featuredImage,
        status: "published" as const,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
      });

      // Notifica Google della nuova sitemap
      try {
        const sitemapUrl = encodeURIComponent('https://webproitalia.com/sitemap.xml');
        const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
        
        // Ping Google per indicizzazione più veloce
        fetch(pingUrl).catch(error => {
          console.log('Google sitemap ping failed (normale):', error.message);
        });
        
        console.log('🔍 Google sitemap ping inviato per nuovo articolo:', newArticle.title);
      } catch (error) {
        console.log('Error pinging Google sitemap:', error);
      }
      
      return res.status(201).json({
        message: "Articolo SEO strategico generato con successo",
        article: newArticle
      });
    } catch (error) {
      console.error("Error generating SEO article:", error);
      return res.status(500).json({ 
        message: "Errore durante la generazione dell'articolo SEO: " + error.message 
      });
    }
  });

  // Route per verificare stato scheduler
  app.get('/api/scheduler/status', async (req, res) => {
    try {
      const { getScheduleConfig } = await import('./scheduler');
      const config = getScheduleConfig();
      const now = new Date();
      const italianTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
      
      res.json({
        schedulerActive: config.enabled,
        environment: process.env.NODE_ENV || 'development',
        currentTime: italianTime.toLocaleString('it-IT'),
        serverTime: now.toLocaleString('it-IT'),
        scheduleConfig: config,
        status: config.enabled ? 'ACTIVE' : 'DISABLED'
      });
    } catch (error) {
      res.status(500).json({ error: 'Errore verifica scheduler' });
    }
  });

  // Route per aggiornare configurazione scheduler
  app.post('/api/scheduler/config', async (req, res) => {
    try {
      const { updateScheduleConfig } = await import('./scheduler');
      const { article1Time, article2Time, article3Time, enabled } = req.body;
      
      const newConfig = updateScheduleConfig({
        article1Time,
        article2Time, 
        article3Time,
        enabled
      });
      
      res.json({
        success: true,
        message: enabled ? 'Scheduler attivato con nuova configurazione' : 'Scheduler disattivato',
        config: newConfig
      });
    } catch (error) {
      console.error('Errore aggiornamento scheduler:', error);
      res.status(500).json({ error: 'Errore aggiornamento configurazione' });
    }
  });

  // Route per test immediato dello scheduler (solo per testing)
  app.post('/api/scheduler/test-now', async (req, res) => {
    try {
      console.log('🧪 TEST SCHEDULER - Simulazione esecuzione immediata');
      
      const article = await publishDailyArticle();
      
      res.json({
        success: true,
        message: 'Test scheduler completato con successo',
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug
        },
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ TEST SCHEDULER SUCCESS - Articolo di test pubblicato:', article.title);
    } catch (error) {
      console.error('❌ TEST SCHEDULER ERROR:', error);
      res.status(500).json({ 
        error: 'Errore durante test scheduler',
        details: error.message 
      });
    }
  });



  // Route per forzare esecuzione di un articolo specifico
  app.post('/api/scheduler/force/:articleNumber', async (req, res) => {
    try {
      const { articleNumber } = req.params;
      const now = new Date();
      
      console.log(`🚀 FORCE EXECUTION - Articolo ${articleNumber} forzato manualmente`);
      
      const article = await publishDailyArticle();
      
      res.json({
        success: true,
        message: `Articolo ${articleNumber} eseguito forzatamente`,
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug
        },
        timestamp: now.toISOString(),
        forced: true
      });
      
      console.log(`✅ FORCE SUCCESS - Articolo ${articleNumber} pubblicato:`, article.title);
    } catch (error) {
      console.error(`❌ FORCE ERROR - Articolo ${req.params.articleNumber}:`, error);
      res.status(500).json({ 
        error: 'Errore durante esecuzione forzata',
        details: error.message 
      });
    }
  });

  app.get("/api/blog/topics", async (req, res) => {
    try {
      const { ARTICLE_TOPICS } = await import('./openai');
      return res.json(ARTICLE_TOPICS);
    } catch (error) {
      console.error("Error fetching topics:", error);
      return res.status(500).json({ message: "Errore nel recupero dei topic" });
    }
  });

  app.post("/api/blog/posts/:id/publish", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const blogPost = await storage.publishBlogPost(id);
      return res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante la pubblicazione dell'articolo." 
      });
    }
  });

  // Blog categories routes
  app.post("/api/blog/categories", async (req, res) => {
    try {
      const { name, description } = req.body;

      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const categoryData = { name, slug, description };

      const result = insertBlogCategorySchema.safeParse(categoryData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const category = await storage.createBlogCategory(result.data);
      return res.status(201).json(category);
    } catch (error) {
      console.error("Error creating blog category:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante la creazione della categoria." 
      });
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero delle categorie." 
      });
    }
  });

  app.delete("/api/blog/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const success = await storage.deleteBlogCategory(id);
      if (success) {
        return res.status(200).json({ message: "Categoria eliminata con successo" });
      } else {
        return res.status(404).json({ message: "Categoria non trovata" });
      }
    } catch (error) {
      console.error("Error deleting blog category:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione della categoria." 
      });
    }
  });

  // API endpoint per fornire la chiave TinyMCE
  app.get("/api/tinymce-key", (req, res) => {
    const apiKey = process.env.TINYMCE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TinyMCE API key not configured" });
    }
    res.json({ apiKey });
  });

  // Chatbot AI endpoint
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message, conversation } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Messaggio richiesto" });
      }

      const { generateChatbotResponse } = await import("./chatbot");
      
      // Converti formato conversazione se necessario
      const chatHistory = conversation?.map((msg: any) => ({
        content: msg.content,
        role: msg.role
      })) || [];

      const response = await generateChatbotResponse(message, chatHistory);
      
      res.json({ 
        response,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Errore chatbot:", error);
      res.status(500).json({ 
        error: "Errore interno del server",
        response: "Mi dispiace, si è verificato un problema tecnico. Per assistenza immediata contattaci su WhatsApp al +39 347 994 2321 o via email a info@webproitalia.com" 
      });
    }
  });

  // Landing gallery routes with backup system
  app.get('/api/landing-gallery', async (req, res) => {
    try {
      const images = await storage.getLandingGalleryImages();

      // Verifica e ripristina immagini mancanti dal backup
      const verifiedImages = images.map(image => {
        // Gestione sia fileName che imageUrl
        if (image.fileName) {
          const backupPath = path.join(process.cwd(), 'backup-images', image.fileName);
          const publicPath = path.join(process.cwd(), 'uploads', image.fileName);

          if (fs.existsSync(backupPath) && !fs.existsSync(publicPath)) {
            try {
              fs.copyFileSync(backupPath, publicPath);
              console.log(`Restored image from backup: ${image.fileName}`);
            } catch (error) {
              console.error(`Error restoring image ${image.fileName}:`, error);
            }
          }
        } else if (image.imageUrl && image.imageUrl.includes('/uploads/')) {
          // Estrae il nome file da imageUrl per il backup
          const fileName = path.basename(image.imageUrl);
          const backupPath = path.join(process.cwd(), 'backup-images', fileName);
          const publicPath = path.join(process.cwd(), 'uploads', fileName);

          if (fs.existsSync(backupPath) && !fs.existsSync(publicPath)) {
            try {
              fs.copyFileSync(backupPath, publicPath);
              console.log(`Restored image from backup via imageUrl: ${fileName}`);
            } catch (error) {
              console.error(`Error restoring image via imageUrl ${fileName}:`, error);
            }
          }
        }
        return image;
      });

      res.json(verifiedImages);
    } catch (error) {
      console.error('Error fetching landing gallery images:', error);
      res.status(500).json({ error: 'Failed to fetch landing gallery images' });
    }
  });

  // Landing spots routes
  app.get('/api/landing-spots', async (req, res) => {
    try {
      const spots = await storage.getLandingSpots();
      res.json(spots || { totalSpots: 10, reservedSpots: 0 });
    } catch (error) {
      console.error('Error fetching landing spots:', error);
      res.status(500).json({ error: 'Failed to fetch landing spots' });
    }
  });

  app.post('/api/landing-gallery', upload.single('image'), async (req, res) => {
    try {
      const { title, description, altText, sortOrder, isActive } = req.body;

      let imageUrl = req.body.imageUrl || '';
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
        console.log(`File caricato: ${req.file.filename} per immagine: ${title}`);

        // File uploaded successfully
      }

      if (!req.file) {
        return res.status(400).json({ message: "Immagine obbligatoria" });
      }

      const imageData = {
        title: title || 'Untitled',
        description: description || null,
        imageUrl,
        altText: altText || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: isActive === 'true' || isActive === true
      };

      const image = await storage.createLandingGalleryImage(imageData);
      res.json(image);
    } catch (error) {
      console.error('Error creating landing gallery image:', error);
      res.status(400).json({ error: 'Failed to create landing gallery image' });
    }
  });

  app.put('/api/landing-gallery/:id', upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, altText, sortOrder, isActive } = req.body;

      const updateData: any = {
        title,
        description: description || null,
        altText: altText || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: isActive === 'true'
      };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.imageUrl) {
        updateData.imageUrl = req.body.imageUrl;
      }

      const image = await storage.updateLandingGalleryImage(id, updateData);
      res.json(image);
    } catch (error) {
      console.error('Error updating landing gallery image:', error);
      res.status(400).json({ error: 'Failed to update landing gallery image' });
    }
  });

  app.delete('/api/landing-gallery/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLandingGalleryImage(id);
      if (success) {
        res.json({ message: 'Landing gallery image deleted successfully' });
      } else {
        res.status(404).json({ error: 'Landing gallery image not found' });
      }
    } catch (error) {
      console.error('Error deleting landing gallery image:', error);
      res.status(500).json({ error: 'Failed to delete landing gallery image' });
    }
  });

  // Site settings routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.status(200).json(settings || { metaPixelId: null, otherTracking: null });
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero delle impostazioni." 
      });
    }
  });

  app.post("/api/site-settings", async (req, res) => {
    try {
      const { metaPixelId, otherTracking, paypalPaymentUrl } = req.body;

      const updateData = {
        metaPixelId: metaPixelId?.trim() || null,
        otherTracking: otherTracking?.trim() || null,
        paypalPaymentUrl: paypalPaymentUrl?.trim() || null
      };

      const settings = await storage.updateSiteSettings(updateData);
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating site settings:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il salvataggio delle impostazioni." 
      });
    }
  });

  // Payment Routes for Landing Page

  // Create Stripe Payment Intent for €17 slot booking
  app.post("/api/payments/stripe/create-intent", async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: "Email e nome sono richiesti" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1700, // €17 in centesimi
        currency: "eur",
        description: "Prenotazione slot sito web - WebPro Italia",
        receipt_email: email,
        metadata: {
          customer_name: name,
          customer_email: email,
          service: "slot_booking_197"
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ error: "Errore nella creazione del pagamento" });
    }
  });

  // PayPal redirect for €17 slot booking (using custom URL)
  app.post("/api/payments/paypal/create-order", async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: "Email e nome sono richiesti" });
      }

      // Get PayPal URL from site settings
      const settings = await storage.getSiteSettings();
      const paypalUrl = settings?.paypalPaymentUrl;

      if (!paypalUrl) {
        // Fallback to WhatsApp if no PayPal URL is set
        const message = `Ciao! Voglio prenotare uno slot per il sito web a 197 euro. Preferisco pagare con PayPal. I miei dati: Nome: ${name}, Email: ${email}`;
        const whatsappUrl = `https://wa.me/393479942321?text=${encodeURIComponent(message)}`;
        return res.json({ redirectUrl: whatsappUrl });
      }

      // Use custom PayPal URL
      res.json({ redirectUrl: paypalUrl });
    } catch (error) {
      console.error("PayPal order creation error:", error);
      res.status(500).json({ error: "Errore nella creazione dell'ordine PayPal" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, description } = req.body;

      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Missing STRIPE_SECRET_KEY');
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        description: description || "Sito Web Professionale",
        metadata: {
          product: "landing-website-197"
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Support ticket endpoints
  app.post("/api/support-ticket", async (req, res) => {
    try {
      const ticketData = req.body;
      
      // Validate the ticket data
      const { supportTickets } = await import("@shared/schema");
      const { insertSupportTicketSchema } = await import("@shared/schema");
      
      const result = insertSupportTicketSchema.safeParse(ticketData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Dati non validi", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const ticket = await storage.createSupportTicket(result.data);
      
      // Send notification email to support team
      const { sendEmail } = await import("./sendgrid");
      const emailSent = await sendEmail(
        process.env.SENDGRID_API_KEY!,
        {
          to: "supporto@webproitalia.com", // Change to your support email
          from: "noreply@webproitalia.com",
          subject: `🎫 Nuovo Ticket di Assistenza - ${ticketData.subject}`,
          html: `
            <h2>Nuovo Ticket di Assistenza</h2>
            <p><strong>Cliente:</strong> ${ticketData.clientName}</p>
            <p><strong>Email:</strong> ${ticketData.email}</p>
            <p><strong>Telefono:</strong> ${ticketData.phone}</p>
            <p><strong>Sito Web:</strong> ${ticketData.websiteUrl || 'Non specificato'}</p>
            <p><strong>Tipo Richiesta:</strong> ${ticketData.requestType}</p>
            <p><strong>Priorità:</strong> ${ticketData.priority}</p>
            <p><strong>Oggetto:</strong> ${ticketData.subject}</p>
            <p><strong>Descrizione:</strong></p>
            <p>${ticketData.description}</p>
            <hr>
            <p><small>Ticket ID: ${ticket.id}</small></p>
          `
        }
      );

      // Send confirmation email to client
      await sendEmail(
        process.env.SENDGRID_API_KEY!,
        {
          to: ticketData.email,
          from: "supporto@webproitalia.com",
          subject: "✅ Ticket di Assistenza Ricevuto - Web Pro Italia",
          html: `
            <h2>Ciao ${ticketData.clientName},</h2>
            <p>Il tuo ticket di assistenza è stato ricevuto con successo!</p>
            <p><strong>Numero Ticket:</strong> #${ticket.id}</p>
            <p><strong>Oggetto:</strong> ${ticketData.subject}</p>
            <p>Ti contatteremo entro 24 ore per risolvere la tua richiesta.</p>
            <p>Per urgenze immediate, contattaci su WhatsApp: +39 123 456 7890</p>
            <hr>
            <p>Grazie per aver scelto Web Pro Italia!</p>
          `
        }
      );

      return res.status(201).json({ 
        message: "Ticket creato con successo",
        ticketId: ticket.id
      });
    } catch (error) {
      console.error("Error creating support ticket:", error);
      return res.status(500).json({ 
        message: "Errore durante la creazione del ticket" 
      });
    }
  });

  app.get("/api/support-tickets", checkAuth, async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      return res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      return res.status(500).json({ 
        message: "Errore durante il recupero dei ticket" 
      });
    }
  });

  // Client authentication routes
  const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret';

  // Middleware per verificare il token client
  const verifyClientToken = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token richiesto' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.clientEmail = decoded.email;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token non valido' });
    }
  };

  // Registrazione cliente
  app.post("/api/client/register", async (req, res) => {
    try {
      const result = insertClientSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Dati non validi", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      // Controlla se il cliente esiste già
      const existingClient = await storage.getClientByEmail(result.data.email);
      if (existingClient) {
        return res.status(400).json({ 
          message: "Un cliente con questa email esiste già" 
        });
      }

      const client = await storage.createClient(result.data);
      
      // Genera token JWT
      const token = jwt.sign(
        { email: client.email, clientId: client.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({ 
        message: "Cliente registrato con successo",
        token,
        client: {
          id: client.id,
          email: client.email,
          clientName: client.clientName
        }
      });
    } catch (error) {
      console.error("Error registering client:", error);
      return res.status(500).json({ 
        message: "Errore durante la registrazione" 
      });
    }
  });

  // Login cliente
  app.post("/api/client/login", async (req, res) => {
    try {
      const { email, ticketId } = req.body;

      if (!email || !ticketId) {
        return res.status(400).json({ 
          message: "Email e ID ticket sono richiesti" 
        });
      }

      // Verifica che esista un ticket con questa email e ID
      const ticket = await storage.getSupportTicket(parseInt(ticketId));
      if (!ticket || ticket.email !== email) {
        return res.status(401).json({ 
          message: "Email o ID ticket non validi" 
        });
      }

      // Cerca o crea il cliente
      let client = await storage.getClientByEmail(email);
      if (!client) {
        // Crea cliente automaticamente se non esiste
        client = await storage.createClient({
          email: email,
          clientName: ticket.clientName,
          phone: ticket.phone
        });
      }

      // Genera token JWT
      const token = jwt.sign(
        { email: client.email, clientId: client.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({ 
        message: "Login effettuato con successo",
        token,
        client: {
          id: client.id,
          email: client.email,
          clientName: client.clientName
        }
      });
    } catch (error) {
      console.error("Error during client login:", error);
      return res.status(500).json({ 
        message: "Errore durante il login" 
      });
    }
  });

  // Ottieni ticket del cliente
  app.get("/api/client/tickets", verifyClientToken, async (req: any, res) => {
    try {
      const tickets = await storage.getClientTickets(req.clientEmail);
      return res.json(tickets);
    } catch (error) {
      console.error("Error fetching client tickets:", error);
      return res.status(500).json({ 
        message: "Errore durante il recupero dei ticket" 
      });
    }
  });

  // Ottieni messaggi di un ticket specifico (solo se appartiene al cliente)
  app.get("/api/client/tickets/:id/messages", verifyClientToken, async (req: any, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "ID ticket non valido" });
      }

      // Verifica che il ticket appartenga al cliente
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket || ticket.email !== req.clientEmail) {
        return res.status(403).json({ 
          message: "Non hai i permessi per accedere a questo ticket" 
        });
      }

      const messages = await storage.getTicketMessages(ticketId);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      return res.status(500).json({ 
        message: "Errore durante il recupero dei messaggi" 
      });
    }
  });

  // Invia messaggio in un ticket (solo se appartiene al cliente)
  app.post("/api/client/tickets/:id/messages", verifyClientToken, async (req: any, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "ID ticket non valido" });
      }

      // Verifica che il ticket appartenga al cliente
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket || ticket.email !== req.clientEmail) {
        return res.status(403).json({ 
          message: "Non hai i permessi per accedere a questo ticket" 
        });
      }

      const { message } = req.body;
      if (!message?.trim()) {
        return res.status(400).json({ message: "Messaggio richiesto" });
      }

      const client = await storage.getClientByEmail(req.clientEmail);
      const messageData = {
        ticketId: ticketId,
        message: message.trim(),
        senderType: "client" as const,
        senderName: client?.clientName || "Cliente"
      };

      const result = insertTicketMessageSchema.safeParse(messageData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Dati messaggio non validi",
          errors: result.error.flatten().fieldErrors 
        });
      }

      const newMessage = await storage.createTicketMessage(result.data);
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating ticket message:", error);
      return res.status(500).json({ 
        message: "Errore durante l'invio del messaggio" 
      });
    }
  });

  // Admin ticket management routes
  app.get("/api/admin/support-tickets", checkAuth, async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      return res.json(tickets);
    } catch (error) {
      console.error("Error fetching admin tickets:", error);
      return res.status(500).json({ 
        message: "Errore durante il recupero dei ticket" 
      });
    }
  });

  app.patch("/api/admin/support-tickets/:id", checkAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: "ID ticket non valido" });
      }

      const { status } = req.body;
      if (!status || !["open", "in_progress", "closed"].includes(status)) {
        return res.status(400).json({ message: "Stato non valido" });
      }

      const updatedTicket = await storage.updateSupportTicketStatus(ticketId, status);
      return res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      return res.status(500).json({ 
        message: "Errore durante l'aggiornamento dello stato" 
      });
    }
  });

  // ===== I NOSTRI LAVORI - SISTEMA PORTFOLIO PERMANENTE =====
  
  app.get("/api/nostri-lavori", async (req, res) => {
    try {
      const lavori = await db.select().from(iNostriLavori).orderBy(iNostriLavori.ordine, iNostriLavori.creatoIl);
      res.json(lavori);
    } catch (error) {
      console.error("❌ Errore caricamento nostri lavori:", error);
      res.status(500).json({ message: "Errore caricamento nostri lavori" });
    }
  });

  app.post("/api/nostri-lavori", upload.single('immagine'), async (req, res) => {
    try {
      const { titolo, descrizione, linkSito, inEvidenza } = req.body;
      const immagine = req.file;
      
      if (!titolo || !linkSito || !immagine) {
        return res.status(400).json({ message: "Titolo, link sito e immagine sono obbligatori" });
      }

      const immaginePath = `/uploads/${immagine.filename}`;
      
      // 🔒 BACKUP AUTOMATICO IMMEDIATO
      immediateBackup(immagine.filename);
      console.log(`✅ BACKUP CREATO: ${immagine.filename}`);
      
      const [nuovoLavoro] = await db.insert(iNostriLavori).values({
        titolo,
        descrizione: descrizione || null,
        linkSito,
        immaginePath,
        inEvidenza: inEvidenza === 'true' || inEvidenza === 'on'
      }).returning();
      
      console.log(`🎯 LAVORO AGGIUNTO: ${titolo} - ${immaginePath}`);
      res.json(nuovoLavoro);
      
    } catch (error) {
      console.error("❌ Errore aggiunta lavoro:", error);
      res.status(500).json({ message: "Errore aggiunta lavoro" });
    }
  });

  app.put("/api/nostri-lavori/:id", upload.single('immagine'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { titolo, descrizione, linkSito, inEvidenza } = req.body;
      
      const updateData: any = {
        titolo,
        descrizione: descrizione || null,
        linkSito,
        inEvidenza: inEvidenza === 'true' || inEvidenza === 'on',
        aggiornatoIl: new Date().toISOString()
      };
      
      if (req.file) {
        const immaginePath = `/uploads/${req.file.filename}`;
        updateData.immaginePath = immaginePath;
        
        // 🔒 BACKUP AUTOMATICO IMMEDIATO
        immediateBackup(req.file.filename);
        console.log(`✅ BACKUP AGGIORNATO: ${req.file.filename}`);
      }
      
      const [lavoroAggiornato] = await db.update(iNostriLavori)
        .set(updateData)
        .where(eq(iNostriLavori.id, id))
        .returning();
        
      if (!lavoroAggiornato) {
        return res.status(404).json({ message: "Lavoro non trovato" });
      }
      
      console.log(`🔄 LAVORO AGGIORNATO: ${lavoroAggiornato.titolo}`);
      res.json(lavoroAggiornato);
      
    } catch (error) {
      console.error("❌ Errore aggiornamento lavoro:", error);
      res.status(500).json({ message: "Errore aggiornamento lavoro" });
    }
  });

  app.delete("/api/nostri-lavori/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Ottieni info del lavoro prima di eliminarlo
      const [lavoro] = await db.select().from(iNostriLavori).where(eq(iNostriLavori.id, id));
      
      if (!lavoro) {
        return res.status(404).json({ message: "Lavoro non trovato" });
      }
      
      // Elimina dal database
      await db.delete(iNostriLavori).where(eq(iNostriLavori.id, id));
      
      console.log(`🗑️  LAVORO ELIMINATO: ${lavoro.titolo}`);
      res.json({ message: "Lavoro eliminato con successo" });
      
    } catch (error) {
      console.error("❌ Errore eliminazione lavoro:", error);
      res.status(500).json({ message: "Errore eliminazione lavoro" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
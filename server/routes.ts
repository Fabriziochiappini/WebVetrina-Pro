import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertLogoSchema, insertPortfolioItemSchema, updateSiteSettingsSchema, insertBlogPostSchema, updateBlogPostSchema, insertBlogCategorySchema, insertLandingGalleryImageSchema } from "@shared/schema";
import { sendContactNotification, sendAutoReply } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import Stripe from "stripe";
import { Client, Environment, OrdersController } from "@paypal/paypal-server-sdk";

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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Initialize PayPal
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
});

const paypalOrdersController = new OrdersController(paypalClient);

// Funzione per verificare l'autenticazione dell'utente
const checkAuth = (req: Request, res: Response, next: Function) => {
  // Per semplicità, accetta una password fissa nell'header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer admin123' || (req.session && req.session.user)) {
    return next();
  }
  return res.status(401).json({ message: "Non autorizzato" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Crea la directory per gli upload se non esiste
  const uploadDir = path.join(new URL('../uploads', import.meta.url).pathname);
  if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Servi i file statici dalla directory uploads
  app.use("/uploads", express.static(uploadDir));

  // Route per servire direttamente il sito HTML statico
  app.get("/static", (req, res) => {
    const htmlPath = path.join(new URL('../server/public.html', import.meta.url).pathname);
    res.sendFile(htmlPath);
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

      // Invia email di notifica e auto-risposta
      const [notificationSent, autoReplySent] = await Promise.all([
        sendContactNotification({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          phone: result.data.phone,
          company: result.data.company || undefined,
          businessType: result.data.businessType,
          message: result.data.message || ''
        }),
        sendAutoReply(result.data.email, result.data.firstName, result.data.lastName)
      ]);

      console.log(`Contact form processed - Notification: ${notificationSent}, Auto-reply: ${autoReplySent}`);

      return res.status(201).json({
        message: "Richiesta inviata con successo!",
        contact,
        emailSent: notificationSent && autoReplySent
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({ 
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
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

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
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

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

  // Portfolio management with improved file handling
  app.post("/api/portfolio", upload.single('coverImage'), async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Foto di copertina richiesta" });
      }

      // Verify file was uploaded successfully and create backup
      const uploadPath = path.join(uploadsPath, file.filename);
      if (!fs.existsSync(uploadPath)) {
        console.error(`Upload failed: File ${file.filename} not found at ${uploadPath}`);
        return res.status(500).json({ message: "Errore nell'upload del file" });
      }

      // Get file stats and verify integrity
      const fileStats = fs.statSync(uploadPath);
      if (fileStats.size !== file.size) {
        console.error(`File size mismatch: expected ${file.size}, got ${fileStats.size}`);
        return res.status(500).json({ message: "Errore nell'integrità del file" });
      }

      console.log(`File uploaded successfully: ${file.filename} (${fileStats.size} bytes)`);

      const { title, description, websiteUrl, featured } = req.body;

      const portfolioData = {
        title,
        description,
        websiteUrl,
        coverImage: `/uploads/${file.filename}`,
        featured: featured === 'on' || featured === 'true'
      };

      const result = insertPortfolioItemSchema.safeParse(portfolioData);
      if (!result.success) {
        // Clean up uploaded file if validation fails
        try {
          fs.unlinkSync(uploadPath);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const portfolioItem = await storage.createPortfolioItem(result.data);
      
      // Verify file still exists after database operation
      if (!fs.existsSync(uploadPath)) {
        console.error(`File lost after database operation: ${file.filename}`);
        return res.status(500).json({ 
          message: "Errore: il file è stato perso durante il salvataggio" 
        });
      }

      console.log(`Portfolio item created successfully with image: ${file.filename}`);
      return res.status(201).json(portfolioItem);
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      // Clean up uploaded file on error
      if (req.file) {
        try {
          const uploadPath = path.join(new URL('../uploads', import.meta.url).pathname, req.file.filename);
          if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }
      return res.status(500).json({ 
        message: "Si è verificato un errore durante la creazione del progetto." 
      });
    }
  });

  // Portfolio routes with enhanced image validation and monitoring
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      
      // Check if images exist for each portfolio item with detailed logging
      const itemsWithImageStatus = items.map(item => {
        const filename = path.basename(item.coverImage);
        const imageExists = verifyFileIntegrity(filename);
        
        if (!imageExists) {
          console.warn(`Portfolio item ${item.id} (${item.title}) missing image: ${filename}`);
        }
        
        return {
          ...item,
          imageExists
        };
      });
      
      // Log summary of missing files
      const missingFiles = itemsWithImageStatus.filter(item => !item.imageExists);
      if (missingFiles.length > 0) {
        console.error(`PORTFOLIO INTEGRITY CHECK: ${missingFiles.length} items with missing images`);
        missingFiles.forEach(item => {
          console.error(`- ID ${item.id}: ${item.title} (${item.coverImage})`);
        });
      }
      
      return res.status(200).json(itemsWithImageStatus);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero degli elementi di portfolio." 
      });
    }
  });

  // Portfolio diagnostics endpoint
  app.get("/api/portfolio/diagnostics", checkAuth, async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      const diagnostics = {
        totalItems: items.length,
        itemsWithValidImages: 0,
        itemsWithMissingImages: 0,
        missingFiles: [] as any[],
        uploadsDirExists: fs.existsSync(uploadsPath),
        uploadsPermissions: fs.existsSync(uploadsPath) ? fs.statSync(uploadsPath).mode.toString(8) : null
      };

      items.forEach(item => {
        const filename = path.basename(item.coverImage);
        const exists = verifyFileIntegrity(filename);
        
        if (exists) {
          diagnostics.itemsWithValidImages++;
        } else {
          diagnostics.itemsWithMissingImages++;
          diagnostics.missingFiles.push({
            id: item.id,
            title: item.title,
            filename: filename,
            expectedPath: path.join(uploadsPath, filename)
          });
        }
      });

      return res.status(200).json(diagnostics);
    } catch (error) {
      console.error("Error running portfolio diagnostics:", error);
      return res.status(500).json({ message: "Errore nella diagnostica" });
    }
  });

  app.get("/api/portfolio/featured", async (req, res) => {
    try {
      const items = await storage.getFeaturedPortfolioItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching featured portfolio items:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero degli elementi in evidenza." 
      });
    }
  });



  app.put("/api/portfolio/:id", upload.single('coverImage'), checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const { title, description, websiteUrl, featured } = req.body;
      
      const portfolioData: any = {
        title,
        description,
        websiteUrl,
        featured: featured === 'on' || featured === 'true'
      };

      // Se è stata caricata una nuova immagine, aggiorna anche quella
      if (req.file) {
        portfolioData.coverImage = `/uploads/${req.file.filename}`;
      }

      const portfolioItem = await storage.updatePortfolioItem(id, portfolioData);
      return res.status(200).json(portfolioItem);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'aggiornamento del progetto." 
      });
    }
  });

  app.delete("/api/portfolio/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const success = await storage.deletePortfolioItem(id);
      if (success) {
        return res.status(200).json({ message: "Progetto eliminato con successo" });
      } else {
        return res.status(404).json({ message: "Progetto non trovato" });
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione del progetto." 
      });
    }
  });

  app.delete("/api/portfolio/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Elemento di portfolio non trovato" });
      }
      
      return res.status(200).json({ message: "Elemento di portfolio eliminato con successo" });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione dell'elemento di portfolio." 
      });
    }
  });

  app.delete("/api/portfolio/:id", checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID non valido" });
      }

      const success = await storage.deletePortfolioItem(id);
      if (success) {
        return res.status(200).json({ message: "Elemento di portfolio eliminato con successo" });
      } else {
        return res.status(404).json({ message: "Elemento di portfolio non trovato" });
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'eliminazione dell'elemento di portfolio." 
      });
    }
  });

  // Site settings
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.status(200).json(settings || {});
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero delle impostazioni del sito." 
      });
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

  // Landing gallery routes
  app.get('/api/landing-gallery', async (req, res) => {
    try {
      const images = await storage.getLandingGalleryImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching landing gallery images:', error);
      res.status(500).json({ error: 'Failed to fetch landing gallery images' });
    }
  });

  app.post('/api/landing-gallery', upload.single('image'), async (req, res) => {
    try {
      const { title, description, altText, sortOrder, isActive } = req.body;
      
      let imageUrl = req.body.imageUrl || '';
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const imageData = insertLandingGalleryImageSchema.parse({
        title,
        description: description || null,
        imageUrl,
        altText: altText || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: isActive === 'true'
      });

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
      const { metaPixelId, otherTracking } = req.body;
      
      const updateData = {
        metaPixelId: metaPixelId?.trim() || null,
        otherTracking: otherTracking?.trim() || null
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

  // Create PayPal Order for €17 slot booking
  app.post("/api/payments/paypal/create-order", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ error: "Email e nome sono richiesti" });
      }

      const orderRequest = {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: "17.00"
          },
          description: "Prenotazione slot sito web - WebPro Italia",
          custom_id: `slot_booking_${Date.now()}`,
          soft_descriptor: "WebPro Italia"
        }],
        application_context: {
          brand_name: "WebPro Italia",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${req.protocol}://${req.get('host')}/offerta-197?payment=success`,
          cancel_url: `${req.protocol}://${req.get('host')}/offerta-197?payment=cancelled`
        }
      };

      const { body, statusCode } = await paypalOrdersController.createOrder({
        body: orderRequest,
        prefer: "return=representation"
      });

      if (statusCode === 201) {
        res.json({ orderId: JSON.parse(body as string).id });
      } else {
        res.status(statusCode).json({ error: "Errore nella creazione dell'ordine PayPal" });
      }
    } catch (error) {
      console.error("PayPal order creation error:", error);
      res.status(500).json({ error: "Errore nella creazione dell'ordine PayPal" });
    }
  });

  // Capture PayPal Order
  app.post("/api/payments/paypal/capture/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;

      const { body, statusCode } = await paypalOrdersController.captureOrder({
        id: orderId,
        prefer: "return=representation"
      });

      if (statusCode === 201) {
        const orderData = JSON.parse(body as string);
        res.json(orderData);
      } else {
        res.status(statusCode).json({ error: "Errore nella cattura del pagamento PayPal" });
      }
    } catch (error) {
      console.error("PayPal capture error:", error);
      res.status(500).json({ error: "Errore nella cattura del pagamento PayPal" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
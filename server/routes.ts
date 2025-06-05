import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertLogoSchema, insertPortfolioItemSchema, updateSiteSettingsSchema, insertBlogPostSchema, updateBlogPostSchema, insertBlogCategorySchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

// Configurazione di multer per l'upload dei file
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(new URL('../uploads', import.meta.url).pathname);
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

      return res.status(201).json({
        message: "Richiesta inviata con successo!",
        contact
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'invio. Riprova più tardi." 
      });
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

  // Portfolio management
  app.post("/api/portfolio", upload.fields([
    { name: 'businessImage', maxCount: 1 },
    { name: 'websiteImage', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.businessImage || !files.websiteImage) {
        return res.status(400).json({ message: "Entrambe le immagini sono richieste" });
      }

      const { title, description, tags } = req.body;
      let parsedTags;

      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [];
      }

      const portfolioData = {
        title,
        description,
        businessImageUrl: `/uploads/${files.businessImage[0].filename}`,
        websiteImageUrl: `/uploads/${files.websiteImage[0].filename}`,
        tags: parsedTags
      };

      const result = insertPortfolioItemSchema.safeParse(portfolioData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const portfolioItem = await storage.createPortfolioItem(result.data);
      return res.status(201).json(portfolioItem);
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante la creazione dell'elemento di portfolio." 
      });
    }
  });

  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante il recupero degli elementi di portfolio." 
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

  app.post("/api/site-settings", checkAuth, async (req, res) => {
    try {
      const result = updateSiteSettingsSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validazione fallita", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const settings = await storage.updateSiteSettings(result.data);
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating site settings:", error);
      return res.status(500).json({ 
        message: "Si è verificato un errore durante l'aggiornamento delle impostazioni del sito." 
      });
    }
  });

  // Blog management routes
  app.post("/api/blog/posts", upload.single('featuredImage'), async (req, res) => {
    try {
      const { title, content, excerpt, status, metaTitle, metaDescription } = req.body;
      
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
        featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined
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

  const httpServer = createServer(app);

  return httpServer;
}
import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertLogoSchema, insertPortfolioItemSchema, updateSiteSettingsSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

// Configurazione di multer per l'upload dei file
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
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
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Non autorizzato" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Crea la directory per gli upload se non esiste
  const uploadDir = path.join(__dirname, "../uploads");
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
      
      const csvFilePath = path.join(uploadDir, `contacts-export-${Date.now()}.csv`);
      
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

  const httpServer = createServer(app);

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
        ...result.data,
        createdAt: new Date().toISOString(),
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
  app.get("/api/contacts", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}

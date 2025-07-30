// WebPro Italia - Express.js Server
// RESTful API backend with PostgreSQL database and session management
// Built with Express.js, TypeScript, and modern web standards

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { pool } from "./db";
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurazione della sessione
import pgSession from 'connect-pg-simple';
const PgSession = pgSession(session);

app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 ore
    httpOnly: true,
    sameSite: 'strict'
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// SISTEMA ULTRA-ROBUSTO RESTORE PORTFOLIO IMAGES
async function restorePortfolioImages() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const backupDir = path.join(process.cwd(), 'backup-images');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }

  if (!fs.existsSync(backupDir)) {
    console.log('❌ Backup directory does not exist, creating it');
    fs.mkdirSync(backupDir, { recursive: true });
    return;
  }

  console.log('🔍 PORTFOLIO RESTORE: Checking for missing images...');

  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error("❌ Could not list backup directory:", err);
      return;
    }

    console.log(`🔍 Found ${files.length} files in backup-images`);
    let restoredCount = 0;

    files.forEach(file => {
      const backupFilePath = path.join(backupDir, file);
      const uploadFilePath = path.join(uploadsDir, file);

      fs.access(uploadFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          // File doesn't exist in uploads, so copy it
          fs.copyFile(backupFilePath, uploadFilePath, (err) => {
            if (err) {
              console.error(`❌ Failed to restore ${file}:`, err);
            } else {
              restoredCount++;
              console.log(`✅ RESTORED: ${file} from backup (${restoredCount} files restored)`);
            }
          });
        }
      });
    });
    
    setTimeout(() => {
      console.log(`🔒 PORTFOLIO RESTORE COMPLETE: ${restoredCount} files restored from backup`);
    }, 1000);
  });
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);

    // Restore missing portfolio images on startup
    setTimeout(restorePortfolioImages, 2000);
    
    // Verifica immagini del portfolio (SENZA placeholder casuali)
    setTimeout(async () => {
      try {
        const { verifyPortfolioImages, createMissingImagePlaceholders } = await import('./imageRecovery');
        await verifyPortfolioImages();
        const missingCount = await createMissingImagePlaceholders();
        
        if (missingCount > 0) {
          console.log(`🔴 PORTFOLIO ALERT: ${missingCount} immagini mancanti - ricarica dal pannello admin`);
        }
      } catch (error) {
        console.error('Error in image recovery:', error);
      }
    }, 4000);
    
    // Avvia scheduler per articoli giornalieri
    if (process.env.NODE_ENV === 'production') {
      const { startDailyScheduler } = await import('./scheduler');
      startDailyScheduler();
      console.log('🤖 Scheduler articoli giornalieri attivato');
    } else {
      console.log('📝 Scheduler articoli in modalità development (disattivato)');
    }
  });
})();
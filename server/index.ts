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
  secret: process.env.SESSION_SECRET || 'webdesign_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 ore
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

// Function to restore portfolio images from backup
async function restorePortfolioImages() {
  const uploadsDir = path.join(__dirname, 'uploads');
  const backupDir = path.join(__dirname, 'backup-images');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  if (!fs.existsSync(backupDir)) {
    console.log('Backup directory does not exist.');
    return;
  }

  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      return;
    }

    files.forEach(file => {
      const backupFilePath = path.join(backupDir, file);
      const uploadFilePath = path.join(uploadsDir, file);

      fs.access(uploadFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          // File doesn't exist in uploads, so copy it
          fs.copyFile(backupFilePath, uploadFilePath, (err) => {
            if (err) {
              console.error(`Failed to restore ${file}:`, err);
            } else {
              console.log(`Restored ${file} from backup`);
            }
          });
        } else {
          // File already exists in uploads
        }
      });
    });
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
  });
})();
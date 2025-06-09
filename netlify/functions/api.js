// Netlify Function per gestire le API
// Questo file gestisce tutte le richieste API del sito

const express = require('express');
const serverless = require('serverless-http');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
let pool;
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
};

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funzionante su Netlify!', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, businessType, message } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !businessType) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    const client = getPool();
    const result = await client.query(
      `INSERT INTO contacts (first_name, last_name, email, phone, company, business_type, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [firstName, lastName, email, phone, company, businessType, message]
    );

    res.status(201).json({ 
      message: 'Messaggio inviato con successo!',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Errore invio contatto:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// Get portfolio items
app.get('/api/portfolio', async (req, res) => {
  try {
    const client = getPool();
    const result = await client.query(
      'SELECT * FROM portfolio_items ORDER BY sort_order ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Errore caricamento portfolio:', error);
    res.status(500).json({ message: 'Errore caricamento portfolio' });
  }
});

// Get blog posts
app.get('/api/blog/posts', async (req, res) => {
  try {
    const client = getPool();
    const status = req.query.status || 'published';
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Errore caricamento blog:', error);
    res.status(500).json({ message: 'Errore caricamento blog' });
  }
});

// Get single blog post by slug
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const client = getPool();
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND status = $2',
      [req.params.slug, 'published']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Articolo non trovato' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore caricamento articolo:', error);
    res.status(500).json({ message: 'Errore caricamento articolo' });
  }
});

// Get site settings
app.get('/api/site-settings', async (req, res) => {
  try {
    const client = getPool();
    const result = await client.query('SELECT * FROM site_settings LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Errore caricamento impostazioni:', error);
    res.status(500).json({ message: 'Errore caricamento impostazioni' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});

// Esporta per Netlify
module.exports.handler = serverless(app);
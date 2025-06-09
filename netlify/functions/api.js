// Netlify Function per gestire le API
// Questo file gestisce tutte le richieste API del sito

const express = require('express');
const serverless = require('serverless-http');

// Importa le route del server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route di base per test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funzionante su Netlify!' });
});

// Placeholder per altre route
app.get('/api/*', (req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});

app.post('/api/*', (req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});

// Esporta per Netlify
module.exports.handler = serverless(app);
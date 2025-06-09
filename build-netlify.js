#!/usr/bin/env node

// Script di build personalizzato per Netlify
// Compila sia il frontend React che prepara le funzioni serverless

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniziando build per Netlify...');

try {
  // 1. Build del frontend con Vite
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  // 2. Copia i file statici necessari
  console.log('📁 Copiando file statici...');
  
  // Crea cartella uploads se non esiste
  const uploadsDir = path.join(__dirname, 'dist/public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // 3. Prepara le funzioni Netlify
  console.log('⚡ Preparando funzioni Netlify...');
  
  // Copia le dipendenze necessarie per le funzioni
  const functionsDir = path.join(__dirname, 'netlify/functions');
  const packageJson = {
    dependencies: {
      "express": "^4.21.2",
      "serverless-http": "^3.2.0"
    }
  };
  
  fs.writeFileSync(
    path.join(functionsDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('✅ Build completato con successo!');
  console.log('📋 Prossimi passi:');
  console.log('   1. Commit e push su GitHub');
  console.log('   2. Collegare repository a Netlify');
  console.log('   3. Configurare variabili d\'ambiente');
  
} catch (error) {
  console.error('❌ Errore durante il build:', error.message);
  process.exit(1);
}
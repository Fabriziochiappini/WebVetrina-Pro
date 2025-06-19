// Sistema di backup automatico per le immagini della galleria
const fs = require('fs');
const path = require('path');

const backupDirectory = path.join(process.cwd(), 'backup-images');

// Crea directory di backup se non esiste
if (!fs.existsSync(backupDirectory)) {
  fs.mkdirSync(backupDirectory, { recursive: true });
}

// Funzione per fare backup di un file
function backupImage(originalPath, filename) {
  try {
    const backupPath = path.join(backupDirectory, filename);
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log(`Backup creato: ${filename}`);
      return true;
    }
  } catch (error) {
    console.error(`Errore backup ${filename}:`, error);
  }
  return false;
}

// Funzione per ripristinare un file
function restoreImage(filename) {
  try {
    const backupPath = path.join(backupDirectory, filename);
    const originalPath = path.join(process.cwd(), 'uploads', filename);
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, originalPath);
      console.log(`File ripristinato: ${filename}`);
      return true;
    }
  } catch (error) {
    console.error(`Errore ripristino ${filename}:`, error);
  }
  return false;
}

module.exports = { backupImage, restoreImage };
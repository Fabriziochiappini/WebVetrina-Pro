// Sistema ultra-robusto per gestione immagini portfolio
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const BACKUP_DIR = path.join(__dirname, '..', 'backup-images');
const PORTFOLIO_BACKUP_DIR = path.join(__dirname, '..', 'portfolio-backup');

// Crea tutte le directory necessarie
[UPLOADS_DIR, BACKUP_DIR, PORTFOLIO_BACKUP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Directory creata: ${dir}`);
  }
});

// Sistema triplo backup per portfolio
function createTripleBackup(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const sourcePath = path.join(UPLOADS_DIR, fileName);
    
    if (fs.existsSync(sourcePath)) {
      // Backup 1: backup-images generale
      const backup1Path = path.join(BACKUP_DIR, fileName);
      if (!fs.existsSync(backup1Path)) {
        fs.copyFileSync(sourcePath, backup1Path);
      }
      
      // Backup 2: portfolio-backup specifico
      const backup2Path = path.join(PORTFOLIO_BACKUP_DIR, fileName);
      if (!fs.existsSync(backup2Path)) {
        fs.copyFileSync(sourcePath, backup2Path);
      }
      
      // Backup 3: copia con timestamp
      const timestampedName = `${Date.now()}_${fileName}`;
      const backup3Path = path.join(PORTFOLIO_BACKUP_DIR, timestampedName);
      fs.copyFileSync(sourcePath, backup3Path);
      
      console.log(`📁 TRIPLO BACKUP creato per: ${fileName}`);
      return true;
    }
  } catch (error) {
    console.error(`Errore triplo backup ${imagePath}:`, error.message);
  }
  return false;
}

// Ripristino intelligente con fallback multipli
function smartRestore(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const targetPath = path.join(UPLOADS_DIR, fileName);
    
    if (fs.existsSync(targetPath)) {
      return true; // File già presente
    }
    
    // Tentativo 1: backup generale
    const backup1Path = path.join(BACKUP_DIR, fileName);
    if (fs.existsSync(backup1Path)) {
      fs.copyFileSync(backup1Path, targetPath);
      console.log(`✅ RIPRISTINO da backup generale: ${fileName}`);
      return true;
    }
    
    // Tentativo 2: backup portfolio specifico
    const backup2Path = path.join(PORTFOLIO_BACKUP_DIR, fileName);
    if (fs.existsSync(backup2Path)) {
      fs.copyFileSync(backup2Path, targetPath);
      console.log(`✅ RIPRISTINO da backup portfolio: ${fileName}`);
      return true;
    }
    
    // Tentativo 3: cerca tra file con timestamp
    const portfolioFiles = fs.readdirSync(PORTFOLIO_BACKUP_DIR);
    const timestampedFile = portfolioFiles.find(file => file.endsWith(`_${fileName}`));
    
    if (timestampedFile) {
      const timestampedPath = path.join(PORTFOLIO_BACKUP_DIR, timestampedFile);
      fs.copyFileSync(timestampedPath, targetPath);
      console.log(`✅ RIPRISTINO da backup timestampato: ${fileName}`);
      return true;
    }
    
    console.error(`❌ IMPOSSIBILE ripristinare: ${fileName} - tutti i backup mancanti`);
    return false;
    
  } catch (error) {
    console.error(`Errore ripristino ${imagePath}:`, error.message);
    return false;
  }
}

// Verifica integrità completa portfolio
function verifyPortfolioIntegrity(portfolioItems) {
  console.log(`🔍 VERIFICA INTEGRITÀ PORTFOLIO: ${portfolioItems.length} elementi`);
  
  let totalMissing = 0;
  let totalRestored = 0;
  let criticalErrors = [];
  
  portfolioItems.forEach(item => {
    if (item.coverImage) {
      const fileName = path.basename(item.coverImage);
      const fullPath = path.join(UPLOADS_DIR, fileName);
      
      if (!fs.existsSync(fullPath)) {
        totalMissing++;
        console.log(`❌ MANCANTE: ${item.title} (${fileName})`);
        
        // Tentativo ripristino automatico
        if (smartRestore(item.coverImage)) {
          totalRestored++;
        } else {
          criticalErrors.push({
            id: item.id,
            title: item.title,
            fileName: fileName,
            imagePath: item.coverImage
          });
        }
      } else {
        // File presente - crea backup preventivo se mancante
        createTripleBackup(item.coverImage);
      }
    }
  });
  
  // Report finale
  console.log(`📊 REPORT INTEGRITÀ PORTFOLIO:`);
  console.log(`   - Totale elementi: ${portfolioItems.length}`);
  console.log(`   - Immagini mancanti: ${totalMissing}`);
  console.log(`   - Immagini ripristinate: ${totalRestored}`);
  console.log(`   - Errori critici: ${criticalErrors.length}`);
  
  if (criticalErrors.length > 0) {
    console.log(`🚨 ERRORI CRITICI - Backup non disponibili:`);
    criticalErrors.forEach(error => {
      console.log(`   - ID ${error.id}: ${error.title} (${error.fileName})`);
    });
  }
  
  return {
    totalItems: portfolioItems.length,
    missing: totalMissing,
    restored: totalRestored,
    critical: criticalErrors.length,
    criticalErrors: criticalErrors,
    success: totalRestored > 0
  };
}

// Backup completo di tutto il portfolio esistente
function fullPortfolioBackup() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      console.log('Directory uploads non esiste ancora');
      return;
    }
    
    const files = fs.readdirSync(UPLOADS_DIR);
    let backedUpCount = 0;
    
    files.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const success = createTripleBackup(`/uploads/${file}`);
        if (success) backedUpCount++;
      }
    });
    
    console.log(`📦 BACKUP COMPLETO PORTFOLIO: ${backedUpCount} immagini salvate`);
    
  } catch (error) {
    console.error('Errore backup completo portfolio:', error.message);
  }
}

module.exports = {
  createTripleBackup,
  smartRestore,
  verifyPortfolioIntegrity,
  fullPortfolioBackup
};
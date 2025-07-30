// Sistema di Recupero Immagini Portfolio
// Questo modulo verifica l'integrità delle immagini del portfolio

import fs from 'fs';
import path from 'path';
import { storage } from './storage';

export async function verifyPortfolioImages() {
  console.log('🔍 VERIFICA INTEGRITÀ IMMAGINI PORTFOLIO...');
  
  try {
    const portfolioItems = await storage.getPortfolioItems();
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const missingImages: Array<{id: number, title: string, image: string}> = [];
    
    for (const item of portfolioItems) {
      if (item.coverImage) {
        const imagePath = path.join(process.cwd(), item.coverImage.replace('/', ''));
        
        if (!fs.existsSync(imagePath)) {
          missingImages.push({
            id: item.id,
            title: item.title,
            image: item.coverImage
          });
          console.log(`❌ IMMAGINE MANCANTE: ${item.title} - ${item.coverImage}`);
        } else {
          console.log(`✅ OK: ${item.title} - ${item.coverImage}`);
        }
      }
    }
    
    if (missingImages.length > 0) {
      console.log(`⚠️  FOUND ${missingImages.length} MISSING PORTFOLIO IMAGES`);
      console.log('📋 Missing images list:', missingImages);
      
      return {
        status: 'missing_images',
        missingCount: missingImages.length,
        missingImages
      };
    } else {
      console.log('✅ TUTTE LE IMMAGINI DEL PORTFOLIO SONO PRESENTI');
      return {
        status: 'all_ok',
        missingCount: 0,
        missingImages: []
      };
    }
    
  } catch (error) {
    console.error('❌ Errore nella verifica immagini:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
}

export async function createMissingImagePlaceholders() {
  console.log('🔧 CREAZIONE PLACEHOLDER PER IMMAGINI MANCANTI...');
  
  const verification = await verifyPortfolioImages();
  
  if (verification.status === 'missing_images') {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const availableImages = fs.readdirSync(uploadsDir)
      .filter(file => file.startsWith('coverImage-') && file.endsWith('.png'));
    
    if (availableImages.length > 0) {
      const sourceImage = path.join(uploadsDir, availableImages[0]);
      let placeholderCount = 0;
      
      for (const missing of verification.missingImages) {
        const imageName = path.basename(missing.image);
        const targetPath = path.join(uploadsDir, imageName);
        
        try {
          fs.copyFileSync(sourceImage, targetPath);
          placeholderCount++;
          console.log(`✅ Placeholder creato: ${imageName}`);
        } catch (error) {
          console.error(`❌ Errore creazione placeholder ${imageName}:`, error);
        }
      }
      
      console.log(`🔧 PLACEHOLDERS CREATI: ${placeholderCount}/${verification.missingImages.length}`);
      return placeholderCount;
    }
  }
  
  return 0;
}
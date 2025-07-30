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
  console.log('🔧 CONTROLLO IMMAGINI MANCANTI (NO PLACEHOLDER CASUALI)...');
  
  const verification = await verifyPortfolioImages();
  
  if (verification.status === 'missing_images') {
    console.log(`⚠️  FOUND ${verification.missingImages.length} MISSING IMAGES:`);
    
    for (const missing of verification.missingImages) {
      console.log(`   ❌ ${missing.title}: ${missing.image}`);
    }
    
    console.log(`📋 AZIONE RICHIESTA: Ricarica manualmente ${verification.missingImages.length} immagini dal pannello admin`);
    console.log(`🚫 NO PLACEHOLDER CASUALI - Le immagini devono essere ricaricate con quelle originali`);
    
    return verification.missingImages.length;
  }
  
  return 0;
}
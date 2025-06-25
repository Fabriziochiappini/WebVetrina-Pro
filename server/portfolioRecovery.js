// Sistema di emergenza per ripristino portfolio
const fs = require('fs');
const path = require('path');

// Immagini di fallback per portfolio (placeholder professionali)
const FALLBACK_IMAGES = {
  1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center',
  2: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center',
  3: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=400&h=300&fit=crop&crop=center',
  4: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center',
  5: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop&crop=center',
  6: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center'
};

function getEmergencyFallback(portfolioId) {
  const fallbackId = (portfolioId % 6) + 1;
  return FALLBACK_IMAGES[fallbackId];
}

// Crea immagini placeholder se necessario
function createPlaceholderImage(imagePath, portfolioItem) {
  try {
    const fileName = path.basename(imagePath);
    console.log(`📋 Creando placeholder per: ${portfolioItem.title} (${fileName})`);
    
    // Per ora ritorna URL fallback - in futuro si può scaricare l'immagine
    return getEmergencyFallback(portfolioItem.id);
    
  } catch (error) {
    console.error(`Errore creazione placeholder ${imagePath}:`, error.message);
    return null;
  }
}

// Sistema di emergenza per portfolio danneggiato
function emergencyPortfolioRecovery(portfolioItems) {
  console.log('🚨 SISTEMA DI EMERGENZA PORTFOLIO ATTIVATO');
  
  const recoveredItems = portfolioItems.map(item => {
    if (!item.coverImage || !fs.existsSync(path.join(__dirname, '..', 'uploads', path.basename(item.coverImage)))) {
      const fallbackUrl = getEmergencyFallback(item.id);
      console.log(`🔄 Fallback per ${item.title}: ${fallbackUrl}`);
      
      return {
        ...item,
        coverImage: fallbackUrl,
        isPlaceholder: true
      };
    }
    return item;
  });
  
  return recoveredItems;
}

module.exports = {
  emergencyPortfolioRecovery,
  createPlaceholderImage,
  getEmergencyFallback
};
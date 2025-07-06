import { generateDailyArticle } from './openai';
import { storage } from './storage';

// Funzione per pubblicare articolo automaticamente
export async function publishDailyArticle(): Promise<void> {
  try {
    console.log('🤖 Generazione articolo giornaliero in corso...');
    
    const articleData = await generateDailyArticle();
    
    // Crea l'articolo nel database
    const newArticle = await storage.createBlogPost(articleData);
    
    console.log(`✅ Articolo pubblicato automaticamente: "${newArticle.title}"`);
    console.log(`📝 Slug: ${newArticle.slug}`);
    
    return newArticle;
  } catch (error) {
    console.error('❌ Errore nella pubblicazione automatica:', error);
    throw error;
  }
}

// Scheduler per pubblicazione giornaliera
export function startDailyScheduler(): void {
  // Pubblica ogni giorno alle 09:00
  const scheduleDaily = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 09:00 del giorno successivo
    
    const timeUntilNextRun = tomorrow.getTime() - now.getTime();
    
    setTimeout(async () => {
      try {
        console.log('🚀 SCHEDULER ATTIVO - Inizio pubblicazione articolo giornaliero');
        const article = await publishDailyArticle();
        console.log('✅ SCHEDULER SUCCESS - Articolo pubblicato:', article.title);
        
        // Log per monitoring
        console.log('📊 SCHEDULER STATS:', {
          timestamp: new Date().toISOString(),
          articleId: article.id,
          title: article.title,
          status: 'success'
        });
      } catch (error) {
        console.error('❌ SCHEDULER ERROR - Errore pubblicazione:', error);
        
        // Log dettagliato per debugging
        console.log('📊 SCHEDULER STATS:', {
          timestamp: new Date().toISOString(),
          status: 'error',
          error: error.message
        });
      }
      
      // Riprogramma per il giorno successivo
      scheduleDaily();
    }, timeUntilNextRun);
    
    console.log(`📅 SCHEDULER CONFIG - Prossimo articolo programmato per: ${tomorrow.toLocaleString('it-IT')}`);
    console.log(`⏰ SCHEDULER CONFIG - Millisecondi fino al prossimo run: ${timeUntilNextRun}`);
  };
  
  // Avvia scheduler
  scheduleDaily();
  
  // Heartbeat ogni ora per confermare che è attivo
  setInterval(() => {
    console.log('💚 SCHEDULER HEARTBEAT - Sistema attivo:', new Date().toLocaleString('it-IT'));
  }, 60 * 60 * 1000); // Ogni ora
}

// Funzione per pubblicare articolo manualmente
export async function publishArticleNow(topic?: string, focus?: string): Promise<any> {
  try {
    let articleData;
    
    if (topic && focus) {
      // Genera articolo con topic specifico
      const { generateSEOArticle } = await import('./openai');
      const generated = await generateSEOArticle(topic, focus);
      
      const slug = generated.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Aggiungi link interni
      let content = generated.sections.map(s => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('\n');
      
      // Aggiungi link a webproitalia.com
      content = content.replace(
        /(realizzazione siti web|creazione siti web|siti web professionali)/i,
        '<a href="https://webproitalia.com" target="_blank" rel="noopener">$1</a>'
      );
      
      // Aggiungi link interno
      content = content.replace(
        /(preventivo|contatto|servizi|offerta)/i,
        '<a href="/lite">offerta sito web a 197€</a>'
      );
      
      // Immagine stock gratuita
      const stockImages = [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Design workspace
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', // Computer coding
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80', // Mobile development
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Web development
        'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=800&q=80', // Digital marketing
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Team collaboration
        'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80', // Business website
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'  // Professional design
      ];
      const randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];
      
      articleData = {
        title: generated.title,
        slug: slug,
        content: content,
        excerpt: generated.metaDescription,
        metaTitle: generated.title,
        metaDescription: generated.metaDescription,
        featuredImage: randomImage,
        status: 'published',
        publishedAt: new Date()
      };
    } else {
      // Usa generazione automatica
      articleData = await generateDailyArticle();
    }
    
    const newArticle = await storage.createBlogPost(articleData);
    return newArticle;
  } catch (error) {
    console.error('Errore pubblicazione manuale:', error);
    throw error;
  }
}
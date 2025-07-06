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
        await publishDailyArticle();
      } catch (error) {
        console.error('Errore scheduler giornaliero:', error);
      }
      
      // Riprogramma per il giorno successivo
      scheduleDaily();
    }, timeUntilNextRun);
    
    console.log(`📅 Prossimo articolo programmato per: ${tomorrow.toLocaleString('it-IT')}`);
  };
  
  scheduleDaily();
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
      
      articleData = {
        title: generated.title,
        slug: slug,
        content: generated.sections.map(s => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('\n'),
        excerpt: generated.metaDescription,
        metaTitle: generated.title,
        metaDescription: generated.metaDescription,
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
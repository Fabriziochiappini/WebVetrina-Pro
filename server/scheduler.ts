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

// Configurazione scheduler personalizzabile
interface ScheduleConfig {
  article1Time: string; // HH:MM format
  article2Time: string;
  article3Time: string;
  enabled: boolean;
}

let currentScheduleConfig: ScheduleConfig = {
  article1Time: "09:00",
  article2Time: "14:00", 
  article3Time: "18:00",
  enabled: false
};

let activeTimeouts: NodeJS.Timeout[] = [];

// Funzione per programmare un singolo articolo
function scheduleArticleAt(time: string, articleNumber: number): void {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  // Calcola prossima esecuzione
  const nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);
  
  // Se l'orario è già passato oggi, programa per domani
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  const timeUntilRun = nextRun.getTime() - now.getTime();
  
  const timeout = setTimeout(async () => {
    try {
      console.log(`🚀 SCHEDULER ARTICOLO ${articleNumber} - Inizio pubblicazione alle ${time}`);
      const article = await publishDailyArticle();
      console.log(`✅ SCHEDULER SUCCESS - Articolo ${articleNumber} pubblicato:`, article.title);
      
      console.log('📊 SCHEDULER STATS:', {
        timestamp: new Date().toISOString(),
        articleNumber,
        scheduledTime: time,
        articleId: article.id,
        title: article.title,
        status: 'success'
      });
      
      // Riprogramma per il giorno successivo
      scheduleArticleAt(time, articleNumber);
    } catch (error) {
      console.error(`❌ SCHEDULER ERROR - Articolo ${articleNumber}:`, error);
      
      console.log('📊 SCHEDULER STATS:', {
        timestamp: new Date().toISOString(),
        articleNumber,
        scheduledTime: time,
        status: 'error',
        error: error.message
      });
      
      // Riprogramma anche in caso di errore
      scheduleArticleAt(time, articleNumber);
    }
  }, timeUntilRun);
  
  activeTimeouts.push(timeout);
  
  console.log(`📅 ARTICOLO ${articleNumber} programmato per: ${nextRun.toLocaleString('it-IT')}`);
  console.log(`⏰ Millisecondi fino al run: ${timeUntilRun}`);
}

// Scheduler personalizzabile
export function startCustomScheduler(config?: ScheduleConfig): void {
  if (config) {
    currentScheduleConfig = { ...config };
  }
  
  if (!currentScheduleConfig.enabled) {
    console.log('📝 Scheduler personalizzato disattivato');
    return;
  }
  
  // Pulisci timeout esistenti
  stopAllSchedulers();
  
  console.log('🎯 AVVIO SCHEDULER PERSONALIZZATO:');
  console.log(`- Articolo 1: ${currentScheduleConfig.article1Time}`);
  console.log(`- Articolo 2: ${currentScheduleConfig.article2Time}`);
  console.log(`- Articolo 3: ${currentScheduleConfig.article3Time}`);
  
  // Programma i 3 articoli giornalieri
  scheduleArticleAt(currentScheduleConfig.article1Time, 1);
  scheduleArticleAt(currentScheduleConfig.article2Time, 2);
  scheduleArticleAt(currentScheduleConfig.article3Time, 3);
  
  // Heartbeat ogni ora
  const heartbeat = setInterval(() => {
    console.log('💚 SCHEDULER HEARTBEAT - 3 articoli/giorno attivi:', new Date().toLocaleString('it-IT'));
  }, 60 * 60 * 1000);
  
  activeTimeouts.push(heartbeat as any);
}

// Ferma tutti gli scheduler
export function stopAllSchedulers(): void {
  activeTimeouts.forEach(timeout => clearTimeout(timeout));
  activeTimeouts = [];
  console.log('🛑 Tutti gli scheduler fermati');
}

// Aggiorna configurazione scheduler
export function updateScheduleConfig(newConfig: Partial<ScheduleConfig>): ScheduleConfig {
  currentScheduleConfig = { ...currentScheduleConfig, ...newConfig };
  
  if (currentScheduleConfig.enabled) {
    startCustomScheduler();
  } else {
    stopAllSchedulers();
  }
  
  return currentScheduleConfig;
}

// Ottieni configurazione attuale
export function getScheduleConfig(): ScheduleConfig {
  return { ...currentScheduleConfig };
}

// Funzione compatibilità con vecchio sistema
export function startDailyScheduler(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In produzione usa il sistema personalizzabile
    startCustomScheduler({
      article1Time: "09:00",
      article2Time: "14:00",
      article3Time: "18:00", 
      enabled: true
    });
  } else {
    console.log('📝 Scheduler in modalità development - usa la dashboard admin per i test');
  }
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
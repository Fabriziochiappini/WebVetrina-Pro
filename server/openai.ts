import OpenAI from "openai";
import { getRandomSEOCombination, getCityData, getSectorData } from "./seoConfig";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Struttura template per articoli SEO
interface ArticleStructure {
  title: string;
  metaDescription: string;
  sections: {
    heading: string;
    content: string;
  }[];
  keywords: string[];
  category: string;
}

// Prompt template per la generazione articoli
const SEO_ARTICLE_PROMPT = `
Sei un esperto copywriter SEO specializzato in siti web aziendali e realizzazione siti web professionali.

Scrivi un articolo completo e professionale seguendo queste specifiche:

ARGOMENTO: {topic}
FOCUS: {focus}

PAROLE CHIAVE PRINCIPALI:
- realizzazione siti web aziendali professionali
- creazione siti web professionali aziendali per attività
- realizzazione siti web economici
- sviluppo siti web aziendali
- progettazione siti web professionali

STRUTTURA RICHIESTA:
1. Titolo SEO ottimizzato (include parola chiave principale)
2. Meta description (150-160 caratteri)
3. Introduzione coinvolgente (100-150 parole)
4. 6-8 sezioni principali con H2 che approfondiscono il tema
5. Sottosezioni con H3 quando necessario
6. Conclusione con call-to-action (100-150 parole)

REQUISITI CONTENUTO:
- Minimo 1500 parole, target 2000+ parole
- Usa la parola chiave principale nel titolo H1
- Ripeti la keyword principale 8-12 volte naturalmente nel testo
- Includi variazioni e sinonimi delle keyword
- Densità keyword: 1-2% del contenuto totale
- Esempi pratici e consigli professionali
- Tono professionale ma accessibile
- Focus su conversioni e lead generation

CALL TO ACTION:
- Invita a contattare per preventivo gratuito
- Menziona prezzi competitivi (a partire da 197€)
- Includi senso di urgenza e benefici

FORMATTAZIONE:
- Usa tag HTML appropriati (h1, h2, h3, p, strong, em, ul, li)
- Paragrafi ben strutturati (80-120 parole)
- Elenchi puntati per benefici e caratteristiche
- Formattazione per evidenziare punti chiave

RISPOSTA JSON RICHIESTA:
{
  "title": "titolo dell'articolo",
  "metaDescription": "meta description",
  "excerpt": "riassunto di 2-3 righe",
  "content": "contenuto completo in HTML con tag appropriati - MINIMO 1500 parole",
  "keywords": ["keyword1", "keyword2", ...],
  "category": "categoria dell'articolo"
}
`;

export async function generateSEOArticle(topic: string, focus: string): Promise<ArticleStructure> {
  try {
    const prompt = SEO_ARTICLE_PROMPT
      .replace('{topic}', topic)
      .replace('{focus}', focus);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Sei un esperto copywriter SEO per aziende di web design in Italia. Scrivi contenuti ottimizzati per Google che convertano i visitatori in clienti."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      title: result.title,
      metaDescription: result.metaDescription,
      sections: [], // Processed from content
      keywords: result.keywords || [],
      category: result.category || 'Web Design'
    };
  } catch (error) {
    console.error('Error generating SEO article:', error);
    throw new Error('Failed to generate article');
  }
}

// Topics predefiniti per la generazione automatica
export const ARTICLE_TOPICS = [
  {
    topic: "Costi realizzazione sito web aziendale",
    focus: "analisi dettagliata dei costi per diverse tipologie di siti web business"
  },
  {
    topic: "SEO per siti web aziendali",
    focus: "strategie SEO specifiche per aumentare la visibilità online delle aziende"
  },
  {
    topic: "E-commerce professionale",
    focus: "come creare un negozio online che converte e genera vendite"
  },
  {
    topic: "Responsive design e mobile-first",
    focus: "importanza dell'ottimizzazione mobile per il successo aziendale"
  },
  {
    topic: "WordPress vs siti custom",
    focus: "confronto tra soluzioni CMS e sviluppo personalizzato"
  },
  {
    topic: "Sicurezza siti web aziendali",
    focus: "best practices per proteggere il sito web aziendale da attacchi e vulnerabilità"
  },
  {
    topic: "UX Design per siti aziendali",
    focus: "principi di user experience per migliorare le conversioni"
  },
  {
    topic: "Content Management per aziende",
    focus: "strategie di gestione contenuti per siti web aziendali professionali"
  },
  {
    topic: "Hosting e performance",
    focus: "come scegliere hosting performante per siti web aziendali"
  },
  {
    topic: "Marketing digitale integrato",
    focus: "strategie online per piccole e medie imprese italiane"
  }
];

export async function generateDailyArticle(): Promise<any> {
  try {
    // STRATEGIA SEO INTEGRATA: Usa combinazione casuale dalla strategia avanzata
    const seoCombination = getRandomSEOCombination();
    console.log(`🎯 STRATEGIA SEO INTEGRATA: ${seoCombination.title} (${seoCombination.type})`);
    
    // Genera prompt personalizzato con strategia SEO
    let enhancedPrompt = SEO_ARTICLE_PROMPT;
    
    // Integra dati geografici se presente
    if (seoCombination.city) {
      const cityData = getCityData(seoCombination.city.toLowerCase().replace(/\s+/g, '-'));
      if (cityData) {
        enhancedPrompt += `\n\nCONTESTO GEOGRAFICO: ${seoCombination.city}, ${cityData.region}
        POPOLAZIONE: ${cityData.population} abitanti
        KEYWORDS LOCALI: ${cityData.localKeywords.join(", ")}`;
      }
    }
    
    // Integra dati settoriali se presente
    if (seoCombination.sector) {
      const sectorData = getSectorData(seoCombination.sector.toLowerCase().replace(/\s+/g, '-'));
      if (sectorData) {
        enhancedPrompt += `\n\nSETTORE SPECIFICO: ${seoCombination.sector}
        PAIN POINTS: ${sectorData.painPoints.join(", ")}
        SOLUZIONI: ${sectorData.solutions.join(", ")}
        KEYWORDS SETTORE: ${sectorData.keywords.join(", ")}`;
      }
    }
    
    // Fallback al topic classico se non c'è combinazione SEO
    const randomTopic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Sei un esperto copywriter SEO per Web Pro Italia. Scrivi articoli DETTAGLIATI di almeno 1500 parole ottimizzati per 'realizzazione siti web professionali' con targeting geografico e settoriale strategico. IMPORTANTE: Ogni sezione deve essere molto dettagliata con esempi pratici e keywords mirate."
        },
        {
          role: "user",
          content: enhancedPrompt
            .replace('{topic}', seoCombination.title || randomTopic.topic)
            .replace('{focus}', `focus su ${seoCombination.keyword} per ${seoCombination.city || seoCombination.sector || 'mercato generale'}` || randomTopic.focus)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Genera slug dal titolo
    const slug = result.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Aggiungi link interni al contenuto
    let enhancedContent = result.content;
    
    // Aggiungi link a webproitalia.com
    enhancedContent = enhancedContent.replace(
      /(realizzazione siti web|creazione siti web|siti web professionali)/i,
      '<a href="https://webproitalia.com" target="_blank" rel="noopener">$1</a>'
    );
    
    // Aggiungi link interno al blog o offerte
    const internalLinks = [
      '<a href="/lite">offerta sito web a 197€</a>',
      '<a href="/">scopri i nostri servizi</a>',
      '<a href="#contact">richiedi preventivo</a>'
    ];
    const randomInternalLink = internalLinks[Math.floor(Math.random() * internalLinks.length)];
    
    enhancedContent = enhancedContent.replace(
      /(preventivo|contatto|servizi|offerta)/i,
      randomInternalLink
    );

    // Seleziona immagine stock gratuita
    const stockImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Design workspace
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', // Computer coding
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Web development
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80', // Office desk
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80', // Team meeting
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80' // Business meeting
    ];
    const featuredImage = stockImages[Math.floor(Math.random() * stockImages.length)];

    return {
      title: result.title,
      slug,
      content: enhancedContent,
      excerpt: result.excerpt || result.metaDescription,
      featuredImage,
      status: "published" as const,
      metaTitle: result.title,
      metaDescription: result.metaDescription,
      keywords: result.keywords?.join(', ') || 'realizzazione siti web, creazione siti web professionali'
    };
  } catch (error) {
    console.error('❌ Errore nella generazione articolo:', error);
    throw error;
  }
}

// Funzione principale per generare articoli automatici
export async function generateBlogArticle(): Promise<{
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
}> {
  try {
    // Usa la nuova strategia SEO integrata
    const article = await generateDailyArticle();
    
    console.log('🔍 DEBUG - Article generated:', {
      title: article.title,
      slug: article.slug,
      hasContent: !!article.content,
      status: article.status
    });
    
    return {
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      status: article.status as "draft" | "published",
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription
    };
  } catch (error) {
    console.error('❌ Errore nella generazione articolo:', error);
    throw error;
  }
}
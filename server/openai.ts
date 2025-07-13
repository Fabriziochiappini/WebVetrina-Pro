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

IMPORTANTE: Crea contenuto UNICO e VARIABILE per evitare che Google rilevi pattern ripetitivi. Ogni articolo deve essere SOSTANZIALMENTE DIVERSO per struttura, approccio e contenuti.

ARGOMENTO: {topic}
FOCUS: {focus}

PAROLE CHIAVE PRINCIPALI:
- realizzazione siti web aziendali professionali
- creazione siti web professionali aziendali per attività
- realizzazione siti web economici
- sviluppo siti web aziendali
- progettazione siti web professionali

DIVERSIFICAZIONE CONTENUTI (scegli 3-4 approcci DIVERSI ogni volta):
1. Analisi di mercato e trend digitali attuali
2. Casi studio concreti e success stories
3. Aspetti tecnici e innovazioni tecnologiche
4. Strategie di marketing digitale e conversioni
5. Confronti competitivi e benchmarking
6. Psicologia del consumatore e user experience
7. Tecnologie emergenti e visione futura
8. Normative e compliance (GDPR, accessibilità)
9. ROI e metriche di performance
10. Integrazione con social media e e-commerce
11. Ottimizzazione mobile e responsive design
12. Sicurezza web e protezione dati
13. Content marketing e SEO avanzato
14. Automazione e AI nel web design

STRUTTURA CREATIVA (varia la struttura ogni volta):
- Titolo H1 originale e coinvolgente (50-70 caratteri)
- Introduzione narrativa, con caso studio o domanda provocatoria (200-350 parole)
- 5-8 sezioni H2 con approcci diversi (non seguire sempre lo stesso schema)
- Sottosezioni H3 con approfondimenti specifici e tecnici
- Paragrafi variabili: alcuni brevi e incisivi (60-90 parole), altri lunghi e dettagliati (150-250 parole)
- Conclusione con storytelling, call-to-action creativa o visione futura (150-250 parole)

STILE NARRATIVO DIVERSIFICATO:
- Alterna tra tono consulenziale, narrativo, analitico, conversazionale
- Usa domande retoriche e dialogo diretto con il lettore
- Includi metafore, analogie e esempi creativi
- Aggiungi elementi di storytelling e casi reali
- Varia la lunghezza delle frasi per creare ritmo
- Usa elenchi numerati, bullet points e tabelle quando appropriato

REQUISITI CONTENUTO AVANZATI:
- Minimo 1800 parole, target 2200-2500 parole
- Usa la parola chiave principale nel titolo H1 in modo naturale
- Ripeti la keyword principale 10-15 volte organicamente nel testo
- Includi sinonimi creativi: "presenza digitale", "piattaforme online", "soluzioni web", "ecosistema digitale"
- Densità keyword: 1.5-2.5% del contenuto totale
- Esempi pratici specifici del settore
- Statistiche aggiornate e dati di mercato
- Consigli actionable e framework operativi
- Tono che varia da professionale a colloquiale

CONTENUTI DI VALORE SPECIFICI:
- Case study con risultati misurabili
- Checklist operative e framework
- Confronti prima/dopo con esempi concreti
- Previsioni di mercato e trend emergenti
- Errori comuni e come evitarli
- Best practices internazionali
- Strategie di crescita scalabili
- Strumenti e risorse utili

CALL TO ACTION CREATIVA (varia l'approccio):
- Usa diverse strategie: urgenza, scarsità, benefici, FOMO
- Menziona investimento da 197€ come opportunità di crescita
- Varia le frasi: "trasforma la tua presenza online", "scopri il potenziale nascosto", "inizia la rivoluzione digitale"
- Includi testimonial immaginari o case study di successo

FORMATTAZIONE AVANZATA:
- Usa tag HTML appropriati (h1, h2, h3, p, strong, em, ul, li, blockquote)
- Paragrafi ben strutturati con lunghezze variabili
- Elenchi puntati, numerati e tabelle per dati complessi
- Citazioni e highlight per punti chiave
- Separatori visivi e call-out box quando appropriato

RISPOSTA JSON RICHIESTA:
{
  "title": "titolo dell'articolo unico e coinvolgente",
  "metaDescription": "meta description specifica e accattivante",
  "excerpt": "riassunto di 2-3 righe che cattura l'essenza dell'articolo",
  "content": "contenuto completo in HTML con tag appropriati - MINIMO 1800 parole",
  "keywords": ["keyword1", "keyword2", "keyword3", ...],
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
    
    // Aggiungi link interno sempre alla homepage
    const internalLinks = [
      '<a href="https://webproitalia.com" target="_blank" rel="noopener">offerta sito web a 197€</a>',
      '<a href="https://webproitalia.com" target="_blank" rel="noopener">scopri i nostri servizi</a>',
      '<a href="https://webproitalia.com" target="_blank" rel="noopener">richiedi preventivo</a>'
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
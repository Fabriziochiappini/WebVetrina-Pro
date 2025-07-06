import OpenAI from "openai";

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

PAROLE CHIAVE PRINCIPALI:
- realizzazione siti web
- creazione siti web professionali
- siti web aziendali
- web design professionale
- sviluppo siti web

STRUTTURA RICHIESTA:
1. Titolo SEO ottimizzato (max 60 caratteri)
2. Meta description accattivante (max 155 caratteri)
3. Introduzione coinvolgente (150-200 parole)
4. 5-7 sezioni principali con sottotitoli H2
5. Conclusione con call-to-action forte verso Web Pro Italia
6. Lista di 8-10 parole chiave correlate

TONO E STILE:
- Professionale ma accessibile
- Orientato al business
- Convincente e autorevole
- Lunghezza totale: 1500-2000 parole
- Includi sempre una call-to-action finale che inviti a contattare Web Pro Italia

ARGOMENTO: {topic}

FOCUS SPECIFICO: {focus}

Rispondi SOLO in formato JSON con questa struttura:
{
  "title": "titolo dell'articolo",
  "metaDescription": "meta description",
  "excerpt": "riassunto di 2-3 righe",
  "content": "contenuto completo in HTML con tag appropriati",
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
      max_tokens: 3000
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
    focus: "proteggere il sito web dell'azienda da attacchi e vulnerabilità"
  },
  {
    topic: "Velocità e performance siti web",
    focus: "ottimizzazione delle prestazioni per migliorare conversioni e SEO"
  },
  {
    topic: "Landing page efficaci",
    focus: "come creare pagine di atterraggio che convertono i visitatori"
  },
  {
    topic: "Branding e web design",
    focus: "integrare l'identità aziendale nel design del sito web"
  },
  {
    topic: "Marketing digitale per PMI",
    focus: "strategie online per piccole e medie imprese italiane"
  }
];

export async function generateDailyArticle(): Promise<any> {
  try {
    // Seleziona un topic casuale
    const randomTopic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Sei un esperto copywriter SEO per Web Pro Italia. Scrivi articoli ottimizzati per 'realizzazione siti web professionali' che convertano visitatori in clienti."
        },
        {
          role: "user",
          content: SEO_ARTICLE_PROMPT
            .replace('{topic}', randomTopic.topic)
            .replace('{focus}', randomTopic.focus)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000
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

    // Seleziona immagine casuale esistente
    const existingImages = [
      '/uploads/image-1750620709085-268668923.png',
      '/uploads/image-1750620654884-416430495.png',
      '/uploads/image-1750263183202-340595682.png'
    ];
    const randomImage = existingImages[Math.floor(Math.random() * existingImages.length)];

    return {
      title: result.title,
      slug: slug,
      content: enhancedContent,
      excerpt: result.excerpt,
      metaTitle: result.title,
      metaDescription: result.metaDescription,
      featuredImage: randomImage,
      status: 'published',
      publishedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating daily article:', error);
    throw error;
  }
}
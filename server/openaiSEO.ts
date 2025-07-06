import OpenAI from "openai";
import { getRandomSEOCombination, getCityData, getSectorData } from "./seoConfig";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funzione per generare prompt dinamico basato su combinazione SEO
function generateSEOPrompt(seoCombination: any) {
  const { type, keyword, city, sector, title } = seoCombination;
  
  let specificContext = "";
  let localKeywords = "";
  let sectorContext = "";
  
  if (city) {
    const cityData = getCityData(city.toLowerCase().replace(/\s+/g, '-'));
    if (cityData) {
      localKeywords = cityData.localKeywords.join(", ");
      specificContext += `\nCONTESTO GEOGRAFICO: ${city}, ${cityData.region}`;
      specificContext += `\nPOPOLAZIONE: ${cityData.population} abitanti`;
      specificContext += `\nPAROLE CHIAVE LOCALI: ${localKeywords}`;
    }
  }
  
  if (sector) {
    const sectorData = getSectorData(sector.toLowerCase().replace(/\s+/g, '-'));
    if (sectorData) {
      sectorContext += `\nSETTORE SPECIFICO: ${sector}`;
      sectorContext += `\nPAIN POINTS: ${sectorData.painPoints.join(", ")}`;
      sectorContext += `\nSOLUZIONI: ${sectorData.solutions.join(", ")}`;
      sectorContext += `\nKEYWORDS SETTORE: ${sectorData.keywords.join(", ")}`;
    }
  }

  return `
Sei un esperto copywriter SEO specializzato in siti web aziendali e realizzazione siti web professionali.

Scrivi un articolo completo e professionale seguendo queste specifiche:

TIPO ARTICOLO: ${type}
TITOLO TARGET: ${title}
PAROLA CHIAVE PRINCIPALE: ${keyword}
${specificContext}
${sectorContext}

PAROLE CHIAVE PRINCIPALI:
- ${keyword}
- realizzazione siti web aziendali professionali
- creazione siti web professionali aziendali per attività
- realizzazione siti web economici

ISTRUZIONI SPECIFICHE:

1. **LUNGHEZZA**: Minimo 1500 parole, target 2000+ parole
2. **STRUTTURA**: 
   - Introduzione coinvolgente (100-150 parole)
   - 6-8 sezioni principali con H2
   - Sottosezioni con H3 quando necessario
   - Conclusione con call-to-action (100-150 parole)

3. **SEO OPTIMIZATION**:
   - Usa la parola chiave principale nel titolo H1
   - Ripeti la keyword principale 8-12 volte naturalmente
   - Usa variazioni e sinonimi delle keyword
   - Includi keyword correlate e a coda lunga
   - Densità keyword: 1-2% del contenuto

4. **CONTENUTO SPECIFICO**:
   ${city ? `- Scrivi contenuti specifici per ${city} e ${cityData?.region || ''}` : ''}
   ${sector ? `- Focus su ${sector} con problemi e soluzioni specifiche` : ''}
   - Includi esempi pratici e casi studio
   - Aggiungi consigli professionali
   - Usa un tono professionale ma accessibile

5. **CALL TO ACTION**:
   - Invita a contattare per preventivo gratuito
   - Menziona i prezzi competitivi (a partire da 197€)
   - Includi senso di urgenza e benefici

6. **FORMATTAZIONE HTML**:
   - Usa tag HTML appropriati (h1, h2, h3, p, strong, em, ul, li)
   - Crea paragrafi ben strutturati
   - Usa elenchi puntati per benefici e caratteristiche
   - Formatta correttamente citazioni e highlight

RISPOSTA RICHIESTA IN FORMATO JSON:
{
  "title": "Titolo ottimizzato SEO con keyword principale",
  "metaDescription": "Meta description 150-160 caratteri con keyword e call-to-action",
  "excerpt": "Riassunto accattivante di 2-3 righe per il blog",
  "content": "Contenuto HTML completo di minimo 1500 parole",
  "keywords": ["keyword1", "keyword2", "keyword3", ...],
  "category": "categoria articolo"
}
`;
}

// Funzione per generare immagine Unsplash mirata
async function generateFeaturedImage(searchQuery: string): Promise<string> {
  const queries = [
    `${searchQuery} professional business website`,
    'business website design development',
    'professional web development workspace',
    'modern business website interface',
    'web design digital marketing'
  ];
  
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  const encodedQuery = encodeURIComponent(randomQuery);
  
  return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3`;
}

// Funzione principale per generare articoli automatici con strategia SEO avanzata
export async function generateAdvancedSEOArticle(): Promise<{
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
}> {
  try {
    // Genera combinazione SEO casuale dalla strategia avanzata
    const seoCombination = getRandomSEOCombination();
    console.log(`🎯 Generando articolo SEO strategico: ${seoCombination.title} (${seoCombination.type})`);
    
    // Genera prompt personalizzato basato sulla combinazione SEO
    const seoPrompt = generateSEOPrompt(seoCombination);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Sei un esperto copywriter SEO per Web Pro Italia. Scrivi articoli SEO strategici di alta qualità che posizionano l'azienda come leader nel settore realizzazione siti web professionali. I tuoi articoli devono essere informativi, coinvolgenti e ottimizzati per convertire."
        },
        {
          role: "user",
          content: seoPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Genera immagine mirata per la combinazione SEO
    const imageQuery = seoCombination.sector 
      ? `${seoCombination.sector} business website design`
      : seoCombination.city 
        ? `business website design ${seoCombination.city}`
        : 'professional business website design';
        
    const featuredImage = await generateFeaturedImage(imageQuery);
    
    // Aggiungi link interni strategici
    let enhancedContent = result.content || '';
    
    // Link a offerte specifiche
    enhancedContent = enhancedContent.replace(
      /(preventivo gratuito|preventivo|consultazione)/gi,
      '<a href="#contact" class="font-semibold text-primary hover:underline">$1</a>'
    );
    
    enhancedContent = enhancedContent.replace(
      /(197€|197 euro|economico|low cost)/gi,
      '<a href="/lite" class="font-semibold text-secondary hover:underline">$1</a>'
    );
    
    // Link a portfolio
    enhancedContent = enhancedContent.replace(
      /(portfolio|progetti realizzati|esempi)/gi,
      '<a href="/#portfolio" class="font-semibold text-primary hover:underline">$1</a>'
    );
    
    return {
      title: result.title || seoCombination.title,
      content: enhancedContent,
      excerpt: result.excerpt || result.metaDescription || '',
      featuredImage,
      metaTitle: result.title || seoCombination.title,
      metaDescription: result.metaDescription || result.excerpt || ''
    };
  } catch (error) {
    console.error('❌ Errore nella generazione articolo SEO strategico:', error);
    throw error;
  }
}

// Export della funzione principale per compatibilità
export { generateAdvancedSEOArticle as generateBlogArticle };
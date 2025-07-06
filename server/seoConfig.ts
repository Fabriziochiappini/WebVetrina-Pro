// Configurazione SEO strategica per generazione automatica articoli
export interface SEOKeyword {
  primary: string;
  variations: string[];
  intent: 'commercial' | 'informational' | 'transactional';
}

export interface City {
  name: string;
  slug: string;
  province: string;
  region: string;
  population: string;
  coordinates: { lat: string; lng: string };
  localKeywords: string[];
}

export interface Sector {
  name: string;
  slug: string;
  category: string;
  keywords: string[];
  painPoints: string[];
  solutions: string[];
}

// Keywords principali estratte dalla strategia SEO
export const coreKeywords: SEOKeyword[] = [
  {
    primary: "realizzazione siti web aziendali professionali",
    variations: [
      "creazione siti web aziendali professionali",
      "sviluppo siti web aziendali professionali",
      "progettazione siti web aziendali professionali",
      "costruzione siti web aziendali professionali"
    ],
    intent: 'commercial'
  },
  {
    primary: "creazione siti web professionali aziendali per attività",
    variations: [
      "realizzazione siti web professionali per attività",
      "sviluppo siti web professionali per attività commerciali",
      "creazione siti web per attività locali",
      "siti web professionali per piccole attività"
    ],
    intent: 'commercial'
  },
  {
    primary: "realizzazione siti web economici",
    variations: [
      "creazione siti web economici",
      "siti web economici professionali",
      "realizzazione siti web low cost",
      "siti web a prezzi accessibili"
    ],
    intent: 'transactional'
  }
];

// 20 città target principali
export const targetCities: City[] = [
  {
    name: "Milano",
    slug: "milano",
    province: "MI",
    region: "Lombardia",
    population: "1366180",
    coordinates: { lat: "45.4642", lng: "9.1900" },
    localKeywords: ["milano", "milanese", "lombardia", "nord italia"]
  },
  {
    name: "Roma",
    slug: "roma",
    province: "RM",
    region: "Lazio",
    population: "2870500",
    coordinates: { lat: "41.9028", lng: "12.4964" },
    localKeywords: ["roma", "romano", "lazio", "centro italia", "capitale"]
  },
  {
    name: "Torino",
    slug: "torino",
    province: "TO",
    region: "Piemonte",
    population: "870952",
    coordinates: { lat: "45.0703", lng: "7.6869" },
    localKeywords: ["torino", "torinese", "piemonte", "nord ovest"]
  },
  {
    name: "Napoli",
    slug: "napoli",
    province: "NA",
    region: "Campania",
    population: "959574",
    coordinates: { lat: "40.8518", lng: "14.2681" },
    localKeywords: ["napoli", "napoletano", "campania", "sud italia"]
  },
  {
    name: "Palermo",
    slug: "palermo",
    province: "PA",
    region: "Sicilia",
    population: "663401",
    coordinates: { lat: "38.1157", lng: "13.3615" },
    localKeywords: ["palermo", "palermitano", "sicilia", "sud italia"]
  },
  {
    name: "Genova",
    slug: "genova",
    province: "GE",
    region: "Liguria",
    population: "580223",
    coordinates: { lat: "44.4056", lng: "8.9463" },
    localKeywords: ["genova", "genovese", "liguria", "nord ovest"]
  },
  {
    name: "Bologna",
    slug: "bologna",
    province: "BO",
    region: "Emilia-Romagna",
    population: "390636",
    coordinates: { lat: "44.4949", lng: "11.3426" },
    localKeywords: ["bologna", "bolognese", "emilia romagna", "centro nord"]
  },
  {
    name: "Firenze",
    slug: "firenze",
    province: "FI",
    region: "Toscana",
    population: "382258",
    coordinates: { lat: "43.7696", lng: "11.2558" },
    localKeywords: ["firenze", "fiorentino", "toscana", "centro italia"]
  },
  {
    name: "Venezia",
    slug: "venezia",
    province: "VE",
    region: "Veneto",
    population: "261905",
    coordinates: { lat: "45.4408", lng: "12.3155" },
    localKeywords: ["venezia", "veneziano", "veneto", "nord est"]
  },
  {
    name: "Verona",
    slug: "verona",
    province: "VR",
    region: "Veneto",
    population: "259610",
    coordinates: { lat: "45.4384", lng: "10.9916" },
    localKeywords: ["verona", "veronese", "veneto", "nord est"]
  },
  {
    name: "Padova",
    slug: "padova",
    province: "PD",
    region: "Veneto",
    population: "214125",
    coordinates: { lat: "45.4064", lng: "11.8768" },
    localKeywords: ["padova", "padovano", "veneto", "nord est"]
  },
  {
    name: "Trieste",
    slug: "trieste",
    province: "TS",
    region: "Friuli-Venezia Giulia",
    population: "204338",
    coordinates: { lat: "45.6495", lng: "13.7768" },
    localKeywords: ["trieste", "triestino", "friuli", "nord est"]
  },
  {
    name: "Brescia",
    slug: "brescia",
    province: "BS",
    region: "Lombardia",
    population: "196745",
    coordinates: { lat: "45.5416", lng: "10.2118" },
    localKeywords: ["brescia", "bresciano", "lombardia", "nord italia"]
  },
  {
    name: "Parma",
    slug: "parma",
    province: "PR",
    region: "Emilia-Romagna",
    population: "198292",
    coordinates: { lat: "44.8015", lng: "10.3279" },
    localKeywords: ["parma", "parmense", "emilia romagna", "centro nord"]
  },
  {
    name: "Modena",
    slug: "modena",
    province: "MO",
    region: "Emilia-Romagna",
    population: "186014",
    coordinates: { lat: "44.6471", lng: "10.9252" },
    localKeywords: ["modena", "modenese", "emilia romagna", "centro nord"]
  },
  {
    name: "Reggio Emilia",
    slug: "reggio-emilia",
    province: "RE",
    region: "Emilia-Romagna",
    population: "171944",
    coordinates: { lat: "44.6989", lng: "10.6307" },
    localKeywords: ["reggio emilia", "reggiano", "emilia romagna", "centro nord"]
  },
  {
    name: "Perugia",
    slug: "perugia",
    province: "PG",
    region: "Umbria",
    population: "165956",
    coordinates: { lat: "43.1122", lng: "12.3888" },
    localKeywords: ["perugia", "perugino", "umbria", "centro italia"]
  },
  {
    name: "Ancona",
    slug: "ancona",
    province: "AN",
    region: "Marche",
    population: "100861",
    coordinates: { lat: "43.6158", lng: "13.5189" },
    localKeywords: ["ancona", "anconetano", "marche", "centro italia"]
  },
  {
    name: "Pescara",
    slug: "pescara",
    province: "PE",
    region: "Abruzzo",
    population: "119483",
    coordinates: { lat: "42.4584", lng: "14.2014" },
    localKeywords: ["pescara", "pescarese", "abruzzo", "centro sud"]
  },
  {
    name: "Bari",
    slug: "bari",
    province: "BA",
    region: "Puglia",
    population: "320677",
    coordinates: { lat: "41.1171", lng: "16.8719" },
    localKeywords: ["bari", "barese", "puglia", "sud italia"]
  }
];

// 10 settori specifici
export const targetSectors: Sector[] = [
  {
    name: "Dentisti e Studi Medici",
    slug: "dentisti-studi-medici",
    category: "Sanità",
    keywords: [
      "siti web per dentisti",
      "siti web per studi medici",
      "siti web per odontoiatri",
      "siti web per medici"
    ],
    painPoints: [
      "Difficoltà a trovare nuovi pazienti",
      "Gestione appuntamenti inefficace",
      "Scarsa presenza online",
      "Comunicazione con pazienti limitata"
    ],
    solutions: [
      "Sistema prenotazione online",
      "Galleria prima/dopo",
      "Sezione servizi dettagliata",
      "Form contatti GDPR compliant"
    ]
  },
  {
    name: "Ditte Edili",
    slug: "ditte-edili",
    category: "Edilizia",
    keywords: [
      "siti web per ditte edili",
      "siti web per imprese edili",
      "siti web per costruzioni",
      "siti web per ristrutturazioni"
    ],
    painPoints: [
      "Difficoltà a mostrare i lavori realizzati",
      "Mancanza di credibilità online",
      "Comunicazione progetti complessa",
      "Acquisizione clienti limitata"
    ],
    solutions: [
      "Portfolio lavori realizzati",
      "Certificazioni e qualifiche",
      "Preventivatore online",
      "Sezione prima/dopo progetti"
    ]
  },
  {
    name: "Ristoranti e Pizzerie",
    slug: "ristoranti-pizzerie",
    category: "Ristorazione",
    keywords: [
      "siti web per ristoranti",
      "siti web per pizzerie",
      "siti web per trattorie",
      "siti web per locali"
    ],
    painPoints: [
      "Menu sempre aggiornato",
      "Prenotazioni online",
      "Delivery e asporto",
      "Promozione eventi speciali"
    ],
    solutions: [
      "Menu digitale interattivo",
      "Sistema prenotazioni",
      "Integrazione delivery",
      "Galleria piatti e locale"
    ]
  },
  {
    name: "Avvocati e Studi Legali",
    slug: "avvocati-studi-legali",
    category: "Legale",
    keywords: [
      "siti web per avvocati",
      "siti web per studi legali",
      "siti web per legali",
      "siti web per consulenti legali"
    ],
    painPoints: [
      "Acquisizione nuovi clienti",
      "Comunicazione competenze",
      "Gestione appuntamenti",
      "Presenza professionale online"
    ],
    solutions: [
      "Area specializzazioni",
      "Form consultazione",
      "Sezione CV e qualifiche",
      "Blog articoli legali"
    ]
  },
  {
    name: "Parrucchieri e Centri Estetici",
    slug: "parrucchieri-centri-estetici",
    category: "Bellezza",
    keywords: [
      "siti web per parrucchieri",
      "siti web per centri estetici",
      "siti web per beauty center",
      "siti web per estetiste"
    ],
    painPoints: [
      "Prenotazioni online",
      "Mostrare i lavori realizzati",
      "Promozione servizi",
      "Fidelizzazione clienti"
    ],
    solutions: [
      "Booking online",
      "Galleria prima/dopo",
      "Lista servizi e prezzi",
      "Sezione promozioni"
    ]
  },
  {
    name: "Officine e Autofficine",
    slug: "officine-autofficine",
    category: "Automotive",
    keywords: [
      "siti web per officine",
      "siti web per autofficine",
      "siti web per meccanici",
      "siti web per carrozzerie"
    ],
    painPoints: [
      "Comunicazione servizi tecnici",
      "Prenotazioni riparazioni",
      "Fiducia dei clienti",
      "Gestione preventivi"
    ],
    solutions: [
      "Lista servizi tecnici",
      "Sistema prenotazioni",
      "Certificazioni officina",
      "Form preventivi"
    ]
  },
  {
    name: "Negozi e Retail",
    slug: "negozi-retail",
    category: "Retail",
    keywords: [
      "siti web per negozi",
      "siti web per retail",
      "siti web per boutique",
      "siti web per shop"
    ],
    painPoints: [
      "Vendite online",
      "Catalogazione prodotti",
      "Gestione ordini",
      "Promozione prodotti"
    ],
    solutions: [
      "Catalogo prodotti",
      "Sistema e-commerce",
      "Sezione offerte",
      "Integrazione social"
    ]
  },
  {
    name: "Architetti e Ingegneri",
    slug: "architetti-ingegneri",
    category: "Progettazione",
    keywords: [
      "siti web per architetti",
      "siti web per ingegneri",
      "siti web per studi tecnici",
      "siti web per progettisti"
    ],
    painPoints: [
      "Portfolio progetti",
      "Comunicazione competenze",
      "Acquisizione clienti",
      "Presentazione servizi"
    ],
    solutions: [
      "Galleria progetti",
      "CV e qualifiche",
      "Sezione servizi",
      "Form contatti progetti"
    ]
  },
  {
    name: "Consulenti e Commercialisti",
    slug: "consulenti-commercialisti",
    category: "Consulenza",
    keywords: [
      "siti web per consulenti",
      "siti web per commercialisti",
      "siti web per consulenza",
      "siti web per advisory"
    ],
    painPoints: [
      "Comunicazione competenze",
      "Acquisizione clienti",
      "Gestione appuntamenti",
      "Presenza professionale"
    ],
    solutions: [
      "Area competenze",
      "Sistema appuntamenti",
      "Sezione servizi",
      "Blog settoriale"
    ]
  },
  {
    name: "Palestre e Fitness",
    slug: "palestre-fitness",
    category: "Sport",
    keywords: [
      "siti web per palestre",
      "siti web per fitness",
      "siti web per centri sportivi",
      "siti web per personal trainer"
    ],
    painPoints: [
      "Iscrizioni online",
      "Promozione corsi",
      "Gestione abbonamenti",
      "Comunicazione orari"
    ],
    solutions: [
      "Sistema iscrizioni",
      "Calendario corsi",
      "Sezione abbonamenti",
      "Galleria struttura"
    ]
  }
];

// Funzioni di utilità per generare combinazioni SEO
export function generateSEOCombinations() {
  const combinations = [];
  
  // Combinazioni Keyword + Città
  for (const keyword of coreKeywords) {
    for (const city of targetCities) {
      combinations.push({
        type: 'geo-keyword',
        keyword: keyword.primary,
        city: city.name,
        slug: `${keyword.primary.replace(/\s+/g, '-')}-${city.slug}`,
        title: `${keyword.primary} ${city.name}`,
        intent: keyword.intent
      });
    }
  }
  
  // Combinazioni Keyword + Settore
  for (const keyword of coreKeywords) {
    for (const sector of targetSectors) {
      combinations.push({
        type: 'sector-keyword',
        keyword: keyword.primary,
        sector: sector.name,
        slug: `${keyword.primary.replace(/\s+/g, '-')}-${sector.slug}`,
        title: `${keyword.primary} per ${sector.name}`,
        intent: keyword.intent
      });
    }
  }
  
  // Combinazioni Città + Settore + Keyword (Top combinations)
  const topCities = targetCities.slice(0, 5); // Top 5 città
  const topSectors = targetSectors.slice(0, 5); // Top 5 settori
  
  for (const keyword of coreKeywords) {
    for (const city of topCities) {
      for (const sector of topSectors) {
        combinations.push({
          type: 'geo-sector-keyword',
          keyword: keyword.primary,
          city: city.name,
          sector: sector.name,
          slug: `${keyword.primary.replace(/\s+/g, '-')}-${sector.slug}-${city.slug}`,
          title: `${keyword.primary} per ${sector.name} a ${city.name}`,
          intent: keyword.intent
        });
      }
    }
  }
  
  return combinations;
}

// Funzione per ottenere combinazione casuale con rotazione anti-spam
export function getRandomSEOCombination() {
  const combinations = generateSEOCombinations();
  let combination = combinations[Math.floor(Math.random() * combinations.length)];
  
  // ANTI-SPAM: Alterna intelligentemente tra "realizzazione" e "creazione"
  // Usa il timestamp per rotazione persistente (resiste ai riavvii del server)
  const now = new Date();
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  // Alterna ogni 30 minuti per una rotazione più frequente e visibile
  const rotationCycle = Math.floor(minuteOfDay / 30);
  const shouldUseCreazione = rotationCycle % 2 === 0;
  
  console.log(`🔄 ROTATION DEBUG: Ora ${now.getHours()}:${now.getMinutes()}, Ciclo: ${rotationCycle}, UseCreazione: ${shouldUseCreazione}`);
  
  if (shouldUseCreazione && combination.keyword.includes('realizzazione')) {
    // Sostituisci "realizzazione" con "creazione"
    combination = {
      ...combination,
      keyword: combination.keyword.replace('realizzazione', 'creazione'),
      title: combination.title.replace('Realizzazione', 'Creazione').replace('realizzazione', 'creazione'),
      slug: combination.slug.replace('realizzazione', 'creazione')
    };
  } else if (!shouldUseCreazione && combination.keyword.includes('creazione')) {
    // Sostituisci "creazione" con "realizzazione" 
    combination = {
      ...combination,
      keyword: combination.keyword.replace('creazione', 'realizzazione'),
      title: combination.title.replace('Creazione', 'Realizzazione').replace('creazione', 'realizzazione'),
      slug: combination.slug.replace('creazione', 'realizzazione')
    };
  }
  
  return combination;
}

// Funzione per ottenere dati di una città
export function getCityData(citySlug: string) {
  return targetCities.find(city => city.slug === citySlug);
}

// Funzione per ottenere dati di un settore
export function getSectorData(sectorSlug: string) {
  return targetSectors.find(sector => sector.slug === sectorSlug);
}
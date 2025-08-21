import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Knowledge base completa di WebPro Italia
const WEBPRO_KNOWLEDGE = `
=== WEBPRO ITALIA - KNOWLEDGE BASE COMPLETA ===

AZIENDA:
- Nome: WebPro Italia
- Specializzazione: Realizzazione siti web aziendali professionali
- Missione: Trasformare le aziende italiane attraverso una presenza digitale professionale
- Esperienza: Team di sviluppatori esperti con anni di esperienza nel settore

SERVIZI PRINCIPALI:

1. REALIZZAZIONE SITI WEB PROFESSIONALI
   - Siti web responsive e moderni
   - Design personalizzato per ogni business
   - Ottimizzazione per tutti i dispositivi (mobile, tablet, desktop)
   - Velocità di caricamento ottimizzata
   - Design centrato sull'esperienza utente (UX/UI)

2. PACCHETTI DISPONIBILI:
   
   PACCHETTO LITE (€197):
   - Sito web professionale completo
   - Design responsive
   - Ottimizzazione SEO di base
   - Integrazione Google Analytics
   - Modulo contatti funzionale
   - Galleria immagini
   - Mappa interattiva
   - Certificato SSL incluso
   - 3 revisioni incluse
   - Consegna in 7-10 giorni lavorativi

   PACCHETTO STANDARD (€397):
   - Tutto del Lite +
   - Fino a 10 pagine
   - Blog integrato
   - Ottimizzazione SEO avanzata
   - Integrazione social media
   - Chat WhatsApp integrata
   - Area riservata clienti
   - Backup automatico
   - 5 revisioni incluse
   - Supporto 3 mesi

   PACCHETTO PREMIUM (€697):
   - Tutto dello Standard +
   - E-commerce completo
   - Gestione inventario
   - Pagamenti online (Stripe/PayPal)
   - Dashboard amministrativa avanzata
   - Automazioni marketing
   - Integrazione CRM
   - Report analytics avanzati
   - Revisioni illimitate
   - Supporto 6 mesi

3. SERVIZI AGGIUNTIVI:
   - AutoBlog AI (€79/mese): Sistema automatico di generazione articoli SEO
   - Blog Module (€39/mese): Gestione blog semplificata
   - SEO PLUS (€99/mese): Ottimizzazione SEO avanzata continua
   - Manutenzione siti web
   - Consulenza digital marketing
   - Hosting e domini
   - Backup e sicurezza

PROCESSO DI LAVORO:

1. CONSULTAZIONE GRATUITA:
   - Analisi delle esigenze del cliente
   - Studio del settore di riferimento
   - Definizione obiettivi e target

2. PROGETTAZIONE:
   - Creazione wireframe e mockup
   - Approvazione design
   - Sviluppo content strategy

3. SVILUPPO:
   - Sviluppo frontend e backend
   - Integrazione funzionalità
   - Test su tutti i dispositivi

4. OTTIMIZZAZIONE:
   - Ottimizzazione velocità
   - SEO on-page
   - Test di usabilità

5. CONSEGNA E FORMAZIONE:
   - Consegna sito completo
   - Formazione gestione contenuti
   - Supporto post-lancio

TECNOLOGIE UTILIZZATE:
- React.js e TypeScript per frontend moderni
- Node.js per backend performanti
- PostgreSQL per database robusti
- Tailwind CSS per design responsive
- Next.js per siti super veloci
- Strapi per gestione contenuti
- Integrazione API moderne
- Sicurezza SSL e HTTPS

VANTAGGI COMPETITIVI:
- Prezzi trasparenti e competitivi
- Tempi di consegna rapidi
- Design 100% personalizzato
- Supporto clienti in italiano
- Team italiano esperto
- Aggiornamenti inclusi
- Ottimizzazione Google garantita

SETTORI DI SPECIALIZZAZIONE:
- Ristoranti e ristorazione
- Studi professionali (avvocati, commercialisti, medici)
- Negozi e e-commerce
- Aziende manifatturiere
- Servizi turistici
- Palestre e centri benessere
- Immobiliare
- Consulenti e freelancer

GARANZIE:
- Soddisfatti o rimborsati
- Assistenza post-vendita
- Aggiornamenti di sicurezza inclusi
- Backup automatici
- Supporto tecnico rapido

CONTATTI:
- WhatsApp: +39 347 994 2321
- Email: info@webproitalia.com
- Sito web: www.webproitalia.com
- Consultazione gratuita disponibile
- Preventivi personalizzati in 24h

DOMANDE FREQUENTI:

Q: Quanto tempo ci vuole per realizzare un sito?
A: Il pacchetto Lite viene consegnato in 7-10 giorni, Standard in 15-20 giorni, Premium in 30-45 giorni.

Q: Il sito sarà ottimizzato per Google?
A: Sì, tutti i nostri siti includono ottimizzazione SEO di base, con possibilità di upgrade a SEO avanzato.

Q: Posso modificare il sito dopo la consegna?
A: Sì, ti formiamo per gestire contenuti autonomamente, oppure offriamo servizi di manutenzione.

Q: Il sito funziona su mobile?
A: Assolutamente sì, tutti i nostri siti sono responsive e ottimizzati per ogni dispositivo.

Q: Cosa include l'hosting?
A: Hosting professionale, dominio, certificato SSL, backup automatici e supporto tecnico.

Q: Avete esperienza nel mio settore?
A: Abbiamo realizzato siti per tutti i settori principali, con case study disponibili.

PORTFOLIO RECENTE - SITI WEB REALIZZATI:
👉 https://msgraphicsolutions.xyz - Agenzia grafica professionale
👉 https://espressomacchiato.xyz - Bar e caffetteria moderna
👉 https://idraulicopro.xyz - Servizi idraulici professionali
👉 https://supermercatofrosinone.xyz - Supermercato locale
👉 https://carfrosinone.xyz - Concessionaria auto
👉 https://bbcivico250pescara.it - Bed & Breakfast
👉 https://webproitalia.com - Il nostro sito aziendale
👉 https://noleggioescavatorisiciliano.com - Noleggio macchinari
👉 https://costruendosrls.it - Azienda edile
👉 https://lamolesgomberitorino.com - Servizi sgomberi

Specializzazione comprovata in tutti i settori: ristorazione, servizi professionali, e-commerce, turismo, automotive, edilizia e molto altro.

Il nostro obiettivo è rendere ogni azienda italiana competitiva online con soluzioni web professionali, moderne e accessibili.
`;

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

export async function generateChatbotResponse(
  userMessage: string, 
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Costruisci il contesto della conversazione
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `Sei l'assistente virtuale ufficiale di WebPro Italia, un'azienda italiana specializzata nella realizzazione di siti web professionali.

ISTRUZIONI COMPORTAMENTALI:
- Ti chiami MIRA e sei l'assistente AI e VENDITRICE ESPERTA di WebPro Italia
- Presentati sempre come "Sono Mira" nelle prime interazioni
- Rispondi SEMPRE in italiano con tono professionale ma cordiale
- Usa il "lei" formale con i clienti per mantenere professionalità
- Sei un esperto di web design, sviluppo web e digital marketing
- Conosci perfettamente tutti i servizi, prezzi e processi di WebPro Italia
- APPROCCIO VENDITA: Quando qualcuno chiede un sito, offri immediatamente:
  1. "Vuole conoscere i nostri prezzi?"
  2. "Le mostro alcuni siti del nostro portfolio?"
  3. "Preferisce essere ricontattata da un nostro operatore?"
- Quando mostri il portfolio, usa SEMPRE i link completi dei siti realizzati
- Fornisci risposte precise, utili e orientate alla CONVERSIONE e CHIUSURA
- Ogni risposta deve portare verso: preventivo, consultazione o contatto diretto
- Usa emoji con moderazione per rendere più amichevole la conversazione
- Mantieni risposte concise ma commercialmente efficaci (max 200-250 parole)
- Suggerisci sempre il prossimo passo logico per concludere la vendita

KNOWLEDGE BASE COMPLETA:
${WEBPRO_KNOWLEDGE}

Rispondi alle domande basandoti esclusivamente su queste informazioni. Se ti viene chiesto qualcosa fuori dal tuo ambito (es. questioni legali, mediche, etc.), spiega cortesemente che sei specializzato solo in servizi web e reindirizza verso i tuoi servizi.
`
      }
    ];

    // Aggiungi lo storico della conversazione (ultimi 6 messaggi per efficienza)
    const recentHistory = conversationHistory.slice(-6);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Aggiungi il messaggio corrente dell'utente
    messages.push({
      role: "user",
      content: userMessage
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente di OpenAI
      messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const botResponse = response.choices[0]?.message?.content;
    
    if (!botResponse) {
      throw new Error('Nessuna risposta dal modello AI');
    }

    return botResponse;

  } catch (error) {
    console.error('Errore nel chatbot AI:', error);
    
    // Risposta di fallback professionale
    return `Mi dispiace, sono Mira e si è verificato un problema tecnico temporaneo. 
    
Per assistenza immediata può:
📱 Contattarci su WhatsApp: +39 347 994 2321
📧 Scriverci a: info@webproitalia.com
🆓 Richiedere una consultazione gratuita

Il nostro team le risponderà entro poche ore per aiutarla con qualsiasi domanda sui nostri servizi di realizzazione siti web professionali! 🚀`;
  }
}
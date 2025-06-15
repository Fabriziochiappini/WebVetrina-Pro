import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackBusinessEvent } from '../lib/analytics';

const faqData = [
  {
    question: "Quanto tempo ci vuole per realizzare il mio sito web?",
    answer: "I tempi di realizzazione variano in base al tipo di progetto: per un sito vetrina standard 7-10 giorni lavorativi, per progetti più complessi 15-20 giorni. Ti forniremo sempre una tempistica precisa dopo aver analizzato le tue esigenze."
  },
  {
    question: "Il sito sarà ottimizzato per dispositivi mobili?",
    answer: "Assolutamente sì! Tutti i nostri siti sono progettati con tecnologia responsive, garantendo una perfetta visualizzazione su smartphone, tablet e desktop. Oltre il 60% degli utenti naviga da mobile, per questo è fondamentale."
  },
  {
    question: "Posso modificare i contenuti del sito in autonomia?",
    answer: "Certamente! Ti forniamo un pannello di controllo intuitivo per gestire testi, immagini e contenuti in completa autonomia. Includiamo anche una sessione di formazione per spiegarti come utilizzarlo al meglio."
  },
  {
    question: "Il dominio e l'hosting sono inclusi nel prezzo?",
    answer: "Il primo anno di hosting è incluso nei nostri pacchetti. Per il dominio, ti aiutiamo nella registrazione e configurazione. Dal secondo anno in poi, i costi di mantenimento sono minimi (circa €50-80 annui)."
  },
  {
    question: "Il sito sarà ottimizzato per i motori di ricerca (SEO)?",
    answer: "Sì! Tutti i nostri siti includono l'ottimizzazione SEO di base: struttura del codice, meta tag, velocità di caricamento e ottimizzazione delle immagini. Per strategie SEO avanzate, offriamo consulenze dedicate."
  },
  {
    question: "Cosa succede se ho bisogno di assistenza dopo la consegna?",
    answer: "Offriamo 3 mesi di assistenza gratuita post-consegna per qualsiasi problema tecnico o piccola modifica. Successivamente, puoi scegliere i nostri piani di manutenzione mensile o richiedere interventi puntuali."
  },
  {
    question: "Posso integrare un sistema di e-commerce?",
    answer: "Assolutamente! Il nostro pacchetto E-commerce include tutto il necessario: catalogo prodotti, carrello, pagamenti sicuri, gestione ordini e spedizioni. Supportiamo tutte le principali modalità di pagamento italiane."
  },
  {
    question: "I miei dati e contenuti sono al sicuro?",
    answer: "La sicurezza è la nostra priorità. Utilizziamo hosting italiani con certificazioni SSL, backup automatici giornalieri e protocolli di sicurezza avanzati. I tuoi dati rimangono sempre di tua proprietà."
  }
];

interface FaqProps {
  scrollToSection: (id: string) => void;
}

const Faq = ({ scrollToSection }: FaqProps) => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Domande Frequenti
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Risposte alle domande più comuni sui nostri servizi. 
            Non trovi quello che cerchi? Contattaci direttamente!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <AccordionTrigger className="text-left p-6 hover:no-underline">
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hai altre domande?
            </h3>
            <p className="text-gray-600 mb-6">
              Il nostro team è pronto a rispondere a tutte le tue domande 
              e a fornirti un preventivo personalizzato gratuito.
            </p>
            <button
              onClick={() => {
                trackBusinessEvent.ctaClick('faq_section', 'contact');
                scrollToSection('contatti');
              }}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              VOGLIO IL MIO SITO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
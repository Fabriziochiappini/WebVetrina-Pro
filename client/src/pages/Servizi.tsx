import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  PenTool, 
  Mail, 
  Globe, 
  Headphones, 
  Share2, 
  Target, 
  Users,
  Bot,
  X
} from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  color: string;
  bgGradient: string;
  badge?: string;
  badgeColor?: string;
}

interface ServiceDetails {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
  price: string;
  setupTime: string;
}

const serviceDetails: ServiceDetails[] = [
  {
    id: "seo-plus",
    title: "SEO PLUS",
    tagline: "Domina Google. I tuoi competitor non sapranno che li hai colpiti.",
    description: "Non è solo SEO. È una guerra psicologica contro la concorrenza. Analizziamo ogni loro mossa, rubiamo le loro parole chiave migliori e ti portiamo in cima prima che se ne accorgano.",
    features: [
      "Analisi competitors ultra-dettagliata (sappiamo tutto di loro)",
      "Ottimizzazione tecnica avanzata (velocità fulmine)",
      "Link building strategico (partnership che contano)",
      "Report mensili che ti faranno sorridere",
      "Monitoraggio posizioni real-time"
    ],
    benefits: [
      "Traffico organico che cresce ogni mese",
      "Clienti che ti trovano prima dei concorrenti", 
      "Autorevolezza nel tuo settore",
      "ROI misurabile e trasparente"
    ],
    price: "€99/mese",
    setupTime: "Setup in 48h"
  },
  {
    id: "blog-module",
    title: "Blog Module",
    tagline: "Il blog che scrive da solo (quasi). Tu rilassati, noi generiamo traffico.",
    description: "Basta perdere ore a pensare 'cosa scrivo oggi?'. Sistema completo che trasforma il tuo sito in una macchina da contenuti. Editor avanzato + SEO automatico = traffico garantito.",
    features: [
      "Editor professionale tipo WordPress",
      "SEO automatico per ogni articolo",
      "Template pronti per il tuo settore", 
      "Gestione immagini integrata",
      "Pubblicazione programmata"
    ],
    benefits: [
      "Contenuti freschi senza stress",
      "Google ti ama (e ti premia)",
      "Clienti che ti vedono esperto",
      "Tempo risparmiato = soldi guadagnati"
    ],
    price: "€39",
    setupTime: "Setup in 24h"
  },
  {
    id: "email-business",
    title: "Email Aziendale",
    tagline: "Basta Gmail. È ora di sembrare professionali davvero.",
    description: "Email personalizzata con il tuo dominio che fa la differenza. I clienti si fidano di più, le email finiscono meno nello spam, e tu sembri quello serio del settore.",
    features: [
      "Email personalizzata @tuodominio.it",
      "Antispam e sicurezza avanzata",
      "Backup automatico messaggi",
      "App mobile inclusa",
      "Supportio IMAP/POP3"
    ],
    benefits: [
      "Credibilità istantanea",
      "Meno email nello spam",
      "Branding coerente ovunque",
      "Gestione professionale comunicazioni"
    ],
    price: "€29/mese",
    setupTime: "Setup in 2h"
  },
  {
    id: "multi-language",
    title: "Multilingua",
    tagline: "Un sito, infinite opportunità. Il mondo aspetta i tuoi servizi.",
    description: "Traduci il sito e raddoppia i clienti. Non parliamo di Google Translate, ma traduzione professionale che convince e converte. Ogni lingua è un nuovo mercato da conquistare.",
    features: [
      "Traduzione professionale (non automatica)",
      "SEO ottimizzato per ogni lingua",
      "Gestione contenuti multilingua",
      "URL dedicati per ogni paese",
      "Selector lingua elegante"
    ],
    benefits: [
      "Mercati internazionali aperti",
      "Clienti stranieri sbloccati",
      "Autorevolezza globale",
      "Fatturato moltiplicato"
    ],
    price: "€199",
    setupTime: "Setup in 5-7 giorni"
  },
  {
    id: "support-premium",
    title: "Supporto VIP",
    tagline: "Hai un problema? Risolto in 30 minuti. Garantito.",
    description: "Supporto prioritario per quando le cose si complicano. Chat diretta, interventi rapidi, problemi risolti prima che diventino drammi. Dormi sonni tranquilli.",
    features: [
      "Chat diretta con sviluppatori",
      "Interventi entro 30 minuti",
      "Backup giornalieri automatici",
      "Monitoraggio proattivo 24/7",
      "Aggiornamenti prioritari"
    ],
    benefits: [
      "Zero stress tecnico",
      "Sito sempre funzionante",
      "Problemi risolti prima che li noti",
      "Focus totale sul business"
    ],
    price: "€79/mese",
    setupTime: "Attivo subito"
  },
  {
    id: "social-integration",
    title: "Social Pro",
    tagline: "Collega tutto. Sito, social, clienti. Un ecosistema che funziona.",
    description: "Integrazione social che non è solo 'metti i bottoncini'. Feed automatici, condivisioni intelligenti, traffico dai social che si trasforma in clienti veri.",
    features: [
      "Feed social automatici sul sito",
      "Condivisioni ottimizzate",
      "Pixel tracking avanzato",
      "Chatbot social integrato",
      "Analytics social unificate"
    ],
    benefits: [
      "Presenza online coordinata",
      "Traffico dai social moltiplicato",
      "Lead generation automatica",
      "Brand recognition potenziata"
    ],
    price: "€59/mese",
    setupTime: "Setup in 3 giorni"
  },
  {
    id: "ads-landing",
    title: "Landing ADS",
    tagline: "Pagine che convertono. Ogni click diventa cliente.",
    description: "Landing pages killer per le tue campagne pubblicitarie. Ottimizzate per convertire, testate per vincere. Più conversioni = pubblicità che si paga da sola.",
    features: [
      "Landing pages ottimizzate",
      "A/B testing integrato",
      "Tracking conversioni avanzato",
      "Copy persuasivo incluso",
      "Design mobile-first"
    ],
    benefits: [
      "Conversioni alle stelle",
      "Costo per lead dimezzato",
      "ROI pubblicità massimizzato",
      "Campagne che si autofinanziano"
    ],
    price: "€149",
    setupTime: "Setup veloce"
  },
  {
    id: "crm-clients",
    title: "CRM Pro",
    tagline: "Gestisci clienti come un boss. Ogni lead diventa opportunità.",
    description: "Sistema completo per non perdere mai un cliente. Lead tracking, follow-up automatici, vendite sotto controllo. Trasforma il caos in un sistema che vende per te.",
    features: [
      "Database clienti centralizzato",
      "Follow-up automatici",
      "Pipeline vendite visual",
      "Report e analytics dettagliati",
      "Integrazione email e telefono"
    ],
    benefits: [
      "Zero clienti persi",
      "Vendite organizzate e tracciate", 
      "Follow-up mai dimenticati",
      "Crescita controllata e scalabile"
    ],
    price: "€149/mese",
    setupTime: "Setup rapido"
  },
  {
    id: "autoblog",
    title: "AutoBlog",
    tagline: "L'AI scrive, tu guadagni. Contenuti infiniti senza sforzo.",
    description: "Il futuro del content marketing è qui. AI che genera articoli ottimizzati SEO, unici e coinvolgenti. Tu imposti, l'AI produce, Google premia. Traffico organico automatizzato.",
    features: [
      "Generazione articoli con GPT-4",
      "SEO optimization automatica",
      "Pubblicazione programmata",
      "Temi personalizzabili per il tuo settore",
      "Revisione umana inclusa"
    ],
    benefits: [
      "Contenuti freschi ogni settimana",
      "Google ranking migliorato",
      "Autorevolezza settoriale automatica",
      "Tempo libero = focus business"
    ],
    price: "€79/mese",
    setupTime: "Setup in 24h"
  }
];

const services: ServiceCard[] = [
  {
    id: "seo-plus",
    title: "SEO PLUS",
    description: "Posizionamento avanzato sui motori di ricerca con analisi competitors",
    icon: <Search className="w-10 h-10" />,
    price: "€99/mese",
    color: "text-white",
    bgGradient: "from-blue-500 to-blue-600",
    badge: "PIÙ VENDUTO",
    badgeColor: "bg-yellow-500"
  },
  {
    id: "blog-module",
    title: "Blog Module",
    description: "Sistema di gestione contenuti con editor avanzato e SEO automatico",
    icon: <PenTool className="w-10 h-10" />,
    price: "€39",
    color: "text-white",
    bgGradient: "from-purple-500 to-purple-600",
    badge: "NUOVO",
    badgeColor: "bg-green-500"
  },
  {
    id: "business-email",
    title: "Email Pro",
    description: "Caselle email professionali con il tuo dominio e antispam",
    icon: <Mail className="w-10 h-10" />,
    price: "€29/mese",
    color: "text-white",
    bgGradient: "from-green-500 to-green-600",
    badge: "ESSENZIALE",
    badgeColor: "bg-blue-500"
  },
  {
    id: "multilingual",
    title: "Multilingua",
    description: "Versioni del sito in più lingue con traduzione professionale",
    icon: <Globe className="w-10 h-10" />,
    price: "€299",
    color: "text-white",
    bgGradient: "from-orange-500 to-orange-600",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500"
  },
  {
    id: "support-plus",
    title: "Support PLUS",
    description: "Supporto prioritario 24/7 e backup quotidiani automatici",
    icon: <Headphones className="w-10 h-10" />,
    price: "€79/mese",
    color: "text-white",
    bgGradient: "from-red-500 to-red-600",
    badge: "RACCOMANDATO",
    badgeColor: "bg-yellow-500"
  },
  {
    id: "social-management",
    title: "Social Pro",
    description: "Gestione completa dei tuoi profili social con contenuti personalizzati",
    icon: <Share2 className="w-10 h-10" />,
    price: "€199/mese",
    color: "text-white",
    bgGradient: "from-pink-500 to-pink-600",
    badge: "TRENDING",
    badgeColor: "bg-orange-500"
  },
  {
    id: "ad-campaigns",
    title: "Advertising",
    description: "Campagne Google Ads e Facebook Ads per massimizzare il ROI",
    icon: <Target className="w-10 h-10" />,
    price: "€299/mese",
    color: "text-white",
    bgGradient: "from-indigo-500 to-indigo-600",
    badge: "HOT",
    badgeColor: "bg-red-600"
  },
  {
    id: "crm-clients",
    title: "CRM Pro",
    description: "Sistema completo per gestire clienti, lead e vendite con automazioni",
    icon: <Users className="w-10 h-10" />,
    price: "€149/mese",
    color: "text-white",
    bgGradient: "from-teal-500 to-teal-600",
    badge: "BUSINESS",
    badgeColor: "bg-indigo-500"
  },
  {
    id: "autoblog",
    title: "AutoBlog",
    description: "Generazione automatica di articoli con AI per il tuo blog",
    icon: <Bot className="w-10 h-10" />,
    price: "€79/mese",
    color: "text-white",
    bgGradient: "from-cyan-500 to-cyan-600",
    badge: "AI POWERED",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
  }
];

export default function Servizi() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const getServiceDetails = (id: string) => {
    return serviceDetails.find(service => service.id === id);
  };

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Servizi <span className="text-blue-300">Avanzati</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Potenzia il tuo sito web con servizi professionali che fanno la differenza. 
              Soluzioni complete per far crescere la tua presenza digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
                Scopri i Servizi
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-white text-blue-900 text-lg px-8 py-3">
                Richiedi Consulenza
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              I Nostri Servizi Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ogni servizio è progettato per massimizzare il potenziale del tuo sito web 
              e accelerare la crescita del tuo business online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 overflow-hidden rounded-[28px] bg-white aspect-square flex flex-col relative shadow-lg"
                style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
              >
                <CardContent className="p-0 relative flex flex-col h-full">
                  {/* Badge */}
                  {service.badge && (
                    <div className={`absolute top-3 right-3 ${service.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg`}>
                      {service.badge}
                    </div>
                  )}

                  {/* App Icon Header - Now takes full card */}
                  <div className={`bg-gradient-to-br ${service.bgGradient} flex-1 flex flex-col items-center justify-center text-center relative p-6`}>
                    {/* App Icon */}
                    <div className={`${service.color} mb-4`}>
                      <div className="bg-white/20 backdrop-blur-sm rounded-[20px] p-4 shadow-lg">
                        {service.icon}
                      </div>
                    </div>
                    
                    {/* App Title */}
                    <h3 className="font-bold text-base text-white mb-2 leading-tight text-center">
                      {service.title}
                    </h3>
                    
                    {/* Price Badge */}
                    <div className="bg-white/90 text-gray-900 font-bold text-sm px-3 py-1.5 rounded-full shadow-md mb-3">
                      {service.price}
                    </div>

                    {/* App Description */}
                    <p className="text-white/90 text-xs leading-relaxed text-center mb-4 flex-grow flex items-center px-2">
                      {service.description}
                    </p>

                    {/* Install Button */}
                    <Button 
                      onClick={() => handleServiceClick(service.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl py-2 px-6 font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      Installa
                    </Button>
                  </div>

                  {/* iOS-like Glow Effect */}
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto a Potenziare il Tuo Sito Web?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Scegli i servizi che fanno al caso tuo e trasforma il tuo sito in una 
            macchina da vendita. Consulenza gratuita inclusa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Richiedi Preventivo Gratuito
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white text-blue-600 text-lg px-8 py-3">
              Parla con un Esperto
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Service Detail Modal */}
      {selectedService && (
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const details = getServiceDetails(selectedService);
              if (!details) return null;
              
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                      {details.title}
                    </DialogTitle>
                    <DialogDescription className="text-xl text-blue-600 font-semibold mb-4">
                      {details.tagline}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {details.description}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Features */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          🚀 Cosa Include
                        </h3>
                        <ul className="space-y-3">
                          {details.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          💎 Vantaggi per Te
                        </h3>
                        <ul className="space-y-3">
                          {details.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Pricing and CTA */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <div className="text-3xl font-bold mb-1">
                            {details.price}
                          </div>
                          <div className="text-blue-100">
                            {details.setupTime}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            size="lg" 
                            className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
                            onClick={() => {
                              // Track analytics
                              if (typeof window !== 'undefined' && (window as any).gtag) {
                                (window as any).gtag('event', 'service_install_click', {
                                  event_category: 'services',
                                  event_label: details.title
                                });
                              }
                              // Open WhatsApp or contact form
                              window.open(`https://wa.me/393755142007?text=Ciao! Sono interessato al servizio ${details.title} a ${details.price}`, '_blank');
                            }}
                          >
                            INSTALLA SUBITO
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-white text-white hover:bg-white/10"
                          >
                            Info e Preventivo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
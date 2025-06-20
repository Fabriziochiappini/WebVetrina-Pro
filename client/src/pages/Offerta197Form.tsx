import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Check, Clock, Star, Zap, Shield, Award, Heart, Phone } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import SalesPopup from '../components/SalesPopup';
import AnnouncementBar from '../components/AnnouncementBar';
import LandingGallery from '../components/LandingGallery';
import PaymentModal from '../components/PaymentModal';
import WhatsAppFloat from '../components/WhatsAppFloat';

const Offerta197Form = () => {
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; type: 'stripe' | 'paypal' }>({
    isOpen: false,
    type: 'stripe'
  });

  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      trackEvent('cta_click', 'hero', 'contact');
    }
  };

  const benefits = [
    {
      icon: <Check className="h-6 w-6" />,
      title: "Design Professionale", 
      description: "Template moderni"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Veloce e Sicuro",
      description: "Hosting incluso"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Dominio Gratuito",
      description: "Per 12 mesi"
    }
  ];

  const features = [
    "Design responsive per mobile e desktop",
    "Dominio .com/.it gratuito per 12 mesi",
    "Hosting professionale incluso per 12 mesi", 
    "Certificato SSL per la sicurezza",
    "Ottimizzazione SEO di base",
    "Collegamento Google My Business",
    "Form di contatto funzionante",
    "Galleria foto/prodotti",
    "Mappa interattiva",
    "Chat WhatsApp integrata",
    "Backup automatici settimanali",
    "Supporto tecnico per 12 mesi"
  ];

  useEffect(() => {
    // Track page view
    trackEvent('page_view', 'landing', 'offerta-197form');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <WhatsAppFloat />
      <SalesPopup />
      
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6 animate-pulse">
              🔥 OFFERTA LIMITATA NEL TEMPO
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Il Tuo Sito Web Professionale a
              <span className="block text-secondary">Solo €197</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed max-w-3xl mx-auto">
              Un'opportunità unica per avere un sito web aziendale di <strong>alta qualità</strong><br />
              al prezzo più conveniente d'Italia.
            </p>

            {/* Hero Image */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/attached_assets/ChatGPT%20Image%2019%20giu%202025,%2014_13_21_1750335379108.png"
                alt="Sito Web Professionale a 197€ - Dominio + Hosting + Design incluso" 
                className="max-w-full h-auto rounded-lg shadow-2xl"
                style={{ maxHeight: '400px' }}
              />
            </div>

            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-medium opacity-95 mb-8">
              <span className="line-through text-gray-300">€1200</span>
              <ArrowRight className="text-secondary" />
              <span className="text-secondary font-bold">€197</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">-84%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-secondary">{benefit.icon}</div>
                  <div className="text-left">
                    <div className="font-semibold">{benefit.title}</div>
                    <div className="text-sm opacity-90">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={scrollToContact}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold py-6 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              VOGLIO IL MIO SITO ADESSO <ArrowRight className="ml-2 h-6 w-6" />
            </Button>

            <p className="text-sm mt-4 opacity-80">
              ⏰ Ultimi posti disponibili • Consegna garantita in 5 giorni
            </p>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-400">
                Stai Perdendo Clienti Ogni Giorno!
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Nel 2025, <strong className="text-white">il 97% delle persone</strong> cerca prodotti e servizi online prima di acquistare.
                <br />Se non hai un sito web, <strong className="text-red-400">semplicemente non esisti</strong> per loro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              {/* Problem Side */}
              <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 text-red-400 flex items-center">
                  <span className="text-3xl mr-3">❌</span>
                  SENZA Sito Web
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">💸</span>
                    <span>Perdi <strong>clienti ogni giorno</strong> che vanno dai concorrenti online</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">👻</span>
                    <span>La tua attività è <strong>invisibile</strong> su Google e social</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">📞</span>
                    <span>Devi sempre <strong>cercare</strong> nuovi clienti invece che farli arrivare a te</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">🏚️</span>
                    <span>Appari <strong>poco professionale</strong> rispetto alla concorrenza</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">💔</span>
                    <span>I clienti non si <strong>fidano</strong> di chi non ha presenza online</span>
                  </li>
                </ul>
              </div>

              {/* Solution Side */}
              <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <span className="text-3xl mr-3">✅</span>
                  CON Il Tuo Sito Web
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">🚀</span>
                    <span>I clienti ti <strong>trovano facilmente</strong> su Google 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">⭐</span>
                    <span>Appari <strong>professionale</strong> e affidabile come i grandi brand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">💰</span>
                    <span>Generi <strong>nuove vendite</strong> automaticamente mentre dormi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">🎯</span>
                    <span>Attrai <strong>clienti qualificati</strong> interessati ai tuoi servizi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">📈</span>
                    <span>Fai crescere il business <strong>senza stress</strong> e sforzi extra</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4 text-secondary">
                La Soluzione È Qui: Il Tuo Sito a €197
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Non aspettare che i tuoi concorrenti ti superino. <strong>Agisci ORA</strong> e trasforma la tua attività.
              </p>
              <Button 
                onClick={scrollToContact}
                className="bg-secondary hover:bg-secondary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
              >
                RISOLVI ADESSO IL PROBLEMA <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-white text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock className="h-8 w-8 animate-pulse text-red-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-red-600">
                ATTENZIONE: Offerta in Scadenza!
              </h2>
              <Clock className="h-8 w-8 animate-pulse text-red-600" />
            </div>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-700">
              Questa promozione speciale è <strong className="text-red-600">QUASI TERMINATA</strong>.<br />
              Dopo, il prezzo tornerà a <strong className="text-red-600">€1200</strong> (il nostro prezzo normale).
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <p className="text-lg font-medium mb-4 text-gray-800">
                ⚡ Solo <span className="text-red-600 font-bold">3 posti rimasti</span> su 15 questo mese
              </p>
              
              {/* Visualizzazione slot */}
              <div className="grid grid-cols-5 gap-2 mb-6 max-w-md mx-auto">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded ${i < 12 ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center text-xs font-bold`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm mb-4 text-gray-600">
                🔴 Occupati • 🟢 Disponibili
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">
              Cosa Ottieni con il Tuo Sito Web da €197
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-primary">Tutto Incluso nel Prezzo</h3>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Perché Questa Offerta è Unica</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Qualità Professionale</h4>
                      <p className="text-sm opacity-90">Gli stessi standard dei siti da €1200+</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Nessun Costo Nascosto</h4>
                      <p className="text-sm opacity-90">€197 è tutto quello che paghi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Supporto Dedicato</h4>
                      <p className="text-sm opacity-90">Ti seguiamo fino alla messa online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Website is Important Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-primary">
              Perché è importante e necessario avere un sito web oggi:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🔎</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Visibilità online 24/7</h3>
                  <p className="text-gray-600">Il tuo business sempre accessibile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🌐</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Credibilità e fiducia</h3>
                  <p className="text-gray-600">Professionalità che convince</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💼</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Controllo totale sull'immagine del brand</h3>
                  <p className="text-gray-600">La tua identità come la vuoi tu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Accessibile da ovunque</h3>
                  <p className="text-gray-600">Mobile, tablet, desktop</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Punto di riferimento informativo</h3>
                  <p className="text-gray-600">Tutte le info sui tuoi servizi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💸</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Più facile vendere (anche in automatico)</h3>
                  <p className="text-gray-600">Conversioni mentre dormi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Analisi e dati utili</h3>
                  <p className="text-gray-600">Comprendi i tuoi clienti</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Vantaggio competitivo</h3>
                  <p className="text-gray-600">Supera la concorrenza</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📣</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Base per campagne pubblicitarie</h3>
                  <p className="text-gray-600">Facebook Ads, Google Ads efficaci</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Facilita il contatto e la conversione</h3>
                  <p className="text-gray-600">Da visitatore a cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-primary">Cosa Dicono i Nostri Clienti</h2>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Google My Business */}
              <div className="text-center bg-gray-50 p-6 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Google My Business</h3>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">4.9/5 stelle<br />Da oltre 150 recensioni</p>
              </div>

              {/* Trustpilot */}
              <div className="text-center bg-gray-50 p-6 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Trustpilot</h3>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">Eccellente<br />Valutazioni verificate</p>
              </div>

              {/* Clienti Soddisfatti */}
              <div className="text-center bg-gray-50 p-6 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Clienti Felici</h3>
                <p className="text-3xl font-bold text-primary mb-2">500+</p>
                <p className="text-gray-600">Siti web realizzati<br />con successo</p>
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-8 text-primary">Alcuni Nostri Lavori Recenti</h3>
              <LandingGallery />
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">Domande Frequenti</h2>
            
            <div className="space-y-6 mb-12">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Il sito web sarà veramente professionale a questo prezzo?
                </h3>
                <p className="text-gray-700">
                  Assolutamente sì! Utilizziamo template professionali e personalizzati per la tua attività. 
                  La qualità è la stessa dei nostri siti da €1200+, solo che ora abbiamo ottimizzato il processo.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Ci sono costi nascosti oltre ai €197?
                </h3>
                <p className="text-gray-700">
                  No, €197 è tutto ciò che paghi. Include: design, dominio per 12 mesi, hosting per 12 mesi, 
                  SSL, ottimizzazione SEO di base e supporto tecnico.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. In quanto tempo avrò il mio sito online?
                </h3>
                <p className="text-gray-700">
                  Il tuo sito sarà pronto in 3-5 giorni lavorativi dalla prenotazione. 
                  Una volta approvato, andrà online immediatamente.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Posso modificare il sito dopo la consegna?
                </h3>
                <p className="text-gray-700">
                  Sì! Il sito è completamente tuo. Include anche il supporto tecnico per 12 mesi 
                  per piccole modifiche e aggiornamenti.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Il sito funzionerà bene su mobile?
                </h3>
                <p className="text-gray-700">
                  Certamente! Tutti i nostri siti sono responsive e ottimizzati per smartphone, 
                  tablet e desktop. La maggior parte dei tuoi clienti navigherà da mobile.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Cosa succede se non sono soddisfatto?
                </h3>
                <p className="text-gray-700">
                  Lavoriamo fino a che non sei completamente soddisfatto. Hai diritto a 2 round di modifiche gratuite. 
                  Il pagamento finale avviene solo dopo la tua approvazione.
                </p>
              </div>

              {/* FAQ Item 7 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Posso scegliere il nome del dominio?
                </h3>
                <p className="text-gray-700">
                  Sì, puoi scegliere il dominio che preferisci (se disponibile). 
                  Ti aiutiamo a trovare il nome perfetto per la tua attività.
                </p>
              </div>

              {/* FAQ Item 8 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Il sito sarà ottimizzato per Google?
                </h3>
                <p className="text-gray-700">
                  Sì, includiamo l'ottimizzazione SEO di base: titoli, descrizioni, struttura corretta, 
                  velocità di caricamento e collegamento con Google My Business.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact-section" className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Non Perdere Questa Opportunità Unica!
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
              Solo <strong className="text-secondary">3 posti rimasti</strong> per questo mese a €197.<br />
              Tra pochi giorni il prezzo tornerà a €1200.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-secondary">Prenota Subito il Tuo Posto</h3>
              <p className="text-lg mb-6">
                🚀 <strong>Consegna:</strong> 3-5 giorni lavorativi garantiti
              </p>
              
              {/* Visualizzazione slot */}
              <div className="mb-6">
                <p className="text-lg font-medium mb-4 text-yellow-300">
                  Solo <span className="font-bold">3 posti rimasti</span> su 15 questo mese:
                </p>
                <div className="grid grid-cols-5 gap-2 mb-4 max-w-md mx-auto">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded ${i < 12 ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center text-xs font-bold`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-sm mb-6 opacity-90">
                  🔴 Occupati • 🟢 Disponibili
                </p>
              </div>

              {/* Form di contatto */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mt-6">
                <h4 className="text-xl font-bold mb-4 text-white">Contattaci per Prenotare</h4>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const data = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    businessType: formData.get('businessType'),
                    message: formData.get('message')
                  };
                  
                  fetch('/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  }).then(() => {
                    alert('Messaggio inviato! Ti ricontatteremo presto.');
                    (e.target as HTMLFormElement).reset();
                  });
                }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nome"
                      required
                      className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Cognome"
                      required
                      className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefono"
                      className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <select
                    name="businessType"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Seleziona tipo di attività</option>
                    <option value="ristorante">Ristorante/Bar</option>
                    <option value="negozio">Negozio/Retail</option>
                    <option value="servizi">Servizi professionali</option>
                    <option value="artigiano">Artigiano</option>
                    <option value="consulente">Consulente</option>
                    <option value="altro">Altro</option>
                  </select>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Raccontaci del tuo progetto..."
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    INVIA RICHIESTA
                  </button>
                </form>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-4 opacity-90">
                🔒 <strong>Sicuro e Professionale</strong> • ⚡ <strong>Risposta Immediata</strong> • 📞 <strong>Supporto Dedicato</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, type: 'stripe' })}
        paymentType={paymentModal.type}
      />
    </div>
  );
};

export default Offerta197Form;
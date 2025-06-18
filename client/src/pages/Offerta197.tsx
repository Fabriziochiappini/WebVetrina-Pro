import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Check, Clock, Star, Zap, Shield, Award, Heart } from 'lucide-react';
import { trackBusinessEvent } from '../lib/analytics';
import SalesPopup from '../components/SalesPopup';

const Offerta197 = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const scrollToContact = () => {
    trackBusinessEvent.ctaClick('landing_197', 'contact');
    const element = document.getElementById('contatto-landing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Consegna Ultra-Rapida",
      description: "Il tuo sito sarà online in soli 5 giorni lavorativi"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Design Professionale",
      description: "Grafica moderna e personalizzata per il tuo brand"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Qualità Garantita",
      description: "Standard professionali al prezzo più conveniente d'Italia"
    }
  ];

  const features = [
    "Sito web vetrina professionale (5-10 pagine)",
    "Design responsive ottimizzato per mobile",
    "Ottimizzazione SEO di base per Google",
    "Modulo di contatto funzionante",
    "Certificato SSL per la sicurezza",
    "Supporto email incluso",
    "Consegna garantita in 5 giorni"
  ];

  return (
    <div className="min-h-screen bg-white">
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
              Un'opportunità unica per avere un sito web aziendale di <strong>alta qualità</strong> 
              al prezzo più conveniente d'Italia. Non ricapiterà.
            </p>

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
                    <span>Sembri <strong>poco professionale</strong> rispetto alla concorrenza</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">⏰</span>
                    <span>Lavori solo <strong>negli orari di apertura</strong> - zero vendite di notte</span>
                  </li>
                </ul>
              </div>

              {/* Solution Side */}
              <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <span className="text-3xl mr-3">✅</span>
                  CON il Tuo Sito Web
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">🎯</span>
                    <span><strong>Nuovi clienti ti trovano</strong> automaticamente su Google</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">🏆</span>
                    <span>Appari <strong>professionale e affidabile</strong> come i grandi brand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">🤖</span>
                    <span>Lavora per te <strong>24 ore su 24</strong>, anche mentre dormi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">📱</span>
                    <span>I clienti ti <strong>contattano direttamente</strong> interessati ai tuoi servizi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">💰</span>
                    <span><strong>ROI garantito</strong>: il sito si ripaga da solo in 2-3 mesi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 p-8 rounded-xl text-center">
              <h3 className="text-3xl font-bold mb-6 text-secondary">I Numeri Non Mentono</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">84%</div>
                  <p className="text-gray-300">delle persone non si fida di aziende senza sito web</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">75%</div>
                  <p className="text-gray-300">giudica la credibilità dall'aspetto del sito</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">67%</div>
                  <p className="text-gray-300">preferisce aziende facilmente trovabili online</p>
                </div>
              </div>
              <p className="text-xl mt-6 text-white font-semibold">
                Ogni giorno che rimandi, <span className="text-red-400">perdi opportunità di business</span> che vanno ai tuoi concorrenti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-red-50 border-t-4 border-red-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-red-700">ATTENZIONE: Questa Offerta Scade Presto!</h2>
            </div>
            <p className="text-xl text-red-600 mb-8">
              Un sito web professionale di questa qualità normalmente costa <strong>€1200</strong>. 
              Questa è un'opportunità irripetibile per averlo a soli <strong>€197</strong>.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
              <p className="text-lg font-semibold text-gray-800">
                ⚡ Solo <span className="text-red-500 font-bold">3 posti rimasti</span> questo mese
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
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Google My Business</h3>
                <p className="text-gray-600">5 stelle - Recensioni verificate</p>
              </div>

              {/* Trustpilot */}
              <div className="text-center bg-gray-50 p-6 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Trustpilot</h3>
                <p className="text-gray-600">5 stelle - Valutazioni indipendenti</p>
              </div>

              {/* Facebook Recommendations */}
              <div className="text-center bg-gray-50 p-6 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex justify-center items-center mb-2">
                  <Heart className="w-6 h-6 text-red-500 mr-1" />
                  <span className="text-2xl font-bold text-gray-800">34</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Facebook</h3>
                <p className="text-gray-600">Consigliato da 34 persone</p>
              </div>
            </div>

            {/* Customer Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Incredibile! Un sito professionale a questo prezzo è un affare. 
                  Consegnato nei tempi promessi."
                </p>
                <p className="font-semibold">- Marco R., Ristorante</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Finalmente un'azienda seria che mantiene le promesse. 
                  Il mio sito è perfetto!"
                </p>
                <p className="font-semibold">- Anna T., Parrucchiera</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Rapporto qualità-prezzo imbattibile. 
                  Ho già ricevuto nuovi clienti grazie al sito."
                </p>
                <p className="font-semibold">- Giuseppe M., Idraulico</p>
              </div>
            </div>

            {/* Summary */}
            <div className="text-center mt-8">
              <p className="text-gray-700 text-lg">
                <strong className="text-primary">Oltre 150 clienti soddisfatti</strong> hanno scelto i nostri servizi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contatto-landing" className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Non Perdere Questa Opportunità Unica!
            </h2>
            <p className="text-xl mb-8">
              Trasforma la tua attività con un sito web professionale che attira nuovi clienti ogni giorno.
            </p>
            
            <div className="bg-white/10 p-8 rounded-2xl mb-10">
              <div className="text-6xl font-bold text-secondary mb-4">€197</div>
              <p className="text-xl mb-6">Prezzo tutto incluso • Nessun costo aggiuntivo</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Consegna in 5 giorni</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Design personalizzato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Mobile responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Supporto incluso</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                trackBusinessEvent.ctaClick('final_cta_197', 'contact');
                window.location.href = 'tel:+393479942321';
              }}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold py-6 px-12 rounded-full text-2xl transition-all duration-300 hover:scale-105 shadow-2xl mb-6"
            >
              CHIAMA SUBITO: +39 347 9942321
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  trackBusinessEvent.whatsappClick();
                  window.open('https://wa.me/393479942321?text=Salve,%20voglio%20il%20sito%20web%20a%20197%20euro', '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Scrivici su WhatsApp
              </Button>
              <Button 
                onClick={() => {
                  trackBusinessEvent.ctaClick('email_cta_197', 'contact');
                  window.location.href = 'mailto:info.webproitalia@gmail.com?subject=Voglio il sito web a 197 euro';
                }}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary font-bold py-4 px-8 rounded-full text-lg transition-all"
              >
                <i className="fas fa-envelope mr-2"></i>
                Invia Email
              </Button>
            </div>

            <p className="text-sm mt-6 opacity-90">
              ⚡ Risposta garantita entro 2 ore • Preventivo gratuito
            </p>
          </div>
        </div>
      </section>

      {/* Sales Popup */}
      <SalesPopup />
    </div>
  );
};

export default Offerta197;
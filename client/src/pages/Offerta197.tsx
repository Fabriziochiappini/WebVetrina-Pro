import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Check, Clock, Star, Zap, Shield, Award } from 'lucide-react';
import { trackBusinessEvent } from '../lib/analytics';

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
    </div>
  );
};

export default Offerta197;
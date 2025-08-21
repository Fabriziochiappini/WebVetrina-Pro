import { Button } from '../components/ui/button';
import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'wouter';
import { trackBusinessEvent } from '../lib/analytics';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <section className="relative gradient-primary text-white py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-accent/80"></div>
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8 fade-in">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-bold py-2 px-6 rounded-full border border-white/30">
              OFFERTA LIMITATA
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Realizzazione Siti Web Aziendali Professionali a Soli <span className="text-gradient-orange">€197</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium opacity-95 leading-relaxed">
              Creazione siti web per la tua attività • Valore reale €1200 • Consegna in 5 giorni
            </h2>
            <ul className="space-y-4 text-lg slide-up">
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Design full responsive</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Sito web aziendale ottimizzato SEO</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Alta velocità di caricamento</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Gestione Dominio, Hosting e SSL</span>
              </li>

            </ul>
            <div className="flex flex-col sm:flex-row gap-6 pt-6 scale-in">
              <Button 
                onClick={() => scrollToSection('contatti')} 
                className="btn-modern-orange text-lg font-bold py-4 px-8 rounded-2xl"
              >
                Voglio il Mio Sito Web <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => scrollToSection('come-funziona')} 
                className="glass text-white border-white/30 hover:bg-white/20 py-4 px-8 rounded-2xl font-medium transition-all"
              >
                Scopri di più <Info className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Realizzazione siti web aziendali professionali - Web Pro Italia" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            <Link href="/offerta-197">
              <div 
                className="absolute -bottom-5 -left-5 bg-white text-primary p-4 rounded-lg shadow-lg font-bold cursor-pointer hover:scale-105 transition-transform"
                onClick={() => trackBusinessEvent.ctaClick('hero_price_badge', 'landing_197')}
              >
                <span className="text-xl line-through text-gray-500">€1200</span>
                <span className="text-3xl ml-2 text-secondary">€197</span>
                <div className="text-xs text-center text-gray-600 mt-1">Clicca qui!</div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Riquadro dedicato per Mira - Stile ChatGPT */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Mira</h3>
                  <p className="text-white/80 text-sm">Assistente AI per realizzazione siti web</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-white/90 text-lg leading-relaxed">
                  Ciao! Sono Mira, la tua assistente AI specializzata in siti web. Posso aiutarti a:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-palette text-white text-xs"></i>
                    </div>
                    <span className="text-sm">Scegliere il design perfetto</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-euro-sign text-white text-xs"></i>
                    </div>
                    <span className="text-sm">Calcolare preventivi personalizzati</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-eye text-white text-xs"></i>
                    </div>
                    <span className="text-sm">Mostrarti portfolio del tuo settore</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-headset text-white text-xs"></i>
                    </div>
                    <span className="text-sm">Metterti in contatto con un esperto</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => {
                      // Trigger per aprire la chat di Mira
                      const chatButton = document.querySelector('[data-chat-toggle]') as HTMLElement;
                      if (chatButton) {
                        chatButton.click();
                      }
                    }}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    Parla con Mira Ora
                  </Button>
                </div>
                
                <p className="text-white/70 text-xs">
                  Risposta istantanea • Consulenza gratuita • Preventivi personalizzati
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;

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
        
        {/* Chat Input Diretto Stile ChatGPT */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto w-full">
            {/* Header Mira */}
            <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Mira - Assistente AI</h3>
                  <p className="text-white/90 text-sm">Specializzata in realizzazione siti web</p>
                </div>
              </div>
            </div>

            {/* Area Chat Input */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div className="text-gray-700">
                      <p className="font-medium mb-2">Ciao! Sono Mira, la tua assistente AI per siti web.</p>
                      <p className="text-sm">Posso aiutarti con preventivi, design, portfolio del tuo settore e molto altro. Scrivimi pure!</p>
                    </div>
                  </div>
                </div>

                {/* Input Field Stile ChatGPT */}
                <div className="relative">
                  <input
                    type="text"
                    id="hero-chat-input"
                    placeholder="Dimmi di che tipo di sito web hai bisogno..."
                    className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 text-base shadow-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          // Apri la chat e invia il messaggio
                          const chatButton = document.querySelector('[data-chat-toggle]') as HTMLElement;
                          if (chatButton) {
                            chatButton.click();
                            setTimeout(() => {
                              // Simula l'invio del messaggio nella chat
                              const chatInput = document.querySelector('input[placeholder*="Scrivi"]') as HTMLInputElement;
                              const sendButton = document.querySelector('button[type="submit"]') as HTMLElement;
                              if (chatInput && sendButton) {
                                chatInput.value = input.value;
                                chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                                setTimeout(() => sendButton.click(), 100);
                              }
                            }, 300);
                            input.value = '';
                          }
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('hero-chat-input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        const chatButton = document.querySelector('[data-chat-toggle]') as HTMLElement;
                        if (chatButton) {
                          chatButton.click();
                          setTimeout(() => {
                            const chatInput = document.querySelector('input[placeholder*="Scrivi"]') as HTMLInputElement;
                            const sendButton = document.querySelector('button[type="submit"]') as HTMLElement;
                            if (chatInput && sendButton) {
                              chatInput.value = input.value;
                              chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                              setTimeout(() => sendButton.click(), 100);
                            }
                          }, 300);
                          input.value = '';
                        }
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:from-orange-600 hover:to-purple-700 transition-all"
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                  </button>
                </div>

                {/* Suggerimenti rapidi */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      const input = document.getElementById('hero-chat-input') as HTMLInputElement;
                      if (input) {
                        input.value = 'Ho bisogno di un sito web per il mio ristorante';
                        input.focus();
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    Sito per ristorante
                  </button>
                  <button 
                    onClick={() => {
                      const input = document.getElementById('hero-chat-input') as HTMLInputElement;
                      if (input) {
                        input.value = 'Quanto costa un sito web professionale?';
                        input.focus();
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    Preventivo
                  </button>
                  <button 
                    onClick={() => {
                      const input = document.getElementById('hero-chat-input') as HTMLInputElement;
                      if (input) {
                        input.value = 'Voglio vedere esempi di siti web per la mia attività';
                        input.focus();
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    Portfolio
                  </button>
                </div>

                <p className="text-center text-gray-500 text-xs">
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

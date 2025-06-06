import { Button } from '@/components/ui/button';
import { ArrowRight, Info } from 'lucide-react';

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
              Sito Web Professionale a Soli <span className="text-gradient-orange">€299</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium opacity-95 leading-relaxed">
              Valore reale di €1200 • Consegna in soli 5 giorni
            </h2>
            <ul className="space-y-4 text-lg slide-up">
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Logo professionale incluso</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Design responsive professionale</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Sito ottimizzato per mobile</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm font-bold"></i>
                </div>
                <span className="text-white font-medium">Nessun costo nascosto</span>
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
              alt="Anteprima di un sito web professionale su laptop" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-5 -left-5 bg-white text-primary p-4 rounded-lg shadow-lg font-bold">
              <span className="text-xl line-through text-gray-500">€1200</span>
              <span className="text-3xl ml-2 text-secondary">€299</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;

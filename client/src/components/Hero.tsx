import { Button } from '@/components/ui/button';
import { ArrowRight, Info } from 'lucide-react';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <section className="relative bg-primary text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <span className="bg-secondary text-white text-sm font-bold py-1 px-4 rounded-full">
              OFFERTA LIMITATA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-heading">
              Sito Web Professionale a Soli <span className="text-secondary">€299</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium opacity-90">
              Valore reale di €1800 • Consegna in soli 5 giorni
            </h2>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-accent"></i>
                <span>Logo professionale incluso</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-accent"></i>
                <span>Hosting e dominio per 1 anno</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-accent"></i>
                <span>Sito ottimizzato per mobile</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check-circle text-accent"></i>
                <span>Nessun costo nascosto</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => scrollToSection('contatti')} 
                className="py-7 px-8 bg-secondary text-white text-lg font-bold rounded-full shadow-lg hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
              >
                Voglio il Mio Sito Web <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => scrollToSection('come-funziona')} 
                variant="outline"
                className="py-7 px-8 bg-white/10 text-white text-lg font-medium rounded-full border border-white/30 hover:bg-white/20 transition-all"
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
              <span className="text-xl line-through text-gray-500">€1800</span>
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

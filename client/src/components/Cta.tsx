import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CtaProps {
  scrollToSection: (id: string) => void;
}

const Cta = ({ scrollToSection }: CtaProps) => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
          Pronto a Far Crescere la Tua Attività Online?
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Non perdere questa opportunità unica: un sito web professionale, un logo personalizzato e tutto ciò che ti serve per avere successo online a soli €299.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="bg-white/10 p-4 rounded-lg flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-check text-white"></i>
            </div>
            <div className="text-left">
              <strong className="block">Consegna Rapida</strong>
              <span className="text-sm opacity-90">In soli 7 giorni</span>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-check text-white"></i>
            </div>
            <div className="text-left">
              <strong className="block">Tutto Incluso</strong>
              <span className="text-sm opacity-90">Logo, hosting, dominio</span>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-check text-white"></i>
            </div>
            <div className="text-left">
              <strong className="block">Alta Qualità</strong>
              <span className="text-sm opacity-90">Design professionale</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => scrollToSection('contatti')} 
          className="py-7 px-10 bg-secondary text-white text-xl font-bold rounded-full shadow-lg hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
        >
          Voglio il Mio Sito a €299 <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm mt-4 opacity-80">
          Offerta a tempo limitato • Solo 5 posti disponibili questo mese
        </p>
      </div>
    </section>
  );
};

export default Cta;

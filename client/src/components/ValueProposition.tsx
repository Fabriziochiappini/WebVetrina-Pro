import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ValuePropositionProps {
  scrollToSection: (id: string) => void;
}

const ValueProposition = ({ scrollToSection }: ValuePropositionProps) => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
            Risparmia €900 sul Tuo Sito Web Professionale
          </h2>
          
          <div className="bg-white/10 p-8 rounded-2xl mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-b md:border-b-0 md:border-r border-white/20 pb-6 md:pb-0 md:pr-8">
                <div className="text-3xl md:text-4xl font-bold mb-3 text-secondary font-heading">€299</div>
                <h3 className="text-2xl font-bold mb-4 font-heading">La Nostra Offerta</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Sito web professionale completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Design logo personalizzato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Ottimizzazione SEO completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Supporto tecnico 1 anno</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Responsive design mobile-friendly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Consegna in 5 giorni lavorativi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-accent mt-1"></i>
                    <span>Nessun costo nascosto</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-6 md:pt-0 md:pl-8">
                <div className="text-3xl md:text-4xl font-bold mb-3 line-through opacity-70 font-heading">€1200</div>
                <h3 className="text-2xl font-bold mb-4 font-heading">Valore di Mercato</h3>
                <ul className="space-y-3 text-left opacity-80">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle mt-1"></i>
                    <span>Sito web professionale: €800</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle mt-1"></i>
                    <span>Design logo: €300</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle mt-1"></i>
                    <span>Ottimizzazione SEO: €100</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => scrollToSection('contatti')} 
            className="py-7 px-10 bg-secondary text-white text-xl font-bold rounded-full shadow-lg hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
          >
            Approfitta dell'Offerta Ora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

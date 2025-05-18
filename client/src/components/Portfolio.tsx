import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { portfolio } from '@/assets/portfolio';

interface PortfolioProps {
  scrollToSection: (id: string) => void;
}

const Portfolio = ({ scrollToSection }: PortfolioProps) => {
  return (
    <section id="portfolio" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            I Nostri Lavori Recenti
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ecco alcuni progetti che abbiamo realizzato per i nostri clienti, ognuno consegnato in 7 giorni.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <div 
              key={index} 
              className="portfolio-item overflow-hidden rounded-xl shadow-md bg-white hover:scale-[1.03] transition-all duration-300"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 font-heading">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex space-x-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            onClick={() => scrollToSection('contatti')} 
            className="py-3 px-8 bg-secondary text-white font-bold rounded-full shadow-md hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
          >
            Voglio un Sito Come Questi <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

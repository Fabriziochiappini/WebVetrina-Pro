import { Button } from '../components/ui/button';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  websiteUrl: string;
  coverImage: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

interface PortfolioProps {
  scrollToSection: (id: string) => void;
}

const Portfolio = ({ scrollToSection }: PortfolioProps) => {
  const { data: allPortfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Filtra solo gli elementi in evidenza per la homepage
  const portfolioItems = allPortfolioItems.filter(item => item.featured);

  return (
    <section id="portfolio" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            I Nostri Lavori Recenti
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ecco alcuni progetti che abbiamo realizzato per i nostri clienti, ognuno consegnato in 5 giorni.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div 
              key={item.id} 
              className="portfolio-item overflow-hidden rounded-xl shadow-md bg-white hover:scale-[1.03] transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img 
                  src={item.coverImage} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white w-full">
                    <a 
                      href={item.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visualizza Sito
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 font-heading">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Progetti in arrivo...</p>
          </div>
        )}
        
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

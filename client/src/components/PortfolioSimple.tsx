import { Button } from "../components/ui/button";
import { ExternalLink, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  websiteUrl: string;
  coverImage: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  imageExists?: boolean;
}

const PortfolioSimple = () => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  const { data: allPortfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Filtra solo gli elementi in evidenza per la homepage
  const portfolioItems = allPortfolioItems.filter(item => item.featured);

  const handleImageError = (itemId: number) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const renderPortfolioCard = (item: PortfolioItem) => {
    const hasImageError = imageErrors.has(item.id);
    
    return (
      <div 
        key={item.id} 
        className="group relative aspect-square overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-primary to-secondary hover:scale-[1.03] transition-all duration-300"
      >
        {!hasImageError ? (
          <img 
            src={item.coverImage} 
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={() => handleImageError(item.id)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-6 relative">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-white/90 text-sm mb-4">{item.description}</p>
              )}
              <span className="text-white/80 text-xs">Sito Web Professionale</span>
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Immagine mancante
              </div>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white w-full">
            {!hasImageError && (
              <>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-white/90 text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
              </>
            )}
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
    );
  };

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
          {portfolioItems.map((item) => renderPortfolioCard(item))}
        </div>
        
        {portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Progetti in arrivo...</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio" className="inline-block">
              <Button 
                variant="outline"
                className="py-3 px-8 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
              >
                Vedi Tutti i Progetti
              </Button>
            </Link>
            <Button 
              onClick={() => {
                const element = document.getElementById('contatti');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="py-3 px-8 bg-secondary text-white font-bold rounded-full shadow-md hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
            >
              Voglio un Sito Come Questi <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSimple;
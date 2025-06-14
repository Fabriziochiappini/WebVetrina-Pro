import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
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
}

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl shadow-md bg-white hover:scale-[1.03] transition-all duration-300">
      <img 
        src={item.coverImage} 
        alt={item.title}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay con titolo e bottone */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-white/90 text-sm mb-4 line-clamp-2">{item.description}</p>
        )}
        <a 
          href={item.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors w-fit"
        >
          <ExternalLink className="h-4 w-4" />
          Visualizza Sito
        </a>
      </div>
      
      {/* Badge in evidenza */}
      {item.featured && (
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
            In Evidenza
          </span>
        </div>
      )}
    </div>
  );
};

const Portfolio = () => {
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <section className="section-modern">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                  Portfolio <span className="text-gradient-orange">Completo</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Caricamento progetti in corso...
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="section-modern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                Portfolio <span className="text-gradient-orange">Completo</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Scopri tutti i progetti che abbiamo realizzato per i nostri clienti. 
                Ogni sito è stato progettato e sviluppato con cura per garantire risultati eccellenti.
              </p>
            </div>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ExternalLink className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Portfolio in Costruzione</h3>
                  <p className="text-muted-foreground mb-6">
                    Stiamo aggiungendo i nostri progetti più recenti. Torna presto per vedere i nostri lavori!
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/#contatti'}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Contattaci per il Tuo Progetto
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {portfolioItems.map((item) => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="text-center">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-primary mb-3">
                      Vuoi un Sito Come Questi?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Inizia subito il tuo progetto web. Consegna garantita in 5 giorni lavorativi.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/#contatti'}
                      className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3 rounded-full"
                    >
                      Richiedi Preventivo Gratuito
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Portfolio;
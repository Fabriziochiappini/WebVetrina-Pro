import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import { Link } from "wouter";

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  type: "video" | "image" | "link";
  url: string;
  thumbnailUrl?: string;
  websiteUrl?: string;
  tags?: string[];
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

const PortfolioSection = () => {
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio/featured"],
  });

  if (isLoading) {
    return (
      <section className="section-modern bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              I Nostri <span className="text-gradient-orange">Lavori</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Scopri alcuni dei progetti che abbiamo realizzato per i nostri clienti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="modern-card-hover p-0 overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-modern bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            I Nostri <span className="text-gradient-orange">Lavori</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Scopri alcuni dei progetti che abbiamo realizzato per i nostri clienti
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {portfolioItems.slice(0, 6).map((item, index) => (
            <div 
              key={item.id} 
              className="modern-card-hover p-0 overflow-hidden slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square group">
                {item.type === "video" ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>
                ) : item.type === "image" ? (
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <ExternalLink className="h-16 w-16 text-primary" />
                  </div>
                )}
                
                {item.websiteUrl && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      className="btn-modern-orange"
                      onClick={() => window.open(item.websiteUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/portfolio">
            <Button className="btn-modern-primary text-lg py-3 px-8">
              Vedi Tutti i Progetti
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
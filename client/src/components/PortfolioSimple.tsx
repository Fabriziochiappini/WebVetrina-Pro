import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "wouter";

const PortfolioSimple = () => {
  // Portfolio items con dati di esempio per dimostrare il layout
  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Moda",
      description: "Piattaforma e-commerce completa per boutique di moda",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
      websiteUrl: "https://example-fashion.com",
      tags: ["E-commerce", "Responsive", "SEO"]
    },
    {
      id: 2,
      title: "Studio Legale",
      description: "Sito istituzionale per studio legale con area riservata",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      websiteUrl: "https://example-law.com",
      tags: ["Business", "Professionale", "Sicuro"]
    },
    {
      id: 3,
      title: "Ristorante Gourmet",
      description: "Sito vetrina con menu digitale e prenotazioni online",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop",
      websiteUrl: "https://example-restaurant.com",
      tags: ["Ristorante", "Prenotazioni", "Menu"]
    },
    {
      id: 4,
      title: "Agenzia Immobiliare",
      description: "Portale immobiliare con ricerca avanzata proprietà",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
      websiteUrl: "https://example-real-estate.com",
      tags: ["Immobiliare", "Ricerca", "CRM"]
    },
    {
      id: 5,
      title: "Palestra Fitness",
      description: "Sito con booking classi e area membri",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      websiteUrl: "https://example-gym.com",
      tags: ["Fitness", "Booking", "Membership"]
    },
    {
      id: 6,
      title: "Azienda Tecnologica",
      description: "Sito corporate con portfolio servizi IT",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
      websiteUrl: "https://example-tech.com",
      tags: ["Corporate", "IT Services", "Portfolio"]
    }
  ];

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
          {portfolioItems.map((item, index) => (
            <div 
              key={item.id} 
              className="modern-card-hover p-0 overflow-hidden slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button 
                      size="sm" 
                      className="btn-modern-orange w-full"
                      onClick={() => window.open(item.websiteUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visita Sito
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
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

export default PortfolioSimple;
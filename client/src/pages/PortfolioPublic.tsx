import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

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

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("all");

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
                  <div key={i} className="modern-card-hover p-0 overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const filteredItems = portfolioItems.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const videoItems = filteredItems.filter(item => item.type === "video");
  const imageItems = filteredItems.filter(item => item.type === "image");
  const linkItems = filteredItems.filter(item => item.type === "link");

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
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tutti i nostri progetti, video dimostrativi e siti web realizzati
              </p>
            </div>

            <div className="mb-8 flex justify-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Tutti</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="image">Screenshot</TabsTrigger>
                  <TabsTrigger value="link">Link</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="all" className="space-y-12">
                {/* Video Section */}
                {videoItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Video Dimostrativi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videoItems.map(item => (
                        <PortfolioCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Section */}
                {imageItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Screenshot Progetti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {imageItems.map(item => (
                        <PortfolioCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Link Section */}
                {linkItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Siti Web Realizzati</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {linkItems.map(item => (
                        <PortfolioCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {portfolioItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nessun progetto disponibile al momento.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoItems.map(item => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                  {videoItems.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">Nessun video disponibile al momento.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageItems.map(item => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                  {imageItems.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">Nessun screenshot disponibile al momento.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="link">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {linkItems.map(item => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                  {linkItems.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">Nessun link disponibile al momento.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <div className="modern-card-hover p-0 overflow-hidden group">
      <div className="relative aspect-video">
        {item.type === "video" ? (
          <div className="relative w-full h-full">
            <img 
              src={item.thumbnailUrl || item.url} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        ) : item.type === "image" ? (
          <img 
            src={item.url} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <ExternalLink className="h-12 w-12 text-primary" />
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
        
        {item.featured && (
          <Badge className="absolute top-4 left-4 bg-secondary">
            In Evidenza
          </Badge>
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
  );
};

export default Portfolio;
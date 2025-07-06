import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, Target, MapPin, Building, Sparkles } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

const SEOStrategyDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastGeneratedType, setLastGeneratedType] = useState<string>("");

  // Strategia SEO avanzata
  const seoStrategy = {
    keywords: [
      "realizzazione siti web aziendali professionali",
      "creazione siti web professionali aziendali per attività",
      "realizzazione siti web economici"
    ],
    cities: [
      "Milano", "Roma", "Torino", "Napoli", "Palermo", "Genova", 
      "Bologna", "Firenze", "Venezia", "Verona", "Padova", "Trieste",
      "Brescia", "Parma", "Modena", "Reggio Emilia", "Perugia", "Ancona", "Pescara", "Bari"
    ],
    sectors: [
      "Dentisti e Studi Medici", "Ditte Edili", "Ristoranti e Pizzerie",
      "Avvocati e Studi Legali", "Parrucchieri e Centri Estetici", 
      "Officine e Autofficine", "Negozi e Retail", "Architetti e Ingegneri",
      "Consulenti e Commercialisti", "Palestre e Fitness"
    ]
  };

  // Mutation per generare articolo SEO strategico
  const generateSEOMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/blog/generate-seo");
    },
    onSuccess: (data) => {
      const article = data.article;
      setLastGeneratedType(getArticleType(article.title));
      toast({
        title: "Articolo SEO Strategico Generato!",
        description: `"${article.title}" pubblicato automaticamente`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: "Errore nella generazione SEO: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Funzione per determinare il tipo di articolo generato
  const getArticleType = (title: string) => {
    const hasCity = seoStrategy.cities.some(city => title.includes(city));
    const hasSector = seoStrategy.sectors.some(sector => title.includes(sector));
    
    if (hasCity && hasSector) return "geo-sector-keyword";
    if (hasCity) return "geo-keyword";
    if (hasSector) return "sector-keyword";
    return "general-keyword";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "geo-keyword": return "🌍 Geo-localizzato";
      case "sector-keyword": return "🏢 Settoriale";
      case "geo-sector-keyword": return "🎯 Geo + Settore";
      default: return "📝 Generale";
    }
  };

  const getCombinationCount = () => {
    const geoKeyword = seoStrategy.keywords.length * seoStrategy.cities.length; // 3 × 20 = 60
    const sectorKeyword = seoStrategy.keywords.length * seoStrategy.sectors.length; // 3 × 10 = 30
    const geoSectorKeyword = seoStrategy.keywords.length * 5 * 5; // 3 × 5 × 5 = 75 (top combinations)
    
    return geoKeyword + sectorKeyword + geoSectorKeyword; // 165 combinazioni totali
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Strategia SEO Avanzata
          </h2>
          <p className="text-muted-foreground">
            Sistema di generazione articoli con targeting geografico e settoriale
          </p>
        </div>
        
        <Button 
          onClick={() => generateSEOMutation.mutate()}
          disabled={generateSEOMutation.isPending}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          {generateSEOMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Genera Articolo SEO
            </>
          )}
        </Button>
      </div>

      {/* Statistiche della strategia */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Keywords Core</p>
                <p className="text-2xl font-bold">{seoStrategy.keywords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Città Target</p>
                <p className="text-2xl font-bold">{seoStrategy.cities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Settori</p>
                <p className="text-2xl font-bold">{seoStrategy.sectors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Combinazioni</p>
                <p className="text-2xl font-bold">{getCombinationCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ultimo articolo generato */}
      {lastGeneratedType && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">Ultimo Articolo Generato</p>
                <p className="text-sm text-green-700">
                  Tipo: {getTypeLabel(lastGeneratedType)}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                SEO Strategico
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords principali */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keywords Principali
          </CardTitle>
          <CardDescription>
            Parole chiave core della strategia SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {seoStrategy.keywords.map((keyword, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <code className="text-sm font-mono">{keyword}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Città target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Targeting Geografico
          </CardTitle>
          <CardDescription>
            20 città principali italiane per targeting locale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {seoStrategy.cities.map((city, index) => (
              <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                {city}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settori target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-500" />
            Settori Specifici
          </CardTitle>
          <CardDescription>
            10 settori business con pain points e soluzioni specifiche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {seoStrategy.sectors.map((sector, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{sector}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info strategia */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">🎯 Strategia SEO Ferrari:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>165+ combinazioni</strong> di articoli SEO mirati</li>
              <li>• <strong>Geo-targeting:</strong> Articoli specifici per città italiane</li>
              <li>• <strong>Settori verticali:</strong> Contenuti per business specifici</li>
              <li>• <strong>Long-tail keywords:</strong> "Realizzazione siti web per dentisti Milano"</li>
              <li>• <strong>Automazione intelligente:</strong> Selezione casuale strategica</li>
              <li>• <strong>Contenuti 1500+ parole:</strong> Approfondimenti SEO completi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOStrategyDashboard;
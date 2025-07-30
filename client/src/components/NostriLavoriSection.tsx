import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface NostriLavoriItem {
  id: number;
  titolo: string;
  descrizione: string;
  linkSito: string;
  immaginePath: string;
  inEvidenza: boolean;
  ordine: number;
  creatoIl: string;
  aggiornatoIl: string;
}

export default function NostriLavoriSection() {
  const { data: lavori = [], isLoading } = useQuery<NostriLavoriItem[]>({
    queryKey: ["/api/nostri-lavori"],
    select: (data) => data?.filter(item => item.inEvidenza)?.slice(0, 6) || []
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Lavori</h2>
            <p className="text-xl text-gray-600">Progetti realizzati con successo per i nostri clienti</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-200 animate-pulse rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (lavori.length === 0) {
    return null; // Non mostrare la sezione se non ci sono lavori in evidenza
  }

  return (
    <section className="py-20 bg-gray-50" id="lavori">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Lavori</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri i progetti realizzati con successo per i nostri clienti. 
            Ogni sito web è progettato su misura per rispondere alle specifiche esigenze del business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {lavori.map((lavoro) => (
            <Card key={lavoro.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                  {lavoro.immaginePath ? (
                    <img 
                      src={lavoro.immaginePath} 
                      alt={lavoro.titolo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${lavoro.immaginePath ? 'hidden' : ''}`}>
                    <Eye className="w-12 h-12 text-white opacity-70" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {lavoro.titolo}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {lavoro.descrizione}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                    onClick={() => window.open(lavoro.linkSito, '_blank')}
                  >
                    Visita Sito
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {lavori.length >= 6 && (
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Vedi Tutti i Progetti
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
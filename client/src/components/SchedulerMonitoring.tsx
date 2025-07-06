import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Server, Loader2, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface SchedulerStatus {
  schedulerActive: boolean;
  environment: string;
  nextRunTime: string;
  timeUntilNext: string;
  currentTime: string;
  status: string;
}

const SchedulerMonitoring = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Query per lo stato dello scheduler
  const { data: schedulerStatus, isLoading: statusLoading } = useQuery<SchedulerStatus>({
    queryKey: ['/api/scheduler/status'],
    refetchInterval: 30000, // Aggiorna ogni 30 secondi
  });

  // Mutation per generare articolo manualmente
  const generateArticle = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/blog/generate-daily");
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Articolo Generato",
        description: `Articolo "${data.article.title}" pubblicato con successo`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Errore Generazione",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleGenerateNow = () => {
    generateArticle.mutate();
  };

  if (statusLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Caricamento stato scheduler...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Scheduler Articoli Automatici
          </CardTitle>
          <CardDescription>
            Monitora e gestisci la generazione automatica degli articoli del blog
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {schedulerStatus && (
            <>
              {/* Stato generale */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Ambiente</p>
                    <Badge variant={schedulerStatus.environment === 'production' ? 'default' : 'secondary'}>
                      {schedulerStatus.environment.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {schedulerStatus.schedulerActive ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />
                  }
                  <div>
                    <p className="text-sm font-medium">Stato Scheduler</p>
                    <Badge variant={schedulerStatus.schedulerActive ? 'default' : 'destructive'}>
                      {schedulerStatus.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Ora Corrente</p>
                    <p className="text-sm text-gray-600">{schedulerStatus.currentTime}</p>
                  </div>
                </div>
              </div>

              {/* Informazioni prossima esecuzione */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Prossima Generazione Automatica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Data e Ora</p>
                    <p className="font-medium">{schedulerStatus.nextRunTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo Rimanente</p>
                    <p className="font-medium">{schedulerStatus.timeUntilNext}</p>
                  </div>
                </div>
                {!schedulerStatus.schedulerActive && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Lo scheduler è disattivato in modalità development. 
                      Sarà attivo automaticamente una volta deployato in produzione.
                    </p>
                  </div>
                )}
              </div>

              {/* Azioni manuali */}
              <div className="space-y-4">
                <h4 className="font-medium">Azioni Manuali</h4>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleGenerateNow}
                    disabled={generateArticle.isPending || isGenerating}
                    className="flex items-center"
                  >
                    {(generateArticle.isPending || isGenerating) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generazione in corso...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Genera Articolo Ora
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Genera immediatamente un nuovo articolo senza aspettare lo scheduler automatico
                </p>
              </div>

              {/* Informazioni sui costi */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-2 text-blue-900">💰 Informazioni Costi</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Costo per articolo: €0.10-0.15 (OpenAI GPT-4o)</p>
                  <p>• Generazione automatica: 1 articolo al giorno alle 09:00</p>
                  <p>• Costo mensile stimato: €3-4.50</p>
                  <p>• Articoli: 1500-2000+ parole, immagini stock, SEO ottimizzato</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulerMonitoring;
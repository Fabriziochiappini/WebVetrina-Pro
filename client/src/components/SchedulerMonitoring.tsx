import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Server, Loader2, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface ScheduleConfig {
  article1Time: string;
  article2Time: string;
  article3Time: string;
  enabled: boolean;
}

interface SchedulerStatus {
  schedulerActive: boolean;
  environment: string;
  currentTime: string;
  scheduleConfig: ScheduleConfig;
  status: string;
}

const SchedulerMonitoring = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [article1Time, setArticle1Time] = useState("09:00");
  const [article2Time, setArticle2Time] = useState("14:00");
  const [article3Time, setArticle3Time] = useState("18:00");
  const [enabled, setEnabled] = useState(false);

  // Query per lo stato dello scheduler
  const { data: schedulerStatus, isLoading: statusLoading } = useQuery<SchedulerStatus>({
    queryKey: ['/api/scheduler/status'],
    refetchInterval: 10000, // Aggiorna ogni 10 secondi per i test
    onSuccess: (data) => {
      if (data?.scheduleConfig) {
        setArticle1Time(data.scheduleConfig.article1Time);
        setArticle2Time(data.scheduleConfig.article2Time);
        setArticle3Time(data.scheduleConfig.article3Time);
        setEnabled(data.scheduleConfig.enabled);
      }
    }
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

  // Mutation per aggiornare configurazione
  const updateConfig = useMutation({
    mutationFn: async (config: ScheduleConfig) => 
      apiRequest(`/api/scheduler/config`, {
        method: 'POST',
        body: JSON.stringify(config),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: (data) => {
      toast({
        title: "✅ Configurazione Salvata",
        description: `Scheduler ${data.config.enabled ? 'attivato' : 'disattivato'}. Orari: ${data.config.article1Time}, ${data.config.article2Time}, ${data.config.article3Time}`,
      });
      // NON invalidare subito la query per evitare il reset dei campi
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/scheduler/status'] });
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerateNow = () => {
    generateArticle.mutate();
  };

  const handleSaveConfig = () => {
    updateConfig.mutate({
      article1Time,
      article2Time,
      article3Time,
      enabled
    });
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

              {/* Configurazione orari */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-4">⚙️ Configurazione 3 Articoli Giornalieri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="article1Time">Articolo 1 - Orario</Label>
                    <Input
                      id="article1Time"
                      type="time"
                      value={article1Time}
                      onChange={(e) => setArticle1Time(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="article2Time">Articolo 2 - Orario</Label>
                    <Input
                      id="article2Time"
                      type="time"
                      value={article2Time}
                      onChange={(e) => setArticle2Time(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="article3Time">Articolo 3 - Orario</Label>
                    <Input
                      id="article3Time"
                      type="time"
                      value={article3Time}
                      onChange={(e) => setArticle3Time(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="schedulerEnabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="schedulerEnabled" className="font-medium">
                    Attiva Scheduler Automatico (3 articoli al giorno)
                  </Label>
                </div>

                <Button 
                  onClick={handleSaveConfig}
                  disabled={updateConfig.isPending}
                  className="w-full"
                >
                  {updateConfig.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aggiornamento...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Salva Configurazione
                    </>
                  )}
                </Button>

                {enabled && (
                  <div className="mt-3 space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✅ Scheduler attivo! Articoli programmati per: {article1Time}, {article2Time}, {article3Time}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-sm font-medium mb-2">Forza Esecuzione Immediata:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(num => (
                          <Button
                            key={num}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              fetch(`/api/scheduler/force/${num}`, { method: 'POST' })
                                .then(res => res.json())
                                .then(data => {
                                  toast({
                                    title: `Articolo ${num} Forzato`,
                                    description: `"${data.article.title}" pubblicato`,
                                  });
                                  queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
                                })
                                .catch(error => {
                                  toast({
                                    title: "Errore Esecuzione",
                                    description: error.message,
                                    variant: "destructive",
                                  });
                                });
                            }}
                            className="text-xs"
                          >
                            Art. {num}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Forza l'esecuzione immediata di uno specifico articolo programmato
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Azioni manuali */}
              <div className="space-y-4">
                <h4 className="font-medium">🧪 Test e Azioni Manuali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={handleGenerateNow}
                    disabled={generateArticle.isPending || isGenerating}
                    className="flex items-center"
                  >
                    {(generateArticle.isPending || isGenerating) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generazione...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Genera Ora
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={() => {
                      // Test dello scheduler
                      fetch('/api/scheduler/test-now', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => {
                          toast({
                            title: "Test Completato",
                            description: `Articolo test: "${data.article.title}"`,
                          });
                          queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
                        })
                        .catch(error => {
                          toast({
                            title: "Test Fallito",
                            description: error.message,
                            variant: "destructive",
                          });
                        });
                    }}
                    variant="outline"
                    className="flex items-center"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Test Scheduler
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Usa "Genera Ora" per test normali o "Test Scheduler" per simulare l'esecuzione automatica
                </p>
              </div>

              {/* Informazioni sui costi */}
              <div className="border rounded-lg p-4 bg-purple-50">
                <h4 className="font-medium mb-2 text-purple-900">💰 Costi e Performance</h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• Costo per articolo: €0.10-0.15 (OpenAI GPT-4o)</p>
                  <p>• Con 3 articoli/giorno: €9-13.50/mese</p>
                  <p>• Articoli: 1500-2000+ parole, immagini stock, SEO ottimizzato</p>
                  <p>• ROI: Ottimo per content marketing intensivo</p>
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
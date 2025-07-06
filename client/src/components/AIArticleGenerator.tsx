import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bot, Plus, Clock, BookOpen } from 'lucide-react';

const AIArticleGenerator = () => {
  const [customTopic, setCustomTopic] = useState('');
  const [customFocus, setCustomFocus] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available topics
  const { data: topics = [] } = useQuery({
    queryKey: ['/api/blog/topics'],
    queryFn: async () => {
      const response = await fetch('/api/blog/topics');
      if (!response.ok) throw new Error('Failed to fetch topics');
      return response.json();
    }
  });

  // Generate custom article
  const customGenerateMutation = useMutation({
    mutationFn: async ({ topic, focus }: { topic: string; focus: string }) => {
      return await apiRequest('POST', '/api/blog/generate', { topic, focus });
    },
    onSuccess: (data) => {
      toast({
        title: "Articolo Generato",
        description: `"${data.article.title}" è stato creato e pubblicato automaticamente`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setCustomTopic('');
      setCustomFocus('');
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: "Errore durante la generazione: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Generate daily article
  const dailyGenerateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/blog/generate-daily');
    },
    onSuccess: (data) => {
      toast({
        title: "Articolo Giornaliero Generato",
        description: `"${data.article.title}" è stato pubblicato automaticamente`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: "Errore durante la generazione: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Generate from predefined topic
  const topicGenerateMutation = useMutation({
    mutationFn: async (topicData: { topic: string; focus: string }) => {
      return await apiRequest('POST', '/api/blog/generate', topicData);
    },
    onSuccess: (data) => {
      toast({
        title: "Articolo Generato",
        description: `"${data.article.title}" è stato creato e pubblicato`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: "Errore durante la generazione: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleCustomGenerate = () => {
    if (!customTopic.trim() || !customFocus.trim()) {
      toast({
        title: "Campi mancanti",
        description: "Inserisci sia il topic che il focus",
        variant: "destructive",
      });
      return;
    }
    customGenerateMutation.mutate({ topic: customTopic, focus: customFocus });
  };

  const handleTopicGenerate = () => {
    const topic = topics.find((t: any) => t.topic === selectedTopic);
    if (!topic) {
      toast({
        title: "Errore",
        description: "Seleziona un topic valido",
        variant: "destructive",
      });
      return;
    }
    topicGenerateMutation.mutate(topic);
  };

  const isLoading = customGenerateMutation.isPending || dailyGenerateMutation.isPending || topicGenerateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Generatore Articoli AI</h2>
      </div>

      {/* Quick Daily Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Genera Articolo Giornaliero
          </CardTitle>
          <CardDescription>
            Genera automaticamente un articolo SEO ottimizzato con topic casuale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => dailyGenerateMutation.mutate()}
            disabled={isLoading}
            className="w-full"
          >
            {dailyGenerateMutation.isPending ? 'Generando...' : 'Genera Articolo Ora'}
          </Button>
        </CardContent>
      </Card>

      {/* Predefined Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Topic Predefiniti
          </CardTitle>
          <CardDescription>
            Scegli da una lista di argomenti ottimizzati per il settore web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic-select">Seleziona Topic</Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Scegli un argomento..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic: any, index: number) => (
                  <SelectItem key={index} value={topic.topic}>
                    {topic.topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedTopic && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Focus:</strong> {topics.find((t: any) => t.topic === selectedTopic)?.focus}
              </p>
            </div>
          )}

          <Button
            onClick={handleTopicGenerate}
            disabled={!selectedTopic || isLoading}
            className="w-full"
          >
            {topicGenerateMutation.isPending ? 'Generando...' : 'Genera da Topic Selezionato'}
          </Button>
        </CardContent>
      </Card>

      {/* Custom Article */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Articolo Personalizzato
          </CardTitle>
          <CardDescription>
            Crea un articolo con topic e focus specifici
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-topic">Topic Personalizzato</Label>
            <Input
              id="custom-topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="es. Manutenzione siti web WordPress"
            />
          </div>
          
          <div>
            <Label htmlFor="custom-focus">Focus Specifico</Label>
            <Textarea
              id="custom-focus"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="es. guida dettagliata su aggiornamenti, backup e sicurezza per siti WordPress aziendali"
              rows={3}
            />
          </div>

          <Button
            onClick={handleCustomGenerate}
            disabled={!customTopic.trim() || !customFocus.trim() || isLoading}
            className="w-full"
          >
            {customGenerateMutation.isPending ? 'Generando...' : 'Genera Articolo Personalizzato'}
          </Button>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">🤖 Sistema Automatico:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Articoli generati automaticamente ogni giorno alle 09:00 (solo in produzione)</li>
              <li>• Ottimizzazione SEO per "realizzazione siti web professionali"</li>
              <li>• Contenuti di 1500-2000 parole con struttura professionale</li>
              <li>• Pubblicazione automatica con slug e meta tags ottimizzati</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIArticleGenerator;
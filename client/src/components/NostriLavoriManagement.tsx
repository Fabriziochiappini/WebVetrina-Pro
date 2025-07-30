import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink, Image, Save, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface NostriLavori {
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

export default function NostriLavoriManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    linkSito: '',
    inEvidenza: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch lavori
  const { data: lavori = [], isLoading } = useQuery({
    queryKey: ['/api/nostri-lavori'],
    queryFn: () => apiRequest('GET', '/api/nostri-lavori')
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('POST', '/api/nostri-lavori', data, {
        'Content-Type': undefined // Let browser set for FormData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nostri-lavori'] });
      resetForm();
      toast({
        title: "✅ Lavoro aggiunto",
        description: "Il progetto è stato aggiunto con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Errore",
        description: "Errore durante l'aggiunta del progetto",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return apiRequest('PUT', `/api/nostri-lavori/${id}`, data, {
        'Content-Type': undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nostri-lavori'] });
      resetForm();
      toast({
        title: "✅ Lavoro aggiornato",
        description: "Il progetto è stato aggiornato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Errore",
        description: "Errore durante l'aggiornamento del progetto",
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/nostri-lavori/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nostri-lavori'] });
      toast({
        title: "✅ Lavoro eliminato",
        description: "Il progetto è stato eliminato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Errore",
        description: "Errore durante l'eliminazione del progetto",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      titolo: '',
      descrizione: '',
      linkSito: '',
      inEvidenza: false
    });
    setSelectedFile(null);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titolo || !formData.linkSito || (!selectedFile && !editingId)) {
      toast({
        title: "❌ Errore",
        description: "Titolo, link sito e immagine sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('titolo', formData.titolo);
    submitData.append('descrizione', formData.descrizione);
    submitData.append('linkSito', formData.linkSito);
    submitData.append('inEvidenza', formData.inEvidenza.toString());

    if (selectedFile) {
      submitData.append('immagine', selectedFile);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const startEdit = (lavoro: NostriLavori) => {
    setFormData({
      titolo: lavoro.titolo,
      descrizione: lavoro.descrizione || '',
      linkSito: lavoro.linkSito,
      inEvidenza: lavoro.inEvidenza
    });
    setEditingId(lavoro.id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">I Nostri Lavori</h2>
          <p className="text-gray-600">Sistema portfolio permanente - Le foto non si perdono mai</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-orange-600 hover:bg-orange-700"
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Progetto
        </Button>
      </div>

      {/* Form per creare/modificare */}
      {isCreating && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">
              {editingId ? 'Modifica Progetto' : 'Nuovo Progetto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titolo">Titolo Progetto *</Label>
                  <Input
                    id="titolo"
                    value={formData.titolo}
                    onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                    placeholder="es. E-commerce Abbigliamento"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkSito">Link al Sito *</Label>
                  <Input
                    id="linkSito"
                    type="url"
                    value={formData.linkSito}
                    onChange={(e) => setFormData({ ...formData, linkSito: e.target.value })}
                    placeholder="https://esempio.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descrizione">Descrizione</Label>
                <Textarea
                  id="descrizione"
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                  placeholder="Breve descrizione del progetto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="immagine">
                  Immagine di Copertina {!editingId && '*'}
                </Label>
                <Input
                  id="immagine"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-100 file:text-orange-700"
                />
                {editingId && !selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Lascia vuoto per mantenere l'immagine attuale
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="inEvidenza"
                  checked={formData.inEvidenza}
                  onCheckedChange={(checked) => setFormData({ ...formData, inEvidenza: checked })}
                />
                <Label htmlFor="inEvidenza">In evidenza</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Aggiorna' : 'Aggiungi'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="w-4 h-4 mr-2" />
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista lavori */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lavori.map((lavoro: NostriLavori) => (
          <Card key={lavoro.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={lavoro.immaginePath}
                alt={lavoro.titolo}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
              {lavoro.inEvidenza && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                  IN EVIDENZA
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{lavoro.titolo}</h3>
              {lavoro.descrizione && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {lavoro.descrizione}
                </p>
              )}
              <div className="flex justify-between items-center">
                <a
                  href={lavoro.linkSito}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 text-sm flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visita sito
                </a>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(lavoro)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(lavoro.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Creato: {new Date(lavoro.creatoIl).toLocaleDateString('it-IT')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lavori.length === 0 && (
        <Card className="p-8 text-center">
          <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun progetto ancora
          </h3>
          <p className="text-gray-600 mb-4">
            Inizia aggiungendo il tuo primo progetto per costruire il portfolio.
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Primo Progetto
          </Button>
        </Card>
      )}
    </div>
  );
}
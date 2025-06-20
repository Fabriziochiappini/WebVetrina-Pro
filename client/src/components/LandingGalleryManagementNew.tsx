import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Trash2, Edit2, Plus, Upload, Image } from 'lucide-react';

interface LandingGalleryImage {
  id: number;
  title: string;
  description?: string;
  fileName?: string;
  filePath?: string;
  imageUrl?: string; // Backward compatibility
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
  image: File | null;
}

export default function LandingGalleryManagementNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LandingGalleryImage | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    altText: '',
    sortOrder: 0,
    isActive: true,
    image: null
  });

  // Fetch gallery images
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['/api/landing-gallery'],
  });

  console.log('Gallery data:', images, 'Loading:', isLoading, 'Error:', error);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!data.image) {
        throw new Error('Immagine obbligatoria');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('altText', data.altText);
      formDataToSend.append('sortOrder', data.sortOrder.toString());
      formDataToSend.append('isActive', data.isActive.toString());
      formDataToSend.append('image', data.image);

      const response = await fetch('/api/landing-gallery', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Immagine aggiunta con successo!",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('altText', data.altText);
      formDataToSend.append('sortOrder', data.sortOrder.toString());
      formDataToSend.append('isActive', data.isActive.toString());
      if (data.image) {
        formDataToSend.append('image', data.image);
      }

      const response = await fetch(`/api/landing-gallery/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Immagine aggiornata con successo!",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/landing-gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      toast({
        title: "Successo",
        description: "Immagine eliminata con successo!",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'immagine",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      altText: '',
      sortOrder: 0,
      isActive: true,
      image: null
    });
    setEditingImage(null);
  };

  const openEditDialog = (image: LandingGalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      altText: image.altText || '',
      sortOrder: image.sortOrder,
      isActive: image.isActive,
      image: null
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Errore",
        description: "Il titolo è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    if (!editingImage && !formData.image) {
      toast({
        title: "Errore",
        description: "L'immagine è obbligatoria per nuove voci",
        variant: "destructive",
      });
      return;
    }

    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verifica tipo file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Errore",
          description: "Seleziona solo file immagine",
          variant: "destructive",
        });
        return;
      }

      // Verifica dimensione (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Errore",
          description: "L'immagine deve essere inferiore a 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Caricamento galleria...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Errore caricamento galleria: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestione Galleria Landing</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Immagine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Modifica Immagine' : 'Aggiungi Immagine'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titolo*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titolo dell'immagine"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione dell'immagine"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="altText">Testo Alt</Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  placeholder="Testo alternativo per accessibilità"
                />
              </div>

              <div>
                <Label htmlFor="sortOrder">Ordine</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Attiva</Label>
              </div>

              <div>
                <Label htmlFor="image">
                  Immagine {!editingImage && '*'}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.image && (
                  <p className="text-sm text-gray-600 mt-1">
                    File selezionato: {formData.image.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    "Salvando..."
                  ) : editingImage ? (
                    "Aggiorna"
                  ) : (
                    "Aggiungi"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image: LandingGalleryImage) => (
          <Card key={image.id} className={`${!image.isActive ? 'opacity-50' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm truncate">{image.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(image)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(image.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={image.filePath || image.imageUrl}
                  alt={image.altText || image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-gray-500 text-center p-4 flex flex-col items-center">
                        <div class="w-8 h-8 mb-2 text-gray-400">📷</div>
                        <p class="text-xs">Immagine non trovata</p>
                      </div>
                    `;
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 truncate">{image.description}</p>
              <p className="text-xs text-gray-500 mt-1">Ordine: {image.sortOrder}</p>
              <p className="text-xs text-gray-500">File: {image.fileName || 'N/A'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna immagine</h3>
          <p className="text-gray-500 mb-4">Inizia aggiungendo la prima immagine alla galleria</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Prima Immagine
          </Button>
        </div>
      )}
    </div>
  );
}
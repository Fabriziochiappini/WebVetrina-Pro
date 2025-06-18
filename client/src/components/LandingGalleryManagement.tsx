import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Trash2, Plus, Edit2, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

interface LandingGalleryImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
}

export default function LandingGalleryManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LandingGalleryImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    sortOrder: 0,
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery<LandingGalleryImage[]>({
    queryKey: ['/api/landing-gallery'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formDataObj = new FormData();
      formDataObj.append('title', data.title);
      formDataObj.append('description', data.description);
      formDataObj.append('altText', data.altText);
      formDataObj.append('sortOrder', data.sortOrder.toString());
      formDataObj.append('isActive', data.isActive.toString());
      
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      } else if (data.imageUrl) {
        formDataObj.append('imageUrl', data.imageUrl);
      }

      const response = await fetch('/api/landing-gallery', {
        method: 'POST',
        body: formDataObj,
      });
      if (!response.ok) throw new Error('Failed to create image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Immagine aggiunta alla galleria",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiunta dell'immagine",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const formDataObj = new FormData();
      formDataObj.append('title', data.title);
      formDataObj.append('description', data.description);
      formDataObj.append('altText', data.altText);
      formDataObj.append('sortOrder', data.sortOrder.toString());
      formDataObj.append('isActive', data.isActive.toString());
      
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      } else if (data.imageUrl) {
        formDataObj.append('imageUrl', data.imageUrl);
      }

      const response = await fetch(`/api/landing-gallery/${id}`, {
        method: 'PUT',
        body: formDataObj,
      });
      if (!response.ok) throw new Error('Failed to update image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Immagine aggiornata",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento dell'immagine",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/landing-gallery/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-gallery'] });
      toast({
        title: "Successo",
        description: "Immagine eliminata dalla galleria",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'eliminazione dell'immagine",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      altText: '',
      sortOrder: 0,
      isActive: true,
    });
    setSelectedFile(null);
    setEditingImage(null);
  };

  const openEditDialog = (image: LandingGalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
      altText: image.altText || '',
      sortOrder: image.sortOrder,
      isActive: image.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const moveImage = async (imageId: number, direction: 'up' | 'down') => {
    const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedImages.findIndex(img => img.id === imageId);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedImages.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentImage = sortedImages[currentIndex];
    const targetImage = sortedImages[targetIndex];

    // Scambia i sortOrder
    const currentFormData: FormData = {
      title: currentImage.title,
      description: currentImage.description || '',
      imageUrl: currentImage.imageUrl,
      altText: currentImage.altText || '',
      sortOrder: targetImage.sortOrder,
      isActive: currentImage.isActive
    };
    
    const targetFormData: FormData = {
      title: targetImage.title,
      description: targetImage.description || '',
      imageUrl: targetImage.imageUrl,
      altText: targetImage.altText || '',
      sortOrder: currentImage.sortOrder,
      isActive: targetImage.isActive
    };
    
    updateMutation.mutate({
      id: currentImage.id,
      data: currentFormData
    });
    
    updateMutation.mutate({
      id: targetImage.id,
      data: targetFormData
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Galleria Landing</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Immagine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Aggiungi Immagine alla Galleria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Nome del progetto"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrizione del progetto"
                />
              </div>

              <div>
                <Label htmlFor="image">Immagine *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  Oppure inserisci un URL dell'immagine:
                </p>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://esempio.com/immagine.jpg"
                  disabled={!!selectedFile}
                />
              </div>

              <div>
                <Label htmlFor="altText">Testo Alternativo</Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  placeholder="Descrizione per accessibilità"
                />
              </div>

              <div>
                <Label htmlFor="sortOrder">Ordine di Visualizzazione</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Attiva nella galleria</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Aggiungendo...' : 'Aggiungi'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {images.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nessuna immagine nella galleria</p>
              <p className="text-sm text-gray-400 mt-2">
                Aggiungi la prima immagine per iniziare
              </p>
            </CardContent>
          </Card>
        ) : (
          images
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((image, index) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.altText || image.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      {image.description && (
                        <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Ordine: {image.sortOrder}</span>
                        <span className={`px-2 py-1 rounded-full ${image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {image.isActive ? 'Attiva' : 'Inattiva'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(image)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(image.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Immagine Galleria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Titolo *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrizione</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-image">Nuova Immagine (opzionale)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              <p className="text-sm text-gray-500">
                Oppure modifica l'URL dell'immagine:
              </p>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                disabled={!!selectedFile}
              />
            </div>

            <div>
              <Label htmlFor="edit-altText">Testo Alternativo</Label>
              <Input
                id="edit-altText"
                value={formData.altText}
                onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-sortOrder">Ordine di Visualizzazione</Label>
              <Input
                id="edit-sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Attiva nella galleria</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annulla
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Salvando...' : 'Salva Modifiche'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
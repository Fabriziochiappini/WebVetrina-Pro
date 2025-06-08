import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, ExternalLink, Play, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

const PortfolioManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/portfolio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      formRef.current?.reset();
      toast({ title: "Elemento portfolio creato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest("PATCH", `/api/portfolio/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      formRef.current?.reset();
      toast({ title: "Elemento portfolio aggiornato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Elemento portfolio eliminato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    formRef.current?.reset();
  };

  const renderPortfolioCard = (item: PortfolioItem) => {
    return (
      <div key={item.id} className="border rounded-lg p-4 relative">
        <div className="flex items-start gap-4">
          {/* Thumbnail/Preview */}
          <div className="w-24 h-24 flex-shrink-0">
            {item.type === 'video' && (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
            )}
            {item.type === 'image' && item.thumbnailUrl && (
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-full object-cover rounded"
              />
            )}
            {item.type === 'link' && (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            {item.description && (
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            )}
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Featured badge */}
            {item.featured && (
              <Badge className="mt-2" variant="default">
                In Evidenza
              </Badge>
            )}

            {/* Links */}
            <div className="flex gap-2 mt-3">
              {item.url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {item.type === 'video' ? 'Video' : item.type === 'image' ? 'Immagine' : 'Link'}
                  </a>
                </Button>
              )}
              {item.websiteUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Sito Web
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add New Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Elemento Portfolio
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifica Elemento Portfolio' : 'Nuovo Elemento Portfolio'}
            </DialogTitle>
          </DialogHeader>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo</Label>
                <Input 
                  id="title" 
                  name="title" 
                  required 
                  defaultValue={editingItem?.title || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" defaultValue={editingItem?.type || "image"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Immagine</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingItem?.description || ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL Principale</Label>
                <Input 
                  id="url" 
                  name="url" 
                  type="url"
                  required
                  defaultValue={editingItem?.url || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">URL Sito Web (opzionale)</Label>
                <Input 
                  id="websiteUrl" 
                  name="websiteUrl" 
                  type="url"
                  defaultValue={editingItem?.websiteUrl || ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailFile">Immagine Thumbnail (opzionale)</Label>
              <Input 
                id="thumbnailFile" 
                name="thumbnailFile" 
                type="file" 
                accept="image/*"
              />
              {editingItem?.thumbnailUrl && (
                <p className="text-sm text-gray-500">
                  Thumbnail esistente: {editingItem.thumbnailUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tag (separati da virgola)</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="es: Responsive, E-commerce, Vue.js"
                defaultValue={editingItem?.tags?.join(', ') || ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featured">In Evidenza</Label>
                <Select name="featured" defaultValue={editingItem?.featured ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Sì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Ordine di Visualizzazione</Label>
                <Input 
                  id="sortOrder" 
                  name="sortOrder" 
                  type="number"
                  defaultValue={editingItem?.sortOrder || 0}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingItem ? 'Aggiorna' : 'Crea'}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Annulla
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Portfolio Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Elementi Portfolio</CardTitle>
          <CardDescription>
            Gestisci tutti gli elementi del tuo portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="space-y-4">
              {portfolioItems
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(renderPortfolioCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nessun elemento nel portfolio. Aggiungi il primo elemento per iniziare.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioManagement;
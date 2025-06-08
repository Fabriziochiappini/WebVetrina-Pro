import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Play, Plus, Trash2, Edit } from "lucide-react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/portfolio", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Portfolio item creato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/portfolio/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Portfolio item aggiornato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/portfolio/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Portfolio item eliminato" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      url: formData.get('url'),
      thumbnailUrl: formData.get('thumbnailUrl'),
      websiteUrl: formData.get('websiteUrl'),
      tags: formData.get('tags'),
      featured: formData.get('featured') === 'on'
    };
    
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const filteredItems = portfolioItems.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const videoItems = filteredItems.filter(item => item.type === "video");
  const imageItems = filteredItems.filter(item => item.type === "image");
  const linkItems = filteredItems.filter(item => item.type === "link");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Gestione Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="modern-card p-4">
              <div className="aspect-video bg-muted animate-pulse rounded mb-4"></div>
              <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Portfolio</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-modern-primary" onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Modifica" : "Aggiungi"} Portfolio Item
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Titolo</label>
                  <Input 
                    name="title" 
                    defaultValue={editingItem?.title}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select name="type" defaultValue={editingItem?.type || "image"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Screenshot</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Descrizione</label>
                <Textarea 
                  name="description" 
                  defaultValue={editingItem?.description}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL Principale</label>
                <Input 
                  name="url" 
                  defaultValue={editingItem?.url}
                  placeholder="URL del video, immagine o sito web"
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL Thumbnail (opzionale)</label>
                <Input 
                  name="thumbnailUrl" 
                  defaultValue={editingItem?.thumbnailUrl}
                  placeholder="Per video: immagine di anteprima"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL Sito Web (opzionale)</label>
                <Input 
                  name="websiteUrl" 
                  defaultValue={editingItem?.websiteUrl}
                  placeholder="Link al sito web del progetto"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tag (separati da virgola)</label>
                <Input 
                  name="tags" 
                  defaultValue={editingItem?.tags?.join(", ")}
                  placeholder="e-commerce, responsive, business"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="featured" 
                    defaultChecked={editingItem?.featured}
                  />
                  <span className="text-sm">In evidenza (homepage)</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  className="btn-modern-orange"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingItem ? "Aggiorna" : "Crea"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tutti ({portfolioItems.length})</TabsTrigger>
          <TabsTrigger value="video">Video ({videoItems.length})</TabsTrigger>
          <TabsTrigger value="image">Screenshot ({imageItems.length})</TabsTrigger>
          <TabsTrigger value="link">Link ({linkItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {/* Video Section */}
          {videoItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Video Dimostrativi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoItems.map(item => (
                  <PortfolioCard 
                    key={item.id} 
                    item={item} 
                    onEdit={openEditDialog} 
                    onDelete={deleteMutation.mutate} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Section */}
          {imageItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Screenshot Progetti</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageItems.map(item => (
                  <PortfolioCard 
                    key={item.id} 
                    item={item} 
                    onEdit={openEditDialog} 
                    onDelete={deleteMutation.mutate} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Link Section */}
          {linkItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Siti Web Realizzati</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkItems.map(item => (
                  <PortfolioCard 
                    key={item.id} 
                    item={item} 
                    onEdit={openEditDialog} 
                    onDelete={deleteMutation.mutate} 
                  />
                ))}
              </div>
            </div>
          )}

          {portfolioItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun progetto disponibile. Aggiungi il primo elemento!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="video">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoItems.map(item => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                onEdit={openEditDialog} 
                onDelete={deleteMutation.mutate} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="image">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageItems.map(item => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                onEdit={openEditDialog} 
                onDelete={deleteMutation.mutate} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="link">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkItems.map(item => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                onEdit={openEditDialog} 
                onDelete={deleteMutation.mutate} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: number) => void;
}

const PortfolioCard = ({ item, onEdit, onDelete }: PortfolioCardProps) => {
  return (
    <div className="modern-card p-0 overflow-hidden group">
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
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          {item.websiteUrl && (
            <Button 
              size="sm" 
              className="btn-modern-orange"
              onClick={() => window.open(item.websiteUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {item.featured && (
          <Badge className="absolute top-2 left-2 bg-secondary text-xs">
            In Evidenza
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
        {item.description && (
          <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{item.description}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManagement;
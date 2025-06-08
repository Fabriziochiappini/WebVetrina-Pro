import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Play } from "lucide-react";
import Navbar from "@/components/Navbar";

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

const Portfolio = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/portfolio", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Portfolio item creato con successo" });
    },
    onError: (error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest(`/api/portfolio/${id}`, {
        method: "PUT", 
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Portfolio item aggiornato con successo" });
    },
    onError: (error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Portfolio item eliminato" });
    },
    onError: (error) => {
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

  const filteredItems = portfolioItems.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const videoItems = filteredItems.filter(item => item.type === "video");
  const imageItems = filteredItems.filter(item => item.type === "image");
  const linkItems = filteredItems.filter(item => item.type === "link");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="section-modern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                Portfolio <span className="text-gradient-orange">Completo</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tutti i nostri progetti, video dimostrativi e siti web realizzati
              </p>
            </div>

            <div className="mb-8 flex justify-between items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Tutti</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="image">Screenshot</TabsTrigger>
                  <TabsTrigger value="link">Link</TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-modern-primary">
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
              <TabsContent value="all" className="space-y-12">
                {/* Video Section */}
                {videoItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Video Dimostrativi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videoItems.map(item => (
                        <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Section */}
                {imageItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Screenshot Progetti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {imageItems.map(item => (
                        <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Link Section */}
                {linkItems.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-primary">Siti Web Realizzati</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {linkItems.map(item => (
                        <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoItems.map(item => (
                    <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageItems.map(item => (
                    <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="link">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {linkItems.map(item => (
                    <PortfolioCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteMutation.mutate} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
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
    <div className="modern-card-hover p-0 overflow-hidden group">
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
        
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {item.websiteUrl && (
            <Button 
              size="sm" 
              className="btn-modern-orange"
              onClick={() => window.open(item.websiteUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {item.featured && (
          <Badge className="absolute top-4 left-4 bg-secondary">
            In Evidenza
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
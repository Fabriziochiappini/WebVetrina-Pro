import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Loader2, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  websiteUrl: string;
  coverImage: string;
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

  // Mutation per inizializzare portfolio con esempi
  const initExamples = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/portfolio/init-examples");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ 
        title: "Portfolio Inizializzato", 
        description: `Aggiunti ${data.created} progetti di esempio` 
      });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
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
      toast({ title: "Progetto aggiunto con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest("PUT", `/api/portfolio/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      formRef.current?.reset();
      toast({ title: "Progetto aggiornato con successo" });
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
      toast({ title: "Progetto eliminato con successo" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestione Portfolio</h2>
          <p className="text-muted-foreground">
            Aggiungi i tuoi progetti realizzati
          </p>
        </div>
        
        <div className="flex gap-2">
          {portfolioItems.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => initExamples.mutate()}
              disabled={initExamples.isPending}
            >
              {initExamples.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Aggiungi Esempi
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Progetto
              </Button>
            </DialogTrigger>
          
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Modifica Progetto" : "Nuovo Progetto"}
                </DialogTitle>
              </DialogHeader>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Titolo del Progetto *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingItem?.title}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={editingItem?.description}
                  />
                </div>
                
                <div>
                  <Label htmlFor="websiteUrl">URL del Sito *</Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    defaultValue={editingItem?.websiteUrl}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="coverImage">Immagine di Copertina</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    required={!editingItem}
                  />
                  {editingItem && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Lascia vuoto per mantenere l'immagine corrente
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    className="rounded"
                    defaultChecked={editingItem?.featured}
                  />
                  <Label htmlFor="featured">In evidenza nella homepage</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {editingItem ? "Aggiorna" : "Aggiungi"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Annulla
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista progetti */}
      <div className="grid gap-4">
        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Nessun progetto</h3>
                <p className="text-muted-foreground mb-4">
                  Inizia aggiungendo i tuoi primi progetti al portfolio
                </p>
                <Button onClick={() => initExamples.mutate()} disabled={initExamples.isPending}>
                  {initExamples.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Aggiungi Esempi
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          portfolioItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('bg-gradient-to-br', 'from-primary', 'to-secondary');
                        target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-xs">Immagine</div>';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.description && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <a
                            href={item.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visita sito
                          </a>
                          {item.featured && (
                            <Badge variant="secondary" className="text-xs">
                              In evidenza
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioManagement;
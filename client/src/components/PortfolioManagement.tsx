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
                  placeholder="Es: Sito E-commerce per Abbigliamento"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  placeholder="Breve descrizione del progetto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Link al Sito *</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  defaultValue={editingItem?.websiteUrl}
                  placeholder="https://esempio.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="coverImage">Foto di Copertina *</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  required={!editingItem}
                />
                {editingItem && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Lascia vuoto per mantenere l'immagine attuale
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  defaultChecked={editingItem?.featured}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Mostra in homepage</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
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

      {/* Lista progetti */}
      <div className="grid gap-4">
        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Nessun progetto</h3>
                <p className="text-muted-foreground">
                  Aggiungi il tuo primo progetto per iniziare
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          portfolioItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Immagine di copertina */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded border"
                    />
                  </div>

                  {/* Contenuto */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.description && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <a 
                            href={item.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Visualizza sito
                          </a>
                          {item.featured && (
                            <Badge variant="default" className="text-xs">
                              In Homepage
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Azioni */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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
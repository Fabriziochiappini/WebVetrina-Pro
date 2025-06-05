import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Upload, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import BlogEditor from "./BlogEditor";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
  featuredImageType: "upload" | "url";
  featuredImageUrl: string;
}

const BlogManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featuredImageType: "url",
    featuredImageUrl: ""
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/blog/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: "Articolo creato con successo!" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore nella creazione dell'articolo",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest("PUT", `/api/blog/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: "Articolo aggiornato con successo!" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore nell'aggiornamento dell'articolo",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: "Articolo eliminato con successo!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore nell'eliminazione dell'articolo",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const publishPostMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/blog/posts/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: "Articolo pubblicato con successo!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore nella pubblicazione dell'articolo",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      featuredImageType: "url",
      featuredImageUrl: ""
    });
    setFeaturedImageFile(null);
    setEditingPost(null);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      status: post.status,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      featuredImageType: post.featuredImage?.startsWith('/uploads/') ? "upload" : "url",
      featuredImageUrl: post.featuredImage || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Titolo e contenuto sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('status', formData.status);
    submitData.append('metaTitle', formData.metaTitle);
    submitData.append('metaDescription', formData.metaDescription);

    if (formData.featuredImageType === "upload" && featuredImageFile) {
      submitData.append('featuredImage', featuredImageFile);
    } else if (formData.featuredImageType === "url" && formData.featuredImageUrl) {
      submitData.append('featuredImageUrl', formData.featuredImageUrl);
    }

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: submitData });
    } else {
      createPostMutation.mutate(submitData);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Blog</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Articolo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Modifica Articolo" : "Nuovo Articolo"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Inserisci il titolo dell'articolo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Stato</Label>
                  <Select value={formData.status} onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bozza</SelectItem>
                      <SelectItem value="published">Pubblicato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Estratto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve descrizione dell'articolo"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Immagine di Copertina</Label>
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={formData.featuredImageType === "upload" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, featuredImageType: "upload" })}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Carica File
                  </Button>
                  <Button
                    type="button"
                    variant={formData.featuredImageType === "url" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, featuredImageType: "url" })}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Link URL
                  </Button>
                </div>

                {formData.featuredImageType === "upload" ? (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFeaturedImageFile(e.target.files?.[0] || null)}
                  />
                ) : (
                  <Input
                    value={formData.featuredImageUrl}
                    onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                    placeholder="https://esempio.com/immagine.jpg"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenuto *</Label>
                <BlogEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  height={400}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Titolo SEO</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Titolo per i motori di ricerca"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Descrizione SEO</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Descrizione per i motori di ricerca"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                >
                  {editingPost ? "Aggiorna" : "Crea"} Articolo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {!posts || posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">Nessun articolo presente</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crea il primo articolo
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Pubblicato" : "Bozza"}
                      </Badge>
                      <span>
                        Creato: {format(new Date(post.createdAt), 'dd MMM yyyy', { locale: it })}
                      </span>
                      {post.publishedAt && (
                        <span>
                          Pubblicato: {format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: it })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {post.status === "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {post.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => publishPostMutation.mutate(post.id)}
                        disabled={publishPostMutation.isPending}
                      >
                        Pubblica
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Sei sicuro di voler eliminare questo articolo?")) {
                          deletePostMutation.mutate(post.id);
                        }
                      }}
                      disabled={deletePostMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                )}
                {post.featuredImage && (
                  <div className="mt-2">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
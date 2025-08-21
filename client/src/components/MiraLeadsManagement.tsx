import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Phone, Mail, User, Building, MessageCircle, Calendar, Eye, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MiraLead {
  id: number;
  nome: string | null;
  telefono: string | null;
  email: string | null;
  attivita: string | null;
  messaggio: string | null;
  conversationData: any;
  fonte: string;
  stato: string;
  createdAt: string;
  updatedAt: string;
}

export default function MiraLeadsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState<MiraLead | null>(null);

  // Fetch dei lead raccolti da Mira
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['/api/mira-leads'],
    queryFn: () => apiRequest('GET', '/api/mira-leads'),
  });

  // Mutation per aggiornare lo stato del lead
  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PUT', `/api/mira-leads/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Stato aggiornato",
        description: "Lo stato del lead è stato aggiornato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mira-leads'] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dello stato del lead",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'nuovo': return 'default';
      case 'contattato': return 'secondary';
      case 'chiuso': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nuovo': return <User className="h-4 w-4" />;
      case 'contattato': return <Check className="h-4 w-4" />;
      case 'chiuso': return <X className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Errore nel caricamento dei lead Mira
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 Lead Raccolti da Mira
            <Badge variant="outline">{leads?.length || 0} totali</Badge>
          </CardTitle>
          <CardDescription>
            Lead qualificati raccolti automaticamente dall'assistente AI Mira durante le conversazioni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!leads || leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nessun lead raccolto finora.</p>
              <p className="text-sm">I lead vengono salvati automaticamente quando Mira raccoglie dati di contatto.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contatti</TableHead>
                    <TableHead>Attività</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead: MiraLead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">
                          {lead.nome || 'Nome non fornito'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {lead.telefono && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {lead.telefono}
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.attivita && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {lead.attivita}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(lead.stato)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(lead.stato)}
                          {lead.stato.charAt(0).toUpperCase() + lead.stato.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Dettagli Lead - {lead.nome || 'Cliente'}</DialogTitle>
                                <DialogDescription>
                                  Lead raccolto da Mira il {formatDate(lead.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Dati di contatto</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Nome:</strong> {lead.nome || 'Non fornito'}</p>
                                      <p><strong>Telefono:</strong> {lead.telefono || 'Non fornito'}</p>
                                      <p><strong>Email:</strong> {lead.email || 'Non fornito'}</p>
                                      <p><strong>Attività:</strong> {lead.attivita || 'Non specificata'}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Stato del lead</h4>
                                    <Select
                                      value={lead.stato}
                                      onValueChange={(value) => 
                                        updateLeadStatus.mutate({ id: lead.id, status: value })
                                      }
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="nuovo">Nuovo</SelectItem>
                                        <SelectItem value="contattato">Contattato</SelectItem>
                                        <SelectItem value="chiuso">Chiuso</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                {lead.conversationData && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Conversazione con Mira</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                      {lead.conversationData.map((msg: any, index: number) => (
                                        <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                                          <strong>{msg.role === 'user' ? 'Cliente' : 'Mira'}:</strong> {msg.content}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Select
                            value={lead.stato}
                            onValueChange={(value) => 
                              updateLeadStatus.mutate({ id: lead.id, status: value })
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nuovo">Nuovo</SelectItem>
                              <SelectItem value="contattato">Contattato</SelectItem>
                              <SelectItem value="chiuso">Chiuso</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
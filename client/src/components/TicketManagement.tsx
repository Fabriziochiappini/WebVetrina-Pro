import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportTicket, TicketMessage } from "@shared/schema";

// Definizione tipi per compatibilità
type TicketWithMessages = SupportTicket & {
  messages?: TicketMessage[];
  messageCount?: number;
};

const TicketManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<TicketWithMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [ticketFilter, setTicketFilter] = useState<string>("all"); // all, open, closed
  const [dialogOpen, setDialogOpen] = useState(false);

  // Query per ottenere tutti i ticket
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/admin/support-tickets"],
    staleTime: 30000, // Cache per 30 secondi
  });

  // Query per ottenere i messaggi del ticket selezionato
  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ["/api/tickets", selectedTicket?.id, "messages"],
    enabled: !!selectedTicket?.id,
    staleTime: 10000, // Cache più breve per i messaggi
  });

  // Mutation per inviare un nuovo messaggio
  const sendMessage = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      return apiRequest("POST", `/api/tickets/${ticketId}/messages`, { message });
    },
    onSuccess: () => {
      toast({
        title: "Messaggio inviato",
        description: "Il tuo messaggio è stato inviato correttamente.",
      });
      setNewMessage("");
      refetchMessages();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'invio del messaggio",
        variant: "destructive",
      });
    },
  });

  // Mutation per cambiare lo stato del ticket
  const updateTicketStatus = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/support-tickets/${ticketId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Stato aggiornato",
        description: "Lo stato del ticket è stato aggiornato.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento dello stato",
        variant: "destructive",
      });
    },
  });

  // Filtra i ticket in base allo stato selezionato
  const filteredTickets = tickets?.filter((ticket: SupportTicket) => {
    if (ticketFilter === "all") return true;
    if (ticketFilter === "open") return ticket.status === "aperto";
    if (ticketFilter === "closed") return ticket.status === "chiuso";
    return true;
  }) || [];

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;
    
    sendMessage.mutate({
      ticketId: selectedTicket.id,
      message: newMessage.trim(),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewTicket = (ticket: TicketWithMessages) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aperto":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aperto</span>;
      case "chiuso":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Chiuso</span>;
      case "in-lavorazione":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Lavorazione</span>;
      case "risolto":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Risolto</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Alta</span>;
      case "urgente":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">Urgente</span>;
      case "media":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Media</span>;
      case "bassa":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Bassa</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Gestione Ticket di Supporto
          </CardTitle>
          <CardDescription>
            Visualizza e gestisci tutti i ticket di supporto inviati dai clienti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtri */}
          <div className="flex gap-4 mb-6">
            <Select value={ticketFilter} onValueChange={setTicketFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i Ticket</SelectItem>
                <SelectItem value="open">Solo Aperti</SelectItem>
                <SelectItem value="closed">Solo Chiusi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabella Ticket */}
          {ticketsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Oggetto</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Priorità</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket: SupportTicket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">#{ticket.id}</TableCell>
                      <TableCell className="font-medium">{ticket.clientName}</TableCell>
                      <TableCell>{ticket.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={ticket.status}
                            onValueChange={(newStatus) =>
                              updateTicketStatus.mutate({
                                ticketId: ticket.id,
                                status: newStatus,
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aperto">Aperto</SelectItem>
                              <SelectItem value="in-lavorazione">In Lavorazione</SelectItem>
                              <SelectItem value="risolto">Risolto</SelectItem>
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              {ticketFilter === "all" 
                ? "Nessun ticket trovato"
                : `Nessun ticket ${ticketFilter === "open" ? "aperto" : "chiuso"} trovato`
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog per visualizzare e gestire il ticket */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Ticket #{selectedTicket?.id} - {selectedTicket?.subject}
            </DialogTitle>
            <DialogDescription>
              Cliente: {selectedTicket?.clientName} ({selectedTicket?.email})
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              {/* Info Ticket */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Stato:</span>
                    <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Priorità:</span>
                    <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Telefono:</span>
                    <div className="mt-1">{selectedTicket.phone}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Creato:</span>
                    <div className="mt-1">{formatDate(selectedTicket.createdAt)}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">Messaggio iniziale:</span>
                  <p className="mt-1 text-gray-700">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Messaggi del Ticket */}
              <div className="space-y-3">
                <h4 className="font-semibold">Conversazione</h4>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                  {messagesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((message: TicketMessage) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.senderType === "admin"
                            ? "bg-orange-50 border-l-4 border-orange-500 ml-8"
                            : "bg-blue-50 border-l-4 border-blue-500 mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm">
                            {message.senderType === "admin" ? "🛠️ Staff" : "👤 Cliente"} - {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nessun messaggio nella conversazione
                    </div>
                  )}
                </div>

                {/* Form per nuovo messaggio */}
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Scrivi la tua risposta al cliente..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessage.isPending}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendMessage.isPending ? "Invio..." : "Invia Risposta"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketManagement;
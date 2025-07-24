import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, User, Bot, MessageSquare, Globe, AlertCircle, Clock, CheckCircle2, Terminal, ArrowLeft } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCta from '../components/FloatingCta';
import { useLocation, useRoute } from 'wouter';
import { type SupportTicket, type TicketMessage } from "@shared/schema";

// Schema per nuovo messaggio
const messageSchema = z.object({
  message: z.string().min(1, "Il messaggio è richiesto")
});

type MessageFormData = z.infer<typeof messageSchema>;

// Schema per nuovo ticket
const ticketSchema = z.object({
  clientName: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono non valido"),
  websiteUrl: z.string().url("URL del sito non valido").optional().or(z.literal("")),
  requestType: z.enum(["modifica", "aggiornamento", "problema", "acquisto", "altro"], {
    required_error: "Seleziona il tipo di richiesta"
  }),
  priority: z.enum(["bassa", "media", "alta", "urgente"], {
    required_error: "Seleziona la priorità"
  }),
  subject: z.string().min(5, "L'oggetto deve avere almeno 5 caratteri"),
  description: z.string().min(20, "La descrizione deve avere almeno 20 caratteri")
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function TicketChat() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/ticket/:id");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const ticketId = params?.id ? parseInt(params.id) : null;
  const isNewTicket = !ticketId;
  
  // Form per nuovo messaggio
  const messageForm = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" }
  });

  // Form per nuovo ticket
  const ticketForm = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      websiteUrl: "",
      requestType: undefined,
      priority: undefined,
      subject: "",
      description: ""
    }
  });

  // Query per ticket singolo
  const { data: ticket } = useQuery<SupportTicket>({
    queryKey: ["/api/tickets", ticketId],
    enabled: !!ticketId
  });

  // Query per messaggi del ticket
  const { data: messages = [], refetch: refetchMessages } = useQuery<TicketMessage[]>({
    queryKey: ["/api/tickets", ticketId, "messages"],
    enabled: !!ticketId
  });

  // Mutation per nuovo messaggio
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      return await apiRequest("POST", `/api/tickets/${ticketId}/messages`, data);
    },
    onSuccess: () => {
      messageForm.reset();
      refetchMessages();
      toast({
        title: "Messaggio inviato",
        description: "Il tuo messaggio è stato inviato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio",
        variant: "destructive",
      });
    }
  });

  // Mutation per nuovo ticket
  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      return await apiRequest("POST", "/api/tickets", data);
    },
    onSuccess: (response) => {
      const newTicket = response;
      toast({
        title: "Ticket creato con successo!",
        description: "Il tuo ticket è stato creato. Ti contatteremo presto.",
      });
      setLocation(`/ticket/${newTicket.id}`);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del ticket",
        variant: "destructive",
      });
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSendMessage = (data: MessageFormData) => {
    if (!ticketId) return;
    sendMessageMutation.mutate(data);
  };

  const onCreateTicket = (data: TicketFormData) => {
    createTicketMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente": return "bg-red-100 text-red-800 border-red-200";
      case "alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "bassa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "risolto": return "bg-green-100 text-green-800 border-green-200";
      case "in_corso": return "bg-blue-100 text-blue-800 border-blue-200";
      case "aperto": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isNewTicket ? (
            // Form per nuovo ticket
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl mb-4">
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                  Sistema Ticket
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Crea un nuovo ticket di supporto per ricevere assistenza tecnica professionale
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
                <Form {...ticketForm}>
                  <form onSubmit={ticketForm.handleSubmit(onCreateTicket)} className="space-y-6">
                    
                    {/* Info Cliente */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                        Informazioni Cliente
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={ticketForm.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Nome Completo</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Mario Rossi" className="border-slate-300" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="mario@esempio.it" className="border-slate-300" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={ticketForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Telefono</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+39 123 456 7890" className="border-slate-300" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">URL Sito Web (opzionale)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://tuosito.it" className="border-slate-300" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Info Ticket */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                        Dettagli Richiesta
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={ticketForm.control}
                          name="requestType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Tipo Richiesta</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Seleziona tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="modifica">Modifica Sito</SelectItem>
                                  <SelectItem value="aggiornamento">Aggiornamento</SelectItem>
                                  <SelectItem value="problema">Problema Tecnico</SelectItem>
                                  <SelectItem value="acquisto">Nuovo Acquisto</SelectItem>
                                  <SelectItem value="altro">Altro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={ticketForm.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Priorità</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Seleziona priorità" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bassa">Bassa</SelectItem>
                                  <SelectItem value="media">Media</SelectItem>
                                  <SelectItem value="alta">Alta</SelectItem>
                                  <SelectItem value="urgente">Urgente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={ticketForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">Oggetto</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Breve descrizione del problema" className="border-slate-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ticketForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">Descrizione Dettagliata</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Descrivi in dettaglio il problema o la richiesta..."
                                className="min-h-[120px] border-slate-300" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createTicketMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                    >
                      {createTicketMutation.isPending ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Creazione ticket...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Crea Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            // Chat interface per ticket esistente
            <div className="space-y-6">
              
              {/* Header ticket */}
              {ticket && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation("/ticket")}
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Indietro
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-800">
                      Ticket #{ticket.id} - {ticket.subject}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {ticket.clientName}
                      </span>
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {ticket.email}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {ticket.requestType}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-3 p-4 bg-slate-50 rounded-lg">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-4">
                  <h2 className="text-white font-semibold flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Chat Supporto Tecnico
                  </h2>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'support' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.senderType === 'support'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-gradient-to-r from-orange-500 to-purple-600 text-white'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.senderType === 'support' ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-50">
                            {new Date(message.createdAt).toLocaleString('it-IT')}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input messaggio */}
                <div className="border-t border-slate-200 p-4">
                  <Form {...messageForm}>
                    <form onSubmit={messageForm.handleSubmit(onSendMessage)} className="flex space-x-2">
                      <FormField
                        control={messageForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Scrivi il tuo messaggio..."
                                className="border-slate-300"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    messageForm.handleSubmit(onSendMessage)();
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                      >
                        {sendMessageMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <FloatingCta />
    </div>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, User, Bot, MessageSquare, Globe, AlertCircle, Clock, CheckCircle2, Terminal } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCta from '../components/FloatingCta';

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

export default function Assistenza() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<TicketFormData>({
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

  const mutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      return await apiRequest("POST", "/api/tickets", data);
    },
    onSuccess: (response) => {
      const newTicket = response.ticket;
      setIsSubmitted(true);
      toast({
        title: "Ticket creato con successo! 🎫",
        description: "Reindirizzamento alla chat di supporto...",
      });
      // Reindirizza alla chat del ticket dopo 2 secondi
      setTimeout(() => {
        window.location.href = `/ticket/${newTicket.id}`;
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Errore nell'invio",
        description: "Riprova tra qualche minuto o contattaci via WhatsApp.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: TicketFormData) => {
    mutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Ticket Creato! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Il tuo ticket è stato creato con successo. Stai per essere reindirizzato alla chat di supporto.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
                  <p className="text-orange-800 font-semibold">
                    💬 Apertura chat di supporto in corso...
                  </p>
                  <p className="text-orange-600 text-sm mt-1">
                    Potrai chattare direttamente con il nostro team di supporto
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Torna alla Home
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Centro Ticket
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                Sistema di supporto tecnico per clienti Web Pro Italia
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Risposta entro 24h
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <User className="w-4 h-4 inline mr-2" />
                  Supporto dedicato
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Chat system
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Interface */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Sidebar - Status & Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-orange-600" />
                    Sistema Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Supporto Online</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Server Operativi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Avg. Response: 12h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Info Utili</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• Per problemi urgenti, usa priorità "Urgente"</p>
                    <p>• Includi sempre l'URL del tuo sito</p>
                    <p>• Descrivi il problema nel dettaglio</p>
                    <p>• Allega screenshot se necessario</p>
                  </div>
                </div>
              </div>

              {/* Main Ticket Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-6 border-b bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                      Nuovo Ticket di Supporto
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Compila i campi sottostanti per aprire un ticket di supporto
                    </p>
                  </div>

                  <div className="p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Client Info Row */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Cliente</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome Cognome" 
                                    {...field} 
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="email@esempio.com" 
                                    {...field} 
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Contact & Website Row */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Telefono</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="+39 123 456 7890" 
                                    {...field} 
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="websiteUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  URL Sito Web
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="url" 
                                    placeholder="https://tuosito.com" 
                                    {...field} 
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Request Type & Priority Row */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="requestType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Categoria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Seleziona categoria" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="modifica">🔧 Modifica al sito</SelectItem>
                                    <SelectItem value="aggiornamento">📝 Aggiornamento contenuti</SelectItem>
                                    <SelectItem value="problema">🚨 Problema tecnico</SelectItem>
                                    <SelectItem value="acquisto">🛒 Servizio aggiuntivo</SelectItem>
                                    <SelectItem value="altro">❓ Altro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Priorità</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Seleziona priorità" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="bassa">🟢 Bassa</SelectItem>
                                    <SelectItem value="media">🟡 Media</SelectItem>
                                    <SelectItem value="alta">🟠 Alta</SelectItem>
                                    <SelectItem value="urgente">🔴 Urgente</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Subject */}
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Oggetto</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Es: Problema con form di contatto, aggiornamento testi homepage..." 
                                  {...field} 
                                  className="h-11"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Descrizione Tecnica</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descrivi dettagliatamente il problema o la richiesta. Includi:&#10;- Cosa stava succedendo quando si è verificato l'errore&#10;- Passi per riprodurre il problema&#10;- Browser e dispositivo utilizzato&#10;- Screenshot se utili"
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold py-3 h-12 text-base"
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Invio in corso...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Invia Ticket di Supporto
                              </div>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingCta />
    </>
  );
}
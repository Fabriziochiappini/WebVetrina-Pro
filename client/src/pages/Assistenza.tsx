import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Headphones, Mail, Clock, Shield, Star, Heart } from "lucide-react";

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
      return await apiRequest("POST", "/api/support-ticket", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Ticket inviato con successo! 🎫",
        description: "Ti contatteremo entro 24 ore per fornirti assistenza.",
      });
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Ticket Inviato! 🎉
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Grazie per averci contattato. Il tuo ticket è stato registrato con successo.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-800 font-semibold">
                  ⏰ Ti risponderemo entro 24 ore
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Per urgenze immediate, contattaci su WhatsApp: +39 123 456 7890
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Headphones className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Centro Assistenza
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sei già nostro cliente? Ottieni supporto rapido e professionale per il tuo sito web.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Risposta Rapida</h3>
            <p className="text-gray-600">Ti rispondiamo entro 24 ore lavorative</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Supporto Dedicato</h3>
            <p className="text-gray-600">Team esperto dedicato ai nostri clienti</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Assistenza Premium</h3>
            <p className="text-gray-600">Priorità massima per i nostri clienti</p>
          </div>
        </div>

        {/* Support Form - Integrated Design */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Mail className="w-8 h-8 text-orange-600" />
              Apri un Ticket di Assistenza
            </h2>
            <p className="text-gray-600 text-lg">
              Compila il modulo per ricevere assistenza personalizzata
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome e Cognome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Es. Mario Rossi" {...field} />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="mario@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono *</FormLabel>
                          <FormControl>
                            <Input placeholder="Es. +39 123 456 7890" {...field} />
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
                          <FormLabel>URL del tuo sito</FormLabel>
                          <FormControl>
                            <Input placeholder="https://tuosito.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="requestType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo di Richiesta *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="modifica">🔧 Modifica al sito</SelectItem>
                              <SelectItem value="aggiornamento">⬆️ Aggiornamento contenuti</SelectItem>
                              <SelectItem value="problema">🚨 Problema tecnico</SelectItem>
                              <SelectItem value="acquisto">🛒 Acquisto servizio</SelectItem>
                              <SelectItem value="altro">💬 Altro</SelectItem>
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
                          <FormLabel>Priorità *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oggetto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. Richiesta modifica sezione contatti" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrizione dettagliata *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrivi nel dettaglio la tua richiesta..."
                            rows={6}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>💡 Suggerimento:</strong> Più dettagli fornisci, più veloce sarà la nostra risposta.
                      Includi screenshot se necessario.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Invio in corso..." : "🚀 Invia Ticket di Assistenza"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Contact Alternatives */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Hai bisogno di supporto immediato?
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://wa.me/39123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                📱 WhatsApp (Urgenze)
              </a>
              <a 
                href="mailto:supporto@webproitalia.com"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                ✉️ Email Diretta
              </a>
            </div>
          </div>
      </div>
    </div>
  );
}
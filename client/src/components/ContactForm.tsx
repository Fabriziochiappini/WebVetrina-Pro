import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';


const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().min(2, { message: 'Il cognome è obbligatorio' }),
  email: z.string().email({ message: 'Email non valida' }),
  phone: z.string().min(5, { message: 'Numero di telefono non valido' }),
  company: z.string().optional(),
  businessType: z.string().min(1, { message: 'Il tipo di attività è obbligatorio' }),
  message: z.string().optional(),
  privacy: z.boolean().refine(val => val === true, {
    message: 'Devi accettare la privacy policy',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      businessType: '',
      message: '',
      privacy: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Richiesta inviata con successo!",
        description: "Ti contatteremo al più presto.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Errore nell'invio del modulo",
        description: error.message || "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <section id="contatti" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
              Contattaci Ora
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compila il modulo sottostante per richiedere il tuo sito web professionale a soli €299.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/5">
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold mb-4 text-primary font-heading">
                  Informazioni di Contatto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1"><i className="fas fa-map-marker-alt"></i></div>
                    <div>
                      <h4 className="font-bold">Indirizzo</h4>
                      <p className="text-gray-600">Via Roma 123, Milano, Italia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1"><i className="fas fa-envelope"></i></div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="text-gray-600">info@webproitalia.it</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1"><i className="fas fa-phone"></i></div>
                    <div>
                      <h4 className="font-bold">Telefono</h4>
                      <a href="tel:+393479942321" className="text-gray-600 hover:text-primary transition-colors">
                        +39 347 9942321
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="text-green-500 mt-1"><i className="fab fa-whatsapp"></i></div>
                    <div>
                      <h4 className="font-bold">WhatsApp</h4>
                      <a 
                        href="https://wa.me/393479942321?text=Salve,%20vorrei%20realizzare%20un%20sito%20per%20la%20mia%20attività" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-green-500 transition-colors"
                      >
                        Chatta con noi
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-primary font-heading">
                  Orari di Servizio
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Lunedì - Venerdì:</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sabato:</span>
                    <span className="font-medium">10:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Domenica:</span>
                    <span className="font-medium">Chiuso</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-3/5">
              {submitted ? (
                <div className="bg-gray-50 p-8 rounded-xl shadow-sm text-center">
                  <div className="text-accent text-5xl mb-4">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-heading">Grazie per averci contattato!</h3>
                  <p className="text-gray-600 mb-4">
                    La tua richiesta è stata inoltrata con successo. Un nostro consulente ti contatterà entro 24 ore.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Invia un'altra richiesta
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="bg-gray-50 p-6 rounded-xl shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome*</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cognome*</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefono*</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Nome Azienda</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Tipo di Attività*</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Es. Ristorante, Negozio, Studio Professionale..." 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Requisiti Specifici</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4} 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="mt-1" 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              Acconsento al trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679.*
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={isPending} 
                      className="w-full py-3 px-6 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-secondary/90 transition-all"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Invio in corso...
                        </>
                      ) : (
                        "Richiedi Subito la Tua Offerta"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

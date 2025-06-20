import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { trackBusinessEvent } from '../lib/analytics';

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

const LandingContactForm = () => {
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
    trackBusinessEvent.contactFormSubmit(data.businessType);
    mutate(data);
  };

  if (submitted) {
    return (
      <div className="bg-white/90 p-6 rounded-xl text-center">
        <div className="text-green-600 text-4xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">Grazie per averci contattato!</h3>
        <p className="text-gray-700 mb-4">
          La tua richiesta è stata inoltrata con successo. Ti contatteremo entro 2 ore.
        </p>
        <Button 
          onClick={() => setSubmitted(false)} 
          variant="outline" 
          className="mt-2"
        >
          Invia un'altra richiesta
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="bg-white/90 p-6 rounded-xl space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">Nome*</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary" />
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
                <FormLabel className="text-gray-800 font-semibold">Cognome*</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">Email*</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-900 bg-white" />
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
                <FormLabel className="text-gray-800 font-semibold">Telefono*</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-900 bg-white" />
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
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Nome Azienda</FormLabel>
              <FormControl>
                <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Tipo di Attività*</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Es. Ristorante, Negozio, Studio Professionale..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-900 bg-white" 
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
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">Requisiti Specifici</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={3} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-900 bg-white" 
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                  className="mt-1" 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-gray-700">
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
            "PRENOTA IL TUO SITO WEB"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LandingContactForm;
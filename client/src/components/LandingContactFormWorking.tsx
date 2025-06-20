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

const formSchema = z.object({
  firstName: z.string().min(2, "Nome richiesto"),
  lastName: z.string().min(2, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(5, "Telefono richiesto"),
  company: z.string().optional(),
  businessType: z.string().min(2, "Tipo di attività richiesto"),
  requirements: z.string().optional(),
  privacy: z.boolean().refine(val => val === true, "Devi accettare la privacy policy"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LandingContactFormWorking() {
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
      requirements: '',
      privacy: false,
    },
  });

  const submitForm = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Errore nell'invio del modulo");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo entro 24 ore per discutere il tuo progetto.",
        variant: "default",
      });
      form.reset();
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_submit', {
        event_category: 'conversion',
        event_label: 'form_completion',
        business_type: data.businessType
      });
    }
    
    submitForm.mutate(data);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 text-xl font-semibold mb-2">
          ✅ Richiesta Inviata!
        </div>
        <p className="text-green-700">
          Ti contatteremo entro 24 ore per discutere il tuo progetto.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Richiedi il Tuo Sito Web a €197
        </h3>
        <p className="text-gray-600">
          Compila il form per ricevere un preventivo personalizzato
        </p>
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">Nome*</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" />
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
                    <Input {...field} className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" />
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
                    <Input {...field} type="email" className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" />
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
                    <Input {...field} type="tel" className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" />
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
                  <Input {...field} className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" />
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
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">Requisiti Specifici</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={3} 
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-white bg-gray-800 placeholder-gray-300" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start space-x-3">
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-700">
                      Accetto la <a href="/privacy" className="text-secondary underline">Privacy Policy</a> e autorizzo il trattamento dei miei dati*
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitForm.isPending}
            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitForm.isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Invio in corso...
              </div>
            ) : (
              'RICHIEDI PREVENTIVO GRATUITO'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
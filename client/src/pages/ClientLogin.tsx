import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, User, Mail, ArrowLeft } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCta from '../components/FloatingCta';
import { useLocation } from 'wouter';

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  ticketId: z.string().min(1, "ID ticket richiesto")
});

const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  clientName: z.string().min(2, "Nome deve avere almeno 2 caratteri"),
  phone: z.string().min(10, "Numero di telefono non valido")
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function ClientLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      ticketId: ""
    }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      clientName: "",
      phone: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await apiRequest("POST", "/api/client/login", data);
    },
    onSuccess: (response) => {
      localStorage.setItem('clientToken', response.token);
      toast({
        title: "Accesso effettuato!",
        description: "Benvenuto nella tua area clienti",
      });
      setLocation('/client/dashboard');
    },
    onError: () => {
      toast({
        title: "Errore di accesso",
        description: "Email o ID ticket non validi",
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return await apiRequest("POST", "/api/client/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Registrazione completata!",
        description: "Ora puoi accedere con i tuoi dati",
      });
      setIsRegistering(false);
    },
    onError: () => {
      toast({
        title: "Errore nella registrazione",
        description: "Riprova o contattaci per assistenza",
        variant: "destructive",
      });
    }
  });

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-4">
          
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/ticket')}
              className="mb-4 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Ticket
            </Button>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Area Clienti
            </h1>
            <p className="text-slate-600 mt-2">
              Accedi per gestire i tuoi ticket di supporto
            </p>
          </div>

          {!isRegistering ? (
            // Form di Login
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Lock className="w-5 h-5 mr-2" />
                  Accedi
                </CardTitle>
                <CardDescription>
                  Inserisci la tua email e l'ID del ticket per accedere
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="la-tua-email@esempio.it"
                              className="border-slate-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="ticketId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">ID Ticket</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="123"
                              className="border-slate-300"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-slate-500">
                            Trovi l'ID ticket nell'email di conferma che hai ricevuto
                          </p>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={loginMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Accesso in corso...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Accedi
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-2">
                <p className="text-sm text-slate-600 text-center">
                  Non hai ancora un account?
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRegistering(true)}
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Registrati come cliente
                </Button>
              </CardFooter>
            </Card>
          ) : (
            // Form di Registrazione
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Mail className="w-5 h-5 mr-2" />
                  Registrazione Cliente
                </CardTitle>
                <CardDescription>
                  Crea il tuo account per gestire i ticket di supporto
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Nome Completo</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Mario Rossi"
                              className="border-slate-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="mario@esempio.it"
                              className="border-slate-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Telefono</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="+39 123 456 7890"
                              className="border-slate-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={registerMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Registrazione...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Registrati
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-slate-600"
                >
                  Hai già un account? Accedi
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
      <FloatingCta />
    </div>
  );
}
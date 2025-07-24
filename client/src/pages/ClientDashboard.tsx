import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, User, Clock, CheckCircle2, AlertCircle, LogOut, Ticket } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCta from '../components/FloatingCta';
import { useLocation } from 'wouter';
import { type SupportTicket } from "@shared/schema";

export default function ClientDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      setLocation('/client/login');
      return;
    }
    setClientToken(token);
  }, [setLocation]);

  // Query per ottenere i ticket del cliente
  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/client/tickets"],
    enabled: !!clientToken,
    queryFn: async () => {
      return await apiRequest("GET", "/api/client/tickets", null, {
        'Authorization': `Bearer ${clientToken}`
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    toast({
      title: "Disconnesso",
      description: "Hai effettuato il logout con successo",
    });
    setLocation('/client/login');
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
      case "in-lavorazione": return "bg-blue-100 text-blue-800 border-blue-200";
      case "aperto": return "bg-orange-100 text-orange-800 border-orange-200";
      case "chiuso": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "risolto": return <CheckCircle2 className="w-4 h-4" />;
      case "in-lavorazione": return <Clock className="w-4 h-4" />;
      case "aperto": return <AlertCircle className="w-4 h-4" />;
      case "chiuso": return <CheckCircle2 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!clientToken) {
    return null; // Verrà reindirizzato al login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-600 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                    I Miei Ticket
                  </h1>
                  <p className="text-slate-600">
                    Gestisci i tuoi ticket di supporto e comunica con il nostro team
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Statistiche Rapide */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{tickets.length}</p>
                    <p className="text-sm text-slate-600">Ticket Totali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {tickets.filter(t => t.status === 'aperto' || t.status === 'in-lavorazione').length}
                    </p>
                    <p className="text-sm text-slate-600">In Corso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {tickets.filter(t => t.status === 'risolto' || t.status === 'chiuso').length}
                    </p>
                    <p className="text-sm text-slate-600">Risolti</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nuovo Ticket Button */}
          <div className="mb-6">
            <Button 
              onClick={() => setLocation('/ticket')}
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Crea Nuovo Ticket
            </Button>
          </div>

          {/* Lista Ticket */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">I Tuoi Ticket</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-300">
                <CardContent className="p-8 text-center">
                  <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Nessun ticket ancora
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Non hai ancora creato nessun ticket di supporto
                  </p>
                  <Button 
                    onClick={() => setLocation('/ticket')}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                  >
                    Crea il Primo Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-slate-800">
                          Ticket #{ticket.id} - {ticket.subject}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {ticket.requestType} • Creato il {new Date(ticket.createdAt).toLocaleDateString('it-IT')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(ticket.priority)} border`}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(ticket.status)} border`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <span>{ticket.status}</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-700 mb-4 line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        {ticket.websiteUrl && (
                          <span>Sito: {ticket.websiteUrl}</span>
                        )}
                      </div>
                      <Button 
                        onClick={() => setLocation(`/ticket/${ticket.id}`)}
                        variant="outline"
                        size="sm"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Apri Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      <FloatingCta />
    </div>
  );
}
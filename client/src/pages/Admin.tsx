import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, FileText, Trash2, Upload, Users, Briefcase, Settings, PlusCircle, Edit2, Eye, CheckCircle, XCircle, Search, Image, Loader2, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Contact, Logo, PortfolioItem, SiteSettings } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PortfolioManagement from "@/components/PortfolioManagement";
import BlogManagement from "@/components/BlogManagement";
import LandingGalleryManagementNew from "@/components/LandingGalleryManagementNew";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  onFilter: () => void;
  onExport: () => void;
}

const DateFilter = ({ 
  startDate, endDate, setStartDate, setEndDate, onFilter, onExport 
}: DateFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end">
      <div>
        <Label htmlFor="startDate">Data Inizio</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="endDate">Data Fine</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Button onClick={onFilter} variant="outline">
        <Calendar className="mr-2 h-4 w-4" />
        Filtra
      </Button>
      <Button onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Esporta CSV
      </Button>
    </div>
  );
};

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("lead");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Riferimenti ai form di upload
  const logoFormRef = useRef<HTMLFormElement>(null);
  
  // Stato per i pixel
  const [metaPixelId, setMetaPixelId] = useState('');
  const [otherTracking, setOtherTracking] = useState('');
  const [paypalPaymentUrl, setPaypalPaymentUrl] = useState('');
  
  // Stati per il form di caricamento loghi
  const [logoName, setLogoName] = useState('');
  const [logoDescription, setLogoDescription] = useState('');

  // Query per i dati
  const { data: contacts, isLoading: isLoadingContacts } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    enabled: isAuthenticated && activeTab === "lead",
  });
  
  const { data: filteredContacts, isLoading: isLoadingFiltered, refetch: refetchFiltered } = useQuery<Contact[]>({
    queryKey: ['/api/contacts/filter', startDate, endDate],
    enabled: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const response = await fetch(`/api/contacts/filter?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch filtered contacts');
      return response.json();
    }
  });
  
  const { data: logos, isLoading: isLoadingLogos } = useQuery<Logo[]>({
    queryKey: ['/api/logos'],
    enabled: isAuthenticated && activeTab === "loghi",
  });
  
  const { data: portfolio, isLoading: isLoadingPortfolio } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio'],
    enabled: isAuthenticated && activeTab === "portfolio",
  });
  
  const { data: siteSettings, isLoading: isLoadingSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
    enabled: isAuthenticated && activeTab === "impostazioni",
  });

  // Effect per aggiornare i campi quando arrivano i dati
  useEffect(() => {
    if (siteSettings) {
      setMetaPixelId(siteSettings.metaPixelId || '');
      setOtherTracking(siteSettings.otherTracking || '');
      setPaypalPaymentUrl(siteSettings.paypalPaymentUrl || '');
    }
  }, [siteSettings]);

  const displayedContacts = filteredContacts && filteredContacts.length > 0 ? filteredContacts : contacts || [];
  
  // Mutation per l'eliminazione dei loghi
  const deleteLogo = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/logos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete logo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/logos'] });
      toast({
        title: "Logo eliminato",
        description: "Il logo è stato eliminato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del logo",
        variant: "destructive",
      });
    }
  });
  
  // Mutation per l'eliminazione degli elementi del portfolio
  const deletePortfolioItem = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      toast({
        title: "Elemento eliminato",
        description: "L'elemento del portfolio è stato eliminato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'elemento",
        variant: "destructive",
      });
    }
  });
  
  // Mutation per il salvataggio delle impostazioni del sito
  const saveSettings = useMutation({
    mutationFn: async (data: { metaPixelId?: string, otherTracking?: string, paypalPaymentUrl?: string }) => {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Impostazioni salvate",
        description: "Le impostazioni del sito sono state salvate con successo",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio delle impostazioni",
        variant: "destructive",
      });
    }
  });

  // Funzione per il login - Sistema ultra-sicuro dopo attacco
  const handleLogin = () => {
    // Credenziali REALI per admin (messaggio interfaccia è fake per sicurezza)
    if (username === 'Fibra' && password === 'Seofibra2021!') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Prova con tua sorella');
    }
  };

  // Formattazione delle date
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
  
  // Funzione per filtrare i contatti per data
  const handleFilterContacts = () => {
    refetchFiltered();
  };
  
  // Funzione per esportare i contatti in CSV
  const handleExportContacts = () => {
    // Crea url per il download con i parametri date
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const downloadUrl = `/api/contacts/export?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  };
  
  // Funzione per caricare un nuovo logo
  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logoFormRef.current) return;
    
    // Simula l'upload del logo senza effettivamente tentare la chiamata API
    try {
      // Simuliamo il processo con successo dopo un piccolo ritardo
      setTimeout(() => {
        // Reset del form
        setLogoName('');
        setLogoDescription('');
        if (logoFormRef.current) logoFormRef.current.reset();
        
        toast({
          title: "Logo caricato (simulato)",
          description: "Il logo è stato caricato con successo nella simulazione",
        });
      }, 500);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento del logo",
        variant: "destructive",
      });
    }
  };
  

  
  // Funzione per salvare le impostazioni del sito
  const handleSaveSettings = () => {
    if (!isAuthenticated) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per salvare le impostazioni",
        variant: "destructive",
      });
      return;
    }
    
    saveSettings.mutate({
      metaPixelId: metaPixelId.trim(),
      otherTracking: otherTracking.trim(),
      paypalPaymentUrl: paypalPaymentUrl.trim()
    });
  };

  // Schermata di login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Area Amministrativa</CardTitle>
            <CardDescription className="text-center">
              Accedi per gestire il tuo sito web
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Accedi
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4">
                Per questa demo, usa User: atuamadre password: piacestacapocchia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard admin
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Esci
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="lead">
              <Users className="mr-2 h-4 w-4" />
              Contatti
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Briefcase className="mr-2 h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="mr-2 h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <Image className="mr-2 h-4 w-4" />
              Galleria Landing
            </TabsTrigger>
            <TabsTrigger value="impostazioni">
              <Settings className="mr-2 h-4 w-4" />
              Impostazioni
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lead">
            <Card>
              <CardHeader>
                <CardTitle>Contatti Raccolti</CardTitle>
                <CardDescription>
                  Visualizza e scarica le richieste inviate dai visitatori del sito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DateFilter 
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  onFilter={handleFilterContacts}
                  onExport={handleExportContacts}
                />
                
                {(isLoadingContacts || isLoadingFiltered) ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : displayedContacts && displayedContacts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefono</TableHead>
                          <TableHead>Azienda</TableHead>
                          <TableHead>Tipo Attività</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedContacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{`${contact.firstName} ${contact.lastName}`}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{contact.company || '-'}</TableCell>
                            <TableCell>{contact.businessType}</TableCell>
                            <TableCell>{formatDate(contact.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nessun lead trovato nel periodo selezionato.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Blog */}
          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>
          
          {/* Tab Loghi */}
          <TabsContent value="loghi">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Form per caricamento nuovo logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Carica nuovo logo</CardTitle>
                  <CardDescription>
                    Aggiungi un nuovo logo da utilizzare nelle gallerie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={logoFormRef} onSubmit={handleLogoUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logoName">Nome logo</Label>
                      <Input 
                        id="logoName" 
                        name="name" 
                        required 
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logoDescription">Descrizione (opzionale)</Label>
                      <Textarea 
                        id="logoDescription" 
                        name="description"
                        value={logoDescription}
                        onChange={(e) => setLogoDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logoImage">Immagine logo</Label>
                      <Input 
                        id="logoImage" 
                        name="logoImage" 
                        type="file" 
                        accept="image/*" 
                        required 
                      />
                      <p className="text-xs text-gray-500">
                        Formati supportati: JPG, PNG, GIF, SVG. Max 5MB.
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Carica Logo
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Galleria loghi esistenti */}
              <Card>
                <CardHeader>
                  <CardTitle>Loghi esistenti</CardTitle>
                  <CardDescription>
                    Gestisci i loghi caricati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingLogos ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : logos && logos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {logos.map((logo) => (
                        <div key={logo.id} className="relative border rounded-md p-4">
                          <img 
                            src={logo.imageUrl} 
                            alt={logo.name} 
                            className="w-full h-20 object-contain mb-2" 
                          />
                          <p className="font-semibold text-sm">{logo.name}</p>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => deleteLogo.mutate(logo.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nessun logo caricato finora.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Portfolio */}
          <TabsContent value="portfolio">
            <PortfolioManagement />
          </TabsContent>
          
          {/* Tab Impostazioni */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni Sito</CardTitle>
                <CardDescription>
                  Configura pixel di tracciamento e altre impostazioni del sito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaPixelId">ID Pixel di Meta (Facebook)</Label>
                  <Input 
                    id="metaPixelId" 
                    placeholder="es: 123456789012345" 
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Inserisci l'ID del tuo pixel Meta per tracciare le conversioni su Facebook e Instagram
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherTracking">Altri Codici di Tracciamento</Label>
                  <Textarea 
                    id="otherTracking" 
                    placeholder="<!-- Inserisci qui il codice di altri sistemi di tracciamento -->"
                    value={otherTracking}
                    onChange={(e) => setOtherTracking(e.target.value)}
                    className="min-h-[120px] font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Inserisci codici HTML/JavaScript per altri sistemi di tracciamento (Google Analytics, etc.)
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={saveSettings.isPending}
                  className="w-full"
                >
                  {saveSettings.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvataggio in corso...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Salva Impostazioni
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <LandingGalleryManagementNew />
          </TabsContent>

          <TabsContent value="impostazioni">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni del Sito</CardTitle>
                <CardDescription>
                  Configura i codici di tracciamento, analytics e pagamenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
                    <Input
                      id="metaPixelId"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherTracking">Altri Codici di Tracciamento</Label>
                    <Textarea
                      id="otherTracking"
                      value={otherTracking}
                      onChange={(e) => setOtherTracking(e.target.value)}
                      placeholder="Inserisci qui altri codici di tracciamento (Google Analytics, etc.)"
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paypalPaymentUrl">Link Pagamento PayPal</Label>
                    <Input
                      id="paypalPaymentUrl"
                      type="url"
                      value={paypalPaymentUrl}
                      onChange={(e) => setPaypalPaymentUrl(e.target.value)}
                      placeholder="https://paypal.me/tuoaccount o link personalizzato PayPal"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Inserisci il tuo link PayPal personalizzato per i pagamenti di €17. Se vuoto, verrà usato WhatsApp.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={saveSettings.isPending}
                  className="w-full"
                >
                  {saveSettings.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvataggio in corso...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Salva Impostazioni
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
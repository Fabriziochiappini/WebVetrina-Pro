import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { 
  Loader2, Download, Calendar, Upload, Image, 
  FileImage, Settings, TrashIcon, PlusIcon 
} from 'lucide-react';
import { Contact, Logo, PortfolioItem, SiteSettings } from '@shared/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Riferimenti ai form di upload
  const logoFormRef = useRef<HTMLFormElement>(null);
  const portfolioFormRef = useRef<HTMLFormElement>(null);
  
  // Stato per i pixel
  const [metaPixelId, setMetaPixelId] = useState('');
  const [otherTracking, setOtherTracking] = useState('');
  
  // Stati per il form di caricamento loghi
  const [logoName, setLogoName] = useState('');
  const [logoDescription, setLogoDescription] = useState('');
  
  // Stati per il form di caricamento portfolio
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioTags, setPortfolioTags] = useState('');

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
      return apiRequest(`/api/contacts/filter?${params.toString()}`);
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
    enabled: isAuthenticated && activeTab === "settings",
    onSuccess: (data) => {
      if (data) {
        setMetaPixelId(data.metaPixelId || '');
        setOtherTracking(data.otherTracking || '');
      }
    }
  });
  
  // Mutation per l'eliminazione dei loghi
  const deleteLogo = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/logos/${id}`, {
        method: 'DELETE'
      });
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
      return apiRequest(`/api/portfolio/${id}`, {
        method: 'DELETE'
      });
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
    mutationFn: async (data: { metaPixelId?: string, otherTracking?: string }) => {
      return apiRequest('/api/site-settings', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      });
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

  // Funzione per il login
  const handleLogin = () => {
    // Semplice password per demo - in un caso reale utilizzeremmo un'autenticazione più robusta
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password non corretta');
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
    
    const formData = new FormData(logoFormRef.current);
    
    try {
      await fetch('/api/logos', {
        method: 'POST',
        body: formData,
      });
      
      // Reset del form
      setLogoName('');
      setLogoDescription('');
      if (logoFormRef.current) logoFormRef.current.reset();
      
      // Aggiorna i dati
      queryClient.invalidateQueries({ queryKey: ['/api/logos'] });
      
      toast({
        title: "Logo caricato",
        description: "Il logo è stato caricato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento del logo",
        variant: "destructive",
      });
    }
  };
  
  // Funzione per caricare un nuovo elemento del portfolio
  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!portfolioFormRef.current) return;
    
    // Validazione dei tag (dovrebbero essere una lista separata da virgole)
    const tagsArray = portfolioTags.split(',').map(tag => tag.trim()).filter(Boolean);
    const portfolioFormData = new FormData(portfolioFormRef.current);
    portfolioFormData.set('tags', JSON.stringify(tagsArray));
    
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        body: portfolioFormData,
      });
      
      // Reset del form
      setPortfolioTitle('');
      setPortfolioDescription('');
      setPortfolioTags('');
      if (portfolioFormRef.current) portfolioFormRef.current.reset();
      
      // Aggiorna i dati
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      
      toast({
        title: "Elemento aggiunto",
        description: "L'elemento è stato aggiunto al portfolio con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta dell'elemento al portfolio",
        variant: "destructive",
      });
    }
  };
  
  // Funzione per salvare le impostazioni del sito
  const handleSaveSettings = () => {
    saveSettings.mutate({
      metaPixelId,
      otherTracking
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
                Per questa demo, usa la password: admin123
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="lead">Lead</TabsTrigger>
            <TabsTrigger value="loghi">Loghi</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="settings">Impostazioni</TabsTrigger>
          </TabsList>
          
          {/* Tab Lead */}
          <TabsContent value="lead">
            <Card>
              <CardHeader>
                <CardTitle>Lead Raccolti</CardTitle>
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
                ) : (filteredContacts || contacts) && (filteredContacts || contacts).length > 0 ? (
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
                        {(filteredContacts || contacts).map((contact) => (
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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Form per caricamento nuovo elemento portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle>Aggiungi al portfolio</CardTitle>
                  <CardDescription>
                    Aggiungi un nuovo progetto al tuo portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={portfolioFormRef} onSubmit={handlePortfolioUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="portfolioTitle">Titolo</Label>
                      <Input 
                        id="portfolioTitle" 
                        name="title" 
                        required 
                        value={portfolioTitle}
                        onChange={(e) => setPortfolioTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolioDescription">Descrizione</Label>
                      <Textarea 
                        id="portfolioDescription" 
                        name="description" 
                        required
                        value={portfolioDescription}
                        onChange={(e) => setPortfolioDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolioTags">Tag (separati da virgola)</Label>
                      <Input 
                        id="portfolioTags" 
                        name="portfolioTags" 
                        placeholder="es: Responsive, E-commerce"
                        value={portfolioTags}
                        onChange={(e) => setPortfolioTags(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessImage">Immagine Business</Label>
                        <Input 
                          id="businessImage" 
                          name="businessImage" 
                          type="file" 
                          accept="image/*" 
                          required 
                        />
                        <p className="text-xs text-gray-500">Immagine dell'attività</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="websiteImage">Immagine Sito</Label>
                        <Input 
                          id="websiteImage" 
                          name="websiteImage" 
                          type="file" 
                          accept="image/*" 
                          required 
                        />
                        <p className="text-xs text-gray-500">Screenshot del sito</p>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Aggiungi al Portfolio
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Portfolio esistente */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio esistente</CardTitle>
                  <CardDescription>
                    Gestisci i progetti nel tuo portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPortfolio ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : portfolio && portfolio.length > 0 ? (
                    <div className="space-y-4">
                      {portfolio.map((item) => (
                        <div key={item.id} className="border rounded-md p-4 relative">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="w-20 h-20">
                              <img 
                                src={item.businessImageUrl} 
                                alt={`Business: ${item.title}`} 
                                className="w-full h-full object-cover rounded" 
                              />
                            </div>
                            <div className="w-20 h-20">
                              <img 
                                src={item.websiteImageUrl} 
                                alt={`Website: ${item.title}`} 
                                className="w-full h-full object-cover rounded" 
                              />
                            </div>
                          </div>
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => deletePortfolioItem.mutate(item.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nessun progetto nel portfolio finora.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
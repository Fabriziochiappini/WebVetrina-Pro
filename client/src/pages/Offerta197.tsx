import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Check, Clock, Star, Zap, Shield, Award, Heart, Calendar, Users, Timer } from 'lucide-react';
import { trackBusinessEvent } from '../lib/analytics';
import SalesPopup from '../components/SalesPopup';
import AnnouncementBar from '../components/AnnouncementBar';
import LandingGallery from '../components/LandingGallery';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

const Offerta197 = () => {
  const { toast } = useToast();
  const [slotsRemaining, setSlotsRemaining] = useState(3);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    websiteType: '',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const interval = setInterval(() => {
      const shouldDecrease = Math.random() > 0.95;
      if (shouldDecrease && slotsRemaining > 1) {
        setSlotsRemaining(prev => prev - 1);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [slotsRemaining]);

  const scrollToContact = () => {
    trackBusinessEvent.ctaClick('landing_197', 'contact');
    const element = document.getElementById('contatto-landing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReservation = () => {
    trackBusinessEvent.ctaClick('reservation_button', 'landing_197');
    setShowReservationForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          offer: 'sito-197-euro',
          reservationFee: 17
        }),
      });

      if (response.ok) {
        toast({
          title: "Prenotazione Confermata!",
          description: "Hai riservato il tuo slot. Ti contatteremo entro 2 ore per i dettagli.",
        });
        
        setSlotsRemaining(prev => Math.max(0, prev - 1));
        setShowReservationForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          websiteType: '',
          notes: ''
        });
        
        trackBusinessEvent.ctaClick('reservation_completed', 'landing_197');
      } else {
        throw new Error('Errore nella prenotazione');
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova o contattaci direttamente.",
        variant: "destructive",
      });
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Consegna Ultra-Rapida",
      description: "Il tuo sito sarà online in soli 5 giorni lavorativi"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Design Professionale", 
      description: "Grafica moderna e personalizzata per il tuo brand"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Qualità Garantita",
      description: "Standard professionali al prezzo più conveniente d'Italia"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SalesPopup />
      <AnnouncementBar />

      <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-20"></div>
        
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-600 text-white px-6 py-4 rounded-xl mb-8 border-2 border-red-400">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Timer className="h-6 w-6 animate-pulse" />
                <span className="font-bold text-lg">ATTENZIONE: SLOT LIMITATI</span>
              </div>
              <div className="text-sm mb-4">Solo {slotsRemaining} di 15 slot disponibili per questa settimana</div>
              
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-xs mb-2">
                  <span>Slot occupati</span>
                  <span>{15 - slotsRemaining}/15</span>
                </div>
                <div className="w-full bg-red-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-red-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${((15 - slotsRemaining) / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-secondary text-white px-6 py-3 rounded-full inline-block mb-8 font-bold text-lg">
              🔥 OFFERTA LIMITATA - SOLO OGGI 🔥
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Il Tuo Sito Web<br />
              <span className="text-secondary">a Soli €197</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              <span className="line-through text-red-300">€1.200</span> 
              <span className="font-bold text-3xl text-secondary ml-4">€197</span>
              <span className="block mt-2 text-lg">Risparmia oltre €1.000 oggi stesso!</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="text-secondary mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-90">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-8 rounded-2xl border border-white/30 mb-8">
              <h3 className="text-2xl font-bold mb-4">Prenota Subito il Tuo Slot</h3>
              <p className="text-lg mb-6 opacity-90">
                Riserva solo <strong>€17</strong> per bloccare il tuo posto nella coda di sviluppo.<br />
                Il resto lo paghi solo alla consegna del sito completato.
              </p>
              
              <Button 
                onClick={handleReservation}
                className="bg-secondary hover:bg-secondary/90 text-white font-bold py-6 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-2xl mb-4"
              >
                <Calendar className="mr-3 h-6 w-6" />
                PRENOTA CON €17 SUBITO
              </Button>
              
              <div className="text-sm opacity-80">
                ✓ Include: Hosting, Dominio e Certificato SSL<br />
                ✓ Qualsiasi tipo di sito web<br />
                ✓ Pagamento del saldo solo alla consegna
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Consegna garantita in 5 giorni</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Soddisfatti o rimborsati 100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showReservationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-primary mb-2">Prenota il Tuo Slot</h3>
              <p className="text-gray-600">
                Riserva il tuo posto nella coda di sviluppo con soli €17
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Cognome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Nome Azienda/Attività</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="websiteType">Tipo di sito web necessario</Label>
                <Input
                  id="websiteType"
                  placeholder="es. sito vetrina, e-commerce, blog..."
                  value={formData.websiteType}
                  onChange={(e) => setFormData({...formData, websiteType: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="notes">Note aggiuntive</Label>
                <Textarea
                  id="notes"
                  placeholder="Descrivici brevemente il tuo progetto..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Cosa include la tua prenotazione:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Hosting web incluso per 1 anno</li>
                  <li>✓ Dominio .it o .com incluso</li>
                  <li>✓ Certificato SSL di sicurezza</li>
                  <li>✓ Qualsiasi tipo di sito web</li>
                  <li>✓ Supporto email incluso</li>
                  <li>✓ Consegna garantita in 5 giorni</li>
                </ul>
                <div className="mt-3 text-center">
                  <span className="text-2xl font-bold text-green-800">Prenotazione: €17</span><br />
                  <span className="text-sm">Saldo €180 alla consegna</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReservationForm(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90">
                  Prenota con €17
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section id="contatto-landing" className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Solo {slotsRemaining} Slot Rimasti!
            </h2>
            <p className="text-xl mb-8">
              Non perdere l'opportunità di avere il tuo sito web professionale a questo prezzo eccezionale.
            </p>
            
            <div className="bg-white/10 p-8 rounded-2xl mb-10">
              <div className="text-6xl font-bold text-secondary mb-4">€197</div>
              <p className="text-xl mb-6">Include tutto • Hosting + Dominio + SSL</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Consegna in 5 giorni</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Design personalizzato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Hosting + Dominio inclusi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Certificato SSL</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleReservation}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold py-6 px-16 rounded-full text-2xl transition-all duration-300 hover:scale-105 shadow-2xl mb-8"
            >
              <Calendar className="mr-3 h-6 w-6" />
              PRENOTA SUBITO CON €17
            </Button>

            <p className="text-sm mt-6 opacity-90">
              ⚡ Prenotazione istantanea • Saldo alla consegna • Garanzia 100%
            </p>
          </div>
        </div>
      </section>

      <LandingGallery />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Offerta197;
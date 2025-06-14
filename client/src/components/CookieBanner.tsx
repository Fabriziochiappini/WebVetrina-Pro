import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già dato il consenso
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    
    // Abilita i cookie di tracciamento
    if ((window as any).fbq) {
      (window as any).fbq('consent', 'grant');
    }
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
    
    // Disabilita i cookie di tracciamento
    if ((window as any).fbq) {
      (window as any).fbq('consent', 'revoke');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Utilizzo dei Cookie</h3>
            <p className="text-gray-600 text-sm">
              Utilizziamo cookie essenziali per il funzionamento del sito e cookie di marketing per migliorare la tua esperienza. 
              Puoi accettare tutti i cookie o gestire le tue preferenze.{' '}
              <a href="/privacy-policy" className="text-primary underline hover:text-primary/80">
                Leggi la nostra Privacy Policy
              </a>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button 
              variant="outline" 
              onClick={rejectCookies}
              className="text-sm"
            >
              Solo Essenziali
            </Button>
            <Button 
              onClick={acceptCookies}
              className="bg-primary hover:bg-primary/90 text-white text-sm"
            >
              Accetta Tutti
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
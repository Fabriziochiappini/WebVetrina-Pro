import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface SaleData {
  name: string;
  location: string;
  package: string;
  time: string;
}

const salesData: SaleData[] = [
  { name: "Marco R.", location: "Milano", package: "Sito Web LITE", time: "2 minuti fa" },
  { name: "Anna T.", location: "Roma", package: "Sito Web STANDARD", time: "5 minuti fa" },
  { name: "Giuseppe M.", location: "Napoli", package: "Sito Web LITE", time: "8 minuti fa" },
  { name: "Laura S.", location: "Torino", package: "E-COMMERCE", time: "12 minuti fa" },
  { name: "Francesco D.", location: "Firenze", package: "Sito Web LITE", time: "15 minuti fa" },
  { name: "Chiara B.", location: "Bologna", package: "Sito Web STANDARD", time: "18 minuti fa" },
  { name: "Roberto C.", location: "Palermo", package: "Sito Web LITE", time: "22 minuti fa" },
  { name: "Elena V.", location: "Venezia", package: "E-COMMERCE", time: "25 minuti fa" },
  { name: "Matteo L.", location: "Genova", package: "Sito Web LITE", time: "28 minuti fa" },
  { name: "Federica R.", location: "Catania", package: "Sito Web STANDARD", time: "32 minuti fa" },
  { name: "Luca N.", location: "Bari", package: "Sito Web LITE", time: "35 minuti fa" },
  { name: "Valentina P.", location: "Verona", package: "Sito Web LITE", time: "38 minuti fa" },
  { name: "Davide G.", location: "Padova", package: "E-COMMERCE", time: "42 minuti fa" },
  { name: "Silvia M.", location: "Trieste", package: "Sito Web STANDARD", time: "45 minuti fa" },
  { name: "Andrea F.", location: "Brescia", package: "Sito Web LITE", time: "48 minuti fa" }
];

const SalesPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState<SaleData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Ritarda l'inizio delle notifiche di 3 secondi dopo il caricamento della pagina
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, 3000);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const showRandomSale = () => {
      const randomSale = salesData[Math.floor(Math.random() * salesData.length)];
      setCurrentSale(randomSale);
      setIsVisible(true);

      // Nascondi il popup dopo 5 secondi
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Mostra il primo popup immediatamente
    showRandomSale();

    // Poi mostra un popup ogni 10-15 secondi (randomizzato)
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 5000 + 10000; // 10-15 secondi
      setTimeout(showRandomSale, randomDelay);
    }, 15000);

    return () => clearInterval(interval);
  }, [hasStarted]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentSale) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {currentSale.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{currentSale.name}</p>
                <p className="text-xs text-gray-500">{currentSale.location}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-1">
              Ha appena acquistato <span className="font-semibold text-green-600">{currentSale.package}</span>
            </p>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{currentSale.time}</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Vendita verificata</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPopup;
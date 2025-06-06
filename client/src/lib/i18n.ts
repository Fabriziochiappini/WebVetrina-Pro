import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'it' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasDetected: boolean;
  setHasDetected: (detected: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'it',
      isLoading: false,
      hasDetected: false,
      setLanguage: (language: Language) => set({ language }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      setHasDetected: (detected: boolean) => set({ hasDetected: detected }),
    }),
    {
      name: 'language-storage',
    }
  )
);

// Funzione per rilevare la posizione dall'IP con geolocalizzazione autentica
export const detectLanguageFromIP = async (): Promise<Language> => {
  try {
    // Utilizza ipapi.co con chiave API per dati autentici di geolocalizzazione
    const response = await fetch(`https://ipapi.co/json/?key=${import.meta.env.VITE_GEOLOCATION_API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }
    const data = await response.json();
    
    console.log('Detected location:', data.country_name, data.country_code);
    
    // Logica di rilevamento lingua basata su paese reale
    if (data.country_code === 'IT' || data.country_code === 'SM' || data.country_code === 'VA') {
      return 'it'; // Italia, San Marino, Vaticano
    }
    
    // Paesi anglofoni
    if (['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA'].includes(data.country_code)) {
      return 'en';
    }
    
    // Europa del Nord (tendenzialmente anglofoni come seconda lingua)
    if (['NO', 'SE', 'DK', 'FI', 'NL', 'DE', 'AT', 'CH'].includes(data.country_code)) {
      return 'en';
    }
    
    // Per altri paesi, default a italiano (business italiano)
    return 'it';
  } catch (error) {
    console.warn('Geolocation API failed, using browser language fallback:', error);
    
    // Fallback: rileva dalla lingua del browser
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('it')) {
      return 'it';
    }
    if (browserLang.startsWith('en')) {
      return 'en';
    }
    
    // Default finale: italiano
    return 'it';
  }
};
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

// Funzione per rilevare la posizione dall'IP
export const detectLanguageFromIP = async (): Promise<Language> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    
    // Se l'utente è in Italia, usa italiano, altrimenti inglese
    return data.country_code === 'IT' ? 'it' : 'en';
  } catch (error) {
    console.warn('Failed to detect location from IP, using browser language fallback:', error);
    
    // Fallback: usa la lingua del browser
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('it') ? 'it' : 'en';
  }
};
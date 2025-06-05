import { useEffect } from 'react';
import { useLanguageStore, detectLanguageFromIP } from '@/lib/i18n';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { hasDetected, setLanguage, setIsLoading, setHasDetected } = useLanguageStore();

  useEffect(() => {
    const initializeLanguage = async () => {
      if (!hasDetected) {
        setIsLoading(true);
        try {
          const detectedLanguage = await detectLanguageFromIP();
          setLanguage(detectedLanguage);
          setHasDetected(true);
        } catch (error) {
          console.warn('Language detection failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeLanguage();
  }, [hasDetected, setLanguage, setIsLoading, setHasDetected]);

  return <>{children}</>;
};
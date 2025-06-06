import { useLanguageStore } from '@/lib/i18n';
import { translations, type TranslationKeys } from '@/lib/translations';

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Restituisce direttamente l'oggetto traduzioni per la lingua corrente
  return translations[language];
};
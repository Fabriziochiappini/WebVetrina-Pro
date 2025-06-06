import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe } from 'lucide-react';
import { useLanguageStore, detectLanguageFromIP, type Language } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const isHomePage = location === '/';
  
  const { language, setLanguage, isLoading, setIsLoading, hasDetected, setHasDetected } = useLanguageStore();
  const translations = useTranslation();

  // Rileva automaticamente la lingua al primo caricamento
  useEffect(() => {
    if (!hasDetected && !isLoading) {
      setIsLoading(true);
      detectLanguageFromIP().then((detectedLang) => {
        if (detectedLang !== language) {
          setLanguage(detectedLang);
          console.log(`Lingua rilevata automaticamente: ${detectedLang}`);
        }
        setHasDetected(true);
        setIsLoading(false);
      }).catch((error) => {
        console.warn('Errore nel rilevamento automatico della lingua:', error);
        setHasDetected(true);
        setIsLoading(false);
      });
    }
  }, [language, setLanguage, hasDetected, setHasDetected, isLoading, setIsLoading]);

  const scrollToSection = (id: string) => {
    // Solo nella home page facciamo lo scroll
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Se non siamo nella home, prima navighiamo alla home e poi aggiungiamo un hash
      window.location.href = '/#' + id;
    }
    setIsOpen(false);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowLanguageMenu(false);
    console.log(`Lingua cambiata manualmente in: ${newLanguage}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl font-bold font-heading cursor-pointer">
              <span className="text-primary">WebPro</span>
              <span className="text-secondary">Italia</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <button 
            onClick={() => scrollToSection('servizi')} 
            className="hover:text-primary transition-colors"
          >
            {t.nav.services}
          </button>
          <button 
            onClick={() => scrollToSection('offerte')} 
            className="hover:text-primary transition-colors"
          >
            Offerte
          </button>
          <button 
            onClick={() => scrollToSection('testimonianze')} 
            className="hover:text-primary transition-colors"
          >
            {t.nav.testimonials}
          </button>
          <Link href="/chi-siamo">
            <span className="hover:text-primary transition-colors cursor-pointer">
              {t.nav.about}
            </span>
          </Link>
          <Link href="/blog">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Blog
            </span>
          </Link>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-primary transition-colors"
          >
            {t.nav.faq}
          </button>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
              disabled={isLoading}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleLanguageChange('it')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    language === 'it' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  🇮🇹 Italiano
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    language === 'en' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
        </nav>
        
        <Button 
          onClick={() => scrollToSection('contatti')} 
          className="hidden md:inline-block bg-secondary text-white font-bold rounded-full shadow-md hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
        >
          {t.nav.contact}
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-primary">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              <button 
                onClick={() => scrollToSection('servizi')} 
                className="text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Servizi
              </button>
              <button 
                onClick={() => scrollToSection('offerte')} 
                className="text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Offerte
              </button>
              <button 
                onClick={() => scrollToSection('testimonianze')} 
                className="text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Testimonianze
              </button>
              <Link href="/chi-siamo">
                <span className="text-left px-4 py-2 hover:bg-gray-100 rounded-md block">
                  Chi Siamo
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-left px-4 py-2 hover:bg-gray-100 rounded-md block">
                  Blog
                </span>
              </Link>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                FAQ
              </button>
              <Button 
                onClick={() => scrollToSection('contatti')} 
                className="bg-secondary text-white font-bold rounded-full shadow-md hover:bg-secondary/90 w-full mt-4"
              >
                Contattaci
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;

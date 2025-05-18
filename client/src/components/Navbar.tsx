import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isHomePage = location === '/';

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
        
        <nav className="hidden md:flex space-x-6 font-medium">
          <button 
            onClick={() => scrollToSection('servizi')} 
            className="hover:text-primary transition-colors"
          >
            Servizi
          </button>
          <button 
            onClick={() => scrollToSection('portfolio')} 
            className="hover:text-primary transition-colors"
          >
            Portfolio
          </button>
          <button 
            onClick={() => scrollToSection('testimonianze')} 
            className="hover:text-primary transition-colors"
          >
            Testimonianze
          </button>
          <Link href="/chi-siamo">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Chi Siamo
            </span>
          </Link>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-primary transition-colors"
          >
            FAQ
          </button>
        </nav>
        
        <Button 
          onClick={() => scrollToSection('contatti')} 
          className="hidden md:inline-block bg-secondary text-white font-bold rounded-full shadow-md hover:bg-secondary/90 transition-all hover:translate-y-[-2px]"
        >
          Contattaci
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
                onClick={() => scrollToSection('portfolio')} 
                className="text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Portfolio
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

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
    <header className="sticky top-0 z-50 glass bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-3xl font-bold font-heading cursor-pointer hover:scale-105 transition-transform">
              <span className="text-gradient">WebPro</span>
              <span className="text-accent">Italia</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8 font-medium">
          <button 
            onClick={() => scrollToSection('servizi')} 
            className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
          >
            Servizi
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('offerte')} 
            className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
          >
            Offerte
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('testimonianze')} 
            className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
          >
            Testimonianze
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <Link href="/chi-siamo">
            <span className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer relative group">
              Chi Siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
          <Link href="/blog">
            <span className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer relative group">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
          >
            FAQ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>
        
        <Button 
          onClick={() => scrollToSection('contatti')} 
          className="hidden md:inline-block btn-modern-primary"
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

import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const FloatingCta = () => {
  const scrollToContatti = () => {
    const element = document.getElementById('contatti');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={scrollToContatti}
        className="flex items-center gap-2 py-3 px-6 bg-secondary text-white font-bold rounded-full shadow-lg hover:bg-secondary/90 hover:translate-y-[-2px] transition-all"
      >
        <Rocket className="h-4 w-4" />
        <span>Inizia Ora</span>
      </Button>
    </div>
  );
};

export default FloatingCta;

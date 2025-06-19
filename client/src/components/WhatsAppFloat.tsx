import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', 'engagement', 'floating_button');
    const message = "Ciao, siamo qui per aiutarvi";
    const whatsappUrl = `https://wa.me/393479942321?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3">
        {/* Label - nascosta su mobile per evitare sovrapposizioni */}
        <div className="hidden sm:block bg-white text-gray-800 px-3 py-2 rounded-full shadow-lg text-sm font-medium">
          Contattaci
        </div>
        
        {/* Button */}
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Contattaci su WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
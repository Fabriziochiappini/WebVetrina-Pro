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
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Contattaci su WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chatta con noi su WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ContactForm from '../components/ContactForm';

const ThankYou = () => {
  // Fetch settings for Meta Pixel
  const { data: settings } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  useEffect(() => {
    // Track Meta Pixel Purchase event
    if (typeof window !== 'undefined' && window.fbq && settings?.metaPixelId) {
      window.fbq('track', 'Purchase', {
        value: 197.00,
        currency: 'EUR',
        content_name: 'Sito Web Landing Page',
        content_category: 'Web Development',
        content_ids: ['landing-197'],
        content_type: 'product'
      });
      console.log('Meta Pixel Purchase event tracked');
    }

    // Track Google Analytics Purchase event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: 197.00,
        currency: 'EUR',
        items: [{
          item_id: 'landing-197',
          item_name: 'Sito Web Landing Page',
          category: 'Web Development',
          quantity: 1,
          price: 197.00
        }]
      });
      console.log('Google Analytics Purchase event tracked');
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Success Message */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎉 CONGRATULAZIONI!
            </h1>
            
            <div className="text-2xl md:text-3xl font-semibold text-secondary mb-6">
              Hai prenotato il tuo SLOT
            </div>
            
            <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-6 mb-8 inline-block">
              <p className="text-orange-800 font-bold text-lg">
                ⚠️ COMPLIMENTI per aver riservato il tuo slot<br />
                <span className="text-xl">(Slot rimasti: 2)</span>
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-12 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ora compila i dati per essere ricontattato dal nostro staff
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Il nostro team ti contatterà entro 24 ore per iniziare la realizzazione del tuo sito web professionale
            </p>
            
            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center text-green-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Consegna in 5-7 giorni
              </div>
              <div className="flex items-center text-green-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Design responsive moderno
              </div>
              <div className="flex items-center text-green-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SEO ottimizzato incluso
              </div>
              <div className="flex items-center text-green-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Assistenza 12 mesi gratuita
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Hai domande? Contattaci subito!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+393479942321" 
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +39 347 9942321
              </a>
              
              <a 
                href="https://wa.me/393479942321?text=Ciao,%20siamo%20qui%20per%20aiutarvi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
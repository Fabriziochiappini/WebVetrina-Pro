import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ContactFormClean from '../components/ContactFormClean';

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
          <div className="w-full">
            <ContactFormClean />
          </div>


        </div>
      </div>
    </div>
  );
};

export default ThankYou;
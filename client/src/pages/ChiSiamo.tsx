import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';

const ChiSiamo = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="antialiased bg-light text-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Chi Siamo</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Un team di professionisti appassionati nel creare siti web di qualità a prezzi accessibili.
          </p>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-primary font-heading">Il Nostro Team</h2>
              <p className="text-lg text-gray-700 mb-6">
                Siamo un gruppo di sviluppatori web, designer e esperti di marketing appassionati 
                di tecnologia e creatività. La nostra missione è rendere il web design professionale 
                accessibile a tutte le piccole e medie imprese italiane.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Fondata nel 2018, WebProItalia è cresciuta rapidamente grazie al nostro approccio 
                trasparente e alla qualità impeccabile dei nostri progetti. Abbiamo aiutato centinaia 
                di aziende a stabilire una forte presenza online, aumentando la loro visibilità e 
                le opportunità di business.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Il nostro team combina competenze tecniche all'avanguardia con un occhio attento al 
                design e alle tendenze del mercato, garantendo che ogni sito che creiamo sia non solo 
                bello da vedere, ma anche funzionale ed efficace nel raggiungere gli obiettivi di business.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-bold">Indirizzo</h4>
                    <p className="text-gray-600">Via Casilina Sud 116, 03100 Frosinone, Italia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-gray-600">info@webproitalia.it</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-bold">Telefono</h4>
                    <p className="text-gray-600">+39 0775 123456</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => scrollToSection('mappa')} 
                className="mt-8 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary/90 transition-all"
              >
                Vieni a trovarci
              </Button>
            </div>
            
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Il team di WebProItalia" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Office Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Gli uffici di WebProItalia" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-primary font-heading">La Nostra Sede</h2>
              <p className="text-lg text-gray-700 mb-6">
                I nostri uffici si trovano in una zona centrale e facilmente raggiungibile di Frosinone. 
                Abbiamo creato uno spazio di lavoro moderno e accogliente dove la creatività può fiorire.
              </p>
              <p className="text-lg text-gray-700">
                Siamo sempre felici di accogliere i nostri clienti per discutere dei loro progetti 
                di persona. Sentiti libero di fissare un appuntamento o semplicemente passa a trovarci 
                durante il nostro orario di lavoro.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section id="mappa" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-primary text-center font-heading">Come Raggiungerci</h2>
          <div className="rounded-xl overflow-hidden shadow-lg h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.1036351872546!2d13.3307564!3d41.6400076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13254dc60e2fddb5%3A0x5a75f7a7c58b503f!2sVia%20Casilina%20Sud%2C%20116%2C%2003100%20Frosinone%20FR!5e0!3m2!1sit!2sit!4v1621954783182!5m2!1sit!2sit" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ChiSiamo;
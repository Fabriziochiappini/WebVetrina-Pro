import { logos } from '@/assets/logos';

const LogoGallery = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Logo Professionali Inclusi
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ecco alcuni esempi di logo che abbiamo creato per i nostri clienti, inclusi nel pacchetto da €299.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-40"
            >
              <img 
                src={logo} 
                alt="Logo professionale esempio" 
                className="max-h-24 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoGallery;

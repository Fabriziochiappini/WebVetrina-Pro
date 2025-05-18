import { benefits } from '@/assets/benefits';

const Benefits = () => {
  return (
    <section id="servizi" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Perché Scegliere La Nostra Offerta
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un sito web professionale chiavi in mano a un prezzo imbattibile, senza sorprese.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${benefit.icon} text-2xl text-primary`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

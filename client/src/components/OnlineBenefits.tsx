import { GlobeIcon, LineChart, Users, Zap } from 'lucide-react';

const OnlineBenefits = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Perché Essere Online È Fondamentale
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nel mercato di oggi, un sito web professionale è essenziale per qualsiasi attività. Ecco i principali benefici:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
            <div className="mb-4 text-primary">
              <GlobeIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">Visibilità 24/7</h3>
            <p className="text-gray-600">La tua attività sarà visibile ai clienti 24 ore su 24, anche quando sei chiuso, ampliando il tuo raggio d'azione.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
            <div className="mb-4 text-primary">
              <Users className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">Credibilità</h3>
            <p className="text-gray-600">Un sito professionale aumenta la fiducia dei clienti e la credibilità della tua attività rispetto alla concorrenza.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
            <div className="mb-4 text-primary">
              <LineChart className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">Crescita del Business</h3>
            <p className="text-gray-600">Espandi la tua clientela e raggiungi nuovi mercati, aumentando le vendite e le opportunità di business.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
            <div className="mb-4 text-primary">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">Vantaggio Competitivo</h3>
            <p className="text-gray-600">Distinguiti dalla concorrenza e offri ai tuoi clienti un'esperienza professionale e di qualità.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineBenefits;
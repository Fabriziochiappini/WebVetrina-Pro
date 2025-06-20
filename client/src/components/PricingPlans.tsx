import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface PricingPlansProps {
  scrollToSection: (id: string) => void;
}

const PricingPlans = ({ scrollToSection }: PricingPlansProps) => {
  const plans = [
    {
      name: "LITE",
      price: "197",
      description: "Ideale per piccole attività",
      features: [
        "Sito web vetrina fino a 3 pagine",
        "Design responsive",
        "Ottimizzazione base SEO",
        "Personalizzazioni limitate",
        "Supporto email"
      ],
      excludes: [
        "Logo non incluso"
      ],
      buttonText: "Scegli LITE",
      popular: false
    },
    {
      name: "STANDARD",
      price: "299",
      description: "Il più scelto dai nostri clienti",
      features: [
        "Sito web vetrina fino a 5 pagine",
        "Logo professionale incluso",
        "Ottimizzazione SEO completa",
        "Design completamente personalizzabile",
        "Supporto tecnico 1 anno",
        "Consegna in 5 giorni"
      ],
      excludes: [],
      buttonText: "Scegli STANDARD",
      popular: true,
      originalValue: "1200"
    },
    {
      name: "E-COMMERCE",
      price: "699",
      description: "Per vendere online",
      features: [
        "Sito e-commerce completo",
        "Logo professionale incluso",
        "Gestione prodotti illimitati",
        "Sistema pagamenti integrato",
        "Gestione ordini e clienti",
        "Ottimizzazione SEO avanzata",
        "Supporto prioritario 1 anno",
        "Consegna in 7 giorni"
      ],
      excludes: [
        "Caricamento prodotti non incluso"
      ],
      buttonText: "Scegli E-COMMERCE",
      popular: false
    }
  ];

  return (
    <section id="offerte" className="section-modern bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Le Nostre <span className="text-gradient-orange">Offerte</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Scegli il piano perfetto per la tua attività. Tutti i nostri siti sono responsive e ottimizzati per i motori di ricerca.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative modern-card-hover p-8 slide-up ${
                plan.popular 
                  ? 'border-primary/50 ring-2 ring-primary/20 scale-105 md:scale-110 bg-gradient-to-br from-white to-primary/5' 
                  : 'hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg border-2 border-secondary/30">
                    <Star className="h-4 w-4 fill-current text-secondary" />
                    PIÙ VENDUTO
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className={`font-bold mb-2 font-heading ${
                  plan.popular ? 'text-2xl text-primary' : 'text-xl text-primary'
                }`}>
                  {plan.name}
                </h3>
                <div className={`mb-2 ${plan.popular ? 'text-lg' : 'text-base'}`}>
                  <span className={`font-bold font-heading ${
                    plan.popular ? 'text-4xl text-gradient-orange' : 'text-3xl text-primary'
                  }`}>
                    €{plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">una tantum</span>
                </div>
                {plan.originalValue && (
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">Valore €{plan.originalValue}</span>
                    <span className="text-secondary font-semibold ml-2">
                      Risparmi €{parseInt(plan.originalValue) - parseInt(plan.price)}
                    </span>
                  </div>
                )}
                <p className={`text-muted-foreground ${plan.popular ? 'text-base' : 'text-sm'}`}>
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className={`${plan.popular ? 'text-base' : 'text-sm'} text-gray-700`}>
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.excludes.map((exclude, idx) => (
                  <li key={`exclude-${idx}`} className="flex items-start gap-3">
                    <div className="h-5 w-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <div className="h-0.5 w-3 bg-red-400"></div>
                    </div>
                    <span className={`${plan.popular ? 'text-base' : 'text-sm'} text-red-500`}>
                      {exclude}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => scrollToSection('contatti')} 
                className={`w-full font-bold transition-all duration-300 ${
                  plan.popular 
                    ? 'btn-modern-orange text-lg py-4' 
                    : 'btn-modern-secondary'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm font-medium">
              💡 <strong>Gestione Hosting e Dominio:</strong> Su richiesta, possiamo occuparci anche della gestione del tuo hosting e dominio con tariffe competitive e supporto dedicato.
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Non sei sicuro quale piano scegliere? Parliamone insieme!
          </p>
          <Button 
            onClick={() => scrollToSection('contatti')} 
            variant="outline"
            className="py-3 px-8 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-full transition-all"
          >
            Richiedi Consulenza Gratuita
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
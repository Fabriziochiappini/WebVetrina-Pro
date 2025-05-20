const Process = () => {
  return (
    <section id="come-funziona" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Come Funziona
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ottieni il tuo sito web professionale in soli 4 semplici passaggi:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative flex flex-col items-center md:items-start">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading text-center md:text-left">Contattaci</h3>
            <p className="text-gray-600 text-center md:text-left">Compila il modulo di contatto con le tue esigenze e dettagli aziendali.</p>
            <div className="hidden lg:block absolute top-10 right-0 w-3/4 h-0.5 bg-gray-200">
              <div className="absolute right-0 -top-1.5 w-3 h-3 rounded-full bg-primary"></div>
            </div>
          </div>
          
          <div className="relative flex flex-col items-center md:items-start">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading text-center md:text-left">Consulenza</h3>
            <p className="text-gray-600 text-center md:text-left">Ti contattiamo per discutere il tuo progetto e raccogliere informazioni.</p>
            <div className="hidden lg:block absolute top-10 right-0 w-3/4 h-0.5 bg-gray-200">
              <div className="absolute right-0 -top-1.5 w-3 h-3 rounded-full bg-primary"></div>
            </div>
          </div>
          
          <div className="relative flex flex-col items-center md:items-start">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading text-center md:text-left">Creazione</h3>
            <p className="text-gray-600 text-center md:text-left">Sviluppiamo il tuo sito web e logo seguendo le tue specifiche.</p>
            <div className="hidden lg:block absolute top-10 right-0 w-3/4 h-0.5 bg-gray-200">
              <div className="absolute right-0 -top-1.5 w-3 h-3 rounded-full bg-primary"></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading text-center md:text-left">Consegna</h3>
            <p className="text-gray-600 text-center md:text-left">Ricevi il tuo sito web completo in 5 giorni, pronto all'uso!</p>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl flex flex-col md:flex-row items-center gap-8">
          <img 
            src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
            alt="Il nostro processo di sviluppo web" 
            className="w-full md:w-1/3 rounded-xl shadow-md"
          />
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary font-heading">
              Cosa include il pacchetto da €299:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Fino a 5 pagine di contenuto (Home, Chi siamo, Servizi, Portfolio, Contatti)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Design professionale personalizzato per il tuo brand</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Logo aziendale in formato vettoriale</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Ottimizzazione per i motori di ricerca (SEO base)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Modulo di contatto funzionante</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Integrazione con i social media</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Hosting e dominio per 1 anno (valore €200)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;

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
            <p className="text-gray-600 text-center md:text-left">Ricevi il tuo sito web completo in tempi rapidi, pronto all'uso!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;

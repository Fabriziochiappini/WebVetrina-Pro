import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Sito WEB PRO ITALIA completo ricostruito
const WebProItalia = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="antialiased bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-blue-600">WebPro</span>
            <span className="text-orange-500">Italia</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('servizi')} className="hover:text-blue-600 transition-colors">Servizi</button>
            <button onClick={() => scrollToSection('offerte')} className="hover:text-blue-600 transition-colors">Offerte</button>
            <button onClick={() => scrollToSection('portfolio')} className="hover:text-blue-600 transition-colors">Portfolio</button>
            <button onClick={() => scrollToSection('contatti')} className="hover:text-blue-600 transition-colors">Contatti</button>
            <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Siti Web Professionali<br />
            <span className="text-orange-400">per la Tua Azienda</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Crea la tua presenza online con i nostri pacchetti completi
          </p>
          <button 
            onClick={() => scrollToSection('offerte')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Scopri le Nostre Offerte
          </button>
        </div>
      </section>

      {/* Benefici Online */}
      <section id="servizi" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perché Avere un Sito Web?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-globe text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Visibilità Online</h3>
              <p className="text-gray-600">Raggiungi clienti 24/7 e espandi la tua presenza sul web</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Crescita del Business</h3>
              <p className="text-gray-600">Aumenta le vendite e fidelizza i tuoi clienti</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Credibilità</h3>
              <p className="text-gray-600">Mostra professionalità e costruisci fiducia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section id="offerte" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">I Nostri Pacchetti</h2>
          <p className="text-center text-gray-600 mb-12">Scegli la soluzione perfetta per le tue esigenze</p>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* LITE */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h3 className="text-2xl font-bold mb-4">LITE</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">€197</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Sito web responsive</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>5 pagine incluse</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Ottimizzazione SEO base</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Modulo contatti</li>
                <li className="flex items-center"><i className="fas fa-times text-red-500 mr-3"></i>Logo personalizzato</li>
              </ul>
              <button onClick={() => scrollToSection('contatti')} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Scegli LITE
              </button>
            </div>

            {/* STANDARD */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border-4 border-orange-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                PIÙ SCELTO
              </div>
              <h3 className="text-2xl font-bold mb-4">STANDARD</h3>
              <div className="text-4xl font-bold text-orange-500 mb-4">€299</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Sito web responsive</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>8 pagine incluse</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Ottimizzazione SEO avanzata</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Modulo contatti</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Logo personalizzato</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Integrazione social</li>
              </ul>
              <button onClick={() => scrollToSection('contatti')} className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Scegli STANDARD
              </button>
            </div>

            {/* E-COMMERCE */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border">
              <h3 className="text-2xl font-bold mb-4">E-COMMERCE</h3>
              <div className="text-4xl font-bold text-purple-600 mb-4">€699</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Negozio online completo</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Pagine illimitate</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Sistema di pagamento</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Gestione ordini</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Logo personalizzato</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-3"></i>Formazione completa</li>
              </ul>
              <button onClick={() => scrollToSection('contatti')} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Scegli E-COMMERCE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Come Lavoriamo</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Consulenza</h3>
              <p className="text-gray-600">Analizziamo le tue esigenze</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Progettazione</h3>
              <p className="text-gray-600">Creiamo il design perfetto</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Sviluppo</h3>
              <p className="text-gray-600">Realizziamo il tuo sito</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-lg font-semibold mb-2">Consegna</h3>
              <p className="text-gray-600">Il tuo sito è online!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section id="contatti" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Richiedi un Preventivo</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="Cognome" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <input type="email" placeholder="Email" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Telefono" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              <select className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="">Seleziona un pacchetto</option>
                <option value="lite">LITE - €197</option>
                <option value="standard">STANDARD - €299</option>
                <option value="ecommerce">E-COMMERCE - €699</option>
              </select>
              <textarea placeholder="Descrivi il tuo progetto..." rows={4} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                Invia Richiesta
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-blue-400">WebPro</span>
                <span className="text-orange-400">Italia</span>
              </div>
              <p className="text-gray-400">Soluzioni web professionali per la tua azienda</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Servizi</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Siti Web</li>
                <li>E-commerce</li>
                <li>SEO</li>
                <li>Logo Design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Azienda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/chi-siamo" className="hover:text-white">Chi Siamo</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li>Contatti</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contatti</h4>
              <div className="space-y-2 text-gray-400">
                <p><i className="fas fa-envelope mr-2"></i>info@webproitalia.com</p>
                <p><i className="fas fa-phone mr-2"></i>+39 123 456 7890</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>WEB PRO ITALIA è un marchio di IDEALCAR SRLS</p>
            <p>© 2024 Tutti i diritti riservati</p>
          </div>
        </div>
      </footer>

      {/* CTA Floating */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => scrollToSection('contatti')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors"
        >
          <i className="fas fa-phone mr-2"></i>Contattaci
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<WebProItalia />);
}
const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#343a40] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 font-heading">
              <span className="text-primary">WebPro</span>
              <span className="text-secondary">Italia</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Siti web professionali a prezzi imbattibili. Design moderno, rapida consegna e assistenza continua.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 font-heading">Collegamenti Rapidi</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('servizi')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Servizi
                </button>
              </li>

              <li>
                <button 
                  onClick={() => scrollToSection('testimonianze')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimonianze
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contatti')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contatti
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 font-heading">Servizi</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Siti Web Vetrina
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Design Logo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Ottimizzazione SEO
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Manutenzione Sito
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Consulenza Web
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 font-heading">Contattaci</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-secondary"></i>
                <span className="text-gray-400">Via Casilina Sud 116, 03100 Frosinone</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-envelope text-secondary"></i>
                <span className="text-gray-400">info.webproitalia@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-phone text-secondary"></i>
                <span className="text-gray-400">+39 02 1234567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} WebProItalia. Tutti i diritti riservati.</p>
              <p className="text-sm mt-1">WebProItalia è un marchio di IDEALCAR SRLS</p>
            </div>
            <a 
              href="/admin" 
              className="mt-4 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center"
            >
              <i className="fas fa-lock mr-2"></i>
              Area Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

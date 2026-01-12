import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ExternalLink } from 'lucide-react';

interface PortfolioItem {
  name: string;
  url: string;
  image: string;
}

interface PortfolioCategory {
  id: string;
  title: string;
  emoji: string;
  items: PortfolioItem[];
}

const portfolioData: PortfolioCategory[] = [
  {
    id: "edile",
    title: "Edile",
    emoji: "🏗️",
    items: [
      { name: "Noleggio Escavatori Siciliano", url: "https://noleggioescavatorisiciliano.com", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop" },
      { name: "Costruendo SRLS", url: "https://costruendosrls.it", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop" },
      { name: "La Cinque G", url: "https://lacinqueg.it", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "servizi",
    title: "Servizi",
    emoji: "🧰",
    items: [
      { name: "La Mole Sgomberi Torino", url: "https://lamolesgomberitorino.com", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" },
      { name: "Jolly Pulizie", url: "https://jollypulizie.com", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop" },
      { name: "Futur Service Caporarello", url: "https://futurservicecaporarello.it", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" },
      { name: "Centro Studi Immobiliari", url: "https://centrostudiimmobiliari.it", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" },
      { name: "Io Sgombero Tutto", url: "https://iosgomberotutto.it", image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "agenzie",
    title: "Agenzie / Immobiliari / Viaggi",
    emoji: "🏢",
    items: [
      { name: "Virtus Multiservizi", url: "https://virtusmultiservizi.com", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" },
      { name: "Refil Servizi Immobiliari", url: "https://www.refilservizimmobiliari.com", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" },
      { name: "Agenzia 2A Acireale", url: "https://agenzia2acireale.com", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop" },
      { name: "Escursioni Sharm con Desi", url: "https://escursioniasharmcondesi.com", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" },
      { name: "Propato Travel", url: "https://propatotravel.com", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "auto",
    title: "Concessionarie / Auto",
    emoji: "🚗",
    items: [
      { name: "Feudale Cars", url: "https://feudalecars.it", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop" },
      { name: "Vetrina Auto", url: "https://vetrinaauto.com", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop" },
      { name: "NPM Group", url: "https://npmgroup.store", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop" },
      { name: "Auto PM Group", url: "https://autopmgroup.com", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "beauty",
    title: "Beauty",
    emoji: "💄",
    items: [
      { name: "MU Makeup", url: "https://www.mumakeup.it", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop" },
      { name: "Angelica Nails Academy", url: "https://angelicanailsacademy.it", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop" },
      { name: "Giambertone Bellavia", url: "https://giambertonebellavia.com", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "bb",
    title: "B&B / Strutture ricettive",
    emoji: "🏡",
    items: [
      { name: "Villa all'Ombra degli Ulivi", url: "https://www.villaallombradegliulivi.com", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" },
      { name: "Villa Ariete", url: "https://villaariete.it", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop" },
      { name: "B&B Civico 250 Pescara", url: "https://bbcivico250pescara.it", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop" },
      { name: "Relais Cala Cavallo", url: "https://relaiscalacavallo.it", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop" },
      { name: "Villa Brothers House", url: "https://villabrothershouse.com", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop" },
      { name: "The Sunset House", url: "https://thesunsethouse.it", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "uffici",
    title: "Uffici / Liberi professionisti",
    emoji: "🧑‍💼",
    items: [
      { name: "Chiara Boroni", url: "https://chiaraboroni.it", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop" },
      { name: "Luca Massignan", url: "https://lucamassignan.com", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop" },
      { name: "Studio Panzi", url: "https://www.studiopanzi.it", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "arte",
    title: "Arte",
    emoji: "🎨",
    items: [
      { name: "Ink Juli Art", url: "https://inkjuliart.com", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "ristoranti",
    title: "Ristoranti / Locali",
    emoji: "🍽️",
    items: [
      { name: "Bistrot De Angelis", url: "https://bistrotdeangelis.com", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop" },
      { name: "Birrificio La Ruota", url: "https://birrificiolaruota.com", image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop" },
      { name: "3punto0 Menu", url: "https://3punto0menu.com", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop" }
    ]
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    emoji: "🛒",
    items: [
      { name: "La Magia del Pulito", url: "https://lamagiadelpulito.com", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" }
    ]
  }
];

const Lavori = () => {
  return (
    <div className="antialiased bg-gray-50 text-dark min-h-screen">
      <Navbar />
      
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">I Nostri Lavori</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Scopri i siti web professionali che abbiamo realizzato per i nostri clienti
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {portfolioData.map((category) => (
            <div key={category.id} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-primary font-heading flex items-center gap-3">
                <span className="text-4xl">{category.emoji}</span>
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <a 
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="text-white font-semibold flex items-center gap-2">
                          Visita il sito <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {item.url.replace('https://', '').replace('www.', '')}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading">
            Vuoi un sito come questi?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Realizziamo il tuo sito web professionale a partire da €297
          </p>
          <a 
            href="/#contatti"
            className="inline-block bg-secondary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-secondary/90 transition-all hover:-translate-y-1"
          >
            Richiedi Preventivo Gratuito
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lavori;

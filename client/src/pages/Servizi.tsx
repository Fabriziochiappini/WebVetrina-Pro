import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  PenTool, 
  Mail, 
  Globe, 
  Headphones, 
  Share2, 
  Target, 
  Users 
} from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  color: string;
  bgGradient: string;
}

const services: ServiceCard[] = [
  {
    id: "seo-plus",
    title: "Ottimizzazione SEO PLUS",
    description: "Posizionamento avanzato sui motori di ricerca con analisi competitors e keyword research professionale",
    icon: <Search className="w-8 h-8" />,
    price: "€99/mese",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  {
    id: "blog-module",
    title: "Modulo Blog",
    description: "Sistema di gestione contenuti con editor avanzato e ottimizzazione automatica per SEO",
    icon: <PenTool className="w-8 h-8" />,
    price: "€149",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100"
  },
  {
    id: "business-email",
    title: "Email Aziendale",
    description: "Caselle email professionali con il tuo dominio, backup automatico e antispam avanzato",
    icon: <Mail className="w-8 h-8" />,
    price: "€29/mese",
    color: "text-green-600",
    bgGradient: "from-green-50 to-green-100"
  },
  {
    id: "multilingual",
    title: "Sito Multilingua",
    description: "Versioni del sito in più lingue con traduzione professionale e gestione automatica dei contenuti",
    icon: <Globe className="w-8 h-8" />,
    price: "€299",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100"
  },
  {
    id: "support-plus",
    title: "Assistenza PLUS",
    description: "Supporto prioritario 24/7, aggiornamenti illimitati e backup quotidiani automatici",
    icon: <Headphones className="w-8 h-8" />,
    price: "€79/mese",
    color: "text-red-600",
    bgGradient: "from-red-50 to-red-100"
  },
  {
    id: "social-management",
    title: "Gestione Social",
    description: "Creazione e gestione profili social, contenuti personalizzati e analisi performance",
    icon: <Share2 className="w-8 h-8" />,
    price: "€199/mese",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-pink-100"
  },
  {
    id: "ad-campaigns",
    title: "Campagne Pubblicitarie",
    description: "Google Ads e Facebook Ads gestite da esperti con ottimizzazione ROI e report dettagliati",
    icon: <Target className="w-8 h-8" />,
    price: "€299/mese",
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100"
  },
  {
    id: "crm-clients",
    title: "CRM Clienti",
    description: "Sistema di gestione clienti integrato con automazioni, follow-up e analytics avanzati",
    icon: <Users className="w-8 h-8" />,
    price: "€149/mese",
    color: "text-teal-600",
    bgGradient: "from-teal-50 to-teal-100"
  }
];

export default function Servizi() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Servizi <span className="text-blue-300">Avanzati</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Potenzia il tuo sito web con servizi professionali che fanno la differenza. 
              Soluzioni complete per far crescere la tua presenza digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
                Scopri i Servizi
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3">
                Richiedi Consulenza
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              I Nostri Servizi Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ogni servizio è progettato per massimizzare il potenziale del tuo sito web 
              e accelerare la crescita del tuo business online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer border-0 overflow-hidden rounded-3xl bg-white"
              >
                <CardContent className="p-0 relative">
                  {/* App Icon Header */}
                  <div className={`bg-gradient-to-br ${service.bgGradient} p-8 text-center relative`}>
                    <div className={`${service.color} mb-4 flex justify-center`}>
                      <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                      {service.title}
                    </h3>
                    <div className="bg-white/90 text-gray-900 font-bold text-xl px-4 py-2 rounded-full inline-block shadow-md">
                      {service.price}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                      {service.description}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl py-3 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      🛒 Aggiungi Servizio
                    </Button>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto a Potenziare il Tuo Sito Web?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Scegli i servizi che fanno al caso tuo e trasforma il tuo sito in una 
            macchina da vendita. Consulenza gratuita inclusa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Richiedi Preventivo Gratuito
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
              Parla con un Esperto
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
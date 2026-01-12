import { Shield, Zap, Globe, Search } from 'lucide-react';

const PerformanceStats = () => {
  const stats = [
    {
      label: "Prestazioni",
      score: 95,
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: <Zap className="w-6 h-6" />
    },
    {
      label: "Accessibilità", 
      score: 90,
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: <Globe className="w-6 h-6" />
    },
    {
      label: "Best Practice",
      score: 100,
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: <Shield className="w-6 h-6" />
    },
    {
      label: "SEO",
      score: 100,
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: <Search className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Siti Web Sicuri, Sempre Online, Altissime Prestazioni
          </h3>
          <p className="text-gray-600">
            Punteggio medio Google PageSpeed dei nostri siti
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={stat.color}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${stat.score}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700 font-medium">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Dati verificabili su Google PageSpeed Insights
        </p>
      </div>
    </section>
  );
};

export default PerformanceStats;

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}



const LandingGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const { data: apiImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/landing-gallery'],
  });

  // Usa solo immagini attive dal database, ordinate correttamente
  const images = apiImages || [];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000); // Cambiato a 5 secondi per vedere meglio le immagini

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  // Scroll to current image
  useEffect(() => {
    if (scrollContainerRef.current && images.length > 0) {
      const container = scrollContainerRef.current;
      const imageWidth = container.offsetWidth * 0.8; // 80% width per image
      const scrollPosition = currentIndex * imageWidth;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, images.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        setCurrentIndex(prev => (prev + 1) % images.length);
      } else {
        // Swipe right - previous image
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-gray-400">Caricamento galleria...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto text-center py-8">
        <p className="text-gray-500">Nessuna immagine nella galleria al momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative group">
        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 scroll-smooth px-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`flex-shrink-0 w-72 md:w-80 lg:w-84 transition-all duration-700 cursor-pointer ${
                index === currentIndex 
                  ? 'scale-105 shadow-2xl ring-2 ring-primary/20' 
                  : 'scale-95 opacity-70 hover:opacity-95 hover:scale-100'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badge "Realizzato" */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    ✓ Realizzato
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
                      {image.description}
                    </p>
                  )}
                  
                  {/* Settore badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Cliente soddisfatto
                    </span>
                    <span className="text-xs text-gray-400">
                      2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 3000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LandingGallery;
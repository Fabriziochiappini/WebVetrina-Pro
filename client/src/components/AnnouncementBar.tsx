import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minuti in secondi

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center text-center">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 animate-bounce" />
          <div>
            <span className="font-bold text-lg">⚡ OFFERTA LIMITATA ⚡</span>
            <span className="mx-3">|</span>
            <span className="text-yellow-300">Sito Web a soli €197 - Scade tra:</span>
            <span className="mx-2 font-mono text-xl font-bold bg-white/20 px-3 py-1 rounded">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-red-800 flex items-center justify-center">
          <span className="text-xl font-bold animate-pulse">⏰ OFFERTA SCADUTA!</span>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBar;
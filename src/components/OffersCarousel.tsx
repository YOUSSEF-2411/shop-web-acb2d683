import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface OffersCarouselProps {
  offers: Offer[];
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ offers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (offers.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [offers.length]);

  if (offers.length === 0) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <div className="relative h-48 bg-gradient-to-r from-primary to-accent overflow-hidden">
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {offers.map((offer) => (
          <div key={offer.id} className="min-w-full h-full flex items-center justify-center relative">
            {offer.image && (
              <img 
                src={offer.image} 
                alt={offer.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="text-center text-white z-10 px-4">
              <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
              {offer.description && (
                <p className="text-white/90">{offer.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersCarousel;
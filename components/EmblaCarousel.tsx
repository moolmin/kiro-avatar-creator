'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Atom-like logo component inspired by Embla Carousel's logotype
const AtomLogo = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Nucleus */}
    <circle cx="50" cy="50" r="8" fill="currentColor" className="opacity-80"/>
    
    {/* Electron orbits */}
    <ellipse cx="50" cy="50" rx="25" ry="15" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-60"/>
    <ellipse cx="50" cy="50" rx="25" ry="15" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-60" transform="rotate(60 50 50)"/>
    <ellipse cx="50" cy="50" rx="25" ry="15" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-60" transform="rotate(120 50 50)"/>
    
    {/* Electrons */}
    <circle cx="75" cy="50" r="3" fill="currentColor" className="opacity-90">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="35" cy="65" r="3" fill="currentColor" className="opacity-90">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="60 50 50"
        to="420 50 50"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="65" cy="35" r="3" fill="currentColor" className="opacity-90">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="120 50 50"
        to="480 50 50"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

// Example data with atom illustrations
const avatarExamples = [
  { id: 1, name: 'Classic Ghost', description: 'Traditional spooky design' },
  { id: 2, name: 'Witch Ghost', description: 'Magical and mysterious' },
  { id: 3, name: 'Friendly Ghost', description: 'Cute and approachable' },
  { id: 4, name: 'Cool Ghost', description: 'Hip and trendy style' },
  { id: 5, name: 'Party Ghost', description: 'Ready for Halloween fun' },
  { id: 6, name: 'Royal Ghost', description: 'Elegant and sophisticated' },
  { id: 7, name: 'Tech Ghost', description: 'Modern and futuristic' },
];

export default function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-md mx-auto">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {avatarExamples.map((example) => (
            <div
              key={example.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="bg-primary-purple/10 rounded-xl border-2 border-dashed border-primary-purple/30 p-8 text-center hover:bg-primary-purple/15 transition-colors duration-300 mx-2">
                <AtomLogo className="w-20 h-20 text-primary-purple/70 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">{example.name}</h3>
                <p className="text-sm text-gray-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-purple z-10"
        onClick={scrollPrev}
        aria-label="Previous avatar examples"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-purple z-10"
        onClick={scrollNext}
        aria-label="Next avatar examples"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
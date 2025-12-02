/**
 * Avatar Maker Page
 * 
 * The main avatar maker page with all customization functionality.
 * Integrates all major components with a responsive layout:
 * - Desktop (≥768px): Sidebar layout with customization panel on the left
 * - Mobile (<768px): Bottom sheet layout with customization panel below
 * 
 * Requirements: 9.1, 9.2, 9.3, 12.2
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import AvatarCanvas from '@/components/AvatarCanvas';
import TabbedCustomizationPanel from '@/components/TabbedCustomizationPanel';
import RandomButton from '@/components/controls/RandomButton';
import ErrorBoundary from '@/components/ErrorBoundary';
import CompatibilityWarning from '@/components/CompatibilityWarning';
import { preloadCategorySvgs } from '@/lib/svgLoader';

export default function AvatarMaker() {
  const canvasRef = useRef<SVGSVGElement>(null!);
  const [isLoading, setIsLoading] = useState(true);

  // Preload all assets before showing the maker
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const preloadAssets = async () => {
      try {
        // Preload all assets including PNG images
        await Promise.all([
          // Ghost body SVG
          fetch('/ghost-parts/kiro-body.svg'),
          // Eyes
          ...['eyes-01', 'eyes-02', 'eyes-03', 'eyes-04', 'eyes-05', 'eyes-06', 'eyes-07'].map(id => 
            preloadImage(`/ghost-parts/eyes/${id}.png`)
          ),
          // Hats
          ...['hat-01', 'hat-02', 'hat-03', 'hat-04', 'hat-05', 'hat-06'].map(id => 
            preloadImage(`/ghost-parts/hats/${id}.png`)
          ),
          // Capes
          ...['capes-01', 'capes-02', 'capes-03', 'capes-04'].map(id => 
            preloadImage(`/ghost-parts/capes/${id}.png`)
          ),
          // Accessories
          ...['accessories-01', 'accessories-02', 'accessories-03', 'accessories-04', 'accessories-05', 'accessories-06', 'accessories-07', 'accessories-08', 'accessories-09', 'accessories-10'].map(id => 
            preloadImage(`/ghost-parts/accessories/${id}.png`)
          ),
          // Backgrounds
          ...['background-00', 'background-01', 'background-02', 'background-03', 'background-04', 'background-05'].map(id => 
            preloadImage(`/ghost-parts/backgrounds/${id}.png`)
          ),
        ]);
      } catch (error) {
        console.warn('Some assets failed to preload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadAssets();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-halloween-gradient">
        <div className="flex flex-col items-center gap-6">
          {/* Floating Kiro Ghost */}
          <div className="animate-float">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="96" 
              viewBox="0 0 20 24" 
              fill="none"
              className="drop-shadow-lg"
            >
              <path 
                d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z" 
                fill="white" 
              />
              <path 
                d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z" 
                fill="black" 
                className="animate-blink"
              />
              <path 
                d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z" 
                fill="black" 
                className="animate-blink"
              />
            </svg>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <p className="text-xl font-medium text-gray-800 animate-pulse">Loading Avatar Maker...</p>
            <p className="text-sm text-gray-600 mt-2">Preparing your kiroween canvas</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-halloween-gradient">
      {/* Browser Compatibility Warning */}
      <CompatibilityWarning />
      
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#avatar-preview" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-halloween-orange-500 focus:text-white focus:rounded-lg focus:shadow-lg focus:ring-4 focus:ring-halloween-orange-300"
      >
        Skip to avatar preview
      </a>

      {/* Desktop Layout (≥768px): Canvas Left, Customization Right */}
      <div className="hidden md:grid md:grid-cols-2 h-screen">
        {/* Left Content - Avatar Preview and Actions */}
        <div className="flex flex-col items-center justify-center p-8 gap-8">
          {/* Avatar Preview */}
          <section id="avatar-preview" className="w-full max-w-lg" aria-label="Avatar preview">
            <div className="bg-primary-purple rounded-xl aspect-square overflow-hidden">
              <ErrorBoundary>
                <AvatarCanvas
                  ref={canvasRef}
                  className="w-full h-full"
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* Action Buttons */}
          <nav className="flex gap-4 w-full max-w-lg justify-center" aria-label="Avatar actions">
            <RandomButton />
          </nav>
        </div>

        {/* Right Sidebar - Tabbed Customization Panel */}
        <aside className="bg-white overflow-hidden" aria-label="Customization sidebar">
          <TabbedCustomizationPanel className="h-full" svgRef={canvasRef} />
        </aside>
      </div>

      {/* Mobile Layout (<768px): Bottom Sheet */}
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        {/* Top - Avatar Preview */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 py-4">
          <section id="avatar-preview" className="w-full max-w-[280px]" aria-label="Avatar preview">
            <div className="bg-primary-purple rounded-xl aspect-square overflow-hidden">
              <ErrorBoundary>
                <AvatarCanvas
                  ref={canvasRef}
                  className="w-full h-full"
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* Action Buttons */}
          <nav className="flex gap-3 w-full max-w-[280px] mt-3 justify-center sm:block hidden" aria-label="Avatar actions">
            <RandomButton />
          </nav>
        </div>

        {/* Bottom - Tabbed Customization Panel */}
        <aside className="bg-white shadow-2xl rounded-t-3xl flex-1 flex flex-col border-t-4 min-h-0 overflow-hidden" aria-label="Customization panel">
          <TabbedCustomizationPanel svgRef={canvasRef} className="h-full flex flex-col" />
        </aside>
      </div>
    </main>
  );
}
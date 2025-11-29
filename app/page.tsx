/**
 * Main Application Page
 * 
 * The main page of the Halloween Ghost Avatar Maker application.
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

export default function Home() {
  const canvasRef = useRef<SVGSVGElement>(null!);
  const [isLoading, setIsLoading] = useState(true);

  // Preload all assets including PNG images
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
        // Preload the default ghost body SVG
        await fetch('/ghost-parts/kiro-body.svg');

        // Preload all PNG images
        const imagePromises = [
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
        ];

        await Promise.all(imagePromises);
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-halloween-purple-200 border-t-halloween-purple-600 mb-6"></div>
          <p className="text-xl font-medium text-gray-800">Loading Avatar Maker...</p>
          <p className="text-sm text-gray-600 mt-2">Preparing your spooky canvas 👻</p>
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

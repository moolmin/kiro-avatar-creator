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
import ExportButton from '@/components/ExportButton';
import RandomButton from '@/components/controls/RandomButton';
import ErrorBoundary from '@/components/ErrorBoundary';
import CompatibilityWarning from '@/components/CompatibilityWarning';
import { preloadCategorySvgs } from '@/lib/svgLoader';

export default function Home() {
  const canvasRef = useRef<SVGSVGElement>(null!);
  const [isLoading, setIsLoading] = useState(true);

  // Preload SVG files and initialize component registry
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload all SVG files for better performance
        await Promise.all([
          // Preload the default ghost body
          fetch('/ghost-parts/kiro-body.svg'),
          preloadCategorySvgs('eyes', ['eyes-01.svg', 'eyes-02.svg', 'eyes-03.svg', 'eyes-04.svg', 'eyes-06.svg', 'eyes-07.svg', 'eyes-08.svg']),
          preloadCategorySvgs('hats', ['hat-01.svg', 'hat-02.svg', 'hat-03.svg']),
          preloadCategorySvgs('capes', ['white-cape.svg', 'purple-cape.svg', 'black-cape.svg', 'capes-01.svg']),
          preloadCategorySvgs('accessories', ['none.svg', 'wand.svg', 'pumpkin-basket.svg', 'candy.svg']),
          preloadCategorySvgs('backgrounds', ['sparkles.svg', 'moon.svg', 'none.svg']),
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
          <nav className="flex gap-4 w-full max-w-2xl justify-left" aria-label="Avatar actions">
            <RandomButton />
            <ExportButton svgRef={canvasRef} />
          </nav>
        </div>

        {/* Right Sidebar - Tabbed Customization Panel */}
        <aside className="bg-white overflow-hidden" aria-label="Customization sidebar">
          <TabbedCustomizationPanel className="h-full" />
        </aside>
      </div>

      {/* Mobile Layout (<768px): Bottom Sheet */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Top - Avatar Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
          <section id="avatar-preview" className="w-full max-w-sm" aria-label="Avatar preview">
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
          <nav className="flex gap-3 w-full max-w-md mt-6" aria-label="Avatar actions">
            <div className="flex-1">
              <RandomButton />
            </div>
            <div className="flex-1">
              <ExportButton svgRef={canvasRef} />
            </div>
          </nav>
        </div>

        {/* Bottom - Tabbed Customization Panel */}
        <aside className="bg-white shadow-2xl rounded-t-3xl max-h-[60vh] overflow-hidden border-t-4 border-halloween-orange-500" aria-label="Customization panel">
          <TabbedCustomizationPanel />
        </aside>
      </div>
    </main>
  );
}

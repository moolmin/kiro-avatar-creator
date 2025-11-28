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
          preloadCategorySvgs('eyes', ['round-eyes.svg', 'happy-eyes.svg']),
          preloadCategorySvgs('hats', ['witch-hat.svg', 'pumpkin-hat.svg', 'none.svg']),
          preloadCategorySvgs('capes', ['white-cape.svg', 'purple-cape.svg', 'black-cape.svg']),
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

      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-halloween-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-halloween-gradient animate-pulse-slow">
            <span aria-hidden="true">🎃</span> Halloween Ghost Avatar Maker <span aria-hidden="true">👻</span>
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
            Create your spooky ghost avatar and share it with the world!
          </p>
        </div>
      </header>

      {/* Desktop Layout (≥768px): Canvas Left, Customization Right */}
      <div className="hidden md:grid md:grid-cols-[1fr_480px] h-[calc(100vh-120px)]">
        {/* Left Content - Avatar Preview and Actions */}
        <div className="flex flex-col items-center justify-center p-8 gap-8">
          {/* Avatar Preview */}
          <section id="avatar-preview" className="card-halloween w-full max-w-2xl hover-lift" aria-label="Avatar preview">
            <div className="bg-gradient-to-br from-halloween-orange-50 to-halloween-purple-50 rounded-xl p-8">
              <ErrorBoundary>
                <AvatarCanvas
                  ref={canvasRef}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* Action Button - Export only */}
          <nav className="flex gap-4 w-full max-w-2xl justify-center" aria-label="Avatar actions">
            <ExportButton svgRef={canvasRef} className="px-8" />
          </nav>
        </div>

        {/* Right Sidebar - Tabbed Customization Panel */}
        <aside className="bg-white shadow-2xl overflow-hidden border-l-4 border-halloween-purple-500" aria-label="Customization sidebar">
          <TabbedCustomizationPanel className="h-full" />
        </aside>
      </div>

      {/* Mobile Layout (<768px): Bottom Sheet */}
      <div className="md:hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Top - Avatar Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
          <section id="avatar-preview" className="card-halloween w-full max-w-md" aria-label="Avatar preview">
            <div className="bg-gradient-to-br from-halloween-orange-50 to-halloween-purple-50 rounded-xl p-4">
              <ErrorBoundary>
                <AvatarCanvas
                  ref={canvasRef}
                  className="w-full h-auto drop-shadow-xl"
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* Export Button */}
          <nav className="flex gap-3 w-full max-w-md mt-6 justify-center" aria-label="Avatar actions">
            <ExportButton svgRef={canvasRef} className="px-8" />
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

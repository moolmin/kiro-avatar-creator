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
import CustomizationPanel from '@/components/CustomizationPanel';
import ExportButton from '@/components/ExportButton';
import RandomButton from '@/components/controls/RandomButton';

export default function Home() {
  const canvasRef = useRef<SVGSVGElement>(null!);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading (for component registry initialization)
  useEffect(() => {
    // Small delay to ensure all components are mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
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
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-halloween-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-halloween-gradient animate-pulse-slow">
            🎃 Halloween Ghost Avatar Maker 👻
          </h1>
          <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
            Create your spooky ghost avatar and share it with the world!
          </p>
        </div>
      </header>

      {/* Desktop Layout (≥768px): Sidebar */}
      <div className="hidden md:grid md:grid-cols-[420px_1fr] h-[calc(100vh-120px)]">
        {/* Left Sidebar - Customization Panel */}
        <aside className="bg-white shadow-2xl overflow-hidden border-r-4 border-halloween-purple-500">
          <CustomizationPanel />
        </aside>

        {/* Right Content - Avatar Preview and Actions */}
        <div className="flex flex-col items-center justify-center p-8 gap-8">
          {/* Avatar Preview */}
          <div className="card-halloween w-full max-w-2xl hover-lift">
            <div className="bg-gradient-to-br from-halloween-orange-50 to-halloween-purple-50 rounded-xl p-8">
              <AvatarCanvas
                ref={canvasRef}
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-2xl">
            <div className="flex-1">
              <RandomButton />
            </div>
            <div className="flex-1">
              <ExportButton svgRef={canvasRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (<768px): Bottom Sheet */}
      <div className="md:hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Top - Avatar Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
          <div className="card-halloween w-full max-w-md">
            <div className="bg-gradient-to-br from-halloween-orange-50 to-halloween-purple-50 rounded-xl p-4">
              <AvatarCanvas
                ref={canvasRef}
                className="w-full h-auto drop-shadow-xl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-md mt-6">
            <div className="flex-1">
              <RandomButton />
            </div>
            <div className="flex-1">
              <ExportButton svgRef={canvasRef} />
            </div>
          </div>
        </div>

        {/* Bottom - Customization Panel */}
        <div className="bg-white shadow-2xl rounded-t-3xl max-h-[50vh] overflow-hidden border-t-4 border-halloween-orange-500">
          <CustomizationPanel />
        </div>
      </div>
    </main>
  );
}

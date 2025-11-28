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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-purple-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-lg text-gray-700">Loading Avatar Maker...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            🎃 Halloween Ghost Avatar Maker 👻
          </h1>
        </div>
      </header>

      {/* Desktop Layout (≥768px): Sidebar */}
      <div className="hidden md:grid md:grid-cols-[400px_1fr] h-[calc(100vh-80px)]">
        {/* Left Sidebar - Customization Panel */}
        <aside className="bg-white shadow-lg overflow-hidden">
          <CustomizationPanel />
        </aside>

        {/* Right Content - Avatar Preview and Actions */}
        <div className="flex flex-col items-center justify-center p-8 gap-6">
          {/* Avatar Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
            <AvatarCanvas
              ref={canvasRef}
              className="w-full h-auto"
            />
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
      <div className="md:hidden flex flex-col h-[calc(100vh-80px)]">
        {/* Top - Avatar Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md">
            <AvatarCanvas
              ref={canvasRef}
              className="w-full h-auto"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-md mt-4">
            <div className="flex-1">
              <RandomButton />
            </div>
            <div className="flex-1">
              <ExportButton svgRef={canvasRef} />
            </div>
          </div>
        </div>

        {/* Bottom - Customization Panel */}
        <div className="bg-white shadow-lg rounded-t-3xl max-h-[50vh] overflow-hidden">
          <CustomizationPanel />
        </div>
      </div>
    </main>
  );
}

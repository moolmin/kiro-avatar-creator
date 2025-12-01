/**
 * SaveButton Component
 * 
 * A button that saves the current avatar configuration and navigates to the save page.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAvatarStore } from '@/lib/avatarStore';
import savedAvatarStore from '@/lib/savedAvatarStore';
import html2canvas from 'html2canvas';

export interface SaveButtonProps {
  svgRef: React.RefObject<SVGSVGElement>;
  className?: string;
}

/**
 * Convert image URL to base64 data URL
 */
async function imageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Convert all external image references in SVG to base64 data URLs
 */
async function embedImagesInSvg(svgElement: SVGSVGElement): Promise<SVGSVGElement> {
  const cloned = svgElement.cloneNode(true) as SVGSVGElement;
  const images = cloned.querySelectorAll('image');
  
  const promises = Array.from(images).map(async (img) => {
    const href = img.getAttribute('href') || img.getAttribute('xlink:href');
    if (href && !href.startsWith('data:')) {
      try {
        const base64 = await imageToBase64(href);
        img.setAttribute('href', base64);
        img.removeAttribute('xlink:href');
      } catch (error) {
        console.warn(`Failed to embed image: ${href}`, error);
      }
    }
  });
  
  await Promise.all(promises);
  return cloned;
}

export default function SaveButton({ svgRef, className = '' }: SaveButtonProps) {
  const router = useRouter();
  const { config } = useAvatarStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!svgRef.current || isSaving) {
      console.error('Avatar canvas not ready or already saving');
      return;
    }

    setIsSaving(true);

    try {
      // Wait a bit to ensure all SVG content is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a temporary container for rendering
      const container = document.createElement('div');
      container.style.width = '1024px';
      container.style.height = '1024px';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = 'transparent';
      
      // Clone the SVG and embed all external images as base64
      const clonedSvg = await embedImagesInSvg(svgRef.current);
      clonedSvg.setAttribute('width', '1024');
      clonedSvg.setAttribute('height', '1024');
      clonedSvg.style.width = '1024px';
      clonedSvg.style.height = '1024px';
      
      container.appendChild(clonedSvg);
      document.body.appendChild(container);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Convert to canvas using html2canvas
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
        width: 1024,
        height: 1024,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      // Clean up container
      document.body.removeChild(container);
      
      // Get data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Store in global store instead of sessionStorage
      savedAvatarStore.setSavedAvatar({
        image: dataUrl,
        config: config,
        timestamp: Date.now()
      });
      
      // Navigate to save page
      router.push('/maker/save');
    } catch (error) {
      console.error('Failed to save avatar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={className}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-2 md:px-4 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Save avatar"
        >
          {/* Mobile: Icon only */}
          <svg
            className="h-5 w-5 md:hidden"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          {/* Desktop: Text only */}
          <span className="hidden md:block text-sm font-semibold">
            {isSaving ? 'SAVING...' : 'SAVE'}
          </span>
        </button>
      </div>

      {/* Loading overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#E1D2F7] rounded-2xl px-16 py-8 flex flex-col items-center gap-4 shadow-2xl">
            {/* Floating Kiro Ghost */}
            <div className="animate-float">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="60" 
                height="72" 
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
            <p className="text-lg font-semibold text-gray-800 animate-pulse">Saving your avatar...</p>
          </div>
        </div>
      )}
    </>
  );
}
/**
 * SaveButton Component
 * 
 * A button that saves the current avatar configuration and navigates to the save page.
 */

'use client';

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

  const handleSave = async () => {
    if (!svgRef.current) {
      console.error('Avatar canvas not ready');
      return;
    }

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
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleSave}
        className="px-3 py-2 md:px-4 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
        aria-label="Save avatar"
      >
        {/* Mobile: Icon only */}
        <svg
          className="h-5 w-5 md:hidden"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        {/* Desktop: Text only */}
        <span className="hidden md:block text-sm font-semibold">
          SAVE
        </span>
      </button>
    </div>
  );
}
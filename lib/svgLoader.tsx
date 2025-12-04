/**
 * SVG Loader Utility
 * 
 * Automatically loads SVG files from category folders and converts them
 * to React components. This eliminates the need to manually create
 * component files for each SVG asset.
 * 
 * Usage:
 * 1. Place SVG files in public/ghost-parts/{category}/ folder
 * 2. Name files descriptively (e.g., round-eyes.svg, happy-eyes.svg)
 * 3. Import this utility in your category index.ts file
 * 4. Call createSvgRegistryFromFiles() with the list of SVG filenames
 * 
 * Example:
 * // components/GhostParts/Eyes/index.ts
 * import { createSvgRegistryFromFiles } from '@/lib/svgLoader';
 * export const registry = createSvgRegistryFromFiles('eyes', [
 *   'round-eyes.svg',
 *   'happy-eyes.svg',
 * ]);
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ComponentRegistryEntry, GhostPartProps } from './types';

/**
 * Convert kebab-case filename to Title Case label
 * @example "round-eyes" -> "Round Eyes"
 */
export function filenameToLabel(filename: string): string {
  return filename
    .replace(/\.(svg|png)$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert filename to ID (remove .svg or .png extension)
 * @example "round-eyes.svg" -> "round-eyes"
 * @example "round-eyes.png" -> "round-eyes"
 */
export function filenameToId(filename: string): string {
  return filename.replace(/\.(svg|png)$/, '');
}



/**
 * SVG content with viewBox metadata
 */
interface SvgContentData {
  content: string;
  viewBox: string | null;
}

/**
 * Cache for loaded SVG content with viewBox info
 */
const svgDataCache: Record<string, SvgContentData> = {};

/**
 * Load SVG content and cache it with viewBox information
 */
async function loadSvgContent(svgPath: string): Promise<SvgContentData> {
  if (svgDataCache[svgPath]) {
    return svgDataCache[svgPath];
  }

  try {
    const response = await fetch(svgPath);
    const text = await response.text();
    
    // Parse the SVG to extract content and viewBox
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('Invalid SVG file');
    }
    
    // Get the inner HTML and viewBox attribute
    const innerContent = svgElement.innerHTML;
    const viewBox = svgElement.getAttribute('viewBox');
    
    const data = { content: innerContent, viewBox };
    svgDataCache[svgPath] = data;
    
    return data;
  } catch (error) {
    console.error(`Failed to load SVG: ${svgPath}`, error);
    return { content: '', viewBox: null };
  }
}

/**
 * Calculate transform to normalize SVG to 1024x1024 coordinate system
 * 
 * @param viewBox - ViewBox string (e.g., "0 0 852 570")
 * @returns Transform string to normalize the SVG
 */
function calculateNormalizationTransform(viewBox: string | null, svgPath?: string): string {
  if (!viewBox) return '';
  
  const parts = viewBox.trim().split(/\s+/);
  if (parts.length !== 4) return '';
  
  const [minX, minY, width, height] = parts.map(Number);
  
  // If already 1024x1024, no transform needed
  if (width === 1024 && height === 1024 && minX === 0 && minY === 0) {
    return '';
  }
  
  // Calculate scale to fit into 1024x1024 while maintaining aspect ratio
  const scale = Math.min(1024 / width, 1024 / height);
  
  // Calculate translation to center the content
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const translateX = (1024 - scaledWidth) / 2 - minX * scale;
  const translateY = (1024 - scaledHeight) / 2 - minY * scale;
  
  const transform = `translate(${translateX}, ${translateY}) scale(${scale})`;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SVG Transform] ${svgPath}`, {
      viewBox,
      originalSize: { width, height },
      scale,
      translate: { x: translateX, y: translateY },
      transform
    });
  }
  
  return transform;
}

/**
 * Create a React component that renders an SVG or PNG from the public folder
 * 
 * Optimized with React.memo to prevent unnecessary re-renders when props haven't changed.
 * 
 * @param category - Category name (e.g., 'eyes', 'mouths')
 * @param filename - SVG or PNG filename (e.g., 'round-eyes.svg', 'eyes-01.png')
 * @returns React component that renders the content
 */
export function createSvgComponent(
  category: string,
  filename: string
): React.ComponentType<GhostPartProps> {
  const filePath = `/ghost-parts/${category}/${filename}`;
  const isPng = filename.endsWith('.png');
  
  const SvgComponent = React.memo(({ className, style }: GhostPartProps) => {
    const [svgData, setSvgData] = useState<SvgContentData>({ content: '', viewBox: null });
    const [isLoading, setIsLoading] = useState(!isPng);
    
    useEffect(() => {
      if (isPng) {
        // PNG files don't need loading
        return;
      }
      
      loadSvgContent(filePath)
        .then(data => {
          setSvgData(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, []);
    
    // For PNG files, always use image element
    if (isPng) {
      return (
        <g className={className} style={style}>
          <image
            href={filePath}
            width="1024"
            height="1024"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      );
    }
    
    if (isLoading) {
      // Return empty group while loading
      return <g className={className} style={style} />;
    }
    
    if (!svgData.content) {
      // Fallback to image element if inline loading fails
      return (
        <g className={className} style={style}>
          <image
            href={filePath}
            width="1024"
            height="1024"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      );
    }
    
    // Render the SVG content inline
    return (
      <g 
        className={className} 
        style={style}
        dangerouslySetInnerHTML={{ __html: svgData.content }}
      />
    );
  }, (prevProps, nextProps) => {
    // Custom comparison - only re-render if className or style changes
    return (
      prevProps.className === nextProps.className &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    );
  });

  SvgComponent.displayName = `Svg(${category}/${filename})`;
  return SvgComponent;
}

/**
 * Create registry entries from a list of SVG filenames
 * 
 * @param category - Category name (e.g., 'eyes', 'mouths')
 * @param filenames - Array of SVG filenames in public/ghost-parts/{category}/
 * @returns Array of ComponentRegistryEntry objects
 * 
 * @example
 * export const registry = createSvgRegistryFromFiles('eyes', [
 *   'round-eyes.svg',
 *   'happy-eyes.svg',
 * ]);
 */
export function createSvgRegistryFromFiles(
  category: string,
  filenames: string[]
): ComponentRegistryEntry[] {
  return filenames.map(filename => ({
    id: filenameToId(filename),
    label: filenameToLabel(filename),
    component: createSvgComponent(category, filename),
  }));
}

/**
 * Preload all SVG files for a category to populate cache
 * This can be called on app initialization to improve performance
 */
export async function preloadCategorySvgs(
  category: string,
  filenames: string[]
): Promise<void> {
  const promises = filenames.map(filename => {
    const svgPath = `/ghost-parts/${category}/${filename}`;
    return loadSvgContent(svgPath);
  });
  
  await Promise.all(promises);
}

/**
 * Clear the SVG cache (useful for development/testing)
 */
export function clearSvgCache(): void {
  Object.keys(svgDataCache).forEach(key => delete svgDataCache[key]);
}
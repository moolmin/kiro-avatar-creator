import html2canvas from 'html2canvas';
import download from 'downloadjs';

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

/**
 * Exports an SVG element as a PNG image with transparent background
 * @param svgElement - The SVG element to export
 * @throws Error if export fails
 */
export async function exportAvatarAsPNG(svgElement: SVGSVGElement): Promise<void> {
  try {
    // Wait a bit to ensure all SVG content is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.width = '1024px';
    container.style.height = '1024px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = 'transparent';
    
    // Clone the SVG and embed all external images as base64
    const clonedSvg = await embedImagesInSvg(svgElement);
    clonedSvg.setAttribute('width', '1024');
    clonedSvg.setAttribute('height', '1024');
    clonedSvg.style.width = '1024px';
    clonedSvg.style.height = '1024px';
    
    container.appendChild(clonedSvg);
    document.body.appendChild(container);
    
    try {
      // Wait for any dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Convert to canvas with transparent background
      const canvas = await html2canvas(container, {
        backgroundColor: null, // Transparent background
        scale: 2, // Higher quality
        width: 1024,
        height: 1024,
        logging: false,
        useCORS: true, // Enable CORS for external resources
        allowTaint: true, // Allow tainting the canvas with cross-origin images
      });
      
      // Generate filename with timestamp pattern
      const timestamp = Date.now();
      const filename = `kiroween-avatar-${timestamp}.png`;
      
      // Check if mobile device or iOS Safari
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isMobile || isSafari) {
        // On mobile/Safari, convert to blob and open in new tab with proper download support
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            
            // Try to open in new tab first
            const newTab = window.open(url, '_blank');
            
            if (!newTab) {
              // If popup blocked, create a link element for user to click
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.target = '_blank';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            
            // Clean up blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 5000);
          } else {
            throw new Error('Failed to create PNG blob');
          }
        }, 'image/png', 1.0);
      } else {
        // On desktop, trigger download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);
          } else {
            throw new Error('Failed to create PNG blob');
          }
        }, 'image/png', 1.0);
      }
    } finally {
      // Clean up temporary container
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error(
      `Failed to export avatar as PNG: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

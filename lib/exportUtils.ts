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
  // Check if mobile device first
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // For mobile: Simple approach - just open current canvas in new window
    let dataUrl = '';
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
      const clonedSvg = await embedImagesInSvg(svgElement);
      clonedSvg.setAttribute('width', '1024');
      clonedSvg.setAttribute('height', '1024');
      clonedSvg.style.width = '1024px';
      clonedSvg.style.height = '1024px';
      
      container.appendChild(clonedSvg);
      document.body.appendChild(container);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Convert to canvas
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
      dataUrl = canvas.toDataURL('image/png', 1.0);
      const filename = `kiroween-avatar-${Date.now()}.png`;
      
      // Open in new tab with a simple approach
      const newTab = window.open('about:blank', '_blank');
      if (newTab) {
        setTimeout(() => {
          newTab.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${filename}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f0f0f0; 
                    display: flex; 
                    flex-direction: column;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto; 
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  }
                  .instructions {
                    margin-top: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    text-align: center;
                    color: #333;
                  }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" alt="Kiroween Avatar">
                <div class="instructions">
                  <p><strong>To save this image:</strong></p>
                  <p>Long press the image and select "Save Image"</p>
                </div>
              </body>
            </html>
          `);
          newTab.document.close();
        }, 100);
      } else {
        // If popup blocked, show alert
        alert('Please allow popups to save the image');
      }
    } catch (error) {
      console.error('Mobile export failed:', error);
      // Fallback: try to open data URL directly if we have it
      if (dataUrl) {
        window.open(dataUrl, '_blank');
      }
    }
  } else {
    // Desktop: Keep original method
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const container = document.createElement('div');
      container.style.width = '1024px';
      container.style.height = '1024px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = 'transparent';
      
      const clonedSvg = await embedImagesInSvg(svgElement);
      clonedSvg.setAttribute('width', '1024');
      clonedSvg.setAttribute('height', '1024');
      clonedSvg.style.width = '1024px';
      clonedSvg.style.height = '1024px';
      
      container.appendChild(clonedSvg);
      document.body.appendChild(container);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const canvas = await html2canvas(container, {
          backgroundColor: null,
          scale: 2,
          width: 1024,
          height: 1024,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        const timestamp = Date.now();
        const filename = `kiroween-avatar-${timestamp}.png`;
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } finally {
        document.body.removeChild(container);
      }
    } catch (error) {
      console.error('PNG export failed:', error);
      throw new Error(
        `Failed to export avatar as PNG: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

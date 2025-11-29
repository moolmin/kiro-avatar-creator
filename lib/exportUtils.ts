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
      
      // Check if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile: Convert to blob and create object URL
        canvas.toBlob(async (blob) => {
          if (!blob) {
            throw new Error('Failed to create image blob');
          }
          
          // For iOS: Use native share API if available
          if (navigator.share && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            try {
              const file = new File([blob], filename, { type: 'image/png' });
              await navigator.share({
                files: [file],
                title: 'Kiroween Avatar',
              });
              return;
            } catch (err) {
              console.log('Share API failed, falling back to download');
            }
          }
          
          // For Android and fallback: Convert to data URL and open in new tab
          const reader = new FileReader();
          reader.onloadend = function() {
            const dataUrl = reader.result as string;
            
            // Create a temporary anchor element
            const tempLink = document.createElement('a');
            tempLink.href = dataUrl;
            tempLink.download = filename;
            tempLink.style.display = 'none';
            
            // Add to body, click, and remove
            document.body.appendChild(tempLink);
            tempLink.click();
            
            // Small delay before removing
            setTimeout(() => {
              document.body.removeChild(tempLink);
            }, 100);
            
            // If download didn't work, open in new window as fallback
            setTimeout(() => {
              const newWindow = window.open('', '_blank');
              if (newWindow) {
                newWindow.document.write(`
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
                newWindow.document.close();
              }
            }, 500);
          };
          reader.readAsDataURL(blob);
        }, 'image/png', 1.0);
      } else {
        // Desktop: Original download method
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

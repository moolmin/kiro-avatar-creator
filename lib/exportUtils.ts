import html2canvas from 'html2canvas';
import download from 'downloadjs';

/**
 * Exports an SVG element as a PNG image with transparent background
 * @param svgElement - The SVG element to export
 * @throws Error if export fails
 */
export async function exportAvatarAsPNG(svgElement: SVGSVGElement): Promise<void> {
  try {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.width = '1024px';
    container.style.height = '1024px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', '1024');
    clonedSvg.setAttribute('height', '1024');
    
    container.appendChild(clonedSvg);
    document.body.appendChild(container);
    
    try {
      // Convert to canvas with transparent background
      const canvas = await html2canvas(container, {
        backgroundColor: null, // Transparent background
        scale: 1,
        width: 1024,
        height: 1024,
        logging: false,
      });
      
      // Generate filename with timestamp pattern
      const timestamp = Date.now();
      const filename = `kiro-avatar-${timestamp}.png`;
      
      // Convert canvas to blob and trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          download(blob, filename, 'image/png');
        } else {
          throw new Error('Failed to create PNG blob');
        }
      }, 'image/png');
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

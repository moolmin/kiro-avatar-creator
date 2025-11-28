/**
 * Browser compatibility detection utilities
 * Detects support for required features: SVG and Canvas API
 */

export interface CompatibilityCheck {
  svg: boolean;
  canvas: boolean;
  isCompatible: boolean;
}

/**
 * Checks if the browser supports SVG rendering
 */
function checkSVGSupport(): boolean {
  if (typeof document === 'undefined') {
    return true; // SSR context, assume support
  }
  
  return !!(
    document.createElementNS &&
    document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
  );
}

/**
 * Checks if the browser supports Canvas API
 */
function checkCanvasSupport(): boolean {
  if (typeof document === 'undefined') {
    return true; // SSR context, assume support
  }
  
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
}

/**
 * Performs comprehensive browser compatibility check
 * @returns Object containing individual feature checks and overall compatibility
 */
export function checkBrowserCompatibility(): CompatibilityCheck {
  const svg = checkSVGSupport();
  const canvas = checkCanvasSupport();
  
  return {
    svg,
    canvas,
    isCompatible: svg && canvas,
  };
}

/**
 * Gets a user-friendly message describing compatibility issues
 */
export function getCompatibilityMessage(check: CompatibilityCheck): string {
  if (check.isCompatible) {
    return '';
  }
  
  const missing: string[] = [];
  if (!check.svg) missing.push('SVG rendering');
  if (!check.canvas) missing.push('Canvas API');
  
  return `Your browser doesn't support ${missing.join(' and ')}, which are required for this application. Please use a modern browser like Chrome, Firefox, Safari, or Edge.`;
}

/**
 * Avatar Canvas Component
 * 
 * Main rendering component that composes all SVG parts into a complete
 * ghost avatar. Uses the component registry to dynamically load and render
 * the selected customization options.
 * 
 * Layering order (bottom to top):
 * 1. Background
 * 2. Ghost Body
 * 3. Eyes
 * 4. Hat
 * 5. Accessory (except 07, 09, 10, 11)
 * 6. Cape
 * 7. Top Accessories (07, 09, 10, 11) - Top Layer
 * 
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 11.2
 */

'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { useAvatarStore } from '@/lib/avatarStore';
import { getComponent } from '@/lib/componentRegistry';
import { SVGComponentErrorBoundary } from './SVGComponentErrorBoundary';
import { getSVGTransform, transformToString } from '@/lib/componentTransforms';
import { AvatarConfiguration } from '@/lib/types';

/**
 * AvatarCanvas component props
 */
export interface AvatarCanvasProps {
  className?: string;
  configOverride?: AvatarConfiguration;
}

/**
 * AvatarCanvas component
 * 
 * Renders the complete ghost avatar by composing SVG components based on
 * the current configuration from the avatar store. The component uses a
 * consistent 1024x1024 viewBox coordinate system.
 * 
 * The ref is forwarded to the SVG element to enable export functionality.
 * 
 * @example
 * const canvasRef = useRef<SVGSVGElement>(null);
 * <AvatarCanvas ref={canvasRef} />
 */
export const AvatarCanvas = forwardRef<SVGSVGElement, AvatarCanvasProps>(
  ({ className, configOverride }, ref) => {
    // Get current configuration from store
    const storeConfig = useAvatarStore((state) => state.config);
    const config = configOverride ?? storeConfig;
    const [ghostBodyContent, setGhostBodyContent] = useState<string>('');

    // Load the default ghost body SVG
    useEffect(() => {
      const loadGhostBody = async () => {
        try {
          const response = await fetch('/ghost-parts/kiro-body.svg');
          const text = await response.text();
          
          // Parse the SVG to extract only the inner content
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const svgElement = doc.querySelector('svg');
          
          if (svgElement) {
            setGhostBodyContent(svgElement.innerHTML);
          }
        } catch (error) {
          console.error('Failed to load ghost body:', error);
        }
      };

      loadGhostBody();
    }, []);

    // Retrieve components from registry based on current configuration
    const BackgroundComponent = getComponent('backgrounds', config.background);
    const CapeComponent = config.cape ? getComponent('capes', config.cape) : null;
    const EyesComponent = getComponent('eyes', config.eyes);
    const HatComponent = config.hat ? getComponent('hats', config.hat) : null;
    const AccessoryComponent = config.accessory
      ? getComponent('accessories', config.accessory)
      : null;

    // Build descriptive label for screen readers
    const buildAriaLabel = () => {
      const parts: string[] = ['Customized ghost avatar with'];
      
      if (config.eyes) parts.push(config.eyes.replace(/-/g, ' '));
      if (config.hat) parts.push(`wearing ${config.hat.replace(/-/g, ' ')}`);
      if (config.cape) parts.push(`${config.cape.replace(/-/g, ' ')}`);
      if (config.accessory) parts.push(`holding ${config.accessory.replace(/-/g, ' ')}`);
      if (config.background && config.background !== 'none') {
        parts.push(`on ${config.background.replace(/-/g, ' ')} background`);
      }
      
      return parts.join(', ');
    };

    return (
      <svg
        ref={ref}
        viewBox="-64 -64 1152 1152"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={buildAriaLabel()}
      >
        {/* Layer 1: Background */}
        {config.background && config.background !== 'none' && (
          <SVGComponentErrorBoundary componentName={`background-${config.background}`}>
            <image
              href={`/ghost-parts/backgrounds/${config.background}.png`}
              x="-64"
              y="-64"
              width="1152"
              height="1152"
              preserveAspectRatio="xMidYMid slice"
              transform={transformToString(getSVGTransform('backgrounds', config.background))}
            />
          </SVGComponentErrorBoundary>
        )}

        {/* Layer 2: Ghost Body (Default) */}
        {ghostBodyContent && (
          <g 
            dangerouslySetInnerHTML={{ __html: ghostBodyContent }}
            transform={transformToString(getSVGTransform('ghostBody', 'kiro-body'))}
          />
        )}

        {/* Layer 3: Eyes */}
        {config.eyes && (
          <SVGComponentErrorBoundary componentName={`eyes-${config.eyes}`}>
            <image
              href={`/ghost-parts/eyes/${config.eyes}.png`}
              x="0"
              y="0"
              width="1024"
              height="1024"
              preserveAspectRatio="xMidYMid meet"
              transform={transformToString(getSVGTransform('eyes', config.eyes))}
            />
          </SVGComponentErrorBoundary>
        )}

        {/* Layer 4: Hat */}
        {config.hat && (
          <SVGComponentErrorBoundary componentName={`hat-${config.hat}`}>
            <image
              href={`/ghost-parts/hats/${config.hat}.png`}
              x="0"
              y="0"
              width="1024"
              height="1024"
              preserveAspectRatio="xMidYMid meet"
              transform={transformToString(getSVGTransform('hats', config.hat))}
            />
          </SVGComponentErrorBoundary>
        )}

        {/* Layer 5: Accessory (except 07, 09, 10, 11) */}
        {config.accessory && !['accessories-07', 'accessories-09', 'accessories-10', 'accessories-11'].includes(config.accessory) && (
          <SVGComponentErrorBoundary componentName={`accessory-${config.accessory}`}>
            <image
              href={`/ghost-parts/accessories/${config.accessory}.png`}
              x="0"
              y="0"
              width="1024"
              height="1024"
              preserveAspectRatio="xMidYMid meet"
              transform={transformToString(getSVGTransform('accessories', config.accessory))}
            />
          </SVGComponentErrorBoundary>
        )}

        {/* Layer 6: Cape */}
        {config.cape && (
          <SVGComponentErrorBoundary componentName={`cape-${config.cape}`}>
            <image
              href={`/ghost-parts/capes/${config.cape}.png`}
              x="0"
              y="0"
              width="1024"
              height="1024"
              preserveAspectRatio="xMidYMid meet"
              transform={transformToString(getSVGTransform('capes', config.cape))}
            />
          </SVGComponentErrorBoundary>
        )}

        {/* Layer 7: Top Accessories (07, 09, 10, 11) - Top Layer */}
        {config.accessory && ['accessories-07', 'accessories-09', 'accessories-10', 'accessories-11'].includes(config.accessory) && (
          <SVGComponentErrorBoundary componentName={`accessory-${config.accessory}`}>
            <image
              href={`/ghost-parts/accessories/${config.accessory}.png`}
              x="0"
              y="0"
              width="1024"
              height="1024"
              preserveAspectRatio="xMidYMid meet"
              transform={transformToString(getSVGTransform('accessories', config.accessory))}
            />
          </SVGComponentErrorBoundary>
        )}
      </svg>
    );
  }
);

AvatarCanvas.displayName = 'AvatarCanvas';

export default AvatarCanvas;

/**
 * Avatar Canvas Component
 * 
 * Main rendering component that composes all SVG parts into a complete
 * ghost avatar. Uses the component registry to dynamically load and render
 * the selected customization options.
 * 
 * Layering order (bottom to top):
 * 1. Background
 * 2. Cape
 * 3. Eyes
 * 4. Hat
 * 5. Accessory
 * 
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 11.2
 */

'use client';

import React, { forwardRef } from 'react';
import { useAvatarStore } from '@/lib/avatarStore';
import { getComponent } from '@/lib/componentRegistry';

/**
 * AvatarCanvas component props
 */
export interface AvatarCanvasProps {
  className?: string;
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
  ({ className }, ref) => {
    // Get current configuration from store
    const config = useAvatarStore((state) => state.config);

    // Retrieve components from registry based on current configuration
    const BackgroundComponent = getComponent('backgrounds', config.background);
    const CapeComponent = getComponent('capes', config.cape);
    const EyesComponent = getComponent('eyes', config.eyes);
    const HatComponent = config.hat ? getComponent('hats', config.hat) : null;
    const AccessoryComponent = config.accessory
      ? getComponent('accessories', config.accessory)
      : null;

    return (
      <svg
        ref={ref}
        viewBox="0 0 1024 1024"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Customized ghost avatar"
      >
        {/* Layer 1: Background */}
        {BackgroundComponent && <BackgroundComponent />}

        {/* Layer 2: Cape */}
        {CapeComponent && <CapeComponent />}

        {/* Layer 3: Eyes */}
        {EyesComponent && <EyesComponent />}

        {/* Layer 4: Hat */}
        {HatComponent && <HatComponent />}

        {/* Layer 5: Accessory */}
        {AccessoryComponent && <AccessoryComponent />}
      </svg>
    );
  }
);

AvatarCanvas.displayName = 'AvatarCanvas';

export default AvatarCanvas;

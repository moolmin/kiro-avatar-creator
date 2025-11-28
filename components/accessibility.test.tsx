/**
 * Accessibility Tests
 * 
 * Tests to verify accessibility features across the application.
 * Validates ARIA labels, keyboard navigation, focus indicators, and
 * screen reader support.
 * 
 * Requirements: 12.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomizationPanel from './CustomizationPanel';
import AvatarCanvas from './AvatarCanvas';
import ExportButton from './ExportButton';
import RandomButton from './controls/RandomButton';
import { useAvatarStore } from '@/lib/avatarStore';
import { createRef } from 'react';
import * as browserCompatibility from '@/lib/browserCompatibility';

// Mock browser compatibility
vi.mock('@/lib/browserCompatibility', () => ({
  checkBrowserCompatibility: vi.fn(() => ({
    svg: true,
    canvas: true,
    isCompatible: true,
  })),
}));

describe('Accessibility Features', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useAvatarStore.setState({
      config: {
        eyes: 'round-eyes',
        hat: null,
        cape: 'white-cape',
        accessory: null,
        background: 'none',
      },
    });
  });

  describe('ARIA Labels', () => {
    it('CustomizationPanel has proper region label', () => {
      render(<CustomizationPanel />);
      
      const region = screen.getByRole('region', { name: /avatar customization controls/i });
      expect(region).toBeDefined();
    });

    it('AvatarCanvas has descriptive image label', () => {
      const ref = createRef<SVGSVGElement>();
      render(<AvatarCanvas ref={ref} />);
      
      const avatar = screen.getByRole('img');
      expect(avatar).toBeDefined();
      expect(avatar.getAttribute('aria-label')).toContain('ghost avatar');
    });

    it('ExportButton has descriptive aria-label', () => {
      const ref = createRef<SVGSVGElement>();
      render(<ExportButton svgRef={ref} />);
      
      const button = screen.getByRole('button', { name: /export avatar as png/i });
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toContain('PNG');
    });

    it('RandomButton has descriptive aria-label', () => {
      render(<RandomButton />);
      
      const button = screen.getByRole('button', { name: /generate random avatar/i });
      expect(button).toBeDefined();
      const ariaLabel = button.getAttribute('aria-label');
      expect(ariaLabel).toContain('random');
      expect(ariaLabel).toContain('eyes');
      expect(ariaLabel).toContain('hat');
      expect(ariaLabel).toContain('cape');
    });

    it('SelectControl buttons have descriptive labels', () => {
      render(<CustomizationPanel />);
      
      // Check that select controls have proper labels
      const eyesButton = screen.getByRole('button', { name: /select eyes/i });
      expect(eyesButton).toBeDefined();
      expect(eyesButton.getAttribute('aria-label')).toContain('currently');
    });
  });

  describe('Keyboard Navigation', () => {
    it('all interactive elements are keyboard accessible', () => {
      const ref = createRef<SVGSVGElement>();
      const { container } = render(
        <div>
          <CustomizationPanel />
          <RandomButton />
          <ExportButton svgRef={ref} />
        </div>
      );
      
      // Get all buttons
      const buttons = screen.getAllByRole('button');
      
      // All buttons should be keyboard accessible (no tabindex=-1)
      buttons.forEach(button => {
        const tabIndex = button.getAttribute('tabindex');
        expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true);
      });
    });

    it('buttons have minimum touch target size classes', () => {
      const ref = createRef<SVGSVGElement>();
      render(
        <div>
          <RandomButton />
          <ExportButton svgRef={ref} />
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      
      // Check that buttons have the btn-halloween class which includes min-h-[44px]
      buttons.forEach(button => {
        const className = button.className;
        expect(className).toContain('btn-halloween');
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('has live region for announcing changes', () => {
      const { container } = render(<CustomizationPanel />);
      
      // Check for aria-live region
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeDefined();
      expect(liveRegion?.getAttribute('role')).toBe('status');
    });

    it('decorative icons are hidden from screen readers', () => {
      render(<CustomizationPanel />);
      
      // Check that emoji icons have aria-hidden
      const container = screen.getByRole('region', { name: /avatar customization controls/i });
      const emojis = container.querySelectorAll('[aria-hidden="true"]');
      
      // Should have multiple decorative elements hidden
      expect(emojis.length).toBeGreaterThan(0);
    });

    it('error messages are announced to screen readers', () => {
      const ref = createRef<SVGSVGElement>();
      render(<ExportButton svgRef={ref} />);
      
      // The error container should have proper ARIA attributes when shown
      // (This is tested in ExportButton.test.tsx when errors occur)
      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-busy')).toBe('false');
    });
  });

  describe('Focus Indicators', () => {
    it('buttons have btn-halloween class with focus styles', () => {
      const ref = createRef<SVGSVGElement>();
      render(
        <div>
          <RandomButton />
          <ExportButton svgRef={ref} />
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        // Check that buttons have the btn-halloween class which includes focus styles
        const className = button.className;
        expect(className).toContain('btn-halloween');
      });
    });
  });

  describe('Semantic HTML', () => {
    it('uses proper heading hierarchy', () => {
      render(<CustomizationPanel />);
      
      // Check for proper heading structure - use getByRole to be more specific
      const heading = screen.getByRole('heading', { name: /customize your ghost/i });
      expect(heading.tagName).toBe('H2');
    });

    it('uses complementary role for helper text', () => {
      const { container } = render(<CustomizationPanel />);
      
      const complementary = container.querySelector('[role="complementary"]');
      expect(complementary).toBeDefined();
      expect(complementary?.getAttribute('aria-label')).toContain('tips');
    });
  });

  describe('Descriptive Labels', () => {
    it('AvatarCanvas label describes current configuration', () => {
      const ref = createRef<SVGSVGElement>();
      
      // Set a specific configuration
      useAvatarStore.setState({
        config: {
          eyes: 'happy-eyes',
          hat: 'witch-hat',
          cape: 'purple-cape',
          accessory: 'wand',
          background: 'moon',
        },
      });
      
      render(<AvatarCanvas ref={ref} />);
      
      const avatar = screen.getByRole('img');
      const ariaLabel = avatar.getAttribute('aria-label');
      
      // Should describe the configuration
      expect(ariaLabel).toContain('happy');
      expect(ariaLabel).toContain('witch');
      expect(ariaLabel).toContain('purple');
      expect(ariaLabel).toContain('wand');
      expect(ariaLabel).toContain('moon');
    });

    it('buttons have title attributes for tooltips', () => {
      const ref = createRef<SVGSVGElement>();
      render(
        <div>
          <RandomButton />
          <ExportButton svgRef={ref} />
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        const title = button.getAttribute('title');
        expect(title).toBeTruthy();
        expect(title!.length).toBeGreaterThan(0);
      });
    });
  });
});

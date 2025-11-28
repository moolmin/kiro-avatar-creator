import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkBrowserCompatibility, getCompatibilityMessage } from './browserCompatibility';

describe('browserCompatibility', () => {
  describe('checkBrowserCompatibility', () => {
    it('should detect SVG support when available', () => {
      const result = checkBrowserCompatibility();
      
      // In a test environment with jsdom, SVG should be supported
      expect(result.svg).toBe(true);
    });

    it('should detect Canvas support correctly', () => {
      const result = checkBrowserCompatibility();
      
      // jsdom doesn't fully implement Canvas, so we just verify the check runs
      expect(typeof result.canvas).toBe('boolean');
    });

    it('should return a compatibility result object', () => {
      const result = checkBrowserCompatibility();
      
      expect(result).toHaveProperty('svg');
      expect(result).toHaveProperty('canvas');
      expect(result).toHaveProperty('isCompatible');
      expect(result.isCompatible).toBe(result.svg && result.canvas);
    });

    it('should handle SSR context gracefully', () => {
      // Save original document
      const originalDocument = global.document;
      
      // Simulate SSR by removing document
      // @ts-expect-error - Testing SSR scenario
      delete global.document;
      
      const result = checkBrowserCompatibility();
      
      // Should assume support in SSR context
      expect(result.svg).toBe(true);
      expect(result.canvas).toBe(true);
      expect(result.isCompatible).toBe(true);
      
      // Restore document
      global.document = originalDocument;
    });
  });

  describe('getCompatibilityMessage', () => {
    it('should return empty string when browser is compatible', () => {
      const check = {
        svg: true,
        canvas: true,
        isCompatible: true,
      };
      
      const message = getCompatibilityMessage(check);
      expect(message).toBe('');
    });

    it('should return message about missing SVG support', () => {
      const check = {
        svg: false,
        canvas: true,
        isCompatible: false,
      };
      
      const message = getCompatibilityMessage(check);
      expect(message).toContain('SVG rendering');
      expect(message).toContain('modern browser');
    });

    it('should return message about missing Canvas support', () => {
      const check = {
        svg: true,
        canvas: false,
        isCompatible: false,
      };
      
      const message = getCompatibilityMessage(check);
      expect(message).toContain('Canvas API');
      expect(message).toContain('modern browser');
    });

    it('should return message about both missing features', () => {
      const check = {
        svg: false,
        canvas: false,
        isCompatible: false,
      };
      
      const message = getCompatibilityMessage(check);
      expect(message).toContain('SVG rendering');
      expect(message).toContain('Canvas API');
      expect(message).toContain('and');
    });
  });
});

/**
 * AvatarCanvas Component Tests
 * 
 * Tests for the main avatar rendering component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AvatarCanvas } from './AvatarCanvas';

describe('AvatarCanvas', () => {
  it('renders an SVG element with correct viewBox', () => {
    const { container } = render(<AvatarCanvas />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 1024 1024');
  });

  it('renders with default configuration', () => {
    const { container } = render(<AvatarCanvas />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeTruthy();
    // Should have at least the background, cape, and eyes layers
    expect(svg?.children.length).toBeGreaterThan(0);
  });

  it('accepts className prop', () => {
    const { container } = render(<AvatarCanvas className="test-class" />);
    const svg = container.querySelector('svg');
    
    expect(svg?.classList.contains('test-class')).toBe(true);
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<AvatarCanvas />);
    const svg = container.querySelector('svg');
    
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as SVGSVGElement | null };
    render(<AvatarCanvas ref={ref} />);
    
    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName).toBe('svg');
  });
});

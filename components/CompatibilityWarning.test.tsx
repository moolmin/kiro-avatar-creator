import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CompatibilityWarning from './CompatibilityWarning';
import * as browserCompatibility from '@/lib/browserCompatibility';

// Mock the browser compatibility module
vi.mock('@/lib/browserCompatibility', () => ({
  checkBrowserCompatibility: vi.fn(),
  getCompatibilityMessage: vi.fn(),
}));

describe('CompatibilityWarning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when browser is compatible', () => {
    vi.mocked(browserCompatibility.checkBrowserCompatibility).mockReturnValue({
      svg: true,
      canvas: true,
      isCompatible: true,
    });

    const { container } = render(<CompatibilityWarning />);
    
    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it('should render warning when SVG is not supported', () => {
    vi.mocked(browserCompatibility.checkBrowserCompatibility).mockReturnValue({
      svg: false,
      canvas: true,
      isCompatible: false,
    });
    
    vi.mocked(browserCompatibility.getCompatibilityMessage).mockReturnValue(
      "Your browser doesn't support SVG rendering, which are required for this application."
    );

    render(<CompatibilityWarning />);
    
    expect(screen.getByText('Browser Compatibility Warning')).toBeTruthy();
    expect(screen.getByText('SVG rendering support')).toBeTruthy();
  });

  it('should render warning when Canvas is not supported', () => {
    vi.mocked(browserCompatibility.checkBrowserCompatibility).mockReturnValue({
      svg: true,
      canvas: false,
      isCompatible: false,
    });
    
    vi.mocked(browserCompatibility.getCompatibilityMessage).mockReturnValue(
      "Your browser doesn't support Canvas API, which are required for this application."
    );

    render(<CompatibilityWarning />);
    
    expect(screen.getByText('Browser Compatibility Warning')).toBeTruthy();
    expect(screen.getByText('Canvas API support')).toBeTruthy();
  });

  it('should be dismissible', () => {
    vi.mocked(browserCompatibility.checkBrowserCompatibility).mockReturnValue({
      svg: false,
      canvas: false,
      isCompatible: false,
    });
    
    vi.mocked(browserCompatibility.getCompatibilityMessage).mockReturnValue(
      "Your browser doesn't support SVG rendering and Canvas API."
    );

    const { container } = render(<CompatibilityWarning />);
    
    // Warning should be visible
    expect(screen.getByText('Browser Compatibility Warning')).toBeTruthy();
    
    // Click dismiss button
    const dismissButton = screen.getByLabelText('Dismiss warning');
    fireEvent.click(dismissButton);
    
    // Warning should be removed
    expect(container.firstChild).toBeNull();
  });

  it('should list missing features', () => {
    vi.mocked(browserCompatibility.checkBrowserCompatibility).mockReturnValue({
      svg: false,
      canvas: false,
      isCompatible: false,
    });
    
    vi.mocked(browserCompatibility.getCompatibilityMessage).mockReturnValue(
      "Your browser doesn't support SVG rendering and Canvas API."
    );

    render(<CompatibilityWarning />);
    
    expect(screen.getByText('Missing features:')).toBeTruthy();
    expect(screen.getByText('SVG rendering support')).toBeTruthy();
    expect(screen.getByText('Canvas API support')).toBeTruthy();
  });
});

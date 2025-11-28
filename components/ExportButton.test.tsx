/**
 * ExportButton Component Tests
 * 
 * Tests for the ExportButton component functionality including:
 * - Rendering and basic interaction
 * - Loading state during export
 * - Error handling and display
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportButton from './ExportButton';
import * as exportUtils from '@/lib/exportUtils';

// Mock the export utilities
vi.mock('@/lib/exportUtils', () => ({
  exportAvatarAsPNG: vi.fn(),
}));

describe('ExportButton', () => {
  let mockSvgRef: React.RefObject<SVGSVGElement>;

  beforeEach(() => {
    // Create a mock SVG element
    const mockSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockSvgRef = { current: mockSvgElement };
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('renders export button with correct text', () => {
    render(<ExportButton svgRef={mockSvgRef} />);
    
    expect(screen.getByRole('button', { name: /export avatar as png/i })).toBeTruthy();
    expect(screen.getByText('Export PNG')).toBeTruthy();
  });

  it('calls exportAvatarAsPNG when clicked', async () => {
    const mockExport = vi.mocked(exportUtils.exportAvatarAsPNG);
    mockExport.mockResolvedValue();

    render(<ExportButton svgRef={mockSvgRef} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockExport).toHaveBeenCalledWith(mockSvgRef.current);
    });
  });

  it('shows loading state during export', async () => {
    const mockExport = vi.mocked(exportUtils.exportAvatarAsPNG);
    // Create a promise that we can control
    let resolveExport: () => void;
    const exportPromise = new Promise<void>((resolve) => {
      resolveExport = resolve;
    });
    mockExport.mockReturnValue(exportPromise);

    render(<ExportButton svgRef={mockSvgRef} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeTruthy();
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    // Resolve the export
    resolveExport!();
    
    // Should return to normal state
    await waitFor(() => {
      expect(screen.getByText('Export PNG')).toBeTruthy();
      expect(button.hasAttribute('disabled')).toBe(false);
    });
  });

  it('displays error message when export fails', async () => {
    const mockExport = vi.mocked(exportUtils.exportAvatarAsPNG);
    mockExport.mockRejectedValue(new Error('Export failed'));

    render(<ExportButton svgRef={mockSvgRef} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(/export failed/i)).toBeTruthy();
    });

    // Button should be enabled again
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('shows error when SVG ref is null', async () => {
    const nullRef = { current: null };
    
    render(<ExportButton svgRef={nullRef} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(/avatar canvas not ready/i)).toBeTruthy();
    });
  });

  it('clears previous error when export is retried', async () => {
    const mockExport = vi.mocked(exportUtils.exportAvatarAsPNG);
    mockExport.mockRejectedValueOnce(new Error('First error'));
    mockExport.mockResolvedValueOnce();

    render(<ExportButton svgRef={mockSvgRef} />);
    
    const button = screen.getByRole('button');
    
    // First click - should fail
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/first error/i)).toBeTruthy();
    });

    // Second click - should succeed and clear error
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByText(/first error/i)).toBeNull();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ExportButton svgRef={mockSvgRef} className="custom-class" />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains('custom-class')).toBe(true);
  });
});

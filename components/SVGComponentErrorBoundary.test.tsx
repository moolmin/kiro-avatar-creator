/**
 * SVGComponentErrorBoundary Tests
 * 
 * Tests for the SVG-specific error boundary that provides graceful
 * fallback for individual SVG components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SVGComponentErrorBoundary } from './SVGComponentErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('SVG component error');
  }
  return <circle cx="50" cy="50" r="40" />;
};

describe('SVGComponentErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    const { container } = render(
      <svg>
        <SVGComponentErrorBoundary componentName="test-component">
          <circle cx="50" cy="50" r="40" data-testid="test-circle" />
        </SVGComponentErrorBoundary>
      </svg>
    );

    const circle = container.querySelector('[data-testid="test-circle"]');
    expect(circle).toBeTruthy();
  });

  it('renders fallback when an error occurs', () => {
    const { container } = render(
      <svg>
        <SVGComponentErrorBoundary componentName="broken-component">
          <ThrowError shouldThrow={true} />
        </SVGComponentErrorBoundary>
      </svg>
    );

    // Check for error indicator group
    const errorGroup = container.querySelector('[data-error-component="broken-component"]');
    expect(errorGroup).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <rect x="0" y="0" width="100" height="100" data-testid="custom-fallback" />;

    const { container } = render(
      <svg>
        <SVGComponentErrorBoundary 
          componentName="broken-component"
          fallbackComponent={customFallback}
        >
          <ThrowError shouldThrow={true} />
        </SVGComponentErrorBoundary>
      </svg>
    );

    const fallback = container.querySelector('[data-testid="custom-fallback"]');
    expect(fallback).toBeTruthy();
  });

  it('logs error with component name', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(
      <svg>
        <SVGComponentErrorBoundary componentName="test-component">
          <ThrowError shouldThrow={true} />
        </SVGComponentErrorBoundary>
      </svg>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    const errorCall = consoleErrorSpy.mock.calls.find(call => 
      call[0]?.includes('test-component')
    );
    expect(errorCall).toBeDefined();
  });
});

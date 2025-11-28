/**
 * SVG Component Error Boundary
 * 
 * Specialized error boundary for individual SVG components within the avatar.
 * Provides graceful fallback for missing or broken components while allowing
 * other parts of the avatar to render normally.
 * 
 * Requirements: Error handling
 */

'use client';

import React, { Component, ReactNode } from 'react';

interface SVGComponentErrorBoundaryProps {
  children: ReactNode;
  componentName: string;
  fallbackComponent?: ReactNode;
}

interface SVGComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * SVGComponentErrorBoundary component
 * 
 * Wraps individual SVG components to catch rendering errors without
 * breaking the entire avatar composition. Shows a placeholder when
 * a component fails to render.
 * 
 * @example
 * <SVGComponentErrorBoundary componentName="eyes">
 *   <EyesComponent />
 * </SVGComponentErrorBoundary>
 */
export class SVGComponentErrorBoundary extends Component<
  SVGComponentErrorBoundaryProps,
  SVGComponentErrorBoundaryState
> {
  constructor(props: SVGComponentErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SVGComponentErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error with component context
    console.error(
      `SVG Component Error in "${this.props.componentName}":`,
      error
    );
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Default fallback: render a placeholder indicator
      // This is an SVG element that can be composed with other parts
      return (
        <g data-error-component={this.props.componentName}>
          {/* Only show error indicator in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <>
              {/* Error indicator - small red circle */}
              <circle
                cx="512"
                cy="512"
                r="20"
                fill="rgba(239, 68, 68, 0.2)"
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
              />
              {/* Error icon - X mark */}
              <line
                x1="502"
                y1="502"
                x2="522"
                y2="522"
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="522"
                y1="502"
                x2="502"
                y2="522"
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      );
    }

    return this.props.children;
  }
}

export default SVGComponentErrorBoundary;

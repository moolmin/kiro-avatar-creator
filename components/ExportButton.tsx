/**
 * ExportButton Component
 * 
 * A button that exports the current avatar as a PNG image.
 * Connects to the exportAvatarAsPNG() function and handles loading
 * and error states during the export process.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 12.3
 */

'use client';

import { useState } from 'react';
import { exportAvatarAsPNG } from '@/lib/exportUtils';

export interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement>;
  className?: string;
}

export default function ExportButton({ svgRef, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    // Clear any previous errors
    setError(null);

    // Validate SVG ref
    if (!svgRef.current) {
      setError('Avatar canvas not ready. Please try again.');
      return;
    }

    setIsExporting(true);

    try {
      await exportAvatarAsPNG(svgRef.current);
      // Success - no need to show a message, download will start
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export avatar';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Auto-dismiss error after 5 seconds
  if (error) {
    setTimeout(() => setError(null), 5000);
  }

  return (
    <div className={className}>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white font-medium shadow-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isExporting ? 'Exporting avatar...' : 'Export avatar as PNG'}
      >
        {isExporting ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span>Export PNG</span>
          </>
        )}
      </button>

      {/* Error toast notification */}
      {error && (
        <div
          className="mt-2 rounded-lg bg-red-100 border border-red-400 px-4 py-3 text-red-700 text-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

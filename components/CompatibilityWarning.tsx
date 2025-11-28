'use client';

import { useEffect, useState } from 'react';
import { checkBrowserCompatibility, getCompatibilityMessage, type CompatibilityCheck } from '@/lib/browserCompatibility';

export default function CompatibilityWarning() {
  const [compatibility, setCompatibility] = useState<CompatibilityCheck | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check compatibility on mount (client-side only)
    const check = checkBrowserCompatibility();
    setCompatibility(check);
  }, []);

  // Don't render anything if compatible, not yet checked, or dismissed
  if (!compatibility || compatibility.isCompatible || dismissed) {
    return null;
  }

  const message = getCompatibilityMessage(compatibility);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-1">Browser Compatibility Warning</h2>
          <p className="text-sm">{message}</p>
          <div className="mt-2 text-xs opacity-90">
            <p>Missing features:</p>
            <ul className="list-disc list-inside mt-1">
              {!compatibility.svg && <li>SVG rendering support</li>}
              {!compatibility.canvas && <li>Canvas API support</li>}
            </ul>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors p-1"
          aria-label="Dismiss warning"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

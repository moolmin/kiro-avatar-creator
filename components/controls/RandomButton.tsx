/**
 * RandomButton Component
 * 
 * A button that triggers random avatar generation.
 * Connects to the randomize() action from the avatar store.
 * 
 * Requirements: 8.1, 8.2, 8.3
 */

'use client';

import { useAvatarStore } from '@/lib/avatarStore';
import { useState } from 'react';

export default function RandomButton() {
  const randomize = useAvatarStore((state) => state.randomize);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const handleRandomize = () => {
    setIsRandomizing(true);
    randomize();
    // Reset animation state after a brief moment
    setTimeout(() => setIsRandomizing(false), 300);
  };

  return (
    <button
      onClick={handleRandomize}
      className="px-6 py-3 flex items-center justify-center gap-3 group bg-transparent border-2 border-white text-white transition-all duration-250 rounded-lg font-medium"
      aria-label="Generate random avatar with random eyes, hat, cape, accessory, and background"
      title="Click to randomize all avatar options"
    >
      <svg
        className={`h-6 w-6 transition-transform duration-250 ${isRandomizing ? 'rotate-180' : 'group-hover:rotate-180'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-base font-semibold">Random</span>
    </button>
  );
}

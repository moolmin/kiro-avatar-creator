/**
 * Save Page
 *
 * Page that displays the saved avatar with download and retry options.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AvatarCanvas from "@/components/AvatarCanvas";
import ErrorBoundary from "@/components/ErrorBoundary";
import savedAvatarStore, {
  SAVED_AVATAR_STORAGE_KEY,
  SavedAvatar,
  restoreSavedAvatar,
} from "@/lib/savedAvatarStore";
import { exportAvatarAsPNG } from "@/lib/exportUtils";

type AvatarData = SavedAvatar | null;

export default function SavePage() {
  const router = useRouter();
  const canvasRef = useRef<SVGSVGElement>(null);
  const [avatarData, setAvatarData] = useState<AvatarData>(() =>
    typeof window === "undefined" ? null : restoreSavedAvatar()
  );
  const [isLoading, setIsLoading] = useState(() => avatarData === null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const data = restoreSavedAvatar();
    setAvatarData(data);
    setIsLoading(false);
  }, []);

  const handleDownload = async () => {
    if (!canvasRef.current) {
      alert("Avatar is not ready yet. Please try again in a moment.");
      return;
    }

    try {
      setIsDownloading(true);
      await exportAvatarAsPNG(canvasRef.current);
    } catch (error) {
      console.error("Failed to export avatar on save page:", error);
      alert("다운로드에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetry = () => {
    // Clear saved data and go back to maker
    savedAvatarStore.clearSavedAvatar();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SAVED_AVATAR_STORAGE_KEY);
    }
    router.push("/maker");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-halloween-gradient">
        <div className="flex flex-col items-center gap-6">
          {/* Floating Kiro Ghost */}
          <div className="animate-float">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="96"
              viewBox="0 0 20 24"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z"
                fill="white"
              />
              <path
                d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z"
                fill="black"
                className="animate-blink"
              />
              <path
                d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z"
                fill="black"
                className="animate-blink"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xl font-medium text-gray-800 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!avatarData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-halloween-gradient">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-800 mb-4">
            No avatar found
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary-purple text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Create Avatar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-halloween-gradient">
      {/* Header */}
      <header className="pt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="bg-primary-purple rounded-2xl shadow-lg px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="28"
                  viewBox="0 0 20 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z"
                    fill="white"
                  />
                  <path
                    d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z"
                    fill="black"
                  />
                  <path
                    d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z"
                    fill="black"
                  />
                </svg>
                <div className="relative h-8 w-auto flex items-center">
                  {/* Mobile logo */}
                  <Image
                    src="/kiroween-avatar-mobile.png"
                    alt="Kiroween Avatar"
                    width={300}
                    height={40}
                    className="h-8 w-auto object-contain md:hidden"
                    priority
                  />
                  {/* Desktop logo */}
                  <Image
                    src="/kiroween-avatar.png"
                    alt="Kiroween Avatar"
                    width={300}
                    height={40}
                    className="h-6 w-auto object-contain hidden md:block"
                    priority
                  />
                </div>
              </Link>

              {/* Try Kiro Button */}
              <a
                href="https://kiro.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-primary-purple text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-purple"
              >
                Try Kiro
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl w-full">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
              <div className="bg-primary-purple">
                <div className="w-full aspect-square">
                  <ErrorBoundary>
                    <AvatarCanvas
                      ref={canvasRef}
                      className="w-full h-full"
                      configOverride={avatarData.config}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary-purple text-white text-lg font-semibold rounded-xl transition-all duration-300 md:hover:bg-purple-700 md:hover:scale-105 md:hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                {isDownloading ? "Preparing..." : "Download PNG"}
              </button>

              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl border-2 border-gray-300 transition-all duration-300 md:hover:bg-gray-50 md:hover:scale-105 md:hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

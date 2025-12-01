/**
 * Main Landing Page
 * 
 * The main landing page for Kiroween Avatar Maker with hero section
 * and call-to-action to navigate to the avatar maker.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import EmblaCarousel from "@/components/EmblaCarousel";
import FeatureCard from "@/components/FeatureCard";
import { useAvatarStore } from "@/lib/avatarStore";
import savedAvatarStore, {
  SAVED_AVATAR_STORAGE_KEY,
} from "@/lib/savedAvatarStore";
import type { AvatarConfiguration } from "@/lib/types";

const RESET_AVATAR_CONFIG: AvatarConfiguration = {
  eyes: "eyes-01",
  hat: null,
  cape: null,
  accessory: null,
  background: "background-00",
};

export default function Home() {
  const updateAvatarConfig = useAvatarStore((state) => state.updateConfig);

  const handleStartCreatingClick = () => {
    updateAvatarConfig(RESET_AVATAR_CONFIG);
    savedAvatarStore.clearSavedAvatar();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SAVED_AVATAR_STORAGE_KEY);
    }
  };

  return (
    <main className="min-h-screen bg-halloween-gradient">
      {/* Header */}
      <header className="pt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="bg-primary-purple rounded-2xl shadow-lg px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 20 24" fill="none" className="flex-shrink-0">
                  <path d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z" fill="white" />
                  <path d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z" fill="black" />
                  <path d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z" fill="black" />
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
              </div>
              
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

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1100px] w-full mt-8">
          {/* Mobile: Center layout */}
          <div className="text-center lg:hidden">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-rounded">
              Create Your
              <span className="block text-primary-purple">Kiroween Avatar</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Design Kiroween avatar with easy-to-use customization tools. Mix and match to create your spooky Kiro.
            </p>

            {/* CTA Button */}
            <Link
              href="/maker"
              onClick={handleStartCreatingClick}
              className="inline-flex items-center px-8 py-4 bg-primary-purple text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Start Creating
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Avatar Examples */}
            <div className="mt-12 sm:mt-16">
              <EmblaCarousel />
            </div>
          </div>

          {/* Desktop: Left-right layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-8">
            {/* Left side - Text content */}
            <div className="text-left flex-1">
              <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 mb-6 font-rounded">
                Create Your
                <span className="block text-primary-purple">Kiroween Avatar</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-12 mr-8">
                Design Kiroween avatar with easy-to-use customization tools. Mix and match to create your spooky Kiro.
              </p>

              {/* CTA Button */}
              <Link
                href="/maker"
                onClick={handleStartCreatingClick}
                className="inline-flex items-center px-8 py-4 bg-primary-purple text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Start Creating
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right side - Avatar Examples */}
            <div className="flex-shrink-0">
              <EmblaCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-[1100px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-4">
            <FeatureCard
              icon={
                <Image 
                  src="/icons/fully.svg" 
                  alt="Fully Customizable" 
                  width={28} 
                  height={28}
                  className="w-7 h-7 brightness-0 invert"
                />
              }
              title="Fully Customizable"
              description="Customize your kiro costume and mix and match elements to create your own spooky avatar."
            />

            <FeatureCard
              icon={
                <Image 
                  src="/icons/multiple.svg" 
                  alt="Multiple Elements" 
                  width={28} 
                  height={28}
                  className="w-7 h-7 brightness-0 invert"
                />
              }
              title="Multiple Elements"
              description="Choose from eyes, hats, capes, accessories, and backgrounds for a variety of combinations."
            />

            <FeatureCard
              icon={
                <Image 
                  src="/icons/download.svg" 
                  alt="Download" 
                  width={28} 
                  height={28}
                  className="w-7 h-7 brightness-0 invert"
                />
              }
              title="Instant Download"
              description="Export your finished avatar as high-quality PNG with just one click"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="mx-auto max-w-[1280px] w-full">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Made with ❤️ by{' '}
              <a 
                href="https://github.com/moolmin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-purple font-medium border-b-2 border-dashed border-primary-purple hover:text-purple-700 hover:border-purple-700 transition-colors"
              >
                moolmin
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

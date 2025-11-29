/**
 * Tabbed Customization Panel Component
 * 
 * Provides a tabbed interface for avatar customization with image previews
 * for each option instead of text dropdowns.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAvatarStore } from '@/lib/avatarStore';
import { getCategoryOptions } from '@/lib/componentRegistry';
import { ComponentRegistryEntry } from '@/lib/types';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'eyes', label: 'Eyes', icon: '👀' },
  { id: 'hats', label: 'Hats', icon: '🎩' },
  { id: 'capes', label: 'Capes', icon: '🦇' },
  { id: 'accessories', label: 'Accessories', icon: '🍬' },
  { id: 'backgrounds', label: 'Backgrounds', icon: '🌙' },
];

interface CustomizationPanelProps {
  className?: string;
}

// Dummy component for "None" option
const NoneComponent = () => null;

export default function TabbedCustomizationPanel({ className = '' }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('eyes');
  const { config, updateConfig, randomize } = useAvatarStore();

  const renderOptionButton = (category: string, option: ComponentRegistryEntry, isNoneOption: boolean = false) => {
    // Map plural category names to singular config keys
    const configKey = (category === 'hats' ? 'hat' : 
                      category === 'capes' ? 'cape' :
                      category === 'accessories' ? 'accessory' :
                      category === 'backgrounds' ? 'background' : 
                      category) as keyof typeof config;
    
    const isSelected = isNoneOption 
      ? (!config[configKey] || config[configKey] === 'none' || config[configKey] === null)
      : config[configKey] === option.id;
    // Use PNG for eyes, hats, accessories, capes, and backgrounds, SVG for others
    const fileExtension = (category === 'eyes' || category === 'hats' || category === 'accessories' || category === 'capes' || category === 'backgrounds') ? 'png' : 'svg';
    const imagePath = `/ghost-parts/${category}/${option.id}.${fileExtension}`;
    
    return (
      <button
        key={option.id}
        onClick={() => {
          if (isNoneOption) {
            // For optional categories, set to null
            updateConfig({ [configKey]: null });
          } else {
            updateConfig({ [configKey]: option.id });
          }
        }}
        className={`
          relative group rounded-xl p-3 transition-all duration-200 flex flex-col items-center justify-center
          ${isSelected 
            ? 'ring-2 ring-purple-500 bg-purple-50' 
            : 'ring-2 ring-gray-200 hover:ring-purple-300 bg-white hover:bg-purple-50'
          }
        `}
        aria-label={`Select ${option.label}`}
        aria-pressed={isSelected}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-1">
          {isNoneOption ? (
            <div className="text-4xl text-gray-400 flex items-center justify-center w-full h-full">∅</div>
          ) : (
            <img
              src={imagePath}
              alt={option.label}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
        <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-700 truncate text-center">
          {isNoneOption ? 'None' : option.label}
        </span>
      </button>
    );
  };

  const renderTabContent = () => {
    const options = getCategoryOptions(activeTab);
    const isOptionalCategory = ['hats', 'accessories', 'capes'].includes(activeTab);
    
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 p-4">
        {/* Add "none" option for optional categories */}
        {isOptionalCategory && (
          renderOptionButton(activeTab, { id: 'none', label: 'None', component: NoneComponent }, true)
        )}
        {/* Render actual options, filtering out 'none.svg' files */}
        {options
          .filter(option => option.id !== 'none')
          .map((option) => renderOptionButton(activeTab, option, false))
        }
      </div>
    );
  };

  return (
    <div className={`bg-white overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-primary-purple">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z" fill="white" />
            <path d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z" fill="black" />
            <path d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z" fill="black" />
          </svg>
          <div className="relative h-6 sm:h-8 w-auto flex items-center">
            <Image 
              src="/kiroween-avatar.png" 
              alt="Kiroween Avatar" 
              width={300}
              height={40}
              className="!h-6 !sm:h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-2 sm:px-6 py-3 sm:py-6 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'text-purple-700 bg-white shadow-sm relative z-10'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="block text-xl sm:text-3xl mb-1 sm:mb-2">{tab.icon}</span>
            <span className="hidden sm:block text-xs sm:text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 h-[500px] sm:h-[550px] overflow-y-auto bg-white">
        {renderTabContent()}
      </div>
    </div>
  );
}
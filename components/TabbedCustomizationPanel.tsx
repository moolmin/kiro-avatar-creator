/**
 * Tabbed Customization Panel Component
 * 
 * Provides a tabbed interface for avatar customization with image previews
 * for each option instead of text dropdowns.
 */

'use client';

import React, { useState } from 'react';
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
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">kiro</h1>
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
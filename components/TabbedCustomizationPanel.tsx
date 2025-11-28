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

export default function TabbedCustomizationPanel({ className = '' }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('eyes');
  const { config, updateConfig, randomize } = useAvatarStore();

  const renderOptionButton = (category: string, option: ComponentRegistryEntry, isNoneOption: boolean = false) => {
    // Map plural category names to singular config keys
    const configKey = category === 'hats' ? 'hat' : 
                      category === 'capes' ? 'cape' :
                      category === 'accessories' ? 'accessory' :
                      category === 'backgrounds' ? 'background' : 
                      category;
    
    const isSelected = isNoneOption 
      ? (!config[configKey] || config[configKey] === 'none' || config[configKey] === null)
      : config[configKey] === option.id;
    const imagePath = `/ghost-parts/${category}/${option.id}.svg`;
    
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
            ? 'ring-4 ring-purple-500 bg-purple-50 shadow-lg scale-105' 
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
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  const renderTabContent = () => {
    const options = getCategoryOptions(activeTab);
    const isOptionalCategory = ['hats', 'accessories', 'backgrounds'].includes(activeTab);
    
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 p-4">
        {/* Add "none" option for optional categories */}
        {isOptionalCategory && (
          renderOptionButton(activeTab, { id: 'none', label: 'None', component: null } as ComponentRegistryEntry, true)
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
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4">
        <h2 className="text-white text-xl font-bold">Customize Your Ghost</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-1 sm:px-2 py-2 sm:py-3 text-sm font-medium transition-colors duration-200
              ${activeTab === tab.id
                ? 'text-purple-600 border-b-3 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="block text-lg sm:text-xl mb-0 sm:mb-1">{tab.icon}</span>
            <span className="hidden sm:block text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="h-[400px] overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Random Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={randomize}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🎲</span>
          <span>Randomize All</span>
        </button>
      </div>
    </div>
  );
}
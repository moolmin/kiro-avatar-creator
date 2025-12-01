/**
 * Tabbed Customization Panel Component
 *
 * Provides a tabbed interface for avatar customization with image previews
 * for each option instead of text dropdowns.
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAvatarStore } from "@/lib/avatarStore";
import { getCategoryOptions } from "@/lib/componentRegistry";
import { ComponentRegistryEntry } from "@/lib/types";
import SaveButton from "@/components/SaveButton";
import RandomButton from "@/components/controls/RandomButton";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "eyes",
    label: "Eyes",
    icon: (
      <svg
        viewBox="0 0 804 454"
        fill="currentColor"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <ellipse cx="159.5" cy="227" rx="159.5" ry="227" />
        <ellipse cx="644.5" cy="227" rx="159.5" ry="227" />
      </svg>
    ),
  },
  {
    id: "hats",
    label: "Hats",
    icon: (
      <svg
        viewBox="0 0 296.5 296.5"
        fill="currentColor"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M232.015,112.621c1.47,6.291,2.272,12.836,2.272,19.568v20.838c0,6.348-3.996,12.009-9.978,14.134c-14.469,5.141-39.409,11.27-76.059,11.27c-36.651,0-61.591-6.129-76.059-11.27c-5.981-2.126-9.977-7.786-9.977-14.134v-20.838c0-6.733,0.802-13.277,2.272-19.569C25.547,124.739,0,145.067,0,168.1c0,37.138,66.374,67.247,148.25,67.247c81.874,0,148.25-30.109,148.25-67.247C296.5,145.067,270.953,124.739,232.015,112.621z" />
        <path d="M77.214,132.189v20.838c16.379,5.82,40.257,10.404,71.036,10.404c30.779,0,54.657-4.584,71.036-10.404v-20.838c0-39.234-31.803-71.036-71.036-71.036C109.015,61.153,77.214,92.955,77.214,132.189z" />
      </svg>
    ),
  },
  {
    id: "capes",
    label: "Capes",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M14.43,3l-.29.49a2.5,2.5,0,0,1-4.29,0L9.57,3H6.76L2,5.38V11H6V21H18V11h4V5.38L17.24,3Z" />
      </svg>
    ),
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: (
      <svg
        viewBox="0 0 579.464 579.464"
        fill="currentColor"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M210.968,287.865l-85.411,118.248l65.27-2.283l18.299,62.647l82.855-114.71l82.855,114.71l18.299-62.647l65.27,2.283l-87.408-121.017c-0.977,10.912-10.159,19.501-21.322,19.501h-37.167h-41.046h-39.608C221.656,304.594,213.116,297.424,210.968,287.865z" />
        <path d="M210.433,273.443v-90.019C194.07,164.939,99.217,66.183,0.097,140.052v135.145c-0.171,1.193-1.138,11.2,9.722,20.529c10.128,8.703,27.023,13.051,50.576,13.051C95.737,308.774,145.545,293.14,210.433,273.443z" />
        <path d="M579.364,140.052c-95.542-71.206-187.131,17.99-208.267,41.074v92.941c63.871,19.397,113.006,34.704,147.973,34.707c23.55,0,40.443-4.345,50.575-13.051c10.86-9.33,9.894-19.336,9.722-20.529V140.052H579.364z" />
        <path d="M291.326,289.294h1.316h57.032c3.381,0,6.12-2.742,6.12-6.12v-19.128v-98.694c0-3.378-2.739-6.12-6.12-6.12H231.853c-3.381,0-6.12,2.742-6.12,6.12v102.072v15.75c0,3.378,2.739,6.12,6.12,6.12H291.326z" />
      </svg>
    ),
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M3,20V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H4A1,1,0,0,1,3,20Z" />
      </svg>
    ),
  },
];

interface CustomizationPanelProps {
  className?: string;
  svgRef?: React.RefObject<SVGSVGElement>;
}

// Dummy component for "None" option
const NoneComponent = () => null;

export default function TabbedCustomizationPanel({
  className = "",
  svgRef,
}: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("eyes");
  const { config, updateConfig } = useAvatarStore();

  const renderOptionButton = (
    category: string,
    option: ComponentRegistryEntry,
    isNoneOption: boolean = false
  ) => {
    // Map plural category names to singular config keys
    const configKey = (
      category === "hats"
        ? "hat"
        : category === "capes"
        ? "cape"
        : category === "accessories"
        ? "accessory"
        : category === "backgrounds"
        ? "background"
        : category
    ) as keyof typeof config;

    const isSelected = isNoneOption
      ? !config[configKey] ||
        config[configKey] === "none" ||
        config[configKey] === null
      : config[configKey] === option.id;
    // Use PNG for eyes, hats, accessories, capes, and backgrounds, SVG for others
    const fileExtension =
      category === "eyes" ||
      category === "hats" ||
      category === "accessories" ||
      category === "capes" ||
      category === "backgrounds"
        ? "png"
        : "svg";
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
          ${
            isSelected
              ? "ring-2 ring-purple-500 bg-purple-50"
              : "ring-2 ring-gray-200 hover:ring-purple-300 bg-white hover:bg-purple-50"
          }
        `}
        aria-label={`Select ${option.label}`}
        aria-pressed={isSelected}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-1">
          {isNoneOption ? (
            <div className="text-4xl text-gray-400 flex items-center justify-center w-full h-full">
              ∅
            </div>
          ) : (
            <img
              src={imagePath}
              alt={option.label}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
        <span className="sr-only">{isNoneOption ? "None" : option.label}</span>
      </button>
    );
  };

  const renderTabContent = () => {
    const options = getCategoryOptions(activeTab);
    const isOptionalCategory = ["hats", "accessories", "capes"].includes(
      activeTab
    );

    return (
      <>
        {/* Add "none" option for optional categories */}
        {isOptionalCategory &&
          renderOptionButton(
            activeTab,
            { id: "none", label: "None", component: NoneComponent },
            true
          )}
        {/* Render actual options, filtering out 'none.svg' files */}
        {options
          .filter((option) => option.id !== "none")
          .map((option) => renderOptionButton(activeTab, option, false))}
      </>
    );
  };

  return (
    <div className={`bg-white flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-primary-purple flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="24"
              viewBox="0 0 20 24"
              fill="none"
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
            <div className="relative h-6 sm:h-8 w-auto flex items-center">
              {/* Mobile logo */}
              <Image
                src="/kiroween-avatar-mobile.png"
                alt="Kiroween Avatar"
                width={300}
                height={40}
                className="!h-12 !sm:h-8 w-auto object-contain md:hidden"
                priority
              />
              {/* Desktop logo */}
              <Image
                src="/kiroween-avatar.png"
                alt="Kiroween Avatar"
                width={300}
                height={40}
                className="!h-6 !sm:h-8 w-auto object-contain hidden md:block"
                priority
              />
            </div>
          </div>
          {svgRef && (
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <RandomButton />
              </div>
              <SaveButton svgRef={svgRef} />
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-50 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-2 sm:px-6 py-3 sm:py-6 text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? "text-purple-700 bg-white shadow-sm relative z-10"
                  : "text-gray-600 hover:text-purple-600 hover:bg-gray-100"
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <div className="flex items-center justify-center">{tab.icon}</div>
            <span className="sr-only">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="flex-1 overflow-y-auto bg-white min-h-0 p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 pb-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

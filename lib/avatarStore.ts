/**
 * Avatar State Management with Zustand
 * 
 * Manages the current avatar configuration state and provides actions
 * for updating the configuration. Includes validation middleware to ensure
 * all configuration values are valid.
 * 
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1
 */

import { create } from 'zustand';
import { AvatarConfiguration } from './types';
import { hasComponent, getCategoryOptions } from './componentRegistry';

/**
 * Avatar store interface
 * Defines the state and actions available in the store
 */
interface AvatarStore {
  // Current avatar configuration
  config: AvatarConfiguration;
  
  // Update configuration with partial updates
  updateConfig: (updates: Partial<AvatarConfiguration>) => void;
  
  // Generate random avatar configuration
  randomize: () => void;
}

/**
 * Default avatar configuration
 * Uses the first available option from each category
 */
export const DEFAULT_AVATAR_CONFIG: AvatarConfiguration = {
  eyes: 'eyes-01',
  hat: null,
  cape: null,
  accessory: null,
  background: 'background-00',
};

/**
 * Validate a configuration value for a specific category
 * 
 * @param category - The asset category
 * @param value - The value to validate (can be null for nullable categories)
 * @returns The validated value, or a fallback if invalid
 */
function validateConfigValue(
  category: string,
  value: string | null,
  isNullable: boolean = false
): string | null {
  // Null or "none" is valid for nullable categories
  if (value === null || value === 'none') {
    if (isNullable) {
      return null;
    }
    // For non-nullable categories, fall back to first available option
    const options = getCategoryOptions(category);
    return options.length > 0 ? options[0].id : '';
  }
  
  // Check if the value exists in the registry
  if (hasComponent(category, value)) {
    return value;
  }
  
  // Invalid value - fall back to first available option
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[Avatar Store] Invalid ${category} value: "${value}". ` +
      `Falling back to default.`
    );
  }
  
  const options = getCategoryOptions(category);
  return options.length > 0 ? options[0].id : '';
}

/**
 * Validate an entire avatar configuration
 * Ensures all values are valid according to the component registry
 * 
 * @param config - The configuration to validate
 * @returns A validated configuration with fallbacks for invalid values
 */
function validateConfiguration(
  config: Partial<AvatarConfiguration>
): AvatarConfiguration {
  return {
    eyes: validateConfigValue('eyes', config.eyes ?? DEFAULT_AVATAR_CONFIG.eyes, false) as string,
    hat: validateConfigValue('hats', config.hat ?? DEFAULT_AVATAR_CONFIG.hat, true),
    cape: validateConfigValue('capes', config.cape ?? DEFAULT_AVATAR_CONFIG.cape, true),
    accessory: validateConfigValue('accessories', config.accessory ?? DEFAULT_AVATAR_CONFIG.accessory, true),
    background: validateConfigValue('backgrounds', config.background ?? DEFAULT_AVATAR_CONFIG.background, false) as string,
  };
}

/**
 * Generate a random valid option from a category
 * 
 * @param category - The asset category
 * @param allowNull - Whether null is a valid option
 * @returns A random option ID or null
 */
function getRandomOption(category: string, allowNull: boolean = false): string | null {
  const options = getCategoryOptions(category);
  
  if (options.length === 0) {
    return null;
  }
  
  // For nullable categories, randomly decide whether to include an option
  if (allowNull && Math.random() < 0.3) {
    return null;
  }
  
  // Select a random option from the available options
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].id;
}

/**
 * Avatar store
 * 
 * Provides centralized state management for the avatar configuration.
 * All updates go through validation middleware to ensure data integrity.
 */
export const useAvatarStore = create<AvatarStore>((set) => ({
  // Initial state
  config: { ...DEFAULT_AVATAR_CONFIG },
  
  /**
   * Update avatar configuration with partial updates
   * 
   * Merges the provided updates with the current configuration and
   * validates the result to ensure all values are valid.
   * 
   * @param updates - Partial configuration updates
   * 
   * @example
   * updateConfig({ eyes: 'happy-eyes' });
   * updateConfig({ hat: 'witch-hat', cape: 'purple-cape' });
   * updateConfig({ accessory: null }); // Remove accessory
   */
  updateConfig: (updates) => set((state) => {
    const newConfig = { ...state.config, ...updates };
    const validatedConfig = validateConfiguration(newConfig);
    
    return { config: validatedConfig };
  }),
  
  /**
   * Generate a random avatar configuration
   * 
   * Selects random valid options from each category. Hat and accessory
   * may be randomly set to null (30% chance each).
   * 
   * @example
   * randomize(); // Generates completely random avatar
   */
  randomize: () => set(() => {
    const randomConfig: AvatarConfiguration = {
      eyes: getRandomOption('eyes', false) as string,
      hat: getRandomOption('hats', true),
      cape: getRandomOption('capes', false) as string,
      accessory: getRandomOption('accessories', true),
      background: getRandomOption('backgrounds', false) as string,
    };
    
    // Validate the random configuration (should always be valid, but safety check)
    const validatedConfig = validateConfiguration(randomConfig);
    
    return { config: validatedConfig };
  }),

}));

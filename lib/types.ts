import React from 'react';

/**
 * Props interface for SVG component parts
 * Used by all ghost part components (eyes, mouths, bodies, etc.)
 */
export interface GhostPartProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Avatar configuration state
 * Represents all customization options for the ghost avatar
 */
export interface AvatarConfiguration {
  // Eyes
  eyes: string;
  
  // Hat (nullable - can be removed)
  hat: string | null;
  
  // Cape (nullable - can be removed)
  cape: string | null;
  
  // Accessory (nullable - can be removed)
  accessory: string | null;
  
  // Background
  background: string;
}

/**
 * Registry entry for a single component
 * Maps an option ID to its React component and display label
 */
export interface ComponentRegistryEntry {
  id: string;
  label: string;
  component: React.ComponentType<GhostPartProps>;
}

/**
 * Registry for all component categories
 * Maps category names to their component entries
 */
export interface CategoryRegistry {
  [categoryName: string]: ComponentRegistryEntry[];
}

/**
 * Utility type: Extract all valid option IDs from a category
 */
export type CategoryOptionId<T extends ComponentRegistryEntry[]> = T[number]['id'];

/**
 * Utility type: Extract component type from registry entry
 */
export type RegistryComponent = ComponentRegistryEntry['component'];

/**
 * Utility type: Partial avatar configuration for updates
 */
export type AvatarConfigUpdate = Partial<AvatarConfiguration>;

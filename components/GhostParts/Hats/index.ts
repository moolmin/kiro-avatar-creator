/**
 * Hats category registry
 * 
 * This file automatically loads all SVG files from public/ghost-parts/hats/
 * and creates registry entries for them.
 * 
 * To add new hat options:
 * 1. Add your SVG file to public/ghost-parts/hats/
 * 2. Add the filename to the svgFiles array below
 * 3. The system will automatically create the component and registry entry
 */

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all PNG files in the hats category
const svgFiles = [
  'hat-01.png',
  'hat-02.png',
  'hat-03.png',
  'hat-04.png',
  'hat-05.png',
  'hat-06.png',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('hats', svgFiles);

/**
 * Backgrounds category registry
 * 
 * This file automatically loads all SVG files from public/ghost-parts/backgrounds/
 * and creates registry entries for them.
 * 
 * To add new background options:
 * 1. Add your SVG file to public/ghost-parts/backgrounds/
 * 2. Add the filename to the svgFiles array below
 * 3. The system will automatically create the component and registry entry
 */

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all PNG files in the backgrounds category
const svgFiles = [
  'background-00.png',
  'background-01.png',
  'background-02.png',
  'background-03.png',
  'background-04.png',
  'background-05.png',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('backgrounds', svgFiles);

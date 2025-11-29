/**
 * Capes category registry
 * 
 * This file automatically loads all SVG files from public/ghost-parts/capes/
 * and creates registry entries for them.
 * 
 * To add new cape options:
 * 1. Add your SVG file to public/ghost-parts/capes/
 * 2. Add the filename to the svgFiles array below
 * 3. The system will automatically create the component and registry entry
 */

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all SVG files in the capes category
const svgFiles = [
  'white-cape.svg',
  'purple-cape.svg',
  'black-cape.svg',
  'capes-01.svg',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('capes', svgFiles);

/**
 * Eyes category registry
 * 
 * This file automatically loads all SVG files from public/ghost-parts/eyes/
 * and creates registry entries for them.
 * 
 * To add new eye options:
 * 1. Add your SVG file to public/ghost-parts/eyes/
 * 2. Add the filename to the svgFiles array below
 * 3. The system will automatically create the component and registry entry
 */

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all SVG files in the eyes category
const svgFiles = [
  'eyes-01.svg',
  'eyes-02.svg',
  'eyes-03.svg',
  'eyes-04.svg',
  'eyes-06.svg',
  'eyes-07.svg',
  'eyes-08.svg',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('eyes', svgFiles);

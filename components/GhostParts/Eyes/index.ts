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

// List all PNG files in the eyes category
const svgFiles = [
  'eyes-01.png',
  'eyes-02.png',
  'eyes-03.png',
  'eyes-04.png',
  'eyes-05.png',
  'eyes-06.png',
  'eyes-07.png',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('eyes', svgFiles);

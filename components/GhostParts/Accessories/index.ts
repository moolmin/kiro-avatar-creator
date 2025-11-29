import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all PNG files in the accessories category
const svgFiles = [
  'accessories-01.png',
  'accessories-02.png.png',
  'accessories-03.png.png',
  'accessories-04.png.png',
  'accessories-05.png',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('accessories', svgFiles);

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all PNG files in the accessories category
const svgFiles = [
  'accessories-01.png',
  'accessories-02.png',
  'accessories-03.png',
  'accessories-04.png',
  'accessories-05.png',
  'accessories-06.png',
  'accessories-07.png',
  'accessories-08.png',
  'accessories-09.png',
  'accessories-10.png',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('accessories', svgFiles);

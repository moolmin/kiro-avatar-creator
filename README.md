# Halloween Ghost Avatar Maker

A Next.js 14 application for creating customized ghost avatars for Halloween.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **html2canvas** - SVG to PNG conversion
- **@headlessui/react** - Accessible UI components
- **Vitest** - Fast unit testing framework
- **fast-check** - Property-based testing library

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components (to be created)
├── lib/                   # Utilities and shared logic (to be created)
├── public/                # Static assets
└── vitest.config.ts       # Test configuration
```

## Development Notes

- TypeScript is configured with strict mode enabled
- Path aliases use `@/*` for imports from the root directory
- Tailwind CSS v3 is configured for styling
- Vitest is set up for unit and property-based testing

---

## Adding New SVG Assets

The Halloween Ghost Avatar Maker uses an SVG file-based system that automatically converts SVG files into React components. This means you can add new customization options without writing any React code!

### Quick Start Guide

**3 Simple Steps to Add New Assets:**

1. **Add your SVG file** to the appropriate folder in `public/ghost-parts/{category}/`
2. **Register the filename** in the category's `index.ts` file
3. **Done!** The new option automatically appears in the UI

### Detailed Instructions

#### Step 1: Create Your SVG File

Place your SVG file in the appropriate category folder:

```
public/ghost-parts/
├── eyes/           # Eye variations
├── hats/           # Hat options (witch hat, pumpkin hat, etc.)
├── capes/          # Cape styles (white, purple, black, etc.)
├── accessories/    # Hand-held items (wand, basket, candy, etc.)
└── backgrounds/    # Background effects (sparkles, moon, etc.)
```

**SVG File Requirements:**
- **Filename format**: Use kebab-case (e.g., `round-eyes.svg`, `witch-hat.svg`)
- **ViewBox**: Must be `0 0 1024 1024` for proper scaling
- **File extension**: Must be `.svg`

**Filename Conventions:**
- The filename automatically becomes the display label
- `round-eyes.svg` → "Round Eyes" in the UI
- `witch-hat.svg` → "Witch Hat" in the UI
- `pumpkin-basket.svg` → "Pumpkin Basket" in the UI

#### Step 2: Register the SVG File

Add your filename to the appropriate category's `index.ts` file:

```
components/GhostParts/
├── Eyes/index.ts
├── Hats/index.ts
├── Capes/index.ts
├── Accessories/index.ts
└── Backgrounds/index.ts
```

**Example - Adding New Eyes:**

```typescript
// components/GhostParts/Eyes/index.ts
import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

const svgFiles = [
  'round-eyes.svg',
  'happy-eyes.svg',
  'sleepy-eyes.svg',  // ← Add your new file here!
];

export const registry = createSvgRegistryFromFiles('eyes', svgFiles);
```

**Example - Adding New Hats:**

```typescript
// components/GhostParts/Hats/index.ts
import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

const svgFiles = [
  'none.svg',
  'witch-hat.svg',
  'pumpkin-hat.svg',
  'wizard-hat.svg',  // ← Add your new file here!
];

export const registry = createSvgRegistryFromFiles('hats', svgFiles);
```

#### Step 3: Test Your Addition

1. Restart the development server (`npm run dev`)
2. Open the application in your browser
3. Your new option should appear in the appropriate dropdown
4. Select it to see it rendered on the ghost avatar

### SVG Coordinate System & Guidelines

All SVG assets use a consistent **1024x1024** coordinate system to ensure proper alignment and scaling.

#### Coordinate Reference Points

```
┌─────────────────────────────────────┐
│ (0,0)                               │
│                                     │
│           Ghost Center              │
│              (512, 512)             │
│                                     │
│  Eyes Area:     Y 350-450           │
│  Hat Area:      Y 150-350           │
│  Cape Area:     Y 400-900           │
│  Accessory:     X 400-600, Y 600-800│
│                                     │
│                        (1024, 1024) │
└─────────────────────────────────────┘
```

#### Category-Specific Guidelines

**Eyes** (`public/ghost-parts/eyes/`)
- Position: Y coordinates between 350-450
- Typical spacing: Left eye ~X 380, Right eye ~X 644
- Size: Radius 30-40 for circular eyes

```xml
<!-- Example: Round Eyes -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Left eye -->
  <circle cx="380" cy="420" r="35" fill="#000000" />
  
  <!-- Right eye -->
  <circle cx="644" cy="420" r="35" fill="#000000" />
</svg>
```

**Hats** (`public/ghost-parts/hats/`)
- Position: Y coordinates between 150-350 (top of ghost)
- Center horizontally around X 512
- Include `none.svg` for "no hat" option

```xml
<!-- Example: Simple Hat -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <path d="M 400 250 L 512 150 L 624 250 Z" fill="#8B4513" />
  <ellipse cx="512" cy="250" rx="120" ry="20" fill="#8B4513" />
</svg>
```

**Capes** (`public/ghost-parts/capes/`)
- Position: Y coordinates between 400-900 (body of ghost)
- Should flow behind the ghost body
- Use pre-designed colors and patterns

```xml
<!-- Example: Simple Cape -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <path d="M 300 450 Q 512 600 724 450 L 724 850 Q 512 900 300 850 Z" 
        fill="#FFFFFF" 
        opacity="0.8" />
</svg>
```

**Accessories** (`public/ghost-parts/accessories/`)
- Position: X 400-600, Y 600-800 (hand area)
- Items like wands, baskets, candy
- Include `none.svg` for "no accessory" option

```xml
<!-- Example: Magic Wand -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <line x1="450" y1="700" x2="500" y2="600" 
        stroke="#8B4513" stroke-width="8" />
  <polygon points="500,580 510,600 490,600" fill="#FFD700" />
</svg>
```

**Backgrounds** (`public/ghost-parts/backgrounds/`)
- Full canvas: Use entire 1024x1024 area
- Should not obscure the ghost (use subtle effects)
- Include `none.svg` for transparent background

```xml
<!-- Example: Sparkles Background -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="3" fill="#FFD700" opacity="0.6" />
  <circle cx="800" cy="300" r="4" fill="#FFD700" opacity="0.8" />
  <circle cx="300" cy="800" r="3" fill="#FFD700" opacity="0.7" />
  <!-- Add more sparkles as needed -->
</svg>
```

### Creating "None" Options

For optional categories (hats, accessories, backgrounds), create a `none.svg` file with an empty SVG:

```xml
<!-- none.svg - Empty/transparent option -->
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Intentionally empty -->
</svg>
```

### Advanced: Adding a New Category

To add an entirely new customization category (e.g., "shoes" or "wings"):

1. **Create the folder structure:**
   ```bash
   mkdir -p public/ghost-parts/shoes
   mkdir -p components/GhostParts/Shoes
   ```

2. **Create the category index:**
   ```typescript
   // components/GhostParts/Shoes/index.ts
   import { createSvgRegistryFromFiles } from '@/lib/svgLoader';
   
   const svgFiles = [
     'sneakers.svg',
     'boots.svg',
   ];
   
   export const registry = createSvgRegistryFromFiles('shoes', svgFiles);
   ```

3. **Register in the component registry:**
   ```typescript
   // lib/componentRegistry.ts
   import * as Shoes from '@/components/GhostParts/Shoes';
   
   export const componentRegistry: CategoryRegistry = {
     // ... existing categories
     shoes: Shoes.registry,
   };
   ```

4. **Update the avatar configuration type:**
   ```typescript
   // lib/types.ts
   export interface AvatarConfiguration {
     // ... existing properties
     shoes: string | null;
   }
   ```

5. **Add to the UI and rendering logic** in `CustomizationPanel.tsx` and `AvatarCanvas.tsx`

### Troubleshooting

#### Problem: My new SVG doesn't appear in the dropdown

**Solutions:**
- ✅ Check that the SVG file is in the correct `public/ghost-parts/{category}/` folder
- ✅ Verify the filename is added to the `svgFiles` array in the category's `index.ts`
- ✅ Ensure the filename uses kebab-case and ends with `.svg`
- ✅ Restart the development server (`npm run dev`)
- ✅ Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)

#### Problem: SVG appears but is positioned incorrectly

**Solutions:**
- ✅ Verify your SVG uses `viewBox="0 0 1024 1024"`
- ✅ Check that coordinates follow the category guidelines (see Coordinate Reference Points above)
- ✅ Test your SVG in isolation by opening it directly in a browser
- ✅ Use the browser's developer tools to inspect the rendered SVG

#### Problem: SVG appears distorted or scaled incorrectly

**Solutions:**
- ✅ Ensure `viewBox="0 0 1024 1024"` is set on the root `<svg>` element
- ✅ Remove any `width` or `height` attributes from the root `<svg>` element
- ✅ Check that paths and shapes use absolute coordinates, not percentages
- ✅ Verify the SVG doesn't have transforms that conflict with the coordinate system

#### Problem: SVG has wrong colors or styling

**Solutions:**
- ✅ Use explicit `fill` and `stroke` attributes on SVG elements
- ✅ Avoid external CSS stylesheets in SVG files
- ✅ Test colors in both light and dark modes if applicable
- ✅ Use hex color codes or named colors (e.g., `#000000` or `black`)

#### Problem: TypeScript errors after adding new category

**Solutions:**
- ✅ Update the `AvatarConfiguration` interface in `lib/types.ts`
- ✅ Add the category to `componentRegistry` in `lib/componentRegistry.ts`
- ✅ Update default values in `lib/avatarStore.ts`
- ✅ Run `npm run build` to check for type errors

#### Problem: SVG file is too large or complex

**Solutions:**
- ✅ Optimize SVG using tools like [SVGOMG](https://jakearchibald.github.io/svgomg/)
- ✅ Simplify paths and reduce the number of points
- ✅ Remove unnecessary metadata and comments
- ✅ Combine similar shapes where possible

### Best Practices

✅ **Keep it simple**: Start with basic shapes and gradually add detail  
✅ **Test early**: View your SVG in the browser after each change  
✅ **Use consistent naming**: Follow kebab-case for all filenames  
✅ **Document your work**: Add comments in complex SVG files  
✅ **Optimize file size**: Remove unnecessary elements and attributes  
✅ **Consider layering**: Remember that backgrounds render first, accessories last  
✅ **Maintain aspect ratio**: Keep designs centered around (512, 512)  

### Resources

- **SVG Tutorial**: [MDN SVG Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG)
- **SVG Optimizer**: [SVGOMG](https://jakearchibald.github.io/svgomg/)
- **SVG Editor**: [Figma](https://www.figma.com/), [Inkscape](https://inkscape.org/), or [Boxy SVG](https://boxy-svg.com/)
- **Color Picker**: [HTML Color Codes](https://htmlcolorcodes.com/)

### Examples by Category

The project includes example SVG files for each category. Study these to understand the coordinate system and styling:

- **Eyes**: `public/ghost-parts/eyes/round-eyes.svg`, `happy-eyes.svg`
- **Hats**: `public/ghost-parts/hats/witch-hat.svg`, `pumpkin-hat.svg`
- **Capes**: `public/ghost-parts/capes/white-cape.svg`, `purple-cape.svg`, `black-cape.svg`
- **Accessories**: `public/ghost-parts/accessories/wand.svg`, `pumpkin-basket.svg`, `candy.svg`
- **Backgrounds**: `public/ghost-parts/backgrounds/sparkles.svg`, `moon.svg`

---

## Architecture Overview

### Component Registry System

The application uses a registry pattern to map customization options to SVG components:

```typescript
// Automatic registration from SVG files
const registry = createSvgRegistryFromFiles('eyes', [
  'round-eyes.svg',
  'happy-eyes.svg',
]);

// Registry structure
[
  { id: 'round-eyes', label: 'Round Eyes', component: RoundEyesComponent },
  { id: 'happy-eyes', label: 'Happy Eyes', component: HappyEyesComponent },
]
```

### State Management

Zustand manages the avatar configuration state:

```typescript
interface AvatarConfiguration {
  eyes: string;
  hat: string | null;
  cape: string;
  accessory: string | null;
  background: string;
}
```

### Rendering Pipeline

1. User selects options in `CustomizationPanel`
2. State updates in `avatarStore`
3. `AvatarCanvas` retrieves components from registry
4. SVG layers are composed in correct z-order
5. `ExportButton` converts SVG to PNG using html2canvas

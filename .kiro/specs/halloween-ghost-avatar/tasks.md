# Implementation Plan

- [x] 1. Initialize Next.js project and install dependencies
  - Create Next.js 14 app with TypeScript and Tailwind CSS
  - Install required packages: zustand, html2canvas, downloadjs, @headlessui/react, fast-check
  - Configure TypeScript with strict mode
  - Set up Tailwind configuration
  - _Requirements: All_

- [x] 2. Create type definitions and core interfaces
  - Define GhostPartProps interface for SVG components
  - Define AvatarConfiguration interface for state management (eyes, hat, cape, accessory, background)
  - Define ComponentRegistryEntry and CategoryRegistry interfaces
  - Create utility types for component mapping
  - _Requirements: 10.3, 11.5_

- [x] 3. Implement component registry system
  - Create componentRegistry.ts with central registry structure
  - Implement getComponent() function for registry lookups
  - Add error handling for invalid component IDs
  - _Requirements: 10.1, 10.2_

- [x] 3.1 Write property test for registry extension
  - **Property 12: Registry extension enables component usage**
  - **Validates: Requirements 10.1, 10.2**

- [x] 4. Create example SVG assets for Eyes category
  - Create public/ghost-parts/eyes directory
  - Create round-eyes.svg with circular eye shapes
  - Create happy-eyes.svg with curved eye shapes
  - Create components/GhostParts/Eyes/index.ts with SVG file list
  - _Requirements: 1.1_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [x] 5. Create example SVG assets for Hats category
  - Create public/ghost-parts/hats directory
  - Create witch-hat.svg with witch hat design
  - Create pumpkin-hat.svg with pumpkin hat design
  - Create none.svg (no hat option)
  - Create components/GhostParts/Hats/index.ts with SVG file list
  - _Requirements: 2.1, 2.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [x] 6. Create example SVG assets for Capes category
  - Create public/ghost-parts/capes directory
  - Create white-cape.svg with white cape design
  - Create purple-cape.svg with purple cape design
  - Create black-cape.svg with black cape design
  - Create components/GhostParts/Capes/index.ts with SVG file list
  - _Requirements: 3.1, 3.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [x] 7. Create example SVG assets for Accessories category
  - Create public/ghost-parts/accessories directory
  - Create wand.svg with magic wand design
  - Create pumpkin-basket.svg with pumpkin basket design
  - Create candy.svg with candy design
  - Create none.svg (no accessory option)
  - Create components/GhostParts/Accessories/index.ts with SVG file list
  - _Requirements: 4.1, 4.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [x] 8. Create example SVG assets for Backgrounds category
  - Create public/ghost-parts/backgrounds directory
  - Create sparkles.svg with sparkle effects
  - Create moon.svg with moon background
  - Create none.svg (empty/transparent background)
  - Create components/GhostParts/Backgrounds/index.ts with SVG file list
  - _Requirements: 5.1, 5.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ]* 8.1 Write property test for eyes rendering
  - **Property 1: Eye selection renders correct component**
  - **Validates: Requirements 1.1**

- [ ]* 8.2 Write property test for hat rendering
  - **Property 2: Hat selection renders correct component**
  - **Validates: Requirements 2.1**

- [ ]* 8.3 Write property test for cape rendering
  - **Property 3: Cape selection renders correct variant**
  - **Validates: Requirements 3.1**

- [ ]* 8.4 Write property test for accessory rendering
  - **Property 4: Accessory selection renders correct component**
  - **Validates: Requirements 4.1**

- [ ]* 8.5 Write property test for null accessory handling
  - **Property 5: Null accessory removes component**
  - **Validates: Requirements 4.2**

- [ ]* 8.6 Write property test for background rendering
  - **Property 6: Background selection renders correct component**
  - **Validates: Requirements 5.1**

- [x] 9. Implement Zustand state management
  - Create avatarStore.ts with AvatarConfiguration state (eyes, hat, cape, accessory, background)
  - Implement updateConfig() action for partial updates
  - Set default configuration values
  - Add state validation middleware
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ]* 9.1 Write unit tests for state management
  - Test updateConfig() merges partial updates correctly
  - Test default configuration values
  - Test state validation

- [x] 10. Create AvatarCanvas component with SVG composition
  - Create AvatarCanvas.tsx component
  - Implement SVG viewBox with 1024x1024 dimensions
  - Use getComponent() to retrieve components from registry
  - Implement layering system: background → eyes → hat → accessory → cape 
  - Add ref for export functionality
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 11.2_

- [ ]* 10.1 Write property test for component layering
  - **Property 14: Component layering order is correct**
  - **Validates: Requirements 11.2**

- [x] 11. Create SelectControl component for dropdowns
  - Create components/controls/SelectControl.tsx
  - Use Headless UI Listbox for accessible dropdown
  - Accept options array and onChange handler
  - Style with Tailwind CSS
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 12. Create CustomizationPanel component
  - Create CustomizationPanel.tsx with all customization controls
  - Add SelectControl for eyes, hats, capes, accessories, backgrounds
  - Connect controls to Zustand store
  - Populate options from component registry
  - Implement responsive layout (sidebar on desktop, bottom sheet on mobile)
  - _Requirements: 1.1, 2.1, 2.2, 3.1, 4.1, 4.2, 5.1, 9.1, 9.2, 9.4_

- [x] 13. Implement random generation functionality
  - Add randomize() action to avatarStore
  - Implement logic to select random valid options from each category
  - Handle nullable options (hat, accessory - randomly include or exclude)
  - Ensure all randomized options exist in registries
  - _Requirements: 8.1, 8.4_

- [ ]* 13.1 Write property test for random generation validity
  - **Property 10: Random generation produces valid configuration**
  - **Validates: Requirements 8.1, 8.4**

- [ ]* 13.2 Write property test for state synchronization
  - **Property 11: Random generation synchronizes state**
  - **Validates: Requirements 8.2**

- [x] 14. Create RandomButton component
  - Create components/controls/RandomButton.tsx
  - Connect to randomize() action from store
  - Add icon and styling
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 15. Implement PNG export functionality
  - Create lib/exportUtils.ts
  - Implement exportAvatarAsPNG() function using html2canvas
  - Set canvas dimensions to 1024x1024
  - Configure transparent background
  - Generate filename with timestamp pattern: kiro-avatar-{timestamp}.png
  - Use downloadjs to trigger download
  - Add error handling for export failures
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 15.1 Write property test for PNG dimensions
  - **Property 7: PNG export dimensions are correct**
  - **Validates: Requirements 7.1**

- [ ]* 15.2 Write property test for PNG transparency
  - **Property 8: PNG export preserves transparency**
  - **Validates: Requirements 7.2**

- [ ]* 15.3 Write property test for filename pattern
  - **Property 9: Export filename follows pattern**
  - **Validates: Requirements 7.3**

- [x] 16. Create ExportButton component
  - Create ExportButton.tsx component
  - Connect to exportAvatarAsPNG() function
  - Pass SVG ref from AvatarCanvas
  - Add loading state during export
  - Display error toast on export failure
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 12.3_

- [x] 17. Build main application page
  - Create app/page.tsx with main layout
  - Integrate AvatarCanvas and CustomizationPanel
  - Add ExportButton and RandomButton
  - Implement responsive grid layout
  - Add loading states
  - _Requirements: 9.1, 9.2, 9.3, 12.2_

- [x] 18. Style application with Tailwind CSS
  - Configure Tailwind theme for Halloween aesthetic
  - Style CustomizationPanel with proper spacing and typography
  - Style controls with hover and focus states
  - Implement responsive breakpoints (mobile < 768px, desktop >= 768px)
  - Add smooth transitions for interactions
  - Ensure minimum touch target sizes (44x44px)
  - _Requirements: 9.1, 9.2, 9.4, 12.4_

- [ ] 19. Add accessibility features
  - Add ARIA labels to all controls
  - Implement keyboard navigation
  - Add focus indicators
  - Test with screen readers
  - Add descriptive labels for avatar preview
  - _Requirements: 12.4_

- [x] 20. Implement error boundaries
  - Create error boundary component for SVG rendering
  - Add fallback UI for missing components
  - Log errors to console
  - _Requirements: Error handling_

- [x] 21. Add browser compatibility checks
  - Detect SVG and Canvas API support
  - Display compatibility warning for unsupported browsers
  - Add graceful degradation
  - _Requirements: 9.5_

- [ ]* 22. Write integration tests
  - Test complete customization flow
  - Test random generation and export workflow
  - Test responsive layout changes
  - Test error scenarios

- [x] 23. Create documentation for adding new SVG assets
  - Update README.md with instructions for adding new SVG files
  - Provide examples for each category (eyes, hats, capes, accessories, backgrounds)
  - Document SVG file naming conventions
  - Include troubleshooting guide
  - _Requirements: 10.1, 10.2, 10.5_

- [x] 24. Optimize performance
  - Test rendering performance with all options
  - Optimize SVG path complexity if needed
  - Implement efficient re-rendering strategies
  - _Requirements: 12.1_

- [ ] 25. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

/**
 * CustomizationPanel Component
 * 
 * Main control panel for customizing the ghost avatar. Provides dropdown
 * controls for all customization categories (eyes, hats, capes, accessories,
 * backgrounds). Implements responsive layout - sidebar on desktop, bottom
 * sheet on mobile.
 * 
 * Requirements: 1.1, 2.1, 2.2, 3.1, 4.1, 4.2, 5.1, 9.1, 9.2, 9.4
 */

import { useAvatarStore } from '@/lib/avatarStore';
import { getCategoryOptions } from '@/lib/componentRegistry';
import SelectControl from './controls/SelectControl';

export default function CustomizationPanel() {
  const config = useAvatarStore((state) => state.config);
  const updateConfig = useAvatarStore((state) => state.updateConfig);

  // Get options from component registry for each category
  const eyesOptions = getCategoryOptions('eyes');
  const hatsOptions = getCategoryOptions('hats');
  const capesOptions = getCategoryOptions('capes');
  const accessoriesOptions = getCategoryOptions('accessories');
  const backgroundsOptions = getCategoryOptions('backgrounds');

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-purple-50 p-6 overflow-y-auto">
      <div className="max-w-md mx-auto lg:max-w-none">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customize Your Ghost
        </h2>

        <div className="space-y-6">
          {/* Eyes Selection */}
          <SelectControl
            label="Eyes"
            value={config.eyes}
            options={eyesOptions}
            onChange={(value) => updateConfig({ eyes: value as string })}
            nullable={false}
          />

          {/* Hat Selection */}
          <SelectControl
            label="Hat"
            value={config.hat}
            options={hatsOptions}
            onChange={(value) => updateConfig({ hat: value })}
            nullable={true}
          />

          {/* Cape Selection */}
          <SelectControl
            label="Cape"
            value={config.cape}
            options={capesOptions}
            onChange={(value) => updateConfig({ cape: value as string })}
            nullable={false}
          />

          {/* Accessory Selection */}
          <SelectControl
            label="Accessory"
            value={config.accessory}
            options={accessoriesOptions}
            onChange={(value) => updateConfig({ accessory: value })}
            nullable={true}
          />

          {/* Background Selection */}
          <SelectControl
            label="Background"
            value={config.background}
            options={backgroundsOptions}
            onChange={(value) => updateConfig({ background: value as string })}
            nullable={false}
          />
        </div>

        {/* Helper text */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            💡 Tip: Select different options to customize your ghost avatar.
            Hat and accessory can be removed by selecting "None".
          </p>
        </div>
      </div>
    </div>
  );
}

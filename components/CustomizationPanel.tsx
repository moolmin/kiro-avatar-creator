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
    <div className="w-full h-full panel-halloween p-6 overflow-y-auto">
      <div className="max-w-md mx-auto lg:max-w-none">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-halloween-gradient mb-2">
            Customize Your Ghost
          </h2>
          <p className="text-sm text-gray-600">
            Mix and match to create your perfect spooky avatar
          </p>
        </div>

        <div className="space-y-5">
          {/* Eyes Selection */}
          <div className="transition-smooth hover:scale-[1.02]">
            <SelectControl
              label="👁️ Eyes"
              value={config.eyes}
              options={eyesOptions}
              onChange={(value) => updateConfig({ eyes: value as string })}
              nullable={false}
            />
          </div>

          {/* Hat Selection */}
          <div className="transition-smooth hover:scale-[1.02]">
            <SelectControl
              label="🎩 Hat"
              value={config.hat}
              options={hatsOptions}
              onChange={(value) => updateConfig({ hat: value })}
              nullable={true}
            />
          </div>

          {/* Cape Selection */}
          <div className="transition-smooth hover:scale-[1.02]">
            <SelectControl
              label="🦇 Cape"
              value={config.cape}
              options={capesOptions}
              onChange={(value) => updateConfig({ cape: value as string })}
              nullable={false}
            />
          </div>

          {/* Accessory Selection */}
          <div className="transition-smooth hover:scale-[1.02]">
            <SelectControl
              label="✨ Accessory"
              value={config.accessory}
              options={accessoriesOptions}
              onChange={(value) => updateConfig({ accessory: value })}
              nullable={true}
            />
          </div>

          {/* Background Selection */}
          <div className="transition-smooth hover:scale-[1.02]">
            <SelectControl
              label="🌙 Background"
              value={config.background}
              options={backgroundsOptions}
              onChange={(value) => updateConfig({ background: value as string })}
              nullable={false}
            />
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-8 p-5 bg-white rounded-xl shadow-md border-2 border-halloween-orange-200 transition-smooth hover:shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                Quick Tips
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Select different options to customize your ghost avatar.
                Hat and accessory can be removed by selecting "None".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

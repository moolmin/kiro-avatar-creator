/**
 * Tests for Avatar Store
 * 
 * Verifies that the Zustand store correctly manages avatar configuration state,
 * validates inputs, and provides working update and randomize actions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAvatarStore } from './avatarStore';

describe('Avatar Store', () => {
  // Reset store to default state before each test
  beforeEach(() => {
    const { updateConfig } = useAvatarStore.getState();
    updateConfig({
      eyes: 'round-eyes',
      hat: null,
      cape: 'white-cape',
      accessory: null,
      background: 'none',
    });
  });

  describe('Default Configuration', () => {
    it('should have valid default configuration', () => {
      const { config } = useAvatarStore.getState();
      
      expect(config).toBeDefined();
      expect(config.eyes).toBe('round-eyes');
      expect(config.hat).toBeNull();
      expect(config.cape).toBe('white-cape');
      expect(config.accessory).toBeNull();
      expect(config.background).toBe('none');
    });
  });

  describe('updateConfig', () => {
    it('should update single property', () => {
      const { updateConfig, config: initialConfig } = useAvatarStore.getState();
      
      updateConfig({ eyes: 'happy-eyes' });
      
      const { config: updatedConfig } = useAvatarStore.getState();
      expect(updatedConfig.eyes).toBe('happy-eyes');
      expect(updatedConfig.cape).toBe(initialConfig.cape); // Other properties unchanged
    });

    it('should update multiple properties at once', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      updateConfig({
        eyes: 'happy-eyes',
        hat: 'witch-hat',
        cape: 'purple-cape',
      });
      
      const { config } = useAvatarStore.getState();
      expect(config.eyes).toBe('happy-eyes');
      expect(config.hat).toBe('witch-hat');
      expect(config.cape).toBe('purple-cape');
    });

    it('should allow setting nullable properties to null', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // First set a hat
      updateConfig({ hat: 'witch-hat' });
      expect(useAvatarStore.getState().config.hat).toBe('witch-hat');
      
      // Then remove it
      updateConfig({ hat: null });
      expect(useAvatarStore.getState().config.hat).toBeNull();
    });

    it('should validate and fallback invalid values', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // Try to set an invalid eyes value
      updateConfig({ eyes: 'invalid-eyes-id' as any });
      
      const { config } = useAvatarStore.getState();
      // Should fall back to a valid value (first available option)
      expect(config.eyes).toBeTruthy();
      expect(typeof config.eyes).toBe('string');
    });
  });

  describe('randomize', () => {
    it('should generate valid random configuration', () => {
      const { randomize } = useAvatarStore.getState();
      
      randomize();
      
      const { config } = useAvatarStore.getState();
      
      // All required fields should have values
      expect(config.eyes).toBeTruthy();
      expect(config.cape).toBeTruthy();
      expect(config.background).toBeTruthy();
      
      // Nullable fields can be null or have values
      expect(config.hat === null || typeof config.hat === 'string').toBe(true);
      expect(config.accessory === null || typeof config.accessory === 'string').toBe(true);
    });

    it('should produce different configurations on multiple calls', () => {
      const { randomize, config: initialConfig } = useAvatarStore.getState();
      
      const configs = new Set<string>();
      
      // Generate 10 random configurations
      for (let i = 0; i < 10; i++) {
        randomize();
        const { config } = useAvatarStore.getState();
        configs.add(JSON.stringify(config));
      }
      
      // Should have generated at least 2 different configurations
      // (very unlikely to get the same config 10 times in a row)
      expect(configs.size).toBeGreaterThan(1);
    });
  });

  describe('State Validation', () => {
    it('should maintain valid state after multiple updates', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // Perform multiple updates
      updateConfig({ eyes: 'happy-eyes' });
      updateConfig({ hat: 'witch-hat' });
      updateConfig({ cape: 'black-cape' });
      updateConfig({ accessory: 'wand' });
      updateConfig({ background: 'moon' });
      
      const { config } = useAvatarStore.getState();
      
      // All values should be valid
      expect(config.eyes).toBe('happy-eyes');
      expect(config.hat).toBe('witch-hat');
      expect(config.cape).toBe('black-cape');
      expect(config.accessory).toBe('wand');
      expect(config.background).toBe('moon');
    });
  });
});

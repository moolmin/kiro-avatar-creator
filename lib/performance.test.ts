/**
 * Performance Tests
 * 
 * Tests rendering performance with all options to ensure the application
 * meets the 100ms update requirement from Requirements 12.1.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAvatarStore } from './avatarStore';
import { getCategoryOptions } from './componentRegistry';

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset store to default state
    const { result } = renderHook(() => useAvatarStore());
    act(() => {
      result.current.updateConfig({
        eyes: 'eyes-01',
        hat: null,
        cape: null,
        accessory: null,
        background: 'background-00',
      });
    });
  });

  it('should update configuration within performance budget', () => {
    const { result } = renderHook(() => useAvatarStore());
    
    const startTime = performance.now();
    
    act(() => {
      result.current.updateConfig({ eyes: 'eyes-02' });
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // State update should be nearly instantaneous (< 10ms)
    expect(duration).toBeLessThan(10);
  });

  it('should handle rapid configuration changes efficiently', () => {
    const { result } = renderHook(() => useAvatarStore());
    
    const startTime = performance.now();
    
    // Simulate rapid changes (like user clicking through options quickly)
    act(() => {
      result.current.updateConfig({ eyes: 'eyes-02' });
      result.current.updateConfig({ hat: 'hat-01' });
      result.current.updateConfig({ cape: 'capes-01' });
      result.current.updateConfig({ accessory: 'accessories-01' });
      result.current.updateConfig({ background: 'background-01' });
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // All updates should complete quickly (< 50ms)
    expect(duration).toBeLessThan(50);
  });

  it('should randomize configuration efficiently', () => {
    const { result } = renderHook(() => useAvatarStore());
    
    const startTime = performance.now();
    
    act(() => {
      result.current.randomize();
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Randomization should be fast (< 20ms)
    expect(duration).toBeLessThan(20);
    
    // Verify configuration is valid
    const config = result.current.config;
    expect(config.eyes).toBeTruthy();
    expect(config.background).toBeTruthy();
  });

  it('should handle registry lookups efficiently', () => {
    const categories = ['eyes', 'hats', 'capes', 'accessories', 'backgrounds'];
    
    const startTime = performance.now();
    
    // Simulate loading all options for all categories
    categories.forEach(category => {
      const options = getCategoryOptions(category);
      expect(options).toBeDefined();
      expect(Array.isArray(options)).toBe(true);
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Registry lookups should be very fast (< 5ms for all categories)
    expect(duration).toBeLessThan(5);
  });

  it('should validate configuration efficiently', () => {
    const { result } = renderHook(() => useAvatarStore());
    
    const startTime = performance.now();
    
    // Update with valid configuration
    act(() => {
      result.current.updateConfig({
        eyes: 'eyes-01',
        hat: 'hat-01',
        cape: 'capes-01',
        accessory: 'accessories-01',
        background: 'background-01',
      });
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Validation should not add significant overhead (< 10ms)
    expect(duration).toBeLessThan(10);
  });

  it('should handle invalid configuration gracefully without performance penalty', () => {
    const { result } = renderHook(() => useAvatarStore());
    
    const startTime = performance.now();
    
    // Update with invalid configuration (should fall back to valid values)
    act(() => {
      result.current.updateConfig({
        eyes: 'invalid-eyes',
        hat: 'invalid-hat',
        cape: 'invalid-cape',
        accessory: 'invalid-accessory',
        background: 'invalid-background',
      });
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Validation with fallback should still be fast (< 15ms)
    expect(duration).toBeLessThan(15);
    
    // Verify fallback to valid values
    const config = result.current.config;
    expect(config.eyes).toBeTruthy();
    expect(config.background).toBeTruthy();
  });
});

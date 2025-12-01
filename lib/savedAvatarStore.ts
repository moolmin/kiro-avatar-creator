/**
 * Global store for saved avatar data
 * Used to pass avatar image data between pages without using sessionStorage
 */

import { AvatarConfiguration } from './types';

export const SAVED_AVATAR_STORAGE_KEY = 'kiroSavedAvatar';

export interface SavedAvatar {
  image: string | null;
  config: AvatarConfiguration;
  timestamp: number;
}

class SavedAvatarStore {
  private savedAvatar: SavedAvatar | null = null;

  setSavedAvatar(data: SavedAvatar) {
    this.savedAvatar = data;
  }

  getSavedAvatar(): SavedAvatar | null {
    return this.savedAvatar;
  }

  clearSavedAvatar() {
    this.savedAvatar = null;
  }
}

declare global {
  interface Window {
    __savedAvatarStore?: SavedAvatarStore;
  }
}

const getGlobalSavedAvatarStore = (): SavedAvatarStore => {
  if (typeof window === 'undefined') {
    // On the server/SSR just create a new instance (won't persist)
    return new SavedAvatarStore();
  }

  if (!window.__savedAvatarStore) {
    window.__savedAvatarStore = new SavedAvatarStore();
  }

  return window.__savedAvatarStore;
};

const savedAvatarStore = getGlobalSavedAvatarStore();

export const restoreSavedAvatar = (): SavedAvatar | null => {
  const memoryCopy = savedAvatarStore.getSavedAvatar();
  if (memoryCopy) {
    return memoryCopy;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  const storageValue = window.sessionStorage.getItem(SAVED_AVATAR_STORAGE_KEY);
  if (!storageValue) {
    return null;
  }

  try {
    return JSON.parse(storageValue) as SavedAvatar;
  } catch (error) {
    console.warn('Failed to parse saved avatar from sessionStorage', error);
    return null;
  }
};

export default savedAvatarStore;
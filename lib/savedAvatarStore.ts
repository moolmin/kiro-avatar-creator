/**
 * Global store for saved avatar data
 * Used to pass avatar image data between pages without using sessionStorage
 */

interface SavedAvatar {
  image: string;
  config: any;
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

// Create a singleton instance
const savedAvatarStore = new SavedAvatarStore();

// Make it available globally in browser
if (typeof window !== 'undefined') {
  (window as any).__savedAvatarStore = savedAvatarStore;
}

export default savedAvatarStore;
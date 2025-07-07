import { createSlice } from '@reduxjs/toolkit';

const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window === 'undefined') {
        // console.log('localStorage not available (SSR)');
        return null;
      }
      const item = localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : null;
      // console.log(`localStorage.getItem(${key}):`, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      if (typeof window === 'undefined') {
        // console.log('localStorage not available (SSR)');
        return false;
      }
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
      // console.log(`localStorage.setItem(${key}):`, value);
      
      const verification = localStorage.getItem(key);
      const success = verification === stringified;
      // console.log(`localStorage write verification for ${key}:`, success);
      return success;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      // console.log(`localStorage.removeItem(${key}): success`);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  }
};

const getUserSpecificKey = (baseKey, userId) => {
  if (!userId) {
    console.warn('getUserSpecificKey called without userId');
    return null;
  }
  const key = `${baseKey}_user_${userId}`;
  // console.log(`Generated storage key: ${key} for user: ${userId}`);
  return key;
};

const getRecentlyPlayedFromStorage = (userId) => {
  if (!userId) {
    console.warn('getRecentlyPlayedFromStorage called without userId');
    return [];
  }
  const key = getUserSpecificKey('recentlyPlayed', userId);
  const items = key ? safeLocalStorage.getItem(key) || [] : [];
  // console.log(`Loaded ${items.length} recently played items from storage for user ${userId}`);
  return items;
};

const saveRecentlyPlayedToStorage = (items, userId) => {
  if (!userId) {
    console.warn('saveRecentlyPlayedToStorage called without userId');
    return false;
  }
  const key = getUserSpecificKey('recentlyPlayed', userId);
  if (!key) {
    console.error('Could not generate storage key');
    return false;
  }
  
  // console.log(`Attempting to save ${items.length} recently played items for user ${userId}`);
  const result = safeLocalStorage.setItem(key, items);
  // console.log(`Save result: ${result}`);
  return result;
};

const sortByPlayedAt = (items) => {
  return items.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
};

const initialState = {
  items: [],
  currentUserId: null,
};

const recentlyPlayedSlice = createSlice({
  name: 'recentlyPlayed',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const userId = action.payload;
      // console.log(`Setting current user: ${userId} (previous: ${state.currentUserId})`);
      
      state.currentUserId = userId;
      
      if (userId) {
        const storedItems = getRecentlyPlayedFromStorage(userId);
        state.items = sortByPlayedAt(storedItems);
        // console.log(`Set current user ${userId}, loaded ${storedItems.length} recently played items`);
      } else {
        state.items = [];
        // console.log('User cleared, reset items to empty array');
      }
    },

    addRecentlyPlayedItem: (state, action) => {
      // console.log('addRecentlyPlayedItem called with:', action.payload);
      // console.log('Current user ID:', state.currentUserId);
      // console.log('Current items before adding:', state.items);
      
      if (!state.currentUserId) {
        console.error('No current user set, cannot add recently played item');
        return;
      }

      const { item, type } = action.payload;
      
      if (!item || !item.id || !item.name || !type) {
        console.error('Invalid item data or type:', { item, type });
        return;
      }

      // console.log(`Adding ${type}: ${item.name} (ID: ${item.id})`);

      const existingIndex = state.items.findIndex(i => i.id === item.id && i.type === type);
      if (existingIndex > -1) {
        // console.log(`Removing existing ${type} at index ${existingIndex}`);
        state.items.splice(existingIndex, 1);
      }

      const itemToAdd = {
        id: item.id,
        name: item.name,
        type: type,
        playedAt: new Date().toISOString(),
        ...(type === 'playlist' && {
          cover: item.cover || item.coverImage,
          description: item.description,
        }),
        ...(type === 'artist' && {
          photo: item.photo || item.image || item.profileImage,
        }),
      };

      // console.log('Item to add:', itemToAdd);

      state.items.unshift(itemToAdd);
      state.items = sortByPlayedAt(state.items);
      
      // console.log(`Added ${type} to collection. Total items: ${state.items.length}`);
      // console.log('Current items after adding:', state.items);

      if (state.items.length > 20) {
        // const removedCount = state.items.length - 20;
        state.items = state.items.slice(0, 20);
        // console.log(`Trimmed ${removedCount} old items, now have ${state.items.length}`);
      }

      // console.log('About to save to localStorage...');
      const success = saveRecentlyPlayedToStorage(state.items, state.currentUserId);
      if (success) {
        // console.log(`Successfully saved ${type}: ${item.name} for user ${state.currentUserId}`);
      } else {
        // console.error(`Failed to save recently played ${type} to localStorage`);
      }
    },

    removeRecentlyPlayedItem: (state, action) => {
      if (!state.currentUserId) {
        // console.warn('No current user, cannot remove item');
        return;
      }

      const { id, type } = action.payload;
      // const originalLength = state.items.length;
      state.items = state.items.filter(item => !(item.id === id && item.type === type));
      
      // console.log(`Removed ${type} ${id}. Count: ${originalLength} -> ${state.items.length}`);
      
      saveRecentlyPlayedToStorage(state.items, state.currentUserId);
    },

    clearRecentlyPlayedItems: (state, action) => {
      if (!state.currentUserId) {
        console.warn('No current user, cannot clear items');
        return;
      }

      const typeToClear = action.payload;

      if (typeToClear) {
        // console.log(`Clearing all ${typeToClear}s for user ${state.currentUserId}`);
        state.items = state.items.filter(item => item.type !== typeToClear);
      } else {
        // console.log(`Clearing all recently played items for user ${state.currentUserId}`);
        state.items = [];
      }
      
      saveRecentlyPlayedToStorage(state.items, state.currentUserId);
    },

    clearUserSession: (state) => {
      // console.log(`Clearing user session for user ${state.currentUserId}`);
      
      if (state.currentUserId) {
        const key = getUserSpecificKey('recentlyPlayed', state.currentUserId);
        if (key) {
          safeLocalStorage.removeItem(key);
        }
      }
      
      state.items = [];
      state.currentUserId = null;
      // console.log('User session cleared');
    },
  },
});


export const selectRecentlyPlayedPlaylists = (state) => {
  const items = state.recentlyPlayed?.items || [];
  return items.filter(item => item.type === 'playlist');
};

export const selectRecentlyPlayedArtists = (state) => {
  const items = state.recentlyPlayed?.items || [];
  return items.filter(item => item.type === 'artist');
};

export const selectAllRecentlyPlayed = (state) => {
  return state.recentlyPlayed?.items || [];
};

export const selectRecentlyPlayedByType = (state, type) => {
  const items = state.recentlyPlayed?.items || [];
  return items.filter(item => item.type === type);
};

export const {
  setCurrentUser,
  addRecentlyPlayedItem,
  removeRecentlyPlayedItem,
  clearRecentlyPlayedItems,
  clearUserSession,
} = recentlyPlayedSlice.actions;

export const addRecentlyPlayedPlaylist = (playlist) => 
  addRecentlyPlayedItem({ item: playlist, type: 'playlist' });

export const addRecentlyPlayedArtist = (artist) => 
  addRecentlyPlayedItem({ item: artist, type: 'artist' });

export const removeRecentlyPlayedPlaylist = (playlistId) => 
  removeRecentlyPlayedItem({ id: playlistId, type: 'playlist' });

export const removeRecentlyPlayedArtist = (artistId) => 
  removeRecentlyPlayedItem({ id: artistId, type: 'artist' });

export const clearRecentlyPlayedPlaylists = () => 
  clearRecentlyPlayedItems('playlist');

export const clearRecentlyPlayedArtists = () => 
  clearRecentlyPlayedItems('artist');

export default recentlyPlayedSlice.reducer;
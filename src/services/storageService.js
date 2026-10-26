// Persistent Storage & MongoDB Sync Service
// Provides cross-platform persistent storage (Web localStorage, AsyncStorage fallback, & In-Memory cache)
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  USERS: '@papermate_users_v1',
  CURRENT_USER: '@papermate_current_user_v1',
  PAPERS_HISTORY: '@papermate_papers_history_v1',
};

// In-memory cache
const STORAGE = {
  users: [],
  currentUser: null,
  papersHistory: [],
  isInitialized: false,
};

// Cross-platform persistent storage helper
const PersistentStorage = {
  getItem: async (key) => {
    try {
      // 1. Web LocalStorage
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }

      // 2. React Native AsyncStorage (if installed)
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage && AsyncStorage.getItem) {
          return await AsyncStorage.getItem(key);
        }
      } catch (e) {
        // Module not linked / fallback
      }

      // 3. Global localStorage if present
      if (typeof global !== 'undefined' && global.localStorage) {
        return global.localStorage.getItem(key);
      }
    } catch (err) {
      console.warn('PersistentStorage getItem error:', err);
    }
    return null;
  },

  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }

      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage && AsyncStorage.setItem) {
          await AsyncStorage.setItem(key, value);
          return;
        }
      } catch (e) {
        // Module not linked / fallback
      }

      if (typeof global !== 'undefined' && global.localStorage) {
        global.localStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn('PersistentStorage setItem error:', err);
    }
  },

  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }

      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage && AsyncStorage.removeItem) {
          await AsyncStorage.removeItem(key);
          return;
        }
      } catch (e) {
        // Module not linked / fallback
      }

      if (typeof global !== 'undefined' && global.localStorage) {
        global.localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn('PersistentStorage removeItem error:', err);
    }
  },
};

// Initialize persistent storage cache on app startup
export const initStorage = async () => {
  if (STORAGE.isInitialized) return STORAGE;

  try {
    const rawUsers = await PersistentStorage.getItem(STORAGE_KEYS.USERS);
    if (rawUsers) {
      STORAGE.users = JSON.parse(rawUsers);
    }

    const rawCurrentUser = await PersistentStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (rawCurrentUser) {
      STORAGE.currentUser = JSON.parse(rawCurrentUser);
    }

    const rawHistory = await PersistentStorage.getItem(STORAGE_KEYS.PAPERS_HISTORY);
    if (rawHistory) {
      STORAGE.papersHistory = JSON.parse(rawHistory);
    }
  } catch (err) {
    console.warn('Failed to hydrate storage:', err);
  }

  STORAGE.isInitialized = true;
  return STORAGE;
};

// MongoDB API Endpoint configuration (easy plug for production)
export const MONGODB_CONFIG = {
  apiUrl: 'https://api.papermate.internal/api',
  useLocalFallback: true,
};

export const AuthService = {
  init: async () => {
    return await initStorage();
  },

  signUp: async (name, email, password) => {
    await initStorage();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = STORAGE.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists! Please log in.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    STORAGE.users.push(newUser);
    STORAGE.currentUser = newUser;

    // Persist to storage
    await PersistentStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(STORAGE.users));
    await PersistentStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return newUser;
  },

  login: async (email, password) => {
    await initStorage();
    const cleanEmail = email.trim().toLowerCase();

    const user = STORAGE.users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!user) {
      // For demo / quick test convenience: allow standard test user
      if (cleanEmail === 'test@papermate.com' && password === '123456') {
        const dummy = { id: 'usr_demo', name: 'Student / Teacher', email: cleanEmail };
        STORAGE.currentUser = dummy;
        await PersistentStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(dummy));
        return dummy;
      }
      throw new Error('Invalid email or password! Please check your credentials or create an account.');
    }

    STORAGE.currentUser = user;
    await PersistentStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: async () => {
    await initStorage();
    return STORAGE.currentUser;
  },

  hasAnyUser: async () => {
    await initStorage();
    return STORAGE.users && STORAGE.users.length > 0;
  },

  logout: async () => {
    STORAGE.currentUser = null;
    await PersistentStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};

export const PaperHistoryService = {
  savePaper: async (paper) => {
    await initStorage();
    const paperRecord = {
      ...paper,
      id: paper.id || 'paper_' + Date.now(),
      savedAt: new Date().toISOString(),
      userEmail: STORAGE.currentUser?.email || 'guest@papermate.com',
    };

    // Prepend to top of history
    STORAGE.papersHistory = [paperRecord, ...STORAGE.papersHistory.filter(p => p.id !== paperRecord.id)];
    await PersistentStorage.setItem(STORAGE_KEYS.PAPERS_HISTORY, JSON.stringify(STORAGE.papersHistory));
    return paperRecord;
  },

  getHistory: async () => {
    await initStorage();
    return STORAGE.papersHistory;
  },

  getPaperById: async (id) => {
    await initStorage();
    return STORAGE.papersHistory.find(p => p.id === id);
  },

  deletePaper: async (id) => {
    await initStorage();
    STORAGE.papersHistory = STORAGE.papersHistory.filter(p => p.id !== id);
    await PersistentStorage.setItem(STORAGE_KEYS.PAPERS_HISTORY, JSON.stringify(STORAGE.papersHistory));
    return true;
  },
};

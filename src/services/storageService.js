// Storage Service for PerMate React Native App

let memoryStorage = {};

export const storageService = {
  getItem: async (key) => {
    try {
      return memoryStorage[key] || null;
    } catch (error) {
      console.error('Error reading storage key:', key, error);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      memoryStorage[key] = value;
    } catch (error) {
      console.error('Error writing storage key:', key, error);
    }
  },

  removeItem: async (key) => {
    try {
      delete memoryStorage[key];
    } catch (error) {
      console.error('Error removing storage key:', key, error);
    }
  }
};

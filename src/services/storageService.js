// Storage & MongoDB Sync Service
// Can connect directly to MongoDB via Express/FastAPI backend or use in-memory / device cache

const STORAGE = {
  users: [],
  currentUser: null,
  papersHistory: [],
};

// MongoDB API Endpoint configuration (easy plug for production)
export const MONGODB_CONFIG = {
  apiUrl: 'https://api.papermate.internal/api', // Replace with your MongoDB backend URI
  useLocalFallback: true,
};

export const AuthService = {
  signUp: async (name, email, password) => {
    // Check if user already exists
    const existing = STORAGE.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists!');
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    STORAGE.users.push(newUser);
    return newUser;
  },

  login: async (email, password) => {
    const user = STORAGE.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      // For demo / quick test convenience: allow standard test user
      if (email === 'test@papermate.com' && password === '123456') {
        const dummy = { id: 'usr_demo', name: 'Student / Teacher', email };
        STORAGE.currentUser = dummy;
        return dummy;
      }
      throw new Error('Invalid email or password! Please sign up first.');
    }
    STORAGE.currentUser = user;
    return user;
  },

  getCurrentUser: () => STORAGE.currentUser,
  logout: () => {
    STORAGE.currentUser = null;
  },
};

export const PaperHistoryService = {
  savePaper: async (paper) => {
    const paperRecord = {
      ...paper,
      id: paper.id || 'paper_' + Date.now(),
      savedAt: new Date().toISOString(),
      userEmail: STORAGE.currentUser?.email || 'guest@papermate.com',
    };
    // Prepend to top of history
    STORAGE.papersHistory = [paperRecord, ...STORAGE.papersHistory.filter(p => p.id !== paperRecord.id)];
    return paperRecord;
  },

  getHistory: async () => {
    return STORAGE.papersHistory;
  },

  getPaperById: async (id) => {
    return STORAGE.papersHistory.find(p => p.id === id);
  },

  deletePaper: async (id) => {
    STORAGE.papersHistory = STORAGE.papersHistory.filter(p => p.id !== id);
    return true;
  },
};

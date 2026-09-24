// React Native PerMate Theme System (Clean White Theme)

export const theme = {
  colors: {
    background: '#ffffff',
    cardBackground: '#ffffff',
    headerBackground: '#ffffff',
    tableBackground: '#ffffff',
    tableHeaderBg: '#f8fafc',
    tableRowHover: '#f1f5f9',
    
    primary: '#63368F',
    primaryLight: '#f0eaf7',
    primaryBorder: '#d8c7ea',
    
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textWhite: '#ffffff',
    
    border: '#cbd5e1',
    borderLight: '#e2e8f0',

    badges: {
      ninth: { bg: '#e0f2fe', text: '#0369a1' },
      tenth: { bg: '#f0eaf7', text: '#63368F' },
      firstYear: { bg: '#f3e8ff', text: '#7e22ce' },
      secondYear: { bg: '#fef3c7', text: '#b45309' }
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28
  },

  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 999
  },

  typography: {
    h1: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
    h2: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
    h3: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
    body: { fontSize: 14, color: '#475569' },
    caption: { fontSize: 12, color: '#64748b' }
  }
};

import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export const Header = ({ searchQuery, setSearchQuery, onLogoPress }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.brand} onPress={onLogoPress}>
        <Text style={styles.brandText}>
          Per<Text style={styles.brandGradient}>Mate</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search subjects, chapters, or notes..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 70,
    backgroundColor: theme.colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary
  },
  brandGradient: {
    color: theme.colors.primary
  },
  searchContainer: {
    width: 300,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 16
  },
  searchInput: {
    height: 40,
    fontSize: 14,
    color: theme.colors.textPrimary
  }
});

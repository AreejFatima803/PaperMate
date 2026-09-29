import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../styles/theme';

export const SplashScreen = ({ onEnter }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.logoWrapper} onPress={onEnter} activeOpacity={0.8}>
          <Image source={require('../../appLogo.png')} style={styles.logo} />
        </TouchableOpacity>

        <Text style={styles.title}>
          PerMate <Text style={styles.gradientText}>Academy</Text>
        </Text>
        <Text style={styles.subtitle}>
          Your Ultimate Companion for 9th, 10th, 1st Year & 2nd Year Studies
        </Text>

        <TouchableOpacity style={styles.enterBadge} onPress={onEnter}>
          <Text style={styles.enterBadgeText}>👆 Click to Enter PerMate App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden'
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10
  },
  gradientText: {
    color: theme.colors.primary
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20
  },
  enterBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primaryBorder,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30
  },
  enterBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary
  }
});

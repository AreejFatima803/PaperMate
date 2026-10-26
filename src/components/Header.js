import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { theme } from '../styles/theme';

export const Header = ({ title, subtitle, onBack, rightAction, rightLabel, rightIcon }) => {
  const renderRightIcon = () => {
    if (!rightIcon || rightIcon === 'home') return '🏠';
    if (rightIcon === 'check') return '✓';
    if (rightIcon === 'history') return '📜';
    if (rightIcon === 'share-alt') return '📤';
    return '•';
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.leftRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backButtonIcon}>‹</Text>
            </TouchableOpacity>
          )}
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.rightButton} activeOpacity={0.7}>
            <Text style={styles.rightButtonIcon}>{renderRightIcon()}</Text>
            <Text style={styles.rightLabel}>{rightLabel || 'Home'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
    fontWeight: '500',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  rightLabel: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  backButtonIcon: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: -2,
    textAlign: 'center',
  },
  rightButtonIcon: {
    fontSize: 14,
    marginRight: 5,
  },
});

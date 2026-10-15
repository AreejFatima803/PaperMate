import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CLASSES } from '../data/boardsAndCurriculum';

export const ClassSelectScreen = ({ selectedBoard, onSelectClass, onBack }) => {
  return (
    <View style={styles.container}>
      <Header
        title="کلاس منتخب کریں"
        subtitle="Select Class"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.boardBadge}>
          <Text style={styles.boardBadgeText}>🏛️ بورڈ: {selectedBoard?.name}</Text>
        </View>

        <Text style={styles.heading}>کس کلاس کا پیپر بنانا ہے؟</Text>
        <Text style={styles.subheading}>نیچے دی گئی کلاسوں میں سے ایک منتخب کریں (2026 کا نیا نصاب):</Text>

        <View style={styles.grid}>
          {CLASSES.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.classCard}
              activeOpacity={0.8}
              onPress={() => onSelectClass(cls)}
            >
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeNumber}>{cls.id}</Text>
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classSubtitle}>{cls.subtitle}</Text>
              </View>
              <View style={styles.arrowIconWrap}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  boardBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  boardBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  cardTextWrap: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  classSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  arrowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { MEDIUMS } from '../data/boardsAndCurriculum';

export const MediumSelectScreen = ({ selectedBoard, selectedClass, onSelectMedium, onBack }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Select Medium"
        subtitle="Medium of Instruction"
        onBack={onBack}
      />

      <View style={styles.content}>
        <View style={styles.pathPill}>
          <Text style={styles.pathPillText}>
            🏛️ {selectedBoard?.name} • 🎓 {selectedClass?.name}
          </Text>
        </View>

        <Text style={styles.heading}>Choose Medium</Text>
        <Text style={styles.subheading}>
          Select the medium of examination for the question paper:
        </Text>

        <View style={styles.mediumContainer}>
          <TouchableOpacity
            style={styles.mediumCard}
            activeOpacity={0.8}
            onPress={() => onSelectMedium({ id: 'english', name: 'English Medium', tag: 'EM', desc: 'Questions in English language' })}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>EN</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.mediumName}>English Medium</Text>
              <Text style={styles.mediumDesc}>Standard English exam paper formatting</Text>
            </View>
            <View style={styles.selectBtn}>
              <Text style={styles.selectBtnText}>Select English Medium →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediumCard}
            activeOpacity={0.8}
            onPress={() => onSelectMedium({ id: 'bilingual', name: 'Standard Board Medium', tag: 'BM', desc: 'Board standard English format' })}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>BM</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.mediumName}>Standard Board Medium</Text>
              <Text style={styles.mediumDesc}>National curriculum standard format</Text>
            </View>
            <View style={styles.selectBtn}>
              <Text style={styles.selectBtnText}>Select Standard Medium →</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Board Curriculum Notice (2026):</Text>
          <Text style={styles.tipDesc}>
            All Science, Computer, Mathematics, and Humanities papers follow the official educational board guidelines.
          </Text>
        </View>
      </View>
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
    flex: 1,
  },
  pathPill: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  pathPillText: {
    fontSize: 12,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  mediumContainer: {
    gap: 14,
  },
  mediumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  info: {
    marginBottom: 14,
  },
  mediumName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  mediumDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  selectBtn: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  tipBox: {
    backgroundColor: '#FEF08A',
    borderRadius: 12,
    padding: 14,
    marginTop: 'auto',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FACC15',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#854D0E',
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 18,
  },
});

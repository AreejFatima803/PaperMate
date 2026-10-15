import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { SUBJECTS_BY_CLASS } from '../data/boardsAndCurriculum';

export const SubjectSelectScreen = ({
  selectedBoard,
  selectedClass,
  selectedMedium,
  onSelectSubject,
  onBack,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const subjects = SUBJECTS_BY_CLASS[selectedClass?.id] || SUBJECTS_BY_CLASS['9'];
  const isUrdu = selectedMedium?.id === 'urdu';

  const filterCategories = ['All', 'Science', 'Medical', 'Computer', 'Compulsory', 'Arts'];

  const filteredSubjects = subjects.filter((s) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Medical') return s.category.includes('Medical');
    if (selectedFilter === 'Computer') return s.category.includes('Computer');
    if (selectedFilter === 'Science') return s.category.includes('Science');
    if (selectedFilter === 'Compulsory') return s.category.includes('Compulsory');
    if (selectedFilter === 'Arts') return s.category.includes('Arts');
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title="کتاب / مضمون منتخب کریں"
        subtitle="Select Subject (Syllabus 2026)"
        onBack={onBack}
      />

      <View style={styles.content}>
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            🏛️ {selectedBoard?.name} • 🎓 {selectedClass?.name} • 🌐 {selectedMedium?.name}
          </Text>
        </View>

        <Text style={styles.heading}>کونسی کتاب کا پرچہ تیار کرنا ہے؟</Text>
        <Text style={styles.subheading}>
          سال 2026 کے تازہ ترین نصاب کے مطابق تمام کتابیں دستیاب ہیں:
        </Text>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterCategories.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.subjectCard}
              activeOpacity={0.7}
              onPress={() => onSelectSubject(item)}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{item.icon || '📚'}</Text>
              </View>

              <View style={styles.subjectDetails}>
                <View style={styles.subjectHeaderRow}>
                  <Text style={styles.subjectName}>
                    {isUrdu ? item.nameUrdu : item.name}
                  </Text>
                  <View style={styles.badge2026}>
                    <Text style={styles.badge2026Text}>2026</Text>
                  </View>
                </View>

                <Text style={styles.subjectAltName}>
                  {isUrdu ? item.name : item.nameUrdu}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaPill}>🏷️ {item.category}</Text>
                  <Text style={styles.metaPill}>📖 {item.chapters?.length || 0} ابواب (Chapters)</Text>
                </View>
              </View>

              <View style={styles.arrowBox}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    flex: 1,
    padding: 16,
  },
  summaryBar: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  subheading: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  filterScroll: {
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 22,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  badge2026: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#31C48D',
  },
  badge2026Text: {
    fontSize: 10,
    fontWeight: '800',
    color: '#03543F',
  },
  subjectAltName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  metaPill: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

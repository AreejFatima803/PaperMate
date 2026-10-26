import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
  const subjects = SUBJECTS_BY_CLASS[selectedClass?.id] || SUBJECTS_BY_CLASS['9'];

  return (
    <View style={styles.container}>
      <Header
        title="Select Subject"
        subtitle="Syllabus 2026 Curriculum"
        onBack={onBack}
      />

      <View style={styles.content}>
        <View style={styles.summaryBar}>
          <Text style={{ marginRight: 6, fontSize: 13 }}>🏛️</Text>
          <Text style={styles.summaryText}>
            {selectedBoard?.name}  •  {selectedClass?.name}  •  {subjects.length} Books
          </Text>
        </View>

        <Text style={styles.heading}>Choose Subject / Book</Text>
        <Text style={styles.subheading}>
          All subjects updated according to 2026 Examination standards:
        </Text>

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.subjectCard}
              activeOpacity={0.75}
              onPress={() => onSelectSubject(item)}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{item.icon || '📚'}</Text>
              </View>

              <View style={styles.subjectDetails}>
                <View style={styles.subjectHeaderRow}>
                  <Text style={styles.subjectName}>{item.name}</Text>
                  <View style={styles.badge2026}>
                    <Text style={styles.badge2026Text}>2026</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaPillView}>
                    <Text style={{ fontSize: 10, marginRight: 4 }}>🏷️</Text>
                    <Text style={styles.metaPillText}>{item.category}</Text>
                  </View>
                  <View style={styles.metaPillView}>
                    <Text style={{ fontSize: 10, marginRight: 4 }}>📖</Text>
                    <Text style={styles.metaPillText}>{item.chapters?.length || 0} Chapters</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 14,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 13,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 24,
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
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 6,
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  metaPillView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  metaPillText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 18,
  },
});

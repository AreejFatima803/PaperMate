import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { academicData } from '../data/academicData';
import { CustomTable } from '../components/CustomTable';

export const ClassDetailScreen = ({ className, onBack, onSelectSubject }) => {
  const classInfo = academicData[className];
  const [activeFilter, setActiveFilter] = useState(
    className === '9th' || className === '10th' ? 'science' : 'pre-medical'
  );

  if (!classInfo) return null;

  const filters = className === '9th' || className === '10th'
    ? [
        { id: 'science', label: '🔬 Science Group' },
        { id: 'arts', label: '🎨 Arts Group' }
      ]
    : [
        { id: 'pre-medical', label: '🩺 Pre-Medical' },
        { id: 'pre-engineering', label: '⚙️ Pre-Engineering' },
        { id: 'ics', label: '💻 ICS' }
      ];

  const filteredSubjects = classInfo.subjects.filter(s =>
    s.category === 'compulsory' ||
    s.category === activeFilter ||
    (s.groups && s.groups.includes(activeFilter))
  );

  const headers = [
    { title: 'Subject Name', flex: 3 },
    { title: 'Chapters', flex: 2 },
    { title: 'Action', flex: 2, alignRight: true }
  ];

  const tableRows = filteredSubjects.map(sub => ({
    subject: sub,
    cells: [
      <Text style={styles.subjectTitle}>{sub.name}</Text>,
      <Text style={styles.chaptersCount}>{sub.chapters} Chapters</Text>,
      <TouchableOpacity style={styles.openBtn} onPress={() => onSelectSubject(sub)}>
        <Text style={styles.openBtnText}>Open Portal →</Text>
      </TouchableOpacity>
    ]
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to Classes</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb}>Home / <Text style={styles.breadcrumbActive}>{classInfo.className}</Text></Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Subjects ({classInfo.className})</Text>
        <View style={styles.filterPills}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.pill, activeFilter === f.id && styles.activePill]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text style={[styles.pillText, activeFilter === f.id && styles.activePillText]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <CustomTable
        headers={headers}
        data={tableRows}
        onRowPress={(row) => onSelectSubject(row.subject)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: 24,
    alignItems: 'center'
  },
  headerBar: {
    width: '92%',
    maxWidth: 980,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  backBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary
  },
  breadcrumb: {
    fontSize: 14,
    color: theme.colors.textMuted
  },
  breadcrumbActive: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  sectionHeader: {
    width: '92%',
    maxWidth: 980,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff'
  },
  activePill: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary
  },
  activePillText: {
    color: '#ffffff'
  },
  subjectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  chaptersCount: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  openBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primaryBorder,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  openBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary
  }
});

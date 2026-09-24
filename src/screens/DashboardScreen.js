import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { CustomTable } from '../components/CustomTable';

export const DashboardScreen = ({ onSelectClass }) => {
  const classesData = [
    { key: '9th', title: '9th Class', category: 'Matric Part I', subjects: '8 Subjects', badgeStyle: theme.colors.badges.ninth },
    { key: '10th', title: '10th Class', category: 'Matric Part II', subjects: '8 Subjects', badgeStyle: theme.colors.badges.tenth },
    { key: '1st Year', title: '1st Year', category: 'Inter Part I', subjects: '8 Subjects', badgeStyle: theme.colors.badges.firstYear },
    { key: 'Second Year', title: 'Second Year', category: 'Inter Part II', subjects: '8 Subjects', badgeStyle: theme.colors.badges.secondYear }
  ];

  const headers = [
    { title: 'Class Name', flex: 2 },
    { title: 'Category', flex: 2 },
    { title: 'Subjects', flex: 2 },
    { title: 'Action', flex: 2, alignRight: true }
  ];

  const tableRows = classesData.map(cls => ({
    classKey: cls.key,
    cells: [
      <Text style={styles.classTitle}>{cls.title}</Text>,
      <View style={[styles.badge, { backgroundColor: cls.badgeStyle.bg }]}>
        <Text style={[styles.badgeText, { color: cls.badgeStyle.text }]}>{cls.category}</Text>
      </View>,
      <Text style={styles.subCount}>{cls.subjects}</Text>,
      <TouchableOpacity style={styles.exploreBtn} onPress={() => onSelectClass(cls.key)}>
        <Text style={styles.exploreBtnText}>Explore Class →</Text>
      </TouchableOpacity>
    ]
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Your Class</Text>
        <Text style={styles.sectionTag}>High School & Intermediate</Text>
      </View>

      <CustomTable
        headers={headers}
        data={tableRows}
        onRowPress={(row) => onSelectClass(row.classKey)}
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
  sectionHeader: {
    width: '92%',
    maxWidth: 980,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  sectionTag: {
    fontSize: 14,
    color: theme.colors.textMuted
  },
  classTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  subCount: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  exploreBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primaryBorder,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary
  }
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { CustomTable } from '../components/CustomTable';
import { syllabusService } from '../services/syllabusService';

export const ChapterPortionScreen = ({ chapterData, onBack, onSelectPortion }) => {
  const [dbChapter, setDbChapter] = React.useState(null);

  const { subject, className, chapterNum, chapterTitle } = chapterData || {};

  React.useEffect(() => {
    let isMounted = true;
    if (className && subject && chapterNum) {
      syllabusService.getChapter(className, subject, chapterNum).then(c => {
        if (isMounted && c) setDbChapter(c);
      });
    }
    return () => { isMounted = false; };
  }, [className, subject, chapterNum]);

  if (!chapterData) return null;

  const actualName = dbChapter?.chapterName || chapterTitle || `Chapter ${chapterNum}`;

  const handleRowPress = (row) => {
    onSelectPortion(row.portionKey, row.portionName);
  };

  const portionOptions = [
    {
      key: 'firstHalf',
      name: '1st Half',
      scope: `Chapter ${chapterNum}: First Half Portion (${actualName})`,
      badgeColor: '#0369a1',
      badgeBg: '#e0f2fe'
    },
    {
      key: 'secondHalf',
      name: '2nd Half',
      scope: `Chapter ${chapterNum}: Second Half Portion (${actualName})`,
      badgeColor: '#7e22ce',
      badgeBg: '#f3e8ff'
    },
    {
      key: 'full',
      name: 'Full Chapter',
      scope: `Chapter ${chapterNum}: Complete Full Syllabus (${actualName})`,
      badgeColor: '#b45309',
      badgeBg: '#fef3c7'
    }
  ];

  const tableHeaders = [
    { title: 'Option No', flex: 1.5 },
    { title: 'Portion Type', flex: 2 },
    { title: 'Syllabus Scope', flex: 4.5 },
    { title: 'Action', flex: 2 }
  ];

  const tableRows = portionOptions.map((opt, index) => ({
    portionKey: opt.key,
    portionName: opt.name,
    cells: [
      <Text key="sr" style={styles.srText}>0{index + 1}</Text>,
      <View key="type" style={[styles.badge, { backgroundColor: opt.badgeBg }]}>
        <Text style={[styles.badgeText, { color: opt.badgeColor }]}>{opt.name}</Text>
      </View>,
      <View key="scope">
        <Text style={styles.scopeTitle}>{opt.scope}</Text>
        <Text style={styles.scopeSub}>{opt.questions}</Text>
      </View>,
      <TouchableOpacity
        key="action"
        style={styles.selectBtn}
        onPress={() => onSelectPortion(opt.key, opt.name)}
      >
        <Text style={styles.selectBtnText}>Select {opt.name} →</Text>
      </TouchableOpacity>
    ]
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to Chapters</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb}>
          {className} / {subject?.name} / <Text style={styles.breadcrumbActive}>Chapter {chapterNum}</Text>
        </Text>
      </View>



      {/* Table Section */}
      <View style={styles.tableWrapper}>
        <Text style={styles.tableSectionTitle}>📋 Chapter Portion Options Table</Text>
        <CustomTable
          headers={tableHeaders}
          data={tableRows}
          onRowPress={handleRowPress}
        />
      </View>
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
  chapterCard: {
    width: '92%',
    maxWidth: 980,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primaryBorder,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24
  },
  chapterHeaderTag: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 6
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6
  },
  chapterSub: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  tableWrapper: {
    width: '92%',
    maxWidth: 980
  },
  tableSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 14
  },
  srText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800'
  },
  scopeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  scopeSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2
  },
  selectBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff'
  }
});

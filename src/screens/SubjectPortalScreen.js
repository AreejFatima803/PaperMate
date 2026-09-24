import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { sampleChapterTitles, sampleFormulas, sampleQuizQuestions } from '../data/academicData';
import { CustomTable } from '../components/CustomTable';
import { ChapterOptionsModal } from '../components/ChapterOptionsModal';
import { syllabusService } from '../services/syllabusService';

export const SubjectPortalScreen = ({ subject, className, onBack, onSelectChapter, onOpenPaperBuilder }) => {
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChapterData, setSelectedChapterData] = useState(null);
  const [syllabusChapters, setSyllabusChapters] = useState([]);

  React.useEffect(() => {
    let isMounted = true;
    syllabusService.getChapters(className, subject).then(chList => {
      if (isMounted && Array.isArray(chList)) {
        setSyllabusChapters(chList);
      }
    });
    return () => { isMounted = false; };
  }, [className, subject]);

  if (!subject) return null;

  const getChapterTitle = (subj, idx) => {
    if (syllabusChapters[idx] && syllabusChapters[idx].chapterName) {
      return syllabusChapters[idx].chapterName;
    }
    if (!subj) return `Chapter ${idx + 1} Core Concepts`;
    if (subj.id && sampleChapterTitles[subj.id] && sampleChapterTitles[subj.id][idx]) {
      return sampleChapterTitles[subj.id][idx];
    }
    if (sampleChapterTitles[subj.name] && sampleChapterTitles[subj.name][idx]) {
      return sampleChapterTitles[subj.name][idx];
    }
    const cleanName = (subj.name || '').replace(/\s*\(.*?\)\s*/g, '').trim();
    if (sampleChapterTitles[cleanName] && sampleChapterTitles[cleanName][idx]) {
      return sampleChapterTitles[cleanName][idx];
    }
    return `Chapter ${idx + 1}: ${cleanName} Core Topics`;
  };

  const handleRowPress = (row) => {
    const chTitle = getChapterTitle(subject, row.chapterNum - 1);
    const chapterObj = { subject, className, chapterNum: row.chapterNum, chapterTitle: chTitle };
    if (onSelectChapter) {
      onSelectChapter(chapterObj);
    } else {
      setSelectedChapterData(chapterObj);
      setModalVisible(true);
    }
  };

  // Render Chapters Table Rows
  const totalChapters = Math.max(subject.chapters || 0, syllabusChapters.length);
  const chapterRows = [];
  for (let i = 1; i <= (totalChapters || 1); i++) {
    const chTitle = getChapterTitle(subject, i - 1);
    chapterRows.push({
      chapterNum: i,
      cells: [
        <Text style={styles.chapterNum}>Chapter {i}</Text>,
        <Text style={styles.chapterTitle}>{chTitle}</Text>
      ]
    });
  }

  const chapterHeaders = [
    { title: 'Chapter No', flex: 2 },
    { title: 'Chapter Title', flex: 4 }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to {className}</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb}>{className} / <Text style={styles.breadcrumbActive}>{subject.name}</Text></Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'chapters' && styles.activeTabBtn]}
          onPress={() => setActiveTab('chapters')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'chapters' && styles.activeTabBtnText]}>📋 Chapter Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'quiz' && styles.activeTabBtn]}
          onPress={() => setActiveTab('quiz')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'quiz' && styles.activeTabBtnText]}>🧠 Practice Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'formulas' && styles.activeTabBtn]}
          onPress={() => setActiveTab('formulas')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'formulas' && styles.activeTabBtnText]}>💡 Key Formulas</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content 1: Chapter Notes Table */}
      {activeTab === 'chapters' && (
        <CustomTable
          headers={chapterHeaders}
          data={chapterRows}
          onRowPress={handleRowPress}
        />
      )}

      {/* Tab Content 2: Quiz Engine */}
      {activeTab === 'quiz' && (
        <View style={styles.quizCard}>
          <Text style={styles.quizTitle}>Interactive MCQ Test</Text>
          <Text style={styles.quizQuestion}>{sampleQuizQuestions[0].q}</Text>

          {sampleQuizQuestions[0].options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.quizOptionBtn,
                selectedQuizAnswer === idx && (idx === sampleQuizQuestions[0].correct ? styles.correctOpt : styles.wrongOpt)
              ]}
              onPress={() => setSelectedQuizAnswer(idx)}
            >
              <Text style={styles.optText}>{String.fromCharCode(65 + idx)}. {opt}</Text>
            </TouchableOpacity>
          ))}

          {selectedQuizAnswer !== null && (
            <View style={styles.expBox}>
              <Text style={styles.expText}>💡 {sampleQuizQuestions[0].exp}</Text>
            </View>
          )}
        </View>
      )}

      {/* Tab Content 3: Key Formulas Sheet */}
      {activeTab === 'formulas' && (
        <View style={styles.formulasContainer}>
          {sampleFormulas.map((item, idx) => (
            <View key={idx} style={styles.formulaBox}>
              <Text style={styles.formulaTitle}>{item.title}</Text>
              <Text style={styles.formulaCode}>{item.formula}</Text>
              <Text style={styles.formulaDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      )}

      <ChapterOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        chapterData={selectedChapterData}
        onOpenPaperBuilder={onOpenPaperBuilder}
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
  tabsContainer: {
    width: '92%',
    maxWidth: 980,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff'
  },
  activeTabBtn: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary
  },
  activeTabBtnText: {
    color: '#ffffff'
  },
  chapterNum: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary
  },
  quizCard: {
    width: '92%',
    maxWidth: 980,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 24
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 12
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16
  },
  quizOptionBtn: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  correctOpt: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e'
  },
  wrongOpt: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444'
  },
  optText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary
  },
  expBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  expText: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  formulasContainer: {
    width: '92%',
    maxWidth: 980,
    gap: 14
  },
  formulaBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 18
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 6
  },
  formulaCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    marginVertical: 8
  },
  formulaDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary
  }
});

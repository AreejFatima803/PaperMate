import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';

export const SyllabusSelectScreen = ({
  selectedBoard,
  selectedClass,
  selectedSubject,
  onProceedToPattern,
  onBack,
}) => {
  const chapters = selectedSubject?.chapters || [];

  // Screen View: 'scope' (1st half, 2nd half, full book, chapterwise) | 'chapters' (dedicated chapter selection screen)
  const [screenView, setScreenView] = useState('scope');
  const [syllabusType, setSyllabusType] = useState('full');

  // By default, ONLY the 1st chapter is selected
  const [selectedChapters, setSelectedChapters] = useState(
    chapters.length > 0 ? [chapters[0].id] : []
  );

  // Reset to initial state when subject changes
  useEffect(() => {
    setScreenView('scope');
    setSyllabusType('full');
    if (chapters.length > 0) {
      setSelectedChapters([chapters[0].id]);
    } else {
      setSelectedChapters([]);
    }
  }, [selectedSubject]);

  // Handle hardware Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (screenView === 'chapters') {
        setScreenView('scope');
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screenView]);

  // Allow user complete freedom to toggle any chapter
  const toggleChapter = (chapterId) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(selectedChapters.filter((id) => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const selectOnlyFirstChapter = () => {
    if (chapters.length > 0) {
      setSelectedChapters([chapters[0].id]);
    }
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map((c) => c.id));
  };

  const deselectAllChapters = () => {
    setSelectedChapters([]);
  };

  // When user clicks Chapter Wise option: open new screen with ONLY 1st chapter pre-selected
  const handleOpenChapterWiseScreen = () => {
    setSyllabusType('chapterwise');
    if (chapters.length > 0) {
      setSelectedChapters([chapters[0].id]);
    } else {
      setSelectedChapters([]);
    }
    setScreenView('chapters');
  };

  // Continue from Scope screen (for 1st Half, 2nd Half, Full Book)
  const handleContinueFromScope = () => {
    let finalChapters = [];
    const halfLen = Math.ceil(chapters.length / 2);

    if (syllabusType === 'half1') {
      finalChapters = chapters.slice(0, halfLen).map((c) => c.id);
    } else if (syllabusType === 'half2') {
      finalChapters = chapters.slice(halfLen).map((c) => c.id);
    } else if (syllabusType === 'full') {
      finalChapters = chapters.map((c) => c.id);
    } else if (syllabusType === 'chapterwise') {
      handleOpenChapterWiseScreen();
      return;
    }

    onProceedToPattern({
      syllabusType,
      selectedChapters: finalChapters,
    });
  };

  // Continue from Chapters screen
  const handleContinueFromChapters = () => {
    if (selectedChapters.length === 0) {
      Alert.alert(
        'Chapter Required',
        'Please select at least one chapter to create the exam paper.'
      );
      return;
    }

    onProceedToPattern({
      syllabusType: 'chapterwise',
      selectedChapters: selectedChapters,
    });
  };

  // ========================================================
  // VIEW 2: DEDICATED CHAPTER SELECTION SCREEN
  // ========================================================
  if (screenView === 'chapters') {
    return (
      <View style={styles.container}>
        <Header
          title="Select Chapters"
          subtitle={`${selectedSubject?.name} • ${selectedClass?.name}`}
          onBack={() => setScreenView('scope')}
        />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Summary / Counter Bar */}
          <View style={styles.chaptersInfoCard}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoTitle}>Custom Chapters Selection</Text>
              <Text style={styles.infoSubtitle}>
                Tap any chapter to include or exclude from paper
              </Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>
                {selectedChapters.length} / {chapters.length}
              </Text>
            </View>
          </View>

          {/* Quick Action Chips */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[
                styles.actionChip,
                selectedChapters.length === 1 &&
                  chapters.length > 0 &&
                  selectedChapters[0] === chapters[0].id &&
                  styles.actionChipActive,
              ]}
              onPress={selectOnlyFirstChapter}
            >
              <Text style={styles.actionChipText}>📌 Only 1st Chapter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionChip,
                selectedChapters.length === chapters.length && styles.actionChipActive,
              ]}
              onPress={selectAllChapters}
            >
              <Text style={styles.actionChipText}>✓ Select All ({chapters.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionChip} onPress={deselectAllChapters}>
              <Text style={styles.actionChipText}>✕ Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Chapters Checklist */}
          <View style={styles.chaptersListBox}>
            <Text style={styles.listHeading}>
              Chapters List ({chapters.length} Total Chapters):
            </Text>

            {chapters.map((chap, index) => {
              const isChecked = selectedChapters.includes(chap.id);
              const isFirst = index === 0;

              return (
                <TouchableOpacity
                  key={chap.id}
                  style={[
                    styles.chapterRowCard,
                    isChecked && styles.chapterRowCardChecked,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => toggleChapter(chap.id)}
                >
                  {/* Custom Checkbox */}
                  <View
                    style={[
                      styles.checkboxBox,
                      isChecked && styles.checkboxBoxChecked,
                    ]}
                  >
                    {isChecked && <Text style={styles.checkIcon}>✓</Text>}
                  </View>

                  {/* Chapter Info */}
                  <View style={styles.chapterTextWrap}>
                    <View style={styles.chapterTitleRow}>
                      <Text
                        style={[
                          styles.chapterTitleText,
                          isChecked && styles.chapterTitleTextChecked,
                        ]}
                      >
                        {chap.name}
                      </Text>
                      {isFirst && (
                        <View style={styles.defaultTag}>
                          <Text style={styles.defaultTagText}>Default</Text>
                        </View>
                      )}
                    </View>

                    {chap.nameUrdu ? (
                      <Text style={styles.chapterUrduText}>
                        {chap.nameUrdu}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Bottom Proceed Button */}
        <View style={styles.footerBar}>
          <CustomButton
            title={
              selectedChapters.length === 0
                ? '⚠️ Select At Least 1 Chapter'
                : `Configure Pattern (${selectedChapters.length} Selected) →`
            }
            onPress={handleContinueFromChapters}
            size="lg"
            variant={selectedChapters.length === 0 ? 'secondary' : 'accent'}
            disabled={selectedChapters.length === 0}
          />
        </View>
      </View>
    );
  }

  // ========================================================
  // VIEW 1: SYLLABUS SCOPE SELECTION (1st Half, 2nd Half, Full, Chapterwise)
  // ========================================================
  return (
    <View style={styles.container}>
      <Header
        title="Select Syllabus Scope"
        subtitle="Choose Chapters or Book Coverage"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scopeScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Compact Summary & Book PDF Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryEmoji}>📚</Text>
            <Text style={styles.summaryText} numberOfLines={1}>
              {selectedSubject?.name} • {selectedClass?.name}
            </Text>
          </View>
        </View>

        <Text style={styles.heading}>Choose Syllabus Range</Text>
        <Text style={styles.subheading}>
          Select one of the 4 standard syllabus options below:
        </Text>

        {/* 4 Scope Cards with generous height & rich details */}
        <View style={styles.optionsGrid}>
          {/* 1st Half Book */}
          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'half1' && styles.scopeCardActive]}
            activeOpacity={0.75}
            onPress={() => setSyllabusType('half1')}
          >
            <View style={[styles.scopeIconBox, syllabusType === 'half1' && styles.scopeIconBoxActive]}>
              <Text style={styles.scopeEmoji}>📖</Text>
            </View>
            <View style={styles.scopeTextCol}>
              <View style={styles.titleWithBadgeRow}>
                <Text style={[styles.scopeTitle, syllabusType === 'half1' && styles.scopeTitleActive]}>
                  1st Half Book
                </Text>
                <View style={styles.halfBadge}>
                  <Text style={styles.halfBadgeText}>50% Syllabus</Text>
                </View>
              </View>
              <Text style={styles.scopeDesc}>
                Chapters 1 to {Math.ceil(chapters.length / 2)} (Initial 50% syllabus coverage)
              </Text>
            </View>
            <View style={[styles.radioCircle, syllabusType === 'half1' && styles.radioCircleActive]}>
              {syllabusType === 'half1' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* 2nd Half Book */}
          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'half2' && styles.scopeCardActive]}
            activeOpacity={0.75}
            onPress={() => setSyllabusType('half2')}
          >
            <View style={[styles.scopeIconBox, syllabusType === 'half2' && styles.scopeIconBoxActive]}>
              <Text style={styles.scopeEmoji}>📚</Text>
            </View>
            <View style={styles.scopeTextCol}>
              <View style={styles.titleWithBadgeRow}>
                <Text style={[styles.scopeTitle, syllabusType === 'half2' && styles.scopeTitleActive]}>
                  2nd Half Book
                </Text>
                <View style={styles.halfBadge}>
                  <Text style={styles.halfBadgeText}>50% Syllabus</Text>
                </View>
              </View>
              <Text style={styles.scopeDesc}>
                Chapters {Math.ceil(chapters.length / 2) + 1} to {chapters.length} (Remaining 50% syllabus coverage)
              </Text>
            </View>
            <View style={[styles.radioCircle, syllabusType === 'half2' && styles.radioCircleActive]}>
              {syllabusType === 'half2' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Full Book */}
          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'full' && styles.scopeCardActive]}
            activeOpacity={0.75}
            onPress={() => setSyllabusType('full')}
          >
            <View style={[styles.scopeIconBox, syllabusType === 'full' && styles.scopeIconBoxActive]}>
              <Text style={styles.scopeEmoji}>🎯</Text>
            </View>
            <View style={styles.scopeTextCol}>
              <View style={styles.titleWithBadgeRow}>
                <Text style={[styles.scopeTitle, syllabusType === 'full' && styles.scopeTitleActive]}>
                  Full Book
                </Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Complete 100%</Text>
                </View>
              </View>
              <Text style={styles.scopeDesc}>
                Complete course grand exam (All {chapters.length} Chapters official board pattern)
              </Text>
            </View>
            <View style={[styles.radioCircle, syllabusType === 'full' && styles.radioCircleActive]}>
              {syllabusType === 'full' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Chapter Wise */}
          <TouchableOpacity
            style={[
              styles.scopeCard,
              styles.chapterWiseCard,
              syllabusType === 'chapterwise' && styles.scopeCardActive,
            ]}
            activeOpacity={0.75}
            onPress={handleOpenChapterWiseScreen}
          >
            <View style={[styles.scopeIconBox, { backgroundColor: '#DEF7EC', borderColor: '#86EFAC' }]}>
              <Text style={styles.scopeEmoji}>📑</Text>
            </View>
            <View style={styles.scopeTextCol}>
              <View style={styles.titleWithBadgeRow}>
                <Text style={[styles.scopeTitle, styles.chapterWiseTitle]}>
                  Chapter Wise
                </Text>
                <View style={styles.customBadge}>
                  <Text style={styles.customBadgeText}>Custom List</Text>
                </View>
              </View>
              <Text style={styles.scopeDesc}>
                Select individual chapters, specific units & customized topics
              </Text>
            </View>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Continue Button */}
      <View style={styles.footerBar}>
        <CustomButton
          title={
            syllabusType === 'chapterwise'
              ? 'Select Chapters List →'
              : `Proceed with ${
                  syllabusType === 'half1'
                    ? '1st Half Book'
                    : syllabusType === 'half2'
                    ? '2nd Half Book'
                    : 'Full Book'
                } →`
          }
          onPress={
            syllabusType === 'chapterwise'
              ? handleOpenChapterWiseScreen
              : handleContinueFromScope
          }
          size="lg"
          variant={syllabusType === 'chapterwise' ? 'accent' : 'primary'}
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
    padding: 16,
  },
  scopeScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  summaryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  optionsGrid: {
    gap: 13,
    marginBottom: 20,
  },
  scopeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 90,
  },
  scopeCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F7FF',
  },
  chapterWiseCard: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  scopeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scopeIconBoxActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  scopeEmoji: {
    fontSize: 23,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  scopeTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  scopeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  scopeTitleActive: {
    color: theme.colors.primary,
  },
  chapterWiseTitle: {
    color: '#15803D',
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  halfBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  halfBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  recommendedBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#03543F',
  },
  customBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  scopeDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#15803D',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 18,
  },


  // Chapters Screen Styles
  chaptersInfoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  counterBadge: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterBadgeText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  actionChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  actionChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  chaptersListBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chapterRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  chapterRowCardChecked: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxBoxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  chapterTextWrap: {
    flex: 1,
  },
  chapterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  chapterTitleTextChecked: {
    color: theme.colors.primaryDark,
  },
  defaultTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  defaultTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  chapterUrduText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  bottomSpace: {
    height: 90,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 8,
  },
});

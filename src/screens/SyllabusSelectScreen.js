import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';

export const SyllabusSelectScreen = ({
  selectedBoard,
  selectedClass,
  selectedMedium,
  selectedSubject,
  onProceedToPattern,
  onBack,
}) => {
  const [syllabusType, setSyllabusType] = useState('chapterwise'); // 'half1' | 'half2' | 'full' | 'chapterwise'
  const [selectedChapters, setSelectedChapters] = useState(
    selectedSubject.chapters ? selectedSubject.chapters.map((c) => c.id) : []
  );

  const isUrdu = selectedMedium?.id === 'urdu';
  const chapters = selectedSubject.chapters || [];

  const toggleChapter = (chapterId) => {
    if (selectedChapters.includes(chapterId)) {
      if (selectedChapters.length === 1) {
        Alert.alert('توجہ فرمائیں', 'کم از کم ایک چیپٹر منتخب کرنا ضروری ہے۔');
        return;
      }
      setSelectedChapters(selectedChapters.filter((id) => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map((c) => c.id));
  };

  const handleContinue = () => {
    let finalChapters = [];
    const halfLen = Math.ceil(chapters.length / 2);

    if (syllabusType === 'half1') {
      finalChapters = chapters.slice(0, halfLen).map((c) => c.id);
    } else if (syllabusType === 'half2') {
      finalChapters = chapters.slice(halfLen).map((c) => c.id);
    } else if (syllabusType === 'full') {
      finalChapters = chapters.map((c) => c.id);
    } else {
      finalChapters = selectedChapters;
    }

    onProceedToPattern({
      syllabusType,
      selectedChapters: finalChapters,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="سلیبس کا دائرہ کار"
        subtitle="Select Syllabus Scope"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            📚 {isUrdu ? selectedSubject.nameUrdu : selectedSubject.name} ({selectedClass.name})
          </Text>
        </View>

        <Text style={styles.heading}>کس حصے کا پیپر بنانا ہے؟</Text>
        <Text style={styles.subheading}>
          نیچے دیے گئے اختیارات میں سے ایک طریقہ منتخب کریں:
        </Text>

        {/* 4 Main Options */}
        <View style={styles.optionsGrid}>
          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'half1' && styles.scopeCardActive]}
            onPress={() => setSyllabusType('half1')}
          >
            <Text style={styles.scopeEmoji}>📖</Text>
            <Text style={[styles.scopeTitle, syllabusType === 'half1' && styles.scopeTitleActive]}>
              1st Half Book
            </Text>
            <Text style={styles.scopeDesc}>پہلا نصف حصہ (ابتدائی 50% اسباق)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'half2' && styles.scopeCardActive]}
            onPress={() => setSyllabusType('half2')}
          >
            <Text style={styles.scopeEmoji}>📚</Text>
            <Text style={[styles.scopeTitle, syllabusType === 'half2' && styles.scopeTitleActive]}>
              2nd Half Book
            </Text>
            <Text style={styles.scopeDesc}>دوسرا نصف حصہ (آخری 50% اسباق)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'full' && styles.scopeCardActive]}
            onPress={() => setSyllabusType('full')}
          >
            <Text style={styles.scopeEmoji}>🎯</Text>
            <Text style={[styles.scopeTitle, syllabusType === 'full' && styles.scopeTitleActive]}>
              Full Book
            </Text>
            <Text style={styles.scopeDesc}>مکمل کتاب کا سالانہ گرینڈ ٹیسٹ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scopeCard, syllabusType === 'chapterwise' && styles.scopeCardActive]}
            onPress={() => setSyllabusType('chapterwise')}
          >
            <Text style={styles.scopeEmoji}>📑</Text>
            <Text style={[styles.scopeTitle, syllabusType === 'chapterwise' && styles.scopeTitleActive]}>
              Chapter Wise
            </Text>
            <Text style={styles.scopeDesc}>اپنی مرضی کے چیپٹرز منتخب کریں</Text>
          </TouchableOpacity>
        </View>

        {/* Chapter List if Chapter Wise selected */}
        {syllabusType === 'chapterwise' && (
          <View style={styles.chapterSection}>
            <View style={styles.chapterHeader}>
              <Text style={styles.chapterSectionTitle}>ابواب کی فہرست (Select Chapters):</Text>
              <TouchableOpacity onPress={selectAllChapters}>
                <Text style={styles.selectAllText}>سب منتخب کریں</Text>
              </TouchableOpacity>
            </View>

            {chapters.map((chap) => {
              const isChecked = selectedChapters.includes(chap.id);
              return (
                <TouchableOpacity
                  key={chap.id}
                  style={[styles.chapterRow, isChecked && styles.chapterRowSelected]}
                  activeOpacity={0.7}
                  onPress={() => toggleChapter(chap.id)}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                    {isChecked ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                  <Text style={[styles.chapterName, isChecked && styles.chapterNameActive]}>
                    {isUrdu ? chap.nameUrdu : chap.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footerBar}>
        <CustomButton
          title="پیپر پیٹرن سیٹ کریں (Next) →"
          onPress={handleContinue}
          size="lg"
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
  summaryBar: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
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
  optionsGrid: {
    gap: 10,
    marginBottom: 16,
  },
  scopeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  scopeCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F7FF',
  },
  scopeEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  scopeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  scopeTitleActive: {
    color: theme.colors.primary,
  },
  scopeDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chapterSection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 6,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chapterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chapterRowSelected: {
    backgroundColor: '#F9FAFB',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  chapterName: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  chapterNameActive: {
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  bottomSpace: {
    height: 80,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

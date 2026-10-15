import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { PaperHistoryService } from '../services/storageService';

export const GeneratedPaperScreen = ({
  paper,
  onEditPaper,
  onSaveSuccess,
  onNavigateHome,
  onBack,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      await PaperHistoryService.savePaper(paper);
      setIsSaved(true);
      Alert.alert('محفوظ ہو گیا (Saved)', 'یہ پیپر ہسٹری میں کامیابی سے محفوظ کر لیا گیا ہے۔');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      Alert.alert('Error', 'پیپر محفوظ نہیں ہو سکا');
    }
  };

  const handleShare = async () => {
    try {
      let content = `*** ${paper.institutionName} ***\n`;
      content += `${paper.boardName} | ${paper.className} - ${paper.subjectName}\n`;
      content += `Total Marks: ${paper.totalMarks} | Time: ${paper.timeAllowed}\n\n`;

      if (paper.mcqSection?.active) {
        content += `--- OBJECTIVE PART (MCQs) [Marks: ${paper.mcqSection.marks}] ---\n`;
        paper.mcqSection.questions.forEach((q, i) => {
          content += `${i + 1}. ${q.questionText}\n`;
          content += `(A) ${q.options[0]}  (B) ${q.options[1]}  (C) ${q.options[2]}  (D) ${q.options[3]}\n\n`;
        });
      }

      if (paper.shortSections?.length > 0) {
        content += `--- SUBJECTIVE PART-I (SHORT QUESTIONS) ---\n`;
        paper.shortSections.forEach((sec) => {
          content += `\n${sec.titleUr || sec.titleEn}\n`;
          sec.questions.forEach((sq) => {
            content += `(${sq.num}) ${sq.text}\n`;
          });
        });
      }

      if (paper.longSection?.active) {
        content += `\n--- PART-II (LONG QUESTIONS) [Attempt any ${paper.longSection.attemptCount}] ---\n`;
        paper.longSection.questions.forEach((lq) => {
          content += `Q.${lq.num}: ${lq.text} (${lq.marks} Marks)\n\n`;
        });
      }

      await Share.share({
        message: content,
        title: `${paper.subjectName} Exam Paper`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="تیار شدہ پرچہ"
        subtitle="Generated Board Paper (2026)"
        onBack={onBack}
        rightLabel="ہوم (Home)"
        rightAction={onNavigateHome}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Paper Sheet Preview */}
        <View style={styles.paperSheet}>
          {/* Header Block */}
          <View style={styles.paperHeader}>
            <Text style={styles.schoolTitle}>{paper.institutionName}</Text>
            <Text style={styles.boardTitle}>{paper.boardName}</Text>
            <View style={styles.examBadge}>
              <Text style={styles.examBadgeText}>
                ANNUAL EXAMINATION 2026 • {paper.syllabusScope}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaCol}>
                <Text style={styles.metaBold}>Class: </Text>
                {paper.className}
              </Text>
              <Text style={styles.metaCol}>
                <Text style={styles.metaBold}>Subject: </Text>
                {paper.subjectName}
              </Text>
              <Text style={styles.metaCol}>
                <Text style={styles.metaBold}>Medium: </Text>
                {paper.medium}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaCol}>
                <Text style={styles.metaBold}>Total Marks: </Text>
                {paper.totalMarks}
              </Text>
              <Text style={styles.metaCol}>
                <Text style={styles.metaBold}>Time: </Text>
                {paper.timeAllowed}
              </Text>
              <View style={styles.rollBox}>
                <Text style={styles.rollText}>Roll No: _________</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Section 1: Objective Part (MCQs) */}
          {paper.mcqSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>
                  PART - I (OBJECTIVE) / معروضی حصہ
                </Text>
                <Text style={styles.sectionMarksBadge}>
                  Total Marks: {paper.mcqSection.marks}
                </Text>
              </View>
              <Text style={styles.sectionNote}>
                Note: Each question has four options. Tick (✓) or fill circle for correct option.
              </Text>

              {paper.mcqSection.questions.map((q, idx) => (
                <View key={q.id || idx} style={styles.mcqBlock}>
                  <Text style={styles.mcqQuestionText}>
                    <Text style={styles.qNumBold}>Q.1 ({idx + 1}): </Text>
                    {q.questionText}
                  </Text>
                  <View style={styles.optionsGrid}>
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      return (
                        <View key={optIdx} style={styles.optItem}>
                          <Text style={styles.optLetter}>({letter})</Text>
                          <Text style={styles.optText}>{opt}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Section 2: Subjective Part-I (Short Questions) */}
          {paper.shortSections && paper.shortSections.length > 0 && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>
                  PART - II (SUBJECTIVE) / انشائیہ حصہ اول
                </Text>
              </View>

              {paper.shortSections.map((sec, secIdx) => (
                <View key={secIdx} style={styles.shortGroup}>
                  <View style={styles.subHeadingWrap}>
                    <Text style={styles.subHeadingText}>{sec.titleUr || sec.titleEn}</Text>
                    <Text style={styles.subMarksText}>
                      ({sec.attemptCount} × 2 = {sec.totalMarks})
                    </Text>
                  </View>

                  <View style={styles.shortsList}>
                    {sec.questions.map((sq, sqIdx) => (
                      <View key={sq.id || sqIdx} style={styles.shortItem}>
                        <Text style={styles.shortItemNum}>({sq.num})</Text>
                        <Text style={styles.shortItemText}>{sq.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Section 3: Subjective Part-II (Long Questions) */}
          {paper.longSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>
                  PART - III (LONG QUESTIONS) / انشائیہ حصہ دوم
                </Text>
                <Text style={styles.sectionMarksBadge}>
                  Total Marks: {paper.longSection.marks}
                </Text>
              </View>
              <Text style={styles.sectionNote}>
                Note: Attempt any {paper.longSection.attemptCount} questions out of {paper.longSection.totalCount}. Each carries 9 marks.
              </Text>

              {paper.longSection.questions.map((lq, lIdx) => (
                <View key={lq.id || lIdx} style={styles.longBlock}>
                  <View style={styles.longHeaderRow}>
                    <Text style={styles.longNumBold}>سوال نمبر {lq.num} (Q.{lq.num}):</Text>
                    <Text style={styles.longMarks}>({lq.marks} Marks)</Text>
                  </View>
                  <Text style={styles.longQuestionText}>{lq.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Extra Humanities Section */}
          {paper.extraSections && paper.extraSections.map((sec, idx) => (
            <View key={idx} style={styles.paperSection}>
              <Text style={styles.subHeadingText}>{sec.titleUr || sec.titleEn}</Text>
              <Text style={styles.longQuestionText}>{sec.text}</Text>
            </View>
          ))}

          {/* Paper Footer */}
          <View style={styles.paperFooter}>
            <Text style={styles.paperFooterText}>
              ★ Best of Luck for 2026 Board Examinations ★
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Bottom Bar: Edit & Save Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => onEditPaper(paper)}
        >
          <Text style={styles.editBtnText}>✏️ پیپر ایڈٹ کریں (Edit)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, isSaved && styles.saveBtnDone]}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {isSaved ? '✓ محفوظ ہے (Saved)' : '💾 Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          activeOpacity={0.8}
          onPress={handleShare}
        >
          <Text style={styles.shareBtnText}>📤 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    padding: 12,
  },
  paperSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  paperHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  boardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 2,
  },
  examBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginVertical: 6,
    borderWidth: 0.5,
    borderColor: '#9CA3AF',
  },
  examBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 3,
  },
  metaCol: {
    fontSize: 12,
    color: '#374151',
  },
  metaBold: {
    fontWeight: '700',
    color: '#111827',
  },
  rollBox: {
    borderWidth: 1,
    borderColor: '#6B7280',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
  },
  rollText: {
    fontSize: 11,
    color: '#374151',
  },
  divider: {
    height: 2,
    backgroundColor: '#111827',
    marginVertical: 10,
  },
  paperSection: {
    marginBottom: 16,
  },
  sectionHeadingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1F2937',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  sectionMarksBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  sectionNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 8,
  },
  mcqBlock: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  mcqQuestionText: {
    fontSize: 13,
    color: '#111827',
    lineHeight: 18,
  },
  qNumBold: {
    fontWeight: '700',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  optItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  optLetter: {
    fontWeight: '700',
    fontSize: 12,
    color: '#4B5563',
    marginRight: 4,
  },
  optText: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
  },
  shortGroup: {
    marginBottom: 12,
  },
  subHeadingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  subHeadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  subMarksText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  shortsList: {
    marginTop: 4,
  },
  shortItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  shortItemNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginRight: 6,
    width: 24,
  },
  shortItemText: {
    fontSize: 13,
    color: '#1F2937',
    flex: 1,
    lineHeight: 18,
  },
  longBlock: {
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  longHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  longNumBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  longMarks: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  longQuestionText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
  paperFooter: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    alignItems: 'center',
  },
  paperFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  bottomSpace: {
    height: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 8,
  },
  editBtn: {
    flex: 1.5,
    backgroundColor: '#FEF08A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAB308',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#713F12',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDone: {
    backgroundColor: theme.colors.accent,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
});

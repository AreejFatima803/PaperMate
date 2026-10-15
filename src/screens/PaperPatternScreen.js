import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';

export const PaperPatternScreen = ({
  selectedBoard,
  selectedClass,
  selectedMedium,
  selectedSubject,
  syllabusConfig,
  onGeneratePaper,
  onBack,
}) => {
  const isScience = selectedSubject.type === 'science';
  const isUrdu = selectedMedium?.id === 'urdu';

  // Institute header
  const [instituteName, setInstituteName] = useState('THE EDUCATORS / GOVT HIGHER SECONDARY SCHOOL');

  // Question 1: MCQs
  const [mcqCount, setMcqCount] = useState(isScience ? '12' : '15');
  const [skipMcq, setSkipMcq] = useState(false);

  // Question 2: Short Questions Part 1
  const [q2Count, setQ2Count] = useState('5');
  const [q2Total, setQ2Total] = useState('8');
  const [skipQ2, setSkipQ2] = useState(false);

  // Question 3: Short Questions Part 2
  const [q3Count, setQ3Count] = useState('5');
  const [q3Total, setQ3Total] = useState('8');
  const [skipQ3, setSkipQ3] = useState(false);

  // Question 4: Short Questions Part 3
  const [q4Count, setQ4Count] = useState('5');
  const [q4Total, setQ4Total] = useState('8');
  const [skipQ4, setSkipQ4] = useState(false);

  // Question 5+: Long Questions
  const [longCount, setLongCount] = useState('2');
  const [longTotal, setLongTotal] = useState('3');
  const [skipLong, setSkipLong] = useState(false);

  // Humanities extra (English / Urdu / Islamiat)
  const [includeEssay, setIncludeEssay] = useState(!isScience);

  // Generating modal animation (2 seconds)
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    // User requested: "uss pr click krny sy paper 2 sec mn bn kr a jay ga"
    setTimeout(() => {
      setIsGenerating(false);
      onGeneratePaper({
        institutionName: instituteName,
        board: selectedBoard,
        classInfo: selectedClass,
        medium: selectedMedium,
        subject: selectedSubject,
        syllabusType: syllabusConfig.syllabusType,
        selectedChapters: syllabusConfig.selectedChapters,
        mcqCount: skipMcq ? 0 : parseInt(mcqCount, 10) || 0,
        skipMcq,
        q2Count: skipQ2 ? 0 : parseInt(q2Count, 10) || 0,
        q2Total: parseInt(q2Total, 10) || 8,
        skipQ2,
        q3Count: skipQ3 ? 0 : parseInt(q3Count, 10) || 0,
        q3Total: parseInt(q3Total, 10) || 8,
        skipQ3,
        q4Count: skipQ4 ? 0 : parseInt(q4Count, 10) || 0,
        q4Total: parseInt(q4Total, 10) || 8,
        skipQ4,
        longCount: skipLong ? 0 : parseInt(longCount, 10) || 0,
        longTotal: parseInt(longTotal, 10) || 3,
        skipLong,
        humanitiesConfig: {
          includeEssay,
        },
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Header
        title="پیپر پیٹرن اور سوالات کی تقسیم"
        subtitle="Question Breakdown & Marks"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            📌 {selectedSubject.name} • {selectedClass.name} • 2026 Board Pattern
          </Text>
        </View>

        {/* Institution Name */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏫 ادارہ / سکول کا نام (Header on Paper):</Text>
          <TextInput
            style={styles.textInput}
            value={instituteName}
            onChangeText={setInstituteName}
            placeholder="سکول یا اکیڈمی کا نام درج کریں..."
          />
        </View>

        {/* Question #1: MCQs */}
        <View style={[styles.sectionCard, skipMcq && styles.cardDisabled]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.questionMainTitle}>سوال نمبر 01: معروضی سوالات (MCQs)</Text>
              <Text style={styles.questionSubtitle}>Multiple Choice Questions (1 Mark Each)</Text>
            </View>
            <View style={styles.skipWrap}>
              <Text style={styles.skipLabel}>Skip (چھوڑیں)</Text>
              <Switch value={skipMcq} onValueChange={setSkipMcq} />
            </View>
          </View>

          {!skipMcq && (
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>کل ایم سی کیوز کی تعداد درج کریں:</Text>
              <TextInput
                style={styles.numberInput}
                keyboardType="numeric"
                value={mcqCount}
                onChangeText={setMcqCount}
                maxLength={2}
              />
            </View>
          )}
        </View>

        {/* Question #2: Short Questions Part-I */}
        <View style={[styles.sectionCard, skipQ2 && styles.cardDisabled]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.questionMainTitle}>سوال نمبر 02: مختصر سوالات (حصہ اول)</Text>
              <Text style={styles.questionSubtitle}>Short Questions - Section 1 (2 Marks Each)</Text>
            </View>
            <View style={styles.skipWrap}>
              <Text style={styles.skipLabel}>Skip (چھوڑیں)</Text>
              <Switch value={skipQ2} onValueChange={setSkipQ2} />
            </View>
          </View>

          {!skipQ2 && (
            <View style={styles.countsRow}>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کتنے حل کرنے ہیں؟</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q2Count}
                  onChangeText={setQ2Count}
                  maxLength={2}
                />
              </View>
              <Text style={styles.ofText}>out of</Text>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کل سوالات:</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q2Total}
                  onChangeText={setQ2Total}
                  maxLength={2}
                />
              </View>
            </View>
          )}
        </View>

        {/* Question #3: Short Questions Part-II */}
        <View style={[styles.sectionCard, skipQ3 && styles.cardDisabled]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.questionMainTitle}>سوال نمبر 03: مختصر سوالات (حصہ دوم)</Text>
              <Text style={styles.questionSubtitle}>Short Questions - Section 2</Text>
            </View>
            <View style={styles.skipWrap}>
              <Text style={styles.skipLabel}>Skip (چھوڑیں)</Text>
              <Switch value={skipQ3} onValueChange={setSkipQ3} />
            </View>
          </View>

          {!skipQ3 && (
            <View style={styles.countsRow}>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کتنے حل کرنے ہیں؟</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q3Count}
                  onChangeText={setQ3Count}
                  maxLength={2}
                />
              </View>
              <Text style={styles.ofText}>out of</Text>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کل سوالات:</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q3Total}
                  onChangeText={setQ3Total}
                  maxLength={2}
                />
              </View>
            </View>
          )}
        </View>

        {/* Question #4: Short Questions Part-III */}
        <View style={[styles.sectionCard, skipQ4 && styles.cardDisabled]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.questionMainTitle}>سوال نمبر 04: مختصر سوالات (حصہ سوم)</Text>
              <Text style={styles.questionSubtitle}>Short Questions - Section 3</Text>
            </View>
            <View style={styles.skipWrap}>
              <Text style={styles.skipLabel}>Skip (چھوڑیں)</Text>
              <Switch value={skipQ4} onValueChange={setSkipQ4} />
            </View>
          </View>

          {!skipQ4 && (
            <View style={styles.countsRow}>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کتنے حل کرنے ہیں؟</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q4Count}
                  onChangeText={setQ4Count}
                  maxLength={2}
                />
              </View>
              <Text style={styles.ofText}>out of</Text>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کل سوالات:</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={q4Total}
                  onChangeText={setQ4Total}
                  maxLength={2}
                />
              </View>
            </View>
          )}
        </View>

        {/* Question #5: Long Questions */}
        <View style={[styles.sectionCard, skipLong && styles.cardDisabled]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.questionMainTitle}>سوال نمبر 05 تا 07: تفصیلی / انشائیہ سوالات</Text>
              <Text style={styles.questionSubtitle}>Long / Detailed Questions (9 Marks Each)</Text>
            </View>
            <View style={styles.skipWrap}>
              <Text style={styles.skipLabel}>Skip (چھوڑیں)</Text>
              <Switch value={skipLong} onValueChange={setSkipLong} />
            </View>
          </View>

          {!skipLong && (
            <View style={styles.countsRow}>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کتنے سوال حل کرنے ہیں؟</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={longCount}
                  onChangeText={setLongCount}
                  maxLength={2}
                />
              </View>
              <Text style={styles.ofText}>out of</Text>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>کل انشائیہ سوالات:</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={longTotal}
                  onChangeText={setLongTotal}
                  maxLength={2}
                />
              </View>
            </View>
          )}
        </View>

        {/* Extra Section for English / Urdu / Islamiat */}
        {!isScience && (
          <View style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.questionMainTitle}>مضمون / تشریح / ترجمہ سیکشن</Text>
                <Text style={styles.questionSubtitle}>Essay, Stanza, Ahadith translation</Text>
              </View>
              <Switch value={includeEssay} onValueChange={setIncludeEssay} />
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Footer Generate Button */}
      <View style={styles.footerBar}>
        <CustomButton
          title="⚡ پرچہ تیار کریں (Generate Paper)"
          variant="accent"
          size="lg"
          onPress={handleStartGeneration}
        />
      </View>

      {/* 2-Second Generation Loading Modal */}
      <Modal visible={isGenerating} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.modalTitle}>پرچہ تیار کیا جا رہا ہے...</Text>
            <Text style={styles.modalSubtitle}>
              2026 بورڈ پیٹرن کے مطابق سوالات ترتیب دیے جا رہے ہیں (2 Seconds)
            </Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>Generating Exam Paper ⚡</Text>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionMainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  questionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  skipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skipLabel: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  numberInput: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    width: 60,
    height: 42,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    backgroundColor: '#F0F7FF',
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  halfInput: {
    flex: 1,
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  ofText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginHorizontal: 12,
    marginTop: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 16,
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  progressBadge: {
    backgroundColor: theme.colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  progressText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});

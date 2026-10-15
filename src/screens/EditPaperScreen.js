import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';

export const EditPaperScreen = ({ paper, onSaveEditedPaper, onBack }) => {
  const [editedPaper, setEditedPaper] = useState(JSON.parse(JSON.stringify(paper)));

  const handleUpdateInstitution = (text) => {
    setEditedPaper({ ...editedPaper, institutionName: text });
  };

  const handleUpdateMCQ = (index, newText) => {
    const updated = [...editedPaper.mcqSection.questions];
    updated[index].questionText = newText;
    setEditedPaper({
      ...editedPaper,
      mcqSection: { ...editedPaper.mcqSection, questions: updated },
    });
  };

  const handleUpdateOption = (mcqIndex, optIndex, newOpt) => {
    const updated = [...editedPaper.mcqSection.questions];
    updated[mcqIndex].options[optIndex] = newOpt;
    setEditedPaper({
      ...editedPaper,
      mcqSection: { ...editedPaper.mcqSection, questions: updated },
    });
  };

  const handleUpdateShort = (sectionIndex, qIndex, newText) => {
    const updatedSections = [...editedPaper.shortSections];
    updatedSections[sectionIndex].questions[qIndex].text = newText;
    setEditedPaper({ ...editedPaper, shortSections: updatedSections });
  };

  const handleUpdateLong = (index, newText) => {
    const updated = [...editedPaper.longSection.questions];
    updated[index].text = newText;
    setEditedPaper({
      ...editedPaper,
      longSection: { ...editedPaper.longSection, questions: updated },
    });
  };

  const handleSave = () => {
    onSaveEditedPaper(editedPaper);
    Alert.alert('کامیابی (Success)', 'پیپر میں ترامیم محفوظ کر لی گئی ہیں۔');
  };

  return (
    <View style={styles.container}>
      <Header
        title="پیپر میں ترمیم کریں (Edit Paper)"
        subtitle="Edit Question Text & Options"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Institution Title Edit */}
        <View style={styles.card}>
          <Text style={styles.label}>ادارے / سکول کا نام تبدیل کریں:</Text>
          <TextInput
            style={styles.input}
            value={editedPaper.institutionName}
            onChangeText={handleUpdateInstitution}
          />
        </View>

        {/* MCQs Edit */}
        {editedPaper.mcqSection?.active && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>معروضی سوالات (Edit MCQs):</Text>
            {editedPaper.mcqSection.questions.map((q, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>Q.1 ({idx + 1}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput]}
                  multiline
                  value={q.questionText}
                  onChangeText={(val) => handleUpdateMCQ(idx, val)}
                />
                <Text style={styles.subLabel}>آپشنز (Options A, B, C, D):</Text>
                <View style={styles.optionsWrap}>
                  {q.options.map((opt, optIdx) => (
                    <TextInput
                      key={optIdx}
                      style={styles.optInput}
                      value={opt}
                      onChangeText={(val) => handleUpdateOption(idx, optIdx, val)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Short Questions Edit */}
        {editedPaper.shortSections?.map((sec, sIdx) => (
          <View key={sIdx} style={styles.card}>
            <Text style={styles.sectionHeading}>
              مختصر سوالات حصہ {sIdx + 1} (Section {sIdx + 2}):
            </Text>
            {sec.questions.map((sq, sqIdx) => (
              <View key={sqIdx} style={styles.itemBox}>
                <Text style={styles.itemNum}>سوال ({sq.num}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput]}
                  multiline
                  value={sq.text}
                  onChangeText={(val) => handleUpdateShort(sIdx, sqIdx, val)}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Long Questions Edit */}
        {editedPaper.longSection?.active && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>انشائیہ سوالات (Edit Long Questions):</Text>
            {editedPaper.longSection.questions.map((lq, lIdx) => (
              <View key={lIdx} style={styles.itemBox}>
                <Text style={styles.itemNum}>سوال نمبر {lq.num}:</Text>
                <TextInput
                  style={[styles.input, styles.multiInput]}
                  multiline
                  value={lq.text}
                  onChangeText={(val) => handleUpdateLong(lIdx, val)}
                />
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footerBar}>
        <CustomButton
          title="تبدیلیاں محفوظ کریں (Save Edits) ✓"
          variant="accent"
          size="lg"
          onPress={handleSave}
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  multiInput: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  itemBox: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemNum: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 4,
  },
  optionsWrap: {
    gap: 6,
  },
  optInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: '#FFFFFF',
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

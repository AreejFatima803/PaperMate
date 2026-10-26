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

  // MCQs
  const handleUpdateMCQ = (index, newText) => {
    const updated = [...(editedPaper.mcqSection?.questions || [])];
    if (updated[index]) {
      updated[index].questionText = newText;
      setEditedPaper({
        ...editedPaper,
        mcqSection: { ...editedPaper.mcqSection, questions: updated },
      });
    }
  };

  const handleUpdateOption = (mcqIndex, optIndex, newOpt) => {
    const updated = [...(editedPaper.mcqSection?.questions || [])];
    if (updated[mcqIndex] && updated[mcqIndex].options) {
      updated[mcqIndex].options[optIndex] = newOpt;
      setEditedPaper({
        ...editedPaper,
        mcqSection: { ...editedPaper.mcqSection, questions: updated },
      });
    }
  };

  // Generic / Science / Math / Arts Short Questions
  const handleUpdateShort = (sectionIndex, qIndex, newText) => {
    const updatedSections = [...(editedPaper.shortSections || [])];
    if (updatedSections[sectionIndex] && updatedSections[sectionIndex].questions) {
      updatedSections[sectionIndex].questions[qIndex].text = newText;
      setEditedPaper({ ...editedPaper, shortSections: updatedSections });
    }
  };

  // Long Questions
  const handleUpdateLong = (index, newText) => {
    const updated = [...(editedPaper.longSection?.questions || [])];
    if (updated[index]) {
      updated[index].text = newText;
      setEditedPaper({
        ...editedPaper,
        longSection: { ...editedPaper.longSection, questions: updated },
      });
    }
  };

  // Urdu Shorts
  const handleUpdateUrduShort = (index, newText) => {
    const updated = [...(editedPaper.urduShortSection?.questions || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      urduShortSection: { ...editedPaper.urduShortSection, questions: updated },
    });
  };

  // Urdu Tashreeh Verses
  const handleUpdateUrduNazmVerse = (index, newText) => {
    const updated = [...(editedPaper.urduTashreehSection?.nazmVerses || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      urduTashreehSection: { ...editedPaper.urduTashreehSection, nazmVerses: updated },
    });
  };

  const handleUpdateUrduGhazalVerse = (index, newText) => {
    const updated = [...(editedPaper.urduTashreehSection?.ghazalVerses || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      urduTashreehSection: { ...editedPaper.urduTashreehSection, ghazalVerses: updated },
    });
  };

  // Urdu Nasr Paras
  const handleUpdateUrduNasr = (index, newText) => {
    const updated = [...(editedPaper.urduNasrSection?.paras || [])];
    if (updated[index]) {
      updated[index].text = newText;
      setEditedPaper({
        ...editedPaper,
        urduNasrSection: { ...editedPaper.urduNasrSection, paras: updated },
      });
    }
  };

  // Urdu Essay / Insha Topics
  const handleUpdateUrduInsha = (index, newText) => {
    const updated = [...(editedPaper.urduInshaSection?.topics || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      urduInshaSection: { ...editedPaper.urduInshaSection, topics: updated },
    });
  };

  // English Essay Topics
  const handleUpdateEngEssay = (index, newText) => {
    const updated = [...(editedPaper.engEssaySection?.topics || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      engEssaySection: { ...editedPaper.engEssaySection, topics: updated },
    });
  };

  // English Comprehension Questions
  const handleUpdateEngCompQ = (index, newText) => {
    const updated = [...(editedPaper.engComprehensionSection?.questions || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      engComprehensionSection: { ...editedPaper.engComprehensionSection, questions: updated },
    });
  };

  // English Urdu to English Sentences
  const handleUpdateEngUrduToEng = (index, newText) => {
    const updated = [...(editedPaper.engUrduToEngSection?.sentences || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      engUrduToEngSection: { ...editedPaper.engUrduToEngSection, sentences: updated },
    });
  };

  // Tarjuma-tul-Quran Shorts
  const handleUpdateTqShort = (index, newText) => {
    const updated = [...(editedPaper.tqShortSection?.questions || [])];
    updated[index] = newText;
    setEditedPaper({
      ...editedPaper,
      tqShortSection: { ...editedPaper.tqShortSection, questions: updated },
    });
  };

  const handleSave = () => {
    onSaveEditedPaper(editedPaper);
    Alert.alert('Paper Saved', 'Your paper modifications have been updated successfully.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Exam Paper"
        subtitle="Modify Questions, Sections & Options"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Institution Title Edit */}
        <View style={styles.card}>
          <Text style={styles.label}>Institution / School Name:</Text>
          <TextInput
            style={styles.input}
            value={editedPaper.institutionName}
            onChangeText={handleUpdateInstitution}
          />
        </View>

        {/* MCQs Edit */}
        {editedPaper.mcqSection?.active && editedPaper.mcqSection.questions?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>Objective MCQs (Edit Questions & Options):</Text>
            {editedPaper.mcqSection.questions.map((q, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>Q.1 ({idx + 1}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput]}
                  multiline
                  value={q.questionText}
                  onChangeText={(val) => handleUpdateMCQ(idx, val)}
                />
                <Text style={styles.subLabel}>Options (A, B, C, D):</Text>
                <View style={styles.optionsWrap}>
                  {q.options?.map((opt, optIdx) => (
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

        {/* Urdu Ashaar Tashreeh Edit */}
        {editedPaper.urduTashreehSection?.active && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>{editedPaper.urduTashreehSection.title}:</Text>
            {editedPaper.urduTashreehSection.nazmVerses?.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.subLabel}>اشعار حصہ نظم:</Text>
                {editedPaper.urduTashreehSection.nazmVerses.map((v, idx) => (
                  <TextInput
                    key={idx}
                    style={[styles.input, styles.multiInput, styles.rtlInput, { marginBottom: 6 }]}
                    multiline
                    value={v}
                    onChangeText={(val) => handleUpdateUrduNazmVerse(idx, val)}
                  />
                ))}
              </View>
            )}
            {editedPaper.urduTashreehSection.ghazalVerses?.length > 0 && (
              <View>
                <Text style={styles.subLabel}>اشعار حصہ غزل:</Text>
                {editedPaper.urduTashreehSection.ghazalVerses.map((v, idx) => (
                  <TextInput
                    key={idx}
                    style={[styles.input, styles.multiInput, styles.rtlInput, { marginBottom: 6 }]}
                    multiline
                    value={v}
                    onChangeText={(val) => handleUpdateUrduGhazalVerse(idx, val)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Urdu Nasr Paras Edit */}
        {editedPaper.urduNasrSection?.active && editedPaper.urduNasrSection.paras?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>{editedPaper.urduNasrSection.title}:</Text>
            {editedPaper.urduNasrSection.paras.map((p, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>پیراگراف {p.num}:</Text>
                <TextInput
                  style={[styles.input, styles.multiInput, styles.rtlInput]}
                  multiline
                  value={p.text}
                  onChangeText={(val) => handleUpdateUrduNasr(idx, val)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Urdu Short Questions Edit */}
        {editedPaper.urduShortSection?.active && editedPaper.urduShortSection.questions?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>اردو مختصر سوالات (Edit Questions):</Text>
            {editedPaper.urduShortSection.questions.map((qText, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>سوال ({idx + 1}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput, styles.rtlInput]}
                  multiline
                  value={qText}
                  onChangeText={(val) => handleUpdateUrduShort(idx, val)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Urdu Essay Topics Edit */}
        {editedPaper.urduInshaSection?.active && editedPaper.urduInshaSection.topics?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>اردو مضامین کے عنوانات (Edit Topics):</Text>
            {editedPaper.urduInshaSection.topics.map((t, idx) => (
              <TextInput
                key={idx}
                style={[styles.input, styles.rtlInput, { marginBottom: 6 }]}
                value={t}
                onChangeText={(val) => handleUpdateUrduInsha(idx, val)}
              />
            ))}
          </View>
        )}

        {/* English Short Questions Edit */}
        {editedPaper.shortSections?.map((sec, sIdx) => (
          <View key={sIdx} style={styles.card}>
            <Text style={styles.sectionHeading}>
              {sec.title || `Short Questions - Section ${sIdx + 1}`}:
            </Text>
            {sec.questions?.map((sq, sqIdx) => (
              <View key={sqIdx} style={styles.itemBox}>
                <Text style={styles.itemNum}>Question ({sq.num}):</Text>
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

        {/* English Essay Topics Edit */}
        {editedPaper.engEssaySection?.active && editedPaper.engEssaySection.topics?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>English Essay Topics (Edit Topics):</Text>
            {editedPaper.engEssaySection.topics.map((top, idx) => (
              <TextInput
                key={idx}
                style={[styles.input, { marginBottom: 6 }]}
                value={top}
                onChangeText={(val) => handleUpdateEngEssay(idx, val)}
              />
            ))}
          </View>
        )}

        {/* English Comprehension Questions Edit */}
        {editedPaper.engComprehensionSection?.active && editedPaper.engComprehensionSection.questions?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>Comprehension Passage Questions:</Text>
            {editedPaper.engComprehensionSection.questions.map((q, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>Q ({idx + 1}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput]}
                  multiline
                  value={q}
                  onChangeText={(val) => handleUpdateEngCompQ(idx, val)}
                />
              </View>
            ))}
          </View>
        )}

        {/* English Urdu to English Sentences / Paragraph Edit */}
        {editedPaper.engUrduToEngSection?.active && editedPaper.engUrduToEngSection.sentences?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>{editedPaper.engUrduToEngSection.title}:</Text>
            {editedPaper.engUrduToEngSection.sentences.map((sent, idx) => (
              <TextInput
                key={idx}
                style={[styles.input, styles.multiInput, styles.rtlInput, { marginBottom: 6 }]}
                multiline
                value={sent}
                onChangeText={(val) => handleUpdateEngUrduToEng(idx, val)}
              />
            ))}
          </View>
        )}

        {/* Tarjuma-tul-Quran Short Questions Edit */}
        {editedPaper.tqShortSection?.active && editedPaper.tqShortSection.questions?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>ترجمۃ القرآن مختصر سوالات (Edit Questions):</Text>
            {editedPaper.tqShortSection.questions.map((qText, idx) => (
              <View key={idx} style={styles.itemBox}>
                <Text style={styles.itemNum}>سوال ({idx + 1}):</Text>
                <TextInput
                  style={[styles.input, styles.multiInput, styles.rtlInput]}
                  multiline
                  value={qText}
                  onChangeText={(val) => handleUpdateTqShort(idx, val)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Long Questions Edit */}
        {editedPaper.longSection?.active && editedPaper.longSection.questions?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>Detailed / Long Questions:</Text>
            {editedPaper.longSection.questions.map((lq, lIdx) => (
              <View key={lIdx} style={styles.itemBox}>
                <Text style={styles.itemNum}>Question No. {lq.num}:</Text>
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
          title="Save Changes ✓"
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
  rtlInput: {
    textAlign: 'right',
    fontFamily: 'System',
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
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 4,
  },
  optionsWrap: {
    gap: 6,
  },
  optInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: '#ffffff',
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

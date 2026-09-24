import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { syllabusService } from '../services/syllabusService';

export const PaperBuilderScreen = ({ chapterData, onBack }) => {
  const [mcqCount, setMcqCount] = useState('10');
  const [shortCount1, setShortCount1] = useState('5');
  const [shortCount2, setShortCount2] = useState('5');
  const [shortCount3, setShortCount3] = useState('5');
  const [longCount, setLongCount] = useState('2');
  const [skipped, setSkipped] = useState({});

  const toggleSkip = (qNum) => {
    setSkipped(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const handleGenerate = async () => {
    const payload = await syllabusService.preparePaperPayload({
      className: chapterData?.className,
      subjectInput: chapterData?.subject,
      chapterNumber: chapterData?.chapterNum,
      portionKey: chapterData?.portionKey || 'full',
      paperType: 'Chapter Test Paper',
      questionCounts: {
        mcq: parseInt(mcqCount, 10) || 0,
        short1: parseInt(shortCount1, 10) || 0,
        short2: parseInt(shortCount2, 10) || 0,
        short3: parseInt(shortCount3, 10) || 0,
        long: parseInt(longCount, 10) || 0
      },
      difficulty: 'Medium',
      totalMarks: 50
    });

    Alert.alert(
      "Success",
      `Custom Test Paper Payload Prepared!\n\nClass: ${payload.class}\nSubject: ${payload.subject}\nChapter: ${payload.chapterNumber}\nPortion: ${payload.selectedPortion}\nSyllabus Content Count: ${payload.syllabusContent.length}`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb}>Custom Paper Builder Generator</Text>
      </View>

      <Text style={styles.title}>
        Paper Config: {chapterData?.subject?.name} (Chapter {chapterData?.chapterNum}{chapterData?.portionName ? ` - ${chapterData.portionName}` : ''})
      </Text>

      <View style={styles.cardsContainer}>
        {/* Q1: MCQs */}
        <View style={[styles.qCard, skipped[1] && styles.skippedCard]}>
          <View style={styles.qTop}>
            <Text style={styles.qBadge}>Q. No: 01 (MCQs)</Text>
            <TouchableOpacity onPress={() => toggleSkip(1)}>
              <Text style={styles.skipBtn}>{skipped[1] ? 'Restore' : 'Skip'}</Text>
            </TouchableOpacity>
          </View>

          {!skipped[1] && (
            <View style={styles.qBody}>
              <Text style={styles.label}>Number of MCQs:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={mcqCount}
                onChangeText={setMcqCount}
              />
            </View>
          )}
        </View>

        {/* Q2: Short Questions */}
        <View style={[styles.qCard, skipped[2] && styles.skippedCard]}>
          <View style={styles.qTop}>
            <Text style={styles.qBadge}>Q. No: 02 (Short Questions)</Text>
            <TouchableOpacity onPress={() => toggleSkip(2)}>
              <Text style={styles.skipBtn}>{skipped[2] ? 'Restore' : 'Skip'}</Text>
            </TouchableOpacity>
          </View>

          {!skipped[2] && (
            <View style={styles.qBody}>
              <Text style={styles.label}>Number of Short Questions:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={shortCount1}
                onChangeText={setShortCount1}
              />
            </View>
          )}
        </View>

        {/* Q3: Short Questions */}
        <View style={[styles.qCard, skipped[3] && styles.skippedCard]}>
          <View style={styles.qTop}>
            <Text style={styles.qBadge}>Q. No: 03 (Short Questions)</Text>
            <TouchableOpacity onPress={() => toggleSkip(3)}>
              <Text style={styles.skipBtn}>{skipped[3] ? 'Restore' : 'Skip'}</Text>
            </TouchableOpacity>
          </View>

          {!skipped[3] && (
            <View style={styles.qBody}>
              <Text style={styles.label}>Number of Short Questions:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={shortCount2}
                onChangeText={setShortCount2}
              />
            </View>
          )}
        </View>

        {/* Q4: Short Questions */}
        <View style={[styles.qCard, skipped[4] && styles.skippedCard]}>
          <View style={styles.qTop}>
            <Text style={styles.qBadge}>Q. No: 04 (Short Questions)</Text>
            <TouchableOpacity onPress={() => toggleSkip(4)}>
              <Text style={styles.skipBtn}>{skipped[4] ? 'Restore' : 'Skip'}</Text>
            </TouchableOpacity>
          </View>

          {!skipped[4] && (
            <View style={styles.qBody}>
              <Text style={styles.label}>Number of Short Questions:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={shortCount3}
                onChangeText={setShortCount3}
              />
            </View>
          )}
        </View>

        {/* Q5: Long Questions */}
        <View style={[styles.qCard, skipped[5] && styles.skippedCard]}>
          <View style={styles.qTop}>
            <Text style={styles.qBadge}>Q. No: 05 (Long Questions)</Text>
            <TouchableOpacity onPress={() => toggleSkip(5)}>
              <Text style={styles.skipBtn}>{skipped[5] ? 'Restore' : 'Skip'}</Text>
            </TouchableOpacity>
          </View>

          {!skipped[5] && (
            <View style={styles.qBody}>
              <Text style={styles.label}>Number of Long Questions:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={longCount}
                onChangeText={setLongCount}
              />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateBtnText}>✨ Generate Paper PDF</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 20
  },
  cardsContainer: {
    width: '92%',
    maxWidth: 980,
    gap: 16
  },
  qCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 18
  },
  skippedCard: {
    opacity: 0.5,
    backgroundColor: '#f8fafc'
  },
  qTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  qBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary
  },
  skipBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444'
  },
  qBody: {
    gap: 8
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: '#ffffff'
  },
  generateBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff'
  }
});

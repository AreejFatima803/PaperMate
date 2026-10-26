import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';
import { Header } from '../components/Header';
import { PaperHistoryService } from '../services/storageService';
import { generatePaperHtml } from '../services/paperHtmlGenerator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Dynamic loader for html2pdf in Web browser
const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.html2pdf) {
      return resolve(window.html2pdf);
    }
    if (typeof document === 'undefined') {
      return reject(new Error('Document is not available'));
    }
    const existing = document.getElementById('papermate-html2pdf');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.html2pdf));
      return;
    }
    const script = document.createElement('script');
    script.id = 'papermate-html2pdf';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

export const GeneratedPaperScreen = ({
  paper,
  onEditPaper,
  onSaveSuccess,
  onNavigateHome,
  onBack,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSave = async () => {
    try {
      await PaperHistoryService.savePaper(paper);
      setIsSaved(true);
      Alert.alert('Paper Saved', 'This exam paper has been saved to your history successfully.');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      Alert.alert('Error', 'Unable to save exam paper.');
    }
  };

  // Formats paper into structured examination sheet with headers & dividers for social sharing
  const formatPaperAsText = () => {
    try {
      let content = `╔════════════════════════════════════════════════════════╗\n`;
    content += `║  ${(paper.institutionName || 'THE HOPE TEST SERIES').toUpperCase().padEnd(52, ' ')}  ║\n`;
    content += `║  ${(`${paper.boardName || 'BISE BOARD'} • ANNUAL EXAM 2026`).padEnd(52, ' ')}  ║\n`;
    content += `╠════════════════════════════════════════════════════════╣\n`;
    content += `║ Class: ${(paper.className || '').padEnd(20, ' ')} Subject: ${(paper.subjectName || '').padEnd(16, ' ')} ║\n`;
    content += `║ Total Marks: ${String(paper.totalMarks || '').padEnd(14, ' ')} Time: ${(paper.timeAllowed || '').padEnd(19, ' ')} ║\n`;
    content += `║ Scope: ${(paper.syllabusScope || 'Full Book').padEnd(20, ' ')} Roll No: [__________]     ║\n`;
    content += `╚════════════════════════════════════════════════════════╝\n\n`;

    // 1. MCQs Section
    if (paper.mcqSection?.active && paper.mcqSection.questions?.length > 0) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.mcqSection.title || 'PART - I (OBJECTIVE SECTION)'} 】 [Marks: ${paper.mcqSection.marks}]\n`;
      content += `────────────────────────────────────────────────────────\n`;
      paper.mcqSection.questions.forEach((q, i) => {
        content += `Q.1 (${i + 1}): ${q.questionText}\n`;
        if (q.options && q.options.length > 0) {
          content += `  (A) ${q.options[0]}   (B) ${q.options[1]}\n  (C) ${q.options[2]}   (D) ${q.options[3]}\n`;
        }
        content += `\n`;
      });
    }

    // 2. Urdu Specific Sections
    if (paper.urduTashreehSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduTashreehSection.title} 】 [${paper.urduTashreehSection.marks} نمبر]\n`;
      content += `${paper.urduTashreehSection.instruction}\n`;
      if (paper.urduTashreehSection.nazmVerses) {
        content += `\n(الف) حصہ نظم (${paper.urduTashreehSection.nazmMarks || 'نمبر'}):\n`;
        paper.urduTashreehSection.nazmVerses.forEach((v) => { content += `  ${v}\n`; });
      }
      if (paper.urduTashreehSection.ghazalVerses) {
        content += `\n(ب) حصہ غزل (${paper.urduTashreehSection.ghazalMarks || 'نمبر'}):\n`;
        paper.urduTashreehSection.ghazalVerses.forEach((v) => { content += `  ${v}\n`; });
      }
      content += `\n`;
    }

    if (paper.urduNasrSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduNasrSection.title} 】 [${paper.urduNasrSection.marks} نمبر]\n`;
      content += `${paper.urduNasrSection.instruction}\n\n`;
      paper.urduNasrSection.paras?.forEach((p) => {
        content += `${p.num} ${p.text}\n\n`;
      });
    }

    if (paper.urduShortSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduShortSection.title} 】 [${paper.urduShortSection.marks} نمبر]\n`;
      content += `${paper.urduShortSection.instruction}\n`;
      paper.urduShortSection.questions?.forEach((q) => {
        content += `  ${q}\n`;
      });
      content += `\n`;
    }

    if (paper.urduKhulasaSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduKhulasaSection.title} 】 [${paper.urduKhulasaSection.marks} نمبر]\n`;
      content += `${paper.urduKhulasaSection.instruction}\n`;
      paper.urduKhulasaSection.options?.forEach((opt) => {
        content += `  ${opt}\n`;
      });
      content += `\n`;
    }

    if (paper.urduNazmKhulasaSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduNazmKhulasaSection.title} 】 [${paper.urduNazmKhulasaSection.marks} نمبر]\n`;
      content += `${paper.urduNazmKhulasaSection.instruction}\n\n`;
    }

    if (paper.urduInshaSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduInshaSection.title} 】 [${paper.urduInshaSection.marks} نمبر]\n`;
      content += `${paper.urduInshaSection.instruction}\n`;
      paper.urduInshaSection.topics?.forEach((t) => {
        content += `  ${t}\n`;
      });
      content += `\n`;
    }

    if (paper.urduTalkheesSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduTalkheesSection.title} 】 [${paper.urduTalkheesSection.marks} نمبر]\n`;
      content += `${paper.urduTalkheesSection.instruction}\n\n`;
      if (paper.urduTalkheesSection.passage) {
        content += `${paper.urduTalkheesSection.passage}\n\n`;
      }
      if (paper.urduTalkheesSection.questions) {
        paper.urduTalkheesSection.questions.forEach((q) => {
          content += `  ${q}\n`;
        });
        content += `\n`;
      }
    }

    if (paper.urduKhatSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduKhatSection.title} 】 [${paper.urduKhatSection.marks} نمبر]\n`;
      content += `${paper.urduKhatSection.instruction}\n\n`;
    }

    if (paper.urduKahaniSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduKahaniSection.title} 】 [${paper.urduKahaniSection.marks} نمبر]\n`;
      content += `${paper.urduKahaniSection.instruction}\n\n`;
    }

    if (paper.urduJumlaySection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.urduJumlaySection.title} 】 [${paper.urduJumlaySection.marks} نمبر]\n`;
      content += `${paper.urduJumlaySection.instruction}\n`;
      paper.urduJumlaySection.sentences?.forEach((s) => {
        content += `  ${s}\n`;
      });
      content += `\n`;
    }

    // 3. Short Sections
    if (paper.shortSections && paper.shortSections.length > 0) {
      paper.shortSections.forEach((sec) => {
        content += `════════════════════════════════════════════════════════\n`;
        content += `【 ${sec.title} 】 [${sec.totalMarks} Marks]\n`;
        content += `${sec.instruction}\n`;
        sec.questions?.forEach((q) => {
          content += `  ${q.num || ''} ${q.text}\n`;
        });
        content += `\n`;
      });
    }

    // 4. English Specific Sections
    if (paper.engTranslationSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engTranslationSection.title} 】 [${paper.engTranslationSection.marks} Marks]\n`;
      content += `${paper.engTranslationSection.instruction}\n`;
      paper.engTranslationSection.paragraphs?.forEach((p) => {
        content += `${p.tag} ${p.text}\n\n`;
      });
      if (paper.engTranslationSection.altNote) {
        content += `${paper.engTranslationSection.altNote}\n\n`;
      }
    }

    if (paper.engPoemSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engPoemSection.title} 】 [${paper.engPoemSection.marks} Marks]\n`;
      content += `${paper.engPoemSection.instruction}\n`;
      if (paper.engPoemSection.stanzaOption) {
        content += `\n${paper.engPoemSection.stanzaOption}\n`;
      }
      content += `\n`;
    }

    if (paper.engIdiomsSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engIdiomsSection.title} 】 [${paper.engIdiomsSection.marks} Marks]\n`;
      content += `${paper.engIdiomsSection.instruction}\n`;
      content += `  ${paper.engIdiomsSection.words?.join('   ')}\n\n`;
    }

    if (paper.engNarrationSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engNarrationSection.title} 】 [${paper.engNarrationSection.marks} Marks]\n`;
      content += `${paper.engNarrationSection.instruction}\n`;
      paper.engNarrationSection.sentences?.forEach((s) => {
        content += `  ${s}\n`;
      });
      content += `\n`;
    }

    if (paper.engEssaySection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engEssaySection.title} 】 [${paper.engEssaySection.marks} Marks]\n`;
      content += `${paper.engEssaySection.instruction}\n`;
      paper.engEssaySection.topics?.forEach((t) => {
        content += `  ${t}\n`;
      });
      content += `\n`;
    }

    if (paper.engPairOfWordsSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engPairOfWordsSection.title} 】 [${paper.engPairOfWordsSection.marks} Marks]\n`;
      content += `${paper.engPairOfWordsSection.instruction}\n`;
      content += `  ${paper.engPairOfWordsSection.pairs?.join('   ')}\n\n`;
    }

    if (paper.engLetterSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engLetterSection.title} 】 [${paper.engLetterSection.marks} Marks]\n`;
      content += `${paper.engLetterSection.instruction}\n`;
      paper.engLetterSection.options?.forEach((opt) => {
        content += `  ${opt}\n`;
      });
      content += `\n`;
    }

    if (paper.engStorySection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engStorySection.title} 】 [${paper.engStorySection.marks} Marks]\n`;
      content += `${paper.engStorySection.instruction}\n\n`;
    }

    if (paper.engComprehensionSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engComprehensionSection.title} 】 [${paper.engComprehensionSection.marks} Marks]\n`;
      content += `${paper.engComprehensionSection.instruction}\n\n`;
      content += `${paper.engComprehensionSection.passage}\n\nQuestions:\n`;
      paper.engComprehensionSection.questions?.forEach((q) => {
        content += `  ${q}\n`;
      });
      content += `\n`;
    }

    if (paper.engUrduToEngSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engUrduToEngSection.title} 】 [${paper.engUrduToEngSection.marks} Marks]\n`;
      content += `${paper.engUrduToEngSection.instruction}\n`;
      paper.engUrduToEngSection.sentences?.forEach((s) => {
        content += `  ${s}\n`;
      });
      if (paper.engUrduToEngSection.altForForeign) {
        content += `\n${paper.engUrduToEngSection.altForForeign}\n`;
      }
      content += `\n`;
    }

    if (paper.engVoiceSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.engVoiceSection.title} 】 [${paper.engVoiceSection.marks} Marks]\n`;
      content += `${paper.engVoiceSection.instruction}\n`;
      paper.engVoiceSection.sentences?.forEach((s) => {
        content += `  ${s}\n`;
      });
      content += `\n`;
    }

    // 5. Tarjuma-tul-Quran & Islamiat
    if (paper.tqShortSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.tqShortSection.title} 】 [${paper.tqShortSection.marks} نمبر]\n`;
      content += `${paper.tqShortSection.instruction}\n`;
      paper.tqShortSection.questions?.forEach((q) => { content += `  ${q}\n`; });
      content += `\n`;
    }

    if (paper.tqWordsSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.tqWordsSection.title} 】 [${paper.tqWordsSection.marks} نمبر]\n`;
      content += `${paper.tqWordsSection.instruction}\n`;
      paper.tqWordsSection.words?.forEach((w) => {
        content += `  ${w.arabic} = ${w.meaning}\n`;
      });
      content += `\n`;
    }

    if (paper.tqAyatSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.tqAyatSection.title} 】 [${paper.tqAyatSection.marks} نمبر]\n`;
      content += `${paper.tqAyatSection.instruction}\n`;
      paper.tqAyatSection.ayat?.forEach((a) => { content += `  ${a}\n`; });
      content += `\n`;
    }

    if (paper.islHadithSection?.active) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.islHadithSection.title} 】 [${paper.islHadithSection.marks} نمبر]\n`;
      content += `${paper.islHadithSection.instruction}\n`;
      content += `  ${paper.islHadithSection.hadithText}\n  ${paper.islHadithSection.translation}\n\n`;
    }

    // 6. Long Questions
    if (paper.longSection?.active && paper.longSection.questions?.length > 0) {
      content += `════════════════════════════════════════════════════════\n`;
      content += `【 ${paper.longSection.title} 】 [${paper.longSection.marks} Marks]\n`;
      content += `${paper.longSection.instruction}\n\n`;
      paper.longSection.questions.forEach((lq) => {
        content += `Q.${lq.num}: (${lq.marks} Marks)\n${lq.text}\n\n`;
      });
    }

      content += `\n★ Best of Luck for BISE Board Examination 2026 ★\n`;
      content += `Prepared via PaperMate Automated Examination System\n`;
      return content;
    } catch (err) {
      return `【 ${paper.institutionName || 'PAPERMATE EXAM'} 】\n${paper.className} - ${paper.subjectName}\nTotal Marks: ${paper.totalMarks} | Time: ${paper.timeAllowed}\nScope: ${paper.syllabusScope || 'Full Book'}\n\nGenerated via PaperMate Board Exam System`;
    }
  };

  // 1. Share Paper as official PDF file (WhatsApp, Email, Drive, Bluetooth, etc.)
  const handleSharePdf = async () => {
    setIsShareModalVisible(false);
    setIsGeneratingPdf(true);
    try {
      const html = generatePaperHtml(paper);
      const file = await Print.printToFileAsync({ html });
      setIsGeneratingPdf(false);

      if (file && file.uri) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Share ${paper.subjectName || 'Exam'} Paper (PDF)`,
            UTI: 'com.adobe.pdf',
          });
        } else {
          await Print.printAsync({ html });
        }
      }
    } catch (err) {
      setIsGeneratingPdf(false);
      console.warn('Share PDF error:', err);
      Alert.alert('PDF Notice', 'Unable to share directly. You can use Print / Save as PDF.');
    }
  };

  // 2. Download Official PDF File directly (.pdf) via native system print/save
  const handleDownloadPdf = async () => {
    setIsShareModalVisible(false);
    setIsGeneratingPdf(true);
    try {
      const html = generatePaperHtml(paper);
      setIsGeneratingPdf(false);
      await Print.printAsync({ html });
    } catch (e) {
      setIsGeneratingPdf(false);
      console.warn('Download PDF error:', e);
      Alert.alert('Notice', 'Use the Print option to save the paper as PDF.');
    }
  };

  // 3. Opens official native print dialog (has "Save as PDF" built-in on Android & iOS)
  const handlePrintPdf = async () => {
    setIsShareModalVisible(false);
    try {
      const html = generatePaperHtml(paper);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(html);
          printWindow.document.close();
          setTimeout(() => {
            try {
              printWindow.focus();
              printWindow.print();
            } catch (e) {}
          }, 350);
          return;
        }
      }

      await Print.printAsync({ html });
    } catch (error) {
      console.warn('Print error:', error);
      Alert.alert('Print Notice', 'Paper generated successfully.');
    }
  };

  // 4. Download styled Examination Paper HTML File (Web / fallback)
  const handleDownloadHtml = () => {
    setIsShareModalVisible(false);
    try {
      const html = generatePaperHtml(paper);
      const filename = `${(paper.subjectName || 'Exam').replace(/\s+/g, '_')}_${(paper.className || 'Paper').replace(/\s+/g, '_')}_2026.html`;

      if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert(
          'Paper Downloaded',
          `Official paper file saved as "${filename}". Open it in Chrome or any browser to print or save as PDF!`
        );
      } else {
        handleShareFormattedText();
      }
    } catch (err) {
      Alert.alert('Notice', 'Paper is saved in your PaperMate history.');
    }
  };

  // 5. Share structured Examination Sheet text
  const handleShareFormattedText = async () => {
    setIsShareModalVisible(false);
    try {
      let content = formatPaperAsText() || '';
      if (content.length > 2500) {
        content = content.substring(0, 2400) + '\n\n... [Complete paper layout available in PaperMate app]';
      }

      await Share.share({
        message: content,
        title: `${paper.subjectName || 'Exam'} Paper 2026`,
      });
    } catch (error) {
      console.warn('Share text error:', error);
      Alert.alert('Share Notice', 'Paper details are saved in your History.');
    }
  };

  const handleShare = () => {
    setIsShareModalVisible(true);
  };

  const isRtl = paper.isUrduPaper || paper.isTarjumaQuranPaper || paper.isIslamiatPaper;

  return (
    <View style={styles.container}>
      <Header
        title="Generated Exam Paper"
        subtitle="Board Paper Preview (Punjab Boards Pattern 2026)"
        onBack={onBack}
        rightLabel="Home"
        rightAction={onNavigateHome}
      />

      {/* Quick Action Top Bar */}
      <View style={styles.topActionBar}>
        <View style={styles.topActionLeft}>
          <Text style={styles.topActionTitle}>📄 Paper Preview</Text>
        </View>
        <View style={styles.topActionRight}>
          <TouchableOpacity
            style={styles.topBtnPrint}
            activeOpacity={0.8}
            onPress={handlePrintPdf}
          >
            <Text style={styles.topBtnText}>🖨️ Print / PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topBtnShare}
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <Text style={styles.topBtnText}>📤 Share Paper</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Paper Sheet Preview */}
        <View style={styles.paperSheet}>
          {/* Header Block */}
          <View style={styles.paperHeader}>
            <Text style={styles.schoolTitle}>{paper.institutionName}</Text>
            <Text style={styles.boardTitle}>
              {paper.boardName} • EXAMINATION 2026
            </Text>
            <Text style={styles.scopeHeaderLine}>
              Syllabus: {paper.syllabusScope || 'Full Book'}
            </Text>

            <View style={styles.metaTable}>
              <View style={styles.metaRow}>
                <Text style={styles.metaCol}>
                  <Text style={styles.metaBold}>Student Name: </Text>
                  ______________________
                </Text>
                <View style={styles.rollBox}>
                  <Text style={styles.rollText}>Roll No: ___________</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaCol}>
                  <Text style={styles.metaBold}>Class: </Text>
                  {paper.className}
                </Text>
                <Text style={styles.metaCol}>
                  <Text style={styles.metaBold}>Subject: </Text>
                  {paper.subjectNameUrdu ? `${paper.subjectName} (${paper.subjectNameUrdu})` : paper.subjectName}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaCol}>
                  <Text style={styles.metaBold}>Total Marks: </Text>
                  {paper.totalMarks}
                </Text>
                <Text style={styles.metaCol}>
                  <Text style={styles.metaBold}>Time Allowed: </Text>
                  {paper.timeAllowed}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ======================================================== */}
          {/* 1. OBJECTIVE SECTION (MCQs)                              */}
          {/* ======================================================== */}
          {paper.mcqSection?.active && paper.mcqSection.questions?.length > 0 && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>
                  {paper.mcqSection.title || 'PART - I (OBJECTIVE SECTION)'}
                </Text>
                <Text style={styles.sectionMarksBadge}>
                  Total Marks: {paper.mcqSection.marks}
                </Text>
              </View>
              <Text style={[styles.sectionNote, isRtl && styles.rtlText]}>
                {isRtl
                  ? 'نوٹ: ہر سوال کے چار ممکنہ جوابات (الف، ب، ج، د) دیے گئے ہیں۔ درست جواب کا انتخاب کریں۔'
                  : 'Note: Each question has four possible answers (A, B, C, D). Choose the correct option.'}
              </Text>

              {paper.mcqSection.questions.map((q, idx) => (
                <View key={q.id || idx} style={styles.mcqBlock}>
                  <Text style={[styles.mcqQuestionText, isRtl && styles.rtlText]}>
                    <Text style={styles.qNumBold}>Q.1 ({idx + 1}): </Text>
                    {q.questionText}
                  </Text>
                  <View style={[styles.optionsGrid, isRtl && styles.optionsGridRtl]}>
                    {q.options?.map((opt, optIdx) => {
                      const letter = isRtl
                        ? ['الف', 'ب', 'ج', 'د'][optIdx] || `(${optIdx + 1})`
                        : String.fromCharCode(65 + optIdx);
                      return (
                        <View key={optIdx} style={styles.optItem}>
                          <Text style={styles.optLetter}>({letter})</Text>
                          <Text style={[styles.optText, isRtl && styles.rtlText]}>{opt}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ======================================================== */}
          {/* 2. URDU EXAM PAPER SECTIONS                              */}
          {/* ======================================================== */}

          {/* Q2: اشعار کی تشریح */}
          {paper.urduTashreehSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduTashreehSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduTashreehSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduTashreehSection.instruction}
              </Text>

              {/* حصہ نظم */}
              {paper.urduTashreehSection.nazmVerses && (
                <View style={styles.urduSubBlock}>
                  <View style={styles.subHeadingWrap}>
                    <Text style={[styles.subHeadingText, styles.rtlText]}>الف- حصہ نظم</Text>
                    <Text style={styles.subMarksText}>({paper.urduTashreehSection.nazmMarks || '6 نمبر'})</Text>
                  </View>
                  {paper.urduTashreehSection.nazmVerses.map((verse, vIdx) => (
                    <Text key={vIdx} style={[styles.verseText, styles.rtlText]}>
                      {verse}
                    </Text>
                  ))}
                </View>
              )}

              {/* حصہ غزل */}
              {paper.urduTashreehSection.ghazalVerses && (
                <View style={styles.urduSubBlock}>
                  <View style={styles.subHeadingWrap}>
                    <Text style={[styles.subHeadingText, styles.rtlText]}>ب- حصہ غزل</Text>
                    <Text style={styles.subMarksText}>({paper.urduTashreehSection.ghazalMarks || '4 نمبر'})</Text>
                  </View>
                  {paper.urduTashreehSection.ghazalVerses.map((verse, vIdx) => (
                    <Text key={vIdx} style={[styles.verseText, styles.rtlText]}>
                      {verse}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Q3: نثری پاروں کی تشریح */}
          {paper.urduNasrSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduNasrSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduNasrSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduNasrSection.instruction}
              </Text>
              {paper.urduNasrSection.paras?.map((p, pIdx) => (
                <View key={pIdx} style={styles.nasrParaCard}>
                  <Text style={[styles.nasrParaTag, styles.rtlText]}>{p.num}</Text>
                  <Text style={[styles.nasrParaText, styles.rtlText]}>{p.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Q4: اردو مختصر سوالات */}
          {paper.urduShortSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduShortSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduShortSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduShortSection.instruction}
              </Text>
              <View style={styles.shortsList}>
                {paper.urduShortSection.questions?.map((qText, qIdx) => (
                  <View key={qIdx} style={[styles.shortItem, styles.shortItemRtl]}>
                    <Text style={[styles.shortItemText, styles.rtlText]}>{qText}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Q5: سبق کا خلاصہ */}
          {paper.urduKhulasaSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduKhulasaSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduKhulasaSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduKhulasaSection.instruction}
              </Text>
              <View style={styles.khulasaCard}>
                {paper.urduKhulasaSection.options?.map((opt, optIdx) => (
                  <Text key={optIdx} style={[styles.khulasaOptionText, styles.rtlText]}>
                    {opt}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Q6: نظم کا مرکزی خیال یا خلاصہ */}
          {paper.urduNazmKhulasaSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduNazmKhulasaSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduNazmKhulasaSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduNazmKhulasaSection.instruction}
              </Text>
            </View>
          )}

          {/* Urdu Essay (10th & 12th) */}
          {paper.urduInshaSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduInshaSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduInshaSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduInshaSection.instruction}
              </Text>
              <View style={styles.khulasaCard}>
                {paper.urduInshaSection.topics?.map((top, tIdx) => (
                  <Text key={tIdx} style={[styles.khulasaOptionText, styles.rtlText]}>
                    {top}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Urdu Talkhees / Comprehension (10th & 11th) */}
          {paper.urduTalkheesSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduTalkheesSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduTalkheesSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduTalkheesSection.instruction}
              </Text>
              {paper.urduTalkheesSection.passage && (
                <View style={styles.nasrParaCard}>
                  <Text style={[styles.nasrParaText, styles.rtlText]}>
                    {paper.urduTalkheesSection.passage}
                  </Text>
                </View>
              )}
              {paper.urduTalkheesSection.questions && (
                <View style={styles.shortsList}>
                  {paper.urduTalkheesSection.questions.map((q, qIdx) => (
                    <Text key={qIdx} style={[styles.compQText, styles.rtlText]}>
                      {q}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Q7: خط یا درخواست / رسید */}
          {paper.urduKhatSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduKhatSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduKhatSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduKhatSection.instruction}
              </Text>
            </View>
          )}

          {/* Q8: کہانی یا مکالمہ / روداد */}
          {paper.urduKahaniSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduKahaniSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduKahaniSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduKahaniSection.instruction}
              </Text>
            </View>
          )}

          {/* Q9: جملوں کی درستی / ضرب الامثال */}
          {paper.urduJumlaySection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.urduJumlaySection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.urduJumlaySection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>
                {paper.urduJumlaySection.instruction}
              </Text>
              <View style={styles.jumlayGrid}>
                {paper.urduJumlaySection.sentences?.map((sentence, sIdx) => (
                  <View key={sIdx} style={styles.jumlaItem}>
                    <Text style={[styles.jumlaText, styles.rtlText]}>{sentence}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* 3. SHORT SECTIONS (ENGLISH, SCIENCE, MATH, CS, ARTS)     */}
          {/* ======================================================== */}
          {paper.shortSections && paper.shortSections.length > 0 && (
            <View style={styles.paperSection}>
              {paper.shortSections.map((sec, secIdx) => (
                <View key={secIdx} style={styles.shortGroup}>
                  <View style={styles.sectionHeadingWrap}>
                    <Text style={[styles.sectionHeading, isRtl && styles.rtlText]}>{sec.title}</Text>
                    <Text style={styles.sectionMarksBadge}>{sec.totalMarks} {isRtl ? 'نمبر' : 'Marks'}</Text>
                  </View>
                  <Text style={[styles.sectionInstruction, isRtl && styles.rtlText]}>{sec.instruction}</Text>
                  <View style={styles.shortsList}>
                    {sec.questions.map((sq, sqIdx) => (
                      <View key={sq.id || sqIdx} style={[styles.shortItem, isRtl && styles.shortItemRtl]}>
                        <Text style={styles.shortItemNum}>({sq.num || sqIdx + 1})</Text>
                        <Text style={[styles.shortItemText, isRtl && styles.rtlText]}>{sq.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ======================================================== */}
          {/* 4. ENGLISH EXAM PAPER SECTIONS                           */}
          {/* ======================================================== */}

          {/* English Translation Section */}
          {paper.engTranslationSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engTranslationSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engTranslationSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>
                {paper.engTranslationSection.instruction}
              </Text>
              {paper.engTranslationSection.paragraphs?.map((p, idx) => (
                <View key={idx} style={styles.engParaCard}>
                  {p.tag ? <Text style={styles.engParaTag}>{p.tag}</Text> : null}
                  <Text style={styles.engParaText}>{p.text}</Text>
                </View>
              ))}
              {paper.engTranslationSection.altNote && (
                <View style={styles.altNoteBox}>
                  <Text style={styles.altNoteText}>{paper.engTranslationSection.altNote}</Text>
                </View>
              )}
            </View>
          )}

          {/* English Poem Summary / Stanza */}
          {paper.engPoemSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engPoemSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engPoemSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engPoemSection.instruction}</Text>
              {paper.engPoemSection.stanzaOption && (
                <View style={styles.stanzaBox}>
                  <Text style={styles.stanzaText}>{paper.engPoemSection.stanzaOption}</Text>
                </View>
              )}
            </View>
          )}

          {/* English Idioms Section */}
          {paper.engIdiomsSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engIdiomsSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engIdiomsSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engIdiomsSection.instruction}</Text>
              <View style={styles.wordsWrap}>
                {paper.engIdiomsSection.words?.map((word, wIdx) => (
                  <View key={wIdx} style={styles.wordBadge}>
                    <Text style={styles.wordBadgeText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* English Narration (Direct / Indirect) */}
          {paper.engNarrationSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engNarrationSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engNarrationSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engNarrationSection.instruction}</Text>
              <View style={styles.shortsList}>
                {paper.engNarrationSection.sentences?.map((s, sIdx) => (
                  <Text key={sIdx} style={styles.compQText}>{s}</Text>
                ))}
              </View>
            </View>
          )}

          {/* English Essay Section (10th & 12th) */}
          {paper.engEssaySection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engEssaySection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engEssaySection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engEssaySection.instruction}</Text>
              <View style={styles.engTopicsBox}>
                {paper.engEssaySection.topics?.map((t, idx) => (
                  <Text key={idx} style={styles.letterOptText}>{t}</Text>
                ))}
              </View>
            </View>
          )}

          {/* English Pair of Words (10th) */}
          {paper.engPairOfWordsSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engPairOfWordsSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engPairOfWordsSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engPairOfWordsSection.instruction}</Text>
              <View style={styles.wordsWrap}>
                {paper.engPairOfWordsSection.pairs?.map((pair, pIdx) => (
                  <View key={pIdx} style={styles.wordBadge}>
                    <Text style={styles.wordBadgeText}>{pair}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* English Letter / Story / Dialogue */}
          {paper.engLetterSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engLetterSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engLetterSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engLetterSection.instruction}</Text>
              {paper.engLetterSection.options?.map((opt, optIdx) => (
                <Text key={optIdx} style={styles.letterOptText}>{opt}</Text>
              ))}
            </View>
          )}

          {/* English Moral Story (11th) */}
          {paper.engStorySection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engStorySection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engStorySection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engStorySection.instruction}</Text>
            </View>
          )}

          {/* English Comprehension Passage */}
          {paper.engComprehensionSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engComprehensionSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engComprehensionSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engComprehensionSection.instruction}</Text>
              <View style={styles.comprehensionPassageBox}>
                <Text style={styles.comprehensionText}>{paper.engComprehensionSection.passage}</Text>
              </View>
              <Text style={styles.subHeadingText}>Questions:</Text>
              {paper.engComprehensionSection.questions?.map((q, qIdx) => (
                <Text key={qIdx} style={styles.compQText}>{q}</Text>
              ))}
            </View>
          )}

          {/* English Urdu to English Translation (9th, 10th, 12th) */}
          {paper.engUrduToEngSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engUrduToEngSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engUrduToEngSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engUrduToEngSection.instruction}</Text>
              <View style={styles.urduToEngList}>
                {paper.engUrduToEngSection.sentences?.map((s, sIdx) => (
                  <Text key={sIdx} style={[styles.urduSentenceItem, styles.rtlText]}>{s}</Text>
                ))}
              </View>
              {paper.engUrduToEngSection.altForForeign && (
                <View style={styles.altNoteBox}>
                  <Text style={styles.altNoteText}>{paper.engUrduToEngSection.altForForeign}</Text>
                </View>
              )}
            </View>
          )}

          {/* English Change of Voice (9th) */}
          {paper.engVoiceSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.engVoiceSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.engVoiceSection.marks} Marks</Text>
              </View>
              <Text style={styles.sectionInstruction}>{paper.engVoiceSection.instruction}</Text>
              {paper.engVoiceSection.sentences?.map((s, sIdx) => (
                <Text key={sIdx} style={styles.voiceSentence}>{s}</Text>
              ))}
            </View>
          )}

          {/* ======================================================== */}
          {/* 5. TARJUMA-TUL-QURAN SECTIONS                            */}
          {/* ======================================================== */}

          {/* Q2: ترجمۃ القرآن مختصر سوالات */}
          {paper.tqShortSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.tqShortSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.tqShortSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.tqShortSection.instruction}</Text>
              {paper.tqShortSection.questions?.map((q, idx) => (
                <Text key={idx} style={[styles.urduShortItem, styles.rtlText]}>{q}</Text>
              ))}
            </View>
          )}

          {/* Q3: قرآنی الفاظ کے معانی */}
          {paper.tqWordsSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.tqWordsSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.tqWordsSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.tqWordsSection.instruction}</Text>
              <View style={styles.tqWordsGrid}>
                {paper.tqWordsSection.words?.map((w, idx) => (
                  <View key={idx} style={styles.tqWordCard}>
                    <Text style={styles.tqArabicText}>{w.arabic}</Text>
                    <Text style={styles.tqMeaningText}>{w.meaning}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Q4: آیات مبارکہ کا ترجمہ */}
          {paper.tqAyatSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.tqAyatSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.tqAyatSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.tqAyatSection.instruction}</Text>
              {paper.tqAyatSection.ayat?.map((a, idx) => (
                <View key={idx} style={styles.ayahCard}>
                  <Text style={[styles.ayahText, styles.rtlText]}>{a}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Q5: ترجمۃ القرآن تفصیلی سوال */}
          {paper.tqLongSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.tqLongSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.tqLongSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.tqLongSection.instruction}</Text>
              {paper.tqLongSection.options?.map((opt, idx) => (
                <Text key={idx} style={[styles.tqLongOptionText, styles.rtlText]}>{opt}</Text>
              ))}
            </View>
          )}

          {/* ======================================================== */}
          {/* 6. ISLAMIAT SECTIONS                                     */}
          {/* ======================================================== */}

          {/* Hadith Section */}
          {paper.islHadithSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.islHadithSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.islHadithSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.islHadithSection.instruction}</Text>
              <View style={styles.hadithCard}>
                <Text style={styles.hadithArabicText}>{paper.islHadithSection.hadithText}</Text>
                <Text style={[styles.hadithTranslationText, styles.rtlText]}>{paper.islHadithSection.translation}</Text>
                {paper.islHadithSection.alternateText && (
                  <Text style={[styles.hadithAltText, styles.rtlText]}>{paper.islHadithSection.alternateText}</Text>
                )}
              </View>
            </View>
          )}

          {/* Islamiat Long Question */}
          {paper.islLongSection?.active && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>{paper.islLongSection.title}</Text>
                <Text style={styles.sectionMarksBadge}>{paper.islLongSection.marks} نمبر</Text>
              </View>
              <Text style={[styles.sectionInstruction, styles.rtlText]}>{paper.islLongSection.instruction}</Text>
              {paper.islLongSection.options?.map((opt, idx) => (
                <Text key={idx} style={[styles.islLongOptionText, styles.rtlText]}>{opt}</Text>
              ))}
            </View>
          )}

          {/* ======================================================== */}
          {/* 7. DETAILED / LONG QUESTIONS (Science, Math, CS, Arts)   */}
          {/* ======================================================== */}
          {paper.longSection?.active && paper.longSection.questions?.length > 0 && (
            <View style={styles.paperSection}>
              <View style={styles.sectionHeadingWrap}>
                <Text style={styles.sectionHeading}>
                  {paper.longSection.title || (isRtl ? 'حصہ دوم: تفصیلی / انشائیہ سوالات' : 'PART - III (DETAILED / LONG QUESTIONS)')}
                </Text>
                <Text style={styles.sectionMarksBadge}>
                  Total Marks: {paper.longSection.marks}
                </Text>
              </View>
              <Text style={[styles.sectionNote, isRtl && styles.rtlText]}>
                {paper.longSection.instruction || `Note: Attempt any ${paper.longSection.attemptCount} questions out of ${paper.longSection.totalCount}.`}
              </Text>

              {paper.longSection.questions.map((lq, lIdx) => (
                <View key={lq.id || lIdx} style={styles.longBlock}>
                  <View style={styles.longHeaderRow}>
                    <Text style={styles.longNumBold}>Question No. {lq.num}:</Text>
                    <Text style={styles.longMarks}>({lq.marks} {isRtl ? 'نمبر' : 'Marks'})</Text>
                  </View>
                  <Text style={[styles.longQuestionText, isRtl && styles.rtlText]}>{lq.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Paper Footer */}
          <View style={styles.paperFooter}>
            <Text style={styles.paperFooterText}>
              ★ Best of Luck for Punjab Board Examination 2026 ★
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => onEditPaper(paper)}
        >
          <Text style={styles.editBtnText}>✏️ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, isSaved && styles.saveBtnDone]}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {isSaved ? '✓ Saved' : '💾 Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.printBtn}
          activeOpacity={0.8}
          onPress={handlePrintPdf}
        >
          <Text style={styles.printBtnText}>🖨️ Print / PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          activeOpacity={0.8}
          onPress={handleShare}
        >
          <Text style={styles.shareBtnText}>📤 Share</Text>
        </TouchableOpacity>
      </View>

      {/* Share / Print Paper Modal */}
      <Modal
        visible={isShareModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsShareModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Text style={styles.modalIcon}>📄</Text>
              </View>
              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalTitle}>Share Examination Paper</Text>
                <Text style={styles.modalSubtitle}>
                  Choose how you want to export or share this paper
                </Text>
              </View>
            </View>

            <View style={styles.modalDivider} />

            {/* Option 1: Share as PDF File (Primary / Requested by User) */}
            <TouchableOpacity
              style={[styles.modalOption, styles.modalOptionFeatured]}
              activeOpacity={0.7}
              onPress={handleSharePdf}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#dbeafe' }]}>
                <Text style={styles.optionEmoji}>📤</Text>
              </View>
              <View style={styles.optionTextCol}>
                <View style={styles.optionTitleRow}>
                  <Text style={[styles.optionTitle, { color: '#1d4ed8' }]}>Share PDF Document</Text>
                  <Text style={styles.badgePdf}>★ PDF</Text>
                </View>
                <Text style={styles.optionDesc}>
                  پی ڈی ایف کی شکل میں شیئر کریں — Sends complete official PDF file to WhatsApp, Gmail, Drive or Bluetooth.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Download PDF File (.pdf) */}
            <TouchableOpacity
              style={styles.modalOption}
              activeOpacity={0.7}
              onPress={handleDownloadPdf}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#dcfce7' }]}>
                <Text style={styles.optionEmoji}>📥</Text>
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Download PDF File (.pdf)</Text>
                <Text style={styles.optionDesc}>
                  Saves official high-resolution A4 board examination PDF directly to your device.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: Print / Save as PDF */}
            <TouchableOpacity
              style={styles.modalOption}
              activeOpacity={0.7}
              onPress={handlePrintPdf}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#f3e8ff' }]}>
                <Text style={styles.optionEmoji}>🖨️</Text>
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Print / Preview (Paper Layout)</Text>
                <Text style={styles.optionDesc}>
                  Full official BISE board examination paper layout with watermark, borders, roll no slip & bubble grid.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 4: Download HTML Examination File */}
            <TouchableOpacity
              style={styles.modalOption}
              activeOpacity={0.7}
              onPress={handleDownloadHtml}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#f1f5f9' }]}>
                <Text style={styles.optionEmoji}>💾</Text>
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Download Paper File (.HTML / Web)</Text>
                <Text style={styles.optionDesc}>
                  Saves standalone styled paper file that can be opened and printed from any browser.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 5: Share Formatted Sheet */}
            <TouchableOpacity
              style={styles.modalOption}
              activeOpacity={0.7}
              onPress={handleShareFormattedText}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#fef3c7' }]}>
                <Text style={styles.optionEmoji}>💬</Text>
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Share Text Summary</Text>
                <Text style={styles.optionDesc}>
                  Shares a brief text overview with paper details for quick messaging.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              activeOpacity={0.8}
              onPress={() => setIsShareModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* PDF Generation Loader Modal */}
      <Modal visible={isGeneratingPdf} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingTitle}>Generating Official PDF Paper...</Text>
            <Text style={styles.loadingSubtitle}>
              پی ڈی ایف پرچہ تیار ہو رہا ہے، برائے مہربانی چند سیکنڈ انتظار فرمائیں
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f6',
  },
  topActionBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  topActionLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  topActionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  topActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBtnPrint: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  topBtnShare: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  topBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 12,
  },
  paperSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  paperHeader: {
    alignItems: 'center',
    marginBottom: 6,
  },
  schoolTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  boardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  scopeHeaderLine: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaTable: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 6,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 2.5,
    alignItems: 'center',
  },
  metaCol: {
    fontSize: 12,
    color: '#1e293b',
    flexShrink: 1,
  },
  metaBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  rollBox: {
    borderWidth: 1.5,
    borderColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    alignSelf: 'flex-end',
  },
  rollText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#0f172a',
    marginVertical: 10,
  },
  paperSection: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
  },
  sectionHeadingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  sectionMarksBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionInstruction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  sectionNote: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  mcqBlock: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  mcqQuestionText: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  qNumBold: {
    fontWeight: '800',
    color: '#1e40af',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  optionsGridRtl: {
    flexDirection: 'row-reverse',
  },
  optItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  optLetter: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginRight: 4,
  },
  optText: {
    fontSize: 12,
    color: '#1e293b',
  },
  urduSubBlock: {
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  subHeadingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subHeadingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e40af',
  },
  subMarksText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  verseText: {
    fontSize: 13,
    color: '#0f172a',
    marginVertical: 2,
    lineHeight: 20,
  },
  nasrParaCard: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nasrParaTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 2,
  },
  nasrParaText: {
    fontSize: 12.5,
    color: '#1e293b',
    lineHeight: 20,
  },
  shortsList: {
    marginVertical: 4,
  },
  shortItem: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  shortItemRtl: {
    flexDirection: 'row-reverse',
  },
  shortItemNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e40af',
    width: 28,
  },
  shortItemText: {
    fontSize: 12,
    color: '#0f172a',
    flex: 1,
    lineHeight: 18,
  },
  urduShortItem: {
    fontSize: 12.5,
    color: '#0f172a',
    marginVertical: 3,
    lineHeight: 19,
  },
  khulasaCard: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
  },
  khulasaOptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    marginVertical: 2,
  },
  jumlayGrid: {
    marginTop: 4,
  },
  jumlaItem: {
    marginVertical: 2,
  },
  jumlaText: {
    fontSize: 12,
    color: '#1e293b',
  },
  shortGroup: {
    marginBottom: 12,
  },
  engParaCard: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  engParaTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 2,
  },
  engParaText: {
    fontSize: 12,
    color: '#1e293b',
    lineHeight: 18,
  },
  altNoteBox: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  altNoteText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
  },
  stanzaBox: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  stanzaText: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 18,
  },
  wordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  wordBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  wordBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1e293b',
  },
  letterOptText: {
    fontSize: 12,
    color: '#0f172a',
    marginVertical: 2,
  },
  engTopicsBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  comprehensionPassageBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  comprehensionText: {
    fontSize: 12,
    color: '#1e293b',
    lineHeight: 18,
  },
  compQText: {
    fontSize: 12,
    color: '#0f172a',
    marginVertical: 2,
    fontWeight: '600',
  },
  urduToEngList: {
    marginVertical: 4,
  },
  urduSentenceItem: {
    fontSize: 12.5,
    color: '#0f172a',
    marginVertical: 2,
  },
  voiceSentence: {
    fontSize: 12,
    color: '#0f172a',
    marginVertical: 2,
  },
  tqWordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tqWordCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 2,
  },
  tqArabicText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e40af',
    textAlign: 'center',
  },
  tqMeaningText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  ayahCard: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginVertical: 3,
    borderRightWidth: 3,
    borderRightColor: '#16a34a',
  },
  ayahText: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 22,
  },
  tqLongOptionText: {
    fontSize: 12.5,
    color: '#0f172a',
    marginVertical: 3,
  },
  hadithCard: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderRightWidth: 4,
    borderRightColor: '#16a34a',
  },
  hadithArabicText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 6,
  },
  hadithTranslationText: {
    fontSize: 12.5,
    color: '#0f172a',
    lineHeight: 20,
  },
  hadithAltText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    fontStyle: 'italic',
  },
  islLongOptionText: {
    fontSize: 12.5,
    color: '#0f172a',
    marginVertical: 3,
  },
  longBlock: {
    marginBottom: 10,
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  longHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  longNumBold: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1e40af',
  },
  longMarks: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  longQuestionText: {
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
  },
  paperFooter: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  paperFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  bottomSpace: {
    height: 70,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  saveBtn: {
    flex: 1.2,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnDone: {
    backgroundColor: '#16a34a',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  printBtn: {
    flex: 1.3,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  printBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  questionTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  skipBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  // Share & Print Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    fontSize: 22,
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  modalCloseBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  modalOptionFeatured: {
    backgroundColor: '#f0f7ff',
    borderColor: '#93c5fd',
    borderWidth: 1.5,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePdf: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 14,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});

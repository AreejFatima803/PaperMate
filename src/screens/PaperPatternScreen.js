import React, { useState, useMemo } from 'react';
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

// Determine subject pattern type based on subject ID
function getSubjectPatternType(subjectId = '') {
  const id = subjectId.toLowerCase();
  if (id.startsWith('urdu')) return 'URDU';
  if (id.startsWith('eng')) return 'ENGLISH';
  if (id.startsWith('math') || id.startsWith('gmath')) return 'MATH';
  if (id.startsWith('cs')) return 'COMPUTER';
  if (id.startsWith('tq')) return 'TARJUMA_QURAN';
  if (id.startsWith('isl') || id.startsWith('isli')) return 'ISLAMIAT';
  if (id.startsWith('phy') || id.startsWith('chem') || id.startsWith('bio') || id.startsWith('gsci') || id.startsWith('stat')) {
    return 'SCIENCE';
  }
  return 'GENERAL';
}

function getClassGrade(classInfo, subject) {
  if (classInfo?.id) return String(classInfo.id);
  if (subject?.id) {
    const parts = subject.id.split('-');
    if (parts.length > 1) return parts[parts.length - 1];
  }
  return '9';
}

export const PaperPatternScreen = ({
  selectedBoard,
  selectedClass,
  selectedSubject,
  syllabusConfig,
  onGeneratePaper,
  onBack,
}) => {
  const classGrade = getClassGrade(selectedClass, selectedSubject);
  const isInter = classGrade === '11' || classGrade === '12';
  const is10th = classGrade === '10';
  const is11th = classGrade === '11';
  const is12th = classGrade === '12';
  const is9th = classGrade === '9';

  const patternType = getSubjectPatternType(selectedSubject?.id);
  const isPakStudy = selectedSubject?.id?.toLowerCase().startsWith('pak');

  // Institution header
  const [instituteName, setInstituteName] = useState('THE HOPE TEST SERIES / HIGH SCHOOL');

  // --- 1. URDU STATE ---
  const [urduSkipMcq, setUrduSkipMcq] = useState(false);
  const [urduMcqCount, setUrduMcqCount] = useState(isInter ? '20' : '15');
  const [urduSkipTashreeh, setUrduSkipTashreeh] = useState(false); // Tashreeh
  const [urduSkipNasr, setUrduSkipNasr] = useState(false); // Nasr / Siyaq-o-Sabaq
  const [urduSkipShort, setUrduSkipShort] = useState(false); // Shorts (9th/10th)
  const [urduShortCount, setUrduShortCount] = useState('5');
  const [urduShortTotal, setUrduShortTotal] = useState('8');
  const [urduSkipKhulasa, setUrduSkipKhulasa] = useState(false); // Sabaq ka Khulasa
  const [urduSkipNazmKhulasa, setUrduSkipNazmKhulasa] = useState(false); // Nazm ka Khulasa
  const [urduSkipKhat, setUrduSkipKhat] = useState(false); // Khat / Darkhwast / Aap-beeti
  const [urduSkipKahani, setUrduSkipKahani] = useState(false); // Kahani / Mukalma / Roedad
  const [urduSkipJumlay, setUrduSkipJumlay] = useState(false); // Jumlay / Zarb-ul-Amsal (9th) / Talkhees (11th)
  const [urduSkipEssay, setUrduSkipEssay] = useState(false); // Mazmoon (10th & 12th)
  const [urduSkipTafheem, setUrduSkipTafheem] = useState(false); // Tafheem (10th)

  // --- 2. ENGLISH STATE ---
  const [engSkipMcq, setEngSkipMcq] = useState(false);
  const [engMcqCount, setEngMcqCount] = useState(isInter ? '20' : is9th ? '16' : '19');
  const [engSkipShort, setEngSkipShort] = useState(false); // Short answers
  const [engShortCount, setEngShortCount] = useState(is12th ? '6' : is11th ? '6' : '5');
  const [engShortTotal, setEngShortTotal] = useState(is12th ? '9' : is11th ? '9' : '8');
  const [engSkipTrans, setEngSkipTrans] = useState(false); // Translate into Urdu
  const [engSkipPoem, setEngSkipPoem] = useState(false); // Poem Summary / Stanza
  const [engSkipIdioms, setEngSkipIdioms] = useState(false); // Words / Idioms in sentences
  const [engSkipLetter, setEngSkipLetter] = useState(false); // Letter / Story / Dialogue
  const [engSkipComprehension, setEngSkipComprehension] = useState(false); // Comprehension Passage
  const [engSkipUrduToEng, setEngSkipUrduToEng] = useState(false); // Translate into English
  const [engSkipVoice, setEngSkipVoice] = useState(false); // Active to Passive Voice (9th)
  const [engSkipEssay, setEngSkipEssay] = useState(false); // Essay (10th & 12th)
  const [engSkipNarration, setEngSkipNarration] = useState(false); // Direct/Indirect (10th)
  const [engSkipPairs, setEngSkipPairs] = useState(false); // Pair of words (10th & 11th)
  const [engSkipNovel, setEngSkipNovel] = useState(false); // Mr. Chips (12th)
  const [engSkipPlays, setEngSkipPlays] = useState(false); // One Act Plays (11th)

  // --- 3. MATH STATE ---
  const [mathSkipMcq, setMathSkipMcq] = useState(false);
  const [mathMcqCount, setMathMcqCount] = useState(isInter ? '20' : '15');
  const [mathSkipQ2, setMathSkipQ2] = useState(false);
  const [mathSkipQ3, setMathSkipQ3] = useState(false);
  const [mathSkipQ4, setMathSkipQ4] = useState(false);
  const [mathSkipLong, setMathSkipLong] = useState(false);
  const [mathLongCount, setMathLongCount] = useState('3');

  // --- 4. COMPUTER SCIENCE STATE ---
  const [csSkipMcq, setCsSkipMcq] = useState(false);
  const [csMcqCount, setCsMcqCount] = useState(isInter ? '15' : '10');
  const [csSkipQ2, setCsSkipQ2] = useState(false);
  const [csSkipQ3, setCsSkipQ3] = useState(false);
  const [csSkipQ4, setCsSkipQ4] = useState(false);
  const [csSkipLong, setCsSkipLong] = useState(false);
  const [csLongCount, setCsLongCount] = useState(isInter ? '3' : '2');

  // --- 5. SCIENCE (Physics, Chemistry, Biology) STATE ---
  const [sciSkipMcq, setSciSkipMcq] = useState(false);
  const [sciMcqCount, setSciMcqCount] = useState(isInter ? '17' : '12');
  const [sciSkipQ2, setSciSkipQ2] = useState(false);
  const [sciSkipQ3, setSciSkipQ3] = useState(false);
  const [sciSkipQ4, setSciSkipQ4] = useState(false);
  const [sciSkipLong, setSciSkipLong] = useState(false);
  const [sciLongCount, setSciLongCount] = useState(isInter ? '3' : '2');

  // --- 6. TARJUMA-TUL-QURAN (T.Q) STATE ---
  const [tqSkipMcq, setTqSkipMcq] = useState(false);
  const [tqMcqCount, setTqMcqCount] = useState('10');
  const [tqSkipShort, setTqSkipShort] = useState(false);
  const [tqSkipWords, setTqSkipWords] = useState(false);
  const [tqSkipAyat, setTqSkipAyat] = useState(false);
  const [tqSkipLong, setTqSkipLong] = useState(false);

  // --- 7. ISLAMIAT STATE ---
  const [islSkipMcq, setIslSkipMcq] = useState(false);
  const [islMcqCount, setIslMcqCount] = useState('10');
  const [islSkipQ2, setIslSkipQ2] = useState(false);
  const [islSkipQ3, setIslSkipQ3] = useState(false);
  const [islSkipAyat, setIslSkipAyat] = useState(false);
  const [islSkipLong, setIslSkipLong] = useState(false);

  // --- 8. GENERAL / PAK STUDIES / ARTS / COMMERCE STATE ---
  const defaultGenMcqs = isPakStudy ? '10' : isInter ? '20' : '15';
  const [genSkipMcq, setGenSkipMcq] = useState(false);
  const [genMcqCount, setGenMcqCount] = useState(defaultGenMcqs);
  const [genSkipQ2, setGenSkipQ2] = useState(false);
  const [genQ2Count, setGenQ2Count] = useState(isInter && !isPakStudy ? '8' : '6');
  const [genSkipQ3, setGenSkipQ3] = useState(false);
  const [genQ3Count, setGenQ3Count] = useState(isInter && !isPakStudy ? '8' : '6');
  const [genSkipLong, setGenSkipLong] = useState(false);
  const [genLongCount, setGenLongCount] = useState(isInter && !isPakStudy ? '3' : '2');

  // Generating modal animation (1.5 seconds)
  const [isGenerating, setIsGenerating] = useState(false);

  // Live Total Marks Calculation
  const totalCalculatedMarks = useMemo(() => {
    let total = 0;

    if (patternType === 'URDU') {
      if (isInter) {
        // 11th & 12th Urdu (100 Marks)
        if (!urduSkipMcq) total += parseInt(urduMcqCount, 10) || 20;
        if (!urduSkipTashreeh) total += is12th ? 18 : 18;
        if (!urduSkipNasr) total += 15;
        if (!urduSkipKhulasa) total += 10;
        if (!urduSkipNazmKhulasa) total += 5;
        if (is12th) {
          if (!urduSkipEssay) total += 20; // Mazmoon
          if (!urduSkipKhat) total += 10; // Khat / Aap-beeti
        } else {
          // 11th
          if (!urduSkipKahani) total += 10; // Mukalma / Roedad
          if (!urduSkipKhat) total += 10; // Darkhwast / Raseed
          if (!urduSkipJumlay) total += 10; // Talkhees
        }
      } else if (is10th) {
        // 10th Urdu (75 Marks)
        if (!urduSkipMcq) total += parseInt(urduMcqCount, 10) || 15;
        if (!urduSkipTashreeh) total += 10;
        if (!urduSkipNasr) total += 10;
        if (!urduSkipShort) total += 10;
        if (!urduSkipKhulasa) total += 5;
        if (!urduSkipEssay) total += 15; // Mazmoon
        if (!urduSkipTafheem) total += 10; // Fahm-e-Ibarat
      } else {
        // 9th Urdu (75 Marks)
        if (!urduSkipMcq) total += parseInt(urduMcqCount, 10) || 15;
        if (!urduSkipTashreeh) total += 10;
        if (!urduSkipNasr) total += 10;
        if (!urduSkipShort) total += (parseInt(urduShortCount, 10) || 5) * 2;
        if (!urduSkipKhulasa) total += 5;
        if (!urduSkipNazmKhulasa) total += 5;
        if (!urduSkipKhat) total += 10;
        if (!urduSkipKahani) total += 5;
        if (!urduSkipJumlay) total += 5;
      }
    } else if (patternType === 'ENGLISH') {
      if (is12th) {
        // 12th English (100 Marks)
        if (!engSkipMcq) total += parseInt(engMcqCount, 10) || 20;
        if (!engSkipShort) total += 12; // Book II Prose (6x2=12)
        total += 12; // Book II Heroes (6x2=12)
        if (!engSkipNovel) total += 16; // Mr Chips (8x2=16)
        if (!engSkipEssay) total += 15; // Essay (15)
        if (!engSkipIdioms) total += 10; // Idioms (5x2=10)
        if (!engSkipUrduToEng) total += 15; // Translation (15)
      } else if (is11th) {
        // 11th English (100 Marks)
        if (!engSkipMcq) total += parseInt(engMcqCount, 10) || 20;
        if (!engSkipShort) total += 12; // Book I Stories (6x2=12)
        if (!engSkipPlays) total += 10; // Plays (5x2=10)
        total += 10; // Poems (5x2=10)
        if (!engSkipLetter) total += 10; // Letter/App (10)
        total += 10; // Story (10)
        if (!engSkipPoem) total += 5; // Stanza (5)
        total += 5; // Punctuation (5)
        if (!engSkipPairs) total += 5; // Pairs (5)
        if (!engSkipTrans) total += 15; // Translation (15)
      } else if (is10th) {
        // 10th English (75 Marks)
        if (!engSkipMcq) total += parseInt(engMcqCount, 10) || 19;
        if (!engSkipShort) total += 10; // Shorts (5x2=10)
        if (!engSkipTrans) total += 8; // Translation Urdu (8)
        if (!engSkipPoem) total += 5; // Summary/Stanza (5)
        if (!engSkipEssay) total += 15; // Essay (15)
        if (!engSkipNarration) total += 5; // Direct/Indirect (5)
        if (!engSkipPairs) total += 5; // Pairs (5)
        if (!engSkipUrduToEng) total += 10; // Translation English (10)
      } else {
        // 9th English (72 Marks standard BISE breakdown: 16 Objective + 56 Subjective = 72)
        if (!engSkipMcq) total += parseInt(engMcqCount, 10) || 16;
        if (!engSkipShort) total += (parseInt(engShortCount, 10) || 5) * 2;
        if (!engSkipTrans) total += 8;
        if (!engSkipPoem) total += 5;
        if (!engSkipIdioms) total += 5;
        if (!engSkipLetter) total += 8;
        if (!engSkipComprehension) total += 10;
        if (!engSkipUrduToEng) total += 5;
        if (!engSkipVoice) total += 5;
      }
    } else if (patternType === 'MATH') {
      if (isInter) {
        // 11th/12th Math (100 Marks)
        if (!mathSkipMcq) total += parseInt(mathMcqCount, 10) || 20;
        if (!mathSkipQ2) total += 16;
        if (!mathSkipQ3) total += 16;
        if (!mathSkipQ4) total += 18;
        if (!mathSkipLong) total += (parseInt(mathLongCount, 10) || 3) * 10;
      } else {
        // 9th/10th Math (75 Marks)
        if (!mathSkipMcq) total += parseInt(mathMcqCount, 10) || 15;
        if (!mathSkipQ2) total += 12;
        if (!mathSkipQ3) total += 12;
        if (!mathSkipQ4) total += 12;
        if (!mathSkipLong) total += (parseInt(mathLongCount, 10) || 3) * 8;
      }
    } else if (patternType === 'COMPUTER') {
      if (isInter) {
        // 11th/12th Computer (75 Marks)
        if (!csSkipMcq) total += parseInt(csMcqCount, 10) || 15;
        if (!csSkipQ2) total += 12;
        if (!csSkipQ3) total += 12;
        if (!csSkipQ4) total += 12;
        if (!csSkipLong) total += (parseInt(csLongCount, 10) || 3) * 8;
      } else {
        // 9th/10th Computer (50 Marks)
        if (!csSkipMcq) total += parseInt(csMcqCount, 10) || 10;
        if (!csSkipQ2) total += 8;
        if (!csSkipQ3) total += 8;
        if (!csSkipQ4) total += 8;
        if (!csSkipLong) total += (parseInt(csLongCount, 10) || 2) * 8;
      }
    } else if (patternType === 'SCIENCE') {
      if (isInter) {
        // 11th/12th Physics, Chem, Bio (85 Marks)
        if (!sciSkipMcq) total += parseInt(sciMcqCount, 10) || 17;
        if (!sciSkipQ2) total += 16;
        if (!sciSkipQ3) total += 16;
        if (!sciSkipQ4) total += 12;
        if (!sciSkipLong) total += (parseInt(sciLongCount, 10) || 3) * 8;
      } else {
        // 9th/10th Science (60 Marks)
        if (!sciSkipMcq) total += parseInt(sciMcqCount, 10) || 12;
        if (!sciSkipQ2) total += 10;
        if (!sciSkipQ3) total += 10;
        if (!sciSkipQ4) total += 10;
        if (!sciSkipLong) total += (parseInt(sciLongCount, 10) || 2) * 9;
      }
    } else if (patternType === 'TARJUMA_QURAN') {
      // 50 Marks
      if (!tqSkipMcq) total += parseInt(tqMcqCount, 10) || 10;
      if (!tqSkipShort) total += 10;
      if (!tqSkipWords) total += 5;
      if (!tqSkipAyat) total += 15;
      if (!tqSkipLong) total += 10;
    } else if (patternType === 'ISLAMIAT') {
      // 50 Marks
      if (!islSkipMcq) total += parseInt(islMcqCount, 10) || 10;
      if (!islSkipQ2) total += 12;
      if (!islSkipQ3) total += 12;
      if (!islSkipAyat) total += 8;
      if (!islSkipLong) total += 8;
    } else {
      // GENERAL / PAK STUDIES / ARTS / COMMERCE
      if (isPakStudy) {
        // Pak Studies (50 Marks)
        if (!genSkipMcq) total += parseInt(genMcqCount, 10) || 10;
        if (!genSkipQ2) total += 12;
        if (!genSkipQ3) total += 12;
        if (!genSkipLong) total += 16;
      } else if (isInter) {
        // 11th/12th Arts / Humanities / Commerce (100 Marks)
        if (!genSkipMcq) total += parseInt(genMcqCount, 10) || 20;
        if (!genSkipQ2) total += 16;
        if (!genSkipQ3) total += 16;
        total += 16; // Q4
        if (!genSkipLong) total += 32;
      } else {
        // 9th/10th Arts / General (75 Marks)
        if (!genSkipMcq) total += parseInt(genMcqCount, 10) || 15;
        if (!genSkipQ2) total += (parseInt(genQ2Count, 10) || 6) * 2;
        if (!genSkipQ3) total += (parseInt(genQ3Count, 10) || 6) * 2;
        total += 12; // Q4
        if (!genSkipLong) total += (parseInt(genLongCount, 10) || 3) * 8;
      }
    }
    return total;
  }, [
    patternType, isInter, is10th, is11th, is12th, is9th, isPakStudy,
    urduSkipMcq, urduMcqCount, urduSkipTashreeh, urduSkipNasr, urduSkipShort, urduShortCount, urduSkipKhulasa, urduSkipNazmKhulasa, urduSkipKhat, urduSkipKahani, urduSkipJumlay, urduSkipEssay, urduSkipTafheem,
    engSkipMcq, engMcqCount, engSkipShort, engShortCount, engSkipTrans, engSkipPoem, engSkipIdioms, engSkipLetter, engSkipComprehension, engSkipUrduToEng, engSkipVoice, engSkipEssay, engSkipNarration, engSkipPairs, engSkipNovel, engSkipPlays,
    mathSkipMcq, mathMcqCount, mathSkipQ2, mathSkipQ3, mathSkipQ4, mathSkipLong, mathLongCount,
    csSkipMcq, csMcqCount, csSkipQ2, csSkipQ3, csSkipQ4, csSkipLong, csLongCount,
    sciSkipMcq, sciMcqCount, sciSkipQ2, sciSkipQ3, sciSkipQ4, sciSkipLong, sciLongCount,
    tqSkipMcq, tqMcqCount, tqSkipShort, tqSkipWords, tqSkipAyat, tqSkipLong,
    islSkipMcq, islMcqCount, islSkipQ2, islSkipQ3, islSkipAyat, islSkipLong,
    genSkipMcq, genMcqCount, genSkipQ2, genQ2Count, genSkipQ3, genQ3Count, genSkipLong, genLongCount,
  ]);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const paperConfig = {
        institutionName: instituteName,
        board: selectedBoard,
        classInfo: selectedClass,
        subject: selectedSubject,
        patternType,
        totalMarks: totalCalculatedMarks,
        syllabusType: syllabusConfig?.syllabusType,
        selectedChapters: syllabusConfig?.selectedChapters || [],

        // Detailed pattern options
        urduConfig: {
          skipMcq: urduSkipMcq,
          mcqCount: parseInt(urduMcqCount, 10) || (isInter ? 20 : 15),
          skipTashreeh: urduSkipTashreeh,
          skipNasr: urduSkipNasr,
          skipShort: urduSkipShort,
          shortCount: parseInt(urduShortCount, 10) || 5,
          shortTotal: parseInt(urduShortTotal, 10) || 8,
          skipKhulasa: urduSkipKhulasa,
          skipNazmKhulasa: urduSkipNazmKhulasa,
          skipKhat: urduSkipKhat,
          skipKahani: urduSkipKahani,
          skipJumlay: urduSkipJumlay,
        },

        englishConfig: {
          skipMcq: engSkipMcq,
          mcqCount: parseInt(engMcqCount, 10) || (isInter ? 20 : is9th ? 16 : 19),
          skipShort: engSkipShort,
          shortCount: parseInt(engShortCount, 10) || (isInter ? 6 : 5),
          shortTotal: parseInt(engShortTotal, 10) || (isInter ? 9 : 8),
          skipTrans: engSkipTrans,
          skipPoem: engSkipPoem,
          skipIdioms: engSkipIdioms,
          skipLetter: engSkipLetter,
          skipComprehension: engSkipComprehension,
          skipUrduToEng: engSkipUrduToEng,
          skipVoice: engSkipVoice,
        },

        mathConfig: {
          skipMcq: mathSkipMcq,
          mcqCount: parseInt(mathMcqCount, 10) || (isInter ? 20 : 15),
          skipQ2: mathSkipQ2,
          skipQ3: mathSkipQ3,
          skipQ4: mathSkipQ4,
          skipLong: mathSkipLong,
          longCount: parseInt(mathLongCount, 10) || 3,
        },

        computerConfig: {
          skipMcq: csSkipMcq,
          mcqCount: parseInt(csMcqCount, 10) || (isInter ? 15 : 10),
          skipQ2: csSkipQ2,
          skipQ3: csSkipQ3,
          skipQ4: csSkipQ4,
          skipLong: csSkipLong,
          longCount: parseInt(csLongCount, 10) || (isInter ? 3 : 2),
        },

        scienceConfig: {
          skipMcq: sciSkipMcq,
          mcqCount: parseInt(sciMcqCount, 10) || (isInter ? 17 : 12),
          skipQ2: sciSkipQ2,
          skipQ3: sciSkipQ3,
          skipQ4: sciSkipQ4,
          skipLong: sciSkipLong,
          longCount: parseInt(sciLongCount, 10) || (isInter ? 3 : 2),
        },

        tqConfig: {
          skipMcq: tqSkipMcq,
          mcqCount: parseInt(tqMcqCount, 10) || 10,
          skipShort: tqSkipShort,
          skipWords: tqSkipWords,
          skipAyat: tqSkipAyat,
          skipLong: tqSkipLong,
        },

        islamiatConfig: {
          skipMcq: islSkipMcq,
          mcqCount: parseInt(islMcqCount, 10) || 10,
          skipQ2: islSkipQ2,
          skipQ3: islSkipQ3,
          skipAyat: islSkipAyat,
          skipLong: islSkipLong,
        },

        generalConfig: {
          skipMcq: genSkipMcq,
          mcqCount: parseInt(genMcqCount, 10) || (isPakStudy ? 10 : isInter ? 20 : 15),
          skipQ2: genSkipQ2,
          q2Count: parseInt(genQ2Count, 10) || (isInter ? 8 : 6),
          skipQ3: genSkipQ3,
          q3Count: parseInt(genQ3Count, 10) || (isInter ? 8 : 6),
          skipLong: genSkipLong,
          longCount: parseInt(genLongCount, 10) || (isInter ? 3 : 2),
        },
      };

      onGeneratePaper(paperConfig);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Paper Pattern & Breakdown"
        subtitle={`${selectedClass?.name || classGrade + 'th Class'} • ${selectedSubject?.name} • BISE 2026`}
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Live Total Marks Header Card */}
        <View style={styles.liveMarksCard}>
          <View style={styles.liveMarksInfo}>
            <Text style={styles.liveMarksSub}>Total Configured Exam Marks:</Text>
            <Text style={styles.liveMarksNum}>{totalCalculatedMarks} Marks</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>
              ⏱️ {totalCalculatedMarks >= 85 ? '2:30 Hours' : totalCalculatedMarks >= 60 ? '2:10 Hours' : totalCalculatedMarks >= 45 ? '1:45 Hours' : '1:00 Hour'}
            </Text>
          </View>
        </View>

        {/* Institution / College Header */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏫 Institution / School Header:</Text>
          <TextInput
            style={styles.textInput}
            value={instituteName}
            onChangeText={setInstituteName}
            placeholder="Enter school or college name for paper header..."
          />
        </View>

        {/* ======================================================== */}
        {/* 1. URDU EXAM PATTERN (9th, 10th, 11th, 12th)              */}
        {/* ======================================================== */}
        {patternType === 'URDU' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                📋 اردو پیپر پیٹرن سیٹنگز ({classGrade}ویں جماعت - پنجاب ٹیکسٹ بک بورڈ 2026)
              </Text>
            </View>

            {/* Q1: معروضی سوالات */}
            <View style={[styles.sectionCard, urduSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 1: کثیر الانتخابی سوالات (MCQs)</Text>
                  <Text style={styles.questionSubtitle}>
                    {isInter ? 'حصہ نثر، شعری اصطلاحات، قواعد اور امدادی افعال (20 نمبر)' : 'حصہ نثر، نظم و غزل اور قواعد و انشاء (15 نمبر)'}
                  </Text>
                </View>
                <View style={styles.skipWrap}>
                  <Text style={styles.skipLabel}>Skip</Text>
                  <Switch value={urduSkipMcq} onValueChange={setUrduSkipMcq} />
                </View>
              </View>
              {!urduSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>کل معروضی سوالات کی تعداد:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={urduMcqCount}
                    onChangeText={setUrduMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* Q2: اشعار کی تشریح */}
            <View style={[styles.sectionCard, urduSkipTashreeh && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 2: اشعار کی تشریح (حصہ اول)</Text>
                  <Text style={styles.questionSubtitle}>
                    {isInter ? 'حصہ نظم (8 نمبر) + حصہ غزل (10 نمبر) = کل 18 نمبر' : 'حصہ نظم سے 3 اشعار (6 نمبر) اور حصہ غزل سے 2 اشعار (4 نمبر) = کل 10 نمبر'}
                  </Text>
                </View>
                <View style={styles.skipWrap}>
                  <Text style={styles.skipLabel}>Skip</Text>
                  <Switch value={urduSkipTashreeh} onValueChange={setUrduSkipTashreeh} />
                </View>
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '18 Marks' : '10 Marks'} (نظم و غزل کے اشعار کی مفصل تشریح)</Text>
            </View>

            {/* Q3: نثری پاروں کی تشریح */}
            <View style={[styles.sectionCard, urduSkipNasr && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 3: نثری اقتباسات کی تشریح (حصہ دوم)</Text>
                  <Text style={styles.questionSubtitle}>
                    {isInter ? 'سبق کا عنوان، مصنف کا نام، سیاق و سباق اور سلیس تشریح (15 نمبر)' : 'سبق کا عنوان، مصنف کا نام، خط کشیدہ الفاظ کے معانی اور سلیس تشریح (10 نمبر)'}
                  </Text>
                </View>
                <View style={styles.skipWrap}>
                  <Text style={styles.skipLabel}>Skip</Text>
                  <Switch value={urduSkipNasr} onValueChange={setUrduSkipNasr} />
                </View>
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '15 Marks (سیاق و سباق سمیت)' : '10 Marks (1+1+3+5 = 10 نمبر)'}</Text>
            </View>

            {/* Q4 (9th & 10th): مختصر سوالات / Q4 (11th & 12th): سبق کا خلاصہ */}
            {isInter ? (
              <View style={[styles.sectionCard, urduSkipKhulasa && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 4: سبق کا خلاصہ</Text>
                    <Text style={styles.questionSubtitle}>کسی ایک سبق کا جامع خلاصہ اور مصنف کا نام (10 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipKhulasa} onValueChange={setUrduSkipKhulasa} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 10 Marks (1 نمبر مصنف + 9 نمبر خلاصہ)</Text>
              </View>
            ) : (
              <View style={[styles.sectionCard, urduSkipShort && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 4: مختصر سوالات کے جوابات</Text>
                    <Text style={styles.questionSubtitle}>اسباق کے مشقی سوالات کے مختصر جوابات (2 نمبر فی سوال = 10 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipShort} onValueChange={setUrduSkipShort} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 10 Marks (8 میں سے کوئی سے 5 سوالات)</Text>
              </View>
            )}

            {/* Q5: 9th & 10th Khulasa / 11th & 12th Nazm Khulasa */}
            {isInter ? (
              <View style={[styles.sectionCard, urduSkipNazmKhulasa && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 5: نظم کا خلاصہ</Text>
                    <Text style={styles.questionSubtitle}>شاملِ نصاب نظم کا خلاصہ تحریر کیجیے (5 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipNazmKhulasa} onValueChange={setUrduSkipNazmKhulasa} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 5 Marks (نظم کا خلاصہ)</Text>
              </View>
            ) : (
              <View style={[styles.sectionCard, urduSkipKhulasa && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 5: سبق کا خلاصہ</Text>
                    <Text style={styles.questionSubtitle}>دو میں سے کسی ایک سبق کا جامع خلاصہ تحریر کیجیے (5 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipKhulasa} onValueChange={setUrduSkipKhulasa} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 5 Marks (2 اسباق میں سے ایک کا انتخاب)</Text>
              </View>
            )}

            {/* 10th & 12th Urdu: Mazmoon */}
            {(is10th || is12th) && (
              <View style={[styles.sectionCard, urduSkipEssay && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 6: تفصیلی مضمون نویسی</Text>
                    <Text style={styles.questionSubtitle}>
                      {is12th ? 'دیے گئے 3 عنوانات میں سے کسی ایک پر جامع اور مدلل مضمون (20 نمبر)' : 'دیے گئے عنوانات میں سے کسی ایک پر مضمون تحریر کیجیے (15 نمبر)'}
                    </Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipEssay} onValueChange={setUrduSkipEssay} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ {is12th ? '20 Marks' : '15 Marks'} (جامع مضمون نویسی)</Text>
              </View>
            )}

            {/* 10th Urdu: Fahm-e-Ibarat */}
            {is10th && (
              <View style={[styles.sectionCard, urduSkipTafheem && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 7: فہمِ عبارت (Comprehension Passage)</Text>
                    <Text style={styles.questionSubtitle}>عبارت کو غور سے پڑھ کر نیچے دیے گئے 5 سوالات کے جوابات (10 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipTafheem} onValueChange={setUrduSkipTafheem} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 10 Marks (5 سوالات × 2 نمبر = 10 نمبر)</Text>
              </View>
            )}

            {/* 12th Urdu: Khat / Aap-beeti */}
            {is12th && (
              <View style={[styles.sectionCard, urduSkipKhat && styles.cardDisabled]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.questionMainTitle}>سوال نمبر 7: خطوط نویسی یا آپ بیتی</Text>
                    <Text style={styles.questionSubtitle}>مدیر کے نام خط یا آپ بیتی تحریر کیجیے (10 نمبر)</Text>
                  </View>
                  <View style={styles.skipWrap}>
                    <Text style={styles.skipLabel}>Skip</Text>
                    <Switch value={urduSkipKhat} onValueChange={setUrduSkipKhat} />
                  </View>
                </View>
                <Text style={styles.badgeHint}>✓ 10 Marks (خط یا آپ بیتی)</Text>
              </View>
            )}

            {/* 11th Urdu: Mukalma / Roedad, Darkhwast, Talkhees */}
            {is11th && (
              <>
                <View style={[styles.sectionCard, urduSkipKahani && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 6: مکالمہ نگاری یا روداد نویسی</Text>
                      <Text style={styles.questionSubtitle}>مکالمہ یا روداد تحریر کیجیے (10 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipKahani} onValueChange={setUrduSkipKahani} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (مکالمہ یا روداد)</Text>
                </View>

                <View style={[styles.sectionCard, urduSkipKhat && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 7: درخواست نویسی یا رسید نویسی</Text>
                      <Text style={styles.questionSubtitle}>پرنسپل کے نام درخواست یا رسید تحریر کیجیے (10 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipKhat} onValueChange={setUrduSkipKhat} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (درخواست یا رسید)</Text>
                </View>

                <View style={[styles.sectionCard, urduSkipJumlay && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 8: عبارت کی تلخیص نگاری</Text>
                      <Text style={styles.questionSubtitle}>عبارت کی تلخیص اور مناسب عنوان تجویز کیجیے (10 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipJumlay} onValueChange={setUrduSkipJumlay} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (تلخیص 8 نمبر + عنوان 2 نمبر)</Text>
                </View>
              </>
            )}

            {/* 9th Urdu: Q6 (Nazm Khulasa), Q7 (Khat/App), Q8 (Kahani/Mukalma), Q9 (Jumlay) */}
            {is9th && (
              <>
                <View style={[styles.sectionCard, urduSkipNazmKhulasa && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 6: نظم کا خلاصہ یا مرکزی خیال</Text>
                      <Text style={styles.questionSubtitle}>شاملِ نصاب نظم کا مرکزی خیال یا خلاصہ اور شاعر کا نام (5 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipNazmKhulasa} onValueChange={setUrduSkipNazmKhulasa} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (نظم کا خلاصہ / مرکزی خیال)</Text>
                </View>

                <View style={[styles.sectionCard, urduSkipKhat && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 7: خط یا درخواست</Text>
                      <Text style={styles.questionSubtitle}>والد/دوست کے نام خط یا پرنسپل کے نام درخواست (10 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipKhat} onValueChange={setUrduSkipKhat} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (خط یا درخواست کا باقاعدہ پیٹرن)</Text>
                </View>

                <View style={[styles.sectionCard, urduSkipKahani && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 8: کہانی یا مکالمہ</Text>
                      <Text style={styles.questionSubtitle}>اخلاقی سبق پر مبنی کہانی یا مکالمہ (5 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipKahani} onValueChange={setUrduSkipKahani} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (کہانی یا مکالمہ نگاری)</Text>
                </View>

                <View style={[styles.sectionCard, urduSkipJumlay && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>سوال نمبر 9: جملوں کی درستی یا ضرب الامثال کی تکمیل</Text>
                      <Text style={styles.questionSubtitle}>غلط جملوں کی درستی یا نامکمل ضرب الامثال کی تکمیل (5 نمبر)</Text>
                    </View>
                    <View style={styles.skipWrap}>
                      <Text style={styles.skipLabel}>Skip</Text>
                      <Switch value={urduSkipJumlay} onValueChange={setUrduSkipJumlay} />
                    </View>
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (کوئی سے 5 جملے یا کہاوتیں)</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* 2. ENGLISH EXAM PATTERN (9th, 10th, 11th, 12th)           */}
        {/* ======================================================== */}
        {patternType === 'ENGLISH' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                📋 English Examination Pattern ({classGrade}th Class • BISE Official Standard)
              </Text>
            </View>

            {/* Q1: MCQs */}
            <View style={[styles.sectionCard, engSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.1: Objective Paper (MCQs)</Text>
                  <Text style={styles.questionSubtitle}>
                    {isInter ? 'Synonyms, Antonyms, Prepositions & Sentence Correction (20 Marks)' : is9th ? 'Form of verbs, spellings, synonyms & grammar (16 Marks • Total 72 Marks)' : 'Form of verbs, spellings, synonyms & grammar (19 Marks)'}
                  </Text>
                </View>
                <View style={styles.skipWrap}>
                  <Text style={styles.skipLabel}>Skip</Text>
                  <Switch value={engSkipMcq} onValueChange={setEngSkipMcq} />
                </View>
              </View>
              {!engSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Enter Total MCQs count:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={engMcqCount}
                    onChangeText={setEngMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* 12th Class English Sections */}
            {is12th && (
              <>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.2: Book-II (Modern Prose) Short Answers</Text>
                  <Text style={styles.questionSubtitle}>Attempt any 6 out of 9 questions (6 × 2 = 12 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 12 Marks (Modern Prose Chapters 1-10)</Text>
                </View>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.3: Book-II (Heroes) Short Answers</Text>
                  <Text style={styles.questionSubtitle}>Attempt any 6 out of 8 questions (6 × 2 = 12 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 12 Marks (Churchill, Fleming, Pasteur, Kamal)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipNovel && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.4: Novel "Good-Bye, Mr. Chips"</Text>
                      <Text style={styles.questionSubtitle}>Attempt any 8 out of 12 questions (8 × 2 = 16 Marks)</Text>
                    </View>
                    <Switch value={engSkipNovel} onValueChange={setEngSkipNovel} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 16 Marks (Comprehensive Novel Questions)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipEssay && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.5: Comprehensive Essay Writing</Text>
                      <Text style={styles.questionSubtitle}>Write 300-400 words on any 1 out of 4 topics (15 Marks)</Text>
                    </View>
                    <Switch value={engSkipEssay} onValueChange={setEngSkipEssay} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 15 Marks (High School / College Level Essay)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipIdioms && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.6: Idioms & Phrasal Verbs in Sentences</Text>
                      <Text style={styles.questionSubtitle}>Use any 5 idioms out of 8 in sentences (5 × 2 = 10 Marks)</Text>
                    </View>
                    <Switch value={engSkipIdioms} onValueChange={setEngSkipIdioms} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Idioms & Phrasal Verbs)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipUrduToEng && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.7: Translate Urdu Paragraph into English</Text>
                      <Text style={styles.questionSubtitle}>Translate paragraph into English with alternate English topic (15 Marks)</Text>
                    </View>
                    <Switch value={engSkipUrduToEng} onValueChange={setEngSkipUrduToEng} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 15 Marks (Urdu to English Translation)</Text>
                </View>
              </>
            )}

            {/* 11th Class English Sections */}
            {is11th && (
              <>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.2: Book-I (Short Stories) Questions</Text>
                  <Text style={styles.questionSubtitle}>Attempt any 6 out of 9 questions (6 × 2 = 12 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 12 Marks (Stories 1-15)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipPlays && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.3: Book-III (One Act Plays) Questions</Text>
                      <Text style={styles.questionSubtitle}>Attempt any 5 out of 8 questions (5 × 2 = 10 Marks)</Text>
                    </View>
                    <Switch value={engSkipPlays} onValueChange={setEngSkipPlays} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Heat Lightning, Visit to Small Planet, Pearl)</Text>
                </View>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.4: Book-III (Poems) Questions</Text>
                  <Text style={styles.questionSubtitle}>Attempt any 5 out of 8 questions (5 × 2 = 10 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Poems 1-20 Comprehension)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipLetter && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.5: Formal Letter OR Application Writing</Text>
                      <Text style={styles.questionSubtitle}>Write a letter to friend or application to Principal (10 Marks)</Text>
                    </View>
                    <Switch value={engSkipLetter} onValueChange={setEngSkipLetter} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Letter / Application Format)</Text>
                </View>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.6: Moral Story Writing</Text>
                  <Text style={styles.questionSubtitle}>Write a moral story on given moral outline (10 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Moral Story with Moral Lesson)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipPoem && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.7: Stanza Explanation with Reference to Context</Text>
                      <Text style={styles.questionSubtitle}>Explain poem stanza (5 Marks) + Punctuation (5 Marks) + Pairs (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipPoem} onValueChange={setEngSkipPoem} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 15 Marks (5 Stanza + 5 Punctuation + 5 Pairs)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipTrans && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.8: Translate Textbook Passage into Urdu</Text>
                      <Text style={styles.questionSubtitle}>Translate passage into Urdu (15 Marks)</Text>
                    </View>
                    <Switch value={engSkipTrans} onValueChange={setEngSkipTrans} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 15 Marks (Textbook Translation Passage)</Text>
                </View>
              </>
            )}

            {/* 10th Class English Sections */}
            {is10th && (
              <>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.2: Short Answer Questions (Section-I)</Text>
                  <Text style={styles.questionSubtitle}>Attempt any 5 out of 8 questions from textbook (10 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 10 Marks (5 × 2 = 10 Marks)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipTrans && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.3: Translate Textbook Paragraph into Urdu</Text>
                      <Text style={styles.questionSubtitle}>Translate textbook passage into Urdu (8 Marks)</Text>
                    </View>
                    <Switch value={engSkipTrans} onValueChange={setEngSkipTrans} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 8 Marks (English to Urdu Translation)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipPoem && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.4: Poem Summary OR Stanza</Text>
                      <Text style={styles.questionSubtitle}>Summary of "Try Again" / "Peace" OR explain stanza (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipPoem} onValueChange={setEngSkipPoem} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (Poem Summary / Stanza)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipEssay && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.5: Essay OR Paragraph Writing</Text>
                      <Text style={styles.questionSubtitle}>Write 150-200 words essay on any 1 of 3 topics (15 Marks)</Text>
                    </View>
                    <Switch value={engSkipEssay} onValueChange={setEngSkipEssay} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 15 Marks (My Hobby, A True Muslim, Quaid-e-Azam)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipNarration && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.6: Direct and Indirect Speech</Text>
                      <Text style={styles.questionSubtitle}>Change the narration of any 5 sentences out of 8 (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipNarration} onValueChange={setEngSkipNarration} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (Direct & Indirect transformations)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipPairs && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.7: Pair of Words in Sentences</Text>
                      <Text style={styles.questionSubtitle}>Use any 5 pairs of words in sentences (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipPairs} onValueChange={setEngSkipPairs} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (5 Pairs = 10 words)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipUrduToEng && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.8: Translate Urdu Paragraph into English</Text>
                      <Text style={styles.questionSubtitle}>Translate coherent Urdu paragraph into English (10 Marks)</Text>
                    </View>
                    <Switch value={engSkipUrduToEng} onValueChange={setEngSkipUrduToEng} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Urdu to English Paragraph)</Text>
                </View>
              </>
            )}

            {/* 9th Class English Sections */}
            {is9th && (
              <>
                <View style={styles.sectionCard}>
                  <Text style={styles.questionMainTitle}>Q.2: Short Answer Questions (Section-I)</Text>
                  <Text style={styles.questionSubtitle}>Textbook comprehension questions (5 × 2 = 10 Marks)</Text>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Any 5 out of 8 questions)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipTrans && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.3: Translate Paragraphs into Urdu</Text>
                      <Text style={styles.questionSubtitle}>Translate any 2 textbook paragraphs into Urdu (4+4 = 8 Marks)</Text>
                    </View>
                    <Switch value={engSkipTrans} onValueChange={setEngSkipTrans} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 8 Marks (2 Paragraphs translation)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipPoem && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.4: Poem Summary OR Stanza Explanation</Text>
                      <Text style={styles.questionSubtitle}>Write summary of Daffodils / Stopping by Woods (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipPoem} onValueChange={setEngSkipPoem} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (Summary / Stanza)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipIdioms && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.5: Use Words / Idioms in Sentences</Text>
                      <Text style={styles.questionSubtitle}>Use any 5 vocabulary items in your sentences (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipIdioms} onValueChange={setEngSkipIdioms} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (Any 5 out of 8)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipLetter && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.6: Letter / Moral Story / Dialogue</Text>
                      <Text style={styles.questionSubtitle}>Write Letter to mother/friend OR Moral Story OR Dialogue (8 Marks)</Text>
                    </View>
                    <Switch value={engSkipLetter} onValueChange={setEngSkipLetter} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 8 Marks (3 Board Standard Options)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipComprehension && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.7: Reading Comprehension Passage</Text>
                      <Text style={styles.questionSubtitle}>Read passage and answer 5 comprehension questions (10 Marks)</Text>
                    </View>
                    <Switch value={engSkipComprehension} onValueChange={setEngSkipComprehension} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 10 Marks (Comprehension Passage + 5 Qs)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipUrduToEng && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.8: Translate into English (Tenses)</Text>
                      <Text style={styles.questionSubtitle}>Translate any 5 Urdu sentences into English (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipUrduToEng} onValueChange={setEngSkipUrduToEng} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (Grammar & Tenses Sentences)</Text>
                </View>
                <View style={[styles.sectionCard, engSkipVoice && styles.cardDisabled]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.questionMainTitle}>Q.9: Change the Voice (Active to Passive)</Text>
                      <Text style={styles.questionSubtitle}>Convert 5 active voice sentences into passive voice (5 Marks)</Text>
                    </View>
                    <Switch value={engSkipVoice} onValueChange={setEngSkipVoice} />
                  </View>
                  <Text style={styles.badgeHint}>✓ 5 Marks (5 Voice transformations)</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* 3. MATHEMATICS PATTERN (75 Marks Matric / 100 Marks Inter) */}
        {/* ======================================================== */}
        {patternType === 'MATH' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                📐 Mathematics Board Pattern ({isInter ? '100 Marks HSSC' : '75 Marks Matric'})
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, mathSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.1: Objective MCQs ({isInter ? '20 Marks' : '15 Marks'})</Text>
                  <Text style={styles.questionSubtitle}>Multiple Choice Questions from all textbook chapters</Text>
                </View>
                <Switch value={mathSkipMcq} onValueChange={setMathSkipMcq} />
              </View>
              {!mathSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Total MCQs Count:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={mathMcqCount}
                    onChangeText={setMathMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, mathSkipQ2 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.2: Short Questions (Part-I)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Solve any 8 out of 12 parts (16 Marks)' : 'Solve any 6 out of 9 parts (12 Marks)'}</Text>
                </View>
                <Switch value={mathSkipQ2} onValueChange={setMathSkipQ2} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '16 Marks' : '12 Marks'} (Algebra & Formulas)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, mathSkipQ3 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.3: Short Questions (Part-II)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Solve any 8 out of 12 parts (16 Marks)' : 'Solve any 6 out of 9 parts (12 Marks)'}</Text>
                </View>
                <Switch value={mathSkipQ3} onValueChange={setMathSkipQ3} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '16 Marks' : '12 Marks'} (Functions, Matrices & Equations)</Text>
            </View>

            {/* Q4 */}
            <View style={[styles.sectionCard, mathSkipQ4 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.4: Short Questions (Part-III)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Solve any 9 out of 13 parts (18 Marks)' : 'Solve any 6 out of 9 parts (12 Marks)'}</Text>
                </View>
                <Switch value={mathSkipQ4} onValueChange={setMathSkipQ4} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '18 Marks' : '12 Marks'} (Trigonometry & Geometry)</Text>
            </View>

            {/* Long Questions */}
            <View style={[styles.sectionCard, mathSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Part-II: Long Questions</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Attempt 3 questions (10 Marks each = 30 Marks)' : 'Attempt 3 questions (8 Marks each = 24 Marks)'}</Text>
                </View>
                <Switch value={mathSkipLong} onValueChange={setMathSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '30 Marks' : '24 Marks'} (Detailed problem solving with theorems)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 4. COMPUTER SCIENCE PATTERN (50M Matric / 75M Inter)      */}
        {/* ======================================================== */}
        {patternType === 'COMPUTER' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                💻 Computer Science Pattern ({isInter ? '75 Marks HSSC' : '50 Marks Matric'})
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, csSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Section-A: Objective MCQs ({isInter ? '15 Marks' : '10 Marks'})</Text>
                  <Text style={styles.questionSubtitle}>MCQs from Systems, Architecture, C Language & Databases</Text>
                </View>
                <Switch value={csSkipMcq} onValueChange={setCsSkipMcq} />
              </View>
              {!csSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Enter MCQs Count:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={csMcqCount}
                    onChangeText={setCsMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, csSkipQ2 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.2: Short Questions (Section-I Part-1)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers of any 6 out of 9 (12 Marks)' : 'Write short answers of any 4 out of 6 (8 Marks)'}</Text>
                </View>
                <Switch value={csSkipQ2} onValueChange={setCsSkipQ2} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '12 Marks' : '8 Marks'} (Problem Solving & Systems)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, csSkipQ3 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.3: Short Questions (Section-I Part-2)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers of any 6 out of 9 (12 Marks)' : 'Write short answers of any 4 out of 6 (8 Marks)'}</Text>
                </View>
                <Switch value={csSkipQ3} onValueChange={setCsSkipQ3} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '12 Marks' : '8 Marks'} (Number Systems & Networks)</Text>
            </View>

            {/* Q4 */}
            <View style={[styles.sectionCard, csSkipQ4 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.4: Short Questions (Section-I Part-3)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers of any 6 out of 9 (12 Marks)' : 'Write short answers of any 4 out of 6 (8 Marks)'}</Text>
                </View>
                <Switch value={csSkipQ4} onValueChange={setCsSkipQ4} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '12 Marks' : '8 Marks'} (Web Development, Loops & Logic)</Text>
            </View>

            {/* Section-II Long */}
            <View style={[styles.sectionCard, csSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Section-II: Long Questions</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Attempt any 3 questions out of 5 (3 × 8 = 24 Marks)' : 'Attempt any 2 questions out of 3 (2 × 8 = 16 Marks)'}</Text>
                </View>
                <Switch value={csSkipLong} onValueChange={setCsSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '24 Marks' : '16 Marks'} (Comprehensive theory / code / algorithms)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 5. SCIENCE PATTERN (60M Matric / 85M Inter)               */}
        {/* ======================================================== */}
        {patternType === 'SCIENCE' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                🔬 Science Group Board Pattern ({isInter ? '85 Marks HSSC' : '60 Marks Matric'})
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, sciSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.1: Objective MCQs ({isInter ? '17 Marks' : '12 Marks'})</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? '17 Multiple Choice Questions (1 Mark Each)' : '12 Multiple Choice Questions (1 Mark Each)'}</Text>
                </View>
                <Switch value={sciSkipMcq} onValueChange={setSciSkipMcq} />
              </View>
              {!sciSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Enter MCQs Count:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={sciMcqCount}
                    onChangeText={setSciMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, sciSkipQ2 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.2: Short Questions (Section-I)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers to any 8 questions out of 12 (16 Marks)' : 'Write short answers to any 5 questions out of 8 (10 Marks)'}</Text>
                </View>
                <Switch value={sciSkipQ2} onValueChange={setSciSkipQ2} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '16 Marks' : '10 Marks'} (Concepts & Definitions)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, sciSkipQ3 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.3: Short Questions (Section-I)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers to any 8 questions out of 12 (16 Marks)' : 'Write short answers to any 5 questions out of 8 (10 Marks)'}</Text>
                </View>
                <Switch value={sciSkipQ3} onValueChange={setSciSkipQ3} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '16 Marks' : '10 Marks'} (Formulas, Laws & Chemical Reactions)</Text>
            </View>

            {/* Q4 */}
            <View style={[styles.sectionCard, sciSkipQ4 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.4: Short Questions (Section-I)</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Write short answers to any 6 questions out of 9 (12 Marks)' : 'Write short answers to any 5 questions out of 8 (10 Marks)'}</Text>
                </View>
                <Switch value={sciSkipQ4} onValueChange={setSciSkipQ4} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '12 Marks' : '10 Marks'} (Biological Processes & Numerical Reasoning)</Text>
            </View>

            {/* Long Questions */}
            <View style={[styles.sectionCard, sciSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Part-II: Long Questions</Text>
                  <Text style={styles.questionSubtitle}>{isInter ? 'Attempt any 3 questions out of 5 (3 × 8 = 24 Marks)' : 'Attempt any 2 questions out of 3 (2 × 9 = 18 Marks)'}</Text>
                </View>
                <Switch value={sciSkipLong} onValueChange={setSciSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ {isInter ? '24 Marks' : '18 Marks'} (Detailed Theory + Numerical Problems)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 6. TARJUMA-TUL-QURAN PATTERN (50 Marks)                   */}
        {/* ======================================================== */}
        {patternType === 'TARJUMA_QURAN' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                📖 ترجمۃ القرآن الکریم پیپر پیٹرن (کل نمبر: 50)
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, tqSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 1: کثیر الانتخابی سوالات (MCQs)</Text>
                  <Text style={styles.questionSubtitle}>سورتوں کے تعارف، مضامین اور اہم نکات پر مبنی معروضی سوالات (10 نمبر)</Text>
                </View>
                <Switch value={tqSkipMcq} onValueChange={setTqSkipMcq} />
              </View>
              <Text style={styles.badgeHint}>✓ 10 Marks (10 معروضی سوالات)</Text>
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, tqSkipShort && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 2: مختصر سوالات کے جوابات</Text>
                  <Text style={styles.questionSubtitle}>سورتوں کے فضائل اور اہم احکامات پر 5 سوالات (5 × 2 = 10 نمبر)</Text>
                </View>
                <Switch value={tqSkipShort} onValueChange={setTqSkipShort} />
              </View>
              <Text style={styles.badgeHint}>✓ 10 Marks (8 میں سے 5 سوالات)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, tqSkipWords && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 3: قرآنی الفاظ کے معانی</Text>
                  <Text style={styles.questionSubtitle}>کوئی سے پانچ قرآنی الفاظ کے اردو معانی (5 × 1 = 5 نمبر)</Text>
                </View>
                <Switch value={tqSkipWords} onValueChange={setTqSkipWords} />
              </View>
              <Text style={styles.badgeHint}>✓ 5 Marks (8 میں سے 5 الفاظ کے معانی)</Text>
            </View>

            {/* Q4 */}
            <View style={[styles.sectionCard, tqSkipAyat && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 4: آیاتِ مبارکہ کا با محاورہ ترجمہ</Text>
                  <Text style={styles.questionSubtitle}>پانچ میں سے کوئی سی تین آیات کا سلیس ترجمہ (3 × 5 = 15 نمبر)</Text>
                </View>
                <Switch value={tqSkipAyat} onValueChange={setTqSkipAyat} />
              </View>
              <Text style={styles.badgeHint}>✓ 15 Marks (3 قرآنی آیات کا ترجمہ)</Text>
            </View>

            {/* Q5 */}
            <View style={[styles.sectionCard, tqSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 5: تفصیلی نوٹ / سورت کا تعارف</Text>
                  <Text style={styles.questionSubtitle}>کسی ایک سورت کا تعارف، پس منظر اور بنیادی مضامین (10 نمبر)</Text>
                </View>
                <Switch value={tqSkipLong} onValueChange={setTqSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ 10 Marks (جامع نوٹ یا سورت کا خلاصہ)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 7. ISLAMIAT PATTERN (50 Marks)                            */}
        {/* ======================================================== */}
        {patternType === 'ISLAMIAT' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                🕌 اسلامیات لازمی پیپر پیٹرن (کل نمبر: 50)
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, islSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 1: کثیر الانتخابی سوالات (MCQs)</Text>
                  <Text style={styles.questionSubtitle}>عقائد، عبادات، سیرت طیبہ اور احادیث پر مبنی سوالات (10 نمبر)</Text>
                </View>
                <Switch value={islSkipMcq} onValueChange={setIslSkipMcq} />
              </View>
              <Text style={styles.badgeHint}>✓ 10 Marks (10 معروضی سوالات)</Text>
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, islSkipQ2 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 2: مختصر سوالات (حصہ اول)</Text>
                  <Text style={styles.questionSubtitle}>کوئی سے 6 سوالات کے جوابات تحریر کیجیے (6 × 2 = 12 نمبر)</Text>
                </View>
                <Switch value={islSkipQ2} onValueChange={setIslSkipQ2} />
              </View>
              <Text style={styles.badgeHint}>✓ 12 Marks (قرآن و حدیث اور سیرت النبی ﷺ)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, islSkipQ3 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 3: مختصر سوالات (حصہ دوم)</Text>
                  <Text style={styles.questionSubtitle}>کوئی سے 6 سوالات کے جوابات تحریر کیجیے (6 × 2 = 12 نمبر)</Text>
                </View>
                <Switch value={islSkipQ3} onValueChange={setIslSkipQ3} />
              </View>
              <Text style={styles.badgeHint}>✓ 12 Marks (اخلاق و آداب اور اسلامی تعلیمات)</Text>
            </View>

            {/* Q4 */}
            <View style={[styles.sectionCard, islSkipAyat && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 4: حدیث مبارکہ کا ترجمہ و تشریح</Text>
                  <Text style={styles.questionSubtitle}>حدیثِ مبارکہ کا با محاورہ ترجمہ اور مختصر تشریح (8 نمبر)</Text>
                </View>
                <Switch value={islSkipAyat} onValueChange={setIslSkipAyat} />
              </View>
              <Text style={styles.badgeHint}>✓ 8 Marks (حدیث نبوی ﷺ کا ترجمہ و تشریح)</Text>
            </View>

            {/* Q5 */}
            <View style={[styles.sectionCard, islSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>سوال نمبر 5: تفصیلی سوال</Text>
                  <Text style={styles.questionSubtitle}>دو میں سے کسی ایک موضوع پر مدلل و جامع نوٹ تحریر کیجیے (8 نمبر)</Text>
                </View>
                <Switch value={islSkipLong} onValueChange={setIslSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ 8 Marks (قرآن و سنت کی روشنی میں تفصیلی نوٹ)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 8. GENERAL / PAK STUDIES / ARTS / COMMERCE               */}
        {/* ======================================================== */}
        {patternType === 'GENERAL' && (
          <View>
            <View style={styles.boardPatternHeadingBox}>
              <Text style={styles.boardPatternHeading}>
                📚 {selectedSubject?.name} پیپر پیٹرن ({isPakStudy ? '50 Marks Pak Studies' : isInter ? '100 Marks HSSC Arts / Commerce' : '75 Marks Matric Arts'})
              </Text>
            </View>

            {/* MCQs */}
            <View style={[styles.sectionCard, genSkipMcq && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.1: معروضی کثیر الانتخابی سوالات (MCQs)</Text>
                  <Text style={styles.questionSubtitle}>نصاب کے تمام ابواب سے معروضی سوالات ({isPakStudy ? '10 نمبر' : isInter ? '20 نمبر' : '15 نمبر'})</Text>
                </View>
                <Switch value={genSkipMcq} onValueChange={setGenSkipMcq} />
              </View>
              {!genSkipMcq && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>معروضی سوالات کی کل تعداد:</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={genMcqCount}
                    onChangeText={setGenMcqCount}
                    maxLength={2}
                  />
                </View>
              )}
            </View>

            {/* Q2 */}
            <View style={[styles.sectionCard, genSkipQ2 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.2: مختصر سوالات (حصہ اول)</Text>
                  <Text style={styles.questionSubtitle}>{isPakStudy ? 'کوئی سے 6 سوالات حل کریں (12 نمبر)' : isInter ? 'کوئی سے 8 سوالات حل کریں (16 نمبر)' : 'کوئی سے 6 سوالات حل کریں (12 نمبر)'}</Text>
                </View>
                <Switch value={genSkipQ2} onValueChange={setGenSkipQ2} />
              </View>
              <Text style={styles.badgeHint}>✓ {isPakStudy ? '12 Marks' : isInter ? '16 Marks' : '12 Marks'} (نصابی ابواب سے مختصر جوابات)</Text>
            </View>

            {/* Q3 */}
            <View style={[styles.sectionCard, genSkipQ3 && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>Q.3: مختصر سوالات (حصہ دوم)</Text>
                  <Text style={styles.questionSubtitle}>{isPakStudy ? 'کوئی سے 6 سوالات حل کریں (12 نمبر)' : isInter ? 'کوئی سے 8 سوالات حل کریں (16 نمبر)' : 'کوئی سے 6 سوالات حل کریں (12 نمبر)'}</Text>
                </View>
                <Switch value={genSkipQ3} onValueChange={setGenSkipQ3} />
              </View>
              <Text style={styles.badgeHint}>✓ {isPakStudy ? '12 Marks' : isInter ? '16 Marks' : '12 Marks'} (نصابی ابواب سے مختصر جوابات)</Text>
            </View>

            {/* Q4 (For Arts subjects with 3 short question sections) */}
            {!isPakStudy && (
              <View style={styles.sectionCard}>
                <Text style={styles.questionMainTitle}>Q.4: مختصر سوالات (حصہ سوم)</Text>
                <Text style={styles.questionSubtitle}>{isInter ? 'کوئی سے 8 سوالات حل کریں (16 نمبر)' : 'کوئی سے 6 سوالات حل کریں (12 نمبر)'}</Text>
                <Text style={styles.badgeHint}>✓ {isInter ? '16 Marks' : '12 Marks'} (نصابی ابواب سے مختصر جوابات)</Text>
              </View>
            )}

            {/* Long Questions */}
            <View style={[styles.sectionCard, genSkipLong && styles.cardDisabled]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWrap}>
                  <Text style={styles.questionMainTitle}>حصہ دوم: تفصیلی / انشائیہ سوالات</Text>
                  <Text style={styles.questionSubtitle}>{isPakStudy ? 'کوئی سے 2 سوالات حل کریں (2 × 8 = 16 نمبر)' : isInter ? 'کوئی سے 3 سوالات حل کریں (3 × 10+2 = 32 نمبر)' : 'کوئی سے 3 سوالات حل کریں (3 × 8 = 24 نمبر)'}</Text>
                </View>
                <Switch value={genSkipLong} onValueChange={setGenSkipLong} />
              </View>
              <Text style={styles.badgeHint}>✓ {isPakStudy ? '16 Marks' : isInter ? '32 Marks' : '24 Marks'} (مفصل و جامع جوابات)</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Bottom Bar: Generate Paper Button */}
      <View style={styles.footerBar}>
        <CustomButton
          title={`Generate Complete Paper (${totalCalculatedMarks} Marks) 🚀`}
          variant="primary"
          size="lg"
          onPress={handleStartGeneration}
        />
      </View>

      {/* Generating Modal / Loading */}
      <Modal visible={isGenerating} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.modalTitle}>Generating Board Paper...</Text>
            <Text style={styles.modalSub}>
              Composing authentic exam questions with official BISE {classGrade}th curriculum breakdown.
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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  liveMarksCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  liveMarksInfo: {
    flex: 1,
  },
  liveMarksSub: {
    color: '#D1E0FB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  liveMarksNum: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  timeBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  boardPatternHeadingBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  boardPatternHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3730A3',
    textAlign: 'center',
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
    opacity: 0.55,
    backgroundColor: '#F9FAFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  questionMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  questionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  skipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    width: 60,
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: '#F9FAFB',
    color: theme.colors.textPrimary,
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  halfInput: {
    flex: 1,
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  ofText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginTop: 14,
  },
  badgeHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#F9FAFB',
    color: theme.colors.textPrimary,
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

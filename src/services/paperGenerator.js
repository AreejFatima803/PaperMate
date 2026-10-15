import { getQuestionsForSubject } from '../data/questionBank';

export function generateExamPaper(config) {
  const {
    institutionName = 'GOVERNMENT HIGHER SECONDARY SCHOOL',
    board,
    classInfo,
    medium,
    subject,
    syllabusType,
    selectedChapters = [],
    mcqCount = 12,
    skipMcq = false,
    q2Count = 5,
    q2Total = 8,
    skipQ2 = false,
    q3Count = 5,
    q3Total = 8,
    skipQ3 = false,
    q4Count = 5,
    q4Total = 8,
    skipQ4 = false,
    longCount = 2,
    longTotal = 3,
    skipLong = false,
    humanitiesConfig = {},
  } = config;

  const isUrdu = medium?.id === 'urdu';
  const rawQuestions = getQuestionsForSubject(subject.id, medium?.id);

  // 1. Objective Section (Q1: MCQs)
  let mcqs = [];
  let mcqMarks = 0;
  if (!skipMcq && mcqCount > 0) {
    const available = [...(rawQuestions.mcqs || [])];
    // Shuffle or pick
    const count = Math.min(Number(mcqCount), available.length);
    mcqs = available.slice(0, count).map((item, index) => ({
      index: index + 1,
      id: item.id || `m_${index}`,
      questionText: isUrdu ? (item.ur || item.en) : item.en,
      options: isUrdu && item.optionsUrdu ? item.optionsUrdu : item.options,
      correct: item.correct,
      marks: 1,
    }));
    mcqMarks = mcqs.length * 1;
  }

  // 2. Subjective Section Part-I (Short Questions)
  const allShorts = [...(rawQuestions.shorts || [])];
  let shortPoolIndex = 0;

  function pickShorts(count) {
    const result = [];
    for (let i = 0; i < count; i++) {
      if (shortPoolIndex < allShorts.length) {
        result.push(allShorts[shortPoolIndex]);
        shortPoolIndex++;
      } else {
        // Fallback generic
        result.push({
          id: `sq_fallback_${i}`,
          en: `Define core principle #${i + 1} and write its key application.`,
          ur: `بنیادی اصول نمبر #${i + 1} کی وضاحت کریں اور اس کا اطلاق لکھیں۔`,
        });
      }
    }
    return result.map((item, idx) => ({
      num: idx + 1,
      id: item.id,
      text: isUrdu ? (item.ur || item.en) : item.en,
    }));
  }

  const shortSections = [];
  let shortMarks = 0;

  if (!skipQ2 && Number(q2Count) > 0) {
    const questions = pickShorts(Number(q2Total) || 8);
    shortSections.push({
      sectionNumber: 2,
      titleEn: `Q.2: Write short answers to any ${q2Count} questions:`,
      titleUr: `سوال نمبر 2: کوئی سے ${q2Count} سوالات کے مختصر جوابات تحریر کریں:`,
      attemptCount: Number(q2Count),
      totalCount: Number(q2Total) || 8,
      marksEach: 2,
      totalMarks: Number(q2Count) * 2,
      questions,
    });
    shortMarks += Number(q2Count) * 2;
  }

  if (!skipQ3 && Number(q3Count) > 0) {
    const questions = pickShorts(Number(q3Total) || 8);
    shortSections.push({
      sectionNumber: 3,
      titleEn: `Q.3: Write short answers to any ${q3Count} questions:`,
      titleUr: `سوال نمبر 3: کوئی سے ${q3Count} سوالات کے مختصر جوابات تحریر کریں:`,
      attemptCount: Number(q3Count),
      totalCount: Number(q3Total) || 8,
      marksEach: 2,
      totalMarks: Number(q3Count) * 2,
      questions,
    });
    shortMarks += Number(q3Count) * 2;
  }

  if (!skipQ4 && Number(q4Count) > 0) {
    const questions = pickShorts(Number(q4Total) || 8);
    shortSections.push({
      sectionNumber: 4,
      titleEn: `Q.4: Write short answers to any ${q4Count} questions:`,
      titleUr: `سوال نمبر 4: کوئی سے ${q4Count} سوالات کے مختصر جوابات تحریر کریں:`,
      attemptCount: Number(q4Count),
      totalCount: Number(q4Total) || 8,
      marksEach: 2,
      totalMarks: Number(q4Count) * 2,
      questions,
    });
    shortMarks += Number(q4Count) * 2;
  }

  // 3. Subjective Part-II (Long / Detailed Questions)
  let longQuestions = [];
  let longMarks = 0;
  if (!skipLong && Number(longCount) > 0) {
    const availableLongs = [...(rawQuestions.longs || [])];
    const totalToPick = Number(longTotal) || 3;
    const picked = availableLongs.slice(0, totalToPick);
    while (picked.length < totalToPick) {
      picked.push({
        id: `long_${picked.length + 1}`,
        en: `(a) Detailed theoretical question on Core Topic with diagram.\n(b) Analytical / Numerical problem solution.`,
        ur: `(الف) بنیادی موضوع پر جامع وضاحتی سوال و خاکہ۔\n(ب) حسابی / تجزیاتی سوال کا حل تحریر کریں۔`,
        marks: 9,
      });
    }

    longQuestions = picked.map((item, idx) => ({
      num: 5 + idx,
      id: item.id,
      text: isUrdu ? (item.ur || item.en) : item.en,
      marks: item.marks || 9,
    }));
    longMarks = Number(longCount) * 9;
  }

  // Humanities extra questions (if applicable)
  const extraSections = [];
  if (humanitiesConfig.includeEssay) {
    extraSections.push({
      titleEn: 'Q. Essay / Translation / Tashreeh Section',
      titleUr: 'حصہ دوم: مضمون / ترجمہ / تشریح',
      text: isUrdu
        ? 'مندرجہ ذیل عنوان پر ایک جامع مضمون یا تشریح تحریر کریں۔'
        : 'Write a comprehensive essay or translate the paragraph into Urdu.',
      marks: 15,
    });
  }

  const grandTotalMarks = mcqMarks + shortMarks + longMarks;

  return {
    id: 'paper_' + Date.now(),
    title: `${subject.name} Examination (Syllabus 2026)`,
    institutionName,
    boardName: board?.name || 'Board of Intermediate and Secondary Education',
    className: classInfo?.name || '9th Class',
    subjectName: isUrdu ? (subject.nameUrdu || subject.name) : subject.name,
    medium: medium?.name || 'English Medium',
    syllabusScope:
      syllabusType === 'half1'
        ? '1st Half Book'
        : syllabusType === 'half2'
        ? '2nd Half Book'
        : syllabusType === 'full'
        ? 'Full Book'
        : `Selected Chapters (${selectedChapters.length})`,
    timeAllowed: grandTotalMarks > 60 ? '2 Hours 30 Minutes' : '2 Hours',
    totalMarks: grandTotalMarks || 60,
    mcqSection: {
      active: !skipMcq && mcqs.length > 0,
      marks: mcqMarks,
      time: '20 Minutes',
      questions: mcqs,
    },
    shortSections,
    longSection: {
      active: !skipLong && longQuestions.length > 0,
      attemptCount: Number(longCount),
      totalCount: Number(longTotal) || 3,
      marks: longMarks,
      questions: longQuestions,
    },
    extraSections,
    createdAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

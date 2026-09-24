// Syllabus Repository Service (Decoupled Layer)
// Communicates between Frontend UI components and Syllabus Storage (JSON / MongoDB API)

import { syllabusRegistry } from '../data/syllabus';

// Helper to normalize Class Key (e.g. "9th" -> "class9", "1st Year" -> "firstYear")
export const normalizeClassKey = (className) => {
  if (!className) return 'class9';
  const name = className.toString().trim().toLowerCase();
  if (name.includes('9')) return 'class9';
  if (name.includes('10')) return 'class10';
  if (name.includes('1st') || name.includes('11')) return 'firstYear';
  if (name.includes('2nd') || name.includes('12') || name.includes('second')) return 'secondYear';
  return 'class9';
};

// Helper to normalize Subject Key (e.g. "English (Compulsory)" -> "english", "phy-9" -> "physics")
export const normalizeSubjectKey = (subjectInput) => {
  if (!subjectInput) return 'english';
  let name = typeof subjectInput === 'string' ? subjectInput : (subjectInput.name || subjectInput.id || '');
  name = name.toLowerCase();

  if (name.includes('eng')) return 'english';
  if (name.includes('phy')) return 'physics';
  if (name.includes('chem')) return 'chemistry';
  if (name.includes('bio')) return 'biology';
  if (name.includes('math')) return 'mathematics';
  return 'english';
};

class SyllabusService {
  constructor() {
    // Flag to switch between local JSON mode and MongoDB API mode later
    this.useMongoDB = false;
    this.apiBaseUrl = '/api/syllabus';
  }

  // Set MongoDB API mode dynamically when backend is attached
  setUseMongoDB(enable, baseUrl = '/api/syllabus') {
    this.useMongoDB = enable;
    this.apiBaseUrl = baseUrl;
  }

  // GET /api/syllabus/:class/:subject
  async getSubjectSyllabus(className, subjectInput) {
    const classKey = normalizeClassKey(className);
    const subjectKey = normalizeSubjectKey(subjectInput);

    if (this.useMongoDB) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${classKey}/${subjectKey}`);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
      } catch (err) {
        console.warn('MongoDB API fetch failed, falling back to local JSON repo', err);
      }
    }

    // Fallback/Local JSON provider
    const classRepo = syllabusRegistry[classKey] || syllabusRegistry.class9;
    const syllabusData = classRepo[subjectKey] || classRepo.english;
    return syllabusData;
  }

  // GET Chapters list for UI
  async getChapters(className, subjectInput) {
    const syllabus = await this.getSubjectSyllabus(className, subjectInput);
    if (!syllabus || !syllabus.chapters) return [];

    return syllabus.chapters.map(ch => ({
      chapterNumber: ch.chapterNumber,
      chapterName: ch.chapterName || '',
      hasFirstHalf: Array.isArray(ch.firstHalf?.content),
      hasSecondHalf: Array.isArray(ch.secondHalf?.content)
    }));
  }

  // GET /api/syllabus/:class/:subject/:chapter
  async getChapter(className, subjectInput, chapterNumber) {
    const syllabus = await this.getSubjectSyllabus(className, subjectInput);
    if (!syllabus || !syllabus.chapters) return null;

    const num = parseInt(chapterNumber, 10);
    const chapterObj = syllabus.chapters.find(c => c.chapterNumber === num);
    return chapterObj || null;
  }

  // GET /api/syllabus/:class/:subject/:chapter/:portion
  // Portion Logic:
  // - 1st Half ('firstHalf'): returns firstHalf.content
  // - 2nd Half ('secondHalf'): returns secondHalf.content
  // - Full Chapter ('full'): combines firstHalf.content + secondHalf.content
  async getPortionContent(className, subjectInput, chapterNumber, portionKey) {
    const chapter = await this.getChapter(className, subjectInput, chapterNumber);
    if (!chapter) return [];

    const key = (portionKey || '').toString().toLowerCase();

    if (key.includes('1st') || key.includes('first')) {
      return chapter.firstHalf?.content || [];
    }
    if (key.includes('2nd') || key.includes('second')) {
      return chapter.secondHalf?.content || [];
    }
    // Full Chapter
    const first = chapter.firstHalf?.content || [];
    const second = chapter.secondHalf?.content || [];
    return [...first, ...second];
  }

  // Prepare Payload for AI Question-Paper Generation Service
  async preparePaperPayload(config) {
    const {
      className,
      subjectInput,
      chapterNumber,
      portionKey,
      paperType = 'Standard Test',
      questionCounts = { mcqs: 10, short: 5, long: 2 },
      difficulty = 'Medium',
      totalMarks = 50
    } = config;

    const syllabusContent = await this.getPortionContent(className, subjectInput, chapterNumber, portionKey);

    return {
      class: className,
      subject: typeof subjectInput === 'string' ? subjectInput : (subjectInput?.name || 'Subject'),
      chapterNumber: chapterNumber,
      selectedPortion: portionKey,
      syllabusContent: syllabusContent,
      paperType: paperType,
      numberOfQuestions: questionCounts,
      difficulty: difficulty,
      totalMarks: totalMarks,
      timestamp: new Date().toISOString()
    };
  }
}

export const syllabusService = new SyllabusService();

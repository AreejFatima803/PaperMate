// Backend Syllabus API Router Abstraction
// Clean API endpoint structures for syllabus queries:
// GET /api/syllabus/:class/:subject
// GET /api/syllabus/:class/:subject/:chapter
// GET /api/syllabus/:class/:subject/:chapter/:portion

import { syllabusService } from '../syllabusService';

export const syllabusApi = {
  // GET /api/syllabus/:class/:subject
  getSubjectSyllabus: async (className, subjectName) => {
    return await syllabusService.getSubjectSyllabus(className, subjectName);
  },

  // GET /api/syllabus/:class/:subject/:chapter
  getChapter: async (className, subjectName, chapterNumber) => {
    return await syllabusService.getChapter(className, subjectName, chapterNumber);
  },

  // GET /api/syllabus/:class/:subject/:chapter/:portion
  getChapterPortion: async (className, subjectName, chapterNumber, portion) => {
    const chapter = await syllabusService.getChapter(className, subjectName, chapterNumber);
    const content = await syllabusService.getPortionContent(className, subjectName, chapterNumber, portion);
    return {
      class: className,
      subject: subjectName,
      chapterNumber: chapterNumber,
      portion: portion,
      chapterName: chapter?.chapterName || '',
      content: content
    };
  },

  // POST /api/paper/prepare
  preparePaperGeneration: async (paperConfig) => {
    return await syllabusService.preparePaperPayload(paperConfig);
  }
};

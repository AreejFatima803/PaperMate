// Syllabus Data Registry Map for PaperMate
// Static registry mapping local JSON files by class and subject key.

import class9English from './class9/english.json';
import class9Physics from './class9/physics.json';
import class9Chemistry from './class9/chemistry.json';
import class9Biology from './class9/biology.json';
import class9Mathematics from './class9/mathematics.json';

import class10English from './class10/english.json';
import class10Physics from './class10/physics.json';
import class10Chemistry from './class10/chemistry.json';
import class10Biology from './class10/biology.json';
import class10Mathematics from './class10/mathematics.json';

import firstYearEnglish from './firstYear/english.json';
import firstYearPhysics from './firstYear/physics.json';
import firstYearChemistry from './firstYear/chemistry.json';
import firstYearBiology from './firstYear/biology.json';
import firstYearMathematics from './firstYear/mathematics.json';

import secondYearEnglish from './secondYear/english.json';
import secondYearPhysics from './secondYear/physics.json';
import secondYearChemistry from './secondYear/chemistry.json';
import secondYearBiology from './secondYear/biology.json';
import secondYearMathematics from './secondYear/mathematics.json';

export const syllabusRegistry = {
  class9: {
    english: class9English,
    physics: class9Physics,
    chemistry: class9Chemistry,
    biology: class9Biology,
    mathematics: class9Mathematics
  },
  class10: {
    english: class10English,
    physics: class10Physics,
    chemistry: class10Chemistry,
    biology: class10Biology,
    mathematics: class10Mathematics
  },
  firstYear: {
    english: firstYearEnglish,
    physics: firstYearPhysics,
    chemistry: firstYearChemistry,
    biology: firstYearBiology,
    mathematics: firstYearMathematics
  },
  secondYear: {
    english: secondYearEnglish,
    physics: secondYearPhysics,
    chemistry: secondYearChemistry,
    biology: secondYearBiology,
    mathematics: secondYearMathematics
  }
};

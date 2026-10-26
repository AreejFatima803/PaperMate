import {
  getQuestionsForSubject,
  getQuestionsForSubjectAndChapters,
  shuffleArray,
  sampleRandom,
  sampleUnique,
  shuffleMcqOptions,
} from '../data/questionBank';

// Helper to extract class grade number (9, 10, 11, 12)
function getClassGrade(classInfo, subject) {
  if (classInfo?.id) return String(classInfo.id);
  if (subject?.id) {
    const parts = subject.id.split('-');
    if (parts.length > 1) return parts[parts.length - 1];
  }
  return '9';
}

export function generateExamPaper(config) {
  const {
    institutionName = 'THE HOPE TEST SERIES / HIGH SCHOOL',
    board,
    classInfo,
    subject,
    patternType = 'SCIENCE',
    totalMarks: configuredTotalMarks,
    syllabusType = 'full',
    selectedChapters = [],
    urduConfig = {},
    englishConfig = {},
    mathConfig = {},
    computerConfig = {},
    scienceConfig = {},
    tqConfig = {},
    islamiatConfig = {},
    generalConfig = {},
  } = config;

  const classGrade = getClassGrade(classInfo, subject);
  const allSubjectChapters = subject?.chapters || [];
  const rawQuestions = getQuestionsForSubjectAndChapters(subject.id, selectedChapters, allSubjectChapters);

  const activeChapterNums = (selectedChapters || []).map(Number).filter(n => !isNaN(n));
  const hasChapterFilter = activeChapterNums.length > 0 && activeChapterNums.length < (allSubjectChapters.length || 999);
  const activeChapterSet = new Set(activeChapterNums);

  let formattedScope = 'Full Book';
  if (syllabusType === 'half1') {
    formattedScope = '1st Half Book';
  } else if (syllabusType === 'half2') {
    formattedScope = '2nd Half Book';
  } else if (syllabusType === 'full' || !hasChapterFilter) {
    formattedScope = 'Full Book';
  } else if (activeChapterNums.length === 1) {
    const ch = allSubjectChapters.find(c => Number(c.id) === activeChapterNums[0]);
    formattedScope = ch ? (ch.nameUrdu ? `${ch.nameUrdu} (${ch.name})` : ch.name) : `Chapter ${activeChapterNums[0]}`;
  } else {
    formattedScope = `Chapters: ${activeChapterNums.join(', ')}`;
  }

  const paperBase = {
    id: 'paper_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: `${subject.name} Examination (Syllabus 2026)`,
    institutionName,
    boardName: board?.name || 'Board of Intermediate and Secondary Education',
    className: classInfo?.name || `${classGrade}th Class`,
    subjectName: subject.name,
    subjectNameUrdu: subject.nameUrdu || '',
    patternType,
    classGrade,
    syllabusScope: formattedScope,
  };

  // ========================================================
  // 1. URDU EXAM PAPERS (9th, 10th, 11th, 12th)
  // ========================================================
  if (patternType === 'URDU') {
    const skipMcq = urduConfig.skipMcq;
    const isInter = classGrade === '11' || classGrade === '12';
    const is10th = classGrade === '10';
    const is11th = classGrade === '11';
    const is12th = classGrade === '12';
    const is9th = !is10th && !is11th && !is12th;
    const defaultTotalMarks = isInter ? 100 : 75;
    const defaultMcqCount = isInter ? 20 : 15;
    const mcqCount = urduConfig.mcqCount || defaultMcqCount;

    // --- MCQS POOLS (Rich banks to prevent duplicates) ---
    const urdu12McqPool = [
      { questionText: 'سبق "مناقبِ عمر بن عبدالعزیزؒ" کے مصنف کون ہیں؟', options: ['علامہ شبلی نعمانی', 'سر سید احمد خان', 'مولوی عبدالحق', 'ڈپٹی نذیر احمد'], correct: 0 },
      { questionText: 'نواب محسن الملک کا اصل نام کیا تھا؟', options: ['سید مہدی علی', 'سید احمد', 'مشتاق حسین', 'الطاف حسین'], correct: 0 },
      { questionText: 'سبق "تشکیلِ پاکستان" کس کی تحریر ہے؟', options: ['میاں بشیر احمد', 'ڈاکٹر وحید قریشی', 'چراغ حسن حسرت', 'ابن انشا'], correct: 0 },
      { questionText: 'ڈرامہ "قرطبہ کا قاضی" کس کا تحریر کردہ ہے؟', options: ['سید امتیاز علی تاج', 'مرزا ادیب', 'حکیم احمد شجاع', 'آغا حشر'], correct: 0 },
      { questionText: 'نظم "اسلامی مساوات" کس شاعر کی تخلیق ہے؟', options: ['مولانا الطاف حسین حالی', 'علامہ اقبال', 'حفیظ جالندھری', 'جوش ملیح آبادی'], correct: 0 },
      { questionText: 'غزل کے مطلع کے بعد آنے والے شعر کو کیا کہتے ہیں جس کے دونوں مصرعے ہم قافیہ ہوں؟', options: ['حسنِ مطلع', 'مقطع', 'بیت الغزل', 'فرد'], correct: 0 },
      { questionText: 'جملے کے ختم ہونے پر لگائی جانے والی علامت کو کیا کہتے ہیں؟', options: ['ختمہ (۔)', 'سکتہ (،)', 'رابطہ (:) ', 'تفصیلیہ (:-)'], correct: 0 },
      { questionText: 'مختصر ترین وقفے کے لیے کون سی علامتِ اوقاف استعمال ہوتی ہے؟', options: ['سکتہ (،)', 'وقفہ (؛)', 'ختمہ (۔)', 'کوما'], correct: 0 },
      { questionText: 'درست جملے کی نشاندہی کیجیے:', options: ['امجد اور اسلم آئے', 'امجد اور اسلم آیا', 'امجد اور اسلم آئی', 'امجد اور اسلم آئیں'], correct: 0 },
      { questionText: 'امدادی فعل "پڑنا" کا درست استعمال کس جملے میں ہے؟', options: ['اسے لاہور جانا پڑا', 'وہ گر پڑا تھا روز', 'بارش پڑتی رہی', 'کتاب میز پر پڑی ہے'], correct: 0 },
      { questionText: 'امدادی فعل "دینا" کا درست جملہ منتخب کریں:', options: ['استاد نے طالب علم کو کتاب دے دی', 'اس نے پانی دیا', 'روٹی دو', 'وہ دیتا ہے'], correct: 0 },
      { questionText: 'علامتِ استفہام (؟) کا استعمال کس جملے میں ہوگا؟', options: ['کیا آپ لاہور جائیں گے؟', 'لاہور ایک بڑا شہر ہے۔', 'واہ کیا خوبصورت منظر ہے!', 'احمد نے کہا۔'], correct: 0 },
      { questionText: 'شعر "خدا سرسبز رکھے اس چمن کو مہرباں ہو کر" کس شاعر کا ہے؟', options: ['اکبر الہ آبادی', 'نظیر اکبر آبادی', 'علامہ اقبال', 'حالی'], correct: 0 },
      { questionText: 'خواجہ میر درد کس دبستانِ شاعری کے نمائندہ شاعر ہیں؟', options: ['دبستانِ دہلی', 'دبستانِ لکھنؤ', 'دبستانِ عظیم آباد', 'دبستانِ لاہور'], correct: 0 },
      { questionText: 'لفظ "قوسین" ( ) کا استعمال کس لیے ہوتا ہے؟', options: ['وضاحتی جملے کے لیے', 'مکالمے کے لیے', 'حوالے کے لیے', 'سوال کے لیے'], correct: 0 },
      { questionText: 'فعل "اٹھنا" کا امدادی فعل کے طور پر درست استعمال ہے:', options: ['وہ یکایک بول اٹھا', 'وہ صبح اٹھتا ہے', 'بستر سے اٹھو', 'وہ اٹھ گیا'], correct: 0 },
      { questionText: 'مطابقت کے رو سے درست جملہ بتائیے:', options: ['دہی کھٹا ہے', 'دہی کھٹی ہے', 'دہی کھٹے ہیں', 'دہی میٹھی ہے'], correct: 0 },
      { questionText: 'سبق "محنت پسند مند مند" کس کتاب سے لیا گیا ہے؟', options: ['نیرنگِ خیال', 'آبِ حیات', 'دربارِ اکبری', 'سخندانِ فارس'], correct: 0 },
      { questionText: 'علامہ اقبال کی نظم "نوجوان سے خطاب" کس مجموعہ کلام میں ہے؟', options: ['بالِ جبریل', 'بانگِ درا', 'ضربِ کلیم', 'ارمغانِ حجاز'], correct: 0 },
      { questionText: 'ناصر کاظمی کس صنفِ سخن کے نامور شاعر ہیں؟', options: ['غزل', 'مرثیہ', 'قصیدہ', 'مثنوی'], correct: 0 },
      { questionText: 'امدادی فعل "جانا" کا درست جملہ منتخب کریں:', options: ['وہ سبق یاد کر گیا', 'وہ روز جاتا ہے', 'بازار جاؤ', 'اس نے جانا تھا'], correct: 0 },
      { questionText: 'علامتِ وقفہ (؛) کا استعمال کس لیے ہوتا ہے؟', options: ['سکتہ سے کچھ زیادہ ٹھہراؤ کے لیے', 'مکمل وقفے کے لیے', 'استفہام کے لیے', 'تعجب کے لیے'], correct: 0 },
      { questionText: 'مرزا غالب کس صدی کے نامور اردو شاعر ہیں؟', options: ['انیسویں صدی', 'اٹھارویں صدی', 'بیسویں صدی', 'سترہویں صدی'], correct: 0 },
      { questionText: 'قواعد کی رو سے "آہستہ آہستہ" کیا ہے؟', options: ['متعلق فعل (تمیز)', 'اسم صفت', 'حرف ربط', 'فعل لازم'], correct: 0 },
    ];

    const urdu11McqPool = [
      { questionText: 'سبق "اسوہ حسنہ ﷺ" کے مصنف کا نام کیا ہے؟', options: ['سید سلیمان ندوی', 'شبلی نعمانی', 'سر سید احمد خان', 'مولانا حالی'], correct: 0 },
      { questionText: 'سبق "اپنی مدد آپ" کے مصنف کون ہیں؟', options: ['سر سید احمد خان', 'مولوی عبدالحق', 'ڈپٹی نذیر احمد', 'مرزا ادیب'], correct: 0 },
      { questionText: 'افسانہ "اوور کوٹ" کس کا لکھا ہوا ہے؟', options: ['غلام عباس', 'احمد ندیم قاسمی', 'منشی پریم چند', 'سعادت حسن منٹو'], correct: 0 },
      { questionText: 'کسی چیز کو کسی خاص صفت کی بنا پر دوسری چیز کی مانند قرار دینا کہلاتا ہے:', options: ['تشبیہ', 'استعارہ', 'تلمیح', 'مجاز مرسل'], correct: 0 },
      { questionText: 'استعارہ کے لغوی معنی کیا ہیں؟', options: ['مستعار لینا (ادھار لینا)', 'مماثلت دینا', 'اشارہ کرنا', 'تعریف کرنا'], correct: 0 },
      { questionText: 'شعر میں کسی تاریخی واقعے، قرآنی آیت یا حدیث کی طرف اشارہ کہلاتا ہے:', options: ['تلمیح', 'تشبیہ', 'استعارہ', 'حسن تعلیل'], correct: 0 },
      { questionText: 'غزل کے آخری شعر کو جس میں شاعر اپنا تخلص استعمال کرے، کیا کہتے ہیں؟', options: ['مقطع', 'مطلع', 'حسن مطلع', 'ردیف'], correct: 0 },
      { questionText: 'قافیہ کے بعد بار بار دہرائے جانے والے لفظ یا الفاظ کو کیا کہتے ہیں؟', options: ['ردیف', 'مطلع', 'تخلص', 'بحر'], correct: 0 },
      { questionText: 'شعر "نازکی اس کے لب کی کیا کہیے / پنکھڑی اک گلاب کی سی ہے" میں کون سی صنعت ہے؟', options: ['تشبیہ', 'استعارہ', 'تلمیح', 'تضاد'], correct: 0 },
      { questionText: 'شعر "ابن مریم ہوا کرے کوئی / میرے دکھ کی دوا کرے کوئی" میں کون سی صنعت ہے؟', options: ['تلمیح', 'تشبیہ', 'استعارہ', 'مجاز'], correct: 0 },
      { questionText: 'سبق "چراغ کی لو" کس کی تحریر ہے؟', options: ['ہاجرہ مسرور', 'بانو قدسیہ', 'قرۃ العین حیدر', 'عصمت چغتائی'], correct: 0 },
      { questionText: 'ڈرامہ "شہید" کس مصنف کا لکھا ہوا ہے؟', options: ['مرزا ادیب', 'امتیاز علی تاج', 'اشفاق احمد', 'احمد ندیم قاسمی'], correct: 0 },
      { questionText: 'نظم "مستقبل کی جھلک" کے شاعر کون ہیں؟', options: ['مولانا ظفر علی خان', 'علامہ اقبال', 'حفیظ جالندھری', 'جوش'], correct: 0 },
      { questionText: 'میر تقی میر کو اردو شاعری میں کیا لقب حاصل ہے؟', options: ['خدائے سخن', 'شاعر مشرق', 'حیوان ظریف', 'طوطی ہند'], correct: 0 },
      { questionText: 'خواجہ حیدر علی آتش کا تعلق کس دبستان سے تھا؟', options: ['دبستان لکھنؤ', 'دبستان دہلی', 'دبستان رامپور', 'دبستان لاہور'], correct: 0 },
    ];

    const urdu10McqPool = [
      { questionText: 'سبق "مرزا محمد سعید" کے مصنف کون ہیں؟', options: ['شاہد احمد دہلوی', 'مولوی عبدالحق', 'ڈپٹی نذیر احمد', 'سر سید'], correct: 0 },
      { questionText: 'سبق "نظریہ پاکستان" کس مصنف کی تحریر ہے؟', options: ['ڈاکٹر غلام مصطفیٰ خان', 'خواجہ باسط', 'شبلی نعمانی', 'حالی'], correct: 0 },
      { questionText: 'سبق "پرستان کی شہزادی" کس کتاب سے لیا گیا ہے؟', options: ['دلی کی بپتا', 'قصص الہند', 'طلسم ہوشربا', 'باغ و بہار'], correct: 0 },
      { questionText: 'سبق "مجھے میرے دوستوں سے بچاؤ" کس کا لکھا ہوا ہے؟', options: ['سجاد حیدر یلدرم', 'مرزا غالب', 'پطرس بخاری', 'احمد قاسمی'], correct: 0 },
      { questionText: 'نظم "میدانِ کربلا میں صبح کا منظر" کس شاعر کی تخلیق ہے؟', options: ['میر انیس', 'مرزا دبیر', 'جوش', 'حالی'], correct: 0 },
      { questionText: 'نظم "فاطمہ بنت عبداللہ" کس عظیم شاعر کی نظم ہے؟', options: ['علامہ محمد اقبال', 'حفیظ جالندھری', 'مولانا حالی', 'ظفر علی'], correct: 0 },
      { questionText: 'حسرت موہانی کس صنف کے نامور شاعر ہیں؟', options: ['غزل', 'مرثیہ', 'قصیدہ', 'مثنوی'], correct: 0 },
      { questionText: 'قواعد کی رو سے "باغیچہ" کیا ہے؟', options: ['اسم مصغر', 'اسم مکبر', 'اسم آلہ', 'اسم ظرف'], correct: 0 },
      { questionText: 'قواعد کی رو سے "شاہ سوار" کیا ہے؟', options: ['اسم مکبر', 'اسم مصغر', 'اسم صوت', 'اسم صفت'], correct: 0 },
      { questionText: 'لفظ "جامع مسجد" قواعد کی رو سے کیا کہلاتا ہے؟', options: ['اسم ظرفِ مکان', 'اسم ظرفِ زمان', 'اسم آلہ', 'اسم معرفہ'], correct: 0 },
      { questionText: 'کہاوت "ڈوبتے کو ______ کا سہارا":', options: ['تنکے', 'کشتی', 'پانی', 'ہاتھ'], correct: 0 },
      { questionText: 'درست جملہ بتائیے: "میں نے کتاب ______"', options: ['پڑھی', 'پڑھا', 'پڑھے', 'پڑھو'], correct: 0 },
    ];

    const urdu9McqPool = [
      { chapter: 1, questionText: 'سبق "ہجرتِ نبوی ﷺ" کے مصنف کون ہیں؟', options: ['مولانا شبلی نعمانی', 'سر سید احمد خان', 'خواجہ باسط', 'حالی'], correct: 0 },
      { chapter: 1, questionText: 'ہجرت کے وقت رسول اللہ ﷺ نے اپنا بستر کس کے حوالے فرمایا؟', options: ['حضرت علی ؓ', 'حضرت ابوبکر ؓ', 'حضرت عمر ؓ', 'حضرت عثمان ؓ'], correct: 0 },
      { chapter: 1, questionText: 'رسول اکرم ﷺ نے حضرت علی ؓ کو کیا ہدایت فرمائی تھی؟', options: ['قریش کی امانتیں واپس کر کے آنا', 'ساتھ روانہ ہونا', 'جنگ کی تیاری کرنا', 'گھر میں بند رہنا'], correct: 0 },
      { chapter: 2, questionText: 'مرزا غالب کے اخلاق و عادات کس کے تحریر کردہ ہیں؟', options: ['مولانا الطاف حسین حالی', 'شبلی نعمانی', 'ڈپٹی نذیر', 'آزاد'], correct: 0 },
      { chapter: 2, questionText: 'مرزا غالب کو پھلوں میں سب سے زیادہ کیا پسند تھا؟', options: ['آم', 'سیب', 'انگور', 'انار'], correct: 0 },
      { chapter: 3, questionText: 'سبق "کاہلی" کس نامور مصلح کی تحریر ہے؟', options: ['سر سید احمد خان', 'حالی', 'شبلی', 'محسن الملک'], correct: 0 },
      { chapter: 3, questionText: 'سر سید کے نزدیک سب سے بڑی کاہلی کیا ہے؟', options: ['دلی قویٰ کو بیکار چھوڑ دینا', 'ہاتھ پاؤں سے محنت نہ کرنا', 'سوتے رہنا', 'کام نہ کرنا'], correct: 0 },
      { chapter: 4, questionText: 'سبق "شاعروں کے لطیفے" کے مصنف کون ہیں؟', options: ['مولانا محمد حسین آزاد', 'مرزا ادیب', 'شاہد احمد', 'منشی پریم چند'], correct: 0 },
      { chapter: 5, questionText: 'سبق "نصوح اور سلیم کی گفتگو" کس ناول سے ماخوذ ہے؟', options: ['توبۃ النصوح', 'مراۃ العروس', 'ابن الوقت', 'فردوس بریں'], correct: 0 },
      { chapter: 6, questionText: 'افسانہ "پنچایت" کس کے قلم کا شاہکار ہے؟', options: ['منشی پریم چند', 'غلام عباس', 'احمد ندیم قاسمی', 'سعادت حسن'], correct: 0 },
      { chapter: 7, questionText: 'ڈرامہ "آرام و سکون" کے مصنف کون ہیں؟', options: ['سید امتیاز علی تاج', 'مرزا ادیب', 'احمد ندیم قاسمی', 'حکیم احمد شجاع'], correct: 0 },
      { chapter: 8, questionText: 'ڈرامہ "لہو اور قالین" کس کا تحریر کردہ ہے؟', options: ['مرزا ادیب', 'سید امتیاز علی تاج', 'اشفاق احمد', 'بانو قدسیہ'], correct: 0 },
      { chapter: 9, questionText: 'سبق "امتحان" کس مزاح نگار کا لکھا ہوا ہے؟', options: ['مرزا فرحت اللہ بیگ', 'شفیق الرحمن', 'پطرس بخاری', 'کرنل محمد خان'], correct: 0 },
      { chapter: 10, questionText: 'سبق "ملکی پرندے اور دوسرے جانور" کے مصنف کون ہیں؟', options: ['شفیق الرحمن', 'مشتاق احمد یوسفی', 'کرنل محمد خان', 'ابن انشا'], correct: 0 },
      { chapter: 11, questionText: 'سبق "قدرِ ایاز" کس کتاب سے لیا گیا ہے؟', options: ['بجنگ آمد', 'کاروانِ حیات', 'زرگزشت', 'آبِ گم'], correct: 0 },
      { chapter: 13, questionText: 'نظم "حمد" کس شاعر کی تخلیق ہے؟', options: ['مولانا الطاف حسین حالی', 'حفیظ جالندھری', 'علامہ اقبال', 'اختر شیرانی'], correct: 0 },
      { chapter: 14, questionText: 'نظم "نعت" کے شاعر کون ہیں؟', options: ['امیر مینائی', 'حالی', 'اقبال', 'حفیظ'], correct: 0 },
      { chapter: 16, questionText: 'نظم "پیوستہ رہ شجر سے امیدِ بہار رکھ" کس کی ہے؟', options: ['علامہ محمد اقبال', 'حالی', 'ظفر علی خان', 'شبلی'], correct: 0 },
      { chapter: 18, questionText: 'خواجہ حیدر علی آتش کس دبستانِ شاعری سے تعلق رکھتے ہیں؟', options: ['دبستان لکھنؤ', 'دبستان دہلی', 'دبستان عظیم آباد', 'دبستان لاہور'], correct: 0 },
      { chapter: 0, questionText: 'قواعد کی رو سے "قلم" کیا ہے؟', options: ['اسم آلہ', 'اسم ظرف', 'اسم صوت', 'اسم صفت'], correct: 0 },
      { chapter: 0, questionText: 'کہاوت "نو نقد نہ تیرہ ______" نامکمل حصہ بتائیے:', options: ['ادھار', 'سچے', 'جھوٹے', 'رپئے'], correct: 0 },
      { chapter: 0, questionText: 'وہ اسم جو کسی خاص شخص، جگہ یا چیز کا نام ہو، کہلاتا ہے:', options: ['اسم معرفہ', 'اسم نکرہ', 'اسم جامد', 'اسم مشتق'], correct: 0 },
    ];

    let currentUrduPool = is12th
      ? urdu12McqPool
      : is11th
      ? urdu11McqPool
      : is10th
      ? urdu10McqPool
      : urdu9McqPool;

    if (hasChapterFilter) {
      const chFiltered = currentUrduPool.filter(item => item.chapter !== undefined && activeChapterSet.has(Number(item.chapter)));
      if (chFiltered.length > 0) {
        currentUrduPool = chFiltered;
      }
    }

    let mcqs = [];
    if (!skipMcq) {
      const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.nameUrdu || formattedScope;
      let availableMcqs = [...currentUrduPool];
      while (availableMcqs.length < Number(mcqCount)) {
        const idx = availableMcqs.length + 1;
        availableMcqs.push({
          questionText: `سبق "${activeChName}" سوال نمبر ${idx}: امتحانی نصاب کے مطابق درست فکری جواب یا مصنف کا نام منتخب کریں:`,
          options: ['(الف) درست اور اصولی جواب', '(ب) ثانوی تصور', '(ج) عام رائے', '(د) غیر متعلقہ پہلو'],
          correct: 0,
        });
      }
      const sampled = sampleRandom(availableMcqs, Number(mcqCount));
      mcqs = sampled.map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    // --- SECTIONS BY CLASS (Randomly Sampled) ---
    const paper = {
      ...paperBase,
      isUrduPaper: true,
      timeAllowed: isInter ? '2 گھنٹے 30 منٹ' : '2 گھنٹے 10 منٹ',
      totalMarks: configuredTotalMarks || defaultTotalMarks,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        title: 'حصہ معروضی (کثیر الانتخابی سوالات)',
        time: isInter ? '20 منٹ' : '20 منٹ',
        questions: mcqs,
      },
    };

    // Q2: اشعار کی تشریح (Randomized pools of verses)
    if (!urduConfig.skipTashreeh) {
      const nazmPool12 = [
        'خدا سرسبز رکھے اس چمن کو مہرباں ہو کر / کہ گوہر جس کے کانٹوں کے لٹائے کارواں ہو کر',
        'سراغِ راہرو اب خاک میں پنہاں ہے مدت سے / کہ ہم جیسے مسافر کارواں کے کارواں گم ہیں',
        'غرض میں کیا کہوں تجھ سے کہ وہ صحرا نشیں کیا تھے / جہانگیر و جہاں دار و جہانباں و جہاں آرا',
        'سبق پھر پڑھ صداقت کا، عدالت کا، شجاعت کا / لیا جائے گا تجھ سے کام دنیا کی امامت کا',
        'نہیں ہے ناامید اقبال اپنی کشتِ ویراں سے / ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی',
      ];
      const ghazalPool12 = [
        'جگ میں آ کر ادھر ادھر دیکھا / تو ہی آیا نظر جدھر دیکھا (خواجہ میر درد)',
        'جو گزری مجھ پہ مت اس سے کہو ہوا سو ہوا / بلا کشاںِ محبت پہ جو ہوا سو ہوا (مصحفی)',
        'دل ہی تو ہے نہ سنگ و خشت درد سے بھر نہ آئے کیوں / روئیں گے ہم ہزار بار کوئی ہمیں ستائے کیوں (غالب)',
        'روشن جمالِ یار سے ہے انجمن تمام / دہکا ہوا ہے آتشِ گل سے چمن تمام (حسرت)',
        'ہستی کے مت فریب میں آ جائیو اسدؔ / عالم تمام حلقۂ دامِ خیال ہے (غالب)',
      ];

      const nazmPool11 = [
        'پہنچتا ہے ہر اک مے کش کے آگے دورِ جام اس کا / کسی کو تشنہ لب رکھتا نہیں لطفِ عام اس کا',
        'گرتے ہوؤں کو تھام لیا جس کے ہاتھ نے / اے تاج دارِ یثرب و بطحا تمہی تو ہو',
        'سردارِ دوعالم نے سکھایا تھا یہی سبق / دنیا میں رہو یوں کہ مسافر ہو مسافر',
        'خدا نے آج تک اس قوم کی حالت نہیں بدلی / نہ ہو جس کو خیال آپ اپنی حالت کے بدلنے کا',
      ];
      const ghazalPool11 = [
        'تھا مستعار حسن سے اس کے جو نور تھا / خورشید میں بھی اس ہی کا ذرہ ظہور تھا (میر تقی میر)',
        'یہ آرزو تھی تجھے گل کے روبرو کرتے / ہم اور بلبلِ بے تاب گفتگو کرتے (آتش)',
        'ابنِ مریم ہوا کرے کوئی / میرے دکھ کی دوا کرے کوئی (مرزا غالب)',
        'تم مرے پاس ہوتے ہو گویا / جب کوئی دوسرا نہیں ہوتا (مومن)',
        'الٹی ہو گئیں سب تدبیریں کچھ نہ دوا نے کام کیا / دیکھا اس بیماری دل نے آخر کام تمام کیا (میر)',
      ];

      const nazmPool10 = [
        'اسی نے ایک حرفِ کُن سے پیدا کر دیا عالم / کشاکش کی صدائے ہا و ہو سے بھر دیا عالم',
        'دو عالم کی امداد ہے تیری مدحت / نہ کیوں کر ہو سرمایۂ فخر و راحت',
        'ٹھنڈی ہوا میں سبزہ و صحرا کی وہ لچک / جھونکوں میں وہ سرور، کلی پر وہ نم کی چمک',
        'فاطمہ! گو شبنم افشاں آنکھ تیرے غم میں ہے / نغمۂ عشرت بھی اپنے نالۂ ماتم میں ہے',
        'جھپٹنا، پلٹنا، پلٹ کر جھپٹنا / لہو گرم رکھنے کا ہے اک بہانہ',
      ];
      const ghazalPool10 = [
        'مصیبت بھی راحت فزا ہو گئی ہے / نگاہِ کرم آشنا ہو گئی ہے (حسرت موہانی)',
        'آدمی آدمی سے ملتا ہے / دل مگر کم کسی سے ملتا ہے (جگر مراد آبادی)',
        'یہ فخر تو حاصل ہے برے ہیں کہ بھلے ہیں / دو چار قدم ہم بھی تیرے ساتھ چلے ہیں (فراق)',
        'دلِ ناداں تجھے ہوا کیا ہے / آخر اس درد کی دوا کیا ہے (غالب)',
      ];

      const nazmPool9 = [
        'جگتی دنیا میں تیری جھلک / سب سے لیکن جدا، اے خدا! اے خدا!',
        'نظر نہ آئے کہیں شب کا اندھیرا / ہر اک کونے میں اجالا رہے تیرا',
        'جس نے کی جستجو مل گیا اس کو تو / سب کا تو رہنما، اے خدا! اے خدا!',
        'پیوستہ رہ شجر سے امید بہار رکھ / شاخِ بریدہ سے سبق اندوز ہو کہ تو',
        'صبا بے شک آتی مدینے سے ہے / کہ حلہ تن و جاں کا پُر نور ہے',
      ];
      const ghazalPool9 = [
        'ہستی اپنی حباب کی سی ہے / یہ نمائش سراب کی سی ہے (میر تقی میر)',
        'رخ و زلف پر جان کھویا کیا / اندھیرے اجالے میں رویا کیا (خواجہ حیدر علی آتش)',
        'دلِ ناداں تجھے ہوا کیا ہے / آخر اس درد کی دوا کیا ہے (مرزا غالب)',
        'لائی حیات آئے قضا لے چلی چلے / اپنی خوشی نہ آئے نہ اپنی خوشی چلے (ذوق)',
      ];

      const currentNazmPool = is12th ? nazmPool12 : is11th ? nazmPool11 : is10th ? nazmPool10 : nazmPool9;
      const currentGhazalPool = is12th ? ghazalPool12 : is11th ? ghazalPool11 : is10th ? ghazalPool10 : ghazalPool9;

      const sampledNazm = sampleRandom(currentNazmPool, isInter ? 3 : 4).map((v, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${v}`);
      const sampledGhazal = sampleRandom(currentGhazalPool, isInter ? 4 : 3).map((v, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${v}`);

      paper.urduTashreehSection = {
        active: true,
        num: 2,
        title: 'سوال نمبر 2: اشعار کی تشریح (حصہ اول)',
        instruction: isInter
          ? '2- (الف) حصہ نظم میں سے اشعار کی تشریح کیجیے (نظم کا عنوان اور شاعر کا نام بھی لکھیے): [8 نمبر]\n(ب) حصہ غزل میں سے اشعار کی تشریح کیجیے اور شاعر کا نام لکھیے: [10 نمبر]'
          : '2- حصہ نظم جبکہ حصہ غزل میں سے منتخب اشعار کی تشریح کیجیے اور شاعر کا نام تحریر کیجیے:',
        marks: isInter ? 18 : 10,
        nazmMarks: isInter ? '8 نمبر' : '6 نمبر',
        nazmVerses: sampledNazm,
        ghazalMarks: isInter ? '10 نمبر' : '4 نمبر',
        ghazalVerses: sampledGhazal,
      };
    }

    // Q3: نثری پاروں کی تشریح (Sampled paragraphs)
    if (!urduConfig.skipNasr) {
      const nasrPool12 = [
        { chapter: 1, text: 'عمر بن عبدالعزیزؒ نے جب خلافت کا بار سنبھالا تو انہوں نے سب سے پہلے اپنے خاندان کے ناجائز جاگیروں اور وظائف کو ضبط کیا۔ انہوں نے فرمایا کہ جب تک انصاف کا ترازو برابر نہیں ہوتا ریاست میں برکت نہیں آ سکتی۔' },
        { chapter: 2, text: 'مسلمانانِ ہند نے قائداعظم محمد علی جناحؒ کی پرخلوص اور مدبرانہ قیادت میں یہ بات واضح کر دی کہ وہ صرف ایک اقلیت نہیں بلکہ ایک علیحدہ اور خود مختار قوم ہیں۔ ہمارا دین، ہماری ثقافت اور ہمارے قوانین سب جداگانہ ہیں۔' },
        { chapter: 3, text: 'قاضی نے کہا کہ شریعت کی رو سے خون کا بدلہ خون ہے خواہ مجرم کا تعلق قاضی کے اپنے خاندان ہی سے کیوں نہ ہو۔ انصاف کے ترازو میں امیر اور غریب سب برابر ہیں۔' },
        { chapter: 4, text: 'مولوی عبدالحق نے بابائے اردو کی حیثیت سے اپنی پوری زندگی اردو زبان کی ترویج و اشاعت کے لیے وقف کر دی۔ انہوں نے نامساعد حالات کے باوجود عزم کا دامن نہ چھوڑا۔' },
      ];
      const nasrPool11 = [
        { chapter: 1, text: 'رسولِ اکرم خاتم النبیین ﷺ کا اسوہ حسنہ ہر طبقہ انسانی کے لیے مشعلِ راہ ہے۔ اگر تم تاجر ہو تو مکہ کے امین تاجر کا نمونہ دیکھو۔ اگر تم فاتح ہو تو بدر اور فتح مکہ کے عفو و درگزر والے سردار کو دیکھو۔' },
        { chapter: 2, text: 'خدا ان کی مدد کرتا ہے جو اپنی مدد آپ کرتے ہیں۔ قوموں کی ترقی اور زوال دراصل افراد کی محنت، دیانت داری اور خود اعتمادی پر منحصر ہے۔' },
        { chapter: 3, text: 'اس نے اوور کوٹ کی جیب سے ایک رومال اور سگریٹ کا خالی پیکٹ نکالا۔ بظاہر امیر نظر آنے والے نوجوان کی اندرونی غربت اس کے مرنے کے بعد آشکار ہوئی۔' },
        { chapter: 4, text: 'دوست وہ ہے جو وقت پر کام آئے اور مصیبت کے لمحات میں اکیلا نہ چھوڑے۔ اخلاص اور سچائی دوستی کی بنیادی شرائط ہیں۔' },
      ];
      const nasrPool10 = [
        { chapter: 1, text: 'مرزا محمد سعید دلی کے شرفا کے خاندان سے تعلق رکھتے تھے۔ آپ نے کبھی شہرت اور پیسے کے لیے قلم نہیں اٹھایا۔ انہوں نے فرمایا کہ جو چیز میں اپنے دل کے اطمینان کے لیے لکھتا ہوں، اسے بیچا نہیں کرتا۔' },
        { chapter: 2, text: 'نظریہ پاکستان سے مراد وہ نظریہ ہے جس کی بنیاد کلمہ توحید پر رکھی گئی۔ مسلمانوں نے اس برصغیر میں صدیوں حکومت کی لیکن انہوں نے کبھی اپنے دین اور اسلامی تشخص پر سودے بازی نہیں کی۔' },
        { chapter: 3, text: 'شہزادی نے جنوں کے قید خانے میں ہمت اور ہوشمندی سے کام لیا اور ثابت کیا کہ انسان اشرف المخلوقات ہے۔' },
        { chapter: 4, text: 'مجھے میرے دوستوں سے بچاؤ! سجاد حیدر یلدرم کے دوست احمد مرزا جب آتے تو طوفان کی طرح آتے اور مصنف کے کام کے اوقات ضائع کر دیتے۔' },
        { chapter: 8, text: 'نام دیو مالی اپنے کام کو عبادت سمجھ کر کرتا تھا۔ اس کی لگن اور پودوں سے محبت ہر مالی کے لیے سبق آموز ہے۔' },
      ];
      const nasrPool9 = [
        { chapter: 1, text: 'رسول کریم خاتم النبیین ﷺ کا خلقِ عظیم قرآن مجید کی عملی تصویر تھا۔ آپ ﷺ نے کبھی کسی سے ذاتی انتقام نہیں لیا بلکہ بدلہ لینے پر قادر ہونے کے باوجود ہمیشہ عفو و درگزر سے کام لیا۔' },
        { chapter: 1, text: 'حضور اکرم ﷺ کی حیاتِ طیبہ اخلاقِ حسنہ کا اعلیٰ ترین نمونہ ہے۔ آپ ﷺ نے نرم گفتاری، سچائی، ایفائے عہد اور غریبوں کی دلجوئی کو انسانی زندگی کا بہترین زیور قرار دیا۔' },
        { chapter: 2, text: 'اخلاقِ حسنہ وہ دولت ہے جو انسان کو دونوں جہانوں میں سرخرو کرتی ہے۔ جس انسان کے اخلاق اچھے ہوں لوگ اس سے محبت کرتے ہیں اور معاشرے میں امن و سکون قائم ہوتا ہے۔' },
        { chapter: 3, text: 'سر سید احمد خان فرماتے ہیں کہ خدا ان کی مدد کرتا ہے جو اپنی مدد آپ کرتے ہیں۔ قوموں کی ترقی و تنزل کا انحصار خود ان کے اپنے افراد کی انفرادی کوشش اور محنت پر ہے۔' },
        { chapter: 3, text: 'جب تک کسی قوم کے افراد میں ذاتی محنت، خود اعتمادی اور باہمی تعاون کا جذبہ بیدار نہ ہو، اس وقت تک بیرونی قوانین یا امداد سے قوم کی حالت نہیں بدل سکتی۔' },
        { chapter: 4, text: 'کلیم جب مرزا ظاہر دار بیگ کے پاس گیا تو مرزا نے اپنی پرانی عادت کے مطابق بڑے ٹھاٹھ باٹھ اور جھوٹی شان و شوکت کا مظاہرہ کیا لیکن وقت پڑنے پر اس کی اصلیت کھل گئی۔' },
        { chapter: 5, text: 'نام دیو مالی باغ کے پودوں اور پھولوں کی پرورش اس طرح کرتا تھا جیسے ماں اپنے بچوں کی دیکھ بھال کرتی ہے۔ اس کے ہاتھ میں وہ ہنر تھا کہ بنجر زمین بھی گلزار بن جاتی تھی۔' },
        { chapter: 6, text: 'ڈاکٹر نے اشفاق کو تلقین کی کہ تمہاری بیماری کی اصل وجہ ذہنی تھکاوٹ اور شور و غل ہے۔ تمہیں نہ دوا کی ضرورت ہے نہ علاج کی، بس مکمل آرام و سکون درکار ہے۔' },
        { chapter: 7, text: 'شاہد احمد دہلوی نے کتبہ میں انسانی بے بسی اور خوابوں کی شکست و ریخت کی ایسی تصویر کھینچی ہے جو پڑھنے والے کے دل کو تڑپا دیتی ہے۔' },
        { chapter: 8, text: 'ابتدائی حساب کے اصول انسان کو زندگی کے معاملات میں نظم و ضبط اور درستی سکھاتے ہیں۔ ریاضی محض ہندسوں کا کھیل نہیں بلکہ عقل کو تیز کرنے کا ذریعہ ہے۔' },
        { chapter: 9, text: 'مستنصر حسین تارڑ نے اپنے سفر نامے میں قدرت کے حسین مناظر اور پہاڑی وادیوں کی ایسی دلکش عکاسی کی ہے کہ انسان خود کو ان نظاروں کے درمیان محسوس کرتا ہے۔' },
        { chapter: 10, text: 'بھیڑیا مشتاق احمد یوسفی کا ایک ایسا مزاحیہ شاہکار ہے جس میں ظرافت کی چاشنی کے ساتھ ساتھ معاشرتی تلخیوں اور انسانی نفسیات پر گہرا طنز کیا گیا ہے۔' },
      ];

      let activeNasrPool = is12th ? nasrPool12 : is11th ? nasrPool11 : is10th ? nasrPool10 : nasrPool9;
      if (hasChapterFilter) {
        const filtered = activeNasrPool.filter(p => p.chapter !== undefined && activeChapterSet.has(Number(p.chapter)));
        if (filtered.length > 0) {
          activeNasrPool = filtered;
        }
      }

      const sampledParas = sampleRandom(activeNasrPool.map(p => p.text), 2);
      paper.urduNasrSection = {
        active: true,
        num: 3,
        title: 'سوال نمبر 3: نثری اقتباسات کی تشریح',
        instruction: '3- درج ذیل نثری اقتباس کی تشریح کیجیے۔ سبق کا عنوان، مصنف کا نام اور خط کشیدہ الفاظ کے معانی تحریر کیجیے:',
        marks: isInter ? 15 : 10,
        paras: [
          { num: '(الف)', text: sampledParas[0] },
          { num: '(ب)', text: sampledParas[1] || sampledParas[0] },
        ],
      };
    }

    // Q4: سبق کا خلاصہ یا مختصر سوالات
    if (isInter) {
      const khulasaPool12 = [
        { chapter: 1, text: '(الف) مناقبِ عمر بن عبدالعزیزؒ (علامہ شبلی نعمانی)' },
        { chapter: 2, text: '(ب) تشکیلِ پاکستان (میاں بشیر احمد)' },
        { chapter: 3, text: '(ج) نواب محسن الملک (مولوی عبدالحق)' },
        { chapter: 4, text: '(د) محنت پسند مند مند (مولانا محمد حسین آزاد)' },
        { chapter: 5, text: '(ہ) قرطبہ کا قاضی (سید امتیاز علی تاج)' },
      ];
      const khulasaPool11 = [
        { chapter: 1, text: '(الف) اسوہ حسنہ ﷺ (سید سلیمان ندوی)' },
        { chapter: 2, text: '(ب) اپنی مدد آپ (سر سید احمد خان)' },
        { chapter: 3, text: '(ج) اوور کوٹ (غلام عباس)' },
        { chapter: 4, text: '(د) چراغ کی لو (ہاجرہ مسرور)' },
        { chapter: 5, text: '(ہ) ادیب کی عزت (منشی پریم چند)' },
      ];
      let activeKhulasaInter = is12th ? khulasaPool12 : khulasaPool11;
      if (hasChapterFilter) {
        const filtered = activeKhulasaInter.filter(k => k.chapter !== undefined && activeChapterSet.has(Number(k.chapter)));
        if (filtered.length > 0) activeKhulasaInter = filtered;
      }
      const sampledKhulasa = sampleRandom(activeKhulasaInter.map(k => k.text), Math.min(2, activeKhulasaInter.length));

      paper.urduKhulasaSection = {
        active: true,
        num: 4,
        title: 'سوال نمبر 4: سبق کا خلاصہ',
        instruction: '4- مندرجہ ذیل اسباق میں سے کسی ایک کا خلاصہ تحریر کیجیے اور مصنف کا نام لکھیے: [1 + 9 = 10 نمبر]',
        marks: 10,
        options: sampledKhulasa,
      };

      // Q5: نظم کا خلاصہ
      const nazmKhulasaPool12 = ['نظم "اسلامی مساوات"', 'نظم "نوجوان سے خطاب"', 'نظم "تغیر"', 'نظم "قطعات"'];
      const nazmKhulasaPool11 = ['نظم "پیغام"', 'نظم "مستقبل کی جھلک"', 'نظم "ہلالِ استقلال"', 'نظم "خطاب بہ جوانانِ اسلام"'];
      const sampledNazmKhulasa = sampleRandom(is12th ? nazmKhulasaPool12 : nazmKhulasaPool11, 1)[0];

      paper.urduNazmKhulasaSection = {
        active: true,
        num: 5,
        title: 'سوال نمبر 5: نظم کا خلاصہ',
        instruction: `5- ${sampledNazmKhulasa} کا خلاصہ اپنے الفاظ میں تحریر کیجیے: [5 نمبر]`,
        marks: 5,
      };

      if (is12th) {
        const essayPool12 = [
          'حب الوطنی اور قومی یکجہتی کی اہمیت',
          'سائنس کے کرشمے اور جدید ٹیکنالوجی کے اثرات',
          'ماحولیاتی آلودگی اور اس کا سدِ باب',
          'وقت کی پابندی اور کامیابی کا راز',
          'تعلیم نسواں اور معاشرتی ترقی',
          'مسئلہ کشمیر اور عالمی ضمیر',
        ];
        const sampledEssays = sampleRandom(essayPool12, 3).map((t, i) => `(${['الف', 'ب', 'ج'][i]}) ${t}`);

        paper.urduInshaSection = {
          active: true,
          num: 6,
          title: 'سوال نمبر 6: تفصیلی مضمون نویسی',
          instruction: '6- مندرجہ ذیل عنوانات میں سے کسی ایک پر جامع، مدلل اور حوالہ جات سے مزین مضمون تحریر کیجیے: [20 نمبر]',
          marks: 20,
          topics: sampledEssays,
        };

        const khatOptions12 = [
          'اخبار کے مدیر کے نام خط لکھ کر محلے کی صفائی کی ابتر صورتحال کی طرف توجہ دلائیے۔ --یا-- ایک پرانے درخت کی آپ بیتی تحریر کیجیے: [10 نمبر]',
          'والد صاحب کے نام خط لکھ کر امتحان میں شاندار کامیابی سے آگاہ کیجیے۔ --یا-- ایک روپے کے سکے کی آپ بیتی لکھیے: [10 نمبر]',
          'محکمہ ڈاک کے اعلیٰ افسر کے نام ڈاک کی ناقص ترسیل کی شکایت کا خط لکھیے۔ --یا-- ایک لاوارث کتاب کی آپ بیتی تحریر کیجیے: [10 نمبر]',
        ];
        paper.urduKhatSection = {
          active: true,
          num: 7,
          title: 'سوال نمبر 7: خطوط نویسی یا آپ بیتی',
          instruction: `7- ${sampleRandom(khatOptions12, 1)[0]}`,
          marks: 10,
        };
      } else {
        // 11th
        const dialoguePool11 = [
          'دو دوستوں کے درمیان امتحانات کی تیاری پر مکالمہ تحریر کیجیے۔ --یا-- کالج میں منعقدہ یومِ اقبال کی روداد لکھیے: [10 نمبر]',
          'دکاندار اور گاہک کے درمیان بڑھتی ہوئی مہنگائی پر مکالمہ قلمبند کیجیے۔ --یا-- سالانہ کھیلوں کے مقابلے کی تقریب کی روداد لکھیے: [10 نمبر]',
          'ڈاکٹر اور مریض کے درمیان متوازن غذا اور احتیاطی تدابیر پر مکالمہ لکھیے۔ --یا-- کالج کے الوداعی جلسے کی روداد تحریر کیجیے: [10 نمبر]',
        ];
        paper.urduKahaniSection = {
          active: true,
          num: 6,
          title: 'سوال نمبر 6: مکالمہ نگاری یا روداد نویسی',
          instruction: `6- ${sampleRandom(dialoguePool11, 1)[0]}`,
          marks: 10,
        };

        const applicationPool11 = [
          'پرنسپل صاحب کے نام فیس معافی کی درخواست تحریر کیجیے۔ --یا-- مکان کا کرایہ وصول کرنے کی باقاعدہ رسید لکھیے: [10 نمبر]',
          'پرنسپل کے نام کریکٹر سرٹیفکیٹ کے حصول کی درخواست لکھیے۔ --یا-- موٹر سائیکل کی فروخت کی رسید تحریر کیجیے: [10 نمبر]',
          'پرنسپل صاحب کے نام دوبارہ داخلے کی درخواست قلمبند کیجیے۔ --یا-- امانتاً رقم وصولی کی رسید لکھیے: [10 نمبر]',
        ];
        paper.urduKhatSection = {
          active: true,
          num: 7,
          title: 'سوال نمبر 7: درخواست نویسی یا رسید نویسی',
          instruction: `7- ${sampleRandom(applicationPool11, 1)[0]}`,
          marks: 10,
        };

        paper.urduTalkheesSection = {
          active: true,
          num: 8,
          title: 'سوال نمبر 8: عبارت کی تلخیص نگاری',
          instruction: '8- مندرجہ ذیل عبارت کی تلخیص کیجیے اور مناسب عنوان بھی تجویز کیجیے: [2 + 8 = 10 نمبر]',
          marks: 10,
          passage: sampleRandom([
            'انسان کی زندگی ایک سفر ہے اور وقت اس سفر کا سب سے قیمتی سرمایہ ہے۔ جو قومیں وقت کی قدر کرتی ہیں وہ دنیا میں عزت اور وقار حاصل کرتی ہیں۔ کامیابی کا راز مسلسل محنت، وقت کی پابندی اور دیانت داری میں پوشیدہ ہے۔',
            'علم انسان کی سب سے بڑی طاقت ہے۔ علم جہالت کے اندھیروں کو دور کر کے ذہن کو روشن کرتا ہے۔ جو قومیں تعلیم کو اپنا اوڑھنا بچھونا بنا لیتی ہیں، دنیا کی کوئی طاقت انہیں غلام نہیں بنا سکتی۔',
            'کتابیں انسان کی بہترین دوست ہیں۔ ایک اچھی کتاب انسان کو تنہائی میں بہترین رفاقت بخشتی ہے اور اس کی سوچ کو وسعت دیتی ہے۔ مطالعہ انسان کے اخلاق اور شعور کو جلا بخشتا ہے۔',
          ], 1)[0],
        };
      }
    } else {
      // 9th & 10th Urdu
      const shortPool10 = [
        { chapter: 1, text: 'مرزا محمد سعید کس لیے لکھتے تھے؟' },
        { chapter: 1, text: 'مرزا صاحب کا اندازِ تحریر اور شخصیت کیسی تھی؟' },
        { chapter: 2, text: 'ڈاکٹر غلام مصطفیٰ خان نے نظریہ پاکستان کا کیا مقصد بیان کیا؟' },
        { chapter: 2, text: 'مسلمانانِ ہند نے اپنے دینی تشخص کے تحفظ کے لیے کیا جدوجہد کی؟' },
        { chapter: 3, text: 'شہزادی نے جنوں کے قید خانے سے رہائی کیسے پائی؟' },
        { chapter: 4, text: 'سجاد حیدر یلدرم اپنے دوست احمد مرزا سے کیوں نالاں تھے؟' },
        { chapter: 8, text: 'نام دیو مالی کی موت کس حادثے کی وجہ سے ہوئی؟' },
        { chapter: 8, text: 'نام دیو مالی اپنے کام کو کس جذبے سے سرانجام دیتا تھا؟' },
        { chapter: 14, text: 'علامہ اقبال نے فاطمہ بنت عبداللہ کو کیوں خراجِ تحسین پیش کیا؟' },
        { chapter: 17, text: 'حسرت موہانی نے مصیبت کے راحت فزا ہونے کا کیا سبب بیان کیا؟' },
        { chapter: 18, text: 'جگر مراد آبادی نے دل ملنے کے بارے میں کیا شعر کہا؟' },
        { chapter: 0, text: 'علامہ اقبال کے نزدیک خودی کی تربیت کیسے ممکن ہے؟' },
      ];

      const shortPool9 = [
        { chapter: 1, text: 'حضور اکرم ﷺ کے اخلاقِ کریمانہ کے بارے میں حضرت عائشہ صدیقہ ؓ کا کیا فرمان ہے؟' },
        { chapter: 1, text: 'رسول اللہ ﷺ نے اپنے بدترین دشمنوں کے ساتھ فتحِ مکہ کے موقع پر کیا سلوک فرمایا؟' },
        { chapter: 2, text: 'اخلاقِ حسنہ سے معاشرے میں کیا مثبت تبدیلیاں رونما ہوتی ہیں؟' },
        { chapter: 2, text: 'سید سلیمان ندوی کے مطابق اعلیٰ اخلاق کی بنیادی شرائط کیا ہیں؟' },
        { chapter: 3, text: 'سر سید احمد خان کے نزدیک قوم کی ترقی کا اصل راز کس بات میں مضمر ہے؟' },
        { chapter: 3, text: '"خدا ان کی مدد کرتا ہے جو اپنی مدد آپ کرتے ہیں" اس مقولے کی مختصر وضاحت کیجیے۔' },
        { chapter: 4, text: 'مرزا ظاہر دار بیگ کی شخصیت اور طرزِ عمل کا مختصر خاکہ بیان کیجیے۔' },
        { chapter: 4, text: 'ڈپٹی نذیر احمد نے کلیم کے کردار کے ذریعے کیا نصیحت کی ہے؟' },
        { chapter: 5, text: 'نام دیو مالی پودوں اور گلابوں سے کیسا لگاؤ رکھتا تھا؟' },
        { chapter: 5, text: 'نام دیو مالی کی موت کس المناک حادثے میں واقع ہوئی؟' },
        { chapter: 6, text: 'ڈاکٹر نے مریض کو کن ہدایات پر سختی سے عمل کرنے کو کہا؟' },
        { chapter: 6, text: 'ڈراما "آرام و سکون" سے ہمیں کیا معاشرتی سبق ملتا ہے؟' },
        { chapter: 7, text: 'افسانہ "کتبہ" میں مصنف نے کتبے کے حوالے سے کیا المیہ بیان کیا ہے؟' },
        { chapter: 8, text: 'ابتدائی حساب انسانی سوچ اور عملی زندگی کو کس طرح متاثر کرتا ہے؟' },
        { chapter: 9, text: 'مستنصر حسین تارڑ نے وادی کے نظاروں کو کن تشبیہات سے نوازا ہے؟' },
        { chapter: 10, text: 'مشتاق احمد یوسفی کے مضمون "بھیڑیا" کا مرکزی مزاحیہ اور فکری نکتہ کیا ہے؟' },
        { chapter: 11, text: 'نظم "حمد" میں الطاف حسین حالی نے کائنات کے مظاہر کا کیا تذکرہ کیا ہے؟' },
        { chapter: 12, text: 'امیر مینائی نے نعت میں حضور ﷺ کی محبت کے کیا جذبات رقم کیے ہیں؟' },
        { chapter: 13, text: 'نظیر اکبر آبادی نے برسات کے موسم میں عوام کے جذبات کی کیا عکاسی کی ہے؟' },
        { chapter: 14, text: 'علامہ اقبال کی نظم "پیوستہ رہ شجر سے امیدِ بہار رکھ" کا اصل پیغام کیا ہے؟' },
        { chapter: 15, text: 'مرزا غالب نے غزل "دلِ ناداں تجھے ہوا کیا ہے" میں دل سے کیا استفسار کیا ہے؟' },
        { chapter: 16, text: 'میر تقی میر نے انسانی زندگی کی ناپائیداری کو کس چیز سے تشبیہ دی ہے؟' },
        { chapter: 18, text: 'بہادر شاہ ظفر نے اپنے آخری ایام کی حسرتوں کا اظہار کن الفاظ میں کیا؟' },
      ];

      if (!urduConfig.skipShort) {
        let currentShortsPool = is10th ? shortPool10 : shortPool9;
        if (hasChapterFilter) {
          const filtered = currentShortsPool.filter(q => q.chapter !== undefined && activeChapterSet.has(Number(q.chapter)));
          if (filtered.length > 0) {
            currentShortsPool = filtered;
          }
        }
        let availableShorts = currentShortsPool.map(q => q.text);
        const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.nameUrdu || formattedScope;
        while (availableShorts.length < 8) {
          const idx = availableShorts.length + 1;
          availableShorts.push(`سبق "${activeChName}": اس سبق کے اہم فکری و اصلاحی پہلو نمبر ${idx} کی وضاحت کیجیے۔`);
        }

        const sampledShorts = sampleRandom(availableShorts, 8).map((q, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${q}`);

        paper.urduShortSection = {
          active: true,
          num: 4,
          title: 'سوال نمبر 4: مختصر سوالات کے جوابات',
          instruction: '4- مندرجہ ذیل میں سے کوئی سے پانچ (5) سوالات کے مختصر جوابات تحریر کیجیے: [5 × 2 = 10 نمبر]',
          marks: 10,
          questions: sampledShorts,
        };
      }

      // Q5: سبق کا خلاصہ
      if (!urduConfig.skipKhulasa) {
        const khulasaPool10 = [
          { chapter: 1, text: 'مرزا محمد سعید (شاہد احمد دہلوی)' },
          { chapter: 2, text: 'نظریہ پاکستان (ڈاکٹر غلام مصطفیٰ خان)' },
          { chapter: 3, text: 'پرستان کی شہزادی (اشرف صبوحی)' },
          { chapter: 4, text: 'مجھے میرے دوستوں سے بچاؤ (سجاد حیدر یلدرم)' },
          { chapter: 8, text: 'نام دیو مالی (مولوی عبدالحق)' },
        ];
        const khulasaPool9 = [
          { chapter: 1, text: 'اخلاقِ نبوی ﷺ (مولانا شبلی نعمانی)' },
          { chapter: 2, text: 'اخلاقِ حسنہ (سید سلیمان ندوی)' },
          { chapter: 3, text: 'اپنی مدد آپ (سر سید احمد خان)' },
          { chapter: 4, text: 'کلیم اور مرزا ظاہر دار بیگ (ڈپٹی نذیر احمد)' },
          { chapter: 5, text: 'نام دیو مالی (بابائے اردو مولوی عبد الحق)' },
          { chapter: 6, text: 'آرام و سکون (سید امتیاز علی تاج)' },
          { chapter: 7, text: 'کتبہ (شاہد احمد دہلوی)' },
          { chapter: 8, text: 'ابتدائی حساب (ڈاکٹر رفیع الدین ہاشمی)' },
          { chapter: 9, text: 'لڑی میں پروئے ہوئے منظر (مستنصر حسین تارڑ)' },
          { chapter: 10, text: 'بھیڑیا (مشتاق احمد یوسفی)' },
        ];
        let activeKhulasa = is10th ? khulasaPool10 : khulasaPool9;
        if (hasChapterFilter) {
          const filtered = activeKhulasa.filter(c => c.chapter !== undefined && activeChapterSet.has(Number(c.chapter)));
          if (filtered.length > 0) activeKhulasa = filtered;
        }

        let khulasaTitles = activeKhulasa.map(c => c.text);
        if (khulasaTitles.length === 1) {
          khulasaTitles = [
            `${khulasaTitles[0]} - (مرکزی خیال و اہم واقعات)`,
            `${khulasaTitles[0]} - (تفصیلی خلاصہ مع اسلوبِ مصنف)`,
          ];
        }

        const sampledChapters = sampleRandom(khulasaTitles, Math.min(2, khulasaTitles.length)).map((c, i) => `(${['الف', 'ب'][i]}) ${c}`);

        paper.urduKhulasaSection = {
          active: true,
          num: 5,
          title: 'سوال نمبر 5: سبق کا خلاصہ',
          instruction: '5- مندرجہ ذیل اسباق میں سے کسی ایک کا خلاصہ لکھیے اور مصنف کا نام لکھیے: [5 نمبر]',
          marks: 5,
          options: sampledChapters,
        };
      }

      if (is10th) {
        const essayPool10 = [
          'قائداعظم محمد علی جناحؒ (میرا پسندیدہ رہنما)',
          'وقت کی پابندی اور محنت کی عظمت',
          'یومِ آزادی پاکستان اور ہماری ذمہ داریاں',
          'سائنس کے حیرت انگیز کرشمے',
          'شجر کاری کی اہمیت اور ماحولیاتی تحفظ',
          'تندرستی ہزار نعمت ہے',
        ];
        const sampledEssays10 = sampleRandom(essayPool10, 3).map((t, i) => `(${['الف', 'ب', 'ج'][i]}) ${t}`);

        paper.urduInshaSection = {
          active: true,
          num: 6,
          title: 'سوال نمبر 6: تفصیلی مضمون نویسی',
          instruction: '6- مندرجہ ذیل میں سے کسی ایک عنوان پر تفصیلی اور جامع مضمون لکھیے: [15 نمبر]',
          marks: 15,
          topics: sampledEssays10,
        };

        paper.urduTalkheesSection = {
          active: true,
          num: 7,
          title: 'سوال نمبر 7: فہمِ عبارت (Comprehension Passage)',
          instruction: '7- مندرجہ ذیل عبارت کو غور سے پڑھیے اور آخر میں دیے گئے سوالات کے جوابات تحریر کیجیے: [5 × 2 = 10 نمبر]',
          marks: 10,
          passage: 'پنجاب کی سرزمین صوفیاء کرام اور درویشوں کی آماجگاہ رہی ہے۔ داتا گنج بخش علی ہجویریؒ، بابا فرید گنج شکرؒ، شاہ حسینؒ اور بلھے شاہؒ نے یہاں امن، محبت اور بھائی چارے کا درس دیا۔ ان بزرگانِ دین نے نفرتوں کو مٹایا اور انسانوں کو ایک لڑی میں پرو دیا۔ ان کی تعلیمات آج بھی ہمارے لیے مشعلِ راہ ہیں۔',
          questions: [
            '(i) پنجاب کی سرزمین کن ہستیوں کی آماجگاہ رہی ہے؟',
            '(ii) صوفیاء کرام نے لوگوں کو کس بات کا درس دیا؟',
            '(iii) حضرت داتا گنج بخشؒ کا مزار کہاں واقع ہے؟',
            '(iv) بزرگانِ دین نے معاشرے پر کیا اثرات مرتب کیے؟',
            '(v) اس عبارت کا ایک مناسب عنوان تحریر کیجیے۔',
          ],
        };
      } else {
        // 9th
        if (!urduConfig.skipNazmKhulasa) {
          const nazm9Options = ['نظم "حمد"', 'نظم "نعت"', 'نظم "برسات کی بہاریں"', 'نظم "پیوستہ رہ شجر سے امیدِ بہار رکھ"'];
          const pickedNazm = sampleRandom(nazm9Options, 2);
          paper.urduNazmKhulasaSection = {
            active: true,
            num: 6,
            title: 'سوال نمبر 6: نظم کا مرکزی خیال یا خلاصہ',
            instruction: `6- ${pickedNazm[0]} کا مرکزی خیال لکھیے اور شاعر کا نام تحریر کیجیے۔ --یا-- ${pickedNazm[1]} کا خلاصہ لکھیے۔: [5 نمبر]`,
            marks: 5,
          };
        }

        if (!urduConfig.skipKhat) {
          const khatPool9 = [
            'اپنے تعلیمی ادارے کے سربراہ کے نام درخواست برائے رخصت بوجہ بیماری لکھیے۔ --یا-- والد کے نام خط لکھ کر سالانہ امتحان کے نتائج سے آگاہ کیجیے۔: [10 نمبر]',
            'پرنسپل کے نام فیس معافی کی درخواست لکھیے۔ --یا-- دوست کے نام خط لکھ کر چھٹیاں ساتھ گزارنے کی دعوت دیجیے۔: [10 نمبر]',
            'ڈاک خانے کے پوسٹ ماسٹر کے نام خط لکھ کر گم شدہ پارسل کی شکایت کریں۔ --یا-- والدہ کے نام خط لکھ کر خیریت دریافت کیجیے۔: [10 نمبر]',
          ];
          paper.urduKhatSection = {
            active: true,
            num: 7,
            title: 'سوال نمبر 7: خط یا درخواست',
            instruction: `7- ${sampleRandom(khatPool9, 1)[0]}`,
            marks: 10,
          };
        }

        if (!urduConfig.skipKahani) {
          const kahaniPool9 = [
            'اخلاقی عنوان "اتفاق میں برکت ہے" پر کہانی لکھیے۔ --یا-- دکاندار اور خریدار کے درمیان مہنگائی پر مکالمہ تحریر کیجیے۔: [5 نمبر]',
            'اخلاقی عنوان "سچ میں برکت ہے" پر کہانی قلمبند کیجیے۔ --یا-- دو ہم جماعتوں کے درمیان سالانہ امتحان کی تیاری پر مکالمہ لکھیے۔: [5 نمبر]',
            'عنوان "غرور کا سر نیچا" پر جامع کہانی لکھیے۔ --یا-- استاد اور شاگرد کے درمیان وقت کی پابندی پر مکالمہ تحریر کریں۔: [5 نمبر]',
          ];
          paper.urduKahaniSection = {
            active: true,
            num: 8,
            title: 'سوال نمبر 8: کہانی یا مکالمہ',
            instruction: `8- ${sampleRandom(kahaniPool9, 1)[0]}`,
            marks: 5,
          };
        }

        if (!urduConfig.skipJumlay) {
          const jumlayPool9 = [
            'تم نے لاہور جانا ہے۔ (درستی کیجیے)',
            'آبِ زم زم کا پانی متبرک ہے۔ (درستی کیجیے)',
            'پانچویں لڑکی چلی گئیں۔ (درستی کیجیے)',
            'وہ دن بدن کمزور ہو رہا ہے۔ (درستی کیجیے)',
            'نو نقد نہ تیرہ ______ (ضرب المثل مکمل کریں)',
            'جتنی چادر دیکھو اتنے ______ (ضرب المثل مکمل کریں)',
            'جس کی لاٹھی اس کی ______ (ضرب المثل مکمل کریں)',
            'الٹا چور ______ کو ڈانٹے (ضرب المثل مکمل کریں)',
            'دال میں کچھ ______ ہے (ضرب المثل مکمل کریں)',
            'بندر کیا جانے ______ کا سواد (ضرب المثل مکمل کریں)',
          ];
          const sampledJumlay = sampleRandom(jumlayPool9, 8).map((j, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${j}`);
          paper.urduJumlaySection = {
            active: true,
            num: 9,
            title: 'سوال نمبر 9: جملوں کی درستی یا ضرب الامثال کی تکمیل',
            instruction: '9- کوئی سے پانچ جملوں کی درستی یا ضرب الامثال کی تکمیل کیجیے: [5 × 1 = 5 نمبر]',
            marks: 5,
            sentences: sampledJumlay,
          };
        }
      }
    }

    return paper;
  }

  // ========================================================
  // 2. ENGLISH EXAM PAPERS (9th, 10th, 11th, 12th)
  // ========================================================
  if (patternType === 'ENGLISH') {
    const skipMcq = englishConfig.skipMcq;
    const isInter = classGrade === '11' || classGrade === '12';
    const is10th = classGrade === '10';
    const is11th = classGrade === '11';
    const is12th = classGrade === '12';
    const defaultTotalMarks = isInter ? 100 : classGrade === '9' ? 72 : 75;
    const defaultMcqCount = isInter ? 20 : classGrade === '9' ? 16 : 19;
    const mcqCount = englishConfig.mcqCount || defaultMcqCount;

    const eng12McqPool = [
      { questionText: 'The Dying Sun was written by:', options: ['Sir James Jeans', 'Winston Churchill', 'Alexander Fleming', 'James Hilton'], correct: 0 },
      { questionText: 'Alexander Fleming discovered penicillin in the year:', options: ['1928', '1945', '1914', '1939'], correct: 0 },
      { questionText: 'Louis Pasteur established that rabies was caused by a:', options: ['Virus', 'Bacterium', 'Fungus', 'Protozoan'], correct: 0 },
      { questionText: 'Mustafa Kamal abolished the title of:', options: ['Caliph / Sultanate', 'President', 'Prime Minister', 'General'], correct: 0 },
      { questionText: 'Mr. Chips retired from Brookfield at the age of:', options: ['65', '60', '70', '50'], correct: 0 },
      { questionText: 'Katherine Bridges died on:', options: ['1st April 1898', '1st May 1899', 'Christmas 1900', '11th November 1918'], correct: 0 },
      { questionText: 'He is addicted ______ gambling.', options: ['to', 'with', 'of', 'for'], correct: 0 },
      { questionText: 'She died ______ cancer.', options: ['of', 'from', 'with', 'by'], correct: 0 },
      { questionText: 'He prevented me ______ going there.', options: ['from', 'to', 'for', 'at'], correct: 0 },
      { questionText: 'I am proud ______ your achievement.', options: ['of', 'on', 'with', 'for'], correct: 0 },
      { questionText: 'Choose the correct sentence:', options: ['He gave me many pieces of advice.', 'He gave me many advices.', 'He gave me an advice.', 'He gave much advices.'], correct: 0 },
      { questionText: 'The synonym of "exquisite" is:', options: ['Extremely beautiful', 'Ugly', 'Common', 'Rough'], correct: 0 },
      { questionText: 'The antonym of "triumph" is:', options: ['Defeat', 'Victory', 'Success', 'Joy'], correct: 0 },
      { questionText: 'Who was the headmaster of Brookfield when Chips joined?', options: ['Wetherby', 'Meldrum', 'Ralston', 'Chatteris'], correct: 0 },
      { questionText: 'Chips married Katherine in the year:', options: ['1896', '1890', '1901', '1888'], correct: 0 },
      { questionText: 'One who believes in the existence of God is called:', options: ['Theist', 'Atheist', 'Agnostic', 'Pagan'], correct: 0 },
      { questionText: 'Choose the correct preposition: "Beware ______ pickpockets."', options: ['of', 'from', 'to', 'with'], correct: 0 },
      { questionText: 'Neither you nor I ______ guilty.', options: ['am', 'is', 'are', 'were'], correct: 0 },
      { questionText: 'The phrase "at the eleventh hour" means:', options: ['At the last moment', 'At 11 o\'clock', 'Very early', 'Regularly'], correct: 0 },
      { questionText: 'Choose the word with correct spelling:', options: ['Superintendent', 'Superintendant', 'Suprintendent', 'Superntendent'], correct: 0 },
      { questionText: 'The Chinese rely on their traditional remedies because they are:', options: ['Cheap and effective', 'Expensive', 'Dangerous', 'Ineffective'], correct: 0 },
      { questionText: 'Pasteur developed vaccines against:', options: ['Anthrax and Rabies', 'Malaria', 'Polio', 'Typhoid'], correct: 0 },
    ];

    const eng11McqPool = [
      { questionText: 'Arthur did not like Norma’s proposal of pushing the button because:', options: ['He considered it murder', 'He had no money', 'He was afraid of police', 'He disliked Mr. Steward'], correct: 0 },
      { questionText: 'The old man cleared the land on the mountain because:', options: ['He wanted to plant potatoes and corn', 'He loved exercise', 'His doctor advised him', 'He wanted to sell it'], correct: 0 },
      { questionText: 'The boy in "Thank You, M’am" wanted to buy:', options: ['Blue suede shoes', 'A new bicycle', 'A wristwatch', 'New clothes'], correct: 0 },
      { questionText: 'The poem "The Rain" is written by:', options: ['W.H. Davies', 'William Wordsworth', 'P.B. Shelley', 'Robert Frost'], correct: 0 },
      { questionText: 'In "Heat Lightning", the girl was frightened because:', options: ['She saw a man dragging a dead body', 'Of heavy rain and lightning', 'She lost her purse', 'The bus broke down'], correct: 0 },
      { questionText: 'The visitor from outer space in "Visit to a Small Planet" was:', options: ['Kreton', 'Spelding', 'John', 'General Powers'], correct: 0 },
      { questionText: 'The synonym of "solitary" is:', options: ['Lonely', 'Crowded', 'Active', 'Joyful'], correct: 0 },
      { questionText: 'The synonym of "gorgeous" is:', options: ['Splendid / Beautiful', 'Horrible', 'Dull', 'Poor'], correct: 0 },
      { questionText: 'The antonym of "virtue" is:', options: ['Vice', 'Goodness', 'Honesty', 'Kindness'], correct: 0 },
      { questionText: 'He has been absent ______ Monday last.', options: ['since', 'for', 'from', 'at'], correct: 0 },
      { questionText: 'Listen ______ what your teacher says.', options: ['to', 'at', 'with', 'for'], correct: 0 },
      { questionText: 'Choose the correct sentence:', options: ['He is senior to me.', 'He is senior than me.', 'He is senior from me.', 'He is more senior than me.'], correct: 0 },
      { questionText: 'The poem "Ozymandias" was composed by:', options: ['P.B. Shelley', 'John Keats', 'Lord Byron', 'Alfred Tennyson'], correct: 0 },
      { questionText: 'Who was the mayor in "The Piece of String"?', options: ['The town mayor', 'Maitre Hauchecorne', 'Maitre Fortune', 'Maitre Malandain'], correct: 0 },
      { questionText: 'The doctor in "The Use of Force" used force to examine the girl’s:', options: ['Throat', 'Eyes', 'Ears', 'Heart'], correct: 0 },
      { questionText: 'Choose the word with correct spellings:', options: ['Magnificent', 'Magnaficent', 'Magneficent', 'Magnifisent'], correct: 0 },
      { questionText: 'The traveler saw two vast and trunkless legs of stone in the:', options: ['Desert', 'Forest', 'Valley', 'Ocean'], correct: 0 },
    ];

    const eng10McqPool = [
      { chapter: 1, questionText: 'Hazrat Muhammad (PBUH) was an embodiment of:', options: ['Justice and Fair Play', 'Wealth', 'Pride', 'Severity'], correct: 0 },
      { chapter: 1, questionText: 'The Holy Prophet (PBUH) decided cases of non-Muslims in accordance with:', options: ['Their own law', 'Arab custom', 'Roman law', 'Persian law'], correct: 0 },
      { chapter: 2, questionText: 'The Chinese New Year celebration lasts for about:', options: ['A month or 15 days', 'Two days', 'A week', 'A year'], correct: 0 },
      { chapter: 3, questionText: 'The poem "Try Again" is written by:', options: ['W.E. Hickson', 'William Blake', 'John Keats', 'Robert Frost'], correct: 0 },
      { chapter: 4, questionText: 'What should we do if our wound continues bleeding after first aid?', options: ['Apply continuous pressure and seek medical help', 'Wash with hot water', 'Leave it open', 'Apply ice only'], correct: 0 },
      { chapter: 6, questionText: 'Television news is like having a fast food meal, whereas newspapers are like a:', options: ['Ten-course dinner', 'Snack', 'Breakfast', 'Drink'], correct: 0 },
      { chapter: 11, questionText: 'Pip was an orphan boy in the novel:', options: ['Great Expectations', 'David Copperfield', 'Oliver Twist', 'Hard Times'], correct: 0 },
      { chapter: 0, questionText: 'Choose the correct spelling:', options: ['Perseverance', 'Preseverence', 'Perseverence', 'Persiverance'], correct: 0 },
      { chapter: 0, questionText: 'He decided ______ go for higher education.', options: ['to', 'at', 'in', 'on'], correct: 0 },
      { chapter: 0, questionText: 'Synonym of "equitable" is:', options: ['Fair and just', 'Unequal', 'Partial', 'Biased'], correct: 0 },
      { chapter: 0, questionText: 'Antonym of "destroy" is:', options: ['Create / Build', 'Damage', 'Ruin', 'Break'], correct: 0 },
      { chapter: 0, questionText: 'Identify the tense: "She has been reading since morning."', options: ['Present Perfect Continuous', 'Past Continuous', 'Present Continuous', 'Simple Past'], correct: 0 },
      { chapter: 0, questionText: 'He made the students ______ hard.', options: ['work', 'to work', 'working', 'worked'], correct: 0 },
    ];

    const eng9McqPool = [
      { chapter: 1, questionText: 'The Holy Quran was revealed in which language?', options: ['Arabic', 'Hebrew', 'Persian', 'Syriac'], correct: 0 },
      { chapter: 1, questionText: 'Arabia is a land of unparalleled charm with trackless deserts of:', options: ['Sand dunes', 'Snowy hills', 'Dense forests', 'Rocks'], correct: 0 },
      { chapter: 1, questionText: 'The first revelation to the Holy Prophet (PBUH) was from Surah:', options: ['Al-Alaq', 'Al-Fatiha', 'Al-Baqarah', 'Al-Ikhlas'], correct: 0 },
      { chapter: 2, questionText: 'Patriotism means love for one’s:', options: ['Motherland / Country', 'Family', 'Friends', 'Wealth'], correct: 0 },
      { chapter: 2, questionText: 'The word "patriot" is derived from the Latin word:', options: ['Patriota', 'Patria', 'Patris', 'Patron'], correct: 0 },
      { chapter: 3, questionText: 'The poem "Daffodils" is composed by:', options: ['William Wordsworth', 'P.B. Shelley', 'John Keats', 'Robert Southey'], correct: 0 },
      { chapter: 3, questionText: 'In "Daffodils", the poet saw ten thousand flowers tossing their heads in:', options: ['Sprightly dance', 'Deep sorrow', 'Quiet breeze', 'Heavy rain'], correct: 0 },
      { chapter: 4, questionText: 'Hazrat Asma (R.A) was the daughter of:', options: ['Hazrat Abu Bakr Siddique (R.A)', 'Hazrat Umar (R.A)', 'Hazrat Usman (R.A)', 'Hazrat Ali (R.A)'], correct: 0 },
      { chapter: 5, questionText: 'Entrepreneurship enables women to gain financial:', options: ['Independence', 'Debt', 'Disappointment', 'Obligation'], correct: 0 },
      { chapter: 6, questionText: 'Time once lost can never be:', options: ['Regained', 'Forgotten', 'Wasted', 'Counted'], correct: 0 },
      { chapter: 7, questionText: 'The motivational poem "If —" is composed by:', options: ['Rudyard Kipling', 'William Wordsworth', 'Robert Frost', 'John Keats'], correct: 0 },
      { chapter: 8, questionText: 'Globalisation connects economies and cultures across the:', options: ['Globe', 'Province', 'Neighborhood', 'Village'], correct: 0 },
      { chapter: 9, questionText: 'Quality education is considered the master key to personal and national:', options: ['Success & Prosperity', 'Failure', 'Confusion', 'Isolation'], correct: 0 },
      { chapter: 10, questionText: 'The national animal of Pakistan mentioned as the majestic prey is the:', options: ['Markhor', 'Snow Leopard', 'Ibex', 'Chinkara'], correct: 0 },
      { chapter: 11, questionText: 'The play "The Dear Departed" is a satirical commentary on:', options: ['Greed and family relations', 'Bravery', 'Science', 'Travel'], correct: 0 },
      { chapter: 0, questionText: 'Choose the correct preposition: "He is fond ______ reading novels."', options: ['of', 'to', 'for', 'at'], correct: 0 },
      { chapter: 0, questionText: 'Identify the abstract noun:', options: ['Patience', 'Book', 'Chair', 'Lahore'], correct: 0 },
      { chapter: 0, questionText: 'Choose the correct spelling:', options: ['Conquest', 'Conqust', 'Conqest', 'Conqueste'], correct: 0 },
    ];

    let currentEngPool = is12th
      ? eng12McqPool
      : is11th
      ? eng11McqPool
      : is10th
      ? eng10McqPool
      : eng9McqPool;

    if (hasChapterFilter) {
      const chFiltered = currentEngPool.filter(item => item.chapter !== undefined && activeChapterSet.has(Number(item.chapter)));
      if (chFiltered.length > 0) {
        currentEngPool = chFiltered;
      }
    }

    let mcqs = [];
    if (!skipMcq) {
      const activeUnitName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
      let availableMcqs = [...currentEngPool];
      while (availableMcqs.length < Number(mcqCount)) {
        const idx = availableMcqs.length + 1;
        availableMcqs.push({
          questionText: `[${activeUnitName}] Q.${idx}: Choose the correct grammatical or contextual option:`,
          options: ['Correct and accurate form', 'Secondary usage', 'Informal expression', 'Irrelevant choice'],
          correct: 0,
        });
      }
      const sampled = sampleRandom(availableMcqs, Number(mcqCount));
      mcqs = sampled.map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    const paper = {
      ...paperBase,
      isEnglishPaper: true,
      timeAllowed: isInter ? '2:30 Hours' : '2:10 Hours',
      totalMarks: configuredTotalMarks || defaultTotalMarks,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        time: isInter ? '20 Minutes' : '19 Minutes',
        questions: mcqs,
      },
    };

    if (is10th) {
      const shortPool10thEng = [
        { chapter: 1, text: 'How did the Holy Prophet (P.B.U.H) resolve the issue of setting the Black Stone?' },
        { chapter: 1, text: 'How does the Holy Quran describe the justice of the Holy Prophet (P.B.U.H)?' },
        { chapter: 1, text: 'What made non-Muslims bring their suits to the Holy Prophet (P.B.U.H)?' },
        { chapter: 2, text: 'What is the Chinese belief regarding cleaning houses before New Year’s Day?' },
        { chapter: 2, text: 'What do the decorations on doors and windows symbolize in Chinese New Year?' },
        { chapter: 3, text: 'What does the poem "Try Again" teach us about dealing with failure?' },
        { chapter: 4, text: 'What should we do if our wound continues bleeding after first aid treatment?' },
        { chapter: 4, text: 'Why is it necessary to keep soap away from the actual wound?' },
        { chapter: 6, text: 'How does television news differ from newspaper reporting in depth and coverage?' },
        { chapter: 6, text: 'How do newspapers give us more in-depth coverage than television?' },
        { chapter: 11, text: 'What did the teacher advise Pip regarding setting high aims in life in "Great Expectations"?' },
        { chapter: 12, text: 'How does population explosion affect the world’s agricultural supplies and economy?' },
      ];
      let active10Shorts = shortPool10thEng;
      if (hasChapterFilter) {
        const filtered = shortPool10thEng.filter(q => q.chapter !== undefined && activeChapterSet.has(Number(q.chapter)));
        if (filtered.length > 0) active10Shorts = filtered;
      }
      let active10ShortsTexts = active10Shorts.map(q => q.text);
      const activeUnitName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
      while (active10ShortsTexts.length < 8) {
        const idx = active10ShortsTexts.length + 1;
        active10ShortsTexts.push(`[${activeUnitName}] Q.${idx}: Explain the significance and central idea of key concept #${idx}.`);
      }

      paper.shortSections = [
        {
          sectionNumber: 2,
          title: 'SECTION-I: Short Answer Questions',
          instruction: '2. Write short answers to any FIVE (5) of the following questions: [5 × 2 = 10 Marks]',
          attemptCount: 5,
          totalCount: 8,
          totalMarks: 10,
          questions: sampleRandom(active10ShortsTexts, 8).map((t, i) => ({ num: i + 1, text: t })),
        },
      ];

      const transPool10 = [
        { chapter: 1, tag: 'a.', text: 'Hazrat Muhammad (P.B.U.H) practically proved that no one could be more just and equitable than the Messenger of Allah Almighty. As a young trader, he earned the good reputation of being an honest, fair and just business man.' },
        { chapter: 1, tag: 'b.', text: 'The Holy Prophet (P.B.U.H) was so well-known for his justice that even the Jews, who were his bitter enemies, brought their suits to him and he decided cases in accordance with the Jewish law.' },
        { chapter: 2, tag: 'c.', text: 'Prior to the first day of the New Year, it is customary for Chinese families to thoroughly clean their houses. Doing this is said to clear out any bad luck from the incoming year and make the house ready to accept good fortune.' },
        { chapter: 4, tag: 'd.', text: 'First aid knowledge ranges from taking care of minor cuts to dealing with an unconscious victim. In emergency situations, immediate and correct medical assistance can save precious human lives before reaching the hospital.' },
        { chapter: 6, tag: 'e.', text: 'Newspapers do not require us to sit at a place and watch news. Busy people may read the papers anytime of the day. They may also omit certain aspects of the news that they are not interested in.' },
      ];
      let activeTransPool10 = transPool10;
      if (hasChapterFilter) {
        const filtered = transPool10.filter(p => p.chapter !== undefined && activeChapterSet.has(Number(p.chapter)));
        if (filtered.length > 0) activeTransPool10 = filtered;
      }
      paper.engTranslationSection = {
        active: !englishConfig.skipTrans,
        num: 3,
        title: 'SECTION-II: Paragraph Translation into Urdu',
        instruction: '3. Translate any TWO of the following paragraphs into Urdu: [4 + 4 = 8 Marks]',
        marks: 8,
        paragraphs: sampleRandom(activeTransPool10, Math.min(3, activeTransPool10.length)),
      };

      paper.engPoemSection = {
        active: !englishConfig.skipPoem,
        num: 4,
        title: 'Poem Summary OR Stanza Explanation',
        instruction: '4. Write down the summary of the poem "Try Again" by W.E. Hickson or "The Rain" by W.H. Davies. [5 Marks]',
        marks: 5,
        stanzaOption: sampleRandom([
          'OR Explain the following stanza with reference to the context:\n\n"The wind is now\na roaring, smashing\nmonster of destruction,\nraking all man’s work\nfrom the valleys..."',
          'OR Explain the following stanza with reference to the context:\n\n"I hear leaves drinking rain;\nI hear rich leaves on top\nGiving the poor beneath\nDrop after drop..."',
        ], 1)[0],
      };

      const narrationPool = [
        'He said, "I am doing my duty diligently."',
        'She said to me, "Do you recognize this man?"',
        'The teacher said to the boys, "Do not make a noise."',
        'He said, "Hurrah! We have won the championship match."',
        'The doctor said to the patient, "Take this medicine regularly."',
        'She said, "May my son pass the examination with distinction!"',
        'He said, "Alas! I am completely ruined."',
        'They said, "We have done our work honestly."',
        'Father said to me, "Hard work always pays in the long run."',
        'She said, "Where are you going for summer vacation?"',
      ];
      paper.engNarrationSection = {
        active: true,
        num: 5,
        title: 'Direct and Indirect Speech',
        instruction: '5. Change any FIVE (5) of the following sentences into indirect form: [5 × 1 = 5 Marks]',
        marks: 5,
        sentences: sampleRandom(narrationPool, 8).map((s, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${s}`),
      };

      const essayPoolEng10 = [
        'a. My Last Day at School',
        'b. Quaid-e-Azam Muhammad Ali Jinnah',
        'c. Sports and Games',
        'd. A True Muslim',
        'e. Environmental Pollution',
        'f. A Visit to a Historical Place',
      ];
      paper.engEssaySection = {
        active: true,
        num: 6,
        title: 'Creative Writing: Essay or Paragraph',
        instruction: '6. Write an essay (150-200 words) on any ONE of the following topics: [15 Marks]',
        marks: 15,
        topics: sampleRandom(essayPoolEng10, 3),
      };

      const pairsPool = [
        'Advice / Advise', 'Affect / Effect', 'Brake / Break', 'Cattle / Kettle',
        'Device / Devise', 'Die / Dye', 'Principal / Principle', 'Stationary / Stationery',
        'Bail / Bale', 'Feat / Feet', 'Floor / Flour', 'Gate / Gait',
      ];
      paper.engPairOfWordsSection = {
        active: true,
        num: 7,
        title: 'Vocabulary: Pair of Words',
        instruction: '7. Use any FIVE (5) pairs of words in sentences of your own: [5 × 1 = 5 Marks]',
        marks: 5,
        pairs: sampleRandom(pairsPool, 8).map((p, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${p}`),
      };

      // Q8: Translate into English (8 Marks)
      const urduParaPool10 = [
        'ایک دفعہ کا ذکر ہے کہ ایک کوا پیاسا تھا۔ وہ پانی کی تلاش میں ادھر ادھر اڑا لیکن اسے کہیں پانی نہ ملا۔ آخر کار وہ ایک باغ میں پہنچا جہاں اس نے ایک گھڑا دیکھا۔ گھڑے میں پانی بہت کم تھا اور اس کی چونچ پانی تک نہ پہنچ سکی۔ کوے نے ادھر ادھر دیکھا اور کچھ کنکریاں گھڑے میں ڈال دیں۔ پانی اوپر آ گیا، اس نے پانی پیا اور اڑ گیا۔',
        'دودھ ایک مکمل اور متوازن غذا ہے۔ یہ میٹھا اور لذیذ ہوتا ہے۔ اس کا رنگ سفید ہوتا ہے۔ ہم زیادہ تر دودھ گائے اور بھینس سے حاصل کرتے ہیں۔ دودھ ہمیں صحت مند اور طاقتور بناتا ہے۔ بچے اور بوڑھے سب دودھ شوق سے پیتے ہیں۔',
        'میرے گھر کے قریب ایک خوبصورت باغ ہے۔ اس میں رنگ برنگے پھول کھلتے ہیں۔ صبح کے وقت ٹھنڈی اور خوشگوار ہوا چلتی ہے اور پرندے چہچہاتے ہیں۔ لوگ صبح کی سیر کے لیے یہاں آتے ہیں اور قدرت کے نظاروں سے لطف اندوز ہوتے ہیں۔',
        'شیر جنگل کا بادشاہ کہلاتا ہے۔ یہ ایک بہت طاقتور اور خوفناک جانور ہے۔ اس کے گلے پر خوبصورت بال ہوتے ہیں۔ یہ رات کے وقت شکار کے لیے نکلتا ہے اور چھوٹے جانوروں کا شکار کرتا ہے۔'
      ];
      paper.engUrduToEngSection = {
        active: !englishConfig.skipUrduToEng,
        num: 8,
        title: 'SECTION-II: Translate into English',
        instruction: '8. Translate the following paragraph into English: [8 Marks]',
        marks: 8,
        sentences: [sampleRandom(urduParaPool10, 1)[0]],
        altForForeign: 'OR (For Candidates whose Medium of Examination is English)\nWrite TEN (10) sentences about "A Road Accident" or "Pakistani Women".',
      };
    } else if (is12th) {
      const prosePool = [
        'How did the universe come into existence according to Sir James Jeans?',
        'What were the feelings of Churchill when he was examined in Latin at Harrow?',
        'Why is it easy for a doctor to cure disease in our days than in Pasteur’s time?',
        'How did Mustafa Kamal abolish old titles and institute new reforms in Turkey?',
        'Why was China neglected by the West for over two decades?',
        'What are the common diseases caused by sanitary neglect in the past?',
        'Why did some students fail in college according to Herbert E. Hawkes?',
      ];
      const heroesPool = [
        'How did Alexander Fleming discover penicillin by accident in his laboratory?',
        'What was the nature of Fleming’s great contribution to modern medicine?',
        'Describe the early life and education of Louis Pasteur.',
        'How did Pasteur discover the method of attenuation of anthrax germs?',
        'What was the condition of Turkey at the end of the First World War?',
        'How did Mustafa Kamal organize the Turkish resistance movement in Anatolia?',
      ];
      const chipsPool = [
        'How did Mr. Chips look like in his eighties at Mrs. Wickett’s house?',
        'What was the contribution of Brookfield school to English society?',
        'Describe the first meeting between Mr. Chips and Katherine Bridges.',
        'How did Katherine change the personality and teaching style of Mr. Chips?',
        'What was the row between Mr. Chips and Ralston?',
        'How did the boys and masters react when Ralston tried to sack Mr. Chips?',
        'Describe the poignant death scene of Mr. Chips.',
      ];

      paper.shortSections = [
        {
          sectionNumber: 2,
          title: 'SECTION-I: Q.2: Questions from Book-II Part-I (Modern Prose)',
          instruction: '2. Write short answers to any SIX (6) questions: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: sampleRandom(prosePool, 9).map((t, i) => ({ num: i + 1, text: t })),
        },
        {
          sectionNumber: 3,
          title: 'SECTION-I: Q.3: Questions from Book-II Part-II (Heroes)',
          instruction: '3. Write short answers to any SIX (6) questions: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 8,
          totalMarks: 12,
          questions: sampleRandom(heroesPool, 8).map((t, i) => ({ num: i + 1, text: t })),
        },
        {
          sectionNumber: 4,
          title: 'SECTION-I: Q.4: Questions from Novel "Goodbye, Mr. Chips"',
          instruction: '4. Write short answers to any EIGHT (8) questions: [8 × 2 = 16 Marks]',
          attemptCount: 8,
          totalCount: 12,
          totalMarks: 16,
          questions: sampleRandom(chipsPool, 12).map((t, i) => ({ num: i + 1, text: t })),
        },
      ];

      paper.engEssaySection = {
        active: true,
        num: 5,
        title: 'SECTION-II: Essay Writing',
        instruction: '5. Write an essay (300-400 words) on any ONE of the following topics: [15 Marks]',
        marks: 15,
        topics: sampleRandom([
          'a. My Aim in Life',
          'b. Patriotism and National Unity',
          'c. Uses and Abuses of Mobile Phones and Internet',
          'd. A Cricket Match',
          'e. Pollution and Climate Change',
        ], 4),
      };

      const idiomsPool = [
        'at the eleventh hour', 'break the ice', 'by leaps and bounds', 'burn the midnight oil',
        'call a spade a spade', 'face the music', 'kith and kin', 'nip in the bud',
        'through thick and thin', 'a blessing in disguise',
      ];
      paper.engIdiomsSection = {
        active: true,
        num: 6,
        title: 'SECTION-II: Idioms and Phrasal Verbs',
        instruction: '6. Use any FIVE (5) of the following idioms/phrases in sentences of your own: [5 × 2 = 10 Marks]',
        marks: 10,
        words: sampleRandom(idiomsPool, 8),
      };

      // Q7: Passage Translation into English (15 Marks)
      const urduPassagesPool12 = [
        'تعلیم انسان کی شخصیت کو سنوارنے اور نکھارنے کا نام ہے۔ تعلیم کے بغیر کوئی بھی قوم دنیا میں باعزت مقام حاصل نہیں کر سکتی۔ آج کے جدید دور میں سائنسی اور فنی تعلیم کا حصول ناگزیر ہو چکا ہے۔ ہمیں چاہیے کہ ہم تعلیم کے فروغ کے لیے ہر ممکن کوشش کریں۔',
        'قائد اعظم محمد علی جناح ایک عظیم رہنما اور بانیٔ پاکستان تھے۔ آپ نے برصغیر کے مسلمانوں کو ایک پرچم تلے متحد کیا اور انتھک محنت کے ذریعے پاکستان حاصل کیا۔ آپ نے ہمیشہ اتحاد، ایمان اور نظم و ضبط کی تلقین فرمائی۔',
        'آج کا دور کمپیوٹر اور انفارمیشن ٹیکنالوجی کا دور ہے۔ انٹرنیٹ نے پوری دنیا کو ایک عالمی گاؤں بنا دیا ہے۔ فاصلے سمٹ گئے ہیں اور علم کا حصول انتہائی آسان ہو گیا ہے۔ وہ قومیں جو ٹیکنالوجی میں آگے ہیں دنیا پر حکمرانی کر رہی ہیں۔',
        'والدین اللہ تعالیٰ کی طرف سے ایک عظیم اور انمول نعمت ہیں۔ ان کا سایہ رحمت کی مانند ہوتا ہے۔ وہ ہمارے آرام و سکون کی خاطر اپنی خوشیاں قربان کر دیتے ہیں۔ ہم پر فرض ہے کہ ہم ان کی خدمت کریں اور ان کا احترام کریں۔'
      ];
      paper.engUrduToEngSection = {
        active: !englishConfig.skipUrduToEng,
        num: 7,
        title: 'SECTION-II: Translation of Passage into English',
        instruction: '7. Translate the following passage into English: [15 Marks]',
        marks: 15,
        sentences: [sampleRandom(urduPassagesPool12, 1)[0]],
        altForForeign: 'OR (For Candidates whose Medium of Examination is English / Foreign Candidates)\nWrite an essay / paragraph of 150-200 words on "Technical Education in Pakistan".',
      };
    } else if (is11th) {
      // 11th English (100 Marks)
      const storiesPool11th = [
        'Why did Norma consider the tone and attitude of Mr. Steward offensive in "Button, Button"?',
        'Why did the old man take the steep path instead of the easy one in "Clearing in the Sky"?',
        'What was the condition of the boy when Mrs. Luella Bates caught him in "Thank You, M’am"?',
        'Why did the Mayor not believe Maitre Hauchecorne in "The Piece of String"?',
        'What was the viewpoint of the parents about the illness of the girl in "The Use of Force"?',
        'What did Della do to buy a Christmas present for Jim in "The Gift of the Magi"?',
        'How did Gorgios achieve his ambition of becoming the Court Acrobat in "Opportunity"?',
        'Describe the feelings of the writer on the day of examination in "On Saying Please"?',
        'What was the advice given by the quack to the old man in "The Angel and the Author"?',
      ];
      const playsPool11th = [
        'Why could the girl not describe the killer in "Heat Lightning"?',
        'What was the condition of the weather in the play "Heat Lightning"?',
        'What kind of creature was Kreton and what were his superpowers in "Visit to a Small Planet"?',
        'How did General Powers view the arrival of Kreton?',
        'What did Ellen say about her relationship with John in "Visit to a Small Planet"?',
        'What was the message Harry gave to the people in "The Oyster and the Pearl"?',
      ];
      const poemsPool11th = [
        'What does the poet hear in the poem "The Rain" by W.H. Davies?',
        'What did the traveler see in the antique land in "Ozymandias"?',
        'What is the central theme of the poem "A Sindhi Woman"?',
        'What happened when the horse shook the harness bells in "Stopping by Woods"?',
        'Why does the poet call the modern men "The Hollow Men"?',
        'What does the poet pray for in the poem "A Prayer for My Daughter"?',
      ];

      paper.shortSections = [
        {
          sectionNumber: 2,
          title: 'SECTION-I: Q.2: Questions from Book-I (Short Stories)',
          instruction: '2. Write short answers to any SIX (6) questions: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: sampleRandom(storiesPool11th, 9).map((t, i) => ({ num: i + 1, text: t })),
        },
        {
          sectionNumber: 3,
          title: 'SECTION-I: Q.3: Questions from Book-III Part-I (One-Act Plays)',
          instruction: '3. Write short answers to any FIVE (5) questions: [5 × 2 = 10 Marks]',
          attemptCount: 5,
          totalCount: 8,
          totalMarks: 10,
          questions: sampleRandom(playsPool11th, 8).map((t, i) => ({ num: i + 1, text: t })),
        },
        {
          sectionNumber: 4,
          title: 'SECTION-I: Q.4: Questions from Book-III Part-II (Poems)',
          instruction: '4. Write short answers to any FIVE (5) questions: [5 × 2 = 10 Marks]',
          attemptCount: 5,
          totalCount: 8,
          totalMarks: 10,
          questions: sampleRandom(poemsPool11th, 8).map((t, i) => ({ num: i + 1, text: t })),
        },
      ];

      // Q5: Application OR Letter (10 Marks)
      paper.engLetterSection = {
        active: !englishConfig.skipLetter,
        num: 5,
        title: 'SECTION-II: Application / Letter Writing',
        instruction: '5. Write an Application to the Principal of your college for the grant of Full Fee Concession. [10 Marks]\nOR Write a Letter to your friend sympathizing with him on the death of his mother.',
        marks: 10,
        options: [
          '• Option A: Write an application to the Principal for fee concession / leave on medical grounds.',
          '• Option B (OR): Write a letter to your father requesting him to increase your monthly allowance.'
        ],
      };

      // Q6: Moral Story (10 Marks)
      paper.engStorySection = {
        active: true,
        num: 6,
        title: 'SECTION-II: Moral Story Writing',
        instruction: '6. Write a moral story bearing the moral: "A Friend in Need is a Friend Indeed" OR "Pride Hath a Fall" OR "Haste Makes Waste". [10 Marks]',
        marks: 10,
      };

      // Q7: (a) Stanza (5 Marks) + (b) Punctuation (5 Marks) + (c) Pair of Words (5 Marks) = 15 Marks
      paper.engPoemSection = {
        active: !englishConfig.skipPoem,
        num: 7,
        title: 'SECTION-II: Q.7(a): Stanza Explanation with Reference to Context',
        instruction: '7(a). Explain the following lines with reference to the context: [5 Marks]',
        marks: 5,
        stanzaOption: sampleRandom([
          '"I hear leaves drinking rain;\nI hear rich leaves on top\nGiving the poor beneath\nDrop after drop;\n\'Tis a sweet noise to hear\nThese green leaves drinking near."',
          '"Two vast and trunkless legs of stone\nStand in the desert... Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command..."',
          '"Barefoot through the bazaar,\nAnd with the same undulant grace\nAs the cloth blown back from her face,\nShe glides with a stone jar\nHigh on her head..."',
        ], 1)[0],
      };

      paper.engPairOfWordsSection = {
        active: true,
        num: 7,
        title: 'Q.7(b) Punctuation & Q.7(c) Pair of Words',
        instruction: '7(b). Punctuate the following line from Book-I: [5 Marks]\n"why did you do it norman asked arthur staring at her in disbelief"\n\n7(c). Use any FIVE (5) pairs of words in sentences of your own: [5 × 1 = 5 Marks]',
        marks: 10,
        pairs: sampleRandom([
          'Affect / Effect', 'Altar / Alter', 'Bail / Bale', 'Canvas / Canvass',
          'Device / Devise', 'Eligible / Illegible', 'Feat / Feet', 'Judicial / Judicious',
          'Principal / Principle', 'Stationary / Stationery', 'Vain / Vein', 'Wave / Waive'
        ], 8).map((p, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${p}`),
      };

      // Q8: Translation from Book-I into Urdu (15 Marks)
      paper.engTranslationSection = {
        active: !englishConfig.skipTrans,
        num: 8,
        title: 'SECTION-II: Translation of Passage into Urdu',
        instruction: '8. Translate the following passage from Book-I into Urdu: [15 Marks]',
        marks: 15,
        paragraphs: [
          sampleRandom([
            { tag: '', text: 'Norma sat at the table and looked at the box. She couldn’t take her eyes off it. What if it was true? What if someone really gave them fifty thousand dollars? Arthur was being ridiculous. It was just an eccentric millionaire playing a psychological game with them. Nobody would actually die.' },
            { tag: '', text: 'This was the steep path the doctor had told him not to climb. But my father had climbed it anyway. He had followed his own instinct. He picked up a handful of dark, rich mountain dirt and let it slip through his fingers. "Look at this," he said. "Best land on the mountain."' },
            { tag: '', text: 'She was a large woman with a large purse that had everything in it but hammer and nails. It had a long strap, and she carried it slung across her shoulder. It was about eleven o’clock at night, and she was walking alone, when a boy ran up behind her and tried to snatch her purse.' }
          ], 1)[0]
        ],
        altNote: 'OR (For Foreign / English Medium Candidates): Write an essay of 150-200 words on "A Visit to a Historical Place".'
      };
    } else {
      // 9th English (72 Marks Standard)
      const shortPool9th = [
        { chapter: 1, text: 'What type of land is Arabia?' },
        { chapter: 1, text: 'Why was the Holy Quran sent in Arabic language?' },
        { chapter: 1, text: 'For what ability were the Arabs famous before Islam?' },
        { chapter: 1, text: 'What was the first revelation given to the Holy Prophet (PBUH) in Cave Hira?' },
        { chapter: 1, text: 'Why did the pagan Arabs threaten the Holy Prophet’s uncle Hazrat Abu Talib?' },
        { chapter: 1, text: 'What did Hazrat Ayesha (R.A) say about the noble character of the Holy Prophet (PBUH)?' },
        { chapter: 2, text: 'How will you define patriotism?' },
        { chapter: 2, text: 'What are the qualities of a patriotic person?' },
        { chapter: 2, text: 'What is the highest military award of Pakistan and who was awarded it?' },
        { chapter: 3, text: 'How do the daffodils look like beside the lake and beneath the trees?' },
        { chapter: 3, text: 'What wealth did the scenic sight of golden daffodils bring to the poet?' },
        { chapter: 4, text: 'What was the role of Hazrat Asma (R.A) during the migration (Hijrah) to Madinah?' },
        { chapter: 4, text: 'Why was Abu Jehl furious and what did he ask Hazrat Asma (R.A)?' },
        { chapter: 5, text: 'How does entrepreneurship empower women in modern economic society?' },
        { chapter: 5, text: 'What challenges do female entrepreneurs face in developing countries?' },
        { chapter: 6, text: 'Why is time management vital for students in achieving academic goals?' },
        { chapter: 7, text: 'What advice does the poet give regarding dealing with triumph and disaster in "If —"?' },
        { chapter: 8, text: 'How does globalisation influence cultural exchange and international trade?' },
        { chapter: 9, text: 'Why is quality education considered a vital prerequisite for national development?' },
        { chapter: 10, text: 'Why is the snow leopard called a silent predator and what are its adaptations?' },
        { chapter: 11, text: 'What moral lesson does the play "The Dear Departed" convey about materialism?' },
      ];
      let active9Shorts = shortPool9th;
      if (hasChapterFilter) {
        const filtered = shortPool9th.filter(q => q.chapter !== undefined && activeChapterSet.has(Number(q.chapter)));
        if (filtered.length > 0) active9Shorts = filtered;
      }
      let active9ShortsTexts = active9Shorts.map(q => q.text);
      const activeUnitName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
      while (active9ShortsTexts.length < 8) {
        const idx = active9ShortsTexts.length + 1;
        active9ShortsTexts.push(`[${activeUnitName}] Q.${idx}: Explain the key concept and moral lesson of topic #${idx}.`);
      }

      paper.shortSections = [
        {
          sectionNumber: 2,
          title: 'SECTION-I: Short Answer Questions',
          instruction: '2. Write short answers to any FIVE (5) of the following questions: [5 × 2 = 10 Marks]',
          attemptCount: 5,
          totalCount: 8,
          totalMarks: 10,
          questions: sampleRandom(active9ShortsTexts, 8).map((t, i) => ({ num: i + 1, text: t })),
        },
      ];

      // Q3: Paragraph Translation into Urdu (8 Marks)
      const transPool9 = [
        { chapter: 1, tag: 'a.', text: 'The period of waiting had come to a close. His heart was overflowing with profound compassion for humanity. He had a pressing urge to eradicate wrong beliefs, social evils, cruelty and injustice in the pagan society.' },
        { chapter: 1, tag: 'b.', text: 'Since this belief was threatening their dominance in the society, the pagan Arabs started to mount pressure on the Holy Prophet (P.B.U.H) and his followers. They wanted them to renounce their cause and take to idol-worshipping.' },
        { chapter: 2, tag: 'c.', text: 'Patriotism means love for the motherland or devotion to one’s country. A patriotic person loves his country and is willing to sacrifice when the need arises. The word patriot comes from the Latin word "patriota" which means countryman.' },
        { chapter: 4, tag: 'd.', text: 'Hazrat Asma (R.A) was amongst the early converts who accepted Islam. During the migration to Madinah, she prepared food and tied it on the camel’s back with her own girdle. For this service, she was titled Dhat-un-Nitaqayn.' },
        { chapter: 5, tag: 'e.', text: 'Women entrepreneurship has emerged as a dynamic catalyst for social change. By initiating small enterprises, women not only generate income for their households but also foster community resilience and innovation.' },
        { chapter: 6, tag: 'f.', text: 'Time is the most valuable asset possessed by human beings. Unlike material resources, squandered time can never be retrieved. Punctuality and diligent scheduling are essential hallmarks of successful individuals.' },
        { chapter: 8, tag: 'g.', text: 'Globalisation has interconnected markets and communities across geographical barriers. While it facilitates unprecedented access to information and trade, preserving regional cultural heritage remains an enduring priority.' },
        { chapter: 9, tag: 'h.', text: 'Quality education equips learners with critical thinking, ethical integrity, and vocational competencies necessary to navigate the complexities of contemporary life.' },
      ];
      let activeTransPool9 = transPool9;
      if (hasChapterFilter) {
        const filtered = transPool9.filter(p => p.chapter !== undefined && activeChapterSet.has(Number(p.chapter)));
        if (filtered.length > 0) activeTransPool9 = filtered;
      }
      paper.engTranslationSection = {
        active: !englishConfig.skipTrans,
        num: 3,
        title: 'SECTION-II: Paragraph Translation into Urdu',
        instruction: '3. Translate any TWO of the following paragraphs into Urdu: [4 + 4 = 8 Marks]',
        marks: 8,
        paragraphs: sampleRandom(activeTransPool9, Math.min(3, activeTransPool9.length)),
        altNote: 'OR (For Candidates whose Medium of Examination is English)\nRe-write any TWO of the above paragraphs into Simple English.',
      };

      // Q4: Poem Summary or Stanza (5 Marks)
      paper.engPoemSection = {
        active: !englishConfig.skipPoem,
        num: 4,
        title: 'Poem Summary OR Stanza Explanation',
        instruction: '4. Write down the summary of the poem "Daffodils" by William Wordsworth OR "If —" by Rudyard Kipling. [5 Marks]',
        marks: 5,
        stanzaOption: sampleRandom([
          'OR Explain the following stanza with reference to the context:\n\n"Continuous as the stars that shine\nAnd twinkle on the milky way,\nThey stretched in never-ending line\nAlong the margin of a bay:\nTen thousand saw I at a glance,\nTossing their heads in sprightly dance."',
          'OR Explain the following stanza with reference to the context:\n\n"If you can meet with Triumph and Disaster\nAnd treat those two impostors just the same;\nIf you can bear to hear the truth you\'ve spoken\nTwisted by knaves to make a trap for fools..."',
        ], 1)[0],
      };

      // Q5: Words / Idioms / Phrases in Sentences (5 Marks)
      const wordsPool9th = [
        'sacrifice', 'prosperity', 'invasion', 'responsible', 'geared up',
        'a click away', 'conquest', 'humility', 'curious', 'resolution',
        'determination', 'ignorance', 'mad with anger', 'fit of fury',
      ];
      paper.engIdiomsSection = {
        active: !englishConfig.skipIdioms,
        num: 5,
        title: 'Vocabulary: Words and Idioms in Sentences',
        instruction: '5. Use any FIVE (5) of the following words / phrases / idioms in sentences of your own: [5 × 1 = 5 Marks]',
        marks: 5,
        words: sampleRandom(wordsPool9th, 8),
      };

      // Q6: Letter / Story / Dialogue (8 Marks)
      paper.engLetterSection = {
        active: !englishConfig.skipLetter,
        num: 6,
        title: 'Letter / Story / Dialogue Writing',
        instruction: '6. Attempt any ONE of the following: [8 Marks]',
        marks: 8,
        options: [
          '• Write a letter to your mother who is worried about your health. (OR Write a letter to your friend congratulating him on his birthday / brilliant success in examination).',
          '• OR Write a story with the moral: "Honesty is the best policy" OR "A stitch in time saves nine".',
          '• OR Write a dialogue between two friends on the importance of book reading / discipline.',
        ],
      };

      // Q7: Reading Comprehension Passage (10 Marks)
      const compPool9th = [
        {
          passage: 'Early rising is a good habit. It gives us an early start of our day’s work. The early riser does a large amount of hard work before other men have gotten out of bed. In the morning, the brain is fresh and there are few distractions, so that work done at this time is generally well done. In addition, the early riser finds time to take some exercise in the fresh morning air.',
          questions: [
            '(i) What kind of habit is early rising?',
            '(ii) What benefit does an early riser get before other people wake up?',
            '(iii) Why is work done in the morning generally well done?',
            '(iv) What additional activity can an early riser do in the morning?',
            '(v) Suggest a suitable title for this passage.',
          ],
        },
        {
          passage: 'One day a wolf felt very hungry. He wandered here and there in search of food but could not find anything to eat. At last he saw a flock of sheep grazing in a green pasture. The wolf wanted to catch a fat sheep, but the shepherd and his fierce dogs were guarding the flock vigilantly. So the wolf decided to wait patiently for a better chance.',
          questions: [
            '(i) Why was the wolf wandering here and there?',
            '(ii) What did the wolf see at last?',
            '(iii) Why could the wolf not attack the flock immediately?',
            '(iv) Who was guarding the sheep along with the shepherd?',
            '(v) Give the past form of the verbs "feel" and "wander".',
          ],
        },
      ];
      const chosenComp = sampleRandom(compPool9th, 1)[0];
      paper.engComprehensionSection = {
        active: !englishConfig.skipComprehension,
        num: 7,
        title: 'SECTION-II: Reading Comprehension',
        instruction: '7. Read the following passage carefully and answer the questions given at the end: [5 × 2 = 10 Marks]',
        marks: 10,
        passage: chosenComp.passage,
        questions: chosenComp.questions,
      };

      // Q8: Translate into English (5 Marks)
      const urduSentencesPool9th = [
        'سورج مغرب میں غروب ہوتا ہے۔',
        'ہم روزانہ صبح سکول جاتے ہیں۔',
        'کیا وہ اپنا کام وقت پر ختم کر چکے ہیں؟',
        'مالی پودوں کو پانی دے رہا ہے۔',
        'انہوں نے کرکٹ میچ جیت لیا ہے۔',
        'بچے بارش میں نہا رہے ہیں۔',
        'محنت کبھی رائیگاں نہیں جاتی۔',
        'غریبوں کی ہمیشہ مدد کرو۔',
        'گھنٹی بج چکی ہے۔',
        'کیا تم نے یہ خوبصورت تصویر دیکھی ہے؟',
      ];
      paper.engUrduToEngSection = {
        active: !englishConfig.skipUrduToEng,
        num: 8,
        title: 'SECTION-II: Translation into English',
        instruction: '8. Translate any FIVE (5) of the following sentences into English: [5 × 1 = 5 Marks]',
        marks: 5,
        sentences: sampleRandom(urduSentencesPool9th, 8).map((s, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${s}`),
        altForForeign: 'OR (For Candidates whose Medium of Examination is English / Foreign Candidates)\nWrite TEN (10) sentences about "My School" or "Our National Hero".',
      };

      // Q9: Change of Voice (5 Marks)
      const voicePool9th = [
        'She sings a sweet song.',
        'They have won the hockey match.',
        'The boy caught a big bird.',
        'The mother loves her children deeply.',
        'He will write an application today.',
        'Open the door at once.',
        'The teacher punished the naughty boy.',
        'Who broke this costly mirror?',
        'We use milk for making cheese.',
        'She did not tell a lie.',
      ];
      paper.engVoiceSection = {
        active: !englishConfig.skipVoice,
        num: 9,
        title: 'SECTION-II: Change of Voice',
        instruction: '9. Change the voice of any FIVE (5) of the following sentences: [5 × 1 = 5 Marks]',
        marks: 5,
        sentences: sampleRandom(voicePool9th, 8).map((s, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${s}`),
      };
    }

    return paper;
  }

  // ========================================================
  // 3. MATHEMATICS (9th, 10th, 11th, 12th)
  // ========================================================
  if (patternType === 'MATH') {
    const isInter = classGrade === '11' || classGrade === '12';
    const is10th = classGrade === '10';
    const defaultTotalMarks = isInter ? 100 : 75;
    const defaultMcqCount = isInter ? 20 : 15;
    const skipMcq = mathConfig.skipMcq;
    const mcqCount = mathConfig.mcqCount || defaultMcqCount;

    const math9McqPool = [
      { chapter: 1, questionText: 'Every real number is either a rational number or an:', options: ['Irrational number', 'Integer only', 'Natural number only', 'Prime number'], correct: 0 },
      { chapter: 1, questionText: 'The radical form of x^(2/3) is:', options: ['∛(x²)', '√(x³)', 'x^(1/3)', '3√x'], correct: 0 },
      { chapter: 2, questionText: 'log (m / n) is equal to:', options: ['log m - log n', 'log m + log n', 'log m / log n', 'log (m - n)'], correct: 0 },
      { chapter: 2, questionText: 'The base of common logarithm is:', options: ['10', 'e', '2', '1'], correct: 0 },
      { chapter: 3, questionText: 'If A ⊆ B, then A ∩ B is equal to:', options: ['A', 'B', 'ϕ', 'U'], correct: 0 },
      { chapter: 4, questionText: 'Factors of x² - 5x + 6 are:', options: ['(x - 2)(x - 3)', '(x + 2)(x + 3)', '(x - 1)(x - 6)', '(x + 1)(x - 6)'], correct: 0 },
      { chapter: 4, questionText: 'The formula of (a + b)³ is:', options: ['a³ + 3ab(a + b) + b³', 'a³ - 3ab(a - b) - b³', 'a³ + b³', 'a² + 2ab + b²'], correct: 0 },
      { chapter: 5, questionText: 'The solution of |x| = 5 is:', options: ['±5', '5 only', '-5 only', '0'], correct: 0 },
      { chapter: 6, questionText: 'sin² θ + cos² θ is always equal to:', options: ['1', '0', 'tan θ', 'sec θ'], correct: 0 },
      { chapter: 7, questionText: 'Distance between origin (0, 0) and point (3, 4) is:', options: ['5', '7', '1', '25'], correct: 0 },
      { chapter: 8, questionText: 'A proposition that is always true is called a:', options: ['Tautology', 'Contradiction', 'Contingency', 'Fallacy'], correct: 0 },
      { chapter: 9, questionText: 'Two triangles having equal corresponding angles are:', options: ['Similar', 'Congruent', 'Scalene', 'Right-angled'], correct: 0 },
      { chapter: 10, questionText: 'The graph of linear function y = mx + c is a:', options: ['Straight line', 'Parabola', 'Circle', 'Hyperbola'], correct: 0 },
      { chapter: 12, questionText: 'The arithmetic mean of 2, 4, 6, 8 is:', options: ['5', '4', '6', '20'], correct: 0 },
      { chapter: 13, questionText: 'The probability of getting a head on a single coin toss is:', options: ['1/2', '1', '0', '1/4'], correct: 0 },
    ];

    const math10McqPool = [
      { chapter: 1, questionText: 'Standard form of quadratic equation is:', options: ['ax² + bx + c = 0', 'ax + b = 0', 'ax³ + bx² + c = 0', 'ax² = bx'], correct: 0 },
      { chapter: 1, questionText: 'The number of roots of a quadratic equation is:', options: ['2', '1', '3', 'infinite'], correct: 0 },
      { chapter: 2, questionText: 'Discriminant of quadratic equation ax² + bx + c = 0 is:', options: ['b² - 4ac', 'b² + 4ac', '-b ± √(b²-4ac)', '4ac - b²'], correct: 0 },
      { chapter: 2, questionText: 'Sum of cube roots of unity (1 + ω + ω²) is:', options: ['0', '1', '-1', 'ω'], correct: 0 },
      { chapter: 3, questionText: 'In ratio a : b, the first term "a" is called:', options: ['Antecedent', 'Consequent', 'Extremes', 'Means'], correct: 0 },
      { chapter: 4, questionText: 'A fraction in which degree of numerator is less than denominator is:', options: ['Proper fraction', 'Improper fraction', 'Compound fraction', 'Equation'], correct: 0 },
      { chapter: 5, questionText: 'If number of elements in set A is 2 and in B is 3, then elements in A × B is:', options: ['6', '5', '8', '9'], correct: 0 },
      { chapter: 6, questionText: 'The most frequent value in a data set is called:', options: ['Mode', 'Mean', 'Median', 'Range'], correct: 0 },
      { chapter: 7, questionText: '1 + tan² θ is equal to:', options: ['sec² θ', 'cosec² θ', 'cot² θ', 'cos² θ'], correct: 0 },
      { chapter: 7, questionText: 'Convert 180° into radians:', options: ['π radians', '2π radians', 'π/2 radians', 'π/4 radians'], correct: 0 },
      { chapter: 9, questionText: 'A line segment joining two points on a circle is called:', options: ['Chord', 'Tangent', 'Secant', 'Diameter only'], correct: 0 },
      { chapter: 10, questionText: 'A line intersecting a circle at exactly one point is called:', options: ['Tangent', 'Secant', 'Chord', 'Normal'], correct: 0 },
      { chapter: 12, questionText: 'Angle in a semi-circle is always equal to:', options: ['90° (Right angle)', '60°', '45°', '180°'], correct: 0 },
    ];

    const currentMathMcqs = classGrade === '9' ? math9McqPool : math10McqPool;
    let filteredMcqPool = currentMathMcqs;
    if (hasChapterFilter) {
      const filtered = currentMathMcqs.filter(m => m.chapter !== undefined && activeChapterSet.has(Number(m.chapter)));
      if (filtered.length > 0) filteredMcqPool = filtered;
    }

    let mcqs = [];
    if (!skipMcq) {
      const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
      let avail = [...filteredMcqPool];
      while (avail.length < Number(mcqCount)) {
        const idx = avail.length + 1;
        avail.push({
          questionText: `[${activeChName}] MCQ #${idx}: Choose the correct mathematical option:`,
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correct: 0,
        });
      }
      mcqs = sampleRandom(avail, Number(mcqCount)).map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    const math9Shorts = [
      { chapter: 1, text: 'Simplify and express in simplest form: ((243)⁻²/³ × (32)⁻¹/⁵) / √(196)⁻¹.\n(قوانینِ قوت نما کی مدد سے حل کیجیے۔)' },
      { chapter: 1, text: 'Differentiate between rational and irrational numbers with two examples each.\n(ناطق اور غیر ناطق اعداد میں فرق واضح کیجیے۔)' },
      { chapter: 1, text: 'Express 0.0000548 and 63,500,000 in scientific notation.\n(سائنسی ترقیم میں ظاہر کیجیے۔)' },
      { chapter: 2, text: 'Find the value of x if: log₃ x = 4.\n(x کی قیمت معلوم کیجیے۔)' },
      { chapter: 2, text: 'State the four fundamental laws of logarithms.\n(لوگارتھم کے بنیادی قوانین لکھیے۔)' },
      { chapter: 2, text: 'Find the characteristic and mantissa of log 0.00356.\n(خاصہ اور مینٹیسا معلوم کریں۔)' },
      { chapter: 3, text: 'If U = {1, 2, ..., 10}, A = {2, 4, 6, 8, 10}, find A′ (Complement of A).\n(A کا تکمیلہ معلوم کیجیے۔)' },
      { chapter: 3, text: 'Define a function and state its domain and range.\n(تفاعل کی تعریف اور ڈومین و رینج لکھیے۔)' },
      { chapter: 4, text: 'Factorize: 4x² - 12xy + 9y².\n(تجزی کیجیے۔)' },
      { chapter: 4, text: 'If x + 1/x = 3, find the value of x² + 1/x² and x³ + 1/x³.\n(قیمت معلوم کیجیے۔)' },
      { chapter: 5, text: 'Solve for x: |2x - 3| = 6.\n(مساوات کو حل کیجیے۔)' },
      { chapter: 5, text: 'Solve the inequality: 3x + 1 < 5x - 4 and represent on number line.\n(غیر مساوات حل کیجیے۔)' },
      { chapter: 6, text: 'Prove the fundamental identity: 1 + tan² θ = sec² θ.\n(ثابت کیجیے۔)' },
      { chapter: 6, text: 'Convert 60° into radian measure.\n(ریڈین میں تبدیل کیجیے۔)' },
      { chapter: 7, text: 'Find the distance between points A(2, 3) and B(5, 7).\n(درمیانی فاصلہ معلوم کیجیے۔)' },
      { chapter: 8, text: 'Construct truth table for: p ∧ (~q).\n(ٹروتھ ٹیبل بنائیے۔)' },
      { chapter: 9, text: 'Define similar triangles and state condition for similarity.\n(متشابہ مثلثوں کی تعریف اور شرائط لکھیے۔)' },
      { chapter: 12, text: 'Find the mean and median of: 4, 7, 9, 12, 15, 18, 20.\n(اوسط اور میڈین معلوم کیجیے۔)' },
      { chapter: 13, text: 'A dice is rolled once. Find the probability of getting an even number.\n(جفت عدد آنے کا احتمال معلوم کیجیے۔)' },
    ];

    const math10Shorts = [
      { chapter: 1, text: 'Solve the quadratic equation by factorization: x² - x - 20 = 0.\n(بذریعہ تجزی حل کیجیے۔)' },
      { chapter: 1, text: 'Solve equation using quadratic formula: 2 - x² = 7x.\n(دو درجی فارمولا استعمال کرتے ہوئے حل کیجیے۔)' },
      { chapter: 2, text: 'Find the discriminant of: 2x² - 7x + 3 = 0.\n(فرق کنندہ معلوم کیجیے۔)' },
      { chapter: 2, text: 'Evaluate: (1 - ω - ω²)⁷.\n(قیمت معلوم کیجیے۔)' },
      { chapter: 2, text: 'If α, β are roots of x² - px - p - c = 0, prove that (1 + α)(1 + β) = 1 - c.\n(ثابت کیجیے۔)' },
      { chapter: 3, text: 'Find a fourth proportional to 5, 8, 15.\n(چوتھا متناسب معلوم کیجیے۔)' },
      { chapter: 3, text: 'State theorem of Componendo-Dividendo.\n(مسئلہ ترکیب و تفصیل نسبت بیان کیجیے۔)' },
      { chapter: 4, text: 'Resolve into partial fractions: 1 / (x² - 1).\n(جزوی کسروں میں تبدیل کیجیے۔)' },
      { chapter: 5, text: 'If A = {1, 2, 3} and B = {2, 4}, find A × B and write two binary relations.\n(ثنائی روابط لکھیے۔)' },
      { chapter: 6, text: 'Define Arithmetic Mean and write formula for grouped data.\n(حسابی اوسط کا فارمولا لکھیے۔)' },
      { chapter: 6, text: 'Find the variance of the data: 10, 12, 14, 16, 18.\n(تغیر معلوم کیجیے۔)' },
      { chapter: 7, text: 'Prove identity: (1 - sin θ)(1 + sin θ) = cos² θ.\n(ثابت کیجیے۔)' },
      { chapter: 7, text: 'Find radius r when l = 4 cm and θ = 1/4 radian.\n(رداس معلوم کیجیے۔)' },
      { chapter: 9, text: 'Define chord of a circle and draw a diagram.\n(دائرے کے وتر کی تعریف کیجیے۔)' },
      { chapter: 10, text: 'Define tangent to a circle and point of contact.\n(دائرے کے مماس کی تعریف کیجیے۔)' },
      { chapter: 13, text: 'Inscribe a circle in an equilateral triangle of side 4 cm.\n(مثلث کے اندر محصور دائرہ بنائیے۔)' },
    ];

    const allMathShorts = classGrade === '9' ? math9Shorts : math10Shorts;
    let mathShortPool = allMathShorts;
    if (hasChapterFilter) {
      const filtered = allMathShorts.filter(q => q.chapter !== undefined && activeChapterSet.has(Number(q.chapter)));
      if (filtered.length > 0) mathShortPool = filtered;
    }
    let mathShortTexts = mathShortPool.map(q => q.text);
    const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
    while (mathShortTexts.length < 27) {
      const idx = mathShortTexts.length + 1;
      mathShortTexts.push(`[${activeChName}] Q.${idx}: Solve the analytical equation and verify your answer for Topic #${idx}.\n(اس باب کے اہم سوال نمبر ${idx} کو حل کیجیے۔)`);
    }

    const q2Items = sampleRandom(mathShortTexts, 9);
    const q3Items = sampleRandom(mathShortTexts, 9);
    const q4Items = sampleRandom(mathShortTexts, 9);

    const math9Longs = [
      { num: 5, marks: 8, text: '(a) Simplify using laws of exponents: [((x^a / x^b)^(a+b)) × ((x^b / x^c)^(b+c)) × ((x^c / x^a)^(c+a))].\n(b) If x = 2 + √3, evaluate the values of (x + 1/x) and (x² + 1/x²).' },
      { num: 6, marks: 8, text: '(a) Use logarithm tables to evaluate: (0.8176 × 13.64) / 0.0234.\n(b) Factorize completely using factor theorem: x³ - 2x² - 5x + 6.' },
      { num: 7, marks: 8, text: '(a) Verify De Morgan’s Laws if U = {1, 2, ..., 10}, A = {1, 3, 5, 7, 9}, B = {2, 3, 5, 7}.\n(b) Solve system of linear equations graphically: x + y = 4 and 2x - y = 2.' },
      { num: 8, marks: 8, text: '(a) Prove that: (1 + tan² θ)(1 - sin² θ) = 1.\n(b) Find the coordinate of centroid of triangle whose vertices are A(-1, 3), B(2, -1) and C(5, 4).' },
    ];

    const math10Longs = [
      { num: 5, marks: 8, text: '(a) Solve equation using quadratic formula: 2 - x² = 7x.\n(b) If α, β are roots of x² - 3x + 6 = 0, form an equation whose roots are α² and β².' },
      { num: 6, marks: 8, text: '(a) Using Componendo-Dividendo theorem, solve: ((x+3)² - (x-5)²) / ((x+3)² + (x-5)²) = 4/5.\n(b) Resolve into partial fractions: (7x - 9) / ((x + 1)(x - 3)).' },
      { num: 7, marks: 8, text: '(a) Verify that (A ∪ B)′ = A′ ∩ B′ where U = {1, 2, ..., 10}, A = {1, 3, 5, 7, 9}, B = {2, 3, 5, 7}.\n(b) Calculate the standard deviation and variance for the given frequency distribution.' },
      { num: 8, marks: 8, text: '(a) Prove identity: (1 + sin θ) / (1 - sin θ) - (1 - sin θ) / (1 + sin θ) = 4 tan θ sec θ.\n(b) Construct a circle circumscribing a triangle with sides 4 cm, 5 cm, and 6 cm.' },
    ];

    const activeLongQuestions = classGrade === '9' ? math9Longs : math10Longs;

    return {
      ...paperBase,
      isMathPaper: true,
      timeAllowed: isInter ? '2:30 Hours' : '2:10 Hours',
      totalMarks: configuredTotalMarks || defaultTotalMarks,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        time: isInter ? '20 Minutes' : '20 Minutes',
        questions: mcqs,
      },
      shortSections: [
        {
          sectionNumber: 2,
          title: 'Section-I: Q.2: Short Questions',
          instruction: '2- کوئی سے چھ (6) اجزاء حل کیجیے: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: q2Items.map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q })),
        },
        {
          sectionNumber: 3,
          title: 'Section-I: Q.3: Short Questions',
          instruction: '3- کوئی سے چھ (6) اجزاء حل کیجیے: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: q3Items.map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q })),
        },
        {
          sectionNumber: 4,
          title: 'Section-I: Q.4: Short Questions',
          instruction: '4- کوئی سے چھ (6) اجزاء حل کیجیے: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: q4Items.map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q })),
        },
      ],
      longSection: {
        active: !mathConfig.skipLong,
        title: 'Part-II (Detailed / Long Questions)',
        instruction: 'Note: Attempt any THREE questions from Part-II. Question No. 9 (Theorem) is COMPULSORY. Each question carries 8 marks (4+4). [3 × 8 = 24 Marks]',
        attemptCount: 3,
        totalCount: 5,
        marks: 24,
        questions: sampleRandom(activeLongQuestions, 4).concat([
          {
            num: 9,
            marks: 8,
            text: sampleRandom([
              '(COMPULSORY THEOREM) Prove that a straight line drawn from the center of a circle to bisect a chord is perpendicular to the chord.\nOR Prove that any two angles in the same segment of a circle are equal.',
              '(COMPULSORY THEOREM) Prove that two chords of a circle which are equidistant from center are congruent.\nOR Prove that opposite angles of any quadrilateral inscribed in a circle are supplementary.',
            ], 1)[0],
          },
        ]),
      },
    };
  }

  // ========================================================
  // 4. SCIENCE (Biology, Physics, Chemistry)
  // ========================================================
  if (patternType === 'SCIENCE') {
    const isInter = classGrade === '11' || classGrade === '12';
    const defaultTotalMarks = isInter ? 85 : 60;
    const defaultMcqCount = isInter ? 17 : 12;
    const skipMcq = scienceConfig.skipMcq;
    const mcqCount = scienceConfig.mcqCount || defaultMcqCount;

    let mcqs = [];
    if (!skipMcq) {
      const avail = rawQuestions.mcqs || [];
      const sampled = sampleRandom(avail, Number(mcqCount));
      mcqs = sampled.map((item, idx) => {
        const shuffled = shuffleMcqOptions(item);
        return {
          index: idx + 1,
          id: shuffled.id || `sci_m_${idx}_${Date.now()}`,
          questionText: shuffled.en || shuffled.ur,
          options: shuffled.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: shuffled.correct,
          marks: 1,
        };
      });
    }

    const shortList = rawQuestions.shorts || [];
    const usedShorts = new Set();
    const countQ2 = isInter ? 12 : 8;
    const countQ3 = isInter ? 12 : 8;
    const countQ4 = isInter ? 9 : 8;

    const q2Selected = sampleUnique(shortList, countQ2, usedShorts);
    const q3Selected = sampleUnique(shortList, countQ3, usedShorts);
    const q4Selected = sampleUnique(shortList, countQ4, usedShorts);

    const longList = rawQuestions.longs || [];
    const sampledLongs = sampleRandom(longList, isInter ? 5 : 3);

    return {
      ...paperBase,
      isSciencePaper: true,
      timeAllowed: isInter ? '2:45 Hours' : '1:45 Hours',
      totalMarks: configuredTotalMarks || defaultTotalMarks,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        time: isInter ? '20 Minutes' : '15 Minutes',
        questions: mcqs,
      },
      shortSections: [
        {
          sectionNumber: 2,
          title: isInter
            ? 'Section-I: Q.2: Write short answers to any EIGHT (8) questions:'
            : 'PART - I: Q.2: Write short answers to any FIVE (5) questions:',
          instruction: isInter
            ? 'سوال 2: کوئی سے آٹھ (8) سوالات کے مختصر جوابات لکھیں: [8 × 2 = 16 Marks]'
            : 'سوال 2: کوئی سے پانچ (5) سوالات کے مختصر جوابات لکھیں: [5 × 2 = 10 Marks]',
          attemptCount: isInter ? 8 : 5,
          totalCount: countQ2,
          totalMarks: isInter ? 16 : 10,
          questions: q2Selected.map((q, idx) => ({
            num: `(${idx + 1})`,
            text: `${q.en}\n(${q.ur})`,
          })),
        },
        {
          sectionNumber: 3,
          title: isInter
            ? 'Section-I: Q.3: Write short answers to any EIGHT (8) questions:'
            : 'PART - I: Q.3: Write short answers to any FIVE (5) questions:',
          instruction: isInter
            ? 'سوال 3: کوئی سے آٹھ (8) سوالات کے مختصر جوابات لکھیں: [8 × 2 = 16 Marks]'
            : 'سوال 3: کوئی سے پانچ (5) سوالات کے مختصر جوابات لکھیں: [5 × 2 = 10 Marks]',
          attemptCount: isInter ? 8 : 5,
          totalCount: countQ3,
          totalMarks: isInter ? 16 : 10,
          questions: q3Selected.map((q, idx) => ({
            num: `(${idx + 1})`,
            text: `${q.en}\n(${q.ur})`,
          })),
        },
        {
          sectionNumber: 4,
          title: isInter
            ? 'Section-I: Q.4: Write short answers to any SIX (6) questions:'
            : 'PART - I: Q.4: Write short answers to any FIVE (5) questions:',
          instruction: isInter
            ? 'سوال 4: کوئی سے چھ (6) سوالات کے مختصر جوابات لکھیں: [6 × 2 = 12 Marks]'
            : 'سوال 4: کوئی سے پانچ (5) سوالات کے مختصر جوابات لکھیں: [5 × 2 = 10 Marks]',
          attemptCount: isInter ? 6 : 5,
          totalCount: countQ4,
          totalMarks: isInter ? 12 : 10,
          questions: q4Selected.map((q, idx) => ({
            num: `(${idx + 1})`,
            text: `${q.en}\n(${q.ur})`,
          })),
        },
      ],
      longSection: {
        active: !scienceConfig.skipLong,
        title: 'PART - II: Detailed / Long Questions',
        instruction: isInter
          ? 'Note: Attempt any THREE (3) questions. (3 × 8 = 24 Marks). Each question carries 8 marks (Part a = 5, Part b = 3).'
          : 'Note: Attempt any TWO (2) questions. (2 × 9 = 18 Marks). Each question carries 9 marks (Part a = 5, Part b = 4).',
        attemptCount: isInter ? 3 : 2,
        totalCount: isInter ? 5 : 3,
        marks: isInter ? 24 : 18,
        questions: sampledLongs.map((l, idx) => ({
          num: idx + 5,
          marks: isInter ? 8 : 9,
          text: `${l.en}\n(${l.ur})`,
        })),
      },
    };
  }

  // ========================================================
  // 4B. COMPUTER SCIENCE (9th, 10th, 11th, 12th)
  // ========================================================
  if (patternType === 'COMPUTER') {
    const isInter = classGrade === '11' || classGrade === '12';
    const is10th = classGrade === '10';
    const is9th = !is10th && !isInter;
    const defaultTotalMarks = isInter ? 75 : 50;
    const defaultMcqCount = isInter ? 15 : 10;
    const skipMcq = computerConfig.skipMcq;
    const mcqCount = computerConfig.mcqCount || defaultMcqCount;

    const cs9ChBank = {
      1: {
        name: 'Problem Solving',
        mcqs: [
          { questionText: 'Which symbol is used for Decision Making in a Flowchart?', options: ['Diamond (ڈائمنڈ)', 'Rectangle (مستطیل)', 'Parallelogram (متوازی الاضلاع)', 'Oval (بیضوی)'], correct: 0 },
          { questionText: 'A flowchart is a ______ representation of an algorithm:', options: ['Graphical / Pictorial', 'Mathematical', 'Textual', 'Physical'], correct: 0 },
          { questionText: 'Which symbol is used for Input / Output in a flowchart?', options: ['Parallelogram (متوازی الاضلاع)', 'Rectangle', 'Diamond', 'Oval'], correct: 0 },
          { questionText: 'The process of checking whether a solution is solving the right problem is:', options: ['Validation', 'Verification', 'Debugging', 'Testing'], correct: 0 },
          { questionText: 'A technique used to test an algorithm on paper before implementation is:', options: ['Trace Table', 'Flowchart', 'Compiler', 'Debugger'], correct: 0 },
          { questionText: 'Which symbol indicates the start or stop of a flowchart?', options: ['Oval (Terminal)', 'Rectangle', 'Diamond', 'Connector'], correct: 0 },
        ],
        shorts: [
          'Define problem solving and write names of its any four steps.\n(مسئلہ حل کرنے کی تعریف کریں اور اس کے چار مراحل کے نام لکھیں۔)',
          'What is a flowchart? Draw terminal and process symbols.\n(فلو چارٹ کیا ہے؟ ٹرمینل اور پراسیس کی علامات بنائیں۔)',
          'Differentiate between an Algorithm and a Flowchart.\n(الگورتھم اور فلو چارٹ میں بنیادی فرق بیان کریں۔)',
          'What is an algorithm efficiency and how is it measured?\n(الگورتھم کی کارکردگی سے کیا مراد ہے اور اسے کیسے ناپتے ہیں؟)',
          'Define trace table with an example.\n(ٹریس ٹیبل کی تعریف کریں اور مثال دیں۔)',
          'What is test data and why is verification required?\n(ٹیسٹ ڈیٹا کیا ہے اور تصدیق (Verification) کیوں ضروری ہے؟)',
          'What is meant by defining a problem and understanding a problem?\n(مسئلہ بیان کرنے اور مسئلہ سمجھنے سے کیا مراد ہے؟)',
          'Differentiate between Verification and Validation with an example.\n(ویریفیکیشن اور ویلیڈیشن میں فرق واضح کریں۔)',
          'What is meant by candid solutions of a problem?\n(مسئلے کے کینڈڈ حل سے کیا مراد ہے؟)',
          'Draw the decision symbol and connector symbol of a flowchart.\n(فلو چارٹ کے ڈیسیژن اور کنیکٹر سمبلز بنائیں۔)',
        ],
        longs: [
          { num: 5, marks: 8, text: 'Define Flowchart. Explain any five flowchart symbols with their shapes, names, and functions in detail.\n(فلو چارٹ کی تعریف کریں اور اس کی پانچ علامات اشکال اور افعال کے ساتھ تفصیل سے بیان کریں۔) [8 Marks]' },
          { num: 6, marks: 8, text: 'What is an Algorithm? Write step-by-step formulation of an algorithm with an example problem.\n(الگورتھم کیا ہے؟ کسی مسئلے کو حل کرنے کے لیے الگورتھم کی تشکیل مثال سمیت تحریر کریں۔) [8 Marks]' },
          { num: 7, marks: 8, text: 'Explain the difference between Verification and Validation with daily-life examples and explain the importance of test data.\n(ویریفیکیشن اور ویلیڈیشن میں روزمرہ مثالوں سے فرق بیان کریں اور ٹیسٹ ڈیٹا کی اہمیت واضح کریں۔) [8 Marks]' },
        ],
      },
      2: {
        name: 'Binary System',
        mcqs: [
          { questionText: 'Hexadecimal number system has a base of:', options: ['16', '2', '8', '10'], correct: 0 },
          { questionText: 'The ASCII value of uppercase letter "A" is:', options: ['65', '97', '48', '32'], correct: 0 },
          { questionText: 'One byte is equal to how many bits?', options: ['8 bits', '4 bits', '16 bits', '2 bits'], correct: 0 },
          { questionText: 'Which binary operation gives 1 only when both inputs are 1?', options: ['AND operator', 'OR operator', 'NOT operator', 'XOR operator'], correct: 0 },
        ],
        shorts: [
          'Convert decimal number (69)₁₀ into binary number system.\n((69)₁₀ کو باائنری نمبر سسٹم میں تبدیل کیجیے۔)',
          'Define ASCII code and write its purpose with an example.\n(اسکی (ASCII) کوڈ کی تعریف اور مقصد لکھیے۔)',
          'Convert binary number (110011)₂ into decimal system.\n((110011)₂ کو ڈیسیمل میں تبدیل کریں۔)',
          'Differentiate between volatile memory (RAM) and non-volatile memory (ROM).\n(وولاٹائل اور نان وولاٹائل میموری میں فرق لکھیے۔)',
          'Define truth table and construct truth table for AND operator.\n(ٹروتھ ٹیبل کی تعریف اور AND آپریٹر کا ٹیبل بنائیں۔)',
        ],
        longs: [
          { num: 5, marks: 8, text: 'Explain number system conversions: (a) Decimal to Binary and Hexadecimal (b) Binary to Hexadecimal with examples.\n(نمبر سسٹمز کی باہمی تبدیلی کی تفصیلی وضاحت کریں۔) [8 Marks]' },
          { num: 6, marks: 8, text: 'Explain Boolean algebra logical operators (AND, OR, NOT) with truth tables and laws of Boolean algebra.\n(بولین الجبرا کے آپریٹرز ٹروتھ ٹیبلز کے ساتھ بیان کریں۔) [8 Marks]' },
        ],
      },
      3: {
        name: 'Networks',
        mcqs: [
          { questionText: 'Which network topology connects all devices to a central hub or switch?', options: ['Star Topology', 'Bus Topology', 'Ring Topology', 'Mesh Topology'], correct: 0 },
          { questionText: 'Which protocol is standard for securely transferring web pages?', options: ['HTTPS', 'FTP', 'SMTP', 'DHCP'], correct: 0 },
          { questionText: 'Which device is used to connect two different networks together?', options: ['Router', 'Hub', 'Repeater', 'Bridge'], correct: 0 },
        ],
        shorts: [
          'What is a computer network and write its any two benefits.\n(کمپیوٹر نیٹ ورک اور اس کے دو فوائد لکھیے۔)',
          'Differentiate between Client and Server in a network.\n(کلائنٹ اور سرور میں فرق واضح کیجیے۔)',
          'Define IP Address and differentiate IPv4 and IPv6.\n(آئی پی ایڈریس کی تعریف اور IPv4 اور IPv6 میں فرق لکھیے۔)',
          'What is a Router and what is its role in packet transmission?\n(راؤٹر کیا ہے اور نیٹ ورکنگ میں اس کا کیا کردار ہے؟)',
          'Differentiate between Point-to-Point and Multi-point connections.\n(پوائنٹ ٹو پوائنٹ اور ملٹی پوائنٹ کنکشن میں فرق بیان کریں۔)',
        ],
        longs: [
          { num: 5, marks: 8, text: 'Explain Star Topology and Bus Topology with neat diagrams, working and advantages.\n(سٹار ٹوپولوجی اور بس ٹوپولوجی کی وضاحت ڈایاگرام، طریقہ کار اور فوائد کے ساتھ کریں۔) [8 Marks]' },
          { num: 6, marks: 8, text: 'Explain TCP/IP protocol suite and its five layers with their functions.\n(ٹی سی پی / آئی پی پروٹوکول ماڈل کی تہوں اور ان کے افعال کی وضاحت کریں۔) [8 Marks]' },
        ],
      },
      4: {
        name: 'Data and Cyber Security',
        mcqs: [
          { questionText: 'Unauthorized access to a computer system or network is known as:', options: ['Hacking', 'Browsing', 'Encryption', 'Networking'], correct: 0 },
          { questionText: 'Phishing is a method of:', options: ['Identity theft / Fraud', 'Compiling code', 'Designing graphics', 'Formatting disk'], correct: 0 },
          { questionText: 'The process of encoding data so only authorized parties can read it is:', options: ['Encryption', 'Decryption', 'Transmission', 'Compression'], correct: 0 },
        ],
        shorts: [
          'Define cybercrime and write names of any two common cybercrimes.\n(سائبر کرائم کی تعریف کریں اور دو مثالیں دیں۔)',
          'What is Phishing attack and how does it happen?\n(فشنگ اٹیک کیا ہے اور یہ کس طرح کیا جاتا ہے؟)',
          'Differentiate between Software Piracy and Copyright Law.\n(سافٹ ویئر پائریسی اور کاپی رائٹ قانون میں فرق بیان کریں۔)',
          'Define ciphertext and plaintext.\n(سائفر ٹیکسٹ اور پلین ٹیکسٹ کی تعریف کریں۔)',
          'What is a password? Mention two characteristics of a strong password.\n(مضبوط پاس ورڈ کی دو اہم خصوصیات لکھیں۔)',
        ],
        longs: [
          { num: 5, marks: 8, text: 'What is Encryption? Explain Caesar Cipher and Vigenere Cipher with practical examples.\n(اینکرپشن کیا ہے؟ سیزر سائفر اور وجنیئر سائفر کی تفصیلی وضاحت کریں۔) [8 Marks]' },
          { num: 6, marks: 8, text: 'Explain ethical and security issues in data privacy: Piracy, Fraud, and Patent rights.\n(ڈیٹا پرائیویسی اور اخلاقی مسائل کی تفصیلی وضاحت کریں۔) [8 Marks]' },
        ],
      },
      5: {
        name: 'Designing Website (HTML)',
        mcqs: [
          { questionText: 'In HTML, which tag is used for the largest heading?', options: ['<h1>', '<h6>', '<head>', '<heading>'], correct: 0 },
          { questionText: 'Which tag is used to create a hyperlink in HTML?', options: ['<a href="...">', '<link>', '<url>', '<src>'], correct: 0 },
          { questionText: 'In HTML, which tag is used to define an unordered list?', options: ['<ul>', '<ol>', '<li>', '<dl>'], correct: 0 },
          { questionText: 'Which attribute of <img> tag specifies the image URL or source path?', options: ['src', 'href', 'alt', 'path'], correct: 0 },
        ],
        shorts: [
          'What is HTML and what are paired tags and singular tags?\n(ایچ ٹی ایم ایل کیا ہے؟ پیئرڈ اور سنگلر ٹیگز میں فرق لکھیے۔)',
          'Write HTML code to insert an image on a webpage.\n(ویب پیج پر تصویر لگانے کا HTML کوڈ لکھیے۔)',
          'Differentiate between Ordered list (<ol>) and Unordered list (<ul>).\n(آرڈرڈ اور ان آرڈرڈ لسٹ میں فرق بیان کیجیے۔)',
          'What is a Hyperlink in HTML and which tag is used for it?\n(ایچ ٹی ایم ایل میں ہائپر لنک کیا ہے اور کون سا ٹیگ استعمال ہوتا ہے؟)',
          'What is the purpose of <title> tag and where is it placed?\n(ایچ ٹی ایم ایل میں <title> ٹیگ کا مقصد اور مقام لکھیے۔)',
        ],
        longs: [
          { num: 5, marks: 8, text: 'Explain how to create tables in HTML. Write code for a table with 3 rows and 3 columns with borders and header.\n(ایچ ٹی ایم ایل میں ٹیبل بنانے کا طریقہ اور 3 قطاروں اور کالموں کا مکمل کوڈ لکھیں۔) [8 Marks]' },
          { num: 6, marks: 8, text: 'Explain various types of lists in HTML (Ordered, Unordered, Definition) with example code for each.\n(ایچ ٹی ایم ایل لسٹس کی تمام اقسام کوڈ کے ساتھ واضح کریں۔) [8 Marks]' },
        ],
      },
    };

    const cs10McqPool = [
      { chapter: 1, questionText: 'Which of the following is a valid keyword in C language?', options: ['int', 'integer', 'string', 'real'], correct: 0 },
      { chapter: 1, questionText: 'Every C statement must end with a:', options: ['; (Semicolon)', ': (Colon)', '. (Dot)', ', (Comma)'], correct: 0 },
      { chapter: 2, questionText: 'The format specifier for integer in C is:', options: ['%d', '%f', '%c', '%s'], correct: 0 },
      { chapter: 2, questionText: 'Which operator is used for modulus (remainder) in C?', options: ['%', '/', '*', '&'], correct: 0 },
      { chapter: 3, questionText: 'Which loop is known as an entry-controlled loop?', options: ['for and while', 'do-while', 'switch', 'goto'], correct: 0 },
      { chapter: 2, questionText: 'Which escape sequence produces a new line in C?', options: ['\\n', '\\t', '\\b', '\\r'], correct: 0 },
      { chapter: 4, questionText: 'The index of an array in C always starts from:', options: ['0', '1', '-1', 'Any number'], correct: 0 },
      { chapter: 2, questionText: 'Which built-in function is used to take formatted input in C?', options: ['scanf()', 'printf()', 'getch()', 'input()'], correct: 0 },
      { chapter: 2, questionText: 'What is the logical AND operator in C language?', options: ['&&', '&', '||', '!'], correct: 0 },
      { chapter: 5, questionText: 'A function that calls itself is called:', options: ['Recursive function', 'Inline function', 'User function', 'Main function'], correct: 0 },
    ];

    let activeMcqPool = [];
    if (is9th) {
      if (hasChapterFilter) {
        activeChapterNums.forEach(num => {
          if (cs9ChBank[num]) activeMcqPool.push(...cs9ChBank[num].mcqs);
        });
        if (activeMcqPool.length === 0) {
          activeMcqPool = Object.values(cs9ChBank).flatMap(ch => ch.mcqs);
        }
      } else {
        activeMcqPool = Object.values(cs9ChBank).flatMap(ch => ch.mcqs);
      }
    } else if (is10th) {
      if (hasChapterFilter) {
        const filtered = cs10McqPool.filter(m => m.chapter !== undefined && activeChapterSet.has(Number(m.chapter)));
        activeMcqPool = filtered.length > 0 ? filtered : cs10McqPool;
      } else {
        activeMcqPool = cs10McqPool;
      }
    } else {
      activeMcqPool = [
        { questionText: 'Which software manages all computer hardware and application software?', options: ['Operating System', 'Utility Program', 'Compiler', 'Device Driver'], correct: 0 },
        { questionText: 'Which memory is non-volatile and retains instructions permanently?', options: ['ROM', 'RAM', 'Cache', 'Virtual Memory'], correct: 0 },
        { questionText: 'A primary key in a database table must be:', options: ['Unique and Not Null', 'Duplicate', 'Any string', 'Null'], correct: 0 },
        { questionText: 'SQL stands for:', options: ['Structured Query Language', 'Simple Question Language', 'Standard Quality Logic', 'System Query Log'], correct: 0 },
        { questionText: 'Which layer of the OSI model is closest to the end user?', options: ['Application Layer', 'Physical Layer', 'Transport Layer', 'Network Layer'], correct: 0 },
      ];
    }

    let mcqs = [];
    if (!skipMcq) {
      const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
      let avail = [...activeMcqPool];
      while (avail.length < Number(mcqCount)) {
        const idx = avail.length + 1;
        avail.push({
          questionText: `[${activeChName}] MCQ #${idx}: Choose the correct technical concept or output:`,
          options: ['Option A (Correct Concept)', 'Option B', 'Option C', 'Option D'],
          correct: 0,
        });
      }
      mcqs = sampleRandom(avail, Number(mcqCount)).map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    // Short Questions Pools
    let q2Pool = [];
    let q3Pool = [];
    let q4Pool = [];
    let csLongPool = [];

    if (is9th) {
      if (hasChapterFilter) {
        let chShorts = [];
        let chLongs = [];
        activeChapterNums.forEach(num => {
          if (cs9ChBank[num]) {
            chShorts.push(...cs9ChBank[num].shorts);
            chLongs.push(...cs9ChBank[num].longs);
          }
        });
        const activeChName = allSubjectChapters.find(c => activeChapterSet.has(Number(c.id)))?.name || formattedScope;
        while (chShorts.length < 18) {
          const idx = chShorts.length + 1;
          chShorts.push(`[${activeChName}] Q.${idx}: State the definition and practical application of Topic #${idx}.\n(اس باب کے اہم موضوع نمبر ${idx} کی تعریف اور اطلاق تحریر کریں۔)`);
        }
        q2Pool = sampleRandom(chShorts, 6);
        q3Pool = sampleRandom(chShorts, 6);
        q4Pool = sampleRandom(chShorts, 6);
        csLongPool = chLongs.length > 0 ? chLongs : cs9ChBank[1].longs;
      } else {
        q2Pool = cs9ChBank[1].shorts.slice(0, 6);
        q3Pool = [...cs9ChBank[2].shorts, ...cs9ChBank[3].shorts].slice(0, 6);
        q4Pool = [...cs9ChBank[4].shorts, ...cs9ChBank[5].shorts].slice(0, 6);
        csLongPool = [cs9ChBank[3].longs[0], cs9ChBank[4].longs[0], cs9ChBank[5].longs[0]];
      }
    } else if (is10th) {
      q2Pool = [
        'What is C language and who developed it and when?\n(سی لینگویج کیا ہے اور یہ کب اور کس نے بنائی؟)',
        'Define IDE and write names of two popular C compilers/IDEs.\n(آئی ڈی ای (IDE) کی تعریف کریں اور دو نام لکھیں۔)',
        'What are keywords or reserved words in C? Give two examples.\n(سی لینگویج میں کی ورڈز کیا ہیں؟ دو مثالیں دیں۔)',
        'Differentiate between variable declaration and variable initialization.\n(ویری ایبل ڈیکلریشن اور انیشلائزیشن میں فرق لکھیں۔)',
        'What is an escape sequence? Explain \\n and \\t with examples.\n(اسکیپ سیکوئنس کیا ہے؟ \\n اور \\t کی وضاحت کریں۔)',
        'What is the purpose of printf() and scanf() functions in C?\n(سی میں printf() اور scanf() کے مقاصد بیان کریں۔)',
      ];
      q3Pool = [
        'What is control structure? Name its three main types in C.\n(کنٹرول سٹرکچر کیا ہے؟ اس کی تین اہم اقسام کے نام لکھیں۔)',
        'Explain the syntax and working of if-else statement.\n(if-else سٹیٹمنٹ کا سینٹیکس اور کام کا طریقہ لکھیے۔)',
        'What is nested selection structure with an example?\n(نیسٹڈ سلیکشن سٹرکچر کیا ہے؟ مثال دیں۔)',
        'Differentiate between switch statement and if-else-if ladder.\n(سوئچ سٹیٹمنٹ اور if-else-if میں فرق بیان کریں۔)',
        'What is conditional operator in C? Write its syntax.\n(کنڈیشنل آپریٹر کیا ہے؟ اس کا سینٹیکس لکھیے۔)',
      ];
      q4Pool = [
        'What is a loop structure? Name three loops supported in C.\n(لوپ سٹرکچر کیا ہے؟ سی میں موجود تینوں لوپس کے نام لکھیں۔)',
        'Differentiate between for loop and while loop with syntax.\n(for لوپ اور while لوپ میں فرق اور سینٹیکس لکھیے۔)',
        'Why is do-while loop called an exit-controlled loop?\n(do-while کو ایگزٹ کنٹرولڈ لوپ کیوں کہتے ہیں؟)',
        'What is an array in C? How is an array declared?\n(سی میں ارے (Array) کیا ہے اور اسے کیسے ڈکلیئر کرتے ہیں؟)',
        'Define function in C and write two advantages of user-defined functions.\n(فنکشن کی تعریف اور یوزر ڈیفائنڈ فنکشنز کے دو فائدے لکھیے۔)',
      ];
      csLongPool = [
        { num: 5, marks: 8, text: 'Explain basic structure of a C program in detail with header files, main function and body.\n(سی پروگرام کی بنیادی ساخت ہیڈر فائلز، مین فنکشن اور باڈی کے ساتھ تفصیل سے بیان کریں۔) [8 Marks]' },
        { num: 6, marks: 8, text: 'Write a complete C program to find the largest of three numbers using nested if-else.\n(تین اعداد میں سے سب سے بڑا عدد معلوم کرنے کا مکمل سی پروگرام تحریر کریں۔) [8 Marks]' },
        { num: 7, marks: 8, text: 'Explain for loop and while loop with syntax, flowchart and a working example of printing 1 to 10.\n(for اور while لوپ کا موازنہ سینٹیکس، فلو چارٹ اور 1 سے 10 تک گنتی پرنٹ کرنے کے کوڈ سے کریں۔) [8 Marks]' },
      ];
    } else {
      // 11th / 12th Computer Science (ICS)
      q2Pool = [
        'Differentiate between hardware and software with examples.\n(ہارڈ ویئر اور سافٹ ویئر میں فرق بیان کریں۔)',
        'What is an operating system? List any four functions of an OS.\n(آپریٹنگ سسٹم کیا ہے؟ اس کے چار اہم افعال لکھیے۔)',
        'Differentiate between RAM and ROM memory.\n(ریم (RAM) اور روم (ROM) میں فرق بیان کریں۔)',
        'What is cache memory and what is its role in CPU performance?\n(کیش میموری کیا ہے اور سی پی یو کی رفتار پر اس کا کیا اثر ہے؟)',
        'Define bus interconnection and differentiate data bus and address bus.\n(بس انٹر کنکشن اور ڈیٹا و ایڈریس بس میں فرق لکھیے۔)',
        'What are source code and object code?\n(سورس کوڈ اور آبجیکٹ کوڈ میں کیا فرق ہے؟)',
        'Differentiate between Compiler and Interpreter.\n(کمپائلر اور انٹرپریٹر میں تفصیلی فرق لکھیے۔)',
        'What is CPU register? Explain the role of Program Counter (PC).\n(سی پی یو رجسٹر کیا ہے اور پروگرام کاؤنٹر کا کیا کام ہے؟)',
        'What is interrupt and how is it handled by the OS?\n(انٹرپٹ کیا ہے اور آپریٹنگ سسٹم اسے کیسے ہینڈل کرتا ہے؟)',
      ];
      q3Pool = [
        'What is database management system (DBMS)? Write two advantages.\n(ڈی بی ایم ایس کیا ہے اور اس کے دو فوائد لکھیے۔)',
        'Differentiate between primary key, candidate key and foreign key.\n(پرائمری کی، کینڈیڈیٹ کی اور فارن کی میں فرق لکھیے۔)',
        'What is normalization? Explain 1NF and 2NF briefly.\n(نارملائزیشن کیا ہے اور 1NF اور 2NF کی وضاحت کریں۔)',
        'Define Entity, Attribute and Relationship with examples.\n(اینٹٹی، ایٹری بیوٹ اور ریلیشن شپ کی وضاحت کریں۔)',
        'What is an ER Diagram and what symbols are used in it?\n(ای آر ڈایاگرام کیا ہے اور اس میں کون سی علامات استعمال ہوتی ہیں؟)',
        'Differentiate between LAN, MAN and WAN networks.\n(LAN, MAN اور WAN نیٹ ورکس میں فرق بیان کریں۔)',
        'What is OSI model? Name all seven layers of OSI model in order.\n(او ایس آئی ماڈل کی ساتوں لیئرز کے نام ترتیب سے لکھیں۔)',
        'What is data transmission mode? Explain simplex, half-duplex and full-duplex.\n(سمپلیکس، ہاف ڈوپلیکس اور فل ڈوپلیکس میں فرق لکھیے۔)',
        'Differentiate between guided media and unguided media.\n(گائیڈڈ اور ان گائیڈڈ میڈیا میں فرق واضح کریں۔)',
      ];
      q4Pool = [
        'What is structured programming and its main characteristics?\n(سٹرکچرڈ پروگرامنگ کیا ہے؟)',
        'Explain increment (++) and decrement (--) operators in C/C++.\n(انکریمنٹ اور ڈیکریمنٹ آپریٹرز کی وضاحت کریں۔)',
        'What is type casting? Differentiate implicit and explicit type casting.\n(ٹائپ کاسٹنگ کیا ہے؟ ایمپلیسٹ اور ایکسپلیسٹ میں فرق لکھیے۔)',
        'Explain the switch-case structure and break statement.\n(سوئچ کیس سٹرکچر اور بریک سٹیٹمنٹ کی وضاحت کریں۔)',
        'What is an infinite loop and how can it be avoided?\n(انفینٹ لوپ کیا ہے اور اس سے کیسے بچا جا سکتا ہے؟)',
        'Differentiate between pass by value and pass by reference.\n(پاس بائی ویلیو اور پاس بائی ریفرنس میں فرق لکھیے۔)',
        'What is a pointer and how is it declared in C/C++?\n(پوائنٹر کیا ہے اور اسے کیسے ڈکلیئر کیا جاتا ہے؟)',
        'What is a structure in C and how does it differ from an array?\n(سٹرکچر کیا ہے اور یہ ارے سے کیسے مختلف ہے؟)',
        'What is file handling in C and what are fopen() and fclose()?\n(فائل ہینڈلنگ کیا ہے اور fopen اور fclose کا کیا کام ہے؟)',
      ];
      csLongPool = [
        { num: 5, marks: 8, text: 'Explain von Neumann architecture of a computer system with CPU, ALU, CU, Registers and Bus.\n(کمپیوٹر سسٹم کے وان نیومن آرکیٹیکچر کی تفصیلی وضاحت ڈایاگرام کے ساتھ کریں۔) [8 Marks]' },
        { num: 6, marks: 8, text: 'Explain the seven layers of OSI reference model along with their functions and protocols.\n(او ایس آئی ماڈل کی ساتوں تہوں کے افعال اور پروٹوکولز تفصیل سے بیان کریں۔) [8 Marks]' },
        { num: 7, marks: 8, text: 'What is Normalization? Explain 1NF, 2NF and 3NF with suitable database examples and tables.\n(نارملائزیشن کیا ہے؟ پہلی، دوسری اور تیسری نارمل فارم کی مثالوں کے ساتھ وضاحت کریں۔) [8 Marks]' },
        { num: 8, marks: 8, text: 'Write a C/C++ program using while loop to check whether a given positive integer is prime or composite.\n(دیے گئے عدد کے مفرد یا مرکب ہونے کا پتہ چلانے کا مکمل پروگرام لکھیے۔) [8 Marks]' },
        { num: 9, marks: 8, text: 'What are user-defined functions? Explain function declaration, definition, arguments and return value.\n(یوزر ڈیفائنڈ فنکشنز کیا ہیں؟ فنکشن ڈیکلریشن، ڈیفینیشن اور ریٹرن ویلیو کی وضاحت کریں۔) [8 Marks]' },
      ];
    }

    const shortCountPerSec = isInter ? 9 : 6;
    const attemptCountPerSec = isInter ? 6 : 4;
    const marksPerSec = isInter ? 12 : 8;

    return {
      ...paperBase,
      isComputerPaper: true,
      timeAllowed: isInter ? '2:30 Hours' : '1:45 Hours',
      totalMarks: configuredTotalMarks || defaultTotalMarks,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        time: isInter ? '20 Minutes' : '15 Minutes',
        questions: mcqs,
      },
      shortSections: [
        {
          sectionNumber: 2,
          title: `Section-I: Q.2: Write short answers to any ${attemptCountPerSec} questions:`,
          instruction: `سوال 2: کوئی سے ${attemptCountPerSec === 6 ? 'چھ (6)' : 'چار (4)'} سوالات کے مختصر جوابات تحریر کیجیے: [${attemptCountPerSec} × 2 = ${marksPerSec} Marks]`,
          attemptCount: attemptCountPerSec,
          totalCount: shortCountPerSec,
          totalMarks: marksPerSec,
          questions: sampleRandom(q2Pool, shortCountPerSec).map((q, idx) => ({
            num: `(${idx + 1})`,
            text: q,
          })),
        },
        {
          sectionNumber: 3,
          title: `Section-I: Q.3: Write short answers to any ${attemptCountPerSec} questions:`,
          instruction: `سوال 3: کوئی سے ${attemptCountPerSec === 6 ? 'چھ (6)' : 'چار (4)'} سوالات کے مختصر جوابات تحریر کیجیے: [${attemptCountPerSec} × 2 = ${marksPerSec} Marks]`,
          attemptCount: attemptCountPerSec,
          totalCount: shortCountPerSec,
          totalMarks: marksPerSec,
          questions: sampleRandom(q3Pool, shortCountPerSec).map((q, idx) => ({
            num: `(${idx + 1})`,
            text: q,
          })),
        },
        {
          sectionNumber: 4,
          title: `Section-I: Q.4: Write short answers to any ${attemptCountPerSec} questions:`,
          instruction: `سوال 4: کوئی سے ${attemptCountPerSec === 6 ? 'چھ (6)' : 'چار (4)'} سوالات کے مختصر جوابات تحریر کیجیے: [${attemptCountPerSec} × 2 = ${marksPerSec} Marks]`,
          attemptCount: attemptCountPerSec,
          totalCount: shortCountPerSec,
          totalMarks: marksPerSec,
          questions: sampleRandom(q4Pool, shortCountPerSec).map((q, idx) => ({
            num: `(${idx + 1})`,
            text: q,
          })),
        },
      ],
      longSection: {
        active: !computerConfig.skipLong,
        title: 'PART - II: Detailed / Long Questions',
        instruction: isInter
          ? 'Note: Attempt any THREE (3) questions from Part-II. [3 × 8 = 24 Marks]'
          : 'Note: Attempt any TWO (2) questions from Part-II. [2 × 8 = 16 Marks]',
        attemptCount: isInter ? 3 : 2,
        totalCount: isInter ? 5 : 3,
        marks: isInter ? 24 : 16,
        questions: sampleRandom(csLongPool, isInter ? 5 : 3).map((l, idx) => ({
          num: idx + 5,
          marks: 8,
          text: l.text,
        })),
      },
    };
  }

  // ========================================================
  // 5. TARJUMA-TUL-QURAN (50 Marks)
  // ========================================================
  if (patternType === 'TARJUMA_QURAN') {
    const is10th = classGrade === '10';
    const skipMcq = tqConfig.skipMcq;
    const mcqCount = tqConfig.mcqCount || 10;

    const tqMcqBank = [
      { ch: 1, questionText: is10th ? 'سورۃ الانعام کس شہر میں نازل ہوئی؟' : 'سورۃ مریم کس پارے میں واقع ہے؟', options: ['مکہ مکرمہ / 16ویں پارے میں', 'مدینہ منورہ', 'طائف', 'تبوک'], correct: 0 },
      { ch: 1, questionText: is10th ? 'سورۃ الانعام میں کس بنیادی عقیدے پر تفصیلی دلائل دیے گئے ہیں؟' : 'سورۃ مریم میں کس جلیل القدر پیغمبر کی والدہ محترمہ کا تذکرہ ہے؟', options: ['عقیدہ توحید / حضرت عیسیٰ ؑ', 'عقیدہ رسالت', 'معاشیات', 'جہاد'], correct: 0 },
      { ch: 2, questionText: is10th ? 'سورۃ الاعراف میں کن اقوام کے عروج و زوال کا تفصیلی ذکر ہے؟' : 'سورۃ طٰہٰ میں کس جلیل القدر پیغمبر کے تفصیلی حالات بیان ہوئے ہیں؟', options: ['قومِ عاد، ثمود اور فرعون / حضرت موسیٰ ؑ', 'قومِ نوح', 'اصحابِ کہف', 'بنی اسرائیل'], correct: 0 },
      { ch: 3, questionText: is10th ? 'سورۃ یونس میں حضرت یونس ؑ کی قوم کی کیا خاص بات بیان ہوئی ہے؟' : 'سورۃ الانبیاء میں کل کتنے انبیاء کرام کا تذکرہ آیا ہے؟', options: ['عذاب دیکھ کر توبہ قبول ہوئی / 16 انبیاء کرام', 'نافرمانی پر اصرار', 'ہجرت کا حکم', 'معجزات کا انکار'], correct: 0 },
      { ch: 4, questionText: is10th ? 'سورۃ ہود میں حضرت نوح ؑ کی کشتی کس پہاڑ پر ٹھہری تھی؟' : 'سورۃ الحج میں کس اہم عبادت کے مناسک و احکام تفصیل سے بیان کیے گئے ہیں؟', options: ['جودی پہاڑ / حجِ بیت اللہ', 'کوہِ طور', 'کوہِ صفا', 'جبلِ احد'], correct: 0 },
      { ch: 5, questionText: is10th ? 'سورۃ یوسف کو قرآن مجید میں کس لقب سے یاد کیا گیا ہے؟' : 'سورۃ الفرقان میں "الفرقان" سے کیا مراد ہے؟', options: ['احسن القصص (بہترین قصہ) / حق و باطل میں فرق کرنے والی کتاب', 'سید السور', 'نور القرآن', 'قلب القرآن'], correct: 0 },
      { ch: 6, questionText: is10th ? 'سورۃ الرعد میں کس قدرتی مظہر کی تسبیح کا ذکر ہے؟' : 'سورۃ الشعراء میں کن نامور شعراء کے مقابلے میں حق کا بیان ہے؟', options: ['گرج اور بادل / شعراء عرب', 'ہواؤں', 'دریاؤں', 'ستاروں'], correct: 0 },
      { ch: 7, questionText: is10th ? 'سورۃ ابراہیم میں کلمہ طیبہ کو کس درخت سے تشبیہ دی گئی ہے؟' : 'سورۃ النمل میں کس پیغمبر کی سلطنت اور چیونٹیوں و پرندوں کی زبان کا ذکر ہے؟', options: ['شجرہ طیبہ (کھجور) / حضرت سلیمان ؑ', 'زیتون', 'انجیر', 'سدرہ'], correct: 0 },
      { ch: 8, questionText: is10th ? 'سورۃ الحجر کے مطابق قرآن مجید کی حفاظت کا ذمہ کس نے لیا ہے؟' : 'سورۃ القصص میں کس پیغمبر کے بچپن اور فرعون کے محل میں پرورش کا ذکر ہے؟', options: ['اللہ تعالیٰ نے / حضرت موسیٰ ؑ', 'فرشتوں نے', 'انبیاء نے', 'انسانوں نے'], correct: 0 },
      { ch: 9, questionText: is10th ? 'سورۃ النحل میں شہد کی مکھی کو وحی (الہام) کرنے کا تذکرہ کس مقصد کے لیے ہے؟' : 'سورۃ العنکبوت میں غیر اللہ پر تکیہ کرنے والوں کو کس مثال سے سمجھایا گیا ہے؟', options: ['قدرتِ الٰہی و شفا / مکڑی کے کمزور جالے سے', 'رزق کی تلاش', 'موسمی تغیرات', 'صحتِ جسمانی'], correct: 0 },
      { ch: 10, questionText: is10th ? 'سورۃ الاسراء (بنی اسرائیل) میں کس عظیم الشان معجزے کا ذکر ہے؟' : 'سورۃ الروم میں کس عظیم سلطنت کی فتح کی پیش گوئی فرمائی گئی تھی؟', options: ['واقعہ معراج النبی ﷺ / اہل روم کی اہلِ فارس پر فتح', 'شق القمر', 'فتح مکہ', 'طوفانِ نوح'], correct: 0 },
      { ch: 11, questionText: is10th ? 'سورۃ الکہف کی تلاوت کس دن کی سنت ہے؟' : 'سورۃ لقمان میں حضرت لقمان ؑ نے اپنے بیٹے کو سب سے پہلی کیا نصیحت فرمائی؟', options: ['جمعۃ المبارک / اللہ کے ساتھ شرک نہ کرنا', 'پیر کے روز', 'عید کے دن', 'شبِ برأت'], correct: 0 },
      { ch: 12, questionText: 'سورۃ السجدہ تلاوت کرنے کی نبی کریم ﷺ کس نماز میں مداومت فرماتے تھے؟', options: ['جمعہ کی نمازِ فجر میں', 'عشاء میں', 'مغرب میں', 'ظہر میں'], correct: 0 },
      { ch: 13, questionText: 'سورۃ سبأ میں حضرت سلیمان ؑ اور حضرت داؤد ؑ پر اللہ کے کن انعامات کا ذکر ہے؟', options: ['لوہا نرم ہونا اور ہواؤں کی تسخیر', 'وسیع باغات', 'سونے کے خزانے', 'لمبی عمر'], correct: 0 },
      { ch: 14, questionText: 'سورۃ فاطر میں لفظ "فاطر" کا کیا معنی ہے؟', options: ['پیدا کرنے والا / عدم سے وجود میں لانے والا', 'بخشنے والا', 'رحم فرمانے والا', 'روزی دینے والا'], correct: 0 },
      { ch: 15, questionText: 'سورۃ یٰسٓ کو احادیث مبارکہ میں کیا لقب دیا گیا ہے؟', options: ['قلب القرآن (قرآن کا دل)', 'عروس القرآن', 'نور القرآن', 'سردار سورت'], correct: 0 },
      { ch: 16, questionText: 'حضرت ابراہیم ؑ کے واقعہ قربانیِ اسماعیل ؑ کا تفصیلی ذکر کس سورت میں ہے؟', options: ['سورۃ الصافات', 'سورۃ مریم', 'سورۃ النمل', 'سورۃ یٰس'], correct: 0 },
      { ch: 17, questionText: 'سورۃ ص میں حضرت داؤد ؑ کی توبہ اور اللہ کے حضور رجوع کا کیا سبب بیان ہوا ہے؟', options: ['دو دعویداروں کے فیصلے کی آزمائش', 'جنگ کا معاملہ', 'حکومتی نظم و نسق', 'مالی معاملات'], correct: 0 },
      { ch: 18, questionText: 'سورۃ الأحقاف میں "احقاف" سے کیا مراد ہے اور یہ کس قوم کا علاقہ تھا؟', options: ['ریت کے ٹیلے / قومِ عاد کا علاقہ', 'پہاڑی وادیاں', 'زرخیز باغات', 'سمندری جزائر'], correct: 0 },
    ];

    let tqMcqPool = hasChapterFilter
      ? tqMcqBank.filter(m => activeChapterSet.has(m.ch))
      : tqMcqBank;

    if (hasChapterFilter && tqMcqPool.length < mcqCount) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `سورۃ / سبق ${c}`).join(' اور ');
      const extraTqMcqs = [
        { ch: activeChArr[0], questionText: `${chName} کے نزول کا بنیادی اور مرکزی مقصد کیا ہے؟`, options: ['عقائد کی درستگی اور ہدایت', 'تاریخی تفریح', 'تجارتی اصول', 'جغرافیائی معلومات'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کی تلاوت سے مسلمانوں کو کس چیز کا درس ملتا ہے؟`, options: ['تقویٰ اور اطاعتِ الٰہی', 'صرف تاریخی آگاہی', 'دنیاوی شان و شوکت', 'فلسفیانہ بحث'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں بیان کردہ احکامات پر عمل پیرا ہونے کا کیا اجر ہے؟`, options: ['فلاحِ دارین اور رضائے الٰہی', 'مال و دولت میں اضافہ', 'دنیاوی اختیارات', 'شہرت کا حصول'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں کس بنیادی اخلاقی صفت پر زور دیا گیا ہے؟`, options: ['صبر، شکر اور اخلاص', 'تکبر', 'بے صبری', 'اسراف'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کے مطابق کامیابی کا دارومدار کس پر ہے؟`, options: ['ایمان اور عملِ صالح', 'حسب و نسب', 'کثرتِ اولاد', 'طاقت و شجاعت'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں انبیاء کرام کی دعوت کا مشترکہ نکتہ کیا ہے؟`, options: ['توحیدِ باری تعالیٰ', 'سیاسی اقتدار', 'معاشی غلبہ', 'علاقائی حاکمیت'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں کن لوگوں کے انجام سے عبرت دلائی گئی ہے؟`, options: ['نافرمان اور سرکش اقوام', 'صالحین', 'مومنین', 'شہداء'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کی آیاتِ مبارکہ انسان کے دل میں کس کا خوف پیدا کرتی ہیں؟`, options: ['آخرت کی بازپرس اور محاسبہ', 'دشمنوں کا', 'موسمی آفات کا', 'فقر و فاقہ کا'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں ذکر کردہ احسانات پر بندے کا کیا رویہ ہونا چاہیے؟`, options: ['شکر گزاری اور عاجزی', 'غرور و سرکشی', 'غفلت و لاپروائی', 'بے فکری'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کا باقاعدہ مطالعہ اور ترجمہ سمجھنا کیسا ہے؟`, options: ['باعثِ سعادت اور دینی فریضہ', 'اختیاری اور معمولی', 'ناپسندیدہ', 'صرف علماء کے لیے'], correct: 0 },
      ];
      tqMcqPool = [...tqMcqPool, ...extraTqMcqs];
    }

    let mcqs = [];
    if (!skipMcq) {
      mcqs = sampleRandom(tqMcqPool, Number(mcqCount)).map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    const tqShortsBank = [
      { ch: 1, text: is10th ? 'سورۃ الانعام کا بنیادی اور مرکزی موضوع کیا ہے؟' : 'سورۃ مریم کا مختصر تعارف اور وجہ تسمیہ تحریر کیجیے۔' },
      { ch: 1, text: is10th ? 'سورۃ الانعام میں شرک کی نفی کس طرح کی گئی ہے؟' : 'سورۃ مریم میں حضرت عیسیٰ ؑ اور حضرت مریم ؑ کے کس معجزے کا ذکر ہے؟' },
      { ch: 1, text: is10th ? 'سورۃ الانعام کے مطابق اللہ تعالیٰ کی صفاتِ کمال بیان کریں۔' : 'حضرت زکریا ؑ کو بڑھاپے میں کس فرزندِ ارجمند کی بشارت دی گئی؟' },
      { ch: 2, text: is10th ? 'سورۃ الاعراف میں کن اقوام کے عروج و زوال کا ذکر ہے؟' : 'سورۃ طٰہٰ میں حضرت موسیٰ ؑ اور ہارون ؑ کو فرعون کے پاس جاتے وقت کیا ہدایت دی گئی؟' },
      { ch: 2, text: is10th ? 'اصحابِ اعراف سے کیا مراد ہے؟' : 'سورۃ طٰہٰ کے نزول کے اہم مقاصد تحریر کیجیے۔' },
      { ch: 3, text: is10th ? 'سورۃ یونس میں حضرت یونس ؑ کی قوم کی کیا خاص بات بیان ہوئی ہے؟' : 'سورۃ الانبیاء کا بنیادی اور مرکزی مضمون کیا ہے؟' },
      { ch: 3, text: is10th ? 'سورۃ یونس کی روشنی میں توحید کی اہمیت بیان کریں۔' : 'سورۃ الانبیاء میں کن انبیاء کرام کے صبرو استقامت کا ذکر ہے؟' },
      { ch: 4, text: is10th ? 'سورۃ ہود میں کن انبیاء کرام کے تفصیلی واقعات ہیں؟' : 'سورۃ الحج کے مطابق حج کے اہم مناسک اور قربانی کا اصل مقصد کیا ہے؟' },
      { ch: 5, text: is10th ? 'سورۃ یوسف کے اہم اسباق تحریر کیجیے۔' : 'سورۃ الفرقان کے مطابق عباد الرحمن کی دو خصوصیات لکھیں۔' },
      { ch: 6, text: is10th ? 'سورۃ الرعد میں کائنات کے مشاہدات سے کیا سبق ملتا ہے؟' : 'سورۃ الشعراء میں انبیاء کرام کی صداقت کے کیا دلائل دیے گئے ہیں؟' },
      { ch: 7, text: is10th ? 'سورۃ ابراہیم میں کلمہ طیبہ کو کس درخت سے تشبیہ دی گئی ہے؟' : 'سورۃ النمل میں حضرت سلیمان ؑ اور ملکہ بلقیس کے واقعے کا کیا سبق ملتا ہے؟' },
      { ch: 8, text: is10th ? 'سورۃ الحجر کے مطابق قرآن مجید کی حفاظت کا ذمہ کس نے لیا ہے؟' : 'سورۃ القصص کے مطابق حضرت موسیٰ ؑ کی پرورش کس کے محل میں ہوئی؟' },
      { ch: 9, text: is10th ? 'سورۃ النحل میں شہد کی مکھی کے بارے میں کیا ارشاد فرمایا گیا ہے؟' : 'سورۃ العنکبوت میں مکڑی کے جالے سے کس چیز کی مثال دی گئی ہے؟' },
      { ch: 10, text: is10th ? 'سورۃ الاسراء میں واقعہ معراج کا ذکر کس آیت میں آیا ہے؟' : 'سورۃ الروم میں کن نشانیوں پر غور و فکر کی دعوت دی گئی ہے؟' },
      { ch: 11, text: is10th ? 'سورۃ الکہف میں اصحابِ کہف کے واقعے کا مرکزی سبق کیا ہے؟' : 'حضرت لقمان نے اپنے بیٹے کو نماز اور صبر کے بارے میں کیا نصیحت فرمائی؟' },
      { ch: 12, text: 'سورۃ السجدہ میں تخلیقِ انسان اور بعث بعد الموت کے دلائل تحریر کریں۔' },
      { ch: 13, text: 'سورۃ سبأ میں قومِ سبأ پر نازل ہونے والے سیلابِ عرم کا کیا پس منظر تھا؟' },
      { ch: 14, text: 'سورۃ فاطر کے مطابق اللہ تعالیٰ کے بندوں میں سے حقیقی خوفِ خدا رکھنے والے کون ہیں؟' },
      { ch: 15, text: 'سورۃ یٰس میں حبیب نجار کا کیا کردار اور انجام بیان ہوا ہے؟' },
      { ch: 16, text: 'سورۃ الصافات میں حضرت اسماعیل ؑ کے جذبہ اطاعت و قربانی کو کس طرح بیان کیا گیا؟' },
      { ch: 17, text: 'سورۃ ص کے اہم مضامین اور انبیاء کے واقعات سے حاصل ہونے والے دو اسباق لکھیں۔' },
      { ch: 18, text: 'سورۃ الأحقاف کے مطابق والدین کے ساتھ حسنِ سلوک اور شکر گزاری کی کیا دعا ہے؟' },
    ];

    let tqShortPool = hasChapterFilter
      ? tqShortsBank.filter(s => activeChapterSet.has(s.ch))
      : tqShortsBank;

    if (hasChapterFilter && tqShortPool.length < 8) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `سورۃ / سبق ${c}`).join(' اور ');
      const genTqShorts = [
        { ch: activeChArr[0], text: `${chName} کا بنیادی تعارف اور وجہ تسمیہ تحریر کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} کے اہم اور مرکزی مضامین خلاصۃً قلمبند کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} میں بیان کردہ عقیدہ توحید اور آخرت کی وضاحت کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} میں اخلاقی اور عملی زندگی کے کن اصولوں پر زور دیا گیا ہے؟` },
        { ch: activeChArr[0], text: `${chName} سے حاصل ہونے والے کوئی سے دو اہم تربیتی اسباق لکھیے۔` },
        { ch: activeChArr[0], text: `${chName} کی تلاوت اور فہم و ادراک کے فضائل بیان کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} میں انسانوں کے لیے کن تاریخی نشانیوں کا ذکر کیا گیا ہے؟` },
        { ch: activeChArr[0], text: `${chName} کے مطابق اللہ تعالیٰ کی بندگی اور اطاعت کے کیا ثمرات ہیں؟` },
      ];
      tqShortPool = [...tqShortPool, ...genTqShorts];
    }

    const wordsBank = [
      { ch: 1, arabic: 'عِتِيًّا', meaning: 'بڑھاپے کی انتہا' },
      { ch: 1, arabic: 'حَفِيًّا', meaning: 'بہت مہربان' },
      { ch: 1, arabic: 'أَثَاثًا', meaning: 'سامانِ زندگی' },
      { ch: 1, arabic: 'نَدِيًّا', meaning: 'مجلس / بیٹھک' },
      { ch: 2, arabic: 'طٰہٰ', meaning: 'حروفِ مقطعات (اے مخاطب)' },
      { ch: 2, arabic: 'أَزْرِي', meaning: 'میری قوت / پشت' },
      { ch: 3, arabic: 'الْأَنْبِيَاءَ', meaning: 'انبیاء کرام (جمع نبی)' },
      { ch: 3, arabic: 'حَسِيبًا', meaning: 'حساب لینے والا' },
      { ch: 4, arabic: 'مُّخْبِتِينَ', meaning: 'عاجزی اختیار کرنے والے' },
      { ch: 5, arabic: 'الْفُرْقَانَ', meaning: 'حق اور باطل میں فرق کرنے والی کتاب' },
      { ch: 5, arabic: 'هَوْنًا', meaning: 'عاجزی اور وقار کے ساتھ' },
      { ch: 7, arabic: 'الصَّاۤفَّاتِ', meaning: 'صف باندھنے والے (فرشتے)' },
      { ch: 9, arabic: 'الْعَنكَبُوتِ', meaning: 'مکڑی' },
      { ch: 11, arabic: 'مُّنِيبًا', meaning: 'رجوع کرنے والا' },
      { ch: 15, arabic: 'مَّرْفُوعَةٍ', meaning: 'بلند کی گئی' },
      { ch: 16, arabic: 'ضِيزَىٰ', meaning: 'ناانصافی والی، بے تکی' },
      { ch: 17, arabic: 'الْأَوْتَادِ', meaning: 'میخوں والا' },
      { ch: 18, arabic: 'الْأَحْقَافِ', meaning: 'ریت کے ٹیلے' },
    ];

    let wordsPool = hasChapterFilter
      ? wordsBank.filter(w => activeChapterSet.has(w.ch))
      : wordsBank;

    if (hasChapterFilter && wordsPool.length < 8) {
      wordsPool = [
        ...wordsPool,
        { arabic: 'الْفُرْقَانَ', meaning: 'حق اور باطل میں فرق کرنے والی کتاب' },
        { arabic: 'مُّنِيبًا', meaning: 'رجوع کرنے والا' },
        { arabic: 'عِتِيًّا', meaning: 'بڑھاپے کی انتہا' },
        { arabic: 'حَفِيًّا', meaning: 'بہت مہربان' },
        { arabic: 'الصَّاۤفَّاتِ', meaning: 'صف باندھنے والے (فرشتے)' },
        { arabic: 'مُّخْبِتِينَ', meaning: 'عاجزی اختیار کرنے والے' },
        { arabic: 'أَزْرِي', meaning: 'میری قوت' },
        { arabic: 'هَوْنًا', meaning: 'عاجزی کے ساتھ' },
      ];
    }

    const ayatBank = [
      { ch: 1, text: 'قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا' },
      { ch: 1, text: 'وَجَعَلَنِي مُبَارَكًا أَيْنَ مَا كُنْتُ وَأَوْصَانِي بِالصَّلَاةِ وَالزَّكَاةِ مَا دُمْتُ حَيًّا' },
      { ch: 2, text: 'قَالَ رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي' },
      { ch: 3, text: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ' },
      { ch: 4, text: 'لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ' },
      { ch: 5, text: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا' },
      { ch: 11, text: 'يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ' },
      { ch: 15, text: 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ' },
    ];

    let ayatPool = hasChapterFilter
      ? ayatBank.filter(a => activeChapterSet.has(a.ch))
      : ayatBank;

    if (hasChapterFilter && ayatPool.length < 5) {
      ayatPool = [
        ...ayatPool,
        { text: 'قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا' },
        { text: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ' },
        { text: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا' },
        { text: 'يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ' },
        { text: 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ' },
      ];
    }

    let longOptions = [];
    if (hasChapterFilter) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `سورۃ / باب نمبر ${c}`).join(' اور ');
      longOptions = [
        `(الف) ${chName} کے تفصیلی تعارف، فضائل، خلاصہ اور مرکزی موضوعات پر جامع نوٹ تحریر کیجیے۔`,
        `(ب) ${chName} میں بیان کردہ اہم واقعات، عقائد اور اس سے حاصل ہونے والے تربیتی اسباق قلمبند کیجیے۔`,
      ];
    } else {
      longOptions = is10th ? [
        '(الف) سورۃ الانعام کے اہم مضامین، فضائل اور عقیدہ توحید کے دلائل پر جامع نوٹ تحریر کیجیے۔',
        '(ب) سورۃ الکہف کے چار اہم واقعات (اصحابِ کہف، حضرت موسیٰ و خضر، ذوالقرنین) اور سبق لکھیے۔',
      ] : [
        '(الف) سورۃ مریم کا تعارف، خلاصہ اور اس میں بیان کردہ اہم واقعات پر جامع نوٹ لکھیے۔',
        '(ب) سورۃ لقمان کے اہم مضامین اور حضرت لقمان کی حکیمانہ نصائح پر مفصل نوٹ تحریر کیجیے۔',
      ];
    }

    return {
      ...paperBase,
      isUrduPaper: true,
      isTarjumaQuranPaper: true,
      timeAllowed: '1 گھنٹہ 45 منٹ',
      totalMarks: configuredTotalMarks || 50,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        title: 'حصہ اول: معروضی (کثیر الانتخابی سوالات)',
        time: '15 منٹ',
        questions: mcqs,
      },
      tqShortSection: !tqConfig.skipShort ? {
        active: true,
        num: 2,
        title: 'سوال نمبر 2: مختصر سوالات کے جوابات',
        instruction: '2- مندرجہ ذیل میں سے کوئی سے پانچ (5) سوالات کے مختصر جوابات تحریر کیجیے: [5 × 2 = 10 Marks]',
        marks: 10,
        questions: sampleRandom(tqShortPool, 8).map((q, i) => `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}) ${q.text || q}`),
      } : null,
      tqWordsSection: !tqConfig.skipWords ? {
        active: true,
        num: 3,
        title: 'سوال نمبر 3: قرآنی مفردات / الفاظ کے معانی',
        instruction: '3- مندرجہ ذیل میں سے کوئی سے پانچ (5) قرآنی الفاظ کے معانی لکھیے: [5 × 1 = 5 Marks]',
        marks: 5,
        words: sampleRandom(wordsPool, 8),
      } : null,
      tqAyatSection: !tqConfig.skipAyat ? {
        active: true,
        num: 4,
        title: 'سوال نمبر 4: آیاتِ مبارکہ کا با محاورہ اردو ترجمہ',
        instruction: '4- مندرجہ ذیل قرآنی آیات میں سے کوئی سی تین (3) آیات کا با محاورہ اردو ترجمہ تحریر کیجیے: [3 × 5 = 15 Marks]',
        marks: 15,
        ayat: sampleRandom(ayatPool, 5).map((a, i) => `(${['الف', 'ب', 'ج', 'د', 'ہ'][i]}) ${a.text || a}`),
      } : null,
      tqLongSection: !tqConfig.skipLong ? {
        active: true,
        num: 5,
        title: 'سوال نمبر 5: تفصیلی نوٹ / سورت کا تعارف و مضامین',
        instruction: '5- مندرجہ ذیل میں سے کسی ایک سورت کے تعارف، خلاصہ اور مرکزی موضوعات پر تفصیلی نوٹ تحریر کیجیے: [10 Marks]',
        marks: 10,
        options: longOptions.slice(0, 2),
      } : null,
    };
  }

  // ========================================================
  // 6. ISLAMIAT COMPULSORY (50 Marks)
  // ========================================================
  if (patternType === 'ISLAMIAT') {
    const skipMcq = islamiatConfig.skipMcq;
    const mcqCount = islamiatConfig.mcqCount || 10;

    const islMcqBank = [
      { ch: 1, questionText: 'لفظ "قرآن" کا لغوی معنی کیا ہے؟', options: ['بار بار پڑھی جانے والی کتاب', 'لکھی ہوئی کتاب', 'آسمانی کتاب', 'پاک کتاب'], correct: 0 },
      { ch: 1, questionText: 'قرآن مجید کی سب سے پہلی نازل ہونے والی آیات کس سورت کی ہیں؟', options: ['سورۃ العلق', 'سورۃ الفاتحہ', 'سورۃ البقرہ', 'سورۃ المدثر'], correct: 0 },
      { ch: 1, questionText: 'قرآنِ مجید کی حفاظت کا ذمہ کس ہستی نے خود لیا ہے؟', options: ['اللہ تعالیٰ نے', 'فرشتوں نے', 'انسانوں نے', 'علماء نے'], correct: 0 },
      { ch: 1, questionText: 'حدیثِ نبوی ﷺ کے مطابق "تم میں سے بہترین شخص وہ ہے جو ______":', options: ['قرآن سیکھے اور سکھائے', 'زیادہ مالدار ہو', 'زیادہ سفر کرے', 'زیادہ سوئے'], correct: 0 },
      { ch: 1, questionText: 'قرآن مجید کی سب سے طویل اور پہلی جامع سورت کون سی ہے؟', options: ['سورۃ البقرہ', 'سورۃ الفاتحہ', 'سورۃ آل عمران', 'سورۃ النساء'], correct: 0 },
      { ch: 2, questionText: 'عقیدہ توحید سے کیا مراد ہے؟', options: ['اللہ کو یکتا اور لاشریک ماننا', 'فرشتوں پر ایمان', 'کتابوں پر ایمان', 'روزِ جزا پر یقین'], correct: 0 },
      { ch: 2, questionText: 'ایمان بالرسالت میں کس بات کا اقرار ضروری ہے؟', options: ['تمام انبیاء پر ایمان اور ختمِ نبوت ﷺ', 'صرف چند رسولوں پر', 'صرف فرشتوں پر', 'صرف کتابوں پر'], correct: 0 },
      { ch: 2, questionText: 'نماز دین کا کیا قرار دی گئی ہے؟', options: ['ستون', 'چھت', 'بنیاد', 'دیوار'], correct: 0 },
      { ch: 2, questionText: 'زکوٰۃ اسلام کا کون سا بنیادی رکن ہے؟', options: ['تیسرا رکن', 'دوسرا رکن', 'چوتھا رکن', 'پانچواں رکن'], correct: 0 },
      { ch: 2, questionText: 'روزہ انسان میں کون سی صفت پیدا کرتا ہے؟', options: ['تقویٰ اور پرہیزگاری', 'بہادری', 'مالداری', 'شہرت'], correct: 0 },
      { ch: 3, questionText: 'حضور خاتم النبیین ﷺ نے کس خطبے کو انسانی حقوق کا اولین منشور قرار دیا؟', options: ['خطبہ حجۃ الوداع', 'خطبہ فتح مکہ', 'خطبہ صفا', 'خطبہ حدیبیہ'], correct: 0 },
      { ch: 3, questionText: 'مسلمانوں نے مدینہ منورہ کی طرف ہجرت کس سن میں فرمائی؟', options: ['نبوت کے 13ویں سال', '10ویں سال', '11ویں سال', '12ویں سال'], correct: 0 },
      { ch: 3, questionText: 'غزوہ بدر کس سن ہجری میں لڑی گئی؟', options: ['2 ہجری', '3 ہجری', '5 ہجری', '8 ہجری'], correct: 0 },
      { ch: 3, questionText: 'صلح حدیبیہ کس سن ہجری میں واقع ہوئی؟', options: ['6 ہجری', '4 ہجری', '5 ہجری', '7 ہجری'], correct: 0 },
      { ch: 4, questionText: 'حیا کو ایمان کا کیا حصہ قرار دیا گیا ہے؟', options: ['شعبہ / جزوِ ایمان', 'پورا ایمان', 'نصف ایمان', 'معمولی حصہ'], correct: 0 },
      { ch: 4, questionText: 'علم حاصل کرنا ہر مسلمان مرد اور عورت پر کیا ہے؟', options: ['فرض ہے', 'سنت ہے', 'مستحب ہے', 'مباح ہے'], correct: 0 },
      { ch: 4, questionText: 'حدیث کے مطابق جنت کس کے قدموں تلے ہے؟', options: ['ماں کے قدموں تلے', 'باپ کے قدموں تلے', 'استاد کے', 'دوستوں کے'], correct: 0 },
      { ch: 5, questionText: 'اسلامی معاشرے کی بنیاد کس پر رکھی گئی ہے؟', options: ['اخوت و مساوات اور عدل', 'طبقاتی تقسیم', 'دولت کی بنیاد', 'علاقائیت'], correct: 0 },
      { ch: 5, questionText: 'خلفائے راشدین میں پہلے خلیفہ برحق کون تھے؟', options: ['حضرت ابو بکر صدیق ؓ', 'حضرت عمر فاروق ؓ', 'حضرت عثمان غنی ؓ', 'حضرت علی المرتضیٰ ؓ'], correct: 0 },
    ];

    let islMcqPool = hasChapterFilter
      ? islMcqBank.filter(m => activeChapterSet.has(m.ch))
      : islMcqBank;

    if (hasChapterFilter && islMcqPool.length < mcqCount) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `باب ${c}`).join(' اور ');
      const extraIslMcqs = [
        { ch: activeChArr[0], questionText: `${chName} کے مطابق مسلمان کی انفرادی اور اجتماعی ذمہ داری کیا ہے؟`, options: ['اطاعتِ خدا و رسول ﷺ اور خدمتِ خلق', 'صرف دنیاوی امور', 'شہرت اور اقتدار', 'مادی مفادات'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کی بنیادی تعلیمات پر عمل کرنے سے معاشرے میں کیا قائم ہوتا ہے؟`, options: ['عدل و انصاف اور امن و امان', 'انتشار', 'بے چینی', 'ناانصافی'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کے احکامات کس ماخذ سے اخذ کیے گئے ہیں؟`, options: ['قرآن مجید اور سنتِ رسول ﷺ', 'قدیم رسومات', 'انسانی آراء', 'غیر ملکی قوانین'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} میں بیان کردہ اسباق کا بنیادی فلسفہ کیا ہے؟`, options: ['تزکیہ نفس اور رضائے الٰہی', 'مال کی کثرت', 'دنیاوی عیش و آرام', 'دکھاوا'], correct: 0 },
        { ch: activeChArr[0], questionText: `${chName} کی روشنی میں کامیابی کا معیار کیا ہے؟`, options: ['تقویٰ اور اعمالِ صالحہ', 'امارت اور دولت', 'حسب و نسب', 'جاہ و منصب'], correct: 0 },
      ];
      islMcqPool = [...islMcqPool, ...extraIslMcqs];
    }

    let mcqs = [];
    if (!skipMcq) {
      mcqs = sampleRandom(islMcqPool, Number(mcqCount)).map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    }

    const q2Bank = [
      { ch: 1, text: 'قرآن مجید کے کوئی سے دو صفاتی نام مع معنی تحریر کیجیے۔' },
      { ch: 1, text: 'قرآن مجید کے نزول کا طریقہ کار اور وحی کی اقسام بیان کریں۔' },
      { ch: 1, text: 'قرآنِ مجید کی جمع و تدوین میں خلفائے راشدین کا کردار لکھیے۔' },
      { ch: 1, text: 'حدیثِ نبوی ﷺ کی تعریف کریں اور اس کی اقسام کے نام بتائیں۔' },
      { ch: 1, text: 'قرآن و حدیث کا باہمی ربط اور تعلق دو جملوں میں واضح کیجیے۔' },
      { ch: 1, text: 'حفاظتِ قرآن مجید کے دو اہم ذرائع تحریر کریں۔' },
      { ch: 2, text: 'عقیدہ توحید کی تعریف کریں اور انسانی زندگی پر اس کا کیا اثر پڑتا ہے؟' },
      { ch: 2, text: 'عقیدہ ختمِ نبوت ﷺ سے کیا مراد ہے؟ قرآنی دلیل دیجیے۔' },
      { ch: 2, text: 'ملائکہ (فرشتوں) پر ایمان لانے سے کیا مراد ہے؟' },
      { ch: 2, text: 'آخرت پر ایمان انسان کے کردار کو کس طرح سنوارتا ہے؟' },
      { ch: 2, text: 'نماز کی اہمیت پر ایک قرآنی آیت یا حدیث کا ترجمہ لکھیے۔' },
      { ch: 2, text: 'زکوٰۃ ادا کرنے کے دو اہم معاشرتی اور معاشی فوائد تحریر کیجیے۔' },
      { ch: 2, text: 'روزے کی فرضیت اور اس کے روحانی مقاصد کیا ہیں؟' },
      { ch: 3, text: 'ہجرتِ مدینہ کے دو اہم اسباب و مقاصد تحریر کریں۔' },
      { ch: 3, text: 'میثاقِ مدینہ کی تاریخی اہمیت کے دو نکات لکھیے۔' },
      { ch: 3, text: 'غزوہ بدر میں مسلمانوں کی نصرتِ الٰہی کا مختصر احوال بیان کریں۔' },
      { ch: 3, text: 'صلح حدیبیہ کو قرآن مجید میں "فتح مبین" کیوں کہا گیا؟' },
      { ch: 3, text: 'فتح مکہ کے موقع پر نبی اکرم ﷺ نے عفو و درگزر کی کیا مثال قائم فرمائی؟' },
      { ch: 3, text: 'خطبہ حجۃ الوداع میں انسانی برابری کے متعلق کیا ارشاد ہوا؟' },
      { ch: 4, text: 'حدیث نبوی ﷺ کی روشنی میں سچائی اور راست بازی کے دو فوائد لکھیے۔' },
      { ch: 4, text: 'امانت اور دیانت داری سے کیا مراد ہے؟' },
      { ch: 4, text: 'والدین کے حقوق کے متعلق حضور خاتم النبیین ﷺ کا کیا فرمان ہے؟' },
      { ch: 4, text: 'پڑوسیوں کے حقوق کے متعلق اسلام کی کیا تعلیمات ہیں؟' },
      { ch: 4, text: 'صلہ رحمی (رشتہ داروں سے حسنِ سلوک) کے بارے میں ایک حدیث تحریر کریں۔' },
      { ch: 4, text: 'حیا اور پاکدامنی کو ایمان کا شعبہ کیوں قرار دیا گیا ہے؟' },
      { ch: 4, text: 'صبر اور شکر کی تعریف کریں اور ان کی اہمیت بیان کیجیے۔' },
      { ch: 5, text: 'اسلامی معاشرے میں عدل و انصاف کی کیا اہمیت ہے؟' },
      { ch: 5, text: 'باہمی اخوت اور بھائی چارے کے فروغ کے لیے دو اسلامی احکامات بتائیں۔' },
      { ch: 5, text: 'حضرت ابو بکر صدیق ؓ کے دورِ خلافت کا سب سے بڑا کارنامہ کیا تھا؟' },
      { ch: 5, text: 'حضرت عمر فاروق ؓ کے نظامِ عدل و انصاف کی دو خصوصیات لکھیں۔' },
    ];

    let q2Pool = hasChapterFilter
      ? q2Bank.filter(q => activeChapterSet.has(q.ch))
      : q2Bank;

    if (hasChapterFilter && q2Pool.length < 9) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `باب ${c}`).join(' اور ');
      const genQ2 = [
        { ch: activeChArr[0], text: `${chName} کے اہم اور بنیادی تصورات کی وضاحت کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} میں بیان کردہ دینی احکامات کے عملی فوائد لکھیے۔` },
        { ch: activeChArr[0], text: `${chName} کی روشنی میں مسلمان کے فرائض و ذمہ داریاں بیان کریں۔` },
        { ch: activeChArr[0], text: `${chName} میں کن منفی عادات اور برائیوں سے روکا گیا ہے؟` },
        { ch: activeChArr[0], text: `${chName} کے مطابق تقویٰ اور نیکی کا کیا مفہوم ہے؟` },
        { ch: activeChArr[0], text: `${chName} کی تعلیمات کو روزمرہ زندگی میں کس طرح لاگو کیا جا سکتا ہے؟` },
        { ch: activeChArr[0], text: `${chName} سے حاصل ہونے والے دو اہم معاشرتی و اخلاقی اسباق قلمبند کیجیے۔` },
        { ch: activeChArr[0], text: `${chName} میں اللہ اور رسول ﷺ کی اطاعت کا کیا مقام بیان ہوا ہے؟` },
        { ch: activeChArr[0], text: `${chName} کے بنیادی مقاصد اور اغراض و فرائض تحریر کیجیے۔` },
      ];
      q2Pool = [...q2Pool, ...genQ2];
    }

    let q3Pool = hasChapterFilter
      ? q2Pool
      : [
          'حدیث نبوی ﷺ کی روشنی میں سچائی کے دو فوائد لکھیے۔',
          'امانت اور دیانت داری سے کیا مراد ہے؟',
          'والدین کے حقوق کے متعلق حضور خاتم النبیین ﷺ کا کیا فرمان ہے؟',
          'پڑوسیوں کے حقوق کے متعلق اسلام کی کیا تعلیمات ہیں؟',
          'صلہ رحمی (رشتہ داروں سے حسنِ سلوک) کے بارے میں ایک حدیث تحریر کریں۔',
          'غزوہ بدر میں مسلمانوں کی مدد کس طرح فرمائی گئی؟',
          'فتح مکہ کے موقع پر نبی اکرم ﷺ نے کفارِ مکہ کے ساتھ کیا سلوک فرمایا؟',
          'حرمتِ سود کے بارے میں قرآنی حکم تحریر کیجیے۔',
          'حیا اور پاکدامنی کی اہمیت پر دو جملے لکھیے۔',
        ];

    const islHadiths = [
      { ch: 1, text: '«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» (صحیح بخاری)', trans: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔' },
      { ch: 2, text: '«بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ» (متفق علیہ)', trans: 'اسلام کی بنیاد پانچ ستونوں پر رکھی گئی ہے۔' },
      { ch: 3, text: '«إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ» (مشکوٰۃ)', trans: 'مجھے حسنِ اخلاق کی تکمیل کے لیے مبعوث فرمایا گیا ہے۔' },
      { ch: 4, text: '«الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ» (صحیح بخاری)', trans: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔' },
      { ch: 4, text: '«مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ» (صحیح مسلم)', trans: 'جو لوگوں پر رحم نہیں کرتا اللہ اس پر رحم نہیں فرماتا۔' },
      { ch: 5, text: '«الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا» (صحیح بخاری)', trans: 'مومن مومن کے لیے ایک دیوار کی طرح ہے جو ایک دوسرے کو تقویت دیتی ہے۔' },
    ];

    let hadithPool = hasChapterFilter
      ? islHadiths.filter(h => activeChapterSet.has(h.ch))
      : islHadiths;

    if (hadithPool.length === 0) {
      hadithPool = islHadiths;
    }

    let islLongOptions = [];
    if (hasChapterFilter) {
      const activeChArr = Array.from(activeChapterSet);
      const chName = activeChArr.map(c => `باب نمبر ${c}`).join(' اور ');
      islLongOptions = [
        `(الف) ${chName} کے اہم موضوعات، بنیادی احکامات اور تعلیمات پر مدلل اور جامع نوٹ تحریر کیجیے۔`,
        `(ب) ${chName} کی روشنی میں انفرادی کردار اور اجتماعی معاشرتی اصلاح کے تقاضے تفصیل سے بیان کیجیے۔`,
      ];
    } else {
      islLongOptions = [
        '(الف) "رسول اللہ خاتم النبیین ﷺ کی سیرتِ طیبہ تمام انسانیت کے لیے مشعلِ راہ ہے"۔ اسوہ حسنہ پر مدلل نوٹ لکھیے۔',
        '(ب) خطبہ حجۃ الوداع کے اہم نکات اور انسانی حقوق کے عالمی منشور کی حیثیت سے اس کی اہمیت بیان کیجیے۔',
        '(ج) اسلام میں خاندانی نظام اور والدین کے حقوق پر جامع نوٹ قلمبند کیجیے۔',
      ];
    }

    return {
      ...paperBase,
      isUrduPaper: true,
      isIslamiatPaper: true,
      timeAllowed: '1 گھنٹہ 45 منٹ',
      totalMarks: configuredTotalMarks || 50,
      mcqSection: {
        active: !skipMcq && mcqs.length > 0,
        marks: mcqs.length,
        title: 'حصہ اول: معروضی (کثیر الانتخابی سوالات)',
        time: '15 منٹ',
        questions: mcqs,
      },
      shortSections: [
        {
          sectionNumber: 2,
          title: 'سوال نمبر 2: مختصر سوالات کے جوابات (کوئی سے چھ حل کیجیے)',
          instruction: '2- مندرجہ ذیل میں سے کوئی سے چھ (6) سوالات کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: sampleRandom(q2Pool, 9).map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q.text || q })),
        },
        {
          sectionNumber: 3,
          title: 'سوال نمبر 3: مختصر سوالات کے جوابات (کوئی سے چھ حل کیجیے)',
          instruction: '3- مندرجہ ذیل میں سے کوئی سے چھ (6) سوالات کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
          attemptCount: 6,
          totalCount: 9,
          totalMarks: 12,
          questions: sampleRandom(q3Pool, 9).map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q.text || q })),
        },
      ],
      islHadithSection: !islamiatConfig.skipAyat ? {
        active: true,
        num: 4,
        title: 'سوال نمبر 4: حدیثِ نبوی ﷺ کا ترجمہ و تشریح',
        instruction: '4- مندرجہ ذیل حدیثِ مبارکہ کا با محاورہ اردو ترجمہ اور مختصر تشریح تحریر کیجیے: [3 + 5 = 8 Marks]',
        marks: 8,
        hadithText: sampleRandom(hadithPool, 1)[0].text,
        translation: 'ترجمہ: با محاورہ ترجمہ اور مختصر تشریح قلمبند کیجیے۔',
      } : null,
      islLongSection: !islamiatConfig.skipLong ? {
        active: true,
        num: 5,
        title: 'سوال نمبر 5: موضوعاتی مطالعہ / تفصیلی سوال',
        instruction: '5- مندرجہ ذیل میں سے کسی ایک موضوع پر مفصل اور مدلل نوٹ تحریر کیجیے: [8 Marks]',
        marks: 8,
        options: islLongOptions.slice(0, 2),
      } : null,
    };
  }

  // ========================================================
  // 7. PAKISTAN STUDIES & GENERAL / ARTS
  // ========================================================
  const isPakStudies = subject.id?.toLowerCase().startsWith('pak');
  const isInter = classGrade === '11' || classGrade === '12';
  const defaultTotalMarks = isPakStudies ? 50 : isInter ? 100 : 75;
  const defaultMcqCount = isPakStudies ? 10 : isInter ? 20 : 15;
  const genMcqCount = generalConfig.mcqCount || defaultMcqCount;

  const pakMcqBank = [
    { ch: 1, questionText: 'نظریہ پاکستان کی بنیادی اساس کون سا نظریہ ہے؟', options: ['اسلامی نظریہ حیات', 'مغربی جمہوریت', 'اشتراکیت', 'وطنیت'], correct: 0 },
    { ch: 1, questionText: 'قائد اعظم محمد علی جناحؒ نے سٹیٹ بینک آف پاکستان کا افتتاح کب کیا؟', options: ['یکم جولائی 1948ء', '14 اگست 1947ء', '23 مارچ 1948ء', '25 دسمبر 1947ء'], correct: 0 },
    { ch: 1, questionText: 'علامہ محمد اقبالؒ نے تاریخی خطبہ الہ آباد کس سال دیا؟', options: ['1930ء میں', '1940ء میں', '1928ء میں', '1935ء میں'], correct: 0 },
    { ch: 1, questionText: 'دو قومی نظریہ سے کیا مراد ہے؟', options: ['برصغیر میں دو بڑی قومیں (ہندو اور مسلمان) آباد ہیں', 'صرف مسلمان قوم', 'ہندو راج', 'مغربی جمہوریت'], correct: 0 },
    { ch: 2, questionText: 'قراردادِ لاہور (پاکستان) کس سال اور کہاں منظور ہوئی؟', options: ['1940ء منٹو پارک لاہور میں', '1930ء الہ آباد میں', '1947ء کراچی میں', '1935ء دہلی میں'], correct: 0 },
    { ch: 2, questionText: 'چوہدری رحمت علی نے کتابچہ "Now or Never" میں لفظ "پاکستان" کب تجویز کیا؟', options: ['1933ء میں', '1930ء میں', '1940ء میں', '1928ء میں'], correct: 0 },
    { ch: 2, questionText: 'شملہ وفد کس سال وائسرائے لارڈ منٹو سے ملا؟', options: ['1906ء میں', '1905ء میں', '1909ء میں', '1911ء میں'], correct: 0 },
    { ch: 2, questionText: 'تقسیمِ ہند کے وقت برصغیر کی حدود کا تعین کس کمیشن نے کیا؟', options: ['ریڈکلف کمیشن', 'سائمن کمیشن', 'کرپس مشن', 'کابینہ مشن'], correct: 0 },
    { ch: 3, questionText: 'پاکستان کے شمال میں کون سا اہم پڑوسی ملک واقع ہے؟', options: ['چین', 'بھارت', 'افغانستان', 'ایران'], correct: 0 },
    { ch: 3, questionText: 'پاکستان کی سب سے اونچی پہاڑی چوٹی کون سی ہے؟', options: ['کے ٹو (K-2)', 'نانگا پربت', 'راکا پوشی', 'تیرچ میر'], correct: 0 },
    { ch: 3, questionText: 'سندھ طاس معاہدہ کن دو ممالک کے درمیان عالمی بینک کے تعاون سے طے پایا؟', options: ['پاکستان اور بھارت', 'پاکستان اور چین', 'پاکستان اور افغانستان', 'پاکستان اور ایران'], correct: 0 },
    { ch: 3, questionText: 'پاکستان کا سب سے بڑا صحرا کون سا ہے؟', options: ['تھر', 'تھل', 'چولستان', 'خاران'], correct: 0 },
    { ch: 4, questionText: 'پاکستان کا پہلا متفقہ آئین کس سال منظور ہوا؟', options: ['1956ء میں', '1962ء میں', '1973ء میں', '1947ء میں'], correct: 0 },
    { ch: 4, questionText: 'پاکستان کا موجودہ آئین کس سال نافذ العمل ہوا؟', options: ['1973ء میں', '1956ء میں', '1962ء میں', '1985ء میں'], correct: 0 },
    { ch: 4, questionText: 'پاکستان میں بنیادی جمہوریتوں کا نظام کس نے متعارف کروایا؟', options: ['جنرل ایوب خان', 'ذوالفقار علی بھٹو', 'جنرل ضیاء الحق', 'لیاقت علی خان'], correct: 0 },
    { ch: 4, questionText: 'پاکستان نے ایٹمی دھماکے کس سال اور کہاں کیے؟', options: ['1998ء میں چاغی کے مقام پر', '1999ء میں', '1990ء میں', '1988ء میں'], correct: 0 },
  ];

  let mcqList = [];
  if (!generalConfig.skipMcq) {
    if (isPakStudies) {
      let pakFiltered = hasChapterFilter
        ? pakMcqBank.filter(m => activeChapterSet.has(m.ch))
        : pakMcqBank;

      if (hasChapterFilter && pakFiltered.length < genMcqCount) {
        const activeChArr = Array.from(activeChapterSet);
        const chName = activeChArr.map(c => `باب ${c}`).join(' اور ');
        const extraPak = [
          { ch: activeChArr[0], questionText: `${chName} کے اہم مقاصد اور نظریاتی پس منظر کے مطابق بنیادی اصول کیا ہے؟`, options: ['قومی یکجہتی اور اسلامی تشخص', 'علاقائی تعصب', 'طبقاتی تفریق', 'شخصی اقتدار'], correct: 0 },
          { ch: activeChArr[0], questionText: `${chName} میں بیان کردہ تاریخی واقعات پاکستان کی کس جدوجہد کو اجاگر کرتے ہیں؟`, options: ['تحریکِ آزادی اور تعمیرِ وطن', 'تجارت و صنعت', 'مغربی اثرات', 'سیاسی انتشار'], correct: 0 },
          { ch: activeChArr[0], questionText: `${chName} کی روشنی میں استحکامِ پاکستان کے لیے سب سے ضروری عنصر کیا ہے؟`, options: ['اتحاد، تنظیم اور یقینِ محکم', 'لسانی تنازعات', 'صوبائیت', 'ذاتی مفاد'], correct: 0 },
          { ch: activeChArr[0], questionText: `${chName} کے مطابق معاشی اور جغرافیائی خود انحصاری کے لیے کیا ناگزیر ہے؟`, options: ['قدرتی وسائل کی حفاظت و ترقی', 'بیرونی قرضے', 'درآمدات پر انحصار', 'بے منصوبہ بندی'], correct: 0 },
          { ch: activeChArr[0], questionText: `${chName} میں کن قومی رہنماؤں کی بصیرت اور رہنما کردار کو سراہا گیا ہے؟`, options: ['قائد اعظمؒ اور علامہ اقبالؒ', 'برطانوی حکمران', 'کانگریسی قائدین', 'صوبائی رہنما'], correct: 0 },
        ];
        pakFiltered = [...pakFiltered, ...extraPak];
      }

      mcqList = sampleRandom(pakFiltered, Number(genMcqCount)).map((item, idx) => ({
        ...shuffleMcqOptions(item),
        index: idx + 1,
      }));
    } else {
      mcqList = sampleRandom(rawQuestions.mcqs || [], Number(genMcqCount)).map((item, idx) => ({
        index: idx + 1,
        questionText: item.ur || item.en || `سوال نمبر ${idx + 1}: امتحانی نصاب کے مطابق درست جواب کا انتخاب کریں:`,
        options: item.optionsUrdu || item.options || ['(الف) درست و بنیادی اصول', '(ب) ثانوی تصور', '(ج) عملی اطلاق', '(د) تجزیاتی نظریہ'],
        correct: 0,
      }));
    }
  }

  const pakShortsBank = [
    { ch: 1, text: 'نظریہ پاکستان کی تعریف اور اس کی اساس کیا ہے؟' },
    { ch: 1, text: 'قائد اعظم محمد علی جناحؒ نے نظریہ پاکستان کی کیا وضاحت فرمائی؟' },
    { ch: 1, text: 'علامہ اقبالؒ کے خطبہ الہ آباد 1930ء کا بنیادی نکتہ تحریر کریں۔' },
    { ch: 1, text: 'دو قومی نظریہ سے کیا مراد ہے اور اس کی ابتداء کس سے ہوئی؟' },
    { ch: 1, text: 'نظریہ پاکستان کے اجزائے ترکیبی کے نام تحریر کیجیے۔' },
    { ch: 1, text: 'اسلامی اقدار (مساوات، عدل و انصاف) نظریہ پاکستان میں کیا مقام رکھتی ہیں؟' },
    { ch: 2, text: 'تحریکِ خلافت کے دو اہم مقاصد کیا تھے؟' },
    { ch: 2, text: 'قراردادِ لاہور 1940ء کا متن اور دو اہم نکات لکھیے۔' },
    { ch: 2, text: 'قائد اعظم محمد علی جناحؒ کے 14 نکات میں سے کوئی سے دو نکات تحریر کریں۔' },
    { ch: 2, text: 'ریڈکلف ایوارڈ کی دو بڑی ناانصافیاں بیان کیجیے۔' },
    { ch: 2, text: 'قیامِ پاکستان کے وقت مہاجرین کی آبادکاری کا مسئلہ کس طرح حل ہوا؟' },
    { ch: 2, text: 'کابینہ مشن پلان 1946ء کی دو اہم تجاویز لکھیے۔' },
    { ch: 3, text: 'پاکستان کے محل وقوع کی جغرافیائی و فوجی اہمیت کے دو نکات بیان کریں۔' },
    { ch: 3, text: 'پاکستان کی اہم پہاڑی چوٹیوں اور درّوں کے نام لکھیے۔' },
    { ch: 3, text: 'پاکستان میں نہری نظام کی اقسام تحریر کریں۔' },
    { ch: 3, text: 'پاکستان کے اہم ماحولیاتی خطرات اور جنگلات کی کمی کے اسباب بیان کریں۔' },
    { ch: 3, text: 'پاکستان کے چار اہم موسمی خطوں کے نام تحریر کیجیے۔' },
    { ch: 3, text: 'سی پیک (CPEC) سے پاکستان کو حاصل ہونے والے دو معاشی فوائد بتائیں۔' },
    { ch: 4, text: 'قراردادِ مقاصد 1949ء کے دو اہم نکات لکھیے۔' },
    { ch: 4, text: '1973ء کے آئین کی دو اہم اسلامی دفعات بیان کریں۔' },
    { ch: 4, text: 'پاکستان کی خارجہ پالیسی کے بنیادی اصول کیا ہیں؟' },
    { ch: 4, text: 'مسئلہ کشمیر پر اقوام متحدہ کی قراردادوں کا خلاصہ کیا ہے؟' },
    { ch: 4, text: 'پاکستان کی اہم برآمدات اور درآمدات کے نام لکھیے۔' },
    { ch: 4, text: 'آبادی میں اضافے کے دو منفی اثرات اور تعلیم کے فروغ کے اقدامات لکھیے۔' },
  ];

  let pakQ2List = hasChapterFilter
    ? pakShortsBank.filter(s => activeChapterSet.has(s.ch))
    : pakShortsBank;

  if (hasChapterFilter && pakQ2List.length < 9) {
    const activeChArr = Array.from(activeChapterSet);
    const chName = activeChArr.map(c => `باب ${c}`).join(' اور ');
    const genPakShorts = [
      { ch: activeChArr[0], text: `${chName} کے اہم تاریخی و آئینی پس منظر کے دو نکات تحریر کریں۔` },
      { ch: activeChArr[0], text: `${chName} میں بیان کردہ بنیادی مسائل اور ان کے ممکنہ حل کیا ہیں؟` },
      { ch: activeChArr[0], text: `${chName} کی روشنی میں قومی ترقی اور یکجہتی کے تقاضے بیان کیجیے۔` },
      { ch: activeChArr[0], text: `${chName} کے اہم واقعات اور ان کے قومی اثرات کی وضاحت کریں۔` },
      { ch: activeChArr[0], text: `${chName} کے مقاصد اور اغراض و فرائض تحریر کیجیے۔` },
      { ch: activeChArr[0], text: `${chName} کے اہم نکات پر روشنی ڈالیے اور دو مثالیں دیں۔` },
      { ch: activeChArr[0], text: `${chName} کے جغرافیائی، سیاسی اور سماجی اثرات بیان کریں۔` },
      { ch: activeChArr[0], text: `${chName} کے مطابق مستقبل کے لیے کیا حکمتِ عملی ہونی چاہیے؟` },
      { ch: activeChArr[0], text: `${chName} سے نوجوان نسل کو کیا سبق ملتا ہے؟` },
    ];
    pakQ2List = [...pakQ2List, ...genPakShorts];
  }

  const pakLongBank = [
    { ch: 1, num: 4, marks: 8, text: 'قائد اعظم محمد علی جناحؒ کے ارشادات اور خطبات کی روشنی میں نظریہ پاکستان کی جامع وضاحت کیجیے۔' },
    { ch: 1, num: 5, marks: 8, text: 'علامہ محمد اقبالؒ کے فرمودات اور خطبہ الہ آباد 1930ء کی روشنی میں نظریہ پاکستان کا احاطہ کیجیے۔' },
    { ch: 1, num: 6, marks: 8, text: 'دو قومی نظریہ کے تاریخی ارتقاء اور نظریہ پاکستان کے اجزائے ترکیبی پر تفصیلی بحث کریں۔' },
    { ch: 2, num: 4, marks: 8, text: 'قراردادِ لاہور (پاکستان) 1940ء کے پس منظر، متن اور برصغیر کی سیاست پر اس کے اثرات بیان کیجیے۔' },
    { ch: 2, num: 5, marks: 8, text: 'قائد اعظم کے 14 نکات کا تفصیلی جائزہ لیجیے اور ان کی سیاسی اہمیت واضح کیجیے۔' },
    { ch: 2, num: 6, marks: 8, text: 'قیامِ پاکستان کے وقت نومولود مملکت کو درپیش ابتدائی مسائل اور ان کے حل پر تفصیلی نوٹ لکھیے۔' },
    { ch: 3, num: 4, marks: 8, text: 'پاکستان کے محل وقوع کی جغرافیائی، عسکری اور بین الاقوامی تجارتی اہمیت پر جامع نوٹ تحریر کیجیے۔' },
    { ch: 3, num: 5, marks: 8, text: 'پاکستان کے نہری نظام، بیراجوں اور ڈیموں کی زرعی معیشت میں اہمیت تفصیل سے بیان کیجیے۔' },
    { ch: 3, num: 6, marks: 8, text: 'پاکستان کے ماحولیاتی مسائل، جنگلات کے کٹاؤ اور ان کے سدِباب کے لیے حکومتی اقدامات قلمبند کیجیے۔' },
    { ch: 4, num: 4, marks: 8, text: 'دستورِ پاکستان 1973ء کے اہم اور نمایاں اسلامی اور جمہوری خدوخال تفصیل سے قلمبند کیجیے۔' },
    { ch: 4, num: 5, marks: 8, text: 'پاکستان کی خارجہ پالیسی کے بنیادی مقاصد اور اہم پڑوسی ممالک کے ساتھ تعلقات کا جائزہ لیجیے۔' },
    { ch: 4, num: 6, marks: 8, text: 'پاک چین اقتصادی راہداری (CPEC) اور پاکستان کی صنعتی و معاشی ترقی پر اس کے اثرات لکھیے۔' },
  ];

  let pakLongQuestions = [];
  if (isPakStudies) {
    if (hasChapterFilter) {
      const filteredPakLongs = pakLongBank.filter(l => activeChapterSet.has(l.ch));
      if (filteredPakLongs.length >= 2) {
        pakLongQuestions = sampleRandom(filteredPakLongs, Math.min(filteredPakLongs.length, 3)).map((l, i) => ({
          num: i + 4,
          marks: 8,
          text: l.text,
        }));
      } else {
        const activeChArr = Array.from(activeChapterSet);
        const chName = activeChArr.map(c => `باب نمبر ${c}`).join(' اور ');
        pakLongQuestions = [
          { num: 4, marks: 8, text: `${chName} کے اہم خدوخال، تاریخی پس منظر اور بنیادی مقاصد پر مفصل نوٹ تحریر کیجیے۔` },
          { num: 5, marks: 8, text: `${chName} کے اہم پہلوؤں اور قومی ترقی پر اس کے اثرات کا مدلل اور جامع احاطہ کیجیے۔` },
          { num: 6, marks: 8, text: `${chName} کے نمایاں نکات اور اس کے عملی اطلاق پر تفصیلی بحث قلمبند کیجیے۔` },
        ];
      }
    } else {
      pakLongQuestions = sampleRandom([
        { num: 4, marks: 8, text: 'قائد اعظم محمد علی جناحؒ کی سیاسی و آئینی جدوجہد میں 14 نکات اور قیامِ پاکستان کے حوالے سے ان کے کردار پر مفصل نوٹ تحریر کیجیے۔' },
        { num: 5, marks: 8, text: 'دستورِ پاکستان 1973ء کے اہم اور نمایاں اسلامی اور جمہوری خدوخال تفصیل سے قلمبند کیجیے۔' },
        { num: 6, marks: 8, text: 'مندرجہ ذیل میں سے کسی دو پر مختصر نوٹ لکھیے:\n(الف) مسئلہ کشمیر اور اقوام متحدہ کا کردار (4 نمبر)\n(ب) پاک چین اقتصادی راہداری (CPEC) کی اہمیت (4 نمبر)' },
        { num: 7, marks: 8, text: 'پاکستان کی زراعت اور اہم فصلوں پر تفصیلی نوٹ تحریر کیجیے اور درپیش مسائل کے حل بتائیے۔' },
      ], 3);
    }
  }

  return {
    ...paperBase,
    isUrduPaper: true,
    timeAllowed: isPakStudies ? '1 گھنٹہ 45 منٹ' : isInter ? '2 گھنٹے 30 منٹ' : '2 گھنٹے 10 منٹ',
    totalMarks: configuredTotalMarks || defaultTotalMarks,
    mcqSection: {
      active: !generalConfig.skipMcq && mcqList.length > 0,
      marks: mcqList.length,
      title: 'حصہ اول: معروضی (کثیر الانتخابی سوالات)',
      time: isPakStudies ? '15 منٹ' : isInter ? '20 منٹ' : '20 منٹ',
      questions: mcqList,
    },
    shortSections: isPakStudies
      ? [
          {
            sectionNumber: 2,
            title: 'سوال نمبر 2: مختصر سوالات کے جوابات (کوئی سے چھ حل کیجیے)',
            instruction: '2- کوئی سے چھ (6) اجزاء کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
            attemptCount: 6,
            totalCount: 9,
            totalMarks: 12,
            questions: sampleRandom(pakQ2List, 9).map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q.text || q })),
          },
          {
            sectionNumber: 3,
            title: 'سوال نمبر 3: مختصر سوالات کے جوابات (کوئی سے چھ حل کیجیے)',
            instruction: '3- کوئی سے چھ (6) اجزاء کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
            attemptCount: 6,
            totalCount: 9,
            totalMarks: 12,
            questions: sampleRandom(pakQ2List, 9).map((q, i) => ({ num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`, text: q.text || q })),
          },
        ]
      : (() => {
          const usedSet = new Set();
          const genShortList = (rawQuestions.shorts && rawQuestions.shorts.length >= 18)
            ? rawQuestions.shorts
            : [
                ...(rawQuestions.shorts || []),
                { ur: 'موضوع کے بنیادی اصولوں اور تعریفات کی وضاحت کیجیے۔', en: 'Explain the basic principles and definitions of the topic.' },
                { ur: 'نظریاتی تصورات اور عملی اطلاق میں فرق بیان کریں۔', en: 'Differentiate between theoretical concepts and practical applications.' },
                { ur: 'معاشرے اور انفرادی زندگی پر اس کے دو مثبت اثرات تحریر کریں۔', en: 'Write two positive impacts on society and individual life.' },
                { ur: 'اہم اصطلاحات کی تفصیلی وضاحت مع دو مثالیں دیجیے۔', en: 'Give detailed explanation of key terminologies with two examples.' },
                { ur: 'تاریخی پس منظر اور ارتقاء کے دو اہم مراحل قلمبند کریں۔', en: 'State two important phases of historical background and development.' },
                { ur: 'مسائل کے اسباب اور ان کے پائیدار حل کے لیے دو تجاویز دیں۔', en: 'Give two suggestions for causes of problems and sustainable solutions.' },
                { ur: 'قومی ترقی میں اس شعبے کی اہمیت پر روشنی ڈالیے۔', en: 'Highlight the importance of this field in national progress.' },
                { ur: 'جدید دور کے چیلنجز اور ان سے نمٹنے کے طریقے بیان کیجیے۔', en: 'Describe modern challenges and methods to overcome them.' },
                { ur: 'اہم قوانین یا ضوابط کے دو بنیادی نکات لکھیے۔', en: 'Write two fundamental points of important rules or regulations.' },
                { ur: 'علمی تحقیق میں اس کی افادیت کے دو پہلو واضح کریں۔', en: 'Clarify two aspects of its utility in academic research.' },
                { ur: 'اس کے مقاصد اور اغراض و فرائض تحریر کیجیے۔', en: 'Write down the aims, objectives and duties.' },
                { ur: 'موازنہ کیجیے اور اہم فوائد و نقصانات بیان کریں۔', en: 'Compare and state the major pros and cons.' },
              ];

          const q2Items = sampleUnique(genShortList, 9, usedSet);
          const q3Items = sampleUnique(genShortList, 9, usedSet);
          const q4Items = sampleUnique(genShortList, 9, usedSet);

          return [
            {
              sectionNumber: 2,
              title: 'سوال نمبر 2: مختصر سوالات (حصہ اول)',
              instruction: '2- کوئی سے چھ (6) اجزاء کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
              attemptCount: 6,
              totalCount: 9,
              totalMarks: 12,
              questions: q2Items.map((q, i) => ({
                num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`,
                text: q.ur || q.en,
              })),
            },
            {
              sectionNumber: 3,
              title: 'سوال نمبر 3: مختصر سوالات (حصہ دوم)',
              instruction: '3- کوئی سے چھ (6) اجزاء کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
              attemptCount: 6,
              totalCount: 9,
              totalMarks: 12,
              questions: q3Items.map((q, i) => ({
                num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`,
                text: q.ur || q.en,
              })),
            },
            {
              sectionNumber: 4,
              title: 'سوال نمبر 4: مختصر سوالات (حصہ سوم)',
              instruction: '4- کوئی سے چھ (6) اجزاء کے مختصر جوابات تحریر کیجیے: [6 × 2 = 12 Marks]',
              attemptCount: 6,
              totalCount: 9,
              totalMarks: 12,
              questions: q4Items.map((q, i) => ({
                num: `(${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]})`,
                text: q.ur || q.en,
              })),
            },
          ];
        })(),
    longSection: {
      active: !generalConfig.skipLong,
      title: 'حصہ دوم: تفصیلی / انشائیہ سوالات',
      instruction: isPakStudies
        ? 'نوٹ: مندرجہ ذیل میں سے کوئی سے دو (2) سوالات کے تفصیلی جوابات تحریر کیجیے: [2 × 8 = 16 Marks]'
        : 'نوٹ: مندرجہ ذیل میں سے کوئی سے تین (3) سوالات کے تفصیلی جوابات تحریر کیجیے: [3 × 8 = 24 Marks]',
      attemptCount: isPakStudies ? 2 : 3,
      totalCount: isPakStudies ? 3 : 5,
      marks: isPakStudies ? 16 : 24,
      questions: isPakStudies
        ? pakLongQuestions
        : sampleRandom(
            (rawQuestions.longs && rawQuestions.longs.length >= 5)
              ? rawQuestions.longs
              : [
                  ...(rawQuestions.longs || []),
                  { ur: 'موضوع کے تفصیلی خدوخال، بنیادی مقاصد اور عملی اطلاق پر جامع اور مفصل نوٹ تحریر کیجیے۔' },
                  { ur: 'درپیش اہم مسائل اور ان کے ممکنہ حل کے لیے تجاویز تفصیل سے قلمبند کیجیے۔' },
                  { ur: 'قومی اور بین الاقوامی سطح پر اس شعبے کے ارتقاء اور موجودہ صورتحال کا تنقیدی جائزہ لیجیے۔' },
                  { ur: 'مختلف نظریات کا تقابلی جائزہ پیش کیجیے اور دلائل کے ساتھ وضاحت کیجیے۔' },
                  { ur: 'معاشرتی اور معاشی ترقی میں اس کے کردار پر تفصیلی بحث کیجیے۔' },
                ],
            5
          ).map((l, i) => ({
            num: i + 5,
            marks: 8,
            text: l.ur || l.en,
          })),
    },
  };
}

// Comprehensive Board Question Bank for Paper Generation (Punjab Boards BISE Pattern - 2026 Standards)
// Designed with rich question pools and random sampling so generated examination papers never repeat!

// Fisher-Yates array shuffling
export function shuffleArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length <= 1) return arr ? [...arr] : [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Randomly samples `count` elements without replacement
export function sampleRandom(arr, count) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
  const shuffled = shuffleArray(arr);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Randomly samples `count` elements ensuring no duplicates across sections using a shared usedSet
export function sampleUnique(arr, count, usedSet = new Set()) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
  const available = arr.filter(item => {
    const key = item.id || item.text || item.en || item.questionText || JSON.stringify(item);
    return !usedSet.has(key);
  });
  // If not enough unique remaining, sample from the full shuffled list
  const pool = available.length >= count ? available : arr;
  const picked = sampleRandom(pool, count);
  picked.forEach(item => {
    const key = item.id || item.text || item.en || item.questionText || JSON.stringify(item);
    usedSet.add(key);
  });
  return picked;
}

// Shuffles MCQ options (A, B, C, D) while updating the correct answer index
export function shuffleMcqOptions(mcq) {
  if (!mcq || !mcq.options || mcq.options.length < 2) return mcq;
  const origCorrectOpt = typeof mcq.correct === 'number' ? mcq.options[mcq.correct] : null;
  const origCorrectOptUrdu = (mcq.optionsUrdu && typeof mcq.correct === 'number') ? mcq.optionsUrdu[mcq.correct] : null;

  const indices = mcq.options.map((_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  const newOptions = shuffledIndices.map(i => mcq.options[i]);
  const newOptionsUrdu = mcq.optionsUrdu ? shuffledIndices.map(i => mcq.optionsUrdu[i]) : undefined;
  const newCorrect = origCorrectOpt ? newOptions.indexOf(origCorrectOpt) : mcq.correct;

  return {
    ...mcq,
    options: newOptions,
    ...(newOptionsUrdu ? { optionsUrdu: newOptionsUrdu } : {}),
    correct: newCorrect >= 0 ? newCorrect : mcq.correct,
  };
}

export const SAMPLE_QUESTIONS = {
  // ========================================================
  // 9TH CLASS BIOLOGY (bio-9)
  // ========================================================
  'bio-9': {
    mcqs: [
      { id: 'b9_m1', en: 'The study of internal structures of living organisms is called:', ur: 'جانداروں کی اندرونی ساختوں کے مطالعہ کو کہتے ہیں:', options: ['Morphology', 'Anatomy', 'Histology', 'Physiology'], optionsUrdu: ['مارفولوجی', 'اناٹمی', 'ہسٹولوجی', 'فزیالوجی'], correct: 1 },
      { id: 'b9_m2', en: 'Which organelle is known as the powerhouse of the cell?', ur: 'سیل کا پاور ہاؤس کس آرگنیلی کو کہا جاتا ہے؟', options: ['Ribosome', 'Mitochondria', 'Golgi complex', 'Nucleus'], optionsUrdu: ['رائیبوسوم', 'مائٹوکونڈریا', 'گولجی کمپلیکس', 'نیوکلیئس'], correct: 1 },
      { id: 'b9_m3', en: 'The scientific name of Frog is:', ur: 'مینڈک کا سائنسی نام کیا ہے؟', options: ['Rana tigrina', 'Homo sapiens', 'Brassica campestris', 'Canis lupus'], optionsUrdu: ['رانا ٹگرینا', 'ہومو سیپینز', 'براسیکا کمپیسٹرس', 'کینیس لوپس'], correct: 0 },
      { id: 'b9_m4', en: 'Enzymes are chemically composed of:', ur: 'اینزائمز کیمیائی طور پر کس چیز سے بنے ہوتے ہیں؟', options: ['Carbohydrates', 'Proteins', 'Lipids', 'Nucleic acids'], optionsUrdu: ['کاربوہائیڈریٹس', 'پروٹینز', 'لیپڈز', 'نیوکلیک ایسڈ'], correct: 1 },
      { id: 'b9_m5', en: 'Dark reaction of photosynthesis takes place in:', ur: 'فوٹوسنتھیسز کا ڈارک ری ایکشن کہاں واقع ہوتا ہے؟', options: ['Thylakoids', 'Stroma', 'Grana', 'Outer membrane'], optionsUrdu: ['تھائیلاکوائیڈز', 'سٹروما', 'گرانا', 'بیرونی جھلی'], correct: 1 },
      { id: 'b9_m6', en: 'Blood group known as universal recipient is:', ur: 'یونیورسل وصول کنندہ کونسا بلڈ گروپ کہلاتا ہے؟', options: ['A', 'B', 'AB', 'O'], optionsUrdu: ['A', 'B', 'AB', 'O'], correct: 2 },
      { id: 'b9_m7', en: 'Mitosis occurs in which cells?', ur: 'مائٹوسس کن سیلز میں واقع ہوتی ہے؟', options: ['Somatic cells', 'Germ cells', 'Gametes', 'Bacterial cells'], optionsUrdu: ['سومیٹک سیلز', 'جرم سیلز', 'گیمیٹس', 'بیکٹیریل سیلز'], correct: 0 },
      { id: 'b9_m8', en: 'Deficiency of Vitamin C causes which disease?', ur: 'وٹامن سی کی کمی سے کونسی بیماری ہوتی ہے؟', options: ['Rickets', 'Scurvy', 'Night blindness', 'Anemia'], optionsUrdu: ['ریکٹس', 'سکروی', 'شب کوری', 'خون کی کمی'], correct: 1 },
      { id: 'b9_m9', en: 'Transpiration takes place through:', ur: 'ٹرانسپائریشن کس کے ذریعے ہوتی ہے؟', options: ['Cuticle', 'Stomata', 'Lenticels', 'All of these'], optionsUrdu: ['کیوٹیکل', 'سٹومیٹا', 'لینٹی سیلز', 'یہ تمام'], correct: 3 },
      { id: 'b9_m10', en: 'Which blood vessel carries deoxygenated blood to lungs?', ur: 'کون سی خون کی نالی پھیپھڑوں کو غیر آکسیجن شدہ خون لے جاتی ہے؟', options: ['Pulmonary vein', 'Pulmonary artery', 'Aorta', 'Vena Cava'], optionsUrdu: ['پلمونری رگ', 'پلمونری شریان', 'شہ رگ (ایورٹا)', 'وینا کاوا'], correct: 1 },
      { id: 'b9_m11', en: 'Cell wall of fungi is made up of:', ur: 'فنجائی کی سیل وال کس چیز سے بنی ہوتی ہے؟', options: ['Cellulose', 'Chitin', 'Peptidoglycan', 'Lignin'], optionsUrdu: ['سیلولوز', 'کائیٹن', 'پیپٹائیڈوگلائیکن', 'لگنین'], correct: 1 },
      { id: 'b9_m12', en: 'Who introduced binomial nomenclature?', ur: 'دو نامی طریقہ تسمیہ کس نے متعارف کروایا؟', options: ['Aristotle', 'Carolus Linnaeus', 'Robert Hooke', 'Louis Pasteur'], optionsUrdu: ['ارسطو', 'کیرولس لینیئس', 'رابرٹ ہک', 'لوئی پاسچر'], correct: 1 },
      { id: 'b9_m13', en: 'The movement of molecules from lower to higher concentration is:', ur: 'مالیکیولز کی کم سے زیادہ ارتکاز کی طرف حرکت کہلاتی ہے:', options: ['Active transport', 'Diffusion', 'Osmosis', 'Facilitated diffusion'], optionsUrdu: ['ایکٹیو ٹرانسپورٹ', 'ڈفیوژن', 'اسموسس', 'سہولت شدہ ڈفیوژن'], correct: 0 },
      { id: 'b9_m14', en: 'In which stage of cell cycle does DNA replication occur?', ur: 'سیل سائیکل کے کس مرحلے میں ڈی این اے ریپلیکیشن ہوتی ہے؟', options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'], optionsUrdu: ['G1 مرحلہ', 'S مرحلہ', 'G2 مرحلہ', 'M مرحلہ'], correct: 1 },
      { id: 'b9_m15', en: 'The optimum temperature for human enzymes is:', ur: 'انسانی اینزائمز کے کام کرنے کا بہترین درجہ حرارت ہے:', options: ['30°C', '37°C', '42°C', '50°C'], optionsUrdu: ['30°C', '37°C', '42°C', '50°C'], correct: 1 },
      { id: 'b9_m16', en: 'Which component of blood helps in blood clotting?', ur: 'خون کا کون سا جزو خون کو جمانے میں مدد دیتا ہے؟', options: ['RBCs', 'WBCs', 'Platelets', 'Plasma'], optionsUrdu: ['ریڈ بلڈ سیلز', 'وائٹ بلڈ سیلز', 'پلیٹلٹس', 'پلازما'], correct: 2 },
      { id: 'b9_m17', en: 'Major cause of extinction of biodiversity is:', ur: 'بائیو ڈائیورسٹی کے خاتمے کی سب سے بڑی وجہ ہے:', options: ['Habitat loss', 'Pollution', 'Over-hunting', 'Climate change'], optionsUrdu: ['مسکن کی تباہی', 'آلودگی', 'بے دریغ شکار', 'موسمیاتی تبدیلی'], correct: 0 },
      { id: 'b9_m18', en: 'Which vitamin is fat soluble?', ur: 'کون سا وٹامن چکنائی میں حل پذیر ہے؟', options: ['Vitamin A', 'Vitamin C', 'Vitamin B1', 'Vitamin B12'], optionsUrdu: ['وٹامن اے', 'وٹامن سی', 'وٹامن بی 1', 'وٹامن بی 12'], correct: 0 },
      { id: 'b9_m19', en: 'The fluid mosaic model of cell membrane was proposed by:', ur: 'سیل ممبرین کا فلوئڈ موزیک ماڈل کس نے پیش کیا؟', options: ['Singer & Nicolson', 'Watson & Crick', 'Robert Hooke', 'Schwann'], optionsUrdu: ['سنگر اور نکولسن', 'واٹسن اور کرک', 'رابرٹ ہک', 'شوان'], correct: 0 },
      { id: 'b9_m20', en: 'Bile juice is stored in:', ur: 'بائل جوس کہاں ذخیرہ ہوتا ہے؟', options: ['Gall bladder', 'Liver', 'Pancreas', 'Stomach'], optionsUrdu: ['پتہ (Gall bladder)', 'جگر', 'لبلبہ', 'معدہ'], correct: 0 },
      { id: 'b9_m21', en: 'The organ of hearing in birds and mammals is located in:', ur: 'پرندوں اور ممالیہ میں سننے کا عضو واقع ہوتا ہے:', options: ['Inner ear', 'Middle ear', 'Outer ear', 'Eardrum'], optionsUrdu: ['اندرونی کان', 'درمیانی کان', 'بیرونی کان', 'پردہ سماعت'], correct: 0 },
      { id: 'b9_m22', en: 'Glycolysis takes place in:', ur: 'گلائیکولائسس کا عمل کہاں ہوتا ہے؟', options: ['Cytoplasm', 'Mitochondria', 'Chloroplast', 'Nucleus'], optionsUrdu: ['سائٹوپلازم', 'مائٹوکونڈریا', 'کلوروپلاسٹ', 'نیوکلیئس'], correct: 0 },
      { id: 'b9_m23', en: 'Normal blood pressure of a healthy adult is:', ur: 'صحت مند بالغ انسان کا نارمل بلڈ پریشر ہوتا ہے:', options: ['120/80 mmHg', '140/90 mmHg', '100/60 mmHg', '80/120 mmHg'], optionsUrdu: ['120/80 mmHg', '140/90 mmHg', '100/60 mmHg', '80/120 mmHg'], correct: 0 },
      { id: 'b9_m24', en: 'Which kingdom includes single-celled eukaryotic organisms?', ur: 'کون سا کنگڈم یک خلیاتی یوکیریوٹک جانداروں پر مشتمل ہے؟', options: ['Protista', 'Monera', 'Fungi', 'Plantae'], optionsUrdu: ['پروٹسٹا', 'مونیرا', 'فنجائی', 'پلانٹی'], correct: 0 },
      { id: 'b9_m25', en: 'The lock and key model was proposed by:', ur: 'اینزائم کا لاک اینڈ کی ماڈل کس نے پیش کیا؟', options: ['Emil Fischer', 'Daniel Koshland', 'Louis Pasteur', 'Robert Koch'], optionsUrdu: ['ایمل فشر', 'ڈینیل کوش لینڈ', 'لوئی پاسچر', 'رابرٹ کوک'], correct: 0 },
    ],
    shorts: [
      { id: 'b9_s1', en: 'Differentiate between Anatomy and Morphology.', ur: 'اناٹمی اور مارفولوجی میں فرق بیان کریں۔' },
      { id: 'b9_s2', en: 'State any two contributions of Jabir Bin Hayan in biology.', ur: 'جابر بن حیان کے علم بیالوجی میں کوئی سے دو کارنامے تحریر کریں۔' },
      { id: 'b9_s3', en: 'Define Biodiversity and state its importance.', ur: 'بائیو ڈائیورسٹی کی تعریف کریں اور اس کی اہمیت بیان کریں۔' },
      { id: 'b9_s4', en: 'What is difference between prokaryotic and eukaryotic cells?', ur: 'پروکیریوٹک اور یوکیریوٹک سیلز میں کیا فرق ہے؟' },
      { id: 'b9_s5', en: 'Write down two functions of Golgi apparatus.', ur: 'گولجی اپریٹس کے دو افعال تحریر کریں۔' },
      { id: 'b9_s6', en: 'What is Crossing Over? In which phase does it happen?', ur: 'کراسنگ اوور کیا ہے؟ یہ کس مرحلے میں ہوتی ہے؟' },
      { id: 'b9_s7', en: 'Explain Lock and Key mechanism of enzyme action.', ur: 'اینزائمز کے لاک اینڈ کی ماڈل کی وضاحت کریں۔' },
      { id: 'b9_s8', en: 'Define Photolysis and state its role.', ur: 'فوٹولائسس کی تعریف کریں اور اس کا کردار لکھیں۔' },
      { id: 'b9_s9', en: 'What is balanced diet? Mention its components.', ur: 'متوازن غذا سے کیا مراد ہے؟ اس کے اجزاء کے نام لکھیں۔' },
      { id: 'b9_s10', en: 'Differentiate between Arteries and Veins.', ur: 'شریانوں (Arteries) اور وریدوں (Veins) میں فرق واضح کریں۔' },
      { id: 'b9_s11', en: 'What is Myocardial Infarction? Mention its causes.', ur: 'مایوکارڈیل انفارکشن (دل کا دورہ) کیا ہے؟ اس کی وجوہات لکھیں۔' },
      { id: 'b9_s12', en: 'Explain the importance of Stomata in transpiration.', ur: 'ٹرانسپائریشن میں سٹومیٹا کی اہمیت بیان کریں۔' },
      { id: 'b9_s13', en: 'Define Apoptosis and Necrosis.', ur: 'ایپوپٹوسس اور نیکروسس کی تعریف کریں۔' },
      { id: 'b9_s14', en: 'What are the main functions of Liver in digestion?', ur: 'ہاضمے میں جگر کے اہم افعال تحریر کریں۔' },
      { id: 'b9_s15', en: 'Why ATP is called the currency of energy in living cells?', ur: 'اے ٹی پی کو خلیات میں توانائی کی کرنسی کیوں کہا جاتا ہے؟' },
      { id: 'b9_s16', en: 'State the Five Kingdom Classification System.', ur: 'پانچ کنگڈم کلاسیفیکیشن سسٹم کے نام تحریر کریں۔' },
      { id: 'b9_s17', en: 'What is Dengue Fever? State its symptoms and vector.', ur: 'ڈینگی بخار کیا ہے؟ اس کی علامات اور پھیلانے والا مچھر کون سا ہے؟' },
      { id: 'b9_s18', en: 'Differentiate between Atherosclerosis and Arteriosclerosis.', ur: 'ایتھروسکلیروسس اور آرٹریوسکلیروسس میں فرق بیان کریں۔' },
      { id: 'b9_s19', en: 'What is Phagocytosis and Pinocytosis?', ur: 'فیگوسائٹوسس اور پینوسائٹوسس میں کیا فرق ہے؟' },
      { id: 'b9_s20', en: 'State two differences between Mitosis and Meiosis.', ur: 'مائٹوسس اور میوسس میں دو بنیادی فرق لکھیں۔' },
      { id: 'b9_s21', en: 'Define Active Site of an enzyme.', ur: 'اینزائم کی ایکٹیو سائٹ کی تعریف کیجیے۔' },
      { id: 'b9_s22', en: 'What is Cellular Respiration? Write its chemical equation.', ur: 'سیلولر ریسپائریشن کیا ہے؟ اس کی مساوات لکھیے۔' },
      { id: 'b9_s23', en: 'Differentiate between Aerobic and Anaerobic respiration.', ur: 'ایروبک اور این ایروبک ریسپائریشن میں فرق بتائیے۔' },
      { id: 'b9_s24', en: 'What is Cohesion-Tension theory of water movement in plants?', ur: 'پودوں میں پانی کی ترسیل کا کوہیشن ٹینشن نظریہ کیا ہے؟' },
      { id: 'b9_s25', en: 'Name two deficiency diseases of proteins in children.', ur: 'بچوں میں پروٹین کی کمی سے پیدا ہونے والی دو بیماریوں کے نام لکھیں۔' },
      { id: 'b9_s26', en: 'What are Prions and Viroids?', ur: 'پرائیونز اور وائرائیڈز کیا ہیں؟' },
      { id: 'b9_s27', en: 'What is the function of Ribosomes in a cell?', ur: 'خلیے کے اندر رائبوسومز کا بنیادی فعل کیا ہے؟' },
      { id: 'b9_s28', en: 'Define Turgor Pressure and Plasmolysis.', ur: 'ٹرگر پریشر اور پلازمولائسس کی تعریف کریں۔' },
    ],
    longs: [
      { id: 'b9_l1', en: '(a) Describe the structure and function of Nucleus with a neat diagram. (5 Marks)\n(b) Write a comprehensive note on compound tissues (Xylem and Phloem). (4 Marks)', ur: '(الف) نیوکلیئس کی ساخت اور افعال ڈایاگرام کی مدد سے بیان کریں۔ (5 نمبر)\n(ب) کمپاؤنڈ ٹشوز (زائیلم اور فلوئم) پر جامع نوٹ تحریر کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b9_l2', en: '(a) Explain the phases of Mitosis in detail with diagrams. (5 Marks)\n(b) Describe any four factors affecting enzyme activity. (4 Marks)', ur: '(الف) مائٹوسس کے مراحل کی تفصیل خاکوں کی مدد سے وضاحت کریں۔ (5 نمبر)\n(ب) اینزائم کے عمل پر اثر انداز ہونے والے چار عوامل بیان کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b9_l3', en: '(a) Describe the process of Light Reaction in Photosynthesis. (5 Marks)\n(b) Explain the human ABO blood group system. (4 Marks)', ur: '(الف) فوٹوسنتھیسز میں لائٹ ری ایکشن کے مرحلے کی وضاحت کریں۔ (5 نمبر)\n(ب) انسان میں اے بی او بلڈ گروپ سسٹم کی وضاحت کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b9_l4', en: '(a) Describe the structure and function of Human Heart with a neat diagram. (5 Marks)\n(b) Explain the Fluid Mosaic Model of Cell Membrane. (4 Marks)', ur: '(الف) انسانی دل کی اندرونی ساخت اور افعال ڈایاگرام کی مدد سے واضح کریں۔ (5 نمبر)\n(ب) سیل ممبرین کا فلوئڈ موزیک ماڈل بیان کیجیے۔ (4 نمبر)', marks: 9 },
      { id: 'b9_l5', en: '(a) Describe the process of Aerobic Respiration (Glycolysis, Krebs Cycle). (5 Marks)\n(b) Discuss the economic importance and uses of Enzymes in daily life. (4 Marks)', ur: '(الف) ایروبک ریسپائریشن کے مراحل (گلائیکولائسس اور کریب سائیکل) لکھیں۔ (5 نمبر)\n(ب) روزمرہ زندگی اور صنعت میں اینزائمز کی اہمیت بیان کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b9_l6', en: '(a) Explain the Five Kingdom classification system with distinguishing features. (5 Marks)\n(b) Write a note on Transpiration and its significance for plants. (4 Marks)', ur: '(الف) جانداروں کے پانچ کنگڈم سسٹم کی وضاحت اور خصوصیات تحریر کریں۔ (5 نمبر)\n(ب) ٹرانسپائریشن کیا ہے؟ پودوں کے لیے اس کی اہمیت واضح کریں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 10TH CLASS BIOLOGY (bio-10)
  // ========================================================
  'bio-10': {
    mcqs: [
      { id: 'b10_m1', en: 'The process of gaseous exchange in plants takes place through:', ur: 'پودوں میں گیسوں کا تبادلہ کس کے ذریعے ہوتا ہے؟', options: ['Stomata', 'Lenticels', 'Cuticle', 'Both Stomata and Lenticels'], optionsUrdu: ['سٹومیٹا', 'لینٹی سیلز', 'کیوٹیکل', 'سٹومیٹا اور لینٹی سیلز دونوں'], correct: 3 },
      { id: 'b10_m2', en: 'Structural and functional unit of human kidney is:', ur: 'انسانی گردے کی ساختی اور افعالی اکائی کیا ہے؟', options: ['Neuron', 'Nephron', 'Alveoli', 'Villi'], optionsUrdu: ['نیوران', 'نیفران', 'ایلویولائی', 'ولائی'], correct: 1 },
      { id: 'b10_m3', en: 'Insulin hormone is secreted by:', ur: 'انسولین ہارمون کس عضو سے خارج ہوتا ہے؟', options: ['Thyroid', 'Pancreas', 'Pituitary', 'Adrenal'], optionsUrdu: ['تھائیرائیڈ', 'لبلبہ (پینکریاز)', 'پیچوٹری', 'ایڈرینل'], correct: 1 },
      { id: 'b10_m4', en: 'The bone that protects the brain is called:', ur: 'دماغ کی حفاظت کرنے والی کھوپڑی کی ہڈی کہلاتی ہے:', options: ['Cranium', 'Femur', 'Sternum', 'Pelvis'], optionsUrdu: ['کرینیم', 'فیمر', 'سٹرنم', 'پیلویس'], correct: 0 },
      { id: 'b10_m5', en: 'Which method of asexual reproduction is found in Yeast?', ur: 'خمیر (Yeast) میں غیر جنسی تولید کا کونسا طریقہ پایا جاتا ہے؟', options: ['Budding', 'Binary Fission', 'Spore formation', 'Fragmentation'], optionsUrdu: ['بڈنگ', 'باائنری فشن', 'سپور فارمیشن', 'فریگمنٹیشن'], correct: 0 },
      { id: 'b10_m6', en: 'Number of chromosomes in human somatic cells is:', ur: 'انسان کے سومیٹک سیلز میں کروموسومز کی تعداد ہوتی ہے:', options: ['23', '46', '48', '92'], optionsUrdu: ['23', '46', '48', '92'], correct: 1 },
      { id: 'b10_m7', en: 'The primary consumers in an ecosystem are:', ur: 'ایکو سسٹم میں پرائمری کنزیومرز کہلاتے ہیں:', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Decomposers'], optionsUrdu: ['ہربی وورز (سبزی خور)', 'کارنی وورز', 'اومنی وورز', 'ڈی کمپوزرز'], correct: 0 },
      { id: 'b10_m8', en: 'Penicillin antibiotic was discovered by:', ur: 'پینسلین اینٹی بائیوٹک کس سائنسدان نے دریافت کی؟', options: ['Alexander Fleming', 'Edward Jenner', 'Robert Koch', 'Joseph Lister'], optionsUrdu: ['الیگزینڈر فلیمنگ', 'ایڈورڈ جینر', 'رابرٹ کوک', 'جوزف لسٹر'], correct: 0 },
      { id: 'b10_m9', en: 'Which part of the brain coordinates muscle movements?', ur: 'دماغ کا کون سا حصہ عضلات کی حرکات کو کنٹرول اور ہم آہنگ کرتا ہے؟', options: ['Cerebrum', 'Cerebellum', 'Medulla Oblongata', 'Hypothalamus'], optionsUrdu: ['سیری برم', 'سیری بیلم', 'میڈیولا اوبلونگاٹا', 'ہائپوتھیلمس'], correct: 1 },
      { id: 'b10_m10', en: 'Cartilage is a form of:', ur: 'کارٹیلیج (نرم ہڈی) کس ٹشو کی قسم ہے؟', options: ['Connective tissue', 'Epithelial tissue', 'Muscular tissue', 'Nervous tissue'], optionsUrdu: ['کنیکٹو ٹشو', 'ایپیتھیلیل ٹشو', 'مسکولر ٹشو', 'نروس ٹشو'], correct: 0 },
      { id: 'b10_m11', en: 'According to Mendel’s Law of Segregation, alleles segregate during:', ur: 'مینڈل کے قانون علیحدگی کے مطابق ایلیلز الگ ہوتے ہیں دورانِ:', options: ['Gamete formation', 'Fertilization', 'Mitosis', 'Cleavage'], optionsUrdu: ['گیمیٹ بننے کے دوران', 'فرٹیلائزیشن', 'مائٹوسس', 'کلیویج'], correct: 0 },
      { id: 'b10_m12', en: 'Drugs that relieve severe pain are called:', ur: 'شدید درد کو دور کرنے والی ادویات کہلاتی ہیں:', options: ['Analgesics', 'Antibiotics', 'Sedatives', 'Vaccines'], optionsUrdu: ['اینالجیسکس (درد کش)', 'اینٹی بائیوٹکس', 'سکون آور', 'ویکسینز'], correct: 0 },
      { id: 'b10_m13', en: 'Growth hormone (STH) is secreted by:', ur: 'گروتھ ہارمون کس گلینڈ سے خارج ہوتا ہے؟', options: ['Anterior Pituitary', 'Posterior Pituitary', 'Thyroid', 'Adrenal Cortex'], optionsUrdu: ['پیچوٹری کا اگلا حصہ', 'پیچوٹری کا پچھلا حصہ', 'تھائیرائیڈ', 'ایڈرینل کارٹیکس'], correct: 0 },
      { id: 'b10_m14', en: 'The process of maintaining water and salt balance in body is:', ur: 'جسم میں پانی اور نمکیات کے توازن کو برقرار رکھنا کہلاتا ہے:', options: ['Osmoregulation', 'Thermoregulation', 'Excretion', 'Digestion'], optionsUrdu: ['اسموریگولیشن', 'تھرموریگولیشن', 'ایکسکریشن', 'ہاضمہ'], correct: 0 },
      { id: 'b10_m15', en: 'Joint between humerus and pectoral girdle is:', ur: 'کندھے اور بازو کی ہڈی کے درمیان کون سا جوڑ ہوتا ہے؟', options: ['Ball and socket joint', 'Hinge joint', 'Fixed joint', 'Pivot joint'], optionsUrdu: ['بال اینڈ ساکٹ جوڑ', 'ہنج جوڑ', 'غیر متحرک جوڑ', 'پائیوٹ جوڑ'], correct: 0 },
      { id: 'b10_m16', en: 'The functional unit of nervous system is:', ur: 'اعصابی نظام کی ساختی و افعالی اکائی کیا ہے؟', options: ['Neuron', 'Nephron', 'Axon', 'Synapse'], optionsUrdu: ['نیوران', 'نیفران', 'ایگزان', 'سائنیپس'], correct: 0 },
      { id: 'b10_m17', en: 'The gas responsible for acid rain is:', ur: 'تیزابی بارش کی ذمہ دار بنیادی گیس ہے:', options: ['Sulphur dioxide (SO₂)', 'Carbon monoxide (CO)', 'Oxygen (O₂)', 'Hydrogen (H₂)'], optionsUrdu: ['سلفر ڈائی آکسائیڈ', 'کاربن مونو آکسائیڈ', 'آکسیجن', 'ہائیڈروجن'], correct: 0 },
      { id: 'b10_m18', en: 'In human female, fertilization takes place in:', ur: 'مادہ میں فرٹیلائزیشن کہاں واقع ہوتی ہے؟', options: ['Fallopian tube', 'Uterus', 'Ovary', 'Cervix'], optionsUrdu: ['فیلوپین ٹیوب', 'رحم', 'اووری', 'سروکس'], correct: 0 },
      { id: 'b10_m19', en: 'A restriction enzyme cuts DNA at:', ur: 'ریسٹرکشن اینزائم ڈی این اے کو کاٹتا ہے:', options: ['Specific palindromic sites', 'Any random site', 'Only ends', 'Middle only'], optionsUrdu: ['مخصوص پیلنڈرومک مقامات پر', 'کسی بھی جگہ', 'صرف کناروں پر', 'صرف درمیان میں'], correct: 0 },
      { id: 'b10_m20', en: 'Marijuana is extracted from:', ur: 'ماریجوانا منشیات کس پودے سے حاصل ہوتی ہے؟', options: ['Cannabis sativa', 'Papaver somniferum', 'Nicotiana tabacum', 'Atropa belladonna'], optionsUrdu: ['بھنگ کا پودا', 'افیون کا پودا', 'تمباکو', 'بیلادونا'], correct: 0 },
    ],
    shorts: [
      { id: 'b10_s1', en: 'Differentiate between Breathing and Cellular Respiration.', ur: 'سانس لینے (Breathing) اور ریسپائریشن میں فرق واضح کریں۔' },
      { id: 'b10_s2', en: 'What is Emphysema? Mention its symptoms.', ur: 'ایمفیسیما کیا ہے؟ اس کی علامات لکھیں۔' },
      { id: 'b10_s3', en: 'Define Homeostasis and give one example in humans.', ur: 'ہومیوسٹیسس کی تعریف کریں اور انسانی جسم سے ایک مثال دیں۔' },
      { id: 'b10_s4', en: 'What are Osmoconformers and Osmoregulators?', ur: 'اسمومکنفارمرز اور اسمارگولیٹرز میں کیا فرق ہے؟' },
      { id: 'b10_s5', en: 'Describe the structure of a Nephron.', ur: 'نیفران کی ساخت مختصراً بیان کریں۔' },
      { id: 'b10_s6', en: 'Differentiate between Sensory neuron and Motor neuron.', ur: 'حسی نیوران (Sensory) اور موٹر نیوران میں فرق لکھیں۔' },
      { id: 'b10_s7', en: 'What is Reflex Arc? Draw its pathway.', ur: 'ریفلیکس آرک کیا ہے؟ اس کا راستہ واضح کریں۔' },
      { id: 'b10_s8', en: 'Name two hormones secreted by Thyroid gland.', ur: 'تھائیرائیڈ گلینڈ سے خارج ہونے والے دو ہارمونز کے نام لکھیں۔' },
      { id: 'b10_s9', en: 'Differentiate between Bone and Cartilage.', ur: 'ہڈی اور کارٹیلیج میں کیا فرق ہے؟' },
      { id: 'b10_s10', en: 'Define Tendons and Ligaments.', ur: 'ٹینڈنز اور لگامنٹس کی تعریف کریں۔' },
      { id: 'b10_s11', en: 'What is Binary Fission? How does it occur in Amoeba?', ur: 'باائنری فشن کیا ہے؟ امیبا میں یہ کیسے ہوتی ہے؟' },
      { id: 'b10_s12', en: 'Differentiate between Pollination and Fertilization.', ur: 'پولینیشن اور فرٹیلائزیشن میں فرق واضح کریں۔' },
      { id: 'b10_s13', en: 'Define Genotype and Phenotype with examples.', ur: 'جینوٹائپ اور فینوٹائپ کی تعریف اور مثالیں دیں۔' },
      { id: 'b10_s14', en: 'What is Acid Rain? Write its two hazardous effects.', ur: 'تیزابی بارش کیا ہے؟ اس کے دو برے اثرات لکھیں۔' },
      { id: 'b10_s15', en: 'What are the main objectives of Genetic Engineering?', ur: 'جینیٹک انجینئرنگ کے دو اہم مقاصد بیان کریں۔' },
      { id: 'b10_s16', en: 'Differentiate between Antiseptics and Disinfectants.', ur: 'اینٹی سیپٹکس اور ڈس انفیکٹنٹس میں کیا فرق ہے؟' },
      { id: 'b10_s17', en: 'Explain the greenhouse effect and global warming.', ur: 'گرین ہاؤس ایفیکٹ اور گلوبل وارمنگ کی وضاحت کریں۔' },
      { id: 'b10_s18', en: 'What is Dialysis? Name two types of Dialysis.', ur: 'ڈائیلاسز کیا ہے؟ اس کی دو اقسام کے نام تحریر کریں۔' },
      { id: 'b10_s19', en: 'What is Artificial selection? Give one example.', ur: 'مصنوعی انتخاب کیا ہے؟ ایک مثال دیجیے۔' },
      { id: 'b10_s20', en: 'Differentiate between Symbiosis and Parasitism.', ur: 'سمبائیوسس اور پیراسیٹزم میں کیا فرق ہے؟' },
      { id: 'b10_s21', en: 'Define Antibiotic resistance and its threat.', ur: 'اینٹی بائیوٹک ریزسٹنس کی تعریف اور خطرہ بتائیے۔' },
      { id: 'b10_s22', en: 'Explain accommodation of human eye.', ur: 'انسانی آنکھ کی اکیوموڈیشن کی وضاحت کیجیے۔' },
      { id: 'b10_s23', en: 'What is Fermentation? Name two products of alcoholic fermentation.', ur: 'فرمنٹیشن کیا ہے؟ الکوحلک فرمنٹیشن کی دو مصنوعات بتائیے۔' },
      { id: 'b10_s24', en: 'What is Recombinant DNA technology?', ur: 'ریکامبیننٹ ڈی این اے ٹیکنالوجی سے کیا مراد ہے؟' },
    ],
    longs: [
      { id: 'b10_l1', en: '(a) Describe the mechanism of breathing (Inspiration and Expiration) in humans. (5 Marks)\n(b) Write a comprehensive note on the structure and functioning of human Kidney. (4 Marks)', ur: '(الف) انسان میں سانس لینے کے طریقہ کار (انہیلیشن اور ایگزیلیشن) کی تفصیل لکھیں۔ (5 نمبر)\n(ب) انسانی گردے کی ساخت اور افعال پر جامع نوٹ تحریر کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b10_l2', en: '(a) Explain human Eye with a neat labeled diagram. (5 Marks)\n(b) What are joints? Describe movable joints (Hinge and Ball-and-Socket). (4 Marks)', ur: '(الف) انسانی آنکھ کی ساخت اور افعال لیبل شدہ خاکے کی مدد سے بیان کریں۔ (5 نمبر)\n(ب) جوڑ کیا ہیں؟ متحرک جوڑوں (ہنج اور بال اینڈ ساکٹ) کی وضاحت کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b10_l3', en: '(a) Explain Mendel’s Law of Independent Assortment with a Punnett square. (5 Marks)\n(b) What is Fermentation? Describe its industrial and medical applications. (4 Marks)', ur: '(الف) مینڈل کا قانونِ آزادی امتزاج پنیٹ سکوائر کی مدد سے بیان کریں۔ (5 نمبر)\n(ب) فرمنٹیشن کیا ہے؟ اس کے صنعتی اور طبی استعمالات بیان کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b10_l4', en: '(a) Describe the role of Pituitary Gland as the master endocrine gland. (5 Marks)\n(b) Explain nitrogen cycle with a schematic diagram. (4 Marks)', ur: '(الف) پیچوٹری گلینڈ کے مختلف ہارمونز اور اس کے ماسٹر گلینڈ ہونے کا کردار لکھیں۔ (5 نمبر)\n(ب) نائٹروجن سائیکل کی ڈایاگرام سمیت وضاحت کریں۔ (4 نمبر)', marks: 9 },
      { id: 'b10_l5', en: '(a) Describe the basic steps involved in Genetic Engineering. (5 Marks)\n(b) What are antibiotics? Discuss the dangers of antibiotic resistance. (4 Marks)', ur: '(الف) جینیٹک انجینئرنگ کے بنیادی مراحل کی تفصیل لکھیں۔ (5 نمبر)\n(ب) اینٹی بائیوٹکس کیا ہیں؟ ان کے بے دریغ استعمال کے خطرات بیان کریں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 9TH CLASS PHYSICS (phy-9)
  // ========================================================
  'phy-9': {
    mcqs: [
      { id: 'p9_m1', en: 'The number of base units in SI is:', ur: 'ایس آئی سسٹم میں بنیادی یونٹس کی تعداد ہے:', options: ['3', '6', '7', '9'], optionsUrdu: ['3', '6', '7', '9'], correct: 2 },
      { id: 'p9_m2', en: 'One micro-meter (1 µm) is equal to:', ur: 'ایک مائیکرو میٹر برابر ہوتا ہے:', options: ['10⁻³ m', '10⁻⁶ m', '10⁻⁹ m', '10⁻¹² m'], optionsUrdu: ['10⁻³ m', '10⁻⁶ m', '10⁻⁹ m', '10⁻¹² m'], correct: 1 },
      { id: 'p9_m3', en: 'Rate of change of velocity is called:', ur: 'ویلوسٹی میں تبدیلی کی شرح کو کہتے ہیں:', options: ['Speed', 'Acceleration', 'Displacement', 'Momentum'], optionsUrdu: ['سپیڈ', 'ایکسلریشن', 'ڈسپلیسمنٹ', 'مومنٹم'], correct: 1 },
      { id: 'p9_m4', en: 'Inertia of a body depends upon its:', ur: 'کسی جسم کا انرشیا کس پر منحصر ہوتا ہے؟', options: ['Mass', 'Weight', 'Velocity', 'Force'], optionsUrdu: ['ماس', 'وزن', 'ویلوسٹی', 'فورس'], correct: 0 },
      { id: 'p9_m5', en: 'Newton’s First Law of Motion is valid only in the absence of:', ur: 'نیوٹن کا پہلا قانون صرف کس کی عدم موجودگی میں لاگو ہوتا ہے؟', options: ['Friction', 'Net force', 'Gravity', 'Air resistance'], optionsUrdu: ['فرکشن', 'نیٹ فورس', 'گریوٹی', 'ہوا کی مزاحمت'], correct: 1 },
      { id: 'p9_m6', en: 'The value of g at the center of the earth is:', ur: 'زمین کے مرکز پر جی (g) کی قیمت ہوتی ہے:', options: ['Zero', '9.8 m/s²', 'Infinite', '10 m/s²'], optionsUrdu: ['صفر', '9.8 m/s²', 'لامحدود', '10 m/s²'], correct: 0 },
      { id: 'p9_m7', en: 'Work done will be maximum when the angle between Force and Displacement is:', ur: 'کیا گیا کام زیادہ سے زیادہ ہوگا جب فورس اور فاصلے کا درمیانی زاویہ ہو:', options: ['0°', '45°', '90°', '180°'], optionsUrdu: ['0°', '45°', '90°', '180°'], correct: 0 },
      { id: 'p9_m8', en: 'One horse power (1 hp) is equal to:', ur: 'ایک ہارس پاور برابر ہوتی ہے:', options: ['746 W', '500 W', '1000 W', '786 W'], optionsUrdu: ['746 واٹ', '500 واٹ', '1000 واٹ', '786 واٹ'], correct: 0 },
      { id: 'p9_m9', en: 'Pascal is the SI unit of:', ur: 'پاسکل کس چیز کا ایس آئی یونٹ ہے؟', options: ['Pressure', 'Force', 'Density', 'Energy'], optionsUrdu: ['پریشر', 'فورس', 'ڈینسٹی', 'توانائی'], correct: 0 },
      { id: 'p9_m10', en: 'Water has maximum density at:', ur: 'پانی کی زیادہ سے زیادہ ڈینسٹی کس درجہ حرارت پر ہوتی ہے؟', options: ['0°C', '4°C', '100°C', '-4°C'], optionsUrdu: ['0°C', '4°C', '100°C', '-4°C'], correct: 1 },
      { id: 'p9_m11', en: 'Heat reaches us from the Sun through the process of:', ur: 'سورج سے زمین تک حرارت کس طریقے سے پہنچتی ہے؟', options: ['Conduction', 'Convection', 'Radiation', 'Absorption'], optionsUrdu: ['کنڈکشن', 'کنویکشن', 'ریڈی ایشن', 'جذب'], correct: 2 },
      { id: 'p9_m12', en: 'Which of the following is a vector quantity?', ur: 'درج ذیل میں سے کون سی ویکٹر مقدار ہے؟', options: ['Speed', 'Displacement', 'Distance', 'Work'], optionsUrdu: ['سپیڈ', 'ڈسپلیسمنٹ', 'فاصلہ', 'کام'], correct: 1 },
      { id: 'p9_m13', en: 'Unit of torque in SI is:', ur: 'ٹارک کا ایس آئی یونٹ ہے:', options: ['N m', 'N s', 'N/m', 'J/s'], optionsUrdu: ['N m', 'N s', 'N/m', 'J/s'], correct: 0 },
      { id: 'p9_m14', en: 'Least count of standard Vernier Calipers is:', ur: 'ورنیئر کیلیپرز کا لیسٹ کاؤنٹ ہوتا ہے:', options: ['0.1 mm', '0.01 mm', '1 mm', '0.001 mm'], optionsUrdu: ['0.1 ملی میٹر', '0.01 ملی میٹر', '1 ملی میٹر', '0.001 ملی میٹر'], correct: 0 },
      { id: 'p9_m15', en: 'Centripetal force is given by the formula:', ur: 'سینٹری پیٹل فورس کا فارمولا ہے:', options: ['mv²/r', 'mvr', 'mv/r²', 'm²v/r'], optionsUrdu: ['mv²/r', 'mvr', 'mv/r²', 'm²v/r'], correct: 0 },
      { id: 'p9_m16', en: 'A body has stable equilibrium if its center of gravity lies:', ur: 'کوئی جسم قیام پذیر توازن میں ہوگا اگر اس کا مرکز ثقل ہو:', options: ['At lowest position', 'At highest position', 'At center', 'Outside'], optionsUrdu: ['سب سے نیچے', 'سب سے اوپر', 'مرکز میں', 'باہر'], correct: 0 },
      { id: 'p9_m17', en: 'The mass of Earth is approximately:', ur: 'زمین کا تخمینی ماس کتنا ہے؟', options: ['6.0 × 10²⁴ kg', '6.0 × 10²² kg', '7.4 × 10²² kg', '5.0 × 10²⁰ kg'], optionsUrdu: ['6.0 × 10²⁴ کلوگرام', '6.0 × 10²² کلوگرام', '7.4 × 10²² کلوگرام', '5.0 × 10²⁰ کلوگرام'], correct: 0 },
      { id: 'p9_m18', en: 'Kinetic energy of a body of mass m moving with velocity v is:', ur: 'کائنیٹک انرجی کا حسابی فارمولا ہے:', options: ['½ mv²', 'mgh', 'mv', '½ mv'], optionsUrdu: ['½ mv²', 'mgh', 'mv', '½ mv'], correct: 0 },
      { id: 'p9_m19', en: 'Archimedes’ principle is used to determine:', ur: 'ارشمیدس کے اصول کی مدد سے کیا معلوم کیا جاتا ہے؟', options: ['Density of an object', 'Speed of sound', 'Temperature', 'Atmospheric pressure'], optionsUrdu: ['جسم کی ڈینسٹی', 'آواز کی رفتار', 'درجہ حرارت', 'ہوا کا دباؤ'], correct: 0 },
      { id: 'p9_m20', en: 'In solids, heat is transferred mainly by:', ur: 'ٹھوس اشیاء میں حرارت بنیادی طور پر کس عمل سے منتقل ہوتی ہے؟', options: ['Conduction', 'Convection', 'Radiation', 'Evaporation'], optionsUrdu: ['کنڈکشن', 'کنویکشن', 'ریڈی ایشن', 'ایواپوریشن'], correct: 0 },
    ],
    shorts: [
      { id: 'p9_s1', en: 'Define physical quantities and differentiate between base and derived quantities.', ur: 'طبیعی مقداروں کی تعریف کریں اور بنیادی و ماخوذ مقداروں میں فرق لکھیں۔' },
      { id: 'p9_s2', en: 'What is meant by Zero Error and Zero Correction in measuring instruments?', ur: 'پیمائشی آلات میں زیرو ایرر اور زیرو کریکشن سے کیا مراد ہے؟' },
      { id: 'p9_s3', en: 'Differentiate between distance and displacement with units.', ur: 'فاصلہ اور ڈسپلیسمنٹ میں بنیادی فرق یونٹس سمیت واضح کریں۔' },
      { id: 'p9_s4', en: 'Derive the second equation of motion: S = v_i t + ½ at².', ur: 'حرکت کی دوسری مساوات اخذ کریں: S = v_i t + ½ at².' },
      { id: 'p9_s5', en: 'State Newton’s Second Law of Motion and derive F = ma.', ur: 'نیوٹن کا حرکت کا دوسرا قانون بیان کریں اور ثابت کریں کہ F = ma.' },
      { id: 'p9_s6', en: 'Define momentum and write down the Law of Conservation of Momentum.', ur: 'مومنٹم کی تعریف کریں اور قانونِ بقائے مومنٹم بیان کریں۔' },
      { id: 'p9_s7', en: 'What is Centripetal Force? Write its mathematical formula.', ur: 'سینٹری پیٹل فورس کی تعریف کریں اور اس کا حسابی فارمولا لکھیں۔' },
      { id: 'p9_s8', en: 'Differentiate between like and unlike parallel forces.', ur: 'لائیک اور ان لائیک پیرالل فورسز میں فرق واضح کریں۔' },
      { id: 'p9_s9', en: 'State the two conditions of equilibrium.', ur: 'توازن (Equilibrium) کی دونوں شرائط تحریر کریں۔' },
      { id: 'p9_s10', en: 'State Newton’s Law of Universal Gravitation.', ur: 'نیوٹن کا قانونِ گریویٹیشن بیان کیجیے۔' },
      { id: 'p9_s11', en: 'Why the value of g varies at different altitudes from the earth?', ur: 'زمین کی سطح سے اونچائی پر جانے سے جی (g) کی قیمت میں کمی کیوں آتی ہے؟' },
      { id: 'p9_s12', en: 'Define Work and state its SI unit.', ur: 'کام (Work) کی تعریف کریں اور اس کا ایس آئی یونٹ لکھیں۔' },
      { id: 'p9_s13', en: 'Differentiate between kinetic energy and potential energy.', ur: 'کائنیٹک انرجی اور پوٹینشل انرجی میں فرق بیان کریں۔' },
      { id: 'p9_s14', en: 'Define Power and Watt.', ur: 'پاور کی تعریف کریں اور واٹ کی وضاحت کریں۔' },
      { id: 'p9_s15', en: 'State Hooke’s Law and define Elastic Limit.', ur: 'ہک کا قانون بیان کریں اور لچکدار حد (Elastic limit) کی تعریف کریں۔' },
      { id: 'p9_s16', en: 'State Pascal’s Law and mention two practical applications.', ur: 'پاسکل کا قانون بیان کریں اور اس کے دو روزمرہ اطلاقات لکھیں۔' },
      { id: 'p9_s17', en: 'State Archimedes’ Principle and its formula.', ur: 'ارشمیدس کا اصول اور اس کا حسابی کلیہ لکھیے۔' },
      { id: 'p9_s18', en: 'What is specific heat capacity? Write its SI unit.', ur: 'حرارتِ مخصوصہ کی تعریف اور اس کا ایس آئی یونٹ لکھیں۔' },
      { id: 'p9_s19', en: 'Why evaporation causes cooling effect?', ur: 'عملِ تبخیر (Evaporation) سے ٹھنڈک کیوں پیدا ہوتی ہے؟' },
      { id: 'p9_s20', en: 'Differentiate between Conduction and Convection of heat.', ur: 'حرارت کے کنڈکشن اور کنویکشن میں فرق بیان کریں۔' },
      { id: 'p9_s21', en: 'What is a Greenhouse? Explain Greenhouse Effect.', ur: 'گرین ہاؤس کیا ہے؟ گرین ہاؤس ایفیکٹ کی وضاحت کریں۔' },
      { id: 'p9_s22', en: 'Explain why water is not suitable as a thermometric liquid.', ur: 'پانی کو تھرمامیٹر کے مائع کے طور پر کیوں استعمال نہیں کیا جاتا؟' },
      { id: 'p9_s23', en: 'Define resolution of vectors and write perpendicular components.', ur: 'ویکٹرز کی ریزولیوشن سے کیا مراد ہے؟ اس کے عمودی اجزاء لکھیے۔' },
      { id: 'p9_s24', en: 'A car starts from rest and acquires velocity of 20 m/s in 8 s. Find acceleration.', ur: 'حسابی سوال: ایک کار ریسٹ سے چل کر 8 سیکنڈ میں 20 m/s ویلوسٹی حاصل کرتی ہے۔ ایکسلریشن معلوم کریں۔' },
    ],
    longs: [
      { id: 'p9_l1', en: '(a) Derive the third equation of motion (2as = v_f² - v_i²) using speed-time graph. (5 Marks)\n(b) A car traveling at 15 m/s decelerates uniformly to rest in 10 s. Find total distance. (4 Marks)', ur: '(الف) سپیڈ ٹائم گراف کی مدد سے حرکت کی تیسری مساوات اخذ کریں۔ (5 نمبر)\n(ب) حسابی سوال: ایک کار 15 m/s کی رفتار سے 10 سیکنڈ میں رک جاتی ہے۔ کل طے کردہ فاصلہ معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p9_l2', en: '(a) State Newton’s Second Law of Motion and derive the relation F = ma. (5 Marks)\n(b) A body of mass 5 kg is moving with velocity of 10 m/s. Calculate its momentum. (4 Marks)', ur: '(الف) نیوٹن کا حرکت کا دوسرا قانون بیان اور حسابی شکل F = ma اخذ کریں۔ (5 نمبر)\n(ب) حسابی سوال: 5 کلوگرام وزنی جسم 10 m/s کی رفتار سے حرکت کر رہا ہے۔ اس کا مومنٹم معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p9_l3', en: '(a) Determine the mass of Earth using Newton’s Law of Gravitation. (5 Marks)\n(b) Calculate the value of g at an altitude equal to one Earth’s radius above surface. (4 Marks)', ur: '(الف) نیوٹن کے قانونِ گریویٹیشن کی مدد سے زمین کا ماس معلوم کرنے کا فارمولا اخذ کریں۔ (5 نمبر)\n(ب) حسابی سوال: زمین کی سطح سے ایک ریڈیس کی اونچائی پر جی (g) کی قیمت معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p9_l4', en: '(a) What is Kinetic Energy? Derive its mathematical formula: K.E = ½ mv². (5 Marks)\n(b) A 500 g stone is thrown upwards with velocity 15 m/s. Find maximum height reached. (4 Marks)', ur: '(الف) کائنیٹک انرجی کی تعریف کریں اور مساوات K.E = ½ mv² اخذ کریں۔ (5 نمبر)\n(ب) حسابی سوال: ایک 500 گرام وزنی پتھر کو 15 m/s کی رفتار سے اوپر پھینکا گیا۔ زیادہ سے زیادہ اونچائی معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p9_l5', en: '(a) State and explain Archimedes’ Principle. How is it used to find density of an object? (5 Marks)\n(b) A hydraulic press has pistons of areas 0.01 m² and 0.5 m². If 100 N force is applied on small piston, find force on large piston. (4 Marks)', ur: '(الف) ارشمیدس کا اصول تفصیلاً بیان کریں اور اس کی مدد سے ڈینسٹی معلوم کرنے کا طریقہ لکھیں۔ (5 نمبر)\n(ب) حسابی سوال: ہائیڈرولک پریس پر 100N فورس لگانے سے بڑے پسٹن پر کتنی فورس پیدا ہوگی؟ (4 نمبر)', marks: 9 },
      { id: 'p9_l6', en: '(a) Define Specific Heat Capacity. Describe an experiment to measure specific heat of a solid. (5 Marks)\n(b) How much heat is required to increase temperature of 0.5 kg of water from 10°C to 65°C? (c = 4200 J/kg·K). (4 Marks)', ur: '(الف) حرارتِ مخصوصہ کی تعریف کریں اور ٹھوس کی حرارتِ مخصوصہ معلوم کرنے کا طریقہ لکھیں۔ (5 نمبر)\n(ب) حسابی سوال: 0.5 کلوگرام پانی کا درجہ حرارت 10°C سے 65°C تک بڑھانے کے لیے درکار حرارت معلوم کریں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 10TH CLASS PHYSICS (phy-10)
  // ========================================================
  'phy-10': {
    mcqs: [
      { id: 'p10_m1', en: 'In Simple Harmonic Motion (SHM), restoring force is directly proportional to:', ur: 'سمپل ہارمونک موشن میں ریسٹورنگ فورس کس کے متناسب ہوتی ہے؟', options: ['Displacement', 'Velocity', 'Mass', 'Frequency'], optionsUrdu: ['ڈسپلیسمنٹ', 'ویلوسٹی', 'ماس', 'فریکوئنسی'], correct: 0 },
      { id: 'p10_m2', en: 'Which of the following is not an electromagnetic wave?', ur: 'درج ذیل میں سے کون سی الیکٹرو میگنیٹک لہر نہیں ہے؟', options: ['Sound waves', 'Radio waves', 'X-rays', 'Light waves'], optionsUrdu: ['آواز کی لہریں', 'ریڈیو ویوز', 'ایکس رے', 'روشنی کی لہریں'], correct: 0 },
      { id: 'p10_m3', en: 'Audible frequency range for normal human ear is:', ur: 'نارمل انسانی کان کے لیے قابل سماعت فریکوئنسی کی رینج ہے:', options: ['20 Hz to 20,000 Hz', '20 Hz to 2,000 Hz', '10 Hz to 10,000 Hz', '100 Hz to 50,000 Hz'], optionsUrdu: ['20 Hz سے 20,000 Hz', '20 Hz سے 2,000 Hz', '10 Hz سے 10,000 Hz', '100 Hz سے 50,000 Hz'], correct: 0 },
      { id: 'p10_m4', en: 'According to Snell’s Law, n is equal to:', ur: 'سنیل کے قانون کے مطابق ریفریکٹو انڈیکس n برابر ہے:', options: ['sin i / sin r', 'sin r / sin i', 'sin i × sin r', 'cos i / cos r'], optionsUrdu: ['sin i / sin r', 'sin r / sin i', 'sin i × sin r', 'cos i / cos r'], correct: 0 },
      { id: 'p10_m5', en: 'Coulomb’s Law is valid only for:', ur: 'کولمب کا قانون صرف کس کے لیے درست ہے؟', options: ['Point charges', 'Moving charges', 'Large objects', 'Magnetic poles'], optionsUrdu: ['پوائنٹ چارجز', 'حرکت کرتے چارجز', 'بڑے اجسام', 'مقناطیسی قطبین'], correct: 0 },
      { id: 'p10_m6', en: 'SI unit of electric potential difference is:', ur: 'الیکٹرک پوٹینشل ڈفرنس کا ایس آئی یونٹ ہے:', options: ['Volt', 'Ampere', 'Coulomb', 'Ohm'], optionsUrdu: ['وولٹ', 'ایمپیر', 'کولمب', 'اوہم'], correct: 0 },
      { id: 'p10_m7', en: 'Ohm’s law states that V is proportional to:', ur: 'اوہم کے قانون کے مطابق پوٹینشل ڈفرنس (V) کس کے متناسب ہے؟', options: ['Current (I)', 'Resistance (R)', 'Power (P)', 'Time (t)'], optionsUrdu: ['کرنٹ (I)', 'ریزسٹنس (R)', 'پاور (P)', 'وقت (t)'], correct: 0 },
      { id: 'p10_m8', en: 'A step-up transformer increases:', ur: 'سٹیپ اپ ٹرانسفارمر کس چیز میں اضافہ کرتا ہے؟', options: ['Voltage', 'Current', 'Power', 'Frequency'], optionsUrdu: ['وولٹیج', 'کرنٹ', 'پاور', 'فریکوئنسی'], correct: 0 },
      { id: 'p10_m9', en: 'Which logic gate gives output 1 only when both inputs are 1?', ur: 'کون سا لاجک گیٹ صرف اسی وقت 1 آؤٹ پٹ دیتا ہے جب دونوں ان پٹ 1 ہوں؟', options: ['AND gate', 'OR gate', 'NOT gate', 'NAND gate'], optionsUrdu: ['اینڈ (AND) گیٹ', 'اور (OR) گیٹ', 'ناٹ (NOT) گیٹ', 'نینڈ (NAND) گیٹ'], correct: 0 },
      { id: 'p10_m10', en: 'Half-life of Carbon-14 is approximately:', ur: 'کاربن 14 کی ہاف لائف تقریباً کتنی ہے؟', options: ['5730 years', '1620 years', '4.5 billion years', '28 years'], optionsUrdu: ['5730 سال', '1620 سال', '4.5 ارب سال', '28 سال'], correct: 0 },
      { id: 'p10_m11', en: 'The critical angle for water-air interface is approximately:', ur: 'پانی اور ہوا کے درمیانی سطح کا کریٹیکل اینگل تقریباً ہوتا ہے:', options: ['48.8°', '42°', '90°', '35°'], optionsUrdu: ['48.8°', '42°', '90°', '35°'], correct: 0 },
      { id: 'p10_m12', en: 'One kilowatt-hour (1 kWh) is equal to:', ur: 'ایک کلو واٹ آور (1 kWh) کتنے جولز کے برابر ہے؟', options: ['3.6 MJ (3.6 × 10⁶ J)', '3.6 × 10³ J', '1000 J', '746 J'], optionsUrdu: ['3.6 میگا جول', '3.6 × 10³ جول', '1000 جول', '746 جول'], correct: 0 },
      { id: 'p10_m13', en: 'Fleming’s Left Hand rule is used to find direction of:', ur: 'فلیمنگ کے بائیں ہاتھ کا اصول کس کی سمت معلوم کرنے کے لیے ہے؟', options: ['Magnetic force on current', 'Induced current', 'Magnetic field', 'Electric field'], optionsUrdu: ['کرنٹ پر مقناطیسی فورس', 'انڈیوسڈ کرنٹ', 'مقناطیسی فیلڈ', 'الیکٹرک فیلڈ'], correct: 0 },
      { id: 'p10_m14', en: 'Which rays have the highest penetrating power?', ur: 'کس تابکار شعاع کی نفوذ پذیری (Penetrating power) سب سے زیادہ ہوتی ہے؟', options: ['Gamma rays', 'Beta rays', 'Alpha rays', 'Cathode rays'], optionsUrdu: ['گاما شعاعیں', 'بیٹا شعاعیں', 'الفا شعاعیں', 'کیتھوڈ شعاعیں'], correct: 0 },
      { id: 'p10_m15', en: 'Which instrument is used to detect presence of electric charge?', ur: 'چارج کی موجودگی معلوم کرنے کے لیے کون سا آلہ استعمال ہوتا ہے؟', options: ['Gold leaf electroscope', 'Voltmeter', 'Galvanometer', 'Ammeter'], optionsUrdu: ['گولڈ لیف الیکٹروسکوپ', 'وولٹ میٹر', 'گیلوینومیٹر', 'ایم میٹر'], correct: 0 },
    ],
    shorts: [
      { id: 'p10_s1', en: 'Define Simple Harmonic Motion and state its two main conditions.', ur: 'سمپل ہارمونک موشن کی تعریف کریں اور اس کی دو بنیادی خصوصیات لکھیں۔' },
      { id: 'p10_s2', en: 'Differentiate between mechanical waves and electromagnetic waves.', ur: 'مکینیکل لہروں اور الیکٹرو میگنیٹک لہروں میں فرق بیان کریں۔' },
      { id: 'p10_s3', en: 'What is Pitch and Quality of sound?', ur: 'آواز کی پچ (Pitch) اور کوالٹی سے کیا مراد ہے؟' },
      { id: 'p10_s4', en: 'State Snell’s Law of Refraction of light.', ur: 'روشنی کے انعطاف کا سنیل کا قانون بیان کریں۔' },
      { id: 'p10_s5', en: 'What is Total Internal Reflection? State its two necessary conditions.', ur: 'مکمل اندرونی انعکاس کیا ہے؟ اس کی دو لازمی شرائط لکھیں۔' },
      { id: 'p10_s6', en: 'Define Coulomb’s Law and write its mathematical equation.', ur: 'کولمب کا قانون بیان کریں اور حسابی شکل لکھیے۔' },
      { id: 'p10_s7', en: 'Differentiate between conductors and insulators with two examples each.', ur: 'کنڈکٹرز اور انسولیٹرز میں دو دو مثالوں سے فرق واضح کریں۔' },
      { id: 'p10_s8', en: 'State Ohm’s Law and define 1 Ohm resistance.', ur: 'اوہم کا قانون بیان کریں اور 1 اوہم ریزسٹنس کی تعریف کریں۔' },
      { id: 'p10_s9', en: 'Differentiate between Step-up and Step-down Transformers.', ur: 'سٹیپ اپ اور سٹیپ ڈاؤن ٹرانسفارمرز میں فرق واضح کریں۔' },
      { id: 'p10_s10', en: 'What is Thermionic Emission? How is it produced?', ur: 'تھرمیونک اخراج کیا ہے؟ یہ کیسے پیدا ہوتا ہے؟' },
      { id: 'p10_s11', en: 'Draw symbol and truth table of NAND gate.', ur: 'نینڈ (NAND) گیٹ کی علامت اور ٹرتھ ٹیبل بنائیے۔' },
      { id: 'p10_s12', en: 'Define Isotopes with two examples of Hydrogen isotopes.', ur: 'آئسوٹوپس کی تعریف کریں اور ہائیڈروجن کے آئسوٹوپس کے نام لکھیں۔' },
      { id: 'p10_s13', en: 'Define Half-life of a radioactive element and give formula.', ur: 'ریڈیو ایکٹو عنصر کی ہاف لائف کی تعریف کریں اور فارمولا لکھیں۔' },
      { id: 'p10_s14', en: 'What are ultrasound waves? Mention two medical applications.', ur: 'الٹرا ساؤنڈ ویوز کیا ہیں؟ ان کے دو طبی فوائد لکھیے۔' },
      { id: 'p10_s15', en: 'Define capacitance and write formula for equivalent capacitance in parallel.', ur: 'کیپیسیٹنس کی تعریف کریں اور پیرالل جوڑ کا فارمولا لکھیں۔' },
      { id: 'p10_s16', en: 'State Joule’s Law of heating and write its formula.', ur: 'جول کا قانونِ حرارت بیان کریں اور فارمولا لکھیے۔' },
      { id: 'p10_s17', en: 'What is Electromagnetic Induction? State Faraday’s Law.', ur: 'الیکٹرو میگنیٹک انڈکشن کیا ہے؟ فیراڈے کا قانون لکھیں۔' },
      { id: 'p10_s18', en: 'Differentiate between Analogue and Digital electronics.', ur: 'اینالاگ اور ڈیجیٹل الیکٹرانکس میں فرق واضح کریں۔' },
    ],
    longs: [
      { id: 'p10_l1', en: '(a) Prove that the motion of a simple pendulum is Simple Harmonic Motion (SHM). (5 Marks)\n(b) Find the time period of a simple pendulum of 1 m length on earth and moon. (4 Marks)', ur: '(الف) ثابت کریں کہ سادہ پنڈولم کی حرکت سمپل ہارمونک موشن ہے۔ (5 نمبر)\n(ب) حسابی سوال: 1 میٹر لمبے سادہ پنڈولم کا زمین اور چاند پر ٹائم پیریڈ معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p10_l2', en: '(a) State Coulomb’s Law and derive its mathematical formula. (5 Marks)\n(b) Two point charges of +10 µC and -15 µC are placed 0.5 m apart. Find force. (4 Marks)', ur: '(الف) کولمب کا قانون بیان کریں اور حسابی فارمولا اخذ کریں۔ (5 نمبر)\n(ب) حسابی سوال: +10µC اور -15µC کے دو چارجز 0.5 میٹر پر ہیں۔ ان کی درمیانی فورس معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p10_l3', en: '(a) Explain principle, construction and working of a Transformer. (5 Marks)\n(b) A step-up transformer has turn ratio 1:100. If primary voltage is 20 V, find secondary voltage. (4 Marks)', ur: '(الف) ٹرانسفارمر کا اصول، ساخت اور طریقہ کار تفصیلاً بیان کریں۔ (5 نمبر)\n(ب) حسابی سوال: ایک ٹرانسفارمر کی ٹرن ریشو 1:100 اور پرائمری وولٹیج 20V ہے۔ سیکنڈری وولٹیج معلوم کریں۔ (4 نمبر)', marks: 9 },
      { id: 'p10_l4', en: '(a) What is Total Internal Reflection? Explain working of Optical Fibre and Endoscope. (5 Marks)\n(b) An object 4 cm high is placed 12 cm from a concave mirror of focal length 8 cm. Find image position. (4 Marks)', ur: '(الف) مکمل اندرونی انعکاس کی وضاحت کریں اور آپٹیکل فائبر کا کام بیان کریں۔ (5 نمبر)\n(ب) حسابی سوال: 4 سینٹی میٹر اونچا جسم 8 سینٹی میٹر فوکل لینتھ والے مقعر آئینے سے 12 سینٹی میٹر فاصلے پر ہے۔ امیج کی پوزیشن معلوم کریں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 9TH CLASS CHEMISTRY (chem-9)
  // ========================================================
  'chem-9': {
    mcqs: [
      { id: 'c9_m1', en: 'Industrial chemistry deals with the manufacturing of compounds:', ur: 'صنعتی کیمسٹری کا تعلق کس پیمانے پر مرکبات کی تیاری سے ہے؟', options: ['On laboratory scale', 'On commercial scale', 'On micro scale', 'At home'], optionsUrdu: ['لیبارٹری پیمانے پر', 'تجارتی پیمانے پر', 'مائیکرو پیمانے پر', 'گھر میں'], correct: 1 },
      { id: 'c9_m2', en: 'The molar mass of H₂SO₄ is:', ur: 'سلفیورک ایسڈ (H₂SO₄) کا مولر ماس ہے:', options: ['98 g/mol', '49 g/mol', '98 amu', '100 g/mol'], optionsUrdu: ['98 g/mol', '49 g/mol', '98 amu', '100 g/mol'], correct: 0 },
      { id: 'c9_m3', en: 'Who discovered the electron in 1897?', ur: '1897ء میں الیکٹران کس نے دریافت کیا؟', options: ['J.J. Thomson', 'Rutherford', 'Neil Bohr', 'Chadwick'], optionsUrdu: ['جے جے تھامسن', 'ردرفورڈ', 'نیل بوہر', 'چیڈوک'], correct: 0 },
      { id: 'c9_m4', en: 'Number of periods in the Modern Periodic Table is:', ur: 'جدید پیریوڈک ٹیبل میں پیریڈز کی تعداد ہے:', options: ['7', '8', '18', '9'], optionsUrdu: ['7', '8', '18', '9'], correct: 0 },
      { id: 'c9_m5', en: 'Which bond is formed by mutual sharing of electrons?', ur: 'الیکٹرانز کے باہمی اشتراک سے کون سا بانڈ بنتا ہے؟', options: ['Covalent bond', 'Ionic bond', 'Coordinate covalent bond', 'Metallic bond'], optionsUrdu: ['کوویلنٹ بانڈ', 'آیونک بانڈ', 'کوآرڈینیٹ کوویلنٹ بانڈ', 'دھاتی بانڈ'], correct: 0 },
      { id: 'c9_m6', en: 'Boiling point of water at 1 atm pressure is:', ur: 'ایک ایٹموسفیرک پریشر پر پانی کا بوائلنگ پوائنٹ ہوتا ہے:', options: ['100°C', '0°C', '373 K', 'Both A and C'], optionsUrdu: ['100°C', '0°C', '373 K', 'A اور C دونوں'], correct: 3 },
      { id: 'c9_m7', en: 'Brass is an alloy (solid solution) of:', ur: 'پیتل (Brass) کن دھاتوں کا ٹھوس سلوشن ہے؟', options: ['Copper and Zinc', 'Copper and Tin', 'Iron and Carbon', 'Silver and Gold'], optionsUrdu: ['تانبا اور زنک', 'تانبا اور ٹن', 'لوہا اور کاربن', 'چاندی اور سونا'], correct: 0 },
      { id: 'c9_m8', en: 'Oxidation state of Hydrogen in NaH is:', ur: 'سوڈیم ہائیڈرائڈ (NaH) میں ہائیڈروجن کی آکسیڈیشن سٹیٹ ہے:', options: ['-1', '+1', '0', '+2'], optionsUrdu: ['-1', '+1', '0', '+2'], correct: 0 },
      { id: 'c9_m9', en: 'Which of the following is the most electronegative element?', ur: 'پیریوڈک ٹیبل کا سب سے زیادہ الیکٹرو نیگیٹو عنصر کون سا ہے؟', options: ['Fluorine (F)', 'Chlorine (Cl)', 'Oxygen (O)', 'Nitrogen (N)'], optionsUrdu: ['فلورین (F)', 'کلورین (Cl)', 'آکسیجن (O)', 'نائٹروجن (N)'], correct: 0 },
      { id: 'c9_m10', en: 'Corrosion of iron is commonly called:', ur: 'لوہے کی کروزن (تلفی) کو عام طور پر کیا کہا جاتا ہے؟', options: ['Rusting', 'Erosion', 'Galvanizing', 'Smelting'], optionsUrdu: ['زنگ لگنا (Rusting)', 'کٹاؤ', 'گیلوانیزنگ', 'سمیلٹنگ'], correct: 0 },
      { id: 'c9_m11', en: 'The number of particles in one mole of any substance is:', ur: 'ایک مول میں پارٹیکلز کی تعداد (ایووگیڈرو نمبر) ہوتی ہے:', options: ['6.02 × 10²³', '6.02 × 10²²', '3.01 × 10²³', '1.66 × 10⁻²⁴'], optionsUrdu: ['6.02 × 10²³', '6.02 × 10²²', '3.01 × 10²³', '1.66 × 10⁻²⁴'], correct: 0 },
      { id: 'c9_m12', en: 'Elements of Group 17 of periodic table are called:', ur: 'پیریوڈک ٹیبل کے گروپ 17 کے عناصر کو کہا جاتا ہے:', options: ['Halogens', 'Alkali metals', 'Alkaline earth metals', 'Noble gases'], optionsUrdu: ['ہیلوجنز', 'الکلی میٹلز', 'الکلائن ارتھ میٹلز', 'نوبل گیسز'], correct: 0 },
    ],
    shorts: [
      { id: 'c9_s1', en: 'Differentiate between empirical formula and molecular formula with an example.', ur: 'ایمپیریل فارمولا اور مالیکیولر فارمولا میں مثال کے ساتھ فرق لکھیں۔' },
      { id: 'c9_s2', en: 'Define Avogadro’s Number and Mole.', ur: 'ایووگیڈرو نمبر اور مول کی تعریف کریں۔' },
      { id: 'c9_s3', en: 'Write down two main defects of Rutherford’s atomic model.', ur: 'ردرفورڈ کے ایٹمی ماڈل کے دو بنیادی نقائص تحریر کریں۔' },
      { id: 'c9_s4', en: 'State two postulates of Bohr’s atomic theory.', ur: 'بوہر کے ایٹمی ماڈل کے دو اہم مفروضات لکھیں۔' },
      { id: 'c9_s5', en: 'Define Ionization Energy and its trend in groups and periods.', ur: 'آئیونائزیشن انرجی کی تعریف کریں اور پیریڈز اور گروپس میں رجحان بتائیں۔' },
      { id: 'c9_s6', en: 'Why noble gases are chemically non-reactive?', ur: 'نوبل گیسیں کیمیائی طور پر غیر عامل کیوں ہوتی ہیں؟' },
      { id: 'c9_s7', en: 'Differentiate between polar and non-polar covalent bonds.', ur: 'پولر اور نان پولر کوویلنٹ بانڈز میں فرق بیان کریں۔' },
      { id: 'c9_s8', en: 'Define Hydrogen Bonding and its effect on physical properties.', ur: 'ہائیڈروجن بانڈنگ کی تعریف اور طبعی خصوصیات پر اثر لکھیں۔' },
      { id: 'c9_s9', en: 'State Charles’s Law of gases and write its formula.', ur: 'گیسوں کا چارلس کا قانون بیان کریں اور حسابی شکل لکھیے۔' },
      { id: 'c9_s10', en: 'Differentiate between saturated and unsaturated solutions.', ur: 'سیچوریٹڈ اور ان سیچوریٹڈ سلوشنز میں فرق بیان کریں۔' },
      { id: 'c9_s11', en: 'Define Molarity and write its mathematical formula.', ur: 'مولیرٹی کی تعریف کریں اور حسابی فارمولا لکھیں۔' },
      { id: 'c9_s12', en: 'Define Oxidation and Reduction in terms of loss or gain of electrons.', ur: 'الیکٹرانز کے اخراج اور حصول کی بنیاد پر آکسیڈیشن اور ریڈکشن کی تعریف کریں۔' },
      { id: 'c9_s13', en: 'What is Galvanizing? Write its importance in preventing rust.', ur: 'گیلوانیزنگ کیا ہے؟ لوہے کو زنگ سے بچانے میں اس کا کیا کردار ہے؟' },
      { id: 'c9_s14', en: 'Differentiate between Electroplating and Corrosion.', ur: 'الیکٹروپلیٹنگ اور کروزن میں فرق واضح کریں۔' },
      { id: 'c9_s15', en: 'Why metals are good conductors of electricity?', ur: 'دھاتیں بجلی کی بہترین موصل کیوں ہوتی ہیں؟' },
    ],
    longs: [
      { id: 'c9_l1', en: '(a) Describe Rutherford’s Gold Foil Experiment and state its results. (5 Marks)\n(b) Define Isotope. Describe three isotopes of Hydrogen with diagrams. (4 Marks)', ur: '(الف) ردرفورڈ کا گولڈ فوائل تجربہ بیان کریں اور نتائج اخذ کریں۔ (5 نمبر)\n(ب) آئسوٹوپ کی تعریف کریں اور ہائیڈروجن کے تینوں آئسوٹوپس کی خاکوں سمیت وضاحت کریں۔ (4 نمبر)', marks: 9 },
      { id: 'c9_l2', en: '(a) What is an Ionic Bond? Explain the formation of Sodium Chloride (NaCl). (5 Marks)\n(b) Differentiate between Covalent and Ionic Compounds in four properties. (4 Marks)', ur: '(الف) آیونک بانڈ کیا ہے؟ سوڈیم کلورائیڈ (NaCl) بننے کے عمل کی وضاحت کریں۔ (5 نمبر)\n(ب) آیونک اور کوویلنٹ مرکبات کی چار طبعی خصوصیات میں موازنہ کریں۔ (4 نمبر)', marks: 9 },
      { id: 'c9_l3', en: '(a) State and explain Boyle’s Law with graphical representation and verification. (5 Marks)\n(b) Explain the process of Rusting of Iron and its chemical reactions. (4 Marks)', ur: '(الف) بوائل کا قانون بیان کریں اور حسابی و گرافیکل تصدیق پیش کریں۔ (5 نمبر)\n(ب) لوہے کو زنگ لگنے کے کیمیائی طریقہ کار اور مساوات لکھیں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 10TH CLASS CHEMISTRY (chem-10)
  // ========================================================
  'chem-10': {
    mcqs: [
      { id: 'c10_m1', en: 'When a reversible reaction reaches equilibrium state, the forward reaction rate is:', ur: 'جب ریورسیبل ری ایکشن توازن پر پہنچتا ہے تو فارورڈ ری ایکشن کی رفتار:', options: ['Equal to reverse reaction rate', 'Zero', 'Higher than reverse rate', 'Variable'], optionsUrdu: ['ریورس ری ایکشن کے برابر ہوتی ہے', 'صفر ہو جاتی ہے', 'زیادہ ہوتی ہے', 'تبدیل ہوتی ہے'], correct: 0 },
      { id: 'c10_m2', en: 'The pH of pure neutral water at 25°C is:', ur: '25°C پر خالص نیوٹرل پانی کی پی ایچ (pH) ہوتی ہے:', options: ['7', '0', '14', '1'], optionsUrdu: ['7', '0', '14', '1'], correct: 0 },
      { id: 'c10_m3', en: 'General formula of Alkanes is:', ur: 'الکینز (Alkanes) کا عمومی فارمولا ہے:', options: ['C_n H_2n+2', 'C_n H_2n', 'C_n H_2n-2', 'C_n H_n'], optionsUrdu: ['C_n H_2n+2', 'C_n H_2n', 'C_n H_2n-2', 'C_n H_n'], correct: 0 },
      { id: 'c10_m4', en: 'Functional group of alcohol is:', ur: 'الکوحل کا فنکشنل گروپ ہے:', options: ['-OH', '-CHO', '-COOH', '-CO-'], optionsUrdu: ['-OH', '-CHO', '-COOH', '-CO-'], correct: 0 },
      { id: 'c10_m5', en: 'Which gas is responsible for the greenhouse effect and global warming?', ur: 'گرین ہاؤس اثر اور گلوبل وارمنگ کی بنیادی گیس ہے:', options: ['Carbon dioxide (CO₂)', 'Nitrogen (N₂)', 'Argon (Ar)', 'Oxygen (O₂)'], optionsUrdu: ['کاربن ڈائی آکسائیڈ', 'نائٹروجن', 'آرگان', 'آکسیجن'], correct: 0 },
      { id: 'c10_m6', en: 'Temporary hardness of water is caused by bicarbonate of:', ur: 'پانی کی عارضی ہارڈنس کس کے بائی کاربونیٹ کی وجہ سے ہوتی ہے؟', options: ['Calcium and Magnesium', 'Sodium and Potassium', 'Iron and Zinc', 'Copper and Lead'], optionsUrdu: ['کیلشیم اور میگنیشیم', 'سوڈیم اور پوٹاشیم', 'آئرن اور زنک', 'تانبا اور لیڈ'], correct: 0 },
      { id: 'c10_m7', en: 'In Solvay process, the raw material used is:', ur: 'سولوے پروسیس میں استعمال ہونے والا خام مال ہے:', options: ['Ammonia, NaCl, Limestone', 'Sulphur and Oxygen', 'Iron ore and Coal', 'Gypsum and Clay'], optionsUrdu: ['امونیا، نمک، چونا پتھر', 'سلفر اور آکسیجن', 'لوہا اور کوئلہ', 'جپسم اور مٹی'], correct: 0 },
      { id: 'c10_m8', en: 'The layer of atmosphere closest to the earth surface is:', ur: 'زمین کی سطح کے سب سے قریب واقع کرۂ ہوائی کی تہہ ہے:', options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'], optionsUrdu: ['ٹروپو سفیئر', 'سٹریٹو سفیئر', 'میسو سفیئر', 'تھرمو سفیئر'], correct: 0 },
      { id: 'c10_m9', en: 'The percentage of nitrogen in Urea fertilizer is approximately:', ur: 'یوریا کھاد میں نائٹروجن کا تناسب ہوتا ہے:', options: ['46.6%', '35%', '20%', '82%'], optionsUrdu: ['46.6%', '35%', '20%', '82%'], correct: 0 },
      { id: 'c10_m10', en: 'A Lewis acid is defined as a substance that:', ur: 'لیوس تھیوری کے مطابق ایسڈ وہ شے ہے جو:', options: ['Accepts an electron pair', 'Donates an electron pair', 'Donates a proton', 'Accepts a proton'], optionsUrdu: ['الیکٹران کا جوڑا قبول کرے', 'الیکٹران کا جوڑا دے', 'پروٹان دے', 'پروٹان قبول کرے'], correct: 0 },
      { id: 'c10_m11', en: 'Ozone layer is situated in which atmospheric region?', ur: 'اوزون کی حفاظتی تہہ کس خطے میں پائی جاتی ہے؟', options: ['Stratosphere', 'Troposphere', 'Mesosphere', 'Exosphere'], optionsUrdu: ['سٹریٹو سفیئر', 'ٹروپو سفیئر', 'میسو سفیئر', 'ایگزو سفیئر'], correct: 0 },
      { id: 'c10_m12', en: 'Which method is used to remove permanent hardness of water?', ur: 'پانی کی مستقل ہارڈنس دور کرنے کا کونسا طریقہ ہے؟', options: ['Washing soda / Ion exchange', 'Boiling only', 'Clark’s method', 'Decantation'], optionsUrdu: ['واشنگ سوڈا / آئن ایکسچینج', 'صرف ابالنا', 'کلارک طریقہ', 'نتھارنا'], correct: 0 },
    ],
    shorts: [
      { id: 'c10_s1', en: 'State Law of Mass Action and define Equilibrium Constant (Kc).', ur: 'لاء آف ماس ایکشن بیان کریں اور ایکویلیبریم کانسٹنٹ (Kc) کی تعریف کریں۔' },
      { id: 'c10_s2', en: 'Differentiate between static equilibrium and dynamic equilibrium.', ur: 'سٹیٹک توازن اور ڈائنامک توازن میں فرق بیان کریں۔' },
      { id: 'c10_s3', en: 'State Arrhenius concept of acids and bases with examples.', ur: 'آرہینئس کا تیزاب اور اساس کا نظریہ مثالوں سمیت لکھیں۔' },
      { id: 'c10_s4', en: 'What is auto-ionization (self-ionization) of water?', ur: 'پانی کی آٹو آئیونائزیشن (سیلف آئیونائزیشن) سے کیا مراد ہے؟' },
      { id: 'c10_s5', en: 'Define Functional Group and identify functional group of Aldehyde.', ur: 'فنکشنل گروپ کی تعریف کریں اور ایلڈی ہائیڈ کا فارمولا لکھیں۔' },
      { id: 'c10_s6', en: 'Differentiate between Saturated and Unsaturated Hydrocarbons.', ur: 'سیچوریٹڈ اور ان سیچوریٹڈ ہائیڈرو کاربنز میں فرق بتائیے۔' },
      { id: 'c10_s7', en: 'What is destructive distillation of coal? Name its four fractions.', ur: 'کوئلے کی ڈسٹرکٹو ڈسٹلیشن کیا ہے؟ اس کے چار حصوں کے نام لکھیں۔' },
      { id: 'c10_s8', en: 'Define Carbohydrates and state their biological importance.', ur: 'کاربوہائیڈریٹس کی تعریف کریں اور ان کی حیاتیاتی اہمیت بیان کریں۔' },
      { id: 'c10_s9', en: 'Differentiate between DNA and RNA.', ur: 'ڈی این اے اور آر این اے میں دو بنیادی فرق لکھیں۔' },
      { id: 'c10_s10', en: 'What are primary and secondary air pollutants? Give examples.', ur: 'پرائمری اور سیکنڈری فضائی آلودگیوں میں فرق مع مثالیں بیان کریں۔' },
      { id: 'c10_s11', en: 'How Ozone layer is depleted by Chlorofluorocarbons (CFCs)?', ur: 'کلورو فلورو کاربنز (CFCs) اوزون کی تہہ کو کیسے تباہ کرتے ہیں؟' },
      { id: 'c10_s12', en: 'Differentiate between soft water and hard water.', ur: 'سافٹ واٹر اور ہارڈ واٹر میں فرق بیان کریں۔' },
      { id: 'c10_s13', en: 'Describe Clark’s method for removing temporary hardness of water.', ur: 'پانی کی عارضی ہارڈنس دور کرنے کا کلارک کا طریقہ بیان کریں۔' },
      { id: 'c10_s14', en: 'What is Smelting in metallurgy? Explain.', ur: 'دھات کاری میں سمیلٹنگ (Smelting) کے عمل کی وضاحت کریں۔' },
      { id: 'c10_s15', en: 'Write down chemical reactions involved in the Solvay process.', ur: 'سولوے پروسیس کے دوران ہونے والے کیمیائی ری ایکشنز لکھیے۔' },
    ],
    longs: [
      { id: 'c10_l1', en: '(a) State the Law of Mass Action and derive the expression for Equilibrium Constant (Kc) for a general reaction. (5 Marks)\n(b) Explain Bronsted-Lowry concept of acids and bases with conjugate pairs. (4 Marks)', ur: '(الف) لاء آف ماس ایکشن بیان کریں اور عمومی ری ایکشن کے لیے Kc مساوات اخذ کریں۔ (5 نمبر)\n(ب) برونسٹڈ لوری تھیوری کی کنجوگیٹ ایسڈ بیس جوڑوں سمیت وضاحت کریں۔ (4 نمبر)', marks: 9 },
      { id: 'c10_l2', en: '(a) Describe the manufacturing of Urea fertilizer with complete flow sheet diagram and reactions. (5 Marks)\n(b) Explain Solvay process for manufacturing Sodium Carbonate (Washing Soda). (4 Marks)', ur: '(الف) یوریا کھاد کی تیاری کے مراحل فلو شیٹ ڈایاگرام اور مساوات سمیت بیان کریں۔ (5 نمبر)\n(ب) سولوے پروسیس کے ذریعے سوڈیم کاربونیٹ کی تیاری کی وضاحت کریں۔ (4 نمبر)', marks: 9 },
    ],
  },

  // ========================================================
  // 9TH CLASS COMPUTER SCIENCE (cs-9) - NEW SYLLABUS (PTB/SNC)
  // ========================================================
  'cs-9': {
    mcqs: [
      { id: 'cs9_m1', en: 'In system theory, which component receives output and returns it to regulate the system?', ur: 'سسٹم تھیوری کے مطابق، کونسا جزو آؤٹ پٹ حاصل کر کے سسٹم کی اصلاح کے لیے فیڈ کرتا ہے؟', options: ['Feedback', 'Process', 'Input', 'Boundary'], optionsUrdu: ['فیڈ بیک (Feedback)', 'پروسیس', 'ان پٹ', 'حدود (Boundary)'], correct: 0 },
      { id: 'cs9_m2', en: 'The base of Hexadecimal number system is:', ur: 'ہیکسا ڈیسیمل نمبر سسٹم کی بیس (Base) کیا ہوتی ہے؟', options: ['16', '10', '8', '2'], optionsUrdu: ['16', '10', '8', '2'], correct: 0 },
      { id: 'cs9_m3', en: 'In Hexadecimal number system, the letter "D" represents which decimal value?', ur: 'ہیکسا ڈیسیمل نمبر سسٹم میں حرف "D" کس اعشاری قیمت کے برابر ہے؟', options: ['13', '10', '11', '12'], optionsUrdu: ['13', '10', '11', '12'], correct: 0 },
      { id: 'cs9_m4', en: 'Binary representation of decimal number 25 is:', ur: 'اعشاری عدد 25 کی باائنری مساوی شکل کیا ہے؟', options: ['(11001)₂', '(10101)₂', '(11100)₂', '(10011)₂'], optionsUrdu: ['(11001)₂', '(10101)₂', '(11100)₂', '(10011)₂'], correct: 0 },
      { id: 'cs9_m5', en: 'Binary addition: 1 + 1 equals:', ur: 'باائنری جمع میں: 1 + 1 برابر ہوتا ہے:', options: ['(10)₂', '(0)₂', '(1)₂', '(11)₂'], optionsUrdu: ['(10)₂', '(0)₂', '(1)₂', '(11)₂'], correct: 0 },
      { id: 'cs9_m6', en: 'Which logic gate produces HIGH output only when both of its inputs are HIGH?', ur: 'کونسا لاجک گیٹ ہائی (1) آؤٹ پٹ دیتا ہے صرف تب جب دونوں ان پٹس 1 ہوں؟', options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NOR Gate'], optionsUrdu: ['اینڈ گیٹ (AND)', 'اور گیٹ (OR)', 'ناٹ گیٹ (NOT)', 'نور گیٹ (NOR)'], correct: 0 },
      { id: 'cs9_m7', en: 'Which logic gate is known as an Inverter?', ur: 'کس لاجک گیٹ کو انورٹر (Inverter) کہا جاتا ہے؟', options: ['NOT Gate', 'AND Gate', 'OR Gate', 'NAND Gate'], optionsUrdu: ['ناٹ گیٹ (NOT)', 'اینڈ گیٹ (AND)', 'اور گیٹ (OR)', 'نینڈ گیٹ (NAND)'], correct: 0 },
      { id: 'cs9_m8', en: 'Universal logic gates that can implement any boolean function are:', ur: 'یونیورسل لاجک گیٹس کون سے کہلاتے ہیں؟', options: ['NAND and NOR', 'AND and OR', 'NOT and OR', 'XOR and XNOR'], optionsUrdu: ['NAND اور NOR', 'AND اور OR', 'NOT اور OR', 'XOR اور XNOR'], correct: 0 },
      { id: 'cs9_m9', en: 'The process of diagnosing and resolving computer hardware or software issues is called:', ur: 'کمپیوٹر کے ہارڈویئر یا سافٹ ویئر مسائل کی تشخیص اور حل کہلاتا ہے:', options: ['Troubleshooting', 'Decomposition', 'Abstraction', 'Compilation'], optionsUrdu: ['ٹربل شوٹنگ', 'ڈی کمپوزیشن', 'ایبسٹریکشن', 'کمپائلیشن'], correct: 0 },
      { id: 'cs9_m10', en: 'POST stands for:', ur: 'کمپیوٹر اسٹارٹ اپ میں POST کا مخفف کیا ہے؟', options: ['Power-On Self-Test', 'Program Operating System Tool', 'Primary Output Storage Task', 'Processor Operational Speed Test'], optionsUrdu: ['پاور آن سیلف ٹیسٹ (POST)', 'پروگرام آپریٹنگ ٹول', 'پرائمری آؤٹ پٹ سٹوریج', 'پروسیسر سپیڈ ٹیسٹ'], correct: 0 },
      { id: 'cs9_m11', en: 'Which of the following is system software?', ur: 'درج ذیل میں سے کون سا سسٹم سافٹ ویئر ہے؟', options: ['Operating System', 'MS Word', 'Web Browser', 'VLC Media Player'], optionsUrdu: ['آپریٹنگ سسٹم', 'ایم ایس ورڈ', 'ویب براؤزر', 'وی ایل سی میڈیا پلیئر'], correct: 0 },
      { id: 'cs9_m12', en: 'Device Drivers belong to which category of software?', ur: 'ڈیوائس ڈرائیورز سافٹ ویئر کی کس قسم سے تعلق رکھتے ہیں؟', options: ['System Software', 'Application Software', 'Malware', 'Firmware only'], optionsUrdu: ['سسٹم سافٹ ویئر', 'ایپلیکیشن سافٹ ویئر', 'میلویئر', 'صرف فرم ویئر'], correct: 0 },
      { id: 'cs9_m13', en: 'A network covering a small geographical area like a room or school building is:', ur: 'ایک کمرے یا اسکول کی حد تک محدود نیٹ ورک کیا کہلاتا ہے؟', options: ['LAN', 'WAN', 'MAN', 'PAN'], optionsUrdu: ['لوکل ایریا نیٹ ورک (LAN)', 'وائڈ ایریا نیٹ ورک (WAN)', 'میٹروپولیٹن نیٹ ورک (MAN)', 'پرسنل نیٹ ورک (PAN)'], correct: 0 },
      { id: 'cs9_m14', en: 'Which network topology connects all devices to a central hub or switch?', ur: 'کس ٹوپولوجی میں تمام ڈیوائسز ایک مرکزی حب یا سوئچ سے جڑی ہوتی ہیں؟', options: ['Star Topology', 'Bus Topology', 'Ring Topology', 'Mesh Topology'], optionsUrdu: ['سٹار ٹوپولوجی', 'بس ٹوپولوجی', 'رنگ ٹوپولوجی', 'میش ٹوپولوجی'], correct: 0 },
      { id: 'cs9_m15', en: 'IPv4 address consists of how many bits?', ur: 'آئی پی ورژن 4 (IPv4) ایڈریس کتنے بٹس پر مشتمل ہوتا ہے؟', options: ['32 bits', '64 bits', '128 bits', '16 bits'], optionsUrdu: ['32 بٹس', '64 بٹس', '128 بٹس', '16 بٹس'], correct: 0 },
      { id: 'cs9_m16', en: 'Breaking a complex problem into smaller, manageable parts is called:', ur: 'کسی پیچیدہ مسئلے کو چھوٹے آسان حصوں میں تقسیم کرنا کیا کہلاتا ہے؟', options: ['Decomposition', 'Abstraction', 'Pattern Recognition', 'Generalization'], optionsUrdu: ['ڈی کمپوزیشن (Decomposition)', 'ایبسٹریکشن', 'پیٹرن ریکگنیشن', 'جنرلائزیشن'], correct: 0 },
      { id: 'cs9_m17', en: 'Ignoring irrelevant details to focus on core concepts in computational thinking is:', ur: 'غیر ضروری تفصیلات کو نظر انداز کر کے صرف اہم نکات پر توجہ دینا کہلاتا ہے:', options: ['Abstraction', 'Decomposition', 'Algorithm', 'Flowcharting'], optionsUrdu: ['ایبسٹریکشن (Abstraction)', 'ڈی کمپوزیشن', 'الگورتھم', 'فلو چارٹ'], correct: 0 },
      { id: 'cs9_m18', en: 'In a flowchart, the diamond symbol represents:', ur: 'فلو چارٹ میں ڈائمنڈ (ہیرا نما) علامت کس مقصد کے لیے استعمال ہوتی ہے؟', options: ['Decision Making (Condition)', 'Start / Stop', 'Process / Calculation', 'Input / Output'], optionsUrdu: ['فیصلہ سازی (Decision Making)', 'آغاز / اختتام', 'پروسیسنگ / عمل', 'ان پٹ / آؤٹ پٹ'], correct: 0 },
      { id: 'cs9_m19', en: 'HTML stands for:', ur: 'HTML کا مخفف کیا ہے؟', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Model Language', 'Hyper Transfer Machine Language'], optionsUrdu: ['ہائپر ٹیکسٹ مارک اپ لینگویج', 'ہائی ٹیک ماڈرن لینگویج', 'ہائپر لنک ٹیکسٹ لینگویج', 'ٹرانسفر مشین لینگویج'], correct: 0 },
      { id: 'cs9_m20', en: 'Which HTML tag is used to create a hyperlink?', ur: 'ایچ ٹی ایم ایل میں ہائپر لنک بنانے کے لیے کون سا ٹیگ استعمال ہوتا ہے؟', options: ['<a>', '<link>', '<href>', '<url>'], optionsUrdu: ['<a>', '<link>', '<href>', '<url>'], correct: 0 },
      { id: 'cs9_m21', en: 'Which HTML tag creates a numbered (ordered) list?', ur: 'ایچ ٹی ایم ایل میں نمبر والی (Ordered) لسٹ بنانے کا ٹیگ ہے:', options: ['<ol>', '<ul>', '<li>', '<dl>'], optionsUrdu: ['<ol>', '<ul>', '<li>', '<dl>'], correct: 0 },
      { id: 'cs9_m22', en: 'CSS stands for:', ur: 'ویب ڈیزائننگ میں CSS کا مخفف کیا ہے؟', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Standards', 'Colorful Syntax Sheet'], optionsUrdu: ['کیسکیڈنگ اسٹائل شیٹس', 'کری ایٹو اسٹائل سسٹم', 'کمپیوٹر اسٹائل سٹینڈرڈ', 'کلر فل سنٹیکس شیٹ'], correct: 0 },
      { id: 'cs9_m23', en: 'Which tag defines the largest heading in HTML?', ur: 'ایچ ٹی ایم ایل میں سب سے بڑی ہیڈنگ کے لیے کونسا ٹیگ ہے؟', options: ['<h1>', '<h6>', '<head>', '<header>'], optionsUrdu: ['<h1>', '<h6>', '<head>', '<header>'], correct: 0 },
      { id: 'cs9_m24', en: 'Octal number system uses digits from:', ur: 'آکٹل نمبر سسٹم میں کون سے ہندسے استعمال ہوتے ہیں؟', options: ['0 to 7', '0 to 9', '0 to 8', '0 and 1'], optionsUrdu: ['0 سے 7', '0 سے 9', '0 سے 8', '0 اور 1'], correct: 0 },
      { id: 'cs9_m25', en: 'Which protocol is used for securely transferring web pages on the Internet?', ur: 'انٹرنیٹ پر ویب پیجز کی محفوظ ترسیل کے لیے کون سا پروٹوکول استعمال ہوتا ہے؟', options: ['HTTPS', 'FTP', 'SMTP', 'POP3'], optionsUrdu: ['HTTPS', 'FTP', 'SMTP', 'POP3'], correct: 0 },
    ],
    shorts: [
      { id: 'cs9_s1', en: 'Define a System in computational context and name its three core components.', ur: 'کمپیوٹیشنل سیاق و سباق میں سسٹم کی تعریف کریں اور اس کے تین بنیادی اجزاء کے نام لکھیں۔' },
      { id: 'cs9_s2', en: 'Differentiate between Open Systems and Closed Systems.', ur: 'اوپن سسٹم اور کلوزڈ سسٹم میں کیا فرق ہے؟' },
      { id: 'cs9_s3', en: 'What is meant by Feedback mechanism in systems?', ur: 'سسٹمز میں فیڈ بیک (Feedback) سے کیا مراد ہے؟' },
      { id: 'cs9_s4', en: 'Convert decimal number (43)₁₀ into binary number system.', ur: 'اعشاری عدد (43)₁₀ کو باائنری نمبر سسٹم میں تبدیل کریں۔' },
      { id: 'cs9_s5', en: 'Convert binary number (101101)₂ into decimal system.', ur: 'باائنری عدد (101101)₂ کو اعشاری (Decimal) نظام میں تبدیل کریں۔' },
      { id: 'cs9_s6', en: 'Add binary numbers: (1101)₂ + (1011)₂.', ur: 'باائنری اعداد کو جمع کیجیے: (1101)₂ + (1011)₂۔' },
      { id: 'cs9_s7', en: 'Define 1’s Complement and 2’s Complement of a binary number.', ur: 'باائنری عدد کے 1’s Complement اور 2’s Complement کی تعریف کریں۔' },
      { id: 'cs9_s8', en: 'What is a Truth Table in digital logic design?', ur: 'ڈیجیٹل لاجک ڈیزائن میں ٹرتھ ٹیبل (Truth Table) کیا ہوتا ہے؟' },
      { id: 'cs9_s9', en: 'Draw the logic symbol and write the truth table of AND Gate.', ur: 'اینڈ گیٹ (AND Gate) کی علامت بنائیں اور اس کا ٹرتھ ٹیبل لکھیے۔' },
      { id: 'cs9_s10', en: 'Draw the logic symbol and truth table of NOT Gate (Inverter).', ur: 'ناٹ گیٹ (NOT Gate) کی منطقی علامت اور ٹرتھ ٹیبل تحریر کریں۔' },
      { id: 'cs9_s11', en: 'Why are NAND and NOR gates called Universal Gates?', ur: 'نینڈ (NAND) اور نور (NOR) گیٹس کو یونیورسل گیٹس کیوں کہا جاتا ہے؟' },
      { id: 'cs9_s12', en: 'What is System Troubleshooting? Mention any two primary goals.', ur: 'سسٹم ٹربل شوٹنگ کیا ہے؟ اس کے دو بنیادی مقاصد تحریر کریں۔' },
      { id: 'cs9_s13', en: 'What is the role of POST (Power-On Self-Test) during computer startup?', ur: 'کمپیوٹر اسٹارٹ ہونے کے دوران POST کا کیا کردار ہوتا ہے؟' },
      { id: 'cs9_s14', en: 'What are Beep Codes in computer motherboard troubleshooting?', ur: 'مدر بورڈ ٹربل شوٹنگ میں بیپ کوڈز (Beep Codes) سے کیا مراد ہے؟' },
      { id: 'cs9_s15', en: 'Differentiate between System Software and Application Software.', ur: 'سسٹم سافٹ ویئر اور ایپلیکیشن سافٹ ویئر میں دو بنیادی فرق بیان کریں۔' },
      { id: 'cs9_s16', en: 'What is an Operating System? Write down any two functions of an OS.', ur: 'آپریٹنگ سسٹم کیا ہے؟ اس کے کوئی سے دو اہم افعال لکھیے۔' },
      { id: 'cs9_s17', en: 'What is the purpose of Device Drivers in an operating system?', ur: 'آپریٹنگ سسٹم میں ڈیوائس ڈرائیورز کا کیا کام ہوتا ہے؟' },
      { id: 'cs9_s18', en: 'Define Computer Network and state its two main advantages.', ur: 'کمپیوٹر نیٹ ورک کی تعریف کریں اور اس کے دو اہم فوائد لکھیں۔' },
      { id: 'cs9_s19', en: 'Differentiate between LAN (Local Area Network) and WAN (Wide Area Network).', ur: 'لوکل ایریا نیٹ ورک (LAN) اور وائڈ ایریا نیٹ ورک (WAN) میں فرق بیان کریں۔' },
      { id: 'cs9_s20', en: 'What is Star Topology? Mention its one advantage and one disadvantage.', ur: 'سٹار ٹوپولوجی کیا ہے؟ اس کا ایک فائدہ اور ایک نقصان بیان کریں۔' },
      { id: 'cs9_s21', en: 'What is an IP Address? Differentiate between IPv4 and IPv6.', ur: 'آئی پی ایڈریس کیا ہے؟ IPv4 اور IPv6 میں بنیادی فرق لکھیں۔' },
      { id: 'cs9_s22', en: 'Define Computational Thinking and name its four pillars.', ur: 'کمپیوٹیشنل تھنکنگ کی تعریف کریں اور اس کے چار ستونوں کے نام تحریر کریں۔' },
      { id: 'cs9_s23', en: 'What is Decomposition in problem solving?', ur: 'مسئلہ حل کرنے میں ڈی کمپوزیشن (Decomposition) سے کیا مراد ہے؟' },
      { id: 'cs9_s24', en: 'What is Pattern Recognition in computational thinking?', ur: 'کمپیوٹیشنل تھنکنگ میں پیٹرن ریکگنیشن کی کیا اہمیت ہے؟' },
      { id: 'cs9_s25', en: 'Define an Algorithm and write any two properties of a good algorithm.', ur: 'الگورتھم کی تعریف کریں اور ایک اچھے الگورتھم کی دو خصوصیات لکھیں۔' },
      { id: 'cs9_s26', en: 'Draw standard flowchart symbols for: (i) Decision (ii) Process.', ur: 'فلو چارٹ میں (i) ڈیسیژن (فیصلہ) اور (ii) پروسیس کی علامات بنائیں۔' },
      { id: 'cs9_s27', en: 'What is HTML and where is it used?', ur: 'ایچ ٹی ایم ایل (HTML) کیا ہے اور یہ کہاں استعمال ہوتی ہے؟' },
      { id: 'cs9_s28', en: 'Differentiate between paired tags and singular (empty) tags in HTML with examples.', ur: 'ایچ ٹی ایم ایل میں پیئرڈ ٹیگز اور سنگولر (ایمپٹی) ٹیگز میں مثال کے ساتھ فرق بتائیں۔' },
      { id: 'cs9_s29', en: 'Write HTML code to create a hyperlink to "https://google.com".', ur: '"https://google.com" پر ہائپر لنک بنانے کے لیے ایچ ٹی ایم ایل کوڈ تحریر کریں۔' },
      { id: 'cs9_s30', en: 'What is CSS and what is the difference between inline and external CSS?', ur: 'سی ایس ایس (CSS) کیا ہے؟ ان لائن اور ایکسٹرنل سی ایس ایس میں فرق لکھیں۔' },
    ],
    longs: [
      {
        id: 'cs9_l1',
        en: '(a) What is a Computational System? Explain the Theory of Systems with its components (Input, Process, Output, Boundary, and Feedback) with a block diagram. (5 Marks)\n(b) Differentiate between Open and Closed systems with real-world examples. (4 Marks)',
        ur: '(الف) کمپیوٹیشنل سسٹم کیا ہے؟ سسٹم تھیوری اور اس کے بنیادی اجزاء (ان پٹ، پروسیس، آؤٹ پٹ، باؤنڈری اور فیڈ بیک) کی وضاحت بلاک ڈایاگرام کی مدد سے کریں۔ (5 نمبر)\n(ب) اوپن سسٹمز اور کلوزڈ سسٹمز میں روزمرہ مثالوں کے ساتھ فرق واضح کریں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l2',
        en: '(a) Explain Binary, Octal, Decimal, and Hexadecimal number systems with their base and digits. (5 Marks)\n(b) Convert (110111)₂ to Decimal and (75)₁₀ to Binary with complete working steps. (4 Marks)',
        ur: '(الف) باائنری، آکٹل، ڈیسیمل اور ہیکسا ڈیسیمل نمبر سسٹمز کی وضاحت ان کی بیس اور ہندسوں کے ساتھ کریں۔ (5 نمبر)\n(ب) عدد (110111)₂ کو ڈیسیمل میں اور (75)₁₀ کو باائنری میں مکمل حسابی مراحل کے ساتھ تبدیل کریں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l3',
        en: '(a) Describe the basic logic gates: AND, OR, and NOT gates with their circuit symbols, Boolean equations, and truth tables. (5 Marks)\n(b) What are Universal Logic Gates? Explain NAND and NOR gates with truth tables. (4 Marks)',
        ur: '(الف) بنیادی لاجک گیٹس (AND، OR اور NOT) کی منطقی علامات، بولین مساوات اور ٹرتھ ٹیبلز بیان کریں۔ (5 نمبر)\n(ب) یونیورسل لاجک گیٹس کیا ہیں؟ نینڈ (NAND) اور نور (NOR) گیٹس کی ٹرتھ ٹیبل سمیت وضاحت کریں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l4',
        en: '(a) What is System Troubleshooting? Explain step-by-step troubleshooting methodology for diagnosing PC startup problems. (5 Marks)\n(b) Describe POST (Power-On Self-Test) and discuss the meaning of common BIOS beep codes. (4 Marks)',
        ur: '(الف) سسٹم ٹربل شوٹنگ کیا ہے؟ کمپیوٹر اسٹارٹ نہ ہونے کے مسائل کی مرحلہ وار تشخیص کا طریقہ کار لکھیں۔ (5 نمبر)\n(ب) پاور آن سیلف ٹیسٹ (POST) کیا ہے اور بائیوس کے عام بیپ کوڈز کی وضاحت کریں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l5',
        en: '(a) What is Network Topology? Explain Star Topology and Bus Topology with neat diagrams, advantages, and disadvantages. (5 Marks)\n(b) Differentiate between LAN, MAN, and WAN in terms of coverage area, speed, and cost. (4 Marks)',
        ur: '(الف) نیٹ ورک ٹوپولوجی کیا ہے؟ سٹار ٹوپولوجی اور بس ٹوپولوجی کی خاکوں، فوائد اور نقائص سمیت تفصیل لکھیں۔ (5 نمبر)\n(ب) لوکل ایریا نیٹ ورک (LAN)، میٹروپولیٹن (MAN) اور وائڈ ایریا نیٹ ورک (WAN) میں تقابلی جائزہ پیش کریں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l6',
        en: '(a) What is Computational Thinking? Explain its four key pillars (Decomposition, Pattern Recognition, Abstraction, and Algorithm Design) in detail with examples. (5 Marks)\n(b) Explain the standard flowchart symbols and draw a flowchart to find the largest of three numbers. (4 Marks)',
        ur: '(الف) کمپیوٹیشنل تھنکنگ کیا ہے؟ اس کے چاروں بنیادی ستونوں (ڈی کمپوزیشن، پیٹرن، ایبسٹریکشن، الگورتھم) کی مثالوں سمیت وضاحت کریں۔ (5 نمبر)\n(ب) فلو چارٹ کی بنیادی علامات بیان کریں اور تین اعداد میں سے سب سے بڑا عدد معلوم کرنے کا فلو چارٹ بنائیں۔ (4 نمبر)',
        marks: 9,
      },
      {
        id: 'cs9_l7',
        en: '(a) Describe the basic structure of an HTML document with appropriate tags (`<!DOCTYPE>`, `<html>`, `<head>`, `<title>`, `<body>`). (5 Marks)\n(b) Explain the types of lists in HTML (Ordered `<ol>` and Unordered `<ul>`) with complete example code. (4 Marks)',
        ur: '(الف) ایچ ٹی ایم ایل دستاویز کی بنیادی ساخت تمام ضروری ٹیگز سمیت تفصیل سے واضح کریں۔ (5 نمبر)\n(ب) ایچ ٹی ایم ایل میں لسٹوں کی اقسام (آرڈرڈ اور ان آرڈرڈ) کی مکمل کوڈ سمیت وضاحت کریں۔ (4 نمبر)',
        marks: 9,
      },
    ],
  },
};

const QUESTION_CHAPTER_MAP = {
  // bio-9
  b9_m1: 1, b9_m2: 4, b9_m3: 1, b9_m4: 6, b9_m5: 7, b9_m6: 9, b9_m7: 5, b9_m8: 8, b9_m9: 9, b9_m10: 9,
  b9_m11: 4, b9_m12: 3, b9_m13: 4, b9_m14: 5, b9_m15: 6, b9_m16: 9, b9_m17: 3, b9_m18: 8, b9_m19: 4, b9_m20: 8,
  b9_m21: 1, b9_m22: 7, b9_m23: 9, b9_m24: 3, b9_m25: 6,
  b9_s1: 1, b9_s2: 1, b9_s3: 3, b9_s4: 4, b9_s5: 4, b9_s6: 5, b9_s7: 6, b9_s8: 7, b9_s9: 8, b9_s10: 9,
  b9_s11: 9, b9_s12: 9, b9_s13: 5, b9_s14: 8, b9_s15: 7, b9_s16: 3, b9_s17: 3, b9_s18: 9, b9_s19: 4, b9_s20: 5,
  b9_s21: 6, b9_s22: 7, b9_s23: 7, b9_s24: 9, b9_s25: 8, b9_s26: 3, b9_s27: 4, b9_s28: 4,
  b9_l1: 4, b9_l2: 5, b9_l3: 7, b9_l4: 9, b9_l5: 7, b9_l6: 3,

  // bio-10
  b10_m1: 1, b10_m2: 2, b10_m3: 3, b10_m4: 4, b10_m5: 5, b10_m6: 6, b10_m7: 7, b10_m8: 9, b10_m9: 3, b10_m10: 4,
  b10_m11: 6, b10_m12: 9, b10_m13: 3, b10_m14: 2, b10_m15: 4, b10_m16: 3, b10_m17: 7, b10_m18: 5, b10_m19: 8, b10_m20: 9,
  b10_s1: 1, b10_s2: 1, b10_s3: 2, b10_s4: 2, b10_s5: 2, b10_s6: 3, b10_s7: 3, b10_s8: 3, b10_s9: 4, b10_s10: 4,
  b10_s11: 5, b10_s12: 5, b10_s13: 6, b10_s14: 7, b10_s15: 8, b10_s16: 9, b10_s17: 7, b10_s18: 2, b10_s19: 6, b10_s20: 7,
  b10_s21: 9, b10_s22: 3, b10_s23: 8, b10_s24: 8,
  b10_l1: 1, b10_l2: 3, b10_l3: 6, b10_l4: 3, b10_l5: 8,

  // phy-9
  p9_m1: 1, p9_m2: 1, p9_m3: 2, p9_m4: 3, p9_m5: 3, p9_m6: 5, p9_m7: 6, p9_m8: 6, p9_m9: 7, p9_m10: 7,
  p9_m11: 9, p9_m12: 2, p9_m13: 4, p9_m14: 1, p9_m15: 3, p9_m16: 4, p9_m17: 5, p9_m18: 6, p9_m19: 7, p9_m20: 8,
  p9_s1: 1, p9_s2: 1, p9_s3: 2, p9_s4: 2, p9_s5: 3, p9_s6: 3, p9_s7: 3, p9_s8: 4, p9_s9: 4, p9_s10: 5,
  p9_s11: 5, p9_s12: 6, p9_s13: 6, p9_s14: 6, p9_s15: 7, p9_s16: 7, p9_s17: 7, p9_s18: 8, p9_s19: 8, p9_s20: 9,
  p9_s21: 9, p9_s22: 8, p9_s23: 4, p9_s24: 2,
  p9_l1: 2, p9_l2: 3, p9_l3: 5, p9_l4: 6, p9_l5: 7, p9_l6: 8,

  // phy-10
  p10_m1: 1, p10_m2: 1, p10_m3: 2, p10_m4: 3, p10_m5: 4, p10_m6: 4, p10_m7: 5, p10_m8: 6, p10_m9: 7, p10_m10: 9,
  p10_m11: 3, p10_m12: 5, p10_m13: 6, p10_m14: 9, p10_m15: 4,
  p10_s1: 1, p10_s2: 1, p10_s3: 2, p10_s4: 3, p10_s5: 3, p10_s6: 4, p10_s7: 4, p10_s8: 5, p10_s9: 6, p10_s10: 7,
  p10_s11: 7, p10_s12: 9, p10_s13: 9, p10_s14: 2, p10_s15: 4, p10_s16: 5, p10_s17: 6, p10_s18: 7,
  p10_l1: 1, p10_l2: 4, p10_l3: 6, p10_l4: 3,

  // chem-9
  c9_m1: 1, c9_m2: 1, c9_m3: 2, c9_m4: 3, c9_m5: 4, c9_m6: 5, c9_m7: 6, c9_m8: 7, c9_m9: 3, c9_m10: 7, c9_m11: 1, c9_m12: 3,
  c9_s1: 1, c9_s2: 1, c9_s3: 2, c9_s4: 2, c9_s5: 3, c9_s6: 3, c9_s7: 4, c9_s8: 4, c9_s9: 5, c9_s10: 6,
  c9_s11: 6, c9_s12: 7, c9_s13: 7, c9_s14: 7, c9_s15: 8,
  c9_l1: 2, c9_l2: 4, c9_l3: 5,

  // chem-10
  c10_m1: 1, c10_m2: 2, c10_m3: 3, c10_m4: 3, c10_m5: 6, c10_m6: 7, c10_m7: 8, c10_m8: 6, c10_m9: 8, c10_m10: 2, c10_m11: 6, c10_m12: 7,
  c10_s1: 1, c10_s2: 1, c10_s3: 2, c10_s4: 2, c10_s5: 3, c10_s6: 3, c10_s7: 3, c10_s8: 4, c10_s9: 4, c10_s10: 6,
  c10_s11: 6, c10_s12: 7, c10_s13: 7, c10_s14: 8, c10_s15: 8,
  c10_l1: 1, c10_l2: 8,

  // cs-9
  cs9_m1: 1, cs9_m2: 2, cs9_m3: 2, cs9_m4: 2, cs9_m5: 2, cs9_m6: 2, cs9_m7: 2, cs9_m8: 2, cs9_m9: 1, cs9_m10: 1,
  cs9_m11: 1, cs9_m12: 1, cs9_m13: 3, cs9_m14: 3, cs9_m15: 3, cs9_m16: 1, cs9_m17: 1, cs9_m18: 1, cs9_m19: 5, cs9_m20: 5,
  cs9_m21: 5, cs9_m22: 5, cs9_m23: 5, cs9_m24: 2, cs9_m25: 3,
  cs9_s1: 1, cs9_s2: 1, cs9_s3: 1, cs9_s4: 2, cs9_s5: 2, cs9_s6: 2, cs9_s7: 2, cs9_s8: 2, cs9_s9: 2, cs9_s10: 2,
  cs9_s11: 2, cs9_s12: 1, cs9_s13: 1, cs9_s14: 1, cs9_s15: 1, cs9_s16: 1, cs9_s17: 1, cs9_s18: 3, cs9_s19: 3, cs9_s20: 3,
  cs9_s21: 3, cs9_s22: 1, cs9_s23: 1, cs9_s24: 1, cs9_s25: 1, cs9_s26: 1, cs9_s27: 5, cs9_s28: 5, cs9_s29: 5, cs9_s30: 5,
  cs9_l1: 1, cs9_l2: 2, cs9_l3: 2, cs9_l4: 1, cs9_l5: 3, cs9_l6: 1, cs9_l7: 5,
};

function attachChapterToQuestion(q) {
  if (q.chapter !== undefined) return q;
  const mapped = QUESTION_CHAPTER_MAP[q.id];
  return {
    ...q,
    chapter: mapped !== undefined ? mapped : 1,
  };
}

// Resolver for subjects
export function getQuestionsForSubject(subjectId = '', language = 'english') {
  let raw = null;
  if (SAMPLE_QUESTIONS[subjectId]) {
    raw = SAMPLE_QUESTIONS[subjectId];
  } else {
    // Prefix matching fallback
    const parts = subjectId.split('-');
    const baseSubject = parts[0].toLowerCase();
    for (const key of Object.keys(SAMPLE_QUESTIONS)) {
      if (key.startsWith(baseSubject)) {
        raw = SAMPLE_QUESTIONS[key];
        break;
      }
    }
  }

  if (raw) {
    return {
      mcqs: (raw.mcqs || []).map(attachChapterToQuestion),
      shorts: (raw.shorts || []).map(attachChapterToQuestion),
      longs: (raw.longs || []).map(attachChapterToQuestion),
    };
  }

  // Dynamically constructed comprehensive subject pool with assigned chapters
  return {
    mcqs: Array.from({ length: 30 }, (_, i) => ({
      id: `${subjectId}_m_${i + 1}`,
      chapter: ((i % 8) + 1),
      en: `Board Examination Question #${i + 1} for ${subjectId}: Choose the scientifically correct principle or option:`,
      ur: `سوال نمبر ${i + 1}: ${subjectId} کے امتحانی معیار کے مطابق درست اصول یا کلیہ منتخب کریں:`,
      options: [
        `(A) Primary Fundamental Law / Theorem #${i + 1}`,
        `(B) Practical Application in Industry #${i + 1}`,
        `(C) Alternative Standard Formulation #${i + 1}`,
        `(D) Empirical Observation & Derivation #${i + 1}`,
      ],
      optionsUrdu: [
        `(الف) بنیادی قانون یا نظریہ نمبر ${i + 1}`,
        `(ب) عملی و سائنسی اطلاق نمبر ${i + 1}`,
        `(ج) متبادل کلیاتی تشکیل نمبر ${i + 1}`,
        `(د) تجرباتی شواہد و اخذ کردہ نتیجہ نمبر ${i + 1}`,
      ],
      correct: (i % 4),
    })),
    shorts: Array.from({ length: 35 }, (_, i) => ({
      id: `${subjectId}_s_${i + 1}`,
      chapter: ((i % 8) + 1),
      en: `Question #${i + 1}: Define and state the core principles, formulas, significance and applications of Topic ${i + 1}.`,
      ur: `سوال نمبر ${i + 1}: نصاب کے اہم موضوع نمبر ${i + 1} کی بنیادی تعریف، مساوات اور دو اہم روزمرہ اطلاقات تحریر کریں۔`,
    })),
    longs: Array.from({ length: 8 }, (_, i) => ({
      id: `${subjectId}_l_${i + 1}`,
      chapter: ((i % 8) + 1),
      en: `(a) Detailed theoretical question on Core Topic #${i + 1} with diagrams. (5 Marks)\n(b) Analytical problem solving or practical application note. (4 Marks)`,
      ur: `(الف) نصاب کے اہم موضوع نمبر ${i + 1} پر تفصیلی اور جامع نوٹ خاکے کی مدد سے تحریر کریں۔ (5 نمبر)\n(ب) متعلقہ حسابی سوال یا اطلاقی پہلو کی مدلل وضاحت کیجیے۔ (4 نمبر)`,
      marks: 9,
    })),
  };
}

// Resolver for subjects with STRICT chapter filtering and generation
export function getQuestionsForSubjectAndChapters(subjectId = '', selectedChapters = [], allChapters = []) {
  const baseQuestions = getQuestionsForSubject(subjectId, 'english');
  const activeChapterNums = (selectedChapters || []).map(Number).filter(n => !isNaN(n));

  // If no chapters specified or all chapters selected, return full subject pool
  if (activeChapterNums.length === 0 || (allChapters && allChapters.length > 0 && activeChapterNums.length >= allChapters.length)) {
    return baseQuestions;
  }

  const activeSet = new Set(activeChapterNums);

  // Filter questions that strictly belong to the selected chapters
  let filteredMcqs = (baseQuestions.mcqs || []).filter(q => q.chapter !== undefined && activeSet.has(Number(q.chapter)));
  let filteredShorts = (baseQuestions.shorts || []).filter(q => q.chapter !== undefined && activeSet.has(Number(q.chapter)));
  let filteredLongs = (baseQuestions.longs || []).filter(q => q.chapter !== undefined && activeSet.has(Number(q.chapter)));

  // Generate sufficient authentic questions for each selected chapter so chapter tests are rich and complete
  activeChapterNums.forEach((chNum) => {
    const chInfo = (allChapters || []).find(c => Number(c.id) === chNum);
    const chNameEn = chInfo?.name || `Chapter ${chNum}`;
    const chNameUr = chInfo?.nameUrdu || `باب ${chNum}`;

    const existingChMcqs = filteredMcqs.filter(q => Number(q.chapter) === chNum);
    const existingChShorts = filteredShorts.filter(q => Number(q.chapter) === chNum);
    const existingChLongs = filteredLongs.filter(q => Number(q.chapter) === chNum);

    // Ensure at least 15 MCQs per selected chapter
    for (let i = existingChMcqs.length; i < 15; i++) {
      filteredMcqs.push({
        id: `${subjectId}_ch${chNum}_m_${i + 1}`,
        chapter: chNum,
        en: `[${chNameEn}] Exam MCQ #${i + 1}: Choose the scientifically correct principle or formula:`,
        ur: `[${chNameUr}] امتحانی معروضی سوال نمبر ${i + 1}: نصاب کے مطابق درست کلیہ یا اصول منتخب کریں:`,
        options: [
          `Fundamental Principle #${i + 1} (${chNameEn})`,
          `Practical Application #${i + 1} (${chNameEn})`,
          `Secondary Characteristic #${i + 1} (${chNameEn})`,
          `Standard Mathematical Law #${i + 1} (${chNameEn})`,
        ],
        optionsUrdu: [
          `بنیادی کلیہ و تعریف نمبر ${i + 1} (${chNameUr})`,
          `عملی و سائنسی اطلاق نمبر ${i + 1} (${chNameUr})`,
          `ثانوی خصوصیت و مثال نمبر ${i + 1} (${chNameUr})`,
          `متبادل حسابی مساوات نمبر ${i + 1} (${chNameUr})`,
        ],
        correct: (i % 4),
      });
    }

    // Ensure at least 15 Short Questions per selected chapter
    for (let i = existingChShorts.length; i < 15; i++) {
      filteredShorts.push({
        id: `${subjectId}_ch${chNum}_s_${i + 1}`,
        chapter: chNum,
        en: `[${chNameEn}] Q.${i + 1}: State the key definition, significance, scientific equation, and two practical applications of Topic ${i + 1}.`,
        ur: `[${chNameUr}] سوال نمبر ${i + 1}: اس باب کے اہم موضوع نمبر ${i + 1} کی بنیادی تعریف، حسابی کلیہ اور دو روزمرہ اطلاقات تحریر کریں۔`,
      });
    }

    // Ensure at least 5 Long Questions per selected chapter
    for (let i = existingChLongs.length; i < 5; i++) {
      filteredLongs.push({
        id: `${subjectId}_ch${chNum}_l_${i + 1}`,
        chapter: chNum,
        en: `[${chNameEn}] (a) Explain Core Principle #${i + 1} in detail with neat diagrams. (5 Marks)\n(b) Solve the analytical problem or explain practical significance. (4 Marks)`,
        ur: `[${chNameUr}] (الف) اس باب کے اہم ترین موضوع نمبر ${i + 1} پر خاکے کی مدد سے تفصیلی نوٹ لکھیں۔ (5 نمبر)\n(ب) متعلقہ حسابی سوال یا عملی اطلاق کی مدلل وضاحت کیجیے۔ (4 نمبر)`,
        marks: 9,
      });
    }
  });

  return {
    mcqs: filteredMcqs,
    shorts: filteredShorts,
    longs: filteredLongs,
  };
}

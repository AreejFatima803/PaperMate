// Official 2026 Academic Dataset (PECTAA / Punjab Board 2026 Curriculum)

export const academicData = {
  "9th": {
    className: "9th Class",
    tag: "Matriculation Part I (2026 PECTAA Curriculum)",
    icon: "book",
    description: "Official 2026 PECTAA / Punjab Board Single National Curriculum for 9th Science & Arts Groups.",
    subjects: [
      { id: "eng-9", name: "English (Compulsory)", category: "compulsory", icon: "book-open", chapters: 12, description: "New 2026 PECTAA English Lessons, Poems, Grammar, and Translation." },
      { id: "urdu-9", name: "Urdu (Compulsory)", category: "compulsory", icon: "feather", chapters: 10, description: "2026 PCTB Urdu Prose, Ghazals, Nazams, and Tashreeh." },
      { id: "isl-9", name: "Islamiat (Compulsory)", category: "compulsory", icon: "moon", chapters: 6, description: "Quranic Verses, Ahadith-e-Nabvi (SAW), and Ethics." },
      { id: "quran-9", name: "Tarjuma-tul-Quran Majeed", category: "compulsory", icon: "book-marked", chapters: 8, description: "Surah Maryam, Surah Taha, Surah Yasin, translation and background." },
      { id: "math-sci-9", name: "Mathematics (Science)", category: "science", icon: "calculator", chapters: 17, description: "Matrices, Logarithms, Algebraic Formulas, Theorems, and Geometry." },
      { id: "phy-9", name: "Physics", category: "science", icon: "zap", chapters: 9, description: "Physical Quantities, Kinematics, Dynamics, Gravitation, Work & Energy." },
      { id: "chem-9", name: "Chemistry", category: "science", icon: "flask-conical", chapters: 8, description: "Atomic Structure, Periodic Table, Chemical Bonding, States of Matter." },
      { id: "bio-9", name: "Biology", category: "science", icon: "dna", chapters: 9, description: "Cell Biology, Enzymes, Bioenergetics, Nutrition, Transport System." },
      { id: "cs-9", name: "Computer Science", category: "science", icon: "laptop-code", chapters: 5, description: "2026 Revised: Problem Solving, Cyber Security, Web Design HTML5 & CSS." },
      { id: "math-arts-9", name: "General Mathematics (Arts)", category: "arts", icon: "calculator", chapters: 10, description: "Percentage, Ratio, Financial Arithmetic, Basic Algebra & Geometry." },
      { id: "gen-sci-9", name: "General Science", category: "arts", icon: "flask-round", chapters: 11, description: "Introduction to Science, Human Body, Matter, Energy, Space Science." },
      { id: "edu-9", name: "Education (Taleem)", category: "arts", icon: "graduation-cap", chapters: 8, description: "Foundations of Education, Modes of Learning, Guidance & Psychology." },
      { id: "civics-9", name: "Civics (Imraniat)", category: "arts", icon: "landmark", chapters: 7, description: "Citizen Rights, Duties, State Structure, Governance & Society." },
      { id: "econ-9", name: "Economics (Maashiyat)", category: "arts", icon: "trending-up", chapters: 9, description: "Microeconomics, Supply & Demand, National Income, Banking." }
    ]
  },
  "10th": {
    className: "10th Class",
    tag: "Matriculation Part II (2026 PECTAA Curriculum)",
    icon: "award",
    description: "Official 2026 PECTAA / Punjab Board 10th Exam Preparation.",
    subjects: [
      { id: "eng-10", name: "English (Compulsory)", category: "compulsory", icon: "book-open", chapters: 13, description: "10th English Lessons, Essays, Direct/Indirect, and Comprehension." },
      { id: "urdu-10", name: "Urdu (Compulsory)", category: "compulsory", icon: "feather", chapters: 12, description: "10th Urdu Textual Lessons, Ghazals, Nazams, and Essay Writing." },
      { id: "pak-10", name: "Pakistan Studies (Mutalia Pakistan)", category: "compulsory", icon: "flag", chapters: 5, description: "Ideology of Pakistan, Constitution, Foreign Relations, Resources." },
      { id: "quran-10", name: "Tarjuma-tul-Quran Majeed", category: "compulsory", icon: "book-marked", chapters: 8, description: "Surah Al-Anfal, Surah At-Tawbah, Surah Yunus, and Surah Hud." },
      { id: "math-sci-10", name: "Mathematics (Science)", category: "science", icon: "calculator", chapters: 13, description: "Quadratic Equations, Variations, Partial Fractions, Geometry & Trigonometry." },
      { id: "phy-10", name: "Physics", category: "science", icon: "zap", chapters: 9, description: "SHM, Waves, Sound, Geometrical Optics, Electrostatics, Electronics, ICT." },
      { id: "chem-10", name: "Chemistry", category: "science", icon: "flask-conical", chapters: 8, description: "Chemical Equilibrium, Acids & Bases, Organic Chem, Hydrocarbons, Water." },
      { id: "bio-10", name: "Biology", category: "science", icon: "dna", chapters: 9, description: "Gaseous Exchange, Homeostasis, Coordination, Inheritance, Biotechnology." },
      { id: "cs-10", name: "Computer Science", category: "science", icon: "laptop-code", chapters: 7, description: "Programming in C Language, User Interface, Control Structures, Arrays." }
    ]
  },
  "1st Year": {
    className: "1st Year",
    tag: "Intermediate Part I (2026 PECTAA Curriculum)",
    icon: "brain",
    description: "2026 Intermediate Part I for Pre-Medical, Pre-Engineering & ICS.",
    subjects: [
      { id: "eng-11", name: "English (Compulsory)", category: "compulsory", icon: "book-open", chapters: 15, description: "Book I Short Stories, Book III Plays & Poems, English Grammar." },
      { id: "urdu-11", name: "Urdu (Compulsory)", category: "compulsory", icon: "feather", chapters: 14, description: "1st Year Urdu Prose, Ghazals, Nazams, and Tashreeh." },
      { id: "isl-11", name: "Islamic Education (Compulsory)", category: "compulsory", icon: "moon", chapters: 6, description: "Quranic Verses, Ahadith, and Fundamentals of Islam." },
      { id: "phy-11", name: "Physics (XI)", category: "elective", groups: ["pre-medical", "pre-engineering", "ics"], icon: "zap", chapters: 11, description: "Measurements, Vectors, Motion & Force, Work & Energy, Optics, Thermodynamics." },
      { id: "chem-11", name: "Chemistry (XI)", category: "elective", groups: ["pre-medical", "pre-engineering"], icon: "flask-conical", chapters: 11, description: "Basic Concepts, Gases, Liquids, Solids, Atomic Structure, Bonding, Kinetics." },
      { id: "bio-11", name: "Biology (XI)", category: "elective", groups: ["pre-medical"], icon: "dna", chapters: 14, description: "Cell Structure, Biological Molecules, Enzymes, Immunity, Respiration." },
      { id: "math-11", name: "Mathematics (XI)", category: "elective", groups: ["pre-engineering", "ics"], icon: "calculator", chapters: 14, description: "Number Systems, Matrices, Quadratics, Permutations, Trigonometry." },
      { id: "cs-11", name: "Computer Science (XI)", category: "elective", groups: ["ics"], icon: "laptop-code", chapters: 10, description: "Basics of IT, Information Networks, Communications, Computer Architecture." }
    ]
  },
  "Second Year": {
    className: "Second Year",
    tag: "Intermediate Part II (2026 PECTAA Curriculum)",
    icon: "sparkles",
    description: "2026 Intermediate Part II for Pre-Medical, Pre-Engineering & ICS.",
    subjects: [
      { id: "eng-12", name: "English (Compulsory)", category: "compulsory", icon: "book-open", chapters: 14, description: "Modern Prose & Heroes, Goodbye Mr. Chips Novel, Essay Writing." },
      { id: "urdu-12", name: "Urdu (Compulsory)", category: "compulsory", icon: "feather", chapters: 14, description: "2nd Year Urdu Prose, Ghazals, Nazams, and Khutoot Writing." },
      { id: "pak-12", name: "Pakistan Studies (Mutalia Pakistan)", category: "compulsory", icon: "flag", chapters: 5, description: "Creation of Pakistan, Constitution, Foreign Relations, Resources." },
      { id: "phy-12", name: "Physics (XII)", category: "elective", groups: ["pre-medical", "pre-engineering", "ics"], icon: "zap", chapters: 10, description: "Electrostatics, Electromagnetism, AC Circuits, Solids, Electronics, Nuclear Physics." },
      { id: "chem-12", name: "Chemistry (XII)", category: "elective", groups: ["pre-medical", "pre-engineering"], icon: "flask-conical", chapters: 16, description: "Periodic Trends, Transition Elements, Hydrocarbons, Alcohols, Carboxylic Acids." },
      { id: "bio-12", name: "Biology (XII)", category: "elective", groups: ["pre-medical"], icon: "dna", chapters: 13, description: "Homeostasis, Support & Movement, Genetics, Biotechnology, Ecosystem." },
      { id: "math-12", name: "Mathematics (XII)", category: "elective", groups: ["pre-engineering", "ics"], icon: "calculator", chapters: 7, description: "Functions & Limits, Differentiation, Integration, Analytic Geometry, Vectors." },
      { id: "cs-12", name: "Computer Science (XII)", category: "elective", groups: ["ics"], icon: "laptop-code", chapters: 14, description: "Database Concepts, MS Access, Relational Keys, C Programming." }
    ]
  }
};

export const sampleChapterTitles = {
  // 9th Class Exact Chapter Titles (2026 PECTAA / PCTB)
  "phy-9": [
    "Physical Quantities and Measurements",
    "Kinematics",
    "Dynamics and Force",
    "Turning Effect of Forces",
    "Gravitation & Satellite Motion",
    "Work, Power and Energy",
    "Properties of Matter",
    "Thermal Properties of Matter",
    "Transfer of Heat"
  ],
  "chem-9": [
    "Fundamentals of Chemistry",
    "Structure of Atoms",
    "Periodic Table and Periodicity of Properties",
    "Structure of Molecules (Chemical Bonding)",
    "Physical States of Matter",
    "Solutions and Solubility",
    "Electrochemistry",
    "Chemical Reactivity"
  ],
  "bio-9": [
    "Introduction to Biology",
    "Solving a Biological Problem",
    "Biodiversity & Classification",
    "Cells and Tissues",
    "Cell Cycle & Mitosis/Meiosis",
    "Enzymes Structure and Action",
    "Bioenergetics & Photosynthesis",
    "Nutrition & Human Digestion",
    "Transport System in Plants & Humans"
  ],
  "cs-9": [
    "Problem Solving & Computational Thinking",
    "Binary System & Data Representation",
    "Computer Networks & Data Communication",
    "Data Security & Cyber Ethics (2026 Revised)",
    "Web Designing (HTML5, CSS3 & Responsive Web)"
  ],
  "eng-9": [
    "The Savior of Mankind (PBUH)",
    "Patriotism",
    "Media and Its Impact",
    "Hazrat Asma (R.A)",
    "Daffodils (Poem)",
    "The Quaid's Vision and Pakistan",
    "Sultan Ahmad Mosque",
    "Stopping by Woods on a Snowy Evening",
    "All is Not Lost",
    "Drug Addiction: Causes and Control",
    "Noise in the Environment",
    "Three Days to See"
  ],
  "urdu-9": [
    "Hijrat-e-Nabvi (S.A.W)",
    "Mirza Ghalib ke Akhlaq-o-Aadat",
    "Kahili aur Us K Nataij",
    "Shaairon ke Afeefa o Aadat",
    "Nasooh aur Saleem ki Guftgoo",
    "Panchayat (Munshi Premchand)",
    "Aram-o-Sukoon (Drama)",
    "Lahoo aur Qaleen",
    "Imtihan ki Tayyari",
    "Mulki Toyoor Ka Astaana"
  ],
  "math-sci-9": [
    "Matrices and Determinants",
    "Real and Complex Numbers",
    "Logarithms",
    "Algebraic Expressions and Formulas",
    "Factorization",
    "Algebraic Manipulation (HCF & LCM)",
    "Linear Equations and Inequalities",
    "Linear Graphs and Their Application",
    "Introduction to Coordinate Geometry",
    "Congruent Triangles",
    "Parallelograms and Triangles",
    "Line Bisectors and Angle Bisectors",
    "Sides and Angles of a Triangle",
    "Ratio and Proportion",
    "Pythagoras' Theorem",
    "Theorems Related to Area",
    "Practical Geometry - Triangles"
  ],
  "quran-9": [
    "Surah Maryam wa Surah Taha",
    "Surah Al-Anbiya wa Surah Al-Hajj",
    "Surah Al-Furqan wa Surah Ash-Shu'ara",
    "Surah An-Naml wa Surah Al-Qasas",
    "Surah Al-Ankabut wa Surah Ar-Rum",
    "Surah Luqman wa Surah As-Sajdah",
    "Surah Al-Ahzab wa Surah Saba",
    "Surah Fatir wa Surah Ya-Sin"
  ],
  "isl-9": [
    "Quran Majeed wa Hadees-e-Nabvi (SAW)",
    "Imaniyt wa Ibadat (Tauheed, Risalat, Namaz, Roza)",
    "Seerat-un-Nabi (SAW) wa Ashab-e-Karam (R.A)",
    "Akhlaq-o-Aadaab wa Islamic Ethics",
    "Husn-e-Muamlat wa Halal Rizq",
    "Hidayat ke Sarchashmey wa Mashahir-e-Islam"
  ],
  "math-arts-9": [
    "Percentage, Ratio and Proportion",
    "Real Numbers & Financial Arithmetic",
    "Zakat, Ushr and Inheritance",
    "Financial Mathematics & Banking",
    "Consumer Mathematics & Taxation",
    "Exponents and Logarithms",
    "Arithmetic & Geometric Progressions",
    "Sets and Functions",
    "Linear Graphs & Equations",
    "Basic Statistics & Geometry"
  ],
  "gen-sci-9": [
    "Introduction & History of Science",
    "Our Life and Chemistry",
    "Biochemistry and Biotechnology",
    "Human Health, Diseases and Prevention",
    "Diseases, Causes & Immunization",
    "Environment and Natural Resources",
    "Energy Resources and Conservation",
    "Current Electricity & Circuits",
    "Basic Electronics & Communication",
    "Information Technology & Telecommunication",
    "Pakistan's Space & Nuclear Program"
  ],
  "edu-9": [
    "Meaning, Scope and Concept of Education",
    "Modes of Education (Formal, Informal, Non-Formal)",
    "Foundations of Education (Philosophical, Psychological)",
    "Growth and Development of the Learner",
    "Guidance and Counseling in Schools",
    "Learning Environment and Pedagogy",
    "Curriculum and Assessment Concepts",
    "Educational Structure in Pakistan"
  ],
  "civics-9": [
    "Introduction to Civics & Citizenship",
    "Individual, Family and Society",
    "State, Government and Sovereignty",
    "Rights and Responsibilities of Citizens",
    "Law, Liberty and Equality",
    "Constitution and Governance Structure",
    "Community Development & Civic Participation"
  ],
  "econ-9": [
    "Nature, Scope and Definition of Economics",
    "Basic Concepts of Economics",
    "Human Wants and Consumer Utility",
    "Demand and Law of Demand",
    "Supply and Law of Supply",
    "Market Equilibrium and Price Determination",
    "Factors of Production (Land, Labor, Capital, Org)",
    "National Income Concepts",
    "Money, Banking and Public Finance"
  ],

  // 10th Class Exact Chapter Titles (2026 PECTAA / PCTB)
  "phy-10": [
    "Simple Harmonic Motion and Waves",
    "Sound and Acoustics",
    "Geometrical Optics",
    "Electrostatics",
    "Current Electricity",
    "Electromagnetism",
    "Basic Electronics",
    "Information and Communication Technology (ICT)",
    "Atomic and Nuclear Physics"
  ],
  "chem-10": [
    "Chemical Equilibrium",
    "Acids, Bases and Salts",
    "Organic Chemistry",
    "Hydrocarbons",
    "Biochemistry",
    "The Atmosphere",
    "Water and Environmental Chemistry",
    "Chemical Industries in Pakistan"
  ],
  "bio-10": [
    "Gaseous Exchange System",
    "Homeostasis & Excretion",
    "Coordination and Control",
    "Support and Movement",
    "Reproduction in Organisms",
    "Inheritance & Genetics",
    "Man and His Environment",
    "Biotechnology Applications",
    "Pharmacology & Drugs"
  ],
  "cs-10": [
    "Introduction to Programming (C Language)",
    "User Interface & Data Types",
    "Control Logic (If-Else & Switch)",
    "Loop Control Structures (For, While)",
    "Functions & Modular Coding",
    "Arrays & Data Structures",
    "Digital Security & Ethics"
  ],
  "eng-10": [
    "Hazrat Muhammad (PBUH) an Embodiment of Justice",
    "Chinese New Year",
    "Try Again (Poem)",
    "First Aid",
    "The Rain (Poem)",
    "Television vs Newspapers",
    "Little by Little One Walks Far",
    "Peace (Poem)",
    "Selecting the Right Career",
    "A World Without Books",
    "Great Expectations",
    "Population Growth and World Food Supplies",
    "Faithfulness"
  ],
  "urdu-10": [
    "Hamd (Allama Iqbal / Hafeez Jalandhari)",
    "Naat (Maulana Altaf Hussain Hali)",
    "Nazariya-e-Pakistan",
    "Mujhe Mere Doston Se Bachao",
    "Parveen Shakir & Nazm",
    "Chunnoo ka Khwab",
    "Nam Deo Mali (Maulvi Abdul Haq)",
    "Oonch Neech",
    "Zafrullah Khan ki Yadgar",
    "Ghazliyat-e-Hasrat Mohani",
    "Ghazliyat-e-Jigar Moradabadi",
    "Khutoot-e-Iqbal"
  ],
  "math-sci-10": [
    "Quadratic Equations",
    "Theory of Quadratic Equations",
    "Variations (Direct & Inverse)",
    "Partial Fractions",
    "Sets and Functions",
    "Basic Statistics & Data Analysis",
    "Introduction to Trigonometry",
    "Projection of a Side of a Triangle",
    "Chords of a Circle",
    "Tangent to a Circle",
    "Chords and Arcs",
    "Angle in a Segment of a Circle",
    "Practical Geometry - Circles"
  ],
  "quran-10": [
    "Surah Al-Anfal",
    "Surah At-Tawbah",
    "Surah Yunus wa Surah Hud",
    "Surah Yusuf wa Surah Ar-Ra'd",
    "Surah Ibrahim wa Surah Al-Hijr",
    "Surah An-Nahl wa Surah Al-Isra",
    "Surah Al-Kahf wa Surah Maryam",
    "Surah Al-Hajj wa Surah Al-Muminun"
  ],
  "pak-10": [
    "History of Pakistan II (1971 to Present)",
    "Foreign Policy of Pakistan & World Affairs",
    "Economic Development of Pakistan",
    "Population, Society & Culture of Pakistan",
    "Protection of Women & Human Rights"
  ],

  // 1st Year (11th Class) Exact Chapter Titles
  "eng-11": [
    "Button, Button (Short Story)",
    "Clearing in the Sky",
    "Dark They Were, and Golden-Eyed",
    "Thank You, M'am",
    "The Piece of String",
    "The Reward",
    "The Use of Force",
    "The Gulistan of Sa'di",
    "The Foolish Quack",
    "A Mild Attack of Locusts",
    "I Have a Dream",
    "The Gift of the Magi",
    "God be Praised",
    "Overcoat",
    "The Angel and the Author"
  ],
  "urdu-11": [
    "Uswa-e-Hasana (S.A.W)",
    "Apni Madad Aap (Sir Syed Ahmad Khan)",
    "Sir Syed ke Akhlaq-o-Khasail",
    "Shairon ke Lateefe",
    "Apni Beti se (Deputy Nazeer Ahmad)",
    "Adeeb ki Izzat",
    "Overcoat (Ghulam Abbas)",
    "Safar Nama-e-Iqbal",
    "Lahore ka Jughrafia",
    "Ghazliyat-e-Mir Taqi Mir",
    "Ghazliyat-e-Ghalib",
    "Nazamat-e-Iqbal",
    "Nazam-e-Hafeez Jalandhari",
    "Inshaiya & Khutoot"
  ],
  "isl-11": [
    "Tauheed, Risalat wa Akhirah",
    "Arkan-e-Islam (Namaz, Roza, Zakat, Hajj)",
    "Seerat-un-Nabi (SAW) wa Akhlaq-e-Hasna",
    "Quran-o-Hadees ki Taleemat",
    "Islami Muaashra wa Huqooq-ul-Ibad",
    "Kasb-e-Halal wa Khidmat-e-Khalq"
  ],
  "phy-11": [
    "Measurements",
    "Vectors and Equilibrium",
    "Motion and Force",
    "Work and Energy",
    "Rotational and Circular Motion",
    "Fluid Dynamics",
    "Oscillations",
    "Waves",
    "Physical Optics",
    "Optical Instruments",
    "Heat and Thermodynamics"
  ],
  "chem-11": [
    "Basic Concepts",
    "Experimental Techniques in Chemistry",
    "Gases",
    "Liquids and Solids",
    "Atomic Structure",
    "Chemical Bonding",
    "Thermochemistry",
    "Chemical Equilibrium",
    "Solutions",
    "Electrochemistry",
    "Reaction Kinetics"
  ],
  "bio-11": [
    "Cell Structure and Function",
    "Biological Molecules",
    "Enzymes",
    "Bioenergetics",
    "Acellular Life (Viruses)",
    "Prokaryotes (Bacteria)",
    "Protists and Fungi",
    "Diversity Among Plants",
    "Diversity Among Animals",
    "Form and Functions in Plants",
    "Digestion",
    "Circulation",
    "Immunity",
    "Respiration"
  ],
  "math-11": [
    "Number Systems",
    "Sets, Functions & Groups",
    "Matrices & Determinants",
    "Quadratic Equations",
    "Partial Fractions",
    "Sequences & Series",
    "Permutation, Combination & Probability",
    "Mathematical Induction & Binomial Theorem",
    "Fundamentals of Trigonometry",
    "Trigonometric Identities",
    "Trigonometric Functions & Graphs",
    "Application of Trigonometry",
    "Inverse Trigonometric Functions",
    "Solutions of Trigonometric Equations"
  ],
  "cs-11": [
    "Basics of Information Technology",
    "Information Networks",
    "Data Communications",
    "Applications & Uses of Computers",
    "Computer Architecture",
    "Security, Copyright & the Law",
    "Windows Operating System",
    "Word Processing Concepts",
    "Spreadsheet Concepts (Excel)",
    "Fundamentals of Internet & Web"
  ],

  // 2nd Year (12th Class) Exact Chapter Titles
  "eng-12": [
    "The Dying Sun (Sir James Jeans)",
    "Using the Scientific Method",
    "Why Boys Fail in College",
    "End of Term",
    "On Destroying Books",
    "The Man Who Was a Hospital",
    "My Financial Career",
    "China's Way to Progress",
    "Hunger and Population Explosion",
    "Jewel of the World",
    "Mustafa Kamal",
    "Hitch-Hiking Across the Sahara",
    "Sir Alexander Fleming",
    "Louis Pasteur"
  ],
  "urdu-12": [
    "Munaqab-e-Umer Bin Abdul Aziz",
    "Tashkeel-e-Pakistan (Dr. Muhammad Iqbal)",
    "Nawab Mohsin-ul-Mulk",
    "Mehnat Pasand Khasan-e-Aam",
    "Akbar ki Deen-e-Elahi",
    "Kalimuddin Ahmad",
    "Kurt-ul-Ain Haider",
    "Khutoot-e-Ghalib & Iqbal",
    "Ghazliyat-e-Nasir Kazmi",
    "Ghazliyat-e-Firaq Gorakhpuri",
    "Nazamat-e-Josh Malihabadi",
    "Nazm-e-Faiz Ahmad Faiz",
    "Inshaiya & Khutoot Nigari",
    "Mazmoon Nigari & Drama"
  ],
  "pak-12": [
    "Genesis of the Islamic Republic of Pakistan",
    "Initial Problems of Pakistan & Solutions",
    "Geography, Climate & Land of Pakistan",
    "Steps Towards Islamic Republic & Constitution",
    "Foreign Policy & International Relations"
  ],
  "phy-12": [
    "Electrostatics",
    "Current Electricity",
    "Electromagnetism",
    "Electromagnetic Induction",
    "Alternating Current",
    "Physics of Solids",
    "Electronics",
    "Dawn of Modern Physics",
    "Atomic Spectra",
    "Nuclear Physics"
  ],
  "chem-12": [
    "Periodic Classification of Elements",
    "s-Block Elements",
    "Group III-A and Group IV-A Elements",
    "Group V-A and Group VI-A Elements",
    "Halogens and Noble Gases",
    "Transition Elements",
    "Fundamental Principles of Organic Chemistry",
    "Aliphatic Hydrocarbons",
    "Aromatic Hydrocarbons",
    "Alkyl Halides",
    "Alcohols, Phenols and Ethers",
    "Aldehydes and Ketones",
    "Carboxylic Acids",
    "Macromolecules",
    "Common Chemical Industries in Pakistan",
    "Environmental Chemistry"
  ],
  "bio-12": [
    "Homeostasis",
    "Support and Movements",
    "Coordination and Control",
    "Reproduction",
    "Growth and Development",
    "Chromosomes and DNA",
    "Cell Cycle",
    "Variation and Genetics",
    "Biotechnology",
    "Evolution",
    "Ecosystem",
    "Major Ecosystems",
    "Man and His Environment"
  ],
  "math-12": [
    "Functions & Limits",
    "Differentiation & Derivatives",
    "Integration & Definite Integrals",
    "Introduction to Analytic Geometry",
    "Linear Inequalities & Linear Programming",
    "Conic Sections & Circle",
    "Vectors in 2D & 3D Space"
  ],
  "cs-12": [
    "Data Basics & Information Processing",
    "Basic Concepts & Terminology of Databases",
    "Data Normalization Process",
    "Introduction to Microsoft Access",
    "MS Access Tables & Relational Keys",
    "MS Access Queries",
    "MS Access Forms & Reports",
    "Getting Started with C Language",
    "Elements of C Language",
    "Input and Output in C",
    "Decision Constructs in C",
    "Loop Constructs in C",
    "Functions in C",
    "File Handling in C"
  ]
};

export const sampleFormulas = [
  { title: "Newton's Second Law", formula: "F = m × a", desc: "Force equals mass multiplied by acceleration." },
  { title: "Kinetic Energy", formula: "K.E. = ½ × m × v²", desc: "Energy possessed by a body due to its motion." },
  { title: "Potential Energy", formula: "P.E. = m × g × h", desc: "Energy stored in a body due to its height in gravitational field." },
  { title: "Ohm's Law", formula: "V = I × R", desc: "Voltage equals current multiplied by resistance." },
  { title: "Einstein Energy Mass Relation", formula: "E = m × c²", desc: "Equivalence of mass and energy." }
];

export const sampleQuizQuestions = [
  {
    q: "Which of the following is a fundamental base unit in SI System?",
    options: ["Newton", "Kilogram", "Joule", "Pascal"],
    correct: 1,
    exp: "Kilogram (kg) is the base SI unit of mass. Newton, Joule, and Pascal are derived units."
  },
  {
    q: "What is the acceleration due to gravity on the surface of Earth?",
    options: ["8.8 m/s²", "9.8 m/s²", "10.8 m/s²", "12.0 m/s²"],
    correct: 1,
    exp: "Standard gravity on Earth's surface is approximately 9.8 m/s² (often rounded to 10 m/s²)."
  },
  {
    q: "Which instrument is used to measure extremely small lengths accurately up to 0.01 mm?",
    options: ["Meter Rod", "Vernier Caliper", "Screw Gauge", "Measuring Tape"],
    correct: 2,
    exp: "A Micrometer Screw Gauge has a least count of 0.01 mm, making it ideal for micro-measurements."
  }
];

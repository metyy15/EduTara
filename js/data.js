// ---------- SYLLABUS + SIMULATED TUTOR BRAIN ----------
const CLASS_BANDS = [
  { range: [1, 3], topics: ["Addition & Subtraction", "Our Body Parts", "Plants Around Us", "Shapes and Patterns"] },
  { range: [4, 6], topics: ["Fractions Basics", "Photosynthesis", "States of Matter", "The Solar System", "Multiplication Tricks"] },
  { range: [7, 8], topics: ["Ratio and Proportion", "Photosynthesis", "Newton's Laws of Motion", "Algebra Basics", "Water Cycle"] },
  { range: [9, 10], topics: ["Quadratic Equations", "Human Digestive System", "Reflection of Light", "Probability Basics", "Cell Division"] },
  { range: [11, 12], topics: ["Derivatives", "Human Respiratory System", "Work Energy Power", "Organic Chemistry Basics", "Probability Distributions"] },
];

function bandFor(cls) {
  return CLASS_BANDS.find(b => cls >= b.range[0] && cls <= b.range[1]) || CLASS_BANDS[2];
}

// NCERT-mapped lessons per class band
const NCERT_LESSONS = [
  { range: [1, 3], lessons: [
    { subject: "Maths", chapter: "Ch 1-3: Shapes & Numbers", topic: "Addition & Subtraction" },
    { subject: "EVS", chapter: "Ch: Our Body & Plants", topic: "Plants Around Us" },
  ]},
  { range: [4, 6], lessons: [
    { subject: "Maths", chapter: "Ch: Fractions", topic: "Fractions Basics" },
    { subject: "Science", chapter: "Ch: Getting to Know Plants", topic: "Photosynthesis" },
    { subject: "Science", chapter: "Ch: The Solar System", topic: "The Solar System" },
  ]},
  { range: [7, 8], lessons: [
    { subject: "Maths", chapter: "Ch: Ratio and Proportion", topic: "Ratio and Proportion" },
    { subject: "Science", chapter: "Ch: Water Cycle", topic: "Water Cycle" },
    { subject: "Science", chapter: "Ch: Force and Pressure", topic: "Newton's Laws of Motion" },
  ]},
  { range: [9, 10], lessons: [
    { subject: "Science", chapter: "Ch: Light - Reflection", topic: "Reflection of Light" },
    { subject: "Biology", chapter: "Ch: Cell - The Unit of Life", topic: "Cell Division" },
    { subject: "Maths", chapter: "Ch: Quadratic Equations", topic: "Quadratic Equations" },
  ]},
  { range: [11, 12], lessons: [
    { subject: "Physics", chapter: "Ch: Work, Energy and Power", topic: "Work Energy Power" },
    { subject: "Maths", chapter: "Ch: Probability", topic: "Probability Distributions" },
    { subject: "Chemistry", chapter: "Ch: Organic Chemistry", topic: "Organic Chemistry Basics" },
  ]},
];
function ncertFor(cls) {
  return (NCERT_LESSONS.find(b => cls >= b.range[0] && cls <= b.range[1]) || NCERT_LESSONS[2]).lessons;
}

// Simple SVG diagrams keyed by keyword
const DIAGRAMS = {
  photosynthesis: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Photosynthesis</text>
  <circle cx="60" cy="70" r="25" fill="#ffd54f"/><text x="60" y="115" text-anchor="middle" font-size="11">Sunlight</text>
  <path d="M60 70 L140 90" stroke="#f9a825" stroke-width="3" marker-end="url(#a)"/>
  <ellipse cx="230" cy="130" rx="70" ry="40" fill="#81c784"/><text x="230" y="135" text-anchor="middle" font-size="13" fill="#fff">Leaf</text>
  <text x="230" y="190" text-anchor="middle" font-size="11">Chloroplast inside</text>
  <text x="340" y="60" font-size="12">CO₂ in</text><path d="M320 65 L295 95" stroke="#888" stroke-width="2"/>
  <text x="330" y="220" font-size="12">O₂ out ✓</text><path d="M290 160 L320 195" stroke="#2e7d32" stroke-width="2"/>
  <text x="150" y="245" font-size="12">Glucose (food) stored</text></svg>`,
  water: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Water Cycle</text>
  <path d="M0 200 Q200 170 400 200 L400 260 L0 260Z" fill="#64b5f6"/>
  <text x="200" y="240" text-anchor="middle" fill="#fff" font-size="12">Ocean</text>
  <circle cx="70" cy="60" r="22" fill="#ffd54f"/>
  <path d="M200 185 C190 140 210 130 200 90" stroke="#90caf9" stroke-width="6" fill="none"/>
  <text x="230" y="120" font-size="12">Evaporation</text>
  <ellipse cx="320" cy="60" rx="45" ry="18" fill="#cfd8dc"/>
  <text x="320" y="65" text-anchor="middle" font-size="11">Condensation</text>
  <path d="M320 80 L300 140" stroke="#42a5f5" stroke-width="4"/>
  <text x="330" y="120" font-size="12">Rain (Precipitation)</text></svg>`,
  math: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Division Example</text>
  <rect x="40" y="60" width="60" height="60" rx="10" fill="#ffab91"/><text x="70" y="95" text-anchor="middle" font-size="14">🍰</text>
  <rect x="120" y="60" width="60" height="60" rx="10" fill="#ffab91"/><text x="150" y="95" text-anchor="middle" font-size="14">🍰</text>
  <rect x="200" y="60" width="60" height="60" rx="10" fill="#ffab91"/><text x="230" y="95" text-anchor="middle" font-size="14">🍰</text>
  <text x="200" y="165" text-anchor="middle" font-size="15" font-weight="bold">12 cakes ÷ 3 friends = 4 cakes each</text>
  <text x="200" y="200" text-anchor="middle" font-size="12">Sharing equally is called division!</text></svg>`,
  solar: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Solar System</text>
  <circle cx="200" cy="130" r="28" fill="#ffd54f"/><text x="200" y="135" text-anchor="middle" font-size="11">Sun</text>
  <ellipse cx="200" cy="130" rx="60" ry="60" fill="none" stroke="#ddd"/><circle cx="260" cy="130" r="8" fill="#a1887f"/>
  <ellipse cx="200" cy="130" rx="100" ry="100" fill="none" stroke="#ddd"/><circle cx="200" cy="30" r="12" fill="#64b5f6"/><text x="200" y="55" text-anchor="middle" font-size="10">Earth</text>
  <ellipse cx="200" cy="130" rx="140" ry="140" fill="none" stroke="#ddd"/><circle cx="340" cy="130" r="16" fill="#ff8a65"/><text x="340" y="160" text-anchor="middle" font-size="10">Mars</text></svg>`,
  motion: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Force and Motion</text>
  <rect x="60" y="140" width="70" height="50" rx="8" fill="#b39ddb"/>
  <circle cx="80" cy="198" r="10" fill="#555"/><circle cx="110" cy="198" r="10" fill="#555"/>
  <path d="M130 165 L240 165" stroke="#e65100" stroke-width="5" marker-end="url(#a)"/>
  <text x="185" y="155" text-anchor="middle" font-size="13" font-weight="bold">Force →</text>
  <text x="200" y="235" text-anchor="middle" font-size="12">Push the block → it moves!</text></svg>`,
  cells: `<svg viewBox="0 0 400 260"><text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">Cell Division</text>
  <circle cx="90" cy="130" r="40" fill="#a5d6a7" stroke="#2e7d32" stroke-width="3"/><circle cx="90" cy="130" r="14" fill="#66bb6a"/>
  <text x="90" y="195" text-anchor="middle" font-size="12">1 Cell</text>
  <path d="M145 130 L195 130" stroke="#888" stroke-width="3" marker-end="url(#a)"/>
  <circle cx="260" cy="95" r="30" fill="#a5d6a7" stroke="#2e7d32" stroke-width="3"/>
  <circle cx="260" cy="165" r="30" fill="#a5d6a7" stroke="#2e7d32" stroke-width="3"/>
  <text x="320" y="135" font-size="12">2 Cells!</text></svg>`,
  default: `<svg viewBox="0 0 400 260"><text x="200" y="30" text-anchor="middle" font-size="16" font-weight="bold">Key Idea</text>
  <rect x="100" y="70" width="200" height="60" rx="15" fill="#fff9c4" stroke="#f9a825" stroke-width="3"/>
  <text x="200" y="105" text-anchor="middle" font-size="14">Think step by step 💡</text>
  <path d="M200 140 L200 180" stroke="#888" stroke-width="3"/>
  <circle cx="200" cy="205" r="18" fill="#81d4fa"/></svg>`,
};

// Topic explanations: simple, class-appropriate
const EXPLANATIONS = {
  "Photosynthesis": {
    diag: "photosynthesis",
    text: "प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे अपना भोजन स्वयं बनाते हैं। वे सूर्य के प्रकाश, हवा से कार्बन डाइऑक्साइड और मिट्टी से पानी लेते हैं। पत्तियों के हरे भाग क्लोरोप्लास्ट में यह ग्लूकोज़ बनाते हैं और ऑक्सीजन छोड़ते हैं। याद रखें: सूर्य का प्रकाश + CO2 + पानी = भोजन + ऑक्सीजन!",
    question: "क्या तुम बता सकते हो — प्रकाश संश्लेषण मुख्य रूप से पौधे के किस भाग में होता है?",
    answerHint: ["leaf", "leaves", "chloroplast"],
  },
  "Water Cycle": {
    diag: "water",
    text: "जल चक्र प्रकृति की पुनर्चक्रण व्यवस्था है। सूर्य समुद्र और नदियों के पानी को गर्म करके उसे भाप में बदल देता है — इसे वाष्पीकरण कहते हैं। भाप ऊपर जाकर ठंडी होकर बादल बनाती है — इसे संघनन कहते हैं। बादल भारी होते ही पानी बारिश के रूप में गिरता है — इसे वर्षा कहते हैं।",
    question: "जल चक्र का पहला चरण क्या है?",
    answerHint: ["evaporation", "heat", "vapor"],
  },
  "Division": {
    diag: "math",
    text: "भाग का अर्थ है बराबर बाँटना। अगर आपके पास 12 केक हैं और 3 दोस्त हैं, तो हर दोस्त को 4 केक मिलेंगे। हम इसे 12 ÷ 3 = 4 लिखते हैं।",
    question: "अगर 20 पेंसिल 4 छात्रों में बराबर बाँटी जाएँ, तो हर एक को कितनी मिलेगी?",
    answerHint: ["5", "five"],
  },
  "The Solar System": {
    diag: "solar",
    text: "हमारे सौर मंडल के केंद्र में सूर्य है, और आठ ग्रह उसके चारों ओर घूमते हैं। सूर्य के सबसे करीब बुध है, फिर शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, यूरेनस और नेप्च्यून। पृथ्वी विशेष है क्योंकि यहाँ पानी और हवा है।",
    question: "हम किस ग्रह पर रहते हैं?",
    answerHint: ["earth"],
  },
  "Newton's Laws of Motion": {
    diag: "motion",
    text: "न्यूटन ने गति के तीन बड़े नियम बताए। पहला: कोई वस्तु स्थिर रहेगी या चलते रहेगी जब तक कोई बल उसे न बदले। दूसरा: जितना बड़ा बल, उतना तेज़ त्वरण, F = m × a। तीसरा: हर क्रिया की बराबर और विपरीत प्रतिक्रिया होती है।",
    question: "अगर तुम डिब्बे को और ज़ोर से धकेलो, तो उसकी गति का क्या होगा?",
    answerHint: ["increases", "faster", "more speed", "goes faster"],
  },
  "Cell Division": {
    diag: "cells",
    text: "कोशिका विभाजन वह प्रक्रिया है जिसमें एक कोशिका से दो कोशिकाएँ बनती हैं। पहले कोशिका अपना DNA कॉपी करती है, फिर बीच में दो हिस्सों में बँट जाती है। इस प्रक्रिया को माइटोसिस कहते हैं।",
    question: "एक कोशिका के दो में बँटने की प्रक्रिया का क्या नाम है?",
    answerHint: ["mitosis", "cell division"],
  },
};

// Step-by-step illustrations (shown one part at a time)
const PARTS = {
  "Photosynthesis": [
    { t: "Step 1: Sunlight", svg: `<svg viewBox="0 0 400 260"><circle cx="200" cy="110" r="45" fill="#ffd54f"/><text x="200" y="180" text-anchor="middle" font-size="15" font-weight="bold">☀️ Sunlight gives energy</text></svg>` },
    { t: "Step 2: CO₂ enters", svg: `<svg viewBox="0 0 400 260"><path d="M120 60 Q100 120 120 200" stroke="#81c784" stroke-width="14" fill="none"/><text x="260" y="80" font-size="16">CO₂ →</text><text x="200" y="240" text-anchor="middle" font-size="14">Carbon dioxide from air</text></svg>` },
    { t: "Step 3: Food + Oxygen", svg: `<svg viewBox="0 0 400 260"><rect x="90" y="80" width="90" height="90" rx="12" fill="#ffe082"/><text x="135" y="130" text-anchor="middle" font-size="14">🍬 Food</text><text x="300" y="100" font-size="20">O₂ ↑</text><text x="200" y="215" text-anchor="middle" font-size="14">Oxygen released into air!</text></svg>` },
  ],
  "Water Cycle": [
    { t: "Step 1: Evaporation", svg: `<svg viewBox="0 0 400 260"><path d="M0 200 L400 200 L400 260 L0 260Z" fill="#64b5f6"/><path d="M200 180 C195 140 210 130 200 90" stroke="#fff" stroke-width="8" fill="none"/><text x="200" y="60" text-anchor="middle" font-size="15" font-weight="bold">Evaporation ⬆️</text></svg>` },
    { t: "Step 2: Condensation", svg: `<svg viewBox="0 0 400 260"><ellipse cx="200" cy="120" rx="70" ry="30" fill="#cfd8dc"/><text x="200" y="180" text-anchor="middle" font-size="15" font-weight="bold">Condensation ☁️</text></svg>` },
    { t: "Step 3: Rain", svg: `<svg viewBox="0 0 400 260"><ellipse cx="200" cy="70" rx="70" ry="25" fill="#cfd8dc"/><path d="M160 100 L150 150 M200 100 L200 160 M240 100 L250 150" stroke="#42a5f5" stroke-width="5"/><text x="200" y="200" text-anchor="middle" font-size="15" font-weight="bold">Rain 🌧️</text></svg>` },
  ],
  "Division": [
    { t: "Step 1: Total items", svg: `<svg viewBox="0 0 400 260"><text x="200" y="130" text-anchor="middle" font-size="40">🍰🍰🍰🍰🍰🍰</text><text x="200" y="180" text-anchor="middle" font-size="15" font-weight="bold">Start with 6 cakes</text></svg>` },
    { t: "Step 2: Share equally", svg: `<svg viewBox="0 0 400 260"><text x="140" y="140" text-anchor="middle" font-size="36">🍰🍰</text><text x="260" y="140" text-anchor="middle" font-size="36">🍰🍰</text><text x="200" y="200" text-anchor="middle" font-size="15" font-weight="bold">6 ÷ 2 = 3 each</text></svg>` },
  ],
  "The Solar System": [
    { t: "Step 1: The Sun", svg: `<svg viewBox="0 0 400 260"><circle cx="200" cy="120" r="55" fill="#ffd54f"/><text x="200" y="215" text-anchor="middle" font-size="15" font-weight="bold">☀️ The Sun is our star</text></svg>` },
    { t: "Step 2: Planets orbit", svg: `<svg viewBox="0 0 400 260"><circle cx="200" cy="130" r="25" fill="#ffd54f"/><circle cx="290" cy="130" r="10" fill="#64b5f6"/><text x="200" y="225" text-anchor="middle" font-size="15" font-weight="bold">🌍 Planets revolve around the Sun</text></svg>` },
  ],
  "Newton's Laws of Motion": [
    { t: "Step 1: Object at rest", svg: `<svg viewBox="0 0 400 260"><rect x="150" y="90" width="100" height="70" rx="10" fill="#b39ddb"/><text x="200" y="200" text-anchor="middle" font-size="15" font-weight="bold">A box stays still…</text></svg>` },
    { t: "Step 2: Force moves it", svg: `<svg viewBox="0 0 400 260"><rect x="60" y="90" width="90" height="60" rx="10" fill="#b39ddb"/><path d="M160 120 L260 120" stroke="#e65100" stroke-width="6"/><text x="210" y="200" text-anchor="middle" font-size="15" font-weight="bold">…until a force pushes it!</text></svg>` },
  ],
  "Cell Division": [
    { t: "Step 1: One cell", svg: `<svg viewBox="0 0 400 260"><circle cx="200" cy="120" r="50" fill="#a5d6a7" stroke="#2e7d32" stroke-width="4"/><circle cx="200" cy="120" r="16" fill="#66bb6a"/><text x="200" y="215" text-anchor="middle" font-size="15" font-weight="bold">One cell copies its DNA</text></svg>` },
    { t: "Step 2: Splits into two", svg: `<svg viewBox="0 0 400 260"><circle cx="130" cy="120" r="40" fill="#a5d6a7" stroke="#2e7d32" stroke-width="4"/><circle cx="270" cy="120" r="40" fill="#a5d6a7" stroke="#2e7d32" stroke-width="4"/><text x="200" y="215" text-anchor="middle" font-size="15" font-weight="bold">Two new cells!</text></svg>` },
  ],
};

function stepSequence(key, cb) {
  const parts = PARTS[key];
  if (!parts) { cb && cb(); return; }
  parts.forEach((p, i) => {
    setTimeout(() => {
      $('boardTitle').textContent = key + " — " + p.t;
      $('boardBody').innerHTML = p.svg;
      moveAvatar(i % 2 === 0 ? 'left' : 'right');
    }, i * 3000);
  });
  if (cb) setTimeout(cb, parts.length * 3000);
}
const TOPIC_KEYWORDS = {
  photosynthesis: "Photosynthesis", water: "Water Cycle", cycle: "Water Cycle",
  division: "Division", divide: "Division", share: "Division",
  solar: "The Solar System", planet: "The Solar System", sun: "The Solar System",
  newton: "Newton's Laws of Motion", force: "Newton's Laws of Motion", motion: "Newton's Laws of Motion",
  cell: "Cell Division", mitosis: "Cell Division",
  addition: "Division", fraction: "Division", multiplication: "Division",
  math: "Division", algebra: "Division", equation: "Division",
  body: "The Solar System", digestive: "Cell Division", light: "Newton's Laws of Motion",
  probability: "Cell Division", energy: "Newton's Laws of Motion", respiration: "Cell Division",
  chemistry: "Cell Division", derivative: "Division",
  प्रकाश: "Photosynthesis", संश्लेषण: "Photosynthesis", पत्ती: "Photosynthesis",
  जल: "Water Cycle", बारिश: "Water Cycle", वाष्प: "Water Cycle",
  भाग: "Division", बाँटना: "Division",
  सौरमंडल: "The Solar System", ग्रह: "The Solar System", सूर्य: "The Solar System",
  बल: "Newton's Laws of Motion", गति: "Newton's Laws of Motion",
  कोशिका: "Cell Division", माइटोसिस: "Cell Division",
};

function detectTopic(text) {
  text = text.toLowerCase();
  for (const k in TOPIC_KEYWORDS) if (text.includes(k)) return TOPIC_KEYWORDS[k];
  return null;
}

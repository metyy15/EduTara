// ---------- STATE ----------
const $ = id => document.getElementById(id);
let student = JSON.parse(localStorage.getItem('at_student') || 'null');
let weakTopics = JSON.parse(localStorage.getItem('at_weak') || '[]');
let mode = 'live'; // or 'revision'
let currentTopic = null;
let awaitingAnswer = false;
let revisionQueue = [];
let savedIllustrations = JSON.parse(localStorage.getItem('at_saved') || '[]');
let lang = localStorage.getItem('at_lang') || 'hi'; // 'hi' or 'en'

let revisionIdx = 0;

// ---------- INIT ----------
const sel = $('inpClass');
for (let i = 1; i <= 12; i++) { const o = document.createElement('option'); o.value = i; o.textContent = 'Class ' + i; sel.appendChild(o); }
if (student) showDashboard();

$('btnLogin').onclick = () => { primeAudio();
  const name = $('inpName').value.trim();
  const cls = parseInt(sel.value);
  const age = parseInt($('inpAge').value);
  if (!name || !age) return alert('Please enter your name and age!');
  student = { name, cls, age };
  localStorage.setItem('at_student', JSON.stringify(student));
  showDashboard();
};
$('btnLogout').onclick = () => { localStorage.clear(); location.reload(); };
$('btnHome').onclick = () => { showDashboard(); };

// ---------- LANGUAGE TOGGLE ----------
function applyLang() {
  $('btnLang').textContent = lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English';
  localStorage.setItem('at_lang', lang);
}
$('btnLang').onclick = () => { lang = lang === 'hi' ? 'en' : 'hi'; applyLang(); if (recognition) recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; showDashboard(); };
applyLang();

function renderLessons() {
  const el = $('lessonList'); if (!el) return;
  el.innerHTML = ncertFor(student.cls).map((l, i) =>
    `<li style="margin:6px 0;"><b>${l.subject}</b> — ${l.chapter} <button class="btn small" onclick="startLesson(${i})">▶ Start</button></li>`).join('');
}
window.startLesson = i => {
  const l = ncertFor(student.cls)[i]; if (!l) return;
  const topic = l.topic;
  if (EXPLANATIONS[topic]) { teachTopic(topic, false); return; }
  const prompt = lang === 'hi'
    ? `मुझे ${topic} के बारे में समझाओ, यह ${l.subject} का NCERT चैप्टर "${l.chapter}" है।`
    : `Teach me about ${topic} from ${l.subject}, NCERT chapter "${l.chapter}".`;
  userSay(prompt);
};

function updateIndicators() {
  const sig = document.getElementById('sigIcon');
  const aud = document.getElementById('audioIcon');
  if (sig) {
    const t = (navigator.connection && navigator.connection.effectiveType) || '';
    const el = document.getElementById('sigText'); if (el) el.textContent = 'Internet Strength: ' + (t || 'Good');
  }
  const audEl = document.getElementById('audioText'); if (audEl) audEl.textContent = 'Audio Quality: Good';
}
updateIndicators();
if (navigator.connection && navigator.connection.addEventListener) navigator.connection.addEventListener('change', updateIndicators);

function saveWeak() { localStorage.setItem('at_weak', JSON.stringify(weakTopics)); }

function showDashboard() {
  $('loginScreen').classList.remove('active');

  $('dashScreen').classList.add('active');
  const hi = `Hello, ${student.name}! 👋 (Age ${student.age})`;
  $('greet').textContent = hi;
  const ht = document.getElementById('heroTitle'); if (ht) ht.textContent = hi;
  const cl = document.getElementById('classLabel'); if (cl) cl.textContent = student.cls;
  if (!$('boardBody').innerHTML.trim()) $('boardBody').innerHTML = DIAGRAMS.default;
  renderRevision();
  renderSaved();
  renderLessons();
}

function renderRevision() {
  $('revList').innerHTML = weakTopics.map((t, i) => `<li>${t} <button class="btn small" onclick="removeWeak(${i})">✓ Clear</button></li>`).join('');
  $('revEmpty').style.display = weakTopics.length ? 'none' : 'block';
  $('btnRevision').disabled = !weakTopics.length;
}
window.removeWeak = i => { weakTopics.splice(i, 1); saveWeak(); renderRevision(); };

$('btnLive').onclick = () => { primeAudio(); startSession('live'); };
$('btnRevision').onclick = () => startSession('revision');

// ---------- SPEECH ----------
const synth = window.speechSynthesis;
const silentWav = 'data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
function primeAudio() { try { const a = new Audio(silentWav); a.play().catch(() => {}); } catch (e) {} try { synth.cancel(); synth.resume(); } catch (e) {} }
let hiVoice = null;
function loadVoices() {
  const vs = synth.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('hi'));
  const rank = v => (v.name.includes('Neural') ? 3 : v.name.includes('Google') ? 2 : v.name.includes('Microsoft') ? 1 : 0);
  vs.sort((a, b) => rank(b) - rank(a));
  hiVoice = vs[0] || null;
  console.log('Hindi voices available:', vs.map(v => v.name + ' (' + v.lang + ')'));
}
loadVoices();
if (typeof synth.onvoiceschanged !== 'undefined') synth.onvoiceschanged = loadVoices;

async function speak(text, cb) {
  chatAppend('ai', text);
  // 🎙️ Natural cloud voice if a Cloud TTS key is set
  if (typeof CLOUD_TTS_KEY !== 'undefined' && CLOUD_TTS_KEY) {
    try {
      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${CLOUD_TTS_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: lang === 'hi' ? 'hi-IN' : 'en-IN', name: CLOUD_TTS_VOICE },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: 2.0 },
        }),
      });
      const data = await res.json();
      if (data.audioContent) {
        const audio = new Audio('data:audio/mp3;base64,' + data.audioContent); window._curAudio = audio;
        $('avatarWrap').classList.add('talking');
        audio.onended = () => { $('avatarWrap').classList.remove('talking'); cb && cb(); };
        audio.play();
        return;
      }
    } catch (e) { console.warn('Cloud TTS failed, falling back to device voice', e); }
  }
  // Fallback: device's built-in voice
  synth.cancel(); synth.resume();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 1.1; u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  if (hiVoice) u.voice = hiVoice;
  $('avatarWrap').classList.add('talking');
  u.onend = () => { $('avatarWrap').classList.remove('talking'); cb && cb(); };
  synth.speak(u);
}

let recognition = null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SR) {
  recognition = new SR();
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; recognition.interimResults = false;
  recognition.onresult = e => { const t = e.results[0][0].transcript; userSay(t); };
  recognition.onend = () => $('btnMic').classList.remove('rec');
  recognition.onerror = e => {
    console.error('Speech recognition error:', e.error);
    if (e.error === 'not-allowed') alert('Microphone permission denied. Please allow mic access in your browser.');
    else if (e.error === 'language-not-supported' && recognition.lang !== 'en-IN') { recognition.lang = 'en-IN'; try { recognition.start(); } catch (err) {} }
    else if (e.error === 'no-speech') { /* ignore, timeout */ }
    else alert('Mic error: ' + e.error + '. Try typing instead (💬 button).');
  };
} else {
  console.warn('SpeechRecognition not supported in this browser.');
}
$('btnMic').onclick = () => { primeAudio();
  if (!recognition) return alert('Voice input is not supported in this browser. Please use Chrome (desktop/Android) and type instead (💬).');
  if ($('btnMic').classList.contains('rec')) { try { recognition.stop(); } catch (e) {} $('btnMic').classList.remove('rec'); return; }
  try { recognition.start(); $('btnMic').classList.add('rec'); } catch (e) { console.error(e); }
};
$('btnSend').onclick = () => { primeAudio(); const t = $('textInput').value.trim(); if (t) { userSay(t); $('textInput').value = ''; } };
$('textInput').onkeydown = e => { if (e.key === 'Enter') $('btnSend').click(); };
$('btnUpload').onclick = () => $('fileInput').click();
$('fileInput').onchange = e => {
  if (!e.target.files[0]) return;
  chatAppend('me', '📷 [Uploaded a problem photo]');
  speak("बहुत अच्छा! मैं आपकी समस्या देख पा रहा हूँ। यह किस विषय के बारे में है — प्रकाश संश्लेषण, जल चक्र, भाग, सौरमंडल, बल और गति, या कोशिका विभाजन?");
  awaitingAnswer = true;
};
$('btnEnd').onclick = () => { synth.cancel(); try{recognition && recognition.stop();}catch(e){} var au=document.querySelector('audio'); if(window._curAudio){try{window._curAudio.pause();}catch(e){}} };

// ---------- CHAT ----------
function chatAppend(who, text) {
  const tr=$('transcript'); if(tr && tr.firstElementChild && tr.firstElementChild.classList.contains('muted')) tr.innerHTML=''; tr.insertAdjacentHTML('beforeend', `<div><b>${who==='ai'?'Naruto':(student?student.name:'You')}:</b> ${text}</div>`); tr.scrollTop = tr.scrollHeight;
}
function userSay(text) { chatAppend('me', text); handleUser(text.toLowerCase()); }

// ---------- SESSIONS ----------
function startSession(m) {
  mode = m;
  chatHistory = [];
  
  $('boardBody').innerHTML = DIAGRAMS.default;
  $('boardTitle').textContent = 'Whiteboard';
  moveAvatar('center');
  currentTopic = null; awaitingAnswer = false;
  if (m === 'live') {
    speak(lang === 'hi' ? `नमस्ते ${student.name}! मैं आपका दोस्त नारुतो हूँ। आज क्या सीखेंगे?` : `Hello ${student.name}! I'm your friend Naruto. What shall we learn today?`);
  } else {
    revisionQueue = [...weakTopics]; revisionIdx = 0;
    if (!revisionQueue.length) { speak('दोहराने के लिए कोई विषय नहीं है। बहुत बढ़िया!'); return; }
    speak(`रिवीजन में आपका स्वागत है, ${student.name}! आज हम ${revisionQueue.length} कठिन विषयों को दोहराएँगे। शुरू करते हैं "${revisionQueue[0]}" से।`, () => teachTopic(revisionQueue[0], true));
  }
}

function moveAvatar(dir) {
  const w = $('avatarWrap');
  w.classList.remove('left', 'right');
  w.classList.add('left');
}

function teachTopic(key, isRevision) {
  const ex = EXPLANATIONS[key];
  if (!ex) { speak(`चलो ${key} के बारे में बात करते हैं। यह एक महत्वपूर्ण विषय है। क्या तुम मुझे बता सकते हो कि तुम इसे कितना याद करते हो?`); awaitingAnswer = true; return; }
  currentTopic = key;
  moveAvatar(Math.random() > .5 ? 'left' : 'right');
  $('boardTitle').textContent = key;
  $('boardBody').innerHTML = DIAGRAMS[ex.diag] || DIAGRAMS.default;
  stepSequence(key);
  speak(ex.text, () => {
    if (isRevision) {
      speak("क्या अब यह साफ़ है, या मैं इसे दूसरे तरीके से समझाऊँ?");
      awaitingAnswer = true; currentTopic = 'rev:' + key;
    } else {
      speak(ex.question);
      awaitingAnswer = true;
    }
  });
}

// ---------- GEMINI BRAIN ----------
let chatHistory = [];
const MODELS_TO_TRY = ['gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];
async function geminiAsk(userText) {
  const weak = weakTopics.join(', ') || 'none';
  const systemPrompt = `You are "Naruto", a friendly Indian school teacher for kids. Student: ${student.name}, Class ${student.cls}, age ${student.age}. Always reply in simple ${lang === 'hi' ? 'HINDI' : 'ENGLISH'}, 2-4 short sentences. Teach the topic step by step, then ask ONE question to check understanding. If the student is confused, end with a tag like [WEAK:TopicName]. Weak topics so far: ${weak}.`;
  let lastErr = '';
  for (const model of MODELS_TO_TRY) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...chatHistory, { role: 'user', parts: [{ text: userText }] }],
        }),
      });
      const data = await res.json();
      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) { lastErr = JSON.stringify(data?.error || data); console.error('Gemini error:', data); continue; }
      // commit history only on success
      chatHistory.push({ role: 'user', parts: [{ text: userText }] }, { role: 'model', parts: [{ text: reply }] });
      if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);
      const m = reply.match(/\[WEAK:(.+?)\]/);
      if (m) { const topic = m[1].trim(); if (!weakTopics.includes(topic)) weakTopics.push(topic); saveWeak(); reply = reply.replace(/\[WEAK:.+?\]/g, ''); }
      return reply;
    } catch (e) { lastErr = e.message; console.error('Gemini fetch failed:', e); }
  }
  console.error('All Gemini models failed. Last error:', lastErr);
  return 'माफ़ करना, मुझे थोड़ा समय लग रहा है। एक बार फिर कहिए?';
}

function renderSaved() {
  const el = $('savedList'); if (!el) return;
  el.innerHTML = savedIllustrations.map((s, i) => `
    <li style="display:flex;align-items:center;gap:8px;margin:6px 0;">
      <div style="width:70px;height:50px;border:1px dashed #ddd;border-radius:8px;overflow:hidden;flex-shrink:0;">${s.svg.replace('<svg', '<svg style="width:100%;height:100%;"')}</div>
      <span style="flex:1;font-size:13px;">${s.topic.slice(0, 40)}</span>
      <button class="btn small" onclick="downloadIllustration(${i})">⬇ Save</button>
    </li>`).join('');
  $('savedEmpty').style.display = savedIllustrations.length ? 'none' : 'block';
}
window.downloadIllustration = i => {
  const it = savedIllustrations[i]; if (!it) return;
  let svgFixed = it.svg.replace('<svg', '<svg width="800" height="520"'); if (!/xmlns=/.test(svgFixed)) svgFixed = svgFixed.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const svgBlob = new Blob([svgFixed], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = (it.topic.replace(/[^a-z0-9]+/gi, '_').slice(0, 30) || 'illustration') + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };
  img.onerror = () => {
    // fallback: save raw SVG
    const a = document.createElement('a'); a.href = url;
    a.download = (it.topic.replace(/[^a-z0-9]+/gi, '_').slice(0, 30) || 'illustration') + '.svg';
    document.body.appendChild(a); a.click(); a.remove();
  };
  img.src = url;
};
function saveIllustration(topic, svg) {
  savedIllustrations.push({ topic, svg, at: Date.now() });
  if (savedIllustrations.length > 20) savedIllustrations.shift();
  try { localStorage.setItem('at_saved', JSON.stringify(savedIllustrations)); } catch (e) {}
  renderSaved();
}

function handleUser(t) {
  if (mode === 'revision') {
    if (/(clear|yes|understood|got it|haan|samajh)/.test(t) && !/not/.test(t)) {
      const key = revisionQueue[revisionIdx];
      weakTopics = weakTopics.filter(w => w !== key); saveWeak();
      speak(`बहुत बढ़िया, ${student.name}! "${key}" अब क्लियर है। 🎉`, () => nextRevision());
      return;
    }
  }
  geminiAsk(t).then(reply => {
    speak(reply);
    illustrationFlow(t, reply);
  });
}

// ---------- AI SVG ILLUSTRATION FLOW ----------
async function illustrationFlow(question, answer) {
  try {
    $('boardTitle').textContent = question;
    $('boardBody').innerHTML = '<div style="padding:40px;text-align:center;color:#888">🎨 Naruto is drawing…</div>';
    let data = null;
    for (const model of MODELS_TO_TRY) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `Create a simple, colorful educational diagram as SVG code for this answer: "${answer}". The SVG must have viewBox="0 0 400 260", a white background, simple shapes, emoji/text labels in Hindi, and nothing outside the <svg> tag. Reply with ONLY the SVG code, no markdown, no explanation.` }] }] }),
      });
      const d = await r.json();
      if (!d.error) { data = d; break; }
      console.warn(model + ' failed:', d.error?.message);
    }
    if (!data) throw new Error('all models busy');
    console.log('Gemini SVG response:', JSON.stringify(data).slice(0, 500));
    let txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let m = txt.match(/<svg[\s\S]*<\/svg>/);
    if (!m) m = (data?.candidates?.[0]?.content?.parts?.map(p => p.inlineData ? '' : (p.text || '')).join('') || '').match(/<svg[\s\S]*<\/svg>/);
    if (!m) throw new Error('no svg found in: ' + JSON.stringify(data).slice(0, 200));
    $('boardBody').innerHTML = m[0];
    saveIllustration(question, m[0]);
    moveAvatar(Math.random() > .5 ? 'left' : 'right');
  } catch (e) {
    console.error('SVG generation failed:', e);
    const key = detectTopic(question);
    if (key && PARTS[key]) stepSequence(key);
    else $('boardBody').innerHTML = DIAGRAMS.default;
  }
}

function findDiagram(t) {
  const key = detectTopic(t);
  if (key && EXPLANATIONS[key]) {
    stepSequence(key);
  }
}

function nextRevision() {
  revisionIdx++;
  if (revisionIdx >= revisionQueue.length) {
    speak(`रिवीजन पूरा हुआ, ${student.name}! तुम बहुत अच्छा कर रहे हो। 🌟`);
    weakTopics = weakTopics.filter(w => revisionQueue.slice(revisionIdx).includes(w)); saveWeak();
    return;
  }
  speak(`चलो अगले विषय पर चलते हैं: "${revisionQueue[revisionIdx]}"।`, () => teachTopic(revisionQueue[revisionIdx], true));
}

const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

let words = [];
let tab = 'quiz';
let stats = {};
try { stats = JSON.parse(localStorage.getItem('stats') || '{}'); } catch { /* storage unavailable */ }
const saveStats = () => { try { localStorage.setItem('stats', JSON.stringify(stats)); } catch { /* ignore */ } };
const record = (rank, ok) => { const s = stats[rank] ||= { c: 0, w: 0 }; ok ? s.c++ : s.w++; saveStats(); };

/* ---------- audio ---------- */
const player = new Audio();
function speak(word) {
  player.pause();
  player.src = `audio/${word.rank}.mp3`;
  player.currentTime = 0;
  player.play().catch(() => {});
}
const label = w => (w.gender ? `<span class="gender">${w.gender}</span>` : '') + esc(w.danish);
const speakBtn = w => `<button class="speak" data-speak="${w.rank}" title="Listen" aria-label="Listen">🔊</button>`;
app.addEventListener('click', e => {
  const b = e.target.closest('[data-speak]');
  if (b) { e.stopPropagation(); speak(words.find(w => w.rank == b.dataset.speak)); }
}, true);

/* ---------- quiz ---------- */
const cfg = { count: 10, dir: 'da-en', range: 300 };
let quiz = null;
let timer = null;

function renderSetup() {
  app.innerHTML = `
    <div class="center" style="margin:8px 0 20px">
      <h2>Ordforråd-quiz</h2>
      <div class="muted">Hear it, read it, pick the meaning. Words are ordered by how often Danes say them.</div>
    </div>
    <div class="panel">
      <label>Questions</label>
      <select id="count">${[5, 10, 20, 50].map(n => `<option ${n === cfg.count ? 'selected' : ''}>${n}</option>`).join('')}</select>
      <label>Direction</label>
      <select id="dir">
        <option value="da-en" ${cfg.dir === 'da-en' ? 'selected' : ''}>Danish ➔ English (recognition)</option>
        <option value="en-da" ${cfg.dir === 'en-da' ? 'selected' : ''}>English ➔ Danish (production)</option>
        <option value="mixed" ${cfg.dir === 'mixed' ? 'selected' : ''}>Mixed</option>
      </select>
      <label>Vocabulary range</label>
      <select id="range">${[100, 300, words.length].map(n => `<option value="${n}" ${n === cfg.range ? 'selected' : ''}>Top ${n} words</option>`).join('')}</select>
      <button class="primary" id="start">Start quiz</button>
    </div>`;
  document.getElementById('start').onclick = () => {
    cfg.count = +document.getElementById('count').value;
    cfg.dir = document.getElementById('dir').value;
    cfg.range = +document.getElementById('range').value;
    startQuiz();
  };
}

function makeOptions(word, pool) {
  // Distractors: same part of speech when possible, never a duplicate translation.
  const ok = w => w.rank !== word.rank && w.short !== word.short && w.short.length <= 40;
  let cands = shuffle(pool.filter(w => ok(w) && w.pos === word.pos));
  if (cands.length < 3) cands = cands.concat(shuffle(pool.filter(w => ok(w) && w.pos !== word.pos)));
  const picked = [];
  for (const c of cands) {
    if (picked.length === 3) break;
    if (!picked.some(p => p.short === c.short)) picked.push(c);
  }
  return shuffle([word, ...picked]);
}

function startQuiz() {
  const pool = words.slice(0, cfg.range);
  const chosen = shuffle(pool.slice()).slice(0, cfg.count);
  quiz = {
    qs: chosen.map(w => ({
      word: w,
      daToEn: cfg.dir === 'mixed' ? Math.random() < .5 : cfg.dir === 'da-en',
      options: makeOptions(w, pool),
    })),
    i: 0, correct: 0, streak: 0, missed: [], answered: false, picked: null, busy: false,
  };
  renderQuestion();
}

const KEYS = { ArrowUp: 0, 1: 0, w: 0, W: 0, ArrowLeft: 1, 2: 1, a: 1, A: 1, ArrowRight: 2, 3: 2, d: 2, D: 2, ArrowDown: 3, 4: 3, s: 3, S: 3 };
const ARROWS = ['↑', '←', '→', '↓'];
const AREAS = ['top', 'left', 'right', 'bottom'];

function renderQuestion(fade) {
  const q = quiz.qs[quiz.i];
  const w = q.word;
  const optText = o => q.daToEn ? esc(o.short) : label(o);
  quiz.answered = false; quiz.picked = null;
  app.innerHTML = `
    <div class="qhead">
      <span class="num"><b>Question ${quiz.i + 1}</b> <span class="muted">of ${quiz.qs.length}</span></span>
      ${quiz.streak > 1 ? `<span class="streak num">🔥 ${quiz.streak} in a row</span>` : ''}
    </div>
    <div class="bar"><div style="width:${(quiz.i + 1) * 100 / quiz.qs.length}%"></div></div>
    <div class="stage ${fade ? 'out' : ''}" id="stage">
      <div class="panel"><div class="compass">
        ${q.options.map((o, k) => `<button class="opt ${AREAS[k]}" data-k="${k}"><span class="key">${ARROWS[k]}</span><span>${optText(o)}</span></button>`).join('')}
        <div class="mid">
          <div class="prompt">${q.daToEn ? 'What does it mean?' : 'How do you say it in Danish?'}</div>
          <div class="big">${q.daToEn ? label(w) : esc(w.short)}${q.daToEn ? speakBtn(w) : ''}</div>
          <div class="pos">${esc(w.pos)}</div>
          <div class="verdict" id="verdict"></div>
        </div>
      </div></div>
    </div>
    <div class="hint">Arrow keys, WASD or 1–4 to answer · any key skips the pause</div>`;
  if (fade) requestAnimationFrame(() => document.getElementById('stage').classList.remove('out'));
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(+b.dataset.k));
  if (q.daToEn) speak(w);
}

function answer(k) {
  const q = quiz.qs[quiz.i];
  if (quiz.answered || quiz.busy) return;
  quiz.answered = true;
  const w = q.word;
  const ok = q.options[k].rank === w.rank;
  record(w.rank, ok);
  if (ok) { quiz.correct++; quiz.streak++; }
  else { quiz.streak = 0; if (!quiz.missed.includes(w)) quiz.missed.push(w); }
  app.querySelectorAll('.opt').forEach((b, idx) => {
    b.disabled = true;
    if (q.options[idx].rank === w.rank) b.classList.add('correct');
    else if (idx === k) b.classList.add('wrong');
    else b.classList.add('dim');
  });
  const v = document.getElementById('verdict');
  v.className = 'verdict ' + (ok ? 'ok' : 'bad');
  v.textContent = ok ? 'Korrekt!' : 'Not quite';
  if (!q.daToEn) speak(w);
  clearTimeout(timer);
  timer = setTimeout(advance, ok ? 700 : 1500);
}

function advance() {
  clearTimeout(timer);
  if (!quiz.answered || quiz.busy) return;
  quiz.busy = true;
  const stage = document.getElementById('stage');
  stage.classList.add('out');
  setTimeout(() => {
    quiz.busy = false;
    if (quiz.i < quiz.qs.length - 1) { quiz.i++; renderQuestion(true); }
    else renderResults();
  }, 130);
}

function renderResults() {
  const n = quiz.qs.length, pct = Math.round(quiz.correct * 100 / n);
  const msg = pct === 100 ? 'Perfekt! 🌟' : pct >= 80 ? 'Rigtig godt!' : pct >= 60 ? 'Godt forsøg. Keep practising.' : 'Keep going: repetition works.';
  app.innerHTML = `
    <div class="panel center">
      <h2>${msg}</h2>
      <div class="score num">${quiz.correct}<span class="muted" style="font-size:1.5rem"> / ${n}</span></div>
      <div class="muted num">${pct}% accuracy</div>
      ${quiz.missed.length ? `<div class="missed"><b>Words to review (${quiz.missed.length})</b>
        ${quiz.missed.map(w => `<div class="row"><span><b>${label(w)}</b> <span class="muted">${esc(w.short)}</span></span>${speakBtn(w)}</div>`).join('')}</div>` : ''}
      <div class="btns">
        <button class="primary" id="again">Play again</button>
        <button class="ghost" id="setup">New settings</button>
      </div>
    </div>`;
  document.getElementById('again').onclick = startQuiz;
  document.getElementById('setup').onclick = () => { quiz = null; renderSetup(); };
}

document.addEventListener('keydown', e => {
  if (tab !== 'quiz' || !quiz || !document.getElementById('stage')) return;
  if (quiz.answered) { advance(); return; }
  const k = KEYS[e.key];
  if (k !== undefined) { e.preventDefault(); answer(k); }
});

/* ---------- cards ---------- */
let ci = 0, flipped = false;
function renderCards() {
  const w = words[ci % words.length];
  const forms = [...new Set(w.forms.map(f => f.form))].slice(0, 6).join(', ');
  app.innerHTML = `
    <div class="panel card center" id="card">
      <div class="muted num">#${w.rank} of ${words.length}</div>
      <div class="big">${label(w)}${speakBtn(w)}</div>
      <div class="muted">${esc(w.pos)}${w.ipa ? ' · ' + esc(w.ipa) : ''}</div>
      ${flipped ? `<ul>${w.english.map(e => `<li>${esc(e)}</li>`).join('')}</ul>${forms ? `<div class="forms">${esc(forms)}</div>` : ''}`
                : '<p class="muted" style="margin-top:60px">tap to reveal</p>'}
    </div>
    <div class="row2"><button class="ghost" id="prev">← Previous</button><button class="ghost" id="next">Next →</button></div>`;
  document.getElementById('card').onclick = () => { flipped = !flipped; renderCards(); };
  document.getElementById('prev').onclick = () => { ci = (ci - 1 + words.length) % words.length; flipped = false; renderCards(); };
  document.getElementById('next').onclick = () => { ci++; flipped = false; renderCards(); };
}

/* ---------- shell ---------- */
function show(t) {
  tab = t; clearTimeout(timer);
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
  if (t === 'quiz') { quiz = null; renderSetup(); } else renderCards();
}
document.querySelectorAll('.tab').forEach(b => b.onclick = () => show(b.dataset.tab));
fetch('words.json').then(r => r.json()).then(d => { words = d; show('quiz'); });

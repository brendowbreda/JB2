/* =========================================================
   Palpite Club — demo app logic
   Virtual points only. No real money, no real payments.
   All data is stored locally in the browser (localStorage).
========================================================= */

const USERS_KEY = 'pc_users_v1';
const SESSION_KEY = 'pc_session_v1';
const STATE_PREFIX = 'pc_state_v1_';
const WHATSAPP_NUMBER = '5511999999999';

const ANIMALS = [
  { g: 1, name: 'Avestruz', emoji: '🦤' },
  { g: 2, name: 'Águia', emoji: '🦅' },
  { g: 3, name: 'Burro', emoji: '🫏' },
  { g: 4, name: 'Borboleta', emoji: '🦋' },
  { g: 5, name: 'Cachorro', emoji: '🐶' },
  { g: 6, name: 'Cabra', emoji: '🐐' },
  { g: 7, name: 'Carneiro', emoji: '🐏' },
  { g: 8, name: 'Camelo', emoji: '🐫' },
  { g: 9, name: 'Cobra', emoji: '🐍' },
  { g: 10, name: 'Coelho', emoji: '🐰' },
  { g: 11, name: 'Cavalo', emoji: '🐴' },
  { g: 12, name: 'Elefante', emoji: '🐘' },
  { g: 13, name: 'Galo', emoji: '🐓' },
  { g: 14, name: 'Gato', emoji: '🐱' },
  { g: 15, name: 'Jacaré', emoji: '🐊' },
  { g: 16, name: 'Leão', emoji: '🦁' },
  { g: 17, name: 'Macaco', emoji: '🐵' },
  { g: 18, name: 'Porco', emoji: '🐷' },
  { g: 19, name: 'Pavão', emoji: '🦚' },
  { g: 20, name: 'Peru', emoji: '🦃' },
  { g: 21, name: 'Touro', emoji: '🐂' },
  { g: 22, name: 'Tigre', emoji: '🐯' },
  { g: 23, name: 'Urso', emoji: '🐻' },
  { g: 24, name: 'Veado', emoji: '🦌' },
  { g: 25, name: 'Vaca', emoji: '🐄' },
];

const DRAW_TIMES = [
  { id: 'ptm', label: 'PTM — 10:00' },
  { id: 'pt', label: 'PT — 12:00' },
  { id: 'ptv', label: 'PTV — 15:00' },
  { id: 'ptn', label: 'PTN — 18:00' },
  { id: 'coruja', label: 'Coruja — 21:00' },
];

const TIERS = [
  { id: 'quartzo', name: 'Quartzo', icon: '🤍', min: 0, max: 999, label: 'Iniciante' },
  { id: 'ametista', name: 'Ametista', icon: '🟣', min: 1000, max: 2499, label: 'Jogador' },
  { id: 'esmeralda', name: 'Esmeralda', icon: '💚', min: 2500, max: 4999, label: 'Profissional' },
  { id: 'diamante', name: 'Diamante', icon: '💎', min: 5000, max: Infinity, label: 'Elite' },
];

const ACHIEVEMENTS = [
  { id: 'primeira-aposta', name: 'Primeira Aposta', emoji: '🎯', desc: 'Faça sua primeira aposta.' },
  { id: 'corujao', name: 'Corujão', emoji: '🦉', desc: 'Aposte depois das 22h.' },
  { id: 'amizade', name: 'Amizade', emoji: '🤝', desc: 'Adicione seu primeiro amigo.' },
  { id: 'na-mosca', name: 'Na Mosca', emoji: '🏹', desc: 'Ganhe 5 apostas.' },
  { id: 'criatura-da-noite', name: 'Criatura da Noite', emoji: '🌙', desc: 'Aposte entre 00h e 4h.' },
  { id: 'festa-dos-amigos', name: 'Festa dos Amigos', emoji: '🎉', desc: 'Tenha 5 amigos.' },
  { id: 'missao-cumprida', name: 'Missão Cumprida', emoji: '✅', desc: 'Complete sua primeira missão do dia.' },
  { id: 'semana-perfeita', name: 'Semana Perfeita', emoji: '🔥', desc: 'Mantenha 10 semanas de ofensiva seguidas.' },
  { id: 'manha-da-sorte', name: 'Manhã da Sorte', emoji: '☀️', desc: 'Ganhe uma aposta pela manhã (6h–12h).' },
  { id: 'sorte-da-tarde', name: 'Sorte da Tarde', emoji: '🌤️', desc: 'Ganhe uma aposta à tarde (12h–18h).' },
  { id: 'coruja-sortuda', name: 'Coruja Sortuda', emoji: '🦉', desc: 'Ganhe uma aposta à noite (18h–24h).' },
  { id: 'nao-tem-erro', name: 'Não Tem Erro', emoji: '🍀', desc: 'Ganhe ao menos 1 vez por semana, 4 semanas seguidas.' },
];

const MODALITY = {
  grupo: { label: 'Grupo', mult: 18 },
  dezena: { label: 'Dezena', mult: 60 },
};

/* ---------------- storage helpers ---------------- */
function loadUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession() { return localStorage.getItem(SESSION_KEY); }
function setSession(email) { localStorage.setItem(SESSION_KEY, email); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
function stateKey(email) { return STATE_PREFIX + email; }
function loadState(email) { return JSON.parse(localStorage.getItem(stateKey(email)) || 'null'); }
function saveState() { if (CURRENT_EMAIL) localStorage.setItem(stateKey(CURRENT_EMAIL), JSON.stringify(STATE)); }

function freshState() {
  return {
    points: 100,
    totalWagered: 0,
    totalBets: 0,
    totalWins: 0,
    bets: [],
    weeks: {},
    streak: 0,
    bestStreak: 0,
    cashbackWeeksClaimed: [],
    achievements: {},
    friends: [],
    notifications: [
      { id: uid(), text: 'Bem-vindo ao Palpite Club! Você ganhou 100 pontos de boas-vindas 🎉', at: nowIso(), read: false },
    ],
    feed: [],
    missionDoneToday: false,
    lastMissionDate: null,
    createdAt: nowIso(),
  };
}

/* ---------------- demo directory (other users) ---------------- */
const DEMO_PEOPLE = [
  { email: 'ana@demo.com', name: 'Ana Ribeiro', avatar: '🦁' },
  { email: 'bruno@demo.com', name: 'Bruno Alves', avatar: '🐯' },
  { email: 'carla@demo.com', name: 'Carla Souza', avatar: '🦊' },
  { email: 'diego@demo.com', name: 'Diego Martins', avatar: '🐻' },
  { email: 'elis@demo.com', name: 'Elis Nunes', avatar: '🐵' },
  { email: 'felipe@demo.com', name: 'Felipe Costa', avatar: '🐺' },
  { email: 'gabi@demo.com', name: 'Gabi Torres', avatar: '🐨' },
  { email: 'hugo@demo.com', name: 'Hugo Lima', avatar: '🐸' },
];

/* ---------------- utils ---------------- */
function uid() { return Math.random().toString(36).slice(2, 10); }
function nowIso() { return new Date().toISOString(); }
function pad2(n) { return String(n).padStart(2, '0'); }
function fmtDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}
function fmtPoints(n) { return Math.round(n).toLocaleString('pt-BR'); }
function weekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return date.getUTCFullYear() + '-W' + pad2(week);
}
function startOfWeek(d = new Date()) {
  const day = (d.getDay() + 6) % 7;
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - day);
  return s;
}
function dezenasFor(group) {
  const base = (group - 1) * 4;
  return [1, 2, 3, 4].map((k) => pad2((base + k) % 100));
}
function animalByGroup(g) { return ANIMALS.find((a) => a.g === g); }
function tierFor(totalWagered) { return TIERS.find((t) => totalWagered >= t.min && totalWagered <= t.max) || TIERS[0]; }
function nextTier(tier) {
  const idx = TIERS.findIndex((t) => t.id === tier.id);
  return TIERS[idx + 1] || null;
}

function toast(msg) {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------------- router ---------------- */
let SCREEN_STACK = ['s-home'];
function go(id, opts = {}) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (!opts.noStack) SCREEN_STACK.push(id);
  window.scrollTo(0, 0);
  Render.onNavigate(id);
}

const Modal = {
  open(id) {
    document.getElementById(id).classList.add('open');
    document.getElementById(id + 'Backdrop')?.classList.add('open');
  },
  close(id) {
    document.getElementById(id).classList.remove('open');
    document.getElementById(id + 'Backdrop')?.classList.remove('open');
  },
};

const Menu = {
  open() { document.getElementById('drawer').classList.add('open'); document.getElementById('drawerOverlay').classList.add('open'); Render.drawer(); },
  close() { document.getElementById('drawer').classList.remove('open'); document.getElementById('drawerOverlay').classList.remove('open'); },
  goTo(id) { this.close(); go(id); },
  openMinhasApostas() { this.close(); go('s-apostas'); Apostas.showTab('aguardando'); },
  backToPrevious() {
    SCREEN_STACK.pop();
    const prev = SCREEN_STACK.pop() || 's-home';
    go(prev);
  },
  downloadApp() { this.close(); Modal.open('appModal'); },
};

/* ---------------- Auth ---------------- */
let CURRENT_EMAIL = null;
let STATE = null;

var RegWizard = {
  currentStep: 1,
  maskCpf(el) {
    var v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    el.value = v;
  },
  maskDate(el) {
    var v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    el.value = v;
  },
  maskPhone(el) {
    var v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    el.value = v;
  },
  validateCpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    for (var t = 9; t < 11; t++) {
      var d = 0;
      for (var c = 0; c < t; c++) d += parseInt(cpf.charAt(c)) * ((t + 1) - c);
      d = ((10 * d) % 11) % 10;
      if (parseInt(cpf.charAt(t)) !== d) return false;
    }
    return true;
  },
  showStep(n) {
    this.currentStep = n;
    for (var i = 1; i <= 4; i++) document.getElementById('regStep' + i).hidden = (i !== n);
  },
  back() {
    if (this.currentStep <= 1) go('s-landing');
    else this.showStep(this.currentStep - 1);
  },
  next(step) {
    var err = document.getElementById('regError' + step);
    err.hidden = true;
    if (step === 1) {
      var cpf = document.getElementById('regCpf').value;
      if (!this.validateCpf(cpf)) { err.textContent = 'CPF inválido. Verifique e tente novamente.'; err.hidden = false; return; }
      this.showStep(2);
    } else if (step === 2) {
      var name = document.getElementById('regName').value.trim();
      var birth = document.getElementById('regBirth').value.trim();
      if (!name) { err.textContent = 'Informe seu nome completo.'; err.hidden = false; return; }
      if (birth.length < 10) { err.textContent = 'Informe sua data de nascimento.'; err.hidden = false; return; }
      var parts = birth.split('/');
      var bDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      var age = Math.floor((Date.now() - bDate.getTime()) / 31557600000);
      if (age < 18) { err.textContent = 'Você precisa ter 18 anos ou mais.'; err.hidden = false; return; }
      this.showStep(3);
    } else if (step === 3) {
      var phone = (document.getElementById('regPhone').value || '').replace(/\D/g, '');
      var email = (document.getElementById('regEmail').value || '').trim();
      if (!phone && !email) { err.textContent = 'Informe pelo menos um contato (WhatsApp ou e-mail).'; err.hidden = false; return; }
      this.showStep(4);
    }
  },
  toggleEye(id, btn) {
    var inp = document.getElementById(id);
    if (inp.type === 'password') { inp.type = 'text'; btn.textContent = 'Ocultar'; }
    else { inp.type = 'password'; btn.textContent = 'Mostrar'; }
  },
  finish() {
    var pw = document.getElementById('regPassword').value;
    var pw2 = document.getElementById('regPasswordConfirm').value;
    var err = document.getElementById('regError4');
    err.hidden = true;
    if (pw.length < 6) { err.textContent = 'A senha precisa ter no mínimo 6 caracteres.'; err.hidden = false; return; }
    if (pw !== pw2) { err.textContent = 'As senhas não coincidem.'; err.hidden = false; return; }
    var cpf = document.getElementById('regCpf').value.replace(/\D/g, '');
    var name = document.getElementById('regName').value.trim();
    var birth = document.getElementById('regBirth').value.trim();
    var phone = (document.getElementById('regPhone').value || '').trim();
    var email = (document.getElementById('regEmail').value || '').trim().toLowerCase();
    var key = email || cpf;
    var users = loadUsers();
    if (users[key]) { err.textContent = 'Já existe uma conta com esse cadastro.'; err.hidden = false; return; }
    users[key] = { name: name, email: email, phone: phone, cpf: cpf, birth: birth, password: pw, createdAt: nowIso() };
    saveUsers(users);
    CURRENT_EMAIL = key;
    STATE = freshState();
    saveState();
    setSession(key);
    App.enter();
  },
  reset() {
    this.showStep(1);
    ['regCpf','regName','regBirth','regPhone','regEmail','regPassword','regPasswordConfirm'].forEach(function(id) {
      var el = document.getElementById(id); if (el) el.value = '';
    });
    for (var i = 1; i <= 4; i++) { var e = document.getElementById('regError' + i); if (e) e.hidden = true; }
  }
};

const Auth = {
  register() {
    RegWizard.finish();
  },
  login() {
    const input = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    err.hidden = true;
    const users = loadUsers();
    let key = input;
    let u = users[key];
    if (!u) {
      const cpfDigits = input.replace(/\D/g, '');
      if (cpfDigits.length === 11) {
        const found = Object.entries(users).find(([k, v]) => v.cpf === cpfDigits);
        if (found) { key = found[0]; u = found[1]; }
      }
    }
    if (!u || u.password !== password) { err.textContent = 'E-mail/CPF ou senha incorretos.'; err.hidden = false; return; }
    CURRENT_EMAIL = key;
    STATE = loadState(key) || freshState();
    saveState();
    setSession(key);
    App.enter();
  },
  demoLogin() {
    const email = 'demo@palpiteclub.com';
    const users = loadUsers();
    if (!users[email]) {
      users[email] = { name: 'Rafa Demo', email, phone: '(11) 90000-0000', password: 'demo', createdAt: nowIso() };
      saveUsers(users);
    }
    CURRENT_EMAIL = email;
    let existing = loadState(email);
    if (!existing) { existing = Seed.demoState(); }
    STATE = existing;
    saveState();
    setSession(email);
    App.enter();
  },
  logout() {
    Menu.close();
    clearSession();
    CURRENT_EMAIL = null;
    STATE = null;
    SCREEN_STACK = ['s-landing'];
    go('s-landing', { noStack: true });
  },
};

/* ---------------- seed demo data ---------------- */
const Seed = {
  demoState() {
    const s = freshState();
    s.points = 640;
    s.totalWagered = 1850;
    s.totalBets = 14;
    s.totalWins = 5;
    const today = new Date();
    for (let i = 9; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 7);
      s.weeks[weekKey(d)] = true;
    }
    s.weeks[weekKey(today)] = true;
    s.streak = 10;
    s.bestStreak = 10;
    s.achievements = {
      'primeira-aposta': { at: nowIso() },
      'amizade': { at: nowIso() },
      'na-mosca': { at: nowIso() },
      'festa-dos-amigos': { at: nowIso() },
      'semana-perfeita': { at: nowIso() },
      'missao-cumprida': { at: nowIso() },
    };
    s.friends = DEMO_PEOPLE.slice(0, 5).map((p) => ({ ...p }));
    s.feed = [
      { id: uid(), from: 'Ana Ribeiro', avatar: '🦁', text: 'apostou no Leão 🦁 (Grupo 16) — 50 pts', at: nowIso() },
      { id: uid(), from: 'Bruno Alves', avatar: '🐯', text: 'ganhou 900 pts apostando na Vaca 🐄!', at: nowIso() },
      { id: uid(), from: 'Carla Souza', avatar: '🦊', text: 'convidou você para um bolão no Peru 🦃', at: nowIso() },
    ];
    const animal = animalByGroup(16);
    for (let i = 0; i < 6; i++) {
      const won = i % 3 === 0;
      const placedAt = new Date(today); placedAt.setDate(placedAt.getDate() - i * 3);
      s.bets.push({
        id: uid(), animal, modality: 'grupo', dezena: null,
        amount: 50, horario: DRAW_TIMES[i % DRAW_TIMES.length].label,
        placedAt: placedAt.toISOString(), resolveAt: placedAt.toISOString(),
        status: won ? 'ganhou' : 'perdeu', payout: won ? 900 : 0,
      });
    }
    return s;
  },
};

/* ---------------- streak logic ---------------- */
const Streak = {
  markThisWeek() {
    STATE.weeks[weekKey()] = true;
    this.recompute();
  },
  recompute() {
    let count = 0;
    let cursor = new Date();
    while (true) {
      const wk = weekKey(cursor);
      if (STATE.weeks[wk]) { count++; cursor.setDate(cursor.getDate() - 7); }
      else if (wk === weekKey()) { cursor.setDate(cursor.getDate() - 7); continue; }
      else break;
    }
    STATE.streak = count;
    STATE.bestStreak = Math.max(STATE.bestStreak || 0, count);
  },
  weekDots() {
    const dots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      dots.push({ filled: !!STATE.weeks[weekKey(d)], isCurrent: i === 0 });
    }
    return dots;
  },
};

/* ---------------- achievements ---------------- */
const Achv = {
  unlock(id) {
    if (STATE.achievements[id]) return;
    STATE.achievements[id] = { at: nowIso() };
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    saveState();
    document.getElementById('achvModalIcon').textContent = def.emoji;
    document.getElementById('achvModalName').textContent = def.name;
    document.getElementById('achvModalDesc').textContent = def.desc;
    Modal.open('achvModal');
  },
  checkAll(context = {}) {
    const s = STATE;
    if (s.totalBets >= 1) this.unlock('primeira-aposta');
    if (s.friends.length >= 1) this.unlock('amizade');
    if (s.friends.length >= 5) this.unlock('festa-dos-amigos');
    if (s.totalWins >= 5) this.unlock('na-mosca');
    if (s.streak >= 10) this.unlock('semana-perfeita');
    if (s.missionDoneToday) this.unlock('missao-cumprida');

    if (context.betPlacedAt) {
      const h = new Date(context.betPlacedAt).getHours();
      if (h >= 22 || h < 0) this.unlock('corujao');
      if (h >= 0 && h < 4) this.unlock('criatura-da-noite');
    }
    if (context.wonAt) {
      const h = new Date(context.wonAt).getHours();
      if (h >= 6 && h < 12) this.unlock('manha-da-sorte');
      else if (h >= 12 && h < 18) this.unlock('sorte-da-tarde');
      else if (h >= 18 && h < 24) this.unlock('coruja-sortuda');
    }
    // Não Tem Erro: won at least once a week for 4 straight weeks
    const weekly = {};
    s.bets.filter((b) => b.status === 'ganhou').forEach((b) => {
      weekly[weekKey(new Date(b.placedAt))] = true;
    });
    let streakWin = 0, cursor = new Date();
    while (true) {
      const wk = weekKey(cursor);
      if (weekly[wk]) { streakWin++; cursor.setDate(cursor.getDate() - 7); }
      else break;
    }
    if (streakWin >= 4) this.unlock('nao-tem-erro');
  },
};

/* ---------------- bet flow ---------------- */
const Bet = {
  draft: {},
  start() {
    this.draft = {};
    go('s-jogar-bicho');
  },
  pickAnimal(g) {
    this.draft.animal = animalByGroup(g);
    go('s-jogar-modalidade');
  },
  pickModalidade(mod) {
    this.draft.modality = mod;
    if (mod === 'dezena') go('s-jogar-dezena');
    else go('s-jogar-horario');
  },
  pickDezena(dz) {
    this.draft.dezena = dz;
    go('s-jogar-horario');
  },
  pickHorario(h) {
    this.draft.horario = h;
    go('s-jogar-valor');
  },
  review() {
    const custom = document.getElementById('betCustomAmount').value;
    const amount = Number(custom) || this.draft.amount || 0;
    if (!amount || amount <= 0) { toast('Escolha um valor válido.'); return; }
    if (amount > STATE.points) { toast('Saldo insuficiente. Deposite mais pontos.'); return; }
    this.draft.amount = amount;
    go('s-jogar-confirmar');
  },
  confirm() {
    const d = this.draft;
    const mult = MODALITY[d.modality].mult;
    const placedAt = nowIso();
    const bet = {
      id: uid(),
      animal: d.animal,
      modality: d.modality,
      dezena: d.dezena || null,
      amount: d.amount,
      horario: d.horario,
      placedAt,
      resolveAt: new Date(Date.now() + 25000 + Math.random() * 20000).toISOString(),
      status: 'aguardando',
      payout: d.amount * mult,
    };
    STATE.points -= d.amount;
    STATE.totalWagered += d.amount;
    STATE.totalBets += 1;
    STATE.bets.unshift(bet);
    Streak.markThisWeek();
    STATE.missionDoneToday = true;
    saveState();
    Achv.checkAll({ betPlacedAt: placedAt });
    const modalidadeTxt = d.dezena ? `dezena ${d.dezena}` : 'grupo';
    document.getElementById('successText').textContent =
      `Você apostou 🪙 ${fmtPoints(d.amount)} pts no ${d.animal.emoji} ${d.animal.name} (${modalidadeTxt}). Boa sorte!`;
    Bet.lastId = bet.id;
    go('s-jogar-sucesso');
    Render.home();
  },
  shareLast() {
    const b = STATE.bets.find((x) => x.id === Bet.lastId);
    if (!b) return;
    STATE.feed.unshift({
      id: uid(), from: 'Você', avatar: STATE.avatar || '🦊',
      text: `apostou no ${b.animal.emoji} ${b.animal.name} (${MODALITY[b.modality].label}) — ${fmtPoints(b.amount)} pts`,
      at: nowIso(),
    });
    saveState();
    toast('Palpite compartilhado com seus amigos! 📣');
  },
};

/* ---------------- resolve pending bets ---------------- */
function resolveDueBets() {
  if (!STATE) return;
  const now = Date.now();
  let changed = false;
  STATE.bets.forEach((b) => {
    if (b.status === 'aguardando' && new Date(b.resolveAt).getTime() <= now) {
      const won = Math.random() < 0.33;
      b.status = won ? 'ganhou' : 'perdeu';
      changed = true;
      if (won) {
        STATE.points += b.payout;
        STATE.totalWins += 1;
        toast(`🎉 Você ganhou 🪙 ${fmtPoints(b.payout)} pts no ${b.animal.emoji} ${b.animal.name}!`);
        Achv.checkAll({ wonAt: nowIso() });
      } else {
        toast(`😕 Não foi dessa vez no ${b.animal.emoji} ${b.animal.name}.`);
      }
      STATE.notifications.unshift({
        id: uid(),
        text: won ? `Você ganhou no ${b.animal.name}! +${fmtPoints(b.payout)} pts` : `Resultado saiu: você não ganhou no ${b.animal.name}.`,
        at: nowIso(), read: false,
      });
    }
  });
  if (changed) { Achv.checkAll({}); saveState(); Render.onNavigate(currentScreenId()); }
}
function currentScreenId() {
  const active = document.querySelector('.screen.active');
  return active ? active.id : 's-home';
}

/* ---------------- wallet ---------------- */
const DEPOSIT_PRESETS = [100, 300, 500];
const Wallet = {
  deposit() {
    const custom = document.getElementById('depositCustom').value;
    const amount = Number(custom) || Wallet.selectedAmount || 0;
    if (!amount || amount <= 0) { toast('Escolha um valor.'); return; }
    let bonus = 0;
    if (STATE.streak >= 4) {
      bonus = Math.round(amount * 0.10);
    }
    STATE.points += amount + bonus;
    saveState();
    if (bonus > 0) toast(`Depósito de 🪙${fmtPoints(amount)} + cashback de 🎁${fmtPoints(bonus)} pts!`);
    else toast(`Depósito de 🪙 ${fmtPoints(amount)} pts realizado!`);
    document.getElementById('depositCustom').value = '';
    go('s-carteira');
    Render.carteira();
    Render.home();
  },
  withdraw() {
    const val = Number(document.getElementById('sacarValor').value);
    if (!val || val <= 0) { toast('Digite um valor válido.'); return; }
    if (val > STATE.points) { toast('Saldo insuficiente.'); return; }
    STATE.points -= val;
    saveState();
    toast(`Saque de 🪙 ${fmtPoints(val)} pts confirmado.`);
    document.getElementById('sacarValor').value = '';
    go('s-carteira');
    Render.carteira();
    Render.home();
  },
};

/* ---------------- apostas tabs ---------------- */
const Apostas = {
  currentTab: 'aguardando',
  showTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('#s-apostas .tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
    Render.apostas();
  },
};

/* ---------------- amigos ---------------- */
const Amigos = {
  currentTab: 'feed',
  showTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('#s-amigos .tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('amigosFeedPane').hidden = tab !== 'feed';
    document.getElementById('amigosListPane').hidden = tab !== 'amigos';
    Render.amigos();
  },
  search() {
    Render.buscaAmigos();
  },
  add(email) {
    if (STATE.friends.find((f) => f.email === email)) return;
    const p = DEMO_PEOPLE.find((x) => x.email === email);
    if (!p) return;
    STATE.friends.push({ ...p });
    STATE.feed.unshift({ id: uid(), from: p.name, avatar: p.avatar, text: 'agora é seu amigo no Palpite Club!', at: nowIso() });
    saveState();
    Achv.checkAll({});
    toast(`Você adicionou ${p.name} 🤝`);
    Render.buscaAmigos();
  },
};

/* ---------------- account ---------------- */
const Account = {
  save() {
    const name = document.getElementById('contaNome').value.trim();
    const phone = document.getElementById('contaTelefone').value.trim();
    if (!name) { toast('Informe seu nome.'); return; }
    const users = loadUsers();
    users[CURRENT_EMAIL].name = name;
    users[CURRENT_EMAIL].phone = phone;
    saveUsers(users);
    toast('Dados atualizados!');
    Render.topbars();
  },
  confirmDelete() { Modal.open('deleteModal'); },
  deleteConfirmed() {
    const users = loadUsers();
    delete users[CURRENT_EMAIL];
    saveUsers(users);
    localStorage.removeItem(stateKey(CURRENT_EMAIL));
    Modal.close('deleteModal');
    Auth.logout();
  },
};

/* ---------------- render ---------------- */
const Render = {
  onNavigate(id) {
    this.topbars();
    if (id === 's-home') this.home();
    else if (id === 's-notificacoes') this.notificacoes();
    else if (id === 's-conta') this.conta();
    else if (id === 's-carteira') this.carteira();
    else if (id === 's-depositar') this.depositar();
    else if (id === 's-sacar') this.sacar();
    else if (id === 's-resultados') this.resultados();
    else if (id === 's-apostas') this.apostas();
    else if (id === 's-jogar-bicho') this.animalGrid();
    else if (id === 's-jogar-dezena') this.dezenaGrid();
    else if (id === 's-jogar-horario') this.horarioList();
    else if (id === 's-jogar-valor') this.betValor();
    else if (id === 's-jogar-confirmar') this.betConfirm();
    else if (id === 's-perfil') this.perfil();
    else if (id === 's-conquistas') this.conquistas();
    else if (id === 's-amigos') this.amigos();
    else if (id === 's-adicionar-amigos') this.buscaAmigos();
    else if (id === 's-register') RegWizard.reset();
    else if (id === 's-suporte') this.suporte();
  },
  topbars() {
    if (!STATE) return;
    const users = loadUsers();
    const u = users[CURRENT_EMAIL] || { name: 'Você' };
    const tier = tierFor(STATE.totalWagered);
    ['homeName', 'drawerName'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = u.name; });
    ['homeBalance', 'drawerBalance', 'carteiraSaldo', 'sacarSaldo'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = fmtPoints(STATE.points); });
    const tierChip = document.getElementById('homeTierChip');
    if (tierChip) tierChip.textContent = `${tier.icon} ${tier.name}`;
    const unread = STATE.notifications.filter((n) => !n.read).length;
    const badge = document.getElementById('menuNotifBadge');
    if (badge) { badge.hidden = unread === 0; badge.textContent = unread; }
    document.getElementById('whatsappBtn')?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Preciso de ajuda no Palpite Club.')}`);
  },
  home() {
    if (!STATE) return;
    document.getElementById('streakCount').textContent = `${STATE.streak} ${STATE.streak === 1 ? 'semana' : 'semanas'}`;
    const dots = Streak.weekDots();
    document.getElementById('weekDots').innerHTML = dots.map((d) => `<div class="week-dot ${d.filled ? 'filled' : ''} ${d.isCurrent ? 'today' : ''}"></div>`).join('');
    const hint = document.getElementById('streakHint');
    hint.textContent = STATE.weeks[weekKey()]
      ? 'Você já apostou essa semana. Ofensiva garantida! 🔥'
      : 'Aposte essa semana para manter sua ofensiva viva.';
    document.getElementById('cashbackBanner').hidden = STATE.streak < 4;

    const results = document.getElementById('homeResultsPreview');
    const recentResolved = STATE.bets.filter((b) => b.status !== 'aguardando').slice(0, 3);
    results.innerHTML = recentResolved.length
      ? recentResolved.map((b) => resultRowHtml(b)).join('')
      : `<p class="muted-note">Nenhum resultado ainda. Faça sua primeira aposta!</p>`;

    const feed = document.getElementById('homeFeedPreview');
    feed.innerHTML = STATE.feed.slice(0, 2).map((f) => feedRowHtml(f)).join('') || `<p class="muted-note">Adicione amigos para ver os palpites deles aqui.</p>`;
  },
  notificacoes() {
    const list = document.getElementById('notifList');
    STATE.notifications.forEach((n) => (n.read = true));
    saveState();
    list.innerHTML = STATE.notifications.length
      ? STATE.notifications.map((n) => `
        <div class="list-row"><span class="list-row-icon">🔔</span>
          <div class="list-row-body"><strong>${n.text}</strong><p>${fmtDateTime(n.at)}</p></div>
        </div>`).join('')
      : emptyState('🔔', 'Sem notificações', 'Avisamos aqui quando seus resultados saírem.');
    this.topbars();
  },
  conta() {
    const u = loadUsers()[CURRENT_EMAIL];
    document.getElementById('contaNome').value = u.name;
    document.getElementById('contaEmail').value = u.email;
    document.getElementById('contaTelefone').value = u.phone || '';
  },
  carteira() {
    const list = document.getElementById('extratoList');
    const rows = [];
    STATE.bets.forEach((b) => {
      rows.push({ at: b.placedAt, html: listRow('🎯', `Aposta — ${b.animal.name}`, fmtDateTime(b.placedAt), `-${fmtPoints(b.amount)}`, 'neg') });
      if (b.status === 'ganhou') rows.push({ at: b.resolveAt, html: listRow('🏆', `Prêmio — ${b.animal.name}`, fmtDateTime(b.resolveAt), `+${fmtPoints(b.payout)}`, 'pos') });
    });
    rows.sort((a, c) => new Date(c.at) - new Date(a.at));
    list.innerHTML = rows.length ? rows.map((r) => r.html).join('') : emptyState('👛', 'Sem transações', 'Deposite pontos para começar a jogar.');
  },
  depositar() {
    const grid = document.getElementById('depositAmounts');
    grid.innerHTML = DEPOSIT_PRESETS.map((v) => `<div class="amount-tile" onclick="Render.selectDeposit(${v}, this)">🪙 ${v}</div>`).join('');
    Wallet.selectedAmount = null;
  },
  selectDeposit(v, el) {
    document.querySelectorAll('#depositAmounts .amount-tile').forEach((t) => t.classList.remove('selected'));
    el.classList.add('selected');
    Wallet.selectedAmount = v;
    document.getElementById('depositCustom').value = '';
  },
  sacar() {},
  resultados() {
    const list = document.getElementById('resultadosList');
    const resolved = STATE.bets.filter((b) => b.status !== 'aguardando');
    list.innerHTML = resolved.length ? resolved.map((b) => resultRowHtml(b)).join('') : emptyState('🎲', 'Ainda sem sorteios', 'Faça uma aposta para ver os resultados aqui.');
  },
  apostas() {
    const tab = Apostas.currentTab;
    const map = { aguardando: 'aguardando', ganhou: 'ganhou', perdeu: 'perdeu' };
    const filtered = STATE.bets.filter((b) => b.status === map[tab]);
    const list = document.getElementById('apostasList');
    list.innerHTML = filtered.length ? filtered.map((b) => betRowHtml(b)).join('') : emptyState(
      tab === 'aguardando' ? '⏳' : tab === 'ganhou' ? '🏆' : '📭',
      tab === 'aguardando' ? 'Nenhuma aposta pendente' : tab === 'ganhou' ? 'Ainda sem vitórias' : 'Nenhuma aposta perdida',
      'Suas apostas aparecem aqui.'
    );
  },
  animalGrid() {
    const grid = document.getElementById('animalGrid');
    grid.innerHTML = ANIMALS.map((a) => `
      <div class="animal-tile" onclick="Bet.pickAnimal(${a.g})">
        <span class="emoji">${a.emoji}</span>
        <span class="name">${a.name}</span>
        <span class="grp">Grupo ${pad2(a.g)}</span>
      </div>`).join('');
  },
  dezenaGrid() {
    const grid = document.getElementById('dezenaGrid');
    const dzs = dezenasFor(Bet.draft.animal.g);
    grid.innerHTML = dzs.map((dz) => `<div class="dezena-tile" onclick="Bet.pickDezena('${dz}')">${dz}</div>`).join('');
  },
  horarioList() {
    const list = document.getElementById('horarioList');
    list.innerHTML = DRAW_TIMES.map((h) => `
      <button class="pick-row" onclick="Bet.pickHorario('${h.label}')">
        <div><strong>${h.label}</strong></div><span class="row-link-arrow">›</span>
      </button>`).join('');
  },
  betValor() {
    const d = Bet.draft;
    document.getElementById('betSummaryCard').innerHTML = `
      <div class="bet-summary-row"><span>Bicho</span><strong>${d.animal.emoji} ${d.animal.name}</strong></div>
      <div class="bet-summary-row"><span>Modalidade</span><strong>${MODALITY[d.modality].label}${d.dezena ? ' — ' + d.dezena : ''}</strong></div>
      <div class="bet-summary-row"><span>Sorteio</span><strong>${d.horario || '—'}</strong></div>`;
    const grid = document.getElementById('betAmounts');
    grid.innerHTML = [20, 50, 100].map((v) => `<div class="amount-tile" onclick="Render.selectBetAmount(${v}, this)">🪙 ${v}</div>`).join('');
    document.getElementById('betCustomAmount').value = '';
  },
  selectBetAmount(v, el) {
    document.querySelectorAll('#betAmounts .amount-tile').forEach((t) => t.classList.remove('selected'));
    el.classList.add('selected');
    Bet.draft.amount = v;
  },
  betConfirm() {
    const d = Bet.draft;
    const mult = MODALITY[d.modality].mult;
    document.getElementById('betConfirmCard').innerHTML = `
      <div class="bet-summary-row"><span>Bicho</span><strong>${d.animal.emoji} ${d.animal.name}</strong></div>
      <div class="bet-summary-row"><span>Modalidade</span><strong>${MODALITY[d.modality].label}${d.dezena ? ' — ' + d.dezena : ''}</strong></div>
      <div class="bet-summary-row"><span>Sorteio</span><strong>${d.horario}</strong></div>
      <div class="bet-summary-row"><span>Valor apostado</span><strong>🪙 ${fmtPoints(d.amount)}</strong></div>
      <div class="bet-summary-row total"><span>Prêmio se ganhar</span><strong>🪙 ${fmtPoints(d.amount * mult)}</strong></div>`;
  },
  perfil() {
    const u = loadUsers()[CURRENT_EMAIL];
    document.getElementById('perfilNome').textContent = u.name;
    const tier = tierFor(STATE.totalWagered);
    document.getElementById('perfilTierChip').textContent = `${tier.icon} ${tier.name} · ${tier.label}`;
    const next = nextTier(tier);
    const bar = document.getElementById('tierProgressBar');
    const label = document.getElementById('tierProgressLabel');
    if (next) {
      const span = next.min - tier.min;
      const prog = Math.min(100, Math.round(((STATE.totalWagered - tier.min) / span) * 100));
      bar.style.width = prog + '%';
      label.textContent = `${fmtPoints(next.min - STATE.totalWagered)} pts apostados para virar ${next.icon} ${next.name}`;
    } else {
      bar.style.width = '100%';
      label.textContent = 'Você atingiu a pedra máxima! 💎';
    }
    document.getElementById('statSemanas').textContent = STATE.streak;
    document.getElementById('statApostas').textContent = STATE.totalBets;
    document.getElementById('statSeguindo').textContent = STATE.friends.length;
    document.getElementById('statSeguidores').textContent = Math.max(STATE.friends.length, Math.round(STATE.friends.length * 1.4));
    const preview = document.getElementById('perfilAchvPreview');
    const unlocked = ACHIEVEMENTS.filter((a) => STATE.achievements[a.id]).slice(0, 4);
    preview.innerHTML = (unlocked.length ? unlocked : ACHIEVEMENTS.slice(0, 4)).map((a) => achvTileHtml(a, !!STATE.achievements[a.id])).join('');
  },
  conquistas() {
    const unlockedCount = ACHIEVEMENTS.filter((a) => STATE.achievements[a.id]).length;
    document.getElementById('conquistasProgress').textContent = `${unlockedCount} de ${ACHIEVEMENTS.length} conquistas desbloqueadas`;
    document.getElementById('achvGrid').innerHTML = ACHIEVEMENTS.map((a) => achvTileHtml(a, !!STATE.achievements[a.id])).join('');
  },
  amigos() {
    document.getElementById('amigosFeedPane').innerHTML = STATE.feed.length
      ? STATE.feed.map((f) => feedRowHtml(f)).join('')
      : emptyState('📣', 'Feed vazio', 'Adicione amigos para ver os palpites deles.');
    document.getElementById('amigosListPane').innerHTML = STATE.friends.length
      ? STATE.friends.map((f) => `
        <div class="list-row friend-row">
          <span class="avatar">${f.avatar}</span>
          <div class="list-row-body"><strong>${f.name}</strong></div>
          <button class="follow-btn following">Seguindo</button>
        </div>`).join('')
      : emptyState('🤝', 'Sem amigos ainda', 'Toque no + para adicionar amigos.');
  },
  buscaAmigos() {
    const q = (document.getElementById('buscaAmigos')?.value || '').toLowerCase();
    const list = document.getElementById('buscaAmigosList');
    const results = DEMO_PEOPLE.filter((p) => p.name.toLowerCase().includes(q));
    list.innerHTML = results.map((p) => {
      const isFriend = STATE.friends.find((f) => f.email === p.email);
      return `<div class="list-row friend-row">
        <span class="avatar">${p.avatar}</span>
        <div class="list-row-body"><strong>${p.name}</strong></div>
        <button class="follow-btn ${isFriend ? 'following' : ''}" onclick="Amigos.add('${p.email}')">${isFriend ? 'Seguindo' : 'Seguir'}</button>
      </div>`;
    }).join('');
  },
  suporte() { this.topbars(); },
  drawer() { this.topbars(); },
};

function listRow(icon, title, sub, right, sign) {
  return `<div class="list-row"><span class="list-row-icon">${icon}</span>
    <div class="list-row-body"><strong>${title}</strong><p>${sub}</p></div>
    <div class="list-row-right amount-${sign}">🪙 ${right}</div></div>`;
}
function resultRowHtml(b) {
  const cls = b.status === 'ganhou' ? 'win' : 'lose';
  return `<div class="list-row">
    <span class="list-row-icon">${b.animal.emoji}</span>
    <div class="list-row-body"><strong>${b.animal.name} · ${MODALITY[b.modality].label}${b.dezena ? ' ' + b.dezena : ''}</strong><p>${b.horario} · ${fmtDateTime(b.resolveAt)}</p></div>
    <span class="status-badge ${cls}">${b.status === 'ganhou' ? 'Ganhou' : 'Perdeu'}</span>
  </div>`;
}
function betRowHtml(b) {
  const cls = b.status === 'aguardando' ? 'wait' : b.status === 'ganhou' ? 'win' : 'lose';
  const label = b.status === 'aguardando' ? 'Aguardando' : b.status === 'ganhou' ? 'Ganhou' : 'Perdeu';
  return `<div class="list-row">
    <span class="list-row-icon">${b.animal.emoji}</span>
    <div class="list-row-body"><strong>${b.animal.name} · ${MODALITY[b.modality].label}${b.dezena ? ' ' + b.dezena : ''}</strong><p>🪙 ${fmtPoints(b.amount)} · ${b.horario}</p></div>
    <span class="status-badge ${cls}">${label}</span>
  </div>`;
}
function feedRowHtml(f) {
  return `<div class="list-row">
    <span class="avatar">${f.avatar}</span>
    <div class="list-row-body"><strong>${f.from}</strong><p>${f.text}</p></div>
  </div>`;
}
function achvTileHtml(a, unlocked) {
  return `<div class="achv-tile ${unlocked ? '' : 'locked'}" title="${a.desc}">
    <span class="emoji">${a.emoji}</span>
    <span class="name">${a.name}</span>
  </div>`;
}
function emptyState(emoji, title, sub) {
  return `<div class="empty-state"><div class="mascot">${emoji}</div><strong>${title}</strong><p>${sub}</p></div>`;
}

/* ---------------- boot ---------------- */
const App = {
  enter() {
    Streak.recompute();
    saveState();
    SCREEN_STACK = ['s-home'];
    go('s-home', { noStack: true });
  },
  init() {
    const session = getSession();
    if (session) {
      const users = loadUsers();
      if (users[session]) {
        CURRENT_EMAIL = session;
        STATE = loadState(session) || freshState();
        Streak.recompute();
        saveState();
        SCREEN_STACK = ['s-home'];
        go('s-home', { noStack: true });
      } else {
        clearSession();
        go('s-landing', { noStack: true });
      }
    } else {
      go('s-landing', { noStack: true });
    }
    setInterval(resolveDueBets, 4000);
  },
};

window.addEventListener('scroll', function() {
  var landing = document.getElementById('s-landing');
  var sticky = document.getElementById('landingSticky');
  var ctas = document.getElementById('landingCtas');
  if (!landing || !landing.classList.contains('active') || !ctas || !sticky) {
    if (sticky) sticky.hidden = true;
    return;
  }
  sticky.hidden = ctas.getBoundingClientRect().bottom > 0;
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => App.init());

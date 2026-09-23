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

const COTACOES = [
  {
    id: 'milhar', name: 'Milhar', mult: '8.000x', accent: 'green',
    desc: 'Você escolhe 4 números seguidos, de 0000 a 9999. Se esses 4 números saírem exatamente iguais e na mesma ordem no sorteio, você ganha! É a aposta que mais paga, mas também a mais difícil de acertar.',
    example: 'Exemplo: você joga no 3218. Você só ganha se sair 3218 certinho no sorteio — 3219 ou 8321 não valem, tem que ser exatamente 3218.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '8.000x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '2.666,67x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '1.600x' },
    ]
  },
  {
    id: 'milhar-centena', name: 'Milhar e Centena', mult: '4.400x', accent: 'green',
    desc: 'É a Milhar e a Centena jogadas juntas, num bilhete só. Você escolhe 4 números, e sua aposta é dividida ao meio: metade tenta a milhar, metade tenta a centena.',
    example: 'Exemplo: você joga no 3218. Se sair 3218 certinho, você ganha as duas: o prêmio da milhar E o da centena juntos. Se só os 3 últimos números baterem (sair algo terminando em 218), você ainda ganha o prêmio da centena.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '4.400x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '1.466,67x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '880x' },
    ]
  },
  {
    id: 'milhar-invertida', name: 'Milhar Invertida', mult: '333,33x', accent: 'green',
    desc: 'É como a Milhar, mas aqui a ordem não importa! Você escolhe 4 números e ganha se eles saírem juntos no sorteio, em qualquer ordem — não precisa ser exatamente na sequência que você escolheu.',
    example: 'Exemplo: você escolhe 3, 2, 1 e 8. Se sair 3218, 8321, 1832 ou qualquer outra ordem desses mesmos 4 números, você ganha.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '333,33x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '111,11x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '66,67x' },
    ]
  },
  {
    id: 'centena', name: 'Centena', mult: '800x', accent: 'green',
    desc: 'Você escolhe 3 números seguidos, de 000 a 999. Você ganha se o sorteio terminar exatamente com esses 3 números, na mesma ordem.',
    example: 'Exemplo: você joga no 482. Se sair 5.482 no sorteio, você ganha — porque termina em 482, do jeitinho que você escolheu.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '800x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '266,67x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '160x' },
    ]
  },
  {
    id: 'centena-invertida', name: 'Centena Invertida', mult: '66,67x', accent: 'green',
    desc: 'É como a Centena, mas aqui a ordem não importa! Você escolhe 3 números e ganha se eles aparecerem juntos no final do sorteio, em qualquer ordem.',
    example: 'Exemplo: você escolhe 4, 8 e 2. Se o sorteio terminar em 482, 824, 248 ou qualquer outra ordem desses 3 números, você ganha.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '66,67x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '22,22x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '13,33x' },
    ]
  },
  {
    id: 'dezena', name: 'Dezena', mult: '80x', accent: 'green',
    desc: 'Você escolhe 2 números seguidos, de 00 a 99. Você ganha se o sorteio terminar exatamente com esses 2 números, na mesma ordem.',
    example: 'Exemplo: você joga no 82. Se sair 5.482 no sorteio, você ganha — porque termina em 82, do jeitinho que você escolheu.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '80x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '26,67x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '16x' },
    ]
  },
  {
    id: 'dezena-invertida', name: 'Dezena Invertida', mult: '13,33x', accent: 'green',
    desc: 'É como a Dezena, mas aqui a ordem não importa! Você escolhe 2 números e ganha se eles aparecerem juntos no final do sorteio, em qualquer ordem.',
    example: 'Exemplo: você escolhe 8 e 2. Se o sorteio terminar em 82 ou em 28, você ganha do mesmo jeito.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '13,33x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '4,44x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '2,67x' },
    ]
  },
  {
    id: 'grupo', name: 'Grupo', mult: '20x', accent: 'gold',
    desc: 'Existem 25 bichos (Avestruz, Águia, Burro, Borboleta, Cachorro...) e cada um deles "dono" de 4 dezenas. Você escolhe um bicho e torce pra uma dessas 4 dezenas aparecer no final do sorteio.',
    example: 'Exemplo: o Cachorro é dono das dezenas 17, 18, 19 e 20. Se sair 5.418 no sorteio (termina em 18), você ganha, porque 18 é uma das dezenas do Cachorro.',
    tiers: [
      { label: '1º Prêmio', sub: 'Jogar na cabeça: vale só o primeiro resultado.', value: '20x' },
      { label: '1º ao 3º', sub: 'Seu palpite vale do 1º ao 3º resultado.', value: '6,67x' },
      { label: '1º ao 5º', sub: 'Seu palpite vale do 1º ao 5º resultado.', value: '4x' },
    ]
  },
  {
    id: 'duque-grupo', name: 'Duque de Grupo', mult: '66,66x', accent: 'green',
    desc: 'Escolha 2 bichos diferentes. Você ganha se os dois aparecerem entre os prêmios sorteados, em qualquer ordem e em prêmios diferentes. Essa modalidade não tem 1º prêmio — só paga do 1º ao 3º ou do 1º ao 5º.',
    example: 'Exemplo: você escolhe Cachorro e Leão. Se o Cachorro sair no 2º prêmio e o Leão no 5º, você ganha na faixa "1º ao 5º".',
    tiers: [
      { label: '1º ao 3º', sub: 'Seus 2 bichos precisam sair entre o 1º e o 3º prêmio.', value: '66,66x' },
      { label: '1º ao 5º', sub: 'Seus 2 bichos precisam sair entre o 1º e o 5º prêmio.', value: '20x' },
    ]
  },
  {
    id: 'terno-grupo', name: 'Terno de Grupo', mult: '1.500x', accent: 'green',
    desc: 'Escolha 3 bichos diferentes. Você ganha se os três aparecerem entre os prêmios sorteados, em qualquer ordem e em prêmios diferentes. Essa modalidade também não tem 1º prêmio — só paga do 1º ao 3º ou do 1º ao 5º.',
    example: 'Exemplo: você escolhe Cachorro, Leão e Vaca. Se os três saírem entre o 1º e o 5º prêmio, você ganha na faixa "1º ao 5º".',
    tiers: [
      { label: '1º ao 3º', sub: 'Seus 3 bichos precisam sair entre o 1º e o 3º prêmio — os únicos 3 sorteados.', value: '1.500x' },
      { label: '1º ao 5º', sub: 'Seus 3 bichos precisam sair entre o 1º e o 5º prêmio.', value: '150x' },
    ]
  },
];

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
    const cpfRaw = document.getElementById('loginCpf').value.replace(/\D/g, '');
    const password = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    err.hidden = true;
    if (cpfRaw.length !== 11) { err.textContent = 'Informe um CPF válido.'; err.hidden = false; return; }
    const users = loadUsers();
    let key = null, u = null;
    const found = Object.entries(users).find(([k, v]) => v.cpf === cpfRaw);
    if (found) { key = found[0]; u = found[1]; }
    if (!u || u.password !== password) { err.textContent = 'CPF ou senha incorretos.'; err.hidden = false; return; }
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
  editing: null,
  editField(field) {
    if (this.editing === field) {
      this.saveField(field);
      return;
    }
    if (this.editing) this.cancelEdit(this.editing);
    this.editing = field;
    const display = document.getElementById(field === 'email' ? 'contaEmailDisplay' : 'contaTelDisplay');
    const input = document.getElementById(field === 'email' ? 'contaEmailInput' : 'contaTelInput');
    const btn = document.getElementById(field === 'email' ? 'contaEmailBtn' : 'contaTelBtn');
    const u = loadUsers()[CURRENT_EMAIL];
    input.value = field === 'email' ? (u.email || '') : (u.phone || '');
    display.style.display = 'none';
    input.style.display = 'block';
    input.focus();
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  },
  cancelEdit(field) {
    const display = document.getElementById(field === 'email' ? 'contaEmailDisplay' : 'contaTelDisplay');
    const input = document.getElementById(field === 'email' ? 'contaEmailInput' : 'contaTelInput');
    const btn = document.getElementById(field === 'email' ? 'contaEmailBtn' : 'contaTelBtn');
    display.style.display = 'block';
    input.style.display = 'none';
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
    this.editing = null;
  },
  saveField(field) {
    const input = document.getElementById(field === 'email' ? 'contaEmailInput' : 'contaTelInput');
    const val = input.value.trim();
    const users = loadUsers();
    if (field === 'email') users[CURRENT_EMAIL].email = val || users[CURRENT_EMAIL].email;
    else users[CURRENT_EMAIL].phone = val;
    saveUsers(users);
    this.cancelEdit(field);
    Render.conta();
    toast('Dados atualizados!');
  },
  confirmDelete() {
    const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    const el = document.getElementById('deleteModalSaldo');
    if (el) el.textContent = fmtBRL(STATE.points);
    const ap = document.getElementById('deleteModalApostas');
    if (ap) ap.textContent = STATE.bets.filter(b => b.status === 'pendente').length;
    Modal.open('deleteModal');
  },
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
    else if (id === 's-cotacoes') this.cotacoes();
    else if (id === 's-register') RegWizard.reset();
    else if (id === 's-suporte') this.suporte();
  },
  topbars() {
    if (!STATE) return;
    const users = loadUsers();
    const u = users[CURRENT_EMAIL] || { name: 'Você' };
    const tier = tierFor(STATE.totalWagered);
    const initials = u.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
    ['homeName', 'drawerName'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = u.name; });
    ['homeAvatar', 'drawerAvatar', 'perfilAvatar'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = initials; });
    const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    ['homeBalance', 'drawerBalance'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = fmtBRL(STATE.points); });
    ['carteiraSaldo', 'sacarSaldo'].forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = fmtPoints(STATE.points); });
    const tierChip = document.getElementById('homeTierChip');
    if (tierChip) tierChip.textContent = `${tier.icon} ${tier.name}`;
    const unread = STATE.notifications.filter((n) => !n.read).length;
    const badge = document.getElementById('menuNotifBadge');
    if (badge) { badge.hidden = unread === 0; badge.textContent = unread; }
    document.getElementById('whatsappBtn')?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Preciso de ajuda no Palpite Club.')}`);
  },
  home() {
    if (!STATE) return;
    document.getElementById('streakCount').textContent = STATE.streak;
    const betsEl = document.getElementById('homeTotalBets');
    if (betsEl) betsEl.textContent = STATE.totalBets;
    const rewardEl = document.getElementById('streakReward');
    if (rewardEl) {
      const s = STATE.streak;
      const next5 = Math.ceil((s + 1) / 5) * 5;
      const prize = next5 % 10 === 0 ? 'R$ 100' : 'R$ 50';
      rewardEl.textContent = `${next5 - s} sem. p/ ${prize}`;
    }

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
    const el = (id) => document.getElementById(id);
    if (el('contaNomeDisplay')) el('contaNomeDisplay').textContent = u.name.toUpperCase();
    if (el('contaNascDisplay')) el('contaNascDisplay').textContent = u.birth || '—';
    if (el('contaCpfDisplay')) el('contaCpfDisplay').textContent = u.cpf ? u.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '—';
    if (el('contaEmailDisplay')) el('contaEmailDisplay').textContent = (u.email || '—').toUpperCase();
    if (el('contaTelDisplay')) el('contaTelDisplay').textContent = u.phone || '—';
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
    const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    document.getElementById('perfilNome').textContent = u.name;
    const saldo = document.getElementById('perfilSaldo');
    if (saldo) saldo.textContent = fmtBRL(STATE.points);
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
    const amigosCount = document.getElementById('statAmigosCount');
    if (amigosCount) amigosCount.textContent = STATE.friends.length;
    const amigosList = document.getElementById('perfilAmigosList');
    if (amigosList) {
      if (STATE.friends.length) {
        amigosList.innerHTML = STATE.friends.map(f => {
          const ini = f.name.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase();
          const first = f.name.split(' ')[0];
          return `<div class="perfil-amigo-item" onclick="go('s-amigos')"><div class="avatar avatar-initials">${ini}</div><span>${first}</span></div>`;
        }).join('');
      } else {
        amigosList.innerHTML = '<p style="font-size:12px;color:var(--ink-faint);margin:4px 0;">Nenhum amigo ainda.</p>';
      }
    }
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
  cotacoes() {
    var list = document.getElementById('cotList');
    list.innerHTML = COTACOES.map(function(c) {
      var isGold = c.accent === 'gold';
      var tiersHtml = c.tiers.map(function(t) {
        return '<div class="cot-tier"><div><div class="cot-tier-label">' + t.label + '</div><div class="cot-tier-sub">' + t.sub + '</div></div><div class="cot-tier-value">' + t.value + '</div></div>';
      }).join('');
      return '<div class="cot-card' + (isGold ? ' gold' : '') + '">' +
        '<div class="cot-card-header"><div><h3 class="cot-card-title">' + c.name + '</h3><div class="cot-card-mult">' + c.mult + '</div></div>' +
        '<button class="cot-jogar" onclick="go(\'s-register\')">&#9654; JOGAR</button></div>' +
        '<button class="cot-toggle" onclick="Cotacoes.toggle(this)">Entenda como jogar <span class="cot-toggle-arrow">&#9650;</span></button>' +
        '<div class="cot-details" id="cot-' + c.id + '">' +
        '<p class="cot-desc">' + c.desc + '</p>' +
        '<p class="cot-example">' + c.example + '</p>' +
        '<div class="cot-tiers">' + tiersHtml + '</div></div></div>';
    }).join('');
  },
  suporte() { this.topbars(); },
  drawer() { this.topbars(); },
};

var ROLETA_ANIMALS = [
  { file: '01-avestruz.png', name: 'Avestruz' },
  { file: '02-aguia.png', name: 'Águia' },
  { file: '03-burro.png', name: 'Burro' },
  { file: '04-borboleta.png', name: 'Borboleta' },
  { file: '05-cachorro.png', name: 'Cachorro' },
  { file: '06-cabra.png', name: 'Cabra' },
  { file: '07-carneiro.png', name: 'Carneiro' },
  { file: '08-camelo.png', name: 'Camelo' },
  { file: '09-cobra.png', name: 'Cobra' },
  { file: '10-coelho.png', name: 'Coelho' },
  { file: '11-cavalo.png', name: 'Cavalo' },
  { file: '12-elefante.png', name: 'Elefante' },
  { file: '13-galo.png', name: 'Galo' },
  { file: '14-gato.png', name: 'Gato' },
  { file: '15-jacare.png', name: 'Jacaré' },
  { file: '16-leao.png', name: 'Leão' },
  { file: '17-macaco.png', name: 'Macaco' },
  { file: '18-porco.png', name: 'Porco' },
  { file: '19-pavao.png', name: 'Pavão' },
  { file: '20-peru.png', name: 'Peru' },
  { file: '21-touro.png', name: 'Touro' },
  { file: '22-tigre.png', name: 'Tigre' },
  { file: '23-urso.png', name: 'Urso' },
  { file: '24-veado.png', name: 'Veado' },
  { file: '25-vaca.png', name: 'Vaca' },
  { file: null, name: 'Giro Grátis', free: true },
];

var Roleta = {
  valor: 1,
  mult: 18,
  spinning: false,
  freeSpinsLeft: 0,
  selectedAnimal: 0,
  pickOffset: 0,
  init: function() {
    this.buildPicker();
    this.initPickerSwipe();
    this.buildWheel();
    this.updateValor();
    var self = this;
    requestAnimationFrame(function() {
      self.pickerCenterOn(self.selectedAnimal, false);
    });
  },
  buildPicker: function() {
    var strip = document.getElementById('rbPickerStrip');
    if (!strip) return;
    var items = [];
    for (var i = 0; i < ROLETA_ANIMALS.length; i++) {
      if (ROLETA_ANIMALS[i].free) continue;
      items.push(i);
    }
    var html = '';
    for (var rep = 0; rep < 3; rep++) {
      for (var j = 0; j < items.length; j++) {
        var idx = items[j];
        var a = ROLETA_ANIMALS[idx];
        var sel = idx === this.selectedAnimal ? ' selected' : '';
        html += '<div class="rb-picker-item' + sel + '" data-idx="' + idx + '">' +
          '<img src="bichos/' + a.file + '" alt="' + a.name + '"></div>';
      }
    }
    strip.innerHTML = html;
    this.pickerItemW = 68 + 10;
    this.pickerSetW = items.length * this.pickerItemW;
    this.pickerX = -this.pickerSetW;
  },
  pickAnimal: function(idx) {
    this.selectedAnimal = idx;
    document.querySelectorAll('.rb-picker-item').forEach(function(el) {
      el.classList.toggle('selected', parseInt(el.dataset.idx) === idx);
    });
  },
  applyGradient: function(wheel, n, seg, highlightIdx, color) {
    var c1 = '#2D2757', c2 = '#3A3170', cFree = '#1a6b3a';
    var parts = [];
    for (var i = 0; i < n; i++) {
      var c;
      if (i === highlightIdx && color) c = color;
      else if (ROLETA_ANIMALS[i].free) c = cFree;
      else c = i % 2 === 0 ? c1 : c2;
      parts.push(c + ' ' + (i * seg) + 'deg ' + ((i + 1) * seg) + 'deg');
    }
    wheel.style.background = 'conic-gradient(from ' + (-seg / 2) + 'deg, ' + parts.join(', ') + ')';
  },
  pickerCenterOn: function(idx, animate) {
    var carousel = document.getElementById('rbPickerCarousel');
    var strip = document.getElementById('rbPickerStrip');
    if (!carousel || !strip) return;
    var cW = carousel.offsetWidth;
    var items = strip.children;
    var target = null;
    var setLen = this.pickerSetW;
    for (var i = 0; i < items.length; i++) {
      if (parseInt(items[i].dataset.idx) === idx) {
        var pos = i * this.pickerItemW + this.pickerItemW / 2;
        if (pos >= setLen && pos < setLen * 2) {
          target = -(pos - cW / 2);
          break;
        }
      }
    }
    if (target === null) target = this.pickerX;
    this.pickerX = target;
    if (animate) {
      strip.style.transition = 'transform 0.3s ease';
    } else {
      strip.style.transition = 'none';
    }
    strip.style.transform = 'translateX(' + this.pickerX + 'px)';
    if (animate) {
      var s = strip;
      setTimeout(function() { s.style.transition = 'none'; }, 320);
    }
  },
  initPickerSwipe: function() {
    var carousel = document.getElementById('rbPickerCarousel');
    var strip = document.getElementById('rbPickerStrip');
    if (!carousel || !strip) return;
    var self = this;
    var dragging = false, startX = 0, startY = 0, startScrollX = 0, didDrag = false;
    var lastX = 0, lastTime = 0, velocity = 0;
    var animId = 0;
    function onStart(x, y) {
      dragging = true;
      didDrag = false;
      startX = x;
      startY = y;
      startScrollX = self.pickerX;
      lastX = x;
      lastTime = Date.now();
      velocity = 0;
      if (animId) { cancelAnimationFrame(animId); animId = 0; }
      strip.style.transition = 'none';
      carousel.classList.add('dragging');
    }
    function onMove(x) {
      if (!dragging) return;
      if (Math.abs(x - startX) > 15) didDrag = true;
      self.pickerX = startScrollX + (x - startX);
      var w = self.pickerSetW;
      while (self.pickerX <= -2 * w) self.pickerX += w;
      while (self.pickerX > -w) self.pickerX -= w;
      strip.style.transform = 'translateX(' + self.pickerX + 'px)';
      var now = Date.now();
      var dt = now - lastTime;
      if (dt > 0) velocity = (x - lastX) / dt * 16;
      lastX = x;
      lastTime = now;
    }
    function coast() {
      velocity *= 0.95;
      self.pickerX += velocity;
      var w = self.pickerSetW;
      while (self.pickerX <= -2 * w) self.pickerX += w;
      while (self.pickerX > -w) self.pickerX -= w;
      strip.style.transform = 'translateX(' + self.pickerX + 'px)';
      if (Math.abs(velocity) > 0.5) {
        animId = requestAnimationFrame(coast);
      } else {
        animId = 0;
        snapToNearest();
      }
    }
    function snapToNearest() {
      var cW = carousel.offsetWidth;
      var center = -self.pickerX + cW / 2;
      var nearest = Math.round(center / self.pickerItemW);
      var setLen = Math.round(self.pickerSetW / self.pickerItemW);
      var inSet = ((nearest % setLen) + setLen) % setLen;
      var items = [];
      for (var i = 0; i < ROLETA_ANIMALS.length; i++) {
        if (!ROLETA_ANIMALS[i].free) items.push(i);
      }
      var animalIdx = items[inSet] !== undefined ? items[inSet] : items[0];
      self.pickAnimal(animalIdx);
      self.pickerCenterOn(animalIdx, true);
    }
    function onEnd() {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove('dragging');
      if (!didDrag) {
        var el = document.elementFromPoint(startX, startY);
        if (el) {
          var item = el.closest('.rb-picker-item');
          if (item) {
            self.pickAnimal(parseInt(item.dataset.idx));
            self.pickerCenterOn(parseInt(item.dataset.idx), true);
            return;
          }
        }
      }
      if (Math.abs(velocity) > 1) {
        animId = requestAnimationFrame(coast);
      } else {
        snapToNearest();
      }
    }
    carousel.addEventListener('mousedown', function(e) { e.preventDefault(); onStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', function(e) { if (dragging) onMove(e.clientX); });
    document.addEventListener('mouseup', function() { onEnd(); });
    carousel.addEventListener('touchstart', function(e) { onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    carousel.addEventListener('touchmove', function(e) { if (dragging) onMove(e.touches[0].clientX); }, { passive: true });
    carousel.addEventListener('touchend', function() { onEnd(); });
    self.pickerCenterOn(self.selectedAnimal, false);
  },
  buildWheel: function() {
    var wheel = document.getElementById('rwWheel');
    var pins = document.getElementById('rwPins');
    if (!wheel) return;
    var n = ROLETA_ANIMALS.length;
    var seg = 360 / n;
    this.applyGradient(wheel, n, seg, -1, null);
    var radius = 390;
    var html = '';
    for (var i = 0; i < n; i++) {
      var angle = i * seg;
      if (ROLETA_ANIMALS[i].free) {
        html += '<div class="rw-animal rw-free" style="transform:rotate(' + angle + 'deg) translateY(-' + radius + 'px)">' +
          '<span style="font-size:36px">🍀</span></div>';
      } else {
        html += '<div class="rw-animal" style="transform:rotate(' + angle + 'deg) translateY(-' + radius + 'px)">' +
          '<img src="bichos/' + ROLETA_ANIMALS[i].file + '" alt="' + ROLETA_ANIMALS[i].name + '"></div>';
      }
    }
    wheel.innerHTML = html;
    if (pins) {
      var pinHtml = '';
      var pinR = 440;
      for (var i = 0; i < n; i++) {
        var a = i * seg * Math.PI / 180;
        var px = 450 + pinR * Math.sin(a) - 10;
        var py = 450 - pinR * Math.cos(a) - 10;
        pinHtml += '<div class="rw-pin" style="left:' + px + 'px;top:' + py + 'px"></div>';
      }
      pins.innerHTML = pinHtml;
    }
  },
  spin: function() {
    if (this.spinning) return;
    this.spinning = true;
    var wrap = document.getElementById('rwWheelWrap');
    var wheel = document.getElementById('rwWheel');
    var btn = document.getElementById('rwSpinBtn');
    var result = document.getElementById('rwResult');
    if (!wrap || !wheel) return;
    if (this.blinkTimer) { clearInterval(this.blinkTimer); this.blinkTimer = null; }
    if (btn) { btn.disabled = true; btn.textContent = 'GIRANDO...'; }
    if (result) { result.textContent = ''; result.style.color = ''; }
    var n = ROLETA_ANIMALS.length;
    var seg = 360 / n;
    this.applyGradient(wheel, n, seg, -1, null);
    var winIdx;
    do { winIdx = Math.floor(Math.random() * n); } while (this.reroll && ROLETA_ANIMALS[winIdx].free);
    this.reroll = false;
    wrap.style.transition = 'none';
    wrap.style.transform = 'rotate(0deg)';
    wrap.offsetHeight;
    var spins = 5 + Math.floor(Math.random() * 3);
    var target = ((spins + 1) * 360) - (winIdx * seg);
    wrap.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wrap.style.transform = 'rotate(' + target + 'deg)';
    var self = this;
    setTimeout(function() {
      var animal = ROLETA_ANIMALS[winIdx];
      if (animal.free) {
        if (result) result.textContent = '';
        self.freeSpinsLeft = 3;
        self.showFreeOverlay(function() {
          self.spinning = false;
          self.reroll = true;
          self.spin();
        });
      } else {
        var chosen = ROLETA_ANIMALS[self.selectedAnimal];
        var won = winIdx === self.selectedAnimal;
        var hiColor = won ? '#1a6b3a' : '#8b1a1a';
        self.applyGradient(wheel, n, seg, winIdx, hiColor);
        var blinkCount = 0;
        self.blinkTimer = setInterval(function() {
          blinkCount++;
          if (blinkCount > 10) { clearInterval(self.blinkTimer); return; }
          if (blinkCount % 2 === 0) {
            self.applyGradient(wheel, n, seg, winIdx, hiColor);
          } else {
            self.applyGradient(wheel, n, seg, -1, null);
          }
        }, 300);
        if (self.freeSpinsLeft > 0) {
          self.freeSpinsLeft--;
          var msg = won
            ? 'Parabéns!\n' + self.fmtBRL(self.valor * self.mult)
            : 'Não foi\ndessa vez!';
          var color = won ? '#22c55e' : '#ef4444';
          self.showResultOverlay(msg, color, function() {
            self.spinning = false;
            self.reroll = true;
            self.spin();
          });
        } else {
          self.spinning = false;
          if (btn) { btn.disabled = false; btn.textContent = 'GIRAR ROLETA'; }
          if (won) {
            self.showResultOverlay('Parabéns!\n' + self.fmtBRL(self.valor * self.mult), '#22c55e', null);
          } else {
            self.showResultOverlay('Não foi\ndessa vez!', '#ef4444', null);
          }
        }
      }
    }, 4300);
  },
  changeVal: function(dir) {
    var steps = [1, 2, 5, 10, 20, 50, 100];
    var cur = steps.indexOf(this.valor);
    if (cur === -1) cur = 1;
    cur += dir;
    if (cur < 0) cur = 0;
    if (cur >= steps.length) cur = steps.length - 1;
    this.valor = steps[cur];
    this.updateValor();
  },
  setVal: function(v) {
    this.valor = v;
    this.updateValor();
  },
  fmtBRL: function(v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  },
  showResultOverlay: function(msg, color, cb) {
    var lines = msg.split('\n');
    var html = '<div class="free-overlay-content">';
    for (var i = 0; i < lines.length; i++) {
      html += '<span class="free-overlay-text" style="color:' + color + '">' + lines[i] + '</span>';
    }
    html += '</div>';
    var overlay = document.createElement('div');
    overlay.className = 'free-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
      overlay.classList.add('free-overlay-show');
    });
    setTimeout(function() {
      overlay.classList.remove('free-overlay-show');
      overlay.classList.add('free-overlay-hide');
      setTimeout(function() {
        overlay.remove();
        if (cb) cb();
      }, 500);
    }, 2000);
  },
  showFreeOverlay: function(cb) {
    var overlay = document.createElement('div');
    overlay.className = 'free-overlay';
    overlay.innerHTML = '<div class="free-overlay-content">' +
      '<span class="free-overlay-x">3X</span>' +
      '<span class="free-overlay-text">GRÁTIS</span>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function() {
      overlay.classList.add('free-overlay-show');
    });
    setTimeout(function() {
      overlay.classList.remove('free-overlay-show');
      overlay.classList.add('free-overlay-hide');
      setTimeout(function() {
        overlay.remove();
        if (cb) cb();
      }, 500);
    }, 2000);
  },
  updateValor: function() {
    var disp = document.getElementById('rbValDisplay');
    var ganhos = document.getElementById('rbGanhos');
    if (disp) disp.textContent = this.fmtBRL(this.valor);
    if (ganhos) ganhos.textContent = this.fmtBRL(this.valor * this.mult);
    var self = this;
    document.querySelectorAll('.rb-preset').forEach(function(btn) {
      var val = parseFloat(btn.textContent.replace('R$', '').replace(',', '.'));
      btn.classList.toggle('selected', val === self.valor);
    });
  }
};

var Cotacoes = {
  toggle: function(btn) {
    var details = btn.nextElementSibling;
    btn.classList.toggle('open');
    details.classList.toggle('open');
  }
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
  var topbar = document.getElementById('landingTopbar');
  var hero = document.querySelector('.landing-hero');
  if (!landing || !landing.classList.contains('active') || !hero || !sticky) {
    if (sticky) sticky.hidden = true;
    if (topbar) topbar.hidden = false;
    return;
  }
  var scrolled = hero.getBoundingClientRect().bottom <= 48;
  sticky.hidden = !scrolled;
  if (topbar) topbar.hidden = scrolled;
}, { passive: true });

var TrackDrag = {
  tracks: [],
  init: function() {
    var wraps = document.querySelectorAll('.roleta-track-wrap');
    var totalWidth = (80 + 12) * 25;
    wraps.forEach(function(wrap) {
      var track = wrap.querySelector('.roleta-track');
      if (!track) return;
      var isReverse = wrap.classList.contains('reverse');
      var baseSpeed = isReverse ? 1.6 : -1.9;
      var s = {
        el: track, wrap: wrap,
        x: isReverse ? -totalWidth : 0,
        speed: baseSpeed, baseSpeed: baseSpeed,
        dragging: false, startX: 0, startScrollX: 0,
        lastX: 0, lastTime: 0, velocity: 0,
        totalWidth: totalWidth
      };
      TrackDrag.tracks.push(s);
      wrap.addEventListener('mousedown', function(e) { TrackDrag.onStart(s, e.clientX); e.preventDefault(); });
      document.addEventListener('mousemove', function(e) { if (s.dragging) TrackDrag.onMove(s, e.clientX); });
      document.addEventListener('mouseup', function() { if (s.dragging) TrackDrag.onEnd(s); });
      wrap.addEventListener('touchstart', function(e) { TrackDrag.onStart(s, e.touches[0].clientX); }, { passive: true });
      wrap.addEventListener('touchmove', function(e) { if (s.dragging) TrackDrag.onMove(s, e.touches[0].clientX); }, { passive: true });
      wrap.addEventListener('touchend', function() { if (s.dragging) TrackDrag.onEnd(s); }, { passive: true });
    });
    requestAnimationFrame(function loop() { TrackDrag.tick(); requestAnimationFrame(loop); });
  },
  onStart: function(s, x) {
    s.dragging = true;
    s.startX = x; s.startScrollX = s.x;
    s.lastX = x; s.lastTime = Date.now();
    s.velocity = 0;
    s.wrap.classList.add('dragging');
  },
  onMove: function(s, x) {
    s.x = s.startScrollX + (x - s.startX);
    var now = Date.now();
    var dt = now - s.lastTime;
    if (dt > 0) s.velocity = (x - s.lastX) / dt * 16;
    s.lastX = x; s.lastTime = now;
  },
  onEnd: function(s) {
    s.dragging = false;
    s.speed = s.velocity * 1.5 + s.baseSpeed;
    s.wrap.classList.remove('dragging');
  },
  tick: function() {
    this.tracks.forEach(function(s) {
      if (!s.dragging) {
        s.x += s.speed;
        s.speed += (s.baseSpeed - s.speed) * 0.03;
      }
      var w = s.totalWidth;
      while (s.x <= -w) s.x += w;
      while (s.x > 0) s.x -= w;
      s.el.style.transform = 'translateX(' + s.x + 'px)';
    });
  }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); Roleta.init(); TrackDrag.init(); });

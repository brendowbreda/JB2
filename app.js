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
  { id: 'primeira-aposta', name: 'Primeira Aposta', emoji: '🎯', img: 'img/conquista-primeira-aposta.png', desc: 'Faça sua primeira aposta (mínimo R$ 1,00).' },
  { id: 'semana-de-jogo', name: 'Semana de Jogo', emoji: '📅', img: 'img/conquista-semana-de-jogo.png', desc: 'Jogue os 7 dias da semana.', obs: 'Cada aposta precisa ser de no mínimo R$ 1,00.' },
  { id: '10-apostas', name: '10 em 7', emoji: '🏅', img: 'img/conquista-10-apostas.png', desc: 'Faça 10 apostas em uma única semana.', obs: '10 apostas durante 7 dias (mínimo R$ 1,00 cada aposta).' },
  { id: '10x10', name: '10x10=R$100,00', emoji: '💰', img: 'img/conquista-10x10.png', desc: 'Faça 10 apostas por semana durante 10 semanas seguidas.', obs: 'Prêmio: R$ 100,00!' },
  { id: 'semana-perfeita', name: 'Semana Perfeita', emoji: '⭐', img: 'img/conquista-semana-perfeita.png', desc: 'Ganhe 10 apostas em uma única semana.', obs: 'Sorte de verdade!' },
  { id: 'manha-da-sorte', name: 'Manhã da Sorte', emoji: '☀️', img: 'img/conquista-manha-da-sorte.png', desc: 'Ganhe uma aposta feita no período da manhã.', obs: 'Entre 6h e 12h.' },
  { id: 'velocidade-maxima', name: 'Velocidade Máxima', emoji: '⚡', img: 'img/conquista-velocidade-maxima.png', desc: 'Consiga 3 vitórias no mesmo dia.', obs: 'Velocidade e sorte!' },
  { id: 'coruja-sortuda', name: 'Coruja Sortuda', emoji: '🦉', img: 'img/conquista-coruja-sortuda.png', desc: 'Faça uma aposta entre 22h e 6h da manhã.', obs: 'A sorte não dorme!' },
  { id: 'amizade-e-tudo', name: 'Amizade é Tudo', emoji: '🤝', img: 'img/conquista-amizade-e-tudo.png', desc: 'Indique seu primeiro amigo para o Palpite Club.' },
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
    transactions: [],
    weeks: {},
    streak: 0,
    bestStreak: 0,
    cashbackWeeksClaimed: [],
    achievements: {},
    friends: [],
    notifications: [
      { id: uid(), html: '<strong>Seja bem-vindo ao Palpite Club!</strong><br>Vamos fazer seu primeiro depósito para começar?', at: nowIso(), read: false },
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
function ShareInvite() {
  var msg = encodeURIComponent('Vem jogar no Palpite Club comigo! Acesse: https://brendowbreda.github.io/JB2/');
  window.open('https://wa.me/?text=' + msg, '_blank');
}

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
      users[email] = { name: 'Rafa Demo', email, phone: '11900000000', cpf: '00011122233', password: 'demo', createdAt: nowIso() };
      saveUsers(users);
    }
    CURRENT_EMAIL = email;
    STATE = Seed.demoState();
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
      'semana-de-jogo': { at: nowIso() },
      '10-apostas': { at: nowIso() },
      'manha-da-sorte': { at: nowIso() },
      'coruja-sortuda': { at: nowIso() },
      'amizade-e-tudo': { at: nowIso() },
    };
    s.friends = DEMO_PEOPLE.slice(0, 5).map((p) => ({ ...p }));
    s.feed = [
      { id: uid(), from: 'Ana Ribeiro', avatar: '🦁', text: 'apostou no Leão 🦁 (Grupo 16) — 50 pts', at: nowIso() },
      { id: uid(), from: 'Bruno Alves', avatar: '🐯', text: 'ganhou 900 pts apostando na Vaca 🐄!', at: nowIso() },
      { id: uid(), from: 'Carla Souza', avatar: '🦊', text: 'convidou você para um bolão no Peru 🦃', at: nowIso() },
    ];
    const animal = animalByGroup(16);
    s.bets.push({
      id: uid(), animal: animalByGroup(13), modality: 'grupo', dezena: null,
      amount: 20, horario: DRAW_TIMES[0].label,
      placedAt: nowIso(), resolveAt: new Date(Date.now() + 3600000).toISOString(),
      status: 'aguardando', payout: 360,
    });
    s.bets.push({
      id: uid(), animal: animalByGroup(5), modality: 'dezena', dezena: '18',
      amount: 10, horario: DRAW_TIMES[2].label,
      placedAt: nowIso(), resolveAt: new Date(Date.now() + 7200000).toISOString(),
      status: 'aguardando', payout: 600,
    });
    for (let i = 0; i < 4; i++) {
      const placedAt = new Date(today); placedAt.setDate(placedAt.getDate() - (i + 1) * 3);
      s.bets.push({
        id: uid(), animal, modality: 'grupo', dezena: null,
        amount: 50, horario: DRAW_TIMES[i % DRAW_TIMES.length].label,
        placedAt: placedAt.toISOString(), resolveAt: placedAt.toISOString(),
        status: 'perdeu', payout: 0,
      });
    }
    var winDate1 = new Date(today); winDate1.setDate(winDate1.getDate() - 2);
    s.bets.push({
      id: uid(), animal: animalByGroup(13), modality: 'grupo', dezena: null,
      amount: 30, horario: DRAW_TIMES[1].label,
      placedAt: winDate1.toISOString(), resolveAt: winDate1.toISOString(),
      status: 'ganhou', payout: 540,
    });
    var winDate2 = new Date(today); winDate2.setDate(winDate2.getDate() - 7);
    s.bets.push({
      id: uid(), animal: animalByGroup(5), modality: 'dezena', dezena: '18',
      amount: 20, horario: DRAW_TIMES[0].label,
      placedAt: winDate2.toISOString(), resolveAt: winDate2.toISOString(),
      status: 'ganhou', payout: 1200,
    });
    var h1 = new Date(today); h1.setHours(h1.getHours() - 1);
    var h2 = new Date(today); h2.setHours(h2.getHours() - 2);
    var h3 = new Date(today); h3.setHours(h3.getHours() - 3);
    var h4 = new Date(today); h4.setHours(h4.getHours() - 4);
    var h5 = new Date(today); h5.setHours(h5.getHours() - 5);
    var h6 = new Date(today); h6.setHours(h6.getHours() - 6);
    var h7 = new Date(today); h7.setHours(h7.getHours() - 7);
    var d1 = new Date(today); d1.setDate(d1.getDate() - 1);
    var d2 = new Date(today); d2.setDate(d2.getDate() - 5);
    var d3 = new Date(today); d3.setDate(d3.getDate() - 12);
    s.transactions = [
      { id: uid(), type: 'deposit', amount: 100, at: d3.toISOString() },
      { id: uid(), type: 'deposit', amount: 500, at: d2.toISOString() },
      { id: uid(), type: 'withdrawal', amount: 200, total: 197.50, at: d1.toISOString() },
    ];
    s.notifications = [
      { id: uid(), html: 'Saque <strong>R$ 47,50</strong> solicitado e aprovado.', at: h1.toISOString(), read: false },
      { id: uid(), html: 'Conquista desbloqueada:<br><strong>Manhã da Sorte</strong> <button class="notif-achv-btn" onclick="go(\'s-conquistas\')">Ver conquista</button>', at: h2.toISOString(), read: false },
      { id: uid(), html: 'Resultado saiu:<br><span class="notif-win">Parabéns, você ganhou <strong>R$ 360,00</strong></span>', at: h3.toISOString(), read: true },
      { id: uid(), html: 'Resultado saiu:<br><span class="notif-loss">Não foi dessa vez. Tente novamente!</span>', at: h4.toISOString(), read: true },
      { id: uid(), html: '<strong>Parabéns!</strong><br>10 apostas (+R$ 1,00) essa semana<br>10 de 10 para ganhar <strong>R$ 100,00</strong>', at: h5.toISOString(), read: true },
      { id: uid(), html: 'Seu depósito de <strong>R$ 100,00</strong> já caiu.', at: h6.toISOString(), read: true },
      { id: uid(), html: '<strong>Seja bem-vindo ao Palpite Club!</strong><br>Vamos fazer seu primeiro depósito para começar?', at: h7.toISOString(), read: true },
    ];
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
  showInfo() {
    Modal.open('streakModal');
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

/* ---------------- resultados ---------------- */
const Resultados = {
  _cache: null,
  generateDraws() {
    if (this._cache) return this._cache;
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var times = [
      { id: 'ptm', label: 'PTM · 11h20', hour: 11, min: 20 },
      { id: 'pt', label: 'PT · 14h20', hour: 14, min: 20 },
      { id: 'ptv', label: 'PTV · 16h20', hour: 16, min: 20 },
      { id: 'ptn', label: 'PTN · 20h20', hour: 20, min: 20 },
      { id: 'coruja', label: 'Coruja · 21h20', hour: 21, min: 20 },
    ];
    var seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    function rng(s) { s = (s * 9301 + 49297) % 233280; return s; }
    function genPremios(s) {
      var premios = [];
      for (var p = 0; p < 5; p++) {
        s = rng(s + p * 137);
        var num = s % 10000;
        var numStr = ('0000' + num).slice(-4);
        var group = Math.floor((num % 100) / 4) + 1;
        if (group > 25) group = 25;
        var animal = ANIMALS[group - 1] ? ANIMALS[group - 1].name : ANIMALS[0].name;
        premios.push({ num: numStr, animal: animal.toUpperCase() });
      }
      return premios;
    }
    var draws = [];
    for (var t = 0; t < times.length; t++) {
      var drawMin = times[t].hour * 60 + times[t].min;
      if (nowMin < drawMin) {
        draws.push({ label: times[t].label, pending: true });
      } else {
        draws.push({ label: times[t].label, pending: false, premios: genPremios(seed + t * 1000) });
      }
    }
    if (draws.every(function(d) { return d.pending; })) {
      draws[0] = { label: times[0].label, pending: false, premios: genPremios(seed) };
      draws[1] = { label: times[1].label, pending: false, premios: genPremios(seed + 1000) };
      draws[2] = { label: times[2].label, pending: false, premios: genPremios(seed + 2000) };
    }
    this._cache = draws;
    return draws;
  },
  toggle(idx) {
    var el = document.getElementById('resExtra' + idx);
    var btn = el.previousElementSibling;
    el.classList.toggle('open');
    btn.classList.toggle('open');
  }
};

/* ---------------- achievements ---------------- */
const Achv = {
  unlock(id) {
    if (STATE.achievements[id]) return;
    STATE.achievements[id] = { at: nowIso() };
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    STATE.notifications.unshift({ id: uid(), html: 'Conquista desbloqueada:<br><strong>' + def.name + '</strong> <button class="notif-achv-btn" onclick="go(\'s-conquistas\')">Ver conquista</button>', at: nowIso(), read: false });
    saveState();
    this._showModal(def, true);
  },
  detail(id) {
    var def = ACHIEVEMENTS.find(function(a) { return a.id === id; });
    if (!def) return;
    this._showModal(def, false);
  },
  _showModal(def, isUnlock) {
    var iconEl = document.getElementById('achvModalIcon');
    if (def.img) { iconEl.innerHTML = '<img class="achv-modal-img" src="' + def.img + '" alt="' + def.name + '">'; } else { iconEl.textContent = def.emoji; }
    document.getElementById('achvModalTitle').textContent = isUnlock ? 'Conquista desbloqueada!' : def.name;
    document.getElementById('achvModalName').textContent = isUnlock ? def.name : '';
    var descEl = document.getElementById('achvModalDesc');
    descEl.innerHTML = def.desc + (def.obs ? '<small class="achv-obs">' + def.obs + '</small>' : '');
    var statusEl = document.getElementById('achvModalStatus');
    var unlocked = STATE.achievements[def.id];
    if (unlocked) {
      var d = new Date(unlocked.at);
      statusEl.innerHTML = '<span class="achv-status-ok">Desbloqueada em ' + d.toLocaleDateString('pt-BR') + '</span>';
    } else {
      statusEl.innerHTML = '<span class="achv-status-locked">Bloqueada</span>';
    }
    Modal.open('achvModal');
  },
  checkAll(context = {}) {
    const s = STATE;
    if (s.totalBets >= 1) this.unlock('primeira-aposta');

    var thisWeek = weekKey();
    var betsThisWeek = s.bets.filter(function(b) { return weekKey(new Date(b.placedAt)) === thisWeek; }).length;

    // Semana de Jogo: apostou em todos os 7 dias da semana
    var daysThisWeek = {};
    s.bets.forEach(function(b) {
      if (weekKey(new Date(b.placedAt)) === thisWeek) daysThisWeek[new Date(b.placedAt).getDay()] = true;
    });
    if (Object.keys(daysThisWeek).length >= 7) this.unlock('semana-de-jogo');

    // 10 Apostas: 10 apostas em uma semana
    if (betsThisWeek >= 10) this.unlock('10-apostas');

    // 10x10: 10 apostas por semana em 10 semanas
    if (s.streak >= 10 && betsThisWeek >= 10) this.unlock('10x10');

    // Semana Perfeita: ganhar 10 vezes em uma semana
    var winsThisWeek = s.bets.filter(function(b) { return b.status === 'ganhou' && weekKey(new Date(b.placedAt)) === thisWeek; }).length;
    if (winsThisWeek >= 10) this.unlock('semana-perfeita');

    // Manhã da Sorte
    if (context.wonAt) {
      var h = new Date(context.wonAt).getHours();
      if (h >= 6 && h < 12) this.unlock('manha-da-sorte');
    }

    // Velocidade Máxima: 3 vitórias no mesmo dia
    var winsByDay = {};
    s.bets.filter(function(b) { return b.status === 'ganhou'; }).forEach(function(b) {
      var dk = new Date(b.placedAt).toISOString().slice(0, 10);
      winsByDay[dk] = (winsByDay[dk] || 0) + 1;
    });
    if (Object.values(winsByDay).some(function(c) { return c >= 3; })) this.unlock('velocidade-maxima');

    // Coruja Sortuda: apostar entre 22h e 6h
    var hasNightBet = s.bets.some(function(b) {
      var bh = new Date(b.placedAt).getHours();
      return bh >= 22 || bh < 6;
    });
    if (hasNightBet) this.unlock('coruja-sortuda');

    // Amizade é Tudo: ter 1 amigo
    if (s.friends && s.friends.length >= 1) this.unlock('amizade-e-tudo');

    // Frequencia: notificar marcos de apostas na semana
    if (betsThisWeek === 10 && !s._notif10week) {
      s._notif10week = thisWeek;
      var weekNum = s.streak || 1;
      STATE.notifications.unshift({ id: uid(), html: '<strong>Parabéns!</strong><br>10 apostas (+R$ 1,00) essa semana<br>' + weekNum + ' de 10 para ganhar <strong>R$ 100,00</strong>', at: nowIso(), read: false });
    }
  },
};

/* ---------------- bet flow ---------------- */
const LOTERIAS = [
  { id: 'instantanea', name: 'Instantânea', badge: 'Loteria da casa' },
  { id: 'rj', name: 'Rio de Janeiro', badge: '6 horários' },
  { id: 'sp', name: 'São Paulo' },
  { id: 'nacional', name: 'Nacional' },
  { id: 'brasilia', name: 'Brasília' },
  { id: 'mg', name: 'Minas Gerais' },
  { id: 'pe', name: 'Pernambuco' },
  { id: 'ce', name: 'Ceará' },
  { id: 'go', name: 'Goiás' },
  { id: 'rn', name: 'Rio Grande do Norte' },
  { id: 'pb', name: 'Paraíba' },
];

const ANIMAL_IMGS = [
  '','01-avestruz','02-aguia','03-burro','04-borboleta','05-cachorro','06-cabra',
  '07-carneiro','08-camelo','09-cobra','10-coelho','11-cavalo','12-elefante',
  '13-galo','14-gato','15-jacare','16-leao','17-macaco','18-porco',
  '19-pavao','20-peru','21-touro','22-tigre','23-urso','24-veado','25-vaca'
];

const MOD_DIGITS = {
  milhar: 4, 'milhar-centena': 4, 'milhar-invertida': 4,
  centena: 3, 'centena-invertida': 3,
  dezena: 2, 'dezena-invertida': 2,
};

const Wizard = {
  step: 1,
  draft: {},
  digits: [],
  palpites: [],
  selectedAnimals: [],

  start() {
    this.step = 1;
    this.draft = {};
    this.digits = [];
    this.palpites = [];
    this.selectedAnimals = [];
    this._presetMod = false;
    go('s-wizard');
  },
  startWithMod(id) {
    this.step = 1;
    this.draft = {};
    this.digits = [];
    this.palpites = [];
    this.selectedAnimals = [];
    this._presetMod = true;
    this.draft.modality = COTACOES.find(function(c) { return c.id === id; });
    go('s-wizard');
  },
  close() { go('s-home'); },
  next() {
    this.step++;
    if (this.step === 2 && this.draft.modality) this.step = 3;
    this.render();
  },
  back() {
    if (this.step > 1) {
      this.step--;
      if (this.step === 2 && this._presetMod) this.step = 1;
      this.render();
    } else this.close();
  },

  render() {
    var pct = (this.step / 8) * 100;
    document.getElementById('wizProgressFill').style.width = pct + '%';
    document.getElementById('wizStepLabel').textContent = 'PASSO ' + this.step + ' DE 8';
    var backBtn = document.getElementById('wizBackBtn');
    if (backBtn) backBtn.style.visibility = this.step <= 1 || this.step === 8 ? 'hidden' : 'visible';
    var body = document.getElementById('wizBody');
    var footer = document.getElementById('wizFooter');
    footer.innerHTML = '';

    if (this.step === 1) this.renderDate(body, footer);
    else if (this.step === 2) this.renderMod(body, footer);
    else if (this.step === 3) this.renderInput(body, footer);
    else if (this.step === 4) this.renderPlace(body, footer);
    else if (this.step === 5) this.renderAmount(body, footer);
    else if (this.step === 6) this.renderLot(body, footer);
    else if (this.step === 7) this.renderConfirm(body, footer);
    else if (this.step === 8) this.renderSuccess(body, footer);
  },

  renderDate(body, footer) {
    var days = [];
    var dayNames = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
    for (var i = 0; i < 6; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var label = i === 0 ? 'HOJE' : i === 1 ? 'AMANHÃ' : dayNames[d.getDay()];
      days.push({ label: label, day: pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1), date: d.toISOString().slice(0,10), selected: this.draft.date === d.toISOString().slice(0,10) || (i === 0 && !this.draft.date) });
    }
    if (!this.draft.date) this.draft.date = days[0].date;
    body.innerHTML = '<h2>Quando você quer apostar?</h2>' +
      '<p class="wiz-sub">Escolha o dia do sorteio. Você pode agendar para os próximos dias.</p>' +
      '<div class="wiz-date-grid">' + days.map(function(d) {
        return '<div class="wiz-date-tile' + (d.selected ? ' selected' : '') + '" onclick="Wizard.pickDate(\'' + d.date + '\')">' +
          '<span class="wiz-date-day">' + d.label + '</span>' +
          '<span class="wiz-date-num">' + d.day + '</span></div>';
      }).join('') + '</div>';
    footer.innerHTML = '<button class="btn-primary" onclick="Wizard.next()">Continuar</button>';
  },
  pickDate(d) { this.draft.date = d; this.render(); },

  renderMod(body, footer) {
    var numMods = COTACOES.filter(function(c) { return !['grupo','duque-grupo','terno-grupo'].includes(c.id); });
    var grpMods = COTACOES.filter(function(c) { return ['grupo','duque-grupo','terno-grupo'].includes(c.id); });
    var html = '<h2>Escolha a modalidade</h2><p class="wiz-sub">Cada modalidade tem sua cotação e forma de jogar.</p><div class="wiz-mod-list">';
    numMods.forEach(function(c) {
      var badge = c.id === 'milhar' ? '<span class="wiz-mod-badge">Maior cotação</span>' : '';
      html += '<button class="wiz-mod-row" onclick="Wizard.pickMod(\'' + c.id + '\')">' +
        '<span><span class="wiz-mod-name">' + c.name + '</span>' + badge + '</span>' +
        '<span class="wiz-mod-mult">' + c.mult + '</span></button>';
    });
    grpMods.forEach(function(c) {
      var badge = c.id === 'grupo' ? '<span class="wiz-mod-badge gold">Destaque</span>' : '';
      html += '<button class="wiz-mod-row gold" onclick="Wizard.pickMod(\'' + c.id + '\')">' +
        '<span><span class="wiz-mod-name">' + c.name + '</span>' + badge + '</span>' +
        '<span class="wiz-mod-mult">' + c.mult + '</span></button>';
    });
    html += '</div>';
    body.innerHTML = html;
  },
  pickMod(id) {
    this.draft.modality = COTACOES.find(function(c) { return c.id === id; });
    this.digits = [];
    this.palpites = [];
    this.selectedAnimals = [];
    this.next();
  },

  renderLot(body, footer) {
    var html = '<h2>Escolha uma loteria / sorteio</h2>' +
      '<p class="wiz-sub">Além das loterias nacional e estaduais, temos a <strong>Instantânea</strong> — a loteria da casa, com resultado a cada minuto.</p>' +
      '<div class="wiz-lot-list">';
    LOTERIAS.forEach(function(l) {
      var badge = l.badge ? '<span class="wiz-lot-badge">' + l.badge + '</span>' : '';
      html += '<button class="wiz-lot-row" onclick="Wizard.pickLot(\'' + l.id + '\')">' +
        '<span><span class="wiz-lot-name">' + l.name + '</span>' + badge + '</span></button>';
    });
    html += '</div>';
    body.innerHTML = html;
  },
  pickLot(id) {
    this.draft.loteria = LOTERIAS.find(function(l) { return l.id === id; });
    this.next();
  },

  renderInput(body, footer) {
    var mod = this.draft.modality;
    var isGroup = ['grupo','duque-grupo','terno-grupo'].includes(mod.id);
    if (isGroup) this.renderAnimalPick(body, footer);
    else this.renderNumpad(body, footer);
  },

  renderNumpad(body, footer) {
    var mod = this.draft.modality;
    var numDigits = MOD_DIGITS[mod.id] || 4;
    var slots = '';
    for (var i = 0; i < numDigits; i++) {
      var val = this.digits[i] || '–';
      var cls = this.digits[i] !== undefined ? ' filled' : '';
      slots += '<div class="wiz-digit-slot' + cls + '">' + val + '</div>';
    }
    var tags = this.palpites.map(function(p) { return '<span class="wiz-palpite-tag">' + p + '</span>'; }).join('');
    var desc = mod.name;
    var sub = '';
    if (mod.id === 'milhar-centena') {
      sub = 'Vá digitando os números. A cada ' + numDigits + ' dígitos, um novo palpite é adicionado — você pode colocar até 10 palpites no mesmo bilhete.<br><br>Acertando os 4 números, você ganha a Milhar e a Centena juntas. Acertando só os 3 últimos, ganha a Centena.';
    } else {
      sub = 'Vá digitando os números. A cada ' + numDigits + ' dígitos, um novo palpite é adicionado — você pode colocar até 10 palpites no mesmo bilhete.';
    }
    body.innerHTML = '<h2>' + desc + '</h2><p class="wiz-sub">' + sub + '</p>' +
      '<div class="wiz-palpites-label"><span>SEUS PALPITES</span><span>' + this.palpites.length + ' de 10</span></div>' +
      '<div class="wiz-palpites-list">' + tags + '</div>' +
      '<div class="wiz-numpad"><div class="wiz-digits">' + slots + '</div>' +
      '<div class="wiz-numpad-grid">' +
      [1,2,3,4,5,6,7,8,9].map(function(n) { return '<button class="wiz-numpad-key" onclick="Wizard.numKey(' + n + ')">' + n + '</button>'; }).join('') +
      '<button class="wiz-numpad-key fn" onclick="Wizard.numClear()">Limpar</button>' +
      '<button class="wiz-numpad-key" onclick="Wizard.numKey(0)">0</button>' +
      '<button class="wiz-numpad-key fn" onclick="Wizard.numBack()">⌫</button>' +
      '</div></div>';
    footer.innerHTML = '<button class="btn-primary" onclick="Wizard.numContinue()"' + (this.palpites.length === 0 ? ' disabled style="opacity:.5;pointer-events:none"' : '') + '>Continuar</button>';
  },
  numKey(n) {
    var mod = this.draft.modality;
    var numDigits = MOD_DIGITS[mod.id] || 4;
    if (this.digits.length < numDigits) {
      this.digits.push(n);
      if (this.digits.length === numDigits && this.palpites.length < 10) {
        this.palpites.push(this.digits.join(''));
        this.digits = [];
      }
      this.render();
    }
  },
  numBack() { this.digits.pop(); this.render(); },
  numClear() { this.digits = []; this.render(); },
  numContinue() {
    if (this.palpites.length === 0) return;
    this.draft.palpites = this.palpites.slice();
    this.next();
  },

  renderAnimalPick(body, footer) {
    var mod = this.draft.modality;
    var needed = mod.id === 'grupo' ? 1 : mod.id === 'duque-grupo' ? 2 : 3;
    var desc = mod.name;
    var sub = '';
    if (mod.id === 'grupo') sub = 'No Grupo você não digita números — escolha o bicho em que quer apostar. Cada um representa 4 dezenas.';
    else if (mod.id === 'duque-grupo') sub = 'Escolha 2 bichos. A cada 2 escolhidos, um novo palpite é adicionado — você pode colocar até 10 palpites no mesmo bilhete.';
    else sub = 'Escolha 3 bichos. A cada 3 escolhidos, um novo palpite é adicionado — você pode colocar até 10 palpites no mesmo bilhete.';
    var self = this;
    var tags = this.palpites.map(function(p) { return '<span class="wiz-palpite-tag">' + p + '</span>'; }).join('');
    var grid = ANIMALS.map(function(a) {
      var sel = self.selectedAnimals.indexOf(a.g) !== -1 ? ' selected' : '';
      var dzs = dezenasFor(a.g).join('·');
      var imgFile = ANIMAL_IMGS[a.g];
      return '<div class="wiz-animal-tile' + sel + '" onclick="Wizard.pickAnimal(' + a.g + ')">' +
        '<img src="bichos/' + imgFile + '.png" alt="' + a.name + '">' +
        '<div class="wiz-animal-info"><span class="wiz-animal-num">' + pad2(a.g) + '</span>' +
        '<span class="wiz-animal-name">' + a.name + '</span>' +
        '<span class="wiz-animal-dzs">' + dzs + '</span></div></div>';
    }).join('');
    body.innerHTML = '<h2>' + desc + '</h2><p class="wiz-sub">' + sub + '</p>' +
      '<div class="wiz-palpites-label"><span>SEUS PALPITES</span><span>' + this.palpites.length + ' de 10</span></div>' +
      '<div class="wiz-palpites-list">' + tags + '</div>' +
      '<div class="wiz-animal-grid">' + grid + '</div>';
    var canContinue = (mod.id === 'grupo' && this.palpites.length > 0) || (mod.id !== 'grupo' && this.palpites.length > 0);
    footer.innerHTML = '<button class="btn-primary" onclick="Wizard.animalContinue()"' + (!canContinue ? ' disabled style="opacity:.5;pointer-events:none"' : '') + '>Continuar</button>';
  },
  pickAnimal(g) {
    var mod = this.draft.modality;
    var needed = mod.id === 'grupo' ? 1 : mod.id === 'duque-grupo' ? 2 : 3;
    var idx = this.selectedAnimals.indexOf(g);
    if (idx !== -1) { this.selectedAnimals.splice(idx, 1); this.render(); return; }
    this.selectedAnimals.push(g);
    this.draft._lastAnimalG = g;
    if (this.selectedAnimals.length === needed && this.palpites.length < 10) {
      var names = this.selectedAnimals.map(function(gg) { return animalByGroup(gg).name; });
      this.palpites.push(names.join(' + '));
      this.selectedAnimals = [];
    }
    this.render();
  },
  animalContinue() {
    if (this.palpites.length === 0) return;
    this.draft.palpites = this.palpites.slice();
    this.draft.animal = animalByGroup(this.draft._lastAnimalG || ANIMALS[0].g);
    this.next();
  },

  renderPlace(body, footer) {
    var mod = this.draft.modality;
    var tiers = mod.tiers || [];
    var self = this;
    body.innerHTML = '<h2>Colocação</h2>' +
      '<div class="wiz-place-list">' + tiers.map(function(t) {
        var sel = self.draft.tier && self.draft.tier.label === t.label ? ' selected' : '';
        return '<button class="wiz-place-row' + sel + '" onclick="Wizard.pickPlace(\'' + t.label + '\')">' + t.label + '</button>';
      }).join('') + '</div>';
    footer.innerHTML = '';
  },
  pickPlace(label) {
    var mod = this.draft.modality;
    this.draft.tier = mod.tiers.find(function(t) { return t.label === label; });
    this.next();
  },

  renderAmount(body, footer) {
    var self = this;
    var amounts = [1, 5, 10, 50];
    var sel = this.draft.amount;
    var numPalpites = this.draft.palpites ? this.draft.palpites.length : 1;
    var grid = amounts.map(function(v) {
      var s = sel === v ? ' selected' : '';
      var pop = v === 5 ? '<span class="wiz-pop-badge">Mais escolhido</span>' : '';
      return '<div class="wiz-amount-tile' + s + '" onclick="Wizard.pickAmount(' + v + ')">' + pop + 'R$ ' + v + ',00</div>';
    }).join('');
    var inputVal = this.draft.customAmount || '';
    var mult = this.draft.tier ? this.draft.tier.value : this.draft.modality.mult;
    var multNum = parseFloat(String(mult).replace(/\./g, '').replace(',', '.')) || 0;
    var amt = sel || parseFloat(String(inputVal).replace(',', '.')) || 0;

    var splitHtml = '';
    if (numPalpites > 1 && amt > 0) {
      var splitMode = this.draft.splitMode || 'each';
      var selEach = splitMode === 'each' ? ' selected' : '';
      var selAll = splitMode === 'all' ? ' selected' : '';
      var totalEach = amt * numPalpites;
      var perAll = (amt / numPalpites);
      splitHtml = '<p class="wiz-split-title">Como dividir o valor entre os ' + numPalpites + ' palpites?</p>' +
        '<div class="wiz-split-option' + selEach + '" onclick="Wizard.pickSplit(\'each\')">' +
        '<span class="wiz-split-name">Cada Palpite</span>' +
        '<span class="wiz-split-desc">Você paga <strong>' + Wallet.fmtBRL(amt) + '</strong> em cada um dos seus <strong>' + numPalpites + '</strong> palpites. Total apostado <strong>' + Wallet.fmtBRL(totalEach) + '</strong>.</span></div>' +
        '<div class="wiz-split-option' + selAll + '" onclick="Wizard.pickSplit(\'all\')">' +
        '<span class="wiz-split-name">Todos os Palpites</span>' +
        '<span class="wiz-split-desc">Os <strong>' + Wallet.fmtBRL(amt) + '</strong> são divididos entre os <strong>' + numPalpites + '</strong> palpites — <strong>' + Wallet.fmtBRL(perAll) + '</strong> para cada palpite. Total apostado <strong>' + Wallet.fmtBRL(amt) + '</strong>.</span></div>';
    }

    var prizeAmt = numPalpites > 1 && this.draft.splitMode === 'all' ? amt / numPalpites : amt;
    var prize = '';
    if (amt > 0) {
      var prizeVal = prizeAmt * multNum;
      var prizeLabel = numPalpites > 1 ? 'Prêmio estimado<br><small>(por palpite)</small>' : 'Prêmio estimado';
      prize = '<div class="wiz-prize-row"><span class="wiz-prize-label">' + prizeLabel + '</span><span class="wiz-prize-value">' + Wallet.fmtBRL(prizeVal) + '</span></div>';
    }
    body.innerHTML = '<h2>Quanto quer apostar?</h2>' +
      '<p class="wiz-sub">Mínimo R$ 0,10 — máximo R$ 5.000,00 por bilhete.</p>' +
      '<div class="wiz-amount-grid">' + grid + '</div>' +
      '<input class="wiz-amount-input" type="text" placeholder="R$  0,00" inputmode="decimal" id="wizAmountInput" value="' + (inputVal ? 'R$  ' + inputVal : '') + '" oninput="Wizard.amountInput(this)">' +
      splitHtml + prize;
    footer.innerHTML = '<button class="btn-primary" onclick="Wizard.amountContinue()">Continuar</button>';
  },
  pickSplit(mode) {
    this.draft.splitMode = mode;
    this.render();
  },
  pickAmount(v) {
    this.draft.amount = v;
    this.draft.customAmount = '';
    if (!this.draft.splitMode) this.draft.splitMode = 'each';
    this.render();
  },
  amountInput(el) {
    Wallet.maskMoney(el);
    var raw = el.value.replace(/\D/g, '');
    var n = raw ? (parseInt(raw, 10) / 100) : 0;
    this.draft.customAmount = n ? n.toFixed(2).replace('.', ',') : '';
    this.draft.amount = n || null;
    this.render();
  },
  amountContinue() {
    if (!this.draft.amount || this.draft.amount <= 0) { toast('Escolha um valor válido.'); return; }
    if (this.draft.amount > STATE.points) { toast('Saldo insuficiente. Deposite mais.'); return; }
    this.next();
  },

  renderConfirm(body, footer) {
    var d = this.draft;
    var mult = d.tier ? d.tier.value : d.modality.mult;
    var multNum = parseFloat(String(mult).replace(/\./g, '').replace(',', '.')) || 0;
    var numP = d.palpites.length;
    var splitMode = d.splitMode || 'each';
    var totalBet = splitMode === 'each' ? d.amount * numP : d.amount;
    var perPalpite = splitMode === 'each' ? d.amount : d.amount / numP;
    var prize = perPalpite * multNum;
    var splitLabel = numP > 1 ? (splitMode === 'each' ? 'Cada Palpite' : 'Todos os Palpites') : '—';
    body.innerHTML = '<h2>Confirme sua aposta</h2>' +
      '<div class="wiz-confirm-card">' +
      '<div class="wiz-confirm-row"><span>Modalidade</span><span>' + d.modality.name + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Sorteio</span><span>' + d.loteria.name + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Palpites (' + numP + ')</span><span>' + d.palpites.join(', ') + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Colocação</span><span>' + (d.tier ? d.tier.label : '—') + '</span></div>' +
      (numP > 1 ? '<div class="wiz-confirm-row"><span>Divisão do valor</span><span>' + splitLabel + '</span></div>' : '') +
      '<div class="wiz-confirm-row"><span>Valor total apostado</span><span>' + Wallet.fmtBRL(totalBet) + '</span></div>' +
      '<div class="wiz-confirm-row total"><span>Prêmio estimado (por palpite)</span><span>' + Wallet.fmtBRL(prize) + '</span></div>' +
      '</div>';
    footer.innerHTML = '<button class="btn-primary" onclick="Wizard.confirmBet()">Confirmar Aposta</button>';
  },

  confirmBet() {
    var d = this.draft;
    var mod = d.modality;
    var isGroup = ['grupo','duque-grupo','terno-grupo'].includes(mod.id);
    var animal = isGroup ? animalByGroup(parseInt(d.palpites[0]) || 1) : null;
    var modKey = mod.id === 'grupo' || mod.id === 'duque-grupo' || mod.id === 'terno-grupo' ? 'grupo' : 'dezena';
    var mult = parseFloat(String(d.tier ? d.tier.value : mod.mult).replace(/\./g, '').replace(',', '.')) || 0;
    var numP = d.palpites.length;
    var splitMode = d.splitMode || 'each';
    var totalBet = splitMode === 'each' ? d.amount * numP : d.amount;
    var perPalpite = splitMode === 'each' ? d.amount : d.amount / numP;
    var placedAt = nowIso();
    var bet = {
      id: uid(),
      animal: animal || animalByGroup(1),
      modality: modKey,
      dezena: isGroup ? null : d.palpites[0],
      amount: totalBet,
      horario: d.loteria.name,
      placedAt: placedAt,
      resolveAt: new Date(Date.now() + 25000 + Math.random() * 20000).toISOString(),
      status: 'aguardando',
      payout: perPalpite * mult,
    };
    STATE.points -= totalBet;
    STATE.totalWagered += totalBet;
    STATE.totalBets += 1;
    STATE.bets.unshift(bet);
    Streak.markThisWeek();
    STATE.missionDoneToday = true;
    saveState();
    Achv.checkAll({ betPlacedAt: placedAt });
    Wizard.lastId = bet.id;
    this.step = 8;
    this.render();
    Render.home();
  },

  renderSuccess(body, footer) {
    var d = this.draft;
    var mult = parseFloat(String(d.tier ? d.tier.value : d.modality.mult).replace(/\./g, '').replace(',', '.')) || 0;
    var numP = d.palpites.length;
    var splitMode = d.splitMode || 'each';
    var totalBet = splitMode === 'each' ? d.amount * numP : d.amount;
    var perPalpite = splitMode === 'each' ? d.amount : d.amount / numP;
    var prize = perPalpite * mult;
    body.innerHTML = '<div class="wiz-success">' +
      '<div class="wiz-success-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
      '<h2>Aposta confirmada!</h2>' +
      '<p>Boa sorte! Você verá o resultado em Minhas Apostas.</p>' +
      '<div class="wiz-confirm-card">' +
      '<div class="wiz-confirm-row"><span>Modalidade</span><span>' + d.modality.name + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Sorteio</span><span>' + d.loteria.name + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Palpites (' + numP + ')</span><span>' + d.palpites.join(', ') + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Colocação</span><span>' + (d.tier ? d.tier.label : '—') + '</span></div>' +
      '<div class="wiz-confirm-row"><span>Valor total apostado</span><span>' + Wallet.fmtBRL(totalBet) + '</span></div>' +
      '<div class="wiz-confirm-row total"><span>Prêmio estimado (por palpite)</span><span>' + Wallet.fmtBRL(prize) + '</span></div>' +
      '</div></div>';
    footer.innerHTML = '<button class="btn-primary" onclick="go(\'s-home\')">Voltar para o site</button>';
  },
};

const Bet = {
  start() { Wizard.start(); },
  lastId: null,
  shareLast() {
    var b = STATE.bets.find(function(x) { return x.id === Wizard.lastId; });
    if (!b) return;
    STATE.feed.unshift({
      id: uid(), from: 'Você', avatar: STATE.avatar || '🦊',
      text: 'apostou no ' + b.animal.emoji + ' ' + b.animal.name + ' (' + MODALITY[b.modality].label + ') — ' + fmtPoints(b.amount) + ' pts',
      at: nowIso(),
    });
    saveState();
    toast('Palpite compartilhado com seus amigos!');
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
        html: won
          ? 'Resultado saiu:<br><span class="notif-win">Parabéns, você ganhou <strong>' + Wallet.fmtBRL(b.payout) + '</strong></span>'
          : 'Resultado saiu:<br><span class="notif-loss">Não foi dessa vez. Tente novamente!</span>',
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
const DEPOSIT_PRESETS = [10, 30, 50, 100];
const DEPOSIT_POPULAR = 30;
const SAQUE_TAXA = 2.50;
const Wallet = {
  selectedAmount: null,
  fmtBRL(v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); },
  maskMoney(el) {
    var v = el.value.replace(/\D/g, '');
    if (!v) { el.value = ''; Wallet.selectedAmount = null; return; }
    var n = (parseInt(v, 10) / 100).toFixed(2);
    el.value = n.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    Wallet.selectedAmount = parseFloat(n);
    document.querySelectorAll('#depositAmounts .dep-tile').forEach(function(t) { t.classList.remove('selected'); });
  },
  deposit() {
    var custom = document.getElementById('depositCustom').value.replace(/\D/g, '');
    var amount = custom ? parseInt(custom, 10) / 100 : Wallet.selectedAmount || 0;
    if (!amount || amount < 5) { toast('Valor mínimo: R$ 5,00'); return; }
    if (amount > 5000) { toast('Valor máximo: R$ 5.000,00'); return; }
    Wallet.pendingAmount = amount;
    Wallet.showPix(amount);
  },
  showPix(amount) {
    document.getElementById('pixValue').textContent = Wallet.fmtBRL(amount);
    var code = '00020126580014BR.GOV.BCB.PIX0136' + Wallet.genUUID() + '5802BR5913PALPITECLUBLTDA6009SAOPAULO62070503***6304' + Wallet.crc16();
    document.getElementById('pixCode').textContent = code;
    Wallet.pixCode = code;
    var qrEl = document.getElementById('pixQr');
    qrEl.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrEl, { text: code, width: 200, height: 200, correctLevel: QRCode.CorrectLevel.M });
    } else {
      qrEl.innerHTML = '<div style="width:200px;height:200px;background:#fff;border:2px solid #ddd;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#999;margin:0 auto">QR Code</div>';
    }
    Modal.open('modal-pix');
  },
  copyPix() {
    if (navigator.clipboard) navigator.clipboard.writeText(Wallet.pixCode);
    toast('Código copiado!');
  },
  closePix() {
    Modal.close('modal-pix');
    document.getElementById('depositCustom').value = '';
    Wallet.selectedAmount = null;
    go('s-home');
    Render.home();
  },
  confirmPix() {
    var amount = Wallet.pendingAmount || 0;
    STATE.balance = (STATE.balance || 0) + amount;
    if (!STATE.transactions) STATE.transactions = [];
    STATE.transactions.push({ id: uid(), type: 'deposit', amount: amount, at: nowIso() });
    STATE.notifications.unshift({ id: uid(), html: 'Seu depósito de <strong>' + Wallet.fmtBRL(amount) + '</strong> já caiu.', at: nowIso(), read: false });
    saveState();
    toast('Depósito de ' + Wallet.fmtBRL(amount) + ' confirmado!');
    Modal.close('modal-pix');
    document.getElementById('depositCustom').value = '';
    Wallet.selectedAmount = null;
    go('s-home');
    Render.home();
  },
  genUUID() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }); },
  crc16() { return (Math.random().toString(16).slice(2, 6)).toUpperCase(); },
  saquePixType: 'cpf',
  maskSaque(el) {
    var v = el.value.replace(/\D/g, '');
    if (!v) { el.value = ''; return; }
    var n = (parseInt(v, 10) / 100).toFixed(2);
    el.value = n.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },
  selectPixType(type) {
    Wallet.saquePixType = type;
    document.querySelectorAll('.saque-pix-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.pix === type); });
    var input = document.getElementById('saquePixKey');
    input.value = '';
    var u = loadUsers()[CURRENT_EMAIL];
    if (type === 'cpf') {
      input.placeholder = '000.000.000-00';
      input.inputMode = 'numeric';
      if (u && u.cpf) {
        var c = u.cpf.replace(/\D/g, '');
        input.value = c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    } else if (type === 'telefone') {
      input.placeholder = '(00) 00000-0000';
      input.inputMode = 'numeric';
      if (u && u.phone) {
        var p = u.phone.replace(/\D/g, '');
        if (p.length === 11) input.value = '(' + p.slice(0,2) + ') ' + p.slice(2,7) + '-' + p.slice(7);
        else if (p.length === 10) input.value = '(' + p.slice(0,2) + ') ' + p.slice(2,6) + '-' + p.slice(6);
      }
    } else {
      input.placeholder = 'seu@email.com';
      input.inputMode = 'email';
      if (u && u.email) input.value = u.email;
    }
  },
  maskPixKey(el) {
    if (Wallet.saquePixType === 'cpf') RegWizard.maskCpf(el);
    else if (Wallet.saquePixType === 'telefone') RegWizard.maskPhone(el);
  },
  withdraw() {
    var raw = document.getElementById('saqueValor').value.replace(/\D/g, '');
    var amount = raw ? parseInt(raw, 10) / 100 : 0;
    if (!amount || amount < 5) { toast('Valor mínimo: R$ 5,00'); return; }
    if (amount > 50000) { toast('Valor máximo por saque: R$ 50.000,00. Para valores maiores, solicite em mais de um saque.'); return; }
    if (amount > STATE.points) { toast('Saldo insuficiente.'); return; }
    var pixKey = document.getElementById('saquePixKey').value.trim();
    if (!pixKey) { toast('Informe sua chave Pix.'); return; }
    var total = amount - SAQUE_TAXA;
    if (total <= 0) { toast('O valor precisa ser maior que a taxa de R$ 2,50.'); return; }
    STATE.points -= amount;
    if (!STATE.transactions) STATE.transactions = [];
    STATE.transactions.push({ id: uid(), type: 'withdrawal', amount: amount, total: total, at: nowIso() });
    STATE.notifications.unshift({ id: uid(), html: 'Saque <strong>' + Wallet.fmtBRL(total) + '</strong> solicitado e aprovado.', at: nowIso(), read: false });
    saveState();
    document.getElementById('saqueResumoValor').textContent = Wallet.fmtBRL(amount);
    document.getElementById('saqueResumoTotal').textContent = Wallet.fmtBRL(total);
    Modal.open('saqueConfirm');
  },
  closeSaque() {
    Modal.close('saqueConfirm');
    document.getElementById('saqueValor').value = '';
    document.getElementById('saquePixKey').value = '';
    go('s-home');
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
  goTab(tab) {
    this.currentTab = tab;
    go('s-apostas');
    this.showTab(tab);
  },
};

/* ---------------- amigos ---------------- */
const Amigos = {
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
  shareQR() {
    var u = loadUsers()[CURRENT_EMAIL];
    var name = u ? u.name : 'Amigo';
    var msg = encodeURIComponent('Vem jogar comigo no Palpite Club! 🎲🍀 Adiciona meu perfil: ' + name);
    window.open('https://wa.me/?text=' + msg, '_blank');
  },
};

/* ---------------- account ---------------- */
const Account = {
  editing: null,
  fmtPhone(digits) {
    var v = digits.slice(0, 11);
    if (v.length > 6) return '(' + v.slice(0,2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(v.length - 4);
    if (v.length > 2) return '(' + v.slice(0,2) + ') ' + v.slice(2);
    return v;
  },
  maskPhone(el) {
    var v = el.value.replace(/\D/g, '').slice(0, 11);
    el.value = this.fmtPhone(v);
  },
  openEmailModal() {
    var u = loadUsers()[CURRENT_EMAIL];
    document.getElementById('emailAtualDisplay').value = (u.email || '').toUpperCase();
    document.getElementById('emailNovo').value = '';
    document.getElementById('emailConfirma').value = '';
    document.getElementById('emailError').textContent = '';
    Modal.open('emailModal');
  },
  changeEmail() {
    var novo = document.getElementById('emailNovo').value.trim();
    var confirma = document.getElementById('emailConfirma').value.trim();
    var errorEl = document.getElementById('emailError');
    if (!novo) { errorEl.textContent = 'Digite o novo e-mail.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novo)) { errorEl.textContent = 'E-mail inválido.'; return; }
    if (novo.toLowerCase() !== confirma.toLowerCase()) { errorEl.textContent = 'Os e-mails não coincidem.'; return; }
    var users = loadUsers();
    users[CURRENT_EMAIL].email = novo;
    saveUsers(users);
    Modal.close('emailModal');
    Render.conta();
    toast('E-mail alterado com sucesso!');
  },
  openTelModal() {
    var u = loadUsers()[CURRENT_EMAIL];
    var p = (u.phone || '').replace(/\D/g, '');
    document.getElementById('telAtualDisplay').value = Account.fmtPhone(p);
    document.getElementById('telNovo').value = '';
    document.getElementById('telConfirma').value = '';
    document.getElementById('telError').textContent = '';
    Modal.open('telModal');
  },
  changeTel() {
    var novo = document.getElementById('telNovo').value.replace(/\D/g, '');
    var confirma = document.getElementById('telConfirma').value.replace(/\D/g, '');
    var errorEl = document.getElementById('telError');
    if (!novo || novo.length < 10) { errorEl.textContent = 'Digite um telefone válido (mínimo 10 dígitos).'; return; }
    if (novo !== confirma) { errorEl.textContent = 'Os telefones não coincidem.'; return; }
    var users = loadUsers();
    users[CURRENT_EMAIL].phone = novo;
    saveUsers(users);
    Modal.close('telModal');
    Render.conta();
    toast('Telefone alterado com sucesso!');
  },
  confirmDelete() {
    const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    const el = document.getElementById('deleteModalSaldo');
    if (el) el.textContent = fmtBRL(STATE.points);
    const ap = document.getElementById('deleteModalApostas');
    if (ap) ap.textContent = STATE.bets.filter(b => b.status === 'pendente').length;
    Modal.open('deleteModal');
  },
  toggleSenha() {
    document.getElementById('senhaAtual').value = '';
    document.getElementById('senhaNova').value = '';
    document.getElementById('senhaConfirma').value = '';
    document.getElementById('senhaError').textContent = '';
    Modal.open('senhaModal');
  },
  changePassword() {
    var atual = document.getElementById('senhaAtual').value;
    var nova = document.getElementById('senhaNova').value;
    var confirma = document.getElementById('senhaConfirma').value;
    var errorEl = document.getElementById('senhaError');
    var users = loadUsers();
    var user = users[CURRENT_EMAIL];
    if (!atual) { errorEl.textContent = 'Digite sua senha atual.'; return; }
    if (user.password !== atual) { errorEl.textContent = 'Senha atual incorreta.'; return; }
    if (!nova || nova.length < 6) { errorEl.textContent = 'A nova senha deve ter no mínimo 6 caracteres.'; return; }
    if (nova !== confirma) { errorEl.textContent = 'As senhas não coincidem.'; return; }
    user.password = nova;
    saveUsers(users);
    errorEl.textContent = '';
    Modal.close('senhaModal');
    toast('Senha alterada com sucesso!');
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
    else if (id === 's-wizard') Wizard.render();
    else if (id === 's-perfil') this.perfil();
    else if (id === 's-conquistas') this.conquistas();
    else if (id === 's-amigos') this.amigos();
    else if (id === 's-adicionar-amigos') this.buscaAmigos();
    else if (id === 's-cotacoes') this.cotacoes();
    else if (id === 's-roleta') this.roleta();
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
    const carteiraSaldoEl = document.getElementById('carteiraSaldo'); if (carteiraSaldoEl) carteiraSaldoEl.textContent = fmtBRL(STATE.points);
    const tierChip = document.getElementById('homeTierChip');
    if (tierChip) tierChip.textContent = `${tier.icon} ${tier.name}`;
    const unread = STATE.notifications.filter((n) => !n.read).length;
    const badge = document.getElementById('menuNotifBadge');
    if (badge) { badge.hidden = unread === 0; badge.textContent = unread; }
    document.getElementById('whatsappBtn')?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Preciso de ajuda no Palpite Club.')}`);
  },
  home() {
    if (!STATE) return;
    var dateEl = document.getElementById('homeDate');
    if (dateEl) {
      var dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
      var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
      var now = new Date();
      var d = now.getDate(); var pad = d < 10 ? '0' + d : d;
      dateEl.textContent = 'hoje - dia ' + pad + ' (' + dias[now.getDay()] + ') de ' + meses[now.getMonth()] + ' de ' + now.getFullYear() + '.';
    }
    var walletEl = document.getElementById('homeWalletVal');
    if (walletEl) walletEl.textContent = 'R$ ' + Number(STATE.points).toFixed(2).replace('.', ',');
    var homeSaque = document.getElementById('homeSaqueVal');
    if (homeSaque) homeSaque.textContent = Number(STATE.points).toFixed(2).replace('.', ',');
    document.getElementById('streakCount').textContent = STATE.streak;
    const betsEl = document.getElementById('homeTotalWins');
    if (betsEl) betsEl.textContent = STATE.bets.filter(b => b.status === 'ganhou').length;
    var medalsEl = document.getElementById('homeTotalMedals');
    if (medalsEl) medalsEl.textContent = ACHIEVEMENTS.filter(function(a) { return STATE.achievements[a.id]; }).length;

    const results = document.getElementById('homeResultsPreview');
    if (results) {
      const recentResolved = STATE.bets.filter((b) => b.status !== 'aguardando').slice(0, 3);
      results.innerHTML = recentResolved.length
        ? recentResolved.map((b) => resultRowHtml(b)).join('')
        : `<p class="muted-note">Nenhum resultado ainda. Faça sua primeira aposta!</p>`;
    }

    const feed = document.getElementById('homeFeedPreview');
    if (feed) feed.innerHTML = STATE.feed.slice(0, 2).map((f) => feedRowHtml(f)).join('') || `<p class="muted-note">Adicione amigos para ver os palpites deles aqui.</p>`;

  },
  roleta() {
    if (!Roleta._home2Init) {
      var strip2 = document.getElementById('rbPickerStrip2');
      if (strip2 && strip2.children.length === 0) {
        Roleta.buildPicker('2');
        Roleta.initPickerSwipe('2');
        Roleta.buildWheel('2');
        Roleta.updateValor();
        Roleta.pickerCenterOn(Roleta.selectedAnimal, false, '2');
        Roleta._home2Init = true;
      }
    }
  },
  notificacoes() {
    const list = document.getElementById('notifList');
    STATE.notifications.forEach((n) => (n.read = true));
    saveState();
    list.innerHTML = STATE.notifications.length
      ? STATE.notifications.map(function(n) {
          var content = n.html || ('<strong>' + n.text + '</strong>');
          return '<div class="notif-card"><div class="notif-body">' + content + '</div><p class="notif-time">' + fmtDateTime(n.at) + '</p></div>';
        }).join('')
      : emptyState('', 'Sem notificações', 'Avisamos aqui quando houver novidades.');
    this.topbars();
  },
  conta() {
    const u = loadUsers()[CURRENT_EMAIL];
    const el = (id) => document.getElementById(id);
    if (el('contaNomeDisplay')) el('contaNomeDisplay').textContent = u.name.toUpperCase();
    if (el('contaNascDisplay')) el('contaNascDisplay').textContent = u.birth || '—';
    if (el('contaCpfDisplay')) el('contaCpfDisplay').textContent = u.cpf ? u.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '—';
    if (el('contaEmailDisplay')) el('contaEmailDisplay').textContent = (u.email || '—').toUpperCase();
    if (el('contaTelDisplay')) {
      var p = (u.phone || '').replace(/\D/g, '');
      if (p.length === 11) el('contaTelDisplay').textContent = '(' + p.slice(0,2) + ') ' + p.slice(2,7) + '-' + p.slice(7);
      else if (p.length === 10) el('contaTelDisplay').textContent = '(' + p.slice(0,2) + ') ' + p.slice(2,6) + '-' + p.slice(6);
      else el('contaTelDisplay').textContent = u.phone || '—';
    }
  },
  extratoFilter: 'todos',
  extratoLimit: 5,
  apostasFilter: 'aguardando',
  apostasLimit: 5,
  carteira() {
    document.getElementById('carteiraSaldo').textContent = Wallet.fmtBRL(STATE.points);
    document.getElementById('carteiraSaqueVal').textContent = Number(STATE.points).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.renderExtrato();
    this.renderApostas();
  },
  filterApostas(filter) {
    this.apostasFilter = filter;
    this.apostasLimit = 5;
    document.querySelectorAll('.apostas-filter').forEach(function(b) { b.classList.toggle('active', b.dataset.filter === filter); });
    this.renderApostas();
  },
  renderApostas() {
    var filter = this.apostasFilter;
    var apostasEl = document.getElementById('apostasCarteira');
    var bets = STATE.bets;
    if (filter === 'aguardando') bets = bets.filter(function(b) { return b.status === 'aguardando'; });
    else if (filter === 'ganhou') bets = bets.filter(function(b) { return b.status === 'ganhou'; });
    else if (filter === 'perdeu') bets = bets.filter(function(b) { return b.status === 'perdeu'; });
    var betRows = bets.map(function(b) { return { at: b.placedAt, html: betRowHtml(b) }; });
    betRows.sort((a, c) => new Date(c.at) - new Date(a.at));
    var emptyMsg = filter === 'aguardando' ? 'Nenhuma aposta aguardando resultado.' : filter === 'ganhou' ? 'Nenhuma vitória encontrada.' : filter === 'perdeu' ? 'Nenhuma aposta perdida.' : 'Faça uma aposta para ver aqui.';
    var total = betRows.length;
    var visible = betRows.slice(0, this.apostasLimit);
    var html = visible.map((r) => r.html).join('');
    if (total > this.apostasLimit) html += '<button class="ver-mais-btn" onclick="Render.apostasLimit=' + total + ';Render.renderApostas()">Ver mais (' + (total - this.apostasLimit) + ')</button>';
    apostasEl.innerHTML = total ? html : emptyState('', 'Sem apostas', emptyMsg);
  },
  filterExtrato(filter) {
    this.extratoFilter = filter;
    this.extratoLimit = 5;
    document.querySelectorAll('.extrato-filter').forEach(function(b) { b.classList.toggle('active', b.dataset.filter === filter); });
    this.renderExtrato();
  },
  renderExtrato() {
    var filter = this.extratoFilter;
    var extratoList = document.getElementById('extratoList');
    var txns = STATE.transactions || [];
    var filtered = filter === 'todos' ? txns : txns.filter(function(t) { return t.type === filter; });
    var txnRows = [];
    filtered.forEach(function(t) {
      if (t.type === 'deposit') {
        txnRows.push({ at: t.at, html: '<div class="extrato-item"><div class="extrato-top"><div><div class="extrato-title">Depósito</div><div class="extrato-date">' + fmtDateTime(t.at) + '</div></div><div class="extrato-amount pos">+ ' + Wallet.fmtBRL(t.amount) + '</div></div></div>' });
      } else if (t.type === 'withdrawal') {
        txnRows.push({ at: t.at, html: '<div class="extrato-item"><div class="extrato-top"><div><div class="extrato-title">Saque</div><div class="extrato-date">' + fmtDateTime(t.at) + '</div></div><div class="extrato-amount neg">- ' + Wallet.fmtBRL(t.amount) + '</div></div></div>' });
      }
    });
    txnRows.sort((a, c) => new Date(c.at) - new Date(a.at));
    var emptyMsg = filter === 'deposit' ? 'Nenhum depósito encontrado.' : filter === 'withdrawal' ? 'Nenhum saque encontrado.' : 'Deposite para começar a jogar.';
    var total = txnRows.length;
    var visible = txnRows.slice(0, this.extratoLimit);
    var html = visible.map((r) => r.html).join('');
    if (total > this.extratoLimit) html += '<button class="ver-mais-btn" onclick="Render.extratoLimit=' + total + ';Render.renderExtrato()">Ver mais (' + (total - this.extratoLimit) + ')</button>';
    extratoList.innerHTML = total ? html : emptyState('', 'Sem transações', emptyMsg);
  },
  depositar() {
    const grid = document.getElementById('depositAmounts');
    grid.innerHTML = DEPOSIT_PRESETS.map(function(v) {
      return '<div class="dep-tile" onclick="Render.selectDeposit(' + v + ', this)"><span class="dep-tile-val">R$ ' + v + ',00</span></div>';
    }).join('');
    Wallet.selectedAmount = null;
    document.getElementById('depositCustom').value = '';
  },
  selectDeposit(v, el) {
    document.querySelectorAll('#depositAmounts .dep-tile').forEach(function(t) { t.classList.remove('selected'); });
    el.classList.add('selected');
    Wallet.selectedAmount = v;
    var n = v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    document.getElementById('depositCustom').value = n;
  },
  sacar() {
    var disp = document.getElementById('saqueDisponivel');
    if (disp) disp.textContent = Wallet.fmtBRL(STATE.points);
    document.getElementById('saqueValor').value = '';
    Wallet.selectPixType('cpf');
  },
  resultados() {
    var dt = new Date();
    var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    var dateEl = document.getElementById('resDateText');
    if (dateEl) dateEl.textContent = 'Hoje, ' + dt.getDate() + ' de ' + meses[dt.getMonth()] + ' de ' + dt.getFullYear();
    var list = document.getElementById('resDrawsList');
    if (!list) return;
    var draws = Resultados.generateDraws();
    list.innerHTML = draws.map(function(d, idx) {
      if (d.pending) {
        return '<div class="res-draw-block"><div class="res-draw-head"><span class="res-draw-time">' + d.label + '</span></div><span class="res-draw-pending">PENDENTE</span></div>';
      }
      var html = '<div class="res-draw-block"><div class="res-draw-head"><span class="res-draw-time">' + d.label + '</span></div>';
      html += '<div class="res-premio-label">1º PRÊMIO</div>';
      html += '<div class="res-premio-row"><span class="res-premio-num">' + d.premios[0].num + '</span><span class="res-premio-animal">' + d.premios[0].animal + '</span></div>';
      html += '<button class="res-expand-btn" onclick="Resultados.toggle(' + idx + ')"><span>2º - 5º Prêmio</span><span class="arrow">▼</span></button>';
      html += '<div class="res-extra-premios" id="resExtra' + idx + '">';
      for (var i = 1; i < d.premios.length; i++) {
        html += '<div class="res-premio-label">' + (i + 1) + 'º PRÊMIO</div>';
        html += '<div class="res-premio-row"><span class="res-premio-num">' + d.premios[i].num + '</span><span class="res-premio-animal">' + d.premios[i].animal + '</span></div>';
      }
      html += '</div></div>';
      return html;
    }).join('');
  },
  apostas() {
    const tab = Apostas.currentTab;
    const map = { aguardando: 'aguardando', ganhou: 'ganhou', perdeu: 'perdeu' };
    const filtered = STATE.bets.filter((b) => b.status === map[tab]);
    const list = document.getElementById('apostasList');
    var emptyTitle, emptySub, emptyCta;
    if (tab === 'aguardando') {
      emptyTitle = 'Nenhuma aposta pendente';
      emptySub = 'Você não possui nenhum jogo aguardando resultado.';
    } else if (tab === 'ganhou') {
      emptyTitle = 'Você ainda não ganhou nenhuma aposta';
      emptySub = 'Lembrete: Cada aposta é uma nova chance.';
    } else {
      emptyTitle = 'Nenhuma aposta perdida';
      emptySub = 'Quanto mais você tenta, mais perto fica da vitória.';
    }
    var gameButtons = '<div class="empty-game-btns">'
      + '<button class="empty-game-btn empty-game-btn--jb" onclick="go(\'s-jogo\')"><span class="empty-game-btn-label">Jogar Agora</span><span class="empty-game-btn-name">Jogo do Bicho</span></button>'
      + '<button class="empty-game-btn empty-game-btn--fed" onclick="go(\'s-federal\')"><span class="empty-game-btn-label">Jogar Agora</span><span class="empty-game-btn-name">Loteria Federal</span><span class="empty-game-btn-sub">Toda quarta-feira e domingo</span></button>'
      + '</div>';
    list.innerHTML = filtered.length ? filtered.map((b) => betRowHtml(b)).join('') : emptyState('', emptyTitle, emptySub, gameButtons);
  },
  // old game render methods removed — Wizard handles the flow
  perfil() {
    const u = loadUsers()[CURRENT_EMAIL];
    const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
    document.getElementById('perfilNome').textContent = u.name;
    const saldo = document.getElementById('perfilSaldo');
    if (saldo) saldo.textContent = fmtBRL(STATE.points);
    const saqueEl = document.getElementById('perfilSaque');
    if (saqueEl) saqueEl.textContent = Number(STATE.points).toFixed(2).replace('.', ',');
    const cpfEl = document.getElementById('perfilCpf');
    if (cpfEl && u.cpf) {
      const c = u.cpf.replace(/\D/g, '');
      cpfEl.textContent = 'CPF: ' + c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    const whatsEl = document.getElementById('perfilWhatsapp');
    if (whatsEl && u.phone) {
      const p = u.phone.replace(/\D/g, '');
      if (p.length === 11) whatsEl.textContent = 'WhatsApp: (' + p.slice(0,2) + ') ' + p.slice(2,7) + '-' + p.slice(7);
      else if (p.length === 10) whatsEl.textContent = 'WhatsApp: (' + p.slice(0,2) + ') ' + p.slice(2,6) + '-' + p.slice(6);
      else whatsEl.textContent = 'WhatsApp: ' + u.phone;
    }
    const desdeEl = document.getElementById('perfilDesde');
    if (desdeEl && u.createdAt) {
      const dt = new Date(u.createdAt);
      const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
      desdeEl.textContent = 'desde ' + dt.getDate() + ' de ' + meses[dt.getMonth()] + ' de ' + dt.getFullYear();
    }
    var pStreak = document.getElementById('perfilStreakCount');
    if (pStreak) pStreak.textContent = STATE.streak;
    var pWins = document.getElementById('perfilTotalWins');
    if (pWins) pWins.textContent = STATE.bets.filter(function(b) { return b.status === 'ganhou'; }).length;
    var pMedals = document.getElementById('perfilTotalMedals');
    var unlocked = ACHIEVEMENTS.filter(function(a) { return STATE.achievements[a.id]; });
    if (pMedals) pMedals.textContent = unlocked.length;
    var pcHead = document.getElementById('perfilConquistasHead');
    var pcGrid = document.getElementById('perfilConquistasGrid');
    if (pcGrid) {
      if (unlocked.length > 0) {
        if (pcHead) pcHead.style.display = '';
        pcGrid.innerHTML = unlocked.slice(0, 4).map(function(a) {
          var icon = a.img ? '<img class="achv-img" src="' + a.img + '" alt="' + a.name + '">' : '<span class="emoji">' + a.emoji + '</span>';
          return '<div class="achv-tile achv-tile--notext" onclick="Achv.detail(\'' + a.id + '\')">' + icon + '</div>';
        }).join('');
      } else {
        if (pcHead) pcHead.style.display = 'none';
        pcGrid.innerHTML = '';
      }
    }
    const amigosList = document.getElementById('perfilAmigosList');
    if (amigosList) {
      if (STATE.friends.length) {
        var html = STATE.friends.slice(0, 4).map(f => {
          const parts = f.name.split(' ').filter(Boolean);
          const ini = parts.map(w => w[0]).slice(0,2).join('').toUpperCase();
          const sobrenome = parts.length > 1 ? parts[parts.length - 1] : parts[0];
          return `<div class="perfil-amigo-item" onclick="Render.amigoPerfil('${f.email}')"><div class="avatar avatar-initials">${ini}</div><span>${sobrenome}</span></div>`;
        }).join('');
        html += `<div class="perfil-amigo-item" onclick="go('s-amigos')"><div class="avatar avatar-initials perfil-amigo-plus">+</div><span>Ver todos</span></div>`;
        amigosList.innerHTML = html;
      } else {
        amigosList.innerHTML = '<p style="font-size:12px;color:var(--ink-faint);margin:4px 0;">Nenhum amigo ainda.</p>';
      }
    }
    var aguardando = document.getElementById('perfilAguardando');
    var ganhou = document.getElementById('perfilGanhou');
    var perdeu = document.getElementById('perfilPerdeu');
    if (aguardando) aguardando.textContent = STATE.bets.filter(function(b) { return b.status === 'pendente'; }).length;
    if (ganhou) ganhou.textContent = STATE.bets.filter(function(b) { return b.status === 'ganhou'; }).length;
    if (perdeu) perdeu.textContent = STATE.bets.filter(function(b) { return b.status === 'perdeu'; }).length;
  },
  conquistas() {
    document.getElementById('achvGrid').innerHTML = ACHIEVEMENTS.map((a) => achvTileHtml(a, !!STATE.achievements[a.id])).join('');
  },
  amigos() {
    var list = document.getElementById('amigosFullList');
    if (!list) return;
    if (STATE.friends.length) {
      list.innerHTML = STATE.friends.map(function(f) {
        var parts = f.name.split(' ').filter(Boolean);
        var ini = parts.map(function(w) { return w[0]; }).slice(0,2).join('').toUpperCase();
        return '<div class="list-row friend-row" onclick="Render.amigoPerfil(\'' + f.email + '\')" style="cursor:pointer">' +
          '<div class="avatar avatar-initials">' + ini + '</div>' +
          '<div class="list-row-body"><strong>' + f.name + '</strong></div>' +
          '</div>';
      }).join('');
    } else {
      list.innerHTML = emptyState('🤝', 'Sem amigos ainda', 'Toque no + para adicionar amigos.');
    }
  },
  amigoPerfil(email) {
    var friend = DEMO_PEOPLE.find(function(p) { return p.email === email; });
    if (!friend) return;
    go('s-amigo-perfil');
    document.getElementById('amigoPerfilNome').textContent = friend.name;
    var seed = 0;
    for (var i = 0; i < email.length; i++) seed += email.charCodeAt(i);
    var streak = (seed % 10) + 2;
    var wins = (seed % 8) + 1;
    var conquistas = (seed % 5) + 2;
    document.getElementById('amigoPerfilDesde').textContent = 'aqui desde 2025';
    document.getElementById('amigoFreq').textContent = streak;
    document.getElementById('amigoWins').textContent = wins;
    document.getElementById('amigoConquistas').textContent = conquistas;

    var amigosList = document.getElementById('amigoAmigosList');
    if (amigosList) {
      var others = DEMO_PEOPLE.filter(function(p) { return p.email !== email; }).slice(0, 4);
      amigosList.innerHTML = others.map(function(f) {
        var parts = f.name.split(' ').filter(Boolean);
        var ini = parts.map(function(w) { return w[0]; }).slice(0,2).join('').toUpperCase();
        var sobrenome = parts.length > 1 ? parts[parts.length - 1] : parts[0];
        var isMyFriend = STATE.friends.find(function(fr) { return fr.email === f.email; });
        return '<div class="perfil-amigo-item">' +
          '<div class="avatar avatar-initials" onclick="Render.amigoPerfil(\'' + f.email + '\')">' + ini + '</div>' +
          '<span>' + sobrenome + '</span>' +
          (!isMyFriend ? '<button class="amigo-add-mini" onclick="Amigos.add(\'' + f.email + '\')">+</button>' : '') +
          '</div>';
      }).join('');
    }

    var cal = document.getElementById('amigoCalendario');
    if (cal) {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth();
      var meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var firstDay = new Date(year, month, 1).getDay();
      var activeDays = [];
      for (var d = 1; d <= daysInMonth; d++) {
        if ((seed + d * 7) % 3 !== 0 && d <= now.getDate()) activeDays.push(d);
      }
      var html = '<div class="freq-cal-header"><strong>' + meses[month] + ' ' + year + '</strong></div>';
      html += '<div class="freq-cal-grid">';
      var labels = ['D','S','T','Q','Q','S','S'];
      for (var l = 0; l < 7; l++) html += '<div class="freq-cal-day-label">' + labels[l] + '</div>';
      for (var e = 0; e < firstDay; e++) html += '<div class="freq-cal-day empty"></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var isActive = activeDays.indexOf(d) !== -1;
        html += '<div class="freq-cal-day' + (isActive ? ' active' : '') + '">' + d + '</div>';
      }
      html += '</div>';
      html += '<div class="freq-cal-legend"><span class="legend-active">Apostou</span><span class="legend-inactive">Não apostou</span></div>';
      cal.innerHTML = html;
    }

    var achvGrid = document.getElementById('amigoAchvGrid');
    if (achvGrid) {
      var unlockedCount = conquistas;
      achvGrid.innerHTML = ACHIEVEMENTS.map(function(a, i) {
        var unlocked = i < unlockedCount;
        return achvTileHtml(a, unlocked);
      }).join('');
    }
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
        '<button class="cot-jogar" onclick="Cotacoes.jogar(\'' + c.id + '\')">&#9654; JOGAR</button></div>' +
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
  instances: [],
  init: function() {
    this.initInstance('');
    this.initInstance('2');
  },
  initInstance: function(suffix) {
    var strip = document.getElementById('rbPickerStrip' + suffix);
    if (!strip) return;
    this.instances.push(suffix);
    this.buildPicker(suffix);
    this.initPickerSwipe(suffix);
    this.buildWheel(suffix);
    this.updateValor();
    var self = this;
    requestAnimationFrame(function() {
      self.pickerCenterOn(self.selectedAnimal, false, suffix);
    });
  },
  buildPicker: function(suffix) {
    suffix = suffix || '';
    var strip = document.getElementById('rbPickerStrip' + suffix);
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
    if (this.spinning) return;
    this.selectedAnimal = idx;
    document.querySelectorAll('.rb-picker-item').forEach(function(el) {
      el.classList.toggle('selected', parseInt(el.dataset.idx) === idx);
    });
  },
  applyGradient: function(wheel, n, seg, highlightIdx, color) {
    var c1 = '#2D2757', c2 = '#3A3170', cFree = '#2e8b3e';
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
  pickerCenterOn: function(idx, animate, suffix) {
    suffix = suffix || '';
    var carousel = document.getElementById('rbPickerCarousel' + suffix);
    var strip = document.getElementById('rbPickerStrip' + suffix);
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
  initPickerSwipe: function(suffix) {
    suffix = suffix || '';
    var carousel = document.getElementById('rbPickerCarousel' + suffix);
    var strip = document.getElementById('rbPickerStrip' + suffix);
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
      self.pickerCenterOn(animalIdx, true, suffix);
    }
    function onEnd() {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove('dragging');
      if (!didDrag) {
        self.pickerX = startScrollX;
        strip.style.transform = 'translateX(' + self.pickerX + 'px)';
        var el = document.elementFromPoint(startX, startY);
        if (el) {
          var item = el.closest('.rb-picker-item');
          if (item) {
            self.pickAnimal(parseInt(item.dataset.idx));
            self.pickerCenterOn(parseInt(item.dataset.idx), true, suffix);
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
    self.pickerCenterOn(self.selectedAnimal, false, suffix);
  },
  buildWheel: function(suffix) {
    suffix = suffix || '';
    var wheel = document.getElementById('rwWheel' + suffix);
    var pins = document.getElementById('rwPins' + suffix);
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
          '<img src="trevo.png" alt="Trevo da Sorte" style="width:70px;height:70px"></div>';
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
    var wrapEl = document.getElementById('rwWheelWrap' + suffix);
    if (wrapEl && suffix === '') wrapEl.classList.add('idle-spin');
  },
  spin: function() {
    if (this.spinning) return;
    this.spinning = true;
    var suffix = '';
    var wrap = document.getElementById('rwWheelWrap');
    if (!wrap || !wrap.offsetParent) { wrap = document.getElementById('rwWheelWrap2'); suffix = '2'; }
    this._lastSpinSuffix = suffix;
    wrap.classList.remove('idle-spin');
    var wheel = document.getElementById('rwWheel' + suffix);
    var btn = document.getElementById('rwSpinBtn' + suffix);
    var result = document.getElementById('rwResult' + suffix);
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
        self.freeSpinsLeft = 3;
        self.showResultOverlay('🍀 Trevo da sorte! 3 giros grátis', '#22c55e', function() {
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
            ? 'Parabéns, você está com sorte!'
            : 'Não foi dessa vez!';
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
            self.showResultOverlay('Parabéns, você está com sorte!', '#22c55e', null);
          } else {
            self.showResultOverlay('Não foi dessa vez!', '#ef4444', null);
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
    var suffix = this._lastSpinSuffix || '';
    var result = document.getElementById('rwResult' + suffix);
    if (result) {
      var text = msg.replace('\n', ' ');
      result.textContent = text;
      result.style.color = color;
      result.classList.add('rw-result-show');
      setTimeout(function() {
        result.classList.remove('rw-result-show');
        if (cb) cb();
      }, 2500);
    } else {
      if (cb) setTimeout(cb, 2500);
    }
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
    var suffixes = ['', '2'];
    var self = this;
    suffixes.forEach(function(s) {
      var disp = document.getElementById('rbValDisplay' + s);
      var ganhos = document.getElementById('rbGanhos' + s);
      if (disp) disp.textContent = self.fmtBRL(self.valor);
      if (ganhos) ganhos.textContent = self.fmtBRL(self.valor * self.mult);
    });
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
  },
  jogar: function(modId) {
    if (CURRENT_EMAIL) {
      Wizard.startWithMod(modId);
    } else {
      go('s-register');
    }
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
  const fmtBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `<div class="bet-card-detail bet-card-detail--${b.status}">
    <div class="bet-card-header"><span class="bet-card-mod">${MODALITY[b.modality].label}</span><span class="status-badge ${cls}">${label}</span></div>
    <div class="bet-card-row"><span>Sorteio</span><span>${b.horario}</span></div>
    <div class="bet-card-row"><span>Valor apostado</span><span>${fmtBRL(b.amount)}</span></div>
    <div class="bet-card-row bet-card-row--prize"><span>Prêmio potencial</span><span>${fmtBRL(b.payout)}</span></div>
    <div class="bet-card-date">${fmtDateTime(b.placedAt)}</div>
  </div>`;
}
function feedRowHtml(f) {
  return `<div class="list-row">
    <span class="avatar">${f.avatar}</span>
    <div class="list-row-body"><strong>${f.from}</strong><p>${f.text}</p></div>
  </div>`;
}
function achvTileHtml(a, unlocked) {
  var icon = a.img ? '<img class="achv-img" src="' + a.img + '" alt="' + a.name + '">' : '<span class="emoji">' + a.emoji + '</span>';
  return '<div class="achv-tile ' + (unlocked ? '' : 'locked') + '" onclick="Achv.detail(\'' + a.id + '\')">' + icon + '<span class="name">' + a.name + '</span></div>';
}
function emptyState(emoji, title, sub, extraHtml) {
  return '<div class="empty-state">' + (emoji ? '<div class="mascot">' + emoji + '</div>' : '') + '<strong>' + title + '</strong><p>' + sub + '</p>' + (extraHtml || '') + '</div>';
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

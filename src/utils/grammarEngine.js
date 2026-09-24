/**
 * Grammar Engine - Kavio English Smart Learning (Level A1)
 * Mesin logika gramatikal otomatis untuk konjugasi subjek, kata kerja, dan pembentukan kalimat.
 */

import { lookupVerb } from '../data/dictionary/verbsData.js';
import { lookupNominal } from '../data/dictionary/nominalData.js';

export const SUBJECT_TYPES = {
  FIRST_PERSON: 'FIRST_PERSON', // I
  SECOND_PERSON: 'SECOND_PERSON', // you
  THIRD_PERSON_SINGULAR: 'THIRD_PERSON_SINGULAR', // he, she, it, single noun/name
  PLURAL: 'PLURAL', // we, they, plural noun, compound "and"
};

export const IRREGULAR_VERBS = {
  go: 'went',
  eat: 'ate',
  sleep: 'slept',
  see: 'saw',
  buy: 'bought',
  drink: 'drank',
  write: 'wrote',
  come: 'came',
  read: 'read',
  make: 'made',
  take: 'took',
  sing: 'sang',
  speak: 'spoke',
  run: 'ran',
  give: 'gave',
  find: 'found',
  think: 'thought',
  teach: 'taught',
  swim: 'swam',
  fly: 'flew',
  drive: 'drove',
  break: 'broke',
  choose: 'chose',
  fall: 'fell',
  feel: 'felt',
  hear: 'heard',
  keep: 'kept',
  know: 'knew',
  leave: 'left',
  lose: 'lost',
  meet: 'met',
  pay: 'paid',
  put: 'put',
  cut: 'cut',
  hit: 'hit',
  say: 'said',
  send: 'sent',
  sit: 'sat',
  spend: 'spent',
  stand: 'stood',
  understand: 'understood',
  wear: 'wore',
  win: 'won',
  tell: 'told',
  build: 'built',
  catch: 'caught',
};

export const IRREGULAR_V3 = {
  go: 'gone',
  eat: 'eaten',
  sleep: 'slept',
  see: 'seen',
  buy: 'bought',
  drink: 'drunk',
  write: 'written',
  come: 'come',
  read: 'read',
  make: 'made',
  take: 'taken',
  sing: 'sung',
  speak: 'spoken',
  run: 'run',
  give: 'given',
  find: 'found',
  think: 'thought',
  teach: 'taught',
  swim: 'swum',
  fly: 'flown',
  drive: 'driven',
  break: 'broken',
  choose: 'chosen',
  fall: 'fallen',
  feel: 'felt',
  hear: 'heard',
  keep: 'kept',
  know: 'known',
  leave: 'left',
  lose: 'lost',
  meet: 'met',
  pay: 'paid',
  put: 'put',
  cut: 'cut',
  hit: 'hit',
  say: 'said',
  send: 'sent',
  sit: 'sat',
  spend: 'spent',
  stand: 'stood',
  understand: 'understood',
  wear: 'worn',
  win: 'won',
  tell: 'told',
  build: 'built',
  catch: 'caught',
  be: 'been',
  do: 'done',
  have: 'had',
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/**
 * Deteksi tipe subjek secara gramatikal
 */
export function detectSubjectType(subject) {
  if (!subject) return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  const rawTrimmed = subject.trim();
  const rawLower = rawTrimmed.toLowerCase();

  // 1. Cek kata hubung gabungan compound (" and ", " & ", " + ")
  if (/\band\b/i.test(rawTrimmed) || rawTrimmed.includes('&') || rawTrimmed.includes('+')) {
    return SUBJECT_TYPES.PLURAL;
  }

  // 2. Cek pronoun standar bawaan
  if (rawLower === 'i') return SUBJECT_TYPES.FIRST_PERSON;
  if (rawLower === 'you') return SUBJECT_TYPES.SECOND_PERSON;
  if (rawLower === 'we' || rawLower === 'they') return SUBJECT_TYPES.PLURAL;
  if (rawLower === 'he' || rawLower === 'she' || rawLower === 'it') {
    return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  }

  // 3. Normalisasi artikel: jika diawali "a " atau "an ", otomatis tunggal
  if (/^(a|an)\s+/i.test(rawTrimmed)) {
    return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  }

  // Hilangkan artikel "the ", "a ", "an " di depan untuk analisis kata inti (core noun)
  const coreNoun = rawTrimmed.replace(/^(the|a|an)\s+/i, '').trim();
  const coreLower = coreNoun.toLowerCase();

  // Cek kata hubung pada kata inti
  if (/\band\b/i.test(coreNoun) || coreNoun.includes('&') || coreNoun.includes('+')) {
    return SUBJECT_TYPES.PLURAL;
  }

  // 4. Whitelist kata benda tunggal yang berakhiran 's'
  const singularNounsEndingInS = [
    'news',
    'bus',
    'gas',
    'lens',
    'series',
    'species',
    'headquarters',
    'crossroads',
    'this',
    'yes',
  ];
  if (singularNounsEndingInS.includes(coreLower)) {
    return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  }

  // 5. Akhiran ganda "-ss" (boss, glass, class, grass, dress, pass) -> TUNGGAL
  if (coreLower.endsWith('ss')) {
    return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  }

  // 6. Jamak berakhiran "-sses" (bosses, glasses, classes, dresses) -> PLURAL
  if (coreLower.endsWith('sses')) {
    return SUBJECT_TYPES.PLURAL;
  }

  // 7. Nama orang dan entitas berakhiran 's' (Dimas, Hamas, James, Carlos, Lucas, Paris, dsb)
  const commonProperNamesEndingInS = [
    'dimas',
    'hamas',
    'james',
    'carlos',
    'lucas',
    'thomas',
    'charles',
    'marcus',
    'jonas',
    'nicholas',
    'andreas',
    'paris',
    'texas',
    'dallas',
    'laos',
    'cyprus',
    'athens',
    'brussels',
  ];
  if (commonProperNamesEndingInS.includes(coreLower)) {
    return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  }

  // Kata nama berakhiran vokal + s (-as, -es, -is, -os, -us) pada nama entitas / orang
  const isCapitalized = /^[A-Z]/.test(coreNoun);
  if (isCapitalized && /[aeiou]s$/i.test(coreNoun)) {
    if (!/^the\s+/i.test(rawTrimmed)) {
      return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
    }
  }

  // 8. Cek jamak beraturan: berakhiran huruf 's' biasa (bukan "-ss")
  if (coreLower.endsWith('s')) {
    return SUBJECT_TYPES.PLURAL;
  }

  // 9. Default fallback: selain aturan di atas -> subjek tunggal
  return SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
}

/**
 * Konjugasi kata kerja bentuk lampau (Past / Verb 2)
 */
export function getPastVerb(verb1) {
  if (!verb1) return 'worked';
  const v = verb1.trim().toLowerCase();
  const dict = lookupVerb(v);
  if (dict.isValid) {
    return dict.data.v2;
  }
  if (IRREGULAR_VERBS[v]) {
    return IRREGULAR_VERBS[v];
  }

  // Regular Verb Past Rules
  if (v.endsWith('e')) {
    return `${v}d`;
  }

  const lastChar = v.slice(-1);
  const secondLastChar = v.slice(-2, -1);

  if (lastChar === 'y') {
    if (!VOWELS.includes(secondLastChar)) {
      // Konsonan + y -> ied
      return `${v.slice(0, -1)}ied`;
    }
    // Vokal + y -> yed
    return `${v}ed`;
  }

  return `${v}ed`;
}

/**
 * Konjugasi kata kerja bentuk ketiga (Past Participle / Verb 3)
 */
export function getPastParticipleVerb(verb1) {
  if (!verb1) return 'worked';
  const v = verb1.trim().toLowerCase();
  const dict = lookupVerb(v);
  if (dict.isValid) {
    return dict.data.v3;
  }
  if (IRREGULAR_V3[v]) {
    return IRREGULAR_V3[v];
  }
  return getPastVerb(v);
}

/**
 * Konjugasi Present Tense untuk Third Person Singular (+s / +es / +ies)
 */
export function getPresentThirdPersonVerb(verb1) {
  if (!verb1) return 'works';
  const v = verb1.trim().toLowerCase();
  const dict = lookupVerb(v);
  if (dict.isValid) {
    return dict.data.s_form;
  }

  // Akhiran ch, sh, ss, x, z, o -> tambah es
  if (
    v.endsWith('ch') ||
    v.endsWith('sh') ||
    v.endsWith('ss') ||
    v.endsWith('x') ||
    v.endsWith('z') ||
    v.endsWith('o')
  ) {
    return `${v}es`;
  }

  const lastChar = v.slice(-1);
  const secondLastChar = v.slice(-2, -1);

  if (lastChar === 'y') {
    if (!VOWELS.includes(secondLastChar)) {
      // Konsonan + y -> ies
      return `${v.slice(0, -1)}ies`;
    }
    // Vokal + y -> ys
    return `${v}s`;
  }

  return `${v}s`;
}

/**
 * Format subject capitalization tergantung letaknya di awal atau tengah kalimat
 */
function formatSubjectText(subject, isAtStart) {
  if (!subject) return '';
  const trimmed = subject.trim();
  const lower = trimmed.toLowerCase();

  // "I" selalu kapital
  if (lower === 'i') return 'I';

  if (isAtStart) {
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  // Di tengah kalimat (interrogative): huruf kecil untuk pronoun umum
  if (['you', 'we', 'they', 'he', 'she', 'it'].includes(lower)) {
    return lower;
  }

  // Awalan artikel dibuat huruf kecil saat di tengah kalimat
  if (/^(the|a|an)\s+/i.test(trimmed)) {
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  }

  // Nama diri tetap pertahankan gaya aslinya
  return trimmed;
}

/**
 * Kamus singkatan Personal Pronoun + Helper BE / HAVE / MODAL untuk Kalimat Positif
 */
export const PRONOUN_CONTRACTIONS = {
  // Present BE (am / is / are)
  am: {
    i: "I'm",
  },
  is: {
    he: "He's",
    she: "She's",
    it: "It's",
  },
  are: {
    you: "You're",
    we: "We're",
    they: "They're",
  },
  // Future modal will
  will: {
    i: "I'll",
    you: "You'll",
    we: "We'll",
    they: "They'll",
    he: "He'll",
    she: "She'll",
    it: "It'll",
  },
  // Perfect have / has
  have: {
    i: "I've",
    you: "You've",
    we: "We've",
    they: "They've",
  },
  has: {
    he: "He's",
    she: "She's",
    it: "It's",
  },
};

/**
 * Mendapatkan bentuk singkatan Subjek + Helper jika memenuhi kriteria personal pronoun
 * @param {string} subject
 * @param {string} helper
 * @returns {string|null}
 */
export function getSubjectHelperContraction(subject, helper) {
  if (!subject || !helper) return null;
  const sLower = subject.trim().toLowerCase();
  const hLower = helper.trim().toLowerCase();
  if (PRONOUN_CONTRACTIONS[hLower] && PRONOUN_CONTRACTIONS[hLower][sLower]) {
    return PRONOUN_CONTRACTIONS[hLower][sLower];
  }
  return null;
}

// Preset objek untuk kalimat verbal (transitif)
export const OBJECT_PRESETS = [
  '(Tanpa Objek)',
  'a movie',
  'TV',
  'a book',
  'an apple',
  'the car',
  'English',
  'the homework',
  'a coffee',
];

/**
 * Kamus Terjemahan Bahasa Indonesia untuk Komputasi Kalimat Dinamis
 */
export const SUBJECT_TRANSLATIONS = {
  I: 'Saya',
  You: 'Kamu',
  We: 'Kami',
  They: 'Mereka',
  He: 'Dia',
  She: 'Dia',
  It: 'Itu',
  Sarah: 'Sarah',
  'Sarah & Angga': 'Sarah & Angga',
  'The book': 'Buku itu',
  'The books': 'Buku-buku itu',
  'A cat': 'Seekor kucing',
};

export const VERB_TRANSLATIONS = {
  study: { active: 'belajar', passive: 'dipelajari' },
  work: { active: 'bekerja', passive: null },
  go: { active: 'pergi', passive: null },
  eat: { active: 'makan', passive: 'dimakan' },
  sleep: { active: 'tidur', passive: null },
  watch: { active: 'menonton', passive: 'ditonton' },
  play: { active: 'bermain', passive: 'dimainkan' },
  help: { active: 'membantu', passive: 'dibantu' },
  sing: { active: 'bernyanyi', passive: 'dinyanyikan' },
  clean: { active: 'membersihkan', passive: 'dibersihkan' },
  buy: { active: 'membeli', passive: 'dibeli' },
  read: { active: 'membaca', passive: 'dibaca' },
  write: { active: 'menulis', passive: 'ditulis' },
  make: { active: 'membuat', passive: 'dibuat' },
  build: { active: 'membangun', passive: 'dibangun' },
  see: { active: 'melihat', passive: 'dilihat' },
  drink: { active: 'meminum', passive: 'diminum' },
  open: { active: 'membuka', passive: 'dibuka' },
  close: { active: 'menutup', passive: 'ditutup' },
  drive: { active: 'mengemudi', passive: 'dikemudikan' },
  call: { active: 'menelepon', passive: 'ditelepon' },
  visit: { active: 'mengunjungi', passive: 'dikunjungi' },
  teach: { active: 'mengajar', passive: 'diajarkan' },
  cook: { active: 'memasak', passive: 'dimasak' },
  wash: { active: 'mencuci', passive: 'dicuci' },
  listen: { active: 'mendengarkan', passive: 'didengarkan' },
  wait: { active: 'menunggu', passive: 'ditunggu' },
  meet: { active: 'menemui', passive: 'ditemui' },
  take: { active: 'mengambil', passive: 'diambil' },
  give: { active: 'memberi', passive: 'diberikan' },
  find: { active: 'menemukan', passive: 'ditemukan' },
  bring: { active: 'membawa', passive: 'dibawa' },
  leave: { active: 'meninggalkan', passive: 'ditinggalkan' },
  arrive: { active: 'tiba', passive: null },
  sit: { active: 'duduk', passive: null },
  stand: { active: 'berdiri', passive: null },
  smile: { active: 'tersenyum', passive: null },
  cry: { active: 'menangis', passive: null },
  laugh: { active: 'tertawa', passive: null },
  die: { active: 'mati', passive: null },
  happen: { active: 'terjadi', passive: null },
  run: { active: 'berlari', passive: null },
  walk: { active: 'berjalan', passive: null },
  swim: { active: 'berenang', passive: null },
  jump: { active: 'melompat', passive: null },
  speak: { active: 'berbicara', passive: 'dibicarakan' },
  talk: { active: 'berbicara', passive: null },
  understand: { active: 'memahami', passive: 'dipahami' },
  know: { active: 'tahu', passive: 'diketahui' },
  learn: { active: 'mempelajari', passive: 'dipelajari' },
  love: { active: 'mencintai', passive: 'dicintai' },
  like: { active: 'menyukai', passive: 'disukai' },
  need: { active: 'membutuhkan', passive: 'dibutuhkan' },
  want: { active: 'menginginkan', passive: 'diinginkan' },
  use: { active: 'menggunakan', passive: 'digunakan' },
  send: { active: 'mengirim', passive: 'dikirim' },
  pay: { active: 'membayar', passive: 'dibayar' },
  sell: { active: 'menjual', passive: 'dijual' },
  cut: { active: 'memotong', passive: 'dipotong' },
  fix: { active: 'memperbaiki', passive: 'diperbaiki' },
  repair: { active: 'memperbaiki', passive: 'diperbaiki' },
  choose: { active: 'memilih', passive: 'dipilih' },
  wear: { active: 'memakai', passive: 'dipakai' },
};

export const OBJECT_TRANSLATIONS = {
  'a book': 'sebuah buku',
  'the book': 'buku itu',
  'the books': 'buku-buku itu',
  'the car': 'mobil itu',
  'an apple': 'sebuah apel',
  'a movie': 'sebuah film',
  TV: 'televisi',
  'the homework': 'pekerjaan rumah',
  English: 'bahasa Inggris',
  'a coffee': 'secangkir kopi',
};

export const NOMINAL_TRANSLATIONS = {
  happy: 'bahagia',
  busy: 'sibuk',
  ready: 'siap',
  sad: 'sedih',
  tired: 'lelah',
  smart: 'pintar',
  hungry: 'lapar',
  lazy: 'malas',
  healthy: 'sehat',
  strong: 'kuat',
  'a student': 'seorang siswa',
  teachers: 'para guru',
  'a doctor': 'seorang dokter',
  'a teacher': 'seorang guru',
  friends: 'teman-teman',
  'at home': 'di rumah',
  'in the room': 'di dalam ruangan',
  here: 'di sini',
  there: 'di sana',
  'at school': 'di sekolah',
  'at the office': 'di kantor',
  'in the office': 'di kantor',
};

export const TIME_SIGNAL_TRANSLATIONS = {
  'every day': 'setiap hari',
  usually: 'biasanya',
  always: 'selalu',
  often: 'sering',
  sometimes: 'kadang-kadang',
  yesterday: 'kemarin',
  'last night': 'tadi malam',
  'this morning': 'pagi ini',
  '2 days ago': '2 hari yang lalu',
  tomorrow: 'besok',
  tonight: 'malam ini',
  soon: 'segera',
  'next week': 'minggu depan',
  now: 'sekarang',
  'right now': 'saat ini',
  'at the moment': 'saat ini',
  'at 7 PM yesterday': 'pada jam 7 malam kemarin',
  'when you called': 'saat kamu menelepon',
  'at that time': 'pada waktu itu',
  'at 10 AM tomorrow': 'pada jam 10 pagi besok',
  'this time tomorrow': 'pada waktu ini besok',
  already: 'sudah',
  just: 'baru saja',
  yet: 'belum',
  'since morning': 'sejak pagi',
  'for 2 hours': 'selama 2 jam',
  'before yesterday': 'sebelum kemarin',
  'by the time': 'pada saat itu',
  'by tomorrow': 'menjelang besok',
  'by next week': 'menjelang minggu depan',
  'by 5 PM': 'menjelang jam 5 sore',
  'all day': 'sepanjang hari',
  'for 2 hours yesterday': 'selama 2 jam kemarin',
  'before he came': 'sebelum dia datang',
  'for 2 hours by tomorrow': 'selama 2 jam menjelang besok',
  'by next month': 'menjelang bulan depan',
  today: 'hari ini',
  nowadays: 'saat ini',
  'at present': 'pada saat ini',
  'last year': 'tahun lalu',
  'in the past': 'di masa lalu',
  '2 years ago': '2 tahun yang lalu',
  'in the future': 'di masa depan',
  someday: 'suatu hari nanti',
  'back then': 'saat itu dulu',
  lately: 'akhir-akhir ini',
  recently: 'baru-baru ini',
  'since yesterday': 'sejak kemarin',
  'for years': 'selama bertahun-tahun',
  before: 'sebelumnya',
  previously: 'sebelumnya',
  'by next year': 'menjelang tahun depan',
  'since then': 'sejak saat itu',
  'for years before': 'selama bertahun-tahun sebelumnya',
  'all along': 'sepanjang waktu',
};

export function translateSubject(subj) {
  if (!subj) return '';
  const trimmed = subj.trim();
  if (SUBJECT_TRANSLATIONS[trimmed]) return SUBJECT_TRANSLATIONS[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(SUBJECT_TRANSLATIONS)) {
    if (key.toLowerCase() === lower) return val;
  }
  return trimmed;
}

export function translateVerb(verb, isPassive = false) {
  if (!verb) return '';
  const lower = verb.trim().toLowerCase();
  const entry = VERB_TRANSLATIONS[lower];
  if (entry) {
    if (isPassive) {
      return entry.passive || `di-${entry.active || lower}`;
    }
    return entry.active;
  }
  return isPassive ? `di-${lower}` : lower;
}

export function translateObject(obj) {
  if (!obj || obj === 'none' || obj === '(Tanpa Objek)') return '';
  const trimmed = obj.trim();
  if (OBJECT_TRANSLATIONS[trimmed]) return OBJECT_TRANSLATIONS[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(OBJECT_TRANSLATIONS)) {
    if (key.toLowerCase() === lower) return val;
  }
  return trimmed;
}

export function translateComplement(comp) {
  if (!comp) return '';
  const trimmed = comp.trim();
  if (NOMINAL_TRANSLATIONS[trimmed]) return NOMINAL_TRANSLATIONS[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(NOMINAL_TRANSLATIONS)) {
    if (key.toLowerCase() === lower) return val;
  }
  return trimmed;
}

export function translateTimeSignal(ts) {
  if (!ts || ts === 'none') return '';
  const trimmed = ts.trim();
  if (TIME_SIGNAL_TRANSLATIONS[trimmed]) return TIME_SIGNAL_TRANSLATIONS[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(TIME_SIGNAL_TRANSLATIONS)) {
    if (key.toLowerCase() === lower) return val;
  }
  return trimmed;
}

export function translateAgent(subject) {
  if (!subject) return 'seseorang';
  const lower = subject.trim().toLowerCase();
  const agentMap = {
    i: 'saya',
    you: 'kamu',
    we: 'kami',
    they: 'mereka',
    he: 'dia',
    she: 'dia',
    it: 'itu',
  };
  if (agentMap[lower]) return agentMap[lower];
  return translateSubject(subject);
}

/**
 * Mesin Komputasi Terjemahan Bahasa Indonesia Dinamis
 * @param {Object} params
 * @returns {string} Kalimat terjemahan bahasa Indonesia lengkap
 */
export function getIndonesianTranslation({
  subject = 'Sarah',
  verb1 = 'study',
  tense = 'PRESENT',
  aspect = 'SIMPLE',
  form = 'positive',
  timeSignal,
  sentenceType = 'verbal',
  nominalComplement = 'happy',
  object = '',
  isPassive = false,
}) {
  const isQuestion = form === 'question';
  const isNegativeQuestion = form === 'negative_question' || form === '-?';
  const isNegative = form === 'negative';

  const cleanObj = object && object !== 'none' && object !== '(Tanpa Objek)' ? object.trim() : '';
  const isPassiveMode = sentenceType === 'verbal' && Boolean(isPassive);

  // 1. Tentukan Subjek, Predikat, Objek/Agen
  let subjIndo = '';
  let predikatIndo = '';
  let objIndo = '';
  let agentIndo = '';

  if (sentenceType === 'nominal') {
    subjIndo = translateSubject(subject);
    predikatIndo = translateComplement(nominalComplement);
  } else if (isPassiveMode) {
    const rawPassiveSubj = cleanObj || 'a book';
    const translatedSubj = translateObject(rawPassiveSubj) || translateSubject(rawPassiveSubj);
    subjIndo = translatedSubj.charAt(0).toUpperCase() + translatedSubj.slice(1);
    predikatIndo = translateVerb(verb1, true);
    agentIndo = `oleh ${translateAgent(subject)}`;
  } else {
    subjIndo = translateSubject(subject);
    predikatIndo = translateVerb(verb1, false);
    if (cleanObj) {
      objIndo = translateObject(cleanObj);
    }
  }

  // 2. Tentukan Aspek & Negasi Marker dalam Bahasa Indonesia
  let aspectMarker = '';
  let negationMarker = '';

  const isNounComplement =
    sentenceType === 'nominal' &&
    (/^(seorang|para|guru|dokter|teman|buku)/i.test(predikatIndo) ||
      /^(a |an |teachers|friends|students)/i.test(nominalComplement ? nominalComplement.trim() : ''));

  const defaultNegWord = isNounComplement ? 'bukan' : 'tidak';

  // Future
  if (tense === 'FUTURE') {
    if (aspect === 'CONTINUOUS') {
      aspectMarker = 'akan sedang';
    } else if (aspect === 'PERFECT') {
      aspectMarker = 'akan sudah';
    } else if (aspect === 'PER.CONT') {
      aspectMarker = 'akan sudah sedang';
    } else {
      aspectMarker = 'akan';
    }

    if (isNegative) {
      negationMarker = 'tidak';
    }
  }
  // Past / Present with Continuous or Perfect
  else if (aspect === 'CONTINUOUS') {
    aspectMarker = 'sedang';
    if (isNegative) {
      negationMarker = 'tidak';
    }
  } else if (aspect === 'PERFECT') {
    if (isNegative) {
      negationMarker = 'belum';
    } else {
      aspectMarker = 'sudah';
    }
  } else if (aspect === 'PER.CONT') {
    if (isNegative) {
      negationMarker = 'belum sedang';
    } else {
      aspectMarker = 'sudah sedang';
    }
  } else {
    // Simple Present / Past
    if (isNegative) {
      negationMarker = defaultNegWord;
    }
  }

  // Susun elemen kalimat inti (Subjek + [negasi] + [aspek] + Predikat + [Objek/Agen])
  const parts = [];

  if (isNegative) {
    if (negationMarker === 'belum' || negationMarker === 'belum sedang') {
      parts.push(subjIndo);
      parts.push(negationMarker);
      parts.push(predikatIndo);
    } else if (negationMarker) {
      parts.push(subjIndo);
      parts.push(negationMarker);
      if (aspectMarker) parts.push(aspectMarker);
      parts.push(predikatIndo);
    }
  } else {
    parts.push(subjIndo);
    if (aspectMarker) parts.push(aspectMarker);
    parts.push(predikatIndo);
  }

  if (objIndo) parts.push(objIndo);
  if (agentIndo) parts.push(agentIndo);

  // Tambahkan time signal jika ada
  const timeSignalIndo = translateTimeSignal(timeSignal);
  if (timeSignalIndo) {
    parts.push(timeSignalIndo);
  }

  const sentenceBody = parts.filter(Boolean).join(' ');

  // Awalan & Akhiran kalimat berdasarkan form
  let finalSentence = '';
  if (isNegativeQuestion) {
    finalSentence = `Bukankah ${sentenceBody.charAt(0).toLowerCase() + sentenceBody.slice(1)}?`;
  } else if (isQuestion) {
    finalSentence = `Apakah ${sentenceBody.charAt(0).toLowerCase() + sentenceBody.slice(1)}?`;
  } else {
    finalSentence = `${sentenceBody}.`;
  }

  return finalSentence;
}

/**
 * Konversi subjek aktif menjadi frasa pelaku pasif (Agent by + object pronoun/name)
 * @param {string} subject
 * @returns {string}
 */
export function getAgentPhrase(subject) {
  if (!subject) return 'by someone';
  const clean = subject.trim();
  const lower = clean.toLowerCase();
  const pronounMap = {
    i: 'by me',
    you: 'by you',
    we: 'by us',
    they: 'by them',
    he: 'by him',
    she: 'by her',
    it: 'by it',
  };
  if (pronounMap[lower]) {
    return pronounMap[lower];
  }
  return `by ${clean}`;
}

// Preset komplemen nominal (Adjective, Noun, Adverb of Place)
export const NOMINAL_PRESETS = [
  'happy',
  'ready',
  'busy',
  'smart',
  'tired',
  'a student',
  'teachers',
  'a doctor',
  'friends',
  'at home',
  'in the room',
  'on the table',
  'on the bus',
  'in Jakarta',
  'at the station',
  'here',
  'in the office',
  'at school',
];

/**
 * Konversi kata kerja dasar Verb 1 ke bentuk Verb-ing
 * @param {string} verb Kata kerja dasar
 * @returns {string}
 */
export function getVerbIng(verb) {
  if (!verb) return 'working';
  const clean = verb.trim().toLowerCase();
  const dict = lookupVerb(clean);
  if (dict.isValid) {
    return dict.data.gerund;
  }

  const specialIng = {
    be: 'being',
    die: 'dying',
    lie: 'lying',
    tie: 'tying',
    see: 'seeing',
    agree: 'agreeing',
    flee: 'fleeing',
    free: 'freeing',
    canoe: 'canoeing',
    dye: 'dyeing',
    age: 'aging',
  };
  if (specialIng[clean]) return specialIng[clean];

  if (clean.endsWith('ie')) {
    return clean.slice(0, -2) + 'ying';
  }

  if (clean.endsWith('e') && !clean.endsWith('ee') && !clean.endsWith('oe') && !clean.endsWith('ye')) {
    return clean.slice(0, -1) + 'ing';
  }

  const vowels = 'aeiou';
  const len = clean.length;
  if (len >= 3) {
    const c1 = clean[len - 3];
    const v = clean[len - 2];
    const c2 = clean[len - 1];
    const isVowel = (ch) => vowels.includes(ch);
    const isConsonant = (ch) => /[a-z]/.test(ch) && !vowels.includes(ch);

    if (
      isVowel(v) &&
      isConsonant(c2) &&
      !['w', 'x', 'y'].includes(c2) &&
      (len === 3 ? isConsonant(c1) : true)
    ) {
      const doublingVerbs = [
        'sit', 'run', 'swim', 'stop', 'get', 'cut', 'put', 'beg', 'plan',
        'rob', 'shop', 'drop', 'hop', 'hug', 'nod', 'slip', 'step', 'trip',
        'chat', 'clap', 'jog', 'dig', 'fit', 'hit', 'knit', 'let', 'set',
        'shut', 'win', 'begin', 'prefer', 'refer'
      ];
      if (doublingVerbs.includes(clean) || (len <= 4 && isConsonant(c1))) {
        return clean + c2 + 'ing';
      }
    }
  }

  return clean + 'ing';
}

/**
 * Tambahkan metadata tooltip edukatif ke setiap token kalimat
 * @param {Array<Object>} tokens
 * @param {Object} context
 * @returns {Array<Object>}
 */
export function attachTokenTooltips(tokens, context) {
  const {
    cleanSubject,
    cleanVerb,
    cleanObject,
    cleanComplement,
    cleanTimeSignal,
    subjectType,
    tense,
    aspect,
    form,
    sentenceType,
    isPassiveMode,
    verbCheck,
    nominalCheck,
  } = context;

  const isThirdPersonSingular = subjectType === SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  const isPlural = subjectType === SUBJECT_TYPES.PLURAL;

  return tokens.map((token) => {
    let tooltipTitle = '';
    let tooltipDescription = '';

    switch (token.role) {
      case 'subject': {
        if (isPassiveMode) {
          const passSubjType = detectSubjectType(token.text);
          const isPassPlural = passSubjType === SUBJECT_TYPES.PLURAL;
          tooltipTitle = `Subjek Pasif (${isPassPlural ? 'Jamak' : 'Tunggal'})`;
          tooltipDescription = `Objek "${token.text}" dipindahkan ke depan menjadi subjek penerima aksi pada kalimat pasif.`;
        } else {
          const sLower = token.text.toLowerCase();
          if (sLower === 'i') {
            tooltipTitle = 'Subjek Orang Pertama Tunggal (I)';
            tooltipDescription = 'Pelaku orang pertama ("Saya"). Menggunakan am / have / do di Present Tense.';
          } else if (sLower === 'you') {
            tooltipTitle = 'Subjek Orang Kedua (You)';
            tooltipDescription = 'Pelaku orang kedua ("Kamu"). Menggunakan are / have / do di Present Tense.';
          } else if (sLower === 'we') {
            tooltipTitle = 'Subjek Orang Pertama Jamak (We)';
            tooltipDescription = 'Pelaku jamak ("Kami/Kita"). Menggunakan are / have / do di Present Tense.';
          } else if (sLower === 'they') {
            tooltipTitle = 'Subjek Orang Ketiga Jamak (They)';
            tooltipDescription = 'Pelaku jamak ("Mereka"). Menggunakan are / have / do di Present Tense.';
          } else if (sLower === 'he' || sLower === 'she' || sLower === 'it') {
            tooltipTitle = `Subjek Orang Ketiga Tunggal (${token.text})`;
            tooltipDescription = 'Subjek tunggal (3rd Person Singular). Mewajibkan helper is / has / does atau V1+s/es.';
          } else if (isThirdPersonSingular) {
            tooltipTitle = 'Subjek Tunggal (3rd Person Singular)';
            tooltipDescription = `Subjek tunggal "${token.text}". Mewajibkan helper tunggal (is / has / does) atau akhiran -s/-es pada Present Simple.`;
          } else if (isPlural) {
            tooltipTitle = 'Subjek Jamak (Plural)';
            tooltipDescription = `Subjek jamak "${token.text}". Menggunakan helper jamak (are / have / do) dan kata kerja dasar.`;
          } else {
            tooltipTitle = 'Subjek Kalimat (Subject)';
            tooltipDescription = `Pelaku utama ("${token.text}") yang melakukan tindakan dalam kalimat.`;
          }
        }
        break;
      }

      case 'subject-contracted': {
        const subj = token.contractedSubject || token.text;
        const helper = token.contractedHelper || '';
        tooltipTitle = 'SINGKATAN (CONTRACTION)';
        tooltipDescription = `Gabungan subjek '${subj}' + helper '${helper}' menjadi '${token.text}'.`;
        break;
      }

      case 'helper-modal': {
        tooltipTitle = 'Modal Auxiliary (will)';
        tooltipDescription = 'Kata kerja bantu modal untuk menyatakan kepastian rencana di masa depan (Future Tense).';
        break;
      }

      case 'helper-have': {
        const hText = token.text.toLowerCase();
        if (hText.startsWith('had')) {
          tooltipTitle = 'Helper HAVE (Past Perfect)';
          tooltipDescription = 'Helper lampau "had" untuk menyatakan kejadian yang sudah selesai sebelum waktu lampau.';
        } else if (hText.startsWith('has')) {
          tooltipTitle = 'Helper HAVE (Present Perfect)';
          tooltipDescription = 'Helper "has" khusus subjek tunggal (He/She/It) untuk menyatakan aksi yang telah selesai.';
        } else {
          tooltipTitle = 'Helper HAVE (Present Perfect)';
          tooltipDescription = 'Helper "have" untuk subjek I/You/They/We untuk menyatakan aksi yang telah selesai.';
        }
        break;
      }

      case 'helper-be': {
        const bText = token.text.toLowerCase();
        if (bText === 'been') {
          tooltipTitle = 'Helper BE Participle (been)';
          tooltipDescription = 'Bentuk ketiga (V3) dari to be yang wajib hadir mendampingi helper HAVE pada aspek Perfect.';
        } else if (bText === 'being') {
          tooltipTitle = 'Helper BE Continuous (being)';
          tooltipDescription = 'Bentuk -ing dari to be untuk menegaskan proses yang sedang berlangsung (Continuous).';
        } else if (bText === 'be') {
          tooltipTitle = 'Helper BE Dasar (be)';
          tooltipDescription = 'Bentuk dasar to be setelah modal auxiliary "will" di masa depan (will be).';
        } else if (bText === 'is') {
          tooltipTitle = 'Helper BE Present (is)';
          tooltipDescription = 'Helper BE waktu sekarang khusus untuk subjek tunggal (He/She/It).';
        } else if (bText === 'am') {
          tooltipTitle = 'Helper BE Present (am)';
          tooltipDescription = 'Helper BE waktu sekarang khusus untuk subjek orang pertama ("I").';
        } else if (bText === 'are') {
          tooltipTitle = 'Helper BE Present (are)';
          tooltipDescription = 'Helper BE waktu sekarang untuk subjek jamak (They/We) dan subjek "You".';
        } else if (bText === 'was') {
          tooltipTitle = 'Helper BE Past (was)';
          tooltipDescription = 'Helper BE waktu lampau untuk subjek tunggal (He/She/It) dan subjek "I".';
        } else if (bText === 'were') {
          tooltipTitle = 'Helper BE Past (were)';
          tooltipDescription = 'Helper BE waktu lampau untuk subjek jamak (They/We) dan subjek "You".';
        } else {
          tooltipTitle = `Helper BE (${token.text})`;
          tooltipDescription = 'Kata kerja bantu to be penghubung subjek dengan predikat.';
        }
        break;
      }

      case 'helper-negative': {
        const nText = token.text.toLowerCase();
        if (nText === 'not') {
          tooltipTitle = 'Partikel Negasi (not)';
          tooltipDescription = 'Partikel pembentuk kalimat negatif yang diletakkan setelah helper utama.';
        } else {
          tooltipTitle = `Helper Negatif (${token.text})`;
          tooltipDescription = 'Bentuk singkatan negatif (contraction) dari helper dengan "not" untuk menyatakan sanggahan/tidak.';
        }
        break;
      }

      case 'helper-question': {
        tooltipTitle = `Helper Tanya (${token.text})`;
        tooltipDescription = 'Kata kerja bantu yang melompat ke depan subjek untuk membentuk kalimat tanya (Interrogative).';
        break;
      }

      case 'helper-negative-question': {
        tooltipTitle = `Helper Tanya Negatif (${token.text})`;
        tooltipDescription = 'Helper negatif di awal kalimat untuk menanyakan konfirmasi ("Bukankah ... ?").';
        break;
      }

      case 'verb': {
        const v1 = verbCheck?.data?.v1 || cleanVerb;
        if (token.isIng) {
          tooltipTitle = 'Verb-ing (Present Participle)';
          tooltipDescription = `Bentuk kata kerja berakhiran -ing dari "${v1}" untuk aksi yang sedang berlangsung.`;
        } else if (token.isV3) {
          if (isPassiveMode) {
            tooltipTitle = 'Verb 3 (Past Participle - Pasif)';
            tooltipDescription = `Bentuk ketiga dari "${v1}" yang dipadukan dengan helper BE untuk kalimat Pasif.`;
          } else {
            tooltipTitle = 'Verb 3 (Past Participle - Perfect)';
            tooltipDescription = `Bentuk ketiga dari "${v1}" yang dipadukan dengan helper HAVE untuk aspek Perfect.`;
          }
        } else if (token.isV2) {
          tooltipTitle = 'Verb 2 (Past Simple)';
          tooltipDescription = `Bentuk lampau dari "${v1}" khusus digunakan pada kalimat positif Past Simple.`;
        } else if (token.isConjugated) {
          tooltipTitle = 'Verb 1 (+s/es)';
          tooltipDescription = `Kata kerja "${v1}" mendapat akhiran -s/-es karena bersanding dengan subjek tunggal di Present Simple.`;
        } else {
          tooltipTitle = 'Verb 1 (Infinitive / Bentuk Dasar)';
          tooltipDescription = `Kata kerja dasar murni "${v1}" tanpa imbuhan.`;
        }
        break;
      }

      case 'complement': {
        const nType = nominalCheck?.type || 'adjective';
        if (nType === 'adjective') {
          tooltipTitle = 'Komplemen Sifat (Adjective)';
          tooltipDescription = `Kata sifat "${token.text}" yang menerangkan sifat atau kondisi dari subjek.`;
        } else if (nType === 'noun') {
          tooltipTitle = 'Komplemen Benda (Noun)';
          tooltipDescription = `Kata benda "${token.text}" yang mengidentifikasi profesi atau status subjek.`;
        } else {
          tooltipTitle = 'Komplemen Tempat (Adverb of Place)';
          tooltipDescription = `Keterangan tempat "${token.text}" yang menunjukkan lokasi keberadaan subjek.`;
        }
        break;
      }

      case 'object': {
        tooltipTitle = 'Objek Penderita (Direct Object)';
        tooltipDescription = `Kata benda "${token.text}" yang menjadi sasaran / penerima aksi langsung dari kata kerja.`;
        break;
      }

      case 'agent': {
        tooltipTitle = 'Frasa Agen (by + Pelaku)';
        tooltipDescription = `Frasa "${token.text}" menunjukkan siapa pelaku asli dari aksi dalam kalimat pasif.`;
        break;
      }

      case 'timeSignal': {
        tooltipTitle = 'Keterangan Waktu (Time Signal)';
        tooltipDescription = `Frasa waktu "${token.text}" yang mempertegas kapan peristiwa terjadi pada tenses ini.`;
        break;
      }

      case 'punctuation':
      default: {
        tooltipTitle = '';
        tooltipDescription = '';
        break;
      }
    }

    return {
      ...token,
      text: typeof token.text === 'string' ? token.text.trim() : token.text,
      tooltipTitle,
      tooltipDescription,
    };
  });
}

/**
 * Mesin utama pembuat kalimat terstruktur
 * @param {Object} params
 * @param {string} params.subject Subjek kalimat
 * @param {string} params.verb1 Kata kerja dasar
 * @param {'PRESENT'|'PAST'|'FUTURE'} params.tense Pilihan waktu utama
 * @param {'SIMPLE'|'CONTINUOUS'|'PERFECT'|'PER.CONT'} [params.aspect='SIMPLE'] Pilihan aspek waktu
 * @param {'positive'|'negative'|'question'|'negative_question'} params.form Bentuk kalimat
 * @param {string|null} params.timeSignal Keterangan waktu (opsional)
 * @param {boolean} [params.contracted=true] Mode singkatan (don't, doesn't, didn't, won't, isn't, aren't, etc.)
 * @param {'verbal'|'nominal'} [params.sentenceType='verbal'] Tipe kalimat (verbal atau nominal)
 * @param {boolean} [params.isContinuous=false] Mode continuous bawaan (fallback backwards-compatibility)
 * @param {string} [params.nominalComplement='happy'] Komplemen untuk kalimat nominal
 * @param {boolean} [params.isPassive=false] Mode Passive Voice (khusus kalimat verbal)
 * @param {string} [params.object=''] Objek penderita pada kalimat aktif / subjek pasif
 */
export function buildSentence({
  subject,
  verb1,
  tense = 'PRESENT',
  aspect = 'SIMPLE',
  form = 'positive',
  timeSignal,
  contracted = true,
  sentenceType = 'verbal',
  isContinuous = false,
  nominalComplement = 'happy',
  isPassive = false,
  object = '',
}) {
  const cleanSubject = subject ? subject.trim() : 'Sarah';
  const cleanVerb = verb1 ? verb1.trim().toLowerCase() : 'study';
  const cleanComplement = nominalComplement ? nominalComplement.trim() : 'happy';
  const cleanObject =
    object && object !== 'none' && object !== '(Tanpa Objek)' ? object.trim() : '';
  const cleanTimeSignal = timeSignal && timeSignal.trim() !== '' ? timeSignal.trim() : null;

  const subjectType = detectSubjectType(cleanSubject);
  const isThirdPersonSingular = subjectType === SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  const isFirstPerson = subjectType === SUBJECT_TYPES.FIRST_PERSON;
  const isNegativeQuestion = form === 'negative_question' || form === '-?';

  // Tentukan aspek efektif (utamakan aspect, lalu fallback ke isContinuous)
  const effectiveAspect = aspect || (isContinuous ? 'CONTINUOUS' : 'SIMPLE');

  const verbCheck = lookupVerb(cleanVerb);
  const nominalCheck = lookupNominal(cleanComplement);

  const isVerbValid = sentenceType === 'nominal' ? true : verbCheck.isValid;
  const isComplementValid = sentenceType === 'verbal' ? true : nominalCheck.isValid;

  const getPredicateToken = (aspectMode, tenseMode, formMode) => {
    if (sentenceType === 'nominal') {
      if (!nominalCheck.isValid) {
        return {
          id: 'token-complement',
          text: `[${cleanComplement || 'komplemen tidak valid'}]`,
          role: 'invalid',
          isInvalid: true,
        };
      }
      return {
        id: 'token-complement',
        text: nominalCheck.formatted,
        role: 'complement',
        nominalType: nominalCheck.type,
      };
    }

    // Verbal mode
    if (!verbCheck.isValid) {
      return {
        id: 'token-verb',
        text: `[${cleanVerb || 'kata kerja tidak valid'}]`,
        role: 'invalid',
        isInvalid: true,
      };
    }

    const { v1, v2, v3, gerund, s_form } = verbCheck.data;

    if (aspectMode === 'PERFECT') {
      return { id: 'token-verb', text: v3, role: 'verb', isV3: true };
    }
    if (aspectMode === 'PER.CONT' || aspectMode === 'CONTINUOUS') {
      return { id: 'token-verb', text: gerund, role: 'verb', isIng: true };
    }
    // Simple
    if (tenseMode === 'PRESENT') {
      if (formMode === 'positive' && isThirdPersonSingular) {
        return { id: 'token-verb', text: s_form, role: 'verb', isConjugated: true };
      }
      return { id: 'token-verb', text: v1, role: 'verb' };
    }
    if (tenseMode === 'PAST') {
      if (formMode === 'positive') {
        return { id: 'token-verb', text: v2, role: 'verb', isV2: true };
      }
      return { id: 'token-verb', text: v1, role: 'verb' };
    }
    if (tenseMode === 'FUTURE') {
      return { id: 'token-verb', text: v1, role: 'verb' };
    }
    return { id: 'token-verb', text: v1, role: 'verb' };
  };

  const tokens = [];

  const isPassiveMode =
    sentenceType === 'verbal' &&
    Boolean(isPassive) &&
    verbCheck.isValid &&
    verbCheck.data?.transitive !== false;

  const passiveSubject = cleanObject || 'a book';
  const agentPhrase = getAgentPhrase(cleanSubject);
  const passiveSubjType = detectSubjectType(passiveSubject);
  const isPassThird = passiveSubjType === SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
  const isPassFirst = passiveSubjType === SUBJECT_TYPES.FIRST_PERSON;

  // =========================================================================
  // PASSIVE VOICE SENTENCE BUILDER
  // =========================================================================
  if (isPassiveMode) {
    const v3Token = { id: 'token-verb', text: verbCheck.data.v3, role: 'verb', isV3: true };
    const agentToken = { id: 'token-agent', text: agentPhrase, role: 'agent' };

    // 1. Passive Perfect & Perfect Continuous
    if (effectiveAspect === 'PERFECT' || effectiveAspect === 'PER.CONT') {
      const isPerCont = effectiveAspect === 'PER.CONT';
      if (tense === 'PRESENT') {
        const haveWord = isPassThird ? 'has' : 'have';
        const haveCap = isPassThird ? 'Has' : 'Have';
        const haveNeg = contracted ? (isPassThird ? "hasn't" : "haven't") : haveWord;

        if (form === 'positive') {
          const canContract = contracted && getSubjectHelperContraction(passiveSubject, haveWord);
          if (canContract) {
            tokens.push({
              id: 'token-subj',
              text: canContract,
              role: 'subject-contracted',
              contractedSubject: formatSubjectText(passiveSubject, true),
              contractedHelper: haveWord,
            });
          } else {
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
            tokens.push({ id: 'token-helper', text: haveWord, role: 'helper-have' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted) {
            tokens.push({ id: 'token-helper', text: haveNeg, role: 'helper-negative' });
          } else {
            tokens.push({ id: 'token-helper', text: haveWord, role: 'helper-have' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-helper', text: haveCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted) {
            tokens.push({ id: 'token-helper', text: isPassThird ? "Hasn't" : "Haven't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          } else {
            tokens.push({ id: 'token-helper', text: haveCap, role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      } else if (tense === 'PAST') {
        if (form === 'positive') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          tokens.push({ id: 'token-helper', text: 'had', role: 'helper-have' });
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted) {
            tokens.push({ id: 'token-helper', text: "hadn't", role: 'helper-negative' });
          } else {
            tokens.push({ id: 'token-helper', text: 'had', role: 'helper-have' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-helper', text: 'Had', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted) {
            tokens.push({ id: 'token-helper', text: "Hadn't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          } else {
            tokens.push({ id: 'token-helper', text: 'Had', role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      } else if (tense === 'FUTURE') {
        if (form === 'positive') {
          const canContract = contracted && getSubjectHelperContraction(passiveSubject, 'will');
          if (canContract) {
            tokens.push({
              id: 'token-subj',
              text: canContract,
              role: 'subject-contracted',
              contractedSubject: formatSubjectText(passiveSubject, true),
              contractedHelper: 'will',
            });
          } else {
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
            tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
          }
          tokens.push({ id: 'token-helper', text: 'have', role: 'helper-have' });
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted) {
            tokens.push({ id: 'token-helper', text: "won't", role: 'helper-negative' });
            tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          } else {
            tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
            tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted) {
            tokens.push({ id: 'token-modal', text: "Won't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          } else {
            tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
            tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          }
          tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (isPerCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      }
    }

    // 2. Passive Continuous & Simple
    else {
      const isCont = effectiveAspect === 'CONTINUOUS';

      if (tense === 'PRESENT') {
        const beWord = isPassFirst ? 'am' : isPassThird ? 'is' : 'are';
        const beCap = isPassFirst ? 'Am' : isPassThird ? 'Is' : 'Are';
        const beNeg = contracted ? (isPassFirst ? 'am not' : isPassThird ? "isn't" : "aren't") : `${beWord} not`;

        if (form === 'positive') {
          const canContract = contracted && getSubjectHelperContraction(passiveSubject, beWord);
          if (canContract) {
            tokens.push({
              id: 'token-subj',
              text: canContract,
              role: 'subject-contracted',
              contractedSubject: formatSubjectText(passiveSubject, true),
              contractedHelper: beWord,
            });
          } else {
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
            tokens.push({ id: 'token-helper', text: beWord, role: 'helper-be' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted && !isPassFirst) {
            tokens.push({ id: 'token-helper', text: isPassThird ? "isn't" : "aren't", role: 'helper-negative' });
          } else {
            tokens.push({ id: 'token-helper', text: beWord, role: 'helper-be' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-helper', text: beCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted && !isPassFirst) {
            tokens.push({ id: 'token-helper', text: isPassThird ? "Isn't" : "Aren't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          } else {
            tokens.push({ id: 'token-helper', text: beCap, role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      } else if (tense === 'PAST') {
        const beWas = isPassFirst || isPassThird;
        const beWord = beWas ? 'was' : 'were';
        const beCap = beWas ? 'Was' : 'Were';

        if (form === 'positive') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          tokens.push({ id: 'token-helper', text: beWord, role: 'helper-be' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted) {
            tokens.push({ id: 'token-helper', text: beWas ? "wasn't" : "weren't", role: 'helper-negative' });
          } else {
            tokens.push({ id: 'token-helper', text: beWord, role: 'helper-be' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-helper', text: beCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted) {
            tokens.push({ id: 'token-helper', text: beWas ? "Wasn't" : "Weren't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          } else {
            tokens.push({ id: 'token-helper', text: beCap, role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      } else if (tense === 'FUTURE') {
        if (form === 'positive') {
          const canContract = contracted && getSubjectHelperContraction(passiveSubject, 'will');
          if (canContract) {
            tokens.push({
              id: 'token-subj',
              text: canContract,
              role: 'subject-contracted',
              contractedSubject: formatSubjectText(passiveSubject, true),
              contractedHelper: 'will',
            });
          } else {
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
            tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
          }
          tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'negative') {
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, true), role: 'subject' });
          if (contracted) {
            tokens.push({ id: 'token-helper', text: "won't", role: 'helper-negative' });
          } else {
            tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          }
          tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (form === 'question') {
          tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
          tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        } else if (isNegativeQuestion) {
          if (contracted) {
            tokens.push({ id: 'token-modal', text: "Won't", role: 'helper-negative-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          } else {
            tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
            tokens.push({ id: 'token-subj', text: formatSubjectText(passiveSubject, false), role: 'subject' });
            tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
            tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          }
          if (isCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(v3Token);
          tokens.push(agentToken);
        }
      }
    }
  }

  // =========================================================================
  // ACTIVE & NOMINAL SENTENCE BUILDER
  // =========================================================================
  // 1. ASPEK PERFECT & PERFECT CONTINUOUS
  else if (effectiveAspect === 'PERFECT' || effectiveAspect === 'PER.CONT') {
    const isPerCont = effectiveAspect === 'PER.CONT';
    const isNominal = sentenceType === 'nominal';
    const predicateToken = getPredicateToken(effectiveAspect, tense, form);

    if (tense === 'PRESENT') {
      const haveWord = isThirdPersonSingular ? 'has' : 'have';
      const haveCap = isThirdPersonSingular ? 'Has' : 'Have';
      const haveNegContracted = isThirdPersonSingular ? "hasn't" : "haven't";
      const needsBeen = isNominal || isPerCont;
      const needsBeing = isNominal && isPerCont;

      if (form === 'positive') {
        const canContract = contracted && getSubjectHelperContraction(cleanSubject, haveWord);
        if (canContract) {
          tokens.push({
            id: 'token-subj',
            text: canContract,
            role: 'subject-contracted',
            contractedSubject: formatSubjectText(cleanSubject, true),
            contractedHelper: haveWord,
          });
        } else {
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
          tokens.push({ id: 'token-helper', text: haveWord, role: 'helper-have' });
        }
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted) {
          tokens.push({ id: 'token-helper', text: haveNegContracted, role: 'helper-negative' });
        } else {
          tokens.push({ id: 'token-helper', text: haveWord, role: 'helper-have' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
        }
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-helper', text: haveCap, role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted) {
          tokens.push({
            id: 'token-helper',
            text: isThirdPersonSingular ? "Hasn't" : "Haven't",
            role: 'helper-negative-question',
          });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-helper', text: haveCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    } else if (tense === 'PAST') {
      const needsBeen = isNominal || isPerCont;
      const needsBeing = isNominal && isPerCont;

      if (form === 'positive') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        tokens.push({ id: 'token-helper', text: 'had', role: 'helper-have' });
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted) {
          tokens.push({ id: 'token-helper', text: "hadn't", role: 'helper-negative' });
        } else {
          tokens.push({ id: 'token-helper', text: 'had', role: 'helper-have' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
        }
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-helper', text: 'Had', role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted) {
          tokens.push({ id: 'token-helper', text: "Hadn't", role: 'helper-negative-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-helper', text: 'Had', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    } else if (tense === 'FUTURE') {
      const needsBeen = isNominal || isPerCont;
      const needsBeing = isNominal && isPerCont;

      if (form === 'positive') {
        const canContract = contracted && getSubjectHelperContraction(cleanSubject, 'will');
        if (canContract) {
          tokens.push({
            id: 'token-subj',
            text: canContract,
            role: 'subject-contracted',
            contractedSubject: formatSubjectText(cleanSubject, true),
            contractedHelper: 'will',
          });
        } else {
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
          tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
        }
        tokens.push({ id: 'token-helper', text: 'have', role: 'helper-have' });
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted) {
          tokens.push({ id: 'token-helper', text: "won't", role: 'helper-negative' });
          tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
        } else {
          tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
        }
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
        if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
        if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted) {
          tokens.push({ id: 'token-modal', text: "Won't", role: 'helper-negative-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-modal', text: 'Will', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          tokens.push({ id: 'token-have', text: 'have', role: 'helper-have' });
          if (needsBeen) tokens.push({ id: 'token-be', text: 'been', role: 'helper-be' });
          if (needsBeing) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    }
  }

  // =========================================================================
  // 2. HELPER BE SENTENCES: Nominal (Simple/Continuous) OR Continuous (Verbal)
  // =========================================================================
  else if (sentenceType === 'nominal' || effectiveAspect === 'CONTINUOUS') {
    const isNominalCont = sentenceType === 'nominal' && effectiveAspect === 'CONTINUOUS';
    const predicateToken = getPredicateToken(effectiveAspect, tense, form);

    if (tense === 'PRESENT') {
      const bePositive = isFirstPerson ? 'am' : isThirdPersonSingular ? 'is' : 'are';
      const beQuestionCap = isFirstPerson ? 'Am' : isThirdPersonSingular ? 'Is' : 'Are';

      if (form === 'positive') {
        const canContract = contracted && getSubjectHelperContraction(cleanSubject, bePositive);
        if (canContract) {
          tokens.push({
            id: 'token-subj',
            text: canContract,
            role: 'subject-contracted',
            contractedSubject: formatSubjectText(cleanSubject, true),
            contractedHelper: bePositive,
          });
        } else {
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
          tokens.push({ id: 'token-helper', text: bePositive, role: 'helper-be' });
        }
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted && !isFirstPerson) {
          const negHelper = isThirdPersonSingular ? "isn't" : "aren't";
          tokens.push({ id: 'token-helper', text: negHelper, role: 'helper-negative' });
        } else {
          tokens.push({ id: 'token-helper', text: bePositive, role: 'helper-be' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
        }
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-helper', text: beQuestionCap, role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted && !isFirstPerson) {
          const negQHelper = isThirdPersonSingular ? "Isn't" : "Aren't";
          tokens.push({ id: 'token-helper', text: negQHelper, role: 'helper-negative-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-helper', text: beQuestionCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    } else if (tense === 'PAST') {
      const beWas = isFirstPerson || isThirdPersonSingular;
      const bePositive = beWas ? 'was' : 'were';
      const beQuestionCap = beWas ? 'Was' : 'Were';

      if (form === 'positive') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        tokens.push({ id: 'token-helper', text: bePositive, role: 'helper-be' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted) {
          const negHelper = beWas ? "wasn't" : "weren't";
          tokens.push({ id: 'token-helper', text: negHelper, role: 'helper-negative' });
        } else {
          tokens.push({ id: 'token-helper', text: bePositive, role: 'helper-be' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
        }
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-helper', text: beQuestionCap, role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted) {
          const negQHelper = beWas ? "Wasn't" : "Weren't";
          tokens.push({ id: 'token-helper', text: negQHelper, role: 'helper-negative-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-helper', text: beQuestionCap, role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    } else if (tense === 'FUTURE') {
      if (form === 'positive') {
        const canContract = contracted && getSubjectHelperContraction(cleanSubject, 'will');
        if (canContract) {
          tokens.push({
            id: 'token-subj',
            text: canContract,
            role: 'subject-contracted',
            contractedSubject: formatSubjectText(cleanSubject, true),
            contractedHelper: 'will',
          });
        } else {
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
          tokens.push({ id: 'token-helper', text: 'will', role: 'helper-modal' });
        }
        tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'negative') {
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, true), role: 'subject' });
        if (contracted) {
          tokens.push({ id: 'token-helper', text: "won't", role: 'helper-negative' });
        } else {
          tokens.push({ id: 'token-modal', text: 'will', role: 'helper-modal' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
        }
        tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (form === 'question') {
        tokens.push({ id: 'token-helper', text: 'Will', role: 'helper-question' });
        tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
        tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
        if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
        tokens.push(predicateToken);
      } else if (isNegativeQuestion) {
        if (contracted) {
          tokens.push({ id: 'token-helper', text: "Won't", role: 'helper-negative-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        } else {
          tokens.push({ id: 'token-helper', text: 'Will', role: 'helper-question' });
          tokens.push({ id: 'token-subj', text: formatSubjectText(cleanSubject, false), role: 'subject' });
          tokens.push({ id: 'token-not', text: 'not', role: 'helper-negative' });
          tokens.push({ id: 'token-be', text: 'be', role: 'helper-be' });
          if (isNominalCont) tokens.push({ id: 'token-being', text: 'being', role: 'helper-be' });
          tokens.push(predicateToken);
        }
      }
    }
  }

  // =========================================================================
  // 3. VERBAL SIMPLE TENSES (PRESENT, PAST, FUTURE)
  // =========================================================================
  else if (tense === 'PRESENT') {
    const predicateToken = getPredicateToken('SIMPLE', 'PRESENT', form);

    if (form === 'positive') {
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, true),
        role: 'subject',
      });
      tokens.push(predicateToken);
    } else if (form === 'negative') {
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, true),
        role: 'subject',
      });
      if (contracted) {
        tokens.push({
          id: 'token-helper',
          text: isThirdPersonSingular ? "doesn't" : "don't",
          role: 'helper-negative',
        });
      } else {
        tokens.push({
          id: 'token-helper',
          text: isThirdPersonSingular ? 'does' : 'do',
          role: 'helper-negative',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
      }
      tokens.push(predicateToken);
    } else if (form === 'question') {
      const helper = isThirdPersonSingular ? 'Does' : 'Do';
      tokens.push({
        id: 'token-helper',
        text: helper,
        role: 'helper-question',
      });
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, false),
        role: 'subject',
      });
      tokens.push(predicateToken);
    } else if (isNegativeQuestion) {
      if (contracted) {
        const helper = isThirdPersonSingular ? "Doesn't" : "Don't";
        tokens.push({
          id: 'token-helper',
          text: helper,
          role: 'helper-negative-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push(predicateToken);
      } else {
        const helper = isThirdPersonSingular ? 'Does' : 'Do';
        tokens.push({
          id: 'token-helper',
          text: helper,
          role: 'helper-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
        tokens.push(predicateToken);
      }
    }
  } else if (tense === 'PAST') {
    const predicateToken = getPredicateToken('SIMPLE', 'PAST', form);

    if (form === 'positive') {
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, true),
        role: 'subject',
      });
      tokens.push(predicateToken);
    } else if (form === 'negative') {
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, true),
        role: 'subject',
      });
      if (contracted) {
        tokens.push({
          id: 'token-helper',
          text: "didn't",
          role: 'helper-negative',
        });
      } else {
        tokens.push({
          id: 'token-helper',
          text: 'did',
          role: 'helper-negative',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
      }
      tokens.push(predicateToken);
    } else if (form === 'question') {
      tokens.push({
        id: 'token-helper',
        text: 'Did',
        role: 'helper-question',
      });
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, false),
        role: 'subject',
      });
      tokens.push(predicateToken);
    } else if (isNegativeQuestion) {
      if (contracted) {
        tokens.push({
          id: 'token-helper',
          text: "Didn't",
          role: 'helper-negative-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push(predicateToken);
      } else {
        tokens.push({
          id: 'token-helper',
          text: 'Did',
          role: 'helper-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
        tokens.push(predicateToken);
      }
    }
  } else if (tense === 'FUTURE') {
    const predicateToken = getPredicateToken('SIMPLE', 'FUTURE', form);

    if (form === 'positive') {
      const canContract = contracted && getSubjectHelperContraction(cleanSubject, 'will');
      if (canContract) {
        tokens.push({
          id: 'token-subj',
          text: canContract,
          role: 'subject-contracted',
          contractedSubject: formatSubjectText(cleanSubject, true),
          contractedHelper: 'will',
        });
      } else {
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, true),
          role: 'subject',
        });
        tokens.push({
          id: 'token-helper',
          text: 'will',
          role: 'helper-modal',
        });
      }
      tokens.push(predicateToken);
    } else if (form === 'negative') {
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, true),
        role: 'subject',
      });
      if (contracted) {
        tokens.push({
          id: 'token-helper',
          text: "won't",
          role: 'helper-negative',
        });
      } else {
        tokens.push({
          id: 'token-modal',
          text: 'will',
          role: 'helper-modal',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
      }
      tokens.push(predicateToken);
    } else if (form === 'question') {
      tokens.push({
        id: 'token-helper',
        text: 'Will',
        role: 'helper-question',
      });
      tokens.push({
        id: 'token-subj',
        text: formatSubjectText(cleanSubject, false),
        role: 'subject',
      });
      tokens.push(predicateToken);
    } else if (isNegativeQuestion) {
      if (contracted) {
        tokens.push({
          id: 'token-helper',
          text: "Won't",
          role: 'helper-negative-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push(predicateToken);
      } else {
        tokens.push({
          id: 'token-helper',
          text: 'Will',
          role: 'helper-question',
        });
        tokens.push({
          id: 'token-subj',
          text: formatSubjectText(cleanSubject, false),
          role: 'subject',
        });
        tokens.push({
          id: 'token-not',
          text: 'not',
          role: 'helper-negative',
        });
        tokens.push(predicateToken);
      }
    }
  }

  // Verbal Active Mode: tambahkan objek jika kata kerja transitif dan objek tersedia
  if (!isPassiveMode && sentenceType === 'verbal' && cleanObject && verbCheck.data?.transitive !== false) {
    tokens.push({
      id: 'token-object',
      text: cleanObject,
      role: 'object',
    });
  }

  // Tambahkan time signal di akhir kalimat
  if (cleanTimeSignal) {
    tokens.push({
      id: 'token-signal',
      text: cleanTimeSignal,
      role: 'timeSignal',
    });
  }

  // Tambahkan tanda baca
  const punctuation = form === 'question' || isNegativeQuestion ? '?' : '.';
  tokens.push({
    id: 'token-punct',
    text: punctuation,
    role: 'punctuation',
  });

  const indonesianTranslation = getIndonesianTranslation({
    subject: cleanSubject,
    verb1: cleanVerb,
    tense,
    aspect: effectiveAspect,
    form,
    timeSignal: cleanTimeSignal,
    sentenceType,
    nominalComplement: cleanComplement,
    object: cleanObject,
    isPassive: isPassiveMode,
  });

  const enrichedTokens = attachTokenTooltips(tokens, {
    cleanSubject,
    cleanVerb,
    cleanObject,
    cleanComplement,
    cleanTimeSignal,
    subjectType,
    tense,
    aspect: effectiveAspect,
    form,
    sentenceType,
    isPassiveMode,
    verbCheck,
    nominalCheck,
  });

  return {
    tokens: enrichedTokens,
    fullText: enrichedTokens
      .map((t, idx) => (t.role === 'punctuation' ? t.text : idx === 0 ? t.text : ` ${t.text}`))
      .join(''),
    subjectType,
    isVerbValid,
    verbData: verbCheck.data,
    isComplementValid,
    nominalData: nominalCheck,
    isPassive: isPassiveMode,
    isTransitive: verbCheck.data?.transitive !== false,
    activeSubject: cleanSubject,
    passiveSubject: isPassiveMode ? (cleanObject || 'a book') : null,
    agentPhrase: isPassiveMode ? agentPhrase : null,
    translation: indonesianTranslation,
  };
}

/**
 * Dapatkan informasi nama tenses dan rumus dinamis
 * @param {Object} params
 * @param {string} params.tense 'PRESENT' | 'PAST' | 'FUTURE'
 * @param {string} params.aspect 'SIMPLE' | 'CONTINUOUS' | 'PERFECT' | 'PER.CONT'
 * @param {string} params.sentenceType 'verbal' | 'nominal'
 * @param {string} params.form 'positive' | 'negative' | 'question' | 'negative_question'
 * @returns {{ name: string, formulaPrefix: string, formula: string, fullFormula: string }}
 */
export function getTenseFormulaInfo({ tense, aspect, sentenceType, form, isPassive = false }) {
  const isPassiveMode = sentenceType === 'verbal' && Boolean(isPassive);
  const modeLabel = isPassiveMode ? 'Passive Voice' : sentenceType === 'verbal' ? 'Verbal' : 'Nominal';

  // 1. Nama Tenses
  const aspectNames = {
    SIMPLE: 'Simple',
    CONTINUOUS: 'Continuous',
    PERFECT: 'Perfect',
    'PER.CONT': 'Perfect Continuous',
  };
  const tenseNames = {
    PRESENT: 'Present',
    PAST: 'Past',
    FUTURE: 'Future',
  };

  const tenseTitle = `${tenseNames[tense] || 'Present'} ${aspectNames[aspect] || 'Simple'} (${modeLabel})`;

  // 2. Pemetaan Rumus Dinamis
  const FORMULAS = {
    verbal: {
      SIMPLE: {
        PRESENT: {
          positive: 'S + V1 (+s/es) + O/C',
          negative: 'S + do/does + not + V1 + O/C',
          question: 'Do/Does + S + V1 + O/C + ?',
          negative_question: "Don't/Doesn't + S + V1 + O/C + ?",
        },
        PAST: {
          positive: 'S + V2 + O/C',
          negative: 'S + did + not + V1 + O/C',
          question: 'Did + S + V1 + O/C + ?',
          negative_question: "Didn't + S + V1 + O/C + ?",
        },
        FUTURE: {
          positive: 'S + will + V1 + O/C',
          negative: 'S + will + not + V1 + O/C',
          question: 'Will + S + V1 + O/C + ?',
          negative_question: "Won't + S + V1 + O/C + ?",
        },
      },
      CONTINUOUS: {
        PRESENT: {
          positive: 'S + am/is/are + V-ing + O/C',
          negative: 'S + am/is/are + not + V-ing + O/C',
          question: 'Am/Is/Are + S + V-ing + O/C + ?',
          negative_question: "Aren't/Isn't + S + V-ing + O/C + ?",
        },
        PAST: {
          positive: 'S + was/were + V-ing + O/C',
          negative: 'S + was/were + not + V-ing + O/C',
          question: 'Was/Were + S + V-ing + O/C + ?',
          negative_question: "Wasn't/Weren't + S + V-ing + O/C + ?",
        },
        FUTURE: {
          positive: 'S + will + be + V-ing + O/C',
          negative: 'S + will + not + be + V-ing + O/C',
          question: 'Will + S + be + V-ing + O/C + ?',
          negative_question: "Won't + S + be + V-ing + O/C + ?",
        },
      },
      PERFECT: {
        PRESENT: {
          positive: 'S + have/has + V3 + O/C',
          negative: 'S + have/has + not + V3 + O/C',
          question: 'Have/Has + S + V3 + O/C + ?',
          negative_question: "Haven't/Hasn't + S + V3 + O/C + ?",
        },
        PAST: {
          positive: 'S + had + V3 + O/C',
          negative: 'S + had + not + V3 + O/C',
          question: 'Had + S + V3 + O/C + ?',
          negative_question: "Hadn't + S + V3 + O/C + ?",
        },
        FUTURE: {
          positive: 'S + will + have + V3 + O/C',
          negative: 'S + will + not + have + V3 + O/C',
          question: 'Will + S + have + V3 + O/C + ?',
          negative_question: "Won't + S + have + V3 + O/C + ?",
        },
      },
      'PER.CONT': {
        PRESENT: {
          positive: 'S + have/has + been + V-ing + O/C',
          negative: 'S + have/has + not + been + V-ing + O/C',
          question: 'Have/Has + S + been + V-ing + O/C + ?',
          negative_question: "Haven't/Hasn't + S + been + V-ing + O/C + ?",
        },
        PAST: {
          positive: 'S + had + been + V-ing + O/C',
          negative: 'S + had + not + been + V-ing + O/C',
          question: 'Had + S + been + V-ing + O/C + ?',
          negative_question: "Hadn't + S + been + V-ing + O/C + ?",
        },
        FUTURE: {
          positive: 'S + will + have + been + V-ing + O/C',
          negative: 'S + will + not + have + been + V-ing + O/C',
          question: 'Will + S + have + been + V-ing + O/C + ?',
          negative_question: "Won't + S + have + been + V-ing + O/C + ?",
        },
      },
    },
    nominal: {
      SIMPLE: {
        PRESENT: {
          positive: 'S + am/is/are + Complement (Adj/Noun/Adv)',
          negative: 'S + am/is/are + not + Complement',
          question: 'Am/Is/Are + S + Complement + ?',
          negative_question: "Aren't/Isn't + S + Complement + ?",
        },
        PAST: {
          positive: 'S + was/were + Complement (Adj/Noun/Adv)',
          negative: 'S + was/were + not + Complement',
          question: 'Was/Were + S + Complement + ?',
          negative_question: "Wasn't/Weren't + S + Complement + ?",
        },
        FUTURE: {
          positive: 'S + will + be + Complement',
          negative: 'S + will + not + be + Complement',
          question: 'Will + S + be + Complement + ?',
          negative_question: "Won't + S + be + Complement + ?",
        },
      },
      CONTINUOUS: {
        PRESENT: {
          positive: 'S + am/is/are + being + Complement',
          negative: 'S + am/is/are + not + being + Complement',
          question: 'Am/Is/Are + S + being + Complement + ?',
          negative_question: "Aren't/Isn't + S + being + Complement + ?",
        },
        PAST: {
          positive: 'S + was/were + being + Complement',
          negative: 'S + was/were + not + being + Complement',
          question: 'Was/Were + S + being + Complement + ?',
          negative_question: "Wasn't/Weren't + S + being + Complement + ?",
        },
        FUTURE: {
          positive: 'S + will + be + being + Complement',
          negative: 'S + will + not + be + being + Complement',
          question: 'Will + S + be + being + Complement + ?',
          negative_question: "Won't + S + be + being + Complement + ?",
        },
      },
      PERFECT: {
        PRESENT: {
          positive: 'S + have/has + been + Complement',
          negative: 'S + have/has + not + been + Complement',
          question: 'Have/Has + S + been + Complement + ?',
          negative_question: "Haven't/Hasn't + S + been + Complement + ?",
        },
        PAST: {
          positive: 'S + had + been + Complement',
          negative: 'S + had + not + been + Complement',
          question: 'Had + S + been + Complement + ?',
          negative_question: "Hadn't + S + been + Complement + ?",
        },
        FUTURE: {
          positive: 'S + will + have + been + Complement',
          negative: 'S + will + not + have + been + Complement',
          question: 'Will + S + have + been + Complement + ?',
          negative_question: "Won't + S + have + been + Complement + ?",
        },
      },
      'PER.CONT': {
        PRESENT: {
          positive: 'S + have/has + been + being + Complement',
          negative: 'S + have/has + not + been + being + Complement',
          question: 'Have/Has + S + been + being + Complement + ?',
          negative_question: "Haven't/Hasn't + S + been + being + Complement + ?",
        },
        PAST: {
          positive: 'S + had + been + being + Complement',
          negative: 'S + had + not + been + being + Complement',
          question: 'Had + S + been + being + Complement + ?',
          negative_question: "Hadn't + S + been + being + Complement + ?",
        },
        FUTURE: {
          positive: 'S + will + have + been + being + Complement',
          negative: 'S + will + not + have + been + being + Complement',
          question: 'Will + S + have + been + being + Complement + ?',
          negative_question: "Won't + S + have + been + being + Complement + ?",
        },
      },
    },
    passive: {
      SIMPLE: {
        PRESENT: {
          positive: 'S (Objek) + am/is/are + V3 + by + Agent',
          negative: 'S (Objek) + am/is/are + not + V3 + by + Agent',
          question: 'Am/Is/Are + S (Objek) + V3 + by + Agent + ?',
          negative_question: "Aren't/Isn't + S (Objek) + V3 + by + Agent + ?",
        },
        PAST: {
          positive: 'S (Objek) + was/were + V3 + by + Agent',
          negative: 'S (Objek) + was/were + not + V3 + by + Agent',
          question: 'Was/Were + S (Objek) + V3 + by + Agent + ?',
          negative_question: "Wasn't/Weren't + S (Objek) + V3 + by + Agent + ?",
        },
        FUTURE: {
          positive: 'S (Objek) + will + be + V3 + by + Agent',
          negative: 'S (Objek) + will + not + be + V3 + by + Agent',
          question: 'Will + S (Objek) + be + V3 + by + Agent + ?',
          negative_question: "Won't + S (Objek) + be + V3 + by + Agent + ?",
        },
      },
      CONTINUOUS: {
        PRESENT: {
          positive: 'S (Objek) + am/is/are + being + V3 + by + Agent',
          negative: 'S (Objek) + am/is/are + not + being + V3 + by + Agent',
          question: 'Am/Is/Are + S (Objek) + being + V3 + by + Agent + ?',
          negative_question: "Aren't/Isn't + S (Objek) + being + V3 + by + Agent + ?",
        },
        PAST: {
          positive: 'S (Objek) + was/were + being + V3 + by + Agent',
          negative: 'S (Objek) + was/were + not + being + V3 + by + Agent',
          question: 'Was/Were + S (Objek) + being + V3 + by + Agent + ?',
          negative_question: "Wasn't/Weren't + S (Objek) + being + V3 + by + Agent + ?",
        },
        FUTURE: {
          positive: 'S (Objek) + will + be + being + V3 + by + Agent',
          negative: 'S (Objek) + will + not + be + being + V3 + by + Agent',
          question: 'Will + S (Objek) + be + being + V3 + by + Agent + ?',
          negative_question: "Won't + S (Objek) + be + being + V3 + by + Agent + ?",
        },
      },
      PERFECT: {
        PRESENT: {
          positive: 'S (Objek) + have/has + been + V3 + by + Agent',
          negative: 'S (Objek) + have/has + not + been + V3 + by + Agent',
          question: 'Have/Has + S (Objek) + been + V3 + by + Agent + ?',
          negative_question: "Haven't/Hasn't + S (Objek) + been + V3 + by + Agent + ?",
        },
        PAST: {
          positive: 'S (Objek) + had + been + V3 + by + Agent',
          negative: 'S (Objek) + had + not + been + V3 + by + Agent',
          question: 'Had + S (Objek) + been + V3 + by + Agent + ?',
          negative_question: "Hadn't + S (Objek) + been + V3 + by + Agent + ?",
        },
        FUTURE: {
          positive: 'S (Objek) + will + have + been + V3 + by + Agent',
          negative: 'S (Objek) + will + not + have + been + V3 + by + Agent',
          question: 'Will + S (Objek) + have + been + V3 + by + Agent + ?',
          negative_question: "Won't + S (Objek) + have + been + V3 + by + Agent + ?",
        },
      },
      'PER.CONT': {
        PRESENT: {
          positive: 'S (Objek) + have/has + been + being + V3 + by + Agent',
          negative: 'S (Objek) + have/has + not + been + being + V3 + by + Agent',
          question: 'Have/Has + S (Objek) + been + being + V3 + by + Agent + ?',
          negative_question: "Haven't/Hasn't + S (Objek) + been + being + V3 + by + Agent + ?",
        },
        PAST: {
          positive: 'S (Objek) + had + been + being + V3 + by + Agent',
          negative: 'S (Objek) + had + not + been + being + V3 + by + Agent',
          question: 'Had + S (Objek) + been + being + V3 + by + Agent + ?',
          negative_question: "Hadn't + S (Objek) + been + being + V3 + by + Agent + ?",
        },
        FUTURE: {
          positive: 'S (Objek) + will + have + been + being + V3 + by + Agent',
          negative: 'S (Objek) + will + not + have + been + being + V3 + by + Agent',
          question: 'Will + S (Objek) + have + been + being + V3 + by + Agent + ?',
          negative_question: "Won't + S (Objek) + have + been + being + V3 + by + Agent + ?",
        },
      },
    },
  };

  const formKey = form === '-?' ? 'negative_question' : form;
  const formulaCategory = isPassiveMode ? 'passive' : sentenceType;
  const rawFormula =
    FORMULAS[formulaCategory]?.[aspect]?.[tense]?.[formKey] || 'S + Verb / Helper + Complement';

  const formPrefix =
    formKey === 'positive'
      ? 'Rumus (+):'
      : formKey === 'negative'
      ? 'Rumus (-):'
      : formKey === 'question'
      ? 'Rumus (?):'
      : 'Rumus (-?):';

  return {
    name: tenseTitle,
    formulaPrefix: formPrefix,
    formula: rawFormula,
    fullFormula: `${formPrefix} ${rawFormula}`,
  };
}

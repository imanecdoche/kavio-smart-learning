/**
 * English Nominal Complement Dictionary Dataset - Kavio English Smart Learning
 * Memuat ratusan kata sifat (Adjectives), kata benda (Nouns), dan keterangan tempat (Adverb of Place).
 * Dilengkapi dengan validasi artikel otomatis ('a' vs 'an') dan deteksi tipe instan.
 */

export const ADJECTIVES_SET = new Set([
  'happy', 'sad', 'ready', 'busy', 'smart', 'tired', 'hungry', 'thirsty',
  'sleepy', 'healthy', 'sick', 'strong', 'weak', 'rich', 'poor', 'honest',
  'polite', 'kind', 'rude', 'brave', 'shy', 'proud', 'lucky', 'careful',
  'careless', 'calm', 'angry', 'patient', 'lazy', 'diligent', 'generous',
  'clever', 'funny', 'serious', 'quiet', 'noisy', 'friendly', 'gentle',
  'beautiful', 'handsome', 'pretty', 'cute', 'attractive', 'clean', 'dirty',
  'young', 'old', 'new', 'tall', 'short', 'big', 'small', 'huge', 'tiny',
  'fast', 'quick', 'slow', 'safe', 'dangerous', 'expensive', 'cheap',
  'famous', 'popular', 'lonely', 'excited', 'nervous', 'worried', 'afraid',
  'scared', 'confident', 'creative', 'curious', 'grateful', 'helpful',
  'important', 'interesting', 'boring', 'comfortable', 'sweet', 'sour',
  'bitter', 'spicy', 'salty', 'warm', 'cold', 'cool', 'hot', 'dry', 'wet',
  'bright', 'dark', 'heavy', 'light', 'hard', 'soft', 'easy', 'simple',
  'difficult', 'perfect', 'successful', 'unique', 'loyal', 'silent', 'silly',
  'alive', 'asleep', 'awake', 'blind', 'deaf', 'innocent', 'guilty', 'jealous',
  'proud', 'strange', 'weird', 'wonderful', 'awesome', 'amazing', 'great',
  'good', 'bad', 'fine', 'terrible', 'awful', 'correct', 'wrong', 'true',
  'false', 'fair', 'unfair', 'generous', 'selfish', 'optimistic', 'pessimistic',
  'modest', 'clumsy', 'ambitious', 'reliable', 'punctual', 'sensible',
  'sensitive', 'sincere', 'sympathetic', 'stubborn', 'enthusiastic', 'energetic',
  'peaceful', 'cheerful', 'graceful', 'magnificent', 'marvelous', 'neat',
  'messy', 'wealthy', 'powerful', 'furious', 'gorgeous'
]);

export const NOUNS_SET = new Set([
  'student', 'students', 'teacher', 'teachers', 'doctor', 'doctors', 'nurse', 'nurses',
  'engineer', 'engineers', 'pilot', 'pilots', 'driver', 'drivers', 'chef', 'chefs',
  'writer', 'writers', 'artist', 'artists', 'actor', 'actors', 'actress', 'actresses',
  'singer', 'singers', 'dancer', 'dancers', 'lawyer', 'lawyers', 'dentist', 'dentists',
  'farmer', 'farmers', 'officer', 'officers', 'police', 'policeman', 'policewoman',
  'worker', 'workers', 'manager', 'managers', 'boss', 'bosses', 'leader', 'leaders',
  'parent', 'parents', 'father', 'mother', 'brother', 'sister', 'son', 'daughter',
  'child', 'children', 'baby', 'babies', 'boy', 'boys', 'girl', 'girls', 'man', 'men',
  'woman', 'women', 'person', 'people', 'friend', 'friends', 'partner', 'partners',
  'teammate', 'teammates', 'cat', 'cats', 'dog', 'dogs', 'bird', 'birds', 'horse',
  'cows', 'cow', 'fish', 'animal', 'animals', 'book', 'books', 'car', 'cars',
  'pen', 'pens', 'bag', 'bags', 'phone', 'phones', 'computer', 'computers',
  'bicycle', 'bicycles', 'room', 'rooms', 'house', 'houses', 'table', 'chair',
  'bus', 'buses', 'train', 'trains', 'plane', 'planes', 'ship', 'ships',
  'scientist', 'scientists', 'athlete', 'athletes', 'hero', 'heroes', 'champion',
  'architect', 'architects', 'coach', 'coaches', 'neighbor', 'neighbors', 'guest',
  'guests', 'tourist', 'tourists', 'stranger', 'strangers', 'musician', 'musicians',
  'photographer', 'photographers', 'programmer', 'programmers', 'designer', 'designers',
  'mechanic', 'mechanics', 'soldier', 'soldiers', 'sailor', 'sailors', 'clerk',
  'merchant', 'merchants', 'tailor', 'tailors', 'baker', 'bakers', 'butcher',
  'carpenter', 'carpenters', 'guard', 'guards', 'judge', 'judges', 'president',
  'minister', 'director', 'directors', 'author', 'authors', 'poet', 'poets'
]);

export const PREPOSITIONS_SET = new Set([
  'at', 'in', 'on', 'under', 'behind', 'near', 'beside', 'inside', 'outside', 'by', 'around'
]);

export const PLACES_SET = new Set([
  'home', 'school', 'office', 'park', 'kitchen', 'bedroom', 'hospital', 'room',
  'library', 'garden', 'hotel', 'cinema', 'airport', 'station', 'store', 'church',
  'mosque', 'bank', 'gym', 'market', 'restaurant', 'classroom', 'university',
  'campus', 'laboratory', 'museum', 'beach', 'mountain', 'pool', 'mall', 'cafe',
  'bakery', 'town', 'city', 'village', 'work', 'bed', 'bathroom', 'balcony',
  'basement', 'garage', 'yard', 'hall', 'lobby', 'stadium', 'supermarket',
  'pharmacy', 'clinic', 'dentist office', 'playground', 'forest', 'island',
  'street', 'downtown', 'jakarta', 'tokyo', 'london', 'paris', 'bali', 'indonesia'
]);

export const STANDALONE_ADVERBS_OF_PLACE = new Set([
  'here',
  'there',
  'everywhere',
  'abroad',
  'downtown',
  'home',
  'upstairs',
  'downstairs',
  'inside',
  'outside',
  'nearby',
]);

/**
 * Validasi dan parsing frasa komplemen nominal (Adjective, Noun, Adverb of Place)
 * @param {string} inputPhrase
 * @returns {{
 *   isValid: boolean,
 *   type: 'ADJECTIVE' | 'NOUN' | 'ADVERB' | null,
 *   typeLabel: string,
 *   formatted: string
 * }}
 */
export function lookupNominal(inputPhrase) {
  if (!inputPhrase || inputPhrase.trim() === '') {
    return { isValid: false, type: null, typeLabel: '', formatted: '' };
  }

  const clean = inputPhrase.trim().toLowerCase();

  // 1. Cek kata keterangan tempat mandiri (here, there, abroad, etc.)
  if (STANDALONE_ADVERBS_OF_PLACE.has(clean)) {
    return {
      isValid: true,
      type: 'ADVERB',
      typeLabel: 'ADVERB (PLACE)',
      formatted: clean,
    };
  }

  // 2. Cek kata sifat murni (happy, ready, busy, etc.)
  if (ADJECTIVES_SET.has(clean)) {
    return {
      isValid: true,
      type: 'ADJECTIVE',
      typeLabel: 'ADJECTIVE',
      formatted: clean,
    };
  }

  // 3. Cek frasa preposisi tempat (at home, in the kitchen, on the table, etc.)
  const prepMatch = clean.match(/^([a-z]+)\s+(the\s+|a\s+|an\s+|my\s+|our\s+)?([a-z\s]+)$/);
  if (prepMatch) {
    const prep = prepMatch[1];
    const placeWord = prepMatch[3].trim();
    if (PREPOSITIONS_SET.has(prep) && (PLACES_SET.has(placeWord) || NOUNS_SET.has(placeWord))) {
      const properPlace = ['jakarta', 'tokyo', 'london', 'paris', 'bali', 'indonesia'].includes(placeWord)
        ? placeWord.charAt(0).toUpperCase() + placeWord.slice(1)
        : placeWord;
      const articlePart = prepMatch[2] || '';
      return {
        isValid: true,
        type: 'ADVERB',
        typeLabel: 'ADVERB (PLACE)',
        formatted: `${prep} ${articlePart}${properPlace}`.trim(),
      };
    }
  }

  // 4. Cek frasa noun dengan artikel (a student, an engineer, the cat, etc.)
  const nounMatch = clean.match(/^(a|an|the)\s+([a-z\s]+)$/);
  if (nounMatch) {
    const coreNoun = nounMatch[2].trim();
    if (NOUNS_SET.has(coreNoun)) {
      const isThe = nounMatch[1] === 'the';
      const startsWithVowel = /^[aeiou]/i.test(coreNoun);
      const properArticle = isThe ? 'the' : startsWithVowel ? 'an' : 'a';
      return {
        isValid: true,
        type: 'NOUN',
        typeLabel: 'NOUN',
        formatted: `${properArticle} ${coreNoun}`,
      };
    }
  }

  // 5. Cek kata benda tunggal tanpa artikel atau jamak (student, teachers, doctor, engineers)
  if (NOUNS_SET.has(clean)) {
    const isPlural = clean.endsWith('s') || ['children', 'people', 'men', 'women'].includes(clean);
    if (isPlural) {
      return {
        isValid: true,
        type: 'NOUN',
        typeLabel: 'NOUN (PLURAL)',
        formatted: clean,
      };
    }
    // Kata benda tunggal: otomatis tambahkan artikel 'a' atau 'an' yang tepat
    const startsWithVowel = /^[aeiou]/i.test(clean);
    const article = startsWithVowel ? 'an' : 'a';
    return {
      isValid: true,
      type: 'NOUN',
      typeLabel: 'NOUN',
      formatted: `${article} ${clean}`,
    };
  }

  // 6. Cek jika user hanya mengetik nama tempat (misal: "school", "office", "kitchen")
  if (PLACES_SET.has(clean)) {
    const prep = clean === 'home' ? 'at' : 'in the';
    return {
      isValid: true,
      type: 'ADVERB',
      typeLabel: 'ADVERB (PLACE)',
      formatted: clean === 'home' ? 'at home' : `${prep} ${clean}`,
    };
  }

  // Tidak ditemukan dalam kamus
  return {
    isValid: false,
    type: null,
    typeLabel: 'TIDAK DIKENALI',
    formatted: clean,
  };
}

/**
 * Autocomplete saran untuk komplemen nominal (Maksimal limit)
 * @param {string} prefix
 * @param {number} limit
 * @returns {string[]}
 */
export function getNominalSuggestions(prefix, limit = 5) {
  if (!prefix || prefix.trim().length < 2) return [];
  const clean = prefix.trim().toLowerCase();
  const matches = [];

  // Cari dari adjectives
  for (const adj of ADJECTIVES_SET) {
    if (adj.startsWith(clean)) {
      matches.push(adj);
      if (matches.length >= limit) return matches;
    }
  }

  // Cari dari places (dengan awalan preposisi)
  for (const place of PLACES_SET) {
    if (place.startsWith(clean)) {
      matches.push(place === 'home' ? 'at home' : `in the ${place}`);
      if (matches.length >= limit) return matches;
    }
  }

  // Cari dari nouns (dengan artikel 'a' atau 'an')
  for (const noun of NOUNS_SET) {
    if (noun.startsWith(clean)) {
      const startsWithVowel = /^[aeiou]/i.test(noun);
      const article = startsWithVowel ? 'an' : 'a';
      matches.push(noun.endsWith('s') ? noun : `${article} ${noun}`);
      if (matches.length >= limit) return matches;
    }
  }

  return matches;
}

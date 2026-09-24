import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import {
  buildSentence,
  detectSubjectType,
  SUBJECT_TYPES,
  getPastVerb,
  getPastParticipleVerb,
  getPresentThirdPersonVerb,
  getVerbIng,
  NOMINAL_PRESETS,
  OBJECT_PRESETS,
  getTenseFormulaInfo,
} from '../../utils/grammarEngine.js';
import { lookupVerb, getVerbSuggestions } from '../../data/dictionary/verbsData';
import { lookupNominal, getNominalSuggestions } from '../../data/dictionary/nominalData';

const tokenTransition = {
  layout: { type: 'spring', stiffness: 350, damping: 32 },
};

const rollVariants = {
  initial: { y: '100%', opacity: 0 },
  animate: (custom = 0) => {
    const delay = typeof custom === 'number' ? custom : custom?.delay || 0;
    return {
      y: '0%',
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 400, damping: 35, delay },
        opacity: { duration: 0.12, delay },
      },
    };
  },
  exit: (custom = 0) => {
    const delay = typeof custom === 'number' ? custom : custom?.delay || 0;
    return {
      y: '-100%',
      opacity: 0,
      transition: {
        y: { type: 'spring', stiffness: 400, damping: 35, delay },
        opacity: { duration: 0.12, delay },
      },
    };
  },
};

const tokenVariants = {
  initial: {
    opacity: 0,
    width: 0,
    scale: 0.95,
    marginLeft: 0,
    marginRight: 0,
  },
  animate: (custom) => ({
    opacity: 1,
    width: 'auto',
    scale: 1,
    marginLeft: '0.25rem',
    marginRight: '0.25rem',
    transition: {
      width: { type: 'spring', stiffness: 400, damping: 35, delay: custom?.delay || 0 },
      scale: { type: 'spring', stiffness: 400, damping: 35, delay: custom?.delay || 0 },
      marginLeft: { type: 'spring', stiffness: 400, damping: 35, delay: custom?.delay || 0 },
      marginRight: { type: 'spring', stiffness: 400, damping: 35, delay: custom?.delay || 0 },
      opacity: { duration: 0.15, delay: custom?.delay || 0 },
    },
  }),
  exit: {
    opacity: 0,
    width: 0,
    scale: 0.95,
    marginLeft: 0,
    marginRight: 0,
    transition: {
      width: { type: 'spring', stiffness: 400, damping: 35 },
      scale: { type: 'spring', stiffness: 400, damping: 35 },
      marginLeft: { type: 'spring', stiffness: 400, damping: 35 },
      marginRight: { type: 'spring', stiffness: 400, damping: 35 },
      opacity: { duration: 0.12 },
    },
  },
};

/**
 * Identitas persistent unik untuk layout motion (FLIP sliding)
 * Menjamin tidak terjadi unmount/blink saat transisi (+) -> (?)
 */
export function getPersistentLayoutId(token) {
  if (!token) return 'token-unknown';
  if (token.id === 'token-subj' || token.role === 'subject' || token.role === 'subject-contracted') {
    return 'token-subject';
  }
  if (token.id === 'token-modal' || token.role === 'helper-modal') {
    return 'token-helper-modal';
  }
  if (token.id === 'token-have') {
    return 'token-helper-have';
  }
  if (token.id === 'token-be') {
    return 'token-helper-be';
  }
  if (token.id === 'token-being') {
    return 'token-helper-being';
  }
  if (token.id === 'token-not') {
    return 'token-helper-not';
  }
  if (token.id === 'token-helper' || token.role?.startsWith('helper')) {
    return 'token-helper';
  }
  if (token.id === 'token-verb' || token.role === 'verb') {
    return 'token-main-verb';
  }
  if (token.id === 'token-complement' || token.role === 'complement') {
    return 'token-complement';
  }
  if (token.id === 'token-object' || token.role === 'object') {
    return 'token-object';
  }
  if (token.id === 'token-agent' || token.role === 'agent') {
    return 'token-agent';
  }
  if (token.id === 'token-time' || token.role === 'timeSignal') {
    return 'token-time-signal';
  }
  return token.id || `token-${token.role}`;
}

/**
 * Memisahkan kata kerja terkonjugasi menjadi { stem, suffix } untuk letter-level morphing.
 * Menjamin stem terkunci mati (zero transform, zero reflow) saat konjugasi berlangsung,
 * sedangkan hanya suffix yang berputar secara vertikal (roll).
 */
function getVerbStemAndSuffix(baseVerb, currentText) {
  if (!baseVerb || !currentText) {
    return { stem: '', suffix: currentText || '' };
  }

  const base = baseVerb.toLowerCase().trim();
  const current = currentText.toLowerCase().trim();

  // 1. Consonant + Y (e.g. study -> stud + y, stud + ied, stud + ying, stud + ies)
  if (base.length > 2 && /[^aeiou]y$/i.test(base)) {
    const root = base.slice(0, -1);
    if (current.startsWith(root)) {
      const stemLen = root.length;
      return {
        stem: currentText.slice(0, stemLen),
        suffix: currentText.slice(stemLen),
      };
    }
  }

  // 2. Silent E (e.g. close -> clos + e, clos + ed, clos + ing, clos + es)
  if (base.length > 2 && base.endsWith('e') && !base.endsWith('ee') && base !== 'be') {
    const root = base.slice(0, -1);
    if (current.startsWith(root)) {
      const stemLen = root.length;
      return {
        stem: currentText.slice(0, stemLen),
        suffix: currentText.slice(stemLen),
      };
    }
  }

  // 3. Regular verbs ending in consonants / vowel+y (e.g. work -> work + ed/ing/s, play -> play + ed/ing/s, watch -> watch + ed/ing/es)
  if (base.length > 1 && current.startsWith(base)) {
    return {
      stem: currentText.slice(0, base.length),
      suffix: currentText.slice(base.length),
    };
  }

  // 4. Irregular verbs (e.g. sing -> sang -> sung, go -> went -> gone) -> Full word rolls
  return {
    stem: '',
    suffix: currentText,
  };
}

const SUBJECT_PRESETS = [
  'I',
  'You',
  'We',
  'They',
  'He',
  'She',
  'It',
  'Sarah',
  'Sarah & Angga',
  'The book',
  'The books',
  'A cat',
];

const VERB_PRESETS = [
  'work',
  'study',
  'go',
  'eat',
  'sleep',
  'watch',
  'play',
  'help',
  'sing',
];

const VERBAL_TIME_SIGNALS = {
  SIMPLE: {
    PRESENT: ['every day', 'usually', 'always', 'often', 'at night', 'in the morning', 'on Mondays', 'sometimes'],
    PAST: ['yesterday', 'last night', 'this morning', 'at 7 PM yesterday', 'on Monday', 'in 2024', '2 days ago'],
    FUTURE: ['tomorrow', 'tonight', 'at 8 AM tomorrow', 'on Friday', 'in July', 'soon', 'next week'],
  },
  CONTINUOUS: {
    PRESENT: ['now', 'right now', 'at the moment', 'at present'],
    PAST: ['at 7 PM yesterday', 'when you called', 'at that time', 'on Sunday afternoon'],
    FUTURE: ['at 10 AM tomorrow', 'this time tomorrow', 'soon', 'on Saturday night'],
  },
  PERFECT: {
    PRESENT: ['already', 'just', 'yet', 'since morning', 'for 2 hours', 'in recent years'],
    PAST: ['before yesterday', 'by the time', 'already', 'at 5 PM yesterday'],
    FUTURE: ['by tomorrow', 'by next week', 'by 5 PM', 'at 6 PM tomorrow'],
  },
  'PER.CONT': {
    PRESENT: ['for 2 hours', 'since morning', 'all day', 'since 7 AM'],
    PAST: ['for 2 hours yesterday', 'before he came', 'all day', 'since 8 AM yesterday'],
    FUTURE: ['for 2 hours by tomorrow', 'by next month', 'all day', 'by 5 PM tomorrow'],
  },
};

const NOMINAL_TIME_SIGNALS = {
  SIMPLE: {
    PRESENT: ['now', 'right now', 'today', 'nowadays', 'at present', 'at night', 'in the morning'],
    PAST: ['yesterday', 'last year', 'in the past', 'at 7 PM yesterday', 'on Sunday', '2 years ago'],
    FUTURE: ['tomorrow', 'in the future', 'at 8 AM tomorrow', 'on Friday', 'someday', 'soon'],
  },
  CONTINUOUS: {
    PRESENT: ['now', 'right now', 'at the moment', 'at present'],
    PAST: ['yesterday', 'at that time', 'at 7 PM yesterday', 'back then'],
    FUTURE: ['tomorrow', 'soon', 'at 10 AM tomorrow', 'in the future'],
  },
  PERFECT: {
    PRESENT: ['already', 'lately', 'recently', 'since yesterday', 'for years'],
    PAST: ['before', 'previously', 'already', 'at 5 PM yesterday'],
    FUTURE: ['by next year', 'by tomorrow', 'soon', 'at 6 PM tomorrow'],
  },
  'PER.CONT': {
    PRESENT: ['for years', 'since then', 'all day', 'since 7 AM'],
    PAST: ['for years before', 'all along', 'since yesterday'],
    FUTURE: ['by next year', 'all day', 'by 5 PM tomorrow'],
  },
};

/**
 * Komponen pembungkus token kata pada preview kalimat utama
 * Mendukung Hover di Desktop dan Tap / Tap-and-Hold (~250ms) di Mobile/Touchscreen
 * Menampilkan Tooltip Mengambang (Zero Layout Shift)
 */
const SentenceTokenItem = ({
  token,
  persistentLayoutId,
  tokenStyle,
  punctuationMark,
  activeTooltipTokenId,
  setActiveTooltipTokenId,
  activeVerb,
  staggerDelay = 0,
}) => {
  const isPunctuation = token.role === 'punctuation' || !token.tooltipTitle;
  const [isHovered, setIsHovered] = useState(false);
  const pressTimerRef = useRef(null);
  const didLongPressRef = useRef(false);

  const isOpen = !isPunctuation && (isHovered || activeTooltipTokenId === token.id);

  // Bersihkan timer press jika unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (isPunctuation) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isPunctuation) return;
    setIsHovered(false);
  };

  // Touch handling untuk mobile tap & tap-and-hold (~250ms)
  const handleTouchStart = (e) => {
    if (isPunctuation) return;
    e.stopPropagation();
    didLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setActiveTooltipTokenId(token.id);
    }, 250);
  };

  const handleTouchEnd = (e) => {
    if (isPunctuation) return;
    e.stopPropagation();
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleClick = (e) => {
    if (isPunctuation) return;
    e.stopPropagation();
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    setActiveTooltipTokenId((prev) => (prev === token.id ? null : token.id));
  };

  // Letter-Level Morphing untuk verb token
  const isVerb = token.role === 'verb';
  const { stem, suffix } = useMemo(() => {
    if (!isVerb) return { stem: '', suffix: token.text };
    return getVerbStemAndSuffix(activeVerb, token.text);
  }, [isVerb, activeVerb, token.text]);

  const hasStem = Boolean(stem);

  return (
    <motion.div
      layout="position"
      layoutId={persistentLayoutId}
      custom={{ delay: staggerDelay }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={tokenVariants}
      transition={tokenTransition}
      className={`relative inline-flex items-baseline select-none ${
        isOpen ? 'z-30 overflow-visible' : 'z-20 overflow-hidden'
      } cursor-pointer`}
      style={{
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        lineHeight: 1,
        verticalAlign: 'baseline',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
    >
      <span
        className={`whitespace-nowrap inline-flex items-baseline ${tokenStyle} ${
          isOpen ? 'opacity-100 underline decoration-amber-400/60 decoration-2 underline-offset-4' : ''
        }`}
        style={{ lineHeight: 1, verticalAlign: 'baseline' }}
      >
        {hasStem ? (
          /* Letter-Level Morphing: Invariant Stem Locked in Place + Suffix Rolling */
          <span
            className="inline-flex items-baseline"
            style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1, verticalAlign: 'baseline' }}
          >
            {/* 1. Stem (akar kata) terkunci mati: zero transform, zero reflow */}
            <span
              className="inline-block select-none"
              style={{ display: 'inline-block', lineHeight: 1, verticalAlign: 'baseline' }}
            >{stem}</span>{/* 2. Suffix (akhiran) melakukan vertical rolling */}<motion.span
              layout="size"
              transition={{
                layout: { type: 'spring', stiffness: 400, damping: 35, delay: staggerDelay },
              }}
              className="inline-block overflow-hidden relative"
              style={{
                display: 'inline-block',
                verticalAlign: 'baseline',
                lineHeight: 1,
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginTop: '-0.15em',
                marginBottom: '-0.15em',
              }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={staggerDelay}>
                <motion.span
                  key={suffix ? suffix.toLowerCase() : '__empty__'}
                  custom={staggerDelay}
                  variants={rollVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="inline-block"
                  style={{
                    display: 'inline-block',
                    lineHeight: 1,
                    verticalAlign: 'baseline',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {suffix}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </span>
        ) : (
          /* Whole Token Vertical Rolling (Slot Machine / Odometer) */
          <motion.span
            layout="size"
            transition={{
              layout: { type: 'spring', stiffness: 400, damping: 35, delay: staggerDelay },
            }}
            className="inline-block overflow-hidden relative"
            style={{
              display: 'inline-block',
              verticalAlign: 'baseline',
              lineHeight: 1,
              position: 'relative',
              overflow: 'hidden',
              paddingTop: '0.15em',
              paddingBottom: '0.15em',
              marginTop: '-0.15em',
              marginBottom: '-0.15em',
            }}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={staggerDelay}>
              <motion.span
                key={token.text.toLowerCase()}
                custom={staggerDelay}
                variants={rollVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="inline-block"
                style={{
                  display: 'inline-block',
                  lineHeight: 1,
                  verticalAlign: 'baseline',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.text}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}

        {punctuationMark && (
          <span
            className="text-zinc-400 select-none pointer-events-none"
            style={{ lineHeight: 1, verticalAlign: 'baseline' }}
          >
            {punctuationMark}
          </span>
        )}
      </span>

      {/* Floating Grammar Tooltip Card (Zero Layout Shift) */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none w-max max-w-[210px] sm:max-w-[260px] whitespace-normal bg-[#151724] border border-zinc-700/80 rounded-lg p-2.5 shadow-2xl text-left"
        >
          <div className="text-amber-300 font-bold uppercase text-[10px] sm:text-[11px] tracking-wider mb-0.5">
            {token.tooltipTitle}
          </div>
          <div className="text-zinc-300 text-[11px] sm:text-xs leading-relaxed font-sans font-normal">
            {token.tooltipDescription}
          </div>
          {/* Caret Arrow pointing down */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-solid border-t-[#151724] border-t-[6px] border-x-transparent border-x-[6px] border-b-0"
            aria-hidden="true"
          />
        </div>
      )}
    </motion.div>
  );
};

export const GrammarPlayground = ({ onBack, initialConfig }) => {
  const [activeTooltipTokenId, setActiveTooltipTokenId] = useState(null); // Single active tooltip ID
  const [sentenceType, setSentenceType] = useState('verbal'); // 'verbal' | 'nominal'
  const [isPassive, setIsPassive] = useState(false); // Toggle Passive Voice (Khusus Verbal)
  const [showTranslation, setShowTranslation] = useState(true); // Toggle Terjemahan Bahasa Indonesia Dinamis
  const [aspect, setAspect] = useState('SIMPLE'); // 'SIMPLE' | 'CONTINUOUS' | 'PERFECT' | 'PER.CONT'
  const [nominalComplement, setNominalComplement] = useState('happy');
  const [customComplementInput, setCustomComplementInput] = useState('');

  const [tense, setTense] = useState('PRESENT'); // 'PRESENT' | 'PAST' | 'FUTURE'
  const [form, setForm] = useState('positive'); // 'positive' | 'negative' | 'question' | 'negative_question'
  const [useContraction, setUseContraction] = useState(true); // Toggle singkatan: don't, doesn't, didn't, won't, isn't, aren't
  const [subject, setSubject] = useState('Sarah');
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [object, setObject] = useState('none'); // Default: Tanpa Objek
  const [customObjectInput, setCustomObjectInput] = useState('');
  const [verb, setVerb] = useState('study');
  const [customVerbInput, setCustomVerbInput] = useState('');
  const [timeSignal, setTimeSignal] = useState('every day');

  const [verbSuggestions, setVerbSuggestions] = useState([]);
  const [showVerbSuggestions, setShowVerbSuggestions] = useState(false);
  const [nominalSuggestions, setNominalSuggestions] = useState([]);
  const [showNominalSuggestions, setShowNominalSuggestions] = useState(false);
  const [openPicker, setOpenPicker] = useState(null); // 'timeSignal' | 'subject' | 'predicate' | 'object' | null
  const pickerContainerRef = useRef(null);

  // Menerapkan konfigurasi preset dari modul pembelajaran (misal dari CTA Unit 3 Prepositions)
  useEffect(() => {
    if (!initialConfig) return;
    if (initialConfig.sentenceType) setSentenceType(initialConfig.sentenceType);
    if (initialConfig.aspect) setAspect(initialConfig.aspect);
    if (initialConfig.tense) setTense(initialConfig.tense);
    if (initialConfig.form) setForm(initialConfig.form);
    if (initialConfig.subject) setSubject(initialConfig.subject);
    if (initialConfig.verb) setVerb(initialConfig.verb);
    if (initialConfig.nominalComplement) setNominalComplement(initialConfig.nominalComplement);
    if (initialConfig.object !== undefined) setObject(initialConfig.object);
    if (initialConfig.timeSignal) setTimeSignal(initialConfig.timeSignal);
    if (initialConfig.useContraction !== undefined) setUseContraction(initialConfig.useContraction);
    if (initialConfig.isPassive !== undefined) setIsPassive(initialConfig.isPassive);
  }, [initialConfig]);

  const activeSignalsMap = sentenceType === 'verbal' ? VERBAL_TIME_SIGNALS : NOMINAL_TIME_SIGNALS;

  // Auto-reset time signal saat berpindah mode Verbal vs Nominal
  const handleSentenceTypeChange = (newType) => {
    if (newType !== sentenceType) {
      setSentenceType(newType);
      if (newType !== 'verbal') {
        setIsPassive(false);
      }
      setTimeSignal('none');
      setShowVerbSuggestions(false);
      setShowNominalSuggestions(false);
      setOpenPicker(null);
    }
  };

  // Switch time signal default when tense changes (preserve 'none' if chosen)
  const handleTenseChange = (newTense) => {
    setTense(newTense);
    if (timeSignal === 'none') {
      return;
    }
    const signals = activeSignalsMap[aspect]?.[newTense] || [];
    setTimeSignal(signals[0] || 'none');
  };

  // Switch time signal default when aspect changes (preserve 'none' if chosen)
  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (timeSignal === 'none') {
      return;
    }
    const signals = activeSignalsMap[newAspect]?.[tense] || [];
    setTimeSignal(signals[0] || 'none');
  };

  const handleCustomVerbChange = (val) => {
    setCustomVerbInput(val);
    const trimmed = val.trim();
    if (trimmed.length >= 2) {
      const sugs = getVerbSuggestions(trimmed, 5);
      setVerbSuggestions(sugs);
      setShowVerbSuggestions(sugs.length > 0);
    } else {
      setVerbSuggestions([]);
      setShowVerbSuggestions(false);
    }
  };

  const handleSelectVerbSuggestion = (sug) => {
    setCustomVerbInput(sug);
    setShowVerbSuggestions(false);
  };

  const handleCustomComplementChange = (val) => {
    setCustomComplementInput(val);
    const trimmed = val.trim();
    if (trimmed.length >= 2) {
      const sugs = getNominalSuggestions(trimmed, 5);
      setNominalSuggestions(sugs);
      setShowNominalSuggestions(sugs.length > 0);
    } else {
      setNominalSuggestions([]);
      setShowNominalSuggestions(false);
    }
  };

  const handleSelectNominalSuggestion = (sug) => {
    setCustomComplementInput(sug);
    setShowNominalSuggestions(false);
  };

  const activeSubject = customSubjectInput.trim() !== '' ? customSubjectInput.trim() : subject;
  const activeVerb = customVerbInput.trim() !== '' ? customVerbInput.trim().toLowerCase() : verb;
  const activeObject =
    customObjectInput.trim() !== ''
      ? customObjectInput.trim()
      : object === 'none'
      ? ''
      : object;
  const activeComplement =
    customComplementInput.trim() !== '' ? customComplementInput.trim() : nominalComplement;

  const currentVerbLookup = useMemo(() => lookupVerb(activeVerb), [activeVerb]);
  const isCurrentVerbTransitive = currentVerbLookup.isValid
    ? currentVerbLookup.data.transitive !== false
    : true;

  // Auto-reset Passive jika kata kerja intransitif atau bukan mode verbal
  useEffect(() => {
    if (sentenceType !== 'verbal' && isPassive) {
      setIsPassive(false);
    } else if (!isCurrentVerbTransitive && isPassive) {
      setIsPassive(false);
    }
  }, [sentenceType, isCurrentVerbTransitive, isPassive]);

  const sentenceData = useMemo(() => {
    return buildSentence({
      subject: activeSubject,
      verb1: activeVerb,
      tense,
      aspect,
      form,
      timeSignal: timeSignal === 'none' ? null : timeSignal,
      contracted: useContraction,
      sentenceType,
      nominalComplement: activeComplement,
      object: activeObject,
      isPassive,
    });
  }, [
    activeSubject,
    activeVerb,
    tense,
    aspect,
    form,
    timeSignal,
    useContraction,
    sentenceType,
    activeComplement,
    activeObject,
    isPassive,
  ]);

  const wordTokens = useMemo(() => {
    return (sentenceData?.tokens || []).filter((t) => t.role !== 'punctuation');
  }, [sentenceData?.tokens]);

  const punctuationMark = useMemo(() => {
    const punct = (sentenceData?.tokens || []).find((t) => t.role === 'punctuation');
    return punct ? punct.text : '.';
  }, [sentenceData?.tokens]);

  // Ref penyimpan snapshot token sebelumnya untuk deteksi perubahan kata
  const prevTokensMapRef = useRef(new Map());

  // Perhitungan Stagger Delay (kiri ke kanan: 0ms, 120ms, 240ms...) untuk token yang mengalami perubahan nilai
  const tokenDelaysMap = useMemo(() => {
    const delays = {};
    const prevMap = prevTokensMapRef.current;

    // Pada render inisial / pertama, jangan berikan delay agar tidak ada glitch
    if (!prevMap || prevMap.size === 0) {
      return delays;
    }

    let changedCount = 0;
    for (const token of wordTokens) {
      const pId = getPersistentLayoutId(token);
      const prevText = prevMap.get(pId);
      const currText = token.text.toLowerCase();

      // Cek apakah ada perubahan kosakata (abaikan perbedaan kapitalisasi seperti 'is' -> 'Is')
      if (prevText === undefined || prevText !== currText) {
        delays[pId] = changedCount * 0.12;
        changedCount++;
      } else {
        delays[pId] = 0;
      }
    }

    return delays;
  }, [wordTokens]);

  // Sinkronisasi snapshot token sebelumnya setelah render selesai
  useEffect(() => {
    const map = new Map();
    for (const token of wordTokens) {
      const pId = getPersistentLayoutId(token);
      map.set(pId, token.text.toLowerCase());
    }
    prevTokensMapRef.current = map;
  }, [wordTokens]);

  // Tutup tooltip saat klik atau tap di luar kata
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveTooltipTokenId(null);
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Reset tooltip aktif saat parameter atau data kalimat berubah
  useEffect(() => {
    setActiveTooltipTokenId(null);
  }, [sentenceData]);

  // Tutup dropdown picker saat klik di luar area picker
  useEffect(() => {
    const handlePickerOutsideClick = (e) => {
      if (pickerContainerRef.current && !pickerContainerRef.current.contains(e.target)) {
        setOpenPicker(null);
      }
    };

    document.addEventListener('mousedown', handlePickerOutsideClick);
    document.addEventListener('touchstart', handlePickerOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handlePickerOutsideClick);
      document.removeEventListener('touchstart', handlePickerOutsideClick);
    };
  }, []);

  const subjectType = useMemo(() => {
    return detectSubjectType(activeSubject);
  }, [activeSubject]);

  const grammarExplanation = useMemo(() => {
    // 0. Peringatan Validasi Kosakata
    if (sentenceType === 'verbal' && sentenceData.isVerbValid === false) {
      return `Kata kerja "${activeVerb}" tidak dikenali dalam kamus bahasa Inggris. Silakan masukkan kata kerja bentuk pertama (V1) yang valid.`;
    }
    if (sentenceType === 'nominal' && sentenceData.isComplementValid === false) {
      return `Komplemen "${activeComplement}" tidak dikenali. Silakan gunakan kata sifat (misal: happy, busy), kata benda (misal: a doctor, students), atau keterangan tempat (misal: at home, here).`;
    }

    // Peringatan Kata Kerja Intransitif
    if (sentenceType === 'verbal' && !isCurrentVerbTransitive) {
      return `Kata kerja "${activeVerb}" adalah intransitif (tidak berobjek) dan tidak dapat diubah ke bentuk pasif.`;
    }

    // Penjelasan Mode Pasif
    if (sentenceType === 'verbal' && sentenceData.isPassive) {
      const v3 = sentenceData.verbData?.v3 || 'V3';
      const agent = sentenceData.agentPhrase || '';
      const passSubj = sentenceData.passiveSubject || '';
      return `Kalimat Pasif: Objek "${passSubj}" menjadi subjek penerima aksi, kata kerja berubah ke bentuk V3 (${v3}), dan pelaku dipindahkan menjadi "${agent}".`;
    }

    const isThirdPersonSingular = subjectType === SUBJECT_TYPES.THIRD_PERSON_SINGULAR;
    const isFirstPerson = subjectType === SUBJECT_TYPES.FIRST_PERSON;
    const isNegativeQuestion = form === 'negative_question' || form === '-?';

    const subjTypeName =
      isFirstPerson
        ? 'Orang Pertama (I)'
        : subjectType === SUBJECT_TYPES.SECOND_PERSON
        ? 'Orang Kedua (You)'
        : subjectType === SUBJECT_TYPES.PLURAL
        ? 'Jamak (Plural / Lebih dari satu)'
        : 'Tunggal (Third Person Singular)';

    // 1. Negative Question
    if (isNegativeQuestion) {
      if (sentenceType === 'nominal') {
        if (aspect === 'PERFECT' || aspect === 'PER.CONT') {
          return 'Kalimat tanya negatif nominal Perfect: Helper HAVE negatif melompat ke depan subjek ("Hasn\'t/Haven\'t/Hadn\'t... been").';
        }
        return 'Kalimat tanya negatif nominal: Helper BE negatif pindah ke depan subjek untuk menanyakan kepastian/sanggahan (Bukankah... / Tidakkah...?).';
      }
      if (aspect === 'PERFECT') {
        return 'Kalimat tanya negatif Perfect: Helper HAVE negatif ("Hasn\'t", "Haven\'t", "Hadn\'t", "Won\'t") pindah ke depan untuk menyatakan pertanyaan bernada konfirmasi (Bukankah sudah...?).';
      }
      if (aspect === 'PER.CONT') {
        return 'Kalimat tanya negatif Perfect Continuous: Helper HAVE negatif pindah ke depan menanyakan aktivitas yang belum/sudah berlangsung.';
      }
      if (aspect === 'CONTINUOUS') {
        return 'Kalimat tanya negatif continuous: Helper BE negatif pindah ke depan untuk menanyakan kegiatan yang sedang berlangsung bernada sanggahan.';
      }
      return 'Kalimat tanya negatif: helper negatif pindah ke depan untuk menyatakan pertanyaan bernada menyangkal atau memastikan (Bukankah... / Tidakkah...?).';
    }

    // 2. Aspect PERFECT
    if (aspect === 'PERFECT') {
      if (sentenceType === 'nominal') {
        if (tense === 'PRESENT') {
          const haveForm = isThirdPersonSingular ? 'has been' : 'have been';
          return `Present Perfect Nominal: Helper "${haveForm}" menghubungkan subjek (${subjTypeName}) dengan kondisi/sifat (${activeComplement}).`;
        }
        if (tense === 'PAST') {
          return `Past Perfect Nominal: Helper "had been" menyatakan kondisi/sifat yang telah ada sebelum peristiwa lampau lain terjadi.`;
        }
        if (tense === 'FUTURE') {
          return `Future Perfect Nominal: Helper "will have been" menargetkan kondisi yang akan sudah terwujud di masa depan.`;
        }
      } else {
        const v3 = getPastParticipleVerb(activeVerb);
        if (tense === 'PRESENT') {
          const haveWord = isThirdPersonSingular ? 'has' : 'have';
          return `Present Perfect: Helper HAVE ("${haveWord}") memanggil Verb 3 (${v3}) untuk menyatakan peristiwa yang sudah tuntas dengan efek yang masih terasa saat ini.`;
        }
        if (tense === 'PAST') {
          return `Past Perfect: Helper "had" + Verb 3 (${v3}) menyatakan peristiwa yang sudah selesai SEBELUM momen lampau lainnya terjadi.`;
        }
        if (tense === 'FUTURE') {
          return `Future Perfect: Helper modal "will have" + Verb 3 (${v3}) menargetkan peristiwa yang akan sudah selesai di masa depan.`;
        }
      }
    }

    // 3. Aspect PERFECT CONTINUOUS
    if (aspect === 'PER.CONT') {
      if (sentenceType === 'nominal') {
        return 'Perfect Continuous Nominal: Rumus murni menggabungkan Perfect (been) dan Continuous (being) menjadi \'has/have/had/will have been being\'. Bentuk ini sah secara gramatikal meskipun sangat jarang digunakan dalam percakapan sehari-hari.';
      }
      const vIng = getVerbIng(activeVerb);
      if (tense === 'PRESENT') {
        const haveWord = isThirdPersonSingular ? 'has been' : 'have been';
        return `Present Perfect Continuous: Helper "${haveWord}" + V-ing (${vIng}) menyatakan kegiatan yang dimulai sejak lampau dan MASIH berlanjut saat ini.`;
      }
      if (tense === 'PAST') {
        return `Past Perfect Continuous: Helper "had been" + V-ing (${vIng}) menyatakan durasi kegiatan yang sedang berjalan sebelum peristiwa lampau lain memotongnya.`;
      }
      if (tense === 'FUTURE') {
        return `Future Perfect Continuous: Helper "will have been" + V-ing (${vIng}) menyatakan akumulasi durasi kegiatan yang akan masih berlangsung di masa depan.`;
      }
    }

    // 4. Aspect CONTINUOUS
    if (aspect === 'CONTINUOUS') {
      if (sentenceType === 'nominal') {
        return 'Continuous Nominal: Helper BE kedua berubah menjadi \'being\' untuk menyatakan kondisi atau perilaku yang sedang ditunjukkan pada saat ini.';
      } else {
        const vIng = getVerbIng(activeVerb);
        if (tense === 'PRESENT') {
          const beForm = isFirstPerson ? 'am' : isThirdPersonSingular ? 'is' : 'are';
          return `Present Continuous: Helper BE "${beForm}" hadir menemani kata kerja "-ing" (${vIng}) untuk menyatakan aktivitas yang SEDANG berlangsung saat ini.`;
        }
        if (tense === 'PAST') {
          const beForm = isFirstPerson || isThirdPersonSingular ? 'was' : 'were';
          return `Past Continuous: Helper BE lampau "${beForm}" menemani "${vIng}" untuk menyatakan kegiatan yang SEDANG berlangsung di masa lampau.`;
        }
        if (tense === 'FUTURE') {
          return `Future Continuous: Helper "will be" menemani "${vIng}" untuk menyatakan kegiatan yang AKAN SEDANG berlangsung di masa depan.`;
        }
      }
    }

    // 5. Aspect SIMPLE (Nominal)
    if (sentenceType === 'nominal') {
      if (tense === 'PRESENT') {
        const beForm = isFirstPerson ? 'am' : isThirdPersonSingular ? 'is' : 'are';
        return `Kalimat nominal Present: Helper BE "${beForm}" menyambungkan subjek (${subjTypeName}) dengan sifat/benda/tempat (${activeComplement}).`;
      }
      if (tense === 'PAST') {
        const beForm = isFirstPerson || isThirdPersonSingular ? 'was' : 'were';
        return `Kalimat nominal Past: Helper BE lampau "${beForm}" menghubungkan subjek dengan kondisi sifat/benda/tempat di masa lalu.`;
      }
      if (tense === 'FUTURE') {
        return `Kalimat nominal Future: Helper modal "will be" menghubungkan subjek dengan kondisi sifat/benda/tempat di masa depan.`;
      }
    }

    // 6. Aspect SIMPLE (Verbal)
    if (tense === 'PRESENT') {
      if (form === 'positive') {
        if (isThirdPersonSingular) {
          return `Subjek tunggal (${subjTypeName}) di Present Simple mewajibkan kata kerja mendapat akhiran -s/-es/-ies (${activeVerb} ➔ ${getPresentThirdPersonVerb(activeVerb)}).`;
        }
        return `Subjek (${subjTypeName}) di Present Simple menggunakan kata kerja dasar Verb 1 murni (${activeVerb}).`;
      }
      if (form === 'negative') {
        const helperText = useContraction
          ? (isThirdPersonSingular ? "doesn't" : "don't")
          : (isThirdPersonSingular ? "does not" : "do not");
        if (isThirdPersonSingular) {
          return `Subjek tunggal memanggil helper "${helperText}", dan kata kerja otomatis kembali ke bentuk dasar (${activeVerb}).`;
        }
        return `Subjek memanggil helper "${helperText}", dan kata kerja tetap bentuk dasar (${activeVerb}).`;
      }
      if (form === 'question') {
        if (isThirdPersonSingular) {
          return `Helper "Does" melompat ke depan subjek untuk bertanya, dan kata kerja tetap bentuk dasar (${activeVerb}).`;
        }
        return `Helper "Do" melompat ke depan subjek untuk bertanya, dan kata kerja tetap bentuk dasar (${activeVerb}).`;
      }
    } else if (tense === 'PAST') {
      if (form === 'positive') {
        return `Kalimat positif masa lalu wajib memakai Verb 2 (${activeVerb} ➔ ${getPastVerb(activeVerb)}) untuk semua subjek.`;
      }
      if (form === 'negative') {
        const helperText = useContraction ? "didn't" : "did not";
        return `Efek sedot lampau: helper "${helperText}" hadir, sehingga kata kerja yang tadinya lampau kembali murni ke Verb 1 dasar (${activeVerb}).`;
      }
      if (form === 'question') {
        return `Helper lampau "Did" melompat ke depan subjek, dan kata kerja kembali ke Verb 1 dasar (${activeVerb}).`;
      }
    } else if (tense === 'FUTURE') {
      if (form === 'positive') {
        return `Helper "will" disisipkan untuk menyatakan rencana masa depan. Semua subjek memakai kata kerja Verb 1 dasar (${activeVerb}).`;
      }
      if (form === 'negative') {
        const helperText = useContraction ? "won't" : "will not";
        return `Cukup gunakan helper "${helperText}" untuk menyatakan sanggahan rencana di masa depan.`;
      }
      if (form === 'question') {
        return `Helper masa depan "Will" melompat ke depan subjek untuk menanyakan kepastian rencana.`;
      }
    }

    return '';
  }, [
    tense,
    aspect,
    form,
    subjectType,
    activeVerb,
    activeComplement,
    sentenceType,
    useContraction,
    sentenceData.isVerbValid,
    sentenceData.isComplementValid,
  ]);

  const tenseFormulaInfo = useMemo(() => {
    return getTenseFormulaInfo({
      tense,
      aspect,
      sentenceType,
      form,
      isPassive: sentenceData.isPassive,
    });
  }, [tense, aspect, sentenceType, form, sentenceData.isPassive]);

  const handleReset = () => {
    setSentenceType('verbal');
    setIsPassive(false);
    setShowTranslation(true);
    setAspect('SIMPLE');
    setTense('PRESENT');
    setForm('positive');
    setUseContraction(true);
    setSubject('Sarah');
    setCustomSubjectInput('');
    setObject('none');
    setCustomObjectInput('');
    setVerb('study');
    setCustomVerbInput('');
    setNominalComplement('happy');
    setCustomComplementInput('');
    setTimeSignal('every day');
    setVerbSuggestions([]);
    setShowVerbSuggestions(false);
    setNominalSuggestions([]);
    setShowNominalSuggestions(false);
    setOpenPicker(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#090a0f] text-zinc-100 select-none overflow-hidden flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="px-5 md:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 flex items-center justify-between shrink-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-b border-[#232736]/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke daftar materi"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kurikulum</span>
          </button>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm font-bold text-white hidden sm:inline">
            Grammar Playground (Simulator A1)
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="h-7 px-3 rounded-lg bg-[#181a24] hover:bg-[#202330] text-zinc-400 hover:text-white text-xs font-medium transition-colors border-0 cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </button>
      </header>

      {/* Main Container - Expanded Width (max-w-6xl w-full) & Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-12 flex flex-col items-center gap-2.5 sm:gap-3">
          {/* ========================================================================= */}
          {/* TOP SECTION: ENGINE STRIP, SENTENCE PREVIEW & MINIMALIST ICONS            */}
          {/* ========================================================================= */}
          <motion.div
            layout="position"
            transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
            className="w-full flex flex-col items-center shrink-0 space-y-2.5"
          >
            {/* 1. Grammar Engine Explanation Strip - Posisi Paling Atas */}
            <div className="w-full bg-[#141622] rounded-xl px-3.5 py-1.5 text-[11px] sm:text-xs text-zinc-300 flex items-center gap-2 text-left relative z-0">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px] shrink-0 border-0">
                ⓘ
              </span>
              <p className="line-clamp-1 flex-1">
                <strong className="text-zinc-400">Logika Mesin:</strong> {grammarExplanation}
              </p>
            </div>

            {/* 2. Main Sentence Preview Canvas (Pure Floating Canvas, Center-Aligned, No Box/Card) */}
            <motion.div
              layout="position"
              transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
              className="w-full py-2.5 sm:py-3.5 flex flex-col items-center justify-center relative z-20 overflow-visible min-h-[4rem] sm:min-h-[4.5rem]"
            >
              <LayoutGroup id="sentence-preview-stage">
                <motion.div
                  layout
                  layoutRoot
                  className="inline-flex items-baseline justify-center flex-wrap gap-y-2 min-h-[3.5rem] sm:min-h-[4rem] text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-center relative z-10"
                  style={{ position: 'relative', isolation: 'isolate' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                >
                  <AnimatePresence initial={false}>
                    {wordTokens.map((token, idx) => {
                      let tokenStyle = 'text-white';
                      if (token.role === 'invalid') {
                        tokenStyle = 'text-rose-400 font-bold italic tracking-wide';
                      } else if (token.role === 'subject-contracted') {
                        tokenStyle = 'text-sky-300 font-bold';
                      } else if (token.role === 'verb') {
                        tokenStyle = token.isIng
                          ? 'text-cyan-400 font-bold'
                          : token.isV3
                          ? 'text-emerald-300 font-bold'
                          : 'text-emerald-400 font-bold';
                      } else if (token.role === 'complement') {
                        tokenStyle = 'text-purple-400 font-bold';
                      } else if (token.role === 'object') {
                        tokenStyle = 'text-amber-300 font-semibold';
                      } else if (token.role === 'agent') {
                        tokenStyle = 'text-zinc-400 font-normal italic';
                      } else if (token.role === 'helper-have') {
                        tokenStyle = 'text-indigo-400 font-bold';
                      } else if (token.role === 'helper-be') {
                        tokenStyle = 'text-blue-400 font-bold';
                      } else if (token.role === 'helper-negative') {
                        tokenStyle = 'text-red-400 font-bold';
                      } else if (token.role === 'helper-question') {
                        tokenStyle = 'text-amber-400 font-bold';
                      } else if (token.role === 'helper-negative-question') {
                        tokenStyle = 'text-rose-400 font-bold';
                      } else if (token.role === 'helper-modal') {
                        tokenStyle = 'text-blue-400 font-bold';
                      } else if (token.role === 'timeSignal') {
                        tokenStyle = 'text-zinc-300 font-normal';
                      }

                      const isLastWord = idx === wordTokens.length - 1;
                      const persistentLayoutId = getPersistentLayoutId(token);

                      return (
                        <SentenceTokenItem
                          key={persistentLayoutId}
                          persistentLayoutId={persistentLayoutId}
                          token={token}
                          tokenStyle={tokenStyle}
                          punctuationMark={isLastWord ? punctuationMark : null}
                          activeTooltipTokenId={activeTooltipTokenId}
                          setActiveTooltipTokenId={setActiveTooltipTokenId}
                          activeVerb={activeVerb}
                          staggerDelay={tokenDelaysMap[persistentLayoutId] || 0}
                        />
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>

              {/* Dynamic Indonesian Translation Bar */}
              {showTranslation && sentenceData.translation && (
                <motion.div
                  key={sentenceData.translation}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mt-2 text-xs sm:text-sm md:text-base font-sans italic text-zinc-400 font-normal tracking-wide text-center px-4"
                >
                  &ldquo;{sentenceData.translation}&rdquo;
                </motion.div>
              )}
            </motion.div>

            {/* 3. Form Switcher Bar: Minimalist Icons (+, -, ?, -?) */}
            <motion.div
              layout="position"
              transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
              className="flex items-center justify-center gap-5 sm:gap-7 py-0.5"
            >
              <button
                type="button"
                onClick={() => setForm('positive')}
                title="Bentuk Positif (+)"
                aria-label="Positif"
                className={`p-1.5 transition-all duration-200 border-0 bg-transparent cursor-pointer flex items-center justify-center ${
                  form === 'positive'
                    ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] scale-110'
                    : 'text-zinc-600 hover:text-zinc-300 scale-100 hover:scale-105'
                }`}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setForm('negative')}
                title="Bentuk Negatif (-)"
                aria-label="Negatif"
                className={`p-1.5 transition-all duration-200 border-0 bg-transparent cursor-pointer flex items-center justify-center ${
                  form === 'negative'
                    ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] scale-110'
                    : 'text-zinc-600 hover:text-zinc-300 scale-100 hover:scale-105'
                }`}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setForm('question')}
                title="Bentuk Tanya (?)"
                aria-label="Tanya"
                className={`p-1.5 transition-all duration-200 border-0 bg-transparent cursor-pointer flex items-center justify-center ${
                  form === 'question'
                    ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-110'
                    : 'text-zinc-600 hover:text-zinc-300 scale-100 hover:scale-105'
                }`}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setForm('negative_question')}
                title="Bentuk Tanya Negatif (-?)"
                aria-label="Tanya Negatif"
                className={`p-1.5 transition-all duration-200 border-0 bg-transparent cursor-pointer flex items-center justify-center ${
                  form === 'negative_question'
                    ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.8)] scale-110'
                    : 'text-zinc-600 hover:text-zinc-300 scale-100 hover:scale-105'
                }`}
              >
                <svg className="w-7 h-6 sm:w-8 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 28 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 8c0-1.8 1.4-3 3.3-3 1.9 0 3.2 1.2 3.2 2.8 0 1.5-1 2.3-2.1 3.1-.9.7-1.4 1.3-1.4 2.6v.5M17.5 18h.01" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BOTTOM SECTION: RESTRUCTURED 3-ROW CONTROL CONSOLE                        */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#11131c] rounded-2xl p-3.5 sm:p-4 space-y-3 text-left shrink-0">
            {/* ROW 1: Fixed 1-Row Horizontal Main Controls (Mode | Pasif | Waktu Utama | Aspek Waktu) */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* Mode Switcher */}
              <div className="inline-flex rounded-lg bg-[#181b28] p-0.5 shrink-0 h-8">
                <button
                  type="button"
                  onClick={() => handleSentenceTypeChange('verbal')}
                  className={`h-7 px-3 rounded-md text-xs font-mono font-bold transition-all border-0 cursor-pointer ${
                    sentenceType === 'verbal'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Verbal
                </button>
                <button
                  type="button"
                  onClick={() => handleSentenceTypeChange('nominal')}
                  className={`h-7 px-3 rounded-md text-xs font-mono font-bold transition-all border-0 cursor-pointer ${
                    sentenceType === 'nominal'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Nominal
                </button>
              </div>

              {/* Toggle Switch Pasif (Real Switch, Fixed Position & Dimension) */}
              <div
                className={`flex items-center gap-2 h-8 px-2.5 rounded-lg bg-[#181b28] shrink-0 transition-opacity ${
                  sentenceType !== 'verbal' || !isCurrentVerbTransitive
                    ? 'opacity-40 cursor-not-allowed'
                    : 'opacity-100'
                }`}
                title={
                  sentenceType !== 'verbal'
                    ? 'Hanya aktif pada mode Verbal'
                    : !isCurrentVerbTransitive
                    ? 'Kata kerja intransitif tidak dapat dipasifkan'
                    : 'Toggle Kalimat Pasif'
                }
              >
                <span className="text-xs font-mono font-semibold text-zinc-300">Pasif</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPassive && sentenceType === 'verbal' && isCurrentVerbTransitive}
                  disabled={sentenceType !== 'verbal' || !isCurrentVerbTransitive}
                  onClick={() => {
                    if (sentenceType !== 'verbal' || !isCurrentVerbTransitive) return;
                    const willBePassive = !isPassive;
                    setIsPassive(willBePassive);
                    if (willBePassive && (!activeObject || activeObject === 'none')) {
                      setObject('a book');
                      setCustomObjectInput('');
                    }
                  }}
                  className={`relative inline-flex h-4 w-8 shrink-0 rounded-full transition-colors duration-200 ease-in-out border-0 ${
                    isPassive && sentenceType === 'verbal' && isCurrentVerbTransitive
                      ? 'bg-amber-500'
                      : 'bg-zinc-700'
                  } ${
                    sentenceType !== 'verbal' || !isCurrentVerbTransitive
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out my-auto ml-0.5 ${
                      isPassive && sentenceType === 'verbal' && isCurrentVerbTransitive
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Waktu Utama (Fixed Segmented Control) */}
              <div className="grid grid-cols-3 gap-0.5 bg-[#181b28] p-0.5 rounded-lg h-8 shrink-0 w-full sm:w-[220px]">
                {[
                  { id: 'PRESENT', label: 'PRESENT' },
                  { id: 'PAST', label: 'PAST' },
                  { id: 'FUTURE', label: 'FUTURE' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTenseChange(t.id)}
                    className={`h-7 rounded-md text-[11px] sm:text-xs font-mono font-bold transition-all border-0 cursor-pointer ${
                      tense === t.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Aspek Waktu (Fixed Segmented Control) */}
              <div className="grid grid-cols-4 gap-0.5 bg-[#181b28] p-0.5 rounded-lg h-8 shrink-0 w-full sm:w-[290px]">
                {[
                  { id: 'SIMPLE', label: 'SIMPLE' },
                  { id: 'CONTINUOUS', label: 'CONT.' },
                  { id: 'PERFECT', label: 'PERFECT' },
                  { id: 'PER.CONT', label: 'PER.CONT' },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleAspectChange(a.id)}
                    className={`h-7 rounded-md text-[10px] sm:text-[11px] font-mono font-bold transition-all border-0 cursor-pointer ${
                      aspect === a.id
                        ? a.id === 'SIMPLE'
                          ? 'bg-blue-600 text-white shadow'
                          : a.id === 'CONTINUOUS'
                          ? 'bg-cyan-600 text-white shadow'
                          : a.id === 'PERFECT'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-teal-600 text-white shadow'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 2: 4 Unified Popover Pickers in 1 Horizontal Line */}
            <div ref={pickerContainerRef} className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full relative z-30">
              {/* Picker 1: Time Signal */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'timeSignal' ? null : 'timeSignal')}
                  className={`w-full h-9 px-3 rounded-xl bg-[#181b28] hover:bg-[#202436] transition-colors border-0 flex items-center justify-between text-left cursor-pointer ${
                    openPicker === 'timeSignal' ? 'ring-1 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex flex-col truncate pr-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">Time Signal</span>
                    <span className="text-xs font-mono font-bold text-zinc-200 truncate">
                      {timeSignal === 'none' ? '(Tanpa)' : timeSignal}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">▾</span>
                </button>

                {openPicker === 'timeSignal' && (
                  <div className="absolute bottom-full mb-2 left-0 z-50 w-64 sm:w-72 bg-[#161827] border border-zinc-700/80 rounded-xl p-3 shadow-2xl space-y-2">
                    <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                      Pilih Time Signal
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                      <button
                        type="button"
                        onClick={() => {
                          setTimeSignal('none');
                          setOpenPicker(null);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 cursor-pointer ${
                          timeSignal === 'none' ? 'bg-zinc-700 text-white font-bold' : 'bg-[#1e2235] text-zinc-400 hover:text-white'
                        }`}
                      >
                        (Tanpa)
                      </button>
                      {(activeSignalsMap[aspect]?.[tense] || []).map((ts) => (
                        <button
                          key={ts}
                          type="button"
                          onClick={() => {
                            setTimeSignal(ts);
                            setOpenPicker(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 cursor-pointer ${
                            timeSignal === ts ? 'bg-blue-600 text-white font-bold' : 'bg-[#1e2235] text-zinc-400 hover:text-white'
                          }`}
                        >
                          {ts}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Picker 2: Subjek */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'subject' ? null : 'subject')}
                  className={`w-full h-9 px-3 rounded-xl bg-[#181b28] hover:bg-[#202436] transition-colors border-0 flex items-center justify-between text-left cursor-pointer ${
                    openPicker === 'subject' ? 'ring-1 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex flex-col truncate pr-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">Subjek</span>
                    <span className="text-xs font-mono font-bold text-amber-300 truncate">
                      {activeSubject}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">▾</span>
                </button>

                {openPicker === 'subject' && (
                  <div className="absolute bottom-full mb-2 left-0 sm:left-0 z-50 w-72 sm:w-80 bg-[#161827] border border-zinc-700/80 rounded-xl p-3 shadow-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                        Pilihan Subjek
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">
                        {subjectType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto no-scrollbar">
                      {SUBJECT_PRESETS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSubject(s);
                            setCustomSubjectInput('');
                            setOpenPicker(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 cursor-pointer ${
                            activeSubject === s && customSubjectInput === ''
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-[#1e2235] text-zinc-400 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-zinc-800">
                      <input
                        type="text"
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        placeholder="Ketik subjek kustom..."
                        className="w-full h-7 px-2.5 rounded-lg bg-[#1e2235] text-xs font-mono text-white placeholder-zinc-500 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Picker 3: Verb / Komplemen */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'predicate' ? null : 'predicate')}
                  className={`w-full h-9 px-3 rounded-xl bg-[#181b28] hover:bg-[#202436] transition-colors border-0 flex items-center justify-between text-left cursor-pointer ${
                    openPicker === 'predicate'
                      ? sentenceType === 'verbal'
                        ? 'ring-1 ring-emerald-500'
                        : 'ring-1 ring-purple-500'
                      : ''
                  }`}
                >
                  <div className="flex flex-col truncate pr-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">
                      {sentenceType === 'verbal' ? 'Verb (Kata Kerja)' : 'Komplemen Nominal'}
                    </span>
                    <span className={`text-xs font-mono font-bold truncate ${
                      sentenceType === 'verbal' ? 'text-emerald-400' : 'text-purple-400'
                    }`}>
                      {sentenceType === 'verbal' ? activeVerb : activeComplement}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">▾</span>
                </button>

                {openPicker === 'predicate' && (
                  <div className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-0 z-50 w-72 sm:w-84 bg-[#161827] border border-zinc-700/80 rounded-xl p-3 shadow-2xl space-y-2.5">
                    {sentenceType === 'verbal' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                            Kata Kerja (Verb 1)
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {sentenceData.verbData?.type === 'irregular' ? 'Irregular' : 'Regular'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                          {VERB_PRESETS.map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                setVerb(v);
                                setCustomVerbInput('');
                                setShowVerbSuggestions(false);
                                setOpenPicker(null);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 cursor-pointer ${
                                activeVerb === v && customVerbInput === ''
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-[#1e2235] text-zinc-400 hover:text-white'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="pt-1.5 border-t border-zinc-800 relative">
                          <input
                            type="text"
                            value={customVerbInput}
                            onChange={(e) => handleCustomVerbChange(e.target.value)}
                            onFocus={() => {
                              if (customVerbInput.trim().length >= 2 && verbSuggestions.length > 0) {
                                setShowVerbSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowVerbSuggestions(false), 200);
                            }}
                            placeholder="Ketik Verb 1 kustom..."
                            className={`w-full h-7 px-2.5 rounded-lg bg-[#1e2235] text-xs font-mono placeholder-zinc-500 border-0 focus:outline-none transition-all ${
                              customVerbInput.trim() !== '' && !sentenceData.isVerbValid
                                ? 'ring-1 ring-rose-500 text-rose-300'
                                : 'text-white focus:ring-1 focus:ring-emerald-500'
                            }`}
                          />
                          {showVerbSuggestions && verbSuggestions.length > 0 && (
                            <div className="absolute bottom-full mb-1 left-0 z-50 bg-[#141624] border border-zinc-700/80 rounded-lg p-1 shadow-2xl flex flex-col gap-0.5 min-w-[140px]">
                              {verbSuggestions.map((sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectVerbSuggestion(sug);
                                  }}
                                  className="px-2 py-0.5 text-left text-xs font-mono text-zinc-300 hover:text-white hover:bg-emerald-600/30 rounded cursor-pointer transition-colors border-0"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                            Komplemen Nominal
                          </span>
                          <span className="text-[10px] font-mono text-purple-400">
                            {sentenceData.nominalData?.typeLabel || 'Sifat / Benda / Tempat'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                          {NOMINAL_PRESETS.map((comp) => (
                            <button
                              key={comp}
                              type="button"
                              onClick={() => {
                                setNominalComplement(comp);
                                setCustomComplementInput('');
                                setShowNominalSuggestions(false);
                                setOpenPicker(null);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 cursor-pointer ${
                                activeComplement === comp && customComplementInput === ''
                                  ? 'bg-purple-600 text-white font-bold'
                                  : 'bg-[#1e2235] text-zinc-400 hover:text-white'
                              }`}
                            >
                              {comp}
                            </button>
                          ))}
                        </div>
                        <div className="pt-1.5 border-t border-zinc-800 relative">
                          <input
                            type="text"
                            value={customComplementInput}
                            onChange={(e) => handleCustomComplementChange(e.target.value)}
                            onFocus={() => {
                              if (customComplementInput.trim().length >= 2 && nominalSuggestions.length > 0) {
                                setShowNominalSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowNominalSuggestions(false), 200);
                            }}
                            placeholder="Ketik komplemen kustom..."
                            className={`w-full h-7 px-2.5 rounded-lg bg-[#1e2235] text-xs font-mono placeholder-zinc-500 border-0 focus:outline-none transition-all ${
                              customComplementInput.trim() !== '' && !sentenceData.isComplementValid
                                ? 'ring-1 ring-rose-500 text-rose-300'
                                : 'text-white focus:ring-1 focus:ring-purple-500'
                            }`}
                          />
                          {showNominalSuggestions && nominalSuggestions.length > 0 && (
                            <div className="absolute bottom-full mb-1 left-0 z-50 bg-[#141624] border border-zinc-700/80 rounded-lg p-1 shadow-2xl flex flex-col gap-0.5 min-w-[150px]">
                              {nominalSuggestions.map((sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectNominalSuggestion(sug);
                                  }}
                                  className="px-2 py-0.5 text-left text-xs font-mono text-zinc-300 hover:text-white hover:bg-purple-600/30 rounded cursor-pointer transition-colors border-0"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Picker 4: Objek */}
              <div className="relative">
                {sentenceType === 'nominal' ? (
                  <div className="w-full h-9 px-3 rounded-xl bg-[#181b28]/50 border-0 flex items-center justify-between text-left opacity-40 cursor-not-allowed">
                    <div className="flex flex-col truncate pr-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">Objek</span>
                      <span className="text-xs font-mono text-zinc-500 truncate">(Nominal)</span>
                    </div>
                  </div>
                ) : !isCurrentVerbTransitive ? (
                  <div
                    className="w-full h-9 px-3 rounded-xl bg-[#181b28]/50 border-0 flex items-center justify-between text-left opacity-40 cursor-not-allowed"
                    title="Kata kerja intransitif tidak membutuhkan objek"
                  >
                    <div className="flex flex-col truncate pr-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">Objek</span>
                      <span className="text-xs font-mono text-amber-500/70 truncate">(Intransitif)</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenPicker(openPicker === 'object' ? null : 'object')}
                      className={`w-full h-9 px-3 rounded-xl bg-[#181b28] hover:bg-[#202436] transition-colors border-0 flex items-center justify-between text-left cursor-pointer ${
                        openPicker === 'object' ? 'ring-1 ring-amber-500' : ''
                      }`}
                    >
                      <div className="flex flex-col truncate pr-1">
                        <span className="text-[9px] uppercase font-mono text-zinc-500 leading-tight">
                          {isPassive ? 'Subjek Pasif' : 'Objek'}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300 truncate">
                          {isPassive ? sentenceData.passiveSubject : (activeObject || '(Tanpa Objek)')}
                        </span>
                      </div>
                      <span className="text-zinc-500 text-[10px]">▾</span>
                    </button>

                    {openPicker === 'object' && (
                      <div className="absolute bottom-full mb-2 right-0 z-50 w-72 sm:w-80 bg-[#161827] border border-zinc-700/80 rounded-xl p-3 shadow-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                            Pilihan Objek {isPassive ? '(Subjek Pasif)' : ''}
                          </span>
                          {isPassive && (
                            <span className="text-[10px] font-mono text-amber-400">
                              {detectSubjectType(sentenceData.passiveSubject)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                          {OBJECT_PRESETS.map((objItem) => {
                            const isNonePreset = objItem === '(Tanpa Objek)';
                            const isSelected = isNonePreset
                              ? (!activeObject || object === 'none') && customObjectInput === ''
                              : activeObject === objItem && customObjectInput === '';
                            const isDisabled = isPassive && isNonePreset;

                            return (
                              <button
                                key={objItem}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => {
                                  setObject(isNonePreset ? 'none' : objItem);
                                  setCustomObjectInput('');
                                  setOpenPicker(null);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono border-0 ${
                                  isDisabled
                                    ? 'bg-zinc-800/40 text-zinc-600 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-amber-600 text-white font-bold cursor-pointer'
                                    : 'bg-[#1e2235] text-zinc-400 hover:text-white cursor-pointer'
                                }`}
                              >
                                {objItem}
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-1.5 border-t border-zinc-800">
                          <input
                            type="text"
                            value={customObjectInput}
                            onChange={(e) => setCustomObjectInput(e.target.value)}
                            placeholder="Ketik objek kustom..."
                            className="w-full h-7 px-2.5 rounded-lg bg-[#1e2235] text-xs font-mono text-white placeholder-zinc-500 border-0 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ROW 3: Real Switch Toggles (Terjemahan & Singkatan) */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTranslation}
                  onClick={() => setShowTranslation((prev) => !prev)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none border-0 ${
                    showTranslation ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out my-auto ml-0.5 ${
                      showTranslation ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-mono text-zinc-300 font-medium">Terjemahan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={useContraction}
                  onClick={() => setUseContraction((prev) => !prev)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none border-0 ${
                    useContraction ? 'bg-rose-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out my-auto ml-0.5 ${
                      useContraction ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-mono text-zinc-300 font-medium">Singkatan</span>
              </label>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC TENSES & FORMULA STRIP (COMPACT / 100VH COMPLIANT)               */}
          {/* ========================================================================= */}
          <motion.div
            key={`${tense}-${aspect}-${sentenceType}-${form}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="w-full bg-[#11131c] rounded-xl px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 shrink-0 text-left shadow-lg"
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Tenses Kalimat:</span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {tenseFormulaInfo.name}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs overflow-x-auto no-scrollbar">
              <span className="text-blue-400 font-bold shrink-0">
                {tenseFormulaInfo.formulaPrefix}
              </span>
              <span className="text-zinc-200 font-medium whitespace-nowrap">
                {tenseFormulaInfo.formula}
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Footer Info Strip */}
      <footer className="px-5 md:px-8 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#090a0f]/95 backdrop-blur-md border-t border-[#232736]/40 flex items-center justify-between shrink-0 z-40 text-xs text-zinc-500">
        <span>Gunakan playground ini untuk memverifikasi seluruh aturan tata bahasa A1.</span>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors border-0 bg-transparent cursor-pointer p-0"
        >
          Kembali ke Kurikulum
        </button>
      </footer>
    </div>
  );
};

export default GrammarPlayground;

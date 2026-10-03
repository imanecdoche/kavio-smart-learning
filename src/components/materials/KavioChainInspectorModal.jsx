import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { lookupVerb } from '../../data/dictionary/verbsData';

/**
 * Kavio Domino Chain Inspector Modal
 * Bedah Visual Rantai Interlocking Brackets Pola Tenses Kavio
 * Menampilkan kalimat dengan bracket atas dan bawah yang mengaitkan setiap elemen pola.
 */
export const KavioChainInspectorModal = ({
  isOpen,
  onClose,
  tense,
  aspect,
  sentenceType,
  isPassive,
  form,
  sentenceData,
  activeVerb = 'study',
}) => {
  const [selectedBlockKey, setSelectedBlockKey] = useState(null);
  const containerRef = useRef(null);
  const wordsRowRef = useRef(null);
  const wordRefs = useRef([]);
  const [wordPositions, setWordPositions] = useState([]);

  // Listen keyboard Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedBlockKey(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Ekstrak token kalimat (hanya kata, tanpa tanda baca)
  const tokens = useMemo(() => {
    return (sentenceData?.tokens || []).filter((t) => t.role !== 'punctuation');
  }, [sentenceData]);

  // Lookup data kata kerja untuk derivasi bentuk V1, V2, V3, V-ing
  const verbLookup = useMemo(() => {
    const res = lookupVerb(activeVerb);
    if (res.isValid && res.data) return res.data;
    return {
      v1: activeVerb,
      v2: `${activeVerb}ed`,
      v3: `${activeVerb}ed`,
      gerund: `${activeVerb}ing`,
      s_form: `${activeVerb}s`,
    };
  }, [activeVerb]);

  // Analisis struktur rantai balok (Chain Brackets)
  const chainAnalysis = useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return {
        words: [],
        brackets: [],
        titleBlocks: [],
      };
    }

    const words = tokens.map((t, idx) => ({
      id: t.id || `word-${idx}`,
      text: t.text,
      role: t.role,
      index: idx,
    }));

    const brackets = [];
    const titleBlocks = [];

    // 1. Cari index kata-kata pembentuk predikat
    // Predikat terdiri dari helper (modal, have, be) dan verb utama
    const predicateTokens = tokens.filter(
      (t) =>
        t.role === 'helper-modal' ||
        t.role === 'helper-have' ||
        t.role === 'helper-be' ||
        t.role === 'verb' ||
        t.role === 'helper-negative' ||
        t.role === 'helper-question' ||
        t.role === 'subject-contracted'
    );

    // Identifikasi token spesifik
    const modalToken = tokens.find((t) => t.role === 'helper-modal');
    const haveToken = tokens.find(
      (t) =>
        t.role === 'helper-have' ||
        (t.id === 'token-helper' && /have|has|had/i.test(t.text))
    );
    const beTokens = tokens.filter((t) => t.role === 'helper-be');
    const verbToken = tokens.find((t) => t.role === 'verb');

    // Menentukan token pertama yang membawa waktu (Time Carrier)
    const firstPredicateToken =
      modalToken ||
      haveToken ||
      beTokens[0] ||
      verbToken ||
      tokens.find((t) => t.role === 'timeSignal');

    // =========================================================================
    // A. TIME / TENSE BLOCK (Garis Balok Bawah pada Kata Kerja Pertama)
    // =========================================================================
    const tenseKey = 'TIME';
    const isFuture = tense === 'FUTURE' || tense === 'PAST_FUTURE';
    const isPast = tense === 'PAST' || tense === 'PAST_FUTURE';

    let timeFormula = 'VERB-1';
    let timeCategory = 'PRESENT';
    if (isFuture) {
      timeFormula = 'MODAL';
      timeCategory = tense === 'PAST_FUTURE' ? 'PAST FUTURE' : 'FUTURE';
    } else if (isPast) {
      timeFormula = 'VERB-2';
      timeCategory = 'PAST';
    }

    // Derivasi untuk Waktu
    let timeDerivation = null;
    const timeWordText = firstPredicateToken ? firstPredicateToken.text.toUpperCase() : '';
    if (isFuture) {
      const modalBase = tense === 'PAST_FUTURE' ? 'WOULD' : 'WILL';
      timeDerivation = (
        <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
          <span>MODAL BASE:</span>
          <span className="text-white font-extrabold">{modalBase}</span>
        </div>
      );
    } else {
      // Periksa apakah kata pertama adalah HAVE, BE, atau Main Verb
      const firstLower = firstPredicateToken?.text?.toLowerCase() || '';
      if (/have|has|had/.test(firstLower)) {
        timeDerivation = (
          <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
            <span className={timeCategory === 'PRESENT' ? 'text-white font-extrabold' : 'text-zinc-500'}>HAVE / HAS</span>
            <span className="text-zinc-600">→</span>
            <span className={timeCategory === 'PAST' ? 'text-white font-extrabold' : 'text-zinc-500'}>HAD</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-600">HAD</span>
          </div>
        );
      } else if (/is|am|are|was|were|been|being/.test(firstLower)) {
        timeDerivation = (
          <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
            <span className={timeCategory === 'PRESENT' ? 'text-white font-extrabold' : 'text-zinc-500'}>IS / AM / ARE</span>
            <span className="text-zinc-600">→</span>
            <span className={timeCategory === 'PAST' ? 'text-white font-extrabold' : 'text-zinc-500'}>WAS / WERE</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-600">BEEN</span>
          </div>
        );
      } else {
        const v1Upper = verbLookup.v1.toUpperCase();
        const v2Upper = verbLookup.v2.toUpperCase();
        const v3Upper = verbLookup.v3.toUpperCase();
        timeDerivation = (
          <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
            <span className={timeCategory === 'PRESENT' ? 'text-white font-extrabold' : 'text-zinc-500'}>{v1Upper}</span>
            <span className="text-zinc-600">→</span>
            <span className={timeCategory === 'PAST' ? 'text-white font-extrabold' : 'text-zinc-500'}>{v2Upper}</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-600">{v3Upper}</span>
          </div>
        );
      }
    }

    if (firstPredicateToken) {
      const wordIdx = words.findIndex((w) => w.id === firstPredicateToken.id);
      if (wordIdx !== -1) {
        brackets.push({
          key: tenseKey,
          titleBlockKey: timeCategory,
          position: 'bottom',
          startIndex: wordIdx,
          endIndex: wordIdx,
          formula: timeFormula,
          category: timeCategory,
          highlightWordIds: [firstPredicateToken.id],
          derivation: timeDerivation,
        });
      }
    }

    titleBlocks.push({
      key: timeCategory,
      bracketKey: tenseKey,
      label: timeCategory,
    });

    // =========================================================================
    // B. FUTURE MODAL BRACKET (Garis Balok Atas jika Future / Past Future)
    // =========================================================================
    if (isFuture && modalToken) {
      // Cari kata berikutnya setelah modal
      const modalIdx = words.findIndex((w) => w.id === modalToken.id);
      const nextWordIdx = modalIdx + 1 < words.length ? modalIdx + 1 : modalIdx;
      const nextWord = words[nextWordIdx];

      if (nextWord && modalIdx !== nextWordIdx) {
        brackets.push({
          key: 'FUTURE_MODAL',
          titleBlockKey: timeCategory,
          position: 'top',
          startIndex: modalIdx,
          endIndex: nextWordIdx,
          formula: 'MODAL + BV',
          category: timeCategory,
          highlightWordIds: [modalToken.id, nextWord.id],
          derivation: (
            <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
              <span>MODAL +</span>
              <span className="text-cyan-400 font-bold">BV</span>
              <span className="text-zinc-600">→</span>
              <span>{modalToken.text.toUpperCase()} +</span>
              <span className="text-cyan-400 font-extrabold">{nextWord.text.toUpperCase()}</span>
            </div>
          ),
        });
      }
    }

    // =========================================================================
    // C. PERFECT BLOCK (Garis Balok Atas: HAVE + V3)
    // =========================================================================
    if (aspect === 'PERFECT' || aspect === 'PER.CONT') {
      const perfectKey = 'PERFECT';
      titleBlocks.push({
        key: perfectKey,
        bracketKey: perfectKey,
        label: 'PERFECT',
      });

      if (haveToken) {
        const haveIdx = words.findIndex((w) => w.id === haveToken.id);
        const nextWordIdx = haveIdx + 1 < words.length ? haveIdx + 1 : haveIdx;
        const nextWord = words[nextWordIdx];

        if (nextWord && haveIdx !== nextWordIdx) {
          // Derivasi Perfect
          const nextUpper = nextWord.text.toUpperCase();
          const isNextBe = /been/i.test(nextWord.text);
          const perfectDerivation = (
            <div className="flex flex-col items-center justify-center gap-1 font-mono text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-2 text-zinc-300">
                <span>HAVE +</span>
                <span className="text-cyan-400 font-bold">V3</span>
                <span className="text-zinc-600">→</span>
                <span>HAVE +</span>
                <span className="text-cyan-400 font-bold">{isNextBe ? 'BE' : verbLookup.v1.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px] sm:text-xs md:text-sm">
                <span>{isNextBe ? 'BE = IS/AM/ARE' : verbLookup.v1.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span>{isNextBe ? 'WAS/WERE' : verbLookup.v2.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-white font-extrabold">{nextUpper}</span>
              </div>
            </div>
          );

          brackets.push({
            key: perfectKey,
            titleBlockKey: perfectKey,
            position: 'top',
            startIndex: haveIdx,
            endIndex: nextWordIdx,
            formula: 'HAVE + V3',
            category: 'PERFECT',
            highlightWordIds: [haveToken.id, nextWord.id],
            derivation: perfectDerivation,
          });
        }
      }
    }

    // =========================================================================
    // D. CONTINUOUS BLOCK (Garis Balok Bawah: BE + V-ING)
    // =========================================================================
    if (aspect === 'CONTINUOUS' || aspect === 'PER.CONT') {
      const contKey = 'CONTINUOUS';
      titleBlocks.push({
        key: contKey,
        bracketKey: contKey,
        label: 'CONTINUOUS',
      });

      // Cari kata BE dan kata kerja -ING setelahnya
      const continuousBeToken =
        beTokens.find((t) => !/being/i.test(t.text)) ||
        tokens.find((t) => t.role === 'helper-be' || /is|am|are|was|were|be|been/i.test(t.text));

      if (continuousBeToken) {
        const beIdx = words.findIndex((w) => w.id === continuousBeToken.id);
        const nextWordIdx = beIdx + 1 < words.length ? beIdx + 1 : beIdx;
        const nextWord = words[nextWordIdx];

        if (nextWord && beIdx !== nextWordIdx) {
          const nextUpper = nextWord.text.toUpperCase();
          const isNextBeing = /being/i.test(nextWord.text);
          const contDerivation = (
            <div className="flex flex-col items-center justify-center gap-1 font-mono text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-2 text-zinc-300">
                <span>BE +</span>
                <span className="text-cyan-400 font-bold">V-ING</span>
                <span className="text-zinc-600">→</span>
                <span>BE +</span>
                <span className="text-cyan-400 font-bold">{isNextBeing ? 'BE' : verbLookup.v1.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px] sm:text-xs md:text-sm">
                <span>{isNextBeing ? 'BE' : verbLookup.v1.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span>{isNextBeing ? 'BEING' : verbLookup.gerund.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-white font-extrabold">{nextUpper}</span>
              </div>
            </div>
          );

          brackets.push({
            key: contKey,
            titleBlockKey: contKey,
            position: 'bottom',
            startIndex: beIdx,
            endIndex: nextWordIdx,
            formula: 'BE + V-ING',
            category: 'CONTINUOUS',
            highlightWordIds: [continuousBeToken.id, nextWord.id],
            derivation: contDerivation,
          });
        }
      }
    }

    // =========================================================================
    // E. PASSIVE BLOCK (Garis Balok Atas: BE + V3)
    // =========================================================================
    if (isPassive) {
      const passiveKey = 'PASSIVE';
      titleBlocks.push({
        key: passiveKey,
        bracketKey: passiveKey,
        label: 'PASSIVE',
      });

      // Cari token BE yang langsung mendahului V3
      const lastBeToken =
        beTokens.length > 0 ? beTokens[beTokens.length - 1] : null;

      if (lastBeToken && verbToken) {
        const beIdx = words.findIndex((w) => w.id === lastBeToken.id);
        const verbIdx = words.findIndex((w) => w.id === verbToken.id);

        if (beIdx !== -1 && verbIdx !== -1 && beIdx < verbIdx) {
          const v3Upper = verbToken.text.toUpperCase();
          const passiveDerivation = (
            <div className="flex flex-col items-center justify-center gap-1 font-mono text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-2 text-zinc-300">
                <span>BE +</span>
                <span className="text-cyan-400 font-bold">V3</span>
                <span className="text-zinc-600">→</span>
                <span>BE +</span>
                <span className="text-cyan-400 font-bold">{verbLookup.v1.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px] sm:text-xs md:text-sm">
                <span>{verbLookup.v1.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span>{verbLookup.v2.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-white font-extrabold">{v3Upper}</span>
              </div>
            </div>
          );

          brackets.push({
            key: passiveKey,
            titleBlockKey: passiveKey,
            position: 'top',
            startIndex: beIdx,
            endIndex: verbIdx,
            formula: 'BE + V3',
            category: 'PASSIVE',
            highlightWordIds: [lastBeToken.id, verbToken.id],
            derivation: passiveDerivation,
          });
        }
      }
    }

    // =========================================================================
    // F. SIMPLE BLOCK (Jika aspek Simple & bukan pasif)
    // =========================================================================
    if (aspect === 'SIMPLE' && !isPassive) {
      const simpleKey = 'SIMPLE';
      titleBlocks.push({
        key: simpleKey,
        bracketKey: simpleKey,
        label: 'SIMPLE',
      });

      if (verbToken) {
        const vIdx = words.findIndex((w) => w.id === verbToken.id);
        if (vIdx !== -1) {
          const vText = verbToken.text.toUpperCase();
          brackets.push({
            key: simpleKey,
            titleBlockKey: simpleKey,
            position: 'top',
            startIndex: vIdx,
            endIndex: vIdx,
            formula: isPast ? 'V2' : 'V1 / V-S',
            category: 'SIMPLE',
            highlightWordIds: [verbToken.id],
            derivation: (
              <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs sm:text-sm md:text-base">
                <span>BASE FORM:</span>
                <span className="text-zinc-300">{verbLookup.v1.toUpperCase()}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-white font-extrabold">{vText}</span>
              </div>
            ),
          });
        }
      }
    }

    return {
      words,
      brackets,
      titleBlocks,
    };
  }, [tokens, tense, aspect, isPassive, verbLookup]);

  // Mengukur posisi setiap kata (bounding box offset) untuk koordinat presisi garis bracket SVG
  useLayoutEffect(() => {
    if (!isOpen || !wordsRowRef.current) return;

    const measurePositions = () => {
      if (!wordsRowRef.current) return;
      const rowRect = wordsRowRef.current.getBoundingClientRect();
      const positions = wordRefs.current.map((el) => {
        if (!el) return { left: 0, right: 0, width: 0, centerX: 0 };
        const rect = el.getBoundingClientRect();
        const left = rect.left - rowRect.left;
        const right = rect.right - rowRect.left;
        return {
          left,
          right,
          width: rect.width,
          centerX: (left + right) / 2,
        };
      });
      setWordPositions(positions);
    };

    measurePositions();

    const resizeObserver = new ResizeObserver(() => {
      measurePositions();
    });

    if (wordsRowRef.current) {
      resizeObserver.observe(wordsRowRef.current);
    }
    window.addEventListener('resize', measurePositions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measurePositions);
    };
  }, [isOpen, chainAnalysis.words]);

  if (!isOpen) return null;

  // Tentukan bracket & block yang aktif saat ini
  const activeBracket = selectedBlockKey
    ? chainAnalysis.brackets.find(
        (b) => b.key === selectedBlockKey || b.titleBlockKey === selectedBlockKey
      )
    : null;

  const isWordHighlighted = (word) => {
    if (!selectedBlockKey || !activeBracket) return true;
    return activeBracket.highlightWordIds.includes(word.id);
  };

  const isBracketHighlighted = (bracket) => {
    if (!selectedBlockKey) return true;
    return (
      bracket.key === selectedBlockKey ||
      bracket.titleBlockKey === selectedBlockKey
    );
  };

  const isTitleBlockHighlighted = (tb) => {
    if (!selectedBlockKey) return true;
    return tb.key === selectedBlockKey || tb.bracketKey === selectedBlockKey;
  };

  const handleToggleBlock = (blockKey) => {
    setSelectedBlockKey((prev) => (prev === blockKey ? null : blockKey));
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Bedah Pola Rantai Tenses"
        data-lenis-prevent="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[85] bg-[#090a0f] text-zinc-100 flex flex-col justify-between overflow-y-auto overscroll-contain select-none"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {/* Top Header Bar */}
        <header className="px-4 sm:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between shrink-0 z-20 bg-[#090a0f]/95 backdrop-blur-md border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela diagram"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-1 -m-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white hidden sm:inline">
              Bedah Pola Rantai Tenses (Domino Chain)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Main Canvas Area: Domino Chain Brackets Diagram */}
        <div
          ref={containerRef}
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[380px]"
        >
          {/* Visual Brackets & Words Stage */}
          <div className="w-full relative flex flex-col items-center justify-center overflow-x-auto py-12 sm:py-16">
            {/* Top Brackets Layer */}
            <div className="w-full flex items-center justify-center relative min-h-[56px] sm:min-h-[64px] mb-2">
              {wordPositions.length > 0 &&
                chainAnalysis.brackets
                  .filter((b) => b.position === 'top')
                  .map((bracket) => {
                    const startPos = wordPositions[bracket.startIndex];
                    const endPos = wordPositions[bracket.endIndex];
                    if (!startPos || !endPos) return null;

                    const left = startPos.left + 4;
                    const width = Math.max(16, endPos.right - startPos.left - 8);
                    const highlighted = isBracketHighlighted(bracket);

                    return (
                      <div
                        key={`top-bracket-${bracket.key}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleBlock(bracket.key)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggleBlock(bracket.key);
                          }
                        }}
                        className="absolute bottom-0 flex flex-col items-center justify-end cursor-pointer group transition-opacity duration-200"
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          opacity: highlighted ? 1 : 0.25,
                        }}
                      >
                        {/* Labels above bracket line */}
                        <div className="flex flex-col items-center justify-center text-center pb-1.5">
                          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase leading-none">
                            {bracket.formula}
                          </span>
                          <span className="text-xs sm:text-sm font-sans font-extrabold tracking-wider text-white uppercase mt-0.5 leading-tight">
                            {bracket.category}
                          </span>
                        </div>

                        {/* Top Bracket Line with down-tick ends ┌──────┐ */}
                        <div className="w-full h-3 border-t-2 border-l-2 border-r-2 border-white transition-colors duration-200" />
                      </div>
                    );
                  })}
            </div>

            {/* Middle Row: Sentence Words */}
            <div
              ref={wordsRowRef}
              className="inline-flex items-baseline justify-center relative z-20 whitespace-nowrap px-4 py-2"
            >
              {chainAnalysis.words.map((word, idx) => {
                const highlighted = isWordHighlighted(word);
                return (
                  <span
                    key={word.id}
                    ref={(el) => (wordRefs.current[idx] = el)}
                    className={`inline-block px-1.5 sm:px-2.5 md:px-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight sm:tracking-normal transition-colors duration-200 ${
                      highlighted ? 'text-white' : 'text-zinc-600'
                    }`}
                    style={{ lineHeight: 1.15 }}
                  >
                    {word.text.toUpperCase()}
                  </span>
                );
              })}
            </div>

            {/* Bottom Brackets Layer */}
            <div className="w-full flex items-center justify-center relative min-h-[56px] sm:min-h-[64px] mt-2">
              {wordPositions.length > 0 &&
                chainAnalysis.brackets
                  .filter((b) => b.position === 'bottom')
                  .map((bracket) => {
                    const startPos = wordPositions[bracket.startIndex];
                    const endPos = wordPositions[bracket.endIndex];
                    if (!startPos || !endPos) return null;

                    const left = startPos.left + 4;
                    const width = Math.max(16, endPos.right - startPos.left - 8);
                    const highlighted = isBracketHighlighted(bracket);

                    return (
                      <div
                        key={`bottom-bracket-${bracket.key}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleBlock(bracket.key)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggleBlock(bracket.key);
                          }
                        }}
                        className="absolute top-0 flex flex-col items-center justify-start cursor-pointer group transition-opacity duration-200"
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          opacity: highlighted ? 1 : 0.25,
                        }}
                      >
                        {/* Bottom Bracket Line with up-tick ends └──────┘ */}
                        <div className="w-full h-3 border-b-2 border-l-2 border-r-2 border-white transition-colors duration-200" />

                        {/* Labels below bracket line */}
                        <div className="flex flex-col items-center justify-center text-center pt-1.5">
                          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase leading-none">
                            {bracket.formula}
                          </span>
                          <span className="text-xs sm:text-sm font-sans font-extrabold tracking-wider text-white uppercase mt-0.5 leading-tight">
                            {bracket.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Bottom Title Bar: Clickable Tense Pattern Blocks */}
          <div className="w-full flex flex-col items-center justify-center text-center mt-6 sm:mt-10">
            <div className="inline-flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-3.5 gap-y-2 text-xl sm:text-2xl md:text-3xl font-sans font-extrabold tracking-wider uppercase">
              {chainAnalysis.titleBlocks.map((tb) => {
                const highlighted = isTitleBlockHighlighted(tb);
                return (
                  <button
                    key={`title-block-${tb.key}`}
                    type="button"
                    onClick={() => handleToggleBlock(tb.key)}
                    className={`transition-all duration-200 border-0 bg-transparent p-0 cursor-pointer ${
                      highlighted
                        ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-105'
                        : 'text-zinc-600 hover:text-zinc-400 scale-100'
                    }`}
                  >
                    {tb.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Transformation & Derivation Breakdown */}
            <div className="min-h-[48px] sm:min-h-[56px] flex items-center justify-center mt-4 sm:mt-6 px-4">
              <AnimatePresence mode="wait">
                {activeBracket && activeBracket.derivation ? (
                  <motion.div
                    key={`derivation-${activeBracket.key}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-center"
                  >
                    {activeBracket.derivation}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <footer className="px-4 py-3 shrink-0 text-center border-t border-zinc-800/60 bg-[#090a0f]/90">
          <p className="text-[11px] sm:text-xs font-mono text-zinc-500">
            Klik balok tenses di bawah atau garis pola di atas untuk menyorot rantai kata kerja
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

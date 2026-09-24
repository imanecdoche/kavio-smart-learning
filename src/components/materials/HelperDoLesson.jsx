import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';

// Critically damped spring transition for zero-snap word-level layout animation
const wordSpringTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

// Reusable row for Slide 7 example list with 4-stage reveal:
// Stage 0 = ID (+)
// Stage 1 = EN (+)
// Stage 2 = EN (-)
// Stage 3 = EN (?)
const ExampleSentenceRow = ({ item, rowIndex = 0, state, onClick }) => {
  const isEnglish = state >= 1;
  const rowId = `row-${rowIndex}`;

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-3 cursor-pointer hover:border-zinc-700/60 transition-colors select-none"
    >
      {/* Left side text container */}
      <div className="relative flex items-baseline gap-2 overflow-visible">
        <AnimatePresence mode="wait">
          {!isEnglish ? (
            <motion.span
              key={`${rowId}-id-text`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-400 font-medium text-base sm:text-lg"
            >
              {item.idPositive}
            </motion.span>
          ) : (
            <LayoutGroup id={`group-${rowId}`}>
              <motion.div
                key={`${rowId}-en-sentence-persistent`}
                layout
                transition={wordSpringTransition}
                className="relative flex items-baseline gap-2 overflow-visible"
              >
                {/* Token 1: Question Helper (Do / Does) - enters at front in state 3 */}
                <AnimatePresence mode="popLayout">
                  {state === 3 && (
                    <motion.span
                      key={`${rowId}-token-helper-q`}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={wordSpringTransition}
                      className="text-amber-400 font-bold inline-block"
                    >
                      {item.helperCap}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Token 2: Subject (I, He/he, They, etc.) - persistent with layout animation */}
                <motion.span
                  key={`${rowId}-token-subject`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-white font-bold inline-block"
                >
                  {state === 3 ? (item.subjectLower || item.subject) : item.subject}
                </motion.span>

                {/* Token 3: Negative Helper (do not / does not) - inserts between subject & verb in state 2 */}
                <AnimatePresence mode="popLayout">
                  {state === 2 && (
                    <motion.span
                      key={`${rowId}-token-helper-neg`}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={wordSpringTransition}
                      className="text-red-400 font-bold inline-block whitespace-nowrap"
                    >
                      {item.helper} not
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Token 4: Verb (work, live, read, etc.) - persistent with layout animation */}
                <motion.span
                  key={`${rowId}-token-verb`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-blue-400 font-bold inline-flex items-baseline"
                >
                  {item.verbBase}
                  {/* Suffix -s / -es in state 1 (positive) */}
                  <AnimatePresence mode="popLayout">
                    {state === 1 && item.verbPos !== item.verbBase && (
                      <motion.span
                        key={`${rowId}-token-verb-suffix`}
                        layout="position"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="text-amber-400 font-extrabold inline-block"
                      >
                        {item.verbPos.slice(item.verbBase.length)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>

                {/* Token 5: Complement (at the office, in Jakarta, etc.) - persistent with layout animation */}
                {item.complement && (
                  <motion.span
                    key={`${rowId}-token-complement`}
                    layout="position"
                    transition={wordSpringTransition}
                    className="text-zinc-300 font-medium inline-block"
                  >
                    {item.complement}
                  </motion.span>
                )}

                {/* Token 6: Question Mark (?) - pops in at end in state 3 */}
                <AnimatePresence mode="popLayout">
                  {state === 3 && (
                    <motion.span
                      key={`${rowId}-token-q-mark`}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2 }}
                      transition={wordSpringTransition}
                      className="text-amber-400 font-bold inline-block ml-0.5"
                    >
                      ?
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>
      </div>

      {/* Right side state indicator */}
      <motion.div layout className="flex items-center ml-4 shrink-0">
        <AnimatePresence mode="wait">
          {state === 0 && (
            <motion.div
              key={`${rowId}-status-id`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-[#1c2030] flex items-center justify-center text-zinc-500 font-black text-xs sm:text-sm select-none"
            >
              •
            </motion.div>
          )}

          {state === 1 && (
            <motion.div
              key={`${rowId}-status-plus`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-blue-600 flex items-center justify-center text-white font-black text-sm sm:text-base select-none shadow-md shadow-blue-900/30"
              aria-label="Positif"
            >
              +
            </motion.div>
          )}

          {state === 2 && (
            <motion.div
              key={`${rowId}-status-minus`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-sm sm:text-base select-none shadow-md shadow-red-900/30"
              aria-label="Negatif"
            >
              −
            </motion.div>
          )}

          {state === 3 && (
            <motion.div
              key={`${rowId}-status-question`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm sm:text-base select-none shadow-md shadow-amber-900/30"
              aria-label="Tanya"
            >
              ?
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export const HelperDoLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [slide4Step, setSlide4Step] = useState(0); // 0 to 6 steps for interactive experiment 1 (sleep)
  const [slide5Step, setSlide5Step] = useState(0); // 0 to 6 steps for interactive experiment 2 (eats)
  const [slide7StepCount, setSlide7StepCount] = useState(0); // 0 to 18 steps for 6 examples x 3 reveals

  const totalSlides = 7;

  // Slide 7 Examples: DO & DOES practice across diverse subjects
  const doExamples = [
    {
      idPositive: 'Saya bekerja di kantor',
      subject: 'I',
      subjectLower: 'I',
      verbPos: 'work',
      verbBase: 'work',
      helper: 'do',
      helperCap: 'Do',
      complement: 'at the office',
    },
    {
      idPositive: 'Dia (laki-laki) tinggal di Jakarta',
      subject: 'He',
      subjectLower: 'he',
      verbPos: 'lives',
      verbBase: 'live',
      helper: 'does',
      helperCap: 'Does',
      complement: 'in Jakarta',
    },
    {
      idPositive: 'Mereka suka kopi',
      subject: 'They',
      subjectLower: 'they',
      verbPos: 'like',
      verbBase: 'like',
      helper: 'do',
      helperCap: 'Do',
      complement: 'coffee',
    },
    {
      idPositive: 'Citra membaca buku setiap malam',
      subject: 'Citra',
      subjectLower: 'Citra',
      verbPos: 'reads',
      verbBase: 'read',
      helper: 'does',
      helperCap: 'Does',
      complement: 'a book every night',
    },
    {
      idPositive: 'Kamu berbicara bahasa Inggris',
      subject: 'You',
      subjectLower: 'you',
      verbPos: 'speak',
      verbBase: 'speak',
      helper: 'do',
      helperCap: 'Do',
      complement: 'English',
    },
    {
      idPositive: 'Rian dan Doni bermain sepak bola',
      subject: 'Rian and Doni',
      subjectLower: 'Rian and Doni',
      verbPos: 'play',
      verbBase: 'play',
      helper: 'do',
      helperCap: 'Do',
      complement: 'football',
    },
  ];

  // Total steps for Slide 7 = 6 items * 3 transitions = 18 steps
  const totalSlide7Steps = doExamples.length * 3;

  // Next slide / step handler
  const handleNext = useCallback(() => {
    // Slide 4 interactive stepping (0 to 6)
    if (currentSlide === 3) {
      if (slide4Step < 6) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
    }

    // Slide 5 interactive stepping (0 to 6)
    if (currentSlide === 4) {
      if (slide5Step < 6) {
        setSlide5Step((prev) => prev + 1);
        return;
      }
    }

    // Slide 7 interactive stepping (0 to 18)
    if (currentSlide === 6) {
      if (slide7StepCount < totalSlide7Steps) {
        setSlide7StepCount((prev) => prev + 1);
        return;
      } else {
        // Finished all examples -> return to curriculum
        if (onBack) onBack();
        return;
      }
    }

    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, slide4Step, slide5Step, slide7StepCount, totalSlide7Steps, totalSlides, onBack]);

  // Prev slide / step handler
  const handlePrev = useCallback(() => {
    if (currentSlide === 3 && slide4Step > 0) {
      setSlide4Step((prev) => prev - 1);
      return;
    }
    if (currentSlide === 4 && slide5Step > 0) {
      setSlide5Step((prev) => prev - 1);
      return;
    }
    if (currentSlide === 6 && slide7StepCount > 0) {
      setSlide7StepCount((prev) => prev - 1);
      return;
    }
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, slide4Step, slide5Step, slide7StepCount]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Slide transition animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#090a0f] text-zinc-100 select-none font-sans">
      {/* 1. Top Sticky Header */}
      <header className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-b border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Keluar"
            title="Keluar ke Kurikulum"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border-0 flex items-center justify-center group"
          >
            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
          </button>

          {/* Clean Slide Counter (Text only, no badge/pill per absolute rules) */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>Slide {currentSlide + 1} dari {totalSlides}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Interactive Slide Canvas - Flexible & Internal Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
          {/* SLIDE 1: PETA KELUARGA HELPER (THE HELPER FAMILY) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-4xl flex flex-col items-center text-center overflow-visible"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                Keluarga Helper
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-8">
                Dalam bahasa Inggris, kata kerja bantu (Helper) terbagi ke dalam 4 rumpun utama.
              </p>

              {/* 4 Helper Families Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left mb-8">
                {/* Family 1: BE (Green bg, no border, checkmark icon at top-right) */}
                <div className="p-5 rounded-xl bg-emerald-600 border-0 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-emerald-950/30">
                  {/* Checkmark icon in top-right corner */}
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-100 mb-1">Sudah Kita Pelajari</div>
                    <div className="text-2xl font-black text-white tracking-tight mb-2">BE</div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-mono">
                      am, is, are, was, were, been
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-emerald-100/80">
                    Untuk kalimat nominal &amp; continuous.
                  </div>
                </div>

                {/* Family 2: DO (Target Focus - Thicker border for active focus) */}
                <div className="p-5 rounded-xl bg-[#161a29] border-2 border-cyan-400 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-cyan-500/20">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                  <div>
                    <div className="text-xs font-bold text-cyan-300 mb-1">Fokus Kita Sekarang!</div>
                    <div className="text-2xl font-black text-cyan-300 tracking-tight mb-2">DO</div>
                    <p className="text-xs text-cyan-100 leading-relaxed font-mono">
                      do, does, did
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-zinc-300">
                    Membantu kalimat tanya &amp; negatif Present Tense.
                  </div>
                </div>

                {/* Family 3: HAVE (Disabled / Transparent appearance) */}
                <div className="p-5 rounded-xl bg-[#12141c]/50 border border-zinc-800/40 opacity-40 flex flex-col justify-between select-none">
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 mb-1">Keluarga ke-3</div>
                    <div className="text-2xl font-black text-zinc-400 tracking-tight mb-2">HAVE</div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                      have, has, had
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-zinc-600">
                    Untuk kalimat perfect tense.
                  </div>
                </div>

                {/* Family 4: MODALS (Disabled / Transparent appearance) */}
                <div className="p-5 rounded-xl bg-[#12141c]/50 border border-zinc-800/40 opacity-40 flex flex-col justify-between select-none">
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 mb-1">Keluarga ke-4</div>
                    <div className="text-2xl font-black text-zinc-400 tracking-tight mb-2">MODALS</div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                      will, can, should, must...
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-zinc-600">
                    Untuk kepastian, kemampuan &amp; izin.
                  </div>
                </div>
              </div>

              {/* Informative footer note */}
              <div className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Helper bertugas membantu kalimat saat ingin membuat <strong className="text-white">Pertanyaan (?)</strong> atau <strong className="text-white">Penyangkalan (-)</strong>.
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: FLASHBACK PRESENT TENSE & KENAPA BUTUH DO */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center text-center overflow-visible"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                Mengapa Kita Butuh Helper DO?
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                Mari ingat kembali materi <strong className="text-blue-400">Simple Present Tense</strong> sebelumnya.
              </p>

              {/* Comparison & Logic Box */}
              <div className="w-full flex flex-col gap-4 text-left mb-6">
                {/* Positive State Review */}
                <div className="p-5 rounded-xl bg-[#12141c] flex items-center justify-between border-l-4 border-blue-500">
                  <div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">
                      Kalimat Positif (Tanpa Helper)
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      I sleep <span className="text-zinc-500 font-normal">/</span> He eats
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 max-w-xs text-right">
                    Kata kerja langsung menempel pada subjek tanpa BE.
                  </div>
                </div>

                {/* The Problem: Negatif & Tanya */}
                <div className="p-5 rounded-xl bg-[#161420] flex items-center justify-between border-l-4 border-amber-500">
                  <div>
                    <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1">
                      Masalah Saat Ingin Membentuk (-) atau (?)
                    </div>
                    <div className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md">
                      Kata <span className="text-red-400 font-bold">NOT</span> tidak bisa berdiri sendiri, dan kalimat tanya butuh helper untuk bertukar posisi ke depan!
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-mono text-sm block">I not sleep ❌</span>
                    <span className="text-red-400 font-mono text-sm block">Sleep I? ❌</span>
                  </div>
                </div>

                {/* The Solution: Helper DO */}
                <div className="p-5 rounded-xl bg-[#101b2b] flex items-center justify-between border-l-4 border-cyan-400">
                  <div>
                    <div className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-1">
                      Solusi: Panggil Helper DO!
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white">
                      I <span className="text-cyan-400">do</span> not sleep <span className="text-zinc-500 font-normal">|</span> <span className="text-cyan-400">Do</span> I sleep?
                    </div>
                  </div>
                  <div className="text-xs text-cyan-200/80 max-w-xs text-right">
                    Helper DO datang membantu mengisi kekosongan posisi helper!
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Karena kalimat positif Present Tense tidak memiliki Helper BE, maka ketika ingin membuat kalimat negatif dan tanya, kita <strong className="text-white">WAJIB memanggil Helper DO</strong>.
              </p>
            </motion.div>
          )}

          {/* SLIDE 3: PASANGAN SUBJEK (DO VS DOES) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center text-center overflow-visible"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                Kapan Pake DO? Kapan Pake DOES?
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                Persis seperti aturan kata kerja di Present Tense: subjek menentukan helper yang dipanggil.
              </p>

              {/* Two Column Subject Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left mb-8">
                {/* DO Card */}
                <div className="p-6 rounded-xl bg-[#12141c] border-t-4 border-blue-500 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl font-black text-blue-400 mb-2">DO</div>
                    <div className="text-sm font-semibold text-white mb-3">
                      Subjek Jamak &amp; Orang Pertama/Kedua
                    </div>
                    <div className="flex flex-wrap gap-2 text-base font-bold font-mono text-zinc-200 mb-4">
                      <span className="px-2 py-1 bg-[#1a1e2d] rounded">I</span>
                      <span className="px-2 py-1 bg-[#1a1e2d] rounded">You</span>
                      <span className="px-2 py-1 bg-[#1a1e2d] rounded">They</span>
                      <span className="px-2 py-1 bg-[#1a1e2d] rounded">We</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Serta semua benda atau orang yang berjumlah lebih dari satu (<strong className="text-zinc-200">jamak / plural</strong>), misalnya: <em>The students, My friends</em>.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-blue-400/80">
                    Contoh: <em>I do not work • Do you know?</em>
                  </div>
                </div>

                {/* DOES Card */}
                <div className="p-6 rounded-xl bg-[#12141c] border-t-4 border-amber-500 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl font-black text-amber-400 mb-2">DOES</div>
                    <div className="text-sm font-semibold text-white mb-3">
                      Subjek Orang Ketiga Tunggal
                    </div>
                    <div className="flex flex-wrap gap-2 text-base font-bold font-mono text-zinc-200 mb-4">
                      <span className="px-2 py-1 bg-[#261f18] rounded text-amber-200">He</span>
                      <span className="px-2 py-1 bg-[#261f18] rounded text-amber-200">She</span>
                      <span className="px-2 py-1 bg-[#261f18] rounded text-amber-200">It</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Serta nama satu orang atau benda tunggal (<strong className="text-zinc-200">tunggal / singular</strong>), misalnya: <em>Budi, Citra, My cat</em>.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-amber-400/80">
                    Contoh: <em>He does not know • Does she sleep?</em>
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Ingat polanya: subjek yang di kalimat positif kata kerjanya ditambah <strong className="text-amber-400">-s / -es</strong> adalah subjek yang menggunakan <strong className="text-amber-400">DOES</strong>!
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: EKSPERIMEN INTERAKTIF 1 (HELPER DO - I SLEEP) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center text-center overflow-visible"
            >
              {/* Context Indicator */}
              <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
                Eksperimen Interaktif 1: Helper DO
              </div>

              {/* Indonesian Context Heading with locked height */}
              <div className="h-10 flex items-center justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={
                      slide4Step < 2
                        ? 'id-pos'
                        : slide4Step < 4
                        ? 'id-neg'
                        : 'id-q'
                    }
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                    className="text-lg sm:text-xl text-zinc-400 font-medium"
                  >
                    {slide4Step < 2 && 'Saya tidur'}
                    {slide4Step >= 2 && slide4Step < 4 && (
                      <>
                        Saya <span className="text-red-400 font-bold">TIDAK</span> tidur
                      </>
                    )}
                    {slide4Step >= 4 && (
                      <>
                        Apakah saya tidur? <span className="text-amber-400 font-bold">(Tanya)</span>
                      </>
                    )}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Main Interactive Sentence Box with locked height */}
              <div className="h-28 sm:h-32 flex items-center justify-center mb-6 w-full">
                <div className="relative flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight overflow-visible">
                  {/* Step 0: Initial state prompt */}
                  {slide4Step === 0 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-zinc-600 font-normal text-2xl sm:text-3xl italic"
                    >
                      Tekan Next untuk melihat bahasa Inggrisnya...
                    </motion.span>
                  )}

                  {/* Step 1 to 6: Active English Sentence */}
                  {slide4Step >= 1 && (
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      className="relative flex items-center gap-2 sm:gap-3 flex-wrap justify-center overflow-visible"
                    >
                      {/* State Symbol Indicator (+ / - / ?) */}
                      <AnimatePresence mode="wait">
                        {slide4Step < 2 && (
                          <motion.div
                            key="sym-plus"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-blue-600 flex items-center justify-center text-white font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-blue-900/40"
                          >
                            +
                          </motion.div>
                        )}
                        {slide4Step >= 2 && slide4Step < 4 && (
                          <motion.div
                            key="sym-minus"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-red-900/40"
                          >
                            −
                          </motion.div>
                        )}
                        {slide4Step >= 4 && (
                          <motion.div
                            key="sym-q"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-amber-900/40"
                          >
                            ?
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Helper DO (appears in question) */}
                      {slide4Step >= 4 && (
                        <motion.span
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={wordSpringTransition}
                          className="text-amber-400 font-black inline-block"
                        >
                          Do
                        </motion.span>
                      )}

                      {/* Subject I */}
                      <motion.span
                        layout="position"
                        transition={wordSpringTransition}
                        className="text-white inline-block"
                      >
                        I
                      </motion.span>

                      {/* Helper DO in negative (after subject) - appears at step 3 */}
                      <AnimatePresence mode="popLayout">
                        {slide4Step === 3 && (
                          <motion.span
                            key="slide4-do"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-cyan-400 font-black inline-block"
                          >
                            do
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* NOT in negative - appears at step 2 and stays at step 3 */}
                      <AnimatePresence mode="popLayout">
                        {slide4Step >= 2 && slide4Step < 4 && (
                          <motion.span
                            key="slide4-not"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-red-400 font-black inline-block"
                          >
                            not
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Verb: sleep */}
                      <motion.span
                        layout="position"
                        transition={wordSpringTransition}
                        className="text-blue-400 inline-block"
                      >
                        sleep
                      </motion.span>

                      {/* Question Mark (?) */}
                      <AnimatePresence mode="popLayout">
                        {slide4Step >= 5 && (
                          <motion.span
                            key="slide4-q"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.2 }}
                            transition={wordSpringTransition}
                            className="text-amber-400 inline-block ml-0.5"
                          >
                            ?
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Explanatory text with locked minimum height to prevent layout shift */}
              <div className="min-h-[96px] h-24 sm:h-26 flex items-start justify-center max-w-xl text-center">
                <AnimatePresence mode="wait">
                  {slide4Step === 1 && (
                    <motion.p
                      key="exp-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Bentuk positif: <strong className="text-white">I sleep (+)</strong>. Kalimat ini belum memiliki helper apa pun karena kata kerja langsung menempel pada subjek.
                    </motion.p>
                  )}
                  {slide4Step === 2 && (
                    <motion.p
                      key="exp-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Untuk menyatakan <strong className="text-white">tidak</strong>, kata <strong className="text-red-400">not</strong> masuk duluan: <em>I not sleep</em>. Tapi eits! Ingat aturan mutlak: kata <strong className="text-white">NOT tidak bisa berdiri sendiri</strong>, ia WAJIB didampingi helper!
                    </motion.p>
                  )}
                  {slide4Step === 3 && (
                    <motion.p
                      key="exp-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Maka Helper <strong className="text-cyan-400">do</strong> hadir meluncur masuk tepat mendampingi <em>not</em>: <strong className="text-white">I do not sleep (−)</strong>!
                    </motion.p>
                  )}
                  {slide4Step === 4 && (
                    <motion.p
                      key="exp-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Saat ingin membuat kalimat tanya, helper <strong className="text-amber-400">Do</strong> bertukar posisi meluncur ke paling depan sebelum subjek <em>I</em>!
                    </motion.p>
                  )}
                  {slide4Step >= 5 && (
                    <motion.p
                      key="exp-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Ditutup dengan tanda tanya: <strong className="text-white">Do I sleep? (?)</strong>. Polanya sangat rapi dan konsisten!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress step dots */}
              <div className="flex items-center gap-1.5 mt-2">
                {[0, 1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      slide4Step >= s
                        ? 'w-5 bg-cyan-500'
                        : 'w-1.5 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 5: EKSPERIMEN INTERAKTIF 2 (HELPER DOES - HE EATS) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center text-center overflow-visible"
            >
              {/* Context Indicator */}
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
                Eksperimen Interaktif 2: Helper DOES (Kata Kerja Kembali Dasar)
              </div>

              {/* Indonesian Context Heading with locked height */}
              <div className="h-10 flex items-center justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={
                      slide5Step < 2
                        ? 'id2-pos'
                        : slide5Step < 4
                        ? 'id2-neg'
                        : 'id2-q'
                    }
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                    className="text-lg sm:text-xl text-zinc-400 font-medium"
                  >
                    {slide5Step < 2 && 'Dia (laki-laki) makan'}
                    {slide5Step >= 2 && slide5Step < 4 && (
                      <>
                        Dia <span className="text-red-400 font-bold">TIDAK</span> makan
                      </>
                    )}
                    {slide5Step >= 4 && (
                      <>
                        Apakah dia makan? <span className="text-amber-400 font-bold">(Tanya)</span>
                      </>
                    )}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Main Interactive Sentence Box with locked height */}
              <div className="h-28 sm:h-32 flex items-center justify-center mb-6 w-full">
                <div className="relative flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight overflow-visible">
                  {/* Step 0: Initial state prompt */}
                  {slide5Step === 0 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-zinc-600 font-normal text-2xl sm:text-3xl italic"
                    >
                      Tekan Next untuk melihat perubahan eats...
                    </motion.span>
                  )}

                  {/* Step 1 to 6: Active English Sentence */}
                  {slide5Step >= 1 && (
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      className="relative flex items-center gap-2 sm:gap-3 flex-wrap justify-center overflow-visible"
                    >
                      {/* State Symbol Indicator (+ / - / ?) */}
                      <AnimatePresence mode="wait">
                        {slide5Step < 2 && (
                          <motion.div
                            key="sym-plus-2"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-blue-600 flex items-center justify-center text-white font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-blue-900/40"
                          >
                            +
                          </motion.div>
                        )}
                        {slide5Step >= 2 && slide5Step < 4 && (
                          <motion.div
                            key="sym-minus-2"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-red-900/40"
                          >
                            −
                          </motion.div>
                        )}
                        {slide5Step >= 4 && (
                          <motion.div
                            key="sym-q-2"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-0 bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base sm:text-lg mr-3 select-none shadow-md shadow-amber-900/40"
                          >
                            ?
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Helper DOES in Question (front) */}
                      {slide5Step >= 4 && (
                        <motion.span
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={wordSpringTransition}
                          className="text-amber-400 font-black inline-block"
                        >
                          Does
                        </motion.span>
                      )}

                      {/* Subject He */}
                      <motion.span
                        layout="position"
                        transition={wordSpringTransition}
                        className="text-white inline-block"
                      >
                        {slide5Step >= 4 ? 'he' : 'He'}
                      </motion.span>

                      {/* Helper DOES in negative (after subject) - appears at step 3 */}
                      <AnimatePresence mode="popLayout">
                        {slide5Step === 3 && (
                          <motion.span
                            key="slide5-does"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-amber-400 font-black inline-block"
                          >
                            does
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* NOT in negative - appears at step 2 and stays at step 3 */}
                      <AnimatePresence mode="popLayout">
                        {slide5Step >= 2 && slide5Step < 4 && (
                          <motion.span
                            key="slide5-not"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-red-400 font-black inline-block"
                          >
                            not
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Verb: eat vs eats */}
                      <motion.span
                        layout="position"
                        transition={wordSpringTransition}
                        className="text-blue-400 inline-flex items-baseline"
                      >
                        eat
                        {/* The -s suffix that disappears when does arrives at step 3 */}
                        <AnimatePresence mode="popLayout">
                          {slide5Step < 3 && (
                            <motion.span
                              key="suffix-s"
                              layout="position"
                              initial={{ opacity: 1 }}
                              exit={{
                                opacity: 0,
                                y: 8,
                                transition: { duration: 0.2 },
                              }}
                              className="text-amber-400 font-extrabold inline-block"
                            >
                              s
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>

                      {/* Question Mark (?) */}
                      <AnimatePresence mode="popLayout">
                        {slide5Step >= 5 && (
                          <motion.span
                            key="slide5-q"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.2 }}
                            transition={wordSpringTransition}
                            className="text-amber-400 inline-block ml-0.5"
                          >
                            ?
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Explanatory text with locked minimum height to prevent layout shift */}
              <div className="min-h-[100px] h-26 sm:h-28 flex items-start justify-center max-w-xl text-center">
                <AnimatePresence mode="wait">
                  {slide5Step === 1 && (
                    <motion.p
                      key="exp2-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Bentuk positif: <strong className="text-white">He eats (+)</strong>. Ingat aturan Present Tense: subjek <em>He</em> wajib menambahkan akhiran <strong className="text-amber-400">-s</strong> pada kata kerja.
                    </motion.p>
                  )}
                  {slide5Step === 2 && (
                    <motion.p
                      key="exp2-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Untuk menyatakan <strong className="text-white">tidak</strong>, kata <strong className="text-red-400">not</strong> masuk duluan: <em>He not eats</em>. Tapi ingat lagi: kata <strong className="text-white">NOT tidak bisa berdiri sendiri</strong>! Helper apa yang harus kita panggil untuk subjek <em>He</em>?
                    </motion.p>
                  )}
                  {slide5Step === 3 && (
                    <motion.p
                      key="exp2-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Maka Helper <strong className="text-amber-400">does</strong> hadir mendampingi not! Begitu <em>does</em> hadir, akhiran <em>-s</em> pada eats otomatis diserap oleh does: <strong className="text-white">He does not eat (−)</strong>! (Jangan double s: <em>does not eats</em> ❌)
                    </motion.p>
                  )}
                  {slide5Step === 4 && (
                    <motion.p
                      key="exp2-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Untuk kalimat tanya: Helper <strong className="text-amber-400">Does</strong> meluncur ke paling depan sebelum subjek <em>he</em>. Kata kerja tetap dalam bentuk dasar: <strong className="text-blue-400">eat</strong>!
                    </motion.p>
                  )}
                  {slide5Step >= 5 && (
                    <motion.p
                      key="exp2-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      Tanda tanya hadir: <strong className="text-white">Does he eat? (?)</strong>. Ingat kuncinya: <strong className="text-amber-400">Sudah ada DOES = kata kerja WAJIB bentuk dasar!</strong>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress step dots */}
              <div className="flex items-center gap-1.5 mt-2">
                {[0, 1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      slide5Step >= s
                        ? 'w-5 bg-amber-500'
                        : 'w-1.5 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: POLA UNIVERSAL GRAMMAR ("OH, TERNYATA SESIMPLE ITU!") */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center text-center overflow-visible"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                "Oh, Ternyata Sesimple Itu!"
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                Pola pembentukan kalimat <strong className="text-red-400">Negatif (−)</strong> dan <strong className="text-amber-400">Tanya (?)</strong> di SEMUA kalimat bahasa Inggris itu <strong className="text-white">SAMAAAA</strong>!
              </p>

              {/* 2 Universal Patterns Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left mb-8">
                {/* Universal Pattern 1: Kalimat Negatif */}
                <div className="p-6 rounded-xl bg-[#12141c] border-l-4 border-red-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-xs select-none shadow-sm shadow-red-900/30">
                        −
                      </div>
                      <div className="text-base font-bold text-white">Kalimat Negatif</div>
                    </div>
                    <div className="text-xs text-red-400 font-mono font-semibold mb-4">
                      Subjek + Helper + NOT + ...
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-2.5 rounded-lg bg-[#181a24]">
                        <span className="text-zinc-500 block text-[11px]">Dengan Helper BE:</span>
                        <span className="text-white font-medium">I am <strong className="text-red-400">not</strong> a doctor</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#181a24]">
                        <span className="text-zinc-500 block text-[11px]">Dengan Helper DO:</span>
                        <span className="text-white font-medium">I do <strong className="text-red-400">not</strong> sleep</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
                    Selalu selipkan <strong className="text-red-400">NOT</strong> tepat setelah Helper.
                  </div>
                </div>

                {/* Universal Pattern 2: Kalimat Tanya */}
                <div className="p-6 rounded-xl bg-[#12141c] border-l-4 border-amber-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full border-0 bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs select-none shadow-sm shadow-amber-900/30">
                        ?
                      </div>
                      <div className="text-base font-bold text-white">Kalimat Tanya</div>
                    </div>
                    <div className="text-xs text-amber-400 font-mono font-semibold mb-4">
                      Helper + Subjek + ... ?
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-2.5 rounded-lg bg-[#181a24]">
                        <span className="text-zinc-500 block text-[11px]">Dengan Helper BE:</span>
                        <span className="text-white font-medium"><strong className="text-amber-400">Is</strong> Rina studying?</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#181a24]">
                        <span className="text-zinc-500 block text-[11px]">Dengan Helper DO:</span>
                        <span className="text-white font-medium"><strong className="text-amber-400">Do</strong> you sleep?</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
                    Selalu tukar posisi <strong className="text-amber-400">Helper</strong> ke paling depan sebelum Subjek.
                  </div>
                </div>
              </div>

              {/* Key Takeaway Note */}
              <div className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                Kunci utama bahasa Inggris selalu terletak pada <strong className="text-cyan-400">Helper</strong>. Begitu Anda mengenali helper-nya, seluruh pembentukan kalimat negatif dan tanya langsung terbuka dengan sendirinya!
              </div>
            </motion.div>
          )}

          {/* SLIDE 7: DAFTAR CONTOH PRAKTIK 4-STAGE REVEAL (DO & DOES) */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-7"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl flex flex-col items-center overflow-visible"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                  Daftar Contoh: DO &amp; DOES
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Perhatikan perubahan dari <span className="text-zinc-400 font-bold">Indonesia</span> → <span className="text-blue-400 font-bold">Inggris (+)</span> → <span className="text-red-400 font-bold">Negatif (−)</span> → <span className="text-amber-400 font-bold">Tanya (?)</span>.
                </p>
              </div>

              {/* List of 6 Examples with 4-stage progressive reveal */}
              <div className="w-full space-y-4 mb-6">
                {doExamples.map((item, index) => {
                  // Calculate stage for this row based on slide7StepCount:
                  // Each item has 3 transitions:
                  // step < index * 3 + 1 -> stage 0 (ID)
                  // step >= index * 3 + 1 -> stage 1 (EN +)
                  // step >= index * 3 + 2 -> stage 2 (EN -)
                  // step >= index * 3 + 3 -> stage 3 (EN ?)
                  const rowStepThreshold = index * 3;
                  let rowState = 0;
                  if (slide7StepCount >= rowStepThreshold + 3) {
                    rowState = 3;
                  } else if (slide7StepCount >= rowStepThreshold + 2) {
                    rowState = 2;
                  } else if (slide7StepCount >= rowStepThreshold + 1) {
                    rowState = 1;
                  }

                  return (
                    <ExampleSentenceRow
                      key={`row-${index}-${item.subject}`}
                      rowIndex={index}
                      item={item}
                      state={rowState}
                      onClick={handleNext}
                    />
                  );
                })}
              </div>

              {/* Stepping Indicator & Guide */}
              <div className="text-xs text-zinc-500 font-mono">
                {slide7StepCount < totalSlide7Steps ? (
                  <span>
                    Tekan <kbd className="text-zinc-300 font-sans">Space</kbd> atau klik tanda panah ({slide7StepCount} / {totalSlide7Steps})
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    Semua contoh selesai! Tekan tombol centang untuk kembali.
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* 3. Bottom Sticky Footer */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          {/* Left: Previous Button (Icon only) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={
              currentSlide === 0 &&
              slide4Step === 0 &&
              slide5Step === 0 &&
              slide7StepCount === 0
            }
            aria-label="Sebelumnya"
            title="Sebelumnya"
            className="w-10 h-10 rounded-lg bg-[#141722] hover:bg-[#1c2030] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer border-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Center: Slide Dots Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                }}
                aria-label={`Buka slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                  currentSlide === idx
                    ? 'w-6 bg-blue-500'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          {/* Right: Next or Completion Button (Icon only) */}
          <div>
            {currentSlide === totalSlides - 1 &&
            slide7StepCount >= totalSlide7Steps ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Selesai Belajar"
                title="Selesai Belajar"
                className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors cursor-pointer border-0 shadow-lg shadow-emerald-900/40"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Selanjutnya"
                title="Selanjutnya"
                className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors cursor-pointer border-0 shadow-lg shadow-blue-900/30"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelperDoLesson;

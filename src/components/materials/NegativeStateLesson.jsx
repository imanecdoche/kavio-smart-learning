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

// Reusable row for Slide 6 & Slide 7 example lists with 3-stage reveal (ID -> EN + -> EN -)
const ExampleSentenceRow = ({ item, rowIndex = 0, state, onClick }) => {
  // state: 0 = ID, 1 = EN positive (+), 2 = EN negative (-)
  const isEnglish = state >= 1;
  const isNegative = state === 2;
  const rowId = `ns-row-${rowIndex}`;

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors select-none"
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
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                className="relative flex items-baseline gap-1.5 overflow-visible"
              >
                <motion.span
                  key={`${rowId}-token-subject`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-white font-bold inline-block"
                >
                  {item.subject}
                </motion.span>

                <motion.span
                  key={`${rowId}-token-helper`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-blue-400 font-bold inline-block"
                >
                  {item.helper}
                </motion.span>

                {/* NOT smoothly glides in with layout animation on state 2 */}
                <AnimatePresence mode="popLayout">
                  {isNegative && (
                    <motion.span
                      key={`${rowId}-token-not`}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={wordSpringTransition}
                      className="inline-block text-red-400 font-extrabold px-1"
                    >
                      not
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.span
                  key={`${rowId}-token-complement`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-zinc-200 font-bold inline-block"
                >
                  {item.complement}
                </motion.span>
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>
      </div>

      {/* Right side status indicator: Circled + for positive, Circled - for negative (Solid, no outline) */}
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export const NegativeStateLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [slide4Step, setSlide4Step] = useState(0); // 0 to 4 steps for interactive experiment 1 (doctor)
  const [slide5Step, setSlide5Step] = useState(0); // 0 to 4 steps for interactive experiment 2 (studying)
  const [slide6StepCount, setSlide6StepCount] = useState(0); // 0 to 12 steps for nominal examples
  const [slide7StepCount, setSlide7StepCount] = useState(0); // 0 to 12 steps for continuous examples

  const totalSlides = 7;

  // Slide 6 Examples: Helper BE Nominal (Sifat, Tempat, Benda)
  const nominalExamples = [
    {
      idPositive: 'Dia (laki-laki) marah',
      subject: 'He',
      helper: 'is',
      complement: 'angry',
    },
    {
      idPositive: 'Mereka di rumah',
      subject: 'They',
      helper: 'are',
      complement: 'at home',
    },
    {
      idPositive: 'Saya lapar',
      subject: 'I',
      helper: 'am',
      complement: 'hungry',
    },
    {
      idPositive: 'Kita terlambat',
      subject: 'We',
      helper: 'are',
      complement: 'late',
    },
    {
      idPositive: 'Citra seorang guru',
      subject: 'Citra',
      helper: 'is',
      complement: 'a teacher',
    },
    {
      idPositive: 'Kamar ini dingin',
      subject: 'This room',
      helper: 'is',
      complement: 'cold',
    },
  ];

  // Slide 7 Examples: Helper BE Continuous (BE + not + V-ing)
  const continuousExamples = [
    {
      idPositive: 'Dia (perempuan) sedang memasak',
      subject: 'She',
      helper: 'is',
      complement: 'cooking',
    },
    {
      idPositive: 'Mereka sedang tidur',
      subject: 'They',
      helper: 'are',
      complement: 'sleeping',
    },
    {
      idPositive: 'Saya sedang bermain game',
      subject: 'I',
      helper: 'am',
      complement: 'playing games',
    },
    {
      idPositive: 'Kita sedang menunggu',
      subject: 'We',
      helper: 'are',
      complement: 'waiting',
    },
    {
      idPositive: 'Rian sedang menonton TV',
      subject: 'Rian',
      helper: 'is',
      complement: 'watching TV',
    },
    {
      idPositive: 'Anak-anak sedang berlari',
      subject: 'The kids',
      helper: 'are',
      complement: 'running',
    },
  ];

  const maxSlide6Steps = nominalExamples.length * 2;
  const maxSlide7Steps = continuousExamples.length * 2;

  const goToNext = useCallback(() => {
    // Slide 4 (Experiment 1: I am a doctor -> I am not a doctor)
    if (currentSlide === 3) {
      if (slide4Step < 4) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5Step(0);
      return;
    }

    // Slide 5 (Experiment 2: They are studying -> They are not studying)
    if (currentSlide === 4) {
      if (slide5Step < 4) {
        setSlide5Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(5);
      setSlide6StepCount(0);
      return;
    }

    // Slide 6 (Examples Set 1 - Nominal)
    if (currentSlide === 5) {
      if (slide6StepCount < maxSlide6Steps) {
        setSlide6StepCount((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(6);
      setSlide7StepCount(0);
      return;
    }

    // Slide 7 (Examples Set 2 - Continuous)
    if (currentSlide === 6) {
      if (slide7StepCount < maxSlide7Steps) {
        setSlide7StepCount((prev) => prev + 1);
        return;
      }
      if (onBack) onBack();
      return;
    }

    // Standard slides: 0, 1, 2
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      if (currentSlide === 2) {
        setSlide4Step(0);
      }
    }
  }, [
    currentSlide,
    slide4Step,
    slide5Step,
    slide6StepCount,
    slide7StepCount,
    maxSlide6Steps,
    maxSlide7Steps,
    totalSlides,
    onBack,
  ]);

  const goToPrev = useCallback(() => {
    // Slide 7 (Examples Set 2)
    if (currentSlide === 6) {
      if (slide7StepCount > 0) {
        setSlide7StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(5);
      setSlide6StepCount(maxSlide6Steps);
      return;
    }

    // Slide 6 (Examples Set 1)
    if (currentSlide === 5) {
      if (slide6StepCount > 0) {
        setSlide6StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(4);
      setSlide5Step(4);
      return;
    }

    // Slide 5 (Experiment 2: They are not studying)
    if (currentSlide === 4) {
      if (slide5Step > 0) {
        setSlide5Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4Step(4);
      return;
    }

    // Slide 4 (Experiment 1: I am not a doctor)
    if (currentSlide === 3) {
      if (slide4Step > 0) {
        setSlide4Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(2);
      return;
    }

    // Standard slides: 1, 2
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [
    currentSlide,
    slide4Step,
    slide5Step,
    slide6StepCount,
    slide7StepCount,
    maxSlide6Steps,
  ]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape' && onBack) {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onBack]);

  // Framer Motion slide transition variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.22,
        ease: [0.7, 0, 0.84, 0],
      },
    }),
  };

  // Helper to determine item state in example lists (0 = ID, 1 = EN +, 2 = EN -)
  const getItemState = (itemIndex, stepCount) => {
    const itemStartStep = itemIndex * 2;
    if (stepCount >= itemStartStep + 2) return 2; // Negative (-)
    if (stepCount === itemStartStep + 1) return 1; // Positive (+)
    return 0; // Indonesian
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
            {currentSlide === 3 && (
              <span className="text-zinc-500">
                • Langkah {slide4Step + 1} dari 5
              </span>
            )}
            {currentSlide === 4 && (
              <span className="text-zinc-500">
                • Langkah {slide5Step + 1} dari 5
              </span>
            )}
            {currentSlide === 5 && (
              <span className="text-zinc-500">
                • Ditransformasi {Math.floor(slide6StepCount / 2)} dari {nominalExamples.length}
              </span>
            )}
            {currentSlide === 6 && (
              <span className="text-zinc-500">
                • Ditransformasi {Math.floor(slide7StepCount / 2)} dari {continuousExamples.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Interactive Slide Canvas - Flexible & Internal Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
          {/* Slide 1: Hero Title (Apa itu Negative State?) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-ns-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center flex flex-col items-center justify-center py-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Negative <span className="text-red-500">State</span>
              </h1>

              <div className="mt-6 flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold text-zinc-300">
                <span className="text-white">Subjek</span>
                <span>+</span>
                <span className="text-blue-400">Helper</span>
                <span>+</span>
                <span className="text-red-400 font-extrabold">NOT</span>
              </div>

              <div className="mt-8 max-w-xl text-center text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                <p>
                  <strong className="text-white">Apa itu Negative State?</strong> Keadaan atau kalimat yang menyatakan penolakan, penyangkalan, atau ketidakbenaran (kata <strong className="text-red-400">"bukan"</strong> atau <strong className="text-red-400">"tidak"</strong>).
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Untuk mengubah keadaan positif menjadi negatif, bahasa Inggris menggunakan kata penolakan <strong className="text-red-400 font-semibold">NOT</strong>.
                </p>
              </div>

              <p className="mt-8 text-xs text-zinc-400 font-medium">
                Gunakan tombol panah keyboard (← / →) atau tombol di bawah untuk navigasi
              </p>
            </motion.div>
          )}

          {/* Slide 2: Cara Membentuk Negative State */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-ns-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Cara Membentuk Negative State
              </h2>

              <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-6">
                Cukup <strong className="text-red-400 font-semibold">tambahkan NOT setelah Helper</strong>:
              </p>

              {/* Formula & Transformation Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto py-2">
                {/* Column 1: Positif (+) */}
                <div className="border-b md:border-b-0 md:border-r border-[#232736]/60 pb-4 md:pb-0 md:pr-6 space-y-3">
                  <div className="text-base sm:text-lg font-bold text-zinc-400 border-b border-[#232736]/40 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs">
                        +
                      </span>
                      <span>Positif State</span>
                    </span>
                    <span className="text-xs text-zinc-500 font-normal">Subjek + Helper</span>
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-zinc-200 space-y-2.5">
                    <div className="flex justify-between"><span>I <strong className="text-blue-400">am</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>You <strong className="text-blue-400">are</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>They <strong className="text-blue-400">are</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>We <strong className="text-blue-400">are</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>He <strong className="text-blue-400">is</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>She <strong className="text-blue-400">is</strong></span><span className="text-zinc-500">→</span></div>
                    <div className="flex justify-between"><span>It <strong className="text-blue-400">is</strong></span><span className="text-zinc-500">→</span></div>
                  </div>
                </div>

                {/* Column 2: Negatif (-) */}
                <div className="space-y-3 md:pl-2">
                  <div className="text-base sm:text-lg font-bold text-red-400 border-b border-[#232736]/40 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-400 font-black text-xs">
                        −
                      </span>
                      <span>Negative State</span>
                    </span>
                    <span className="text-xs text-red-300 font-normal">Helper + NOT</span>
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white space-y-2.5">
                    <div className="flex justify-between"><span>I am <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>You are <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>They are <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>We are <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>He is <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>She is <strong className="text-red-400 font-extrabold">not</strong></span></div>
                    <div className="flex justify-between"><span>It is <strong className="text-red-400 font-extrabold">not</strong></span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Aturan Inti (NOT Tidak Bisa Berdiri Sendiri) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-ns-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Prinsip Utama: Kata <span className="text-red-400">NOT</span>
              </h2>

              <div className="space-y-6 text-base md:text-lg text-zinc-300 leading-relaxed py-2">
                <div className="p-4 rounded-xl bg-red-500/10 border-0">
                  <p className="text-lg md:text-xl font-bold text-white leading-snug">
                    Kata <span className="text-red-400 uppercase font-black tracking-wide">NOT</span> tidak bisa berdiri sendiri!
                  </p>
                  <p className="mt-2 text-sm md:text-base text-zinc-300">
                    Ia <strong className="text-white underline decoration-red-400 decoration-2 underline-offset-4">WAJIB didampingi oleh Helper</strong>. Dalam bahasa Inggris, Anda tidak boleh menempelkan <em className="text-red-300">not</em> langsung ke subjek tanpa kata kerja bantu.
                  </p>
                </div>

                {/* Comparison Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Wrong without helper */}
                  <div className="p-4 rounded-lg bg-[#141620] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-red-400 font-semibold">Salah (Tanpa Helper)</span>
                      <div className="w-5 h-5 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-xs">
                        −
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-300 line-through">
                      I not doctor
                    </div>
                    <div className="text-xs text-zinc-400">
                      Kata <em>not</em> tidak memiliki helper untuk bersandar.
                    </div>
                  </div>

                  {/* Correct with helper */}
                  <div className="p-4 rounded-lg bg-[#141620] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Benar (Dengan Helper)</span>
                      <div className="w-5 h-5 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                        +
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">
                      I <span className="text-blue-400">am</span> <span className="text-red-400">not</span> a doctor
                    </div>
                    <div className="text-xs text-zinc-400">
                      Kata <em>not</em> berdampingan tepat setelah helper <strong>am</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Interactive Experiment 1 (Aku seorang dokter -> Aku BUKAN seorang dokter) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-ns-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4 flex flex-col items-center justify-center min-h-[360px]"
            >
              {/* Indonesian Text progression */}
              <motion.div
                initial={false}
                animate={{
                  y: slide4Step >= 1 ? -16 : 0,
                  scale: slide4Step >= 1 ? 0.72 : 1,
                  opacity: slide4Step >= 1 ? 0.75 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-300"
              >
                {slide4Step >= 2 ? (
                  <span>
                    Aku <strong className="text-red-400 font-black">BUKAN</strong> seorang dokter
                  </span>
                ) : (
                  <span>Aku seorang dokter</span>
                )}
              </motion.div>

              {/* English Sentence Interactive progression */}
              {slide4Step >= 1 && (
                <div className="relative mt-6 flex items-baseline justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-2 overflow-visible">
                  <LayoutGroup id="exp1-group">
                    <motion.div
                      key="exp1-sentence"
                      layout
                      transition={wordSpringTransition}
                      className="relative flex items-baseline justify-center gap-3 overflow-visible"
                    >
                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">I</motion.span>
                      <motion.span layout="position" transition={wordSpringTransition} className="text-blue-400">am</motion.span>

                      {/* "not" enters smoothly between am and a doctor */}
                      <AnimatePresence mode="popLayout">
                        {slide4Step >= 3 && (
                          <motion.span
                            key="exp1-not"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="inline-block text-red-400 font-extrabold px-1"
                          >
                            not
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">a doctor</motion.span>

                      {/* Circled + or Circled - symbol */}
                      <motion.div layout className="ml-2 flex items-center self-center shrink-0">
                        <AnimatePresence mode="wait">
                          {slide4Step < 3 ? (
                            <motion.div
                              key="exp1-circle-plus"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-0 bg-blue-600 flex items-center justify-center text-white font-black text-base select-none shadow-md shadow-blue-900/30"
                              aria-label="Positif"
                            >
                              +
                            </motion.div>
                          ) : (
                            <motion.div
                              key="exp1-circle-minus"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-base select-none shadow-md shadow-red-900/30"
                              aria-label="Negatif"
                            >
                              −
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  </LayoutGroup>
                </div>
              )}

              {/* Step 4: Explanation for NOT insertion with locked min-height */}
              <div className="min-h-[84px] sm:min-h-[96px] h-20 sm:h-24 flex items-start justify-center max-w-xl mx-auto mt-6 text-left">
                <AnimatePresence mode="wait">
                  {slide4Step >= 4 && (
                    <motion.div
                      key="exp1-desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-sm md:text-base text-zinc-300 leading-relaxed border-t border-[#232736]/60 pt-4 w-full"
                    >
                      <p className="mb-2">
                        Untuk menyatakan <strong className="text-red-400">bukan / tidak</strong>, cukup selipkan kata <strong className="text-red-400 font-bold">not</strong> tepat setelah Helper <strong className="text-blue-400">am</strong>.
                      </p>
                      <p>
                        <strong className="text-zinc-400">I am a doctor</strong> (+) berubah menjadi <strong className="text-white">I am <span className="text-red-400 font-bold">not</span> a doctor</strong> (-).
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 5: Interactive Experiment 2 (Mereka sedang belajar -> Mereka TIDAK sedang belajar) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-ns-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4 flex flex-col items-center justify-center min-h-[360px]"
            >
              {/* Indonesian Text progression */}
              <motion.div
                initial={false}
                animate={{
                  y: slide5Step >= 1 ? -16 : 0,
                  scale: slide5Step >= 1 ? 0.72 : 1,
                  opacity: slide5Step >= 1 ? 0.75 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-300"
              >
                {slide5Step >= 2 ? (
                  <span>
                    Mereka <strong className="text-red-400 font-black">TIDAK</strong> sedang belajar
                  </span>
                ) : (
                  <span>Mereka sedang belajar</span>
                )}
              </motion.div>

              {/* English Sentence Interactive progression */}
              {slide5Step >= 1 && (
                <div className="relative mt-6 flex items-baseline justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-2 overflow-visible">
                  <LayoutGroup id="exp2-group">
                    <motion.div
                      key="exp2-sentence"
                      layout
                      transition={wordSpringTransition}
                      className="relative flex items-baseline justify-center gap-3 overflow-visible"
                    >
                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">They</motion.span>
                      <motion.span layout="position" transition={wordSpringTransition} className="text-blue-400">are</motion.span>

                      {/* "not" glides in smoothly between are and studying */}
                      <AnimatePresence mode="popLayout">
                        {slide5Step >= 3 && (
                          <motion.span
                            key="exp2-not"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="inline-block text-red-400 font-extrabold px-1"
                          >
                            not
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">studying</motion.span>

                      {/* Circled + or Circled - symbol */}
                      <motion.div layout className="ml-2 flex items-center self-center shrink-0">
                        <AnimatePresence mode="wait">
                          {slide5Step < 3 ? (
                            <motion.div
                              key="exp2-circle-plus"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-0 bg-blue-600 flex items-center justify-center text-white font-black text-base select-none shadow-md shadow-blue-900/30"
                              aria-label="Positif"
                            >
                              +
                            </motion.div>
                          ) : (
                            <motion.div
                              key="exp2-circle-minus"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-0 bg-red-600 flex items-center justify-center text-white font-black text-base select-none shadow-md shadow-red-900/30"
                              aria-label="Negatif"
                            >
                              −
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  </LayoutGroup>
                </div>
              )}

              {/* Step 4: Explanation for Continuous Negative with locked min-height */}
              <div className="min-h-[84px] sm:min-h-[96px] h-20 sm:h-24 flex items-start justify-center max-w-xl mx-auto mt-6 text-left">
                <AnimatePresence mode="wait">
                  {slide5Step >= 4 && (
                    <motion.div
                      key="exp2-desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-sm md:text-base text-zinc-300 leading-relaxed border-t border-[#232736]/60 pt-4 w-full"
                    >
                      <p className="mb-2">
                        Pola yang sama berlaku pada kalimat continuous: cukup letakkan <strong className="text-red-400 font-bold">not</strong> tepat setelah Helper <strong className="text-blue-400">are</strong>.
                      </p>
                      <p>
                        <strong className="text-zinc-400">They are studying</strong> (+) berubah menjadi <strong className="text-white">They are <span className="text-red-400 font-bold">not</span> studying</strong> (-).
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 6: Daftar Contoh Set 1 (Helper BE Nominal) */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-ns-5-nominal-examples"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3 max-w-2xl mx-auto py-2">
                {nominalExamples.map((item, idx) => {
                  const state = getItemState(idx, slide6StepCount);

                  return (
                    <ExampleSentenceRow
                      key={`s6-row-${idx}`}
                      rowIndex={idx}
                      item={item}
                      state={state}
                      onClick={() => {
                        if (state === 0) setSlide6StepCount(idx * 2 + 1);
                        else if (state === 1) setSlide6StepCount(idx * 2 + 2);
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Slide 7: Daftar Contoh Set 2 (Helper BE Continuous) */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-ns-6-continuous-examples"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3 max-w-2xl mx-auto py-2">
                {continuousExamples.map((item, idx) => {
                  const state = getItemState(idx, slide7StepCount);

                  return (
                    <ExampleSentenceRow
                      key={`s7-row-${idx}`}
                      rowIndex={idx}
                      item={item}
                      state={state}
                      onClick={() => {
                        if (state === 0) setSlide7StepCount(idx * 2 + 1);
                        else if (state === 1) setSlide7StepCount(idx * 2 + 2);
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* 3. Bottom Sticky Footer */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          {/* Previous Button (Icon only) */}
          <Button
            variant="secondary"
            onClick={goToPrev}
            disabled={currentSlide === 0 && slide4Step === 0 && slide5Step === 0 && slide6StepCount === 0 && slide7StepCount === 0}
            aria-label="Sebelumnya"
            title="Sebelumnya"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentSlide === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0 rotate-180" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>

          {/* Slide Step Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                  if (idx !== 3) setSlide4Step(0);
                  if (idx !== 4) setSlide5Step(0);
                  if (idx !== 5) setSlide6StepCount(0);
                  if (idx !== 6) setSlide7StepCount(0);
                }}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-300 border-0 cursor-pointer
                  ${idx === currentSlide ? 'w-6 bg-red-600' : 'w-2 bg-[#232736] hover:bg-zinc-600'}
                `}
              />
            ))}
          </div>

          {/* Next / Finish Button (Icon only) */}
          {currentSlide === 6 && slide7StepCount >= maxSlide7Steps ? (
            <Button
              variant="primary"
              onClick={onBack}
              aria-label="Selesai Belajar"
              title="Selesai Belajar"
              className="w-10 h-10 p-0 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={goToNext}
              aria-label="Selanjutnya"
              title="Selanjutnya"
              className="w-10 h-10 p-0 flex items-center justify-center rounded-lg"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NegativeStateLesson;

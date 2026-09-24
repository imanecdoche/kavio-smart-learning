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

// Reusable row for Slide 5 & Slide 6 example lists with continuous sliding swap & smooth ? exit
const ExampleSentenceRow = ({ item, rowIndex = 0, state, onClick }) => {
  // state: 0 = Indonesian positive, 1 = English positive, 2 = English question
  const isQuestion = state === 2;
  const isEnglish = state >= 1;
  const rowId = `kt-row-${rowIndex}`;

  // Persistent tokens for Subject and Helper so Framer Motion animates physical sliding swap
  const tokens = isQuestion
    ? [
        { id: 'helper', text: item.helperCap, isHelper: true },
        { id: 'subject', text: item.subjectLower || item.subject, isHelper: false },
      ]
    : [
        { id: 'subject', text: item.subject, isHelper: false },
        { id: 'helper', text: item.helper, isHelper: true },
      ];

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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-400 font-medium text-base sm:text-lg"
            >
              {item.idPositive}
            </motion.span>
          ) : (
            <LayoutGroup id={`group-${rowId}`}>
              <motion.div
                key={`${rowId}-en-container`}
                layout
                transition={wordSpringTransition}
                className="relative flex items-baseline gap-1.5 overflow-visible"
              >
                {/* Swapping tokens: Subject & Helper physically glide and swap places */}
                {tokens.map((token) => (
                  <motion.span
                    key={`${rowId}-token-${token.id}`}
                    layout="position"
                    transition={wordSpringTransition}
                    className={
                      token.isHelper
                        ? 'text-blue-400 font-bold inline-block'
                        : 'text-white font-bold inline-block'
                    }
                  >
                    {token.text}
                  </motion.span>
                ))}

                {/* Rest of sentence with smooth layout tracking */}
                <motion.span
                  key={`${rowId}-token-rest`}
                  layout="position"
                  transition={wordSpringTransition}
                  className="text-zinc-200 font-bold inline-block"
                >
                  {item.rest}
                </motion.span>

                {/* Question mark with smooth scale & fade pop */}
                <AnimatePresence mode="popLayout">
                  {isQuestion && (
                    <motion.span
                      key={`${rowId}-token-qmark`}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2 }}
                      transition={wordSpringTransition}
                      className="inline-block text-amber-400 font-black pl-0.5"
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

      {/* Right side status indicator: solid borderless circle */}
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
              key={`${rowId}-status-q`}
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

export const KalimatTanyaLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [slide3Step, setSlide3Step] = useState(0); // 0 to 4 steps for Rina di dalam kelas
  const [slide4Step, setSlide4Step] = useState(0); // 0 to 4 steps for Rina sedang belajar
  const [slide5StepCount, setSlide5StepCount] = useState(0); // 0 to 12 steps for nominal examples
  const [slide6StepCount, setSlide6StepCount] = useState(0); // 0 to 12 steps for continuous examples

  const totalSlides = 6;

  // Slide 5 Examples: Helper BE Nominal
  const nominalExamples = [
    {
      idPositive: 'Kamu siap',
      idQuestion: 'Kamu siap?',
      subject: 'You',
      subjectLower: 'you',
      helper: 'are',
      helperCap: 'Are',
      rest: 'ready',
    },
    {
      idPositive: 'Dia (laki-laki) di rumah',
      idQuestion: 'Dia (laki-laki) di rumah?',
      subject: 'He',
      subjectLower: 'he',
      helper: 'is',
      helperCap: 'Is',
      rest: 'at home',
    },
    {
      idPositive: 'Mereka pintar',
      idQuestion: 'Mereka pintar?',
      subject: 'They',
      subjectLower: 'they',
      helper: 'are',
      helperCap: 'Are',
      rest: 'smart',
    },
    {
      idPositive: 'Kita terlambat',
      idQuestion: 'Kita terlambat?',
      subject: 'We',
      subjectLower: 'we',
      helper: 'are',
      helperCap: 'Are',
      rest: 'late',
    },
    {
      idPositive: 'Rian seorang dokter',
      idQuestion: 'Rian seorang dokter?',
      subject: 'Rian',
      subjectLower: 'Rian',
      helper: 'is',
      helperCap: 'Is',
      rest: 'a doctor',
    },
    {
      idPositive: 'Buku itu di atas meja',
      idQuestion: 'Buku itu di atas meja?',
      subject: 'The book',
      subjectLower: 'the book',
      helper: 'is',
      helperCap: 'Is',
      rest: 'on the table',
    },
  ];

  // Slide 6 Examples: Helper BE Continuous (BE + V-ing)
  const continuousExamples = [
    {
      idPositive: 'Kamu sedang belajar',
      idQuestion: 'Kamu sedang belajar?',
      subject: 'You',
      subjectLower: 'you',
      helper: 'are',
      helperCap: 'Are',
      rest: 'studying',
    },
    {
      idPositive: 'Mereka sedang bermain',
      idQuestion: 'Mereka sedang bermain?',
      subject: 'They',
      subjectLower: 'they',
      helper: 'are',
      helperCap: 'Are',
      rest: 'playing',
    },
    {
      idPositive: 'Dia (perempuan) sedang memasak',
      idQuestion: 'Dia (perempuan) sedang memasak?',
      subject: 'She',
      subjectLower: 'she',
      helper: 'is',
      helperCap: 'Is',
      rest: 'cooking',
    },
    {
      idPositive: 'Kita sedang menunggu',
      idQuestion: 'Kita sedang menunggu?',
      subject: 'We',
      subjectLower: 'we',
      helper: 'are',
      helperCap: 'Are',
      rest: 'waiting',
    },
    {
      idPositive: 'Dika sedang bekerja',
      idQuestion: 'Dika sedang bekerja?',
      subject: 'Dika',
      subjectLower: 'Dika',
      helper: 'is',
      helperCap: 'Is',
      rest: 'working',
    },
    {
      idPositive: 'Anak-anak sedang tidur',
      idQuestion: 'Anak-anak sedang tidur?',
      subject: 'The children',
      subjectLower: 'the children',
      helper: 'are',
      helperCap: 'Are',
      rest: 'sleeping',
    },
  ];

  const maxSlide5Steps = nominalExamples.length * 2;
  const maxSlide6Steps = continuousExamples.length * 2;

  const goToNext = useCallback(() => {
    // Slide 3 (Experiment 1: Rina di dalam kelas)
    if (currentSlide === 2) {
      if (slide3Step < 4) {
        setSlide3Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(3);
      setSlide4Step(0);
      return;
    }

    // Slide 4 (Experiment 2: Rina sedang belajar)
    if (currentSlide === 3) {
      if (slide4Step < 4) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5StepCount(0);
      return;
    }

    // Slide 5 (Examples Set 1 - Nominal)
    if (currentSlide === 4) {
      if (slide5StepCount < maxSlide5Steps) {
        setSlide5StepCount((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(5);
      setSlide6StepCount(0);
      return;
    }

    // Slide 6 (Examples Set 2 - Continuous)
    if (currentSlide === 5) {
      if (slide6StepCount < maxSlide6Steps) {
        setSlide6StepCount((prev) => prev + 1);
        return;
      }
      if (onBack) onBack();
      return;
    }

    // Standard slides (0, 1)
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      if (currentSlide === 1) {
        setSlide3Step(0);
      }
    }
  }, [
    currentSlide,
    slide3Step,
    slide4Step,
    slide5StepCount,
    slide6StepCount,
    maxSlide5Steps,
    maxSlide6Steps,
    totalSlides,
    onBack,
  ]);

  const goToPrev = useCallback(() => {
    // Slide 6 (Examples Set 2)
    if (currentSlide === 5) {
      if (slide6StepCount > 0) {
        setSlide6StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(4);
      setSlide5StepCount(maxSlide5Steps);
      return;
    }

    // Slide 5 (Examples Set 1)
    if (currentSlide === 4) {
      if (slide5StepCount > 0) {
        setSlide5StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4Step(4);
      return;
    }

    // Slide 4 (Experiment 2: Rina sedang belajar)
    if (currentSlide === 3) {
      if (slide4Step > 0) {
        setSlide4Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(2);
      setSlide3Step(4);
      return;
    }

    // Slide 3 (Experiment 1: Rina di dalam kelas)
    if (currentSlide === 2) {
      if (slide3Step > 0) {
        setSlide3Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(1);
      return;
    }

    // Standard slides (1)
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [
    currentSlide,
    slide3Step,
    slide4Step,
    slide5StepCount,
    slide6StepCount,
    maxSlide5Steps,
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

  // Helper to determine item state in example lists (0 = ID positive, 1 = EN positive, 2 = Question swapped)
  const getItemState = (itemIndex, stepCount) => {
    const itemStartStep = itemIndex * 2;
    if (stepCount >= itemStartStep + 2) return 2; // Swapped question
    if (stepCount === itemStartStep + 1) return 1; // English positive
    return 0; // Indonesian positive
  };

  // Tokens for Slide 3 (Rina di dalam kelas)
  const isSlide3Question = slide3Step >= 3;
  const slide3Tokens = isSlide3Question
    ? [
        { id: 's3-helper', text: 'Is', isHelper: true },
        { id: 's3-subject', text: 'Rina', isHelper: false },
      ]
    : [
        { id: 's3-subject', text: 'Rina', isHelper: false },
        { id: 's3-helper', text: 'is', isHelper: true },
      ];

  // Tokens for Slide 4 (Rina sedang belajar)
  const isSlide4Question = slide4Step >= 3;
  const slide4Tokens = isSlide4Question
    ? [
        { id: 's4-helper', text: 'Is', isHelper: true },
        { id: 's4-subject', text: 'Rina', isHelper: false },
      ]
    : [
        { id: 's4-subject', text: 'Rina', isHelper: false },
        { id: 's4-helper', text: 'is', isHelper: true },
      ];

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
            {currentSlide === 2 && (
              <span className="text-zinc-500">
                • Langkah {slide3Step + 1} dari 5
              </span>
            )}
            {currentSlide === 3 && (
              <span className="text-zinc-500">
                • Langkah {slide4Step + 1} dari 5
              </span>
            )}
            {currentSlide === 4 && (
              <span className="text-zinc-500">
                • Ditransformasi {Math.floor(slide5StepCount / 2)} dari {nominalExamples.length}
              </span>
            )}
            {currentSlide === 5 && (
              <span className="text-zinc-500">
                • Ditransformasi {Math.floor(slide6StepCount / 2)} dari {continuousExamples.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Interactive Slide Canvas - Flexible & Internal Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
          {/* Slide 1: Hero Title (Apa itu Kalimat Tanya?) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-kt-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center flex flex-col items-center justify-center py-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Kalimat <span className="text-blue-500">Tanya</span>
              </h1>

              <div className="mt-6 flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold text-zinc-300">
                <span className="text-blue-400">Helper</span>
                <span>+</span>
                <span className="text-white">Subjek</span>
                <span className="text-emerald-400 font-extrabold">?</span>
              </div>

              <div className="mt-8 max-w-xl text-center text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                <p>
                  <strong className="text-white">Apa itu kalimat tanya?</strong> Kalimat yang digunakan untuk meminta informasi atau konfirmasi (Yes/No Question).
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Dalam bahasa Inggris, kalimat tanya dibentuk bukan hanya dengan intonasi, melainkan dengan mengubah susunan kata.
                </p>
              </div>

              <p className="mt-8 text-xs text-zinc-400 font-medium">
                Gunakan tombol panah keyboard (← / →) atau tombol di bawah untuk navigasi
              </p>
            </motion.div>
          )}

          {/* Slide 2: Cara Membentuk Kalimat Tanya */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-kt-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Cara Membentuk Kalimat Tanya
              </h2>

              <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-6">
                Cukup <strong className="text-blue-400 font-semibold">tukar posisi Subjek dengan Helper-nya</strong>:
              </p>

              {/* Formula & Transformation Box (Unboxed, clean border-b) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto py-2">
                {/* Column 1: Kalimat Positif */}
                <div className="border-b md:border-b-0 md:border-r border-[#232736]/60 pb-4 md:pb-0 md:pr-6 space-y-3">
                  <div className="text-base sm:text-lg font-bold text-zinc-400 border-b border-[#232736]/40 pb-2 flex items-center justify-between">
                    <span>Kalimat Positif</span>
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

                {/* Column 2: Kalimat Tanya */}
                <div className="space-y-3 md:pl-2">
                  <div className="text-base sm:text-lg font-bold text-blue-400 border-b border-[#232736]/40 pb-2 flex items-center justify-between">
                    <span>Kalimat Tanya</span>
                    <span className="text-xs text-blue-300 font-normal">Helper + Subjek ?</span>
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white space-y-2.5">
                    <div className="flex justify-between"><span className="text-blue-400">Am</span> <span>I<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Are</span> <span>you<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Are</span> <span>they<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Are</span> <span>we<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Is</span> <span>he<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Is</span> <span>she<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                    <div className="flex justify-between"><span className="text-blue-400">Is</span> <span>it<strong className="text-emerald-400 font-extrabold">?</strong></span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Interactive Experiment 1 (Rina di dalam kelas) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-kt-2"
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
                  y: slide3Step >= 1 ? -16 : 0,
                  scale: slide3Step >= 1 ? 0.72 : 1,
                  opacity: slide3Step >= 1 ? 0.75 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-300"
              >
                {slide3Step >= 2 ? (
                  <span>
                    Rina di dalam kelas<strong className="text-emerald-400 font-black">?</strong>
                  </span>
                ) : (
                  <span>Rina di dalam kelas</span>
                )}
              </motion.div>

              {/* English Sentence Interactive Sliding Swap */}
              {slide3Step >= 1 && (
                <div className="relative mt-6 flex items-baseline justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-2 overflow-visible">
                  <LayoutGroup id="s3-group">
                    <motion.div
                      layout
                      transition={wordSpringTransition}
                      className="relative flex items-baseline justify-center gap-3 overflow-visible"
                    >
                    {/* Swapping tokens: Is / is and Rina physically slide past each other */}
                    {slide3Tokens.map((token) => (
                      <motion.span
                        key={token.id}
                        layout="position"
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 22,
                          mass: 0.8,
                        }}
                        className={
                          token.isHelper
                            ? 'text-blue-400 font-extrabold inline-block'
                            : 'text-white font-extrabold inline-block'
                        }
                      >
                        {token.text}
                      </motion.span>
                    ))}

                    <motion.span
                      layout="position"
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 22,
                      }}
                      className="text-zinc-200 inline-block"
                    >
                      in the class
                    </motion.span>

                    {/* Question mark with smooth scale & fade pop */}
                    <AnimatePresence mode="popLayout">
                      {isSlide3Question && (
                        <motion.span
                          key="s3-qmark"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.2 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.2 }}
                          transition={wordSpringTransition}
                          className="inline-block text-amber-400 font-black pl-0.5"
                        >
                          ?
                        </motion.span>
                      )}
                    </AnimatePresence>
                    </motion.div>
                  </LayoutGroup>
                </div>
              )}

              {/* Step 4: Explanation for Swap with locked min-height */}
              <div className="min-h-[84px] sm:min-h-[96px] h-20 sm:h-24 flex items-start justify-center max-w-xl mx-auto mt-6 text-left">
                <AnimatePresence mode="wait">
                  {slide3Step >= 4 && (
                    <motion.div
                      key="s3-desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-sm md:text-base text-zinc-300 leading-relaxed border-t border-[#232736]/60 pt-4 w-full"
                    >
                      <p className="mb-2">
                        Untuk mengubah kalimat menjadi pertanyaan, <strong className="text-white">cukup tukar posisi Subjek dan Helper</strong>.
                      </p>
                      <p>
                        <strong className="text-zinc-400">Rina is</strong> bertukar posisi menjadi <strong className="text-blue-400 font-semibold">Is Rina</strong> in the class<strong className="text-amber-400 font-bold">?</strong>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Interactive Experiment 2 (Rina sedang belajar) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-kt-3"
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
                    Rina sedang belajar<strong className="text-emerald-400 font-black">?</strong>
                  </span>
                ) : (
                  <span>Rina sedang belajar</span>
                )}
              </motion.div>

              {/* English Sentence Interactive Sliding Swap */}
              {slide4Step >= 1 && (
                <div className="relative mt-6 flex items-baseline justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-2 overflow-visible">
                  <LayoutGroup id="s4-group">
                    <motion.div
                      layout
                      transition={wordSpringTransition}
                      className="relative flex items-baseline justify-center gap-3 overflow-visible"
                    >
                    {/* Swapping tokens: Is / is and Rina physically slide past each other */}
                    {slide4Tokens.map((token) => (
                      <motion.span
                        key={token.id}
                        layout="position"
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 22,
                          mass: 0.8,
                        }}
                        className={
                          token.isHelper
                            ? 'text-blue-400 font-extrabold inline-block'
                            : 'text-white font-extrabold inline-block'
                        }
                      >
                        {token.text}
                      </motion.span>
                    ))}

                    <motion.span
                      layout="position"
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 22,
                      }}
                      className="text-zinc-200 inline-block"
                    >
                      studying
                    </motion.span>

                    {/* Question mark with smooth scale & fade pop */}
                    <AnimatePresence mode="popLayout">
                      {isSlide4Question && (
                        <motion.span
                          key="s4-qmark"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.2 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.2 }}
                          transition={wordSpringTransition}
                          className="inline-block text-amber-400 font-black pl-0.5"
                        >
                          ?
                        </motion.span>
                      )}
                    </AnimatePresence>
                    </motion.div>
                  </LayoutGroup>
                </div>
              )}

              {/* Step 4: Explanation for Swap with locked min-height */}
              <div className="min-h-[84px] sm:min-h-[96px] h-20 sm:h-24 flex items-start justify-center max-w-xl mx-auto mt-6 text-left">
                <AnimatePresence mode="wait">
                  {slide4Step >= 4 && (
                    <motion.div
                      key="s4-desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-sm md:text-base text-zinc-300 leading-relaxed border-t border-[#232736]/60 pt-4 w-full"
                    >
                      <p className="mb-2">
                        Pada kalimat <strong className="text-white">Continuous (sedang berlangsung)</strong> pun rumusnya persis sama!
                      </p>
                      <p>
                        <strong className="text-zinc-400">Rina is studying</strong> bertukar posisi menjadi <strong className="text-blue-400 font-semibold">Is Rina studying</strong><strong className="text-amber-400 font-bold">?</strong>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 5: Daftar Contoh Set 1 (Helper BE Nominal) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-kt-4-nominal-examples"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3 max-w-2xl mx-auto py-2">
                {nominalExamples.map((item, idx) => {
                  const state = getItemState(idx, slide5StepCount);

                  return (
                    <ExampleSentenceRow
                      key={`s5-row-${idx}`}
                      rowIndex={idx}
                      item={item}
                      state={state}
                      onClick={() => {
                        // Click row to advance it
                        if (state === 0) setSlide5StepCount(idx * 2 + 1);
                        else if (state === 1) setSlide5StepCount(idx * 2 + 2);
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Slide 6: Daftar Contoh Set 2 (Helper BE Continuous) */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-kt-5-continuous-examples"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3 max-w-2xl mx-auto py-2">
                {continuousExamples.map((item, idx) => {
                  const state = getItemState(idx, slide6StepCount);

                  return (
                    <ExampleSentenceRow
                      key={`s6-row-${idx}`}
                      rowIndex={idx}
                      item={item}
                      state={state}
                      onClick={() => {
                        // Click row to advance it
                        if (state === 0) setSlide6StepCount(idx * 2 + 1);
                        else if (state === 1) setSlide6StepCount(idx * 2 + 2);
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
            disabled={currentSlide === 0 && slide3Step === 0 && slide4Step === 0 && slide5StepCount === 0 && slide6StepCount === 0}
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
                  if (idx !== 2) setSlide3Step(0);
                  if (idx !== 3) setSlide4Step(0);
                  if (idx !== 4) setSlide5StepCount(0);
                  if (idx !== 5) setSlide6StepCount(0);
                }}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-300 border-0 cursor-pointer
                  ${idx === currentSlide ? 'w-6 bg-blue-600' : 'w-2 bg-[#232736] hover:bg-zinc-600'}
                `}
              />
            ))}
          </div>

          {/* Next / Finish Button (Icon only) */}
          {currentSlide === 5 && slide6StepCount >= maxSlide6Steps ? (
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

export default KalimatTanyaLesson;

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';

const wordSpringTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

export const PresentTenseLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [slide4Step, setSlide4Step] = useState(0); // 0 to 3 steps for interactive comparison
  const [wordStep, setWordStep] = useState(0); // 0 to 2 steps for 1-word-per-slide interactive transitions
  const [wordStepDirection, setWordStepDirection] = useState(1); // 1 = forward (y -> i), -1 = backward (i -> y)
  const [slideExamples1Count, setSlideExamples1Count] = useState(0); // 0 to 7 sequential reveals for examples set 1
  const [slideExamples2Count, setSlideExamples2Count] = useState(0); // 0 to 7 sequential reveals for examples set 2

  const totalSlides = 16;

  // Words for -s / -es examples (Slides 5 to 8)
  const sEsWordSlides = [
    {
      id: 'watch',
      base: 'watch',
      ruleName: 'Akhiran -ch (Bunyi Desis)',
      sequence: ['watch', 'watch (akhiran -ch)', 'watches'],
      steps: [
        {
          display: <span>watch</span>,
          desc: 'Bentuk dasar kata kerja',
        },
        {
          display: (
            <span>
              wat
              <span className="text-blue-400 font-extrabold underline decoration-blue-400 decoration-4 underline-offset-8 mx-0.5">
                ch
              </span>
            </span>
          ),
          desc: (
            <span>
              Berakhiran bunyi desis <strong className="text-blue-400 font-bold">-ch</strong>
            </span>
          ),
        },
        {
          display: (
            <span className="inline-flex items-baseline">
              <span>watch</span>
              <motion.span
                initial={{ opacity: 0, x: -14, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="inline-block text-blue-400 font-extrabold pr-1 pb-1"
              >
                es
              </motion.span>
            </span>
          ),
          desc: (
            <span>
              Wajib ditambah <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">watches</strong>
            </span>
          ),
        },
      ],
    },
    {
      id: 'go',
      base: 'go',
      ruleName: 'Akhiran -o (Vokal Bulat)',
      sequence: ['go', 'go (akhiran -o)', 'goes'],
      steps: [
        {
          display: <span>go</span>,
          desc: 'Bentuk dasar kata kerja',
        },
        {
          display: (
            <span>
              g
              <span className="text-blue-400 font-extrabold underline decoration-blue-400 decoration-4 underline-offset-8 mx-0.5">
                o
              </span>
            </span>
          ),
          desc: (
            <span>
              Berakhiran vokal bulat <strong className="text-blue-400 font-bold">-o</strong>
            </span>
          ),
        },
        {
          display: (
            <span className="inline-flex items-baseline">
              <span>go</span>
              <motion.span
                initial={{ opacity: 0, x: -14, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="inline-block text-blue-400 font-extrabold pr-1 pb-1"
              >
                es
              </motion.span>
            </span>
          ),
          desc: (
            <span>
              Wajib ditambah <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">goes</strong>
            </span>
          ),
        },
      ],
    },
    {
      id: 'work',
      base: 'work',
      ruleName: 'Konsonan Biasa (Umum)',
      sequence: ['work', 'work (konsonan k)', 'works'],
      steps: [
        {
          display: <span>work</span>,
          desc: 'Bentuk dasar kata kerja',
        },
        {
          display: (
            <span>
              wor
              <span className="text-blue-400 font-extrabold underline decoration-blue-400 decoration-4 underline-offset-8 mx-0.5">
                k
              </span>
            </span>
          ),
          desc: (
            <span>
              Konsonan biasa di luar bunyi desis / -o
            </span>
          ),
        },
        {
          display: (
            <span className="inline-flex items-baseline">
              <span>work</span>
              <motion.span
                initial={{ opacity: 0, x: -14, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="inline-block text-blue-400 font-extrabold pr-1 pb-1"
              >
                s
              </motion.span>
            </span>
          ),
          desc: (
            <span>
              Cukup ditambah <strong className="text-blue-400">-s</strong> → <strong className="text-emerald-400 font-bold">works</strong>
            </span>
          ),
        },
      ],
    },
    {
      id: 'fix',
      base: 'fix',
      ruleName: 'Akhiran -x (Bunyi Desis)',
      sequence: ['fix', 'fix (akhiran -x)', 'fixes'],
      steps: [
        {
          display: <span>fix</span>,
          desc: 'Bentuk dasar kata kerja',
        },
        {
          display: (
            <span>
              fi
              <span className="text-blue-400 font-extrabold underline decoration-blue-400 decoration-4 underline-offset-8 mx-0.5">
                x
              </span>
            </span>
          ),
          desc: (
            <span>
              Berakhiran bunyi desis <strong className="text-blue-400 font-bold">-x</strong>
            </span>
          ),
        },
        {
          display: (
            <span className="inline-flex items-baseline">
              <span>fix</span>
              <motion.span
                initial={{ opacity: 0, x: -14, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="inline-block text-blue-400 font-extrabold pr-1 pb-1"
              >
                es
              </motion.span>
            </span>
          ),
          desc: (
            <span>
              Wajib ditambah <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">fixes</strong>
            </span>
          ),
        },
      ],
    },
  ];

  // Words for -y rules examples (Slides 10 to 13)
  const yWordSlides = [
    {
      id: 'study',
      base: 'study',
      prefix: 'stu',
      targetChar: 'd',
      ruleType: 'consonant',
      ruleName: 'Konsonan + y',
      suffix: 'es',
      sequence: ['study', 'studi (highlight D)', 'studies'],
      desc: [
        'Bentuk dasar kata kerja',
        (
          <span>
            Sebelum <strong className="text-white">y</strong> adalah huruf konsonan (<strong className="text-blue-400 font-bold">d</strong>), maka <strong className="text-white">y</strong> berubah menjadi <strong className="text-emerald-400 font-bold">i</strong>
          </span>
        ),
        (
          <span>
            Lalu tambahkan <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">studies</strong>
          </span>
        ),
      ],
    },
    {
      id: 'cry',
      base: 'cry',
      prefix: 'c',
      targetChar: 'r',
      ruleType: 'consonant',
      ruleName: 'Konsonan + y',
      suffix: 'es',
      sequence: ['cry', 'cri (highlight R)', 'cries'],
      desc: [
        'Bentuk dasar kata kerja',
        (
          <span>
            Sebelum <strong className="text-white">y</strong> adalah huruf konsonan (<strong className="text-blue-400 font-bold">r</strong>), maka <strong className="text-white">y</strong> berubah menjadi <strong className="text-emerald-400 font-bold">i</strong>
          </span>
        ),
        (
          <span>
            Lalu tambahkan <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">cries</strong>
          </span>
        ),
      ],
    },
    {
      id: 'play',
      base: 'play',
      prefix: 'pl',
      targetChar: 'a',
      ruleType: 'vowel',
      ruleName: 'Vokal + y',
      suffix: 's',
      sequence: ['play', 'play (highlight A)', 'plays'],
      desc: [
        'Bentuk dasar kata kerja',
        (
          <span>
            Sebelum <strong className="text-white">y</strong> adalah huruf vokal (<strong className="text-blue-400 font-bold">a</strong>), maka huruf <strong className="text-white">y</strong> TIDAK berubah
          </span>
        ),
        (
          <span>
            Cukup langsung ditambah <strong className="text-blue-400">-s</strong> → <strong className="text-emerald-400 font-bold">plays</strong>
          </span>
        ),
      ],
    },
    {
      id: 'fly',
      base: 'fly',
      prefix: 'f',
      targetChar: 'l',
      ruleType: 'consonant',
      ruleName: 'Konsonan + y',
      suffix: 'es',
      sequence: ['fly', 'fli (highlight L)', 'flies'],
      desc: [
        'Bentuk dasar kata kerja',
        (
          <span>
            Sebelum <strong className="text-white">y</strong> adalah huruf konsonan (<strong className="text-blue-400 font-bold">l</strong>), maka <strong className="text-white">y</strong> berubah menjadi <strong className="text-emerald-400 font-bold">i</strong>
          </span>
        ),
        (
          <span>
            Lalu tambahkan <strong className="text-blue-400">-es</strong> → <strong className="text-emerald-400 font-bold">flies</strong>
          </span>
        ),
      ],
    },
  ];

  // Slide 14 Examples (Set 1): Base verb (tanpa s/es) vs verb + s/es
  const slideExamples1 = [
    { subject: 'I', verbBase: 'work', verbWithS: '', complement: 'every day', ruleType: 'base' },
    { subject: 'You', verbBase: 'read', verbWithS: '', complement: 'books', ruleType: 'base' },
    { subject: 'They', verbBase: 'play', verbWithS: '', complement: 'football', ruleType: 'base' },
    { subject: 'We', verbBase: 'live', verbWithS: '', complement: 'here', ruleType: 'base' },
    { subject: 'He', verbBase: 'work', verbWithS: 's', complement: 'hard', ruleType: 's' },
    { subject: 'She', verbBase: 'read', verbWithS: 's', complement: 'the newspaper', ruleType: 's' },
    { subject: 'It', verbBase: 'rain', verbWithS: 's', complement: 'often', ruleType: 's' },
  ];

  // Slide 15 Examples (Set 2): More singular/plural subjects + s/es & y rules
  const slideExamples2 = [
    { subject: 'Dika', verbBase: 'watch', verbWithS: 'es', complement: 'movies', ruleType: 'es' },
    { subject: 'Citra', verbBase: 'teach', verbWithS: 'es', complement: 'English', ruleType: 'es' },
    { subject: 'Rian', verbBase: 'go', verbWithS: 'es', complement: 'to school', ruleType: 'es' },
    { subject: 'Maya', verbBase: 'study', verbWithS: 'studies', complement: 'diligently', ruleType: 'ies', customBase: 'study' },
    { subject: 'The dog', verbBase: 'run', verbWithS: 's', complement: 'fast', ruleType: 's' },
    { subject: 'Dika & Citra', verbBase: 'watch', verbWithS: '', complement: 'movies together', ruleType: 'base' },
    { subject: 'The students', verbBase: 'study', verbWithS: '', complement: 'every day', ruleType: 'base' },
  ];

  // Check if current slide is an interactive 1-word slide (Slides 5-8 or Slides 10-13)
  const isWordSlide = (currentSlide >= 5 && currentSlide <= 8) || (currentSlide >= 10 && currentSlide <= 13);

  const goToNext = useCallback(() => {
    // Slide 3 (Experiment) - Multi-step interactive comparison
    if (currentSlide === 3) {
      if (slide4Step < 3) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      return;
    }

    // Interactive Word Slides: 5, 6, 7, 8 (-s / -es) & 10, 11, 12, 13 (-y)
    if (isWordSlide) {
      if (wordStep < 2) {
        setWordStepDirection(1);
        setWordStep((prev) => prev + 1);
        return;
      }
      setWordStep(0);
      setWordStepDirection(1);
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      return;
    }

    // Slide 14 (Examples Set 1) - Sequential reveal 1 by 1
    if (currentSlide === 14) {
      if (slideExamples1Count < slideExamples1.length) {
        setSlideExamples1Count((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(15);
      setSlideExamples2Count(0);
      return;
    }

    // Slide 15 (Examples Set 2) - Sequential reveal 1 by 1
    if (currentSlide === 15) {
      if (slideExamples2Count < slideExamples2.length) {
        setSlideExamples2Count((prev) => prev + 1);
        return;
      }
      if (onBack) onBack();
      return;
    }

    // Standard Slides: 0, 1, 2, 4, 9
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      setWordStep(0);
      setWordStepDirection(1);
      if (currentSlide === 13) {
        setSlideExamples1Count(0);
      }
    }
  }, [
    currentSlide,
    slide4Step,
    isWordSlide,
    wordStep,
    slideExamples1Count,
    slideExamples2Count,
    slideExamples1.length,
    slideExamples2.length,
    totalSlides,
    onBack,
  ]);

  const goToPrev = useCallback(() => {
    // Slide 15 (Examples Set 2)
    if (currentSlide === 15) {
      if (slideExamples2Count > 0) {
        setSlideExamples2Count((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(14);
      setSlideExamples1Count(slideExamples1.length);
      return;
    }

    // Slide 14 (Examples Set 1)
    if (currentSlide === 14) {
      if (slideExamples1Count > 0) {
        setSlideExamples1Count((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(13);
      setWordStep(2);
      setWordStepDirection(-1);
      return;
    }

    // Interactive Word Slides: 5, 6, 7, 8 (-s / -es) & 10, 11, 12, 13 (-y)
    if (isWordSlide) {
      if (wordStep > 0) {
        setWordStepDirection(-1);
        setWordStep((prev) => prev - 1);
        return;
      }
      // If at wordStep 0, go back to previous slide
      setDirection(-1);
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      // If previous slide is also a word slide, set wordStep to 2
      if ((prevSlide >= 5 && prevSlide <= 8) || (prevSlide >= 10 && prevSlide <= 13)) {
        setWordStep(2);
        setWordStepDirection(-1);
      } else {
        setWordStep(0);
        setWordStepDirection(1);
      }
      return;
    }

    // Slide 10 going back to Slide 9 (Explanation -y)
    if (currentSlide === 9) {
      setDirection(-1);
      setCurrentSlide(8);
      setWordStep(2);
      setWordStepDirection(-1);
      return;
    }

    // Slide 4 (Explanation -s / -es) going back to Slide 3
    if (currentSlide === 4) {
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4Step(3);
      return;
    }

    // Slide 3 (Interactive Comparison Experiment)
    if (currentSlide === 3) {
      if (slide4Step > 0) {
        setSlide4Step((prev) => prev - 1);
        return;
      }
    }

    // Standard Slides: 1, 2
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
      setWordStep(0);
      setWordStepDirection(1);
    }
  }, [
    currentSlide,
    slide4Step,
    isWordSlide,
    wordStep,
    slideExamples1Count,
    slideExamples2Count,
    slideExamples1.length,
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

  // Rolling transition variants for character rolling (y to i):
  // y moves downwards (exit down), i enters from top (enter from top) with soft ease-out deceleration
  const rollingCharVariants = {
    enter: (dir) => ({
      y: dir > 0 ? -48 : 48,
      opacity: 0,
      filter: 'blur(2px)',
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        y: { duration: 0.52, ease: [0.16, 1, 0.3, 1] }, // Smooth deceleration / soft ease-out
        opacity: { duration: 0.35, ease: 'easeOut' },
        filter: { duration: 0.35, ease: 'easeOut' },
      },
    },
    exit: (dir) => ({
      y: dir > 0 ? 48 : -48,
      opacity: 0,
      filter: 'blur(2px)',
      transition: {
        y: { duration: 0.42, ease: [0.7, 0, 0.84, 0] },
        opacity: { duration: 0.28 },
        filter: { duration: 0.28 },
      },
    }),
  };

  // Helper to get active word slide config
  const getActiveWordConfig = () => {
    if (currentSlide >= 5 && currentSlide <= 8) {
      return sEsWordSlides[currentSlide - 5];
    }
    if (currentSlide >= 10 && currentSlide <= 13) {
      return yWordSlides[currentSlide - 10];
    }
    return null;
  };

  const activeWordConfig = getActiveWordConfig();

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
                • Langkah {slide4Step + 1} dari 4
              </span>
            )}
            {isWordSlide && (
              <span className="text-zinc-500">
                • Langkah {wordStep + 1} dari 3
              </span>
            )}
            {currentSlide === 14 && (
              <span className="text-zinc-500">
                • Terungkap {slideExamples1Count} dari {slideExamples1.length}
              </span>
            )}
            {currentSlide === 15 && (
              <span className="text-zinc-500">
                • Terungkap {slideExamples2Count} dari {slideExamples2.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Interactive Slide Canvas - Flexible & Internal Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
          {/* Slide 1: Hero Title (Unboxed) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-pt-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center flex flex-col items-center justify-center py-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Simple <span className="text-blue-500">Present Tense</span>
              </h1>

              <div className="mt-6 flex items-center justify-center gap-4 text-xl sm:text-2xl font-bold text-zinc-300">
                <span>V tanpa s/es</span>
                <span className="text-zinc-500">•</span>
                <span>V + <span className="text-blue-400">s/es</span></span>
              </div>

              <p className="mt-8 text-xs text-zinc-400 font-medium">
                Gunakan tombol panah keyboard (← / →) atau tombol di bawah untuk navigasi
              </p>
            </motion.div>
          )}

          {/* Slide 2: Core Concept (Unboxed) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-pt-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Hakikat Simple Present Tense
              </h2>

              <div className="space-y-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                <p>
                  Simple Present Tense digunakan untuk menyatakan <strong className="text-white">kebiasaan (routine)</strong>, <strong className="text-white">kebenaran umum (facts)</strong>, atau <strong className="text-white">kondisi saat ini</strong>.
                </p>
                <p>
                  Kunci utama dari Present Tense terletak pada <strong className="text-blue-400 font-semibold">kesesuaian antara subjek dan kata kerja</strong> (Subject-Verb Agreement):
                </p>
                <p>
                  Jika subjeknya tunggal orang ketiga (<em className="text-white">He, She, It, nama tunggal</em>), kata kerja <strong className="text-white">wajib ditambah akhiran -s atau -es</strong>. Sebaliknya, jika subjeknya <em className="text-white">I, You, They, We, atau subjek jamak</em>, kata kerja tetap dalam bentuk dasar (<strong className="text-blue-400">tanpa s/es</strong>).
                </p>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Subject Mapping Formula (Unboxed) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-pt-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Rumus Pemetaan Subjek & Verb
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left py-2">
                {/* Column 1: Tanpa s/es */}
                <div className="border-b md:border-b-0 md:border-r border-[#232736]/60 pb-4 md:pb-0 md:pr-6 space-y-3">
                  <div className="text-base sm:text-lg font-bold text-blue-400 border-b border-[#232736]/40 pb-2">
                    Verb Tanpa s/es
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-zinc-200 space-y-2">
                    <div className="flex justify-between"><span>I</span><span className="text-zinc-400">work</span></div>
                    <div className="flex justify-between"><span>You</span><span className="text-zinc-400">work</span></div>
                    <div className="flex justify-between"><span>They</span><span className="text-zinc-400">work</span></div>
                    <div className="flex justify-between"><span>We</span><span className="text-zinc-400">work</span></div>
                    <div className="flex justify-between"><span>Subjek Jamak (Plural)</span><span className="text-zinc-400">work</span></div>
                  </div>
                </div>

                {/* Column 2: + s/es */}
                <div className="space-y-3 md:pl-2">
                  <div className="text-base sm:text-lg font-bold text-blue-400 border-b border-[#232736]/40 pb-2">
                    Verb + s/es
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-zinc-200 space-y-2">
                    <div className="flex justify-between"><span>He</span><span className="text-white">work<strong className="text-blue-400">s</strong></span></div>
                    <div className="flex justify-between"><span>She</span><span className="text-white">work<strong className="text-blue-400">s</strong></span></div>
                    <div className="flex justify-between"><span>It</span><span className="text-white">work<strong className="text-blue-400">s</strong></span></div>
                    <div className="flex justify-between"><span>Dika (Tunggal)</span><span className="text-white">work<strong className="text-blue-400">s</strong></span></div>
                    <div className="flex justify-between"><span>Citra (Tunggal)</span><span className="text-white">work<strong className="text-blue-400">s</strong></span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Multi-Step Interactive Comparison (Unboxed) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-pt-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4 flex flex-col items-center justify-center min-h-[340px]"
            >
              {/* Indonesian Text: "Dia bekerja setiap hari" */}
              <motion.div
                initial={false}
                animate={{
                  y: slide4Step >= 1 ? -14 : 0,
                  scale: slide4Step >= 1 ? 0.68 : 1,
                  opacity: slide4Step >= 1 ? 0.7 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-300 tracking-tight"
              >
                Dia (laki-laki) bekerja setiap hari
              </motion.div>

              {/* English Sentence Interactive Progression */}
              {slide4Step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 flex flex-col items-center justify-center py-2"
                >
                  <LayoutGroup id="pt-slide4-group">
                    <div className="relative isolate flex items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-relaxed">
                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">He</motion.span>

                      {/* Verb part: "work" + "s" */}
                      <motion.span layout="position" transition={wordSpringTransition} className="inline-flex items-baseline text-white">
                        <span>work</span>

                        {/* "s" appears on step 2 */}
                        <AnimatePresence mode="popLayout">
                          {slide4Step >= 2 && (
                            <motion.span
                              key="s-suffix"
                              layout="position"
                              initial={{ opacity: 0, scale: 0.85, color: '#60a5fa' }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                color: ['#60a5fa', '#60a5fa', '#ffffff'],
                              }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{
                                layout: wordSpringTransition,
                                scale: wordSpringTransition,
                                opacity: { duration: 0.25 },
                                color: {
                                  duration: 1.6,
                                  times: [0, 0.62, 1],
                                  ease: 'easeOut',
                                },
                              }}
                              className="inline-block pr-1 pb-1"
                            >
                              s
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>

                      <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">every day</motion.span>

                      {/* Pure Symbols: ❌ on step 1, ✅ on step 2, 3 */}
                      <motion.div layout="position" transition={wordSpringTransition} className="ml-2 flex items-center">
                        <AnimatePresence mode="wait">
                          {slide4Step === 1 ? (
                            <motion.div
                              key="cross"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={wordSpringTransition}
                              className="flex items-center text-red-500"
                              aria-label="Salah"
                            >
                              <svg className="w-8 h-8 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={wordSpringTransition}
                              className="flex items-center text-emerald-400"
                              aria-label="Benar"
                            >
                              <svg className="w-8 h-8 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </LayoutGroup>
                </motion.div>
              )}

              {/* Step 3: Explanation for He works (Locked min-height to prevent layout shift) */}
              <div className="min-h-[100px] sm:min-h-[110px]">
                {slide4Step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 text-sm md:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed text-left border-t border-[#232736]/60 pt-4"
                  >
                    <p className="mb-2">
                      <strong className="text-red-400">He work every day</strong> salah karena subjek <em>He</em> adalah orang ketiga tunggal.
                    </p>
                    <p>
                      Dalam kalimat Present Tense, kata kerja untuk subjek tunggal wajib ditambah akhiran <strong className="text-blue-400">-s</strong>: <strong className="text-emerald-400 font-semibold">He works every day</strong>.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Slide 5: Kapan Menggunakan -s vs -es (Unboxed) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-pt-4-rules"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Kapan Menggunakan <span className="text-blue-400">-s</span> dan Kapan <span className="text-blue-400">-es</span>?
              </h2>

              <div className="space-y-5 text-base md:text-lg text-zinc-300 leading-relaxed">
                <div className="border-b border-[#232736]/50 pb-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    1. Aturan Penambahan <span className="text-blue-400">-es</span>
                  </h3>
                  <p className="text-sm md:text-base text-zinc-300 mb-2">
                    Wajib ditambahkan <strong className="text-blue-400">-es</strong> jika kata kerja berakhiran bunyi desis atau huruf vokal bulat:
                  </p>
                  <p className="text-base md:text-lg font-bold text-white bg-blue-500/10 py-2 px-3 rounded-lg inline-block">
                    -ch, -sh, -s, -x, -z, -o
                  </p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-zinc-400">
                    <div>watch → <strong className="text-white">watches</strong></div>
                    <div>wash → <strong className="text-white">washes</strong></div>
                    <div>pass → <strong className="text-white">passes</strong></div>
                    <div>fix → <strong className="text-white">fixes</strong></div>
                    <div>go → <strong className="text-white">goes</strong></div>
                    <div>do → <strong className="text-white">does</strong></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    2. Aturan Penambahan <span className="text-blue-400">-s</span>
                  </h3>
                  <p className="text-sm md:text-base text-zinc-300">
                    Untuk sebagian besar kata kerja lainnya di luar akhiran di atas, cukup tambahkan <strong className="text-blue-400">-s</strong> secara langsung:
                  </p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-zinc-400">
                    <div>work → <strong className="text-white">works</strong></div>
                    <div>read → <strong className="text-white">reads</strong></div>
                    <div>run → <strong className="text-white">runs</strong></div>
                    <div>eat → <strong className="text-white">eats</strong></div>
                    <div>live → <strong className="text-white">lives</strong></div>
                    <div>rain → <strong className="text-white">rains</strong></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Interactive 1-Word-per-Slide for -s / -es (Slides 5, 6, 7, 8) */}
          {currentSlide >= 5 && currentSlide <= 8 && activeWordConfig && (
            <motion.div
              key={`slide-pt-word-${activeWordConfig.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-6 flex flex-col items-center justify-start min-h-[420px]"
            >
              {/* Category / Rule Label (Fixed height) */}
              <div className="h-6 flex items-center justify-center text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">
                {activeWordConfig.ruleName}
              </div>

              {/* Transformation Progression Indicator (Fixed height) */}
              <div className="h-8 flex items-center justify-center gap-2 sm:gap-3 mb-6 text-sm font-semibold text-zinc-500">
                <span
                  onClick={() => {
                    if (wordStep > 0) setWordStepDirection(-1);
                    setWordStep(0);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 0 ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[0]}
                </span>
                <span>→</span>
                <span
                  onClick={() => {
                    if (wordStep < 1) setWordStepDirection(1);
                    else if (wordStep > 1) setWordStepDirection(-1);
                    setWordStep(1);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 1 ? 'text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[1]}
                </span>
                <span>→</span>
                <span
                  onClick={() => {
                    if (wordStep < 2) setWordStepDirection(1);
                    setWordStep(2);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 2 ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[2]}
                </span>
              </div>

              {/* Big Word Display - Fixed height container so elements above/below never shift */}
              <div className="h-28 sm:h-32 flex items-baseline justify-center overflow-visible text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-normal pt-2 pb-4">
                {activeWordConfig.steps[wordStep].display}
              </div>

              {/* Explanation text container - Locked to fixed min-height to prevent ANY vertical shift above or below */}
              <div className="w-full max-w-lg mx-auto min-h-[80px] sm:min-h-[88px] h-20 sm:h-22 flex items-start justify-center mt-6 px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${activeWordConfig.id}-${wordStep}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed"
                  >
                    {activeWordConfig.steps[wordStep].desc}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 10: Aturan Khusus Verb Berakhiran -y (Unboxed) */}
          {currentSlide === 9 && (
            <motion.div
              key="slide-pt-y-rule"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Aturan Verb Berakhiran <span className="text-blue-400">-y</span>
              </h2>

              <div className="space-y-6 text-base md:text-lg text-zinc-300 leading-relaxed">
                {/* Rule A: Konsonan + y -> -y = i + es */}
                <div className="border-b border-[#232736]/50 pb-5">
                  <div className="flex items-center gap-2 text-lg font-bold text-white mb-2">
                    <span className="text-blue-400">A.</span>
                    <span>Konsonan + y :</span>
                    <span className="text-blue-400 font-mono">-y = i + es</span>
                  </div>
                  <p className="text-sm md:text-base text-zinc-300 mb-3">
                    Jika sebelum huruf <strong className="text-white">y</strong> adalah <strong className="text-blue-400">huruf konsonan (mati)</strong>, maka huruf <em>y</em> dihapus dan diganti menjadi <strong className="text-emerald-400 font-bold">i + es</strong>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm sm:text-base font-semibold text-zinc-200">
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">stud<span className="text-blue-400 font-bold">y</span></span>
                      <span>→ studi<strong className="text-emerald-400">es</strong></span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">cr<span className="text-blue-400 font-bold">y</span></span>
                      <span>→ cri<strong className="text-emerald-400">es</strong></span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">fl<span className="text-blue-400 font-bold">y</span></span>
                      <span>→ fli<strong className="text-emerald-400">es</strong></span>
                    </div>
                  </div>
                </div>

                {/* Rule B: Vokal + y -> -y + s */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold text-white mb-2">
                    <span className="text-blue-400">B.</span>
                    <span>Vokal + y :</span>
                    <span className="text-blue-400 font-mono">-y + s</span>
                  </div>
                  <p className="text-sm md:text-base text-zinc-300 mb-3">
                    Jika sebelum huruf <strong className="text-white">y</strong> adalah <strong className="text-blue-400">huruf vokal (a, i, u, e, o)</strong>, maka huruf <em>y</em> tidak berubah, cukup langsung ditambah <strong className="text-emerald-400 font-bold">+ s</strong>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm sm:text-base font-semibold text-zinc-200">
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">pl<span className="text-blue-400 font-bold">a</span>y</span>
                      <span>→ play<strong className="text-emerald-400">s</strong></span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">b<span className="text-blue-400 font-bold">u</span>y</span>
                      <span>→ buy<strong className="text-emerald-400">s</strong></span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#232736]/40 pb-1">
                      <span className="text-zinc-400">s<span className="text-blue-400 font-bold">a</span>y</span>
                      <span>→ say<strong className="text-emerald-400">s</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Interactive 1-Word-per-Slide for -y rules (Slides 10, 11, 12, 13) */}
          {currentSlide >= 10 && currentSlide <= 13 && activeWordConfig && (
            <motion.div
              key={`slide-pt-yword-${activeWordConfig.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-6 flex flex-col items-center justify-start min-h-[420px]"
            >
              {/* Category / Rule Label (Fixed height) */}
              <div className="h-6 flex items-center justify-center text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">
                {activeWordConfig.ruleName}
              </div>

              {/* Transformation Progression Indicator (Fixed height) */}
              <div className="h-8 flex items-center justify-center gap-2 sm:gap-3 mb-6 text-sm font-semibold text-zinc-500">
                <span
                  onClick={() => {
                    if (wordStep > 0) setWordStepDirection(-1);
                    setWordStep(0);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 0 ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[0]}
                </span>
                <span>→</span>
                <span
                  onClick={() => {
                    if (wordStep < 1) setWordStepDirection(1);
                    else if (wordStep > 1) setWordStepDirection(-1);
                    setWordStep(1);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 1 ? 'text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[1]}
                </span>
                <span>→</span>
                <span
                  onClick={() => {
                    if (wordStep < 2) setWordStepDirection(1);
                    setWordStep(2);
                  }}
                  className={`cursor-pointer transition-colors ${wordStep === 2 ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {activeWordConfig.sequence[2]}
                </span>
              </div>

              {/* Big Word Display - Fixed height container so elements above/below never shift */}
              <div className="h-28 sm:h-32 flex items-baseline justify-center overflow-visible text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-normal pt-2 pb-4">
                <span className="inline-flex items-baseline overflow-visible">
                  <span>{activeWordConfig.prefix}</span>

                  {/* Trigger char (d / r / a / l) */}
                  <span
                    className={`mx-0.5 transition-colors duration-300 ${
                      wordStep === 1
                        ? 'text-blue-400 font-extrabold underline decoration-blue-400 decoration-4 underline-offset-8'
                        : 'text-white font-extrabold'
                    }`}
                  >
                    {activeWordConfig.targetChar}
                  </span>

                  {/* Rolling slot for y / i (Consonant + y) */}
                  {activeWordConfig.ruleType === 'consonant' ? (
                    <span className="relative inline-flex items-baseline justify-center overflow-hidden h-[1.35em] min-w-[0.55em] align-baseline">
                      <AnimatePresence mode="popLayout" custom={wordStepDirection}>
                        {wordStep === 0 ? (
                          <motion.span
                            key="char-y"
                            custom={wordStepDirection}
                            variants={rollingCharVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="inline-block text-white"
                          >
                            y
                          </motion.span>
                        ) : (
                          <motion.span
                            key="char-i"
                            custom={wordStepDirection}
                            variants={rollingCharVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="inline-block text-emerald-400 font-extrabold"
                          >
                            i
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  ) : (
                    <span className="text-white">y</span>
                  )}

                  {/* Suffix additions (es for consonant+y on step 2, s for vowel+y on step 2) */}
                  <AnimatePresence>
                    {wordStep === 2 && (
                      <motion.span
                        key="suffix-addition"
                        initial={{ opacity: 0, x: -14, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        exit={{ opacity: 0, x: -14, width: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="inline-block text-blue-400 font-extrabold pr-1 pb-1"
                      >
                        {activeWordConfig.suffix}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </div>

              {/* Explanation text container - Locked to fixed min-height to prevent ANY vertical shift above or below */}
              <div className="w-full max-w-lg mx-auto min-h-[80px] sm:min-h-[88px] h-20 sm:h-22 flex items-start justify-center mt-6 px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-y-${activeWordConfig.id}-${wordStep}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed"
                  >
                    {activeWordConfig.desc[wordStep]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 15: Sequential Examples Set 1 (Unboxed) */}
          {currentSlide === 14 && (
            <motion.div
              key="slide-pt-ex1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slideExamples1.map((item, idx) => {
                  const isRevealed = slideExamples1Count > idx;

                  return (
                    <LayoutGroup key={`pt-s15-lg-${idx}`} id={`pt-s15-lg-${idx}`}>
                      <motion.div
                        key={`pt-s15-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlideExamples1Count(Math.max(slideExamples1Count, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Base Verb or Verb + s/es */}
                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200 inline-flex items-baseline">
                            <span>{item.verbBase}</span>
                            <AnimatePresence mode="popLayout">
                              {isRevealed && item.verbWithS && (
                                <motion.span
                                  key={`pt-s15-token-${idx}`}
                                  layout="position"
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.85 }}
                                  transition={wordSpringTransition}
                                  className="text-blue-400 px-0.5 inline-block"
                                >
                                  {item.verbWithS}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.span>

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-300">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-pt14-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="flex items-center text-red-500"
                                aria-label="Belum terisi"
                              >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`correct-pt14-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="flex items-center text-emerald-400"
                                aria-label="Benar"
                              >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </LayoutGroup>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Slide 16: Sequential Examples Set 2 with -es and -ies (Unboxed) */}
          {currentSlide === 15 && (
            <motion.div
              key="slide-pt-ex2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slideExamples2.map((item, idx) => {
                  const isRevealed = slideExamples2Count > idx;

                  return (
                    <LayoutGroup key={`pt-s16-lg-${idx}`} id={`pt-s16-lg-${idx}`}>
                      <motion.div
                        key={`pt-s16-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlideExamples2Count(Math.max(slideExamples2Count, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Base Verb or Verb + s/es */}
                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200 inline-flex items-baseline">
                            {!isRevealed ? (
                              <span>{item.verbBase}</span>
                            ) : item.ruleType === 'ies' ? (
                              <span>studi<strong className="text-blue-400">es</strong></span>
                            ) : (
                              <span>
                                {item.verbBase}
                                {item.verbWithS && (
                                  <AnimatePresence mode="popLayout">
                                    <motion.strong
                                      key={`pt-s16-token-${idx}`}
                                      layout="position"
                                      initial={{ opacity: 0, scale: 0.85 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.85 }}
                                      transition={wordSpringTransition}
                                      className="text-blue-400 px-0.5 inline-block"
                                    >
                                      {item.verbWithS}
                                    </motion.strong>
                                  </AnimatePresence>
                                )}
                              </span>
                            )}
                          </motion.span>

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-300">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-pt15-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="flex items-center text-red-500"
                                aria-label="Belum terisi"
                              >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`correct-pt15-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="flex items-center text-emerald-400"
                                aria-label="Benar"
                              >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </LayoutGroup>
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
            disabled={currentSlide === 0 && slide4Step === 0 && wordStep === 0}
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
          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                  if (idx !== 3) setSlide4Step(0);
                  setWordStep(0);
                  setWordStepDirection(1);
                  if (idx !== 14) setSlideExamples1Count(0);
                  if (idx !== 15) setSlideExamples2Count(0);
                }}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-300 border-0 cursor-pointer
                  ${idx === currentSlide ? 'w-5 bg-blue-600' : 'w-1.5 bg-[#232736] hover:bg-zinc-600'}
                `}
              />
            ))}
          </div>

          {/* Next / Finish Button (Icon only) */}
          {currentSlide === 15 && slideExamples2Count >= slideExamples2.length ? (
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

export default PresentTenseLesson;

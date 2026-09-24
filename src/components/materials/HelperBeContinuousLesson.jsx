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

export const HelperBeContinuousLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [exampleStep, setExampleStep] = useState(0); // 0 to 3 for slide 3 interactive steps
  const [slide4RevealedCount, setSlide4RevealedCount] = useState(0); // 0 to 7 sequential reveals for slide 4
  const [slide5RevealedCount, setSlide5RevealedCount] = useState(0); // 0 to 7 sequential reveals for slide 5

  const totalSlides = 5;

  // Slide 4 Examples: V-ing sentences with Be sequential reveal
  const slide4Examples = [
    { subject: 'I', be: 'am', verbIng: 'studying', complement: 'English' },
    { subject: 'You', be: 'are', verbIng: 'reading', complement: 'a book' },
    { subject: 'They', be: 'are', verbIng: 'playing', complement: 'football' },
    { subject: 'We', be: 'are', verbIng: 'learning', complement: 'grammar' },
    { subject: 'He', be: 'is', verbIng: 'eating', complement: 'lunch' },
    { subject: 'She', be: 'is', verbIng: 'cooking', complement: 'dinner' },
    { subject: 'Dika & Citra', be: 'are', verbIng: 'working', complement: 'together' },
  ];

  // Slide 5 Examples: Another set of V-ing sentences with Be sequential reveal
  const slide5Examples = [
    { subject: 'I', be: 'am', verbIng: 'writing', complement: 'a message' },
    { subject: 'You', be: 'are', verbIng: 'listening', complement: 'to music' },
    { subject: 'They', be: 'are', verbIng: 'waiting', complement: 'for the bus' },
    { subject: 'We', be: 'are', verbIng: 'watching', complement: 'a movie' },
    { subject: 'Rian', be: 'is', verbIng: 'drinking', complement: 'coffee' },
    { subject: 'Maya', be: 'is', verbIng: 'driving', complement: 'a car' },
    { subject: 'Rian & Maya', be: 'are', verbIng: 'cleaning', complement: 'the room' },
  ];

  const goToNext = useCallback(() => {
    // Slide 3 (index 2) - Multi-step interactive experiment (Steps 0, 1, 2, 3, 4)
    if (currentSlide === 2) {
      if (exampleStep < 4) {
        setExampleStep((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(3);
      setSlide4RevealedCount(0);
      return;
    }

    // Slide 4 (index 3) - Sequential reveal 1 by 1
    if (currentSlide === 3) {
      if (slide4RevealedCount < slide4Examples.length) {
        setSlide4RevealedCount((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5RevealedCount(0);
      return;
    }

    // Slide 5 (index 4) - Sequential reveal 1 by 1
    if (currentSlide === 4) {
      if (slide5RevealedCount < slide5Examples.length) {
        setSlide5RevealedCount((prev) => prev + 1);
        return;
      }
      if (onBack) onBack();
      return;
    }

    // Slides 0, 1
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, exampleStep, slide4RevealedCount, slide5RevealedCount, slide4Examples.length, slide5Examples.length, totalSlides, onBack]);

  const goToPrev = useCallback(() => {
    // Slide 5 (index 4)
    if (currentSlide === 4) {
      if (slide5RevealedCount > 0) {
        setSlide5RevealedCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4RevealedCount(slide4Examples.length);
      return;
    }

    // Slide 4 (index 3)
    if (currentSlide === 3) {
      if (slide4RevealedCount > 0) {
        setSlide4RevealedCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(2);
      setExampleStep(4);
      return;
    }

    // Slide 3 (index 2)
    if (currentSlide === 2) {
      if (exampleStep > 0) {
        setExampleStep((prev) => prev - 1);
        return;
      }
    }

    // Other slides
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, exampleStep, slide4RevealedCount, slide5RevealedCount, slide4Examples.length]);

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
                • Langkah {exampleStep + 1} dari 5
              </span>
            )}
            {currentSlide === 3 && (
              <span className="text-zinc-500">
                • Terungkap {slide4RevealedCount} dari {slide4Examples.length}
              </span>
            )}
            {currentSlide === 4 && (
              <span className="text-zinc-500">
                • Terungkap {slide5RevealedCount} dari {slide5Examples.length}
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
              key="slide-c-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center flex flex-col items-center justify-center py-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Helper <span className="text-blue-500">BE</span> di Continuous
              </h1>

              <div className="mt-6 text-xl sm:text-2xl font-bold text-zinc-300">
                BE + <span className="text-blue-400">V-ing</span>
              </div>

              <p className="mt-8 text-xs text-zinc-400 font-medium">
                Gunakan tombol panah keyboard (← / →) atau tombol di bawah untuk navigasi
              </p>
            </motion.div>
          )}

          {/* Slide 2: Core Concept (Unboxed) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-c-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Fungsi BE pada Kalimat Sedang Berlangsung
              </h2>

              <div className="space-y-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                <p>
                  Kata kerja berakhiran <strong className="text-blue-400 font-semibold">-ing</strong> (seperti <em>eating, studying, walking</em>) menunjukkan aktivitas yang <strong className="text-white">sedang terjadi</strong>.
                </p>
                <p>
                  Namun, dalam tata bahasa Inggris, bentuk <strong className="text-white">V-ing tidak dapat berdiri sendiri sebagai kata kerja utama predikat kalimat</strong> tanpa didampingi kata kerja bantu.
                </p>
                <p>
                  Oleh karena itu, <strong className="text-blue-400 font-semibold">Helper BE</strong> (<span className="text-white">am, is, are</span>) mutlak dibutuhkan sebelum V-ing untuk membentuk tenses continuous yang sah.
                </p>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Multi-Step Interactive Experiment (I study -> I studying -> I am studying) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-c-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4 flex flex-col items-center justify-center min-h-[340px]"
            >
              {/* Indonesian Text: "Aku sedang belajar" - Glides up and scales down when English text appears */}
              <motion.div
                initial={false}
                animate={{
                  y: exampleStep >= 1 ? -14 : 0,
                  scale: exampleStep >= 1 ? 0.68 : 1,
                  opacity: exampleStep >= 1 ? 0.7 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-300 tracking-tight"
              >
                Aku sedang belajar
              </motion.div>

              {/* English Sentence Interactive Progression */}
              {exampleStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 flex flex-col items-center justify-center py-2"
                >
                  <LayoutGroup id="be-cont-slide3-group">
                    <div className="relative isolate flex items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-relaxed">
                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">I</motion.span>

                      {/* "am" inserts dynamically on step 3 with smooth spring animation */}
                      <AnimatePresence mode="popLayout">
                        {exampleStep >= 3 && (
                          <motion.span
                            key="be-cont-s3-am"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-blue-400 inline-block px-1"
                          >
                            am
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Verb part: "study" + "-ing" */}
                      <motion.span layout="position" transition={wordSpringTransition} className="inline-flex items-baseline text-white">
                        <span>study</span>

                        {/* "-ing" appears on step 2 */}
                        <AnimatePresence mode="popLayout">
                          {exampleStep >= 2 && (
                            <motion.span
                              key="ing-suffix"
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
                              className="inline-block pr-1.5 pb-1"
                            >
                              ing
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>

                      {/* Pure Symbols: ❌ on step 1 & 2, ✅ on step 3 & 4 */}
                      <motion.div layout="position" transition={wordSpringTransition} className="ml-2 flex items-center">
                        <AnimatePresence mode="wait">
                          {exampleStep < 3 ? (
                            <motion.div
                              key={`cross-${exampleStep}`}
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

              {/* Step 4: Clear Explanation (Locked min-height to prevent layout shift) */}
              <div className="min-h-[100px] sm:min-h-[110px]">
                {exampleStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 text-sm md:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed text-left border-t border-[#232736]/60 pt-4"
                  >
                    <p className="mb-2">
                      <strong className="text-red-400">I studying</strong> kurang tepat karena kata kerja berakhiran <em className="text-white">-ing</em> tidak dapat berdiri sebagai predikat tunggal tanpa kata kerja bantu.
                    </p>
                    <p>
                      Dengan menambahkan Helper BE <strong className="text-blue-400">am</strong> sebelum Verb-ing, terbentuklah struktur continuous yang sempurna: <strong className="text-emerald-400 font-semibold">I am studying</strong>.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Slide 4: Sequential Examples Set 1 (Unboxed) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-c-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slide4Examples.map((item, idx) => {
                  const isRevealed = slide4RevealedCount > idx;

                  return (
                    <LayoutGroup key={`be-c4-lg-${idx}`} id={`be-c4-lg-${idx}`}>
                      <motion.div
                        key={`be-c4-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlide4RevealedCount(Math.max(slide4RevealedCount, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Animated Helper BE insertion */}
                          <AnimatePresence mode="popLayout">
                            {isRevealed && (
                              <motion.span
                                key={`be-c4-token-${idx}`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-blue-400 px-1 inline-block"
                              >
                                {item.be}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-300">{item.verbIng}</motion.span>
                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-c4-${idx}`}
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
                                key={`correct-c4-${idx}`}
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

          {/* Slide 5: Sequential Examples Set 2 (Unboxed) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-c-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slide5Examples.map((item, idx) => {
                  const isRevealed = slide5RevealedCount > idx;

                  return (
                    <LayoutGroup key={`be-c5-lg-${idx}`} id={`be-c5-lg-${idx}`}>
                      <motion.div
                        key={`be-c5-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlide5RevealedCount(Math.max(slide5RevealedCount, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Animated Helper BE insertion */}
                          <AnimatePresence mode="popLayout">
                            {isRevealed && (
                              <motion.span
                                key={`be-c5-token-${idx}`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-blue-400 px-1 inline-block"
                              >
                                {item.be}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-300">{item.verbIng}</motion.span>
                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-c5-${idx}`}
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
                                key={`correct-c5-${idx}`}
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

      {/* 3. Bottom Sticky Navigation Footer */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          {/* Previous Button (Icon only) */}
          <Button
            variant="secondary"
            onClick={goToPrev}
            disabled={currentSlide === 0}
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
                  if (idx !== 2) setExampleStep(0);
                  if (idx !== 3) setSlide4RevealedCount(0);
                  if (idx !== 4) setSlide5RevealedCount(0);
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
          {currentSlide === 4 && slide5RevealedCount >= slide5Examples.length ? (
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

export default HelperBeContinuousLesson;

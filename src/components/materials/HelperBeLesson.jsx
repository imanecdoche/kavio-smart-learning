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

export const HelperBeLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [exampleStep, setExampleStep] = useState(0); // 0 to 3 for slide 4 steps
  const [slide5Step, setSlide5Step] = useState(0); // 0 to 1 for slide 5 steps
  const [slide6RevealedCount, setSlide6RevealedCount] = useState(0); // 0 to 7 sequential reveals for slide 6
  const [slide7RevealedCount, setSlide7RevealedCount] = useState(0); // 0 to 7 sequential reveals for slide 7

  const totalSlides = 7;

  // 7 Sentences for Slide 6
  const slide6Examples = [
    { subject: 'You', be: 'are', complement: 'tall' },
    { subject: 'They', be: 'are', complement: 'here' },
    { subject: 'He', be: 'is', complement: 'a pilot' },
    { subject: 'She', be: 'is', complement: 'in the class' },
    { subject: 'Dika', be: 'is', complement: 'a student' },
    { subject: 'Citra', be: 'is', complement: 'a student' },
    { subject: 'Dika & Citra', be: 'are', complement: 'students' },
  ];

  // 7 Different Sentences for Slide 7 (Duplicated layout with new examples)
  const slide7Examples = [
    { subject: 'I', be: 'am', complement: 'ready' },
    { subject: 'We', be: 'are', complement: 'at home' },
    { subject: 'It', be: 'is', complement: 'hot today' },
    { subject: 'Rian', be: 'is', complement: 'a doctor' },
    { subject: 'Maya', be: 'is', complement: 'friendly' },
    { subject: 'The books', be: 'are', complement: 'on the table' },
    { subject: 'Rian & Maya', be: 'are', complement: 'happy' },
  ];

  const goToNext = useCallback(() => {
    // Slide 4 (index 3)
    if (currentSlide === 3) {
      if (exampleStep < 3) {
        setExampleStep((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5Step(0);
      return;
    }

    // Slide 5 (index 4)
    if (currentSlide === 4) {
      if (slide5Step < 1) {
        setSlide5Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(5);
      setSlide6RevealedCount(0);
      return;
    }

    // Slide 6 (index 5) - Reveal one by one sequentially
    if (currentSlide === 5) {
      if (slide6RevealedCount < slide6Examples.length) {
        setSlide6RevealedCount((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(6);
      setSlide7RevealedCount(0);
      return;
    }

    // Slide 7 (index 6) - Reveal one by one sequentially
    if (currentSlide === 6) {
      if (slide7RevealedCount < slide7Examples.length) {
        setSlide7RevealedCount((prev) => prev + 1);
        return;
      }
      // Finished all examples and all slides -> return to curriculum
      if (onBack) onBack();
      return;
    }

    // Slides 0, 1, 2
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, exampleStep, slide5Step, slide6RevealedCount, slide7RevealedCount, slide6Examples.length, slide7Examples.length, totalSlides, onBack]);

  const goToPrev = useCallback(() => {
    // Slide 7 (index 6)
    if (currentSlide === 6) {
      if (slide7RevealedCount > 0) {
        setSlide7RevealedCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(5);
      setSlide6RevealedCount(slide6Examples.length);
      return;
    }

    // Slide 6 (index 5)
    if (currentSlide === 5) {
      if (slide6RevealedCount > 0) {
        setSlide6RevealedCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(4);
      setSlide5Step(1);
      return;
    }

    // Slide 5 (index 4)
    if (currentSlide === 4) {
      if (slide5Step > 0) {
        setSlide5Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setExampleStep(3);
      return;
    }

    // Slide 4 (index 3)
    if (currentSlide === 3) {
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
  }, [currentSlide, exampleStep, slide5Step, slide6RevealedCount, slide7RevealedCount, slide6Examples.length]);

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
        duration: 0.24,
        ease: [0.16, 1, 0.3, 1],
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
            {currentSlide === 3 && (
              <span className="text-zinc-500">
                • Langkah {exampleStep + 1} dari 4
              </span>
            )}
            {currentSlide === 4 && (
              <span className="text-zinc-500">
                • Langkah {slide5Step + 1} dari 2
              </span>
            )}
            {currentSlide === 5 && (
              <span className="text-zinc-500">
                • Terungkap {slide6RevealedCount} dari {slide6Examples.length}
              </span>
            )}
            {currentSlide === 6 && (
              <span className="text-zinc-500">
                • Terungkap {slide7RevealedCount} dari {slide7Examples.length}
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
              key="slide-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center flex flex-col items-center justify-center py-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Apa itu Helper <span className="text-blue-500">BE</span>?
              </h1>

              <p className="mt-8 text-xs text-zinc-400 font-medium">
                Gunakan tombol panah keyboard (← / →) atau tombol di bawah untuk navigasi
              </p>
            </motion.div>
          )}

          {/* Slide 2: Definition (Unboxed) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
                Hakikat Helper BE
              </h2>

              <div className="space-y-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                <p>
                  Dalam tata bahasa Inggris, <strong className="text-white">setiap kalimat wajib memiliki kata kerja (verb)</strong> agar maknanya lengkap dan dapat berdiri sendiri.
                </p>
                <p>
                  Namun, ketika kita ingin mengungkapkan <span className="text-blue-400 font-medium">kondisi</span> (kata sifat), <span className="text-blue-400 font-medium">identitas</span> (kata benda), atau <span className="text-blue-400 font-medium">keberadaan</span> (keterangan tempat) tanpa adanya aktivitas fisik, kalimat tersebut tidak memiliki kata kerja aksi.
                </p>
                <p>
                  Di sinilah <strong className="text-white">Helper BE</strong> (<span className="text-blue-400 font-semibold">am, is, are</span>) hadir. BE bertindak sebagai jembatan penghubung yang mengikat subjek dengan pelengkapnya, sekaligus memenuhi syarat mutlak sebuah kalimat bahasa Inggris.
                </p>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Functions (Unboxed) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-left py-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
                Fungsi Utama Helper BE
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    1. Menghubungkan Kata Sifat (Adjective)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Menjelaskan kondisi, emosi, atau sifat dari subjek yang sedang dibahas.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    2. Menghubungkan Kata Benda (Noun)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Menegaskan identitas, status, profesi, atau peranan subjek.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    3. Menghubungkan Lokasi (Adverb)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Menyatakan letak keberadaan atau posisi fisik subjek di suatu tempat.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    4. Membentuk Continuous Tense
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Mendampingi kata kerja berakhiran -ing untuk tindakan yang sedang berlangsung.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Interactive Step-by-Step Example Reveal (Unboxed) */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-6"
            >
              {/* Step 0: Indonesian Sentence - Glides up and scales down when English appears */}
              <motion.div
                animate={{
                  y: exampleStep >= 1 ? -14 : 0,
                  scale: exampleStep >= 1 ? 0.68 : 1,
                  opacity: exampleStep >= 1 ? 0.7 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="origin-center py-2"
              >
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                  Aku pintar
                </h3>
              </motion.div>

              {/* Step 1 & 2: English sentence with incorrect / corrected state */}
              {exampleStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="py-4 flex flex-col items-center justify-center"
                >
                  <LayoutGroup id="be-slide4-group">
                    <div className="relative isolate flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">I</motion.span>

                      {/* Animated Helper BE 'am' insertion */}
                      <AnimatePresence mode="popLayout">
                        {exampleStep >= 2 && (
                          <motion.span
                            key="be-s4-am"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-blue-400 px-2 inline-block"
                          >
                            am
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <motion.span layout="position" transition={wordSpringTransition} className="text-white">smart</motion.span>

                      {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                      <motion.div layout="position" transition={wordSpringTransition} className="ml-2 flex items-center">
                        <AnimatePresence mode="wait">
                          {exampleStep === 1 ? (
                            <motion.div
                              key="wrong-mark"
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={wordSpringTransition}
                              className="flex items-center text-red-500"
                              aria-label="Salah"
                            >
                              <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="correct-mark"
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={wordSpringTransition}
                              className="flex items-center text-emerald-400"
                              aria-label="Benar"
                            >
                              <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
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

              {/* Step 3: Explanation appears below (Unboxed, locked min-height) */}
              <div className="min-h-[140px] sm:min-h-[150px]">
                {exampleStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-6 text-left space-y-3 max-w-2xl mx-auto"
                  >
                    <h4 className="text-sm font-semibold text-white">
                      Mengapa "I smart" salah, dan "I am smart" benar?
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      1. Di dalam bahasa Indonesia, kita terbiasa langsung menghubungkan subjek dengan kata sifat: <strong className="text-white">"Aku pintar"</strong> tanpa membutuhkan kata kerja tambahan.
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      2. Namun dalam tata bahasa Inggris, sebuah kalimat <strong className="text-white">wajib memiliki kata kerja (Verb)</strong> agar sah secara struktural.
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      3. Kata <span className="text-blue-400 font-medium">smart</span> (pintar) adalah <strong className="text-white">kata sifat (Adjective)</strong>, bukan kata kerja aksi. Oleh karena itu, Helper BE <strong className="text-blue-400">"am"</strong> wajib disisipkan di tengah untuk menjembatani subjek <strong className="text-white">"I"</strong> dengan sifat tersebut sehingga menjadi <strong className="text-emerald-400">"I am smart"</strong>.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Slide 5: Subject + BE Formula & Base Form Explanation (Unboxed) */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">
                Subject + <span className="text-blue-500">BE</span>
              </h2>

              {/* Step 0: Subject + BE Pairs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3.5 max-w-xl mx-auto text-left py-2">
                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">I</span>
                  <span className="text-blue-400">+ am</span>
                </div>

                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">You</span>
                  <span className="text-blue-400">+ are</span>
                </div>

                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">They</span>
                  <span className="text-blue-400">+ are</span>
                </div>

                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">We</span>
                  <span className="text-blue-400">+ are</span>
                </div>

                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">
                    He / She / It <span className="text-xs font-normal text-zinc-400 block sm:inline sm:ml-1">(Tunggal)</span>
                  </span>
                  <span className="text-blue-400">+ is</span>
                </div>

                <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-white border-b border-[#232736]/40 pb-2">
                  <span className="text-zinc-200">Subjek Jamak</span>
                  <span className="text-blue-400">+ are</span>
                </div>
              </div>

              {/* Step 1: Base Form Explanation */}
              {slide5Step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-8 text-left max-w-2xl mx-auto space-y-2.5"
                >
                  <h4 className="text-sm font-semibold text-white">
                    Hakikat Perubahan Bentuk BE
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <strong className="text-blue-400">BE</strong> adalah bentuk dasar (<em className="text-white">base form</em>) dari kata kerja bantu ini.
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Dalam kalimat, wujud <strong className="text-white">BE</strong> akan <strong className="text-white">berubah otomatis mengikuti subjeknya</strong>: menjadi <strong className="text-blue-400">am</strong> untuk subjek <em>I</em>, menjadi <strong className="text-blue-400">is</strong> untuk subjek <em>tunggal (He, She, It)</em>, dan menjadi <strong className="text-blue-400">are</strong> untuk subjek <em>You / jamak (They, We, Jamak)</em>.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Slide 6: Additional Examples with Sequential One-by-One Reveal (Unboxed) */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slide6Examples.map((item, idx) => {
                  const isRevealed = slide6RevealedCount > idx;

                  return (
                    <LayoutGroup key={`be-s6-lg-${idx}`} id={`be-s6-lg-${idx}`}>
                      <motion.div
                        key={`be-s6-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlide6RevealedCount(Math.max(slide6RevealedCount, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Animated Helper BE insertion (One by one) */}
                          <AnimatePresence mode="popLayout">
                            {isRevealed && (
                              <motion.span
                                key={`be-s6-token-${idx}`}
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

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-${idx}`}
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
                                key={`correct-${idx}`}
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
          {/* Slide 7: Additional Examples 2 with Sequential One-by-One Reveal (Unboxed) */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-7"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {slide7Examples.map((item, idx) => {
                  const isRevealed = slide7RevealedCount > idx;

                  return (
                    <LayoutGroup key={`be-s7-lg-${idx}`} id={`be-s7-lg-${idx}`}>
                      <motion.div
                        key={`be-s7-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => setSlide7RevealedCount(Math.max(slide7RevealedCount, idx + 1))}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 cursor-pointer hover:border-zinc-700/60 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">{item.subject}</motion.span>

                          {/* Animated Helper BE insertion (One by one) */}
                          <AnimatePresence mode="popLayout">
                            {isRevealed && (
                              <motion.span
                                key={`be-s7-token-${idx}`}
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

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">{item.complement}</motion.span>
                        </div>

                        {/* Status Indicator (Pure icon: cross vs checkmark, NO text label) */}
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {!isRevealed ? (
                              <motion.div
                                key={`wrong-s7-${idx}`}
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
                                key={`correct-s7-${idx}`}
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
                  if (idx !== 3) setExampleStep(0);
                  if (idx !== 4) setSlide5Step(0);
                  if (idx !== 5) setSlide6RevealedCount(0);
                  if (idx !== 6) setSlide7RevealedCount(0);
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
          {currentSlide === 6 && slide7RevealedCount >= slide7Examples.length ? (
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

export default HelperBeLesson;

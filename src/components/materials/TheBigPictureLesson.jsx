import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LogOut } from 'lucide-react';

const wordSpringTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const TheBigPictureLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Slide 4: 5 timeline sentence transformation states
  // 0: Sekarang (Present) -> I study English
  // 1: Lampau (+) -> I studied English yesterday
  // 2: Lampau (-) -> I did not study English yesterday
  // 3: Masa Depan (+) -> I will study English tomorrow
  // 4: Masa Depan (?) -> Will you study English tomorrow ?
  const [slide4Step, setSlide4Step] = useState(0);

  // Slide 5: Quiz state
  // currentQuizIdx: 0, 1, 2
  // selectedOption: null or option index
  // quizFinished: boolean
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);

  const totalSlides = 5;

  const quizQuestions = [
    {
      id: 'q1',
      sentence: 'Citra [ ... ] at home yesterday.',
      signal: 'yesterday',
      type: 'Lampau (Nominal)',
      options: [
        { label: 'is', correct: false },
        { label: 'was', correct: true },
        { label: 'will be', correct: false },
      ],
      explanation: 'Karena ada "yesterday" (kemarin) dan Citra adalah subjek tunggal, helper lampau nominal yang tepat adalah WAS.',
    },
    {
      id: 'q2',
      sentence: 'They [ ... ] come to my house tomorrow.',
      signal: 'tomorrow',
      type: 'Masa Depan (Future)',
      options: [
        { label: 'did', correct: false },
        { label: 'do', correct: false },
        { label: 'will', correct: true },
      ],
      explanation: 'Karena ada "tomorrow" (besok), seluruh subjek wajib menggunakan helper masa depan WILL.',
    },
    {
      id: 'q3',
      sentence: 'I [ ... ] drink coffee every morning.',
      signal: 'every morning',
      type: 'Rutinitas (Present Verbal Negatif)',
      options: [
        { label: 'do not', correct: true },
        { label: 'did not', correct: false },
        { label: 'will not', correct: false },
      ],
      explanation: 'Karena "every morning" adalah rutinitas saat ini (Present Tense) dengan subjek I, helper negatifnya adalah DO NOT.',
    },
  ];

  const handleNext = useCallback(() => {
    // Slide 1 to 3: direct advance
    if (currentSlide < 3) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      return;
    }

    // Slide 4: 5 steps
    if (currentSlide === 3) {
      if (slide4Step < 4) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setQuizIdx(0);
      setSelectedOpt(null);
      return;
    }

    // Slide 5: Quiz questions
    if (currentSlide === 4) {
      if (selectedOpt === null) return; // Wait until student picks an option
      if (quizIdx < quizQuestions.length - 1) {
        setQuizIdx((prev) => prev + 1);
        setSelectedOpt(null);
        return;
      }
      onBack?.();
      return;
    }

    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, slide4Step, quizIdx, selectedOpt, quizQuestions.length, onBack]);

  const handlePrev = useCallback(() => {
    // Slide 4
    if (currentSlide === 3) {
      if (slide4Step > 0) {
        setSlide4Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(2);
      return;
    }

    // Slide 5
    if (currentSlide === 4) {
      if (quizIdx > 0) {
        setQuizIdx((prev) => prev - 1);
        setSelectedOpt(null);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4Step(4);
      return;
    }

    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    } else {
      onBack?.();
    }
  }, [currentSlide, slide4Step, quizIdx, onBack]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onBack]);

  const currentQ = quizQuestions[quizIdx];

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
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col justify-center my-auto"
          >
            {/* ========================================================================= */}
            {/* SLIDE 1: PETA BESAR 3 WAKTU (PRESENT, PAST, FUTURE)                       */}
            {/* ========================================================================= */}
            {currentSlide === 0 && (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                    Peta Besar 3 Waktu Bahasa Inggris
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
                    Kunci seluruh bahasa Inggris di level A1 terbagi ke dalam 3 dimensi waktu yang teratur.
                  </p>
                </div>

                {/* 3 Time Dimensions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-3xl text-left">
                  {/* Past */}
                  <div className="bg-[#11131c] border border-amber-800/40 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">1. Masa Lalu (Past)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Sudah selesai</span>
                    </div>
                    <div className="text-xs text-zinc-300 space-y-1 font-mono">
                      <div>• Kata Kerja: <strong className="text-amber-300">Verb 2</strong></div>
                      <div>• Helper Verbal: <strong className="text-amber-400">did</strong></div>
                      <div>• Helper Nominal: <strong className="text-amber-400">was / were</strong></div>
                    </div>
                    <div className="text-[11px] text-zinc-400 bg-[#181b28] p-2 rounded-lg">
                      Time signal: *yesterday, last night, 2 days ago*.
                    </div>
                  </div>

                  {/* Present */}
                  <div className="bg-[#11131c] border border-blue-800/40 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase">2. Sekarang (Present)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Rutinitas/Fakta</span>
                    </div>
                    <div className="text-xs text-zinc-300 space-y-1 font-mono">
                      <div>• Kata Kerja: <strong className="text-blue-300">Verb 1 (s/es)</strong></div>
                      <div>• Helper Verbal: <strong className="text-blue-400">do / does</strong></div>
                      <div>• Helper Nominal: <strong className="text-blue-400">am, is, are</strong></div>
                    </div>
                    <div className="text-[11px] text-zinc-400 bg-[#181b28] p-2 rounded-lg">
                      Time signal: *every day, usually, always*.
                    </div>
                  </div>

                  {/* Future */}
                  <div className="bg-[#11131c] border border-emerald-800/40 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase">3. Masa Depan (Future)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Akan terjadi</span>
                    </div>
                    <div className="text-xs text-zinc-300 space-y-1 font-mono">
                      <div>• Rumus: <strong className="text-emerald-300">will + Verb 1</strong></div>
                      <div>• Helper Modal: <strong className="text-emerald-400">will</strong></div>
                      <div>• Semua Subjek: <strong className="text-emerald-400">100% sama</strong></div>
                    </div>
                    <div className="text-[11px] text-zinc-400 bg-[#181b28] p-2 rounded-lg">
                      Time signal: *tomorrow, tonight, next week*.
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  Tekan [Lanjut] atau [Space] untuk melihat Matriks 4 Keluarga Helper
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 2: MATRIKS 4 KELUARGA HELPER (FONDASI AWAL A1)                      */}
            {/* ========================================================================= */}
            {currentSlide === 1 && (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                    Matriks 4 Keluarga Helper
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
                    Kembali ke slide fondasi awal: inilah 4 pilar helper yang menyusun tata bahasa Inggris.
                  </p>
                </div>

                {/* 4 Helper Families Grid (2x2) */}
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-2xl text-left">
                  {/* Family BE */}
                  <div className="bg-[#11131c] border border-[#202436] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400">Keluarga BE</span>
                      <span className="text-[10px] text-zinc-500">Nominal & Continuous</span>
                    </div>
                    <div className="text-xs font-mono text-white">
                      Sekarang: <strong className="text-blue-300">am, is, are</strong>
                    </div>
                    <div className="text-xs font-mono text-white">
                      Lampau: <strong className="text-amber-400">was, were</strong>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Menghubungkan sifat/tempat dan menemani Verb-ing.
                    </div>
                  </div>

                  {/* Family DO */}
                  <div className="bg-[#11131c] border border-[#202436] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">Keluarga DO</span>
                      <span className="text-[10px] text-zinc-500">Kalimat Verbal</span>
                    </div>
                    <div className="text-xs font-mono text-white">
                      Sekarang: <strong className="text-amber-300">do, does</strong>
                    </div>
                    <div className="text-xs font-mono text-white">
                      Lampau: <strong className="text-amber-400">did</strong>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Membantu kata kerja aksi saat membentuk (-) dan (?).
                    </div>
                  </div>

                  {/* Family MODALS */}
                  <div className="bg-[#11131c] border border-[#202436] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">Keluarga MODALS</span>
                      <span className="text-[10px] text-zinc-500">Rencana/Niat</span>
                    </div>
                    <div className="text-xs font-mono text-white">
                      Masa Depan: <strong className="text-emerald-300">will</strong>
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      Aturan: <strong className="text-white">+ Verb 1 murni</strong>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Berlaku universal untuk semua subjek tanpa terkecuali.
                    </div>
                  </div>

                  {/* Family HAVE */}
                  <div className="bg-[#11131c] border border-purple-800/30 rounded-xl p-3 space-y-1.5 opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-400">Keluarga HAVE</span>
                      <span className="text-[10px] text-purple-400/80 font-mono">Level A2/B1</span>
                    </div>
                    <div className="text-xs font-mono text-zinc-300">
                      Bentuk: <strong className="text-purple-300">have, has</strong>
                    </div>
                    <div className="text-[10px] text-purple-300 bg-purple-950/40 p-1.5 rounded border border-purple-800/40">
                      🔒 Akan kita buka di level berikutnya: <strong>Perfect Tense!</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  Tekan [Lanjut] atau [Space] untuk melihat 2 Rumus Universal
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 3: KONSEP EMAS UNIVERSAL (2 ATURAN MUTLAK)                          */}
            {/* ========================================================================= */}
            {currentSlide === 2 && (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                    Konsep Emas Universal: Cuma Ada 2 Rumus!
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
                    Kunci seluruh bahasa Inggris tidak pernah berubah. Aturannya selalu identik dari awal!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                  {/* Universal Negative Rule */}
                  <div className="bg-[#11131c] border border-red-800/40 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-400 uppercase">1. Bikin Negatif (-)</span>
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold border-0">
                        −
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-200 font-semibold leading-relaxed">
                      "Cari Helper-nya, lalu tempelkan kata <span className="font-mono text-red-400 font-bold">NOT</span> tepat di belakang helper!"
                    </div>
                    <div className="bg-[#181b28] p-2.5 rounded-lg text-xs font-mono text-zinc-300 space-y-1">
                      <div>• BE: is <span className="text-red-400">not</span> / was <span className="text-red-400">not</span></div>
                      <div>• DO: do <span className="text-red-400">not</span> / did <span className="text-red-400">not</span></div>
                      <div>• MODAL: will <span className="text-red-400">not</span> (won't)</div>
                    </div>
                  </div>

                  {/* Universal Question Rule */}
                  <div className="bg-[#11131c] border border-amber-800/40 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">2. Bikin Tanya (?)</span>
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black border-0">
                        ?
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-200 font-semibold leading-relaxed">
                      "Cari Helper-nya, lalu tukar posisinya ke <span className="font-mono text-amber-400 font-bold">PALING DEPAN</span> sebelum Subjek!"
                    </div>
                    <div className="bg-[#181b28] p-2.5 rounded-lg text-xs font-mono text-zinc-300 space-y-1">
                      <div>• BE: <span className="text-amber-400">Is</span> he...? / <span className="text-amber-400">Was</span> he...?</div>
                      <div>• DO: <span className="text-amber-400">Do</span> you...? / <span className="text-amber-400">Did</span> you...?</div>
                      <div>• MODAL: <span className="text-amber-400">Will</span> you...?</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  Tekan [Lanjut] atau [Space] untuk melihat animasi perubahan 1 kalimat lintas waktu
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 4: TRANSFORMASI INTERAKTIF LINTAS WAKTU (1 IDE, 3 WAKTU)            */}
            {/* ========================================================================= */}
            {currentSlide === 3 && (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                    Satu Ide Kalimat, Tiga Dimensi Waktu
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
                    Lihat bagaimana ide dasar <em>"Saya belajar bahasa Inggris"</em> berpindah waktu secara luwes.
                  </p>
                </div>

                {/* 5 Timeline State Selectors */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                  {[
                    { label: '1. Sekarang (Present)', s: 0 },
                    { label: '2. Lampau (+)', s: 1 },
                    { label: '3. Lampau (-)', s: 2 },
                    { label: '4. Depan (+)', s: 3 },
                    { label: '5. Depan (?)', s: 4 },
                  ].map((item) => (
                    <button
                      key={item.s}
                      type="button"
                      onClick={() => setSlide4Step(item.s)}
                      className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors border-0 cursor-pointer ${
                        slide4Step === item.s
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-[#181a24] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Stage Box with locked height */}
                <div className="w-full max-w-2xl bg-[#11131c] border border-[#202436] rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="h-20 flex items-center justify-center bg-[#181b28] border border-[#252a3e] rounded-xl px-4 overflow-hidden relative isolate">
                    <LayoutGroup id="cross-time-stage">
                      {slide4Step === 0 && (
                        // Present: I study English
                        <motion.div
                          key="ct-0"
                          layout
                          transition={wordSpringTransition}
                          className="flex items-center gap-2 text-lg sm:text-2xl font-mono font-bold text-white"
                        >
                          <motion.span layoutId="ct-subj" transition={wordSpringTransition} className="text-zinc-200">
                            I
                          </motion.span>
                          <motion.span layoutId="ct-verb" transition={wordSpringTransition} className="text-blue-400">
                            study
                          </motion.span>
                          <motion.span layoutId="ct-obj" transition={wordSpringTransition} className="text-zinc-300">
                            English.
                          </motion.span>
                        </motion.div>
                      )}

                      {slide4Step === 1 && (
                        // Past (+): I studied English yesterday
                        <motion.div
                          key="ct-1"
                          layout
                          transition={wordSpringTransition}
                          className="flex items-center gap-2 text-lg sm:text-2xl font-mono font-bold text-white"
                        >
                          <motion.span layoutId="ct-subj" transition={wordSpringTransition} className="text-zinc-200">
                            I
                          </motion.span>
                          <motion.span layoutId="ct-verb" transition={wordSpringTransition} className="text-amber-400">
                            studied
                          </motion.span>
                          <motion.span layoutId="ct-obj" transition={wordSpringTransition} className="text-zinc-300">
                            English
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={wordSpringTransition}
                            className="text-amber-300/80 text-sm sm:text-base font-normal"
                          >
                            yesterday.
                          </motion.span>
                        </motion.div>
                      )}

                      {slide4Step === 2 && (
                        // Past (-): I did not study English yesterday
                        <motion.div
                          key="ct-2"
                          layout
                          transition={wordSpringTransition}
                          className="flex items-center gap-2 text-lg sm:text-2xl font-mono font-bold text-white"
                        >
                          <motion.span layoutId="ct-subj" transition={wordSpringTransition} className="text-zinc-200">
                            I
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={wordSpringTransition}
                            className="text-red-400 font-bold"
                          >
                            did not
                          </motion.span>
                          <motion.span layoutId="ct-verb" transition={wordSpringTransition} className="text-emerald-400">
                            study
                          </motion.span>
                          <motion.span layoutId="ct-obj" transition={wordSpringTransition} className="text-zinc-300">
                            English
                          </motion.span>
                          <span className="text-amber-300/80 text-sm sm:text-base font-normal">yesterday.</span>
                        </motion.div>
                      )}

                      {slide4Step === 3 && (
                        // Future (+): I will study English tomorrow
                        <motion.div
                          key="ct-3"
                          layout
                          transition={wordSpringTransition}
                          className="flex items-center gap-2 text-lg sm:text-2xl font-mono font-bold text-white"
                        >
                          <motion.span layoutId="ct-subj" transition={wordSpringTransition} className="text-zinc-200">
                            I
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={wordSpringTransition}
                            className="text-blue-400 font-bold"
                          >
                            will
                          </motion.span>
                          <motion.span layoutId="ct-verb" transition={wordSpringTransition} className="text-emerald-400">
                            study
                          </motion.span>
                          <motion.span layoutId="ct-obj" transition={wordSpringTransition} className="text-zinc-300">
                            English
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={wordSpringTransition}
                            className="text-blue-300/80 text-sm sm:text-base font-normal"
                          >
                            tomorrow.
                          </motion.span>
                        </motion.div>
                      )}

                      {slide4Step === 4 && (
                        // Future (?): Will you study English tomorrow ?
                        <motion.div
                          key="ct-4"
                          layout
                          transition={wordSpringTransition}
                          className="flex items-center gap-2 text-lg sm:text-2xl font-mono font-bold text-white"
                        >
                          <motion.span
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={wordSpringTransition}
                            className="text-amber-400 font-bold"
                          >
                            Will
                          </motion.span>
                          <motion.span layoutId="ct-subj" transition={wordSpringTransition} className="text-zinc-200">
                            you
                          </motion.span>
                          <motion.span layoutId="ct-verb" transition={wordSpringTransition} className="text-emerald-400">
                            study
                          </motion.span>
                          <motion.span layoutId="ct-obj" transition={wordSpringTransition} className="text-zinc-300">
                            English
                          </motion.span>
                          <span className="text-blue-300/80 text-sm sm:text-base font-normal">tomorrow</span>
                          <span className="text-amber-400">?</span>
                        </motion.div>
                      )}
                    </LayoutGroup>
                  </div>

                  <div className="min-h-[46px] bg-[#181b28] border border-[#252a3e] rounded-xl p-2.5 text-xs text-zinc-300 text-left flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 border-0">
                      ★
                    </span>
                    <div>
                      {slide4Step === 0 && <span><strong>Present:</strong> Rutinitas menggunakan Verb 1 (study).</span>}
                      {slide4Step === 1 && <span><strong>Past (+):</strong> Kejadian lampau mengubah kata kerja menjadi Verb 2 (studied).</span>}
                      {slide4Step === 2 && <span><strong>Past (-):</strong> Efek sedot DID aktif! <span className="font-mono text-red-400">did not</span> hadir, kata kerja kembali ke Verb 1 (study).</span>}
                      {slide4Step === 3 && <span><strong>Future (+):</strong> Sisipkan <span className="font-mono text-blue-400">will</span> dan kata kerja tetap bentuk dasar Verb 1 (study).</span>}
                      {slide4Step === 4 && <span><strong>Future (?):</strong> Tukar posisi <span className="font-mono text-amber-400">Will</span> ke depan untuk bertanya.</span>}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  Tekan [Lanjut] atau [Space] untuk masuk ke Mini Challenge Refleks
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 5: MINI CHALLENGE / KUIS REFLEKS (1 SOAL PER LAYAR)                 */}
            {/* ========================================================================= */}
            {currentSlide === 4 && (
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                    Mini Challenge: Uji Refleks Helper A1
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
                    Soal {quizIdx + 1} dari {quizQuestions.length}: Tebak helper yang tepat berdasarkan time signal!
                  </p>
                </div>

                {/* Single Question Box */}
                <div className="w-full max-w-2xl bg-[#11131c] border border-[#202436] rounded-2xl p-4 sm:p-5 space-y-3.5 text-left">
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#1c2030]">
                    <span className="text-xs font-mono text-zinc-400">
                      Target: <strong className="text-amber-400">{currentQ.type}</strong>
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Penanda: <strong className="text-blue-400">"{currentQ.signal}"</strong>
                    </span>
                  </div>

                  {/* Sentence */}
                  <div className="text-base sm:text-xl font-mono font-bold text-white text-center py-2 bg-[#181b28] rounded-xl border border-[#252a3e]">
                    {currentQ.sentence}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-3 gap-2">
                    {currentQ.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      const hasAnswered = selectedOpt !== null;

                      let btnStyle = 'bg-[#181b28] text-zinc-200 border-[#272c42] hover:bg-[#202436]';
                      if (hasAnswered) {
                        if (opt.correct) {
                          btnStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/80 font-bold';
                        } else if (isSelected && !opt.correct) {
                          btnStyle = 'bg-red-950/60 text-red-300 border-red-500/80 line-through';
                        } else {
                          btnStyle = 'bg-[#141620] text-zinc-500 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={opt.label}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => {
                            setSelectedOpt(optIndex);
                            if (opt.correct) setScore((prev) => prev + 1);
                          }}
                          className={`h-11 px-3 rounded-xl border text-sm font-mono font-semibold transition-all cursor-pointer flex items-center justify-center ${btnStyle}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  <div className="min-h-[50px] bg-[#181b28] border border-[#252a3e] rounded-xl p-2.5 text-xs text-zinc-300 flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 border-0">
                      ⓘ
                    </span>
                    <div>
                      {selectedOpt === null ? (
                        <span className="text-zinc-400 italic">Pilih salah satu helper di atas untuk menguji refleks pemahamanmu...</span>
                      ) : (
                        <span>
                          <strong className={currentQ.options[selectedOpt].correct ? 'text-emerald-400' : 'text-red-400'}>
                            {currentQ.options[selectedOpt].correct ? 'Tepat Sekali! ' : 'Kurang Tepat. '}
                          </strong>
                          {currentQ.explanation}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500">
                  {selectedOpt === null
                    ? 'Pilih jawaban terlebih dahulu'
                    : quizIdx < quizQuestions.length - 1
                    ? 'Jawaban tersimpan! Tekan [Lanjut] atau [Space] untuk soal berikutnya'
                    : 'Kuis selesai! Tekan [Selesai] untuk menuntaskan kurikulum A1 🎉'}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* 3. Bottom Sticky Footer */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Sebelumnya"
            title="Sebelumnya"
            className="w-10 h-10 rounded-lg bg-[#141722] hover:bg-[#1c2030] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer border-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > currentSlide ? 1 : -1);
                  setCurrentSlide(i);
                }}
                aria-label={`Ke slide ${i + 1}`}
                className={`h-2 rounded-full transition-all border-0 cursor-pointer p-0 ${
                  i === currentSlide ? 'w-6 bg-blue-600' : 'w-2 bg-[#252838] hover:bg-[#353a50]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label={
              currentSlide === totalSlides - 1 && quizIdx === quizQuestions.length - 1 && selectedOpt !== null
                ? 'Tuntas A1 🎉'
                : 'Selanjutnya'
            }
            title={
              currentSlide === totalSlides - 1 && quizIdx === quizQuestions.length - 1 && selectedOpt !== null
                ? 'Tuntas A1 🎉'
                : 'Selanjutnya'
            }
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-colors cursor-pointer border-0 ${
              currentSlide === totalSlides - 1 && quizIdx === quizQuestions.length - 1 && selectedOpt !== null
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40'
                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/30'
            }`}
          >
            {currentSlide === totalSlides - 1 && quizIdx === quizQuestions.length - 1 && selectedOpt !== null ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TheBigPictureLesson;

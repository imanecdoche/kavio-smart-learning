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
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const Verb1Verb2Lesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Sub-steps for interactive transformation slides
  const [slide3Step, setSlide3Step] = useState(0); // 0: play, 1: played
  const [slide4Step, setSlide4Step] = useState(0); // 0: study, 1: studi, 2: studied
  const [slide5Step, setSlide5Step] = useState(0); // 0: go, 1: went

  // Sub-steps for Slide 8 (Example List): 5 rows, each has 2 steps: 1 = V1 incorrect, 2 = V2 correct
  const [slide8StepCount, setSlide8StepCount] = useState(0);

  const totalSlides = 8;

  // Time signals for Slide 2
  const presentTimeSignals = [
    { en: 'every day', id: 'setiap hari' },
    { en: 'every morning', id: 'setiap pagi' },
    { en: 'usually', id: 'biasanya' },
    { en: 'always', id: 'selalu' },
  ];

  const pastTimeSignals = [
    { en: 'yesterday', id: 'kemarin' },
    { en: 'last night', id: 'tadi malam / semalam' },
    { en: 'last week', id: 'minggu lalu' },
    { en: 'this morning', id: 'tadi pagi' },
    { en: '2 days ago', id: '2 hari yang lalu' },
    { en: 'just now', id: 'baru saja / tadi' },
  ];

  // Common vocabulary for Slide 7
  const regularVerbsList = [
    { v1: 'work', v2: 'worked', id: 'bekerja' },
    { v1: 'watch', v2: 'watched', id: 'menonton' },
    { v1: 'live', v2: 'lived', id: 'tinggal' },
    { v1: 'study', v2: 'studied', id: 'belajar' },
    { v1: 'clean', v2: 'cleaned', id: 'membersihkan' },
  ];

  const irregularVerbsList = [
    { v1: 'go', v2: 'went', id: 'pergi' },
    { v1: 'eat', v2: 'ate', id: 'makan' },
    { v1: 'see', v2: 'saw', id: 'melihat' },
    { v1: 'buy', v2: 'bought', id: 'membeli' },
    { v1: 'sleep', v2: 'slept', id: 'tidur' },
    { v1: 'drink', v2: 'drank', id: 'minum' },
  ];

  // Sentences for Slide 8
  const exampleSentences = [
    {
      id: 'v12-s8-ex1',
      indo: 'Saya minum kopi tadi pagi',
      subject: 'I',
      v1: 'drink',
      v2: 'drank',
      complement: 'coffee this morning',
    },
    {
      id: 'v12-s8-ex2',
      indo: 'Dia belajar kemarin',
      subject: 'He',
      v1: 'study',
      v2: 'studied',
      complement: 'yesterday',
    },
    {
      id: 'v12-s8-ex3',
      indo: 'Mereka makan nasi tadi malam',
      subject: 'They',
      v1: 'eat',
      v2: 'ate',
      complement: 'rice last night',
    },
    {
      id: 'v12-s8-ex4',
      indo: 'Kami bermain sepak bola 2 hari yang lalu',
      subject: 'We',
      v1: 'play',
      v2: 'played',
      complement: 'football 2 days ago',
    },
    {
      id: 'v12-s8-ex5',
      indo: 'Ayah membeli sebuah mobil minggu lalu',
      subject: 'Father',
      v1: 'buy',
      v2: 'bought',
      complement: 'a car last week',
    },
  ];

  const totalSlide8Steps = exampleSentences.length * 2;

  const handleNext = useCallback(() => {
    // Slide 3: play -> played (steps 0, 1)
    if (currentSlide === 2) {
      if (slide3Step < 1) {
        setSlide3Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(3);
      setSlide4Step(0);
      return;
    }

    // Slide 4: study -> studi -> studied (steps 0, 1, 2)
    if (currentSlide === 3) {
      if (slide4Step < 2) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5Step(0);
      return;
    }

    // Slide 5: go -> went (steps 0, 1)
    if (currentSlide === 4) {
      if (slide5Step < 1) {
        setSlide5Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(5);
      return;
    }

    // Slide 8: Interactive Sentences
    if (currentSlide === 7) {
      if (slide8StepCount < totalSlide8Steps) {
        setSlide8StepCount((prev) => prev + 1);
        return;
      }
      onBack?.();
      return;
    }

    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      if (currentSlide + 1 === 7) {
        setSlide8StepCount(0);
      }
    }
  }, [currentSlide, slide3Step, slide4Step, slide5Step, slide8StepCount, totalSlide8Steps, onBack]);

  const handlePrev = useCallback(() => {
    // Slide 3
    if (currentSlide === 2) {
      if (slide3Step > 0) {
        setSlide3Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(1);
      return;
    }

    // Slide 4
    if (currentSlide === 3) {
      if (slide4Step > 0) {
        setSlide4Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(2);
      setSlide3Step(1);
      return;
    }

    // Slide 5
    if (currentSlide === 4) {
      if (slide5Step > 0) {
        setSlide5Step((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(3);
      setSlide4Step(2);
      return;
    }

    // Slide 8
    if (currentSlide === 7) {
      if (slide8StepCount > 0) {
        setSlide8StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(6);
      return;
    }

    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, slide3Step, slide4Step, slide5Step, slide8StepCount]);

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
          {/* Slide 1: Kapan Kita Pakai Past Tense? */}
          {currentSlide === 0 && (
            <motion.div
              key="v12-slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">KONSEP DASAR WAKTU</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Kapan Kita Pakai Past Tense?
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10">
                Past Tense dipakai saat kita menceritakan kejadian atau aktivitas yang <strong className="text-white">SUDAH SELESAI</strong> di masa lalu dan tidak berlangsung lagi saat ini.
              </p>

              {/* Contrast Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                <div className="p-6 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-blue-400 mb-1">PRESENT (SEKARANG / RUTINITAS)</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Verb 1</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Dipakai untuk kebiasaan dan kegiatan yang masih rutin dilakukan sekarang.
                  </p>
                  <div className="p-3 rounded-lg bg-[#181a24] text-sm font-semibold text-zinc-200">
                    I <span className="text-blue-400">drink</span> coffee every day
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">PAST (MASA LALU / SUDAH SELESAI)</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Verb 2</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Dipakai saat kejadian tersebut sudah tuntas dan terjadi di waktu lampau.
                  </p>
                  <div className="p-3 rounded-lg bg-[#181a24] text-sm font-semibold text-zinc-200">
                    I <span className="text-emerald-400">drank</span> coffee this morning
                  </div>
                </div>
              </div>

              <div className="mt-8 text-xs text-zinc-400 max-w-xl mx-auto">
                Kunci pembedanya ada di <strong className="text-white">"kapan kejadiannya berlangsung"</strong>. Di bahasa Inggris, perubahan waktu wajib mengubah kata kerja dari <strong className="text-blue-400">V1</strong> ke <strong className="text-emerald-400">V2</strong>.
              </div>
            </motion.div>
          )}

          {/* Slide 2: Kenalkan Time Signal (Penanda Waktu) */}
          {currentSlide === 1 && (
            <motion.div
              key="v12-slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">PETUNJUK WAKTU</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                Penanda Waktu (Time Signal)
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
                Kenali kata-kata penunjuk waktu berikut untuk membedakan kalimat sekarang vs lampau:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                {/* Present Signals */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-blue-400 mb-2">PENANDA PRESENT (SEKARANG / RUTIN)</div>
                  <div className="space-y-2.5">
                    {presentTimeSignals.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#181a24] text-sm">
                        <span className="font-bold text-white">{item.en}</span>
                        <span className="text-xs text-zinc-400">{item.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Signals */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-emerald-400 mb-2">PENANDA PAST (MASA LALU / SUDAH LEWAT)</div>
                  <div className="space-y-2.5">
                    {pastTimeSignals.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#181a24] text-sm">
                        <span className="font-bold text-emerald-400">{item.en}</span>
                        <span className="text-xs text-zinc-400">{item.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-zinc-400 max-w-xl mx-auto">
                Saat kamu melihat penanda waktu seperti <strong className="text-emerald-400">yesterday</strong>, <strong className="text-emerald-400">last night</strong>, atau <strong className="text-emerald-400">this morning</strong>, kata kerjanya wajib beralih ke <strong className="text-white">Verb 2</strong>!
              </div>
            </motion.div>
          )}

          {/* Slide 3: Visualisasi Perubahan Kata (play -> played) */}
          {currentSlide === 2 && (
            <motion.div
              key="v12-slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">TRANSFORMASI 1</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
                Penambahan Akhiran -ed
              </h2>

              {/* Big Word Animation */}
              <div className="h-32 flex items-center justify-center">
                <LayoutGroup id="v12-s3-group">
                  <div className="relative isolate flex items-baseline justify-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      play
                    </motion.span>

                    <AnimatePresence mode="popLayout">
                      {slide3Step >= 1 && (
                        <motion.span
                          key="v12-s3-token-ed"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={wordSpringTransition}
                          className="text-blue-400 inline-block pl-1"
                        >
                          ed
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center justify-center gap-3 my-4">
                <span className={`text-sm font-semibold transition-colors ${slide3Step === 0 ? 'text-white' : 'text-zinc-500'}`}>
                  Verb 1 (play)
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide3Step >= 1 ? 'text-blue-400' : 'text-zinc-600'}`}>
                  Verb 2 (played)
                </span>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[80px] sm:min-h-[90px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {slide3Step === 0 ? (
                    <motion.p
                      key="s3-text-0"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-400 max-w-md mx-auto"
                    >
                      Bentuk sekarang: <strong className="text-white">play</strong>. Tekan tombol selanjutnya untuk melihat bagaimana kata ini berubah menjadi bentuk masa lalu.
                    </motion.p>
                  ) : (
                    <motion.p
                      key="s3-text-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-300 max-w-md mx-auto"
                    >
                      Untuk kata kerja beraturan, cukup tambahkan akhiran <strong className="text-blue-400">-ed</strong> di belakangnya sehingga menjadi <strong className="text-white">played</strong> (V2).
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Visualisasi Perubahan Kata (study -> studied) */}
          {currentSlide === 3 && (
            <motion.div
              key="v12-slide-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">TRANSFORMASI 2</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
                Huruf Y Berubah Jadi I + ed
              </h2>

              {/* Big Word Animation */}
              <div className="h-32 flex items-center justify-center">
                <LayoutGroup id="v12-s4-group">
                  <div className="relative isolate flex items-baseline justify-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      stud
                    </motion.span>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {slide4Step === 0 ? (
                        <motion.span
                          key="v12-s4-letter-y"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={wordSpringTransition}
                          className="text-white inline-block"
                        >
                          y
                        </motion.span>
                      ) : (
                        <motion.span
                          key="v12-s4-letter-i"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={wordSpringTransition}
                          className="text-blue-400 inline-block"
                        >
                          i
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout">
                      {slide4Step >= 2 && (
                        <motion.span
                          key="v12-s4-token-ed"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={wordSpringTransition}
                          className="text-blue-400 inline-block pl-1"
                        >
                          ed
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center justify-center gap-3 my-4">
                <span className={`text-sm font-semibold transition-colors ${slide4Step === 0 ? 'text-white' : 'text-zinc-500'}`}>
                  Verb 1 (study)
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide4Step === 1 ? 'text-blue-400' : 'text-zinc-500'}`}>
                  y → i
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide4Step >= 2 ? 'text-blue-400' : 'text-zinc-600'}`}>
                  Verb 2 (studied)
                </span>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[80px] sm:min-h-[90px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {slide4Step === 0 && (
                    <motion.p
                      key="s4-text-0"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-400 max-w-md mx-auto"
                    >
                      Bentuk dasar: <strong className="text-white">study</strong>. Huruf terakhirnya adalah <strong className="text-white">y</strong> yang didahului huruf konsonan (<strong className="text-white">d</strong>).
                    </motion.p>
                  )}
                  {slide4Step === 1 && (
                    <motion.p
                      key="s4-text-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-300 max-w-md mx-auto"
                    >
                      Huruf <strong className="text-white">y</strong> melebur dan berubah menjadi huruf <strong className="text-blue-400">i</strong>.
                    </motion.p>
                  )}
                  {slide4Step >= 2 && (
                    <motion.p
                      key="s4-text-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-300 max-w-md mx-auto"
                    >
                      Kemudian baru ditambahkan akhiran <strong className="text-blue-400">-ed</strong> menjadi <strong className="text-white">studied</strong> (V2).
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 5: Visualisasi Perubahan Kata (go -> went) */}
          {currentSlide === 4 && (
            <motion.div
              key="v12-slide-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-amber-400 mb-2">TRANSFORMASI 3 (IRREGULAR)</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
                Bentuk Khusus Tanpa Akhiran -ed
              </h2>

              {/* Big Word Animation */}
              <div className="h-32 flex items-center justify-center">
                <LayoutGroup id="v12-s5-group">
                  <div className="relative isolate flex items-baseline justify-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {slide5Step === 0 ? (
                        <motion.span
                          key="v12-s5-word-go"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-white inline-block"
                        >
                          go
                        </motion.span>
                      ) : (
                        <motion.span
                          key="v12-s5-word-went"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-amber-400 inline-block"
                        >
                          went
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center justify-center gap-3 my-4">
                <span className={`text-sm font-semibold transition-colors ${slide5Step === 0 ? 'text-white' : 'text-zinc-500'}`}>
                  Verb 1 (go)
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide5Step >= 1 ? 'text-amber-400' : 'text-zinc-600'}`}>
                  Verb 2 (went)
                </span>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[80px] sm:min-h-[90px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {slide5Step === 0 ? (
                    <motion.p
                      key="s5-text-0"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-400 max-w-md mx-auto"
                    >
                      Bentuk sekarang: <strong className="text-white">go</strong>. Kata kerja tidak beraturan tidak menggunakan aturan penambahan -ed.
                    </motion.p>
                  ) : (
                    <motion.p
                      key="s5-text-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-zinc-300 max-w-md mx-auto"
                    >
                      Bentuk lampau dari <strong className="text-white">go</strong> berubah total menjadi <strong className="text-amber-400">went</strong> (bukan <em className="text-red-400">goed</em>).
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 6: Pembagian Detail Regular vs Irregular Verbs */}
          {currentSlide === 5 && (
            <motion.div
              key="v12-slide-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">PEMBAHASAN DETAIL</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
                Regular vs Irregular Verbs
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                {/* Regular Rules */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0 space-y-3">
                  <div className="text-xs font-semibold text-blue-400">1. REGULAR VERBS (BERATURAN)</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Cukup tambahkan akhiran <strong className="text-white">-d</strong> atau <strong className="text-white">-ed</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-[#181a24] space-y-2 text-xs">
                    <div className="text-zinc-200">
                      <strong className="text-blue-400">Vokal + Y</strong>: langsung + ed
                      <div className="text-zinc-400 mt-0.5">play → played, enjoy → enjoyed</div>
                    </div>
                    <div className="text-zinc-200 pt-1 border-t border-zinc-700/40">
                      <strong className="text-blue-400">Konsonan + Y</strong>: Y jadi I + ed
                      <div className="text-zinc-400 mt-0.5">study → studied, cry → cried</div>
                    </div>
                  </div>
                </div>

                {/* Irregular Rules */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0 space-y-3">
                  <div className="text-xs font-semibold text-amber-400">2. IRREGULAR VERBS (TIDAK BERATURAN)</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Bentuk V2 kata kerja ini <strong className="text-amber-400">UNPREDICTABLE</strong> (tidak memiliki rumus dan tidak bisa ditebak).
                  </p>
                  <div className="p-3 rounded-xl bg-[#181a24] text-xs text-zinc-300 leading-relaxed">
                    Satu-satunya cara adalah cek kamus atau membiasakan diri melihatnya dalam kalimat.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border-0 text-xs text-emerald-300/90 leading-relaxed">
                    💡 <em>"Jangan dipaksa menghafal semuanya sekaligus! Seiring sering membaca dan latihan, kamu akan terbiasa sendiri dengan bentuk V2-nya."</em>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 7: Rangkuman Daftar Kata V1 -> V2 */}
          {currentSlide === 6 && (
            <motion.div
              key="v12-slide-7"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">KOSAKATA SERING DIGUNAKAN</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
                Rangkuman Kata Kerja V1 → V2
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                {/* Regular Column */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-blue-400 mb-3">REGULAR VERBS (+ed / +d)</div>
                  <div className="space-y-2">
                    {regularVerbsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#181a24] text-xs sm:text-sm">
                        <span className="text-zinc-300">{item.v1}</span>
                        <span className="text-zinc-500 font-mono">→</span>
                        <span className="font-bold text-blue-400">{item.v2}</span>
                        <span className="text-xs text-zinc-500 hidden sm:inline">({item.id})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Irregular Column */}
                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-amber-400 mb-3">IRREGULAR VERBS (BENTUK KHUSUS)</div>
                  <div className="space-y-2">
                    {irregularVerbsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#181a24] text-xs sm:text-sm">
                        <span className="text-zinc-300">{item.v1}</span>
                        <span className="text-zinc-500 font-mono">→</span>
                        <span className="font-bold text-amber-400">{item.v2}</span>
                        <span className="text-xs text-zinc-500 hidden sm:inline">({item.id})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Slide 8: Slide Contoh Kalimat Interaktif */}
          {currentSlide === 7 && (
            <motion.div
              key="v12-slide-8"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-emerald-400 mb-1">PRAKTIK KALIMAT</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Perubahan V1 ke V2 dalam Kalimat
              </h2>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto mb-6">
                Perhatikan bagaimana kata kerja V1 yang belum tepat otomatis berubah menjadi bentuk V2 saat ada penanda waktu lampau.
              </p>

              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {exampleSentences.map((item, idx) => {
                  const rowStepProgress = slide8StepCount - idx * 2;
                  const rowState = rowStepProgress <= 0 ? 0 : rowStepProgress === 1 ? 1 : 2;

                  if (rowState === 0) return null;

                  return (
                    <LayoutGroup key={`v12-s8-lg-${idx}`} id={`v12-s8-lg-${idx}`}>
                      <motion.div
                        key={`v12-s8-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04, duration: 0.25 }}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2 flex-wrap">
                          <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                            {item.subject}
                          </motion.span>

                          {/* Verb Token: morphing from V1 to V2 */}
                          <div className="relative isolate inline-flex items-baseline">
                            <AnimatePresence mode="popLayout" initial={false}>
                              {rowState === 1 ? (
                                <motion.span
                                  key={`v12-s8-token-v1-${idx}`}
                                  layout="position"
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.85 }}
                                  transition={wordSpringTransition}
                                  className="text-red-400 font-bold inline-block"
                                >
                                  {item.v1}
                                </motion.span>
                              ) : (
                                <motion.span
                                  key={`v12-s8-token-v2-${idx}`}
                                  layout="position"
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.85 }}
                                  transition={wordSpringTransition}
                                  className="text-emerald-400 font-bold inline-block"
                                >
                                  {item.v2}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>

                          <motion.span layout="position" transition={wordSpringTransition} className="text-zinc-200">
                            {item.complement}
                          </motion.span>
                        </div>

                        {/* Status Indicator (Pure Solid Circle without outline stroke per absolute rules) */}
                        <div className="flex items-center shrink-0 ml-3">
                          <AnimatePresence mode="wait">
                            {rowState === 1 ? (
                              <motion.div
                                key={`v12-s8-status-cross-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center text-white border-0 shadow-sm"
                                aria-label="Belum tepat (masih V1)"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`v12-s8-status-check-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white border-0 shadow-sm"
                                aria-label="Tepat (sudah V2)"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
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

              {/* Instructions hint */}
              <div className="mt-4 text-xs text-zinc-500 font-mono">
                {slide8StepCount < totalSlide8Steps ? (
                  <span>Tekan tombol Selanjutnya atau Space untuk melanjutkan ({Math.floor(slide8StepCount / 2)} / {exampleSentences.length})</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Semua contoh tuntas! Tekan tombol centang untuk kembali ke kurikulum.</span>
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
              slide3Step === 0 &&
              slide4Step === 0 &&
              slide5Step === 0 &&
              slide8StepCount === 0
            }
            aria-label="Sebelumnya"
            title="Sebelumnya"
            className="w-10 h-10 rounded-lg bg-[#141722] hover:bg-[#1c2030] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer border-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  currentSlide === idx ? 'w-6 bg-blue-500' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          {/* Right: Next or Completion Button (Icon only) */}
          <div>
            {currentSlide === totalSlides - 1 && slide8StepCount >= totalSlide8Steps ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Selesai Belajar"
                title="Selesai Belajar"
                className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors cursor-pointer border-0 shadow-lg shadow-emerald-900/40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Verb1Verb2Lesson;

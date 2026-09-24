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

export const HelperBePastLesson = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Sub-steps for Slide 3 (Nominal Past): 0 = I am tired, 1 = I was tired, 2 = negative & tanya demo
  const [slide3Step, setSlide3Step] = useState(0);

  // Sub-steps for Slide 4 (Past Continuous Transformation): 0 = present, 1 = past
  const [slide4Step, setSlide4Step] = useState(0);

  // Sub-steps for Slide 5 (Continuous + / - / ? Demo): 0 = (+), 1 = (-), 2 = (?)
  const [slide5Step, setSlide5Step] = useState(0);

  // Sub-steps for Slide 6 (Interactive List): 6 items * 3 states (+, -, ?) = 18 step points
  const [slide6StepCount, setSlide6StepCount] = useState(0);

  const totalSlides = 6;

  const exampleList = [
    {
      id: 'bepast-ex1',
      indo: 'Saya di rumah kemarin',
      type: 'Nominal',
      subject: 'I',
      helper: 'was',
      complement: 'at home yesterday',
    },
    {
      id: 'bepast-ex2',
      indo: 'Dia sedang tidur semalam',
      type: 'Continuous',
      subject: 'He',
      helper: 'was',
      complement: 'sleeping last night',
    },
    {
      id: 'bepast-ex3',
      indo: 'Mereka sedang bekerja jam 9 tadi',
      type: 'Continuous',
      subject: 'They',
      helper: 'were',
      complement: 'working at 9',
    },
    {
      id: 'bepast-ex4',
      indo: 'Kamu sibuk kemarin',
      type: 'Nominal',
      subject: 'You',
      helper: 'were',
      complement: 'busy yesterday',
    },
    {
      id: 'bepast-ex5',
      indo: 'Citra senang tadi malam',
      type: 'Nominal',
      subject: 'Citra',
      helper: 'was',
      complement: 'happy last night',
    },
    {
      id: 'bepast-ex6',
      indo: 'Kami sedang belajar kemarin sore',
      type: 'Continuous',
      subject: 'We',
      helper: 'were',
      complement: 'studying yesterday afternoon',
    },
  ];

  const totalSlide6Steps = exampleList.length * 3;

  const handleNext = useCallback(() => {
    // Slide 3: Nominal steps (0, 1, 2)
    if (currentSlide === 2) {
      if (slide3Step < 2) {
        setSlide3Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(3);
      setSlide4Step(0);
      return;
    }

    // Slide 4: Continuous transformation (0, 1)
    if (currentSlide === 3) {
      if (slide4Step < 1) {
        setSlide4Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(4);
      setSlide5Step(0);
      return;
    }

    // Slide 5: Continuous + / - / ? demo (0, 1, 2)
    if (currentSlide === 4) {
      if (slide5Step < 2) {
        setSlide5Step((prev) => prev + 1);
        return;
      }
      setDirection(1);
      setCurrentSlide(5);
      setSlide6StepCount(0);
      return;
    }

    // Slide 6: Progressive Reveal List
    if (currentSlide === 5) {
      if (slide6StepCount < totalSlide6Steps) {
        setSlide6StepCount((prev) => prev + 1);
        return;
      }
      onBack?.();
      return;
    }

    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, slide3Step, slide4Step, slide5Step, slide6StepCount, totalSlide6Steps, onBack]);

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
      setSlide3Step(2);
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
      setSlide4Step(1);
      return;
    }

    // Slide 6
    if (currentSlide === 5) {
      if (slide6StepCount > 0) {
        setSlide6StepCount((prev) => prev - 1);
        return;
      }
      setDirection(-1);
      setCurrentSlide(4);
      setSlide5Step(2);
      return;
    }

    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, slide3Step, slide4Step, slide5Step, slide6StepCount]);

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
          {/* Slide 1: Kilas Balik Helper BE (Present vs Past) */}
          {currentSlide === 0 && (
            <motion.div
              key="bepast-slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">KILAS BALIK HELPER BE</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Helper BE dalam Waktu Lampau
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
                Sebelumnya kita sudah mempelajari dua fungsi utama Helper BE:
              </p>

              {/* 2 Functions Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-8">
                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-blue-400 mb-1">FUNGSI 1: NOMINAL</div>
                  <h3 className="text-lg font-bold text-white mb-1">Sifat, Benda, Tempat</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Menghubungkan subjek dengan pelengkap non-kata kerja.
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#181a24] text-xs font-semibold text-zinc-200">
                    I <span className="text-blue-400">am</span> tired (sekarang)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#12141c] border-0">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">FUNGSI 2: CONTINUOUS</div>
                  <h3 className="text-lg font-bold text-white mb-1">Aktivitas Sedang Terjadi</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Mendampingi Verb-ing untuk menyatakan kegiatan yang sedang berlangsung.
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#181a24] text-xs font-semibold text-zinc-200">
                    I <span className="text-emerald-400">am</span> studying (sekarang)
                  </div>
                </div>
              </div>

              {/* Key Concept Box */}
              <div className="p-5 rounded-2xl bg-[#181a24] max-w-2xl mx-auto text-left border-0">
                <div className="text-xs font-bold text-amber-400 mb-1">PERUBAHAN SAAT WAKTUNYA LAMPAU</div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Begitu kalimat memiliki penanda waktu lampau (<strong className="text-white">yesterday</strong>, <strong className="text-white">last night</strong>, <strong className="text-white">at 7 PM yesterday</strong>), Helper BE berubah bentuk dari <strong className="text-blue-400">am / is / are</strong> menjadi <strong className="text-emerald-400">WAS</strong> dan <strong className="text-emerald-400">WERE</strong>!
                </p>
              </div>
            </motion.div>
          )}

          {/* Slide 2: Pembagian Pasangan Subjek (WAS vs WERE) */}
          {currentSlide === 1 && (
            <motion.div
              key="bepast-slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-2">PEMBAGIAN SUBJEK</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Pasangan WAS vs WERE
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
                Di masa lalu, 3 helper (am, is, are) disederhanakan menjadi hanya 2 helper:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                {/* WAS Box */}
                <div className="p-6 rounded-2xl bg-[#12141c] border-0 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-blue-400 mb-1">BENTUK LAMPAU DARI AM & IS</div>
                    <h3 className="text-2xl font-black text-white">WAS</h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181a24] space-y-2 text-xs sm:text-sm">
                    <div className="text-zinc-300 font-semibold">Subjek Tunggal:</div>
                    <div className="text-white font-bold tracking-wide">
                      I, He, She, It, nama orang tunggal
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <div>• <strong className="text-white">I was</strong> ready</div>
                    <div>• <strong className="text-white">He was</strong> at home</div>
                    <div>• <strong className="text-white">Dika was</strong> tired</div>
                  </div>
                </div>

                {/* WERE Box */}
                <div className="p-6 rounded-2xl bg-[#12141c] border-0 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 mb-1">BENTUK LAMPAU DARI ARE</div>
                    <h3 className="text-2xl font-black text-white">WERE</h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181a24] space-y-2 text-xs sm:text-sm">
                    <div className="text-zinc-300 font-semibold">Subjek Jamak & You:</div>
                    <div className="text-white font-bold tracking-wide">
                      You, They, We, subjek jamak
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <div>• <strong className="text-white">You were</strong> busy</div>
                    <div>• <strong className="text-white">They were</strong> here</div>
                    <div>• <strong className="text-white">We were</strong> happy</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-zinc-400 max-w-xl mx-auto">
                💡 <strong className="text-white">Trik Mudah:</strong> Subjek tunggal menggunakan <strong className="text-blue-400">WAS</strong> (berakhiran huruf 's'), sedangkan subjek jamak dan You menggunakan <strong className="text-emerald-400">WERE</strong>.
              </div>
            </motion.div>
          )}

          {/* Slide 3: Bagian 1: Nominal Past (Sifat, Benda, Tempat) */}
          {currentSlide === 2 && (
            <motion.div
              key="bepast-slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-1">BAGIAN 1</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Nominal Past (Sifat, Benda, Tempat)
              </h2>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto mb-6">
                Lihat bagaimana Helper BE berganti saat kalimat berpindah ke masa lampau.
              </p>

              {/* Big Sentence Animation */}
              <div className="h-28 flex items-center justify-center">
                <LayoutGroup id="bepast-s3-group">
                  <div className="relative isolate flex items-baseline justify-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight gap-3">
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      I
                    </motion.span>

                    <div className="relative isolate inline-flex items-baseline">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {slide3Step === 0 ? (
                          <motion.span
                            key="bepast-s3-token-am"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-blue-400 inline-block"
                          >
                            am
                          </motion.span>
                        ) : (
                          <motion.span
                            key="bepast-s3-token-was"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-emerald-400 inline-block"
                          >
                            was
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      tired
                    </motion.span>

                    <AnimatePresence mode="popLayout">
                      {slide3Step >= 1 && (
                        <motion.span
                          key="bepast-s3-token-yesterday"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-zinc-300 font-semibold"
                        >
                          yesterday
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center justify-center gap-3 my-3">
                <span className={`text-sm font-semibold transition-colors ${slide3Step === 0 ? 'text-blue-400' : 'text-zinc-500'}`}>
                  Present (I am tired)
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide3Step >= 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  Past (I was tired yesterday)
                </span>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[100px] sm:min-h-[110px] flex items-center justify-center max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                  {slide3Step < 2 ? (
                    <motion.div
                      key="s3-desc-info"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Begitu ada penanda waktu lampau (<strong className="text-white">yesterday</strong>), kata penghubung <strong className="text-blue-400">am</strong> otomatis berganti menjadi <strong className="text-emerald-400">was</strong>.
                      <div className="text-xs text-zinc-400 mt-1">Sama halnya dengan: <em>They are here</em> → <strong className="text-white">They were here yesterday</strong>.</div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="s3-desc-rules"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="p-3.5 rounded-xl bg-[#181a24] text-xs text-zinc-300 w-full text-left space-y-1.5"
                    >
                      <div className="font-bold text-white mb-1">Rumus Kalimat (-) dan (?) Tetap Konsisten:</div>
                      <div>• <strong className="text-red-400">Negatif (-)</strong>: Cukup tambahkan NOT setelah Helper: <span className="text-white">I was not tired yesterday</span>.</div>
                      <div>• <strong className="text-amber-400">Tanya (?)</strong>: Tukar posisi Helper ke depan subjek: <span className="text-white">Was I tired yesterday ?</span></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Bagian 2: Past Continuous (Sedang Berlangsung di Masa Lalu) */}
          {currentSlide === 3 && (
            <motion.div
              key="bepast-slide-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-emerald-400 mb-1">BAGIAN 2</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Past Continuous (Sedang di Masa Lalu)
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl mx-auto mb-6">
                Menyatakan kegiatan yang <strong className="text-white">SEDANG BERLANGSUNG</strong> pada jam atau momen tertentu di masa lalu.
                <br /><span className="text-zinc-500">Pola: Subjek + was/were + Verb-ing</span>
              </p>

              {/* Big Word Animation */}
              <div className="h-28 flex items-center justify-center">
                <LayoutGroup id="bepast-s4-group">
                  <div className="relative isolate flex items-baseline justify-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight gap-3">
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      They
                    </motion.span>

                    <div className="relative isolate inline-flex items-baseline">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {slide4Step === 0 ? (
                          <motion.span
                            key="bepast-s4-token-are"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-blue-400 inline-block"
                          >
                            are
                          </motion.span>
                        ) : (
                          <motion.span
                            key="bepast-s4-token-were"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={wordSpringTransition}
                            className="text-emerald-400 inline-block"
                          >
                            were
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      playing
                    </motion.span>

                    <AnimatePresence mode="popLayout">
                      {slide4Step >= 1 && (
                        <motion.span
                          key="bepast-s4-token-time"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-zinc-300 font-semibold"
                        >
                          at 7 PM
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center justify-center gap-3 my-3">
                <span className={`text-sm font-semibold transition-colors ${slide4Step === 0 ? 'text-blue-400' : 'text-zinc-500'}`}>
                  Present Continuous (They are playing)
                </span>
                <span className="text-zinc-600">→</span>
                <span className={`text-sm font-semibold transition-colors ${slide4Step >= 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  Past Continuous (They were playing at 7 PM)
                </span>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                  {slide4Step === 0 ? (
                    <motion.p
                      key="s4-desc-0"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Di waktu sekarang, kita berkata: <strong className="text-white">They are playing</strong> (Mereka sedang bermain sekarang). Tekan selanjutnya untuk melihat saat waktunya lampau.
                    </motion.p>
                  ) : (
                    <motion.p
                      key="s4-desc-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Bentuk kata kerja <strong className="text-white">Verb-ing (playing)</strong> tidak berubah sama sekali! Yang berubah hanyalah Helper BE-nya dari <strong className="text-blue-400">are</strong> menjadi <strong className="text-emerald-400">were</strong>.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 5: Pola Negatif & Tanya di Past Continuous (Konsistensi Rumus) */}
          {currentSlide === 4 && (
            <motion.div
              key="bepast-slide-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-amber-400 mb-1">KONSISTENSI POLA</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Pola (-) dan (?) di Past Continuous
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                Rumusnya 100% konsisten sama dengan kalimat nominal dan present tense!
              </p>

              {/* Big Sentence FLIP Animation Container */}
              <div className="h-28 flex items-center justify-center">
                <LayoutGroup id="bepast-s5-group">
                  <div className="relative isolate flex items-baseline justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight gap-3">
                    {/* Helper in Front for State 2 (?) */}
                    <AnimatePresence mode="popLayout">
                      {slide5Step === 2 && (
                        <motion.span
                          key="bepast-s5-helper-front"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-amber-400 inline-block"
                        >
                          Was
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Subject (I) */}
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      I
                    </motion.span>

                    {/* Helper in Middle for State 0 (+) and State 1 (-) */}
                    <AnimatePresence mode="popLayout">
                      {slide5Step !== 2 && (
                        <motion.span
                          key="bepast-s5-helper-mid"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={wordSpringTransition}
                          className="text-blue-400 inline-block"
                        >
                          was
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* NOT token for State 1 (-) */}
                    <AnimatePresence mode="popLayout">
                      {slide5Step === 1 && (
                        <motion.span
                          key="bepast-s5-token-not"
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

                    {/* Verb-ing */}
                    <motion.span layout="position" transition={wordSpringTransition} className="text-white">
                      studying
                    </motion.span>

                    {/* Question Mark (?) for State 2 */}
                    <AnimatePresence mode="popLayout">
                      {slide5Step === 2 && (
                        <motion.span
                          key="bepast-s5-token-q"
                          layout="position"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={wordSpringTransition}
                          className="text-amber-400 inline-block"
                        >
                          ?
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
              </div>

              {/* Status Indicator Tabs */}
              <div className="flex items-center justify-center gap-3 my-4">
                <button
                  type="button"
                  onClick={() => setSlide5Step(0)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                    slide5Step === 0 ? 'bg-blue-600 text-white' : 'bg-[#181a24] text-zinc-400 hover:text-white'
                  }`}
                >
                  Positif (+)
                </button>
                <button
                  type="button"
                  onClick={() => setSlide5Step(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                    slide5Step === 1 ? 'bg-red-600 text-white' : 'bg-[#181a24] text-zinc-400 hover:text-white'
                  }`}
                >
                  Negatif (-)
                </button>
                <button
                  type="button"
                  onClick={() => setSlide5Step(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                    slide5Step === 2 ? 'bg-amber-500 text-slate-950' : 'bg-[#181a24] text-zinc-400 hover:text-white'
                  }`}
                >
                  Tanya (?)
                </button>
              </div>

              {/* Locked Min-Height Explanation Box */}
              <div className="min-h-[80px] sm:min-h-[90px] flex items-center justify-center max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                  {slide5Step === 0 && (
                    <motion.p
                      key="s5-text-pos"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Bentuk positif: <strong className="text-white">I was studying</strong> (Saya sedang belajar tadi malam).
                    </motion.p>
                  )}
                  {slide5Step === 1 && (
                    <motion.p
                      key="s5-text-neg"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Bentuk negatif: Cukup sisipkan <strong className="text-red-400">not</strong> tepat setelah Helper <strong className="text-white">was</strong>: <strong className="text-white">I was not studying</strong>.
                    </motion.p>
                  )}
                  {slide5Step === 2 && (
                    <motion.p
                      key="s5-text-q"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center"
                    >
                      Bentuk tanya: Helper <strong className="text-amber-400">Was</strong> tukar posisi ke paling depan subjek dan tambahkan tanda tanya (?): <strong className="text-white">Was I studying ?</strong>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Slide 6: Slide Daftar Contoh Interaktif (Campuran Nominal & Continuous) */}
          {currentSlide === 5 && (
            <motion.div
              key="bepast-slide-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl text-center py-4"
            >
              <div className="text-xs font-semibold text-blue-400 mb-1">PRAKTIK INTERAKTIF</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Daftar Contoh Kalimat Lampau
              </h2>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto mb-6">
                Perhatikan bagaimana kalimat bertransisi dari Positif (+) ke Negatif (-) lalu ke Tanya (?) dengan animasi per kata yang mulus.
              </p>

              {/* Rows List */}
              <div className="space-y-3.5 max-w-2xl mx-auto py-2">
                {exampleList.map((item, idx) => {
                  const rowStepProgress = slide6StepCount - idx * 3;
                  // 0 = hidden, 1 = (+), 2 = (-), 3 = (?)
                  const state = rowStepProgress <= 0 ? 0 : Math.min(rowStepProgress, 3);

                  if (state === 0) return null;

                  return (
                    <LayoutGroup key={`bepast-lg-${idx}`} id={`bepast-lg-${idx}`}>
                      <motion.div
                        key={`bepast-row-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04, duration: 0.25 }}
                        className="relative isolate flex items-center justify-between text-base sm:text-lg md:text-xl font-bold border-b border-[#232736]/40 pb-2.5 transition-colors"
                      >
                        <div className="relative isolate flex items-center gap-2 flex-wrap">
                          {/* Token 1: Helper in front for State 3 (?) */}
                          <AnimatePresence mode="popLayout">
                            {state === 3 && (
                              <motion.span
                                key={`bepast-t1-hfront-${idx}`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-amber-400 capitalize inline-block"
                              >
                                {item.helper}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Token 2: Subject */}
                          <motion.span
                            layout="position"
                            transition={wordSpringTransition}
                            className="text-white inline-block"
                          >
                            {state === 3 && item.subject === 'I' ? 'I' : item.subject}
                          </motion.span>

                          {/* Token 3: Helper in middle for State 1 (+) and State 2 (-) */}
                          <AnimatePresence mode="popLayout">
                            {state !== 3 && (
                              <motion.span
                                key={`bepast-t3-hmid-${idx}`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-blue-400 inline-block"
                              >
                                {item.helper}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Token 4: NOT for State 2 (-) */}
                          <AnimatePresence mode="popLayout">
                            {state === 2 && (
                              <motion.span
                                key={`bepast-t4-not-${idx}`}
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

                          {/* Token 5: Complement / Verb-ing */}
                          <motion.span
                            layout="position"
                            transition={wordSpringTransition}
                            className="text-zinc-200 inline-block"
                          >
                            {item.complement}
                          </motion.span>

                          {/* Token 6: Question Mark (?) for State 3 */}
                          <AnimatePresence mode="popLayout">
                            {state === 3 && (
                              <motion.span
                                key={`bepast-t6-qmark-${idx}`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={wordSpringTransition}
                                className="text-amber-400 font-black inline-block"
                              >
                                ?
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Status Indicator (Pure Solid Circle without outline stroke per absolute rules) */}
                        <div className="flex items-center shrink-0 ml-3">
                          <AnimatePresence mode="wait">
                            {state === 1 && (
                              <motion.div
                                key={`bepast-status-pos-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white border-0 shadow-sm"
                                aria-label="Kalimat Positif"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                            {state === 2 && (
                              <motion.div
                                key={`bepast-status-neg-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center text-white border-0 shadow-sm"
                                aria-label="Kalimat Negatif"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                            {state === 3 && (
                              <motion.div
                                key={`bepast-status-q-${idx}`}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={wordSpringTransition}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black border-0 shadow-sm text-sm"
                                aria-label="Kalimat Tanya"
                              >
                                ?
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
                {slide6StepCount < totalSlide6Steps ? (
                  <span>Tekan tombol Selanjutnya atau Space untuk melihat perubahan kalimat ({Math.floor(slide6StepCount / 3)} / {exampleList.length})</span>
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
              slide6StepCount === 0
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
            {currentSlide === totalSlides - 1 && slide6StepCount >= totalSlide6Steps ? (
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

export default HelperBePastLesson;

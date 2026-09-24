import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../ui/Button';

// Spring transition standard
const springTransition = {
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

// 5 Interactive Quiz Questions for Slide 5
const QUIZ_QUESTIONS = [
  {
    id: 1,
    sentenceBefore: 'We will meet',
    blankTarget: 'at',
    sentenceAfter: '8:30 AM tomorrow morning.',
    options: ['at', 'on', 'in'],
    explanation: 'Jam spesifik dan titik waktu presisi selalu menggunakan "AT" (at 8:30 AM).',
  },
  {
    id: 2,
    sentenceBefore: 'She was born',
    blankTarget: 'on',
    sentenceAfter: 'July 17th, 2002.',
    options: ['at', 'on', 'in'],
    explanation: 'Tanggal kalender spesifik (ada hari/angka tanggalnya) selalu menggunakan "ON" (on July 17th).',
  },
  {
    id: 3,
    sentenceBefore: 'They arrived',
    blankTarget: 'in',
    sentenceAfter: 'London three days ago.',
    options: ['at', 'on', 'in'],
    explanation: 'Nama kota, negara, dan wilayah teritorial luas selalu menggunakan "IN" (in London).',
  },
  {
    id: 4,
    sentenceBefore: 'I am reading a book',
    blankTarget: 'on',
    sentenceAfter: 'a crowded bus right now.',
    options: ['at', 'on', 'in'],
    explanation: 'Kendaraan transportasi umum besar di mana kita bisa berdiri dan berjalan menggunakan "ON" (on a bus).',
  },
  {
    id: 5,
    sentenceBefore: 'I usually sleep early',
    blankTarget: 'at',
    sentenceAfter: 'night.',
    options: ['at', 'on', 'in'],
    explanation: 'Pengecualian khusus: untuk waktu malam hari umum, bahasa Inggris selalu mewajibkan "AT night".',
  },
];

export const PrepositionsLesson = ({ onBack, onOpenPlayground }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalSlides = 5;

  // Slide 1 Pyramid Active Tier: 'in' | 'on' | 'at'
  const [activePyramidTier, setActivePyramidTier] = useState('in');

  // Slide 2 Time Filter: 'all' | 'at' | 'on' | 'in'
  const [timeCategory, setTimeCategory] = useState('all');

  // Slide 3 Place Filter: 'in' | 'on' | 'at'
  const [placeDimension, setPlaceDimension] = useState('in');

  // Slide 5 Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIdx]: selectedOption }
  const [showFeedback, setShowFeedback] = useState(false);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
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

  // Handler for Quiz answering in Slide 5
  const handleAnswerSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIdx]: option,
    }));
    setShowFeedback(true);
  };

  const handleNextQuizQuestion = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setShowFeedback(false);
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[quizIdx];
  const currentSelectedOption = selectedAnswers[quizIdx];
  const isAnswerCorrect = currentSelectedOption === currentQuestion.blankTarget;
  const isAllQuizCompleted = Object.keys(selectedAnswers).length === QUIZ_QUESTIONS.length && quizIdx === QUIZ_QUESTIONS.length - 1;

  // Preset to send to Grammar Playground
  const handleTriggerPlayground = () => {
    if (onOpenPlayground) {
      onOpenPlayground({
        sentenceType: 'nominal',
        subject: 'Sarah',
        nominalComplement: 'at school',
        timeSignal: 'at 7 PM yesterday',
        tense: 'PAST',
        aspect: 'SIMPLE',
      });
    }
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
            <span>Unit 3 • Prepositions (IN, ON, AT)</span>
            <span className="text-zinc-600">•</span>
            <span>Slide {currentSlide + 1} dari {totalSlides}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Interactive Slide Canvas - Flexible & Internal Scrollable */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ========================================================================= */}
            {/* SLIDE 1: PONDAI KONSEP (INVERTED PYRAMID DIAGRAM)                         */}
            {/* ========================================================================= */}
            {currentSlide === 0 && (
              <motion.div
                key="prep-slide-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center text-center py-4"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                  Piramida Terbalik: <span className="text-blue-400">IN</span>, <span className="text-purple-400">ON</span>, <span className="text-emerald-400">AT</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
                  Ketiga preposisi ini bergerak dari cakupan yang paling umum/besar hingga mengerucut ke titik yang paling presisi.
                </p>

                {/* Inverted Pyramid Visual Representation */}
                <div className="w-full max-w-xl flex flex-col items-center gap-2.5 my-2">
                  {/* Layer 1: IN (Widest Top Layer) */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActivePyramidTier('in')}
                    className={`w-full p-4 rounded-2xl cursor-pointer transition-all border ${
                      activePyramidTier === 'in'
                        ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-950/50'
                        : 'bg-[#121524] border-blue-900/40 hover:border-blue-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base sm:text-lg font-black text-blue-400">IN</span>
                      <span className="text-xs font-semibold text-blue-300">UMUM & CAKUPAN BESAR</span>
                    </div>
                    <div className="text-xs text-zinc-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span>Waktu: Abad, Tahun, Bulan, Musim</span>
                      <span className="text-blue-300/80">Tempat: Negara, Kota, Ruang Tertutup</span>
                    </div>
                  </motion.div>

                  {/* Layer 2: ON (Middle Layer) */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActivePyramidTier('on')}
                    className={`w-[85%] p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      activePyramidTier === 'on'
                        ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-950/50'
                        : 'bg-[#151328] border-purple-900/40 hover:border-purple-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base sm:text-lg font-black text-purple-400">ON</span>
                      <span className="text-xs font-semibold text-purple-300">MENENGAH & LEBIH SPESIFIK</span>
                    </div>
                    <div className="text-xs text-zinc-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span>Waktu: Hari & Tanggal</span>
                      <span className="text-purple-300/80">Tempat: Permukaan, Jalan, Transportasi Umum</span>
                    </div>
                  </motion.div>

                  {/* Layer 3: AT (Narrowest Point) */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActivePyramidTier('at')}
                    className={`w-[68%] p-3 rounded-2xl cursor-pointer transition-all border ${
                      activePyramidTier === 'at'
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/50'
                        : 'bg-[#101c1c] border-emerald-900/40 hover:border-emerald-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base sm:text-lg font-black text-emerald-400">AT</span>
                      <span className="text-xs font-semibold text-emerald-300">TITIK PRESISI & SPESIFIK</span>
                    </div>
                    <div className="text-xs text-zinc-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span>Waktu: Jam Tepat & Momen Khusus</span>
                      <span className="text-emerald-300/80">Tempat: Alamat Nomor & Titik Lokasi</span>
                    </div>
                  </motion.div>
                </div>

                {/* Detail Box based on active pyramid tier */}
                <div className="mt-4 p-4 rounded-xl bg-[#13151f] border border-[#232736] text-left w-full max-w-xl">
                  {activePyramidTier === 'in' && (
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="font-bold text-blue-400 mb-1">Contoh Nyata Penggunaan IN:</div>
                      <p>• <strong className="text-white">Waktu:</strong> in 2026 (tahun), in July (bulan), in the morning (bagian hari).</p>
                      <p>• <strong className="text-white">Tempat:</strong> in Indonesia (negara), in Jakarta (kota), in the room (ruangan berdinding).</p>
                    </div>
                  )}
                  {activePyramidTier === 'on' && (
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="font-bold text-purple-400 mb-1">Contoh Nyata Penggunaan ON:</div>
                      <p>• <strong className="text-white">Waktu:</strong> on Monday (hari), on July 17th (tanggal), on my birthday (hari spesial).</p>
                      <p>• <strong className="text-white">Tempat:</strong> on the desk (permukaan), on Sudirman Street (nama jalan), on a bus (kendaraan umum).</p>
                    </div>
                  )}
                  {activePyramidTier === 'at' && (
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="font-bold text-emerald-400 mb-1">Contoh Nyata Penggunaan AT:</div>
                      <p>• <strong className="text-white">Waktu:</strong> at 8:30 AM (jam presisi), at noon (tengah hari), at night (malam hari).</p>
                      <p>• <strong className="text-white">Tempat:</strong> at Jl. Merdeka No. 10 (alamat nomor), at the bus stop (titik jemput), at school (lokasi fungsi).</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 2: PREPOSITION OF TIME (KOMPARASI TABEL INTERAKTIF WAKTU)            */}
            {/* ========================================================================= */}
            {currentSlide === 1 && (
              <motion.div
                key="prep-slide-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center text-center py-4"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Preposition of <span className="text-amber-400">Time</span> (Waktu)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
                  Bagaimana membedakan jam spesifik, hari kalender, dan rentang waktu bulanan/tahunan?
                </p>

                {/* Category Selector Tabs */}
                <div className="flex items-center gap-2 mb-6">
                  {[
                    { id: 'all', label: 'Semua Waktu' },
                    { id: 'at', label: 'AT (Jam / Titik)' },
                    { id: 'on', label: 'ON (Hari / Tanggal)' },
                    { id: 'in', label: 'IN (Bulan / Tahun)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTimeCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-0 ${
                        timeCategory === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#181a24] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* 3 Interactive Cards / Comparison Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                  {/* AT Column */}
                  {(timeCategory === 'all' || timeCategory === 'at') && (
                    <div className="p-4 rounded-xl bg-[#111818] border border-emerald-900/50 flex flex-col justify-between">
                      <div>
                        <div className="text-emerald-400 font-bold text-sm mb-1">AT</div>
                        <div className="text-[11px] text-zinc-400 mb-3 font-medium">Titik Jam & Waktu Tepat</div>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span><strong className="text-white">at 5:00 PM</strong> (jam pasti)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span><strong className="text-white">at noon</strong> (tengah hari)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span><strong className="text-white">at midnight</strong> (tengah malam)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span><strong className="text-white">at sunset</strong> (saat senja)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-emerald-950 text-[11px] text-emerald-300/80">
                        Formula: Jam pada jam dinding.
                      </div>
                    </div>
                  )}

                  {/* ON Column */}
                  {(timeCategory === 'all' || timeCategory === 'on') && (
                    <div className="p-4 rounded-xl bg-[#161224] border border-purple-900/50 flex flex-col justify-between">
                      <div>
                        <div className="text-purple-400 font-bold text-sm mb-1">ON</div>
                        <div className="text-[11px] text-zinc-400 mb-3 font-medium">Hari & Tanggal Kalender</div>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span><strong className="text-white">on Sunday</strong> (nama hari)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span><strong className="text-white">on May 5th</strong> (tanggal)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span><strong className="text-white">on New Year's Day</strong> (hari libur 1 hari)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span><strong className="text-white">on Friday morning</strong> (hari + waktu)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-purple-950 text-[11px] text-purple-300/80">
                        Formula: Lembaran harian kalender.
                      </div>
                    </div>
                  )}

                  {/* IN Column */}
                  {(timeCategory === 'all' || timeCategory === 'in') && (
                    <div className="p-4 rounded-xl bg-[#101424] border border-blue-900/50 flex flex-col justify-between">
                      <div>
                        <div className="text-blue-400 font-bold text-sm mb-1">IN</div>
                        <div className="text-[11px] text-zinc-400 mb-3 font-medium">Bulan, Tahun, & Rentang Panjang</div>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span><strong className="text-white">in December</strong> (nama bulan)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span><strong className="text-white">in 2026</strong> (angka tahun)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span><strong className="text-white">in the morning</strong> (bagian hari umum)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span><strong className="text-white">in the 21st century</strong> (abad)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-950 text-[11px] text-blue-300/80">
                        Formula: Rentang waktu panjang.
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 3: PREPOSITION OF PLACE (KOMPARASI RUANG & TEMPAT)                  */}
            {/* ========================================================================= */}
            {currentSlide === 2 && (
              <motion.div
                key="prep-slide-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center text-center py-4"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Preposition of <span className="text-emerald-400">Place</span> (Tempat & Ruang)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
                  Membedakan ruang 3 Dimensi (IN), bidang permukaan 2 Dimensi (ON), dan titik koordinat 1 Dimensi (AT).
                </p>

                {/* Dimension Selector Tabs */}
                <div className="flex items-center gap-2 mb-6">
                  {[
                    { id: 'in', label: 'IN (Ruang 3D / Wilayah)', color: 'text-blue-400' },
                    { id: 'on', label: 'ON (Permukaan 2D / Jalan)', color: 'text-purple-400' },
                    { id: 'at', label: 'AT (Titik 1D / Alamat Nomor)', color: 'text-emerald-400' },
                  ].map((dim) => (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => setPlaceDimension(dim.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-0 ${
                        placeDimension === dim.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#181a24] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {dim.label}
                    </button>
                  ))}
                </div>

                {/* Dimension Detail Cards */}
                <div className="w-full text-left">
                  {placeDimension === 'in' && (
                    <div className="p-5 rounded-2xl bg-[#101424] border border-blue-900/50 space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
                        <span className="text-base font-bold text-blue-400">IN = Ruang Tertutup & Wilayah Teritorial</span>
                        <span className="text-xs text-zinc-400">Dimensi 3D (Didalamnya)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Ruangan / Kotak:</strong>
                          <span className="text-zinc-300">in the room, in a building, in the box, in a car</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Kota / Negara:</strong>
                          <span className="text-zinc-300">in Indonesia, in Tokyo, in Asia, in the neighborhood</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Cairan / Air:</strong>
                          <span className="text-zinc-300">in the swimming pool, in the ocean, in the river</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {placeDimension === 'on' && (
                    <div className="p-5 rounded-2xl bg-[#161224] border border-purple-900/50 space-y-4">
                      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                        <span className="text-base font-bold text-purple-400">ON = Permukaan Bidang, Jalan, & Transportasi</span>
                        <span className="text-xs text-zinc-400">Dimensi 2D (Menempel di Atas)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Permukaan Bidang:</strong>
                          <span className="text-zinc-300">on the table, on the wall, on the floor, on the ceiling</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Nama Jalanan:</strong>
                          <span className="text-zinc-300">on Sudirman Street, on 5th Avenue, on the highway</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Lantai & Media:</strong>
                          <span className="text-zinc-300">on the 2nd floor, on the internet, on TV, on a train</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {placeDimension === 'at' && (
                    <div className="p-5 rounded-2xl bg-[#111818] border border-emerald-900/50 space-y-4">
                      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                        <span className="text-base font-bold text-emerald-400">AT = Titik Spesifik & Alamat Nomor Rumah</span>
                        <span className="text-xs text-zinc-400">Dimensi 1D (Titik Koordinat / Tujuan)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Titik Lokasi Jemput:</strong>
                          <span className="text-zinc-300">at the bus stop, at the door, at the intersection, at the corner</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Alamat Lengkap Ber-nomor:</strong>
                          <span className="text-zinc-300">at 42 Wall Street, at Jl. Melati No. 5</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/30">
                          <strong className="text-white block mb-1">Fungsi / Institusi Sosial:</strong>
                          <span className="text-zinc-300">at school, at home, at work, at the station, at a concert</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 4: EXCEPTIONS & COMMON TRAPS (JEBAKAN UMUM)                         */}
            {/* ========================================================================= */}
            {currentSlide === 3 && (
              <motion.div
                key="prep-slide-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center text-center py-4"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Exceptions &amp; <span className="text-rose-400">Common Traps</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
                  Tiga jebakan tata bahasa yang paling sering memicu kesalahan bagi pembelajar:
                </p>

                {/* 3 Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
                  {/* Trap 1: Night */}
                  <div className="p-4 rounded-xl bg-[#141520] border border-amber-900/40 flex flex-col justify-between">
                    <div>
                      <div className="text-amber-400 font-bold text-xs uppercase tracking-wide mb-1.5">
                        Jebakan 1: Waktu Malam
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        Pagi/Sore vs Malam
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        Semua bagian hari memakai <strong className="text-blue-400">IN THE</strong>:
                      </p>
                      <div className="p-2 rounded-lg bg-black/30 text-[11px] text-zinc-300 font-mono mb-2">
                        • in the morning<br />
                        • in the afternoon<br />
                        • in the evening
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Tapi malam umum <strong className="text-emerald-400">WAJIB AT NIGHT</strong> (tanpa the!).
                      </p>
                    </div>
                    <div className="mt-3 p-2 rounded-lg bg-emerald-950/40 text-[11px] text-emerald-300">
                      ✅ I sleep at night.
                    </div>
                  </div>

                  {/* Trap 2: Public Transit */}
                  <div className="p-4 rounded-xl bg-[#141520] border border-blue-900/40 flex flex-col justify-between">
                    <div>
                      <div className="text-blue-400 font-bold text-xs uppercase tracking-wide mb-1.5">
                        Jebakan 2: Kendaraan
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        IN a car vs ON a bus
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        <strong className="text-white">Aturan Fisik:</strong> Bisakah kamu berdiri dan berjalan di dalamnya?
                      </p>
                      <div className="space-y-1.5 text-xs text-zinc-300">
                        <p>
                          • <strong className="text-purple-400">Bisa jalan (ON):</strong><br />
                          on a bus, on a train, on a plane, on a ship.
                        </p>
                        <p>
                          • <strong className="text-blue-400">Hanya duduk (IN):</strong><br />
                          in a car, in a taxi, in a helicopter.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded-lg bg-blue-950/40 text-[11px] text-blue-300">
                      ✅ She is on the train.
                    </div>
                  </div>

                  {/* Trap 3: Next/Last/This */}
                  <div className="p-4 rounded-xl bg-[#141520] border border-rose-900/40 flex flex-col justify-between">
                    <div>
                      <div className="text-rose-400 font-bold text-xs uppercase tracking-wide mb-1.5">
                        Jebakan 3: Tanpa Preposisi
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        Next, Last, This, Every
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        <strong className="text-rose-400">DILARANG</strong> menaruh in/on/at sebelum 4 kata ini:
                      </p>
                      <div className="space-y-1 text-xs text-zinc-300">
                        <p className="text-rose-400 line-through">❌ on next Sunday</p>
                        <p className="text-emerald-400">✅ next Sunday</p>
                        <p className="text-rose-400 line-through">❌ in last year</p>
                        <p className="text-emerald-400">✅ last year</p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded-lg bg-rose-950/40 text-[11px] text-rose-300">
                      ✅ See you next week!
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* SLIDE 5: CHECK & APPLY (5 SOAL FILL-IN-THE-BLANK) + CTA GRAMMAR PLAYGROUND */}
            {/* ========================================================================= */}
            {currentSlide === 4 && (
              <motion.div
                key="prep-slide-5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center text-center py-4"
              >
                {!isAllQuizCompleted ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                      Check &amp; <span className="text-blue-400">Apply</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
                      Pilih preposisi yang tepat untuk melengkapi kalimat di bawah:
                    </p>

                    {/* Question Card */}
                    <div className="w-full max-w-xl p-6 rounded-2xl bg-[#131520] border border-[#232736] mb-6 text-center">
                      <div className="text-xs font-semibold text-zinc-500 mb-4">
                        Soal {quizIdx + 1} dari {QUIZ_QUESTIONS.length}
                      </div>

                      {/* Sentence with Blank Line */}
                      <div className="text-lg sm:text-2xl font-bold text-white tracking-tight mb-6 flex flex-wrap items-center justify-center gap-2">
                        <span>{currentQuestion.sentenceBefore}</span>
                        <span className={`inline-block px-3 py-1 rounded-lg border font-mono font-bold transition-all ${
                          currentSelectedOption
                            ? isAnswerCorrect
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950/80 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-zinc-700 text-zinc-500'
                        }`}>
                          {currentSelectedOption || '_____'}
                        </span>
                        <span>{currentQuestion.sentenceAfter}</span>
                      </div>

                      {/* 3 Instant Choice Buttons: [at] [on] [in] */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {currentQuestion.options.map((opt) => {
                          const isChosen = currentSelectedOption === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleAnswerSelect(opt)}
                              className={`w-20 h-12 rounded-xl text-base font-bold transition-all cursor-pointer border ${
                                isChosen
                                  ? opt === currentQuestion.blankTarget
                                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40'
                                    : 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/40'
                                  : 'bg-[#1b1f2e] border-zinc-700/80 text-zinc-200 hover:bg-[#252a3e] hover:border-zinc-500'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback Box */}
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3.5 rounded-xl text-left text-xs leading-relaxed border ${
                            isAnswerCorrect
                              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5 mb-1">
                            {isAnswerCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Tepat Sekali!</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span>Kurang Tepat, jawaban yang benar adalah "{currentQuestion.blankTarget}"</span>
                              </>
                            )}
                          </div>
                          <div>{currentQuestion.explanation}</div>
                        </motion.div>
                      )}
                    </div>

                    {/* Next Question Button if feedback shown */}
                    {showFeedback && quizIdx < QUIZ_QUESTIONS.length - 1 && (
                      <button
                        type="button"
                        onClick={handleNextQuizQuestion}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer border-0 transition-colors"
                      >
                        <span>Soal Berikutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                ) : (
                  /* Completion and CTA to Grammar Playground */
                  <div className="w-full max-w-xl p-8 rounded-2xl bg-[#131520] border border-[#232736] text-center space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        5/5 Soal Tuntas!
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
                        Kamu telah memahami hierarki piramida <strong className="text-blue-400">IN</strong>, <strong className="text-purple-400">ON</strong>, dan <strong className="text-emerald-400">AT</strong> untuk menyatakan waktu dan tempat.
                      </p>
                    </div>

                    {/* Direct CTA to Grammar Playground */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleTriggerPlayground}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-950/50 flex items-center justify-center gap-2.5 cursor-pointer border-0 transition-all hover:scale-[1.02]"
                      >
                        <span>Coba Praktikkan di Grammar Playground</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] text-zinc-500 mt-2">
                        Membuka simulator dengan preset komplemen tempat dan penanda waktu IN / ON / AT
                      </p>
                    </div>
                  </div>
                )}
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
          {currentSlide === totalSlides - 1 ? (
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

export default PrepositionsLesson;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';
import {
  InteractiveExampleList,
  SentenceConstructionStep,
  StatementStep,
} from './templates';

const layoutTransition = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1],
};

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.85, 0, 0.15, 1],
    },
  },
  exit: (dir) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.85, 0, 0.15, 1],
    },
  }),
};

// =============================================================================
// CURRICULUM DEFINITION (7 SLIDES STRICTLY ADHERING TO AGENTS.md & RULES.md)
// =============================================================================
const slidesData = [
  // ---------------------------------------------------------------------------
  // SLIDE 1: Apa itu Helper WILL? & Garis Waktu Future
  // ---------------------------------------------------------------------------
  {
    slideNum: 1,
    title: 'Apa itu Helper WILL?',
    subtitle: 'Mengenal konsep waktu masa depan (Future) dan peran kata bantu WILL.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        explanation:
          'Setelah menguasai masa sekarang (Present) dan masa lalu (Past), kini saatnya melangkah ke masa depan. Helper WILL adalah kata bantu yang berarti "AKAN".',
      },
      {
        subStep: 2,
        explanation:
          'Helper WILL digunakan untuk menyatakan aksi, rencana, janji, atau keputusan spontan yang akan dilakukan setelah saat ini.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 2: Aturan Emas Helper WILL (Universal & Murni)
  // ---------------------------------------------------------------------------
  {
    slideNum: 2,
    title: 'Aturan Emas Helper WILL',
    subtitle: 'Helper paling ramah dan konsisten di seluruh tata bahasa Inggris.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        explanation:
          '1. Bersifat Universal untuk SEMUA Subjek: I, You, We, They, He, She, It, subjek jamak, maupun tunggal seluruhnya 100% menggunakan WILL tanpa perubahan bentuk apa pun (tidak ada bentuk "wills").',
      },
      {
        subStep: 2,
        explanation:
          '2. Wajib Diikuti Verb-1 Murni (Bentuk Dasar): Setelah Helper WILL, kata kerja HARAM ditambah imbuhan (-s/-es, -ed, maupun -ing). Kata kerja selalu kembali ke bentuk kamus aslinya.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 3: Common Pitfall (Jebakan Fatal yang Sering Terjadi)
  // ---------------------------------------------------------------------------
  {
    slideNum: 3,
    title: 'Common Pitfalls (Jebakan Fatal)',
    subtitle: 'Hindari penambahan akhiran pada kata kerja setelah Helper WILL.',
    type: 'pitfall',
    context: 'Dia akan bekerja besok',
    steps: [
      {
        subStep: 1,
        isCorrect: false,
        verb: 'works',
        explanation:
          'Salah total! Meskipun subjeknya "He", setelah Helper WILL kata kerja TIDAK BOLEH ditambah akhiran -s (bukan "will works").',
      },
      {
        subStep: 2,
        isCorrect: true,
        verb: 'work',
        explanation:
          'Tepat sekali! Setelah WILL, kata kerja wajib kembali ke bentuk dasar murni (Verb-1) tanpa embel-embel imbuhan apa pun.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 4: Penanda Waktu Khas Masa Depan (Time Signals)
  // ---------------------------------------------------------------------------
  {
    slideNum: 4,
    title: 'Penanda Waktu Masa Depan (Time Signals)',
    subtitle: 'Kosa kata waktu yang menjadi petunjuk alami penggunaan Helper WILL.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        explanation:
          'Waktu masa depan (Future) memiliki penanda waktu khas seperti "tomorrow" (besok), "tonight" (nanti malam), "soon" (segera), dan "later" (nanti).',
      },
      {
        subStep: 2,
        explanation:
          'Serta seluruh penanda waktu berawalan "next", seperti "next week" (minggu depan), "next month" (bulan depan), dan "next year" (tahun depan).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 5: Membangun Kalimat Step-by-Step (SentenceConstructionStep Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 5,
    title: 'Membangun Kalimat Step-by-Step',
    subtitle: 'Evolusi struktur kalimat dari Positif (+), Negatif (-), hingga Tanya (?).',
    type: 'construction',
    steps: [
      {
        subStep: 1,
        mode: 'pos',
        modeLabel: 'Positif (+)',
        context: 'Saya akan belajar nanti malam',
        explanation:
          'Kalimat positif masa depan cukup menyisipkan WILL di antara Subjek dan kata kerja Verb-1.',
      },
      {
        subStep: 2,
        mode: 'neg',
        modeLabel: 'Negasi (-)',
        context: 'Saya TIDAK akan belajar nanti malam',
        explanation:
          'Untuk negasi, tambahkan "not" tepat setelah WILL. "will not" juga sangat umum disingkat menjadi "won\'t".',
      },
      {
        subStep: 3,
        mode: 'q',
        modeLabel: 'Tanya (?)',
        context: 'Apakah kamu akan belajar nanti malam?',
        explanation:
          'Untuk membuat kalimat tanya, tukar posisi: pindahkan WILL ke paling depan sebelum subjek.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 6: Daftar Contoh: Berbagai Subjek (InteractiveExampleList Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 6,
    title: 'Daftar Contoh: Berbagai Subjek',
    subtitle: 'Perhatikan bahwa WILL tetap konsisten untuk semua jenis subjek.',
    type: 'interactive-list',
    group: 'subjects',
    rows: [
      {
        id: 'Saya akan datang besok',
        subject: 'I',
        subjectLower: 'you',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: 'will not',
        verbBase: 'come',
        complement: 'tomorrow',
      },
      {
        id: 'Dia akan memasak makan malam nanti malam',
        subject: 'She',
        subjectLower: 'she',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: 'will not',
        verbBase: 'cook',
        complement: 'dinner tonight',
      },
      {
        id: 'Mereka akan mengunjungi museum minggu depan',
        subject: 'They',
        subjectLower: 'they',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: 'will not',
        verbBase: 'visit',
        complement: 'the museum next week',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 7: Daftar Contoh: Bentuk Singkatan (Won't)
  // ---------------------------------------------------------------------------
  {
    slideNum: 7,
    title: "Daftar Contoh: Bentuk Singkatan (Won't)",
    subtitle: "Bentuk negatif 'will not' secara alami disingkat menjadi 'won't'.",
    type: 'interactive-list',
    group: 'contractions',
    rows: [
      {
        id: 'Kami akan membantu kamu',
        subject: 'We',
        subjectLower: 'we',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: "won't",
        verbBase: 'help',
        complement: 'you',
      },
      {
        id: 'Dia akan membeli mobil baru segera',
        subject: 'He',
        subjectLower: 'he',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: "won't",
        verbBase: 'buy',
        complement: 'a new car soon',
      },
      {
        id: 'Sarah akan menelepon kamu nanti',
        subject: 'Sarah',
        subjectLower: 'Sarah',
        posHelper: 'will',
        helperCap: 'Will',
        negHelper: "won't",
        verbBase: 'call',
        complement: 'you later',
      },
    ],
  },
];

export const HelperModalWillLesson = ({ onBack }) => {
  // Flatten all sub-steps across the 7 slides into a single linear array
  const flatSteps = useMemo(() => {
    const list = [];

    slidesData.forEach((slide, sIdx) => {
      if (slide.type === 'statement' || slide.type === 'pitfall' || slide.type === 'construction') {
        slide.steps.forEach((step, subIdx) => {
          list.push({
            slideIdx: sIdx,
            slideNum: slide.slideNum,
            slideTitle: slide.title,
            slideSubtitle: slide.subtitle,
            slideType: slide.type,
            slideData: slide,
            stepData: step,
            subStepIdx: subIdx,
            totalSubStepsInSlide: slide.steps.length,
          });
        });
      } else if (slide.type === 'interactive-list') {
        const totalReveals = slide.rows.length * 3;
        for (let count = 0; count <= totalReveals; count++) {
          list.push({
            slideIdx: sIdx,
            slideNum: slide.slideNum,
            slideTitle: slide.title,
            slideSubtitle: slide.subtitle,
            slideType: slide.type,
            slideData: slide,
            listStepCount: count,
            subStepIdx: count,
            totalSubStepsInSlide: totalReveals + 1,
          });
        }
      }
    });

    return list;
  }, []);

  const [currentFlatIdx, setCurrentFlatIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalFlatSteps = flatSteps.length;
  const currentStep = flatSteps[currentFlatIdx] || flatSteps[0];

  // Micro-step navigation: strictly 1 sub-step per action
  const goToNext = useCallback(() => {
    if (currentFlatIdx < totalFlatSteps - 1) {
      setDirection(1);
      setCurrentFlatIdx((prev) => prev + 1);
    }
  }, [currentFlatIdx, totalFlatSteps]);

  const goToPrev = useCallback(() => {
    if (currentFlatIdx > 0) {
      setDirection(-1);
      setCurrentFlatIdx((prev) => prev - 1);
    }
  }, [currentFlatIdx]);

  // Keyboard navigation: ArrowRight / Space = Next, ArrowLeft = Prev, Esc = Exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onBack]);

  // Direct jumper for interactive list row clicking
  const handleJumpToListRow = (rowIndex) => {
    if (currentStep.slideType !== 'interactive-list') return;
    const currentCount = currentStep.listStepCount;
    const rowBase = rowIndex * 3;
    let nextCount = currentCount;

    if (currentCount <= rowBase) {
      nextCount = rowBase + 1;
    } else if (currentCount === rowBase + 1) {
      nextCount = rowBase + 2;
    } else if (currentCount === rowBase + 2) {
      nextCount = rowBase + 3;
    } else if (currentCount >= rowBase + 3) {
      nextCount = rowBase;
    }

    const targetIdx = flatSteps.findIndex(
      (s) => s.slideIdx === currentStep.slideIdx && s.listStepCount === nextCount
    );
    if (targetIdx !== -1) {
      setDirection(targetIdx >= currentFlatIdx ? 1 : -1);
      setCurrentFlatIdx(targetIdx);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#090a0f] text-zinc-100 select-none font-sans">
      {/* 1. Header (Sticky Top / Fixed) */}
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

          {/* Clean Step Counter */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>
              Slide {currentStep.slideNum} dari {slidesData.length} • Langkah{' '}
              {currentStep.subStepIdx + 1} dari {currentStep.totalSubStepsInSlide}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Scroll Safe Area (Center Aligned Vertically & Horizontally) */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center">
          <motion.div
            layout
            transition={layoutTransition}
            className="w-full max-w-4xl flex flex-col items-center justify-center my-auto"
          >
            {/* ------------------------------------------------------------- */}
            {/* PERSISTENT HEADER (OUTSIDE AnimatePresence)                   */}
            {/* Smooth layout FLIP animation (min 700ms) with zero jumping   */}
            {/* ------------------------------------------------------------- */}
            <motion.div
              layout
              transition={layoutTransition}
              className="text-center mb-6 max-w-2xl px-4"
            >
              <motion.h1
                layout="position"
                transition={layoutTransition}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2"
              >
                {currentStep.slideTitle}
              </motion.h1>
              <motion.p
                layout="position"
                transition={layoutTransition}
                className="text-sm sm:text-base text-slate-400 leading-relaxed"
              >
                {currentStep.slideSubtitle}
              </motion.p>
            </motion.div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE CONTENT VIEW (KEYED BY slideNum TO PREVENT UNMOUNTING)  */}
            {/* ------------------------------------------------------------- */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`slide-view-${currentStep.slideNum}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center justify-center"
              >
                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 1, 2, 4: STATEMENT (Concept Explanations)      */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'statement' && (
                  <StatementStep explanation={currentStep.stepData.explanation} />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 3: COMMON PITFALL                              */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'pitfall' && (
                  <SentenceConstructionStep
                    contextIndo={currentStep.slideData.context}
                    tokens={[
                      { id: 'subj', text: 'He', color: 'text-white font-bold' },
                      { id: 'helper', text: 'will', color: 'text-blue-400 font-black' },
                      {
                        id: 'verb',
                        text: currentStep.stepData.verb,
                        color: currentStep.stepData.isCorrect
                          ? 'text-emerald-400 font-extrabold underline decoration-emerald-400 decoration-2 underline-offset-8'
                          : 'text-rose-400 font-extrabold underline decoration-rose-400 decoration-2 underline-offset-8',
                        roll: true,
                      },
                      { id: 'comp', text: 'tomorrow', color: 'text-slate-300' },
                    ]}
                    status={currentStep.stepData.isCorrect ? 'check' : 'cross'}
                    description={currentStep.stepData.explanation}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 5: SENTENCE CONSTRUCTION                       */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'construction' && (
                  <SentenceConstructionStep
                    contextIndo={currentStep.stepData.context}
                    tokens={
                      currentStep.stepData.subStep === 3
                        ? [
                            { id: 'helper', text: 'Will', color: 'text-amber-400 font-black' },
                            { id: 'subj', text: 'you', color: 'text-white' },
                            { id: 'verb', text: 'study', color: 'text-sky-400 font-black', roll: true },
                            { id: 'comp', text: 'tonight', color: 'text-slate-200' },
                            { id: 'qmark', text: '?', color: 'text-amber-400 font-black' },
                          ]
                        : currentStep.stepData.subStep === 2
                        ? [
                            { id: 'subj', text: 'I', color: 'text-white' },
                            { id: 'helper', text: 'will not', color: 'text-rose-400 font-black' },
                            { id: 'verb', text: 'study', color: 'text-sky-400 font-black', roll: true },
                            { id: 'comp', text: 'tonight', color: 'text-slate-200' },
                          ]
                        : [
                            { id: 'subj', text: 'I', color: 'text-white' },
                            { id: 'helper', text: 'will', color: 'text-blue-400 font-black' },
                            { id: 'verb', text: 'study', color: 'text-emerald-400 font-bold', roll: true },
                            { id: 'comp', text: 'tonight', color: 'text-slate-200' },
                          ]
                    }
                    description={currentStep.stepData.explanation}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 6 & 7: INTERACTIVE EXAMPLE LIST                */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'interactive-list' && (
                  <div className="w-full max-w-2xl flex flex-col items-center">
                    <InteractiveExampleList
                      items={currentStep.slideData.rows}
                      revealedRows={currentStep.listStepCount}
                      onRowClick={handleJumpToListRow}
                    />

                    <div className="text-xs text-slate-500 font-mono mt-4">
                      {currentStep.listStepCount < currentStep.slideData.rows.length * 3 ? (
                        <span>
                          Tekan <kbd className="text-slate-300 font-sans">Space</kbd> atau klik panah untuk
                          melanjutkan ({currentStep.listStepCount} / {currentStep.slideData.rows.length * 3})
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">
                          Seluruh contoh tuntas dipelajari!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* 3. Footer Navigasi (Sticky Bottom) */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          {/* Tombol < */}
          <Button
            variant="secondary"
            onClick={goToPrev}
            disabled={currentFlatIdx === 0}
            aria-label="Sebelumnya"
            title="Langkah Sebelumnya (<)"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentFlatIdx === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg
              className="w-4 h-4 fill-current shrink-0 rotate-180"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>

          {/* Stepping Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slidesData.map((s, idx) => (
              <div
                key={`dot-slide-${idx}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep.slideIdx === idx
                    ? 'w-6 bg-blue-500'
                    : currentStep.slideIdx > idx
                    ? 'w-1.5 bg-blue-500/40'
                    : 'w-1.5 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          {/* Tombol > */}
          <Button
            variant="primary"
            onClick={goToNext}
            disabled={currentFlatIdx === totalFlatSteps - 1}
            aria-label="Selanjutnya"
            title="Langkah Selanjutnya (> atau Space)"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentFlatIdx === totalFlatSteps - 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HelperModalWillLesson;

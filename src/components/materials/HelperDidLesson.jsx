import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';
import {
  InteractiveExampleList,
  VerbMorphingStep,
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
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (dir) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// =============================================================================
// CURRICULUM DEFINITION (7 SLIDES STRICTLY ADHERING TO AGENTS.md)
// =============================================================================
const slidesData = [
  // ---------------------------------------------------------------------------
  // SLIDE 1: Apa itu Helper DID?
  // ---------------------------------------------------------------------------
  {
    slideNum: 1,
    title: 'Apa itu Helper DID?',
    subtitle: 'Mengenal peran dan esensi kata bantu DID dalam kalimat lampau.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        explanation:
          'Helper DID adalah bentuk lampau (Past) dari DO dan DOES. Helper ini bertugas mengawal kalimat verbal di masa lalu.',
      },
      {
        subStep: 2,
        explanation:
          'Hebatnya, DID bersifat UNIVERSAL dan digunakan untuk SEMUA subjek (I, You, We, They, He, She, It, Jamak, maupun Tunggal).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 2: Aturan Emas Helper DID
  // ---------------------------------------------------------------------------
  {
    slideNum: 2,
    title: 'Aturan Emas Helper DID',
    subtitle: 'Aturan Kembalinya Verb ke Bentuk Dasar (Verb-1)',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        explanation:
          'Pada kalimat positif lampau, kita wajib menggunakan Verb-2 murni tanpa Helper DID (contoh: They played football yesterday).',
      },
      {
        subStep: 2,
        explanation:
          'Namun saat kalimat berubah menjadi Negatif (-) atau Tanya (?), Helper DID muncul dan MENYERAP tanda lampau tersebut, sehingga kata kerja utama WAJIB KEMBALI ke Verb-1!',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 3: Common Pitfall (Jebakan Fatal yang Sering Terjadi)
  // ---------------------------------------------------------------------------
  {
    slideNum: 3,
    title: 'Common Pitfall (Jebakan Fatal)',
    subtitle: 'Hindari kesalahan umum penggunaan Verb-2 ganda bersamaan dengan DID.',
    type: 'pitfall',
    context: 'Saya tidak makan tadi malam',
    steps: [
      {
        subStep: 1,
        isCorrect: false,
        verb: 'ate',
        explanation: "Salah total! Karena sudah ada 'didn't', tidak boleh lagi memakai Verb-2 (ate).",
      },
      {
        subStep: 2,
        isCorrect: true,
        verb: 'eat',
        explanation: 'Benar! Bentuk kata kerja wajib kembali ke bentuk dasar Verb-1 (eat).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 4: Pola Kembalinya Kata Kerja ke Verb-1 (VerbMorphingStep Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 4,
    title: 'Pola Kembalinya Kata Kerja ke Verb-1',
    subtitle: 'Perhatikan bagaimana akhiran lampau dilepas dan kembali ke bentuk dasar.',
    type: 'morph',
    items: [
      {
        id: 'played',
        category: 'KATA KERJA BERATURAN (REGULAR)',
        morphType: 'stem-suffix',
        stem: 'play',
        suffix: 'ed',
        breadcrumb: ['played (V2)', 'hilangkan -ed', 'play (V1)'],
        explanation: 'Pada kalimat negatif/tanya dengan DID, akhiran -ed dilepas kembali ke bentuk dasar.',
        stages: [
          { stage: 0, label: 'played (V2)', hasSuffix: true, suffixColor: 'white' },
          { stage: 1, label: 'hilangkan -ed', hasSuffix: true, suffixColor: 'rose' },
          { stage: 2, label: 'play (V1)', hasSuffix: false, stemColor: 'emerald' },
        ],
      },
      {
        id: 'closed',
        category: 'KATA KERJA BERAKHIRAN -D',
        morphType: 'stem-suffix',
        stem: 'close',
        suffix: 'd',
        breadcrumb: ['closed (V2)', 'hilangkan -d', 'close (V1)'],
        explanation: 'Akhiran -d dilepas kembali ke kata dasar close.',
        stages: [
          { stage: 0, label: 'closed (V2)', hasSuffix: true, suffixColor: 'white' },
          { stage: 1, label: 'hilangkan -d', hasSuffix: true, suffixColor: 'rose' },
          { stage: 2, label: 'close (V1)', hasSuffix: false, stemColor: 'emerald' },
        ],
      },
      {
        id: 'went',
        category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
        morphType: 'rolling',
        breadcrumb: ['went (V2)', 'kembali ke asal', 'go (V1)'],
        explanation: "Bentuk lampau 'went' kembali seutuhnya menjadi 'go'.",
        stages: [
          { stage: 0, label: 'went (V2)', word: 'went' },
          { stage: 1, label: 'kembali ke asal', word: 'went ➔ go' },
          { stage: 2, label: 'go (V1)', word: 'go' },
        ],
      },
      {
        id: 'bought',
        category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
        morphType: 'rolling',
        breadcrumb: ['bought (V2)', 'kembali ke asal', 'buy (V1)'],
        explanation: "'Bought' kembali ke bentuk aslinya yaitu 'buy'.",
        stages: [
          { stage: 0, label: 'bought (V2)', word: 'bought' },
          { stage: 1, label: 'kembali ke asal', word: 'bought ➔ buy' },
          { stage: 2, label: 'buy (V1)', word: 'buy' },
        ],
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
        context: 'Mereka bermain sepak bola kemarin',
        explanation: 'Kalimat positif lampau WAJIB menggunakan Verb-2 murni (played) tanpa Helper DID.',
      },
      {
        subStep: 2,
        mode: 'neg',
        modeLabel: 'Negasi (-)',
        context: 'Mereka TIDAK bermain sepak bola kemarin',
        explanation: "Ketika 'did not' masuk, kata kerja 'played' luruh kembali ke Verb-1 'play'.",
      },
      {
        subStep: 3,
        mode: 'q',
        modeLabel: 'Tanya (?)',
        context: 'Apakah mereka bermain sepak bola kemarin?',
        explanation: 'Untuk membuat kalimat tanya, pindahkan DID ke depan dan pastikan kata kerja tetap Verb-1.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 6: Daftar Contoh Transformasi (Grup Regular)
  // ---------------------------------------------------------------------------
  {
    slideNum: 6,
    title: 'Daftar Contoh: Grup Regular',
    subtitle: 'Perhatikan perubahan dari Indonesia ➔ Positif (+) ➔ Negatif (-) ➔ Tanya (?).',
    type: 'interactive-list',
    group: 'regular',
    rows: [
      {
        id: 'Kami menonton film tadi malam',
        subject: 'We',
        subjectLower: 'we',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'watch',
        verbV2: 'watched',
        complement: 'the movie last night',
      },
      {
        id: 'Dia membersihkan kamarnya kemarin',
        subject: 'He',
        subjectLower: 'he',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'clean',
        verbV2: 'cleaned',
        complement: 'his room yesterday',
      },
      {
        id: 'Mereka tinggal di sini tahun lalu',
        subject: 'They',
        subjectLower: 'they',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'live',
        verbV2: 'lived',
        complement: 'here last year',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 7: Daftar Contoh Transformasi (Grup Irregular)
  // ---------------------------------------------------------------------------
  {
    slideNum: 7,
    title: 'Daftar Contoh: Grup Irregular',
    subtitle: 'Perhatikan perubahan kata kerja tidak beraturan saat DID masuk.',
    type: 'interactive-list',
    group: 'irregular',
    rows: [
      {
        id: 'Saya meminum kopi pagi ini',
        subject: 'I',
        subjectLower: 'you',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'drink',
        verbV2: 'drank',
        complement: 'coffee this morning',
      },
      {
        id: 'Sarah pergi ke pasar tadi pagi',
        subject: 'Sarah',
        subjectLower: 'Sarah',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'go',
        verbV2: 'went',
        complement: 'to the market',
      },
      {
        id: 'Ayah membeli mobil baru minggu lalu',
        subject: 'Father',
        subjectLower: 'father',
        helperCap: 'Did',
        negHelper: "didn't",
        verbBase: 'buy',
        verbV2: 'bought',
        complement: 'a new car',
      },
    ],
  },
];

export const HelperDidLesson = ({ onBack }) => {
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
      } else if (slide.type === 'morph') {
        slide.items.forEach((item, itemIdx) => {
          item.stages.forEach((stage, stageIdx) => {
            list.push({
              slideIdx: sIdx,
              slideNum: slide.slideNum,
              slideTitle: slide.title,
              slideSubtitle: slide.subtitle,
              slideType: slide.type,
              slideData: slide,
              item,
              itemIdx,
              stage,
              stageIdx,
              subStepIdx: itemIdx * 3 + stageIdx,
              totalSubStepsInSlide: slide.items.length * 3,
            });
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

  // Jump to morph stage
  const handleJumpToMorphStage = (itemIdx, stageIdx) => {
    const targetIdx = flatSteps.findIndex(
      (s) => s.slideType === 'morph' && s.itemIdx === itemIdx && s.stageIdx === stageIdx
    );
    if (targetIdx !== -1) {
      setDirection(targetIdx >= currentFlatIdx ? 1 : -1);
      setCurrentFlatIdx(targetIdx);
    }
  };

  // Jump to row state in Slide 6 or 7
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

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>A1 • Helper DID</span>
            <span className="text-zinc-600">•</span>
            <span>
              Slide {currentStep.slideNum} dari 7 • Langkah {currentFlatIdx + 1} dari {totalFlatSteps}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Safe Area Scroll Wrapper */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center">
          {/* PERSISTENT HEADER (Di LUAR AnimatePresence) */}
          <motion.div
            layout="position"
            transition={layoutTransition}
            className="w-full max-w-2xl text-center mb-6 shrink-0"
          >
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">
              Slide {currentStep.slideNum} dari 7
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              {currentStep.slideTitle}
            </h1>
            {currentStep.slideSubtitle && (
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
                {currentStep.slideSubtitle}
              </p>
            )}
          </motion.div>

          {/* PERSISTENT SLIDE CONTAINER WRAPPER (Keyed by slideNum) */}
          <motion.div
            layout="position"
            transition={layoutTransition}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`slide-view-${currentStep.slideNum}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center"
              >
                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 1 & SLIDE 2: STATEMENT                         */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'statement' && (
                  <StatementStep
                    paragraphs={currentStep.stepData.explanation}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 3: COMMON PITFALL                              */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'pitfall' && (
                  <SentenceConstructionStep
                    contextIndo={currentStep.slideData.context}
                    tokens={[
                      { id: 'pref', text: "I didn't", color: 'text-white' },
                      {
                        id: 'verb',
                        text: currentStep.stepData.verb,
                        color: currentStep.stepData.isCorrect
                          ? 'text-emerald-400 font-extrabold underline decoration-emerald-400 decoration-2 underline-offset-8'
                          : 'text-rose-400 font-extrabold underline decoration-rose-400 decoration-2 underline-offset-8',
                        roll: true,
                      },
                      { id: 'suff', text: 'last night', color: 'text-white' },
                    ]}
                    status={currentStep.stepData.isCorrect ? 'check' : 'cross'}
                    description={currentStep.stepData.explanation}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 4: VERB MORPH STEP                             */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'morph' && (
                  <VerbMorphingStep
                    category={currentStep.item.category}
                    breadcrumb={currentStep.item.breadcrumb}
                    activeBreadcrumbIdx={currentStep.stageIdx}
                    stem={currentStep.item.stem}
                    suffix={currentStep.item.suffix}
                    hasSuffix={currentStep.stage.hasSuffix}
                    suffixColor={
                      currentStep.stage.suffixColor === 'rose'
                        ? 'text-rose-400 underline decoration-rose-400 decoration-4 underline-offset-8'
                        : 'text-sky-400'
                    }
                    word={
                      currentStep.item.morphType === 'rolling'
                        ? currentStep.item.stages[currentStep.stageIdx].word
                        : ''
                    }
                    description={currentStep.item.explanation}
                    onBreadcrumbClick={(idx) => handleJumpToMorphStage(currentStep.itemIdx, idx)}
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
                            { id: 'helper', text: 'Did', color: 'text-amber-400 font-black' },
                            { id: 'subj', text: 'they', color: 'text-white' },
                            { id: 'verb', text: 'play', color: 'text-sky-400 font-black', roll: true },
                            { id: 'comp', text: 'football yesterday', color: 'text-slate-200' },
                            { id: 'qmark', text: '?', color: 'text-amber-400 font-black' },
                          ]
                        : currentStep.stepData.subStep === 2
                        ? [
                            { id: 'subj', text: 'They', color: 'text-white' },
                            { id: 'helper', text: 'did not', color: 'text-rose-400 font-black' },
                            { id: 'verb', text: 'play', color: 'text-sky-400 font-black', roll: true },
                            { id: 'comp', text: 'football yesterday', color: 'text-slate-200' },
                          ]
                        : [
                            { id: 'subj', text: 'They', color: 'text-white' },
                            { id: 'verb', text: 'played', color: 'text-emerald-400 font-bold', roll: true },
                            { id: 'comp', text: 'football yesterday', color: 'text-slate-200' },
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
                    ? 'w-2 bg-blue-900/60'
                    : 'w-1.5 bg-zinc-800'
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
            title="Langkah Selanjutnya (>)"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentFlatIdx === totalFlatSteps - 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
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

export default HelperDidLesson;

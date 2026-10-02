import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  StatementStep,
  VerbMorphingStep,
  SentenceConstructionStep,
  InteractiveExampleList
} from './templates';

export default function HelperDidLesson({ onBack }) {
  const slidesData = useMemo(() => [
    // SLIDE 1: Apa itu Helper DID?
    {
      id: 'intro',
      title: 'Apa itu Helper DID?',
      subtitle: 'Mengenal esensi kata bantu DID pada dimensi waktu lampau.',
      steps: [
        {
          type: 'statement',
          headline: 'Apa itu Helper DID?',
          description: null
        },
        {
          type: 'statement',
          headline: 'Apa itu Helper DID?',
          description: 'Helper DID adalah bentuk lampau (Past) dari DO dan DOES. Sifatnya UNIVERSAL dan berlaku untuk SEMUA subjek (I, You, We, They, He, She, It, Jamak, Tunggal).'
        }
      ]
    },

    // SLIDE 2: Aturan Emas
    {
      id: 'golden-rule',
      title: 'Aturan Kembalinya Verb ke Bentuk Dasar',
      subtitle: 'Kaidah mutlak perubahan kata kerja saat bertemu Helper DID.',
      steps: [
        {
          type: 'statement',
          headline: 'Setelah DID, Kata Kerja WAJIB Kembali ke Verb-1.',
          description: 'Pada kalimat positif lampau, kita wajib menggunakan Verb-2 murni tanpa DID. Namun saat berubah menjadi Negatif (-) atau Tanya (?), Helper DID hadir dan MENYERAP sifat lampau tersebut, sehingga kata kerja utama wajib kembali ke bentuk awal (Verb-1).'
        }
      ]
    },

    // SLIDE 3: Common Pitfall Check
    {
      id: 'pitfall',
      title: 'Common Pitfall (Jebakan Fatal)',
      subtitle: 'Hindari kesalahan umum memakai dua bentuk lampau secara bersamaan.',
      steps: [
        {
          type: 'construction',
          contextIndo: 'Saya tidak makan tadi malam',
          tokens: [
            { id: 'subj', text: 'I' },
            { id: 'neg', text: "didn't", color: 'text-rose-400' },
            { id: 'verb', text: 'ate', color: 'text-rose-400 underline underline-offset-8' },
            { id: 'time', text: 'last night' }
          ],
          status: 'cross',
          description: "Salah total! Karena sudah ada \"didn't\", tidak boleh lagi memakai Verb-2 (ate)."
        },
        {
          type: 'construction',
          contextIndo: 'Saya tidak makan tadi malam',
          tokens: [
            { id: 'subj', text: 'I' },
            { id: 'neg', text: "didn't", color: 'text-sky-400' },
            { id: 'verb', text: 'eat', color: 'text-emerald-400' },
            { id: 'time', text: 'last night' }
          ],
          status: 'check',
          description: 'Benar! Bentuk kata kerja wajib kembali ke bentuk dasar Verb-1 (eat).'
        }
      ]
    },

    // SLIDE 4: Morfologi Pelepasan Akhiran (Letter-Level & Word Odometer)
    {
      id: 'morphing',
      title: 'Pola Kembalinya Kata Kerja ke Verb-1',
      subtitle: 'Perhatikan bagaimana akhiran lampau dilepas dan kembali ke bentuk dasar.',
      steps: [
        // Regular: played -> play
        {
          type: 'morph',
          category: 'KATA KERJA BERATURAN (REGULAR)',
          breadcrumb: ['played (V2)', 'hilangkan -ed', 'play (V1)'],
          activeBreadcrumbIdx: 0,
          stem: 'play',
          suffix: 'ed',
          hasSuffix: true,
          suffixColor: 'text-rose-400',
          description: 'Bentuk lampau Verb-2 berakhiran -ed'
        },
        {
          type: 'morph',
          category: 'KATA KERJA BERATURAN (REGULAR)',
          breadcrumb: ['played (V2)', 'hilangkan -ed', 'play (V1)'],
          activeBreadcrumbIdx: 1,
          stem: 'play',
          suffix: 'ed',
          hasSuffix: false,
          description: 'Ketika DID masuk, akhiran -ed dilepas kembali ke bentuk dasar Verb-1 (play)'
        },
        // Regular: closed -> close
        {
          type: 'morph',
          category: 'KATA KERJA BERAKHIRAN -D',
          breadcrumb: ['closed (V2)', 'hilangkan -d', 'close (V1)'],
          activeBreadcrumbIdx: 0,
          stem: 'close',
          suffix: 'd',
          hasSuffix: true,
          suffixColor: 'text-rose-400',
          description: 'Bentuk lampau Verb-2 dengan penambahan -d'
        },
        {
          type: 'morph',
          category: 'KATA KERJA BERAKHIRAN -D',
          breadcrumb: ['closed (V2)', 'hilangkan -d', 'close (V1)'],
          activeBreadcrumbIdx: 1,
          stem: 'close',
          suffix: 'd',
          hasSuffix: false,
          description: 'Akhiran -d dilepas dan kembali ke kata dasar awal: close'
        },
        // Irregular: went -> go
        {
          type: 'morph',
          category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
          breadcrumb: ['went (V2)', 'kembali ke asal', 'go (V1)'],
          activeBreadcrumbIdx: 0,
          word: 'went',
          wordColor: 'text-amber-400',
          description: 'Bentuk lampau Verb-2 dari go adalah went'
        },
        {
          type: 'morph',
          category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
          breadcrumb: ['went (V2)', 'kembali ke asal', 'go (V1)'],
          activeBreadcrumbIdx: 2,
          word: 'go',
          wordColor: 'text-emerald-400',
          description: 'Saat bertemu DID, bentuk irregular "went" kembali seutuhnya menjadi "go"'
        },
        // Irregular: bought -> buy
        {
          type: 'morph',
          category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
          breadcrumb: ['bought (V2)', 'kembali ke asal', 'buy (V1)'],
          activeBreadcrumbIdx: 0,
          word: 'bought',
          wordColor: 'text-amber-400',
          description: 'Bentuk lampau Verb-2 dari buy adalah bought'
        },
        {
          type: 'morph',
          category: 'KATA KERJA TIDAK BERATURAN (IRREGULAR)',
          breadcrumb: ['bought (V2)', 'kembali ke asal', 'buy (V1)'],
          activeBreadcrumbIdx: 2,
          word: 'buy',
          wordColor: 'text-emerald-400',
          description: '"Bought" luruh kembali ke bentuk aslinya yaitu "buy"'
        }
      ]
    },

    // SLIDE 5: Membangun Kalimat (+, -, ?)
    {
      id: 'construction',
      title: 'Membangun Kalimat Step-by-Step',
      subtitle: 'Evolusi struktur kalimat dari Positif (+), Negatif (-), hingga Tanya (?).',
      steps: [
        {
          type: 'construction',
          contextIndo: 'Mereka bermain sepak bola kemarin',
          tokens: [
            { id: 'subj', text: 'They' },
            { id: 'verb', text: 'played', color: 'text-emerald-400' },
            { id: 'obj', text: 'football' },
            { id: 'time', text: 'yesterday' }
          ],
          description: 'Kalimat positif lampau WAJIB menggunakan Verb-2 murni (played) tanpa Helper DID.'
        },
        {
          type: 'construction',
          contextIndo: 'Mereka TIDAK bermain sepak bola kemarin',
          tokens: [
            { id: 'subj', text: 'They' },
            { id: 'helper', text: 'did not', color: 'text-rose-400' },
            { id: 'verb', text: 'play', color: 'text-sky-400' },
            { id: 'obj', text: 'football' },
            { id: 'time', text: 'yesterday' }
          ],
          description: 'Ketika "did not" masuk, kata kerja "played" luruh kembali ke Verb-1 "play".'
        },
        {
          type: 'construction',
          contextIndo: 'Apakah mereka bermain sepak bola kemarin?',
          tokens: [
            { id: 'helper', text: 'Did', color: 'text-amber-400' },
            { id: 'subj', text: 'they' },
            { id: 'verb', text: 'play', color: 'text-sky-400' },
            { id: 'obj', text: 'football' },
            { id: 'time', text: 'yesterday' },
            { id: 'punct', text: '?', color: 'text-amber-400' }
          ],
          description: 'Untuk membuat kalimat tanya, pindahkan DID ke depan dan pastikan kata kerja tetap Verb-1.'
        }
      ]
    },

    // SLIDE 6: Daftar Contoh: Grup Regular
    {
      id: 'list-regular',
      title: 'Daftar Contoh: Grup Regular',
      subtitle: 'Perhatikan perubahan dari Indonesia → Positif (+) → Negatif (-) → Tanya (?).',
      listItems: [
        {
          id: 'Kami menonton film tadi malam',
          pos: 'We watched the movie last night',
          neg: "We didn't watch the movie last night",
          q: 'Did we watch the movie last night ?'
        },
        {
          id: 'Dia membersihkan kamarnya kemarin',
          pos: 'He cleaned his room yesterday',
          neg: "He didn't clean his room yesterday",
          q: 'Did he clean his room yesterday ?'
        },
        {
          id: 'Mereka tinggal di sini tahun lalu',
          pos: 'They lived here last year',
          neg: "They didn't live here last year",
          q: 'Did they live here last year ?'
        }
      ],
      steps: [
        { type: 'interactive-list', revealedRows: [{ state: 'id' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'pos' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'neg' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'pos' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'neg' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'pos' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'neg' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'q' }] }
      ]
    },

    // SLIDE 7: Daftar Contoh: Grup Irregular
    {
      id: 'list-irregular',
      title: 'Daftar Contoh: Grup Irregular',
      subtitle: 'Perhatikan perubahan kata kerja tidak beraturan saat DID masuk.',
      listItems: [
        {
          id: 'Saya meminum kopi pagi ini',
          pos: 'I drank coffee this morning',
          neg: "I didn't drink coffee this morning",
          q: 'Did you drink coffee this morning ?'
        },
        {
          id: 'Sarah pergi ke pasar tadi pagi',
          pos: 'Sarah went to the market',
          neg: "Sarah didn't go to the market",
          q: 'Did Sarah go to the market ?'
        },
        {
          id: 'Ayah membeli mobil baru minggu lalu',
          pos: 'Father bought a new car',
          neg: "Father didn't buy a new car",
          q: 'Did father buy a new car ?'
        }
      ],
      steps: [
        { type: 'interactive-list', revealedRows: [{ state: 'id' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'pos' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'neg' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'id' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'pos' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'neg' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'id' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'pos' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'neg' }] },
        { type: 'interactive-list', revealedRows: [{ state: 'q' }, { state: 'q' }, { state: 'q' }] }
      ]
    }
  ], []);

  // Map sub-steps to flat array
  const flatSteps = useMemo(() => {
    const list = [];
    slidesData.forEach((slide, sIdx) => {
      slide.steps.forEach((step, stIdx) => {
        list.push({
          slideIndex: sIdx,
          stepIndex: stIdx,
          slideTitle: slide.title,
          slideSubtitle: slide.subtitle,
          stepData: step,
          listItems: slide.listItems || null
        });
      });
    });
    return list;
  }, [slidesData]);

  const [currentFlatIdx, setCurrentFlatIdx] = useState(0);

  const currentStepInfo = flatSteps[currentFlatIdx];
  const currentSlide = slidesData[currentStepInfo.slideIndex];
  const totalSlides = slidesData.length;
  const currentSlideNum = currentStepInfo.slideIndex + 1;
  const currentSubStep = currentStepInfo.stepIndex + 1;
  const totalSubStepsInSlide = currentSlide.steps.length;

  const handleNext = useCallback(() => {
    setCurrentFlatIdx((prev) => Math.min(prev + 1, flatSteps.length - 1));
  }, [flatSteps.length]);

  const handlePrev = useCallback(() => {
    setCurrentFlatIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Render content via pure templates
  const renderStep = () => {
    const { stepData, listItems } = currentStepInfo;

    switch (stepData.type) {
      case 'statement':
        return <StatementStep {...stepData} />;
      case 'morph':
        return <VerbMorphingStep {...stepData} />;
      case 'construction':
        return <SentenceConstructionStep {...stepData} />;
      case 'interactive-list':
        return <InteractiveExampleList items={listItems} {...stepData} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950 text-white select-none">
      {/* Header Bar */}
      <header className="w-full shrink-0 flex items-center justify-between px-6 py-4 z-30 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/50 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          onClick={onBack}
          aria-label="Kembali"
          className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-xs md:text-sm font-semibold tracking-wide text-slate-400">
          Slide {currentSlideNum} dari {totalSlides}
          <span className="mx-2 text-slate-700">•</span>
          Langkah {currentSubStep} dari {totalSubStepsInSlide}
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
        <motion.div
          layout
          transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
          className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center"
        >
          {/* Persistent Header */}
          <motion.div
            layout="position"
            transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
            className="mb-8 max-w-xl"
          >
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {currentStepInfo.slideTitle}
            </h1>
            {currentStepInfo.slideSubtitle && (
              <p className="mt-2 text-sm md:text-base text-slate-400">
                {currentStepInfo.slideSubtitle}
              </p>
            )}
          </motion.div>

          {/* Dynamic Step Body */}
          {renderStep()}
        </motion.div>
      </main>

      {/* Footer Bar */}
      <footer className="w-full shrink-0 flex items-center justify-between px-6 py-4 z-30 bg-slate-950 border-t border-slate-800/50 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={handlePrev}
          disabled={currentFlatIdx === 0}
          aria-label="Langkah Sebelumnya"
          className="p-3 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {slidesData.map((s, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 rounded-full ${
                idx === currentStepInfo.slideIndex
                  ? 'w-6 h-1.5 bg-blue-500'
                  : idx < currentStepInfo.slideIndex
                  ? 'w-1.5 h-1.5 bg-slate-600'
                  : 'w-1.5 h-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentFlatIdx === flatSteps.length - 1}
          aria-label="Langkah Berikutnya"
          className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}

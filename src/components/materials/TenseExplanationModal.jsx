import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { getTenseExplanation } from '../../data/tenseExplanations';

/**
 * Modal Popup Fullscreen Penjelasan Lengkap Fungsi Utama Tenses & Contohnya
 * Mematuhi Aturan 8-Point Grid, Zero Anti-Patterns, dan Tipografi Presisi
 */
export const TenseExplanationModal = ({
  isOpen,
  onClose,
  tense,
  aspect,
  sentenceType,
  isPassive,
  form,
  formulaInfo,
}) => {
  // Listen keyboard Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tenseData = getTenseExplanation(tense, aspect);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tense-explanation-title"
        data-lenis-prevent="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[80] bg-[#090a0f] text-zinc-100 flex flex-col overflow-hidden"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <header className="px-4 sm:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between shrink-0 z-20 bg-[#090a0f]/95 backdrop-blur-md border-b border-[#232736]/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Kembali ke Grammar Playground"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-1 -m-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-blue-400 hidden sm:inline">
              Panduan Tata Bahasa
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              {formulaInfo?.name || tenseData.name}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela panduan"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body with Lenis scroll prevent and touch momentum */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32">
            {/* 1. Hero Tense Identity Card */}
            <div className="bg-[#121420] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl text-left">
              <div className="space-y-1.5">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                  Fokus Tenses
                </span>
                <h1
                  id="tense-explanation-title"
                  className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight"
                >
                  {tenseData.name}
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed pt-1">
                  {tenseData.tagline}
                </p>
              </div>

              {/* Formula Blueprint */}
              {formulaInfo?.fullFormula && (
                <div className="bg-[#181b2a] border border-zinc-700/60 rounded-xl p-3.5 sm:p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Rumus Aktif ({sentenceType === 'verbal' ? (isPassive ? 'Pasif' : 'Verbal') : 'Nominal'})</span>
                    <span className="text-blue-400">{form.toUpperCase()}</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-extrabold text-emerald-400 tracking-wide select-text">
                    {formulaInfo.fullFormula}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Cara Pandang Waktu & Mindset Native Speaker */}
            <div className="bg-[#121420] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl text-left">
              <div className="flex items-center gap-2 text-zinc-200">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white">
                  Cara Pandang & Logika Waktu
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                {tenseData.mindset}
              </p>
            </div>

            {/* 3. Fungsi Utama dalam Komunikasi Nyata */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-zinc-400">
                  Fungsi Utama & Situasi Penggunaan
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  {tenseData.mainFunctions.length} Fungsi Kunci
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {tenseData.mainFunctions.map((func, idx) => (
                  <div
                    key={idx}
                    className="bg-[#121420] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-mono font-bold text-white">
                          {func.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-400 font-sans pl-7 leading-relaxed">
                        {func.situation}
                      </p>
                    </div>

                    {/* Example Sentences */}
                    <div className="pl-7 space-y-2 pt-1">
                      {func.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="bg-[#181b2a] border border-zinc-800 rounded-xl p-3 space-y-1"
                        >
                          <div className="text-xs sm:text-sm font-mono font-bold text-emerald-300 select-text">
                            &ldquo;{ex.en}&rdquo;
                          </div>
                          <div className="text-xs sm:text-[13px] font-sans italic text-zinc-400 select-text">
                            {ex.id}
                          </div>
                          {ex.context && (
                            <div className="text-[11px] font-sans text-zinc-500 pt-0.5">
                              Konteks: {ex.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Sinyal Waktu Khas (Time Signals) */}
            {tenseData.timeSignals && tenseData.timeSignals.length > 0 && (
              <div className="bg-[#121420] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl text-left">
                <div className="flex items-center gap-2 text-zinc-200">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white">
                    Sinyal Waktu Khas (Time Signals)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Keterangan waktu yang menjadi penanda kuat bahwa tenses ini lazim digunakan:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tenseData.timeSignals.map((signal, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#181b2a] border border-zinc-700/60 text-xs font-mono font-semibold text-zinc-200 select-text"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Catatan Kritis & Jebakan Umum (Pitfalls) */}
            {tenseData.pitfalls && tenseData.pitfalls.length > 0 && (
              <div className="bg-[#121420] border border-rose-900/40 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl text-left">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white">
                    Perhatian & Jebakan Umum
                  </h2>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans list-disc list-inside leading-relaxed">
                  {tenseData.pitfalls.map((pitfall, pIdx) => (
                    <li key={pIdx} className="text-zinc-300">
                      {pitfall}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Dismiss Action */}
            <div className="pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg cursor-pointer border-0"
              >
                Mengerti & Kembali ke Simulator
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

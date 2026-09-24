import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerbMorphingStep({
  category,
  breadcrumb = [],
  activeBreadcrumbIdx = 0,
  stem,
  suffix,
  hasSuffix = false,
  suffixColor = 'text-sky-400',
  word,
  wordColor = 'text-white',
  description
}) {
  const isLetterLevel = Boolean(stem);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl px-4 select-none">
      {category && (
        <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
          {category}
        </span>
      )}

      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 mb-8 bg-slate-900/90 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400">
          {breadcrumb.map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-600">→</span>}
              <span className={idx === activeBreadcrumbIdx ? 'text-white font-bold' : 'text-slate-500'}>
                {bc}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Area Kata Raksasa */}
      <div className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 flex items-baseline justify-center h-[1.3em]">
        {isLetterLevel ? (
          <div className="inline-flex items-baseline justify-center">
            {/* Stem terkunci mati tanpa transform apa pun */}
            <span className="text-white inline-block">{stem}</span>

            {/* Tirai Suffix: Wadah hanya memotong lebar, teks di dalam tidak pernah gepeng */}
            <AnimatePresence initial={false}>
              {hasSuffix && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
                  className="inline-flex overflow-hidden whitespace-nowrap"
                >
                  <span className={`inline-block min-w-max ${suffixColor}`}>
                    {suffix}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="inline-flex overflow-hidden relative h-[1.25em] items-baseline justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={word}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.85, 0, 0.15, 1] }}
                className={`inline-block ${wordColor}`}
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      {description && (
        <p className="text-slate-300 text-base md:text-lg text-center max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

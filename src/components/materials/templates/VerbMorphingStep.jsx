import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wordSpringTransition = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
};

export const VerbMorphingStep = ({
  category = '',
  breadcrumb = [],
  activeBreadcrumbIdx = 0,
  stem = '',
  suffix = '',
  hasSuffix = false,
  suffixColor = 'text-sky-400',
  description = '',
  word = '', // Optional for irregular / full-word transformations
  onBreadcrumbClick,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-xl py-6 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Category Label */}
      {category && (
        <div className="text-xs uppercase tracking-widest font-bold text-sky-400 mb-3">
          {category}
        </div>
      )}

      {/* Breadcrumb Steps */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold flex-wrap mb-6">
          {breadcrumb.map((crumb, idx) => {
            const isActive = idx === activeBreadcrumbIdx;
            return (
              <React.Fragment key={`crumb-${idx}`}>
                <button
                  type="button"
                  onClick={() => onBreadcrumbClick && onBreadcrumbClick(idx)}
                  className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {crumb}
                </button>
                {idx < breadcrumb.length - 1 && (
                  <span className="text-slate-600 font-mono">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Giant Word Display */}
      <div className="h-28 sm:h-32 flex items-center justify-center overflow-visible text-6xl md:text-7xl font-extrabold text-white tracking-tight">
        {word ? (
          /* Full word rolling transition for irregulars */
          <span className="inline-block overflow-hidden align-baseline relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={word}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={wordSpringTransition}
                className="inline-block text-white"
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
        ) : (
          /* STEM-LOCKED letter-level morphing */
          <span className="inline-flex items-baseline">
            {/* Stem locked in place - zero reflow */}
            <span className="inline-block text-white">
              {stem}
            </span>

            {/* Suffix expands/collapses width smoothly */}
            <AnimatePresence>
              {hasSuffix && (
                <motion.span
                  key={`suffix-${suffix}`}
                  initial={{ opacity: 0, width: 0, y: 12 }}
                  animate={{ opacity: 1, width: 'auto', y: 0 }}
                  exit={{ opacity: 0, width: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
                  className={`inline-block overflow-hidden font-extrabold ${suffixColor}`}
                >
                  {suffix}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )}
      </div>

      {/* Description below */}
      {description && (
        <div className="text-slate-300 text-base md:text-lg text-center max-w-lg mt-6 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
};

export default VerbMorphingStep;

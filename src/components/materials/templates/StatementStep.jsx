import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StatementStep = ({
  headline = '',
  paragraphs = [],
  explanation = '',
  columns = null,
  formula = null,
  text = '',
  content = '',
  children,
  className = '',
}) => {
  // Normalize paragraphs, explanation, or children to array
  const raw =
    (paragraphs && paragraphs.length > 0)
      ? paragraphs
      : explanation || text || content || children;

  const paragraphList = Array.isArray(raw)
    ? raw
    : raw
    ? [raw]
    : [];

  const containerMaxWidth =
    columns && columns.length >= 4
      ? 'max-w-4xl'
      : columns && columns.length === 3
      ? 'max-w-3xl'
      : 'max-w-2xl';

  return (
    <div className={`w-full ${containerMaxWidth} py-6 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Optional Central Headline */}
      {headline && (
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center leading-tight mb-6 tracking-tight">
          {headline}
        </h2>
      )}

      {/* Optional Formula Banner */}
      {formula && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
          className="w-full flex flex-col items-center justify-center mb-6"
        >
          {formula.tag && (
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-1.5">
              {formula.tag}
            </span>
          )}
          <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center font-mono">
            {formula.text || formula.rule}
          </div>
          {formula.note && (
            <div className="text-xs md:text-sm font-medium text-slate-400 mt-1.5 text-center">
              {formula.note}
            </div>
          )}
        </motion.div>
      )}

      {/* Multi-Column Flat Comparison (Zero Box / Zero Border) */}
      {columns && columns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
          className={`grid grid-cols-1 ${
            columns.length >= 4
              ? 'sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : columns.length === 3
              ? 'md:grid-cols-3 gap-6 md:gap-8'
              : 'md:grid-cols-2 gap-8 md:gap-12'
          } w-full text-left mb-6`}
        >
          {columns.map((col, idx) => (
            <div
              key={`col-${idx}`}
              className={`flex flex-col space-y-1.5 ${
                col.highlight ? 'bg-slate-900/50 p-4 rounded-xl' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${col.headerColor || 'text-slate-400'}`}>
                  {col.header || col.tag}
                </span>
                {col.status && (
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${col.statusColor || 'text-slate-500'}`}>
                    {col.status}
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white">
                {col.title}
              </h3>
              {col.example && (
                <div className={`font-mono text-sm md:text-base font-bold ${col.exampleColor || 'text-sky-400'}`}>
                  {col.example}
                </div>
              )}
              {col.note && (
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  {col.note}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Paragraphs */}
      <AnimatePresence mode="wait">
        {paragraphList.length > 0 && (
          <motion.div
            key={`stmt-content-${typeof raw === 'string' ? raw : paragraphList.length}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
            className="text-slate-300 text-base md:text-xl leading-relaxed text-center max-w-2xl space-y-4"
          >
            {paragraphList.map((p, idx) => (
              <p key={`stmt-p-${idx}`}>
                {p}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatementStep;

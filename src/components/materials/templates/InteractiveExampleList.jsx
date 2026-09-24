import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Check, X } from 'lucide-react';

const wordSpringTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
  mass: 0.8,
};

const layoutTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

export const InteractiveExampleList = ({
  items = [],
  revealedRows = [],
  onRowClick,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-2xl px-4 mx-auto space-y-0.5 select-none ${className}`}>
      {items.map((item, idx) => {
        // Resolve row state from array or numeric step count
        const rawState = Array.isArray(revealedRows)
          ? revealedRows[idx] ?? 'id'
          : typeof revealedRows === 'number'
          ? idx * 3 + 3 <= revealedRows
            ? 'q'
            : idx * 3 + 2 <= revealedRows
            ? 'neg'
            : idx * 3 + 1 <= revealedRows
            ? 'pos'
            : 'id'
          : 'id';

        const rowState = rawState;
        const isEnglish = rowState !== 'id';

        // Resolve status indicator badge
        const badgeState =
          rowState === 'check'
            ? 'check'
            : rowState === 'cross'
            ? 'cross'
            : item.status && isEnglish
            ? item.status
            : rowState;

        const rowKey = item.key || `row-${idx}`;

        return (
          <motion.div
            key={rowKey}
            layout
            transition={layoutTransition}
            onClick={() => onRowClick && onRowClick(idx)}
            className="relative isolate flex items-center justify-between py-3 border-b border-slate-800/80 cursor-pointer hover:border-slate-700/80 transition-colors"
          >
            {/* Sentence Text Container */}
            <div className="relative flex items-baseline gap-2 overflow-visible text-left pr-4">
              <AnimatePresence mode="wait">
                {!isEnglish ? (
                  <motion.span
                    key={`${rowKey}-id`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base md:text-lg font-medium leading-relaxed text-slate-400"
                  >
                    {item.id || item.idPositive}
                  </motion.span>
                ) : (
                  <LayoutGroup id={`group-${rowKey}`}>
                    <motion.div
                      key={`${rowKey}-en`}
                      layout
                      transition={wordSpringTransition}
                      className="relative flex items-baseline gap-2 overflow-visible flex-nowrap whitespace-nowrap text-base md:text-lg font-bold"
                    >
                      {/* 1. Structured Token Rendering (Stem-level & Token highlights) */}
                      {item.subject ? (
                        <>
                          {/* Question Helper in 'q' state */}
                          <AnimatePresence mode="popLayout">
                            {rowState === 'q' && (
                              <motion.span
                                key={`${rowKey}-helper-q`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-amber-400 font-bold inline-block"
                              >
                                {item.helperCap || item.helper || 'Did'}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Subject */}
                          <motion.span
                            key={`${rowKey}-subj`}
                            layout="position"
                            transition={wordSpringTransition}
                            className="text-white font-bold inline-block"
                          >
                            {rowState === 'q'
                              ? item.subjectLower || item.subject
                              : item.subject}
                          </motion.span>

                          {/* Positive Helper in 'pos' state (e.g. will, is, are, have) */}
                          <AnimatePresence mode="popLayout">
                            {rowState === 'pos' && item.posHelper && (
                              <motion.span
                                key={`${rowKey}-helper-pos`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-blue-400 font-bold inline-block"
                              >
                                {item.posHelper}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Negative Helper in 'neg' state */}
                          <AnimatePresence mode="popLayout">
                            {rowState === 'neg' && (
                              <motion.span
                                key={`${rowKey}-helper-neg`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={wordSpringTransition}
                                className="text-rose-400 font-bold inline-block whitespace-nowrap"
                              >
                                {item.negHelper || `${item.helper || "didn't"}`}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Verb: V2 in 'pos', Base V1 in 'neg' and 'q' with Stem-Level Highlight for Regular Verbs */}
                          <motion.span
                            key={`${rowKey}-verb`}
                            layout="position"
                            transition={wordSpringTransition}
                            className="font-bold inline-flex items-baseline"
                          >
                            {(() => {
                              const targetVerb = item.verbV3 || (rowState === 'pos' ? item.verbV2 || item.verbPos || item.verbBase : item.verbBase);
                              const isRegular =
                                (targetVerb && item.verbBase && targetVerb.startsWith(item.verbBase) && targetVerb !== item.verbBase) ||
                                (item.stem && item.suffix);

                              if (isRegular) {
                                const stem = item.stem || item.verbBase;
                                const suffix = item.suffix || targetVerb.slice(stem.length);
                                const showSuffix = item.verbV3 ? true : rowState === 'pos';

                                return (
                                  <>
                                    <span className={rowState === 'pos' ? 'text-emerald-400 font-bold' : 'text-sky-400 font-bold'}>
                                      {stem}
                                    </span>
                                    <AnimatePresence mode="popLayout">
                                      {showSuffix && suffix && (
                                        <motion.span
                                          key={`${rowKey}-suffix`}
                                          layout="position"
                                          initial={{ opacity: 0, width: 0 }}
                                          animate={{ opacity: 1, width: 'auto' }}
                                          exit={{ opacity: 0, width: 0, y: 6 }}
                                          transition={{ duration: 0.2 }}
                                          className="text-amber-400 font-black inline-block overflow-hidden"
                                        >
                                          {suffix}
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </>
                                );
                              }

                              // Irregular / standard verb morph
                              return (
                                <span className={rowState === 'pos' ? 'text-emerald-400 font-bold' : 'text-sky-400 font-bold'}>
                                  {targetVerb}
                                </span>
                              );
                            })()}
                          </motion.span>

                          {/* Complement */}
                          {item.complement && (
                            <motion.span
                              key={`${rowKey}-comp`}
                              layout="position"
                              transition={wordSpringTransition}
                              className="text-slate-200 font-medium inline-block"
                            >
                              {item.complement}
                            </motion.span>
                          )}

                          {/* Question Mark in 'q' state */}
                          <AnimatePresence mode="popLayout">
                            {rowState === 'q' && (
                              <motion.span
                                key={`${rowKey}-qmark`}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.2 }}
                                transition={wordSpringTransition}
                                className="text-amber-400 font-bold inline-block ml-0.5"
                              >
                                ?
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        /* 2. Direct JSX / Formatted Node / Text Rendering */
                        <span className="text-white">
                          {rowState === 'pos'
                            ? item.pos || item.enPositive || item.en
                            : rowState === 'neg'
                            ? item.neg || item.enNegative
                            : rowState === 'q'
                            ? item.q || item.enQuestion
                            : item.pos || item.en || item.text}
                        </span>
                      )}
                    </motion.div>
                  </LayoutGroup>
                )}
              </AnimatePresence>
            </div>

            {/* Right Status Badge */}
            <div className="shrink-0 flex items-center ml-3">
              <AnimatePresence mode="wait">
                {badgeState === 'id' && (
                  <motion.div
                    key="badge-id"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-slate-900 text-slate-600"
                  >
                    •
                  </motion.div>
                )}

                {badgeState === 'pos' && (
                  <motion.div
                    key="badge-pos"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  >
                    +
                  </motion.div>
                )}

                {badgeState === 'neg' && (
                  <motion.div
                    key="badge-neg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-rose-600 text-white shadow-md shadow-rose-900/30"
                  >
                    −
                  </motion.div>
                )}

                {badgeState === 'q' && (
                  <motion.div
                    key="badge-q"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-amber-500 text-white shadow-md shadow-amber-900/30"
                  >
                    ?
                  </motion.div>
                )}

                {badgeState === 'check' && (
                  <motion.div
                    key="badge-check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-emerald-500/20 text-emerald-400"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                )}

                {badgeState === 'cross' && (
                  <motion.div
                    key="badge-cross"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={wordSpringTransition}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold bg-rose-500/20 text-rose-400"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InteractiveExampleList;

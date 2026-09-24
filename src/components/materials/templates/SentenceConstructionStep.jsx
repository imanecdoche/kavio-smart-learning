import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Check, X } from 'lucide-react';

const wordSpringTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
  mass: 0.8,
};

export const SentenceConstructionStep = ({
  contextIndo = '',
  tokens = [],
  status = null, // 'check' | 'cross' | null
  description = '',
  groupId = 'sentence-construction-group',
  className = '',
}) => {
  // Calculate total characters to adapt font size so sentence fits in 1 single line (ZERO wrapping)
  const totalChars = tokens.reduce((acc, t) => {
    const textLen = t.text
      ? t.text.length
      : (t.stem ? t.stem.length : 0) + (t.hasSuffix && t.suffix ? t.suffix.length : 0);
    return acc + textLen;
  }, 0);

  // Dynamic responsive text scale: Never wraps, strictly 1 single line
  const fontSizeClass =
    totalChars > 34
      ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
      : totalChars > 24
      ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
      : totalChars > 15
      ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
      : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl';

  return (
    <div className={`w-full max-w-5xl px-4 py-6 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Indonesian Context */}
      {contextIndo && (
        <div className="text-slate-400 text-lg md:text-xl font-medium mb-6 text-center">
          {contextIndo}
        </div>
      )}

      {/* Giant Sentence Container - STRICTLY 1 SINGLE LINE (ZERO WRAPPING) */}
      <LayoutGroup id={groupId}>
        <motion.div
          layout
          transition={wordSpringTransition}
          className={`${fontSizeClass} font-extrabold flex items-center justify-center tracking-tight flex-nowrap whitespace-nowrap text-center max-w-full overflow-visible py-2`}
        >
          <AnimatePresence initial={false}>
            {tokens.map((token, index) => {
              const tokenKey = token.key || token.id;
              const tokenColor = token.color || token.className || 'text-white';
              const smoothEase = [0.85, 0, 0.15, 1]; // Kinetic needle-peak velocity curve
              const isLast = index === tokens.length - 1;
              const tokenSpacing = 'clamp(0.5rem, 1.5vw, 0.85rem)';
              const isDynamic = token.dynamic || token.delayedEntry;

              return (
                <motion.span
                  key={`token-${tokenKey}`}
                  layoutId={`token-${token.id}`}
                  layout="position"
                  initial={
                    isDynamic
                      ? { width: 0, marginRight: 0, opacity: 0 }
                      : false
                  }
                  animate={
                    isDynamic
                      ? {
                          width: 'auto',
                          marginRight: isLast ? 0 : tokenSpacing,
                          opacity: 1,
                        }
                      : undefined
                  }
                  exit={
                    isDynamic
                      ? {
                          width: 0,
                          marginRight: 0,
                          opacity: 0,
                          transition: {
                            width: { duration: 0.35, delay: 0.3, ease: smoothEase },
                            marginRight: { duration: 0.35, delay: 0.3, ease: smoothEase },
                            opacity: { duration: 0.2, delay: 0.3 },
                          },
                        }
                      : undefined
                  }
                  transition={
                    isDynamic
                      ? {
                          layout: { duration: 0.38, ease: smoothEase },
                          width: {
                            duration: 0.35,
                            delay: token.entryDelay ?? (token.delayedEntry ? 0.4 : 0),
                            ease: smoothEase,
                          },
                          marginRight: {
                            duration: 0.35,
                            delay: token.entryDelay ?? (token.delayedEntry ? 0.4 : 0),
                            ease: smoothEase,
                          },
                          opacity: {
                            duration: 0.2,
                            delay: token.entryDelay ?? (token.delayedEntry ? 0.4 : 0),
                          },
                        }
                      : token.layoutDelay
                      ? { duration: 0.4, delay: token.layoutDelay, ease: smoothEase }
                      : wordSpringTransition
                  }
                  style={{
                    marginRight: isDynamic ? undefined : isLast ? 0 : tokenSpacing,
                    verticalAlign: 'baseline',
                  }}
                  className={`inline-flex items-baseline flex-shrink-0 whitespace-nowrap transition-colors duration-300 py-1 ${tokenColor} ${
                    isDynamic ? 'overflow-hidden' : ''
                  }`}
                >
                  {/* 1. Dynamic Choreographed Token (Entry: space -> roll in; Exit: roll out -> collapse space) */}
                  {isDynamic ? (
                    <motion.span
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{
                        y: '-100%',
                        opacity: 0,
                        transition: {
                          y: { duration: 0.28, delay: 0, ease: smoothEase },
                          opacity: { duration: 0.2, delay: 0 },
                        },
                      }}
                      transition={{
                        y: {
                          duration: 0.35,
                          delay: token.rollDelay ?? (token.delayedEntry ? 0.8 : 0.35),
                          ease: smoothEase,
                        },
                        opacity: {
                          duration: 0.25,
                          delay: token.rollDelay ?? (token.delayedEntry ? 0.8 : 0.35),
                        },
                      }}
                      className="inline-block whitespace-nowrap"
                    >
                      {token.text}
                    </motion.span>
                  ) : token.stem ? (
                    /* 2. Stem-Locking Morphing (Stem stays mounted, suffix expands/collapses independently) */
                    <span className="inline-flex items-baseline whitespace-nowrap py-1">
                      <span className="inline-block whitespace-nowrap">{token.stem}</span>
                      <AnimatePresence>
                        {token.hasSuffix && (
                          <motion.span
                            key={`suffix-${tokenKey}`}
                            initial={{ opacity: 0, width: 0, x: -3 }}
                            animate={{ opacity: 1, width: 'auto', x: 0 }}
                            exit={{
                              opacity: 0,
                              width: 0,
                              x: -3,
                              transition: { duration: 0.3, ease: smoothEase },
                            }}
                            transition={{
                              duration: 0.35,
                              delay: token.suffixDelay ?? 0,
                              ease: smoothEase,
                            }}
                            className={`inline-block overflow-hidden whitespace-nowrap ${token.suffixColor || ''}`}
                          >
                            {token.suffix}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  ) : token.roll ? (
                    /* 3. Standard Odometer Rolling Text */
                    <span className="inline-block overflow-hidden align-baseline relative py-1">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={token.text}
                          initial={{ y: '100%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          exit={{ y: '-100%', opacity: 0 }}
                          transition={wordSpringTransition}
                          className="inline-block whitespace-nowrap"
                        >
                          {token.text}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ) : (
                    /* 4. Static Token Text */
                    <span className="whitespace-nowrap py-1">{token.text}</span>
                  )}
                </motion.span>
              );
            })}
          </AnimatePresence>

          {/* Status Indicator Icon (Check / Cross) */}
          <AnimatePresence mode="wait">
            {status === 'check' && (
              <motion.span
                key="status-check"
                layout="position"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={wordSpringTransition}
                className="inline-flex items-center justify-center text-emerald-400 ml-1.5 shrink-0"
                aria-label="Benar"
              >
                <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              </motion.span>
            )}

            {status === 'cross' && (
              <motion.span
                key="status-cross"
                layout="position"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={wordSpringTransition}
                className="inline-flex items-center justify-center text-rose-500 ml-1.5 shrink-0"
                aria-label="Salah"
              >
                <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Grammar Description */}
      {description && (
        <div className="text-slate-300 text-sm md:text-base text-center max-w-xl mt-6 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
};

export default SentenceConstructionStep;

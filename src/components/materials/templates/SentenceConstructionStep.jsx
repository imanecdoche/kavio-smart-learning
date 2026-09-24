import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function SentenceConstructionStep({
  contextIndo,
  tokens = [],
  status = null,
  description
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 select-none">
      {contextIndo && (
        <span className="text-slate-400 text-lg md:text-xl font-medium mb-6">
          "{contextIndo}"
        </span>
      )}

      {/* Gunakan layout="position" agar teks tidak terdistorsi scaleX */}
      <motion.div
        layout="position"
        transition={{ layout: { duration: 0.45, ease: [0.85, 0, 0.15, 1] } }}
        className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-x-3 gap-y-2 mb-6 tracking-tight flex-wrap min-h-[1.5em]"
      >
        <AnimatePresence initial={false}>
          {tokens.map((token) => (
            <motion.div
              key={token.id}
              layout="position"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.4, ease: [0.85, 0, 0.15, 1] }}
              className="inline-flex items-baseline overflow-hidden"
            >
              <div className="inline-flex overflow-hidden relative h-[1.25em] items-baseline min-w-max">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={token.text}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
                    className={`inline-block ${token.color || 'text-white'}`}
                  >
                    {token.text}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {status === 'cross' && (
            <motion.span
              key="cross"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
              className="ml-2 inline-flex overflow-hidden"
            >
              <X className="w-8 h-8 text-rose-500 stroke-[3] min-w-max" />
            </motion.span>
          )}
          {status === 'check' && (
            <motion.span
              key="check"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
              className="ml-2 inline-flex overflow-hidden"
            >
              <Check className="w-8 h-8 text-emerald-400 stroke-[3] min-w-max" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {description && (
        <p className="text-slate-300 text-sm md:text-base text-center max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

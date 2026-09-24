import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Custom Tooltip Component
 * Adheres to:
 * - Clean dark surface
 * - No outline stroke
 * - Non-wrapping text
 * - Fluid spring micro-interaction
 */
export const Tooltip = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            role="tooltip"
            className={`
              absolute pointer-events-none z-50 whitespace-nowrap
              bg-zinc-800 text-zinc-100 text-xs font-normal
              px-2.5 py-1.5 rounded shadow-lg border-0
              ${positionStyles[position] || positionStyles.top}
            `}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;

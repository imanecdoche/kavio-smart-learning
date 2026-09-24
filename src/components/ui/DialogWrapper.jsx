import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable DialogWrapper
 * Features:
 * - Desktop: Centered compact modal (sm: max-w-sm / md: max-w-md)
 * - Mobile: Bottom Panel (slides from bottom, rounded-t only)
 * - Backdrop: Dark translucent WITHOUT backdrop-blur
 * - Scroll containment: Body scroll locked when mounted to avoid scroll leaks
 * - Strict Single Close Handler: Only one close trigger
 */
export const DialogWrapper = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  // Lock body scroll to prevent scroll leaking behind the dialog
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Static class mapping so Tailwind compiler never purges them
  const maxWidthClassMap = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
  };
  const desktopWidthClass = maxWidthClassMap[maxWidth] || 'md:max-w-md';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop: Solid dark tint without backdrop-blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 cursor-pointer"
          />

          {/* Dialog Container: Centered Modal on Desktop, Bottom Panel on Mobile */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className={`
              relative z-10 w-full bg-[#12141c] text-zinc-100
              /* Mobile: Bottom Panel */
              max-md:fixed max-md:bottom-0 max-md:inset-x-0
              max-md:rounded-t-2xl max-md:rounded-b-none
              max-md:max-h-[85vh] max-md:overflow-y-auto
              /* Desktop: Centered Compact Modal */
              md:relative md:rounded-xl md:shadow-2xl ${desktopWidthClass}
              border-0 outline-none
            `}
          >
            {/* Title header if provided */}
            {title && (
              <div className="px-6 pt-6 pb-2 text-left">
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
                  {title}
                </h3>
              </div>
            )}

            {/* Content area */}
            <div className="px-6 py-4 text-left">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DialogWrapper;

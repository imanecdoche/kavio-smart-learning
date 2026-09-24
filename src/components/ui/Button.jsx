import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button Component
 * Strictly adhering to:
 * - 3 variants: primary, secondary, text (plus destructive modifier)
 * - No outline stroke
 * - Subtle corner radius (rounded-lg)
 * - Emil Kowalski fluid tap feedback (whileTap scale 0.97)
 * - No gradients, solid colors
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'text'
  isDestructive = false,
  showArrowOnHover = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Variant styling (No outline stroke, solid colors, dark-first)
  let variantStyles = '';

  if (variant === 'text' && isDestructive) {
    variantStyles = 'bg-transparent text-red-500 hover:text-red-400 hover:bg-red-950/20 active:bg-red-950/40';
  } else if (isDestructive) {
    variantStyles = 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700';
  } else if (variant === 'primary') {
    variantStyles = 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800';
  } else if (variant === 'text') {
    variantStyles = 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900 active:bg-zinc-800';
  }

  const isLeftAligned = className.includes('justify-start');
  const justifyClass = isLeftAligned ? 'justify-start' : 'justify-center';

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`
        relative inline-flex items-center ${justifyClass} font-medium
        text-sm h-11 px-6 rounded-lg transition-colors
        cursor-pointer select-none whitespace-nowrap overflow-hidden
        border-0 outline-none focus:outline-none focus:ring-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles}
        ${className}
      `}
      {...props}
    >
      <span className={`inline-flex items-center ${justifyClass} gap-2 leading-none w-full`}>
        {children}
        {showArrowOnHover && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -4,
              width: isHovered ? 'auto' : 0,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden inline-flex items-center"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0 ml-0.5"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

export default Button;

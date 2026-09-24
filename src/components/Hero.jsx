import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

/**
 * Hero Section
 * Adheres strictly to:
 * - Centered title in sans-serif: "Welcome, Learner!"
 * - Button "Start Learning" -> on hover becomes "Start Learning >"
 * - Generous whitespace for visual breathing room
 * - Clean & playful visual balance
 * - Absolutely no extra unprompted components, badges, or descriptive clutter
 */
export const Hero = ({ onStartLearning }) => {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto flex flex-col items-center gap-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
          Welcome, Learner!
        </h1>

        <div className="pt-2">
          <Button
            variant="primary"
            showArrowOnHover={true}
            onClick={onStartLearning}
            className="h-12 px-8 text-base font-semibold"
          >
            Start Learning
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

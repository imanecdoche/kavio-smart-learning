import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login, register, authError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isRegister) {
      await register(email, password, name);
    } else {
      await login(email, password);
    }

    setIsSubmitting(false);
  };

  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
            {isRegister ? 'Create Unique Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-zinc-400">
            {isRegister ? 'Register to start learning English' : 'Sign in to access your learning journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 rounded-lg bg-red-950/40 text-red-300 text-xs">
              {authError}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Fatih Farhat"
                className="
                  w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                  border-0 focus:ring-1 focus:ring-blue-500 transition-colors
                "
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="learner@kavio.edu"
              className="
                w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                border-0 focus:ring-1 focus:ring-blue-500 transition-colors
              "
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="
                w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                border-0 focus:ring-1 focus:ring-blue-500 transition-colors
              "
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full h-11"
            >
              {isSubmitting
                ? 'Processing...'
                : isRegister
                ? 'Register'
                : 'Sign In'}
            </Button>

            <Button
              type="button"
              variant="text"
              onClick={() => setIsRegister((prev) => !prev)}
              className="w-full text-xs text-zinc-400"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register here"}
            </Button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default LoginPage;

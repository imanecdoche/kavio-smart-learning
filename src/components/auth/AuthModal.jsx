import React, { useState } from 'react';
import DialogWrapper from '../ui/DialogWrapper';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authMode,
    authError,
    login,
    register,
    closeAuth,
    setAuthMode,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (authMode === 'register') {
      await register(email, password, name);
    } else {
      await login(email, password);
    }

    setIsSubmitting(false);
  };

  const isRegister = authMode === 'register';

  return (
    <DialogWrapper
      isOpen={isAuthModalOpen}
      onClose={closeAuth}
      title={isRegister ? 'Register Account' : 'Account Login'}
    >
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
              placeholder="e.g. Fatih Farhat"
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
            className="w-full"
          >
            {isSubmitting
              ? 'Processing...'
              : isRegister
              ? 'Create Unique Account'
              : 'Sign In'}
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={() => setAuthMode(isRegister ? 'login' : 'register')}
            className="w-full text-xs text-zinc-400"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : "Don't have an account? Register"}
          </Button>
        </div>
      </form>
    </DialogWrapper>
  );
};

export default AuthModal;

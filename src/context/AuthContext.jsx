import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../lib/appwrite';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState(null);

  // Check current session on mount
  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (email, password, name) => {
    setAuthError(null);
    try {
      // Create unique user account
      const userId = ID.unique();
      await account.create(userId, email, password, name);
      // Auto login after registration
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authMode,
        authError,
        login,
        register,
        logout,
        openAuth,
        closeAuth,
        setAuthMode,
        refreshUser: checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

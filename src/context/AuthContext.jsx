import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../lib/appwrite';

const AuthContext = createContext(null);

const GUEST_STORAGE_KEY = 'kavio_guest_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState(null);
  const [isProjectPaused, setIsProjectPaused] = useState(false);

  // Check current session on mount
  const checkUser = async () => {
    try {
      setLoading(true);

      // 1. Check local guest session first
      const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (storedGuest) {
        try {
          const parsed = JSON.parse(storedGuest);
          if (parsed && parsed.isGuest) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
      }

      // 2. Check Appwrite account
      const currentUser = await account.get();
      setUser(currentUser);
      setIsProjectPaused(false);
    } catch (err) {
      if (err?.message?.toLowerCase().includes('paused') || err?.type === 'project_paused' || err?.code === 403) {
        setIsProjectPaused(true);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const loginAsGuest = (guestName = 'Tamu (Guest)') => {
    setAuthError(null);
    const guestUser = {
      $id: 'guest',
      name: guestName,
      email: 'guest@kavio.local',
      isGuest: true,
      status: 'active',
      preferences: {},
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    } catch (e) {
      console.warn('LocalStorage error saving guest session:', e);
    }
    setUser(guestUser);
    setIsAuthModalOpen(false);
    return { success: true, user: guestUser };
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUser();
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      let msg = err?.message || 'Login failed. Please check your credentials.';
      if (msg.toLowerCase().includes('paused') || err?.type === 'project_paused' || err?.code === 403) {
        setIsProjectPaused(true);
        msg = 'Layanan cloud Appwrite sedang dijeda (project paused due to inactivity). Silakan pulihkan di console cloud.appwrite.io atau klik "Masuk sebagai Tamu (Guest Mode)" di bawah untuk langsung menggunakan aplikasi.';
      }
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
      let msg = err?.message || 'Registration failed. Please try again.';
      if (msg.toLowerCase().includes('paused') || err?.type === 'project_paused' || err?.code === 403) {
        setIsProjectPaused(true);
        msg = 'Layanan cloud Appwrite sedang dijeda (project paused due to inactivity). Silakan pulihkan di console cloud.appwrite.io atau klik "Masuk sebagai Tamu (Guest Mode)" di bawah untuk langsung menggunakan aplikasi.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      if (!user?.isGuest) {
        await account.deleteSession('current');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
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
        isProjectPaused,
        login,
        register,
        loginAsGuest,
        offlineLogin: loginAsGuest,
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

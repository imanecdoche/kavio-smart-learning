import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import DialogWrapper from '../ui/DialogWrapper';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ProfileAvatar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const menuRef = useRef(null);

  // Sync avatar from local storage
  useEffect(() => {
    const updateAvatar = () => {
      if (user?.$id) {
        const cached = localStorage.getItem(`kavio_avatar_${user.$id}`);
        setAvatarSrc(cached || null);
      }
    };
    updateAvatar();
    window.addEventListener('storage', updateAvatar);
    return () => window.removeEventListener('storage', updateAvatar);
  }, [user, isMenuOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleOpenProfile = () => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate('settings');
    } else {
      setIsProfileModalOpen(true);
    }
  };

  const handlePromptLogout = () => {
    setIsMenuOpen(false);
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutConfirmOpen(false);
    await logout();
  };

  return (
    <div ref={menuRef} className="relative inline-block select-none">
      {/* Avatar Trigger Button - No outline stroke */}
      <motion.button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        whileTap={{ scale: 0.95 }}
        aria-label="User profile menu"
        className="
          w-10 h-10 rounded-full bg-blue-600 text-white font-semibold text-sm
          flex items-center justify-center cursor-pointer select-none
          border-0 transition-transform focus:outline-none overflow-hidden
        "
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span>{userInitial}</span>
        )}
      </motion.button>

      {/* Desktop Dropdown Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Desktop popup menu (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="
                max-md:hidden absolute right-0 mt-2 w-52 py-2
                bg-[#181a24] text-zinc-100 rounded-lg shadow-xl
                z-50 border-0 flex flex-col gap-1
              "
            >
              <div className="px-4 py-2 border-b border-[#232736]/60 text-left">
                <p className="text-xs text-zinc-400">Signed in as</p>
                <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
              </div>

              <div className="p-1.5 flex flex-col gap-0.5">
                {/* Profile Option */}
                <Button
                  variant="text"
                  onClick={handleOpenProfile}
                  className="w-full justify-start text-left text-xs h-9 px-3 font-normal text-zinc-200 hover:text-white"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Profile</span>
                </Button>

                {/* Theme > Option */}
                <Button
                  variant="text"
                  onClick={() => setIsThemeOpen((prev) => !prev)}
                  className="w-full justify-start text-left text-xs h-9 px-3 font-normal text-zinc-200 hover:text-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14V4a6 6 0 010 12z" clipRule="evenodd" />
                    </svg>
                    <span>Theme</span>
                  </div>
                  <motion.svg
                    animate={{ rotate: isThemeOpen ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-3 h-3 fill-current text-zinc-400 shrink-0 ml-auto"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </motion.svg>
                </Button>

                {/* Theme Sub-options (Default System, Light, Dark) with smooth collapse/expand */}
                <AnimatePresence initial={false}>
                  {isThemeOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5 border-l border-[#232736]/60 ml-4 my-0.5">
                        <button
                          type="button"
                          onClick={() => setTheme('system')}
                          className="w-full flex items-center justify-between text-left text-[11.5px] py-1.5 px-2 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                        >
                          <span className={theme === 'system' ? 'text-blue-400 font-medium' : ''}>Default System</span>
                          {theme === 'system' && (
                            <svg className="w-3.5 h-3.5 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className="w-full flex items-center justify-between text-left text-[11.5px] py-1.5 px-2 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                        >
                          <span className={theme === 'light' ? 'text-blue-400 font-medium' : ''}>Light</span>
                          {theme === 'light' && (
                            <svg className="w-3.5 h-3.5 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className="w-full flex items-center justify-between text-left text-[11.5px] py-1.5 px-2 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                        >
                          <span className={theme === 'dark' ? 'text-blue-400 font-medium' : ''}>Dark</span>
                          {theme === 'dark' && (
                            <svg className="w-3.5 h-3.5 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Own divider for logout */}
                <div className="border-t border-[#232736]/70 my-1" />

                {/* Logout Option */}
                <Button
                  variant="text"
                  isDestructive={true}
                  onClick={handlePromptLogout}
                  className="w-full justify-start text-left text-xs h-9 px-3 font-normal"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span>Logout</span>
                </Button>
              </div>
            </motion.div>

            {/* Mobile Bottom Panel Adaptation */}
            <div className="md:hidden">
              <DialogWrapper isOpen={isMenuOpen} onClose={() => { setIsMenuOpen(false); setIsThemeOpen(false); }} title="Account Menu">
                <div className="mb-4 pb-3 border-b border-[#232736] text-left">
                  <p className="text-xs text-zinc-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    variant="text"
                    onClick={handleOpenProfile}
                    className="w-full justify-start text-left text-sm h-11 px-4 text-zinc-200 hover:text-white"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Profile</span>
                  </Button>

                  {/* Theme > Option Mobile */}
                  <Button
                    variant="text"
                    onClick={() => setIsThemeOpen((prev) => !prev)}
                    className="w-full justify-start text-left text-sm h-11 px-4 text-zinc-200 hover:text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14V4a6 6 0 010 12z" clipRule="evenodd" />
                      </svg>
                      <span>Theme</span>
                    </div>
                    <motion.svg
                      animate={{ rotate: isThemeOpen ? 90 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="w-3.5 h-3.5 fill-current text-zinc-400 shrink-0 ml-auto"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  </Button>

                  {/* Theme Sub-options Mobile with smooth collapse/expand */}
                  <AnimatePresence initial={false}>
                    {isThemeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l border-[#232736]/60 ml-4 my-1">
                          <button
                            type="button"
                            onClick={() => setTheme('system')}
                            className="w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                          >
                            <span className={theme === 'system' ? 'text-blue-400 font-medium' : ''}>Default System</span>
                            {theme === 'system' && (
                              <svg className="w-4 h-4 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className="w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                          >
                            <span className={theme === 'light' ? 'text-blue-400 font-medium' : ''}>Light</span>
                            {theme === 'light' && (
                              <svg className="w-4 h-4 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className="w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded hover:bg-[#232736]/40 cursor-pointer border-0 text-zinc-300 hover:text-white"
                          >
                            <span className={theme === 'dark' ? 'text-blue-400 font-medium' : ''}>Dark</span>
                            {theme === 'dark' && (
                              <svg className="w-4 h-4 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Own divider for logout */}
                  <div className="border-t border-[#232736]/70 my-1" />

                  {/* Logout Option Mobile */}
                  <Button
                    variant="text"
                    isDestructive={true}
                    onClick={handlePromptLogout}
                    className="w-full justify-start text-left text-sm h-11 px-4"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span>Logout</span>
                  </Button>
                </div>
              </DialogWrapper>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Details Dialog */}
      <DialogWrapper
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="User Profile"
        maxWidth="sm"
      >
        <div className="space-y-3 py-1 text-left">
          <div>
            <span className="block text-xs text-zinc-400 mb-0.5">Name</span>
            <p className="text-sm font-medium text-white">{user.name || 'Learner'}</p>
          </div>
          <div>
            <span className="block text-xs text-zinc-400 mb-0.5">Email</span>
            <p className="text-sm font-medium text-white">{user.email}</p>
          </div>
          <div>
            <span className="block text-xs text-zinc-400 mb-0.5">Account ID</span>
            <p className="text-xs font-normal text-zinc-300 truncate">{user.$id}</p>
          </div>
        </div>

        <div className="pt-5 flex justify-end">
          <Button variant="secondary" onClick={() => setIsProfileModalOpen(false)}>
            Close
          </Button>
        </div>
      </DialogWrapper>

      {/* Destructive Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to end your current learning session?"
        confirmLabel="Logout"
        cancelLabel="Stay Signed In"
        isDestructive={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
};

export default ProfileAvatar;

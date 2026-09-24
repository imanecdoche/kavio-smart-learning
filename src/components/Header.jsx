import React from 'react';
import ProfileAvatar from './profile/ProfileAvatar';
import { useAuth } from '../context/AuthContext';

/**
 * Header Component
 * Strict requirements:
 * - Logotype text: "Smart Learning by Kavio"
 * - Profile avatar in top right corner if login session exists
 * - No navigation page buttons
 */
export const Header = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <header className="w-full pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 px-6 md:px-12 flex items-center justify-between select-none">
      <span
        onClick={() => onNavigate && onNavigate('home')}
        className="text-base md:text-lg font-semibold tracking-tight text-zinc-100 cursor-pointer"
      >
        Smart Learning by Kavio
      </span>

      {/* Profile avatar in top right corner if session exists */}
      {user && (
        <div className="flex items-center">
          <ProfileAvatar onNavigate={onNavigate} />
        </div>
      )}
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import ImageCropperModal from './ImageCropperModal';
import { useAuth } from '../../context/AuthContext';
import { account } from '../../lib/appwrite';

export const ProfileSettingsPage = ({ onBack }) => {
  const { user, refreshUser } = useAuth();

  // Basic Info States
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('+62 ');
  const [statusNote, setStatusNote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Social Links
  const [socials, setSocials] = useState({
    instagram: '',
    x: '',
    youtube: '',
    tiktok: '',
    custom: '',
  });

  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Avatar & Cropper
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  // Notification / Feedback
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Load preferences from Appwrite on mount
  useEffect(() => {
    const loadProfileData = async () => {
      // 1. Check local storage for cached avatar first
      if (user?.$id) {
        const cachedAvatar = localStorage.getItem(`kavio_avatar_${user.$id}`);
        if (cachedAvatar) {
          setAvatarUrl(cachedAvatar);
        }
      }

      // 2. Fetch prefs from Appwrite
      try {
        const prefs = await account.getPrefs();
        if (prefs && typeof prefs === 'object') {
          if (prefs.username) setUsername(prefs.username);
          if (prefs.bio) setBio(prefs.bio);
          if (prefs.dob) setDob(prefs.dob);
          if (prefs.phone) setPhone(prefs.phone);
          if (prefs.statusNote) setStatusNote(prefs.statusNote);
          if (prefs.avatarUrl && (!user?.$id || !localStorage.getItem(`kavio_avatar_${user.$id}`))) {
            setAvatarUrl(prefs.avatarUrl);
          }
          if (prefs.socials) {
            try {
              setSocials(typeof prefs.socials === 'string' ? JSON.parse(prefs.socials) : prefs.socials);
            } catch {
              // fallback
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch user prefs:', err);
      }
    };

    if (user) {
      setName(user.name || '');
      loadProfileData();
    }
  }, [user]);

  // Format Phone with +62 and '-' dividers
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    // Strip non-digits
    const digitsOnly = raw.replace(/\D/g, '');

    // Normalize: remove leading 62 or 0
    let clean = digitsOnly;
    if (clean.startsWith('62')) {
      clean = clean.slice(2);
    } else if (clean.startsWith('0')) {
      clean = clean.slice(1);
    }

    // Limit to 12 digits
    clean = clean.slice(0, 12);

    if (!clean) {
      setPhone('+62 ');
      return;
    }

    // Format: +62 8xx-xxxx-xxxx
    let formatted = '+62 ';
    if (clean.length <= 3) {
      formatted += clean;
    } else if (clean.length <= 7) {
      formatted += `${clean.slice(0, 3)}-${clean.slice(3)}`;
    } else {
      formatted += `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`;
    }

    setPhone(formatted);
  };

  // Copy Account ID
  const handleCopyAccountId = () => {
    if (!user?.$id) return;
    navigator.clipboard.writeText(user.$id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Photo Picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setCropperOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Handle Crop Complete
  const handleCropComplete = (croppedBase64) => {
    setAvatarUrl(croppedBase64);
    if (user?.$id) {
      try {
        localStorage.setItem(`kavio_avatar_${user.$id}`, croppedBase64);
      } catch (err) {
        console.warn('Could not cache avatar:', err);
      }
    }
    setCropperOpen(false);
    setTempImageSrc(null);
  };

  // Save General Profile Info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });
    setUsernameError('');

    // Check unique username (simple simulation and format check)
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername) {
      if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
        setUsernameError('Username may only contain letters, numbers, underscores, and dots.');
        setIsSaving(false);
        return;
      }
      // Check stored usernames in local storage
      const takenUsernames = JSON.parse(localStorage.getItem('kavio_registered_usernames') || '{}');
      if (takenUsernames[cleanUsername] && takenUsernames[cleanUsername] !== user?.$id) {
        setUsernameError('This username is already taken by another learner. Please pick another.');
        setIsSaving(false);
        return;
      }
      if (user?.$id) {
        takenUsernames[cleanUsername] = user.$id;
        localStorage.setItem('kavio_registered_usernames', JSON.stringify(takenUsernames));
      }
    }

    try {
      // 1. Update Name in Appwrite Account if changed
      if (name.trim() && name.trim() !== user?.name) {
        await account.updateName(name.trim());
      }

      // 2. Persist avatar safely to local storage
      if (user?.$id && avatarUrl) {
        try {
          localStorage.setItem(`kavio_avatar_${user.$id}`, avatarUrl);
        } catch (e) {
          console.warn('LocalStorage avatar cache error:', e);
        }
      }

      // 3. Fetch existing prefs to merge safely
      let existingPrefs = {};
      try {
        const fetched = await account.getPrefs();
        if (fetched && typeof fetched === 'object') {
          existingPrefs = fetched;
        }
      } catch {
        existingPrefs = {};
      }

      // 4. Build clean prefs payload strictly avoiding undefined values
      const updatedPrefs = {
        ...existingPrefs,
        username: cleanUsername || '',
        bio: (bio || '').slice(0, 500),
        dob: dob || '',
        phone: phone || '',
        statusNote: (statusNote || '').slice(0, 60),
        socials: JSON.stringify(socials || {}),
      };

      // Only include avatar in prefs if it is small enough (< 25KB)
      if (avatarUrl && avatarUrl.length < 25000) {
        updatedPrefs.avatarUrl = avatarUrl;
      } else {
        delete updatedPrefs.avatarUrl;
      }

      await account.updatePrefs(updatedPrefs);

      // 5. Refresh user state so header/avatar updates immediately
      if (refreshUser) {
        await refreshUser();
      }

      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      setSaveStatus({ type: 'error', message: err?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await account.updatePassword(newPassword, oldPassword);
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err?.message || 'Password update failed. Verify your old password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <section className="flex-1 px-6 md:px-12 py-10 max-w-4xl mx-auto w-full select-none text-left font-sans">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#232736]/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your personal profile, credentials, and learning status
          </p>
        </div>

        <Button variant="secondary" onClick={onBack} className="text-xs h-9 px-4">
          &larr; Back
        </Button>
      </div>

      {/* Account ID Bar */}
      <div className="p-4 rounded-xl bg-[#12141c] mb-8 flex items-center justify-between">
        <div>
          <span className="block text-xs text-zinc-400">Account ID</span>
          <span className="text-sm font-medium text-white">{user?.$id || 'Loading...'}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyAccountId}
          title="Copy Account ID"
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            bg-[#1c1f2b] text-zinc-200 hover:text-white hover:bg-[#252a3b]
            transition-colors border-0 cursor-pointer select-none
          "
        >
          {copiedId ? (
            <>
              <svg className="w-3.5 h-3.5 fill-current text-blue-400 shrink-0" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 2H9a3 3 0 01-3-2z" />
              </svg>
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {saveStatus.message && (
          <div
            className={`p-4 rounded-xl text-xs ${
              saveStatus.type === 'success'
                ? 'bg-blue-950/40 text-blue-300'
                : 'bg-red-950/40 text-red-300'
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* Avatar & Instagram-Style Notes Status */}
        <div className="p-6 rounded-xl bg-[#12141c] flex flex-col md:flex-row items-center gap-6">
          {/* Avatar with Status Bubble */}
          <div className="relative flex flex-col items-center">
            {/* Instagram-Style Notes Status Bubble */}
            {statusNote && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  absolute -top-7 px-3 py-1 rounded-full
                  bg-[#232736] text-white text-[11px] font-medium
                  shadow-lg whitespace-nowrap max-w-[180px] truncate
                  border-0 select-none
                "
              >
                {statusNote}
                {/* Bubble tail */}
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#232736] rotate-45" />
              </motion.div>
            )}

            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-2xl border-0 shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer border-0 bg-transparent"
            >
              Change Photo
            </button>
          </div>

          {/* Quick Status Note Input */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Status Note (Notes on Profile)
            </label>
            <input
              type="text"
              maxLength={60}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Practicing Past Continuous today..."
              className="
                w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                border-0 focus:ring-1 focus:ring-blue-500 transition-colors
              "
            />
            <span className="block text-[11px] text-zinc-500 mt-1">
              Short thought visible above your avatar (max 60 chars)
            </span>
          </div>
        </div>

        {/* Identity & Contact Details */}
        <div className="p-6 rounded-xl bg-[#12141c] space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
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

            {/* Unique Username */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Unique Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm text-zinc-500 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="fatihfarhat"
                  className="
                    w-full h-11 pl-8 pr-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                    border-0 focus:ring-1 focus:ring-blue-500 transition-colors
                  "
                />
              </div>
              {usernameError && (
                <span className="block text-xs text-red-400 mt-1">{usernameError}</span>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="
                  w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                  border-0 focus:ring-1 focus:ring-blue-500 transition-colors
                "
              />
            </div>

            {/* Phone Number with Auto +62 & Divider */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+62 812-3456-7890"
                className="
                  w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                  border-0 focus:ring-1 focus:ring-blue-500 transition-colors
                "
              />
            </div>
          </div>

          {/* Bio (Max 500 chars) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Bio (About You)
              </label>
              <span className="text-[11px] text-zinc-500">
                {bio.length} / 500
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other learners and teachers about your English learning goals..."
              className="
                w-full p-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg
                border-0 focus:ring-1 focus:ring-blue-500 transition-colors resize-none
              "
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-xl bg-[#12141c] space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">Social Media Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Instagram</label>
              <input
                type="text"
                value={socials.instagram}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                placeholder="https://instagram.com/yourusername"
                className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">X (Twitter)</label>
              <input
                type="text"
                value={socials.x}
                onChange={(e) => setSocials({ ...socials, x: e.target.value })}
                placeholder="https://x.com/yourusername"
                className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">YouTube</label>
              <input
                type="text"
                value={socials.youtube}
                onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">TikTok</label>
              <input
                type="text"
                value={socials.tiktok}
                onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@yourusername"
                className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Custom Link</label>
              <input
                type="url"
                value={socials.custom}
                onChange={(e) => setSocials({ ...socials, custom: e.target.value })}
                placeholder="https://yourpersonalblog.com"
                className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button for Profile Details */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="h-11 px-8"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* Password Change Section (Separated & Protected) */}
      <div className="mt-12 p-6 rounded-xl bg-[#12141c]">
        <h2 className="text-base font-semibold text-white mb-1">Security & Password</h2>
        <p className="text-xs text-zinc-400 mb-6">
          To update your password, enter your current password followed by your new password twice.
        </p>

        {passwordStatus.message && (
          <div
            className={`p-4 rounded-xl text-xs mb-4 ${
              passwordStatus.type === 'success'
                ? 'bg-blue-950/40 text-blue-300'
                : 'bg-red-950/40 text-red-300'
            }`}
          >
            {passwordStatus.message}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-11 px-4 bg-[#181a24] text-zinc-100 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              disabled={isUpdatingPassword}
              className="h-11 px-6 text-xs"
            >
              {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
        onCancel={() => {
          setCropperOpen(false);
          setTempImageSrc(null);
        }}
      />
    </section>
  );
};

export default ProfileSettingsPage;

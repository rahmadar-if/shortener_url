import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Camera,
  CheckCircle,
  Smartphone,
  Laptop
} from 'lucide-react';
import { UserProfile, ViewType } from '../types';

interface ProfileSettingsViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setActiveView: (view: ViewType) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  userProfile,
  setUserProfile,
  setActiveView,
}) => {
  const [displayName, setDisplayName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(userProfile.emailNotifications);
  const [publicAnalytics, setPublicAnalytics] = useState(userProfile.publicAnalytics);
  const [twoFactor, setTwoFactor] = useState(userProfile.twoFactorEnabled);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Main', secret: 'sk_live_••••••••••••••••3a9f', created: 'Oct 12, 2023' },
    { id: 'key-2', name: 'Staging Environment', secret: 'sk_test_••••••••••••••••7e1b', created: 'Jan 05, 2024' },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name: displayName,
      email,
      emailNotifications,
      publicAnalytics,
      twoFactorEnabled: twoFactor,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateApiKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 6);
    const newKey = {
      id: 'key-' + Date.now(),
      name: `API Key (${new Date().toLocaleDateString()})`,
      secret: `sk_live_••••••••••••••••${randomHex}`,
      created: 'Just now',
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top-left "← Back to Profile" navigation link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('profile')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 font-medium text-sm transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>
      </div>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account credentials, security, and developer API settings.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center space-x-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your profile settings have been successfully updated.</span>
        </div>
      )}

      {/* Profile Information Section */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-slate-800">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <User className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Personal Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Avatar Upload Preview */}
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  const newAvatar = prompt('Enter image URL for avatar:', userProfile.avatar);
                  if (newAvatar) setUserProfile((prev) => ({ ...prev, avatar: newAvatar }));
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                Change Photo
              </button>
              <p className="text-[11px] text-slate-500 mt-1">JPG, GIF, or PNG. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-indigo-400 font-semibold">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-indigo-400 font-semibold">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-24 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

          </div>

          {/* Password update fields */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Change Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Preferences & Privacy Toggles</h3>

            <div className="space-y-3">
              {/* Email Notifications toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-white block">Email Notifications</span>
                  <span className="text-xs text-slate-400">Receive weekly click summary reports and link milestone alerts.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    emailNotifications ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Public Analytics view toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-white block">Public Analytics View</span>
                  <span className="text-xs text-slate-400">Allow visitors to view click stats on public link detail pages.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicAnalytics(!publicAnalytics)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    publicAnalytics ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      publicAnalytics ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-xs text-slate-400">Add an extra layer of security using an authenticator app.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    twoFactor ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      twoFactor ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Save Changes
            </button>
          </div>

        </form>
      </section>

      {/* Active Sessions Section */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-slate-800">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Active Sessions</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Laptop className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Chrome on macOS</p>
                <p className="text-xs text-slate-400">San Francisco, US • Current Session</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-bold border border-emerald-500/30">
              Online
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 opacity-70">
              <Smartphone className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Shorten.it App on iOS</p>
                <p className="text-xs text-slate-400">San Francisco, US • 2 hours ago</p>
              </div>
            </div>
            <button
              onClick={() => alert('Logged out from iOS session')}
              className="text-xs font-mono uppercase font-bold text-rose-400 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* API Keys Management Section */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Developer API Keys</h2>
          </div>
          <button
            onClick={handleGenerateApiKey}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Key</span>
          </button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{key.name}</p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {key.secret}
                  </code>
                  <button
                    onClick={() => handleCopyKey(key.secret, key.id)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy Secret"
                  >
                    {copiedKey === key.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center">
                <span className="text-[11px] font-mono text-slate-500">Created {key.created}</span>
                <button
                  onClick={() => handleDeleteApiKey(key.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete API Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

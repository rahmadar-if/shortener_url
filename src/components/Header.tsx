import React, { useState, useRef, useEffect } from 'react';
import { Globe, User, ExternalLink, Zap, ChevronDown, Check, LogIn, LogOut, Info, Settings, Link as LinkIcon, LayoutGrid, Sun, Moon, Menu, X } from 'lucide-react';
import { ViewType, UserProfile } from '../types';
import { auth, signOut } from '../lib/firebase';

interface HeaderProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  userProfile,
  setUserProfile,
  theme,
  setTheme,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    setActiveView('login');
  };

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'ID', label: 'Indonesia' },
    { code: 'CN', label: 'China' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              setActiveView('shortener');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:border-indigo-400 transition-all shadow-lg shadow-indigo-500/10">
              <Zap className="w-5 h-5 fill-indigo-400/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                Shorten<span className="text-indigo-500">.it</span>
              </span>
            </div>
          </button>

          {/* Desktop Quick Nav Tabs (visible only on lg screens and wider) */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-800">
            <button
              onClick={() => setActiveView('shortener')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeView === 'shortener'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Shortener
            </button>
            <button
              onClick={() => setActiveView('visited-history')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeView === 'visited-history'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Visited Links
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeView === 'about'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Right Tools & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 rounded-xl transition-all border border-transparent hover:border-slate-700/60"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Quick Redirect Preview Trigger (visible on sm+) */}
          <button
            onClick={() => setActiveView('redirect-preview')}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              activeView === 'redirect-preview'
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-800/40 text-slate-300 border-slate-700/60 hover:border-indigo-500/40 hover:text-white'
            }`}
            title="Preview Short Link Redirect Screen"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>Test Redirect</span>
          </button>

          {/* User Profile Avatar & Dropdown Popup */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`group relative flex items-center space-x-2 p-1 rounded-full border transition-all ${
                activeView === 'profile' || activeView === 'settings' || profileMenuOpen
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              title="User Account Menu"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </button>

            {/* Profile Dropdown Popup */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 py-2 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Header Info */}
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-mono text-indigo-400 font-semibold">
                    {userProfile.plan || 'PRO Account'}
                  </span>
                </div>

                {/* Dropdown Options */}
                <div className="py-1">
                  {/* Option 1: Your Shortened Links */}
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-indigo-400 flex items-center space-x-2.5 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 text-indigo-400" />
                    <span>Your shortened links</span>
                  </button>

                  {/* Option 2: Settings */}
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-indigo-400 flex items-center space-x-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>

                  {/* Option 3: Language Selector */}
                  <div className="px-4 py-2.5 border-t border-b border-slate-800/80 my-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Language</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold uppercase">
                        {userProfile.language || 'EN'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-0.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setUserProfile((prev) => ({ ...prev, language: lang.code }));
                          }}
                          className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all text-center flex items-center justify-center space-x-1 ${
                            userProfile.language === lang.code
                              ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span>{lang.code}</span>
                          {userProfile.language === lang.code && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 3: Logout */}
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-colors border-t border-slate-800/80 mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button (Mobile & Tablet: lg:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all border border-slate-700/60"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-indigo-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-300" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile / Tablet Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0F172A] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <button
            onClick={() => {
              setActiveView('shortener');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center space-x-3 transition-all ${
              activeView === 'shortener'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Shortener</span>
          </button>

          <button
            onClick={() => {
              setActiveView('visited-history');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center space-x-3 transition-all ${
              activeView === 'visited-history'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-indigo-400" />
            <span>Visited Links</span>
          </button>

          <button
            onClick={() => {
              setActiveView('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center space-x-3 transition-all ${
              activeView === 'about'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span>About</span>
          </button>

          <button
            onClick={() => {
              setActiveView('redirect-preview');
              setMobileMenuOpen(false);
            }}
            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center space-x-3 transition-all ${
              activeView === 'redirect-preview'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <span>Test Redirect</span>
          </button>
        </div>
      )}
    </header>
  );
};

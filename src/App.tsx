import React, { useState, useEffect } from 'react';
import { ViewType, ShortLink, VisitedLink, UserProfile } from './types';
import { initialUserProfile, initialLinks, initialVisitedLinks } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShortenerView } from './views/ShortenerView';
import { ProfileView } from './views/ProfileView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { AnalyticsView } from './views/AnalyticsView';
import { VisitedLinksView } from './views/VisitedLinksView';
import { RedirectPreviewView } from './views/RedirectPreviewView';
import { LoginView } from './views/LoginView';
import { AboutView } from './views/AboutView';
import { auth, onAuthStateChanged, testFirebaseConnection } from './lib/firebase';

export default function App() {
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('shorten_it_theme');
      return (savedTheme as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme class to document element for smooth global transitions
  useEffect(() => {
    try {
      localStorage.setItem('shorten_it_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      } else {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      }
    } catch (err) {
      console.error('Error saving theme to localStorage:', err);
    }
  }, [theme]);

  // Initialize state with local storage fallback or initial seed data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('shorten_it_user_profile');
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    testFirebaseConnection();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserProfile((prev) => ({
          ...prev,
          name: firebaseUser.displayName || prev.name || 'User',
          email: firebaseUser.email || prev.email,
          avatar: firebaseUser.photoURL || prev.avatar,
          isLoggedIn: true,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const [links, setLinks] = useState<ShortLink[]>(() => {
    try {
      const saved = localStorage.getItem('shorten_it_links');
      return saved ? JSON.parse(saved) : initialLinks;
    } catch {
      return initialLinks;
    }
  });

  const [visitedLinks, setVisitedLinks] = useState<VisitedLink[]>(() => {
    try {
      const saved = localStorage.getItem('shorten_it_visited_links');
      return saved ? JSON.parse(saved) : initialVisitedLinks;
    } catch {
      return initialVisitedLinks;
    }
  });

  const [activeView, setActiveView] = useState<ViewType>('shortener');
  const [selectedLinkId, setSelectedLinkId] = useState<string>('link-1');

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shorten_it_user_profile', JSON.stringify(userProfile));
    } catch (err) {
      console.error('Error saving user profile to localStorage:', err);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('shorten_it_links', JSON.stringify(links));
    } catch (err) {
      console.error('Error saving links to localStorage:', err);
    }
  }, [links]);

  useEffect(() => {
    try {
      localStorage.setItem('shorten_it_visited_links', JSON.stringify(visitedLinks));
    } catch (err) {
      console.error('Error saving visited links to localStorage:', err);
    }
  }, [visitedLinks]);

  // Find currently selected link for Analytics View
  const selectedLink = links.find((l) => l.id === selectedLinkId) || links[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        theme={theme}
        setTheme={setTheme}
      />

      {/* View Router Canvas */}
      <main className="flex-1 w-full flex flex-col items-center justify-start pb-12">
        {activeView === 'shortener' && (
          <ShortenerView
            links={links}
            setLinks={setLinks}
            setActiveView={setActiveView}
            setSelectedLinkId={setSelectedLinkId}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            links={links}
            setLinks={setLinks}
            visitedLinks={visitedLinks}
            setVisitedLinks={setVisitedLinks}
            setActiveView={setActiveView}
            setSelectedLinkId={setSelectedLinkId}
          />
        )}

        {activeView === 'settings' && (
          <ProfileSettingsView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView
            selectedLink={selectedLink}
            setActiveView={setActiveView}
            setLinks={setLinks}
          />
        )}

        {activeView === 'visited-history' && (
          <VisitedLinksView
            visitedLinks={visitedLinks}
            setVisitedLinks={setVisitedLinks}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'redirect-preview' && (
          <RedirectPreviewView
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'login' && (
          <LoginView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            setActiveView={setActiveView}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

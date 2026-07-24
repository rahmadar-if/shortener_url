import React from 'react';
import { ArrowLeft, Sparkles, Shield, Link, User, ExternalLink, Linkedin, CheckCircle2, Zap } from 'lucide-react';
import { ViewType } from '../types';

interface AboutViewProps {
  setActiveView: (view: ViewType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveView }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 animate-in fade-in duration-200">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => setActiveView('shortener')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            About <span className="text-indigo-500">Shorten.it</span>
          </h1>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-medium self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clean • Fast • Ad-Free</span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Project Mission & Purpose (2 cols on lg) */}
        <div className="lg:col-span-2 bento-card flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              <Shield className="w-4 h-4" />
              <span>Project Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 leading-tight">
              Empowering Unlimited, Ad-Free Link Management
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Shorten.it was engineered as a high-performance, privacy-first solution to replace bloated, ad-ridden URL shortening tools. Traditional link shorteners subject users to intrusive interstitial ads, artificial redirect delays, and restrictive paywalls. Shorten.it eliminates friction by offering instantaneous, clean redirects, real-time analytics, and seamless link management for modern web users and teams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Interstitial Ads</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Redirect Speed</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Privacy-Focused Logs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Value Highlight Card (1 col) */}
        <div className="bento-card bg-gradient-to-br from-indigo-950/40 via-[#1E293B] to-[#1E293B] border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-6 shadow-lg shadow-indigo-500/10">
            <Zap className="w-6 h-6 fill-indigo-400/20" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold block mb-2">
              Key Capability
            </span>
            <h3 className="text-xl font-bold text-white mb-3">
              Free & Unlimited URL Shortening
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate 500+ custom shortened URLs effortlessly without restrictive monthly quotas, forced subscriptions, or hidden tier limits.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Capacity</span>
            <span className="font-mono text-indigo-400 font-bold">500+ URLs / User</span>
          </div>
        </div>

      </div>

      {/* Founder Profile & Bio Section */}
      <div className="bento-card border-slate-700/80 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-6 pb-3 border-b border-slate-800">
          <User className="w-4 h-4" />
          <span>Meet the Founder</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            {/* Founder Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20 shrink-0 border border-indigo-300/30">
              RA
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Rahmad Arif
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
                  Founder & Developer
                </span>
              </div>

              {/* Website Reference */}
              <p className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <span>Website:</span>
                <a
                  href="https://rahmadarif.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
                >
                  rahmadarif.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-2xl">
                A dedicated solution architect & software engineer with a passion for building clean, utility-first web applications, privacy-friendly developer tools, and intuitive digital experiences.
              </p>
            </div>
          </div>

          {/* LinkedIn Badge / Button */}
          <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <a
              href="https://www.linkedin.com/in/rahmadar-if/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2.5 px-5 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#0A66C2]/20 border border-blue-400/30 group"
            >
              <Linkedin className="w-4 h-4 fill-current" />
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

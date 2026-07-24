import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-800/80 bg-[#0B1326]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          <span>© {new Date().getFullYear()} Shorten.it — Technical Precision. Minimalist Scale.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Terms</a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="#api" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">API Docs</a>
          <a href="#status" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">System Status</a>
          <a href="#twitter" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

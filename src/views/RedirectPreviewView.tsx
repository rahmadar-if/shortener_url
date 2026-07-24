import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { ViewType } from '../types';

interface RedirectPreviewViewProps {
  setActiveView: (view: ViewType) => void;
}

export const RedirectPreviewView: React.FC<RedirectPreviewViewProps> = ({ setActiveView }) => {
  const [progress, setProgress] = useState(0);
  const [targetUrl, setTargetUrl] = useState('https://shrt.ly/campaign-beta-092');
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [reported, setReported] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);

  const startSimulation = () => {
    setProgress(0);
    setIsRedirected(false);
  };

  useEffect(() => {
    if (progress >= 100) {
      setIsRedirected(true);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 25 + 10;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('shortener')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 font-medium text-sm transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shortener</span>
        </button>

        <button
          onClick={startSimulation}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Animation</span>
        </button>
      </div>

      {/* Main Redirect Card */}
      <div className="glass-card rounded-2xl p-8 sm:p-12 text-center space-y-8 border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Brand Anchor */}
        <div className="text-center">
          <span className="font-mono text-xl font-extrabold tracking-widest text-indigo-400/60 uppercase">
            SHORTEN.IT
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isRedirected ? 'Redirect Complete!' : 'Redirecting you shortly...'}
          </h1>

          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
            <div
              className="h-full bg-indigo-500 transition-all duration-200 ease-out shadow-[0_0_20px_rgba(99,102,241,0.8)] relative"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shimmer w-full h-full opacity-60" />
            </div>
          </div>
        </div>

        {/* Target URL Info & Feedback Controls */}
        <div className="space-y-6 pt-2">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
              TARGET URL
            </span>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-transparent border-none text-center font-mono text-xs sm:text-sm text-slate-300 focus:outline-none w-full max-w-md mx-auto hover:text-indigo-400 transition-colors"
            />
          </div>

          {/* User Feedback buttons */}
          <div className="flex items-center justify-center space-x-6 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            
            <button
              onClick={() => {
                setUserLiked(!userLiked);
                if (userDisliked) setUserDisliked(false);
              }}
              className={`flex items-center space-x-1.5 transition-colors ${
                userLiked ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="uppercase">Like</span>
            </button>

            <button
              onClick={() => {
                setUserDisliked(!userDisliked);
                if (userLiked) setUserLiked(false);
              }}
              className={`flex items-center space-x-1.5 transition-colors ${
                userDisliked ? 'text-rose-400 font-bold' : 'hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="uppercase">Dislike</span>
            </button>

            <button
              onClick={() => setReported(!reported)}
              className={`flex items-center space-x-1.5 transition-colors ${
                reported ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span className="uppercase">{reported ? 'Reported' : 'Report'}</span>
            </button>

          </div>

          {isRedirected && (
            <div className="pt-2 animate-in fade-in">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                <span>Continue to Target Destination</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

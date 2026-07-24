import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  History, 
  Clock, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { VisitedLink, ViewType } from '../types';

interface VisitedLinksViewProps {
  visitedLinks: VisitedLink[];
  setVisitedLinks: React.Dispatch<React.SetStateAction<VisitedLink[]>>;
  setActiveView: (view: ViewType) => void;
}

export const VisitedLinksView: React.FC<VisitedLinksViewProps> = ({
  visitedLinks,
  setVisitedLinks,
  setActiveView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [reportSuccessId, setReportSuccessId] = useState<string | null>(null);

  const handleLike = (id: string, isLike: boolean) => {
    setVisitedLinks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let newLikes = item.likes;
        let newDislikes = item.dislikes;
        let userLiked = item.userLiked;
        let userDisliked = item.userDisliked;

        if (isLike) {
          if (userLiked) {
            newLikes--;
            userLiked = false;
          } else {
            newLikes++;
            userLiked = true;
            if (userDisliked) {
              newDislikes--;
              userDisliked = false;
            }
          }
        } else {
          if (userDisliked) {
            newDislikes--;
            userDisliked = false;
          } else {
            newDislikes++;
            userDisliked = true;
            if (userLiked) {
              newLikes--;
              userLiked = false;
            }
          }
        }

        return { ...item, likes: newLikes, dislikes: newDislikes, userLiked, userDisliked };
      })
    );
  };

  const handleReport = (id: string) => {
    setVisitedLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reported: true } : item))
    );
    setReportSuccessId(id);
    setTimeout(() => setReportSuccessId(null), 2500);
  };

  const handleClearHistory = () => {
    setVisitedLinks([]);
    setShowClearConfirm(false);
  };

  const filteredLinks = visitedLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Back Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('shortener')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 font-medium text-sm transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shortener</span>
        </button>

        {visitedLinks.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Visit History</span>
          </button>
        )}
      </div>

      {/* Header Section */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Visited Links History</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Log of external shortened links accessed through Shorten.it</p>
        </div>

        {/* Search Filter Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visited history..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Visited Links Log List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4 border-slate-800">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">No visited links recorded in your history.</p>
            <button
              onClick={() => setActiveView('shortener')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Shorten a Link
            </button>
          </div>
        ) : (
          filteredLinks.map((vLink) => (
            <div
              key={vLink.id}
              className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white tracking-tight">{vLink.title}</h3>
                  {vLink.reported && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold uppercase border border-rose-500/30">
                      Reported
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-slate-400 truncate max-w-lg">
                  {vLink.originalUrl}
                </p>

                {/* Status & Timestamp */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Visited: {vLink.visitedAt}</span>
                  </span>

                  {/* Likes & Dislikes */}
                  <button
                    onClick={() => handleLike(vLink.id, true)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-colors ${
                      vLink.userLiked ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{vLink.likes}</span>
                  </button>

                  <button
                    onClick={() => handleLike(vLink.id, false)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-colors ${
                      vLink.userDisliked ? 'bg-rose-500/20 text-rose-400' : 'hover:text-slate-300'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{vLink.dislikes}</span>
                  </button>

                  {/* Report action */}
                  <button
                    onClick={() => handleReport(vLink.id)}
                    className={`flex items-center space-x-1 hover:text-rose-400 transition-colors ${
                      vLink.reported ? 'text-rose-400 font-bold' : ''
                    }`}
                    title="Report suspicious link"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{reportSuccessId === vLink.id ? 'Reported!' : 'Report'}</span>
                  </button>
                </div>
              </div>

              {/* Primary Action: Visit Again */}
              <div className="shrink-0 self-end md:self-center">
                <a
                  href={vLink.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  <span>Visit Again</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 border-slate-700 text-center">
            <h3 className="text-lg font-bold text-white">Clear Visit History?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to erase all visited link logs? This action cannot be undone.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-500"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  LogOut, 
  BarChart2, 
  Copy, 
  Check, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Filter, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Sparkles,
  Flag
} from 'lucide-react';
import { ShortLink, VisitedLink, UserProfile, ViewType } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  links: ShortLink[];
  setLinks: React.Dispatch<React.SetStateAction<ShortLink[]>>;
  visitedLinks: VisitedLink[];
  setVisitedLinks: React.Dispatch<React.SetStateAction<VisitedLink[]>>;
  setActiveView: (view: ViewType) => void;
  setSelectedLinkId: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  setUserProfile,
  links,
  setLinks,
  visitedLinks,
  setVisitedLinks,
  setActiveView,
  setSelectedLinkId,
}) => {
  const [activeTab, setActiveTab] = useState<'created' | 'visited'>('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [showLoggedOutBanner, setShowLoggedOutBanner] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLikeCreatedLink = (id: string, isLike: boolean) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id !== id) return link;
        
        let newLikes = link.likes;
        let newDislikes = link.dislikes;
        let userLiked = link.userLiked;
        let userDisliked = link.userDisliked;

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

        return {
          ...link,
          likes: Math.max(0, newLikes),
          dislikes: Math.max(0, newDislikes),
          userLiked,
          userDisliked,
          analytics: {
            ...link.analytics,
            totalLikes: Math.max(0, newLikes),
            totalDislikes: Math.max(0, newDislikes),
          },
        };
      })
    );
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setLinkToDelete(null);
  };

  const handleLogOut = () => {
    setShowLoggedOutBanner(true);
    setTimeout(() => {
      setShowLoggedOutBanner(false);
      setActiveView('shortener');
    }, 1500);
  };

  const filteredCreatedLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVisitedLinks = visitedLinks.filter(
    (vLink) =>
      vLink.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vLink.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
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
      </div>

      {/* Log Out Notification Toast */}
      {showLoggedOutBanner && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>You have been successfully logged out. Returning to home...</span>
        </div>
      )}

      {/* User Profile Card */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          
          {/* Avatar with Status Indicator */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/10">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{userProfile.name}</h1>
              <button
                onClick={() => setActiveView('settings')}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                title="Profile Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-400 font-mono">{userProfile.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                {userProfile.plan}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold">
                {links.length} Links Created
              </span>
            </div>
          </div>
        </div>

        {/* Log Out Action Button */}
        <div>
          <button
            onClick={handleLogOut}
            className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-medium text-sm flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </section>

      {/* Your Shortened Links Section Header */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Shortened Links</h2>
          
          {/* Search Filter Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Dual Tab Switcher: Created Links vs Visited Links */}
        <div className="flex border-b border-slate-800 space-x-8">
          <button
            onClick={() => setActiveTab('created')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'created'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Created Links ({filteredCreatedLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('visited')}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === 'visited'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visited Links ({filteredVisitedLinks.length})
          </button>
        </div>

        {/* Tab Content: Created Links */}
        {activeTab === 'created' && (
          <div className="space-y-4">
            {filteredCreatedLinks.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center space-y-3">
                <p className="text-slate-400 text-sm">No created links found matching your search.</p>
                <button
                  onClick={() => setActiveView('shortener')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium"
                >
                  Create a Link Now
                </button>
              </div>
            ) : (
              filteredCreatedLinks.map((link) => (
                <div
                  key={link.id}
                  className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    
                    {/* Short link title & Code */}
                    <div className="flex items-center space-x-2">
                      <span
                        onClick={() => {
                          setSelectedLinkId(link.id);
                          setActiveView('analytics');
                        }}
                        className="text-lg font-bold text-indigo-400 hover:underline cursor-pointer tracking-tight"
                      >
                        {link.shortUrl}
                      </span>
                    </div>

                    {/* Original Destination URL */}
                    <p className="text-xs text-slate-400 truncate max-w-xl font-mono">
                      {link.originalUrl}
                    </p>

                    {/* Meta stats bar */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{link.createdAt}</span>
                      </span>

                      <span className="flex items-center space-x-1 text-slate-300">
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{link.clicks.toLocaleString()} clicks</span>
                      </span>

                      {/* Interactive Likes/Dislikes */}
                      <button
                        onClick={() => handleLikeCreatedLink(link.id, true)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-colors ${
                          link.userLiked ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-slate-200'
                        }`}
                        title="Like this link"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{link.likes}</span>
                      </button>

                      <button
                        onClick={() => handleLikeCreatedLink(link.id, false)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-colors ${
                          link.userDisliked ? 'bg-rose-500/20 text-rose-400' : 'hover:text-slate-200'
                        }`}
                        title="Dislike this link"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{link.dislikes}</span>
                      </button>
                    </div>

                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    
                    {/* Analytics Button */}
                    <button
                      onClick={() => {
                        setSelectedLinkId(link.id);
                        setActiveView('analytics');
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
                      title="View Detailed Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(link.shortUrl, link.id)}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy Short Link"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setLinkToDelete(link.id)}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Visited Links */}
        {activeTab === 'visited' && (
          <div className="space-y-4">
            {filteredVisitedLinks.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center space-y-3">
                <p className="text-slate-400 text-sm">No visited history found.</p>
                <button
                  onClick={() => setActiveView('visited-history')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium"
                >
                  Explore Visited Links
                </button>
              </div>
            ) : (
              filteredVisitedLinks.map((vLink) => (
                <div
                  key={vLink.id}
                  className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-base font-bold text-white truncate">{vLink.title}</h3>
                    <p className="text-xs text-slate-400 truncate font-mono">{vLink.originalUrl}</p>
                    <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                      <span>Visited on {vLink.visitedAt}</span>
                    </div>
                  </div>

                  <a
                    href={vLink.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Visit Again</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>
        )}

      </section>

      {/* Confirmation Modal for Deleting Link */}
      {linkToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 border-slate-700 text-center">
            <h3 className="text-lg font-bold text-white">Delete Link?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this link? Analytics history will be permanently removed.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setLinkToDelete(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLink(linkToDelete)}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

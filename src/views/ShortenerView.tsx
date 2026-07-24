import React, { useState } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  ExternalLink, 
  QrCode, 
  BarChart2, 
  Link as LinkIcon,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';
import { ShortLink, ViewType } from '../types';

interface ShortenerViewProps {
  links: ShortLink[];
  setLinks: React.Dispatch<React.SetStateAction<ShortLink[]>>;
  setActiveView: (view: ViewType) => void;
  setSelectedLinkId: (id: string) => void;
}

export const ShortenerView: React.FC<ShortenerViewProps> = ({
  links,
  setLinks,
  setActiveView,
  setSelectedLinkId,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeResultLink, setActiveResultLink] = useState<ShortLink | null>(null);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Generate random 6-char short code
  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleShorten = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage('Please enter a valid URL first.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsProcessing(true);
    setErrorMessage('');

    setTimeout(() => {
      const code = generateShortCode();
      const newShortUrl = `shrt.it/${code}`;
      const titleFallback = customTitle.trim() || new URL(formattedUrl).hostname.replace('www.', '');

      const newLink: ShortLink = {
        id: 'link-' + Date.now(),
        originalUrl: formattedUrl,
        shortCode: code,
        shortUrl: newShortUrl,
        title: titleFallback,
        createdAt: 'Just now',
        clicks: 0,
        likes: 0,
        dislikes: 0,
        reports: 0,
        analytics: {
          totalClicks: 0,
          uniqueVisitors: 0,
          conversionRate: '0.0%',
          totalLikes: 0,
          totalDislikes: 0,
          totalReports: 0,
          clicksOverTime: [
            { date: 'Today', clicks: 0 },
          ],
          geoDistribution: [
            { country: 'USA', code: 'US', flag: '🇺🇸', clicks: 0 },
          ],
          deviceBreakdown: [
            { device: 'Desktop', percentage: 100, color: '#2DD4BF' },
          ],
          topReferrers: [
            { source: 'Direct', percentage: 100 },
          ],
        },
      };

      setLinks((prev) => [newLink, ...prev]);
      setActiveResultLink(newLink);
      setAliasInput(code);
      setIsProcessing(false);
      setUrlInput('');
      setCustomTitle('');
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAlias = () => {
    if (!activeResultLink) return;
    const cleanAlias = aliasInput.trim().replace(/[^a-zA-Z0-9-_]/g, '') || activeResultLink.shortCode;
    const updatedShortUrl = `shrt.it/${cleanAlias}`;

    const updatedLink = {
      ...activeResultLink,
      shortCode: cleanAlias,
      shortUrl: updatedShortUrl,
    };

    setLinks((prev) =>
      prev.map((l) => (l.id === activeResultLink.id ? updatedLink : l))
    );
    setActiveResultLink(updatedLink);
    setIsEditingAlias(false);
  };

  const handleNavigateToAnalytics = (linkId: string) => {
    setSelectedLinkId(linkId);
    setActiveView('analytics');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 mb-10 max-w-2xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Ad-Free • Lightning Fast • Real-time Tracking</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Simplify your links<span className="text-indigo-500">.</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Clean, trackable, and lightning fast. The professional standard for URL management.
        </p>
      </section>

      {/* Main Link Input Card */}
      <div className="w-full max-w-3xl space-y-6">
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="relative group">
            <div className={`bg-slate-900/90 rounded-2xl border transition-all duration-300 p-4 sm:p-6 shadow-2xl ${
              errorMessage 
                ? 'border-rose-500/80 ring-2 ring-rose-500/20' 
                : 'border-slate-800 hover:border-slate-700 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
            }`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 flex items-center space-x-3 px-2">
                  <LinkIcon className="w-6 h-6 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste your long link here..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg sm:text-2xl font-medium focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Optional Title input */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Optional title / label (e.g. Portfolio Website)"
                  className="w-full bg-transparent border-none outline-none text-slate-300 placeholder-slate-600 focus:ring-0 p-0 text-xs"
                />
                <span className="text-slate-600 font-mono text-[10px] uppercase shrink-0 pl-2">HTTPS AUTO-CHECK</span>
              </div>
            </div>
            {errorMessage && (
              <p className="mt-2 text-xs text-rose-400 font-medium pl-2">{errorMessage}</p>
            )}
          </div>

          {/* Primary Shorten Action Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95 flex items-center space-x-3 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Shorten link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Result Container */}
        {activeResultLink && (
          <div className="mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            {!isEditingAlias ? (
              /* Display Mode */
              <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-indigo-500/30">
                <div className="space-y-1.5 text-center sm:text-left overflow-hidden w-full">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                    Shortened URL Generated
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">
                    {activeResultLink.shortUrl}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    Target: <span className="text-slate-300">{activeResultLink.originalUrl}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setIsEditingAlias(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700/60"
                  >
                    <Edit3 className="w-4 h-4 text-slate-400" />
                    <span>Edit Alias</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700/60"
                  >
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>QR Code</span>
                  </button>

                  <button
                    onClick={() => handleCopy(activeResultLink.shortUrl, activeResultLink.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-lg ${
                      copiedId === activeResultLink.id
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                    }`}
                  >
                    {copiedId === activeResultLink.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Back-half Alias Edit Mode */
              <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-indigo-500/40">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                    Customize your back-half alias
                  </label>
                  <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-700 p-3.5 rounded-xl focus-within:border-indigo-500">
                    <span className="text-slate-400 font-mono text-base">shrt.it/</span>
                    <input
                      type="text"
                      value={aliasInput}
                      onChange={(e) => setAliasInput(e.target.value)}
                      placeholder="custom-alias"
                      className="bg-transparent border-none outline-none text-white font-medium text-lg w-full p-0 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Only letters, numbers, hyphens, and underscores allowed.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditingAlias(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAlias}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Recent Links Showcase Section */}
        {links.length > 0 && (
          <div className="pt-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Recent Shortened Links
              </h3>
              <button
                onClick={() => setActiveView('profile')}
                className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-medium flex items-center space-x-1"
              >
                <span>View all ({links.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {links.slice(0, 3).map((link) => (
                <div
                  key={link.id}
                  className="glass-card glass-card-hover rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-indigo-400 text-sm hover:underline cursor-pointer" onClick={() => handleNavigateToAnalytics(link.id)}>
                        {link.shortUrl}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {link.clicks.toLocaleString()} clicks
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-1">
                      {link.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleNavigateToAnalytics(link.id)}
                      className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                      title="View Link Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(link.shortUrl, link.id)}
                      className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Copy Short Link"
                    >
                      {copiedId === link.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* QR Code Modal */}
      {showQrModal && activeResultLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-sm w-full space-y-6 text-center border-slate-700 relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Link QR Code</h3>
            <p className="text-xs text-slate-400">{activeResultLink.shortUrl}</p>

            {/* Generated QR visual */}
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-2xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeResultLink.shortUrl)}&color=0f172a`}
                alt="Link QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleCopy(activeResultLink.shortUrl, 'qr-modal')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                {copiedId === 'qr-modal' ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

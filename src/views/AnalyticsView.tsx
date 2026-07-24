import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Edit3, 
  Share2, 
  MousePointer, 
  Users, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Globe2, 
  Smartphone, 
  Laptop, 
  Tablet, 
  BarChart, 
  ExternalLink,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ShortLink, ViewType } from '../types';

interface AnalyticsViewProps {
  selectedLink: ShortLink | null;
  setActiveView: (view: ViewType) => void;
  setLinks: React.Dispatch<React.SetStateAction<ShortLink[]>>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  selectedLink,
  setActiveView,
  setLinks,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');
  const [copied, setCopied] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; clicks: number; x: number; y: number } | null>(null);
  const [shareToast, setShareToast] = useState(false);

  if (!selectedLink) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-400">No link selected for analytics.</p>
        <button
          onClick={() => setActiveView('profile')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-medium"
        >
          Return to Profile
        </button>
      </div>
    );
  }

  const { analytics } = selectedLink;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedLink.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedLink.title,
        url: selectedLink.shortUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(selectedLink.shortUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // Render SVG Area Chart
  const clickPoints = analytics.clicksOverTime;
  const maxClicks = Math.max(...clickPoints.map((p) => p.clicks), 100);
  const chartHeight = 200;
  const chartWidth = 700;

  const pointsFormatted = clickPoints.map((p, idx) => {
    const x = (idx / (clickPoints.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 30);
    return { ...p, x, y };
  });

  const pathD = pointsFormatted.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );

  const areaD = `${pathD} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('profile')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 font-medium text-sm transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shortened Links</span>
        </button>

        {shareToast && (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg animate-in fade-in">
            Link copied to clipboard for sharing!
          </div>
        )}
      </div>

      {/* Top Bar Header with Link Info & Quick Actions */}
      <header className="glass-card rounded-2xl p-6 sm:p-8 border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Active Analytics
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {selectedLink.shortUrl}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono truncate max-w-xl flex items-center space-x-1">
            <span>Target:</span>
            <a 
              href={selectedLink.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span className="truncate">{selectedLink.originalUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* 4 Overview Metric Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Clicks */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MousePointer className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +12.4%
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Total Clicks</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {analytics.totalClicks.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +8.1%
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Unique Visitors</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {analytics.uniqueVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Card 3: Conversion Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +5.7%
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Conversion Rate</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {analytics.conversionRate}
            </p>
          </div>
        </div>

        {/* Card 4: Engagement Matrix (Likes / Dislikes / Reports) */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              98% Positive
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Engagement Matrix</p>
            <div className="flex items-center space-x-3 mt-2 text-xs font-mono">
              <span className="flex items-center space-x-1 text-emerald-400">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedLink.likes}</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-400">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{selectedLink.dislikes}</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-500">
                <Flag className="w-3.5 h-3.5" />
                <span>{selectedLink.reports}</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Line Chart: Clicks Over Time */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Click Performance Over Time</h2>
            <p className="text-xs text-slate-400 mt-1">Aggregated click frequency for the selected timeframe</p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start sm:self-center">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                timeRange === '30d' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                timeRange === '90d' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                timeRange === '1y' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Interactive SVG Chart Canvas */}
        <div className="relative w-full overflow-hidden pt-4">
          
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 sm:h-64 overflow-visible">
            <defs>
              <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#1E293B" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#1E293B" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2={chartWidth} y2="150" stroke="#1E293B" strokeDasharray="4 4" />

            {/* Gradient Fill under path */}
            <path d={areaD} fill="url(#glowArea)" />

            {/* Vibrant Line Stroke */}
            <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="3.5" strokeLinecap="round" />

            {/* Interactive Points */}
            {pointsFormatted.map((pt, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  className="fill-indigo-500 stroke-slate-900 stroke-2 transition-transform group-hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-900 border border-indigo-500/50 text-white px-3 py-1.5 rounded-lg shadow-2xl text-xs font-mono z-20 -translate-x-1/2 -translate-y-12"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100}%`,
              }}
            >
              <span className="text-slate-400">{hoveredPoint.date}: </span>
              <span className="text-indigo-300 font-bold">{hoveredPoint.clicks} clicks</span>
            </div>
          )}

          {/* Dates X-Axis Labels */}
          <div className="flex justify-between mt-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            {clickPoints.map((p, idx) => (
              <span key={idx}>{p.date}</span>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom Breakdown Grid: Geographic Distribution, Device Breakdown, Top Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographic Distribution */}
        <section className="glass-card rounded-2xl p-6 space-y-4 border-slate-800">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Globe2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Geographic Distribution</h3>
          </div>

          <div className="space-y-3">
            {analytics.geoDistribution.map((geo) => (
              <div key={geo.code} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{geo.flag}</span>
                  <span className="text-sm font-medium text-slate-200">{geo.country}</span>
                </div>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {geo.clicks.toLocaleString()} clicks
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Device & Referrer Column */}
        <div className="space-y-6">
          
          {/* Device Type Breakdown */}
          <section className="glass-card rounded-2xl p-6 space-y-4 border-slate-800">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Device Types</h3>
            </div>

            <div className="flex items-center justify-around">
              {/* Donut percentage visualization */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#1E293B" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#6366F1" strokeWidth="4" strokeDasharray="65 100" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#2DD4BF" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-65" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#A855F7" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-90" />
                </svg>
                <span className="absolute font-mono font-bold text-sm text-white">65%</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {analytics.deviceBreakdown.map((dev) => (
                  <div key={dev.device} className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dev.color }} />
                    <span className="text-slate-300">{dev.device}:</span>
                    <span className="text-white font-bold">{dev.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Referrers Breakdown */}
          <section className="glass-card rounded-2xl p-6 space-y-4 border-slate-800">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <BarChart className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Top Referrers</h3>
            </div>

            <div className="space-y-3">
              {analytics.topReferrers.map((ref) => (
                <div key={ref.source} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{ref.source}</span>
                    <span className="text-indigo-400 font-bold">{ref.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${ref.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
};

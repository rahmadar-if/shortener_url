export type ViewType = 
  | 'shortener' 
  | 'profile' 
  | 'settings' 
  | 'analytics' 
  | 'visited-history' 
  | 'redirect-preview'
  | 'login'
  | 'about';

export interface ClickDataPoint {
  date: string;
  clicks: number;
}

export interface GeoLocationData {
  country: string;
  code: string;
  flag: string;
  clicks: number;
}

export interface DeviceData {
  device: 'Mobile' | 'Desktop' | 'Tablet';
  percentage: number;
  color: string;
}

export interface ReferrerData {
  source: string;
  percentage: number;
}

export interface LinkAnalytics {
  totalClicks: number;
  uniqueVisitors: number;
  conversionRate: string;
  totalLikes: number;
  totalDislikes: number;
  totalReports: number;
  clicksOverTime: ClickDataPoint[];
  geoDistribution: GeoLocationData[];
  deviceBreakdown: DeviceData[];
  topReferrers: ReferrerData[];
}

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title: string;
  createdAt: string;
  clicks: number;
  likes: number;
  dislikes: number;
  reports: number;
  analytics: LinkAnalytics;
  userLiked?: boolean;
  userDisliked?: boolean;
}

export interface VisitedLink {
  id: string;
  originalUrl: string;
  title: string;
  visitedAt: string;
  likes: number;
  dislikes: number;
  reported?: boolean;
  shortCode?: string;
  userLiked?: boolean;
  userDisliked?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  linksCount: number;
  emailNotifications: boolean;
  publicAnalytics: boolean;
  twoFactorEnabled: boolean;
  language: string;
  isLoggedIn?: boolean;
}

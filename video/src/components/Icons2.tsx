import React from 'react';
import { color } from '../brand/tokens';

// Iconos de línea (24×24, trazo 1,8) para la reseña: mismo estilo que Icons.tsx.
type P = { size?: number; c?: string; sw?: number };
const S: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const PhoneIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" stroke={c} strokeWidth={sw} /><path d="M10.5 18.5h3" stroke={c} strokeWidth={sw} /></S>
);
export const TabletIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="3.5" y="3.5" width="17" height="17" rx="2.6" stroke={c} strokeWidth={sw} /><path d="M10.5 17.5h3" stroke={c} strokeWidth={sw} /></S>
);
export const LaptopIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="4.5" y="5" width="15" height="10.5" rx="1.6" stroke={c} strokeWidth={sw} /><path d="M2.5 19h19" stroke={c} strokeWidth={sw} /></S>
);
export const GlobeIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw} /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" stroke={c} strokeWidth={sw} /></S>
);
export const MagazineIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="5" y="3" width="14" height="18" rx="1.8" stroke={c} strokeWidth={sw} /><path d="M8 7h8M8 10.5h8M8 14h5" stroke={c} strokeWidth={sw} /></S>
);
export const SearchIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth={sw} /><path d="M15.5 15.5l5 5" stroke={c} strokeWidth={sw} /></S>
);
export const ClockIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw} /><path d="M12 7v5l3.2 2" stroke={c} strokeWidth={sw} /></S>
);
export const UserIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="12" cy="8.5" r="4" stroke={c} strokeWidth={sw} /><path d="M4.5 20.5c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6" stroke={c} strokeWidth={sw} /></S>
);
export const KidIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="12" cy="10" r="5.5" stroke={c} strokeWidth={sw} /><circle cx="10" cy="9.6" r="0.7" fill={c} /><circle cx="14" cy="9.6" r="0.7" fill={c} /><path d="M10.2 12.2c1 .9 2.6.9 3.6 0M9 4.8c1.5-1.6 4.4-1.7 6 0M7 21c1-2.4 2.8-3.6 5-3.6s4 1.2 5 3.6" stroke={c} strokeWidth={sw} /></S>
);
export const LockIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="5" y="10.5" width="14" height="10" rx="2.2" stroke={c} strokeWidth={sw} /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke={c} strokeWidth={sw} /><circle cx="12" cy="15.5" r="1.3" fill={c} /></S>
);
export const DownloadIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5M4.5 19.5h15" stroke={c} strokeWidth={sw} /></S>
);
export const PlaneIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M10.2 13.6L3.5 11l1.4-1.4 7.4.6 4.6-4.6c.8-.8 2.2-.9 3-.1.8.8.7 2.2-.1 3l-4.6 4.6.6 7.4-1.4 1.4-2.6-6.7-3 3 .2 2.4-1.2 1.2-1.5-3.4-3.4-1.5 1.2-1.2 2.4.2z" stroke={c} strokeWidth={sw * 0.85} /></S>
);
export const WifiOffIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M2.5 8.8A15 15 0 0 1 9 5.5M21.5 8.8a15 15 0 0 0-6.6-3.3M5.6 12.2a10.5 10.5 0 0 1 4.2-2.3M18.4 12.2a10.4 10.4 0 0 0-2.3-1.7M8.7 15.6a6 6 0 0 1 6.6 0M3.5 3.5l17 17" stroke={c} strokeWidth={sw} /><circle cx="12" cy="19" r="1.2" fill={c} /></S>
);
export const MoonIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" stroke={c} strokeWidth={sw} /></S>
);
export const SpeedIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M4.2 17.5a9 9 0 1 1 15.6 0" stroke={c} strokeWidth={sw} /><path d="M12 13.5l4.2-4.2" stroke={c} strokeWidth={sw} /><circle cx="12" cy="13.5" r="1.4" fill={c} /></S>
);
export const BookmarkIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z" stroke={c} strokeWidth={sw} /></S>
);
export const ListIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M9 6.5h11M9 12h11M9 17.5h11" stroke={c} strokeWidth={sw} /><circle cx="4.8" cy="6.5" r="1.2" fill={c} /><circle cx="4.8" cy="12" r="1.2" fill={c} /><circle cx="4.8" cy="17.5" r="1.2" fill={c} /></S>
);
export const FontIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M3.5 18.5L8.5 5.5l5 13M5.4 13.8h6.2M15 18.5l3-7.6 3 7.6M15.9 16.3h4.2" stroke={c} strokeWidth={sw} /></S>
);
export const SyncIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M19.5 9.5A7.8 7.8 0 0 0 5.6 7.4L4 9M4.5 14.5a7.8 7.8 0 0 0 13.9 2.1L20 15M4 4.5V9h4.5M20 19.5V15h-4.5" stroke={c} strokeWidth={sw} /></S>
);
export const CarIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M4 16.5v-4l2.2-5.2A2 2 0 0 1 8 6h8a2 2 0 0 1 1.8 1.3l2.2 5.2v4M4 16.5h16M4 16.5V19h3v-2.5M17 16.5V19h3v-2.5M4.6 12.5h14.8" stroke={c} strokeWidth={sw} /><circle cx="7.6" cy="14.4" r="0.9" fill={c} /><circle cx="16.4" cy="14.4" r="0.9" fill={c} /></S>
);
export const WatchIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><circle cx="12" cy="12" r="5.6" stroke={c} strokeWidth={sw} /><path d="M9.2 7.1L10 2.8h4l.8 4.3M9.2 16.9l.8 4.3h4l.8-4.3M12 9.6V12l1.6 1.2" stroke={c} strokeWidth={sw} /></S>
);
export const CastIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M5 16.5H4A1.5 1.5 0 0 1 2.5 15V5A1.5 1.5 0 0 1 4 3.5h16A1.5 1.5 0 0 1 21.5 5v10a1.5 1.5 0 0 1-1.5 1.5h-1" stroke={c} strokeWidth={sw} /><path d="M12 14l5 6.5H7z" stroke={c} strokeWidth={sw} /></S>
);
export const EreaderIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="5" y="2.5" width="14" height="19" rx="2" stroke={c} strokeWidth={sw} /><rect x="7.5" y="5" width="9" height="11.5" rx="0.8" stroke={c} strokeWidth={sw * 0.8} /><path d="M9.3 8h5.4M9.3 10.5h5.4M9.3 13h3.4" stroke={c} strokeWidth={sw * 0.7} /></S>
);
export const PdfIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M6 2.5h8.5L19 7v14.5H6z" stroke={c} strokeWidth={sw} /><path d="M14.5 2.5V7H19" stroke={c} strokeWidth={sw} /><rect x="3.5" y="11" width="13" height="6.5" rx="1.4" fill={color.red} /><path d="M5.8 15.8v-3.3h1.3a1 1 0 0 1 0 2H5.8M9.4 15.8v-3.3h1a1.65 1.65 0 0 1 0 3.3zM13.3 15.8v-3.3h2M13.3 14.2h1.6" stroke="#fff" strokeWidth={0.9} /></S>
);
export const StarIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z" stroke={c} strokeWidth={sw} /></S>
);
export const ChartIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><path d="M4 20.5h16" stroke={c} strokeWidth={sw} /><rect x="5.5" y="12" width="3" height="6" rx="0.8" stroke={c} strokeWidth={sw} /><rect x="10.5" y="7" width="3" height="11" rx="0.8" stroke={c} strokeWidth={sw} /><rect x="15.5" y="9.5" width="3" height="8.5" rx="0.8" stroke={c} strokeWidth={sw} /></S>
);
export const CardIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="2.5" y="5" width="19" height="14" rx="2.2" stroke={c} strokeWidth={sw} /><path d="M2.5 9.5h19M6 15h4" stroke={c} strokeWidth={sw} /></S>
);
export const MailIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="3" y="5" width="18" height="14" rx="2.2" stroke={c} strokeWidth={sw} /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke={c} strokeWidth={sw} /></S>
);
export const CalendarIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 1.8 }) => (
  <S size={size}><rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke={c} strokeWidth={sw} /><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke={c} strokeWidth={sw} /></S>
);
export const InfinityIcon: React.FC<P> = ({ size = 40, c = color.ink, sw = 2.2 }) => (
  <S size={size}><path d="M12 12c-2-2.6-3.6-3.9-5.4-3.9a3.9 3.9 0 0 0 0 7.8c1.8 0 3.4-1.3 5.4-3.9zm0 0c2 2.6 3.6 3.9 5.4 3.9a3.9 3.9 0 0 0 0-7.8c-1.8 0-3.4 1.3-5.4 3.9z" stroke={c} strokeWidth={sw} /></S>
);

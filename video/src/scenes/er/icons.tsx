import React from 'react';
import { color } from '../../brand/tokens';

// Iconos de trazo (estilo Lucide) para las tarjetas del tutorial.
type P = { size?: number; c?: string; w?: number };
const S: React.FC<P & { children: React.ReactNode }> = ({ size = 48, c = color.ink, w = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
export const IcHeadphones: React.FC<P> = (p) => <S {...p}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" /></S>;
export const IcMic: React.FC<P> = (p) => <S {...p}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" /></S>;
export const IcDownload: React.FC<P> = (p) => <S {...p}><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></S>;
export const IcFile: React.FC<P> = (p) => <S {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h6" /><path d="M8 13h8M8 17h5" /></S>;
export const IcUser: React.FC<P> = (p) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></S>;
export const IcCard: React.FC<P> = (p) => <S {...p}><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></S>;
export const IcPhone: React.FC<P> = (p) => <S {...p}><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></S>;
export const IcSearch: React.FC<P> = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></S>;
export const IcCheck: React.FC<P> = (p) => <S {...p}><path d="M20 6 9 17l-5-5" /></S>;
export const IcCalendar: React.FC<P> = (p) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2.5" /><path d="M16 2v4M8 2v4M3 10h18" /></S>;
export const IcLink: React.FC<P> = (p) => <S {...p}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></S>;
export const IcGlobe: React.FC<P> = (p) => <S {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" /></S>;

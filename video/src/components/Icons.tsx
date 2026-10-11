import React from 'react';
import { color } from '../brand/tokens';

type P = { size?: number; c?: string };
export const PinIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill={color.yellow} stroke={c} strokeWidth="1.6" /><circle cx="12" cy="10" r="2.6" fill={c} /></svg>
);
// `c`: color del círculo; `fg`: color del trazo (por defecto blanco; sobre un círculo blanco, pásale el color del fondo).
export const CheckIcon: React.FC<P & { fg?: string }> = ({ size = 40, c = color.green, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={c} /><path d="M7 12.5l3.2 3.2L17 9" stroke={fg} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const CrossIcon: React.FC<P & { fg?: string }> = ({ size = 40, c = color.red, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={c} /><path d="M8 8l8 8M16 8l-8 8" stroke={fg} strokeWidth="2.4" strokeLinecap="round" /></svg>
);
export const BookIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 6v13.5" stroke={c} strokeWidth="1.8" /></svg>
);
export const HeadphonesIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={c} strokeWidth="1.8" /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={c} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={c} /></svg>
);
export const MusicIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke={c} strokeWidth="1.8" /><circle cx="6.5" cy="18" r="2.6" fill={c} /><circle cx="17.5" cy="16" r="2.6" fill={c} /></svg>
);
export const ArtIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke={c} strokeWidth="1.8" /><circle cx="9" cy="10" r="2" fill={c} /><path d="M3.5 18l5-5 4 4 3-3 5 5" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /></svg>
);
export const SpeakerIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill={c} /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const HeartIcon: React.FC<P> = ({ size = 40, c = color.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3 0 5.4 2.8 4.2 6.2C19.5 15.4 12 20 12 20z" fill={c} /></svg>
);
export const MicIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke={c} strokeWidth="1.8" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
);

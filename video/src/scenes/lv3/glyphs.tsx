import React from 'react';

// Iconos de trazo fino (tinta), para el vídeo de LibriVox
type G = { size: number; c?: string; w?: number };
export const Mic: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></svg>
);
export const House: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5.5h4V20" /></svg>
);
export const Headphones: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><path d="M4 15a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2zM20 15a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2z" /></svg>
);
export const Archive: React.FC<G> = ({ size, c = 'currentColor', w = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 4l9 5.5" /><path d="M4 10h16" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M3.5 18.5h17M3 21h18" /></svg>
);
export const Check: React.FC<G> = ({ size, c = 'currentColor', w = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);
export const Globe: React.FC<G> = ({ size, c = 'currentColor', w = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5s1.3-6.1 3.9-8.5z" /></svg>
);
export const Wave: React.FC<G & { level?: number[] }> = ({ size, c = 'currentColor', w = 2, level }) => {
  const lv = level ?? [0.3, 0.6, 1, 0.5, 0.8, 0.4, 0.7];
  const n = lv.length, gap = 24 / (n + 1);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      {lv.map((v, i) => <path key={i} d={`M${gap * (i + 1)} ${12 - 9 * v}V${12 + 9 * v}`} />)}
    </svg>
  );
};
export const Person: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3" /></svg>
);
export const People: React.FC<G> = ({ size, c = 'currentColor', w = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="8" cy="9" r="3" /><circle cx="16.5" cy="8" r="2.6" /><path d="M2.5 19.5c.9-3 3-4.4 5.5-4.4s4.6 1.4 5.5 4.4M14 14.6c.8-.3 1.6-.4 2.5-.4 2.2 0 4 1.2 4.8 3.8" /></svg>
);
export const Lock: React.FC<G & { open?: number }> = ({ size, c = 'currentColor', w = 1.9, open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d={`M8 11V7.5a4 4 0 0 1 8 0${open > 0.5 ? 'V6' : 'V11'}`} transform={open > 0.5 ? 'translate(4 -1.5) rotate(-8 12 7)' : undefined} /></svg>
);
export const Phone: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w}><rect x="6.5" y="2.8" width="11" height="18.4" rx="2.4" /><path d="M10.5 18h3" strokeLinecap="round" /></svg>
);
export const Clock: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const Books: React.FC<G> = ({ size, c = 'currentColor', w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round"><path d="M4 4.5h4.5v15H4zM8.5 6.5H13v13H8.5z" /><path d="M14.2 7.4l4.3-1.2 3.4 12.6-4.3 1.2z" /></svg>
);
export const Rss: React.FC<G> = ({ size, c = 'currentColor', w = 2.1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M5 4.5a14.5 14.5 0 0 1 14.5 14.5M5 10.5a8.5 8.5 0 0 1 8.5 8.5" /><circle cx="6.2" cy="17.8" r="1.7" fill={c} stroke="none" /></svg>
);
export const Download: React.FC<G> = ({ size, c = 'currentColor', w = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" /></svg>
);
export const Plane: React.FC<G> = ({ size, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M2.5 13.5 21 6l-7.5 18-2.2-7.7z" fill={c} /></svg>
);

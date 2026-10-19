import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { color, font } from '../../brand/tokens';
import { sp } from './fx';

// ————————————————————————————————————————————————————————————————
// La web de SonorBooks dentro del vídeo: capturas reales y públicas de sonorbooks.pl (Playwright, pl-PL, sin aviso de cookies,
// 1440 px de ancho a 2x, 19/10/2026) en una ventana de navegador, con cámara que se acerca a lo que dice la voz.
// sb_lsnienie.jpg (ficha de una candidata descartada, 1440×830), sb_horror.jpg (categoría Horror, 1440×960) y
// sb_rosemary.jpg (ficha de «Dziecko Rosemary» con la opción de compra en Audioteka elegida en su lista de opciones, 1440×830).
// ————————————————————————————————————————————————————————————————

export type Page = { src: string; url: string; h: number };
export const PAGES = {
  lsnienie: { src: 't10/web/sb_lsnienie.jpg', url: 'sonorbooks.pl/audiobook/lsnienie/', h: 830 },
  rosemary: { src: 't10/web/sb_rosemary.jpg', url: 'sonorbooks.pl/audiobook/dziecko-rosemary/', h: 830 },
  horror: { src: 't10/web/sb_horror.jpg', url: 'sonorbooks.pl/kategoria/horror/', h: 960 },
} satisfies Record<string, Page>;

// Vista: el punto (cx, cy) de la página (px CSS de la captura) queda en el centro, con zoom z (1 = la página entera a lo ancho).
export type View = { cx: number; cy: number; z: number };
export type ViewKey = View & { at: number; dur?: number };
export const viewAt = (frame: number, keys: ViewKey[]): View => {
  let k = 0;
  for (let i = 0; i < keys.length; i++) if (frame >= keys[i].at) k = i;
  const cur = keys[k];
  const prev = keys[Math.max(0, k - 1)];
  const p = k === 0 ? 1 : interpolate(frame, [cur.at, cur.at + (cur.dur ?? 22)], [0, 1], { ...clamp, easing: easeInOut });
  const drift = 1 + Math.min(0.04, Math.max(0, frame - cur.at) * 0.0003);
  return { cx: prev.cx + (cur.cx - prev.cx) * p, cy: prev.cy + (cur.cy - prev.cy) * p, z: (prev.z + (cur.z - prev.z) * p) * drift };
};

// Ventana de navegador con una captura dentro. `overlay` se dibuja en coordenadas de la página (se mueve con ella).
export const Browser: React.FC<{
  page: Page; w: number; h: number; view: View; overlay?: React.ReactNode; page2?: Page; mix?: number; style?: React.CSSProperties;
}> = ({ page, w, h, view, overlay, page2, mix = 0, style }) => {
  const bar = 56;
  const vw = w, vh = h - bar;
  const base = vw / 1440;
  const k = base * view.z;
  const ph = (mix > 0.5 && page2 ? page2.h : page.h) * k;
  let tx = vw / 2 - view.cx * k;
  let ty = vh / 2 - view.cy * k;
  tx = Math.min(0, Math.max(vw - 1440 * k, tx));
  ty = Math.min(0, Math.max(vh - ph, ty));
  const url = mix > 0.5 && page2 ? page2.url : page.url;
  return (
    <div style={{ width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)', position: 'relative', ...style }}>
      <div style={{ height: bar, background: '#1b1c20', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px' }}>
        <div style={{ display: 'flex', gap: 9 }}>{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />)}</div>
        <div style={{ flex: 1, height: 34, borderRadius: 10, background: '#2a2b31', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontFamily: font.sans, fontSize: 19, color: 'rgba(255,255,255,0.78)' }}>
          <svg width={15} height={15} viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="rgba(255,255,255,0.7)" strokeWidth={2.2} fill="none" /><rect x="5" y="10" width="14" height="11" rx="2" fill="rgba(255,255,255,0.7)" /></svg>
          {url}
        </div>
      </div>
      <div style={{ position: 'relative', width: vw, height: vh, overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, transformOrigin: '0 0', transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(5)})` }}>
          <Img src={staticFile(page.src)} style={{ width: 1440, height: page.h, display: 'block', opacity: page2 ? 1 - mix : 1 }} />
          {page2 && mix > 0 && <Img src={staticFile(page2.src)} style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: page2.h, display: 'block', opacity: mix }} />}
          {overlay}
        </div>
      </div>
    </div>
  );
};

// Marco amarillo que se dibuja alrededor de algo de la página (coordenadas de la página).
export const Ring: React.FC<{ x: number; y: number; w: number; h: number; at: number; out?: number; r?: number; c?: string }> = ({ x, y, w, h, at, out = 1e9, r = 12, c = color.yellow }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 12, 180);
  const o = 1 - interpolate(frame, [out - 6, out + 6], [0, 1], clamp);
  if (s <= 0.001 || o <= 0) return null;
  const pulse = 0.5 + 0.5 * Math.sin((frame - at) / 7);
  return (
    <div style={{ position: 'absolute', left: x - 10, top: y - 8, width: w + 20, height: h + 16, borderRadius: r, border: `4px solid ${c}`, opacity: Math.min(1, s * 1.5) * o,
      transform: `scale(${(1.25 - 0.25 * s).toFixed(3)})`, boxShadow: `0 0 ${(14 + 14 * pulse).toFixed(0)}px rgba(255,202,5,${(0.35 + 0.25 * pulse).toFixed(3)})` }} />
  );
};

// Cursor que va a un punto (coordenadas de la página) y hace clic.
export const Cursor: React.FC<{ from: [number, number]; to: [number, number]; at: number; click: number }> = ({ from, to, at, click }) => {
  const frame = useCurrentFrame();
  if (frame < at - 4) return null;
  const p = interpolate(frame, [at, click - 4], [0, 1], { ...clamp, easing: easeInOut });
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p + Math.sin(p * Math.PI) * -40;
  const down = interpolate(frame, [click - 2, click, click + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [click, click + 22], [0, 1], { ...clamp, easing: easeOut });
  return (
    <>
      {frame >= click && <div style={{ position: 'absolute', left: to[0] - 60 * ripple, top: to[1] - 60 * ripple, width: 120 * ripple, height: 120 * ripple, borderRadius: '50%', border: `4px solid rgba(255,202,5,${(1 - ripple).toFixed(3)})` }} />}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: 'absolute', left: x - 6, top: y - 3, transform: `scale(${(1 - 0.18 * down).toFixed(3)})`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))' }}>
        <path d="M5 2.5v17l4.6-4.3 3 6.3 3-1.4-3-6.2 6.2-.4z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

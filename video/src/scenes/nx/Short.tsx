import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { ScreenClip, Mark } from '../../components/ScreenClip';
import { CursorPoint } from '../../components/Cursor';
import { Highlight } from '../../components/Highlight';
import { Logo, LogoIcon } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { CheckIcon } from '../../components/Icons';
import { Sfx, STEM } from '../../components/Sfx';
import { VOS, voSrc } from '../../lib/vo';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { NextoryLogo } from './common';
import { wf } from './timeline';
import c10 from '../../../public/nx/rec/10_hook_ficha/cursor.json';
import c11 from '../../../public/nx/rec/11_ficha_click/cursor.json';
import c12 from '../../../public/nx/rec/12_oferta/cursor.json';
import c13 from '../../../public/nx/rec/13_registro/cursor.json';
import c14 from '../../../public/nx/rec/14_plan/cursor.json';
import c15 from '../../../public/nx/rec/15_pago/cursor.json';
import m11 from '../../../public/nx/rec/11_ficha_click/meta.json';
import m12 from '../../../public/nx/rec/12_oferta/meta.json';
import m13 from '../../../public/nx/rec/13_registro/meta.json';
import m14 from '../../../public/nx/rec/14_plan/meta.json';
import m15 from '../../../public/nx/rec/15_pago/meta.json';

// Versión vertical (TikTok, Reels, Shorts) del tutorial: mismas grabaciones y locución, encuadre vertical y subtítulos.
const FPS = 50;
const LEAD = 6;
const sp = (id: string) => Math.ceil(((VOS[id] as { speechEnd?: number } | undefined)?.speechEnd ?? VOS[id]?.duration ?? 3) * FPS);
// [id, inicio en la locución (s), fotogramas extra al final]
type Piece = { id: string; from: number; dur: number; at: number };
const N09_FROM = 5.84; // del cierre solo se usa «Tu próxima historia te está esperando.»
const PIECES: Piece[] = (() => {
  const list: [string, number, number][] = [['N01', 0, 10], ['N02', 0, 10], ['N03', 0, 10], ['N04', 0, 10], ['N05', 0, 10], ['N06', 0, 10], ['N07', 0, 10], ['N08', 0, 10], ['N09', N09_FROM, 95]];
  let at = 0;
  return list.map(([id, from, extra]) => {
    const dur = LEAD + sp(id) - Math.round(from * FPS) + extra;
    const p = { id, from, dur, at };
    at += dur;
    return p;
  });
})();
export const SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
const startOf = (id: string) => PIECES.find((p) => p.id === id)!.at;

// ——— Subtítulos palabra a palabra (grupos cortos) ———
type CW = { w: string; s: number; e: number };
const captionWords = (): CW[] => PIECES.flatMap((p) => (VOS[p.id]?.words ?? [])
  .filter((w) => w.s >= p.from - 0.01)
  .map((w) => ({ w: w.w.replace(/[«»]/g, ''), s: (p.at + LEAD) / FPS + w.s - p.from, e: (p.at + LEAD) / FPS + w.e - p.from })));
const groups = (() => {
  const out: CW[][] = [];
  let cur: CW[] = [];
  for (const w of captionWords()) {
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = groups.find((c) => t >= c[0].s - 0.05 && t <= c[c.length - 1].e + 0.2);
  if (!g) return null;
  const pop = spring({ frame: frame - Math.round(g[0].s * FPS), fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1430 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 18px', maxWidth: 960, transform: `scale(${0.92 + 0.08 * pop})` }}>
        {g.map((w, i) => {
          const active = t >= w.s - 0.03 && t <= w.e + 0.05;
          return <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 76, lineHeight: 1.15, padding: '2px 16px', borderRadius: 16, color: color.ink, background: active ? color.yellow : 'rgba(255,255,255,0.95)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>{w.w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ——— Encuadre vertical de una grabación 1920×1080 ———
const VW = 1000, VH = 1080, VTOP = 250, BAR = 56;
type PKey = { f: number; cx: number; cy: number; s: number };
const PortraitClip: React.FC<{ src: string; startAt?: number; cursor: CursorPoint[]; keys: PKey[]; marks?: Mark[]; overlay?: (t: number) => React.ReactNode; cursorOpacity?: number }> = ({ src, startAt = 0, cursor, keys, marks = [], overlay, cursorOpacity = 1 }) => {
  const frame = useCurrentFrame();
  const s = keyframes(frame, keys, 's');
  const cx = keyframes(frame, keys, 'cx');
  const cy = keyframes(frame, keys, 'cy');
  const W = 1920 * s, H = 1080 * s;
  const tx = Math.min(0, Math.max(VW - W, VW / 2 - cx * s));
  const ty = Math.min(0, Math.max(VH - BAR - H, (VH - BAR) / 2 - cy * s));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH - BAR, overflow: 'hidden', background: '#fff' }}>
      <div style={{ position: 'absolute', left: tx, top: ty }}>
        <ScreenClip src={src} width={W} startAt={startAt} cursor={cursor} marks={marks} overlay={overlay} cursorOpacity={cursorOpacity} />
      </div>
    </div>
  );
};
const VFrame: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 22, stiffness: 130 } });
  return (
    <div style={{ position: 'absolute', left: 40, top: VTOP, width: VW, height: VH, borderRadius: 34, overflow: 'hidden', background: '#F6F6F7', boxShadow: '0 50px 110px rgba(16,16,16,0.22), 0 0 0 1px rgba(16,16,16,0.06)', opacity: s, transform: `scale(${0.96 + 0.04 * s})` }}>
      <div style={{ height: BAR, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 12, position: 'relative' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: '50%', background: c }} />)}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: 34, padding: '0 26px', borderRadius: 10, background: '#E9E9EB', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font.sans, fontSize: 22, color: color.ink2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10H7zm2 0h6V7a3 3 0 0 0-6 0v3z" fill="currentColor" /></svg>{url}
        </div>
      </div>
      <div style={{ position: 'relative', width: VW, height: VH - BAR }}>{children}</div>
    </div>
  );
};

// ——— Cabecera de paso ———
const STEPS = ['SonorBooks', 'Oferta', 'Cuenta', 'Plan', 'Pago', '¡Listo!'];
const StepHeader: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 16, stiffness: 170 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 96 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: s, transform: `translateY(${(1 - s) * -30}px)` }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, background: color.yellow, borderRadius: 999, padding: '8px 28px' }}>{n <= 5 ? `Paso ${n}` : '¡Listo!'}</div>
        {n <= 5 && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>{STEPS[n - 1]}</div>}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 22, opacity: s }}>
        {STEPS.map((_, i) => <div key={i} style={{ width: i === n - 1 ? 44 : 14, height: 14, borderRadius: 7, background: i < n ? (i === n - 1 ? color.yellow : color.ink) : '#DADADA' }} />)}
      </div>
    </AbsoluteFill>
  );
};

const rfs = (t: number) => Math.round(t * FPS);
const LockI: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: '-0.12em', marginRight: 14 }}><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill={color.ink} /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" stroke={color.ink} strokeWidth="2.2" fill="none" /></svg>
);
const WarnI: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: '-0.1em', marginRight: 14 }}><path d="M12 3.5L22 20.5H2z" fill={color.red} stroke={color.red} strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 9.5v5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /><circle cx="12" cy="17.6" r="1.4" fill="#fff" /></svg>
);
const TickI: React.FC<{ size: number; c?: string }> = ({ size, c = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
type SceneP = { lead: number; dur: number };

const S01: React.FC<SceneP> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string) => lead + wf('N01', w);
  const fNext = at('Nextory'), fAsi = at('Asi'), f30 = at('30'), fGr = at('gratis'), f14 = at('14');
  const a = interpolate(frame, [fAsi - 6, fAsi + 6], [1, 0], clamp);
  const c30 = spring({ frame: frame - Math.max(fAsi + 6, f30 - 12), fps: FPS, config: { damping: 13, stiffness: 170 } });
  const c14 = spring({ frame: frame - (f14 - 5), fps: FPS, config: { damping: 15, stiffness: 170 } });
  const strike = interpolate(frame, [f14 + 6, f14 + 15], [0, 1], { ...clamp, easing: easeOut });
  const logo = spring({ frame: frame - fAsi, fps: FPS, config: { damping: 15 } });
  return (
    <Stage tone="warm">
      {a > 0 && (
        <div style={{ opacity: a }}>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink, textAlign: 'center', lineHeight: 1.1 }}>¿Te recomendamos<br />Nextory?</div>
          </AbsoluteFill>
          <VFrame url="sonorbooks.com">
            <PortraitClip src="nx/rec/10_hook_ficha/video.mp4" cursor={c10 as CursorPoint[]}
              keys={[{ f: 0, cx: 1100, cy: 560, s: 1.05 }, { f: fNext + 10, cx: 1275, cy: 612, s: 1.5 }, { f: dur, cx: 1275, cy: 612, s: 1.55 }]}
              marks={[{ from: fNext - 6, to: fAsi + 10, x: 951, y: 463, w: 648, h: 307, r: 22 }]} />
          </VFrame>
        </div>
      )}
      {frame >= fAsi - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60, paddingBottom: 380 }}>
          <div style={{ opacity: logo, transform: `scale(${0.85 + 0.15 * logo})` }}><NextoryLogo width={380} /></div>
          <div style={{ opacity: c14, transform: `scale(${0.9 + 0.1 * c14})`, background: '#fff', borderRadius: 30, border: `1px solid ${color.line}`, boxShadow: shadow.card, padding: '26px 44px', display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.muted }}>Prueba normal</span>
            <span style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 72, color: color.ink2 }}>14 días
              <span style={{ position: 'absolute', left: -6, right: -6, top: '52%', height: 8, borderRadius: 4, background: color.red, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-4deg)` }} />
            </span>
          </div>
          <div style={{ opacity: c30, transform: `translateY(${(1 - c30) * 50}px) scale(${0.86 + 0.14 * c30})`, background: color.yellowSoft, border: `5px solid ${color.yellow}`, borderRadius: 40, padding: '44px 70px', textAlign: 'center', boxShadow: '0 40px 90px rgba(255,202,5,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}><LogoIcon size={44} /> Con SonorBooks</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 170, letterSpacing: -5, lineHeight: 1 }}>30 días</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84 }}><Highlight start={fGr} dur={12}>gratis</Highlight></div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="zoom_in" at={fNext - 20} volume={0.8} />
      <Sfx name="draw" at={fNext - 6} />
      <Sfx name="whoosh_soft" at={fAsi} />
      <Sfx name="snap_in" at={Math.max(fAsi + 6, f30 - 12)} />
      <Sfx name="marker" at={fGr} />
      <Sfx name="pencil_strike" at={f14 + 6} />
    </Stage>
  );
};

const S02: React.FC<SceneP> = ({ lead, dur }) => {
  const fP = lead + wf('N02', 'pulsa');
  return (
    <Stage>
      <StepHeader n={1} />
      <VFrame url="sonorbooks.com">
        <PortraitClip src="nx/rec/11_ficha_click/video.mp4" cursor={c11 as CursorPoint[]}
          keys={[{ f: 0, cx: 1060, cy: 470, s: 1.0 }, { f: fP - 4, cx: 1150, cy: 520, s: 1.05 }, { f: fP + 20, cx: 1275, cy: 630, s: 1.55 }, { f: dur, cx: 1275, cy: 636, s: 1.6 }]}
          marks={[{ from: fP + 6, to: dur + 6, x: 973, y: 624, w: 604, h: 47, r: 24 }]} />
      </VFrame>
      <Sfx name="zoom_in" at={fP + 2} /><Sfx name="draw" at={fP + 6} /><Sfx name="click" at={rfs(m11.marks.click)} />
    </Stage>
  );
};

const S03: React.FC<SceneP> = () => {
  const M = m12.marks as Record<string, number>;
  return (
    <Stage>
      <StepHeader n={2} />
      <VFrame url="nextory.com">
        <PortraitClip src="nx/rec/12_oferta/video.mp4" cursor={c12 as CursorPoint[]}
          keys={[{ f: 0, cx: 960, cy: 545, s: 1.08 }, { f: rfs(M.click_cookie) + 6, cx: 960, cy: 545, s: 1.08 }, { f: rfs(M.click_cookie) + 30, cx: 470, cy: 430, s: 1.2 }, { f: rfs(M.to_cta) + 30, cx: 470, cy: 440, s: 1.3 }, { f: rfs(M.click_cta) + 16, cx: 470, cy: 440, s: 1.3 }, { f: rfs(M.click_cta) + 46, cx: 960, cy: 330, s: 1.15 }]}
          marks={[{ from: rfs(M.to_cookie) + 4, to: rfs(M.click_cookie) + 12, x: 533, y: 662, w: 280, h: 58, r: 8, label: 'Solo las necesarias', labelBelow: true },
            { from: rfs(M.to_cta) + 20, to: rfs(M.click_cta) + 16, x: 72, y: 528, w: 142, h: 52, r: 26 }]} />
      </VFrame>
      <Sfx name="click" at={rfs(M.click_cookie)} /><Sfx name="draw" at={rfs(M.to_cta) + 20} /><Sfx name="click" at={rfs(M.click_cta)} />
    </Stage>
  );
};

const S04: React.FC<SceneP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const M = m13.marks as Record<string, number>;
  const cardIn = lead + wf('N04', 'crea') - 6;
  const s = spring({ frame: frame - cardIn, fps: FPS, config: { damping: 19, stiffness: 150 } });
  const dim = interpolate(frame, [cardIn - 4, cardIn + 10], [0, 1], { ...clamp, easing: easeInOut });
  const n = Math.max(0, Math.min(10, Math.floor((frame - cardIn - 14) / 4)));
  const done = cardIn + 14 + 50;
  return (
    <Stage>
      <StepHeader n={3} />
      <VFrame url="nextory.com">
        <PortraitClip src="nx/rec/13_registro/video.mp4" cursor={c13 as CursorPoint[]} cursorOpacity={1 - dim}
          keys={[{ f: 0, cx: 960, cy: 330, s: 2.05 }]}
          marks={[{ from: rfs(M.type) + 2, to: rfs(M.to_cont) - 2, x: 753, y: 236, w: 414, h: 48, r: 8, label: 'Tu correo' }, { from: rfs(M.to_cont), to: cardIn + 4, x: 753, y: 358, w: 414, h: 52, r: 26 }]} />
        <AbsoluteFill style={{ background: `rgba(16,16,16,${0.38 * dim})` }} />
        {frame >= cardIn - 2 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 860, background: '#fff', borderRadius: 32, boxShadow: shadow.float, padding: '44px 46px', opacity: s, transform: `translateY(${(1 - s) * 70}px)` }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, marginBottom: 26 }}><LockI size={50} />Crea tu contraseña</div>
              <div style={{ height: 90, borderRadius: 18, border: `2px solid ${frame < done ? color.ink : '#E2E2E2'}`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: 8 }}>
                <div style={{ flex: 1 }}>{'•'.repeat(n)}</div>
                {frame >= done && <CheckIcon size={46} />}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </VFrame>
      <Sfx name="typing" at={rfs(M.type)} trimAfter={58} /><Sfx name="click" at={rfs(M.click_cont)} /><Sfx name="swipe" at={cardIn} /><Sfx name="success" at={done} volume={0.8} />
    </Stage>
  );
};

const S05: React.FC<SceneP> = ({ lead, dur }) => {
  const M = m14.marks as Record<string, number>;
  const swap = rfs(M.planform);
  const fSolo = lead + wf('N05', 'solo');
  const f30 = lead + wf('N05', '30');
  return (
    <Stage>
      <StepHeader n={4} />
      <VFrame url="nextory.com">
        <PortraitClip src="nx/rec/14_plan/video.mp4" cursor={c14 as CursorPoint[]}
          keys={[{ f: 0, cx: 960, cy: 250, s: 2.05 }, { f: swap - 2, cx: 960, cy: 250, s: 2.05 }, { f: swap + 12, cx: 960, cy: 470, s: 1.75 }, { f: dur, cx: 960, cy: 480, s: 1.75 }]}
          marks={[{ from: f30 - 4, to: rfs(M.to_cont1) - 2, x: 750, y: 164, w: 420, h: 56, r: 12 }, { from: rfs(M.to_cont1), to: swap - 2, x: 904, y: 272, w: 113, h: 52, r: 18 },
            { from: rfs(M.to_std) + 4, to: fSolo - 2, x: 756, y: 356, w: 408, h: 100, r: 14 }, { from: fSolo, to: rfs(M.to_cont2) - 2, x: 806, y: 708, w: 308, h: 32, r: 10 },
            { from: rfs(M.to_cont2), to: dur + 6, x: 904, y: 649, w: 113, h: 52, r: 18 }]} />
      </VFrame>
      <Sfx name="click" at={rfs(M.click_cont1)} /><Sfx name="whoosh_soft" at={swap} volume={0.8} /><Sfx name="click" at={rfs(M.click_std)} /><Sfx name="click" at={rfs(M.click_cont2)} />
    </Stage>
  );
};

const S06: React.FC<SceneP> = ({ lead, dur }) => {
  const M = m15.marks as Record<string, number>;
  const START = 0.18;
  const r = (t: number) => Math.round((t - START) * FPS);
  const swap = r(M.confirma);
  const fFij = lead + wf('N06', 'fijate');
  const f0 = M.fill + 0.04;
  const dots = (t: number, t0: number, t1: number, pat: string) => { const tot = pat.split('').filter((c) => c === '•').length; const n = Math.max(0, Math.min(tot, Math.floor(((t - t0) / (t1 - t0)) * tot))); let k = 0; return t < t0 - 0.05 ? '' : pat.split('').map((c) => (c === '•' ? (k++ < n ? '•' : ' ') : (k > 0 && k <= n ? c : ' '))).join(''); };
  const field = (t: number, t0: number, t1: number, x: number, y: number, w: number, pat: string) => (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: 40, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: font.sans, fontWeight: 700, fontSize: 17, letterSpacing: 2.5, whiteSpace: 'pre' }}>{dots(t, t0, t1, pat)}</div>
  );
  return (
    <Stage>
      <StepHeader n={5} />
      <VFrame url="nextory.com">
        <PortraitClip src="nx/rec/15_pago/video.mp4" startAt={START} cursor={c15 as CursorPoint[]}
          keys={[{ f: 0, cx: 960, cy: 235, s: 2.05 }, { f: swap - 2, cx: 960, cy: 235, s: 2.05 }, { f: swap + 12, cx: 1175, cy: 420, s: 1.55 }, { f: r(M.expand) + 14, cx: 1175, cy: 560, s: 1.9 }, { f: dur, cx: 1175, cy: 590, s: 1.9 }]}
          marks={[{ from: fFij - 4, to: r(M.to_cont) - 2, x: 748, y: 163, w: 290, h: 34, r: 10, label: 'Hoy pagas 0 €', labelBelow: true }, { from: r(M.to_cont), to: swap - 2, x: 904, y: 248, w: 113, h: 52, r: 18 },
            { from: r(M.fill), to: r(M.to_pay) - 2, x: 976, y: 426, w: 398, h: 276, r: 12 }, { from: r(M.to_pay), to: dur + 6, x: 984, y: 711, w: 382, h: 48, r: 24 }]}
          overlay={(t) => (t >= M.expand ? (<>
            {field(t, f0, f0 + 0.62, 985, 442, 344, '•••• •••• •••• ••••')}
            {field(t, f0 + 0.66, f0 + 0.9, 985, 544, 181, '•• / ••')}
            {field(t, f0 + 0.92, f0 + 1.08, 1184, 544, 181, '•••')}
            {field(t, f0 + 1.1, f0 + 1.38, 985, 654, 380, '••••• •••••••')}
          </>) : null)} />
      </VFrame>
      <Sfx name="click" at={r(M.click_cont)} /><Sfx name="whoosh_soft" at={swap} volume={0.8} /><Sfx name="click" at={r(M.click_card)} /><Sfx name="typing" at={r(f0)} trimAfter={70} /><Sfx name="click" at={r(M.click_pay)} /><Sfx name="success" at={r(M.click_pay) + 12} volume={0.7} />
    </Stage>
  );
};

const S07: React.FC<SceneP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const fDesc = lead + wf('N07', 'Descarga');
  const fEntra = lead + wf('N07', 'entra');
  const fEsc = lead + wf('N07', 'escuchar');
  const b = spring({ frame: frame - 2, fps: FPS, config: { damping: 10, stiffness: 190 } });
  const chips = spring({ frame: frame - fDesc, fps: FPS, config: { damping: 15, stiffness: 170 } });
  const step = frame >= fEsc ? 2 : frame >= fEntra ? 1 : 0;
  const labels = ['Descarga la app', 'Entra con tu correo', '¡A escuchar!'];
  return (
    <Stage tone="warm">
      <StepHeader n={6} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330, gap: 40 }}>
        <div style={{ width: 230, height: 230, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${b})`, boxShadow: '0 30px 70px rgba(255,202,5,0.45)' }}>
          <svg width="120" height="120" viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8" stroke={color.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: -2, opacity: b }}>¡Prueba activada!</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, opacity: chips, transform: `translateY(${(1 - chips) * 30}px)` }}>
          {labels.map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 40px', borderRadius: 26, background: i <= step ? '#fff' : 'rgba(255,255,255,0.5)', boxShadow: i === step ? shadow.card : 'none', border: `3px solid ${i === step ? color.yellow : color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: i <= step ? color.ink : color.muted }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: i < step ? color.ink : i === step ? color.yellow : '#E6E6E6', color: i < step ? '#fff' : color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{i < step ? <TickI size={34} /> : i + 1}</div>
              {l}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx name="success" at={4} /><Sfx name="ui_pop" at={fDesc} /><Sfx name="ui_pop" at={fEntra} /><Sfx name="sparkle" at={fEsc} volume={0.7} />
    </Stage>
  );
};

const S08: React.FC<SceneP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const fMis = lead + wf('N08', 'Mis');
  const fOjo = lead + wf('N08', 'Ojo');
  const ch = (f: number) => spring({ frame: frame - f, fps: FPS, config: { damping: 15, stiffness: 180 } });
  const warn = ch(fOjo - 2);
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110, gap: 44 }}>
        <Pill size={42}>Consejo</Pill>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 78, letterSpacing: -2, opacity: ch(4) }}>¿No quieres seguir?</div>
        {['Mis páginas', 'Suscripción y pago', 'Cancelar'].map((l, i) => (
          <div key={l} style={{ opacity: ch(fMis - 4 + i * 12), transform: `translateY(${(1 - ch(fMis - 4 + i * 12)) * 40}px)`, padding: '26px 54px', borderRadius: 28, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: i === 2 ? color.red : color.ink }}>{i > 0 ? '↓ ' : ''}{l}</div>
        ))}
      </AbsoluteFill>
      {frame >= fOjo - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 1060 }}>
          <div style={{ width: 920, background: '#fff', borderRadius: 34, border: `4px solid ${color.red}`, padding: '36px 44px', boxShadow: shadow.card, opacity: warn, transform: `scale(${0.9 + 0.1 * warn})` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, lineHeight: 1.1 }}><WarnI size={54} />Al cancelar, pierdes el acceso al momento</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2, marginTop: 12 }}>Hazlo en los últimos días de la prueba.</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fMis} /><Sfx name="ui_pop" at={fMis + 12} /><Sfx name="ui_pop" at={fMis + 24} /><Sfx name="hit_soft" at={fOjo} />
    </Stage>
  );
};

const S09: React.FC<SceneP> = () => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - 30, fps: FPS, config: { damping: 12 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50, paddingBottom: 380 }}>
        <Logo size={128} delay={2} />
        <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}><Pill size={54}>sonorbooks.com</Pill></div>
        <div style={{ fontFamily: font.sans, fontSize: 24, color: color.muted, maxWidth: 820, textAlign: 'center', opacity: spring({ frame: frame - 50, fps: FPS }) }}>Enlace de afiliado: si contratas, SonorBooks puede recibir una comisión, sin coste para ti.</div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} /><Sfx name="sparkle" at={30} volume={0.7} />
    </Stage>
  );
};

const COMPONENTS: Record<string, React.FC<SceneP>> = { N01: S01, N02: S02, N03: S03, N04: S04, N05: S05, N06: S06, N07: S07, N08: S08, N09: S09 };

export const NextoryShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [SHORT_TOTAL - fps, SHORT_TOTAL], [1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {PIECES.map((p) => {
        const C = COMPONENTS[p.id];
        return (
          <Sequence key={p.id} from={p.at} durationInFrames={p.dur} name={p.id}>
            <Fade>{<C lead={LEAD} dur={p.dur} />}</Fade>
            {(!STEM || STEM === 'vo') && (
              <Sequence from={LEAD} layout="none"><Audio src={voSrc(p.id)} trimBefore={Math.round(p.from * fps)} /></Sequence>
            )}
          </Sequence>
        );
      })}
      <Captions />
      {PIECES.slice(1).map((p) => <Sfx key={p.id} name="transition" at={startOf(p.id)} volume={0.55} />)}
      {(!STEM || STEM === 'music') && <Audio src={staticFile('music/nx_bed.mp3')} volume={music} />}
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

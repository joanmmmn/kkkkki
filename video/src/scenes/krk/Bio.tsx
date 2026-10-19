import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, color, font, Grain, HANDF, KR, KR_DEEP, NEVA, OCHRE, ramp, rampOut, shadow, SkNight, SkStage, WAX } from './kit';
import { Handwrite, PaperBG } from './Hook';
import { sceneClock } from './timeline';
import geo from './geo_dk.json';

// ————————————————————————————————————————————————————————————————
// 01 · Quién era (J07–J13). Mapa propio de Dinamarca y alrededores (Natural Earth, proyección cónica, sin fronteras),
// el páramo de Jutlandia ilustrado, las velas de la familia, el diario de 1835, la explosión de 1843, El Corsario,
// los 34 años y el final en 1855. Datos verificados en research/autores/kierkegaard/guion.md.
// ————————————————————————————————————————————————————————————————

type P2 = [number, number];
const DK = geo as unknown as { land: string; grat: string; pts: Record<string, P2> };
const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

type MapCam = { f: number; s: number; cx: number; cy: number; tx: number; ty: number };
const useMapCam = (keys: MapCam[]) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys as unknown as { f: number; [k: string]: number }[], p, easeInOut);
  const s = k('s'), cx = k('cx'), cy = k('cy'), tx = k('tx'), ty = k('ty');
  const toScreen = (p: P2): P2 => [tx + s * (p[0] - cx), ty + s * (p[1] - cy)];
  return { s, toScreen, transform: `translate(${tx}px, ${ty}px) scale(${s}) translate(${-cx}px, ${-cy}px)` };
};

export const DkMap: React.FC<{ transform: string; dark?: boolean; children?: React.ReactNode }> = ({ transform, dark = false, children }) => (
  <AbsoluteFill style={{ transformOrigin: '0 0', transform }}>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <defs>
        <filter id="dk-sh" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
        <pattern id="dk-sea" width="26" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 Q6.5 3 13 7 T26 7" fill="none" stroke={dark ? 'rgba(160,190,220,0.10)' : 'rgba(47,111,98,0.10)'} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect x={-1200} y={-1200} width={4320} height={3480} fill="url(#dk-sea)" />
      <path d={DK.grat} fill="none" stroke={dark ? 'rgba(160,190,220,0.10)' : 'rgba(47,111,98,0.14)'} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <path d={DK.land} fill={dark ? 'rgba(0,0,0,0.5)' : 'rgba(60,40,10,0.16)'} filter="url(#dk-sh)" transform="translate(3 6)" />
      <path d={DK.land} fill={dark ? '#3B4757' : '#E8DFCB'} stroke={dark ? 'rgba(200,220,240,0.35)' : 'rgba(120,90,40,0.45)'} strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
      {children}
    </svg>
  </AbsoluteFill>
);

// Alfiler que cae y etiqueta de lugar (fuera de la capa escalada).
export const CityPin: React.FC<{ p: P2; at: number; label: string; sub?: string; dark?: boolean; side?: 'left' | 'right'; c?: string; out?: number }> = ({ p, at, label, sub, dark = false, side = 'right', c = KR, out }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 11, 200);
  const card = rampOut(frame, at + 6, at + 20);
  const o = out !== undefined ? ramp(frame, out - 10, out) : 0;
  if (frame < at - 1 || o >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: p[0], top: p[1], opacity: 1 - o }}>
      <div style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: dark ? '#fff' : color.ink, transform: `scale(${s})`, boxShadow: `0 0 0 6px ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(16,16,16,0.12)'}` }} />
      <svg width="58" height="72" viewBox="0 0 24 30" style={{ position: 'absolute', left: -29, top: -70, transform: `translateY(${(1 - s) * -70}px)`, opacity: Math.min(1, s * 3) }}>
        <path d="M12 29s9-8.4 9-16a9 9 0 1 0-18 0c0 7.6 9 16 9 16z" fill={c} stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="13" r="3.4" fill="#fff" />
      </svg>
      <div style={{ position: 'absolute', ...(side === 'right' ? { left: 40 } : { right: 40 }), top: -78, opacity: card, transform: `translateX(${(1 - card) * (side === 'right' ? -16 : 16)}px)` }}>
        <div style={{ background: dark ? 'rgba(255,255,255,0.96)' : color.ink, color: dark ? color.ink : '#fff', borderRadius: 20, padding: '12px 24px 14px', boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: -0.5 }}>{label}</div>
          {sub && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: dark ? KR : color.yellow }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// Tarjeta a la derecha con rótulo, título y contenido.
export const SideCard: React.FC<{ at: number; out?: number; kicker: string; title: string; size?: number; children?: React.ReactNode; top?: number; left?: number; width?: number; dark?: boolean }> = ({
  at, out, kicker, title, size = 64, children, top = 190, left = 1150, width = 660, dark = false,
}) => {
  const frame = useCurrentFrame();
  const p = rampOut(frame, at, at + 14);
  const o = out !== undefined ? ramp(frame, out - 10, out) : 0;
  if (p <= 0.001 || o >= 0.999) return null;
  return (
    <div style={{ position: 'absolute', left, top, width, padding: '42px 46px 48px', background: dark ? 'rgba(18,20,24,0.88)' : '#fff', borderRadius: 32, boxShadow: shadow.card,
      border: dark ? '1px solid rgba(255,255,255,0.12)' : undefined, opacity: p * (1 - o), transform: `translateY(${(1 - p) * 30 - o * 20}px)`, filter: o > 0.01 ? `blur(${o * 8}px)` : undefined }}>
      <Kicker at={at} text={kicker} style={dark ? { color: 'rgba(255,255,255,0.6)' } : undefined} />
      <MaskTitle text={title} at={at + 4} size={size} color={dark ? '#fff' : color.ink} />
      {children}
    </div>
  );
};

// Silueta infantil (los siete hermanos).
const Kid: React.FC<{ h: number; c: string }> = ({ h, c }) => (
  <svg width={h * 0.5} height={h} viewBox="0 0 50 100" style={{ display: 'block' }}>
    <circle cx="25" cy="16" r="11" fill={c} />
    <path d="M12 32 Q25 24 38 32 L42 66 L36 66 L35 100 L27 100 L25 70 L23 100 L15 100 L14 66 L8 66Z" fill={c} />
  </svg>
);

// ——— El páramo de Jutlandia (ilustración por capas) ———
// Atardecer de tormenta sobre un brezal, colinas bajas, ovejas y un niño pastor en un montículo.
// `fist`: 0 → brazo bajo, 1 → puño alzado. `flash`: relámpago.
export const Heath: React.FC<{ t: number; fist: number; flash: number; dark?: number }> = ({ t, fist, flash, dark = 0 }) => {
  const sheep = [[420, 830, 1], [520, 860, 0.9], [610, 845, 1.05], [300, 880, 0.85], [1500, 905, 0.9], [1610, 880, 1]];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1C2230" />
            <stop offset="0.45" stopColor="#4A4F63" />
            <stop offset="0.72" stopColor="#B08A7E" />
            <stop offset="0.8" stopColor="#D8B38E" />
          </linearGradient>
          <linearGradient id="hs-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4B3A44" />
            <stop offset="1" stopColor="#1E1719" />
          </linearGradient>
          <filter id="hs-blur"><feGaussianBlur stdDeviation="18" /></filter>
          <pattern id="hs-heather" width="22" height="18" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="5" r="2.4" fill="rgba(140,80,120,0.35)" />
            <circle cx="15" cy="12" r="2" fill="rgba(90,110,70,0.3)" />
            <circle cx="10" cy="15" r="1.6" fill="rgba(170,100,140,0.25)" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#hs-sky)" />
        {/* nubes de tormenta que avanzan */}
        <g filter="url(#hs-blur)" opacity={0.85}>
          {[[200, 180, 420, 90], [760, 120, 520, 110], [1400, 210, 480, 100], [1050, 330, 600, 80], [380, 380, 520, 70]].map(([x, y, w, h], i) => (
            <ellipse key={i} cx={x + t * (0.6 + i * 0.15)} cy={y} rx={w} ry={h} fill={i % 2 ? '#262B38' : '#30364A'} />
          ))}
        </g>
        {/* colinas lejanas */}
        <path d="M0 720 Q240 640 520 690 T1100 660 T1920 690 V1080 H0Z" fill="#3A3442" />
        <path d="M0 780 Q300 720 700 760 T1400 740 T1920 770 V1080 H0Z" fill="#43363E" />
        {/* brezal */}
        <path d="M0 820 Q480 780 960 810 T1920 800 V1080 H0Z" fill="url(#hs-ground)" />
        <path d="M0 820 Q480 780 960 810 T1920 800 V1080 H0Z" fill="url(#hs-heather)" />
        {/* el montículo del niño */}
        <path d="M960 840 Q1160 670 1340 650 Q1520 660 1780 840Z" fill="#2A2026" />
        <path d="M960 840 Q1160 670 1340 650 Q1520 660 1780 840Z" fill="url(#hs-heather)" />
        {/* ovejas */}
        {sheep.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x + Math.sin(t / 40 + i) * 3} ${y}) scale(${s})`}>
            <ellipse cx="0" cy="0" rx="34" ry="20" fill="#D9D3C8" />
            <ellipse cx="30" cy="-8" rx="11" ry="9" fill="#2A2426" />
            {[-18, -6, 8, 20].map((lx) => <rect key={lx} x={lx} y="14" width="5" height="18" fill="#2A2426" />)}
          </g>
        ))}
        {/* el niño pastor, con su cayado */}
        <g transform="translate(1340 650) scale(1.9) translate(0 0)">
          <path d="M-14 -2 L-12 -66 Q0 -76 12 -66 L14 -2Z" fill="#141015" />
          <circle cx="0" cy="-86" r="13" fill="#141015" />
          <path d="M-13 -92 Q0 -108 13 -92 L15 -86 L-15 -86Z" fill="#141015" />
          <path d="M-6 -2 L-8 30 M6 -2 L8 30" stroke="#141015" strokeWidth="9" strokeLinecap="round" />
          {/* brazo izquierdo con el cayado */}
          <path d="M-10 -58 L-30 -20" stroke="#141015" strokeWidth="8" strokeLinecap="round" />
          <path d="M-34 32 L-30 -60 Q-30 -76 -42 -74" stroke="#141015" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* brazo derecho: baja → puño alzado */}
          <g transform={`rotate(${-150 * fist} 10 -60)`}>
            <path d="M10 -60 L22 -22" stroke="#141015" strokeWidth="8" strokeLinecap="round" />
            <circle cx="23" cy="-20" r="6.5" fill="#141015" />
          </g>
        </g>
        {/* relámpago */}
        {flash > 0.01 && (
          <path d="M1520 40 L1480 190 L1530 200 L1450 380 L1500 390 L1420 560" stroke={`rgba(255,250,235,${flash})`} strokeWidth="6" fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.9))' }} />
        )}
      </svg>
      <AbsoluteFill style={{ background: `rgba(230,236,255,${0.55 * flash})`, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ background: `rgba(5,6,10,${dark})` }} />
    </AbsoluteFill>
  );
};

// ——— CPH · J07 ———
// Copenhague (1813), el último de siete hermanos → su padre, comerciante muy rico → de niño, pastor en los páramos
// de Jutlandia → allí, hambriento y agotado, maldijo a Dios (relámpago).
export const Cph: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CPH');
  const f = {
    cph: c.at('J07', 'Copenhague'), year: c.at('J07', 'mil'), ult: c.at('J07', 'último'), siete: c.at('J07', 'siete'), padre: c.at('J07', 'padre'),
    rico: c.at('J07', 'rico'), nino: c.at('J07', 'niño'), pastor: c.at('J07', 'pastor'), paramos: c.at('J07', 'páramos'), jut: c.at('J07', 'Jutlandia'),
    hamb: c.at('J07', 'hambriento'), mald: c.at('J07', 'maldijo'), dios: c.at('J07', 'Dios'),
  };
  const C = DK.pts.copenhague, S = DK.pts.saeding;
  const cam = useMapCam([
    { f: 0, s: 1, cx: 960, cy: 560, tx: 960, ty: 540 },
    { f: f.cph + 16, s: 1.9, cx: C[0], cy: C[1], tx: 600, ty: 620 },
    { f: f.nino - 6, s: 1.95, cx: C[0], cy: C[1], tx: 596, ty: 620 },
    { f: f.paramos + 6, s: 1.75, cx: S[0], cy: S[1], tx: 760, ty: 600 },
    { f: c.dur, s: 1.8, cx: S[0], cy: S[1], tx: 760, ty: 600 },
  ]);
  // Del mapa al páramo ilustrado
  const toHeath = ramp(frame, f.jut + 4, f.jut + 26);
  const fist = ramp(frame, f.mald - 4, f.mald + 10, easeOut);
  const flash = interpolate(frame, [f.dios - 2, f.dios, f.dios + 3, f.dios + 6, f.dios + 10, f.dios + 24], [0, 1, 0.2, 0.85, 0.1, 0], clamp);
  const shake = flash * 8;
  const heathZoom = 1.04 + 0.08 * ramp(frame, f.jut, c.dur, (t) => t);
  return (
    <AbsoluteFill>
      {toHeath < 1 && (
        <AbsoluteFill style={{ opacity: 1 - toHeath }}>
          <SkStage>
            <DkMap transform={cam.transform} />
            <CityPin p={cam.toScreen(C)} at={f.cph} label="Copenhague" sub={frame >= f.year - 2 ? '1813' : ' '} out={f.paramos} />
            <CityPin p={cam.toScreen(S)} at={f.paramos - 4} label="Jutlandia" sub="los páramos" c={OCHRE} side="left" />
            {/* los siete hermanos */}
            <SideCard at={f.ult - 6} out={f.padre - 2} kicker="Copenhague, 1813" title="Siete hermanos" size={60} top={240}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 34, height: 170 }}>
                {[150, 140, 132, 124, 116, 104, 92].map((h, i) => {
                  const s = sp(frame, f.siete + i * 3, 14, 200);
                  const last = i === 6;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - s) * 30}px)`, opacity: s }}>
                      <Kid h={h} c={last ? KR : '#3A3F45'} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: KR, opacity: rampOut(frame, f.siete + 22, f.siete + 34), textAlign: 'right', paddingRight: 6 }}>Søren, el último</div>
            </SideCard>
            {/* el padre */}
            <SideCard at={f.padre - 4} out={f.paramos + 2} kicker="Su padre" title="Comerciante muy rico" size={58} top={260}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: rampOut(frame, f.nino - 4, f.nino + 10) }}>
                <svg width="80" height="80" viewBox="0 0 24 24"><path d="M5 20v-8l7-6 7 6v8z" fill="none" stroke={OCHRE} strokeWidth="1.8" /><path d="M10 20v-5h4v5" fill="none" stroke={OCHRE} strokeWidth="1.8" /><path d="M3 21h18" stroke={OCHRE} strokeWidth="1.8" strokeLinecap="round" /></svg>
                <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: color.ink2, lineHeight: 1.15 }}>Pero de niño había sido pastor</div>
              </div>
            </SideCard>
          </SkStage>
        </AbsoluteFill>
      )}
      {toHeath > 0 && (
        <AbsoluteFill style={{ opacity: toHeath, transform: `translate(${(random(`hs${frame}`) - 0.5) * shake}px, ${(random(`hv${frame}`) - 0.5) * shake}px)` }}>
          <AbsoluteFill style={{ transform: `scale(${heathZoom})`, transformOrigin: '70% 60%' }}>
            <Heath t={frame} fist={fist} flash={flash} />
          </AbsoluteFill>
          <div style={{ position: 'absolute', left: 140, top: 170, opacity: rampOut(frame, f.jut + 8, f.jut + 22) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ width: 60, height: 4, background: color.yellow, borderRadius: 2 }} />Páramos de Jutlandia
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 16 }}>
              {[{ t: 'Hambriento', at: f.hamb }, { t: 'Agotado', at: f.hamb + 14 }].map((q, i) => {
                const s = sp(frame, q.at, 15, 200);
                if (frame < q.at - 2) return null;
                return <div key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(10,10,14,0.6)', border: '1px solid rgba(255,255,255,0.18)', padding: '10px 26px', borderRadius: 999, opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>{q.t}</div>;
              })}
            </div>
          </div>
          {frame >= f.mald - 2 && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center' }}>
              <MaskTitle text="Maldijo a Dios" at={f.mald} size={120} align="center" color="#fff" style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, letterSpacing: 0, textShadow: '0 10px 40px rgba(0,0,0,0.6)' }} />
            </div>
          )}
          <Grain seed={Math.floor(frame / 2)} opacity={0.09} />
        </AbsoluteFill>
      )}
      <Sfx name="sk_pin" at={f.cph + 2} volume={0.6} />
      {Array.from({ length: 7 }).map((_, i) => <Sfx key={i} name="ui_pop" at={f.siete + i * 3} volume={0.3} />)}
      <Sfx name="coins" at={f.rico} volume={0.5} />
      <Sfx name="sk_pin" at={f.paramos} volume={0.5} />
      <Sfx name="kk_heath" at={f.jut} volume={0.8} dur={c.dur - f.jut} fade={20} />
      <Sfx name="kk_thunder" at={f.dios - 2} volume={0.9} />
      <Sfx name="impact" at={f.dios} volume={0.4} />
    </AbsoluteFill>
  );
};

// Vela (SVG): `lit` 0–1; al apagarse deja un hilo de humo.
const Candle: React.FC<{ x: number; y: number; h: number; lit: number; t: number; label?: string; labelAt?: number; big?: boolean }> = ({ x, y, h, lit, t, label, labelAt = 0, big = false }) => {
  const frame = useCurrentFrame();
  const flick = 1 + 0.08 * Math.sin(t * 0.7 + x) + 0.05 * Math.sin(t * 1.9 + x * 0.3);
  const smoke = 1 - lit;
  const w = big ? 34 : 28;
  return (
    <div style={{ position: 'absolute', left: x - 60, top: y - h - 140, width: 120, height: h + 200 }}>
      <svg width={120} height={h + 200} viewBox={`0 0 120 ${h + 200}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id={`cg${x}`} cx="0.5" cy="0.6" r="0.5"><stop offset="0" stopColor="#FFF7DC" /><stop offset="0.45" stopColor="#FFC764" /><stop offset="1" stopColor="rgba(255,120,30,0)" /></radialGradient>
        </defs>
        <rect x={60 - w / 2} y={140} width={w} height={h} rx={4} fill="#EFE6D0" />
        <rect x={60 + w / 2 - 9} y={140} width={9} height={h} fill="rgba(0,0,0,0.12)" />
        <path d={`M60 140 L60 128`} stroke="#2A2018" strokeWidth={2.4} />
        {lit > 0.01 && (
          <g opacity={lit}>
            <circle cx={60} cy={110} r={60 * flick} fill="rgba(255,190,90,0.16)" />
            <path d={`M60 ${128 - 46 * flick} Q${76} ${118} 60 ${130} Q${44} ${118} 60 ${128 - 46 * flick}Z`} fill={`url(#cg${x})`} />
          </g>
        )}
        {smoke > 0.01 && smoke < 0.999 && (
          <path d={`M60 128 C 50 ${100 - smoke * 20} 72 ${80 - smoke * 30} 58 ${40 - smoke * 50}`} stroke={`rgba(200,200,210,${0.5 * Math.sin(smoke * Math.PI)})`} strokeWidth={3} fill="none" />
        )}
      </svg>
      {label && <div style={{ position: 'absolute', left: -40, right: -40, top: h + 160, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', opacity: rampOut(frame, labelAt, labelAt + 12) }}>{label}</div>}
    </div>
  );
};

// ——— MALD · J08 ———
// «Ninguno pasaría de los 33, la edad de Cristo» → con 21 años, su madre y cinco hermanos ya habían muerto: se apagan
// seis velas de ocho (la madre y los siete hijos) y quedan dos, Peter Christian y Søren.
export const Mald: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MALD');
  const f = {
    creer: c.at('J08', 'creer'), hijos: c.at('J08', 'hijos'), ning: c.at('J08', 'ninguno'), treinta: c.at('J08', 'treinta'), cristo: c.at('J08', 'Cristo'),
    vein: c.at('J08', 'veintiún'), perd: c.at('J08', 'perdido'), madre: c.at('J08', 'madre'), cinco: c.at('J08', 'cinco'), herm: c.at('J08', 'hermanos'),
  };
  const n33 = sp(frame, f.treinta - 2, 16, 120);
  const n33out = ramp(frame, f.vein - 10, f.vein + 6);
  const candlesIn = ramp(frame, f.hijos - 8, f.hijos + 12);
  // orden en que se apagan: la madre (0) en «madre»; cinco hermanos desde «cinco»
  const xs = [300, 470, 640, 810, 980, 1150, 1320, 1490];
  const labels = ['Su madre', '', '', '', '', '', 'Peter Christian', 'Søren'];
  const outAt = [f.madre, f.cinco, f.cinco + 7, f.cinco + 14, f.cinco + 21, f.cinco + 28, 99999, 99999];
  return (
    <SkNight lamp={[960, 620]}>
      {/* 33 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120, opacity: n33 * (1 - n33out) }}>
        <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 300, lineHeight: 1, color: '#F1D58C', transform: `scale(${0.8 + 0.2 * n33})`, textShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>33</div>
        <div style={{ marginTop: 6, fontFamily: font.serif, fontStyle: 'italic', fontSize: 52, color: 'rgba(243,234,216,0.85)', opacity: rampOut(frame, f.cristo - 4, f.cristo + 12) }}>la edad de Cristo</div>
      </AbsoluteFill>
      {/* con 21 años */}
      {frame >= f.vein - 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}>
          <MaskTitle text="Con 21 años" at={f.vein} size={96} align="center" color="#fff" />
        </div>
      )}
      {/* las velas */}
      <AbsoluteFill style={{ opacity: candlesIn, transform: `translateY(${(1 - candlesIn) * 40}px)` }}>
        {xs.map((x, i) => {
          const lit = 1 - ramp(frame, outAt[i], outAt[i] + 8);
          return <Candle key={i} x={x + 60} y={900} h={i === 0 ? 210 : 150 + (i % 3) * 14} lit={lit} t={frame} big={i === 0} label={labels[i]} labelAt={i === 0 ? f.madre : f.herm + 10} />;
        })}
        <div style={{ position: 'absolute', left: 300, top: 960, width: 1340, height: 6, borderRadius: 3, background: 'rgba(201,162,78,0.5)' }} />
      </AbsoluteFill>
      {outAt.slice(0, 6).map((a, i) => <Sfx key={i} name="kk_candle_out" at={a} volume={0.7 - i * 0.05} />)}
      <Sfx name="hit_soft" at={f.treinta} volume={0.6} />
      <Sfx name="dk_match" at={f.hijos - 6} volume={0.4} />
    </SkNight>
  );
};

// ——— DIARIO · J09 ———
// Gilleleje, 1 de agosto de 1835: el diario junto al mar y la frase escrita a mano.
export const Diario: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DIARIO');
  const f = { veint: c.at('J09', 'veintidós'), diario: c.at('J09', 'diario'), enc: c.at('J09', 'Encontrar'), para: c.at('J09', 'mí,'), idea: c.at('J09', 'idea'), morir: c.end('J09', 'morir.') };
  const sea = ramp(frame, 0, 20);
  const page = sp(frame, f.diario - 8, 18, 110);
  return (
    <AbsoluteFill style={{ background: '#C9D3D8' }}>
      {/* el mar del norte de Selandia, en acuarela */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: sea }}>
        <defs>
          <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#AFC3CF" /><stop offset="1" stopColor="#E9E2D3" /></linearGradient>
          <linearGradient id="dg-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6F8E9A" /><stop offset="1" stopColor="#3F5B66" /></linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#dg-sky)" />
        <rect y="470" width="1920" height="610" fill="url(#dg-sea)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M${-100 + ((i * 173 + frame * (0.6 + (i % 3) * 0.2)) % 2100)} ${520 + i * 38} q 40 -8 80 0`} stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" />
        ))}
        <path d="M0 880 Q400 820 800 900 T1920 860 V1080 H0Z" fill="#D9C9A6" />
      </svg>
      <div style={{ position: 'absolute', left: 140, top: 110, opacity: rampOut(frame, 4, 18) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: KR_DEEP }}>
          <span style={{ width: 60, height: 4, background: color.yellow, borderRadius: 2 }} />Gilleleje · 1835
        </div>
        <div style={{ marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, opacity: rampOut(frame, f.veint - 2, f.veint + 12) }}>22 años</div>
      </div>
      {/* página del diario */}
      <div style={{ position: 'absolute', left: 300, top: 290, width: 1320, height: 640, transform: `translateY(${(1 - page) * 500}px) rotate(${-2 + (1 - page) * 6}deg)`, boxShadow: '0 50px 100px rgba(0,0,0,0.35)', borderRadius: 6, overflow: 'hidden' }}>
        <PaperBG tone="#F1E8D4" />
        <div style={{ position: 'absolute', right: 70, top: 44, fontFamily: HANDF, fontSize: 52, color: 'rgba(42,32,24,0.7)' }}>1 de agosto de 1835</div>
        <div style={{ position: 'absolute', left: 90, top: 150 }}>
          <Handwrite text="Encontrar una verdad" a={f.enc - 2} b={f.enc + 30} size={104} />
          <Handwrite text="que sea verdad para mí," a={f.enc + 26} b={f.para + 8} size={104} />
          <Handwrite text="la idea por la que quiero" a={f.idea - 4} b={f.idea + 30} size={104} />
          <Handwrite text="vivir y morir." a={f.idea + 26} b={f.morir + 4} size={104} colorInk={KR_DEEP} />
        </div>
      </div>
      <Grain seed={Math.floor(frame / 2)} opacity={0.06} />
      <Sfx name="kk_waves" at={0} volume={0.6} dur={c.dur} fade={20} />
      <Sfx name="page_turn" at={f.diario - 6} volume={0.6} />
      <Sfx name="dk_quill" at={f.enc} volume={0.6} />
      <Sfx name="dk_quill" at={f.idea} volume={0.5} />
    </AbsoluteFill>
  );
};

// Anillo dibujado (SVG).
const RingIcon: React.FC<{ size: number; spin?: number }> = ({ size, spin = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <defs><linearGradient id="rg-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.4" stopColor="#E3B85A" /><stop offset="1" stopColor="#8C6A2C" /></linearGradient></defs>
    <ellipse cx="50" cy="50" rx={38 * Math.abs(Math.cos(spin))} ry="38" fill="none" stroke="url(#rg-gold)" strokeWidth="11" />
  </svg>
);

// ——— BOOM · J10 ———
// Regine y el anillo (1841) → 1843: tres libros, cada uno con un seudónimo; a la vez, con su nombre, los discursos edificantes.
export const Boom: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('BOOM');
  const f = {
    reg: c.at('J10', 'Reguíne'), anillo: c.at('J10', 'anillo'), just: c.at('J10', 'justo'), year: c.at('J10', 'mil'), expl: c.at('J10', 'explosión'),
    uno: c.at('J10', 'uno'), temor: c.at('J10', 'Temor'), rep: c.at('J10', 'repetición'), cada: c.at('J10', 'cada'), autor: c.at('J10', 'autor'),
    vez: c.at('J10', 'vez'), propio: c.at('J10', 'propio'), disc: c.at('J10', 'discursos'),
  };
  const ringIn = sp(frame, f.reg - 4, 16, 120);
  const ringOut = ramp(frame, f.expl - 14, f.expl - 2);
  const big = sp(frame, f.year, 12, 160);
  const books = [
    { k: 'unootro', at: f.uno, sig: 'Victor Eremita', x: 250 },
    { k: 'temor', at: f.temor, sig: 'Johannes de Silentio', x: 600 },
    { k: 'repeticion', at: f.rep, sig: 'Constantin Constantius', x: 950 },
  ];
  const split = ramp(frame, f.vez - 6, f.vez + 14);
  return (
    <SkStage>
      {/* Regine y el anillo */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: ringIn * (1 - ringOut), transform: `scale(${0.9 + 0.1 * ringIn + 0.2 * ringOut})`, filter: ringOut > 0.01 ? `blur(${ringOut * 10}px)` : undefined }}>
        <RingIcon size={240} spin={frame / 14} />
        <div style={{ marginTop: 26, fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: color.ink }}>Regine Olsen · 1841</div>
      </AbsoluteFill>
      {/* 1843 */}
      {frame >= f.year - 2 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: big * (1 - 0.0 * split) }}>
          <div style={{ display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 150 - 54 * split, letterSpacing: -4, color: color.ink, transform: `scale(${0.7 + 0.3 * big})` }}>1843</div>
          <div style={{ marginTop: -8, fontFamily: font.serif, fontStyle: 'italic', fontSize: 46, color: KR, opacity: rampOut(frame, f.expl - 2, f.expl + 10) * (1 - split) }}>una explosión</div>
        </div>
      )}
      {/* los tres libros con seudónimo */}
      {books.map((b, i) => {
        const s = sp(frame, b.at - 4, 13, 140);
        if (frame < b.at - 5) return null;
        const sig = rampOut(frame, Math.max(b.at + 10, f.cada + i * 6), Math.max(b.at + 26, f.cada + i * 6 + 16));
        const x = b.x * (1 - split) + (40 + i * 300) * split;
        const sc = 1 - 0.3 * split;
        return (
          <div key={b.k} style={{ position: 'absolute', left: x + 120, top: 330 + 30 * split, transform: `translateY(${(1 - s) * 200}px) rotate(${(1 - s) * (i - 1) * 18}deg) scale(${(0.6 + 0.4 * s) * sc})`, transformOrigin: '50% 0%', opacity: Math.min(1, s * 1.5) }}>
            <Book3D b={BOOKS[b.k]} w={230} h={345} d={34} ry={-16 + i * 8} rx={3} />
            <div style={{ position: 'absolute', left: -200, right: -200, top: 380 + split * (i % 2) * 80, textAlign: 'center', opacity: sig }}>
              <div style={{ fontFamily: HANDF, fontSize: 58 + 8 * split, color: color.ink, whiteSpace: 'nowrap' }}>{b.sig}</div>
            </div>
          </div>
        );
      })}
      {/* «cada uno, un autor distinto» */}
      {frame >= f.autor - 6 && split < 1 && (
        <div style={{ position: 'absolute', left: 1370, top: 430, width: 440, opacity: rampOut(frame, f.autor - 4, f.autor + 10) * (1 - split) }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, lineHeight: 1.05, color: color.ink }}>Cada uno, un autor distinto</div>
        </div>
      )}
      {/* a la vez, con su nombre: discursos edificantes */}
      {split > 0.01 && (
        <>
          <div style={{ position: 'absolute', left: 120, top: 250, opacity: split, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: color.muted }}>Con seudónimo</div>
          <div style={{ position: 'absolute', left: 1080, top: 250, opacity: split, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: KR }}>Con su nombre</div>
          <div style={{ position: 'absolute', left: 1030, top: 240, width: 4, height: 720, background: 'rgba(16,16,16,0.12)', opacity: split }} />
          {['Dos', 'Tres', 'Cuatro'].map((n, i) => {
            const s = sp(frame, f.disc - 6 + i * 6, 14, 150);
            if (frame < f.disc - 8 + i * 6) return null;
            return (
              <div key={n} style={{ position: 'absolute', left: 1110 + i * 240, top: 330, transform: `translateY(${(1 - s) * 120}px) scale(${0.62 + 0.08 * s})`, transformOrigin: '50% 0%', opacity: s }}>
                <Book3D b={{ ...BOOKS.discursos, title: `${n} discursos edificantes` }} w={230} h={345} d={22} ry={-12} rx={3} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 1080, width: 760, top: 640, textAlign: 'center', fontFamily: HANDF, fontSize: 84, color: KR_DEEP, whiteSpace: 'nowrap', opacity: rampOut(frame, f.propio - 4, f.propio + 14) }}>S. Kierkegaard</div>
        </>
      )}
      <Sfx name="kk_ring" at={f.anillo - 2} volume={0.6} />
      <Sfx name="whoosh_deep" at={f.expl - 8} volume={0.5} />
      <Sfx name="impact" at={f.year} volume={0.4} />
      {books.map((b, i) => <Sfx key={i} name="sk_book_thud" at={b.at} volume={0.5} />)}
      {books.map((b, i) => <Sfx key={`q${i}`} name="dk_quill" at={f.cada + i * 6} volume={0.3} />)}
      <Sfx name="swipe" at={f.vez - 4} volume={0.6} />
      {[0, 1, 2].map((i) => <Sfx key={`d${i}`} name="sk_book_slide" at={f.disc - 4 + i * 6} volume={0.4} />)}
    </SkStage>
  );
};

// Caricatura propia (no copia ninguna de la época): un caballero flaco con sombrero de copa y paraguas, con una pernera
// claramente más corta que la otra.
const Caricature: React.FC<{ walk: number }> = ({ walk }) => (
  <svg width={380} height={560} viewBox="0 0 380 560" style={{ display: 'block', overflow: 'visible' }}>
    <g fill="none" stroke="#1A1714" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      {/* sombrero de copa */}
      <path d="M150 30 L148 108 L232 108 L230 30Z" fill="#1A1714" />
      <path d="M128 108 L252 108" strokeWidth={8} />
      {/* cabeza y pelo alborotado */}
      <path d="M160 112 Q150 170 190 182 Q230 170 222 112" fill="#F4ECDA" />
      <path d="M156 118 Q140 122 146 140 M224 118 Q240 122 234 140" />
      <circle cx="178" cy="140" r="3" fill="#1A1714" />
      <circle cx="206" cy="140" r="3" fill="#1A1714" />
      <path d="M190 146 Q196 160 188 162" />
      {/* levita encorvada */}
      <path d="M150 188 Q140 260 156 340 L226 340 Q238 260 228 188 Q190 176 150 188Z" fill="#3A3F45" />
      <path d="M188 192 L188 330" stroke="#22262A" />
      {/* brazo con el paraguas */}
      <path d="M226 210 Q262 250 268 300" />
      <path d="M270 300 L300 520" strokeWidth={4} />
      <path d="M300 520 Q312 534 300 540" strokeWidth={4} />
      <path d="M262 300 Q300 250 320 330 Q300 316 282 330 Q276 312 262 300Z" fill="#22262A" />
      {/* pantalones: la pernera izquierda, más corta */}
      <path d={`M162 340 L${158 + walk * 6} 470`} strokeWidth={26} stroke="#5A5F66" />
      <path d={`M210 340 L${216 - walk * 6} 520`} strokeWidth={26} stroke="#5A5F66" />
      {/* calcetín visible bajo la pernera corta y zapatos */}
      <path d={`M${158 + walk * 6} 470 L${157 + walk * 6} 522`} strokeWidth={14} stroke="#E8E2D4" />
      <path d={`M${146 + walk * 6} 528 L${178 + walk * 6} 528`} strokeWidth={14} />
      <path d={`M${206 - walk * 6} 530 L${238 - walk * 6} 530`} strokeWidth={14} />
    </g>
  </svg>
);

// ——— CORSARIO · J11 ———
// 1846: la revista satírica El Corsario; la caricatura de la pernera corta; números que se apilan durante meses; por la calle,
// «¡O lo uno o lo otro!».
export const Corsario: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORSARIO');
  const f = {
    year: c.at('J11', 'mil'), rev: c.at('J11', 'revista'), cors: c.at('J11', 'Corsario'), burl: c.at('J11', 'burló'), meses: c.at('J11', 'meses'),
    dib: c.at('J11', 'dibujaban'), pern: c.at('J11', 'pernera'), corta: c.at('J11', 'corta'), calle: c.at('J11', 'calle'), grit: c.at('J11', 'gritaban'), uno: c.at('J11', 'uno'),
  };
  const paper = sp(frame, f.rev - 6, 16, 120);
  const issues = Math.floor(interpolate(frame, [f.meses - 6, f.meses + 30], [0, 6], clamp));
  const circle = ramp(frame, f.corta - 4, f.corta + 14);
  const toStreet = ramp(frame, f.calle - 8, f.calle + 10);
  const shouts = [
    { x: 260, y: 230, r: -6, at: f.uno - 6 }, { x: 1300, y: 200, r: 5, at: f.uno + 2 }, { x: 1180, y: 760, r: -3, at: f.uno + 10 }, { x: 180, y: 720, r: 4, at: f.uno + 16 },
  ];
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 140, top: 96, opacity: rampOut(frame, f.year - 2, f.year + 12) * (1 - toStreet) }}>
        <Kicker at={f.year - 2} text="Copenhague, 1846" />
      </div>
      {/* números anteriores que se apilan detrás */}
      {Array.from({ length: issues }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: 560 + i * 16, top: 150 + i * 6, width: 800, height: 860, background: '#EDE6D4', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transform: `rotate(${(i % 2 ? 1 : -1) * (2 + i)}deg)`, opacity: 1 - toStreet }} />
      ))}
      {/* la revista */}
      <div style={{ position: 'absolute', left: 560, top: 140, width: 800, height: 880, transform: `translateY(${(1 - paper) * 700}px) rotate(${-1.5 + (1 - paper) * 8}deg) scale(${1 - 0.06 * toStreet})`, opacity: 1 - toStreet * 0.85, boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#F3ECDB', borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: 40, right: 40, top: 30, textAlign: 'center', borderBottom: '4px double #1A1714', paddingBottom: 12 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 104, letterSpacing: 6, color: '#1A1714', lineHeight: 1 }}>El Corsario</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 28, color: 'rgba(26,23,20,0.7)', marginTop: 6 }}>«Corsaren» · semanario satírico · Copenhague</div>
        </div>
        <div style={{ position: 'absolute', left: 210, top: 230, opacity: rampOut(frame, f.dib - 6, f.dib + 10) }}>
          <Caricature walk={Math.sin(frame / 8) * 0.6} />
          {/* señal de la pernera corta */}
          {circle > 0.01 && (
            <svg width={300} height={200} style={{ position: 'absolute', left: 60, top: 420, overflow: 'visible' }}>
              <ellipse cx={100} cy={70} rx={66} ry={46} fill="none" stroke={WAX} strokeWidth={6} strokeDasharray={360} strokeDashoffset={360 * (1 - circle)} />
            </svg>
          )}
        </div>
        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 34, display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.4 }}>
          {[0.9, 0.95, 0.7].map((w, i) => <div key={i} style={{ height: 10, width: `${w * 100}%`, background: '#1A1714', borderRadius: 3 }} />)}
        </div>
      </div>
      {circle > 0.3 && toStreet < 1 && (
        <div style={{ position: 'absolute', left: 1400, top: 690, opacity: rampOut(frame, f.corta, f.corta + 12) * (1 - toStreet), fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: WAX, maxWidth: 380, lineHeight: 1.1 }}>
          una pernera más corta que la otra
        </div>
      )}
      {/* meses */}
      {frame >= f.meses - 4 && toStreet < 1 && (
        <div style={{ position: 'absolute', left: 140, top: 420, display: 'flex', flexDirection: 'column', gap: 10, opacity: 1 - toStreet }}>
          {['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'].map((m, i) => {
            const on = rampOut(frame, f.meses - 6 + i * 5, f.meses + 2 + i * 5);
            return <div key={m} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: on, transform: `translateX(${(1 - on) * -20}px)` }}>{m}</div>;
          })}
        </div>
      )}
      {/* por la calle: los gritos */}
      {toStreet > 0.01 && (
        <AbsoluteFill style={{ opacity: toStreet }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <rect width="1920" height="1080" fill="#C9D3D8" />
            {Array.from({ length: 8 }).map((_, i) => {
              const x = i * 250 - 40, top = 180 + (i % 3) * 50, w = 250;
              const wall = ['#D2A86E', '#B9B2A0', '#C98B5A', '#D8C4A0', '#A9B4A8'][i % 5];
              return (
                <g key={i}>
                  <path d={`M${x} ${top} L${x + w / 2} ${top - 90} L${x + w} ${top} Z`} fill="#7A4A3A" />
                  <rect x={x} y={top} width={w} height={900 - top} fill={wall} />
                  {[0, 1, 2].map((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={x + 34 + k * 70} y={top + 40 + r * 140} width={44} height={84} fill="#4A5560" stroke="#F2EEE4" strokeWidth={5} />))}
                  <rect x={x + 100} y={780} width={50} height={120} fill="#3A2A20" />
                </g>
              );
            })}
            <rect y="880" width="1920" height="200" fill="#8C8170" />
            {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={(i * 131) % 1920} cy={910 + ((i * 47) % 160)} rx={30} ry={9} fill="rgba(0,0,0,0.1)" />)}
          </svg>
          <div style={{ position: 'absolute', left: 780, top: 360, transform: 'scale(1.05)' }}><Caricature walk={Math.sin(frame / 6)} /></div>
          {shouts.map((q, i) => {
            const s = sp(frame, q.at, 11, 220);
            if (frame < q.at - 1) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: q.x, top: q.y, transform: `rotate(${q.r}deg) scale(${0.6 + 0.4 * s})`, opacity: s }}>
                <div style={{ background: '#fff', borderRadius: 28, padding: '18px 34px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, whiteSpace: 'nowrap' }}>¡O lo uno o lo otro!</div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      <Sfx name="kk_press" at={f.rev - 6} volume={0.5} />
      <Sfx name="page_turn" at={f.rev} volume={0.6} />
      <Sfx name="pencil_strike" at={f.dib} volume={0.5} />
      {Array.from({ length: 6 }).map((_, i) => <Sfx key={i} name="page_turn" at={f.meses - 6 + i * 6} volume={0.25} />)}
      <Sfx name="draw" at={f.corta - 4} volume={0.5} />
      <Sfx name="kk_cobble" at={f.calle - 8} volume={0.6} />
      <Sfx name="kk_laugh" at={f.uno - 4} volume={0.8} />
    </SkStage>
  );
};

// ——— TREINTA · J12 ———
// 5 de mayo de 1847: «Qué extraño que haya cumplido treinta y cuatro años». El 33 tachado, el 34 en tinta.
export const Treinta: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TREINTA');
  const f = { dia: c.at('J12', 'día'), cumpl: c.at('J12', 'cumplió'), diario: c.at('J12', 'diario'), que: c.at('J12', 'extraño') - 6, anos: c.end('J12', 'años.'), mald: c.at('J12', 'maldición') };
  const page = sp(frame, 2, 18, 110);
  const strike = ramp(frame, f.cumpl - 4, f.cumpl + 10);
  const n34 = sp(frame, f.cumpl + 8, 13, 160);
  return (
    <SkNight lamp={[960, 540]}>
      <div style={{ position: 'absolute', left: 260, top: 160, width: 1400, height: 760, transform: `translateY(${(1 - page) * 300}px) rotate(-1.4deg)`, boxShadow: '0 50px 100px rgba(0,0,0,0.55)', borderRadius: 6, overflow: 'hidden' }}>
        <PaperBG tone="#EFE5CF" />
        <div style={{ position: 'absolute', left: 90, top: 60, fontFamily: HANDF, fontSize: 60, color: 'rgba(42,32,24,0.75)' }}>5 de mayo de 1847</div>
        <div style={{ position: 'absolute', right: 120, top: 120, display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{ position: 'relative', fontFamily: font.serif, fontSize: 200, color: 'rgba(42,32,24,0.45)', lineHeight: 1 }}>
            33
            <div style={{ position: 'absolute', left: -10, right: -10, top: '52%', height: 12, background: WAX, transform: `scaleX(${strike}) rotate(-8deg)`, transformOrigin: 'left', borderRadius: 6 }} />
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 240, color: KR_DEEP, lineHeight: 1, transform: `scale(${0.6 + 0.4 * n34})`, opacity: n34 }}>34</div>
        </div>
        <div style={{ position: 'absolute', left: 90, top: 400 }}>
          <Handwrite text="Qué extraño que haya cumplido" a={f.que - 2} b={f.que + 40} size={104} />
          <Handwrite text="treinta y cuatro años…" a={f.que + 36} b={f.anos + 4} size={104} />
        </div>
      </div>
      {frame >= f.mald - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center' }}>
          <MaskTitle text="La maldición no se había cumplido" at={f.mald - 2} size={64} align="center" color="#F3EAD8" style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, letterSpacing: 0 }} />
        </div>
      )}
      <Sfx name="page_turn" at={2} volume={0.5} />
      <Sfx name="pencil_strike" at={f.cumpl - 2} volume={0.6} />
      <Sfx name="hit_soft" at={f.cumpl + 8} volume={0.5} />
      <Sfx name="dk_quill" at={f.que} volume={0.6} />
      <Sfx name="shimmer" at={f.mald} volume={0.35} />
    </SkNight>
  );
};

// ——— FIN · J13 ———
// El último año: los diez números de El instante contra la Iglesia oficial; octubre de 1855, se desploma en la calle
// (el sombrero y el bastón en el empedrado); muere en el hospital a los 42.
export const Fin: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FIN');
  const f = {
    ult: c.at('J13', 'último'), atac: c.at('J13', 'atacando'), igl: c.at('J13', 'Iglesia'), din: c.at('J13', 'Dinamarca'), oct: c.at('J13', 'octubre'),
    despl: c.at('J13', 'desplomó'), calle: c.at('J13', 'calle'), mur: c.at('J13', 'murió'), hosp: c.at('J13', 'hospital'), cuar: c.at('J13', 'cuarenta'),
  };
  const toStreet = ramp(frame, f.oct - 10, f.oct + 8);
  const fall = ramp(frame, f.despl, f.despl + 18, (t) => t * t);
  const toEnd = ramp(frame, f.mur - 8, f.mur + 12);
  return (
    <SkNight lamp={[960, 500]}>
      {/* El instante: diez números */}
      <AbsoluteFill style={{ opacity: 1 - toStreet }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.45 }}>
          {/* silueta de la iglesia */}
          <path d="M760 900 V520 L860 440 L960 520 V900Z M900 520 V250 L930 180 L960 250 V520Z" fill="#2B323C" />
          <path d="M1040 900 V600 H1300 V900Z" fill="#2B323C" />
        </svg>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = f.atac - 6 + i * 4;
          const s = sp(frame, a, 13, 170);
          if (frame < a - 1) return null;
          const x = 260 + (i % 5) * 300, y = 300 + Math.floor(i / 5) * 330;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, width: 240, height: 300, background: '#EFE6D0', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: `translateY(${(1 - s) * -80}px) rotate(${((i * 37) % 9) - 4}deg)`, opacity: s, padding: 18 }}>
              <div style={{ fontFamily: font.serif, fontSize: 34, color: '#1A1714', textAlign: 'center', borderBottom: '2px solid #1A1714', paddingBottom: 6 }}>El instante</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: WAX, textAlign: 'center', marginTop: 20 }}>Nº {i + 1}</div>
              {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 6, marginTop: 12, width: `${70 + ((k * 13 + i * 7) % 30)}%`, background: 'rgba(26,23,20,0.35)', borderRadius: 3 }} />)}
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: rampOut(frame, f.igl - 4, f.igl + 12) }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: '#fff' }}>Contra la Iglesia oficial de Dinamarca</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, color: 'rgba(243,234,216,0.75)', marginTop: 6 }}>1854–1855</div>
        </div>
      </AbsoluteFill>
      {/* octubre de 1855: la calle */}
      {toStreet > 0.01 && (
        <AbsoluteFill style={{ opacity: toStreet * (1 - toEnd) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <defs><radialGradient id="fn-lamp" cx="0.5" cy="0.3" r="0.6"><stop offset="0" stopColor="rgba(255,200,120,0.35)" /><stop offset="1" stopColor="rgba(255,200,120,0)" /></radialGradient></defs>
            <rect y="760" width="1920" height="320" fill="#15181D" />
            {Array.from({ length: 60 }).map((_, i) => <ellipse key={i} cx={(i * 97) % 1920} cy={800 + ((i * 53) % 260)} rx={36} ry={10} fill="rgba(255,255,255,0.04)" />)}
            <rect x="520" y="200" width="10" height="580" fill="#0D0F12" />
            <circle cx="525" cy="200" r="260" fill="url(#fn-lamp)" />
          </svg>
          {/* sombrero y bastón que caen */}
          <svg width={600} height={400} style={{ position: 'absolute', left: 760, top: 560, overflow: 'visible' }}>
            <g transform={`translate(${120 + fall * 60} ${40 + fall * 190}) rotate(${fall * 200})`}>
              <path d="M-40 0 L-36 -70 L36 -70 L40 0Z" fill="#0A0B0D" />
              <rect x={-62} y={-4} width={124} height={10} rx={4} fill="#0A0B0D" />
            </g>
            <g transform={`translate(${300} ${0 + fall * 240}) rotate(${-20 + fall * 98})`}>
              <rect x={-5} y={-160} width={10} height={320} rx={5} fill="#3A2A1C" />
              <path d="M-5 -160 Q-5 -190 25 -190" stroke="#3A2A1C" strokeWidth={10} fill="none" />
            </g>
          </svg>
          <div style={{ position: 'absolute', left: 140, top: 140 }}>
            <Kicker at={f.oct - 4} text="Copenhague" style={{ color: 'rgba(255,255,255,0.6)' }} />
            <MaskTitle text="Octubre de 1855" at={f.oct} size={92} color="#fff" />
          </div>
        </AbsoluteFill>
      )}
      {/* final: 1813–1855 · 42 años */}
      {toEnd > 0.01 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: toEnd }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: 'rgba(243,234,216,0.85)' }}>Søren Kierkegaard</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: 10, color: '#F1D58C', marginTop: 12 }}>1813 – 1855</div>
          <div style={{ marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: '#fff', opacity: rampOut(frame, f.cuar - 4, f.cuar + 10), transform: `scale(${0.9 + 0.1 * rampOut(frame, f.cuar - 4, f.cuar + 10)})` }}>42 años</div>
        </AbsoluteFill>
      )}
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={i} name="page_turn" at={f.atac - 6 + i * 4} volume={0.2} />)}
      <Sfx name="kk_cobble" at={f.oct - 10} volume={0.5} />
      <Sfx name="hit_soft" at={f.despl + 16} volume={0.6} />
      <Sfx name="kk_bell" at={f.mur} volume={0.8} />
      <Sfx name="shimmer" at={f.cuar} volume={0.3} />
      {NEVA && null}
    </SkNight>
  );
};

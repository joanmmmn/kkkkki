import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Dust, Grain, flicker, font } from './kit';

// Viñetas de ambiente (una por libro), a pantalla completa. Ilustraciones propias y genéricas: nada de portadas,
// carteles ni fotogramas de películas. Se animan con el fotograma de la escena; `t0` es cuándo empiezan a verse.

type V = React.FC<{ t0: number }>;
const W = 1920;
const H = 1080;

const Vig: React.FC<{ children: React.ReactNode; bg: string; vignette?: number }> = ({ children, bg, vignette = 0.6 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {children}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

// 10 · Cthulhu: mar negro, luna verdosa y tentáculos que asoman despacio.
export const VCthulhu: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const rise = interpolate(t, [0, 520], [0, 1], { ...clamp, easing: easeOut });
  // Tentáculo: una línea central que sube y se enrosca en la punta; se dibuja con círculos que adelgazan y ventosas.
  const tent = (x: number, h: number, ph: number, s: number) => {
    const N = 70;
    const pts: { x: number; y: number; r: number }[] = [];
    let px = x, py = 720, ang = -Math.PI / 2 + Math.sin(t / 50 + ph) * 0.12;
    const len = h * (0.35 + 0.65 * rise) / N * 1.15;
    for (let i = 0; i < N; i++) {
      const q = i / (N - 1);
      const curl = q > 0.62 ? Math.pow((q - 0.62) / 0.38, 1.6) * 0.32 : 0;
      ang += (Math.sin(t / 36 + ph + q * 3.2) * 0.035 + curl) * (ph % 2 > 1 ? -1 : 1);
      px += Math.cos(ang) * len; py += Math.sin(ang) * len;
      pts.push({ x: px, y: py, r: Math.max(2, 34 * s * Math.pow(1 - q, 0.85)) });
    }
    return (
      <g>
        {pts.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={q.r} fill="#03090A" stroke="rgba(99,210,180,0.16)" strokeWidth={1.2} />)}
        {pts.filter((_, i) => i > 8 && i < 52 && i % 4 === 0).map((q, i) => <circle key={`s${i}`} cx={q.x + q.r * 0.55} cy={q.y} r={Math.max(1.5, q.r * 0.28)} fill="rgba(140,230,205,0.22)" />)}
      </g>
    );
  };
  return (
    <Vig bg="linear-gradient(180deg, #071315 0%, #0B2023 55%, #050B0C 100%)">
      <div style={{ position: 'absolute', left: 1240, top: 120, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,240,220,0.55) 0%, rgba(120,210,190,0.18) 45%, rgba(0,0,0,0) 70%)' }} />
      <div style={{ position: 'absolute', left: 1330, top: 210, width: 120, height: 120, borderRadius: '50%', background: '#CFE9DF', opacity: 0.8, boxShadow: '0 0 80px rgba(160,230,210,0.6)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {tent(560, 300, 0, 1)}{tent(820, 470, 1.7, 1.25)}{tent(1120, 360, 3.1, 1.05)}{tent(1430, 250, 4.4, 0.85)}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 640 + i * 52;
          const d = Array.from({ length: 25 }).map((__, k) => { const x = k * 82; const yy = y + Math.sin(k * 0.8 + t / (22 + i * 3) + i) * (4 + i * 1.6); return `${k === 0 ? 'M' : 'L'}${x} ${yy}`; }).join(' ');
          return <path key={i} d={`${d} L${W} ${H} L0 ${H} Z`} fill={`rgba(4,12,13,${0.55 + i * 0.05})`} stroke={`rgba(130,220,200,${0.18 - i * 0.015})`} strokeWidth={1.6} />;
        })}
      </svg>
      <Dust n={30} color="rgba(190,240,220,0.4)" />
    </Vig>
  );
};

// 9 · Poe: tablas del suelo de noche; entre ellas late una luz roja (un corazón). Un gato negro mira desde la esquina.
export const VPoe: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const beat = (f: number) => { const m = ((f % 56) + 56) % 56; return Math.max(interpolate(m, [0, 4, 14], [0, 1, 0], clamp), 0.75 * interpolate(m, [12, 16, 28], [0, 1, 0], clamp)); };
  const b = t < 0 ? 0 : beat(t);
  const blink = (t % 170) > 160 ? 0.1 : 1;
  return (
    <Vig bg="#0A0807" vignette={0.75}>
      <div style={{ position: 'absolute', left: -200, right: -200, top: 300, height: 1400, transform: 'perspective(1200px) rotateX(58deg)', transformOrigin: '50% 0%' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: i * 200, top: 0, width: 194, height: 1400, background: `linear-gradient(90deg, #1C1410, #241A14 50%, #17110D)`,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.6)' }}>
            {[220, 610, 980].map((y, k) => <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: y + (i % 2) * 140, height: 3, background: '#0B0806' }} />)}
          </div>
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={`g${i}`} style={{ position: 'absolute', left: (i + 1) * 200 - 4, top: 0, width: 6, height: 1400,
            background: `rgba(210,40,58,${(0.15 + 0.85 * b) * (i === 5 || i === 6 ? 1 : 0.35)})`, boxShadow: `0 0 ${18 + 40 * b}px rgba(210,40,58,${0.6 * b})` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 860, top: 640, width: 520, height: 360, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(210,40,58,${0.35 * b}) 0%, rgba(210,40,58,0) 70%)` }} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 240, height: 240 }}>
        {[90, 140].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 92, width: 22, height: 12 * blink, borderRadius: '50%', background: 'radial-gradient(circle, #111 0 22%, #F2C94C 30%)', boxShadow: '0 0 16px #F2C94C' }} />)}
      </div>
      <div style={{ position: 'absolute', right: 160, top: 120, width: 18, height: 60, borderRadius: 6, background: '#E8E0CF' }}>
        <div style={{ position: 'absolute', left: -6, top: -30, width: 30, height: 34, borderRadius: '50% 50% 45% 45%', background: `radial-gradient(circle at 50% 70%, #FFE6A8, #F2A541 60%, rgba(242,165,65,0) 72%)`, transform: `scale(${flicker(frame, 'candle', 1)})` }} />
      </div>
      <div style={{ position: 'absolute', right: -40, top: -80, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,120,0.14), rgba(0,0,0,0) 65%)' }} />
    </Vig>
  );
};

// 8 · Hendrix: pared empapelada, una ventana con luna y un títere que se balancea solo, con su sombra.
export const VHendrix: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const swing = Math.sin(t / 34) * 9 * interpolate(t, [0, 60], [0.3, 1], clamp);
  const Puppet: React.FC<{ c: string; s?: number }> = ({ c, s = 1 }) => (
    <svg width={260 * s} height={560 * s} viewBox="0 0 260 560" style={{ overflow: 'visible' }}>
      {[70, 130, 190].map((x) => <path key={x} d={`M${x} -400 L${x === 130 ? 130 : x === 70 ? 92 : 168} ${x === 130 ? 150 : 250}`} stroke="rgba(239,232,220,0.35)" strokeWidth={1.4} />)}
      <g transform="rotate(-14 130 200)">
        <circle cx="130" cy="200" r="56" fill={c} />
        <circle cx="108" cy="190" r="15" fill="#0A0807" /><circle cx="152" cy="190" r="15" fill="#0A0807" />
        <circle cx="110" cy="192" r="3.2" fill="#F2EEE6" /><circle cx="150" cy="188" r="3.2" fill="#F2EEE6" />
        <path d="M98 228 L162 228" stroke="#0A0807" strokeWidth={4} strokeLinecap="round" />
        {[104, 116, 128, 140, 152].map((x) => <path key={x} d={`M${x} 221 L${x + 2} 235`} stroke="#0A0807" strokeWidth={3} strokeLinecap="round" />)}
        <circle cx="95" cy="214" r="9" fill="rgba(181,69,43,0.35)" /><circle cx="165" cy="214" r="9" fill="rgba(181,69,43,0.35)" />
      </g>
      <path d="M78 140 L130 92 L182 140 Z" fill={c} opacity={0.9} />
      <rect x="92" y="262" width="76" height="140" rx="20" fill={c} />
      <path d="M96 280 L48 380 M164 280 L212 360 M110 400 L96 520 M150 400 L166 520" stroke={c} strokeWidth={20} strokeLinecap="round" />
    </svg>
  );
  return (
    <Vig bg="#1A1210" vignette={0.7}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(45deg, rgba(181,69,43,0.10) 25%, transparent 25%, transparent 75%, rgba(181,69,43,0.10) 75%), linear-gradient(45deg, rgba(181,69,43,0.10) 25%, transparent 25%, transparent 75%, rgba(181,69,43,0.10) 75%)',
        backgroundSize: '90px 90px', backgroundPosition: '0 0, 45px 45px' }} />
      <div style={{ position: 'absolute', left: 1260, top: 140, width: 420, height: 560, background: 'linear-gradient(180deg, #2B3A55, #1A2234)', boxShadow: 'inset 0 0 0 18px #2A1B14, 0 0 120px rgba(150,180,230,0.25)' }}>
        <div style={{ position: 'absolute', left: 201, top: 0, width: 18, height: 560, background: '#2A1B14' }} />
        <div style={{ position: 'absolute', left: 0, top: 271, width: 420, height: 18, background: '#2A1B14' }} />
        <div style={{ position: 'absolute', left: 260, top: 70, width: 90, height: 90, borderRadius: '50%', background: '#E6EEF8', boxShadow: '0 0 60px rgba(220,235,255,0.8)' }} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 760, width: 760, height: 26, background: '#2A1B14', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 170 + i * 170, top: 640, width: 90, height: 120 }}>
          <div style={{ position: 'absolute', left: 20, top: 0, width: 50, height: 50, borderRadius: '50%', background: '#E9D8C0', opacity: 0.85 }} />
          <div style={{ position: 'absolute', left: 30, top: 18, width: 6, height: 6, borderRadius: '50%', background: '#111' }} /><div style={{ position: 'absolute', left: 54, top: 18, width: 6, height: 6, borderRadius: '50%', background: '#111' }} />
          <div style={{ position: 'absolute', left: 10, top: 50, width: 70, height: 70, borderRadius: '30px 30px 10px 10px', background: ['#6B2A2A', '#2E4A5C', '#5C4A2E', '#3E2E5C'][i], opacity: 0.85 }} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 820 + 60, top: 120, transformOrigin: '130px -400px', transform: `rotate(${swing * 0.9}deg) translateX(60px)`, opacity: 0.35, filter: 'blur(6px)' }}><Puppet c="#000" s={1.05} /></div>
      <div style={{ position: 'absolute', left: 820, top: 110, transformOrigin: '130px -400px', transform: `rotate(${swing}deg)` }}><Puppet c="#E9D8C0" /></div>
    </Vig>
  );
};

// 7 · Schweblin: campo al anochecer, hileras hacia el horizonte, una bruma verdosa y un niño pequeño a lo lejos.
export const VSchweblin: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  return (
    <Vig bg="linear-gradient(180deg, #2A3328 0%, #4A5640 38%, #1A2117 39%, #0E120C 100%)">
      <div style={{ position: 'absolute', left: 820, top: 300, width: 280, height: 140, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(240,230,180,0.5), rgba(0,0,0,0) 70%)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 31 }).map((_, i) => {
          const x = -1400 + i * 160;
          return <path key={i} d={`M960 420 L${x} ${H}`} stroke="rgba(150,175,90,0.28)" strokeWidth={3 + Math.abs(i - 15) * 0.3} />;
        })}
        {Array.from({ length: 16 }).map((_, i) => { const y = 420 + Math.pow(i / 15, 2) * 660; return <path key={`h${i}`} d={`M0 ${y} L${W} ${y}`} stroke="rgba(0,0,0,0.25)" strokeWidth={1 + i * 0.3} />; })}
        <rect x="1210" y="380" width="70" height="40" fill="#0D110B" /><path d="M1200 382 L1245 356 L1290 382Z" fill="#0D110B" />
        <rect x="1236" y="392" width="14" height="12" fill={`rgba(255,230,160,${0.7 * flicker(frame, 'clinic', 0.8)})`} />
      </svg>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: 'absolute', left: -400 + ((t * (0.6 + i * 0.25) + i * 500) % 2600), top: 360 + i * 70, width: 1400, height: 220, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(170,200,120,0.22), rgba(0,0,0,0) 70%)', filter: 'blur(14px)' }} />
      ))}
      <svg width={36} height={80} viewBox="0 0 36 80" style={{ position: 'absolute', left: 900, top: 470 }}>
        <circle cx="18" cy="12" r="9" fill="#060805" /><path d="M6 80 L8 34 Q18 24 28 34 L30 80Z" fill="#060805" />
      </svg>
    </Vig>
  );
};

// 6 · Drácula: luna enorme, castillo sobre un risco, niebla y murciélagos.
export const VDracula: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  return (
    <Vig bg="linear-gradient(180deg, #120509 0%, #2A0A12 55%, #080304 100%)">
      <div style={{ position: 'absolute', left: 1020, top: 90, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, #F4E2C4 0%, #E9C99A 55%, rgba(233,201,154,0) 72%)', boxShadow: '0 0 200px rgba(240,200,150,0.35)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M0 1080 L0 760 L260 700 L420 610 L560 600 L640 520 L700 520 L720 470 L760 470 L770 420 L800 420 L812 360 L836 300 L860 360 L872 420 L900 420 L912 470 L960 470 L980 400 L1000 400 L1012 340 L1036 290 L1060 340 L1072 400 L1100 400 L1120 520 L1180 540 L1260 640 L1400 720 L1600 780 L1920 820 L1920 1080 Z" fill="#050203" />
        {[[790, 440], [1046, 420], [940, 500]].map(([x, y], k) => <rect key={k} x={x} y={y} width="10" height="16" fill={`rgba(255,200,120,${0.75 * flicker(frame, `cw${k}`, 1)})`} />)}
        {Array.from({ length: 9 }).map((_, i) => {
          const r = (k: string) => random(`bat-${i}-${k}`);
          const x = ((r('x') * 2200 + t * (2 + r('v') * 2.5)) % 2300) - 200;
          const y = 160 + r('y') * 380 + Math.sin(t / 14 + i) * 18;
          const flap = Math.sin(t / (3 + r('f') * 2) + i) * 9;
          const s = 0.6 + r('s') * 0.9;
          return <path key={i} d={`M${x} ${y} q ${-14 * s} ${-flap * s} ${-30 * s} ${4 * s} q ${10 * s} ${-2 * s} ${16 * s} ${6 * s} q ${4 * s} ${-6 * s} ${14 * s} ${-2 * s} q ${10 * s} ${-4 * s} ${14 * s} ${2 * s} q ${6 * s} ${-8 * s} ${16 * s} ${-6 * s} q ${-16 * s} ${-flap * s} ${-30 * s} ${-4 * s}`} fill="#050203" />;
        })}
      </svg>
      {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: -600 + ((t * (0.8 + i * 0.5) + i * 900) % 2800), top: 720 + i * 90, width: 1600, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,190,200,0.16), rgba(0,0,0,0) 70%)', filter: 'blur(16px)' }} />)}
    </Vig>
  );
};

// 5 · Apocalipsis Z: un televisor viejo con nieve; un mapa de puntos donde el rojo avanza de este a oeste.
export const VApocalipsis: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const spread = interpolate(t, [80, 640], [0, 1], { ...clamp, easing: easeInOut });
  const cols = 34, rows = 15;
  return (
    <Vig bg="#0B0D0B" vignette={0.8}>
      <div style={{ position: 'absolute', left: 360, top: 120, width: 1200, height: 800, borderRadius: 46, background: 'linear-gradient(160deg, #3A3A36, #1D1D1B)', boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 0 6px #4A4A45' }}>
        <div style={{ position: 'absolute', left: 60, top: 60, width: 1080, height: 600, borderRadius: 34, overflow: 'hidden', background: '#0E1410', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)' }}>
          <svg width={1080} height={600} style={{ position: 'absolute', inset: 0 }}>
            <filter id="tvn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 97} /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="1080" height="600" filter="url(#tvn)" opacity={0.16} />
            {Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((__, c) => {
              const rr = random(`map-${r}-${c}`);
              const land = rr > 0.18 + Math.abs(r - 7) * 0.035;
              if (!land) return null;
              const x = 60 + c * 28.5, y = 70 + r * 30;
              const front = 1 - spread * 1.15;
              const inf = c / (cols - 1) > front + (random(`mj-${r}-${c}`) - 0.5) * 0.12;
              return <circle key={`${r}-${c}`} cx={x} cy={y} r={inf ? 7 : 5} fill={inf ? '#E5484D' : 'rgba(155,209,75,0.45)'} opacity={inf ? 0.75 + 0.25 * Math.sin(t / 8 + c) : 1} />;
            }))}
            <text x="980" y="560" fill="rgba(239,232,220,0.75)" fontFamily="Ubuntu" fontWeight={700} fontSize="24" textAnchor="end">RUSIA</text>
            <text x="70" y="560" fill="rgba(239,232,220,0.75)" fontFamily="Ubuntu" fontWeight={700} fontSize="24">PONTEVEDRA</text>
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: '#C1121F', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', whiteSpace: 'nowrap', transform: `translateX(${1080 - ((t * 4) % 2400)}px)` }}>
              ÚLTIMA HORA · UN BROTE EXTRAÑO EN RUSIA · LAS AUTORIDADES PIDEN CALMA · ÚLTIMA HORA · UN BROTE EXTRAÑO EN RUSIA
            </div>
          </div>
          <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)' }} />
        </div>
        {[0, 1].map((k) => <div key={k} style={{ position: 'absolute', left: 1000 + k * 80, top: 700, width: 52, height: 52, borderRadius: '50%', background: '#242421', boxShadow: 'inset 0 0 0 4px #4A4A45' }} />)}
      </div>
    </Vig>
  );
};

// 4 · Carcoma: un armario viejo cuya puerta se abre sola; aparecen agujeros de carcoma y cae serrín.
export const VCarcoma: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const open = interpolate(t, [140, 420], [0, 1], { ...clamp, easing: easeInOut }) + Math.sin(t / 20) * 0.015 * (t > 140 ? 1 : 0);
  return (
    <Vig bg="radial-gradient(ellipse at 50% 40%, #2A1D14 0%, #140E0A 60%, #070504 100%)">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, bottom: 0, background: '#0E0907' }} />
      <div style={{ position: 'absolute', left: 660, top: 130, width: 600, height: 790 }}>
        <div style={{ position: 'absolute', left: -20, top: -30, width: 640, height: 40, background: '#3C2718', borderRadius: 6 }} />
        <div style={{ position: 'absolute', inset: 0, background: '#050302' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 8, background: '#1C120B' }} />
          <div style={{ position: 'absolute', left: 340, top: 128, width: 4, height: 300, background: '#1C120B' }} />
          <div style={{ position: 'absolute', left: 120, top: 260, width: 360, height: 300, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,220,160,${0.05 * open}), rgba(0,0,0,0) 70%)` }} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 300, height: 790, background: 'linear-gradient(90deg, #5E3F28, #4A311F)', boxShadow: 'inset 0 0 0 10px #3C2718' }} />
        <div style={{ position: 'absolute', left: 300, top: 0, width: 300, height: 790, perspective: 1400 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #4A311F, #5E3F28)', boxShadow: 'inset 0 0 0 10px #3C2718', transformOrigin: 'right center', transform: `rotateY(${open * 62}deg)` }}>
            <div style={{ position: 'absolute', left: 30, top: 360, width: 12, height: 56, borderRadius: 6, background: '#C9A46A' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 270, top: 360, width: 12, height: 56, borderRadius: 6, background: '#C9A46A' }} />
        {Array.from({ length: 34 }).map((_, i) => {
          const r = (k: string) => random(`worm-${i}-${k}`);
          const at = 30 + r('t') * 520;
          if (t < at) return null;
          const s = interpolate(t, [at, at + 8], [0, 1], clamp);
          return <div key={i} style={{ position: 'absolute', left: 20 + r('x') * 270 + (r('side') > 0.5 ? 0 : 0), top: 30 + r('y') * 720, width: 5 * s, height: 5 * s, borderRadius: '50%', background: '#120A05', boxShadow: '0 1px 0 rgba(255,220,170,0.15)' }} />;
        })}
        {Array.from({ length: 22 }).map((_, i) => {
          const r = (k: string) => random(`saw-${i}-${k}`);
          const y = ((t * (1.2 + r('v') * 1.6) + r('y') * 900) % 900);
          return <div key={`s${i}`} style={{ position: 'absolute', left: 10 + r('x') * 580, top: y, width: 3, height: 3, background: 'rgba(230,200,160,0.5)', borderRadius: 1 }} />;
        })}
      </div>
      <div style={{ position: 'absolute', left: 520, top: 920, width: 880, height: 80, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), rgba(0,0,0,0) 70%)' }} />
    </Vig>
  );
};

// 3 · Salem's Lot: un pueblo a los pies de una colina; arriba, una casa con una sola ventana encendida.
// Abajo, las ventanas del pueblo se van apagando.
export const VSalem: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  return (
    <Vig bg="linear-gradient(180deg, #0A0D14 0%, #161C28 60%, #0A0C10 100%)">
      <div style={{ position: 'absolute', left: 260, top: 110, width: 160, height: 160, borderRadius: '50%', background: '#DDE3EE', boxShadow: '0 0 120px rgba(200,215,240,0.55)', opacity: 0.85 }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M900 1080 C 1100 700, 1300 380, 1520 360 C 1700 350, 1820 420, 1920 470 L1920 1080 Z" fill="#06080C" />
        <path d="M1460 362 L1460 250 L1530 196 L1600 250 L1600 362 Z M1440 262 L1530 180 L1620 262 Z" fill="#030406" />
        <rect x="1516" y="262" width="26" height="30" fill={`rgba(255,190,110,${0.9 * flicker(frame, 'marsten', 1)})`} />
        <path d="M0 1080 L0 820 Q 400 780 900 860 L 900 1080 Z" fill="#05070A" />
        {Array.from({ length: 26 }).map((_, i) => {
          const r = (k: string) => random(`town-${i}-${k}`);
          const x = 40 + i * 32 + r('x') * 10, h = 60 + r('h') * 90, y = 900 - h + r('y') * 30;
          const off = 120 + r('off') * 600;
          const on = t < off ? 1 : interpolate(t, [off, off + 4], [1, 0], clamp);
          return (
            <g key={i}>
              <rect x={x} y={y} width={26} height={h + 200} fill="#05070A" />
              <path d={`M${x - 3} ${y} L${x + 13} ${y - 14} L${x + 29} ${y}Z`} fill="#05070A" />
              <rect x={x + 9} y={y + 18} width={8} height={10} fill={`rgba(255,205,130,${0.85 * on})`} />
            </g>
          );
        })}
      </svg>
      {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: -500 + ((t * (0.7 + i * 0.4) + i * 800) % 2700), top: 780 + i * 80, width: 1500, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(190,200,220,0.14), rgba(0,0,0,0) 70%)', filter: 'blur(14px)' }} />)}
    </Vig>
  );
};

// 2 · Nuestra parte de noche: una carretera de noche entre la selva; un coche se aleja y en el cielo se abre un ojo.
export const VEnriquez: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const eye = interpolate(t, [260, 420], [0, 1], { ...clamp, easing: easeInOut });
  const carY = interpolate(t, [0, 700], [900, 560], { ...clamp, easing: easeOut });
  const carS = interpolate(t, [0, 700], [1, 0.3], { ...clamp, easing: easeOut });
  return (
    <Vig bg="linear-gradient(180deg, #07060F 0%, #120E24 50%, #040309 100%)">
      {Array.from({ length: 60 }).map((_, i) => { const r = (k: string) => random(`star-${i}-${k}`); return <div key={i} style={{ position: 'absolute', left: r('x') * W, top: r('y') * 420, width: 2, height: 2, borderRadius: 1, background: '#fff', opacity: 0.3 + 0.5 * Math.abs(Math.sin(frame / (20 + r('t') * 30) + i)) }} />; })}
      <div style={{ position: 'absolute', left: 760, top: 110, width: 400, height: 200, opacity: eye }}>
        <svg width={400} height={200} viewBox="0 0 400 200">
          <path d={`M10 100 Q200 ${100 - 90 * eye} 390 100 Q200 ${100 + 90 * eye} 10 100Z`} fill="rgba(180,140,242,0.10)" stroke="rgba(180,140,242,0.55)" strokeWidth={3} />
          <circle cx="200" cy="100" r={38 * eye} fill="rgba(180,140,242,0.35)" /><circle cx="200" cy="100" r={14 * eye} fill="#07060F" />
        </svg>
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M940 520 L980 520 L1500 1080 L420 1080 Z" fill="#0B0A10" />
        {Array.from({ length: 10 }).map((_, i) => { const p = ((i / 10 + t / 260) % 1); const y = 520 + Math.pow(p, 2.2) * 560; const w = 2 + p * 10; const h = 4 + p * 40; return <rect key={i} x={960 - w / 2} y={y} width={w} height={h} fill="rgba(239,232,220,0.5)" />; })}
        {Array.from({ length: 22 }).map((_, i) => { const side = i % 2 ? 1 : -1; const k = Math.floor(i / 2) / 11; const x = 960 + side * (60 + k * 900); const h = 120 + k * 380; return <path key={`tr${i}`} d={`M${x - 60 - k * 120} 1080 L${x} ${520 - h * 0.3 + Math.sin(i) * 30} L${x + 60 + k * 120} 1080 Z`} fill="#050409" />; })}
      </svg>
      <div style={{ position: 'absolute', left: 960, top: carY, transform: `translateX(-50%) scale(${carS})`, transformOrigin: '50% 100%' }}>
        <div style={{ width: 220, height: 90, borderRadius: '30px 30px 10px 10px', background: '#08070C', position: 'relative' }}>
          {[22, 174].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 46, width: 26, height: 14, borderRadius: 4, background: '#FF3B3B', boxShadow: '0 0 30px 8px rgba(255,59,59,0.55)' }} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 960 - 300, top: carY - 340 * carS, width: 600 * carS, height: 400 * carS, transform: 'translateX(-0%)', background: 'radial-gradient(ellipse at 50% 100%, rgba(255,240,200,0.18), rgba(0,0,0,0) 70%)' }} />
    </Vig>
  );
};

// 1 · El exorcista: la fachada de una casa de ladrillo de noche; la ventana del desván parpadea y llegan relámpagos.
export const VExorcista: V = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const bolts = [180, 470];
  const flash = Math.max(0, ...bolts.map((b) => interpolate(t, [b, b + 2, b + 6, b + 8, b + 22], [0, 1, 0.2, 0.8, 0], clamp)));
  const attic = flicker(frame, 'attic', 1.4) * (0.55 + 0.45 * Math.abs(Math.sin(t / 9)));
  return (
    <Vig bg="linear-gradient(180deg, #06080D 0%, #0D1220 70%, #05060A 100%)">
      <AbsoluteFill style={{ background: `rgba(190,210,255,${0.22 * flash})` }} />
      <div style={{ position: 'absolute', left: 560, top: 150, width: 800, height: 930, background: 'linear-gradient(180deg, #2A1E1A, #1A120F)', boxShadow: '0 0 0 1px rgba(0,0,0,0.6)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 26px), repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 56px)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: -40, top: -120, width: 880, height: 140, background: '#0D0A09', clipPath: 'polygon(6% 100%, 50% 0%, 94% 100%)' }} />
        <div style={{ position: 'absolute', left: 340, top: -40, width: 120, height: 110, background: `rgba(160,190,240,${0.75 * attic})`, boxShadow: `0 0 ${60 * attic}px rgba(160,190,240,${0.7 * attic}), inset 0 0 0 10px #0D0A09` }}>
          <div style={{ position: 'absolute', left: 55, top: 0, width: 10, height: 110, background: '#0D0A09' }} />
        </div>
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
          <div key={`${r}${c}`} style={{ position: 'absolute', left: 110 + c * 230, top: 170 + r * 230, width: 120, height: 160, background: r === 0 && c === 1 ? `rgba(255,214,150,${0.12 + 0.1 * flash})` : '#080606', boxShadow: 'inset 0 0 0 8px #0D0A09' }} />
        )))}
        <div style={{ position: 'absolute', left: 330, top: 800, width: 140, height: 130, background: '#0A0706', boxShadow: 'inset 0 0 0 8px #160F0C' }} />
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: flash }}>
        <path d="M1560 0 L1520 160 L1570 170 L1500 380 L1545 390 L1470 560" stroke="rgba(230,240,255,0.95)" strokeWidth={4} fill="none" />
      </svg>
      {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: -500 + ((t * (0.6 + i * 0.4) + i * 900) % 2700), top: 860 + i * 70, width: 1500, height: 240, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(170,190,230,0.14), rgba(0,0,0,0) 70%)', filter: 'blur(16px)' }} />)}
    </Vig>
  );
};

export const VIGNETTES: Record<number, V> = { 1: VCthulhu, 2: VPoe, 3: VHendrix, 4: VSchweblin, 5: VDracula, 6: VApocalipsis, 7: VCarcoma, 8: VSalem, 9: VEnriquez, 10: VExorcista };

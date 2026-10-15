import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { BrowserWindow } from '../../components/BrowserWindow';
import { LinkBadge } from '../nxr/kit';
import { Butterfly, color, P, ramp, rampOut, SERIES, sp } from './kit';
import { sceneClock } from './timeline';
import { Beam, Halo, Head, Layer, PaperFinish, Person, Rig, Sky, sitPose, useCamera } from './theatre';
import { Banana, WARM } from './sets';
import { BookPile, PILES } from './v2Open';
import { CardTag } from './v2Success';

// ————————————————————————————————————————————————————————————————
// Capítulo IX · Escucharlo (v2) y cierre
// ————————————————————————————————————————————————————————————————

const NARR = [
  { n: 'Gustavo Bonfigli', d: '17 h 29 min', s: 'recomendada en SonorBooks', w: 'Gustavo' },
  { n: 'Juan Pablo Raba', d: '13 h 17 min', s: 'actor colombiano', w: 'Juan' },
  { n: 'A varias voces', d: '15 h 25 min', s: 'cuatro narradores', w: 'versión' },
];

// Ondas de voz (arcos) que salen de un punto hacia la derecha (dir 1) o la izquierda (-1).
export const VoiceWaves: React.FC<{ x: number; y: number; dir?: 1 | -1; t: number; n?: number; c?: string; reach?: number; on?: number }> = ({ x, y, dir = 1, t, n = 4, c = '#FFD98A', reach = 260, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${dir} 1)`} opacity={on}>
    {Array.from({ length: n }).map((_, i) => {
      const k = ((t / 40 + i / n) % 1);
      const r = 30 + k * reach;
      return <path key={i} d={`M ${r * Math.cos(-0.7)} ${r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${r * Math.cos(0.7)} ${r * Math.sin(0.7)}`} stroke={c} strokeWidth={6 - k * 3} fill="none" strokeLinecap="round" opacity={(1 - k) * 0.8} />;
    })}
  </g>
);

// ——— AUDIO v2 · W33–W34 ———
export const Audio2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AUDIO');
  const fCasa = c.at('W33', 'casa');
  const fVoz = c.at('W33', 'voz');
  const fTiene = c.at('W33', 'tienes');
  const fAud = c.at('W33', 'audiolibro');
  const fEsp = c.at('W33', 'español');
  const fTres = c.at('W33', 'tres');
  const fSon = c.at('W34', 'Sónorbuks');
  const fComp = c.at('W34', 'comparas');
  const fPlat = c.at('W34', 'plataformas');
  const fEnl = c.at('W34', 'enlace');
  const fArt = c.at('W34', 'artículo');
  const end = c.dur;
  const tList = fTiene - 12;
  const tMics = fTres - 16;
  const tWeb = fSon - 16;
  let shot: React.ReactNode;
  if (frame < tList) shot = <Porch t1={tList} fCasa={fCasa} fVoz={fVoz} />;
  else if (frame < tMics) shot = <Listener t0={tList} t1={tMics} fAud={fAud} fEsp={fEsp} />;
  else if (frame < tWeb) shot = <Mics t0={tMics} t1={tWeb} fTres={fTres} at={(w) => c.at('W33', w)} />;
  else shot = <Web t0={tWeb} end={end} fComp={fComp} fPlat={fPlat} fEnl={fEnl} fArt={fArt} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <Sfx name="hdl_crickets" at={0} volume={0.35} dur={tList + 10} fade={16} />
      <Sfx name="hdl_rocking" at={6} volume={0.4} dur={tList - 6} fade={16} />
      <Sfx name="hdl_flutter" at={fVoz} volume={0.6} />
      <Sfx name="whoosh_soft" at={tList - 4} volume={0.4} />
      <Sfx name="ui_pop" at={fAud - 4} volume={0.5} />
      <Sfx name="hit_soft" at={tMics + 4} volume={0.4} />
      {NARR.map((n, i) => <Sfx key={`l${i}`} name="hdl_spotlight" at={c.at('W33', n.w) - 8} volume={0.8} />)}
      <Sfx name="whoosh_soft" at={tWeb - 4} volume={0.6} />
      <Sfx name="zoom_in" at={fComp - 4} volume={0.5} />
      <Sfx name="focus" at={fComp} volume={0.5} />
      <Sfx name="focus" at={fPlat + 8} volume={0.5} />
      <Sfx name="zoom_out" at={fEnl + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fEnl + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fArt} volume={0.5} />
    </AbsoluteFill>
  );
};

// El porche de los abuelos (como en «Abuela»): ella cuenta, el niño escucha; la voz sale en ondas que se hacen mariposas.
const Porch: React.FC<{ t1: number; fCasa: number; fVoz: number }> = ({ t1, fCasa, fVoz }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 960, y: 620, s: 1.12 }, { f: t1, x: 1000, y: 620, s: 1.28 }], 0.6);
  const rock = Math.sin(frame / 14) * 5;
  const ink = '#0B0A14';
  const waves = rampOut(frame, fCasa - 30, fCasa);
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <Sky stops={[[0, '#0E1838'], [60, '#24305A'], [100, '#3A3A5E']]} glows={[{ x: 960, y: 560, r: 760, c: '#FFC27A', a: 0.55 }, { x: 330, y: 200, r: 300, c: '#DCE4F2', a: 0.25 }]} />
        <Layer z={0.05}>
          {Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={random(`as${i}`) * 1920} cy={random(`ay${i}`) * 600} r={0.8 + random(`ar${i}`) * 1.8} fill="#F3EAD6" opacity={(0.3 + random(`ao${i}`) * 0.6) * (0.5 + 0.5 * Math.sin(frame / (12 + (i % 9)) + i))} />)}
          <circle cx={330} cy={200} r={64} fill="#F1E7CF" />
        </Layer>
        <Layer z={0.3}>
          {Array.from({ length: 12 }).map((_, i) => <Banana key={i} x={-60 + i * 180} y={780} h={180 + random(`ab${i}`) * 80} c="#2A3058" sway={Math.sin(frame / 25 + i) * 3} seed={`ab${i}`} />)}
          <rect x={-200} y={776} width={2320} height={400} fill="#2A3058" />
        </Layer>
        <Layer z={1}>
          <rect x={-300} y={120} width={2520} height={46} fill={ink} />
          {[140, 1740].map((x, i) => <rect key={i} x={x} y={160} width={40} height={800} fill={ink} />)}
          <rect x={-300} y={950} width={2520} height={300} fill={ink} />
          <line x1={980} y1={166} x2={980} y2={430} stroke={ink} strokeWidth={4} />
          <path d="M 954 430 L 1006 430 L 1000 500 L 960 500 Z" fill={ink} />
          <Halo x={980} y={466} r={380} c={WARM} a={0.75} />
          <ellipse cx={980} cy={470} rx={14} ry={20} fill="#FFE2A0" />
          <g transform={`rotate(${rock} 700 950)`}>
            <path d="M 560 948 C 610 966, 760 966, 820 940" stroke={ink} strokeWidth={12} fill="none" />
            <rect x={586} y={810} width={12} height={140} fill={ink} />
            <rect x={572} y={650} width={12} height={190} fill={ink} transform="rotate(-10 578 745)" />
            <rect x={586} y={818} width={190} height={14} fill={ink} />
            <rect x={764} y={830} width={12} height={110} fill={ink} />
            <Person x={660} y={958} scale={2.3} kind="grandma" hair="bun" pose={sitPose({ lean: -4 + Math.sin(frame / 22) * 3, neck: 8 + Math.sin(frame / 9) * 3, shF: 40 + Math.sin(frame / 7) * 14, elF: 70, shB: 36, elB: 80, hipF: 78, hipB: 74 })} c={ink} back="#24203A" />
          </g>
          <VoiceWaves x={800} y={640} t={frame} on={waves * (1 - ramp(frame, fVoz + 10, fVoz + 30))} reach={300} />
          <Person x={1240} y={1062} scale={2.1} face={-1} kind="boy" hair="kid" pose={sitPose({ lean: 6, neck: -10, shF: 30, elF: 70, shB: 20, elB: 60, hipF: 80, knF: 120, hipB: 70, knB: 130 })} c={ink} back="#24203A" />
        </Layer>
      </Rig>
      {frame > fVoz - 4 && (
        <AbsoluteFill>
          {Array.from({ length: 6 }).map((_, i) => {
            const t = (frame - fVoz + 4 - i * 4) / 40;
            if (t < 0) return null;
            return <Butterfly key={i} x={860 + t * 420 + Math.sin(t * 5 + i) * 40} y={600 - t * 160 + Math.cos(t * 4 + i) * 50 - i * 14} size={46 + (i % 3) * 10} seed={`pv${i}`} glow={0.7} opacity={Math.min(1, t * 4)} />;
          })}
        </AbsoluteFill>
      )}
      <PaperFinish opacity={0.45} vignette={0.6} />
    </AbsoluteFill>
  );
};

// Hoy: una cabeza de perfil con auriculares junto a la ventana de la ciudad; las mismas ondas, las mismas mariposas.
const Listener: React.FC<{ t0: number; t1: number; fAud: number; fEsp: number }> = ({ t0, t1, fAud, fEsp }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 980, y: 560, s: 1.0 }, { f: t1, x: 1020, y: 560, s: 1.1 }], 0.5);
  const H = 640;
  const hx = 1260, hy = 1080;
  const u = H / 110;
  const ink = '#0A0C10';
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <Sky stops={[[0, '#1A2230'], [100, '#0B0F16']]} glows={[{ x: 560, y: 420, r: 700, c: '#9CB4D8', a: 0.25 }]} />
        <Layer z={0.4}>
          {/* ventana con la ciudad de noche */}
          <rect x={220} y={150} width={640} height={620} fill="#0F1A2A" />
          {Array.from({ length: 14 }).map((_, i) => {
            const bx = 220 + i * 46, bh = 120 + random(`lb${i}`) * 300;
            return <g key={i}><rect x={bx} y={770 - bh} width={42} height={bh} fill="#16243A" />{Array.from({ length: Math.floor(bh / 40) }).map((_, k) => random(`lw${i}${k}`) > 0.55 && <rect key={k} x={bx + 10} y={790 - bh + k * 40} width={10} height={14} fill="#E6B566" opacity={0.75} />)}</g>;
          })}
          <rect x={530} y={150} width={14} height={620} fill="#06080C" />
          <rect x={220} y={450} width={640} height={14} fill="#06080C" />
          <rect x={200} y={130} width={680} height={660} fill="none" stroke="#06080C" strokeWidth={30} />
          <Halo x={1240} y={300} r={420} c="#FFD98A" a={0.3} />
        </Layer>
        <Layer z={1}>
          <path d={`M ${hx - 620} 1080 C ${hx - 600} 900, ${hx - 300} 860, ${hx} 860 C ${hx + 300} 860, ${hx + 560} 900, ${hx + 620} 1080 Z`} fill={ink} />
          <Head x={hx} y={hy - 200} h={H} face={-1} hair="short" c={ink} />
          {/* auriculares (en las coordenadas de la cabeza: 110 de alto, mirando a la izquierda) */}
          <g transform={`translate(${hx} ${hy - 200}) scale(${-u} ${u})`}>
            <path d="M -14 -64 C -18 -110, 34 -122, 30 -100" stroke="#2A3240" strokeWidth={7} fill="none" strokeLinecap="round" />
            <rect x={-22} y={-66} width={24} height={34} rx={9} fill="#2A3240" />
            <rect x={-18} y={-62} width={16} height={26} rx={7} fill="#3A4558" />
          </g>
        </Layer>
      </Rig>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <VoiceWaves x={hx + 8 * u - 140} y={hy - 200 - 49 * u} dir={-1} t={frame} on={rampOut(frame, t0, t0 + 20)} reach={340} />
      </svg>
      <AbsoluteFill>
        {Array.from({ length: 5 }).map((_, i) => {
          const t = (frame - t0 - 10 - i * 6) / 60;
          if (t < 0) return null;
          return <Butterfly key={i} x={1100 - t * 500 + Math.sin(t * 5 + i) * 40} y={560 - t * 120 + Math.cos(t * 4 + i) * 40 - i * 20} size={44 + (i % 3) * 10} seed={`ls${i}`} glow={0.7} opacity={Math.min(1, t * 4) * (1 - ramp(frame, t1 - 10, t1))} />;
        })}
      </AbsoluteFill>
      <PaperFinish opacity={0.4} vignette={0.6} />
      <CardTag text="el audiolibro, en español" x={120} y={860} a={fAud - 4} rot={-2} size={70} />
      {fEsp < 0 && null}
    </AbsoluteFill>
  );
};

// Tres micrófonos de estudio, tres narraciones.
const StudioMic: React.FC<{ x: number; y: number; s?: number; c: string }> = ({ x, y, s = 1, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-46} y={-250} width={92} height={150} rx={46} fill={c} />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-40} y={-230 + i * 20} width={80} height={5} fill="#000" opacity={0.25} />)}
    <rect x={-60} y={-130} width={120} height={14} rx={7} fill={c} />
    <path d="M -60 -123 C -60 -60, 60 -60, 60 -123" stroke={c} strokeWidth={10} fill="none" />
    <rect x={-6} y={-80} width={12} height={380} fill={c} />
    <path d="M -110 300 L 110 300 L 0 270 Z" fill={c} />
  </g>
);

const Mics: React.FC<{ t0: number; t1: number; fTres: number; at: (w: string) => number }> = ({ t0, t1, fTres, at }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.06 }, { f: t1, x: 960, y: 540, s: 1.0 }], 0.5);
  const xs = [460, 960, 1460];
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3A2A1C'], [100, '#140C07']]} glows={[460, 960, 1460].map((x) => ({ x, y: 440, r: 340, c: '#FFD98A', a: 0.14 }))} />
      <Layer z={1}>
        <rect x={-300} y={900} width={2520} height={400} fill="#0A0604" />
        {NARR.map((n, i) => {
          const on = ramp(frame, at(n.w) - 8, at(n.w) + 6);
          return (
            <g key={i}>
              <g opacity={on}>
                <Beam x={xs[i]} y={-100} w0={60} w1={460} len={1000} a={0.3} />
                <ellipse cx={xs[i]} cy={905} rx={220} ry={26} fill="#FFD98A" opacity={0.25} />
              </g>
              {i < 2
                ? <StudioMic x={xs[i]} y={600} c="#0A0604" />
                : <g>{[-70, 0, 70].map((dx, k) => <StudioMic key={k} x={xs[i] + dx} y={620 + Math.abs(dx) * 0.4} s={0.68} c="#0A0604" />)}</g>}
            </g>
          );
        })}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.3} />
      <CardTag text="tres narraciones" x={760} y={90} a={fTres - 4} rot={-2} size={70} />
      {NARR.map((n, i) => {
        const a = at(n.w) - 6;
        const p = sp(frame, a, 13, 170);
        if (frame < a - 2) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: xs[i] - 200, top: 760, width: 400, textAlign: 'center', transform: `translateY(${(1 - p) * 30}px) rotate(${(i - 1) * 2}deg)`, opacity: Math.min(1, p * 2),
            background: '#F4EAD5', padding: '18px 10px 14px', boxShadow: '0 18px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 46, color: '#1D1A16', lineHeight: 1 }}>{n.n}</div>
            <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 38, color: '#B5262B', marginTop: 4 }}>{n.s}</div>
            <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 24, color: '#7A6650', marginTop: 2 }}>{n.d}</div>
          </div>
        );
      })}
    </Rig>
  );
};

// La ficha en sonorbooks.com (capturas reales de la web), sobre la mesa oscura.
const Web: React.FC<{ t0: number; end: number; fComp: number; fPlat: number; fEnl: number; fArt: number }> = ({ t0, end, fComp, fPlat, fEnl, fArt }) => {
  const frame = useCurrentFrame();
  const W = 1400;
  const k = W / 1600;
  const cam = [
    { f: t0, s: 0.86, x: 0, y: 40 },
    { f: fComp - 14, s: 1, x: 0, y: 0 },
    { f: fComp + 8, s: 1.75, x: -(1148 * k - W / 2) * 1.75, y: -(540 * k - 394) * 1.75 },
    { f: fPlat - 8, s: 1.75, x: -(1148 * k - W / 2) * 1.75, y: -(540 * k - 394) * 1.75 },
    { f: fPlat + 14, s: 1.6, x: -(1120 * k - W / 2) * 1.6, y: -(800 * k - 394) * 1.6 },
    { f: fEnl - 8, s: 1.6, x: -(1120 * k - W / 2) * 1.6, y: -(800 * k - 394) * 1.6 },
    { f: fEnl + 20, s: 0.8, x: 0, y: -70 },
  ];
  const kk = (p: string) => keyframes(frame, cam, p, easeInOut);
  const box = (x: number, y: number, w: number, h: number, a: number, b: number) => {
    const p = interpolate(frame, [a, a + 10, b - 8, b], [0, 1, 1, 0], clamp);
    if (p <= 0) return null;
    return <div style={{ position: 'absolute', left: x * k - 8, top: y * k - 8, width: w * k + 16, height: h * k + 16, borderRadius: 12, border: `${5 / kk('s')}px solid ${color.yellow}`, boxShadow: `0 0 0 4000px rgba(16,16,16,${0.3 * p})`, opacity: p, transform: `scale(${1.05 - 0.05 * p})` }} />;
  };
  const showNarr = frame > fComp - 16;
  const inP = rampOut(frame, t0, t0 + 16);
  return (
    <AbsoluteFill>
      <Sky stops={[[0, '#2A1C12'], [100, '#0E0905']]} glows={[{ x: 960, y: 480, r: 1000, c: '#FFD98A', a: 0.25 }]} />
      <PaperFinish opacity={0.35} vignette={0.6} warm={0.2} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: inP }}>
        <div style={{ transform: `translate(${kk('x')}px, ${kk('y') + (1 - inP) * 40}px) scale(${kk('s')})` }}>
          <BrowserWindow width={W} url="sonorbooks.com/es/audiolibro/cien-anos-de-soledad">
            <Img src={staticFile('hdl/web/ficha_top.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: showNarr ? 0 : 1 }} />
            <Img src={staticFile('hdl/web/ficha_narr.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: showNarr ? 1 : 0 }} />
            {box(856, 420, 584, 108, fComp - 2, fComp + 22)}
            {box(856, 528, 584, 84, fComp + 12, fComp + 36)}
            {box(856, 612, 584, 78, fComp + 26, fPlat - 2)}
            {box(806, 768, 634, 90, fPlat + 8, fEnl + 2)}
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 20px', background: '#fff', borderRadius: 999, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', opacity: rampOut(frame, fEnl - 6, fEnl + 6), fontFamily: '"Ubuntu", sans-serif', fontWeight: 700, fontSize: 36 }}>
          <LogoIcon size={46} /> sonorbooks.com
        </div>
        <LinkBadge at={fEnl} size={36} />
        <div style={{ padding: '14px 30px', background: P.yellow, borderRadius: 999, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', fontFamily: '"Ubuntu", sans-serif', fontWeight: 700, fontSize: 34, color: P.ink, opacity: rampOut(frame, fArt - 6, fArt + 6), transform: `translateY(${(1 - rampOut(frame, fArt - 6, fArt + 6)) * 20}px)` }}>+ el artículo con las fuentes</div>
      </div>
      {end < 0 && null}
    </AbsoluteFill>
  );
};

// ——— OUTRO v2 · W35 ———
// Cierre a la izquierda; la mitad derecha, tranquila (la ciudad de libros bajo la luna), queda libre para la pantalla final.
export const Outro2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('W35');
  const fProx = c.at('W35', 'próximo');
  const fCom = c.at('W35', 'comentarios');
  const vEnd = c.voEnd('W35');
  const brand = sp(frame, vEnd + 20, 18, 140);
  const cam = useCamera([{ f: 0, x: 960, y: 560, s: 1.06 }, { f: c.dur, x: 960, y: 540, s: 1.0 }], 0.3);
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      <Rig cam={cam}>
        <Sky stops={[[0, '#060B12'], [55, '#0F1D2C'], [100, '#1B2A37']]} glows={[{ x: 1560, y: 200, r: 380, c: '#F3EBD8', a: 0.16 }, { x: 1400, y: 980, r: 800, c: '#E6A35C', a: 0.14 }]} />
        <Layer z={0.1}>
          <circle cx={1560} cy={200} r={48} fill="#F1E7CF" opacity={0.85} />
          {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={random(`os${i}`) * 1920} cy={random(`oy${i}`) * 640 - 60} r={0.8 + random(`or${i}`) * 1.5} fill="#F3EAD6" opacity={(0.25 + random(`oo${i}`) * 0.5) * (0.6 + 0.4 * Math.sin(frame / (18 + (i % 11)) + i))} />)}
        </Layer>
        <Layer z={0.6} opacity={0.75}>{PILES.map((p, i) => i % 2 === 1 && <BookPile key={i} x={p.x} base={1030} n={Math.round(p.n * 0.7)} w={p.w * 0.8} grow={1} seed={`pb${i}`} c="#101B26" />)}</Layer>
        <Layer z={0.85} opacity={0.85}>{PILES.map((p, i) => i % 2 === 0 && <BookPile key={i} x={p.x} base={1090} n={Math.round(p.n * 0.6)} w={p.w} grow={1} seed={`pa${i}`} c="#0A121A" />)}</Layer>
      </Rig>
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(5,8,11,0.85) 0%, rgba(5,8,11,0.55) 45%, rgba(5,8,11,0) 62%)' }} />
      <PaperFinish opacity={0.35} vignette={0.5} />
      {/* 1 · «Esto ha sido…»: el nombre de la serie, grande; 2 · sube y deja sitio a la pregunta, el comentario y la marca */}
      {(() => {
        const up = ramp(frame, fProx - 26, fProx - 6, easeInOut);
        const t1 = rampOut(frame, f0, f0 + 14);
        return (
          <div style={{ position: 'absolute', left: 130, top: interpolate(up, [0, 1], [300, 56]), width: 900, transformOrigin: '0 0', transform: `scale(${1 - 0.5 * up})`, opacity: t1 * (1 - 0.25 * up) }}>
            <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 34, letterSpacing: 3, color: '#E9D7B0' }}>Esto ha sido</div>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 104, lineHeight: 1.02, color: '#F6EFE2', marginTop: 12 }}>
              <Words text="La historia detrás del libro" start={f0 + 6} stagger={3} size={104} weight={600} serif color="#F6EFE2" align="left" />
            </div>
            <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: 46, color: P.yellow, marginTop: 14, opacity: rampOut(frame, f0 + 30, f0 + 46) }}>Episodio 1 · Cien años de soledad</div>
          </div>
        );
      })()}
      <div style={{ position: 'absolute', left: 130, top: 270, width: 820 }}>
        <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 84, color: '#F6EFE2', lineHeight: 1.05 }}>
          <Words text="¿Qué libro contamos en el próximo episodio?" start={fProx - 14} stagger={3} size={84} weight={600} serif color="#F6EFE2" align="left" />
        </div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 999, background: P.yellow, color: P.ink, fontFamily: '"Ubuntu", sans-serif', fontWeight: 700, fontSize: 32, opacity: rampOut(frame, fCom - 6, fCom + 8), transform: `translateY(${(1 - rampOut(frame, fCom - 6, fCom + 8)) * 16}px)` }}>
          <svg width={36} height={36} viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill={P.ink} /></svg>
          Déjalo en los comentarios
        </div>
        <div style={{ marginTop: 44, opacity: brand, transform: `translateY(${(1 - brand) * 20}px)` }}>
          <Logo size={72} delay={vEnd + 20} dark />
          <div style={{ marginTop: 20, width: 900 }}>
            <Words text="Tu próxima historia te está esperando." start={vEnd + 30} stagger={4} size={46} weight={700} align="left" color="#F6EFE2" />
          </div>
          <div style={{ marginTop: 20, opacity: sp(frame, vEnd + 60) }}><Pill size={32}>sonorbooks.com</Pill></div>
        </div>
      </div>
      {frame > f0 && <Butterfly x={720 + Math.sin(frame / 30) * 60} y={250 + Math.cos(frame / 24) * 30} size={54} seed="out2" glow={0.6} opacity={rampOut(frame, f0, f0 + 20) * (1 - ramp(frame, vEnd + 10, vEnd + 30))} />}
      <Sfx name="hdl_flutter" at={f0 + 4} volume={0.6} />
      <Sfx name="ui_pop" at={fCom - 4} volume={0.6} />
      <Sfx name="logo_sting" at={vEnd + 22} volume={0.9} />
    </AbsoluteFill>
  );
};

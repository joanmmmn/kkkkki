import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, Cam, color, CoverIcon, Fact, FearMeter, font, Grain, HANDF, HoursBar, KR, KR_DEEP, MiniIcon, NEVA, OCHRE, OLDGOLD, ramp, rampOut, shadow, SkStage, WAX } from './kit';
import { Handwrite, PaperBG } from './Hook';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 04 · Cuatro puertas de entrada (J20–J31) y «¿Poco tiempo?» (J32).
// Cada puerta: A) la puerta se abre y sale el libro; B) viñeta ilustrada; C) tarjeta con duración, narrador y dónde
// escucharlo (fichas de SonorBooks España, 19/10/2026).
// ————————————————————————————————————————————————————————————————

type Clock = ReturnType<typeof sceneClock>;
const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

// Chips narrativos abajo a la izquierda (palabras clave de la sinopsis, aparecen con la voz).
const StoryChips: React.FC<{ items: { label: string; at: number; red?: boolean; gold?: boolean }[]; dark?: boolean; until?: number }> = ({ items, dark = true, until }) => {
  const frame = useCurrentFrame();
  const o = until !== undefined ? ramp(frame, until - 8, until + 4) : 0;
  return (
    <div style={{ position: 'absolute', left: 90, bottom: 70, display: 'flex', gap: 16, flexWrap: 'wrap', width: 1740, opacity: 1 - o }}>
      {items.map((it, i) => {
        const s = sp(frame, it.at - 2, 15, 200);
        if (frame < it.at - 3) return null;
        return (
          <div key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, padding: '13px 28px', borderRadius: 999, whiteSpace: 'nowrap',
            background: it.red ? KR : it.gold ? '#E9C877' : dark ? 'rgba(8,10,14,0.72)' : '#fff', color: it.red ? '#fff' : it.gold ? color.ink : dark ? '#fff' : color.ink,
            border: it.red || it.gold ? 'none' : dark ? '1px solid rgba(255,255,255,0.16)' : `1px solid ${color.line}`,
            opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${0.9 + 0.1 * s})`, boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.35)' : shadow.soft }}>
            {it.label}
          </div>
        );
      })}
    </div>
  );
};

// Siluetas planas: hombre (con gorra o chistera) y mujer (vestido largo y chal).
const Man: React.FC<{ h: number; c?: string; hat?: 'cap' | 'top' | 'none'; hunch?: number }> = ({ h, c = '#14161C', hat = 'cap', hunch = 0 }) => {
  const w = h * 0.42;
  return (
    <svg width={w} height={h} viewBox="0 0 42 100" style={{ display: 'block', overflow: 'visible' }}>
      <g transform={`rotate(${hunch * 14} 21 60)`}>
        <circle cx="21" cy={13 + hunch * 4} r="8.5" fill={c} />
        {hat === 'cap' && <path d={`M11 ${10 + hunch * 4} Q21 ${0 + hunch * 4} 31 ${10 + hunch * 4} L34 ${12 + hunch * 4} L10 ${12 + hunch * 4}Z`} fill={c} />}
        {hat === 'top' && <><rect x="14" y={-6 + hunch * 4} width="14" height="14" fill={c} /><rect x="10" y={7 + hunch * 4} width="22" height="3" fill={c} /></>}
        <path d="M6 100 L8 48 Q9 26 21 26 Q33 26 34 48 L36 100Z" fill={c} />
      </g>
    </svg>
  );
};
const Woman: React.FC<{ h: number; c?: string }> = ({ h, c = '#14161C' }) => {
  const w = h * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 50 100" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx="25" cy="13" r="8" fill={c} />
      <path d="M16 12 Q25 -2 34 12 L34 22 Q25 17 16 22Z" fill={c} />
      <path d="M14 30 Q25 22 36 30 L38 52 L48 100 L2 100 L12 52Z" fill={c} />
    </svg>
  );
};

// ———————————————— Puerta y tarjeta del libro ————————————————

type DoorCfg = {
  sceneId: string; n: number; book: string; kicker: string; headline: string; voA: string; voB: string; titleWord: string;
  cStart: (c: Clock) => number; hoursAt: (c: Clock) => number; hoursSub?: string; narrator?: string; extra?: { label: string; sub?: string; icon: React.ReactNode; at: (c: Clock) => number; accent?: string };
  quote?: { text: string; at: (c: Clock) => number };
  Vignette: React.FC<{ c: Clock; from: number; to: number }>;
};

const DoorCard: React.FC<{ cfg: DoorCfg; c: Clock; mode: 'intro' | 'facts'; from: number }> = ({ cfg, c, mode, from }) => {
  const frame = useCurrentFrame();
  const b = BOOKS[cfg.book];
  const fTitle = c.at(cfg.voA, cfg.titleWord);
  const intro = mode === 'intro';
  const open = intro ? ramp(frame, fTitle - 16, fTitle + 14, easeInOut) : 1;
  const bookOut = intro ? sp(frame, fTitle - 2, 15, 120) : 1;
  const ry = intro ? interpolate(frame, [fTitle - 4, fTitle + 60, fTitle + 200], [-60, -18, -10], { ...clamp, easing: easeOut }) : -14 + Math.sin(frame / 50) * 4;
  const doorIn = intro ? sp(frame, 2, 18, 140) : 1;
  const hoursAt = cfg.hoursAt(c);
  return (
    <AbsoluteFill>
      {/* Marco de la puerta */}
      <div style={{ position: 'absolute', left: 300, top: 150, width: 520, height: 780, opacity: doorIn, transform: `translateY(${(1 - doorIn) * 60}px)` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '260px 260px 18px 18px', background: '#1A1410', boxShadow: 'inset 0 0 0 16px #2C221B, 0 40px 80px rgba(16,16,16,0.25)' }} />
        <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 0, borderRadius: '244px 244px 6px 6px', overflow: 'hidden',
          background: `radial-gradient(ellipse at 50% 60%, rgba(255,214,120,${0.85 * open}) 0%, rgba(255,180,60,${0.35 * open}) 45%, rgba(26,20,16,1) 80%)` }} />
        <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 0, perspective: 1600 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '244px 244px 6px 6px', background: `linear-gradient(90deg, ${b.bg} 0%, ${b.bg} 70%, rgba(0,0,0,0.35) 100%)`,
            transformOrigin: 'left center', transform: `rotateY(${-104 * open}deg)`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25)', opacity: open > 0.97 ? 0 : 1 }}>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 120, height: 220, borderRadius: '160px 160px 8px 8px', border: `3px solid ${b.accent}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 50, right: 50, top: 400, height: 240, borderRadius: 8, border: `3px solid ${b.accent}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', right: 40, top: 420, width: 26, height: 26, borderRadius: '50%', background: b.accent }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -44, transform: 'translateX(-50%)', width: 88, height: 88, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, boxShadow: shadow.float }}>{cfg.n}</div>
      </div>
      {/* El libro */}
      <div style={{ position: 'absolute', left: 560 - 170, top: 220, transform: `translateY(${(1 - bookOut) * 70}px) scale(${0.55 + 0.45 * bookOut})`, opacity: Math.min(1, bookOut * 1.6), transformOrigin: '50% 60%' }}>
        <Book3D b={b} w={340} h={510} d={58} ry={ry} rx={3} />
      </div>
      {/* Texto */}
      <div style={{ position: 'absolute', left: 980, top: 0, height: 1080, width: 880, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Kicker at={intro ? fTitle - 4 : from + 2} text={`Puerta ${cfg.n} · ${cfg.kicker}`} />
        <div style={{ position: 'relative' }}>
          {intro && frame < fTitle + 6 && (
            <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: color.muted, textTransform: 'uppercase', marginBottom: 14, opacity: rampOut(frame, 4, 16) * (1 - ramp(frame, fTitle - 12, fTitle - 2)) }}>Puerta {cfg.n}</div>
              <MaskTitle text={cfg.headline} at={6} size={80} out={fTitle - 6} />
            </div>
          )}
          <MaskTitle text={b.title.length > 30 ? b.title.replace(' es ', '\nes ') : b.title} at={intro ? fTitle - 4 : from + 4} size={b.title.length > 30 ? 72 : b.title.length > 12 ? 96 : 120} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 34, flexWrap: 'wrap', maxWidth: 880 }}>
          <Fact at={intro ? fTitle + 14 : from + 10} icon={<MiniIcon kind="cal" size={30} />} label={String(b.year)} size={38} />
          {!intro && <Fact at={hoursAt} icon={<MiniIcon kind="clock" size={30} />} label={b.hours ?? ''} sub={cfg.hoursSub ?? 'audiolibro en español'} size={38} />}
          {!intro && cfg.narrator && <Fact at={hoursAt + 8} icon={<MiniIcon kind="mic" size={30} />} label={cfg.narrator} sub="la narración que recomendamos" size={38} />}
          {!intro && cfg.extra && <Fact at={cfg.extra.at(c)} icon={cfg.extra.icon} label={cfg.extra.label} sub={cfg.extra.sub} size={38} accent={cfg.extra.accent} />}
        </div>
        {!intro && cfg.quote && (
          <div style={{ marginTop: 40, fontFamily: font.serif, fontStyle: 'italic', fontSize: 46, lineHeight: 1.2, color: color.ink2, maxWidth: 800, opacity: rampOut(frame, cfg.quote.at(c), cfg.quote.at(c) + 16), transform: `translateY(${(1 - rampOut(frame, cfg.quote.at(c), cfg.quote.at(c) + 16)) * 12}px)` }}>{cfg.quote.text}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const DoorScene: React.FC<{ cfg: DoorCfg }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  const c = sceneClock(cfg.sceneId);
  const fTitle = c.at(cfg.voA, cfg.titleWord);
  const fB = c.part(cfg.voB) - 4;
  const fC = cfg.cStart(c);
  const V = cfg.Vignette;
  const ab = ramp(frame, fB - 14, fB + 8);
  const bc = ramp(frame, fC - 12, fC + 6);
  return (
    <AbsoluteFill>
      {ab < 1 && (
        <AbsoluteFill style={{ opacity: 1 - ab }}>
          <SkStage>
            <Cam keys={[{ f: 0, s: 1.02, x: 0, y: 0 }, { f: fB - 16, s: 1.06, x: 10, y: 0 }, { f: fB + 8, s: 2.6, x: (960 - 560) * 2.6, y: (540 - 560) * 2.6 }]}>
              <DoorCard cfg={cfg} c={c} mode="intro" from={0} />
            </Cam>
          </SkStage>
        </AbsoluteFill>
      )}
      {ab > 0 && bc < 1 && (
        <AbsoluteFill style={{ opacity: ab * (1 - bc), transform: `scale(${1.12 - 0.12 * ab - 0.05 * bc})`, filter: bc > 0.01 ? `blur(${bc * 8}px)` : undefined }}>
          <V c={c} from={fB} to={fC} />
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 100%)', pointerEvents: 'none' }} />
          <Grain seed={Math.floor(frame / 2)} opacity={0.07} />
        </AbsoluteFill>
      )}
      {bc > 0 && (
        <AbsoluteFill style={{ opacity: bc, transform: `scale(${1.04 - 0.04 * bc})` }}>
          <SkStage>
            <Cam keys={[{ f: fC - 12, s: 1.03, x: 0, y: 0 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
              <DoorCard cfg={cfg} c={c} mode="facts" from={fC} />
            </Cam>
          </SkStage>
        </AbsoluteFill>
      )}
      <Sfx name="sk_door" at={fTitle - 16} volume={0.7} />
      <Sfx name="shimmer" at={fTitle - 2} volume={0.5} />
      <Sfx name="whoosh_deep" at={fB - 4} volume={0.6} />
      <Sfx name="whoosh_soft" at={fC - 8} volume={0.55} />
      <Sfx name="ui_pop" at={cfg.hoursAt(c) + 1} volume={0.6} />
      {cfg.narrator && <Sfx name="ui_pop" at={cfg.hoursAt(c) + 9} volume={0.5} />}
      {cfg.extra && <Sfx name="ui_pop" at={cfg.extra.at(c) + 1} volume={0.5} />}
    </AbsoluteFill>
  );
};

// ———————————————— Viñetas ————————————————

// Pieza de ajedrez (SVG): rey (oscuro) o dama (clara).
const Piece: React.FC<{ kind: 'king' | 'queen'; size: number; c: string; edge: string }> = ({ kind, size, c, edge }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 60 96" style={{ display: 'block', overflow: 'visible' }}>
    <ellipse cx="30" cy="90" rx="24" ry="6" fill="rgba(0,0,0,0.35)" />
    <path d="M8 88 Q8 80 14 78 L46 78 Q52 80 52 88Z" fill={c} stroke={edge} strokeWidth="2" />
    <path d="M17 78 Q20 56 22 44 L38 44 Q40 56 43 78Z" fill={c} stroke={edge} strokeWidth="2" />
    <path d="M16 44 Q30 38 44 44 L40 36 L20 36Z" fill={c} stroke={edge} strokeWidth="2" />
    {kind === 'king' ? (
      <>
        <path d="M20 36 Q18 22 30 20 Q42 22 40 36Z" fill={c} stroke={edge} strokeWidth="2" />
        <path d="M30 4 V18 M24 10 H36" stroke={edge} strokeWidth="4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M20 36 L16 18 L24 26 L30 14 L36 26 L44 18 L40 36Z" fill={c} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="30" cy="11" r="3.5" fill={c} stroke={edge} strokeWidth="2" />
      </>
    )}
  </svg>
);
const RingSvg: React.FC<{ size: number; crack?: number }> = ({ size, crack = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
    <defs><linearGradient id={`rgd${size}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.45" stopColor="#E3B85A" /><stop offset="1" stopColor="#8C6A2C" /></linearGradient></defs>
    <circle cx="50" cy="50" r="38" fill="none" stroke={`url(#rgd${size})`} strokeWidth="10" strokeDasharray={crack > 0 ? `${200 - 30 * crack} ${30 * crack + 6}` : undefined} />
  </svg>
);

// 1 · Diario de un seductor: un tablero de ajedrez en penumbra; Johannes (rey) y Cordelia (dama); el diario al lado.
// Se comprometen (dos anillos) y luego ella rompe (un anillo se abre). «¿Te suena?»: vuelve la nota del gancho.
const VDiario: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const f = {
    yoj: c.at('J21', 'Johannes'), cord: c.at('J21', 'Cordelia'), ajed: c.at('J21', 'ajedrez'), anota: c.at('J21', 'anota'), diario: c.at('J21', 'diario'),
    comp: c.at('J21', 'comprometan'), rompa: c.at('J21', 'rompa'), suena: c.at('J21', 'suena?'),
  };
  const board = sp(frame, f.yoj - 10, 18, 120);
  const kingIn = sp(frame, f.yoj, 13, 170);
  const queenIn = sp(frame, f.cord, 13, 170);
  const move = ramp(frame, f.ajed - 4, f.ajed + 18, easeInOut);
  const diary = sp(frame, f.anota - 6, 16, 140);
  const rings = sp(frame, f.comp - 4, 13, 160);
  const crack = ramp(frame, f.rompa - 2, f.rompa + 14);
  const callback = sp(frame, f.suena - 8, 15, 150);
  const cell = 92;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 55%, #4A2230 0%, #24121A 60%, #12090D 100%)' }}>
      {/* tablero en perspectiva */}
      <div style={{ position: 'absolute', left: 260, top: 300, width: cell * 8, height: cell * 8, transform: `perspective(1600px) rotateX(${58 - 4 * board}deg) rotateZ(${-10 + 4 * board}deg) scale(${0.9 + 0.1 * board})`, opacity: board, transformOrigin: '50% 60%' }}>
        {Array.from({ length: 64 }).map((_, i) => {
          const r = Math.floor(i / 8), k = i % 8;
          return <div key={i} style={{ position: 'absolute', left: k * cell, top: r * cell, width: cell, height: cell, background: (r + k) % 2 ? '#3A2026' : '#C9B79A' }} />;
        })}
        <div style={{ position: 'absolute', inset: -14, border: '14px solid #2A160E', borderRadius: 6 }} />
      </div>
      {/* piezas (de pie, sobre el tablero) */}
      <div style={{ position: 'absolute', left: 430 + move * 150, top: 420 - move * 40, opacity: kingIn, transform: `translateY(${(1 - kingIn) * -60}px)` }}>
        <Piece kind="king" size={120} c="#1A1214" edge="#8C6A2C" />
        <div style={{ textAlign: 'center', marginTop: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#F3EAD8' }}>Johannes</div>
      </div>
      <div style={{ position: 'absolute', left: 760, top: 380, opacity: queenIn, transform: `translateY(${(1 - queenIn) * -60}px)` }}>
        <Piece kind="queen" size={110} c="#F4ECDA" edge="#8C6A2C" />
        <div style={{ textAlign: 'center', marginTop: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#F3EAD8' }}>Cordelia</div>
      </div>
      {/* los anillos del compromiso */}
      {frame >= f.comp - 5 && (
        <div style={{ position: 'absolute', left: 560, top: 170, display: 'flex', opacity: rings, transform: `scale(${0.6 + 0.4 * rings})` }}>
          <div style={{ transform: `translateX(${crack * -60}px) rotate(${crack * -20}deg)` }}><RingSvg size={130} crack={crack} /></div>
          <div style={{ marginLeft: -40, transform: `translateX(${crack * 60}px)` }}><RingSvg size={130} /></div>
        </div>
      )}
      {/* el diario */}
      <div style={{ position: 'absolute', left: 1180, top: 210, width: 560, height: 680, transform: `translateX(${(1 - diary) * 700}px) rotate(${3 - (1 - diary) * 6}deg)`, boxShadow: '0 40px 80px rgba(0,0,0,0.5)', borderRadius: 6, overflow: 'hidden' }}>
        <PaperBG tone="#EFE5CF" />
        <div style={{ position: 'absolute', left: 50, top: 50, width: 460 }}>
          <Handwrite text="Cordelia" a={f.anota} b={f.anota + 16} size={78} />
          {/* renglones ilegibles (no se inventan frases del libro) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
            const at = k < 5 ? f.anota + 10 + k * 7 : k < 8 ? f.comp + (k - 5) * 7 : f.rompa + 2 + (k - 8) * 8;
            const w = ramp(frame, at, at + 14);
            return <div key={k} style={{ height: 9, marginTop: k === 0 ? 40 : k === 5 || k === 8 ? 52 : 34, width: `${(70 + ((k * 23) % 30)) * w}%`, background: k >= 8 ? 'rgba(158,27,34,0.55)' : k >= 5 ? 'rgba(23,58,51,0.5)' : 'rgba(58,46,34,0.42)', borderRadius: 5 }} />;
          })}
        </div>
      </div>
      {/* ¿Te suena? */}
      {frame >= f.suena - 9 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: `rgba(10,6,8,${0.6 * callback})` }}>
          <div style={{ position: 'relative', width: 900, height: 420, transform: `rotate(-2deg) scale(${0.85 + 0.15 * callback})`, opacity: callback, boxShadow: '0 40px 90px rgba(0,0,0,0.6)', borderRadius: 6, overflow: 'hidden' }}>
            <PaperBG />
            <div style={{ position: 'absolute', left: 60, top: 80, fontFamily: HANDF, fontSize: 92, color: '#2A2018', whiteSpace: 'nowrap' }}>Olvida a quien escribe esto</div>
            <div style={{ position: 'absolute', right: 70, bottom: 50 }}><RingSvg size={110} /></div>
            <div style={{ position: 'absolute', left: 60, bottom: 50, fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: 'rgba(42,32,24,0.6)' }}>COPENHAGUE · 1841</div>
          </div>
          <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 70, color: '#fff', opacity: callback }}>¿Te suena?</div>
        </AbsoluteFill>
      )}
      <StoryChips items={[{ label: 'Johannes, un seductor calculador', at: f.yoj }, { label: 'Cordelia', at: f.cord }, { label: 'Lo anota todo', at: f.anota }, { label: 'Hace que sea ella quien rompa', at: f.rompa, red: true }]} until={f.suena - 8} />
      <Sfx name="card_flip" at={f.yoj} volume={0.5} />
      <Sfx name="tick_soft" at={f.ajed + 16} volume={0.8} />
      <Sfx name="page_turn" at={f.anota - 6} volume={0.6} />
      <Sfx name="dk_quill" at={f.anota} volume={0.5} />
      <Sfx name="kk_ring" at={f.comp} volume={0.5} />
      <Sfx name="impact" at={f.rompa + 2} volume={0.35} />
      <Sfx name="whoosh_deep" at={f.suena - 8} volume={0.5} />
    </AbsoluteFill>
  );
};

// Paisaje del monte al amanecer (Temor y temblor).
const Moriah: React.FC<{ t: number; walk: number }> = ({ t, walk }) => {
  const path: [number, number][] = [[260, 1000], [560, 900], [760, 820], [900, 700], [1060, 610], [1240, 470], [1360, 400]];
  const at = (u: number) => {
    const n = path.length - 1;
    const x = Math.min(n - 1e-6, Math.max(0, u * n));
    const i = Math.floor(x), k = x - i;
    return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k];
  };
  const [px, py] = at(walk);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C2638" /><stop offset="0.55" stopColor="#8A6A70" /><stop offset="0.8" stopColor="#E8B37A" /></linearGradient>
        <radialGradient id="mo-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="rgba(255,226,170,0.9)" /><stop offset="1" stopColor="rgba(255,200,140,0)" /></radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#mo-sky)" />
      <circle cx={1500} cy={760 - t * 0.15} r={360} fill="url(#mo-sun)" />
      <path d="M0 760 Q300 640 620 700 T1300 620 T1920 680 V1080 H0Z" fill="#4A4A5E" />
      <path d="M0 1080 L0 900 Q500 860 900 700 Q1200 420 1380 380 Q1520 400 1640 560 Q1780 720 1920 740 V1080Z" fill="#2E2C38" />
      <polyline points={path.map((p) => p.join(',')).join(' ')} fill="none" stroke="rgba(232,179,122,0.55)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      {/* padre e hijo con la leña */}
      <g transform={`translate(${px} ${py})`}>
        <g transform="translate(-20 0)"><circle cx="0" cy="-92" r="11" fill="#14121A" /><path d="M-13 -80 L13 -80 L15 -30 L8 0 L-8 0 L-15 -30Z" fill="#14121A" /><path d="M14 -76 L30 -10" stroke="#14121A" strokeWidth="5" strokeLinecap="round" /></g>
        <g transform="translate(26 4)"><circle cx="0" cy="-62" r="8" fill="#14121A" /><path d="M-9 -54 L9 -54 L10 -20 L6 0 L-6 0 L-10 -20Z" fill="#14121A" /><path d="M-14 -52 L18 -64" stroke="#5A3A22" strokeWidth="7" strokeLinecap="round" /></g>
      </g>
      {/* el carnero entre los matorrales, arriba */}
      <g transform="translate(1440 392)">
        <ellipse cx="0" cy="0" rx="26" ry="15" fill="#14121A" />
        <circle cx="26" cy="-10" r="9" fill="#14121A" />
        <path d="M28 -16 a8 8 0 1 1 -8 -6" stroke="#14121A" strokeWidth="4" fill="none" />
        {[-18, -6, 6, 16].map((x) => <rect key={x} x={x} y="10" width="4" height="16" fill="#14121A" />)}
        {[-60, -40, -20, 0, 20, 40].map((x) => <circle key={x} cx={x} cy="26" r="14" fill="#1C1A22" />)}
      </g>
    </svg>
  );
};

// 2 · Temor y temblor: el camino del monte; la firma de Johannes de Silentio; la escena contada de cuatro maneras;
// la pregunta: ¿hombre de fe o asesino?
const VTemor: React.FC<{ c: Clock; from: number; to: number }> = ({ c, from }) => {
  const frame = useCurrentFrame();
  const f = {
    dios: c.at('J24', 'Dios'), abr: c.at('J24', 'Abraham'), isaac: c.at('J24', 'Isaac,'), cam: c.at('J24', 'camino'), firma: c.at('J24', 'firma'),
    cuatro: c.at('J24', 'cuatro'), preg: c.at('J24', 'preguntarse'), fe: c.at('J24', 'fe'), asesino: c.at('J24', 'asesino?'),
  };
  const walk = ramp(frame, f.cam - 10, f.cuatro + 40, (t) => t);
  const sig = sp(frame, f.firma - 4, 15, 150);
  const panels = ramp(frame, f.cuatro - 6, f.cuatro + 10);
  const panelsOut = ramp(frame, f.preg - 10, f.preg + 4);
  const scale = ramp(frame, f.preg - 4, f.preg + 12);
  const tip = Math.sin((frame - f.fe) / 9) * 10 * ramp(frame, f.fe - 6, f.fe + 6) * (1 - ramp(frame, f.asesino + 10, f.asesino + 40));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.06 - 0.04 * ramp(frame, from, from + 300, (t) => t)})` }}>
        <Moriah t={frame - from} walk={walk} />
      </AbsoluteFill>
      {/* la firma */}
      {frame >= f.firma - 5 && (
        <div style={{ position: 'absolute', right: 120, top: 120, opacity: sig * (1 - scale), transform: `translateY(${(1 - sig) * -20}px) rotate(2deg)` }}>
          <div style={{ background: '#F1E8D4', borderRadius: 8, padding: '16px 36px 22px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: 'rgba(42,32,24,0.6)', textTransform: 'uppercase' }}>lo firma</div>
            <div style={{ fontFamily: HANDF, fontSize: 76, color: '#2A2018', whiteSpace: 'nowrap' }}>Johannes de Silentio</div>
          </div>
        </div>
      )}
      {/* cuatro maneras */}
      {frame >= f.cuatro - 7 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', gap: 26, opacity: panels * (1 - panelsOut) }}>
          {[0, 1, 2, 3].map((i) => {
            const s = sp(frame, f.cuatro - 4 + i * 5, 14, 170);
            const tint = ['#E8B37A', '#B9A3C9', '#9FB8C9', '#D9897A'][i];
            return (
              <div key={i} style={{ width: 330, height: 220, borderRadius: 14, overflow: 'hidden', background: `linear-gradient(180deg, #2E2C38, ${tint})`, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', border: '4px solid #F1E8D4', opacity: s, transform: `translateY(${(1 - s) * -40}px) rotate(${(i - 1.5) * 2}deg)`, position: 'relative' }}>
                <svg width={330} height={220} viewBox="0 0 330 220" style={{ position: 'absolute', left: 0, top: 0 }}>
                  <path d={`M0 220 L0 ${170 - i * 6} Q160 ${120 - i * 14} 330 ${150 + i * 8} V220Z`} fill="#1C1A22" />
                  <g transform={`translate(${120 + i * 26} ${150 - i * 4})`}>
                    <circle cx="0" cy="-48" r="7" fill="#0E0C12" /><path d="M-8 -40 L8 -40 L9 -12 L5 0 L-5 0 L-9 -12Z" fill="#0E0C12" />
                    <g transform={`translate(${24 + i * 6} 2)`}><circle cx="0" cy="-34" r="5" fill="#0E0C12" /><path d="M-6 -28 L6 -28 L6 -8 L3 0 L-3 0 L-6 -8Z" fill="#0E0C12" /></g>
                  </g>
                </svg>
                <div style={{ position: 'absolute', left: 14, top: 10, width: 48, height: 48, borderRadius: '50%', background: '#F1E8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink }}>{i + 1}</div>
              </div>
            );
          })}
        </div>
      )}
      {/* la pregunta: balanza */}
      {scale > 0.01 && (
        <AbsoluteFill style={{ background: `rgba(10,10,16,${0.55 * scale})`, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: scale, transform: `scale(${0.9 + 0.1 * scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={900} height={340} viewBox="0 0 900 340" style={{ overflow: 'visible' }}>
              <g stroke="#E9C877" strokeWidth={8} strokeLinecap="round" fill="none">
                <path d="M450 40 V320 M360 320 H540" />
                <g transform={`rotate(${tip} 450 60)`}>
                  <path d="M150 60 H750" />
                  <path d="M150 60 L100 170 M150 60 L200 170 M750 60 L700 170 M750 60 L800 170" strokeWidth={4} />
                  <path d="M80 170 Q150 205 220 170Z M680 170 Q750 205 820 170Z" fill="#E9C877" />
                </g>
              </g>
            </svg>
            <div style={{ display: 'flex', gap: 260, marginTop: -40 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: '#fff', opacity: rampOut(frame, f.fe - 6, f.fe + 8), transform: `translateY(${tip * 2}px)` }}>¿Hombre de fe…</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: '#FF9C8C', opacity: rampOut(frame, f.asesino - 6, f.asesino + 8), transform: `translateY(${-tip * 2}px)` }}>…o asesino?</div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <StoryChips items={[{ label: 'Dios pone a prueba a Abraham', at: f.dios }, { label: 'Su hijo, Isaac', at: f.isaac }, { label: 'Se pone en camino', at: f.cam }]} until={f.cuatro - 6} />
      <Sfx name="kk_heath" at={f.dios - 6} volume={0.4} dur={f.preg - f.dios} fade={20} />
      <Sfx name="dk_quill" at={f.firma} volume={0.5} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="card_flip" at={f.cuatro - 4 + i * 5} volume={0.45} />)}
      <Sfx name="whoosh_deep" at={f.preg - 6} volume={0.5} />
      <Sfx name="hit_soft" at={f.asesino} volume={0.5} />
    </AbsoluteFill>
  );
};

// 3 · La pureza de corazón: portada interior del libro, firmada por él; «para preparar la confesión»; una sola cosa, el bien,
// y no por miedo al castigo ni por el premio (tachados).
const VPureza: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const f = {
    seud: c.at('J27', 'seudónimo'), firma: c.at('J27', 'firma'), disc: c.at('J27', 'discurso'), conf: c.at('J27', 'confesión'), idea: c.at('J27', 'idea'),
    tit: c.at('J27', 'título'), bien: c.at('J27', 'bien'), miedo: c.at('J27', 'miedo'), premio: c.at('J27', 'premio.'),
  };
  const page = sp(frame, 0, 18, 110);
  const toIdea = ramp(frame, f.tit - 6, f.tit + 12);
  const strike = (at: number) => ramp(frame, at + 6, at + 18);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #3A3530 0%, #1E1A16 70%)' }}>
      <div style={{ position: 'absolute', left: 560, top: 110, width: 800, height: 880, transform: `translateY(${(1 - page) * 400}px) translateX(${toIdea * -380}px) scale(${1 - 0.25 * toIdea}) rotate(-1deg)`, transformOrigin: '50% 30%', boxShadow: '0 40px 90px rgba(0,0,0,0.55)', borderRadius: 4, overflow: 'hidden' }}>
        <PaperBG tone="#F1E8D4" />
        <div style={{ position: 'absolute', left: 60, right: 60, top: 110, textAlign: 'center', fontFamily: font.serif, fontSize: 64, lineHeight: 1.15, color: '#2A2018' }}>La pureza de corazón<br /><i>es querer una sola cosa</i></div>
        <div style={{ position: 'absolute', left: 60, right: 60, top: 330, textAlign: 'center', fontFamily: font.serif, fontStyle: 'italic', fontSize: 34, color: 'rgba(42,32,24,0.7)', opacity: rampOut(frame, f.conf - 6, f.conf + 10) }}>Discurso para la ocasión de una confesión</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: 'rgba(42,32,24,0.5)', opacity: rampOut(frame, f.firma - 8, f.firma) }}>POR</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 510, display: 'flex', justifyContent: 'center' }}>
          <Handwrite text="S. Kierkegaard" a={f.firma - 2} b={f.firma + 22} size={110} colorInk={KR_DEEP} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: font.serif, fontSize: 36, color: 'rgba(42,32,24,0.6)' }}>Copenhague, 1847</div>
      </div>
      {/* «sin seudónimo» */}
      {frame >= f.seud - 4 && toIdea < 1 && (
        <div style={{ position: 'absolute', left: 1400, top: 300, opacity: rampOut(frame, f.seud - 2, f.seud + 10) * (1 - toIdea), transform: 'rotate(4deg)' }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, background: color.yellow, padding: '10px 28px 14px', borderRadius: 14 }}>Sin seudónimo</span>
        </div>
      )}
      {/* la idea */}
      {toIdea > 0.01 && (
        <div style={{ position: 'absolute', left: 900, top: 200, width: 880, opacity: toIdea }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ fontFamily: font.serif, fontSize: 260, lineHeight: 0.9, color: '#F1D58C' }}>1</div>
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: '#fff', lineHeight: 1.05 }}>Querer una sola cosa:</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 72, color: '#F1D58C', opacity: rampOut(frame, f.bien - 4, f.bien + 10) }}>el bien</div>
            </div>
          </div>
          <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', gap: 22 }}>
            {[{ t: 'por miedo al castigo', at: f.miedo }, { t: 'por el premio', at: f.premio }].map((q, i) => (
              <div key={i} style={{ position: 'relative', alignSelf: 'flex-start', fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 30px 14px', borderRadius: 999, opacity: rampOut(frame, q.at - 6, q.at + 6) }}>
                No {q.t}
                <div style={{ position: 'absolute', left: 20, right: 20, top: '52%', height: 6, background: WAX, transform: `scaleX(${strike(q.at)})`, transformOrigin: 'left', borderRadius: 3 }} />
              </div>
            ))}
          </div>
        </div>
      )}
      <Sfx name="page_turn" at={2} volume={0.5} />
      <Sfx name="ui_pop" at={f.seud} volume={0.5} />
      <Sfx name="dk_quill" at={f.firma} volume={0.6} />
      <Sfx name="whoosh_soft" at={f.tit - 6} volume={0.4} />
      <Sfx name="shimmer" at={f.bien} volume={0.35} />
      <Sfx name="pencil_strike" at={f.miedo + 6} volume={0.5} />
      <Sfx name="pencil_strike" at={f.premio + 6} volume={0.5} />
    </AbsoluteFill>
  );
};

// 4 · La enfermedad mortal: fachada de noche con muchas ventanas; la desesperación aparece en casi todas, también en la de
// la fiesta (quien no sabe que la tiene); después, la primera página y su dificultad.
// Traducción propia del danés («Mennesket er Aand. Men hvad er Aand? Aand er Selvet…»), Primera parte, A.
const OPENING = 'El ser humano es espíritu. Pero ¿qué es el espíritu? El espíritu es el yo. Pero ¿qué es el yo? El yo es una relación que se relaciona consigo misma, o es, en la relación, el hecho de que la relación se relacione consigo misma; el yo no es la relación, sino que la relación se relacione consigo misma.';
const VEnfermedad: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const f = {
    des: c.at('J30', 'desesperación'), todas: c.at('J30', 'todas'), incl: c.at('J30', 'incluso'), sabe: c.at('J30', 'sabe'), prim: c.at('J30', 'primeras'),
    dif: c.at('J30', 'difíciles'), rind: c.at('J30', 'rindas'),
  };
  const toPage = ramp(frame, f.prim - 10, f.prim + 8);
  const cols = 9, rows = 5;
  return (
    <AbsoluteFill style={{ background: '#0B0E14' }}>
      <AbsoluteFill style={{ opacity: 1 - toPage }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={160} y={160} width={1600} height={860} fill="#1A2029" />
          {Array.from({ length: cols * rows }).map((_, i) => {
            const r = Math.floor(i / cols), k = i % cols;
            const x = 210 + k * 172, y = 210 + r * 160;
            const on = ramp(frame, f.todas - 6 + ((i * 7) % 23), f.todas + 6 + ((i * 7) % 23));
            const party = i === 22;
            const lit = party ? ramp(frame, f.incl - 8, f.incl + 4) : on;
            return (
              <g key={i}>
                <rect x={x} y={y} width={100} height={120} fill={party ? `rgba(255,214,120,${0.25 + 0.75 * lit})` : `rgba(175,200,235,${0.08 + 0.55 * lit})`} />
                {lit > 0.2 && !party && <path d={`M${x + 50} ${y + 120} v-46 m-10 -16 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M${x + 36} ${y + 120} l4 -42 h20 l4 42`} fill={`rgba(10,14,20,${0.8 * lit})`} />}
                {party && lit > 0.2 && (
                  <g fill="rgba(60,30,10,0.85)">
                    <circle cx={x + 30} cy={y + 64} r={9} /><rect x={x + 22} y={y + 74} width={16} height={46} />
                    <circle cx={x + 70} cy={y + 60} r={9} /><rect x={x + 62} y={y + 70} width={16} height={50} />
                    <path d={`M${x + 38} ${y + 80} L${x + 54} ${y + 66}`} stroke="rgba(60,30,10,0.85)" strokeWidth={5} />
                  </g>
                )}
              </g>
            );
          })}
          <rect x={160} y={160} width={1600} height={860} fill="none" stroke="#2A3240" strokeWidth={10} />
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center' }}>
          {frame >= f.des - 4 && <MaskTitle text="La desesperación" at={f.des - 2} size={92} align="center" color="#fff" />}
        </div>
        {frame >= f.incl - 4 && (
          <div style={{ position: 'absolute', left: 1180, top: 560, opacity: rampOut(frame, f.incl - 2, f.incl + 10) }}>
            <svg width={120} height={90} style={{ position: 'absolute', left: -150, top: 30 }}><path d="M110 20 Q40 10 10 70" stroke="#F1D58C" strokeWidth={5} fill="none" /><path d="M10 70 l4 -22 M10 70 l20 -10" stroke="#F1D58C" strokeWidth={5} /></svg>
            <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 48, color: '#F1D58C', maxWidth: 560, lineHeight: 1.15 }}>incluso en quien no sabe que la tiene</div>
          </div>
        )}
      </AbsoluteFill>
      {toPage > 0.01 && (
        <AbsoluteFill style={{ opacity: toPage }}>
          <div style={{ position: 'absolute', left: 300, top: 150, width: 1320, height: 700, transform: `rotate(-1deg) translateY(${(1 - toPage) * 200}px)`, boxShadow: '0 40px 90px rgba(0,0,0,0.6)', borderRadius: 4, overflow: 'hidden' }}>
            <PaperBG tone="#EFE6D0" />
            <div style={{ position: 'absolute', left: 90, right: 90, top: 70, fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: 'rgba(42,32,24,0.55)', textTransform: 'uppercase' }}>La enfermedad mortal · así empieza la primera parte</div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 140, fontFamily: font.serif, fontSize: 52, lineHeight: 1.34, color: '#2A2018', textAlign: 'justify' }}>{OPENING}</div>
          </div>
          <div style={{ position: 'absolute', left: 300, top: 900, opacity: rampOut(frame, f.dif - 6, f.dif + 6) }}>
            <FearMeter level={3} at={f.dif} label="Dificultad para empezar" dark />
          </div>
          {frame >= f.rind - 6 && (
            <div style={{ position: 'absolute', right: 300, top: 890, opacity: rampOut(frame, f.rind - 4, f.rind + 10), transform: 'rotate(-2deg)' }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, background: color.yellow, padding: '10px 28px 14px', borderRadius: 14 }}>No te rindas ahí</span>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Sfx name="kk_room" at={0} volume={0.4} dur={f.prim} fade={20} />
      <Sfx name="shimmer" at={f.todas} volume={0.35} />
      <Sfx name="focus" at={f.incl} volume={0.5} />
      <Sfx name="page_turn" at={f.prim - 8} volume={0.6} />
      <Sfx name="ui_pop" at={f.rind} volume={0.5} />
      {OCHRE && NEVA && OLDGOLD && null}
    </AbsoluteFill>
  );
};

// ———————————————— Escenas ————————————————

const wave = <svg width="30" height="30" viewBox="0 0 40 40"><g fill={color.ink}>{[6, 12, 18, 24, 30].map((x, i) => { const h = [8, 18, 26, 14, 20][i]; return <rect key={i} x={x} y={20 - h / 2} width="4" height={h} rx="2" />; })}</g></svg>;
const maskIcon = <svg width="30" height="30" viewBox="0 0 24 24"><path d="M2.5 9.5c3-1.5 6-1.5 9.5.5 3.5-2 6.5-2 9.5-.5-.3 4-2.6 6.5-5.5 6.5-2 0-3-1.5-4-2.5-1 1-2 2.5-4 2.5-2.9 0-5.2-2.5-5.5-6.5z" fill="none" stroke={color.ink} strokeWidth="1.8" /></svg>;

export const P1: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P1', n: 1, book: 'diario', kicker: 'Para empezar por una historia', headline: '¿Empezar por una historia?', voA: 'J20', voB: 'J21', titleWord: 'Diario',
    cStart: (c) => c.part('J22') - 4, hoursAt: (c) => c.at('J22', 'seis') - 4, narrator: 'Raúl Gutiérrez',
    extra: { label: 'Gratis', sub: 'en El Libro Total', icon: <MiniIcon kind="head" size={30} c={color.ink} />, at: (c) => c.at('J22', 'gratis') - 4, accent: '#9FD8B4' },
    quote: { text: 'No es un manual de seducción: es el retrato de la vida estética.', at: (c) => c.part('J22') + 4 },
    Vignette: VDiario,
  }} />
);
export const P2: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P2', n: 2, book: 'temor', kicker: 'La puerta clásica', headline: '¿La puerta clásica?', voA: 'J23', voB: 'J24', titleWord: 'Temor',
    cStart: (c) => c.part('J25') - 4, hoursAt: (c) => c.at('J25', 'cinco') - 4, hoursSub: 'dos grabaciones en español',
    quote: { text: 'Escucha las muestras y elige la tuya.', at: (c) => c.at('J25', 'escucha') - 4 },
    Vignette: VTemor,
  }} />
);
export const P3: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P3', n: 3, book: 'pureza', kicker: 'Si buscas algo espiritual', headline: '¿Algo espiritual?', voA: 'J26', voB: 'J27', titleWord: 'pureza',
    cStart: (c) => c.part('J28') - 4, hoursAt: (c) => c.at('J28', 'siete') - 4,
    extra: { label: 'Voz digital', sub: 'la única versión, en ElevenReader', icon: wave, at: (c) => c.at('J28', 'digital') - 4, accent: '#9EC5E8' },
    Vignette: VPureza,
  }} />
);
export const P4: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P4', n: 4, book: 'enfermedad', kicker: 'Para ir al fondo', headline: '¿Ir al fondo?', voA: 'J29', voB: 'J30', titleWord: 'enfermedad',
    cStart: (c) => c.part('J31') - 4, hoursAt: (c) => c.at('J31', 'cinco') - 4, narrator: 'Geraldo Medina',
    extra: { label: 'Anti-Climacus', sub: 'el seudónimo que lo firma', icon: maskIcon, at: (c) => c.at('J31', 'Anticlímacus') - 2 },
    quote: { text: 'Según él, un seudónimo que estaba por encima de él mismo.', at: (c) => c.at('J31', 'seudónimo') - 2 },
    Vignette: VEnfermedad,
  }} />
);

// ——— CORTOS · J32 · ¿Poco tiempo? ———
export const Cortos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORTOS');
  const fNov = c.at('J32', '90');
  const fVida = c.at('J32', 'vida');
  const fHora = c.at('J32', 'hora');
  const fCien = c.at('J32', '100');
  const fMedia = c.at('J32', 'media', 1);
  const fFrases = c.at('J32', 'frases');
  const items = [
    { k: 'noventa', at: fNov, hours: 1.42, label: '1 h 25 min', sub: 'Su vida y sus ideas, de Paul Strathern · con Marco Lubián', subAt: fVida, valAt: fHora },
    { k: 'citas', at: fCien, hours: 0.54, label: '32 min', sub: 'Media hora con sus frases', subAt: fFrases, valAt: fMedia },
  ];
  const sw = sp(frame, 4, 14, 160);
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.03, x: 0, y: 0 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
        <div style={{ position: 'absolute', left: 220, top: 110, display: 'flex', alignItems: 'center', gap: 30 }}>
          <div style={{ transform: `scale(${sw}) rotate(${(1 - sw) * -40}deg)` }}>
            <svg width="110" height="110" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8.5" fill="#fff" stroke={color.ink} strokeWidth="1.8" /><path d="M12 13V8.5" stroke={KR} strokeWidth="2" strokeLinecap="round" transform={`rotate(${frame * 6} 12 13)`} /><path d="M10 2.5h4M12 2.5v2" stroke={color.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <MaskTitle text="¿Poco tiempo?" at={2} size={110} />
        </div>
        {items.map((it, i) => {
          const s = sp(frame, 10 + i * 6, 15, 150);
          const on = 0.45 + 0.55 * ramp(frame, it.at - 8, it.at + 6);
          return (
            <div key={it.k} style={{ position: 'absolute', left: 220, top: 320 + i * 350, display: 'flex', alignItems: 'center', gap: 60, opacity: s * on, transform: `translateY(${(1 - s) * 60}px)` }}>
              <Book3D b={BOOKS[it.k]} w={200} h={300} d={20} ry={-18} rx={3} />
              <div>
                <HoursBar hours={it.hours} label={BOOKS[it.k].title} at={it.at} trackAt={10 + i * 6} width={1100} maxH={2} c={i === 0 ? OCHRE : KR} h={56} size={1.5} showValue={frame > it.valAt - 6 ? it.label : ' '} />
                <div style={{ marginTop: 16, fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, color: color.ink2, maxWidth: 1100, opacity: rampOut(frame, it.subAt - 6, it.subAt + 10) }}>{it.sub}</div>
              </div>
            </div>
          );
        })}
      </Cam>
      <Sfx name="sk_clock" at={6} volume={0.5} />
      {items.map((it, i) => <Sfx key={i} name="swipe" at={it.at} volume={0.7} />)}
      {items.map((it, i) => <Sfx key={`v${i}`} name="ui_pop" at={it.valAt - 5} volume={0.6} />)}
    </SkStage>
  );
};
export const _d = { CoverIcon, Fact, Kicker, Grain, random, interpolate, clamp, easeOut, AbsoluteFill };

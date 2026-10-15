import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, Cam, color, CoverIcon, Fact, font, Grain, HoursBar, KR, KR_DEEP, MiniIcon, NEVA, OLDGOLD, ramp, rampOut, shadow, SkStage, Snow } from './kit';
import { Roulette } from './Bio';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 04 · Cinco puertas de entrada (D19–D33) y «¿Poco tiempo?» (D34).
// Cada puerta: A) la puerta se abre y sale el libro; B) viñeta ilustrada de la sinopsis; C) tarjeta con duración,
// narrador recomendado y valoración (fichas de SonorBooks España, 15/10/2026).
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
          <MaskTitle text={b.title} at={intro ? fTitle - 4 : from + 4} size={b.title.length > 16 ? 96 : b.title.length > 12 ? 108 : 128} />
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

// Silueta de San Petersburgo: casas bajas, una cúpula y una aguja dorada.
const Skyline: React.FC<{ y: number; c: string; spire?: string }> = ({ y, c, spire = '#C9A24E' }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
    <path d={`M0 ${y} L0 ${y - 60} L120 ${y - 60} L120 ${y - 90} L260 ${y - 90} L260 ${y - 70} L420 ${y - 70} L420 ${y - 110} L520 ${y - 110} L520 ${y - 80} L700 ${y - 80} L700 ${y - 100} L760 ${y - 100}
      L760 ${y - 150} Q800 ${y - 230} 840 ${y - 150} L840 ${y - 100} L960 ${y - 100} L960 ${y - 70} L1150 ${y - 70} L1150 ${y - 95} L1330 ${y - 95} L1330 ${y - 120} L1360 ${y - 120} L1372 ${y - 330} L1384 ${y - 120} L1420 ${y - 120}
      L1420 ${y - 85} L1600 ${y - 85} L1600 ${y - 65} L1760 ${y - 65} L1760 ${y - 90} L1920 ${y - 90} L1920 ${y}Z`} fill={c} />
    <path d={`M1366 ${y - 200} L1372 ${y - 330} L1378 ${y - 200}Z`} fill={spire} opacity={0.85} />
    <circle cx="800" cy={y - 232} r="6" fill={spire} opacity={0.85} />
  </svg>
);

// 1 · Noches blancas: canal de San Petersburgo en una noche de verano que no oscurece; un joven y una chica junto a
// la barandilla; cuatro noches.
const VNoches: React.FC<{ c: Clock; from: number; to: number }> = ({ c, to }) => {
  const frame = useCurrentFrame();
  const fSan = c.at('D20', 'San');
  const fCasi = c.at('D20', 'casi');
  const fJoven = c.at('D20', 'joven');
  const fChica = c.at('D20', 'chica');
  const fCanal = c.at('D20', 'canal');
  const fCuatro = c.at('D20', 'cuatro');
  const clockH = interpolate(frame, [fCasi - 30, fCasi + 50], [22, 26], clamp);
  const hh = Math.floor(clockH) % 24, mm = Math.floor((clockH % 1) * 60);
  const man = ramp(frame, fJoven - 10, fChica + 10);
  const girl = rampOut(frame, fChica - 8, fChica + 10);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #B9B6D6 0%, #D8C8DA 38%, #F2D6C4 58%, #F6E3CF 64%)', overflow: 'hidden' }}>
      <Cam keys={[{ f: 0, s: 1.06, x: 0, y: 0 }, { f: fJoven, s: 1.1, x: -20, y: -10 }, { f: fCuatro, s: 1.24, x: -120, y: -60 }, { f: to, s: 1.28, x: -140, y: -70 }]}>
        {/* el sol, apenas bajo el horizonte */}
        <div style={{ position: 'absolute', left: 1100, top: 470, width: 700, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,214,160,0.9) 0%, rgba(255,214,160,0) 70%)' }} />
        <Skyline y={640} c="#7C7F9C" spire="#E9C877" />
        {/* el agua */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, height: 300, background: 'linear-gradient(180deg, #9AA3C4 0%, #B9B4CC 40%, #8E95B5 100%)' }} />
        {Array.from({ length: 40 }).map((_, i) => {
          const y = 650 + random(`wy${i}`) * 260;
          const x = (random(`wx${i}`) * 2200 + frame * (0.3 + random(`wv${i}`) * 0.5)) % 2200 - 140;
          return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 60 + random(`ww${i}`) * 140, height: 3, borderRadius: 2, background: 'rgba(255,240,225,0.55)', opacity: 0.3 + 0.5 * Math.abs(Math.sin(frame / 20 + i)) }} />;
        })}
        {/* reflejo de la aguja */}
        <div style={{ position: 'absolute', left: 1368, top: 650, width: 8, height: 160, background: 'linear-gradient(180deg, rgba(233,200,119,0.6), rgba(233,200,119,0))' }} />
        {/* puente de piedra a la derecha */}
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M1200 700 Q1450 560 1700 700 L1700 720 L1660 720 Q1450 610 1240 720 L1200 720Z" fill="#6A6C86" />
          <path d="M1200 700 Q1450 560 1700 700" stroke="#3E405A" strokeWidth="6" fill="none" />
        </svg>
        {/* malecón de granito y barandilla de hierro */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 900, height: 200, background: 'linear-gradient(180deg, #8C7F80 0%, #6E6264 100%)' }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x="0" y="842" width="1920" height="8" fill="#22232B" />
          <rect x="0" y="894" width="1920" height="8" fill="#22232B" />
          {Array.from({ length: 49 }).map((_, i) => <g key={i}><rect x={i * 40} y="846" width="5" height="54" fill="#22232B" /><circle cx={i * 40 + 22} cy="872" r="10" fill="none" stroke="#22232B" strokeWidth="3" /></g>)}
          {/* farola */}
          <rect x="980" y="560" width="10" height="340" fill="#22232B" />
          <path d="M962 560 L1008 560 L998 520 L972 520Z" fill="#22232B" />
          <circle cx="985" cy="540" r="10" fill="#FFE7B0" opacity="0.65" />
        </svg>
        {/* los dos */}
        <div style={{ position: 'absolute', left: 560 + 300 * man, top: 640, opacity: Math.min(1, man * 3) }}><Man h={260} c="#2A2833" hat="cap" /></div>
        <div style={{ position: 'absolute', left: 1080, top: 650, opacity: girl, transform: `translateY(${(1 - girl) * 20}px)` }}><Woman h={250} c="#3A2F3E" /></div>
      </Cam>
      {/* hora: es casi medianoche y sigue habiendo luz */}
      <div style={{ position: 'absolute', right: 90, top: 80, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 28px 12px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.86)', boxShadow: shadow.float,
        opacity: rampOut(frame, fCasi - 30, fCasi - 16) * (1 - ramp(frame, fCuatro - 14, fCuatro - 4)) }}>
        <MiniIcon kind="clock" size={40} c={color.ink} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}</span>
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted }}>y casi no oscurece</span>
      </div>
      {/* cuatro noches */}
      <div style={{ position: 'absolute', right: 90, top: 80, display: 'flex', gap: 14 }}>
        {[0, 1, 2, 3].map((i) => {
          const s = sp(frame, fCuatro - 2 + i * 7, 12, 200);
          if (frame < fCuatro - 2 + i * 7) return null;
          return (
            <div key={i} style={{ width: 120, height: 130, borderRadius: 18, background: 'rgba(255,255,255,0.9)', boxShadow: shadow.float, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, transform: `scale(${s})` }}>
              <svg width="44" height="44" viewBox="0 0 24 24"><path d="M15 3a9 9 0 1 0 6 15A8 8 0 0 1 15 3z" fill="#E9C877" /></svg>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>{i + 1}.ª noche</span>
            </div>
          );
        })}
      </div>
      <StoryChips items={[{ label: 'San Petersburgo en verano', at: fSan }, { label: 'Un joven solitario', at: fJoven }, { label: 'Una chica junto a un canal', at: fCanal - 6 }, { label: 'Cuatro noches', at: fCuatro, gold: true }]} />
      <Sfx name="dk_water" at={c.part('D20') - 4} volume={0.7} dur={c.voEnd('D20') - c.part('D20') + 20} fade={20} />
      <Sfx name="sk_chime" at={fCasi} volume={0.35} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="ui_pop" at={fCuatro + i * 7} volume={0.45} />)}
    </AbsoluteFill>
  );
};

// 2 · Crimen y castigo: la buhardilla y la teoría → el hacha → el plano: 730 pasos desde su portal hasta la casa de ella.
const PATH: [number, number][] = [[360, 760], [360, 610], [620, 610], [620, 470], [940, 470], [1040, 400], [1300, 400], [1300, 300], [1560, 300]];
const pathLen = PATH.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]), 0);
const pointAt = (t: number): [number, number, number] => {
  let d = t * pathLen;
  for (let i = 1; i < PATH.length; i++) {
    const a = PATH[i - 1], b = PATH[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l) return [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l, Math.atan2(b[1] - a[1], b[0] - a[0])];
    d -= l;
  }
  const z = PATH[PATH.length - 1];
  return [z[0], z[1], 0];
};
const VCrimen: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fRask = c.part('D23');
  const fEx = c.at('D23', 'exestudiante');
  const fCree = c.at('D23', 'cree');
  const fExtra = c.at('D23', 'extraordinario');
  const fReglas = c.at('D23', 'reglas');
  const fMata = c.at('D23', 'mata');
  const fPrest = c.at('D23', 'prestamista');
  const fDesde = c.at('D23', 'Desde');
  const fSet = c.at('D23', 'setecientos');
  const fCont = c.at('D23', 'contado');
  const toMap = ramp(frame, fDesde - 14, fDesde + 4);
  const flash = interpolate(frame, [fMata - 2, fMata + 2, fMata + 30], [0, 1, 0], clamp);
  const swing = interpolate(frame, [fMata - 10, fMata + 2], [-70, 30], { ...clamp, easing: (t) => t * t });
  const walk = ramp(frame, fDesde + 4, fSet + 24, (t) => t);
  const steps = Math.round(730 * walk);
  const tally = ramp(frame, fCont - 4, fCont + 24, (t) => t);
  return (
    <AbsoluteFill style={{ background: '#15120F', overflow: 'hidden' }}>
      {/* buhardilla */}
      {toMap < 1 && (
        <AbsoluteFill style={{ opacity: 1 - toMap }}>
          <Cam keys={[{ f: 0, s: 1.04, x: 0, y: 0 }, { f: fMata, s: 1.12, x: 40, y: 10 }, { f: fDesde, s: 1.16, x: 50, y: 10 }]}>
            <svg width={1920} height={1080} style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="garret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3127" /><stop offset="1" stopColor="#241E18" /></linearGradient>
                <radialGradient id="garret-l" cx="0.62" cy="0.38" r="0.5"><stop offset="0" stopColor="rgba(255,214,140,0.35)" /><stop offset="1" stopColor="rgba(255,214,140,0)" /></radialGradient>
              </defs>
              <rect width="1920" height="1080" fill="url(#garret)" />
              {/* techo inclinado */}
              <path d="M0 0 L1920 0 L1920 120 L0 520Z" fill="#1A1612" />
              {/* papel pintado amarillento, roto */}
              {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={i * 90} y={300} width="3" height="620" fill="rgba(200,170,110,0.08)" />)}
              <path d="M1280 420 L1340 380 L1390 460 L1330 520Z" fill="#2B241D" />
              {/* ventanuco */}
              <rect x="1080" y="250" width="200" height="240" fill="#4A5876" />
              <path d="M1180 250V490M1080 370H1280" stroke="#1A1612" strokeWidth="10" />
              <rect x="1080" y="250" width="200" height="240" fill="none" stroke="#1A1612" strokeWidth="16" />
              <rect width="1920" height="1080" fill="url(#garret-l)" />
              {/* sofá estrecho */}
              <path d="M260 760 L900 760 L900 900 L260 900Z" fill="#3B2C22" />
              <path d="M240 700 Q260 680 300 690 L300 900 L240 900Z" fill="#33251C" />
              <rect x="0" y="900" width="1920" height="180" fill="#120F0C" />
            </svg>
            <div style={{ position: 'absolute', left: 440, top: 520 }}><Man h={300} c="#0D0B09" hat="top" hunch={0.35} /></div>
          </Cam>
          {/* la idea */}
          <div style={{ position: 'absolute', left: 920, top: 600, width: 900, opacity: rampOut(frame, fCree - 6, fCree + 10) * (1 - ramp(frame, fMata - 8, fMata)) }}>
            <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, lineHeight: 1.12, color: '#F3EAD8', textShadow: '0 6px 30px rgba(0,0,0,0.7)' }}>
              ¿Puede un hombre <span style={{ color: '#E9C877', opacity: rampOut(frame, fExtra - 4, fExtra + 8) }}>extraordinario</span> <span style={{ opacity: rampOut(frame, fReglas - 14, fReglas) }}>saltarse las reglas?</span>
            </div>
          </div>
          {/* el hacha (sin sangre: un golpe de luz roja) */}
          {frame >= fMata - 12 && frame < fDesde && (
            <div style={{ position: 'absolute', left: 1180, top: 180, transformOrigin: '50% 95%', transform: `rotate(${swing}deg)`, opacity: 1 - ramp(frame, fMata + 20, fMata + 40) }}>
              <svg width="520" height="520" viewBox="0 0 100 100" style={{ overflow: 'visible', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))' }}>
                <defs>
                  <linearGradient id="axe-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4A3018" /><stop offset="0.5" stopColor="#8C6234" /><stop offset="1" stopColor="#4A3018" /></linearGradient>
                  <linearGradient id="axe-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2F4F7" /><stop offset="0.55" stopColor="#A9B0B9" /><stop offset="1" stopColor="#6E757E" /></linearGradient>
                </defs>
                <rect x="46.5" y="16" width="7" height="82" rx="3.5" fill="url(#axe-wood)" />
                <path d="M53 18 C 70 12, 86 18, 90 36 C 82 31, 70 31, 53 36 Z" fill="url(#axe-steel)" />
                <path d="M47 19 L 39 21 L 39 33 L 47 35 Z" fill="#7C838C" />
                <path d="M88 33 C 84 22, 74 16, 60 16" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
          )}
          <AbsoluteFill style={{ background: KR, opacity: flash * 0.75, mixBlendMode: 'multiply' }} />
        </AbsoluteFill>
      )}
      {/* el plano: 730 pasos */}
      {toMap > 0 && (
        <AbsoluteFill style={{ opacity: toMap, background: '#EFE6D2' }}>
          <svg width={1920} height={1080} style={{ position: 'absolute' }}>
            {/* manzanas de casas */}
            {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 9 }).map((_, k) => {
              const x = 60 + k * 210 + (r % 2) * 20, y = 60 + r * 170;
              return <rect key={`${r}-${k}`} x={x} y={y} width={180} height={130} rx={6} fill="#E2D6BC" stroke="rgba(90,60,20,0.25)" strokeWidth="2" />;
            }))}
            {/* el canal */}
            <path d="M-20 870 C 400 820, 700 960, 1100 880 S 1700 760, 1960 840" stroke="#8FB0C8" strokeWidth="56" fill="none" />
            <path d="M-20 870 C 400 820, 700 960, 1100 880 S 1700 760, 1960 840" stroke="rgba(255,255,255,0.35)" strokeWidth="4" fill="none" strokeDasharray="20 30" />
            {/* el recorrido */}
            <path d={PATH.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} stroke="rgba(163,25,47,0.22)" strokeWidth="14" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <path d={PATH.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} stroke={KR} strokeWidth="8" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - walk)} />
          </svg>
          {/* huellas */}
          {Array.from({ length: 46 }).map((_, i) => {
            const t = i / 45;
            if (t > walk) return null;
            const [x, y, a] = pointAt(t);
            const side = i % 2 ? 1 : -1;
            return <div key={i} style={{ position: 'absolute', left: x - 7 + Math.cos(a + Math.PI / 2) * 9 * side, top: y - 11 + Math.sin(a + Math.PI / 2) * 9 * side, width: 14, height: 22, borderRadius: '50%', background: '#2A2016', opacity: 0.6, transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }} />;
          })}
          {/* inicio y fin */}
          {[{ p: PATH[0], label: 'Su portal', up: false }, { p: PATH[PATH.length - 1], label: 'Casa de la prestamista', up: true }].map((q, i) => (
            <div key={i} style={{ position: 'absolute', left: q.p[0], top: q.p[1] }}>
              <div style={{ position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: i ? KR : color.ink, border: '5px solid #fff', boxShadow: shadow.float }} />
              <div style={{ position: 'absolute', left: i ? -200 : 30, top: i ? -86 : 20, whiteSpace: 'nowrap', fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: '#fff', background: i ? KR : color.ink, padding: '8px 22px', borderRadius: 999, opacity: rampOut(frame, fDesde + (i ? 20 : 0), fDesde + (i ? 32 : 12)) }}>{q.label}</div>
            </div>
          ))}
          {/* contador de pasos */}
          <div style={{ position: 'absolute', left: 1200, top: 560, textAlign: 'right', width: 600 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 200, letterSpacing: -8, lineHeight: 0.9, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{steps}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: KR }}>pasos</div>
          </div>
          {/* «los ha contado» */}
          <svg width="420" height="250" viewBox="0 0 420 250" style={{ position: 'absolute', left: 1360, top: 520, overflow: 'visible' }}>
            <ellipse cx="250" cy="110" rx="200" ry="105" fill="none" stroke={KR} strokeWidth="7" strokeDasharray="1000" strokeDashoffset={1000 * (1 - tally)} transform="rotate(-5 250 110)" />
          </svg>
          <div style={{ position: 'absolute', left: 1240, top: 820, fontFamily: font.serif, fontStyle: 'italic', fontSize: 54, color: KR, opacity: rampOut(frame, fCont - 4, fCont + 12) }}>…los ha contado.</div>
        </AbsoluteFill>
      )}
      <StoryChips items={[{ label: 'Raskólnikov, exestudiante pobre', at: fEx }, { label: 'Una teoría peligrosa', at: fExtra }, { label: 'Mata a una prestamista', at: fPrest, red: true }]} until={fDesde} />
      <Sfx name="sk_clock" at={fRask} volume={0.35} dur={fMata - fRask} fade={10} />
      <Sfx name="whoosh_fast" at={fMata - 8} volume={0.6} />
      <Sfx name="impact" at={fMata + 1} volume={0.6} />
      <Sfx name="sk_heart" at={fMata + 10} volume={0.6} />
      <Sfx name="page_turn" at={fDesde - 10} volume={0.6} />
      {Array.from({ length: 24 }).map((_, i) => <Sfx key={i} name="tick_soft" at={Math.round(fDesde + 4 + i * ((fSet + 24 - fDesde - 4) / 24))} volume={0.35} />)}
      <Sfx name="hit_soft" at={fSet + 24} volume={0.6} />
      <Sfx name="pencil_strike" at={fCont - 4} volume={0.6} />
    </AbsoluteFill>
  );
};

// 3 · El jugador: la mesa de ruleta de un balneario alemán; fichas sobre el tapete; al final, el rastrillo se lo lleva todo.
const VJugador: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const p = c.part('D26');
  const fTutor = c.at('D26', 'tutor');
  const fBal = c.at('D26', 'balneario');
  const fMujer = c.at('D26', 'mujer');
  const fRul = c.at('D26', 'ruleta');
  const fDicto = c.at('D26', 'dictó');
  const fDias = c.at('D26', 'días');
  const fSabia = c.at('D26', 'sabía');
  const fPerd = c.at('D26', 'perdía');
  const rot = (frame - p) * 9;
  const ball = -(frame - p) * 0.16;
  const rake = ramp(frame, fPerd - 4, fPerd + 30, easeInOut);
  const bets = [[1060, 420], [1180, 500], [1300, 420], [1420, 580], [1540, 500], [1660, 420], [1180, 660], [1420, 420], [1540, 660]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #2E6B4F 0%, #1D4A36 55%, #10281D 100%)', overflow: 'hidden' }}>
      <Cam keys={[{ f: 0, s: 1.05, x: 0, y: 0 }, { f: fRul, s: 1.1, x: 40, y: 0 }, { f: fPerd, s: 1.16, x: -40, y: 0 }, { f: fPerd + 60, s: 1.2, x: -60, y: 0 }]}>
        {/* tapete con números */}
        <div style={{ position: 'absolute', left: 980, top: 300, display: 'grid', gridTemplateColumns: 'repeat(6, 120px)', gridAutoRows: '80px', border: '3px solid rgba(255,240,200,0.6)' }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const n = i + 1;
            const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30].includes(n);
            return <div key={i} style={{ border: '1.5px solid rgba(255,240,200,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.serif, fontWeight: 600, fontSize: 34, color: red ? '#E8505B' : '#F5EEDC' }}>{n}</div>;
          })}
        </div>
        {/* la ruleta */}
        <div style={{ position: 'absolute', left: 170, top: 200 }}><Roulette size={680} rot={rot} ball={ball} /></div>
        {/* fichas */}
        {bets.map(([x, y], i) => {
          const at = fRul - 20 + i * 4;
          const s = sp(frame, at, 12, 220);
          if (frame < at) return null;
          const gone = rake;
          return (
            <div key={i} style={{ position: 'absolute', left: x + gone * (1950 - x) - 30, top: y - 30 + gone * 40 * Math.sin(i), transform: `scale(${s})`, opacity: 1 - ramp(frame, fPerd + 20, fPerd + 34) }}>
              {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 0, top: -k * 8, width: 60, height: 60, borderRadius: '50%', background: k % 2 ? '#E9C877' : '#C9A24E', border: '5px dashed #FFF4CC', boxSizing: 'border-box', boxShadow: '0 4px 8px rgba(0,0,0,0.35)' }} />)}
            </div>
          );
        })}
        {/* rastrillo del crupier */}
        {rake > 0 && rake < 1 && (
          <div style={{ position: 'absolute', left: 880 + rake * 1000, top: 380, width: 18, height: 320, background: 'linear-gradient(90deg, #5A3A1A, #9A7440)', borderRadius: 9, boxShadow: '0 10px 18px rgba(0,0,0,0.45)' }}>
            <div style={{ position: 'absolute', left: 14, top: 151, width: 1700, height: 18, background: 'linear-gradient(180deg, #A9824A, #6B4A22)', borderRadius: 9, boxShadow: '0 8px 14px rgba(0,0,0,0.4)' }} />
          </div>
        )}
      </Cam>
      {/* dictada en 26 días */}
      <div style={{ position: 'absolute', right: 90, top: 80, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', boxShadow: shadow.float,
        opacity: rampOut(frame, fDicto - 6, fDicto + 6) * (1 - ramp(frame, fSabia + 10, fSabia + 20)), transform: `scale(${0.9 + 0.1 * rampOut(frame, fDicto - 6, fDicto + 6)})` }}>
        <MiniIcon kind="cal" size={44} c={KR} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink }}>Dictada en <span style={{ color: KR }}>{Math.round(interpolate(frame, [fDicto, fDias + 6], [1, 26], clamp))}</span> días</span>
      </div>
      <StoryChips items={[{ label: 'Un tutor ruso', at: fTutor }, { label: 'Un balneario alemán', at: fBal }, { label: 'Una mujer que lo desprecia', at: fMujer }, { label: 'Una ruleta', at: fRul }, { label: 'Él también lo perdía todo', at: fPerd - 8, red: true }]} />
      <Sfx name="dk_roulette" at={p} volume={0.5} />
      {bets.map((_, i) => i % 3 === 0 && <Sfx key={i} name="coins" at={fRul - 20 + i * 4} volume={0.3} />)}
      <Sfx name="dk_roulette" at={fSabia} volume={0.4} />
      <Sfx name="coins" at={fPerd + 2} volume={0.6} />
      <Sfx name="fail" at={fPerd + 24} volume={0.35} />
    </AbsoluteFill>
  );
};

// 4 · Memorias del subsuelo: la primera frase escrita en la pared de un sótano; un hombre en su rincón y los bocadillos
// con los que discute con todos, y al final con él mismo.
const VSubsuelo: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fSoy1 = c.at('D29', 'Soy');
  const fEnf = c.at('D29', 'enfermo…');
  const fSoy2 = c.at('D29', 'Soy', 1);
  const fMalo = c.at('D29', 'malo».');
  const fFunc = c.at('D29', 'funcionario');
  const fRinc = c.at('D29', 'rincón,');
  const fDisc = c.at('D29', 'discute');
  const fMundo = c.at('D29', 'mundo,');
  const fMismo = c.at('D29', 'mismo.');
  const quoteUp = ramp(frame, fFunc - 10, fFunc + 10);
  const flick = 0.85 + 0.15 * Math.sin(frame / 3.1) * Math.sin(frame / 7.3);
  const line1 = 'Soy un hombre enfermo…';
  const line2 = 'Soy un hombre malo';
  const n1 = Math.floor(interpolate(frame, [fSoy1 - 4, fEnf + 22], [0, line1.length], clamp));
  const n2 = Math.floor(interpolate(frame, [fSoy2 - 4, fMalo + 16], [0, line2.length], clamp));
  const bubbles = [
    { t: '¡No!', x: 420, y: 300 }, { t: '¿Y qué?', x: 1380, y: 260 }, { t: 'Al contrario…', x: 260, y: 560 }, { t: 'Lo sé mejor que usted', x: 1300, y: 520 }, { t: 'Pero…', x: 760, y: 220 },
  ];
  return (
    <AbsoluteFill style={{ background: '#0E0D0C', overflow: 'hidden' }}>
      {/* pared de ladrillo */}
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.6) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.6) 2px, transparent 2px)', backgroundSize: '120px 52px, 120px 104px', backgroundPosition: '0 0, 60px 52px', backgroundColor: '#2A231D', opacity: 0.9 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 60% at 50% 74%, rgba(255,190,100,${0.42 * flick}) 0%, rgba(255,170,80,${0.12 * flick}) 40%, rgba(0,0,0,0.92) 80%)` }} />
      {/* ventanuco con barrotes */}
      <svg width={300} height={140} viewBox="0 0 300 140" style={{ position: 'absolute', left: 1460, top: 70 }}>
        <rect width="300" height="140" fill="#3D4A60" opacity="0.6" />
        {[50, 110, 170, 230].map((x) => <rect key={x} x={x} y="0" width="12" height="140" fill="#0E0D0C" />)}
      </svg>
      {/* la frase */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 260 - 150 * quoteUp, textAlign: 'center', transform: `scale(${1 - 0.35 * quoteUp})`, opacity: 1 - 0.4 * quoteUp }}>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 96, color: '#F3EAD8', textShadow: '0 6px 30px rgba(0,0,0,0.8)', minHeight: 110 }}>{n1 > 0 ? `«${line1.slice(0, n1)}` : ''}</div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 96, color: '#E8505B', textShadow: '0 6px 30px rgba(0,0,0,0.8)', minHeight: 110 }}>{n2 > 0 ? `${line2.slice(0, n2)}${n2 >= line2.length ? '».' : ''}` : ''}</div>
      </div>
      {/* el hombre en su rincón y la vela */}
      <div style={{ position: 'absolute', left: 870, top: 600, opacity: rampOut(frame, fFunc - 6, fRinc) }}><Man h={300} c="#060505" hat="none" hunch={0.5} /></div>
      <svg width="60" height="120" viewBox="0 0 60 120" style={{ position: 'absolute', left: 1070, top: 790 }}>
        <rect x="20" y="50" width="20" height="70" fill="#EDE2C8" />
        <ellipse cx="30" cy={36 - 4 * flick} rx={8 * flick} ry={18 * flick} fill="#FFD27A" />
        <ellipse cx="30" cy={40 - 3 * flick} rx={4} ry={9} fill="#FFF6D8" />
      </svg>
      {/* discusiones */}
      {bubbles.map((b, i) => {
        const at = fDisc + i * 7;
        const s = sp(frame, at, 11, 220);
        if (frame < at) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: b.x, top: b.y + 160, transform: `scale(${s}) rotate(${(i % 2 ? 3 : -3)}deg)`, opacity: Math.min(1, s * 2) * (1 - 0.6 * ramp(frame, fMismo - 10, fMismo)) }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, background: '#F3EAD8', padding: '14px 30px', borderRadius: 30, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>{b.t}</div>
          </div>
        );
      })}
      {/* consigo mismo */}
      {frame >= fMismo - 10 && (() => {
        const s = sp(frame, fMismo - 8, 11, 200);
        return (
          <div style={{ position: 'absolute', left: 780, top: 450, transform: `scale(${s})`, opacity: s }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: '#fff', background: KR, padding: '14px 32px', borderRadius: 30, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>¿Y yo?</div>
            <div style={{ position: 'absolute', left: 120, top: 74, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: `28px solid ${KR}` }} />
          </div>
        );
      })()}
      <StoryChips items={[{ label: 'Un funcionario retirado', at: fFunc }, { label: 'Encerrado en su rincón', at: fRinc - 6 }, { label: 'Discute con todo el mundo', at: fMundo - 8 }, { label: 'Empezando por él mismo', at: fMismo - 6, red: true }]} />
      <Sfx name="dk_match" at={c.part('D29') - 2} volume={0.6} />
      <Sfx name="sk_typing" at={fSoy1 - 4} volume={0.4} dur={fMalo + 16 - fSoy1} fade={8} />
      {bubbles.map((_, i) => <Sfx key={i} name="pop" at={fDisc + i * 7} volume={0.4} />)}
      <Sfx name="hit_soft" at={fMismo - 6} volume={0.6} />
    </AbsoluteFill>
  );
};

// 5 · El idiota: un tren en la nieve trae a Myshkin de Suiza; dos mujeres y un rival; «un hombre bueno de verdad».
// Después, el recuerdo del gancho: los últimos minutos de un condenado (22 de diciembre de 1849).
const Train: React.FC<{ x: number; smoke: number }> = ({ x, smoke }) => (
  <div style={{ position: 'absolute', left: x, top: 560 }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: 40 - i * 30 + Math.sin(smoke + i) * 6, top: -60 - i * 26, width: 70 + i * 22, height: 50 + i * 14, borderRadius: '50%', background: `rgba(235,238,245,${0.7 - i * 0.07})`, filter: 'blur(2px)' }} />
    ))}
    <svg width="1300" height="200" viewBox="0 0 1300 200">
      <path d="M20 150 L20 70 L150 70 L150 30 L210 30 L210 70 L260 70 L260 20 L300 20 L300 70 L330 70 L330 150Z" fill="#14161C" />
      <path d="M0 150 L30 120 L30 150Z" fill="#14161C" />
      <rect x="240" y="90" width="40" height="30" fill="#FFD27A" opacity="0.8" />
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${360 + k * 310} 0)`}>
          <rect x="0" y="60" width="290" height="90" rx="6" fill="#283447" />
          {[0, 1, 2, 3, 4].map((w) => <rect key={w} x={20 + w * 54} y="78" width="34" height="30" rx="3" fill="#FFD27A" opacity="0.75" />)}
          <circle cx="50" cy="160" r="16" fill="#0B0D12" /><circle cx="240" cy="160" r="16" fill="#0B0D12" />
        </g>
      ))}
      {[70, 160, 250].map((cx) => <circle key={cx} cx={cx} cy="160" r="22" fill="#0B0D12" />)}
    </svg>
  </div>
);
const VIdiota: React.FC<{ c: Clock; from: number; to: number }> = ({ c, to }) => {
  const frame = useCurrentFrame();
  const p = c.part('D32');
  const fMysh = c.at('D32', 'Myshkin');
  const fSuiza = c.at('D32', 'Suiza,');
  const fBueno = c.at('D32', 'bueno');
  const fDos = c.at('D32', 'dos');
  const fRival = c.at('D32', 'rival');
  const fDost = c.at('D32', 'Dostoievski');
  const fVerdad = c.at('D32', 'verdad.');
  const p33 = c.part('D33');
  const fUlt = c.at('D33', 'últimos');
  const fCond = c.at('D33', 'condenado');
  const fYa = c.at('D33', 'Ya');
  const trainX = interpolate(frame, [p - 10, fBueno + 10], [1960, -1500], clamp);
  const people = ramp(frame, fBueno - 4, fBueno + 16);
  const halo = ramp(frame, fDost - 4, fVerdad + 10);
  const toHook = ramp(frame, p33 - 12, p33 + 8);
  const tick = Math.floor((frame - fUlt) / 25);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #8E9AB0 0%, #C5CEDA 60%, #E9EDF3 100%)', overflow: 'hidden' }}>
      {toHook < 1 && (
        <AbsoluteFill style={{ opacity: 1 - toHook }}>
          <Cam keys={[{ f: 0, s: 1.04, x: 0, y: 0 }, { f: fBueno, s: 1.06, x: 0, y: 0 }, { f: fVerdad, s: 1.14, x: 0, y: -30 }, { f: p33, s: 1.16, x: 0, y: -30 }]}>
            <svg width={1920} height={1080} style={{ position: 'absolute' }}>
              <path d="M0 520 L300 420 L520 500 L800 380 L1100 480 L1380 400 L1660 470 L1920 420 L1920 1080 L0 1080Z" fill="#A9B4C6" />
              <path d="M0 740 Q 960 700 1920 740 L1920 1080 L0 1080Z" fill="#F4F6F9" />
              <rect x="0" y="726" width="1920" height="10" fill="#5A6070" />
            </svg>
            {frame < fBueno + 12 && <Train x={trainX} smoke={frame / 9} />}
            {/* Myshkin entre dos mujeres y un rival */}
            <div style={{ position: 'absolute', left: 960 - 110, top: 450, opacity: people }}>
              <div style={{ position: 'absolute', left: -220, top: -170, width: 660, height: 660, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,236,170,${0.25 + 0.55 * halo}) 0%, rgba(255,236,170,0) 62%)` }} />
              <Man h={300} c="#2E3A4E" hat="none" />
            </div>
            <div style={{ position: 'absolute', left: 560, top: 470, opacity: ramp(frame, fDos - 6, fDos + 8), transform: `translateX(${(1 - ramp(frame, fDos - 6, fDos + 8)) * -40}px)` }}><Woman h={280} c="#3A2F3E" /></div>
            <div style={{ position: 'absolute', left: 1220, top: 470, opacity: ramp(frame, fDos, fDos + 14), transform: `translateX(${(1 - ramp(frame, fDos, fDos + 14)) * 40}px)` }}><Woman h={285} c="#4A2F30" /></div>
            <div style={{ position: 'absolute', left: 1440, top: 420, opacity: ramp(frame, fRival - 6, fRival + 8) }}><Man h={330} c={KR_DEEP} hat="top" /></div>
          </Cam>
          <Snow n={140} wind={1.2} opacity={0.9} seed="idiota" />
          <div style={{ position: 'absolute', left: 120, top: 90, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 28px 12px 18px', borderRadius: 999, background: '#fff', boxShadow: shadow.float, opacity: rampOut(frame, fSuiza - 6, fSuiza + 6) * (1 - ramp(frame, fBueno + 10, fBueno + 20)) }}>
            <MiniIcon kind="flag" size={40} c={KR} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>De vuelta de Suiza</span>
          </div>
        </AbsoluteFill>
      )}
      {/* el recuerdo del gancho */}
      {toHook > 0 && (
        <AbsoluteFill style={{ opacity: toHook, background: 'linear-gradient(180deg, #B9C1CF 0%, #DCE1E8 55%, #EEF1F5 100%)' }}>
          <svg width={1920} height={1080} style={{ position: 'absolute' }}>
            <path d="M0 760 Q 960 720 1920 760 L1920 1080 L0 1080Z" fill="#F7F8FA" />
            {[760, 960, 1160].map((x) => <g key={x}><rect x={x - 12} y="430" width="24" height="340" fill="#2A2F3A" /><rect x={x - 16} y="424" width="32" height="10" fill="#F7F8FA" /></g>)}
          </svg>
          <div style={{ position: 'absolute', left: 960 - 30, top: 560 }}><Man h={210} c="#1A1E26" hat="none" /></div>
          <Snow n={160} wind={0.8} opacity={0.9} seed="idiota2" />
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(10,14,22,0.55) 100%)' }} />
          {/* reloj de bolsillo */}
          <div style={{ position: 'absolute', left: 140, top: 140, opacity: rampOut(frame, fUlt - 8, fUlt + 6) }}>
            <svg width="220" height="250" viewBox="0 0 100 114">
              <circle cx="50" cy="10" r="6" fill="none" stroke="#C9A24E" strokeWidth="3" />
              <circle cx="50" cy="62" r="46" fill="#F7F0DF" stroke="#C9A24E" strokeWidth="6" />
              <line x1="50" y1="62" x2="50" y2="34" stroke="#1A1612" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${Math.max(0, tick) * 6} 50 62)`} />
              <line x1="50" y1="62" x2="68" y2="62" stroke="#1A1612" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="50" cy="62" r="4" fill={KR} />
            </svg>
          </div>
          <div style={{ position: 'absolute', left: 420, top: 160, width: 1300 }}>
            <MaskTitle text="Los últimos minutos de un condenado" at={fUlt - 6} size={84} color="#1A1E26" />
          </div>
          {frame >= fYa - 4 && (() => {
            const s = sp(frame, fYa - 2, 12, 240);
            return (
              <div style={{ position: 'absolute', left: 1260, top: 820, padding: '10px 32px', border: `7px solid ${KR}`, borderRadius: 14, color: KR, fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: 3,
                transform: `rotate(-6deg) scale(${2 - s})`, opacity: Math.min(1, s * 2), background: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>22 · XII · 1849</div>
            );
          })()}
        </AbsoluteFill>
      )}
      <StoryChips items={[{ label: 'El príncipe Myshkin', at: fMysh }, { label: 'Bueno hasta la ingenuidad', at: fBueno }, { label: 'Dos mujeres', at: fDos }, { label: 'Un rival peligroso', at: fRival, red: true }, { label: 'Un hombre bueno de verdad', at: fVerdad - 14, gold: true }]} until={p33} />
      <Sfx name="dk_train" at={p - 10} volume={0.8} dur={fBueno + 20 - p} fade={20} />
      <Sfx name="sk_wind" at={p} volume={0.5} dur={to - p} fade={30} />
      <Sfx name="shimmer" at={fDost} volume={0.5} />
      <Sfx name="whoosh_soft" at={p33 - 12} volume={0.5} />
      <Sfx name="sk_clock" at={fUlt} volume={0.55} dur={fYa - fUlt} fade={6} />
      <Sfx name="dk_drumroll" at={fCond - 10} volume={0.4} dur={fYa - fCond + 10} fade={8} />
      <Sfx name="stamp" at={fYa} volume={0.7} />
    </AbsoluteFill>
  );
};

// ———————————————— Escenas ————————————————

const star = <svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill={color.ink} /></svg>;

export const P1: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P1', n: 1, book: 'noches', kicker: 'Para probar en una tarde', headline: '¿Para probar en una tarde?', voA: 'D19', voB: 'D20', titleWord: 'Noches',
    cStart: (c) => c.part('D21') - 4, hoursAt: (c) => c.at('D21', 'dos') - 4, narrator: 'Txema Regalado',
    extra: { label: '4,3 de 5', sub: '80 valoraciones', icon: star, at: (c) => c.at('D21', 'Regalado.') + 10 },
    quote: { text: 'Su historia más tierna.', at: (c) => c.at('D21', 'tierna,') - 4 },
    Vignette: VNoches,
  }} />
);
export const P2: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P2', n: 2, book: 'crimen', kicker: 'La puerta clásica', headline: '¿La puerta clásica?', voA: 'D22', voB: 'D23', titleWord: 'Crimen',
    cStart: (c) => c.part('D24') - 4, hoursAt: (c) => c.at('D24', 'veintidós') - 4, narrator: 'Jordi Boixaderas',
    extra: { label: '4,7 de 5', sub: 'casi 300 valoraciones', icon: star, at: (c) => c.at('D24', 'casi') - 2 },
    quote: { text: 'Sabes quién es el asesino desde el principio… y aun así no puedes dejar de escuchar.', at: (c) => c.part('D24') + 4 },
    Vignette: VCrimen,
  }} />
);
export const P3: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P3', n: 3, book: 'jugador', kicker: 'Corta y con su vida dentro', headline: '¿Corta y con su vida dentro?', voA: 'D25', voB: 'D26', titleWord: 'jugador,',
    cStart: (c) => c.part('D27') - 10, hoursAt: (c) => c.at('D27', 'seis') - 6, hoursSub: 'menos de seis horas en audio',
    quote: { text: 'Ninguna versión destaca: escucha las muestras y elige la tuya.', at: (c) => c.at('D27', 'Aquí') - 4 },
    Vignette: VJugador,
  }} />
);
export const P4: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P4', n: 4, book: 'subsuelo', kicker: 'Si te gustan las ideas', headline: '¿Te gustan las ideas?', voA: 'D28', voB: 'D29', titleWord: 'Memorias',
    cStart: (c) => c.part('D30') - 4, hoursAt: (c) => c.at('D30', 'cinco') - 4, narrator: 'Omar Barrera',
    extra: { label: 'Gratis', sub: 'en El Libro Total', icon: <MiniIcon kind="head" size={30} c={color.ink} />, at: (c) => c.at('D30', 'gratis') - 4, accent: '#9FD8B4' },
    quote: { text: 'Para muchos, el punto de partida del existencialismo.', at: (c) => c.part('D30') + 4 },
    Vignette: VSubsuelo,
  }} />
);
export const P5: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'P5', n: 5, book: 'idiota', kicker: 'Si buscas una historia de amor', headline: '¿Una historia de amor?', voA: 'D31', voB: 'D32', titleWord: 'idiota,',
    cStart: (c) => c.at('D33', 'En') - 12, hoursAt: (c) => c.at('D33', 'veintitrés') - 4, narrator: 'Germán Gijón',
    quote: { text: 'Quería retratar a un hombre bueno de verdad.', at: (c) => c.at('D33', 'En') + 4 },
    Vignette: VIdiota,
  }} />
);

// ——— CORTOS · D34 · ¿Poco tiempo? ———
export const Cortos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORTOS');
  const fSueno = c.at('D34', 'sueño');
  const fHombre = c.at('D34', 'hombre', 1);
  const fHora = c.at('D34', 'hora.');
  const fInq = c.at('D34', 'gran');
  const fCap = c.at('D34', 'capítulo');
  const fMedia = c.at('D34', 'media');
  const fGratis = c.at('D34', 'gratis');
  const items = [
    { k: 'sueno', at: fSueno, hours: 0.85, label: '51 min', sub: 'Un hombre al que nada le importa sueña con un mundo sin maldad', subAt: fHombre, valAt: fHora },
    { k: 'inquisidor', at: fInq, hours: 0.55, label: '33 min', sub: 'Un capítulo de Los hermanos Karamázov que se escucha solo', subAt: fCap, valAt: fMedia },
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
                <HoursBar hours={it.hours} label={BOOKS[it.k].title} at={it.at} trackAt={10 + i * 6} width={1100} maxH={2} c={i === 0 ? NEVA : KR} h={56} size={1.5} showValue={frame > it.valAt - 6 ? it.label : ' '} />
                <div style={{ marginTop: 16, fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, color: color.ink2, maxWidth: 1100, opacity: rampOut(frame, it.subAt - 6, it.subAt + 10) }}>{it.sub}</div>
                {i === 1 && (
                  <div style={{ marginTop: 18, opacity: rampOut(frame, fGratis - 6, fGratis + 6), transform: `scale(${0.9 + 0.1 * rampOut(frame, fGratis - 6, fGratis + 6)})`, transformOrigin: 'left center' }}>
                    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, background: '#9FD8B4', padding: '8px 24px', borderRadius: 999 }}>Gratis · El Libro Total</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Cam>
      <Sfx name="sk_clock" at={6} volume={0.5} />
      {items.map((it, i) => <Sfx key={i} name="swipe" at={it.at} volume={0.7} />)}
      {items.map((it, i) => <Sfx key={`v${i}`} name="ui_pop" at={it.valAt - 5} volume={0.6} />)}
      <Sfx name="success" at={fGratis - 4} volume={0.45} />
    </SkStage>
  );
};
export const _d = { OLDGOLD, CoverIcon };

import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx, ChangeTicks } from '../../components/Sfx';
import { MaskTitle, Burst } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, Cam, color, CoverIcon, Fact, FearMeter, font, Grain, HoursBar, KR, MiniIcon, PAPER, ramp, rampOut, shadow, SkNight, SkStage, Snow, Dust } from './kit';
import { sceneClock } from './timeline';

type Clock = ReturnType<typeof sceneClock>;
const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

// Chips narrativos abajo a la izquierda (palabras clave de la sinopsis, aparecen con la voz).
const StoryChips: React.FC<{ items: { label: string; at: number; red?: boolean }[]; dark?: boolean }> = ({ items, dark = true }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 90, bottom: 70, display: 'flex', gap: 16, flexWrap: 'wrap', width: 1700 }}>
      {items.map((it, i) => {
        const s = sp(frame, it.at - 2, 15, 200);
        if (frame < it.at - 3) return null;
        return (
          <div key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, padding: '13px 28px', borderRadius: 999, whiteSpace: 'nowrap',
            background: it.red ? KR : dark ? 'rgba(8,10,14,0.72)' : '#fff', color: it.red ? '#fff' : dark ? '#fff' : color.ink, border: it.red ? 'none' : dark ? '1px solid rgba(255,255,255,0.16)' : `1px solid ${color.line}`,
            backdropFilter: 'blur(6px)', opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${0.9 + 0.1 * s})`, boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.35)' : shadow.soft }}>
            {it.label}
          </div>
        );
      })}
    </div>
  );
};

// Silueta de persona (plana). `big` para el preso de La milla verde; `kid` para el niño.
const Person: React.FC<{ h: number; c?: string; kid?: boolean; big?: boolean }> = ({ h, c = '#0B0D12', kid = false, big = false }) => {
  const w = h * (big ? 0.55 : kid ? 0.42 : 0.4);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={w / 2} cy={h * 0.12} r={h * (kid ? 0.12 : 0.1)} fill={c} />
      <path d={`M${w * 0.12} ${h} L${w * 0.16} ${h * 0.42} Q${w * 0.2} ${h * 0.25} ${w / 2} ${h * 0.25} Q${w * 0.8} ${h * 0.25} ${w * 0.84} ${h * 0.42} L${w * 0.88} ${h}Z`} fill={c} />
    </svg>
  );
};

// ———————————————— Puerta y tarjeta del libro ————————————————

type FactDef = { icon: 'clock' | 'mic' | 'star'; label: string; sub?: string; at: number };
type DoorCfg = {
  sceneId: string; n: number; book: string; kicker: string; headline: string; voA: string; voB: string; titleWord: string; fear: 0 | 1 | 2 | 3; fearLabel: string;
  cStart: (c: Clock) => number; hoursAt: (c: Clock) => number; quote?: { text: string; at: (c: Clock) => number };
  // Versión polaca: el género se dice después del título («Pierwsze wejście: Lśnienie, z 1977 roku. Klasyczny horror.»),
  // así que el antetítulo entra con esa palabra; y cada puerta lleva sus datos (lector, duración…) en el orden en que se dicen.
  kickerAt?: (c: Clock) => number; facts?: (c: Clock) => FactDef[];
  Vignette: React.FC<{ c: Clock; from: number; to: number }>;
};
const FactIcon: React.FC<{ k: FactDef['icon'] }> = ({ k }) => (k === 'star'
  ? <svg width={30} height={30} viewBox="0 0 24 24"><path d="m12 3.2 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z" fill={color.ink} /></svg>
  : <MiniIcon kind={k} size={30} />);

const DoorCard: React.FC<{ cfg: DoorCfg; c: Clock; mode: 'intro' | 'facts'; from: number }> = ({ cfg, c, mode, from }) => {
  const frame = useCurrentFrame();
  const b = BOOKS[cfg.book];
  const fTitle = c.at(cfg.voA, cfg.titleWord);
  const intro = mode === 'intro';
  // La puerta se abre al nombrar el libro; el libro sale de la puerta.
  const open = intro ? ramp(frame, fTitle - 16, fTitle + 14, easeInOut) : 1;
  const bookOut = intro ? sp(frame, fTitle - 2, 15, 120) : 1;
  const ry = intro ? interpolate(frame, [fTitle - 4, fTitle + 60, fTitle + 200], [-60, -18, -10], { ...clamp, easing: easeOut }) : -14 + Math.sin(frame / 50) * 4;
  const doorIn = intro ? sp(frame, 2, 18, 140) : 1;
  const hoursAt = cfg.hoursAt(c);
  const tx = intro ? 0 : 0;
  return (
    <AbsoluteFill>
      {/* Marco de la puerta */}
      <div style={{ position: 'absolute', left: 300, top: 150, width: 520, height: 780, opacity: doorIn, transform: `translateY(${(1 - doorIn) * 60}px)` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '260px 260px 18px 18px', background: '#1A1410', boxShadow: 'inset 0 0 0 16px #2C221B, 0 40px 80px rgba(16,16,16,0.25)' }} />
        {/* luz de dentro */}
        <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 0, borderRadius: '244px 244px 6px 6px', overflow: 'hidden',
          background: `radial-gradient(ellipse at 50% 60%, rgba(255,214,120,${0.85 * open}) 0%, rgba(255,180,60,${0.35 * open}) 45%, rgba(26,20,16,1) 80%)` }} />
        {/* hoja de la puerta (bisagra a la izquierda) */}
        <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 0, perspective: 1600 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '244px 244px 6px 6px', background: `linear-gradient(90deg, ${b.bg} 0%, ${b.bg} 70%, rgba(0,0,0,0.35) 100%)`,
            transformOrigin: 'left center', transform: `rotateY(${-104 * open}deg)`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25)', opacity: open > 0.97 ? 0 : 1 }}>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 120, height: 220, borderRadius: '160px 160px 8px 8px', border: `3px solid ${b.accent}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 50, right: 50, top: 400, height: 240, borderRadius: 8, border: `3px solid ${b.accent}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', right: 40, top: 420, width: 26, height: 26, borderRadius: '50%', background: b.accent }} />
          </div>
        </div>
        {/* número de la puerta */}
        <div style={{ position: 'absolute', left: '50%', top: -44, transform: 'translateX(-50%)', width: 88, height: 88, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, boxShadow: shadow.float }}>{cfg.n}</div>
      </div>
      {/* El libro */}
      <div style={{ position: 'absolute', left: 560 - 170, top: 220, transform: `translateY(${(1 - bookOut) * 70}px) scale(${0.55 + 0.45 * bookOut})`, opacity: Math.min(1, bookOut * 1.6), transformOrigin: '50% 60%' }}>
        <Book3D b={b} w={340} h={510} d={58} ry={ry} rx={3} />
      </div>
      {/* Texto */}
      <div style={{ position: 'absolute', left: 980, top: 0, height: 1080, width: 860, display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: `translateX(${tx}px)` }}>
        <Kicker at={intro ? (cfg.kickerAt ? cfg.kickerAt(c) : fTitle - 4) : from + 2} text={`Wejście ${cfg.n} · ${cfg.kicker}`} />
        <div style={{ position: 'relative' }}>
          {intro && frame < fTitle + 6 && (
            <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: color.muted, textTransform: 'uppercase', marginBottom: 14, opacity: rampOut(frame, 4, 16) * (1 - ramp(frame, fTitle - 12, fTitle - 2)) }}>Pięć wejść</div>
              {/* En polaco el título llega enseguida («Drugie: Misery…»): sin tiempo para leer el antetítulo, no se muestra. */}
              {fTitle > 50 && <MaskTitle text={cfg.headline} at={6} size={84} out={fTitle - 6} />}
            </div>
          )}
          <MaskTitle text={b.title} at={intro ? fTitle - 4 : from + 4} size={b.title.length > 12 ? 104 : 128} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 34, flexWrap: 'wrap' }}>
          <Fact at={intro ? fTitle + 14 : from + 10} icon={<MiniIcon kind="cal" size={30} />} label={String(b.year)} size={38} />
          {!intro && (cfg.facts ? cfg.facts(c) : [
            { icon: 'clock', label: b.hours ?? '', sub: 'audiobook po polsku', at: hoursAt },
            { icon: 'mic', label: b.narrator ?? '', sub: 'lektor', at: hoursAt + 8 },
          ] as FactDef[]).map((fd, i) => <Fact key={i} at={Math.max(from + 10, fd.at)} icon={<FactIcon k={fd.icon} />} label={fd.label} sub={fd.sub} size={38} />)}
        </div>
        {!intro && (
          <div style={{ marginTop: 34, opacity: rampOut(frame, from + 14, from + 28) }}>
            <FearMeter level={cfg.fear} at={from + 18} size={40} label={cfg.fearLabel} />
          </div>
        )}
        {!intro && cfg.quote && (
          <div style={{ marginTop: 36, fontFamily: font.serif, fontStyle: 'italic', fontSize: 44, lineHeight: 1.2, color: color.ink2, maxWidth: 780, opacity: rampOut(frame, cfg.quote.at(c), cfg.quote.at(c) + 16) }}>{cfg.quote.text}</div>
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
  // A → B: la cámara entra por la puerta. B → C: la viñeta se aleja y vuelve la tarjeta.
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
          {/* acabado de cine: viñeta y grano */}
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
      {(cfg.facts ? cfg.facts(c).map((fd) => Math.max(fC + 10, fd.at)) : [cfg.hoursAt(c), cfg.hoursAt(c) + 8]).map((a, i) => <Sfx key={`fp${i}`} name="ui_pop" at={a + 1} volume={0.6 - i * 0.05} />)}
      {Array.from({ length: cfg.fear }).map((_, i) => <Sfx key={i} name="tick_soft" at={fC + 18 + i * 5} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// ———————————————— Viñetas ————————————————

// 1 · El resplandor: un hotel enorme en la montaña, nieve, una familia; las ventanas se apagan y una queda roja.
const VShining: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fHotel = c.at('G15', 'hotelu');
  const fNieve = c.at('G15', 'śnieg');
  const fInv = c.at('G15', 'zimę');
  const fMujer = c.at('G15', 'żoną');
  const fHijo = c.at('G15', 'synem');
  const fPlanes = c.at('G15', 'hotel', 1);
  const fOtros = c.at('G15', 'inne');
  const snow = 0.4 + 0.6 * ramp(frame, fNieve - 6, fNieve + 30);
  const dark = ramp(frame, fPlanes - 6, fOtros + 6);
  const rows = 4, cols = 13;
  const fam = ramp(frame, fMujer - 10, fHijo + 20);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0B1220 0%, #16233A 60%, #22324D 100%)', overflow: 'hidden' }}>
      <Cam keys={[{ f: 0, s: 1.05, x: 0, y: 10 }, { f: fPlanes - 8, s: 1.1, x: 0, y: 0 }, { f: fOtros + 40, s: 1.55, x: (960 - 1180) * 1.55 + 0, y: (540 - 520) * 1.55 }]}>
        {/* estrellas */}
        {Array.from({ length: 70 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: random(`st${i}`) * 1920, top: random(`sy${i}`) * 420, width: 2.5, height: 2.5, borderRadius: '50%', background: '#fff', opacity: 0.25 + 0.5 * Math.abs(Math.sin(frame / 30 + i)) }} />)}
        {/* montañas */}
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M0 620 L260 380 L420 500 L640 300 L860 520 L1080 340 L1300 560 L1520 320 L1720 470 L1920 360 L1920 1080 L0 1080Z" fill="#26364F" />
          <path d="M640 300 L700 352 L670 350 L640 330 L610 360 L590 345Z M1520 320 L1580 372 L1548 368 L1520 350 L1490 380 L1470 360Z M1080 340 L1130 384 L1100 380 L1080 365 L1058 388 L1040 376Z" fill="#E8EEF7" opacity={0.85} />
          <path d="M0 760 L320 560 L560 700 L800 560 L1100 720 L1400 580 L1700 700 L1920 620 L1920 1080 L0 1080Z" fill="#1B2840" />
          <path d="M0 900 Q 480 820 960 860 T 1920 840 L1920 1080 L0 1080Z" fill="#E9EEF5" />
        </svg>
        {/* hotel */}
        <div style={{ position: 'absolute', left: 560, top: 470, width: 860, height: 340, opacity: rampOut(frame, fHotel - 20, fHotel + 6), transform: `translateY(${(1 - rampOut(frame, fHotel - 20, fHotel + 6)) * 30}px)` }}>
          <svg width={860} height={340} viewBox="0 0 860 340" style={{ position: 'absolute', left: 0, top: 0 }}>
            <path d="M0 110 L430 20 L860 110 L860 340 L0 340Z" fill="#0E1626" />
            <path d="M-10 112 L430 18 L870 112" stroke="#E9EEF5" strokeWidth={10} fill="none" opacity={snow} />
            <rect x="380" y="250" width="100" height="90" fill="#1D2A40" />
          </svg>
          {Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, k) => {
            const id = r * cols + k;
            const isRed = r === 1 && k === 9;
            const on = ramp(frame, fHotel - 10 + random(`w${id}`) * 30, fHotel + random(`w${id}`) * 30);
            const off = isRed ? 0 : ramp(frame, fPlanes - 4 + random(`o${id}`) * 20, fPlanes + 6 + random(`o${id}`) * 22);
            const red = isRed ? dark : 0;
            const lit = on * (1 - off);
            return <div key={id} style={{ position: 'absolute', left: 36 + k * 62, top: 130 + r * 52, width: 30, height: 30, borderRadius: 3,
              background: red > 0.05 ? `rgb(${Math.round(255 - 30 * red)}, ${Math.round(214 - 190 * red)}, ${Math.round(120 - 100 * red)})` : `rgba(255,214,120,${0.12 + 0.88 * lit})`,
              boxShadow: lit > 0.3 || red > 0.3 ? `0 0 ${18 + 20 * red}px rgba(${red > 0.3 ? '230,40,40' : '255,200,90'},0.7)` : undefined }} />;
          }))}
        </div>
        {/* familia */}
        <div style={{ position: 'absolute', left: 900, top: 760, display: 'flex', alignItems: 'flex-end', gap: 16, opacity: fam, transform: `translateX(${(1 - fam) * -60}px)` }}>
          <Person h={110} c="#0B0D12" /><Person h={100} c="#0B0D12" /><Person h={64} c="#0B0D12" kid />
        </div>
        {/* pinos */}
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          {[80, 200, 1640, 1760, 1860].map((x, i) => <path key={i} d={`M${x} ${1000 - (i % 2) * 40} l60 -260 l60 260z`} fill="#0A1222" />)}
        </svg>
        <Snow n={220} wind={1.4} speed={1 + snow} opacity={snow} seed="shining" />
      </Cam>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)', opacity: 0.5 + 0.5 * dark }} />
      <StoryChips items={[{ label: 'Cała zima', at: fInv }, { label: 'Hotel odcięty przez śnieg', at: fHotel }, { label: 'Żona i syn', at: fMujer }, { label: 'Hotel ma inne plany', at: fOtros, red: true }]} />
      <Sfx name="sk_wind" at={c.part('G15') - 4} volume={1} dur={c.voEnd('G15') - c.part('G15') + 30} fade={30} />
      <Sfx name="sk_snow" at={fMujer} volume={0.6} />
      <Sfx name="bass_drop" at={fOtros + 2} volume={0.6} />
      <Sfx name="sk_heart" at={fOtros + 20} volume={0.6} />
    </AbsoluteFill>
  );
};

// 2 · Misery: coche en la tormenta, una luz que se acerca, una casa con la puerta cerrada y la tensión que sube.
const VMisery: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fEstr = c.at('G18', 'wypadek');
  const fTorm = c.at('G18', 'śnieżycy');
  const fResc = c.at('G18', 'Ratuje');
  const fNum = c.at('G18', 'numer');
  const fProb = c.at('G18', 'która');
  const fMarchar = c.at('G18', 'wypuścić');
  const fDos = fMarchar + 10;
  const fCasa = fProb + 16;
  const fTens = fMarchar;
  const toHouse = ramp(frame, fProb - 8, fProb + 2);
  const crash = ramp(frame, fEstr + 6, fEstr + 22, easeOut);
  const lantern = ramp(frame, fResc - 10, fResc + 20);
  const lock = sp(frame, fMarchar - 2, 10, 240);
  const tension = interpolate(frame, [fTens - 4, fTens + 60], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #121722 0%, #202838 70%, #2B3445 100%)', overflow: 'hidden' }}>
      {/* Parte 1: carretera en la tormenta */}
      <AbsoluteFill style={{ opacity: 1 - toHouse }}>
        <Cam keys={[{ f: 0, s: 1.04, x: 0, y: 0 }, { f: fEstr + 10, s: 1.12, x: 30, y: -10 }, { f: fResc + 20, s: 1.2, x: -40, y: -20 }]}>
          <svg width={1920} height={1080} style={{ position: 'absolute' }}>
            <path d="M0 820 Q 900 700 1920 760 L1920 1080 L0 1080Z" fill="#E6EBF2" />
            <path d="M-50 980 Q 700 760 1300 780 T 2000 740" stroke="#3A4250" strokeWidth={140} fill="none" opacity={0.5} />
            <path d="M0 830 Q 500 700 1100 760 Q 1400 790 1920 760" stroke="#C9D2DE" strokeWidth={14} fill="none" strokeDasharray="40 50" opacity={0.6} />
          </svg>
          {/* coche */}
          <div style={{ position: 'absolute', left: 760 + crash * 220, top: 700 + crash * 60, transform: `rotate(${crash * 28}deg)` }}>
            <div style={{ position: 'absolute', left: 250, top: 20, width: 700, height: 160, background: 'linear-gradient(90deg, rgba(255,240,190,0.55), rgba(255,240,190,0))', clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)', opacity: 1 - crash * 0.6 }} />
            <svg width="300" height="140" viewBox="0 0 300 140">
              <path d="M20 100 L30 60 L90 30 L200 30 L250 60 L285 72 L285 100Z" fill="#0B0D12" />
              <path d="M100 38 L190 38 L225 62 L80 62Z" fill="#2F3A4D" />
              <circle cx="80" cy="104" r="22" fill="#0B0D12" stroke="#2F3A4D" strokeWidth="6" /><circle cx="225" cy="104" r="22" fill="#0B0D12" stroke="#2F3A4D" strokeWidth="6" />
              <rect x="270" y="74" width="16" height="12" rx="3" fill="#FFF2C6" />
              <rect x="22" y="70" width="12" height="10" rx="3" fill="#FFB020" opacity={crash > 0.9 && Math.floor(frame / 12) % 2 === 0 ? 1 : 0.15} />
            </svg>
          </div>
          {/* farol que se acerca */}
          <div style={{ position: 'absolute', left: 1560 - lantern * 380, top: 640, opacity: lantern }}>
            <div style={{ position: 'absolute', left: -160, top: -160, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,90,0.55), rgba(255,200,90,0) 65%)' }} />
            <Person h={180} c="#0B0D12" />
            <div style={{ position: 'absolute', left: 6, top: -70, opacity: rampOut(frame, fNum - 4, fNum + 10), transform: `scale(${sp(frame, fNum - 2, 10, 220)})` }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', background: KR, padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>♥ Fanka nr 1</div>
            </div>
          </div>
          <Snow n={260} wind={4.5} speed={1.8} opacity={0.95} seed="misery" />
        </Cam>
      </AbsoluteFill>
      {/* Parte 2: la casa */}
      {toHouse > 0 && (
        <AbsoluteFill style={{ opacity: toHouse }}>
          <Cam keys={[{ f: fProb - 16, s: 1.08, x: 0, y: 0 }, { f: fCasa, s: 1, x: 0, y: 0 }, { f: fTens + 60, s: 1.12, x: 0, y: 20 }]}>
            <svg width={1920} height={1080} style={{ position: 'absolute' }}>
              <path d="M0 800 Q 960 760 1920 800 L1920 1080 L0 1080Z" fill="#E6EBF2" />
              <path d="M620 520 L960 300 L1300 520 L1300 820 L620 820Z" fill="#0B0D12" />
              <path d="M600 525 L960 290 L1320 525" stroke="#E6EBF2" strokeWidth={14} fill="none" />
              <rect x="700" y="580" width="150" height="120" rx="6" fill="rgba(255,200,90,0.9)" />
              <rect x="1070" y="580" width="150" height="120" rx="6" fill="rgba(255,200,90,0.35)" />
              <rect x="900" y="620" width="120" height="200" rx="6" fill="#2A2018" />
            </svg>
            {/* dos personas en la ventana */}
            <div style={{ position: 'absolute', left: 712, top: 610, display: 'flex', gap: 18, alignItems: 'flex-end', opacity: rampOut(frame, fDos - 4, fDos + 10) }}>
              <Person h={86} c="#3A2A14" /><Person h={86} c="#3A2A14" />
            </div>
            {/* candado */}
            <div style={{ position: 'absolute', left: 925, top: 690, transform: `scale(${lock})`, opacity: lock }}>
              <svg width="70" height="80" viewBox="0 0 24 28"><path d="M6 12V8a6 6 0 0 1 12 0v4" stroke="#E6EBF2" strokeWidth="2.6" fill="none" /><rect x="3" y="12" width="18" height="14" rx="3" fill={KR} /></svg>
            </div>
          </Cam>
          {/* línea de tensión */}
          <svg width={1920} height={200} style={{ position: 'absolute', left: 0, top: 60 }}>
            <path d={Array.from({ length: 97 }).map((_, i) => { const x = i * 20; const amp = (6 + i * 0.9) * tension; return `${i ? 'L' : 'M'}${x} ${100 - Math.sin(i * 1.3 + frame / 4) * amp - i * 0.6 * tension}`; }).join(' ')}
              stroke={KR} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - tension)} />
          </svg>
          <Snow n={120} wind={1.2} speed={0.8} opacity={0.8} seed="misery2" />
        </AbsoluteFill>
      )}
      <StoryChips items={[{ label: 'Wypadek w śnieżycy', at: fEstr }, { label: 'Fanka numer jeden', at: fNum }, { label: 'Nie zamierza go wypuścić', at: fMarchar, red: true }]} />
      <Sfx name="sk_wind" at={c.part('G18') - 4} volume={1} dur={fProb - c.part('G18') + 20} fade={20} />
      <Sfx name="impact" at={fEstr + 12} volume={0.7} />
      <Sfx name="sk_snow" at={fResc} volume={0.8} />
      <Sfx name="sk_door" at={fProb} volume={0.4} />
      <Sfx name="stamp" at={fMarchar} volume={0.55} />
      <Sfx name="sk_heart" at={fTens} volume={0.7} />
      <Sfx name="riser" at={fTens + 60} volume={0.35} />
      {fTorm > 0 && null}
    </AbsoluteFill>
  );
};

// 3 · La milla verde: el pasillo de suelo verde, 1932, un guardia y un preso enorme con un don; seis libritos.
const VMilla: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fCorr = c.at('G20', 'Korytarz');
  const fAnio = c.at('G20', 'tysiąc');
  const fGuard = c.at('G20', 'Strażnik');
  const fPreso = c.at('G20', 'więzień');
  const fDon = c.at('G20', 'darem');
  const fPub = c.at('G20', 'ukazała');
  const fSeis = c.at('G20', 'sześciu');
  const fSerie = c.at('G20', 'częściach');
  const booklets = ramp(frame, fPub - 10, fPub + 10);
  const glow = ramp(frame, fDon - 6, fDon + 24);
  return (
    <AbsoluteFill style={{ background: '#111612', overflow: 'hidden' }}>
      <Cam keys={[{ f: 0, s: 1.1, x: 0, y: 0 }, { f: fDon + 10, s: 1.32, x: 0, y: -40 }, { f: fPub, s: 1.05, x: 0, y: 0 }]}>
        <svg width={1920} height={1080} style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="floor" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#3E7A4F" /><stop offset="1" stopColor="#1F3A27" /></linearGradient>
            <radialGradient id="endglow" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stopColor="rgba(255,226,160,0.55)" /><stop offset="1" stopColor="rgba(255,226,160,0)" /></radialGradient>
            <radialGradient id="lamp" cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="rgba(255,226,160,0.55)" /><stop offset="1" stopColor="rgba(255,226,160,0)" /></radialGradient>
          </defs>
          {/* paredes, techo y suelo en perspectiva (punto de fuga en 960, 500) */}
          <path d="M0 0 L780 380 L1140 380 L1920 0Z" fill="#1B211C" />
          <path d="M0 1080 L780 620 L1140 620 L1920 1080Z" fill="url(#floor)" />
          <path d="M0 0 L780 380 L780 620 L0 1080Z" fill="#232A24" />
          <path d="M1920 0 L1140 380 L1140 620 L1920 1080Z" fill="#232A24" />
          <rect x="780" y="380" width="360" height="240" fill="#3A3424" />
          <rect x="780" y="380" width="360" height="240" fill="url(#endglow)" />
          {/* barrotes de las celdas */}
          {[0.08, 0.22, 0.36, 0.5, 0.62].map((t, i) => {
            const xl = t * 780, xr = 1920 - t * 780;
            const yt = t * 380 * 1, yb = 1080 - t * 460;
            return (
              <g key={i} opacity={0.9}>
                {Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M${xl + k * (14 - t * 10)} ${yt + 20 + k * 6 * (1 - t)} L${xl + k * (14 - t * 10)} ${yb - 20}`} stroke="#5C665E" strokeWidth={6 - t * 4} />)}
                {Array.from({ length: 5 }).map((_, k) => <path key={`r${k}`} d={`M${xr - k * (14 - t * 10)} ${yt + 20 + k * 6 * (1 - t)} L${xr - k * (14 - t * 10)} ${yb - 20}`} stroke="#5C665E" strokeWidth={6 - t * 4} />)}
              </g>
            );
          })}
          {/* lámparas */}
          {[0.15, 0.4, 0.62].map((t, i) => <ellipse key={i} cx={960} cy={t * 380 + 20} rx={300 * (1 - t)} ry={420 * (1 - t)} fill="url(#lamp)" />)}
          {/* línea del suelo (la milla verde) */}
          <path d="M960 1080 L960 620" stroke="#8FD19E" strokeWidth={10} opacity={0.35} strokeDasharray="30 30" />
        </svg>
        {/* guardia y preso al fondo */}
        <div style={{ position: 'absolute', left: 836, top: 620, transform: 'translateY(-100%)', display: 'flex', gap: 34, alignItems: 'flex-end' }}>
          <div style={{ opacity: rampOut(frame, fGuard - 6, fGuard + 8) }}><Person h={170} c="#0A0C0A" /></div>
          <div style={{ position: 'relative', opacity: rampOut(frame, fPreso - 6, fPreso + 8) }}>
            <div style={{ position: 'absolute', left: -120, top: -60, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,236,170,0.75), rgba(255,236,170,0) 62%)', opacity: glow, transform: `scale(${0.9 + 0.1 * Math.sin(frame / 8)})` }} />
            <Person h={232} c="#0A0C0A" big />
            {Array.from({ length: 18 }).map((_, i) => {
              const t = (frame - fDon) / 50 + random(`gl${i}`) * 3;
              if (glow <= 0) return null;
              return <div key={i} style={{ position: 'absolute', left: 50 + Math.sin(t * 2 + i) * 60, top: 100 - ((t * 40) % 140), width: 6, height: 6, borderRadius: '50%', background: '#FFE7A0', opacity: glow * 0.8 }} />;
            })}
          </div>
        </div>
      </Cam>
      {/* año */}
      <div style={{ position: 'absolute', right: 110, top: 100, fontFamily: font.sans, fontWeight: 700, fontSize: 130, color: '#E8D59A', opacity: rampOut(frame, fAnio - 2, fAnio + 10) * (1 - booklets), transform: `rotate(-6deg) scale(${1.3 - 0.3 * sp(frame, fAnio, 10, 240)})` }}>1932</div>
      {/* seis libritos */}
      {booklets > 0 && (
        <AbsoluteFill style={{ background: `rgba(10,14,11,${0.6 * booklets})`, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 24, transform: `translateY(${(1 - booklets) * 80}px)` }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const s = sp(frame, fSeis - 8 + i * 4, 13, 200);
              return (
                <div key={i} style={{ width: 170, height: 255, borderRadius: 6, background: '#2D5A3D', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', opacity: s, transform: `translateY(${(1 - s) * 60}px) rotate(${(i - 2.5) * 3}deg)` }}>
                  <div style={{ position: 'absolute', inset: 10, border: '2px solid rgba(232,213,154,0.6)', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: '#F2EEDC' }}>ZIELONA MILA</div>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 92, color: '#E8D59A' }}>{i + 1}</div>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: font.serif, fontSize: 20, color: '#F2EEDC', opacity: 0.8 }}>1996</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 60, fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: '#fff', opacity: rampOut(frame, fSerie - 10, fSerie + 6) }}>Wydana w <span style={{ color: color.yellow }}>sześciu częściach</span></div>
        </AbsoluteFill>
      )}
      <Dust n={40} />
      {!booklets && <StoryChips items={[{ label: 'Korytarz śmierci', at: fCorr }, { label: 'Strażnik', at: fGuard }, { label: 'Więzień z niezwykłym darem', at: fPreso }]} />}
      <Sfx name="stamp" at={fAnio + 2} volume={0.5} />
      <Sfx name="sk_snow" at={fGuard - 10} volume={0.25} />
      <Sfx name="shimmer" at={fDon} volume={0.6} />
      {Array.from({ length: 6 }).map((_, i) => <Sfx key={i} name="card_flip" at={fSeis - 6 + i * 4} volume={0.55} />)}
    </AbsoluteFill>
  );
};

// 4 · 22/11/63: la puerta de la despensa, el salto a 1958 y el calendario hasta el 22 de noviembre de 1963.
const V2263: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fDesp = c.at('G22', 'spiżarni');
  const fPas = c.at('G22', 'prowadzi');
  const f58 = c.at('G22', 'tysiąc');
  const fAg = c.at('G22', 'Bohater');
  const f22 = c.at('G22', 'dwudziestego');
  const fImp = c.at('G22', 'zapobiec');
  const fKen = c.at('G22', 'Kenediego');
  const open = ramp(frame, fPas - 6, fPas + 18);
  const year = Math.round(interpolate(frame, [fPas + 4, f58 + 30], [2011, 1958], { ...clamp, easing: easeInOut }));
  const toCal = ramp(frame, fAg - 14, fAg + 6);
  const calY = Math.round(interpolate(frame, [fAg, f22 + 10], [1958, 1963], { ...clamp, easing: easeInOut }));
  const circle = ramp(frame, fImp - 10, fImp + 14);
  return (
    <AbsoluteFill style={{ background: '#2A1F17', overflow: 'hidden' }}>
      {toCal < 1 && (
        <AbsoluteFill style={{ opacity: 1 - toCal }}>
          <Cam keys={[{ f: 0, s: 1.06, x: 0, y: 0 }, { f: fPas, s: 1.12, x: 0, y: 0 }, { f: f58 + 30, s: 2.4, x: 0, y: 60 }]}>
            {/* pared del restaurante con azulejos y un mostrador */}
            <AbsoluteFill style={{ background: 'linear-gradient(180deg, #F3E7D3 0%, #E7D6BC 62%, #8C1C13 62%, #8C1C13 66%, #2A1F17 66%)' }} />
            <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.05) 2px, transparent 2px)', backgroundSize: '60px 60px', height: 670 }} />
            <div style={{ position: 'absolute', left: 1400, top: 200, fontFamily: font.serif, fontStyle: 'italic', fontSize: 80, color: '#8C1C13', border: '6px solid #8C1C13', padding: '4px 34px', borderRadius: 20 }}>Diner</div>
            {/* puerta de la despensa */}
            <div style={{ position: 'absolute', left: 820, top: 230, width: 280, height: 480, perspective: 1400 }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(255,240,200,${open}) 0%, rgba(255,200,120,${0.6 * open}) 40%, #120D09 80%)` }} />
              <div style={{ position: 'absolute', inset: 0, background: '#5A3F2A', transformOrigin: 'left center', transform: `rotateY(${-100 * open}deg)`, boxShadow: 'inset 0 0 0 10px #4A3222', backfaceVisibility: 'hidden' }}>
                <div style={{ position: 'absolute', left: 30, right: 30, top: 40, height: 60, borderRadius: 6, background: '#F3E7D3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: '#5A3F2A' }}>SPIŻARNIA</div>
                <div style={{ position: 'absolute', right: 26, top: 250, width: 20, height: 20, borderRadius: '50%', background: '#D8A23F' }} />
              </div>
              <div style={{ position: 'absolute', left: -14, top: -14, right: -14, bottom: 0, border: '14px solid #3B2A1D', borderBottom: 'none', borderRadius: 4, opacity: 1, boxShadow: rampOut(frame, fDesp - 4, fDesp + 10) > 0 ? `0 0 0 ${6 * rampOut(frame, fDesp - 4, fDesp + 10)}px ${color.yellow}` : undefined }} />
            </div>
            {/* año que retrocede, dentro del pasadizo */}
            <div style={{ position: 'absolute', left: 820, top: 400, width: 280, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 70, color: '#2A1F17', opacity: open, fontVariantNumeric: 'tabular-nums' }}>{year}</div>
          </Cam>
        </AbsoluteFill>
      )}
      {toCal > 0 && (
        <AbsoluteFill style={{ opacity: toCal, background: 'linear-gradient(180deg, #F3E7D3, #E3D1B5)', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 620, height: 640, borderRadius: 28, background: '#fff', boxShadow: shadow.card, overflow: 'hidden', transform: `rotate(${-2 + 2 * toCal}deg)` }}>
            <div style={{ height: 150, background: '#8C1C13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: 4 }}>
              {frame < f22 - 6 ? calY : 'LISTOPAD 1963'}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 300, color: color.ink, lineHeight: 1 }}>
              {frame < f22 - 6 ? Math.max(1, Math.floor(((frame * 7) % 28) + 1)) : 22}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 44, color: color.ink2, opacity: rampOut(frame, f22, f22 + 12) }}>Dallas</div>
            {/* círculo rojo */}
            <svg width={620} height={640} style={{ position: 'absolute', left: 0, top: 0 }}>
              {circle > 0.01 && <ellipse cx="310" cy="320" rx="230" ry="190" stroke={KR} strokeWidth="12" fill="none" pathLength={1} strokeDasharray={`${circle} 1`} strokeLinecap="round" transform="rotate(-8 310 320)" />}
            </svg>
          </div>
          <div style={{ marginTop: 50, fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: color.ink, opacity: rampOut(frame, fImp - 4, fImp + 10) }}>Cel: <span style={{ color: KR }}>zapobiec zamachowi</span></div>
        </AbsoluteFill>
      )}
      <StoryChips dark={toCal < 0.5} items={[{ label: 'Spiżarnia w barze', at: fDesp }, { label: 'Przejście do 1958 roku', at: f58 }, { label: 'Cel: 22.11.1963', at: f22, red: true }]} />
      <Sfx name="focus" at={fDesp} volume={0.6} />
      <Sfx name="sk_door" at={fPas - 6} volume={0.6} />
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fPas + 4, f58 + 30], [2011, 1958], { ...clamp, easing: easeInOut })))} from={fPas + 4} to={f58 + 30} volume={0.5} />
      <Sfx name="whoosh_deep" at={f58 + 26} volume={0.6} />
      <Sfx name="page_riffle" at={fAg + 4} volume={0.8} />
      <Sfx name="stamp" at={f22} volume={0.6} />
      <Sfx name="draw" at={fImp - 10} volume={0.6} dur={26} fade={6} />
      {fKen > 0 && null}
    </AbsoluteFill>
  );
};

// 5 · Mr. Mercedes: la carta del asesino, los faros, el premio Edgar y la trilogía.
const VMercedes: React.FC<{ c: Clock; from: number; to: number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const fPol = c.at('G24', 'policjant');
  const fCarta = c.at('G24', 'list');
  const fAses = c.at('G24', 'mordercy');
  const fNunca = c.at('G24', 'nigdy');
  const fGano = c.at('G24', 'zdobyła');
  const fEdgar = c.at('G24', 'Edgara');
  const fTri = c.at('G24', 'trylogię');
  const env = sp(frame, fCarta - 16, 16, 120);
  const openL = ramp(frame, fCarta + 4, fCarta + 20);
  const letter = ramp(frame, fCarta + 14, fAses + 10);
  const toAward = ramp(frame, fGano - 12, fGano + 6);
  const tri = ramp(frame, fTri - 16, fTri + 4);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #2B2D33 0%, #141518 70%)', overflow: 'hidden' }}>
      {/* faros que barren */}
      <div style={{ position: 'absolute', left: -600 + ((frame * 9) % 3200), top: 200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,245,210,0.18), rgba(255,245,210,0) 60%)' }} />
      <AbsoluteFill style={{ opacity: 1 - toAward, transform: `scale(${1 - 0.1 * toAward})` }}>
        <Cam keys={[{ f: 0, s: 1.02, x: 0, y: 0 }, { f: fNunca + 20, s: 1.07, x: 0, y: 0 }]}>
          {/* placa de policía (genérica) */}
          <div style={{ position: 'absolute', left: 230, top: 330, opacity: rampOut(frame, fPol - 6, fPol + 8), transform: `rotate(-8deg) scale(${0.8 + 0.2 * sp(frame, fPol - 4, 12, 180)})` }}>
            <svg width="260" height="300" viewBox="0 0 26 30"><path d="M13 1 L24 5 V14 C24 21 19 26 13 29 C7 26 2 21 2 14 V5Z" fill="#C9A24A" stroke="#7A5A1A" strokeWidth="1" /><circle cx="13" cy="14" r="6" fill="#E9C873" stroke="#7A5A1A" strokeWidth="0.8" /><path d="M13 10.5l1 2.2 2.4.3-1.8 1.6.5 2.4L13 15.8l-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z" fill="#7A5A1A" /></svg>
            <div style={{ position: 'absolute', left: -20, right: -20, top: 250, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: '#fff', background: KR, borderRadius: 8, padding: '6px 0', transform: 'rotate(6deg)' }}>EMERYT</div>
          </div>
          {/* sobre */}
          <div style={{ position: 'absolute', left: 960 - 330, top: 470, width: 660, height: 420, transform: `translateY(${(1 - env) * 400}px) rotate(${(1 - env) * -10 - 2}deg)`, perspective: 1200 }}>
            {/* carta que sale */}
            <div style={{ position: 'absolute', left: 50, right: 50, top: 30 - letter * 300, height: 380, background: PAPER, borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', padding: 34 }}>
              <div style={{ width: '46%', height: 12, borderRadius: 6, background: 'rgba(30,30,30,0.7)' }} />
              {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ marginTop: 18, height: 10, borderRadius: 5, background: 'rgba(30,30,30,0.5)', width: `${92 - (i * 13) % 40}%` }} />)}
              <div style={{ position: 'absolute', right: 34, bottom: 30, width: 140, height: 12, borderRadius: 6, background: KR, opacity: rampOut(frame, fAses, fAses + 10) }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: '#E9E1CF', borderRadius: 10, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 240, transformOrigin: 'top center', transform: `rotateX(${180 * openL}deg)`, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: '#D9CFB8' }} />
            <div style={{ position: 'absolute', left: 230, top: 260, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#4A4030', opacity: 1 - openL }}>Det. Bill Hodges (emeryt)</div>
          </div>
        </Cam>
      </AbsoluteFill>
      {toAward > 0 && (
        <AbsoluteFill style={{ opacity: toAward, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ opacity: 1 - tri, transform: `scale(${(0.8 + 0.2 * sp(frame, fEdgar - 6, 11, 160)) * (1 - 0.3 * tri)})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFE28A, #D9A441 55%, #8A6420)', boxShadow: '0 30px 70px rgba(0,0,0,0.6), inset 0 0 0 14px rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: 6, color: '#4A3410' }}>NAGRODA</div>
              <div style={{ fontFamily: font.serif, fontSize: 124, color: '#3A2808', lineHeight: 1 }}>Edgar</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: '#4A3410', marginTop: 10 }}>2015</div>
            </div>
            <div style={{ marginTop: 44, fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: '#fff' }}>Najlepsza powieść</div>
          </div>
          {tri > 0 && (
            <div style={{ position: 'absolute', display: 'flex', gap: 60, opacity: tri, transform: `translateY(${(1 - tri) * 60}px)` }}>
              {['mercedes', 'quien', 'fin'].map((k, i) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, transform: `translateY(${(1 - sp(frame, fTri - 10 + i * 5, 14, 170)) * 80}px)` }}>
                  <Book3D b={BOOKS[k]} w={240} h={360} d={40} ry={-14 + i * 6} rx={3} />
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff' }}>{i + 1}</div>
                </div>
              ))}
            </div>
          )}
          {tri > 0 && <div style={{ position: 'absolute', top: 90, fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: '#fff', opacity: tri }}>Trylogia o Billu Hodgesie</div>}
        </AbsoluteFill>
      )}
      {toAward < 0.5 && <StoryChips items={[{ label: 'Emerytowany policjant', at: fPol }, { label: 'List od mordercy', at: fCarta + 6 }, { label: 'Nigdy go nie złapano', at: fNunca, red: true }]} />}
      <Sfx name="swipe" at={fCarta - 12} volume={0.7} />
      <Sfx name="sk_peel" at={fCarta + 6} volume={0.7} />
      <Sfx name="page_turn" at={fCarta + 16} volume={0.6} />
      <Sfx name="sk_heart" at={fNunca + 4} volume={0.5} />
      <Sfx name="success" at={fEdgar} volume={0.6} />
      <Sfx name="sparkle" at={fEdgar + 4} volume={0.6} />
      {['a', 'b', 'c'].map((_, i) => <Sfx key={i} name="sk_book_thud" at={fTri - 6 + i * 5} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// ———————————————— Escenas ————————————————

export const D1: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'D1', n: 1, book: 'resplandor', kicker: 'Klasyczny horror', headline: 'Pierwsze wejście', voA: 'G14', voB: 'G15', titleWord: 'Lśnienie', fear: 3, fearLabel: 'Strach',
    kickerAt: (c) => c.at('G14', 'Klasyczny'),
    cStart: (c) => c.part('G16') - 4, hoursAt: (c) => c.at('G16', 'dwadzieścia') - 4,
    facts: (c) => [
      { icon: 'mic', label: 'Woronowicz · Kulesza · Gosztyła', sub: 'słuchowisko z obsadą aktorską', at: c.at('G16', 'słuchowisko') },
      { icon: 'clock', label: '21 h 8 min', sub: 'po polsku', at: c.at('G16', 'dwadzieścia') - 4 },
      { icon: 'star', label: '4,7 / 5', sub: 'ponad 1000 ocen w Audiotece', at: c.at('G16', 'godzin') + 6 },
    ],
    quote: { text: 'Najbardziej przeraża to, co dzieje się z ojcem.', at: (c) => c.at('G16', 'Najbardziej') },
    Vignette: VShining,
  }} />
);
export const D2: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'D2', n: 2, book: 'misery', kicker: 'Realistyczny strach', headline: 'Drugie wejście', voA: 'G17', voB: 'G18', titleWord: 'Mizeri', fear: 2, fearLabel: 'Strach',
    kickerAt: (c) => c.at('G17', 'Strach'),
    cStart: (c) => c.at('G18', 'polsku') - 20, hoursAt: (c) => c.at('G18', 'piętnaście') - 4,
    facts: (c) => [
      { icon: 'mic', label: 'Krzysztof Plewako-Szczerbiński', sub: 'lektor', at: c.at('G18', 'Krzysztof') - 4 },
      { icon: 'clock', label: '15 h 10 min', sub: 'audiobook po polsku', at: c.at('G18', 'piętnaście') - 4 },
    ],
    Vignette: VMisery,
  }} />
);
export const D3: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'D3', n: 3, book: 'milla', kicker: 'Jeśli nie lubisz horrorów', headline: 'Trzecie wejście', voA: 'G19', voB: 'G20', titleWord: 'Zielona', fear: 1, fearLabel: 'Strach',
    kickerAt: (c) => c.at('G19', 'Jeśli'),
    cStart: (c) => c.at('G20', 'polsku') - 20, hoursAt: (c) => c.at('G20', 'piętnaście') - 4,
    facts: (c) => [
      { icon: 'mic', label: 'Zbigniew Zapasiewicz', sub: '15 h 35 min', at: c.at('G20', 'Zbigniew') - 4 },
      { icon: 'mic', label: 'Piotr Głowacki', sub: 'nowsze nagranie · 15 h 48 min', at: c.at('G20', 'Piotr') - 4 },
    ],
    Vignette: VMilla,
  }} />
);
export const D4: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'D4', n: 4, book: 'd2263', kicker: 'Science fiction i historia', headline: 'Czwarte wejście', voA: 'G21', voB: 'G22', titleWord: 'Dallas', fear: 1, fearLabel: 'Strach',
    kickerAt: (c) => c.at('G21', 'Sajens'),
    cStart: (c) => c.at('G22', 'Czyta') - 14, hoursAt: (c) => c.at('G22', 'dwadzieścia') - 4,
    facts: (c) => [
      { icon: 'mic', label: 'Filip Kosior', sub: 'lektor', at: c.at('G22', 'Filip') - 4 },
      { icon: 'clock', label: '27 h 27 min', sub: 'audiobook po polsku', at: c.at('G22', 'dwadzieścia') - 4 },
    ],
    Vignette: V2263,
  }} />
);
export const D5: React.FC = () => (
  <DoorScene cfg={{
    sceneId: 'D5', n: 5, book: 'mercedes', kicker: 'Thriller', headline: 'Piąte wejście', voA: 'G23', voB: 'G24', titleWord: 'Mercedes', fear: 2, fearLabel: 'Strach',
    kickerAt: (c) => c.at('G23', 'Triller'),
    cStart: (c) => c.at('G24', 'Całą') - 16, hoursAt: (c) => c.at('G24', 'piętnaście') - 4,
    facts: (c) => [
      { icon: 'mic', label: 'Jan Peszek', sub: 'czyta całą trylogię', at: c.at('G24', 'Peszek') - 4 },
      { icon: 'clock', label: '15 h 31 min', sub: 'pierwszy tom', at: c.at('G24', 'piętnaście') - 4 },
    ],
    Vignette: VMercedes,
  }} />
);

// ——— CORTOS · G25 · Si tienes poco tiempo ———
export const Cortos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORTOS');
  const fCarrie = c.at('G25', 'Carrie');
  const fOcho = c.at('G25', 'siedem');
  const fElev = c.at('G25', 'Uniesienie');
  const fTres = c.at('G25', 'trzy');
  const items = [
    { k: 'carrie', at: fCarrie, hours: 7.2, label: '7 h 12 min', sub: 'jego pierwsza powieść · czyta Filip Kosior', valAt: fOcho },
    { k: 'elevacion', at: fElev, hours: 3.07, label: '3 h 4 min', sub: 'krótka powieść · czyta Leszek Filipowicz', valAt: fTres },
  ];
  const sw = sp(frame, 4, 14, 160);
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.03, x: 0, y: 0 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
        <div style={{ position: 'absolute', left: 260, top: 130, display: 'flex', alignItems: 'center', gap: 30 }}>
          <div style={{ transform: `scale(${sw}) rotate(${(1 - sw) * -40}deg)` }}>
            <svg width="110" height="110" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8.5" fill="#fff" stroke={color.ink} strokeWidth="1.8" /><path d="M12 13V8.5" stroke={KR} strokeWidth="2" strokeLinecap="round" transform={`rotate(${frame * 6} 12 13)`} /><path d="M10 2.5h4M12 2.5v2" stroke={color.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <MaskTitle text="Mało czasu?" at={2} size={110} />
        </div>
        {items.map((it, i) => {
          const s = sp(frame, 10 + i * 6, 15, 150);
          const on = 0.45 + 0.55 * ramp(frame, it.at - 8, it.at + 6);
          return (
            <div key={it.k} style={{ position: 'absolute', left: 260, top: 330 + i * 330, display: 'flex', alignItems: 'center', gap: 60, opacity: s * on, transform: `translateY(${(1 - s) * 60}px)` }}>
              <Book3D b={BOOKS[it.k]} w={200} h={300} d={30} ry={-18} rx={3} />
              <div>
                <HoursBar hours={it.hours} label={BOOKS[it.k].title} at={it.at} trackAt={10 + i * 6} width={1100} maxH={12} c={i === 0 ? KR : color.ink} h={56} size={1.5} showValue={frame > it.valAt - 6 ? it.label : undefined} />
                <div style={{ marginTop: 16, fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2, opacity: rampOut(frame, it.at + 20, it.at + 34) }}>{it.sub}</div>
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
export const _d = { Burst, SkNight, keyframes };

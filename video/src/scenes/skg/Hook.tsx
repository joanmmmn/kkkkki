import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut, fmtEs } from '../../lib/anim';
import { Sfx, ChangeTicks } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import {
  BOOKS, Book3D, Cam, color, font, KR, NOVELS, ramp, rampOut, shadow, SkNight, SkStage, Spine, SERIES, useSpring, MiniIcon, CoverIcon,
} from './kit';
import { sceneClock } from './timeline';

const BUBBLES: { t: string; x: number; y: number; tail: 'left' | 'right' }[] = [
  { t: '¿It o El resplandor?', x: 520, y: 300, tail: 'left' },
  { t: '¿Hay que leerlo en orden?', x: 1390, y: 250, tail: 'right' },
  { t: '¿Cuál da más miedo?', x: 1240, y: 560, tail: 'left' },
  { t: '¿Y si no me gusta el terror?', x: 610, y: 720, tail: 'right' },
  { t: '¿Por cuál empiezo?', x: 1420, y: 840, tail: 'left' },
];
const SPINE_COLORS = ['#7A0A12', '#1B2838', '#2D5A3D', '#3B3E44', '#B07D2B', '#4A2E80', '#5A3F31', '#103E40', '#24314A', '#2B2238', '#8C1C13', '#38393D'];
const ACCENTS = ['#D9A441', '#E8D59A', '#F2C94C', '#E3463C', '#9DB8E2'];

// ——— HOOK · G01–G02 · La pared de libros ———
// Tres baldas se llenan de lomos (las novelas en orden de publicación) mientras la voz enumera; luego cae una lluvia de
// páginas sueltas (los relatos) y el contador de años corre de 1974 a hoy. La cámara se aleja y aparece la pregunta.
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const fNov = c.at('G01', 'sesenta');
  const fRel = c.at('G01', 'doscientos');
  const fSig = c.at('G01', 'Medio');
  const fQ = c.part('G02');
  const fPor = c.at('G02', 'por');
  const fKing = c.at('G02', 'Stephen');
  // Baldas: 3 filas de lomos; cada lomo cae con muelle, en orden de publicación.
  const rows = [0, 1, 2];
  const perRow = 22;
  const spineW = 82;
  const startX = (1920 - perRow * (spineW + 4)) / 2;
  const dropAt = (i: number) => fNov - 16 + i * 1.15;
  const spines = NOVELS.slice(0, perRow * 3).map((t, i) => ({ t, i, row: Math.floor(i / perRow), col: i % perRow }));
  const shelfY = (r: number) => 150 + r * 292;
  // Cámara: empieza cerca del centro, se aleja con la pregunta.
  const pull = ramp(frame, fQ - 6, fQ + 70);
  const dim = ramp(frame, fQ, fQ + 40);
  // Estadísticas que se suceden.
  const statIn = (a: number) => interpolate(frame, [a - 2, a + 12], [0, 1], { ...clamp, easing: easeOut });
  const statOut = (b: number) => interpolate(frame, [b - 10, b], [0, 1], { ...clamp, easing: easeInOut });
  const s1 = statIn(fNov) * (1 - statOut(fRel));
  const s2 = statIn(fRel) * (1 - statOut(fSig));
  const s3 = statIn(fSig) * (1 - statOut(fQ + 4));
  const year = Math.round(interpolate(frame, [fSig, fSig + 46], [1974, 2026], { ...clamp, easing: easeOut }));
  const yearText = String(year);
  return (
    <SkNight lamp={[960, 380]}>
      <Cam keys={[{ f: 0, s: 1.14, x: 0, y: 40 }, { f: fQ - 6, s: 1.05, x: 0, y: 10 }, { f: fQ + 80, s: 0.92, x: 0, y: -10 }]}>
        <AbsoluteFill style={{ filter: dim > 0.01 ? `blur(${(dim * 7).toFixed(2)}px) brightness(${1 - dim * 0.45})` : undefined }}>
          {rows.map((r) => (
            <div key={r} style={{ position: 'absolute', left: startX - 40, width: perRow * (spineW + 4) + 80, top: shelfY(r) + 262, height: 22, borderRadius: 4,
              background: 'linear-gradient(180deg, #4A3A2C 0%, #2E241B 100%)', boxShadow: '0 18px 30px rgba(0,0,0,0.55)', opacity: ramp(frame, 0, 30) }} />
          ))}
          {spines.map(({ t, i, row, col }) => {
            const a = dropAt(i);
            const s = spring({ frame: frame - a, fps: 50, config: { damping: 13, stiffness: 190, mass: 0.7 } });
            if (frame < a) return null;
            const h = 214 + Math.round(random(`h${i}`) * 46);
            const w = spineW - Math.round(random(`w${i}`) * 18);
            const tilt = random(`t${i}`) < 0.08 ? (random(`d${i}`) - 0.5) * 8 : 0;
            const y = shelfY(row) + 262 - h;
            return (
              <div key={t} style={{ position: 'absolute', left: startX + col * (spineW + 4) + (spineW - w) / 2, top: y, transform: `translateY(${(1 - s) * -620}px) rotate(${tilt}deg)`, transformOrigin: 'bottom center' }}>
                <Spine title={t} w={w} h={h} bg={SPINE_COLORS[(i * 7) % SPINE_COLORS.length]} accent={ACCENTS[i % ACCENTS.length]} />
              </div>
            );
          })}
          {/* Lluvia de páginas: los relatos */}
          {frame >= fRel - 4 && Array.from({ length: 90 }).map((_, i) => {
            const r = (k: string) => random(`pg-${i}-${k}`);
            const t0 = fRel - 4 + r('t') * 40;
            const tt = frame - t0;
            if (tt < 0) return null;
            const x = r('x') * 1920 + Math.sin(tt / (12 + r('w') * 10) + r('p') * 6) * 40;
            const y = -80 + tt * (6 + r('v') * 6);
            if (y > 1160) return null;
            const rot = (r('r') - 0.5) * 80 + tt * (r('s') - 0.5) * 6;
            const flip = Math.cos(tt / (6 + r('f') * 8));
            return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 46, height: 62, background: '#EFE9DC', borderRadius: 2, boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
              transform: `rotate(${rot}deg) scaleX(${flip.toFixed(3)})`, opacity: 0.92,
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 9px, rgba(0,0,0,0.12) 9px 10px)', backgroundSize: '100% 100%', backgroundPosition: '0 8px' }} />;
          })}
        </AbsoluteFill>
      </Cam>
      {/* Cifras */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[{ o: s1, big: '+60', small: 'novelas' }, { o: s2, big: '+200', small: 'relatos' }, { o: s3, big: '+50', small: 'años escribiendo', sub: `1974 → ${yearText}` }].map((s, k) => s.o > 0.002 && (
          <div key={k} style={{ position: 'absolute', textAlign: 'center', opacity: s.o, transform: `scale(${0.9 + 0.1 * s.o})`, filter: s.o < 0.99 ? `blur(${(1 - s.o) * 10}px)` : undefined }}>
            <div style={{ position: 'absolute', left: -260, right: -260, top: -120, bottom: -120, background: 'radial-gradient(ellipse, rgba(10,10,12,0.82) 0%, rgba(10,10,12,0.55) 45%, rgba(10,10,12,0) 72%)' }} />
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 250, letterSpacing: -10, lineHeight: 0.9, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.big}</div>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: 1, color: color.yellow, marginTop: 14 }}>{s.small}</div>
            {'sub' in s && s.sub && <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: 'rgba(255,255,255,0.75)', marginTop: 10, fontVariantNumeric: 'tabular-nums' }}>{s.sub}</div>}
          </div>
        ))}
      </AbsoluteFill>
      {/* Las dudas de siempre: bocadillos que aparecen mientras la voz plantea la pregunta */}
      {frame >= fQ && frame < fPor + 30 && BUBBLES.map((b, k) => {
        const a = fQ + 6 + k * 15;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 190 } });
        const o = ramp(frame, fPor - 8, fPor + 6);
        if (frame < a) return null;
        return (
          <div key={k} style={{ position: 'absolute', left: b.x, top: b.y, transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * s) * (1 - 0.2 * o)})`, opacity: s * (1 - o), filter: o > 0.01 ? `blur(${o * 8}px)` : undefined }}>
            <div style={{ position: 'relative', background: '#fff', color: color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 38, padding: '18px 30px', borderRadius: 26, boxShadow: '0 24px 50px rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
              {b.t}
              <div style={{ position: 'absolute', [b.tail]: 40, bottom: -14, width: 28, height: 28, background: '#fff', transform: 'rotate(45deg)', borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
      {/* La pregunta */}
      {frame >= fQ && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <MaskTitle text="¿Por dónde empiezo" at={fPor - 2} size={132} align="center" color="#fff" />
          <MaskTitle text="con Stephen King?" at={fKing - 8} size={132} align="center" color={color.yellow} style={{ marginTop: -6 }} />
        </AbsoluteFill>
      )}
      <Sfx name="reverse_swell" at={fNov - 2} volume={0.6} />
      {Array.from({ length: 12 }).map((_, k) => <Sfx key={k} name="snap_in" at={Math.round(dropAt(k * 5 + 2)) + 6} volume={0.28 + 0.1 * (k % 3)} />)}
      <Sfx name="hit_soft" at={fNov} volume={0.8} />
      <Sfx name="page_riffle" at={fRel + 4} volume={0.9} />
      <Sfx name="hit_soft" at={fRel} volume={0.6} />
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fSig, fSig + 46], [1974, 2026], { ...clamp, easing: easeOut })))} from={fSig} to={fSig + 46} volume={0.6} />
      <Sfx name="whoosh_deep" at={fQ + 2} volume={0.6} />
      {BUBBLES.map((_, k) => <Sfx key={`bb${k}`} name="ui_pop" at={fQ + 7 + k * 15} volume={0.55} />)}
      <Sfx name="impact" at={fKing} volume={0.55} />
    </SkNight>
  );
};

// ——— HOURS · G03 · Más de 700 horas: un mes entero ———
export const Hours: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOURS');
  const fSolo = c.at('G03', 'solo');
  const fSonor = c.at('G03', 'SonorBooks');
  const fSuman = c.at('G03', 'suman');
  const fSet = c.at('G03', 'setecientas');
  const fMes = c.at('G03', 'mes');
  const fDia = c.at('G03', 'día');
  const fNoche = c.at('G03', 'noche');
  const fSin = c.at('G03', 'sin');
  const N = 39;
  const fShelf = Math.min(fSolo, 6);
  const up = 190 * (1 - ramp(frame, fSuman - 14, fSuman + 6));
  const count = interpolate(frame, [fSuman, fSet + 40], [0, 724], { ...clamp, easing: easeOut });
  const toCal = ramp(frame, fMes - 10, fMes + 16);
  const days = 30;
  const dayAt = (i: number) => fMes + 2 + i * 1.6;
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.04, x: 0, y: 0 }, { f: fMes - 10, s: 1, x: 0, y: 0 }, { f: c.dur, s: 1.03, x: 0, y: -6 }]}>
        {/* Estantería de audiolibros (39 lomos) que entra al decir «solo sus audiolibros» */}
        <AbsoluteFill style={{ opacity: 1 - toCal, transform: `translateY(${-toCal * 60}px) scale(${1 - toCal * 0.06})`, filter: toCal > 0.01 ? `blur(${toCal * 8}px)` : undefined }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120 + up, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 30px 14px 18px', background: '#fff', borderRadius: 999, boxShadow: shadow.float, border: `1px solid ${color.line}`,
              opacity: rampOut(frame, 2, 16), transform: `translateY(${(1 - rampOut(frame, 2, 16)) * 20}px)` }}>
              <LogoIcon size={46} />
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32 }}>Stephen King en audiolibro · <span style={{ color: frame >= fSonor ? color.ink : color.muted }}>catálogo de SonorBooks España</span></span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 250 + up, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 5, height: 300 }}>
            {Array.from({ length: N }).map((_, i) => {
              const a = fShelf + i * 1.1;
              const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 200 } });
              const h = 220 + Math.round(random(`ah${i}`) * 70);
              return <div key={i} style={{ transform: `translateY(${(1 - s) * 80}px)`, opacity: s }}>
                <Spine title={NOVELS[(i * 5) % NOVELS.length]} w={36} h={h} bg={SPINE_COLORS[(i * 5) % SPINE_COLORS.length]} accent={ACCENTS[i % 5]} author={false} />
              </div>;
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 580, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26, opacity: rampOut(frame, fSuman - 4, fSuman + 8) }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 260, letterSpacing: -12, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{fmtEs(Math.round(count))}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: color.ink }}>horas</span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 38, color: color.ink2, opacity: rampOut(frame, fSet, fSet + 14) }}>
            39 audiolibros de Stephen King en español
          </div>
        </AbsoluteFill>
        {/* Calendario: un mes entero, día y noche */}
        {frame >= fMes - 12 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: toCal, transform: `translateY(${(1 - toCal) * 50}px)` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 86, letterSpacing: -3, color: color.ink, marginBottom: 40 }}>
              ≈ 30 días <span style={{ color: KR }}>sin parar</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 112px)', gap: 14, padding: 34, background: '#fff', borderRadius: 32, boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
              {Array.from({ length: days }).map((_, i) => {
                const a = dayAt(i);
                const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 210 } });
                const night = frame > fNoche - 4 ? ramp(frame, fNoche - 4 + i * 0.8, fNoche + 8 + i * 0.8) : 0;
                return (
                  <div key={i} style={{ position: 'relative', height: 112, borderRadius: 18, background: `rgba(16,16,16,${0.05 + 0.85 * night})`, overflow: 'hidden', transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>
                    <div style={{ position: 'absolute', left: 12, top: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: night > 0.5 ? '#fff' : color.ink }}>{i + 1}</div>
                    <div style={{ position: 'absolute', right: 12, bottom: 10, opacity: 1 - night }}>
                      <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill={color.yellow} />{Array.from({ length: 8 }).map((_, k) => { const an = (k * Math.PI) / 4; return <path key={k} d={`M${12 + Math.cos(an) * 7} ${12 + Math.sin(an) * 7}L${12 + Math.cos(an) * 9.5} ${12 + Math.sin(an) * 9.5}`} stroke={color.yellow} strokeWidth="2" strokeLinecap="round" />; })}</svg>
                    </div>
                    <div style={{ position: 'absolute', right: 14, bottom: 12, opacity: night }}><CoverIcon kind="moon" size={34} c={color.yellow} sw={2} /></div>
                    <div style={{ position: 'absolute', left: 12, bottom: 14, opacity: s }}><MiniIcon kind="head" size={30} c={night > 0.5 ? color.yellow : color.ink} /></div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        )}
      </Cam>
      <Sfx name="ui_pop" at={fSonor} volume={0.7} />
      {Array.from({ length: 8 }).map((_, k) => <Sfx key={k} name="tick_soft" at={Math.round(fShelf + k * 5 * 1.1)} volume={0.5} />)}
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fSuman, fSet + 40], [0, 724], { ...clamp, easing: easeOut }) / 12))} from={fSuman} to={fSet + 40} volume={0.55} />
      <Sfx name="hit_soft" at={fSet + 10} volume={0.7} />
      <Sfx name="whoosh_soft" at={fMes - 2} volume={0.7} />
      {Array.from({ length: 10 }).map((_, k) => <Sfx key={`d${k}`} name="tick_soft" at={Math.round(dayAt(k * 3))} volume={0.4} />)}
      <Sfx name="shimmer" at={fNoche - 2} volume={0.6} />
      <Sfx name="stamp" at={fSin} volume={0.4} />
      {fDia > 0 && null}
    </SkStage>
  );
};

// ——— MAPA · G04 · El libro equivocado y el mapa del vídeo ———
export const Mapa: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MAPA');
  const fLibro = c.at('G04', 'libro');
  const fEquiv = c.at('G04', 'equivocado');
  const fNo = c.at('G04', 'no');
  const fMapa = c.at('G04', 'mapa');
  const stops = [
    { n: 1, label: 'Qué escribe', at: c.at('G04', 'qué', 1) },
    { n: 2, label: 'Cinco puertas de entrada', at: c.at('G04', 'cinco') },
    { n: 3, label: 'Mejor para después', at: c.at('G04', 'dejar') },
    { n: 4, label: 'En qué orden seguir', at: c.at('G04', 'orden') },
  ];
  const toMap = ramp(frame, fMapa - 16, fMapa + 6);
  // Tres libros; el del medio es el «equivocado» (gigante): cae con un golpe y se marca en rojo.
  const books = ['carrie', 'it', 'misery'];
  const wrong = rampOut(frame, fEquiv, fEquiv + 12);
  const fall = ramp(frame, fNo - 6, fNo + 10);
  const unfold = rampOut(frame, fMapa - 4, fMapa + 26);
  const pts: [number, number][] = [[360, 640], [790, 470], [1180, 650], [1560, 470]];
  const path = `M ${pts[0][0]} ${pts[0][1]} C 520 520, 640 420, ${pts[1][0]} ${pts[1][1]} S 1040 700, ${pts[2][0]} ${pts[2][1]} S 1420 420, ${pts[3][0]} ${pts[3][1]}`;
  const drawTo = Math.max(...stops.map((s, i) => (frame >= s.at ? (i + 1) / stops.length : 0)), 0);
  const draw = interpolate(frame, [stops[0].at - 6, stops[3].at + 10], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <SkStage>
      <AbsoluteFill style={{ opacity: 1 - toMap, filter: toMap > 0.01 ? `blur(${toMap * 10}px)` : undefined, transform: `scale(${1 + toMap * 0.08})` }}>
        <Cam keys={[{ f: 0, s: 1, x: 0, y: 0 }, { f: fEquiv, s: 1.08, x: 0, y: 10 }]}>
          <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 90 }}>
            {books.map((k, i) => {
              const s = spring({ frame: frame - (2 + i * 5), fps: 50, config: { damping: 15, stiffness: 160 } });
              const isW = i === 1;
              const big = isW ? 1 + 0.18 * wrong : 1 - 0.15 * wrong;
              const tip = isW ? fall * -7 : 0;
              return (
                <div key={k} style={{ transform: `translateY(${(1 - s) * 120 + (isW ? fall * 36 : 0)}px) scale(${big * (isW ? 1 - 0.06 * fall : 1)}) rotate(${tip}deg)`, transformOrigin: 'bottom center', opacity: s * (isW ? 1 : 1 - 0.55 * wrong), filter: !isW && wrong > 0.05 ? `grayscale(${wrong}) blur(${wrong * 2}px)` : undefined }}>
                  <Book3D b={BOOKS[k]} w={isW ? 330 : 270} h={isW ? 495 : 405} d={isW ? 110 : 52} ry={-22 + i * 22 + Math.sin(frame / 40 + i) * 3} rx={3} />
                </div>
              );
            })}
          </AbsoluteFill>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', opacity: wrong * (1 - fall * 0.2) }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: KR, padding: '12px 28px', borderRadius: 999, boxShadow: '0 20px 40px rgba(193,18,31,0.35)', transform: `scale(${0.8 + 0.2 * wrong})` }}>
              El libro equivocado
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', opacity: rampOut(frame, fNo - 2, fNo + 12) }}>
            <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: color.ink }}>«King no es para mí»</span>
          </div>
        </Cam>
      </AbsoluteFill>
      {frame >= fMapa - 18 && (
        <AbsoluteFill style={{ opacity: toMap }}>
          <Cam keys={[{ f: fMapa - 16, s: 0.94, x: 0, y: 20 }, { f: fMapa + 30, s: 1, x: 0, y: 0 }, { f: c.dur, s: 1.04, x: -10, y: 0 }]}>
            {/* El mapa: papel que se despliega en tres paneles */}
            <div style={{ position: 'absolute', left: 160, top: 170, width: 1600, height: 760, perspective: 3000 }}>
              {[0, 1, 2].map((k) => {
                const ang = k === 1 ? 0 : (1 - unfold) * (k === 0 ? 92 : -92);
                return (
                  <div key={k} style={{ position: 'absolute', left: (1600 / 3) * k, top: 0, width: 1600 / 3 + 1, height: 760, background: '#FBF8F1',
                    transformOrigin: k === 0 ? 'right center' : 'left center', transform: `rotateY(${ang}deg)`,
                    boxShadow: k === 1 ? '0 40px 90px rgba(16,16,16,0.16)' : '0 30px 60px rgba(16,16,16,0.10)', borderRadius: k === 0 ? '18px 0 0 18px' : k === 2 ? '0 18px 18px 0' : 0,
                    backgroundImage: 'linear-gradient(rgba(16,16,16,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,16,0.035) 1px, transparent 1px)', backgroundSize: '48px 48px' }}>
                    {k > 0 && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: 'linear-gradient(90deg, rgba(16,16,16,0.07), rgba(16,16,16,0))' }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: rampOut(frame, fMapa + 6, fMapa + 20) }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: color.muted, textTransform: 'uppercase' }}>El mapa de este vídeo</span>
            </div>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d={path} stroke={color.ink} strokeWidth={5} fill="none" strokeDasharray="2 16" strokeLinecap="round" pathLength={1000}
                style={{ strokeDashoffset: 0 }} opacity={0.18} />
              <path d={path} stroke={KR} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
            </svg>
            {stops.map((s, i) => {
              const p = spring({ frame: frame - s.at, fps: 50, config: { damping: 13, stiffness: 200 } });
              const [x, y] = pts[i];
              const below = i % 2 === 0;
              return (
                <div key={s.n} style={{ position: 'absolute', left: x, top: y }}>
                  <div style={{ position: 'absolute', left: -38, top: -38, width: 76, height: 76, borderRadius: '50%', background: frame >= s.at ? color.ink : '#fff', border: `4px solid ${color.ink}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: frame >= s.at ? color.yellow : color.ink, transform: `scale(${0.7 + 0.3 * Math.max(p, 0.001)})`, opacity: rampOut(frame, fMapa + i * 3, fMapa + 12 + i * 3) }}>{s.n}</div>
                  <div style={{ position: 'absolute', left: -300, width: 600, top: below ? 58 : -100, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 42, letterSpacing: -1, color: color.ink, opacity: p, transform: `translateY(${(1 - p) * (below ? 20 : -20)}px)` }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </Cam>
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_soft" at={fLibro - 6} volume={0.6} />
      <Sfx name="fail" at={fEquiv + 2} volume={0.5} />
      <Sfx name="impact" at={fNo + 8} volume={0.6} />
      <Sfx name="page_turn" at={fMapa + 2} volume={0.8} />
      {stops.map((s) => <Sfx key={s.n} name="ui_pop" at={s.at + 1} volume={0.75} />)}
      <Sfx name="draw" at={stops[0].at - 6} volume={0.5} dur={stops[3].at - stops[0].at + 16} fade={10} />
      {drawTo > 2 && null}
    </SkStage>
  );
};

// ——— TITLE · Cabecera de la sección ———
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = rampOut(frame, 4, 26);
  const name = spring({ frame: frame - 16, fps, config: { damping: 18, stiffness: 120 } });
  const out = ramp(frame, 160, 182);
  const line = rampOut(frame, 30, 60);
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.06, x: 0, y: 0 }, { f: 180, s: 1, x: 0, y: 0 }]}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 10}px)` : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: color.ink, background: color.yellow, padding: '8px 20px', borderRadius: 10 }}>AUTOR</span>
            <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: color.ink2 }}>Por dónde y cómo empezar a leer</span>
          </div>
          <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 230, letterSpacing: -11, lineHeight: 0.95, color: color.ink, display: 'flex' }}>
            {Array.from('Stephen King').map((ch, i) => {
              const s = spring({ frame: frame - 14 - i * 1.6, fps, config: { damping: 16, stiffness: 150 } });
              return <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: s, transform: `translateY(${(1 - s) * 60}px)`, filter: s < 0.99 ? `blur(${(1 - s) * 12}px)` : undefined }}>{ch}</span>;
            })}
          </div>
          <div style={{ marginTop: 26, width: 900 * line, height: 10, borderRadius: 5, background: KR }} />
          <div style={{ marginTop: 46, opacity: rampOut(frame, 60, 80) * name }}>
            <Logo size={52} animate={false} />
          </div>
        </AbsoluteFill>
      </Cam>
      <Sfx name="logo_sting" at={14} volume={0.9} />
      <Sfx name="hit_soft" at={18} volume={0.7} />
      <Sfx name="draw" at={30} volume={0.4} dur={30} fade={10} />
      <Sfx name="whoosh_soft" at={168} volume={0.6} />
    </SkStage>
  );
};
export const _unused = { Kicker, SERIES };

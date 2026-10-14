import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, ChangeTicks } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, Cam, color, Fact, font, KR, LyingBook, MiniIcon, ramp, rampOut, shadow, SkStage } from './kit';
import { FlatCover } from './Genres';
import { sceneClock } from './timeline';

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });
const hm = (h: number) => `${Math.floor(h)} h ${String(Math.round((h % 1) * 60)).padStart(2, '0')} min`;

// ——— IT · G26–G27 ———
export const ItScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('IT');
  const fAbrir = c.at('G26', 'abrir');
  const fIt = c.at('G26', 'It');
  const fObra = c.at('G26', 'obra');
  const fCuar = c.at('G26', 'cuarenta');
  const fHoras = c.at('G26', 'horas');
  const fSi = c.part('G27');
  const fRitmo = c.at('G27', 'ritmo');
  const fDesv = c.at('G27', 'desvíos');
  const fHist = c.at('G27', 'historias');
  const fMitad = c.at('G27', 'mitad');
  const fFacil = c.at('G27', 'fácil');
  const hours = interpolate(frame, [fCuar - 6, fHoras + 26], [0, 46.4], { ...clamp, easing: easeOut });
  const toPath = ramp(frame, fSi - 16, fSi + 6);
  const trio = ['it', 'apocalipsis', 'torre7'];
  const focusIt = ramp(frame, fIt - 10, fIt + 8);
  // Recorrido del oyente: avanza, hace bucles (desvíos) y se para a la mitad.
  const pathD = 'M 160 640 C 360 640, 420 520, 540 560 C 680 610, 600 760, 520 700 C 450 650, 560 520, 700 600 C 820 670, 860 600, 940 560 C 1010 520, 1060 640, 1000 680 C 950 710, 900 620, 980 590 C 1060 560, 1120 600, 1180 620 L 1760 620';
  const travel = interpolate(frame, [fSi, fRitmo + 20, fDesv + 30, fHist + 30, fMitad], [0, 0.18, 0.38, 0.55, 0.63], { ...clamp, easing: easeInOut });
  const stop = ramp(frame, fMitad - 4, fMitad + 10);
  return (
    <SkStage>
      <AbsoluteFill style={{ opacity: 1 - toPath, transform: `scale(${1 - 0.05 * toPath})`, filter: toPath > 0.01 ? `blur(${toPath * 8}px)` : undefined }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: 1 - focusIt }}>
          <MaskTitle text="Mejor no abrir primero" at={4} size={100} align="center" hi={['primero']} />
        </div>
        {trio.map((k, i) => {
          const s = sp(frame, fAbrir - 16 + i * 5);
          const isIt = i === 0;
          const x = isIt ? interpolate(focusIt, [0, 1], [560, 470]) : 960 + (i - 1) * 380 + focusIt * 700;
          const scale = isIt ? 1 + 0.3 * focusIt : 1 - 0.2 * focusIt;
          return (
            <div key={k} style={{ position: 'absolute', left: x - 150, top: 330 - (isIt ? focusIt * 40 : 0), opacity: s * (isIt ? 1 : 1 - focusIt), transform: `translateY(${(1 - s) * 90}px) scale(${scale})` }}>
              <Book3D b={BOOKS[k]} w={300} h={450} d={k === 'it' || k === 'apocalipsis' ? 110 : 70} ry={-26 + Math.sin(frame / 50 + i) * 4} rx={3} />
              <div style={{ position: 'absolute', left: -10, top: 30, transform: `rotate(-12deg) scale(${sp(frame, fAbrir + 4 + i * 4, 10, 220)})`, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', background: KR, padding: '6px 18px', borderRadius: 8, boxShadow: '0 10px 20px rgba(193,18,31,0.35)', opacity: 1 - focusIt }}>
                Para después
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: focusIt }}>
          <Kicker at={fIt} text="It (1986)" />
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1.15, color: color.ink, opacity: rampOut(frame, fObra - 4, fObra + 12) }}>Una obra maestra<br />para muchos lectores…</div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'baseline', gap: 18, opacity: rampOut(frame, fCuar - 8, fCuar + 4) }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 200, letterSpacing: -8, color: KR, fontVariantNumeric: 'tabular-nums' }}>{Math.floor(hours)}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, color: color.ink }}>horas</span>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2, opacity: rampOut(frame, fHoras + 10, fHoras + 24) }}>46 h 24 min de audiolibro · Julio Caycedo</div>
        </div>
      </AbsoluteFill>
      {toPath > 0 && (
        <AbsoluteFill style={{ opacity: toPath }}>
          <div style={{ position: 'absolute', left: 160, top: 170 }}>
            <MaskTitle text="Si es tu primer King…" at={fSi + 2} size={92} />
            <MaskTitle text="es fácil quedarse a mitad" at={fFacil - 4} size={92} hi={['mitad']} color={KR} />
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <path d={pathD} stroke="rgba(16,16,16,0.12)" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} stroke={KR} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${travel} 1`} />
          </svg>
          <PathDot d={pathD} t={travel} stop={stop} />
          {/* etiquetas de los desvíos */}
          <div style={{ position: 'absolute', left: 440, top: 790, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink2, opacity: rampOut(frame, fDesv - 4, fDesv + 10) }}>desvíos</div>
          <div style={{ position: 'absolute', left: 860, top: 730, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink2, opacity: rampOut(frame, fHist - 4, fHist + 10) }}>historias dentro de la historia</div>
          <div style={{ position: 'absolute', left: 1700, top: 650, fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.muted }}>fin</div>
          <div style={{ position: 'absolute', left: 1080, top: 470, opacity: stop, transform: `scale(${0.8 + 0.2 * sp(frame, fMitad - 2, 10, 220)})` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: color.ink, padding: '12px 26px', borderRadius: 999, boxShadow: shadow.float }}>
              <svg width="30" height="30" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" /></svg>
              Abandonado a mitad
            </div>
          </div>
        </AbsoluteFill>
      )}
      {trio.map((_, i) => <Sfx key={i} name="sk_book_thud" at={fAbrir - 10 + i * 5} volume={0.6} />)}
      {trio.map((_, i) => <Sfx key={`s${i}`} name="stamp" at={fAbrir + 4 + i * 4} volume={0.35} />)}
      <Sfx name="whoosh_soft" at={fIt - 8} volume={0.6} />
      <ChangeTicks value={(f) => String(Math.floor(interpolate(f, [fCuar - 6, fHoras + 26], [0, 46.4], { ...clamp, easing: easeOut })))} from={fCuar - 6} to={fHoras + 26} volume={0.6} />
      <Sfx name="hit_soft" at={fHoras + 26} volume={0.6} />
      <Sfx name="draw" at={fSi + 4} volume={0.45} dur={fMitad - fSi} fade={12} />
      <Sfx name="fail" at={fMitad + 2} volume={0.5} />
    </SkStage>
  );
};

// Punto que recorre un path SVG (medido en el navegador).
const PathDot: React.FC<{ d: string; t: number; stop: number }> = ({ d, t, stop }) => {
  const ref = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    return p;
  }, [d]);
  if (!ref) return null;
  const L = ref.getTotalLength();
  const pt = ref.getPointAtLength(L * t);
  return (
    <div style={{ position: 'absolute', left: pt.x - 30, top: pt.y - 30, width: 60, height: 60, borderRadius: '50%', background: stop > 0.5 ? color.ink : color.yellow, border: `6px solid ${color.ink}`, boxShadow: shadow.float, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MiniIcon kind="head" size={30} c={stop > 0.5 ? color.yellow : color.ink} />
    </div>
  );
};

// ——— TORRE · G28–G29 ———
export const TorreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TORRE');
  const fApo = c.at('G28', 'Apocalipsis');
  const fCuar = c.at('G28', 'cuarenta');
  const fTorre = c.at('G28', 'Torre');
  const fSaga = c.at('G28', 'saga');
  const fSiete = c.at('G28', 'siete');
  const fCasi = c.at('G28', 'casi');
  const fHoras = c.at('G28', 'horas', 1);
  const fCentro = c.at('G29', 'centro');
  const fUniv = c.at('G29', 'universo');
  const fOtros = c.at('G29', 'otros');
  const fLeidos = c.at('G29', 'leídos');
  const toTower = ramp(frame, fTorre - 18, fTorre + 4);
  const vols = ['torre1', 'torre2', 'torre3', 'torre4', 'torre5', 'torre6', 'torre7'];
  const hrs = [7.73, 13.92, 19.22, 29.1, 29.27, 15.58, 34.0];
  const volAt = (i: number) => fTorre + 6 + i * Math.max(5, Math.round((fSiete - fTorre) / 7));
  const total = interpolate(frame, [fCasi - 6, fHoras + 20], [0, 148.8], { ...clamp, easing: easeOut });
  const orbit = ramp(frame, fCentro - 16, fCentro + 10);
  const others = ['resplandor', 'it', 'apocalipsis', 'd2263', 'salem', 'milla', 'misery', 'cuento'];
  return (
    <SkStage>
      {/* Apocalipsis */}
      <AbsoluteFill style={{ opacity: 1 - toTower, transform: `scale(${1 - 0.06 * toTower})`, filter: toTower > 0.01 ? `blur(${toTower * 8}px)` : undefined, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 120 }}>
        <div style={{ transform: `translateY(${(1 - sp(frame, fApo - 10)) * 80}px)`, opacity: sp(frame, fApo - 10) }}>
          <Book3D b={BOOKS.apocalipsis} w={320} h={480} d={120} ry={-28 + Math.sin(frame / 50) * 4} rx={3} />
        </div>
        <div>
          <Kicker at={fApo} text="Apocalipsis (1978)" />
          <MaskTitle text="Lo mismo" at={fApo + 6} size={110} />
          <div style={{ marginTop: 30 }}><Fact at={fCuar} icon={<MiniIcon kind="clock" size={34} />} label="48 h 16 min" sub="audiolibro en español" size={50} accent={KR} /></div>
        </div>
      </AbsoluteFill>
      {/* La Torre Oscura */}
      {toTower > 0 && (
        <AbsoluteFill style={{ opacity: toTower }}>
          <Cam keys={[{ f: fTorre - 18, s: 1.04, x: 0, y: 0 }, { f: fCentro - 16, s: 1, x: 0, y: 0 }, { f: fCentro + 14, s: 0.9, x: 0, y: 20 }, { f: c.dur, s: 0.88, x: 0, y: 20 }]}>
            {/* órbitas */}
            {[460, 640].map((r, k) => (
              <div key={r} style={{ position: 'absolute', left: 960 - r, top: 560 - r * 0.42, width: r * 2, height: r * 0.84, borderRadius: '50%', border: `3px dashed rgba(16,16,16,${0.16 * orbit})`, transform: `rotate(${k ? -6 : 4}deg)` }} />
            ))}
            {others.map((k, i) => {
              const r = i % 2 ? 640 : 460;
              const a = (i / others.length) * Math.PI * 2 + frame / (i % 2 ? 260 : 200);
              const x = 960 + Math.cos(a) * r;
              const y = 560 + Math.sin(a) * r * 0.42;
              const s = sp(frame, fCentro - 10 + i * 3, 15, 160) * orbit;
              const read = ramp(frame, fOtros + i * 3, fOtros + 10 + i * 3);
              const behind = Math.sin(a) < 0;
              return (
                <div key={k} style={{ position: 'absolute', left: x - 45, top: y - 68, opacity: s * (behind ? 0.75 : 1), transform: `scale(${(0.7 + 0.3 * s) * (behind ? 0.85 : 1)})`, zIndex: 1 }}>
                  <FlatCover b={BOOKS[k]} w={90} />
                  {read > 0 && <div style={{ position: 'absolute', right: -14, top: -14, width: 40, height: 40, borderRadius: '50%', background: '#1F9D55', transform: `scale(${read})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 12.5l4 4L18 8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>}
                </div>
              );
            })}
            {/* torre de siete libros tumbados */}
            <div style={{ position: 'absolute', left: 960 - 235, top: 0, width: 470, height: 1080, zIndex: 2 }}>
              <div style={{ position: 'absolute', left: 235 - 360, top: 380, width: 720, height: 720, borderRadius: '50%', opacity: ramp(frame, fCentro - 4, fCentro + 20) * 0.9,
                background: 'radial-gradient(circle, rgba(217,164,65,0.35), rgba(217,164,65,0) 60%)' }} />
              {vols.map((k, i) => {
                const s = sp(frame, volAt(i), 13, 210);
                const w = 470 - i * 14;
                const h = 54 + hrs[i] * 0.9;
                const y = 860 - vols.slice(0, i + 1).reduce((a, _, j) => a + 54 + hrs[j] * 0.9 + 4, 0);
                if (frame < volAt(i) - 1) return null;
                return (
                  <div key={k} style={{ position: 'absolute', left: (470 - w) / 2, top: y, transform: `translateY(${(1 - s) * -500}px) rotate(${(random(`tw${i}`) - 0.5) * 3}deg)`, opacity: Math.min(1, s * 2) }}>
                    <LyingBook title={`${i + 1} · ${BOOKS[k].title}`} w={w} h={h} bg={BOOKS[k].bg} accent={BOOKS[k].accent} author={false} fontScale={0.36} />
                  </div>
                );
              })}
            </div>
            {/* rótulos */}
            <div style={{ position: 'absolute', left: 120, top: 150, opacity: 1 - orbit }}>
              <Kicker at={fTorre} text="Su gran saga de fantasía" />
              <MaskTitle text={'La Torre\nOscura'} at={fTorre - 2} size={110} />
              <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink2, opacity: rampOut(frame, fSiete - 4, fSiete + 10) }}>7 libros principales</div>
            </div>
            <div style={{ position: 'absolute', right: 120, top: 380, textAlign: 'right', opacity: rampOut(frame, fCasi - 8, fCasi + 6) * (1 - orbit) }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 190, letterSpacing: -8, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{Math.round(total)}</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink }}>horas</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, marginTop: 10, opacity: rampOut(frame, fHoras + 10, fHoras + 24) }}>{hm(148.82)} en audiolibro</div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', opacity: orbit }}>
              <MaskTitle text="El centro de su universo" at={fCentro - 4} size={86} align="center" hi={['universo']} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', opacity: rampOut(frame, fOtros - 6, fOtros + 10), fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink }}>
              Mejor con otros libros suyos <span style={{ background: color.yellow, padding: '0 14px', borderRadius: 10 }}>ya leídos</span>
            </div>
          </Cam>
        </AbsoluteFill>
      )}
      <Sfx name="sk_book_thud" at={fApo - 4} volume={0.7} />
      <Sfx name="ui_pop" at={fCuar + 1} volume={0.6} />
      <Sfx name="whoosh_soft" at={fTorre - 12} volume={0.6} />
      {vols.map((_, i) => <Sfx key={i} name="sk_book_thud" at={volAt(i) + 8} volume={0.45 + i * 0.03} />)}
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fCasi - 6, fHoras + 20], [0, 148.8], { ...clamp, easing: easeOut }) / 3))} from={fCasi - 6} to={fHoras + 20} volume={0.5} />
      <Sfx name="shimmer" at={fCentro} volume={0.6} />
      <Sfx name="zoom_out" at={fCentro + 2} volume={0.5} />
      {others.map((_, i) => <Sfx key={`o${i}`} name="tick_soft" at={fOtros + i * 3} volume={0.45} />)}
      <Sfx name="success" at={fLeidos} volume={0.5} />
      {fSaga + fUniv > 0 && null}
    </SkStage>
  );
};

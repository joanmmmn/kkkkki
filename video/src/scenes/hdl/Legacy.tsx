import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, Count, F, Marker, P, PaperStage, ramp, rampOut, Reveal, shadow, Silhouette, sp, Stamp, Tag } from './kit';
import { Clapper, FilmReel, Medal } from './Icons';
import { AmericasMap, AM_PTS, MapPin, useMapCam, WorldMap, WORLD_COUNTRIES, WORLD_PTS } from './Maps';
import { sceneClock } from './timeline';

// ——— NOBEL · W26 ———
export const Nobel: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('NOBEL');
  const fYear = c.at('W26', 'mil');
  const fNob = c.at('W26', 'Nobel');
  const fHoy = c.at('W26', 'Hoy');
  const fCinc = c.at('W26', 'cincuenta');
  const fTrad = c.at('W26', 'traducido');
  const fCuar = c.at('W26', 'cuarenta');
  const fGabo = c.at('W26', 'Gabo');
  const fLect = c.at('W26', 'lectores');
  const fVein = c.at('W26', 'veinte');
  const fPob = c.at('W26', 'poblados');
  const medalOut = ramp(frame, fHoy - 10, fHoy + 6);
  const mapOut = ramp(frame, fGabo - 10, fGabo + 6);
  const medalP = sp(frame, fYear - 6, 10, 150);
  // países que se iluminan (traducciones), en orden aleatorio fijo
  const order = WORLD_COUNTRIES.map((_, i) => random(`tr${i}`));
  const lit = interpolate(frame, [fHoy, fCuar + 24], [0, 1], clamp);
  return (
    <PaperStage>
      {/* Medalla */}
      <AbsoluteFill style={{ opacity: 1 - medalOut }}>
        <div style={{ position: 'absolute', left: 250, top: 90, transform: `translateY(${(1 - medalP) * -600}px) rotate(${(1 - medalP) * -20}deg)` }}>
          <Medal s={500} text="1982" />
        </div>
        <div style={{ position: 'absolute', left: 860, top: 360, width: 900 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 34, letterSpacing: 8, textTransform: 'uppercase', color: P.sepia, opacity: rampOut(frame, fNob - 8, fNob + 6) }}>Estocolmo · 1982</div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 110, lineHeight: 1.02, color: P.ink, marginTop: 14 }}><Reveal text="Premio Nobel de Literatura" at={fNob - 4} step={3} /></div>
        </div>
      </AbsoluteFill>
      {/* Mapa del mundo con las traducciones */}
      <AbsoluteFill style={{ opacity: medalOut * (1 - mapOut) }}>
        <WorldMap fill={(c, i) => (order[i] < lit ? (i % 3 === 0 ? P.yellow : '#E9B949') : '#D9CBAE')} />
        {Array.from({ length: 16 }).map((_, i) => {
          const k = Math.floor(random(`wb${i}`) * WORLD_COUNTRIES.length);
          const cc = WORLD_COUNTRIES[k].c ?? [960, 500];
          const at = fCinc + i * 6;
          if (frame < at) return null;
          return <Butterfly key={i} x={cc[0]} y={cc[1] + 40 + Math.sin(frame / 8 + i) * 6} size={30 + random(`ws${i}`) * 16} seed={`w${i}`} flap={1.2} opacity={rampOut(frame, at, at + 10)} />;
        })}
        <div style={{ position: 'absolute', left: 90, top: 800, display: 'flex', gap: 30 }}>
          <div style={{ padding: '22px 34px', background: '#FFFDF7', borderRadius: 26, boxShadow: shadow.card, opacity: rampOut(frame, fCinc - 8, fCinc + 4) }}>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 72, color: P.ink, lineHeight: 1 }}>+<Count to={50} a={fCinc - 4} b={fCinc + 26} /> millones</div>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia, marginTop: 6 }}>de ejemplares vendidos</div>
          </div>
          <div style={{ padding: '22px 34px', background: '#FFFDF7', borderRadius: 26, boxShadow: shadow.card, opacity: rampOut(frame, fCuar - 8, fCuar + 4) }}>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 72, color: P.ink, lineHeight: 1 }}>+<Count to={40} a={fCuar - 4} b={fCuar + 22} /></div>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia, marginTop: 6 }}>idiomas</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* El país de los lectores */}
      <AbsoluteFill style={{ opacity: mapOut }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, color: P.ink2, opacity: rampOut(frame, fGabo - 4, fGabo + 10) }}>Gabo dijo que, si todos sus lectores vivieran en un mismo lugar…</div>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: 420 }).map((_, i) => {
            const r = (k: string) => random(`rd${i}${k}`);
            const a = r('a') * Math.PI * 2;
            const rr = Math.sqrt(r('r'));
            const wob = 1 + 0.18 * Math.sin(a * 3 + 1) + 0.1 * Math.cos(a * 5);
            const x = 960 + Math.cos(a) * rr * 420 * wob;
            const y = 560 + Math.sin(a) * rr * 250 * wob;
            const at = fGabo + 6 + rr * 50;
            const p = rampOut(frame, at, at + 12);
            return <circle key={i} cx={x} cy={y} r={6 * p} fill={i % 7 === 0 ? P.terra : i % 3 === 0 ? P.jungle2 : P.ink2} opacity={0.85} />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', opacity: rampOut(frame, fVein - 6, fVein + 8) }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 64, color: P.ink }}>sería uno de los <Marker at={fPob - 4}>20 países más poblados</Marker> del mundo</div>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: P.sepia, marginTop: 8 }}>— Gabriel García Márquez, 2007</div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_deep" at={fYear - 6} volume={0.6} />
      <Sfx name="hit_soft" at={fYear + 4} volume={0.9} />
      <Sfx name="logo_sting" at={fNob} volume={0.5} />
      <Sfx name="zoom_out" at={fHoy - 8} volume={0.5} />
      <Sfx name="counter" at={fCinc - 4} volume={0.35} dur={30} fade={6} />
      <Sfx name="hdl_flutter" at={fCinc + 4} volume={0.8} />
      <Sfx name="counter" at={fCuar - 4} volume={0.35} dur={26} fade={6} />
      <Sfx name="sparkle" at={fGabo + 8} volume={0.6} />
      {WORLD_PTS && null}
    </PaperStage>
  );
};

// ——— CINE · W27–W28 ———
export const Cine: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CINE');
  const fDec = c.at('W27', 'décadas');
  const fNeg = c.at('W27', 'negó');
  const fTiem = c.at('W27', 'tiempo');
  const fIdi = c.at('W27', 'idioma');
  const fEsp = c.at('W27', 'español');
  const fCasi = c.at('W28', 'Casi');
  const fNov = c.at('W28', 'noventa');
  const fNet = c.at('W28', 'Netflix');
  const fHij = c.at('W28', 'hijos');
  const fCol = c.at('W28', 'Colombia');
  const fDic = c.at('W28', 'diciembre');
  const fSeg = c.at('W28', 'segunda');
  const fAgo = c.at('W28', 'agosto');
  const fSolo = c.at('W28', 'Solo');
  const fTres = c.at('W28', 'trescientos');
  const noOut = ramp(frame, fCasi - 12, fCasi + 4);
  const annOut = ramp(frame, fCol - 12, fCol + 4);
  const serOut = ramp(frame, fSolo - 12, fSolo + 4);
  const col = AM_PTS.bogota;
  const cam = useMapCam([{ f: 0, cx: col[0] - 40, cy: col[1] - 60, s: 2.4 }, { f: c.dur, cx: col[0] - 30, cy: col[1] - 50, s: 2.6 }], [450, 540]);
  const pin = cam.toScreen([AM_PTS.aracataca[0], AM_PTS.aracataca[1] + 30]);
  return (
    <PaperStage>
      {/* Décadas diciendo que no */}
      <AbsoluteFill style={{ opacity: 1 - noOut }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 72, color: P.ink, opacity: rampOut(frame, fDec - 6, fDec + 8) }}>Durante décadas, los derechos para el cine: no</div>
        {[0, 1, 2, 3, 4].map((i) => {
          const at = fNeg - 6 + i * 5;
          const s = sp(frame, at, 13, 170);
          if (frame < at - 2) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: 240 + i * 60, top: 390 + i * 30, width: 420, height: 270, background: '#FBF5E6', border: `2px solid ${P.sepia}`, borderRadius: 6, boxShadow: shadow.float, transform: `rotate(${(random(`of${i}`) - 0.5) * 14}deg) translateY(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 2), padding: 26 }}>
              <div style={{ fontFamily: F.type, fontSize: 26, color: P.ink }}>Oferta · derechos de cine</div>
              {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 6, width: `${85 - k * 12}%`, background: 'rgba(29,26,22,0.35)', marginTop: 18 }} />)}
              <Stamp at={at + 8} text="No" size={60} rot={-14} style={{ right: 30, bottom: 26 }} />
            </div>
          );
        })}
        {/* el tiempo de una película */}
        <div style={{ position: 'absolute', left: 1080, top: 420, width: 700, opacity: rampOut(frame, fTiem - 8, fTiem + 6) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <FilmReel s={130} spin={frame * 4} />
            <div>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: P.ink }}>Una película</div>
              <div style={{ position: 'relative', width: 420, height: 34, borderRadius: 17, background: 'rgba(29,26,22,0.1)', marginTop: 10, overflow: 'visible' }}>
                <div style={{ width: `${Math.min(100, ramp(frame, fTiem, fTiem + 30) * 160)}%`, height: '100%', borderRadius: 17, background: ramp(frame, fTiem, fTiem + 30) > 0.62 ? P.red : P.jungle2 }} />
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: P.sepia, marginTop: 8 }}>Cien años no caben en dos horas</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 50, opacity: rampOut(frame, fIdi - 8, fIdi + 6) }}>
            <div style={{ padding: '16px 28px', borderRadius: 999, background: '#FFFDF7', boxShadow: shadow.float, fontFamily: F.sans, fontWeight: 700, fontSize: 36, color: P.sepia, textDecoration: 'line-through' }}>Otro idioma</div>
            <div style={{ padding: '16px 28px', borderRadius: 999, background: P.ink, color: '#fff', boxShadow: shadow.float, fontFamily: F.sans, fontWeight: 700, fontSize: 36, opacity: rampOut(frame, fEsp - 4, fEsp + 8) }}>✓ En español</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* El anuncio */}
      <AbsoluteFill style={{ opacity: noOut * (1 - annOut) }}>
        <div style={{ position: 'absolute', left: 240, top: 200, width: 520, height: 600, background: '#FBF7EE', borderRadius: 18, boxShadow: shadow.card, overflow: 'hidden' }}>
          <div style={{ height: 120, background: P.red, color: '#fff', fontFamily: F.serif, fontWeight: 700, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>MARZO</div>
          <div style={{ textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 260, color: P.ink, lineHeight: 1.1 }}>6</div>
          <div style={{ textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 64, color: P.ink }}>2019</div>
        </div>
        <div style={{ position: 'absolute', left: 860, top: 220, width: 900 }}>
          <Tag at={fCasi - 2} x={0} y={0} size={36}>Casi cinco años después de su muerte</Tag>
          <div style={{ position: 'absolute', left: 0, top: 120, fontFamily: F.serif, fontWeight: 600, fontSize: 70, color: P.ink, lineHeight: 1.1, opacity: rampOut(frame, fNov - 6, fNov + 8) }}>
            El día en que habría cumplido <Marker at={fNov + 6}>92 años</Marker>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 330, display: 'flex', alignItems: 'center', gap: 30, opacity: rampOut(frame, fNet - 6, fNet + 8) }}>
            <Clapper s={120} open={pulseClap(frame, fNet)} />
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 56, color: P.ink }}>Netflix anuncia la serie</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 500, display: 'flex', alignItems: 'center', gap: 20, opacity: rampOut(frame, fHij - 6, fHij + 8) }}>
            <Silhouette size={100} hair="short" /><Silhouette size={100} hair="short" />
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 36, color: P.sepia }}>Sus hijos ceden los derechos</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* La serie */}
      <AbsoluteFill style={{ opacity: annOut * (1 - serOut) }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 900, height: 1080, overflow: 'hidden' }}>
          <AmericasMap transform={cam.transform} fill={{ Colombia: '#E9C77A' }} sea="rgba(156,194,207,0.3)" />
        </div>
        <MapPin x={pin[0]} y={pin[1]} at={fCol + 2} label="Rodada en Colombia" sub="y en español" />
        <div style={{ position: 'absolute', left: 980, top: 260, width: 820 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: P.sepia }}>La serie</div>
          <div style={{ position: 'relative', marginTop: 60, height: 260 }}>
            <div style={{ position: 'absolute', left: 20, right: 20, top: 60, height: 6, background: P.ink, transform: `scaleX(${ramp(frame, fDic - 4, fAgo + 10)})`, transformOrigin: 'left' }} />
            {[{ at: fDic, x: 20, t: 'Parte 1', d: 'diciembre de 2024' }, { at: fAgo, x: 520, t: 'Parte 2', d: 'agosto de 2026' }].map((m, i) => {
              const s = sp(frame, m.at - 6, 12, 180);
              return (
                <div key={i} style={{ position: 'absolute', left: m.x, top: 40, opacity: Math.min(1, s * 2) }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: i ? P.terra : P.yellow, border: `5px solid ${P.ink}`, transform: `scale(${s})` }} />
                  <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 52, color: P.ink, marginTop: 18 }}>{m.t}</div>
                  <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia }}>{m.d}</div>
                </div>
              );
            })}
          </div>
          {frame > fSeg && null}
        </div>
      </AbsoluteFill>
      {/* +300 % */}
      <AbsoluteFill style={{ opacity: serOut, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: P.sepia }}>Ventas del libro en Colombia tras la primera parte</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 80, marginTop: 40, height: 560 }}>
          {[{ l: 'Antes', h: 120, c: P.sepia }, { l: 'Después', h: 480 * ramp(frame, fTres - 4, fTres + 24, easeOut), c: P.terra }].map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 200, height: Math.max(i ? 120 : 120, b.h), background: b.c, border: `3px solid ${P.ink}`, borderRadius: '12px 12px 0 0' }} />
              <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 30, color: P.sepia, marginTop: 12 }}>{b.l}</div>
            </div>
          ))}
          <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 180, color: P.terra, lineHeight: 1, marginBottom: 120, opacity: rampOut(frame, fTres - 2, fTres + 12) }}>+<Count to={300} a={fTres - 2} b={fTres + 24} />%</div>
        </div>
      </AbsoluteFill>
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="stamp" at={fNeg + 2 + i * 5} volume={0.4} />)}
      <Sfx name="hdl_film" at={fTiem - 2} volume={0.7} />
      <Sfx name="fail" at={fTiem + 22} volume={0.4} />
      <Sfx name="success" at={fEsp} volume={0.5} />
      <Sfx name="page_turn" at={fCasi - 8} volume={0.6} />
      <Sfx name="marker" at={fNov + 6} volume={0.5} />
      <Sfx name="ui_tap" at={fNet + 2} volume={0.8} />
      <Sfx name="stamp" at={fCol + 2} volume={0.4} />
      <Sfx name="ui_pop" at={fDic - 4} volume={0.5} />
      <Sfx name="ui_pop" at={fAgo - 4} volume={0.5} />
      <Sfx name="counter" at={fTres - 2} volume={0.35} dur={26} fade={6} />
      <Sfx name="hit_soft" at={fTres + 24} volume={0.6} />
    </PaperStage>
  );
};
const pulseClap = (frame: number, at: number) => interpolate(frame, [at - 6, at, at + 6], [0, 1, 0], clamp);

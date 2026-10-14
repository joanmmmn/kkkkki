import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { E, eIO, eOut, es, follow, pop, ramp, rnd, Stip } from './kit';
import { centerOf, OWN, REGIONS, SpainMap } from './map';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano E (T05): cada comunidad tiene su eBiblio y su colección. El mapa, tumbado en perspectiva; en cada comunidad
// sube una pila de libros tan alta como su número de audiolibros (recuento propio en los catálogos públicos del
// 14/10/2026). Madrid y Asturias, con su cifra; Cataluña y el País Vasco, rayadas: tienen Biblio Digital y eLiburutegia.
// ---------------------------------------------------------------------------------------------------------------
const AUDIO: Record<string, number> = {
  Andalucía: 831, Aragón: 495, Asturias: 450, Canarias: 994, Cantabria: 1454, 'Castilla-La Mancha': 1101, 'Castilla y León': 2567, Ceuta: 942,
  'Comunitat Valenciana': 675, Extremadura: 825, Galicia: 1211, 'Illes Balears': 892, 'La Rioja': 1073, Madrid: 3186, Melilla: 955, Murcia: 827, Navarra: 2276,
};
const FILL = [E.coral, E.mustard, E.plum, E.pink, E.olive, E.violet, E.coralLight, E.oliveMid];
const SPINES = [E.coral, E.plum, E.mustard, E.pink, E.violet, E.olive, E.paper, E.coralLight];
const MW = 1760, K = MW / 1600, MH = 1200 * K; // mapa en px
const TILT = 46, PERSP = 2100;
const HMAX = 270; // altura de la pila de Madrid

export const Regions: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T05', 'B06', word, n);
  const fCol = at('colección'), fMad = at('Madrid'), fTres = at('tres'), fAst = at('Asturias'), fQui = at('quinientos'), fCat = at('Cataluña'), fPV = at('País');
  const fNo = at('no'), fBD = at('Biblio'), fEL = at('eLiburutegia'), fFun = at('funcionan');
  const tilt = TILT * ramp(frame, 0, 40, eOut);
  const T = (tilt * Math.PI) / 180;
  // proyección de un punto del mapa (lienzo 1600×1200) a la pantalla del contenedor (antes de la cámara)
  const ox = 960 - MW / 2, oy = 560 - MH / 2;
  const proj = (mx: number, my: number) => {
    const x = mx * K - MW / 2, y = my * K - MH / 2;
    const y2 = y * Math.cos(T), z2 = y * Math.sin(T);
    const s = PERSP / (PERSP - z2);
    return { x: 960 + x * s, y: 560 + y2 * s, s };
  };
  const mad = proj(...centerOf(REGIONS.find((r) => r.name === 'Madrid')!));
  const ast = proj(...centerOf(REGIONS.find((r) => r.name === 'Asturias')!));
  const ne = proj(1150, 190);
  const pen = proj(1010, 560);
  const cam = follow(frame, [
    { f: 0, x: pen.x, y: pen.y - 40, s: 0.92 },
    { f: fMad - 20, x: pen.x, y: pen.y - 60, s: 1 },
    { f: fMad + 10, x: mad.x, y: mad.y - 120, s: 1.45 },
    { f: fAst - 16, x: mad.x - 40, y: mad.y - 140, s: 1.45 },
    { f: fAst + 12, x: ast.x + 60, y: ast.y - 60, s: 1.55 },
    { f: fCat - 20, x: ast.x + 120, y: ast.y - 40, s: 1.5 },
    { f: fCat + 14, x: ne.x - 40, y: ne.y + 10, s: 1.35 },
    { f: fFun - 10, x: ne.x - 60, y: ne.y + 20, s: 1.32 },
    { f: dur, x: pen.x - 60, y: pen.y - 40, s: 0.96 },
  ], 4.4);
  const regIn = (i: number) => ramp(frame, 12 + i * 3, 30 + i * 3, eOut);
  const order = REGIONS.filter((r) => AUDIO[r.name] !== undefined).sort((a, b) => centerOf(a)[0] - centerOf(b)[0]);
  const rise = (name: string) => ramp(frame, fCol - 26 + order.findIndex((r) => r.name === name) * 3, fCol + 10 + order.findIndex((r) => r.name === name) * 3, eOut);
  const hatch = ramp(frame, fNo - 10, fNo + 10, eOut);
  const hl = (name: string) => (name === 'Madrid' ? ramp(frame, fMad - 6, fMad + 8, eOut) * (1 - ramp(frame, fAst - 10, fAst + 4, eIO)) : name === 'Asturias' ? ramp(frame, fAst - 6, fAst + 8, eOut) * (1 - ramp(frame, fCat - 14, fCat, eIO)) : 0);
  // pilas, de atrás adelante (por la y en pantalla)
  const stacks = REGIONS.filter((r) => AUDIO[r.name] !== undefined).map((r) => ({ r, p: proj(...centerOf(r)) })).sort((a, b) => a.p.y - b.p.y);
  return (
    <AbsoluteFill style={{ background: E.lilacPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.12} />
      <AbsoluteFill style={{ transform: `scale(${cam.s}) translate(${960 - cam.x}px, ${540 - cam.y}px)`, transformOrigin: '960px 540px' }}>
        {/* mapa tumbado */}
        <div style={{ position: 'absolute', left: ox, top: oy, width: MW, height: MH, transformOrigin: '50% 50%', transform: `perspective(${PERSP}px) rotateX(${tilt}deg)` }}>
          <div style={{ position: 'absolute', left: -60, top: -60, right: -60, bottom: -60, borderRadius: 60, background: E.bone, boxShadow: `0 40px 0 ${E.lilac}` }} />
          <SpainMap w={MW} reveal={(r, i) => regIn(i)} fill={(r, i) => (OWN[r.name] ? '#E8E0D6' : FILL[i % FILL.length])} stroke={E.bone} strokeW={4}
            hatch={(r) => (OWN[r.name] ? hatch : 0)} />
        </div>
        {/* pilas de libros */}
        {stacks.map(({ r, p }) => {
          const n = AUDIO[r.name];
          const k = rise(r.name);
          if (k <= 0.001) return null;
          const H = (HMAX * n / 3186) * p.s * k;
          const bw = 34 * p.s;
          const h1 = 11 * p.s;
          const books = Math.max(1, Math.round(H / h1));
          const glow = hl(r.name);
          return (
            <div key={r.id} style={{ position: 'absolute', left: p.x - bw / 2, top: p.y - H, width: bw, height: H }}>
              {/* sombra en el mapa */}
              <div style={{ position: 'absolute', left: -bw * 0.25, top: H - h1 * 0.35, width: bw * 1.5, height: h1 * 0.9, borderRadius: '50%', background: 'rgba(15,21,33,0.22)' }} />
              {Array.from({ length: books }, (_, b) => {
                const c = SPINES[Math.floor(rnd(Number(r.id) * 31 + b) * SPINES.length)];
                const dx = (rnd(Number(r.id) * 17 + b * 3) - 0.5) * bw * 0.22;
                const ww = bw * (0.86 + rnd(Number(r.id) * 7 + b) * 0.2);
                return <div key={b} style={{ position: 'absolute', left: (bw - ww) / 2 + dx, bottom: b * h1, width: ww, height: h1 - 1.5 * p.s, borderRadius: 2 * p.s, background: c,
                  boxShadow: `inset 0 -${2 * p.s}px 0 rgba(15,21,33,0.18)` }} />;
              })}
              {glow > 0.01 && <div style={{ position: 'absolute', left: -bw * 0.6, right: -bw * 0.6, top: -bw * 0.6, bottom: -bw * 0.3, borderRadius: bw, boxShadow: `0 0 ${40 * glow}px ${16 * glow}px rgba(255,214,120,${0.7 * glow})` }} />}
            </div>
          );
        })}
        {/* cifras de Madrid y Asturias */}
        <Callout x={mad.x} y={mad.y - (HMAX * mad.s) - 30} s={pop(frame, fTres - 6, fps, 170, 13)} out={ramp(frame, fAst - 14, fAst - 2, eIO)} name="Madrid" value={`${es(3186)} audiolibros`} bg={E.ink} />
        <Callout x={ast.x} y={ast.y - (HMAX * 450 / 3186) * ast.s - 30} s={pop(frame, fQui - 6, fps, 170, 13)} out={ramp(frame, fCat - 16, fCat - 4, eIO)} name="Asturias" value={`${450} audiolibros`} bg={E.ink} />
        {/* Cataluña y el País Vasco: su propio servicio */}
        {REGIONS.filter((r) => OWN[r.name]).map((r, i) => {
          const p = proj(...centerOf(r));
          const s1 = pop(frame, (i ? fPV : fCat) - 4, fps, 200, 13);
          const s2 = pop(frame, (i ? fEL : fBD) - 6, fps, 170, 13);
          return (
            <React.Fragment key={r.id}>
              {s1 > 0.01 && <div style={{ position: 'absolute', left: p.x - 26, top: p.y - 26, width: 52, height: 52, borderRadius: '50%', background: E.coral, transform: `scale(${Math.min(1.1, s1)})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: E.paper, fontFamily: E.font, fontWeight: 800, fontSize: 34, boxShadow: `3px 3px 0 ${E.ink}` }}>×</div>}
              {s2 > 0.01 && (
                <div style={{ position: 'absolute', left: p.x + (i ? -40 : 30), top: p.y + (i ? -150 : -120), transform: `translate(${i ? '-100%' : '0'}, 0) scale(${0.7 + 0.3 * Math.min(1.08, s2)})`, transformOrigin: i ? '100% 100%' : '0% 100%',
                  opacity: Math.min(1, s2 * 2), padding: '12px 24px', borderRadius: 16, background: E.paper, boxShadow: `5px 5px 0 ${E.plum}`, whiteSpace: 'nowrap', fontFamily: E.font }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: E.inkSoft }}>{r.name}</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: E.plum }}>{OWN[r.name]}</div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      {/* «Audiolibros en cada eBiblio» */}
      <div style={{ position: 'absolute', left: 60, top: 50, opacity: ramp(frame, fCol - 20, fCol, eOut) * (1 - ramp(frame, fMad - 30, fMad - 10, eIO)), fontFamily: E.font }}>
        <div style={{ fontSize: 54, fontWeight: 800, color: E.plum, lineHeight: 1.05 }}>Audiolibros<br />en cada eBiblio</div>
      </div>
      <div style={{ position: 'absolute', right: 50, bottom: 34, fontFamily: E.font, fontWeight: 500, fontSize: 24, color: E.inkSoft, opacity: ramp(frame, fCol, fCol + 20, eOut) }}>Recuento en los catálogos públicos, 14/10/2026</div>
      <Sfx name="map_rise" at={10} volume={0.6} />
      <Sfx name="map_rise" at={fCol - 24} volume={0.8} />
      <Sfx name="zoom_in" at={fMad - 12} volume={0.5} />
      <Sfx name="pop_bright" at={fTres - 4} volume={0.5} />
      <Sfx name="whip" at={fAst - 12} volume={0.4} />
      <Sfx name="pop_bright" at={fQui - 4} volume={0.5} />
      <Sfx name="whip" at={fCat - 14} volume={0.4} />
      <Sfx name="cross" at={fCat - 2} volume={0.5} />
      <Sfx name="cross" at={fPV - 2} volume={0.5} />
      <Sfx name="cardboard_pop" at={fBD - 4} volume={0.5} />
      <Sfx name="cardboard_pop" at={fEL - 4} volume={0.5} />
      <Sfx name="zoom_out" at={fFun} volume={0.4} />
    </AbsoluteFill>
  );
};

const Callout: React.FC<{ x: number; y: number; s: number; out: number; name: string; value: string; bg: string }> = ({ x, y, s, out, name, value, bg }) => {
  if (s <= 0.01 || out >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${(0.7 + 0.3 * Math.min(1.08, s)) * (1 - out * 0.3)})`, transformOrigin: '50% 100%', opacity: Math.min(1, s * 2) * (1 - out) }}>
      <div style={{ padding: '14px 28px', borderRadius: 18, background: bg, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: E.font }}>
        <div style={{ fontSize: 26, fontWeight: 600, color: E.lilac }}>{name}</div>
        <div style={{ fontSize: 46, fontWeight: 800, color: E.mustardLight, lineHeight: 1.1 }}>{value}</div>
      </div>
      <div style={{ margin: '0 auto', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `16px solid ${bg}` }} />
    </div>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CrossIcon } from '../../components/Icons';
import { IcSearch } from '../er/icons';
import { clamp, easeInOut } from '../../lib/anim';
import { app, AppView, AppWindow } from './AppView';
import { w } from './timeline';

const ID = 'X04';
const WIN = 1640;

// Pastilla flotante con una cifra (sobre la ventana).
const Stat: React.FC<{ at: number; until?: number; x: number; y: number; big: string; small: string; dark?: boolean }> = ({ at, until = 1e9, x, y, big, small, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } }) * (1 - interpolate(frame, [until - 8, until], [0, 1], clamp));
  if (s < 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 20}px)`, transformOrigin: 'left center', opacity: s, display: 'flex', alignItems: 'baseline', gap: 16, padding: '18px 34px', borderRadius: 26, background: dark ? color.ink : color.yellow, color: dark ? '#fff' : color.ink, boxShadow: shadow.float, fontFamily: font.sans, whiteSpace: 'nowrap' }}>
      <span style={{ fontWeight: 700, fontSize: 60, letterSpacing: -1 }}>{big}</span>
      <span style={{ fontWeight: 500, fontSize: 32 }}>{small}</span>
    </div>
  );
};

// Tarjeta de búsqueda sin resultados (gráfico propio, no imita la app).
const Missing: React.FC<{ at: number; title: string; y: number }> = ({ at, title, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
  const x = spring({ frame: frame - at - 14, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ position: 'absolute', right: 150, top: y, width: 780, opacity: s, transform: `translateX(${(1 - s) * 120}px)`, display: 'flex', alignItems: 'center', gap: 24, padding: '26px 34px', borderRadius: 30, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
      <IcSearch size={44} w={2} />
      <div style={{ flex: 1, fontFamily: font.sans, fontSize: 40, fontWeight: 700 }}>«{title}»</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${x})`, fontFamily: font.sans, fontSize: 30, fontWeight: 700, color: color.red }}><CrossIcon size={44} />No está</div>
    </div>
  );
};

// X04 · Audiolibros: miles gratis, 200.000+ prémium (20 h/mes), español sí… superventas no tanto.
export const X04Catalog: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const at = (word: string, n = 0) => w(ID, 'W04', word, n);
  const fMiles = at('miles');
  const fUltra = at('Ultra');
  const f200 = at('doscientos');
  const f20 = at('20');
  const fEsp = at('español');
  const fPero = at('pero');
  const fCien = at('Cien');
  const f25 = at('25');
  const fSombra = at('sombra') - 6;
  const fPatria = at('Patria') - 6;
  const fSearch = fPero + 8;

  // Explorar (captura alta: 1920×4320 CSS) — cámara: arriba → clásicos gratis → cuadrícula de títulos incluidos.
  const camExplore = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fMiles - 14, zoom: 1.0, x: 960, y: 560 },
    { f: fMiles + 26, zoom: 1.05, x: 960, y: 3880 },
    { f: fUltra - 6, zoom: 1.05, x: 960, y: 3900 },
    { f: fUltra + 34, zoom: 1.05, x: 960, y: 2640 },
    { f: fEsp - 4, zoom: 1.05, x: 960, y: 2660 },
    { f: fEsp + 26, zoom: 1.18, x: 960, y: 2600 },
  ];
  const marksExplore = [
    { from: fMiles + 20, to: fUltra - 2, x: 366, y: 3640, w: 1188, h: 540, r: 20, label: 'Gratis: clásicos de dominio público' },
    { from: f200 - 4, to: fEsp - 4, x: 396, y: 2576, w: 126, h: 28, r: 8, label: 'Incluido en Ultra (0 $)' },
    { from: fEsp + 2, to: fSearch - 6, x: 360, y: 2212, w: 1200, h: 452, r: 20, label: 'Títulos en español incluidos' },
  ];
  const camSearch = [
    { f: fSearch, zoom: 1.0, x: 960, y: 540 },
    { f: fCien - 2, zoom: 1.0, x: 960, y: 540 },
    { f: fCien + 30, zoom: 1.55, x: 760, y: 470 },
    { f: fSombra - 8, zoom: 1.55, x: 760, y: 470 },
    { f: fSombra + 20, zoom: 1.0, x: 960, y: 540 },
  ];
  const marksSearch = [
    { from: fCien + 4, to: fSombra - 6, x: 366, y: 254, w: 228, h: 346, r: 18, label: frame >= f25 - 6 ? 'Se compra aparte: 25 $' : 'Cien años de soledad' },
  ];
  const xf = interpolate(frame, [fSearch - 4, fSearch + 8], [0, 1], { ...clamp, easing: easeInOut });
  const dimMiss = interpolate(frame, [fSombra - 4, fSombra + 10], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage>
      <AppWindow url={frame < fSearch ? 'elevenreader.io/explore' : 'elevenreader.io/search'} width={WIN} y={10}>
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 1 - xf }}>
            <AppView width={WIN} states={[{ at: 0, src: app('02_explore') }]} camera={camExplore} marks={marksExplore} imgHeight={4320} />
          </div>
          {xf > 0 && (
            <div style={{ position: 'absolute', inset: 0, opacity: xf }}>
              <AppView width={WIN} states={[{ at: 0, src: app('21_search_cien') }]} camera={camSearch} marks={marksSearch} />
            </div>
          )}
          <AbsoluteFill style={{ background: `rgba(16,16,16,${0.35 * dimMiss})` }} />
        </div>
      </AppWindow>
      <Stat at={fMiles} until={fUltra} x={150} y={880} big="Miles" small="de audiolibros gratis" />
      <Stat at={f200 - 2} until={fEsp} x={150} y={754} big="+200.000" small="prémium con Ultra" dark />
      <Stat at={f20 - 2} until={fEsp} x={150} y={880} big="20 h" small="de prémium al mes" />
      <Missing at={fSombra} title="La sombra del viento" y={380} />
      <Missing at={fPatria} title="Patria" y={540} />
      <Sfx name="whoosh_soft" at={fMiles - 8} />
      <Sfx name="ui_pop" at={fMiles} />
      <Sfx name="whoosh_soft" at={fUltra} />
      <Sfx name="ui_pop" at={f200} />
      <Sfx name="ui_pop" at={f20} />
      <Sfx name="focus" at={fEsp} />
      <Sfx name="swipe" at={fSearch} />
      <Sfx name="zoom_in" at={fCien + 4} />
      <Sfx name="coins" at={f25} volume={0.7} />
      <Sfx name="card_flip" at={fSombra} />
      <Sfx name="cross" at={fSombra + 14} />
      <Sfx name="card_flip" at={fPatria} />
      <Sfx name="cross" at={fPatria + 14} />
    </Stage>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { B, Chip, LvWeb, lvw, markOn } from './common';
import { w } from './timeline';

const ID = 'Y06';
const FPS = 50;

// Y06 · Buscar en español: Browse the catalog → Language → Spanish · búsqueda por título («quijote») · Solo / Collaborative.
export const Y06Find: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L06', word, n);
  const fIng = at('inglés');
  const fBrowse = at('Browse');
  const fLang = at('Language');
  const fSpan = at('Spanish');
  const fBus = at('buscar');
  const fTit = at('título');
  const fSolo = at('Solo');
  const fCol = at('Collaborative');
  const s = (f: number) => f / FPS;
  const lang = B['home:Language'];
  const sp = B['lang:Spanish'];
  const q = (B as unknown as Record<string, { meta: [number, number, number, number] }[]>)['quijote:items'];
  const qs = B['quijote:search'];
  const states = [
    { at: 0, src: lvw('home') },
    { at: fBrowse - 8, src: lvw('home_browse'), fade: 10 },
    { at: fLang + 6, src: lvw('lang') },
    { at: fSpan + 6, src: lvw('es_list') },
    { at: fTit, src: lvw('search_quijote_v') },
  ];
  const cursor = [
    { t: 0, x: 700, y: 560, down: false },
    { t: s(fBrowse - 6), x: 660, y: 520, down: false },
    { t: s(fLang - 4), x: lang[0] + lang[2] / 2, y: lang[1] - 430 + lang[3] / 2, down: false },
    { t: s(fLang), x: lang[0] + lang[2] / 2, y: lang[1] - 430 + lang[3] / 2, down: true },
    { t: s(fLang + 5), x: lang[0] + lang[2] / 2, y: lang[1] - 430 + lang[3] / 2, down: false },
    { t: s(fLang + 16), x: sp[0] + 300, y: sp[1] - 60, down: false },
    { t: s(fSpan - 4), x: sp[0] + 120, y: sp[1] + sp[3] / 2, down: false },
    { t: s(fSpan), x: sp[0] + 120, y: sp[1] + sp[3] / 2, down: true },
    { t: s(fSpan + 6), x: sp[0] + 120, y: sp[1] + sp[3] / 2, down: false },
    { t: s(fBus - 6), x: qs[0] + 60, y: qs[1] + qs[3] / 2, down: false },
    { t: s(fBus), x: qs[0] + 60, y: qs[1] + qs[3] / 2, down: true },
    { t: s(fBus + 6), x: qs[0] + 60, y: qs[1] + qs[3] / 2, down: false },
    { t: s(fSolo - 10), x: q[2].meta[0] + 90, y: q[2].meta[1] + 22, down: false },
    { t: s(fCol - 10), x: q[0].meta[0] + 130, y: q[0].meta[1] + 22, down: false },
  ];
  const camera = [
    { f: 0, zoom: 1.0, x: 640, y: 360 },
    { f: fLang - 30, zoom: 1.0, x: 640, y: 360 },
    { f: fLang - 4, zoom: 1.18, x: 860, y: 380 },
    { f: fLang + 8, zoom: 1.0, x: 640, y: 360 },
    { f: fSpan - 24, zoom: 1.12, x: 760, y: 520 },
    { f: fSpan + 10, zoom: 1.0, x: 640, y: 360 },
    { f: fTit + 6, zoom: 1.0, x: 640, y: 360 },
    { f: fSolo - 16, zoom: 1.35, x: 800, y: 470 },
    { f: fCol - 8, zoom: 1.35, x: 800, y: 380 },
  ];
  const meta = (i: number) => q[i].meta;
  const marks = [
    markOn([lang[0], lang[1] - 430, lang[2], lang[3]], fLang - 8, fLang + 4, 4),
    markOn(sp, fSpan - 10, fSpan + 4, 4),
    markOn([qs[0], qs[1], qs[2], qs[3]], fBus - 4, fTit + 20, 4, { label: 'Título o autor' }),
    markOn([meta(2)[0], meta(2)[1] - 3, 170, meta(2)[3] + 6], fSolo - 6, fCol - 8, 6, { label: 'Una sola voz', labelBelow: true }),
    markOn([meta(0)[0], meta(0)[1] - 3, 205, meta(0)[3] + 6], fCol - 6, fCol + 120, 6, { label: 'Varias voces', labelBelow: true }),
  ];
  const tagS = spring({ frame: frame - fIng + 2, fps, config: { damping: 15, stiffness: 180 } });
  const tagOut = interpolate(frame, [fBrowse - 10, fBrowse], [0, 1], clamp);
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <LvWeb states={states} camera={camera} cursor={cursor} marks={marks} width={1560} y={36} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 960, top: 40, transform: `translateX(-50%) scale(${0.85 + 0.15 * tagS})`, opacity: tagS * (1 - tagOut), padding: '14px 34px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 40, fontWeight: 700, boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
        En inglés, <span style={{ color: color.yellow }}>pero sencilla</span>
      </div>
      <div style={{ position: 'absolute', left: 120, bottom: 60, display: 'flex', gap: 18 }}>
        <Chip at={fBrowse - 4} out={fSpan + 30} size={34}>Browse the catalog</Chip>
        <Chip at={fLang - 4} out={fSpan + 30} size={34}>→ Language</Chip>
        <Chip at={fSpan - 4} out={fSpan + 30} size={34} bg={color.yellow}>→ Spanish</Chip>
      </div>
      <Sfx name="scroll" at={fBrowse - 8} volume={0.6} />
      <Sfx name="mouse_click" at={fLang} />
      <Sfx name="swipe" at={fLang + 6} volume={0.6} />
      <Sfx name="mouse_click" at={fSpan} />
      <Sfx name="swipe" at={fSpan + 6} volume={0.6} />
      <Sfx name="mouse_click" at={fBus} />
      <Sfx name="typing" at={fBus + 4} trimAfter={30} />
      <Sfx name="marker" at={fSolo - 6} />
      <Sfx name="marker" at={fCol - 6} />
    </Stage>
  );
};

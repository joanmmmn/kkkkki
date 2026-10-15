import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { Callout } from '../../components/Callout';
import { synthCursor } from '../../lib/synth';
import { clamp, easeInOut } from '../../lib/anim';
import { AppView, AppWindow, Patch, st, VoiceTag } from './AppView';
import { clipWordAt, itemAt, itemEnd, w } from './timeline';

const ID = 'X06';
const WIN = 1640;
const PANEL = { x: 1512, y: 8, w: 400, h: 1064 };

// X06 · Escuchar: Play y resaltado → Brian (por defecto) → panel de voces → Sara Martin → más de mil voces,
// expresividad, voces propias e icónicas.
export const X06Voices: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a6 = (word: string, n = 0) => w(ID, 'W06', word, n);
  const a7 = (word: string, n = 0) => w(ID, 'W07', word, n);
  const a8 = (word: string, n = 0) => w(ID, 'W08', word, n);
  const fPlay = a6('Play');
  const fResalta = a6('resalta');
  const fLees = a6('lees');
  const fDefecto = a6('defecto');
  const fBrian = a6('Brian');
  const bAt = itemAt(ID, 'brian_ab');
  const bEnd = itemEnd(ID, 'brian_ab');
  const v7 = itemAt(ID, 'W07');
  const fRec = a7('recomendada');
  const fSara = a7('Sara');
  const sAt = itemAt(ID, 'sara_ab');
  const sEnd = itemEnd(ID, 'sara_ab');
  const v8 = itemAt(ID, 'W08');
  const fMil = a8('mil');
  const fExpr = a8('ajustar');
  const fDis = a8('disenar');
  const fIco = a8('iconicas') - 8;
  const fCaine = a8('Michael');

  const tClickVoice = v7 + 4;        // clic en «Read by Brian»
  const tPanelIn = tClickVoice + 4;
  const tPickSara = fSara + 6;       // clic en Sara Martin
  const tSave = Math.min(sAt - 16, tPickSara + 34);
  const tPanelOut = tSave + 4;
  const tPanel2 = fMil - 14;          // el panel vuelve con «más de mil voces»

  // Palabra resaltada (−1 = sin resaltado) y voz, fotograma a fotograma.
  const reader = (f: number) => {
    if (f < fPlay + 4) return st('rd_b_p');
    if (f < bAt) { const i = Math.min(16, Math.max(0, clipWordAt('brian_silent', f - fPlay - 4))); return st(`rd_b_${i}`); }
    if (f < tPanelOut) { const i = clipWordAt('brian_ab', f - bAt); return st(`rd_b_${i < 0 ? 16 : i}`); }
    if (f < sAt) return st('rd_s_17');
    const i = clipWordAt('sara_ab', f - sAt);
    return st(`rd_s_${i < 0 ? 17 : i}`);
  };
  const states: { at: number; src: string }[] = [];
  for (let f = 0; f < dur; f++) { const s = reader(f); if (!states.length || states[states.length - 1].src !== s) states.push({ at: f, src: s }); }

  const cursor = synthCursor([1180, 760], [
    { t: (fPlay - 30) / fps, x: 960, y: 1040, dur: 0.55, click: true },
    { t: (fPlay + 12) / fps, x: 1100, y: 860, dur: 0.6 },
    { t: (tClickVoice - 30) / fps, x: 1821, y: 1040, dur: 0.6, click: true },
    { t: (tPickSara - 28) / fps, x: 1690, y: 721, dur: 0.55, click: true },
    { t: (tSave - 22) / fps, x: 1807, y: 1035, dur: 0.42, click: true },
    { t: (tSave + 14) / fps, x: 1300, y: 880, dur: 0.5 },
    { t: (fExpr + 4) / fps, x: 1712, y: 165, dur: 0.55 },
    { t: (fExpr + 32) / fps, x: 1826, y: 165, dur: 0.5 },
    { t: (fExpr + 60) / fps, x: 1620, y: 165, dur: 0.5 },
    { t: (fExpr + 86) / fps, x: 1712, y: 165, dur: 0.4 },
    { t: (fDis - 4) / fps, x: 1660, y: 346, dur: 0.5 },
    { t: (fIco + 6) / fps, x: 1700, y: 480, dur: 0.5 },
  ]);
  const P = { zoom: 1.75, x: 955, y: 652 };       // párrafo
  const R1 = { zoom: 1.2, x: 1460, y: 610 };      // panel: recomendadas, Sara Martin y «Save»
  const R2 = { zoom: 1.2, x: 1460, y: 470 };      // panel: expresividad, voz propia, icónicas
  const camera = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fPlay + 2, zoom: 1.0, x: 960, y: 540 },
    { f: fResalta + 10, ...P },
    { f: fDefecto - 6, ...P },
    { f: fDefecto + 20, zoom: 1.9, x: 1600, y: 980 },
    { f: bAt - 14, zoom: 1.9, x: 1600, y: 980 },
    { f: bAt + 10, ...P },
    { f: bEnd + 4, ...P },
    { f: tClickVoice - 10, ...R1 },
    { f: tSave + 4, ...R1 },
    { f: sAt + 4, ...P },
    { f: sEnd + 10, ...P },
    { f: tPanel2 - 6, ...R2 },
    { f: dur, ...R2 },
  ];
  const marks = [
    { from: fBrian - 6, to: bAt - 10, x: 1739, y: 1016, w: 165, h: 48, r: 24, label: 'Voz por defecto: Brian' },
    { from: fRec - 4, to: tPickSara - 30, x: 1525, y: 388, w: 230, h: 34, r: 12, label: 'Recomendadas para español' },
    { from: fExpr - 2, to: fDis - 6, x: 1524, y: 120, w: 378, h: 86, r: 14, label: 'Expresividad' },
    { from: fDis - 2, to: fIco - 4, x: 1522, y: 320, w: 380, h: 56, r: 28, label: 'Diseña tu propia voz' },
    { from: fCaine - 6, to: dur, x: 1522, y: 322, w: 380, h: 56, r: 28, label: 'Voces icónicas' },
  ];
  // Panel: sin elegir → Sara elegida → (cerrado) → otra vez abierto → voces icónicas.
  const panelSrc = frame < tPickSara + 4 ? st('vp_none') : frame < tPanel2 - 2 ? st('vp_sara') : frame < fIco ? st('vp_none_nothumb') : st('vp_iconic');
  // Deslizador de expresividad dibujado encima (la captura «nothumb» no lo lleva).
  const thumbX = interpolate(frame, [fExpr + 4, fExpr + 34, fExpr + 62, fExpr + 88], [1712, 1826, 1620, 1712], { ...clamp, easing: easeInOut });
  const showThumb = frame >= tPanel2 - 2 && frame < fIco;
  const k1000 = spring({ frame: frame - fMil, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <Stage>
      <AppWindow url="elevenreader.io/reader/library" width={WIN} y={10}>
        <AppView width={WIN} states={states} cursor={cursor} camera={camera} marks={marks}
          overlay={() => (
            <>
              <Patch src={panelSrc} {...PANEL} inAt={tPanelIn} outAt={tPanelOut} />
              <Patch src={panelSrc} {...PANEL} inAt={tPanel2} outAt={1e9} />
              {showThumb && <div style={{ position: 'absolute', left: thumbX - 8, top: 157, width: 16, height: 16, borderRadius: 8, background: '#fff', border: '2px solid #000', boxSizing: 'border-box' }} />}
            </>
          )} />
      </AppWindow>
      <VoiceTag at={bAt} until={bEnd + 4} voice="Brian (inglés)" />
      <VoiceTag at={sAt} until={sEnd + 4} voice="Sara Martin (español)" />
      <Callout at={fLees} until={fDefecto - 4} x={960} y={150} anchor="center" size={44}>Lees y escuchas a la vez</Callout>
      <Callout at={v8 + 2} until={fMil - 16} x={960} y={150} anchor="center" size={44} dark>Se nota la diferencia</Callout>
      {/* «Más de 1.000 voces» */}
      <div style={{ position: 'absolute', left: 140, top: 430, opacity: k1000 * interpolate(frame, [fExpr - 6, fExpr + 6], [1, 0], clamp), transform: `scale(${0.7 + 0.3 * k1000})`, transformOrigin: 'left center', padding: '22px 40px', borderRadius: 30, background: color.yellow, boxShadow: shadow.float, fontFamily: font.sans, display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 84, letterSpacing: -2 }}>+1.000</span>
        <span style={{ fontWeight: 500, fontSize: 40 }}>voces</span>
      </div>
      <Sfx name="click" at={fPlay} />
      <Sfx name="ui_pop" at={fLees} />
      <Sfx name="focus" at={fBrian} />
      <Sfx name="click" at={tClickVoice} />
      <Sfx name="swipe" at={tPanelIn} />
      <Sfx name="ui_tap" at={tPickSara} />
      <Sfx name="click" at={tSave} />
      <Sfx name="swipe" at={tPanel2} />
      <Sfx name="ui_pop" at={fMil} />
      <Sfx name="tick_soft" at={fExpr + 34} />
      <Sfx name="tick_soft" at={fExpr + 62} />
      <Sfx name="focus" at={fDis} />
      <Sfx name="whoosh_soft" at={fIco} />
      <Sfx name="sparkle" at={fCaine} volume={0.7} />
    </Stage>
  );
};

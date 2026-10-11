import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon } from '../../components/Icons';
import { synthCursor } from '../../lib/synth';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { AppView, AppWindow, Crop, st } from './AppView';
import { w } from './timeline';

const ID = 'X05';
const WIN = 1640;

// Página 1 del PDF con la cabecera y el número de página tachados cuando la voz los nombra.
const PdfPage: React.FC<{ h: number; fHead: number; fFoot: number }> = ({ h, fHead, fFoot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = h / 1821;
  const band = (y0: number, y1: number, f: number, label: string, below = false) => {
    const s = spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 170 } });
    const strike = interpolate(frame, [f + 8, f + 18], [0, 1], { ...clamp, easing: easeOut });
    return (
      <>
        <div style={{ position: 'absolute', left: 30 * k, right: 30 * k, top: y0 * k, height: (y1 - y0) * k, border: `4px solid ${color.red}`, borderRadius: 10, opacity: s, background: `rgba(229,72,77,${0.08 * s})` }}>
          <div style={{ position: 'absolute', left: 10, right: 10, top: '50%', height: 4, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike})` }} />
        </div>
        <div style={{ position: 'absolute', left: '50%', top: below ? y1 * k + 12 : y0 * k - 58, transform: `translateX(-50%) scale(${0.7 + 0.3 * s})`, opacity: s, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28, whiteSpace: 'nowrap', boxShadow: shadow.soft }}>
          {label}
        </div>
      </>
    );
  };
  return (
    <div style={{ position: 'relative', width: 1284 * k, height: h, background: '#fff', borderRadius: 12, boxShadow: shadow.card }}>
      <Img src={staticFile('er/img/rayo-01.png')} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
      {band(34, 92, fHead, 'Cabecera')}
      {band(1750, 1812, fFoot, 'Número de página')}
    </div>
  );
};

// X05 · Tus documentos: formatos admitidos → subimos el PDF de Bécquer → 22 min de audio → sin cabeceras ni números.
export const X05Import: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W05', word, n);
  const fTextos = at('textos');
  const fAdmite = at('Admite');
  const fmts = [
    { t: 'PDF', f: at('PDF') },
    { t: 'EPUB', f: at('EPUB') },
    { t: 'Word', f: at('Word') },
    { t: 'Markdown', f: at('Markdown') },
    { t: 'TXT', f: at('TXT') },
  ];
  const fPegar = at('pegar');
  const fSub = at('subimos');
  const f12 = at('12');
  const fMom = at('momento');
  const f22 = at('22');
  const fFij = at('fijate') - 6;
  const fCab = at('cabeceras');
  const fNum = at('numeros');

  const tClick = fTextos - 8;          // clic en «Import»
  const tDrop = fSub + 46;             // el PDF cae en la zona de subida
  const tUpload = fMom - 26;           // clic en «Upload»
  const proc = [tUpload + 6, tUpload + 16, tUpload + 26, tUpload + 36];
  const tDone = Math.min(f22 - 4, tUpload + 48);
  const states = [
    { at: 0, src: st('lib_niebla') },
    { at: tClick + 4, src: st('imp_dialog'), fade: 8 },
    { at: tDrop, src: st('imp_selected'), fade: 6 },
    ...proc.map((p, i) => ({ at: p, src: st(`lib_proc${i + 1}`), fade: i === 0 ? 8 : 0 })),
    { at: tDone, src: st('lib_done'), fade: 6 },
  ];
  const cursor = synthCursor([1250, 640], [
    { t: (tClick - 34) / fps, x: 1779, y: 32, dur: 0.62, click: true },
    { t: (tUpload - 40) / fps, x: 1146, y: 781, dur: 0.7, click: true },
    { t: (tUpload + 20) / fps, x: 1200, y: 700, dur: 0.6 },
  ]);
  const camera = [
    { f: 0, zoom: 1, x: 960, y: 540 },
    { f: tClick + 10, zoom: 1, x: 960, y: 540 },
    { f: fAdmite + 6, zoom: 1.35, x: 960, y: 540 },
    { f: tUpload + 2, zoom: 1.35, x: 960, y: 560 },
    { f: tUpload + 22, zoom: 1.0, x: 960, y: 540 },
    { f: tDone + 4, zoom: 1.25, x: 760, y: 360 },
  ];
  const marks = [
    { from: fAdmite + 4, to: fPegar - 4, x: 768, y: 498, w: 384, h: 32, r: 10, label: 'Formatos admitidos' },
    { from: fPegar - 2, to: fSub - 2, x: 726, y: 608, w: 468, h: 104, r: 14, label: 'Pega un texto o un enlace' },
    { from: tDrop + 6, to: tUpload - 6, x: 736, y: 576, w: 448, h: 68, r: 18, label: '12 páginas · 150 KB' },
    { from: tDone + 6, to: fFij - 2, x: 366, y: 334, w: 64, h: 32, r: 8, label: '22 minutos de audio' },
  ];
  // El PDF vuela hasta la zona de subida.
  const fly = interpolate(frame, [fSub, tDrop], [0, 1], { ...clamp, easing: easeInOut });
  const flyOn = frame >= fSub - 2 && frame < tDrop + 6;
  const ffwd = frame >= proc[0] && frame < tDone + 10;
  // Comparación final: el PDF original frente al texto que lee la app.
  const cmp = spring({ frame: frame - fFij, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - cmp, transform: `scale(${1 - 0.06 * cmp})`, filter: `blur(${cmp * 8}px)` }}>
        <AppWindow url="elevenreader.io/reader/library" width={WIN} y={10}>
          <AppView width={WIN} states={states} cursor={cursor} camera={camera} marks={marks}
            overlay={(f) => (
              <>
                {fmts.map((m, i) => {
                  const s = spring({ frame: f - m.f + 3, fps, config: { damping: 13, stiffness: 200 } });
                  const out = interpolate(f, [fPegar - 6, fPegar + 4], [0, 1], clamp);
                  return (
                    <div key={m.t} style={{ position: 'absolute', left: 720 + [0, 96, 206, 300, 438][i], top: 236, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 16}px) scale(${0.7 + 0.3 * s})`, padding: '6px 14px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 18, boxShadow: shadow.soft }}>{m.t}</div>
                  );
                })}
              </>
            )} />
        </AppWindow>
        {/* La página del PDF entrando en la zona de subida */}
        {flyOn && (
          <div style={{ position: 'absolute', left: interpolate(fly, [0, 1], [-260, 760]), top: interpolate(fly, [0, 1], [420, 360]), width: interpolate(fly, [0, 1], [300, 120]), transform: `rotate(${interpolate(fly, [0, 1], [-12, 0])}deg)`, opacity: interpolate(frame, [tDrop - 4, tDrop + 4], [1, 0], clamp), boxShadow: '0 30px 60px rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
            <Img src={staticFile('er/img/rayo-01.png')} style={{ width: '100%', display: 'block' }} />
          </div>
        )}
        {ffwd && (
          <div style={{ position: 'absolute', left: 960, top: 70, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30, boxShadow: shadow.float }}>
            <svg width="34" height="22" viewBox="0 0 34 22"><path d="M2 2l13 9-13 9zM17 2l13 9-13 9z" fill={color.yellow} /></svg>
            Procesando el PDF (acelerado)
          </div>
        )}
      </div>

      {frame >= fFij - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: cmp }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 70, transform: `translateY(${(1 - cmp) * 50}px)` }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 74 }}>
              <div style={{ fontFamily: font.sans, fontSize: 36, fontWeight: 700, color: color.ink2 }}>Nuestro PDF</div>
              <PdfPage h={740} fHead={fCab - 4} fFoot={fNum - 4} />
            </div>
            <svg width="90" height="40" viewBox="0 0 90 40"><path d="M4 20h74M64 6l16 14-16 14" stroke={color.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 74 }}>
              <div style={{ fontFamily: font.sans, fontSize: 36, fontWeight: 700, color: color.ink2 }}>Lo que lee ElevenReader</div>
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
                <Crop src={st('rd_s_3')} x={600} y={250} w={720} h={720} width={740} />
                <div style={{ position: 'absolute', left: 24, bottom: 24, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28, opacity: spring({ frame: frame - fNum - 16, fps }) }}>
                  <CheckIcon size={34} /> Solo el texto
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="click" at={tClick} />
      <Sfx name="ui_pop" at={tClick + 6} />
      {fmts.map((m) => <Sfx key={m.t} name="tick_soft" at={m.f} />)}
      <Sfx name="focus" at={fPegar} />
      <Sfx name="whoosh_fast" at={fSub} />
      <Sfx name="snap_in" at={tDrop} />
      <Sfx name="click" at={tUpload} />
      <Sfx name="riser" at={proc[0] + 34} volume={0.6} />
      <Sfx name="success" at={tDone} />
      <Sfx name="swipe" at={fFij} />
      <Sfx name="pencil_strike" at={fCab + 4} />
      <Sfx name="pencil_strike" at={fNum + 4} />
      <Sfx name="tick" at={fNum + 16} />
    </Stage>
  );
};

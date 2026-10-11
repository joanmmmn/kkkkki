import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { AppView, AppWindow, st, VoiceTag } from './AppView';
import { CLIP, clipWordAt, itemAt, itemEnd, w } from './timeline';

const ID = 'X01';
// Índice de la palabra resaltada en el fotograma f: la narración sigue (sin sonido) tras el fragmento.
const wordAt = (f: number, clipAt: number) => {
  const a = clipWordAt('sara_cold', f - clipAt);
  if (f - clipAt < Math.round(CLIP.sara_cold.dur * 50)) return a;
  // «lo que puedo decir…» a su ritmo real (5,68 s después del inicio del fragmento de apertura)
  const b = clipWordAt('sara_ab', f - clipAt - Math.round(5.68 * 50));
  return b >= 0 ? b : 16;
};

export const ERLogo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile('er/img/elevenreader.png')} style={{ width, height: (width * 56) / 521, display: 'block', ...style }} />
);

// X01 · Arranque en frío con la narración real (Sara Martin leyendo nuestro PDF) → «¿Merece la pena?»
export const X01Hook: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipAt = itemAt(ID, 'sara_cold');
  const clipEnd = itemEnd(ID, 'sara_cold');
  const fPersona = w(ID, 'W01', 'persona');
  const fIA = w(ID, 'W01', 'inteligencia');
  const fPDF = w(ID, 'W01', 'PDF');
  const fSubir = w(ID, 'W01', 'subir');
  const fER = w(ID, 'W01', 'ElevenReader');
  const fLabs = w(ID, 'W01', 'ElevenLabs');
  const fMerece = w(ID, 'W01', 'Merece');
  const fPagar = w(ID, 'W01', 'pagar');

  const idx = wordAt(frame, clipAt);
  const states = [{ at: 0, src: st('rd_s_p') }];
  // Un estado por palabra: el resaltado de la app avanza al ritmo de la voz.
  let last = -2;
  for (let f = 0; f < dur; f++) {
    const i = wordAt(f, clipAt);
    if (i !== last && i >= 0) { states.push({ at: f, src: st(`rd_s_${i}`) }); last = i; }
  }
  void idx;

  // Cámara: muy cerca del párrafo durante el fragmento; se abre al empezar la locución.
  const camera = [
    { f: 0, zoom: 2.05, x: 955, y: 640 },
    { f: clipEnd - 40, zoom: 1.9, x: 955, y: 650 },
    { f: fPersona + 4, zoom: 1.0, x: 960, y: 540 },
  ];
  // Ventana: a sangre durante el fragmento; se enmarca cuando aparece el nombre.
  const bleed = interpolate(frame, [fER - 14, fER + 14], [1, 0], { ...clamp, easing: easeInOut });
  const sink = interpolate(frame, [fMerece - 8, fMerece + 16], [0, 1], { ...clamp, easing: easeInOut });
  const logoS = spring({ frame: frame - fER + 4, fps, config: { damping: 15, stiffness: 150 } });
  const labsS = spring({ frame: frame - fLabs, fps, config: { damping: 18, stiffness: 160 } });
  const pdfS = spring({ frame: frame - fPDF + 6, fps, config: { damping: 16, stiffness: 120 } });
  const pdfOut = interpolate(frame, [fER - 10, fER + 8], [0, 1], { ...clamp, easing: easeInOut });
  const iaS = spring({ frame: frame - fIA + 2, fps, config: { damping: 15, stiffness: 170 } });
  const iaOut = interpolate(frame, [fPDF - 4, fPDF + 6], [0, 1], clamp);

  return (
    <Stage tone="warm">
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${sink * 160}px) scale(${1 - sink * 0.12})`, filter: `blur(${sink * 7}px)`, opacity: 1 - sink * 0.55 }}>
        <AppWindow url="elevenreader.io/reader/library" width={1400} bleed={bleed} y={70}>
          <AppView width={1400} states={states} camera={camera}
            marks={[{ from: fIA - 2, to: fPDF - 2, x: 1698, y: 1017, w: 204, h: 46, r: 23, label: 'Voz de IA' }]} />
        </AppWindow>
        {/* La página del PDF que le subimos */}
        <div style={{ position: 'absolute', left: 120, top: 250, width: 360, transform: `translateX(${(1 - pdfS) * -420 - pdfOut * 520}px) rotate(${-6 + (1 - pdfS) * -10}deg)`, opacity: pdfS * (1 - pdfOut), boxShadow: '0 40px 80px rgba(0,0,0,0.35)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
          <Img src={staticFile('er/img/rayo-01.png')} style={{ width: 360, display: 'block' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px', background: 'linear-gradient(180deg, rgba(255,255,255,0), #fff 40%)', fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: color.red, color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 20 }}>PDF</span>
            {frame >= fSubir - 4 ? 'Recién subido' : 'Nuestro PDF'}
          </div>
        </div>
      </div>

      <VoiceTag at={clipAt + 10} until={clipEnd + 6} voice="Sara Martin" y={928} />

      {/* «No lo lee una persona» */}
      <div style={{ position: 'absolute', left: 960, top: 120, transform: `translateX(-50%) scale(${0.8 + 0.2 * iaS})`, opacity: iaS * (1 - iaOut), padding: '18px 40px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 46, boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
        Lo lee una <span style={{ color: color.yellow }}>inteligencia artificial</span>
      </div>

      {/* Marca: ElevenReader · de ElevenLabs */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: logoS * (1 - sink), transform: `translateY(${(1 - logoS) * -30 - sink * 40}px) scale(${0.9 + 0.1 * logoS})` }}>
        <ERLogo width={430} />
        <div style={{ fontFamily: font.sans, fontSize: 30, color: color.ink2, opacity: labsS, transform: `translateY(${(1 - labsS) * 10}px)` }}>la app de lectura de ElevenLabs</div>
      </div>

      {/* ¿Merece la pena? */}
      {frame >= fMerece - 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 132, color: color.ink, letterSpacing: -2, lineHeight: 1.05, textAlign: 'center' }}>
            <Words text="¿Merece la" start={fMerece - 6} size={132} weight={700} style={{ display: 'inline' }} />
            <span style={{ display: 'inline-block', opacity: spring({ frame: frame - fMerece - 4, fps }) }}><Highlight start={fPagar - 4} dur={16}>pena?</Highlight></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: spring({ frame: frame - fPagar - 6, fps }), transform: `translateY(${(1 - spring({ frame: frame - fPagar - 6, fps })) * 20}px)` }}>
            <div style={{ padding: '14px 30px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, fontFamily: font.sans, fontSize: 36, fontWeight: 500 }}>Reseña con la cuenta de pago, <b>por dentro</b></div>
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="ui_pop" at={clipAt + 10} volume={0.6} />
      <Sfx name="whoosh_soft" at={fPersona} volume={0.8} />
      <Sfx name="ui_pop" at={fIA} />
      <Sfx name="swipe" at={fPDF - 4} />
      <Sfx name="card_flip" at={fPDF} />
      <Sfx name="zoom_out" at={fER - 12} />
      <Sfx name="logo_sting" at={fER} volume={0.8} />
      <Sfx name="whoosh_deep" at={fMerece - 6} volume={0.7} />
      <Sfx name="marker" at={fPagar - 4} />
    </Stage>
  );
};

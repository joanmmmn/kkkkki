import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { ERLogo } from './common';
import { IcDownload, IcFile, IcHeadphones, IcMic } from './icons';

// R09 · Qué incluye Ultra (pricing de ElevenReader, 11/10/2026): 20 h/mes de títulos prémium (catálogo de 200.000+),
// 1.000+ voces, descargas sin conexión y conversión de tus archivos sin límite (hasta 24 h al día).
const EXTRAS = ['Velocidad hasta 4x', 'Temporizador', 'Marcadores', 'Web y móvil sincronizados'];
const CARDS = [
  { word: '20', icon: IcHeadphones, big: '20 h al mes', sub: 'de audiolibros prémium', note: 'catálogo de más de 200.000 títulos' },
  { word: 'mil', icon: IcMic, big: '1.000+ voces', sub: 'elige quién te lee', note: 'para tus textos y muchos libros del catálogo' },
  { word: 'descargas', icon: IcDownload, big: 'Sin conexión', sub: 'descarga y escucha sin internet', note: 'hasta 150 h de descargas al mes' },
  { word: 'limite', icon: IcFile, big: 'Tus PDF y ebooks', sub: 'y artículos, en audio sin límite', note: 'hasta 24 h de audio al día' },
];

export const R09Ultra: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R09', w, n);
  const head = spring({ frame: frame - 1, fps, config: { damping: 16, stiffness: 160 } });
  const fs = CARDS.map((c) => at(c.word) - 4);
  const extraAt = Math.min(dur - 60, fs[3] + 70);
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: head, transform: `translateY(${(1 - head) * -30}px)` }}>
          <ERLogo width={300} />
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink }}>
            <Highlight start={8} dur={14} height={0.4}>Ultra</Highlight> incluye
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '640px 640px', gap: 34 }}>
          {CARDS.map((c, i) => {
            const s = spring({ frame: frame - fs[i], fps, config: { damping: 15, stiffness: 160 } });
            const on = frame >= fs[i] && (i === CARDS.length - 1 || frame < fs[i + 1] + 6);
            const Icon = c.icon;
            return (
              <div key={c.big} style={{ display: 'flex', gap: 28, alignItems: 'center', padding: '30px 34px', borderRadius: 32, background: on ? color.yellowSoft : '#fff', border: `${on ? 3 : 1}px solid ${on ? color.yellow : color.line}`, boxShadow: on ? '0 30px 70px rgba(255,202,5,0.25)' : shadow.card,
                opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.9 + 0.1 * s})`, filter: `blur(${(1 - s) * 6}px)` }}>
                <div style={{ width: 96, height: 96, borderRadius: 28, background: on ? color.yellow : '#F4F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={52} />
                </div>
                <div style={{ fontFamily: font.sans }}>
                  <div style={{ fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1, lineHeight: 1.05 }}>{c.big}</div>
                  <div style={{ fontWeight: 500, fontSize: 28, color: color.ink2, marginTop: 6 }}>{c.sub}</div>
                  <div style={{ fontSize: 22, color: color.muted, marginTop: 6 }}>{c.note}</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* También en el plan gratis (pricing: «4.0x speed, sleep timer & bookmarks», «Syncs between web & mobile»). */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: -10 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink2, marginRight: 6, opacity: spring({ frame: frame - extraAt, fps }) }}>Y en cualquier plan:</div>
          {EXTRAS.map((t, i) => {
            const e = spring({ frame: frame - extraAt - 4 - i * 4, fps, config: { damping: 15, stiffness: 180 } });
            return <div key={t} style={{ padding: '10px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink, opacity: e, transform: `translateY(${(1 - e) * 20}px) scale(${0.85 + 0.15 * e})` }}>{t}</div>;
          })}
        </div>
        <div style={{ fontFamily: font.sans, fontSize: 22, color: color.muted, marginTop: -16, opacity: spring({ frame: frame - extraAt - 20, fps }) }}>
          Condiciones de ElevenReader a 11 de octubre de 2026 · elevenreader.io/pricing
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={0} volume={0.7} />
      <Sfx name="marker" at={8} />
      {fs.map((f, i) => <Sfx key={i} name="snap_in" at={f + 2} volume={0.7} />)}
      {EXTRAS.map((t, i) => <Sfx key={t} name="tick_soft" at={extraAt + 4 + i * 4} volume={0.45} />)}
      {dur > 0 && null}
    </Stage>
  );
};

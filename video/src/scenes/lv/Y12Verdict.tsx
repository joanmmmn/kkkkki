import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { BookIcon, CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { IcSearch } from '../er/icons';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { LvLogo } from './common';
import { w } from './timeline';

const ID = 'Y12';
const SCORE = 7.5;
// Las notas por apartado de la página (la media es la nota global).
const PARTS: [string, number][] = [['Precio', 10], ['Descargas y formatos', 9.5], ['Calidad de las voces', 6.5], ['Facilidad de uso', 6], ['Catálogo en español', 5.5]];

// Y12 · Veredicto: clásicos sí, y mucho · novedades, no · 7,5/10.
export const Y12Verdict: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L12', word, n);
  const fGust = at('gustan') - 6;
  const fSi = at('sí', 1);
  const fNada = at('nada');
  const fBus = at('buscas') - 6;
  const fEnc = at('encontrar');
  const fNota = at('Nuestra') - 4;
  const f7 = at('siete');
  const r1 = spring({ frame: frame - fGust, fps, config: { damping: 16, stiffness: 150 } });
  const r2 = spring({ frame: frame - fBus, fps, config: { damping: 16, stiffness: 150 } });
  const yes = spring({ frame: frame - fSi + 2, fps, config: { damping: 10, stiffness: 200 } });
  const no = spring({ frame: frame - fEnc + 2, fps, config: { damping: 12, stiffness: 200 } });
  const out = interpolate(frame, [fNota - 8, fNota + 16], [0, 1], { ...clamp, easing: easeInOut });
  const sc = spring({ frame: frame - fNota - 2, fps, config: { damping: 18, stiffness: 130 } });
  const ring = interpolate(frame, [f7 - 10, f7 + 26], [0, SCORE / 10], { ...clamp, easing: easeOut });
  const num = spring({ frame: frame - f7 + 2, fps, config: { damping: 9, stiffness: 200 } });
  const R = 170, C = 2 * Math.PI * R;
  const rowBox = (s: number, children: React.ReactNode) => (
    <div style={{ width: 1400, display: 'flex', alignItems: 'center', gap: 30, padding: '30px 44px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>{children}</div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, opacity: 1 - out, transform: `scale(${1 - 0.06 * out})`, filter: out > 0.01 ? `blur(${out * 3}px)` : undefined }}>
        <Words text="¿Merece la pena?" start={0} size={100} weight={700} />
        {rowBox(r1, (
          <>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookIcon size={50} /></div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 44, fontWeight: 500 }}>Si te gustan los <b>clásicos</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${yes})`, fontFamily: font.sans, fontSize: 52, fontWeight: 700, color: color.green }}><CheckIcon size={56} /> Sí, y mucho</div>
          </>
        ))}
        <div style={{ fontFamily: font.sans, fontSize: 36, color: color.ink2, opacity: spring({ frame: frame - fNada, fps }), marginTop: -14 }}>No hay nada igual <Highlight start={fNada + 8}>gratis</Highlight></div>
        {rowBox(r2, (
          <>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcSearch size={46} w={1.8} /></div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 44, fontWeight: 500 }}>Si buscas <b>novedades</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${no})`, fontFamily: font.sans, fontSize: 52, fontWeight: 700, color: color.red }}><CrossIcon size={56} /> Aquí no están</div>
          </>
        ))}
      </AbsoluteFill>
      {frame >= fNota - 8 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 110, opacity: sc, transform: `scale(${0.9 + 0.1 * sc})` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
            <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink2 }}>Nuestra nota</div>
            <div style={{ position: 'relative', width: 420, height: 420 }}>
              <svg width={420} height={420} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx={210} cy={210} r={R} fill="none" stroke="#EDEDED" strokeWidth={26} />
                <circle cx={210} cy={210} r={R} fill="none" stroke={color.yellow} strokeWidth={26} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
                <span style={{ fontWeight: 700, fontSize: 148, letterSpacing: -5, transform: `scale(${0.6 + 0.4 * num})`, display: 'inline-block' }}>7,5</span>
                <span style={{ fontWeight: 500, fontSize: 46, color: color.muted, marginTop: 64 }}>/10</span>
              </div>
            </div>
            <LvLogo width={300} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: 640 }}>
            {PARTS.map(([t, v], i) => {
              const p = interpolate(frame, [f7 + 6 + i * 5, f7 + 36 + i * 5], [0, v / 10], { ...clamp, easing: easeOut });
              const s = spring({ frame: frame - f7 - 2 - i * 5, fps, config: { damping: 18, stiffness: 160 } });
              return (
                <div key={t} style={{ opacity: s, transform: `translateX(${(1 - s) * 30}px)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontSize: 32, fontWeight: 500, marginBottom: 8 }}>
                    <span>{t}</span><b>{String(v).replace('.', ',')}</b>
                  </div>
                  <div style={{ height: 16, borderRadius: 8, background: '#EFEFEF', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p * 100}%`, borderRadius: 8, background: v >= 9 ? color.yellow : color.ink }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="card_flip" at={fGust} />
      <Sfx name="success" at={fSi} volume={0.8} />
      <Sfx name="marker" at={fNada + 8} />
      <Sfx name="card_flip" at={fBus} />
      <Sfx name="fail" at={fEnc} volume={0.6} />
      <Sfx name="whoosh_deep" at={fNota} volume={0.6} />
      <Sfx name="riser" at={f7 - 50} volume={0.5} />
      <Sfx name="impact" at={f7} />
      <Sfx name="score_ding" at={f7 + 6} volume={0.7} />
    </Stage>
  );
};

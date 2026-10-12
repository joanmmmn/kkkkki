import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut, fmtEs } from '../../lib/anim';
import { B, Chip, Cover, LvWeb, lvw, markOn } from './common';
import { w } from './timeline';

const ID = 'Y04';

// Regla de años: hasta 1930, dominio público en EE. UU. (95 años o más en 2026); después, con derechos.
const YearRuler: React.FC<{ at: number; brace: number }> = ({ at, brace }) => {
  const frame = useCurrentFrame();
  const W = 1500, y0 = 1880, y1 = 2026;
  const x = (y: number) => ((y - y0) / (y1 - y0)) * W;
  const p = interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: easeOut });
  const b = interpolate(frame, [brace, brace + 24], [0, 1], { ...clamp, easing: easeInOut });
  const cut = x(1931);
  return (
    <div style={{ position: 'relative', width: W, height: 260, fontFamily: font.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 110, width: cut * p, height: 56, borderRadius: '28px 0 0 28px', background: color.yellow }} />
      <div style={{ position: 'absolute', left: cut, top: 110, width: (W - cut) * Math.max(0, (p - 0.6) / 0.4), height: 56, borderRadius: '0 28px 28px 0', background: '#E4E4E4' }} />
      <div style={{ position: 'absolute', left: 30, top: 118, fontSize: 32, fontWeight: 700, opacity: p }}>Dominio público en EE. UU.</div>
      <div style={{ position: 'absolute', left: cut + 24, top: 118, fontSize: 32, fontWeight: 700, color: color.ink2, opacity: Math.max(0, (p - 0.7) / 0.3), whiteSpace: 'nowrap' }}>Con derechos de autor</div>
      {[1880, 1900, 1930, 1960, 1990, 2026].map((y) => (
        <div key={y} style={{ position: 'absolute', left: x(y), top: 182, transform: 'translateX(-50%)', fontSize: y === 1930 || y === 2026 ? 34 : 28, fontWeight: y === 1930 || y === 2026 ? 700 : 500, color: y === 1930 || y === 2026 ? color.ink : color.muted, opacity: p }}>{y}</div>
      ))}
      {/* Llave de 95 años: de 1930 a 2026 */}
      <div style={{ position: 'absolute', left: x(1930), width: (x(2026) - x(1930)) * b, top: 40, height: 46, borderTop: `5px solid ${color.ink}`, borderLeft: `5px solid ${color.ink}`, borderRight: b > 0.98 ? `5px solid ${color.ink}` : 'none', borderRadius: '16px 16px 0 0' }} />
      <div style={{ position: 'absolute', left: (x(1930) + x(2026)) / 2, top: -14, transform: `translateX(-50%) scale(${b})`, padding: '6px 22px', borderRadius: 999, background: color.ink, color: '#fff', fontSize: 34, fontWeight: 700, whiteSpace: 'nowrap' }}>95 años o más</div>
    </div>
  );
};

// Y04 · Por qué es legal (95 años) · clásicos, no novedades · 21.000 títulos · español: cuarto idioma · portadas.
export const Y04Catalog: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L04', word, n);
  const fEEUU = at('Estados');
  const f95 = at('noventa');
  const fNov = at('novedades') - 6;
  const fClas = at('clásicos');
  const fMuchos = at('Muchos') - 6;
  const f21 = at('veintiún');
  const fIdio = at('decenas');
  const fCuarto = at('cuarto');
  const fMil = at('mil', 1);
  const fHoras = at('quinientas');
  const fQ = at('Quijote') - 10;
  const titles = [
    { id: '20198', f: at('Quijote') },
    { id: '3579', f: at('Lazarillo') },
    { id: '13208', f: at('Regenta') },
    { id: '14336', f: at('Fortunata') },
    { id: '5079', f: at('Leyendas') },
  ];
  const cnt = interpolate(frame, [f21 - 8, f21 + 26], [0, 21000], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const sNo = spring({ frame: frame - fNov, fps, config: { damping: 14, stiffness: 170 } });
  const sSi = spring({ frame: frame - fClas + 2, fps, config: { damping: 12, stiffness: 180 } });
  const strike = interpolate(frame, [fNov + 14, fNov + 26], [0, 1], { ...clamp, easing: easeInOut });
  const sp = B['lang:Spanish'];
  return (
    <Stage tone="warm">
      <Phase from={0} to={fNov}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70 }}>
          <Words text="¿Y por qué es legal?" start={0} size={100} weight={700} />
          <YearRuler at={fEEUU - 10} brace={f95 - 4} />
        </AbsoluteFill>
      </Phase>

      <Phase from={fNov} to={fMuchos}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 80, fontFamily: font.sans }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '40px 64px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: sNo, transform: `scale(${0.85 + 0.15 * sNo})` }}>
            <CrossIcon size={84} />
            <span style={{ fontSize: 96, fontWeight: 700, color: strike > 0.5 ? color.muted : color.ink }}>Novedades</span>
            <div style={{ position: 'absolute', left: 150, right: 50, top: '50%', height: 12, borderRadius: 6, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-4deg)` }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '40px 64px', borderRadius: 40, background: color.ink, color: '#fff', boxShadow: shadow.float, opacity: sSi, transform: `scale(${0.8 + 0.2 * sSi}) rotate(${(1 - sSi) * -4}deg)` }}>
            <CheckIcon size={84} c={color.yellow} />
            <span style={{ fontSize: 96, fontWeight: 700 }}>Clásicos</span>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fMuchos} to={fQ}>
        <AbsoluteFill>
          <AbsoluteFill style={{ transform: 'translateX(170px)' }}>
          <LvWeb states={[{ at: 0, src: lvw('lang') }]} width={1380} y={70}
            camera={[{ f: 0, zoom: 1.0, x: 640, y: 380 }, { f: fCuarto - fMuchos - 90, zoom: 1.0, x: 640, y: 380 }, { f: fCuarto - fMuchos + 10, zoom: 1.2, x: 760, y: 470 }, { f: fQ - fMuchos + 10, zoom: 1.24, x: 760, y: 480 }]}
            marks={[markOn(sp, fCuarto - fMuchos - 2, dur, 4, { label: '4.º idioma' })]} />
          </AbsoluteFill>
          <div style={{ position: 'absolute', left: 70, top: 120, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ padding: '22px 34px', borderRadius: 30, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, fontFamily: font.sans, opacity: spring({ frame: frame - f21 + 8, fps }) }}>
              <div style={{ fontSize: 30, color: color.ink2, fontWeight: 500 }}>más de</div>
              <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtEs(Math.round(cnt / 100) * 100)}</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>títulos</div>
            </div>
            <Chip at={fIdio - fMuchos - 2} size={34} bg={color.yellow}>decenas de idiomas</Chip>
          </div>
          <div style={{ position: 'absolute', right: 80, bottom: 90, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
            <Chip at={fMil - fMuchos - 4} size={40}>Español: más de <Highlight start={fMil - fMuchos + 8}>1.000 obras</Highlight></Chip>
            <Chip at={fHoras - fMuchos - 4} size={40} bg={color.ink} fg="#fff">más de 3.500 horas</Chip>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fQ} to={dur} hold>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 700, color: color.ink2 }}>Clásicos en español, gratis</div>
          <div style={{ display: 'flex', gap: 34, alignItems: 'flex-end' }}>
            {titles.map((t, i) => {
              const s = spring({ frame: frame - t.f + 6, fps, config: { damping: 13, stiffness: 150 } });
              const lift = interpolate(frame, [t.f - 2, t.f + 12, t.f + 38], [0, -22, 0], { ...clamp, easing: easeInOut });
              return (
                <div key={t.id} style={{ opacity: s, transform: `translateY(${(1 - s) * 120 + lift}px) rotate(${(i - 2) * 2.5 * (1 - s * 0.6)}deg) scale(${0.8 + 0.2 * s})` }}>
                  <Cover id={t.id} size={300} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="draw" at={fEEUU - 10} volume={0.8} />
      <Sfx name="marker" at={f95 - 2} />
      <Sfx name="swipe" at={fNov} />
      <Sfx name="pencil_strike" at={fNov + 14} />
      <Sfx name="pop_bright" at={fClas} />
      <Sfx name="whoosh_soft" at={fMuchos} />
      <Sfx name="counter" at={f21 - 8} trimAfter={36} />
      <Sfx name="ui_pop" at={fIdio - 2} />
      <Sfx name="marker" at={fCuarto} />
      <Sfx name="ui_pop" at={fMil - 4} />
      <Sfx name="ui_pop" at={fHoras - 4} />
      <Sfx name="page_riffle" at={fQ} volume={0.8} />
      {titles.map((t) => <Sfx key={t.id} name="card_flip" at={t.f - 4} volume={0.7} />)}
    </Stage>
  );
};

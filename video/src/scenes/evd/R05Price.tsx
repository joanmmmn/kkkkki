import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Grow } from '../../components/Grow';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeOut } from '../../lib/anim';
import { Count, Flag, Pop } from './ui';

const W = 540;
const Card: React.FC<{ flag: 'es' | 'mx' | 'us'; country: string; children: React.ReactNode }> = ({ flag, country, children }) => (
  <div style={{ width: W, height: 600, boxSizing: 'border-box', padding: '38px 44px', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', fontFamily: font.sans }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 44, fontWeight: 700 }}><Flag c={flag} h={44} /> {country}</div>
    <div style={{ height: 1, background: color.line, margin: '28px 0' }} />
    {children}
  </div>
);

const PlanTag: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ alignSelf: 'flex-start', background: color.ink, color: '#fff', borderRadius: 999, padding: '8px 22px', fontSize: 30, fontWeight: 700 }}>{name}</div>
);

// R05 · Precios: España (Plus 14,99 € ≈ 5 €/libro), México (Standard 149 MXN) y EE. UU. (Deluxe más caro por libro que Plus).
export const R05Price: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R05', w, n, fb);
  const fEs = at('Espana', 0, 1.56) - 8;
  const fPrecio = at('14,99', 0, 3.12);
  const fCinco = at('cinco', 0, 6.56);
  const fMx = at('Mexico', 0, 8.4) - 8;
  const f149 = at('149', 0, 9.96);
  const fUs = at('Estados', 0, 12.16) - 8;
  const fCaro = at('caro', 0, 13.76);
  const fCaro2 = at('caro', 1, 14.72);
  const fSegun = at('segun', 0, 16.4);
  const title = spring({ frame: frame - fEs + 10, fps, config: { damping: 20, stiffness: 120 } });
  const bar = (v: number, f: number) => interpolate(frame, [f, f + 22], [0, v], { ...clamp, easing: easeOut });
  const deluxeHot = interpolate(frame, [fCaro2, fCaro2 + 8], [0, 1], clamp);
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `translateY(${-330 * title}px) scale(${1 - 0.45 * title})` }}>
          <Words text="¿Cuánto cuesta?" start={2} size={140} weight={700} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 110 }}>
        <div style={{ display: 'flex' }}>
          <Grow at={fEs} w={W} first rise={70}>
            <Card flag="es" country="España">
              <PlanTag name="Plan Plus · 3 libros" />
              <div style={{ marginTop: 26, fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}><Count to={14.99} decimals={2} at={fPrecio - 6} dur={20} /> €</div>
              <div style={{ fontSize: 34, color: color.ink2, marginTop: 6 }}>al mes</div>
              <Pop at={fCinco - 6} style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 46, fontWeight: 700 }}><Highlight start={fCinco + 6} dur={12}>≈ 5 € por libro</Highlight></div>
              </Pop>
            </Card>
          </Grow>
          <Grow at={fMx} w={W} gap={46} rise={70}>
            <Card flag="mx" country="México">
              <PlanTag name="Plan Standard · 1 libro" />
              <div style={{ marginTop: 26, fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}><Count to={149} at={f149 - 8} dur={20} /></div>
              <div style={{ fontSize: 34, color: color.ink2, marginTop: 6 }}>pesos al mes</div>
              <Pop at={f149 + 24} style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 40, fontWeight: 500, color: color.ink2 }}>1 libro al mes</div>
              </Pop>
            </Card>
          </Grow>
          <Grow at={fUs} w={W} gap={46} rise={70}>
            <Card flag="us" country="EE. UU.">
              <div style={{ fontSize: 34, fontWeight: 500, color: color.ink2 }}>Precio por libro</div>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', gap: 50, height: 300, paddingLeft: 20 }}>
                {[
                  { k: 'Plus', p: '16,99 $ ÷ 3', v: 5.66, f: fCaro - 6, hot: 0 },
                  { k: 'Deluxe', p: '28,99 $ ÷ 5', v: 5.8, f: fCaro, hot: deluxeHot },
                ].map((b) => (
                  <div key={b.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 180 }}>
                    <div style={{ fontSize: 44, fontWeight: 700, opacity: bar(1, b.f), color: b.hot > 0.5 ? color.red : color.ink }}>{bar(b.v, b.f).toFixed(2).replace('.', ',')} $</div>
                    <div style={{ width: 130, height: 24 * bar(b.v, b.f), borderRadius: '16px 16px 6px 6px', background: b.hot > 0.5 ? color.red : '#2B2B2E', boxShadow: b.hot > 0.5 ? '0 10px 30px rgba(229,72,77,0.35)' : undefined }} />
                    <div style={{ fontSize: 34, fontWeight: 700 }}>{b.k}</div>
                    <div style={{ fontSize: 24, color: color.muted, whiteSpace: 'nowrap' }}>{b.p}</div>
                  </div>
                ))}
              </div>
              <Pop at={fSegun - 4} style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 26, color: color.muted }}>Fuente: precios de everand.com</div>
              </Pop>
            </Card>
          </Grow>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.7} />
      <Sfx name="card_flip" at={fEs + 2} />
      <Sfx name="counter" at={fPrecio - 6} />
      <Sfx name="marker" at={fCinco + 6} />
      <Sfx name="card_flip" at={fMx + 2} />
      <Sfx name="counter" at={f149 - 8} volume={0.9} />
      <Sfx name="card_flip" at={fUs + 2} />
      <Sfx name="pop" at={fCaro - 6} />
      <Sfx name="pop" at={fCaro} volume={1.1} />
      <Sfx name="fail" at={fCaro2 + 2} volume={0.8} />
      <Sfx name="tick_soft" at={fSegun - 4} />
    </Stage>
  );
};

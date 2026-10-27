import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Grow } from '../../components/Grow';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeOut } from '../../lib/anim';
import { Count, EV_LIME, LockIcon, Pop, ShotWindow } from './ui';

const AUTHORS: [string, string, number][] = [
  ['García Márquez', 'Garcia', 6.48],
  ['Vargas Llosa', 'Vargas', 7.6],
  ['Ruiz Zafón', 'Ruiz', 8.64],
  ['Pérez-Reverte', 'Perez', 9.64],
  ['Posteguillo', 'Posteguillo', 10.84],
];
const AW = 300;

const Author: React.FC<{ name: string; lock: number }> = ({ name, lock }) => {
  const initials = name.split(/[\s-]/).map((p) => p[0]).join('').slice(0, 2);
  return (
    <div style={{ position: 'relative', width: AW, height: 300, boxSizing: 'border-box', background: '#fff', borderRadius: 30, boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, fontFamily: font.sans }}>
      <div style={{ width: 130, height: 130, borderRadius: '50%', background: `linear-gradient(150deg, ${color.yellowSoft}, ${color.yellow})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, fontWeight: 700, color: color.ink, filter: `grayscale(${lock * 0.8})` }}>{initials}</div>
      <div style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, padding: '0 16px' }}>{name}</div>
      {lock > 0 && (
        <div style={{ position: 'absolute', right: -18, top: -18, width: 76, height: 76, borderRadius: 22, background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lock}) rotate(${(1 - lock) * 30}deg)`, boxShadow: '0 12px 26px rgba(0,0,0,0.35)' }}>
          <LockIcon size={44} c={EV_LIME} />
        </div>
      )}
    </div>
  );
};

// R06 · En español: ~41.000 audiolibros (PRH, Planeta; grandes autores) pero todos con desbloqueo; sin límites, ~600,
// como «Crimen y castigo» abreviado en 2 horas; y algunos con voz sintética.
export const R06Spanish: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R06', w, n, fb);
  const fCuarenta = at('cuarenta', 0, 2.24);
  const fPenguin = at('Penguin', 0, 4.24);
  const fPlaneta = at('Planeta', 0, 5.6);
  const fTodos = at('todos', 0, 12.24);
  const fSin = at('Sin', 0, 14.08);
  const fSeis = at('seiscientos', 0, 15.48);
  const fComo = at('como', 0, 17.2);
  const fAbrev = at('abreviado', 0, 18.8);
  const fDos = at('dos', 0, 19.52);
  const fY = at('Y', 0, 20.56);
  const fSint = at('sintetica', 0, 21.64);
  const fMira = at('mira', 0, 22.68);
  const fNarr = at('narrador', 0, 23.0);
  const pB = fSin - 4;
  const pC = fComo - 4;
  const pD = fY - 4;
  const head = spring({ frame: frame - fCuarenta + 6, fps, config: { damping: 18, stiffness: 140 } });
  const barFull = interpolate(frame, [pB + 8, pB + 30], [0, 1], { ...clamp, easing: easeOut });
  const barTiny = interpolate(frame, [fSeis, fSeis + 18], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      {/* A · 41.000 audiolibros en español, grandes autores… todos con desbloqueo */}
      <Phase from={0} to={pB}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 50, transform: `translateY(${(1 - head) * 120}px)` }}>
            <Words text="¿Y en español?" start={2} size={84} weight={700} />
            <div style={{ opacity: head, display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: font.sans }}>
              <span style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>≈ <Count to={41000} at={fCuarenta} dur={26} /></span>
              <span style={{ fontSize: 44, fontWeight: 500, color: color.ink2 }}>audiolibros</span>
              <span style={{ fontSize: 26, color: color.muted }}>(estimación SonorBooks)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, height: 70 }}>
            {[['Penguin Random House', fPenguin], ['Planeta', fPlaneta]].map(([t, f]) => (
              <Pop key={t as string} at={(f as number) - 4}><div style={{ background: color.ink, color: '#fff', borderRadius: 999, padding: '14px 32px', fontFamily: font.sans, fontSize: 36, fontWeight: 700 }}>{t}</div></Pop>
            ))}
          </div>
          <div style={{ display: 'flex', height: 320 }}>
            {AUTHORS.map(([name, word, fb], i) => {
              const f = at(word, 0, fb) - 6;
              const lock = spring({ frame: frame - fTodos - i * 4, fps, config: { damping: 12, stiffness: 200 } });
              return <Grow key={name} at={f} w={AW} gap={34} first={i === 0}><Author name={name} lock={frame >= fTodos + i * 4 ? lock : 0} /></Grow>;
            })}
          </div>
          <div style={{ height: 64 }}>
            <Pop at={fTodos + 4}><div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontSize: 46, fontWeight: 700 }}><LockIcon size={46} /> Todos piden desbloqueo</div></Pop>
          </div>
        </AbsoluteFill>
      </Phase>

      {/* B · Sin límites: ~600 de ~41.000 */}
      <Phase from={pB} to={pC}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54, fontFamily: font.sans }}>
          <Words text="Sin límites, en español" start={2} size={84} weight={700} />
          <div style={{ width: 1500, display: 'flex', flexDirection: 'column', gap: 40 }}>
            {[
              { k: 'Con desbloqueo', v: 41000, p: barFull, c: '#2B2B2E', f: 8 },
              { k: 'Sin límites', v: 600, p: barTiny * (600 / 41000), c: color.yellow, f: fSeis - pB },
            ].map((b) => (
              <div key={b.k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 42, fontWeight: 700, marginBottom: 12 }}>
                  <span>{b.k}</span><span>≈ <Count to={b.v} at={b.f} dur={20} /></span>
                </div>
                <div style={{ height: 56, borderRadius: 16, background: '#EFEFEF' }}>
                  <div style={{ height: 56, borderRadius: 16, width: `max(${b.p * 100}%, ${b.k === 'Sin límites' && barTiny > 0 ? 18 : 0}px)`, background: b.c, boxShadow: b.c === color.yellow ? '0 0 0 6px rgba(255,202,5,0.3)' : undefined }} />
                </div>
              </div>
            ))}
          </div>
          <Pop at={fSeis - pB + 16}><div style={{ background: color.ink, color: '#fff', borderRadius: 999, padding: '12px 34px', fontSize: 42, fontWeight: 700 }}>Menos del 2 %</div></Pop>
        </AbsoluteFill>
      </Phase>

      {/* C · «Crimen y castigo»: la versión sin límites dura 2 horas; la completa, 24 */}
      <Phase from={pC} to={pD}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 40 }}>
          {[
            { src: 'evd/shots/crimen_ilim.jpg', tag: 'Sin desbloqueo', mark: { x: 456, y: 476, w: 410, h: 26, r: 6, label: 'Abreviado: 2 horas' }, f: fAbrev - pC - 4, lime: true },
            { src: 'evd/shots/crimen_full.jpg', tag: 'Con desbloqueo', mark: { x: 538, y: 476, w: 66, h: 26, r: 6, label: 'Completo: 24 horas' }, f: fDos - pC, lime: false },
          ].map((s, i) => (
            <Pop key={s.src} at={2 + i * 6}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 999, padding: '10px 26px', background: s.lime ? EV_LIME : color.ink, color: s.lime ? color.ink : '#fff', fontFamily: font.sans, fontSize: 34, fontWeight: 700 }}>
                  {!s.lime && <LockIcon size={34} c={EV_LIME} />}{s.tag}
                </div>
                <ShotWindow src={s.src} width={900} url="es.everand.com"
                  camera={[{ f: 0, zoom: 3.1, x: 680, y: 545 }, { f: pD - pC + 10, zoom: 3.35, x: 660, y: 530 }]}
                  marks={[{ from: s.f, to: pD - pC + 6, ...s.mark }]} />
              </div>
            </Pop>
          ))}
        </AbsoluteFill>
      </Phase>

      {/* D · Voz sintética: crédito real de una ficha de Everand → mira el narrador antes de desbloquear */}
      <Phase from={pD} to={dur}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/synth.jpg" width={1560} url="es.everand.com"
            camera={[
              { f: 0, zoom: 2.4, x: 690, y: 640 },
              { f: dur - pD, zoom: 2.7, x: 650, y: 640 },
            ]}
            marks={[
              { from: fSint - pD - 6, to: fNarr - pD - 4, x: 652, y: 608, w: 100, h: 28, r: 8, label: 'Voz sintética' },
              { from: fNarr - pD - 2, to: dur - pD, x: 456, y: 608, w: 298, h: 28, r: 8, label: 'Mira el narrador antes de desbloquear', labelBelow: true },
            ]} />
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_soft" at={2} volume={0.7} />
      <Sfx name="counter" at={fCuarenta} />
      <Sfx name="ui_pop" at={fPenguin - 4} />
      <Sfx name="ui_pop" at={fPlaneta - 4} />
      {AUTHORS.map(([n, w, fb]) => <Sfx key={n} name="pop" at={at(w, 0, fb) - 4} volume={0.85} />)}
      {AUTHORS.map(([n], i) => <Sfx key={`l${n}`} name="tick" at={fTodos + i * 4} volume={0.9} />)}
      <Sfx name="hit_soft" at={fTodos + 4} volume={0.8} />
      <Sfx name="swipe" at={pB} />
      <Sfx name="draw" at={pB + 8} />
      <Sfx name="pop" at={fSeis} />
      <Sfx name="swipe" at={pC} />
      <Sfx name="focus" at={fAbrev - 4} />
      <Sfx name="focus" at={fDos} volume={0.9} />
      <Sfx name="swipe" at={pD} />
      <Sfx name="focus" at={fSint - 6} />
      <Sfx name="ui_pop" at={fMira} />
      <Sfx name="tick_soft" at={fNarr - 2} />
    </Stage>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Stage } from '../../components/Stage';
import { LinkBadge, MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BONE, Book10, BOOKS10, Cover10, DIM, KickerN, Night, RED, color, font, shadow } from './kit';
import { sceneClock } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });

const TipIcon: React.FC<{ kind: 'moon' | 'head' | 'phone'; size: number }> = ({ kind, size }) => {
  const p = { stroke: color.ink, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === 'moon' && <path d="M17.5 15.5A7.5 7.5 0 0 1 9 4.6a7.5 7.5 0 1 0 8.5 10.9z" {...p} />}
      {kind === 'head' && (<><path d="M4 15v-3a8 8 0 0 1 16 0v3" {...p} /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /></>)}
      {kind === 'phone' && (<><rect x="7" y="2.5" width="10" height="19" rx="2" {...p} /><path d="M3 3l18 18" {...p} strokeWidth={2.4} /></>)}
    </svg>
  );
};

// Consejo de escucha (noche).
export const Tip: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TIP');
  const tips = [
    { k: 'moon' as const, t: 'De noche', at: c.at('X111', 'noche') - 6 },
    { k: 'head' as const, t: 'Con auriculares', at: c.at('X111', 'auriculares') - 6 },
    { k: 'phone' as const, t: 'Sin mirar el móvil', at: c.at('X111', 'mirar') - 6 },
  ];
  return (
    <AbsoluteFill>
      <Night red={0.5}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <KickerN at={c.part('X111')} text="Un consejo para que funcione" />
          <div style={{ display: 'flex', gap: 44, marginTop: 50 }}>
            {tips.map((tp) => {
              const s = sp(frame, tp.at, 14, 170);
              return (
                <div key={tp.t} style={{ width: 420, padding: '48px 30px', borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
                  <div style={{ width: 130, height: 130, borderRadius: '50%', background: color.yellow, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TipIcon kind={tp.k} size={74} /></div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: BONE, marginTop: 30 }}>{tp.t}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Night>
      {tips.map((tp) => <Sfx key={tp.t} name="ui_pop" at={tp.at + 1} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// Las fichas de SonorBooks y el artículo del blog (vuelve la luz: el mundo claro de la marca).
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('WEB');
  const f0 = c.part('X112');
  const plats = c.at('X112', 'plataformas') - 6;
  const gratis = c.at('X112', 'gratis') - 6;
  const links = c.at('X112', 'enlaces') - 8;
  const blog = c.at('X112', 'blog') - 8;
  const shift = ramp(frame, blog - 6, blog + 16);
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        <div style={{ position: 'absolute', left: 120, top: 110, width: 900 }}>
          <Kicker at={f0} text="En SonorBooks" />
          <MaskTitle text="Cada uno tiene su ficha" at={f0 + 2} size={84} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 40 }}>
            {[
              { t: 'En qué plataformas está esa narración', a: plats },
              { t: 'Si puedes empezarla gratis con una prueba', a: gratis },
            ].map((r) => {
              const s = sp(frame, r.a, 15, 180);
              return (
                <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: color.yellow }} />
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink }}>{r.t}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 50, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <LinkBadge at={links} label="Enlaces en la descripción" size={38} />
          </div>
          <div style={{ marginTop: 24, opacity: sp(frame, blog), transform: `translateY(${(1 - sp(frame, blog)) * 20}px)` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 30px', borderRadius: 20, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: color.ink, background: color.yellow, padding: '6px 12px', borderRadius: 8 }}>BLOG</span>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>La lista completa, con dónde escuchar cada uno</span>
            </div>
          </div>
        </div>
        {/* las diez fichas */}
        <div style={{ position: 'absolute', left: 1090, top: 120, width: 720, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, transform: `translateY(${-shift * 0}px)` }}>
          {BOOKS10.slice().reverse().map((b, i) => {
            const s = sp(frame, f0 + 6 + i * 3, 14, 160);
            const lit = ramp(frame, plats + i * 2, plats + i * 2 + 10);
            return (
              <div key={b.n} style={{ position: 'relative', height: 255, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})` }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 190 }}><Cover10 b={b} w={164} h={190} /></div>
                <div style={{ position: 'absolute', left: 10, right: 10, bottom: 12, height: 40, borderRadius: 10, background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: lit }}>
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 17, color: '#fff' }}>Escuchar ahora</span>
                </div>
                <div style={{ position: 'absolute', right: 8, top: 8, minWidth: 34, height: 34, borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 18, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>{b.n}</div>
              </div>
            );
          })}
        </div>
      </Stage>
      <Sfx name="whoosh_soft" at={2} volume={0.6} />
      <Sfx name="ui_pop" at={plats + 1} volume={0.5} />
      <Sfx name="ui_pop" at={gratis + 1} volume={0.5} />
      <Sfx name="snap_in" at={links} volume={0.7} />
      <Sfx name="snap_in" at={blog} volume={0.7} />
    </AbsoluteFill>
  );
};

// Pregunta final: cuál ha dado más miedo y qué género sigue.
export const Coment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('COMENT');
  const f0 = c.part('X113');
  const g = c.at('X113', 'género') - 8;
  const genres = ['Fantasía', 'Thriller', 'Ciencia ficción', 'Romántica', 'Historia', 'Clásicos'];
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <svg width={110} height={110} viewBox="0 0 24 24"><path d="M4 5.5h16v10H9l-5 4z" fill={color.yellow} stroke={color.ink} strokeWidth={1.6} strokeLinejoin="round" /></svg>
            <MaskTitle text="¿Cuál te ha dado más miedo?" at={f0 + 2} size={88} hi="miedo" />
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink2, marginTop: 70, opacity: ramp(frame, g - 4, g + 10) }}>¿Y qué género quieres para el próximo?</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 34, flexWrap: 'wrap', justifyContent: 'center', width: 1500 }}>
            {genres.map((gn, i) => {
              const s = sp(frame, g + 4 + i * 4, 14, 190);
              return <span key={gn} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, padding: '14px 32px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, color: color.ink, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{gn}</span>;
            })}
          </div>
        </AbsoluteFill>
      </Stage>
      <Sfx name="pop" at={f0 + 4} volume={0.6} />
      {genres.map((gn, i) => <Sfx key={gn} name="tick_soft" at={g + 4 + i * 4} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// Cierre de marca: mitad de abajo libre para la pantalla final de YouTube.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('X114');
  const end = sp(frame, f0 + 110, 18, 140);
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        <AbsoluteFill style={{ justifyContent: 'flex-start', paddingLeft: 130, paddingTop: 110 }}>
          <div style={{ width: 1100 }}>
            <Logo size={90} delay={2} />
            <div style={{ marginTop: 36 }}>
              <Words text="Tu próxima historia te está esperando." start={f0} stagger={4} size={62} weight={700} align="left" />
            </div>
            <div style={{ marginTop: 30, opacity: sp(frame, f0 + 40), display: 'flex', gap: 18, alignItems: 'center' }}>
              <Pill size={36}>sonorbooks.com</Pill>
              <div style={{ opacity: end, display: 'flex', alignItems: 'center', gap: 14, marginLeft: 20 }}>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#fff', background: RED, padding: '6px 14px', borderRadius: 8 }}>LOS 10 MEJORES</span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink }}>Próximamente, otro género.</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
      <Sfx name="logo_sting" at={4} volume={0.9} />
      <Sfx name="sparkle" at={f0 + 40} volume={0.4} />
    </AbsoluteFill>
  );
};

export const _o = { Book10, DIM, easeOut };

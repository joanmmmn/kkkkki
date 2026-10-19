import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { MaskTitle } from '../nxr/kit';
import { AbsoluteFill } from 'remotion';
import { BOOKS, Cam, color, font, KR, NEVA, OLDGOLD, ramp, rampOut, shadow, SkStage } from './kit';
import { FlatCover } from './Later';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 08 · Tu ruta (J44–J46), comentarios (J47) y cierre (J48).
// ————————————————————————————————————————————————————————————————

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// ——— RUTAS · Mapa de metro: tres líneas que se cruzan en Temor y temblor y acaban en La enfermedad mortal ———
type Station = { k: string; label: string; at: number };
export const Rutas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('RUTAS');
  const fFinal = c.at('J46', 'final');
  const fEnf = c.at('J46', 'enfermedad');
  const lines: { name: string; c: string; y: number; at: number; st: Station; tAt: number }[] = [
    { name: 'Si te gustan las historias', c: '#5E1C2B', y: 300, at: c.at('J44', 'historias'), st: { k: 'diario', label: 'Diario de un seductor', at: c.at('J44', 'Diario') }, tAt: c.at('J44', 'Temor') },
    { name: 'Si buscas algo espiritual', c: OLDGOLD, y: 600, at: c.part('J45'), st: { k: 'pureza', label: 'La pureza de corazón', at: c.at('J45', 'pureza') }, tAt: c.at('J45', 'Temor') },
    { name: 'Para entenderlo primero', c: NEVA, y: 900, at: c.at('J46', 'entenderlo'), st: { k: 'noventa', label: 'Kierkegaard en 90 minutos', at: c.at('J46', '90') }, tAt: c.at('J46', 'Temor') },
  ];
  const SX = 520;
  const X: [number, number] = [1080, 600]; // Temor y temblor (correspondencia)
  const T: [number, number] = [1640, 600]; // La enfermedad mortal (final)
  const path = (l: typeof lines[number]) => `M ${SX - 80} ${l.y} L ${SX} ${l.y} C ${SX + 280} ${l.y}, ${X[0] - 300} ${X[1]}, ${X[0]} ${X[1]}`;
  const xIn = sp(frame, lines[0].tAt - 6, 12, 170);
  const term = sp(frame, fEnf - 10, 12, 150);
  const trunk = interpolate(frame, [fFinal - 6, fEnf + 4], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 0.94, x: 0, y: 20 }, { f: fFinal - 10, s: 0.92, x: 0, y: 14 }, { f: c.dur, s: 0.94, x: -10, y: 14 }]}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center' }}>
          <MaskTitle text="Tres rutas" at={4} size={84} hi={['rutas']} align="center" />
        </div>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {lines.map((l) => <path key={`g${l.name}`} d={path(l)} stroke="rgba(16,16,16,0.07)" strokeWidth={18} strokeLinecap="round" fill="none" opacity={rampOut(frame, 6, 24)} />)}
          <path d={`M ${X[0]} ${X[1]} L ${T[0]} ${T[1]}`} stroke="rgba(16,16,16,0.07)" strokeWidth={22} strokeLinecap="round" opacity={rampOut(frame, 6, 24)} />
          {lines.map((l) => {
            const p = interpolate(frame, [l.at - 6, l.tAt + 4], [0, 1], { ...clamp, easing: easeInOut });
            return p > 0.002 ? <path key={l.name} d={path(l)} stroke={l.c} strokeWidth={18} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${p} 1`} /> : null;
          })}
          {trunk > 0.002 && <path d={`M ${X[0]} ${X[1]} L ${T[0]} ${T[1]}`} stroke={color.ink} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${trunk} 1`} />}
        </svg>
        {lines.map((l) => {
          const p = sp(frame, l.st.at - 4, 12, 220);
          return (
            <React.Fragment key={l.name}>
              <div style={{ position: 'absolute', right: 1920 - (SX - 110), top: l.y - 24, opacity: rampOut(frame, l.at - 6, l.at + 8), whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: '#fff', background: l.c, padding: '6px 16px', borderRadius: 10 }}>{l.name}</span>
              </div>
              {frame >= l.st.at - 5 && (
                <div style={{ position: 'absolute', left: SX, top: l.y }}>
                  <div style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', background: '#fff', border: `9px solid ${l.c}`, transform: `scale(${p})`, boxShadow: shadow.soft }} />
                  <div style={{ position: 'absolute', left: 50, top: -150, transform: `translateY(${(1 - p) * 20}px)`, opacity: p }}><FlatCover b={BOOKS[l.st.k]} w={72} /></div>
                  <div style={{ position: 'absolute', left: -60, top: 38, opacity: p, whiteSpace: 'nowrap' }}><span style={{ display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, background: 'rgba(251,248,242,0.94)', padding: '2px 10px 4px', borderRadius: 8 }}>{l.st.label}</span></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {/* correspondencia: Temor y temblor */}
        {frame >= lines[0].tAt - 7 && (
          <div style={{ position: 'absolute', left: X[0], top: X[1] }}>
            <div style={{ position: 'absolute', left: -44, top: -44, width: 88, height: 88, borderRadius: '50%', background: '#fff', border: `12px solid ${color.ink}`, transform: `scale(${xIn})`, boxShadow: shadow.float }} />
            <div style={{ position: 'absolute', left: -48, top: -230, transform: `translateY(${(1 - xIn) * 20}px)`, opacity: xIn }}><FlatCover b={BOOKS.temor} w={96} /></div>
            <div style={{ position: 'absolute', left: -160, width: 320, top: 58, textAlign: 'center', opacity: xIn }}><span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, background: 'rgba(251,248,242,0.94)', padding: '2px 12px 4px', borderRadius: 8 }}>Temor y temblor</span></div>
          </div>
        )}
        {/* final: La enfermedad mortal */}
        <div style={{ position: 'absolute', left: T[0], top: T[1], opacity: Math.min(1, term * 2) }}>
          <div style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', background: color.ink, border: `10px solid ${color.yellow}`, transform: `scale(${term})`, boxShadow: `0 0 ${40 * term}px rgba(255,202,5,0.6)` }} />
          <div style={{ position: 'absolute', left: -64, top: -300, transform: `translateY(${(1 - term) * 30}px)` }}><FlatCover b={BOOKS.enfermedad} w={128} /></div>
          <div style={{ position: 'absolute', left: -210, width: 420, top: 76, textAlign: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, lineHeight: 1.1 }}>La enfermedad mortal</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: KR, marginTop: 6, opacity: rampOut(frame, fFinal - 6, fFinal + 8) }}>al final de los tres caminos</div>
          </div>
        </div>
      </Cam>
      {lines.map((l) => <Sfx key={l.name} name="sk_chime" at={l.at - 2} volume={0.6} />)}
      {lines.map((l) => <Sfx key={`s${l.name}`} name="ui_pop" at={l.st.at - 2} volume={0.55} />)}
      {lines.map((l) => <Sfx key={`t${l.name}`} name="ui_pop" at={l.tAt - 2} volume={0.45} />)}
      <Sfx name="riser" at={fEnf - 30} volume={0.35} />
      <Sfx name="hit_soft" at={fEnf - 4} volume={0.7} />
      <Sfx name="sparkle" at={fEnf} volume={0.6} />
    </SkStage>
  );
};

// ——— COMENT · J47 ———
export const Coment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('COMENT');
  const fEmp = c.at('J47', 'empezaste,');
  const fVas = c.at('J47', 'vas');
  const fAutor = c.at('J47', 'autor');
  const fCom = c.at('J47', 'comentarios.');
  const q = 'Yo empecé por…';
  const t0 = fEmp + 6;
  const times = Array.from(q).map((_, i) => Math.round(t0 + i * 3));
  const box = sp(frame, 4, 16, 150);
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.03, x: 0, y: 0 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
          <MaskTitle text="¿Por cuál empezaste?" at={4} size={100} align="center" hi={['empezaste?']} />
          <div style={{ marginTop: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink2, opacity: rampOut(frame, fVas - 6, fVas + 8) }}>¿O por cuál vas a empezar?</div>
        </div>
        <div style={{ position: 'absolute', left: 360, top: 400, width: 1200, opacity: box, transform: `translateY(${(1 - box) * 40}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: '#fff', borderRadius: 30, boxShadow: shadow.card, padding: '30px 36px', border: `1px solid ${color.line}` }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}>Tú</div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}>
              <Typewriter text={q} times={times} placeholder="Añade un comentario…" />
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', background: color.ink, padding: '14px 28px', borderRadius: 999, opacity: rampOut(frame, fCom - 6, fCom + 6) }}>Comentar</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, opacity: rampOut(frame, fAutor - 6, fAutor + 8) }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink }}>Próximo episodio:</div>
          {['?', '?', '?'].map((t, i) => (
            <div key={i} style={{ width: 90, height: 120, borderRadius: 10, background: i === 1 ? color.yellow : '#fff', boxShadow: shadow.float, border: `2px dashed ${color.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 56,
              transform: `translateY(${(1 - sp(frame, fAutor - 4 + i * 4, 11, 200)) * 40}px) rotate(${(i - 1) * 5}deg)` }}>{t}</div>
          ))}
        </div>
      </Cam>
      <Sfx name="ui_pop" at={6} volume={0.5} />
      <Keystrokes text={q} times={times} volume={0.8} seed="coment-krk" />
      {[0, 1, 2].map((i) => <Sfx key={i} name="card_flip" at={fAutor + i * 4} volume={0.5} />)}
      <Sfx name="ui_tap" at={fCom} volume={0.6} />
    </SkStage>
  );
};

// ——— OUTRO · J48 + pantalla final (mitad derecha libre para los elementos de YouTube) ———
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('J48');
  const end = sp(frame, f0 + 130, 18, 140);
  return (
    <SkStage>
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 130 }}>
        <div style={{ width: 760 }}>
          <Logo size={96} delay={2} />
          <div style={{ marginTop: 44 }}>
            <Words text="Tu próxima historia te está esperando." start={f0} stagger={4} size={64} weight={700} align="left" />
          </div>
          <div style={{ marginTop: 40, opacity: sp(frame, f0 + 40), display: 'flex', gap: 18, alignItems: 'center' }}>
            <Pill size={38}>sonorbooks.com</Pill>
          </div>
          <div style={{ marginTop: 60, opacity: end, transform: `translateY(${(1 - end) * 20}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
              <div style={{ width: 40, height: 3, background: color.yellow, borderRadius: 2 }} />
              <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, letterSpacing: 3, textTransform: 'uppercase', color: color.ink2 }}>Por dónde y cómo empezar a leer</span>
            </div>
            <div style={{ marginTop: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>Próximamente, otro autor.</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} volume={0.9} />
      <Sfx name="sparkle" at={f0 + 40} volume={0.4} />
    </SkStage>
  );
};
export const _r = { OLDGOLD, ramp };

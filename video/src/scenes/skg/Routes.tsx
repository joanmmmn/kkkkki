import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Cam, color, font, KR, ramp, rampOut, shadow, SkStage } from './kit';
import { FlatCover } from './Genres';
import { sceneClock } from './timeline';

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// ——— RUTAS · G37–G39 · Mapa de metro con tres líneas que acaban en La Torre Oscura ———
type Station = { k: string; label: string; x: number; at: number };
export const Rutas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('RUTAS');
  const L1 = c.at('G37', 'miedo');
  const L2 = c.at('G38', 'emoción');
  const L3 = c.at('G39', 'crimen');
  const fFinal = c.at('G39', 'final');
  const fVal = c.at('G39', 'valientes');
  const fTorre = c.at('G39', 'Torre');
  const lines: { name: string; c: string; y: number; at: number; st: Station[] }[] = [
    { name: 'Miedo', c: KR, y: 330, at: L1, st: [
      { k: 'carrie', label: 'Carrie', x: 420, at: c.at('G37', 'Carrie') },
      { k: 'resplandor', label: 'El resplandor', x: 740, at: c.at('G37', 'resplandor') },
      { k: 'doctor', label: 'Doctor Sueño', x: 1060, at: c.at('G37', 'Doctor') },
      { k: 'it', label: 'It', x: 1380, at: c.at('G37', 'It') },
    ] },
    { name: 'Emoción y fantasía', c: '#D99A00', y: 600, at: L2, st: [
      { k: 'milla', label: 'La milla verde', x: 420, at: c.at('G38', 'milla') },
      { k: 'd2263', label: '22/11/63', x: 820, at: c.at('G38', 'veintidós') },
      { k: 'cuento', label: 'Cuento de hadas', x: 1220, at: c.at('G38', 'Cuento') },
    ] },
    { name: 'Crimen', c: color.ink, y: 870, at: L3, st: [
      { k: 'mercedes', label: 'Trilogía Bill Hodges', x: 420, at: c.at('G39', 'trilogía') },
      { k: 'visitante', label: 'El visitante', x: 820, at: c.at('G39', 'visitante') },
      { k: 'holly', label: 'Holly', x: 1220, at: c.at('G39', 'Holly') },
    ] },
  ];
  const T: [number, number] = [1690, 600];
  const term = sp(frame, fTorre - 8, 12, 150);
  const toTerm = (l: typeof lines[number]) => {
    const last = l.st[l.st.length - 1];
    return `M ${last.x} ${l.y} C ${last.x + 200} ${l.y}, ${T[0] - 220} ${T[1]}, ${T[0]} ${T[1]}`;
  };
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 0.94, x: 0, y: 20 }, { f: fFinal - 10, s: 0.92, x: 0, y: 14 }, { f: c.dur, s: 0.94, x: -10, y: 14 }]}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center' }}>
          <MaskTitle text="Tres rutas" at={4} size={84} hi={['rutas']} align="center" />
        </div>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {lines.map((l) => <path key={`g${l.name}`} d={`M ${l.st[0].x - 60} ${l.y} L ${l.st[l.st.length - 1].x} ${l.y}`} stroke="rgba(16,16,16,0.08)" strokeWidth={18} strokeLinecap="round" opacity={rampOut(frame, 6, 24)} />)}
          {lines.map((l) => {
            const first = l.st[0].x, lastX = l.st[l.st.length - 1].x;
            const p = interpolate(frame, [l.at - 6, l.st[l.st.length - 1].at + 4], [0, 1], { ...clamp, easing: easeInOut });
            const q = interpolate(frame, [fFinal - 4, fTorre], [0, 1], { ...clamp, easing: easeInOut });
            return (
              <g key={l.name}>
                {p > 0.002 && <path d={`M ${first - 60} ${l.y} L ${lastX} ${l.y}`} stroke={l.c} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />}
                {q > 0.002 && <path d={toTerm(l)} stroke={l.c} strokeWidth={18} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${q} 1`} opacity={0.9} />}
              </g>
            );
          })}
        </svg>
        {lines.map((l) => (
          <React.Fragment key={l.name}>
            <div style={{ position: 'absolute', right: 1920 - 330, top: l.y - 24, opacity: rampOut(frame, l.at - 6, l.at + 8), whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: l.c === '#D99A00' ? color.ink : '#fff', background: l.c === '#D99A00' ? color.yellow : l.c, padding: '6px 16px', borderRadius: 10 }}>{l.name}</span>
            </div>
            {l.st.map((s) => {
              const p = sp(frame, s.at - 4, 12, 220);
              if (frame < s.at - 5) return null;
              return (
                <div key={s.k} style={{ position: 'absolute', left: s.x, top: l.y }}>
                  <div style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', background: '#fff', border: `9px solid ${l.c}`, transform: `scale(${p})`, boxShadow: shadow.soft }} />
                  <div style={{ position: 'absolute', left: -36, top: -164, transform: `translateY(${(1 - p) * 20}px)`, opacity: p }}><FlatCover b={BOOKS[s.k]} w={72} /></div>
                  <div style={{ position: 'absolute', left: -160, width: 320, top: 38, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: p, whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        {/* Terminal: La Torre Oscura */}
        <div style={{ position: 'absolute', left: T[0], top: T[1], opacity: Math.min(1, term * 2) }}>
          <div style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', background: color.ink, border: `10px solid ${color.yellow}`, transform: `scale(${term})`, boxShadow: `0 0 ${40 * term}px rgba(255,202,5,0.6)` }} />
          <div style={{ position: 'absolute', left: -64, top: -300, transform: `translateY(${(1 - term) * 30}px)` }}><FlatCover b={BOOKS.torre7} w={128} /></div>
          <div style={{ position: 'absolute', left: -200, width: 400, top: 76, textAlign: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>La Torre Oscura</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: KR, opacity: rampOut(frame, fVal - 6, fVal + 8) }}>para los valientes</div>
          </div>
        </div>
      </Cam>
      {lines.map((l) => <Sfx key={l.name} name="sk_chime" at={l.at - 2} volume={0.6} />)}
      {lines.flatMap((l) => l.st.map((s) => <Sfx key={s.k} name="ui_pop" at={s.at - 2} volume={0.55} />))}
      <Sfx name="riser" at={fTorre - 4} volume={0.35} />
      <Sfx name="hit_soft" at={fTorre} volume={0.7} />
      <Sfx name="sparkle" at={fTorre + 4} volume={0.6} />
    </SkStage>
  );
};

// ——— COMENT · G40 ———
export const Coment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('COMENT');
  const fEmp = c.at('G40', 'empezaste');
  const fLeo = c.at('G40', 'leo');
  const fGuia = c.at('G40', 'guía');
  const fAutor = c.at('G40', 'autor');
  const q = 'Yo empecé por…';
  const t0 = fEmp + 6;
  const times = Array.from(q).map((_, i) => Math.round(t0 + i * 3.2));
  const box = sp(frame, 4, 16, 150);
  return (
    <SkStage>
      <Cam keys={[{ f: 0, s: 1.03, x: 0, y: 0 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
          <MaskTitle text="¿Por cuál empezaste?" at={4} size={100} align="center" hi={['empezaste?']} />
        </div>
        <div style={{ position: 'absolute', left: 360, top: 330, width: 1200, opacity: box, transform: `translateY(${(1 - box) * 40}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: '#fff', borderRadius: 30, boxShadow: shadow.card, padding: '30px 36px', border: `1px solid ${color.line}` }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}>Tú</div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}>
              <Typewriter text={q} times={times} placeholder="Añade un comentario…" />
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', background: color.ink, padding: '14px 28px', borderRadius: 999, opacity: rampOut(frame, fLeo - 4, fLeo + 8) }}>Comentar</div>
          </div>
        </div>
        {[0, 1, 2].map((i) => {
          const s = sp(frame, 14 + i * 6, 16, 160);
          return (
            <div key={i} style={{ position: 'absolute', left: 400, top: 520 + i * 110, width: 1120, display: 'flex', alignItems: 'center', gap: 22, opacity: s * (0.55 - i * 0.12) * (1 - ramp(frame, fGuia - 10, fGuia)), transform: `translateY(${(1 - s) * 30}px)` }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: ['#E9E1F2', '#F8DADC', '#DCE9F6'][i] }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 180 + i * 40, height: 16, borderRadius: 8, background: 'rgba(16,16,16,0.16)' }} />
                <div style={{ marginTop: 12, width: 700 - i * 120, height: 14, borderRadius: 7, background: 'rgba(16,16,16,0.09)' }} />
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, opacity: rampOut(frame, fGuia - 6, fGuia + 8) }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink }}>Próxima guía:</div>
          {['?', '?', '?'].map((t, i) => (
            <div key={i} style={{ width: 90, height: 120, borderRadius: 10, background: i === 1 ? color.yellow : '#fff', boxShadow: shadow.float, border: `2px dashed ${color.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 56,
              transform: `translateY(${(1 - sp(frame, fAutor - 4 + i * 4, 11, 200)) * 40}px) rotate(${(i - 1) * 5}deg)` }}>{t}</div>
          ))}
        </div>
      </Cam>
      <Sfx name="ui_pop" at={6} volume={0.5} />
      <Keystrokes text={q} times={times} volume={0.8} seed="coment" />
      <Sfx name="ui_tap" at={fLeo} volume={0.6} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="card_flip" at={fAutor + i * 4} volume={0.5} />)}
    </SkStage>
  );
};

// ——— OUTRO · G41 + pantalla final (mitad derecha libre para los elementos de YouTube) ———
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('G41');
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
      {/* zona de la pantalla final de YouTube (vacía a propósito) */}
      <Sfx name="logo_sting" at={4} volume={0.9} />
      <Sfx name="sparkle" at={f0 + 40} volume={0.4} />
    </SkStage>
  );
};
export const _r = { easeOut, KR };

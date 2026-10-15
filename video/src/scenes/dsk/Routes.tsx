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
// 08 · Tu ruta (D47–D49), comentarios (D50) y cierre (D51).
// ————————————————————————————————————————————————————————————————

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// ——— RUTAS · Mapa de metro: tres líneas que acaban en Los hermanos Karamázov ———
type Station = { k: string; label: string; x: number; at: number };
export const Rutas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('RUTAS');
  const L1 = c.at('D47', 'tantear');
  const L2 = c.part('D48');
  const L3 = c.part('D49');
  const fFinal = c.at('D49', 'final');
  const fKar = c.at('D49', 'Karamázov.');
  const lines: { name: string; c: string; y: number; at: number; st: Station[] }[] = [
    { name: 'Para tantear', c: NEVA, y: 330, at: L1, st: [
      { k: 'noches', label: 'Noches blancas', x: 420, at: c.at('D47', 'Noches') },
      { k: 'jugador', label: 'El jugador', x: 820, at: c.at('D47', 'jugador') },
      { k: 'subsuelo', label: 'Memorias del subsuelo', x: 1220, at: c.at('D47', 'Memorias') },
    ] },
    { name: 'Las grandes novelas', c: KR, y: 600, at: L2, st: [
      { k: 'crimen', label: 'Crimen y castigo', x: 420, at: c.at('D48', 'Crimen') },
      { k: 'idiota', label: 'El idiota', x: 820, at: c.at('D48', 'idiota') },
      { k: 'demonios', label: 'Los demonios', x: 1220, at: c.at('D48', 'demonios.') },
    ] },
    { name: 'Las grandes preguntas', c: '#B88A2E', y: 870, at: L3, st: [
      { k: 'subsuelo', label: 'Memorias del subsuelo', x: 420, at: c.at('D49', 'Memorias') },
      { k: 'sueno', label: 'El sueño de un hombre ridículo', x: 820, at: c.at('D49', 'sueño') },
      { k: 'inquisidor', label: 'El gran inquisidor', x: 1220, at: c.at('D49', 'gran', 1) },
    ] },
  ];
  const T: [number, number] = [1660, 600];
  const term = sp(frame, fKar - 12, 12, 150);
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
            const q = interpolate(frame, [fFinal - 4, fKar], [0, 1], { ...clamp, easing: easeInOut });
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
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: '#fff', background: l.c, padding: '6px 16px', borderRadius: 10 }}>{l.name}</span>
            </div>
            {l.st.map((s) => {
              const p = sp(frame, s.at - 4, 12, 220);
              if (frame < s.at - 5) return null;
              return (
                <div key={`${l.name}-${s.k}`} style={{ position: 'absolute', left: s.x, top: l.y }}>
                  <div style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', background: '#fff', border: `9px solid ${l.c}`, transform: `scale(${p})`, boxShadow: shadow.soft }} />
                  <div style={{ position: 'absolute', left: -36, top: -164, transform: `translateY(${(1 - p) * 20}px)`, opacity: p }}><FlatCover b={BOOKS[s.k]} w={72} /></div>
                  <div style={{ position: 'absolute', left: -180, width: 360, top: 38, textAlign: 'center', opacity: p }}><span style={{ display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: s.label.length > 22 ? 25 : 30, color: color.ink, whiteSpace: 'nowrap', background: 'rgba(251,248,242,0.94)', padding: '2px 10px 4px', borderRadius: 8 }}>{s.label}</span></div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        {/* Terminal: Los hermanos Karamázov */}
        <div style={{ position: 'absolute', left: T[0], top: T[1], opacity: Math.min(1, term * 2) }}>
          <div style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', background: color.ink, border: `10px solid ${color.yellow}`, transform: `scale(${term})`, boxShadow: `0 0 ${40 * term}px rgba(255,202,5,0.6)` }} />
          <div style={{ position: 'absolute', left: -64, top: -300, transform: `translateY(${(1 - term) * 30}px)` }}><FlatCover b={BOOKS.karamazov} w={128} /></div>
          <div style={{ position: 'absolute', left: -210, width: 420, top: 76, textAlign: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, lineHeight: 1.1 }}>Los hermanos Karamázov</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: KR, marginTop: 6, opacity: rampOut(frame, fFinal - 6, fFinal + 8) }}>al final de todos los caminos</div>
          </div>
        </div>
      </Cam>
      {lines.map((l) => <Sfx key={l.name} name="sk_chime" at={l.at - 2} volume={0.6} />)}
      {lines.flatMap((l) => l.st.map((s) => <Sfx key={`${l.name}${s.k}`} name="ui_pop" at={s.at - 2} volume={0.55} />))}
      <Sfx name="riser" at={fKar - 30} volume={0.35} />
      <Sfx name="hit_soft" at={fKar - 4} volume={0.7} />
      <Sfx name="sparkle" at={fKar} volume={0.6} />
    </SkStage>
  );
};

// ——— COMENT · D50 ———
export const Coment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('COMENT');
  const fEmp = c.at('D50', 'empezaste,');
  const fVas = c.at('D50', 'vas');
  const fAutor = c.at('D50', 'autor');
  const fCom = c.at('D50', 'comentarios.');
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
      <Keystrokes text={q} times={times} volume={0.8} seed="coment-dsk" />
      {[0, 1, 2].map((i) => <Sfx key={i} name="card_flip" at={fAutor + i * 4} volume={0.5} />)}
      <Sfx name="ui_tap" at={fCom} volume={0.6} />
    </SkStage>
  );
};

// ——— OUTRO · D51 + pantalla final (mitad derecha libre para los elementos de YouTube) ———
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('D51');
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

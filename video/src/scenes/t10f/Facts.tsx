import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { BONE, DIM, RED, color, font } from './kit';
import { sceneClock } from './timeline';

// «Los 10 mejores» · Fantasía: tarjetas del dato de cada historia (fase B). `at`: fotograma en que empieza la fase; `c`: reloj de la escena.
// Cada elemento entra con la palabra de la voz que lo nombra. Datos y fuentes en research/top10/fantasia/guion.md.
type Clock = ReturnType<typeof sceneClock>;
type F = React.FC<{ at: number; c: Clock }>;
const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const GOLD = '#E8B93E';

const Card: React.FC<{ at: number; w?: number; children: React.ReactNode; paper?: boolean; style?: React.CSSProperties }> = ({ at, w = 1200, children, paper = false, style }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 17, 140);
  return (
    <div style={{ width: w, padding: '50px 64px', borderRadius: 28, background: paper ? '#EFE6D2' : 'rgba(10,11,20,0.84)', border: paper ? 'none' : '1px solid rgba(255,255,255,0.12)', boxSizing: 'border-box',
      boxShadow: '0 50px 120px rgba(0,0,0,0.6)', opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s}) rotate(${paper ? (1 - s) * -3 - 0.6 : 0}deg)`, ...style }}>
      {children}
    </div>
  );
};
const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap }}>{children}</div>
);
const Reveal: React.FC<{ at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({ at, children, dy = 18, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: easeOut });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ at, children, style, rot = 0 }) => {
  const frame = useCurrentFrame();
  const q = sp(frame, at, 11, 210);
  return <div style={{ opacity: Math.min(1, q * 1.5), transform: `scale(${(0.6 + 0.4 * q).toFixed(3)}) rotate(${(rot * q).toFixed(2)}deg)`, ...style }}>{children}</div>;
};
const Label: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = DIM }) => (
  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: c }}>{children}</div>
);
const Badge: React.FC<{ children: React.ReactNode; bg?: string; fg?: string; size?: number }> = ({ children, bg = GOLD, fg = '#14100a', size = 40 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 999, background: bg, color: fg, fontFamily: font.sans, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>{children}</span>
);
const Girl: React.FC<{ h: number; c?: string }> = ({ h, c = '#2a2018' }) => (
  <svg width={h} height={h} viewBox="0 0 100 100"><path d="M50 8a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM37 14q-7 12-3 26l7-6zM63 14q7 12 3 26l-7-6zM38 36q12-5 24 0l20 50h-64zM41 86h5v14h-5zM54 86h5v14h-5z" fill={c} /></svg>
);

// 10 · Alicia: la excursión en barca de 1862.
export const F1: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const row = Math.sin(frame / 10);
  return (
    <Center>
      <Card at={at} w={1300} paper>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          <svg width={360} height={200} viewBox="0 0 360 200" style={{ flexShrink: 0 }}>
            {[0, 1, 2, 3].map((k) => <path key={k} d={`M0 ${150 + k * 12} q45 -8 90 0 t90 0 t90 0 t90 0`} stroke="rgba(60,110,140,0.4)" strokeWidth={3} fill="none" transform={`translate(${((frame * 0.6) % 90) - 90} 0)`} />)}
            <path d="M40 130 L320 130 L290 160 L70 160Z" fill="#6a4628" />
            <path d={`M120 130 L${80 + row * 14} 180`} stroke="#3a2414" strokeWidth={5} /><path d={`M250 130 L${290 - row * 14} 180`} stroke="#3a2414" strokeWidth={5} />
            {[0, 1, 2].map((k) => <g key={k} transform={`translate(${130 + k * 40} 60)`} opacity={ramp(frame, c.at('F13', 'hermanas') - 6 + k * 4, c.at('F13', 'hermanas') + 6 + k * 4)}><circle cx="10" cy="18" r="10" fill="#2a2018" /><path d="M0 70 Q10 30 20 70Z" fill="#2a2018" /></g>)}
            <g transform="translate(60 56)"><circle cx="12" cy="16" r="12" fill="#1a1410" /><rect x="0" y="28" width="24" height="44" rx="6" fill="#1a1410" /><rect x="-6" y="0" width="36" height="8" fill="#1a1410" /></g>
          </svg>
          <div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', color: '#7a5a3a' }}>Oxford · 1862</div>
            <div style={{ fontFamily: font.serif, fontSize: 64, lineHeight: 1.08, color: '#1a1410', marginTop: 10 }}>Una excursión en barca</div>
            <Reveal at={c.at('F13', 'Alice') - 4}><div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: '#5a3a2a', marginTop: 16 }}>«Escríbemela», le pidió Alice Liddell.</div></Reveal>
          </div>
        </div>
      </Card>
      <Pop at={c.at('F13', 'libro') - 6} rot={-3}><Badge>1865 · Ya era un libro</Badge></Pop>
    </Center>
  );
};

// 9 · Circe: la profesora de griego y la bruja de la «Odisea».
export const F2: F = ({ at, c }) => (
  <Center>
    <div style={{ display: 'flex', gap: 34, alignItems: 'stretch' }}>
      <Card at={at} w={520} style={{ background: '#1E2A22' }}>
        <Label c="rgba(230,240,230,0.6)">Madeline Miller</Label>
        <div style={{ fontFamily: font.serif, fontSize: 54, color: '#EAF2E6', marginTop: 16, lineHeight: 1.1 }}>Profesora de latín y griego</div>
        <div style={{ fontFamily: font.serif, fontSize: 70, color: 'rgba(234,242,230,0.35)', marginTop: 20, letterSpacing: 8 }}>ΑΒΓ · ABC</div>
      </Card>
      <Card at={c.at('F23', 'Odisea') - 8} w={700} paper>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: '#7a5a3a' }}>La «Odisea» · Canto X</div>
        <div style={{ fontFamily: font.serif, fontSize: 48, lineHeight: 1.15, color: '#1a1410', marginTop: 14 }}>
          Circe, la bruja que <Reveal at={c.at('F23', 'cerdos') - 4} style={{ display: 'inline' }}><span style={{ color: '#9b2c1c' }}>convierte en cerdos</span></Reveal> a los hombres de Ulises.
        </div>
        <Reveal at={c.at('F23', 'versión') - 6}><div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: '#5a3a2a', marginTop: 18 }}>Miller le dejó contar su versión.</div></Reveal>
      </Card>
    </div>
    <Pop at={c.at('F23', 'número') - 6} rot={-2}><Badge>Nº 1 · The New York Times</Badge></Pop>
  </Center>
);

// 8 · Harry Potter: una docena de rechazos y una niña de ocho años.
export const F3: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const rej = c.at('F33', 'rechazaron');
  const yes = c.at('F33', 'publicó');
  return (
    <Center gap={40}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 150px)', gap: 18 }}>
        {Array.from({ length: 12 }).map((_, k) => {
          const q = sp(frame, at + k * 2, 14, 180);
          const st = sp(frame, rej + k * 3, 10, 260);
          return (
            <div key={k} style={{ position: 'relative', height: 100, borderRadius: 6, background: '#EFE6D2', opacity: Math.min(1, q * 1.4) * (1 - 0.5 * ramp(frame, yes - 6, yes + 6)), transform: `rotate(${((k % 5) - 2) * 2}deg) scale(${(0.85 + 0.15 * q).toFixed(3)})`, boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 14, top: 16 + i * 14, width: 90 - i * 20, height: 3, background: 'rgba(40,25,15,0.4)' }} />)}
              <div style={{ position: 'absolute', left: 40, top: 46, padding: '2px 12px', border: `4px solid ${RED}`, color: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 30, borderRadius: 6, opacity: Math.min(1, st * 1.5), transform: `rotate(-14deg) scale(${(1.6 - 0.6 * st).toFixed(3)})` }}>NO</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        <Pop at={yes - 4}><Badge bg="#2E7D4A" fg="#fff">Una editorial dijo sí</Badge></Pop>
        <Pop at={c.at('F33', 'ocho') - 6}><Badge>Gracias a una niña de 8 años</Badge></Pop>
      </div>
      <Reveal at={c.at('F33', 'capítulo') - 4}><div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 52, color: BONE }}>Leyó el primer capítulo… <span style={{ color: GOLD }}>y pidió más.</span></div></Reveal>
    </Center>
  );
};

// 7 · El Hobbit: la hoja en blanco entre exámenes.
export const F4: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const q0 = c.at('F43', 'En', 2);
  const q1 = c.at('F43', 'hobbit') + 20;
  const line = 'En un agujero en el suelo vivía un hobbit.';
  const n = Math.round(interpolate(frame, [q0 - 4, q1], [0, line.length], clamp));
  return (
    <Center>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 380, height: 480 }}>
          {[0, 1, 2].map((k) => (
            <Card key={k} at={at + k * 5} w={340} paper style={{ position: 'absolute', left: k * 16, top: k * 14, height: 440, padding: 30 }}>
              {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ height: 4, marginTop: 22, width: `${60 + ((i * 37 + k * 11) % 35)}%`, background: 'rgba(40,25,15,0.35)' }} />)}
              <div style={{ position: 'absolute', right: 30, top: 30, fontFamily: font.serif, fontSize: 48, color: RED, opacity: k === 2 ? 1 : 0 }}>✓</div>
            </Card>
          ))}
        </div>
        <Card at={c.at('F43', 'blanco') - 8} w={820} paper style={{ minHeight: 420 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: '#7a5a3a' }}>Una hoja en blanco</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1.2, color: '#1a1410', marginTop: 30, minHeight: 150 }}>
            {line.slice(0, n)}<span style={{ opacity: frame % 20 < 10 && n < line.length ? 1 : 0 }}>|</span>
          </div>
          <Reveal at={c.at('F43', 'averiguar') - 6}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#9b2c1c', marginTop: 20 }}>¿Y qué es un hobbit?</div></Reveal>
        </Card>
      </div>
    </Center>
  );
};

// 6 · El nombre del viento: del cajón a las listas.
export const F5: F = ({ at, c }) => {
  const steps = [
    { t: 'La empieza en la universidad', at: c.at('F53', 'universidad') - 8 },
    { t: 'Rechazo tras rechazo', at: c.at('F53', 'rechazos') - 6, red: true },
    { t: '2007 · por fin se publica', at: c.at('F53', 'siete') - 8 },
    { t: 'Premio Quill', at: c.at('F53', 'Quill') - 6, gold: true },
    { t: 'La 2.ª parte, n.º 1 del New York Times', at: c.at('F53', 'segunda') - 6, gold: true },
  ];
  return (
    <Center>
      <Card at={at} w={1400}>
        <Label>Patrick Rothfuss</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26 }}>
          {steps.map((st, k) => (
            <Reveal key={k} at={st.at} dy={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: st.red ? RED : st.gold ? GOLD : BONE, flexShrink: 0 }} />
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: st.gold ? GOLD : st.red ? '#FF9A7A' : BONE }}>{st.t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Card>
    </Center>
  );
};

// 5 · Olvidado rey Gudú: 25 años de silencio, casi mil páginas y el Cervantes.
export const F6: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const pages = Math.round(interpolate(frame, [c.at('F63', 'mil', 1) - 10, c.at('F63', 'mil', 1) + 30], [0, 1000], { ...clamp, easing: easeOut }));
  const X = (y: number) => 60 + ((y - 1965) / (2012 - 1965)) * 1180;
  const marks = [
    { y: 1968, t: 'La empieza', at: c.at('F63', 'sesenta') - 8 },
    { y: 1975, t: 'La abandona', at: c.at('F63', 'depresión') - 8, dim: true },
    { y: 1996, t: 'La publica', at: c.at('F63', 'noventa') - 8, gold: true },
    { y: 2010, t: 'Premio Cervantes', at: c.at('F63', 'Cervantes') - 8, gold: true },
  ];
  const gap = ramp(frame, c.at('F63', 'veinticinco') - 8, c.at('F63', 'veinticinco') + 14);
  return (
    <Center gap={36}>
      <Card at={at} w={1360}>
        <Label>Ana María Matute</Label>
        <div style={{ position: 'relative', height: 220, marginTop: 20 }}>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 110, height: 4, background: 'rgba(255,255,255,0.18)' }} />
          <div style={{ position: 'absolute', left: X(1971), width: (X(1996) - X(1971)) * gap, top: 100, height: 24, borderRadius: 12, background: 'rgba(226,85,44,0.35)' }} />
          <div style={{ position: 'absolute', left: X(1971), width: X(1996) - X(1971), top: 60, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: '#FF9A7A', opacity: gap }}>25 años sin una novela</div>
          {marks.map((m) => (
            <Reveal key={m.y} at={m.at} style={{ position: 'absolute', left: X(m.y) - 80, top: 0, width: 160, textAlign: 'center' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: m.gold ? GOLD : m.dim ? DIM : BONE }}>{m.y === 1968 ? 'Años 60' : m.y}</div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', margin: '30px auto 0', background: m.gold ? GOLD : BONE }} />
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: DIM, marginTop: 60 }}>{m.t}</div>
            </Reveal>
          ))}
        </div>
      </Card>
      <Reveal at={c.at('F63', 'mil', 1) - 10}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 80, color: BONE, letterSpacing: -2 }}>≈ {pages.toLocaleString('es-ES')} páginas <span style={{ fontSize: 38, color: DIM, letterSpacing: 0 }}>de fantasía escrita en español</span></div>
      </Reveal>
    </Center>
  );
};

// 4 · Memorias de Idhún: más de un millón de ejemplares y la serie de 2020.
export const F7: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const m = c.at('F73', 'millón');
  const n = Math.round(interpolate(frame, [m - 14, m + 20], [0, 1000000], { ...clamp, easing: easeOut }));
  return (
    <Center gap={40}>
      <Card at={at} w={1240}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {['I', 'II', 'III'].map((r, k) => (
              <Pop key={r} at={c.at('F73', 'trilogía') - 8 + k * 4}>
                <div style={{ width: 70, height: 260 + k * 20, borderRadius: 6, background: ['#1E2A44', '#2A2050', '#3A1E40'][k], border: `3px solid #86BCF0`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16, boxSizing: 'border-box',
                  fontFamily: font.serif, fontSize: 34, color: '#86BCF0' }}>{r}</div>
              </Pop>
            ))}
          </div>
          <div>
            <Label>Laura Gallego</Label>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, color: BONE, letterSpacing: -4, marginTop: 10 }}>+{n.toLocaleString('es-ES')}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: DIM }}>ejemplares vendidos de la trilogía</div>
          </div>
        </div>
      </Card>
      <Pop at={c.at('F73', 'Netflix') - 6} rot={-2}><Badge bg="#86BCF0">▶ Serie de animación · 2020</Badge></Pop>
    </Center>
  );
};

// 3 · Alas de sangre: número uno, fenómeno en redes y serie en camino.
export const F8: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const fen = c.at('F83', 'fenómeno');
  return (
    <Center gap={40}>
      <Pop at={at + 4}><Badge size={56}>Nº 1 · The New York Times</Badge></Pop>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <Card at={fen - 10} w={520}>
          <div style={{ position: 'relative', height: 260 }}>
            {Array.from({ length: 16 }).map((_, k) => {
              const p = ((frame - fen) / 50 + k / 16) % 1;
              return frame > fen - 6 ? <div key={k} style={{ position: 'absolute', left: 30 + ((k * 67) % 420), top: 140 - p * 150, fontSize: 30 + (k % 3) * 8, color: k % 2 ? '#ff5a7a' : GOLD, opacity: 1 - p }}>♥</div> : null;
            })}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE }}>El fenómeno del año</div>
          </div>
        </Card>
        <Card at={c.at('F83', 'Prime') - 8} w={520}>
          <svg width={120} height={100} viewBox="0 0 120 100"><rect x="6" y="36" width="108" height="60" rx="6" fill={GOLD} /><path d="M6 36 L18 6 L114 18 L106 40Z" fill="#14100a" stroke={GOLD} strokeWidth={4} />
            {[0, 1, 2, 3].map((k) => <path key={k} d={`M${30 + k * 22} 10 l-8 26`} stroke={GOLD} strokeWidth={6} />)}</svg>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE, marginTop: 20 }}>La serie, en camino</div>
        </Card>
      </div>
    </Center>
  );
};

// 2 · El imperio final: el Kickstarter de 41,7 millones.
export const F9: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const m = c.at('F93', 'cuarenta');
  const v = interpolate(frame, [m - 20, m + 30], [0, 41.7], { ...clamp, easing: easeOut });
  return (
    <Center gap={40}>
      <div style={{ display: 'flex', gap: 20 }}>
        {[0, 1, 2, 3].map((k) => (
          <Pop key={k} at={c.at('F93', 'cuatro') - 6 + k * 4}>
            <div style={{ width: 150, height: 210, borderRadius: 8, background: '#1A1714', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, color: GOLD, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>?</div>
          </Pop>
        ))}
      </div>
      <Card at={at + 6} w={1260}>
        <Label>Kickstarter · 2022</Label>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 14 }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 110, color: BONE, letterSpacing: -4 }}>{v.toFixed(1).replace('.', ',')} M$</span>
          <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: DIM }}>para cuatro novelas secretas</span>
        </div>
        <div style={{ height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', marginTop: 20, overflow: 'hidden' }}><div style={{ width: `${(v / 41.7) * 100}%`, height: '100%', background: GOLD }} /></div>
      </Card>
      <Pop at={c.at('F93', 'historia') - 6} rot={-2}><Badge>Récord de Kickstarter durante 3 años</Badge></Pop>
    </Center>
  );
};

// 1 · El Señor de los Anillos: doce años, tres tomos… y una sola novela.
export const F10: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const split = ramp(frame, c.at('F103', 'tres') - 6, c.at('F103', 'tres') + 16);
  const join = ramp(frame, c.at('F103', 'novela') - 16, c.at('F103', 'novela') + 6);
  const sep = split * (1 - join);
  return (
    <Center gap={50}>
      <Card at={at} w={900}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 26 }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: DIM }}>1937</span>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: DIM }}>→</span>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: DIM }}>1949</span>
          <Reveal at={c.at('F103', 'doce') - 6} style={{ display: 'inline' }}><span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: GOLD, marginLeft: 20 }}>12 años</span></Reveal>
        </div>
      </Card>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {['I', 'II', 'III'].map((r, k) => (
          <div key={r} style={{ width: 200, height: 300, background: '#2A2416', border: `4px solid ${GOLD}`, borderRadius: k === 0 ? '10px 0 0 10px' : k === 2 ? '0 10px 10px 0' : 0, marginLeft: k ? sep * 40 : 0,
            transform: `rotate(${((k - 1) * 6 * sep).toFixed(2)}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.serif, fontSize: 60, color: GOLD, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <span style={{ opacity: sep }}>{r}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <Pop at={c.at('F103', 'trilogía') - 6}><Badge bg="rgba(255,255,255,0.1)" fg={BONE}><span style={{ textDecoration: 'line-through', textDecorationColor: RED }}>Trilogía</span></Badge></Pop>
        <Pop at={c.at('F103', 'novela') - 6}><Badge>Una sola novela</Badge></Pop>
      </div>
    </Center>
  );
};

export const FACTS: Record<number, F> = { 1: F1, 2: F2, 3: F3, 4: F4, 5: F5, 6: F6, 7: F7, 8: F8, 9: F9, 10: F10 };
export const _f = { color };

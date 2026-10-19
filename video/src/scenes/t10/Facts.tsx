import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { BONE, DIM, Icon10, RED, color, font } from './kit';
import { sceneClock } from './timeline';

// Tarjetas del dato de cada libro (fase B). `at`: fotograma de la escena en que empieza la fase; `c`: reloj de la escena.
// Polaco (19/10/2026): datos y fuentes en research/pl/top10-horror/dossier.md (§5). Las palabras de los `c.at` son las de la locución
// tal como se dice (`say`): «tysiąc dziewięćset…», «Nju Jork Tajms»…
type Clock = ReturnType<typeof sceneClock>;
type F = React.FC<{ at: number; c: Clock }>;
const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

const Card: React.FC<{ at: number; w?: number; children: React.ReactNode; paper?: boolean; style?: React.CSSProperties }> = ({ at, w = 1200, children, paper = false, style }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 17, 140);
  return (
    <div style={{ width: w, padding: '56px 70px', borderRadius: 28, background: paper ? '#EFE6D2' : 'rgba(10,11,13,0.82)', border: paper ? 'none' : '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 50px 120px rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s}) rotate(${paper ? (1 - s) * -3 - 0.6 : 0}deg)`, ...style }}>
      {children}
    </div>
  );
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>{children}</div>
);

const Reveal: React.FC<{ at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({ at, children, dy = 18, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: easeOut });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

const Label: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = DIM }) => (
  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: c }}>{children}</div>
);

// Iconos de trazo grandes (24×24).
type Big = 'book' | 'film' | 'award' | 'head' | 'clap';
const BigIcon: React.FC<{ kind: Big; c: string; size?: number }> = ({ kind, c, size = 110 }) => {
  const p = { stroke: c, strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === 'book' && (<><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" {...p} /><path d="M12 6v13.5" {...p} /></>)}
      {kind === 'film' && (<><rect x="3.5" y="5" width="17" height="14" rx="2" {...p} /><path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" {...p} /></>)}
      {kind === 'award' && (<><circle cx="12" cy="9" r="5.5" {...p} /><path d="M9 13.8 7.5 21l4.5-2.4 4.5 2.4-1.5-7.2" {...p} /><path d="m12 6.3.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z" {...p} strokeWidth={1} /></>)}
      {kind === 'head' && (<><path d="M4 15v-3a8 8 0 0 1 16 0v3" {...p} /><rect x="3" y="14" width="4.5" height="7" rx="1.8" {...p} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" {...p} /></>)}
      {kind === 'clap' && (<><rect x="3.5" y="9.5" width="17" height="11" rx="1.5" {...p} /><path d="m3.5 9.5 1-4.5 16 0 -1 4.5M8 5l-2 4.5M13 5l-2 4.5M18 5l-2 4.5" {...p} /></>)}
    </svg>
  );
};

// 10 · La cita de Lovecraft («Supernatural Horror in Literature», 1927).
export const F1: F = ({ at, c }) => {
  const q = c.at('X13', 'strach');
  return (
    <Center>
      <Card at={at} w={1340}>
        <Label>H.P. Lovecraft · 1927</Label>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 62, lineHeight: 1.18, color: BONE, marginTop: 26 }}>
          „Najstarszą i najsilniejszą emocją ludzkości jest strach, <Reveal at={c.at('X13', 'najstarszym') - 4} style={{ display: 'inline' }}><span style={{ color: '#63D2B4' }}>a najstarszym i najsilniejszym rodzajem strachu jest strach przed nieznanym</span>”.</Reveal>
        </div>
        <Reveal at={q + 20}><div style={{ fontFamily: font.sans, fontSize: 28, color: DIM, marginTop: 26 }}>esej „Supernatural Horror in Literature”</div></Reveal>
      </Card>
    </Center>
  );
};

// 9 · Poe: los tres relatos, sus años y el traductor.
export const F2: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const items = [['Zagłada domu Usherów', '1839'], ['Serce oskarżycielem', '1843'], ['Czarny kot', '1843']];
  const d = c.at('X23', 'dwieście');
  const n = Math.round(interpolate(frame, [d - 6, d + 24], [0, 185], { ...clamp, easing: easeOut }));
  const les = c.at('X23', 'Leśmian') - 8;
  const s = sp(frame, les, 13, 180);
  return (
    <Center>
      <div style={{ display: 'flex', gap: 30 }}>
        {items.map(([t, y], i) => (
          <Card key={t} at={at + 4 + i * 6} w={430} paper>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#6B1A22' }}>{y}</div>
            <div style={{ fontFamily: font.serif, fontSize: 46, lineHeight: 1.1, color: '#1A1412', marginTop: 12 }}>„{t}”</div>
          </Card>
        ))}
      </div>
      <Reveal at={d - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: BONE, letterSpacing: -3, marginTop: 6 }}>
          ≈ {n} lat <span style={{ fontSize: 40, color: DIM, letterSpacing: 0 }}>i wciąż działają</span>
        </div>
      </Reveal>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px', borderRadius: 18, background: 'rgba(10,11,13,0.85)', border: '1px solid rgba(255,255,255,0.14)',
        opacity: Math.min(1, s * 1.4), transform: `translateY(${((1 - s) * 30).toFixed(1)}px) scale(${(0.9 + 0.1 * s).toFixed(3)})` }}>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: DIM, textTransform: 'uppercase' }}>przekład</span>
        <span style={{ fontFamily: font.serif, fontSize: 52, color: BONE }}>Bolesława Leśmiana</span>
      </div>
    </Center>
  );
};

// 8 · El titular del New York Times (Danielle Trussoni, 18/01/2023).
export const F3: F = ({ at, c }) => (
  <Center>
    <Card at={at} w={1360} paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px double #2A1A12', paddingBottom: 14 }}>
        <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 52, color: '#1A1412' }}>The New York Times</div>
        <div style={{ fontFamily: font.sans, fontSize: 24, color: '#5A4A40' }}>18 stycznia 2023 · Recenzja</div>
      </div>
      <div style={{ fontFamily: font.serif, fontSize: 70, lineHeight: 1.08, color: '#1A1412', marginTop: 26 }}>A Puppet That's Truly the Stuff of Nightmares</div>
      <Reveal at={c.at('X33', 'Kukiełka') - 4}>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: '#B5452B', marginTop: 20 }}>„Kukiełka, która naprawdę jest materiałem na koszmary”</div>
      </Reveal>
    </Card>
  </Center>
);

// 7 · «Dziecko Rosemary»: el horror más vendido de los sesenta y la película de Polański (sin fotogramas ni carteles).
export const F4: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const items = [
    { k: 'najlepiej', top: 'Bestseller', t: 'Najlepiej sprzedający się horror lat 60.', icon: 'book' as Big },
    { k: 'cztery', top: 'Sprzedaż', t: 'Ponad 4 mln egzemplarzy', icon: 'book' as Big },
    { k: 'ekran', top: 'Film · 1968', t: 'Roman Polański', icon: 'clap' as Big },
  ];
  return (
    <Center>
      <div style={{ display: 'flex', gap: 34 }}>
        {items.map((it, i) => {
          const a = c.at('X43', it.k) - 6;
          const s = sp(frame, a, 13, 170);
          return (
            <div key={it.t} style={{ width: 440, height: 440, borderRadius: '50%', border: `3px solid rgba(217,140,154,${0.5 + 0.5 * s})`, background: 'rgba(14,8,10,0.84)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              opacity: s, transform: `scale(${0.7 + 0.3 * s}) rotate(${(1 - s) * -10}deg)`, boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              {i === 2 && <BigIcon kind="clap" c="#D98C9A" size={70} />}
              <Label c="#D98C9A">{it.top}</Label>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: it.t.length > 26 ? 38 : 48, color: BONE, lineHeight: 1.08, margin: '16px 44px 0' }}>{it.t}</div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};

// 6 · Nosferatu: tira de película, sello «BEZ ZGODY» y la orden de destruir las copias.
export const F5: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const stamp = c.at('X53', 'zgody') - 2;
  const destroy = c.at('X53', 'zniszczyć') - 4;
  const sS = sp(frame, stamp, 10, 260);
  const burn = interpolate(frame, [destroy, destroy + 40], [0, 1], { ...clamp, easing: easeInOut });
  const s = sp(frame, c.at('X53', 'Nosferatu') - 8, 16, 140);
  return (
    <Center>
      <div style={{ position: 'relative', opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
        <div style={{ width: 1400, height: 330, background: '#0B0909', borderRadius: 10, padding: '40px 30px', display: 'flex', gap: 22, position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', transform: `translateX(${-((frame - at) * 1.2) % 60}px)` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: `linear-gradient(160deg, #6E6458, #2A2420)`, borderRadius: 6, position: 'relative', overflow: 'hidden', filter: `grayscale(1) brightness(${1 - burn * 0.8})` }}>
              <div style={{ position: 'absolute', left: '50%', bottom: 0, width: 70, height: 170, transform: 'translateX(-50%)', background: '#0B0909', borderRadius: '40px 40px 0 0' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${burn * 100}%`, background: 'linear-gradient(0deg, #000 60%, #E5484D 80%, rgba(255,160,60,0.9) 88%, rgba(0,0,0,0))' }} />
            </div>
          ))}
          {[0, 1].map((r) => <div key={r} style={{ position: 'absolute', left: 0, right: 0, [r ? 'bottom' : 'top']: 10, height: 14, backgroundImage: 'repeating-linear-gradient(90deg, #EFE8DC 0px, #EFE8DC 22px, transparent 22px, transparent 44px)', opacity: 0.25 }} />)}
        </div>
        <div style={{ position: 'absolute', left: 60, top: -84, fontFamily: font.serif, fontSize: 72, color: BONE }}>„Nosferatu” <span style={{ color: DIM, fontSize: 48 }}>· 1922</span></div>
        <div style={{ position: 'absolute', right: 80, top: 80, padding: '14px 34px', border: `8px solid ${RED}`, color: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 76, letterSpacing: 4, borderRadius: 10,
          opacity: sS, transform: `rotate(-9deg) scale(${2.2 - 1.2 * sS})`, background: 'rgba(10,0,0,0.35)' }}>BEZ ZGODY</div>
      </div>
      <Reveal at={destroy}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE, marginTop: 60 }}>Sąd nakazał zniszczyć kopie.</div></Reveal>
    </Center>
  );
};

// 5 · «Inkub»: novela (Vesper, 2019) → Złoty Kościej 2019, «Krajowy Hit Roku» → słuchowisko 2026 (corrección del revisor: no fue el debut).
export const F6: F = ({ c }) => {
  const frame = useCurrentFrame();
  const G = '#5BE3A0';
  const steps = [
    { k: 'dwa', icon: 'book' as Big, t: 'Powieść', s: '2019' },
    { k: 'Złoty', icon: 'award' as Big, t: 'Złoty Kościej', s: 'Krajowy Hit Roku 2019' },
    { k: 'słuchowisko', icon: 'head' as Big, t: 'Słuchowisko', s: '2026' },
  ];
  return (
    <Center>
      <Reveal at={c.at('X63', 'polska') - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: BONE, marginBottom: 36, textAlign: 'center' }}>Polska groza <span style={{ color: G }}>z prawdziwego zdarzenia</span></div>
      </Reveal>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        {steps.map((st, i) => {
          const a = c.at('X63', st.k) - 6;
          const s = sp(frame, a, 14, 180);
          return (
            <React.Fragment key={st.t}>
              {i > 0 && <div style={{ width: 90 * interpolate(frame, [a - 10, a], [0, 1], clamp), height: 6, borderRadius: 3, background: G }} />}
              <div style={{ width: 400, padding: '40px 26px', borderRadius: 26, background: 'rgba(8,14,11,0.86)', border: '1px solid rgba(91,227,160,0.35)', textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})` }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}><BigIcon kind={st.icon} c={G} /></div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: st.t.length > 14 ? 42 : 50, lineHeight: 1.08, color: BONE, marginTop: 22 }}>{st.t}</div>
                <div style={{ fontFamily: font.sans, fontSize: 28, color: DIM, marginTop: 8 }}>{st.s}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Reveal at={c.at('X63', 'Danutą') - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE, marginTop: 30, textAlign: 'center' }}>Danuta Stenka <span style={{ color: G }}>i ponad 50 aktorów</span></div>
      </Reveal>
    </Center>
  );
};

// 4 · «Dom na Wyrębach»: debiut de Darda (2008), nominado al Premio Zajdel, y las creencias populares.
export const F7: F = ({ c }) => {
  const frame = useCurrentFrame();
  const a1 = c.at('X73', 'zadebiutował') - 6;
  const a2 = c.at('X73', 'nominowana') - 6;
  const a3 = c.at('X73', 'wierzeniami') - 10;
  const box = (a: number, icon: React.ReactNode, t: string, sub: string) => {
    const s = sp(frame, a, 14, 170);
    return (
      <div style={{ width: 600, padding: '40px 40px', borderRadius: 26, background: 'rgba(10,12,8,0.86)', border: '1px solid rgba(169,199,126,0.32)', display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
        {icon}
        <div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: BONE }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: DIM, marginTop: 8 }}>{sub}</div>
        </div>
      </div>
    );
  };
  const s3 = sp(frame, a3, 14, 170);
  return (
    <Center>
      <div style={{ display: 'flex', gap: 34 }}>
        {box(a1, <Icon10 kind="house" size={130} c="#A9C77E" sw={1.3} />, 'Debiut Dardy', '2008')}
        {box(a2, <BigIcon kind="award" c="#A9C77E" size={130} />, 'Nominacja', 'do Nagrody Zajdla')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 20, padding: '18px 34px', borderRadius: 20, background: 'rgba(8,9,11,0.86)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', opacity: s3, transform: `translateY(${((1 - s3) * 24).toFixed(1)}px)` }}>
        <svg width={70} height={90} viewBox="0 0 70 90"><path d="M35 4 L64 26 V36 H6 V26Z" fill="#A9C77E" /><rect x="12" y="36" width="46" height="34" fill="none" stroke="#A9C77E" strokeWidth={4} /><rect x="31" y="70" width="8" height="20" fill="#A9C77E" /><circle cx="35" cy="52" r="6" fill="#ffcf7a" /></svg>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: BONE }}>Groza <span style={{ color: '#A9C77E' }}>+ polskie wierzenia ludowe</span></div>
      </div>
    </Center>
  );
};

// 3 · «Miasteczko Salem»: la pregunta de King.
export const F8: F = ({ at, c }) => (
  <Center>
    <Card at={at} w={1360}>
      <Label>Pytanie Stephena Kinga</Label>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 72, lineHeight: 1.14, color: BONE, marginTop: 24 }}>
        A gdyby Drakula wrócił w <span style={{ color: '#D93A3A' }}>XX wieku</span>, w Ameryce?
      </div>
      <Reveal at={c.at('X83', 'osiemdziesiątych') - 6}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34, paddingTop: 26, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
          <div style={{ fontFamily: font.serif, fontSize: 40, color: BONE }}>„W pewnym sensie to moja ulubiona historia”</div>
          <div style={{ fontFamily: font.sans, fontSize: 26, color: DIM, whiteSpace: 'nowrap' }}>— King, 1987</div>
        </div>
      </Reveal>
    </Card>
  </Center>
);

// Krasnal de bronce con un libro en la mano (dibujo propio, no la estatua real).
const Krasnal: React.FC<{ size: number; shine: number }> = ({ size, shine }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260">
    <defs>
      <linearGradient id="brz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9a35a" /><stop offset="0.5" stopColor="#9a6a2e" /><stop offset="1" stopColor="#5a3a18" /></linearGradient>
      <linearGradient id="brzS" x1="0" y1="0" x2="1" y2="0"><stop offset={Math.max(0, shine - 0.15)} stopColor="rgba(255,240,200,0)" /><stop offset={shine} stopColor="rgba(255,240,200,0.55)" /><stop offset={Math.min(1, shine + 0.15)} stopColor="rgba(255,240,200,0)" /></linearGradient>
    </defs>
    <g>
      <path d="M100 6 L136 92 H64 Z" fill="url(#brz)" />
      <ellipse cx="100" cy="94" rx="44" ry="10" fill="url(#brz)" />
      <circle cx="100" cy="116" r="28" fill="url(#brz)" />
      <path d="M74 122 Q100 190 126 122 Q118 150 100 152 Q82 150 74 122Z" fill="#7a5226" />
      <circle cx="90" cy="112" r="3.5" fill="#3a2410" /><circle cx="110" cy="112" r="3.5" fill="#3a2410" />
      <path d="M70 150 Q100 140 130 150 L142 222 H58 Z" fill="url(#brz)" />
      {/* el libro */}
      <path d="M78 176 L100 168 L122 176 L122 206 L100 198 L78 206 Z" fill="#c98d44" stroke="#5a3a18" strokeWidth={3} />
      <path d="M100 168 V198" stroke="#5a3a18" strokeWidth={3} />
      <path d="M62 222 h30 v14 h-30z M108 222 h30 v14 h-30z" fill="#5a3a18" />
      <rect x="40" y="236" width="120" height="20" rx="4" fill="#3a3a3e" />
      <path d="M100 6 L136 92 H64 Z M70 150 Q100 140 130 150 L142 222 H58 Z" fill="url(#brzS)" />
    </g>
  </svg>
);

// 2 · «Manitou»: el primer horror de Masterton, best seller mundial, y el krasnal de Breslavia (2021).
export const F9: F = ({ c }) => {
  const frame = useCurrentFrame();
  const a = c.at('X93', 'światowy') - 6;
  const w = c.at('X93', 'Wrocław') - 8;
  const k = c.at('X93', 'krasnala') - 6;
  const s = sp(frame, c.at('X93', 'pierwszy') - 6, 15, 150);
  const sB = sp(frame, a, 13, 170);
  const sK = sp(frame, w, 13, 140);
  const shine = interpolate(frame, [k, k + 40], [0, 1.2], clamp);
  return (
    <Center>
      <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
        <div style={{ width: 820, padding: '46px 54px', borderRadius: 28, background: 'rgba(12,8,6,0.88)', border: '1px solid rgba(232,133,63,0.3)', boxShadow: '0 50px 120px rgba(0,0,0,0.6)', boxSizing: 'border-box', opacity: s, transform: `translateX(${((1 - s) * -60).toFixed(1)}px)` }}>
          <Label c="#E8853F">Graham Masterton · 1975</Label>
          {/* «Pierwszy horror» mientras lo dice; luego «Światowy bestseller» (sin tarjeta vacía al principio) */}
          <div style={{ position: 'relative', height: 192, marginTop: 18 }}>
            <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 1, color: BONE, letterSpacing: -3, opacity: 1 - Math.min(1, sB * 1.6) }}>Pierwszy<br />horror</div>
            <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 1, color: BONE, letterSpacing: -3, opacity: sB, transform: `scale(${(0.85 + 0.15 * sB).toFixed(3)})`, transformOrigin: '0 50%' }}>Światowy<br />bestseller</div>
          </div>
          <Reveal at={k - 4}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: BONE, marginTop: 34 }}>Krasnal z brązu <span style={{ color: '#E8853F' }}>z „Manitou” w ręku</span></div></Reveal>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 40px', borderRadius: 28, background: 'radial-gradient(circle at 50% 40%, rgba(60,40,22,0.95), rgba(12,8,6,0.92))', border: '1px solid rgba(232,133,63,0.3)', boxShadow: '0 50px 120px rgba(0,0,0,0.6)', opacity: Math.min(1, sK * 1.4), transform: `translateY(${((1 - sK) * 80).toFixed(1)}px)` }}>
          <Krasnal size={300} shine={shine} />
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: BONE, marginTop: 18 }}>Wrocław · 2021</div>
        </div>
      </div>
    </Center>
  );
};

// 1 · «Nie otwieraj oczu»: debiut de 2014 y la película de Netflix (45 millones de cuentas en la primera semana). Sin fotogramas.
export const F10: F = ({ c }) => {
  const frame = useCurrentFrame();
  const B = '#9DB8E2';
  const a1 = c.at('X103', 'debiut') - 8;
  const a2 = c.at('X103', 'Netflix') - 6;
  const a3 = c.at('X103', 'czterdzieści') - 6;
  const n = Math.round(interpolate(frame, [a3, a3 + 34], [0, 45], { ...clamp, easing: easeOut }));
  const step = (a: number, icon: Big, t: string, s: string) => {
    const q = sp(frame, a, 14, 180);
    return (
      <div style={{ width: 460, padding: '34px 30px', borderRadius: 26, background: 'rgba(8,10,14,0.86)', border: '1px solid rgba(157,184,226,0.32)', display: 'flex', alignItems: 'center', gap: 24, opacity: q, transform: `translateY(${((1 - q) * 30).toFixed(1)}px) scale(${(0.9 + 0.1 * q).toFixed(3)})` }}>
        <BigIcon kind={icon} c={B} size={96} />
        <div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE, lineHeight: 1.05 }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 28, color: DIM, marginTop: 6 }}>{s}</div>
        </div>
      </div>
    );
  };
  const q3 = sp(frame, a3, 13, 160);
  return (
    <Center>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        {step(a1, 'book', 'Debiut', '2014')}
        <div style={{ width: 80 * interpolate(frame, [a2 - 10, a2], [0, 1], clamp), height: 6, borderRadius: 3, background: B }} />
        {step(a2, 'film', 'Film Netflixa', 'z Sandrą Bullock')}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 20, padding: '20px 44px 26px', borderRadius: 26, background: 'rgba(8,10,14,0.88)', border: '1px solid rgba(157,184,226,0.3)', boxShadow: '0 40px 100px rgba(0,0,0,0.55)', opacity: q3, transform: `scale(${(0.85 + 0.15 * q3).toFixed(3)})` }}>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, color: BONE, letterSpacing: -6, lineHeight: 1 }}>{n} mln</span>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: B, lineHeight: 1.15 }}>kont<br /><span style={{ color: DIM, fontWeight: 500 }}>w pierwszym tygodniu</span></span>
      </div>
    </Center>
  );
};

export const FACTS: Record<number, F> = { 1: F1, 2: F2, 3: F3, 4: F4, 5: F5, 6: F6, 7: F7, 8: F8, 9: F9, 10: F10 };
export const _f = { color };

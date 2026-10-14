import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { BONE, DIM, Icon10, RED, color, font } from './kit';
import { sceneClock } from './timeline';

// Tarjetas del dato de cada libro (fase B). `at`: fotograma de la escena en que empieza la fase; `c`: reloj de la escena.
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

// 10 · La cita de Lovecraft.
export const F1: F = ({ at, c }) => {
  const q = c.at('X13', 'miedo');
  return (
    <Center>
      <Card at={at} w={1320}>
        <Label>H. P. Lovecraft · 1927</Label>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, lineHeight: 1.18, color: BONE, marginTop: 26 }}>
          «La emoción más antigua e intensa de la humanidad es el miedo, <Reveal at={c.at('X13', 'miedo', 1)} style={{ display: 'inline' }}><span style={{ color: '#63D2B4' }}>y el miedo más antiguo e intenso es el miedo a lo desconocido</span>».</Reveal>
        </div>
        <Reveal at={q + 20}><div style={{ fontFamily: font.sans, fontSize: 28, color: DIM, marginTop: 26 }}>«El horror sobrenatural en la literatura»</div></Reveal>
      </Card>
    </Center>
  );
};

// 9 · Poe: los tres cuentos y sus años.
export const F2: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const items = [['La caída de la casa Usher', '1839'], ['El corazón delator', '1843'], ['El gato negro', '1843']];
  const n = Math.round(interpolate(frame, [c.at('X23', 'doscientos') - 6, c.at('X23', 'doscientos') + 24], [0, 185], { ...clamp, easing: easeOut }));
  return (
    <Center>
      <div style={{ display: 'flex', gap: 30 }}>
        {items.map(([t, y], i) => (
          <Card key={t} at={at + 4 + i * 6} w={430} paper>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#6B1A22' }}>{y}</div>
            <div style={{ fontFamily: font.serif, fontSize: 46, lineHeight: 1.1, color: '#1A1412', marginTop: 12 }}>«{t}»</div>
          </Card>
        ))}
      </div>
      <Reveal at={c.at('X23', 'doscientos') - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, color: BONE, letterSpacing: -3, marginTop: 20 }}>
          ≈ {n} años <span style={{ fontSize: 40, color: DIM, letterSpacing: 0 }}>y siguen funcionando</span>
        </div>
      </Reveal>
    </Center>
  );
};

// 8 · El titular del New York Times.
export const F3: F = ({ at, c }) => (
  <Center>
    <Card at={at} w={1360} paper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px double #2A1A12', paddingBottom: 14 }}>
        <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 52, color: '#1A1412' }}>The New York Times</div>
        <div style={{ fontFamily: font.sans, fontSize: 24, color: '#5A4A40' }}>18 de enero de 2023 · Crítica</div>
      </div>
      <div style={{ fontFamily: font.serif, fontSize: 70, lineHeight: 1.08, color: '#1A1412', marginTop: 26 }}>A Puppet That's Truly the Stuff of Nightmares</div>
      <Reveal at={c.at('X33', 'títere') - 4}>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: '#B5452B', marginTop: 20 }}>«Un títere que es, de verdad, material de pesadillas»</div>
      </Reveal>
    </Card>
  </Center>
);

// 7 · Premios de «Distancia de rescate».
export const F4: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const items = [
    { k: 'Shirley', top: 'Premio', t: 'Shirley Jackson', y: '2017' },
    { k: 'finalista', top: 'Finalista', t: 'Man Booker International', y: '2017' },
    { k: 'Netflix', top: 'Película', t: 'Netflix', y: '2021' },
  ];
  return (
    <Center>
      <div style={{ display: 'flex', gap: 34 }}>
        {items.map((it) => {
          const a = c.at('X43', it.k) - 6;
          const s = sp(frame, a, 13, 170);
          return (
            <div key={it.t} style={{ width: 440, height: 440, borderRadius: '50%', border: `3px solid rgba(201,209,163,${0.5 + 0.5 * s})`, background: 'rgba(10,12,8,0.82)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              opacity: s, transform: `scale(${0.7 + 0.3 * s}) rotate(${(1 - s) * -10}deg)`, boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <Label c="#C8D1A3">{it.top}</Label>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: it.t.length > 16 ? 40 : 52, color: BONE, lineHeight: 1.05, margin: '18px 30px 0' }}>{it.t}</div>
              <div style={{ fontFamily: font.serif, fontSize: 36, color: DIM, marginTop: 14 }}>{it.y}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 1 }} />
      <div style={{ opacity: interpolate(frame, [at, at + 10], [0, 1], clamp) }} />
    </Center>
  );
};

// 6 · Nosferatu: tira de película, sello «Sin permiso» y la orden de destruir las copias.
export const F5: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const stamp = c.at('X53', 'permiso') - 2;
  const destroy = c.at('X53', 'destruir') - 4;
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
        <div style={{ position: 'absolute', left: 60, top: -84, fontFamily: font.serif, fontSize: 72, color: BONE }}>Nosferatu <span style={{ color: DIM, fontSize: 48 }}>· 1922</span></div>
        <div style={{ position: 'absolute', right: 80, top: 80, padding: '14px 34px', border: `8px solid ${RED}`, color: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 76, letterSpacing: 4, borderRadius: 10,
          opacity: sS, transform: `rotate(-9deg) scale(${2.2 - 1.2 * sS})`, background: 'rgba(10,0,0,0.35)' }}>SIN PERMISO</div>
      </div>
      <Reveal at={destroy}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: BONE, marginTop: 60 }}>Un tribunal ordenó destruir las copias.</div></Reveal>
    </Center>
  );
};

// 5 · Apocalipsis Z: blog → novela → película.
export const F6: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const steps = [
    { k: 'blog', icon: 'tv' as const, t: 'Un blog', s: 'en internet' },
    { k: 'novela', icon: 'book', t: 'La novela', s: '2007' },
    { k: 'películas', icon: 'film', t: 'La película', s: 'Prime Video' },
  ];
  return (
    <Center>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        {steps.map((st, i) => {
          const a = c.at('X63', st.k) - 6;
          const s = sp(frame, a, 14, 180);
          return (
            <React.Fragment key={st.t}>
              {i > 0 && <div style={{ width: 90 * interpolate(frame, [a - 10, a], [0, 1], clamp), height: 6, borderRadius: 3, background: '#9BD14B' }} />}
              <div style={{ width: 380, padding: '40px 30px', borderRadius: 26, background: 'rgba(10,12,9,0.85)', border: '1px solid rgba(155,209,75,0.35)', textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})` }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {st.icon === 'tv' ? <Icon10 kind="tv" size={110} c="#9BD14B" sw={1.4} /> : <MiniIconBig kind={st.icon as 'book' | 'film'} />}
                </div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: BONE, marginTop: 22 }}>{st.t}</div>
                <div style={{ fontFamily: font.sans, fontSize: 30, color: DIM, marginTop: 6 }}>{st.s}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <Reveal at={c.at('X63', 'más') - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: BONE, marginTop: 30, textAlign: 'center' }}>Una de las películas internacionales <span style={{ color: '#9BD14B' }}>más vistas</span> de Prime Video</div>
      </Reveal>
    </Center>
  );
};
const MiniIconBig: React.FC<{ kind: 'book' | 'film' }> = ({ kind }) => {
  const p = { stroke: '#9BD14B', strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={110} height={110} viewBox="0 0 24 24">
      {kind === 'book' && (<><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" {...p} /><path d="M12 6v13.5" {...p} /></>)}
      {kind === 'film' && (<><rect x="3.5" y="5" width="17" height="14" rx="2" {...p} /><path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" {...p} /></>)}
    </svg>
  );
};

// 4 · Carcoma: la casa del bisabuelo y el armario que se abría solo.
export const F7: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const a1 = c.at('X73', 'casa') - 6;
  const a2 = c.at('X73', 'armario') - 6;
  const ed = c.at('X73', 'agotado') - 6;
  const box = (a: number, icon: 'house' | 'wardrobe', t: string) => {
    const s = sp(frame, a, 14, 170);
    return (
      <div style={{ width: 560, padding: '44px 40px', borderRadius: 26, background: 'rgba(14,9,6,0.86)', border: '1px solid rgba(231,201,160,0.3)', display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
        <Icon10 kind={icon} size={130} c="#E7C9A0" sw={1.3} />
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: BONE }}>{t}</div>
      </div>
    );
  };
  return (
    <Center>
      <div style={{ display: 'flex', gap: 34 }}>
        {box(a1, 'house', 'La casa que levantó su bisabuelo')}
        {box(a2, 'wardrobe', 'Un armario que se abría solo')}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 30, alignItems: 'center' }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const s = sp(frame, ed + i * 2, 12, 220);
          return <div key={i} style={{ width: 44, height: 64, borderRadius: 4, background: i % 2 ? '#5E3F28' : '#7A5638', boxShadow: '0 6px 14px rgba(0,0,0,0.5)', opacity: s, transform: `translateY(${(1 - s) * -40}px)` }} />;
        })}
        <Reveal at={ed + 30}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: BONE, marginLeft: 24 }}>edición tras edición</div></Reveal>
      </div>
      <div style={{ opacity: interpolate(frame, [at, at + 1], [0, 0], clamp) }} />
    </Center>
  );
};

// 3 · Salem's Lot: la pregunta de King.
export const F8: F = ({ at, c }) => (
  <Center>
    <Card at={at} w={1360}>
      <Label>La pregunta de Stephen King</Label>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 72, lineHeight: 1.14, color: BONE, marginTop: 24 }}>
        ¿Y si Drácula volviera en el siglo <span style={{ color: '#D93A3A' }}>XX</span>, en Estados Unidos?
      </div>
      <Reveal at={c.at('X83', 'ochenta') - 6}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34, paddingTop: 26, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
          <div style={{ fontFamily: font.serif, fontSize: 40, color: BONE }}>«En cierto modo, es mi historia favorita»</div>
          <div style={{ fontFamily: font.sans, fontSize: 26, color: DIM }}>— King, 1987</div>
        </div>
      </Reveal>
    </Card>
  </Center>
);

// 2 · Premio Herralde.
export const F9: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const a = c.at('X93', 'Herralde') - 8;
  const s = sp(frame, a, 13, 150);
  const leaf = (side: 1 | -1) => (
    <svg width={200} height={340} viewBox="0 0 100 170" style={{ transform: side === -1 ? 'scaleX(-1)' : undefined }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const p = interpolate(frame, [a + i * 3, a + i * 3 + 10], [0, 1], clamp);
        const y = 150 - i * 20;
        return <ellipse key={i} cx={30 + i * 3} cy={y} rx={9 * p} ry={20 * p} fill="#B48CF2" opacity={0.85} transform={`rotate(${-40 + i * 6} ${30 + i * 3} ${y})`} />;
      })}
      <path d="M70 165 Q20 100 40 10" stroke="#B48CF2" strokeWidth={3} fill="none" />
    </svg>
  );
  return (
    <Center>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
        {leaf(1)}
        <div style={{ textAlign: 'center' }}>
          <Label c="#B48CF2">Premio</Label>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: BONE, letterSpacing: -4, lineHeight: 1 }}>Herralde</div>
          <div style={{ fontFamily: font.serif, fontSize: 48, color: DIM, marginTop: 6 }}>2019</div>
        </div>
        {leaf(-1)}
      </div>
      <Reveal at={c.at('X93', 'crítica') - 6}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: BONE, textAlign: 'center', maxWidth: 1300 }}>Para buena parte de la crítica, una de las grandes novelas de terror en español de este siglo</div>
      </Reveal>
      <div style={{ opacity: interpolate(frame, [at, at + 1], [0, 0], clamp) }} />
    </Center>
  );
};

// 1 · El recorte del Washington Post (20/08/1949).
export const F10: F = ({ at, c }) => {
  const frame = useCurrentFrame();
  const g = c.at('X103', 'Georgetown') - 6;
  const s = sp(frame, at, 16, 120);
  return (
    <Center>
      <div style={{ width: 1280, padding: '44px 60px 50px', background: '#E9E1CE', boxShadow: '0 50px 120px rgba(0,0,0,0.7)', transform: `translateY(${(1 - s) * 60}px) rotate(${-1.2 + (1 - s) * -4}deg)`, opacity: s,
        clipPath: 'polygon(0 2%, 4% 0, 12% 1.5%, 22% 0, 35% 1%, 50% 0, 64% 1.2%, 78% 0, 90% 1.4%, 100% 0, 99% 50%, 100% 98%, 88% 100%, 72% 98.5%, 55% 100%, 40% 98.6%, 25% 100%, 10% 98.4%, 0 100%, 1% 50%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px double #1A1412', paddingBottom: 12 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 50, color: '#1A1412' }}>The Washington Post</div>
          <div style={{ fontFamily: font.sans, fontSize: 24, color: '#4A3A30' }}>20 de agosto de 1949 · Portada</div>
        </div>
        <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 68, lineHeight: 1.05, color: '#1A1412', marginTop: 22 }}>Priest Frees Mt. Rainier Boy Reported Held in Devil's Grip</div>
        <Reveal at={c.at('X103', 'sacerdote') - 4}>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: '#7A1A22', marginTop: 18 }}>Un sacerdote libera a un chico que, según se decía, estaba en las garras del diablo</div>
        </Reveal>
      </div>
      <Reveal at={g}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: BONE, marginTop: 20 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: color.yellow }} />Blatty lo leyó cuando estudiaba en Georgetown
        </div>
      </Reveal>
      <div style={{ opacity: interpolate(frame, [at, at + 1], [0, 0], { ...clamp, easing: easeInOut }) }} />
    </Center>
  );
};

export const FACTS: Record<number, F> = { 1: F1, 2: F2, 3: F3, 4: F4, 5: F5, 6: F6, 7: F7, 8: F8, 9: F9, 10: F10 };

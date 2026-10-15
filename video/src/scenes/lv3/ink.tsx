import React from 'react';
import { useCurrentFrame } from 'remotion';
import { eOut, img3, ramp, rnd, T } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// Útiles de tinta: la pluma que dibuja los trazos, el sello de goma que deja su marca y la sacudida de cámara del golpe.
// ---------------------------------------------------------------------------------------------------------------

// Pluma estilográfica; su punta está en (0, 0) del contenedor. `lift` la levanta del papel (0 escribe, 1 en el aire).
// La sombra va en un envoltorio sin girar para que caiga siempre hacia abajo a la derecha.
export const Pen: React.FC<{ size?: number; angle?: number; o?: number; lift?: number }> = ({ size = 1, angle = -38, o = 1, lift = 0 }) => {
  if (o <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, opacity: o,
      transform: `translate(${lift * 26}px, ${-lift * 34}px)`,
      filter: `drop-shadow(${16 + lift * 34}px ${22 + lift * 44}px ${8 + lift * 12}px rgba(40,24,10,${0.34 - lift * 0.14}))` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `rotate(${angle}deg) scale(${size * (1 + lift * 0.06)})` }}>
        <svg width={80} height={400} viewBox="-40 -6 80 400" style={{ position: 'absolute', left: -40, top: -6, overflow: 'visible' }}>
          <defs>
            <linearGradient id="lvNib" x1="0" x2="1"><stop offset="0" stopColor="#7a5520" /><stop offset="0.42" stopColor="#f3dc9c" /><stop offset="0.6" stopColor="#d4a957" /><stop offset="1" stopColor="#6e4b1b" /></linearGradient>
            <linearGradient id="lvBar" x1="0" x2="1"><stop offset="0" stopColor="#170b09" /><stop offset="0.32" stopColor="#5a241f" /><stop offset="0.48" stopColor="#93453a" /><stop offset="0.68" stopColor="#471c18" /><stop offset="1" stopColor="#120807" /></linearGradient>
            <linearGradient id="lvGrip" x1="0" x2="1"><stop offset="0" stopColor="#0c0907" /><stop offset="0.45" stopColor="#43392f" /><stop offset="1" stopColor="#0c0907" /></linearGradient>
          </defs>
          <rect x={-23} y={150} width={46} height={250} rx={11} fill="url(#lvBar)" />
          <rect x={-24.5} y={146} width={49} height={11} rx={3} fill="url(#lvNib)" />
          <path d="M -16 92 L 16 92 L 21 150 L -21 150 Z" fill="url(#lvGrip)" />
          <path d="M 0 0 C 5 14, 15 42, 17 70 L 17 97 L -17 97 L -17 70 C -15 42, -5 14, 0 0 Z" fill="url(#lvNib)" />
          <path d="M 0 5 L 0 52" stroke="#4a3313" strokeWidth={1.6} />
          <circle cx={0} cy={56} r={3.6} fill="#4a3313" />
          <path d="M -10 78 Q 0 71 10 78" stroke="rgba(74,51,19,0.55)" strokeWidth={1.3} fill="none" />
        </svg>
      </div>
    </div>
  );
};

// Sello de tinta: baja deprisa, golpea (se aplasta un poco), deja la tinta desigual y unas gotas alrededor.
// `at` = fotograma del golpe. El contenido (texto, marco) va en el color de la tinta.
export const InkStamp: React.FC<{ at: number; w: number; h: number; color?: string; seed?: number; children: React.ReactNode; radius?: number; border?: number }> = ({
  at, w, h, color = T.red, seed = 3, children, radius = 16, border = 8,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -9) return null;
  const down = ramp(frame, at - 9, at, (x) => x * x); // cae acelerando
  const scale = t < 0 ? 1.75 - 0.75 * down : 1 - 0.045 * Math.sin(Math.min(1, t / 9) * Math.PI) * Math.exp(-t / 10);
  const wet = t < 0 ? 0 : Math.exp(-t / 14); // recién estampado, la tinta brilla un poco más
  const o = t < 0 ? 0.25 + 0.6 * down : 0.9 + 0.08 * wet;
  const drops = Array.from({ length: 9 }, (_, i) => {
    const a = rnd(seed * 31 + i) * Math.PI * 2;
    const r = 0.56 + rnd(seed * 31 + i + 50) * 0.22;
    return { x: w / 2 + Math.cos(a) * w * r, y: h / 2 + Math.sin(a) * h * r * 1.1, d: 4 + rnd(seed * 31 + i + 90) * 9, k: ramp(frame, at, at + 4 + (i % 3), eOut) };
  });
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, opacity: o, filter: t < 0 ? `blur(${(1 - down) * 4}px)` : undefined,
        WebkitMaskImage: `url(${img3('ink_wear.png')})`, WebkitMaskSize: `${Math.max(w, h) * 1.1}px`, WebkitMaskPosition: `${(seed * 97) % 300}px ${(seed * 53) % 300}px`,
        border: `${border}px solid ${color}`, borderRadius: radius, color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: wet > 0.02 ? `0 0 ${12 * wet}px rgba(179,54,43,${0.25 * wet})` : undefined }}>
        {children}
      </div>
      {t >= 0 && drops.map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: d.x - d.d / 2, top: d.y - d.d / 2, width: d.d, height: d.d * (0.8 + 0.4 * rnd(seed + i)), borderRadius: '50%', background: color, opacity: 0.8 * d.k, transform: `scale(${d.k})` }} />
      ))}
    </div>
  );
};

// Sacudida de cámara amortiguada (golpe de un sello): devuelve un desplazamiento en x, y.
export const shake = (frame: number, at: number, amp = 10, decay = 6, freq = 2.3) => {
  const t = frame - at;
  if (t < 0 || t > decay * 7) return { x: 0, y: 0 };
  const k = amp * Math.exp(-t / decay);
  return { x: k * Math.sin(t * freq), y: k * 0.7 * Math.cos(t * freq * 1.37) };
};

import React from 'react';

// Móvil Android realista en 3D: marco metálico con grosor (capas apiladas en Z), botones laterales,
// cámara perforada, cristal con reflejo que se desplaza con el giro y sombra de contacto.
// `w` es el ancho de la pantalla en px; la pantalla mide w × w·ratio y el contenido va en `children`.
export type RealPhoneProps = {
  w: number;
  ratio?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  glare?: number;
  shadow?: number;
  tone?: 'graphite' | 'silver' | 'sand';
  screenBg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  hole?: boolean;
};

const TONES = {
  graphite: { rim: ['#9a9da3', '#3a3c41', '#1d1e21', '#5d6066', '#2a2b2f'], edge: ['#2c2d31', '#46484d', '#1b1c1f'], btn: '#3b3d42' },
  silver: { rim: ['#f2f3f5', '#b9bcc2', '#8d9097', '#e3e5e8', '#a7aab0'], edge: ['#a4a7ad', '#d4d6da', '#8a8d93'], btn: '#b3b6bb' },
  sand: { rim: ['#efe3cf', '#c8b598', '#9d8a6f', '#e2d3bb', '#b5a283'], edge: ['#b3a083', '#d8c8ad', '#958266'], btn: '#c2af92' },
};

export const RealPhone: React.FC<RealPhoneProps> = ({
  w, ratio = 2340 / 1080, rotX = 0, rotY = 0, rotZ = 0, glare = 1, shadow = 1, tone = 'graphite', screenBg = '#000', children, style, hole = true,
}) => {
  const h = w * ratio;
  const rim = w * 0.014; // grosor visible del marco metálico
  const bez = w * 0.022; // borde negro alrededor de la pantalla
  const W = w + 2 * (rim + bez);
  const H = h + 2 * (rim + bez);
  const R = w * 0.135;
  const depth = w * 0.082;
  const t = TONES[tone];
  const layers = 14;
  // La luz viene de arriba a la izquierda: el canto derecho se ve más oscuro al girar.
  const edgeBg = `linear-gradient(90deg, ${t.edge[1]} 0%, ${t.edge[0]} 18%, ${t.edge[2]} 50%, ${t.edge[0]} 82%, ${t.edge[1]} 100%)`;
  const glareShift = 50 + rotY * 2.2 - rotX * 1.2;
  const btn = (top: number, len: number) => (
    <div style={{ position: 'absolute', right: -w * 0.0085, top: top * H, width: w * 0.012, height: len * H, borderRadius: w * 0.006, background: `linear-gradient(90deg, ${t.btn}, ${t.edge[1]})` }} />
  );
  return (
    <div style={{ width: W, height: H, perspective: W * 6, perspectiveOrigin: '50% 45%', position: 'relative', ...style }}>
      {/* sombra de contacto, fuera del espacio 3D para que no gire con el móvil */}
      {shadow > 0 && (
        <div style={{ position: 'absolute', left: W * 0.08 + rotY * 1.6, right: W * 0.08 - rotY * 1.6, top: H * 0.06, bottom: -H * 0.02, borderRadius: R * 1.4,
          background: 'rgba(20,16,4,0.30)', filter: `blur(${w * 0.09}px)`, transform: `translate(${-rotY * w * 0.006}px, ${w * 0.05 + rotX * w * 0.004}px)`, opacity: shadow }} />
      )}
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)` }}>
        {/* cuerpo: capas apiladas hacia atrás que forman el canto */}
        {Array.from({ length: layers }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: R, background: i === layers - 1 ? '#151518' : edgeBg, transform: `translateZ(${-(depth * (i + 1)) / layers}px)` }}>
            {i > 3 && i < layers - 4 && (
              <>
                {btn(0.2, 0.075)}
                {btn(0.3, 0.12)}
              </>
            )}
          </div>
        ))}
        {/* cara frontal */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: R, transform: 'translateZ(0.5px)',
          background: `linear-gradient(135deg, ${t.rim[0]} 0%, ${t.rim[1]} 22%, ${t.rim[2]} 50%, ${t.rim[3]} 74%, ${t.rim[4]} 100%)` }}>
          <div style={{ position: 'absolute', inset: rim, borderRadius: R - rim, background: '#050506', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'absolute', inset: bez, borderRadius: R - rim - bez, overflow: 'hidden', background: screenBg }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h }}>{children}</div>
              {hole && (
                <div style={{ position: 'absolute', left: '50%', top: w * 0.028, width: w * 0.036, height: w * 0.036, marginLeft: -w * 0.018, borderRadius: '50%',
                  background: 'radial-gradient(circle at 38% 36%, #2b3442 0%, #0b0d12 45%, #000 70%)', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.05)' }} />
              )}
              {/* reflejo del cristal */}
              {glare > 0 && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55 * glare, mixBlendMode: 'screen',
                  background: `linear-gradient(118deg, rgba(255,255,255,0) ${glareShift - 22}%, rgba(255,255,255,0.10) ${glareShift - 6}%, rgba(255,255,255,0.16) ${glareShift}%, rgba(255,255,255,0.04) ${glareShift + 8}%, rgba(255,255,255,0) ${glareShift + 20}%)` }} />
              )}
              <div style={{ position: 'absolute', inset: 0, borderRadius: R - rim - bez, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 18px rgba(0,0,0,0.18)', pointerEvents: 'none' }} />
            </div>
          </div>
          {/* brillo del canto metálico */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: R, boxShadow: `inset 0 ${w * 0.004}px ${w * 0.006}px rgba(255,255,255,0.35), inset 0 -${w * 0.004}px ${w * 0.008}px rgba(0,0,0,0.35)`, pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
};

// Toque en pantalla: punto que se hunde y una onda que se expande (coordenadas en px de la pantalla del móvil).
export const TapRipple: React.FC<{ x: number; y: number; frame: number; at: number; size?: number; color?: string }> = ({ x, y, frame, at, size = 60, color = 'rgba(255,255,255,0.95)' }) => {
  const f = frame - at;
  if (f < -6 || f > 26) return null;
  const press = f < 0 ? (f + 6) / 6 : Math.max(0, 1 - f / 10);
  const wave = Math.max(0, Math.min(1, f / 22));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 50 }}>
      <div style={{ position: 'absolute', width: size, height: size, left: -size / 2, top: -size / 2, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', border: '2px solid rgba(16,16,16,0.25)',
        transform: `scale(${0.75 + 0.15 * press})`, opacity: press * 0.9, boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', width: size, height: size, left: -size / 2, top: -size / 2, borderRadius: '50%', border: `3px solid ${color}`,
        transform: `scale(${0.8 + wave * 1.4})`, opacity: f < 0 ? 0 : (1 - wave) * 0.9 }} />
    </div>
  );
};

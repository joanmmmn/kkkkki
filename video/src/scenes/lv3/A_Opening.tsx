import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { At, BeamDust, Draw, eIO, eOut, follow, Fleuron, img3, InkWords, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { CLIP3, itemAt, scene, w } from './timeline';

// Plano A (escenas S01 y S02): en la oscuridad, un libro abierto bajo un haz de luz; la voz de Omar entinta la página.
// Después la cámara se eleva y se aleja: el libro está sobre una mesa, en el pasillo de una biblioteca enorme cuyas
// estanterías se iluminan, y aparece LibriVox.
const PW = 900, PH = 1220; // página (px CSS)
const TABLE_Y = 0; // la mesa es el plano y = 0 (el libro, abierto encima)
const FLOOR_Y = 2900;
const AISLE = 5600; // media anchura del pasillo
const WALL_H = 9600;
const WALL_L = 30000;
// Destello que recorre un texto (relleno con degradado recortado al texto)
const shine = (p: number, base: string = T.gold): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${base} 0%, ${base} ${p * 130 - 30}%, #fff6e2 ${p * 130 - 15}%, ${base} ${p * 130}%, ${base} 100%)`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
});
const LAMPS = Array.from({ length: 9 }, (_, i) => ({ z: 3000 - i * 3000, x: (i % 2 ? 1 : -1) * 2200 }));
const REST = 'lo que puedo decir es que en su fondo hay una verdad, una verdad muy triste, de la que acaso yo seré uno de los últimos en aprovecharme, dadas mis condiciones de imaginación.';

const BookSpread: React.FC<{ clipAt: number; fNote: number; fVol: number; fCasa: number }> = ({ clipAt, fNote, fVol, fCasa }) => {
  const frame = useCurrentFrame();
  const note = ramp(frame, fNote - 4, fNote + 20, eOut);
  const capHi = ramp(frame, fCasa - 6, fCasa + 18, eOut);
  const words = CLIP3.omar_cold.words;
  const first = words[0];
  // Capitular: la «Y» de «Yo» se entinta con la primera palabra
  const capInk = interpolate(frame, [clipAt + Math.round(first[0] * 50) - 6, clipAt + Math.round(first[0] * 50) + 10], [0.25, 1], clamp);
  return (
    <div style={{ position: 'relative', width: PW * 2, height: PH, transformStyle: 'preserve-3d' }}>
      {/* tapas */}
      <div style={{ position: 'absolute', left: -26, top: -22, width: PW * 2 + 52, height: PH + 44, borderRadius: 14, background: 'linear-gradient(135deg, #5a2a22, #3b1913 60%, #2c120e)', transform: 'translateZ(-14px)', boxShadow: '0 60px 120px rgba(0,0,0,0.7)' }} />
      {/* cantos de las hojas */}
      <div style={{ position: 'absolute', left: -8, top: -6, width: PW * 2 + 16, height: PH + 12, borderRadius: 8, background: 'repeating-linear-gradient(0deg, #e9dfc7 0 2px, #cfc2a3 2px 3px)', transform: 'translateZ(-6px)' }} />
      {/* página izquierda */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, ...paperBg(T.paper), borderRadius: '8px 2px 2px 8px', transformOrigin: 'right center', transform: 'rotateY(4deg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0) 78%, rgba(90,60,20,0.22) 100%)' }} />
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.inkSoft }}>Leyendas</div>
        <div style={{ position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', color: T.ink }}>
          <div style={{ fontFamily: T.serif, fontSize: 120, fontWeight: 500, lineHeight: 1 }}>IX</div>
          <div style={{ fontFamily: T.serif, fontSize: 70, fontWeight: 500, marginTop: 20, position: 'relative', display: 'inline-block' }}>
            El rayo de luna
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, height: 4, background: T.teal, transformOrigin: 'left', transform: `scaleX(${capHi})`, borderRadius: 2, opacity: 0.85 }} />
          </div>
          <div style={{ marginTop: 34 }}><Fleuron at={-100} w={240} color={T.inkFaint} /></div>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 34, color: T.inkSoft, marginTop: 30 }}>Gustavo Adolfo Bécquer</div>
        </div>
        {/* nota al margen: quién lee */}
        <div style={{ position: 'absolute', left: 120, top: 905, width: 640, opacity: note, transform: `translateY(${(1 - note) * 14}px)` }}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.teal, lineHeight: 1.2 }}>Leído por Omar,</div>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.teal, lineHeight: 1.2, position: 'relative', display: 'inline-block' }}>
            voluntario de LibriVox
            <div style={{ position: 'absolute', left: 0, bottom: 2, height: 3, width: `${ramp(frame, fVol, fVol + 16, eOut) * 100}%`, background: T.teal, borderRadius: 2 }} />
          </div>
        </div>
        <Draw at={fNote + 6} dur={24} w={PW} h={PH} color={T.teal} width={3.4} style={{ left: 0, top: 0 }} len={420}
          d={`M 712 984 C 772 962, 818 936, 858 896 M 858 896 L 832 898 M 858 896 L 852 921`} />
      </div>
      {/* página derecha: el texto que lee Omar */}
      <div style={{ position: 'absolute', left: PW, top: 0, width: PW, height: PH, ...paperBg(T.paper), borderRadius: '2px 8px 8px 2px', transformOrigin: 'left center', transform: 'rotateY(-4deg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(0,0,0,0) 80%, rgba(90,60,20,0.22) 100%)' }} />
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.inkSoft }}>El rayo de luna</div>
        <div style={{ position: 'absolute', left: 104, right: 96, top: 210 }}>
          <div style={{ float: 'left', fontFamily: T.serif, fontSize: 196, lineHeight: 0.82, marginRight: 14, marginTop: 8, color: T.redInk, opacity: capInk }}>Y</div>
          <InkWords clip="omar_cold" clipAt={clipAt} size={50} lh={1.5} align="justify" color={T.ink} faint={T.inkFaint} dropCap after={REST} />
        </div>
        <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, textAlign: 'center', fontFamily: T.serif, fontSize: 30, color: T.inkFaint }}>~ 117 ~</div>
      </div>
      {/* luz cálida sobre las páginas */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 62% 30%, rgba(255,236,190,0.0) 0%, rgba(40,20,0,0.18) 100%)', pointerEvents: 'none' }} />
    </div>
  );
};

export const Opening: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s2 = scene('S01').dur; // inicio de S02 dentro del plano
  const clipAt = itemAt('S01', 'omar_cold');
  const fK01 = itemAt('S01', 'K01');
  const fOmar = w('S01', 'K01', 'Omar');
  const fVol = w('S01', 'K01', 'voluntario');
  const fCasa = w('S01', 'K01', 'capítulo'); // «grabó este capítulo»: se subraya el título del capítulo
  const fGratis = w('S01', 'K01', 'gratis');
  const k2 = (word: string, n = 0) => s2 + w('S02', 'K02', word, n);
  const fMiles = k2('miles');
  const f21 = k2('veintiún');
  const fT1 = k2('Todos', 0);
  const fT2 = k2('Todos', 1);
  const fEsto = k2('Esto');
  const fLV = k2('LibriVox');
  // Cámara: órbita alrededor de un punto (x, y, tz) con giro rx/ry y avance z
  const cam = follow(frame, [
    { f: 0, x: 300, y: -330, tz: 0, z: 760, rx: -86, ry: -3 },
    { f: clipAt + 30, x: 330, y: -300, tz: 0, z: 640, rx: -86, ry: -3 },
    { f: clipAt + 230, x: 450, y: -120, tz: 0, z: 260, rx: -85, ry: -2 },
    { f: fK01 + 10, x: 420, y: -60, tz: 0, z: 140, rx: -84, ry: 0 },
    { f: fOmar + 22, x: -60, y: -20, tz: 0, z: 40, rx: -83, ry: 1 },
    { f: fVol + 20, x: -40, y: -10, tz: 0, z: 0, rx: -82, ry: 2 },
    { f: fCasa + 10, x: 40, y: 0, tz: 0, z: -330, rx: -80, ry: 3 },
    { f: fGratis + 12, x: 0, y: 0, tz: 0, z: -440, rx: -76, ry: 3 },
    { f: fMiles + 10, x: 0, y: -440, tz: -313, z: -1500, rx: -20, ry: 0 },
    { f: fMiles + 60, x: 0, y: -700, tz: -2600, z: -1500, rx: -16, ry: 0 },
    { f: f21 + 30, x: 0, y: -1500, tz: -8200, z: -1400, rx: -10, ry: 0 },
    { f: fLV + 40, x: 0, y: -1900, tz: -12500, z: -900, rx: -6, ry: 0 },
  ], 5.2);
  // Oscuridad inicial y luz que se enciende sobre el libro
  const dark = 1 - ramp(frame, 0, 20, eOut);
  // Las estanterías se iluminan en ola, del primer plano al fondo
  const wave = ramp(frame, fMiles - 10, f21 + 40, eIO);
  const wallLit = ramp(frame, fMiles - 30, fMiles + 30, eIO);
  // Cifra y título en el pasillo
  const c21 = sp(frame, f21 - 8, fps, 110, 24);
  // la cifra cuenta hasta 21.000 mientras se dice
  const n21 = Math.round(21000 * Easing.bezier(0.22, 1, 0.36, 1)(ramp(frame, f21 - 8, f21 + 42, (x) => x)) / 10) * 10;
  const count21 = String(n21).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const t1 = sp(frame, fT1 - 2, fps, 140, 26), t2 = sp(frame, fT2 - 2, fps, 140, 26);
  const outNums = ramp(frame, fEsto - 10, fEsto + 14, eIO);
  const logo = sp(frame, fLV - 6, fps, 90, 22);
  const tag = sp(frame, fLV + 16, fps, 110, 24);
  const flare = ramp(frame, fLV - 8, fLV + 6, eOut) * (1 - ramp(frame, fLV + 6, fLV + 60, eIO));
  // Las capas enormes se dibujan a 1/Q de su tamaño y se escalan ×Q (mucho menos que rasterizar en cada fotograma)
  const Q = 4;
  const wallStyle = (side: 1 | -1): React.CSSProperties => ({
    position: 'absolute', left: -WALL_L / Q / 2, top: -WALL_H / Q / 2, width: WALL_L / Q, height: WALL_H / Q,
    backgroundImage: `url(${img3('shelves_lit2.jpg')})`, backgroundSize: `${14400 / Q}px ${6000 / Q}px`, backgroundRepeat: 'repeat', backfaceVisibility: 'hidden', overflow: 'hidden',
    transform: `translate3d(${side * -AISLE}px, ${FLOOR_Y - WALL_H / 2}px, ${-WALL_L / 2 + 6000}px) rotateY(${side * 90}deg) scale(${Q})`,
  });
  // Oscurecimiento de las paredes: la «ola» de luz avanza del primer plano (borde cercano) al fondo. Las paredes no se
  // vuelven a pintar en cada fotograma (son enormes): encima llevan una capa uniforme que solo cambia de opacidad y la
  // sombra de la parte aún apagada, que solo se desplaza.
  const RAMP = (WALL_L * 0.18) / Q, WL = WALL_L / Q;
  const WallShade: React.FC<{ side: 1 | -1 }> = ({ side }) => (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgb(8,5,3)', opacity: 0.42 - 0.42 * wallLit }} />
      <div style={{ position: 'absolute', top: 0, height: '100%', width: WL + RAMP, left: side === 1 ? -RAMP : 0,
        background: `linear-gradient(${side === 1 ? 'to right' : 'to left'}, rgba(8,5,3,0) 0px, rgba(8,5,3,0.38) ${RAMP}px, rgba(8,5,3,0.46) 100%)`,
        transform: `translateX(${side * wave * 1.08 * WL}px)` }} />
    </>
  );
  return (
    <AbsoluteFill>
      <Space persp={1600}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(0px, 0px, ${-cam.tz}px)` }}>
            {/* paredes de estanterías */}
            <div style={wallStyle(1)}><WallShade side={1} /></div>
            <div style={wallStyle(-1)}><WallShade side={-1} /></div>
            {/* suelo */}
            <div style={{ position: 'absolute', left: -AISLE / Q, top: -WALL_L / Q / 2, width: (AISLE * 2) / Q, height: WALL_L / Q, transform: `translate3d(0px, ${FLOOR_Y}px, ${-WALL_L / 2 + 6000}px) rotateX(90deg) scale(${Q})`,
              backgroundImage: `linear-gradient(0deg, rgba(10,6,3,0) 0%, rgba(10,6,3,0.42) 100%), linear-gradient(90deg, transparent 0 40%, #6a2a22 40% 40.6%, #8a382c 40.6% 59.4%, #6a2a22 59.4% 60%, transparent 60%), url(${img3('wood.jpg')})`, backgroundSize: `100% 100%, 100% 100%, ${760}px ${760}px` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgb(10,6,3)', opacity: 0.55 * (1 - wallLit) }} />
            </div>
            {/* pared del fondo */}
            <div style={{ position: 'absolute', left: -AISLE / Q, top: -WALL_H / Q / 2, width: (AISLE * 2) / Q, height: WALL_H / Q, transform: `translate3d(0px, ${FLOOR_Y - WALL_H / 2}px, ${-WALL_L + 6000}px) scale(${Q})`,
              backgroundImage: `url(${img3('shelves_lit2.jpg')})`, backgroundSize: `${14400 / Q}px ${6000 / Q}px` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgb(8,5,3)', opacity: 0.56 - 0.44 * wave }} />
            </div>
            {/* lámparas colgantes: se encienden una tras otra con la ola de luz, del primer plano al fondo */}
            {LAMPS.map((l, k) => {
              const on0 = fMiles - 14 + (k / LAMPS.length) * (f21 + 30 - fMiles);
              const on = interpolate(frame, [on0, on0 + 4, on0 + 9, on0 + 16], [0, 1.25, 0.85, 1], clamp);
              if (on <= 0.01) return null;
              return (
                <React.Fragment key={k}>
                  <div style={{ position: 'absolute', left: -190, top: -190, width: 380, height: 380, borderRadius: '50%', opacity: Math.min(1.2, on), transform: `translate3d(${l.x}px, ${FLOOR_Y - 5600}px, ${l.z}px)`,
                    background: 'radial-gradient(circle, rgba(255,240,205,1) 0%, rgba(255,214,150,0.9) 22%, rgba(255,190,110,0.28) 52%, rgba(255,190,110,0) 72%)' }} />
                  <div style={{ position: 'absolute', left: -1700, top: -1700, width: 3400, height: 3400, borderRadius: '50%', opacity: Math.min(1, on), transform: `translate3d(${l.x}px, ${FLOOR_Y - 6}px, ${l.z}px) rotateX(90deg)`,
                    background: 'radial-gradient(circle, rgba(255,210,150,0.55) 0%, rgba(255,205,140,0.2) 45%, rgba(255,205,140,0) 70%)' }} />
                </React.Fragment>
              );
            })}
            {/* mesa de lectura y libro */}
            <div style={{ position: 'absolute', left: -2600, top: -1700, width: 5200, height: 3400, borderRadius: 30, transform: `translate3d(0px, ${TABLE_Y + 4}px, 0px) rotateX(90deg)`,
              backgroundColor: '#5a3e27',
              backgroundImage: `radial-gradient(42% 46% at 50% 48%, rgba(255,200,130,0.3) 0%, rgba(255,200,130,0.06) 55%, rgba(20,10,4,0.4) 100%), url(${img3('wood.jpg')})`,
              backgroundSize: '100% 100%, 2080px 2080px', boxShadow: '0 0 0 26px #6a4a2e, 0 0 0 30px #3a2616' }} />
            <div style={{ position: 'absolute', left: -PW, top: -PH / 2, transformStyle: 'preserve-3d', transform: `translate3d(0px, ${TABLE_Y - 2}px, 0px) rotateX(90deg)` }}>
              <BookSpread clipAt={clipAt} fNote={fOmar} fVol={fVol} fCasa={fCasa} />
            </div>
            {/* cifra y título, de pie en el pasillo */}
            <At x={0} y={-1900} z={-12500} w={6000} h={3000} style={{ pointerEvents: 'none' }}>
              {/* penumbra detrás de las letras, para que se lean sobre las estanterías iluminadas */}
              <div style={{ position: 'absolute', inset: -400, background: 'radial-gradient(closest-side, rgba(12,8,5,0.5) 0%, rgba(12,8,5,0.3) 55%, rgba(12,8,5,0) 100%)', opacity: Math.max(c21, logo) }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: T.cream, opacity: 1 - outNums }}>
                <div style={{ fontFamily: T.serif, fontSize: 230, fontStyle: 'italic', color: T.creamSoft, opacity: c21, transform: `translateY(${(1 - c21) * 60}px)` }}>más de</div>
                <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 780, lineHeight: 0.9, letterSpacing: -16, opacity: c21, transform: `translateY(${(1 - c21) * 120}px)`, textShadow: '0 0 120px rgba(255,200,120,0.35)', fontVariantNumeric: 'tabular-nums' }}>{count21}</div>
                <div style={{ fontFamily: T.serif, fontSize: 290, opacity: c21, marginTop: 20 }}>audiolibros</div>
                <div style={{ display: 'flex', gap: 240, marginTop: 110, fontFamily: T.serif, fontStyle: 'italic', fontSize: 220, color: T.gold }}>
                  <span style={{ opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`, ...shine(ramp(frame, fT1, fT1 + 40, eIO)) }}>Todos gratis.</span>
                  <span style={{ opacity: t2, transform: `translateY(${(1 - t2) * 40}px)`, ...shine(ramp(frame, fT2, fT2 + 40, eIO)) }}>Todos legales.</span>
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: '"TeX Gyre Heros", Helvetica, Arial, sans-serif', fontSize: 420, letterSpacing: -12, color: T.cream, opacity: logo, transform: `scale(${0.94 + 0.06 * logo})`, filter: logo < 0.98 ? `blur(${(1 - logo) * 14}px)` : undefined, textShadow: `0 0 ${60 + flare * 120}px rgba(255,210,140,${0.25 + flare * 0.5})` }}>
                  <span style={shine(ramp(frame, fLV + 4, fLV + 54, eIO), T.cream)}>Libri<b style={{ fontWeight: 700 }}>Vox</b></span>
                </div>
                <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 96, color: T.gold, opacity: tag, transform: `translateY(${(1 - tag) * 30}px)`, marginTop: -6 }}>
                  Audiolibros gratis, leídos por personas
                </div>
              </div>
            </At>
          </div>
        </Rig>
      </Space>
      <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(70% 75% at 52% 46%, rgba(0,0,0,0) 45%, rgba(4,2,1,0.62) 100%)', opacity: 1 - ramp(frame, fGratis - 20, fMiles + 10, eIO) }} />
      <BeamDust o={0.95 - 0.55 * ramp(frame, fMiles - 20, fMiles + 40, eIO)} x0={520} y0={-260} angle={-24} width={620} />
      {/* relleno de luz cálida en el pasillo (que no se vea oscuro) */}
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: ramp(frame, fMiles - 30, fMiles + 30, eIO),
        background: 'radial-gradient(90% 80% at 50% 42%, rgba(255,196,128,0.16) 0%, rgba(255,196,128,0.07) 55%, rgba(255,196,128,0.03) 100%)' }} />
      {/* destello cálido en el título */}
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(50% 40% at 50% 46%, rgba(255,214,150,${0.22 * flare}), rgba(255,214,150,0) 70%)` }} />
      <AbsoluteFill style={{ background: '#000', opacity: dark, pointerEvents: 'none' }} />
      <Sfx name="book_open" at={6} volume={0.7} />
      <Sfx name="dust_shimmer" at={24} volume={0.5} />
      <Sfx name="pen_scratch" at={fOmar + 4} volume={0.55} />
      <Sfx name="pen_underline" at={fVol + 2} volume={0.6} />
      <Sfx name="reveal_whoosh" at={fMiles - 30} volume={0.8} />
      <Sfx name="lights_on" at={fMiles - 6} volume={0.75} />
      <Sfx name="soft_impact" at={f21} volume={0.5} />
      <Sfx name="soft_impact" at={fLV} volume={0.8} />
      <Sfx name="dust_shimmer" at={fLV + 4} volume={0.6} />
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { color, font } from '../../brand/tokens';
import { Dust, Grain } from '../skg/kit';
import { sceneDef } from './timeline';

// ————————————————————————————————————————————————————————————————
// «Los 10 mejores» · Terror, v2: portadas reales de cada audiolibro (Audible España; la novela completa
// de Apocalipsis Z, de Storytel), cámara en movimiento, voz que mueve la luz y transiciones con parpadeo.
// ————————————————————————————————————————————————————————————————

const ENV: Record<string, number[]> = require('./voenv.json');
const FPS = 50;

// Portadas por libro (p = 1 → n.º 10 … p = 10 → n.º 1), una por narración, en el orden de `narr`.
export const COVERS: Record<number, string[]> = {
  1: ['10_cthulhu'],
  2: ['09_poe', '09_corazon'],
  3: ['08_hendrix'],
  4: ['07_distancia'],
  5: ['06_dracula', '06_dracula_original'],
  6: ['05_apocalipsis_original', '05_apocalipsis_novela'],
  7: ['04_carcoma'],
  8: ['03_salem'],
  9: ['02_nuestra_parte'],
  10: ['01_exorcista'],
};
export const coverSrc = (name: string) => staticFile(`t10/covers/${name}.jpg`);
export const bgSrc = (name: string) => staticFile(`t10/covers/bg_${name}.jpg`);
export const mainCover = (p: number) => COVERS[p][0];

// ———————————————— Censura ————————————————
// Al principio del vídeo las portadas salen censuradas (mosaico + «?») y cada una se descensura cuando entra su libro
// (petición de Joan, 15/10). Mosaicos pregenerados con ffmpeg (mz{N}_{portada}.png, 1200 px, de N×N teselas).
export const MOSAIC = [8, 12, 18, 28, 44, 70];
export const mosaicSrc = (name: string, n: number) => staticFile(`t10/covers/mz${n}_${name}.png`);
// Arte de la portada con censura: reveal 0 = mosaico grueso con «?»; 1 = portada nítida. Entre medias, el mosaico se afina a saltos.
export const CoverArt: React.FC<{ name: string; size: number; reveal?: number; light?: number; mark?: boolean; radius?: number }> = ({ name, size, reveal = 1, light = 1, mark = true, radius = 0 }) => {
  const r = Math.max(0, Math.min(1, reveal));
  const lvl = Math.min(MOSAIC.length - 1, Math.floor(r * (MOSAIC.length + 1)));
  const fine = Math.max(0, Math.min(1, (r - MOSAIC.length / (MOSAIC.length + 1)) * (MOSAIC.length + 1)));
  const img: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: size, height: size, display: 'block', borderRadius: radius,
    filter: light < 1 ? `brightness(${(0.25 + 0.75 * light).toFixed(3)})` : undefined };
  const q = mark ? Math.max(0, 1 - r * 3) : 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, overflow: 'hidden', borderRadius: radius }}>
      {r < 1 && <Img src={mosaicSrc(name, MOSAIC[lvl])} style={img} />}
      {fine > 0 && <Img src={coverSrc(name)} style={{ ...img, opacity: fine }} />}
      {r < 1 && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${(0.3 * (1 - r)).toFixed(3)})` }} />}
      {q > 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: q, transform: `scale(${(1 + 0.4 * (1 - q)).toFixed(3)})`,
          fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.5, lineHeight: 1, color: 'rgba(255,255,255,0.88)', textShadow: `0 ${size * 0.02}px ${size * 0.08}px rgba(0,0,0,0.6)` }}>?</div>
      )}
    </div>
  );
};

export const sp = (frame: number, at: number, d = 15, s = 170, mass = 1) => spring({ frame: frame - at, fps: FPS, config: { damping: d, stiffness: s, mass } });
export const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ———————————————— La voz ————————————————
// Nivel de la locución `id` en el fotograma `f` (relativo al inicio de esa locución): 0..1.
export const envAt = (id: string, f: number) => {
  const e = ENV[id];
  if (!e || f < 0 || f >= e.length) return 0;
  return e[Math.floor(f)];
};
// Nivel de la voz en el fotograma `frame` de la escena `sceneId` (cualquiera de sus locuciones).
export const sceneLevel = (sceneId: string, frame: number) => {
  const s = sceneDef(sceneId);
  let v = 0;
  for (const p of s.vo) v = Math.max(v, envAt(p.id, frame - p.at));
  return v;
};

// ———————————————— Movimiento ————————————————
// Sacudida que decae (impactos): desplazamiento y giro deterministas.
export const shake = (frame: number, at: number, amp = 14, dur = 16, seed = 'sh') => {
  if (frame < at || frame > at + dur) return { x: 0, y: 0, r: 0 };
  const k = Math.pow(1 - (frame - at) / dur, 2);
  return {
    x: (random(`${seed}-x-${frame}`) - 0.5) * 2 * amp * k,
    y: (random(`${seed}-y-${frame}`) - 0.5) * 2 * amp * k,
    r: (random(`${seed}-r-${frame}`) - 0.5) * 1.2 * k,
  };
};
// Suma de varias sacudidas.
export const shakes = (frame: number, list: { at: number; amp?: number; dur?: number }[], seed = 'sh') =>
  list.reduce((acc, s, i) => {
    const q = shake(frame, s.at, s.amp, s.dur, `${seed}${i}`);
    return { x: acc.x + q.x, y: acc.y + q.y, r: acc.r + q.r };
  }, { x: 0, y: 0, r: 0 });

// Cámara sobre una escena de 1920×1080: cada clave encuadra un punto (fx, fy) con zoom s; entre claves, movimiento
// rápido (dur fotogramas) y luego deriva lenta. Nunca deja ver los bordes.
export type CamKey = { at: number; fx: number; fy: number; s: number; r?: number; dur?: number };
export const camAt = (frame: number, keys: CamKey[]) => {
  let k = 0;
  for (let i = 0; i < keys.length; i++) if (frame >= keys[i].at) k = i;
  const cur = keys[k];
  const prev = keys[Math.max(0, k - 1)];
  const p = k === 0 ? 1 : interpolate(frame, [cur.at, cur.at + (cur.dur ?? 18)], [0, 1], { ...clamp, easing: easeInOut });
  const since = Math.max(0, frame - cur.at);
  const s = lerp(prev.s, cur.s, p) * (1 + Math.min(0.06, since * 0.00022));
  let fx = lerp(prev.fx, cur.fx, p) + Math.sin(frame / 90) * 14;
  let fy = lerp(prev.fy, cur.fy, p) + Math.cos(frame / 110) * 9;
  const hw = 960 / s, hh = 540 / s;
  fx = Math.min(1920 - hw, Math.max(hw, fx));
  fy = Math.min(1080 - hh, Math.max(hh, fy));
  const r = lerp(prev.r ?? 0, cur.r ?? 0, p) + Math.sin(frame / 130) * 0.25;
  return { s, tx: 960 - fx, ty: 540 - fy, r };
};
export const camStyle = (c: ReturnType<typeof camAt>, extra = { x: 0, y: 0, r: 0 }): React.CSSProperties => ({
  transform: `translate(${(extra.x).toFixed(2)}px, ${(extra.y).toFixed(2)}px) rotate(${(c.r + extra.r).toFixed(3)}deg) scale(${c.s.toFixed(4)}) translate(${c.tx.toFixed(2)}px, ${c.ty.toFixed(2)}px)`,
  transformOrigin: '50% 50%',
});

// ———————————————— Portadas ————————————————
// Portada real en 3D: cuadrada, con canto, brillo que la recorre, sombra y reflejo en el suelo.
export const Cover3D: React.FC<{
  name: string; size: number; rx?: number; ry?: number; rz?: number; shine?: number; light?: number; reflect?: boolean; radius?: number; glow?: number; glowColor?: string; style?: React.CSSProperties; reveal?: number;
}> = ({ name, size, rx = 0, ry = 0, rz = 0, shine = -1, light = 1, reflect = false, radius, glow = 0, glowColor = 'rgba(255,202,5,', style, reveal = 1 }) => {
  const R = radius ?? size * 0.022;
  const depth = size * 0.035;
  const sh = shine;
  const face: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: R, overflow: 'hidden' };
  const art = (
    <>
      <CoverArt name={name} size={size} reveal={reveal} light={light} />
      {sh > -1 && sh < 2 && (
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${(-30 + sh * 130).toFixed(1)}%, rgba(255,255,255,0.32) ${(-18 + sh * 130).toFixed(1)}%, rgba(255,255,255,0) ${(-4 + sh * 130).toFixed(1)}%)`, mixBlendMode: 'screen' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.18) 100%)' }} />
    </>
  );
  return (
    <div style={{ width: size, height: size, position: 'relative', perspective: size * 4.2, ...style }}>
      {glow > 0 && (
        <div style={{ position: 'absolute', left: -size * 0.35, top: -size * 0.35, width: size * 1.7, height: size * 1.7, borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor}${(0.42 * glow).toFixed(3)}) 0%, ${glowColor}${(0.12 * glow).toFixed(3)}) 38%, ${glowColor}0) 66%)` }} />
      )}
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        {/* canto */}
        <div style={{ ...face, transform: `translateZ(${-depth}px)`, background: '#0b0b0c', boxShadow: `0 ${size * 0.08}px ${size * 0.16}px rgba(0,0,0,0.65)` }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ ...face, transform: `translateZ(${(-depth + (depth * (i + 1)) / 5).toFixed(2)}px)`, background: i % 2 ? '#141416' : '#1d1d20' }} />
        ))}
        <div style={{ ...face, transform: 'translateZ(0px)', boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}>{art}</div>
      </div>
      {reflect && (
        <div style={{ position: 'absolute', left: 0, top: size + size * 0.04, width: size, height: size * 0.42, overflow: 'hidden', opacity: 0.22 * light, pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0) 85%)' }}>
          <div style={{ width: size, height: size, transform: `scaleY(-1) rotateY(${ry * 0.6}deg)`, transformOrigin: '50% 50%', marginTop: -size * 0.58 }}>
            <CoverArt name={name} size={size} reveal={reveal} mark={false} radius={R} />
          </div>
        </div>
      )}
    </div>
  );
};

// Fondo de color de la portada (desenfocada de antemano con ffmpeg), oscuro y en movimiento lento.
export const Ambient: React.FC<{ name: string; name2?: string; mix?: number; opacity?: number; dark?: number; seed?: string; children?: React.ReactNode; dust?: boolean; red?: number }> = ({ name, name2, mix = 0, opacity = 1, dark = 0.55, seed = 'amb', children, dust = true, red = 0.6 }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  const ox = random(`${seed}-ox`) * 6;
  const move = `translate(${(Math.sin(t * 0.13 + ox) * 70).toFixed(1)}px, ${(Math.cos(t * 0.11 + ox) * 40).toFixed(1)}px) scale(${(1.08 + Math.sin(t * 0.07) * 0.05).toFixed(4)}) rotate(${(Math.sin(t * 0.05 + ox) * 2).toFixed(2)}deg)`;
  const bg: React.CSSProperties = { position: 'absolute', left: -240, top: -140, width: 2400, height: 1350, objectFit: 'cover', transform: move };
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#050506' }}>
      <AbsoluteFill style={{ opacity }}>
        {mix < 1 && <Img src={bgSrc(name)} style={bg} />}
        {name2 && mix > 0 && <Img src={bgSrc(name2)} style={{ ...bg, opacity: mix }} />}
        <AbsoluteFill style={{ background: `rgba(4,4,6,${dark})` }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', width: 1600, height: 1600, borderRadius: '50%', left: 160 + Math.sin(t * 0.1) * 120, top: 560 + Math.cos(t * 0.08) * 60,
        background: `radial-gradient(circle, rgba(193,18,31,${0.12 * red}) 0%, rgba(193,18,31,${0.03 * red}) 40%, rgba(193,18,31,0) 62%)` }} />
      {dust && <Dust n={36} color="rgba(255,226,170,0.45)" />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />
      {children}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ———————————————— Texto ————————————————
// Palabras que entran una a una (cada una en su fotograma), con desenfoque y subida.
export const KWords: React.FC<{ words: { t: string; at: number; hi?: boolean }[]; size: number; color?: string; hiColor?: string; lh?: number; weight?: number; align?: 'left' | 'center' | 'right'; serif?: boolean; italic?: boolean; width?: number }> = ({
  words, size, color: c = '#fff', hiColor = color.yellow, lh = 1.04, weight = 700, align = 'left', serif = false, italic = false, width,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: serif ? font.serif : font.sans, fontWeight: weight, fontStyle: italic ? 'italic' : undefined, fontSize: size, lineHeight: lh, letterSpacing: -size * 0.025, color: c, textAlign: align, width,
      display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', columnGap: size * 0.26 }}>
      {words.map((w, i) => {
        const p = interpolate(frame, [w.at, w.at + 12], [0, 1], { ...clamp, easing: easeOut });
        const b = (1 - p) * 10;
        return (
          <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${((1 - p) * size * 0.35).toFixed(1)}px) scale(${(1.12 - 0.12 * p).toFixed(3)})`,
            filter: b > 0.3 ? `blur(${b.toFixed(1)}px)` : undefined, color: w.hi ? hiColor : undefined, whiteSpace: 'pre' }}>{w.t}</span>
        );
      })}
    </div>
  );
};

// Número que cuenta hasta su valor (formato español).
export const countTo = (frame: number, at: number, dur: number, value: number, decimals = 0) => {
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
  const v = value * p;
  const [int, dec] = v.toFixed(decimals).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${grouped},${dec}` : grouped;
};

// Medidor de miedo: diez segmentos del 10 al 1; se enciende el del libro actual (cada vez más rojo).
export const FearMeter: React.FC<{ n: number; at: number; out: number; x?: number; y?: number; k?: number }> = ({ n, at, out, x = 960, y = 1000, k = 1.5 }) => {
  const frame = useCurrentFrame();
  const inn = sp(frame, at, 16, 160);
  const o = 1 - ramp(frame, out - 10, out);
  if (inn <= 0.001 || o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) translateY(${((1 - inn) * 40).toFixed(1)}px)`, opacity: inn * o, display: 'flex', alignItems: 'center', gap: 18 * k }}>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 20 * k, letterSpacing: 6 * k, color: 'rgba(239,232,220,0.62)' }}>MIEDO</span>
      <div style={{ display: 'flex', gap: 6 * k, alignItems: 'flex-end' }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const kk = 10 - i; // 10 … 1
          const red = i / 9;
          const done = kk > n; // ya pasados
          const cur = kk === n;
          const fill = ramp(frame, at + 6 + i * 2, at + 14 + i * 2);
          const lit = cur ? ramp(frame, at + 10 + i * 2, at + 22 + i * 2) : 0;
          const base = `rgba(${Math.round(110 + 120 * red)}, ${Math.round(110 - 92 * red)}, ${Math.round(110 - 80 * red)},`;
          const pulse = cur ? 0.75 + 0.25 * Math.sin(frame / 5) : 1;
          return (
            <div key={i} style={{ width: 34 * k, height: (10 + i * 2.4) * k, borderRadius: 4 * k, background: cur ? `${base}${(0.95 * lit * pulse).toFixed(3)})` : done ? `${base}${(0.5 * fill).toFixed(3)})` : 'rgba(255,255,255,0.10)',
              boxShadow: cur ? `0 0 ${(22 * lit * k).toFixed(0)}px ${base}0.85)` : undefined, transform: cur ? `scaleY(${(1 + 0.4 * lit).toFixed(3)})` : undefined, transformOrigin: '50% 100%' }} />
          );
        })}
      </div>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22 * k, color: 'rgba(239,232,220,0.75)' }}>{n}<span style={{ opacity: 0.55 }}>/10</span></span>
    </div>
  );
};

// Tira de las diez portadas (del 10 al 1): las ya vistas, nítidas; la del libro actual se descensura con `reveal`;
// las que faltan siguen censuradas. Bajo la actual, una raya roja que crece (más roja cuanto más cerca del 1).
export const CoverStrip: React.FC<{ n: number; at: number; out: number; reveal: number; x?: number; y?: number; size?: number }> = ({ n, at, out, reveal, x = 1430, y = 975, size = 70 }) => {
  const frame = useCurrentFrame();
  const inn = sp(frame, at, 16, 150);
  const o = 1 - ramp(frame, out - 10, out);
  if (inn <= 0.001 || o <= 0) return null;
  const gap = size * 0.17;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) translateY(${((1 - inn) * 50).toFixed(1)}px)`, opacity: Math.min(1, inn * 1.4) * o, display: 'flex', gap, alignItems: 'flex-end' }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const k = 10 - i; // 10 … 1
        const cur = k === n;
        const s = sp(frame, at + 4 + i * 2, 13, 190);
        const pop = cur ? sp(frame, at + 10, 11, 170) : 0;
        const red = i / 9;
        return (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.12, transform: `translateY(${((1 - s) * 24 - pop * size * 0.18).toFixed(1)}px) scale(${(1 + 0.22 * pop).toFixed(3)})`, transformOrigin: '50% 100%', opacity: Math.min(1, s * 1.5) }}>
            <div style={{ borderRadius: size * 0.08, overflow: 'hidden', boxShadow: cur ? `0 0 0 ${Math.max(2, size * 0.04)}px ${k === 1 ? '#C1121F' : color.yellow}, 0 10px 26px rgba(0,0,0,0.6)` : '0 8px 20px rgba(0,0,0,0.55)', opacity: k < n ? 0.8 : 1 }}>
              <CoverArt name={COVERS[11 - k][0]} size={size} reveal={k > n ? 1 : cur ? reveal : 0} mark={k <= n} />
            </div>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.3, color: cur ? '#fff' : 'rgba(239,232,220,0.5)' }}>{k}</span>
            <div style={{ width: size * 0.7, height: Math.max(3, size * 0.05), borderRadius: 3, background: `rgba(${Math.round(120 + 110 * red)}, ${Math.round(110 - 92 * red)}, ${Math.round(110 - 80 * red)}, ${k >= n ? 0.9 : 0.15})`,
              transform: `scaleX(${k > n ? 1 : cur ? ramp(frame, at + 12, at + 30) : 1})` }} />
          </div>
        );
      })}
    </div>
  );
};

// Ondas de la voz reales: barras que muestran los últimos fotogramas de la locución.
export const VoiceBars: React.FC<{ level: (f: number) => number; w: number; h: number; n?: number; c?: string; step?: number }> = ({ level, w, h, n = 36, c = color.yellow, step = 2 }) => {
  const frame = useCurrentFrame();
  const bw = w / n;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: bw * 0.36, width: w, height: h }}>
      {Array.from({ length: n }).map((_, i) => {
        const d = Math.abs(i - (n - 1) / 2); // simétrica: el centro es el instante actual
        const v = level(frame - d * step);
        const jitter = 0.75 + 0.25 * Math.abs(Math.sin(i * 1.7 + frame / 9));
        const hh = Math.max(4, h * Math.min(1, v * jitter * 1.1));
        return <div key={i} style={{ width: bw * 0.64, height: hh, borderRadius: bw, background: c, opacity: 0.35 + 0.65 * Math.min(1, v + 0.15) }} />;
      })}
    </div>
  );
};

// Parpadeo de bombilla que se muere (para salir de una escena): 1 → 0 con caídas.
export const dieFlicker = (frame: number, end: number, len = 18) => {
  const t = frame - (end - len);
  if (t < 0) return 1;
  if (t >= len) return 0;
  const pat = [1, 0.25, 0.95, 0.9, 0.1, 0.05, 0.7, 0.65, 0.2, 0.55, 0.08, 0, 0.3, 0, 0, 0, 0, 0];
  return pat[Math.min(pat.length - 1, Math.floor((t / len) * pat.length))];
};

export const DIGITS_W = 0.56; // ancho aproximado de una cifra en em (Ubuntu Bold con el interletrado del número)

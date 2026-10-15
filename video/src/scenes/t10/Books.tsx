import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS } from '../../lib/vo';
import { Sfx } from '../../components/Sfx';
import { BONE, bookAt, DIM, KickerN, MiniIcon, Narr, RED, Stars, color, font, flicker } from './kit';
import { VIGNETTES } from './Vignettes';
import { FACTS } from './Facts';
import { sceneClock, sceneDef } from './timeline';
import { Ambient, camAt, CamKey, camStyle, COVERS, Cover3D, coverSrc, countTo, DIGITS_W, FearMeter, KWords, lerp, ramp, sceneLevel, shakes, sp, VoiceBars } from './fx';

export const vid = (p: number, k: number) => `X${p}${k}`;
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const hasWord = (vo: string, w: string) => Boolean(VOS[vo]?.words.some((x) => norm(x.w).startsWith(norm(w))));

// Palabras clave de la sinopsis (fase A2), con la palabra de la locución en la que aparece cada una
// y el encuadre de la cámara sobre la viñeta en ese momento (punto de la escena 1920×1080 y zoom).
type Chip = { label: string; word: string; nth?: number; red?: boolean; f: [number, number, number] };
const CHIPS: Record<number, Chip[]> = {
  1: [{ label: 'Los papeles de un muerto', word: 'papeles', f: [760, 600, 1.3] }, { label: 'Un bajorrelieve de arcilla', word: 'bajorrelieve', f: [1130, 500, 1.28] },
    { label: 'Cultos', word: 'cultos', f: [880, 640, 1.42] }, { label: 'Un nombre impronunciable', word: 'nombre', red: true, f: [1390, 300, 1.5] }],
  2: [{ label: 'Un corazón bajo el suelo', word: 'corazón', red: true, f: [1110, 820, 1.42] }, { label: 'Enterrada en vida', word: 'enterrada', f: [960, 620, 1.2] },
    { label: 'Un gato negro', word: 'gato', f: [300, 300, 1.7] }],
  3: [{ label: 'La casa familiar', word: 'casa', f: [1320, 440, 1.22] }, { label: 'Títeres', word: 'títeres', f: [950, 430, 1.38] },
    { label: 'Muñecas', word: 'muñecas', f: [470, 700, 1.55] }, { label: 'Un títere con planes propios', word: 'concreto', red: true, f: [940, 320, 1.7] }],
  4: [{ label: 'Urgencias de un pueblo', word: 'urgencias', f: [1245, 400, 1.6] }, { label: 'Un niño que no es su hijo', word: 'niño', f: [918, 500, 1.75] },
    { label: 'El momento exacto', word: 'exacto', f: [960, 560, 1.15] }, { label: 'Algo en el campo', word: 'campo', red: true, f: [960, 760, 1.35] }],
  5: [{ label: 'Transilvania', word: 'Transilvania', f: [960, 520, 1.15] }, { label: 'Nunca come', word: 'come', f: [900, 430, 1.42] },
    { label: 'Sin reflejo', word: 'espejo', f: [1040, 420, 1.62] }, { label: 'De día, nadie', word: 'día', red: true, f: [1280, 330, 1.35] }],
  6: [{ label: 'Pontevedra', word: 'Pontevedra', f: [600, 700, 1.6] }, { label: 'Solo con su gato', word: 'gato', f: [960, 540, 1.2] },
    { label: 'Un brote en Rusia', word: 'Rusia', f: [1300, 690, 1.62] }, { label: 'Se extiende', word: 'extenderse', red: true, f: [960, 500, 1.32] }],
  7: [{ label: 'Abuela y nieta', word: 'abuela', f: [960, 540, 1.15] }, { label: 'Un niño desaparecido', word: 'desapareciera', f: [960, 380, 1.38] },
    { label: 'Los vecinos murmuran', word: 'murmuran', f: [800, 620, 1.42] }, { label: 'Algo más en la casa', word: 'algo', red: true, f: [1110, 520, 1.7] }],
  8: [{ label: 'Vuelve al pueblo', word: 'vuelve', f: [600, 810, 1.42] }, { label: 'La casa de la colina', word: 'casa', f: [1530, 300, 1.75] },
    { label: 'Unos recién llegados', word: 'recién', f: [1300, 500, 1.3] }, { label: 'Desaparecen… o vuelven', word: 'desaparecer', red: true, f: [460, 860, 1.65] }],
  9: [{ label: 'Plena dictadura', word: 'dictadura', f: [960, 540, 1.15] }, { label: 'Padre e hijo', word: 'padre', f: [960, 720, 1.45] },
    { label: 'Un don', word: 'don', f: [960, 600, 1.25] }, { label: 'La Orden', word: 'Orden', red: true, f: [960, 220, 1.7] }],
  10: [{ label: 'Washington', word: 'Washington', f: [960, 540, 1.12] }, { label: 'Ruidos en el desván', word: 'ruidos', f: [960, 170, 1.65] },
    { label: 'Una voz que no es la suya', word: 'voz', f: [960, 330, 1.42] }, { label: 'Sin explicación', word: 'explicación', red: true, f: [960, 520, 1.28] }],
};
const TITLE_WORD: Record<number, string> = { 1: 'llamada', 2: 'cuentos', 3: 'Cómo', 4: 'Distancia', 5: 'Drácula', 6: 'Apocalipsis', 7: 'Carcoma', 8: 'misterio', 9: 'Nuestra', 10: 'exorcista' };

// Cada palabra del título y del autor entra cuando la voz la dice (si no la dice, poco después de la anterior).
const syncWords = (vo: string, part: number, text: string, from: number, startWord: string) => {
  const v = VOS[vo];
  const ws = text.split(' ');
  if (!v) return ws.map((t, i) => ({ t, at: from + i * 5 }));
  let cur = Math.max(0, v.words.findIndex((w) => norm(w.w).startsWith(norm(startWord))));
  let prev = from - 5;
  return ws.map((t) => {
    const k = norm(t);
    let at = prev + 5;
    if (k) {
      for (let j = cur; j < Math.min(v.words.length, cur + 4); j++) {
        if (norm(v.words[j].w).startsWith(k) || k.startsWith(norm(v.words[j].w))) { at = part + Math.round(v.words[j].s * 50) - 3; cur = j + 1; break; }
      }
    }
    at = Math.max(at, prev + 2);
    prev = at;
    return { t, at };
  });
};

// ———————————————— Tarjeta de una narración (v2: contadores y nombre que entra palabra a palabra) ————————————————
export const NarrCard: React.FC<{ n: Narr; at: number; ratingAt: number; w?: number; compact?: boolean; accent: string; seed: string; dim?: number }> = ({ n, at, ratingAt, w = 900, compact = false, accent, dim = 0 }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 15, 140);
  const k = compact ? 0.82 : 1;
  const sweep = interpolate(frame, [at + 4, at + 34], [0, 1], { ...clamp, easing: easeInOut });
  const pill = (a: number, icon: React.ReactNode, label: string) => {
    const q = sp(frame, a, 13, 220);
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 * k, padding: `${10 * k}px ${22 * k}px ${10 * k}px ${12 * k}px`, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)',
        fontFamily: font.sans, fontWeight: 700, fontSize: 30 * k, color: BONE, opacity: Math.min(1, q * 1.4), transform: `translateY(${((1 - q) * 22).toFixed(1)}px) scale(${(0.8 + 0.2 * q).toFixed(3)})`, whiteSpace: 'nowrap' }}>
        <span style={{ width: 44 * k, height: 44 * k, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>{label}
      </span>
    );
  };
  const nameWords = n.who.split(' ').map((t, i) => ({ t, at: at + 6 + i * 3 }));
  const stars = interpolate(frame, [ratingAt, ratingAt + 26], [0, n.rating], { ...clamp, easing: easeOut });
  const pop = sp(frame, ratingAt + 24, 9, 260);
  return (
    <div style={{ width: w, padding: `${34 * k}px ${44 * k}px ${38 * k}px`, borderRadius: 28, background: 'rgba(12,13,16,0.88)', border: '1px solid rgba(255,255,255,0.13)', boxShadow: '0 40px 110px rgba(0,0,0,0.6)',
      opacity: Math.min(1, s * 1.3) * (1 - 0.45 * dim), transform: `perspective(1600px) translateX(${((1 - s) * 140).toFixed(1)}px) rotateY(${((1 - s) * -24).toFixed(2)}deg) scale(${(1 - 0.04 * dim).toFixed(3)})`, transformOrigin: '100% 50%',
      position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: accent }} />
      {sweep > 0 && sweep < 1 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${(sweep * 140 - 40).toFixed(1)}%, rgba(255,255,255,0.09) ${(sweep * 140 - 25).toFixed(1)}%, rgba(255,255,255,0) ${(sweep * 140 - 10).toFixed(1)}%)` }} />}
      {n.label && <KickerN at={at + 4} text={n.label} style={{ fontSize: 22 * k, marginBottom: 14 * k }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 * k }}>
        <span style={{ width: 82 * k, height: 82 * k, borderRadius: '50%', background: 'rgba(255,202,5,0.14)', border: `2px solid ${color.yellow}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transform: `scale(${(0.6 + 0.4 * sp(frame, at + 2, 10, 220)).toFixed(3)})` }}>
          <MiniIcon kind="mic" size={42 * k} c={color.yellow} />
        </span>
        <div style={{ minWidth: 0 }}>
          <KWords words={nameWords} size={(n.who.length > 26 ? 44 : 58) * k} color="#fff" />
          {n.sub && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * k, color: DIM, marginTop: 6, opacity: ramp(frame, at + 14, at + 26) }}>{n.sub}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14 * k, marginTop: 24 * k, flexWrap: 'wrap' }}>
        {pill(at + 12, <MiniIcon kind="clock" size={26 * k} />, n.dur)}
        {pill(at + 18, <MiniIcon kind="globe" size={26 * k} />, n.voice)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 * k, marginTop: 22 * k, opacity: ramp(frame, ratingAt - 4, ratingAt + 6) }}>
        <Stars value={Math.max(0.001, stars)} size={38 * k} at={ratingAt} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46 * k, color: '#fff', display: 'inline-block', minWidth: 70 * k, transform: `scale(${(1 + 0.18 * pop * (1 - ramp(frame, ratingAt + 30, ratingAt + 44))).toFixed(3)})` }}>
          {countTo(frame, ratingAt, 26, n.rating, 1)}
        </span>
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * k, color: DIM }}>{countTo(frame, ratingAt + 4, 30, n.votes, 0)} valoraciones de la narración · {n.source}</span>
      </div>
      <div style={{ marginTop: 22 * k }}><PlatsPop names={n.plats} at={at + 28} size={26 * k} /></div>
    </div>
  );
};

// Plataformas que caen en cascada.
const PlatsPop: React.FC<{ names: string[]; at: number; size: number }> = ({ names, at, size }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: size * 0.45 }}>
      {names.map((nm, i) => {
        const s = sp(frame, at + i * 4, 12, 230);
        return (
          <span key={nm} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, padding: `${size * 0.32}px ${size * 0.72}px`, borderRadius: 999, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.08)', color: BONE,
            border: '1px solid rgba(255,255,255,0.16)', opacity: Math.min(1, s * 1.5), transform: `translateY(${((1 - s) * -26).toFixed(1)}px) rotate(${((1 - s) * (i % 2 ? 8 : -8)).toFixed(2)}deg) scale(${(0.8 + 0.2 * s).toFixed(3)})`,
            display: 'inline-flex', alignItems: 'center', gap: size * 0.4 }}>
            <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: '50%', background: color.yellow }} />{nm}
          </span>
        );
      })}
    </div>
  );
};

// Número de la cuenta atrás (v2): golpe con separación de color y destello; luego se encoge sobre el título.
const SlamNum: React.FC<{ n: number; at: number; move: number; to: [number, number, number]; beats?: number[] }> = ({ n, at, move, to, beats = [] }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const hit = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: easeOut });
  const split = (1 - ramp(frame, at, at + 16, easeOut)) * 34;
  const m = ramp(frame, move - 14, move + 10, easeInOut);
  // latido: el número se hincha con cada golpe del corazón mientras espera el título
  const pulse = Math.max(0, ...beats.map((bt) => (frame >= bt - 2 ? Math.exp(-Math.max(0, frame - bt) / 6) * Math.min(1, (frame - bt + 3) / 3) : 0)));
  const size = lerp(720 * (1 + 0.07 * ramp(frame, at + 8, move - 14)) * (1 + 0.06 * pulse), to[2], m) * (1.7 - 0.7 * hit);
  const x = lerp(960, to[0], m);
  const y = lerp(540, to[1], m);
  const lit = interpolate(frame, [at + 1, at + 4, at + 6, at + 9, at + 12], [0.4, 1, 0.3, 1, 1], clamp) * flicker(frame, `num${n}`, 0.35);
  const base: React.CSSProperties = { position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.06, whiteSpace: 'nowrap' };
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -52%)', opacity: Math.min(1, hit * 2) }}>
      <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.06, color: 'transparent', whiteSpace: 'nowrap' }}>{n}
        {split > 0.5 && <span style={{ ...base, color: `rgba(255,40,60,${(0.55 * (split / 34)).toFixed(3)})`, transform: `translate(${(-split).toFixed(1)}px, ${(split * 0.3).toFixed(1)}px)`, mixBlendMode: 'screen' }}>{n}</span>}
        {split > 0.5 && <span style={{ ...base, color: `rgba(60,200,255,${(0.55 * (split / 34)).toFixed(3)})`, transform: `translate(${split.toFixed(1)}px, ${(-split * 0.3).toFixed(1)}px)`, mixBlendMode: 'screen' }}>{n}</span>}
        <span style={{ ...base, color: 'transparent', WebkitTextStroke: `${Math.max(2, size * 0.006)}px rgba(239,232,220,0.4)` }}>{n}</span>
        <span style={{ ...base, color: n === 1 ? '#F4ECE0' : BONE, opacity: lit, textShadow: `0 0 ${(size * (0.08 + 0.06 * pulse)).toFixed(0)}px rgba(${n === 1 ? '255,90,90' : '255,220,140'},${(0.4 * lit + 0.35 * pulse).toFixed(3)})` }}>{n}</span>
      </div>
    </div>
  );
};

export const BookScene: React.FC<{ p: number }> = ({ p }) => {
  const frame = useCurrentFrame();
  const id = `B${p}`;
  const def = sceneDef(id);
  const c = sceneClock(id);
  const b = bookAt(p);
  const V = VIGNETTES[p];
  const Fact = FACTS[p];
  const covers = COVERS[p];
  const main = covers[0];
  const v1 = vid(p, 1);
  const v2 = vid(p, 2);
  const fNum = 4;
  const fWord = c.at(v1, 'Número');
  const fTitle = c.at(v1, TITLE_WORD[p]);
  const fA2 = c.part(v2) - 10;
  const fB = c.part(def.phases!.b) - 12;
  const fC = c.part(def.phases!.c) - 12;
  const narrIds = def.vo.map((v) => v.id).slice(def.vo.findIndex((v) => v.id === def.phases!.c));
  const last = p === 10 ? c.part('X105') : c.dur + 100;
  const level = (f: number) => sceneLevel(id, f);

  const a2 = ramp(frame, fA2 - 6, fA2 + 12, easeInOut);
  const bIn = ramp(frame, fB - 4, fB + 16);
  const cIn = ramp(frame, fC - 4, fC + 14);
  const off = ramp(frame, last + 2, last + 12, easeOut);

  // ——— A1: número → cae la portada → título ———
  const drop = sp(frame, fTitle - 12, 12, 110, 1.1);
  const land = fTitle + 2;
  const cam1 = shakes(frame, [{ at: fNum + 1, amp: 22, dur: 18 }, { at: land, amp: 12, dur: 14 }], `a1${p}`);
  const push1 = 1 + 0.06 * ramp(frame, 0, fA2, easeInOut);
  const zoomThrough = ramp(frame, fA2 - 8, fA2 + 10, (t) => t * t * t);
  const titleWords = syncWords(v1, c.part(v1), b.title, fTitle - 2, TITLE_WORD[p]);
  const authorWords = syncWords(v1, c.part(v1), b.author, titleWords[titleWords.length - 1].at + 6, b.author.split(' ')[0]);
  const digits = String(b.n).length;
  const numTo: [number, number, number] = [1010 + 230 * DIGITS_W * digits * 0.5 * 1.0, 250, 230];
  const flash = interpolate(frame, [fNum, fNum + 2, fNum + 10], [0, 1, 0], clamp);
  const coverIn = ramp(frame, fTitle - 12, fTitle + 6);
  // latidos (sk_heart golpea 41 fotogramas después de empezar): uno o dos antes de que caiga la portada
  const beats = [fNum + 2 + 41, fNum + 2 + 41 + 46].filter((bt) => bt < fTitle - 14);

  // ——— A2 y B: viñeta con cámara ———
  const chips = CHIPS[p].map((ch) => ({ ...ch, at: c.at(v2, ch.word, ch.nth ?? 0) }));
  const keys: CamKey[] = [
    { at: fA2 - 10, fx: 960, fy: 540, s: 1.08 },
    ...chips.map((ch) => ({ at: ch.at - 8, fx: ch.f[0], fy: ch.f[1], s: ch.f[2], r: ch.red ? -1.2 : (ch.at % 2 ? 0.6 : -0.6), dur: ch.red ? 12 : 20 })),
    { at: fB - 6, fx: 960, fy: 540, s: 1.12, dur: 40 },
  ];
  const cam = camAt(frame, keys);
  const redAt = chips.find((ch) => ch.red)?.at ?? -999;
  const camShake = shakes(frame, [{ at: redAt, amp: 16, dur: 18 }], `rd${p}`);
  const redFlash = interpolate(frame, [redAt - 1, redAt + 1, redAt + 14], [0, 1, 0], clamp);
  const throughIn = 1 + 0.35 * (1 - a2);

  // ——— C: narración ———
  const cards = b.narr.length;
  const cardAt = (i: number) => {
    if (p === 8 && i === 0) return c.at('X84', 'Xavi') - 12;
    if (i === 0) return fC + 10;
    return c.part(narrIds[i]) - 8;
  };
  const ratingAtFor = (i: number) => {
    const vo = narrIds[Math.min(i, narrIds.length - 1)];
    if (p === 8) return c.at('X85', 'cuatro') - 6;
    if (p === 6 && i === 1) return cardAt(1) + 26;
    return hasWord(vo, 'coma') ? c.at(vo, 'cuatro') - 6 : cardAt(i) + 24;
  };
  const kingNote = p === 8 ? c.part('X84') : -1;
  const second = cards > 1 ? sp(frame, cardAt(1) - 6, 14, 120) : 0;
  const active = cards > 1 && frame >= cardAt(1) - 6 ? 1 : 0;
  const cv = sp(frame, fC - 2, 14, 100);
  const lv = level(frame);

  // ——— Cabecera pequeña (A2/B) ———
  const head = sp(frame, fA2 + 4, 15, 160);

  return (
    <AbsoluteFill style={{ background: '#030304' }}>
      {/* ——— A1 ——— */}
      {a2 < 1 && (
        <AbsoluteFill>
          <Ambient name={main} opacity={coverIn} dark={0.5} seed={`a${p}`} red={0.9}>
            {/* haz de linterna que barre detrás del número antes de que caiga la portada */}
            {coverIn < 1 && (
              <div style={{ position: 'absolute', left: interpolate(frame, [fNum, fTitle + 10], [150, 1500], clamp) - 520, top: 20, width: 1040, height: 1040, borderRadius: '50%', opacity: (1 - coverIn) * ramp(frame, fNum + 4, fNum + 20),
                background: 'radial-gradient(circle, rgba(255,220,140,0.26) 0%, rgba(255,220,140,0.09) 40%, rgba(255,220,140,0) 66%)' }} />
            )}
            <AbsoluteFill style={{ transform: `translate(${cam1.x.toFixed(2)}px, ${cam1.y.toFixed(2)}px) rotate(${cam1.r.toFixed(3)}deg) scale(${push1.toFixed(4)})` }}>
              {/* portada que cae y luego atraviesa la cámara */}
              <div style={{ position: 'absolute', left: 250, top: 200, transform: `translateY(${((1 - drop) * -820).toFixed(1)}px) scale(${(1 + 2.4 * zoomThrough).toFixed(4)})`, transformOrigin: '50% 50%',
                opacity: Math.min(1, drop * 4) * (1 - zoomThrough) }}>
                <Cover3D name={main} size={600} rx={(1 - drop) * -55 + Math.sin(frame / 90) * 2.5} ry={16 + Math.sin(frame / 70) * 5} rz={(1 - drop) * 8}
                  shine={interpolate(frame, [land + 4, land + 46], [0, 1.2], clamp)} reflect glow={coverIn * (0.6 + 0.4 * flicker(frame, `g${p}`, 0.6))} glowColor="rgba(255,214,140," />
              </div>
              {/* número */}
              {frame < fA2 + 4 && <div style={{ opacity: 1 - zoomThrough }}><SlamNum n={b.n} at={fNum} move={fTitle} to={numTo} beats={beats} /></div>}
              {/* título y autor */}
              <div style={{ position: 'absolute', left: 1000, top: 380, width: 790, opacity: 1 - zoomThrough, transform: `translateX(${(-zoomThrough * 80).toFixed(1)}px)` }}>
                <KickerN at={fTitle - 4} text={`Número ${b.n} de 10`} />
                <div style={{ marginTop: 18 }}>
                  <KWords words={titleWords} size={b.title.length > 20 ? 84 : b.title.length > 12 ? 100 : 124} color={BONE} lh={1.02} />
                </div>
                <div style={{ marginTop: 18 }}>
                  <KWords words={authorWords.map((w, i) => ({ ...w, t: i === authorWords.length - 1 && b.year ? `${w.t} · ${b.year}` : w.t }))} size={42} weight={500} color={DIM} />
                </div>
              </div>
            </AbsoluteFill>
            <FearMeter n={b.n} at={fNum + 8} out={fA2 - 4} x={1430} y={1000} />
          </Ambient>
          {flash > 0 && <AbsoluteFill style={{ background: p === 10 ? `rgba(193,18,31,${(0.35 * flash).toFixed(3)})` : `rgba(255,236,210,${(0.22 * flash).toFixed(3)})` }} />}
        </AbsoluteFill>
      )}

      {/* ——— A2 y B: viñeta ——— */}
      {a2 > 0 && cIn < 1 && (
        <AbsoluteFill style={{ opacity: a2 }}>
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <AbsoluteFill style={camStyle({ ...cam, s: cam.s * throughIn }, camShake)}>
              <V t0={fA2} />
            </AbsoluteFill>
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `rgba(0,0,0,${(0.5 * bIn).toFixed(3)})` }} />
          {redFlash > 0 && <AbsoluteFill style={{ background: `rgba(193,18,31,${(0.28 * redFlash).toFixed(3)})`, mixBlendMode: 'screen' }} />}
          {/* cabecera: portada pequeña, número y título */}
          <div style={{ position: 'absolute', left: 80, top: 62, display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, head * 1.4) * (1 - bIn * 0.5), transform: `translateX(${((1 - head) * -80).toFixed(1)}px)` }}>
            <div style={{ position: 'relative' }}>
              <Img src={coverSrc(main)} style={{ width: 112, height: 112, borderRadius: 8, display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }} />
              <span style={{ position: 'absolute', right: -16, top: -14, minWidth: 50, height: 50, borderRadius: 999, background: p === 10 ? RED : color.yellow, color: p === 10 ? '#fff' : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 28,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', boxShadow: '0 6px 16px rgba(0,0,0,0.5)' }}>{b.n}</span>
            </div>
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}>{b.title}</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: DIM, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>{b.author}</div>
            </div>
          </div>
          {/* subtítulos clave, uno cada vez */}
          {bIn < 1 && <Captions items={chips} end={fB} accent={b.accent} />}
          {/* el dato (B) */}
          {bIn > 0 && <Swing at={fB + 2} out={fC}><Fact at={fB + 6} c={c} /></Swing>}
        </AbsoluteFill>
      )}

      {/* ——— C: la narración ——— */}
      {cIn > 0 && (
        <AbsoluteFill style={{ opacity: cIn }}>
          <AbsoluteFill>
            <Ambient name={main} name2={covers[1]} mix={cards > 1 ? ramp(frame, cardAt(1) - 6, cardAt(1) + 20) : 0} opacity={1} dark={0.52} seed={`c${p}`} red={0.7}>
              {/* portadas */}
              {cards === 1 ? (
                <div style={{ position: 'absolute', left: 230, top: 190, transform: `translateX(${((1 - cv) * -620).toFixed(1)}px)` }}>
                  <Cover3D name={main} size={560} ry={(1 - cv) * 70 + 14 + Math.sin(frame / 80) * 6} rx={Math.sin(frame / 95) * 3} rz={(1 - cv) * -6}
                    glow={0.35 + 0.9 * lv} glowColor={hexA(b.accent)} shine={interpolate(frame, [fC + 6, fC + 40], [0, 1.2], clamp)} />
                </div>
              ) : (
                <>
                  <div style={{ position: 'absolute', left: lerp(230, 110, second), top: lerp(190, 170, second), zIndex: active ? 1 : 3,
                    transform: `translateX(${((1 - cv) * -620).toFixed(1)}px) scale(${lerp(1, 0.8, second).toFixed(4)})`, transformOrigin: '0 0' }}>
                    <Cover3D name={covers[0]} size={560} ry={(1 - cv) * 70 + 14 + 8 * second + Math.sin(frame / 80) * 5} rx={Math.sin(frame / 95) * 3} light={1 - 0.45 * second}
                      glow={active ? 0 : 0.35 + 0.9 * lv} glowColor={hexA(b.accent)} shine={interpolate(frame, [fC + 6, fC + 40], [0, 1.2], clamp)} />
                  </div>
                  {second > 0.001 && (
                    <div style={{ position: 'absolute', left: lerp(900, 330, second), top: lerp(520, 330, second), zIndex: 4, opacity: Math.min(1, second * 2),
                      transform: `scale(${lerp(0.6, 0.86, second).toFixed(4)})`, transformOrigin: '0 0' }}>
                      <Cover3D name={covers[1]} size={560} ry={(1 - second) * -60 + 10 + Math.sin(frame / 76) * 5} rx={Math.sin(frame / 88) * 3} rz={(1 - second) * 10}
                        glow={0.35 + 0.9 * lv} glowColor={hexA(b.accent)} shine={interpolate(frame, [cardAt(1) + 4, cardAt(1) + 40], [0, 1.2], clamp)} />
                    </div>
                  )}
                </>
              )}
              {/* la voz */}
              <div style={{ position: 'absolute', left: cards > 1 ? 150 : 230, top: 860, width: 560, opacity: ramp(frame, fC + 4, fC + 20) }}>
                <VoiceBars level={level} w={cards > 1 ? 620 : 560} h={86} n={34} c={color.yellow} />
              </div>
              {/* tarjetas */}
              <div style={{ position: 'absolute', left: 860, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                <KickerN at={fC + 4} text={cards > 1 ? 'Cómo escucharlo' : 'La narración que tienes que escuchar'} />
                {p === 8 && (
                  <div style={{ opacity: ramp(frame, kingNote, kingNote + 14) * (1 - 0.55 * ramp(frame, cardAt(0) - 6, cardAt(0) + 10)), fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: BONE,
                    display: 'flex', alignItems: 'center', gap: 16 }}>
                    {['«It»', '«El resplandor»'].map((t, i) => {
                      const q = sp(frame, kingNote + 4 + i * 5, 12, 220);
                      return <span key={t} style={{ padding: '8px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', opacity: q, transform: `scale(${(0.7 + 0.3 * q).toFixed(3)})`, display: 'inline-block' }}>{t}</span>;
                    })}
                    <span style={{ color: DIM, fontWeight: 500 }}>en español, solo con voz latina</span>
                  </div>
                )}
                {b.narr.map((n, i) => (
                  <NarrCard key={i} n={n} at={cardAt(i)} ratingAt={ratingAtFor(i)} compact={cards > 1} w={cards > 1 ? 980 : 960} accent={b.accent} seed={`${id}-${i}`}
                    dim={cards > 1 && i === 0 ? ramp(frame, cardAt(1) - 4, cardAt(1) + 10) : 0} />
                ))}
              </div>
            </Ambient>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* final del n.º 1: se apaga todo */}
      {p === 10 && off > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${off})`, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 130, color: RED, opacity: ramp(frame, c.at('X105', 'Si') - 4, c.at('X105', 'Si') + 12) * flicker(frame, 'atreves', 0.8),
            textShadow: '0 0 60px rgba(193,18,31,0.45)', transform: `scale(${(1 + 0.04 * ramp(frame, c.at('X105', 'Si'), c.dur)).toFixed(4)})` }}>Si te atreves.</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: DIM, marginTop: 30, opacity: ramp(frame, c.at('X105', 'Escúchalo') - 4, c.at('X105', 'Escúchalo') + 14) }}>Escúchalo de noche</div>
        </AbsoluteFill>
      )}

      {/* —— Sonido —— */}
      <Sfx name={p === 10 ? 'bass_drop' : 'sk_heart'} at={fNum + 2} volume={p === 10 ? 0.9 : 0.8} />
      {p === 10 && <Sfx name="sk_heart" at={fNum + 2} volume={0.8} />}
      {beats.length > 1 && <Sfx name="sk_heart" at={beats[1] - 41} volume={0.7} />}
      <Sfx name="impact" at={fNum + 1} volume={0.35} />
      <Sfx name="whoosh_deep" at={fWord} volume={0.45} />
      <Sfx name="whoosh_fast" at={fTitle - 10} volume={0.5} />
      <Sfx name="sk_book_thud" at={land} volume={0.45} />
      <Sfx name="whoosh_deep" at={fA2 + 2} volume={0.6} />
      {chips.map((ch, i) => <Sfx key={i} name="tick_soft" at={ch.at} volume={0.75} />)}
      {chips.map((ch, i) => (i > 0 ? <Sfx key={`w${i}`} name="whoosh_soft" at={ch.at - 6} volume={0.22} /> : null))}
      <Sfx name="impact" at={redAt} volume={0.4} />
      <Sfx name={p === 3 || p === 10 || p === 2 ? 'page_turn' : 'card_flip'} at={fB + 6} volume={0.7} />
      <Sfx name="whoosh_fast" at={fC - 2} volume={0.45} />
      <Sfx name="click" at={fC + 4} volume={0.5} />
      {b.narr.map((_, i) => <Sfx key={`n${i}`} name="snap_in" at={cardAt(i)} volume={0.7} />)}
      {b.narr.map((_, i) => <Sfx key={`r${i}`} name="counter" at={ratingAtFor(i)} volume={0.35} />)}
      {cards > 1 && <Sfx name="swipe" at={cardAt(1) - 4} volume={0.5} />}
      {VIG_SFX[p]?.(fA2, c)}
      {FACT_SFX[p]?.(fB, c)}
      {p !== 10 && <Sfx name="click" at={c.dur - 16} volume={0.35} />}
      {p === 10 && <><Sfx name="click" at={last + 4} volume={0.8} /><Sfx name="sk_heart" at={c.at('X105', 'Si')} volume={0.9} /><Sfx name="whoosh_deep" at={c.at('X105', 'Si') - 2} volume={0.6} /></>}
    </AbsoluteFill>
  );
};

const hexA = (hex: string) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},`;
};

// Subtítulo clave grande, abajo y en el centro; el anterior sale hacia arriba.
const Captions: React.FC<{ items: { label: string; at: number; red?: boolean }[]; end: number; accent: string }> = ({ items, end, accent }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {items.map((it, i) => {
        const next = items[i + 1]?.at ?? end;
        if (frame < it.at - 3 || frame > next + 10) return null;
        const s = sp(frame, it.at - 2, it.red ? 9 : 13, it.red ? 260 : 200);
        const o = ramp(frame, next - 5, next + 3);
        const sh = it.red ? shakes(frame, [{ at: it.at, amp: 9, dur: 14 }], `cap${i}`) : { x: 0, y: 0, r: 0 };
        return (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center',
            transform: `translate(${sh.x.toFixed(1)}px, ${((1 - s) * 50 - o * 110 + sh.y).toFixed(1)}px) scale(${(((it.red ? 1.35 : 1.15) - (it.red ? 0.35 : 0.15) * s) * (1 - 0.2 * o)).toFixed(3)}) rotate(${(sh.r * 2).toFixed(2)}deg)`, opacity: Math.min(1, s * 1.5) * (1 - o) }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 66, letterSpacing: -1, padding: '16px 38px', borderRadius: 18, whiteSpace: 'nowrap', color: '#fff',
              background: it.red ? RED : 'rgba(6,7,9,0.8)', borderLeft: it.red ? 'none' : `8px solid ${accent}`, boxShadow: it.red ? '0 0 60px rgba(193,18,31,0.55), 0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.5)' }}>
              {it.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// El dato entra girando en 3D, flota mientras se habla y sale de lado cuando llega la narración.
const Swing: React.FC<{ at: number; out: number; children: React.ReactNode }> = ({ at, out, children }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 15, 110);
  const o = ramp(frame, out - 6, out + 10, (t) => t * t);
  const hold = ramp(frame, at, out, easeInOut);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ opacity: Math.min(1, s * 1.6) * (1 - o),
        transform: `translateY(${((1 - s) * 180).toFixed(1)}px) translateX(${(-o * 260).toFixed(1)}px) rotateX(${((1 - s) * 34 + Math.cos(frame / 90) * 1.6).toFixed(2)}deg) rotateY(${(Math.sin(frame / 75) * 2.4 - o * 55).toFixed(2)}deg) scale(${(0.88 + 0.12 * s + 0.03 * hold).toFixed(4)})` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Clock = ReturnType<typeof sceneClock>;
// Sonido propio de cada viñeta (t0 = inicio de la fase A2).
const VIG_SFX: Record<number, (t0: number, c: Clock) => React.ReactNode> = {
  2: (t0) => <>{Array.from({ length: 8 }).map((_, i) => <Sfx key={i} name="sk_heart" at={t0 + i * 56} volume={0.55} />)}</>,
  5: (t0) => <Sfx name="sk_wind" at={t0 + 4} volume={0.7} />,
  7: (t0) => <Sfx name="sk_door" at={t0 + 140} volume={0.8} />,
  8: (t0) => <Sfx name="sk_wind" at={t0 + 4} volume={0.55} />,
  10: (t0) => <><Sfx name="sk_thunder" at={t0 + 180} volume={0.9} /><Sfx name="sk_thunder" at={t0 + 470} volume={0.7} /></>,
};
const FACT_SFX: Record<number, (fB: number, c: Clock) => React.ReactNode> = {
  5: (_fB, c) => <><Sfx name="sk_projector" at={c.at('X53', 'Nosferatu') - 8} volume={0.5} /><Sfx name="stamp" at={c.at('X53', 'permiso')} volume={0.9} /></>,
  4: (_fB, c) => <>{['Shirley', 'finalista', 'Netflix'].map((w) => <Sfx key={w} name="ui_pop" at={c.at('X43', w) - 4} volume={0.7} />)}</>,
  9: (_fB, c) => <Sfx name="sparkle" at={c.at('X93', 'Herralde') - 6} volume={0.6} />,
  7: (_fB, c) => <Sfx name="sk_book_thud" at={c.at('X73', 'agotado')} volume={0.6} />,
};

export const B1: React.FC = () => <BookScene p={1} />;
export const B2: React.FC = () => <BookScene p={2} />;
export const B3: React.FC = () => <BookScene p={3} />;
export const B4: React.FC = () => <BookScene p={4} />;
export const B5: React.FC = () => <BookScene p={5} />;
export const B6: React.FC = () => <BookScene p={6} />;
export const B7: React.FC = () => <BookScene p={7} />;
export const B8: React.FC = () => <BookScene p={8} />;
export const B9: React.FC = () => <BookScene p={9} />;
export const B10: React.FC = () => <BookScene p={10} />;

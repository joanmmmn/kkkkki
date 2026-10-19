import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS } from '../../lib/vo';
import { Sfx } from '../../components/Sfx';
import { BONE, bookAt, DIM, KickerN, MiniIcon, Narr, RED, Stars, color, font, flicker, ocen } from './kit';
import { BEATS, DIORAMAS } from './Dioramas';
import { FACTS } from './Facts';
import { sceneClock, sceneDef } from './timeline';
import { Ambient, camAt, CamKey, camStyle, COVERS, Cover3D, CoverStrip, coverSrc, countTo, DIGITS_W, KWords, lerp, ramp, shakes, sp } from './fx';

export const vid = (p: number, k: number) => `X${p}${k}`;
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Palabras clave de la sinopsis (fase A2) y encuadres de cámara: BEATS en Dioramas.tsx (v5).
// Palabra de la locución X?1 con la que cae la portada (como se dice: en `say` «Zew Ktulu», «Edgar Alan Pou»…).
const TITLE_WORD: Record<number, string> = { 1: 'Zew', 2: 'Edgar', 3: 'Jak', 4: 'Dziecko', 5: 'Drakula', 6: 'Inkub', 7: 'Dom', 8: 'Miasteczko', 9: 'Manitou', 10: 'Nie' };

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
        {n.extra && pill(at + 18, <MiniIcon kind="globe" size={26 * k} />, n.extra)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 * k, marginTop: 22 * k, opacity: ramp(frame, ratingAt - 4, ratingAt + 6) }}>
        <Stars value={Math.max(0.001, stars)} size={38 * k} at={ratingAt} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46 * k, color: '#fff', display: 'inline-block', minWidth: 70 * k, transform: `scale(${(1 + 0.18 * pop * (1 - ramp(frame, ratingAt + 30, ratingAt + 44))).toFixed(3)})` }}>
          {countTo(frame, ratingAt, 26, n.rating, 1)}
        </span>
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * k, color: DIM }}>{countTo(frame, ratingAt + 4, 30, n.votes, 0)} {ocen(n.votes)} · {n.source}</span>
      </div>
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
  const V = DIORAMAS[p];
  const Fact = FACTS[p];
  const covers = COVERS[p];
  const main = covers[0];
  const v1 = vid(p, 1);
  const v2 = vid(p, 2);
  const fNum = 4;
  const fWord = c.at(v1, 'Numer');
  const fTitle = c.at(v1, TITLE_WORD[p]);
  const fA2 = c.part(v2) - 10;
  const fB = c.part(def.phases!.b) - 12;
  // v6: sin fase C (la narración) — el libro acaba en el dato con la minitarjeta; lo de escucharla va al final del vídeo (POSŁUCHAJ).
  const fC = c.dur + 1000;
  const last = p === 10 ? c.part('X105') : c.dur + 100;

  const a2 = ramp(frame, fA2 - 6, fA2 + 12, easeInOut);
  const bIn = ramp(frame, fB - 4, fB + 16);
  const off = ramp(frame, last + 2, last + 12, easeOut);

  // ——— A1: número → cae la portada → título ———
  const drop = sp(frame, fTitle - 12, 12, 110, 1.1);
  const land = fTitle + 2;
  const cam1 = shakes(frame, [{ at: fNum + 1, amp: 22, dur: 18 }, { at: land, amp: 12, dur: 14 }, { at: fTitle + 30, amp: 7, dur: 12 }], `a1${p}`);
  const push1 = 1 + 0.06 * ramp(frame, 0, fA2, easeInOut);
  const zoomThrough = ramp(frame, fA2 - 8, fA2 + 10, (t) => t * t * t);
  const titleWords = syncWords(v1, c.part(v1), b.title, fTitle - 2, TITLE_WORD[p]);
  const authorWords = syncWords(v1, c.part(v1), b.author, titleWords[titleWords.length - 1].at + 6, b.author.split(' ')[0]);
  const digits = String(b.n).length;
  const numTo: [number, number, number] = [1010 + 230 * DIGITS_W * digits * 0.5 * 1.0, 250, 230];
  const flash = interpolate(frame, [fNum, fNum + 2, fNum + 10], [0, 1, 0], clamp);
  const coverIn = ramp(frame, fTitle - 12, fTitle + 6);
  // la portada cae censurada y se descensura mientras la voz dice el título
  const revA = fTitle + 4;
  const revB = fTitle + 30;
  const reveal = interpolate(frame, [revA, revB], [0, 1], clamp);
  const revealHit = interpolate(frame, [revB - 1, revB + 1, revB + 12], [0, 1, 0], clamp);
  // latidos (sk_heart golpea 41 fotogramas después de empezar): uno o dos antes de que caiga la portada
  const beats = [fNum + 2 + 41, fNum + 2 + 41 + 46].filter((bt) => bt < fTitle - 14);

  // ——— A2 y B: viñeta con cámara ———
  const chips = BEATS[p].map((ch) => ({ ...ch, at: c.at(v2, ch.word, ch.nth ?? 0) }));
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

  const miniAt = c.voEnd(def.phases!.b) - 75;

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
                <Cover3D name={main} size={600} rx={(1 - drop) * -55 + Math.sin(frame / 90) * 2.5} ry={16 + Math.sin(frame / 70) * 5} rz={(1 - drop) * 8} reveal={reveal}
                  shine={interpolate(frame, [revB - 2, revB + 36], [0, 1.2], clamp)} reflect glow={coverIn * (0.6 + 0.4 * flicker(frame, `g${p}`, 0.6)) + 0.8 * revealHit} glowColor="rgba(255,214,140," />
              </div>
              {/* número */}
              {frame < fA2 + 4 && <div style={{ opacity: 1 - zoomThrough }}><SlamNum n={b.n} at={fNum} move={fTitle} to={numTo} beats={beats} /></div>}
              {/* título y autor */}
              <div style={{ position: 'absolute', left: 1000, top: 380, width: 790, opacity: 1 - zoomThrough, transform: `translateX(${(-zoomThrough * 80).toFixed(1)}px)` }}>
                <KickerN at={fTitle - 4} text={`Numer ${b.n} z 10`} />
                <div style={{ marginTop: 18 }}>
                  <KWords words={titleWords} size={b.title.length > 20 ? 84 : b.title.length > 12 ? 100 : 124} color={BONE} lh={1.02} />
                </div>
                <div style={{ marginTop: 18 }}>
                  <KWords words={authorWords.map((w, i) => ({ ...w, t: i === authorWords.length - 1 && b.year ? `${w.t} · ${b.year}` : w.t }))} size={42} weight={500} color={DIM} />
                </div>
              </div>
            </AbsoluteFill>
            <CoverStrip n={b.n} at={fNum + 8} out={fA2 - 4} reveal={reveal} x={1430} y={968} size={68} />
          </Ambient>
          {flash > 0 && <AbsoluteFill style={{ background: p === 10 ? `rgba(193,18,31,${(0.35 * flash).toFixed(3)})` : `rgba(255,236,210,${(0.22 * flash).toFixed(3)})` }} />}
        </AbsoluteFill>
      )}

      {/* ——— A2 y B: viñeta ——— */}
      {a2 > 0 && (
        <AbsoluteFill style={{ opacity: a2 }}>
          {/* en el dato, la ilustración se desenfoca un poco: nada del fondo compite con el texto */}
          <AbsoluteFill style={{ overflow: 'hidden', filter: bIn > 0.01 ? `blur(${(5 * bIn).toFixed(2)}px)` : undefined }}>
            <AbsoluteFill style={camStyle({ ...cam, s: cam.s * throughIn }, camShake)}>
              <V t0={fA2} beats={chips.map((ch) => ch.at)} />
            </AbsoluteFill>
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `rgba(0,0,0,${(0.62 * bIn).toFixed(3)})` }} />
          {redFlash > 0 && <AbsoluteFill style={{ background: `rgba(193,18,31,${(0.28 * redFlash).toFixed(3)})`, mixBlendMode: 'screen' }} />}
          {/* cabecera: portada pequeña, número y título */}
          {/* cabecera sobre fondo oscuro: el título blanco no se pierde cuando pasa algo claro por detrás (marionetas, luces) */}
          <div style={{ position: 'absolute', left: 64, top: 50, display: 'flex', alignItems: 'center', gap: 22, padding: '12px 28px 12px 14px', borderRadius: 18, background: 'rgba(6,7,9,0.68)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            opacity: Math.min(1, head * 1.4) * (1 - bIn * 0.5), transform: `translateX(${((1 - head) * -80).toFixed(1)}px)` }}>
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

      {/* minitarjeta al final de cada libro (dossier): «Posłuchaj · sonorbooks.pl» solo en los tres que tienen ficha allí; Poe, gratis en Wolne Lektury;
          los demás, «Gdzie posłuchać · link w opisie». */}
      {frame >= miniAt - 2 && <ListenCard at={miniAt} kind={b.sb ? 'sb' : p === 2 ? 'free' : 'where'} out={p === 10 ? last : c.dur - 18} />}

      {/* final del n.º 1: se apaga todo */}
      {p === 10 && off > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${off})`, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 130, color: RED, opacity: ramp(frame, c.at('X105', 'Jeśli') - 4, c.at('X105', 'Jeśli') + 12) * flicker(frame, 'atreves', 0.8),
            textShadow: '0 0 60px rgba(193,18,31,0.45)', transform: `scale(${(1 + 0.04 * ramp(frame, c.at('X105', 'Jeśli'), c.dur)).toFixed(4)})` }}>Jeśli się odważysz.</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: DIM, marginTop: 30, opacity: ramp(frame, c.at('X105', 'Słuchaj') - 4, c.at('X105', 'Słuchaj') + 14) }}>Słuchaj w nocy · z zamkniętymi oczami</div>
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
      {[0, 1, 2, 3, 4, 5].map((k) => <Sfx key={`px${k}`} name="tick" at={revA + Math.round(((k + 1) * (revB - revA)) / 7)} volume={0.35} />)}
      <Sfx name="reverse_swell" at={revB} volume={0.45} />
      <Sfx name="snap_in" at={revB} volume={0.6} />
      <Sfx name="whoosh_deep" at={fA2 + 2} volume={0.6} />
      {chips.map((ch, i) => <Sfx key={i} name="tick_soft" at={ch.at} volume={0.75} />)}
      {chips.map((ch, i) => (i > 0 ? <Sfx key={`w${i}`} name="whoosh_soft" at={ch.at - 6} volume={0.22} /> : null))}
      <Sfx name="impact" at={redAt} volume={0.4} />
      <Sfx name={p === 3 || p === 10 || p === 2 ? 'page_turn' : 'card_flip'} at={fB + 6} volume={0.7} />
      <Sfx name="ui_pop" at={miniAt + 2} volume={0.6} />
      <Sfx name="sparkle" at={miniAt + 10} volume={0.3} />
      {VIG_SFX[p]?.(fA2, chips.map((ch) => ch.at))}
      {FACT_SFX[p]?.(fB, c)}
      {p !== 10 && <Sfx name="click" at={c.dur - 16} volume={0.35} />}
      {p === 10 && <><Sfx name="click" at={last + 4} volume={0.8} /><Sfx name="sk_heart" at={c.at('X105', 'Jeśli')} volume={0.9} /><Sfx name="whoosh_deep" at={c.at('X105', 'Jeśli') - 2} volume={0.6} /></>}
    </AbsoluteFill>
  );
};

// Minitarjeta al final de cada libro, centrada bajo el dato.
const LISTEN = {
  sb: { t: 'Posłuchaj · sonorbooks.pl', s: 'Gdzie i za ile · link w opisie' },
  free: { t: 'Za darmo · Wolne Lektury', s: 'Link w opisie' },
  where: { t: 'Gdzie posłuchać', s: 'Link w opisie' },
};
const ListenCard: React.FC<{ at: number; kind: keyof typeof LISTEN; out: number }> = ({ at, kind, out }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 13, 170);
  const o = 1 - ramp(frame, out - 8, out);
  if (s <= 0.001 || o <= 0) return null;
  const shine = interpolate(frame, [at + 6, at + 30], [0, 1], clamp);
  const L = LISTEN[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, margin: '0 auto', width: 'fit-content', top: 944, display: 'flex', alignItems: 'center', gap: 18, padding: '14px 26px 14px 16px', borderRadius: 18, background: color.yellow, color: color.ink,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden', opacity: Math.min(1, s * 1.4) * o, transform: `translateY(${((1 - s) * 50).toFixed(1)}px) scale(${(0.85 + 0.15 * s).toFixed(3)})`, transformOrigin: '50% 50%' }}>
      <span style={{ width: 54, height: 54, borderRadius: 14, background: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={30} height={30} viewBox="0 0 24 24"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" fill={color.yellow} /><path d="M10 9.5v6l5-3z" fill={color.ink} /></svg>
      </span>
      <div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, lineHeight: 1.05, whiteSpace: 'nowrap' }}>{L.t}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, marginTop: 4, whiteSpace: 'nowrap' }}>{L.s}</div>
      </div>
      <svg width={30} height={30} viewBox="0 0 24 24" style={{ marginLeft: 8 }}><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {shine > 0 && shine < 1 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${(shine * 140 - 40).toFixed(1)}%, rgba(255,255,255,0.55) ${(shine * 140 - 25).toFixed(1)}%, rgba(255,255,255,0) ${(shine * 140 - 10).toFixed(1)}%)` }} />}
    </div>
  );
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
// Sonido propio de cada diorama (v5): cada efecto cae en el «beat» de la voz que activa el objeto (bt = BEATS[p] en fotogramas).
// sk_heart golpea 41 fotogramas después de empezar; el latido de Poe late cada 56 con pico 4 fotogramas después.
const VIG_SFX: Record<number, (t0: number, bt: number[]) => React.ReactNode> = {
  1: (_t0, [pap, baj, cul, nom]) => <><Sfx name="page_riffle" at={pap - 4} volume={0.55} /><Sfx name="sk_book_slide" at={baj - 6} volume={0.6} />
    {[0, 1, 2, 3].map((k) => <Sfx key={k} name="sk_pin" at={cul - 4 + k * 6} volume={0.45} />)}<Sfx name="pencil_strike" at={nom} volume={0.6} /><Sfx name="reverse_swell" at={nom + 6} volume={0.35} /></>,
  2: (_t0, [, cor, ent]) => <>{[0, 1, 2, 3, 4, 5].map((k) => <Sfx key={k} name="sk_heart" at={cor + 4 + k * 56 - 41} volume={0.6} />)}<Sfx name="sk_thunder" at={ent} volume={0.55} /></>,
  3: (_t0, [, casa, tit, , con]) => <><Sfx name="stamp" at={casa - 2} volume={0.45} /><Sfx name="sk_string" at={tit - 6} volume={0.55} /><Sfx name="reverse_swell" at={con - 4} volume={0.45} /></>,
  // Rosemary: ventanas que se encienden, la puerta que se abre, latido, calendario y el apagón rojo
  4: (_t0, [kam, sas, cia, tyg]) => <><Sfx name="shimmer" at={kam - 8} volume={0.35} /><Sfx name="sk_door" at={sas - 12} volume={0.6} /><Sfx name="sk_heart" at={cia - 41} volume={0.55} />
    {[0, 1, 2].map((k) => <Sfx key={k} name="pencil_strike" at={tyg + k * 16} volume={0.4} />)}</>,
  5: (t0, [, , esp, dia]) => <><Sfx name="sk_wind" at={t0 + 4} volume={0.6} /><Sfx name="shimmer" at={esp - 6} volume={0.4} /><Sfx name="reverse_swell" at={dia - 4} volume={0.4} /></>,
  // Inkub: la zorza, el cartel, el fuego, la luz verde
  6: (t0, [zor, jod, spo, zie]) => <><Sfx name="sk_wind" at={t0 + 4} volume={0.5} /><Sfx name="reverse_swell" at={zor - 10} volume={0.4} /><Sfx name="stamp" at={jod - 2} volume={0.4} />
    <Sfx name="whoosh_deep" at={spo - 6} volume={0.5} /><Sfx name="shimmer" at={zie - 6} volume={0.45} /></>,
  // Dom na Wyrębach: la foto que se rompe, el cartel, el znicz, el perro del vecino
  7: (t0, [wyk, dom, uma, sas]) => <><Sfx name="sk_wind" at={t0 + 4} volume={0.45} /><Sfx name="sk_crumple" at={wyk + 4} volume={0.5} /><Sfx name="stamp" at={dom} volume={0.4} />
    <Sfx name="sk_door" at={uma + 10} volume={0.5} /><Sfx name="click" at={sas - 2} volume={0.5} /></>,
  8: (t0, [, , rec, des]) => <><Sfx name="sk_wind" at={t0 + 4} volume={0.5} /><Sfx name="stamp" at={rec - 2} volume={0.45} /><Sfx name="reverse_swell" at={des + 30} volume={0.4} /></>,
  // Manitou: latido del bulto, la caja de luz que parpadea, las cartas del adivino
  9: (_t0, [kar, ren, , , wro]) => <><Sfx name="sk_heart" at={kar - 41} volume={0.55} /><Sfx name="sk_projector" at={ren - 10} volume={0.4} /><Sfx name="click" at={ren - 8} volume={0.5} />
    <Sfx name="shimmer" at={wro - 6} volume={0.45} />{[0, 1, 2].map((k) => <Sfx key={k} name="card_flip" at={wro + 6 + k * 5} volume={0.4} />)}</>,
  // Nie otwieraj oczu: algo pasa fuera, el destello, el río y la escucha
  10: (_t0, [zew, , rze, opa, slu]) => <><Sfx name="sk_wind" at={zew - 20} volume={0.7} /><Sfx name="whoosh_deep" at={zew + 10} volume={0.5} /><Sfx name="whoosh_soft" at={rze - 10} volume={0.4} />
    <Sfx name="swipe" at={opa - 6} volume={0.35} /><Sfx name="reverse_swell" at={slu - 6} volume={0.4} /></>,
};
const FACT_SFX: Record<number, (fB: number, c: Clock) => React.ReactNode> = {
  2: (_fB, c) => <Sfx name="snap_in" at={c.at('X23', 'Leśmian') - 6} volume={0.6} />,
  4: (_fB, c) => <>{['najlepiej', 'cztery', 'ekran'].map((w) => <Sfx key={w} name="ui_pop" at={c.at('X43', w) - 4} volume={0.7} />)}</>,
  5: (_fB, c) => <><Sfx name="sk_projector" at={c.at('X53', 'Nosferatu') - 8} volume={0.5} /><Sfx name="stamp" at={c.at('X53', 'zgody')} volume={0.9} /></>,
  6: (_fB, c) => <>{['powieść', 'Złoty', 'słuchowisko'].map((w) => <Sfx key={w} name="ui_pop" at={c.at('X63', w) - 4} volume={0.6} />)}</>,
  7: (_fB, c) => <>{['zadebiutował', 'nominowana'].map((w) => <Sfx key={w} name="ui_pop" at={c.at('X73', w) - 4} volume={0.6} />)}</>,
  9: (_fB, c) => <><Sfx name="sparkle" at={c.at('X93', 'bestseller') - 6} volume={0.5} /><Sfx name="sk_book_thud" at={c.at('X93', 'Wrocław')} volume={0.5} /><Sfx name="shimmer" at={c.at('X93', 'krasnala')} volume={0.5} /></>,
  10: (_fB, c) => <Sfx name="counter" at={c.at('X103', 'czterdzieści') - 4} volume={0.5} />,
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

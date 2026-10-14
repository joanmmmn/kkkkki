import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS } from '../../lib/vo';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { BigNum, BONE, Book10, bookAt, DIM, Flashlight, KickerN, MiniIcon, Narr, Night, Plats, RED, Stars, StoryChips, Wave, color, font, flicker } from './kit';
import { VIGNETTES } from './Vignettes';
import { FACTS } from './Facts';
import { sceneClock, sceneDef } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
export const vid = (p: number, k: number) => `X${p}${k}`;
const hasWord = (vo: string, w: string) => Boolean(VOS[vo]?.words.some((x) => x.w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '').startsWith(w)));

// Palabras clave de la sinopsis (fase A2), con la palabra de la locución en la que aparece cada una.
type Chip = { label: string; word: string; nth?: number; red?: boolean };
const CHIPS: Record<number, Chip[]> = {
  1: [{ label: 'Los papeles de un muerto', word: 'papeles' }, { label: 'Un bajorrelieve de arcilla', word: 'bajorrelieve' }, { label: 'Cultos', word: 'cultos' }, { label: 'Un nombre impronunciable', word: 'nombre', red: true }],
  2: [{ label: 'Un corazón bajo el suelo', word: 'corazón', red: true }, { label: 'Enterrada en vida', word: 'enterrada' }, { label: 'Un gato negro', word: 'gato' }],
  3: [{ label: 'La casa familiar', word: 'casa' }, { label: 'Títeres', word: 'títeres' }, { label: 'Muñecas', word: 'muñecas' }, { label: 'Un títere con planes propios', word: 'concreto', red: true }],
  4: [{ label: 'Urgencias de un pueblo', word: 'urgencias' }, { label: 'Un niño que no es su hijo', word: 'niño' }, { label: 'El momento exacto', word: 'exacto' }, { label: 'Algo en el campo', word: 'campo', red: true }],
  5: [{ label: 'Transilvania', word: 'Transilvania' }, { label: 'Nunca come', word: 'come' }, { label: 'Sin reflejo', word: 'espejo' }, { label: 'De día, nadie', word: 'día', red: true }],
  6: [{ label: 'Pontevedra', word: 'Pontevedra' }, { label: 'Solo con su gato', word: 'gato' }, { label: 'Un brote en Rusia', word: 'Rusia' }, { label: 'Se extiende', word: 'extenderse', red: true }],
  7: [{ label: 'Abuela y nieta', word: 'abuela' }, { label: 'Un niño desaparecido', word: 'desapareciera' }, { label: 'Los vecinos murmuran', word: 'murmuran' }, { label: 'Algo más en la casa', word: 'algo', red: true }],
  8: [{ label: 'Vuelve al pueblo', word: 'vuelve' }, { label: 'La casa de la colina', word: 'casa' }, { label: 'Unos recién llegados', word: 'recién' }, { label: 'Desaparecen… o vuelven', word: 'desaparecer', red: true }],
  9: [{ label: 'Plena dictadura', word: 'dictadura' }, { label: 'Padre e hijo', word: 'padre' }, { label: 'Un don', word: 'don' }, { label: 'La Orden', word: 'Orden', red: true }],
  10: [{ label: 'Washington', word: 'Washington' }, { label: 'Ruidos en el desván', word: 'ruidos' }, { label: 'Una voz que no es la suya', word: 'voz' }, { label: 'Sin explicación', word: 'explicación', red: true }],
};
const TITLE_WORD: Record<number, string> = { 1: 'llamada', 2: 'cuentos', 3: 'Cómo', 4: 'Distancia', 5: 'Drácula', 6: 'Apocalipsis', 7: 'Carcoma', 8: 'misterio', 9: 'Nuestra', 10: 'exorcista' };

// Tarjeta de una narración: quién la lee, duración, voz, nota y plataformas.
export const NarrCard: React.FC<{ n: Narr; at: number; ratingAt: number; w?: number; compact?: boolean; accent: string; seed: string }> = ({ n, at, ratingAt, w = 900, compact = false, accent, seed }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 16, 150);
  const k = compact ? 0.82 : 1;
  const pill = (a: number, icon: React.ReactNode, label: string) => {
    const q = sp(frame, a, 15, 190);
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 * k, padding: `${10 * k}px ${22 * k}px ${10 * k}px ${12 * k}px`, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
        fontFamily: font.sans, fontWeight: 700, fontSize: 30 * k, color: BONE, opacity: q, transform: `translateY(${(1 - q) * 14}px)`, whiteSpace: 'nowrap' }}>
        <span style={{ width: 44 * k, height: 44 * k, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>{label}
      </span>
    );
  };
  return (
    <div style={{ width: w, padding: `${36 * k}px ${44 * k}px ${40 * k}px`, borderRadius: 28, background: 'rgba(12,13,16,0.84)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 40px 110px rgba(0,0,0,0.55)',
      backdropFilter: 'blur(8px)', opacity: s, transform: `translateX(${(1 - s) * 80}px)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: accent }} />
      {n.label && <KickerN at={at + 4} text={n.label} style={{ fontSize: 22 * k, marginBottom: 14 * k }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 * k }}>
        <span style={{ width: 82 * k, height: 82 * k, borderRadius: '50%', background: 'rgba(255,202,5,0.14)', border: `2px solid ${color.yellow}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MiniIcon kind="mic" size={42 * k} c={color.yellow} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: (n.who.length > 26 ? 44 : 56) * k, lineHeight: 1.05, color: '#fff', letterSpacing: -1 }}>{n.who}</div>
          {n.sub && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * k, color: DIM, marginTop: 6 }}>{n.sub}</div>}
        </div>
        <div style={{ marginLeft: 'auto', opacity: 0.8 }}><Wave w={150 * k} h={60 * k} n={14} seed={seed} /></div>
      </div>
      <div style={{ display: 'flex', gap: 14 * k, marginTop: 26 * k, flexWrap: 'wrap' }}>
        {pill(at + 10, <MiniIcon kind="clock" size={26 * k} />, n.dur)}
        {pill(at + 16, <MiniIcon kind="globe" size={26 * k} />, n.voice)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 * k, marginTop: 22 * k, opacity: ramp(frame, ratingAt - 4, ratingAt + 8) }}>
        <Stars value={n.rating} size={36 * k} at={ratingAt} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40 * k, color: '#fff' }}>{n.rating.toFixed(1).replace('.', ',')}</span>
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * k, color: DIM }}>{n.votes.toLocaleString('es-ES')} valoraciones de la narración · {n.source}</span>
      </div>
      <div style={{ marginTop: 24 * k }}><Plats names={n.plats} at={at + 26} size={26 * k} /></div>
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

  // Fase A1: número → la linterna encuentra el libro → título.
  const numSmall = ramp(frame, fTitle - 14, fTitle + 10);
  const light = ramp(frame, fTitle - 10, fTitle + 6, easeOut);
  const a2 = ramp(frame, fA2 - 4, fA2 + 14);
  const bIn = ramp(frame, fB - 4, fB + 14);
  const cIn = ramp(frame, fC - 6, fC + 14);
  const off = ramp(frame, last + 2, last + 12, easeOut);
  const bookIn = sp(frame, fTitle - 8, 16, 110);

  // Viñeta: entra en A2, se oscurece en B y se va en C.
  const vigOpacity = a2 * (1 - cIn);
  const vigDim = 1 - 0.58 * bIn;
  const vigScale = 1.04 + 0.06 * ramp(frame, fA2, fB + 40, easeInOut) + 0.04 * bIn;
  const t0 = fA2;

  // Fase C: libro a la izquierda bajo la linterna y tarjetas a la derecha.
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

  return (
    <AbsoluteFill style={{ background: '#050506' }}>
      {/* A1 y C: noche con la linterna sobre el libro */}
      {(a2 < 1 || cIn > 0) && (
        <AbsoluteFill style={{ opacity: Math.max(1 - a2, cIn) }}>
          <Night red={0.8}>
            {/* libro */}
            <div style={{ position: 'absolute', left: interpolate(cIn, [0, 1], [420, 250]), top: interpolate(cIn, [0, 1], [250, 270]),
              transform: `translateY(${(1 - bookIn) * 80}px) scale(${(0.7 + 0.3 * bookIn) * interpolate(cIn, [0, 1], [1, 0.9])})`, opacity: Math.min(1, bookIn * 1.5), transformOrigin: '50% 60%' }}>
              <Book10 b={b} w={380} h={570} d={60} ry={-22 + Math.sin(frame / 60) * 5 + (1 - bookIn) * -30} rx={3} lit={Math.max(light, cIn)} shine={ramp(frame, fTitle, fTitle + 40)} />
            </div>
            <Flashlight x={interpolate(cIn, [0, 1], [610, 440]) + Math.sin(frame / 40) * 14} y={540 + Math.cos(frame / 52) * 10} r={interpolate(light, [0, 1], [10, 560])} on={Math.max(light, cIn)} dark={0.9} seed={`fl${p}`} />
            {/* número de la cuenta atrás */}
            {cIn < 0.5 && (
              <BigNum n={b.n} at={fNum} size={interpolate(numSmall, [0, 1], [640, 200])} x={interpolate(numSmall, [0, 1], [960, 1080 + (b.n === 10 ? 60 : 20)])} y={interpolate(numSmall, [0, 1], [540, 250])} />
            )}
            {/* título y autor (A1) */}
            {cIn < 0.5 && (
              <div style={{ position: 'absolute', left: 1000, top: 420, width: 860, opacity: 1 - a2 }}>
                <KickerN at={fTitle - 2} text={`Número ${b.n} de 10`} />
                <div style={{ marginTop: 16 }}><MaskTitle text={b.title} at={fTitle - 2} size={b.title.length > 20 ? 80 : b.title.length > 12 ? 96 : 120} color={BONE} /></div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 42, color: DIM, marginTop: 14, opacity: ramp(frame, fTitle + 16, fTitle + 30) }}>{b.author}{b.year ? ` · ${b.year}` : ''}</div>
              </div>
            )}
            {/* tarjetas de narración (C) */}
            {cIn > 0 && (
              <div style={{ position: 'absolute', left: 820, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
                <KickerN at={fC + 4} text={cards > 1 ? 'Cómo escucharlo' : 'La narración que tienes que escuchar'} />
                {p === 8 && (
                  <div style={{ opacity: ramp(frame, kingNote, kingNote + 14) * (1 - 0.55 * ramp(frame, cardAt(0) - 6, cardAt(0) + 10)), fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: BONE,
                    display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ padding: '8px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>«It»</span>
                    <span style={{ padding: '8px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>«El resplandor»</span>
                    <span style={{ color: DIM, fontWeight: 500 }}>en español, solo con voz latina</span>
                  </div>
                )}
                {b.narr.map((n, i) => (
                  <NarrCard key={i} n={n} at={cardAt(i)} ratingAt={ratingAtFor(i)} compact={cards > 1} w={cards > 1 ? 980 : 960} accent={b.accent} seed={`${id}-${i}`} />
                ))}
              </div>
            )}
          </Night>
        </AbsoluteFill>
      )}

      {/* A2 y B: viñeta de ambiente */}
      {vigOpacity > 0 && (
        <AbsoluteFill style={{ opacity: vigOpacity }}>
          <AbsoluteFill style={{ transform: `scale(${vigScale})`, filter: `brightness(${vigDim}) blur(${(bIn * 5).toFixed(2)}px)` }}>
            <V t0={t0} />
          </AbsoluteFill>
          {/* etiqueta del libro arriba a la izquierda */}
          <div style={{ position: 'absolute', left: 90, top: 70, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - bIn * 0.6 }}>
            <span style={{ minWidth: 86, height: 86, borderRadius: 999, background: color.yellow, color: color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px' }}>{b.n}</span>
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>{b.title}</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: DIM }}>{b.author}</div>
            </div>
          </div>
          {bIn < 1 && (
            <div style={{ opacity: 1 - bIn }}>
              <StoryChips items={CHIPS[p].map((ch) => ({ label: ch.label, at: c.at(v2, ch.word, ch.nth ?? 0), red: ch.red }))} />
            </div>
          )}
          {bIn > 0 && <AbsoluteFill style={{ opacity: bIn }}><Fact at={fB + 6} c={c} /></AbsoluteFill>}
        </AbsoluteFill>
      )}

      {/* final del n.º 1: se apaga la linterna */}
      {p === 10 && off > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${off})`, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 120, color: RED, opacity: ramp(frame, c.at('X105', 'Si') - 4, c.at('X105', 'Si') + 12) * flicker(frame, 'atreves', 0.8),
            textShadow: '0 0 60px rgba(193,18,31,0.45)' }}>Si te atreves.</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: DIM, marginTop: 30, opacity: ramp(frame, c.at('X105', 'Escúchalo') - 4, c.at('X105', 'Escúchalo') + 14) }}>Escúchalo de noche</div>
        </AbsoluteFill>
      )}

      {/* —— Sonido —— */}
      <Sfx name={p === 10 ? 'bass_drop' : 'sk_heart'} at={fNum + 2} volume={p === 10 ? 0.9 : 0.8} />
      <Sfx name="whoosh_deep" at={fWord} volume={0.5} />
      <Sfx name="click" at={fTitle - 9} volume={0.7} />
      <Sfx name="whoosh_soft" at={fTitle} volume={0.5} />
      <Sfx name="whoosh_deep" at={fA2 + 4} volume={0.55} />
      {CHIPS[p].map((ch, i) => <Sfx key={i} name="tick_soft" at={c.at(v2, ch.word, ch.nth ?? 0)} volume={0.8} />)}
      <Sfx name={p === 3 || p === 10 || p === 2 ? 'page_turn' : 'card_flip'} at={fB + 6} volume={0.7} />
      <Sfx name="transition" at={fC + 2} volume={0.45} />
      <Sfx name="click" at={fC + 4} volume={0.6} />
      {b.narr.map((_, i) => <Sfx key={`n${i}`} name="snap_in" at={cardAt(i)} volume={0.7} />)}
      {VIG_SFX[p]?.(t0, c)}
      {FACT_SFX[p]?.(fB, c)}
      {p === 10 && <><Sfx name="click" at={last + 4} volume={0.8} /><Sfx name="sk_heart" at={c.at('X105', 'Si')} volume={0.9} /><Sfx name="whoosh_deep" at={c.at('X105', 'Si') - 2} volume={0.6} /></>}
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

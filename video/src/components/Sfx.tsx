import React from 'react';
import { Audio, getInputProps, random, Sequence, staticFile, useVideoConfig } from 'remotion';

// --props='{"stem":"sfx"|"vo"|"music"}' renderiza una sola capa de la mezcla (para medirla).
export const STEM = (getInputProps() as { stem?: 'sfx' | 'vo' | 'music' }).stem;

export type SfxName =
  | 'whoosh_fast' | 'whoosh_deep' | 'whoosh_soft' | 'click' | 'pop' | 'tick' | 'cross' | 'marker' | 'typing'
  | 'page_turn' | 'impact' | 'riser' | 'shimmer' | 'counter' | 'pencil_strike'
  | 'ui_tap' | 'ui_pop' | 'swipe' | 'zoom_in' | 'zoom_out' | 'focus' | 'draw' | 'hit_soft' | 'transition' | 'stamp'
  | 'coins' | 'success' | 'fail' | 'card_flip' | 'tick_soft' | 'sparkle' | 'bass_drop' | 'reverse_swell' | 'phone_tap'
  | 'logo_sting' | 'page_riffle' | 'snap_in'
  // Muestras sueltas (WAV, recortadas a la muestra de typing.mp3 y counter.mp3): una pulsación de tecla y un tic de contador.
  | 'key1' | 'key2' | 'key3' | 'key4' | 'key5' | 'key6' | 'key7' | 'key_space' | 'count_tick'
  // AUTOR · Stephen King (ElevenLabs Sound Effects, tools/sfx.py; ganancia igualada a page_turn por sonoridad integrada)
  | 'sk_crumple' | 'sk_bin' | 'sk_uncrumple' | 'sk_typebell' | 'sk_typing' | 'sk_wind' | 'sk_door' | 'sk_heart' | 'sk_thunder' | 'sk_clock' | 'sk_pin' | 'sk_string' | 'sk_book_thud' | 'sk_book_slide' | 'sk_projector' | 'sk_chime' | 'sk_peel' | 'sk_snow'
  // Por dónde y cómo empezar a leer · Dostoievski (ElevenLabs Sound Effects, tools/sfx.py; ganancia igualada a page_turn por sonoridad integrada)
  | 'dk_drumroll' | 'dk_rifles' | 'dk_gallop' | 'dk_bell' | 'dk_knock' | 'dk_chains' | 'dk_roulette' | 'dk_quill' | 'dk_match' | 'dk_train' | 'dk_crowd' | 'dk_seal' | 'dk_water';
const WAV: Partial<Record<SfxName, true>> = { key1: true, key2: true, key3: true, key4: true, key5: true, key6: true, key7: true, key_space: true, count_tick: true };

// Mezcla: todos los archivos están normalizados a -1 dBFS de pico; GAIN iguala la sonoridad percibida.
// SYNC es el instante (s) del golpe dentro del archivo, medido sobre su envolvente (ventanas de 5 ms, 12/10/2026):
// en los que tienen dos golpes (click: bajar y soltar el botón), el primero, para que el sonido nunca se adelante a la imagen;
// el pico en los golpes y en los barridos (el barrido culmina donde el movimiento va más rápido), y 0 en los sonidos
// que acompañan algo que empieza y dura (trazo, tecleo, contador), para que arranquen con la animación.
const GAIN: Record<SfxName, number> = {
  ui_tap: 0.34, ui_pop: 0.3, snap_in: 0.42, tick_soft: 0.32, phone_tap: 0.45, card_flip: 0.3, click: 0.34, pop: 0.32, tick: 0.2,
  swipe: 0.1, whoosh_fast: 0.2, whoosh_soft: 0.24, whoosh_deep: 0.22, zoom_in: 0.16, zoom_out: 0.2, transition: 0.18,
  focus: 0.2, draw: 0.17, marker: 0.14, pencil_strike: 0.26, sparkle: 0.18, shimmer: 0.18,
  hit_soft: 0.26, impact: 0.24, bass_drop: 0.12, stamp: 0.42, success: 0.16, fail: 0.18, cross: 0.26, coins: 0.22,
  riser: 0.14, reverse_swell: 0.18, logo_sting: 0.2, typing: 0.55, counter: 0.17, page_turn: 0.32, page_riffle: 0.32,
  key1: 0.55, key2: 0.55, key3: 0.55, key4: 0.55, key5: 0.55, key6: 0.55, key7: 0.55, key_space: 0.55, count_tick: 0.17,
  sk_crumple: 0.39, sk_bin: 0.38, sk_uncrumple: 0.59, sk_typebell: 0.23, sk_typing: 0.38, sk_wind: 0.31, sk_door: 0.6, sk_heart: 0.41, sk_thunder: 0.23, sk_clock: 0.62, sk_pin: 0.59, sk_string: 0.25, sk_book_thud: 0.65, sk_book_slide: 0.71, sk_projector: 0.22, sk_chime: 0.18, sk_peel: 0.35, sk_snow: 0.76,
  dk_drumroll: 0.15, dk_rifles: 0.39, dk_gallop: 0.67, dk_bell: 0.31, dk_knock: 0.78, dk_chains: 0.24, dk_roulette: 0.59, dk_quill: 0.35, dk_match: 0.35, dk_train: 0.16, dk_crowd: 0.46, dk_seal: 1, dk_water: 0.66,
};
const SYNC: Partial<Record<SfxName, number>> = {
  // golpes: el pico
  card_flip: 0.19, click: 0.03, coins: 0.12, cross: 0.01, fail: 0.01, hit_soft: 0.07, impact: 0.05, logo_sting: 0.03, marker: 0.12,
  snap_in: 0.02, sparkle: 0.03, stamp: 0.01, tick_soft: 0.01, ui_pop: 0.06, ui_tap: 0.14, page_turn: 0.69, page_riffle: 0.84,
  // barridos y subidas: el punto más fuerte
  swipe: 0.1, transition: 0.3, whoosh_deep: 0.36, whoosh_fast: 0.14, whoosh_soft: 0.12, zoom_in: 0.34, zoom_out: 0.28,
  reverse_swell: 1.27, riser: 1.66, bass_drop: 1.27, shimmer: 0.17,
  // muestras sueltas: el golpe de la tecla y del tic
  key1: 0.024, key2: 0.024, key3: 0.024, key4: 0.024, key5: 0.024, key6: 0.024, key7: 0.024, key_space: 0.029, count_tick: 0.005,
  // trazo, tecleo y contador: arrancan con la animación (SYNC 0)
};

// Efecto de sonido cuyo golpe cae en el fotograma `at`; `volume` es relativo a la ganancia de mezcla del efecto.
// `dur`: fotogramas que suena (para que un contador o un tecleo acaben con su animación) y `fade`: fundido final en fotogramas.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; trimAfter?: number; dur?: number; fade?: number }> = ({ name, at, volume = 1, trimAfter, dur, fade = 0 }) => {
  const { fps } = useVideoConfig();
  if (STEM && STEM !== 'sfx') return null;
  const start = Math.round(at - (SYNC[name] ?? 0) * fps);
  const trimBefore = start < 0 ? -start : undefined;
  const end = dur !== undefined ? (trimBefore ?? 0) + dur : trimAfter;
  const g = GAIN[name] * volume;
  const vol = dur !== undefined && fade > 0 ? (f: number) => g * Math.max(0, Math.min(1, (dur - f) / fade)) : g;
  return (
    <Sequence from={Math.max(0, start)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.${WAV[name] ? 'wav' : 'mp3'}`)} volume={vol} trimBefore={trimBefore} trimAfter={end} />
    </Sequence>
  );
};

// Una pulsación por carácter, en el fotograma exacto en que aparece (`times`, del mismo largo que `text`).
// Siete teclas distintas sin repetir la anterior; el espacio suena más grave y algo más bajo.
const KEYS: SfxName[] = ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7'];
export const Keystrokes: React.FC<{ text: string; times: number[]; volume?: number; seed?: string }> = ({ text, times, volume = 1, seed = 'keys' }) => {
  const chars = Array.from(text);
  let prev = -1;
  return (
    <>
      {chars.map((ch, k) => {
        if (times[k] === undefined) return null;
        let v = Math.floor(random(`${seed}-v${k}`) * KEYS.length);
        if (v === prev) v = (v + 1 + Math.floor(random(`${seed}-w${k}`) * (KEYS.length - 1))) % KEYS.length;
        prev = v;
        const space = ch === ' ';
        return <Sfx key={k} name={space ? 'key_space' : KEYS[v]} at={times[k]} volume={volume * (space ? 0.5 : 0.8 + 0.2 * random(`${seed}-g${k}`))} />;
      })}
    </>
  );
};

// Un tic por cada cambio de la cifra que se ve: `value(f)` es el texto de la cifra en el fotograma f (entre `from` y `to`).
// Si cambia varias veces en un fotograma suena un solo tic; los muy seguidos, algo más bajos (si no, se amontonan).
export const ChangeTicks: React.FC<{ value: (f: number) => string; from: number; to: number; volume?: number }> = ({ value, from, to, volume = 1 }) => {
  const frames: number[] = [];
  let prev = value(from - 1);
  for (let f = from; f <= to; f++) {
    const v = value(f);
    if (v !== prev) frames.push(f);
    prev = v;
  }
  return (
    <>
      {frames.map((f, i) => {
        const gap = i ? f - frames[i - 1] : 4;
        return <Sfx key={f} name="count_tick" at={f} volume={volume * (0.62 + 0.38 * Math.min(1, gap / 4))} />;
      })}
    </>
  );
};

import React, { createContext, useContext } from 'react';
import { Audio, getInputProps, Internals, Sequence, staticFile, useVideoConfig } from 'remotion';

// --props='{"stem":"sfx"|"vo"|"music"}' renderiza una sola capa de la mezcla (para medirla).
export const STEM = (getInputProps() as { stem?: 'sfx' | 'vo' | 'music' }).stem;

export type SfxName =
  | 'whoosh_fast' | 'whoosh_deep' | 'whoosh_soft' | 'click' | 'pop' | 'tick' | 'cross' | 'marker' | 'typing'
  | 'page_turn' | 'impact' | 'riser' | 'shimmer' | 'counter' | 'pencil_strike'
  | 'ui_tap' | 'ui_pop' | 'swipe' | 'zoom_in' | 'zoom_out' | 'focus' | 'draw' | 'hit_soft' | 'transition' | 'stamp'
  | 'coins' | 'success' | 'fail' | 'card_flip' | 'tick_soft' | 'sparkle' | 'bass_drop' | 'reverse_swell' | 'phone_tap'
  | 'logo_sting' | 'page_riffle' | 'snap_in'
  | 'whip' | 'swish_up' | 'mouse_click' | 'scroll' | 'glass_ping' | 'paper_slide' | 'pop_bright' | 'ff_scrub' | 'notify'
  | 'receipt' | 'switch' | 'magnify' | 'score_ding' | 'glitch' | 'tick_fast' | 'boom_soft' | 'swoosh_down'
  | 'book_open' | 'page_turn_big' | 'lights_on' | 'reveal_whoosh' | 'dust_shimmer' | 'pen_scratch' | 'pen_underline' | 'paper_lift'
  | 'card_drop' | 'date_stamp' | 'deep_whoosh' | 'soft_impact' | 'phone_whoosh' | 'file_pop' | 'ink_bloom'
  | 'nfc_beep' | 'door_open' | 'door_thud' | 'light_swell' | 'ticket_pull' | 'service_bell' | 'envelope' | 'unlock' | 'calendar_flip'
  | 'pocket_slide' | 'sticker_slap' | 'cardboard_pop' | 'map_rise' | 'crowd_soft' | 'keys_type';

// Mezcla: todos los archivos están normalizados a -1 dBFS de pico; GAIN iguala la sonoridad percibida
// y SYNC es el instante (s) del golpe dentro del archivo, para que caiga justo en el fotograma `at`.
const GAIN: Record<SfxName, number> = {
  ui_tap: 0.34, ui_pop: 0.3, snap_in: 0.42, tick_soft: 0.32, phone_tap: 0.45, card_flip: 0.3, click: 0.34, pop: 0.32, tick: 0.2,
  swipe: 0.1, whoosh_fast: 0.2, whoosh_soft: 0.24, whoosh_deep: 0.22, zoom_in: 0.16, zoom_out: 0.2, transition: 0.18,
  focus: 0.2, draw: 0.17, marker: 0.14, pencil_strike: 0.26, sparkle: 0.18, shimmer: 0.18,
  hit_soft: 0.26, impact: 0.24, bass_drop: 0.12, stamp: 0.42, success: 0.16, fail: 0.18, cross: 0.26, coins: 0.22,
  riser: 0.14, reverse_swell: 0.18, logo_sting: 0.2, typing: 0.55, counter: 0.17, page_turn: 0.32, page_riffle: 0.32,
  whip: 0.16, swish_up: 0.2, mouse_click: 0.5, scroll: 0.35, glass_ping: 0.22, paper_slide: 0.3, pop_bright: 0.22, ff_scrub: 0.2,
  notify: 0.16, receipt: 0.32, switch: 0.45, magnify: 0.6, score_ding: 0.16, glitch: 0.5, tick_fast: 0.45, boom_soft: 0.25, swoosh_down: 0.1,
  // LibriVox, vídeo por capítulos (igualados por sonoridad medida: unos −27 a −33 LUFS bajo una voz a −18)
  book_open: 0.5, page_turn_big: 0.8, lights_on: 0.49, reveal_whoosh: 0.15, dust_shimmer: 0.07, pen_scratch: 0.27, pen_underline: 0.14,
  paper_lift: 0.16, card_drop: 0.28, date_stamp: 0.8, deep_whoosh: 0.18, soft_impact: 1.0, phone_whoosh: 0.13, file_pop: 0.45, ink_bloom: 0.24,
  // eBiblio («la puerta»): igualados por sonoridad momentánea máxima medida (unos −25 a −29 LUFS; ambientes −34)
  nfc_beep: 0.47, door_open: 0.56, door_thud: 0.39, light_swell: 0.07, ticket_pull: 0.17, service_bell: 0.24, envelope: 0.5, unlock: 0.51,
  calendar_flip: 0.36, pocket_slide: 0.28, sticker_slap: 1.0, cardboard_pop: 0.32, map_rise: 0.64, crowd_soft: 0.08, keys_type: 0.36,
};
const SYNC: Partial<Record<SfxName, number>> = {
  card_flip: 0.19, coins: 0.12, impact: 0.05, page_turn: 0.38, pencil_strike: 0.1, reverse_swell: 1.17, riser: 1.66,
  swipe: 0.08, transition: 0.3, ui_pop: 0.06, whoosh_deep: 0.33, whoosh_fast: 0.15, whoosh_soft: 0.11, zoom_in: 0.45, zoom_out: 0.28,
  logo_sting: 0.03, marker: 0.03, sparkle: 0.05, shimmer: 0.05,
  whip: 0.08, swish_up: 0.1, paper_slide: 0.4, pop_bright: 0.1, boom_soft: 0.15, swoosh_down: 0.12,
  reveal_whoosh: 0.59, deep_whoosh: 0.24, phone_whoosh: 0.37, paper_lift: 0.11, file_pop: 0.09, date_stamp: 0.09,
};

// Bus de efectos (opcional): ganancia global y atenuación bajo la voz, en función del fotograma absoluto.
// Si no hay proveedor, los efectos suenan como siempre (otros vídeos del repositorio no cambian).
export type SfxBus = { gain: number; duck: (absFrame: number) => number };
export const SfxBusContext = createContext<SfxBus | null>(null);
// Dentro de una copia congelada de una escena (fundidos entre escenas), los efectos no deben volver a sonar.
export const SfxMuteContext = createContext(false);

// Efecto de sonido cuyo golpe cae en el fotograma `at`; `volume` es relativo a la ganancia de mezcla del efecto.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; trimAfter?: number }> = ({ name, at, volume = 1, trimAfter }) => {
  const { fps } = useVideoConfig();
  const bus = useContext(SfxBusContext);
  const seq = useContext(Internals.SequenceContext);
  const muted = useContext(SfxMuteContext);
  if (muted || (STEM && STEM !== 'sfx')) return null;
  const start = Math.round(at - (SYNC[name] ?? 0) * fps);
  const trimBefore = start < 0 ? -start : undefined;
  const base = (seq ? seq.cumulatedFrom + seq.relativeFrom : 0) + Math.max(0, start);
  const v = GAIN[name] * volume;
  return (
    <Sequence from={Math.max(0, start)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.mp3`)} volume={bus ? (f: number) => v * bus.gain * bus.duck(base + f) : v} trimBefore={trimBefore} trimAfter={trimAfter} />
    </Sequence>
  );
};

import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BKB_SCENES, bkbStart, BKB_TOTAL, bkbVoIntervals, hasVO, BKB_APP, BKB_BUMPS, SceneDef } from './timeline';
import { BKB_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK } from './kit';

export const BKB_MUSIC: string | null = 'music/bkb_bed.mp3'; // tools/bkb_music.py

// Transiciones entre escenas (cuando no hay separador ni enlace del móvil). La escena saliente dura OV fotogramas más
// y queda debajo de la entrante, que aparece encima: así las dos se cruzan y nunca hay un fotograma vacío.
//  push  → la saliente acelera hacia el espectador y se desenfoca; la entrante llega desde atrás frenando.
//  slide → barrido lateral rápido con desenfoque de movimiento horizontal (las dos se desplazan a la vez).
const IN = 13;
const OV = 10;
const accel = (t: number) => t * t;
type Tr = SceneDef['tin'] | 'first' | 'last';
const SceneShell: React.FC<{ dur: number; over: number; tin: Tr; tout: Tr; children: React.ReactNode }> = ({ dur, over, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const id = React.useId().replace(/:/g, '');
  const slideIn = tin === 'slide';
  const slideOut = tout === 'slide';
  const pushIn = tin === 'push';
  const pushOut = tout === 'push';
  const pin = pushIn || slideIn ? interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = pushOut || slideOut ? interpolate(frame, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
  // Opacidad: la entrante aparece encima de la saliente (que sigue debajo durante OV fotogramas).
  const fadeIn = pushIn || slideIn ? interpolate(frame, [0, slideIn ? 8 : 10], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const fadeOut = pushOut || slideOut ? interpolate(frame, [dur - 2, dur + over], [1, 0], clamp) : 1;
  const drift = 1 + 0.01 * (frame / dur);
  const xAt = (f: number) => {
    const a = slideIn ? 1 - interpolate(f, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 0;
    const b = slideOut ? interpolate(f, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
    return a * 260 - b * 320;
  };
  const x = xAt(frame);
  const mb = Math.min(28, Math.abs(x - xAt(frame - 1)) * 0.5);
  const scale = drift * (pushIn ? 0.965 + 0.035 * pin : 1) * (pushOut ? 1 + 0.045 * pout : 1);
  const blur = (pushIn ? (1 - pin) * 6 : 0) + (pushOut ? pout * 8 : 0);
  const filters = [mb > 0.4 ? `url(#s${id})` : '', blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''].filter(Boolean).join(' ');
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs><filter id={`s${id}`} x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></defs>
      </svg>
      <AbsoluteFill style={{ transform: `translate(${x.toFixed(2)}px, ${(pushIn ? (1 - pin) * 14 : 0).toFixed(2)}px) scale(${scale})`, filter: filters || undefined, opacity: fadeIn * fadeOut }}>
        {children}
      </AbsoluteFill>
    </>
  );
};

export const BookBeatReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = bkbVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  // Separadores: la música sube un poco mientras los paneles tapan la pantalla (el cambio de sección se oye).
  const bumps = BKB_BUMPS.map((id) => [bkbStart(id) - BUMP_IN, bkbStart(id) + 22] as const);
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f, vo);
    const lift = 1 + 0.35 * Math.max(0, ...bumps.map(([a, b]) => interpolate(f, [a, a + 6, b - 8, b], [0, 1, 1, 0], clamp)));
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [BKB_TOTAL - fps * 1.4, BKB_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  const isApp = (i: number) => i >= 0 && i < BKB_SCENES.length && BKB_APP.includes(BKB_SCENES[i].id);
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {BKB_SCENES.map((s, i) => {
        const C = BKB_COMPONENTS[s.id];
        const next = BKB_SCENES[i + 1];
        const tin = i === 0 ? 'first' : s.tin;
        const tout = !next ? 'last' : next.tin;
        // En las escenas de la app seguidas, el móvil sale hacia el centro y la siguiente lo recoge ahí.
        const enter = isApp(i) && isApp(i - 1) && !s.bump ? 'glide' : 'rise';
        const exit = isApp(i) && isApp(i + 1) && !next?.bump ? 'glide' : 'none';
        // Con push o slide, la saliente se alarga OV fotogramas por debajo de la entrante.
        const over = next && (tout === 'push' || tout === 'slide') ? OV : 0;
        return (
          <Sequence key={s.id} from={bkbStart(s.id)} durationInFrames={s.dur + over} name={s.id}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              {s.pre > 0 ? (
                <Sequence from={s.pre} layout="none">
                  <C lead={s.lead - s.pre} dur={s.dur - s.pre} enter={enter} exit={exit} />
                </Sequence>
              ) : (
                <C lead={s.lead} dur={s.dur} enter={enter} exit={exit} />
              )}
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {/* Separadores de sección */}
      {BKB_BUMPS.map((id, k) => {
        const s = BKB_SCENES.find((x) => x.id === id)!;
        const at = bkbStart(id) - BUMP_IN;
        return (
          <Sequence key={`b${id}`} from={at} durationInFrames={BUMP_LEN} name={`bump:${id}`}>
            <Bumper title={s.bump!} index={k + 1} total={BKB_BUMPS.length} kicker="Reseña de BookBeat" />
          </Sequence>
        );
      })}
      {BKB_BUMPS.map((id) => {
        const at = bkbStart(id) - BUMP_IN;
        return (
          <React.Fragment key={`bs${id}`}>
            {/* Los paneles entran de 0 a 13 (negro) y de 3 a 16 (amarillo): el barrido culmina entre los dos, en el 8.
                El «swell» invertido crece hasta el cierre (BUMP_LOCK: el amarillo se posa, la cifra late), donde cae el golpe.
                Salen de 27 a 42 y de 30 a 45: el segundo barrido culmina en el 36. */}
            <Sfx name="whoosh_fast" at={at + 8} volume={0.9} />
            <Sfx name="reverse_swell" at={at + BUMP_LOCK} volume={0.45} />
            <Sfx name="hit_soft" at={at + BUMP_LOCK} volume={0.8} />
            <Sfx name="whoosh_soft" at={at + 36} volume={0.7} />
          </React.Fragment>
        );
      })}
      {/* Enlace del móvil entre escenas de la app: sale acelerando y entra frenando, así que va más rápido justo en el corte.
          Acercamiento: la imagen cambia más deprisa en el fotograma 1 de la escena nueva; barrido lateral, en el 0 (medido
          sobre el vídeo). El cierre (P06) lleva un barrido grave que empieza antes del corte. */}
      {BKB_SCENES.slice(1).map((s) => (s.bump ? null
        : s.tin === 'cut' ? <Sfx key={s.id} name="swipe" at={bkbStart(s.id)} volume={0.9} />
        : s.id === 'F06' ? <Sfx key={s.id} name="whoosh_deep" at={bkbStart(s.id) + 1} volume={0.7} />
        : <Sfx key={s.id} name="transition" at={bkbStart(s.id) + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />))}
      {BKB_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(BKB_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

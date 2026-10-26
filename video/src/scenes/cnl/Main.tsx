import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CNL_SCENES, cnlStart, CNL_TOTAL, cnlVoIntervals, hasVO, SceneDef } from './timeline';
import { CNL_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

export const CNL_MUSIC: string | null = 'music/cnl_bed.mp3'; // tools/cnl_music.py

// Transiciones entre escenas (las mismas que en «Las mejores plataformas»). La escena saliente dura OV fotogramas más
// y queda debajo de la entrante, que aparece encima: así las dos se cruzan y nunca hay un fotograma vacío.
//  push  → la saliente acelera hacia el espectador y se desenfoca; la entrante llega desde atrás frenando.
//  slide → barrido lateral rápido con desenfoque de movimiento horizontal (las dos se desplazan a la vez).
export const IN = 13;
export const OV = 10;
const accel = (t: number) => t * t;
type Tr = SceneDef['tin'] | 'first' | 'last';
export const SceneShell: React.FC<{ dur: number; over: number; tin: Tr; tout: Tr; children: React.ReactNode }> = ({ dur, over, tin, tout, children }) => {
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

export const CancelarSuscripcion: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = cnlVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f, vo);
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [CNL_TOTAL - fps * 1.4, CNL_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {CNL_SCENES.map((s, i) => {
        const C = CNL_COMPONENTS[s.id];
        const next = CNL_SCENES[i + 1];
        const tin = i === 0 ? 'first' : s.tin;
        const tout = !next ? 'last' : next.tin;
        const over = next && (tout === 'push' || tout === 'slide') ? OV : 0;
        return (
          <Sequence key={s.id} from={cnlStart(s.id)} durationInFrames={s.dur + over} name={s.id}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              <C lead={s.lead} dur={s.dur} enter="rise" exit="none" />
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {CNL_SCENES.slice(1).map((s) => (s.tin === 'cut' ? <Sfx key={s.id} name="swipe" at={cnlStart(s.id)} volume={0.9} />
        : s.id === 'X12' ? <Sfx key={s.id} name="whoosh_deep" at={cnlStart(s.id) + 1} volume={0.7} />
        : <Sfx key={s.id} name="transition" at={cnlStart(s.id) + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />))}
      {CNL_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(CNL_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SCENES2, start2, TOTAL2, voIntervals2, origIntervals2 } from './timeline';
import { voSrc } from '../../lib/vo';
import { Placeholder } from '../elt/Placeholder';
import { MUSIC3 } from '../../lib/config';
import { SCENE_COMPONENTS } from './registry';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

// Transición entre escenas: la saliente avanza hacia la cámara y se desenfoca; la entrante llega desde atrás.
// Además, una deriva lenta de cámara para que ningún plano quede estático.
const IN = 11;
const OUT = 7;
const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const pin = first ? 1 : interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut });
  const pout = last ? 0 : interpolate(frame, [dur - OUT, dur], [0, 1], { ...clamp, easing: easeInOut });
  const drift = 1 + 0.014 * (frame / dur);
  const scale = drift * (0.965 + 0.035 * pin) * (1 + 0.05 * pout);
  const blur = (1 - pin) * 9 + pout * 8;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (0.35 + 0.65 * pin) * (1 - 0.55 * pout) }}>
      {children}
    </AbsoluteFill>
  );
};

// Reseña v3: voz «Polished and Energetic», música compuesta por secciones y transiciones entre escenas.
export const ELTReview2: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = voIntervals2();
  const orig = origIntervals2();
  const sec = (s: number) => Math.round(s * fps);
  // Envolvente de ducking: ataque rápido (0,15 s), liberación suave (0,35 s).
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const voices = [start2(5), start2(6)] as const; // V07: sección íntima, música algo más baja
  const trampa = sec(22.2);
  const musicVolume = (f: number) => {
    const section = f >= voices[0] && f < voices[1] ? 0.8 : 1;
    let duck = 0.42 * env(f, vo);
    duck = Math.max(duck, 0.75 * env(f, orig));
    // El golpe de «¿Dónde está la trampa?» se deja respirar medio segundo.
    duck *= 1 - 0.45 * interpolate(f, [trampa - 3, trampa, trampa + sec(0.45), trampa + sec(0.8)], [0, 1, 1, 0], clamp);
    const fadeIn = interpolate(f, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [TOTAL2 - fps * 1.2, TOTAL2], [1, 0], clamp);
    return 0.2 * section * (1 - duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {SCENES2.map((s, i) => {
        const C = SCENE_COMPONENTS[s.id] ?? Placeholder;
        return (
          <Sequence key={s.id} from={start2(i)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} first={i === 0} last={i === SCENES2.length - 1}>
              <C lead={s.lead} dur={s.dur} />
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
            {(!STEM || STEM === 'vo') && (s.audio ?? []).map((a, k) => (
              <Sequence key={`a${k}`} from={a.at} durationInFrames={a.dur} layout="none" name={`orig:${a.src}`}>
                <Audio src={staticFile(a.src)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {SCENES2.slice(1).map((s, i) => <Sfx key={s.id} name="transition" at={start2(i + 1)} volume={0.75} />)}
      {(!STEM || STEM === 'music') && <Audio src={staticFile(MUSIC3)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

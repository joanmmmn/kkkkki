import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { DSK_SCENES, dskStart, DSK_TOTAL, dskVoIntervals, hasVO, DSK_BUMPS, Tin } from './timeline';
import { DSK_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';
import { Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK } from '../nxr/kit';
import { color, font } from './kit';

export const DSK_MUSIC: string | null = 'music/dsk_bed.mp3'; // ElevenLabs Music por bloques (tools/dsk_music.py)

// Transiciones (mismo sistema que las reseñas): la saliente dura OV fotogramas más por debajo de la entrante.
const IN = 14;
const OV = 10;
const accel = (t: number) => t * t;
type Tr = Tin | 'first' | 'last';
const SceneShell: React.FC<{ dur: number; over: number; tin: Tr; tout: Tr; children: React.ReactNode }> = ({ dur, over, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const id = React.useId().replace(/:/g, '');
  const slideIn = tin === 'slide';
  const slideOut = tout === 'slide';
  const pushIn = tin === 'push';
  const pushOut = tout === 'push';
  const pin = pushIn || slideIn ? interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = pushOut || slideOut ? interpolate(frame, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
  const fadeIn = pushIn || slideIn ? interpolate(frame, [0, slideIn ? 8 : 10], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const fadeOut = pushOut || slideOut ? interpolate(frame, [dur - 2, dur + over], [1, 0], clamp) : 1;
  const xAt = (f: number) => {
    const a = slideIn ? 1 - interpolate(f, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 0;
    const b = slideOut ? interpolate(f, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
    return a * 280 - b * 340;
  };
  const x = xAt(frame);
  const mb = Math.min(28, Math.abs(x - xAt(frame - 1)) * 0.5);
  const scale = (pushIn ? 0.965 + 0.035 * pin : 1) * (pushOut ? 1 + 0.045 * pout : 1);
  const blur = (pushIn ? (1 - pin) * 6 : 0) + (pushOut ? pout * 8 : 0);
  const filters = [mb > 0.4 ? `url(#s${id})` : '', blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''].filter(Boolean).join(' ');
  // «dip»: fundido a negro de 12 fotogramas al salir y desde negro al entrar (las escenas oscuras en 3D).
  const dipIn = tin === 'dip' ? 1 - interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: easeOut }) : 0;
  const dipOut = tout === 'dip' ? interpolate(frame, [dur - 12, dur], [0, 1], clamp) : 0;
  const dip = Math.max(dipIn, dipOut);
  return (
    <>
      {(tin === 'dip' || tout === 'dip') && <AbsoluteFill style={{ background: '#000' }} />}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs><filter id={`s${id}`} x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></defs>
      </svg>
      <AbsoluteFill style={{ transform: `translate(${x.toFixed(2)}px, ${(pushIn ? (1 - pin) * 14 : 0).toFixed(2)}px) scale(${scale})`, filter: filters || undefined, opacity: fadeIn * fadeOut }}>
        {children}
      </AbsoluteFill>
      {dip > 0.001 && <AbsoluteFill style={{ background: '#000', opacity: dip }} />}
    </>
  );
};

const Placeholder: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ background: '#F5F4F0', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 80, color: color.muted }}>{id}</AbsoluteFill>
);

export const DostoievskiGuide: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = dskVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.18), a, b, b + sec(0.4)], [0, 1, 1, 0], clamp));
    return d;
  };
  const bumps = DSK_BUMPS.map((id) => [dskStart(id) - BUMP_IN, dskStart(id) + 22] as const);
  const titleAt = dskStart('TITLE');
  const musicVolume = (f: number) => {
    const duck = 0.5 * env(f, vo);
    const lift = 1 + 0.35 * Math.max(0, ...bumps.map(([a, b]) => interpolate(f, [a, a + 6, b - 8, b], [0, 1, 1, 0], clamp)),
      interpolate(f, [titleAt, titleAt + 10, titleAt + sec(3.2), titleAt + sec(3.6)], [0, 1, 1, 0], clamp));
    const fadeIn = interpolate(f, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [DSK_TOTAL - fps * 2, DSK_TOTAL], [1, 0], clamp);
    return 0.22 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {DSK_SCENES.map((s, i) => {
        const C = DSK_COMPONENTS[s.id];
        const next = DSK_SCENES[i + 1];
        const tin: Tr = i === 0 ? 'first' : s.tin;
        const tout: Tr = !next ? 'last' : next.tin;
        const over = next && (tout === 'push' || tout === 'slide') ? OV : 0;
        return (
          <Sequence key={s.id} from={dskStart(s.id)} durationInFrames={s.dur + over} name={s.id}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              {s.pre > 0 ? (
                <Sequence from={s.pre} layout="none">{C ? <C /> : <Placeholder id={s.id} />}</Sequence>
              ) : C ? <C /> : <Placeholder id={s.id} />}
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {DSK_BUMPS.map((id, k) => {
        const s = DSK_SCENES.find((x) => x.id === id)!;
        const at = dskStart(id) - BUMP_IN;
        return (
          <Sequence key={`b${id}`} from={at} durationInFrames={BUMP_LEN} name={`bump:${id}`}>
            <Bumper title={s.bump!} index={k + 1} total={DSK_BUMPS.length} kicker="Dostoievski" />
          </Sequence>
        );
      })}
      {DSK_BUMPS.map((id) => {
        const at = dskStart(id) - BUMP_IN;
        return (
          <React.Fragment key={`bs${id}`}>
            <Sfx name="whoosh_fast" at={at + 8} volume={0.9} />
            <Sfx name="reverse_swell" at={at + BUMP_LOCK} volume={0.45} />
            <Sfx name="hit_soft" at={at + BUMP_LOCK} volume={0.8} />
            <Sfx name="whoosh_soft" at={at + 36} volume={0.7} />
          </React.Fragment>
        );
      })}
      {DSK_SCENES.slice(1).map((s) => (s.bump ? null
        : s.tin === 'cut' ? <Sfx key={s.id} name="swipe" at={dskStart(s.id)} volume={0.9} />
        : s.tin === 'dip' ? <Sfx key={s.id} name="whoosh_soft" at={dskStart(s.id) - 6} volume={0.45} />
        : <Sfx key={s.id} name="transition" at={dskStart(s.id) + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />))}
      {DSK_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(DSK_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

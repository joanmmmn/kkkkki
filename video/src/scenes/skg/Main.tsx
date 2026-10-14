import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SKG_SCENES, skgStart, SKG_TOTAL, skgVoIntervals, hasVO, SKG_BUMPS, Tin } from './timeline';
import { SKG_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';
import { Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK } from '../nxr/kit';
import { color, font } from './kit';

export const SKG_MUSIC: string | null = 'music/skg_bed.mp3'; // ElevenLabs Music por bloques (tools/skg_music.py)

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

const Placeholder: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ background: '#F5F4F0', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 80, color: color.muted }}>{id}</AbsoluteFill>
);

export const StephenKingGuide: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = skgVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.18), a, b, b + sec(0.4)], [0, 1, 1, 0], clamp));
    return d;
  };
  const bumps = SKG_BUMPS.map((id) => [skgStart(id) - BUMP_IN, skgStart(id) + 22] as const);
  const titleAt = skgStart('TITLE');
  const musicVolume = (f: number) => {
    const duck = 0.5 * env(f, vo);
    const lift = 1 + 0.35 * Math.max(0, ...bumps.map(([a, b]) => interpolate(f, [a, a + 6, b - 8, b], [0, 1, 1, 0], clamp)),
      interpolate(f, [titleAt, titleAt + 10, titleAt + sec(3.2), titleAt + sec(3.6)], [0, 1, 1, 0], clamp));
    const fadeIn = interpolate(f, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [SKG_TOTAL - fps * 2, SKG_TOTAL], [1, 0], clamp);
    return 0.22 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {SKG_SCENES.map((s, i) => {
        const C = SKG_COMPONENTS[s.id];
        const next = SKG_SCENES[i + 1];
        const tin: Tr = i === 0 ? 'first' : s.tin;
        const tout: Tr = !next ? 'last' : next.tin;
        const over = next && (tout === 'push' || tout === 'slide') ? OV : 0;
        return (
          <Sequence key={s.id} from={skgStart(s.id)} durationInFrames={s.dur + over} name={s.id}>
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
      {SKG_BUMPS.map((id, k) => {
        const s = SKG_SCENES.find((x) => x.id === id)!;
        const at = skgStart(id) - BUMP_IN;
        return (
          <Sequence key={`b${id}`} from={at} durationInFrames={BUMP_LEN} name={`bump:${id}`}>
            <Bumper title={s.bump!} index={k + 1} total={SKG_BUMPS.length} kicker="Stephen King" />
          </Sequence>
        );
      })}
      {SKG_BUMPS.map((id) => {
        const at = skgStart(id) - BUMP_IN;
        return (
          <React.Fragment key={`bs${id}`}>
            <Sfx name="whoosh_fast" at={at + 8} volume={0.9} />
            <Sfx name="reverse_swell" at={at + BUMP_LOCK} volume={0.45} />
            <Sfx name="hit_soft" at={at + BUMP_LOCK} volume={0.8} />
            <Sfx name="whoosh_soft" at={at + 36} volume={0.7} />
          </React.Fragment>
        );
      })}
      {SKG_SCENES.slice(1).map((s) => (s.bump ? null
        : s.tin === 'cut' ? <Sfx key={s.id} name="swipe" at={skgStart(s.id)} volume={0.9} />
        : <Sfx key={s.id} name="transition" at={skgStart(s.id) + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />))}
      {SKG_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(SKG_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

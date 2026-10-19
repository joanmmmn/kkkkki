import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS } from '../brand/tokens';
import { clamp, easeOut } from '../lib/anim';
import { Sfx, STEM } from '../components/Sfx';
import { Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK } from '../scenes/nxr/kit';
import { SceneView } from './scenes';
import type { PlatformSpec, SceneSpec } from './types';
import { plFullFrames, plHasVO, plSpeechFrames, plVoSrc } from './vo';
import voAll from './vo_index.json';

// Texto de cada locución (public/pl/<pieza>/vo/vo.json, copiado a vo_index.json por tools/pl_index.py).
const VO_TEXT = voAll as Record<string, Record<string, string>>;
export const voText = (slug: string, id: string) => VO_TEXT[slug]?.[id] ?? '';

const sec = (s: number) => Math.round(s * FPS);
const TAIL = sec(0.32);
const BUMP_PRE = 12;
export const OUTRO_HOLD = sec(7.5); // tras la última palabra: firma de marca y hueco para la pantalla final de YouTube

export type Timed = { s: SceneSpec; start: number; dur: number; lead: number; pre: number; tin: 'push' | 'slide' | 'cut' };
export const buildTimeline = (spec: PlatformSpec): { scenes: Timed[]; total: number } => {
  let t = 0;
  const scenes: Timed[] = spec.scenes.map((s, i) => {
    const lead = sec(s.lead ?? (s.bump ? 0.52 : i === 0 ? 0.3 : 0.14));
    const speech = Math.max(plSpeechFrames(spec.slug, s.id, voText(spec.slug, s.id)), s.audio ? Math.ceil(s.audio.dur * FPS) : 0);
    const extra = s.extra ?? (s.kind === 'outro' ? OUTRO_HOLD : s.kind === 'plans' || s.kind === 'proscons' || s.kind === 'verdict' ? 22 : 14);
    const dur = lead + speech + TAIL + extra;
    const pre = s.bump ? BUMP_PRE : 0;
    const tin = s.bump ? 'cut' : (s.tin ?? 'push');
    const out = { s, start: t, dur, lead, pre, tin };
    t += dur;
    return out;
  });
  return { scenes, total: t };
};

// Transiciones entre escenas (como en las reseñas de España): la saliente dura OV fotogramas más por debajo de la entrante.
const IN = 13;
const OV = 10;
const accel = (x: number) => x * x;
const Shell: React.FC<{ dur: number; over: number; tin: string; tout: string; children: React.ReactNode }> = ({ dur, over, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const slideIn = tin === 'slide';
  const slideOut = tout === 'slide';
  const pushIn = tin === 'push';
  const pushOut = tout === 'push';
  const pin = pushIn || slideIn ? interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = pushOut || slideOut ? interpolate(frame, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
  const fadeIn = pushIn || slideIn ? interpolate(frame, [0, slideIn ? 8 : 10], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const fadeOut = pushOut || slideOut ? interpolate(frame, [dur - 2, dur + over], [1, 0], clamp) : 1;
  const drift = 1 + 0.01 * (frame / Math.max(1, dur));
  const x = (slideIn ? (1 - pin) * 260 : 0) - (slideOut ? pout * 320 : 0);
  const scale = drift * (pushIn ? 0.965 + 0.035 * pin : 1) * (pushOut ? 1 + 0.045 * pout : 1);
  const blur = (pushIn ? (1 - pin) * 6 : 0) + (pushOut ? pout * 8 : 0);
  return (
    <AbsoluteFill style={{ transform: `translate(${x.toFixed(2)}px, ${(pushIn ? (1 - pin) * 14 : 0).toFixed(2)}px) scale(${scale})`, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, opacity: fadeIn * fadeOut }}>
      {children}
    </AbsoluteFill>
  );
};

export const PLReview: React.FC<{ spec: PlatformSpec }> = ({ spec }) => {
  const { fps } = useVideoConfig();
  const { scenes, total } = buildTimeline(spec);
  const bumps = scenes.filter((x) => x.s.bump);
  const vo = [
    ...scenes.filter((x) => plHasVO(spec.slug, x.s.id)).map((x) => [x.start + x.lead, x.start + x.lead + plFullFrames(spec.slug, x.s.id, voText(spec.slug, x.s.id))] as const),
    ...scenes.filter((x) => x.s.audio).map((x) => [x.start + x.lead, x.start + x.lead + Math.ceil(x.s.audio!.dur * FPS)] as const),
  ];
  const env = (f: number) => {
    let d = 0;
    for (const [a, b] of vo) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const lifts = bumps.map((x) => [x.start - BUMP_IN, x.start + 22] as const);
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f);
    const lift = 1 + 0.35 * Math.max(0, ...lifts.map(([a, b]) => interpolate(f, [a, a + 6, b - 8, b], [0, 1, 1, 0], clamp)));
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [total - fps * 1.6, total], [1, 0], clamp);
    return 0.2 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {scenes.map((x, i) => {
        const next = scenes[i + 1];
        const tin = i === 0 ? 'first' : x.tin;
        const tout = !next ? 'last' : next.tin;
        const over = next && (tout === 'push' || tout === 'slide') ? OV : 0;
        const text = voText(spec.slug, x.s.id);
        const ctx = { spec, id: x.s.id, text, lead: x.lead - x.pre, dur: x.dur - x.pre };
        return (
          <Sequence key={x.s.id} from={x.start} durationInFrames={x.dur + over} name={x.s.id}>
            <Shell dur={x.dur} over={over} tin={tin} tout={tout}>
              <Sequence from={x.pre} layout="none">
                <SceneView c={ctx} s={x.s} />
              </Sequence>
            </Shell>
            {(!STEM || STEM === 'vo') && x.s.audio && (
              <Sequence from={x.lead} layout="none" name={`audio:${x.s.id}`}>
                <Audio src={staticFile(x.s.audio.src)} volume={x.s.audio.volume ?? 1} />
              </Sequence>
            )}
            {(!STEM || STEM === 'vo') && plHasVO(spec.slug, x.s.id) && (
              <Sequence from={x.lead} layout="none" name={`vo:${x.s.id}`}>
                <Audio src={plVoSrc(spec.slug, x.s.id)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {bumps.map((x, k) => (
        <Sequence key={`b${x.s.id}`} from={x.start - BUMP_IN} durationInFrames={BUMP_LEN} name={`bump:${x.s.id}`}>
          <Bumper title={x.s.bump!} index={k + 1} total={bumps.length} kicker={spec.kicker} />
        </Sequence>
      ))}
      {bumps.map((x) => {
        const at = x.start - BUMP_IN;
        return (
          <React.Fragment key={`bs${x.s.id}`}>
            <Sfx name="whoosh_fast" at={at + 8} volume={0.9} />
            <Sfx name="reverse_swell" at={at + BUMP_LOCK} volume={0.45} />
            <Sfx name="hit_soft" at={at + BUMP_LOCK} volume={0.8} />
            <Sfx name="whoosh_soft" at={at + 36} volume={0.7} />
          </React.Fragment>
        );
      })}
      {scenes.slice(1).map((x) => (x.s.bump ? null : x.tin === 'cut'
        ? <Sfx key={`t${x.s.id}`} name="swipe" at={x.start} volume={0.9} />
        : <Sfx key={`t${x.s.id}`} name="transition" at={x.start + (x.tin === 'slide' ? 0 : 1)} volume={0.6} />))}
      {spec.music && (!STEM || STEM === 'music') && <Audio src={staticFile(spec.music)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

// Capítulos de YouTube (para la descripción): segundo de inicio de cada uno.
export const chaptersOf = (spec: PlatformSpec) => {
  const { scenes } = buildTimeline(spec);
  return spec.chapters.map((ch) => {
    const x = scenes.find((y) => y.s.id === ch.from);
    return { label: ch.label, t: x ? (x.start - (x.s.bump ? BUMP_IN : 0)) / FPS : 0 };
  });
};

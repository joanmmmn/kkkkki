import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { NXR_SCENES, nxrStart, NXR_TOTAL, nxrVoIntervals, hasVO, NXR_APP, NXR_BUMPS, SceneDef } from './timeline';
import { NXR_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Bumper, BUMP_IN, BUMP_LEN } from './kit';

export const NXR_MUSIC: string | null = 'music/nxr_bed.mp3'; // ElevenLabs Music, secciones cuadradas con las escenas (tools/nxr_music_plan.py)

// Transiciones entre escenas (cuando no hay separador ni enlace del móvil):
//  push  → la saliente avanza y se desenfoca; la entrante llega desde atrás.
//  slide → barrido lateral rápido con desenfoque.
const IN = 11;
const OUT = 7;
const SceneShell: React.FC<{ dur: number; tin: SceneDef['tin'] | 'first'; tout: SceneDef['tin'] | 'last'; children: React.ReactNode }> = ({ dur, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const pin = tin === 'push' || tin === 'slide' ? interpolate(frame, [0, tin === 'slide' ? 12 : IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = tout === 'push' || tout === 'slide' ? interpolate(frame, [dur - (tout === 'slide' ? 8 : OUT), dur], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const drift = 1 + 0.01 * (frame / dur);
  if (tin === 'slide' || tout === 'slide') {
    const x = (tin === 'slide' ? (1 - pin) * 220 : 0) - (tout === 'slide' ? pout * 220 : 0);
    const blur = (tin === 'slide' ? (1 - pin) * 12 : 0) + (tout === 'slide' ? pout * 12 : 0) + (tout === 'push' ? pout * 7 : 0);
    return (
      <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${drift * (tout === 'push' ? 1 + 0.04 * pout : 1)})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (tin === 'slide' ? 0.3 + 0.7 * pin : 1) * (1 - 0.5 * pout) }}>
        {children}
      </AbsoluteFill>
    );
  }
  const scale = drift * (0.97 + 0.03 * pin) * (1 + 0.04 * pout);
  const blur = (1 - pin) * 8 + pout * 7;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (0.35 + 0.65 * pin) * (1 - 0.5 * pout) }}>
      {children}
    </AbsoluteFill>
  );
};

export const NextoryReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = nxrVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  // Separadores: la música sube un poco mientras los paneles tapan la pantalla (el cambio de sección se oye).
  const bumps = NXR_BUMPS.map((id) => [nxrStart(id) - BUMP_IN, nxrStart(id) + 22] as const);
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f, vo);
    const lift = 1 + 0.35 * Math.max(0, ...bumps.map(([a, b]) => interpolate(f, [a, a + 6, b - 8, b], [0, 1, 1, 0], clamp)));
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [NXR_TOTAL - fps * 1.4, NXR_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  const isApp = (i: number) => i >= 0 && i < NXR_SCENES.length && NXR_APP.includes(NXR_SCENES[i].id);
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {NXR_SCENES.map((s, i) => {
        const C = NXR_COMPONENTS[s.id];
        const next = NXR_SCENES[i + 1];
        const tin = i === 0 ? 'first' : s.tin;
        const tout = !next ? 'last' : next.tin;
        // En las escenas de la app seguidas, el móvil sale hacia el centro y la siguiente lo recoge ahí.
        const enter = isApp(i) && isApp(i - 1) && !s.bump ? 'glide' : 'rise';
        const exit = isApp(i) && isApp(i + 1) && !next?.bump ? 'glide' : 'none';
        return (
          <Sequence key={s.id} from={nxrStart(s.id)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} tin={tin} tout={tout}>
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
      {NXR_BUMPS.map((id, k) => {
        const s = NXR_SCENES.find((x) => x.id === id)!;
        const at = nxrStart(id) - BUMP_IN;
        return (
          <Sequence key={`b${id}`} from={at} durationInFrames={BUMP_LEN} name={`bump:${id}`}>
            <Bumper title={s.bump!} index={k + 1} total={NXR_BUMPS.length} />
          </Sequence>
        );
      })}
      {NXR_BUMPS.map((id) => {
        const at = nxrStart(id) - BUMP_IN;
        return (
          <React.Fragment key={`bs${id}`}>
            <Sfx name="whoosh_fast" at={at + 6} volume={0.9} />
            <Sfx name="hit_soft" at={at + 18} volume={0.8} />
            <Sfx name="whoosh_soft" at={at + 33} volume={0.7} />
          </React.Fragment>
        );
      })}
      {NXR_SCENES.slice(1).map((s) => (s.tin === 'cut' && !s.bump
        ? <Sfx key={s.id} name="swipe" at={nxrStart(s.id) - 2} volume={0.9} />
        : !s.bump ? <Sfx key={s.id} name="transition" at={nxrStart(s.id)} volume={0.6} /> : null))}
      {NXR_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(NXR_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

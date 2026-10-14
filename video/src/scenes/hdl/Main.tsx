import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { HDL_SCENES, hdlStart, HDL_TOTAL, hdlVoIntervals, hasVO, HDL_CHAPTERS, Tin } from './timeline';
import { HDL_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Butterfly, F, P, pathAt, SERIES } from './kit';

export const HDL_MUSIC: string | null = 'music/hdl_bed.mp3'; // ElevenLabs Music por bloques (tools/hdl_music.py) // ElevenLabs Music por bloques (tools/hdl_music.py)

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
  const fadeInT = tin === 'fade';
  const fadeOutT = tout === 'fade';
  const pin = pushIn || slideIn ? interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = pushOut || slideOut ? interpolate(frame, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
  const fadeIn = pushIn || slideIn ? interpolate(frame, [0, slideIn ? 8 : 10], [0, 1], { ...clamp, easing: easeOut }) : fadeInT ? interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: easeInOut }) : 1;
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
  void fadeOutT;
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

// ———— Separador de capítulo ————
// Una hoja de papel entra girando desde la derecha como una página que se pasa (con la sombra del doblez), muestra
// «Capítulo III» y el título en Garamond mientras una mariposa amarilla la cruza, y sale por la izquierda descubriendo la escena.
export const CH_IN = 24; // fotogramas antes del inicio de la escena
export const CH_LEN = 70;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export const ChapterCard: React.FC<{ title: string; index: number; total: number }> = ({ title, index, total }) => {
  const frame = useCurrentFrame();
  // la página: entra (0→22) con giro desde el lomo derecho, se queda, sale hacia la izquierda (48→68)
  const pin = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [46, 68], [0, 1], { ...clamp, easing: easeInOut });
  const rotY = (1 - pin) * -88 + pout * 0;
  const x = pout * -2100;
  const curl = 1 - pin + pout * 0.6;
  const kIn = interpolate(frame, [12, 26], [0, 1], { ...clamp, easing: easeOut });
  const tIn = interpolate(frame, [16, 32], [0, 1], { ...clamp, easing: easeOut });
  const line = interpolate(frame, [22, 40], [0, 1], { ...clamp, easing: easeOut });
  const u = interpolate(frame, [8, 64], [0, 1], clamp);
  const [bx, by] = pathAt([[2050, 760], [1500, 640], [1180, 330], [700, 420], [-120, 260]], u);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', perspective: 2400 }}>
      <AbsoluteFill style={{ background: 'rgba(20,14,6,0.35)', opacity: Math.min(pin, 1 - pout) }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '100% 50%', transform: `translateX(${x}px) rotateY(${rotY}deg)`, background: P.paper, overflow: 'hidden',
        boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }}>
        <Img src={staticFile('hdl/img/paper.jpg')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
        {/* sombra del doblez */}
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${(0.25 * curl).toFixed(3)}) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 80%, rgba(0,0,0,${(0.18 * curl).toFixed(3)}) 100%)` }} />
        {/* filete y adorno */}
        <div style={{ position: 'absolute', left: 120, right: 120, top: 100, bottom: 100, border: `2px solid rgba(122,102,80,0.35)` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center' }}>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: 10, textTransform: 'uppercase', color: P.sepia, opacity: kIn, transform: `translateY(${(1 - kIn) * 16}px)` }}>
            Capítulo {ROMAN[index - 1]} <span style={{ opacity: 0.5 }}>· de {total}</span>
          </div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 150, lineHeight: 1.05, color: P.ink, marginTop: 34, opacity: tIn, transform: `translateY(${(1 - tIn) * 30}px)`, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ margin: '44px auto 0', width: 420 * line, height: 3, background: P.yellow }} />
          <div style={{ marginTop: 28, fontFamily: F.serif, fontStyle: 'italic', fontSize: 34, color: P.sepia, opacity: line }}>{SERIES} · Cien años de soledad</div>
        </div>
      </div>
      {frame > 8 && frame < 66 && <Butterfly x={bx} y={by + Math.sin(frame / 6) * 14} size={78} rot={-50} seed={`ch${index}`} />}
    </AbsoluteFill>
  );
};

export const CienAnosHistoria: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = hdlVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.18), a, b, b + sec(0.45)], [0, 1, 1, 0], clamp));
    return d;
  };
  const chs = HDL_CHAPTERS.map((id) => [hdlStart(id) - CH_IN, hdlStart(id) + 30] as const);
  const titleAt = hdlStart('TITLE');
  const musicVolume = (f: number) => {
    const duck = 0.52 * env(f, vo);
    const lift = 1 + 0.4 * Math.max(0, ...chs.map(([a, b]) => interpolate(f, [a, a + 8, b - 8, b], [0, 1, 1, 0], clamp)),
      interpolate(f, [titleAt - 10, titleAt + 6, titleAt + sec(4.2), titleAt + sec(4.8)], [0, 1, 1, 0], clamp));
    const fadeIn = interpolate(f, [0, fps * 0.8], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [HDL_TOTAL - fps * 2.5, HDL_TOTAL], [1, 0], clamp);
    return 0.22 * (1 - duck) * lift * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: P.paper }}>
      {HDL_SCENES.map((s, i) => {
        const C = HDL_COMPONENTS[s.id];
        const next = HDL_SCENES[i + 1];
        const tin: Tr = i === 0 ? 'first' : s.tin;
        const tout: Tr = !next ? 'last' : next.tin;
        const over = next && (tout === 'push' || tout === 'slide') ? OV : next && tout === 'fade' ? 22 : 0;
        return (
          <Sequence key={s.id} from={hdlStart(s.id)} durationInFrames={s.dur + over} name={s.id}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              {s.pre > 0 ? <Sequence from={s.pre} layout="none">{C ? <C /> : null}</Sequence> : C ? <C /> : null}
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {HDL_CHAPTERS.map((id, k) => {
        const s = HDL_SCENES.find((x) => x.id === id)!;
        return (
          <Sequence key={`c${id}`} from={hdlStart(id) - CH_IN} durationInFrames={CH_LEN} name={`cap:${id}`}>
            <ChapterCard title={s.chapter!} index={k + 1} total={HDL_CHAPTERS.length} />
          </Sequence>
        );
      })}
      {HDL_CHAPTERS.map((id) => {
        const at = hdlStart(id) - CH_IN;
        return (
          <React.Fragment key={`cs${id}`}>
            <Sfx name="page_turn" at={at + 14} volume={1.1} />
            <Sfx name="hdl_flutter" at={at + 30} volume={0.7} />
            <Sfx name="whoosh_soft" at={at + 56} volume={0.6} />
          </React.Fragment>
        );
      })}
      {HDL_SCENES.slice(1).map((s) => (s.chapter || s.tin === 'fade' ? null
        : s.tin === 'cut' ? <Sfx key={s.id} name="swipe" at={hdlStart(s.id)} volume={0.8} />
        : <Sfx key={s.id} name="transition" at={hdlStart(s.id) + (s.tin === 'slide' ? 0 : 1)} volume={0.5} />))}
      {HDL_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(HDL_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};

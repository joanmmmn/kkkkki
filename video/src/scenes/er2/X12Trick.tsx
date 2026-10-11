import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { LogoIcon } from '../../components/Logo';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Sfx } from '../../components/Sfx';
import { synthCursor } from '../../lib/synth';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { IcArrowDown, IcLink } from '../er/icons';
import { ER_BLOG_URL, ER_HOME_SHOT, ER_REVIEW_SHOT } from './config';
import { itemAt, w } from './timeline';
import REVIEW from '../../../public/er/web/review_meta.json';

const ID = 'X12';
const BW = 1560;
// Portada de SonorBooks capturada a 1536×864 (la tarjeta de ElevenReader es la última de la fila visible).
const HOME_VP: [number, number] = [1536, 864];
const ER_CARD = { x: 1227, y: 506, w: 288, h: 351 };
const ER_BTN = { x: 1248, y: 756, w: 246, h: 48 };
const ROW = [11, 315, 619, 923, 1227];
// Botón «Probar gratis» del veredicto rápido de la reseña (coordenadas CSS de la captura 1920×1080).
const [CX, CY, CW, CH] = REVIEW.deal;

// A · «Y ahora, el truco: 30 días gratis, en vez de 3»: el contador sube de 3 a 30 y el calendario se llena.
const Count: React.FC<{ f30: number; f3: number; out: number }> = ({ f30, f3, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 160 } });
  const fill = interpolate(frame, [f30 - 10, f30 + 26], [0, 30], { ...clamp, easing: easeOut });
  const n = Math.max(3, Math.round(fill));
  const strike = interpolate(frame, [f3 + 2, f3 + 12], [0, 1], { ...clamp, easing: easeOut });
  const o = interpolate(frame, [out - 10, out + 2], [0, 1], { ...clamp, easing: easeInOut });
  const vs = spring({ frame: frame - f3 + 8, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - o, transform: `scale(${1 + 0.06 * o})`, filter: o > 0.01 ? `blur(${o * 10}px)` : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 90 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontSize: 34, fontWeight: 700, letterSpacing: 6, color: color.ink2 }}><LogoIcon size={40} /> EL TRUCO</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span style={{ fontFamily: font.sans, fontSize: 260, fontWeight: 700, letterSpacing: -12, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums', minWidth: 300 }}>{n}</span>
            <span style={{ fontFamily: font.sans, fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>días<br />gratis</span>
          </div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', marginTop: 10, fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink2, opacity: vs, transform: `translateX(${(1 - vs) * -20}px)` }}>
            en vez de 3
            <div style={{ position: 'absolute', left: -6, right: -6, top: '54%', height: 7, borderRadius: 4, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-3deg)` }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 92px)', gap: 12, padding: 30, borderRadius: 36, background: color.ink, boxShadow: '0 40px 90px rgba(16,16,16,0.25)', opacity: title }}>
          {Array.from({ length: 30 }, (_, i) => {
            const on = i < fill;
            const pop = interpolate(fill, [i, i + 1.6], [0, 1], clamp);
            const std = i < 3;
            return (
              <div key={i} style={{ height: 70, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontSize: 26, fontWeight: 700,
                background: on ? (std ? '#fff' : color.yellow) : 'rgba(255,255,255,0.08)', color: on ? color.ink : 'rgba(255,255,255,0.3)',
                transform: `scale(${on ? 1 + 0.18 * (1 - pop) * pop * 4 : 1})`, boxShadow: i === 29 && fill >= 29.9 ? '0 0 0 4px rgba(255,202,5,0.5), 0 0 30px rgba(255,202,5,0.7)' : undefined }}>{i + 1}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Barrido de luz que recorre la fila de plataformas y se queda en la última tarjeta.
const Sweep: React.FC<{ from: number; k: number }> = ({ from, k }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + 26], [0, 1], { ...clamp, easing: easeInOut });
  if (frame < from || frame > from + 34) return null;
  const x = ROW[0] + (ROW[4] - ROW[0]) * p;
  const o = interpolate(frame, [from, from + 4, from + 26, from + 34], [0, 1, 1, 0], clamp);
  return <div style={{ position: 'absolute', left: x * k, top: ER_CARD.y * k, width: ER_CARD.w * k, height: ER_CARD.h * k, borderRadius: 14 * k, background: 'rgba(255,202,5,0.28)', boxShadow: `0 0 ${40 * k}px rgba(255,202,5,0.6)`, opacity: o }} />;
};

// X12 · El truco: 30 días gratis en vez de 3 · dónde está el botón (portada de SonorBooks o la reseña) · enlace en la descripción.
export const X12Trick: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const B = itemAt(ID, 'W14B');
  const S = B - 6;   // la ventana entra 6 fotogramas antes de la frase
  const a = (word: string, n = 0) => w(ID, 'W14A', word, n);
  const b = (word: string, n = 0) => w(ID, 'W14B', word, n) - S;   // relativo a la entrada de la ventana
  const f30 = a('30'), f3 = a('3', 1);
  const fSB = b('SonorBooks'), fER = b('ElevenReader'), fFinal = b('final'), fEntra = b('Entra'), fO = b('o'), fRes = b('reseña');
  const fER2 = b('ElevenReader', 1), fEnlace = b('enlace'), fDesc = b('descripción');
  // cámara sobre la portada (coordenadas CSS 1536×864)
  const camHome: CamKey[] = [
    { f: 0, zoom: 1, x: 768, y: 432 },
    { f: fSB, zoom: 1, x: 768, y: 432 },
    { f: fER + 14, zoom: 1.55, x: 1060, y: 640 },
    { f: fFinal + 6, zoom: 1.55, x: 1060, y: 640 },
    { f: fEntra + 4, zoom: 1.95, x: 1300, y: 700 },
  ];
  const homeCursor = synthCursor([700, 820], [
    { t: (fER + 2) / fps, x: 1250, y: 640, dur: 0.7 },
    { t: (fEntra - 18) / fps, x: ER_BTN.x + ER_BTN.w / 2, y: ER_BTN.y + ER_BTN.h / 2, dur: 0.38, click: true },
  ]);
  const clickHome = fEntra - 18 + Math.round(0.38 * fps) + 3;
  // cambio a la reseña (barrido lateral dentro de la ventana)
  const sw = fO - 4;
  const L = frame - S;   // fotograma local de la ventana
  const swp = interpolate(L, [sw, sw + 10], [0, 1], { ...clamp, easing: easeInOut });
  const r = (f: number) => f - sw;   // relativo al cambio a la reseña
  const camReview: CamKey[] = [
    { f: 0, zoom: 1, x: 960, y: 540 },
    { f: r(fER2) - 10, zoom: 1, x: 960, y: 540 },
    { f: r(fER2) + 14, zoom: 1.6, x: CX + CW / 2 - 80, y: CY + CH / 2 },
  ];
  const reviewCursor = synthCursor([1100, 1000], [{ t: (r(fER2) - 4) / fps, x: CX + CW * 0.3, y: CY + CH * 0.58, dur: 0.6 }]);
  // ventana
  const win = spring({ frame: L, fps, config: { damping: 20, stiffness: 130 } });
  const lift = interpolate(L, [fEnlace - 10, fEnlace + 10], [0, 1], { ...clamp, easing: easeInOut });
  const desc = spring({ frame: L - fEnlace + 6, fps, config: { damping: 16, stiffness: 150 } });
  const url = L < sw + 5 ? 'sonorbooks.com' : ER_BLOG_URL;
  const kH = BW / HOME_VP[0];
  return (
    <Stage tone="warm">
      {frame < B + 6 && <Count f30={f30} f3={f3} out={B} />}
      <Sequence from={S} layout="none">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: win, transform: `translateY(${(1 - win) * 80 - lift * 120}px) scale(${(0.94 + 0.06 * win) * (1 - lift * 0.14)})` }}>
            <BrowserWindow width={BW} url={url}>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-swp * 100}%)` }}>
                <ScreenClip src={ER_HOME_SHOT} image width={BW} viewport={HOME_VP} cursor={homeCursor} camera={camHome} dim={0.42}
                  overlay={() => <Sweep from={fFinal - 22} k={1} />}
                  marks={[{ from: fFinal - 2, to: sw + 10, x: ER_CARD.x - 6, y: ER_CARD.y - 6, w: ER_CARD.w + 12, h: ER_CARD.h + 12, r: 18, label: 'Al final de la fila' }]} />
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - swp) * 100}%)` }}>
                <Sequence from={sw} layout="none">
                  <ScreenClip src={ER_REVIEW_SHOT} image width={BW} cursor={reviewCursor} camera={camReview} dim={0.38}
                    marks={[{ from: r(fER2) - 6, to: dur, x: CX - 8, y: CY - 8, w: CW + 16, h: CH + 16, r: 40, label: 'Aquí, 30 días gratis' }]} />
                </Sequence>
              </div>
            </BrowserWindow>
          </div>
        </AbsoluteFill>
        {/* Enlace en la descripción del vídeo */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '26px 40px', borderRadius: 30, background: color.ink, color: '#fff', boxShadow: shadow.float, opacity: desc, transform: `translateY(${(1 - desc) * 90}px)` }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcLink size={38} w={2.4} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: font.sans, fontSize: 30, color: 'rgba(255,255,255,0.7)' }}>Enlace en la descripción</span>
              <span style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 700 }}>{ER_BLOG_URL}</span>
            </div>
            <div style={{ transform: `translateY(${Math.sin((L - fDesc) / 5) * 8 * (L > fDesc ? 1 : 0)}px)` }}><IcArrowDown size={56} c={color.yellow} w={2.6} /></div>
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sfx name="boom_soft" at={2} volume={0.8} />
      <Sfx name="tick_fast" at={f30 - 8} />
      <Sfx name="pop_bright" at={f30 + 26} />
      <Sfx name="pencil_strike" at={f3 + 2} />
      <Sfx name="whoosh_deep" at={S + 2} volume={0.7} />
      <Sfx name="zoom_in" at={S + fER + 2} volume={0.8} />
      <Sfx name="swish_up" at={S + fFinal - 22} volume={0.7} />
      <Sfx name="draw" at={S + fFinal} />
      <Sfx name="mouse_click" at={S + clickHome} />
      <Sfx name="whip" at={S + sw} />
      <Sfx name="zoom_in" at={S + fER2 - 10} volume={0.7} />
      <Sfx name="focus" at={S + fER2 + 2} />
      <Sfx name="swish_up" at={S + fEnlace - 6} />
      <Sfx name="ui_pop" at={S + fDesc} />
    </Stage>
  );
};

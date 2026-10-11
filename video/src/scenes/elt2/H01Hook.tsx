import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Highlight } from '../../components/Highlight';
import { Words } from '../../components/Kinetic';
import { SpeakerIcon, MicIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut, fmtEs } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import { H01 } from './timeline';
import cursor from '../../../public/elt/rec/03_reader/cursor.json';
import env from '../../../public/elt/audio/cold_env.json';

const W = 1640;

export const OrigAudioPill: React.FC<{ frame: number; label?: string; env: number[] }> = ({ frame, label = 'Crimen y castigo · capítulo I', env: e }) => {
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '20px 36px', borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}` }}>
      <div style={{ width: 60, height: 60, borderRadius: 30, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SpeakerIcon size={34} /></div>
      <div style={{ fontFamily: font.sans }}>
        <div style={{ fontSize: 20, letterSpacing: 4, color: color.muted, fontWeight: 500 }}>AUDIO ORIGINAL · EL LIBRO TOTAL</div>
        <div style={{ fontSize: 30, fontWeight: 700 }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 80 }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const idx = Math.max(0, Math.floor((t - (40 - i) * 0.03) * 50));
          const v = e[Math.min(idx, e.length - 1)] ?? 0;
          return <div key={i} style={{ width: 6, height: 8 + v * 70, borderRadius: 3, background: i > 34 ? color.yellow : color.ink, opacity: 0.3 + 0.7 * (i / 40) }} />;
        })}
      </div>
    </div>
  );
};

// V01 · Gancho: narración original en frío → precio Audible vs 0 € → muro de 6.698 audiolibros → «¿Dónde está la trampa?».
export const H01Hook: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => H01.voAt + wordFrame('V01', w, n, fb);
  const fEsto = at('Esto', 0, 0);
  const fNarr = at('narrado', 0, 2.2);
  const fAud = at('En', 0, 4.6);
  const fAqui = at('Aqui', 0, 8.6);
  const fCero = at('cero', 0, 9.4);
  const fUnico = at('no', 0, 10.4);
  const fSeis = at('seis', 0, 12.1);
  const fSin = [at('anuncios', 0, 14.8), at('suscripcion', 0, 15.8), at('pedirte', 0, 17)];
  const fTrampa = at('Donde', 0, 18.8);
  const cam: CamKey[] = [
    { f: 0, zoom: 2.15, x: 1330, y: 330 },
    { f: H01.coldDur - 6, zoom: 1.95, x: 1330, y: 345 },
    { f: fEsto + 34, zoom: 1.0, x: 960, y: 560 },
  ];
  // La ventana se encoge a la izquierda para el duelo de precios y desaparece con el muro de portadas.
  const duel = interpolate(frame, [fAud - 8, fAud + 14], [0, 1], { ...clamp, easing: easeInOut });
  const winOut = interpolate(frame, [fUnico - 8, fUnico + 8], [0, 1], { ...clamp, easing: easeInOut });
  const wall = interpolate(frame, [fUnico - 6, fUnico + 16], [0, 1], { ...clamp, easing: easeOut });
  const wallBlur = interpolate(frame, [fSin[0] - 10, fSin[0] + 6], [0, 1], clamp);
  const trampa = interpolate(frame, [fTrampa - 8, fTrampa + 6], [0, 1], clamp);
  const pAud = spring({ frame: frame - fAud, fps, config: { damping: 16, stiffness: 160 } });
  const pElt = spring({ frame: frame - fAqui, fps, config: { damping: 12, stiffness: 180 } });
  const eltRoom = spring({ frame: frame - fAqui + 6, fps, config: { damping: 22, stiffness: 120 } });
  const strike = interpolate(frame, [fAqui + 2, fAqui + 12], [0, 1], clamp);
  const counter = interpolate(frame, [fSeis - 10, fSeis + 40], [0, 6698], { ...clamp, easing: easeOut });
  return (
    <Stage>
      {/* Muro de audiolibros */}
      {frame >= fUnico - 8 && (
        <AbsoluteFill style={{ opacity: wall * (1 - trampa * 0.85), filter: `blur(${wallBlur * 8 + trampa * 6}px)` }}>
          <div style={{ position: 'absolute', left: -120, top: 0, width: 2160, transform: `perspective(2600px) rotateX(18deg) rotateZ(-4deg) translateY(${-interpolate(frame, [fUnico, dur], [80, 900])}px) scale(1.08)` }}>
            <Img src={staticFile('elt/img/audiobooks_grid.jpg')} style={{ width: 2160 }} />
          </div>
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.9) 100%)' }} />
        </AbsoluteFill>
      )}
      {frame >= fSeis - 12 && frame < fTrampa + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [fSeis - 12, fSeis, fTrampa - 8, fTrampa], [0, 1, 1, 0], clamp) }}>
          <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: 40, padding: '30px 70px', boxShadow: shadow.card, textAlign: 'center', transform: `scale(${0.9 + 0.1 * spring({ frame: frame - fSeis + 12, fps, config: { damping: 14 } })})` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 190, letterSpacing: -6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtEs(Math.round(counter))}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 46, color: color.ink2, marginTop: 6 }}>audiolibros gratis</div>
            <div style={{ display: 'flex', gap: 22, justifyContent: 'center', marginTop: 30, minHeight: 84 }}>
              {['Anuncios', 'Suscripción', 'Registro'].map((t, i) => {
                const s = spring({ frame: frame - fSin[i] + 6, fps, config: { damping: 16, stiffness: 180 } });
                const k = interpolate(frame, [fSin[i] + 3, fSin[i] + 13], [0, 1], clamp);
                return (
                  <div key={t} style={{ position: 'relative', padding: '14px 34px', borderRadius: 999, border: `2px solid ${k > 0.5 ? 'rgba(229,72,77,0.35)' : '#DADADA'}`, background: k > 0.5 ? '#FFF5F5' : '#fff', fontFamily: font.sans, fontSize: 44, fontWeight: 700, color: k > 0.5 ? '#9A9A9A' : color.ink, opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${1 + 0.06 * Math.sin(Math.min(1, k) * Math.PI)})` }}>
                    {t}
                    <div style={{ position: 'absolute', left: 20, right: 20, top: '52%', height: 7, borderRadius: 4, background: color.red, transform: `scaleX(${k}) rotate(-5deg)`, transformOrigin: 'left' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Ventana con el lector */}
      {winOut < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - winOut, filter: `blur(${winOut * 10}px)` }}>
          <div style={{ transform: `translate(${-duel * 470}px, 0) scale(${1 - duel * 0.42})` }}>
            <BrowserWindow width={W}>
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={17.1} cursor={cursor} camera={cam} cursorOpacity={0} />
            </BrowserWindow>
          </div>
        </AbsoluteFill>
      )}
      {frame < H01.coldDur + 4 && (
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60, opacity: interpolate(frame, [0, 6, H01.coldDur - 6, H01.coldDur + 4], [0, 1, 1, 0], clamp) }}>
          <OrigAudioPill frame={frame} env={env as number[]} />
        </AbsoluteFill>
      )}
      <Callout at={fEsto} until={fAud - 6} x={960} y={900} anchor="center" size={46}>Crimen y castigo · Dostoievski</Callout>
      <Callout at={fNarr} until={fAud - 6} x={960} y={78} anchor="center" size={40} dark><MicIcon size={40} c="#fff" /> Leído por Hernando Iván Cano</Callout>

      {/* Duelo de precios */}
      {duel > 0 && winOut < 1 && (
        <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 1060, opacity: 1 - winOut }}>
          <div style={{ width: 720, padding: '36px 44px', borderRadius: 34, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: pAud, transform: `translateX(${(1 - pAud) * 80}px)` }}>
            <div style={{ fontFamily: font.sans, fontSize: 36, color: color.ink2, fontWeight: 500 }}>Audible</div>
            <div style={{ position: 'relative', display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -3, lineHeight: 1.05 }}>
              18,99 €
              <div style={{ position: 'absolute', left: -8, right: -8, top: '52%', height: 10, borderRadius: 5, background: color.red, transform: `scaleX(${strike}) rotate(-5deg)`, transformOrigin: 'left' }} />
            </div>
          </div>
          {/* La tarjeta de El Libro Total abre hueco al entrar: la de Audible empieza centrada y sube. */}
          <div style={{ height: 250 * eltRoom, marginTop: 36 * eltRoom, overflow: 'visible' }}>
          <div style={{ width: 720, padding: '36px 44px', borderRadius: 34, background: color.yellowSoft, border: `3px solid ${color.yellow}`, boxShadow: shadow.card, opacity: pElt, transform: `translateX(${(1 - pElt) * 80}px) scale(${0.9 + 0.1 * pElt})` }}>
            <div style={{ fontFamily: font.sans, fontSize: 36, color: color.ink2, fontWeight: 500 }}>El Libro Total</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -3, lineHeight: 1.05 }}>
              {frame >= fCero - 2 ? <Highlight start={fCero} dur={10}>0 €</Highlight> : <span style={{ opacity: 0.25 }}>…</span>}
            </div>
          </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ¿Dónde está la trampa? */}
      {frame >= fTrampa - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.07 * Math.exp(-Math.max(0, frame - fTrampa) / 6) * (frame >= fTrampa ? 1 : 0)})` }}>
          {/* Sin `gap`: el espacio tras «la» ya lo pone Words (0,26 em), igual que entre las demás palabras. El golpe de
              «trampa?» crece desde su borde izquierdo para no pisar «la». */}
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -4, display: 'flex', alignItems: 'baseline' }}>
            <Words text="¿Dónde está la" start={fTrampa} size={150} weight={700} style={{ display: 'inline' }} />
            <span style={{ display: 'inline-block', transformOrigin: '0% 65%', transform: `scale(${spring({ frame: frame - fTrampa - 14, fps, config: { damping: 10, stiffness: 180 } })})` }}>
              <Highlight start={fTrampa + 18} dur={10}>trampa?</Highlight>
            </span>
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="zoom_out" at={H01.coldDur + 6} />
      <Sfx name="swipe" at={fAud - 2} />
      <Sfx name="snap_in" at={fAud + 2} />
      <Sfx name="hit_soft" at={fAud + 4} volume={0.6} />
      <Sfx name="pencil_strike" at={fAqui + 4} />
      <Sfx name="snap_in" at={fAqui + 2} volume={0.8} />
      {/* «cero» tiene que oírse limpio: golpe y rotulador suaves sobre la palabra, monedas justo después. */}
      <Sfx name="hit_soft" at={fCero} volume={0.5} />
      <Sfx name="marker" at={fCero} volume={0.55} />
      <Sfx name="coins" at={fCero + 22} volume={0.6} />
      <Sfx name="whoosh_deep" at={fUnico} />
      <Sfx name="page_riffle" at={fUnico - 4} />
      <Sfx name="counter" at={fSeis - 10} />
      <Sfx name="snap_in" at={fSeis - 10} volume={0.7} />
      {fSin.map((f, i) => <Sfx key={i} name="pencil_strike" at={f + 5} volume={0.85} />)}
      <Sfx name="reverse_swell" at={fTrampa - 1} />
      <Sfx name="bass_drop" at={fTrampa} />
      <Sfx name="marker" at={fTrampa + 18} />
    </Stage>
  );
};

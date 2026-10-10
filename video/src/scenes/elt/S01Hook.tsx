import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Stat } from '../../components/Stat';
import { Highlight } from '../../components/Highlight';
import { Words } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { clamp, easeInOut } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import cursorHome from '../../../public/elt/rec/01_home/cursor.json';

const STRIKES = ['Anuncios', 'Suscripción', 'Registro'];

// E01 · Gancho: cifras → tachones → «¿Dónde está la trampa?» → entra El Libro Total.
export const S01Hook: React.FC<{ lead: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E01', w, n, fb);
  const fDesc = at('Cinco', 0, 0);
  const fNota = at('4,8', 0, 2.2);
  const fCero = at('cero', 0, 6.9);
  const fSin = [at('anuncios', 0, 8.4), at('suscripcion', 0, 9.3), at('pedirte', 0, 11)];
  const fTrampa = at('Donde', 0, 13);
  const fHoy = at('Hoy', 0, 15.8);

  const statsOut = interpolate(frame, [fTrampa - 6, fTrampa + 8], [0, 1], { ...clamp, easing: easeInOut });
  const trampaOut = interpolate(frame, [fHoy - 4, fHoy + 10], [0, 1], { ...clamp, easing: easeInOut });
  const win = spring({ frame: frame - fHoy, fps, config: { damping: 22, stiffness: 110 } });
  const toLight = interpolate(frame, [fHoy, fHoy + 18], [0, 1], { ...clamp, easing: easeInOut });

  return (
    <Stage tone="night">
      {/* Fundido de noche a blanco cuando entra la plataforma */}
      <AbsoluteFill style={{ background: color.bg, opacity: toLight }} />

      {/* Cifras */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - statsOut, filter: `blur(${statsOut * 12}px)`, transform: `scale(${1 - statsOut * 0.06})` }}>
        <div style={{ display: 'flex', gap: 130, alignItems: 'flex-end', marginTop: -120 }}>
          <Stat value={5000000} suffix="+" label="descargas en Android" start={fDesc} dur={45} size={104} dark />
          <Stat value={4.8} decimals={1} suffix=" ★" label="valoración media" start={fNota} dur={30} size={104} dark />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, color: '#fff', lineHeight: 1, opacity: frame >= fCero ? 1 : 0, transform: `scale(${spring({ frame: frame - fCero, fps, config: { damping: 12, stiffness: 200 } })})` }}>
              <Highlight start={fCero + 6} dur={10} height={0.28} offset={0.04}><span style={{ color: '#fff' }}>0 €</span></Highlight>
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: 'rgba(255,255,255,0.6)', marginTop: 12, opacity: frame >= fCero ? 1 : 0 }}>miles de audiolibros</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 34, marginTop: 110 }}>
          {STRIKES.map((t, i) => {
            const s = spring({ frame: frame - fSin[i] + 8, fps, config: { damping: 18, stiffness: 170 } });
            const strike = interpolate(frame, [fSin[i] + 4, fSin[i] + 14], [0, 1], { ...clamp, easing: easeInOut });
            return (
              <div key={t} style={{ position: 'relative', padding: '18px 40px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.25)', fontFamily: font.sans, fontSize: 40, fontWeight: 500, color: `rgba(255,255,255,${0.95 - strike * 0.45})`, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
                {t}
                <div style={{ position: 'absolute', left: 24, right: 24, top: '52%', height: 6, borderRadius: 3, background: color.yellow, transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: 'left' }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ¿Dónde está la trampa? */}
      {frame >= fTrampa - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - trampaOut, filter: `blur(${trampaOut * 14}px)` }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 130, color: '#fff', letterSpacing: -3 }}>
            <Words text="¿Dónde está la" start={fTrampa} size={130} weight={700} color="#fff" style={{ display: 'inline' }} />
            <span style={{ display: 'inline-block', transform: `scale(${spring({ frame: frame - fTrampa - 14, fps, config: { damping: 10, stiffness: 180 } })})` }}>
              <Highlight start={fTrampa + 18} dur={10}>trampa?</Highlight>
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Entra El Libro Total */}
      {frame >= fHoy - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: `perspective(2200px) translateY(${(1 - win) * 500}px) rotateX(${(1 - win) * 28}deg) scale(${0.8 + 0.2 * win})`, opacity: win }}>
            <BrowserWindow width={1500}>
              <ScreenClip src="elt/rec/01_home/video.mp4" width={1500} startAt={0.2} cursor={cursorHome} camera={[{ f: 0, zoom: 1.12, x: 960, y: 520 }, { f: 160, zoom: 1, x: 960, y: 540 }]} />
            </BrowserWindow>
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="impact" at={fDesc} volume={0.35} />
      <Sfx name="counter" at={fDesc + 2} volume={0.18} />
      <Sfx name="impact" at={fNota} volume={0.3} />
      <Sfx name="impact" at={fCero} volume={0.45} />
      <Sfx name="marker" at={fCero + 6} volume={0.35} />
      {fSin.map((f, i) => <Sfx key={i} name="pencil_strike" at={f + 4} volume={0.32} />)}
      <Sfx name="riser" at={fTrampa - 50} volume={0.18} />
      <Sfx name="whoosh_deep" at={fTrampa - 4} volume={0.35} />
      <Sfx name="marker" at={fTrampa + 18} volume={0.35} />
      <Sfx name="whoosh_deep" at={fHoy - 6} volume={0.4} />
    </Stage>
  );
};

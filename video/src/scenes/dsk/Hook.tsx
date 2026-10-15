import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, getInputProps, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { color, font, Grain, KR, ramp, rampOut, Snow } from './kit';
import { sceneClock } from './timeline';
import { SquareScene, SQ_POSTS } from './three/Square3D';
import { AUDIO_ONLY, CamKey, projectAt, useFontsReady } from './three/lib3d';

const BENCH = getInputProps() as { noGL?: boolean; aa?: boolean };

// ————————————————————————————————————————————————————————————————
// HOOK · D01–D02 · San Petersburgo, 22 de diciembre de 1849: la plaza nevada al amanecer, tres postes, un pelotón que apunta…
// y una orden del zar que llega en el último momento. Todo había sido un simulacro.
// Ilustración propia por capas (cielo, ciudad, plaza, pelotón) con cámara lenta, nieve y bandas de cine.
// ————————————————————————————————————————————————————————————————

const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const fSan = c.at('D01', 'San');
  const fDate = c.at('D01', 'veintidós');
  const fYear = c.at('D01', 'mil');
  const fEsc = c.at('D01', 'escritor');
  const fVeint = c.at('D01', 'veintiocho');
  const fInv = c.at('D01', 'invierno');
  const fPel = c.at('D01', 'pelotón');
  const fFus = c.at('D01', 'fusilamiento');
  const fUlt = c.at('D02', 'último');
  const fOrden = c.at('D02', 'orden');
  const fZar = c.at('D02', 'zar');
  const fPerd = c.at('D02', 'perdona');
  const fSim = c.at('D02', 'simulacro');
  const dur = c.dur;

  // Luz del amanecer que crece; tensión al apuntar; alivio al llegar la orden.
  const dawn = ramp(frame, 0, fPerd + 40);
  const aim = interpolate(frame, [fPel - 4, fPel + 16, fPerd - 6, fPerd + 22], [0, 1, 1, 0], { ...clamp, easing: easeInOut });
  const tension = interpolate(frame, [fPel - 10, fFus + 30, fUlt - 4, fUlt + 10], [0, 1, 1, 0.55], clamp) * (1 - ramp(frame, fPerd - 4, fPerd + 30));
  const relief = ramp(frame, fPerd - 6, fPerd + 40);
  const hold = ramp(frame, fUlt - 6, fUlt + 4); // «el último momento»: la imagen casi se detiene
  // Cámara 3D: pasillo entre el pelotón y los postes → plano de los condenados (los fusiles apuntan a cámara) → grúa hacia atrás.
  const keys: CamKey[] = [
    { f: 0, pos: [74, 8.5, 9], look: [-12, 9, 8], fov: 34 },
    { f: fEsc, pos: [52, 9.5, 4], look: [-4, 11, 0], fov: 33 },
    { f: fPel - 14, pos: [34, 10.5, 0], look: [0, 12, -4], fov: 32 },
    { f: fPel + 16, pos: [3, 12.5, -5], look: [-1, 11, 26], fov: 36 },
    { f: fUlt, pos: [2.4, 12.4, -3.6], look: [-1, 11, 26], fov: 34 },
    { f: fPerd - 4, pos: [2.2, 12.6, -3], look: [-1, 11, 26], fov: 33 },
    { f: fPerd + 70, pos: [16, 30, -62], look: [-2, 7, 16], fov: 36 },
    { f: dur, pos: [18, 33, -70], look: [-2, 7, 16], fov: 36, ease: (t) => t },
  ];
  const shakeAmp = 0.25 + 0.3 * tension;
  const aimAt = (i: number) => aim * ramp(frame, fPel - 4 + i * 1.6, fPel + 14 + i * 1.6);
  const postGlow = rampOut(frame, fEsc - 6, fEsc + 20) * (1 - ramp(frame, fPel - 10, fPel + 10));
  // La nieve cae más despacio en «el último momento» (el tiempo casi se detiene) y vuelve con la orden.
  const snowT = frame - 0.65 * Math.max(0, Math.min(frame, fPerd) - fUlt);
  const ready = useFontsReady();
  // Foco al sobre: el fondo se desenfoca mientras está en pantalla.
  const focusBlur = 6 * ramp(frame, fUlt, fUlt + 14) * (1 - 0.5 * ramp(frame, fPerd + 10, fPerd + 50));
  // Bandas de cine: abiertas al principio, se recogen al final para pasar a la biblioteca.
  const bars = 1 - ramp(frame, dur - 34, dur - 4);
  // Sobre con el lacre: entra en «último», se rompe el sello en «perdona».
  const env = sp(frame, fUlt + 2, 13, 120);
  const seal = ramp(frame, fPerd - 4, fPerd + 6);
  const stamp = sp(frame, fSim - 2, 9, 260);
  const posts = [1190, 1320, 1450];

  return (
    <AbsoluteFill style={{ background: '#0A0E18', overflow: 'hidden' }}>
      {/* cielo del amanecer (detrás del lienzo transparente) */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #0C1426 0%, #2A3550 ${30 - 6 * dawn}%, #7D778E ${50 - 4 * dawn}%, #CFAEA2 60%, #E6CDBE 66%, #C3BCC8 74%)` }} />
      <div style={{ position: 'absolute', left: -200, top: 380, width: 1200, height: 520, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,214,170,${0.4 + 0.3 * dawn + 0.2 * relief}) 0%, rgba(255,190,150,0) 65%)` }} />
      <AbsoluteFill style={{ filter: focusBlur > 0.05 ? `blur(${focusBlur.toFixed(2)}px)` : undefined }}>
        {ready && !BENCH.noGL && !AUDIO_ONLY && (
          <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: BENCH.aa ?? false, alpha: true, powerPreference: 'high-performance' }} camera={{ fov: 34, position: [60, 10, 8] }}>
            <SquareScene keys={keys} aimAt={aimAt} snowT={snowT} sun={dawn} postGlow={postGlow} tension={tension} shake={shakeAmp} />
          </ThreeCanvas>
        )}
      </AbsoluteFill>
      {/* tensión: viñeta fría que se cierra */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 62% 55%, rgba(0,0,0,0) ${46 - 16 * tension}%, rgba(6,8,16,${0.55 + 0.3 * tension}) 100%)` }} />
      <AbsoluteFill style={{ background: `rgba(163,25,47,${0.12 * tension})`, mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 60%, rgba(255,214,160,${0.18 * relief}) 0%, rgba(255,214,160,0) 60%)` }} />

      {/* rótulos */}
      <div style={{ position: 'absolute', left: 140, top: 190, opacity: rampOut(frame, fSan, fSan + 16) * (1 - ramp(frame, fEsc - 10, fEsc + 4)) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
          <span style={{ width: 60 * rampOut(frame, fSan, fSan + 20), height: 4, background: color.yellow, borderRadius: 2 }} />San Petersburgo
        </div>
        <div style={{ marginTop: 16, fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 104, color: '#fff', lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,0.5)',
          opacity: rampOut(frame, fDate - 2, fDate + 14), transform: `translateY(${(1 - rampOut(frame, fDate - 2, fDate + 14)) * 20}px)` }}>
          22 de diciembre <span style={{ color: '#F1D58C', opacity: rampOut(frame, fYear - 2, fYear + 12) }}>de 1849</span>
        </div>
      </div>
      {/* rótulo del escritor: en el lugar de la fecha, sin señalar ningún poste (él esperaba en el segundo grupo) */}
      {(() => {
        const p = sp(frame, fEsc - 2, 15, 180);
        const o = 1 - ramp(frame, fUlt - 10, fUlt + 2);
        if (frame < fEsc - 3) return null;
        return (
          <div style={{ position: 'absolute', left: 140, top: 210, opacity: p * o, transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, background: '#F4EEE2', padding: '14px 28px', borderRadius: 14, whiteSpace: 'nowrap', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
              Un escritor<span style={{ color: KR, marginLeft: 14, opacity: rampOut(frame, fVeint - 2, fVeint + 10) }}>· 28 años</span>
            </div>
          </div>
        );
      })()}

      {/* la orden del zar */}
      {frame >= fUlt - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 620, height: 400, transform: `translate(${(1 - env) * -900}px, ${(1 - env) * 120 - 40}px) rotate(${(1 - env) * -24 - 3}deg) scale(${0.9 + 0.1 * env})`,
            opacity: 1 - ramp(frame, fSim - 8, fSim + 6) * 0.25 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #F7F1E3, #E7DCC4)', borderRadius: 8, boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }} />
            <svg width={620} height={400} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d="M0 0 L310 210 L620 0" stroke="rgba(120,100,70,0.45)" strokeWidth={3} fill="none" />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: font.serif, fontStyle: 'italic', fontSize: 48, color: '#3A2E20', opacity: rampOut(frame, fOrden - 2, fOrden + 12) }}>
              Orden del <span style={{ fontWeight: 600 }}>zar</span>
            </div>
            {/* lacre que se rompe */}
            <div style={{ position: 'absolute', left: 310 - 56, top: 200 - 56, width: 112, height: 112 }}>
              {[0, 1].map((h) => (
                <div key={h} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #D8485C, #A3192F 55%, #5E0F1D)', boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
                  clipPath: h === 0 ? 'polygon(0 0, 54% 0, 44% 50%, 56% 100%, 0 100%)' : 'polygon(54% 0, 100% 0, 100% 100%, 56% 100%, 44% 50%)',
                  transform: `translate(${(h ? 1 : -1) * 34 * seal}px, ${30 * seal * seal}px) rotate(${(h ? 1 : -1) * 22 * seal}deg)`, opacity: 1 - seal * 0.6 }}>
                  <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '3px solid rgba(255,220,200,0.45)' }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', top: 820, fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.6)', opacity: rampOut(frame, fPerd - 2, fPerd + 14) * (1 - ramp(frame, fSim - 8, fSim + 2)) }}>
            Les perdona la vida
          </div>
        </AbsoluteFill>
      )}
      {/* SIMULACRO */}
      {frame >= fSim - 3 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: `rotate(-6deg) scale(${1.6 - 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.4) * (1 - ramp(frame, dur - 18, dur - 4)), fontFamily: font.sans, fontWeight: 700, fontSize: 170,
            letterSpacing: 14, color: KR, border: `12px solid ${KR}`, borderRadius: 18, padding: '6px 48px 14px', background: 'rgba(246,241,231,0.92)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', mixBlendMode: 'normal' }}>
            SIMULACRO
          </div>
        </AbsoluteFill>
      )}

      {/* bandas de cine y grano */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 118 * bars, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 118 * bars, background: '#000' }} />
      {frame < 14 && <AbsoluteFill style={{ background: '#000', opacity: 1 - ramp(frame, 0, 13) }} />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />

      {/* sonido */}
      <Sfx name="sk_wind" at={2} volume={0.9} dur={fUlt + 20} fade={30} />
      <Sfx name="sk_snow" at={fInv - 10} volume={0.4} />
      {hold > 2 && null}
      <Sfx name="dk_drumroll" at={fPel - 30} volume={0.8} dur={fUlt - fPel + 30} fade={4} />
      <Sfx name="dk_rifles" at={fPel - 2} volume={0.85} />
      <Sfx name="sk_heart" at={fFus + 6} volume={0.75} />
      <Sfx name="dk_gallop" at={fUlt - 40} volume={0.6} dur={60} fade={16} />
      <Sfx name="whoosh_deep" at={fUlt + 2} volume={0.6} />
      <Sfx name="dk_seal" at={fPerd} volume={0.9} />
      <Sfx name="dk_bell" at={fPerd + 8} volume={0.45} />
      <Sfx name="stamp" at={fSim} volume={0.9} />
      <Sfx name="impact" at={fSim} volume={0.5} />
      {fZar > 0 && null}
    </AbsoluteFill>
  );
};

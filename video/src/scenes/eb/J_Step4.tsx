import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { box, clamp01, E, eIO, eOut, follow, lerp, pop, ramp, Stip } from './kit';
import { Laptop, Phone, PlainCover } from './props';
import { AppMyBooks, AppPlayer } from './app';
import { Mark, mid, Page, Pointer } from './web';
import { LX, LY, StepTag, SW, toScreen } from './G_Step1';
import { Bubble } from './H_Step2';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano J (T10): paso 4, escúchalo. En la web: «Mi Cuenta» (captura real) → préstamos → «Escuchar en línea»
// (recreación: no se graba nada con sesión iniciada). En la app (recreación): «Mis libros», el reproductor con
// velocidad, saltos de 30 s y temporizador, y la descarga para escuchar sin conexión.
// ---------------------------------------------------------------------------------------------------------------
export const Step4: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T10', 'B11', word, n);
  const fPaso = at('Paso'), fWeb = at('web'), fMi = at('Mi'), fEsc = at('Escuchar'), fLinea = at('línea'), fApp = at('app'), fMis = at('Mis'), fVel = at('velocidad');
  const fSaltos = at('saltos'), fTreinta = at('treinta'), fTemp = at('temporizador'), fDesc = at('descargas'), fSin = at('sin'), fCon = at('conexión');
  const lap = pop(frame, 2, fps, 110, 16);
  const cuenta = box('mhome:cuenta');
  const clickC = fMi + 8;
  const panel = ramp(frame, clickC + 6, clickC + 22, eIO); // panel «Mi cuenta» (recreación) encima de la web
  const clickE = fLinea + 2;
  const webPlay = ramp(frame, clickE + 4, clickE + 20, eOut);
  // la app
  const toApp = ramp(frame, fApp - 14, fApp + 14, eIO);
  const ph = pop(frame, fApp - 10, fps, 120, 16);
  const openPlayer = ramp(frame, fMis + 22, fMis + 34, eIO);
  const speed = frame > fVel + 10 ? '1,25×' : '1,0×';
  const jump = ramp(frame, fTreinta, fTreinta + 6, eOut) * 0.004;
  const timer = frame > fTemp + 12 ? '15 min' : undefined;
  const backToBooks = ramp(frame, fDesc - 22, fDesc - 12, eIO) * (1 - ramp(frame, fSin - 4, fSin + 6, eIO));
  const hold = ramp(frame, fDesc - 10, fDesc - 2, eOut);
  const menu = ramp(frame, fDesc - 4, fDesc + 6, eOut) * (1 - ramp(frame, fSin - 8, fSin, eIO));
  const dl = ramp(frame, fDesc + 12, fDesc + 18, eOut);
  const offline = ramp(frame, fCon - 6, fCon + 6, eOut);
  const prog = 0.18 + (frame - fMis) * 0.0006 + (frame > fTreinta ? jump : 0);
  const hi = {
    speed: ramp(frame, fVel - 4, fVel + 4, eOut) * (1 - ramp(frame, fSaltos - 6, fSaltos, eIO)),
    back: ramp(frame, fSaltos - 2, fSaltos + 6, eOut) * (1 - ramp(frame, fTemp - 8, fTemp - 2, eIO)),
    fwd: ramp(frame, fSaltos - 2, fSaltos + 6, eOut) * (1 - ramp(frame, fTemp - 8, fTemp - 2, eIO)),
    timer: ramp(frame, fTemp - 4, fTemp + 4, eOut) * (1 - ramp(frame, fDesc - 26, fDesc - 18, eIO)),
  };
  const [cx, cy] = toScreen(cuenta[0] + 30, cuenta[1] + 120, 0);
  const cam = follow(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: fWeb - 4, x: 960, y: 540, s: 1 },
    { f: fMi - 4, x: cx - 260, y: cy + 60, s: 1.5 },
    { f: clickC + 16, x: cx - 300, y: cy + 140, s: 1.35 },
    { f: fApp - 16, x: cx - 300, y: cy + 150, s: 1.35 },
    { f: fApp + 16, x: 1170, y: 520, s: 1.16 },
    { f: dur, x: 1180, y: 520, s: 1.18 },
  ], 5.2);
  const lx = lerp(LX, -260, toApp), lsc = lerp(1, 0.78, toApp);
  return (
    <AbsoluteFill style={{ background: E.mustardPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.14} />
      <div style={{ position: 'absolute', left: -200, top: 640, width: 2400, height: 800, borderRadius: '50%', background: E.mustardLight, opacity: 0.6 }} />
      <AbsoluteFill style={{ transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: lx, top: LY + (1 - Math.min(1, lap)) * 700, transform: `scale(${lsc})`, transformOrigin: '0 40%', opacity: 1 - toApp * 0.35 }}>
          <Laptop sw={SW}>
            <Page name="mhome">
              <Mark b={cuenta} at={fMi - 6} pad={6} color={E.coral} out={clickC + 10} />
              <Pointer from={[820, 260]} to={mid(cuenta)} at={fMi - 14} click={clickC} size={54} o={1 - panel} />
            </Page>
            {/* «Mi cuenta» con sesión iniciada: recreación */}
            {panel > 0 && (
              <div style={{ position: 'absolute', inset: 0, background: `rgba(15,21,33,${0.35 * panel})` }}>
                <div style={{ position: 'absolute', left: 300, top: 120, width: 680, padding: '30px 34px', borderRadius: 18, background: '#fff', fontFamily: E.font, transform: `translateY(${(1 - panel) * 40}px)`, opacity: panel }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: E.ink }}>Mi cuenta</div>
                  <div style={{ display: 'flex', gap: 26, marginTop: 10, fontSize: 18, fontWeight: 600, color: E.inkSoft, borderBottom: '2px solid #EEE' }}>
                    <div style={{ padding: '8px 0', color: E.red, borderBottom: `3px solid ${E.red}` }}>Préstamos y reservas</div><div style={{ padding: '8px 0' }}>Historial</div>
                  </div>
                  <div style={{ display: 'flex', gap: 22, marginTop: 22, alignItems: 'center' }}>
                    <PlainCover w={120} title="El otoño del patriarca" bg={E.coral} accent={E.mustard} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: E.ink }}>El otoño del patriarca</div>
                      <div style={{ fontSize: 17, color: E.inkSoft, marginTop: 4 }}>Audiolibro · vence en 21 días</div>
                      <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 8, background: E.red, color: '#fff', fontSize: 19, fontWeight: 700,
                        boxShadow: `0 0 0 ${5 * ramp(frame, fEsc - 6, fEsc + 4, eOut)}px ${E.mustard}`, transform: `scale(${1 - 0.05 * (ramp(frame, clickE - 3, clickE, eOut) - ramp(frame, clickE, clickE + 8, eOut))})` }}>
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 4 L20 12 L7 20 Z" fill="#fff" /></svg>Escuchar en línea
                      </div>
                    </div>
                  </div>
                  {webPlay > 0 && (
                    <div style={{ marginTop: 22, height: 56, borderRadius: 12, background: '#F4F1ED', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', opacity: webPlay }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: E.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" fill="#fff" /><rect x="14" y="4" width="5" height="16" fill="#fff" /></svg>
                      </div>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#DDD', position: 'relative' }}><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${12 + 10 * clamp01((frame - clickE) / 120)}%`, borderRadius: 3, background: E.red }} /></div>
                      <div style={{ fontSize: 15, color: E.inkSoft }}>Sigue donde lo dejaste</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', right: 18, bottom: 10, fontSize: 13, fontWeight: 500, color: E.inkFaint }}>Recreación</div>
                  <div style={{ position: 'absolute', left: 0, top: 0 }}>
                    <Pointer from={[600, 420]} to={[352, 238]} at={fEsc - 10} click={clickE} size={46} o={1 - ramp(frame, fApp - 14, fApp - 6, eIO)} />
                  </div>
                </div>
              </div>
            )}
          </Laptop>
        </div>
      {/* móvil (recreación de la app) */}
      {ph > 0.01 && (
        <div style={{ position: 'absolute', left: 1080, top: 60 + (1 - Math.min(1, ph)) * 900, transform: `rotate(${(1 - Math.min(1, ph)) * 8}deg)` }}>
          <Phone w={440}>
            <AppMyBooks hold={hold} menu={menu} download={dl} />
            {openPlayer > 0 && backToBooks < 1 && (
              <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - openPlayer) * 780 + backToBooks * 780}px)` }}>
                <AppPlayer progress={Math.min(0.95, prog)} speed={speed} timer={timer} hi={hi} offline={offline} />
              </div>
            )}
          </Phone>
          <div style={{ position: 'absolute', left: 220, top: 958, transform: 'translateX(-50%)', fontFamily: E.font, fontSize: 18, fontWeight: 500, color: E.inkSoft, whiteSpace: 'nowrap' }}>App eBiblio · recreación</div>
          {/* toque en la portada */}
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <Pointer from={[420, 520]} to={[112, 250]} at={fMis + 2} click={fMis + 20} size={60} o={1 - ramp(frame, fMis + 24, fMis + 30, eIO)} />
            <Pointer from={[420, 520]} to={[112, 250]} at={fDesc - 22} click={fDesc - 8} size={60} o={1 - ramp(frame, fDesc + 2, fDesc + 8, eIO)} />
          </div>
          {(() => {
            const s1 = pop(frame, fVel - 2, fps, 170, 13) * (1 - ramp(frame, fSaltos - 4, fSaltos + 2, eIO));
            const s2 = pop(frame, fSaltos, fps, 170, 13) * (1 - ramp(frame, fTemp - 6, fTemp, eIO));
            const s3 = pop(frame, fTemp, fps, 170, 13) * (1 - ramp(frame, fDesc - 24, fDesc - 16, eIO));
            const s4 = pop(frame, fCon - 4, fps, 170, 13);
            return (
              <>
                {s1 > 0.01 && <Bubble x={-170} y={770} s={s1} text="Velocidad" bg={E.plum} size={34} />}
                {s2 > 0.01 && <Bubble x={-170} y={610} s={s2} text="± 30 segundos" bg={E.plum} size={34} />}
                {s3 > 0.01 && <Bubble x={-170} y={770} s={s3} text="Temporizador" bg={E.plum} size={34} />}
                {s4 > 0.01 && <Bubble x={-190} y={160} s={s4} text="Descargado: sin conexión" bg={E.green} size={32} />}
              </>
            );
          })()}
        </div>
      )}
      </AbsoluteFill>
      <StepTag n="4" title="Escúchalo" at={fPaso - 4} />
      <Sfx name="whoosh_soft" at={0} volume={0.4} />
      <Sfx name="zoom_in" at={fMi - 10} volume={0.4} />
      <Sfx name="mouse_click" at={clickC} volume={0.8} />
      <Sfx name="pop_bright" at={clickC + 8} volume={0.4} />
      <Sfx name="mouse_click" at={clickE} volume={0.8} />
      <Sfx name="phone_whoosh" at={fApp - 8} volume={0.7} />
      <Sfx name="phone_tap" at={fMis + 20} volume={0.7} />
      <Sfx name="swish_up" at={fMis + 22} volume={0.4} />
      <Sfx name="ui_tap" at={fVel + 10} volume={0.6} />
      <Sfx name="ff_scrub" at={fTreinta} volume={0.4} />
      <Sfx name="ui_tap" at={fTemp + 12} volume={0.6} />
      <Sfx name="phone_tap" at={fDesc - 8} volume={0.6} />
      <Sfx name="swish_up" at={fDesc - 4} volume={0.35} />
      <Sfx name="success" at={fDesc + 14} volume={0.4} />
      <Sfx name="switch" at={fSin} volume={0.5} />
    </AbsoluteFill>
  );
};

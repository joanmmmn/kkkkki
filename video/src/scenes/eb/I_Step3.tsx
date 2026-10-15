import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Box, box, clamp01, E, eIO, eOut, follow, lerp, pop, ramp, Stip } from './kit';
import { Laptop } from './props';
import { Mark, mid, Page, Pointer } from './web';
import { LX, LY, StepTag, SW, toScreen } from './G_Step1';
import { Bubble } from './H_Step2';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano I (T09): paso 3, pide el audiolibro. La ficha real de «El otoño del patriarca» en eBiblio Madrid: 2 ejemplares
// disponibles → «Prestar» → se confirma (ventana ilustrada) → prestado. La de «Cien años de soledad»: «Próximo ejemplar
// disponible el 7 ene 2027» → «Reservar»; cuando te toca, llega un correo y hay un plazo para confirmarlo.
// ---------------------------------------------------------------------------------------------------------------
export const Step3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T09', 'B10', word, n);
  const fPaso = at('Paso'), fAbre = at('abre'), fFicha = at('ficha'), fPrestar = at('Prestar'), fTuyo = at('tuyo'), fConf = at('confirmas'), fYa = at('ya');
  const fReservar = at('Reservar'), fCuando = at('cuándo'), fLibre = at('libre'), fCuando2 = at('Cuando', 1), fCorreo = at('correo'), fPlazo = at('plazo'), fConfirmarlo = at('confirmarlo');
  const lap = pop(frame, 2, fps, 110, 16);
  const btn = box('rotono:button'), btnR = box('rcien:button');
  const dateBox: Box = [983, 304, 222, 52];
  const clickP = fPrestar + 10;
  const dlg = pop(frame, fConf - 18, fps, 160, 15);
  const press = ramp(frame, fConf + 26, fConf + 30, eOut) * (1 - ramp(frame, fConf + 30, fConf + 38, eOut));
  const stamp = pop(frame, fYa - 4, fps, 260, 13);
  const dlgOut = ramp(frame, fReservar - 26, fReservar - 14, eIO);
  const swap = ramp(frame, fReservar - 16, fReservar - 6, eIO); // ficha de «Cien años de soledad»
  const mail = pop(frame, fCuando2 - 6, fps, 120, 16);
  const ringP = ramp(frame, fPlazo - 4, fConfirmarlo + 30, (t) => t);
  const [tx, ty] = toScreen(1060, 330, 0);
  const cam = follow(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: fAbre - 6, x: 960, y: 540, s: 1 },
    { f: fFicha + 10, x: tx - 120, y: ty + 20, s: 1.75 },
    { f: fCuando2 - 20, x: tx - 100, y: ty + 10, s: 1.85 },
    { f: fCuando2 + 10, x: tx - 260, y: ty + 40, s: 1.45 },
    { f: dur, x: tx - 270, y: ty + 40, s: 1.45 },
  ], 5.2);
  return (
    <AbsoluteFill style={{ background: E.mustardPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.14} />
      <div style={{ position: 'absolute', left: -200, top: 640, width: 2400, height: 800, borderRadius: '50%', background: E.mustardLight, opacity: 0.6 }} />
      <AbsoluteFill style={{ transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: LX, top: LY + (1 - Math.min(1, lap)) * 700 }}>
          <Laptop sw={SW}>
            <Page name="rotono">
              <Mark b={[965, 258, 255, 204]} at={fFicha - 4} pad={6} color={E.coral} out={fPrestar - 6} />
              <Mark b={btn} at={fPrestar - 8} pad={5} color={E.green} out={fReservar - 20} />
              <Pointer from={[760, 640]} to={mid(btn)} at={fPrestar - 16} click={clickP} size={56} o={1 - ramp(frame, fConf - 14, fConf - 8, eIO)} />
            </Page>
            {swap > 0 && (
              <div style={{ position: 'absolute', inset: 0, opacity: swap }}>
                <Page name="rcien">
                  <Mark b={btnR} at={fReservar - 4} pad={5} color={E.orange} />
                  <Mark b={dateBox} at={fCuando - 6} pad={3} color={E.orange} />
                </Page>
              </div>
            )}
          </Laptop>
        </div>
        {/* ventana de confirmación (ilustración) y sello */}
        {dlg > 0.01 && dlgOut < 1 && (() => {
          const [dx, dy] = toScreen(780, 330, 0);
          return (
            <div style={{ position: 'absolute', left: dx, top: dy, width: 420, transform: `translate(-50%, -50%) scale(${(0.8 + 0.2 * Math.min(1.05, dlg)) * (1 - dlgOut * 0.2)})`, opacity: Math.min(1, dlg * 2) * (1 - dlgOut),
              padding: '26px 30px', borderRadius: 22, background: E.paper, boxShadow: `8px 8px 0 ${E.ink}`, fontFamily: E.font }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: E.ink }}>¿Confirmas el préstamo?</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: E.plum, marginTop: 8 }}>El otoño del patriarca · audiolibro</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                <div style={{ flex: 1, height: 52, borderRadius: 12, background: E.coral, color: E.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, transform: `scale(${1 - press * 0.06})` }}>Confirmar</div>
                <div style={{ flex: 1, height: 52, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${E.boneDeep}`, color: E.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600 }}>Cancelar</div>
              </div>
              {stamp > 0.01 && (
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(-10deg) scale(${lerp(1.7, 1, clamp01(stamp))})`, opacity: clamp01(stamp * 2.5),
                  padding: '10px 26px', border: `6px solid ${E.green}`, borderRadius: 14, color: E.green, fontWeight: 800, fontSize: 46, letterSpacing: '0.05em', background: 'rgba(251,247,241,0.85)', whiteSpace: 'nowrap' }}>¡PRESTADO!</div>
              )}
              <div style={{ position: 'absolute', left: 120, top: 140 }}>
                <Pointer from={[180, 120]} to={[0, 0]} at={fConf + 4} click={fConf + 28} size={50} o={1 - ramp(frame, fYa, fYa + 8, eIO)} />
              </div>
            </div>
          );
        })()}
        {(() => {
          const [bx, by] = toScreen(1092, 470, 0);
          const s1 = pop(frame, fTuyo - 6, fps, 170, 13) * (1 - ramp(frame, fConf - 20, fConf - 10, eIO));
          const s2 = pop(frame, fLibre - 6, fps, 170, 13) * (1 - ramp(frame, fCuando2 - 20, fCuando2 - 8, eIO));
          return (
            <>
              {s1 > 0.01 && <Bubble x={bx} y={by} s={s1} text="Hay ejemplares libres" bg={E.green} size={24} />}
              {s2 > 0.01 && <Bubble x={bx} y={by - 50} s={s2} text="Todos prestados: te pones a la cola" bg={E.orange} size={22} />}
            </>
          );
        })()}
      </AbsoluteFill>
      {/* correo: «te toca» */}
      {mail > 0.01 && (
        <div style={{ position: 'absolute', left: 1180, top: 300, width: 640, transform: `translateX(${(1 - Math.min(1, mail)) * 800}px) rotate(${(1 - Math.min(1, mail)) * 6 + 1.5}deg)`,
          padding: '30px 34px', borderRadius: 26, background: E.paper, boxShadow: `12px 12px 0 ${E.plum}`, fontFamily: E.font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="76" height="56" viewBox="0 0 76 56"><rect x="2" y="2" width="72" height="52" rx="8" fill={E.coral} /><path d="M4 6 L38 32 L72 6" stroke={E.paper} strokeWidth="5" fill="none" strokeLinejoin="round" /></svg>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: E.inkSoft }}>Correo de eBiblio</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: E.ink, lineHeight: 1.1 }}>¡Ya te toca!</div>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 26, fontWeight: 500, color: E.ink, lineHeight: 1.35 }}>«Cien años de soledad» ya está disponible para ti.</div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, opacity: ramp(frame, fPlazo - 10, fPlazo + 4, eOut) }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" stroke={E.boneDeep} strokeWidth="8" fill="none" />
              <circle cx="32" cy="32" r="26" stroke={E.coral} strokeWidth="8" fill="none" strokeDasharray={163.4} strokeDashoffset={163.4 * ringP} transform="rotate(-90 32 32)" strokeLinecap="round" />
              <path d="M32 18 V32 L41 38" stroke={E.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 28, fontWeight: 700, color: E.coral }}>Confírmalo antes de que acabe el plazo</div>
          </div>
        </div>
      )}
      <StepTag n="3" title="Pide tu audiolibro" at={fPaso - 4} />
      <Sfx name="whoosh_soft" at={0} volume={0.4} />
      <Sfx name="zoom_in" at={fAbre} volume={0.45} />
      <Sfx name="mouse_click" at={clickP} volume={0.8} />
      <Sfx name="pop_bright" at={fConf - 16} volume={0.5} />
      <Sfx name="mouse_click" at={fConf + 28} volume={0.7} />
      <Sfx name="stamp" at={fYa - 2} volume={0.7} />
      <Sfx name="glitch" at={fReservar - 14} volume={0.3} />
      <Sfx name="draw" at={fCuando - 4} volume={0.5} />
      <Sfx name="envelope" at={fCuando2 - 4} volume={0.8} />
      <Sfx name="notify" at={fCorreo - 6} volume={0.6} />
      <Sfx name="tick_fast" at={fPlazo - 2} volume={0.35} />
    </AbsoluteFill>
  );
};

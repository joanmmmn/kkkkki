import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { clamp01, E, eIO, eOut, follow, lerp, pop, ramp, Stip } from './kit';
import { CARDS, DoorCard } from './frames';
import { Laptop, Phone } from './props';
import { AppLibraries, AppLogin } from './app';
import { bx, Mark, mid, Page, Pointer } from './web';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano G (T07): capítulo III, paso 1. En la web: ebiblio.es (captura real) → la cámara baja a las comunidades y se
// pulsa Madrid. En la app (recreación): se busca la comunidad y se entra con los datos del carné.
// ---------------------------------------------------------------------------------------------------------------
export const SW = 1180, SK = SW / 1280, BZ = SW * 0.028;
export const LX = (1920 - SW - BZ * 2) / 2, LY = 150;
// punto de la página (coordenadas de captura, con desplazamiento `scroll`) → pantalla (laptop en reposo)
export const toScreen = (px: number, py: number, scroll: number, lx = LX, ly = LY) => [lx + BZ + px * SK, ly + BZ + (py - scroll) * SK] as const;

// Placa de paso (número de puerta) y título
export const StepTag: React.FC<{ n: string; title: string; at: number; out?: number }> = ({ n, title, at, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, at, fps, 170, 13);
  const t = ramp(frame, at + 6, at + 20, eOut);
  const o = out ? 1 - ramp(frame, out, out + 12, eIO) : 1;
  if (s <= 0.01 || o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 70, top: 46, display: 'flex', alignItems: 'center', gap: 24, opacity: o }}>
      <div style={{ width: 96, height: 112, borderRadius: 18, background: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 70, color: E.paper,
        transform: `scale(${Math.min(1.1, s)}) rotate(${(1 - Math.min(1, s)) * -20}deg)`, boxShadow: `6px 6px 0 ${E.ink}` }}><span style={{ marginTop: 8 }}>{n}</span></div>
      <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 52, color: E.ink, opacity: t, transform: `translateX(${(1 - t) * -20}px)`, letterSpacing: '-0.01em',
        padding: '10px 28px', borderRadius: 18, background: E.paper, boxShadow: `6px 6px 0 ${E.ink}` }}>{title}</div>
    </div>
  );
};

export const Step1: React.FC<{ dur: number }> = ({ dur }) => {
  const look = CARDS.III;
  return (
    <DoorCard n="III" title={look.title} look={look}>
      <Step1Body dur={dur} />
    </DoorCard>
  );
};

const Step1Body: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T07', 'B08', word, n);
  const fPaso = at('Paso'), fEntra = at('entra'), fElige = at('elige'), fCom = at('comunidad'), fO = at('O'), fApp = at('app'), fBusca = at('busca');
  const fCom2 = at('comunidad', 1), fEntra2 = at('entra', 1), fDatos = at('datos'), fCarne = at('carné');
  const lap = pop(frame, fEntra - 26, fps, 110, 16);
  // desplazamiento de la página: de la cabecera a las comunidades
  const scroll = lerp(0, 860, ramp(frame, fElige - 30, fElige + 2, eIO));
  const madrid = bx('portal:comunidades') as unknown as Record<string, [number, number, number, number]>;
  const tile = (madrid as unknown as Record<string, [number, number, number, number]>)['eBiblio Madrid'];
  const click = fCom + 10;
  const nav = ramp(frame, click + 6, click + 16, eIO); // la página de Madrid sustituye a la del portal
  // la app: el portátil se aparta y entra el móvil
  const side = ramp(frame, fO - 10, fO + 18, eIO);
  const ph = pop(frame, fO - 2, fps, 120, 16);
  const q = 'Madrid'.slice(0, Math.floor(clamp01((frame - (fBusca + 2)) / 22) * 6));
  const tap = ramp(frame, fCom2 + 8, fCom2 + 14, eOut);
  const toLogin = ramp(frame, fEntra2 - 10, fEntra2, eIO);
  const user = '1234 5678'.slice(0, Math.floor(clamp01((frame - fDatos + 6) / 16) * 9));
  const pass = Math.floor(clamp01((frame - fCarne) / 12) * 8);
  const press = ramp(frame, fCarne + 16, fCarne + 20, eOut) * (1 - ramp(frame, fCarne + 20, fCarne + 28, eOut));
  // cámara (antes de apartar el portátil): zoom a las comunidades
  const [tx, ty] = toScreen(940, 1212, 860);
  const cam = follow(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: fElige - 4, x: 960, y: 540, s: 1 },
    { f: fElige + 22, x: tx, y: ty, s: 1.65 },
    { f: click + 4, x: tx + 40, y: ty + 10, s: 1.75 },
    { f: fO - 14, x: 960, y: 540, s: 1 },
    { f: fBusca - 16, x: 960, y: 540, s: 1 },
    { f: fBusca + 8, x: 1300, y: 560, s: 1.32 },
    { f: dur, x: 1310, y: 560, s: 1.34 },
  ], 5.5);
  const lx = lerp(LX, 80, side), ls = lerp(1, 0.74, side);
  return (
    <AbsoluteFill style={{ background: E.mustardPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.14} />
      <div style={{ position: 'absolute', left: -200, top: 640, width: 2400, height: 800, borderRadius: '50%', background: E.mustardLight, opacity: 0.6 }} />
      <AbsoluteFill style={{ transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})`, transformOrigin: '0 0' }}>
        {/* portátil con la web real */}
        {lap > 0.01 && (
          <div style={{ position: 'absolute', left: lx, top: LY + (1 - Math.min(1, lap)) * 700, transform: `scale(${ls})`, transformOrigin: '0 30%' }}>
            <Laptop sw={SW}>
              <Page name="portal" scroll={scroll}>
                {tile && <Mark b={tile} at={fCom - 8} pad={6} out={click + 8} />}
                {tile && <Pointer from={[tile[0] + 260, tile[1] + 220]} to={mid(tile)} at={fCom - 14} click={click} size={64} o={1 - nav} />}
              </Page>
              {nav > 0 && <div style={{ position: 'absolute', inset: 0, opacity: nav }}><Page name="mhome" scroll={0} /></div>}
            </Laptop>
          </div>
        )}
      {/* móvil con la app (recreación) */}
      {ph > 0.01 && (
        <div style={{ position: 'absolute', left: 1240, top: 120 + (1 - Math.min(1, ph)) * 800, transform: `rotate(${(1 - Math.min(1, ph)) * 8 + 2}deg)` }}>
          <Phone w={400}>
            <AppLibraries query={q} tap={tap} caret={frame > fBusca && q.length < 6} />
            {toLogin > 0 && <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - toLogin) * 360}px)` }}><AppLogin user={user} pass={pass} press={press} caretUser={frame > fDatos - 6 && user.length < 9} /></div>}
          </Phone>
          {/* rótulo */}
          <div style={{ position: 'absolute', left: 200, top: -64, transform: 'translateX(-50%)', padding: '8px 24px', borderRadius: 999, background: E.ink, color: E.mustardLight, fontFamily: E.font, fontWeight: 700, fontSize: 30, whiteSpace: 'nowrap',
            opacity: ramp(frame, fApp - 6, fApp + 6, eOut) }}>App eBiblio</div>
        </div>
      )}
      </AbsoluteFill>
      {lap > 0.01 && <div style={{ position: 'absolute', left: lerp(960, 80 + 0.74 * 623, side), top: lerp(990, 820, side), transform: 'translateX(-50%)', padding: '8px 24px', borderRadius: 999, background: E.ink, color: E.mustardLight,
        fontFamily: E.font, fontWeight: 700, fontSize: 30, whiteSpace: 'nowrap', opacity: ramp(frame, fEntra + 4, fEntra + 16, eOut) * (1 - ramp(frame, fElige - 10, fElige, eIO)) + ramp(frame, fO, fO + 12, eOut) * (1 - ramp(frame, fBusca - 16, fBusca, eIO)) }}>ebiblio.es</div>}
      <StepTag n="1" title="Entra en eBiblio" at={fPaso - 4} />
      <Sfx name="whoosh_soft" at={fEntra - 24} volume={0.5} />
      <Sfx name="scroll" at={fElige - 28} volume={0.6} />
      <Sfx name="zoom_in" at={fElige - 2} volume={0.4} />
      <Sfx name="mouse_click" at={click} volume={0.8} />
      <Sfx name="phone_whoosh" at={fO - 4} volume={0.6} />
      <Sfx name="keys_type" at={fBusca + 2} volume={0.6} trimAfter={24} />
      <Sfx name="phone_tap" at={fCom2 + 8} volume={0.7} />
      <Sfx name="swipe" at={fEntra2 - 10} volume={0.4} />
      <Sfx name="keys_type" at={fDatos - 6} volume={0.6} trimAfter={34} />
      <Sfx name="phone_tap" at={fCarne + 16} volume={0.7} />
    </AbsoluteFill>
  );
};

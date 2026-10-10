import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Phase } from '../../components/Phase';
import { Phone } from '../../components/Phone';
import { CheckIcon, CrossIcon, HeadphonesIcon, BookIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';

const W = 1640;

const Row: React.FC<{ ok: boolean; text: string; delay: number; size?: number }> = ({ ok, text, delay, size = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 170 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: font.sans, fontSize: size, fontWeight: 500, opacity: s, transform: `translateX(${(1 - s) * 30}px)` }}>
      <div style={{ transform: `scale(${s})` }}>{ok ? <CheckIcon size={size * 1.05} /> : <CrossIcon size={size * 1.05} />}</div>
      {text}
    </div>
  );
};

// E07 · Herramientas del lector (montaje) → cuenta opcional → app y modo sin conexión.
export const S07Tools: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E07', w, n, fb);
  const fNoct = at('nocturno', 0, 1.2);
  const fDicc = at('decenas', 0, 2.2);
  const fComp = at('lectura', 0, 5.2);
  const fCuenta = at('Para', 0, 8);
  const fReg = at('registras', 0, 10.9);
  const fHist = at('historial', 0, 12.8);
  const fFav = at('favoritos', 0, 13.8);
  const fNotas = at('notas', 0, 15);
  const fApp = at('app', 0, 16.4) - 8;
  const fTexto = at('texto', 0, 19.7);
  const fAudio = at('audio', 0, 20.6);
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const winOut = interpolate(frame, [fCuenta - 10, fCuenta + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flash = (f: number) => interpolate(frame, [f - 3, f, f + 7], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      {/* Montaje del lector */}
      {frame < fCuenta + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - winOut, transform: `scale(${(0.94 + 0.06 * enter) * (1 - winOut * 0.05)})`, filter: `blur(${winOut * 10}px)` }}>
          <BrowserWindow width={W}>
            <Sequence durationInFrames={fNoct + 4} layout="none">
              <ScreenClip image src="elt/shots/10-lector-menu-apariencia-aA.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.3, x: 1000, y: 380 }, { f: fNoct, zoom: 1.75, x: 1000, y: 360 }]}
                marks={[{ from: 8, to: fNoct + 4, x: 1012, y: 328, w: 86, h: 76, r: 38 }]} />
            </Sequence>
            <Sequence from={fNoct + 4} durationInFrames={fDicc - fNoct - 4} layout="none">
              <ScreenClip image src="elt/shots/11-lector-modo-oscuro.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.0, x: 960, y: 560 }, { f: fDicc - fNoct, zoom: 1.12, x: 760, y: 520 }]} />
            </Sequence>
            <Sequence from={fDicc} durationInFrames={fComp - fDicc} layout="none">
              <ScreenClip image src="elt/shots/16-diccionario-desde-seleccion.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.05, x: 960, y: 540 }, { f: 30, zoom: 1.6, x: 980, y: 330 }, { f: fComp - fDicc, zoom: 1.7, x: 980, y: 340 }]}
                marks={[{ from: 24, to: fComp - fDicc, x: 660, y: 254, w: 410, h: 30, r: 8 }]} />
            </Sequence>
            <Sequence from={fComp} layout="none">
              <ScreenClip image src="elt/shots/15-lectura-comparada-es-en-fr.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: 120, zoom: 1.08, x: 960, y: 560 }]} />
            </Sequence>
            <AbsoluteFill style={{ background: '#fff', opacity: Math.max(flash(fNoct + 4), flash(fDicc), flash(fComp)) }} />
          </BrowserWindow>
        </AbsoluteFill>
      )}
      <Callout at={fNoct - 4} until={fDicc - 4} x={960} y={930} anchor="center" size={46}>Modo nocturno</Callout>
      <Callout at={fDicc + 6} until={fComp - 4} x={960} y={930} anchor="center" size={46}>Decenas de diccionarios · ¡incluso de 1726!</Callout>
      {[['Español', 330], ['English', 960], ['Français', 1590]].map(([t, x], i) => (
        <Callout key={t as string} at={fComp + 10 + i * 5} until={fCuenta - 10} x={x as number} y={930} anchor="center" size={42}>{t}</Callout>
      ))}

      {/* Cuenta opcional */}
      <Phase from={fCuenta} to={fApp + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 60 }}>
          <div style={{ width: 720, background: '#fff', borderRadius: 36, padding: 54, boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>SIN CUENTA</div>
            <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700, margin: '10px 0 34px' }}>Entras y escuchas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Row ok text="Leer" delay={8} />
              <Row ok text="Escuchar audiolibros" delay={14} />
            </div>
          </div>
          <div style={{ width: 720, background: '#fff', borderRadius: 36, padding: 54, boxShadow: shadow.card, border: `3px solid ${color.yellow}`, opacity: spring({ frame: frame - fReg, fps }), transform: `translateY(${(1 - spring({ frame: frame - fReg, fps, config: { damping: 18 } })) * 60}px)` }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>CON CUENTA GRATIS</div>
            <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700, margin: '10px 0 34px' }}>Y además…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Row ok text="Historial y «seguir leyendo»" delay={fHist - fCuenta} />
              <Row ok text="Favoritos y marcadores" delay={fFav - fCuenta} />
              <Row ok text="Cuaderno de notas" delay={fNotas - fCuenta} />
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      {/* App móvil */}
      <Phase from={fApp} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
          <Phone height={820} ratio={739 / 430}>
            <Img src={staticFile('elt/img/m01_modal.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Phone>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>APP · ANDROID E IPHONE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '28px 36px', background: '#fff', borderRadius: 28, boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 46, fontWeight: 500, opacity: spring({ frame: frame - fTexto + 30, fps }) }}>
              <BookIcon size={56} /> Texto sin conexión <span style={{ color: color.muted, fontSize: 34 }}>(EPUB · PDF)</span> <CheckIcon size={50} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '28px 36px', background: '#fff', borderRadius: 28, boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 46, fontWeight: 500, opacity: spring({ frame: frame - fAudio + 4, fps }), transform: `scale(${0.9 + 0.1 * spring({ frame: frame - fAudio + 4, fps, config: { damping: 10 } })})` }}>
              <HeadphonesIcon size={56} /> Audio sin conexión <CrossIcon size={50} />
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_fast" at={fNoct + 1} volume={0.25} />
      <Sfx name="whoosh_fast" at={fDicc - 3} volume={0.25} />
      <Sfx name="whoosh_fast" at={fComp - 3} volume={0.25} />
      <Sfx name="whoosh_soft" at={fCuenta - 6} volume={0.3} />
      {[fCuenta + 8, fCuenta + 14, fHist, fFav, fNotas].map((f, i) => <Sfx key={i} name="tick" at={f} volume={0.18} />)}
      <Sfx name="whoosh_deep" at={fApp - 6} volume={0.3} />
      <Sfx name="tick" at={fTexto - 30} volume={0.2} />
      <Sfx name="cross" at={fAudio - 4} volume={0.35} />
    </Stage>
  );
};

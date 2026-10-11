import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { LogoIcon } from '../../components/Logo';
import { Grow } from '../../components/Grow';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut, fmtEs } from '../../lib/anim';
import { w } from './timeline';

const ID = 'X10';

const PriceCard: React.FC<{ at: number; label: string; big: string; unit: string; note: string; stamp?: number; dim?: number }> = ({ at, label, big, unit, note, stamp = 1e9, dim = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 160 } });
  const st = spring({ frame: frame - stamp, fps, config: { damping: 10, stiffness: 220 } });
  return (
    <div style={{ position: 'relative', width: 470, padding: '34px 40px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s * (1 - 0.45 * dim), transform: `translateY(${(1 - s) * 60}px) scale(${(0.9 + 0.1 * s) * (1 - 0.05 * dim)})`, filter: `blur(${(1 - s) * 6}px)` }}>
      <div style={{ fontFamily: font.sans, fontSize: 30, fontWeight: 500, color: color.ink2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -3, lineHeight: 1 }}>{big}</span>
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2 }}>{unit}</span>
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 26, color: color.muted, marginTop: 10 }}>{note}</div>
      {frame >= stamp - 2 && (
        <div style={{ position: 'absolute', right: -24, top: -26, transform: `rotate(${8 - 4 * st}deg) scale(${2 - st})`, opacity: st, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 18, background: color.yellow, boxShadow: '0 16px 40px rgba(255,202,5,0.45)', fontFamily: font.sans, fontWeight: 700, fontSize: 36 }}>
          <LogoIcon size={34} /> −15 %
        </div>
      )}
    </div>
  );
};

// Línea del recibo con importe que cuenta hasta su valor.
const Line: React.FC<{ at: number; label: string; v: number; sign?: string; bold?: boolean }> = ({ at, label, v, sign = '', bold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 170 } });
  const n = v * interpolate(frame, [at, at + 22], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 40, padding: bold ? '18px 0 0' : '10px 0', borderTop: bold ? `2px solid ${color.ink}` : undefined, opacity: s, transform: `translateX(${(1 - s) * -30}px)`, fontFamily: font.sans }}>
      <span style={{ fontSize: bold ? 40 : 32, fontWeight: bold ? 700 : 500, color: bold ? color.ink : color.ink2 }}>{label}</span>
      <span style={{ fontSize: bold ? 64 : 34, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{sign}{fmtEs(n, 2)} ${bold ? <span style={{ fontSize: 30, fontWeight: 500 }}> /mes</span> : null}</span>
    </div>
  );
};

// X10 · Precio: web 11 $/mes o 99 $/año + IVA · App Store 12 €/mes · con SonorBooks −15 % los primeros meses (11,31 $ en nuestra cuenta).
export const X10Price: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W12', word, n);
  const f11 = at('11');
  const f99 = at('99');
  const fApp = at('App');
  const fCon = at('Con');
  const f15 = at('15');
  const fNuestra = at('nuestra') - 6;
  const f1131 = at('11,31');
  const rise = interpolate(frame, [fNuestra - 4, fNuestra + 16], [0, 1], { ...clamp, easing: easeInOut });
  const rc = spring({ frame: frame - fNuestra, fps, config: { damping: 18, stiffness: 130 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50, transform: `translateY(${-rise * 230}px) scale(${1 - rise * 0.28})` }}>
        <Words text="¿Cuánto cuesta?" start={0} size={96} weight={700} />
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Grow at={f11 - 10} w={470} first rise={0}><PriceCard at={f11 - 6} label="Ultra · web, mensual" big="11 $" unit="/mes" note="+ IVA" stamp={f15 - 2} /></Grow>
          <Grow at={f99 - 10} w={470} gap={40} rise={0}><PriceCard at={f99 - 6} label="Ultra · web, anual" big="99 $" unit="/año" note="+ IVA · 8,25 $/mes" stamp={f15 + 6} /></Grow>
          <Grow at={fApp - 10} w={470} gap={40} rise={0}><PriceCard at={fApp - 6} label="Ultra · App Store" big="12 €" unit="/mes" note="IVA incluido" dim={interpolate(frame, [fCon, fCon + 12], [0, 1], clamp)} /></Grow>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontSize: 34, fontWeight: 500, color: color.ink2, opacity: spring({ frame: frame - fCon, fps }) }}>
          <LogoIcon size={38} /> Con el enlace de SonorBooks: <b style={{ color: color.ink }}>−15 % los primeros meses</b> (en la web)
        </div>
      </AbsoluteFill>
      {frame >= fNuestra - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
          <div style={{ width: 860, padding: '30px 50px 34px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: rc, transform: `translateY(${(1 - rc) * 80}px)` }}>
            <div style={{ fontFamily: font.sans, fontSize: 26, letterSpacing: 3, color: color.muted, fontWeight: 500, marginBottom: 6 }}>EN NUESTRA CUENTA · TRAS LA PRUEBA</div>
            <Line at={fNuestra + 6} label="Ultra mensual" v={11} />
            <Line at={fNuestra + 16} label="Descuento SonorBooks (15 %)" v={1.65} sign="−" />
            <Line at={fNuestra + 26} label="IVA (21 %)" v={1.96} sign="+" />
            <Line at={f1131 - 4} label="Total" v={11.31} bold />
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={f11 - 6} />
      <Sfx name="ui_pop" at={f99 - 6} />
      <Sfx name="ui_pop" at={fApp - 6} />
      <Sfx name="stamp" at={f15} />
      <Sfx name="stamp" at={f15 + 8} volume={0.7} />
      <Sfx name="swipe" at={fNuestra} />
      <Sfx name="counter" at={fNuestra + 8} volume={0.6} />
      <Sfx name="coins" at={f1131} volume={0.8} />
    </Stage>
  );
};

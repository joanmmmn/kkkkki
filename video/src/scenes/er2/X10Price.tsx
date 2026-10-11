import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { LogoIcon } from '../../components/Logo';
import { Grow } from '../../components/Grow';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { IcGift } from '../er/icons';
import { clamp, easeInOut, easeOut, fmtEs } from '../../lib/anim';
import { er2Start, ER2_TOTAL, itemAt, w } from './timeline';

// Aviso del final: la barra de reproducción del propio vídeo, con el punto en que llega el truco de los 30 días.
const Teaser: React.FC<{ B: number; fFinal: number; fTruco: number; fGratis: number }> = ({ B, fFinal, fTruco, fGratis }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (f: number, d = 16, st = 170) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: st } });
  const card = sp(B - 4, 18, 140);
  const now = (er2Start(ID) + frame) / ER2_TOTAL;
  const target = er2Start('X12') / ER2_TOTAL;
  const BAR = 1080;
  const draw = interpolate(frame, [fFinal - 2, fFinal + 22], [0, 1], { ...clamp, easing: easeInOut });
  const pin = sp(fTruco - 4, 9, 210);
  const pulse = 1 + 0.08 * Math.max(0, Math.sin((frame - fTruco) / 5)) * (frame > fTruco ? 1 : 0);
  const mm = (p: number) => { const s = Math.floor(p * ER2_TOTAL / fps); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const x0 = now * BAR, x1 = target * BAR;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 1280, padding: '56px 100px 64px', borderRadius: 44, background: '#fff', boxShadow: '0 50px 120px rgba(60,40,0,0.22), 0 10px 30px rgba(0,0,0,0.08)', opacity: card, transform: `translateY(${(1 - card) * 70}px) scale(${0.94 + 0.06 * card})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ fontFamily: font.sans, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: color.muted, opacity: sp(B) }}>Y NO TE VAYAS</div>
        <div style={{ fontFamily: font.sans, fontSize: 82, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.04, textAlign: 'center', opacity: sp(fFinal - 6), transform: `translateY(${(1 - sp(fFinal - 6)) * 20}px)` }}>
          Al final del vídeo, el truco<br />para probarlo <Highlight start={fGratis} dur={12}>gratis</Highlight>
        </div>
        {/* barra de reproducción del propio vídeo */}
        <div style={{ position: 'relative', width: BAR, height: 170, marginTop: 30 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 70, height: 14, borderRadius: 7, background: '#ECECEC' }} />
          <div style={{ position: 'absolute', left: 0, width: x0, top: 70, height: 14, borderRadius: 7, background: color.ink }} />
          {/* flecha discontinua por debajo: de «ahora» al truco */}
          <svg width={BAR} height={170} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <defs><clipPath id="tz-reveal"><rect x={x0 - 10} y={0} width={Math.max(0, (x1 - x0 + 30) * draw)} height={170} /></clipPath></defs>
            <path d={`M ${x0} 100 C ${x0 + 24} 150, ${x1 - 34} 152, ${x1 - 4} 108`} fill="none" stroke={color.ink} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 13" clipPath="url(#tz-reveal)" />
          </svg>
          <div style={{ position: 'absolute', left: x0 - 17, top: 60, width: 34, height: 34, borderRadius: 17, background: color.ink, boxShadow: '0 0 0 8px rgba(16,16,16,0.08)' }} />
          <div style={{ position: 'absolute', right: BAR - x0 + 26, top: 112, whiteSpace: 'nowrap', fontFamily: font.sans, fontSize: 28, fontWeight: 500, color: color.ink2 }}>ahora · {mm(now)}</div>
          <div style={{ position: 'absolute', left: x1 - 32, top: 45, width: 64, height: 64, borderRadius: 32, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(255,202,5,0.55)', transform: `scale(${pin * pulse})` }}>
            <IcGift size={36} w={2.2} />
          </div>
          <div style={{ position: 'absolute', left: x1, top: -14, transform: `translate(-50%, -100%) scale(${pin})`, transformOrigin: '50% 100%', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 30, fontWeight: 700 }}>
            {mm(target)} · el truco: <span style={{ color: color.yellow }}>30 días gratis</span>
          </div>
          <div style={{ position: 'absolute', right: -4, top: 100, fontFamily: font.sans, fontSize: 26, color: color.muted }}>{mm(1)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
  // W12B: «Y no te vayas: al final del vídeo te enseñamos un truco para probarlo gratis.»
  const B = itemAt(ID, 'W12B');
  const tz = (word: string) => w(ID, 'W12B', word);
  const push = interpolate(frame, [B - 8, B + 10], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ transform: `scale(${1 - 0.06 * push})`, filter: push > 0.01 ? `blur(${push * 7}px)` : undefined, opacity: 1 - 0.45 * push }}>
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
      </AbsoluteFill>
      {frame >= B - 8 && <Teaser B={B} fFinal={tz('final')} fTruco={tz('truco')} fGratis={tz('gratis')} />}
      <Sfx name="whoosh_soft" at={B - 6} />
      <Sfx name="ff_scrub" at={tz('final')} volume={0.8} />
      <Sfx name="notify" at={tz('truco') - 2} />
      <Sfx name="marker" at={tz('gratis')} />
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

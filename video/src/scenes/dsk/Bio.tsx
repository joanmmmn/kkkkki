import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Chip, MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, color, CoverIcon, font, KR, KR_DEEP, MiniIcon, NEVA, OLDGOLD, ramp, rampOut, shadow, SkNight, SkStage, Snow } from './kit';
import { sceneClock } from './timeline';
import geo from './geo_ru.json';

// ————————————————————————————————————————————————————————————————
// 01 · Quién era (D07–D13). Mapa propio de la Rusia europea y Siberia occidental (Natural Earth, proyección cónica,
// sin fronteras actuales), viñetas dibujadas y tarjetas. Datos verificados en research/autores/dostoievski/guion.md.
// ————————————————————————————————————————————————————————————————

type P2 = [number, number];
const RU = geo as unknown as { land: string; grat: string; pts: Record<string, P2>; route: P2[]; mosPeter: P2[] };
type MapCam = { f: number; s: number; cx: number; cy: number; tx: number; ty: number };
// cámara del mapa: `c` (punto del mapa) queda en `t` (punto de pantalla) con escala `s`
const useMapCam = (keys: MapCam[]) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys as unknown as { f: number; [k: string]: number }[], p, easeInOut);
  const s = k('s'), cx = k('cx'), cy = k('cy'), tx = k('tx'), ty = k('ty');
  const toScreen = (p: P2): P2 => [tx + s * (p[0] - cx), ty + s * (p[1] - cy)];
  return { s, toScreen, transform: `translate(${tx}px, ${ty}px) scale(${s}) translate(${-cx}px, ${-cy}px)` };
};
const polyD = (pts: P2[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
const polyLen = (pts: P2[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

const RuMap: React.FC<{ transform: string; dark?: boolean; children?: React.ReactNode }> = ({ transform, dark = false, children }) => (
  <AbsoluteFill style={{ transformOrigin: '0 0', transform }}>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <defs>
        <filter id="ru-sh" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <path d={RU.grat} fill="none" stroke={dark ? 'rgba(160,190,220,0.10)' : 'rgba(43,93,125,0.12)'} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <path d={RU.land} fill={dark ? 'rgba(0,0,0,0.5)' : 'rgba(60,40,10,0.16)'} filter="url(#ru-sh)" transform="translate(3 6)" />
      <path d={RU.land} fill={dark ? '#3B4757' : '#E8DFCB'} stroke={dark ? 'rgba(200,220,240,0.35)' : 'rgba(120,90,40,0.45)'} strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
      {children}
    </svg>
  </AbsoluteFill>
);

// Alfiler que cae y etiqueta de ciudad (fuera de la capa escalada, para que el texto no se agrande con el zoom).
const CityPin: React.FC<{ p: P2; at: number; label: string; sub?: string; dark?: boolean; side?: 'left' | 'right'; c?: string }> = ({ p, at, label, sub, dark = false, side = 'right', c = KR }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - at, fps: 50, config: { damping: 11, stiffness: 200 } });
  const card = rampOut(frame, at + 6, at + 20);
  if (frame < at - 1) return null;
  return (
    <div style={{ position: 'absolute', left: p[0], top: p[1] }}>
      <div style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: dark ? '#fff' : color.ink, transform: `scale(${s})`, boxShadow: `0 0 0 6px ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(16,16,16,0.12)'}` }} />
      <svg width="58" height="72" viewBox="0 0 24 30" style={{ position: 'absolute', left: -29, top: -70, transform: `translateY(${(1 - s) * -70}px)`, opacity: Math.min(1, s * 3) }}>
        <path d="M12 29s9-8.4 9-16a9 9 0 1 0-18 0c0 7.6 9 16 9 16z" fill={c} stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="13" r="3.4" fill="#fff" />
      </svg>
      <div style={{ position: 'absolute', ...(side === 'right' ? { left: 40 } : { right: 40 }), top: -78, opacity: card, transform: `translateX(${(1 - card) * (side === 'right' ? -16 : 16)}px)` }}>
        <div style={{ background: dark ? 'rgba(255,255,255,0.96)' : color.ink, color: dark ? color.ink : '#fff', borderRadius: 20, padding: '12px 24px 14px', boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: -0.5 }}>{label}</div>
          {sub && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: dark ? KR : color.yellow }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// Tarjeta blanca a la derecha con rótulo, título y contenido.
const SideCard: React.FC<{ at: number; out?: number; kicker: string; title: string; size?: number; children?: React.ReactNode; top?: number; left?: number; width?: number; dark?: boolean }> = ({
  at, out, kicker, title, size = 64, children, top = 190, left = 1150, width = 660, dark = false,
}) => {
  const frame = useCurrentFrame();
  const p = rampOut(frame, at, at + 14);
  const o = out !== undefined ? ramp(frame, out - 10, out) : 0;
  if (p <= 0.001 || o >= 0.999) return null;
  return (
    <div style={{ position: 'absolute', left, top, width, padding: '42px 46px 48px', background: dark ? 'rgba(18,20,24,0.88)' : '#fff', borderRadius: 32, boxShadow: shadow.card,
      border: dark ? '1px solid rgba(255,255,255,0.12)' : undefined, opacity: p * (1 - o), transform: `translateY(${(1 - p) * 30 - o * 20}px)`, filter: o > 0.01 ? `blur(${o * 8}px)` : undefined }}>
      <Kicker at={at} text={kicker} style={dark ? { color: 'rgba(255,255,255,0.6)' } : undefined} />
      <MaskTitle text={title} at={at + 4} size={size} color={dark ? '#fff' : color.ink} />
      {children}
    </div>
  );
};

// ——— MOSCU · D07 ———
// Moscú (1821) → su padre, médico en un hospital para pobres → San Petersburgo, ingeniero militar → «escribir».
const HospitalIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140">
    <path d="M20 132V58h160v74z" fill="#F4EEE2" stroke={color.ink} strokeWidth="4" />
    <path d="M10 60 100 18l90 42z" fill={color.ink} />
    <rect x="86" y="30" width="28" height="22" rx="3" fill="#fff" />
    <path d="M100 33v16M92 41h16" stroke={KR} strokeWidth="5" strokeLinecap="round" />
    {[40, 70, 120, 150].map((x) => <rect key={x} x={x - 9} y="74" width="18" height="24" rx="2" fill={NEVA} opacity="0.8" />)}
    {[40, 150].map((x) => <rect key={`b${x}`} x={x - 9} y="106" width="18" height="18" rx="2" fill={NEVA} opacity="0.8" />)}
    <path d="M86 132v-30a14 14 0 0 1 28 0v30z" fill={color.ink} />
    {[34, 58, 142, 166].map((x) => <rect key={`c${x}`} x={x - 3} y="58" width="6" height="74" fill="rgba(16,16,16,0.12)" />)}
  </svg>
);

export const Moscu: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MOSCU');
  const fMos = c.at('D07', 'Moscú');
  const fYear = c.at('D07', 'mil');
  const fPadre = c.at('D07', 'padre');
  const fPobres = c.at('D07', 'pobres');
  const fMand = c.at('D07', 'mandaron');
  const fSan = c.at('D07', 'San');
  const fEst = c.at('D07', 'estudiar');
  const fIng = c.at('D07', 'ingeniero');
  const fPero = c.at('D07', 'Pero');
  const fQuer = c.at('D07', 'quería');
  const fEsc = c.at('D07', 'escribir');
  const M = RU.pts.moscu, SP = RU.pts.petersburgo;
  const mid: P2 = [(M[0] + SP[0]) / 2, (M[1] + SP[1]) / 2];
  const cam = useMapCam([
    { f: 0, s: 1, cx: 960, cy: 540, tx: 960, ty: 540 },
    { f: Math.max(16, fMos - 14), s: 1.04, cx: 900, cy: 560, tx: 960, ty: 540 },
    { f: fMos + 16, s: 1.75, cx: M[0], cy: M[1], tx: 640, ty: 640 },
    { f: fMand - 6, s: 1.8, cx: M[0], cy: M[1], tx: 636, ty: 640 },
    { f: fSan + 24, s: 1.6, cx: mid[0], cy: mid[1], tx: 600, ty: 560 },
    { f: c.dur, s: 1.66, cx: mid[0], cy: mid[1] + 4, tx: 600, ty: 560 },
  ]);
  const routeLen = polyLen(RU.mosPeter);
  const draw = ramp(frame, fMand, fSan + 18);
  const strike = ramp(frame, fPero + 4, fPero + 18);
  const write = ramp(frame, fQuer, fEsc + 26, (t) => t);
  return (
    <SkStage>
      <RuMap transform={cam.transform}>
        <path d={polyD(RU.mosPeter)} fill="none" stroke={KR} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${routeLen}`} strokeDashoffset={routeLen * (1 - draw)} vectorEffect="non-scaling-stroke" />
        <path d={polyD(RU.mosPeter)} fill="none" stroke="#fff" strokeWidth={1.4} strokeDasharray="2 10" vectorEffect="non-scaling-stroke" opacity={draw > 0 && draw < 1 ? 0.8 : 0} />
      </RuMap>
      {/* nombre de la región antes del zoom */}
      <div style={{ position: 'absolute', left: 300, top: 160, opacity: rampOut(frame, 6, 20) * (1 - ramp(frame, fMos - 10, fMos + 4)), fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: 'rgba(80,55,20,0.55)', letterSpacing: 2 }}>Imperio ruso</div>
      <CityPin p={cam.toScreen(M)} at={fMos} label="Moscú" sub={frame >= fYear - 2 ? 'Nace en 1821' : undefined} side="left" />
      <CityPin p={cam.toScreen(SP)} at={fSan} label="San Petersburgo" side="left" />
      {/* su padre */}
      <SideCard at={fPadre - 4} out={fMand + 4} kicker="Su padre" title={'Médico en un hospital\npara pobres'} size={54} left={1080} width={780}>
        <div style={{ marginTop: 34, display: 'flex', justifyContent: 'center', opacity: rampOut(frame, fPadre + 4, fPadre + 20), transform: `translateY(${(1 - rampOut(frame, fPadre + 4, fPadre + 20)) * 20}px)` }}>
          <HospitalIcon size={360} />
        </div>
      </SideCard>
      {/* ingeniero militar → escribir */}
      <SideCard at={fEst - 6} kicker="Lo mandan a estudiar para" title="Ingeniero militar" size={64} top={260} left={1100} width={740}>
        <div style={{ position: 'relative', height: 0 }}>
          <div style={{ position: 'absolute', left: -8, top: -44, height: 8, width: 600 * strike, background: KR, borderRadius: 4, transform: 'rotate(-2deg)' }} />
        </div>
        <div style={{ marginTop: 30, display: 'flex', alignItems: 'baseline', gap: 22, opacity: ramp(frame, fPero - 2, fPero + 8) }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>Pero quería</span>
          <span style={{ position: 'relative', fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 104, color: KR, lineHeight: 1,
            WebkitMaskImage: `linear-gradient(90deg, #000 ${write * 112 - 12}%, transparent ${write * 112}%)`, maskImage: `linear-gradient(90deg, #000 ${write * 112 - 12}%, transparent ${write * 112}%)` }}>escribir</span>
        </div>
      </SideCard>
      <Sfx name="zoom_in" at={fMos - 10} volume={0.6} />
      <Sfx name="sk_pin" at={fMos + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fPadre - 3} volume={0.5} />
      <Sfx name="draw" at={fMand} volume={0.4} dur={fSan + 18 - fMand} fade={8} />
      <Sfx name="sk_pin" at={fSan + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fEst - 5} volume={0.5} />
      <Sfx name="pencil_strike" at={fPero + 4} volume={0.6} />
      <Sfx name="dk_quill" at={fQuer} volume={0.8} />
    </SkStage>
  );
};

// ——— POBRES · D08 ———
// La novela (1846) → su compañero de piso y Nekrásov la leen de un tirón → el reloj corre hasta las 4 de la mañana → llaman
// a la puerta → «23 años».
const Clock: React.FC<{ size: number; hour: number; glow?: number }> = ({ size, hour, glow = 0 }) => {
  const hA = (hour / 12) * 360;
  const mA = (hour % 1) * 360;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="clk-face" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stopColor="#FFFDF6" /><stop offset="1" stopColor="#E9DFC8" /></radialGradient>
        <linearGradient id="clk-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2D891" /><stop offset="0.5" stopColor="#B88A34" /><stop offset="1" stopColor="#7A5A1E" /></linearGradient>
      </defs>
      <circle cx="100" cy="100" r="112" fill={`rgba(255,214,120,${0.25 * glow})`} />
      <circle cx="100" cy="100" r="98" fill="url(#clk-rim)" />
      <circle cx="100" cy="100" r="86" fill="url(#clk-face)" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const big = i % 5 === 0;
        return <line key={i} x1={100 + Math.sin(a) * (big ? 70 : 76)} y1={100 - Math.cos(a) * (big ? 70 : 76)} x2={100 + Math.sin(a) * 80} y2={100 - Math.cos(a) * 80} stroke="#2A2420" strokeWidth={big ? 3.4 : 1.2} />;
      })}
      {['XII', 'III', 'VI', 'IX'].map((t, i) => {
        const a = (i / 4) * Math.PI * 2;
        return <text key={t} x={100 + Math.sin(a) * 56} y={100 - Math.cos(a) * 56 + 7} textAnchor="middle" fontFamily="EB Garamond" fontSize="20" fontWeight="600" fill="#2A2420">{t}</text>;
      })}
      <line x1="100" y1="100" x2={100 + Math.sin((hA * Math.PI) / 180) * 42} y2={100 - Math.cos((hA * Math.PI) / 180) * 42} stroke="#1A1612" strokeWidth="7" strokeLinecap="round" />
      <line x1="100" y1="100" x2={100 + Math.sin((mA * Math.PI) / 180) * 66} y2={100 - Math.cos((mA * Math.PI) / 180) * 66} stroke="#1A1612" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill={KR} />
    </svg>
  );
};

export const Pobres: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('POBRES');
  const fPob = c.at('D08', 'Pobres');
  const fGus = c.at('D08', 'gustó');
  const fComp = c.at('D08', 'compañero');
  const fNek = c.at('D08', 'Nekrásov');
  const fLey = c.at('D08', 'leyeron');
  const fCua = c.at('D08', 'cuatro');
  const fMan = c.at('D08', 'mañana');
  const fDesp = c.at('D08', 'despertarlo');
  const fFel = c.at('D08', 'felicitarlo');
  const fTen = c.at('D08', 'Tenía');
  const bookIn = spring({ frame: frame - 2, fps: 50, config: { damping: 16, stiffness: 90 } });
  const shift = ramp(frame, fGus - 4, fGus + 20);
  const endOut = ramp(frame, fTen - 10, fTen + 6);
  // reloj: de las 20:00 a las 4:00 (16 → 28 en horas corridas), con prisa «de un tirón»
  const hour = interpolate(frame, [fLey - 4, fCua + 4], [20, 28], { ...clamp, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) });
  const clockIn = rampOut(frame, fLey - 10, fLey + 8);
  const knock = [fDesp, fDesp + 9, fDesp + 18];
  const shake = knock.reduce((s, k) => s + (frame >= k && frame < k + 8 ? Math.sin((frame - k) * 2.4) * (1 - (frame - k) / 8) * 7 : 0), 0);
  const lit = ramp(frame, fDesp + 22, fDesp + 34);
  const b = BOOKS.pobres;
  return (
    <SkNight lamp={[700 - 260 * shift, 440]}>
      <AbsoluteFill style={{ background: `rgba(255,214,140,${0.08 * lit})` }} />
      {/* el libro */}
      <div style={{ position: 'absolute', left: 810 - 470 * shift, top: 250 + 30 * shift, opacity: Math.min(1, bookIn * 1.5) * (1 - endOut), transform: `scale(${(0.86 + 0.14 * bookIn) * (1 - 0.18 * shift)}) translateY(${(1 - bookIn) * 60}px)`, transformOrigin: '50% 50%' }}>
        <Book3D b={b} w={300} h={450} d={50} ry={-22 + 12 * shift + Math.sin(frame / 60) * 3} rx={4} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', opacity: rampOut(frame, fPob - 10, fPob + 6) * (1 - shift) }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Su primera novela · manuscrito de 1845</div>
      </div>
      {/* los dos primeros lectores */}
      <div style={{ position: 'absolute', left: 720, top: 330, display: 'flex', flexDirection: 'column', gap: 30, opacity: 1 - ramp(frame, fLey + 18, fLey + 32) }}>
        <Chip at={fComp - 4} label="Su compañero de piso" icon={<MiniIcon kind="book" size={34} c={color.ink} />} dark size={44} />
        <Chip at={fNek - 4} label="El poeta Nekrásov" icon={<CoverIcon kind="feather" size={34} c={color.ink} sw={2} />} dark size={44} />
        <div style={{ marginTop: 10, marginLeft: 8, fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: '#F3EAD8', opacity: rampOut(frame, fLey, fLey + 12), transform: `translateX(${(1 - rampOut(frame, fLey, fLey + 12)) * -20}px)` }}>la leen de un tirón…</div>
      </div>
      {/* el reloj */}
      {clockIn > 0.01 && (
        <div style={{ position: 'absolute', left: 1080, top: 210, opacity: clockIn * (1 - endOut), transform: `translate(${shake}px, ${(1 - clockIn) * 30}px) scale(${0.9 + 0.1 * clockIn})` }}>
          <Clock size={480} hour={hour} glow={ramp(frame, fCua, fCua + 10)} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', opacity: rampOut(frame, fCua, fCua + 12) }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: -2, color: '#fff' }}>4:00</span>
            <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 46, color: color.yellow, marginLeft: 18, opacity: rampOut(frame, fMan - 2, fMan + 10) }}>de la mañana</span>
          </div>
        </div>
      )}
      {/* ¡toc, toc! */}
      {knock.map((k, i) => {
        const s = spring({ frame: frame - k, fps: 50, config: { damping: 10, stiffness: 220 } });
        if (frame < k) return null;
        return <div key={i} style={{ position: 'absolute', left: 1000 + i * 150, top: 120 - (i % 2) * 30, fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.yellow, opacity: s * (1 - ramp(frame, fFel + 4, fFel + 16)) * (1 - endOut), transform: `scale(${0.6 + 0.4 * s}) rotate(${(i - 1) * 8}deg)` }}>¡toc!</div>;
      })}
      {/* 23 años */}
      {frame >= fTen - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', opacity: rampOut(frame, fTen - 2, fTen + 12) }}>Tenía</div>
          <MaskTitle text="23 años" at={fTen + 6} size={230} align="center" color="#fff" />
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_soft" at={0} volume={0.5} />
      <Sfx name="sk_book_thud" at={14} volume={0.4} />
      <Sfx name="ui_pop" at={fComp - 3} volume={0.5} />
      <Sfx name="ui_pop" at={fNek - 3} volume={0.5} />
      <Sfx name="page_riffle" at={fLey} volume={0.6} />
      <Sfx name="sk_clock" at={fLey} volume={0.6} dur={fCua - fLey + 10} fade={8} />
      <Sfx name="dk_bell" at={fCua + 2} volume={0.45} />
      <Sfx name="dk_knock" at={fDesp - 2} volume={0.9} />
      <Sfx name="hit_soft" at={fTen + 6} volume={0.6} />
    </SkNight>
  );
};

// ——— SIBERIA · D09–D10 ———
// Detenido en 1849 (círculo de Petrashevski) → del simulacro al presidio de Omsk, encadenado → cinco años de soldado
// (Semipalatinsk) → el único libro: el Nuevo Testamento.
const TESTAMENT: BookDef = { title: 'Nuevo Testamento', bg: '#2B1B12', fg: '#F3EAD8', accent: '#E3C27A', icon: 'cross', author: '' };
export const Siberia: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('SIBERIA');
  const fDet = c.at('D09', 'detuvieron');
  const fCirc = c.at('D09', 'círculo');
  const fIdeas = c.at('D09', 'ideas');
  const fSim = c.at('D09', 'simulacro');
  const fPaso = c.at('D09', 'pasó');
  const fCuat = c.at('D09', 'cuatro');
  const fSib = c.at('D09', 'Siberia');
  const fEnc = c.at('D09', 'encadenado');
  const fOtros = c.at('D09', 'otros');
  const fSold = c.at('D09', 'soldado');
  const p10 = c.part('D10');
  const fLibro = c.at('D10', 'libro');
  const fNuevo = c.at('D10', 'Nuevo');
  const SP = RU.pts.petersburgo, OM = RU.pts.omsk, SE = RU.pts.semipalatinsk;
  const cam = useMapCam([
    { f: 0, s: 2.0, cx: SP[0], cy: SP[1], tx: 560, ty: 560 },
    { f: fSim, s: 2.05, cx: SP[0], cy: SP[1], tx: 560, ty: 560 },
    { f: fSib + 6, s: 1.06, cx: 1040, cy: 600, tx: 960, ty: 470 },
    { f: fOtros, s: 1.1, cx: 1080, cy: 610, tx: 960, ty: 470 },
    { f: fSold + 30, s: 1.2, cx: 1180, cy: 640, tx: 960, ty: 470 },
    { f: c.dur, s: 1.24, cx: 1190, cy: 640, tx: 960, ty: 470 },
  ]);
  const route = RU.route;
  const rLen = polyLen(route);
  const draw = ramp(frame, fPaso - 6, fSib + 10);
  const toSem: P2[] = [OM, [OM[0] + 90, OM[1] + 50], SE];
  const sLen = polyLen(toSem);
  const draw2 = ramp(frame, fOtros - 6, fSold + 6);
  const snow = ramp(frame, fPaso - 10, fSib);
  const endBlur = ramp(frame, p10 - 16, p10 + 10);
  // línea de tiempo: 4 + 5 años
  const tl = rampOut(frame, fCuat - 6, fCuat + 10);
  const seg1 = ramp(frame, fCuat, fSib + 6);
  const seg2 = ramp(frame, fOtros, fSold + 10);
  const TW = 1180, x0 = 370;
  const chain = (n: number, w: number) => Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: 'absolute', left: i * (w / n) + 2, top: 9, width: w / n + 8, height: 22, borderRadius: 12, border: '4px solid rgba(255,255,255,0.55)', boxSizing: 'border-box' }} />);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #17202B 0%, #0E141C 60%, #080B10 100%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: endBlur > 0.01 ? `blur(${endBlur * 10}px) brightness(${1 - endBlur * 0.45})` : undefined, opacity: 1 - 0.97 * endBlur }}>
        <RuMap transform={cam.transform} dark>
          <path d={polyD(route)} fill="none" stroke="#E8505B" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${rLen}`} strokeDashoffset={rLen * (1 - draw)} vectorEffect="non-scaling-stroke" />
          <path d={polyD(toSem)} fill="none" stroke="#7FB3E0" strokeWidth={4} strokeLinecap="round" strokeDasharray={`${sLen}`} strokeDashoffset={sLen * (1 - draw2)} vectorEffect="non-scaling-stroke" />
        </RuMap>
        <Snow n={150} wind={1.4} opacity={0.85 * snow} seed="sib" />
        <CityPin p={cam.toScreen(SP)} at={6} label="San Petersburgo" sub="1849" dark side="right" c={NEVA} />
        <CityPin p={cam.toScreen(OM)} at={fSib} label="Omsk" sub="Presidio" dark side="left" />
        <CityPin p={cam.toScreen(SE)} at={fSold - 4} label="Semipalatinsk" sub="Soldado" dark c={NEVA} />
        {/* detenido */}
        <SideCard at={fDet - 6} out={fSim + 6} kicker="Detenido en 1849" title={'Por reunirse con\nun círculo'} size={60} top={210} left={1140} dark>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
            <Chip at={fIdeas - 4} label="Ideas prohibidas" icon={<CoverIcon kind="eye" size={30} c={color.ink} sw={2} />} size={40} />
            <Chip at={fIdeas + 10} label="El círculo de Petrashevski" sub="Lecturas y debates" icon={<MiniIcon kind="book" size={30} c={color.ink} />} size={34} accent="#E9EEF3" />
          </div>
        </SideCard>
        {/* sello «detenido» */}
        {frame >= fDet && frame < fSim + 8 && (() => {
          const s = spring({ frame: frame - fDet, fps: 50, config: { damping: 12, stiffness: 260 } });
          return <div style={{ position: 'absolute', left: 300, top: 220, padding: '8px 30px', border: `7px solid ${KR}`, borderRadius: 14, color: '#E8505B', fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: 8,
            transform: `rotate(-9deg) scale(${2 - s})`, opacity: Math.min(1, s * 2) * (1 - ramp(frame, fSim - 4, fSim + 8)), background: 'rgba(163,25,47,0.12)' }}>DETENIDO</div>;
        })()}
        {/* encadenado */}
        {frame >= fEnc - 2 && (
          <div style={{ position: 'absolute', left: cam.toScreen(OM)[0] - 120, top: cam.toScreen(OM)[1] + 46, opacity: rampOut(frame, fEnc - 2, fEnc + 10) * (1 - ramp(frame, fOtros - 8, fOtros + 4)) }}>
            <Chip at={fEnc - 2} label="Encadenado" icon={<CoverIcon kind="chain" size={32} c={color.ink} sw={2} />} size={40} />
          </div>
        )}
        {/* línea de tiempo */}
        {tl > 0.01 && (
          <div style={{ position: 'absolute', left: x0, top: 900, width: TW, opacity: tl, transform: `translateY(${(1 - tl) * 20}px)` }}>
            <div style={{ position: 'relative', height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (TW * 4) / 9 * seg1, borderRadius: 20, background: KR, overflow: 'hidden' }}>{chain(8, (TW * 4) / 9)}</div>
              <div style={{ position: 'absolute', left: (TW * 4) / 9 + 6, top: 0, bottom: 0, width: ((TW * 5) / 9 - 6) * seg2, borderRadius: 20, background: NEVA }} />
            </div>
            <div style={{ position: 'relative', height: 60, marginTop: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: '#fff', whiteSpace: 'nowrap' }}>
              <span style={{ position: 'absolute', left: 0, opacity: seg1 > 0.05 ? 1 : 0 }}>4 años de presidio <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>· 1850–1854</span></span>
              <span style={{ position: 'absolute', left: (TW * 4) / 9 + 30, opacity: seg2 > 0.05 ? 1 : 0 }}>5 años de soldado <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>· 1854–1859</span></span>
            </div>
          </div>
        )}
      </AbsoluteFill>
      {/* el único libro */}
      {frame >= p10 - 10 && (
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 300, top: 160, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,110,0.28) 0%, rgba(255,200,110,0.06) 45%, rgba(255,200,110,0) 70%)', opacity: endBlur }} />
          <div style={{ position: 'absolute', left: 480, top: 230, opacity: rampOut(frame, p10 - 6, p10 + 14), transform: `translateY(${(1 - rampOut(frame, p10 - 6, p10 + 14)) * 40}px)` }}>
            <Book3D b={TESTAMENT} w={300} h={430} d={60} ry={-24 + Math.sin(frame / 50) * 3} rx={5} />
          </div>
          <div style={{ position: 'absolute', left: 940, top: 360, width: 820 }}>
            <Kicker at={p10} text="En el presidio" style={{ color: 'rgba(255,255,255,0.6)' }} />
            <MaskTitle text={'El único libro que\nle dejaban leer:'} at={fLibro - 6} size={58} color="#fff" />
            <div style={{ marginTop: 22 }}>
              <MaskTitle text="el Nuevo Testamento" at={fNuevo - 2} size={92} color={OLDGOLD} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="dk_chains" at={2} volume={0.35} />
      <Sfx name="stamp" at={fDet} volume={0.6} />
      <Sfx name="ui_pop" at={fIdeas - 3} volume={0.5} />
      <Sfx name="zoom_out" at={fPaso - 10} volume={0.5} />
      <Sfx name="sk_wind" at={fPaso - 10} volume={0.8} dur={p10 - fPaso + 20} fade={30} />
      <Sfx name="draw" at={fPaso - 6} volume={0.35} dur={fSib + 16 - fPaso} fade={10} />
      <Sfx name="sk_pin" at={fSib + 2} volume={0.6} />
      <Sfx name="dk_chains" at={fEnc - 2} volume={0.8} />
      <Sfx name="sk_pin" at={fSold - 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={p10 - 14} volume={0.5} />
      <Sfx name="shimmer" at={fNuevo} volume={0.5} />
    </AbsoluteFill>
  );
};

// ——— STENO · D11–D12 ———
// La ruleta y las deudas → el contrato de 1865 (cláusulas que aparecen al decirlas) → Anna Snítkina, taquígrafa →
// calendario de 26 días → «a tiempo» → dos anillos (se casan en 1867).
export const Roulette: React.FC<{ size: number; rot: number; ball: number }> = ({ size, rot, ball }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
    <defs>
      <radialGradient id="rl-wood" cx="0.5" cy="0.45" r="0.6"><stop offset="0.7" stopColor="#6B3E1F" /><stop offset="1" stopColor="#3A1F0E" /></radialGradient>
    </defs>
    <ellipse cx="100" cy="190" rx="92" ry="10" fill="rgba(0,0,0,0.25)" />
    <circle cx="100" cy="100" r="96" fill="url(#rl-wood)" />
    <circle cx="100" cy="100" r="80" fill="#2A1A10" />
    <g transform={`rotate(${rot} 100 100)`}>
      {Array.from({ length: 37 }).map((_, i) => {
        const a0 = (i / 37) * Math.PI * 2, a1 = ((i + 1) / 37) * Math.PI * 2;
        const f = i === 0 ? '#1F7A4A' : i % 2 ? '#A3192F' : '#141414';
        return <path key={i} d={`M100 100 L${100 + Math.sin(a0) * 76} ${100 - Math.cos(a0) * 76} A76 76 0 0 1 ${100 + Math.sin(a1) * 76} ${100 - Math.cos(a1) * 76} Z`} fill={f} />;
      })}
      <circle cx="100" cy="100" r="46" fill="#5A3418" />
      <circle cx="100" cy="100" r="40" fill="#C9A24E" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x="97" y="62" width="6" height="76" rx="3" fill="#E9C877" transform={`rotate(${k * 45} 100 100)`} />)}
      <circle cx="100" cy="100" r="9" fill="#F2D891" />
    </g>
    <circle cx={100 + Math.sin(ball) * 64} cy={100 - Math.cos(ball) * 64} r="5.5" fill="#fff" />
  </svg>
);

const Note: React.FC<{ w: number; seed: string }> = ({ w, seed }) => (
  <div style={{ width: w, height: w * 0.6, background: '#F4ECDA', borderRadius: 4, boxShadow: '0 10px 24px rgba(0,0,0,0.22)', padding: w * 0.07, boxSizing: 'border-box', position: 'relative' }}>
    <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: w * 0.12, color: '#3A2A1A' }}>Pagaré</div>
    {[0, 1, 2].map((i) => <div key={i} style={{ marginTop: w * 0.05, height: 3, width: `${60 + random(`${seed}${i}`) * 35}%`, background: 'rgba(58,42,26,0.35)', borderRadius: 2 }} />)}
    <div style={{ position: 'absolute', right: w * 0.07, bottom: w * 0.06, fontFamily: font.sans, fontWeight: 700, fontSize: w * 0.11, color: KR }}>{Math.round(100 + random(`${seed}n`) * 900)} rublos</div>
  </div>
);

export const Steno: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('STENO');
  const fRul = c.at('D11', 'ruleta');
  const fDeu = c.at('D11', 'deudas');
  const fAno = c.at('D11', 'mil');
  const fFir = c.at('D11', 'firmó');
  const fTerr = c.at('D11', 'terrible');
  const fNov = c.at('D11', 'novela');
  const fAntes = c.at('D11', 'antes');
  const fEdit = c.at('D11', 'editor');
  const fGratis = c.at('D11', 'gratis');
  const fNueve = c.at('D11', 'nueve');
  const p12 = c.part('D12');
  const fTaq = c.at('D12', 'taquígrafa');
  const fAnna = c.at('D12', 'Anna');
  const fDic = c.at('D12', 'dictó');
  const fDias = c.at('D12', 'días');
  const fLleg = c.at('D12', 'Llegó');
  const fMeses = c.at('D12', 'meses');
  const fCaso = c.at('D12', 'casó');
  const rot = interpolate(frame, [0, fAno + 30], [0, 1500], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2.2) });
  const ball = -interpolate(frame, [0, fAno + 30], [0, 40], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const out1 = ramp(frame, fAno - 6, fAno + 16);
  const ctIn = rampOut(frame, fAno - 2, fAno + 18);
  const ctSide = ramp(frame, p12 - 10, p12 + 16);
  const clauses = [
    { at: fNov - 6, n: '1', t: 'Una novela nueva', hi: false },
    { at: fAntes - 4, n: '2', t: 'antes del 1 de noviembre de 1866', hi: false },
    { at: fEdit - 4, n: '3', t: 'si no, el editor podrá publicar gratis todo lo que escriba', hi: true },
  ];
  const sig = ramp(frame, fFir, fFir + 30, (t) => t);
  const terr = spring({ frame: frame - fTerr, fps: 50, config: { damping: 12, stiffness: 220 } });
  const nine = spring({ frame: frame - fNueve, fps: 50, config: { damping: 11, stiffness: 200 } });
  // calendario: octubre de 1866, del 4 al 29 (26 días de dictado)
  const calIn = rampOut(frame, fDic - 8, fDic + 10);
  const dayAt = (d: number) => fDic + 6 + (d - 4) * ((fDias + 10 - fDic - 6) / 25);
  const done = frame >= fDias + 10 ? 26 : Math.max(0, Math.min(26, Math.floor((frame - fDic - 6) / ((fDias + 10 - fDic - 6) / 25)) + 1));
  const stamp = spring({ frame: frame - fLleg, fps: 50, config: { damping: 12, stiffness: 260 } });
  const rings = spring({ frame: frame - fCaso + 6, fps: 50, config: { damping: 14, stiffness: 120 } });
  const calOut = ramp(frame, fMeses - 6, fMeses + 10);
  return (
    <SkStage>
      {/* ruleta y deudas */}
      {out1 < 0.999 && (
        <AbsoluteFill style={{ opacity: 1 - out1, transform: `translateX(${-out1 * 300}px)` }}>
          <div style={{ position: 'absolute', left: 300, top: 210, transform: `scale(${0.8 + 0.2 * rampOut(frame, 0, 20)})` }}>
            <Roulette size={620} rot={rot} ball={ball} />
          </div>
          <div style={{ position: 'absolute', left: 1080, top: 330 }}>
            <MaskTitle text="La ruleta" at={fRul - 6} size={110} />
            <div style={{ marginTop: 10 }}><MaskTitle text="y las deudas" at={fDeu - 6} size={110} color={KR} /></div>
          </div>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = fDeu - 4 + i * 4;
            const s = spring({ frame: frame - a, fps: 50, config: { damping: 13, stiffness: 140 } });
            if (frame < a) return null;
            const x = 1060 + random(`nx${i}`) * 640, y = 640 + random(`ny${i}`) * 200;
            return <div key={i} style={{ position: 'absolute', left: x, top: y - (1 - s) * 500, transform: `rotate(${(random(`nr${i}`) - 0.5) * 40}deg)`, opacity: Math.min(1, s * 2) }}><Note w={230} seed={`n${i}`} /></div>;
          })}
        </AbsoluteFill>
      )}
      {/* el contrato */}
      {ctIn > 0.01 && (
        <div style={{ position: 'absolute', left: 300 - 210 * ctSide, top: 170 + 110 * ctSide, width: 1320, opacity: ctIn * (1 - 0.35 * ctSide), transform: `translateY(${(1 - ctIn) * 120}px) rotate(${-1.2 + 2.4 * ctSide}deg) scale(${1 - 0.33 * ctSide})`, transformOrigin: '0 0' }}>
          <div style={{ position: 'relative', background: '#F7F0DF', borderRadius: 6, padding: '56px 80px 60px', boxShadow: `0 40px 90px rgba(40,24,8,0.28), 0 0 0 ${terr * 6 * (1 - ramp(frame, fTerr + 20, fTerr + 50))}px rgba(163,25,47,0.5)`,
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 51px, rgba(60,40,10,0.08) 51px, rgba(60,40,10,0.08) 53px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 76, letterSpacing: 10, color: '#2A2016' }}>CONTRATO</div>
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: '#5A4630' }}>San Petersburgo, 1865</div>
            </div>
            <div style={{ height: 3, background: '#2A2016', margin: '18px 0 36px', opacity: 0.6 }} />
            {clauses.map((q) => {
              const p = rampOut(frame, q.at, q.at + 14);
              return (
                <div key={q.n} style={{ display: 'flex', gap: 26, alignItems: 'baseline', marginBottom: 26, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
                  <span style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 48, color: KR }}>{q.n}.</span>
                  <span style={{ fontFamily: font.serif, fontSize: 54, lineHeight: 1.15, color: '#2A2016' }}>
                    {q.t}
                    {q.hi && <span style={{ display: 'inline-block', marginLeft: 16, padding: '0 16px 4px', background: KR, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 52, borderRadius: 10, transform: `scale(${0.6 + 0.4 * nine})`, opacity: Math.min(1, nine * 2) }}>durante 9 años</span>}
                  </span>
                </div>
              );
            })}
            {/* firma */}
            <svg width="520" height="120" viewBox="0 0 520 120" style={{ position: 'absolute', right: 70, bottom: -10 }}>
              <path d="M10 80 C 40 20, 70 20, 60 70 S 110 110, 140 50 S 180 20, 190 70 C 200 100, 230 40, 260 60 S 320 90, 350 50 C 370 30, 400 70, 430 55 S 480 40, 505 60" fill="none" stroke="#1D2A4A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray="900" strokeDashoffset={900 * (1 - sig)} />
            </svg>
            {/* «a tiempo» */}
            {frame >= fLleg && (
              <div style={{ position: 'absolute', right: 120, top: 60, padding: '6px 26px', border: '8px solid #1F7A4A', borderRadius: 16, color: '#1F7A4A', fontFamily: font.sans, fontWeight: 700, fontSize: 84, letterSpacing: 6,
                transform: `rotate(-10deg) scale(${2.2 - 1.2 * stamp})`, opacity: Math.min(1, stamp * 2), background: 'rgba(31,122,74,0.08)' }}>A TIEMPO</div>
            )}
          </div>
          <div style={{ position: 'absolute', left: 80, top: -64, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: KR, padding: '8px 26px 12px', borderRadius: 999, transform: `scale(${terr}) rotate(-3deg)`, opacity: Math.min(1, terr * 2) * (1 - ctSide) }}>Un contrato terrible</div>
        </div>
      )}
      {/* Anna Snítkina */}
      {frame >= fTaq - 10 && (
        <div style={{ position: 'absolute', left: 1040, top: 120, width: 760, opacity: rampOut(frame, fTaq - 10, fTaq + 6) * (1 - calOut * 0), transform: `translateX(${(1 - rampOut(frame, fTaq - 10, fTaq + 6)) * 60}px)` }}>
          <div style={{ background: '#fff', borderRadius: 28, padding: '34px 40px', boxShadow: shadow.card }}>
            <Kicker at={fTaq - 8} text="Una taquígrafa" />
            <MaskTitle text="Anna Snítkina" at={fAnna - 4} size={76} />
            <svg width="600" height="70" viewBox="0 0 600 70" style={{ marginTop: 18 }}>
              <path d="M5 40 q 20 -30 40 0 t 40 0 l 20 -20 q 10 30 30 10 t 30 -10 l 30 20 q 20 -40 40 0 l 15 -15 q 25 25 45 5 t 40 -10 l 20 25 q 15 -30 35 0 t 40 0 l 25 -20 q 20 30 40 5 t 40 -5"
                fill="none" stroke={NEVA} strokeWidth="4" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - ramp(frame, fAnna, fDic + 40, (t) => t))} />
            </svg>
          </div>
          {/* calendario */}
          <div style={{ marginTop: 26, background: '#fff', borderRadius: 28, padding: '28px 34px 34px', boxShadow: shadow.card, opacity: calIn * (1 - calOut), transform: `translateY(${(1 - calIn) * 30}px)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>Octubre de 1866</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: KR, fontVariantNumeric: 'tabular-nums', opacity: done > 0 ? 1 : 0 }}>{done} {done === 1 ? 'día' : 'días'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {/* fechas del calendario juliano, el que se usaba en Rusia: dictado del 4 al 29 de octubre */}
              {Array.from({ length: 31 }).map((_, i) => {
                const d = i + 1;
                const on = d >= 4 && d <= 29 && frame >= dayAt(d);
                const p = on ? rampOut(frame, dayAt(d), dayAt(d) + 8) : 0;
                return (
                  <div key={d} style={{ height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 26,
                    background: p > 0 ? `rgba(163,25,47,${0.12 + 0.88 * p})` : '#F3F1EC', color: p > 0.5 ? '#fff' : color.ink2, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * p)})` }}>{d}</div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, opacity: rampOut(frame, fDic + 4, fDic + 16) }}>
              <span style={{ width: 54, height: 54, borderRadius: 12, background: BOOKS.jugador.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CoverIcon kind="roulette" size={38} c={BOOKS.jugador.accent} sw={1.6} /></span>
              Le dicta <i style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 40 }}>El jugador</i>
            </div>
          </div>
        </div>
      )}
      {/* anillos */}
      {frame >= fCaso - 8 && (
        <div style={{ position: 'absolute', left: 1160, top: 540, opacity: Math.min(1, rings * 1.6), transform: `translateY(${(1 - rings) * 40}px)` }}>
          <svg width="380" height="230" viewBox="0 0 380 230">
            <defs><linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.45" stopColor="#D9A944" /><stop offset="1" stopColor="#8C6A2C" /></linearGradient></defs>
            <circle cx={150 + 24 * (1 - rings)} cy="120" r="80" fill="none" stroke="url(#ring)" strokeWidth="18" />
            <circle cx={232 - 24 * (1 - rings)} cy="120" r="80" fill="none" stroke="url(#ring)" strokeWidth="18" />
          </svg>
          <div style={{ textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, marginTop: 6 }}>Se casan en 1867</div>
        </div>
      )}
      <Sfx name="dk_roulette" at={2} volume={0.7} />
      <Sfx name="coins" at={fDeu} volume={0.5} />
      {Array.from({ length: 4 }).map((_, i) => <Sfx key={i} name="page_turn" at={fDeu + i * 8} volume={0.35} />)}
      <Sfx name="whoosh_soft" at={fAno - 6} volume={0.6} />
      <Sfx name="dk_quill" at={fFir} volume={0.8} />
      <Sfx name="hit_soft" at={fTerr} volume={0.6} />
      {clauses.map((q) => <Sfx key={q.n} name="ui_pop" at={q.at + 1} volume={0.4} />)}
      <Sfx name="stamp" at={fNueve} volume={0.5} />
      <Sfx name="whoosh_soft" at={p12 - 10} volume={0.5} />
      <Sfx name="sk_typing" at={fAnna} volume={0.35} dur={fDias - fAnna + 20} fade={10} />
      <Sfx name="stamp" at={fLleg} volume={0.7} />
      <Sfx name="sk_chime" at={fCaso} volume={0.6} />
    </SkStage>
  );
};

// ——— FIN · D13 ———
// 1881 y Los hermanos Karamázov (1880) → un río de velas: decenas de miles de personas acompañaron su ataúd.
export const Fin: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FIN');
  const fKar = c.at('D13', 'Los');
  const fDec = c.at('D13', 'Decenas');
  const fAcom = c.at('D13', 'acompañaron');
  const out1 = ramp(frame, fDec - 14, fDec + 6);
  const candles = ramp(frame, fDec - 10, fDec + 40);
  const N = 520;
  return (
    <SkNight lamp={[960, 520]} dust={false}>
      {/* procesión de velas: filas en perspectiva hacia el fondo */}
      <AbsoluteFill style={{ opacity: candles }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 520, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(30,20,10,0.4) 100%)' }} />
        {Array.from({ length: N }).map((_, i) => {
          const r = (k: string) => random(`cnd-${i}-${k}`);
          const depth = Math.pow(r('d'), 1.6); // 0 = lejos
          const y = 500 + depth * 600;
          const sp = 0.4 + depth * 1.6;
          const x = ((r('x') * 2400 + (frame - fDec) * sp) % 2400) - 240;
          const s = 3 + depth * 15;
          const fl = 0.7 + 0.3 * Math.sin(frame / (3 + r('f') * 3) + r('p') * 6);
          const appear = ramp(frame, fDec - 10 + r('a') * 50, fDec + 10 + r('a') * 50);
          return <div key={i} style={{ position: 'absolute', left: x, top: y - s, width: s, height: s * 1.5, borderRadius: '50% 50% 45% 45%', background: `radial-gradient(ellipse at 50% 70%, #FFF6D8 0%, #FFC861 40%, rgba(255,140,40,0) 75%)`,
            opacity: appear * fl * (0.5 + depth * 0.5), boxShadow: depth > 0.6 ? `0 0 ${s * 2}px rgba(255,190,90,${0.35 * fl})` : undefined }} />;
        })}
      </AbsoluteFill>
      {/* 1881 */}
      <AbsoluteFill style={{ opacity: 1 - out1, filter: out1 > 0.01 ? `blur(${out1 * 10}px)` : undefined }}>
        <div style={{ position: 'absolute', left: 260, top: 300 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', opacity: rampOut(frame, 4, 18) }}>Muere en</div>
          <MaskTitle text="1881" at={8} size={250} color="#fff" />
          <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: 'rgba(255,255,255,0.75)', opacity: rampOut(frame, fKar - 30, fKar - 14) }}>pocos meses después de terminar</div>
        </div>
        <div style={{ position: 'absolute', left: 1180, top: 210, opacity: rampOut(frame, fKar - 8, fKar + 10), transform: `translateY(${(1 - rampOut(frame, fKar - 8, fKar + 10)) * 50}px)` }}>
          <Book3D b={BOOKS.karamazov} w={340} h={510} d={84} ry={-26 + Math.sin(frame / 50) * 3} rx={4} />
        </div>
      </AbsoluteFill>
      {frame >= fDec - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center' }}>
          <MaskTitle text="Decenas de miles de personas" at={fDec - 2} size={96} align="center" color="#fff" />
          <div style={{ marginTop: 18, fontFamily: font.serif, fontStyle: 'italic', fontSize: 58, color: '#F3D79A', opacity: rampOut(frame, fAcom - 4, fAcom + 12) }}>acompañaron su ataúd</div>
        </div>
      )}
      <Sfx name="hit_soft" at={8} volume={0.5} />
      <Sfx name="sk_book_thud" at={fKar - 4} volume={0.4} />
      <Sfx name="dk_bell" at={fDec - 6} volume={0.6} />
      <Sfx name="dk_crowd" at={fDec - 4} volume={0.7} dur={c.dur - fDec + 4} fade={20} />
      <Sfx name="dk_bell" at={fAcom + 10} volume={0.4} />
    </SkNight>
  );
};

export const _bio = { easeOut, KR_DEEP, color };

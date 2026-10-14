import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { CrossIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, GlobeIcon, LaptopIcon, LockIcon, UserIcon } from '../../components/Icons2';
import { VOS, voSrc } from '../../lib/vo';
import { FeatureTag } from '../nxr/kit';
import cfg from '../../../public/str/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, BigTitle, Burst, Odometer, odometerShown, PhoneKey, Shot, ST, ST_DEEP, ST_PINK, ST_SOFT, StorytelLogo, StrStage, Tap, markOn } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de Storytel: 7 piezas (C01–C07) con el móvil real y subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07'] as const;
const EXTRA: Record<string, number> = { C01: 12, C02: 12, C03: 16, C04: 16, C05: 16, C06: 16, C07: 110 };
type Piece = { id: string; at: number; dur: number };
const PIECES: Piece[] = (() => {
  let at = 0;
  return IDS.map((id) => {
    const dur = LEAD + speechFrames(id) + EXTRA[id];
    const p = { id, at, dur };
    at += dur;
    return p;
  });
})();
export const STR_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los verticales de Nextory y Podimo (ElevenLabs Music, ~47 s); se apaga al final.
export const STR_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

type CW = { w: string; s: number; e: number };
const textOf = (id: string) => (cfg.scenes as { id: string; text: string }[]).find((s) => s.id === id)?.text ?? '';
const estWords = (id: string): CW[] => {
  const out: CW[] = [];
  const re = /\S+/g;
  const t = textOf(id);
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) out.push({ w: m[0], s: m.index / 13, e: (m.index + m[0].length) / 13 });
  return out;
};
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («ocho noventa y nueve» → «8,99 €»),
// como en el .srt (tools/str_meta.py).
const NUMEROS: [string[], string][] = [
  [['ocho', 'noventa', 'y', 'nueve'], '8,99 €'], [['quince', 'noventa', 'y', 'nueve'], '15,99 €'], [['veinte', 'noventa', 'y', 'nueve'], '20,99 €'],
  [['seiscientos', 'cincuenta', 'mil'], '650.000'], [['siete', 'dias'], '7 días'],
];
const bare = (w: string) => w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.,;:¿?¡!«»…]/g, '');
const cifras = (ws: CW[]): CW[] => {
  const out: CW[] = [];
  for (let i = 0; i < ws.length;) {
    const hit = NUMEROS.find(([pat]) => pat.every((p, k) => ws[i + k] && bare(ws[i + k].w) === p));
    if (!hit) { out.push(ws[i]); i += 1; continue; }
    const [pat, rep] = hit;
    const last = ws[i + pat.length - 1];
    const tail = last.w.slice(last.w.replace(/[.,;:?!…»]+$/, '').length);
    out.push({ w: rep + tail, s: ws[i].s, e: last.e });
    i += pat.length;
  }
  return out;
};
const groups = (() => {
  const words: CW[] = PIECES.flatMap((p) => cifras((hasVO(p.id) ? VOS[p.id].words : estWords(p.id))
    .map((w) => ({ w: w.w.replace(/[«»]/g, ''), s: (p.at + LEAD) / FPS + w.s, e: (p.at + LEAD) / FPS + w.e }))));
  const out: CW[][] = [];
  let cur: CW[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!…]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = groups.find((c) => t >= c[0].s - 0.05 && t <= c[c.length - 1].e + 0.2);
  if (!g) return null;
  const pop = spring({ frame: frame - Math.round(g[0].s * FPS), fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1480, zIndex: 80 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', maxWidth: 940, transform: `scale(${0.92 + 0.08 * pop})` }}>
        {g.map((w, i) => {
          const active = t >= w.s - 0.03 && t <= w.e + 0.05;
          return <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, lineHeight: 1.15, padding: '2px 16px', borderRadius: 16, color: color.ink, background: active ? color.yellow : 'rgba(255,255,255,0.96)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>{w.w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

type SP = { lead: number; dur: number };
const PW = 450;
const PHONE_LEFT = (1080 - PW * 1.072) / 2;
const PHONE_TOP = 418;
const cam = (dur: number, from: Partial<PhoneKey> = {}): PhoneKey[] => [
  { f: 0, rx: 6, ry: -14, rz: 1.5, s: 0.95, x: 0, y: 24, ...from },
  { f: 24, rx: 3, ry: -6, rz: 0, s: 1, x: 0, y: 0 },
  { f: dur, rx: 2, ry: 5, rz: 0, s: 1.02, x: 0, y: -4 },
];
const Headline: React.FC<{ text: string; hi?: string; at?: number }> = ({ text, hi, at = 2 }) => (
  <AbsoluteFill style={{ alignItems: 'center', paddingTop: 96 }}>
    <BigTitle text={text} hi={hi} at={at} size={86} align="center" style={{ maxWidth: 960 }} />
  </AbsoluteFill>
);
const SwapTag: React.FC<{ items: { at: number; label: string; dark?: boolean }[] }> = ({ items }) => (
  <AbsoluteFill style={{ alignItems: 'center', paddingTop: 296 }}>
    <div style={{ position: 'relative', height: 80, width: 1000, display: 'flex', justifyContent: 'center' }}>
      {items.map((it, i) => (
        <div key={i} style={{ position: 'absolute', top: 0 }}>
          <FeatureTag at={it.at} out={items[i + 1]?.at} size={38} dark={it.dark} from="up">{it.label}</FeatureTag>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
const Phone: React.FC<{ shots: Shot[]; dur: number; taps?: Tap[]; from?: Partial<PhoneKey> }> = ({ shots, dur, taps, from }) => (
  <div style={{ position: 'absolute', left: PHONE_LEFT, top: PHONE_TOP }}>
    <AppPhone shots={shots} w={PW} cam={cam(dur, from)} taps={taps} dim={0.72} />
  </div>
);
const Avatars: React.FC<{ n: number; s: number; size?: number }> = ({ n, s, size = 78 }) => (
  <div style={{ display: 'flex' }}>
    {[ST, ST_PINK, color.yellow].slice(0, n).map((c, i) => (
      <span key={i} style={{ width: size, height: size, borderRadius: '50%', background: c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i ? -size * 0.28 : 0, border: '5px solid #fff',
        transform: `scale(${Math.max(0, Math.min(1, s * 1.25 - i * 0.12)).toFixed(4)})` }}><UserIcon size={size * 0.55} c="#101010" sw={2.2} /></span>
    ))}
  </div>
);

// C01 · Gancho: el móvil entra girando con la portada de la app.
const C01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('C01', w, n);
  return (
    <StrStage>
      <Headline text="¿Merece la pena Storytel?" hi="Storytel" />
      <SwapTag items={[{ at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: '00_inicio_top', at: 0, start: 8.6, hold: 21 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('probado')} />
    </StrStage>
  );
};

// C02 · Por 8,99 € escuchas y lees sin límite de horas: más de 650.000 títulos.
const C02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('C02', w, n);
  const fOcho = at('ocho');
  const fEsc = at('escuchas');
  const fLees = at('lees');
  const fSin = at('sin');
  const fMas = at('mas');
  const s0: Shot = { rec: '14_reproductor', at: 0, start: 13.6, hold: 21 };
  const s1: Shot = { rec: '16_lectura', at: fLees - 4, start: 2.4, hold: 24 };
  s1.marks = [markOn(s1, fLees + 6, fMas - 6, 14, 334, 636, 174, 14)];
  const s2: Shot = { rec: '01_inicio_scroll', at: fMas - 6, start: 5.6, hold: 8 };
  s2.marks = [markOn(s2, fMas + 4, dur + 10, 8, 190, 648, 300, 22)];
  return (
    <StrStage>
      <Headline text="Escucha y lee sin límite" hi="límite" />
      <SwapTag items={[
        { at: fOcho, label: '8,99 € al mes', dark: true },
        { at: fEsc, label: 'Audiolibros y ebooks' },
        { at: fSin, label: 'Sin contar horas' },
        { at: fMas, label: '+650.000 títulos', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1, s2]} />
      {[fOcho, fEsc, fSin, fMas].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </StrStage>
  );
};

// C03 · Family: dos cuentas por 15,99 € o tres por 20,99 €, cada una con su biblioteca.
const C03: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('C03', w, n);
  const fFam = at('family');
  const fDos = at('dos');
  const fQuince = at('quince');
  const fTres = at('tres');
  const fVeinte = at('veinte');
  const sp = (f: number, d = 15, st = 160) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: st } });
  const sA = sp(fDos - 8);
  const sB = sp(fTres - 8);
  const sNote = sp(fVeinte + 30, 18, 140);
  const actA = interpolate(frame, [fDos - 6, fDos + 4, fTres - 8, fTres], [0, 1, 1, 0], clamp);
  const actB = interpolate(frame, [fTres - 6, fTres + 4], [0, 1], clamp);
  const card = (s: number, act: number, n: number, label: string, price: string, oAt: number) => (
    <div style={{ width: 940, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '52px 56px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, ${shadow.card}`, opacity: Math.min(1, s * 1.3) * (1 - 0.3 * (1 - act) * (frame > fTres ? 1 : 0)),
      transform: `translateY(${((1 - s) * 70).toFixed(2)}px) scale(${(1 + 0.02 * act).toFixed(4)})` }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Avatars n={n} s={s} size={92} />
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink, letterSpacing: -1 }}>{label}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Odometer text={price} at={oAt} size={150} style={{ letterSpacing: -7 }} />
            {/* Hasta que la voz dice el precio, un hueco con brillo (como en la reseña) */}
            {frame < oAt - 1 && <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: 26, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
              backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
          </span>
          <span style={{ fontSize: 60 }}>€</span>
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.muted, marginTop: 4, opacity: interpolate(frame, [oAt + 10, oAt + 24], [0, 1], clamp) }}>al mes</div>
      </div>
    </div>
  );
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: sp(2), transform: `translateY(${((1 - sp(2)) * -20).toFixed(2)}px)` }}>
          <StorytelLogo width={260} />
        </div>
        <div style={{ marginTop: 34 }}>
          <BigTitle text="Plan Family" hi="Family" at={fFam - 10} size={110} align="center" />
        </div>
        <div style={{ marginTop: 120, display: 'flex', flexDirection: 'column', gap: 40, minHeight: 640 }}>
          {card(sA, actA, 2, '2 cuentas', '15,99', fQuince - 6)}
          {frame >= fTres - 10 && card(sB, actB, 3, '3 cuentas', '20,99', fVeinte - 6)}
        </div>
        <div style={{ marginTop: 46, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 34px', borderRadius: 999, background: ST_SOFT, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: ST_DEEP,
          opacity: sNote, transform: `translateY(${((1 - sNote) * 24).toFixed(2)}px)` }}>
          Cada cuenta, con su biblioteca
        </div>
      </AbsoluteFill>
      <Sfx name="card_flip" at={fDos - 8} volume={0.7} />
      <ChangeTicks value={(f) => odometerShown('15,99', fQuince - 6, fps, f)} from={fQuince - 6} to={fQuince + 30} volume={0.4} />
      <Sfx name="card_flip" at={fTres - 8} volume={0.7} />
      <ChangeTicks value={(f) => odometerShown('20,99', fVeinte - 6, fps, f)} from={fVeinte - 6} to={fVeinte + 30} volume={0.4} />
      <Sfx name="ui_pop" at={fVeinte + 30} volume={0.6} />
    </StrStage>
  );
};

// C04 · Lo malo: no hay app de ordenador y cancelar la prueba corta el acceso al momento.
const C04: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('C04', w, n);
  const fMalo = at('malo');
  const items = [
    { f: at('app'), icon: <LaptopIcon size={58} />, t: 'Sin app de ordenador' },
    { f: at('cancelas'), icon: <LockIcon size={58} />, t: 'Cancelar la prueba corta el acceso al momento' },
  ];
  const s = spring({ frame: frame - fMalo + 6, fps, config: { damping: 16, stiffness: 150 } });
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 430 }}>
        <div style={{ width: 920, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
          <div style={{ padding: '34px 48px', background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 72, display: 'flex', alignItems: 'center', gap: 22 }}>
            <CrossIcon size={72} c="#fff" fg={color.red} /> Lo malo
          </div>
          <div style={{ padding: '18px 48px 34px' }}>
            {items.map((it, i) => {
              const si = spring({ frame: frame - it.f + 2, fps, config: { damping: 15, stiffness: 180 } });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '38px 0', borderBottom: i < items.length - 1 ? `1px solid ${color.line}` : 'none', opacity: si, transform: `translateX(${(1 - si) * 60}px)` }}>
                  <div style={{ position: 'relative', width: 104, height: 104, borderRadius: 28, background: '#FDECEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {it.icon}
                    <div style={{ position: 'absolute', right: -10, bottom: -10 }}><CrossIcon size={42} /></div>
                  </div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, lineHeight: 1.12, color: color.ink, letterSpacing: -0.8, textWrap: 'balance' } as React.CSSProperties}>{it.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fMalo} />
      {items.map((it, i) => <Sfx key={i} name="hit_soft" at={it.f} volume={0.7} />)}
    </StrStage>
  );
};

// C05 · 7 días gratis en su web (contador 1 → 7 en la insignia naranja de Storytel).
const C05: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('C05', w, n);
  const fSiete = at('siete');
  const fWeb = at('web');
  const LAND = fSiete + 6;
  const rollFrom = fSiete - 18;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 7], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const sBadge = spring({ frame: frame - (fSiete - 16), fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  // El logotipo se queda grande en el centro mientras la voz pregunta y sube cuando entra la insignia.
  const lift = interpolate(frame, [fSiete - 26, fSiete - 8], [0, 1], { ...clamp, easing: easeInOut });
  const sWeb = spring({ frame: frame - fWeb + 4, fps, config: { damping: 13, stiffness: 180 } });
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 210, opacity: sLogo, transform: `translateY(${(1 - sLogo) * -30 + (1 - lift) * 500}px) scale(${1 + 0.7 * (1 - lift)})` }}>
          <StorytelLogo width={330} />
        </div>
        <div style={{ position: 'absolute', top: 400, width: 700, height: 700, transform: `scale(${sBadge * (1 + 0.07 * bump)})` }}>
          <svg width="700" height="700" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${frame * 0.25}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={ST} opacity={0.16} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 88, borderRadius: '50%', background: ST, boxShadow: '0 40px 100px rgba(255,80,28,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 300, letterSpacing: -12, lineHeight: 0.86, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{rollAt(frame)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: '#fff', letterSpacing: -1 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={540} y={750} r={260} seed="c05" colors={[ST, color.yellow, ST_PINK, '#101010']} />
        <div style={{ position: 'absolute', top: 1170, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 34px 16px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: color.ink, opacity: sWeb, transform: `translateY(${(1 - sWeb) * 30}px) scale(${0.86 + 0.14 * sWeb})` }}>
          <GlobeIcon size={54} /> storytel.com
        </div>
        <div style={{ position: 'absolute', top: 1280, width: 900, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.muted, opacity: sWeb }}>
          Después, Unlimited: 8,99 €/mes · sin permanencia
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={LAND - 4} volume={0.7} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.8} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.7} />
    </StrStage>
  );
};

// C06 · Si no te convence, cancela el último día de la prueba, antes del cobro (y no en la última hora).
const C06: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('C06', w, n);
  const fConv = at('convence');
  const fCancela = at('cancela');
  const fUlt = at('ultimo');
  const fAntes = at('antes');
  const sp = (f: number, d = 16, st = 160) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: st } });
  const sCard = sp(1);
  const sHead = sp(fCancela - 2, 13, 190);
  const best = interpolate(frame, [fUlt - 2, fUlt + 16], [0, 1], { ...clamp, easing: easeOut });
  const block = interpolate(frame, [fAntes, fAntes + 14], [0, 1], { ...clamp, easing: easeOut });
  const sNote = sp(fAntes + 24, 16, 160);
  const days = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
        <div style={{ width: 920, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '46px 50px 50px', boxSizing: 'border-box',
          opacity: sCard, transform: `translateY(${(1 - sCard) * 60}px)` }}>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 48, color: color.ink2 }}>¿No te convence?</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: color.ink, letterSpacing: -2.5, lineHeight: 1.04,
            opacity: sHead, transform: `translateX(${((1 - sHead) * -30).toFixed(2)}px)` }}>
            <CalendarIcon size={78} /> Cancela el último día
          </div>
          <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
            {days.map((d) => {
              const hot = d === 7;
              const pay = d === 8;
              const ds = interpolate(frame, [fCancela + d * 1.6, fCancela + d * 1.6 + 8], [0, 1], clamp);
              return (
                <div key={d} style={{ position: 'relative', height: 112, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700,
                  background: hot ? `rgba(255,202,5,${(0.25 + 0.75 * best).toFixed(3)})` : pay ? '#FDECEC' : '#F4F4F4', color: pay ? color.red : color.ink, opacity: ds,
                  transform: `scale(${(hot ? 1 + 0.1 * best : 1).toFixed(4)})`, boxShadow: hot && best > 0.5 ? '0 12px 28px rgba(255,202,5,0.45)' : undefined }}>
                  <span style={{ fontSize: 22, opacity: 0.6 }}>{pay ? 'cobro' : 'día'}</span>
                  <span style={{ fontSize: pay ? 30 : 46, lineHeight: 1.1 }}>{pay ? '8,99 €' : d}</span>
                  {pay && block > 0.01 && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                      <path d="M12 88 L88 12" stroke={color.red} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - block} vectorEffect="non-scaling-stroke" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', paddingRight: 70, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: best }}>↑ Mejor el último día</div>
          <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 18, padding: '22px 28px', borderRadius: 24, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 40, lineHeight: 1.15,
            opacity: sNote, transform: `translateY(${((1 - sNote) * 20).toFixed(2)}px)` }}>
            <ClockIcon size={50} c={color.yellow} /> <span style={{ textWrap: 'balance' } as React.CSSProperties}>Antes del cobro, pero no en la última hora</span>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fConv} volume={0.6} />
      <Sfx name="whoosh_soft" at={fCancela - 2} volume={0.7} />
      {[0, 1, 2].map((r) => <Sfx key={r} name="tick_soft" at={fCancela + 2 + r * 5} volume={[0.8, 0.6, 0.5][r]} />)}
      <Sfx name="marker" at={fUlt} />
      <Sfx name="cross" at={fAntes + 2} volume={0.6} />
    </StrStage>
  );
};

// C07 · Cierre: antes de pagar, compara plataformas en SonorBooks.
const C07: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('C07', w, n);
  const fComp = at('compara');
  const p = spring({ frame: frame - at('sonorbooks') - 6, fps, config: { damping: 12 } });
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54, paddingBottom: 360 }}>
        <Logo size={128} delay={2} />
        <div style={{ width: 900, height: 112, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', gap: 22 }}>
          <svg width="42" height="42" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}><Typewriter text="Compara plataformas" start={fComp - 4} cps={22} /></div>
        </div>
        <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}><Pill size={54}>sonorbooks.com</Pill></div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - at('sonorbooks') - 26, fps }) }}>
          Precio, horas y días gratis de cada una
        </div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={fComp - 4} trimAfter={50} />
      <Sfx name="sparkle" at={at('sonorbooks') + 8} volume={0.7} />
    </StrStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { C01, C02, C03, C04, C05, C06, C07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const StorytelReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [STR_SHORT_TOTAL - fps * 1.2, STR_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {PIECES.map((p) => {
        const C = COMPONENTS[p.id];
        return (
          <Sequence key={p.id} from={p.at} durationInFrames={p.dur} name={p.id}>
            <Fade><C lead={LEAD} dur={p.dur} /></Fade>
            {hasVO(p.id) && (!STEM || STEM === 'vo') && (
              <Sequence from={LEAD} layout="none"><Audio src={voSrc(p.id)} /></Sequence>
            )}
          </Sequence>
        );
      })}
      <Captions />
      {PIECES.slice(1).map((p) => <Sfx key={p.id} name="transition" at={p.at} volume={0.55} />)}
      {STR_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(STR_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/str_meta.py (subtítulos del vertical).
export const STR_SHORT_PIECES = PIECES;

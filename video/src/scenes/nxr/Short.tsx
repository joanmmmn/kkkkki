import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, GlobeIcon, PdfIcon } from '../../components/Icons2';
import { VOS, voSrc } from '../../lib/vo';
import { NextoryLogo } from '../nx/common';
import cfg from '../../../public/nxr/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, BigTitle, FeatureTag, PhoneKey, Shot, Tap } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña: 7 piezas (Q01–Q07) con el móvil real, subtítulos y la prueba de 30 días.
const FPS = 50;
const LEAD = 6;
const IDS = ['Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07'] as const;
const EXTRA: Record<string, number> = { Q01: 12, Q02: 12, Q03: 12, Q04: 16, Q05: 14, Q06: 16, Q07: 110 };
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
export const NXR_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
export const NXR_SHORT_MUSIC: string | null = null; // misma música que la reseña, cuando exista

// ——— Subtítulos: palabras de la locución (o estimadas a 13 caracteres/s si aún no hay voz), en grupos cortos ———
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
const groups = (() => {
  const words: CW[] = PIECES.flatMap((p) => (hasVO(p.id) ? VOS[p.id].words : estWords(p.id))
    .map((w) => ({ w: w.w.replace(/[«»]/g, ''), s: (p.at + LEAD) / FPS + w.s, e: (p.at + LEAD) / FPS + w.e })));
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

// ——— Piezas comunes ———
type SP = { lead: number; dur: number };
const PW = 450; // ancho de la pantalla del móvil en vertical
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
// Etiqueta que cambia según lo que dice la voz (una cada vez, bajo el titular).
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
    <AppPhone shots={shots} w={PW} cam={cam(dur, from)} taps={taps} />
  </div>
);
const align = (rec: string, clipT: number, f: number, pre = 10, extra: Partial<Shot> = {}): Shot => {
  const at = Math.max(0, f - pre);
  return { rec, at, start: Math.max(0, clipT - (f - at) / 50), ...extra };
};

// Q01 · Gancho: el móvil entra girando con la portada de la app.
const Q01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Q01', w, n);
  return (
    <Stage tone="warm">
      <Headline text="¿Merece la pena Nextory?" hi="Nextory?" />
      <SwapTag items={[{ at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: '01_inicio', at: 0, start: 3.6, hold: 15.0 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('probado')} />
    </Stage>
  );
};

// Q02 · Lo que tienes por menos de 10 €: audiolibros, ebooks, perfiles y modo infantil.
const Q02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Q02', w, n);
  const fEur = at('euros');
  const fAud = at('audiolibros');
  const fEb = at('ebooks');
  const fPerf = at('perfiles');
  const fInf = at('infantil');
  const perf: Shot = { rec: '08_perfil', at: fPerf - 6, start: 2.0, hold: 12.0, marks: [{ from: 8, to: fInf - 6 - (fPerf - 6), x: 14, y: 376, w: 636, h: 226, r: 16 }] };
  const shots: Shot[] = [
    { rec: '06_escuchar', at: 0, start: 5.0, hold: 19.5 },
    { rec: '05_leer', at: fEb - 6, start: 16.6, hold: 18.0 },
    perf,
    { rec: '12_infantil_home', at: fInf - 6, start: 1.6, hold: 13.0 },
  ];
  return (
    <Stage tone="warm">
      <Headline text="Todo en una app" hi="app" />
      <SwapTag items={[
        { at: fEur, label: 'Menos de 10 € al mes', dark: true },
        { at: fAud, label: 'Audiolibros' },
        { at: fEb, label: 'Ebooks' },
        { at: fPerf, label: '4 perfiles' },
        { at: fInf, label: 'Modo infantil' },
      ]} />
      <Phone dur={dur} shots={shots} />
      {[fEur, fAud, fEb, fPerf, fInf].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </Stage>
  );
};

// Q03 · Lector y reproductor: velocidad, temporizador, marcadores y descargas.
const Q03: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Q03', w, n);
  const fLec = at('lector');
  const fRep = at('reproductor');
  const fVel = at('velocidad');
  const fTem = at('temporizador');
  const fMar = at('marcadores');
  const fDes = at('descargas');
  const shots: Shot[] = [
    align('05_leer', 37.2, fLec + 14, 20, { hold: 48.9 }),
    { rec: '06_escuchar', at: fRep - 6, start: 61.0, hold: 63.5 },
    align('06_escuchar', 20.14, fVel + 2, 10, { hold: 28.5 }),
    align('06_escuchar', 63.9, fTem + 2, 10, { hold: 75.5 }),
    align('05_leer', 94.0, fMar + 4, 14, { hold: 97.8 }),
    align('07_biblioteca', 14.4, fDes + 4, 16, { hold: 17.2 }),
  ];
  return (
    <Stage tone="warm">
      <Headline text="Lector y reproductor" hi="reproductor" />
      <SwapTag items={[
        { at: fLec, label: 'Letra, fondo y márgenes' },
        { at: fRep, label: 'Reproductor completo' },
        { at: fVel, label: 'Velocidad de 0,4x a 2x' },
        { at: fTem, label: 'Temporizador para dormir' },
        { at: fMar, label: 'Marcadores' },
        { at: fDes, label: 'Descargas sin conexión' },
      ]} />
      <Phone dur={dur} shots={shots} taps={[
        { f: fLec + 12, x: 332, y: 869 }, { f: fVel, x: 252, y: 1198 }, { f: fTem, x: 91, y: 1198 }, { f: fMar + 2, x: 403, y: 1276 }, { f: fDes + 1, x: 293, y: 284 },
      ]} />
      {[fLec, fRep, fVel, fTem, fMar, fDes].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.7} />)}
    </Stage>
  );
};

// Q04 · Lo malo: tarjeta roja con los tres inconvenientes.
const Q04: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Q04', w, n);
  const fMalo = at('malo');
  const items = [
    { f: at('horas'), icon: <ClockIcon size={58} />, t: 'Límite de horas en los planes baratos' },
    { f: at('web'), icon: <GlobeIcon size={58} />, t: 'No hay versión web' },
    { f: at('pdf'), icon: <PdfIcon size={58} />, t: 'No puedes subir tus PDF' },
  ];
  const s = spring({ frame: frame - fMalo + 6, fps, config: { damping: 16, stiffness: 150 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 470 }}>
        <div style={{ width: 920, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
          <div style={{ padding: '34px 48px', background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 72, display: 'flex', alignItems: 'center', gap: 22 }}>
            <CrossIcon size={72} c="#fff" fg={color.red} /> Lo malo
          </div>
          <div style={{ padding: '18px 48px 34px' }}>
            {items.map((it, i) => {
              const si = spring({ frame: frame - it.f + 2, fps, config: { damping: 15, stiffness: 180 } });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '34px 0', borderBottom: i < items.length - 1 ? `1px solid ${color.line}` : 'none', opacity: si, transform: `translateX(${(1 - si) * 60}px)` }}>
                  <div style={{ position: 'relative', width: 96, height: 96, borderRadius: 26, background: '#FDECEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {it.icon}
                    <div style={{ position: 'absolute', right: -10, bottom: -10 }}><CrossIcon size={40} /></div>
                  </div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: color.ink, letterSpacing: -0.8 }}>{it.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fMalo} />
      {items.map((it, i) => <Sfx key={i} name="hit_soft" at={it.f} volume={0.7} />)}
    </Stage>
  );
};

// Q05 · 30 días gratis desde SonorBooks (en vez de 14).
const Q05: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Q05', w, n);
  const fTreinta = at('treinta');
  const fCatorce = at('catorce');
  const roll = interpolate(frame, [fTreinta - 14, fTreinta + 8], [14, 30], { ...clamp, easing: easeOut });
  const sBadge = spring({ frame: frame - fTreinta + 16, fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const sVez = spring({ frame: frame - fCatorce, fps, config: { damping: 16, stiffness: 180 } });
  const strike = interpolate(frame, [fCatorce + 6, fCatorce + 18], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 200, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30}px)` }}>
          <LogoIcon size={84} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.muted }}>×</span>
          <NextoryLogo width={260} />
        </div>
        <div style={{ position: 'absolute', top: 400, width: 700, height: 700, transform: `scale(${sBadge})` }}>
          <svg width="700" height="700" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${frame * 0.25}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={color.yellow} opacity={0.22} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 88, borderRadius: '50%', background: color.yellow, boxShadow: '0 40px 100px rgba(255,202,5,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 290, letterSpacing: -12, lineHeight: 0.9, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{Math.round(roll)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink, letterSpacing: -1 }}>días gratis</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 1170, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: color.ink2, opacity: sVez, transform: `translateY(${(1 - sVez) * 30}px)` }}>
          en vez de
          <span style={{ position: 'relative', color: color.muted }}>14<span style={{ position: 'absolute', left: -8, right: -8, top: '50%', height: 7, background: color.red, borderRadius: 4, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: 'left' }} /></span>
        </div>
        <div style={{ position: 'absolute', top: 1260, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: sVez }}>
          Hasta 15 h de lectura y escucha · solo cuentas nuevas
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={fTreinta - 4} volume={0.8} />
      <Sfx name="counter" at={fTreinta - 14} />
      <Sfx name="impact" at={fTreinta + 6} />
      <Sfx name="pencil_strike" at={fCatorce + 6} />
    </Stage>
  );
};

// Q06 · ¿Te gusta? Te quedas. ¿No? Cancela antes del día 30, mejor al final.
const Q06: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Q06', w, n);
  const fGusta = at('gusta');
  const fQuedas = at('quedas');
  const fNo = at('cancela');
  const fFinal = at('final');
  const fPierdes = at('pierdes');
  const sp = (f: number, d = 16, st = 160) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: st } });
  const sA = sp(fGusta - 4);
  const sQ = sp(fQuedas, 11, 200);
  const sB = sp(fNo - 6);
  const sW = sp(fPierdes, 14, 180);
  const best = interpolate(frame, [fFinal - 2, fFinal + 16], [0, 1], { ...clamp, easing: easeOut });
  const card = (s: number, children: React.ReactNode) => (
    <div style={{ width: 920, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '40px 48px', boxSizing: 'border-box', opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>{children}</div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330, gap: 40 }}>
        {card(sA, (
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ transform: `scale(${0.6 + 0.4 * sQ})`, opacity: Math.max(0.2, sQ) }}><CheckIcon size={120} /></div>
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 44, color: color.ink2 }}>¿Te gusta?</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, color: color.ink, letterSpacing: -3, lineHeight: 1 }}>Te quedas</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.muted, marginTop: 8 }}>No tienes que hacer nada</div>
            </div>
          </div>
        ))}
        {card(sB, (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>
              <CalendarIcon size={58} /> ¿No? Cancela antes del día 30
            </div>
            <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10 }}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                const hot = d >= 27 && d <= 29;
                const last = d === 30;
                const ds = interpolate(frame, [fNo + d * 0.8, fNo + d * 0.8 + 8], [0, 1], clamp);
                return (
                  <div key={d} style={{ height: 62, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 28,
                    background: hot ? `rgba(255,202,5,${0.25 + 0.75 * best})` : last ? '#FDECEC' : '#F4F4F4', color: last ? color.red : color.ink, opacity: ds, transform: `scale(${hot ? 1 + 0.1 * best : 1})` }}>
                    {d}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, textAlign: 'right', fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: best }}>Mejor al final ↑</div>
            <div style={{ marginTop: 22, padding: '20px 26px', borderRadius: 22, background: '#FDECEC', color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 40, lineHeight: 1.15, opacity: sW, transform: `translateY(${(1 - sW) * 20}px)` }}>
              Al cancelar, pierdes el acceso al momento
            </div>
          </>
        ))}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fGusta} />
      <Sfx name="success" at={fQuedas} volume={0.8} />
      <Sfx name="ui_pop" at={fNo} />
      <Sfx name="marker" at={fFinal} />
      <Sfx name="hit_soft" at={fPierdes} />
    </Stage>
  );
};

// Q07 · Cierre: busca tu próximo libro en SonorBooks.
const Q07: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54, paddingBottom: 360 }}>
        <Logo size={128} delay={2} />
        <div style={{ width: 900, height: 112, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', gap: 22 }}>
          <svg width="42" height="42" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}><Typewriter text="Tu próximo libro" start={lead + 4} cps={20} /></div>
        </div>
        <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}><Pill size={54}>sonorbooks.com</Pill></div>
        <div style={{ fontFamily: font.sans, fontSize: 26, color: color.muted, maxWidth: 840, textAlign: 'center', opacity: spring({ frame: frame - lead - 50, fps }) }}>
          Enlace de afiliado: si contratas, SonorBooks puede recibir una comisión, sin coste para ti.
        </div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={lead + 4} trimAfter={50} />
      <Sfx name="sparkle" at={lead + 30} volume={0.7} />
    </Stage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { Q01, Q02, Q03, Q04, Q05, Q06, Q07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const NextoryReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [NXR_SHORT_TOTAL - fps, NXR_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {NXR_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(NXR_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

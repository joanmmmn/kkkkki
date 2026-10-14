import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx, STEM } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { CalendarIcon } from '../../components/Icons2';
import { VOS, voSrc } from '../../lib/vo';
import { FeatureTag } from '../nxr/kit';
import cfg from '../../../public/aud/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, AU, AU_DEEP, AU_HOT, AU_NAVY, AudibleLogo, AudStage, BigTitle, Burst, markOn, PhoneKey, Shot, Tap } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de Audible: 7 piezas (J01–J07) con el móvil real y subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['J01', 'J02', 'J03', 'J04', 'J05', 'J06', 'J07'] as const;
const EXTRA: Record<string, number> = { J01: 12, J02: 12, J03: 16, J04: 16, J05: 22, J06: 16, J07: 110 };
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
export const AUD_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los verticales de Nextory, Podimo y Storytel (ElevenLabs Music, ~47 s); se apaga al final.
export const AUD_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

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
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («nueve noventa y nueve» → «9,99 €»),
// como en el .srt (tools/aud_meta.py).
const NUMEROS: [string[], string][] = [
  [['nueve', 'noventa', 'y', 'nueve'], '9,99 €'], [['noventa', 'mil'], '90.000'], [['treinta', 'dias'], '30 días'],
];
const bare = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:¿?¡!«»…]/g, '');
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

// J01 · Gancho: el móvil entra girando con la portada de la app.
const J01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('J01', w, n);
  return (
    <AudStage>
      <Headline text="¿Merece la pena Audible?" hi="Audible" />
      <SwapTag items={[{ at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: '00_inicio_top', at: 0, start: 2.0, hold: 15 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('probado')} />
    </AudStage>
  );
};

// J02 · Por 9,99 € al mes, sin límite de horas: más de 90.000 títulos (el reproductor y el Top 20 del día).
const J02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('J02', w, n);
  const fNueve = at('nueve');
  const fSin = at('sin');
  const fMas = at('mas');
  const s0: Shot = { rec: '12_reproductor', at: 0, start: 5.6, hold: 17.5 };
  const s1: Shot = { rec: '04_top20', at: fMas - 6, start: 1.5, hold: 6.0 };
  s1.marks = [markOn(s1, fMas + 4, dur + 10, 14, 470, 636, 760, 22)];
  return (
    <AudStage>
      <Headline text="Escucha sin límite de horas" hi="límite" />
      <SwapTag items={[
        { at: fNueve, label: '9,99 € al mes', dark: true },
        { at: fSin, label: 'Sin contar horas' },
        { at: fMas, label: '+90.000 títulos', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} />
      {[fNueve, fSin, fMas].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </AudStage>
  );
};

// J03 · Ojo, no está todo: el catálogo extendido (Posteguillo) se paga aparte, con descuento de socio (−29 %).
const J03: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('J03', w, n);
  const fSuper = at('superventas');
  const fPagan = at('pagan');
  const fDesc = at('descuento');
  const s0: Shot = { rec: '10_posteguillo', at: 0, start: 5.0, hold: 15 };
  s0.marks = [markOn(s0, fSuper - 2, fPagan - 6, 120, 330, 270, 40, 10)];
  const s1: Shot = { rec: '11_tres_mundos', at: fPagan - 6, start: 3.0, hold: 18 };
  s1.marks = [markOn(s1, fPagan + 2, fDesc - 4, 230, 756, 204, 40, 12), markOn(s1, fDesc - 2, dur + 10, 30, 934, 604, 104, 18)];
  return (
    <AudStage>
      <Headline text="Ojo: no está todo" hi="todo" />
      <SwapTag items={[
        { at: fSuper, label: 'Catálogo extendido' },
        { at: fPagan, label: 'Se paga aparte', dark: true },
        { at: fDesc, label: '−29 % para socios' },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} />
      <Sfx name="hit_soft" at={at('todo')} volume={0.6} />
      {[fSuper, fPagan, fDesc].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </AudStage>
  );
};

// J04 · Lo mejor: sus Originals (Drácula, con Claudia Salas y Asier Etxeandia).
const J04: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('J04', w, n);
  const fOrig = at('originals');
  const fDrac = at('dracula');
  const fClaudia = at('claudia');
  const s0: Shot = { rec: '01_inicio_scroll', at: 0, start: 11.4, hold: 12.4 };
  s0.marks = [markOn(s0, fOrig - 2, fDrac - 6, 8, 236, 330, 440, 22)];
  const s1: Shot = { rec: '05_dracula', at: fDrac - 6, start: 2.8, hold: 6.6 };
  s1.marks = [markOn(s1, fClaudia - 2, dur + 10, 340, 950, 312, 96, 16)];
  return (
    <AudStage>
      <Headline text="Lo mejor: sus Originals" hi="Originals" />
      <SwapTag items={[
        { at: fOrig, label: 'Audible Originals', dark: true },
        { at: fDrac, label: 'Drácula' },
        { at: fClaudia, label: 'Claudia Salas y Asier Etxeandia' },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} />
      {[fOrig, fDrac, fClaudia].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </AudStage>
  );
};

// J05 · 30 días gratis desde SonorBooks (contador mecánico 1 → 30 en el sello naranja de Audible).
const J05: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('J05', w, n);
  const fTreinta = at('treinta');
  const fSonor = at('sonorbooks');
  const LAND = fTreinta + 6;
  const rollFrom = fTreinta - 22;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const sBadge = spring({ frame: frame - (fTreinta - 16), fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  // Los logotipos se quedan grandes en el centro mientras la voz dice «Desde SonorBooks» (con un latido en «SonorBooks») y suben
  // a la vez que entra el sello: así la pantalla nunca se queda vacía antes del contador.
  const lift = interpolate(frame, [fTreinta - 26, fTreinta - 8], [0, 1], { ...clamp, easing: easeInOut });
  const pulse = interpolate(frame, [fSonor - 2, fSonor + 5, fSonor + 16], [0, 1, 0], clamp);
  const sFine = spring({ frame: frame - LAND - 8, fps, config: { damping: 18, stiffness: 140 } });
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  return (
    <AudStage>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 196, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30 + (1 - lift) * 520}px) scale(${(1 + 0.6 * (1 - lift)) * (1 + 0.05 * pulse)})` }}>
          <AudibleLogo width={250} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.muted }}>×</span>
          <LogoIcon size={84} />
        </div>
        <div style={{ position: 'absolute', top: 400, width: 700, height: 700, transform: `scale(${sBadge * (1 + 0.07 * bump)})` }}>
          <svg width="700" height="700" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${frame * 0.25}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={AU} opacity={0.2} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 88, borderRadius: '50%', background: `linear-gradient(160deg, ${AU} 0%, ${AU_HOT} 100%)`, boxShadow: '0 40px 100px rgba(247,120,28,0.45)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 290, letterSpacing: -12, lineHeight: 0.9, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{rollAt(frame)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: '#fff', letterSpacing: -1 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={540} y={750} r={260} seed="j05" colors={[AU, color.yellow, AU_HOT, AU_NAVY]} />
        <div style={{ position: 'absolute', top: 1160, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
          fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, opacity: sFine, transform: `translateY(${(1 - sFine) * 30}px)` }}>
          <CalendarIcon size={46} c={AU_DEEP} /> Audible Premium · Después, 9,99 €/mes
        </div>
        <div style={{ position: 'absolute', top: 1262, width: 900, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: color.muted, opacity: sFine }}>
          Prueba para cuentas que cumplan las condiciones. Hay títulos de compra adicional.
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={LAND - 4} volume={0.7} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.8} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.7} />
    </AudStage>
  );
};

// J06 · Truco comprobado: si cancelas el primer día, sigues escuchando hasta que termina la prueba (la pantalla real de la
// suscripción: «Has cancelado tu plan» y «Premium · Termina el 13 nov. 2026»).
const J06: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('J06', w, n);
  const fCanc = at('cancelas');
  const fSigues = at('sigues');
  const fTermina = at('termina');
  const s0: Shot = { rec: '19_suscripcion', at: 0, start: 17.6, hold: 19.2 };
  s0.marks = [markOn(s0, fCanc - 2, fSigues - 4, 14, 140, 636, 180, 18), markOn(s0, fSigues - 2, dur + 10, 30, 470, 604, 150, 18)];
  return (
    <AudStage>
      <Headline text="Truco comprobado" hi="comprobado" />
      <SwapTag items={[
        { at: fCanc, label: 'Cancelas el día 1' },
        { at: fSigues, label: 'Sigues escuchando' },
        { at: fTermina, label: 'Hasta el día 30', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0]} />
      {[fCanc, fSigues, fTermina].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="success" at={fTermina + 4} volume={0.6} />
    </AudStage>
  );
};

// J07 · Cierre: busca tu próximo libro en SonorBooks (con el aviso de afiliado).
const J07: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <AudStage>
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
    </AudStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { J01, J02, J03, J04, J05, J06, J07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const AudibleReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [AUD_SHORT_TOTAL - fps * 1.2, AUD_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {AUD_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(AUD_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/aud_meta.py (subtítulos del vertical).
export const AUD_SHORT_PIECES = PIECES;

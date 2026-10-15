import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { ClockIcon, GlobeIcon } from '../../components/Icons2';
import { VOS, voSrc } from '../../lib/vo';
import { FeatureTag } from '../nxr/kit';
import cfg from '../../../public/bkb/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, BB, BB_DEEP, BB_INK, BB_YELLOW, BigTitle, BkbStage, BookBeatLogo, Burst, EnSticker, markOn, PhoneKey, Shot, Tap } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de BookBeat: 7 piezas (W01–W07) con el móvil real y subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07'] as const;
const EXTRA: Record<string, number> = { W01: 12, W02: 12, W03: 16, W04: 14, W05: 22, W06: 16, W07: 110 };
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
export const BKB_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los verticales de Nextory, Podimo, Storytel y Audible (ElevenLabs Music, ~47 s); se apaga al final.
export const BKB_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

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
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («seis noventa y nueve» → «6,99 €»), como en
// el .srt (tools/bkb_meta.py). Los patrones largos, antes.
const NUMEROS: [string[], string][] = [
  [['dieciseis', 'mil', 'quinientos'], '16.500'], [['seis', 'noventa', 'y', 'nueve'], '6,99 €'], [['nueve', 'noventa', 'y', 'nueve'], '9,99 €'],
  [['treinta', 'dias'], '30 días'], [['veinte', 'horas'], '20 horas'], [['veinte'], '20'], [['cincuenta'], '50'],
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
    const head = ws[i].w.slice(0, ws[i].w.length - ws[i].w.replace(/^[¿¡«]+/, '').length);
    out.push({ w: head + rep + tail, s: ws[i].s, e: last.e });
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
          return <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, lineHeight: 1.15, padding: '2px 16px', borderRadius: 16, color: color.ink, background: active ? BB : 'rgba(255,255,255,0.96)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>{w.w}</span>;
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

// W01 · Gancho: el móvil entra girando con la portada de la app.
const W01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('W01', w, n);
  return (
    <BkbStage>
      <Headline text="¿Merece la pena BookBeat?" hi="BookBeat?" />
      <SwapTag items={[{ at: at('espana'), label: 'En España' }, { at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: '00_inicio_top', at: 0, start: 1.0, hold: 30 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('espana')} volume={0.6} />
      <Sfx name="ui_pop" at={at('probado')} />
    </BkbStage>
  );
};

// W02 · Se paga por horas: 20 h por 6,99 € (Basic) o 50 h por 9,99 € (Standard), con audiolibros y ebooks («Change
// subscription» real y el filtro de formato del buscador).
const W02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('W02', w, n);
  const fVeinte = at('veinte');
  const fCinc = at('cincuenta');
  const fAud = at('audiolibros');
  const s0: Shot = { rec: '27_cambiar_plan', at: 0, start: 36.0, hold: 44.0 };
  s0.marks = [markOn(s0, fVeinte - 2, fCinc - 6, 90, 836, 494, 245, 18)];
  const s1: Shot = { rec: '27_cambiar_plan', at: fCinc - 6, start: 2.0, hold: 19.5 };
  s1.marks = [markOn(s1, fCinc - 2, fAud - 6, 88, 560, 488, 245, 18)];
  const s2: Shot = { rec: '23_sapiens', at: fAud - 6, start: 40.0, hold: 40.04 };
  s2.marks = [markOn(s2, fAud - 2, dur + 10, 8, 440, 648, 180, 16)];
  return (
    <BkbStage>
      <Headline text="Pagas por horas" hi="horas" />
      <SwapTag items={[
        { at: fVeinte, label: '20 horas · 6,99 €', dark: true },
        { at: fCinc, label: '50 horas · 9,99 €' },
        { at: fAud, label: 'Audiolibros y ebooks', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1, s2]} />
      {[fVeinte, fCinc, fAud].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </BkbStage>
  );
};

// W03 · Ojo: la app está en inglés y no se puede cambiar (Inspiration real, con la pegatina «EN»).
const W03: React.FC<SP> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('W03', w, n);
  const fApp = at('app');
  const fIngles = at('ingles');
  const fCambiar = at('no');
  const p = interpolate(frame, [fIngles, fIngles + 7], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const sq = interpolate(frame, [fIngles + 7, fIngles + 10, fIngles + 18], [1, 0.92, 1], { ...clamp, easing: easeOut });
  const s0: Shot = { rec: '04_inspiration', at: 0, start: 2.4, hold: 16 };
  s0.marks = [markOn(s0, fApp - 2, dur + 10, 8, 160, 648, 1000, 22)];
  return (
    <BkbStage>
      <Headline text="Ojo: la app está en inglés" hi="inglés" />
      <SwapTag items={[{ at: fApp, label: 'Y la web también' }, { at: fCambiar, label: 'No se puede cambiar', dark: true }]} />
      <Phone dur={dur} shots={[s0]} />
      {frame >= fIngles && (
        <div style={{ position: 'absolute', left: 730, top: 420, zIndex: 30, opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
          transform: `rotate(${(-16 + 8 * p).toFixed(2)}deg) scale(${(frame < fIngles + 7 ? 2.3 - 1.3 * p : sq).toFixed(4)})` }}>
          <EnSticker size={190} />
        </div>
      )}
      <Sfx name="hit_soft" at={at('ojo')} volume={0.6} />
      <Sfx name="ui_pop" at={fApp} volume={0.8} />
      <Sfx name="stamp" at={fIngles + 7} volume={0.8} />
      <Sfx name="ui_pop" at={fCambiar} volume={0.8} />
    </BkbStage>
  );
};

// W04 · De más de un millón de títulos, en español hay unos 16.500 audiolibros (las categorías y los idiomas de la app).
const W04: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('W04', w, n);
  const fMillon = at('millon');
  const fEsp = at('espanol');
  const fDiec = at('dieciseis');
  const s0: Shot = { rec: '05_categorias', at: 0, start: 1.0, hold: 12.5 };
  const s1: Shot = { rec: '05_categorias', at: fEsp - 6, start: 36.0, hold: 54.5 };
  s1.marks = [markOn(s1, fEsp, dur + 10, 6, 30, 652, 620, 22)];
  return (
    <BkbStage>
      <Headline text="¿Y en español?" hi="español?" />
      <SwapTag items={[{ at: fMillon, label: 'Más de 1 millón de títulos' }, { at: fDiec, label: 'En español: unos 16.500 audiolibros', dark: true }]} />
      <Phone dur={dur} shots={[s0, s1]} />
      <Sfx name="ui_pop" at={fMillon} volume={0.8} />
      <Sfx name="ui_pop" at={fDiec} volume={0.8} />
    </BkbStage>
  );
};

// W05 · 30 días gratis, con 20 horas (contador 1 → 30 en el sello lila de BookBeat).
const W05: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W05', w, n);
  const fTreinta = at('treinta');
  const fVeinte = at('veinte');
  const LAND = fTreinta + 6;
  const rollFrom = Math.max(0, fTreinta - 22);
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const sBadge = spring({ frame: frame - (fTreinta - 16), fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const lift = interpolate(frame, [fTreinta - 26, fTreinta - 8], [0, 1], { ...clamp, easing: easeInOut });
  const sH = spring({ frame: frame - fVeinte + 2, fps, config: { damping: 14, stiffness: 170 } });
  const sWeb = spring({ frame: frame - LAND - 10, fps, config: { damping: 18, stiffness: 140 } });
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 196, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30 + (1 - lift) * 520).toFixed(2)}px) scale(${(1 + 0.5 * (1 - lift)).toFixed(4)})` }}>
          <BookBeatLogo width={420} />
        </div>
        <div style={{ position: 'absolute', top: 400, width: 700, height: 700, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="700" height="700" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${frame * 0.25}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={BB_DEEP} opacity={0.16} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 88, borderRadius: '50%', background: BB, boxShadow: '0 40px 100px rgba(123,63,196,0.35)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 290, letterSpacing: -12, lineHeight: 0.9, color: BB_INK, fontVariantNumeric: 'tabular-nums' }}>{rollAt(frame)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: BB_INK, letterSpacing: -1 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={540} y={750} r={260} seed="w05" colors={[BB, BB_YELLOW, BB_DEEP, BB_INK]} />
        <div style={{ position: 'absolute', top: 1150, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 22px', borderRadius: 999, background: BB_INK, color: '#fff', boxShadow: shadow.soft,
          fontFamily: font.sans, fontWeight: 700, fontSize: 46, opacity: sH, transform: `translateY(${((1 - sH) * 30).toFixed(2)}px)` }}>
          <ClockIcon size={50} c={BB} /> Con 20 horas
        </div>
        <div style={{ position: 'absolute', top: 1262, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink2, opacity: sWeb }}>
          <GlobeIcon size={40} c={color.ink2} /> Desde bookbeat.com/es
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={LAND - 4} volume={0.7} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.8} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fVeinte} volume={0.7} />
    </BkbStage>
  );
};

// W06 · Si no te convence, cancela en los últimos días: no avisan antes de cobrar (la cuenta real: la prueba gratuita y el
// cambio a Standard el 14/11/2026).
const W06: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('W06', w, n);
  const fCancela = at('cancela');
  const fUlt = at('ultimos');
  const fAvisan = at('avisan');
  const s0: Shot = { rec: '26_cuenta', at: 0, start: 4.0, hold: 22.0 };
  s0.marks = [markOn(s0, fCancela - 2, fAvisan - 6, 16, 606, 632, 150, 18), markOn(s0, fAvisan - 2, dur + 10, 16, 770, 632, 88, 16)];
  return (
    <BkbStage>
      <Headline text="Cancela a tiempo" hi="tiempo" />
      <SwapTag items={[{ at: fUlt, label: 'En los últimos días' }, { at: fAvisan, label: 'No te avisan antes de cobrar', dark: true }]} />
      <Phone dur={dur} shots={[s0]} />
      <Sfx name="ui_pop" at={fCancela} volume={0.6} />
      <Sfx name="ui_pop" at={fUlt} volume={0.8} />
      <Sfx name="ui_pop" at={fAvisan} volume={0.8} />
    </BkbStage>
  );
};

// W07 · Cierre: antes de pagar, compara plataformas en SonorBooks (sin aviso de afiliado: no hay enlaces de afiliado).
const W07: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54, paddingBottom: 360 }}>
        <Logo size={128} delay={2} />
        <div style={{ width: 900, height: 112, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', gap: 22 }}>
          <svg width="42" height="42" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}><Typewriter text="Compara plataformas" start={lead + 4} cps={20} /></div>
        </div>
        <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}><Pill size={54}>sonorbooks.com</Pill></div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={lead + 4} trimAfter={56} />
      <Sfx name="sparkle" at={lead + 30} volume={0.7} />
    </BkbStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { W01, W02, W03, W04, W05, W06, W07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const BookBeatReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [BKB_SHORT_TOTAL - fps * 1.2, BKB_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {BKB_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(BKB_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/bkb_meta.py (subtítulos del vertical).
export const BKB_SHORT_PIECES = PIECES;

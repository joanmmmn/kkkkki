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
import cfg from '../../../public/abc/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AB, AB_DEEP, AB_HOT, AB_TEAL, AbcLogo, AbcStage, AppPhone, BigTitle, Burst, CreditCoin, markOn, MiniBook, PhoneKey, Shot, Tap, VipBadge } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de Audiobooks.com: 7 piezas (U01–U07) con el móvil real y subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07'] as const;
const EXTRA: Record<string, number> = { U01: 12, U02: 12, U03: 16, U04: 16, U05: 70, U06: 20, U07: 110 };
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
export const ABC_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los verticales de Nextory, Podimo, Storytel y Audible (ElevenLabs Music, ~47 s); se apaga al final.
export const ABC_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

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
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («catorce noventa y cinco dólares» → «14,95 $»),
// como en el .srt (tools/abc_meta.py).
const NUMEROS: [string[], string][] = [
  [['catorce', 'noventa', 'y', 'cinco', 'dolares'], '14,95 $'], [['diez', 'mil'], '10.000'], [['treinta', 'dias'], '30 días'],
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
const Headline: React.FC<{ text: string; hi?: string; at?: number; size?: number }> = ({ text, hi, at = 2, size = 86 }) => (
  <AbsoluteFill style={{ alignItems: 'center', paddingTop: 96 }}>
    <BigTitle text={text} hi={hi} at={at} size={size} align="center" style={{ maxWidth: 980 }} />
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

// U01 · Gancho: el móvil entra girando con la portada de la app.
const U01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U01', w, n);
  return (
    <AbcStage>
      <Headline text="¿Merece la pena Audiobooks.com?" hi="Audiobookscom" size={80} />
      <SwapTag items={[{ at: at('desde'), label: 'Desde España' }, { at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: 'inicio_top', at: 0, start: 2.0, hold: 15 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('desde')} />
      <Sfx name="ui_pop" at={at('probado')} />
    </AbcStage>
  );
};

// U02 · Funciona con créditos: por 14,95 $ al mes, un audiolibro que es tuyo para siempre (el perfil con el crédito, el diálogo
// real «Would you like to use 1 audiobook credit…» y, ya canjeado, «Own»).
const U02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U02', w, n);
  const fCred = at('creditos');
  const fCatorce = at('catorce');
  const fAudio = at('audiolibro');
  const fTuyo = at('tuyo');
  const s0: Shot = { rec: 'perfil_prueba', at: 0, start: 3.0, hold: 12 };
  s0.marks = [markOn(s0, fCred, fAudio - 6, 66, 546, 528, 100, 26)];
  const s1: Shot = { rec: 'elon_credito', at: fAudio - 6, start: 4.0, hold: 21 };
  s1.marks = [markOn(s1, fAudio, fTuyo - 6, 62, 544, 524, 384, 22)];
  const s2: Shot = { rec: 'elon_credito', at: fTuyo - 6, start: 24.2, hold: 27.2 };
  s2.marks = [markOn(s2, fTuyo, dur + 10, 508, 378, 104, 40, 20)];
  return (
    <AbcStage>
      <Headline text="Funciona con créditos" hi="créditos" />
      <SwapTag items={[
        { at: fCatorce, label: '14,95 $ al mes', dark: true },
        { at: fAudio, label: '1 audiolibro al mes' },
        { at: fTuyo, label: 'Tuyo para siempre', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1, s2]} />
      {[fCred, fCatorce, fAudio, fTuyo].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="coins" at={fAudio + 4} volume={0.4} />
    </AbcStage>
  );
};

// U03 · Hay novedades en español (Posteguillo con el filtro «Spanish»), pero la app está en inglés y solo busca en inglés si no lo
// cambias (el aviso real «By default, only English-language books are shown…»).
const U03: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U03', w, n);
  const fNov = at('novedades');
  const fApp = at('app');
  const fSolo = at('solo');
  const s0: Shot = { rec: 'post_filtro_es', at: 0, start: 10.6, hold: 22 };
  s0.marks = [markOn(s0, fNov, fApp - 6, 18, 652, 618, 400, 24)];
  const s1: Shot = { rec: 'inicio_top', at: fApp - 6, start: 2.0, hold: 15 };
  s1.marks = [markOn(s1, fApp, fSolo - 6, 22, 664, 600, 152, 26)];
  const s2 = { rec: 'elon_buscar_en', at: fSolo - 6, start: 17.0, hold: 36 } as Shot;
  s2.marks = [markOn(s2, fSolo, dur + 10, 14, 294, 628, 232, 26)];
  return (
    <AbcStage>
      <Headline text="Ojo con el inglés" hi="inglés" />
      <SwapTag items={[
        { at: fNov, label: 'Novedades en español' },
        { at: fApp, label: 'La app, en inglés', dark: true },
        { at: fSolo, label: 'Solo busca en inglés' },
      ]} />
      <Phone dur={dur} shots={[s0, s1, s2]} />
      {[fNov, fApp, fSolo].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="hit_soft" at={at('ojo')} volume={0.5} />
    </AbcStage>
  );
};

// U04 · Lo mejor: más de 10.000 audiolibros gratis sin suscripción (la cuenta gratuita y el Quijote gratis, en español).
const U04: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U04', w, n);
  const fDiez = at('diez');
  const fSin = at('sin');
  const s0: Shot = { rec: 'cuenta_gratis', at: 0, start: 2.0, hold: 18 };
  s0.marks = [markOn(s0, fDiez - 4, fSin + 30, 34, 300, 596, 150, 22)];
  const s1: Shot = { rec: 'quijote_gratis', at: fSin + 32, start: 21.0, hold: 33 };
  s1.marks = [markOn(s1, fSin + 36, dur + 10, 16, 292, 448, 64, 32)];
  return (
    <AbcStage>
      <Headline text="Lo mejor: gratis" hi="gratis" />
      <SwapTag items={[
        { at: fDiez, label: '+10.000 audiolibros gratis', dark: true },
        { at: fSin, label: 'Sin suscripción' },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} />
      {[fDiez, fSin].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="sparkle" at={fDiez + 6} volume={0.5} />
    </AbcStage>
  );
};

// U05 · 30 días gratis con 3 audiolibros desde SonorBooks (contador 1 → 30 en el sello naranja) y, debajo, los libros: 1 con el
// crédito y 2 de la selección VIP; las condiciones de la tarjeta de SonorBooks.
const U05: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U05', w, n);
  const fSonor = at('sonorbooks');
  const fTreinta = at('treinta');
  const fTres = at('tres');
  const LAND = fTreinta + 10;
  const rollFrom = fTreinta - 18;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const sBadge = spring({ frame: frame - (fTreinta - 16), fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const lift = interpolate(frame, [fTreinta - 24, fTreinta - 6], [0, 1], { ...clamp, easing: easeInOut });
  const pulse = interpolate(frame, [fSonor - 2, fSonor + 5, fSonor + 16], [0, 1, 0], clamp);
  const book = (f: number) => spring({ frame: frame - f, fps, config: { damping: 11, stiffness: 190 } });
  const sFine = spring({ frame: frame - LAND - 34, fps, config: { damping: 18, stiffness: 140 } });
  const sPill = spring({ frame: frame - LAND - 26, fps, config: { damping: 16, stiffness: 160 } });
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  const bk = (s: number, tone: 'orange' | 'teal', label: React.ReactNode) => (
    <div style={{ opacity: Math.min(1, s * 1.5), transform: `translateY(${((1 - s) * -60).toFixed(2)}px) rotate(${((1 - s) * -16).toFixed(2)}deg) scale(${(0.6 + 0.4 * s).toFixed(4)})` }}>
      <MiniBook w={110} tone={tone} label={label} />
    </div>
  );
  return (
    <AbcStage>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 196, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30 + (1 - lift) * 520}px) scale(${(1 + 0.6 * (1 - lift)) * (1 + 0.05 * pulse)})` }}>
          <AbcLogo width={300} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.muted }}>×</span>
          <LogoIcon size={84} />
        </div>
        <div style={{ position: 'absolute', top: 380, width: 620, height: 620, transform: `scale(${sBadge * (1 + 0.07 * bump)})` }}>
          <svg width="620" height="620" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${frame * 0.25}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={AB} opacity={0.18} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 78, borderRadius: '50%', background: `linear-gradient(160deg, ${AB_HOT} 0%, ${AB} 100%)`, boxShadow: '0 40px 100px rgba(255,80,28,0.42)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 240, letterSpacing: -12, lineHeight: 0.86, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{rollAt(frame)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: '#fff', letterSpacing: -1, marginTop: 8 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={540} y={690} r={250} seed="u05" colors={[AB, color.yellow, AB_HOT, AB_TEAL]} />
        <div style={{ position: 'absolute', top: 1020, display: 'flex', alignItems: 'center', gap: 22 }}>
          {bk(book(fTres - 2), 'orange', <CreditCoin size={56} />)}
          {bk(book(fTres + 6), 'teal', <VipBadge size={38} style={{ background: 'rgba(255,255,255,0.22)' }} />)}
          {bk(book(fTres + 12), 'teal', <VipBadge size={38} style={{ background: 'rgba(255,255,255,0.22)' }} />)}
        </div>
        <div style={{ position: 'absolute', top: 1196, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
          fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sPill, transform: `translateY(${(1 - sPill) * 30}px)` }}>
          <CalendarIcon size={46} c={AB_DEEP} /> Después, 14,95 USD/mes
        </div>
        <div style={{ position: 'absolute', top: 1300, width: 900, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 29, lineHeight: 1.3, color: color.muted, opacity: sFine }}>
          Prueba: 1 audiolibro y 2 de la selección VIP. Solo nuevas altas elegibles; una prueba por persona u hogar.
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={LAND - 4} volume={0.7} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.8} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.7} />
      {[0, 6, 12].map((d) => <Sfx key={d} name="snap_in" at={fTres + d} volume={0.6} />)}
      <Sfx name="ui_pop" at={LAND + 26} volume={0.6} />
    </AbcStage>
  );
};

// U06 · Pero si cancelas durante la prueba, pierdes los libros (la biblioteca con Elon Musk, «Own»).
const U06: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U06', w, n);
  const fCanc = at('cancelas');
  const fPierdes = at('pierdes');
  const s0: Shot = { rec: 'biblioteca_elon', at: 0, start: 3.0, hold: 14.5 };
  s0.marks = [markOn(s0, fPierdes - 2, dur + 10, 18, 340, 466, 760, 26)];
  return (
    <AbcStage>
      <Headline text="Ojo al cancelar" hi="cancelar" />
      <SwapTag items={[
        { at: fCanc, label: 'Si cancelas en la prueba' },
        { at: fPierdes, label: 'Pierdes los libros', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0]} />
      <Sfx name="ui_pop" at={fCanc} volume={0.8} />
      <Sfx name="hit_soft" at={fPierdes} volume={0.7} />
    </AbcStage>
  );
};

// U07 · Cierre: busca tu próximo libro en SonorBooks (con el aviso de afiliado).
const U07: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <AbcStage>
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
    </AbcStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { U01, U02, U03, U04, U05, U06, U07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const AudiobooksReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [ABC_SHORT_TOTAL - fps * 1.2, ABC_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {ABC_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(ABC_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/abc_meta.py (subtítulos del vertical).
export const ABC_SHORT_PIECES = PIECES;
export { AB_DEEP };

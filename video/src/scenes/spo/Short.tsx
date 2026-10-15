import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { UserIcon } from '../../components/Icons2';
import { VOS, voSrc } from '../../lib/vo';
import { FeatureTag } from '../nxr/kit';
import cfg from '../../../public/spo/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, BigTitle, markOn, PhoneKey, Shot, SP, SP_INK, SP_LILAC, SP_PEACH, SpoStage, SpotifyLogo, Tap } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de los audiolibros de Spotify: 7 piezas (Y01–Y07) con el móvil real y
// subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['Y01', 'Y02', 'Y03', 'Y04', 'Y05', 'Y06', 'Y07'] as const;
const EXTRA: Record<string, number> = { Y01: 14, Y02: 14, Y03: 16, Y04: 18, Y05: 16, Y06: 22, Y07: 110 };
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
export const SPO_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los verticales de las otras reseñas (ElevenLabs Music, ~47 s); se apaga al final.
export const SPO_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

type CW = { w: string; s: number; e: number };
const textOf = (id: string) => (cfg.scenes as { id: string; text: string; say?: string }[]).find((s) => s.id === id)?.text ?? '';
const estWords = (id: string): CW[] => {
  const out: CW[] = [];
  const re = /\S+/g;
  const t = textOf(id);
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) out.push({ w: m[0], s: m.index / 15, e: (m.index + m[0].length) / 15 });
  return out;
};
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («ocho noventa y nueve» → «8,99 €»), como en el
// .srt (tools/spo_meta.py); «Audiolibros Plus» (así lo lee la voz) se escribe «Audiolibros+». Los patrones largos, antes.
const NUMEROS: [string[], string][] = [
  [['ocho', 'noventa', 'y', 'nueve'], '8,99 €'], [['doce', 'horas'], '12 horas'], [['quince', 'horas'], '15 horas'], [['audiolibros', 'plus'], 'Audiolibros+'],
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
          return <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, lineHeight: 1.15, padding: '2px 16px', borderRadius: 16, color: color.ink, background: active ? SP : 'rgba(255,255,255,0.96)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>{w.w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

type SP_ = { lead: number; dur: number };
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

// Y01 · Gancho: el móvil entra girando con la sección Audiolibros de la app.
const Y01: React.FC<SP_> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y01', w, n);
  return (
    <SpoStage>
      <Headline text="¿Merecen la pena?" hi="pena?" />
      <SwapTag items={[{ at: at('audiolibros'), label: 'Los audiolibros de Spotify' }, { at: at('probado'), label: 'Los hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: '01_hub', at: 0, start: 0.6, hold: 3.4 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('audiolibros')} volume={0.6} />
      <Sfx name="ui_pop" at={at('probado')} />
    </SpoStage>
  );
};

// Y02 · Con Premium, 12 horas al mes incluidas (la página «Tiempo de escucha de audiolibros» de la app: 0 h de 12).
const Y02: React.FC<SP_> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y02', w, n);
  const fDoce = at('doce');
  const s0: Shot = { rec: '10_horas', at: 0, start: 1.0, hold: 14.0 };
  s0.marks = [markOn(s0, fDoce - 4, dur + 10, 20, 312, 624, 150, 18)];
  return (
    <SpoStage>
      <Headline text="12 horas al mes" hi="horas" />
      <SwapTag items={[{ at: at('premium'), label: 'Si pagas Premium (no Estudiantes)' }, { at: at('sin'), label: 'Sin pagar más', dark: true }]} />
      <Phone dur={dur} shots={[s0]} />
      <Sfx name="ui_pop" at={at('premium')} volume={0.7} />
      <Sfx name="ui_pop" at={fDoce} volume={0.8} />
      <Sfx name="ui_pop" at={at('sin')} volume={0.7} />
    </SpoStage>
  );
};

// Y03 · Ojo: se cuentan a velocidad normal (la hoja «Velocidad», a 3,5x) y las que no usas se pierden («7 días hasta que se
// renueven»).
const Y03: React.FC<SP_> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y03', w, n);
  const fVel = at('velocidad');
  const fUsas = at('usas');
  const s0: Shot = { rec: '06_velocidad', at: 0, start: 10.0, hold: 19.5 };
  s0.marks = [markOn(s0, fVel - 2, fUsas - 8, 24, 1050, 616, 232, 22)];
  const s1: Shot = { rec: '10_horas', at: fUsas - 6, start: 1.0, hold: 14.0 };
  s1.marks = [markOn(s1, fUsas, dur + 10, 20, 494, 624, 54, 14)];
  return (
    <SpoStage>
      <Headline text="Ojo con las horas" hi="horas" />
      <SwapTag items={[{ at: fVel, label: 'Se cuentan a velocidad normal' }, { at: fUsas, label: 'Las que no usas se pierden', dark: true }]} />
      <Phone dur={dur} shots={[s0, s1]} />
      <Sfx name="ui_pop" at={fVel} volume={0.8} />
      <Sfx name="cross" at={at('pierden')} volume={0.6} />
    </SpoStage>
  );
};

// Y04 · En español, superventas incluidos: Reina Roja y La sombra del viento (búsquedas con el filtro Audiolibros).
const Y04: React.FC<SP_> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y04', w, n);
  const fReina = at('reina');
  const fSombra = at('sombra');
  const s0: Shot = { rec: '02_reina_filtro', at: 0, start: 1.5, hold: 15.5 };
  s0.marks = [markOn(s0, fReina - 2, fSombra - 8, 8, 200, 648, 112, 18)];
  const s1: Shot = { rec: '16_sombra', at: fSombra - 6, start: 0.6, hold: 16.1 };
  s1.marks = [markOn(s1, fSombra, dur + 10, 8, 200, 648, 200, 18)];
  return (
    <SpoStage>
      <Headline text="¿Y en español?" hi="español?" />
      <SwapTag items={[{ at: fReina, label: 'Reina Roja, incluido' }, { at: fSombra, label: 'La sombra del viento, incluido', dark: true }]} />
      <Phone dur={dur} shots={[s0, s1]} />
      <Sfx name="ui_pop" at={fReina} volume={0.8} />
      <Sfx name="ui_pop" at={fSombra} volume={0.8} />
      <Sfx name="success" at={at('incluidos')} volume={0.5} />
    </SpoStage>
  );
};

// Y05 · Audiolibros+: 15 horas más al mes por 8,99 € (la tarjeta de la app, en «Tiempo de escucha»).
const Y05: React.FC<SP_> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y05', w, n);
  const fPlus = at('audiolibros');
  const fOcho = at('ocho');
  const s0: Shot = { rec: '10_horas', at: 0, start: 16.0, hold: 26.0 };
  s0.marks = [markOn(s0, fPlus - 2, dur + 10, 22, 438, 620, 324, 20)];
  return (
    <SpoStage>
      <Headline text="¿Te quedas corto?" hi="corto?" />
      <SwapTag items={[{ at: fPlus, label: 'Audiolibros+: 15 horas más' }, { at: fOcho, label: '8,99 € al mes, sobre Premium', dark: true }]} />
      <Phone dur={dur} shots={[s0]} />
      <Sfx name="ui_pop" at={fPlus} volume={0.8} />
      <Sfx name="ui_pop" at={fOcho} volume={0.8} />
    </SpoStage>
  );
};

// Y06 · En Duo y Familiar, las horas son solo para quien paga (spotify.com/es/premium: «solo para el administrador del plan»).
const Y06: React.FC<SP_> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Y06', w, n);
  const fDuo = at('duo');
  const fFam = at('familiar');
  const fSolo = at('solo');
  const only = interpolate(frame, [fSolo - 6, fSolo + 10], [0, 1], { ...clamp, easing: easeInOut });
  const group = (n: number, f: number, tint: string, label: string, y: number) => {
    const s = spring({ frame: frame - (f - 6), fps, config: { damping: 14, stiffness: 160 } });
    const size = n > 2 ? 118 : 170;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: s, transform: `translateY(${((1 - s) * 60).toFixed(2)}px)` }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.4 }}>{label}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {Array.from({ length: n }, (_, k) => {
            const lit = k === 0 ? 1 : 1 - only;
            const sk = spring({ frame: frame - (f - 2 + k * 3), fps, config: { damping: 12, stiffness: 220 } });
            return (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${sk.toFixed(4)})` }}>
                <span style={{ width: size, height: size, borderRadius: '50%', background: lit > 0.5 ? tint : '#D9D9DE', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: k === 0 && only > 0.5 ? `0 0 0 ${(8 * only).toFixed(1)}px ${SP}` : shadow.soft }}>
                  <UserIcon size={size * 0.55} c={lit > 0.5 ? SP_INK : '#8A8A8A'} />
                </span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: n > 2 ? 30 : 40, color: lit > 0.5 ? color.ink : color.muted }}>{k === 0 ? '12 h' : only > 0.5 ? '0 h' : '12 h'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <SpoStage>
      <Headline text="Ojo con Duo y Familiar" hi="Familiar" />
      <SwapTag items={[{ at: fSolo, label: 'Las horas, solo para quien paga', dark: true }]} />
      {group(2, fDuo, SP_PEACH, 'Duo', 470)}
      {group(6, fFam, SP_LILAC, 'Familiar', 900)}
      <Sfx name="ui_pop" at={fDuo} volume={0.7} />
      <Sfx name="ui_pop" at={fFam} volume={0.7} />
      <Sfx name="cross" at={fSolo + 4} volume={0.6} />
    </SpoStage>
  );
};

// Y07 · Cierre: antes de pagar, compara plataformas en SonorBooks (sin aviso de afiliado: no hay enlaces de afiliado).
const Y07: React.FC<SP_> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <SpoStage>
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
    </SpoStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP_>> = { Y01, Y02, Y03, Y04, Y05, Y06, Y07 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const SpotifyReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [SPO_SHORT_TOTAL - fps * 1.2, SPO_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {SPO_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(SPO_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/spo_meta.py (subtítulos del vertical).
export const SPO_SHORT_PIECES = PIECES;
export { SpotifyLogo };

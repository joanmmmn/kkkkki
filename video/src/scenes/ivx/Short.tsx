import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Typewriter } from '../../components/Kinetic';
import { VOS, voSrc } from '../../lib/vo';
import { FeatureTag } from '../nxr/kit';
import cfg from '../../../public/ivx/vo/vo.json';
import { hasVO, speechFrames, wf } from './timeline';
import { AppPhone, BigTitle, Crown, Diamond, IvxLogo, IvxStage, markOn, PhoneKey, Shot, Tap } from './kit';

// Versión vertical (Shorts, Reels, TikTok) de la reseña de iVoox: 6 piezas (Y01–Y06) con el móvil real y subtítulos.
const FPS = 50;
const LEAD = 6;
const IDS = ['Y01', 'Y02', 'Y03', 'Y04', 'Y05', 'Y06'] as const;
const EXTRA: Record<string, number> = { Y01: 12, Y02: 14, Y03: 18, Y04: 18, Y05: 22, Y06: 120 };
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
export const IVX_SHORT_TOTAL = PIECES.reduce((a, p) => a + p.dur, 0);
// Misma música que los otros verticales (ElevenLabs Music, ~47 s); se apaga al final.
export const IVX_SHORT_MUSIC: string | null = 'music/nxr_short.mp3';

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
// Las cifras que la voz dice en letra se escriben con números en los subtítulos («tres noventa y nueve» → «3,99 €»), como en el .srt.
const NUMEROS: [string[], string][] = [
  [['tres', 'noventa', 'y', 'nueve'], '3,99 €'], [['nueve', 'noventa', 'y', 'nueve'], '9,99 €'],
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
const Headline: React.FC<{ text: string; hi?: string; at?: number; size?: number; icon?: React.ReactNode }> = ({ text, hi, at = 2, size = 86, icon }) => (
  <AbsoluteFill style={{ alignItems: 'center', paddingTop: 96 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      {icon}
      <BigTitle text={text} hi={hi} at={at} size={size} align="center" style={{ maxWidth: 980 }} />
    </div>
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

// Y01 · Gancho: el móvil entra girando con la portada de la app.
const Y01: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y01', w, n);
  const frame = useCurrentFrame();
  const sLogo = spring({ frame: frame - 2, fps: FPS, config: { damping: 16, stiffness: 150 } });
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 26 }}>
        <div style={{ opacity: sLogo }}><IvxLogo width={170} /></div>
      </AbsoluteFill>
      <Headline text="¿Merece la pena iVoox?" hi="iVoox" size={80} />
      <SwapTag items={[{ at: at('probado'), label: 'Lo hemos probado a fondo', dark: true }]} />
      <Phone dur={dur} shots={[{ rec: 'inicio_top', at: 0, start: 3.0, hold: 10 }]} from={{ rx: 16, ry: -40, rz: 7, s: 0.82, y: 140 }} />
      <Sfx name="whoosh_deep" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={at('probado')} />
    </IvxStage>
  );
};

// Y02 · Casi todo es gratis: pódcast (los Originals), radio en directo (la SER) y descargas (un episodio gratis que se descarga).
const Y02: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y02', w, n);
  const fPod = at('podcast');
  const fRadio = at('radio');
  const fDesc = at('descargas');
  const s0: Shot = { rec: 'originals', at: 0, start: 3.0, hold: 15 };
  const s1: Shot = { rec: 'radio_ser', at: fRadio - 6, start: 2.0, hold: 15 };
  s1.marks = [markOn(s1, fRadio, fDesc - 6, 220, 990, 224, 92, 22)];
  const s2: Shot = { rec: 'contrahistoria_descarga', at: fDesc - 6, start: 17.0, hold: 26 };
  s2.marks = [markOn(s2, fDesc, dur + 10, 10, 858, 644, 128, 18)];
  return (
    <IvxStage>
      <Headline text="Casi todo, gratis" hi="gratis" />
      <SwapTag items={[
        { at: fPod, label: 'Pódcast' },
        { at: fRadio, label: 'Radio en directo', dark: true },
        { at: fDesc, label: 'Descargas' },
      ]} />
      <Phone dur={dur} shots={[s0, s1, s2]} />
      {[fPod, fRadio, fDesc].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="success" at={fDesc + 20} volume={0.35} />
    </IvxStage>
  );
};

// Y03 · Pero hay truco: si rechazas sus cookies de publicidad, te pide pagar (el aviso real con «Rechazar y suscribirse» y el muro
// con Premium y Plus).
const Y03: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y03', w, n);
  const fTruco = at('truco');
  const fRech = at('rechazas');
  const fPagar = at('pagar');
  const s0: Shot = { rec: 'web_aviso', at: 0, start: 2.0, hold: 13.8 };
  s0.marks = [markOn(s0, fRech - 2, fPagar - 10, 50, 1088, 566, 68, 14)];
  const tapF = fPagar - 12;
  const s1: Shot = { rec: 'web_muro', at: fPagar - 8, start: 2.2, hold: 19.5 };
  s1.marks = [markOn(s1, fPagar, dur + 10, 150, 356, 372, 492, 24)];
  return (
    <IvxStage>
      <Headline text="Pero hay truco" hi="truco" />
      <SwapTag items={[
        { at: fRech, label: 'Si rechazas sus cookies…' },
        { at: fPagar, label: '…te pide pagar', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} taps={[{ f: tapF, x: 332, y: 1122 }]} />
      <Sfx name="hit_soft" at={fTruco} volume={0.6} />
      <Sfx name="ui_pop" at={fRech} volume={0.8} />
      <Sfx name="ui_tap" at={tapF} volume={0.6} />
      <Sfx name="coins" at={fPagar + 2} volume={0.4} />
    </IvxStage>
  );
};

// Y04 · Premium quita los anuncios por 3,99 €/mes, con el primer mes gratis (la página de Premium de ivoox.com, plan mensual).
const Y04: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y04', w, n);
  const fAnuncios = at('anuncios');
  const fTres = at('tres');
  const fPrimer = at('primer');
  const s0: Shot = { rec: 'web_premium', at: 0, start: 24.0, hold: 35 };
  s0.marks = [markOn(s0, fTres - 2, dur + 10, 22, 896, 620, 204, 26)];
  return (
    <IvxStage>
      <Headline text="Premium" icon={<Crown size={80} />} />
      <SwapTag items={[
        { at: fAnuncios, label: 'Sin anuncios' },
        { at: fTres, label: '3,99 € al mes', dark: true },
        { at: fPrimer, label: 'El primer mes, gratis' },
      ]} />
      <Phone dur={dur} shots={[s0]} />
      {[fAnuncios, fTres, fPrimer].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
      <Sfx name="sparkle" at={fPrimer + 6} volume={0.5} />
    </IvxStage>
  );
};

// Y05 · Y Plus, por 9,99 €/mes, desbloquea lo exclusivo (la oferta real de la app); sin él, solo un avance (7:05 de una hora).
const Y05: React.FC<SP> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Y05', w, n);
  const fNueve = at('nueve');
  const fExcl = at('exclusivo');
  const fSin = at('sin');
  const s0: Shot = { rec: 'plus_oferta', at: 0, start: 3.2, hold: 22 };
  s0.marks = [markOn(s0, fNueve - 2, fSin - 8, 40, 214, 480, 186, 18)];
  const s1: Shot = { rec: 'contrahistoria_avance', at: fSin - 8, start: 6.0, hold: 15 };
  s1.marks = [markOn(s1, fSin, dur + 10, 22, 1186, 620, 58, 16)];
  return (
    <IvxStage>
      <Headline text="Plus" icon={<Diamond size={84} />} />
      <SwapTag items={[
        { at: fNueve, label: '9,99 € al mes', dark: true },
        { at: fExcl, label: 'Lo exclusivo' },
        { at: fSin, label: 'Sin él: solo un avance', dark: true },
      ]} />
      <Phone dur={dur} shots={[s0, s1]} />
      {[fNueve, fExcl, fSin].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </IvxStage>
  );
};

// Y06 · Cierre: ¿buscas audiolibros? Compara plataformas en SonorBooks (sin aviso de afiliado: este vídeo no lleva enlaces de afiliado).
const Y06: React.FC<SP> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - lead - 30, fps, config: { damping: 12 } });
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54, paddingBottom: 360 }}>
        <Logo size={128} delay={2} />
        <div style={{ width: 900, height: 112, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', gap: 22 }}>
          <svg width="42" height="42" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 46, color: color.ink }}><Typewriter text="Tu próximo libro" start={lead + 4} cps={20} /></div>
        </div>
        <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}><Pill size={54}>sonorbooks.com</Pill></div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={lead + 4} trimAfter={50} />
      <Sfx name="sparkle" at={lead + 30} volume={0.7} />
    </IvxStage>
  );
};

const COMPONENTS: Record<string, React.FC<SP>> = { Y01, Y02, Y03, Y04, Y05, Y06 };

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${0.98 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const IvooxReviewShort: React.FC = () => {
  const { fps } = useVideoConfig();
  const music = (f: number) => {
    let d = 0;
    for (const p of PIECES) { const a = p.at + LEAD, b = p.at + p.dur - 6; d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)); }
    return 0.2 * (1 - 0.45 * d) * interpolate(f, [0, fps * 0.3], [0, 1], clamp) * interpolate(f, [IVX_SHORT_TOTAL - fps * 1.2, IVX_SHORT_TOTAL], [1, 0], { ...clamp, easing: easeInOut });
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
      {IVX_SHORT_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(IVX_SHORT_MUSIC)} volume={music} />}
    </AbsoluteFill>
  );
};

// Para tools/ivx_meta.py (subtítulos del vertical).
export const IVX_SHORT_PIECES = PIECES;

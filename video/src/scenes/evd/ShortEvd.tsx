import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Highlight } from '../../components/Highlight';
import { Words, Typewriter } from '../../components/Kinetic';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Sfx } from '../../components/Sfx';
import { VOS, voSrc } from '../../lib/vo';
import { EVD_MUSIC } from '../../lib/config';
import { clamp, easeOut } from '../../lib/anim';
import { EverandBadge, EV_LIME, LaptopIcon, LockIcon, PhoneIcon, Pop, ScribdBadge, Strike, WarnIcon } from './ui';

// Short vertical (1080×1920) de la reseña de Everand, con la locución del vídeo largo por tramos:
// [id, desde (s), hasta (s), inicio en el short (s)].
type Piece = { id: string; from: number; to: number; at: number };
export const EVD_SHORT_PIECES: Piece[] = [
  { id: 'R01', from: 0, to: 10.45, at: 0.3 },
  { id: 'R04', from: 0, to: 3.5, at: 11.0 },
  { id: 'R04', from: 11.55, to: 16.35, at: 14.8 },
  { id: 'R08', from: 0, to: 9.1, at: 20.0 },
  { id: 'R12', from: 5.0, to: 8.2, at: 29.5 },
  { id: 'R12', from: 8.26, to: 13.4, at: 33.0 },
];
export const EVD_SHORT_DUR = 41.0;

// Subtítulos palabra a palabra, agrupados en frases cortas (como en el short de El Libro Total).
type CW = { w: string; s: number; e: number; piece: number };
const captionWords = (): CW[] => EVD_SHORT_PIECES.flatMap((p, k) => (VOS[p.id]?.words ?? [])
  .filter((w) => w.s >= p.from - 0.01 && w.s < p.to - 0.05)
  .map((w) => ({ w: w.w.replace(/[«»…]/g, ''), s: w.s - p.from + p.at, e: Math.min(w.e, p.to) - p.from + p.at, piece: k })));
const chunks = (ws: CW[]) => {
  const out: CW[][] = [];
  let cur: CW[] = [];
  for (const w of ws) {
    if (cur.length && cur[cur.length - 1].piece !== w.piece) { out.push(cur); cur = []; }
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groups = React.useMemo(() => chunks(captionWords()), []);
  const g = groups.find((c) => t >= c[0].s - 0.05 && t <= c[c.length - 1].e + 0.25);
  if (!g) return null;
  const pop = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 14, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1330 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', maxWidth: 940, transform: `scale(${0.92 + 0.08 * pop})` }}>
        {g.map((w, i) => {
          const active = t >= w.s - 0.03 && t <= w.e + 0.05;
          return (
            <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 76, lineHeight: 1.15, padding: '2px 14px', borderRadius: 16, color: color.ink, background: active ? color.yellow : 'rgba(255,255,255,0.94)', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Recorte vertical de una captura 4K de la web (coordenadas CSS de la página a 1920×1080), con un marco amarillo.
const VShot: React.FC<{ src: string; x0: number; y0: number; s: number; w: number; h: number; mark?: { x: number; y: number; w: number; h: number; at: number; label: string } }> = ({ src, x0, y0, s, w, h, mark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = mark ? spring({ frame: frame - mark.at, fps, config: { damping: 16, stiffness: 160 } }) : 0;
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', borderRadius: 36, boxShadow: shadow.card, background: '#fff', border: `1px solid ${color.line}` }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', left: -x0 * s, top: -y0 * s, width: 1920 * s, height: 1080 * s }} />
      {mark && frame >= mark.at && (
        <>
          {/* La sombra exterior oscurece todo menos el interior del marco. */}
          <div style={{ position: 'absolute', left: (mark.x - x0) * s - 8, top: (mark.y - y0) * s - 8, width: mark.w * s + 16, height: mark.h * s + 16, borderRadius: 14, border: `6px solid rgba(255,202,5,${m})`, boxShadow: `0 0 0 9999px rgba(6,10,18,${0.45 * m}), 0 0 24px rgba(255,202,5,${0.8 * m})`, transform: `scale(${1.15 - 0.15 * m})` }} />
          <div style={{ position: 'absolute', left: (mark.x - x0) * s - 8, top: (mark.y - y0) * s - 70, background: color.yellow, borderRadius: 999, padding: '6px 22px', fontFamily: font.sans, fontWeight: 700, fontSize: 38, opacity: m, whiteSpace: 'nowrap' }}>{mark.label}</div>
        </>
      )}
    </div>
  );
};

export const EVDShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = (sec: number) => Math.round(sec * fps);
  // Instantes de las palabras clave (segundos del short).
  const w = (k: number, word: string, fb: number) => {
    const p = EVD_SHORT_PIECES[k];
    // Si la palabra se repite, la aparición más cercana al instante de referencia (fb, en segundos del short).
    const hits = (VOS[p.id]?.words ?? []).filter((x) => x.s >= p.from - 0.01 && x.s < p.to && x.w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').startsWith(word));
    const at = (x: { s: number }) => x.s - p.from + p.at;
    const hit = hits.reduce<{ s: number } | null>((a2, x) => (!a2 || Math.abs(at(x) - fb) < Math.abs(at(a2) - fb) ? x : a2), null);
    return T(hit ? at(hit) : fb);
  };
  const fScribd = w(0, 'scribd', 1.4);
  const fNetflix = w(0, 'netflix', 2.9);
  const fHoy = w(0, 'hoy', 4.6);
  const fEverand = w(0, 'everand', 5.4);
  const fPlan = w(0, 'plan', 6.9);
  const fLibro = w(0, 'libro', 8.5);
  const fSi = w(0, 'si', 9.6);
  const segB = T(10.85);
  const fAcabo = w(1, 'acabo', 13.0);
  const segB2 = T(14.65);
  const fMayoria = w(2, 'mayoria', 18.7);
  const segC = T(19.85);
  const fTreinta = w(3, 'treinta', 21.8);
  const fSiete = w(3, 'siete', 24.7);
  const fUnico = w(3, 'unico', 26.4);
  const segD = T(29.35);
  const fNum = w(4, '6,2', 30.8);
  const segE = T(32.85);
  const fBusca = w(5, 'buscalo', 36.4);
  const segF = T(38.3);
  const big = spring({ frame: frame - fSi + 2, fps, config: { damping: 13, stiffness: 150 } });
  const ring = interpolate(frame, [segD + 6, fNum + 20], [0, 0.62], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const R = 200;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {/* A · Gancho: «el Netflix de los libros» → Everand → 1 libro al mes */}
      <Sequence durationInFrames={segB}>
        <Stage tone="night">
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: -300 - frame * 0.3, top: -200, display: 'flex', flexWrap: 'wrap', width: 2200, transform: 'rotate(-8deg)', opacity: 0.45, filter: 'blur(3px)' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => <Img key={i} src={staticFile('evd/img/hero_collage.jpg')} style={{ width: 720, display: 'block' }} />)}
            </div>
            <AbsoluteFill style={{ background: 'rgba(18,19,22,0.78)' }} />
          </AbsoluteFill>
          <Sequence durationInFrames={fHoy} layout="none">
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330, gap: 40 }}>
              <Pop at={fScribd - 6}><ScribdBadge size={100} /></Pop>
              <Pop at={fScribd + 10}><div style={{ fontFamily: font.sans, fontSize: 44, letterSpacing: 8, color: 'rgba(255,255,255,0.65)' }}>LO LLAMABAN</div></Pop>
              <Pop at={fNetflix - 8}>
                <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 120, color: '#fff', textAlign: 'center', lineHeight: 1.1 }}>«el <Highlight start={fNetflix + 6} dur={12} fill="rgba(255,202,5,0.85)">Netflix</Highlight><br />de los libros»</div>
              </Pop>
            </AbsoluteFill>
          </Sequence>
          <Sequence from={fHoy} durationInFrames={fPlan - 4 - fHoy} layout="none">
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 380, gap: 60 }}>
              <div style={{ position: 'relative', opacity: 0.6 }}><ScribdBadge size={80} /><Strike at={12} thick={10} rotate={-8} /></div>
              <svg width="60" height="90" viewBox="0 0 60 90"><path d="M30 4v74M12 60l18 18 18-18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <Pop at={fEverand - fHoy - 3} from={0.5}><EverandBadge size={170} dark /></Pop>
            </AbsoluteFill>
          </Sequence>
          <Sequence from={fPlan - 4} layout="none">
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 260, gap: 10 }}>
              <Pop at={0}><div style={{ fontFamily: font.sans, fontSize: 56, color: 'rgba(255,255,255,0.8)' }}>Con su plan más barato</div></Pop>
              <Pop at={fLibro - fPlan - 2} from={0.4}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 520 + 120 * big, lineHeight: 0.9, color: EV_LIME, textAlign: 'center' }}>1</div>
              </Pop>
              <Pop at={fLibro - fPlan + 6}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 110, color: '#fff' }}>libro al mes</div></Pop>
              {frame >= fSi - 2 && (
                <Pop at={fSi - fPlan + 2} from={1.6} rise={0} damping={12}>
                  <div style={{ marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: color.ink, background: color.yellow, padding: '4px 40px 14px', borderRadius: 24, transform: 'rotate(-3deg)' }}>Sí: uno.</div>
                </Pop>
              )}
            </AbsoluteFill>
          </Sequence>
        </Stage>
      </Sequence>

      {/* B · Se acabó el ilimitado → «la mayoría» */}
      <Sequence from={segB} durationInFrames={segB2 - segB}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300, gap: 60 }}>
            <Pop at={6}>
              <div style={{ width: 340, borderRadius: 36, overflow: 'hidden', background: '#fff', boxShadow: shadow.card, textAlign: 'center', fontFamily: font.sans }}>
                <div style={{ background: color.red, color: '#fff', fontWeight: 700, fontSize: 52, padding: '14px 0', letterSpacing: 4 }}>OCT</div>
                <div style={{ fontWeight: 700, fontSize: 170, lineHeight: 1.1 }}>30</div>
                <div style={{ fontWeight: 500, fontSize: 54, color: color.ink2, paddingBottom: 26 }}>2024</div>
              </div>
            </Pop>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -4, color: frame >= fAcabo + 8 ? '#B8B8BC' : color.ink }}>
              ILIMITADO<Strike at={fAcabo - segB + 2} thick={18} rotate={-4} />
            </div>
            {frame >= fAcabo - 2 && (
              <div style={{ transform: `rotate(-8deg) scale(${2 - spring({ frame: frame - fAcabo, fps, config: { damping: 11, stiffness: 220 } })})`, padding: '10px 34px', border: `9px solid ${color.red}`, borderRadius: 20, color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 90, letterSpacing: 3 }}>SE ACABÓ</div>
            )}
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <Sequence from={segB2} durationInFrames={segC - segB2}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170, gap: 40 }}>
            <Words text="¿Qué libros necesitan desbloqueo?" start={4} size={76} weight={700} style={{ maxWidth: 940 }} />
            <VShot src="evd/shots/help_mayoria.jpg" x0={772} y0={286} s={2.15} w={960} h={430} mark={{ x: 790, y: 334, w: 89, h: 34, at: fMayoria - segB2 - 6, label: 'Respuesta oficial' }} />
            <Pop at={fMayoria - segB2 + 4}><div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 120 }}>«La mayoría».</div></Pop>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* C · Prueba gratis: 30 días web, 7 app, 1 libro */}
      <Sequence from={segC} durationInFrames={segD - segC}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170, gap: 40, fontFamily: font.sans }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><WarnIcon size={90} /><Words text="Ojo con la prueba" start={2} size={84} weight={700} /></div>
            <div style={{ display: 'flex', gap: 30 }}>
              {[{ i: <LaptopIcon size={56} />, t: 'Web', d: '30', f: fTreinta, bad: false }, { i: <PhoneIcon size={56} c={color.red} />, t: 'App', d: '7', f: fSiete, bad: true }].map((c) => (
                <Pop key={c.t} at={c.f - segC - 6}>
                  <div style={{ width: 430, padding: '30px 0 36px', borderRadius: 40, background: c.bad ? '#FFF3F3' : '#fff', border: `${c.bad ? 5 : 1}px solid ${c.bad ? color.red : color.line}`, boxShadow: shadow.card, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 50, fontWeight: 700, color: color.ink2 }}>{c.i}{c.t}</div>
                    <div style={{ fontSize: 230, fontWeight: 700, lineHeight: 1, color: c.bad ? color.red : color.ink }}>{c.d}</div>
                    <div style={{ fontSize: 50, color: color.ink2 }}>días</div>
                  </div>
                </Pop>
              ))}
            </div>
            <Pop at={fUnico - segC - 6}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: color.ink, color: '#fff', borderRadius: 999, padding: '20px 44px', fontSize: 58, fontWeight: 700 }}><LockIcon size={56} c={EV_LIME} open={1} /> Solo 1 libro</div>
            </Pop>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* D · Nota */}
      <Sequence from={segD} durationInFrames={segE - segD}>
        <Stage tone="warm">
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300, gap: 40, fontFamily: font.sans }}>
            <div style={{ fontSize: 48, letterSpacing: 8, color: color.muted, fontWeight: 500 }}>NOTA SONORBOOKS</div>
            <div style={{ position: 'relative', width: 520, height: 520 }}>
              <svg width={520} height={520} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={260} cy={260} r={R} stroke="#F0F0F0" strokeWidth={38} fill="none" />
                <circle cx={260} cy={260} r={R} stroke={color.yellow} strokeWidth={38} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 200, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>{(ring * 10).toFixed(1).replace('.', ',')}</div>
                <div style={{ fontSize: 44, color: color.muted }}>sobre 10</div>
              </div>
            </div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* E · Búscalo en SonorBooks */}
      <Sequence from={segE} durationInFrames={segF - segE}>
        <Stage tone="warm">
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 380, gap: 60 }}>
            <Logo size={120} />
            <div style={{ width: 940, height: 120, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 20px 0 46px', gap: 22, fontFamily: font.sans, fontSize: 48 }}>
              <svg width="44" height="44" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
              <div style={{ flex: 1 }}>{frame < fBusca - 40 ? <span style={{ color: color.muted }}>Busca un audiolibro</span> : <Typewriter text="Crimen y castigo" start={fBusca - 40 - segE} cps={15} />}</div>
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 56, fontWeight: 700, textAlign: 'center', opacity: spring({ frame: frame - segE - 20, fps }) }}>¿Dónde te sale <Highlight start={40}>más barato</Highlight>?</div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* F · Cierre */}
      <Sequence from={segF}>
        <AbsoluteFill style={{ background: '#fff', alignItems: 'center', paddingTop: 520, gap: 50 }}>
          <Logo size={120} />
          <div style={{ opacity: spring({ frame: frame - segF - T(0.6), fps }) }}><Pill size={56}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 46, color: color.ink2, textAlign: 'center', opacity: spring({ frame: frame - segF - T(1.0), fps }) }}>Reseña completa de Everand<br />en el canal y en el blog</div>
        </AbsoluteFill>
      </Sequence>

      <Captions />

      {/* Audio: locución por tramos, música de la reseña con ducking y efectos */}
      {EVD_SHORT_PIECES.map((p, i) => (
        <Sequence key={i} from={T(p.at)} durationInFrames={T(p.to - p.from) + 2} layout="none">
          <Audio src={voSrc(p.id)} trimBefore={T(p.from)} trimAfter={T(p.to)} />
        </Sequence>
      ))}
      <Audio src={staticFile(EVD_MUSIC)} volume={(f) => {
        const env = (list: [number, number][]) => Math.max(0, ...list.map(([a, b]) => interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp)));
        const duck = 0.42 * env(EVD_SHORT_PIECES.map((p) => [T(p.at), T(p.at + p.to - p.from)]));
        const fade = interpolate(f, [0, 30, T(EVD_SHORT_DUR) - 50, T(EVD_SHORT_DUR)], [0, 1, 1, 0], { ...clamp, easing: easeOut });
        return 0.2 * (1 - duck) * fade;
      }} />
      <Sfx name="ui_pop" at={fScribd - 4} />
      <Sfx name="marker" at={fNetflix + 6} />
      <Sfx name="swipe" at={fHoy} />
      <Sfx name="pencil_strike" at={fHoy + 12} />
      <Sfx name="logo_sting" at={fEverand - 2} />
      <Sfx name="whoosh_soft" at={fPlan - 4} />
      <Sfx name="hit_soft" at={fLibro - 2} />
      <Sfx name="impact" at={fSi} />
      <Sfx name="stamp" at={fSi + 4} />
      <Sfx name="transition" at={segB} />
      <Sfx name="ui_pop" at={segB + 6} />
      <Sfx name="pencil_strike" at={fAcabo + 2} />
      <Sfx name="stamp" at={fAcabo + 4} />
      <Sfx name="transition" at={segB2} />
      <Sfx name="focus" at={fMayoria - 6} />
      <Sfx name="hit_soft" at={fMayoria + 4} volume={0.7} />
      <Sfx name="transition" at={segC} />
      <Sfx name="card_flip" at={fTreinta - 4} />
      <Sfx name="card_flip" at={fSiete - 4} />
      <Sfx name="fail" at={fSiete + 8} volume={0.6} />
      <Sfx name="pop" at={fUnico - 4} />
      <Sfx name="transition" at={segD} />
      <Sfx name="counter" at={segD + 6} />
      <Sfx name="stamp" at={fNum + 20} />
      <Sfx name="transition" at={segE} />
      <Sfx name="logo_sting" at={segE + 4} />
      <Sfx name="typing" at={fBusca - 40} trimAfter={60} />
      <Sfx name="transition" at={segF} volume={0.8} />
      <Sfx name="ui_pop" at={segF + T(0.6)} />
    </AbsoluteFill>
  );
};

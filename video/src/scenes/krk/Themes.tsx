import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, color, CoverIcon, font, HANDF, KR, KR_DEEP, NEVA, OCHRE, OLDGOLD, ramp, rampOut, shadow, SkStage, WAX } from './kit';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 02 · Qué escribe (J14–J17) y 03 · Antes de elegir (J18–J19).
// ————————————————————————————————————————————————————————————————

const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

// ——— FORMAS · J14 ———
// No un manual de filosofía (libro gris que se aparta), sino diarios, cartas, discursos y el diario de un seductor;
// todo converge en la pregunta.
const FORMS: { t: string; icon: 'notebook' | 'letter' | 'candle' | 'feather'; word: string; x: number; y: number; r: number; bg: string }[] = [
  { t: 'Diarios', icon: 'notebook', word: 'diarios', x: 250, y: 330, r: -5, bg: '#3B3631' },
  { t: 'Cartas', icon: 'letter', word: 'cartas', x: 640, y: 290, r: 3, bg: NEVA },
  { t: 'Discursos', icon: 'candle', word: 'discursos', x: 1030, y: 320, r: -2, bg: KR },
  { t: 'Diario de un seductor', icon: 'feather', word: 'seductor', x: 1420, y: 300, r: 4, bg: '#5E1C2B' },
];
export const Formas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FORMAS');
  const fMan = c.at('J14', 'manual');
  const fGira = c.at('J14', 'gira');
  const fComo = c.at('J14', 'cómo', 1);
  const man = sp(frame, 4, 16, 140);
  const manOut = ramp(frame, c.at('J14', 'diarios') - 10, c.at('J14', 'diarios') + 6);
  const conv = ramp(frame, fGira - 6, fComo + 4);
  const fade = ramp(frame, fGira - 4, fGira + 10);
  return (
    <SkStage>
      {/* el manual de filosofía */}
      <div style={{ position: 'absolute', left: 760, top: 230, opacity: man * (1 - manOut), transform: `translateX(${manOut * -500}px) rotate(${-4 - manOut * 20}deg) scale(${0.9 + 0.1 * man})` }}>
        <div style={{ position: 'relative', width: 400, height: 560, background: '#9A9C9E', borderRadius: 8, boxShadow: shadow.card, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: '#EDEDED', textTransform: 'uppercase' }}>Manual de</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: '#fff' }}>filosofía</div>
          <div style={{ marginTop: 40, width: '70%', height: 4, background: 'rgba(255,255,255,0.5)' }} />
          {/* tachón */}
          <svg width={460} height={600} style={{ position: 'absolute', left: -30, top: -20, overflow: 'visible' }}>
            {[0, 1].map((k) => {
              const p = ramp(frame, fMan + 2 + k * 6, fMan + 14 + k * 6);
              return <path key={k} d={k ? 'M430 20 L30 580' : 'M30 20 L430 580'} stroke={WAX} strokeWidth={16} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - p)} />;
            })}
          </svg>
        </div>
      </div>
      {/* sus formas */}
      {FORMS.map((q, i) => {
        const at = c.at('J14', q.word) - 4;
        const s = sp(frame, at, 13, 170);
        if (frame < at - 1) return null;
        const tx = q.x + (960 - 160 - q.x) * conv;
        const ty = q.y + (720 - q.y) * conv;
        return (
          <div key={i} style={{ position: 'absolute', left: tx, top: ty, width: 320, opacity: Math.min(1, s * 1.5) * (1 - fade), transform: `translateY(${(1 - s) * 80}px) rotate(${q.r * (1 - conv)}deg) scale(${(0.85 + 0.15 * s) * (1 - 0.45 * conv)})` }}>
            <div style={{ background: '#fff', borderRadius: 28, boxShadow: shadow.card, padding: '40px 30px 34px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
              <div style={{ width: 130, height: 130, borderRadius: '50%', background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CoverIcon kind={q.icon} size={78} c="#F4EFE6" sw={1.4} />
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: q.t.length > 12 ? 34 : 44, color: color.ink, textAlign: 'center', lineHeight: 1.1 }}>{q.t}</div>
            </div>
          </div>
        );
      })}
      {/* la pregunta */}
      {frame >= fGira + 6 && (
        <div style={{ position: 'absolute', left: 160, right: 160, top: 370, textAlign: 'center' }}>
          <Kicker at={fGira + 8} text="Todo gira en torno a una pregunta" style={{ justifyContent: 'center' }} />
          <MaskTitle text={'¿Cómo se vive una vida\nque sea de verdad tuya?'} at={fComo - 2} size={104} align="center" hi={['tuya']} />
        </div>
      )}
      <Sfx name="sk_book_thud" at={6} volume={0.4} />
      <Sfx name="pencil_strike" at={fMan + 2} volume={0.6} />
      {FORMS.map((q, i) => <Sfx key={i} name="card_flip" at={c.at('J14', q.word) - 4} volume={0.6} />)}
      <Sfx name="whoosh_soft" at={fGira} volume={0.5} />
      <Sfx name="hit_soft" at={fComo} volume={0.5} />
    </SkStage>
  );
};

// ——— Escalera de los tres estadios (ESCAL y ORDEN) ———
export const STEPS = [
  { k: 'estetica', t: 'Estética', c: OCHRE, x: 160, w: 500, h: 210 },
  { k: 'etica', t: 'Ética', c: KR, x: 660, w: 470, h: 410 },
  { k: 'religiosa', t: 'Religiosa', c: OLDGOLD, x: 1300, w: 470, h: 620 },
];
export const BASE = 990;
const DEPTH = 56;
export const Staircase: React.FC<{ show: number[]; glow?: number[]; children?: React.ReactNode }> = ({ show, glow = [0, 0, 0], children }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <defs>
      <linearGradient id="st-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1D58C" /><stop offset="1" stopColor="#B88A36" /></linearGradient>
      <filter id="st-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
    </defs>
    {STEPS.map((s, i) => {
      const p = show[i] ?? 0;
      if (p <= 0.001) return null;
      const top = BASE - s.h * p;
      const fill = i === 2 ? 'url(#st-gold)' : s.c;
      return (
        <g key={s.k}>
          {glow[i] > 0.01 && <rect x={s.x - 20} y={top - 40} width={s.w + 40} height={s.h * p + 60} fill={s.c} opacity={0.45 * glow[i]} filter="url(#st-glow)" />}
          {/* cara superior */}
          <path d={`M${s.x} ${top} L${s.x + DEPTH} ${top - DEPTH * 0.6} L${s.x + s.w + DEPTH} ${top - DEPTH * 0.6} L${s.x + s.w} ${top}Z`} fill={fill} opacity={0.75} />
          {/* lateral */}
          <path d={`M${s.x + s.w} ${top} L${s.x + s.w + DEPTH} ${top - DEPTH * 0.6} L${s.x + s.w + DEPTH} ${BASE - DEPTH * 0.6} L${s.x + s.w} ${BASE}Z`} fill={fill} opacity={0.55} />
          {/* frente */}
          <rect x={s.x} y={top} width={s.w} height={BASE - top} fill={fill} />
          <rect x={s.x} y={top} width={s.w} height={BASE - top} fill="url(#st-shade)" opacity={0.2} />
        </g>
      );
    })}
    {children}
  </svg>
);
// Figura que sube los escalones.
const Walker: React.FC<{ x: number; y: number; h?: number; c?: string; leg?: number }> = ({ x, y, h = 120, c = color.ink, leg = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={-h * 0.88} r={h * 0.1} fill={c} />
    <path d={`M${-h * 0.12} ${-h * 0.75} L${h * 0.12} ${-h * 0.75} L${h * 0.1} ${-h * 0.35} L${-h * 0.1} ${-h * 0.35}Z`} fill={c} />
    <path d={`M${-h * 0.05} ${-h * 0.36} L${-h * 0.08 - leg * h * 0.12} 0 M${h * 0.05} ${-h * 0.36} L${h * 0.08 + leg * h * 0.12} 0`} stroke={c} strokeWidth={h * 0.08} strokeLinecap="round" />
  </g>
);

// ——— ESCAL · J15 ———
// Tres maneras de vivir, como tres escalones: estética (placer, aburrimiento), ética (elegir, comprometerse, responder)
// y religiosa (la fe): entre la segunda y la tercera hay un hueco, y la figura lo cruza de un salto.
export const Escal: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ESCAL');
  const f = {
    tres: c.at('J15', 'tres'), esc: c.at('J15', 'escalones'), est: c.at('J15', 'estética'), plac: c.at('J15', 'placer'), abur: c.at('J15', 'aburrimiento'),
    eti: c.at('J15', 'ética'), eleg: c.at('J15', 'elegir'), comp: c.at('J15', 'comprometerse'), resp: c.at('J15', 'responder'),
    rel: c.at('J15', 'religiosa'), fe: c.at('J15', 'fe'), salto: c.at('J15', 'salto'), nadie: c.at('J15', 'nadie'),
  };
  const show = [ramp(frame, f.tres - 6, f.tres + 14, easeOut), ramp(frame, f.tres + 2, f.tres + 22, easeOut), ramp(frame, f.tres + 10, f.esc + 14, easeOut)];
  const glow = [ramp(frame, f.est - 4, f.est + 10) * (1 - ramp(frame, f.eti - 6, f.eti + 6)), ramp(frame, f.eti - 4, f.eti + 10) * (1 - ramp(frame, f.rel - 6, f.rel + 6)), ramp(frame, f.rel - 4, f.rel + 10)];
  // la figura: escalón 1 → 2 → salto al 3
  const top = (i: number) => BASE - STEPS[i].h;
  const up = ramp(frame, f.eti - 10, f.eti + 10, easeInOut);
  const jump = ramp(frame, f.salto - 6, f.salto + 22, easeInOut);
  const wx = interpolate(up, [0, 1], [420, 900]) + jump * 640;
  const arc = Math.sin(jump * Math.PI) * 180;
  const wy = interpolate(up, [0, 1], [top(0), top(1)]) + (top(2) - top(1)) * jump - arc;
  const labels = [
    { i: 0, items: [{ t: 'el placer', at: f.plac }, { t: 'huir del aburrimiento', at: f.abur }] },
    { i: 1, items: [{ t: 'elegir', at: f.eleg }, { t: 'comprometerse', at: f.comp }, { t: 'responder de ello', at: f.resp }] },
    { i: 2, items: [{ t: 'la fe', at: f.fe }] },
  ];
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 160, top: 90 }}>
        <Kicker at={4} text="Tres maneras de vivir" />
        <MaskTitle text="Tres escalones" at={f.tres} size={96} />
      </div>
      <Staircase show={show} glow={glow}>
        {/* el hueco y el salto */}
        {frame >= f.salto - 8 && (
          <path d={`M940 ${top(1) - 40} Q 1230 ${top(1) - 320} 1540 ${top(2) - 40}`} fill="none" stroke={color.ink} strokeWidth={5} strokeDasharray="14 14" opacity={rampOut(frame, f.salto - 8, f.salto + 4)} />
        )}
        {show[0] > 0.9 && <Walker x={wx} y={wy} leg={jump > 0 && jump < 1 ? 0.6 : Math.sin(frame / 6) * 0.2} />}
      </Staircase>
      {/* rótulos en el frente de cada escalón */}
      {STEPS.map((s, i) => {
        const p = rampOut(frame, i === 0 ? f.est - 4 : i === 1 ? f.eti - 4 : f.rel - 4, (i === 0 ? f.est : i === 1 ? f.eti : f.rel) + 12);
        const t = BASE - s.h;
        return (
          <div key={s.k} style={{ position: 'absolute', left: s.x + 30, top: t + 26, width: s.w - 60, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: i === 2 ? color.ink : '#fff' }}>{s.t}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {labels[i].items.map((q, k) => (
                <div key={k} style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 36, color: i === 2 ? 'rgba(16,16,16,0.75)' : 'rgba(255,255,255,0.88)', opacity: rampOut(frame, q.at - 4, q.at + 10) }}>{q.t}</div>
              ))}
            </div>
          </div>
        );
      })}
      {frame >= f.salto - 2 && (
        <div style={{ position: 'absolute', left: 820, top: 250, opacity: rampOut(frame, f.salto, f.salto + 12), transform: 'rotate(-3deg)' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, background: color.yellow, padding: '8px 26px 12px', borderRadius: 16, whiteSpace: 'nowrap' }}>un salto</div>
          <div style={{ marginTop: 10, fontFamily: font.serif, fontStyle: 'italic', fontSize: 36, color: color.ink2, opacity: rampOut(frame, f.nadie - 2, f.nadie + 12), whiteSpace: 'nowrap' }}>que nadie puede dar por ti</div>
        </div>
      )}
      {[0, 1, 2].map((i) => <Sfx key={i} name="snap_in" at={f.tres + i * 8} volume={0.5} />)}
      <Sfx name="ui_pop" at={f.est} volume={0.5} />
      <Sfx name="whoosh_soft" at={f.eti - 8} volume={0.4} />
      <Sfx name="ui_pop" at={f.rel} volume={0.5} />
      <Sfx name="whoosh_deep" at={f.salto - 4} volume={0.6} />
      <Sfx name="hit_soft" at={f.salto + 20} volume={0.6} />
      <Sfx name="shimmer" at={f.salto + 22} volume={0.4} />
    </SkStage>
  );
};

// ——— IDEAS · J16 ———
// Dos palabras (angustia, «el vértigo de la libertad», en El concepto de la angustia; desesperación, en La enfermedad mortal)
// y la frase del diario de 1843: entender hacia atrás, vivir hacia delante (camino con huellas detrás y niebla delante).
const WordCard: React.FC<{ at: number; word: string; book: string; year: number; quote?: string; quoteAt?: number; x: number; bg: string; icon: 'fog' | 'moon' }> = ({ at, word, book, year, quote, quoteAt = 0, x, bg, icon }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 14, 140);
  if (frame < at - 1) return null;
  const flip = interpolate(s, [0, 1], [90, 0]);
  return (
    <div style={{ position: 'absolute', left: x, top: 230, width: 700, perspective: 1600 }}>
      <div style={{ transform: `rotateY(${flip}deg)`, background: '#fff', borderRadius: 32, boxShadow: shadow.card, overflow: 'hidden' }}>
        <div style={{ height: 230, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CoverIcon kind={icon} size={150} c="#F4EFE6" sw={1.2} />
        </div>
        <div style={{ padding: '36px 46px 44px' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: color.ink, letterSpacing: -2 }}>{word}</div>
          {quote && <div style={{ marginTop: 10, fontFamily: font.serif, fontStyle: 'italic', fontSize: 48, color: KR_DEEP, opacity: rampOut(frame, quoteAt - 4, quoteAt + 12) }}>«{quote}»</div>}
          <div style={{ marginTop: 22, fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.muted }}><i style={{ fontFamily: font.serif, fontSize: 32 }}>{book}</i> · {year}</div>
        </div>
      </div>
    </div>
  );
};
export const Ideas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('IDEAS');
  const f = {
    pal: c.at('J16', 'palabras'), ang: c.at('J16', 'angustia,'), vert: c.at('J16', 'vértigo'), des: c.at('J16', 'desesperación'), frase: c.at('J16', 'frase'),
    vida: c.at('J16', 'vida'), atras: c.at('J16', 'atrás'), viv: c.at('J16', 'vivirla'), del: c.at('J16', 'delante'),
  };
  const toRoad = ramp(frame, f.frase - 10, f.frase + 8);
  const walk = ramp(frame, f.frase, c.dur, (t) => t);
  const back = rampOut(frame, f.atras - 6, f.atras + 12);
  const fwd = rampOut(frame, f.viv - 6, f.viv + 12);
  return (
    <SkStage>
      <AbsoluteFill style={{ opacity: 1 - toRoad, transform: `scale(${1 - 0.05 * toRoad})` }}>
        <div style={{ position: 'absolute', left: 160, top: 90 }}>
          <Kicker at={f.pal - 4} text="Las palabras que asociamos con él" />
        </div>
        <WordCard at={f.ang - 4} word="Angustia" book="El concepto de la angustia" year={1844} quote="el vértigo de la libertad" quoteAt={f.vert} x={190} bg={NEVA} icon="fog" />
        <WordCard at={f.des - 4} word="Desesperación" book="La enfermedad mortal" year={1849} x={1030} bg="#14191F" icon="moon" />
      </AbsoluteFill>
      {toRoad > 0.01 && (
        <AbsoluteFill style={{ opacity: toRoad }}>
          {/* el camino: detrás, claro y con huellas; delante, niebla */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <defs>
              <linearGradient id="id-fog" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stopColor="rgba(246,244,240,0)" /><stop offset="0.85" stopColor="rgba(246,244,240,0.95)" /></linearGradient>
            </defs>
            <path d="M0 780 L1920 700 L1920 860 L0 900Z" fill="#D9CDB4" />
            {Array.from({ length: 9 }).map((_, i) => {
              const x = 120 + i * 90;
              return <ellipse key={i} cx={x} cy={830 - i * 3 + (i % 2) * 18} rx={16} ry={8} fill="rgba(90,70,40,0.35)" opacity={back} />;
            })}
            <rect width="1920" height="1080" fill="url(#id-fog)" opacity={0.9} />
          </svg>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <Walker x={940 + walk * 40} y={812} h={170} leg={Math.sin(frame / 7) * 0.5} />
          </svg>
          <div style={{ position: 'absolute', left: 300, top: 600, opacity: back, transform: `translateX(${(1 - back) * 30}px)`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, color: KR }}>←</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>se entiende</span>
          </div>
          <div style={{ position: 'absolute', left: 1240, top: 560, opacity: fwd, transform: `translateX(${(1 - fwd) * -30}px)`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>se vive</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, color: KR }}>→</span>
          </div>
          <div style={{ position: 'absolute', left: 160, right: 160, top: 120, textAlign: 'center' }}>
            <Kicker at={f.frase} text="Una idea de su diario · 1843" style={{ justifyContent: 'center' }} />
            <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 66, lineHeight: 1.2, color: color.ink }}>
              <span style={{ opacity: rampOut(frame, f.vida - 4, f.vida + 10) }}>La vida se entiende mirando hacia atrás, </span>
              <span style={{ opacity: rampOut(frame, f.viv - 8, f.viv + 8) }}>pero hay que vivirla hacia delante.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="card_flip" at={f.ang - 4} volume={0.6} />
      <Sfx name="card_flip" at={f.des - 4} volume={0.6} />
      <Sfx name="whoosh_soft" at={f.frase - 8} volume={0.5} />
      <Sfx name="kk_cobble" at={f.frase} volume={0.3} dur={c.dur - f.frase} fade={20} />
    </SkStage>
  );
};

// ——— ADMIR · J17 ———
const QUOTES = [
  { word: 'Kafka', who: 'Franz Kafka', src: 'Diarios, 21 de agosto de 1913', q: 'Su caso, pese a diferencias esenciales, es muy parecido al mío… Me confirma como un amigo.', x: 150, r: -2 },
  { word: 'Unamuno', who: 'Miguel de Unamuno', src: 'Del sentimiento trágico de la vida, 1913', q: 'Oigamos al hermano Kierkegaard.', x: 700, r: 1.5 },
  { word: 'Wittgenstein', who: 'Ludwig Wittgenstein', src: 'Conversación con M. O’C. Drury', q: 'Kierkegaard fue, con mucho, el pensador más profundo del siglo pasado.', x: 1250, r: -1 },
];
export const Admir: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ADMIR');
  const fVivo = c.at('J17', 'vivo?');
  const t = ramp(frame, c.at('J17', 'Kafka') - 14, c.at('J17', 'Kafka') + 6);
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380 - 270 * t, textAlign: 'center', transform: `scale(${1 - 0.3 * t})` }}>
        <MaskTitle text="¿Por qué sigue tan vivo?" at={4} size={110} align="center" hi={['vivo']} />
      </div>
      {QUOTES.map((q, i) => {
        const at = c.at('J17', q.word) - 6;
        const s = sp(frame, at, 14, 130);
        const next = i < 2 ? c.at('J17', QUOTES[i + 1].word) - 6 : 1e9;
        const dim = ramp(frame, next - 4, next + 10);
        if (frame < at - 1) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: q.x, top: 330, width: 520, opacity: Math.min(1, s * 1.6) * (1 - 0.35 * dim), transform: `translateY(${(1 - s) * 90}px) rotate(${q.r}deg) scale(${1 - 0.04 * dim})` }}>
            <div style={{ position: 'relative', background: '#FFFDF7', borderRadius: 10, padding: '64px 46px 44px', boxShadow: shadow.card, minHeight: 470,
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 45px, rgba(47,111,98,0.10) 45px, rgba(47,111,98,0.10) 47px)', backgroundPosition: '0 20px' }}>
              <div style={{ position: 'absolute', left: '50%', top: -14, width: 30, height: 30, marginLeft: -15, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #7FD3C0, ${KR} 55%, ${KR_DEEP})`, boxShadow: '0 6px 10px rgba(0,0,0,0.35)' }} />
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 44, lineHeight: 1.18, color: '#1E1A14' }}>
                <span style={{ color: KR, fontStyle: 'normal', fontWeight: 600, fontSize: 64, lineHeight: 0, marginRight: 4, verticalAlign: '-0.06em' }}>«</span>{q.q.replace(/\.$/, '')}<span style={{ color: KR, fontStyle: 'normal', fontWeight: 600, fontSize: 64, lineHeight: 0, marginLeft: 2, verticalAlign: '-0.06em' }}>»</span>
              </div>
              <div style={{ marginTop: 34, height: 3, width: 70, background: color.yellow, borderRadius: 2 }} />
              <div style={{ marginTop: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>{q.who}</div>
              <div style={{ marginTop: 6, fontFamily: font.sans, fontWeight: 500, fontSize: 22, color: color.muted }}>{q.src}</div>
            </div>
          </div>
        );
      })}
      <Sfx name="ui_pop" at={6} volume={0.5} />
      <Sfx name="whoosh_soft" at={fVivo + 20} volume={0.4} />
      {QUOTES.map((q, i) => <Sfx key={i} name="sk_pin" at={c.at('J17', q.word) - 2} volume={0.6} />)}
      {QUOTES.map((q, i) => <Sfx key={`p${i}`} name="page_turn" at={c.at('J17', q.word) - 6} volume={0.4} />)}
    </SkStage>
  );
};

// Máscara de teatro (SVG).
const Mask: React.FC<{ size: number; c: string; tilt?: number }> = ({ size, c, tilt = 0 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={{ display: 'block', transform: `rotate(${tilt}deg)` }}>
    <path d="M10 20 Q50 0 90 20 Q96 70 50 106 Q4 70 10 20Z" fill={c} />
    <path d="M26 46 Q34 38 42 46 Q34 50 26 46Z M58 46 Q66 38 74 46 Q66 50 58 46Z" fill="#14161A" />
    <path d="M36 76 Q50 86 64 76" stroke="#14161A" strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
);

// ——— QUIEN · J18 ———
// ¿Quién habla? Dos máscaras con su nombre (Johannes de Silentio, Anti-Climacus) delante de la silueta del autor, que se
// queda en segundo plano. En 1846 pidió que lo que dicen los seudónimos se les atribuya a ellos.
export const Quien: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('QUIEN');
  const f = {
    dos: c.at('J18', 'dos'), prim: c.at('J18', 'primera'), habla: c.at('J18', 'habla?'), firma: c.at('J18', 'firma'), yoj: c.at('J18', 'Johannes'), anti: c.at('J18', 'Anticlímacus'),
    exact: c.at('J18', 'exactamente'), pers: c.at('J18', 'personaje'), punto: c.at('J18', 'punto'), pid: c.at('J18', 'pidió'), atrib: c.at('J18', 'atribuyeran'),
  };
  const author = rampOut(frame, f.firma - 6, f.firma + 10);
  const dimAuthor = ramp(frame, f.exact - 4, f.exact + 12);
  const note = sp(frame, f.pid - 6, 15, 140);
  const masks = [
    { n: 'Johannes de Silentio', b: 'Temor y temblor', at: f.yoj, x: 360, c: '#E8E0CC', tilt: -6 },
    { n: 'Anti-Climacus', b: 'La enfermedad mortal', at: f.anti, x: 1180, c: '#CFC6B2', tilt: 5 },
  ];
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 160, top: 90 }}>
        <Kicker at={f.dos - 2} text="Antes de elegir · 1" />
        <MaskTitle text="¿Quién habla?" at={f.habla - 6} size={110} hi={['habla']} />
      </div>
      {/* el autor, al fondo */}
      <div style={{ position: 'absolute', left: 860, top: 330, opacity: author * (1 - 0.6 * dimAuthor), filter: dimAuthor > 0.01 ? `blur(${dimAuthor * 4}px)` : undefined, transform: `scale(${1 - 0.06 * dimAuthor})` }}>
        <svg width={200} height={520} viewBox="0 0 200 520">
          <path d="M70 20 L68 100 L132 100 L130 20Z M48 100 L152 100" fill="#3A3F45" stroke="#3A3F45" strokeWidth={8} />
          <circle cx="100" cy="140" r="34" fill="#3A3F45" />
          <path d="M50 190 Q100 170 150 190 L162 380 L38 380Z" fill="#3A3F45" />
          <path d="M70 380 L66 510 M130 380 L134 510" stroke="#3A3F45" strokeWidth={22} strokeLinecap="round" />
        </svg>
        <div style={{ textAlign: 'center', marginTop: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, opacity: 1 - dimAuthor }}>Kierkegaard</div>
      </div>
      {/* las máscaras */}
      {masks.map((m, i) => {
        const s = sp(frame, m.at - 4, 12, 170);
        if (frame < m.at - 5) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: m.x, top: 330, width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 80}px) scale(${0.8 + 0.2 * s})` }}>
            <Mask size={230} c={m.c} tilt={m.tilt + Math.sin(frame / 20 + i) * 2} />
            <div style={{ marginTop: 20, background: '#fff', borderRadius: 18, boxShadow: shadow.card, padding: '14px 26px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
              <div style={{ fontFamily: HANDF, fontSize: 64, color: color.ink, lineHeight: 1.1 }}>{m.n}</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: color.muted, marginTop: 2 }}>{m.b}</div>
            </div>
            <div style={{ marginTop: 16, fontFamily: font.serif, fontStyle: 'italic', fontSize: 36, color: KR_DEEP, opacity: rampOut(frame, f.punto - 4, f.punto + 10) }}>su propio punto de vista</div>
          </div>
        );
      })}
      {frame >= f.exact - 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', opacity: rampOut(frame, f.exact - 2, f.exact + 12) * (1 - ramp(frame, f.pid - 10, f.pid)) }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, background: color.yellow, padding: '8px 28px 12px', borderRadius: 14 }}>No es exactamente Kierkegaard</span>
        </div>
      )}
      {/* 1846: la nota */}
      {frame >= f.pid - 8 && (
        <div style={{ position: 'absolute', left: 560, top: 300 + (1 - note) * 500, width: 800, transform: `rotate(${-2 + (1 - note) * 6}deg)`, opacity: Math.min(1, note * 1.5) }}>
          <div style={{ background: '#F4EEE2', borderRadius: 8, boxShadow: '0 40px 80px rgba(0,0,0,0.3)', padding: '44px 54px 50px' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', color: color.muted }}>1846 · «Una primera y última explicación»</div>
            <div style={{ marginTop: 20, fontFamily: font.serif, fontStyle: 'italic', fontSize: 48, lineHeight: 1.2, color: color.ink }}>
              Pidió que lo que dicen los seudónimos <span style={{ background: `linear-gradient(transparent 62%, ${color.yellow} 62%)` }}>se les atribuya a ellos</span>, no a él.
            </div>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={f.habla - 4} volume={0.5} />
      {masks.map((m, i) => <Sfx key={i} name="card_flip" at={m.at - 4} volume={0.6} />)}
      <Sfx name="whoosh_soft" at={f.exact - 4} volume={0.4} />
      <Sfx name="page_turn" at={f.pid - 6} volume={0.6} />
      {OCHRE && null}
    </SkStage>
  );
};

// ——— RITMO · J19 ———
// Las cuatro duraciones (de 5 a 7 h 30 min) y un reproductor: la velocidad baja de 1,5× a 1× y se pulsa «volver 15 s».
const DUR: { k: string; h: number; label: string }[] = [
  { k: 'temor', h: 5.5, label: '4 h 55 min – 6 h 6 min' },
  { k: 'enfermedad', h: 5.3, label: '5 h 18 min' },
  { k: 'diario', h: 6.0, label: '5 h 31 min – 6 h 59 min' },
  { k: 'pureza', h: 7.55, label: '7 h 33 min' },
];
export const Ritmo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('RITMO');
  const f = {
    seg: c.at('J19', 'segunda'), ritmo: c.at('J19', 'ritmo'), dur: c.at('J19', 'duran'), cinco: c.at('J19', 'cinco'), siete: c.at('J19', 'siete'),
    nov: c.at('J19', 'novela'), vel: c.at('J19', 'velocidad'), baj: c.at('J19', 'bájala'), atras: c.at('J19', 'atrás'),
  };
  const toPlayer = ramp(frame, f.nov - 10, f.nov + 8);
  const speedDown = ramp(frame, f.baj - 4, f.baj + 10);
  const press = interpolate(frame, [f.atras - 4, f.atras, f.atras + 8], [0, 1, 0], clamp);
  const ring = ramp(frame, f.atras - 2, f.atras + 20);
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 160, top: 90 }}>
        <Kicker at={f.seg - 2} text="Antes de elegir · 2" />
        <MaskTitle text="El ritmo" at={f.ritmo - 4} size={110} />
      </div>
      <AbsoluteFill style={{ opacity: 1 - toPlayer, transform: `translateX(${toPlayer * -120}px)` }}>
        {DUR.map((d, i) => {
          const a = f.dur - 6 + i * 5;
          const p = ramp(frame, a, a + 26, easeOut);
          const b = BOOKS[d.k];
          return (
            <div key={d.k} style={{ position: 'absolute', left: 160, top: 360 + i * 150, display: 'flex', alignItems: 'center', gap: 30, opacity: rampOut(frame, a - 6, a + 6) }}>
              <div style={{ width: 380, fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: color.ink, textAlign: 'right', lineHeight: 1.05 }}>{b.spineTitle ?? b.title}</div>
              <div style={{ position: 'relative', width: 1100, height: 46, borderRadius: 23, background: 'rgba(16,16,16,0.06)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (d.h / 8) * 1100 * p, borderRadius: 23, background: b.bg === '#E8E0CC' ? WAX : b.bg }} />
                <div style={{ position: 'absolute', left: (d.h / 8) * 1100 * p + 20, top: 0, height: 46, display: 'flex', alignItems: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, whiteSpace: 'nowrap', opacity: p > 0.6 ? 1 : 0 }}>{d.label}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* el reproductor */}
      {toPlayer > 0.01 && (
        <AbsoluteFill style={{ opacity: toPlayer, transform: `translateX(${(1 - toPlayer) * 120}px)` }}>
          <div style={{ position: 'absolute', left: 560, top: 300, width: 800, height: 600, background: '#fff', borderRadius: 40, boxShadow: shadow.card, padding: 50 }}>
            <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 150, height: 225 }}><Book3D b={BOOKS.temor} w={150} h={225} d={14} ry={-10} floorShadow={false} /></div>
              <div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink }}>Temor y temblor</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted }}>Søren Kierkegaard</div>
              </div>
            </div>
            <div style={{ marginTop: 60, height: 10, borderRadius: 5, background: 'rgba(16,16,16,0.1)' }}>
              <div style={{ width: `${32 - 4 * ring}%`, height: 10, borderRadius: 5, background: KR }} />
            </div>
            <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 70 }}>
              {/* volver 15 s */}
              <div style={{ position: 'relative', width: 110, height: 110, borderRadius: '50%', background: press > 0.1 ? color.yellow : '#F2EFEA', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.1 * press})` }}>
                <svg width={70} height={70} viewBox="0 0 24 24"><path d="M5 12a7 7 0 1 0 2-5" fill="none" stroke={color.ink} strokeWidth={2} strokeLinecap="round" /><path d="M7 3v4h4" fill="none" stroke={color.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /><text x="12" y="15" fontSize="6" fontFamily="Ubuntu" fontWeight="700" textAnchor="middle" fill={color.ink}>15</text></svg>
                {ring > 0 && ring < 1 && <div style={{ position: 'absolute', inset: -20 * ring, borderRadius: '50%', border: `4px solid ${color.yellow}`, opacity: 1 - ring }} />}
              </div>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={50} height={50} viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" /></svg>
              </div>
              {/* velocidad */}
              <div style={{ position: 'relative', width: 150, height: 90, borderRadius: 45, background: speedDown > 0.5 ? KR : '#F2EFEA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: speedDown > 0.5 ? '#fff' : color.ink }}>
                {speedDown > 0.5 ? '1×' : '1,5×'}
              </div>
            </div>
          </div>
          {frame >= f.vel - 4 && (
            <div style={{ position: 'absolute', left: 1400, top: 640, opacity: rampOut(frame, f.baj - 2, f.baj + 10), fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: KR, maxWidth: 420, lineHeight: 1.1 }}>
              Aquí, mejor a velocidad normal
            </div>
          )}
        </AbsoluteFill>
      )}
      {DUR.map((d, i) => <Sfx key={i} name="tick" at={f.dur - 6 + i * 5} volume={0.4} />)}
      <Sfx name="swipe" at={f.nov - 8} volume={0.6} />
      <Sfx name="ui_tap" at={f.baj} volume={0.7} />
      <Sfx name="ui_tap" at={f.atras} volume={0.7} />
      <Sfx name="zoom_out" at={f.atras + 2} volume={0.4} />
    </SkStage>
  );
};

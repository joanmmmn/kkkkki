import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, color, CoverIcon, font, HoursBar, KR, KR_DEEP, MiniIcon, NEVA, OLDGOLD, ramp, rampOut, shadow, SkNight, SkStage } from './kit';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 02 · Qué escribe (D14–D16) y 03 · Antes de elegir (D17–D18).
// ————————————————————————————————————————————————————————————————

// ——— TEMAS · D14 ———
// Cuatro tarjetas de «thriller» (asesinato, deuda, juicio, pasión). Al decir «preguntas», cada una gira y muestra por
// detrás la pregunta que esconde: culpa (asesinato), libertad (juicio), fe (pasión), dinero (deuda).
const ThrillIcon: React.FC<{ k: number; c: string }> = ({ k, c }) => {
  const p = { stroke: c, strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width="150" height="150" viewBox="0 0 100 100">
      {k === 0 && (<><path d="M30 78 70 20" {...p} /><path d="M58 18c10-4 20 2 22 12l-14 6" {...p} fill={c} /><path d="M26 84l8-10" {...p} strokeWidth={9} /></>)}
      {k === 1 && (<><ellipse cx="50" cy="70" rx="26" ry="8" {...p} /><path d="M24 70v-10c0 4 12 8 26 8s26-4 26-8v10" {...p} /><ellipse cx="50" cy="52" rx="26" ry="8" {...p} /><path d="M24 52V40c0 4 12 8 26 8s26-4 26-8v12" {...p} /><ellipse cx="50" cy="38" rx="26" ry="8" {...p} /></>)}
      {k === 2 && (<><path d="M20 84h44" {...p} /><path d="M30 76h24" {...p} /><path d="M38 40l24-24M50 52l24-24" {...p} /><path d="M44 46l12-12" {...p} strokeWidth={12} /><path d="M56 40l26 26" {...p} strokeWidth={7} /></>)}
      {k === 3 && (<path d="M50 82S18 62 18 40a16 16 0 0 1 32-6 16 16 0 0 1 32 6c0 22-32 42-32 42z" {...p} fill={c} />)}
    </svg>
  );
};
const THRILL = [
  { front: 'Un asesinato', back: 'la culpa', word: 'asesinato', q: 'culpa' },
  { front: 'Una deuda', back: 'el dinero', word: 'deuda', q: 'dinero' },
  { front: 'Un juicio', back: 'la libertad', word: 'juicio', q: 'libertad' },
  { front: 'Una pasión', back: 'la fe', word: 'pasión', q: 'fe' },
];
export const Temas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TEMAS');
  const fThr = c.at('D14', 'thrillers');
  const fPero = c.at('D14', 'Pero');
  const fPreg = c.at('D14', 'preguntas');
  const t1 = 1 - ramp(frame, fPero - 6, fPero + 8);
  return (
    <SkNight lamp={[960, 560]}>
      {/* títulos */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: t1, transform: `translateY(${(1 - t1) * -20}px)` }}>
        <Kicker at={2} text="Sus novelas" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }} />
        <MaskTitle text="parecen thrillers" at={fThr - 10} size={96} align="center" color="#fff" />
      </div>
      {frame >= fPero - 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center' }}>
          <Kicker at={fPero} text="Pero lo que te atrapa" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }} />
          <MaskTitle text="son las preguntas" at={fPreg - 8} size={96} align="center" color={OLDGOLD} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 44 }}>
        {THRILL.map((t, i) => {
          const at = c.at('D14', t.word) - 6;
          const flipAt = c.at('D14', t.q) - 8;
          const s = spring({ frame: frame - at, fps: 50, config: { damping: 14, stiffness: 150 } });
          const flip = interpolate(frame, [flipAt, flipAt + 18], [0, 180], { ...clamp, easing: easeInOut });
          const lift = Math.sin((flip / 180) * Math.PI) * 40;
          return (
            <div key={i} style={{ width: 380, height: 500, perspective: 1600, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 80 - lift}px) rotate(${(i - 1.5) * 1.6 * (1 - flip / 180)}deg)` }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${flip}deg)` }}>
                {/* cara «thriller» */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: 22, overflow: 'hidden', background: '#16171A', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 16, background: KR }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}><ThrillIcon k={i} c={i === 3 ? KR : '#E9E2D2'} /></div>
                  <div style={{ position: 'absolute', left: 30, right: 30, bottom: 64, fontFamily: font.sans, fontWeight: 700, fontSize: 56, lineHeight: 1, letterSpacing: -1.5, color: '#fff' }}>{t.front}</div>
                  <div style={{ position: 'absolute', left: 30, bottom: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: KR, textTransform: 'uppercase' }}>Thriller</div>
                </div>
                {/* cara «pregunta» */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 22, overflow: 'hidden', background: '#F4ECDA', boxShadow: '0 30px 70px rgba(0,0,0,0.55), 0 0 60px rgba(233,200,119,0.25)' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: font.serif, fontWeight: 600, fontSize: 230, lineHeight: 1, color: 'rgba(163,25,47,0.16)' }}>?</div>
                  <div style={{ position: 'absolute', left: 20, right: 20, top: t.back.length > 9 ? 262 : 250, textAlign: 'center', fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: t.back.length > 9 ? 66 : 82, color: '#2A2016', whiteSpace: 'nowrap' }}>{t.back}</div>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: KR, textTransform: 'uppercase' }}>{t.front}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {THRILL.map((t, i) => <Sfx key={i} name="card_flip" at={c.at('D14', t.word) - 5} volume={0.5} />)}
      <Sfx name="sk_heart" at={c.at('D14', 'asesinato')} volume={0.5} />
      <Sfx name="whoosh_soft" at={fPero - 6} volume={0.5} />
      {THRILL.map((t, i) => <Sfx key={`f${i}`} name="snap_in" at={c.at('D14', t.q) - 4} volume={0.5} />)}
    </SkNight>
  );
};

// ——— CINCO · D15 ———
// Las cinco grandes novelas aparecen una a una (con su año); luego bajan a segundo plano y entra la fila de novelas
// cortas: «la mejor manera de entrar».
const FIVE: { k: string; word: string; nth?: number }[] = [
  { k: 'crimen', word: 'Crimen' }, { k: 'idiota', word: 'idiota' }, { k: 'demonios', word: 'demonios' }, { k: 'adolescente', word: 'adolescente' }, { k: 'karamazov', word: 'Karamázov' },
];
const SHORT = ['noches', 'jugador', 'subsuelo', 'pobres', 'doble'];
export const Cinco: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CINCO');
  const fCinco = c.at('D15', 'cinco');
  const fMuchas = c.at('D15', 'muchas');
  const fMejor = c.at('D15', 'mejor');
  const up = ramp(frame, fMuchas - 12, fMuchas + 12);
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 80 - 40 * up, textAlign: 'center', opacity: 1 - up }}>
        <MaskTitle text="Cinco grandes novelas" at={fCinco - 8} size={86} align="center" hi={['Cinco']} />
      </div>
      {/* las cinco */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300 - 200 * up, display: 'flex', justifyContent: 'center', gap: 46, transform: `scale(${1 - 0.36 * up})`, transformOrigin: '50% 0', opacity: 1 - 0.45 * up }}>
        {FIVE.map((f, i) => {
          const at = c.at('D15', f.word) - 8;
          const s = spring({ frame: frame - at, fps: 50, config: { damping: 15, stiffness: 140 } });
          const b = BOOKS[f.k];
          return (
            <div key={f.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 90}px)` }}>
              <Book3D b={b} w={260} h={390} d={70 + i * 4} ry={-16 + Math.sin(frame / 60 + i) * 2} rx={3} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2, opacity: 1 - up }}>{b.year}</div>
            </div>
          );
        })}
      </div>
      {/* las cortas */}
      {frame >= fMuchas - 10 && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', gap: 30 }}>
            {SHORT.map((k, i) => {
              const at = fMuchas - 6 + i * 4;
              const s = spring({ frame: frame - at, fps: 50, config: { damping: 13, stiffness: 160 } });
              const hl = ramp(frame, fMejor - 6, fMejor + 8);
              return (
                <div key={k} style={{ opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 70 - hl * 10 * Math.sin(frame / 12 + i)}px)` }}>
                  <Book3D b={BOOKS[k]} w={150} h={225} d={20} ry={-14} rx={3} />
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
            <MaskTitle text="Novelas cortas:" at={fMuchas} size={56} color={color.ink2} />
            <MaskTitle text="la mejor manera de entrar" at={fMejor - 6} size={56} hi={['entrar']} />
          </div>
        </>
      )}
      {FIVE.map((f, i) => <Sfx key={i} name="sk_book_thud" at={c.at('D15', f.word) - 4} volume={0.35} />)}
      <Sfx name="whoosh_soft" at={fMuchas - 12} volume={0.5} />
      {SHORT.map((_, i) => <Sfx key={`s${i}`} name="sk_book_slide" at={fMuchas - 4 + i * 4} volume={0.3} />)}
      <Sfx name="shimmer" at={fMejor} volume={0.45} />
    </SkStage>
  );
};

// ——— ADMIR · D16 ———
// Tres tarjetas de cita, sin retratos: Nietzsche, Freud y Einstein.
const QUOTES = [
  { who: 'Friedrich Nietzsche', word: 'Nietzsche', q: 'El único psicólogo del que he tenido algo que aprender.', src: 'Crepúsculo de los ídolos (1889)', x: 140, r: -2.5 },
  { who: 'Sigmund Freud', word: 'Freud', q: 'Los hermanos Karamázov es la novela más grandiosa que se haya escrito.', src: 'Dostoievski y el parricidio (1928)', x: 700, r: 1.5 },
  { who: 'Albert Einstein', word: 'Einstein', q: 'Dostoievski me da más que cualquier pensador científico.', src: 'Recogido por Alexander Moszkowski (1921)', x: 1260, r: -1 },
];
export const Admir: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ADMIR');
  const fVivo = c.at('D16', 'vivo?');
  const t = ramp(frame, QUOTES.length ? c.at('D16', 'Nietzsche') - 14 : 0, c.at('D16', 'Nietzsche') + 6);
  return (
    <SkStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380 - 270 * t, textAlign: 'center', transform: `scale(${1 - 0.3 * t})` }}>
        <MaskTitle text="¿Por qué sigue tan vivo?" at={4} size={110} align="center" hi={['vivo']} />
      </div>
      {QUOTES.map((q, i) => {
        const at = c.at('D16', q.word) - 6;
        const s = spring({ frame: frame - at, fps: 50, config: { damping: 14, stiffness: 130 } });
        const next = i < 2 ? c.at('D16', QUOTES[i + 1].word) - 6 : 1e9;
        const dim = ramp(frame, next - 4, next + 10);
        if (frame < at - 1) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: q.x, top: 330, width: 520, opacity: Math.min(1, s * 1.6) * (1 - 0.35 * dim), transform: `translateY(${(1 - s) * 90}px) rotate(${q.r}deg) scale(${1 - 0.04 * dim})` }}>
            <div style={{ position: 'relative', background: '#FFFDF7', borderRadius: 10, padding: '64px 46px 44px', boxShadow: shadow.card, minHeight: 470,
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 45px, rgba(43,93,125,0.10) 45px, rgba(43,93,125,0.10) 47px)', backgroundPosition: '0 20px' }}>
              <div style={{ position: 'absolute', left: '50%', top: -14, width: 30, height: 30, marginLeft: -15, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FF7B8B, ${KR} 55%, ${KR_DEEP})`, boxShadow: '0 6px 10px rgba(0,0,0,0.35)' }} />
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1.18, color: '#1E1A14' }}>
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
      {QUOTES.map((q, i) => <Sfx key={i} name="sk_pin" at={c.at('D16', q.word) - 2} volume={0.6} />)}
      {QUOTES.map((q, i) => <Sfx key={`p${i}`} name="page_turn" at={c.at('D16', q.word) - 6} volume={0.4} />)}
    </SkStage>
  );
};

// ——— PREG · D17–D18 ———
// «Antes de elegir, dos preguntas»: 1) cuánto tiempo (barras: Noches blancas 2 h 9 min · Los hermanos Karamázov 35 h 42 min);
// 2) qué versión: el mismo libro, grabaciones distintas, y una marca de «Recomendada» en cada puerta.
const Wave: React.FC<{ seed: string; w: number; h: number; c: string; p: number; synthetic?: boolean }> = ({ seed, w, h, c, p, synthetic = false }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
    {Array.from({ length: Math.floor(w / 9) }).map((_, i) => {
      const r = random(`${seed}-${i}`);
      const a = synthetic ? 0.35 + 0.3 * Math.abs(Math.sin(i * 0.5)) : 0.15 + 0.85 * r * (0.6 + 0.4 * Math.sin(i * 0.21));
      const hh = Math.max(4, a * h);
      return <rect key={i} x={i * 9} y={(h - hh) / 2} width={5} height={hh} rx={2.5} fill={c} opacity={i / Math.floor(w / 9) < p ? 1 : 0.18} />;
    })}
  </svg>
);
export const Preguntas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('PREG');
  const fDos = c.at('D17', 'dos');
  const fPrim = c.at('D17', 'primera');
  const fNoch = c.at('D17', 'Noches');
  const fHor = c.at('D17', 'horas');
  const fKar = c.at('D17', 'Los');
  const fTreinta = c.at('D17', 'treinta');
  const p18 = c.part('D18');
  const fSeg = c.at('D18', 'segunda');
  const fClas = c.at('D18', 'clásico');
  const fLib = c.at('D18', 'libro');
  const fGrab = c.at('D18', 'grabación');
  const fPuerta = c.at('D18', 'puerta');
  const fRecom = c.at('D18', 'recomendamos');
  const q1 = spring({ frame: frame - 10, fps: 50, config: { damping: 15, stiffness: 160 } });
  const q2 = spring({ frame: frame - 16, fps: 50, config: { damping: 15, stiffness: 160 } });
  const focus1 = ramp(frame, fPrim - 8, fPrim + 10);
  const barsIn = ramp(frame, fNoch - 22, fNoch - 2);
  const barsOut = ramp(frame, p18 - 16, p18 + 4);
  const vIn = ramp(frame, fSeg - 4, fSeg + 14);
  const card = (n: number, title: string, foc: number, appear: number, icon: React.ReactNode) => (
    <div style={{ width: 760, height: 480, borderRadius: 36, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: 50, position: 'relative', overflow: 'hidden',
      opacity: appear * (n === 2 ? 1 - 0.5 * focus1 : 1), transform: `translateY(${(1 - appear) * 80}px) scale(${0.92 + 0.08 * appear + 0.04 * foc})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ width: 70, height: 70, borderRadius: '50%', background: foc > 0.5 ? color.yellow : color.ink, color: foc > 0.5 ? color.ink : color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}>{n}</span>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: color.muted, textTransform: 'uppercase' }}>Pregunta</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: -2, lineHeight: 1.05, color: color.ink, marginTop: 30, width: 480 }}>{title}</div>
      <div style={{ position: 'absolute', right: 46, bottom: 40 }}>{icon}</div>
    </div>
  );
  const recs = [
    { label: 'Adaptación', sub: '≈ 2 h', c: '#B9B2A4', w: 70, synth: false },
    { label: 'Voz digital', sub: 'novela completa', c: '#5FA4E0', w: 600, synth: true },
    { label: 'Voz humana', sub: 'novela completa', c: '#E3A92C', w: 540, synth: false },
  ];
  const ribbon = spring({ frame: frame - fRecom + 4, fps: 50, config: { damping: 11, stiffness: 180 } });
  return (
    <SkStage>
      {/* las dos preguntas */}
      <AbsoluteFill style={{ opacity: 1 - barsIn, transform: `translateY(${-barsIn * 60}px) scale(${1 - barsIn * 0.06})`, filter: barsIn > 0.01 ? `blur(${barsIn * 8}px)` : undefined }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center' }}>
          <MaskTitle text="Antes de elegir, dos preguntas" at={4} size={72} align="center" hi={['dos']} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 60 }}>
          {card(1, '¿Cuánto tiempo tienes?', focus1, q1, <div style={{ transform: `rotate(${frame * (focus1 > 0 ? 3 : 0.4)}deg)` }}><MiniIcon kind="clock" size={140} c={color.ink} /></div>)}
          {card(2, '¿Qué versión vas a escuchar?', 0, q2, <MiniIcon kind="head" size={140} c={color.ink} />)}
        </div>
      </AbsoluteFill>
      {/* 1 · el tiempo */}
      {barsIn > 0 && barsOut < 1 && (
        <AbsoluteFill style={{ opacity: barsIn * (1 - barsOut), justifyContent: 'center', paddingLeft: 190, gap: 64, transform: `translateY(${-barsOut * 60}px)`, filter: barsOut > 0.01 ? `blur(${barsOut * 8}px)` : undefined }}>
          <div>
            <Kicker at={fNoch - 18} text="Pregunta 1 · duración en audio" />
            <MaskTitle text="¿Cuánto tiempo tienes?" at={fNoch - 14} size={84} hi={['tiempo']} />
          </div>
          <HoursBar hours={2.15} label="Noches blancas" at={fNoch} trackAt={fNoch - 8} width={1300} maxH={38} c={NEVA} h={64} size={1.5} dur={20} showValue={frame > fHor - 6 ? '2 h 9 min' : undefined} />
          <HoursBar hours={35.7} label="Los hermanos Karamázov" at={fKar} trackAt={fNoch - 4} width={1300} maxH={38} c={KR} dur={50} h={64} size={1.5} showValue={frame > fTreinta + 10 ? '35 h 42 min' : undefined} />
        </AbsoluteFill>
      )}
      {/* 2 · la versión */}
      {vIn > 0 && (
        <AbsoluteFill style={{ opacity: vIn }}>
          <div style={{ position: 'absolute', left: 190, top: 110 }}>
            <Kicker at={fSeg - 2} text="Pregunta 2" />
            <MaskTitle text="¿Qué versión vas a escuchar?" at={fSeg + 2} size={84} hi={['versión']} />
          </div>
          <div style={{ position: 'absolute', left: 200, top: 360, opacity: rampOut(frame, fClas - 10, fClas + 6), transform: `translateY(${(1 - rampOut(frame, fClas - 10, fClas + 6)) * 40}px)` }}>
            <Book3D b={BOOKS.crimen} w={300} h={450} d={66} ry={-18} rx={3} />
            <div style={{ marginTop: 26, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, opacity: rampOut(frame, fLib - 4, fLib + 10) }}>El mismo libro</div>
          </div>
          <div style={{ position: 'absolute', left: 640, top: 380, display: 'flex', flexDirection: 'column', gap: 30 }}>
            {recs.map((r, i) => {
              const at = fGrab - 14 + i * 8;
              const s = spring({ frame: frame - at, fps: 50, config: { damping: 15, stiffness: 160 } });
              const play = ramp(frame, at + 6, at + 70, (t) => t);
              const isRec = i === 2;
              return (
                <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 28, width: 1080, padding: '22px 30px', background: '#fff', borderRadius: 24, boxShadow: isRec && ribbon > 0.5 ? `0 0 0 4px ${color.yellow}, ${shadow.card}` : shadow.soft,
                  opacity: Math.min(1, s * 1.6), transform: `translateX(${(1 - s) * 60}px)` }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="30" height="30" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
                  </div>
                  <div style={{ width: 290, flexShrink: 0 }}>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>{r.label}</div>
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted }}>{r.sub}</div>
                  </div>
                  <Wave seed={`w${i}`} w={r.w} h={70} c={r.c} p={play} synthetic={r.synth} />
                  {isRec && ribbon > 0.01 && (
                    <div style={{ position: 'absolute', right: -24, top: -34, padding: '10px 26px 12px', background: color.yellow, borderRadius: 999, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink,
                      boxShadow: shadow.float, transform: `scale(${ribbon}) rotate(${4 * ribbon}deg)`, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill={color.ink} /></svg>
                      La que te recomendamos
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 640, top: 870, fontFamily: font.serif, fontStyle: 'italic', fontSize: 52, color: KR, opacity: rampOut(frame, fGrab - 2, fGrab + 12) * (1 - ramp(frame, fPuerta - 10, fPuerta)) }}>…pero la grabación, no.</div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={12} volume={0.6} />
      <Sfx name="ui_pop" at={18} volume={0.6} />
      <Sfx name="focus" at={fPrim} volume={0.6} />
      <Sfx name="sk_clock" at={c.at('D17', 'tiempo')} volume={0.5} />
      <Sfx name="whoosh_soft" at={fNoch - 20} volume={0.6} />
      <Sfx name="swipe" at={fNoch + 2} volume={0.6} />
      <Sfx name="riser" at={fKar + 4} volume={0.4} />
      <Sfx name="hit_soft" at={fKar + 52} volume={0.6} />
      <Sfx name="whoosh_soft" at={p18 - 14} volume={0.6} />
      <Sfx name="sk_book_thud" at={fClas - 6} volume={0.4} />
      {recs.map((_, i) => <Sfx key={i} name="ui_tap" at={fGrab - 12 + i * 8} volume={0.5} />)}
      <Sfx name="success" at={fRecom - 2} volume={0.5} />
    </SkStage>
  );
};

export const _t = { easeOut, CoverIcon };
export type _B = BookDef;

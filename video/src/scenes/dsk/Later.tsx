import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, Cover, color, Fact, FearMeter, font, KR, KR_DEEP, MiniIcon, NEVA, OLDGOLD, Pin, ramp, rampOut, shadow, SkNight, SkStage, Spine, Thread } from './kit';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 05 · Mejor para después (D35–D37) y 06 · Su vida, en sus libros (D38, D40) · ¿En orden? (D41)
// ————————————————————————————————————————————————————————————————

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

export const FlatCover: React.FC<{ b: BookDef; w: number; rot?: number; style?: React.CSSProperties; dark?: boolean }> = ({ b, w, rot = 0, style, dark = false }) => (
  <div style={{ position: 'relative', width: w, height: w * 1.5, borderRadius: w * 0.025, overflow: 'hidden', transform: `rotate(${rot}deg)`,
    boxShadow: dark ? '0 18px 40px rgba(0,0,0,0.55)' : '0 18px 40px rgba(16,16,16,0.18), 0 4px 10px rgba(16,16,16,0.10)', ...style }}>
    <Cover b={b} w={w} h={w * 1.5} />
  </div>
);

const Silhouette: React.FC<{ h: number; c: string; old?: boolean; robe?: boolean }> = ({ h, c, old = false, robe = false }) => (
  <svg width={h * 0.45} height={h} viewBox="0 0 45 100" style={{ display: 'block', overflow: 'visible' }}>
    <circle cx="22.5" cy="13" r={old ? 9.5 : 8.5} fill={c} />
    {old && <path d="M14 18 Q22.5 34 31 18 Q26 26 22.5 27 Q19 26 14 18Z" fill={c} />}
    {robe ? <path d="M8 100 L12 40 Q14 26 22.5 26 Q31 26 33 40 L37 100Z" fill={c} /> : <path d="M6 100 L8 46 Q10 27 22.5 27 Q35 27 37 46 L39 100Z" fill={c} />}
  </svg>
);

// ——— KARAM · D35–D36 ———
// El libro más gordo cae sobre la mesa; «obra maestra»; el padre y sus hijos, y una interrogación roja.
// Luego: 36 casillas de una hora, «llega mejor cuando ya conoces su voz» y la versión de Germán Gijón (4,9).
export const Karam: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('KARAM');
  const fAbrir = c.at('D35', 'abrir');
  const fKar = c.at('D35', 'Karamázov');
  const fMaes = c.at('D35', 'maestra');
  const fPadre = c.at('D35', 'padre');
  const fHijos = c.at('D35', 'hijos');
  const fAses = c.at('D35', 'asesinato');
  const p36 = c.part('D36');
  const fTreinta = c.at('D36', 'treinta');
  const fLlega = c.at('D36', 'llega');
  const fVoz = c.at('D36', 'voz.');
  const fCuando = c.at('D36', 'Cuando', 1);
  const fGerman = c.at('D36', 'Germán');
  const fCuatro = c.at('D36', 'cuatro');
  const drop = sp(frame, fKar - 14, 12, 120);
  const seal = sp(frame, fMaes - 4, 10, 220);
  const tree = ramp(frame, fPadre - 10, fPadre + 8);
  const phase2 = ramp(frame, p36 - 16, p36 + 6);
  const sons = [{ n: 'Dmitri', c: '#7A5A3A' }, { n: 'Iván', c: '#3E5770' }, { n: 'Aliosha', c: '#8C7A4E' }, { n: 'Smerdiákov', c: '#5A5A60' }];
  const q = sp(frame, fAses - 2, 9, 240);
  const filled = Math.floor(interpolate(frame, [fTreinta - 6, fTreinta + 46], [0, 36], clamp));
  return (
    <SkNight lamp={[700, 460]}>
      {/* antes de abrir */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: rampOut(frame, 4, 16) * (1 - ramp(frame, fKar - 16, fKar - 4)) }}>
        <Kicker at={4} text="Mejor para después" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }} />
        <MaskTitle text="Las que es mejor no abrir primero" at={6} size={80} align="center" color="#fff" hi={['primero']} />
      </div>
      {/* los dos libros «cerrados» con una cinta roja, mientras suena la introducción */}
      {frame < fKar && (() => {
        const a = sp(frame, 6, 16, 120);
        const o = ramp(frame, fKar - 18, fKar - 4);
        const tie = ramp(frame, fAbrir - 10, fAbrir + 14);
        return (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 70, opacity: Math.min(1, a * 1.5) * (1 - o), transform: `translateY(${(1 - a) * 60 + o * 30}px)` }}>
            {['karamazov', 'demonios'].map((k, i) => (
              <div key={k} style={{ position: 'relative' }}>
                <Book3D b={BOOKS[k]} w={300} h={450} d={110} ry={i ? 22 : -22} rx={4} />
                <div style={{ position: 'absolute', left: -14, right: -14, top: 210, height: 34, background: `linear-gradient(180deg, #C7283F, ${KR_DEEP})`, boxShadow: '0 6px 12px rgba(0,0,0,0.4)', transform: `scaleX(${tie})`, transformOrigin: i ? 'right center' : 'left center', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        );
      })()}
      {/* el libro */}
      <div style={{ position: 'absolute', left: 300 - 60 * phase2, top: 220 + (1 - drop) * -500, opacity: Math.min(1, drop * 2), transform: `rotate(${(1 - drop) * -12}deg) scale(${1 - 0.06 * phase2})` }}>
        <Book3D b={BOOKS.karamazov} w={380} h={570} d={130} ry={-24 + Math.sin(frame / 60) * 3} rx={4} />
        {/* sello «obra maestra» */}
        {frame >= fMaes - 6 && (
          <div style={{ position: 'absolute', right: -70, top: -40, width: 190, height: 190, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #F7DE92, ${OLDGOLD} 55%, #8C6A2C)`, boxShadow: '0 16px 30px rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transform: `scale(${seal}) rotate(${-12 + (1 - seal) * 40}deg)`, opacity: Math.min(1, seal * 2) }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, lineHeight: 1.05, color: '#3A2808', textTransform: 'uppercase', letterSpacing: 1 }}>Su obra<br />maestra</div>
          </div>
        )}
      </div>
      {/* el padre y sus hijos */}
      {tree > 0.01 && phase2 < 0.999 && (
        <div style={{ position: 'absolute', left: 860, top: 160, width: 960, height: 760, opacity: tree * (1 - phase2) }}>
          <div style={{ position: 'absolute', left: 480 - 60, top: 0 }}>
            <Silhouette h={260} c={KR_DEEP} old />
            <div style={{ position: 'absolute', left: -60, width: 240, top: 270, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: '#F3EAD8' }}>Un padre odioso</div>
            {/* interrogación roja */}
            {frame >= fAses - 4 && (
              <div style={{ position: 'absolute', left: 30, top: 40, fontFamily: font.serif, fontWeight: 600, fontSize: 220, lineHeight: 1, color: '#E8505B', textShadow: '0 0 40px rgba(232,80,91,0.6)', transform: `scale(${q})`, opacity: Math.min(1, q * 2) }}>?</div>
            )}
          </div>
          <svg width={960} height={760} style={{ position: 'absolute', left: 0, top: 0 }}>
            <path d="M480 330 V380 M120 380 H840 M120 380 V420 M360 380 V420 M600 380 V420 M840 380 V420" stroke="rgba(243,234,216,0.5)" strokeWidth="4" fill="none" pathLength={1} strokeDasharray={`${ramp(frame, fHijos - 10, fHijos + 10)} 1`} />
          </svg>
          {sons.map((s, i) => {
            const a = sp(frame, fHijos - 4 + i * 5, 13, 200);
            if (frame < fHijos - 5 + i * 5) return null;
            return (
              <div key={s.n} style={{ position: 'absolute', left: 120 + i * 240 - 50, top: 430, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
                <Silhouette h={220} c={s.c} robe={s.n === 'Aliosha'} />
                <div style={{ position: 'absolute', left: -70, width: 240, top: 230, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#F3EAD8' }}>{s.n}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 712, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', opacity: rampOut(frame, fAses - 4, fAses + 10) }}>
            <span style={{ background: KR, padding: '8px 26px 12px', borderRadius: 999 }}>y un asesinato</span>
          </div>
        </div>
      )}
      {/* fase 2: tiempo, cuándo, qué versión */}
      {phase2 > 0.01 && (
        <div style={{ position: 'absolute', left: 840, top: 170, width: 980, opacity: phase2, transform: `translateX(${(1 - phase2) * 40}px)` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -6, color: '#fff', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{Math.max(1, filled)}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.yellow }}>{Math.max(1, filled) === 1 ? 'hora' : 'horas'}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: 'rgba(255,255,255,0.6)' }}>· 35 h 42 min</span>
          </div>
          <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 10, width: 880 }}>
            {Array.from({ length: 36 }).map((_, i) => {
              const on = i < filled;
              return <div key={i} style={{ height: 46, borderRadius: 8, background: on ? (i === 35 ? `linear-gradient(90deg, ${KR} 70%, rgba(255,255,255,0.08) 70%)` : KR) : 'rgba(255,255,255,0.08)', transform: `scale(${on ? 1 : 0.92})` }} />;
            })}
          </div>
          <div style={{ marginTop: 50, fontFamily: font.serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1.15, color: '#F3EAD8', opacity: rampOut(frame, fLlega - 6, fLlega + 10), transform: `translateY(${(1 - rampOut(frame, fLlega - 6, fLlega + 10)) * 16}px)` }}>
            Llega mejor cuando ya conoces <span style={{ color: OLDGOLD, opacity: rampOut(frame, fVoz - 10, fVoz + 4) }}>su voz.</span>
          </div>
          <div style={{ marginTop: 46, display: 'flex', gap: 16, flexWrap: 'wrap', opacity: rampOut(frame, fCuando - 6, fCuando + 6) }}>
            <Fact at={fGerman - 4} icon={<MiniIcon kind="mic" size={30} />} label="Germán Gijón" sub="cuando llegues" size={40} />
            <Fact at={fCuatro - 4} icon={<svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill={color.ink} /></svg>} label="4,9 de 5" sub="75 valoraciones" size={40} />
          </div>
        </div>
      )}
      <Sfx name="whoosh_soft" at={fAbrir} volume={0.4} />
      <Sfx name="whoosh_deep" at={fKar - 14} volume={0.5} />
      <Sfx name="sk_book_thud" at={fKar - 2} volume={0.9} />
      <Sfx name="impact" at={fKar - 2} volume={0.35} />
      <Sfx name="sk_chime" at={fMaes} volume={0.5} />
      <Sfx name="ui_pop" at={fPadre - 6} volume={0.5} />
      {sons.map((_, i) => <Sfx key={i} name="pop" at={fHijos - 3 + i * 5} volume={0.35} />)}
      <Sfx name="sk_heart" at={fAses} volume={0.7} />
      <Sfx name="whoosh_soft" at={p36 - 14} volume={0.5} />
      {Array.from({ length: 12 }).map((_, i) => <Sfx key={`t${i}`} name="tick_soft" at={Math.round(fTreinta - 6 + i * 4.3)} volume={0.35} />)}
      <Sfx name="ui_pop" at={fGerman - 3} volume={0.55} />
      <Sfx name="success" at={fCuatro} volume={0.4} />
    </SkNight>
  );
};

// ——— DEMON · D37 ———
// Una ciudad de provincias al anochecer; un grupo reunido; un resplandor de incendio. El libro y «la más dura de empezar».
export const Demon: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DEMON');
  const fDem = c.at('D37', 'demonios');
  const fGrupo = c.at('D37', 'grupo');
  const fCiudad = c.at('D37', 'ciudad');
  const fMas = c.at('D37', 'más');
  const fDura = c.at('D37', 'dura');
  const glow = ramp(frame, fGrupo - 4, fCiudad + 30);
  const toCard = ramp(frame, fMas - 14, fMas + 4);
  const fl = 0.8 + 0.2 * Math.sin(frame / 3.3) * Math.sin(frame / 7.1);
  return (
    <AbsoluteFill style={{ background: '#0D0E12', overflow: 'hidden' }}>
      {/* la ciudad */}
      <AbsoluteFill style={{ opacity: 1 - 0.75 * toCard, filter: toCard > 0.01 ? `blur(${toCard * 8}px)` : undefined, transform: `scale(${1.04 + 0.04 * ramp(frame, 0, c.dur)})` }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #14151C 0%, #2A1B1A ${60 - 10 * glow}%, rgba(217,83,43,${0.55 * glow * fl}) 100%)` }} />
        <svg width={1920} height={1080} style={{ position: 'absolute' }}>
          <path d="M0 760 L0 640 L140 640 L140 600 L240 560 L340 600 L340 640 L520 640 L520 590 L600 590 L600 520 Q630 450 660 520 L660 590 L760 590 L760 650 L980 650 L980 600 L1080 560 L1180 600 L1180 650 L1360 650 L1360 610 L1460 610 L1460 560 Q1500 470 1540 560 L1540 610 L1640 610 L1640 650 L1920 650 L1920 760Z" fill="#07080B" />
          <circle cx="630" cy="440" r="8" fill="#C9A24E" opacity="0.7" />
          {[[170, 650], [420, 660], [820, 665], [1060, 620], [1250, 665], [1700, 665]].map(([x, y], i) => <rect key={i} x={x} y={y} width="26" height="22" fill={`rgba(255,190,90,${0.5 + 0.4 * Math.sin(frame / 9 + i)})`} />)}
          <path d="M0 760 L1920 760 L1920 1080 L0 1080Z" fill="#050608" />
        </svg>
        {/* chispas */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = random(`ds${i}`) * 1920;
          const y = 800 - ((frame * (1 + random(`dv${i}`) * 2) + random(`dy${i}`) * 700) % 700);
          return <div key={i} style={{ position: 'absolute', left: x + Math.sin(frame / 15 + i) * 10, top: y, width: 4, height: 4, borderRadius: '50%', background: '#FFB060', opacity: glow * (0.3 + 0.6 * random(`do${i}`)) }} />;
        })}
        {/* el grupo */}
        <div style={{ position: 'absolute', left: 760, top: 760, display: 'flex', gap: 6, alignItems: 'flex-end', opacity: rampOut(frame, fGrupo - 8, fGrupo + 10) }}>
          {[230, 250, 270, 245, 225].map((h, i) => <div key={i} style={{ transform: `rotate(${(i - 2) * -4}deg)`, transformOrigin: '50% 100%' }}><Silhouette h={h} c="#000" /></div>)}
        </div>
      </AbsoluteFill>
      {/* rótulos */}
      <div style={{ position: 'absolute', left: 120, top: 110, opacity: 1 - toCard }}>
        <Kicker at={2} text="Pasa lo mismo con" style={{ color: 'rgba(255,255,255,0.6)' }} />
        <MaskTitle text="Los demonios" at={fDem - 6} size={110} color="#fff" />
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          {[{ t: 'Un grupo de revolucionarios', at: fGrupo }, { t: 'en una ciudad de provincias', at: fCiudad }].map((x, i) => (
            <div key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: '#fff', background: 'rgba(8,10,14,0.7)', padding: '10px 26px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)', opacity: sp(frame, x.at - 4, 15, 200), transform: `translateY(${(1 - sp(frame, x.at - 4, 15, 200)) * 20}px)` }}>{x.t}</div>
          ))}
        </div>
      </div>
      {/* el libro y los datos */}
      {toCard > 0.01 && (
        <AbsoluteFill style={{ opacity: toCard }}>
          <div style={{ position: 'absolute', left: 300, top: 240, transform: `translateY(${(1 - toCard) * 40}px)` }}>
            <Book3D b={BOOKS.demonios} w={340} h={510} d={112} ry={-22} rx={4} />
          </div>
          <div style={{ position: 'absolute', left: 900, top: 330, width: 900 }}>
            <MaskTitle text="Los demonios" at={fMas - 12} size={104} color="#fff" />
            <div style={{ display: 'flex', gap: 16, marginTop: 30 }}>
              <Fact at={fMas - 2} icon={<MiniIcon kind="clock" size={30} />} label="Más de 30 horas" sub="30 h 57 min en audio" size={40} dark />
            </div>
            <div style={{ marginTop: 40, opacity: rampOut(frame, fDura - 8, fDura + 6) }}>
              <FearMeter level={3} at={fDura - 4} size={46} label="Dificultad para empezar" dark />
            </div>
            <div style={{ marginTop: 26, fontFamily: font.serif, fontStyle: 'italic', fontSize: 54, color: '#F3D79A', opacity: rampOut(frame, fDura - 4, fDura + 12) }}>La más dura de empezar.</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="dk_crowd" at={fGrupo - 6} volume={0.25} dur={fMas - fGrupo} fade={14} />
      <Sfx name="sk_thunder" at={fCiudad} volume={0.35} />
      <Sfx name="whoosh_soft" at={fMas - 14} volume={0.5} />
      <Sfx name="ui_pop" at={fMas - 1} volume={0.5} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="tick_soft" at={fDura - 4 + i * 5} volume={0.55} />)}
    </AbsoluteFill>
  );
};

// ——— VIDA · D38, D40 · Tablero: lo que vivió → dónde aparece ———
const NOTE = '#F4EDDC';
export const Vida: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VIDA');
  const fUniv = c.at('D38', 'universo');
  const fRep = c.at('D38', 'repite');
  const fVida = c.at('D38', 'vida.');
  const fPres = c.at('D38', 'presidio');
  const fCasa = c.at('D38', 'Memorias');
  const fEpi = c.at('D38', 'epilepsia');
  const fMysh = c.at('D38', 'Myshkin');
  const fSmer = c.at('D38', 'Smerdiákov');
  const fKar = c.at('D38', 'Los');
  const p40 = c.part('D40');
  const fHijo = c.at('D40', 'hijo');
  const fTres = c.at('D40', 'tres');
  const fUlt = c.at('D40', 'última');
  const fAlio = c.at('D40', 'Aliosha.');
  const intro = 1 - ramp(frame, fPres - 18, fPres - 4);
  // tarjetas de vida (izquierda) y libros (derecha)
  const life = [
    { id: 'pres', t: 'Cuatro años de presidio', sub: 'Omsk, 1850–1854', y: 250, at: fPres - 6 },
    { id: 'epi', t: 'Su epilepsia', sub: 'la padeció durante décadas', y: 520, at: fEpi - 6 },
    { id: 'hijo', t: 'Muere su hijo Alekséi', sub: '1878, con casi tres años', y: 790, at: fHijo - 6 },
  ];
  const books = [
    { k: 'casa', y: 200, at: fCasa - 6, note: '' },
    { k: 'idiota', y: 470, at: fMysh - 8, note: 'el príncipe Myshkin' },
    { k: 'karamazov', y: 760, at: fSmer - 8, note: '' },
  ];
  const LX = 470, BX = 1390;
  const pinL = (y: number): [number, number] => [LX + 250, y + 40];
  const pinB = (y: number): [number, number] => [BX - 90, y + 60];
  const karNote = frame >= fAlio - 10 ? 'Smerdiákov · y su héroe, Aliosha' : 'Smerdiákov';
  const aliosha = sp(frame, fAlio - 6, 11, 220);
  return (
    <SkNight lamp={[960, 360]}>
      {/* intro: no hay universo compartido */}
      {intro > 0.01 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: intro, transform: `scale(${1 + 0.06 * (1 - intro)})` }}>
          <div style={{ position: 'relative' }}>
            <MaskTitle text="Universo compartido" at={fUniv - 10} size={96} align="center" color="rgba(255,255,255,0.75)" />
            <div style={{ position: 'absolute', left: -20, right: -20, top: '52%', height: 10, background: KR, borderRadius: 5, transform: `scaleX(${ramp(frame, fUniv + 30, fUniv + 46)}) rotate(-3deg)`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ marginTop: 50 }}>
            <MaskTitle text="Lo que se repite es su vida" at={fRep - 6} size={104} align="center" color="#fff" hi={['vida']} />
          </div>
        </AbsoluteFill>
      )}
      {/* tablero */}
      {intro < 0.99 && (
        <AbsoluteFill style={{ opacity: 1 - intro }}>
          <div style={{ position: 'absolute', left: 80, top: 60, right: 80, bottom: 60, borderRadius: 20, background: 'radial-gradient(ellipse at 50% 40%, #5B4632 0%, #3E2F22 70%, #2E2219 100%)', boxShadow: 'inset 0 0 0 14px #2A1E15, 0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', inset: 14, borderRadius: 10, backgroundImage: 'radial-gradient(rgba(0,0,0,0.18) 1.2px, transparent 1.6px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)', backgroundSize: '9px 9px, 13px 13px', backgroundPosition: '0 0, 4px 6px' }} />
          </div>
          <div style={{ position: 'absolute', left: 180, top: 110, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Su vida</div>
          <div style={{ position: 'absolute', left: BX - 30, top: 110, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Sus libros</div>
          {life.map((l, i) => {
            const s = sp(frame, l.at, 13, 200);
            if (frame < l.at - 1) return null;
            return (
              <div key={l.id} style={{ position: 'absolute', left: 170, top: l.y, width: 560, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg) translateY(${(1 - s) * -30}px)`, opacity: s }}>
                <div style={{ background: NOTE, padding: '26px 30px', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.45)' }}>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>{l.t}</div>
                  <div style={{ marginTop: 6, fontFamily: font.serif, fontStyle: 'italic', fontSize: 32, color: color.ink2 }}>{l.sub}</div>
                </div>
              </div>
            );
          })}
          {books.map((b, i) => {
            const s = sp(frame, b.at, 13, 200);
            if (frame < b.at - 1) return null;
            const note = b.k === 'karamazov' ? karNote : b.note;
            return (
              <div key={b.k} style={{ position: 'absolute', left: BX, top: b.y, display: 'flex', alignItems: 'center', gap: 26, transform: `translateY(${(1 - s) * -30}px)`, opacity: s }}>
                <FlatCover b={BOOKS[b.k]} w={150} rot={i % 2 ? -3 : 3} dark />
                <div style={{ width: 250 }}>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', lineHeight: 1.1 }}>{BOOKS[b.k].title}</div>
                  {note && <div style={{ marginTop: 8, fontFamily: font.serif, fontStyle: 'italic', fontSize: 28, color: '#F3D79A' }}>{note}</div>}
                </div>
              </div>
            );
          })}
          {/* hilos */}
          <Thread a={pinL(250)} b={pinB(200)} at={fCasa - 2} dur={20} sag={50} w={5} />
          <Thread a={pinL(520)} b={pinB(470)} at={fMysh - 6} dur={20} sag={50} w={5} />
          <Thread a={pinL(520)} b={pinB(760)} at={fSmer - 6} dur={22} sag={40} w={5} />
          <Thread a={pinL(790)} b={pinB(760)} at={fUlt} dur={22} sag={60} w={5} c={OLDGOLD} />
          {life.map((l) => <Pin key={l.id} x={pinL(l.y)[0]} y={pinL(l.y)[1]} at={l.at + 4} />)}
          {books.map((b) => <Pin key={b.k} x={pinB(b.y)[0]} y={pinB(b.y)[1]} at={b.at + 4} c={NEVA} />)}
          {/* Aliosha */}
          {frame >= fAlio - 8 && (
            <div style={{ position: 'absolute', left: 900, top: 880, transform: `translate(-50%, 0) rotate(-2deg) scale(${aliosha})`, opacity: aliosha }}>
              <div style={{ background: OLDGOLD, padding: '12px 30px', borderRadius: 6, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#2A1E0A', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>Alekséi → Aliosha</div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Sfx name="pencil_strike" at={fUniv + 30} volume={0.6} />
      <Sfx name="hit_soft" at={fVida} volume={0.5} />
      {life.map((l) => <Sfx key={l.id} name="sk_pin" at={l.at + 4} volume={0.6} />)}
      {books.map((b) => <Sfx key={b.k} name="sk_pin" at={b.at + 4} volume={0.5} />)}
      <Sfx name="sk_string" at={fCasa + 2} volume={0.7} />
      <Sfx name="sk_string" at={fMysh - 2} volume={0.7} />
      <Sfx name="sk_string" at={fSmer - 2} volume={0.7} />
      <Sfx name="sk_string" at={fUlt + 4} volume={0.7} />
      <Sfx name="sk_chime" at={fAlio - 4} volume={0.55} />
      {fTres + fKar + p40 > 0 && null}
    </SkNight>
  );
};

// ——— ORDEN · D41 · ¿Hay que leerlo en orden? No: de las cortas a las largas ———
const BY_LENGTH: { k: string; h: number; label: string }[] = [
  { k: 'noches', h: 2.15, label: '2 h' }, { k: 'subsuelo', h: 4.77, label: '5 h' }, { k: 'jugador', h: 5.67, label: '6 h' },
  { k: 'crimen', h: 22.42, label: '22 h' }, { k: 'idiota', h: 23.42, label: '23 h' }, { k: 'demonios', h: 30.95, label: '31 h' }, { k: 'karamazov', h: 35.7, label: '36 h' },
];
export const Orden: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ORDEN');
  const fNo = c.at('D41', 'No:');
  const fNing = c.at('D41', 'ninguna');
  const fAyuda = c.at('D41', 'ayuda');
  const fCortas = c.at('D41', 'cortas');
  const fLargas = c.at('D41', 'largas.');
  const no = sp(frame, fNo - 2, 9, 260);
  const toRow = ramp(frame, fAyuda - 14, fAyuda + 4);
  return (
    <SkStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - toRow, transform: `scale(${1 - 0.1 * toRow})`, filter: toRow > 0.01 ? `blur(${toRow * 8}px)` : undefined }}>
        <MaskTitle text="¿Hay que leerlo en orden?" at={2} size={92} align="center" />
        <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 230, color: '#fff', background: KR, padding: '0 70px', borderRadius: 40, transform: `rotate(-5deg) scale(${1.6 - 0.6 * no})`, opacity: Math.min(1, no * 3), boxShadow: '0 30px 60px rgba(163,25,47,0.35)' }}>NO</div>
        <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink2, opacity: rampOut(frame, fNing - 4, fNing + 10) }}>Ninguna novela continúa otra</div>
      </AbsoluteFill>
      {toRow > 0 && (
        <AbsoluteFill style={{ opacity: toRow }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center' }}>
            <Kicker at={fAyuda - 8} text="Lo que ayuda" style={{ justifyContent: 'center' }} />
            <MaskTitle text="De las cortas a las largas" at={fAyuda - 4} size={86} align="center" hi={['largas']} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 22 }}>
            {BY_LENGTH.map((b, i) => {
              const at = fCortas - 6 + i * ((fLargas + 10 - fCortas) / 7);
              const s = sp(frame, at, 13, 200);
              const w = 34 + b.h * 4.2;
              const bk = BOOKS[b.k];
              return (
                <div key={b.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 60}px)` }}>
                  <Spine title={bk.title} w={w} h={420} bg={bk.bg} fg={bk.fg} accent={bk.accent} author={false} />
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink }}>{b.label}</div>
                </div>
              );
            })}
          </div>
          <svg width={1300} height={60} viewBox="0 0 1300 60" style={{ position: 'absolute', left: 310, top: 930, opacity: rampOut(frame, fCortas, fCortas + 14) }}>
            <path d={`M10 30 H${10 + 1270 * ramp(frame, fCortas, fLargas + 10)}`} stroke={color.ink} strokeWidth="6" strokeLinecap="round" />
            <path d={`M${1270 * ramp(frame, fCortas, fLargas + 10) - 10} 12 L${1270 * ramp(frame, fCortas, fLargas + 10) + 10} 30 L${1270 * ramp(frame, fCortas, fLargas + 10) - 10} 48`} stroke={color.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AbsoluteFill>
      )}
      <Sfx name="stamp" at={fNo} volume={0.8} />
      <Sfx name="whoosh_soft" at={fAyuda - 12} volume={0.6} />
      {BY_LENGTH.map((_, i) => <Sfx key={i} name="sk_book_slide" at={Math.round(fCortas - 4 + i * ((fLargas + 10 - fCortas) / 7))} volume={0.35} />)}
    </SkStage>
  );
};

export const _lt = { easeInOut, easeOut, NEVA };

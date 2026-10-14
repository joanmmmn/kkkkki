import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Count, F, Marker, NightStage, P, PaperStage, PawnTicket, QuoteCard, ramp, rampOut, shadow, Silhouette, sp, Stamp, Tag, Typed, typeTimes } from './kit';
import { Blender, HairDryer, Heater, Parcel } from './Icons';
import { AmericasMap, AM_PTS, Arc, MapPin, useMapCam } from './Maps';
import { sceneClock } from './timeline';

const LABEL = [
  { t: 'Sr. D. Francisco Porrúa', w: 'Francisco' },
  { t: 'Director literario', w: 'director' },
  { t: 'Editorial Sudamericana', w: 'Editorial' },
  { t: 'Buenos Aires · Argentina', w: 'Buenos' },
];

// ——— CORREOS · W18–W19 ———
export const Correos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORREOS');
  const fPaq = c.at('W18', 'paquete');
  const fQui = c.at('W18', 'quinientas');
  const fDob = c.at('W18', 'doble');
  const fCor = c.at('W18', 'corriente');
  const fBue = c.at('W18', 'Buenos');
  const fOch = c.at('W19', 'Ochenta');
  const fLleg = c.at('W19', 'llega');
  const fPar = c.at('W19', 'Parten');
  const fMit = c.at('W19', 'mitad');
  const toMap = ramp(frame, fBue + 10, fBue + 34);
  const mx = AM_PTS.mexico, ba = AM_PTS.ba;
  const cam = useMapCam([
    { f: 0, cx: (mx[0] + ba[0]) / 2, cy: (mx[1] + ba[1]) / 2, s: 0.7 },
    { f: fBue + 30, cx: (mx[0] + ba[0]) / 2 + 40, cy: (mx[1] + ba[1]) / 2, s: 0.62 },
    { f: c.dur, cx: (mx[0] + ba[0]) / 2 + 40, cy: (mx[1] + ba[1]) / 2, s: 0.6 },
  ]);
  const A = cam.toScreen(mx), B = cam.toScreen(ba);
  const split = ramp(frame, fPar, fPar + 18);
  const lblP = sp(frame, 2, 15, 140);
  const typed: { text: string; times: number[] }[] = [];
  return (
    <PaperStage>
      {/* Etiqueta del paquete */}
      <AbsoluteFill style={{ opacity: 1 - toMap }}>
        <div style={{ position: 'absolute', left: 170, top: 210, transform: `translateY(${(1 - lblP) * 80}px) rotate(-2deg)`, opacity: Math.min(1, lblP * 2) }}>
          <Parcel w={720} h={560} tone="#C49A66" />
          <div style={{ position: 'absolute', left: 200, top: 120, width: 640, padding: '30px 36px', background: '#FBF5E6', border: `3px solid ${P.ink}`, borderRadius: 6, boxShadow: shadow.float, transform: 'rotate(1.5deg)' }}>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: P.sepia }}>DESTINATARIO</div>
            {LABEL.map((l, i) => {
              const a = c.at('W18', l.w) - 4;
              const b = a + Math.max(16, l.t.length * 1.1);
              typed.push({ text: l.t, times: typeTimes(l.t, a, b) });
              return <div key={i} style={{ fontSize: i === 0 ? 40 : 34, color: P.ink, marginTop: 10 }}><Typed text={l.t} a={a} b={b} caret={false} /></div>;
            })}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1180, top: 300, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Tag at={fQui - 4} x={0} y={0} size={44} accent={P.yellow}>590 cuartillas</Tag>
          <Tag at={fDob - 4} x={0} y={110} size={38}>a doble espacio</Tag>
          <Tag at={fCor - 4} x={0} y={210} size={38}>en papel corriente</Tag>
        </div>
      </AbsoluteFill>
      {/* Mapa: Ciudad de México → Buenos Aires */}
      <AbsoluteFill style={{ opacity: toMap }}>
        <AmericasMap transform={cam.transform} fill={{ Mexico: '#EFD9A6', Argentina: '#E9C77A' }} sea="rgba(156,194,207,0.3)" />
        <MapPin x={A[0]} y={A[1]} at={fBue + 14} label="Ciudad de México" side="left" c={P.jungle} />
        <MapPin x={B[0]} y={B[1]} at={fBue + 22} label="Buenos Aires" sub="Editorial Sudamericana" side="left" />
        {/* precio y la mitad que viaja */}
        <div style={{ position: 'absolute', left: 1180, top: 210, width: 560, padding: '28px 34px', background: '#F7EBCB', borderRadius: 6, boxShadow: '0 20px 40px rgba(40,28,10,0.25)', fontFamily: F.type, opacity: rampOut(frame, fOch - 8, fOch + 4), transform: 'rotate(2deg)' }}>
          <div style={{ fontSize: 26, color: P.sepia, letterSpacing: 3 }}>FRANQUEO A BUENOS AIRES</div>
          <div style={{ fontSize: 110, color: P.ink, lineHeight: 1.4 }}>$<Count to={82} a={fOch - 4} b={fOch + 14} /></div>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: P.red, opacity: rampOut(frame, fLleg, fLleg + 8) }}>No les llega</div>
        </div>
        <div style={{ position: 'absolute', left: 1240, top: 560, display: 'flex', gap: 40 * (1 + split) }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ transform: `translateX(${k === 1 ? split * 20 : -split * 20}px) rotate(${(k ? 4 : -4) * split}deg)`, opacity: k === 1 ? 1 - ramp(frame, fMit + 6, fMit + 14) : 1 }}>
              <Parcel w={200 * (1 - split * 0.15)} h={140} label={split > 0.5 ? <span style={{ fontFamily: F.type, fontSize: 26, background: '#FBF5E6', padding: '2px 8px', border: `2px solid ${P.ink}` }}>{k + 1}/2</span> : undefined} />
            </div>
          ))}
        </div>
        <Arc a={[1520, 600]} b={B} at={fMit + 4} dur={60} lift={0.2} rider={<Parcel w={90} h={64} />} riderSize={90} />
      </AbsoluteFill>
      {typed.map((t, i) => <Keystrokes key={i} text={t.text} times={t.times} volume={0.4} seed={`lb${i}`} />)}
      <Sfx name="hdl_wrap" at={fPaq - 4} volume={0.7} />
      <Sfx name="ui_pop" at={fQui - 2} volume={0.5} />
      <Sfx name="zoom_out" at={fBue + 12} volume={0.6} />
      <Sfx name="hdl_register" at={fOch} volume={0.6} />
      <Sfx name="fail" at={fLleg + 2} volume={0.5} />
      <Sfx name="hdl_split" at={fPar} volume={0.9} />
      <Sfx name="hdl_mail" at={fMit + 2} volume={0.8} />
      <Sfx name="whoosh_soft" at={fMit + 10} volume={0.6} />
    </PaperStage>
  );
};

// ——— EMPEÑO · W20 ———
export const Empeno: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('EMPENO');
  const fVuel = c.at('W20', 'Vuelven');
  const fUlt = c.at('W20', 'último');
  const fCal = c.at('W20', 'calentador');
  const fFrio = c.at('W20', 'frío');
  const fSec = c.at('W20', 'secador');
  const fBat = c.at('W20', 'batidora');
  const fReu = c.at('W20', 'reúnen', 1);
  const fEnv = c.at('W20', 'envían');
  const fMit = c.at('W20', 'mitad');
  const sendP = ramp(frame, fEnv - 6, fMit + 20, easeInOut);
  return (
    <PaperStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 70, color: P.ink, opacity: rampOut(frame, 2, 16) }}>
        Lo último que queda por empeñar
      </div>
      <PawnTicket x={400} y={330} at={fCal - 2} label="El calentador" icon={<Heater s={86} on={1 - ramp(frame, fCal + 20, fCal + 40)} />} num="1412" rot={-4} w={500} stampAt={fCal + 18} />
      <PawnTicket x={960} y={370} at={fSec - 2} label="El secador" icon={<HairDryer s={86} />} num="1413" rot={2} w={500} stampAt={fSec + 14} />
      <PawnTicket x={1520} y={330} at={fBat - 2} label="La batidora" icon={<Blender s={86} />} num="1414" rot={5} w={500} stampAt={fBat + 14} />
      <Tag at={fFrio - 4} x={400} y={690} size={34} align="center" out={fBat + 30}>Sin calor no podía escribir</Tag>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', opacity: rampOut(frame, fReu - 6, fReu + 8) }}>
        <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 48, color: P.jungle }}>✓ Reúnen lo que falta</span>
      </div>
      <div style={{ position: 'absolute', left: 860 + sendP * 1300, top: 850 - Math.sin(sendP * Math.PI) * 160, opacity: frame >= fEnv - 8 ? 1 : 0, transform: `rotate(${sendP * 20}deg)` }}>
        <Parcel w={200} h={140} label={<span style={{ fontFamily: F.type, fontSize: 26, background: '#FBF5E6', padding: '2px 8px', border: `2px solid ${P.ink}` }}>1/2</span>} />
      </div>
      <Sfx name="hdl_pawn" at={fCal} volume={0.9} />
      <Sfx name="stamp" at={fCal + 18} volume={0.6} />
      <Sfx name="hdl_dryer" at={fSec - 2} volume={0.7} />
      <Sfx name="stamp" at={fSec + 14} volume={0.6} />
      <Sfx name="hdl_blender" at={fBat - 2} volume={0.7} />
      <Sfx name="stamp" at={fBat + 14} volume={0.6} />
      <Sfx name="coins" at={fReu} volume={0.7} />
      <Sfx name="hdl_mail" at={fEnv} volume={0.7} />
      <Sfx name="whoosh_fast" at={fEnv + 16} volume={0.6} />
    </PaperStage>
  );
};

// ——— FRASE · W21 ———
export const Frase: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FRASE');
  const fAho = c.at('W21', 'Ahora');
  const fCel = c.at('W21', 'célebre');
  const fMala = c.at('W21', 'mala');
  return (
    <NightStage lamp={[700, 420]}>
      <div style={{ position: 'absolute', left: 120, top: 260, opacity: rampOut(frame, 0, 20) }}>
        <Silhouette size={560} c="#0B1216" hair="long" />
      </div>
      <Tag at={fCel - 6} x={760} y={200} size={30} dark out={fAho - 4}>Mercedes, al salir de correos</Tag>
      <QuoteCard text="Ahora lo único que falta es que esta novela sea mala." at={fAho} who="Mercedes Barcha, según contó García Márquez" size={78} w={1100} dark style={{ left: 700, top: 280 }} step={2} />
      <div style={{ position: 'absolute', left: 700, top: 760, width: 1000 * ramp(frame, fMala, fMala + 18), height: 4, background: P.yellow }} />
      <Sfx name="hit_soft" at={fMala + 4} volume={0.7} />
      <Sfx name="whoosh_soft" at={fAho - 6} volume={0.5} />
    </NightStage>
  );
};

// ——— GIRO · W22 ———
export const Giro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('GIRO');
  const fGiro = c.at('W22', 'giro');
  const fPri = c.at('W22', 'primero');
  const fSeg = c.at('W22', 'segunda');
  const fBue = c.at('W22', 'Buenos');
  const fFin = c.at('W22', 'final');
  const fImp = c.at('W22', 'impaciente');
  const fPrin = c.at('W22', 'principio');
  const openP = ramp(frame, fBue, fBue + 20);
  const clockAng = (frame - fImp) * 12;
  return (
    <PaperStage>
      <div style={{ position: 'absolute', left: 150, top: 110, fontFamily: F.serif, fontWeight: 600, fontSize: 84, color: P.ink, opacity: rampOut(frame, 2, 16), transform: `translateY(${(1 - rampOut(frame, 2, 16)) * 20}px)` }}>Un último giro</div>
      {/* dos mitades en orden equivocado */}
      <div style={{ position: 'absolute', left: 150, top: 300, display: 'flex', gap: 60 }}>
        {[{ k: '2/2', at: fPri - 4, note: 'Llega primero' }, { k: '1/2', at: fSeg + 6, note: 'Todavía de viaje' }].map((p, i) => {
          const s = sp(frame, 6 + i * 6, 13, 160);
          const noteP = rampOut(frame, p.at, p.at + 12);
          return (
            <div key={i} style={{ opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 60}px)` }}>
              <Parcel w={380} h={270} label={<span style={{ fontFamily: F.type, fontSize: 44, background: '#FBF5E6', padding: '4px 12px', border: `2px solid ${P.ink}` }}>{p.k}</span>} />
              <div style={{ marginTop: 18, fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: i === 0 ? P.red : P.sepia, textAlign: 'center', opacity: noteP }}>{p.note}</div>
            </div>
          );
        })}
      </div>
      <Tag at={fSeg + 2} x={150} y={760} size={40} accent={P.red} out={fBue + 30}>Habían mandado primero la segunda mitad</Tag>
      {/* Porrúa con el final en las manos */}
      <div style={{ position: 'absolute', left: 1080, top: 210, opacity: openP }}>
        <div style={{ width: 640, height: 640, background: '#FFFDF7', borderRadius: 30, boxShadow: shadow.card, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 30, top: 160 }}><Silhouette size={300} hair="short" /></div>
          <div style={{ position: 'absolute', left: 300, top: 150, width: 280, height: 380, background: '#FBF7EE', boxShadow: '0 12px 24px rgba(40,28,10,0.2)', transform: `rotate(${-4 + 4 * openP}deg)` }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 30, top: 40 + i * 26, height: 6, width: `${70 - random(`gf${i}`) * 20}%`, background: 'rgba(29,26,22,0.45)', borderRadius: 3 }} />)}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: F.type, fontSize: 44, color: P.ink, opacity: rampOut(frame, fFin - 4, fFin + 8) }}><Marker at={fFin + 4}>FIN</Marker></div>
          </div>
          <div style={{ position: 'absolute', left: 30, top: 30, fontFamily: F.serif, fontWeight: 600, fontSize: 44, color: P.ink }}>Francisco Porrúa</div>
          <div style={{ position: 'absolute', left: 30, top: 84, fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: P.sepia }}>Buenos Aires · Editorial Sudamericana</div>
          {/* reloj de la impaciencia */}
          <svg width={130} height={130} viewBox="0 0 100 100" style={{ position: 'absolute', right: 30, top: 30, opacity: rampOut(frame, fImp - 6, fImp + 6) }}>
            <circle cx={50} cy={50} r={44} fill="#F3EAD6" stroke={P.ink} strokeWidth={5} />
            <line x1={50} y1={50} x2={50} y2={18} stroke={P.ink} strokeWidth={4} strokeLinecap="round" transform={`rotate(${clockAng} 50 50)`} />
            <line x1={50} y1={50} x2={50} y2={28} stroke={P.ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${clockAng / 12} 50 50)`} />
          </svg>
        </div>
        <div style={{ marginTop: 22, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 48, color: P.ink, opacity: rampOut(frame, fPrin - 6, fPrin + 8) }}>…esperando el principio</div>
      </div>
      <Sfx name="hdl_mail" at={fPri} volume={0.7} />
      <Sfx name="hdl_mail" at={fSeg + 8} volume={0.5} />
      <Sfx name="page_turn" at={fBue + 4} volume={0.6} />
      <Sfx name="marker" at={fFin + 4} volume={0.6} />
      <Sfx name="sk_clock" at={fImp - 2} volume={0.8} />
    </PaperStage>
  );
};

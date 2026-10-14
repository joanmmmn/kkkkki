import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Count, F, Flight, Marker, P, PaperStage, ramp, rampOut, shadow, Silhouette, sp, Tag, Typed, typeTimes } from './kit';
import { CaribHouse, FilmReel, Megaphone, Palm, Typewriter } from './Icons';
import { AmericasMap, AM_PTS, MapPin, useMapCam } from './Maps';
import { sceneClock } from './timeline';

// ——— ESCRITOR · W05–W06 ———
// Ficha mecanografiada del escritor (los datos se teclean al decirlos) y sus cuatro libros, que apenas venden.
const FIELDS: { k: string; v: string; word: [string, string, number?] }[] = [
  { k: 'Nombre', v: 'Gabriel García Márquez', word: ['W05', 'Gabriel'] },
  { k: 'Edad', v: '38 años', word: ['W05', 'treinta'] },
  { k: 'País', v: 'Colombia', word: ['W05', 'colombiano'] },
  { k: 'Vive en', v: 'Ciudad de México', word: ['W05', 'vive'] },
  { k: 'Familia', v: 'Mercedes Barcha · 2 hijos', word: ['W05', 'Mercedes'] },
  { k: 'Libros', v: '4 publicados', word: ['W05', 'cuatro'] },
];
const EARLY = [
  { t: 'La hojarasca', y: 1955, c: P.jungle },
  { t: 'El coronel no tiene quien le escriba', y: 1961, c: P.terra },
  { t: 'La mala hora', y: 1962, c: '#1F4E79' },
  { t: 'Los funerales de la Mamá Grande', y: 1962, c: P.sepia },
];
export const Escritor: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ESCRITOR');
  const fYear = c.at('W05', 'mil');
  const fCuatro = c.at('W05', 'cuatro');
  const fNing = c.at('W06', 'Ninguno');
  const fMil = c.at('W06', 'mil');
  const fDos = c.at('W06', 'dos');
  const fFact = c.at('W06', 'facturas');
  const fGui = c.at('W06', 'guiones');
  const fPub = c.at('W06', 'publicidad');
  const cardP = sp(frame, 0, 16, 120);
  const booksOut = ramp(frame, fFact - 10, fFact + 10);
  const sales = interpolate(frame, [fMil - 4, fMil + 16, fDos, fDos + 20], [0, 0.42, 0.42, 0.62], { ...clamp, easing: easeOut });
  const typedAll: { text: string; times: number[] }[] = [];
  return (
    <PaperStage>
      {/* Año */}
      <div style={{ position: 'absolute', left: 120, top: 70, fontFamily: F.serif, fontWeight: 700, fontSize: 92, color: P.ink, opacity: rampOut(frame, fYear - 6, fYear + 10) }}>1965</div>
      {/* Ficha */}
      <div style={{ position: 'absolute', left: 110, top: 210, width: 880, transform: `translateY(${(1 - cardP) * 60}px) rotate(${-1.2 * cardP}deg)`, opacity: Math.min(1, cardP * 2) }}>
        <div style={{ background: '#FBF5E6', borderRadius: 10, padding: '44px 54px 40px', boxShadow: shadow.card, position: 'relative', backgroundImage: 'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 63px, rgba(156,194,207,0.55) 63px 65px)' }}>
          <div style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 2, background: 'rgba(180,80,44,0.5)' }} />
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 150, height: 186, background: P.paper2, border: `2px solid ${P.sepia}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <Silhouette size={170} c="#5D5246" hair="curly" mustache />
            </div>
            <div style={{ flex: 1 }}>
              {FIELDS.map((fl, i) => {
                const a = c.at(fl.word[0], fl.word[1]) - 2;
                const b = a + Math.max(14, fl.v.length * 1.6);
                typedAll.push({ text: fl.v, times: typeTimes(fl.v, a, b) });
                return (
                  <div key={i} style={{ display: 'flex', gap: 18, height: 65, alignItems: 'center', fontSize: 34 }}>
                    <span style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 24, color: P.sepia, width: 120, textTransform: 'uppercase', letterSpacing: 2 }}>{fl.k}</span>
                    <Typed text={fl.v} a={a} b={b} style={{ color: P.ink }} caret={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Cuatro libros */}
      <div style={{ position: 'absolute', left: 1100, top: 220, width: 700, opacity: 1 - booksOut, transform: `translateY(${booksOut * -40}px)` }}>
        {EARLY.map((b, i) => {
          const p = sp(frame, fCuatro - 4 + i * 5, 14, 170);
          if (frame < fCuatro - 6 + i * 5) return null;
          return (
            <div key={i} style={{ position: 'relative', height: 86, marginBottom: 18, transform: `translateX(${(1 - p) * 300}px)`, opacity: Math.min(1, p * 2) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 640, height: 76, background: b.c, border: `3px solid ${P.ink}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 24px', boxShadow: '0 10px 20px rgba(40,28,10,0.2)' }}>
                <span style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 30, color: '#F6EFE2', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.t}</span>
                <span style={{ fontFamily: F.type, fontSize: 26, color: 'rgba(246,239,226,0.8)' }}>{b.y}</span>
              </div>
            </div>
          );
        })}
        {/* ventas */}
        <div style={{ marginTop: 30, opacity: rampOut(frame, fNing - 6, fNing + 8) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: P.ink }}>Ejemplares vendidos de cada libro</div>
          <div style={{ marginTop: 16, height: 30, borderRadius: 15, background: 'rgba(29,26,22,0.1)', width: 640, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: `${sales * 100}%`, height: '100%', background: P.terra, borderRadius: 15 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 640, marginTop: 10, fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: P.sepia }}>
            <span>0</span>
            <span style={{ fontWeight: 700, color: P.ink, fontSize: 40 }}>{frame < fDos ? <Count to={1000} a={fMil - 4} b={fMil + 16} prefix="≈ " /> : <><Count from={1000} to={2000} a={fDos} b={fDos + 20} /><span style={{ fontSize: 26, color: P.sepia, fontWeight: 500 }}> con suerte</span></>}</span>
          </div>
        </div>
      </div>
      {/* Para pagar las facturas */}
      {frame >= fFact - 6 && (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = sp(frame, fFact - 4 + i * 3, 12, 160);
            const x = 1200 + (random(`bill${i}`) - 0.5) * 420;
            const y = 260 + (random(`billy${i}`) - 0.5) * 120;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y - (1 - p) * 200, width: 200, height: 120, background: '#F7EBCB', border: `2px solid ${P.sepia}`, borderRadius: 4, transform: `rotate(${(random(`br${i}`) - 0.5) * 30}deg)`, opacity: Math.min(1, p * 2) * (1 - ramp(frame, fGui + 4, fGui + 16)), boxShadow: '0 10px 18px rgba(40,28,10,0.2)', padding: 14 }}>
                <div style={{ fontFamily: F.type, fontSize: 22, color: P.red }}>FACTURA</div>
                {[0, 1, 2].map((k) => <div key={k} style={{ height: 6, width: `${70 - k * 15}%`, background: 'rgba(29,26,22,0.3)', marginTop: 12 }} />)}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 1120, top: 520, display: 'flex', gap: 30 }}>
            {[{ at: fGui, icon: <FilmReel s={110} spin={frame * 3} />, l: 'Guiones de cine' }, { at: fPub, icon: <Megaphone s={110} />, l: 'Publicidad' }].map((j, i) => {
              const p = sp(frame, j.at - 4, 13, 170);
              if (frame < j.at - 6) return null;
              return (
                <div key={i} style={{ width: 300, background: '#FFFDF7', borderRadius: 26, boxShadow: shadow.card, padding: '26px 20px', textAlign: 'center', transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 2) }}>
                  {j.icon}
                  <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 40, color: P.ink, marginTop: 10 }}>{j.l}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {typedAll.map((t, i) => <Keystrokes key={i} text={t.text} times={t.times} volume={0.4} seed={`es${i}`} />)}
      {EARLY.map((_, i) => <Sfx key={i} name="sk_book_slide" at={fCuatro - 2 + i * 5} volume={0.35} />)}
      <Sfx name="counter" at={fMil - 4} volume={0.35} dur={22} fade={6} />
      <Sfx name="fail" at={fDos + 18} volume={0.3} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`b${i}`} name="card_flip" at={fFact - 2 + i * 3} volume={0.5} />)}
      <Sfx name="ui_pop" at={fGui - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPub - 2} volume={0.6} />
    </PaperStage>
  );
};

// ——— CASA · W07 ———
// Mapa del Caribe colombiano: alfiler en Aracataca, la casa de los abuelos; después la página «LA CASA» y los intentos
// que se arrugan uno tras otro, hasta la hoja en blanco con el cursor.
export const Casa: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CASA');
  const fObs = c.at('W07', 'obsesión');
  const fDie = c.at('W07', 'dieciocho');
  const fCasa = c.at('W07', 'casa');
  const fAra = c.at('W07', 'Aracataca');
  const fCar = c.at('W07', 'Caribe');
  const fTit = c.at('W07', 'título');
  const fCasa2 = c.at('W07', 'casa', 1);
  const fEmp = c.at('W07', 'empezado');
  const fAban = c.at('W07', 'abandonado');
  const fForma = c.at('W07', 'forma');
  const ara = AM_PTS.aracataca;
  const cam = useMapCam([
    { f: 0, cx: 760, cy: 470, s: 1.2 },
    { f: fCasa - 10, cx: 760, cy: 470, s: 1.25 },
    { f: fAra + 10, cx: ara[0] + 40, cy: ara[1] + 30, s: 4.2 },
    { f: fTit, cx: ara[0] + 50, cy: ara[1] + 30, s: 4.4 },
  ]);
  const mapOut = ramp(frame, fTit - 12, fTit + 8);
  const pin = cam.toScreen(ara);
  const houseP = sp(frame, fAra + 8, 14, 140);
  // intentos: cada uno entra, se arruga y vuela a la papelera
  const tries = [fEmp - 2, fEmp + 14, fEmp + 30];
  return (
    <PaperStage>
      <AbsoluteFill style={{ opacity: 1 - mapOut }}>
        <AmericasMap transform={cam.transform} fill={{ Colombia: '#E9C77A', Venezuela: '#E4D7BE' }} sea="rgba(156,194,207,0.28)"
          labels={[{ name: 'Mar Caribe', at: fCar - 6, p: [700, 380], size: 0.5 }, { name: 'COLOMBIA', at: fObs, p: [770, 560], size: 0.9 }]} />
        <MapPin x={pin[0]} y={pin[1]} at={fAra - 2} label="Aracataca" sub="donde se crió" />
        <div style={{ position: 'absolute', left: pin[0] - 520, top: pin[1] - 360, opacity: Math.min(1, houseP * 2), transform: `scale(${0.85 + 0.15 * houseP})`, transformOrigin: 'bottom right' }}>
          <div style={{ position: 'absolute', left: -70, top: 20 }}><Palm h={340} sway={Math.sin(frame / 30) * 3} /></div>
          <CaribHouse w={420} glow={ramp(frame, fCasa + 10, fCasa + 30)} />
          <div style={{ textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 34, color: P.ink2, marginTop: 6 }}>La casa de sus abuelos</div>
        </div>
        <Tag at={fDie - 4} x={120} y={930} size={40} accent={P.yellow}>Una obsesión desde los 18 años</Tag>
      </AbsoluteFill>
      {/* La página «LA CASA» y los intentos */}
      <AbsoluteFill style={{ opacity: mapOut }}>
        <div style={{ position: 'absolute', left: 960 - 280, top: 120, width: 560, height: 760, background: '#FBF7EE', boxShadow: '0 30px 60px rgba(40,28,10,0.22)', transform: `translateY(${(1 - rampOut(frame, fTit - 8, fTit + 12)) * 80}px)` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontSize: 64, color: P.ink }}>
            {frame < fForma - 10 ? <Typed text="LA CASA" a={fCasa2 - 2} b={fCasa2 + 18} /> : <Typed text="" a={fForma} b={fForma + 1} />}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: F.type, fontSize: 26, color: P.sepia, opacity: rampOut(frame, fCasa2 + 18, fCasa2 + 30) * (1 - ramp(frame, fEmp - 6, fEmp)) }}>(título provisional)</div>
          {frame >= fForma - 10 && <div style={{ position: 'absolute', left: 80, top: 140, fontSize: 60 }}><Typed text=" " a={fForma - 10} b={fForma - 9} caret /></div>}
        </div>
        {tries.map((t, i) => {
          const crumple = ramp(frame, t, t + 10);
          const fly = ramp(frame, t + 10, t + 26, (x) => x * x);
          if (frame < t - 2) return null;
          const tx = 960 + fly * (520 + i * 60);
          const ty = 500 + fly * 300 - Math.sin(fly * Math.PI) * 260;
          return (
            <div key={i} style={{ position: 'absolute', left: tx - 140 * (1 - crumple) - 60 * crumple, top: ty - 190 * (1 - crumple) - 60 * crumple, width: 280 * (1 - crumple) + 120 * crumple, height: 380 * (1 - crumple) + 120 * crumple,
              borderRadius: `${50 * crumple}%`, background: '#FBF7EE', boxShadow: '0 12px 24px rgba(40,28,10,0.25)', transform: `rotate(${crumple * 180 + fly * 400}deg)`, opacity: frame > t + 30 ? 0 : 1,
              backgroundImage: crumple > 0.2 ? 'repeating-linear-gradient(35deg, rgba(0,0,0,0.06) 0 8px, rgba(0,0,0,0) 8px 18px), repeating-linear-gradient(-40deg, rgba(0,0,0,0.05) 0 6px, rgba(0,0,0,0) 6px 16px)' : undefined }}>
              {crumple < 0.3 && <div style={{ padding: 30, fontFamily: F.type, fontSize: 24, color: P.ink, opacity: 1 - crumple * 3 }}>LA CASA<br /><br />{['Capítulo 1', 'Primera versión', 'Otra vez'][i]}</div>}
            </div>
          );
        })}
        {/* papelera */}
        <div style={{ position: 'absolute', left: 1440, top: 760, width: 190, height: 220, opacity: rampOut(frame, fEmp - 8, fEmp + 4) }}>
          <svg width={190} height={220} viewBox="0 0 190 220"><path d="M10 20 L 180 20 L 160 214 L 30 214 Z" fill="#8A6A48" stroke={P.ink} strokeWidth={4} />{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${40 + k * 28} 30 L ${48 + k * 24} 204`} stroke="rgba(0,0,0,0.25)" strokeWidth={3} />)}</svg>
        </div>
        <Tag at={fAban - 2} x={960} y={930} size={38} align="center" out={fForma - 6}>La empieza y la abandona una y otra vez</Tag>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 930, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, color: P.ink, opacity: rampOut(frame, fForma, fForma + 14) }}>
          <Marker at={fForma + 6}>No encuentra la forma de contarla</Marker>
        </div>
      </AbsoluteFill>
      <Flight pts={[[-100, 700], [400, 420], [pin[0] - 200, pin[1] - 260], [pin[0] - 60, pin[1] - 330]]} a={fAra} b={fAra + 70} size={44} seed="casa" hold={frame < fTit - 10} />
      <Sfx name="zoom_in" at={fCasa + 4} volume={0.5} />
      <Sfx name="stamp" at={fAra + 2} volume={0.4} />
      <Sfx name="ui_pop" at={fDie - 2} volume={0.5} />
      <Keystrokes text="LA CASA" times={typeTimes('LA CASA', fCasa2 - 2, fCasa2 + 18)} volume={0.6} seed="lc" />
      {tries.map((t, i) => <React.Fragment key={i}><Sfx name="sk_crumple" at={t} volume={0.6} /><Sfx name="sk_bin" at={t + 26} volume={0.5} /></React.Fragment>)}
      <Sfx name="sk_typebell" at={fForma - 8} volume={0.5} />
    </PaperStage>
  );
};

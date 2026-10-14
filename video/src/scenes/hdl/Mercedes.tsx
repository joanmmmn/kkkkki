import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Butterfly, Count, F, Marker, NameCard, P, PaperStage, PawnTicket, ramp, rampOut, Reveal, shadow, Silhouette, sp, Tag, Typed, typeTimes } from './kit';
import { Cap, CarIcon, Jewels, Plate, TV60 } from './Icons';
import { sceneClock } from './timeline';

// ——— MERCEDES · W14–W15 ———
// «La verdadera protagonista»: su ficha, una mariposa que se posa; después las papeletas de empeño del coche, las joyas y la tele.
export const Mercedes: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MERCEDES');
  const fMien = c.at('W14', 'Mientras');
  const fPie = c.at('W14', 'pie');
  const fVer = c.at('W14', 'verdadera');
  const fMer = c.at('W14', 'Mercedes');
  const fCoche = c.at('W15', 'coche');
  const fSeis = c.at('W15', 'seis');
  const fJoy = c.at('W15', 'joyas');
  const fTele = c.at('W15', 'televisor');
  const top = ramp(frame, fCoche - 16, fCoche + 4);
  const houseP = sp(frame, fMien - 6, 14, 140);
  return (
    <PaperStage>
      {/* la casa que se mantiene en pie, sostenida por Mercedes (silueta) */}
      <div style={{ position: 'absolute', left: 150, top: 200, opacity: Math.min(1, houseP * 2) * (1 - ramp(frame, fCoche - 16, fCoche + 4)), transform: `translateY(${(1 - houseP) * 50}px)` }}>
        <svg width={560} height={560} viewBox="0 0 230 230" style={{ overflow: 'visible' }}>
          <g transform={`rotate(${(1 - ramp(frame, fMien + 10, fPie)) * -9} 30 200)`}>
            <path d="M40 110 L 125 40 L 210 110 L 210 200 L 40 200 Z" fill="#F5E9CF" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d="M30 112 L 125 32 L 220 112" fill="none" stroke={P.terra} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            <rect x={105} y={140} width={36} height={60} fill={P.jungle} stroke={P.ink} strokeWidth={3} />
            <rect x={60} y={124} width={32} height={30} fill={ramp(frame, fVer, fVer + 20) > 0 ? `rgba(255,202,5,${0.35 + 0.65 * ramp(frame, fVer, fVer + 20)})` : '#9CC2CF'} stroke={P.ink} strokeWidth={3} />
            <rect x={160} y={124} width={32} height={30} fill="#9CC2CF" stroke={P.ink} strokeWidth={3} />
          </g>
          <path d="M10 200 L 240 200" stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', left: -110, top: 250 }}><Silhouette size={300} hair="long" c="#3B332B" /></div>
        <div style={{ textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 42, color: P.ink2, marginTop: 6, opacity: rampOut(frame, fPie - 4, fPie + 10) }}>la casa, en pie</div>
      </div>
      <div style={{ position: 'absolute', left: 860, top: 300, width: 960, opacity: 1 - top }}>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 96, lineHeight: 1.05, color: P.ink }}>
          <Reveal text="La verdadera protagonista" at={fVer - 4} step={3} />
        </div>
      </div>
      <div style={{ opacity: 1 - top }}>
        <NameCard at={fMer - 4} name="Mercedes Barcha" role="Mujer de García Márquez" x={860} y={540} w={760} icon={<Silhouette size={100} hair="long" />} accent={P.yellow} />
      </div>
      {frame > fMer && frame < fCoche && <Butterfly x={interpolate(frame, [fMer, fMer + 40], [1900, 1520], { ...clamp, easing: easeOut })} y={interpolate(frame, [fMer, fMer + 40], [180, 520], { ...clamp, easing: easeOut }) + Math.sin(frame / 7) * 6} size={70} seed="mer" flap={frame > fMer + 40 ? 0.8 : 3.4} rot={-10} />}
      {/* libreta de cuentas y papeletas */}
      <AbsoluteFill style={{ opacity: top }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.sans, fontWeight: 500, fontSize: 32, letterSpacing: 8, textTransform: 'uppercase', color: P.sepia }}>Lo que va al Monte de Piedad</div>
        <PawnTicket x={400} y={330} at={fCoche - 2} label="El coche" icon={<CarIcon s={86} />} num="1147" rot={-4} w={500} stampAt={fCoche + 14} />
        <PawnTicket x={960} y={370} at={fJoy - 2} label="Las joyas" icon={<Jewels s={86} />} num="1302" rot={2} w={500} stampAt={fJoy + 14} />
        <PawnTicket x={1520} y={330} at={fTele - 2} label="El televisor" icon={<TV60 s={86} />} num="1386" rot={5} w={500} stampAt={fTele + 14} />
        <Tag at={fSeis - 4} x={400} y={680} size={38} align="center" accent={P.yellow}>Da para unos 6 meses</Tag>
        <Tag at={fJoy + 6} x={960} y={720} size={34} align="center">Regalos de su familia</Tag>
      </AbsoluteFill>
      <Sfx name="hdl_flutter" at={fMer + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fMer - 2} volume={0.6} />
      <Sfx name="hdl_pawn" at={fCoche} volume={0.9} />
      <Sfx name="stamp" at={fCoche + 14} volume={0.6} />
      <Sfx name="hdl_pawn" at={fJoy} volume={0.9} />
      <Sfx name="stamp" at={fJoy + 14} volume={0.6} />
      <Sfx name="hdl_tv" at={fTele - 4} volume={0.8} />
      <Sfx name="stamp" at={fTele + 14} volume={0.6} />
    </PaperStage>
  );
};

// ——— VECINOS · W16 ———
// Tres siluetas de soldados en fila (el pelotón de la novela) se convierten en vecinos que llaman a la puerta con bolsas.
export const Vecinos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VECINOS');
  const fDet = c.at('W16', 'detalle');
  const fVec = c.at('W16', 'vecinos');
  const fTres = c.at('W16', 'tres');
  const fMil = c.at('W16', 'militares');
  const fPel = c.at('W16', 'pelotón');
  const fLado = c.at('W16', 'lado');
  const fPel2 = c.at('W16', 'pelotón', 1);
  const fMes = c.at('W16', 'mes');
  const morph = ramp(frame, fPel2 - 6, fPel2 + 20);
  const walk = interpolate(frame, [fPel2 + 4, fMes + 20], [0, 1], clamp);
  return (
    <PaperStage>
      {/* calle: cuatro puertas */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 780, height: 300, background: '#CDBB98' }} />
      {[0, 1, 2, 3].map((i) => {
        const x = 180 + i * 420;
        const ours = i === 3;
        const capP = !ours ? sp(frame, fTres + i * 6, 12, 170) : 0;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 300 }}>
            <div style={{ width: 340, height: 480, background: ours ? '#F5E9CF' : ['#E9D7B9', '#DDE4D6', '#EAD1C4'][i], border: `4px solid ${P.ink}`, borderRadius: '8px 8px 0 0' }} />
            <div style={{ position: 'absolute', left: 110, top: 230, width: 120, height: 250, background: ours ? P.jungle : '#6B4A2A', border: `4px solid ${P.ink}` }} />
            <div style={{ position: 'absolute', left: 40, top: 60, width: 100, height: 110, background: '#9CC2CF', border: `3px solid ${P.ink}` }} />
            <div style={{ position: 'absolute', left: 200, top: 60, width: 100, height: 110, background: '#9CC2CF', border: `3px solid ${P.ink}` }} />
            {!ours && frame >= fTres + i * 6 - 2 && <div style={{ position: 'absolute', left: 120, top: 120 - (1 - capP) * 60, opacity: Math.min(1, capP * 2), transform: `scale(${0.7 + 0.3 * capP})` }}><Cap s={100} /></div>}
            {ours && <div style={{ position: 'absolute', left: -20, top: -70, fontFamily: F.serif, fontWeight: 600, fontSize: 40, color: P.ink, whiteSpace: 'nowrap' }}>Los García Márquez</div>}
          </div>
        );
      })}
      <Tag at={fVec - 4} x={180} y={150} size={36} out={fPel - 6}>Sus vecinos</Tag>
      <Tag at={fMil - 2} x={600} y={150} size={40} accent={P.jungle2} out={fPel - 6}>Tres familias de militares</Tag>
      {/* pelotón → vecinos con bolsas */}
      {frame >= fPel - 6 && [0, 1, 2].map((i) => {
        const p = sp(frame, fPel - 4 + i * 4, 14, 160);
        const x = 260 + i * 200 + walk * (900 - i * 60);
        const y = 560 + Math.abs(Math.sin(frame / 6 + i)) * 8 * (walk > 0 && walk < 1 ? 1 : 0);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)` }}>
            <svg width={160} height={260} viewBox="0 0 80 130">
              <circle cx={40} cy={18} r={12} fill="#2B2B22" />
              <path d="M26 6 L 54 6 L 52 12 L 28 12 Z" fill={morph < 0.5 ? '#3E4A26' : 'rgba(0,0,0,0)'} />
              <path d="M24 34 C 24 30, 56 30, 56 34 L 58 84 L 22 84 Z" fill="#2B2B22" />
              <path d="M28 84 L 30 126 M 52 84 L 50 126" stroke="#2B2B22" strokeWidth={9} strokeLinecap="round" />
              {/* fusil (se desvanece) / bolsa (aparece) */}
              <path d="M60 36 L 62 92" stroke="#2B2B22" strokeWidth={4} opacity={1 - morph} />
              <g opacity={morph}><path d="M56 60 L 74 60 L 72 90 L 58 90 Z" fill="#D9B98A" stroke="#2B2B22" strokeWidth={2} /><path d="M60 60 C 60 52, 70 52, 70 60" stroke="#2B2B22" strokeWidth={2} fill="none" /><circle cx={64} cy={58} r={3} fill={P.leaf} /></g>
            </svg>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: rampOut(frame, fPel2 - 4, fPel2 + 10) }}>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 80, color: P.ink }}>Otro pelotón: <Marker at={fPel2 + 14}>el de la ayuda</Marker></div>
      </div>
      {frame > fDet && frame < fPel && <Tag at={fDet - 2} x={960} y={150} size={34} align="center" out={fVec - 8} dark>Un detalle de novela</Tag>}
      <Sfx name="ui_pop" at={fVec - 2} volume={0.5} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="snap_in" at={fTres + i * 6} volume={0.5} />)}
      <Sfx name="sk_heart" at={fPel} volume={0.5} />
      <Sfx name="sparkle" at={fPel2} volume={0.6} />
      <Sfx name="hdl_knock" at={fMes + 6} volume={0.8} />
      {fLado > 0 && null}
    </PaperStage>
  );
};

// ——— DEUDA · W17 ———
// «FIN» en la máquina; la deuda que sube; y los ~550 días de esos 18 meses, cada uno con su plato.
export const Deuda: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DEUDA');
  const fPun = c.at('W17', 'punto');
  const fAgo = c.at('W17', 'agosto');
  const fDebe = c.at('W17', 'debe');
  const fDiez = c.at('W17', 'diez');
  const fAnos = c.at('W17', 'Años');
  const fCom = c.at('W17', 'comida');
  const fDia = c.at('W17', 'día');
  const finOut = ramp(frame, fDebe - 10, fDebe + 4);
  const debtOut = ramp(frame, fAnos - 10, fAnos + 6);
  const days = 18 * 30;
  const fill = interpolate(frame, [fAnos, fDia + 10], [0, days], clamp);
  return (
    <PaperStage>
      {/* FIN */}
      <AbsoluteFill style={{ opacity: 1 - finOut, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 620, height: 760, background: '#FBF7EE', boxShadow: shadow.card, position: 'relative' }}>
          {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 70, top: 80 + i * 34, height: 8, width: `${70 - random(`fn${i}`) * 20}%`, background: 'rgba(29,26,22,0.45)', borderRadius: 3 }} />)}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 72, color: P.ink }}><Typed text="FIN" a={fPun - 2} b={fPun + 10} /></div>
        </div>
        <div style={{ position: 'absolute', left: 1360, top: 380, fontFamily: F.serif, fontWeight: 700, fontSize: 84, color: P.ink, opacity: rampOut(frame, fAgo - 4, fAgo + 10) }}>Agosto<br />de 1966</div>
      </AbsoluteFill>
      {/* deuda */}
      <AbsoluteFill style={{ opacity: finOut * (1 - debtOut), alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 34, letterSpacing: 8, textTransform: 'uppercase', color: P.sepia }}>Lo que deben</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 230, color: P.red, lineHeight: 1 }}><Count to={120000} a={fDebe} b={fDebe + 40} /></div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 64, color: P.ink }}>pesos</div>
        <Tag at={fDiez - 4} x={960} y={790} size={44} align="center" accent={P.yellow}>≈ 10.000 dólares de la época</Tag>
      </AbsoluteFill>
      {/* los días */}
      <AbsoluteFill style={{ opacity: debtOut }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 70, color: P.ink }}>
          <Reveal text="Ni un solo día sin comida en casa" at={fCom - 10} step={2} />
        </div>
        <div style={{ position: 'absolute', left: 210, top: 250, width: 1500, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Array.from({ length: days }).map((_, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: i < fill ? P.yellow : 'rgba(29,26,22,0.1)', border: i < fill ? `1px solid ${P.yellowDeep}` : '1px solid rgba(29,26,22,0.06)' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 860, top: 880, transform: `scale(${0.8 + 0.2 * sp(frame, fDia - 4)})`, opacity: rampOut(frame, fDia - 6, fDia + 6) }}><Plate s={200} /></div>
        <Tag at={fAnos + 6} x={210} y={880} size={32} out={fDia - 10}>18 meses · unos 550 días</Tag>
      </AbsoluteFill>
      <Keystrokes text="FIN" times={typeTimes('FIN', fPun - 2, fPun + 10)} volume={0.9} seed="fin" />
      <Sfx name="sk_typebell" at={fPun + 16} volume={0.7} />
      <Sfx name="counter" at={fDebe} volume={0.4} dur={40} fade={8} />
      <Sfx name="hit_soft" at={fDebe + 40} volume={0.5} />
      <Sfx name="ui_pop" at={fDiez - 2} volume={0.5} />
      <Sfx name="sparkle" at={fDia} volume={0.6} />
    </PaperStage>
  );
};

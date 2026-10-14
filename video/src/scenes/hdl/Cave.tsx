import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { Count, F, Marker, NameCard, P, PaperStage, ramp, rampOut, shadow, Silhouette, sp, Stamp, Tag, Typed, typeTimes } from './kit';
import { Typewriter } from './Icons';
import { sceneClock } from './timeline';

// ——— CUEVA · W11–W12 ———
// Calendario: «6 meses» tachado → las hojas pasan hasta 18. Después el cuarto de escribir, con su cartel, la pila que crece
// y el marcador de ingresos plano.
export const Cueva: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CUEVA');
  const fSeis = c.at('W11', 'seis');
  const fDie = c.at('W11', 'dieciocho');
  const fEnc = c.at('W12', 'encierra');
  const fCue = c.at('W12', 'cueva');
  const fDias = c.at('W12', 'días');
  const fPeso = c.at('W12', 'peso');
  const calOut = ramp(frame, fEnc - 14, fEnc + 6);
  const month = Math.max(1, Math.min(18, Math.floor(interpolate(frame, [fDie - 6, fDie + 34], [6, 18], { ...clamp, easing: easeInOut }))));
  const strike = ramp(frame, fDie - 10, fDie, easeOut);
  const pile = interpolate(frame, [fEnc, c.dur], [10, 150], clamp);
  const typing = frame > fEnc && Math.floor(frame / 3) % 2 === 0 ? 1 : 0;
  const signP = sp(frame, fCue - 6, 9, 160);
  return (
    <PaperStage>
      {/* Calendario */}
      <AbsoluteFill style={{ opacity: 1 - calOut, transform: `scale(${1 + calOut * 0.1})` }}>
        <div style={{ position: 'absolute', left: 960 - 300, top: 170, width: 600, height: 640, perspective: 1600 }}>
          <div style={{ position: 'absolute', inset: 0, background: '#FBF7EE', borderRadius: 18, boxShadow: shadow.card }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 110, background: P.jungle, borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: '#F6EFE2', letterSpacing: 4 }}>MESES ESCRIBIENDO</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 300, color: P.ink, lineHeight: 1 }}>
            {frame < fDie - 6 ? <Count from={1} to={6} a={fSeis - 10} b={fSeis + 6} /> : month}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, color: P.sepia }}>{month === 1 ? 'mes' : 'meses'}</div>
          {/* tachón del 6 */}
          <svg width={600} height={640} style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - ramp(frame, fDie - 2, fDie + 4) }}>
            <path d="M150 250 L 450 400" stroke={P.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={340} strokeDashoffset={340 * (1 - strike)} />
          </svg>
          {/* hojas que pasan */}
          {frame > fDie - 6 && frame < fDie + 36 && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 110, height: 530, background: '#FBF7EE', transformOrigin: '50% 0%', transform: `rotateX(${((frame * 23) % 180)}deg)`, opacity: 0.85, boxShadow: '0 -10px 20px rgba(0,0,0,0.1)' }} />
          )}
        </div>
        <Tag at={fSeis - 4} x={330} y={420} size={42} out={fDie - 8}>Lo que calcula: 6</Tag>
        <Tag at={fDie + 4} x={1340} y={420} size={42} accent={P.red}>Lo que tarda: 18</Tag>
      </AbsoluteFill>
      {/* El cuarto */}
      <AbsoluteFill style={{ opacity: calOut }}>
        {/* pared y ventana */}
        <div style={{ position: 'absolute', left: 120, top: 120, width: 380, height: 300, background: '#9CC2CF', border: '14px solid #6B4A2A', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, background: '#6B4A2A' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 10, background: '#6B4A2A' }} />
        </div>
        {/* cartel de la puerta */}
        <div style={{ position: 'absolute', left: 1240, top: 70, transformOrigin: '50% 0%', transform: `rotate(${(1 - signP) * 30 + Math.sin(frame / 18) * 2 * signP}deg)`, opacity: Math.min(1, signP * 3) }}>
          <div style={{ position: 'absolute', left: 140, top: -60, width: 2, height: 64, background: P.ink }} />
          <div style={{ width: 460, padding: '24px 28px', background: '#7A5232', border: `5px solid #3A2414`, borderRadius: 12, boxShadow: '0 16px 30px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 30, color: '#F2D9A8' }}>sus amigos lo llamaban</div>
            <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 56, color: '#FFF1D6', lineHeight: 1.1 }}>La cueva de la mafia</div>
          </div>
        </div>
        {/* escritorio */}
        <div style={{ position: 'absolute', left: 340, right: 340, top: 760, height: 40, background: '#6B4A2A', borderRadius: 6, boxShadow: '0 20px 30px rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', left: 380, top: 800, width: 30, height: 280, background: '#5A3C22' }} />
        <div style={{ position: 'absolute', right: 380, top: 800, width: 30, height: 280, background: '#5A3C22' }} />
        <div style={{ position: 'absolute', left: 760, top: 470 }}><Typewriter w={400} paper={1} press={typing} /></div>
        {/* pila de folios que crece */}
        <div style={{ position: 'absolute', left: 1240, top: 760 - pile, width: 260, height: pile, background: '#F4ECD9', border: '2px solid rgba(120,100,70,0.4)', borderRadius: 4,
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(120,100,70,0.25) 0 1px, rgba(0,0,0,0) 1px 5px)' }} />
        <div style={{ position: 'absolute', left: 1250, top: 700 - pile, fontFamily: F.type, fontSize: 30, color: P.ink }}>{Math.round(pile * 3.9)} cuartillas</div>
        {/* lámpara */}
        <div style={{ position: 'absolute', left: 560, top: 600, width: 140, height: 70, background: '#2F4F4A', borderRadius: '70px 70px 6px 6px', boxShadow: '0 30px 80px 30px rgba(255,214,140,0.35)' }} />
        <div style={{ position: 'absolute', left: 622, top: 668, width: 16, height: 92, background: '#1F2F2C' }} />
        {/* ingresos */}
        <div style={{ position: 'absolute', left: 1240, top: 290, width: 520, padding: '22px 26px', background: '#FFFDF7', borderRadius: 22, boxShadow: shadow.card, opacity: rampOut(frame, fPeso - 30, fPeso - 14) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: P.sepia, letterSpacing: 2, textTransform: 'uppercase' }}>Ingresos</div>
          <svg width={470} height={110} style={{ marginTop: 8 }}>
            <path d={`M0 80 L ${470 * ramp(frame, fPeso - 24, fPeso)} 80`} stroke={P.red} strokeWidth={6} strokeLinecap="round" />
            <path d="M0 100 L 470 100" stroke="rgba(0,0,0,0.15)" strokeWidth={2} />
          </svg>
          <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 64, color: P.ink, marginTop: -6 }}>$0</div>
        </div>
      </AbsoluteFill>
      <Sfx name="counter" at={fSeis - 10} volume={0.3} dur={16} fade={4} />
      <Sfx name="pencil_strike" at={fDie - 10} volume={0.8} />
      <Sfx name="page_riffle" at={fDie} volume={0.8} />
      <Sfx name="sk_door" at={fEnc - 6} volume={0.4} />
      <Sfx name="sk_pin" at={fCue - 2} volume={0.6} />
      <Sfx name="sk_typing" at={fEnc + 10} volume={0.5} />
      <Sfx name="sk_typing" at={fDias} volume={0.5} />
      <Sfx name="sk_typebell" at={fDias + 30} volume={0.5} />
      <Sfx name="fail" at={fPeso} volume={0.4} />
    </PaperStage>
  );
};

// ——— AMIGOS · W13 ———
export const Amigos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AMIGOS');
  const fAmi = c.at('W13', 'amigos');
  const fMut = c.at('W13', 'Mutis');
  const fFue = c.at('W13', 'Fuentes');
  const fPasan = c.at('W13', 'pasan');
  const fCap = c.at('W13', 'capítulo');
  const fLee = c.at('W13', 'lee');
  const fRev = c.at('W13', 'revista');
  const fFuera = c.at('W13', 'fuera');
  const fMut2 = c.at('W13', 'Mutis', 1);
  const fAtar = c.at('W13', 'atardecer');
  const fDoce = c.at('W13', 'doce');
  const fBox = c.at('W13', 'boxeo');
  const cardsOut = ramp(frame, fLee - 16, fLee);
  const magP = sp(frame, fLee - 8, 15, 140);
  const magOut = ramp(frame, fMut2 - 14, fMut2);
  const sunset = ramp(frame, fMut2 - 6, fAtar + 10);
  const bellP = sp(frame, fDoce - 4, 9, 220);
  return (
    <PaperStage>
      {/* Fichas de los amigos */}
      <AbsoluteFill style={{ opacity: 1 - cardsOut, transform: `translateY(${cardsOut * -40}px)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: F.sans, fontWeight: 500, fontSize: 32, letterSpacing: 8, textTransform: 'uppercase', color: P.sepia, opacity: rampOut(frame, fAmi - 6, fAmi + 8) }}>Sus primeros lectores</div>
        <NameCard at={fMut - 4} name="Álvaro Mutis" role="Poeta" x={180} y={300} w={720} icon={<Silhouette size={100} hair="short" />} />
        <NameCard at={fFue - 4} name="Carlos Fuentes" role="Novelista" x={1020} y={300} w={720} icon={<Silhouette size={100} hair="curly" />} accent={P.terra} />
        {/* el capítulo que les cuenta */}
        <div style={{ position: 'absolute', left: 960 - 230, top: 560, width: 460, height: 300, background: '#FBF7EE', boxShadow: shadow.card, transform: `translateY(${(1 - sp(frame, fCap - 6, 14, 150)) * 200}px) rotate(-2deg)`, opacity: rampOut(frame, fCap - 8, fCap + 4), padding: 30 }}>
          <div style={{ fontFamily: F.type, fontSize: 30, color: P.ink }}>Capítulo en curso</div>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 8, width: `${92 - random(`cap${i}`) * 25}%`, background: 'rgba(29,26,22,0.45)', marginTop: 22, borderRadius: 3 }} />)}
        </div>
        <Tag at={fPasan - 2} x={960} y={920} size={34} align="center" out={fLee - 18}>Pasan por casa y le piden que les cuente</Tag>
      </AbsoluteFill>
      {/* La revista */}
      <AbsoluteFill style={{ opacity: Math.min(1, magP * 2) * (1 - magOut) }}>
        <div style={{ position: 'absolute', left: 360, top: 120, width: 1200, height: 820, background: '#F6F0E2', boxShadow: shadow.card, transform: `translateY(${(1 - magP) * 120}px) rotate(${-1.5 * magP}deg)` }}>
          <div style={{ margin: '40px 60px 0', borderBottom: `4px double ${P.ink}`, paddingBottom: 16, fontFamily: F.serif, fontWeight: 700, fontSize: 84, letterSpacing: 4, color: P.ink }}>REVISTA</div>
          <div style={{ margin: '12px 60px', fontFamily: F.sans, fontSize: 24, color: P.sepia }}>Ciudad de México</div>
          <div style={{ display: 'flex', gap: 40, margin: '30px 60px' }}>
            {[0, 1].map((col) => (
              <div key={col} style={{ flex: 1 }}>
                {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ height: 8, width: `${80 + random(`mg${col}${i}`) * 20}%`, background: 'rgba(29,26,22,0.32)', marginTop: 20, borderRadius: 3 }} />)}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 120, right: 120, top: 380, padding: '30px 40px', background: '#FFFDF7', boxShadow: shadow.float, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia }}>Carlos Fuentes cuenta que acaba de leer</div>
            <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 76, color: P.ink, marginTop: 6 }}><Marker at={fFuera}>algo fuera de lo común</Marker></div>
          </div>
        </div>
        <Tag at={fRev - 2} x={1530} y={160} size={34} dark>Primeros capítulos</Tag>
      </AbsoluteFill>
      {/* Atardecer y doce asaltos */}
      <AbsoluteFill style={{ opacity: magOut }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(232,140,80,${0.55 * sunset}) 0%, rgba(240,190,120,${0.4 * sunset}) 55%, rgba(0,0,0,0) 100%)` }} />
        <div style={{ position: 'absolute', left: 160, top: 220 }}>
          <svg width={520} height={640} viewBox="0 0 260 320">
            <rect x={20} y={10} width={220} height={300} fill="#6B4A2A" stroke={P.ink} strokeWidth={5} />
            <rect x={36} y={26} width={188} height={284} fill={`rgba(255,${200 - 40 * sunset},${140 - 60 * sunset},1)`} />
            <path d={`M130 300 L 130 ${120 + 20 * Math.sin(frame / 20)}`} stroke="rgba(0,0,0,0)" />
            {/* silueta que sale, agotada */}
            <g transform={`translate(${70 + 20 * ramp(frame, fAtar, fAtar + 40)} 80)`}>
              <circle cx={50} cy={40} r={26} fill="#1A120C" />
              <path d="M18 230 C 16 140, 26 80, 50 74 C 74 80, 86 140, 84 230 Z" fill="#1A120C" transform={`rotate(${4 + Math.sin(frame / 12) * 2} 50 230)`} />
              <path d="M24 110 C 6 140, 4 170, 10 190 M 78 110 C 96 140, 98 170, 92 190" stroke="#1A120C" strokeWidth={14} strokeLinecap="round" />
            </g>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 820, top: 260, width: 960 }}>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: P.ink2 }}>Según Álvaro Mutis, salía del cuarto al atardecer</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 40 }}>
            <div style={{ transform: `scale(${0.6 + 0.4 * bellP}) rotate(${Math.sin(frame / 2) * 8 * (1 - ramp(frame, fDoce + 10, fDoce + 30))}deg)`, opacity: Math.min(1, bellP * 2) }}>
              <svg width={180} height={180} viewBox="0 0 100 100"><path d="M20 70 C 20 40, 34 22, 50 22 C 66 22, 80 40, 80 70 Z" fill="#D8A93A" stroke={P.ink} strokeWidth={4} /><rect x={14} y={70} width={72} height={10} rx={4} fill="#B88518" stroke={P.ink} strokeWidth={3} /><circle cx={50} cy={86} r={6} fill={P.ink} /><rect x={46} y={10} width={8} height={14} fill={P.ink} /></svg>
            </div>
            <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 220, color: P.ink, lineHeight: 0.9 }}>{frame >= fDoce - 4 ? <Count from={1} to={12} a={fDoce - 4} b={fDoce + 14} /> : ''}</div>
            <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 70, color: P.ink, lineHeight: 1 }}>asaltos<br /><span style={{ fontStyle: 'italic', fontWeight: 500, color: P.terra }}>de boxeo</span></div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="hdl_knock" at={fPasan} volume={0.8} />
      <Sfx name="ui_pop" at={fMut - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fFue - 2} volume={0.6} />
      <Sfx name="card_flip" at={fCap - 4} volume={0.6} />
      <Sfx name="page_turn" at={fLee - 6} volume={0.8} />
      <Sfx name="marker" at={fFuera} volume={0.7} />
      <Sfx name="hdl_bell" at={fDoce} volume={0.9} />
      <Sfx name="counter" at={fDoce - 4} volume={0.3} dur={18} fade={4} />
    </PaperStage>
  );
};

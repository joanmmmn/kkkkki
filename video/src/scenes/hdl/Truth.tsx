import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { F, Flight, Marker, NameCard, NightStage, P, PaperStage, ramp, rampOut, Reveal, shadow, Silhouette, sp, Stamp, Swarm, Tag } from './kit';
import { Palm } from './Icons';
import { sceneClock } from './timeline';

// ——— VERSIONES · W29 ———
// La papeleta del franqueo se multiplica en versiones: cada una con sus cifras.
export const Versiones: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VERSIONES');
  const fAntes = c.at('W29', 'Antes');
  const fGiro = c.at('W29', 'giro');
  const fVeces = c.at('W29', 'veces');
  const fIgual = c.at('W29', 'igual');
  const f82 = c.at('W29', 'ochenta');
  const f83 = c.at('W29', 'ochenta', 1);
  const f45 = c.at('W29', 'cuarenta');
  const f53 = c.at('W29', 'cincuenta');
  const cards = [
    { at: fVeces - 6, cost: '82', had: '?', x: 500, r: -8 },
    { at: fVeces + 4, cost: '83', had: '45', x: 960, r: 2 },
    { at: fVeces + 14, cost: '82', had: '53', x: 1420, r: 9 },
  ];
  const hiCost = (v: string) => (v === '82' ? ramp(frame, f82 - 4, f82 + 6) * (1 - ramp(frame, f83 - 6, f83)) : ramp(frame, f83 - 4, f83 + 6) * (1 - ramp(frame, f45 - 6, f45)));
  const hiHad = (v: string) => (v === '45' ? ramp(frame, f45 - 4, f45 + 6) * (1 - ramp(frame, f53 - 6, f53)) : v === '53' ? ramp(frame, f53 - 4, f53 + 6) : 0);
  return (
    <PaperStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 52, textAlign: 'center', fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: P.sepia, opacity: rampOut(frame, fAntes - 4, fAntes + 10) }}>Antes de terminar · un último giro</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 116, textAlign: 'center' }}>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 80, color: P.ink }}><Reveal text="La misma historia, contada de varias formas" at={fGiro - 4} step={2} /></div>
      </div>
      {cards.map((k, i) => {
        const s = sp(frame, k.at, 13, 160);
        if (frame < k.at - 2) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: k.x - 210, top: 330, width: 420, transform: `translateY(${(1 - s) * 80}px) rotate(${k.r * s}deg)`, opacity: Math.min(1, s * 2) }}>
            <div style={{ background: '#F7EBCB', padding: '26px 30px', borderRadius: 6, boxShadow: '0 20px 40px rgba(40,28,10,0.22)', fontFamily: F.type, color: P.ink }}>
              <div style={{ fontSize: 24, letterSpacing: 3, color: P.sepia }}>VERSIÓN {i + 1}</div>
              <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.4, color: P.sepia }}>El envío costaba</div>
              <div style={{ fontSize: 84, lineHeight: 1.4 }}><span style={{ background: `rgba(255,202,5,${0.9 * hiCost(k.cost)})`, padding: '0 8px' }}>${k.cost}</span></div>
              <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: P.sepia }}>Llevaban</div>
              <div style={{ fontSize: 66, lineHeight: 1.4, color: k.had === '?' ? P.sepia : P.ink }}><span style={{ background: `rgba(255,202,5,${0.9 * hiHad(k.had)})`, padding: '0 8px' }}>{k.had === '?' ? '—' : `$${k.had}`}</span></div>
            </div>
          </div>
        );
      })}
      <Tag at={fIgual - 2} x={960} y={900} size={36} align="center">Contada muchas veces, y no siempre igual</Tag>
      {cards.map((k, i) => <Sfx key={i} name="card_flip" at={k.at + 2} volume={0.6} />)}
      <Sfx name="focus" at={f82} volume={0.5} />
      <Sfx name="focus" at={f83} volume={0.5} />
      <Sfx name="focus" at={f45} volume={0.5} />
      <Sfx name="focus" at={f53} volume={0.5} />
    </PaperStage>
  );
};

// ——— DUDAS · W30–W31 ———
export const Dudas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DUDAS');
  const fAca = c.at('W30', 'Acapulco');
  const fPlaya = c.at('W30', 'playa');
  const fPaz = c.at('W30', 'paz');
  const fBio = c.at('W30', 'biógrafo');
  const fBuena = c.at('W30', 'buena');
  const fRep = c.at('W31', 'repitió');
  const fRech = c.at('W31', 'rechazado');
  const fCarlos = c.at('W31', 'Carlos');
  const fLey = c.at('W31', 'leyó');
  const fPub = c.at('W31', 'publicada');
  const second = ramp(frame, fRep - 14, fRep + 2);
  return (
    <PaperStage>
      {/* Acapulco */}
      <AbsoluteFill style={{ opacity: 1 - second }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 72, color: P.ink, opacity: rampOut(frame, fAca - 6, fAca + 8) }}>¿Llegó o no llegó a Acapulco?</div>
        <div style={{ position: 'absolute', left: 200, top: 260, width: 680, height: 440, borderRadius: 14, overflow: 'hidden', boxShadow: shadow.card, transform: 'rotate(-3deg)', opacity: rampOut(frame, fAca, fAca + 14) }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #F7C97E 0%, #F4DDB0 50%, #7FB6C4 50%, #5E9CB0 100%)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 300, height: 140, background: '#EED9A8' }} />
          <div style={{ position: 'absolute', left: 30, top: 80 }}><Palm h={340} sway={Math.sin(frame / 25) * 3} /></div>
          <div style={{ position: 'absolute', right: 30, top: 24, fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: '#FFF6E2', textShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>Acapulco</div>
          {frame >= fPlaya + 6 && <Stamp at={fPlaya + 10} text="¿?" size={90} rot={10} round style={{ right: 60, bottom: 60 }} c={P.terra} />}
        </div>
        <div style={{ position: 'absolute', left: 980, top: 280, width: 760, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {[{ at: fAca + 6, t: 'Media vuelta en la carretera', s: 'la versión más famosa' }, { at: fPlaya - 6, t: 'Llegó a la playa', s: 'y no tuvo paz hasta volver a casa' }].map((v, i) => {
            const s = sp(frame, v.at, 14, 160);
            return (
              <div key={i} style={{ padding: '24px 30px', background: '#FFFDF7', borderRadius: 22, boxShadow: shadow.float, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 60}px)`, borderLeft: `10px solid ${i ? P.terra : P.jungle2}` }}>
                <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 48, color: P.ink }}>{v.t}</div>
                <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia, marginTop: 4 }}>{v.s}</div>
              </div>
            );
          })}
        </div>
        <NameCard at={fBio - 4} name="Dasso Saldívar" role="Biógrafo: no da por buena la media vuelta" x={980} y={720} w={800} icon={<Silhouette size={100} hair="short" />} accent={P.red} />
      </AbsoluteFill>
      {/* Seix Barral */}
      <AbsoluteFill style={{ opacity: second }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 72, color: P.ink }}>Lo que se repitió durante años</div>
        <div style={{ position: 'absolute', left: 260, top: 280, width: 640, height: 460, background: '#FBF5E6', border: `2px solid ${P.sepia}`, borderRadius: 8, boxShadow: shadow.card, padding: 40, transform: 'rotate(-2deg)', opacity: rampOut(frame, fRech - 10, fRech + 4) }}>
          <div style={{ fontFamily: F.type, fontSize: 30, color: P.sepia, letterSpacing: 2 }}>LO QUE SE CONTABA</div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 64, color: P.ink, marginTop: 40, lineHeight: 1.1 }}>Seix Barral rechazó el manuscrito</div>
          {frame >= fCarlos - 6 && <Stamp at={fCarlos - 2} text="Mito" size={110} rot={-16} style={{ left: 160, top: 250 }} />}
        </div>
        <div style={{ position: 'absolute', left: 1000, top: 330, width: 760, opacity: rampOut(frame, fCarlos - 6, fCarlos + 8) }}>
          <NameCard at={fCarlos - 4} name="Carlos Barral" role="Editor de Seix Barral" x={0} y={0} w={740} icon={<Silhouette size={100} hair="short" />} accent={P.terra} />
          <div style={{ position: 'absolute', left: 0, top: 220, width: 740, fontFamily: F.serif, fontStyle: 'italic', fontSize: 52, lineHeight: 1.2, color: P.ink, opacity: rampOut(frame, fLey - 6, fLey + 8) }}>
            No la leyó hasta que <Marker at={fPub}>ya estaba publicada</Marker>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="card_flip" at={fAca + 6} volume={0.6} />
      <Sfx name="card_flip" at={fPlaya - 4} volume={0.6} />
      <Sfx name="stamp" at={fPlaya + 10} volume={0.6} />
      <Sfx name="ui_pop" at={fBio - 2} volume={0.6} />
      <Sfx name="fail" at={fBuena} volume={0.4} />
      <Sfx name="page_turn" at={fRep - 12} volume={0.6} />
      <Sfx name="stamp" at={fCarlos - 2} volume={0.9} />
      <Sfx name="marker" at={fPub} volume={0.6} />
    </PaperStage>
  );
};

// ——— MACONDO · W32 ———
export const Macondo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MACONDO');
  const fExa = c.at('W32', 'Exageró');
  const fProb = c.at('W32', 'Probablemente');
  const fSent = c.at('W32', 'sentido');
  const fInv = c.at('W32', 'inventó');
  const fMac = c.at('W32', 'Macondo');
  const fVida = c.at('W32', 'vida');
  const fInc = c.at('W32', 'increíble');
  const fNor = c.at('W32', 'normal');
  const q = ramp(frame, fInv - 16, fInv - 2);
  return (
    <NightStage lamp={[960, 460]} warm={1.2}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 1 - q }}>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 130, color: '#F6EFE2' }}><Reveal text="¿Exageró Gabo?" at={fExa - 4} step={4} /></div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 70, color: P.yellow, marginTop: 20, opacity: rampOut(frame, fProb - 4, fProb + 10) }}>Probablemente, un poco.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: q }}>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 34, letterSpacing: 8, textTransform: 'uppercase', color: 'rgba(246,239,226,0.7)', opacity: rampOut(frame, fInv - 6, fInv + 8) }}>El hombre que inventó</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 230, color: P.yellow, lineHeight: 1.05, textShadow: '0 0 60px rgba(255,202,5,0.35)' }}>
          <Reveal text="Macondo" at={fMac - 4} dy={40} />
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 56, color: '#F6EFE2', marginTop: 20, opacity: rampOut(frame, fVida - 6, fVida + 8) }}>contaba su vida como su novela:</div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 56, color: '#F6EFE2', marginTop: 10, opacity: rampOut(frame, fInc - 6, fInc + 8) }}>lo increíble, como lo más normal del mundo</div>
      </AbsoluteFill>
      <Swarm n={22} from={[960, 1180]} a={fMac - 20} dur={180} size={60} seed="mac" glow={0.7} to={[960, 470]} />
      <Flight pts={[[-100, 300], [600, 200], [1300, 360], [2050, 140]]} a={0} b={200} size={70} seed="mc1" glow={0.6} />
      <Sfx name="hit_soft" at={fExa} volume={0.4} />
      <Sfx name="shimmer" at={fMac - 4} volume={0.7} />
      <Sfx name="hdl_flutter" at={fMac} volume={1} />
      <Sfx name="sparkle" at={fNor} volume={0.5} />
    </NightStage>
  );
};

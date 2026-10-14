import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Count, F, P, Page, PaperStage, ramp, rampOut, shadow, sp, Stamp, Tag, Swarm } from './kit';
import { sceneClock } from './timeline';

// ——— PORRÚA · W23–W24 ———
export const Porrua: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('PORRUA');
  const fNec = c.at('W23', 'necesitó');
  const fDec = c.at('W23', 'decidida');
  const fLin = c.at('W23', 'línea');
  const fPar = c.at('W23', 'párrafo');
  const fApu = c.at('W24', 'apuesta');
  const fMil = c.at('W24', 'mil');
  const fOcho = c.at('W24', 'ocho');
  const fImp = c.at('W24', 'imprimir');
  const fMayo = c.at('W24', 'mayo');
  const fLib = c.at('W24', 'librerías');
  const fJun = c.at('W24', 'junio');
  const pageOut = ramp(frame, fApu - 14, fApu + 2);
  const barsOut = ramp(frame, fImp - 12, fImp + 4);
  const b1 = interpolate(frame, [fMil - 4, fMil + 16], [0, 1], { ...clamp, easing: easeOut });
  const b8 = interpolate(frame, [fOcho - 4, fOcho + 26], [0, 1], { ...clamp, easing: easeOut });
  const pressRun = frame > fImp - 4;
  return (
    <PaperStage>
      {/* La primera página */}
      <AbsoluteFill style={{ opacity: 1 - pageOut }}>
        <div style={{ position: 'absolute', left: 300, top: 120 }}>
          <Page w={620} h={820} lines={20} seed="porrua" hi={0} hiP={ramp(frame, fLin - 4, fLin + 12)} style={{ transform: 'rotate(-1.5deg)' }} />
          {/* corchete del primer párrafo */}
          <svg width={60} height={260} style={{ position: 'absolute', left: -60, top: 60, opacity: rampOut(frame, fPar - 4, fPar + 8) }}>
            <path d="M50 10 L 20 10 L 20 250 L 50 250" stroke={P.terra} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - ramp(frame, fPar - 4, fPar + 14))} />
          </svg>
          {frame >= fDec - 6 && <Stamp at={fDec - 2} text="Se publica" size={70} rot={-14} style={{ left: 120, top: 520 }} />}
        </div>
        <div style={{ position: 'absolute', left: 1040, top: 280, width: 760 }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 64, lineHeight: 1.12, color: P.ink, opacity: rampOut(frame, fNec - 4, fNec + 12) }}>No necesitó llegar al final</div>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 48, lineHeight: 1.2, color: P.ink2, marginTop: 30, opacity: rampOut(frame, fLin - 6, fLin + 10) }}>La decidió desde la primera línea, en el primer párrafo</div>
          <div style={{ marginTop: 26, fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia, opacity: rampOut(frame, fPar + 6, fPar + 20) }}>— Francisco Porrúa, según contó después</div>
        </div>
      </AbsoluteFill>
      {/* La apuesta: 1.000 frente a 8.000 */}
      <AbsoluteFill style={{ opacity: pageOut * (1 - barsOut) }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 76, color: P.ink }}>Una apuesta enorme</div>
        {[{ l: 'Lo que vendía', v: 1000, p: b1, c: P.sepia }, { l: 'Primera tirada', v: 8000, p: b8, c: P.terra }].map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: 360 + i * 700, bottom: 200, width: 360, textAlign: 'center' }}>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 70, color: P.ink, opacity: b.p }}><Count to={b.v} a={i ? fOcho - 4 : fMil - 4} b={i ? fOcho + 26 : fMil + 16} /></div>
            <div style={{ margin: '14px auto 0', width: 200, height: 520 * (b.v / 8000) * b.p, background: b.c, borderRadius: '12px 12px 0 0', border: `3px solid ${P.ink}` }} />
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 32, color: P.sepia, marginTop: 14 }}>{b.l}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 1180, top: 330, fontFamily: F.serif, fontWeight: 700, fontSize: 120, color: P.terra, opacity: rampOut(frame, fOcho + 24, fOcho + 36), transform: `rotate(-6deg)` }}>×8</div>
      </AbsoluteFill>
      {/* Imprenta → librerías */}
      <AbsoluteFill style={{ opacity: barsOut }}>
        {/* rodillos */}
        <div style={{ position: 'absolute', left: 160, top: 300, width: 760, height: 420, background: '#3B3E44', borderRadius: 30, border: `5px solid ${P.ink}`, boxShadow: shadow.card }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ position: 'absolute', left: 120 + k * 300, top: 120, width: 220, height: 220, borderRadius: '50%', background: '#6E737B', border: `5px solid ${P.ink}`, transform: `rotate(${pressRun ? frame * (k ? -8 : 8) : 0}deg)` }}>
              {[0, 45, 90, 135].map((a) => <div key={a} style={{ position: 'absolute', left: 105, top: 0, width: 10, height: 220, background: '#4A4E55', transform: `rotate(${a}deg)` }} />)}
            </div>
          ))}
        </div>
        {/* pliegos que salen */}
        {pressRun && Array.from({ length: 10 }).map((_, i) => {
          const a = fImp + i * 7;
          const u = interpolate(frame, [a, a + 40], [0, 1], clamp);
          if (u <= 0 || u >= 1) return null;
          return <div key={i} style={{ position: 'absolute', left: 860 + u * 360, top: 480 - Math.sin(u * Math.PI) * 120, width: 180, height: 240, background: '#FBF7EE', boxShadow: '0 8px 14px rgba(0,0,0,0.2)', transform: `rotate(${(u - 0.5) * 40}deg)` }} />;
        })}
        {frame >= fMayo - 6 && <Stamp at={fMayo - 2} text="Mayo 1967" sub="Buenos Aires" size={58} rot={-8} style={{ left: 300, top: 180 }} />}
        {/* escaparate */}
        <div style={{ position: 'absolute', left: 1250, top: 260, width: 520, height: 560, background: '#2F4F4A', borderRadius: '20px 20px 0 0', border: `6px solid ${P.ink}`, opacity: rampOut(frame, fLib - 8, fLib + 8) }}>
          <div style={{ height: 90, background: P.terra, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 44, color: '#FFF1D6', borderRadius: '14px 14px 0 0' }}>LIBRERÍA</div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 120, bottom: 30, background: 'rgba(255,236,190,0.18)', border: '4px solid #1D2F2B', display: 'flex', flexWrap: 'wrap', gap: 10, padding: 18, alignContent: 'flex-end' }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const s = sp(frame, fLib + i * 2, 13, 180);
              return <div key={i} style={{ width: 66, height: 96, background: [P.yellow, P.terra, '#F4EFE6'][i % 3], border: `3px solid ${P.ink}`, borderRadius: 4, transform: `translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 2) }} />;
            })}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1250, top: 860, width: 520, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 52, color: P.ink, opacity: rampOut(frame, fJun - 4, fJun + 10) }}>Junio de 1967</div>
      </AbsoluteFill>
      <Sfx name="marker" at={fLin - 2} volume={0.6} />
      <Sfx name="draw" at={fPar - 4} volume={0.6} />
      <Sfx name="stamp" at={fDec - 2} volume={0.9} />
      <Sfx name="whoosh_soft" at={fApu - 10} volume={0.5} />
      <Sfx name="counter" at={fOcho - 4} volume={0.4} dur={30} fade={6} />
      <Sfx name="hit_soft" at={fOcho + 26} volume={0.6} />
      <Sfx name="hdl_press" at={fImp - 4} volume={0.9} dur={fLib - fImp + 10} fade={20} />
      <Sfx name="stamp" at={fMayo - 2} volume={0.6} />
      <Sfx name="sk_book_slide" at={fLib + 4} volume={0.5} />
    </PaperStage>
  );
};

// ——— AGOTADO · W25 ———
export const Agotado: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AGOTADO');
  const fAgo = c.at('W25', 'agota');
  const fCua = c.at('W25', 'cuatro');
  const fCuar = c.at('W25', 'cuarenta');
  const fTres = c.at('W25', 'tres');
  const fMed = c.at('W25', 'medio');
  const big = ramp(frame, fTres - 8, fTres + 6);
  return (
    <PaperStage>
      <AbsoluteFill style={{ opacity: 1 - big }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: F.serif, fontWeight: 600, fontSize: 72, color: P.ink, opacity: rampOut(frame, fAgo - 6, fAgo + 8) }}>Se agota en pocas semanas</div>
        {frame >= fAgo + 4 && <Stamp at={fAgo + 8} text="Agotado" size={90} rot={-12} style={{ left: 1300, top: 220 }} />}
        <div style={{ position: 'absolute', left: 260, bottom: 200, display: 'flex', gap: 60, alignItems: 'flex-end' }}>
          {[8000, 10000, 12000, 12000].map((v, i) => {
            const s = sp(frame, fCua - 4 + i * 6, 13, 170);
            return (
              <div key={i} style={{ textAlign: 'center', opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 60}px)` }}>
                <div style={{ width: 220, height: 60 + i * 10, background: [P.terra, P.jungle, '#1F4E79', P.yellowDeep][i], border: `3px solid ${P.ink}`, borderRadius: 8, backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 4px, rgba(0,0,0,0) 4px 12px)' }} />
                <div style={{ marginTop: 14, fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: P.ink }}>{i + 1}.ª edición</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 1360, top: 520, textAlign: 'left', opacity: rampOut(frame, fCuar - 8, fCuar + 6) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 96, color: P.ink }}>+<Count to={42000} a={fCuar - 4} b={fCuar + 22} /></div>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 40, color: P.sepia }}>ejemplares en 1967</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: big, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 36, letterSpacing: 8, textTransform: 'uppercase', color: P.sepia }}>En tres años</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 260, color: P.ink, lineHeight: 1 }}>+<Count from={42000} to={500000} a={fTres} b={fMed + 26} /></div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 60, color: P.terra }}>más de medio millón de ejemplares</div>
      </AbsoluteFill>
      <Swarm n={10} from={[960, 620]} a={fMed + 20} dur={120} size={50} seed="agot" />
      <Sfx name="stamp" at={fAgo + 8} volume={0.9} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="sk_book_thud" at={fCua - 2 + i * 6} volume={0.3} />)}
      <Sfx name="counter" at={fCuar - 4} volume={0.35} dur={26} fade={6} />
      <Sfx name="counter" at={fTres} volume={0.35} dur={fMed + 26 - fTres} fade={8} />
      <Sfx name="success" at={fMed + 30} volume={0.6} />
      <Sfx name="hdl_flutter" at={fMed + 24} volume={0.6} />
    </PaperStage>
  );
};

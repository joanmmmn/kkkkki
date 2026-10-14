import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, F, Flight, Marker, P, PaperStage, pathAt, QuoteCard, ramp, rampOut, Reveal, sp, Stamp, Swarm, Tag } from './kit';
import { Car60, IceBlock, Palm } from './Icons';
import { AmericasMap, AM_PTS, MapPin, useMapCam } from './Maps';
import { sceneClock } from './timeline';

// ——— CARRETERA · W08 ———
// Paisaje en capas (cielo de tarde, sierras, palmeras) con el coche de la familia en marcha; con «de golpe» el cielo se
// abre y aparecen las imágenes de la primera frase: un coronel, el pelotón y el hielo, que brilla.
const Mountains: React.FC<{ y: number; c: string; off: number; amp: number; seed: string; h?: number }> = ({ y, c, off, amp, seed, h = 500 }) => {
  const W = 4200;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 120) {
    const r = random(`${seed}${Math.floor(x / 120)}`);
    pts.push(`${x} ${y - amp * (0.4 + 0.6 * Math.abs(Math.sin(x / 520 + r * 2))) - r * amp * 0.3}`);
  }
  return (
    <svg width={W} height={1080} style={{ position: 'absolute', left: -((off % 2100) + 2100) % 2100, top: 0 }}>
      <path d={`M0 1080 L ${pts.join(' L ')} L ${W} 1080 Z`} fill={c} />
    </svg>
  );
};
export const Carretera: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CARRETERA');
  const fFam = c.at('W08', 'familia');
  const fAca = c.at('W08', 'Acapulco');
  const fGol = c.at('W08', 'golpe');
  const fCor = c.at('W08', 'coronel');
  const fPel = c.at('W08', 'pelotón');
  const fRec = c.at('W08', 'recuerda');
  const fPad = c.at('W08', 'padre');
  const fHie = c.at('W08', 'hielo');
  const speed = 9;
  const t = frame * speed;
  const vision = ramp(frame, fGol - 4, fGol + 18);
  const carX = 760 + Math.sin(frame / 60) * 20;
  const bump = Math.sin(frame / 3.1) * 1.6;
  const iceP = sp(frame, fHie - 4, 12, 120);
  const sign = interpolate(frame, [fAca - 30, fAca + 90], [2100, -500], clamp);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(180deg, ${'#F4C98A'} 0%, #F7DDB0 40%, #EFD6A8 60%)` }}>
      {/* sol */}
      <div style={{ position: 'absolute', left: 1380, top: 140, width: 220, height: 220, borderRadius: '50%', background: '#FBE7B5', boxShadow: '0 0 140px 60px rgba(255,214,140,0.55)' }} />
      <Mountains y={640} c="#C9A27A" off={t * 0.12} amp={220} seed="m1" />
      <Mountains y={720} c="#9C7C5C" off={t * 0.25} amp={180} seed="m2" />
      <Mountains y={800} c="#5E7A55" off={t * 0.45} amp={120} seed="m3" />
      {/* palmeras lejanas */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = ((i * 520 - t * 0.7) % 4160 + 4160) % 4160 - 300;
        return <div key={i} style={{ position: 'absolute', left: x, top: 560 + (i % 2) * 40 }}><Palm h={300 - (i % 3) * 30} sway={Math.sin(frame / 25 + i) * 3} c={P.jungle} /></div>;
      })}
      {/* carretera */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860, height: 220, background: '#4A4540' }}>
        <div style={{ position: 'absolute', left: -200, top: 100, width: 2400, height: 10, backgroundImage: 'repeating-linear-gradient(90deg, #F2E3B6 0 80px, rgba(0,0,0,0) 80px 160px)', transform: `translateX(${-(t % 160)}px)` }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 852, height: 10, background: '#7A6A55' }} />
      {/* señal */}
      <div style={{ position: 'absolute', left: sign, top: 600 }}>
        <div style={{ position: 'absolute', left: 120, top: 120, width: 12, height: 160, background: '#5A4A3A' }} />
        <div style={{ width: 260, padding: '16px 18px', background: '#1F6B4A', border: '5px solid #F4EFE6', borderRadius: 10, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: '#fff', textAlign: 'center' }}>Acapulco ➜</div>
      </div>
      {/* coche */}
      <div style={{ position: 'absolute', left: carX, top: 712 + bump }}><Car60 w={460} wheel={frame * 14} /></div>
      {/* visión */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 32%, rgba(255,250,236,${0.95 * vision}) 0%, rgba(255,244,214,${0.75 * vision}) 45%, rgba(255,244,214,${0.15 * vision}) 80%)` }} />
      {vision > 0 && (
        <AbsoluteFill style={{ opacity: vision }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: 8, color: P.sepia, textTransform: 'uppercase' }}>El arranque de la novela</div>
          {[{ at: fCor, t: 'un coronel', x: 330, y: 200 }, { at: fPel, t: 'un pelotón de fusilamiento', x: 960, y: 290 }, { at: fRec, t: 'un recuerdo de infancia', x: 1580, y: 200 }].map((w, i) => {
            const p = sp(frame, w.at - 4, 14, 150);
            return (
              <div key={i} style={{ position: 'absolute', left: w.x, top: w.y, transform: `translate(-50%, ${(1 - p) * 30}px)`, opacity: Math.min(1, p * 2) * (1 - 0.5 * ramp(frame, fHie - 6, fHie + 10)),
                fontFamily: F.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 60, color: P.ink, whiteSpace: 'nowrap' }}>{w.t}</div>
            );
          })}
          <div style={{ position: 'absolute', left: 960 - 160, top: 380, transform: `scale(${0.4 + 0.6 * iceP})`, opacity: Math.min(1, iceP * 2), transformOrigin: '50% 60%' }}>
            <IceBlock s={320} glow={0.8 + 0.2 * Math.sin(frame / 8)} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 54, color: P.ink, opacity: rampOut(frame, fPad - 4, fPad + 12) }}>
            <Marker at={fHie + 2}>la tarde en que conoció el hielo</Marker>
          </div>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = fHie + i * 2;
            if (frame < a) return null;
            const r = (k: string) => random(`spk${i}${k}`);
            const ang = r('a') * Math.PI * 2;
            const d = 140 + r('d') * 220 * rampOut(frame, a, a + 30);
            return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(ang) * d, top: 540 + Math.sin(ang) * d * 0.7, width: 8, height: 8, background: '#DFF7FF', transform: 'rotate(45deg)', opacity: 1 - ramp(frame, a + 20, a + 40), boxShadow: '0 0 12px #BFEFFF' }} />;
          })}
        </AbsoluteFill>
      )}
      <Tag at={fFam - 4} x={120} y={110} size={38} out={fGol - 8}>1965 · de Ciudad de México a Acapulco</Tag>
      <Sfx name="hdl_car" at={0} volume={0.9} dur={c.dur} fade={40} />
      <Sfx name="riser" at={fGol - 34} volume={0.6} />
      <Sfx name="shimmer" at={fGol} volume={0.7} />
      <Sfx name="ui_pop" at={fCor - 2} volume={0.5} />
      <Sfx name="ui_pop" at={fPel - 2} volume={0.5} />
      <Sfx name="ui_pop" at={fRec - 2} volume={0.5} />
      <Sfx name="hdl_ice" at={fHie} volume={1} />
    </AbsoluteFill>
  );
};

// ——— ABUELA · W09 ———
// El porche de noche, la mecedora de la abuela, y de su relato salen cosas increíbles (mariposas, flores, una alfombra)
// mientras el texto dice que lo cuenta como si fuera normal.
export const Abuela: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ABUELA');
  const fNat = c.at('W09', 'naturalidad');
  const fAbu = c.at('W09', 'abuela');
  const fInc = c.at('W09', 'increíbles');
  const fNor = c.at('W09', 'normal');
  const rock = Math.sin(frame / 22) * 5;
  const items = [
    { k: 'flor', at: fInc - 6 }, { k: 'mariposa', at: fInc }, { k: 'alfombra', at: fInc + 6 }, { k: 'flor', at: fInc + 12 }, { k: 'estrella', at: fInc + 18 }, { k: 'mariposa', at: fInc + 24 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, #2A4652 0%, #172833 60%, #0D171D 100%)`, overflow: 'hidden' }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const r = (k: string) => random(`star${i}${k}`);
        return <div key={i} style={{ position: 'absolute', left: r('x') * 1920, top: r('y') * 560, width: 2 + r('s') * 3, height: 2 + r('s') * 3, borderRadius: '50%', background: '#FFF6DA', opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / (20 + r('t') * 30) + r('p') * 6)) }} />;
      })}
      {/* porche */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, bottom: 0, background: '#3B2A1E' }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', left: 120 + i * 260, top: 300, width: 26, height: 530, background: '#4A3626' }} />)}
      <div style={{ position: 'absolute', left: 80, top: 280, width: 900, height: 40, background: '#5A4230' }} />
      {/* lámpara de queroseno */}
      <div style={{ position: 'absolute', left: 860, top: 640, width: 60, height: 90, borderRadius: '30px 30px 8px 8px', background: 'rgba(255,214,140,0.9)', boxShadow: '0 0 120px 60px rgba(255,190,100,0.35)' }} />
      {/* mecedora y abuela (silueta) */}
      <div style={{ position: 'absolute', left: 360, top: 470, transform: `rotate(${rock}deg)`, transformOrigin: '50% 100%' }}>
        <svg width={380} height={380} viewBox="0 0 380 380">
          <path d="M60 360 C 140 380, 260 380, 330 350" stroke="#1B120C" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M100 350 L 110 60 M 270 350 L 280 120" stroke="#1B120C" strokeWidth={14} strokeLinecap="round" />
          <path d="M110 230 L 290 230" stroke="#1B120C" strokeWidth={12} />
          <path d="M150 230 C 140 160, 150 120, 190 110 C 230 100, 250 140, 245 230 Z" fill="#0E0A07" />
          <circle cx={196} cy={84} r={34} fill="#0E0A07" />
          <circle cx={214} cy={62} r={16} fill="#0E0A07" />
          <path d="M160 230 C 170 290, 230 300, 260 330" stroke="#0E0A07" strokeWidth={40} strokeLinecap="round" fill="none" />
        </svg>
      </div>
      {/* lo increíble que sale del relato */}
      {items.map((it, i) => {
        if (frame < it.at) return null;
        const u = interpolate(frame, [it.at, it.at + 140], [0, 1], clamp);
        const [x, y] = pathAt([[600, 520], [700 + i * 40, 360], [900 + i * 70, 200 + (i % 2) * 60], [1100 + i * 90, 40]], u);
        if (it.k === 'mariposa') return <Butterfly key={i} x={x} y={y} size={56} seed={`ab${i}`} glow={0.6} />;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, transform: `rotate(${frame * (i % 2 ? 2 : -2)}deg)`, opacity: 1 - ramp(frame, it.at + 100, it.at + 140) }}>
            {it.k === 'flor' && <svg viewBox="0 0 60 60" width={60} height={60}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={30} cy={16} rx={8} ry={14} fill={P.yellow} transform={`rotate(${a} 30 30)`} />)}<circle cx={30} cy={30} r={7} fill={P.terra} /></svg>}
            {it.k === 'estrella' && <svg viewBox="0 0 60 60" width={60} height={60}><path d="M30 4 L 37 22 L 56 23 L 41 35 L 46 54 L 30 43 L 14 54 L 19 35 L 4 23 L 23 22 Z" fill="#FFF0B8" /></svg>}
            {it.k === 'alfombra' && <svg viewBox="0 0 80 40" width={90} height={45}><path d={`M4 ${20 + Math.sin(frame / 5) * 5} Q 40 ${10 + Math.sin(frame / 5 + 1) * 6} 76 ${20 + Math.sin(frame / 5 + 2) * 5} L 76 ${30 + Math.sin(frame / 5 + 2) * 5} Q 40 ${20 + Math.sin(frame / 5 + 1) * 6} 4 ${30 + Math.sin(frame / 5) * 5} Z`} fill={P.terra} stroke="#F2D27A" strokeWidth={2} /></svg>}
          </div>
        );
      })}
      {/* texto */}
      <div style={{ position: 'absolute', left: 1080, top: 380, width: 760 }}>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 76, color: '#F6EFE2', lineHeight: 1.08 }}>
          <Reveal text="Lo increíble," at={fInc - 4} />
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 60, color: 'rgba(246,239,226,0.85)', lineHeight: 1.15, marginTop: 10 }}>
          <Reveal text="contado como lo más normal del mundo" at={fNor - 14} step={2} />
        </div>
        <div style={{ marginTop: 26, width: 520 * ramp(frame, fNor, fNor + 20), height: 4, background: P.yellow }} />
      </div>
      <Tag at={fAbu - 4} x={330} y={360} size={36} out={fInc + 30}>La voz de su abuela</Tag>
      <Sfx name="hdl_flutter" at={fInc + 2} volume={0.8} />
      <Sfx name="sparkle" at={fInc - 4} volume={0.6} />
      <Sfx name="hit_soft" at={fNor + 2} volume={0.5} />
    </AbsoluteFill>
  );
};

// ——— VUELTA · W10 ———
// Mapa del sur de México: la ruta de Ciudad de México a Acapulco, el coche da media vuelta y vuelve; la cita
// «Nunca llegué a Acapulco» queda marcada con un clip amarillo («volveremos sobre ella»).
export const Vuelta: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VUELTA');
  const fVer = c.at('W10', 'versión');
  const fMedia = c.at('W10', 'media');
  const fVolv = c.at('W10', 'volvió');
  const fRes = c.at('W10', 'resumió');
  const fNun = c.at('W10', 'Nunca');
  const fQued = c.at('W10', 'Quédate');
  const fVolver = c.at('W10', 'volveremos');
  const mx = AM_PTS.mexico, ac = AM_PTS.acapulco;
  const mid: [number, number] = [(mx[0] + ac[0]) / 2, (mx[1] + ac[1]) / 2];
  const cam = useMapCam([
    { f: 0, cx: mid[0], cy: mid[1], s: 9 },
    { f: fRes, cx: mid[0], cy: mid[1], s: 9.4 },
    { f: fNun + 10, cx: mid[0] + 30, cy: mid[1] + 4, s: 7.5 },
  ]);
  const A = cam.toScreen(mx), B = cam.toScreen(ac);
  // ruta con curvas
  const route: [number, number][] = [A, [A[0] + 80, A[1] + 110], [A[0] - 40, A[1] + 220], [(A[0] + B[0]) / 2 + 60, (A[1] + B[1]) / 2 + 40], [B[0] - 30, B[1] - 90], B];
  const go = interpolate(frame, [fVer - 10, fMedia], [0, 0.55], { ...clamp, easing: easeInOut });
  const back = interpolate(frame, [fMedia + 8, fVolv + 16], [0.55, 0], { ...clamp, easing: easeInOut });
  const u = frame < fMedia + 8 ? go : back;
  const [x, y] = pathAt(route, u);
  const [x2, y2] = pathAt(route, Math.min(1, u + 0.01));
  const dir = frame < fMedia + 8 ? 1 : -1;
  const ang = (Math.atan2((y2 - y) * dir, (x2 - x) * dir) * 180) / Math.PI;
  const turn = ramp(frame, fMedia - 2, fMedia + 10);
  const quoteOn = rampOut(frame, fNun - 8, fNun + 6);
  const routeD = route.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  return (
    <PaperStage>
      <AbsoluteFill style={{ filter: quoteOn > 0 ? `blur(${(quoteOn * 5).toFixed(1)}px)` : undefined, opacity: 1 - 0.62 * quoteOn }}>
        <AmericasMap transform={cam.transform} fill={{ Mexico: '#EFD9A6' }} sea="rgba(156,194,207,0.3)" />
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={routeD} stroke="#8C7A60" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d={routeD} stroke={P.terra} strokeWidth={6} fill="none" strokeDasharray="18 14" strokeLinecap="round" opacity={rampOut(frame, 0, 20)} />
        </svg>
        <MapPin x={A[0]} y={A[1]} at={6} label="Ciudad de México" side="left" c={P.jungle} />
        <MapPin x={B[0]} y={B[1]} at={14} label="Acapulco" />
        {frame > fMedia + 20 && <Stamp at={fMedia + 24} text="✕" size={70} rot={0} round style={{ left: B[0] - 50, top: B[1] - 130 }} />}
        {/* coche (vista superior simplificada) */}
        <div style={{ position: 'absolute', left: x - 40, top: y - 22, width: 80, height: 44, transform: `rotate(${ang + 180 * 0 * turn}deg)` }}>
          <div style={{ width: 80, height: 44, background: '#3E7C8C', border: `3px solid ${P.ink}`, borderRadius: 14, boxShadow: '0 8px 14px rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'absolute', left: 44, top: 8, width: 20, height: 28, background: '#CFE6EC', borderRadius: 4 }} />
          </div>
        </div>
        <Tag at={fVer - 6} x={120} y={110} size={36} out={fNun - 10}>La versión más famosa</Tag>
        <Tag at={fMedia + 4} x={B[0] + 120} y={B[1] - 260} size={40} accent={P.terra} out={fNun - 10}>Media vuelta</Tag>
      </AbsoluteFill>
      <QuoteCard text="Nunca llegué a Acapulco." at={fNun} who="Gabriel García Márquez" size={96} w={1300} style={{ left: 310, top: 300 }} />
      {/* clip amarillo: «volveremos sobre ella» */}
      {frame >= fQued - 4 && (
        <div style={{ position: 'absolute', left: 1480, top: 250, transform: `translateY(${(1 - sp(frame, fQued - 4, 12, 200)) * -120}px) rotate(12deg)` }}>
          <svg width={90} height={200} viewBox="0 0 90 200"><path d="M30 190 L 30 40 C 30 10, 70 10, 70 40 L 70 160 C 70 180, 45 180, 45 160 L 45 60" stroke={P.yellowDeep} strokeWidth={10} fill="none" strokeLinecap="round" /></svg>
        </div>
      )}
      <Tag at={fVolver - 4} x={1520} y={480} size={34} dark>Volveremos sobre ella</Tag>
      <Sfx name="hdl_car" at={fVer - 10} volume={0.6} dur={fVolv + 20 - fVer} fade={20} />
      <Sfx name="hdl_uturn" at={fMedia + 6} volume={1} />
      <Sfx name="stamp" at={fMedia + 24} volume={0.5} />
      <Sfx name="whoosh_soft" at={fNun - 8} volume={0.6} />
      <Sfx name="snap_in" at={fQued + 4} volume={0.8} />
    </PaperStage>
  );
};

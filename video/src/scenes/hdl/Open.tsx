import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, Keystrokes } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { Butterfly, Cam, Count, F, Flight, NightStage, P, PostalScale, ramp, rampOut, Reveal, SERIES, Silhouette, sp, Stack, Stamp, Swarm, Tag, Typed, typeTimes } from './kit';
import { sceneClock } from './timeline';

// ——— Mostrador de la oficina de correos (noche, 1966) ———
const Counter: React.FC<{ y?: number }> = ({ y = 880 }) => (
  <>
    <div style={{ position: 'absolute', left: -40, right: -40, top: y, height: 1080 - y + 40, background: 'linear-gradient(180deg, #6A4428 0%, #4A2E1A 40%, #2E1C10 100%)', boxShadow: '0 -10px 40px rgba(0,0,0,0.35)' }} />
    <div style={{ position: 'absolute', left: -40, right: -40, top: y, height: 14, background: '#8A5C38', borderBottom: '2px solid #2A180C' }} />
    {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: i * 230 - 20, top: y + 40, width: 2, height: 200, background: 'rgba(0,0,0,0.25)' }} />)}
  </>
);
// Ventanilla con reja de latón y rótulo esmaltado.
const Window: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
  <div style={{ position: 'absolute', left: 1080, top: 120, width: 640, height: 700 }}>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 0, height: 92, background: '#1F4E79', border: '6px solid #E9E2D0', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.serif, fontWeight: 700, fontSize: 56, letterSpacing: 10, color: '#F4EFE6', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>CORREOS</div>
    <div style={{ position: 'absolute', left: 40, right: 40, top: 140, bottom: 0, borderRadius: '260px 260px 0 0', background: `radial-gradient(ellipse at 50% 40%, rgba(255,214,140,${0.35 * glow}) 0%, rgba(60,40,20,0.9) 75%)`, border: '14px solid #B08A3E', overflow: 'hidden' }}>
      {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 34 + i * 62, top: 0, bottom: 0, width: 6, background: '#C9A24E', boxShadow: '2px 0 0 rgba(0,0,0,0.3)' }} />)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 210, height: 8, background: '#C9A24E' }} />
    </div>
  </div>
);

const WallClock: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const sec = Math.floor(t / 50);
  return (
    <svg width={190} height={190} viewBox="0 0 100 100" style={{ position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.45))' }}>
      <circle cx={50} cy={50} r={46} fill="#E9E0CC" stroke="#3A2A1A" strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={50} y1={10} x2={50} y2={16} stroke={P.ink} strokeWidth={2.5} transform={`rotate(${i * 30} 50 50)`} />)}
      <line x1={50} y1={50} x2={50} y2={28} stroke={P.ink} strokeWidth={4} strokeLinecap="round" transform="rotate(255 50 50)" />
      <line x1={50} y1={50} x2={50} y2={18} stroke={P.ink} strokeWidth={2.5} strokeLinecap="round" transform="rotate(48 50 50)" />
      <line x1={50} y1={54} x2={50} y2={16} stroke={P.red} strokeWidth={1.2} transform={`rotate(${120 + sec * 6} 50 50)`} />
      <circle cx={50} cy={50} r={3} fill={P.ink} />
    </svg>
  );
};
const WallCalendar: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 220, height: 250, background: '#F3EAD6', borderRadius: 6, boxShadow: '0 14px 26px rgba(0,0,0,0.45)', overflow: 'hidden', transform: 'rotate(-2deg)' }}>
    <div style={{ height: 70, background: P.red, color: '#fff', fontFamily: F.serif, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 2 }}>AGOSTO</div>
    <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 96, color: P.ink, textAlign: 'center', lineHeight: 1.3 }}>1966</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, padding: '0 16px' }}>
      {Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ height: 6, background: 'rgba(29,26,22,0.25)', borderRadius: 2 }} />)}
    </div>
  </div>
);
const Lamp: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: 'absolute', left: x - 70, top: -40 }}>
    <div style={{ position: 'absolute', left: 68, top: 0, width: 4, height: 70, background: '#1A1A1A' }} />
    <div style={{ position: 'absolute', left: 0, top: 66, width: 140, height: 56, background: '#2F4F4A', borderRadius: '70px 70px 8px 8px', border: '3px solid #10201D' }} />
    <div style={{ position: 'absolute', left: 50, top: 112, width: 40, height: 18, borderRadius: '0 0 20px 20px', background: '#FFE6A0', boxShadow: '0 0 40px 18px rgba(255,214,140,0.55)' }} />
  </div>
);

// ——— HOOK · W01–W03 ———
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const fAgo = c.at('W01', 'Agosto');
  const fOfi = c.at('W01', 'oficina');
  const fHom = c.at('W02', 'hombre');
  const fBas = c.at('W02', 'báscula');
  const fPaq = c.at('W02', 'paquete');
  const fSeis = c.at('W02', 'seiscientas');
  const fCuen = c.at('W02', 'cuenta');
  const fOch = c.at('W02', 'ochenta');
  const fLleg = c.at('W03', 'llega');
  const fLoc = c.at('W03', 'locura');
  const fAbr = c.at('W03', 'abren');
  const fPar = c.at('W03', 'parten');
  const fEnv = c.at('W03', 'envían');
  const fParte = c.at('W03', 'parte', 1);
  // Pila: cae al plato con «paquete»
  const drop = sp(frame, fPaq - 6, 11, 180);
  const stackY = interpolate(drop, [0, 1], [-520, 0]);
  const needle = frame < fPaq ? -120 : -120 + 150 * sp(frame, fPaq + 2, 6, 90);
  const platY = frame < fPaq ? 0 : 10 * sp(frame, fPaq, 6, 120);
  // Separación de la pila en dos y salida de una mitad envuelta
  const split = rampOut(frame, fPar, fPar + 18);
  const wrap = ramp(frame, fEnv - 14, fEnv + 4);
  const out = ramp(frame, fEnv + 6, fParte + 22, (t) => t * t);
  const cam = [
    { f: 0, s: 1.25, x: -40, y: 140 },
    { f: fHom - 6, s: 1.12, x: 30, y: 60 },
    { f: fCuen, s: 1.05, x: -60, y: 20 },
    { f: fAbr - 10, s: 1.08, x: 80, y: 10 },
    { f: c.dur, s: 1.16, x: 120, y: 20 },
  ];
  const date = 'Ciudad de México · agosto de 1966';
  const dA = fAgo - 6, dB = fAgo + 40;
  const coins = interpolate(frame, [fCuen + 10, fLleg + 4], [0, 0.62], { ...clamp, easing: easeOut });
  const short = rampOut(frame, fLleg, fLleg + 10);
  return (
    <NightStage lamp={[1000, 260]}>
      <Cam keys={cam}>
        <WallClock x={110} y={170} t={frame} />
        <WallCalendar x={360} y={130} />
        <Lamp x={960} />
        <Window glow={1} />
        <Counter />
        {/* La pareja (siluetas genéricas, a contraluz) */}
        <div style={{ position: 'absolute', left: -60, top: 300, opacity: rampOut(frame, fHom - 10, fHom + 16), transform: `translateX(${(1 - rampOut(frame, fHom - 10, fHom + 16)) * -60}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 40 }}><Silhouette size={560} c="#0B1216" hair="short" /></div>
          <div style={{ position: 'absolute', left: 300, top: 120 }}><Silhouette size={500} c="#101A20" hair="long" /></div>
        </div>
        {/* Báscula con la pila */}
        <PostalScale x={820} y={430} needle={needle} size={0.92} platY={platY}>
          {frame >= fPaq - 8 && (
            <div style={{ position: 'absolute', left: 0, top: stackY }}>
              <Stack w={300} thick={130 * (1 - split * 0.5)} x={-split * 190} y={0} />
              {split > 0 && (
                <div style={{ position: 'absolute', left: out * 640, top: -out * 60, opacity: 1 - ramp(frame, fParte + 14, fParte + 24), transform: `scale(${1 - 0.35 * out})` }}>
                  <Stack w={300} thick={65} x={split * 190} y={0} wrapped={wrap} string={wrap} />
                  {frame >= fParte - 6 && <Stamp at={fParte - 2} text="1 de 2" size={40} rot={-10} style={{ left: split * 190 - 100, top: -150 }} />}
                </div>
              )}
            </div>
          )}
        </PostalScale>
        <Tag at={fSeis - 4} x={360} y={330} size={38} out={fCuen + 10}>≈ 600 páginas a máquina</Tag>
        {/* Papeleta del franqueo */}
        <div style={{ position: 'absolute', left: 1240, top: 560, width: 440, transform: `rotate(${3 - 3 * sp(frame, fCuen - 4)}deg) translateY(${(1 - sp(frame, fCuen - 4)) * 80}px)`, opacity: rampOut(frame, fCuen - 6, fCuen + 6) }}>
          <div style={{ background: '#F7EBCB', padding: '24px 30px', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', fontFamily: F.type, color: P.ink }}>
            <div style={{ fontSize: 26, letterSpacing: 3, color: P.sepia }}>FRANQUEO</div>
            <div style={{ fontSize: 96, lineHeight: 1.4, marginTop: 4 }}>{frame >= fOch - 2 ? <Count from={0} to={82} a={fOch - 2} b={fOch + 16} prefix="$" /> : '$ —'}</div>
            <div style={{ fontSize: 24, color: P.sepia }}>pesos mexicanos</div>
            {/* monedas que no llegan */}
            <div style={{ marginTop: 20, height: 18, borderRadius: 9, background: 'rgba(0,0,0,0.12)', overflow: 'hidden', opacity: rampOut(frame, fCuen + 8, fCuen + 20) }}>
              <div style={{ width: `${coins * 100}%`, height: '100%', background: short > 0 ? P.red : P.jungle2, borderRadius: 9 }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: P.red, opacity: short }}>No les llega</div>
          </div>
        </div>
      </Cam>
      {/* Fecha tecleada */}
      <div style={{ position: 'absolute', left: 90, top: 70, fontSize: 44, color: '#F3E9D6', opacity: 1 - ramp(frame, fHom + 40, fHom + 60) }}>
        <Typed text={date} a={dA} b={dB} caretColor="#F3E9D6" />
      </div>
      <Keystrokes text={date} times={typeTimes(date, dA, dB)} volume={0.55} seed="hk" />
      <Sfx name="hdl_stack" at={fPaq + 2} volume={1} />
      <Sfx name="hdl_scale" at={fPaq + 3} volume={0.9} />
      <Sfx name="pop" at={fSeis - 2} volume={0.5} />
      <Sfx name="hdl_register" at={fOch} volume={0.7} />
      <Sfx name="coins" at={fCuen + 12} volume={0.6} />
      <Sfx name="fail" at={fLleg + 2} volume={0.6} />
      <Sfx name="hdl_split" at={fPar} volume={1} />
      <Sfx name="hdl_wrap" at={fEnv - 12} volume={0.8} />
      <Sfx name="stamp" at={fParte - 2} volume={0.9} />
      <Sfx name="whoosh_soft" at={fParte + 8} volume={0.6} />
      {fOfi > 0 && null}
      {fLoc > 0 && null}
    </NightStage>
  );
};

// ——— LEGACY · W04 ———
// La mitad que queda en la báscula brilla; de la pila salen mariposas amarillas, los libros se apilan y el contador
// sube; aparece el título y la cámara se aleja hasta la oficina de correos, que se apaga.
export const Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('LEGACY');
  const fMan = c.at('W04', 'manuscrito');
  const fVend = c.at('W04', 'vendidas');
  const fHist = c.at('W04', 'historia', 1);
  const fNac = c.at('W04', 'nació');
  const fCerca = c.at('W04', 'cerca');
  const fOfi = c.at('W04', 'oficina');
  const books = 9;
  const rise = (i: number) => sp(frame, fVend - 8 + i * 4, 13, 170);
  const titleP = rampOut(frame, fNac - 6, fNac + 20);
  const dim = ramp(frame, fCerca, fOfi + 30);
  const cam = [
    { f: 0, s: 1.1, x: 0, y: 30 },
    { f: fVend, s: 1, x: 0, y: 0 },
    { f: fCerca, s: 1, x: 0, y: 0 },
    { f: c.dur, s: 0.86, x: 0, y: -20 },
  ];
  const palette = [P.jungle, P.terra, '#1F4E79', P.yellowDeep, P.jungle2, '#7A2E3A', P.sepia, '#2F4F4A', P.terra];
  return (
    <NightStage lamp={[960, 420]} warm={1 + 0.4 * titleP - 0.6 * dim}>
      <Cam keys={cam}>
        {/* pila partida que se recompone */}
        <div style={{ position: 'absolute', left: 960, top: 820, opacity: 1 - ramp(frame, fVend - 10, fVend + 10) }}>
          <Stack w={340} thick={70} x={-ramp(frame, fMan, fMan + 20) * 0 - 110 * (1 - ramp(frame, fMan + 10, fMan + 34))} y={0} />
          <Stack w={340} thick={70} x={110 * (1 - ramp(frame, fMan + 10, fMan + 34))} y={-70 * ramp(frame, fMan + 10, fMan + 34)} />
        </div>
        {/* torre de libros */}
        {Array.from({ length: books }).map((_, i) => {
          const p = rise(i);
          if (frame < fVend - 10 + i * 4) return null;
          const w = 420 - (i % 3) * 30 + random(`lw${i}`) * 30;
          return (
            <div key={i} style={{ position: 'absolute', left: 960 - w / 2 + (random(`lx${i}`) - 0.5) * 40, top: 840 - (i + 1) * 46 - (1 - p) * 300, width: w, height: 44, opacity: Math.min(1, p * 2),
              background: palette[i], border: `3px solid ${P.ink}`, borderRadius: 6, transform: `rotate(${(random(`lr${i}`) - 0.5) * 4}deg)`, boxShadow: '0 8px 16px rgba(0,0,0,0.35)' }}>
              <div style={{ position: 'absolute', left: 18, right: 18, top: 16, height: 4, background: 'rgba(255,255,255,0.35)' }} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', opacity: rampOut(frame, fVend, fVend + 14) * (1 - titleP) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 120, color: '#F6EFE2', letterSpacing: -3 }}><Count to={50} a={fVend} b={fVend + 50} prefix="+" /> millones</div>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: 'rgba(246,239,226,0.75)', marginTop: 4 }}>de ejemplares vendidos</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: titleP * (1 - dim * 0.4) }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 168, color: '#F6EFE2', letterSpacing: -2, lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <Reveal text="Cien años de soledad" at={fNac - 4} step={4} dy={30} />
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, color: P.yellow, marginTop: 18, opacity: rampOut(frame, fNac + 18, fNac + 34) }}>Gabriel García Márquez · 1967</div>
        </div>
      </Cam>
      <Swarm n={16} from={[960, 700]} a={fNac - 10} dur={170} size={58} seed="leg" glow={0.6} />
      <AbsoluteFill style={{ background: '#05080A', opacity: dim * 0.55 }} />
      <Sfx name="hdl_stack" at={fMan + 30} volume={0.6} />
      {Array.from({ length: books }).map((_, i) => <Sfx key={i} name="sk_book_thud" at={fVend - 8 + i * 4 + 6} volume={0.18} />)}
      <Sfx name="counter" at={fVend} volume={0.4} dur={50} fade={10} />
      <Sfx name="hdl_flutter" at={fNac + 4} volume={1} />
      <Sfx name="hdl_ice" at={fNac} volume={0.6} />
    </NightStage>
  );
};

// ——— TITLE · cabecera de la serie ———
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const a = 6;
  const p = rampOut(frame, a, a + 22);
  const l = ramp(frame, a + 10, a + 40, easeOut);
  return (
    <NightStage lamp={[960, 500]} warm={1.3}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
          <LogoIcon size={58} />
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 32, letterSpacing: 9, color: 'rgba(246,239,226,0.8)', textTransform: 'uppercase' }}>SonorBooks presenta</div>
        </div>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 138, color: '#F6EFE2', marginTop: 34, letterSpacing: -1 }}>
          <Reveal text={SERIES} at={a + 6} step={4} />
        </div>
        <div style={{ width: 640 * l, height: 3, background: P.yellow, marginTop: 34 }} />
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 52, color: P.yellow, marginTop: 26, opacity: rampOut(frame, a + 30, a + 50) }}>Episodio 1 · Cien años de soledad</div>
      </AbsoluteFill>
      <Flight pts={[[-120, 800], [500, 560], [1300, 700], [2050, 380]]} a={0} b={220} size={84} seed="t1" glow={0.8} />
      <Flight pts={[[2050, 900], [1500, 760], [900, 860], [-120, 640]]} a={20} b={230} size={64} seed="t2" glow={0.6} />
      <Sfx name="logo_sting" at={a + 4} volume={0.9} />
      <Sfx name="hdl_flutter" at={30} volume={0.8} />
    </NightStage>
  );
};
export const _o = { Butterfly, interpolate, easeInOut };

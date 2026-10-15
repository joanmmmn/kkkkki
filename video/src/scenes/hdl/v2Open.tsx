import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, F, P, sp, ramp, rampOut, SERIES, Stack } from './kit';
import { LogoIcon } from '../../components/Logo';
import { sceneClock } from './timeline';
import { Hand, handAt, Halo, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, Slate, tw, useCamera, walkPose, WritingHand } from './theatre';
import { Car60, CREAM, Counter, HangLamp, HangSign, MailSack, Manuscript, PostOffice, ScaleSide, Skyline, StreetLamp, Volcano, WallClock, WARM } from './sets';

// ——— HOOK v2 · W01–W03 ———
// A · La calle: Ciudad de México de noche, la oficina de correos encendida, pasa un coche; la cámara entra por la puerta.
// B · Dentro, de perfil: entran él y ella, dejan el paquete en la báscula; la cámara se acerca a las casi 600 páginas.
// C · Plano de detalle: el empleado escribe la cuenta a lápiz: «$ 82.00».
// D · Plano de detalle: las monedas sobre el mostrador; el lápiz las cuenta y se para. No les llega.
// E · De perfil otra vez: se miran, desatan el cordel, parten la pila; el empleado envuelve una mitad, la sella y la
//     echa a la saca. La cámara la sigue hasta la oscuridad (de ahí sale LEGACY).

const NIGHT_INK = '#0C141B';
const ROOM_INK = '#170F0A';

export const Hook2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const fAgo = c.at('W01', 'Agosto');
  const fOfi = c.at('W01', 'oficina');
  const fHom = c.at('W02', 'hombre');
  const fMuj = c.at('W02', 'mujer');
  const fBas = c.at('W02', 'báscula');
  const fPaq = c.at('W02', 'paquete');
  const fSeis = c.at('W02', 'seiscientas');
  const fMaq = c.at('W02', 'máquina');
  const fEmp = c.at('W02', 'empleado');
  const fCuen = c.at('W02', 'cuenta');
  const fOch = c.at('W02', 'ochenta');
  const fPes = c.at('W02', 'pesos');
  const fNo = c.part('W03');
  const fLleg = c.at('W03', 'llega');
  const fAsi = c.at('W03', 'Así');
  const fLoc = c.at('W03', 'locura');
  const fAbr = c.at('W03', 'abren');
  const fPar = c.at('W03', 'parten');
  const fMit = c.at('W03', 'mitad');
  const fEnv = c.at('W03', 'envían');
  const fParte = c.at('W03', 'parte', 1);
  const tB = c.part('W02') - 8;
  const tC = fEmp - 6;
  const tD = fPes + 30;
  const tE = fAsi - 4;

  let shot: React.ReactNode;
  if (frame < tB) shot = <ShotStreet tB={tB} fAgo={fAgo} fOfi={fOfi} />;
  else if (frame < tC) shot = <ShotCounter t0={tB} t1={tC} fHom={fHom} fMuj={fMuj} fBas={fBas} fPaq={fPaq} fSeis={fSeis} fMaq={fMaq} />;
  else if (frame < tD) shot = <ShotForm t0={tC} t1={tD} fCuen={fCuen} fOch={fOch} fPes={fPes} />;
  else if (frame < tE) shot = <ShotCoins t0={tD} t1={tE} fLleg={fLleg} fNo={fNo} />;
  else shot = <ShotSplit t0={tE} end={c.dur} fLoc={fLoc} fAbr={fAbr} fPar={fPar} fMit={fMit} fEnv={fEnv} fParte={fParte} />;

  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      {/* destello cálido al cruzar la puerta */}
      <AbsoluteFill style={{ background: '#FFC77A', opacity: interpolate(frame, [tB - 6, tB, tB + 10], [0, 0.7, 0], clamp) }} />
      {/* ambiente y golpes */}
      <Sfx name="hdl_city_night" at={0} volume={0.45} dur={tB + 12} fade={16} />
      <Sfx name="sk_wind" at={0} volume={0.12} dur={tB + 10} fade={14} />
      <Sfx name="hdl_car" at={14} volume={0.55} dur={200} fade={50} />
      <Sfx name="hdl_paper_whoosh" at={tB - 2} volume={0.5} />
      <Sfx name="sk_clock" at={tB + 6} volume={0.35} />
      <Sfx name="sk_clock" at={tB + 116} volume={0.25} />
      <Sfx name="hdl_stack" at={fPaq + 4} volume={0.8} />
      <Sfx name="hdl_scale" at={fPaq + 5} volume={0.9} />
      <Sfx name="page_riffle" at={fSeis + 6} volume={0.5} />
      <Sfx name="card_flip" at={tC} volume={0.4} />
      {/* el lápiz: suena mientras escribe cada línea (mismos tramos que ShotForm) y dos trazos al subrayar */}
      <Sfx name="hdl_pencil_write" at={tC + 4} volume={0.8} dur={fCuen + 16 - tC - 4} fade={6} />
      <Sfx name="hdl_pencil_write" at={fOch - 4} volume={0.95} dur={fPes + 10 - fOch} fade={6} />
      <Sfx name="hdl_pencil_line" at={fPes + 16} volume={0.8} />
      <Sfx name="hdl_pencil_line" at={fPes + 24} volume={0.6} />
      <Sfx name="coins" at={tD + 12} volume={0.8} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="hdl_pencil_tap" at={tD + 27 + i * 11} volume={0.9} dur={9} fade={3} />)}
      <Sfx name="sk_heart" at={fLleg + 4} volume={0.45} />
      <Sfx name="card_flip" at={tE} volume={0.3} />
      <Sfx name="sk_string" at={fAbr + 6} volume={0.6} />
      <Sfx name="hdl_split" at={fPar + 4} volume={0.9} />
      <Sfx name="hdl_wrap" at={fEnv - 4} volume={0.7} />
      <Sfx name="stamp" at={fParte + 4} volume={1} />
      <Sfx name="hdl_mail" at={fParte + 30} volume={0.9} />
      <Sfx name="whoosh_deep" at={fParte + 44} volume={0.5} />
    </AbsoluteFill>
  );
};

// ———————— A · La calle ————————
export const ShotStreet: React.FC<{ tB: number; fAgo: number; fOfi: number }> = ({ tB, fAgo, fOfi }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([
    { f: 0, x: 960, y: 600, s: 1.04 },
    { f: fOfi + 10, x: 960, y: 640, s: 1.22 },
    { f: tB - 24, x: 960, y: 730, s: 1.9 },
    { f: tB, x: 960, y: 760, s: 3.4, ez: 1 },
  ]);
  const carX = interpolate(frame, [18, 200], [-900, 2800], clamp);
  const walkX = interpolate(frame, [0, tB], [1330, 1060], clamp);
  const sky = '#22323F';
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#08111B'], [45, '#13253A'], [80, '#24394B'], [100, '#3A4752']]} glows={[{ x: 960, y: 980, r: 1100, c: '#E39A55', a: 0.2 }, { x: 1530, y: 170, r: 260, c: '#F3EBD8', a: 0.22 }]} />
      <Layer z={0.05}>
        <circle cx={1530} cy={170} r={44} fill="#F1E7CF" opacity={0.95} />
        <circle cx={1546} cy={160} r={42} fill="#1A2C3E" opacity={0.18} />
        {Array.from({ length: 70 }).map((_, i) => (
          <circle key={i} cx={random(`st${i}`) * 1920} cy={random(`sy${i}`) * 520} r={0.8 + random(`sr${i}`) * 1.6} fill="#F3EAD6" opacity={(0.25 + random(`so${i}`) * 0.6) * (0.6 + 0.4 * Math.sin(frame / (20 + i % 9) + i))} />
        ))}
      </Layer>
      <Layer z={0.12}>
        <Volcano x={330} y={860} w={900} h={300} c={mix(sky, '#0B1520', 0.15)} snow="#3E5163" />
        <Volcano x={720} y={860} w={700} h={210} c={mix(sky, '#0B1520', 0.1)} snow="#3A4C5D" />
      </Layer>
      <Layer z={0.28}>
        <Skyline y={880} c="#162533" frame={frame} seed="mx" tower={1660} />
      </Layer>
      <Layer z={0.6}>
        <PostOffice c="#0F1820" frame={frame} sign={0.85 + 0.15 * Math.sin(frame / 6)} />
        {/* luz que sale de los arcos a la acera */}
        {[470, 670, 960, 1250, 1450].map((x, i) => <path key={i} d={`M ${x - 80} 872 L ${x + 80} 872 L ${x + 130} 960 L ${x - 130} 960 Z`} fill={WARM} opacity={0.12} />)}
        <rect x={-400} y={872} width={2720} height={400} fill="#0A1117" />
        {/* paseante */}
        <Person x={walkX} y={874} scale={0.95} face={-1} kind="man" hair="side" pose={walkPose(walkX / 22, 0.9)} c={NIGHT_INK} back="#17222B" />
      </Layer>
      <Layer z={1}>
        <rect x={-600} y={958} width={3120} height={300} fill="#070C10" />
        <rect x={-600} y={952} width={3120} height={8} fill="#1A242C" />
        <StreetLamp x={190} y={960} c="#060A0D" h={620} flick={0.92 + 0.08 * Math.sin(frame / 3.1)} />
        <StreetLamp x={1760} y={960} c="#060A0D" h={600} />
      </Layer>
      <Layer z={1.45}>
        <Car60 x={carX} y={1046} c="#05080A" scale={1.25} wheel={carX * 0.8} lights={1} />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} />
      <Slate text="Ciudad de México · agosto de 1966" a={fAgo - 4} b={fAgo + 46} out={tB - 30} x={110} y={940} />
    </Rig>
  );
};

// ———————— B · El mostrador, de perfil ————————
const FLOOR = 1010;
const COUNTER_X0 = 905, COUNTER_X1 = 1125, COUNTER_TOP = 690;
const PLATE: [number, number] = [1010, 690 - 128];
const ShotCounter: React.FC<{ t0: number; t1: number; fHom: number; fMuj: number; fBas: number; fPaq: number; fSeis: number; fMaq: number }> = ({ t0, t1, fHom, fMuj, fBas, fPaq, fSeis, fMaq }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([
    { f: t0, x: 900, y: 600, s: 1.28 },
    { f: fBas - 10, x: 930, y: 610, s: 1.12 },
    { f: fPaq + 20, x: 960, y: 600, s: 1.18 },
    { f: fSeis + 6, x: 1000, y: 580, s: 1.95 },
    { f: t1, x: 1010, y: 570, s: 2.15 },
  ]);
  // él: entra caminando y deja el paquete en la báscula
  const manX = interpolate(frame, [t0, fMuj + 30], [300, 770], { ...clamp, easing: easeOut });
  const walking = frame < fMuj + 26;
  const ph = manX / 30;
  const reach = ramp(frame, fBas - 12, fPaq + 2);
  const back = ramp(frame, fPaq + 8, fPaq + 30);
  const manPose: Pose = walking
    ? { ...walkPose(ph, interpolate(frame, [fMuj, fMuj + 26], [1, 0.2], clamp)), shF: interpolate(reach, [0, 1], [-20, 72]) * (1 - back) + 6 * back, elF: interpolate(reach, [0, 1], [70, 18]) * (1 - back) + 12 * back }
    : { lean: 3 + 4 * reach * (1 - back), shF: interpolate(reach, [0, 1], [-18, 72]) * (1 - back) + 6 * back, elF: interpolate(reach, [0, 1], [72, 18]) * (1 - back) + 12 * back, shB: -6, elB: 10, hipF: 4, hipB: -4, knF: 2, knB: 2 };
  const herX = interpolate(frame, [t0 + 6, fMuj + 40], [40, 560], { ...clamp, easing: easeOut });
  const herWalk = frame < fMuj + 36;
  const herPose: Pose = herWalk ? walkPose(herX / 26, interpolate(frame, [fMuj + 10, fMuj + 36], [1, 0.2], clamp)) : { shF: 14, elF: 40, shB: -4, elB: 20, neck: 4 };
  // el paquete: en la mano hasta que llega al plato
  const hand = handAt(manX, FLOOR, 2.9, 1, 'man', manPose);
  const land = sp(frame, fPaq - 2, 13, 190);
  const onPlate = frame >= fPaq - 2;
  const pk: [number, number] = onPlate ? [interpolate(land, [0, 1], [hand[0] + 40, PLATE[0]]), interpolate(land, [0, 1], [hand[1] - 10, PLATE[1]])] : [hand[0] + 40, hand[1] - 10];
  const needle = !onPlate ? -118 : -118 + 140 * sp(frame, fPaq + 2, 5, 70);
  const plate = onPlate ? 5 * sp(frame, fPaq, 6, 120) : 0;
  const lift = ramp(frame, fSeis - 2, fSeis + 14) * (1 - ramp(frame, fMaq + 10, fMaq + 26));
  return (
    <Rig cam={cam}>
      <Room frame={frame} />
      <Layer z={1}>
        <Person x={1290} y={FLOOR} scale={2.75} face={-1} kind="man" hair="visor" pose={{ lean: 6, shF: 26, elF: 34 + 6 * Math.sin(frame / 40), shB: 18, elB: 40, neck: 10 }} c={ROOM_INK} back="#2A1D15" />
        <Counter x0={COUNTER_X0} x1={COUNTER_X1} top={COUNTER_TOP} floor={FLOOR} c={ROOM_INK} />
        <ScaleSide x={PLATE[0]} y={COUNTER_TOP} c={ROOM_INK} needle={needle} plate={plate} s={0.85} />
        <Person x={herX} y={FLOOR} scale={2.65} kind="woman" hair="bob" pose={herPose} c="#22160F" back="#33241A" />
        <Person x={manX} y={FLOOR} scale={2.9} kind="man" hair="curly" mustache pose={manPose} c={ROOM_INK} back="#2C1F17" />
        <Manuscript x={pk[0]} y={pk[1] + (onPlate ? plate : 0)} w={150} h={40} string={1} lift={lift} c={ROOM_INK} tilt={onPlate ? 0 : -4} />
      </Layer>
      <Layer z={1.35}>
        <rect x={-300} y={150} width={330} height={1100} fill="#0B0705" />
        <rect x={20} y={150} width={14} height={1100} fill="#1E140E" />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.62} warm={0.6} />
      <Slate text="casi 600 páginas a máquina" a={fSeis + 4} b={fSeis + 40} out={t1 - 14} x={1060} y={250} size={36} />
    </Rig>
  );
};

// La sala de correos (fondo, lámpara, cartel). Compartida por los planos B y E.
export const Room: React.FC<{ frame: number; lamp?: number; swing?: number }> = ({ frame, lamp = 1, swing = 0 }) => (
  <>
    <Sky stops={[[0, '#21170F'], [55, '#3B2A1E'], [100, '#1A120C']]} glows={[{ x: 1000, y: 330, r: 900, c: '#FFC27A', a: 0.33 * lamp }]} />
    <Layer z={0.5}>
      {/* ventana con rejas a la noche */}
      <rect x={70} y={170} width={230} height={330} fill="#1B2E40" />
      <Halo x={200} y={230} r={160} c="#9DB7CC" a={0.25} />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={80 + i * 38} y={170} width={7} height={330} fill="#130D09" />)}
      <rect x={60} y={160} width={250} height={14} fill="#130D09" />
      <rect x={60} y={496} width={250} height={14} fill="#130D09" />
      {/* zócalo */}
      <rect x={-200} y={640} width={2400} height={500} fill="#1E150F" />
      <rect x={-200} y={634} width={2400} height={8} fill="#2B1F16" />
      {/* avisos y reloj */}
      <WallClock x={470} y={300} r={52} c="#130D09" t={frame} face="#E9DCC0" />
      <g transform="translate(600 230) rotate(-2)">
        <rect width={140} height={170} fill="#E8DABD" />
        <rect width={140} height={40} fill="#A8342C" />
        <text x={70} y={29} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={22} fill="#F8EEDB" letterSpacing={2}>AGOSTO</text>
        <text x={70} y={112} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={56} fill="#2A1E16">1966</text>
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={14 + (i % 6) * 19} y={128 + Math.floor(i / 6) * 14} width={13} height={6} fill="#2A1E16" opacity={0.35} />)}
      </g>
      {[1540, 1700].map((x, i) => (
        <g key={i} transform={`translate(${x} ${250 + i * 26}) rotate(${i ? 3 : -2})`}>
          <rect width={130} height={170} fill="#D9C8A6" opacity={0.85} />
          {Array.from({ length: 7 }).map((_, k) => <rect key={k} x={16} y={22 + k * 19} width={k === 0 ? 98 : 70 + random(`pst${i}${k}`) * 30} height={k === 0 ? 10 : 5} fill="#3A2A1E" opacity={0.5} />)}
        </g>
      ))}
    </Layer>
    <Layer z={0.85}>
      <HangLamp x={1000} y={0} cord={260} c="#120C08" on={lamp} swing={swing} len={760} />
      <HangSign x={1420} y={360} c="#130D09" text="FRANQUEO" w={300} ink="#E9D9B8" />
    </Layer>
    <Layer z={1}>
      <rect x={-400} y={FLOOR} width={2800} height={300} fill="#0E0906" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-400 + i * 100} y={FLOOR} width={3} height={300} fill="#1A110B" />)}
      {/* motas en el haz */}
      {Array.from({ length: 26 }).map((_, i) => {
        const r = (k: string) => random(`rm${i}${k}`);
        const x = 700 + r('x') * 600 + Math.sin(frame / (40 + r('p') * 30) + i) * 20;
        const y = 300 + ((r('y') * 600 + frame * (0.2 + r('v') * 0.4)) % 600);
        return <circle key={i} cx={x} cy={y} r={1.2 + r('s') * 2} fill="#FFE0A8" opacity={0.35 + r('o') * 0.4} />;
      })}
    </Layer>
  </>
);

// ———————— C · La cuenta a lápiz ————————
const Wood: React.FC<{ glowX?: number; glowY?: number }> = ({ glowX = 900, glowY = 380 }) => (
  <>
    <Sky stops={[[0, '#3D2615'], [100, '#24150B']]} angle={170} glows={[{ x: glowX, y: glowY, r: 1000, c: '#FFC27A', a: 0.38 }]} />
    <Layer z={1}>
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M -100 ${i * 54 + 10} C 400 ${i * 54 + 30 + random(`wg${i}`) * 20}, 1200 ${i * 54 - 10}, 2100 ${i * 54 + 14}`} stroke="#1C0F07" strokeWidth={1.5 + random(`ww${i}`) * 2} opacity={0.35} fill="none" />
      ))}
    </Layer>
  </>
);

const Written: React.FC<{ text: string; x: number; y: number; a: number; b: number; size?: number; font?: string; c?: string }> = ({ text, x, y, a, b, size = 64, font = '"Caveat", cursive', c = '#3B3A44' }) => {
  const frame = useCurrentFrame();
  const p = tw(frame, a, b, 0, 1, (t) => t);
  if (frame < a) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: font, fontWeight: 700, fontSize: size, color: c, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)` }}>{text}</div>
  );
};

const ShotForm: React.FC<{ t0: number; t1: number; fCuen: number; fOch: number; fPes: number }> = ({ t0, t1, fCuen, fOch, fPes }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([
    { f: t0, x: 960, y: 560, s: 1.02 },
    { f: fOch - 6, x: 1000, y: 600, s: 1.12 },
    { f: t1, x: 1060, y: 650, s: 1.3 },
  ], 0.6);
  // el lápiz sigue lo que se escribe
  const w1a = t0 + 4, w1b = fCuen + 16;
  const w2a = fOch - 4, w2b = fPes + 6;
  const ul = ramp(frame, fPes + 10, fPes + 22);
  let px = 760, py = 470;
  if (frame >= w1a && frame <= w1b) { px = 770 + tw(frame, w1a, w1b, 0, 1, (t) => t) * 560; py = 470 + Math.sin(frame * 1.9) * 6; }
  else if (frame > w1b && frame < w2a) { px = interpolate(frame, [w1b, w2a], [1330, 780], { ...clamp, easing: easeInOut }); py = interpolate(frame, [w1b, w2a], [470, 640], clamp); }
  else if (frame >= w2a && frame <= w2b) { px = 780 + tw(frame, w2a, w2b, 0, 1, (t) => t) * 340; py = 640 + Math.sin(frame * 2.1) * 7; }
  else if (frame > w2b) { px = 760 + ul * 340; py = 690 - ul * 14 + (frame > fPes + 18 ? 14 : 0); }
  return (
    <Rig cam={cam}>
      <Wood />
      <Layer z={1} html>
        <div style={{ position: 'absolute', left: 520, top: 250, width: 920, height: 620, transform: 'rotate(-2.5deg)', background: '#EFE3C8', boxShadow: '0 30px 60px rgba(20,10,4,0.55)' }}>
          <div style={{ position: 'absolute', left: 50, top: 36, fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 40, letterSpacing: 14, color: '#5A2A22' }}>FRANQUEO</div>
          <div style={{ position: 'absolute', left: 50, top: 92, right: 50, height: 2, background: '#5A2A22', opacity: 0.6 }} />
          {[['DESTINO', 200], ['IMPORTE', 380]].map(([l, y]) => (
            <React.Fragment key={l as string}>
              <div style={{ position: 'absolute', left: 50, top: (y as number) - 4, fontFamily: '"Special Elite", monospace', fontSize: 22, color: '#5A2A22', letterSpacing: 3 }}>{l}</div>
              <div style={{ position: 'absolute', left: 230, right: 50, top: (y as number) + 30, height: 2, background: '#5A2A22', opacity: 0.35 }} />
            </React.Fragment>
          ))}
          <Written text="Buenos Aires, Argentina" x={240} y={160} a={w1a} b={w1b} />
          <Written text="$ 82.00" x={240} y={318} a={w2a} b={w2b} size={110} />
          <div style={{ position: 'absolute', left: 236, top: 446, width: 340 * ul, height: 6, background: '#3B3A44', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: 236, top: 460, width: 340 * ramp(frame, fPes + 18, fPes + 28), height: 5, background: '#3B3A44', borderRadius: 3 }} />
        </div>
      </Layer>
      <Layer z={1.08}>
        {/* la mano del empleado escribe con el lápiz */}
        <WritingHand x={px - 4} y={py + 50} ang={-38} scale={1.15} c="#120B07" sleeve="#24180F" />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.8} />
    </Rig>
  );
};

// ———————— D · Las monedas ————————
const Coin: React.FC<{ x: number; y: number; r?: number; at: number; seed: string; spin?: boolean }> = ({ x, y, r = 46, at, seed, spin = false }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = sp(frame, at, 9, 170);
  const s = interpolate(p, [0, 1], [1.8, 1]);
  const sq = spin ? Math.abs(Math.cos((frame - at) / (2 + (frame - at) * 0.05))) * (1 - ramp(frame, at + 10, at + 46)) + ramp(frame, at + 10, at + 46) : 1;
  const rot = random(`${seed}r`) * 360;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * sq} ${s})`} opacity={Math.min(1, p * 3)}>
      <circle r={r + 4} cy={6} fill="#120A05" opacity={0.45} />
      <circle r={r} fill="#C9C3B2" />
      <circle r={r - 6} fill="none" stroke="#8F8A7C" strokeWidth={3} />
      <circle r={r * 0.45} fill="none" stroke="#A7A193" strokeWidth={2} />
      <path d={`M ${-r * 0.5} ${-r * 0.55} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.5} ${-r * 0.55}`} stroke="#EFEAE0" strokeWidth={4} fill="none" opacity={0.7} />
    </g>
  );
};

const ShotCoins: React.FC<{ t0: number; t1: number; fLleg: number; fNo: number }> = ({ t0, t1, fLleg, fNo }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.1 }, { f: t1, x: 930, y: 580, s: 1.24 }], 0.5);
  const handIn = sp(frame, t0, 16, 120);
  const open = ramp(frame, t0 + 8, t0 + 16);
  const handOut = ramp(frame, fLleg + 18, t1, easeInOut);
  const coins: [number, number, number][] = [[820, 600, 0], [930, 650, 2], [1010, 580, 4], [760, 700, 5], [880, 740, 7]];
  const T0 = t0 + 24, TS = 11;
  const tapI = Math.max(-1, Math.min(3, Math.floor((frame - T0) / TS)));
  const target = tapI >= 0 ? coins[tapI] : coins[0];
  const tapDown = tapI >= 0 && frame < T0 + 4 * TS ? interpolate((frame - T0) % TS, [0, 3, TS], [1, 0, 1]) : 1;
  const pencilAway = ramp(frame, fNo + 10, fNo + 34);
  return (
    <Rig cam={cam}>
      <Wood glowX={980} glowY={420} />
      <Layer z={1} html>
        {/* el recibo de 82 pesos, arriba a la derecha */}
        <div style={{ position: 'absolute', left: 1230, top: 150, width: 560, height: 360, transform: 'rotate(4deg)', background: '#EFE3C8', boxShadow: '0 24px 50px rgba(20,10,4,0.5)' }}>
          <div style={{ position: 'absolute', left: 36, top: 26, fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#5A2A22' }}>FRANQUEO</div>
          <div style={{ position: 'absolute', left: 36, top: 120, fontFamily: '"Special Elite", monospace', fontSize: 18, color: '#5A2A22', letterSpacing: 3 }}>IMPORTE</div>
          <div style={{ position: 'absolute', left: 170, top: 82, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 104, color: '#3B3A44' }}>$ 82.00</div>
          <div style={{ position: 'absolute', left: 166, top: 206, width: 330, height: 6, background: '#3B3A44', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: 166, top: 220, width: 330, height: 5, background: '#3B3A44', borderRadius: 3 }} />
        </div>
      </Layer>
      <Layer z={1}>
        {/* un billete doblado */}
        {frame > t0 + 14 && (
          <g transform={`translate(${700 + 30 * sp(frame, t0 + 14)} ${560}) rotate(-12)`} opacity={rampOut(frame, t0 + 14, t0 + 20)}>
            <rect x={-130} y={-62} width={260} height={124} fill="#7F8E78" />
            <rect x={-118} y={-50} width={236} height={100} fill="none" stroke="#5E6B58" strokeWidth={3} />
            <circle cx={60} cy={0} r={30} fill="none" stroke="#5E6B58" strokeWidth={3} />
            <text x={-90} y={14} fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={44} fill="#4D5947">10</text>
          </g>
        )}
        {coins.map(([x, y, d], i) => <Coin key={i} x={x} y={y} at={t0 + 12 + d} seed={`c${i}`} spin={i === 2} />)}
        {/* la mano de ella deja caer el dinero y se retira despacio */}
        <Hand x={interpolate(handIn, [0, 1], [-200, 500]) - handOut * 520} y={760 - handOut * 60} rot={-24} scale={1.35} curl={0.6 - 0.45 * open + 0.25 * handOut} c="#120B07" sleeve="#3A2418" />
        {/* el lápiz del empleado cuenta las monedas… y se para */}
        {frame > t0 + 22 && <WritingHand x={target[0] + 4 + pencilAway * 520} y={target[1] - 6 - (1 - tapDown) * 16 - pencilAway * 380} ang={-62} scale={1.1} c="#120B07" sleeve="#24180F" />}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.65} warm={0.8} />
    </Rig>
  );
};

// ———————— E · Partir el paquete ————————
// Saca de correos colgada de su bastidor, con la boca abierta (la cámara entra en ella al final).
const HangingSack: React.FC<{ x: number; mouth: number; c: string }> = ({ x, mouth, c }) => (
  <g>
    <rect x={x - 120} y={mouth - 40} width={12} height={FLOOR - mouth + 40} fill={c} />
    <rect x={x + 108} y={mouth - 40} width={12} height={FLOOR - mouth + 40} fill={c} />
    <rect x={x - 130} y={mouth - 46} width={260} height={12} fill={c} />
    <path d={`M ${x - 100} ${mouth} C ${x - 120} ${mouth + 120}, ${x - 96} ${mouth + 250}, ${x - 40} ${mouth + 290} L ${x + 40} ${mouth + 290} C ${x + 96} ${mouth + 250}, ${x + 120} ${mouth + 120}, ${x + 100} ${mouth} Z`} fill={c} />
    <ellipse cx={x} cy={mouth} rx={100} ry={22} fill="#050302" />
    <path d={`M ${x - 100} ${mouth} A 100 22 0 0 0 ${x + 100} ${mouth}`} stroke={mix(c, '#FFE0A8', 0.25)} strokeWidth={5} fill="none" />
    <text x={x} y={mouth + 150} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={26} fill={mix(c, '#FFE0A8', 0.22)} letterSpacing={4}>CORREOS</text>
  </g>
);

const SACK_X = 1530, SACK_MOUTH = 610;
const ShotSplit: React.FC<{ t0: number; end: number; fLoc: number; fAbr: number; fPar: number; fMit: number; fEnv: number; fParte: number }> = ({ t0, end, fLoc, fAbr, fPar, fMit, fEnv, fParte }) => {
  const frame = useCurrentFrame();
  const drop = fParte + 28;
  const cam = useCamera([
    { f: t0, x: 860, y: 620, s: 1.55 },
    { f: fLoc + 10, x: 820, y: 600, s: 1.6 },
    { f: fAbr, x: 940, y: 600, s: 1.72 },
    { f: fPar + 20, x: 990, y: 590, s: 1.8 },
    { f: fParte - 4, x: 1180, y: 600, s: 1.7 },
    { f: drop + 4, x: SACK_X - 20, y: SACK_MOUTH + 30, s: 2.3 },
    { f: end, x: SACK_X, y: SACK_MOUTH + 26, s: 7.5, ez: 1 },
  ]);
  // se miran: él se gira hacia ella (giro de marioneta: escala x por 0) y vuelve
  const turn = interpolate(frame, [t0 + 4, t0 + 12, fLoc + 6, fLoc + 14], [1, -1, -1, 1], clamp);
  const manFace = turn >= 0 ? 1 : -1;
  const reach = ramp(frame, fAbr - 6, fAbr + 8) * (1 - ramp(frame, fPar + 2, fPar + 20));
  const untie = ramp(frame, fAbr + 4, fAbr + 22);
  const split = ramp(frame, fPar, fMit + 6, easeOut);
  const hold = ramp(frame, fPar + 2, fPar + 20);
  const manPose: Pose = { lean: 4 + 8 * reach + 2 * hold, shF: -6 + 76 * reach + 50 * hold, elF: 70 - 50 * reach + 60 * hold, shB: -4 + 46 * hold, elB: 10 + 70 * hold, neck: 4 * reach + 6 * hold };
  const herPose: Pose = { shF: 14, elF: 40, shB: -4, elB: 20, neck: frame < fLoc + 14 && frame > t0 + 8 ? -6 : 4 };
  // mitad de arriba: a las manos de él (se la quedan); mitad de abajo: se envía
  const manHand = handAt(770, FLOOR, 2.9, 1, 'man', manPose);
  const h1: [number, number] = [interpolate(hold, [0, 1], [PLATE[0], manHand[0] + 50]), interpolate(hold, [0, 1], [PLATE[1] - 20, manHand[1] - 4]) - Math.sin(hold * Math.PI) * 50];
  const clerkTake = ramp(frame, fEnv - 12, fEnv + 6);
  const wrap = ramp(frame, fEnv + 4, fEnv + 22);
  const stamp = interpolate(frame, [fParte - 8, fParte + 4, fParte + 10], [0, 1, 0], clamp);
  const toss = ramp(frame, fParte + 12, drop, (t) => t * t);
  const restX = 1190, restY = COUNTER_TOP - 18;
  const h2: [number, number] = [
    interpolate(clerkTake, [0, 1], [PLATE[0], restX]) + toss * (SACK_X - restX),
    interpolate(clerkTake, [0, 1], [PLATE[1], restY]) - Math.sin(toss * Math.PI) * 170 + toss * (SACK_MOUTH + 30 - restY),
  ];
  const clerkPose: Pose = { lean: 6 + 6 * clerkTake, shF: 26 + 40 * clerkTake - 30 * stamp - 60 * toss, elF: 34 - 10 * clerkTake + 50 * stamp, shB: 18 + 20 * clerkTake, elB: 40, neck: 10 };
  const needle = -118 + 140 * (1 - split * 0.5) * (1 - clerkTake) + Math.sin(frame / 2) * 3 * (1 - ramp(frame, fPar, fPar + 30)) * split;
  return (
    <Rig cam={cam}>
      <Room frame={frame} swing={Math.sin(frame / 30) * 1.2} />
      <Layer z={1}>
        <HangingSack x={SACK_X} mouth={SACK_MOUTH} c="#140C07" />
        <Person x={1290} y={FLOOR} scale={2.75} face={-1} kind="man" hair="visor" pose={clerkPose} c={ROOM_INK} back="#2A1D15" />
        <Counter x0={COUNTER_X0} x1={COUNTER_X1} top={COUNTER_TOP} floor={FLOOR} c={ROOM_INK} />
        <ScaleSide x={PLATE[0]} y={COUNTER_TOP} c={ROOM_INK} needle={needle} plate={5 * (1 - clerkTake)} s={0.85} />
        <Person x={560} y={FLOOR} scale={2.65} kind="woman" hair="bob" pose={herPose} c="#22160F" back="#33241A" />
        <g transform={`translate(770 ${FLOOR}) scale(${Math.max(0.05, Math.abs(turn))} 1) translate(-770 ${-FLOOR})`}>
          <Person x={770} y={FLOOR} scale={2.9} face={manFace} kind="man" hair="curly" mustache pose={manFace < 0 ? { shF: 6, elF: 20, neck: -4 } : manPose} c={ROOM_INK} back="#2C1F17" />
        </g>
        {/* la pila entera (antes de partirla) */}
        {split <= 0 && <Manuscript x={PLATE[0]} y={PLATE[1] + 5} w={150} h={40} string={1 - untie} lift={0} c={ROOM_INK} />}
        {/* mitad que viaja (la de abajo) */}
        {split > 0 && frame < drop + 2 && <Manuscript x={h2[0]} y={h2[1] + 5 * (1 - clerkTake)} w={150} h={20} wrap={wrap} string={wrap} c={ROOM_INK} tilt={toss * 70} />}
        {/* mitad que se queda (la de arriba), en manos de él */}
        {split > 0 && <Manuscript x={h1[0]} y={h1[1]} w={150} h={20} c={ROOM_INK} tilt={-4 * hold} />}
        {/* el cordel suelto que cae */}
        {untie > 0 && untie < 1 && <path d={`M ${PLATE[0] - 20} ${PLATE[1] - 40 + untie * 60} q 30 ${-20 + untie * 30} 60 ${10 + untie * 40}`} stroke="#5A3A1E" strokeWidth={3} fill="none" opacity={1 - untie} />}
        {/* sello */}
        {frame > fParte + 3 && frame < drop && (
          <g transform={`translate(${h2[0]} ${h2[1] - 12}) rotate(${-8 + toss * 70})`} opacity={rampOut(frame, fParte + 3, fParte + 6)}>
            <circle r={20} fill="none" stroke="#B5262B" strokeWidth={4} />
            <circle r={13} fill="none" stroke="#B5262B" strokeWidth={2} />
            <path d="M -16 -3 Q -8 -8 0 -3 T 16 -3 M -16 4 Q -8 -1 0 4 T 16 4" stroke="#B5262B" strokeWidth={2} fill="none" />
          </g>
        )}
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.62} warm={0.6} />
      <AbsoluteFill style={{ background: '#030201', opacity: ramp(frame, drop + 14, end - 4) }} />
    </Rig>
  );
};


// ——— LEGACY v2 · W04 ———
// De la oscuridad de la saca: las dos mitades del manuscrito, separadas por el corte. Se juntan, se hacen libro y los
// libros se apilan hasta formar una ciudad de libros bajo la luna (la cámara sube con ellos). De la torre más alta salen
// las mariposas amarillas y el título. «Y de lo cerca que estuvo de quedarse en aquella oficina»: la cámara baja hasta
// la fachada de correos, que se apaga.
export const PILES = Array.from({ length: 16 }).map((_, i) => {
  const r = (k: string) => random(`pile-${i}-${k}`);
  const x = -120 + i * 140 + (r('x') - 0.5) * 60;
  const n = 6 + Math.floor(r('n') * 16) + (i === 7 || i === 8 ? 12 : 0);
  return { x, n, w: 150 + r('w') * 90, d: i === 7 || i === 8 ? 0 : 6 + r('d') * 30 };
});
export const BookPile: React.FC<{ x: number; base: number; n: number; w: number; grow: number; seed: string; c: string }> = ({ x, base, n, w, grow, seed, c }) => {
  const books: React.ReactNode[] = [];
  let y = base;
  const shown = Math.floor(n * grow + 0.0001);
  for (let k = 0; k < shown; k++) {
    const r = (q: string) => random(`${seed}-${k}-${q}`);
    const h = 18 + r('h') * 20;
    const bw = w * (0.78 + r('w') * 0.3);
    const dx = (r('x') - 0.5) * 24;
    y -= h;
    books.push(
      <g key={k} transform={`translate(${x + dx} ${y}) rotate(${(r('r') - 0.5) * 4})`}>
        <rect x={-bw / 2} y={0} width={bw} height={h - 1} rx={2} fill={c} />
        <rect x={-bw / 2 + 2} y={0} width={bw - 4} height={2} fill="#3A5064" opacity={0.8} />
        <rect x={bw / 2 - 11} y={2} width={9} height={h - 5} fill="#F0DDB5" opacity={0.65 + r('p') * 0.3} />
        {r('t') > 0.55 && <rect x={-bw * 0.3} y={h * 0.38} width={bw * (0.25 + r('l') * 0.2)} height={2.5} fill="#E7C27A" opacity={0.7} />}
      </g>,
    );
  }
  return <g>{books}</g>;
};

export const Legacy2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('LEGACY');
  const fMan = c.at('W04', 'manuscrito');
  const fDos = c.at('W04', 'dos');
  const fAca = c.at('W04', 'acabaría');
  const fVend = c.at('W04', 'vendidas');
  const fEsta = c.at('W04', 'Esta');
  const fNac = c.at('W04', 'nació');
  const fCien = c.at('W04', 'Cien');
  const fY = c.at('W04', 'Y');
  const fCerca = c.at('W04', 'cerca');
  const fOfi = c.at('W04', 'oficina');
  const end = c.dur;
  // fase 1: las dos mitades
  const halves = 1 - ramp(frame, fAca + 16, fAca + 34);
  const join = ramp(frame, fDos - 4, fAca + 6);
  const book = ramp(frame, fAca + 6, fAca + 26);
  const cover = ramp(frame, fAca - 4, fAca + 8);
  // fase 2: la ciudad de libros
  const grow = (i: number) => ramp(frame, fAca + 14 + PILES[i].d, fVend + 40 + PILES[i].d * 2, easeOut);
  const cityOut = ramp(frame, fY, fCerca + 26);
  const cam = useCamera([
    { f: 0, x: 960, y: 560, s: 1.6 },
    { f: fAca + 10, x: 960, y: 580, s: 1.3 },
    { f: fVend + 20, x: 960, y: 440, s: 1.0 },
    { f: fNac, x: 960, y: 380, s: 0.98 },
    { f: fY, x: 960, y: 400, s: 1.0 },
    { f: end, x: 960, y: 640, s: 1.18 },
  ], 0.6);
  const titleP = rampOut(frame, fCien - 6, fCien + 18) * (1 - ramp(frame, fY - 12, fY + 6));
  const office = ramp(frame, fY + 4, fCerca + 26);
  const lightsOff = (k: number) => 1 - ramp(frame, fOfi - 30 + k * 8, fOfi - 24 + k * 8);
  return (
    <AbsoluteFill style={{ background: '#030201' }}>
      <Rig cam={cam}>
        <Sky stops={[[0, '#060B12'], [55, '#0F1D2C'], [100, '#1B2A37']]} glows={[{ x: 330, y: 190, r: 380, c: '#F3EBD8', a: 0.2 }, { x: 960, y: 900, r: 900, c: '#E6A35C', a: 0.12 + 0.18 * book }]} />
        <Layer z={0.1} opacity={book}>
          <circle cx={330} cy={190} r={52} fill="#F1E7CF" />
          {Array.from({ length: 90 }).map((_, i) => (
            <circle key={i} cx={random(`ls${i}`) * 1920} cy={random(`ly${i}`) * 700 - 100} r={0.8 + random(`lr${i}`) * 1.7} fill="#F3EAD6" opacity={(0.3 + random(`lo${i}`) * 0.6) * (0.6 + 0.4 * Math.sin(frame / (18 + (i % 11)) + i))} />
          ))}
        </Layer>
        {/* la ciudad de libros */}
        <Layer z={0.55} opacity={book * (1 - cityOut)}>
          {PILES.map((p, i) => i % 2 === 1 && <BookPile key={i} x={p.x} base={1030} n={p.n} w={p.w * 0.8} grow={grow(i)} seed={`pb${i}`} c="#16232F" />)}
        </Layer>
        <Layer z={0.85} opacity={book * (1 - cityOut)}>
          {PILES.map((p, i) => i % 2 === 0 && <BookPile key={i} x={p.x} base={1090} n={p.n} w={p.w} grow={grow(i)} seed={`pa${i}`} c="#0B131B" />)}
        </Layer>
        {/* la fachada de correos que vuelve y se apaga */}
        <Layer z={0.7} opacity={office}>
          <g transform="translate(0 120)">
            <PostOffice c="#0F1820" frame={frame} sign={lightsOff(5) * (0.85 + 0.15 * Math.sin(frame / 3))} glass={Math.min(lightsOff(0), lightsOff(2))} />
            <rect x={-400} y={872} width={2720} height={400} fill="#0A1117" />
          </g>
        </Layer>
        {/* las dos mitades (la que se envió, envuelta y sellada) que se juntan */}
        <Layer z={1} opacity={halves} html>
          <div style={{ position: 'absolute', left: 960 - 520, top: 560 - 520, width: 1040, height: 1040, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,213,138,0.35) 0%, rgba(255,213,138,0) 62%)' }} />
          <div style={{ position: 'absolute', left: 960, top: 690 }}>
            <Stack w={330} thick={58} x={-200 * (1 - join)} y={0} shadowK={0.8} />
            <Stack w={330} thick={58} x={200 * (1 - join)} y={-58 * join} wrapped={1 - join} string={1 - join} shadowK={0.8} />
            {/* el manuscrito se hace libro */}
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: cover }}><Stack w={340} thick={116} x={0} y={0} cover="#1E2A33" shadowK={0.8} /></div>
            <div style={{ position: 'absolute', left: 200 * (1 - join) - 40, top: -150, opacity: 1 - join }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', border: '5px solid #B5262B', color: '#B5262B', fontFamily: '"Special Elite", monospace', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)', letterSpacing: 1 }}>AGO 66</div>
            </div>
          </div>
        </Layer>
      </Rig>
      {/* mariposas que salen de la torre más alta */}
      {frame > fEsta - 10 && frame < fCerca + 40 && <SwarmUp from={[960, 600]} a={fEsta - 10} n={18} />}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 210, opacity: titleP }}>
        <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 168, color: '#F6EFE2', letterSpacing: -2, lineHeight: 1, textShadow: '0 8px 50px rgba(0,0,0,0.7)' }}>Cien años de soledad</div>
        <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: 50, color: P.yellow, marginTop: 22, opacity: rampOut(frame, fCien + 24, fCien + 40) }}>Gabriel García Márquez · 1967</div>
      </AbsoluteFill>
      <PaperFinish opacity={0.45} vignette={0.65} />
      <AbsoluteFill style={{ background: '#030201', opacity: interpolate(frame, [0, 10], [1, 0], clamp) + ramp(frame, end - 16, end) }} />
      <Sfx name="hdl_split" at={fMan} volume={0.5} />
      <Sfx name="hdl_stack" at={fAca + 2} volume={0.6} />
      {PILES.map((p, i) => <Sfx key={i} name="sk_book_thud" at={Math.round(fAca + 14 + p.d + i * 3)} volume={0.12} />)}
      <Sfx name="hdl_flutter" at={fEsta} volume={1} />
      <Sfx name="sparkle" at={fCien} volume={0.6} />
      <Sfx name="hdl_lights_off" at={fOfi - 30} volume={0.7} />
    </AbsoluteFill>
  );
};

const SwarmUp: React.FC<{ from: [number, number]; a: number; n: number }> = ({ from, a, n }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`su-${i}-${k}`);
        const st = a + r('d') * 30;
        const t = (frame - st) / 50;
        if (t < 0) return null;
        const ang = -Math.PI / 2 + (r('a') - 0.5) * 2.2;
        const dist = t * (180 + r('v') * 240);
        const x = from[0] + Math.cos(ang) * dist + Math.sin(t * 3 + r('p') * 6) * 40;
        const y = from[1] + Math.sin(ang) * dist - t * t * 20;
        const size = 34 + r('s') * 34;
        return <ButterflyAt key={i} x={x} y={y} size={size} seed={`su${i}`} rot={(r('a') - 0.5) * 60} op={Math.min(1, t * 4)} />;
      })}
    </AbsoluteFill>
  );
};

// ——— TITLE v2 · cabecera de la serie ———
// Un libro cerrado en la oscuridad se abre; de sus páginas sube la luz y, con ella, el nombre de la serie y las mariposas.
export const Title2: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ramp(frame, 4, 34, easeInOut);
  const sx = 1 - 2 * open; // tapa: 1 (cerrada) → −1 (abierta a la izquierda)
  const light = ramp(frame, 18, 50);
  const kicker = rampOut(frame, 26, 44);
  const sub = rampOut(frame, 70, 92);
  const out = ramp(frame, 200, 229);
  const words = SERIES.split(' ');
  return (
    <AbsoluteFill style={{ background: '#05070A' }}>
      <Rig cam={{ x: 960, y: 540 + 30 * (1 - open), s: 1.06 - 0.06 * open + 0.03 * ramp(frame, 40, 229), r: 0 }}>
        <Sky stops={[[0, '#05070A'], [100, '#0B1118']]} glows={[{ x: 960, y: 760, r: 900, c: '#FFC97A', a: 0.35 * light }]} />
        <Layer z={1}>
          {/* luz que sube de las páginas */}
          <g opacity={light}>
            <path d="M 700 840 L 1220 840 L 1600 -40 L 320 -40 Z" fill="url(#tbeam)" />
            <defs>
              <linearGradient id="tbeam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#FFD58A" stopOpacity={0.35} />
                <stop offset="1" stopColor="#FFD58A" stopOpacity={0} />
              </linearGradient>
            </defs>
          </g>
          {/* el libro, de frente */}
          <g transform={`translate(${960 - 154 * (1 - open)} 850)`}>
            <path d="M -330 20 L 330 20 L 320 46 L -320 46 Z" fill="#000" opacity={0.5} />
            <rect x={0} y={-230} width={300} height={250} fill="#EFE3C8" />
            {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={36} y={-200 + i * 22} width={i % 4 === 3 ? 140 : 220} height={5} fill="#B9A684" opacity={0.6 * light} />)}
            <rect x={-3} y={-236} width={6} height={262} fill="#2A1E16" />
            <g transform={`scale(${Math.abs(sx) < 0.02 ? 0.02 : sx} 1)`}>
              <rect x={0} y={-236} width={308} height={262} rx={4} fill={sx > 0 ? '#1E2A33' : '#EFE3C8'} />
              {sx > 0 && <rect x={70} y={-150} width={170} height={4} fill="#D9B35F" />}
              {sx < 0 && Array.from({ length: 9 }).map((_, i) => <rect key={i} x={36} y={-200 + i * 22} width={i % 3 === 2 ? 120 : 220} height={5} fill="#B9A684" opacity={0.6 * light} />)}
            </g>
          </g>
        </Layer>
      </Rig>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 150 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: kicker, transform: `translateY(${(1 - kicker) * 16}px)` }}>
          <LogoIcon size={50} />
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: 9, color: 'rgba(246,239,226,0.8)', textTransform: 'uppercase' }}>SonorBooks presenta</div>
        </div>
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 132, color: '#F6EFE2', marginTop: 26, letterSpacing: -1, textShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
          {words.map((w, i) => {
            const p = rampOut(frame, 30 + i * 5, 52 + i * 5);
            return <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 60}px)`, filter: p < 0.98 ? `blur(${((1 - p) * 8).toFixed(1)}px)` : undefined, whiteSpace: 'pre' }}>{w}{i < words.length - 1 ? ' ' : ''}</span>;
          })}
        </div>
        <div style={{ width: 560 * ramp(frame, 60, 96, easeOut), height: 3, background: P.yellow, marginTop: 30 }} />
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, color: P.yellow, marginTop: 24, opacity: sub }}>Episodio 1 · Cien años de soledad</div>
      </AbsoluteFill>
      {frame > 36 && <SwarmUp from={[1060, 640]} a={36} n={10} />}
      <PaperFinish opacity={0.4} vignette={0.6} />
      <AbsoluteFill style={{ background: '#05070A', opacity: out * 0.0 }} />
      <Sfx name="page_turn" at={14} volume={0.9} />
      <Sfx name="logo_sting" at={30} volume={0.9} />
      <Sfx name="hdl_flutter" at={44} volume={0.8} />
    </AbsoluteFill>
  );
};

export const _unused = { F, P, rampOut, CREAM };

const ButterflyAt: React.FC<{ x: number; y: number; size: number; seed: string; rot: number; op: number }> = ({ x, y, size, seed, rot, op }) => (
  <Butterfly x={x} y={y} size={size} seed={seed} rot={rot} glow={0.7} opacity={op} />
);

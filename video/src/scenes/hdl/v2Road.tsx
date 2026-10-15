import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp } from './kit';
import { sceneClock } from './timeline';
import { Beam, Halo, Head, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, tw, useCamera, walkPose } from './theatre';
import { Banana, Car60, CREAM, Ridge, Tree, WARM } from './sets';
import { House } from './house';

// ————————————————————————————————————————————————————————————————
// Capítulo II · La carretera de Acapulco (v2)
// ————————————————————————————————————————————————————————————————

// Cactus (órgano) y palmera para el paisaje de la carretera.
const Cactus: React.FC<{ x: number; y: number; h: number; c: string }> = ({ x, y, h, c }) => (
  <g transform={`translate(${x} ${y})`} fill={c}>
    <rect x={-9} y={-h} width={18} height={h} rx={9} />
    <rect x={-30} y={-h * 0.7} width={14} height={h * 0.45} rx={7} />
    <rect x={-30} y={-h * 0.32} width={26} height={12} rx={6} />
    <rect x={16} y={-h * 0.85} width={14} height={h * 0.5} rx={7} />
    <rect x={4} y={-h * 0.42} width={26} height={12} rx={6} />
  </g>
);
const Palm: React.FC<{ x: number; y: number; h: number; c: string; lean?: number; sway?: number }> = ({ x, y, h, c, lean = 8, sway = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -6 0 C ${lean * 2} ${-h * 0.4}, ${lean * 3} ${-h * 0.75}, ${lean * 4} ${-h} L ${lean * 4 + 6} ${-h} C ${lean * 3 + 6} ${-h * 0.75}, ${lean * 2 + 8} ${-h * 0.4}, 8 0 Z`} fill={c} />
    {Array.from({ length: 7 }).map((_, i) => {
      const a = -160 + i * 50 + sway;
      return <path key={i} d={`M 0 0 C 30 -18, 70 -10, 96 18 C 70 0, 30 -4, 0 6 Z`} fill={c} transform={`translate(${lean * 4 + 3} ${-h}) rotate(${a})`} />;
    })}
  </g>
);

// El coche de la familia con el equipaje en la baca y las cabezas en las ventanillas.
const FamilyCar: React.FC<{ x: number; y: number; c: string; scale?: number; wheel?: number; face?: 1 | -1; win: string; bounce?: number }> = ({ x, y, c, scale = 1, wheel = 0, face = 1, win, bounce = 0 }) => (
  <g transform={`translate(${x} ${y + bounce})`}>
    <g transform={`scale(${face * scale} ${scale})`}>
      {/* baca con maletas */}
      <rect x={-150} y={-188} width={260} height={8} fill={c} />
      <rect x={-140} y={-232} width={110} height={44} rx={6} fill={c} />
      <rect x={-20} y={-222} width={90} height={34} rx={6} fill={c} />
      <rect x={-96} y={-240} width={22} height={8} rx={3} fill={c} />
      <Car60 x={0} y={0} c={c} wheel={wheel} lights={0} win={win} />
      {/* cabezas de perfil: él conduce, ella a su lado, los niños detrás */}
      <Head x={98} y={-108} h={46} hair="curly" mustache c={c} />
      <Head x={40} y={-108} h={42} hair="bob" c={c} />
      <Head x={-56} y={-108} h={34} hair="kid" kid c={c} />
      <Head x={-100} y={-108} h={30} hair="kid" kid c={c} tilt={-8} />
    </g>
  </g>
);

// Letrero de carretera.
const RoadSign: React.FC<{ x: number; y: number; c: string; text: string; flip?: boolean }> = ({ x, y, c, text, flip = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={-200} width={12} height={200} fill={c} />
    <path d={flip ? 'M -150 -250 L 130 -250 L 130 -190 L -150 -190 L -180 -220 Z' : 'M -130 -250 L 150 -250 L 180 -220 L 150 -190 L -130 -190 Z'} fill="#2F5A3E" stroke={CREAM} strokeWidth={4} />
    <text x={0} y={-208} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={32} letterSpacing={3} fill={CREAM}>{text}</text>
  </g>
);

// Paisaje de la carretera (capas), con desplazamiento lateral `scroll` (px recorridos).
const RoadWorld: React.FC<{ scroll: number; frame: number; tone: number; signX?: number; signFlip?: boolean }> = ({ scroll, frame, tone, signX, signFlip }) => {
  // tone: 0 tarde dorada → 1 crepúsculo de sueño
  const sky1 = mix('#F6CF85', '#3B3F6E', tone), sky2 = mix('#EE9A62', '#6A4C7A', tone), sky3 = mix('#C9684A', '#C27A6A', tone);
  const m1 = mix('#B97A6A', '#4A3E66', tone), m2 = mix('#8C5059', '#3A3056', tone), m3 = mix('#5C3243', '#2A2240', tone), g = mix('#2A1620', '#171328', tone);
  const wrap = (x: number, span: number) => ((x % span) + span) % span;
  return (
    <>
      <Sky stops={[[0, sky1], [55, sky2], [100, sky3]]} glows={[{ x: 1400, y: 560, r: 600, c: '#FFE3A0', a: 0.55 * (1 - tone) }]} />
      <Layer z={0.05}><circle cx={1400} cy={560} r={110} fill="#FFE6B0" opacity={0.9 * (1 - tone)} /></Layer>
      <Layer z={0.15}><g transform={`translate(${-wrap(scroll * 0.08, 2320)} 0)`}><Ridge y={720} c={m1} amp={260} seed="r1" peaks={7} /><g transform="translate(2320 0)"><Ridge y={720} c={m1} amp={260} seed="r1" peaks={7} /></g></g></Layer>
      <Layer z={0.35}><g transform={`translate(${-wrap(scroll * 0.2, 2320)} 0)`}><Ridge y={820} c={m2} amp={180} seed="r2" peaks={9} /><g transform="translate(2320 0)"><Ridge y={820} c={m2} amp={180} seed="r2" peaks={9} /></g></g></Layer>
      <Layer z={0.6}>
        <g transform={`translate(${-wrap(scroll * 0.5, 2400)} 0)`}>
          {[0, 2400].map((o) => (
            <g key={o} transform={`translate(${o} 0)`}>
              <rect x={-10} y={880} width={2420} height={300} fill={m3} />
              {Array.from({ length: 10 }).map((_, i) => (i % 3 === 0
                ? <Palm key={i} x={i * 240 + 40} y={890} h={200 + random(`pl${i}`) * 90} c={m3} sway={Math.sin(frame / 20 + i) * 5} />
                : <Cactus key={i} x={i * 240 + 60} y={890} h={110 + random(`cc${i}`) * 70} c={m3} />))}
            </g>
          ))}
        </g>
      </Layer>
      <Layer z={1}>
        <rect x={-400} y={960} width={2720} height={400} fill={g} />
        <g transform={`translate(${-wrap(scroll, 220)} 0)`}>
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-220 + i * 220} y={1012} width={110} height={8} fill={mix(CREAM, sky2, 0.4)} opacity={0.7} />)}
        </g>
        {signX !== undefined && <RoadSign x={signX} y={960} c={g} text="ACAPULCO" flip={signFlip} />}
      </Layer>
    </>
  );
};

// ——— CARRETERA v2 · W08 ———
export const Carretera2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CARRETERA');
  const f65 = c.part('W08');
  const fFam = c.at('W08', 'familia');
  const fAca = c.at('W08', 'Acapulco');
  const fVac = c.at('W08', 'vacaciones');
  const fPle = c.at('W08', 'plena');
  const fGar = c.at('W08', 'García');
  const fGol = c.at('W08', 'golpe');
  const fArr = c.at('W08', 'arranque');
  const fCor = c.at('W08', 'coronel');
  const fPel = c.at('W08', 'pelotón');
  const fFus = c.at('W08', 'fusilamiento');
  const fRec = c.at('W08', 'recuerda');
  const fPad = c.at('W08', 'padre');
  const fHie = c.at('W08', 'hielo');
  const end = c.dur;
  const speed = interpolate(frame, [0, fGol - 10, fGol + 10, end], [9, 9, 1.4, 1.2], clamp);
  // recorrido acumulado (integral aproximada de la velocidad, determinista)
  const scroll = frame <= fGol - 10 ? frame * 9 : (fGol - 10) * 9 + (frame - (fGol - 10)) * 2.6;
  const tone = ramp(frame, fGol - 6, fGol + 30);
  const vision = ramp(frame, fArr - 10, fCor - 6);
  const iceT = ramp(frame, fRec - 10, fPad);
  const cam = useCamera([
    { f: 0, x: 960, y: 640, s: 1.05 },
    { f: fPle, x: 1000, y: 660, s: 1.12 },
    { f: fGar, x: 1120, y: 760, s: 2.1 },
    { f: fGol - 4, x: 1140, y: 770, s: 2.4 },
    { f: fArr + 10, x: 960, y: 500, s: 1.0 },
    { f: end, x: 960, y: 480, s: 0.98 },
  ], 0.6);
  const signX = 2300 - (scroll - (fAca - 40) * 9) * 1.0;
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <RoadWorld scroll={scroll} frame={frame} tone={tone} signX={frame > fAca - 60 && frame < fVac + 120 ? signX : undefined} />
        <Layer z={1}>
          <FamilyCar x={1140} y={1000} c={mix('#1A0E14', '#100C1E', tone)} scale={0.9} wheel={scroll * 1.5} win={mix('#F2C98A', '#7A6A9A', tone)} bounce={Math.sin(frame * 0.9) * 1.5 * (speed / 9)} />
          {/* polvo del camino */}
          {Array.from({ length: 8 }).map((_, i) => {
            const t = ((frame * 0.03 * speed / 3 + i / 8) % 1);
            return <circle key={i} cx={1140 - 290 - t * 300} cy={990 - t * 40} r={10 + t * 30} fill={mix('#E8B98A', '#7A6A9A', tone)} opacity={(1 - t) * 0.35 * (speed / 9)} />;
          })}
        </Layer>
      </Rig>
      {/* la visión: un teatro de sombras en el cielo */}
      <AbsoluteFill style={{ opacity: vision * (1 - iceT * 0.9) }}>
        <svg width={1920} height={1080}>
          <defs>
            <radialGradient id="visfog"><stop offset="0" stopColor="#F3E3C3" stopOpacity={0.55} /><stop offset="1" stopColor="#F3E3C3" stopOpacity={0} /></radialGradient>
          </defs>
          <ellipse cx={960} cy={420} rx={900} ry={360} fill="url(#visfog)" />
          {/* muro */}
          <rect x={1240} y={300} width={260} height={360} fill="#2A2240" opacity={0.85} />
          {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={1240} x2={1500} y1={330 + i * 56} y2={330 + i * 56} stroke="#3A3056" strokeWidth={3} />)}
          {/* el coronel, erguido, de cara al pelotón */}
          <Person x={1330} y={660} scale={1.9} face={-1} kind="man" hair="cap" mustache pose={{ shF: -10, elF: 20, shB: -14, elB: 30, neck: -4 }} c="#14102A" />
          {/* el pelotón */}
          {[0, 1, 2, 3, 4].map((k) => {
            const p = sp(frame, fPel - 10 + k * 5, 14, 160);
            return (
              <g key={k} opacity={Math.min(1, p * 2) * (k % 2 ? 0.8 : 1)} transform={`translate(${(1 - p) * -60} ${k % 2 ? -14 : 0})`}>
                <Person x={300 + k * 150} y={660} scale={1.75} kind="man" hair="cap" pose={{ lean: 4, shF: 66, elF: 22, shB: 40, elB: 70 }} c="#14102A" front={<g><rect x={-60} y={-5} width={150} height={9} fill="#14102A" /><rect x={-60} y={-9} width={36} height={16} fill="#14102A" /></g>} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      {/* el recuerdo: el padre y el niño ante el bloque de hielo */}
      <AbsoluteFill style={{ opacity: iceT }}>
        <svg width={1920} height={1080}>
          <defs>
            <radialGradient id="icefog"><stop offset="0" stopColor="#E9F6FA" stopOpacity={0.7} /><stop offset="1" stopColor="#E9F6FA" stopOpacity={0} /></radialGradient>
            <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4FCFF" /><stop offset="1" stopColor="#8FD0E4" /></linearGradient>
          </defs>
          <ellipse cx={960} cy={440} rx={800} ry={360} fill="url(#icefog)" />
          {/* carpa */}
          <path d="M 560 660 L 960 220 L 1360 660 Z" fill="#2A2240" opacity={0.8} />
          <path d="M 860 660 L 960 360 L 1060 660 Z" fill="#F3E3C3" opacity={0.25} />
          <Halo x={960} y={560} r={260} c="#BFEAF7" a={0.8 * iceT} />
          <g transform={`translate(960 640) rotate(${Math.sin(frame / 30) * 1})`}>
            <path d="M -90 0 L -100 -110 L -30 -150 L 80 -130 L 100 -20 L 40 10 Z" fill="url(#ice)" />
            <path d="M -60 -100 L -20 -128 M 30 -110 L 70 -90 M -40 -40 L 20 -60" stroke="#FFFFFF" strokeWidth={4} opacity={0.8} />
          </g>
          <Person x={720} y={660} scale={1.6} kind="man" hair="side" mustache pose={{ shF: 30, elF: 30, shB: 60, elB: 10, neck: 4 }} c="#14102A" />
          <Person x={820} y={660} scale={1.6} kind="boy" hair="kid" pose={{ shF: 70, elF: 0, neck: -6, lean: 6 }} c="#14102A" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = random(`is${i}`) * Math.PI * 2;
            const r = 130 + random(`ir${i}`) * 160;
            const tw2 = Math.abs(Math.sin(frame / (6 + i % 5) + i));
            return <path key={i} d="M 0 -10 L 2 -2 L 10 0 L 2 2 L 0 10 L -2 2 L -10 0 L -2 -2 Z" fill="#FFFFFF" opacity={tw2 * iceT} transform={`translate(${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r * 0.6}) scale(${0.6 + tw2})`} />;
          })}
        </svg>
      </AbsoluteFill>
      {/* mariposas que estallan «de golpe» */}
      {frame > fGol - 4 && frame < fGol + 120 && (
        <AbsoluteFill>
          {Array.from({ length: 14 }).map((_, i) => {
            const t = (frame - fGol + 4) / 50;
            const a = -Math.PI / 2 + (random(`gb${i}`) - 0.5) * 2.6;
            const v = 300 + random(`gv${i}`) * 400;
            return <Butterfly key={i} x={1180 + Math.cos(a) * v * t} y={720 + Math.sin(a) * v * t} size={40 + random(`gs${i}`) * 30} seed={`gb${i}`} glow={0.7} opacity={Math.min(1, t * 6) * (1 - ramp(frame, fGol + 80, fGol + 120))} rot={(random(`gr${i}`) - 0.5) * 50} />;
          })}
        </AbsoluteFill>
      )}
      <PaperFinish opacity={0.45} vignette={0.55} warm={0.4 * (1 - tone)} />
      <Slate text="1965 · camino de Acapulco" a={f65 + 4} b={f65 + 44} out={fVac + 40} x={110} y={940} />
      <Sfx name="hdl_car" at={0} volume={0.6} dur={fGol + 20} fade={30} />
      <Sfx name="reverse_swell" at={fGol - 40} volume={0.6} />
      <Sfx name="hdl_flutter" at={fGol} volume={1} />
      <Sfx name="shimmer" at={fArr} volume={0.5} />
      <Sfx name="sk_heart" at={fFus} volume={0.5} />
      <Sfx name="hdl_ice" at={fHie - 10} volume={1} />
      {fFam + fPad < 0 && null}
    </AbsoluteFill>
  );
};

// ——— ABUELA v2 · W09 ———
// Noche en el corredor de la casa de Aracataca: la abuela en su mecedora cuenta historias al niño; alrededor pasan
// cosas imposibles (llueven flores amarillas, la llama del farol se pone a flotar, las mariposas) y ella sigue, tan tranquila.
export const Abuela2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ABUELA');
  const fSab = c.at('W09', 'sabe');
  const fNat = c.at('W09', 'naturalidad');
  const fAbu = c.at('W09', 'abuela');
  const fInc = c.at('W09', 'increíbles');
  const fNor = c.at('W09', 'normal');
  const end = c.dur;
  const cam = useCamera([
    { f: 0, x: 960, y: 640, s: 1.32 },
    { f: fAbu, x: 940, y: 630, s: 1.22 },
    { f: end, x: 960, y: 600, s: 1.08 },
  ], 0.6);
  const rock = Math.sin(frame / 14) * 5;
  const magic = ramp(frame, fInc - 20, fInc + 10);
  const ink = '#0B0A14';
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <Sky stops={[[0, '#0E1838'], [60, '#24305A'], [100, '#3A3A5E']]} glows={[{ x: 960, y: 560, r: 760, c: '#FFC27A', a: 0.55 }, { x: 330, y: 200, r: 300, c: '#DCE4F2', a: 0.25 }]} />
        <Layer z={0.05}>
          {Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={random(`as${i}`) * 1920} cy={random(`ay${i}`) * 600} r={0.8 + random(`ar${i}`) * 1.8} fill="#F3EAD6" opacity={(0.3 + random(`ao${i}`) * 0.6) * (0.5 + 0.5 * Math.sin(frame / (12 + (i % 9)) + i))} />)}
          <circle cx={330} cy={200} r={64} fill="#F1E7CF" />
        </Layer>
        <Layer z={0.3}>
          {Array.from({ length: 12 }).map((_, i) => <Banana key={i} x={-60 + i * 180} y={780} h={180 + random(`ab${i}`) * 80} c="#2A3058" sway={Math.sin(frame / 25 + i) * 3} seed={`ab${i}`} />)}
          <rect x={-200} y={776} width={2320} height={400} fill="#2A3058" />
        </Layer>
        <Layer z={1}>
          {/* corredor: techo, columnas, suelo */}
          <rect x={-300} y={120} width={2520} height={46} fill={ink} />
          {[140, 1740].map((x, i) => <rect key={i} x={x} y={160} width={40} height={800} fill={ink} />)}
          <rect x={-300} y={950} width={2520} height={300} fill={ink} />
          {/* farol colgado, entre los dos */}
          <line x1={980} y1={166} x2={980} y2={430} stroke={ink} strokeWidth={4} />
          <path d="M 954 430 L 1006 430 L 1000 500 L 960 500 Z" fill={ink} />
          <Halo x={980} y={466} r={380} c={WARM} a={0.75} />
          <ellipse cx={980} cy={470} rx={14} ry={20} fill="#FFE2A0" opacity={1 - magic * 0.8} />
          {/* la llama que se escapa del farol y flota */}
          {magic > 0 && (
            <g transform={`translate(${980 + magic * Math.sin(frame / 20) * 180} ${466 - magic * (170 + Math.sin(frame / 13) * 24)})`}>
              <Halo x={0} y={0} r={90} c={WARM} a={0.7} />
              <ellipse rx={12} ry={20} fill="#FFD27A" />
              <ellipse rx={5} ry={10} fill="#FFF5DA" />
            </g>
          )}
          {/* mecedora con la abuela */}
          <g transform={`rotate(${rock} 700 950)`}>
            <path d="M 560 948 C 610 966, 760 966, 820 940" stroke={ink} strokeWidth={12} fill="none" />
            <rect x={586} y={810} width={12} height={140} fill={ink} />
            <rect x={572} y={650} width={12} height={190} fill={ink} transform="rotate(-10 578 745)" />
            <rect x={586} y={818} width={190} height={14} fill={ink} />
            <rect x={764} y={830} width={12} height={110} fill={ink} />
            <Person x={660} y={958} scale={2.3} kind="grandma" hair="bun" pose={sitPose({ lean: -4 + Math.sin(frame / 22) * 3, neck: 8 + Math.sin(frame / 9) * 3, shF: 40 + Math.sin(frame / 7) * 8, elF: 70, shB: 36, elB: 80, hipF: 78, hipB: 74 })} c={ink} back="#24203A" />
          </g>
          {/* el niño, sentado en el suelo frente a ella, escuchando (mira arriba cuando llegan las cosas increíbles) */}
          <Person x={1240} y={1062} scale={2.1} face={-1} kind="boy" hair="kid" pose={sitPose({ lean: 6, neck: -24 * magic, shF: 30, elF: 70, shB: 20, elB: 60, hipF: 80, knF: 120, hipB: 70, knB: 130 })} c={ink} back="#24203A" />
        </Layer>
      </Rig>
      {/* lluvia de flores amarillas */}
      <AbsoluteFill style={{ opacity: magic }}>
        <svg width={1920} height={1080}>
          {Array.from({ length: 42 }).map((_, i) => {
            const r = (k: string) => random(`fl-${i}-${k}`);
            const x = r('x') * 1920 + Math.sin(frame / (10 + r('p') * 10) + i) * 30;
            const y = ((r('y') * 1200 + (frame - fInc) * (1.1 + r('v') * 1.2)) % 1200) - 60;
            const s = 10 + r('s') * 9;
            return <g key={i} transform={`translate(${x} ${y}) rotate(${frame * 1.2 + i * 40}) scale(1 ${0.55 + 0.45 * Math.abs(Math.sin(frame / 9 + i))})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx={s * 0.42} ry={s * 0.8} cy={-s * 0.75} fill={i % 3 ? '#F7C51E' : '#FFD84A'} transform={`rotate(${a})`} />)}<circle r={s * 0.28} fill="#C98A10" /></g>;
          })}
        </svg>
      </AbsoluteFill>
      {frame > fNat && <AbsoluteFill>{[0, 1, 2].map((i) => <Butterfly key={i} x={600 + i * 300 + Math.sin(frame / 15 + i) * 80} y={380 - i * 40 + Math.cos(frame / 11 + i) * 40} size={50} seed={`ab${i}`} glow={0.6} opacity={ramp(frame, fNat + i * 20, fNat + i * 20 + 20)} />)}</AbsoluteFill>}
      <PaperFinish opacity={0.45} vignette={0.6} />
      <Sfx name="hdl_crickets" at={0} volume={0.35} dur={end} fade={20} />
      <Sfx name="hdl_rocking" at={4} volume={0.45} dur={end - 4} fade={20} />
      <Sfx name="sk_wind" at={0} volume={0.08} dur={end} fade={20} />
      <Sfx name="sparkle" at={fInc - 10} volume={0.6} />
      <Sfx name="hdl_flutter" at={fNat + 4} volume={0.6} />
      {fSab + fNor < 0 && null}
    </AbsoluteFill>
  );
};

// ——— VUELTA v2 · W10 ———
// En plena carretera el coche frena en seco, da media vuelta (giro de marioneta) y vuelve; de noche llega a casa y se
// enciende la luz del estudio. La frase: «Nunca llegué a Acapulco». «Quédate con esa frase»: la ficha se clava en un
// tablero de corcho (el tablero de «¿Pasó de verdad?», al que volvemos en el capítulo VIII).
export const Vuelta2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VUELTA');
  const fFam = c.at('W10', 'famosa');
  const fDio = c.at('W10', 'dio');
  const fVue = c.at('W10', 'vuelta');
  const fFami = c.at('W10', 'familia');
  const fVol = c.at('W10', 'volvió');
  const fEsc = c.at('W10', 'escribir');
  const fEl = c.part('W10') + Math.round(7.52 * 50);
  const fNun = c.at('W10', 'Nunca');
  const fQue = c.at('W10', 'Quédate');
  const fFra = c.at('W10', 'frase');
  const fVolv = c.at('W10', 'volveremos');
  const end = c.dur;
  const tHome = fVol - 4;
  const tQuote = fNun - 16;
  const tBoard = fQue - 6;
  let shot: React.ReactNode;
  if (frame < tHome) shot = <UTurn t1={tHome} fDio={fDio} fVue={fVue} fFami={fFami} />;
  else if (frame < tQuote) shot = <HomeArrive t0={tHome} t1={tQuote} fEsc={fEsc} />;
  else shot = <QuoteBoard t0={tQuote} end={end} fNun={fNun} fQue={fQue} fFra={fFra} fVolv={fVolv} />;
  return (
    <AbsoluteFill>
      {shot}
      <Slate text="La versión más famosa" a={4} b={fFam + 20} out={fDio - 10} x={110} y={940} />
      <Sfx name="hdl_car" at={0} volume={0.5} dur={fDio} fade={10} />
      <Sfx name="hdl_uturn" at={fVue - 6} volume={0.85} />
      <Sfx name="whoosh_soft" at={tHome} volume={0.4} />
      <Sfx name="sk_door" at={fEsc - 18} volume={0.4} />
      <Sfx name="sk_typing" at={fEsc + 4} volume={0.4} />
      <Sfx name="whoosh_soft" at={tQuote} volume={0.5} />
      <Sfx name="sk_pin" at={tBoard + 30} volume={0.55} />
      <Sfx name="sk_string" at={fVolv} volume={0.3} />
      {tBoard < 0 && null}
    </AbsoluteFill>
  );
};

const UTurn: React.FC<{ t1: number; fDio: number; fVue: number; fFami: number }> = ({ t1, fDio, fVue, fFami }) => {
  const frame = useCurrentFrame();
  const brake = ramp(frame, fDio - 30, fDio, easeOut);
  // antes del frenazo el paisaje corre; tras el giro corre al revés
  const turn = interpolate(frame, [fVue - 8, fVue + 8], [1, -1], clamp);
  const face: 1 | -1 = turn >= 0 ? 1 : -1;
  const v = frame < fDio ? 9 * (1 - brake) : frame < fVue + 8 ? 0 : -9 * ramp(frame, fVue + 8, fVue + 40);
  let scroll = 0;
  for (let f = 0; f < frame; f += 1) scroll += f < fDio ? 9 * (1 - ramp(f, fDio - 30, fDio, easeOut)) : f < fVue + 8 ? 0 : -9 * ramp(f, fVue + 8, fVue + 40);
  const cam = useCamera([{ f: 0, x: 980, y: 640, s: 1.15 }, { f: fVue, x: 1140, y: 760, s: 1.6 }, { f: t1, x: 1000, y: 680, s: 1.25 }], 0.6);
  const carX = 1140 + (frame > fVue + 8 ? -(frame - fVue - 8) * 6 : 0);
  const signX = 1700 - scroll * 0.3 + 300;
  return (
    <Rig cam={cam}>
      <RoadWorld scroll={scroll} frame={frame} tone={0.15} signX={signX} />
      <Layer z={1}>
        {/* marcas de frenada */}
        <path d={`M ${1140 - 200 - 260 * brake} 1004 L ${1140 - 200} 1004`} stroke="#120A10" strokeWidth={6} opacity={0.6 * brake} />
        <g transform={`translate(${carX} 0) scale(${Math.max(0.05, Math.abs(turn))} 1) translate(${-carX} 0)`}>
          <FamilyCar x={carX} y={1000} c="#1A0E14" scale={0.9} face={face} wheel={scroll * 1.5} win="#F2C98A" bounce={brake > 0 && brake < 1 ? Math.sin(frame) * 2 : 0} />
        </g>
        {/* nube de polvo del giro */}
        {Array.from({ length: 10 }).map((_, i) => {
          const t = ramp(frame, fVue - 10 + i, fVue + 40 + i);
          if (t <= 0 || t >= 1) return null;
          return <circle key={i} cx={carX + (random(`du${i}`) - 0.5) * 400} cy={990 - t * 80} r={20 + t * 60} fill="#E8B98A" opacity={(1 - t) * 0.45} />;
        })}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.55} warm={0.4} />
      {fFami + v < -1e9 && null}
    </Rig>
  );
};

const HomeArrive: React.FC<{ t0: number; t1: number; fEsc: number }> = ({ t0, t1, fEsc }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 1300, y: 700, s: 1.1 }, { f: fEsc - 12, x: 800, y: 560, s: 1.4 }, { f: t1, x: 560, y: 500, s: 2.6 }], 0.6);
  const carX = interpolate(frame, [t0, t0 + 26], [2400, 1860], { ...clamp, easing: easeOut });
  const studyOn = ramp(frame, fEsc - 16, fEsc - 6);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [55, '#1C2E41'], [100, '#3A3F48']]} glows={[{ x: 960, y: 980, r: 1100, c: '#E39A55', a: 0.2 }]} />
      <Layer z={1}>
        <House ink="#140D08" frame={frame} lights={{ study: studyOn, kids: 0.15, bath: 0.1, living: 0.5, kitchen: 0.2 }} items={{ car: 0 }} />
        <g transform={`translate(${carX - 1860} 0)`}><Car60 x={1860} y={980} c="#140D08" scale={0.55} lights={0} face={-1} /></g>
        {frame >= fEsc - 12 && <Person x={512} y={652} scale={1} kind="man" hair="curly" mustache pose={sitPose({ lean: 10, neck: 6, shF: 58, elF: 26 + Math.abs(Math.sin(frame * 1.7)) * 12, shB: 54, elB: 30 })} c="#140D08" back="#2A1C12" />}
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
    </Rig>
  );
};

// Tablero de corcho (el de la investigación del capítulo VIII). Exportado para reutilizarlo.
export const CorkBoard: React.FC<{ children?: React.ReactNode; title?: number }> = ({ children, title = 1 }) => (
  <AbsoluteFill style={{ background: '#2A1A10' }}>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #B7875A 0%, #8E6440 55%, #5E3E26 100%)' }} />
    <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(60,35,15,0.35) 1px, transparent 1.6px), radial-gradient(rgba(255,230,190,0.18) 1px, transparent 1.6px)', backgroundSize: '9px 9px, 13px 13px', backgroundPosition: '0 0, 4px 6px' }} />
    <div style={{ position: 'absolute', left: 90, top: 60, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#2A1A10', opacity: title, transform: 'rotate(-2deg)' }}>¿Pasó de verdad?</div>
    {children}
  </AbsoluteFill>
);

export const PinCard: React.FC<{ x: number; y: number; w: number; rot?: number; at: number; children: React.ReactNode; pin?: string; bg?: string; frame: number }> = ({ x, y, w, rot = 0, at, children, pin = P.yellow, bg = '#F4EAD5', frame }) => {
  const p = sp(frame, at, 13, 170);
  if (frame < at - 2) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translateY(${(1 - p) * -40}px) rotate(${rot}deg) scale(${1.2 - 0.2 * p})`, opacity: Math.min(1, p * 2), transformOrigin: '50% 0' }}>
      <div style={{ background: bg, padding: '34px 38px 30px', boxShadow: '0 18px 30px rgba(40,20,5,0.45)', position: 'relative' }}>
        {children}
        <div style={{ position: 'absolute', left: '50%', top: -12, width: 30, height: 30, marginLeft: -15, borderRadius: '50%', background: pin, boxShadow: '0 4px 6px rgba(0,0,0,0.4), inset -4px -4px 0 rgba(0,0,0,0.15)' }} />
      </div>
    </div>
  );
};

const QuoteBoard: React.FC<{ t0: number; end: number; fNun: number; fQue: number; fFra: number; fVolv: number }> = ({ t0, end, fNun, fQue, fFra, fVolv }) => {
  const frame = useCurrentFrame();
  // la cita, grande sobre la noche; con «Quédate» encoge hasta una ficha que se clava en el tablero
  const toCard = ramp(frame, fQue - 4, fQue + 30, easeInOut);
  const board = ramp(frame, fQue - 10, fQue + 20);
  const words = 'Nunca llegué a Acapulco.'.split(' ');
  return (
    <AbsoluteFill style={{ background: '#0B0E14' }}>
      <AbsoluteFill style={{ opacity: board }}>
        <CorkBoard title={rampOut(frame, fFra, fFra + 16)}>
          <div style={{ position: 'absolute', left: 1260, top: 300, width: 520, height: 300, border: '3px dashed rgba(42,26,16,0.35)', opacity: rampOut(frame, fVolv, fVolv + 16) }} />
          <div style={{ position: 'absolute', left: 1290, top: 420, fontFamily: '"Caveat", cursive', fontSize: 46, color: 'rgba(42,26,16,0.55)', opacity: rampOut(frame, fVolv + 6, fVolv + 22) }}>continuará…</div>
        </CorkBoard>
      </AbsoluteFill>
      {/* la frase: de grande a ficha */}
      <div style={{ position: 'absolute', left: interpolate(toCard, [0, 1], [260, 380]), top: interpolate(toCard, [0, 1], [360, 330]), width: interpolate(toCard, [0, 1], [1400, 700]),
        transform: `rotate(${-3 * toCard}deg)`, background: `rgba(244,234,213,${toCard})`, padding: `${40 * toCard}px ${46 * toCard}px`, boxShadow: toCard > 0.5 ? '0 22px 40px rgba(40,20,5,0.45)' : 'none' }}>
        <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontWeight: 500, fontSize: interpolate(toCard, [0, 1], [120, 66]), lineHeight: 1.1, color: toCard > 0.5 ? '#1D1A16' : '#F6EFE2' }}>
          {words.map((w, i) => {
            const p = rampOut(frame, fNun + i * 7, fNun + i * 7 + 16);
            return <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, whiteSpace: 'pre' }}>{i === 0 ? '«' : ''}{w}{i === words.length - 1 ? '»' : ' '}</span>;
          })}
        </div>
        <div style={{ marginTop: 18, fontFamily: '"Ubuntu", sans-serif', fontWeight: 500, fontSize: interpolate(toCard, [0, 1], [40, 28]), color: toCard > 0.5 ? '#7A6650' : 'rgba(246,239,226,0.7)', opacity: rampOut(frame, fNun + 30, fNun + 44) }}>— Gabriel García Márquez</div>
        {toCard > 0.95 && <div style={{ position: 'absolute', left: '50%', top: -12, width: 30, height: 30, marginLeft: -15, borderRadius: '50%', background: P.yellow, boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }} />}
      </div>
      <PaperFinish opacity={0.35} vignette={0.55} still />
      {end + t0 < 0 && null}
    </AbsoluteFill>
  );
};

export const _r = { Beam, tw, easeInOut, Tree, Pose: null as unknown as Pose };

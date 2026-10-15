import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, ramp, rampOut, sp } from './kit';
import { sceneClock } from './timeline';
import { Beam, Halo, Hand, Head, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, useCamera, walkPose } from './theatre';
import { Banana, CaribHouseSil, CREAM, Ridge, Tree, WARM } from './sets';
import { WorldMap, WORLD_COUNTRIES } from './Maps';
import { BookStack, CardTag } from './v2Success';
import { HandLabel } from './v2Bio';
import { VoiceWaves } from './v2End';

// ————————————————————————————————————————————————————————————————
// Capítulo VII · Lo que vino después (v2): el Nobel, los lectores, el cine
// ————————————————————————————————————————————————————————————————

const GOLD = '#E2B13C';
const GOLD_D = '#B5862A';

// Medalla genérica (no reproduce la del Nobel): disco de oro, laurel y el año.
const Medal: React.FC<{ x: number; y: number; r: number; glint?: number; rot?: number }> = ({ x, y, r, glint = -1, rot = 0 }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <clipPath id={`md${id}`}><circle r={r} /></clipPath>
        <radialGradient id={`mg${id}`} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#F8DA7A" />
          <stop offset="0.55" stopColor={GOLD} />
          <stop offset="1" stopColor={GOLD_D} />
        </radialGradient>
      </defs>
      <circle r={r} fill={GOLD_D} />
      <circle r={r * 0.94} fill={`url(#mg${id})`} />
      <circle r={r * 0.8} fill="none" stroke={GOLD_D} strokeWidth={r * 0.025} />
      {/* laurel */}
      {[-1, 1].map((s) =>
        Array.from({ length: 9 }).map((_, i) => {
          const a = ((110 + i * 16) * Math.PI) / 180;
          const px = Math.cos(a) * r * 0.68 * s, py = Math.sin(a) * r * 0.68;
          return <ellipse key={`${s}${i}`} cx={px} cy={py} rx={r * 0.075} ry={r * 0.03} fill={GOLD_D} transform={`rotate(${(a * 180) / Math.PI * s + (s > 0 ? 90 : -90) + 30 * s} ${px} ${py})`} opacity={0.8} />;
        }),
      )}
      <text x={0} y={r * 0.15} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={r * 0.42} fill="#7A5410">1982</text>
      {glint >= 0 && glint <= 1 && (
        <g clipPath={`url(#md${id})`}>
          <rect x={-r * 2 + glint * r * 4} y={-r * 1.5} width={r * 0.35} height={r * 3} fill="#FFFFFF" opacity={0.45} transform={`rotate(24 ${-r * 2 + glint * r * 4} 0)`} />
        </g>
      )}
    </g>
  );
};

// Cubierta genérica de frente (nunca la real): azul noche, filetes dorados y el título tecleado.
const CoverFront: React.FC<{ x: number; y: number; w: number; title?: string; sub?: string; c?: string; titleSize?: number; detail?: boolean }> = ({ x, y, w, title, sub, c = '#1E2A33', titleSize, detail = true }) => {
  const h = w * 1.45;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2 + w * 0.04} y={-h / 2 + w * 0.05} width={w} height={h} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={c} />
      <rect x={-w / 2} y={-h / 2} width={w * 0.06} height={h} fill={mix(c, '#000000', 0.35)} />
      {detail && <rect x={-w / 2 + w * 0.12} y={-h / 2 + w * 0.08} width={w * 0.8} height={h - w * 0.16} fill="none" stroke={GOLD} strokeWidth={Math.max(1, w * 0.012)} opacity={0.7} />}
      {title && (
        <foreignObject x={-w / 2 + w * 0.14} y={-h * 0.28} width={w * 0.76} height={h * 0.5}>
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: titleSize ?? w * 0.12, lineHeight: 1.08, color: '#F1E2BC' }}>{title}</div>
            {sub && <div style={{ fontFamily: '"Ubuntu", sans-serif', fontWeight: 500, fontSize: w * 0.04, letterSpacing: w * 0.008, color: GOLD, marginTop: w * 0.05 }}>{sub}</div>}
          </div>
        </foreignObject>
      )}
      {!title && detail && [0, 1].map((k) => <rect key={k} x={-w * 0.26} y={-h * 0.1 + k * w * 0.1} width={w * 0.52 - k * w * 0.12} height={w * 0.035} fill="#F1E2BC" opacity={0.75} />)}
    </g>
  );
};

// Títulos publicados de las traducciones (sólo títulos, alfabeto latino).
const TRANSLATIONS: [string, string][] = [
  ['One Hundred Years of Solitude', 'INGLÉS'],
  ['Cent ans de solitude', 'FRANCÉS'],
  ['Hundert Jahre Einsamkeit', 'ALEMÁN'],
  ['Cem anos de solidão', 'PORTUGUÉS'],
  ["Cent'anni di solitudine", 'ITALIANO'],
  ['Sto lat samotności', 'POLACO'],
  ['Hundra år av ensamhet', 'SUECO'],
  ['Yüzyıllık Yalnızlık', 'TURCO'],
  ['Száz év magány', 'HÚNGARO'],
  ['Un veac de singurătate', 'RUMANO'],
  ['Cent anys de solitud', 'CATALÁN'],
];

// ——— NOBEL v2 · W26 ———
export const Nobel2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('NOBEL');
  const fYear = c.at('W26', 'mil');
  const fGar = c.at('W26', 'García');
  const fRec = c.at('W26', 'recibe');
  const fNob = c.at('W26', 'Nobel');
  const fLit = c.at('W26', 'Literatura');
  const fHoy = c.at('W26', 'Hoy');
  const fCinc = c.at('W26', 'cincuenta');
  const fMill = c.at('W26', 'millones');
  const fVend = c.at('W26', 'vendidos');
  const fTrad = c.at('W26', 'traducido');
  const fCuar = c.at('W26', 'cuarenta');
  const fIdi = c.at('W26', 'idiomas');
  const fEl = c.at('W26', 'El', 1);
  const fDijo = c.at('W26', 'dijo');
  const fLect = c.at('W26', 'lectores');
  const fJunt = c.at('W26', 'juntaran');
  const fTerr = c.at('W26', 'territorio');
  const fForm = c.at('W26', 'formarían');
  const fVein = c.at('W26', 'veinte');
  const end = c.dur;
  const tMedal = fNob - 8;
  const tWall = fHoy - 8;
  const tTrans = fTrad - 16;
  const tGabo = fEl - 8;
  const tMap = fLect - 12;
  let shot: React.ReactNode;
  if (frame < tMedal) shot = <Ceremony t1={tMedal} fYear={fYear} fGar={fGar} fRec={fRec} />;
  else if (frame < tWall) shot = <MedalShot t0={tMedal} t1={tWall} fNob={fNob} fLit={fLit} />;
  else if (frame < tTrans) shot = <BookWall t0={tWall} t1={tTrans} fHoy={fHoy} fCinc={fCinc} fMill={fMill} fVend={fVend} />;
  else if (frame < tGabo) shot = <Translations t0={tTrans} t1={tGabo} fTrad={fTrad} fCuar={fCuar} fIdi={fIdi} />;
  else if (frame < tMap) shot = <GaboSays t0={tGabo} t1={tMap} fDijo={fDijo} />;
  else shot = <ReadersCountry t0={tMap} end={end} fLect={fLect} fJunt={fJunt} fTerr={fTerr} fForm={fForm} fVein={fVein} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <Sfx name="hdl_steps_stage" at={10} volume={0.9} dur={fRec - 40} fade={12} />
      <Sfx name="hdl_applause" at={fRec + 30} volume={0.55} dur={tMedal + 60 - fRec - 30} fade={30} />
      <Sfx name="hdl_flash" at={fRec + 8} volume={0.6} />
      <Sfx name="shimmer" at={tMedal + 2} volume={0.6} />
      <Sfx name="whoosh_deep" at={tWall - 4} volume={0.4} />
      <Sfx name="hdl_tally" at={fCinc - 4} volume={0.8} />
      <Sfx name="hdl_tally" at={fCinc + 50} volume={0.6} dur={36} fade={8} />
      {TRANSLATIONS.map((_, i) => <Sfx key={i} name={(['key1', 'key4', 'key2', 'key6', 'key3', 'key7', 'key5'] as const)[i % 7]} at={fTrad + i * 9} volume={0.5} />)}
      <Sfx name="sk_typebell" at={fIdi + 26} volume={0.4} />
      <Sfx name="sparkle" at={fLect} volume={0.5} />
      <Sfx name="whoosh_soft" at={fJunt + 4} volume={0.5} />
      <Sfx name="hit_soft" at={fTerr + 10} volume={0.5} />
      <Sfx name="hdl_flutter" at={fForm + 6} volume={0.7} />
    </AbsoluteFill>
  );
};

// Estocolmo, 1982: escenario, foco, entra él y recibe la medalla.
const Ceremony: React.FC<{ t1: number; fYear: number; fGar: number; fRec: number }> = ({ t1, fYear, fGar, fRec }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 960, y: 560, s: 1.0 }, { f: fRec - 10, x: 960, y: 520, s: 1.12 }, { f: t1, x: 1000, y: 470, s: 1.42 }], 0.5);
  const walkT = interpolate(frame, [8, fRec - 30], [0, 1], { ...clamp, easing: easeInOut });
  const gx = 280 + walkT * 560;
  const walking = frame > 8 && frame < fRec - 30;
  const give = ramp(frame, fRec - 26, fRec + 4);
  const took = frame > fRec + 8;
  const raise = ramp(frame, fRec + 20, fRec + 40);
  const gPose: Pose = walking ? walkPose(frame * 0.26, 0.85) : { lean: 2, shF: 8 + give * 62 - raise * 0, elF: 10 + give * 10 + raise * 40, shB: -4, elB: 10 };
  const pPose: Pose = { lean: 3, shF: 10 + give * 64 * (took ? 1 - ramp(frame, fRec + 10, fRec + 30) : 1), elF: 20 - give * 10, shB: -4, elB: 14 };
  const medal = <circle cx={0} cy={12} r={9} fill={GOLD} stroke={GOLD_D} strokeWidth={1.5} />;
  const spot = rampOut(frame, 0, 20);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#120A06'], [70, '#24160D'], [100, '#1A0F08']]} glows={[{ x: 960, y: 420, r: 900, c: '#FFD98A', a: 0.18 }]} />
      <Layer z={0.45}>
        {/* fondo de la sala: columnas y cornisa */}
        <rect x={-200} y={140} width={2320} height={40} fill="#2E1E12" />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-120 + i * 220} y={180} width={64} height={600} fill="#2A1A10" />)}
        {Array.from({ length: 11 }).map((_, i) => <rect key={`c${i}`} x={-132 + i * 220} y={176} width={88} height={18} fill="#36251A" />)}
        <rect x={-200} y={760} width={2320} height={40} fill="#1E130B" />
      </Layer>
      <Layer z={0.75}>
        {/* telón */}
        {[-1, 1].map((s) => (
          <path key={s} d={s < 0 ? 'M -300 -40 L 380 -40 C 330 200, 300 500, 340 820 L -300 820 Z' : 'M 2220 -40 L 1540 -40 C 1590 200, 1620 500, 1580 820 L 2220 820 Z'} fill="#3A1410" />
        ))}
        {[-1, 1].map((s) => Array.from({ length: 5 }).map((_, k) => <path key={`${s}${k}`} d={s < 0 ? `M ${60 + k * 60} -40 C ${40 + k * 56} 300, ${30 + k * 58} 600, ${50 + k * 62} 820` : `M ${1860 - k * 60} -40 C ${1880 - k * 56} 300, ${1890 - k * 58} 600, ${1870 - k * 62} 820`} stroke="#250B08" strokeWidth={10} fill="none" opacity={0.6} />))}
        <path d="M -300 -40 L 2220 -40 L 2220 60 C 1800 110, 1400 70, 960 110 C 520 70, 120 110, -300 60 Z" fill="#4A1913" />
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={780} width={2520} height={400} fill="#140C07" />
        <rect x={-300} y={776} width={2520} height={8} fill="#3A2818" />
        <g opacity={spot}>
          <Beam x={gx + 40} y={-120} w0={60} w1={520} len={920} a={0.28} />
          <ellipse cx={gx + 40} cy={786} rx={250} ry={30} fill="#FFD98A" opacity={0.22} />
        </g>
        <Beam x={1150} y={-120} w0={40} w1={360} len={920} a={0.12} />
        {/* atril con las flores */}
        <path d="M 1450 780 L 1470 600 L 1540 600 L 1560 780 Z" fill="#0E0805" />
        {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={1470 + (i % 5) * 18} cy={584 - Math.floor(i / 5) * 18 - (i % 2) * 6} r={14} fill="#0E0805" />)}
        <Person x={1150} y={784} scale={2.55} face={-1} kind="man" hair="short" glasses pose={pPose} c="#0E0805" back="#1E140C" front={took ? undefined : medal} />
        <Person x={gx} y={784} scale={2.6} kind="man" hair="curly" mustache pose={gPose} c="#0B0604" back="#21150C" front={took ? medal : undefined} />
      </Layer>
      <Layer z={1.3}>
        {/* el público, de espaldas */}
        {Array.from({ length: 14 }).map((_, i) => {
          const clap = frame > fRec + 20 ? Math.abs(Math.sin(frame / (3 + (i % 3)) + i)) * 6 : 0;
          return <Head key={i} x={-140 + i * 160 + (i % 2) * 30} y={1140 - clap} h={170 + random(`au${i}`) * 30} face={i % 3 === 0 ? -1 : 1} hair={(['short', 'bob', 'bun', 'side', 'curly'] as const)[i % 5]} c="#050302" />;
        })}
      </Layer>
      {/* flashes de los fotógrafos */}
      <AbsoluteFill>
        {[0, 1, 2, 3, 4].map((i) => {
          const at = fRec + 8 + i * 9 + Math.round(random(`fl${i}`) * 4);
          const k = interpolate(frame, [at, at + 2, at + 9], [0, 1, 0], clamp);
          if (k <= 0) return null;
          const x = 160 + random(`fx${i}`) * 1600, y = 900 + random(`fy${i}`) * 160;
          return <div key={i} style={{ position: 'absolute', left: x - 200, top: y - 200, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,250,${0.95 * k}) 0%, rgba(255,250,235,${0.4 * k}) 25%, rgba(255,250,235,0) 70%)` }} />;
        })}
        <AbsoluteFill style={{ background: '#FFFBEF', opacity: [0, 1, 2, 3, 4].reduce((m, i) => { const at = fRec + 8 + i * 9 + Math.round(random(`fl${i}`) * 4); return Math.max(m, interpolate(frame, [at, at + 2, at + 8], [0, 0.22, 0], clamp)); }, 0) }} />
      </AbsoluteFill>
      <PaperFinish opacity={0.45} vignette={0.65} warm={0.3} />
      <Slate text="Estocolmo · diciembre de 1982" a={fYear - 4} b={fYear + 40} out={t1 - 12} x={110} y={90} />
      {fGar < 0 && null}
    </Rig>
  );
};

// Primer plano de la medalla con el brillo; «Premio Nobel de Literatura»
const MedalShot: React.FC<{ t0: number; t1: number; fNob: number; fLit: number }> = ({ t0, t1, fNob, fLit }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 520, s: 1.15 }, { f: t1, x: 960, y: 500, s: 1.0 }], 0.5);
  const inP = sp(frame, t0, 13, 140);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#120A06'], [100, '#050302']]} glows={[{ x: 960, y: 460, r: 700, c: '#FFD98A', a: 0.35 }]} />
      <Layer z={1}>
        <Halo x={960} y={460} r={520} a={0.4} />
        <Medal x={960} y={460 + (1 - inP) * 120} r={250} rot={(1 - inP) * -14 + Math.sin(frame / 30) * 2} glint={interpolate(frame, [fNob + 4, fNob + 34], [0, 1], clamp)} />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.65} warm={0.3} />
      <CardTag text="Premio Nobel de Literatura" x={600} y={800} a={fNob - 2} rot={-2} />
      {fLit < 0 && null}
    </Rig>
  );
};

// «Hoy… supera los cincuenta millones»: la cámara se aleja y un libro se vuelve una pared infinita de libros
const BookWall: React.FC<{ t0: number; t1: number; fHoy: number; fCinc: number; fMill: number; fVend: number }> = ({ t0, t1, fHoy, fCinc, fMill, fVend }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 540, s: 1.9 }, { f: fHoy + 30, x: 960, y: 540, s: 1.5 }, { f: fVend + 10, x: 960, y: 540, s: 0.42 }, { f: t1, x: 960, y: 540, s: 0.4 }], 0.4);
  const n = Math.round(interpolate(frame, [fCinc - 4, fMill + 30], [0, 50], { ...clamp, easing: easeOut }));
  const cells: React.ReactNode[] = [];
  const CW = 250, CH = 350;
  for (let gy = -4; gy <= 4; gy++) {
    for (let gx = -10; gx <= 10; gx++) {
      const d = Math.hypot(gx, gy * 1.3);
      const at = fHoy + 4 + Math.pow(d, 0.85) * 13 + random(`bw${gx}${gy}`) * 8;
      if (d > 0 && frame < at) continue;
      const p = d === 0 ? 1 : rampOut(frame, at, at + 12);
      const col = ['#1E2A33', '#22303A', '#1A252E', '#2A2A36'][Math.floor(random(`bc${gx}${gy}`) * 4)];
      cells.push(<g key={`${gx}_${gy}`} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}><CoverFront x={960 + gx * CW} y={540 + gy * CH} w={200} c={col} title={d === 0 ? 'Cien años de soledad' : undefined} detail /></g>);
    }
  }
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0E0A07'], [100, '#050302']]} glows={[{ x: 960, y: 540, r: 900, c: '#FFD98A', a: 0.22 }]} />
      <Layer z={1}>
        <Halo x={960} y={540} r={900} a={0.25} />
        {cells}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.7} warm={0.2} />
      {frame > fCinc - 8 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#F4EAD5', padding: '26px 70px 22px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', textAlign: 'center', transform: `rotate(-1.5deg) scale(${0.85 + 0.15 * sp(frame, fCinc - 8, 13, 170)})`, opacity: rampOut(frame, fCinc - 8, fCinc + 2) }}>
            <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 52, color: '#2A2620', lineHeight: 1 }}>más de</div>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 150, color: '#B5262B', lineHeight: 1.05 }}>{n} millones</div>
            <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 38, color: '#2A2620', letterSpacing: 2 }}>de ejemplares vendidos</div>
          </div>
        </div>
      )}
    </Rig>
  );
};

// «…traducido a más de cuarenta idiomas»: el título del libro cambia de lengua
const Translations: React.FC<{ t0: number; t1: number; fTrad: number; fCuar: number; fIdi: number }> = ({ t0, t1, fTrad, fCuar, fIdi }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 540, s: 0.9 }, { f: t1, x: 960, y: 540, s: 1.05 }], 0.4);
  const step = 9;
  const k = Math.floor((frame - fTrad) / step);
  const last = TRANSLATIONS.length;
  const showOrig = k < 0 || k >= last;
  const [title, lang] = showOrig ? ['Cien años de soledad', 'ESPAÑOL'] : TRANSLATIONS[k];
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0E0A07'], [100, '#050302']]} glows={[{ x: 960, y: 540, r: 800, c: '#FFD98A', a: 0.3 }]} />
      <Layer z={0.5}>
        {/* a los lados, más ejemplares en sombra */}
        {[-3, -2, -1, 1, 2, 3].map((g) => <CoverFront key={g} x={960 + Math.sign(g) * (230 + Math.abs(g) * 380)} y={560} w={300} c="#141C22" />)}
      </Layer>
      <Layer z={1}>
        <Halo x={960} y={540} r={620} a={0.32} />
        <CoverFront x={960} y={540} w={520} title={title} sub={lang} titleSize={title.length > 22 ? 58 : 68} />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.7} warm={0.2} />
      <CardTag text="más de 40 idiomas" x={1180} y={130} a={fCuar - 4} rot={3} red />
      {fIdi < 0 && null}
    </Rig>
  );
};

// «El propio Gabo dijo que…»: en un sillón, ante un micrófono; detrás, un mapa del mundo en la pared. Al decir «si todos
// sus lectores…», la cámara se lanza dentro de ese mapa (y el plano siguiente es el mapa entero).
const WALL_MAP = { x: 1180, y: 170, w: 480 };
const GaboSays: React.FC<{ t0: number; t1: number; fDijo: number }> = ({ t0, t1, fDijo }) => {
  const frame = useCurrentFrame();
  const k = WALL_MAP.w / 1920;
  const mapCx = WALL_MAP.x + WALL_MAP.w / 2, mapCy = WALL_MAP.y + (1000 * k) / 2 - 10 * k;
  const cam = useCamera([
    { f: t0, x: 900, y: 560, s: 1.12 },
    { f: t1 - 40, x: 960, y: 520, s: 1.26 },
    { f: t1, x: mapCx, y: mapCy, s: 1920 / WALL_MAP.w, ez: 1 },
  ], 0.4);
  const talk = frame > fDijo - 10 && frame < t1 - 30 ? Math.sin((frame - fDijo) / 7) : 0;
  const lamp = 0.9 + 0.1 * Math.sin(frame / 9) * Math.sin(frame / 23);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3A2A1C'], [100, '#1A120B']]} glows={[{ x: 1420, y: 300, r: 600, c: '#FFD98A', a: 0.3 }, { x: 420, y: 520, r: 520, c: '#FFC27A', a: 0.3 * lamp }]} />
      <Layer z={0.6}>
        {/* estantería */}
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={150 + i * 30} y={300 - (i % 3) * 8} width={24} height={110 + (i % 3) * 8} fill="#24180F" />)}
        {Array.from({ length: 9 }).map((_, i) => <rect key={`b${i}`} x={170 + i * 34} y={466 - (i % 2) * 10} width={28} height={92 + (i % 2) * 10} fill="#24180F" />)}
        <rect x={130} y={410} width={380} height={12} fill="#24180F" />
        <rect x={130} y={558} width={380} height={12} fill="#24180F" />
      </Layer>
      <Layer z={1} html>
        {/* el mapa del mundo de la pared (mismo dibujo que el plano siguiente) */}
        <div style={{ position: 'absolute', left: WALL_MAP.x - 22, top: WALL_MAP.y - 22, width: WALL_MAP.w + 44, height: 1000 * k + 44, background: '#24180F', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: WALL_MAP.x, top: WALL_MAP.y, width: WALL_MAP.w, height: 1000 * k, background: '#050B14', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1040, transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <WorldMap base="#1A2B3D" fill={() => '#1A2B3D'} style={{ top: 0 }} />
          </div>
        </div>
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={860} width={2520} height={400} fill="#120B06" />
        {/* lámpara de pie */}
        <line x1={420} y1={860} x2={420} y2={520} stroke="#0B0604" strokeWidth={8} />
        <path d="M 360 520 L 384 450 L 456 450 L 480 520 Z" fill="#0B0604" />
        <ellipse cx={420} cy={522} rx={60} ry={8} fill="#FFD98A" opacity={0.6 * lamp} />
        {/* sillón */}
        <path d="M 640 860 L 650 640 C 650 600, 700 590, 720 620 L 730 700 L 930 700 C 960 700, 970 730, 960 760 L 950 860 Z" fill="#1E140C" />
        <Person x={760} y={862} scale={2.2} kind="man" hair="curly" mustache pose={sitPose({ lean: 4, neck: -4 + talk * 2, shF: 40 + talk * 14, elF: 70 + talk * 12, shB: 10, elB: 70 })} c="#0B0604" back="#1E140C" />
        {/* micrófono de pie */}
        <line x1={1120} y1={860} x2={1120} y2={600} stroke="#0B0604" strokeWidth={8} />
        <line x1={1120} y1={600} x2={1040} y2={560} stroke="#0B0604" strokeWidth={7} />
        <rect x={1010} y={538} width={44} height={30} rx={12} fill="#0B0604" transform="rotate(-25 1032 553)" />
        <path d="M 1080 860 L 1160 860 L 1120 846 Z" fill="#0B0604" />
        <VoiceWaves x={870} y={500} t={frame} reach={150} n={3} on={rampOut(frame, fDijo - 30, fDijo - 10) * (1 - ramp(frame, t1 - 34, t1 - 20))} />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.3} />
    </Rig>
  );
};

// «…si todos sus lectores se juntaran en un mismo territorio…»: las luces de los lectores, por todo el mapa, se reúnen en una isla
const ISLAND: [number, number] = [752, 418]; // océano Atlántico (coordenadas del mapa)
const islandR = (a: number) => 1 + 0.16 * Math.sin(a * 3 + 1) + 0.09 * Math.cos(a * 5 + 2) + 0.05 * Math.sin(a * 9);
const islandPath = (R: number) => {
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = R * islandR(a);
    d += `${i ? 'L' : 'M'} ${(ISLAND[0] + Math.cos(a) * r).toFixed(1)} ${(ISLAND[1] + Math.sin(a) * r * 0.75).toFixed(1)} `;
  }
  return d + 'Z';
};
const LIGHTS = (() => {
  const withC = WORLD_COUNTRIES.filter((c) => c.c);
  return Array.from({ length: 520 }).map((_, i) => {
    const r = (k: string) => random(`rl${i}${k}`);
    const src = withC[Math.floor(r('c') * withC.length)].c as [number, number];
    const a = r('a') * Math.PI * 2;
    const rr = Math.sqrt(r('r')) * 0.92;
    return {
      from: [src[0] + (r('x') - 0.5) * 30, src[1] + (r('y') - 0.5) * 20] as [number, number],
      to: [ISLAND[0] + Math.cos(a) * rr * 78 * islandR(a), ISLAND[1] + Math.sin(a) * rr * 58 * islandR(a)] as [number, number],
      d: r('d'), s: 1.6 + r('s') * 1.6,
    };
  });
})();
const ReadersCountry: React.FC<{ t0: number; end: number; fLect: number; fJunt: number; fTerr: number; fForm: number; fVein: number }> = ({ t0, end, fLect, fJunt, fTerr, fForm, fVein }) => {
  const frame = useCurrentFrame();
  const MY = 40; // el mapa se dibuja 40 px más abajo
  const cam = useCamera([
    { f: t0, x: 960, y: 520, s: 1.0 },
    { f: fJunt + 10, x: 900, y: 500, s: 1.08 },
    { f: fTerr + 30, x: ISLAND[0] + 30, y: ISLAND[1] + MY - 24, s: 2.4 },
    { f: end, x: ISLAND[0] + 36, y: ISLAND[1] + MY - 24, s: 2.6 },
  ], 0.4);
  const land = ramp(frame, fTerr - 6, fTerr + 26, easeOut);
  const flag = sp(frame, fForm + 4, 11, 140);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#050B14'], [100, '#0A1626']]} />
      <Layer z={1} html>
        <WorldMap base="#1A2B3D" fill={() => '#1A2B3D'} style={{ top: MY }} />
        <svg width={1920} height={1000} style={{ position: 'absolute', left: 0, top: MY, overflow: 'visible' }}>
          {/* la isla de los lectores */}
          <path d={islandPath(92 * (0.4 + 0.6 * land))} fill="#FFD98A" opacity={0.12 * land} />
          <path d={islandPath(80 * (0.3 + 0.7 * land))} fill="#3B4A2E" opacity={land} stroke="#E9C77A" strokeWidth={1.4} />
          {LIGHTS.map((l, i) => {
            const on = rampOut(frame, fLect - 6 + l.d * 26, fLect + 6 + l.d * 26);
            if (on <= 0) return null;
            const m = interpolate(frame, [fJunt - 6 + l.d * 40, fJunt + 50 + l.d * 40], [0, 1], { ...clamp, easing: easeInOut });
            const x = l.from[0] + (l.to[0] - l.from[0]) * m;
            const y = l.from[1] + (l.to[1] - l.from[1]) * m - Math.sin(m * Math.PI) * 60;
            const tw = 0.7 + 0.3 * Math.sin(frame / 6 + i);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={l.s * 3} fill="#FFD98A" opacity={0.18 * on * tw} />
                <circle cx={x} cy={y} r={l.s * on * (1 - land * 0.35)} fill="#FFE7B0" opacity={on} />
              </g>
            );
          })}
          {/* la bandera de la mariposa */}
          {frame > fForm && (
            <g transform={`translate(${ISLAND[0] + 6} ${ISLAND[1] - 4}) scale(${flag})`}>
              <line x1={0} y1={0} x2={0} y2={-58} stroke="#F4EAD5" strokeWidth={2} />
              <path d={`M 0 -58 C 14 ${-60 + Math.sin(frame / 6) * 2}, 26 ${-54 - Math.sin(frame / 6) * 2}, 40 -56 L 40 -34 C 26 ${-32 + Math.sin(frame / 6) * 2}, 14 ${-38 - Math.sin(frame / 6) * 2}, 0 -36 Z`} fill="#F4EAD5" />
            </g>
          )}
        </svg>
      </Layer>
      {frame > fForm && (
        <AbsoluteFill>
          {/* (en pantalla) mariposas alrededor de la isla */}
          {Array.from({ length: 7 }).map((_, i) => {
            const t = (frame - fForm - i * 5) / 50;
            if (t < 0) return null;
            return <Butterfly key={i} x={980 + Math.cos(t * 2 + i) * (260 + i * 30)} y={560 - t * 80 + Math.sin(t * 3 + i) * 60} size={40 + (i % 3) * 10} seed={`rc${i}`} glow={0.7} opacity={Math.min(1, t * 4)} />;
          })}
        </AbsoluteFill>
      )}
      <PaperFinish opacity={0.4} vignette={0.6} />
      <HandLabel text="el país de los lectores" x={1010} y={800} a={fTerr + 16} out={1e9} size={66} />
      <CardTag text="uno de los 20 países más poblados del mundo" x={300} y={120} a={fVein - 6} rot={-2} red size={56} />
      {/* bandera: mariposa amarilla (encima, en pantalla, para que se vea nítida) */}
      {frame > fForm && (() => {
        const fx = 960 + (ISLAND[0] + 6 + 20 - cam.x) * cam.s;
        const fy = 540 + (ISLAND[1] + MY - 47 - cam.y) * cam.s;
        return <Butterfly x={fx} y={fy} size={24 * cam.s * flag} seed="flag" flap={0.4} glow={0.4} />;
      })()}
    </Rig>
  );
};

// ——— CINE v2 · W27–W28 ———
export const Cine2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CINE');
  const fDec = c.at('W27', 'décadas');
  const fNeg = c.at('W27', 'negó');
  const fCine = c.at('W27', 'cine');
  const fCre = c.at('W27', 'Creía');
  const fCab = c.at('W27', 'cabía');
  const fTiem = c.at('W27', 'tiempo');
  const fPel = c.at('W27', 'película');
  const fCont = c.at('W27', 'contarla');
  const fOtro = c.at('W27', 'otro');
  const fEsp = c.at('W27', 'español');
  const fJus = c.at('W27', 'justicia');
  const fCasi = c.at('W28', 'Casi');
  const fMue = c.at('W28', 'muerte');
  const fDia = c.at('W28', 'día');
  const fNov = c.at('W28', 'noventa');
  const fNet = c.at('W28', 'Netflix');
  const fHij = c.at('W28', 'hijos');
  const fCed = c.at('W28', 'cedido');
  const fDer = c.at('W28', 'derechos');
  const fSerie = c.at('W28', 'serie');
  const fRod = c.at('W28', 'rodó');
  const fCol = c.at('W28', 'Colombia');
  const fEsp2 = c.at('W28', 'español');
  const fPrim = c.at('W28', 'primera');
  const fDic = c.at('W28', 'diciembre');
  const fSeg = c.at('W28', 'segunda');
  const fCerr = c.at('W28', 'cerró');
  const fAgo = c.at('W28', 'agosto');
  const fSolo = c.at('W28', 'Solo');
  const fVent = c.at('W28', 'ventas');
  const fDisp = c.at('W28', 'dispararon');
  const fTres = c.at('W28', 'trescientos');
  const end = c.dur;
  const tReel = fCre - 8;
  const tCal = fCasi - 14;
  const tSign = fNet - 10;
  const tSet = fSerie - 12;
  const tSofa = fPrim - 16;
  const tSales = fSolo - 12;
  let shot: React.ReactNode;
  if (frame < tReel) shot = <Offers t1={tReel} fDec={fDec} fNeg={fNeg} fCine={fCine} />;
  else if (frame < tCal) shot = <Projector t0={tReel} t1={tCal} fCab={fCab} fTiem={fTiem} fPel={fPel} fCont={fCont} fOtro={fOtro} fEsp={fEsp} fJus={fJus} />;
  else if (frame < tSign) shot = <Birthday t0={tCal} t1={tSign} fMue={fMue} fDia={fDia} fNov={fNov} />;
  else if (frame < tSet) shot = <Signing t0={tSign} t1={tSet} fNet={fNet} fHij={fHij} fCed={fCed} fDer={fDer} />;
  else if (frame < tSofa) shot = <FilmSet t0={tSet} t1={tSofa} fRod={fRod} fCol={fCol} fEsp={fEsp2} />;
  else if (frame < tSales) shot = <Premiere t0={tSofa} t1={tSales} fDic={fDic} fSeg={fSeg} fCerr={fCerr} fAgo={fAgo} />;
  else shot = <Sales t0={tSales} end={end} fVent={fVent} fDisp={fDisp} fTres={fTres} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="hdl_paper_slide" at={offerAt(fNeg, i) - 4} volume={0.6} />)}
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="stamp" at={offerAt(fNeg, i) + 12} volume={0.6} />)}
      <Sfx name="sk_projector" at={tReel} volume={0.45} dur={tCal - tReel} fade={20} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="marker" at={fOtro + 2 + i * 10} volume={0.55} />)}
      <Sfx name="shimmer" at={fEsp} volume={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} name="hdl_tear" at={tCal + 12 + i * 9} volume={0.4} />)}
      <Sfx name="hdl_candle" at={fNov} volume={0.8} />
      <Sfx name="hdl_folder" at={fCed + 16} volume={0.9} />
      <Sfx name="stamp" at={fDer + 6} volume={0.8} />
      <Sfx name="hdl_film" at={fRod - 2} volume={0.6} />
      <Sfx name="hdl_clapper" at={fRod + 6} volume={0.9} />
      <Sfx name="card_flip" at={fDic - 4} volume={0.4} />
      <Sfx name="card_flip" at={fAgo - 4} volume={0.4} />
      <Sfx name="hdl_flutter" at={fCerr + 4} volume={0.6} />
      <Sfx name="sk_book_thud" at={tSales + 10} volume={0.4} />
      <Sfx name="hdl_tally" at={fTres - 4} volume={0.8} dur={40} fade={8} />
      <Sfx name="hit_soft" at={fTres + 30} volume={0.6} />
    </AbsoluteFill>
  );
};

const offerAt = (fNeg: number, i: number) => fNeg - 24 + i * 22;

// La mesa vista desde arriba (madera, luz de lámpara) y el sello en una mano que entra por la derecha.
// `lift` 0 = apoyado (sellando) … 1 = levantado; (sx, sy) = centro del sello.
const TopDesk: React.FC<{ children: React.ReactNode; sx: number; sy: number; lift: number; handOn: number; light?: number }> = ({ children, sx, sy, lift, handOn, light = 0.35 }) => {
  const sc = 1 + lift * 0.14;
  const off = 10 + lift * 34;
  return (
    <>
      <AbsoluteFill style={{ background: '#4A3220' }} />
      <Layer z={1}>
        {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M -300 ${i * 46 + random(`wg${i}`) * 20} C 400 ${i * 46 + 14 * Math.sin(i)}, 1200 ${i * 46 - 10}, 2220 ${i * 46 + random(`wh${i}`) * 24}`} stroke="#3A2516" strokeWidth={2 + random(`ww${i}`) * 3} fill="none" opacity={0.6} />)}
        <Halo x={900} y={520} r={1000} a={light} />
        {children}
        {/* sombra del sello y de la mano */}
        <g opacity={handOn * 0.35} transform={`translate(${sx + off} ${sy + off * 1.2})`}>
          <rect x={-80} y={-62} width={160} height={124} rx={10} fill="#000" />
          <path d="M 40 -40 L 1200 -60 L 1200 60 L 40 40 Z" fill="#000" />
        </g>
        <g opacity={handOn} transform={`translate(${sx} ${sy}) scale(${sc})`}>
          <rect x={-80} y={-62} width={160} height={124} rx={10} fill="#3A2416" />
          <rect x={-72} y={-54} width={144} height={108} rx={8} fill="#5A3A22" />
          <circle r={40} fill="#2A1A10" />
          <circle r={30} fill="#4A3020" />
          <Hand x={150} y={0} rot={180} scale={1.5} curl={1} c="#0B0604" sleeve="#1E140C" />
        </g>
      </Layer>
    </>
  );
};

// Sello estampado en tinta roja (NO / SÍ).
const InkStamp: React.FC<{ text: string; at: number; x: number; y: number; rot?: number; size?: number }> = ({ text, at, x, y, rot = -12, size = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = 1 + 0.35 * (1 - ramp(frame, at, at + 6));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size * k})`} opacity={0.92}>
      <rect x={-86} y={-46} width={172} height={92} rx={12} fill="none" stroke="#B5262B" strokeWidth={8} />
      <text x={0} y={26} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={76} letterSpacing={4} fill="#B5262B">{text}</text>
    </g>
  );
};

// Sobre de una oferta (sin marca): emblema de rollo de película y «DERECHOS · CINE».
const OfferEnvelope: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-214} y={-126} width={440} height={270} fill="#000" opacity={0.25} />
    <rect x={-220} y={-135} width={440} height={270} fill="#EFE3C6" />
    <path d="M -220 -135 L 0 10 L 220 -135" fill="none" stroke="#CDB98F" strokeWidth={3} />
    <g transform="translate(-160 -80)"><circle r={24} fill="none" stroke="#5A4A38" strokeWidth={4} />{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={Math.cos(k * 1.256) * 12} cy={Math.sin(k * 1.256) * 12} r={4} fill="#5A4A38" />)}</g>
    <text x={-40} y={70} fontFamily='"Special Elite", monospace' fontSize={28} fill="#5A4A38">DERECHOS · CINE</text>
    {[0, 1].map((k) => <rect key={k} x={-40} y={86 + k * 18} width={200 - k * 60} height={6} fill="#8A7A5A" opacity={0.5} />)}
  </g>
);

// «Durante décadas se negó…»: llegan ofertas a su mesa (vista desde arriba) y una mano las sella: NO. En el taco, pasan los años.
const Offers: React.FC<{ t1: number; fDec: number; fNeg: number; fCine: number }> = ({ t1, fDec, fNeg, fCine }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 900, y: 540, s: 1.0 }, { f: t1, x: 920, y: 560, s: 1.1 }], 0.4);
  const years = [1970, 1980, 1990, 2000, 2010];
  const yi = Math.min(years.length - 1, Math.floor(interpolate(frame, [fDec - 6, t1 - 20], [0, years.length - 0.01], clamp)));
  const pos = (i: number): [number, number, number] => [1180 - i * 120 + (random(`ofx${i}`) - 0.5) * 30, 330 + i * 110 + (random(`ofy${i}`) - 0.5) * 20, (random(`ofr${i}`) - 0.5) * 14];
  let lift = 1;
  let cur = 0;
  [0, 1, 2, 3, 4].forEach((i) => {
    const h = offerAt(fNeg, i) + 12;
    if (frame >= h - 14) cur = i;
    lift = Math.min(lift, 1 - interpolate(frame, [h - 8, h, h + 3, h + 14], [0, 1, 1, 0], clamp));
  });
  const [px, py] = pos(cur);
  const handOn = ramp(frame, offerAt(fNeg, 0) - 10, offerAt(fNeg, 0) + 4) * (1 - ramp(frame, t1 - 16, t1));
  return (
    <Rig cam={cam}>
      <TopDesk sx={px + 100 + lift * 260 + (1 - handOn) * 500} sy={py - 50 - lift * 170} lift={lift} handOn={handOn}>
        {/* taco de calendario: pasan las décadas */}
        <g transform="translate(330 240) rotate(-4)">
          <rect x={-120} y={-110} width={240} height={220} fill="#000" opacity={0.25} transform="translate(10 12)" />
          <rect x={-120} y={-110} width={240} height={220} fill="#EDE2C8" />
          <rect x={-120} y={-110} width={240} height={50} fill="#7A2E2A" />
          <text x={0} y={-74} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={26} letterSpacing={5} fill="#F4EAD5">AÑO</text>
          <text x={0} y={62} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={96} fill="#1D1A16">{years[yi]}</text>
        </g>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = offerAt(fNeg, i);
          if (frame < a - 14) return null;
          const p = interpolate(frame, [a - 14, a + 4], [0, 1], { ...clamp, easing: easeOut });
          const [x, y, r] = pos(i);
          return (
            <g key={i} transform={`translate(${(1 - p) * -1200} ${(1 - p) * -200})`}>
              <OfferEnvelope x={x} y={y} rot={r} />
              <InkStamp text="NO" at={a + 12} x={x + 100} y={y - 50} rot={r - 12} />
            </g>
          );
        })}
      </TopDesk>
      <PaperFinish opacity={0.4} vignette={0.6} warm={0.3} />
      <Slate text="derechos para el cine" a={fCine - 30} b={fCine + 4} out={t1 - 10} x={110} y={960} />
    </Rig>
  );
};

// El proyector: la película no cabe (la cinta se desborda) y los idiomas que no.
const LANGS = ['English', 'Français', 'Deutsch', 'Italiano'];
const Projector: React.FC<{ t0: number; t1: number; fCab: number; fTiem: number; fPel: number; fCont: number; fOtro: number; fEsp: number; fJus: number }> = ({ t0, t1, fCab, fTiem, fPel, fCont, fOtro, fEsp, fJus }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 700, y: 600, s: 1.25 }, { f: fPel + 10, x: 740, y: 620, s: 1.15 }, { f: fCont + 6, x: 1180, y: 520, s: 1.12 }, { f: t1, x: 1200, y: 520, s: 1.2 }], 0.5);
  const spin = (frame - t0) * 7;
  const spill = interpolate(frame, [fCab - 20, fCont], [0, 1], clamp);
  const loops = Math.floor(spill * 14);
  const screenOn = rampOut(frame, t0, t0 + 20);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3A2C20'], [100, '#1A120B']]} glows={[{ x: 560, y: 480, r: 600, c: '#FFD98A', a: 0.25 }, { x: 1560, y: 520, r: 700, c: '#FFE7B0', a: 0.2 }]} />
      <Layer z={1}>
        <rect x={-300} y={860} width={2520} height={400} fill="#120B06" />
        {/* el haz del proyector hacia la pantalla */}
        <path d="M 640 560 L 1240 300 L 1240 760 Z" fill="#FFE7B0" opacity={0.08 * screenOn} />
        {/* pantalla */}
        <rect x={1240} y={280} width={640} height={500} fill="#E9DFC8" opacity={0.85 * screenOn} />
        <g opacity={screenOn}>
          {/* en la pantalla, la sombra de la casa con las mariposas */}
          <g transform="translate(1560 700) scale(0.42)"><CaribHouseSil x={0} y={0} c="#3A3026" light="#E9DFC8" w={1200} /></g>
          {Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={1340 + i * 110 + Math.sin(frame / 9 + i) * 14} cy={400 + Math.cos(frame / 11 + i) * 20} r={8} fill="#E2B13C" />)}
        </g>
        {/* proyector de bobinas */}
        <g transform="translate(560 640)">
          <line x1={-60} y1={40} x2={-120} y2={220} stroke="#120B06" strokeWidth={10} />
          <line x1={60} y1={40} x2={120} y2={220} stroke="#120B06" strokeWidth={10} />
          <line x1={0} y1={40} x2={0} y2={220} stroke="#120B06" strokeWidth={10} />
          <rect x={-150} y={-60} width={260} height={110} rx={14} fill="#120B06" />
          <rect x={100} y={-50} width={70} height={56} fill="#120B06" />
          {[[-80, -170], [60, -170]].map(([rx, ry], i) => (
            <g key={i} transform={`translate(${rx} ${ry}) rotate(${spin * (i ? 1 : 0.8)})`}>
              <circle r={86} fill="#120B06" />
              {[0, 1, 2].map((k) => <circle key={k} cx={Math.cos(k * 2.094) * 46} cy={Math.sin(k * 2.094) * 46} r={20} fill="#2A1C12" />)}
              <circle r={10} fill="#2A1C12" />
            </g>
          ))}
          <line x1={-80} y1={-170} x2={-20} y2={-60} stroke="#120B06" strokeWidth={6} />
          <line x1={60} y1={-170} x2={40} y2={-60} stroke="#120B06" strokeWidth={6} />
        </g>
        {/* la cinta que no cabe: sale de la bobina y se amontona en el suelo */}
        {spill > 0 && (
          <g>
            <path d={`M 700 470 C 820 ${500 + spill * 100}, 860 ${700}, ${820 + spill * 30} 860`} stroke="#2A1C12" strokeWidth={22} fill="none" />
            <path d={`M 700 470 C 820 ${500 + spill * 100}, 860 ${700}, ${820 + spill * 30} 860`} stroke="#E9D7B0" strokeWidth={22} strokeDasharray="5 13" fill="none" opacity={0.35} />
            {Array.from({ length: loops }).map((_, k) => {
              const r = (q: string) => random(`lp${k}${q}`);
              return <ellipse key={k} cx={760 + r('x') * 260 + k * 8} cy={850 - k * 7 - r('y') * 10} rx={70 + r('w') * 60} ry={18 + r('h') * 10} fill="none" stroke="#2A1C12" strokeWidth={18} transform={`rotate(${(r('r') - 0.5) * 20} 860 850)`} />;
            })}
          </g>
        )}
        {/* idiomas en la pantalla: tachados; queda el español */}
        {LANGS.map((l, i) => {
          const a = fOtro - 10 + i * 10;
          if (frame < a) return null;
          const p = rampOut(frame, a, a + 8);
          const cut = ramp(frame, a + 8, a + 16);
          const gone = ramp(frame, fEsp - 12, fEsp - 2);
          return (
            <g key={l} opacity={p * (1 - gone)} transform={`translate(${1330 + (i % 2) * 290} ${330 + Math.floor(i / 2) * 110}) rotate(${(i % 2 ? 2 : -3)})`}>
              <rect x={-10} y={-50} width={250} height={80} fill="#F4EAD5" />
              <text x={115} y={8} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={56} fill="#2A2620">{l}</text>
              <line x1={0} y1={-10} x2={230 * cut} y2={-14} stroke="#B5262B" strokeWidth={7} strokeLinecap="round" />
            </g>
          );
        })}
        {frame > fEsp - 6 && (
          <g transform={`translate(1560 530) scale(${sp(frame, fEsp - 4, 12, 170)}) rotate(-2)`}>
            <rect x={-200} y={-66} width={400} height={112} fill="#F4EAD5" />
            <rect x={-170} y={14} width={340 * ramp(frame, fEsp + 6, fEsp + 24)} height={18} fill="#F3C64B" opacity={0.75} />
            <text x={0} y={22} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={84} fill="#2A2620">español</text>
          </g>
        )}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.65} warm={0.2} />
      <CardTag text="¿cien años en una película?" x={120} y={130} a={fTiem - 6} rot={-2} />
      {fJus < 0 && null}
    </Rig>
  );
};

// «Casi cinco años después de su muerte, el día en que habría cumplido 92 años»: el calendario hasta el 6 de marzo de 2019
const Birthday: React.FC<{ t0: number; t1: number; fMue: number; fDia: number; fNov: number }> = ({ t0, t1, fMue, fDia, fNov }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 540, s: 1.0 }, { f: t1, x: 1000, y: 560, s: 1.12 }], 0.5);
  const years = [2014, 2015, 2016, 2017, 2018, 2019];
  const yi = Math.min(years.length - 1, Math.floor(interpolate(frame, [t0 + 8, fDia - 10], [0, years.length - 0.01], clamp)));
  const final = frame >= fDia - 10;
  const flame = rampOut(frame, fNov + 4, fNov + 18);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#2E2418'], [100, '#120C07']]} glows={[{ x: 960, y: 520, r: 800, c: '#FFD98A', a: 0.25 + 0.15 * flame }]} />
      <Layer z={1}>
        <g transform="translate(760 500)">
          <rect x={-200} y={-250} width={400} height={480} fill="#EDE2C8" />
          <rect x={-200} y={-250} width={400} height={96} fill="#7A2E2A" />
          <text x={0} y={-186} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={46} letterSpacing={8} fill="#F4EAD5">{final ? 'MARZO' : 'AÑO'}</text>
          {final
            ? <><text x={0} y={70} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={260} fill="#1D1A16">6</text><text x={0} y={180} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={600} fontSize={72} fill="#1D1A16">2019</text></>
            : <text x={0} y={90} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={150} fill="#1D1A16">{years[yi]}</text>}
          {/* hoja que se va */}
          {!final && (() => { const k = (interpolate(frame, [t0 + 8, fDia - 10], [0, years.length - 0.01], clamp)) % 1; return <rect x={-200} y={-154 + k * 300} width={400} height={384} fill="#EDE2C8" opacity={1 - k} transform={`rotate(${k * 24} 200 -154)`} />; })()}
        </g>
        {/* la vela del 92 */}
        <g transform="translate(1300 760)" opacity={rampOut(frame, fNov - 6, fNov + 6)}>
          <rect x={-170} y={-60} width={340} height={70} rx={8} fill="#24180F" />
          <rect x={-200} y={6} width={400} height={16} rx={8} fill="#1A100A" />
          {['9', '2'].map((d, i) => (
            <g key={d} transform={`translate(${-50 + i * 100} -60)`}>
              <text x={0} y={0} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={150} fill="#E9D7B0">{d}</text>
              <line x1={0} y1={-108} x2={0} y2={-126} stroke="#24180F" strokeWidth={3} />
              <ellipse cx={0} cy={-140 - Math.sin(frame / 3 + i) * 2} rx={8 * flame} ry={16 * flame} fill="#FFD98A" />
              <Halo x={0} y={-140} r={70 * flame + 1} a={0.6 * flame} />
            </g>
          ))}
        </g>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.3} />
      <Slate text="casi cinco años después" a={fMue - 50} b={fMue - 10} out={fDia - 12} x={110} y={960} />
      <Slate text="6 de marzo de 2019 · habría cumplido 92 años" a={fNov} b={fNov + 50} out={t1 - 10} x={110} y={960} />
    </Rig>
  );
};

// «Netflix anunció que sus hijos le habían cedido los derechos»: una carpeta cruza la mesa; en la misma mesa de las ofertas,
// el mismo sello dice esta vez SÍ.
const Signing: React.FC<{ t0: number; t1: number; fNet: number; fHij: number; fCed: number; fDer: number }> = ({ t0, t1, fNet, fHij, fCed, fDer }) => {
  const frame = useCurrentFrame();
  const tIns = fDer - 16;
  const cam = useCamera([{ f: t0, x: 960, y: 600, s: 1.08 }, { f: tIns, x: 1000, y: 640, s: 1.3 }], 0.5);
  if (frame >= tIns) return <SigningInsert t0={tIns} t1={t1} fDer={fDer} />;
  const slide = interpolate(frame, [fCed - 10, fCed + 20], [0, 1], { ...clamp, easing: easeInOut });
  const push = ramp(frame, fHij - 10, fCed + 10);
  const fx = 760 + slide * 420;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#2A3440'], [100, '#10161C']]} glows={[{ x: 960, y: 380, r: 800, c: '#FFE7B0', a: 0.3 }]} />
      <Layer z={0.6}>
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={160 + i * 340} y={160} width={260} height={420} fill="#4A5866" opacity={0.6} />)}
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={900} width={2520} height={400} fill="#0E1318" />
        <HangLampSil x={980} y={-60} />
        <rect x={420} y={700} width={1080} height={22} fill="#0B0F13" />
        <rect x={460} y={722} width={22} height={180} fill="#0B0F13" />
        <rect x={1440} y={722} width={22} height={180} fill="#0B0F13" />
        {/* los dos hermanos (siluetas genéricas) y, enfrente, la productora */}
        <Person x={500} y={902} scale={2.4} kind="man" hair="short" pose={{ lean: 6, shF: 30 + push * 34, elF: 40 - push * 24, shB: 0, elB: 10 }} c="#080B0E" back="#1A2129" />
        <Person x={660} y={902} scale={2.4} kind="man" hair="side" glasses pose={{ lean: 8, shF: 36 + push * 38, elF: 40 - push * 26, shB: 4, elB: 12 }} c="#0B0F13" back="#1E262E" />
        <Person x={1440} y={902} scale={2.4} face={-1} kind="woman" hair="bob" pose={{ lean: 6, shF: 20 + slide * 46, elF: 40 - slide * 16, shB: 0, elB: 12 }} c="#0B0F13" back="#1E262E" />
        <g transform={`translate(${fx} 692)`}>
          <rect x={-130} y={-16} width={260} height={18} fill="#C9A45C" />
          <rect x={-124} y={-22} width={248} height={8} fill="#E9D7B0" />
        </g>
      </Layer>
      <PaperFinish opacity={0.4} vignette={0.6} />
      <Slate text="Netflix anuncia la serie" a={fNet - 6} b={fNet + 30} out={tIns - 4} x={110} y={90} />
      <HandLabel text="los derechos" x={1020} y={520} a={fCed + 8} out={tIns - 6} size={64} />
    </Rig>
  );
};

const SigningInsert: React.FC<{ t0: number; t1: number; fDer: number }> = ({ t0, t1, fDer }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 940, y: 560, s: 1.05 }, { f: t1, x: 960, y: 560, s: 1.15 }], 0.4);
  const hit = fDer + 6;
  const lift = 1 - interpolate(frame, [hit - 8, hit, hit + 3, hit + 14], [0, 1, 1, 0], clamp);
  const handOn = ramp(frame, t0, t0 + 12);
  const inP = interpolate(frame, [t0 - 4, t0 + 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Rig cam={cam}>
      <TopDesk sx={1050 + lift * 260 + (1 - handOn) * 500} sy={600 - lift * 170} lift={lift} handOn={handOn} light={0.45}>
        <g transform={`translate(${(1 - inP) * -900} 0) rotate(-3 960 560)`}>
          <rect x={690} y={330} width={560} height={420} rx={6} fill="#000" opacity={0.25} transform="translate(12 14)" />
          <path d="M 690 330 L 860 330 L 890 300 L 1060 300 L 1090 330 L 1250 330 L 1250 750 L 690 750 Z" fill="#C9A45C" />
          <rect x={720} y={350} width={500} height={380} fill="#D6B46C" opacity={0.6} />
          <rect x={780} y={410} width={300} height={70} fill="#F4EAD5" />
          <text x={930} y={458} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={38} letterSpacing={3} fill="#2A2620">DERECHOS</text>
          <InkStamp text="SÍ" at={hit} x={1050} y={600} rot={-10} size={1.2} />
        </g>
      </TopDesk>
      <PaperFinish opacity={0.4} vignette={0.6} warm={0.3} />
    </Rig>
  );
};

const HangLampSil: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={0} y1={0} x2={0} y2={220} stroke="#05080B" strokeWidth={4} />
    <path d="M -90 300 L -40 220 L 40 220 L 90 300 Z" fill="#05080B" />
    <ellipse cx={0} cy={300} rx={90} ry={10} fill="#FFD98A" opacity={0.7} />
  </g>
);

// «La serie se rodó entera en Colombia y en español»: un rodaje en silueta frente a la casa del Caribe
const FilmSet: React.FC<{ t0: number; t1: number; fRod: number; fCol: number; fEsp: number }> = ({ t0, t1, fRod, fCol, fEsp }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 980, y: 560, s: 1.18 }, { f: t1, x: 920, y: 540, s: 1.0 }], 0.6);
  const clap = interpolate(frame, [fRod - 10, fRod + 4, fRod + 6], [0.5, 0.5, 0], clamp);
  const clapOut = ramp(frame, fRod + 20, fRod + 34);
  const sun = '#F2B66A';
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#E58E5A'], [55, '#F2C27A'], [100, '#F7DDA8']]} glows={[{ x: 1300, y: 700, r: 700, c: '#FFF2C8', a: 0.6 }]} />
      <Layer z={0.25}><Ridge y={760} c="#B36A4E" amp={120} seed="fs" /></Layer>
      <Layer z={0.6}>
        <CaribHouseSil x={1150} y={860} c="#3A2418" light={sun} w={1100} />
        <Banana x={420} y={880} h={420} c="#2E1C12" sway={Math.sin(frame / 30) * 3} seed="fs1" />
        <Tree x={1860} y={880} r={190} c="#2E1C12" seed="fs2" />
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={880} width={2520} height={400} fill="#1E120A" />
        {/* grúa con cámara y su operador */}
        <line x1={760} y1={880} x2={760} y2={560} stroke="#120A05" strokeWidth={14} />
        <path d="M 700 880 L 760 840 L 820 880 Z" fill="#120A05" />
        <g transform={`rotate(${-4 + Math.sin((frame - t0) / 40) * 5} 760 540)`}>
          <line x1={560} y1={540} x2={1020} y2={460} stroke="#120A05" strokeWidth={12} />
          <rect x={990} y={420} width={90} height={60} fill="#120A05" />
          <rect x={1076} y={436} width={34} height={28} fill="#120A05" />
          <circle cx={1010} cy={410} r={24} fill="#120A05" transform={`rotate(${frame * 3} 1010 410)`} />
          <circle cx={1060} cy={410} r={24} fill="#120A05" />
          <rect x={520} y={520} width={60} height={60} fill="#120A05" />
        </g>
        <Person x={860} y={882} scale={2.0} kind="man" hair="cap" pose={{ lean: 4, shF: 70 + Math.sin((frame - t0) / 40) * 8, elF: 20, shB: 50, elB: 30 }} c="#120A05" />
        {/* foco sobre trípode */}
        <line x1={1560} y1={880} x2={1560} y2={560} stroke="#120A05" strokeWidth={8} />
        <rect x={1520} y={500} width={80} height={70} fill="#120A05" transform="rotate(-20 1560 535)" />
        <Beam x={1520} y={540} w0={60} w1={500} len={500} rot={70} a={0.2 + 0.03 * Math.sin(frame / 3)} c="#FFF2C8" />
        {/* jirafa de sonido */}
        <Person x={1700} y={882} scale={2.0} face={-1} kind="woman" hair="bun" pose={{ lean: 2, shF: 150, elF: 10, shB: 140, elB: 20 }} c="#120A05" />
        <line x1={1690} y1={470} x2={1380} y2={380} stroke="#120A05" strokeWidth={6} />
        <rect x={1340} y={366} width={60} height={26} rx={12} fill="#120A05" />
      </Layer>
      {/* la claqueta, en primer plano */}
      <Layer z={1.25} opacity={1 - clapOut}>
        <g transform={`translate(${360} ${800 + clapOut * 200})`}>
          <rect x={-150} y={-60} width={300} height={190} fill="#0B0604" />
          <g transform={`rotate(${-clap * 30} -150 -60)`}>
            <rect x={-150} y={-100} width={300} height={40} fill="#0B0604" />
            {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${-140 + k * 60} -100 L ${-110 + k * 60} -100 L ${-130 + k * 60} -60 L ${-160 + k * 60} -60 Z`} fill="#E9D7B0" opacity={0.85} />)}
          </g>
          <text x={0} y={40} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={34} fill="#E9D7B0">ESCENA 1</text>
          <Hand x={-210} y={110} rot={-20} scale={1.3} curl={0.7} c="#050302" sleeve="#140C07" />
        </g>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.5} warm={0.3} />
      <CardTag text="rodada en Colombia" x={1220} y={130} a={fCol - 4} rot={2} />
      <CardTag text="en español" x={1360} y={260} a={fEsp - 4} rot={-3} red />
    </Rig>
  );
};

// «La primera parte… diciembre de 2024, y la segunda… agosto de 2026»: una familia frente a la pantalla
const Premiere: React.FC<{ t0: number; t1: number; fDic: number; fSeg: number; fCerr: number; fAgo: number }> = ({ t0, t1, fDic, fSeg, fCerr, fAgo }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.0 }, { f: t1, x: 960, y: 540, s: 1.1 }], 0.5);
  const second = frame >= fAgo - 6;
  const glow = 0.5 + 0.12 * Math.sin(frame / 5) + 0.08 * Math.sin(frame / 2.3);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0B1018'], [100, '#05080B']]} glows={[{ x: 960, y: 420, r: 800, c: '#9CC4E4', a: 0.3 * glow }]} />
      <Layer z={0.7}>
        {/* pantalla */}
        <rect x={560} y={160} width={800} height={460} rx={10} fill="#0A0E12" />
        <rect x={580} y={178} width={760} height={424} fill="#B9D3E6" opacity={glow} />
        <g opacity={0.8}>
          <g transform="translate(960 560) scale(0.5)"><CaribHouseSil x={0} y={0} c="#2A3A48" light="#B9D3E6" w={1200} /></g>
          {frame > fCerr && Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={700 + i * 90 + Math.sin(frame / 8 + i) * 12} cy={300 - ((frame - fCerr) * 1.4 + i * 20) % 120} r={9} fill="#E2B13C" />)}
        </g>
        {/* calendario que pasa de dic. 2024 a ago. 2026 */}
        <g transform="translate(1640 300)" opacity={rampOut(frame, fDic - 8, fDic + 4)}>
          <rect x={-110} y={-110} width={220} height={210} fill="#EDE2C8" />
          <rect x={-110} y={-110} width={220} height={54} fill="#7A2E2A" />
          <text x={0} y={-72} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={28} letterSpacing={4} fill="#F4EAD5">{second ? 'AGOSTO' : 'DICIEMBRE'}</text>
          <text x={0} y={52} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={84} fill="#1D1A16">{second ? '2026' : '2024'}</text>
        </g>
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={940} width={2520} height={400} fill="#05080B" />
        {/* sofá y familia, de espaldas */}
        <path d="M 520 960 L 520 800 C 520 770, 560 760, 600 760 L 1320 760 C 1360 760, 1400 770, 1400 800 L 1400 960 Z" fill="#070A0D" />
        {[[640, 'curly', 230], [800, 'bob', 220], [950, 'kid', 170], [1080, 'bun', 215], [1230, 'short', 230]].map(([x, h, s], i) => (
          <g key={i}>
            <g opacity={0.55 * glow} transform="translate(0 -3)"><Head x={x as number} y={800 - ((s as number) - 170) * 0.2} h={(s as number) + 4} face={i % 2 ? -1 : 1} hair={h as never} kid={h === 'kid'} c="#9CC4E4" /></g>
            <Head x={x as number} y={800 - ((s as number) - 170) * 0.2 + Math.sin(frame / (30 + i * 7) + i) * 1.5} h={s as number} face={i % 2 ? -1 : 1} hair={h as never} kid={h === 'kid'} c="#070A0D" />
          </g>
        ))}
        <rect x={500} y={770} width={40} height={190} rx={14} fill="#05080B" />
        <rect x={1380} y={770} width={40} height={190} rx={14} fill="#05080B" />
      </Layer>
      <PaperFinish opacity={0.4} vignette={0.6} />
      <CardTag text="1ª parte" x={140} y={140} a={fDic - 4} rot={-3} />
      <CardTag text="2ª parte · el final" x={140} y={270} a={fAgo - 4} rot={2} red />
      {fSeg < 0 && null}
    </Rig>
  );
};

// «Solo con la primera, las ventas del libro en Colombia se dispararon un 300 %»
const Sales: React.FC<{ t0: number; end: number; fVent: number; fDisp: number; fTres: number }> = ({ t0, end, fVent, fDisp, fTres }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.05 }, { f: end, x: 960, y: 520, s: 1.0 }], 0.5);
  const before = rampOut(frame, t0 + 8, t0 + 24);
  const shoot = interpolate(frame, [fDisp - 4, fTres + 30], [0, 1], { ...clamp, easing: easeOut });
  const pct = Math.round(shoot * 300);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#F2C27A'], [60, '#F7DDA8'], [100, '#EBD7B0']]} glows={[{ x: 1500, y: 220, r: 400, c: '#FFF7DC', a: 0.8 }]} />
      <Layer z={0.4}>
        <Ridge y={820} c="#C98E62" amp={110} seed="sl" />
        <Banana x={180} y={900} h={460} c="#7A5236" sway={Math.sin(frame / 30) * 3} seed="sl1" />
        <Banana x={1760} y={900} h={420} c="#7A5236" sway={Math.sin(frame / 28 + 1) * 3} seed="sl2" />
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={900} width={2520} height={400} fill="#3A2418" />
        <BookStack x={700} y={900} n={6} w={220} seed="sa" grow={before} c="#6E2B26" />
        <BookStack x={1180} y={900} n={24} w={220} seed="sb" grow={before * (0.25 + 0.75 * shoot)} c="#B5262B" />
        <text x={700} y={970} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={56} fill="#F4EAD5" opacity={before}>antes</text>
        <text x={1180} y={970} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={56} fill="#F4EAD5" opacity={before}>con la serie</text>
        {/* flecha que se dispara */}
        {shoot > 0 && (() => {
          const tipY = 900 - (6 + 18 * shoot) * 20 - 50;
          return (
            <g>
              <path d={`M 820 760 C 900 ${700}, 980 ${tipY + 60}, 1060 ${tipY}`} stroke="#B5262B" strokeWidth={12} fill="none" strokeLinecap="round" />
              <path d={`M 1060 ${tipY} l -44 4 l 26 30 Z`} fill="#B5262B" transform={`rotate(${-20} 1060 ${tipY})`} />
            </g>
          );
        })()}
      </Layer>
      <PaperFinish opacity={0.4} vignette={0.45} warm={0.2} />
      <CardTag text="solo con la 1ª parte" x={120} y={110} a={t0 + 4} rot={-2} />
      <CardTag text="ventas del libro en Colombia" x={160} y={240} a={fVent - 6} rot={2} />
      {frame > fTres - 6 && <CardTag text={`+${pct} %`} x={1340} y={250} a={fTres - 6} rot={4} red size={110} />}
    </Rig>
  );
};

export const _l = { WARM, CREAM, mix };

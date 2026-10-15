import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, BookCover, eIO, eOut, follow, img3, lerp, ramp, Rig, Space, sp, T } from './kit';
import { ChapterCard } from './frames';
import { InkStamp, Pen, shake } from './ink';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano H (S06): capítulo III, lo que conviene saber. Por qué es legal, en una línea del tiempo que una pluma dibuja
// sobre un pergamino que se desenrolla en la biblioteca: en Estados Unidos es de dominio público lo publicado hace 95
// años o más (hasta 1930); por eso no hay novedades, hay clásicos. Pero en España cuenta la muerte del autor: «Platero
// y yo» (Juan Ramón Jiménez, † 1958) no será libre hasta 2039, y lo dice un sello.
// ---------------------------------------------------------------------------------------------------------------
// Escala de años: comprimida antes de 1850 y más abierta después (solo se rotulan los años que importan)
const X = (y: number) => (y < 1850 ? (y - 1850) * 2.6 : (y - 1850) * 12);
const LINE_L = X(1530), LINE_R = X(2052);
type C = { id: string; title: string; year: number; up: boolean };
const CLASSICS: C[] = [
  { id: '3579', title: 'Lazarillo de Tormes', year: 1554, up: true },
  { id: '20198', title: 'Don Quijote', year: 1605, up: false },
  { id: '5079', title: 'Leyendas', year: 1871, up: true },
  { id: '13208', title: 'La Regenta', year: 1885, up: false },
  { id: '14336', title: 'Fortunata y Jacinta', year: 1887, up: true },
  { id: '9920', title: 'Platero y yo', year: 1914, up: true },
];
const CS = 200; // tamaño de portada
const ES_Y = 360; // pista de España
// Tinta
const INK = '#33261a', INK_SOFT = '#6b5640', GOLD_INK = '#8d5f1e', RED = '#a8322a', RED_SOFT = '#b8483b';
// Pergamino (coordenadas del mundo) y sus rodillos
const PX0 = -1350, PX1 = 2860, PY0 = -800, PY1 = 1000, PZ = -40, Q = 4;
const PW = PX1 - PX0, PH = PY1 - PY0;

// Rodillo del pergamino (cilindro vertical con pomos de madera); `spin` desplaza la textura como si girase
const Roll: React.FC<{ x: number; rw: number; spin: number; side: 1 | -1 }> = ({ x, rw, spin, side }) => (
  <At x={x} y={(PY0 + PY1) / 2} z={PZ + 14} w={rw + 44} h={PH + 120} flat>
    <div style={{ position: 'absolute', left: 22, top: 60, width: rw, height: PH,
      background: `repeating-linear-gradient(90deg, rgba(120,90,50,0) 0 ${rw * 0.16}px, rgba(120,90,50,0.16) ${rw * 0.16}px ${rw * 0.18}px), linear-gradient(90deg, #6f5a3c 0%, #cdb991 16%, #f6ecd6 38%, #fffaf0 46%, #e7d7b6 66%, #a88f66 86%, #5d4a30 100%)`,
      backgroundPosition: `${spin}px 0, 0 0`,
      boxShadow: `${side * -22}px 0 34px rgba(60,38,16,0.42)`, borderRadius: 6 }} />
    {[0, 1].map((k) => (
      <div key={k} style={{ position: 'absolute', left: 0, width: rw + 44, height: 56, top: k ? PH + 52 : 12, borderRadius: 14,
        background: 'linear-gradient(90deg, #2a1a10 0%, #6b4529 30%, #a57449 46%, #6b4529 64%, #2a1a10 100%)', boxShadow: '0 10px 24px rgba(0,0,0,0.45)' }}>
        <div style={{ position: 'absolute', left: 6, right: 6, top: 8, height: 6, borderRadius: 3, background: 'rgba(255,220,170,0.22)' }} />
      </div>
    ))}
  </At>
);

export const Legal: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S06', 'K06', word, n);
  const fY = at('¿Y'), fLegal = at('legal'), fPorque = at('Porque'), fEstados = at('Estados'), fUnidos = at('Unidos');
  const fPub = at('publicados'), fNov = at('noventa'), fAnos = at('años'), fNoved = at('novedades'), fClas = at('clásicos');
  const fEspana = at('España'), fPlatero = at('Platero'), fEstara = at('estará'), fDos = at('dos'), fNueve = at('nueve');
  const fHasta = at('hasta');

  const base = follow(frame, [
    { f: 0, x: -300, y: -120, z: -760, rx: 6, ry: 12 },
    { f: fLegal, x: -120, y: -150, z: -640, rx: 5, ry: 6 },
    { f: fUnidos, x: -60, y: -90, z: -700, rx: 4, ry: 3 },
    { f: fAnos, x: 1450, y: -80, z: -640, rx: 4, ry: -6 },
    { f: fNoved + 30, x: 1500, y: -40, z: -600, rx: 4, ry: -8 },
    { f: fClas + 34, x: 320, y: 10, z: -1050, rx: 5, ry: 2 },
    { f: fEspana + 30, x: 560, y: 150, z: -760, rx: 6, ry: -2 },
    { f: fPlatero + 20, x: 740, y: 40, z: -300, rx: 5, ry: -4 },
    { f: fDos, x: 1420, y: 190, z: -820, rx: 5, ry: -7 },
    { f: dur, x: 1450, y: 190, z: -880, rx: 5, ry: -8 },
  ], 4.2);
  const jolt = shake(frame, fNueve, 9, 5);
  const cam = { x: base.x + jolt.x, y: base.y + jolt.y, z: base.z, rx: base.rx, ry: base.ry };

  // El pergamino se desenrolla por delante de la pluma, que dibuja la línea de izquierda a derecha
  const unroll = ramp(frame, 56, 140, eIO);
  const R = lerp(PX0 + 150, PX1, unroll);
  const rollW = lerp(150, 78, unroll);
  const draw = ramp(frame, 92, 178, eIO);
  const band = ramp(frame, fPorque, fUnidos + 10, eIO);
  const us = ramp(frame, fEstados - 4, fEstados + 14, eOut);
  const hoy = sp(frame, fPub - 4, fps, 140, 22);
  const bracket = ramp(frame, fNov - 4, fAnos + 6, eIO);
  const ghosts = ramp(frame, fNoved - 10, fNoved + 10, eOut);
  const strike = ramp(frame, fNoved + 14, fNoved + 28, eOut);
  const spain = ramp(frame, fEspana - 6, fEspana + 26, eIO);
  const plat = ramp(frame, fPlatero - 4, fPlatero + 14, eOut);
  const link = ramp(frame, fEstara - 22, fEstara + 12, eIO);
  const dagger = ramp(frame, fEstara + 6, fEstara + 20, eOut);
  const redLine = ramp(frame, fHasta - 2, fNueve - 14, eIO);
  // el título se escribe cuando el pergamino ya ha pasado por debajo
  const q = ramp(frame, 96, 116, eOut);
  // «sin derechos de autor»: un © grande que se tacha
  const fSin = at('sin'), fDerechos = at('derechos');
  const copy = sp(frame, fSin - 10, fps, 110, 20) * (1 - ramp(frame, fPub - 6, fPub + 18, eIO));
  const copyStrike = ramp(frame, fDerechos - 2, fDerechos + 14, eOut);

  // La pluma: dónde está su punta en cada trazo (coordenadas del mundo) y cuándo se posa o se levanta
  const BW = X(2026) - X(1931);
  const bracketTip = (p: number) => {
    const l = p * (BW + 80);
    const lx = l < 40 ? BW : l < BW + 40 ? BW - (l - 40) : 0;
    const ly = l < 40 ? 80 - l : l < BW + 40 ? 40 : 40 + (l - BW - 40);
    return { x: X(1931) + lx, y: -295 + ly };
  };
  const LW = X(1958) - X(1914) + 112;
  const linkTip = (p: number) => {
    // punto de la curva en la altura que ya se ve (el trazo se descubre de arriba abajo)
    const yT = p * 440;
    let best = { x: 56, y: 14 };
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, u = 1 - t;
      const px = u * u * u * 56 + 3 * u * u * t * 56 + 3 * u * t * t * (LW - 56) + t * t * t * (LW - 56);
      const py = u * u * u * 14 + 3 * u * u * t * 260 + 3 * u * t * t * 200 + t * t * t * 422;
      if (py <= yT) best = { x: px, y: py };
    }
    return { x: X(1914) - 56 + best.x, y: 145 - 220 + best.y };
  };
  const strokes = [
    { a: 86, b: 98, c: draw, s: 92, e: 178, out: 190, tip: () => ({ x: LINE_L + draw * (LINE_R - LINE_L), y: 2 }) },
    { a: fNov - 14, b: fNov - 4, c: bracket, s: fNov - 4, e: fAnos + 6, out: fAnos + 18, tip: () => bracketTip(bracket) },
    { a: fEstara - 32, b: fEstara - 22, c: link, s: fEstara - 22, e: fNueve - 14, out: fNueve - 10, tip: () => (frame < fHasta - 2 ? linkTip(link) : { x: X(1958) + redLine * (X(2039) - X(1958)), y: ES_Y }) },
  ];
  const active = strokes.find((s) => frame >= s.a - 12 && frame <= s.out + 12);
  const pen = active ? (() => {
    const tip = active.tip();
    const down = ramp(frame, active.a, active.b, eOut);
    const up = ramp(frame, active.e, active.out, eIO);
    const wob = Math.sin(frame * 0.9) * 2.2 * (1 - up) * down;
    // al terminar, la pluma se levanta y sale por arriba a la derecha
    const away = ramp(frame, active.e + 2, active.out + 10, (t) => t * t);
    return { x: tip.x + wob + away * 260, y: tip.y + wob * 0.6 - away * 320, o: Math.min(ramp(frame, active.a - 12, active.a, eOut), 1 - ramp(frame, active.out, active.out + 10, eIO)), lift: 1 - down + up };
  })() : null;

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* el pergamino (dibujado a 1/Q y escalado: es muy grande) */}
          <At x={(PX0 + R) / 2} y={(PY0 + PY1) / 2} z={PZ} w={(R - PX0) / Q} h={PH / Q} s={Q} flat>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f0e3c8',
              backgroundImage: `radial-gradient(${PW * 0.12 / Q}px ${PH * 0.2 / Q}px at ${PW * 0.18 / Q}px ${PH * 0.75 / Q}px, rgba(190,150,90,0.14), rgba(190,150,90,0) 100%), radial-gradient(${PW * 0.1 / Q}px ${PH * 0.16 / Q}px at ${PW * 0.62 / Q}px ${PH * 0.22 / Q}px, rgba(190,150,90,0.12), rgba(190,150,90,0) 100%), radial-gradient(${PW * 0.6 / Q}px ${PH * 0.9 / Q}px at ${PW * 0.42 / Q}px ${PH * 0.4 / Q}px, rgba(255,251,240,0.7), rgba(255,251,240,0) 100%), url(${img3('paper.png')})`,
              backgroundSize: `auto, auto, auto, ${512 / Q}px ${512 / Q}px`, backgroundRepeat: 'no-repeat, no-repeat, no-repeat, repeat',
              boxShadow: `inset 0 ${10 / Q}px ${40 / Q}px rgba(120,84,40,0.28), inset 0 ${-10 / Q}px ${40 / Q}px rgba(120,84,40,0.28), 0 ${30 / Q}px ${70 / Q}px rgba(0,0,0,0.5)` }} />
            {/* sombra de los rodillos sobre el papel */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(90,60,25,0.28) 0, rgba(90,60,25,0) ${110 / Q}px, rgba(90,60,25,0) calc(100% - ${130 / Q}px), rgba(90,60,25,0.32) 100%)` }} />
          </At>
          <Roll x={PX0 - 30} rw={78} spin={0} side={-1} />
          <Roll x={R + rollW / 2 - 8} rw={rollW} spin={-R * 0.35} side={1} />

          {/* la pregunta, como título del pergamino */}
          <At x={-230} y={-590} w={1400} h={130} o={q}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 128, lineHeight: '130px', color: INK, transform: `translateY(${(1 - q) * 18}px)`, filter: q < 0.98 ? `blur(${(1 - q) * 4}px)` : undefined }}>¿Por qué es legal?</div>
          </At>
          {/* banda del dominio público en EE. UU. (hasta 1930), como un subrayado de rotulador dorado */}
          <At x={(LINE_L + X(1930.5)) / 2} y={0} z={-4} w={X(1930.5) - LINE_L} h={150} o={band}>
            <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left', transform: `scaleX(${band})`, background: 'linear-gradient(180deg, rgba(222,170,70,0) 0%, rgba(222,170,70,0.3) 24%, rgba(222,170,70,0.34) 50%, rgba(222,170,70,0.3) 76%, rgba(222,170,70,0) 100%)', borderRight: `3px solid rgba(141,95,30,${0.8 * band})` }} />
          </At>
          {/* la línea, en tinta */}
          <At x={(LINE_L + LINE_R) / 2} y={0} w={LINE_R - LINE_L} h={12}>
            <div style={{ position: 'absolute', left: 0, top: 2, height: 8, width: `${draw * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, rgba(51,38,26,0) 0%, ${INK} 3%, ${INK} 97%, rgba(51,38,26,0.2) 100%)` }} />
          </At>
          {/* © tachado */}
          <At x={-330} y={-280} z={30} w={420} h={420} o={Math.min(1, copy)}>
            <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.9 + 0.1 * Math.min(1, copy)})` }}>
              <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                <circle cx={210} cy={210} r={170} fill="none" stroke={INK} strokeWidth={14} />
                <path d="M 268 150 A 84 84 0 1 0 268 270" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
                {copyStrike > 0.01 && <path d="M 60 360 L 360 60" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${copyStrike} 1`} />}
              </svg>
            </div>
          </At>
          <At x={240} y={-280} z={30} w={620} h={90} o={Math.min(1, copy) * copyStrike}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 68, color: INK, whiteSpace: 'nowrap', transform: `translateX(${(1 - copyStrike) * -20}px)` }}>sin derechos de autor</div>
          </At>
          <At x={-200} y={94} w={900} h={64} o={us}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 48, color: GOLD_INK, whiteSpace: 'nowrap', transform: `translateY(${(1 - us) * 10}px)` }}>dominio público en Estados Unidos</div>
          </At>
          {/* 1930 y hoy */}
          <At x={X(1930.5)} y={0} w={300} h={300} o={hoy}>
            <div style={{ position: 'absolute', left: 148, top: 120, width: 4, height: 60, background: INK, borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: T.serif, fontWeight: 600, fontSize: 56, color: INK }}>1930</div>
          </At>
          <At x={X(2026)} y={0} w={300} h={300} o={hoy}>
            <div style={{ position: 'absolute', left: 138, top: 138, width: 24, height: 24, borderRadius: 12, background: T.teal, boxShadow: '0 0 0 6px rgba(46,109,125,0.18)', transform: `scale(${hoy})` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 186, textAlign: 'center', fontFamily: T.serif, fontSize: 56, color: INK }}>hoy</div>
          </At>
          {/* corchete de 95 años */}
          <At x={(X(1931) + X(2026)) / 2} y={-250} w={BW} h={90} o={Math.min(1, bracket * 3)}>
            <svg width={BW} height={90} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M ${BW} 80 L ${BW} 40 L 0 40 L 0 80`} fill="none" stroke={INK} strokeWidth={4} pathLength={1} strokeDasharray={`${bracket} 1`} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: -54, textAlign: 'center', fontFamily: T.serif, fontSize: 80, color: INK, opacity: ramp(frame, fNov, fNov + 16, eOut), transform: `translateY(${(1 - ramp(frame, fNov, fNov + 16, eOut)) * 12}px)`, fontVariantNumeric: 'tabular-nums' }}>{Math.round(95 * Easing.bezier(0.2, 0.9, 0.3, 1)(ramp(frame, fNov - 2, fAnos + 4, (t) => t)))} años o más</div>
          </At>
          {/* novedades (después de 1930): tachadas */}
          <At x={X(1985)} y={-112} z={20} w={620} h={140} o={ghosts}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 100, lineHeight: 1, color: strike > 0.5 ? INK_SOFT : INK, transform: `scale(${0.96 + 0.04 * ghosts})` }}>
              <span style={{ position: 'relative' }}>
                novedades
                <span style={{ position: 'absolute', left: -14, right: -14, top: '58%', height: 10, borderRadius: 5, background: RED, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-1.5deg)` }} />
              </span>
            </div>
          </At>
          {/* clásicos */}
          {CLASSICS.map((c, i) => {
            const s = sp(frame, fClas - 14 + i * 5, fps, 130, 20);
            const k = Math.min(1, s);
            const x = X(c.year);
            const y = c.up ? -170 : 170;
            // aterrizan desde arriba, inclinados, y se asientan
            const tilt = (c.up ? -1 : 1) * 9 * (1 - k);
            return (
              <React.Fragment key={c.id}>
                <At x={x} y={(c.up ? -1 : 1) * 36} w={4} h={72} o={k}>
                  <div style={{ position: 'absolute', inset: 0, background: INK_SOFT, transformOrigin: c.up ? 'bottom' : 'top', transform: `scaleY(${k})` }} />
                </At>
                <At x={x} y={y + (c.up ? -40 : 40) * (1 - k)} z={(1 - k) * 260 + (c.id === '9920' ? 40 * plat : 0)} w={CS} h={CS} o={k} ry={-4} rz={tilt} s={c.id === '9920' ? 1 + 0.12 * plat : 1}>
                  <BookCover id={c.id} size={CS} depth={18} />
                  {c.id === '9920' && <div style={{ position: 'absolute', inset: -8, borderRadius: 6, boxShadow: `0 0 0 5px rgba(168,50,42,${0.9 * plat})` }} />}
                  <div style={{ position: 'absolute', left: -50, right: -50, [c.up ? 'bottom' : 'top']: CS + 12, textAlign: 'center', fontFamily: T.serif, whiteSpace: 'nowrap' } as React.CSSProperties}>
                    <div style={{ fontSize: 46, color: INK, fontWeight: 600 }}>{c.year}</div>
                  </div>
                </At>
              </React.Fragment>
            );
          })}
          <At x={X(1700)} y={-330} w={700} h={84} o={ramp(frame, fClas, fClas + 16, eOut)}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 74, color: INK }}>clásicos</div>
          </At>
          {/* España */}
          <At x={(LINE_L + X(2039)) / 2} y={ES_Y} w={X(2039) - LINE_L} h={6} o={spain}>
            <div style={{ position: 'absolute', left: 0, top: 1, height: 4, width: `${spain * 100}%`, backgroundImage: `repeating-linear-gradient(90deg, ${RED_SOFT} 0 18px, rgba(0,0,0,0) 18px 30px)` }} />
          </At>
          <At x={-200} y={ES_Y - 54} w={440} h={74} o={spain}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontSize: 64, color: RED, whiteSpace: 'nowrap', transform: `translateY(${(1 - spain) * 10}px)` }}>en España</div>
          </At>
          {/* Platero: su autor murió en 1958 → 80 años después → 2039 */}
          <At x={(X(1914) - 56 + X(1958) + 56) / 2} y={145} z={4} w={LW} h={440} o={link > 0 ? 1 : 0}>
            <svg width={LW} height={440} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M 56 14 C 56 260, ${LW - 56} 200, ${LW - 56} 422`} fill="none" stroke={RED_SOFT} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round"
                style={{ clipPath: `inset(0 0 ${(1 - link) * 100}% 0)` }} />
            </svg>
          </At>
          <At x={X(1958)} y={ES_Y} z={8} w={64} h={64} o={dagger} s={0.6 + 0.4 * dagger}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 32, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 44, color: '#fff2e8', lineHeight: 1 }}>†</div>
          </At>
          <At x={X(1958)} y={ES_Y + 78} w={640} h={62} o={dagger}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 48, color: INK, whiteSpace: 'nowrap' }}>Juan Ramón Jiménez, † 1958</div>
          </At>
          <At x={(X(1958) + X(2039)) / 2} y={ES_Y} z={6} w={X(2039) - X(1958)} h={14}>
            <div style={{ position: 'absolute', left: 0, top: 3, height: 8, width: `${redLine * 100}%`, borderRadius: 4, background: RED }} />
          </At>
          <At x={1700} y={ES_Y - 60} w={760} h={72} o={ramp(frame, fHasta, fHasta + 18, eOut)}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: RED, whiteSpace: 'nowrap' }}>80 años tras la muerte del autor</div>
          </At>
          {/* el sello: 2039 */}
          <At x={X(2039) + 236} y={ES_Y - 14} z={10} w={440} h={250} rz={-9} flat>
            <InkStamp at={fNueve} w={440} h={250} color={RED} seed={5}>
              <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 132, lineHeight: 0.95, letterSpacing: 2 }}>2039</div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 44, marginTop: 6 }}>libre en España</div>
            </InkStamp>
          </At>
          {/* la pluma */}
          {pen && (
            <At x={pen.x} y={pen.y} z={40} w={0} h={0} flat>
              <Pen o={pen.o} lift={pen.lift} size={1.25} />
            </At>
          )}
        </Rig>
      </Space>
      {/* la luz de la biblioteca cae hacia los bordes: el pergamino no se ve plano */}
      <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(120% 95% at 46% 42%, rgba(60,36,14,0) 42%, rgba(60,36,14,0.16) 70%, rgba(40,22,8,0.42) 100%)' }} />
      <ChapterCard n="III" title="Lo que conviene saber" />
      <Sfx name="pen_scratch" at={96} volume={0.35} />
      <Sfx name="paper_slide" at={70} volume={0.5} />
      <Sfx name="ink_bloom" at={fPorque + 6} volume={0.5} />
      <Sfx name="pencil_strike" at={fDerechos + 2} volume={0.55} />
      <Sfx name="soft_impact" at={fPub} volume={0.45} />
      <Sfx name="pen_underline" at={fNov} volume={0.5} />
      <Sfx name="pencil_strike" at={fNoved + 16} volume={0.6} />
      {CLASSICS.map((c, i) => <Sfx key={c.id} name="card_drop" at={fClas - 8 + i * 5} volume={0.4} />)}
      <Sfx name="deep_whoosh" at={fEspana - 4} volume={0.4} />
      <Sfx name="pen_scratch" at={fEstara - 20} volume={0.45} />
      <Sfx name="ink_bloom" at={fEstara + 8} volume={0.5} />
      <Sfx name="pen_underline" at={fHasta} volume={0.5} />
      <Sfx name="date_stamp" at={fNueve} volume={0.85} />
      <Sfx name="soft_impact" at={fNueve + 1} volume={0.5} />
    </AbsoluteFill>
  );
};

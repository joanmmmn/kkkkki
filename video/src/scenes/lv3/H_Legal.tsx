import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, BookCover, eIO, eOut, follow, lerp, ramp, Rig, Space, sp, T } from './kit';
import { ChapterCard } from './frames';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano H (S06): capítulo III, lo que conviene saber. Por qué es legal, en una línea del tiempo dorada que flota en la
// biblioteca: en Estados Unidos es de dominio público lo publicado hace 95 años o más (hasta 1930); por eso no hay
// novedades, hay clásicos. Pero en España cuenta la muerte del autor: «Platero y yo» (Juan Ramón Jiménez, † 1958) no
// será libre hasta 2039.
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

export const Legal: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S06', 'K06', word, n);
  const fY = at('¿Y'), fLegal = at('legal'), fPorque = at('Porque'), fEstados = at('Estados'), fUnidos = at('Unidos');
  const fPub = at('publicados'), fNov = at('noventa'), fAnos = at('años'), fNoved = at('novedades'), fClas = at('clásicos');
  const fEspana = at('España'), fPlatero = at('Platero'), fEstara = at('estará'), fDos = at('dos'), fNueve = at('nueve');

  const cam = follow(frame, [
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

  // La línea se dibuja de izquierda a derecha
  const draw = ramp(frame, fY - 30, fLegal + 30, eIO);
  const band = ramp(frame, fPorque, fUnidos + 10, eIO);
  const us = ramp(frame, fEstados - 4, fEstados + 14, eOut);
  const hoy = sp(frame, fPub - 4, fps, 140, 22);
  const bracket = ramp(frame, fNov - 4, fAnos + 6, eIO);
  const ghosts = ramp(frame, fNoved - 10, fNoved + 10, eOut);
  const strike = ramp(frame, fNoved + 14, fNoved + 28, eOut);
  const spain = ramp(frame, fEspana - 6, fEspana + 26, eIO);
  const fHasta = at('hasta');
  const plat = ramp(frame, fPlatero - 4, fPlatero + 14, eOut);
  const link = ramp(frame, fEstara - 22, fEstara + 12, eIO);
  const dagger = ramp(frame, fEstara + 6, fEstara + 20, eOut);
  const redLine = ramp(frame, fHasta - 2, fNueve + 4, eIO);
  const stamp = sp(frame, fNueve - 8, fps, 260, 18);
  const q = ramp(frame, fY - 4, fY + 14, eOut) * (1 - ramp(frame, at('sin') - 18, at('sin') + 2, eIO));
  // «sin derechos de autor»: un © grande que se tacha
  const fSin = at('sin'), fDerechos = at('derechos');
  const copy = sp(frame, fSin - 10, fps, 110, 20) * (1 - ramp(frame, fPub - 6, fPub + 18, eIO));
  const copyStrike = ramp(frame, fDerechos - 2, fDerechos + 14, eOut);

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* banda dorada del dominio público en EE. UU. (hasta 1930) */}
          <At x={(LINE_L + X(1930.5)) / 2} y={0} z={-4} w={X(1930.5) - LINE_L} h={150} o={band}>
            <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left', transform: `scaleX(${band})`, background: 'linear-gradient(180deg, rgba(243,208,143,0) 0%, rgba(243,208,143,0.16) 50%, rgba(243,208,143,0) 100%)', borderRight: `2px solid rgba(243,208,143,${0.7 * band})` }} />
          </At>
          {/* la línea */}
          <At x={(LINE_L + LINE_R) / 2} y={0} w={LINE_R - LINE_L} h={8}>
            <div style={{ position: 'absolute', left: 0, top: 2, height: 4, width: `${draw * 100}%`, borderRadius: 2, background: `linear-gradient(90deg, rgba(217,166,76,0.2), ${T.gold} 8%, ${T.gold} 92%, rgba(217,166,76,0.2))`, boxShadow: '0 0 18px rgba(255,214,150,0.55)' }} />
          </At>
          {/* © tachado */}
          <At x={-330} y={-280} z={60} w={420} h={420} o={Math.min(1, copy)}>
            <div style={{ position: 'absolute', inset: 0, transform: `scale(${0.9 + 0.1 * Math.min(1, copy)})` }}>
              <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 0 24px rgba(255,214,150,0.35))' }}>
                <circle cx={210} cy={210} r={170} fill="none" stroke={T.gold} strokeWidth={16} />
                <path d="M 268 150 A 84 84 0 1 0 268 270" fill="none" stroke={T.gold} strokeWidth={22} strokeLinecap="round" />
                {copyStrike > 0.01 && <path d="M 60 360 L 360 60" stroke={T.red} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${copyStrike} 1`} />}
              </svg>
            </div>
          </At>
          <At x={240} y={-280} z={60} w={620} h={90} o={Math.min(1, copy) * copyStrike}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 66, color: T.cream, whiteSpace: 'nowrap', transform: `translateX(${(1 - copyStrike) * -20}px)` }}>sin derechos de autor</div>
          </At>
          <At x={-200} y={92} w={900} h={60} o={us}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.gold, whiteSpace: 'nowrap' }}>dominio público en Estados Unidos</div>
          </At>
          {/* 1930 y hoy */}
          <At x={X(1930.5)} y={0} w={300} h={300} o={hoy}>
            <div style={{ position: 'absolute', left: 148, top: 120, width: 4, height: 60, background: T.gold, borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: T.serif, fontWeight: 500, fontSize: 54, color: T.gold }}>1930</div>
          </At>
          <At x={X(2026)} y={0} w={300} h={300} o={hoy}>
            <div style={{ position: 'absolute', left: 140, top: 140, width: 20, height: 20, borderRadius: 10, background: T.cream, boxShadow: '0 0 20px rgba(255,236,200,0.9)', transform: `scale(${hoy})` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 186, textAlign: 'center', fontFamily: T.serif, fontSize: 54, color: T.cream }}>hoy</div>
          </At>
          {/* corchete de 95 años */}
          <At x={(X(1931) + X(2026)) / 2} y={-250} w={X(2026) - X(1931)} h={90} o={Math.min(1, bracket * 3)}>
            <svg width={X(2026) - X(1931)} height={90} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M ${X(2026) - X(1931)} 80 L ${X(2026) - X(1931)} 40 L 0 40 L 0 80`} fill="none" stroke={T.cream} strokeWidth={3} pathLength={1} strokeDasharray={`${bracket} 1`} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: -50, textAlign: 'center', fontFamily: T.serif, fontSize: 76, color: T.cream, opacity: ramp(frame, fNov, fNov + 16, eOut) }}>95 años o más</div>
          </At>
          {/* novedades (después de 1930): tachadas */}
          <At x={X(1985)} y={-112} z={30} w={620} h={140} o={ghosts}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 100, lineHeight: 1, color: strike > 0.5 ? 'rgba(245,234,210,0.55)' : T.cream, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              <span style={{ position: 'relative' }}>
                novedades
                <span style={{ position: 'absolute', left: -14, right: -14, top: '58%', height: 9, borderRadius: 5, background: T.red, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-1.5deg)` }} />
              </span>
            </div>
          </At>
          {/* clásicos */}
          {CLASSICS.map((c, i) => {
            const s = sp(frame, fClas - 14 + i * 5, fps, 130, 20);
            const x = X(c.year);
            const y = c.up ? -170 : 170;
            return (
              <React.Fragment key={c.id}>
                <At x={x} y={(c.up ? -1 : 1) * 36} w={4} h={72} o={Math.min(1, s)}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(243,208,143,0.6)' }} />
                </At>
                <At x={x} y={y + (c.up ? -30 : 30) * (1 - Math.min(1, s))} z={(1 - Math.min(1, s)) * 200 + (c.id === '9920' ? 40 * plat : 0)} w={CS} h={CS} o={Math.min(1, s)} ry={-4} s={c.id === '9920' ? 1 + 0.12 * plat : 1}>
                  <BookCover id={c.id} size={CS} depth={18} />
                  {c.id === '9920' && <div style={{ position: 'absolute', inset: -6, borderRadius: 6, boxShadow: `0 0 0 4px rgba(243,208,143,${0.9 * plat}), 0 0 50px rgba(255,214,150,${0.6 * plat})` }} />}
                  <div style={{ position: 'absolute', left: -50, right: -50, [c.up ? 'bottom' : 'top']: CS + 12, textAlign: 'center', fontFamily: T.serif, whiteSpace: 'nowrap' } as React.CSSProperties}>
                    <div style={{ fontSize: 44, color: T.gold, fontWeight: 500 }}>{c.year}</div>
                  </div>
                </At>
              </React.Fragment>
            );
          })}
          <At x={X(1700)} y={-330} w={700} h={80} o={ramp(frame, fClas, fClas + 16, eOut)}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontSize: 70, color: T.cream }}>clásicos</div>
          </At>
          {/* España */}
          <At x={(LINE_L + LINE_R) / 2} y={ES_Y} w={LINE_R - LINE_L} h={6} o={spain}>
            <div style={{ position: 'absolute', left: 0, top: 1, height: 3, width: `${spain * 100}%`, backgroundImage: `repeating-linear-gradient(90deg, rgba(232,120,104,0.75) 0 18px, rgba(0,0,0,0) 18px 30px)` }} />
          </At>
          <At x={-200} y={ES_Y - 52} w={440} h={70} o={spain}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontSize: 60, color: '#f0a090', whiteSpace: 'nowrap' }}>en España</div>
          </At>
          {/* Platero: su autor murió en 1958 → 80 años después → 2039 */}
          <At x={(X(1914) - 56 + X(1958) + 56) / 2} y={145} z={4} w={X(1958) - X(1914) + 112} h={440} o={link > 0 ? 1 : 0}>
            <svg width={X(1958) - X(1914) + 112} height={440} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M 56 14 C 56 260, ${X(1958) - X(1914) + 56} 200, ${X(1958) - X(1914) + 56} 422`} fill="none" stroke="#e07a6c" strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round"
                style={{ clipPath: `inset(0 0 ${(1 - link) * 100}% 0)` }} />
            </svg>
          </At>
          <At x={X(1958)} y={ES_Y} z={8} w={64} h={64} o={dagger} s={0.6 + 0.4 * dagger}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 32, background: T.red, boxShadow: '0 0 20px rgba(179,54,43,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 44, color: '#fff2e8', lineHeight: 1 }}>†</div>
          </At>
          <At x={X(1958)} y={ES_Y + 76} w={640} h={60} o={dagger}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.cream, whiteSpace: 'nowrap' }}>Juan Ramón Jiménez, † 1958</div>
          </At>
          <At x={(X(1958) + X(2039)) / 2} y={ES_Y} z={6} w={X(2039) - X(1958)} h={14}>
            <div style={{ position: 'absolute', left: 0, top: 3, height: 8, width: `${redLine * 100}%`, borderRadius: 4, background: T.red, boxShadow: '0 0 16px rgba(179,54,43,0.7)' }} />
          </At>
          <At x={1700} y={ES_Y - 58} w={760} h={70} o={ramp(frame, fHasta, fHasta + 18, eOut)}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 48, color: '#f0a090', whiteSpace: 'nowrap' }}>80 años tras la muerte del autor</div>
          </At>
          <At x={X(2039)} y={ES_Y} z={30} w={440} h={250} o={Math.min(1, stamp)} rz={-9} s={lerp(1.6, 1, Math.min(1, stamp))}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 14, border: `7px solid ${T.red}`, color: T.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(250,240,225,0.92)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 128, lineHeight: 0.95, letterSpacing: 1 }}>2039</div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 42, marginTop: 6 }}>libre en España</div>
            </div>
          </At>
        </Rig>
      </Space>
      {/* la pregunta */}
      {q > 0.01 && (
        <AbsoluteFill style={{ alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 120, fontFamily: T.serif, fontStyle: 'italic', fontSize: 92, color: T.cream, opacity: q, transform: `translateY(${(1 - q) * 20}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.7)' }}>¿Por qué es legal?</div>
        </AbsoluteFill>
      )}
      <ChapterCard n="III" title="Lo que conviene saber" />
      <Sfx name="reveal_whoosh" at={fY - 26} volume={0.5} />
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
      <Sfx name="date_stamp" at={fNueve} volume={0.8} />
      <Sfx name="soft_impact" at={fNueve + 2} volume={0.45} />
    </AbsoluteFill>
  );
};

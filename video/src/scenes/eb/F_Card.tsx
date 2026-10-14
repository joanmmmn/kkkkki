import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { clamp01, E, EbLogo, eIO, eOut, follow, lerp, pop, ramp, Stip } from './kit';
import { CARDS, DoorCard } from './frames';
import { OWN, SpainMap } from './map';
import { Laptop, LibCard, LOOKS, Person } from './props';
import { Sticker } from './A_Open';
import { Label } from './C_What';
import { LibraryBuilding } from './world';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano F (T06): capítulo II, el carné. El carné de biblioteca, grande, girando; es gratis; se saca en cualquier
// biblioteca o, en muchas comunidades, por internet (mapa); y con sus datos (número y contraseña) se entra en eBiblio.
// ---------------------------------------------------------------------------------------------------------------
// Comunidades donde se puede pedir el carné por internet (ebiblio.es/alta.html, 14/10/2026)
const ONLINE = new Set(['Andalucía', 'Aragón', 'Canarias', 'Castilla y León', 'Castilla-La Mancha', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Melilla', 'Murcia', 'Navarra']);
const NUM = '1234 5678';

export const CardShot: React.FC<{ dur: number }> = ({ dur }) => {
  const look = CARDS.II;
  return (
    <DoorCard n="II" title={look.title} look={look}>
      <CardBody dur={dur} />
    </DoorCard>
  );
};

const CardBody: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T06', 'B07', word, n);
  const fCarne = at('carné'), fCom = at('comunidad'), fGratis = at('gratis'), fSaca = at('saca'), fCual = at('cualquier'), fMuchas = at('muchas');
  const fInternet = at('internet'), fDatos = at('datos'), fCarne2 = at('carné', 1), fEntras = at('entras'), fEb = at('eBiblio');
  // el carné: entra girando, se queda en el centro; sube cuando aparecen los dos caminos; al final va a la izquierda
  const cin = pop(frame, 60, fps, 90, 15);
  const pos = follow(frame, [
    { f: 0, x: 960, y: 520, s: 1.25, ry: 0 },
    { f: fSaca - 16, x: 960, y: 520, s: 1.25, ry: 0 },
    { f: fSaca + 8, x: 960, y: 250, s: 0.62, ry: 0 },
    { f: fDatos - 30, x: 960, y: 250, s: 0.62, ry: 0 },
    { f: fDatos - 6, x: 560, y: 520, s: 0.95, ry: 0 },
    { f: dur, x: 560, y: 520, s: 0.95, ry: 0 },
  ], 5.5);
  const spin = (1 - Math.min(1, cin)) * 200 + Math.sin(frame * 0.045) * 10 * (1 - ramp(frame, fSaca - 20, fSaca, eIO));
  const shine = ramp(frame, fCarne - 10, fCarne + 30, eIO);
  const free = pop(frame, fGratis - 6, fps, 240, 12);
  const freeOut = ramp(frame, fSaca - 18, fSaca - 4, eIO);
  // dos caminos
  const pathA = pop(frame, fCual - 10, fps, 140, 15);
  const pathB = pop(frame, fMuchas - 10, fps, 140, 15);
  const pathsOut = ramp(frame, fDatos - 22, fDatos - 4, eIO);
  const mapIn = (i: number) => ramp(frame, fMuchas + 4 + i * 1.5, fMuchas + 22 + i * 1.5, eOut);
  // inicio de sesión
  const login = pop(frame, fDatos - 14, fps, 140, 16);
  const nChars = Math.floor(clamp01((frame - (fCarne2 - 4)) / 26) * NUM.length);
  const pass = Math.floor(clamp01((frame - (fCarne2 + 22)) / 18) * 8);
  const press = ramp(frame, fEntras - 4, fEntras + 2, eOut) * (1 - ramp(frame, fEntras + 2, fEntras + 10, eOut));
  const ok = pop(frame, fEb - 6, fps, 200, 12);
  const flyNum = ramp(frame, fCarne2 - 16, fCarne2 + 4, eIO);
  return (
    <AbsoluteFill style={{ background: E.pinkPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.12} />
      <div style={{ position: 'absolute', left: 960 - 620, top: 540 - 620 + 40, width: 1240, height: 1240, borderRadius: '50%', background: E.pinkLight, opacity: 0.6 * (1 - pathsOut * 0.5) }} />
      {/* camino 1: en tu biblioteca */}
      {pathA > 0.01 && pathsOut < 1 && (
        <div style={{ position: 'absolute', left: 170, top: 420, opacity: Math.min(1, pathA * 2) * (1 - pathsOut), transform: `translateY(${(1 - Math.min(1, pathA)) * 80 + pathsOut * 60}px)` }}>
          <LibraryBuilding w={520} sign="Biblioteca" />
          <div style={{ position: 'absolute', left: 380, top: 170 }}><Person look={LOOKS[4]} size={290} /></div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}><Pill text="En cualquier biblioteca" bg={E.coral} /></div>
        </div>
      )}
      {/* camino 2: por internet (y en qué comunidades) */}
      {pathB > 0.01 && pathsOut < 1 && (
        <div style={{ position: 'absolute', left: 900, top: 470, opacity: Math.min(1, pathB * 2) * (1 - pathsOut), transform: `translateY(${(1 - Math.min(1, pathB)) * 80 + pathsOut * 60}px)` }}>
          <Laptop sw={520}>
            <AltaForm frame={frame} at={fMuchas} />
          </Laptop>
          <div style={{ position: 'absolute', left: 560, top: -40 }}>
            <SpainMap w={420} reveal={(r, i) => mapIn(i)} fill={(r) => (OWN[r.name] ? 'transparent' : ONLINE.has(r.name) ? E.plum : E.boneDeep)} stroke={E.pinkPale} strokeW={6} canary={false} />
            <div style={{ position: 'absolute', left: 30, top: 330, display: 'flex', gap: 18, fontFamily: E.font, fontWeight: 600, fontSize: 22, color: E.ink, opacity: mapIn(16) }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i style={{ width: 18, height: 18, borderRadius: 4, background: E.plum, display: 'inline-block' }} />también por internet</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i style={{ width: 18, height: 18, borderRadius: 4, background: E.boneDeep, display: 'inline-block' }} />en persona</span>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-start', gap: 16 }}>
            <Pill text="Por internet, en muchas comunidades" bg={E.plum} />
          </div>
        </div>
      )}
      {/* el carné */}
      {cin > 0.01 && (
        <div style={{ position: 'absolute', left: pos.x, top: pos.y, transform: `translate(-50%, -50%) scale(${pos.s * (0.7 + 0.3 * Math.min(1, cin))}) perspective(1400px) rotateY(${spin}deg) rotateZ(${(1 - Math.min(1, cin)) * -20 - 3}deg)` }}>
          <LibCard w={640} shine={shine} num={NUM} />
          {free > 0.01 && freeOut < 1 && (
            <div style={{ opacity: 1 - freeOut }}>
              <Sticker x={520} y={-80} s={free} bg={E.coral} rot={12} size={190}><div style={{ fontSize: 50, fontWeight: 800 }}>Gratis</div></Sticker>
            </div>
          )}
        </div>
      )}
      {/* el número del carné vuela al formulario */}
      {flyNum > 0.01 && flyNum < 1 && (
        <div style={{ position: 'absolute', left: lerp(560 - 270, 1120, flyNum), top: lerp(520 + 30, 470, flyNum) - Math.sin(flyNum * Math.PI) * 120, fontFamily: E.font, fontWeight: 700, fontSize: 34, color: E.plum,
          letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 10, background: E.mustardLight, transform: 'translate(-50%,-50%)' }}>{NUM}</div>
      )}
      {/* inicio de sesión */}
      {login > 0.01 && (
        <div style={{ position: 'absolute', left: 1020, top: 230, width: 640, padding: '40px 46px 46px', borderRadius: 28, background: E.paper, boxShadow: `14px 14px 0 ${E.plum}`,
          opacity: Math.min(1, login * 2), transform: `translateX(${(1 - Math.min(1, login)) * 200}px) rotate(${(1 - Math.min(1, login)) * 4}deg)` }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}><EbLogo w={230} /></div>
          <Field label="Usuario" value={NUM.slice(0, nChars)} caret={frame > fCarne2 - 4 && nChars < NUM.length} />
          <Field label="Contraseña" value={'•'.repeat(pass)} caret={pass > 0 && pass < 8} />
          <div style={{ marginTop: 30, height: 74, borderRadius: 14, background: ok > 0.5 ? E.green : E.plum, color: E.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            fontFamily: E.font, fontWeight: 700, fontSize: 32, transform: `scale(${1 - press * 0.05})` }}>
            {ok > 0.5 ? <><svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke={E.paper} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>Dentro</> : 'Entrar'}
          </div>
        </div>
      )}
      <Label x={960} y={940} s={pop(frame, fCom - 4, fps, 170, 13) * (1 - ramp(frame, fSaca - 18, fSaca - 6, eIO))} text="Carné de una biblioteca pública de tu comunidad" bg={E.ink} color={E.mustardLight} size={42} />
      <Sfx name="whoosh_soft" at={58} volume={0.5} />
      <Sfx name="card_flip" at={70} volume={0.6} />
      <Sfx name="shimmer" at={fCarne - 6} volume={0.4} />
      <Sfx name="sticker_slap" at={fGratis - 2} volume={0.9} />
      <Sfx name="swish_up" at={fSaca - 10} volume={0.5} />
      <Sfx name="cardboard_pop" at={fCual - 8} volume={0.6} />
      <Sfx name="cardboard_pop" at={fMuchas - 8} volume={0.6} />
      <Sfx name="map_rise" at={fInternet - 24} volume={0.5} />
      <Sfx name="whip" at={fDatos - 30} volume={0.45} />
      <Sfx name="keys_type" at={fCarne2 - 4} volume={0.7} trimAfter={48} />
      <Sfx name="mouse_click" at={fEntras} volume={0.6} />
      <Sfx name="unlock" at={fEb - 4} volume={0.8} />
      <Sfx name="success" at={fEb} volume={0.5} />
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ text: string; bg: string }> = ({ text, bg }) => (
  <div style={{ padding: '12px 28px', borderRadius: 999, background: bg, color: E.paper, fontFamily: E.font, fontWeight: 700, fontSize: 34, whiteSpace: 'nowrap' }}>{text}</div>
);

const Field: React.FC<{ label: string; value: string; caret?: boolean }> = ({ label, value, caret }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontFamily: E.font, fontWeight: 600, fontSize: 24, color: E.inkSoft, marginBottom: 8 }}>{label}</div>
    <div style={{ height: 70, borderRadius: 12, background: '#F1ECE6', boxShadow: `inset 0 0 0 2px ${E.boneDeep}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: E.font, fontWeight: 600, fontSize: 34, color: E.ink, letterSpacing: '0.08em' }}>
      {value}
      {caret && <span style={{ display: 'inline-block', width: 3, height: 36, marginLeft: 4, background: E.ink }} />}
    </div>
  </div>
);

// Formulario de alta genérico (recreación, no es el de ninguna comunidad)
const AltaForm: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const k = clamp01((frame - at) / 40);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: E.font, padding: '60px 120px' }}>
      <div style={{ fontSize: 52, fontWeight: 800, color: E.plum, marginBottom: 40 }}>Alta de usuario</div>
      {['Nombre y apellidos', 'DNI / NIE', 'Correo electrónico'].map((t, i) => (
        <div key={t} style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: E.inkSoft, marginBottom: 8 }}>{t}</div>
          <div style={{ height: 62, borderRadius: 10, background: '#F3EFEA', boxShadow: `inset 0 0 0 2px ${E.boneDeep}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 18, top: 20, height: 22, width: `${clamp01(k * 3 - i) * [62, 38, 70][i]}%`, borderRadius: 8, background: '#D9D1C7' }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 34, width: 300, height: 70, borderRadius: 12, background: E.coral, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700 }}>Solicitar el carné</div>
    </div>
  );
};

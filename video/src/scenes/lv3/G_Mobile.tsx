import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, cover, eIO, eOut, Fleuron, follow, GoldText, lerp, paperBg, ramp, Rig, seg, Space, sp, T } from './kit';
import { Books, Check, Clock, Download, Globe, Headphones, Mic, Plane, Rss } from './glyphs';
import { w } from './timeline';
import { Crop, Cursor, InkRing, Ripple, UI } from './web';

// ---------------------------------------------------------------------------------------------------------------
// Plano G (S11): paso 4, el móvil. LibriVox no tiene app oficial, pero su canal RSS funciona en cualquier app de
// pódcasts: se copia el enlace del botón «RSS» de la ficha, se pega en la app (genérica, sin marca) y cada capítulo
// aparece como un episodio, que se puede descargar para escucharlo sin conexión. Al final, apps de otros desarrolladores.
// ---------------------------------------------------------------------------------------------------------------
const PW = 390, PH = 844; // pantalla del móvil (px de interfaz)
const PS = 1.12; // escala del móvil en el mundo
const RSS_URL = 'https://librivox.org/rss/5079';
const EPIS: [string, string][] = [
  ['Creed en Dios', '23 min'], ['El Cristo de la calavera', '27 min'], ['El beso', '30 min'],
  ['El caudillo de las manos rojas, 1ra parte', '34 min'], ['El caudillo de las manos rojas, 2da parte', '47 min'], ['El gnomo', '38 min'],
];

const StatusBar: React.FC<{ dark?: boolean; offline: number }> = ({ dark, offline }) => {
  const c = dark ? '#f2ede4' : '#1d1b18';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 46, fontFamily: UI, fontSize: 16, fontWeight: 600, color: c }}>
      <span style={{ position: 'absolute', left: 30, top: 15 }}>10:24</span>
      <div style={{ position: 'absolute', right: 26, top: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
        {offline > 0.01 && <div style={{ opacity: offline, transform: `scale(${0.6 + 0.4 * offline})` }}><Plane size={17} c={c} /></div>}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 12, opacity: 1 - 0.75 * offline }}>{[4, 6, 9, 12].map((h, i) => <i key={i} style={{ width: 3, height: h, borderRadius: 1, background: c }} />)}</div>
        <svg width="17" height="13" viewBox="0 0 17 13" style={{ opacity: 1 - offline }}><path d="M1 4.5a11 11 0 0 1 15 0M3.6 7.2a7.2 7.2 0 0 1 9.8 0M6.2 9.9a3.4 3.4 0 0 1 4.6 0" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
        <div style={{ width: 25, height: 12, borderRadius: 3.5, border: `1.5px solid ${c}`, position: 'relative', opacity: 0.9 }}><i style={{ position: 'absolute', left: 1.5, top: 1.5, width: 16, height: 6, borderRadius: 1.5, background: c }} /></div>
      </div>
    </div>
  );
};

// Pantalla de inicio genérica (iconos sin marca)
const TILES: { bg: string; g: React.ReactNode }[] = [
  { bg: 'linear-gradient(160deg, #3d5560, #24363d)', g: <Globe size={34} c="#e9f2f4" /> },
  { bg: 'linear-gradient(160deg, #7b5a3a, #4f3923)', g: <Books size={34} c="#f6e7cf" /> },
  { bg: 'linear-gradient(160deg, #5b6b3a, #3a4724)', g: <Clock size={34} c="#eef3df" /> },
  { bg: 'linear-gradient(160deg, #4a3f5c, #2e2740)', g: <Mic size={34} c="#efe9f7" /> },
  { bg: 'linear-gradient(160deg, #8a4b3d, #5a2f25)', g: <Headphones size={34} c="#fbe9e3" /> },
  { bg: 'linear-gradient(160deg, #3a4f6b, #233247)', g: <Download size={34} c="#e6eef8" /> },
  { bg: 'linear-gradient(160deg, #2e6d7d, #1c4752)', g: <Rss size={34} c="#e9f6f9" /> }, // pódcasts
  { bg: 'linear-gradient(160deg, #6b6256, #463f36)', g: <Check size={34} c="#f3eee6" /> },
];
const PODCAST_TILE = 6;
const Home: React.FC<{ open: number }> = ({ open }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 55% at 18% 4%, rgba(255,240,210,0.95) 0%, rgba(255,240,210,0) 70%), radial-gradient(80% 60% at 100% 100%, rgba(120,58,36,0.9) 0%, rgba(120,58,36,0) 72%), linear-gradient(172deg, #f3d39e 0%, #e0a764 42%, #b56d3e 78%, #8e4a2c 100%)' }}>
    <div style={{ position: 'absolute', left: 30, right: 30, top: 96, display: 'grid', gridTemplateColumns: 'repeat(4, 66px)', justifyContent: 'space-between', rowGap: 34 }}>
      {TILES.map((t, i) => (
        <div key={i} style={{ width: 66, height: 66, borderRadius: 17, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
          transform: i === PODCAST_TILE ? `scale(${1 + open * 0.08})` : undefined }}>{t.g}</div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 22, right: 22, bottom: 26, height: 92, borderRadius: 30, background: 'rgba(255,248,236,0.26)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)' }} />
  </div>
);

// App de pódcasts genérica
const AppAdd: React.FC<{ pasted: number; tap: number; frame: number }> = ({ pasted, tap }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#f5f3ef', fontFamily: UI, color: '#1d1b18' }}>
    <div style={{ position: 'absolute', left: 24, top: 62, fontSize: 34, fontWeight: 700, letterSpacing: -0.6 }}>Pódcasts</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 130, bottom: 0, background: '#fff', borderRadius: '22px 22px 0 0', boxShadow: '0 -6px 24px rgba(0,0,0,0.1)' }}>
      <div style={{ width: 40, height: 5, borderRadius: 3, background: '#d6d2ca', margin: '10px auto 0' }} />
      <div style={{ marginTop: 22, textAlign: 'center', fontSize: 20, fontWeight: 700 }}>Añadir por URL</div>
      <div style={{ margin: '10px 26px 0', textAlign: 'center', fontSize: 15, lineHeight: 1.35, color: '#6d675d' }}>Pega la dirección del canal RSS del pódcast que quieres seguir.</div>
      <div style={{ margin: '24px 24px 0', height: 50, borderRadius: 12, background: '#f1eee8', border: `2px solid ${pasted > 0.5 ? '#2e6d7d' : '#e2ddd3'}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15.5, color: pasted > 0.5 ? '#1d1b18' : '#a39d92', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ background: pasted > 0.5 && pasted < 1 ? `rgba(134,188,203,${0.6 * (1 - pasted)})` : undefined, borderRadius: 3 }}>{pasted > 0.5 ? RSS_URL : 'https://…'}</span>
      </div>
      <div style={{ margin: '22px 24px 0', height: 52, borderRadius: 14, background: '#2e6d7d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700,
        transform: `scale(${1 - 0.05 * tap})`, opacity: 0.55 + 0.45 * Math.min(1, pasted * 2) }}>Suscribirse</div>
    </div>
  </div>
);

const DlIcon: React.FC<{ p: number }> = ({ p }) => {
  if (p >= 1) return <div style={{ width: 30, height: 30, borderRadius: 15, background: '#2e6d7d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={20} c="#fff" w={2.8} /></div>;
  return (
    <svg width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="13" fill="none" stroke="#cfc9be" strokeWidth="2" />
      {p > 0 && <circle cx="15" cy="15" r="13" fill="none" stroke="#2e6d7d" strokeWidth="2.6" pathLength={1} strokeDasharray={`${p} 1`} transform="rotate(-90 15 15)" strokeLinecap="round" />}
      {p <= 0 ? <path d="M15 8.5v11M10.5 15l4.5 4.5 4.5-4.5" stroke="#2e6d7d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#2e6d7d" />}
    </svg>
  );
};
const Show: React.FC<{ frame: number; listAt: number; dlAt: number; playAt: number; offline: number }> = ({ frame, listAt, dlAt, playAt, offline }) => {
  const play = ramp(frame, playAt, playAt + 16, eOut);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f5f3ef', fontFamily: UI, color: '#1d1b18' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', left: 18, top: 56 }}><path d="M15 5l-7 7 7 7" stroke="#2e6d7d" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ position: 'absolute', left: 24, top: 92, display: 'flex', gap: 16 }}>
        <Img src={cover('5079')} style={{ width: 128, height: 128, borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} />
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4 }}>Leyendas</div>
          <div style={{ marginTop: 4, fontSize: 15.5, color: '#2e6d7d' }}>Gustavo Adolfo Bécquer</div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#7a7368' }}>22 episodios · LibriVox</div>
        </div>
      </div>
      {offline > 0.01 && (
        <div style={{ position: 'absolute', left: 24, top: 236, height: 30, padding: '0 12px', borderRadius: 15, background: '#1d1b18', color: '#f5f3ef', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, opacity: offline, transform: `translateY(${(1 - offline) * -6}px)` }}>
          <Plane size={14} c="#f5f3ef" /> Sin conexión
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 278 }}>
        {EPIS.map(([t, d], i) => {
          const a = ramp(frame, listAt + i * 5, listAt + 14 + i * 5, eOut);
          const p = ramp(frame, dlAt + i * 7, dlAt + 34 + i * 7, eIO);
          return (
            <div key={i} style={{ height: 78, borderTop: '1px solid #e4dfd6', padding: '12px 22px 0 24px', position: 'relative', opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
              <div style={{ fontSize: 13.5, color: '#8b8478', fontWeight: 600 }}>{String(i + 1).padStart(2, '0')} · {d}</div>
              <div style={{ marginTop: 4, fontSize: t.length > 28 ? 15.5 : 18, lineHeight: 1.15, fontWeight: 600, width: 290 }}>{t}</div>
              <div style={{ position: 'absolute', right: 22, top: 22 }}><DlIcon p={frame < dlAt + i * 7 ? 0 : p} /></div>
            </div>
          );
        })}
      </div>
      {/* minirreproductor */}
      {play > 0.01 && (
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 20, height: 70, borderRadius: 18, background: '#1d1b18', color: '#f5f3ef', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', opacity: play, transform: `translateY(${(1 - play) * 30}px)` }}>
          <Img src={cover('5079')} style={{ width: 46, height: 46, borderRadius: 8 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Creed en Dios</div>
            <div style={{ marginTop: 7, display: 'flex', gap: 2, alignItems: 'center', height: 14 }}>
              {Array.from({ length: 34 }, (_, k) => <i key={k} style={{ width: 3, borderRadius: 2, height: 3 + 11 * Math.abs(Math.sin(k * 0.8 + frame / 3) * Math.sin(k * 0.31 + 1)), background: k < 9 ? T.tealLight : 'rgba(245,243,239,0.35)' }} />)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}><i style={{ width: 5, height: 20, borderRadius: 1, background: '#f5f3ef' }} /><i style={{ width: 5, height: 20, borderRadius: 1, background: '#f5f3ef' }} /></div>
        </div>
      )}
    </div>
  );
};

// Móvil genérico (cristal, marco de grafito y un brillo que lo recorre)
const PhoneBody: React.FC<{ children: React.ReactNode; glint: number }> = ({ children, glint }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: PW + 24, height: PH + 24, borderRadius: 64, background: 'linear-gradient(145deg, #3a3835 0%, #1a1917 45%, #2c2a27 100%)',
    boxShadow: '0 0 0 1.5px rgba(255,236,210,0.18), inset 0 0 0 2px rgba(0,0,0,0.6), 0 60px 120px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.5)' }}>
    <div style={{ position: 'absolute', left: -3, top: 170, width: 4, height: 60, borderRadius: 2, background: '#2b2926' }} />
    <div style={{ position: 'absolute', right: -3, top: 200, width: 4, height: 96, borderRadius: 2, background: '#2b2926' }} />
    <div style={{ position: 'absolute', left: 12, top: 12, width: PW, height: PH, borderRadius: 52, overflow: 'hidden', background: '#000' }}>
      {children}
      <div style={{ position: 'absolute', left: PW / 2 - 7, top: 14, width: 14, height: 14, borderRadius: 7, background: '#050505', boxShadow: 'inset 0 0 3px rgba(80,90,110,0.8)' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${glint * 160 - 50}%, rgba(255,250,235,0.16) ${glint * 160 - 35}%, rgba(255,255,255,0) ${glint * 160 - 20}%)`, pointerEvents: 'none' }} />
    </div>
  </div>
);

export const Mobile: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S11', 'K11', word, n);
  const fPaso = at('Paso'), fMovil = at('móvil'), fLV = at('LibriVox'), fOficial = at('oficial'), fPero = at('pero'), fTruco = at('truco');
  const fRSS = at('RSS'), fPegalo = at('pégalo'), fPod = at('pódcasts');
  const fCada = at('Cada'), fDescargar = at('descargarlo'), fSin = at('sin'), fConexion = at('conexión');
  const fPrefieres = at('prefieres'), fGratuitas = at('gratuitas'), fOtros = at('otros');

  // Momentos
  const fRight = fRSS - 14; // clic derecho en «RSS»
  const fCopy = fRSS + 34; // «Copiar dirección del enlace»
  const fFly = fPegalo - 4; // la tira con el enlace vuela al móvil
  const fOpen = fPegalo - 10; // se abre la app de pódcasts
  const fPaste = fFly + 34;
  const fTap = fPod + 22;
  const fShow = fTap + 12;
  const fApps = fPrefieres - 8;

  const cam = follow(frame, [
    { f: 0, x: -220, y: 0, z: -520, rx: 4, ry: 12 },
    { f: fLV, x: -150, y: 0, z: -440, rx: 3, ry: 8 },
    { f: fTruco, x: -260, y: 0, z: -430, rx: 2, ry: 6 },
    { f: fRSS - 10, x: -430, y: -20, z: -260, rx: 2, ry: 9 },
    { f: fFly + 10, x: -60, y: 0, z: -420, rx: 2, ry: 2 },
    { f: fPaste - 6, x: 330, y: 0, z: -40, rx: 2, ry: -3 },
    { f: fCada, x: 420, y: 10, z: 20, rx: 2, ry: -4 },
    { f: fConexion + 20, x: 430, y: 0, z: 40, rx: 2, ry: -6 },
    { f: fApps + 40, x: 200, y: 0, z: -520, rx: 2, ry: -3 },
    { f: dur, x: 220, y: 0, z: -560, rx: 2, ry: -4 },
  ], 4.4);

  // Móvil
  const rise = sp(frame, 22, fps, 60, 18);
  const phoneX = lerp(430, -170, ramp(frame, fApps - 4, fApps + 40, eIO));
  const phoneRy = lerp(32, -10, Math.min(1, rise)) + 6 * ramp(frame, fApps, fApps + 40, eIO);
  const glint = ramp(frame, 40, 110, eIO);
  const openApp = ramp(frame, fOpen, fOpen + 18, eIO);
  const toShow = ramp(frame, fShow, fShow + 18, eIO);
  const offline = ramp(frame, fSin - 4, fSin + 12, eOut);

  // Paso 4 (rótulo) y «app oficial»
  const lab = sp(frame, fPaso - 4, fps, 90, 20);
  const labOut = ramp(frame, fPero, fPero + 24, eIO);
  const tag = sp(frame, fLV - 6, fps, 130, 22);
  const strike = ramp(frame, fOficial + 2, fOficial + 16, eOut);
  const tagOut = ramp(frame, fTruco - 6, fTruco + 16, eIO);

  // Ficha (recorte de la web): la zona «Listen/Download» con el botón RSS
  const frag = sp(frame, fTruco + 4, fps, 100, 20);
  const fragOut = ramp(frame, fFly + 20, fFly + 44, eIO);
  const menu = sp(frame, fRight + 2, fps, 200, 24) * (1 - ramp(frame, fCopy + 4, fCopy + 12));
  const menuSel = ramp(frame, fCopy - 7, fCopy - 3);
  const FS = 2.1; // escala del recorte
  const CROP = [150, 482, 262, 186]; // x, y, ancho, alto (CSS de la ficha)
  const FX = -560, FY = -40; // centro del recorte en el mundo
  const rssX = (285 + 40 - CROP[0]) , rssY = (602 + 14 - CROP[1]); // centro del botón RSS dentro del recorte
  const cur = follow(frame, [
    { f: 0, x: 240, y: 170 },
    { f: fRSS - 30, x: 240, y: 170 },
    { f: fRight - 2, x: rssX + 6, y: rssY + 4 },
    { f: fRight + 6, x: rssX + 6, y: rssY + 4 },
    { f: fCopy - 30, x: rssX + 76, y: rssY + 110 },
  ], 6);
  const curO = ramp(frame, fRSS - 32, fRSS - 22) * (1 - ramp(frame, fCopy + 10, fCopy + 20));

  // Tira de papel con el enlace: sale del menú y vuela a la pantalla del móvil
  const slipA = ramp(frame, fCopy + 2, fCopy + 16, eOut);
  const fly = ramp(frame, fFly, fFly + 30, eIO);
  // la tira sale del propio botón RSS (de donde se ha copiado el enlace)
  const slipFrom = { x: FX + (rssX - CROP[2] / 2) * FS, y: FY + (rssY - CROP[3] / 2) * FS, z: 140 };
  const slipTo = { x: phoneX, y: -140, z: 30 };
  const sx = lerp(slipFrom.x, slipTo.x, fly), sy = lerp(slipFrom.y, slipTo.y, fly) - Math.sin(fly * Math.PI) * 160, sz = lerp(slipFrom.z, slipTo.z, fly) + Math.sin(fly * Math.PI) * 120;
  const slipO = slipA * (1 - ramp(frame, fFly + 24, fFly + 32));
  // aleteo y desenfoque de movimiento de la tira mientras vuela
  const flyPrev = ramp(frame - 1, fFly, fFly + 30, eIO);
  const slipBlur = Math.min(3.5, Math.hypot(slipTo.x - slipFrom.x, slipTo.y - slipFrom.y) * (fly - flyPrev) * 0.045);
  const flutter = Math.sin(fly * Math.PI * 3.2) * 8 * Math.sin(fly * Math.PI);

  // Apps de otros desarrolladores
  const APPS = [
    { bg: 'linear-gradient(160deg, #f7f0e1, #e3d6bb)', g: <Books size={96} c={T.teal} w={1.6} /> },
    { bg: 'linear-gradient(160deg, #2b2620, #15120e)', g: <Headphones size={96} c={T.gold} w={1.5} /> },
    { bg: 'linear-gradient(160deg, #6f8a3a, #45591f)', g: <Rss size={92} c="#f5ead2" w={1.8} /> },
  ];

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* rótulo del paso 4 */}
          <At x={-780} y={-30 - labOut * 30} z={(1 - lab) * -200} w={700} h={600} ry={6} o={Math.min(1, lab) * (1 - labOut)}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transformStyle: 'preserve-3d' }}>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.creamSoft }}>Paso</div>
              <div style={{ marginTop: -6, transformStyle: 'preserve-3d' }}><GoldText text="4" size={300} sweep={ramp(frame, fPaso, fPaso + 60, eIO)} /></div>
              <div style={{ marginTop: 6, fontFamily: T.serif, fontSize: 64, color: T.cream, opacity: ramp(frame, fMovil - 6, fMovil + 14, eOut) }}>En el móvil</div>
              <div style={{ marginTop: 22 }}><Fleuron at={fMovil} w={300} color={T.gold} /></div>
            </div>
          </At>
          {/* «app oficial», tachado */}
          <At x={-60} y={150} z={40} w={400} h={120} o={Math.min(1, tag) * (1 - tagOut)} rz={-3}>
            <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 60, color: strike > 0.5 ? T.inkFaint : T.ink, transform: `translateY(${(1 - tag) * 40}px)` }}>
              app oficial
              <div style={{ position: 'absolute', left: 36, right: 36, top: '52%', height: 8, borderRadius: 4, background: T.redInk, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-4deg)` }} />
            </div>
          </At>
          {/* recorte de la ficha, con el botón RSS */}
          <At x={FX} y={FY + (1 - frag) * 60} z={80 + (1 - frag) * -200} w={CROP[2]} h={CROP[3]} s={FS} o={Math.min(1, frag) * (1 - fragOut)} ry={6}>
            <div style={{ position: 'absolute', inset: -10, borderRadius: 10, background: '#f6f6f1', boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(243,208,143,0.5), 0 0 30px rgba(255,214,150,0.25)' }} />
            <Crop id="book" box={CROP} />
            <InkRing box={[285 - CROP[0], 602 - CROP[1], 80, 28]} at={fRSS - 2} z={2} padX={8} padY={7} out={fCopy + 6} />
            {/* menú contextual */}
            {menu > 0.01 && (
              <div style={{ position: 'absolute', left: rssX + 6, top: rssY + 6, width: 238, padding: '5px 0', borderRadius: 8, background: '#fbfaf7', boxShadow: '0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)', fontFamily: UI, fontSize: 12.5, color: '#2a2622',
                transform: `translateZ(6px) scale(${0.9 + 0.1 * menu})`, transformOrigin: '0 0', opacity: Math.min(1, menu) }}>
                {['Abrir enlace en una pestaña nueva', 'Abrir enlace en una ventana nueva', 'Guardar enlace como…', 'Copiar dirección del enlace'].map((t, i) => (
                  <div key={t} style={{ padding: '6px 14px', background: i === 3 && menuSel > 0.5 ? T.teal : undefined, color: i === 3 && menuSel > 0.5 ? '#fff' : undefined, borderTop: i === 3 ? '1px solid #e6e1d8' : undefined }}>{t}</div>
                ))}
              </div>
            )}
            <Cursor x={cur.x} y={cur.y} o={curO} z={10} press={Math.max(0, 1 - Math.abs(frame - fRight) / 4, 1 - Math.abs(frame - fCopy) / 4)} />
            <Ripple x={rssX + 6} y={rssY + 4} at={fRight} z={9} />
          </At>
          {/* la tira con el enlace */}
          {slipO > 0.01 && (
            <At x={sx} y={sy} z={sz} w={520} h={64} o={slipO} rz={lerp(-4, 0, fly) + flutter} rx={Math.sin(fly * Math.PI * 2) * 14} s={lerp(lerp(0.45, 1, slipA), 0.55, fly)}>
              <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 4, boxShadow: '0 18px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontFamily: UI, fontSize: 25, color: T.ink, whiteSpace: 'nowrap', filter: slipBlur > 0.3 ? `blur(${slipBlur}px)` : undefined }}>
                <Rss size={26} c={T.teal} />{RSS_URL}
              </div>
            </At>
          )}
          {/* el móvil */}
          <At x={phoneX} y={(1 - Math.min(1, rise)) * 700} z={0} w={PW + 24} h={PH + 24} s={PS} ry={phoneRy} o={Math.min(1, rise * 2)}>
            <PhoneBody glint={glint}>
              <Home open={openApp} />
              {openApp > 0.001 && (
                <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, openApp * 1.5), transform: `scale(${0.3 + 0.7 * openApp})`, transformOrigin: '242px 230px', borderRadius: 40 * (1 - openApp), overflow: 'hidden' }}>
                  <AppAdd pasted={ramp(frame, fPaste, fPaste + 10)} tap={Math.max(0, 1 - Math.abs(frame - fTap) / 5)} frame={frame} />
                  {toShow > 0.001 && (
                    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - toShow) * PW}px)`, boxShadow: '-10px 0 30px rgba(0,0,0,0.15)' }}>
                      <Show frame={frame} listAt={fShow + 10} dlAt={fDescargar - 4} playAt={fConexion + 6} offline={offline} />
                    </div>
                  )}
                </div>
              )}
              <StatusBar offline={offline} />
            </PhoneBody>
          </At>
          {/* apps de otros desarrolladores */}
          {APPS.map((a, i) => {
            const s = sp(frame, fApps + 14 + i * 8, fps, 140, 20);
            const g = ramp(frame, fGratuitas - 4 + i * 4, fGratuitas + 10 + i * 4, eOut);
            return (
              <At key={i} x={500 + i * 290} y={-30} z={(1 - Math.min(1, s)) * -200} w={200} h={290} o={Math.min(1, s)}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 200, height: 200, borderRadius: 48, background: a.bg, boxShadow: '0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * Math.min(1, s)})` }}>{a.g}</div>
                <div style={{ position: 'absolute', left: -20, right: -20, top: 222, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.gold, opacity: g }}>gratis</div>
              </At>
            );
          })}
          <At x={790} y={-280} z={0} w={900} h={90} o={ramp(frame, fOtros - 8, fOtros + 10, eOut)}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 52, color: T.cream, whiteSpace: 'nowrap' }}>de otros desarrolladores</div>
          </At>
          <At x={790} y={320} z={0} w={900} h={70} o={ramp(frame, fOtros + 14, fOtros + 30, eOut)}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.creamSoft, whiteSpace: 'nowrap' }}>no oficiales</div>
          </At>
        </Rig>
      </Space>
      {/* sonido */}
      <Sfx name="soft_impact" at={fPaso + 2} volume={0.42} />
      <Sfx name="dust_shimmer" at={fPaso + 6} volume={0.35} />
      <Sfx name="phone_whoosh" at={24} volume={0.5} />
      <Sfx name="card_drop" at={fLV - 4} volume={0.45} />
      <Sfx name="pencil_strike" at={fOficial + 4} volume={0.6} />
      <Sfx name="paper_lift" at={fTruco + 4} volume={0.45} />
      <Sfx name="mouse_click" at={fRight} volume={0.55} />
      <Sfx name="mouse_click" at={fCopy} volume={0.55} />
      <Sfx name="paper_slide" at={fCopy + 2} volume={0.4} />
      <Sfx name="phone_whoosh" at={fFly + 4} volume={0.45} />
      <Sfx name="ui_tap" at={fOpen} volume={0.5} />
      <Sfx name="ui_pop" at={fPaste} volume={0.45} />
      <Sfx name="ui_tap" at={fTap} volume={0.55} />
      <Sfx name="swipe" at={fShow} volume={0.6} />
      {EPIS.map((_, i) => <Sfx key={i} name="tick_soft" at={fDescargar + 30 + i * 7} volume={0.35} />)}
      <Sfx name="notify" at={fSin + 2} volume={0.4} />
      <Sfx name="deep_whoosh" at={fApps} volume={0.4} />
      {APPS.map((_, i) => <Sfx key={`a${i}`} name="ui_pop" at={fApps + 16 + i * 8} volume={0.4} />)}
    </AbsoluteFill>
  );
};

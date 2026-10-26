import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { RealPhone } from '../../components/RealPhone';
import { APP_RATIO } from '../nxr/kit';
import { color, font, MpStage, PKey, PLAT, PlatTile, shadow, Stamp } from './kit';

const StillPhone: React.FC<{ src: string; w: number; rx?: number; ry?: number; rz?: number; style?: React.CSSProperties }> = ({ src, w, rx = 0, ry = 0, rz = 0, style }) => (
  <div style={{ position: 'absolute', ...style }}>
    <RealPhone w={w} ratio={APP_RATIO} rotX={rx} rotY={ry} rotZ={rz} screenBg="#000">
      <Img src={staticFile(src)} style={{ width: w, height: w * APP_RATIO, display: 'block' }} />
    </RealPhone>
  </div>
);

const Hi: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => (
  <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start' }}>
    <div style={{ position: 'absolute', left: -10, right: -10, bottom: size * 0.09, height: size * 0.46, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
    <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 0.96, color: color.ink }}>{children}</div>
  </div>
);

const FIVE: PKey[] = ['audible', 'storytel', 'spotify', 'podimo', 'nextory'];
const EIGHT: PKey[] = ['audible', 'storytel', 'spotify', 'podimo', 'nextory', 'bookbeat', 'audiobooks', 'ivoox'];

// Miniatura A: «CÓMO CANCELAR» y dos móviles con la confirmación real de la baja (Nextory y Storytel), con el sello.
export const CNLThumbA: React.FC = () => (
  <MpStage still>
    <AbsoluteFill style={{ padding: '92px 0 0 64px' }}>
      <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>
        <span style={{ color: color.yellow }}>8 APPS</span> DE AUDIOLIBROS
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 128, letterSpacing: -5.5, lineHeight: 0.96, color: color.ink, marginTop: 28 }}>CÓMO</div>
      <Hi size={128}>CANCELAR</Hi>
      <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
        {FIVE.map((k) => <PlatTile key={k} k={k} size={74} />)}
      </div>
    </AbsoluteFill>
    <StillPhone src="cnl/rec/str_web2/last.jpg" w={226} rx={4} ry={-20} rz={-7} style={{ left: 820, top: 150 }} />
    <StillPhone src="cnl/rec/nx_end/last.jpg" w={246} rx={6} ry={-18} rz={5} style={{ left: 1000, top: 90 }} />
    <div style={{ position: 'absolute', left: 950, top: 470, width: 300, height: 300 }}><Stamp at={-40} size={300} /></div>
  </MpStage>
);

// Miniatura B: las ocho, selladas, y la banda negra «CÓMO CANCELAR».
export const CNLThumbB: React.FC = () => (
  <MpStage still>
    <div style={{ position: 'absolute', left: 96, top: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 180px)', columnGap: 110, rowGap: 46, transform: 'rotate(-4deg)' }}>
      {EIGHT.map((k) => (
        <div key={k} style={{ position: 'relative' }}>
          <PlatTile k={k} size={180} />
          <div style={{ position: 'absolute', left: 70, top: 96, width: 150, height: 150 }}><Stamp at={-40} size={150} /></div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 486, padding: '22px 60px 28px', background: color.ink, transform: 'rotate(-3deg)', boxShadow: '0 40px 80px rgba(0,0,0,0.35)' }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 1, color: '#fff', textAlign: 'center' }}>
        CÓMO <span style={{ color: color.yellow }}>CANCELAR</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: 'rgba(255,255,255,0.82)', textAlign: 'center', marginTop: 8 }}>Audible, Storytel, Spotify y 5 más · paso a paso</div>
    </div>
    <div style={{ position: 'absolute', right: 36, top: 26, padding: '8px 16px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink, boxShadow: shadow.float }}>2026</div>
  </MpStage>
);

// Miniatura de cada tutorial: «CÓMO CANCELAR» + el nombre, su icono y la pantalla real de la baja con el sello.
const DONE_SRC: Record<string, { src: string; web?: boolean; x?: number; y?: number }> = {
  audible: { src: 'cnl/still/audible.jpg' }, storytel: { src: 'cnl/still/storytel.jpg' }, podimo: { src: 'cnl/still/podimo.jpg' },
  nextory: { src: 'cnl/still/nextory.jpg' }, bookbeat: { src: 'cnl/still/bookbeat.jpg' }, ivoox: { src: 'cnl/still/ivoox.jpg' },
  spotify: { src: 'cnl/web/spo_done.png', web: true, x: 470, y: 60 }, audiobooks: { src: 'cnl/web/abc_done.png', web: true, x: 330, y: 90 },
};
export const CNLThumbP: React.FC<{ k: PKey; name: string }> = ({ k, name }) => {
  const d = DONE_SRC[k];
  const long = name.length > 9;
  return (
    <MpStage still tint={PLAT[k].c}>
      <AbsoluteFill style={{ padding: '70px 0 0 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <PlatTile k={k} size={96} />
          <div style={{ padding: '10px 20px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28 }}>
            PASO A PASO <span style={{ color: color.yellow }}>2026</span>
          </div>
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink, marginTop: 30 }}>CÓMO</div>
        <Hi size={104}>CANCELAR</Hi>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: long ? 76 : 96, letterSpacing: -3.5, lineHeight: 1, color: color.ink, marginTop: 14 }}>{name.toUpperCase()}</div>
      </AbsoluteFill>
      {d.web ? (
        <div style={{ position: 'absolute', left: 760, top: 200, width: 560, borderRadius: 12, overflow: 'hidden', background: '#F6F6F7', boxShadow: '0 40px 80px rgba(16,16,16,0.25)', transform: 'perspective(1600px) rotateY(-12deg) rotateZ(3deg)' }}>
          <div style={{ height: 22, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />)}</div>
          <div style={{ width: 560, height: 300, overflow: 'hidden', position: 'relative' }}>
            <Img src={staticFile(d.src)} style={{ position: 'absolute', width: 1456 * 1.1, left: -(d.x ?? 0) * 1.1, top: -(d.y ?? 0) * 1.1 }} />
          </div>
        </div>
      ) : (
        <StillPhone src={d.src} w={250} rx={5} ry={-18} rz={5} style={{ left: 930, top: 70 }} />
      )}
      <div style={{ position: 'absolute', left: d.web ? 1040 : 1055, top: d.web ? 520 : 560, width: 280, height: 280, transform: 'translate(-50%, -50%)' }}><Stamp at={-40} size={280} /></div>
    </MpStage>
  );
};

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { IcDownload } from '../er/icons';
import { app, AppView, AppWindow, st } from './AppView';
import { w } from './timeline';

const ID = 'X08';
const WIN = 1640;

const Moon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke={color.ink} strokeWidth="2" strokeLinejoin="round" /><path d="M16.5 3.5v3M15 5h3" stroke={color.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
);

const Feature: React.FC<{ at: number; icon: React.ReactNode; text: string }> = ({ at, icon, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 36px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})` }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      {text}
    </div>
  );
};

// X08 · Más funciones: extensión de Chrome, importación automática, colecciones; en el móvil, descargas y temporizador.
export const X08More: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const at = (word: string, n = 0) => w(ID, 'W10', word, n);
  const fExt = at('extension');
  const fImp = at('importacion');
  const fCol = at('colecciones');
  const fMov = at('movil');
  const fDesc = at('descargas', 1);
  const fTemp = at('temporizador');
  const states = [
    { at: 0, src: st('acc') },
    { at: fCol - 8, src: st('lib_done'), fade: 8 },
    { at: fMov - 8, src: app('23_install_app'), fade: 10 },
  ];
  const camera = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fExt - 6, zoom: 1.0, x: 960, y: 540 },
    { f: fExt + 16, zoom: 1.55, x: 960, y: 740 },
    { f: fCol - 10, zoom: 1.55, x: 960, y: 780 },
    { f: fCol - 6, zoom: 1.5, x: 760, y: 300 },
    { f: fMov - 10, zoom: 1.5, x: 760, y: 300 },
    { f: fMov - 6, zoom: 1.0, x: 960, y: 540 },
    { f: dur, zoom: 1.08, x: 900, y: 560 },
  ];
  const marks = [
    { from: fExt, to: fImp - 4, x: 540, y: 676, w: 840, h: 92, r: 16, label: 'Extensión de Chrome' },
    { from: fImp, to: fCol - 10, x: 540, y: 780, w: 840, h: 130, r: 16, label: 'Importa lo que descargas' },
    { from: fCol, to: fMov - 10, x: 609, y: 180, w: 186, h: 48, r: 24, label: 'Colecciones' },
    { from: fMov + 4, to: dur, x: 246, y: 442, w: 262, h: 52, r: 12, label: 'App para iPhone y Android' },
  ];
  return (
    <Stage>
      <AppWindow url={'elevenreader.io/reader'} width={WIN} y={-40}>
        <AppView width={WIN} states={states} camera={camera} marks={marks} dim={0.35} />
      </AppWindow>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {frame >= fDesc - 8 && <Feature at={fDesc - 4} icon={<IcDownload size={36} w={2.2} />} text="Descargas sin conexión" />}
        {frame >= fTemp - 8 && <Feature at={fTemp - 4} icon={<Moon size={36} />} text="Temporizador para dormir" />}
      </div>
      <Sfx name="zoom_in" at={fExt} />
      <Sfx name="focus" at={fImp} />
      <Sfx name="swipe" at={fCol - 8} />
      <Sfx name="whoosh_soft" at={fMov - 8} />
      <Sfx name="ui_pop" at={fDesc - 4} />
      <Sfx name="ui_pop" at={fTemp - 4} />
    </Stage>
  );
};

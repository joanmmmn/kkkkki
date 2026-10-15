import React from 'react';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { AppView, AppWindow, Patch, st } from './AppView';
import { w } from './timeline';

const ID = 'X07';
const WIN = 1640;
const PANEL = { x: 1512, y: 8, w: 400, h: 1064 };

// X07 · El lector: capítulos, ±15 s, marcadores, búsqueda, velocidad hasta 4x y personalización.
export const X07Reader: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const at = (word: string, n = 0) => w(ID, 'W09', word, n);
  const fCap = at('capitulos');
  const fSal = at('saltos');
  const fMar = at('marcadores');
  const fBus = at('busqueda');
  const fAcel = at('acelerarlo');
  const fCuatro = at('cuatro');
  const fVeces = at('veces');
  const fAdem = at('Ademas');
  const fTema = at('tema');
  const fLetra = at('letra');
  const fTam = at('tamano');
  const fColor = at('color');
  const tMenu = fBus - 4;
  const tMenuOff = fAcel - 8;
  const tPanel = fAdem - 4;
  const states = [
    { at: 0, src: st('rd_s_20') },
    { at: tMenu, src: st('rd_menu'), fade: 5 },
    { at: tMenuOff, src: st('rd_speed1'), fade: 5 },
    { at: fCuatro - 6, src: st('rd_speed2'), fade: 6 },
    { at: fVeces - 6, src: st('rd_speed4'), fade: 6 },
    { at: tPanel, src: st('rd_s_20'), fade: 6 },
    { at: fTema - 4, src: st('rd_dark'), fade: 10 },
    { at: fLetra - 4, src: st('rd_paper'), fade: 10 },
    { at: fTam - 4, src: st('rd_big'), fade: 10 },
    { at: fColor - 2, src: st('rd_big_yellow'), fade: 10 },
  ];
  const pref = (f: number) => (f < fTema - 4 ? 'pref_clean' : f < fLetra - 4 ? 'pref_dark' : f < fTam - 4 ? 'pref_paper' : f < fColor - 2 ? 'pref_big' : 'pref_yellow');
  const camera = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fCap - 8, zoom: 1.0, x: 960, y: 540 },
    { f: fCap + 14, zoom: 1.5, x: 560, y: 380 },
    { f: fSal - 4, zoom: 1.5, x: 560, y: 380 },
    { f: fSal + 18, zoom: 1.7, x: 960, y: 900 },
    { f: fBus - 6, zoom: 1.7, x: 960, y: 900 },
    { f: fBus + 14, zoom: 1.5, x: 1450, y: 330 },
    { f: fAcel - 6, zoom: 1.5, x: 1450, y: 330 },
    { f: fAcel + 14, zoom: 1.7, x: 1120, y: 880 },
    { f: fAdem - 6, zoom: 1.7, x: 1120, y: 880 },
    { f: fAdem + 16, zoom: 1.25, x: 1460, y: 450 },
    { f: fColor - 8, zoom: 1.25, x: 1460, y: 450 },
    { f: fColor + 10, zoom: 1.25, x: 1460, y: 610 },
    { f: dur, zoom: 1.25, x: 1460, y: 610 },
  ];
  const marks = [
    { from: fCap - 2, to: fSal - 6, x: 10, y: 68, w: 232, h: 92, r: 14, label: 'Capítulos' },
    { from: fSal, to: fMar - 4, x: 866, y: 1016, w: 184, h: 52, r: 26, label: 'Saltos de 15 segundos' },
    { from: fMar - 2, to: fBus - 6, x: 807, y: 1018, w: 48, h: 44, r: 22, label: 'Marcadores' },
    { from: fBus + 4, to: tMenuOff - 2, x: 1690, y: 52, w: 214, h: 50, r: 12, label: 'Buscar en el texto', labelBelow: true },
    { from: fCuatro - 4, to: fAdem - 6, x: 1036, y: 952, w: 324, h: 58, r: 12, label: 'Velocidad: hasta 4x' },
    { from: fTema - 2, to: fLetra - 6, x: 1523, y: 64, w: 378, h: 84, r: 12, label: 'Tema' },
    { from: fLetra - 2, to: fTam - 6, x: 1523, y: 158, w: 378, h: 82, r: 12, label: 'Letra' },
    { from: fTam - 2, to: fColor - 6, x: 1523, y: 254, w: 378, h: 52, r: 12, label: 'Tamaño' },
    { from: fColor, to: dur, x: 1523, y: 548, w: 378, h: 452, r: 14, label: 'Color del resaltado', labelBelow: false },
  ];
  return (
    <Stage>
      <AppWindow url="elevenreader.io/reader/library" width={WIN} y={10}>
        <AppView width={WIN} states={states} camera={camera} marks={marks}
          overlay={(f) => <Patch src={st(pref(f))} {...PANEL} inAt={tPanel} />} />
      </AppWindow>
      <Sfx name="focus" at={fCap} />
      <Sfx name="tick_soft" at={fSal} />
      <Sfx name="tick_soft" at={fMar} />
      <Sfx name="click" at={tMenu} />
      <Sfx name="click" at={tMenuOff} />
      <Sfx name="tick_soft" at={fCuatro - 6} />
      <Sfx name="tick_soft" at={fVeces - 6} />
      <Sfx name="swipe" at={tPanel} />
      <Sfx name="ui_tap" at={fTema - 4} />
      <Sfx name="ui_tap" at={fLetra - 4} />
      <Sfx name="ui_tap" at={fTam - 4} />
      <Sfx name="ui_tap" at={fColor - 2} />
    </Stage>
  );
};

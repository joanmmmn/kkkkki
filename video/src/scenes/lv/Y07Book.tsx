import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { clamp, easeInOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { IcDownload, IcPlay } from '../er/icons';
import { B, LvWeb, lvw, markOn, row, Tile } from './common';
import { w } from './timeline';

const ID = 'Y07';
const FPS = 50;

const Badge: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 1, padding: '6px 10px', borderRadius: 10, background: color.ink, color: color.yellow }}>{t}</div>
);

// Y07 · La ficha de un libro: duración, quién lee cada capítulo y las formas de escucharlo y descargarlo.
export const Y07Book: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L07', word, n);
  const fDur = at('duración');
  const fQuien = at('quién');
  const fFormas = at('formas');
  const fPlay = at('Play');
  const fTit = at('título');
  const fWhole = at('Whole');
  const fM4B = at('M4B');
  const fRec = at('recuerda');
  const fSin = at('restricciones') - 6;
  const r1 = row('Creed en Dios');
  const readers = B['book:readers'].slice(0, 9);
  // Lectores de los cuatro primeros capítulos (los que caben en el encuadre).
  const top = readers[0].readerBox, bot = readers[3].readerBox;
  // Cámara suave, con pocos movimientos y largos: se acerca a un encuadre que contiene la duración, los lectores y las
  // formas de escuchar; se acerca un poco más para Play, el título (MP3) y «Whole book»; después se abre despacio hasta un
  // encuadre en el que caben a la vez «Whole book» y el M4B (el marco se desliza de uno a otro sin salir de cuadro) y, al
  // final, se aleja.
  const camera = [
    { f: 0, zoom: 1.0, x: 640, y: 380 },
    { f: fDur - 64, zoom: 1.0, x: 640, y: 380 },
    { f: fDur + 6, zoom: 1.2, x: 600, y: 700 },
    { f: fFormas - 10, zoom: 1.22, x: 590, y: 690 },
    { f: fPlay - 6, zoom: 1.36, x: 500, y: 650 },
    { f: fWhole + 30, zoom: 1.36, x: 500, y: 650 },
    { f: fM4B - 6, zoom: 1.25, x: 470, y: 790 },
    { f: fSin - 30, zoom: 1.26, x: 470, y: 795 },
    { f: fSin + 70, zoom: 1.0, x: 640, y: 620 },
  ];
  const marks = [
    markOn([160, 734, 240, 22], fDur - 4, fQuien - 8, 6, { label: '10 h 05 min' }),
    markOn([top[0], top[1], top[2], bot[1] + bot[3] - top[1]], fQuien - 2, fFormas - 8, 4, { label: 'Quién lee cada capítulo' }),
    markOn([160, 490, 240, 180], fFormas - 4, fPlay - 10, 8),
    markOn(r1.play, fPlay - 6, fTit - 8, 8, { label: 'En el navegador' }),
    markOn(B['book:title:Creed en Dios'], fTit - 4, fWhole - 10, 6, { label: 'MP3 · alta calidad' }),
    markOn([160, 525, 205, 28], fWhole - 4, fM4B - 10, 6, { label: 'Todo el libro (ZIP)', labelBelow: true }),
    markOn([160, 1016, 140, 37], fM4B - 4, fSin - 4, 6, { label: 'Audiolibro M4B' }),
  ];
  const s = (f: number) => f / FPS;
  const cursor = [
    { t: 0, x: 900, y: 500, down: false },
    { t: s(fPlay - 6), x: r1.play[0] + 6, y: r1.play[1] + 10, down: false },
    { t: s(fPlay), x: r1.play[0] + 6, y: r1.play[1] + 10, down: true },
    { t: s(fPlay + 6), x: r1.play[0] + 6, y: r1.play[1] + 10, down: false },
    { t: s(fTit - 4), x: B['book:title:Creed en Dios'][0] + 40, y: B['book:title:Creed en Dios'][1] + 8, down: false },
    { t: s(fWhole - 4), x: 325, y: 539, down: false },
    { t: s(fM4B - 4), x: 220, y: 1024, down: false },
  ];
  const fin = spring({ frame: frame - fSin, fps, config: { damping: 14, stiffness: 170 } });
  // La ventana empieza centrada y se aparta a la izquierda cuando entran las fichas de formatos.
  const side = interpolate(frame, [fPlay - 56, fPlay - 2], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ transform: `translateX(${-300 * side}px)` }}>
        <LvWeb states={[{ at: 0, src: lvw('book') }]} page="book" camera={camera} marks={marks} cursor={cursor} width={1220} y={10}
          url="librivox.org/leyendas-by-gustavo-adolfo-becquer" />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 1330, top: 150, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Tile at={fPlay - 4} width={520} icon={<IcPlay size={40} c={color.ink} />} title="Play" sub="se escucha en el navegador" />
        <Tile at={fTit - 4} width={520} icon={<Badge t="MP3" />} title="Cada capítulo" sub="MP3 en alta calidad" />
        <Tile at={fWhole - 4} width={520} icon={<IcDownload size={40} w={2.2} />} title="Whole book" sub="el libro entero en un ZIP" />
        <Tile at={fM4B - 4} width={520} icon={<Badge t="M4B" />} title="Audiolibro M4B" sub={<>con capítulos{fRec <= frame ? ', recuerda por dónde vas' : ''}</>} />
        <div style={{ alignSelf: 'flex-start', marginTop: 8, padding: '18px 30px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 38, boxShadow: shadow.float, opacity: fin, transform: `scale(${0.8 + 0.2 * fin})` }}>
          Sin restricciones: son tuyos
        </div>
      </div>
      <Sfx name="marker" at={fDur} />
      <Sfx name="marker" at={fQuien} />
      <Sfx name="mouse_click" at={fPlay} />
      <Sfx name="ui_pop" at={fPlay + 2} />
      <Sfx name="ui_pop" at={fTit - 2} />
      <Sfx name="ui_pop" at={fWhole - 2} />
      <Sfx name="ui_pop" at={fM4B - 2} />
      <Sfx name="success" at={fSin + 2} volume={0.7} />
    </Stage>
  );
};

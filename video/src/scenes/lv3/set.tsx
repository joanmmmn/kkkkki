import React from 'react';
import { AbsoluteFill } from 'remotion';
import { img3, Rig, Space } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// «Plató» de la biblioteca: el pasillo de estanterías con las luces encendidas, visto desde la altura de los ojos.
// Se renderiza una vez como imagen (npx remotion still LVSetPlate) y, desenfocada, es el fondo de todo el vídeo
// (tools/lv3_set.py): así nunca hay un fondo negro detrás de los planos.
// ---------------------------------------------------------------------------------------------------------------
const FLOOR_Y = 2900, AISLE = 2600, WALL_H = 9600, WALL_L = 30000, Q = 4;
const wall = (side: 1 | -1): React.CSSProperties => ({
  position: 'absolute', left: -WALL_L / Q / 2, top: -WALL_H / Q / 2, width: WALL_L / Q, height: WALL_H / Q, overflow: 'hidden',
  backgroundImage: `url(${img3('shelves.jpg')})`, backgroundSize: `${14400 / Q}px ${6000 / Q}px`, backgroundRepeat: 'repeat',
  transform: `translate3d(${side * -AISLE}px, ${FLOOR_Y - WALL_H / 2}px, ${-WALL_L / 2 + 4000}px) rotateY(${side * 90}deg) scale(${Q})`,
});
// Lámparas colgantes a lo largo del pasillo (desenfocadas serán el bokeh cálido del fondo)
const LAMPS = Array.from({ length: 9 }, (_, i) => ({ z: 2500 - i * 3200, x: (i % 2 ? 1 : -1) * 900 }));

export const SetPlate: React.FC = () => (
  <AbsoluteFill style={{ background: '#120d09' }}>
    <Space persp={1300}>
      <Rig cam={{ x: 0, y: 900, z: 0, rx: -3, ry: 6 }}>
        <div style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
          {([1, -1] as const).map((s) => (
            <div key={s} style={wall(s)}>
              {/* más oscuro hacia el fondo del pasillo */}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${s === 1 ? 'to right' : 'to left'}, rgba(10,6,3,0.05) 0%, rgba(10,6,3,0.35) 45%, rgba(10,6,3,0.7) 100%)` }} />
            </div>
          ))}
          {/* suelo de madera con una alfombra */}
          <div style={{ position: 'absolute', left: -AISLE / Q, top: -WALL_L / Q / 2, width: (AISLE * 2) / Q, height: WALL_L / Q,
            transform: `translate3d(0px, ${FLOOR_Y}px, ${-WALL_L / 2 + 4000}px) rotateX(90deg) scale(${Q})`,
            background: `linear-gradient(0deg, rgba(10,6,3,0.1) 0%, rgba(10,6,3,0.75) 100%), linear-gradient(90deg, transparent 0 36%, #5a2420 36% 37%, #6e2c24 37% 63%, #5a2420 63% 64%, transparent 64%), repeating-linear-gradient(90deg, #5a3f28 0 ${380 / Q}px, #4b3421 ${380 / Q}px ${760 / Q}px)` }} />
          {/* techo */}
          <div style={{ position: 'absolute', left: -AISLE / Q, top: -WALL_L / Q / 2, width: (AISLE * 2) / Q, height: WALL_L / Q,
            transform: `translate3d(0px, ${FLOOR_Y - WALL_H}px, ${-WALL_L / 2 + 4000}px) rotateX(90deg) scale(${Q})`, background: 'linear-gradient(0deg, #1a120c, #0d0906)' }} />
          {/* pared del fondo */}
          <div style={{ position: 'absolute', left: -AISLE / Q, top: -WALL_H / Q / 2, width: (AISLE * 2) / Q, height: WALL_H / Q,
            transform: `translate3d(0px, ${FLOOR_Y - WALL_H / 2}px, ${-WALL_L + 4000}px) scale(${Q})`, backgroundImage: `url(${img3('shelves.jpg')})`, backgroundSize: `${14400 / Q}px ${6000 / Q}px` }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,6,3,0.55)' }} />
          </div>
          {/* lámparas: un disco de luz y el charco que dejan en el suelo */}
          {LAMPS.map((l, i) => (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: -170, top: -170, width: 340, height: 340, borderRadius: '50%', transform: `translate3d(${l.x}px, ${FLOOR_Y - 5200}px, ${l.z}px)`,
                background: 'radial-gradient(circle, rgba(255,236,190,1) 0%, rgba(255,214,150,0.85) 25%, rgba(255,190,110,0.25) 55%, rgba(255,190,110,0) 72%)' }} />
              <div style={{ position: 'absolute', left: -1500, top: -1500, width: 3000, height: 3000, borderRadius: '50%', transform: `translate3d(${l.x}px, ${FLOOR_Y - 4}px, ${l.z}px) rotateX(90deg)`,
                background: 'radial-gradient(circle, rgba(255,205,140,0.38) 0%, rgba(255,205,140,0.12) 45%, rgba(255,205,140,0) 70%)' }} />
            </React.Fragment>
          ))}
        </div>
      </Rig>
    </Space>
  </AbsoluteFill>
);

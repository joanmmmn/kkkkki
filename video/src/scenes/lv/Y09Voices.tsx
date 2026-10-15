import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { IcHeadphones } from '../er/icons';
import { clamp, easeInOut } from '../../lib/anim';
import { Wave } from '../er2/AppView';
import { B, Chip, CropLv, LvWeb, lvw, markOn } from './common';
import { itemAt, itemEnd, w } from './timeline';

const ID = 'Y09';
// Los 11 voluntarios que leen las Leyendas, en orden de aparición en la ficha.
const READERS = ['Aldariel', 'Gabriela Cowan', 'Marial', 'Vicente Cepeda', 'Elena del Valle', 'Omar', 'frauka', 'Legentis', 'DreamVoz', 'Rosacarmela', 'sabandija'];
const CLIPS: { id: string; reader: string; title: string }[] = [
  { id: 't_omar', reader: 'Omar', title: 'El rayo de luna' },
  { id: 't_elena', reader: 'Elena del Valle', title: 'El monte de las ánimas' },
  { id: 't_vicente', reader: 'Vicente Cepeda', title: 'El miserere' },
  { id: 't_rosa', reader: 'Rosacarmela', title: 'Los ojos verdes' },
];

// Y09 · Las voces: voluntarios, calidad variable · 11 voces en las Leyendas (cuatro suenan) · escucha un minuto, elige versión.
export const Y09Voices: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L09A', word, n);
  const bt = (word: string, n = 0) => w(ID, 'L09B', word, n);
  const fVol = at('voluntarios');
  const fCal = at('calidad');
  const fCap = at('capítulo');
  const fLey = at('Leyendas') - 10;
  const fOnce = at('once');
  const c0 = itemAt(ID, 't_omar');
  const fMin = bt('minuto');
  const fVers = bt('versiones') - 6;
  const fTips = itemAt(ID, 'L09B') - 8;
  const active = CLIPS.findIndex((c) => frame >= itemAt(ID, c.id) - 2 && frame < itemEnd(ID, c.id) + 6);
  const r0 = B['book:readers'][0].readerBox, r11 = B['book:readers'][11].readerBox;
  const vS = spring({ frame: frame - fVol + 2, fps, config: { damping: 15, stiffness: 180 } });
  const qS = spring({ frame: frame - fCal + 2, fps, config: { damping: 15, stiffness: 180 } });
  const q = (B as unknown as Record<string, { box: [number, number, number, number] }[]>)['quijote:items'];
  return (
    <Stage tone="warm">
      <Phase from={0} to={fLey}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <Words text="¿Y las voces?" start={0} size={110} weight={700} />
          <div style={{ display: 'flex', gap: 26 }}>
            <div style={{ padding: '22px 40px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 46, fontWeight: 700, opacity: vS, transform: `scale(${0.85 + 0.15 * vS})` }}>Voluntarios</div>
            <div style={{ padding: '22px 40px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, fontFamily: font.sans, fontSize: 46, fontWeight: 700, opacity: qS, transform: `scale(${0.85 + 0.15 * qS})` }}>
              La calidad <Highlight start={fCal - 4 + 16}>cambia</Highlight>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, fontFamily: font.sans, fontSize: 36, color: color.ink2 }}>
            <Chip at={at('libro') - 4} size={34}>de libro a libro</Chip>
            <Chip at={fCap - 6} size={34} bg={color.yellow}>y de capítulo a capítulo</Chip>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fLey} to={c0 - 4}>
        <AbsoluteFill>
          <LvWeb states={[{ at: 0, src: lvw('book') }]} page="book" width={1500} y={20}
            camera={[{ f: 0, zoom: 1.25, x: 860, y: 700 }, { f: c0 - fLey, zoom: 1.25, x: 860, y: 980 }]}
            marks={[markOn([r0[0], r0[1], r0[2], r11[1] + r11[3] - r0[1]], fOnce - fLey - 6, 400, 4, { label: 'Un lector por leyenda' })]} />
          <div style={{ position: 'absolute', right: 110, top: 120, padding: '26px 38px', borderRadius: 32, background: color.yellow, fontFamily: font.sans, boxShadow: shadow.float, opacity: spring({ frame: frame - fOnce + 2, fps }), transform: `rotate(4deg) scale(${spring({ frame: frame - fOnce + 2, fps, config: { damping: 12 } })})` }}>
            <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 0.9, letterSpacing: -4 }}>11</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>voces distintas</div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={c0 - 4} to={fTips}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 46 }}>
          <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.serif, fontSize: 84, fontStyle: 'italic' }}>
            {active >= 0 ? `«${CLIPS[active].title}»` : ''}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22, width: 1600 }}>
            {READERS.map((r, i) => {
              const on = active >= 0 && CLIPS[active].reader === r;
              const played = CLIPS.findIndex((c) => c.reader === r);
              const done = played >= 0 && frame > itemEnd(ID, CLIPS[played].id) + 6;
              const sIn = spring({ frame: frame - (c0 - 4) - i * 2, fps, config: { damping: 16, stiffness: 180 } });
              return (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: on ? '20px 34px 20px 20px' : '18px 30px', borderRadius: 999, background: on ? color.yellow : '#fff', border: `1px solid ${on ? color.yellow : color.line}`, boxShadow: on ? '0 20px 50px rgba(255,202,5,0.45)' : shadow.soft, fontFamily: font.sans, fontSize: on ? 46 : 36, fontWeight: 700, color: done && !on ? color.ink2 : color.ink, opacity: sIn, transform: `translateY(${(1 - sIn) * 30}px) scale(${on ? 1.08 : 1})` }}>
                  {on && <div style={{ width: 54, height: 54, borderRadius: 27, background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wave on h={22} c={color.yellow} /></div>}
                  {r}
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: color.muted, opacity: interpolate(frame, [c0, c0 + 18], [0, 1], { ...clamp, easing: easeInOut }) }}>Audio real de LibriVox · cuatro de los once voluntarios</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fTips} to={dur} hold>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 50 }}>
          {(() => {
            const a = spring({ frame: frame - fMin + 6, fps, config: { damping: 15, stiffness: 170 } });
            const b = spring({ frame: frame - fVers, fps, config: { damping: 15, stiffness: 170 } });
            const ring = interpolate(frame, [fMin, fMin + 60], [0, 1], clamp);
            return (
              <>
                <div style={{ width: 780, padding: '44px 48px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, display: 'flex', alignItems: 'center', gap: 34, opacity: a, transform: `translateY(${(1 - a) * 50}px)` }}>
                  <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
                    <svg width={150} height={150} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}><circle cx={75} cy={75} r={66} fill="none" stroke="#EEE" strokeWidth={12} /><circle cx={75} cy={75} r={66} fill="none" stroke={color.yellow} strokeWidth={12} strokeLinecap="round" strokeDasharray={415} strokeDashoffset={415 * (1 - ring)} /></svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcHeadphones size={64} w={2} /></div>
                  </div>
                  <div style={{ fontFamily: font.sans }}>
                    <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.05 }}>Escucha 1 minuto</div>
                    <div style={{ fontSize: 32, color: color.ink2, marginTop: 8 }}>antes de empezar</div>
                  </div>
                </div>
                <div style={{ width: 760, padding: '36px 40px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: b, transform: `translateY(${(1 - b) * 50}px)` }}>
                  <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 700, marginBottom: 18 }}>¿Varias versiones? <Highlight start={fVers - fTips + 20}>Elige</Highlight></div>
                  <CropLv name="search_quijote" box={[q[0].box[0] + 60, q[0].box[1], q[0].box[2] - 60, q[2].box[1] + q[2].box[3] - q[0].box[1]]} width={680} radius={14} />
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      </Phase>

      <Sfx name="ui_pop" at={fVol} />
      <Sfx name="marker" at={fCal + 12} />
      <Sfx name="ui_pop" at={at('libro') - 2} />
      <Sfx name="ui_pop" at={fCap - 4} />
      <Sfx name="whoosh_soft" at={fLey} />
      <Sfx name="marker" at={fOnce - 6} />
      <Sfx name="pop_bright" at={fOnce} volume={0.8} />
      <Sfx name="whoosh_soft" at={c0 - 6} volume={0.5} />
      <Sfx name="card_flip" at={fTips + 4} />
      <Sfx name="ui_pop" at={fVers} />
      <Sfx name="marker" at={fVers + 20} />
    </Stage>
  );
};

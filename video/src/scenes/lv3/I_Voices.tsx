import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, cover, Draw, eIO, eOut, Fleuron, follow, InkWords, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { Clock, Mic } from './glyphs';
import { CLIP3, itemAt, w } from './timeline';
import { Crop } from './web';
import PEAKS from '../../../public/lv/audio3/peaks.json';

// ---------------------------------------------------------------------------------------------------------------
// Plano I (S12): cómo suenan. Las Leyendas, abiertas en un atril: la página del reparto (once voluntarios) y, pasando
// páginas, cuatro voces reales, cada una con su leyenda, su nombre y su onda; el texto se entinta al ritmo de la voz.
// Después, el consejo: escuchar un minuto antes de empezar y, si hay varias versiones, quedarse con la voz que guste.
// ---------------------------------------------------------------------------------------------------------------
const PW = 800, PH = 1040; // página
const PK = PEAKS as Record<string, number[]>;
const CAST = ['Aldariel', 'Gabriela Cowan', 'Marial', 'Vicente Cepeda', 'Elena del Valle', 'Omar', 'frauka', 'Legentis', 'DreamVoz', 'Rosacarmela', 'sabandija'];
// cut: el fragmento empieza a mitad de frase; open: acaba a mitad de frase (se cita con […])
const VOICES: { clip: string; reader: string; legend: string; n: string; cut?: boolean; open?: boolean }[] = [
  { clip: 'v_omar', reader: 'Omar', legend: 'El rayo de luna', n: '09', cut: true, open: true },
  { clip: 'v_elena', reader: 'Elena del Valle', legend: 'El monte de las ánimas', n: '08', open: true },
  { clip: 'v_vicente', reader: 'Vicente Cepeda', legend: 'El miserere', n: '07', open: true },
  { clip: 'v_rosa', reader: 'Rosacarmela', legend: 'Los ojos verdes', n: '20' },
];
const PICK = [5, 4, 3, 9]; // posiciones en el reparto de las cuatro voces, en el orden en que se escuchan
const TURN = 30;

const pageBase = (side: 'L' | 'R'): React.CSSProperties => ({
  position: 'absolute', inset: 0, ...paperBg(T.paper), overflow: 'hidden',
  borderRadius: side === 'L' ? '10px 2px 2px 10px' : '2px 10px 10px 2px',
});
const Gutter: React.FC<{ side: 'L' | 'R' }> = ({ side }) => (
  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${side === 'L' ? 90 : 270}deg, rgba(0,0,0,0) 80%, rgba(90,60,20,0.24) 100%)`, pointerEvents: 'none' }} />
);
const Head: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', top: 54, left: 0, right: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 28, color: T.inkSoft }}>{text}</div>
);

// Onda real de un fragmento, con lo ya escuchado en verde azulado
const Waveform: React.FC<{ clip: string; clipAt: number; width: number; height: number }> = ({ clip, clipAt, width, height }) => {
  const frame = useCurrentFrame();
  const pk = PK[clip];
  const dur = CLIP3[clip].dur * 50;
  const pos = Math.max(0, Math.min(1, (frame - clipAt) / dur));
  const bw = width / pk.length;
  return (
    <div style={{ position: 'relative', width, height, display: 'flex', alignItems: 'center' }}>
      {pk.map((v, i) => (
        <div key={i} style={{ width: bw * 0.62, marginRight: bw * 0.38, height: Math.max(3, v * height), borderRadius: 2, background: i / pk.length < pos ? T.teal : 'rgba(42,37,32,0.18)' }} />
      ))}
      <div style={{ position: 'absolute', left: pos * width, top: -10, bottom: -10, width: 2.5, background: T.redInk, opacity: frame >= clipAt && pos < 1 ? 1 : 0 }} />
    </div>
  );
};

// Páginas: reparto (0) y las cuatro voces (1-4)
const LeftPage: React.FC<{ i: number; f: { once: number; calidad: number } }> = ({ i, f }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (i === 0) {
    const n = sp(frame, f.once - 6, fps, 120, 18);
    const q = ramp(frame, f.calidad - 10, f.calidad + 20, eOut);
    return (
      <div style={pageBase('L')}>
        <Gutter side="L" />
        <Head text="Leyendas" />
        <div style={{ position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', color: T.ink }}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 52, color: T.inkSoft }}>Leído por</div>
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 290, lineHeight: 1, color: T.ink, opacity: Math.min(1, n), transform: `scale(${0.85 + 0.15 * Math.min(1, n)})` }}>11</div>
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 60, opacity: Math.min(1, n) }}>voluntarios</div>
          <div style={{ marginTop: 30 }}><Fleuron at={f.once} w={240} color={T.inkFaint} /></div>
        </div>
        {/* la calidad cambia: tres ondas anónimas, distintas */}
        <div style={{ position: 'absolute', left: 150, right: 150, top: 820, display: 'flex', flexDirection: 'column', gap: 18, opacity: q }}>
          {[[1, 0], [0.45, 0], [0.85, 0.5]].map(([amp, noise], k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3, height: 34 }}>
              {Array.from({ length: 64 }, (_, j) => {
                const base = Math.abs(Math.sin(j * 0.55 + k * 2) * Math.sin(j * 0.21 + k)) * amp;
                const h = 3 + 30 * Math.max(base, noise * (0.25 + 0.2 * Math.abs(Math.sin(j * 7.3 + frame / 2))));
                return <div key={j} style={{ width: 4, height: h, borderRadius: 2, background: 'rgba(42,37,32,0.42)' }} />;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
  const v = VOICES[i - 1];
  const clipAt = itemAt('S12', v.clip);
  return (
    <div style={pageBase('L')}>
      <Gutter side="L" />
      <Head text={`Leyendas · ${v.n}`} />
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', color: T.ink }}>
        <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 62, lineHeight: 1.1, padding: '0 60px' }}>{v.legend}</div>
        <div style={{ marginTop: 26 }}><Fleuron at={-100} w={220} color={T.inkFaint} /></div>
        <div style={{ marginTop: 60, fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.inkSoft }}>leído por</div>
        <div style={{ marginTop: 6, fontFamily: T.serif, fontSize: 88, color: T.teal, lineHeight: 1.05 }}>{v.reader}</div>
        <div style={{ marginTop: 46, display: 'flex', justifyContent: 'center' }}><Mic size={60} c={T.inkSoft} w={1.6} /></div>
      </div>
      <div style={{ position: 'absolute', left: 100, right: 100, top: 830 }}><Waveform clip={v.clip} clipAt={clipAt} width={600} height={90} /></div>
    </div>
  );
};
const RightPage: React.FC<{ i: number; f: { cuatro: number } }> = ({ i, f }) => {
  const frame = useCurrentFrame();
  if (i === 0) {
    return (
      <div style={pageBase('R')}>
        <Gutter side="R" />
        <Head text="Gustavo Adolfo Bécquer" />
        <div style={{ position: 'absolute', top: 150, left: 120, right: 100 }}>
          {CAST.map((name, k) => {
            const pick = PICK.indexOf(k);
            const rf = f.cuatro + 4 + pick * 6;
            return (
              <div key={name} style={{ position: 'relative', height: 70, display: 'flex', alignItems: 'center', fontFamily: T.serif, fontSize: 46, color: pick >= 0 && frame >= rf ? T.ink : T.inkSoft }}>
                <span style={{ width: 70, fontSize: 30, color: T.inkFaint }}>{String(k + 1).padStart(2, '0')}</span>
                <span style={{ position: 'relative' }}>
                  {name}
                  {pick >= 0 && <Draw at={rf} dur={14} w={520} h={80} color={T.teal} width={3.2} style={{ left: -26, top: -14 }}
                    d={`M 18 44 C 14 14, ${name.length * 22 + 40} 6, ${name.length * 22 + 52} 34 C ${name.length * 22 + 60} 62, 30 70, 22 48`} len={1400} />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  const v = VOICES[i - 1];
  const clipAt = itemAt('S12', v.clip);
  return (
    <div style={pageBase('R')}>
      <Gutter side="R" />
      <Head text={v.legend} />
      <div style={{ position: 'absolute', left: 96, right: 90, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
          <InkWords clip={v.clip} clipAt={clipAt} size={64} lh={1.42} color={T.ink} faint={T.inkFaint}
            before={<span style={{ color: T.redInk }}>«{v.cut ? <span style={{ color: T.inkSoft }}>[…] </span> : null}</span>}
            close={<span style={{ color: T.redInk }}>{v.open ? <span style={{ color: T.inkSoft }}> […]</span> : null}»</span>} />
        </div>
      </div>
    </div>
  );
};

// Hoja que gira sobre el lomo: delante, la página derecha actual; detrás, la izquierda siguiente
const Leaf: React.FC<{ p: number; front: React.ReactNode; back: React.ReactNode }> = ({ p, front, back }) => {
  const shade = Math.sin(p * Math.PI);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transformOrigin: 'left center', transform: `translateZ(${2 + 30 * shade}px) rotateY(${-180 * p}deg)`, transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
        {front}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,${0.1 * shade}) 0%, rgba(0,0,0,${0.45 * shade}) 100%)` }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        {back}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(270deg, rgba(0,0,0,${0.08 * shade}) 0%, rgba(0,0,0,${0.4 * shade}) 100%)` }} />
      </div>
    </div>
  );
};

export const Voices: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S12', 'K12', word, n);
  const at13 = (word: string, n = 0) => w('S12', 'K13', word, n);
  const fCalidad = at('calidad'), fOnce = at('once'), fCuatro = at('cuatro'), fEllas = at('ellas');
  const fConsejo = at13('consejo'), fMinuto = at13('minuto'), fVarias = at13('varias'), fQuedate = at13('quédate'), fVoz = at13('voz');
  const clipStart = VOICES.map((v) => itemAt('S12', v.clip));
  const clipEnd = VOICES.map((v, i) => clipStart[i] + Math.round(CLIP3[v.clip].dur * 50));
  // Giros de página: reparto → Omar → Elena → Vicente → Rosacarmela
  const turns = [fEllas + 12, clipEnd[0] - 6, clipEnd[1] - 6, clipEnd[2] - 6];
  let page = 0;
  turns.forEach((t, k) => { if (frame >= t + TURN) page = k + 1; });
  const turning = turns.findIndex((t) => frame >= t && frame < t + TURN);
  const tp = turning >= 0 ? ramp(frame, turns[turning], turns[turning] + TURN, eIO) : 0;
  const f = { once: fOnce, calidad: fCalidad, cuatro: fCuatro };
  // Apertura del libro (tapa)
  const open = ramp(frame, 8, 60, eIO);
  const end = ramp(frame, fConsejo - 30, fConsejo + 20, eIO);
  const cam = follow(frame, [
    { f: 0, x: 420, y: 10, z: -330, rx: 4, ry: -10 },
    { f: 66, x: 0, y: 0, z: -420, rx: 4, ry: -3 },
    { f: fCuatro, x: 160, y: 0, z: -330, rx: 3, ry: -4 },
    { f: turns[0] + 20, x: 0, y: 0, z: -400, rx: 3, ry: 0 },
    { f: clipEnd[0], x: 120, y: 0, z: -330, rx: 3, ry: -4 },
    { f: clipEnd[1], x: 80, y: 0, z: -330, rx: 3, ry: -2 },
    { f: clipEnd[2], x: 120, y: 0, z: -330, rx: 3, ry: -4 },
    { f: clipEnd[3], x: 80, y: 0, z: -340, rx: 3, ry: -2 },
    { f: fConsejo + 30, x: 0, y: -60, z: -620, rx: 6, ry: 0 },
    { f: dur, x: 20, y: -60, z: -660, rx: 6, ry: -1 },
  ], 4.4);
  // Consejo
  const tip = sp(frame, fConsejo - 8, fps, 110, 22);
  const tip1 = ramp(frame, fMinuto - 20, fMinuto, eOut);
  const vers = [sp(frame, fVarias - 6, fps, 120, 22), sp(frame, fVarias + 4, fps, 120, 22)];
  const ribbon = ramp(frame, fQuedate - 4, fQuedate + 22, eOut);
  const fav = ramp(frame, fVoz - 6, fVoz + 12, eOut);

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* atril */}
          <At x={0} y={40} z={-40} w={PW * 2 + 160} h={PH + 120} o={1 - 0.55 * end}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(180deg, #4a3322, #2f2016 70%, #23170f)', boxShadow: '0 60px 140px rgba(0,0,0,0.75)' }} />
          </At>
          <At x={0} y={PH / 2 + 70} z={30} w={PW * 2 + 220} h={44} o={1 - 0.55 * end}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: 'linear-gradient(180deg, #7a5737, #4f3622 60%, #3a2819)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
          </At>
          {/* el libro abierto */}
          <At x={0} y={0} z={0} w={PW * 2} h={PH} o={1 - 0.6 * end}>
            {/* tapas y cantos */}
            <div style={{ position: 'absolute', left: -24, top: -20, width: PW * 2 + 48, height: PH + 40, borderRadius: 14, background: 'linear-gradient(135deg, #5a2a22, #3b1913 60%, #2c120e)', transform: 'translateZ(-12px)', opacity: open }} />
            <div style={{ position: 'absolute', left: -8, top: -6, width: PW * 2 + 16, height: PH + 12, borderRadius: 8, background: 'repeating-linear-gradient(0deg, #e9dfc7 0 2px, #cfc2a3 2px 3px)', transform: 'translateZ(-5px)', opacity: open }} />
            {/* izquierda */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, opacity: open }}>
              <LeftPage i={page} f={f} />
            </div>
            {/* derecha (la siguiente, debajo de la hoja que gira) */}
            <div style={{ position: 'absolute', left: PW, top: 0, width: PW, height: PH }}>
              <RightPage i={turning >= 0 ? turning + 1 : page} f={f} />
            </div>
            {/* hoja que gira */}
            {turning >= 0 && (
              <div style={{ position: 'absolute', left: PW, top: 0, width: PW, height: PH, transformStyle: 'preserve-3d' }}>
                <Leaf p={tp} front={<RightPage i={turning} f={f} />} back={<LeftPage i={turning + 1} f={f} />} />
              </div>
            )}
            {/* tapa que se abre al principio */}
            {open < 1 && (
              <div style={{ position: 'absolute', left: PW, top: -20, width: PW + 24, height: PH + 40, transformOrigin: 'left center', transform: `translateZ(${4 + 40 * Math.sin(open * Math.PI)}px) rotateY(${-180 * open}deg)`, transformStyle: 'preserve-3d' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '4px 14px 14px 4px', background: 'linear-gradient(135deg, #5a2a22, #3b1913 60%, #2c120e)', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Img src={cover('5079')} style={{ width: 520, height: 520, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '14px 4px 4px 14px', background: '#2c120e', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }} />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 60% 30%, rgba(255,236,190,0) 0%, rgba(40,20,0,0.16) 100%)', pointerEvents: 'none' }} />
          </At>
          {/* consejo */}
          <At x={-470} y={40} z={320} w={720} h={330} o={Math.min(1, tip)} rz={-2}>
            <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 8, boxShadow: '0 40px 90px rgba(0,0,0,0.6)', transform: `translateY(${(1 - Math.min(1, tip)) * 80}px)` }}>
              <div style={{ position: 'absolute', left: 50, top: 36, fontFamily: T.serif, fontStyle: 'italic', fontSize: 40, color: T.redInk }}>Nuestro consejo</div>
              <div style={{ position: 'absolute', left: 50, right: 40, top: 100, display: 'flex', alignItems: 'center', gap: 26, opacity: tip1 }}>
                <Clock size={92} c={T.teal} w={1.6} />
                <div style={{ fontFamily: T.serif, fontSize: 52, lineHeight: 1.12, color: T.ink }}>Escucha un minuto antes de empezar</div>
              </div>
            </div>
          </At>
          {/* dos versiones del mismo libro (datos reales de LibriVox) */}
          {[0, 1].map((k) => {
            const s = Math.min(1, vers[k]);
            return (
              <At key={k} x={460} y={-60 + k * 230} z={320 + (1 - s) * -200} w={760} h={190} o={s} rz={k ? 1.5 : -1}>
                <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 8, boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
                  <div style={{ position: 'absolute', left: 24, top: 24, width: 142, height: 142, transform: 'scale(2.185)', transformOrigin: '0 0' }}>
                    <Crop id="es" box={[435, k ? 411.8 : 317.8, 65, 65]} radius={2} />
                  </div>
                  <div style={{ position: 'absolute', left: 196, top: 30, right: 20, fontFamily: T.serif, fontSize: 40, lineHeight: 1.08, color: T.ink }}>El 19 de marzo y el 2 de mayo</div>
                  <div style={{ position: 'absolute', left: 196, top: 122, fontFamily: T.serif, fontStyle: 'italic', fontSize: 34, color: T.teal, whiteSpace: 'nowrap' }}>Versión {k + 1} · leída por {k ? 'Alexelmagno' : 'Tux'}</div>
                </div>
                {k === 1 && ribbon > 0 && (
                  <div style={{ position: 'absolute', right: 40, top: -16, width: 64, height: 40 + 170 * ribbon, background: T.gold, boxShadow: '0 8px 20px rgba(0,0,0,0.35)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 22px), 0 100%)' }} />
                )}
              </At>
            );
          })}
          <At x={460} y={-250} z={320} w={760} h={70} o={Math.min(1, vers[0])}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.cream }}>¿Varias versiones?</div>
          </At>
          <At x={460} y={330} z={320} w={760} h={70} o={fav}>
            <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.gold }}>quédate con la voz que más te guste</div>
          </At>
        </Rig>
      </Space>
      {/* sonido */}
      <Sfx name="book_open" at={10} volume={0.6} />
      <Sfx name="soft_impact" at={fOnce} volume={0.4} />
      {PICK.map((_, k) => <Sfx key={k} name="pen_scratch" at={fCuatro + 4 + k * 6} volume={0.35} />)}
      {turns.map((t, k) => <Sfx key={`t${k}`} name="page_turn" at={t + 4} volume={0.6} />)}
      <Sfx name="paper_slide" at={fConsejo - 6} volume={0.5} />
      <Sfx name="card_drop" at={fVarias - 2} volume={0.4} />
      <Sfx name="card_drop" at={fVarias + 8} volume={0.4} />
      <Sfx name="paper_lift" at={fQuedate} volume={0.5} />
      <Sfx name="ink_bloom" at={fVoz} volume={0.45} />
    </AbsoluteFill>
  );
};

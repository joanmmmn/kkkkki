import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { At, BookCover, eIO, eOut, follow, lerp, lvWeb, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { Archive, Check, Headphones, House, Mic } from './glyphs';
import { InkStamp } from './ink';
import { w } from './timeline';

// Plano D (S05): cómo funciona LibriVox por dentro, como una cadena de montaje de papel y tinta:
// un libro libre → sus capítulos → voluntarios que graban en casa → un revisor → la web de LibriVox (y Internet Archive)
// → sin anuncios, cuentas ni cuotas.
const BOOK = { x: -1250, y: 0 };
const VOL: { x: number; y: number; name: string }[] = [
  { x: -620, y: -330, name: 'Omar' }, { x: -540, y: -165, name: 'Elena del Valle' }, { x: -505, y: 0, name: 'Vicente Cepeda' },
  { x: -540, y: 165, name: 'Rosacarmela' }, { x: -620, y: 330, name: 'Gabriela Cowan' },
];
const CH = ['El rayo de luna', 'El monte de las ánimas', 'El miserere', 'Los ojos verdes', 'El gnomo'];
const REV = { x: 60, y: 0 };
const WEB = { x: 600, y: -90 };
const ARC = { x: 600, y: 300 };
const TAGS = [{ t: 'anuncios', y: -170 }, { t: 'cuentas', y: 0 }, { t: 'cuotas', y: 170 }];
const PX = 1700, PY = 600; // origen del plano de líneas (SVG de 3400×1200 centrado)

const Seat: React.FC<{ v: (typeof VOL)[number]; on: number; rec: number; frame: number; i: number }> = ({ v, on, rec, frame, i }) => (
  <At x={v.x} y={v.y} w={360} h={120} o={on}>
    <div style={{ position: 'absolute', left: 0, top: 10, width: 100, height: 100, borderRadius: 50, background: 'radial-gradient(circle at 35% 30%, #34505a, #1b2c33)', border: `2px solid ${T.tealLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.cream, transform: `scale(${0.7 + 0.3 * on})` }}>
      <Mic size={52} c={T.cream} />
    </div>
    <div style={{ position: 'absolute', left: -12, top: -6, width: 42, height: 42, borderRadius: 21, background: T.night3, border: `1.5px solid ${T.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: rec }}>
      <House size={26} c={T.gold} />
    </div>
    <div style={{ position: 'absolute', left: 118, top: 18, fontFamily: T.serif, fontSize: 34, color: T.cream, whiteSpace: 'nowrap' }}>{v.name}</div>
    {/* onda de grabación */}
    <div style={{ position: 'absolute', left: 118, top: 66, display: 'flex', gap: 5, alignItems: 'center', height: 36, opacity: rec }}>
      {Array.from({ length: 14 }, (_, k) => {
        const h = 6 + 26 * Math.abs(Math.sin(frame / (3.1 + (k % 4) * 0.7) + k * 1.3 + i * 2.1)) * rec;
        return <div key={k} style={{ width: 5, height: h, borderRadius: 3, background: T.tealLight }} />;
      })}
    </div>
  </At>
);

export const Pipeline: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S05', 'K05', word, n);
  const fLibro = at('libro');
  const fVol = at('voluntarios');
  const fRep = at('reparten');
  const fGrab = at('graban');
  const fCasa = at('casa');
  const fRev = at('revisor');
  const fPub = at('publica');
  const fWeb = at('web');
  const fIA = at('Internet');
  const fAn = at('anuncios'), fCu = at('cuentas'), fCo = at('cuotas');
  // El mundo se dibuja a escala K (más grande y legible); la cámara recorre la cadena de izquierda a derecha.
  const K = 1.3;
  const cam = follow(frame, [
    { f: 0, x: -780 * K, y: 0, z: -260, rx: 4, ry: 8 },
    { f: fRep + 20, x: -740 * K, y: 0, z: -200, rx: 4, ry: 5 },
    { f: fRev - 10, x: -170 * K, y: 0, z: -270, rx: 3, ry: 0 },
    { f: fWeb + 10, x: 430 * K, y: 40 * K, z: -250, rx: 3, ry: -4 },
    { f: fAn - 6, x: 730 * K, y: 10 * K, z: -250, rx: 3, ry: -7 },
    { f: dur, x: 760 * K, y: 0, z: -190, rx: 3, ry: -8 },
  ], 4.6);
  const book = sp(frame, 2, fps, 90, 20);
  const pd = ramp(frame, fLibro + 4, fLibro + 26, eOut);
  const vol = VOL.map((_, i) => sp(frame, fVol - 6 + i * 4, fps, 120, 22));
  const rec = ramp(frame, fGrab - 4, fGrab + 14, eOut);
  const casa = ramp(frame, fCasa - 4, fCasa + 12, eOut);
  const rev = sp(frame, fRev - 8, fps, 120, 22);
  const web = sp(frame, fPub - 10, fps, 110, 22);
  const arc = sp(frame, fIA - 6, fps, 120, 22);
  const lineP = (a: number, b: number) => ramp(frame, a, b, eOut);
  // Posición de cada capítulo a lo largo de la cadena
  const card = (i: number) => {
    const v = VOL[i];
    const p1 = ramp(frame, fRep - 2 + i * 4, fRep + 26 + i * 4, eIO);
    const p2 = ramp(frame, fRev - 6 + i * 6, fRev + 18 + i * 6, eIO);
    const p3 = ramp(frame, fPub - 4 + i * 5, fPub + 22 + i * 5, eIO);
    let x = BOOK.x + 40, y = BOOK.y - 20 + i * 8;
    x = lerp(x, v.x + 300, p1); y = lerp(y, v.y + 40, p1);
    x = lerp(x, REV.x + 270, p2); y = lerp(y, REV.y - 110 + i * 52, p2);
    x = lerp(x, WEB.x, p3); y = lerp(y, WEB.y + 10, p3);
    const s = 1 - 0.7 * p3;
    const o = interpolate(frame, [fRep - 4 + i * 4, fRep + 4 + i * 4], [0, 1], clamp) * (1 - ramp(frame, fPub + 14 + i * 5, fPub + 26 + i * 5));
    const ok = ramp(frame, fRev + 14 + i * 6, fRev + 24 + i * 6, eOut);
    return { x, y, s, o, ok, wave: Math.min(1, rec) };
  };
  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `scale3d(${K}, ${K}, ${K})` }}>
          {/* líneas de la cadena */}
          <At x={0} y={0} z={-2} w={3400} h={1200} flat>
            <svg width={3400} height={1200} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {VOL.map((v, i) => {
                const p = lineP(fRep - 6 + i * 4, fRep + 24 + i * 4);
                return <path key={i} d={`M ${BOOK.x + PX + 170} ${BOOK.y + PY} C ${BOOK.x + PX + 380} ${BOOK.y + PY}, ${v.x + PX - 200} ${v.y + PY + 60}, ${v.x + PX - 6} ${v.y + PY + 60}`} fill="none" stroke={T.gold} strokeOpacity={0.45} strokeWidth={2.4} strokeDasharray="2 10" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${p} 1` }} />;
              })}
              {VOL.map((v, i) => {
                const p = lineP(fRev - 10 + i * 4, fRev + 16 + i * 4);
                return <path key={`r${i}`} d={`M ${v.x + PX + 400} ${v.y + PY + 60} C ${v.x + PX + 560} ${v.y + PY + 60}, ${REV.x + PX - 220} ${REV.y + PY}, ${REV.x + PX - 70} ${REV.y + PY}`} fill="none" stroke={T.gold} strokeOpacity={0.4} strokeWidth={2.4} pathLength={1} style={{ strokeDasharray: `${p} 1` }} />;
              })}
              <path d={`M ${REV.x + PX + 80} ${REV.y + PY} C ${REV.x + PX + 260} ${REV.y + PY}, ${WEB.x + PX - 360} ${WEB.y + PY + 40}, ${WEB.x + PX - 250} ${WEB.y + PY + 40}`} fill="none" stroke={T.gold} strokeOpacity={0.5} strokeWidth={2.6} pathLength={1} style={{ strokeDasharray: `${lineP(fPub - 12, fPub + 12)} 1` }} />
              <path d={`M ${WEB.x + PX} ${WEB.y + PY + 250} L ${ARC.x + PX} ${ARC.y + PY - 80}`} fill="none" stroke={T.gold} strokeOpacity={0.5} strokeWidth={2.6} strokeDasharray="3 9" pathLength={1} style={{ strokeDasharray: `${lineP(fIA - 8, fIA + 12)} 1` }} />
            </svg>
          </At>
          {/* el libro */}
          <At x={BOOK.x} y={BOOK.y} z={20} w={300} h={300} o={book} ry={-12}>
            <div style={{ transform: `translateY(${(1 - book) * 50}px) scale(${0.9 + 0.1 * book})`, transformStyle: 'preserve-3d' }}><BookCover id="5079" size={300} depth={26} /></div>
            <div style={{ position: 'absolute', left: -40, right: -40, top: 318, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 38, color: T.cream, opacity: ramp(frame, fLibro - 4, fLibro + 14, eOut), textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>un libro libre de derechos</div>
            {/* sello de tinta sobre la portada */}
            <div style={{ position: 'absolute', left: 14, top: 212, width: 282, height: 62, transform: 'rotate(-8deg) translateZ(2px)' }}>
              <InkStamp at={fLibro + 6} w={282} h={62} color={T.teal} seed={2} border={4} radius={8}>
                <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 25, letterSpacing: 1, whiteSpace: 'nowrap' }}>DOMINIO PÚBLICO</div>
              </InkStamp>
            </div>
          </At>
          {/* voluntarios */}
          {VOL.map((v, i) => <Seat key={v.name} v={v} on={vol[i]} rec={Math.max(rec, 0) * (0.4 + 0.6 * casa)} frame={frame} i={i} />)}
          {/* revisor */}
          <At x={REV.x} y={REV.y} w={160} h={220} o={rev}>
            <div style={{ position: 'absolute', left: 10, top: 0, width: 140, height: 140, borderRadius: 70, background: 'radial-gradient(circle at 35% 30%, #3b4a2a, #1f2a16)', border: `2px solid ${T.oliveLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * rev})` }}>
              <Headphones size={76} c={T.cream} />
            </div>
            <div style={{ position: 'absolute', left: -60, right: -60, top: 154, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 40, color: T.cream, textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>un revisor</div>
          </At>
          {/* la web de LibriVox */}
          <At x={WEB.x} y={WEB.y} z={10} w={500} h={330} o={web}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden', background: '#f2f1ee', boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${40 * ramp(frame, fPub + 20, fPub + 40) * (1 - ramp(frame, fPub + 50, fPub + 90))}px rgba(255,214,150,0.7)`, transform: `scale(${0.85 + 0.15 * web})` }}>
              <div style={{ height: 34, background: '#2a2622', display: 'flex', alignItems: 'center', gap: 7, padding: '0 12px' }}>
                {[0, 1, 2].map((k) => <i key={k} style={{ width: 9, height: 9, borderRadius: 5, background: '#5a534b' }} />)}
                <span style={{ marginLeft: 10, fontFamily: '"TeX Gyre Heros", Arial', fontSize: 15, color: '#c9c0b0' }}>librivox.org</span>
              </div>
              <Img src={lvWeb('book')} style={{ width: 500, display: 'block', marginTop: -4 }} />
            </div>
          </At>
          <At x={WEB.x} y={WEB.y + 215} w={500} h={50} o={web}>
            <div style={{ textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 38, color: T.cream, textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>se publica, gratis</div>
          </At>
          {/* Internet Archive */}
          <At x={ARC.x} y={ARC.y} w={420} h={140} o={arc}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, color: T.cream, transform: `translateY(${(1 - arc) * 24}px)` }}>
              <Archive size={74} c={T.gold} />
              <span style={{ fontFamily: '"TeX Gyre Heros", Arial', fontSize: 36, letterSpacing: 0.5 }}>Internet Archive</span>
            </div>
          </At>
          {/* sin anuncios, cuentas ni cuotas */}
          {TAGS.map((t, i) => {
            const f0 = [fAn, fCu, fCo][i];
            const s = sp(frame, f0 - 8, fps, 140, 24);
            const k = ramp(frame, f0 + 2, f0 + 14, eOut);
            return (
              <At key={t.t} x={1160} y={t.y} z={20} w={330} h={110} o={s} rz={(i - 1) * 2}>
                <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 56, color: k > 0.5 ? T.inkFaint : T.ink, transform: `translateX(${(1 - s) * 60}px)` }}>
                  {t.t}
                  <div style={{ position: 'absolute', left: 38, right: 38, top: '52%', height: 7, borderRadius: 4, background: T.redInk, transformOrigin: 'left', transform: `scaleX(${k}) rotate(-5deg)` }} />
                </div>
              </At>
            );
          })}
          {/* capítulos viajando por la cadena */}
          {CH.map((c, i) => {
            const k = card(i);
            if (k.o <= 0.01) return null;
            return (
              <At key={c} x={k.x} y={k.y} z={40} w={360} h={64} s={k.s} o={k.o}>
                <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 5, boxShadow: '0 12px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
                  <div style={{ flex: 1, minWidth: 0, fontFamily: T.serif, fontSize: 24, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</div>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center', height: 26, opacity: k.wave }}>
                    {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ width: 3, height: 6 + 16 * Math.abs(Math.sin(j * 1.7 + i)), background: T.teal, borderRadius: 2 }} />)}
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: T.olive, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k.ok})` }}><Check size={20} c="#fff" w={3} /></div>
                </div>
              </At>
            );
          })}
          </div>
        </Rig>
      </Space>
      <Sfx name="card_drop" at={fLibro - 2} volume={0.6} />
      <Sfx name="date_stamp" at={fLibro + 6} volume={0.45} />
      {VOL.map((_, i) => <Sfx key={i} name="paper_lift" at={fRep + i * 4} volume={0.35} />)}
      <Sfx name="ink_bloom" at={fGrab} volume={0.5} />
      {VOL.map((_, i) => <Sfx key={`c${i}`} name="tick_soft" at={fRev + 18 + i * 6} volume={0.5} />)}
      <Sfx name="deep_whoosh" at={fPub} volume={0.4} />
      <Sfx name="soft_impact" at={fPub + 24} volume={0.45} />
      <Sfx name="ui_pop" at={fIA} volume={0.4} />
      {[fAn, fCu, fCo].map((f, i) => <Sfx key={`t${i}`} name="pencil_strike" at={f + 4} volume={0.6} />)}
    </AbsoluteFill>
  );
};

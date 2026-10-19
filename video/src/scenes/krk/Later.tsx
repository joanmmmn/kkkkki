import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { easeInOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, color, Cover, font, HANDF, KR, KR_DEEP, NEVA, OLDGOLD, Pin, ramp, rampOut, shadow, SkNight, SkStage, Thread, WAX } from './kit';
import { BASE, Staircase, STEPS } from './Themes';
import { PaperBG } from './Hook';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 05 · Mejor en papel (J33–J34) y 06 · Su vida, en sus libros (J35–J38).
// ————————————————————————————————————————————————————————————————

const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

export const FlatCover: React.FC<{ b: BookDef; w: number; rot?: number; style?: React.CSSProperties; dark?: boolean }> = ({ b, w, rot = 0, style, dark = false }) => (
  <div style={{ position: 'relative', width: w, height: w * 1.5, borderRadius: w * 0.025, overflow: 'hidden', transform: `rotate(${rot}deg)`,
    boxShadow: dark ? '0 18px 40px rgba(0,0,0,0.55)' : '0 18px 40px rgba(16,16,16,0.18), 0 4px 10px rgba(16,16,16,0.10)', ...style }}>
    <Cover b={b} w={w} h={w * 1.5} />
  </div>
);

const NoAudio: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={color.muted} strokeWidth={2} />
    <rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={color.muted} />
    <rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={color.muted} />
    <path d="M3 3 L21 21" stroke={WAX} strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

// ——— PAPEL · J33–J34 ———
// Lo que aún no tiene audiolibro en español (O lo uno o lo otro completo, El concepto de la angustia, Las obras del amor y los
// diarios, una pila de cuadernos que crece); después, el siguiente paso: en papel, con tiempo y un lápiz que subraya.
export const Papel: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('PAPEL');
  const f = {
    todav: c.at('J33', 'todavía'), uno: c.at('J33', 'uno'), comp: c.at('J33', 'completo'), ang: c.at('J33', 'concepto'), obras: c.at('J33', 'obras'), diar: c.at('J33', 'diarios'), miles: c.at('J33', 'miles'),
    p34: c.part('J34'), cuatro: c.at('J34', 'cuatro'), sig: c.at('J34', 'siguiente'), papel: c.at('J34', 'papel'), tiempo: c.at('J34', 'tiempo'), lapiz: c.at('J34', 'lápiz.'),
  };
  const items = [
    { k: 'unootro', at: f.uno, tag: 'completo', tagAt: f.comp },
    { k: 'angustia', at: f.ang },
    { k: 'obras', at: f.obras },
    { k: 'diarios', at: f.diar, tag: 'miles de páginas', tagAt: f.miles },
  ];
  const toPaper = ramp(frame, f.sig - 8, f.sig + 10);
  const under = (k: number) => ramp(frame, f.tiempo + k * 14, f.tiempo + 20 + k * 14, easeInOut);
  const pencil = ramp(frame, f.tiempo, f.lapiz + 30, (t) => t);
  return (
    <SkStage>
      <AbsoluteFill style={{ opacity: 1 - toPaper, transform: `scale(${1 - 0.05 * toPaper})` }}>
        <div style={{ position: 'absolute', left: 160, top: 90 }}>
          <Kicker at={f.todav - 4} text="Todavía sin audiolibro en español" />
          <MaskTitle text="Para después, en papel" at={f.todav} size={92} />
        </div>
        {items.map((it, i) => {
          const s = sp(frame, it.at - 4, 13, 160);
          if (frame < it.at - 5) return null;
          return (
            <div key={it.k} style={{ position: 'absolute', left: 170 + i * 420, top: 360, width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
              <Book3D b={BOOKS[it.k]} w={250} h={375} d={it.k === 'unootro' ? 70 : 40} ry={-14} rx={3} />
              <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: color.muted, background: '#fff', padding: '8px 18px', borderRadius: 999, boxShadow: shadow.soft }}>
                <NoAudio size={28} /> Sin audiolibro
              </div>
              {it.tag && <div style={{ marginTop: 14, fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, color: KR_DEEP, opacity: rampOut(frame, (it.tagAt ?? 0) - 4, (it.tagAt ?? 0) + 10) }}>{it.tag}</div>}
            </div>
          );
        })}
        {/* los cuatro que sí: marcas de hechos */}
        {frame >= f.cuatro - 6 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 22, opacity: rampOut(frame, f.cuatro - 4, f.cuatro + 10) }}>
            {['Diario de un seductor', 'Temor y temblor', 'La pureza de corazón', 'La enfermedad mortal'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, background: '#fff', padding: '10px 22px', borderRadius: 999, boxShadow: shadow.soft }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: KR, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</span>{t}
              </div>
            ))}
          </div>
        )}
      </AbsoluteFill>
      {/* en papel, con tiempo y un lápiz */}
      {toPaper > 0.01 && (
        <AbsoluteFill style={{ opacity: toPaper }}>
          <div style={{ position: 'absolute', left: 160, top: 90 }}>
            <Kicker at={f.sig - 4} text="El siguiente paso" />
            <MaskTitle text="Mejor en papel" at={f.papel - 6} size={104} hi={['papel']} />
          </div>
          <div style={{ position: 'absolute', left: 520, top: 330, width: 1100, height: 640, transform: 'rotate(-2deg)', boxShadow: shadow.card, borderRadius: 6, overflow: 'hidden' }}>
            <PaperBG tone="#F6F0E2" />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 70, display: 'flex', flexDirection: 'column', gap: 34 }}>
              {[0.96, 0.9, 0.98, 0.86, 0.94, 0.7, 0.92, 0.6].map((w, k) => (
                <div key={k} style={{ position: 'relative', height: 26 }}>
                  {(k === 1 || k === 2 || k === 4) && <div style={{ position: 'absolute', left: -8, top: -6, height: 38, width: `${under(k === 1 ? 0 : k === 2 ? 1 : 2) * w * 100 + 1}%`, background: 'rgba(255,202,5,0.5)', borderRadius: 6 }} />}
                  <div style={{ position: 'relative', height: 14, marginTop: 6, width: `${w * 100}%`, borderRadius: 7, background: 'rgba(42,32,24,0.32)' }} />
                </div>
              ))}
            </div>
          </div>
          {/* el lápiz */}
          <svg width={300} height={300} style={{ position: 'absolute', left: 560 + pencil * 820, top: 360 + [60, 120, 240][Math.min(2, Math.floor(pencil * 3))] + Math.sin(frame / 3) * 3, overflow: 'visible' }}>
            <g transform="rotate(-38)">
              <rect x={0} y={-14} width={230} height={28} rx={4} fill="#E3B23C" />
              <rect x={230} y={-14} width={28} height={28} fill="#D98A8A" />
              <path d="M0 -14 L-40 0 L0 14Z" fill="#E9D6B0" />
              <path d="M-28 -4 L-40 0 L-28 4Z" fill="#2A2018" />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      {items.map((it, i) => <Sfx key={i} name="sk_book_thud" at={it.at - 2} volume={0.45} />)}
      <Sfx name="success" at={f.cuatro} volume={0.35} />
      <Sfx name="whoosh_soft" at={f.sig - 8} volume={0.5} />
      <Sfx name="pencil_strike" at={f.tiempo} volume={0.5} />
      <Sfx name="pencil_strike" at={f.tiempo + 14} volume={0.45} />
      <Sfx name="pencil_strike" at={f.tiempo + 28} volume={0.45} />
    </SkStage>
  );
};

// ——— VIDA · J35–J36 ———
// Tablero de corcho: Regine → Diario de un seductor y ¿Culpable? ¿No culpable? (que copia la nota del anillo);
// el diario de 1843 («Si hubiera tenido fe…») → Temor y temblor (1843).
const NOTE = '#F4EDDC';
export const Vida: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VIDA');
  const f = {
    vida: c.at('J35', 'vida'), firma: c.at('J35', 'firma'), reg: c.at('J35', 'Regine'), diario: c.at('J35', 'Diario'), culp: c.at('J35', 'Culpable?'), copia: c.at('J35', 'copia'), nota: c.at('J35', 'nota'),
    p36: c.part('J36'), escr: c.at('J36', 'escribió'), si: c.at('J36', 'Si'), quedado: c.at('J36', 'quedado'), mismo: c.at('J36', 'mismo'), temor: c.at('J36', 'Temor'), recup: c.at('J36', 'recupera'), perder: c.at('J36', 'perder.'),
  };
  const intro = 1 - ramp(frame, f.reg - 18, f.reg - 4);
  const LX = 170, BX = 1250;
  const life = [
    { id: 'reg', t: 'Regine Olsen', sub: 'el compromiso roto, 1841', y: 230, at: f.reg - 6 },
  ];
  const books = [
    { k: 'diario', y: 170, at: f.diario - 6, note: '' },
    { k: 'culpable', y: 440, at: f.culp - 6, note: 'copia palabra por palabra la nota del anillo', noteAt: f.copia },
    { k: 'temor', y: 730, at: f.temor - 6, note: 'recupera lo que estaba dispuesto a perder', noteAt: f.recup },
  ];
  const pinL = (y: number): [number, number] => [LX + 620, y + 40];
  const pinB = (y: number): [number, number] => [BX - 40, y + 60];
  const quote = sp(frame, f.escr - 6, 13, 170);
  return (
    <SkNight lamp={[960, 360]}>
      {intro > 0.01 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: intro, transform: `scale(${1 + 0.06 * (1 - intro)})` }}>
          <MaskTitle text="La vida, dentro de los libros" at={f.vida - 8} size={100} align="center" color="#fff" hi={['vida']} />
          <div style={{ marginTop: 30, fontFamily: font.serif, fontStyle: 'italic', fontSize: 56, color: 'rgba(243,234,216,0.85)', opacity: rampOut(frame, f.firma - 6, f.firma + 10) }}>aunque lleven otra firma</div>
        </AbsoluteFill>
      )}
      {intro < 0.99 && (
        <AbsoluteFill style={{ opacity: 1 - intro }}>
          <div style={{ position: 'absolute', left: 80, top: 60, right: 80, bottom: 60, borderRadius: 20, background: 'radial-gradient(ellipse at 50% 40%, #5B4632 0%, #3E2F22 70%, #2E2219 100%)', boxShadow: 'inset 0 0 0 14px #2A1E15, 0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', inset: 14, borderRadius: 10, backgroundImage: 'radial-gradient(rgba(0,0,0,0.18) 1.2px, transparent 1.6px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)', backgroundSize: '9px 9px, 13px 13px', backgroundPosition: '0 0, 4px 6px' }} />
          </div>
          <div style={{ position: 'absolute', left: 180, top: 110, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Su vida</div>
          <div style={{ position: 'absolute', left: BX + 10, top: 110, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Sus libros</div>
          {life.map((l) => {
            const s = sp(frame, l.at, 13, 200);
            if (frame < l.at - 1) return null;
            return (
              <div key={l.id} style={{ position: 'absolute', left: LX, top: l.y, width: 640, transform: `rotate(-1.5deg) translateY(${(1 - s) * -30}px)`, opacity: s }}>
                <div style={{ background: NOTE, padding: '26px 30px', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 22 }}>
                  <svg width={70} height={70} viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="none" stroke="#C99A45" strokeWidth="11" /></svg>
                  <div>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink }}>{l.t}</div>
                    <div style={{ marginTop: 4, fontFamily: font.serif, fontStyle: 'italic', fontSize: 32, color: color.ink2 }}>{l.sub}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* el diario de 1843 */}
          {frame >= f.escr - 8 && (
            <div style={{ position: 'absolute', left: LX, top: 600, width: 640, transform: `rotate(1.5deg) translateY(${(1 - quote) * -30}px)`, opacity: quote }}>
              <div style={{ position: 'relative', padding: '26px 34px 30px', borderRadius: 4, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
                <PaperBG tone="#F1E8D4" />
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: 'rgba(42,32,24,0.55)', textTransform: 'uppercase' }}>Su diario, 1843</div>
                <div style={{ position: 'relative', marginTop: 10, fontFamily: HANDF, fontSize: 62, lineHeight: 1.1, color: '#2A2018', opacity: rampOut(frame, f.si - 4, f.si + 12) }}>Si hubiera tenido fe,</div>
                <div style={{ position: 'relative', fontFamily: HANDF, fontSize: 62, lineHeight: 1.1, color: KR_DEEP, opacity: rampOut(frame, f.quedado - 6, f.quedado + 10) }}>me habría quedado con Regine.</div>
              </div>
            </div>
          )}
          {books.map((b, i) => {
            const s = sp(frame, b.at, 13, 200);
            if (frame < b.at - 1) return null;
            return (
              <div key={b.k} style={{ position: 'absolute', left: BX, top: b.y, display: 'flex', alignItems: 'center', gap: 26, transform: `translateY(${(1 - s) * -30}px)`, opacity: s }}>
                <FlatCover b={BOOKS[b.k]} w={150} rot={i % 2 ? -3 : 3} dark />
                <div style={{ width: 400 }}>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: '#fff', lineHeight: 1.1, whiteSpace: 'pre-line' }}>{b.k === 'culpable' ? '¿Culpable?\n¿No culpable?' : BOOKS[b.k].title}</div>
                  <div style={{ marginTop: 4, fontFamily: font.sans, fontWeight: 500, fontSize: b.k === 'culpable' ? 22 : 24, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-line' }}>{BOOKS[b.k].year}{b.k === 'culpable' ? '\nen Estadios en el camino de la vida' : ''}</div>
                  {b.note && <div style={{ marginTop: 8, fontFamily: font.serif, fontStyle: 'italic', fontSize: 28, color: '#F3D79A', opacity: rampOut(frame, (b.noteAt ?? 0) - 4, (b.noteAt ?? 0) + 10) }}>{b.note}</div>}
                </div>
              </div>
            );
          })}
          <Thread a={pinL(230)} b={pinB(170)} at={f.diario - 2} dur={20} sag={40} w={5} c={WAX} />
          <Thread a={pinL(230)} b={pinB(440)} at={f.culp - 2} dur={20} sag={50} w={5} c={WAX} />
          <Thread a={[LX + 620, 640]} b={pinB(730)} at={f.temor - 2} dur={22} sag={50} w={5} c={OLDGOLD} />
          {life.map((l) => <Pin key={l.id} x={pinL(l.y)[0]} y={pinL(l.y)[1]} at={l.at + 4} c={WAX} />)}
          {frame >= f.escr && <Pin x={LX + 620} y={640} at={f.escr} c={OLDGOLD} />}
          {books.map((b) => <Pin key={b.k} x={pinB(b.y)[0]} y={pinB(b.y)[1]} at={b.at + 4} c={NEVA} />)}
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_soft" at={f.reg - 14} volume={0.4} />
      <Sfx name="sk_pin" at={f.reg - 2} volume={0.6} />
      {books.map((b, i) => <Sfx key={i} name="sk_pin" at={b.at + 4} volume={0.55} />)}
      <Sfx name="sk_string" at={f.diario} volume={0.5} />
      <Sfx name="sk_string" at={f.culp} volume={0.5} />
      <Sfx name="page_turn" at={f.escr - 6} volume={0.5} />
      <Sfx name="dk_quill" at={f.si} volume={0.5} />
      <Sfx name="sk_string" at={f.temor} volume={0.5} />
      {KR && null}
    </SkNight>
  );
};

// ——— ORDEN · J38 ———
// ¿En orden? NO. Subir sus escalones, de la estética a la fe: Diario de un seductor → Temor y temblor → La enfermedad mortal.
export const Orden: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ORDEN');
  const f = { orden: c.at('J38', 'orden?'), hace: c.at('J38', 'hace'), ayuda: c.at('J38', 'ayuda'), esc: c.at('J38', 'escalones'), est: c.at('J38', 'estética'), fe: c.at('J38', 'fe:'), diario: c.at('J38', 'Diario'), temor: c.at('J38', 'Temor'), enf: c.at('J38', 'enfermedad') };
  const stamp = sp(frame, f.hace - 4, 9, 260);
  const toStairs = ramp(frame, f.ayuda - 8, f.ayuda + 10);
  const show = [ramp(frame, f.esc - 4, f.esc + 12), ramp(frame, f.esc + 2, f.esc + 18), ramp(frame, f.esc + 8, f.esc + 24)];
  const bks = [{ k: 'diario', at: f.diario }, { k: 'temor', at: f.temor }, { k: 'enfermedad', at: f.enf }];
  return (
    <SkStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - toStairs }}>
        <MaskTitle text="¿Hay que leerlo en orden?" at={2} size={104} align="center" />
        {frame >= f.hace - 6 && (
          <div style={{ marginTop: 40, transform: `rotate(-6deg) scale(${1.5 - 0.5 * stamp})`, opacity: Math.min(1, stamp * 1.4), fontFamily: font.sans, fontWeight: 700, fontSize: 130, color: WAX, border: `10px solid ${WAX}`, borderRadius: 18, padding: '0 40px 8px' }}>NO</div>
        )}
      </AbsoluteFill>
      {toStairs > 0.01 && (
        <AbsoluteFill style={{ opacity: toStairs }}>
          <div style={{ position: 'absolute', left: 160, top: 90 }}>
            <Kicker at={f.ayuda} text="Lo que ayuda" />
            <MaskTitle text="Subir sus escalones" at={f.esc - 6} size={96} />
          </div>
          <Staircase show={show} glow={[0, 0, ramp(frame, f.enf, f.enf + 20)]} />
          <div style={{ position: 'absolute', left: 170, top: BASE + 10, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: color.muted, textTransform: 'uppercase', opacity: rampOut(frame, f.est - 4, f.est + 10) }}>la estética</div>
          <div style={{ position: 'absolute', left: STEPS[2].x + STEPS[2].w - 120, top: BASE + 10, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: KR_DEEP, textTransform: 'uppercase', opacity: rampOut(frame, f.fe - 4, f.fe + 10) }}>la fe</div>
          {bks.map((b, i) => {
            const s = sp(frame, b.at - 4, 12, 170);
            if (frame < b.at - 5) return null;
            const st = STEPS[i];
            return (
              <div key={b.k} style={{ position: 'absolute', left: st.x + st.w / 2 - 95, top: BASE - st.h - 282, transform: `translateY(${(1 - s) * -200}px)`, opacity: Math.min(1, s * 1.5) }}>
                <Book3D b={BOOKS[b.k]} w={190} h={285} d={26} ry={-14} rx={2} />
                <div style={{ position: 'absolute', left: -70, top: -60, width: 50, height: 50, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>{i + 1}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      <Sfx name="stamp" at={f.hace} volume={0.8} />
      <Sfx name="whoosh_soft" at={f.ayuda - 8} volume={0.4} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="snap_in" at={f.esc + i * 6} volume={0.4} />)}
      {bks.map((b, i) => <Sfx key={`b${i}`} name="sk_book_thud" at={b.at + 4} volume={0.45} />)}
    </SkStage>
  );
};

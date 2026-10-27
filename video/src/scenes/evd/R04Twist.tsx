import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Count, LockIcon, Pop, RenewIcon, ShotWindow, Strike } from './ui';

// Rejilla del catálogo: 1.500 casillas de 1.000 títulos; 20 (las «ilimitadas») en amarillo.
const COLS = 50;
const ROWS = 30;
const CELL = 16;
const GAP = 4;
const pickCells = (seed: string) => {
  const set = new Set<number>();
  let i = 0;
  while (set.size < 20) set.add(Math.floor(random(`${seed}-${i++}`) * COLS * ROWS));
  return [...set];
};
const SET_A = pickCells('a');
const SET_B = pickCells('b');

const Grid: React.FC<{ fYellow: number; fRotate: number; fFill: number }> = ({ fYellow, fRotate, fFill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hop = spring({ frame: frame - fRotate, fps, config: { damping: 16, stiffness: 120 } });
  const pos = (k: number) => [(k % COLS) * (CELL + GAP), Math.floor(k / COLS) * (CELL + GAP)];
  return (
    <div style={{ position: 'relative', width: COLS * (CELL + GAP) - GAP, height: ROWS * (CELL + GAP) - GAP }}>
      {Array.from({ length: COLS * ROWS }, (_, k) => {
        const [x, y] = pos(k);
        // Barrido diagonal al rellenar el millón y medio.
        const d = ((k % COLS) + Math.floor(k / COLS)) / (COLS + ROWS);
        const o = interpolate(frame, [fFill + d * 26, fFill + d * 26 + 8], [0, 1], clamp);
        return o > 0 ? <div key={k} style={{ position: 'absolute', left: x, top: y, width: CELL, height: CELL, borderRadius: 4, background: '#D9D9DC', opacity: o, transform: `scale(${0.5 + 0.5 * o})` }} /> : null;
      })}
      {SET_A.map((a, i) => {
        const [x0, y0] = pos(a);
        const [x1, y1] = pos(SET_B[i]);
        const s = spring({ frame: frame - fYellow - i * 1.2, fps, config: { damping: 12, stiffness: 200 } });
        const lift = Math.sin(Math.min(1, hop) * Math.PI) * 26;
        return <div key={i} style={{ position: 'absolute', left: x0 + (x1 - x0) * hop, top: y0 + (y1 - y0) * hop - lift, width: CELL, height: CELL, borderRadius: 4, background: color.yellow, boxShadow: '0 0 0 3px rgba(255,202,5,0.35), 0 4px 10px rgba(180,140,0,0.4)', transform: `scale(${s * 1.25})`, zIndex: 2 }} />;
      })}
    </div>
  );
};

// R04 · Octubre de 2024: se acaba el ilimitado. Desbloqueos (1/3/5) → «la mayoría» los necesita → 20.000 de 1,5 millones → 6 meses → alquiler, no compra.
export const R04Twist: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R04', w, n, fb);
  const fOct = at('octubre', 0, 0.16);
  const fAcabo = at('acabo', 0, 2.0);
  const fAhora = at('Ahora', 0, 3.6);
  const fDesb = at('desbloqueos', 0, 4.72);
  const fStd = at('Standard', 0, 6.24);
  const fPlus = at('Plus', 0, 8.84);
  const fDeluxe = at('Deluxe', 0, 10.12);
  const fQue = at('Que', 0, 11.65);
  const fMayoria = at('mayoria', 0, 15.44);
  const fSin = at('Sin', 0, 16.48);
  const fVeinte = at('veinte', 0, 17.96);
  const fRotando = at('rotando', 0, 19.44);
  const fMillon = at('millon', 0, 20.68);
  const fLos = at('Los', 0, 21.76);
  const fSeis = at('seis', 0, 23.44);
  const fPero = at('pero', 0, 24.59);
  const fCancelas = at('cancelas', 0, 25.04);
  const fPierdes = at('pierdes', 0, 25.65);
  const fAlquiler = at('alquiler', 0, 27.44);
  const fCompra = at('compra', 0, 28.76);

  // Fases (los instantes dentro de cada Phase van relativos a su inicio).
  const pA = 0;
  const pB = fAhora - 4;
  const pC = fStd - 16;
  const pD = fQue - 6;
  const pE = fSin - 4;
  const pF = fLos - 4;
  const pG = fPero - 4;

  const stamp = spring({ frame: frame - fAcabo, fps, config: { damping: 11, stiffness: 220 } });
  const unlock = interpolate(frame, [fDesb, fDesb + 10], [0, 1], { ...clamp, easing: easeOut });
  const locked = interpolate(frame, [fPierdes, fPierdes + 14], [0, 1], { ...clamp, easing: easeOut });
  const lockPop = spring({ frame: frame - fPierdes, fps, config: { damping: 11, stiffness: 200 } });
  const press = interpolate(frame, [fCancelas - 4, fCancelas, fCancelas + 6], [0, 1, 0], clamp);
  return (
    <Stage tone="light">
      {/* A · Se acabó el ilimitado */}
      <Phase from={pA} to={pB}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90 }}>
          <Pop at={fOct - 4}>
            <div style={{ width: 300, borderRadius: 32, overflow: 'hidden', background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, textAlign: 'center', fontFamily: font.sans }}>
              <div style={{ background: color.red, color: '#fff', fontWeight: 700, fontSize: 46, padding: '14px 0', letterSpacing: 4 }}>OCT</div>
              <div style={{ fontWeight: 700, fontSize: 150, lineHeight: 1.1, padding: '10px 0 0' }}>30</div>
              <div style={{ fontWeight: 500, fontSize: 48, color: color.ink2, paddingBottom: 26 }}>2024</div>
            </div>
          </Pop>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Pop at={fOct + 6}>
              <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 160, letterSpacing: -4, color: interpolate(frame, [fAcabo, fAcabo + 8], [0, 1], clamp) > 0.5 ? '#B8B8BC' : color.ink }}>
                ILIMITADO
                <Strike at={fAcabo + 2} thick={18} rotate={-4} />
              </div>
            </Pop>
            {frame >= fAcabo - 2 && (
              <div style={{ position: 'absolute', right: -40, top: -70, transform: `rotate(-10deg) scale(${2 - stamp})`, opacity: Math.min(1, stamp * 2), padding: '10px 30px', border: `8px solid ${color.red}`, borderRadius: 18, color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: 3, background: 'rgba(255,255,255,0.9)' }}>SE ACABÓ</div>
            )}
          </div>
        </AbsoluteFill>
      </Phase>

      {/* B · Ahora: desbloqueos */}
      <Phase from={pB} to={pC}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 }}>
          <Words text="Ahora funciona con" start={2} size={64} weight={500} color={color.ink2} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ width: 170, height: 170, borderRadius: 44, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(255,202,5,0.45)', transform: `rotate(${Math.sin(unlock * Math.PI) * -10}deg)` }}>
              <LockIcon size={110} open={unlock} />
            </div>
            <Words text="desbloqueos" start={fDesb - pB - 6} size={160} weight={700} />
          </div>
          <Pop at={fDesb - pB + 14}><div style={{ fontFamily: font.sans, fontSize: 48, fontWeight: 500, color: color.ink2 }}>1 desbloqueo = 1 libro</div></Pop>
        </AbsoluteFill>
      </Phase>

      {/* C · Los planes reales: 1, 3 y 5 desbloqueos */}
      <Phase from={pC} to={pD}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/plans.jpg" width={1560} url="es.everand.com/checkout/available-plans"
            camera={[
              { f: 0, zoom: 1.3, x: 960, y: 500 },
              { f: fStd - pC, zoom: 1.5, x: 640, y: 470 },
              { f: fPlus - pC, zoom: 1.5, x: 960, y: 470 },
              { f: fDeluxe - pC, zoom: 1.5, x: 1290, y: 470 },
              { f: pD - pC + 10, zoom: 1.42, x: 1270, y: 470 },
            ]}
            marks={[
              { from: fStd - pC - 2, to: fPlus - pC - 4, x: 494, y: 418, w: 200, h: 46, label: '1 libro al mes' },
              { from: fPlus - pC - 2, to: fDeluxe - pC - 4, x: 836, y: 418, w: 216, h: 46, label: '3 libros al mes' },
              { from: fDeluxe - pC - 2, to: pD - pC + 6, x: 1178, y: 418, w: 216, h: 46, label: '5 libros al mes' },
            ]} />
        </AbsoluteFill>
      </Phase>

      {/* D · «¿Qué libros requieren un desbloqueo?» → «La mayoría.» (centro de ayuda oficial) */}
      <Phase from={pD} to={pE}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/help_mayoria.jpg" width={1560} url="support.scribd.com · Centro de ayuda de Everand"
            camera={[
              { f: 0, zoom: 1.3, x: 1100, y: 300 },
              { f: fMayoria - pD - 20, zoom: 1.45, x: 1080, y: 320 },
              { f: fMayoria - pD + 6, zoom: 2.0, x: 1000, y: 330 },
              { f: pE - pD + 10, zoom: 2.06, x: 1000, y: 332 },
            ]}
            marks={[
              { from: 6, to: fMayoria - pD - 10, x: 788, y: 184, w: 612, h: 56, label: 'La pregunta' },
              { from: fMayoria - pD - 6, to: pE - pD + 6, x: 790, y: 334, w: 89, h: 34, r: 8, label: 'Respuesta oficial' },
            ]} />
        </AbsoluteFill>
      </Phase>

      {/* E · 20.000 «ilimitados» que rotan, de 1,5 millones */}
      <Phase from={pE} to={pF}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90 }}>
          <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 40, fontFamily: font.sans }}>
            <Pop at={4}><div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 38, letterSpacing: 6, color: color.muted, fontWeight: 500 }}><LockIcon size={44} c={color.muted} open={1} /> SIN DESBLOQUEAR</div></Pop>
            <Pop at={fVeinte - pE - 4}>
              <div style={{ fontWeight: 700, fontSize: 130, lineHeight: 1, letterSpacing: -4 }}><Count to={20000} at={fVeinte - pE} dur={22} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, fontSize: 40, fontWeight: 500, color: color.ink2 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: color.yellow, display: 'inline-block' }} /> títulos que van rotando
                <RenewIcon size={46} spin={interpolate(frame, [fRotando, fRotando + 30], [0, 360], { ...clamp, easing: easeInOut })} />
              </div>
            </Pop>
            <Pop at={fMillon - pE - 4}>
              <div style={{ fontWeight: 700, fontSize: 80, lineHeight: 1, color: color.muted }}>de <Count to={1500000} at={fMillon - pE} dur={26} from={20000} /></div>
              <div style={{ marginTop: 18, display: 'inline-block', background: color.ink, color: '#fff', borderRadius: 999, padding: '10px 28px', fontSize: 40, fontWeight: 700 }}>Solo el 1,3 %</div>
            </Pop>
          </div>
          <Grid fYellow={fVeinte - pE} fRotate={fRotando - pE} fFill={fMillon - pE} />
        </AbsoluteFill>
      </Phase>

      {/* F · Los desbloqueos se guardan hasta 6 meses (FAQ de everand.com) */}
      <Phase from={pF} to={pG}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/home_faq.jpg" width={1560} url="es.everand.com"
            camera={[
              { f: 0, zoom: 1.55, x: 900, y: 690 },
              { f: pG - pF + 10, zoom: 1.75, x: 860, y: 740 },
            ]}
            marks={[{ from: fSeis - pF - 22, to: pG - pF + 6, x: 574, y: 756, w: 436, h: 32, r: 8, label: 'Hasta 6 meses' }]} />
        </AbsoluteFill>
      </Phase>

      {/* G · Si cancelas, pierdes los libros: alquiler, no compra */}
      <Phase from={pG} to={dur} out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 100 }}>
          <div style={{ position: 'relative', width: 560, height: 595, borderRadius: 32, overflow: 'hidden', boxShadow: shadow.card }}>
            <Img src={staticFile('evd/img/hero_collage.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: `grayscale(${locked}) brightness(${1 - 0.45 * locked})` }} />
            <div style={{ position: 'absolute', left: 24, top: 24, background: 'rgba(255,255,255,0.94)', borderRadius: 999, padding: '10px 24px', fontFamily: font.sans, fontWeight: 700, fontSize: 32 }}>Tu biblioteca</div>
            {frame >= fPierdes && (
              <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 200, height: 200, borderRadius: 52, background: color.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lockPop}) rotate(${(1 - lockPop) * -20}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}>
                  <LockIcon size={120} c="#fff" open={1 - locked} />
                </div>
              </AbsoluteFill>
            )}
          </div>
          <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 40, fontFamily: font.sans }}>
            <Pop at={6}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '22px 40px', borderRadius: 999, border: `3px solid ${color.red}`, color: color.red, fontSize: 44, fontWeight: 700, background: press > 0 ? '#FFF1F1' : '#fff', transform: `scale(${1 - 0.06 * press})`, boxShadow: shadow.soft }}>
                Cancelar suscripción
              </div>
            </Pop>
            <Pop at={fPierdes - pG}><div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Pierdes los libros</div></Pop>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Pop at={fAlquiler - pG - 4}><div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.05 }}>Es un <span style={{ background: color.yellow, padding: '0 14px', borderRadius: 12 }}>alquiler</span>,</div></Pop>
              <Pop at={fCompra - pG - 22}>
                <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.05, color: color.muted, display: 'flex', gap: 22 }}>
                  no una <span style={{ position: 'relative' }}>compra<Strike at={fCompra - pG + 4} thick={12} rotate={-5} /></span>
                </div>
              </Pop>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_soft" at={fOct - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fOct + 6} />
      <Sfx name="pencil_strike" at={fAcabo + 2} />
      <Sfx name="stamp" at={fAcabo + 4} />
      <Sfx name="swipe" at={pB} />
      <Sfx name="click" at={fDesb} />
      <Sfx name="pop" at={fDesb + 14} />
      <Sfx name="whoosh_deep" at={pC} volume={0.7} />
      <Sfx name="focus" at={fStd - 2} />
      <Sfx name="tick_soft" at={fPlus - 2} />
      <Sfx name="tick_soft" at={fDeluxe - 2} />
      <Sfx name="swipe" at={pD} />
      <Sfx name="focus" at={pD + 6} volume={0.8} />
      <Sfx name="zoom_in" at={fMayoria - 6} />
      <Sfx name="marker" at={fMayoria - 2} />
      <Sfx name="swipe" at={pE} />
      <Sfx name="counter" at={fVeinte} />
      <Sfx name="sparkle" at={fVeinte + 4} volume={0.6} />
      <Sfx name="whoosh_fast" at={fRotando} volume={0.7} />
      <Sfx name="page_riffle" at={fMillon} />
      <Sfx name="counter" at={fMillon + 2} volume={0.8} />
      <Sfx name="swipe" at={pF} />
      <Sfx name="focus" at={fSeis - 22} volume={0.8} />
      <Sfx name="swipe" at={pG} />
      <Sfx name="click" at={fCancelas} />
      <Sfx name="hit_soft" at={fPierdes} />
      <Sfx name="stamp" at={fPierdes + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fAlquiler - 4} />
      <Sfx name="cross" at={fCompra + 4} />
    </Stage>
  );
};

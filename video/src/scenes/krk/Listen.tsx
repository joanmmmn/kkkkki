import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { BrowserWindow } from '../../components/BrowserWindow';
import { LogoIcon } from '../../components/Logo';
import { MaskTitle, LinkBadge } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Cover, color, font, KR, MiniIcon, NEVA, OLDGOLD, ramp, rampOut, shadow, SkStage } from './kit';
import { sceneClock } from './timeline';

// ————————————————————————————————————————————————————————————————
// 07 · Qué versión escuchar (J39–J42) y la ficha de SonorBooks (J43).
// Capturas de sonorbooks.com (19/10/2026, 1600×900 a 2×, aviso de cookies oculto, sin iniciar sesión): la ficha de
// Diario de un seductor (cerrada y con la lista de narraciones abierta) y la de La pureza de corazón (voz digital).
// La portada de la edición está tapada en el PNG y en el vídeo va nuestra cubierta dibujada.
// ————————————————————————————————————————————————————————————————

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Cubierta propia sobre el hueco de la portada real (cuadrada, como las de audiolibro).
const SquareCover: React.FC<{ size: number; k?: string }> = ({ size, k = 'diario' }) => {
  const b = BOOKS[k];
  const w = size * 0.62;
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: size * 0.022, overflow: 'hidden', background: `radial-gradient(ellipse at 50% 40%, #7A3040 0%, ${b.bg} 70%)` }}>
      <div style={{ position: 'absolute', left: (size - w) / 2, top: (size - w * 1.5) / 2, width: w, height: w * 1.5, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', borderRadius: 4, overflow: 'hidden' }}>
        <Cover b={b} w={w} h={w * 1.5} />
      </div>
    </div>
  );
};

// Recortes de las fichas (coordenadas de página 1600×900)
const LIST = { x: 856, y: 405, w: 583, h: 334 };
const REC = { x: 790, y: 410, w: 650, h: 366 };
const PLAT = { x: 800, y: 790, w: 320, h: 70 };
const COVER = { x: 160, y: 203, s: 550 };
const DIG = { x: 782, y: 374, w: 330, h: 58 };

// ——— VERSION · J39–J42 ———
// Duraciones (h) de las grabaciones de Diario de un seductor en SonorBooks (19/10/2026), sin repetidas: la adaptación con
// varias voces (3 h 18 min) y las cuatro del texto completo (Oscar Chamorro, Raúl Gutiérrez, Remigia de la Rosa, Geraldo Medina).
const DIA = [{ h: 3.3, n: 'Adelaida Espinosa, Santiago Munevar y más' }, { h: 5.52, n: 'Oscar Chamorro' }, { h: 5.98, n: 'Raúl Gutiérrez' }, { h: 6.02, n: 'Remigia de la Rosa' }, { h: 6.98, n: 'Geraldo Medina' }];
const LEVEL = [0, 0, 0, 1, 0];

export const Version: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VERSION');
  const fCinco = c.at('J39', 'cinco');
  const fMira = c.at('J39', 'Mira');
  const p40 = c.part('J40');
  const fTres = c.at('J40', 'tres');
  const fAdap = c.at('J40', 'adaptación');
  const fComp = c.at('J40', 'completo');
  const p41 = c.part('J41');
  const fSint = c.at('J41', 'sintéticas');
  const fEtiq = c.at('J41', 'etiqueta');
  const p42 = c.part('J42');
  const fFilo = c.at('J42', 'filosofía');
  const fMin = c.at('J42', 'minuto');
  const listIn = ramp(frame, fMira - 10, fMira + 8);
  const active = frame < p40 - 6 ? -1 : frame < p41 - 6 ? 0 : frame < p42 - 6 ? 1 : 2;
  const items = [
    { t: 'Que sea íntegra', sub: 'no una adaptación', at: fMira + 4 },
    { t: '¿Voz humana o digital?', sub: 'fíjate en la etiqueta', at: fMira + 10 },
    { t: 'La muestra', sub: 'un minuto antes de empezar', at: fMira + 16 },
  ];
  const panel = (i: number) => {
    const starts = [p40, p41, p42];
    const ends = [p41, p42, 1e9];
    return ramp(frame, starts[i] - 10, starts[i] + 8) * (1 - ramp(frame, ends[i] - 12, ends[i] + 2));
  };
  const AX = { x: 880, y: 720, w: 900 };
  const hx = (h: number) => AX.x + (h / 8) * AX.w;
  const adapt = ramp(frame, fTres - 4, fAdap + 10);
  const full = ramp(frame, fComp - 6, fComp + 14);
  const digBox = ramp(frame, fEtiq - 4, fEtiq + 10);
  const sec = Math.min(60, Math.floor(ramp(frame, fMin - 6, fMin + 60, (t) => t) * 60));
  return (
    <SkStage>
      {/* título */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380 - 270 * listIn, textAlign: listIn > 0.5 ? 'left' : 'center', paddingLeft: listIn > 0.5 ? 140 : 0, opacity: listIn > 0.45 && listIn < 0.55 ? 0 : 1 }}>
        {listIn <= 0.5 ? (
          <div>
            <MaskTitle text="¿Qué versión escuchar?" at={2} size={110} align="center" hi={['versión']} />
            <div style={{ marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: rampOut(frame, fCinco - 8, fCinco + 8) }}><i style={{ fontFamily: font.serif, fontWeight: 500 }}>Diario de un seductor</i>: <span style={{ color: KR }}>cinco grabaciones en español</span></div>
          </div>
        ) : (
          <div>
            <Kicker at={fMira - 6} text="Antes de darle a reproducir" />
            <MaskTitle text="Mira tres cosas" at={fMira - 4} size={80} hi={['tres']} />
          </div>
        )}
      </div>
      {/* lista de comprobación */}
      {listIn > 0.01 && (
        <div style={{ position: 'absolute', left: 140, top: 390, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {items.map((it, i) => {
            const s = sp(frame, it.at, 15, 180);
            const on = active === i;
            const done = active > i;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, width: 600, padding: '22px 28px', borderRadius: 24, background: on ? color.ink : '#fff', boxShadow: on ? '0 24px 50px rgba(16,16,16,0.25)' : shadow.soft,
                border: on ? 'none' : `1px solid ${color.line}`, opacity: s * (active >= 0 && !on ? 0.72 : 1), transform: `translateX(${(1 - s) * -40}px) scale(${on ? 1.03 : 1})` }}>
                <div style={{ width: 66, height: 66, borderRadius: '50%', background: done ? '#2E9E5B' : on ? color.yellow : '#F1EFEA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, flexShrink: 0 }}>
                  {done ? <svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
                </div>
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: on ? '#fff' : color.ink }}>{it.t}</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: on ? 'rgba(255,255,255,0.7)' : color.muted, marginTop: 2 }}>{it.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* 1 · íntegra: las duraciones de Diario de un seductor */}
      {panel(0) > 0.01 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: panel(0) }}>
          <div style={{ position: 'absolute', left: 880, top: 220 }}>
            <Kicker at={p40} text="Diario de un seductor · grabaciones en español" />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>Duración de cada una</div>
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={AX.x} y1={AX.y} x2={AX.x + AX.w} y2={AX.y} stroke="rgba(16,16,16,0.25)" strokeWidth="3" />
            {[0, 2, 4, 6, 8].map((h) => <g key={h}><line x1={hx(h)} y1={AX.y - 8} x2={hx(h)} y2={AX.y + 8} stroke="rgba(16,16,16,0.3)" strokeWidth="2" /><text x={hx(h)} y={AX.y + 46} textAnchor="middle" fontFamily="Ubuntu" fontWeight="700" fontSize="26" fill="#6B6B6B">{h} h</text></g>)}
            <g opacity={adapt}><rect x={hx(2.8) - 10} y={AX.y - 200} width={hx(3.8) - hx(2.8) + 20} height={170} rx={14} fill="rgba(16,16,16,0.05)" /></g>
            <g opacity={full}><rect x={hx(5.3) - 10} y={AX.y - 200} width={hx(7.2) - hx(5.3) + 20} height={170} rx={14} fill="rgba(47,111,98,0.10)" /></g>
            {DIA.map((d, i) => {
              const isA = d.h < 4;
              const s = sp(frame, p40 + 4 + i * 4, 12, 200);
              const hl = isA ? adapt : full;
              const fill = isA ? `rgba(120,116,108,${0.55 + 0.45 * hl})` : hl > 0.5 ? KR : 'rgba(16,16,16,0.4)';
              return <circle key={i} cx={hx(d.h)} cy={AX.y - 60 - LEVEL[i] * 50} r={20 * s} fill={fill} stroke="#fff" strokeWidth="5" />;
            })}
          </svg>
          <div style={{ position: 'absolute', left: hx(2.8) - 10, top: AX.y - 300, opacity: adapt, transform: `translateY(${(1 - adapt) * 14}px)`, whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink2 }}>3 h 18 min</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.muted }}>adaptación, con varias voces</div>
          </div>
          <div style={{ position: 'absolute', left: hx(5.3) - 10, top: AX.y - 300, opacity: full, transform: `translateY(${(1 - full) * 14}px)`, whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: KR }}>De 5 h 30 min a 7 h</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.muted }}>el texto completo</div>
          </div>
          <div style={{ position: 'absolute', left: 880, top: 800, width: 900, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, opacity: rampOut(frame, p40 + 20, p40 + 34) }}>Cada punto, una grabación distinta en SonorBooks (19/10/2026).</div>
        </div>
      )}
      {/* 2 · voz humana o digital: la etiqueta en la ficha de La pureza de corazón */}
      {panel(1) > 0.01 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: panel(1) }}>
          <div style={{ position: 'absolute', left: 880, top: 250 }}>
            <Kicker at={p41} text="La pureza de corazón · ficha de SonorBooks" />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, opacity: rampOut(frame, fSint - 6, fSint + 8) }}>Las voces sintéticas, marcadas</div>
          </div>
          <div style={{ position: 'absolute', left: 880, top: 430, width: DIG.w * 2.7 + 60, height: DIG.h * 2.7 + 60, borderRadius: 26, overflow: 'hidden', boxShadow: shadow.card, background: '#fff', padding: 30, opacity: rampOut(frame, p41 - 4, p41 + 12), transform: `translateY(${(1 - rampOut(frame, p41 - 4, p41 + 12)) * 30}px)` }}>
            <div style={{ position: 'relative', width: DIG.w * 2.7, height: DIG.h * 2.7, overflow: 'hidden' }}>
              <Img src={staticFile('krk/web/ficha_p.png')} style={{ position: 'absolute', left: -DIG.x * 2.7, top: -DIG.y * 2.7, width: 1600 * 2.7 }} />
              <div style={{ position: 'absolute', left: 0, top: (408 - DIG.y) * 2.7, width: 82 * 2.7, height: 22 * 2.7, border: `6px solid ${color.yellow}`, borderRadius: 12, opacity: digBox, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1200, top: 660, opacity: digBox, transform: `scale(${0.8 + 0.2 * digBox}) rotate(-2deg)` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, background: color.yellow, padding: '8px 24px', borderRadius: 999, boxShadow: shadow.float, whiteSpace: 'nowrap' }}>la etiqueta «Voz digital»</div>
          </div>
        </div>
      )}
      {/* 3 · la muestra */}
      {panel(2) > 0.01 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: panel(2) }}>
          <div style={{ position: 'absolute', left: 880, top: 330, display: 'flex', alignItems: 'center', gap: 28, padding: '26px 44px 26px 26px', background: '#fff', borderRadius: 999, boxShadow: shadow.card }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.06 * Math.sin(frame / 5)})` }}>
              <svg width="42" height="42" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill={color.ink} /></svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 60 }}>
              {Array.from({ length: 26 }).map((_, i) => <div key={i} style={{ width: 7, borderRadius: 4, background: NEVA, height: 12 + 44 * Math.abs(Math.sin(i * 0.7 + frame / 5) * Math.sin(i * 0.23 + frame / 11)) }} />)}
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, fontVariantNumeric: 'tabular-nums', minWidth: 120 }}>{sec >= 60 ? '1:00' : `0:${String(sec).padStart(2, '0')}`}</div>
          </div>
          <div style={{ position: 'absolute', left: 880, top: 560, width: 900, fontFamily: font.serif, fontStyle: 'italic', fontSize: 52, lineHeight: 1.2, color: color.ink2, opacity: rampOut(frame, fFilo - 6, fFilo + 10) }}>En filosofía, una voz que no te convence se hace muy larga.</div>
        </div>
      )}
      <Sfx name="ui_pop" at={4} volume={0.5} />
      <Sfx name="whoosh_soft" at={fMira - 12} volume={0.5} />
      {items.map((it, i) => <Sfx key={i} name="ui_pop" at={it.at + 1} volume={0.45} />)}
      {[p40, p41, p42].map((p, i) => <Sfx key={`a${i}`} name="focus" at={p - 4} volume={0.55} />)}
      {DIA.map((_, i) => <Sfx key={`d${i}`} name="tick_soft" at={Math.round(p40 + 4 + i * 4)} volume={0.35} />)}
      <Sfx name="hit_soft" at={fComp} volume={0.5} />
      <Sfx name="focus" at={fEtiq} volume={0.6} />
      <Sfx name="ui_tap" at={fMin - 6} volume={0.5} />
      <Sfx name="sk_clock" at={fMin} volume={0.3} dur={60} fade={10} />
    </SkStage>
  );
};

// ——— WEB · J43 · La ficha de SonorBooks: todas las versiones, narrador, duración y dónde escucharla ———
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('WEB');
  const fTodas = c.at('J43', 'todas');
  const fNarr = c.at('J43', 'narrador,');
  const fDur = c.at('J43', 'duración');
  const fDonde = c.at('J43', 'dónde');
  const fDesc = c.at('J43', 'descripción.');
  const W = 1400;
  const k = W / 1600;
  const toList = ramp(frame, fTodas - 10, fTodas + 2) * (1 - ramp(frame, fDonde - 10, fDonde + 2));
  const focus = (x: number, y: number, s: number) => ({ s, x: -(x * k - W / 2) * s, y: -(y * k - (W * 9) / 32) * s });
  const zl = focus(LIST.x + LIST.w / 2, LIST.y + 170, 1.55);
  const zr = focus(REC.x + REC.w / 2, REC.y + 200, 1.35);
  const cam = [
    { f: 0, s: 0.96, x: 0, y: 30 },
    { f: fTodas - 6, s: 1, x: 0, y: 0 },
    { f: fNarr - 4, ...zl },
    { f: fDonde - 10, ...zl },
    { f: fDonde + 10, ...zr },
    { f: fDesc - 14, ...zr },
    { f: fDesc + 16, s: 0.86, x: 0, y: -40 },
  ];
  const kk = (p: string) => keyframes(frame, cam, p, easeInOut);
  const box = (r: { x: number; y: number; w: number; h: number }, a: number, b: number) => {
    const p = interpolate(frame, [a, a + 10, b - 8, b], [0, 1, 1, 0], clamp);
    if (p <= 0) return null;
    return <div style={{ position: 'absolute', left: r.x * k - 10, top: r.y * k - 10, width: r.w * k + 20, height: r.h * k + 20, borderRadius: 14, border: `${5 / kk('s')}px solid ${color.yellow}`, boxShadow: `0 0 0 4000px rgba(16,16,16,${0.3 * p})`, opacity: p, transform: `scale(${1.06 - 0.06 * p})` }} />;
  };
  return (
    <SkStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `translate(${kk('x')}px, ${kk('y')}px) scale(${kk('s')})`, opacity: sp(frame, 0, 18, 140) }}>
          <BrowserWindow width={W} url="sonorbooks.com/es/audiolibro/diario-de-un-seductor">
            <Img src={staticFile('krk/web/ficha_a.png')} style={{ position: 'absolute', left: 0, top: 0, width: W }} />
            <Img src={staticFile('krk/web/ficha_b.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: toList }} />
            <div style={{ position: 'absolute', left: COVER.x * k, top: COVER.y * k }}><SquareCover size={COVER.s * k} /></div>
            {box(LIST, fTodas, fDonde - 6)}
            {/* resaltado de nombres (narrador) y de duraciones */}
            {[432, 533, 610, 688].map((y, i) => {
              const p = interpolate(frame, [fNarr - 4 + i * 2, fNarr + 6 + i * 2, fDur - 6, fDur], [0, 1, 1, 0], clamp);
              return p > 0 ? <div key={`n${i}`} style={{ position: 'absolute', left: 866 * k, top: (y - 13) * k, width: 200 * k, height: 26 * k, borderRadius: 6, background: `rgba(255,202,5,${0.45 * p})`, mixBlendMode: 'multiply' }} /> : null;
            })}
            {[457, 558, 635, 713].map((y, i) => {
              const p = interpolate(frame, [fDur - 2 + i * 2, fDur + 8 + i * 2, fDonde - 10, fDonde], [0, 1, 1, 0], clamp);
              return p > 0 ? <div key={`d${i}`} style={{ position: 'absolute', left: 866 * k, top: (y - 11) * k, width: 130 * k, height: 22 * k, borderRadius: 6, background: `rgba(255,202,5,${0.55 * p})`, mixBlendMode: 'multiply' }} /> : null;
            })}
            {box(REC, fDonde, fDesc + 6)}
            {box(PLAT, fDonde + 30, fDesc + 6)}
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 20px', background: '#fff', borderRadius: 999, boxShadow: shadow.float, opacity: rampOut(frame, fDesc - 6, fDesc + 6), fontFamily: font.sans, fontWeight: 700, fontSize: 36 }}>
          <LogoIcon size={46} /> sonorbooks.com
        </div>
        <LinkBadge at={fDesc} size={36} />
      </div>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="ui_tap" at={fTodas - 8} volume={0.6} />
      <Sfx name="zoom_in" at={fNarr - 6} volume={0.5} />
      <Sfx name="focus" at={fNarr} volume={0.55} />
      <Sfx name="focus" at={fDur} volume={0.5} />
      <Sfx name="focus" at={fDonde + 8} volume={0.55} />
      <Sfx name="zoom_out" at={fDesc + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fDesc + 2} volume={0.7} />
    </SkStage>
  );
};

export const _ls = { easeOut, random, OLDGOLD };

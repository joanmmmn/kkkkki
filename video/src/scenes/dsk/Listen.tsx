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
// 07 · Qué versión escuchar (D42–D45) y la ficha de SonorBooks (D46).
// Capturas de sonorbooks.com (15/10/2026, 1600×900, aviso de cookies oculto, sin iniciar sesión). La portada de la
// edición está tapada en el PNG y en el vídeo va nuestra cubierta dibujada.
// ————————————————————————————————————————————————————————————————

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Cubierta propia sobre el hueco de la portada real (cuadrada, como las de audiolibro).
const SquareCover: React.FC<{ size: number }> = ({ size }) => {
  const b = BOOKS.crimen;
  const w = size * 0.62;
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: size * 0.022, overflow: 'hidden', background: `radial-gradient(ellipse at 50% 40%, #7A2430 0%, ${b.bg} 70%)` }}>
      <div style={{ position: 'absolute', left: (size - w) / 2, top: (size - w * 1.5) / 2, width: w, height: w * 1.5, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', borderRadius: 4, overflow: 'hidden' }}>
        <Cover b={b} w={w} h={w * 1.5} />
      </div>
    </div>
  );
};

// Recortes de la ficha (coordenadas de página 1600×900)
const LIST = { x: 856, y: 418, w: 584, h: 476 };
const DIG_ROW = { x: 856, y: 574, w: 584, h: 77 };
const REC = { x: 790, y: 424, w: 650, h: 368 };
const PLAT = { x: 800, y: 822, w: 630, h: 56 };
const COVER = { x: 160, y: 215, s: 550 };

// ——— VERSION · D42–D45 ———
const Narrator: React.FC<{ at: number; name: string; country: string; books: string; initials: string; dim?: number; accent?: string }> = ({ at, name, country, books, initials, dim = 0, accent = KR }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 15, 170);
  if (frame < at - 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 34px 20px 20px', background: '#fff', borderRadius: 26, boxShadow: shadow.card, border: `1px solid ${color.line}`, width: 900,
      opacity: s * (1 - 0.45 * dim), transform: `translateY(${(1 - s) * 40}px) scale(${0.94 + 0.06 * s})` }}>
      <div style={{ width: 92, height: 92, borderRadius: '50%', background: color.ink, color: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 36, flexShrink: 0 }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>{name}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink2, marginTop: 4 }}>{books}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: accent }}><MiniIcon kind="pin" size={32} c={accent} />{country}</div>
    </div>
  );
};

// Duraciones (h) de las grabaciones de Crimen y castigo en la ficha (15/10/2026), sin repetidas.
const CYC = [1.37, 2.19, 2.8, 5.13, 12.03, 19.0, 19.5, 20.8, 20.84, 21.23, 22.42, 23.72, 24.33, 24.71, 24.8, 25.23, 25.59, 25.66, 25.79, 26.63, 27.35, 27.92];
// enjambre: cada punto en la fila más baja libre (36 px = 1,2 h en la escala de 900 px para 30 h)
const LEVEL = (() => {
  const rows: number[][] = [];
  return CYC.map((h) => {
    let l = 0;
    while (rows[l] && rows[l].some((q) => Math.abs(q - h) < 1.2)) l++;
    (rows[l] = rows[l] || []).push(h);
    return l;
  });
})();

export const Version: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VERSION');
  const fDec = c.at('D42', 'decenas');
  const fMira = c.at('D42', 'Mira');
  const p43 = c.part('D43');
  const fUnaA = c.at('D43', 'una');
  const fAdap = c.at('D43', 'adaptaciones');
  const fEntera = c.at('D43', 'entera');
  const p44 = c.part('D44');
  const fSint = c.at('D44', 'sintéticas');
  const fMuestra = c.at('D44', 'Escucha');
  const fEtiq = c.at('D44', 'etiqueta');
  const p45 = c.part('D45');
  const fJordi = c.at('D45', 'Jordi');
  const fTxema = c.at('D45', 'Txema');
  const fGerman = c.at('D45', 'Germán');
  const fEsp = c.at('D45', 'España.');
  const fOmar = c.at('D45', 'Omar');
  const fCol = c.at('D45', 'Colombia.');
  const listIn = ramp(frame, fMira - 10, fMira + 8);
  const active = frame < p43 - 6 ? -1 : frame < p44 - 6 ? 0 : frame < p45 - 6 ? 1 : 2;
  const items = [
    { t: 'Que sea íntegra', sub: 'no una adaptación', at: fMira + 4 },
    { t: '¿Voz humana o digital?', sub: 'escucha la muestra', at: fMira + 10 },
    { t: 'El acento', sub: 'España o Latinoamérica', at: fMira + 16 },
  ];
  const panel = (i: number) => {
    const starts = [p43, p44, p45];
    const ends = [p44, p45, 1e9];
    return ramp(frame, starts[i] - 10, starts[i] + 8) * (1 - ramp(frame, ends[i] - 12, ends[i] + 2));
  };
  // gráfica de puntos 0–30 h
  const AX = { x: 880, y: 720, w: 900 };
  const hx = (h: number) => AX.x + (h / 30) * AX.w;
  const adapt = ramp(frame, fUnaA - 4, fAdap + 10);
  const full = ramp(frame, fEntera - 6, fEntera + 14);
  const digBox = ramp(frame, fEtiq - 4, fEtiq + 10);
  return (
    <SkStage>
      {/* título */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380 - 270 * listIn, textAlign: listIn > 0.5 ? 'left' : 'center', paddingLeft: listIn > 0.5 ? 140 : 0, opacity: listIn > 0.45 && listIn < 0.55 ? 0 : 1 }}>
        {listIn <= 0.5 ? (
          <div>
            <MaskTitle text="¿Qué versión escuchar?" at={2} size={110} align="center" hi={['versión']} />
            <div style={{ marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: rampOut(frame, fDec - 8, fDec + 8) }}>Un clásico tiene <span style={{ color: KR }}>decenas de grabaciones</span></div>
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
      {/* 1 · íntegra: las duraciones de Crimen y castigo */}
      {panel(0) > 0.01 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: panel(0) }}>
          <div style={{ position: 'absolute', left: 880, top: 220 }}>
            <Kicker at={p43} text="Crimen y castigo · grabaciones en español" />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>Duración de cada una</div>
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={AX.x} y1={AX.y} x2={AX.x + AX.w} y2={AX.y} stroke="rgba(16,16,16,0.25)" strokeWidth="3" />
            {[0, 5, 10, 15, 20, 25, 30].map((h) => <g key={h}><line x1={hx(h)} y1={AX.y - 8} x2={hx(h)} y2={AX.y + 8} stroke="rgba(16,16,16,0.3)" strokeWidth="2" /><text x={hx(h)} y={AX.y + 46} textAnchor="middle" fontFamily="Ubuntu" fontWeight="700" fontSize="26" fill="#6B6B6B">{h} h</text></g>)}
            {/* corchetes */}
            <g opacity={adapt}>
              <rect x={hx(1) - 10} y={AX.y - 250} width={hx(5.4) - hx(1) + 20} height={220} rx={14} fill="rgba(16,16,16,0.05)" />
            </g>
            <g opacity={full}>
              <rect x={hx(18.6) - 10} y={AX.y - 250} width={hx(28.3) - hx(18.6) + 20} height={220} rx={14} fill="rgba(163,25,47,0.08)" />
            </g>
            {CYC.map((h, i) => {
              const isA = h < 6;
              const isF = h > 18;
              const s = sp(frame, p43 + 4 + i * 1.6, 12, 200);
              const hl = isA ? adapt : isF ? full : 0;
              const fill = isA ? `rgba(120,116,108,${0.55 + 0.45 * hl})` : isF ? (hl > 0.5 ? KR : 'rgba(16,16,16,0.4)') : 'rgba(16,16,16,0.3)';
              return <circle key={i} cx={hx(h)} cy={AX.y - 50 - LEVEL[i] * 30} r={14 * s} fill={fill} stroke="#fff" strokeWidth="4" />;
            })}
          </svg>
          <div style={{ position: 'absolute', left: hx(1) - 10, top: AX.y - 340, opacity: adapt, transform: `translateY(${(1 - adapt) * 14}px)`, whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink2 }}>De 1 a 5 horas</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.muted }}>adaptaciones o resúmenes</div>
          </div>
          <div style={{ position: 'absolute', left: hx(18.6) - 10, top: AX.y - 340, opacity: full, transform: `translateY(${(1 - full) * 14}px)`, whiteSpace: 'nowrap' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: KR }}>Unas 20 horas o más</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.muted }}>la novela entera</div>
          </div>
          <div style={{ position: 'absolute', left: 880, top: 800, width: 900, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, opacity: rampOut(frame, p43 + 20, p43 + 34) }}>Cada punto, una grabación distinta en SonorBooks (15/10/2026).</div>
        </div>
      )}
      {/* 2 · voz humana o digital */}
      {panel(1) > 0.01 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: panel(1) }}>
          {/* la muestra */}
          <div style={{ position: 'absolute', left: 880, top: 250, display: 'flex', alignItems: 'center', gap: 24, padding: '22px 36px 22px 22px', background: '#fff', borderRadius: 999, boxShadow: shadow.card, opacity: rampOut(frame, fMuestra - 8, fMuestra + 6) }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.06 * Math.sin(frame / 5)})` }}>
              <svg width="34" height="34" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill={color.ink} /></svg>
            </div>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>Escucha siempre la muestra</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 50 }}>
              {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ width: 6, borderRadius: 3, background: NEVA, height: 10 + 36 * Math.abs(Math.sin(i * 0.7 + frame / 5) * Math.sin(i * 0.23 + frame / 11)) }} />)}
            </div>
          </div>
          {/* el listado de la ficha, con «Voz digital» */}
          <div style={{ position: 'absolute', left: 880, top: 400, width: LIST.w * 1.5, height: LIST.h * 1.18, borderRadius: 22, overflow: 'hidden', boxShadow: shadow.card, opacity: rampOut(frame, p44 - 4, p44 + 12), transform: `translateY(${(1 - rampOut(frame, p44 - 4, p44 + 12)) * 30}px)` }}>
            <Img src={staticFile('dsk/web/ficha_b.png')} style={{ position: 'absolute', left: -LIST.x * 1.5, top: -LIST.y * 1.5, width: 1600 * 1.5 }} />
            <div style={{ position: 'absolute', left: 0, top: (DIG_ROW.y - LIST.y) * 1.5, width: LIST.w * 1.5, height: DIG_ROW.h * 1.5, border: `6px solid ${color.yellow}`, borderRadius: 14, boxSizing: 'border-box', opacity: digBox,
              boxShadow: `0 0 0 2000px rgba(16,16,16,${0.3 * digBox})` }} />
          </div>
          <div style={{ position: 'absolute', left: 880 + LIST.w * 1.5 - 470, top: 400 + (DIG_ROW.y - LIST.y) * 1.5 - 44, opacity: digBox, transform: `scale(${0.8 + 0.2 * digBox}) rotate(3deg)` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, background: color.yellow, padding: '8px 24px', borderRadius: 999, boxShadow: shadow.float, whiteSpace: 'nowrap' }}>la etiqueta «Voz digital»</div>
          </div>
        </div>
      )}
      {/* 3 · el acento */}
      {panel(2) > 0.01 && (
        <div style={{ position: 'absolute', left: 860, top: 240, display: 'flex', flexDirection: 'column', gap: 22, opacity: panel(2) }}>
          <Narrator at={fJordi - 4} name="Jordi Boixaderas" initials="JB" country="España" books="Crimen y castigo" dim={ramp(frame, fOmar - 6, fOmar + 6)} />
          <Narrator at={fTxema - 4} name="Txema Regalado" initials="TR" country="España" books="Noches blancas" dim={ramp(frame, fOmar - 6, fOmar + 6)} />
          <Narrator at={fGerman - 4} name="Germán Gijón" initials="GG" country="España" books="El idiota · Los hermanos Karamázov" dim={ramp(frame, fOmar - 6, fOmar + 6)} />
          <Narrator at={fOmar - 4} name="Omar Barrera" initials="OB" country="Colombia" books="Memorias del subsuelo" accent={NEVA} />
        </div>
      )}
      <Sfx name="ui_pop" at={4} volume={0.5} />
      <Sfx name="whoosh_soft" at={fMira - 12} volume={0.5} />
      {items.map((it, i) => <Sfx key={i} name="ui_pop" at={it.at + 1} volume={0.45} />)}
      {[p43, p44, p45].map((p, i) => <Sfx key={`a${i}`} name="focus" at={p - 4} volume={0.55} />)}
      {CYC.map((_, i) => i % 3 === 0 && <Sfx key={`d${i}`} name="tick_soft" at={Math.round(p43 + 4 + i * 1.6)} volume={0.3} />)}
      <Sfx name="hit_soft" at={fEntera} volume={0.5} />
      <Sfx name="ui_tap" at={fMuestra} volume={0.5} />
      <Sfx name="focus" at={fEtiq} volume={0.6} />
      {[fJordi, fTxema, fGerman, fOmar].map((f, i) => <Sfx key={`n${i}`} name="ui_pop" at={f - 3} volume={0.5} />)}
      <Sfx name="sk_pin" at={fCol} volume={0.5} />
      {fEsp > 0 && null}
    </SkStage>
  );
};

// ——— WEB · D46 · La ficha de SonorBooks: todas las versiones, narrador, duración y dónde escucharla ———
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('WEB');
  const fTodas = c.at('D46', 'todas');
  const fNarr = c.at('D46', 'narrador,');
  const fDur = c.at('D46', 'duración');
  const fDonde = c.at('D46', 'dónde');
  const fDesc = c.at('D46', 'descripción.');
  const W = 1400;
  const k = W / 1600;
  const toList = ramp(frame, fTodas - 10, fTodas + 2) * (1 - ramp(frame, fDonde - 10, fDonde + 2));
  const focus = (x: number, y: number, s: number) => ({ s, x: -(x * k - W / 2) * s, y: -(y * k - (W * 9) / 32) * s });
  const zl = focus(LIST.x + LIST.w / 2, LIST.y + 200, 1.55);
  const zr = focus(REC.x + REC.w / 2, REC.y + 230, 1.35);
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
          <BrowserWindow width={W} url="sonorbooks.com/es/audiolibro/crimen-y-castigo">
            <Img src={staticFile('dsk/web/ficha_a.png')} style={{ position: 'absolute', left: 0, top: 0, width: W }} />
            <Img src={staticFile('dsk/web/ficha_b.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: toList }} />
            <div style={{ position: 'absolute', left: COVER.x * k, top: COVER.y * k }}><SquareCover size={COVER.s * k} /></div>
            {box(LIST, fTodas, fDonde - 6)}
            {/* resaltado de nombres (narrador) y de duraciones */}
            {[445, 522, 599, 678, 762, 846].map((y, i) => {
              const p = interpolate(frame, [fNarr - 4 + i * 2, fNarr + 6 + i * 2, fDur - 6, fDur], [0, 1, 1, 0], clamp);
              return p > 0 ? <div key={`n${i}`} style={{ position: 'absolute', left: 866 * k, top: (y - 13) * k, width: 200 * k, height: 26 * k, borderRadius: 6, background: `rgba(255,202,5,${0.45 * p})`, mixBlendMode: 'multiply' }} /> : null;
            })}
            {[470, 547, 625, 706, 790, 876].map((y, i) => {
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

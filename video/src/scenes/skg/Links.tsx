import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, color, font, KR, Pin, ramp, rampOut, shadow, SkNight, SkStage, Thread } from './kit';
import { FlatCover } from './Genres';
import { sceneClock } from './timeline';

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// ——— CONEX · G30–G32 · El tablero de conexiones ———
type Card = { k: string; x: number; y: number; rot: number };
const CARDS: Card[] = [
  { k: 'resplandor', x: 330, y: 300, rot: -4 },
  { k: 'doctor', x: 760, y: 250, rot: 3 },
  { k: 'd2263', x: 1180, y: 300, rot: -2 },
  { k: 'it', x: 1600, y: 260, rot: 4 },
  { k: 'apocalipsis', x: 330, y: 790, rot: 3 },
  { k: 'torre7', x: 760, y: 820, rot: -3 },
  { k: 'mercedes', x: 1180, y: 800, rot: 2 },
  { k: 'holly', x: 1600, y: 820, rot: -4 },
];
const W = 170;
const pinOf = (k: string): [number, number] => { const c = CARDS.find((q) => q.k === k)!; return [c.x, c.y - W * 0.75 + 14]; };

export const Conexiones: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CONEX');
  // Polaco: G30 «Bo u Kinga wszystko się łączy. Mały Danny z „Lśnienia” wraca jako dorosły w „Doktorze Śnie”.»
  // G31 «W „Dallas ’63” bohater trafia do Derry, miasta z „To”, i poznaje Beverly i Richiego.» (palabras habladas: say)
  // G32 «Randall Flagg z „Bastionu” wraca w „Mrocznej Wieży”. A Holly Gibney, która pojawia się w „Panu Mercedesie”, w końcu dostała własną powieść: „Holly”.»
  const fMuchos = c.at('G30', 'wszystko');
  const fCon = c.at('G30', 'łączy');
  const fDani = c.at('G30', 'Danny');
  const fDoc = c.at('G30', 'Doktorze');
  const fProt = c.at('G31', 'bohater');
  const fDerry = c.at('G31', 'Derry');
  const fPasa = c.at('G31', 'trafia');
  const fIt = c.at('G31', 'To');
  const fNinos = c.at('G31', 'poznaje');
  const fFlagg = c.at('G32', 'Randall');
  const fReap = c.at('G32', 'wraca');
  const fTorre = c.at('G32', 'Mrocznej');
  const fHolly = c.at('G32', 'Holly');
  const fNovela = c.at('G32', 'powieść');
  const links = [
    { a: 'resplandor', b: 'doctor', at: fDoc - 10, label: 'Danny, już dorosły', lAt: fDani },
    { a: 'd2263', b: 'it', at: fPasa - 6, label: 'Derry, 1958', lAt: fDerry - 4, sub: 'Beverly i Richie', subAt: fNinos },
    { a: 'apocalipsis', b: 'torre7', at: fReap - 4, label: 'Randall Flagg', lAt: fFlagg },
    { a: 'mercedes', b: 'holly', at: fNovela - 16, label: 'Holly Gibney', lAt: fHolly },
  ];
  const mid = (l: typeof links[number]) => { const A = pinOf(l.a), B = pinOf(l.b); return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + 60] as [number, number]; };
  // Cámara: vista general → cada conexión → vista general.
  const zoomTo = (p: [number, number], s: number) => ({ s, x: -(p[0] - 960) * s, y: -(p[1] - 540) * s });
  const z = links.map((l) => zoomTo(mid(l), 1.55));
  const keys = [
    { f: 0, s: 1.08, x: 0, y: 0 }, { f: fDani - 16, s: 1, x: 0, y: 0 },
    { f: fDani + 4, ...z[0] }, { f: fProt - 10, ...z[0] },
    { f: fProt + 10, ...z[1] }, { f: fNinos + 20, ...z[1] },
    { f: fFlagg - 4, ...z[2] }, { f: fHolly - 14, ...z[2] },
    { f: fHolly + 6, ...z[3] }, { f: fNovela + 24, ...z[3] },
    { f: fNovela + 56, s: 0.96, x: 0, y: 10 }, { f: c.dur, s: 0.95, x: 0, y: 10 },
  ];
  const k = (p: string) => keyframes(frame, keys, p, easeInOut);
  return (
    <SkNight lamp={[960, 300]}>
      <AbsoluteFill style={{ transform: `translate(${k('x')}px, ${k('y')}px) scale(${k('s')})` }}>
        {/* tablero de corcho */}
        <div style={{ position: 'absolute', left: 80, top: 60, right: 80, bottom: 60, borderRadius: 20, background: 'radial-gradient(ellipse at 50% 40%, #5B4632 0%, #3E2F22 70%, #2E2219 100%)', boxShadow: 'inset 0 0 0 14px #2A1E15, 0 40px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'absolute', inset: 14, borderRadius: 10, backgroundImage: 'radial-gradient(rgba(0,0,0,0.18) 1.2px, transparent 1.6px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)', backgroundSize: '9px 9px, 13px 13px', backgroundPosition: '0 0, 4px 6px' }} />
        </div>
        {CARDS.map((cd, i) => {
          const a = Math.min(fMuchos - 10, 8) + i * 4;
          const s = sp(frame, a, 13, 200);
          if (frame < a - 1) return null;
          const lit = links.some((l) => (l.a === cd.k || l.b === cd.k) && frame >= l.at);
          return (
            <div key={cd.k} style={{ position: 'absolute', left: cd.x - W / 2, top: cd.y - W * 0.75, transform: `translateY(${(1 - s) * -40}px) scale(${1.15 - 0.15 * s})`, opacity: s, filter: lit ? undefined : 'brightness(0.82)' }}>
              <FlatCover b={BOOKS[cd.k]} w={W} rot={cd.rot} dark />
            </div>
          );
        })}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.28 * (1 - ramp(frame, fDani - 10, fDani + 10)) }}>
          {links.map((l, i) => <Thread key={`f${i}`} a={pinOf(l.a)} b={pinOf(l.b)} at={fCon - 4 + i * 5} dur={16} sag={80} w={3} />)}
        </div>
        {links.map((l, i) => <Thread key={i} a={pinOf(l.a)} b={pinOf(l.b)} at={l.at} dur={20} sag={l.a === 'resplandor' || l.a === 'd2263' ? 90 : 70} w={5} />)}
        {CARDS.map((cd, i) => <Pin key={cd.k} x={cd.x} y={cd.y - W * 0.75 + 14} at={Math.min(fMuchos - 10, 8) + 4 + i * 4} />)}
        {links.map((l, i) => {
          const m = mid(l);
          const s = sp(frame, l.lAt + 4, 13, 200);
          if (frame < l.lAt) return null;
          return (
            <div key={`l${i}`} style={{ position: 'absolute', left: m[0], top: m[1] + 10, transform: `translate(-50%, 0) rotate(${i % 2 ? 2 : -2}deg) scale(${s})`, opacity: s }}>
              <div style={{ background: PAPER2, padding: '10px 22px', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(0,0,0,0.45)', borderRadius: 4 }}>
                {l.label}
                {l.sub && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.ink2, opacity: rampOut(frame, l.subAt!, l.subAt! + 10) }}>{l.sub}</div>}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', opacity: rampOut(frame, 4, 18) * (1 - ramp(frame, fDani - 20, fDani - 6)) }}>
        <MaskTitle text="Wszystko się łączy" at={6} size={70} align="center" color="#fff" hi={['łączy']} />
      </div>
      {CARDS.map((cd, i) => <Sfx key={cd.k} name="sk_pin" at={Math.min(fMuchos - 10, 8) + 4 + i * 4} volume={0.6} />)}
      {links.map((l, i) => <Sfx key={`s${i}`} name="sk_string" at={l.at + 4} volume={0.8} />)}
      {links.map((l, i) => <Sfx key={`z${i}`} name="zoom_in" at={l.lAt - 6} volume={0.4} />)}
      <Sfx name="zoom_out" at={fNovela + 30} volume={0.5} />
      {fCon + fIt + fTorre > 0 && null}
    </SkNight>
  );
};
const PAPER2 = '#F4EDDC';

// ——— ORDEN · G33 · ¿Hay que leerlo en orden? ———
export const Orden: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ORDEN');
  const fNo = c.at('G33', 'Nie');
  const fTres = c.at('G33', 'trzech');
  const fTorre = c.at('G33', 'Mroczna');
  const fTril = c.at('G33', 'trylogia');
  const fVis = c.at('G33', 'Outsiderem');
  const fHolly = c.at('G33', 'Holly');
  const fResp = c.at('G33', 'Lśnienie');
  const fDoc = c.at('G33', 'Doktorem');
  const no = sp(frame, fNo - 2, 9, 260);
  const toList = ramp(frame, fTres - 14, fTres + 4);
  const rows = [
    { label: 'Mroczna Wieża', at: fTorre - 6, books: ['torre1', 'torre2', 'torre3', 'torre4', 'torre5', 'torre6', 'torre7'], stepAt: (i: number) => fTorre + i * 4 },
    { label: 'Bill Hodges i Holly', at: fTril - 6, books: ['mercedes', 'quien', 'fin', 'visitante', 'holly'], stepAt: (i: number) => (i < 3 ? fTril + i * 5 : i === 3 ? fVis - 4 : fHolly - 4) },
    { label: 'Lśnienie', at: fResp - 6, books: ['resplandor', 'doctor'], stepAt: (i: number) => (i === 0 ? fResp : fDoc - 4) },
  ];
  return (
    <SkStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - toList, transform: `scale(${1 - 0.1 * toList})`, filter: toList > 0.01 ? `blur(${toList * 8}px)` : undefined }}>
        <MaskTitle text="Czytać po kolei?" at={2} size={92} align="center" />
        <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 230, color: '#fff', background: KR, padding: '0 70px', borderRadius: 40, transform: `rotate(-5deg) scale(${1.6 - 0.6 * no})`, opacity: Math.min(1, no * 3), boxShadow: '0 30px 60px rgba(193,18,31,0.35)' }}>NIE</div>
      </AbsoluteFill>
      {toList > 0 && (
        <AbsoluteFill style={{ opacity: toList, paddingLeft: 140, paddingTop: 110 }}>
          <Kicker at={fTres - 6} text="Tylko w trzech przypadkach" />
          <MaskTitle text="Tu kolejność ma znaczenie" at={fTres - 4} size={80} hi={['znaczenie']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30, marginTop: 40 }}>
            {rows.map((r, ri) => {
              const s = sp(frame, r.at, 15, 170);
              return (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
                  <div style={{ width: 300, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>{r.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {r.books.map((bk, i) => {
                      const bs = sp(frame, r.stepAt(i), 13, 210);
                      return (
                        <React.Fragment key={bk}>
                          {i > 0 && <svg width="34" height="24" viewBox="0 0 34 24" style={{ opacity: bs }}><path d="M2 12h26M20 4l8 8-8 8" stroke={color.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          <div style={{ position: 'relative', opacity: bs, transform: `translateY(${(1 - bs) * 30}px)` }}>
                            <FlatCover b={BOOKS[bk]} w={ri === 0 ? 116 : 140} />
                            <div style={{ position: 'absolute', left: -10, top: -12, width: 36, height: 36, borderRadius: '50%', background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.soft }}>{i + 1}</div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="stamp" at={fNo} volume={0.8} />
      <Sfx name="whoosh_soft" at={fTres - 10} volume={0.6} />
      {rows.flatMap((r, ri) => r.books.map((_, i) => <Sfx key={`${ri}-${i}`} name="tick_soft" at={r.stepAt(i) + 2} volume={0.5} />))}
    </SkStage>
  );
};

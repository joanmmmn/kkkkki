import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Highlight } from '../../components/Highlight';
import { MicIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import { Grow } from '../../components/Grow';

// Datos de SonorBooks (anuncio V7): «Crimen y castigo» en cada plataforma.
const ROWS = [
  { p: 'El Libro Total', n: 'Hernando Iván Cano', price: 'Gratis', elt: true },
  { p: 'Google Play Libros', n: 'Luis David García Márquez', price: '14,99 €' },
  { p: 'Apple Books', n: 'Luis David García Márquez', price: '17,99 €' },
  { p: 'Audible', n: 'Luis David García Márquez', price: '18,99 €' },
];
const Cap = () => (<svg width="110" height="110" viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z" fill={color.yellow} stroke={color.ink} strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 11v4.5c2 2 10 2 12 0V11" fill="none" stroke={color.ink} strokeWidth="1.3" /><path d="M21 9.5v5" stroke={color.ink} strokeWidth="1.3" /></svg>);
const Books = () => (<svg width="110" height="110" viewBox="0 0 24 24"><rect x="4" y="4" width="4" height="16" rx="1" fill={color.yellow} stroke={color.ink} strokeWidth="1.2" /><rect x="9" y="6" width="4" height="14" rx="1" fill="#fff" stroke={color.ink} strokeWidth="1.2" /><path d="M14.5 7.5l3.8-1 3 12.8-3.8 1z" fill="#fff" stroke={color.ink} strokeWidth="1.2" /></svg>);
const Globe = () => (<svg width="110" height="110" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill={color.yellow} stroke={color.ink} strokeWidth="1.3" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke={color.ink} strokeWidth="1.3" /></svg>);

// V11 · Para quién es (y para quién no) + el ahorro real.
export const H11Price: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V11', w, n, fb);
  const pers = [
    { t: 'Estudiantes', f: at('estudiantes', 0, 1.52), i: <Cap /> },
    { t: 'Amantes de los clásicos', f: at('amantes', 0, 2.56), i: <Books /> },
    { t: 'Quien aprende idiomas', f: at('quien', 0, 4.16), i: <Globe /> },
  ];
  const fThr = at('Si', 0, 5.76);
  const fAhorro = at('Y', 0, 8.76) - 6;
  const fEntre = at('entre', 0, 11.92);
  const fAqui = at('Aqui', 0, 14.84);
  const fCero = at('cero', 0, 15.48);
  const thr = spring({ frame: frame - fThr, fps, config: { damping: 14 } });
  return (
    <Stage>
      <Phase from={0} to={fAhorro + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ fontFamily: font.sans, fontSize: 40, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>IDEAL PARA</div>
          <div style={{ display: 'flex' }}>
            {pers.map((p, i) => (
              <Grow key={p.t} at={p.f - 6} w={500} gap={46} first={i === 0}>
                <div style={{ padding: '44px 30px', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, textAlign: 'center' }}>
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(1 - spring({ frame: frame - p.f, fps, config: { damping: 8, stiffness: 160 } })) * -25}deg)` }}>{p.i}</div>
                  <div style={{ fontFamily: font.sans, fontSize: 50, fontWeight: 700, marginTop: 16 }}>{p.t}</div>
                </div>
              </Grow>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 40px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 44, fontWeight: 500, opacity: thr, transform: `translateY(${(1 - thr) * 30}px)` }}>
            <CrossIcon size={52} /> ¿El último thriller? No es tu sitio
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fAhorro} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 1500, background: '#fff', borderRadius: 40, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '46px 60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 26 }}>
              <div style={{ width: 96, height: 128, borderRadius: 10, background: 'linear-gradient(160deg,#2b2b2b,#0d0d0d)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 14, fontFamily: font.sans, color: '#eee', fontSize: 15, fontWeight: 500, textAlign: 'center' }}>CRIMEN<br />Y CASTIGO</div>
              <div>
                <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700 }}>Crimen y castigo</div>
                <div style={{ fontFamily: font.sans, fontSize: 32, color: color.muted }}>Fiódor Dostoievski · audiolibro</div>
              </div>
            </div>
            {ROWS.map((r, i) => {
              const s = spring({ frame: frame - fAhorro - 6 - i * 4, fps, config: { damping: 20, stiffness: 160 } });
              const store = !r.elt;
              const hiStore = store ? interpolate(frame, [fEntre, fEntre + 8, fAqui - 4, fAqui + 6], [0, 1, 1, 0.4], clamp) : 0;
              const hiElt = r.elt ? interpolate(frame, [fAqui, fAqui + 10], [0, 1], clamp) : 0;
              return (
                <div key={r.p} style={{ display: 'flex', alignItems: 'center', padding: '20px 20px', margin: '0 -20px', borderTop: `1px solid ${color.line}`, borderRadius: 18, background: hiElt ? `rgba(255,244,194,${hiElt})` : hiStore ? `rgba(229,72,77,${0.07 * hiStore})` : 'transparent', opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${1 + 0.02 * hiElt})` }}>
                  <div style={{ width: 520, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 40, fontWeight: 500 }}>
                    {r.elt && <div style={{ width: 54, height: 54, borderRadius: 12, background: color.eltNavy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 30 }} /></div>}
                    {r.p}
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontSize: 32, color: color.ink2 }}><MicIcon size={32} c={color.muted} /> {r.n}</div>
                  <div style={{ width: 260, textAlign: 'right', fontFamily: font.sans, fontSize: 54, fontWeight: 700 }}>
                    {r.elt ? <Highlight start={fCero - 4} dur={10}>{r.price}</Highlight> : r.price}
                  </div>
                </div>
              );
            })}
            <div style={{ fontFamily: font.sans, fontSize: 22, color: color.muted, marginTop: 16 }}>Precio de compra del título, según SonorBooks (2026)</div>
          </div>
        </AbsoluteFill>
      </Phase>
      {pers.map((p, i) => <Sfx key={p.t} name="ui_pop" at={p.f - 3} volume={0.85 + 0.05 * i} />)}
      <Sfx name="fail" at={fThr} />
      <Sfx name="swipe" at={fAhorro} />
      <Sfx name="card_flip" at={fAhorro + 4} />
      {ROWS.map((r, i) => <Sfx key={r.p} name="tick_soft" at={fAhorro + 8 + i * 4} volume={0.5} />)}
      <Sfx name="hit_soft" at={fEntre} volume={0.6} />
      <Sfx name="focus" at={fAqui} />
      <Sfx name="marker" at={fCero - 4} />
      <Sfx name="coins" at={fCero} />
    </Stage>
  );
};

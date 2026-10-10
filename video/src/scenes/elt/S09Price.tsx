import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { MicIcon } from '../../components/Icons';
import { wordFrame } from '../../lib/vo';

// Datos de la tabla del anuncio V7 de SonorBooks (Crimen y castigo).
const ROWS = [
  { p: 'El Libro Total', n: 'Hernando Iván Cano', price: 'Gratis', elt: true },
  { p: 'Google Play Libros', n: 'Luis David García Márquez', price: '14,99 €' },
  { p: 'Apple Books', n: 'Luis David García Márquez', price: '17,99 €' },
  { p: 'Audible', n: 'Luis David García Márquez', price: '18,99 €', audible: true },
];

const Persona: React.FC<{ emoji: React.ReactNode; t: string; at: number }> = ({ emoji, t, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <div style={{ width: 460, padding: '46px 30px', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})` }}>
      <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</div>
      <div style={{ fontFamily: font.sans, fontSize: 48, fontWeight: 700, marginTop: 18 }}>{t}</div>
    </div>
  );
};

const Cap = () => (<svg width="120" height="120" viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z" fill={color.yellow} stroke={color.ink} strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 11v4.5c2 2 10 2 12 0V11" fill="none" stroke={color.ink} strokeWidth="1.3" /><path d="M21 9.5v5" stroke={color.ink} strokeWidth="1.3" /></svg>);
const Books = () => (<svg width="120" height="120" viewBox="0 0 24 24"><rect x="4" y="4" width="4" height="16" rx="1" fill={color.yellow} stroke={color.ink} strokeWidth="1.2" /><rect x="9" y="6" width="4" height="14" rx="1" fill="#fff" stroke={color.ink} strokeWidth="1.2" /><path d="M14.5 7.5l3.8-1 3 12.8-3.8 1z" fill="#fff" stroke={color.ink} strokeWidth="1.2" /></svg>);
const Globe = () => (<svg width="120" height="120" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill={color.yellow} stroke={color.ink} strokeWidth="1.3" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke={color.ink} strokeWidth="1.3" /></svg>);

// E09 · Para quién es + comparativa de precio (tabla al estilo del V7).
export const S09Price: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E09', w, n, fb);
  const fEst = at('estudiantes', 0, 0.9);
  const fCla = at('amantes', 0, 1.7);
  const fIdi = at('quien', 0, 3.4);
  const fPrecio = at('precio', 0, 5.5) - 14;
  const fAud = at('diecinueve', 0, 9.7);
  const fCero = at('cero', 0, 12.7);
  const fAqui = at('Aqui', 0, 11.8);
  return (
    <Stage>
      <Phase from={0} to={fPrecio + 8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60 }}>
          <div style={{ fontFamily: font.sans, fontSize: 40, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>IDEAL PARA</div>
          <div style={{ display: 'flex', gap: 50 }}>
            <Persona emoji={<Cap />} t="Estudiantes" at={fEst} />
            <Persona emoji={<Books />} t="Amantes de los clásicos" at={fCla} />
            <Persona emoji={<Globe />} t="Quien aprende idiomas" at={fIdi} />
          </div>
        </AbsoluteFill>
      </Phase>
      <Phase from={fPrecio} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 1500, background: '#fff', borderRadius: 40, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '50px 60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 30 }}>
              <div style={{ width: 96, height: 128, borderRadius: 10, background: 'linear-gradient(160deg,#2b2b2b,#0d0d0d)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 14, fontFamily: font.sans, color: '#eee', fontSize: 15, fontWeight: 500, textAlign: 'center', boxShadow: shadow.soft }}>CRIMEN<br />Y CASTIGO</div>
              <div>
                <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700 }}>Crimen y castigo</div>
                <div style={{ fontFamily: font.sans, fontSize: 32, color: color.muted }}>Fiódor Dostoievski · audiolibro</div>
              </div>
            </div>
            <div style={{ display: 'flex', fontFamily: font.sans, fontSize: 24, letterSpacing: 5, color: color.muted, fontWeight: 500, padding: '0 0 12px' }}>
              <div style={{ width: 520 }}>PLATAFORMA</div><div style={{ flex: 1 }}>NARRACIÓN</div><div style={{ width: 260, textAlign: 'right' }}>PRECIO</div>
            </div>
            {ROWS.map((r, i) => {
              const s = spring({ frame: frame - fPrecio - 6 - i * 4, fps, config: { damping: 20, stiffness: 160 } });
              const hiAud = r.audible ? interpolate(frame, [fAud, fAud + 8, fAqui - 6, fAqui + 6], [0, 1, 1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
              const hiElt = r.elt ? interpolate(frame, [fAqui, fAqui + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
              const dim = !r.elt && !r.audible ? interpolate(frame, [fAud, fAud + 10], [1, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
              return (
                <div key={r.p} style={{ display: 'flex', alignItems: 'center', padding: '22px 20px', margin: '0 -20px', borderTop: `1px solid ${color.line}`, borderRadius: 18, background: hiElt ? `rgba(255,244,194,${hiElt})` : hiAud ? `rgba(229,72,77,${0.08 * hiAud})` : 'transparent', opacity: s * dim, transform: `translateY(${(1 - s) * 30}px) scale(${1 + 0.02 * hiElt})` }}>
                  <div style={{ width: 520, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 40, fontWeight: 500 }}>
                    {r.elt && <div style={{ width: 54, height: 54, borderRadius: 12, background: color.eltNavy, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 30 }} /></div>}
                    {r.p}
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontSize: 34, color: color.ink2 }}><MicIcon size={34} c={color.muted} /> {r.n}</div>
                  <div style={{ width: 260, textAlign: 'right', fontFamily: font.sans, fontSize: 52, fontWeight: 700, position: 'relative' }}>
                    {r.elt ? <Highlight start={fCero - 4} dur={10}>{r.price}</Highlight> : r.price}
                    {r.audible && <div style={{ position: 'absolute', right: -6, left: 70, top: '52%', height: 6, background: color.red, borderRadius: 3, transform: `scaleX(${interpolate(frame, [fAqui, fAqui + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`, transformOrigin: 'left' }} />}
                  </div>
                </div>
              );
            })}
            <div style={{ fontFamily: font.sans, fontSize: 22, color: color.muted, marginTop: 18 }}>Precios de compra del audiolibro según SonorBooks · consultados en 2026</div>
          </div>
        </AbsoluteFill>
      </Phase>
      {[fEst, fCla, fIdi].map((f, i) => <Sfx key={i} name="pop" at={f} volume={0.3} />)}
      <Sfx name="whoosh_soft" at={fPrecio - 6} volume={0.3} />
      <Sfx name="impact" at={fAud} volume={0.2} />
      <Sfx name="pencil_strike" at={fAqui} volume={0.3} />
      <Sfx name="marker" at={fCero - 4} volume={0.35} />
      <Sfx name="tick" at={fCero + 4} volume={0.25} />
    </Stage>
  );
};

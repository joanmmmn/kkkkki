import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Phone } from '../../components/Phone';
import { CheckIcon, CrossIcon, BookIcon, HeadphonesIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import { Grow } from '../../components/Grow';

const Row: React.FC<{ ok: boolean; text: string; at: number; size?: number }> = ({ ok, text, at, size = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontSize: size, fontWeight: 500, opacity: s, transform: `translateX(${(1 - s) * 30}px)` }}>
      <div style={{ transform: `scale(${s})` }}>{ok ? <CheckIcon size={size * 1.05} /> : <CrossIcon size={size * 1.05} />}</div>{text}
    </div>
  );
};

const WifiOff: React.FC<{ size?: number; strike: number }> = ({ size = 64, strike }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0" fill="none" stroke={color.ink} strokeWidth="1.9" strokeLinecap="round" />
    <circle cx="12" cy="19" r="1.4" fill={color.ink} />
    <path d="M3.5 3.5l17 17" stroke={color.red} strokeWidth="2.4" strokeLinecap="round" strokeDasharray={24.1} strokeDashoffset={24.1 * (1 - strike)} />
  </svg>
);

const Laptop: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="1.6" fill="none" stroke={color.ink} strokeWidth="1.5" /><path d="M2 18.5h20" stroke={color.ink} strokeWidth="1.5" strokeLinecap="round" /></svg>
);

// V09 · Cuenta opcional → velocidad en el móvil (no en el ordenador) → sin conexión solo texto.
export const H09App: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V09', w, n, fb);
  const fReg = at('registras', 0, 2.88) - 4;
  const fHist = at('historial', 0, 4.72);
  const fFav = at('favoritos', 0, 5.48);
  const fNotas = at('notas', 0, 6.28);
  const fMovil = at('En', 0, 7.12) - 6;
  const fDoble = at('doble', 0, 9.8);
  const fOrd = at('ordenador', 0, 10.72);
  const fOjo = at('Pero', 0, 12.48) - 6;
  const fLeer = at('sin', 0, 13.36) + 4;
  const fAudio = at('audio', 0, 15.8);
  const speeds = ['0,8×', '1×', '1,2×', '1,5×', '2×'];
  const sel = Math.min(4, Math.max(1, Math.floor(interpolate(frame, [fMovil + 30, fDoble + 4], [1, 4.99], clamp))));
  return (
    <Stage>
      <Phase from={0} to={fMovil + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <div style={{ width: 720, background: '#fff', borderRadius: 36, padding: 54, boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>SIN CUENTA</div>
            <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700, margin: '10px 0 30px' }}>Entras y escuchas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><Row ok text="Leer" at={6} /><Row ok text="Escuchar audiolibros" at={12} /></div>
          </div>
          <Grow at={fReg - 6} w={720} gap={60}>
          <div style={{ width: 720, background: '#fff', borderRadius: 36, padding: 54, boxShadow: '0 40px 90px rgba(255,202,5,0.22), 0 8px 24px rgba(16,16,16,0.06)', border: `3px solid ${color.yellow}` }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>CON CUENTA GRATIS</div>
            <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700, margin: '10px 0 30px' }}>Y además…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Row ok text="Historial" at={fHist} /><Row ok text="Favoritos y marcadores" at={fFav} /><Row ok text="Cuaderno de notas" at={fNotas} />
            </div>
          </div>
          </Grow>
        </AbsoluteFill>
      </Phase>

      <Phase from={fMovil} to={fOjo + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 110 }}>
          <Phone height={800} ratio={739 / 430}>
            <Img src={staticFile('elt/img/m03_home_scrolled.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 30, padding: '16px 10px', borderRadius: 22, background: 'rgba(255,255,255,0.96)', display: 'flex', justifyContent: 'space-around', fontFamily: font.sans, fontWeight: 700, fontSize: 26 }}>
              {speeds.map((sp, i) => <div key={sp} style={{ padding: '8px 12px', borderRadius: 14, background: i === sel ? color.yellow : 'transparent' }}>{sp}</div>)}
            </div>
          </Phone>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ fontFamily: font.sans, fontSize: 32, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>VELOCIDAD DE LECTURA</div>
            <div style={{ fontFamily: font.sans, fontSize: 130, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>hasta <span style={{ background: color.yellow, borderRadius: 18, padding: '0 18px' }}>2×</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: spring({ frame: frame - fOrd, fps }), transform: `translateY(${(1 - spring({ frame: frame - fOrd, fps })) * 30}px)` }}>
              <Laptop size={100} /><div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500 }}>En el ordenador, no</div><CrossIcon size={56} />
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fOjo} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <WifiOff size={96} strike={interpolate(frame, [fOjo + 8, fOjo + 20], [0, 1], clamp)} />
            <div style={{ fontFamily: font.sans, fontSize: 64, letterSpacing: 4, color: color.ink, fontWeight: 700 }}>Sin conexión</div>
          </div>
          <div style={{ display: 'flex' }}>
            {[{ ok: true, t: 'Leer', s: 'EPUB · PDF', I: BookIcon, f: fLeer }, { ok: false, t: 'Escuchar', s: 'necesita internet', I: HeadphonesIcon, f: fAudio }].map((x, i) => (
              <Grow key={x.t} at={x.f - 8 - fOjo} w={600} gap={50} first={i === 0}>
                <div style={{ padding: '50px 54px', borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `3px solid ${x.ok ? color.green : color.red}`, display: 'flex', alignItems: 'center', gap: 30 }}>
                  <x.I size={110} />
                  <div style={{ flex: 1, fontFamily: font.sans }}>
                    <div style={{ fontSize: 72, fontWeight: 700 }}>{x.t}</div>
                    <div style={{ fontSize: 34, color: color.muted }}>{x.s}</div>
                  </div>
                  <div style={{ transform: `scale(${spring({ frame: frame - x.f, fps, config: { damping: 9, stiffness: 200 } })})` }}>{x.ok ? <CheckIcon size={80} /> : <CrossIcon size={80} />}</div>
                </div>
              </Grow>
            ))}
          </div>
        </AbsoluteFill>
      </Phase>

      {[6, 12].map((f) => <Sfx key={f} name="ui_tap" at={f} volume={0.8} />)}
      <Sfx name="swipe" at={fReg - 4} />
      <Sfx name="card_flip" at={fReg} />
      {[fHist, fFav, fNotas].map((f) => <Sfx key={f} name="ui_tap" at={f} volume={0.8} />)}
      <Sfx name="whoosh_deep" at={fMovil} volume={0.8} />
      {[1, 2, 3].map((k) => <Sfx key={k} name="phone_tap" at={Math.round(fMovil + 30 + (fDoble + 4 - fMovil - 30) * (k / 4))} />)}
      <Sfx name="snap_in" at={fDoble + 4} />
      <Sfx name="fail" at={fOrd} />
      <Sfx name="transition" at={fOjo} volume={0.7} />
      <Sfx name="pencil_strike" at={fOjo + 8} volume={0.7} />
      <Sfx name="success" at={fLeer - 6} />
      <Sfx name="fail" at={fAudio - 6} />
    </Stage>
  );
};

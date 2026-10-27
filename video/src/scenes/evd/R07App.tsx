import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phone } from '../../components/Phone';
import { Grow } from '../../components/Grow';
import { CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { textWidth } from '../../lib/measure';
import { clamp } from '../../lib/anim';
import { CarIcon, DownloadIcon, EV_LIME, FamilyIcon, GlobeIcon, MoonIcon, PhoneIcon, Pop, SpeedIcon, UserIcon } from './ui';

// Reproductor de audiolibros dibujado al estilo de la app (portada real de la ficha de Everand).
const Player: React.FC<{ ring: (k: 'dl' | 'speed' | 'moon') => number; t: number }> = ({ ring, t }) => {
  const R = (k: 'dl' | 'speed' | 'moon', child: React.ReactNode) => {
    const r = ring(k);
    return (
      <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 28, background: r > 0 ? `rgba(255,202,5,${0.25 * r})` : 'transparent' }}>
        {child}
        {r > 0 && <div style={{ position: 'absolute', inset: -6, borderRadius: 32, border: `5px solid ${color.yellow}`, opacity: r, transform: `scale(${0.9 + 0.1 * r})`, boxShadow: '0 0 20px rgba(255,202,5,0.6)' }} />}
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2a2420 0%, #141211 55%, #0d0c0b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '90px 34px 40px', boxSizing: 'border-box', fontFamily: font.sans, color: '#fff' }}>
      <div style={{ width: 250, height: 250, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
        <Img src={staticFile('evd/img/cover_crimen_full.jpg')} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      <div style={{ marginTop: 34, fontSize: 30, fontWeight: 700 }}>Crimen y castigo</div>
      <div style={{ marginTop: 6, fontSize: 20, color: 'rgba(255,255,255,0.6)' }}>Fiódor M. Dostoievski</div>
      <div style={{ marginTop: 30, width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.18)' }}>
        <div style={{ width: `${18 + t * 6}%`, height: 6, borderRadius: 3, background: EV_LIME }} />
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: 16, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}><span>4:21:08</span><span>-19:38:52</span></div>
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 46 }}>
        <svg width="46" height="46" viewBox="0 0 24 24"><path d="M11 6L4 12l7 6zM20 6l-7 6 7 6z" fill="#fff" /></svg>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: EV_LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill={color.ink} /></svg>
        </div>
        <svg width="46" height="46" viewBox="0 0 24 24"><path d="M13 6l7 6-7 6zM4 6l7 6-7 6z" fill="#fff" /></svg>
      </div>
      <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
        {R('speed', <div style={{ fontSize: 26, fontWeight: 700 }}>1,2x</div>)}
        {R('moon', <MoonIcon size={40} c="#fff" />)}
        {R('dl', <DownloadIcon size={42} c="#fff" />)}
      </div>
    </div>
  );
};

const Chip: React.FC<{ icon: React.ReactNode; text: string; dark?: boolean }> = ({ icon, text, dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 30px 18px 22px', borderRadius: 999, background: dark ? color.ink : '#fff', color: dark ? '#fff' : color.ink, boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 38, fontWeight: 700, whiteSpace: 'nowrap' }}>
    {icon}{text}
  </div>
);
const chipW = (t: string) => 22 + 44 + 14 + textWidth(t, 38, 700) + 30 + 4;

// R07 · La app: descargas, velocidad, temporizador; web, móvil, CarPlay y Android Auto. Sin perfiles ni plan familiar.
export const R07App: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R07', w, n, fb);
  const fDl = at('descargas', 0, 2.96);
  const fSpeed = at('velocidad', 0, 3.84);
  const fMoon = at('temporizador', 0, 4.76);
  const fFunc = at('funciona', 0, 5.92);
  const plats = [
    { t: 'Web', i: <GlobeIcon size={44} />, f: at('web', 0, 6.64) },
    { t: 'Móvil', i: <PhoneIcon size={44} />, f: at('movil', 0, 7.28) },
    { t: 'CarPlay', i: <CarIcon size={44} />, f: at('CarPlay', 0, 7.84) },
    { t: 'Android Auto', i: <CarIcon size={44} />, f: at('Android', 0, 8.64) },
  ];
  const fNo = at('Lo', 0, 10.04);
  const fPerf = at('perfiles', 0, 11.08);
  const fFam = at('familiar', 0, 12.16) - 12;
  const phone = spring({ frame: frame - 2, fps, config: { damping: 20, stiffness: 110 } });
  const ring = (k: 'dl' | 'speed' | 'moon') => {
    const f = k === 'dl' ? fDl : k === 'speed' ? fSpeed : fMoon;
    const next = k === 'dl' ? fSpeed : k === 'speed' ? fMoon : fFunc + 8;
    return interpolate(frame, [f - 4, f + 4, next - 6, next], [0, 1, 1, 0.0], clamp);
  };
  const feats = [
    { t: 'Descargas', i: <DownloadIcon size={44} />, f: fDl },
    { t: 'Velocidad', i: <SpeedIcon size={44} />, f: fSpeed },
    { t: 'Temporizador', i: <MoonIcon size={44} />, f: fMoon },
  ];
  const label = (txt: string, f: number) => <Pop at={f}><div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>{txt}</div></Pop>;
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 110 }}>
        <div style={{ transform: `translateY(${(1 - phone) * 120}px) rotate(${-4 + 4 * phone}deg)`, opacity: phone }}>
          <Phone height={820}><Player ring={ring} t={frame / dur} /></Phone>
        </div>
        <div style={{ width: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {label('MUY CUIDADA', 8)}
          <div style={{ display: 'flex', height: 90 }}>
            {feats.map((c, i) => <Grow key={c.t} at={c.f - 6} w={chipW(c.t)} gap={18} first={i === 0}><Chip icon={c.i} text={c.t} /></Grow>)}
          </div>
          <div style={{ height: 18 }} />
          {label('FUNCIONA EN', fFunc - 4)}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, height: 200, alignContent: 'flex-start' }}>
            {plats.map((c) => <Pop key={c.t} at={c.f - 6}><Chip icon={c.i} text={c.t} /></Pop>)}
          </div>
          {label('LO QUE NO HAY', fNo - 4)}
          <div style={{ display: 'flex', gap: 18, height: 90 }}>
            {[{ t: 'Perfiles', i: <UserIcon size={44} c="#fff" />, f: fPerf }, { t: 'Plan familiar', i: <FamilyIcon size={44} c="#fff" />, f: fFam }].map((c) => (
              <Pop key={c.t} at={c.f - 6}>
                <div style={{ position: 'relative' }}>
                  <Chip icon={c.i} text={c.t} dark />
                  <div style={{ position: 'absolute', right: -14, top: -14 }}><CrossIcon size={46} /></div>
                </div>
              </Pop>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} />
      <Sfx name="phone_tap" at={8} volume={0.8} />
      {feats.map((c) => <Sfx key={c.t} name="ui_pop" at={c.f - 3} />)}
      {feats.map((c) => <Sfx key={`r${c.t}`} name="focus" at={c.f} volume={0.5} />)}
      {plats.map((c) => <Sfx key={c.t} name="pop" at={c.f - 3} volume={0.85} />)}
      <Sfx name="cross" at={fPerf - 3} />
      <Sfx name="cross" at={fFam - 3} />
    </Stage>
  );
};

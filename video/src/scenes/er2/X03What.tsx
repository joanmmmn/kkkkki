import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { IcFile, IcGlobe, IcHeadphones, IcLink } from '../er/icons';
import { clamp, easeInOut } from '../../lib/anim';
import { app, Crop, st } from './AppView';
import { ERLogo } from './X01Hook';
import { w } from './timeline';

const ID = 'X03';

const Num: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ width: 56, height: 56, borderRadius: 28, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32 }}>{n}</div>
);

const Apple: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-.9-2.5-3.7zM14.1 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z" fill={color.ink} /></svg>
);
const Android: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M6 9.5h12v7.5a1.5 1.5 0 0 1-1.5 1.5H16v2.5a1.25 1.25 0 0 1-2.5 0v-2.5h-3v2.5a1.25 1.25 0 0 1-2.5 0v-2.5h-.5A1.5 1.5 0 0 1 6 17zM6 8.5a6 6 0 0 1 12 0zM3.5 9.5a1.25 1.25 0 0 1 1.25 1.25v4.5a1.25 1.25 0 0 1-2.5 0v-4.5A1.25 1.25 0 0 1 3.5 9.5zm17 0a1.25 1.25 0 0 1 1.25 1.25v4.5a1.25 1.25 0 0 1-2.5 0v-4.5a1.25 1.25 0 0 1 1.25-1.25zM8 3l1.2 2M16 3l-1.2 2" fill="#3DDC84" stroke="#3DDC84" strokeWidth="0.6" strokeLinecap="round" /><circle cx="9.5" cy="6.6" r=".7" fill="#fff" /><circle cx="14.5" cy="6.6" r=".7" fill="#fff" /></svg>
);

// X03 · Qué es: biblioteca de audiolibros + tus textos en audio · web, iPhone y Android sincronizados.
export const X03What: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W03', word, n);
  const fBib = at('biblioteca') - 4;
  const fConv = at('convierte') - 4;
  const fPDF = at('PDF');
  const fArt = at('articulo');
  const fFunc = at('Funciona') - 4;
  const plats = [
    { t: 'Web', f: at('web'), i: <IcGlobe size={40} w={1.8} /> },
    { t: 'iPhone', f: at('iPhone'), i: <Apple size={40} /> },
    { t: 'Android', f: at('Android'), i: <Android size={42} /> },
  ];
  const fSync = at('sincroniza');
  const c1 = spring({ frame: frame - fBib, fps, config: { damping: 18, stiffness: 140 } });
  const c2 = spring({ frame: frame - fConv, fps, config: { damping: 18, stiffness: 140 } });
  const lift = interpolate(frame, [fFunc - 6, fFunc + 14], [0, 1], { ...clamp, easing: easeInOut });
  const sync = spring({ frame: frame - fSync + 2, fps, config: { damping: 14, stiffness: 150 } });
  const chip = (t: string, f: number, icon: React.ReactNode) => {
    const s = spring({ frame: frame - f + 3, fps, config: { damping: 14, stiffness: 190 } });
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>{icon}{t}</div>
    );
  };
  const cardStyle = (s: number): React.CSSProperties => ({ width: 760, background: '#fff', borderRadius: 34, padding: 30, boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + 0.06 * s})`, filter: `blur(${(1 - s) * 6}px)`, display: 'flex', flexDirection: 'column', gap: 22 });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 46, transform: `translateY(${-lift * 70}px) scale(${1 - lift * 0.1})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <ERLogo width={380} />
          <Words text="hace dos cosas" start={3} size={70} weight={500} />
        </div>
        <div style={{ display: 'flex', gap: 46 }}>
          <div style={cardStyle(c1)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 44, fontWeight: 700 }}><Num n={1} /><IcHeadphones size={44} w={1.8} />Audiolibros</div>
            <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${color.line}` }}>
              <Crop src={app('21_search_cien')} x={360} y={258} w={1340} h={520} width={698} zoom={1 + 0.04 * (frame / 400)} />
            </div>
          </div>
          <div style={cardStyle(c2)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 44, fontWeight: 700 }}><Num n={2} /><IcFile size={44} w={1.8} />Tus textos, <Highlight start={fConv + 16}>en audio</Highlight></div>
            <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', border: `1px solid ${color.line}` }}>
              <Crop src={st(frame < fConv + 30 ? 'rd_s_6' : 'rd_s_8')} x={600} y={262} w={720} h={480} width={698} />
              <div style={{ position: 'absolute', left: 18, bottom: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
                {chip('PDF', fPDF, <IcFile size={26} c="#fff" w={2.2} />)}
                {frame >= fArt - 6 && <svg width="34" height="20" viewBox="0 0 34 20" style={{ opacity: spring({ frame: frame - fArt + 6, fps }) }}><path d="M2 10h26M22 4l7 6-7 6" stroke={color.ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {chip('Artículo web', fArt, <IcLink size={26} c="#fff" w={2.2} />)}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {plats.map((p, i) => {
            const s = spring({ frame: frame - p.f + 3, fps, config: { damping: 14, stiffness: 180 } });
            return (
              <React.Fragment key={p.t}>
                {i > 0 && <div style={{ width: 70, height: 4, borderRadius: 2, background: color.yellow, opacity: sync, transform: `scaleX(${sync})` }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 34px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 38, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{p.i}{p.t}</div>
              </React.Fragment>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 18, opacity: sync, transform: `scale(${0.7 + 0.3 * sync})`, fontFamily: font.sans, fontSize: 32, fontWeight: 500, color: color.ink2 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `rotate(${(frame - fSync) * 4}deg)` }}><path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" stroke={color.ink} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M17.5 2.5v4.2h-4.2M6.5 21.5v-4.2h4.2" stroke={color.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Todo sincronizado
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="logo_sting" at={2} volume={0.5} />
      <Sfx name="card_flip" at={fBib} />
      <Sfx name="card_flip" at={fConv} />
      <Sfx name="ui_pop" at={fPDF} />
      <Sfx name="ui_pop" at={fArt} />
      {plats.map((p) => <Sfx key={p.t} name="tick_soft" at={p.f} />)}
      <Sfx name="sparkle" at={fSync} volume={0.7} />
    </Stage>
  );
};

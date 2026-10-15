import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { MicIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';
import { B, LvWeb, lvw, markOn, Tile } from './common';
import { w } from './timeline';

const ID = 'Y10';

const Laptop: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></svg>
);
const WaveIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={2} strokeLinecap="round"><path d="M3 12h1M6 9v6M9 6v12M12 9v6M15 4v16M18 8v8M21 11v2" /></svg>
);

// Tachón sobre lo que NO hace falta.
const NotNeeded: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at + 4, fps, config: { damping: 14, stiffness: 190 } });
  const k = interpolate(frame, [at + 4, at + 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: 'relative', padding: '18px 40px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 46, opacity: s, transform: `scale(${0.85 + 0.15 * s})`, color: k > 0.5 ? color.muted : color.ink }}>
      {text}
      <div style={{ position: 'absolute', left: 26, right: 26, top: '50%', height: 8, marginTop: -4, borderRadius: 4, background: color.red, transformOrigin: 'left center', transform: `scaleX(${k}) rotate(-4deg)` }} />
    </div>
  );
};

// Y10 · Graba tú: sin experiencia ni prueba · ordenador, micrófono y Audacity · foro, prueba de 1 minuto, capítulo, revisión, publicado.
export const Y10Volunteer: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L10', word, n);
  const fExp = at('experiencia');
  const fPrueba = at('prueba');
  const fOrd = at('ordenador');
  const fMic = at('micrófono');
  const fProg = at('programa');
  const fAud = at('Audacity');
  const fForo = at('registras') - 8;
  const fMin = at('minuto');
  const fCap = at('eliges');
  const fRev = at('revisor');
  const fQueda = at('queda');
  const fMundo = at('mundo');
  const steps = [
    { t: 'Regístrate en el foro', f: fForo + 8 },
    { t: 'Prueba de 1 minuto', f: fMin - 10 },
    { t: 'Elige un capítulo y grábalo', f: fCap - 4 },
    { t: 'Un revisor lo escucha', f: fRev - 4 },
  ];
  const pub = spring({ frame: frame - fQueda, fps, config: { damping: 11, stiffness: 170 } });
  const fm = B['forum:Post Your 1-Minute Test Recording Here'];
  const fr = B['forum:Register'];
  return (
    <Stage tone="warm">
      <Phase from={0} to={fForo}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <Words text="¿Te animas a leer tú?" start={0} size={100} weight={700} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ fontFamily: font.sans, fontSize: 40, color: color.ink2, opacity: interpolate(frame, [fExp - 12, fExp], [0, 1], clamp) }}>No hace falta:</span>
            <NotNeeded text="Experiencia" at={fExp} />
            <NotNeeded text="Prueba de voz" at={fPrueba} />
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
            <Tile at={fOrd - 4} width={440} icon={<Laptop size={46} />} title="Un ordenador" />
            <Tile at={fMic - 4} width={500} icon={<MicIcon size={46} />} title="Un micrófono" sub="sencillo" />
            <Tile at={fProg - 4} width={560} accent icon={<WaveIcon size={46} />} title={frame >= fAud - 2 ? 'Audacity' : 'Un programa'} sub="gratuito" />
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fForo} to={dur} hold>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: -300, top: 0, width: 1920, height: 1080 }}>
            <LvWeb states={[{ at: 0, src: lvw('forum') }]} url="forum.librivox.org" width={1160} y={-10}
              camera={[{ f: 0, zoom: 1.0, x: 640, y: 360 }, { f: fMin - fForo - 50, zoom: 1.0, x: 640, y: 360 }, { f: fMin - fForo + 30, zoom: 1.42, x: 380, y: 330 }, { f: dur - fForo, zoom: 1.48, x: 380, y: 340 }]}
              marks={[markOn(fr, 6, fMin - fForo - 36, 8, { label: 'Register' }), markOn(fm, fMin - fForo - 30, fCap - fForo + 40, 6, { label: 'Prueba de 1 minuto' })]} />
          </div>
          <div style={{ position: 'absolute', left: 1290, top: 150, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {steps.map((s, i) => {
              const on = spring({ frame: frame - s.f, fps, config: { damping: 15, stiffness: 180 } });
              return (
                <div key={s.t} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '20px 26px', borderRadius: 26, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * 30}px)` }}>
                  <div style={{ width: 62, height: 62, borderRadius: 31, background: on > 0.5 ? color.ink : '#EEE', color: on > 0.5 ? color.yellow : color.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontFamily: font.sans, fontSize: 36, fontWeight: 700 }}>{s.t}</div>
                </div>
              );
            })}
            <div style={{ marginTop: 10, alignSelf: 'flex-start', padding: '22px 34px', borderRadius: 30, background: color.yellow, boxShadow: shadow.float, fontFamily: font.sans, opacity: pub, transform: `scale(${0.8 + 0.2 * pub}) rotate(${(1 - pub) * -6}deg)` }}>
              <div style={{ fontSize: 44, fontWeight: 700 }}>Tu voz, publicada</div>
              <div style={{ fontSize: 30, fontWeight: 500 }}>dominio público · <Highlight start={fMundo - fForo} fill="#fff">gratis para todos</Highlight></div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="pencil_strike" at={fExp + 4} />
      <Sfx name="pencil_strike" at={fPrueba + 4} />
      <Sfx name="ui_pop" at={fOrd - 2} />
      <Sfx name="ui_pop" at={fMic - 2} />
      <Sfx name="ui_pop" at={fProg - 2} />
      <Sfx name="sparkle" at={fAud} volume={0.6} />
      <Sfx name="whoosh_soft" at={fForo} />
      <Sfx name="mouse_click" at={fForo + 10} volume={0.7} />
      {steps.slice(1).map((s) => <Sfx key={s.t} name="tick" at={s.f + 2} />)}
      <Sfx name="stamp" at={fQueda + 2} />
      <Sfx name="marker" at={fMundo} />
    </Stage>
  );
};

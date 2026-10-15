import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Wave } from '../er2/AppView';
import { B, LvTag, LvWeb, lvw, markOn } from './common';
import { CLIP, clipWordAt, itemAt, itemEnd, w } from './timeline';

const ID = 'Y03';

// Edificio con columnas (biblioteca / archivo), icono genérico.
const ArchiveIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 4l9 5.5" /><path d="M4 10h16" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M3.5 18.5h17M3 21h18" />
  </svg>
);

// Un «no» tachado: anuncios, cuentas, cuotas.
const NoChip: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at + 4, fps, config: { damping: 14, stiffness: 190 } });
  const strike = interpolate(frame, [at + 2, at + 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: 'relative', padding: '26px 52px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, fontFamily: font.sans, fontWeight: 700, fontSize: 64, opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.86 + 0.14 * s})` }}>
      <span style={{ color: strike > 0.5 ? color.muted : color.ink }}>{text}</span>
      <div style={{ position: 'absolute', left: 34, right: 34, top: '50%', height: 9, marginTop: -4, borderRadius: 5, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-5deg)` }} />
    </div>
  );
};

// Y03 · Qué es: 2005, dominio público, personas reales, gratis · sin ánimo de lucro · Internet Archive · el aviso de cada capítulo.
export const Y03What: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L03', word, n);
  const f2005 = at('2005');
  const fDom = at('dominio');
  const fPers = at('personas');
  const fGratis = at('gratis');
  const fLucro = at('ánimo') - 8;
  const fAnun = at('anuncios');
  const fCuen = at('cuentas');
  const fCuot = at('cuotas');
  const fIA = at('audios') - 6;
  const fAsi = at('capítulo') - 4;
  const clipAt = itemAt(ID, 'omar_aviso');
  const clipEnd = itemEnd(ID, 'omar_aviso');
  const badge = spring({ frame: frame - f2005 + 2, fps, config: { damping: 12, stiffness: 170 } });
  const words = CLIP.omar_aviso.words;
  const idx = clipWordAt('omar_aviso', frame - clipAt);
  const archS = spring({ frame: frame - fIA, fps, config: { damping: 16, stiffness: 150 } });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fLucro}>
        <AbsoluteFill>
          <LvWeb states={[{ at: 0, src: lvw('home') }]} width={1480} y={40}
            camera={[{ f: 0, zoom: 1.0, x: 640, y: 360 }, { f: fDom, zoom: 1.12, x: 640, y: 330 }, { f: fGratis + 30, zoom: 1.12, x: 640, y: 420 }]}
            marks={[markOn(B['home:Free public domain audiobooks'], fDom - 4, fPers - 6, 10, { label: 'Dominio público' }),
              markOn(B['home:Read by volunteers from around the world.'], fPers - 4, fGratis - 6, 10, { label: 'Personas reales' }),
              markOn(B['home:p:LibriVox audiobooks are free for anyone'], fGratis - 4, fLucro + 10, 10, { label: 'Gratis para todos' })]} />
          <div style={{ position: 'absolute', left: 1500, top: 64, transform: `rotate(5deg) scale(${badge})`, padding: '18px 34px', borderRadius: 26, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 54, boxShadow: shadow.float, lineHeight: 1 }}>
            Desde 2005
            <div style={{ fontSize: 26, fontWeight: 500, marginTop: 8 }}>más de 20 años</div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fLucro} to={fIA}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60 }}>
          <Words text="Sin ánimo de lucro" start={2} size={104} weight={700} />
          <div style={{ display: 'flex', gap: 34 }}>
            <NoChip text="Anuncios" at={fAnun - fLucro} />
            <NoChip text="Cuentas" at={fCuen - fLucro} />
            <NoChip text="Cuotas" at={fCuot - fLucro} />
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fIA} to={clipAt - 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, padding: '40px 64px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, transform: `scale(${0.9 + 0.1 * archS})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArchiveIcon size={96} /></div>
            <div style={{ fontFamily: font.sans }}>
              <div style={{ fontSize: 34, color: color.ink2, fontWeight: 500 }}>Los audios los aloja</div>
              <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: -2 }}>Internet Archive</div>
              <div style={{ fontSize: 32, color: color.ink2 }}>gratis y de forma permanente</div>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 500, color: color.ink2, opacity: interpolate(frame, [fAsi, fAsi + 18], [0, 1], { ...clamp, easing: easeInOut }) }}>Y cada capítulo empieza así…</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={clipAt - 6} to={dur} hold>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ width: 160, height: 160, borderRadius: 80, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${18 + Math.sin(frame / 5) * 6}px rgba(255,202,5,0.25)` }}>
            <Wave on={frame < clipEnd} bars={5} h={70} />
          </div>
          <div style={{ width: 1500, textAlign: 'center', fontFamily: font.serif, fontSize: 74, lineHeight: 1.25, color: color.ink }}>
            «{words.map(([, , t], i) => (
              <span key={i} style={{ color: i <= idx ? color.ink : 'rgba(16,16,16,0.22)' }}>
                {i === 13 || i === 14 ? <Highlight start={6 + Math.round(words[13][0] * 50)} dur={14}>{t}</Highlight> : t}{i < words.length - 1 ? ' ' : ''}
              </span>
            ))}»
          </div>
        </AbsoluteFill>
      </Phase>
      <LvTag at={clipAt + 6} until={clipEnd + 8} voice="Omar Mojica" y={900} />

      <Sfx name="ui_pop" at={f2005} />
      <Sfx name="marker" at={fDom} />
      <Sfx name="marker" at={fPers} />
      <Sfx name="marker" at={fGratis} />
      <Sfx name="whoosh_soft" at={fLucro} />
      <Sfx name="pencil_strike" at={fAnun + 2} />
      <Sfx name="pencil_strike" at={fCuen + 2} />
      <Sfx name="pencil_strike" at={fCuot + 2} />
      <Sfx name="card_flip" at={fIA + 2} />
      <Sfx name="whoosh_soft" at={clipAt - 6} volume={0.6} />
    </Stage>
  );
};

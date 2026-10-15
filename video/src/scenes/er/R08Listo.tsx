import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Phone } from '../../components/Phone';
import { Typewriter } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';
import { partAt, wf } from './timeline';
import { ERLogo } from './common';
import { IcCheck, IcDownload, IcGlobe, IcLink, IcPhone, IcSearch } from './icons';

// R08 · Paso 5: «¡Listo! Tu prueba ya está activa.» + «Descarga la app de ElevenReader, entra con la misma cuenta y busca tu libro.»
export const R08Listo: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bAt = partAt('R08', 'R08B');
  const at = (w: string, n = 0) => bAt + wf('R08B', w, n);
  const fDesc = at('Descarga');
  const fMisma = at('misma');
  const fBusca = at('busca');
  const fActiva = lead + wf('R08A', 'activa');
  const sp = (f: number, d = 15, s = 170) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: s } });

  const ok = sp(2, 12, 190);
  const ring = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: easeOut });
  const phone = sp(fDesc - 4, 18, 140);
  const st1 = sp(fDesc + 6), st2 = sp(fDesc + 11);
  const link = sp(fMisma - 4);
  const lineP = interpolate(frame, [fMisma - 2, fMisma + 14], [0, 1], { ...clamp, easing: easeOut });
  const cover = sp(fBusca + 26, 16, 150);
  return (
    <Stage tone="warm">
      {/* ¡Listo!: prueba activada */}
      <Phase from={0} to={fDesc + 2} noIn out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
          <div style={{ position: 'relative', width: 220, height: 220, transform: `scale(${0.6 + 0.4 * ok})`, opacity: ok }}>
            <div style={{ position: 'absolute', inset: -40 * ring, borderRadius: '50%', border: `6px solid ${color.yellow}`, opacity: 1 - ring }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 80px rgba(255,202,5,0.45)' }}>
              <IcCheck size={130} w={2.6} />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: color.ink, letterSpacing: -2, opacity: sp(6), transform: `translateY(${(1 - sp(6)) * 30}px)` }}>Prueba activada</div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 38, color: color.ink2, opacity: sp(Math.max(12, fActiva - 4)) }}>30 días de ElevenReader Ultra</div>
        </AbsoluteFill>
      </Phase>

      {/* Descarga la app · misma cuenta · busca tu libro */}
      <Phase from={fDesc} to={dur} out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 110 }}>
            <div style={{ opacity: phone, transform: `translateY(${(1 - phone) * 60}px) rotate(${(1 - phone) * -4}deg)` }}>
              <Phone height={640}>
                <AbsoluteFill style={{ background: '#fff', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 }}>
                  {frame < fBusca + 18 ? (
                    <ERLogo width={220} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', padding: '70px 22px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 22 }}>
                      <div style={{ height: 48, borderRadius: 24, background: '#F2F2F2', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontFamily: font.sans, fontSize: 22, color: color.ink }}>
                        <IcSearch size={22} /> <Typewriter text="Niebla" start={fBusca + 20} cps={9} />
                      </div>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', opacity: cover, transform: `translateY(${(1 - cover) * 30}px)` }}>
                        <Img src={staticFile('er/img/niebla.jpg')} style={{ width: 92, height: 138, borderRadius: 8, boxShadow: shadow.soft }} />
                        <div style={{ fontFamily: font.sans }}>
                          <div style={{ fontWeight: 700, fontSize: 24, color: color.ink }}>Niebla (Nivola)</div>
                          <div style={{ fontSize: 19, color: color.ink2, marginTop: 4 }}>Miguel de Unamuno</div>
                        </div>
                      </div>
                    </div>
                  )}
                </AbsoluteFill>
              </Phone>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: 760 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink, letterSpacing: -1, opacity: sp(fDesc), transform: `translateX(${(1 - sp(fDesc)) * 40}px)` }}>Descarga la app</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[['App Store', st1], ['Google Play', st2]].map(([label, s]) => (
                  <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 30px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 32, opacity: s as number, transform: `scale(${0.8 + 0.2 * (s as number)})` }}>
                    <IcDownload size={30} c="#fff" /> {label as string}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, opacity: link, transform: `translateY(${(1 - link) * 30}px)` }}>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcGlobe size={44} /></div>
                <div style={{ width: 110, height: 6, borderRadius: 3, background: '#E6E6E6', overflow: 'hidden' }}><div style={{ width: `${lineP * 100}%`, height: '100%', background: color.yellow }} /></div>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcLink size={42} /></div>
                <div style={{ width: 110, height: 6, borderRadius: 3, background: '#E6E6E6', overflow: 'hidden' }}><div style={{ width: `${lineP * 100}%`, height: '100%', background: color.yellow }} /></div>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcPhone size={44} /></div>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2, opacity: link }}>Entra con la <b style={{ color: color.ink }}>misma cuenta</b> que en la web</div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="success" at={2} />
      <Sfx name="sparkle" at={8} volume={0.7} />
      <Sfx name="whoosh_soft" at={fDesc} />
      <Sfx name="ui_pop" at={fDesc + 6} volume={0.7} />
      <Sfx name="ui_pop" at={fDesc + 11} volume={0.7} />
      <Sfx name="snap_in" at={fMisma} volume={0.8} />
      <Sfx name="typing" at={fBusca + 20} trimAfter={40} />
      <Sfx name="pop" at={fBusca + 26} volume={0.7} />
    </Stage>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { MicIcon, CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp, easeOut, fmtEs } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import { Grow } from '../../components/Grow';
import { textWidth } from '../../lib/measure';
import env from '../../../public/elt/audio/ctc_4_env.json';

// Muestra aleatoria de 199 audiolibros (research/el-libro-total/plataforma.md §4.2).
const NARR = [
  { n: 'Álvaro Gómez Zafra', c: 70 },
  { n: 'Hernando Iván Cano', c: 28 },
  { n: 'Maritza Castro', c: 19 },
  { n: 'Rocío Tavera', c: 19 },
  { n: 'Omar Barrera', c: 15 },
  { n: 'Fernán Astahiza', c: 15 },
];

const Level: React.FC<{ label: string; lufs: number; at: number; h: number }> = ({ label, lufs, at, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + 24], [0, 1], { ...clamp, easing: easeOut });
  const wob = 1 + Math.sin(frame / 3 + h) * 0.03;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: spring({ frame: frame - at, fps }) }}>
      <div style={{ width: 120, height: 320, borderRadius: 22, background: '#F0F0F0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: `${h * p * wob}%`, background: `linear-gradient(0deg, ${color.yellow}, #FFE27A)` }} />
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 38, fontWeight: 700 }}>−{fmtEs(Math.abs(lufs), 1)} LUFS</div>
      <div style={{ fontFamily: font.sans, fontSize: 30, color: color.ink2, textAlign: 'center', width: 300 }}>{label}</div>
    </div>
  );
};

// V07 · Voces humanas, quién narra, sin elección de voz, calidad técnica y volumen desigual.
export const H07Voices: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V07', w, n, fb);
  const fHum = at('humanas', 0, 1.44);
  const fEquipo = at('pequeño', 0, 2.56) - 6;
  const fAlv = at('Alvaro', 0, 5.44);
  const fTres = at('tres', 0, 7.48);
  const fHer = at('Hernando', 0, 9.68);
  const fElegir = at('elegir', 0, 12.76) - 8;
  const fSon = at('sonido', 0, 14.48) - 10;
  const fSuf = at('suficiente', 0, 18.04);
  const fLejos = at('lejos', 0, 19.44);
  const fVol = at('volumen', 0, 21.68) - 10;
  const max = 70;
  return (
    <Stage>
      <Phase from={0} to={fEquipo + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
          <div style={{ position: 'relative', width: 170, height: 170 }}>
            {[0, 1, 2].map((k) => {
              const ph = ((frame - 6 + k * 16) % 48) / 48;
              return frame > 6 ? <div key={k} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${color.yellow}`, transform: `scale(${1 + ph * 0.9})`, opacity: (1 - ph) * 0.55 }} /> : null;
            })}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 85, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(255,202,5,0.45)', transform: `scale(${spring({ frame, fps, config: { damping: 10 } })})` }}><MicIcon size={100} /></div>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 130, letterSpacing: -3 }}>Voces <Highlight start={fHum}>humanas</Highlight></div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fEquipo} to={fSon}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <div style={{ width: 1080, background: '#fff', borderRadius: 36, padding: '44px 54px', boxShadow: shadow.card, border: `1px solid ${color.line}` }}>
            <div style={{ fontFamily: font.sans, fontSize: 28, letterSpacing: 5, color: color.muted, fontWeight: 500, marginBottom: 22 }}>QUIÉN NARRA · MUESTRA DE 199 AUDIOLIBROS</div>
            {NARR.map((r, i) => {
              const p = interpolate(frame - fEquipo, [10 + i * 4, 40 + i * 4], [0, r.c / max], { ...clamp, easing: easeOut });
              const hi = (i === 0 && frame >= fAlv && frame < fHer) || (i === 1 && frame >= fHer);
              return (
                <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 14px', margin: '0 -14px', borderRadius: 16, background: hi ? color.yellowSoft : 'transparent', transform: `scale(${hi ? 1.02 : 1})` }}>
                  <div style={{ width: 380, fontFamily: font.sans, fontSize: 36, fontWeight: hi ? 700 : 500 }}>{r.n}</div>
                  <div style={{ flex: 1, height: 26, borderRadius: 13, background: '#F0F0F0' }}>
                    <div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 13, background: hi ? color.yellow : color.ink }} />
                  </div>
                  <div style={{ width: 70, textAlign: 'right', fontFamily: font.sans, fontSize: 34, fontWeight: 700 }}>{Math.round(p * max)}</div>
                </div>
              );
            })}
          </div>
          <Grow at={fTres - fEquipo - 8} w={520} gap={90} rise={0}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: 520 }}>
            {frame >= fTres - 4 && (
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, lineHeight: 1, transform: `scale(${spring({ frame: frame - fTres + 4, fps, config: { damping: 12 } })})` }}>
                <Highlight start={fTres + 4 - fEquipo}>1 de cada 3</Highlight>
                <div style={{ fontSize: 34, fontWeight: 500, color: color.ink2, marginTop: 14 }}>los lee Álvaro Gómez Zafra</div>
              </div>
            )}
            {frame >= fElegir && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 30px', borderRadius: 26, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 40, fontWeight: 500, transform: `translateY(${(1 - spring({ frame: frame - fElegir, fps })) * 30}px)`, opacity: spring({ frame: frame - fElegir, fps }) }}>
                <CrossIcon size={50} /> No puedes elegir voz
              </div>
            )}
          </div>
          </Grow>
        </AbsoluteFill>
      </Phase>

      <Phase from={fSon} to={fVol + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 220 }}>
            {Array.from({ length: 72 }).map((_, i) => {
              const t = (frame - fSon) / fps;
              const idx = Math.max(0, Math.floor((t * 0.9 + i * 0.05) * 50) + 400);
              const v = (env as number[])[idx % (env as number[]).length] ?? 0;
              return <div key={i} style={{ width: 12, height: 14 + v * 200, borderRadius: 6, background: i % 9 === 0 ? color.yellow : color.ink, opacity: 0.85 }} />;
            })}
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {['MP3', '64 kbps', 'Mono', '44,1 kHz'].map((t, i) => {
              const s = spring({ frame: frame - fSon - 10 - i * 4, fps, config: { damping: 14 } });
              return <div key={t} style={{ padding: '18px 36px', borderRadius: 999, background: i === 1 ? color.yellow : '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 46, fontWeight: 700, opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}>{t}</div>;
            })}
          </div>
          <div style={{ display: 'flex', fontFamily: font.sans, fontSize: 40, fontWeight: 500 }}>
            <Grow at={fSuf - fSon - 6} w={48 + 14 + textWidth('Suficiente para voz', 40, 500) + 4} first rise={24}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}><CheckIcon size={48} /> Suficiente para voz</div>
            </Grow>
            <Grow at={fLejos - fSon - 6} w={48 + 14 + textWidth('No es calidad de estudio', 40, 500) + 4} gap={48} rise={24}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}><CrossIcon size={48} /> No es calidad de estudio</div>
            </Grow>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fVol} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
          <Words text="El volumen cambia de un libro a otro" size={72} weight={700} start={2} />
          <div style={{ display: 'flex', gap: 90, alignItems: 'flex-end' }}>
            <Level label="Crimen y castigo" lufs={-13.6} at={10} h={92} />
            <Level label="Gerona" lufs={-13.3} at={16} h={95} />
            <Level label="El plomo en la entraña" lufs={-17.7} at={22} h={58} />
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="ui_pop" at={4} />
      <Sfx name="hit_soft" at={5} volume={0.5} />
      <Sfx name="marker" at={fHum} />
      <Sfx name="swipe" at={fEquipo} />
      {NARR.map((r, i) => <Sfx key={r.n} name="tick_soft" at={fEquipo + 12 + i * 4} volume={0.45} />)}
      <Sfx name="focus" at={fAlv} />
      <Sfx name="snap_in" at={fTres - 4} />
      <Sfx name="marker" at={fTres + 4} volume={0.85} />
      <Sfx name="focus" at={fHer} />
      <Sfx name="fail" at={fElegir} />
      <Sfx name="whoosh_soft" at={fSon} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="ui_tap" at={fSon + 10 + i * 4} volume={0.6} />)}
      <Sfx name="success" at={fSuf} />
      <Sfx name="fail" at={fLejos} />
      <Sfx name="swipe" at={fVol} />
      {[10, 16, 22].map((d) => <Sfx key={d} name="tick_soft" at={fVol + d} volume={0.6} />)}
    </Stage>
  );
};

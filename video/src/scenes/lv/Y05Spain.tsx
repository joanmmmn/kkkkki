import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { LogoIcon } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut } from '../../lib/anim';
import { B, Cover, CropLv } from './common';
import { w } from './timeline';

const ID = 'Y05';

// Y05 · Ojo fuera de EE. UU.: el aviso de LibriVox · en España, la mayoría libres, pero no todos · «Platero y yo», hasta 2039.
export const Y05Spain: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L05', word, n);
  const fEEUU = at('Estados');
  const fPais = at('comprobar');
  const fEsp = at('España') - 6;
  const fLibres = at('libres');
  const fNo = at('todos');
  const fPlat = at('Platero') - 8;
  const f2039 = at('dos');
  const noticeS = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 140 } });
  const tr = spring({ frame: frame - fPais + 4, fps, config: { damping: 16, stiffness: 160 } });
  const usaS = spring({ frame: frame - fEEUU + 2, fps, config: { damping: 14, stiffness: 180 } });
  const n = B['book:notice'];
  const yS = spring({ frame: frame - fLibres + 4, fps, config: { damping: 15, stiffness: 170 } });
  const nS = spring({ frame: frame - fNo + 2, fps, config: { damping: 13, stiffness: 190 } });
  const cS = spring({ frame: frame - fPlat - 4, fps, config: { damping: 14, stiffness: 140 } });
  const yr = spring({ frame: frame - f2039, fps, config: { damping: 11, stiffness: 190 } });
  const flip = interpolate(frame, [f2039 + 6, f2039 + 30], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fEsp}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 70 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: noticeS, transform: `translateY(${(1 - noticeS) * 40}px) rotate(-1.5deg)` }}>
            <div style={{ fontFamily: font.sans, fontSize: 28, color: color.ink2, fontWeight: 500 }}>El aviso de cada ficha de LibriVox</div>
            <div style={{ boxShadow: shadow.card, borderRadius: 18, background: '#fff', padding: 10 }}>
              <CropLv name="book" box={[n[0] - 4, n[1] - 4, n[2] + 8, n[3] + 8]} width={620} radius={12} />
            </div>
          </div>
          <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 46, fontWeight: 700, opacity: usaS, transform: `translateX(${(1 - usaS) * 40}px)` }}>
              <CheckIcon size={58} /> Dominio público en EE. UU.
            </div>
            <div style={{ padding: '30px 38px', borderRadius: 32, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 42, lineHeight: 1.25, fontWeight: 500, boxShadow: shadow.float, opacity: tr, transform: `translateY(${(1 - tr) * 40}px) scale(${0.94 + 0.06 * tr})` }}>
              «Si no estás en EE. UU., <b style={{ color: color.yellow }}>comprueba los derechos en tu país</b> antes de descargar.»
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fEsp} to={fPlat}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 46 }}>
          <Words text="¿Y en España?" start={0} size={96} weight={700} />
          <div style={{ fontFamily: font.sans, fontSize: 36, color: color.ink2, marginTop: -24 }}>80 años desde la muerte del autor (si murió antes de 1987)</div>
          <div style={{ display: 'flex', gap: 34 }}>
            <div style={{ width: 720, padding: '34px 42px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: yS, transform: `translateY(${(1 - yS) * 40}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontSize: 46, fontWeight: 700 }}><CheckIcon size={56} /> La mayoría, libres</div>
              <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, marginTop: 12 }}>Cervantes, Bécquer, Galdós, Pardo Bazán, Clarín…</div>
            </div>
            <div style={{ width: 560, padding: '34px 42px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: nS, transform: `translateY(${(1 - nS) * 40}px) scale(${0.9 + 0.1 * nS})` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontSize: 46, fontWeight: 700 }}><CrossIcon size={56} /> Pero no todos</div>
              <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, marginTop: 12 }}>autores muertos en 1946 o después</div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fPlat} to={dur} hold>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 80 }}>
          <div style={{ opacity: cS, transform: `translateY(${(1 - cS) * 80}px) rotate(${-4 + (1 - cS) * -8}deg)` }}><Cover id="9920" size={420} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontFamily: font.sans }}>
            <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>Platero y yo</div>
            <div style={{ fontSize: 36, color: color.ink2 }}>Juan Ramón Jiménez · murió en 1958</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 38, fontWeight: 500, marginTop: 10 }}><CheckIcon size={48} /> En LibriVox: libre en EE. UU.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 38, fontWeight: 500 }}><CrossIcon size={48} /> En España, con derechos</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6, opacity: yr, transform: `scale(${0.8 + 0.2 * yr})`, transformOrigin: 'left center' }}>
              <span style={{ fontSize: 40, fontWeight: 500, color: color.ink2 }}>libre en</span>
              <span style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}><Highlight start={f2039 - fPlat + 10}>2039</Highlight></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, fontSize: 26, color: color.ink2, alignSelf: 'flex-start', opacity: flip }}>
              <LogoIcon size={30} /> En SonorBooks: comprueba la situación de cada obra en España
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="paper_slide" at={4} />
      <Sfx name="tick" at={fEEUU} />
      <Sfx name="card_flip" at={fPais - 4} />
      <Sfx name="whoosh_soft" at={fEsp} />
      <Sfx name="tick" at={fLibres} />
      <Sfx name="cross" at={fNo} />
      <Sfx name="card_flip" at={fPlat + 4} />
      <Sfx name="impact" at={f2039} volume={0.7} />
      <Sfx name="marker" at={f2039 + 10} />
    </Stage>
  );
};

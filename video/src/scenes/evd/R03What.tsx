import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BookIcon, HeadphonesIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { CalendarIcon, CardIcon, DocIcon, EverandBadge, PodcastIcon, SCRIBD_TEAL } from './ui';

const L = 560;
const R = 900;
const H = 430;

const Item: React.FC<{ icon: (c: string) => React.ReactNode; label: string; at: number; light: number }> = ({ icon, label, at, light }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 190 } });
  const ink = light > 0.5 ? color.ink : '#fff';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: 250 }}>
      <div style={{ width: 132, height: 132, borderRadius: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: light > 0.5 ? (s > 0.05 ? color.yellowSoft : '#F4F4F4') : 'rgba(255,255,255,0.14)', transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, s) * Math.PI)})` }}>
        {icon(ink)}
      </div>
      <div style={{ height: 50, fontFamily: font.sans, fontSize: 42, fontWeight: 700, color: ink, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{label}</div>
    </div>
  );
};

// R03 · En 2023 Scribd se partió en dos: Scribd (documentos) y Everand (ebooks, audiolibros, podcasts). Desde 2025, cada uno se paga aparte.
export const R03What: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R03', w, n, fb);
  const fYear = at('2023', 0, 1.12) - 6;
  const fScribd = at('Scribd', 0, 2.8) - 8;
  const fCrack = at('partio', 0, 3.56);
  const fSplit = at('dos', 0, 4.32) - 4;
  const fScribd2 = at('Scribd', 1, 4.88);
  const fDocs = at('documentos', 0, 6.36);
  const fEverand = at('Everand', 1, 7.32);
  const fEbooks = at('ebooks', 0, 8.16);
  const fAudio = at('audiolibros', 0, 9.0);
  const fPod = at('podcasts', 0, 10.12);
  const f2025 = at('2025', 0, 11.52) - 4;
  const fPagan = at('pagan', 0, 13.52) - 6;
  const appear = spring({ frame: frame - fScribd, fps, config: { damping: 20, stiffness: 130 } });
  const split = spring({ frame: frame - fSplit, fps, config: { damping: 16, stiffness: 110 } });
  const tilt = Math.sin(Math.min(1, split) * Math.PI) * 3;
  const light = interpolate(frame, [fSplit + 6, fSplit + 20], [0, 1], clamp);
  const crack = interpolate(frame, [fCrack, fCrack + 10], [0, 1], { ...clamp, easing: easeOut });
  const gap = 110 * split;
  const yearS = spring({ frame: frame - fYear, fps, config: { damping: 15, stiffness: 170 } });
  const flip = interpolate(frame, [f2025 - 6, f2025 + 6], [0, 1], { ...clamp, easing: easeInOut });
  const bumpL = Math.sin(Math.min(1, spring({ frame: frame - fScribd2, fps, config: { damping: 12, stiffness: 200 } })) * Math.PI) * 0.03;
  const bumpR = Math.sin(Math.min(1, spring({ frame: frame - fEverand, fps, config: { damping: 12, stiffness: 200 } })) * Math.PI) * 0.03;
  // «Everand nació…»: el icono aparece solo y deja paso a la tarjeta de Scribd.
  const birth = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 160 } });
  const birthOut = interpolate(frame, [fScribd - 6, fScribd + 6], [0, 1], { ...clamp, easing: easeInOut });
  const pay = spring({ frame: frame - fPagan, fps, config: { damping: 14, stiffness: 170 } });
  const card = (w: number, side: 'l' | 'r', children: React.ReactNode, bump: number) => (
    <div style={{
      position: 'relative', width: w, height: H, boxSizing: 'border-box', padding: '34px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: light > 0 ? `color-mix(in srgb, ${SCRIBD_TEAL} ${(1 - (side === 'r' ? light : light * 0)) * 100}%, #fff)` : SCRIBD_TEAL,
      borderRadius: side === 'l' ? `36px ${36 * split}px ${36 * split}px 36px` : `${36 * split}px 36px 36px ${36 * split}px`,
      boxShadow: shadow.card, transform: `rotate(${side === 'l' ? -tilt : tilt}deg) scale(${1 + bump})`,
      border: side === 'r' ? `1px solid rgba(0,0,0,${0.06 * light})` : undefined,
    }}>
      {children}
    </div>
  );
  return (
    <Stage>
      {/* Año: 2023 → 2025 */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 92 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: '#fff', borderRadius: 999, padding: '16px 40px 16px 30px', boxShadow: shadow.float, border: `1px solid ${color.line}`, opacity: yearS, transform: `translateY(${(1 - yearS) * -30}px)` }}>
          <CalendarIcon size={58} />
          <div style={{ position: 'relative', height: 70, width: 170, perspective: 400 }}>
            {['2023', '2025'].map((y, i) => {
              const r = i === 0 ? flip * 90 : (1 - flip) * -90;
              return <div key={y} style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 70, lineHeight: '70px', transform: `rotateX(${r}deg)`, opacity: Math.abs(r) < 89 ? 1 : 0, backfaceVisibility: 'hidden' }}>{y}</div>;
            })}
          </div>
          <div style={{ width: 2, height: 46, background: color.line }} />
          <div style={{ position: 'relative', width: 430, height: 50, fontFamily: font.sans, fontSize: 38, fontWeight: 500, color: color.ink2 }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - flip }}>Nace Everand</div>
            <div style={{ position: 'absolute', inset: 0, opacity: flip }}>Suscripciones separadas</div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', opacity: appear, transform: `translateY(${(1 - appear) * 60}px) scale(${0.94 + 0.06 * appear})` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            {card(L, 'l', (
              <>
                <div style={{ height: 96, display: 'flex', alignItems: 'center', opacity: light, fontFamily: font.sans, fontSize: 64, fontWeight: 700, color: '#fff' }}>Scribd</div>
                <div style={{ marginTop: 40 }}><Item icon={(c) => <DocIcon size={72} c={c} />} label="Documentos" at={fDocs} light={0} /></div>
              </>
            ), bumpL)}
            <Tag s={pay} label="Suscripción Scribd" />
          </div>
          <div style={{ width: gap, height: H, position: 'relative' }}>
            {/* Grieta antes de separarse */}
            <svg width={60} height={H} viewBox={`0 0 60 ${H}`} style={{ position: 'absolute', left: -30, top: 0, opacity: 1 - split, zIndex: 3 }}>
              <path d={`M30 0 L22 60 L38 120 L20 190 L40 260 L24 330 L36 380 L30 ${H}`} stroke="#fff" strokeWidth={7} fill="none" strokeLinejoin="round" strokeDasharray={H * 1.3} strokeDashoffset={H * 1.3 * (1 - crack)} />
            </svg>
            <div style={{ position: 'absolute', left: '50%', top: H + 20, transform: `translateX(-50%) scale(${pay})`, fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.red }}>≠</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            {card(R, 'r', (
              <>
                <div style={{ height: 96, display: 'flex', alignItems: 'center', opacity: light }}><EverandBadge size={84} /></div>
                <div style={{ marginTop: 40, display: 'flex', gap: 14 }}>
                  <Item icon={(c) => <BookIcon size={72} c={c} />} label="Ebooks" at={fEbooks} light={light} />
                  <Item icon={(c) => <HeadphonesIcon size={72} c={c} />} label="Audiolibros" at={fAudio} light={light} />
                  <Item icon={(c) => <PodcastIcon size={72} c={c} />} label="Podcasts" at={fPod} light={light} />
                </div>
              </>
            ), bumpR)}
            <Tag s={pay} label="Suscripción Everand" />
          </div>
          {/* Cabecera única «Scribd» mientras es una sola empresa */}
          <div style={{ position: 'absolute', left: 0, top: 34, width: L + gap + R, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - light, pointerEvents: 'none', fontFamily: font.sans, fontSize: 70, fontWeight: 700, color: '#fff' }}>Scribd</div>
        </div>
      </AbsoluteFill>

      {birthOut < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 70, opacity: Math.min(1, birth * 1.3) * (1 - birthOut) }}>
          <div style={{ transform: `scale(${(0.6 + 0.4 * birth) * (1 - 0.3 * birthOut)})`, filter: birthOut > 0.01 ? `blur(${birthOut * 10}px)` : undefined }}><EverandBadge size={170} /></div>
        </AbsoluteFill>
      )}
      <Sfx name="logo_sting" at={2} volume={0.7} />
      <Sfx name="ui_pop" at={fYear} />
      <Sfx name="whoosh_soft" at={fScribd} />
      <Sfx name="draw" at={fCrack} />
      <Sfx name="impact" at={fSplit + 2} volume={0.8} />
      <Sfx name="swipe" at={fSplit + 4} />
      <Sfx name="tick_soft" at={fScribd2} />
      <Sfx name="pop" at={fDocs} />
      <Sfx name="tick_soft" at={fEverand} />
      <Sfx name="pop" at={fEbooks} />
      <Sfx name="pop" at={fAudio} volume={1.05} />
      <Sfx name="pop" at={fPod} volume={1.1} />
      <Sfx name="card_flip" at={f2025} />
      <Sfx name="coins" at={fPagan + 2} volume={0.8} />
    </Stage>
  );
};

const Tag: React.FC<{ s: number; label: string }> = ({ s, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: color.ink, color: '#fff', borderRadius: 999, padding: '14px 30px 14px 22px', fontFamily: font.sans, fontSize: 34, fontWeight: 700, opacity: s, transform: `translateY(${(1 - s) * -30}px) scale(${0.8 + 0.2 * s})`, boxShadow: shadow.float }}>
    <CardIcon size={40} c={color.yellow} /> {label}
  </div>
);

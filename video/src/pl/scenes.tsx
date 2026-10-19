import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { clamp, easeInOut, easeOut } from '../lib/anim';
import { MaskTitle, LinkBadge } from '../scenes/nxr/kit';
import { CheckIcon, CrossIcon } from '../components/Icons';
import { LogoIcon } from '../components/Logo';
import { Sfx } from '../components/Sfx';
import {
  AppleLogo, cueFrame, Device, GooglePlayLogo, Icon, MpStage, PlatformLogo, PlatformTile, PopCard, SceneCtx, SceneHead, Stars, Tag, TagStack, useSpring,
} from './kit';
import type {
  DevicesScene, FeaturesScene, HookScene, IntroScene, OutroScene, PlansScene, ProsConsScene, RatingsScene, RecScene, SceneSpec, StatScene, StepsScene, VerdictScene,
} from './types';

type P<T> = { c: SceneCtx; s: T };
const fmtPl = (n: number, d = 0) => n.toFixed(d).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Las tomas de escritorio miden 16:9 + barra; las de móvil, 430×932.
const isMobile = (s: { rec?: { mobile?: boolean }; cuts?: { rec: { mobile?: boolean } }[] }) => Boolean(s.rec?.mobile ?? s.cuts?.[0]?.rec.mobile);

const FadeLabel: React.FC<{ at: number; text: string; c: string; size?: number; caps?: boolean; style?: React.CSSProperties }> = ({ at, text, c, size = 26, caps = true, style }) => {
  const p = useSpring(at, 16, 170);
  return (
    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: caps ? 3 : -0.5, textTransform: caps ? 'uppercase' : 'none', color: c, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, ...style }}>{text}</div>
  );
};

// ——— Gancho ———
const Hook: React.FC<P<HookScene>> = ({ c, s }) => {
  const frame = useCurrentFrame();
  const tileP = useSpring(10, 13, 150);
  const devP = useSpring(2, 16, 120);
  const mobile = isMobile(s);
  const float = Math.sin(frame / 38) * 8;
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 0, bottom: 0, width: mobile ? 1000 : 860, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26, opacity: useSpring(0, 18, 160) }}>
            <PlatformTile spec={c.spec} size={64} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: color.ink2 }}>{s.badge ?? `${c.spec.kicker} · 2026`}</span>
          </div>
          <MaskTitle text={s.title} at={4} size={mobile ? 124 : 112} hi={s.hi ?? [c.spec.name]} />
          <TagStack c={c} tags={s.promises} size={34} gap={16} style={{ marginTop: 44 }} />
        </div>
        <div style={{ position: 'absolute', right: mobile ? 210 : 90, top: '50%', transform: `translateY(calc(-50% + ${(1 - devP) * 120 + float}px)) scale(${0.94 + 0.06 * devP})`, opacity: devP }}>
          <Device c={c} rec={s.rec} cuts={s.cuts} width={mobile ? 390 : 860} tilt={mobile ? -10 : -9} />
          <div style={{ position: 'absolute', left: mobile ? -70 : -60, bottom: -50, transform: `scale(${tileP}) rotate(${(1 - tileP) * -18}deg)` }}>
            <PlatformTile spec={c.spec} size={150} />
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.7} />
      <Sfx name="pop" at={11} volume={0.6} />
    </MpStage>
  );
};

// ——— Qué es ———
const Intro: React.FC<P<IntroScene>> = ({ c, s }) => {
  const logoP = useSpring(3, 15, 150);
  const frame = useCurrentFrame();
  const bigAt = s.big ? cueFrame(c, s.big.at) : 0;
  const bigP = useSpring(bigAt, 14, 150);
  const count = s.big ? s.big.value * interpolate(frame, [bigAt, bigAt + 40], [0, 1], { ...clamp, easing: easeOut }) : 0;
  const hasDevice = Boolean(s.rec || s.cuts?.length);
  const mobile = isMobile(s);
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 0, bottom: 0, width: hasDevice ? 760 : 900, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SceneHead c={c} kicker={s.kicker ?? 'Czym jest'} at={2} style={{ marginBottom: 26 }} />
          <div style={{ opacity: logoP, transform: `translateY(${(1 - logoP) * 30}px)`, marginBottom: 48 }}>
            <PlatformLogo spec={c.spec} width={Math.min(520, 150 / c.spec.logoRatio)} />
          </div>
          <TagStack c={c} tags={s.facts} size={36} gap={18} />
        </div>
        {hasDevice && (
          <div style={{ position: 'absolute', right: mobile ? 260 : 100, top: '50%', transform: 'translateY(-50%)' }}>
            <Device c={c} rec={s.rec} cuts={s.cuts} width={mobile ? 380 : 900} tilt={mobile ? -8 : -6} />
          </div>
        )}
        {s.big && (
          <div style={{ position: 'absolute', right: hasDevice ? 560 : 200, top: hasDevice ? 690 : 330, opacity: bigP, transform: `scale(${0.8 + 0.2 * bigP}) rotate(${(1 - bigP) * 4}deg)`,
            background: color.ink, color: '#fff', borderRadius: 32, padding: '30px 46px', boxShadow: '0 40px 90px rgba(16,16,16,0.3)' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 108, letterSpacing: -4, lineHeight: 1 }}>
              {s.big.prefix ?? ''}{fmtPl(count, s.big.decimals ?? 0)}<span style={{ color: color.yellow }}>{s.big.suffix ?? ''}</span>
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: 'rgba(255,255,255,0.78)', marginTop: 8 }}>{s.big.label}</div>
          </div>
        )}
      </AbsoluteFill>
      {s.big && <Sfx name="counter" at={bigAt} dur={40} volume={0.6} />}
    </MpStage>
  );
};

// ——— Precios ———
const Plans: React.FC<P<PlansScene>> = ({ c, s }) => {
  const n = s.plans.length;
  const w = n >= 4 ? 390 : n === 3 ? 470 : n === 2 ? 560 : 660;
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker ?? 'Cennik'} title={s.title ?? 'Ile to kosztuje?'} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', gap: 34, alignItems: 'stretch' }}>
          {s.plans.map((p, i) => {
            const at = cueFrame(c, p.at);
            return (
              <PopCard key={i} at={at} style={{ width: w, padding: '36px 38px 34px', position: 'relative', border: p.best ? `4px solid ${color.yellow}` : `1px solid ${color.line}` }}>
                {(p.best || p.badge) && (
                  <div style={{ position: 'absolute', top: -24, left: 34, background: color.yellow, color: color.ink, borderRadius: 999, padding: '8px 20px', fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
                    {p.badge ?? 'Najpopularniejszy'}
                  </div>
                )}
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: c.spec.deep }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 10, marginTop: 10 }}>
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: n >= 4 ? 66 : n === 3 ? 76 : 88, letterSpacing: -3, color: color.ink, whiteSpace: 'nowrap' }}>{p.price}</span>
                  <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, whiteSpace: 'nowrap' }}>{p.period}</span>
                </div>
                {p.note && <div style={{ fontFamily: font.sans, fontSize: 24, color: color.muted, marginTop: 4 }}>{p.note}</div>}
                <div style={{ height: 1, background: color.line, margin: '22px 0 18px' }} />
                {p.features.map((f, k) => {
                  const neg = f.startsWith('!');
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontFamily: font.sans, fontSize: n >= 4 ? 25 : 27, lineHeight: 1.25, color: neg ? color.ink2 : color.ink, marginTop: k ? 12 : 0 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}>{neg ? <CrossIcon size={28} /> : <CheckIcon size={28} c={color.green} />}</span>{neg ? f.slice(1) : f}
                    </div>
                  );
                })}
                <Sfx name="ui_pop" at={at} volume={0.7} />
              </PopCard>
            );
          })}
        </div>
        {s.footer && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 22 }}>
            {s.footer.map((t, i) => <Tag key={i} c={c} t={t} size={32} />)}
          </div>
        )}
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Grabación con marcas y etiquetas ———
const Rec: React.FC<P<RecScene>> = ({ c, s }) => {
  const mobile = isMobile(s);
  const right = (s.side ?? 'left') === 'left';
  const devP = useSpring(0, 18, 140);
  const devW = mobile ? 400 : 1160;
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <div style={{ position: 'absolute', [right ? 'left' : 'right']: mobile ? 330 : 100, top: mobile ? '50%' : 210, transform: mobile ? `translateY(-50%) translateY(${(1 - devP) * 60}px)` : `translateY(${(1 - devP) * 60}px)`, opacity: devP }}>
          <Device c={c} rec={s.rec} cuts={s.cuts} width={devW} marks={s.marks} zooms={s.zooms} tilt={mobile ? (right ? 8 : -8) : 0} />
        </div>
        <SceneHead c={c} kicker={s.kicker} title={s.title} style={{ position: 'absolute', [right ? 'left' : 'right']: mobile ? 130 : 100, top: mobile ? 90 : 70, ...(mobile ? { width: 600 } : {}) }} />
        {s.tags && (
          <TagStack c={c} tags={s.tags} size={34} gap={18}
            style={{ position: 'absolute', [right ? 'left' : 'right']: mobile ? 900 : 1300, [right ? 'right' : 'left']: 60, top: mobile ? 330 : 300 }} />
        )}
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Funciones (rejilla de iconos) ———
const Features: React.FC<P<FeaturesScene>> = ({ c, s }) => {
  const cols = s.cols ?? (s.items.length <= 4 ? 2 : 3);
  const w = (1660 - (cols - 1) * 30) / cols;
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker} title={s.title} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ position: 'absolute', left: 130, right: 130, top: 300, display: 'flex', flexWrap: 'wrap', gap: 30 }}>
          {s.items.map((t, i) => {
            const at = cueFrame(c, t.at);
            return (
              <PopCard key={i} at={at} style={{ width: w, padding: '28px 30px', display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: t.tone === 'bad' ? '#FDE3E3' : c.spec.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={t.icon ?? 'check'} size={48} c={t.tone === 'bad' ? color.red : c.spec.deep} />
                </div>
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, lineHeight: 1.1 }}>{t.label}</div>
                  {t.sub && <div style={{ fontFamily: font.sans, fontSize: 25, color: color.ink2, marginTop: 6, lineHeight: 1.25 }}>{t.sub}</div>}
                </div>
                <Sfx name="ui_pop" at={at} volume={0.6} />
              </PopCard>
            );
          })}
        </div>
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Cifra grande ———
const Stat: React.FC<P<StatScene>> = ({ c, s }) => {
  const frame = useCurrentFrame();
  const at = cueFrame(c, s.at);
  const p = useSpring(at, 13, 150);
  const value = s.count ? fmtPl(s.count.from + (s.count.to - s.count.from) * interpolate(frame, [at, at + 36], [0, 1], { ...clamp, easing: easeOut }), s.count.decimals ?? 0) : s.value;
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <SceneHead c={c} kicker={s.kicker} title={s.title} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ opacity: p, transform: `scale(${0.7 + 0.3 * p})`, display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 40 }}>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 260, letterSpacing: -12, lineHeight: 1, color: color.ink }}>{value}</span>
          {s.unit && <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: c.spec.deep }}>{s.unit}</span>}
        </div>
        <div style={{ height: 22, width: 420 * p, background: color.yellow, borderRadius: 11, marginTop: -6 }} />
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 46, color: color.ink2, marginTop: 30, opacity: p, textAlign: 'center', maxWidth: 1400 }}>{s.label}</div>
        {s.tags && <div style={{ display: 'flex', gap: 22, marginTop: 50, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1600 }}>{s.tags.map((t, i) => <Tag key={i} c={c} t={t} size={32} />)}</div>}
      </AbsoluteFill>
      <Sfx name={s.count ? 'counter' : 'hit_soft'} at={at} dur={s.count ? 36 : undefined} volume={0.7} />
    </MpStage>
  );
};

// ——— Dispositivos ———
const Devices: React.FC<P<DevicesScene>> = ({ c, s }) => {
  const n = s.items.length;
  const w = Math.min(300, (1660 - (n - 1) * 24) / n);
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker ?? 'Urządzenia'} title={s.title ?? 'Gdzie posłuchasz?'} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {s.items.map((t, i) => {
            const at = cueFrame(c, t.at);
            return (
              <PopCard key={i} at={at} style={{ width: w, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative', opacity: t.ok ? 1 : 0.92 }}>
                <Icon name={t.icon ?? 'phone'} size={92} c={t.ok ? color.ink : color.muted} />
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: t.ok ? color.ink : color.muted, textAlign: 'center', padding: '0 14px', lineHeight: 1.15 }}>{t.label}</div>
                {t.sub && <div style={{ fontFamily: font.sans, fontSize: 21, color: color.ink2, textAlign: 'center', padding: '0 14px', marginTop: -10 }}>{t.sub}</div>}
                <div style={{ position: 'absolute', top: -18, right: -18 }}>{t.ok ? <CheckIcon size={52} /> : <CrossIcon size={52} />}</div>
                <Sfx name={t.ok ? 'tick_soft' : 'cross'} at={at} volume={0.6} />
              </PopCard>
            );
          })}
        </div>
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Opiniones ———
const Ratings: React.FC<P<RatingsScene>> = ({ c, s }) => {
  const frame = useCurrentFrame();
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker ?? 'Opinie'} title={s.title ?? 'Co mówią użytkownicy?'} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ position: 'absolute', left: 130, top: 300, display: 'flex', flexDirection: 'column', gap: 30, width: 760 }}>
          {s.stores.map((st, i) => {
            const at = cueFrame(c, st.at);
            const v = st.rating * interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: easeOut });
            return (
              <PopCard key={i} at={at} from="left" style={{ padding: '30px 36px', display: 'flex', alignItems: 'center', gap: 30 }}>
                {st.store === 'google' ? <GooglePlayLogo size={86} /> : <AppleLogo size={86} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink2 }}>{st.store === 'google' ? 'Google Play' : 'App Store'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 6 }}>
                    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>{fmtPl(v, 1)}</span>
                    <div>
                      <Stars value={st.rating} size={38} fill={interpolate(frame, [at, at + 30], [0, 1], clamp)} />
                      <div style={{ fontFamily: font.sans, fontSize: 25, color: color.muted, marginTop: 6 }}>{st.count}</div>
                    </div>
                  </div>
                </div>
                <Sfx name="counter" at={at} dur={30} volume={0.5} />
              </PopCard>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 990, right: 80, top: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {s.likes.length > 0 && <FadeLabel at={cueFrame(c, s.likes[0].at) - 4} text="Chwalą" c={color.green} />}
          {s.likes.map((t, i) => <Tag key={`l${i}`} c={c} t={{ ...t, tone: 'good' }} size={32} />)}
          {s.dislikes.length > 0 && <FadeLabel at={cueFrame(c, s.dislikes[0].at) - 4} text="Krytykują" c={color.red} style={{ marginTop: 22 }} />}
          {s.dislikes.map((t, i) => <Tag key={`d${i}`} c={c} t={{ ...t, tone: 'bad' }} size={32} />)}
          {s.notes && s.notes.length > 0 && <FadeLabel at={cueFrame(c, s.notes[0].at) - 4} text="Uwaga" c={color.ink2} style={{ marginTop: s.likes.length || s.dislikes.length ? 22 : 0 }} />}
          {s.notes?.map((t, i) => <Tag key={`n${i}`} c={c} t={t} size={32} />)}
        </div>
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Lo bueno y lo malo ———
const ProsCons: React.FC<P<ProsConsScene>> = ({ c, s }) => {
  const col = (title: string, tone: 'good' | 'bad', list: typeof s.pros, x: number) => {
    const at = list.length ? cueFrame(c, list[0].at) - 8 : 0;
    return (
      <PopCard at={at} from={tone === 'good' ? 'left' : 'right'} style={{ position: 'absolute', left: x, top: 270, width: 790, minHeight: 560, padding: '36px 40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          {tone === 'good' ? <CheckIcon size={54} /> : <CrossIcon size={54} />}
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.5, color: tone === 'good' ? color.green : color.red }}>{title}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map((t, i) => <Tag key={i} c={c} t={{ ...t, tone }} size={31} />)}
        </div>
      </PopCard>
    );
  };
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker ?? c.spec.name} title={s.title ?? 'Plusy i minusy'} style={{ position: 'absolute', left: 130, top: 70 }} />
        {col('Plusy', 'good', s.pros, 130)}
        {col('Minusy', 'bad', s.cons, 1000)}
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Veredicto ———
const Verdict: React.FC<P<VerdictScene>> = ({ c, s }) => {
  const altAt = s.alts ? cueFrame(c, s.alts.at) : 0;
  const altP = useSpring(altAt, 15, 160);
  const list = (title: string, tone: 'good' | 'bad', items: typeof s.yes, x: number) => (
    <div style={{ position: 'absolute', left: x, top: 330, width: 800 }}>
      <FadeLabel at={items.length ? cueFrame(c, items[0].at) - 6 : 99999} text={title} c={tone === 'good' ? color.green : color.red} size={40} caps={false} style={{ marginBottom: 20 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{items.map((t, i) => <Tag key={i} c={c} t={{ ...t, tone }} size={32} />)}</div>
    </div>
  );
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 90 }}>
          <MaskTitle text={s.question ?? `Czy warto płacić\nza ${c.spec.name}?`} at={4} size={84} hi={[c.spec.name.split(' ')[0]]} />
        </div>
        {list('Tak, jeśli…', 'good', s.yes, 130)}
        {list('Raczej nie, jeśli…', 'bad', s.no, 1000)}
        {s.alts && (
          <div style={{ position: 'absolute', left: 130, right: 130, bottom: 80, display: 'flex', alignItems: 'center', gap: 20, opacity: altP, transform: `translateY(${(1 - altP) * 30}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2 }}>{s.alts.label ?? 'Porównaj z:'}</span>
            {s.alts.names.map((n) => (
              <span key={n} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, padding: '12px 26px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft }}>{n}</span>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Pasos ———
const Steps: React.FC<P<StepsScene>> = ({ c, s }) => {
  const frame = useCurrentFrame();
  const ats = s.steps.map((st) => cueFrame(c, st.at));
  let active = -1;
  ats.forEach((a, i) => { if (frame >= a - 4) active = i; });
  const cuts = s.steps.filter((st) => st.rec).map((st) => ({ at: st.at, rec: st.rec! }));
  const baseRec = s.rec;
  const mobile = Boolean((baseRec ?? cuts[0]?.rec)?.mobile);
  const hasDevice = Boolean(baseRec || cuts.length);
  return (
    <MpStage tint={c.spec.color}>
      <AbsoluteFill>
        <SceneHead c={c} kicker={s.kicker} title={s.title} style={{ position: 'absolute', left: 130, top: 86 }} />
        <div style={{ position: 'absolute', left: 130, top: 290, width: hasDevice ? (mobile ? 900 : 640) : 1300, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {s.steps.map((st, i) => {
            const at = ats[i];
            const p = interpolate(frame, [at - 6, at + 10], [0, 1], { ...clamp, easing: easeOut });
            const on = i === active;
            const done = i < active;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 22, opacity: frame < at - 6 ? 0.28 : done ? 0.62 : 1, transform: `translateX(${(1 - p) * -20}px)` }}>
                <div style={{ width: 66, height: 66, borderRadius: 33, flexShrink: 0, background: on ? color.yellow : done ? color.ink : '#fff', color: done ? '#fff' : color.ink, border: on || done ? 'none' : `2px solid ${color.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32, boxShadow: on ? `0 0 0 ${8 * p}px rgba(255,202,5,0.25)` : undefined }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: color.ink }}>{st.title}</div>
                  {st.sub && <div style={{ fontFamily: font.sans, fontSize: 27, lineHeight: 1.3, color: color.ink2, marginTop: 6 }}>{st.sub}</div>}
                </div>
                <Sfx name="tick_soft" at={at} volume={0.6} />
              </div>
            );
          })}
          {s.note && <div style={{ marginTop: 16 }}><Tag c={c} t={{ tone: 'accent', icon: 'lock', ...s.note }} size={30} /></div>}
        </div>
        {hasDevice && (
          <div style={{ position: 'absolute', right: mobile ? 220 : 90, top: mobile ? '50%' : 250, transform: mobile ? 'translateY(-50%)' : undefined }}>
            <Device c={c} rec={baseRec} cuts={cuts} width={mobile ? 390 : 1060} marks={s.marks} tilt={mobile ? -8 : 0} />
          </div>
        )}
      </AbsoluteFill>
    </MpStage>
  );
};

// ——— Cierre ———
export const SIGN_LEN = 150;
const Outro: React.FC<P<OutroScene>> = ({ c, s }) => {
  const frame = useCurrentFrame();
  const ctaAt = cueFrame(c, s.ctaAt);
  const signAt = cueFrame(c, s.signAt) - 6;
  const away = interpolate(frame, [signAt - 4, signAt + 12], [0, 1], { ...clamp, easing: easeInOut });
  const signP = useSpring(signAt + 4, 14, 140);
  const lineP = interpolate(frame, [signAt + 10, signAt + 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <MpStage tint={color.yellow}>
      <AbsoluteFill style={{ opacity: 1 - away, transform: `scale(${1 - 0.04 * away})`, filter: away > 0.02 ? `blur(${(away * 8).toFixed(1)}px)` : undefined }}>
        {s.rec && (
          <div style={{ position: 'absolute', left: 100, top: 230 }}>
            <Device c={c} rec={s.rec} width={1040} />
          </div>
        )}
        <div style={{ position: 'absolute', left: s.rec ? 1210 : 260, right: 90, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <MaskTitle text={s.cta} at={ctaAt} size={s.rec ? 66 : 96} hi={['sonorbooks.pl']} />
          <div style={{ marginTop: 34 }}><LinkBadge at={ctaAt + 24} label="Link w opisie" size={30} /></div>
          {s.tags && <TagStack c={c} tags={s.tags} size={30} gap={14} style={{ marginTop: 30 }} />}
        </div>
      </AbsoluteFill>
      {frame >= signAt - 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 170 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: signP, transform: `scale(${0.85 + 0.15 * signP})` }}>
            <LogoIcon size={130} playScale={0.6 + 0.4 * signP} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -4, color: color.ink }}>SonorBooks</span>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 48, color: color.ink2, marginTop: 26, opacity: lineP, transform: `translateY(${(1 - lineP) * 16}px)` }}>Twoja następna historia już na ciebie czeka.</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, marginTop: 18, opacity: lineP, padding: '8px 26px', borderRadius: 999, background: color.yellow }}>sonorbooks.pl</div>
        </AbsoluteFill>
      )}
      <Sfx name="logo_sting" at={signAt + 4} volume={0.8} />
    </MpStage>
  );
};

export const SceneView: React.FC<{ c: SceneCtx; s: SceneSpec }> = ({ c, s }) => {
  switch (s.kind) {
    case 'hook': return <Hook c={c} s={s} />;
    case 'intro': return <Intro c={c} s={s} />;
    case 'plans': return <Plans c={c} s={s} />;
    case 'rec': return <Rec c={c} s={s} />;
    case 'features': return <Features c={c} s={s} />;
    case 'stat': return <Stat c={c} s={s} />;
    case 'devices': return <Devices c={c} s={s} />;
    case 'ratings': return <Ratings c={c} s={s} />;
    case 'proscons': return <ProsCons c={c} s={s} />;
    case 'verdict': return <Verdict c={c} s={s} />;
    case 'steps': return <Steps c={c} s={s} />;
    case 'outro': return <Outro c={c} s={s} />;
  }
};

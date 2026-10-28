import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Kicker } from '../nxr/App';
import { Burst, LinkBadge } from '../nxr/kit';
import { CNL_COMPONENTS } from './registry';
import { hasVO, speechFrames, vid, voText, wf } from './timeline';
import { doneAt, PlatVideo, scenesOf, startsOf, totalOf, VScene } from './videos';
import { color, font, MaskTitle, MpStage, PKey, PLAT, PlatTile, shadow, Stamp, StepList } from './kit';
import { OV, SceneShell } from './Main';

// v2 (Joan, 28/10/2026): «Empieza directamente los vídeos con: Para cancelar la suscripción de X…, dale más dinamismo a cada vídeo
// y que sea todo de más calidad; la promo de SonorBooks, mejor metida: las mejores pruebas exclusivas, rápido pero con el máximo
// dinamismo, calidad y conversión».

const WEB_K: PKey[] = ['audible', 'spotify', 'audiobooks'];

// ——— Arranque: la escena entra ya en marcha (la cámara se aleja del panel con desenfoque y un destello) ———
const OpenReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: easeOut });
  const flash = interpolate(frame, [0, 6], [0.5, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.13 - 0.13 * p})`, transformOrigin: '72% 46%', filter: p < 0.98 ? `blur(${((1 - p) * 6).toFixed(2)}px)` : undefined }}>{children}</AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: '#fff', opacity: flash }} />}
    </AbsoluteFill>
  );
};

// ——— Tramo de la plataforma (la cancelación real) y el sello «Cancelada» al acabar ———
const SegScene: React.FC<{ v: PlatVideo; s: VScene }> = ({ v, s }) => {
  const frame = useCurrentFrame();
  const C = CNL_COMPONENTS[s.id];
  const at = doneAt(v);
  const web = WEB_K.includes(v.k);
  const sx = web ? 640 : 560, sy = web ? 560 : 610;
  const dim = interpolate(frame, [at - 4, at + 6], [0, 1], { ...clamp, easing: easeOut });
  return (
    <>
      <C lead={s.lead} dur={s.dur} enter="rise" exit="none" />
      {frame >= at - 6 && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: sx - 520, top: sy - 420, width: 1040, height: 840, background: 'radial-gradient(closest-side, rgba(255,255,255,0.78), rgba(255,255,255,0))', opacity: dim }} />
          <div style={{ position: 'absolute', left: sx, top: sy, width: 0, height: 0 }}><Stamp at={at} size={360} /></div>
          <Burst at={at + 3} x={sx} y={sy} r={260} n={34} seed={`done${v.k}`} colors={['#E5484D', color.yellow, '#FFFFFF', '#E5484D']} />
        </AbsoluteFill>
      )}
      <Sfx name="stamp" at={at + 2} volume={0.8} />
      <Sfx name="success" at={at + 6} volume={0.45} />
    </>
  );
};

// ——— Tiendas (sin voz, rápido): si pagas por Google Play o el App Store, se cancela allí ———
const PathCard: React.FC<{ at: number; title: string; sub: string; steps: string[]; x: number; every: number }> = ({ at, title, sub, steps, x, every }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 190 } });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: 360, width: 780, padding: '38px 46px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
      opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 90}px) rotate(${(1 - s) * (x < 900 ? -4 : 4)}deg) scale(${0.9 + 0.1 * s})` }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1 }}>{title}</div>
      <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, marginBottom: 24 }}>{sub}</div>
      <StepList steps={steps.map((label, i) => ({ at: at + 6 + i * every, label }))} size={34} width={690} gap={8} />
    </div>
  );
};
const StoreScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const warn = 104;
  const ws = spring({ frame: frame - warn, fps, config: { damping: 10, stiffness: 230, mass: 0.7 } });
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 92 }}>
          <Kicker at={0} text="¿Pagas por la tienda?" />
          <MaskTitle text="Google Play o App Store: se cancela allí" hi="allí" at={2} size={76} stagger={2} />
        </div>
        <PathCard at={14} x={130} title="Android" sub="Google Play" every={6} steps={['Google Play › tu perfil', 'Pagos y suscripciones', 'Suscripciones › la app', 'Cancelar suscripción']} />
        <PathCard at={26} x={1010} title="iPhone" sub="App Store" every={6} steps={['Ajustes › tu nombre', 'Suscripciones › la app', 'Cancelar suscripción']} />
        {frame >= warn - 1 && (
          <div style={{ position: 'absolute', left: 960, top: 930, transform: `translate(-50%, -50%) rotate(${(1 - ws) * -6 - 1.5}deg) scale(${1.6 - 0.6 * ws})`, opacity: Math.min(1, ws * 2),
            padding: '18px 40px', borderRadius: 22, background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 50, letterSpacing: -0.5, whiteSpace: 'nowrap',
            boxShadow: '0 24px 60px rgba(229,72,77,0.35)' }}>
            Borrar la app <span style={{ textDecoration: 'underline', textDecorationThickness: 5, textUnderlineOffset: 8 }}>no</span> cancela nada
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="card_flip" at={13} volume={0.5} />
      <Sfx name="card_flip" at={25} volume={0.5} />
      <Sfx name="impact" at={warn + 2} volume={0.45} />
      {dur > 0 && null}
    </MpStage>
  );
};

// ——— Promo de SonorBooks: las mejores pruebas gratis, algunas exclusivas ———
type Trial = { big: string; unit: [string, string]; from?: number; badge?: 'Exclusiva' | 'Con nuestro enlace'; note?: string };
// Lo que enseña hoy sonorbooks.com/es/plataformas (comprobado el 28/10/2026): Nextory, 30 días con nuestro enlace (14 sin él);
// ElevenReader, 30 días de Ultra con nuestro enlace (3 sin él); Storytel, 30 días con nuestro enlace; Podimo y Audible, 30 días.
const TRIAL: Partial<Record<PKey, Trial>> = {
  nextory: { big: '30', unit: ['días', 'gratis'], from: 14, badge: 'Exclusiva' },
  elevenreader: { big: '30', unit: ['días', 'de Ultra'], from: 3, badge: 'Exclusiva' },
  storytel: { big: '30', unit: ['días', 'gratis'], badge: 'Con nuestro enlace', note: 'Sin límite de horas' },
  podimo: { big: '30', unit: ['días', 'gratis'] },
  audible: { big: '30', unit: ['días', 'gratis'] },
};
const TrialCard: React.FC<{ k: PKey; at: number; featAt: number; x: number; y: number; rot: number; feat: boolean; strikeAt: number }> = ({ k, at, featAt, x, y, rot, feat, strikeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TRIAL[k]!;
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 170 } });
  const f = feat ? spring({ frame: frame - featAt, fps, config: { damping: 11, stiffness: 180 } }) : 0;
  const strike = t.from ? interpolate(frame, [strikeAt, strikeAt + 10], [0, 1], clamp) : 0;
  const glow = feat ? interpolate(frame, [featAt, featAt + 6, featAt + 30], [0, 1, 0.55], clamp) : 0;
  if (frame < at - 1) return null;
  const W = 380, H = 236;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, zIndex: feat ? 2 : 1,
      transform: `translate(${(1 - s) * 420}px, ${(1 - s) * -60 + Math.sin((frame + x) / 23) * 5}px) rotate(${rot * s + (1 - s) * 18 + Math.sin((frame + y) / 31) * 0.8}deg) scale(${(0.8 + 0.2 * s) * (1 + 0.1 * f)})`, opacity: Math.min(1, s * 1.6) }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: '#fff', border: `${feat ? 4 : 1}px solid ${feat ? color.yellow : color.line}`,
        boxShadow: `${shadow.card}${glow > 0 ? `, 0 0 0 ${(glow * 14).toFixed(1)}px rgba(255,202,5,${(0.35 * glow).toFixed(2)})` : ''}`, padding: '26px 28px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <PlatTile k={k} size={64} />
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, letterSpacing: -0.5 }}>{PLAT[k].name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
          {t.from && (
            <span style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.muted }}>
              {t.from}
              <span style={{ position: 'absolute', left: -5, right: -5, top: '52%', height: 6, borderRadius: 3, background: color.red, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: 'left' }} />
            </span>
          )}
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: -4, color: color.ink, lineHeight: 0.9 }}>{t.big}</span>
          <span style={{ display: 'flex', flexDirection: 'column', fontFamily: font.sans, fontWeight: 700, fontSize: 28, lineHeight: 1.05, color: color.ink, whiteSpace: 'nowrap' }}>
            <span>{t.unit[0]}</span><span style={{ color: color.ink2 }}>{t.unit[1]}</span>
          </span>
        </div>
        {t.note && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 22, color: color.ink2, marginTop: 6 }}>{t.note}</div>}
      </div>
      {t.badge && (
        <div style={{ position: 'absolute', right: -14, top: -18, padding: '9px 18px', borderRadius: 999, background: t.badge === 'Exclusiva' ? color.ink : color.yellow,
          color: t.badge === 'Exclusiva' ? color.yellow : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: t.badge === 'Exclusiva' ? 2 : 0,
          textTransform: t.badge === 'Exclusiva' ? 'uppercase' : 'none', transform: `rotate(6deg) scale(${spring({ frame: frame - at - 8, fps, config: { damping: 10, stiffness: 240 } })})`, boxShadow: '0 10px 24px rgba(16,16,16,0.2)' }}>
          {t.badge}
        </div>
      )}
    </div>
  );
};

const PromoScene: React.FC<{ v: PlatVideo; lead: number; dur: number }> = ({ v, lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = v.promo;
  const w = (x: string, n = 0) => lead + wf(id, x, n);
  const q = PROMO_Q[v.k];
  const say = voText(id);
  const named = say.includes(PLAT[v.feat].name);
  const fSonor = w('SonorBooks'), fMej = w('mejores');
  // La plataforma destacada brilla cuando la voz la nombra (o, si no la nombra, con «exclusivas»).
  const fFeat = named ? w(PLAT[v.feat].name) : w('exclusivas');
  const fEnl = w('Enlace');
  // Fondo amarillo de la pregunta, que se cierra en círculo hacia el logotipo de SonorBooks.
  const wipe = interpolate(frame, [fSonor - 8, fSonor + 6], [0, 1], { ...clamp, easing: easeInOut });
  const qIn = spring({ frame: frame - 1, fps, config: { damping: 14, stiffness: 180 } });
  const logoS = spring({ frame: frame - fSonor + 2, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const cards = v.cards;
  const pos = [{ x: 1000, y: 160, r: -4 }, { x: 1420, y: 230, r: 5 }, { x: 1030, y: 470, r: 3 }, { x: 1440, y: 540, r: -5 }];
  const featIdx = cards.indexOf(v.feat);
  const cardAt = (i: number) => fMej - 6 + i * 5;
  const strikeAt = say.includes('catorce') ? w('catorce') : fFeat + 8;
  return (
    <MpStage tint={color.yellow}>
      <AbsoluteFill>
        {/* Fase 2: SonorBooks, las pruebas y el enlace */}
        {frame >= fSonor - 10 && (
          <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [fSonor, dur], [1, 1.045], clamp)})`, transformOrigin: '40% 50%' }}>
            <div style={{ position: 'absolute', left: 120, top: 150 }}>
              <div style={{ transform: `scale(${0.6 + 0.4 * logoS})`, transformOrigin: 'left center', opacity: Math.min(1, logoS * 2) }}><Logo size={92} animate={false} /></div>
              <div style={{ marginTop: 40 }}><MaskTitle text={'Las mejores\npruebas gratis'} hi="gratis" at={fMej - 4} size={104} stagger={2} /></div>
              {frame >= fFeat - 2 && (
                <div style={{ marginTop: 26, display: 'inline-block', padding: '12px 30px', borderRadius: 16, background: color.ink, color: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 50,
                  letterSpacing: 3, textTransform: 'uppercase', transform: `rotate(-3deg) scale(${1.5 - 0.5 * spring({ frame: frame - fFeat, fps, config: { damping: 10, stiffness: 260, mass: 0.6 } })})`, transformOrigin: 'left center',
                  boxShadow: '0 20px 50px rgba(16,16,16,0.25)' }}>
                  + Pruebas exclusivas
                </div>
              )}
            </div>
            {cards.map((k, i) => (
              <TrialCard key={k} k={k} at={cardAt(i)} featAt={fFeat} x={pos[i].x} y={pos[i].y} rot={pos[i].r} feat={i === featIdx} strikeAt={strikeAt} />
            ))}
            <div style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 22 }}>
              <LinkBadge at={fEnl - 2} label="Enlace en la descripción" size={42} />
            </div>
            {frame >= fEnl + 8 && (
              <div style={{ position: 'absolute', left: 1010, top: 860, display: 'flex', gap: 14, opacity: interpolate(frame, [fEnl + 8, fEnl + 18], [0, 1], clamp) }}>
                {['Pruebas gratis', 'Guía paso a paso'].map((t, i) => (
                  <div key={t} style={{ padding: '16px 28px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink,
                    transform: `translateY(${(1 - spring({ frame: frame - fEnl - 8 - i * 4, fps, config: { damping: 14, stiffness: 200 } })) * 30}px)` }}>✓ {t}</div>
                ))}
              </div>
            )}
          </AbsoluteFill>
        )}
        {/* Fase 1: la pregunta, en grande sobre amarillo */}
        {wipe < 1 && (
          <AbsoluteFill style={{ background: color.yellow, clipPath: `circle(${(1 - wipe) * 130}% at 22% 22%)` }}>
            <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30, opacity: qIn, transform: `translateY(${(1 - qIn) * 30}px)` }}>
                <PlatTile k={v.k} size={84} />
                <div style={{ padding: '10px 22px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>✓ {PLAT[v.k].name}, cancelada</div>
              </div>
              <MaskTitle text={q} at={lead - 2} size={150} stagger={3} />
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_fast" at={0} volume={0.6} />
      <Sfx name="riser" at={fSonor - 22} volume={0.35} />
      <Sfx name="impact" at={fSonor} volume={0.6} />
      <Sfx name="logo_sting" at={fSonor + 1} volume={0.35} />
      {cards.map((k, i) => <Sfx key={k} name="snap_in" at={cardAt(i) + 4} volume={0.5} />)}
      <Sfx name="sparkle" at={fFeat} volume={0.55} />
      <Sfx name="pencil_strike" at={strikeAt + 2} volume={0.45} />
      <Sfx name="ui_pop" at={fEnl} volume={0.7} />
      <Burst at={fSonor + 2} x={300} y={200} r={220} n={30} seed={`sb${v.k}`} />
      {dur > 0 && null}
    </MpStage>
  );
};
// La pregunta de cada promo (lo que dice la voz antes de «En SonorBooks»).
const PROMO_Q: Record<string, string> = {
  audible: '¿Y ahora\nqué escuchas?', storytel: '¿Buscas otra?', spotify: '¿Y tus\naudiolibros?', podimo: '¿Veinte horas\nte sabían a poco?',
  nextory: '¿Buscas otra?', bookbeat: '¿Prefieres una\napp en español?', audiobooks: '¿Buscas más\naudiolibros\nen español?', ivoox: '¿Quieres algo\nmás que pódcasts?',
};

// ——— Pantalla final: marca arriba, la web real en movimiento y la mitad de abajo libre (vídeo + suscribirse de YouTube) ———
const EndScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 160 } });
  const scroll = interpolate(frame, [10, dur], [0, 1], { ...clamp, easing: easeInOut });
  const W = 820, H = 430;
  const imgW = W, imgH = (W * 4610) / 2912;
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 600px at 50% 0%, ${color.yellowSoft}, #fff 70%)` }} />
      <div style={{ position: 'absolute', left: 150, top: 120, width: 820 }}>
        <Logo size={120} delay={4} />
        <div style={{ marginTop: 34 }}><MaskTitle text={'Las mejores pruebas gratis\nde audiolibros'} hi="gratis" at={14} size={58} stagger={2} /></div>
        <div style={{ marginTop: 30, display: 'flex', gap: 16, alignItems: 'center', opacity: spring({ frame: frame - 34, fps }) }}>
          <div style={{ padding: '14px 30px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, boxShadow: '0 10px 30px rgba(255,202,5,0.35)' }}>sonorbooks.com</div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>Enlace en la descripción</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 70, width: W, height: H, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 40px 90px rgba(16,16,16,0.18), 0 0 0 1px rgba(16,16,16,0.06)',
        opacity: Math.min(1, s * 1.4), transform: `perspective(2200px) rotateY(${-8 + 4 * s}deg) translateX(${(1 - s) * 120}px)` }}>
        <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: '#F4F4F5' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}
          <div style={{ marginLeft: 14, fontFamily: font.sans, fontSize: 16, color: color.muted }}>sonorbooks.com/es/plataformas</div>
        </div>
        <Img src={staticFile('cnl/promo/sb_plataformas_full.png')} style={{ position: 'absolute', top: 28 - scroll * (imgH * 0.52), left: 0, width: imgW, height: imgH }} />
      </div>
    </AbsoluteFill>
  );
};

export const CancelVideo: React.FC<{ v: PlatVideo }> = ({ v }) => {
  const { fps } = useVideoConfig();
  const scenes = scenesOf(v);
  const starts = startsOf(v);
  const total = totalOf(v);
  const vo: [number, number][] = scenes.flatMap((s, i) => ((s.kind === 'seg' || s.kind === 'promo') && hasVO(s.id) ? [[starts[i] + s.lead, starts[i] + s.lead + speechFrames(s.id)] as [number, number]] : []));
  const env = (f: number) => {
    let d = 0;
    for (const [a, b] of vo) d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp));
    return d;
  };
  const promoAt = starts[scenes.findIndex((s) => s.kind === 'promo')];
  const music = `music/cnl_${v.k}.mp3`;
  const musicVolume = (f: number) => {
    const fadeIn = interpolate(f, [0, 6], [0.4, 1], clamp);
    const fadeOut = interpolate(f, [total - fps * 1.2, total], [1, 0], clamp);
    // Más presente en la promo y la pantalla final (más energía), siempre por debajo de la voz.
    const lift = interpolate(f, [promoAt - 10, promoAt + 10], [1, 1.25], clamp);
    return 0.21 * lift * (1 - 0.45 * env(f)) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {scenes.map((s, i) => {
        const next = scenes[i + 1];
        const tin = i === 0 ? 'first' : s.tin;
        const tout = !next ? 'last' : next.tin;
        const over = next ? OV : 0;
        const body = (
          <>
            {s.kind === 'seg' && <SegScene v={v} s={s} />}
            {s.kind === 'store' && <StoreScene dur={s.dur} />}
            {s.kind === 'promo' && <PromoScene v={v} lead={s.lead} dur={s.dur} />}
            {s.kind === 'end' && <EndScene dur={s.dur} />}
          </>
        );
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={s.dur + over} name={`${s.kind}:${s.id}`}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              {i === 0 ? <OpenReveal>{body}</OpenReveal> : body}
            </SceneShell>
            {(!STEM || STEM === 'vo') && (s.kind === 'seg' || s.kind === 'promo') && hasVO(s.id) && (
              <Sequence from={s.lead} layout="none" name={`vo:${vid(s.id)}`}>
                <Audio src={voSrc(vid(s.id))} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      <Sfx name="whoosh_fast" at={0} volume={0.5} />
      <Sfx name="hit_soft" at={2} volume={0.5} />
      {scenes.slice(1).map((s, i) => <Sfx key={i} name={s.kind === 'end' ? 'whoosh_deep' : s.kind === 'promo' ? 'swipe' : 'transition'} at={starts[i + 1] + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />)}
      {(!STEM || STEM === 'music') && <Audio src={staticFile(music)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
export { totalOf };

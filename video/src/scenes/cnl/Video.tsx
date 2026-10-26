import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from '../../lib/anim';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { RealPhone } from '../../components/RealPhone';
import { Logo } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { Kicker } from '../nxr/App';
import { APP_RATIO, LinkBadge } from '../nxr/kit';
import { CNL_COMPONENTS } from './registry';
import { hasVO, speechFrames, wf } from './timeline';
import { PlatVideo, scenesOf, startsOf, totalOf, VScene } from './videos';
import { color, font, MaskTitle, MpStage, PKey, PLAT, PlatTile, shadow, Stamp, StepList, Tone, ToneChip } from './kit';
import { ToneIcon } from '../mp/kit';
import { OV, SceneShell } from './Main';

type Chip = { tone: Tone; label: string; sub?: string };
// Lo que promete cada entrada (aparece mientras habla) y el consejo del cierre (el de su primera frase).
const HOOK: Record<string, Chip[]> = {
  audible: [{ tone: 'info', label: 'Dónde está el botón', sub: 'En la app no lo hay' }, { tone: 'price', label: 'La oferta antes de irte', sub: 'Una pausa o un descuento' }, { tone: 'best', label: 'Qué pasa con tus libros', sub: 'Lo comprado es tuyo' }],
  storytel: [{ tone: 'info', label: 'Dónde está el botón', sub: 'La app te manda a la web' }, { tone: 'warn', label: 'Ojo con la prueba gratis', sub: 'Se acaba al momento' }],
  spotify: [{ tone: 'info', label: 'En su web, en 4 pasos' }, { tone: 'warn', label: 'Duo y Familiar', sub: 'Das de baja a todos' }, { tone: 'info', label: 'Audiolibros+', sub: 'Se cancela con Premium' }],
  podimo: [{ tone: 'info', label: 'De la app a su web', sub: 'Con la sesión iniciada' }, { tone: 'price', label: 'Oferta: 3 meses por 1 €', sub: 'Y una encuesta' }, { tone: 'warn', label: 'Cuándo pierdes el acceso', sub: 'En la prueba, al momento' }],
  nextory: [{ tone: 'info', label: 'La app no te deja', sub: 'Te llevamos por la web' }, { tone: 'price', label: 'Oferta: 15 días y 5 horas' }, { tone: 'warn', label: 'En la prueba, se corta al momento' }],
  bookbeat: [{ tone: 'info', label: 'Todo en inglés', sub: 'Te decimos qué pulsar' }, { tone: 'warn', label: 'En la prueba, en el acto' }, { tone: 'warn', label: 'No avisa antes de cobrar' }],
  audiobooks: [{ tone: 'info', label: 'Solo en la web' }, { tone: 'warn', label: 'El libro de la prueba', sub: 'Lo pierdes al cancelar' }, { tone: 'trick', label: '«Email Me Instead»', sub: 'Te avisa antes de cobrar' }],
  ivoox: [{ tone: 'info', label: 'Sin salir de la app', sub: 'Cuatro toques' }, { tone: 'best', label: '30 días más de acceso', sub: 'Desde el último cobro' }],
};
// `big`: el consejo en grande mientras la voz lo dice (con su salto de línea y la palabra subrayada); luego queda como etiqueta.
const TIP: Record<string, Chip & { big: string; hi: string; say: string }> = {
  audible: { tone: 'info', label: '¿Lo contrataste con Amazon?', sub: 'Pertenencia a programas y suscripciones', big: '¿Lo contrataste\ncon Amazon?', hi: 'Amazon', say: 'También se cancela en tu cuenta de Amazon, en «Pertenencia a programas y suscripciones».' },
  storytel: { tone: 'best', label: 'Tu biblioteca te espera', sub: 'Y tu historial, si vuelves', big: 'Tu biblioteca\nte espera', hi: 'espera', say: 'Y tu historial también, si algún día vuelves.' },
  spotify: { tone: 'best', label: 'En Free conservas tus listas', sub: 'Y tu música guardada', big: 'En Free conservas\ntus listas', hi: 'listas', say: 'Y tu música guardada: solo pierdes lo de Premium.' },
  podimo: { tone: 'best', label: 'Con Gratis, sus pódcasts abiertos', sub: 'Puedes seguir escuchándolos', big: 'Con el plan Gratis,\nsus pódcasts abiertos', hi: 'Gratis', say: 'Puedes seguir escuchándolos sin pagar.' },
  nextory: { tone: 'best', label: 'Tu biblioteca se guarda', sub: 'Por si vuelves', big: 'Tu biblioteca\nse guarda', hi: 'guarda', say: 'Por si algún día vuelves.' },
  bookbeat: { tone: 'best', label: 'Libros y marcadores, guardados', sub: 'Por si vuelves', big: 'Tus libros y marcadores,\nguardados', hi: 'guardados', say: 'Por si algún día vuelves.' },
  audiobooks: { tone: 'trick', label: 'Si reactivas, recuperas los libros', sub: 'Los que te quitaron al cancelar', big: 'Si reactivas la cuenta,\nrecuperas los libros', hi: 'recuperas', say: 'Los que te quitaron al cancelar vuelven a tu biblioteca.' },
  ivoox: { tone: 'info', label: 'Los apoyos van aparte', sub: 'Se cancelan en «Mis apoyos»', big: 'Los apoyos a pódcasts\nvan aparte', hi: 'aparte', say: 'Se cancelan por separado, en Ajustes › «Mis apoyos».' },
};
const TONE_BG: Record<Tone, string> = { best: color.yellow, trick: '#1F9D55', warn: '#E5484D', info: '#fff', price: color.ink };
// Pantalla de la baja ya hecha (real, sin datos personales) para la entrada.
const DONE: Record<string, { src: string; web?: boolean }> = {
  audible: { src: 'cnl/still/audible.jpg' }, storytel: { src: 'cnl/still/storytel.jpg' }, podimo: { src: 'cnl/still/podimo.jpg' },
  nextory: { src: 'cnl/still/nextory.jpg' }, bookbeat: { src: 'cnl/still/bookbeat.jpg' }, ivoox: { src: 'cnl/still/ivoox.jpg' },
  spotify: { src: 'cnl/web/spo_done.png', web: true }, audiobooks: { src: 'cnl/web/abc_done.png', web: true },
};

// Entrada: «Cómo cancelar X», lo que vas a ver y la pantalla real de la baja, que recibe el sello.
const HookScene: React.FC<{ v: PlatVideo; lead: number; dur: number }> = ({ v, lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = speechFrames(v.hook);
  const chips = HOOK[v.k];
  const chipAt = (i: number) => lead + Math.round(sp * (0.28 + (0.62 * i) / Math.max(1, chips.length)));
  const stampAt = lead + sp - 8;
  const d = DONE[v.k];
  const ph = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const fy = Math.sin(frame / 40) * 6;
  return (
    <MpStage tint={PLAT[v.k as PKey].c}>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 150 }}>
          <Kicker at={2} text="Tutorial · paso a paso" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 16 }}>
            <PlatTile k={v.k as PKey} size={110} style={{ transform: `scale(${0.8 + 0.2 * ph})` }} />
          </div>
          <MaskTitle text={`Cómo cancelar\n${v.name}`} hi="cancelar" at={6} size={104} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, marginTop: 44 }}>
            {chips.map((c, i) => <ToneChip key={i} at={chipAt(i)} tone={c.tone} label={c.label} sub={c.sub} size={38} />)}
          </div>
        </div>
        <div style={{ position: 'absolute', left: d.web ? 1060 : 1260, top: d.web ? 300 + fy : 90 + fy, opacity: ph, transform: `translateX(${(1 - ph) * 80}px)` }}>
          {d.web ? (
            <div style={{ width: 760, borderRadius: 14, overflow: 'hidden', boxShadow: '0 50px 100px rgba(16,16,16,0.22), 0 0 0 1px rgba(16,16,16,0.06)', background: '#F6F6F7', transform: 'perspective(2000px) rotateY(-10deg) rotateZ(2deg)' }}>
              <div style={{ height: 26, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}</div>
              <div style={{ width: 760, height: 380, overflow: 'hidden', position: 'relative' }}>
                <Img src={staticFile(d.src)} style={{ position: 'absolute', width: 1456 * 1.25, left: -(v.k === 'spotify' ? 470 : 330) * 1.25, top: -(v.k === 'spotify' ? 60 : 90) * 1.25 }} />
              </div>
            </div>
          ) : (
            <RealPhone w={390} ratio={APP_RATIO} rotX={4} rotY={-14} rotZ={3} screenBg="#000">
              <Img src={staticFile(d.src)} style={{ width: 390, height: 390 * APP_RATIO, display: 'block' }} />
            </RealPhone>
          )}
          <div style={{ position: 'absolute', left: d.web ? 380 : 200, top: d.web ? 300 : 600, width: 260, height: 260, transform: 'translate(-50%, -50%)' }}><Stamp at={stampAt} size={260} /></div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={0} volume={0.5} />
      {chips.map((c, i) => <Sfx key={i} name={c.tone === 'warn' ? 'tick_soft' : 'ui_pop'} at={chipAt(i) + 1} volume={0.6} />)}
      <Sfx name="stamp" at={stampAt + 2} volume={0.7} />
    </MpStage>
  );
};

const PathCard: React.FC<{ at: number; title: string; sub: string; steps: string[]; x: number; every: number }> = ({ at, title, sub, steps, x, every }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: 380, width: 780, padding: '40px 46px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s})` }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>{title}</div>
      <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, marginBottom: 26 }}>{sub}</div>
      <StepList steps={steps.map((label, i) => ({ at: at + 10 + i * every, label }))} size={34} width={690} gap={8} />
    </div>
  );
};

// Tiendas (sin voz): si pagas por Google Play o el App Store, se cancela allí; borrar la app no cancela.
const StoreScene: React.FC<{ dur: number }> = () => (
  <MpStage>
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 130, top: 96 }}>
        <Kicker at={2} text="¿Pagas por la tienda?" />
        <MaskTitle text="Google Play o App Store: se cancela allí" hi="allí" at={4} size={72} />
        <div style={{ marginTop: 18 }}><Words text="Si te suscribiste desde la tienda, no busques el botón en la app." start={20} stagger={2} size={36} weight={500} color={color.ink2} align="left" /></div>
      </div>
      <PathCard at={40} x={130} title="Android" sub="Google Play" every={16} steps={['Abre Google Play', 'Tu perfil', 'Pagos y suscripciones', 'Suscripciones › la app', 'Cancelar suscripción']} />
      <PathCard at={64} x={1010} title="iPhone" sub="App Store" every={16} steps={['Ajustes', 'Tu nombre', 'Suscripciones › la app', 'Cancelar suscripción']} />
      <div style={{ position: 'absolute', left: 130, top: 940 }}>
        <ToneChip at={170} tone="warn" label="Borrar la app no cancela nada" sub="Sigues pagando hasta que canceles" size={38} />
      </div>
    </AbsoluteFill>
    <Sfx name="whoosh_soft" at={0} volume={0.45} />
    <Sfx name="card_flip" at={38} volume={0.5} />
    <Sfx name="card_flip" at={62} volume={0.5} />
    <Sfx name="tick_soft" at={171} volume={0.6} />
  </MpStage>
);

// Cierre: el consejo propio de la plataforma, el artículo de la descripción y la pantalla final (marca arriba; abajo, YouTube).
const CloseScene: React.FC<{ v: PlatVideo; lead: number; dur: number }> = ({ v, lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (x: string, n = 0) => lead + wf(v.close, x, n);
  const fArt = w('artículo'), fSonor = w('SonorBooks');
  const p1Out = fSonor - 16;
  const tip = TIP[v.k];
  const bigOut = fArt - 40;
  return (
    <MpStage tint={PLAT[v.k as PKey].c}>
      <Phase from={0} to={p1Out} out={10} noIn>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 130, top: 330, opacity: interpolate(frame, [bigOut - 8, bigOut + 6], [1, 0], clamp) }}>
            <div style={{ width: 108, height: 108, borderRadius: 54, background: TONE_BG[tip.tone], boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${spring({ frame: frame - lead, fps, config: { damping: 13, stiffness: 160 } })})` }}><ToneIcon tone={tip.tone} size={108} /></div>
            <div style={{ marginTop: 34 }}><MaskTitle text={tip.big} hi={tip.hi} at={lead + 4} size={92} out={bigOut} /></div>
            <div style={{ marginTop: 26, width: 1120 }}><Words text={tip.say} start={lead + 22} stagger={2} size={42} weight={500} color={color.ink2} align="left" /></div>
          </div>
          <div style={{ position: 'absolute', left: 130, top: 190 }}>
            <Kicker at={2} text="Antes de irte" />
            <ToneChip at={bigOut + 4} tone={tip.tone} label={tip.label} sub={tip.sub} size={52} />
            <div style={{ marginTop: 90 }}>
              <MaskTitle text={'Todos los pasos,\ncon capturas'} hi="capturas" at={fArt - 30} size={84} />
              <div style={{ marginTop: 34 }}><LinkBadge at={fArt - 4} label="En el artículo de la descripción" size={38} /></div>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 160, top: 300, opacity: interpolate(frame, [6, 20], [0, 1], clamp) }}>
            <PlatTile k={v.k as PKey} size={300} style={{ transform: `rotate(${Math.sin(frame / 50) * 2}deg)` }} />
          </div>
        </AbsoluteFill>
      </Phase>
      <Phase from={p1Out - 2} to={dur + 2} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 140, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={140} delay={8} />
          <Words text="Compara plataformas de audiolibros." start={20} stagger={3} size={56} weight={500} />
          <div style={{ opacity: spring({ frame: frame - p1Out - 50, fps }), marginTop: 6 }}><Pill size={38}>sonorbooks.com</Pill></div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="ui_pop" at={lead + 1} volume={0.6} />
      <Sfx name="tick_soft" at={bigOut + 5} volume={0.45} />
      <Sfx name="ui_pop" at={fArt - 3} volume={0.6} />
      <Sfx name="whoosh_soft" at={p1Out} volume={0.6} />
      <Sfx name="logo_sting" at={p1Out + 6} volume={0.8} />
    </MpStage>
  );
};

// El tramo de la plataforma del guion común, desde `skip` (la escena se dibuja igual; solo se salta su principio).
const SegScene: React.FC<{ s: VScene }> = ({ s }) => {
  const C = CNL_COMPONENTS[s.id];
  const full = s.dur + s.skip;
  return (
    <Sequence from={-s.skip} layout="none">
      <C lead={s.lead} dur={full} enter="rise" exit="none" />
    </Sequence>
  );
};

export const CancelVideo: React.FC<{ v: PlatVideo }> = ({ v }) => {
  const { fps } = useVideoConfig();
  const scenes = scenesOf(v);
  const starts = startsOf(v);
  const total = totalOf(v);
  const vo: [number, number][] = scenes.flatMap((s, i) => (s.kind === 'store' || !hasVO(s.id) ? [] : [[starts[i] + s.lead - s.skip, starts[i] + s.lead - s.skip + speechFrames(s.id)] as [number, number]]))
    .map(([a, b]) => [Math.max(0, a), b]);
  const env = (f: number) => {
    let d = 0;
    for (const [a, b] of vo) d = Math.max(d, interpolate(f, [a - 8, a, b, b + 18], [0, 1, 1, 0], clamp));
    return d;
  };
  const music = `music/cnl_${v.k}.mp3`;
  const musicVolume = (f: number) => {
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [total - fps * 1.4, total], [1, 0], clamp);
    return 0.2 * (1 - 0.45 * env(f)) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {scenes.map((s, i) => {
        const next = scenes[i + 1];
        const tin = i === 0 ? 'first' : s.tin;
        const tout = !next ? 'last' : next.tin;
        const over = next ? OV : 0;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={s.dur + over} name={`${s.kind}:${s.id}`}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>
              {s.kind === 'hook' && <HookScene v={v} lead={s.lead} dur={s.dur} />}
              {s.kind === 'seg' && <SegScene s={s} />}
              {s.kind === 'store' && <StoreScene dur={s.dur} />}
              {s.kind === 'close' && <CloseScene v={v} lead={s.lead} dur={s.dur} />}
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.kind !== 'store' && hasVO(s.id) && (
              <Sequence from={s.lead - s.skip} layout="none" name={`vo:${s.id}`}>
                <Audio src={voSrc(s.id)} volume={(f) => (s.skip > 0 ? interpolate(f, [s.skip - s.lead, s.skip - s.lead + 3], [0, 1], clamp) : 1)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {scenes.slice(1).map((s, i) => <Sfx key={i} name={s.kind === 'close' ? 'whoosh_deep' : 'transition'} at={starts[i + 1] + (s.tin === 'slide' ? 0 : 1)} volume={0.6} />)}
      {(!STEM || STEM === 'music') && <Audio src={staticFile(music)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
export { totalOf };

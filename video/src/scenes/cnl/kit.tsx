import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { CamKey, Mark } from '../../components/ScreenClip';
import { buildPhoneCam, PhoneHalo, zoomPeaks } from '../nxr/kit';
import {
  color, focusFrom, font, Focus, MaskTitle, MPhone, MpStage, MShot, PagePane, PageKey, PageMark, PH, PHONE_W, PKey, PLAT, PlatTile, SceneProps, shadow, Tap, Tone, ToneChip, WebPane,
} from '../mp/kit';

export type { SceneProps } from '../mp/kit';

// ——— Pasos de la cancelación ———
// `at`: fotograma de la escena en que la voz lo nombra. `where`: en la app o en la web (se rotula al cambiar).
export type Step = { at: number; label: string; where?: 'app' | 'web' };
export type Note = { at: number; tone: Tone; label: string; sub?: string };

const PhoneIcon: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" /><path d="M10.5 18.2h3" /></svg>
);
const GlobeIcon: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.1} strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></svg>
);
const Check: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);

// Lista numerada: cada paso entra cuando la voz lo nombra; el actual va en amarillo y los anteriores quedan marcados.
export const StepList: React.FC<{ steps: Step[]; size?: number; width: number; gap?: number }> = ({ steps, size = 36, width, gap = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let cur = -1;
  steps.forEach((s, i) => { if (frame >= s.at - 2) cur = i; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width }}>
      {steps.map((s, i) => {
        const header = s.where && (i === 0 || steps[i - 1].where !== s.where);
        const p = spring({ frame: frame - s.at + 2, fps, config: { damping: 15, stiffness: 190 } });
        const vis = frame >= s.at - 3;
        const done = i < cur;
        const act = i === cur;
        const doneP = done ? interpolate(frame, [steps[i + 1].at - 2, steps[i + 1].at + 10], [0, 1], { ...clamp, easing: easeInOut }) : 0;
        const nb = size * 1.18;
        const hp = spring({ frame: frame - s.at + 4, fps, config: { damping: 16, stiffness: 180 } });
        // v2: el paso que nombra la voz entra con rebote y un destello amarillo que se apaga.
        const pop = act ? spring({ frame: frame - s.at + 2, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } }) : 1;
        const glow = act ? interpolate(frame, [s.at - 2, s.at + 3, s.at + 22], [0, 1, 0], clamp) : 0;
        return (
          <React.Fragment key={i}>
            {header && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: i === 0 ? 0 : size * 0.4, opacity: vis ? hp : 0, transform: `translateY(${(1 - hp) * 12}px)`,
                fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.56, letterSpacing: size * 0.09, textTransform: 'uppercase', color: color.muted }}>
                {s.where === 'app' ? <PhoneIcon s={size * 0.72} c={color.muted} /> : <GlobeIcon s={size * 0.72} c={color.muted} />}
                {s.where === 'app' ? 'En la app' : 'En su web'}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.42, alignSelf: 'flex-start', padding: `${size * 0.22}px ${size * 0.56}px ${size * 0.22}px ${size * 0.22}px`, borderRadius: 999,
              background: act ? '#fff' : 'rgba(255,255,255,0)', boxShadow: act ? `${shadow.float}, 0 0 0 ${(glow * 10).toFixed(1)}px rgba(255,202,5,${(0.45 * glow).toFixed(2)})` : 'none', border: act ? `1px solid ${color.line}` : '1px solid transparent',
              opacity: vis ? Math.min(1, p * 1.3) * (1 - 0.42 * doneP) : 0, transform: `translateX(${(1 - p) * -36}px) scale(${(0.9 + 0.1 * p) * (1 - 0.03 * doneP) * (act ? 0.94 + 0.06 * pop + 0.05 * glow : 1)})`, transformOrigin: 'left center' }}>
              <div style={{ width: nb, height: nb, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? color.ink : color.yellow, color: color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.62 }}>
                {done ? <Check s={size * 0.66} c="#fff" /> : i + 1}
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -0.4, color: color.ink, lineHeight: 1.12, maxWidth: width - nb - size * 1.4 }}>{s.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// v2: barra de progreso («Paso 3 de 7»): se llena paso a paso, con el número que salta al cambiar.
const Progress: React.FC<{ steps: Step[]; size: number; width: number; at: number }> = ({ steps, size, width, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = steps.length;
  let cur = 0;
  steps.forEach((s, i) => { if (frame >= s.at - 2) cur = i + 1; });
  const last = cur > 0 ? steps[cur - 1].at - 2 : at;
  const fill = (cur - 1 + interpolate(frame, [last, last + 10], [0, 1], { ...clamp, easing: easeOut })) / n;
  const pop = spring({ frame: frame - last, fps, config: { damping: 10, stiffness: 260, mass: 0.6 } });
  const show = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.5, marginTop: size * 0.5, width, opacity: show }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.62, color: color.ink, whiteSpace: 'nowrap', transform: `scale(${cur ? 0.9 + 0.1 * pop : 1})`, transformOrigin: 'left center' }}>
        {cur ? `Paso ${cur} de ${n}` : `${n} pasos`}
      </div>
      <div style={{ flex: 1, height: size * 0.24, borderRadius: 999, background: 'rgba(16,16,16,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%`, height: '100%', borderRadius: 999, background: color.yellow, boxShadow: '0 0 12px rgba(255,202,5,0.6)' }} />
      </div>
    </div>
  );
};

// Panel de texto: icono y «Cómo cancelar», el nombre, los pasos y las notas (oferta, ojo, lo que pierdes).
export const CancelPanel: React.FC<{ k: PKey; steps: Step[]; notes?: Note[]; left: number; width: number; size?: number; titleSize?: number; hAt?: number; exitAt?: number; dur: number }> = ({
  k, steps, notes = [], left, width, size = 36, titleSize = 96, hAt = 3, dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hp = spring({ frame: frame - hAt, fps, config: { damping: 15, stiffness: 160 } });
  const xOut = interpolate(frame, [dur + 2, dur + 12], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <div style={{ position: 'absolute', top: 0, height: 1080, left, width, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - xOut }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, opacity: hp, transform: `translateY(${(1 - hp) * 24}px)` }}>
        <PlatTile k={k} size={size * 2.1} style={{ transform: `scale(${0.8 + 0.2 * hp}) rotate(${(1 - hp) * -12}deg)` }} />
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.68, letterSpacing: size * 0.11, textTransform: 'uppercase', color: color.muted }}>Cómo cancelar</div>
      </div>
      <MaskTitle text={PLAT[k].name} at={hAt + 4} size={titleSize} />
      <Progress steps={steps} size={size} width={Math.min(width, 560)} at={hAt + 10} />
      <div style={{ marginTop: size * 0.8 }}>
        <StepList steps={steps} size={size} width={width} />
      </div>
      {notes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: size * 0.36, marginTop: size * 0.8 }}>
          {notes.map((n, i) => <ToneChip key={i} at={n.at} tone={n.tone} label={n.label} sub={n.sub} size={size * 0.9} dimAt={notes[i + 1]?.at} />)}
        </div>
      )}
    </div>
  );
};

// Móvil con las tomas: cámara que se acerca a cada marca (más suave que en las reseñas), toques y su sonido.
export const PhoneStage: React.FC<{ dur: number; shots: MShot[]; taps?: Tap[]; cx?: number; enter?: SceneProps['enter']; zoom?: number; from?: number; to?: number }> = ({
  dur, shots, taps = [], cx = 560, enter = 'rise', zoom = 1.42, from = 0, to,
}) => {
  const top = Math.round((1080 - PH.H) / 2);
  const end = to ?? dur;
  const focus: Focus[] = focusFrom(shots, end).map((f) => ({ ...f, s: zoom }));
  const cam = buildPhoneCam({ dur: end, side: 1, cx, top, focus, enter: enter === 'glide' ? 'glide' : 'rise', exit: 'none' });
  const zooms = zoomPeaks(cam, from + 2, end - 2, 0.02);
  return (
    <>
      <PhoneHalo cam={cam} cx={cx} strength={0.8} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <MPhone shots={shots} w={PHONE_W} cam={cam} taps={taps} dim={0.66} motionBlur float={[0, end]} pulse />
      </div>
      {taps.map((t, i) => <Sfx key={`t${i}`} name="ui_tap" at={t.f} volume={0.5} />)}
      {zooms.map((f, i) => <Sfx key={`z${i}`} name="zoom_in" at={f} volume={0.28} />)}
    </>
  );
};

// Toma del móvil: grabación `rec` de cnl/rec que empieza en el segundo `start` en el fotograma `at`, quieta desde `hold` (s de la grabación).
// Las marcas van en fotogramas de escena y px de la grabación (664×1440).
export const shot = (rec: string, at: number, start: number, hold: number, marks: [number, number, number, number, number, number, number?][] = [], dir = 'cnl'): MShot => ({
  dir, rec, at, start, hold, fade: 5,
  marks: marks.map(([f, t, x, y, w, h, r]) => ({ from: f - at, to: t - at, x, y, w, h, r: r ?? 18 })),
});

// ——— Navegador con capturas (Audible, Spotify y Audiobooks.com) ———
// Cada página entra en `at` (fotograma de escena) con un fundido; las marcas y la cámara van en fotogramas de escena.
// Imagen de una pantalla (1456×819) o página alta (`cssH` > 819, con desplazamiento: `keys` de PagePane).
export type WebPage = { at: number; src: string; url: string; marks?: Mark[]; camera?: CamKey[]; cssH?: number; keys?: PageKey[]; pmarks?: PageMark[] };
const VW = 1456, VHH = 819;
export const WebShots: React.FC<{ pages: WebPage[]; width: number; dur: number }> = ({ pages, width }) => {
  const frame = useCurrentFrame();
  let i = 0;
  pages.forEach((p, k) => { if (frame >= p.at) i = k; });
  const render = (p: WebPage, opacity: number, key: string) => {
    const rel = (m: Mark) => ({ ...m, from: m.from - p.at, to: m.to - p.at });
    return (
      <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
        <Sequence from={p.at} layout="none">
          {p.cssH && p.keys ? (
            <PagePane src={p.src} cssW={VW} cssH={p.cssH} width={width} url={p.url} keys={p.keys.map((q) => ({ ...q, f: q.f - p.at }))} marks={(p.pmarks ?? []).map((m) => ({ ...m, from: m.from - p.at, to: m.to - p.at }))}
              style={{ boxShadow: 'none' }} />
          ) : (
            <WebPane src={p.src} image width={width} url={p.url} viewport={[VW, VHH]} marks={(p.marks ?? []).map(rel)} style={{ boxShadow: 'none' }}
              camera={(p.camera ?? [{ f: p.at, zoom: 1, x: VW / 2, y: VHH / 2 }]).map((c) => ({ ...c, f: c.f - p.at }))} />
          )}
        </Sequence>
      </div>
    );
  };
  const cur = pages[i];
  const prev = i > 0 ? pages[i - 1] : null;
  const p = prev ? interpolate(frame, [cur.at, cur.at + 7], [0, 1], clamp) : 1;
  const h = (width * VHH) / VW + Math.round(width * 0.03);
  return (
    <div style={{ width, height: h, position: 'relative', borderRadius: width * 0.014, boxShadow: '0 60px 120px rgba(16,16,16,0.22), 0 18px 40px rgba(16,16,16,0.12), 0 0 0 1px rgba(16,16,16,0.06)', overflow: 'hidden' }}>
      {prev && p < 1 && render(prev, 1, `p${i - 1}`)}
      {render(cur, p, `c${i}`)}
    </div>
  );
};

// Marca del navegador en px de la captura (1456×819), en fotogramas de escena.
export const wm = (from: number, to: number, x: number, y: number, w: number, h: number, r = 10): Mark => ({ from, to, x, y, w, h, r });
// Cámara del navegador: acercamiento suave a (x, y) entre `a` y `b` (fotogramas de escena) y vuelta.
export const webZoom = (at: number, list: { a: number; b: number; x: number; y: number; z?: number }[]): CamKey[] => {
  const out: CamKey[] = [{ f: at, zoom: 1, x: VW / 2, y: VHH / 2 }];
  for (const q of list) {
    out.push({ f: Math.max(at, q.a - 2), zoom: out[out.length - 1].zoom, x: out[out.length - 1].x, y: out[out.length - 1].y });
    out.push({ f: q.a + 16, zoom: q.z ?? 1.5, x: q.x, y: q.y });
    out.push({ f: q.b, zoom: q.z ?? 1.5, x: q.x, y: q.y });
  }
  return out;
};

// Escena de una plataforma: el escenario (móvil o navegador) a la izquierda y el panel de pasos a la derecha.
// `web`: el escenario es ancho (navegador) y el panel, estrecho.
export const CancelScene: React.FC<SceneProps & { k: PKey; web?: boolean; steps: Step[]; notes?: Note[]; stage: React.ReactNode; size?: number; titleSize?: number; extra?: React.ReactNode }> = ({
  dur, k, web = false, steps, notes, stage, size, titleSize, extra,
}) => (
  <MpStage tint={PLAT[k].c}>
    <AbsoluteFill>
      {stage}
      <CancelPanel k={k} steps={steps} notes={notes} left={web ? 1290 : 930} width={web ? 580 : 880} size={size ?? (web ? 30 : 36)} titleSize={titleSize ?? (web ? 80 : 96)} dur={dur} />
      {extra}
    </AbsoluteFill>
    <Sfx name="ui_pop" at={4} volume={0.5} />
    {steps.map((s, i) => <Sfx key={`s${i}`} name="ui_pop" at={s.at - 1} volume={0.55} />)}
    {(notes ?? []).map((n, i) => <Sfx key={`n${i}`} name={n.tone === 'warn' ? 'tick_soft' : 'ui_pop'} at={n.at + 1} volume={0.6} />)}
  </MpStage>
);

// Sello «CANCELADA» (rojo, girado) que cae sobre un icono.
export const Stamp: React.FC<{ at: number; size: number; label?: string }> = ({ at, size, label = 'Cancelada' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 260, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(-14deg) scale(${2.2 - 1.2 * s})`, opacity: Math.min(1, s * 2),
      padding: `${size * 0.06}px ${size * 0.12}px`, border: `${Math.max(3, size * 0.035)}px solid #E5484D`, borderRadius: size * 0.08, color: '#E5484D', background: 'rgba(255,255,255,0.92)',
      fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.16, letterSpacing: size * 0.012, textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(229,72,77,0.25)' }}>
      {label}
    </div>
  );
};

export { color, font, shadow, PLAT, PlatTile, MaskTitle, MpStage, ToneChip };
export type { PKey, MShot, Tap, Tone };
export const fadeIn = (frame: number, at: number, len = 12) => interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: easeOut });

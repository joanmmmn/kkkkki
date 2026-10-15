import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { ScreenClip } from '../../components/ScreenClip';
import { InfinityIcon } from '../../components/Icons2';
import { wf } from './timeline';
import {
  align, APP_RATIO, Burst, color, font, Kicker, LinkBadge, markOn, MaskTitle, MPhone, MpStage, MShot, PKey, PLAT, PlatTile, SceneProps, shadow, ToneChip, useSpring, WebPane,
} from './kit';
import { ClockFace } from './Intro';

type P = SceneProps;

// Cabecera de los trucos: «Truco n» y el título con máscara.
const TrickHead: React.FC<{ n: number; title: string; hi?: string | string[]; at: number; kicker?: string; size?: number; style?: React.CSSProperties }> = ({ n, title, hi, at, kicker, size = 92, style }) => (
  <div style={{ position: 'absolute', left: 130, top: 96, ...style }}>
    <Kicker at={at} text={kicker ?? `Truco ${n} de 5`} />
    <MaskTitle text={title} hi={hi} at={at + 3} size={size} />
  </div>
);

// Z19 · Mito: acelerar no ahorra horas. En las de horas se descuenta lo que dura el libro (10 h a 2x siguen siendo 10 h);
// en las de tarifa plana no hay reloj.
export const Z19Velocidad: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z19', w, n);
  const fMito = at('mito');
  const fHoras = at('horas');
  const fRapido = at('rapido');
  const fCuenta = at('cuenta');
  const fDiez = at('diez');
  const fGasta = at('gasta');
  const fComo = at('como');
  const fTarifa = at('tarifa');
  const fReloj = at('reloj');
  const sMito = spring({ frame: frame - fMito + 2, fps, config: { damping: 9, stiffness: 220 } });
  const sLeft = useSpring(fHoras - 6, 16, 150);
  const sRight = useSpring(fTarifa - 6, 16, 150);
  // El libro de 10 h a 2x: el tiempo real se queda en 5 h, pero el reloj de la plataforma descuenta 10.
  const play = interpolate(frame, [fDiez, fComo + 30], [0, 1], { ...clamp, easing: easeInOut });
  const speed2 = frame >= fRapido + 6;
  const real = 5 * play;
  const spent = 10 * play;
  const hours: PKey[] = ['podimo', 'nextory', 'bookbeat', 'spotify'];
  const flat: PKey[] = ['audible', 'storytel'];
  const bigNum = (v: number, c: string) => <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -5, color: c, fontVariantNumeric: 'tabular-nums' }}>{v.toFixed(1).replace('.', ',')} h</span>;
  return (
    <MpStage>
      <AbsoluteFill>
        <TrickHead n={1} title="Acelerar no ahorra horas" hi="horas" at={lead - 6} kicker="Truco 1 · o mejor dicho, mito" />
        {frame >= fMito - 4 && (
          <div style={{ position: 'absolute', right: 150, top: 110, padding: '14px 34px', borderRadius: 14, border: `6px solid ${color.red}`, color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: 6,
            transform: `rotate(-8deg) scale(${2 - sMito})`, opacity: Math.min(1, sMito * 1.5) }}>MITO</div>
        )}
        {/* Las de horas */}
        <div style={{ position: 'absolute', left: 130, top: 360, width: 1040, height: 600, borderRadius: 38, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '40px 50px', boxSizing: 'border-box',
          opacity: Math.min(1, sLeft * 1.3), transform: `translateY(${(1 - sLeft) * 60}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {hours.map((k) => <PlatTile key={k} k={k} size={64} />)}
            <span style={{ marginLeft: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>Las de horas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 34 }}>
            <div style={{ width: 120, height: 160, borderRadius: 14, background: `linear-gradient(160deg, ${PLAT.podimo.c} 0%, ${PLAT.nextory.c} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.soft }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: '#fff' }}>10 h</span>
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>Un audiolibro de 10 horas</div>
            <div style={{ marginLeft: 'auto', padding: '12px 26px', borderRadius: 999, background: speed2 ? color.ink : '#F1F1F1', color: speed2 ? color.yellow : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 44,
              transform: `scale(${speed2 ? 1 + 0.15 * interpolate(frame, [fRapido + 6, fRapido + 10, fRapido + 20], [0, 1, 0], clamp) : 1})` }}>{speed2 ? '2,0x' : '1,0x'}</div>
          </div>
          <div style={{ display: 'flex', gap: 30, marginTop: 40 }}>
            <div style={{ flex: 1, borderRadius: 26, background: '#F6F6F4', padding: '22px 28px' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>Tiempo que escuchas</div>
              {bigNum(real, color.ink)}
            </div>
            <div style={{ flex: 1, borderRadius: 26, background: '#FFE9EA', padding: '22px 28px', position: 'relative' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>Horas que te descuenta</div>
              {bigNum(spent, color.red)}
            </div>
          </div>
        </div>
        {/* Las de tarifa plana */}
        <div style={{ position: 'absolute', left: 1210, top: 360, width: 580, height: 600, borderRadius: 38, background: color.ink, color: '#fff', padding: '40px 46px', boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(16,16,16,0.28)',
          opacity: Math.min(1, sRight * 1.3), transform: `translateY(${(1 - sRight) * 60}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {flat.map((k) => <PlatTile key={k} k={k} size={64} />)}
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, marginTop: 30 }}>Tarifa plana</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
            <span style={{ width: 120, height: 120, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><InfinityIcon size={74} c={color.ink} /></span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, lineHeight: 1.05 }}>Sin reloj</span>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: 'rgba(255,255,255,0.7)', marginTop: 36, lineHeight: 1.3, opacity: interpolate(frame, [fReloj - 4, fReloj + 12], [0, 1], clamp) }}>Acelerar no te cuesta nada</div>
        </div>
      </AbsoluteFill>
      <Sfx name="stamp" at={fMito + 2} volume={0.8} />
      <Sfx name="whoosh_soft" at={fHoras - 4} volume={0.6} />
      <Sfx name="click" at={fRapido + 6} volume={0.7} />
      <ChangeTicks value={(f) => String(Math.round(10 * interpolate(f, [fDiez, fComo + 30], [0, 1], { ...clamp, easing: easeInOut })))} from={fDiez} to={fComo + 32} volume={0.6} />
      <Sfx name="hit_soft" at={fGasta} volume={0.5} />
      <Sfx name="whoosh_soft" at={fTarifa - 4} volume={0.6} />
      <Sfx name="success" at={fReloj + 2} volume={0.5} />
      <Sfx name="tick_soft" at={fCuenta} volume={0.2} />
    </MpStage>
  );
};

// Z20 · Cuándo cancelar: en Storytel, Nextory, Podimo y BookBeat, cancelar en la prueba corta el acceso (hazlo al final);
// Audiobooks.com quita los libros; en Audible, puedes cancelar el día 1. BookBeat no avisa antes de cobrar.
export const Z20Cancelar: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z20', w, n);
  const fStory = at('storytel');
  const fPierdes = at('pierdes');
  const fDos = at('dos');
  const fAbc = at('audiobooks');
  const fLibros = at('libros');
  const fAudible = at('audible');
  const fPrimer = at('primer');
  const fFecha = at('fecha');
  const fAvisa = at('avisa');
  const rows: { k: PKey; days: number; f: number }[] = [
    { k: 'storytel', days: 7, f: fStory },
    { k: 'nextory', days: 30, f: fStory + 6 },
    { k: 'podimo', days: 30, f: fStory + 12 },
    { k: 'bookbeat', days: 30, f: fStory + 18 },
  ];
  const BAR = 1020;
  const left = 470;
  const late = interpolate(frame, [fDos - 4, fDos + 18], [0, 1], { ...clamp, easing: easeOut });
  const lose = interpolate(frame, [fPierdes - 4, fPierdes + 14], [0, 1], { ...clamp, easing: easeOut });
  const sAbc = useSpring(fAbc - 6, 15, 170);
  const sAud = useSpring(fAudible - 6, 15, 170);
  const sBell = spring({ frame: frame - fFecha + 2, fps, config: { damping: 12, stiffness: 190 } });
  const rowH = 96;
  const y0 = 330;
  const bar = (i: number, days: number, k: PKey, opts: { marker?: number; markerLabel?: string; good?: boolean; s: number }) => (
    <div key={`${k}${i}`} style={{ position: 'absolute', left: 130, top: y0 + i * (rowH + 18), width: 1660, height: rowH, display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, opts.s * 1.4), transform: `translateX(${(1 - opts.s) * -60}px)` }}>
      <PlatTile k={k} size={80} />
      <div style={{ width: 170, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>{days} días</div>
      <div style={{ position: 'relative', width: BAR, height: 26, borderRadius: 13, background: '#EDEDED' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${opts.s * 100}%`, borderRadius: 13, background: PLAT[k].c, opacity: 0.85 }} />
        {opts.marker !== undefined && (
          <div style={{ position: 'absolute', left: opts.marker * BAR - 8, top: -20, width: 16, height: 66, borderRadius: 8, background: opts.good ? color.green : color.ink, boxShadow: '0 6px 16px rgba(16,16,16,0.25)' }} />
        )}
      </div>
      {opts.markerLabel && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: opts.good ? color.green : color.ink, whiteSpace: 'nowrap' }}>{opts.markerLabel}</div>}
    </div>
  );
  return (
    <MpStage>
      <AbsoluteFill>
        <TrickHead n={2} title="Cuándo cancelar la prueba" hi="cancelar" at={lead - 6} size={84} style={{ top: 70 }} />
        {rows.map((r, i) => {
          const s = spring({ frame: frame - r.f + 4, fps, config: { damping: 16, stiffness: 150 } });
          if (frame < r.f - 6) return null;
          // El aviso rojo (si cancelas antes, pierdes el acceso) y la marca «cancela aquí», dos o tres días antes del final.
          const markerPos = late > 0 ? 1 - (r.days === 7 ? 0.28 : 0.1) * late : undefined;
          return (
            <React.Fragment key={r.k}>
              {bar(i, r.days, r.k, { s, marker: markerPos, markerLabel: late > 0.5 ? 'Cancela aquí' : undefined })}
              {lose > 0 && (
                <div style={{ position: 'absolute', left: 130 + 80 + 30 + 170 + 30, top: y0 + i * (rowH + 18) + rowH / 2 - 13, width: BAR * 0.45 * lose, height: 26, borderRadius: 13,
                  background: `repeating-linear-gradient(135deg, rgba(229,72,77,0.55) 0 10px, rgba(229,72,77,0.25) 10px 20px)`, opacity: 1 - late * 0.85 }} />
              )}
            </React.Fragment>
          );
        })}
        {frame >= fPierdes - 4 && (
          <div style={{ position: 'absolute', left: left + 210, top: 268, opacity: lose * (1 - late * 0.6) }}>
            <ToneChip at={fPierdes - 3} tone="warn" label="Si cancelas antes, pierdes el acceso al momento" sub="" size={30} reserve={false} />
          </div>
        )}
        {/* Audiobooks.com y Audible */}
        <div style={{ position: 'absolute', left: 130, top: y0 + 4 * (rowH + 18) + 20, width: 1660, display: 'flex', gap: 30 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 26px', borderRadius: 28, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`,
            opacity: frame < fAbc - 6 ? 0 : sAbc, transform: `translateY(${(1 - sAbc) * 30}px)` }}>
            <PlatTile k="audiobooks" size={70} />
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>Además, pierdes los libros</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.ink2 }}>El de la prueba y los VIP</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 26px', borderRadius: 28, background: '#E7F6EE', boxShadow: shadow.soft, border: `1px solid #CBEBD9`,
            opacity: frame < fAudible - 6 ? 0 : sAud, transform: `translateY(${(1 - sAud) * 30}px)` }}>
            <PlatTile k="audible" size={70} />
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>Cancela el día 1</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.ink2 }}>Y sigues hasta el final de la prueba</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 26px', borderRadius: 28, background: color.ink, color: '#fff', boxShadow: '0 24px 60px rgba(16,16,16,0.3)',
            opacity: frame < fFecha - 6 ? 0 : Math.min(1, sBell * 1.4), transform: `scale(${0.85 + 0.15 * sBell})` }}>
            <span style={{ width: 70, height: 70, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={2} strokeLinecap="round"><path d="M18 16H6l1.5-2V10a4.5 4.5 0 0 1 9 0v4zM10 19a2 2 0 0 0 4 0M4 4l16 16" /></svg>
            </span>
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34 }}>Apúntate la fecha</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>BookBeat no avisa antes de cobrar</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {rows.map((r) => <Sfx key={r.k} name="whoosh_soft" at={r.f} volume={0.35} />)}
      <Sfx name="fail" at={fPierdes} volume={0.4} />
      <Sfx name="snap_in" at={fDos + 6} volume={0.6} />
      <Sfx name="ui_pop" at={fAbc - 2} volume={0.6} />
      <Sfx name="success" at={fPrimer} volume={0.5} />
      <Sfx name="pop" at={fAvisa} volume={0.6} />
      <Sfx name="tick_soft" at={fLibros} volume={0.2} />
    </MpStage>
  );
};

// Z21 · Date de alta en la web, no en la app: la web de cada una (prueba de 30 días de Audible, la de 3 libros de Audiobooks.com)
// frente a la app (Audible, sin prueba por las tiendas; Audiobooks.com, 17,95 € al mes en vez de ≈13 €).
export const Z21WebApp: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('Z21', w, n);
  const fWeb = at('web');
  const fApp = at('app');
  const fAudible = at('audible');
  const fCaro = at('caro');
  const fAbc = at('audiobooks');
  const fDiec = at('diecisiete');
  const fTrece = at('trece');
  const sWeb = useSpring(fWeb - 6, 16, 150);
  const sApp = useSpring(fApp - 6, 16, 150);
  // La app de Audiobooks.com: «MONTHLY · 17,95 €/MONTH» (sin prueba), con el precio marcado.
  const s0: MShot = { dir: 'abc', rec: 'upgrade_1795', at: 0, start: 2.0, hold: 14 };
  s0.marks = [markOn(s0, fDiec - 2, dur + 20, 16, 908, 632, 106, 30)];
  const PW = 800;
  const head = (t: string, good: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
      <span style={{ width: 54, height: 54, borderRadius: '50%', background: good ? color.green : color.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {good ? <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <svg width={26} height={26} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth={3} strokeLinecap="round" /></svg>}
      </span>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.5, color: color.ink }}>{t}</span>
    </div>
  );
  return (
    <MpStage>
      <AbsoluteFill>
        <TrickHead n={3} title="En la web, no en la app" hi="web" at={lead - 6} />
        {/* La web: la página de la prueba de audible.es y, con «Audiobooks.com», la suya de 3 libros en 30 días */}
        <div style={{ position: 'absolute', left: 130, top: 330, width: PW, opacity: Math.min(1, sWeb * 1.3), transform: `translateY(${(1 - sWeb) * 60}px)` }}>
          {head('En su web', true)}
          <WebPane src={frame < fAbc - 6 ? 'aud/web/00_au_prueba/prueba_still.png' : 'abc/web/00_abc_landing/video.mp4'} image={frame < fAbc - 6} holdAt={0.2} width={PW}
            url={frame < fAbc - 6 ? 'audible.es' : 'audiobooks.com'} camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }]}
            marks={frame < fAbc - 6 ? [{ from: fAudible - 4, to: fAbc - 6, x: 456, y: 496, w: 192, h: 56, r: 28 }] : []} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
            <ToneChip at={fAudible - 3} tone="best" label="Audible: 30 días de prueba" sub="" size={34} />
            <ToneChip at={fTrece - 3} tone="best" label="Audiobooks.com: 14,95 $ (≈13 €)" sub="" size={34} />
          </div>
        </div>
        {/* La app */}
        <div style={{ position: 'absolute', left: 1030, top: 330, width: 760, opacity: Math.min(1, sApp * 1.3), transform: `translateY(${(1 - sApp) * 60}px)` }}>
          {head('En la app', false)}
          <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
            <div style={{ width: 250, flexShrink: 0 }}>
              <MPhone shots={[s0]} w={240} cam={[{ f: 0, rx: 2, ry: -8, rz: 0, s: 1, x: 0, y: 0 }]} dim={0.7} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30 }}>
              <ToneChip at={fAudible - 3} tone="warn" label="Audible: sin prueba" sub="Y puede salir más caro" size={34} />
              <ToneChip at={fDiec - 3} tone="warn" label="Audiobooks.com: 17,95 €" sub="Al mes, en vez de ≈13 €" size={34} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fWeb - 4} volume={0.6} />
      <Sfx name="whoosh_soft" at={fApp - 4} volume={0.6} />
      <Sfx name="tick_soft" at={fAudible - 2} volume={0.6} />
      <Sfx name="swipe" at={fAbc - 6} volume={0.5} />
      <Sfx name="coins" at={fDiec} volume={0.4} />
      <Sfx name="tick_soft" at={fCaro} volume={0.2} />
      <Sfx name="success" at={fTrece} volume={0.4} />
    </MpStage>
  );
};

// Z22 · Encadenar pruebas: Audible 30 + Podimo 30 + BookBeat 30 + Nextory 30 (14 sin SonorBooks) + ElevenReader 30 (3) = 150 días.
export const Z22Encadenar: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z22', w, n);
  const fEnc = at('encadenar');
  const fAud = at('audible');
  const fPod = at('podimo');
  const fBkb = at('bookbeat');
  const fSonor = at('sonorbooks');
  const fNext = at('nextory');
  const fCat = at('catorce');
  const fEleven = at('elevenreader');
  const fTres = at('tres');
  const fUna = at('una');
  const fMeses = at('meses');
  const fNuevo = at('nuevo');
  const fEnl = at('enlaces');
  const blocks: { k: PKey; f: number; from?: number; sb?: boolean }[] = [
    { k: 'audible', f: fAud },
    { k: 'podimo', f: fPod },
    { k: 'bookbeat', f: fBkb },
    { k: 'nextory', f: fNext, from: 14, sb: true },
    { k: 'elevenreader', f: fEleven, from: 3, sb: true },
  ];
  const BW = 320, G = 12;
  const x0 = (1920 - (5 * BW + 4 * G)) / 2;
  const total = blocks.reduce((a, b) => a + (frame >= b.f - 2 ? 30 * spring({ frame: frame - b.f + 2, fps, config: { damping: 16, stiffness: 140 } }) : 0), 0);
  const sTotal = useSpring(fUna - 6, 15, 150);
  const sFine = useSpring(fNuevo - 8, 16, 150);
  return (
    <MpStage>
      <AbsoluteFill>
        <TrickHead n={4} title="Encadena las pruebas" hi="pruebas" at={lead - 6} />
        {blocks.map((b, i) => {
          const s = spring({ frame: frame - b.f + 2, fps, config: { damping: 14, stiffness: 160 } });
          if (frame < b.f - 3) return null;
          const strike = b.from ? interpolate(frame, [(i === 3 ? fCat : fTres) + 2, (i === 3 ? fCat : fTres) + 14], [0, 1], clamp) : 0;
          return (
            <div key={b.k} style={{ position: 'absolute', left: x0 + i * (BW + G), top: 400, width: BW, height: 300, borderRadius: 30, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`,
              opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * -160}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, padding: '30px 28px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <PlatTile k={b.k} size={76} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                {b.from && (
                  <span style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.muted }}>
                    {b.from}
                    <span style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 5, borderRadius: 3, background: color.red, transform: `scaleX(${strike})`, transformOrigin: 'left' }} />
                  </span>
                )}
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, letterSpacing: -4, color: color.ink }}>30</span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>días</span>
              </div>
              {b.sb && <span style={{ padding: '6px 14px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 22, color: color.ink }}>Desde SonorBooks</span>}
            </div>
          );
        })}
        {/* El total */}
        {frame >= fUna - 8 && (
          <div style={{ position: 'absolute', left: x0, top: 740, display: 'flex', alignItems: 'baseline', gap: 22, opacity: sTotal, transform: `translateY(${(1 - sTotal) * 30}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -5, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{Math.round(total)}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: color.ink }}>días ≈ 5 meses de pruebas</span>
          </div>
        )}
        {frame >= fNuevo - 8 && (
          <div style={{ position: 'absolute', left: x0, top: 900, fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, opacity: sFine }}>
            Solo clientes nuevos · Nextory hasta 15 h · Podimo y BookBeat, 20 h · Cancela a tiempo
          </div>
        )}
        <div style={{ position: 'absolute', right: 130, top: 120 }}>
          <LinkBadge at={fEnl - 4} label="Todos los enlaces, en la descripción" size={34} />
        </div>
        {fMeses > 0 && null}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fEnc - 4} volume={0.6} />
      {blocks.map((b) => <Sfx key={b.k} name="snap_in" at={b.f + 6} volume={0.6} />)}
      <Sfx name="pencil_strike" at={fCat + 4} volume={0.5} />
      <Sfx name="pencil_strike" at={fTres + 4} volume={0.5} />
      <Sfx name="sparkle" at={fSonor} volume={0.4} />
      <Sfx name="hit_soft" at={fUna} volume={0.6} />
      <Sfx name="ui_pop" at={fEnl - 2} volume={0.6} />
      <Burst at={fUna + 4} x={x0 + 120} y={800} r={60} n={26} seed="chain" />
    </MpStage>
  );
};

// Z23 · Antes de pagar, busca el libro: Los tres mundos en tres plataformas (aparte / no está / un crédito) y SonorBooks:
// en qué plataformas de las que comparamos está, con qué narrador y a qué precio (ficha real de La mala hija).
export const Z23Busca: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z23', w, n);
  const fQuinto = at('quinto');
  const fBusca = at('busca');
  const fTodo = at('todo');
  const fAparte = at('aparte');
  const fNoEsta = at('bookbeat');
  const fCredito = at('credito');
  const fSonor = at('sonorbooks');
  const fCuales = at('cuales');
  const fNarr = at('narrador');
  const fPrecio = at('precio');
  const sBook = useSpring(fBusca - 6, 15, 150);
  const out = interpolate(frame, [fSonor - 14, fSonor + 4], [0, 1], { ...clamp, easing: easeInOut });
  const sWin = useSpring(fSonor - 8, 18, 120);
  const results: { k: PKey; f: number; label: string; tone: 'warn' | 'best' }[] = [
    { k: 'audible', f: fAparte, label: 'Se paga aparte', tone: 'warn' },
    { k: 'bookbeat', f: fNoEsta, label: 'No está', tone: 'warn' },
    { k: 'audiobooks', f: fCredito, label: 'Con 1 crédito', tone: 'best' },
  ];
  // SonorBooks: la portada (buscador) y la ficha de «La mala hija» con Audible, Podimo y Nextory (capturas de su reseña).
  const W = 1300;
  const F0 = fCuales - 12;
  const r = (f: number) => f - F0;
  const cam = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: 24, zoom: 1.75, x: 1274, y: 700 },
    { f: r(fNarr) - 4, zoom: 1.75, x: 1274, y: 700 },
    { f: r(fNarr) + 16, zoom: 1.9, x: 1150, y: 380 },
    { f: r(fPrecio) - 4, zoom: 1.9, x: 1150, y: 380 },
    { f: r(fPrecio) + 16, zoom: 1.7, x: 1350, y: 470 },
  ];
  const marks = [
    { from: 14, to: r(fNarr) - 2, x: 948, y: 694, w: 652, h: 60, r: 12 },
    { from: r(fNarr), to: r(fPrecio) - 2, x: 940, y: 336, w: 310, h: 30, r: 8 },
    { from: r(fPrecio), to: dur, x: 1488, y: 426, w: 86, h: 52, r: 10 },
  ];
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ opacity: 1 - out, transform: `scale(${1 - 0.04 * out})`, filter: out > 0.02 ? `blur(${(out * 8).toFixed(2)}px)` : undefined }}>
          <TrickHead n={5} title="Antes de pagar, busca tu libro" hi="busca" at={lead - 6} kicker="Truco 5 · el más importante" size={84} />
          <div style={{ position: 'absolute', left: 130, top: 380, width: 420, height: 520, borderRadius: 18, background: 'linear-gradient(160deg, #2C3E50 0%, #10202F 100%)', boxShadow: '0 50px 110px rgba(16,16,16,0.28)',
            opacity: Math.min(1, sBook * 1.3), transform: `perspective(1600px) rotateY(${(1 - sBook) * 30 + 10}deg) translateY(${(1 - sBook) * 60}px)`, padding: 40, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#F3E6C8' }}>
            <div style={{ fontFamily: font.serif, fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.8 }}>Santiago Posteguillo</div>
            <div style={{ fontFamily: font.serif, fontSize: 92, lineHeight: 0.95, marginTop: 20 }}>Los tres mundos</div>
            <div style={{ fontFamily: font.sans, fontSize: 24, marginTop: 30, opacity: 0.75 }}>Audiolibro · 32 h 48 min</div>
          </div>
          <div style={{ position: 'absolute', left: 640, top: 400, display: 'flex', flexDirection: 'column', gap: 30 }}>
            {results.map((r) => {
              const s = spring({ frame: frame - r.f + 3, fps, config: { damping: 14, stiffness: 180 } });
              return (
                <div key={r.k} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: frame < r.f - 3 ? 0 : Math.min(1, s * 1.4), transform: `translateX(${(1 - s) * 60}px)` }}>
                  <PlatTile k={r.k} size={110} />
                  <div style={{ padding: '18px 34px', borderRadius: 999, background: r.tone === 'warn' ? '#FFE9EA' : '#E7F6EE', fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: r.tone === 'warn' ? color.red : color.green }}>{r.label}</div>
                </div>
              );
            })}
          </div>
          {frame >= fTodo - 4 && (
            <div style={{ position: 'absolute', right: 150, top: 170, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink2, opacity: interpolate(frame, [fTodo - 4, fTodo + 10], [0, 1], clamp) }}>Ninguna lo tiene todo</div>
          )}
        </div>
        {frame >= fSonor - 10 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 130, opacity: sWin, transform: `perspective(2600px) rotateX(${(1 - sWin) * 8 + 1.5}deg) translateY(${(1 - sWin) * 80}px) scale(${0.94 + 0.06 * sWin})`, transformOrigin: '50% 0%' }}>
            {frame < F0 ? (
              <Sequence from={fSonor - 10} layout="none">
                <WebPane src="pdr/web/00_home/home_still.jpg" image width={W} url="sonorbooks.com/es" camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: 34, zoom: 1.5, x: 960, y: 380 }]}
                  marks={[{ from: 20, to: F0 - fSonor + 20, x: 668, y: 334, w: 584, h: 58, r: 29 }]} />
              </Sequence>
            ) : (
              <Sequence from={F0} layout="none">
                <WebPane src="pdr/web/11_ficha_click/ficha_still.jpg" image width={W} url="sonorbooks.com/es/audiolibro/la-mala-hija" camera={cam} marks={marks} />
              </Sequence>
            )}
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fQuinto - 4} volume={0.6} />
      {results.map((r) => <Sfx key={r.k} name={r.tone === 'warn' ? 'tick_soft' : 'success'} at={r.f - 1} volume={0.6} />)}
      <Sfx name="whoosh_deep" at={fSonor - 6} volume={0.6} />
      <Sfx name="zoom_in" at={fCuales + 6} volume={0.5} />
      <Sfx name="zoom_in" at={fNarr + 6} volume={0.4} />
      <Sfx name="zoom_in" at={fPrecio + 6} volume={0.4} />
    </MpStage>
  );
};

export { Burst, ScreenClip, align, ClockFace };

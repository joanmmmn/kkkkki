import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { RealPhone } from '../../components/RealPhone';
import { ClockIcon, InfinityIcon } from '../../components/Icons2';
import { wf } from './timeline';
import { APP_RATIO, color, font, Kicker, MaskTitle, MpStage, Odometer, PKey, PLAT, PlatTile, SceneProps, shadow, ToneChip, useSpring } from './kit';

type P = SceneProps;

// Pantallas reales de cada app (fotogramas de las grabaciones de sus reseñas), para el carrusel del arranque.
const SCREENS: { k: PKey; src: string }[] = [
  { k: 'audible', src: 'aud/rec/05_dracula/last.jpg' },
  { k: 'storytel', src: 'str/rec/16_lectura/first.jpg' },
  { k: 'podimo', src: 'pdr/rec/04_inicio/last.jpg' },
  { k: 'nextory', src: 'nxr/rec/01_inicio/last.jpg' },
  { k: 'bookbeat', src: 'bkb/rec/00_inicio_top/first.jpg' },
  { k: 'audiobooks', src: 'abc/rec/inicio_top/first.jpg' },
];
// Las diez reseñadas, en el orden del vídeo; Spotify llega después, aparte.
export const TEN: PKey[] = ['audible', 'storytel', 'podimo', 'nextory', 'bookbeat', 'audiobooks', 'elevenreader', 'ebiblio', 'librivox', 'elt'];

// Z01 · Arranque: un móvil pasa por las apps reales a toda velocidad; después caen las diez fichas una a una, llega Spotify
// con «Nuevo» y todo se aparta para el título y las tres promesas del vídeo.
export const Z01Hook: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z01', w, n);
  const fUna = at('una');
  const fDiez = at('diez');
  const fApps = at('apps');
  const fPrecios = at('precios');
  const fLetra = at('letra');
  const fSuma = at('sumamos');
  const fSpot = at('spotify');
  const fVideo = at('video');
  const fMejor = at('mejor');
  const fTrucos = at('trucos');
  const fConv = at('conviene');

  // Arranque en frío: el móvil entra girando y cambia de app cada 11 fotogramas (corte con destello).
  const CUT = 11;
  const zap = Math.min(SCREENS.length - 1, Math.floor(Math.max(0, frame - 8) / CUT));
  const sPh = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 120 } });
  const phOut = interpolate(frame, [fUna - 14, fUna + 6], [0, 1], { ...clamp, easing: easeInOut });
  const flash = interpolate((frame - 8) % CUT, [0, 3], [0.55, 0], clamp) * (frame >= 8 && frame < 8 + CUT * SCREENS.length ? 1 : 0);

  // Las diez fichas caen en su sitio (5 × 2) con «una a una»; con Spotify la rejilla deja sitio a una tercera fila.
  const TILE = 158, GAP = 30;
  const gridX = 960 + 20, gridW = 5 * TILE + 4 * GAP;
  const spot = spring({ frame: frame - fSpot + 4, fps, config: { damping: 14, stiffness: 150 } });
  const rowsH = 2 * TILE + GAP + spot * (TILE + GAP);
  const gridY = 540 - rowsH / 2;
  // Con «En este vídeo» todo retrocede y se desenfoca; entra el título.
  const away = interpolate(frame, [fVideo - 8, fVideo + 14], [0, 1], { ...clamp, easing: easeInOut });
  const sCount = useSpring(fDiez - 4, 14, 170);
  const promises: { word: number; tone: 'best' | 'trick' | 'info'; label: string }[] = [
    { word: fMejor, tone: 'best', label: 'Lo mejor de cada una' },
    { word: fTrucos, tone: 'trick', label: 'Los trucos que no te cuentan' },
    { word: fConv, tone: 'info', label: 'Cuál te conviene a ti' },
  ];
  const tilePos = (i: number) => ({ x: gridX + (i % 5) * (TILE + GAP), y: gridY + Math.floor(i / 5) * (TILE + GAP) });
  const sideChips = [
    { f: fApps, label: 'Sus apps' },
    { f: fPrecios, label: 'Sus precios' },
    { f: fLetra, label: 'Su letra pequeña' },
  ];
  return (
    <MpStage>
      <AbsoluteFill>
        {/* Móvil del arranque */}
        {phOut < 1 && (
          <div style={{ position: 'absolute', left: 960 - 190, top: 540 - 410, opacity: 1 - phOut,
            transform: `translateY(${(1 - sPh) * 260 - phOut * 120}px) scale(${(0.86 + 0.14 * sPh) * (1 - 0.25 * phOut)}) rotate(${(1 - sPh) * -8}deg)`, filter: phOut > 0.02 ? `blur(${(phOut * 10).toFixed(2)}px)` : undefined }}>
            <RealPhone w={380} ratio={APP_RATIO} rotX={4 * (1 - sPh)} rotY={-18 * (1 - sPh) + Math.sin(frame / 30) * 4} screenBg="#000">
              <Img src={staticFile(SCREENS[zap].src)} style={{ width: 380, height: 380 * APP_RATIO, display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash }} />
            </RealPhone>
            <div style={{ position: 'absolute', left: '50%', bottom: -70, transform: 'translateX(-50%)' }}>
              <PlatTile k={SCREENS[zap].k} size={92} />
            </div>
          </div>
        )}
        {/* Las fichas */}
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 - 0.08 * away}) translateX(${away * 60}px)`, opacity: 1 - away, filter: away > 0.02 ? `blur(${(away * 9).toFixed(2)}px)` : undefined }}>
          {TEN.map((k, i) => {
            const a = fUna + i * 4;
            const s = spring({ frame: frame - a, fps, config: { damping: 13, stiffness: 170 } });
            if (frame < a - 1) return null;
            const { x, y } = tilePos(i);
            const sx = (i % 2 ? 1 : -1) * (120 + i * 18);
            return (
              <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `translate(${((1 - s) * sx).toFixed(1)}px, ${((1 - s) * -420).toFixed(1)}px) rotate(${((1 - s) * (i % 2 ? 22 : -22)).toFixed(1)}deg) scale(${0.7 + 0.3 * s})` }}>
                <PlatTile k={k} size={TILE} />
              </div>
            );
          })}
          {frame >= fSpot - 6 && (
            <div style={{ position: 'absolute', left: gridX + gridW / 2 - TILE / 2, top: gridY + 2 * (TILE + GAP), opacity: spot, transform: `translateY(${(1 - spot) * 120}px) scale(${0.6 + 0.4 * spot})` }}>
              <PlatTile k="spotify" size={TILE} />
              <div style={{ position: 'absolute', right: -34, top: -22, padding: '8px 16px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: color.ink,
                boxShadow: shadow.float, transform: `rotate(8deg) scale(${spring({ frame: frame - fSpot - 6, fps, config: { damping: 10, stiffness: 220 } })})` }}>Nuevo</div>
            </div>
          )}
          {/* El contador de la izquierda */}
          <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 720, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Kicker at={fUna - 6} text="Reseñadas a fondo" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, opacity: sCount, transform: `translateY(${(1 - sCount) * 30}px)` }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 300, lineHeight: 0.9, letterSpacing: -16, color: color.ink }}>
                {frame >= fDiez - 4 ? <Odometer text="10" at={fDiez - 4} size={300} dur={28} /> : <span style={{ color: 'transparent' }}>10</span>}
              </span>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, lineHeight: 1.05, letterSpacing: -1.5, color: color.ink }}>plataformas<br />en español</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
              {sideChips.map((c, i) => {
                const s = spring({ frame: frame - c.f + 3, fps, config: { damping: 14, stiffness: 200 } });
                return (
                  <span key={c.label} style={{ padding: '14px 26px', borderRadius: 999, background: i === 2 ? color.ink : '#fff', color: i === 2 ? '#fff' : color.ink, border: `1px solid ${color.line}`,
                    fontFamily: font.sans, fontWeight: 700, fontSize: 34, boxShadow: shadow.soft, opacity: frame < c.f - 3 ? 0 : s, transform: `translateY(${(1 - s) * 24}px) scale(${0.85 + 0.15 * s})` }}>{c.label}</span>
                );
              })}
            </div>
            <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2,
              opacity: interpolate(frame, [fSuma - 4, fSuma + 10], [0, 1], clamp) }}>+ la recién llegada</div>
          </div>
        </div>
        {/* Título y promesas */}
        {frame >= fVideo - 4 && (
          <div style={{ position: 'absolute', left: 150, right: 150, top: 0, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Kicker at={fVideo - 2} text="La guía definitiva · SonorBooks" />
            <MaskTitle text={'Las mejores plataformas\nde audiolibros en español'} hi={['mejores', 'español']} at={fVideo} size={118} stagger={3} />
            <div style={{ display: 'flex', gap: 22, marginTop: 52 }}>
              {promises.map((p) => <ToneChip key={p.label} at={p.word - 3} tone={p.tone} label={p.label} sub="" size={40} reserve={false} />)}
            </div>
          </div>
        )}
      </AbsoluteFill>
      {/* Sonido: zapping del móvil, caída de cada ficha, contador, Spotify y el título. */}
      <Sfx name="whoosh_deep" at={6} volume={0.7} />
      {SCREENS.slice(1).map((_, i) => <Sfx key={`z${i}`} name="swipe" at={8 + (i + 1) * CUT} volume={0.75} />)}
      <Sfx name="whoosh_fast" at={fUna - 4} volume={0.7} />
      {TEN.map((_, i) => <Sfx key={`t${i}`} name="snap_in" at={fUna + i * 4 + 9} volume={0.45} />)}
      <ChangeTicks value={(f) => (f < fDiez - 4 ? '' : String(Math.round(10 * Math.min(1, spring({ frame: f - fDiez + 4, fps, config: { damping: 15, stiffness: 120 }, durationInFrames: 28 })))))} from={fDiez - 4} to={fDiez + 30} volume={0.8} />
      {sideChips.map((c) => <Sfx key={c.label} name="ui_pop" at={c.f - 2} volume={0.6} />)}
      <Sfx name="pop" at={fSpot - 2} volume={0.8} />
      <Sfx name="sparkle" at={fSpot + 6} volume={0.6} />
      <Sfx name="whoosh_soft" at={fVideo - 2} volume={0.8} />
      {promises.map((p) => <Sfx key={p.label} name="ui_pop" at={p.word - 2} volume={0.6} />)}
    </MpStage>
  );
};

export const CoinIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={1.8}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5.2" /><path d="M12 9.6v4.8" strokeLinecap="round" /></svg>
);
// Z02 · Las cuatro formas de pagar: cuatro tarjetas que se construyen al nombrarlas y, abajo, la cuenta de las horas al mes.
const MODELS: { word: string; title: string; desc: string; icon: React.ReactNode; tiles: PKey[]; tone: string }[] = [
  { word: 'tarifa', title: 'Tarifa plana', desc: 'Una cuota y escuchas sin mirar el reloj', icon: <InfinityIcon size={52} c={color.ink} />, tiles: ['audible', 'storytel'], tone: color.yellow },
  { word: 'horas', title: 'Por horas', desc: 'Un paquete de horas al mes', icon: <ClockIcon size={50} c={color.ink} />, tiles: ['podimo', 'nextory', 'bookbeat', 'spotify'], tone: '#FFE173' },
  { word: 'creditos', title: 'Con créditos', desc: 'Un libro al mes, tuyo para siempre', icon: <CoinIcon size={48} />, tiles: ['audiobooks'], tone: '#FFE9A6' },
  { word: 'gratis', title: 'Gratis', desc: 'De verdad: sin cuota ni tarjeta', icon: <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>0 €</span>, tiles: ['ebiblio', 'librivox', 'elt'], tone: '#FFF4C2' },
];
export const Z02Modelos: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z02', w, n);
  const fLo = at('primero');
  const fWords = MODELS.map((m) => at(m.word));
  const fPiensa = at('piensa');
  const fMedia = at('media');
  const fQuince = at('quince');
  // Las tarjetas suben un poco para dejar sitio a la cuenta.
  const lift = interpolate(frame, [fPiensa - 6, fPiensa + 16], [0, 1], { ...clamp, easing: easeInOut });
  const sCalc = useSpring(fMedia - 6, 16, 150);
  // 30 min al día durante un mes: el reloj da vueltas y el total sube hasta 15 h.
  const hours = interpolate(frame, [fMedia + 4, fQuince + 6], [0, 15], { ...clamp, easing: easeOut });
  const W = 410, G = 34;
  const x0 = (1920 - (4 * W + 3 * G)) / 2;
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: x0, top: 104 - 40 * lift }}>
          <MaskTitle text="No todas cobran igual" hi="igual" at={fLo - 2} size={84} />
        </div>
        {MODELS.map((m, i) => {
          const a = fWords[i] - 4;
          const s = spring({ frame: frame - a, fps, config: { damping: 15, stiffness: 150 } });
          const shown = frame >= a - 1;
          const active = i === MODELS.length - 1 ? frame < fPiensa : frame < fWords[i + 1] - 4;
          const y = 260 - 70 * lift;
          return (
            <div key={m.title} style={{ position: 'absolute', left: x0 + i * (W + G), top: y, width: W, height: 470 - 90 * lift, borderRadius: 34,
              background: shown ? '#fff' : 'transparent', border: shown ? `1px solid ${color.line}` : `3px dashed rgba(16,16,16,0.12)`, boxShadow: shown ? shadow.card : undefined,
              opacity: shown ? Math.min(1, s * 1.3) : 1, transform: shown ? `translateY(${(1 - s) * 60}px) scale(${(0.92 + 0.08 * s) * (active && shown ? 1.03 : 1)})` : undefined,
              padding: '38px 36px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
              {shown && (
                <>
                  <div style={{ width: 92, height: 92, borderRadius: '50%', background: m.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s}) rotate(${(1 - s) * -40}deg)` }}>{m.icon}</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.6, color: color.ink }}>{m.title}</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, lineHeight: 1.25, color: color.ink2, opacity: 1 - 0.0 * lift }}>{m.desc}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 'auto', flexWrap: 'wrap' }}>
                    {m.tiles.map((k, j) => {
                      const st = spring({ frame: frame - a - 10 - j * 4, fps, config: { damping: 13, stiffness: 200 } });
                      return <PlatTile key={k} k={k} size={72} style={{ opacity: st, transform: `translateY(${(1 - st) * 26}px) scale(${0.7 + 0.3 * st})` }} />;
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
        {/* La cuenta: media hora al día ≈ 15 h al mes */}
        {frame >= fMedia - 8 && (
          <div style={{ position: 'absolute', left: x0, width: 4 * W + 3 * G, top: 760, height: 220, borderRadius: 34, background: color.ink, color: '#fff', display: 'flex', alignItems: 'center', gap: 46, padding: '0 56px', boxSizing: 'border-box',
            opacity: sCalc, transform: `translateY(${(1 - sCalc) * 80}px)`, boxShadow: '0 40px 90px rgba(16,16,16,0.28)' }}>
            <ClockFace size={150} turns={interpolate(frame, [fMedia, fQuince + 6], [0, 30], { ...clamp, easing: easeOut })} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, letterSpacing: -1.5 }}>30 min al día</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 56, color: 'rgba(255,255,255,0.5)' }}>≈</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -5, color: color.yellow, fontVariantNumeric: 'tabular-nums' }}>{Math.round(hours)} h</span>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44 }}>al mes</span>
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fLo} volume={0.5} />
      {fWords.map((f, i) => <Sfx key={i} name="card_flip" at={f - 2} volume={0.7} />)}
      {MODELS.flatMap((m, i) => m.tiles.map((_, j) => <Sfx key={`${i}-${j}`} name="tick_soft" at={fWords[i] + 8 + j * 4} volume={0.4} />))}
      <Sfx name="whoosh_fast" at={fMedia - 4} volume={0.7} />
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fMedia + 4, fQuince + 6], [0, 15], { ...clamp, easing: easeOut })))} from={fMedia + 4} to={fQuince + 8} volume={0.8} />
      <Sfx name="hit_soft" at={fQuince + 6} volume={0.8} />
    </MpStage>
  );
};

// Esfera de reloj con la aguja dando `turns` vueltas (para «media hora al día»).
export const ClockFace: React.FC<{ size: number; turns: number; dark?: boolean }> = ({ size, turns, dark = true }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill={dark ? '#1f1f1f' : '#fff'} stroke={color.yellow} strokeWidth="4" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={50 + Math.sin(a) * 36} y1={50 - Math.cos(a) * 36} x2={50 + Math.sin(a) * 41} y2={50 - Math.cos(a) * 41} stroke={dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)'} strokeWidth="2.4" strokeLinecap="round" />;
    })}
    {/* Media hora coloreada */}
    <path d={`M50 50 L50 8 A42 42 0 0 1 50 92 Z`} fill="rgba(255,202,5,0.22)" />
    <line x1="50" y1="50" x2={50 + Math.sin(turns * Math.PI * 2) * 34} y2={50 - Math.cos(turns * Math.PI * 2) * 34} stroke={color.yellow} strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="5" fill={color.yellow} />
  </svg>
);

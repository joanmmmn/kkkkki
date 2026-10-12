import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CarIcon, CastIcon, EreaderIcon, PdfIcon, WatchIcon } from '../../components/Icons2';
import { LogoIcon } from '../../components/Logo';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { BrowserWindow } from '../../components/BrowserWindow';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AppPhone, Chip, LinkBadge, MaskTitle, Sheen } from './kit';
import { Kicker } from './App';

type P = SceneProps;

// Fase en carrusel: entra desde la derecha y sale hacia la izquierda.
const phaseStyle = (frame: number, from: number, to: number) => {
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: easeInOut });
  return {
    visible: frame >= from - 4 && frame <= to + 2,
    style: { opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`, filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined } as React.CSSProperties,
  };
};

// R11 · Más allá del móvil: coche, reloj, AirPlay y lectores InkBOOK (la que suena se adelanta); Kindle y Kobo, no.
export const R11Extras: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R11', w, n);
  const items = [
    { f: at('carplay'), icon: <CarIcon size={96} />, title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('relojes'), icon: <WatchIcon size={96} />, title: 'En el reloj', sub: 'Wear OS' },
    { f: at('airplay'), icon: <CastIcon size={96} />, title: 'En tus altavoces', sub: 'AirPlay' },
    { f: at('lectores'), icon: <EreaderIcon size={96} />, title: 'Tinta electrónica', sub: 'Lectores InkBOOK' },
  ];
  const fNo = at('kindle');
  const sNo = spring({ frame: frame - fNo, fps, config: { damping: 11, stiffness: 200 } });
  const shake = frame >= fNo + 4 && frame < fNo + 18 ? Math.sin((frame - fNo - 4) * 1.9) * (14 - (frame - fNo - 4)) * 0.9 : 0;
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskTitle text="Más allá del móvil" hi="móvil" at={2} size={90} align="center" />
        <div style={{ display: 'flex', gap: 34, marginTop: 70, perspective: 2000 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 4, fps, config: { damping: 15, stiffness: 160 } });
            const next = i < items.length - 1 ? items[i + 1].f : fNo;
            const act = interpolate(frame, [it.f, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
            return (
              <div key={it.title} style={{ position: 'relative', width: 360, height: 390 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 44, border: '3px dashed #DADADA', opacity: interpolate(frame, [6 + i * 4, 16 + i * 4], [0, 1], clamp) * (1 - s) }} />
              <div style={{ position: 'relative', width: 360, height: 390, borderRadius: 44, background: '#fff', boxShadow: `0 0 0 ${5 * act}px ${color.yellow}, ${shadow.card}`, border: `1px solid ${color.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
                opacity: s, transform: `translateY(${(1 - s) * 80 - 16 * act}px) rotateY(${(1 - s) * (i % 2 ? 30 : -30)}deg) scale(${1 + 0.03 * act})` }}>
                <Sheen at={it.f + 2} tint="rgba(255,214,60,0.30)" />
                <div style={{ width: 164, height: 164, borderRadius: '50%', background: act > 0.5 ? color.yellow : color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, letterSpacing: -0.6 }}>{it.title}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 29, color: color.ink2 }}>{it.sub}</div>
              </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px', borderRadius: 999, background: '#fff', border: `3px solid ${color.red}`, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink,
          opacity: sNo, transform: `translateX(${shake}px) scale(${0.8 + 0.2 * sNo})`, boxShadow: shadow.float }}>
          <CrossIcon size={50} /> En Kindle y en Kobo, no
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f} volume={0.8} />)}
      <Sfx name="cross" at={fNo} />
    </Stage>
  );
};

// R12 · ¿Tus PDF? Un PDF intenta entrar en el móvil y rebota: Nextory solo abre su catálogo.
// Después, nuestro vídeo de ElevenReader (que sí lee tus PDF en voz alta), con el enlace en la descripción.
export const R12Pdf: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R12', w, n);
  const fPdf = at('pdf');
  const fNo = at('aqui');
  const fCat = at('catalogo');
  const fSi = at('si', 1);
  const fEleven = at('elevenreader');
  const fPuede = at('puede');
  const fTenemos = at('tenemos');
  const fDejamos = at('dejamos');
  // Trayectoria del PDF: entra desde la izquierda hacia la pantalla, choca y rebota hacia abajo a la izquierda.
  const hit = fNo;
  const pIn = interpolate(frame, [fPdf - 16, hit], [0, 1], { ...clamp, easing: easeInOut });
  const pOut = interpolate(frame, [hit, hit + 26], [0, 1], { ...clamp, easing: easeOut });
  const x = -520 + 470 * pIn - 260 * pOut;
  const y = -40 * pIn + 180 * pOut * pOut;
  const rot = -10 + 10 * pIn - 40 * pOut;
  const shake = frame >= hit && frame < hit + 10 ? Math.sin((frame - hit) * 2.4) * (10 - (frame - hit)) : 0;
  const sX = spring({ frame: frame - hit, fps, config: { damping: 11, stiffness: 220 } });
  const sCat = spring({ frame: frame - fCat + 4, fps, config: { damping: 16, stiffness: 160 } });
  const A = phaseStyle(frame, -10, fSi - 4);
  const B = phaseStyle(frame, fSi - 4, dur + 20);
  const sCard = spring({ frame: frame - fEleven + 8, fps, config: { damping: 15, stiffness: 120 } });
  const ring = interpolate(frame, [fTenemos - 2, fTenemos + 10, fTenemos + 40], [0, 1, 0.65], clamp);
  const play = spring({ frame: frame - fTenemos, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <Stage tone="warm">
      {A.visible && (
        <AbsoluteFill style={A.style}>
          <div style={{ position: 'absolute', left: 1120, top: 66, transform: `translateX(${shake}px)` }}>
            <AppPhone rec="01_inicio" startAt={4} w={430} cam={[{ f: 0, rx: 4, ry: -14, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 3, ry: -10, rz: 0.5, s: 1.02, x: 0, y: 0 }]} float={[0, dur + 24]} />
            <div style={{ position: 'absolute', left: '50%', top: '44%', transform: `translate(-50%, -50%) scale(${sX})`, opacity: sX }}>
              <CrossIcon size={200} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1160, top: 480, transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, opacity: interpolate(frame, [fPdf - 16, fPdf - 8], [0, 1], clamp) * interpolate(frame, [hit + 20, hit + 30], [1, 0], clamp) }}>
            <div style={{ width: 220, height: 272, borderRadius: 26, background: '#fff', boxShadow: shadow.float, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PdfIcon size={176} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 820, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MaskTitle text="¿Y tus propios PDF?" hi="PDF?" at={2} size={104} />
            <div style={{ marginTop: 44, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 16, padding: '18px 34px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
              opacity: sCat, transform: `translateY(${(1 - sCat) * 30}px)` }}>
              Nextory solo abre su catálogo
            </div>
          </div>
        </AbsoluteFill>
      )}
      {B.visible && (
        <AbsoluteFill style={B.style}>
          <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 740, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Kicker at={fSi} text="¿Quieres escucharlos?" />
            <MaskTitle text={'ElevenReader sí\u00A0puede'} hi={'sí\u00A0puede'} at={fEleven - 4} size={96} />
            <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
              <Chip at={fPuede} label="Lee tus PDF en voz alta" icon={<HeadphonesIcon size={32} />} size={38} reserve />
              <LinkBadge at={fDejamos - 2} size={36} reserve />
            </div>
          </div>
          <div style={{ position: 'absolute', right: 140, top: 190, width: 880, perspective: 2400 }}>
            <div style={{ transform: `rotateY(${(1 - sCard) * -24 - 4}deg) translateY(${(1 - sCard) * 60}px) scale(${0.9 + 0.1 * sCard})`, opacity: sCard, transformOrigin: '100% 50%' }}>
              <div style={{ borderRadius: 30, overflow: 'hidden', position: 'relative', boxShadow: `0 0 0 ${6 * ring}px ${color.yellow}, 0 50px 110px rgba(16,16,16,0.25)` }}>
                <Img src={staticFile('nxr/img/er_thumb.jpg')} style={{ width: 880, height: 495, display: 'block' }} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 130, height: 130, marginLeft: -65, marginTop: -65, borderRadius: '50%', background: 'rgba(16,16,16,0.82)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * play})`, opacity: play, boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill={color.yellow} /></svg>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 26, alignItems: 'flex-start' }}>
                <LogoIcon size={58} />
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, lineHeight: 1.18, letterSpacing: -0.4 }}>ElevenReader: ¿merece la pena? Lo probamos por dentro</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, marginTop: 8 }}>SonorBooks · Reseña en vídeo</div>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_fast" at={fPdf - 10} />
      <Sfx name="impact" at={hit} />
      <Sfx name="fail" at={hit + 2} />
      <Sfx name="whoosh_soft" at={fSi - 6} />
      <Sfx name="ui_pop" at={fPuede} />
      <Sfx name="sparkle" at={fTenemos} />
      <Sfx name="ui_pop" at={fDejamos} />
    </Stage>
  );
};

// R13 · Lo bueno y lo malo: dos columnas con cuatro huecos cada una que se llenan al ritmo de la voz;
// la columna que no suena se queda en segundo plano y la línea que suena se ilumina.
export const R13ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R13', w, n);
  const pros = [
    { f: at('ebooks'), t: 'Ebooks y audiolibros en una app' },
    { f: at('plan'), t: 'Plan barato para empezar: 5,99 €' },
    { f: at('cuatro'), t: '4 perfiles, con modo infantil' },
    { f: at('horas'), t: 'Las horas sin gastar se guardan' },
  ];
  const cons = [
    { f: at('limite'), t: 'Límite de horas en Mini y Standard' },
    { f: at('web'), t: 'Sin web ni app de ordenador' },
    { f: at('subir'), t: 'No puedes subir tus archivos' },
    { f: at('cancelas'), t: 'Cancelar la prueba corta el acceso' },
  ];
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const col = (title: string, good: boolean, list: { f: number; t: string }[], k: number) => {
    const s = spring({ frame: frame - 2 - k * 5, fps, config: { damping: 16, stiffness: 140 } });
    // En segundo plano mientras suena la otra columna.
    const dim = good ? interpolate(frame, [fMalo - 6, fMalo + 6], [0, 1], clamp) : interpolate(frame, [fMalo - 6, fMalo + 6], [1, 0], clamp);
    const hc = good ? color.green : color.red;
    const tint = good ? 'rgba(31,157,85,0.09)' : 'rgba(229,72,77,0.08)';
    const head = spring({ frame: frame - (good ? fBueno : fMalo) + 2, fps, config: { damping: 12, stiffness: 200 } });
    return (
      <div style={{ width: 790, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden',
        opacity: s * (1 - 0.5 * dim), transform: `translateY(${(1 - s) * 70}px) scale(${1 - 0.03 * dim})`, filter: dim > 0.05 ? `saturate(${1 - 0.6 * dim})` : undefined }}>
        <div style={{ padding: '28px 44px', background: hc, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 52, display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ transform: `scale(${0.7 + 0.3 * head}) rotate(${(1 - head) * -60}deg)`, display: 'inline-flex' }}>{good ? <CheckIcon size={56} c="#fff" fg={hc} /> : <CrossIcon size={56} c="#fff" fg={hc} />}</span>
          {title}
        </div>
        <div style={{ padding: '14px 26px 22px' }}>
          {list.map((it, i) => {
            const si = spring({ frame: frame - it.f + 3, fps, config: { damping: 15, stiffness: 190 } });
            const next = i < list.length - 1 ? list[i + 1].f : good ? fMalo : dur + 40;
            const act = interpolate(frame, [it.f, it.f + 6, next - 6, next], [0, 1, 1, 0], clamp);
            return (
              <div key={i} style={{ position: 'relative', height: 92, borderBottom: i < list.length - 1 ? `1px solid ${color.line}` : 'none', display: 'flex', alignItems: 'center' }}>
                {/* hueco vacío hasta que llega la línea */}
                <div style={{ position: 'absolute', left: 18, right: 120, height: 16, borderRadius: 8, background: '#F2F2F2', opacity: 1 - si }} />
                <div style={{ position: 'absolute', inset: '8px 0', borderRadius: 20, background: tint, opacity: act }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, padding: '0 18px', opacity: si, transform: `translateX(${(1 - si) * (good ? -36 : 36)}px)` }}>
                  <span style={{ display: 'inline-flex', transform: `scale(${0.5 + 0.5 * si})` }}>{good ? <CheckIcon size={46} /> : <CrossIcon size={46} />}</span>
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 38, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 48, transform: 'scale(1.1)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f} />)}
      <Sfx name="whoosh_soft" at={fMalo - 10} />
      <Sfx name="hit_soft" at={fMalo} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f} volume={0.9} />)}
    </Stage>
  );
};

// Ventana de navegador inclinada en 3D (flota con un leve vaivén).
export const TiltWindow: React.FC<{ width: number; url: string; ry?: number; rx?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, url, ry = -8, rx = 4, children, style }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 40) * 0.6;
  return (
    <div style={{ perspective: 2600, ...style }}>
      <div style={{ transform: `rotateY(${ry + wob}deg) rotateX(${rx - wob * 0.4}deg)`, transformStyle: 'preserve-3d' }}>
        <BrowserWindow width={width} url={url}>{children}</BrowserWindow>
      </div>
    </div>
  );
};

// R14 · Veredicto: para quién merece la pena y, antes de pagar, buscar el libro en SonorBooks:
// la ficha dice en qué plataformas está (aquí, Nextory y audiobooks.com).
export const R14Veredicto: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R14', w, n);
  const fSi = at('alternas');
  const fPoco = at('poco');
  const fAntes = at('antes');
  const fBusca = at('busca');
  const fSonor = at('sonorbooks');
  const fVer = at('ver');
  const fNext = at('nextory');
  const fOtra = at('otra');
  const s1 = spring({ frame: frame - fSi + 4, fps, config: { damping: 16, stiffness: 160 } });
  const s2 = spring({ frame: frame - fPoco + 4, fps, config: { damping: 16, stiffness: 160 } });
  const A = phaseStyle(frame, -10, fAntes - 2);
  const B = phaseStyle(frame, fAntes - 2, dur + 20);
  const sWin = spring({ frame: frame - fAntes + 2, fps, config: { damping: 18, stiffness: 120 } });
  const typeAt = fBusca + 4;
  const query = 'Cómo dejar de pensar demasiado';
  const typed = Math.max(0, Math.min(query.length, Math.floor(((frame - typeAt) / fps) * 24)));
  const fichaAt = Math.max(typeAt + 40, fSonor + 6);
  // Cámara: en la portada, sobre el buscador; en la ficha, de la página entera a las «Opciones analizadas».
  const camHome: CamKey[] = [{ f: 0, zoom: 1.25, x: 960, y: 420 }, { f: 24, zoom: 1.7, x: 960, y: 380 }, { f: 200, zoom: 1.75, x: 960, y: 375 }];
  const fv = fichaAt;
  const camFicha: CamKey[] = [{ f: 0, zoom: 1.12, x: 1040, y: 560 }, { f: Math.max(14, fVer - 8 - fv), zoom: 1.2, x: 1100, y: 600 }, { f: Math.max(34, fVer + 16 - fv), zoom: 2.25, x: 1285, y: 812 }, { f: 400, zoom: 2.3, x: 1285, y: 812 }];
  const card = (s: number, icon: React.ReactNode, a: string, b: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '30px 44px', borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, width: 1400, boxSizing: 'border-box',
      opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      <div style={{ fontFamily: font.sans, fontSize: 42, color: color.ink2, fontWeight: 500, flex: 1, whiteSpace: 'nowrap' }}>{a}</div>
      <svg width="64" height="32" viewBox="0 0 60 30" style={{ flexShrink: 0 }}><path d="M4 15h46M40 5l10 10-10 10" stroke={color.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ fontFamily: font.sans, fontSize: 44, color: color.ink, fontWeight: 700, padding: '12px 28px', borderRadius: 999, background: color.yellow, whiteSpace: 'nowrap', flexShrink: 0 }}>{b}</div>
    </div>
  );
  const sQ = spring({ frame: frame - fNext + 2, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <Stage tone="warm">
      {A.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...A.style }}>
          <MaskTitle text="¿Merece la pena?" hi="pena?" at={2} size={112} align="center" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 64 }}>
            {card(s1, <CheckIcon size={64} />, 'Si alternas leer y escuchar en español', 'Muy completo por < 10 €')}
            {card(s2, <CheckIcon size={64} c={color.ink} />, 'Si escuchas poco', 'El Mini te basta')}
          </div>
        </AbsoluteFill>
      )}
      {B.visible && (
        <AbsoluteFill style={B.style}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 54, display: 'flex', justifyContent: 'center' }}>
            <Kicker at={fAntes} text="Antes de pagar" style={{ marginBottom: 0 }} />
          </div>
          <div style={{ position: 'absolute', left: 230, top: 112, opacity: sWin, transform: `translateY(${(1 - sWin) * 60}px) scale(${0.94 + 0.06 * sWin})` }}>
            <TiltWindow width={1460} url="sonorbooks.com" ry={-3} rx={2}>
              {frame < fichaAt ? (
                <Sequence from={fAntes - 6} layout="none">
                  <ScreenClip image src="nx/rec/00_home/first.jpg" width={1460} camera={camHome} showCursor={false}
                    overlay={() => (
                      <div style={{ position: 'absolute', left: 718, top: 340, width: 380, height: 48, background: '#fff', display: 'flex', alignItems: 'center', fontFamily: font.sans, fontSize: 19, color: '#1a1a1a' }}>
                        {query.slice(0, typed)}<span style={{ opacity: Math.floor(frame / 12) % 2 === 0 || typed < query.length ? 1 : 0, marginLeft: 1 }}>|</span>
                      </div>
                    )} />
                </Sequence>
              ) : (
                <Sequence from={fichaAt} layout="none">
                  <ScreenClip image src="nx/rec/10_hook_ficha/last.jpg" width={1460} camera={camFicha} showCursor={false} markDim={0.6}
                    marks={[{ from: fVer - fichaAt, to: dur + 20 - fichaAt, x: 952, y: 772, w: 668, h: 96, r: 18 }]} />
                </Sequence>
              )}
            </TiltWindow>
          </div>
          {frame >= fNext - 2 && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
                opacity: sQ, transform: `translateY(${(1 - sQ) * 30}px)`, boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
                ¿Está en Nextory <span style={{ color: color.yellow }}>o en otra plataforma?</span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fSi} />
      <Sfx name="ui_pop" at={fPoco} />
      <Sfx name="whoosh_soft" at={fAntes - 4} />
      <Sfx name="typing" at={typeAt} trimAfter={70} />
      <Sfx name="swipe" at={fichaAt} />
      <Sfx name="zoom_in" at={fVer - 6} volume={0.5} />
      <Sfx name="success" at={fOtra} volume={0.8} />
    </Stage>
  );
};

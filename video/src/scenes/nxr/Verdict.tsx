import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { CarIcon, CastIcon, EreaderIcon, PdfIcon, SearchIcon, WatchIcon } from '../../components/Icons2';
import { LogoIcon } from '../../components/Logo';
import { Typewriter } from '../../components/Kinetic';
import { NextoryLogo } from '../nx/common';
import { wf } from './timeline';
import { AppPhone, BigTitle } from './kit';

type P = { lead: number; dur: number };

// R11 · Más allá del móvil: coche, reloj, AirPlay y lectores InkBOOK; Kindle y Kobo, no.
export const R11Extras: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R11', w, n);
  const items = [
    { f: at('carplay'), icon: <CarIcon size={92} />, title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('relojes'), icon: <WatchIcon size={92} />, title: 'En el reloj', sub: 'Wear OS' },
    { f: at('airplay'), icon: <CastIcon size={92} />, title: 'En tus altavoces', sub: 'AirPlay' },
    { f: at('lectores'), icon: <EreaderIcon size={92} />, title: 'Tinta electrónica', sub: 'Lectores InkBOOK' },
  ];
  const fNo = at('kindle');
  const sNo = spring({ frame: frame - fNo, fps, config: { damping: 13, stiffness: 190 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
        <BigTitle text="Más allá del móvil" hi="móvil" at={lead} size={84} align="center" />
        <div style={{ display: 'flex', gap: 30, marginTop: 70 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 3, fps, config: { damping: 15, stiffness: 160 } });
            return (
              <div key={it.title} style={{ width: 340, height: 360, borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
                opacity: s, transform: `translateY(${(1 - s) * 70}px) rotate(${(1 - s) * (i % 2 ? 4 : -4)}deg)` }}>
                <div style={{ width: 150, height: 150, borderRadius: '50%', background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, letterSpacing: -0.5 }}>{it.title}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 27, color: color.ink2 }}>{it.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px', borderRadius: 999, background: '#fff', border: `2px solid ${color.red}`, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink,
          opacity: sNo, transform: `scale(${0.8 + 0.2 * sNo})` }}>
          <CrossIcon size={44} /> Kindle y Kobo, no
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f} volume={0.8} />)}
      <Sfx name="cross" at={fNo} />
    </Stage>
  );
};

// R12 · ¿Tus PDF? Un PDF intenta entrar en el móvil y rebota: Nextory solo abre su catálogo.
export const R12Pdf: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R12', w, n);
  const fPdf = at('pdf');
  const fNo = at('aqui');
  const fCat = at('catalogo');
  // Trayectoria: entra desde la izquierda hacia la pantalla, choca y rebota hacia abajo a la izquierda.
  const hit = fNo;
  const pIn = interpolate(frame, [fPdf - 16, hit], [0, 1], { ...clamp, easing: easeInOut });
  const pOut = interpolate(frame, [hit, hit + 26], [0, 1], { ...clamp, easing: easeOut });
  const x = -520 + 470 * pIn - 260 * pOut;
  const y = -40 * pIn + 180 * pOut * pOut;
  const rot = -10 + 10 * pIn - 40 * pOut;
  const shake = frame >= hit && frame < hit + 10 ? Math.sin((frame - hit) * 2.4) * (10 - (frame - hit)) : 0;
  const sX = spring({ frame: frame - hit, fps, config: { damping: 11, stiffness: 220 } });
  const sCat = spring({ frame: frame - fCat + 4, fps, config: { damping: 16, stiffness: 160 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', left: 1080, top: 110, transform: `translateX(${shake}px)` }}>
          <AppPhone rec="01_inicio" startAt={4} w={400} cam={[{ f: 0, rx: 4, ry: -14, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 3, ry: -10, rz: 0.5, s: 1.02, x: 0, y: 0 }]} />
          <div style={{ position: 'absolute', left: '50%', top: '42%', transform: `translate(-50%, -50%) scale(${sX})`, opacity: sX }}>
            <CrossIcon size={190} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1120, top: 470, transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, opacity: interpolate(frame, [fPdf - 16, fPdf - 8], [0, 1], clamp) * interpolate(frame, [hit + 20, hit + 30], [1, 0], clamp) }}>
          <div style={{ width: 210, height: 260, borderRadius: 24, background: '#fff', boxShadow: shadow.float, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PdfIcon size={170} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 150, top: 300, width: 760 }}>
          <BigTitle text="¿Y tus propios PDF?" hi="PDF?" at={lead} size={92} />
          <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 30px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36,
            opacity: sCat, transform: `translateY(${(1 - sCat) * 30}px)` }}>
            Solo títulos de su catálogo
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_fast" at={fPdf - 10} />
      <Sfx name="impact" at={hit} />
      <Sfx name="fail" at={hit + 2} />
    </Stage>
  );
};

// R13 · Lo bueno y lo malo: dos columnas que se llenan al ritmo de la voz.
export const R13ProsCons: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R13', w, n);
  const pros = [
    { f: at('ebooks'), t: 'Ebooks y audiolibros en una app' },
    { f: at('barato'), t: 'Plan barato para empezar (5,99 €)' },
    { f: at('cuatro'), t: '4 perfiles en todos los planes' },
    { f: at('infantil'), t: 'Modo infantil de verdad' },
  ];
  const cons = [
    { f: at('limite'), t: 'Límite de horas en Mini y Standard' },
    { f: at('web'), t: 'Sin web ni app de ordenador' },
    { f: at('subir'), t: 'No puedes subir tus archivos' },
    { f: at('cancelas'), t: 'Si cancelas en la prueba, pierdes el acceso' },
  ];
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const col = (title: string, good: boolean, f0: number, list: { f: number; t: string }[]) => {
    const s = spring({ frame: frame - f0 + 4, fps, config: { damping: 16, stiffness: 150 } });
    return (
      <div style={{ width: 760, borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
        <div style={{ padding: '26px 40px', background: good ? color.green : color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 46, display: 'flex', alignItems: 'center', gap: 18 }}>
          {good ? <CheckIcon size={50} c="#fff" /> : <CrossIcon size={50} c="#fff" />}{title}
        </div>
        <div style={{ padding: '18px 40px 28px' }}>
          {list.map((it, i) => {
            const si = spring({ frame: frame - it.f + 2, fps, config: { damping: 16, stiffness: 180 } });
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: i < list.length - 1 ? `1px solid ${color.line}` : 'none', opacity: si, transform: `translateX(${(1 - si) * (good ? -40 : 40)}px)` }}>
                {good ? <CheckIcon size={42} /> : <CrossIcon size={42} />}
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink, letterSpacing: -0.4 }}>{it.t}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 50, paddingTop: 60 }}>
        {col('Lo bueno', true, fBueno, pros)}
        {col('Lo malo', false, fMalo, cons)}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fBueno} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f} />)}
      <Sfx name="whoosh_soft" at={fMalo} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f} volume={0.9} />)}
    </Stage>
  );
};

// R14 · Veredicto: para quién merece la pena y, antes de pagar, buscar el libro en SonorBooks.
export const R14Veredicto: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R14', w, n);
  const fSi = at('alternas');
  const fPoco = at('poco');
  const fBusca = at('busca');
  const s1 = spring({ frame: frame - fSi + 4, fps, config: { damping: 16, stiffness: 160 } });
  const s2 = spring({ frame: frame - fPoco + 4, fps, config: { damping: 16, stiffness: 160 } });
  const shift = interpolate(frame, [fBusca - 12, fBusca + 6], [0, 1], { ...clamp, easing: easeInOut });
  const sB = spring({ frame: frame - fBusca, fps, config: { damping: 16, stiffness: 150 } });
  const card = (s: number, icon: React.ReactNode, a: string, b: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '28px 40px', borderRadius: 36, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, width: 1320,
      opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
      {icon}
      <div style={{ fontFamily: font.sans, fontSize: 40, color: color.ink2, fontWeight: 500, flex: 1, whiteSpace: 'nowrap' }}>{a}</div>
      <svg width="60" height="30" viewBox="0 0 60 30" style={{ flexShrink: 0 }}><path d="M4 15h46M40 5l10 10-10 10" stroke={color.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ fontFamily: font.sans, fontSize: 40, color: color.ink, fontWeight: 700, padding: '10px 24px', borderRadius: 999, background: color.yellow, whiteSpace: 'nowrap', flexShrink: 0 }}>{b}</div>
    </div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150, transform: `translateY(${-shift * 40}px) scale(${1 - 0.1 * shift})`, transformOrigin: '50% 0%', opacity: 1 - 0.55 * shift }}>
        <BigTitle text="¿Merece la pena?" hi="pena?" at={lead} size={104} align="center" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 60 }}>
          {card(s1, <CheckIcon size={58} />, 'Si alternas leer y escuchar en español', 'Muy completo por < 10 €')}
          {card(s2, <CheckIcon size={58} c={color.ink} />, 'Si escuchas poco', 'El Mini te basta')}
        </div>
      </AbsoluteFill>
      {frame >= fBusca - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, width: 1100, padding: '26px 34px', borderRadius: 999, background: '#fff', boxShadow: '0 30px 80px rgba(16,16,16,0.16)', border: `3px solid ${color.yellow}`,
            opacity: sB, transform: `translateY(${(1 - sB) * 60}px) scale(${0.94 + 0.06 * sB})` }}>
            <LogoIcon size={60} />
            <div style={{ fontFamily: font.sans, fontSize: 40, color: color.ink, flex: 1 }}>
              <Typewriter text="Cómo dejar de pensar demasiado" start={fBusca + 10} cps={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 999, background: color.ink }}>
              <SearchIcon size={34} c="#fff" />
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink2,
            opacity: interpolate(frame, [fBusca + 50, fBusca + 62], [0, 1], clamp) }}>
            Disponible en <NextoryLogo width={150} />
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fSi} />
      <Sfx name="ui_pop" at={fPoco} />
      <Sfx name="whoosh_soft" at={fBusca - 6} />
      <Sfx name="typing" at={fBusca + 10} />
      <Sfx name="success" at={fBusca + 52} />
    </Stage>
  );
};

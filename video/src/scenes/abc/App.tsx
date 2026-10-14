import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, HeadphonesIcon } from '../../components/Icons';
import { ClockIcon, DownloadIcon, GlobeIcon, ListIcon, MoonIcon, SpeedIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AB, AB_DEEP, AB_SOFT, align, AppFeatureScene, CreditCoin, markOn, Odometer, odometerShown, Shot, tapAt } from './kit';
import { FlagES, FlagGB } from './Intro';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;
type IP = { size?: number; c?: string };
const FilterIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" />
  </svg>
);
const GearIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
  </svg>
);
const NoteIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3.5h9l3.5 3.5v13.5H6z" /><path d="M9 11h6" /><path d="M9 15h4" />
  </svg>
);

// D05 · La trampa del buscador: por defecto solo enseña libros en inglés (el aviso real: «By default, only English-language books
// are shown…»). Para ver los de español, el filtro de idioma en cada búsqueda (Filters → Language → Spanish) o, en Ajustes,
// la opción «Only show English-language results».
export const D05Trampa: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D05', w, n);
  const fTrampa = at('trampa');
  const fDefecto = at('defecto');
  const fBuscador = at('buscador');
  const fSolo = at('solo');
  const fPara = at('para');
  const fFiltra = at('filtra');
  const fIdioma = at('idioma');
  const fCada = at('cada');
  const fDesact = at('desactivalo');
  // «elon musk» tecleado (sugerencias) y, a los 15,8 s de la toma, los resultados en inglés con el aviso: caen con «buscador».
  const s0 = align('elon_buscar_en', 15.9, fBuscador, fBuscador, { hold: 36 });
  s0.marks = [markOn(s0, fSolo - 2, fFiltra - 8, 14, 294, 628, 232, 26)];
  // El filtro: el panel (Language: English), la lista de idiomas y los resultados con «Spanish ×».
  const s1: Shot = { rec: 'elon_filtro_es', at: fFiltra - 8, start: 5.0, hold: 5.04 };
  s1.marks = [markOn(s1, fFiltra, fIdioma + 12, 14, 1144, 636, 110, 28)];
  const s2: Shot = { rec: 'elon_filtro_es', at: fIdioma + 14, start: 11.0, hold: 11.04, fade: 0 };
  s2.marks = [markOn(s2, fIdioma + 18, fCada + 10, 14, 244, 636, 86, 20)];
  const s3: Shot = { rec: 'elon_filtro_es', at: fCada + 12, start: 20.0, hold: 30, fade: 0 };
  s3.marks = [markOn(s3, fCada + 14, fDesact - 8, 16, 292, 158, 64, 32)];
  // Ajustes: «Only show English-language results» (activado por defecto).
  const s4: Shot = { rec: 'ajustes_ingles', at: fDesact - 6, start: 4.0, hold: 16 };
  s4.marks = [markOn(s4, fDesact + 2, p.dur + 20, 12, 814, 640, 92, 24)];
  return (
    <AppFeatureScene {...p} id="D05" title="La trampa del buscador" hi="trampa" kicker="Ojo" shots={[s0, s1, s2, s3, s4]} titleSize={92} tagSize={42} tagGap={18}
      taps={[{ f: fIdioma + 10, x: 330, y: 1200 }, { f: fCada + 8, x: 140, y: 288 }]}
      focus={[
        { from: fTrampa, to: fSolo - 4, y: 300, s: 1.08 },
        { from: fSolo, to: fFiltra - 10, y: 420, s: 1.3 },
        { from: fCada + 14, to: fDesact - 8, y: 330, s: 1.22 },
        { from: fDesact + 2, to: p.dur, y: 860, s: 1.35 },
      ]}
      tags={[
        { word: 'defecto', label: 'Por defecto, solo en inglés', icon: ic(<FlagGB w={40} />) },
        { word: 'filtra', label: 'Filtra por idioma', sub: 'En cada búsqueda', icon: ic(<FilterIcon size={32} />) },
        { word: 'desactivalo', label: 'O desactívalo en Ajustes', sub: '«Only show English-language results»', icon: ic(<GearIcon size={32} />) },
      ]}
      overlay={<><Sfx name="hit_soft" at={fTrampa} volume={0.5} /><Sfx name="tick_soft" at={fDefecto} volume={0.4} /><Sfx name="ui_pop" at={fPara} volume={0.3} /></>} />
  );
};

// D06 · Fichas y muestras: narrador (Raúl Lloréns) y duración (32 h 48 min) de Los tres mundos, su muestra (5:04) antes de gastar el
// crédito («Use Credit»), y el nuestro: Elon Musk, de Walter Isaacson, en español (24 h 33 min).
export const D06Fichas: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('D06', w, n);
  const fFicha = at('ficha');
  const fQuien = at('quien');
  const fCuanto = at('cuanto');
  const fMuestra = at('muestra');
  const fCinco = at('cinco');
  const fGastar = at('gastar');
  const fNosotros = at('nosotros');
  const fUsamos = at('usamos');
  const fWalter = at('walter');
  const fMas = at('mas');
  const fVeinti = at('veinticuatro');
  const fEspanol = at('espanol');
  const s0: Shot = { rec: 'tres_mundos_ficha', at: 0, start: 2.0, hold: 12 };
  s0.marks = [markOn(s0, fQuien - 2, fCuanto - 6, 322, 1004, 312, 96, 18)];
  const s1: Shot = { rec: 'tres_mundos_ficha', at: fCuanto - 6, start: 15.0, hold: 25 };
  s1.marks = [markOn(s1, fCuanto, fMuestra - 6, 322, 1048, 312, 96, 18)];
  // La muestra: el reproductor de la muestra («4 minutes Remaining · 00:05:04») con el botón «Use Credit» encima.
  const s2: Shot = { rec: 'tres_mundos_muestra', at: fMuestra - 6, start: 3.0, hold: 20 };
  s2.marks = [markOn(s2, fCinco - 4, fGastar - 6, 10, 990, 644, 100, 20), markOn(s2, fGastar - 2, fNosotros - 6, 0, 922, 664, 68, 12)];
  // Nuestro crédito: el diálogo real «Would you like to use 1 audiobook credit to claim '[Spanish] - Elon Musk…'?».
  const s3: Shot = { rec: 'elon_credito', at: fNosotros - 6, start: 3.0, hold: 21 };
  s3.marks = [markOn(s3, fUsamos - 2, fWalter - 6, 62, 544, 524, 384, 22)];
  const s4: Shot = { rec: 'elon_ficha', at: fWalter - 6, start: 3.0, hold: 20 };
  s4.marks = [markOn(s4, fWalter, fMas - 6, 22, 918, 620, 96, 18)];
  // Ficha desplazada: «Spanish» y «Duration · 24 hours 33 minutes».
  const s5: Shot = { rec: 'elon_ficha', at: fMas - 6, start: 24.0, hold: 39 };
  s5.marks = [markOn(s5, fMas, p.dur + 20, 12, 988, 640, 134, 22)];
  const sCard = spring({ frame: frame - (fMas - 6), fps, config: { damping: 14, stiffness: 170 } });
  return (
    <AppFeatureScene {...p} id="D06" title="Fichas y muestras" hi="muestras" side="left" shots={[s0, s1, s2, s3, s4, s5]} titleSize={100} tagSize={42} tagGap={18}
      focusExtra={[{ from: fFicha, to: fQuien - 4, y: 900, s: 1.06 }]}
      tags={[
        { word: 'quien', label: 'Quién lo narra y cuánto dura', icon: ic(<UserIcon size={32} />) },
        { word: 'muestra', label: 'Una muestra de unos 5 minutos', sub: 'Antes de gastar el crédito', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'nosotros', label: 'Nuestro crédito: Elon Musk', sub: 'De Walter Isaacson', icon: ic(<CreditCoin size={40} />) },
      ]}
      extra={
        frame >= fMas - 8 ? (
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 30px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, alignSelf: 'flex-start',
            opacity: sCard, transform: `translateY(${((1 - sCard) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <ClockIcon size={50} c={AB_DEEP} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <span style={{ fontSize: 36, color: color.ink2 }}>Más de</span>
              {frame >= fVeinti - 6 ? <Odometer text="24" at={fVeinti - 6} size={76} color={AB_DEEP} style={{ letterSpacing: -3 }} /> : <span style={{ fontSize: 76, color: '#E6E6E6' }}>00</span>}
              <span style={{ fontSize: 40, color: AB_DEEP }}>horas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 10px', borderRadius: 999, background: AB_SOFT, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink,
              opacity: interpolate(frame, [fEspanol - 4, fEspanol + 6], [0, 1], clamp) }}>
              <FlagES w={44} /> en español
            </div>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="ui_pop" at={fCuanto} volume={0.5} />
          <Sfx name="ui_pop" at={fGastar - 2} volume={0.5} />
          <Sfx name="coins" at={fUsamos + 2} volume={0.35} />
          <ChangeTicks value={(f) => odometerShown('24', fVeinti - 6, fps, f)} from={fVeinti - 6} to={fVeinti + 30} volume={0.45} />
          <Sfx name="tick_soft" at={fEspanol - 2} volume={0.6} />
        </>
      } />
  );
};

// D07 · Reproductor: hasta 4x (la hoja «Narration Speed» llega a 4x a los 15,0 s de la toma), temporizador para dormir (15 a 90
// minutos o fin de pista), pistas, marcadores con notas («Add a bookmark at 00:01:04?») y descargas («Downloaded»).
export const D07Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D07', w, n);
  const fRep = at('reproductor');
  const fCuatro = at('cuatro');
  const fTemp = at('temporizador');
  const fPistas = at('pistas');
  const fMarc = at('marcadores');
  const fDesc = at('descargas');
  const fConexion = at('conexion');
  const s0: Shot = { rec: 'elon_reproductor', at: 0, start: 3.0, hold: 16.4 };
  const s1 = align('elon_velocidad', 15.0, fCuatro + 6, 30, { hold: 18.4 });
  s1.marks = [markOn(s1, fCuatro, fTemp - 6, 80, 560, 504, 250, 22)];
  const s2: Shot = { rec: 'elon_temporizador', at: fTemp - 6, start: 3.0, hold: 12.4 };
  s2.marks = [markOn(s2, fTemp, fPistas - 6, 62, 432, 524, 604, 22)];
  const s3: Shot = { rec: 'elon_pistas', at: fPistas - 6, start: 4.0, hold: 14.6 };
  s3.marks = [markOn(s3, fPistas, fMarc - 6, 0, 150, 664, 640, 14)];
  const s4: Shot = { rec: 'elon_marcador', at: fMarc - 6, start: 3.0, hold: 12.4 };
  s4.marks = [markOn(s4, fMarc, fDesc - 6, 58, 542, 524, 380, 22)];
  const s5: Shot = { rec: 'biblioteca_elon', at: fDesc - 6, start: 3.0, hold: 14.5 };
  s5.marks = [markOn(s5, fDesc, p.dur + 20, 186, 1026, 300, 74, 37)];
  return (
    <AppFeatureScene {...p} id="D07" title="El reproductor" hi="reproductor" shots={[s0, s1, s2, s3, s4, s5]} tagSize={40} tagGap={14}
      focusExtra={[{ from: fRep, to: fCuatro - 8, y: 1000, s: 1.1 }]}
      tags={[
        { word: 'cuatro', label: 'Hasta 4x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        { word: 'pistas', label: 'Pistas', icon: ic(<ListIcon size={32} />) },
        { word: 'marcadores', label: 'Marcadores con notas', icon: ic(<NoteIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
      ]}
      overlay={<Sfx name="success" at={fConexion} volume={0.35} />} />
  );
};

// D08 · Lo que no esperábamos: con una cuenta gratis (sin suscripción), «over 10,000 free audiobooks» (la pantalla real de la
// cuenta gratuita), también en español: el Quijote (filtros «See Only Free Books» y «Spanish»; botón «Play», sin crédito).
export const D08Gratis: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('D08', w, n);
  const fEsper = at('esperabamos');
  const fCuenta = at('cuenta');
  const fSin = at('sin');
  const fDiez = at('diez');
  const fTambien = at('tambien');
  const fQuijote = at('quijote');
  const s0: Shot = { rec: 'cuenta_gratis', at: 0, start: 2.0, hold: 18 };
  s0.marks = [markOn(s0, fCuenta - 2, fTambien - 6, 34, 300, 596, 150, 22)];
  const s1: Shot = { rec: 'quijote_gratis', at: fTambien - 6, start: 21.0, hold: 33 };
  s1.marks = [markOn(s1, fTambien, fQuijote - 6, 16, 292, 448, 64, 32)];
  const s2: Shot = { rec: 'quijote_ficha', at: fQuijote - 6, start: 2.0, hold: 12.4 };
  s2.marks = [markOn(s2, fQuijote + 2, p.dur + 20, 16, 1064, 632, 78, 39)];
  const sNum = spring({ frame: frame - (fDiez - 8), fps, config: { damping: 14, stiffness: 170 } });
  const under = interpolate(frame, [fDiez + 26, fDiez + 40], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AppFeatureScene {...p} id="D08" title="Gratis, sin suscripción" hi="Gratis" kicker="Sorpresa" side="left" shots={[s0, s1, s2]} titleSize={92} tagSize={42} tagGap={18}
      focusExtra={[{ from: fEsper, to: fCuenta - 4, y: 600, s: 1.05 }]}
      tags={[
        { word: 'cuenta', label: 'Con una cuenta gratis', icon: ic(<UserIcon size={32} />) },
        { word: 'tambien', label: 'También en español', sub: 'Como el Quijote', icon: ic(<FlagES w={40} />) },
      ]}
      extra={
        frame >= fDiez - 10 ? (
          <div style={{ marginTop: 34, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 24, padding: '22px 34px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
            opacity: sNum, transform: `translateY(${((1 - sNum) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sNum).toFixed(4)})`, transformOrigin: 'left center' }}>
            <BookIcon size={58} c={AB} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ fontSize: 60 }}>+</span>
                <Odometer text="10.000" at={fDiez - 6} size={92} dur={34} stagger={3} style={{ letterSpacing: -4 }} />
                <div style={{ position: 'absolute', left: 30, right: 0, bottom: -8, height: 10, borderRadius: 5, background: AB, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: AB_DEEP, marginTop: 10 }}>audiolibros gratis</div>
            </div>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="sparkle" at={fEsper} volume={0.5} />
          <Sfx name="tick_soft" at={fSin} volume={0.5} />
          <ChangeTicks value={(f) => odometerShown('10.000', fDiez - 6, fps, f, 34, 3)} from={fDiez - 6} to={fDiez + 40} volume={0.45} />
          <Sfx name="hit_soft" at={fDiez + 28} volume={0.5} />
          <Sfx name="ui_tap" at={fQuijote + 2} volume={0.3} />
        </>
      } />
  );
};

export { GlobeIcon, tapAt };

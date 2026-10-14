import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import {
  BookmarkIcon, CalendarIcon, ChartIcon, ClockIcon, DownloadIcon, FontIcon, KidIcon, ListIcon, MoonIcon, SearchIcon, SpeedIcon, StarIcon, UserIcon,
} from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  align, AppFeatureScene, AppPhone, BB, BB_DEEP, BB_GREEN, BB_GREEN_SOFT, BB_INK, BB_RED, BB_SOFT, BB_YELLOW, BkbStage, buildPhoneCam, Chip, HoursMeter, markOn,
  MaskTitle, PH, PhoneHalo, PHONE_W, Shot, zoomPeaks,
} from './kit';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;
type IP = { size?: number; c?: string };
const GridIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </svg>
);
const FilterIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" />
  </svg>
);
const NoteIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3.5h9l3.5 3.5v13.5H6z" /><path d="M9 11h6" /><path d="M9 15h4" />
  </svg>
);
const TABS = { home: 66, inspiration: 199, categories: 332, search: 465, profile: 598 };
const TAB_Y = 1385;

// D06 · La portada (dónde lo dejaste, libros guardados y la racha de la semana), Inspiration (tendencias, muchas en inglés, y
// los «Top 100» de cada género) y Categories (géneros e idiomas).
export const D06Portada: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D06', w, n);
  const fPortada = at('portada');
  const fDonde = at('donde');
  const fLibros = at('libros');
  const fRacha = at('racha');
  const fInsp = at('inspiracion');
  const fTend = at('tendencias');
  const fMuchos = at('muchos');
  const fTop = at('top');
  const fCat = at('categorias');
  const fGen = at('generos');
  const fIdi = at('idiomas');
  // Portada: «Continue where you left off» (La Bestia).
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 1.0, hold: 30 };
  s0.marks = [markOn(s0, fDonde, fLibros - 8, 6, 126, 652, 748, 24)];
  // La portada baja (desplazamiento real de la toma a 1,7–2,3 s) hasta «My Weekly Streak» y «My Saved Books».
  const s1 = align('01_inicio_scroll', 2.5, fLibros, 40, { hold: 14.0 });
  s1.marks = [markOn(s1, fLibros + 2, fRacha - 6, 8, 330, 648, 470, 22), markOn(s1, fRacha, fInsp - 10, 8, 205, 648, 112, 20)];
  // Pestaña Inspiration (el cambio de pestaña de la toma, a los 0,8 s, cae justo antes de «inspiración»).
  const s2 = align('04_inspiration', 0.8, fInsp - 4, 30, { hold: 16.0 });
  s2.marks = [
    markOn(s2, fTend, fMuchos - 4, 8, 160, 648, 460, 22),
    markOn(s2, fMuchos, fTop - 6, 18, 215, 545, 405, 16),
    markOn(s2, fTop, fCat - 8, 8, 680, 648, 490, 22),
  ];
  // Categories: la cuadrícula de géneros y, más abajo, los idiomas (Svenska, Suomi, Deutsch, Italiano…).
  const s3: Shot = { rec: '05_categorias', at: fCat - 6, start: 1.0, hold: 12.5 };
  s3.marks = [markOn(s3, fGen, fIdi - 6, 6, 40, 652, 620, 22)];
  const s4: Shot = { rec: '05_categorias', at: fIdi - 6, start: 36.0, hold: 54.5 };
  s4.marks = [markOn(s4, fIdi, p.dur + 20, 6, 30, 652, 620, 22)];
  return (
    <AppFeatureScene {...p} id="D06" title="Portada e inspiración" kicker="La app" shots={[s0, s1, s2, s3, s4]} titleSize={96} tagSize={40} tagGap={14}
      taps={[{ f: fInsp - 6, x: TABS.inspiration, y: TAB_Y }, { f: fCat - 8, x: TABS.categories, y: TAB_Y }]}
      focusExtra={[{ from: fPortada, to: fDonde - 2, y: 520, s: 1.06 }]}
      tags={[
        { word: 'donde', label: 'Dónde lo dejaste', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'libros', label: 'Libros guardados', icon: ic(<BookmarkIcon size={32} />) },
        { word: 'racha', label: 'Tu racha de la semana', icon: ic(<ChartIcon size={32} />) },
        { word: 'tendencias', label: 'Tendencias', sub: 'Con muchos libros en inglés', icon: ic(<StarIcon size={32} />) },
        { word: 'top', label: 'Top 100 de cada género', icon: ic(<ListIcon size={32} />) },
        { word: 'categorias', label: 'Géneros e idiomas', icon: ic(<GridIcon size={32} />) },
      ]} />
  );
};

// Nota de la ficha por separado: La Sombra del Viento en la app (★ 4,5 «Book» y ★ 4,7 «Narration», 14/10/2026).
const SplitRating: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } });
  if (frame < at - 2) return <div style={{ height: 150 }} />;
  const item = (k: number, label: string, v: string, icon: React.ReactNode) => {
    const sk = spring({ frame: frame - at - 4 - k * 6, fps, config: { damping: 13, stiffness: 200 } });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 34px', borderLeft: k ? `1px solid ${color.line}` : 'none', opacity: sk, transform: `translateY(${((1 - sk) * 16).toFixed(2)}px)` }}>
        {icon}
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>{v}<span style={{ fontSize: 26, color: color.muted }}> / 5</span></div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink2 }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', padding: '22px 14px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, alignSelf: 'flex-start',
      opacity: s, transform: `translateY(${((1 - s) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, transformOrigin: 'left center' }}>
      {item(0, 'Historia', '4,5', <BookIcon size={34} c={BB_DEEP} />)}
      {item(1, 'Narración', '4,7', <HeadphonesIcon size={34} c={BB_DEEP} />)}
    </div>
  );
};

// D07 · Buscador y fichas: por título («s viento» → La Sombra del Viento), por autor o narrador (pestañas «Authors» y
// «Narrators» de los resultados de Carmen Mola), filtros de formato y categoría, y la ficha de La Sombra del Viento: narrador
// (Jordi Boixaderas), duración (17 h 44 min) y nota, con la de la historia («Book») y la de la narración por separado.
export const D07Buscar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D07', w, n);
  const fTitulo = at('titulo');
  const fAutor = at('autor');
  const fNarrador = at('narrador');
  const fFiltras = at('filtras');
  const fFormato = at('formato');
  const fCategoria = at('categoria');
  const fFicha = at('ficha');
  const fQuien = at('quien');
  const fCuanto = at('cuanto');
  const fNota = at('nota');
  const fHistoria = at('historia');
  // Buscador: «s viento» se escribe a los 28,2–29,1 s de la toma y salen las sugerencias (La Sombra del Viento…).
  const s0 = align('08_buscar_sombra', 29.3, fTitulo, 40, { hold: 39.5 });
  s0.marks = [markOn(s0, fTitulo - 6, fAutor - 6, 56, 50, 600, 96, 24)];
  // Resultados de «Carmen Mola» con las pestañas Books / Authors / Narrators.
  const s1: Shot = { rec: '07_mola', at: fAutor - 6, start: 2.5, hold: 12.5 };
  s1.marks = [markOn(s1, fAutor, fNarrador - 2, 252, 202, 122, 56, 10), markOn(s1, fNarrador, fFiltras - 4, 382, 202, 144, 56, 10)];
  // La hoja «Filter» (sube a los 12,6–12,9 s de la toma): Format (Audiobooks) y Category.
  const s2 = align('07_mola', 12.9, fFiltras + 4, 14, { hold: 23.3 });
  s2.marks = [markOn(s2, fFormato - 2, fCategoria - 4, 8, 376, 648, 130, 18), markOn(s2, fCategoria - 2, fFicha - 6, 8, 556, 648, 320, 18)];
  // Ficha: narrador, duración y nota (★ 4,5 Book · ★ 4,7 Narration).
  const s3: Shot = { rec: '09_sombra_ficha', at: fFicha - 6, start: 16.0, hold: 16.04 };
  s3.marks = [markOn(s3, fQuien - 2, fCuanto - 4, 8, 758, 648, 54, 12)];
  const s4: Shot = { rec: '09_sombra_ficha', at: fCuanto - 6, start: 22.0, hold: 22.04 };
  s4.marks = [markOn(s4, fCuanto - 2, fNota - 4, 8, 668, 648, 52, 12)];
  const s5: Shot = { rec: '09_sombra_ficha', at: fNota - 6, start: 16.0, hold: 16.04 };
  s5.marks = [markOn(s5, fNota - 2, p.dur + 20, 176, 532, 310, 96, 16)];
  const keys = [fTitulo - 22, ...Array.from({ length: 7 }, (_, i) => fTitulo - 10 + i)];
  return (
    <AppFeatureScene {...p} id="D07" title="Buscador y fichas" side="left" shots={[s0, s1, s2, s3, s4, s5]} keys={keys} titleSize={100}
      taps={[{ f: fFiltras - 14, x: 500, y: 350 }]}
      tags={[
        { word: 'titulo', label: 'Por título, autor o narrador', icon: ic(<SearchIcon size={32} />) },
        { word: 'filtras', label: 'Filtros de formato y categoría', icon: ic(<FilterIcon size={32} />) },
        { word: 'ficha', label: 'Narrador, duración y nota', icon: ic(<UserIcon size={32} />) },
      ]}
      extra={<SplitRating at={fHistoria - 4} />} />
  );
};

// D08 · Reproductor: velocidad hasta 2x (la rueda real: 1,90x y, la última, 2,00x), temporizador (15 a 45 min, fin del capítulo
// y la cuenta atrás), temporizador automático por la noche (de 21:00 a 2:00, 30 min), capítulos, marcadores con notas
// («Primer crimen») y descargas (La Bestia, 506 MB, en «Downloaded Books»).
export const D08Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D08', w, n);
  const fRep = at('reproductor');
  const fDos = at('dos');
  const fTemp = at('temporizador');
  const fDormir = at('dormir');
  const fIncluso = at('incluso');
  const fAct = at('activarse');
  const fSolo = at('solo');
  const fCap = at('capitulos');
  const fMarc = at('marcadores');
  const fDesc = at('descargas');
  const fCon = at('conexion');
  // Cada marca acaba antes de que entre la toma siguiente (si no, se dibuja sobre ella).
  const s0: Shot = { rec: '11_velocidad', at: 0, start: 32.0, hold: 39.5 };
  const s1: Shot = { rec: '11_velocidad', at: fDos - 6, start: 21.6, hold: 25.5 };
  // Temporizador: el reproductor y la hoja (sube a los 0,92–1,2 s de la toma); con «dormir», la cuenta atrás (desde los 4,3 s).
  const s2 = align('12_temporizador', 1.3, fTemp, 30, { hold: 3.9 });
  s1.marks = [markOn(s1, fDos, s2.at - 2, 210, 700, 244, 250, 20)];
  const s2b: Shot = { rec: '12_temporizador', at: fDormir + 6, start: 4.5, hold: 12 };
  s2.marks = [markOn(s2, fTemp, s2b.at - 2, 8, 878, 648, 384, 18)];
  // Ajustes del reproductor → «Automatic timer» (la hoja sube a los 9,24–9,5 s de la toma), con «activarse»: de 21:00 a 2:00, 30 min.
  const s3 = align('21_audio_player', 9.5, fAct + 4, 26, { hold: 22.5 });
  s2b.marks = [markOn(s2b, fDormir + 10, s3.at - 2, 192, 230, 280, 280, 140)];
  s3.marks = [markOn(s3, fSolo - 2, fCap - 8, 8, 630, 648, 510, 18)];
  const s4: Shot = { rec: '14_capitulos', at: fCap - 6, start: 4.0, hold: 14.5 };
  s4.marks = [markOn(s4, fCap, fMarc - 8, 0, 390, 664, 470, 14)];
  const s5: Shot = { rec: '13_marcadores', at: fMarc - 6, start: 26.0, hold: 31.5 };
  s5.marks = [markOn(s5, fMarc, fDesc - 8, 8, 340, 648, 410, 20)];
  const s6: Shot = { rec: '15_descarga', at: fDesc - 6, start: 25.0, hold: 34.3 };
  s6.marks = [markOn(s6, fDesc, fCon - 6, 8, 1072, 648, 72, 16)];
  const s7: Shot = { rec: '17_descargados', at: fCon - 4, start: 10.0, hold: 15.0 };
  s7.marks = [markOn(s7, fCon, p.dur + 20, 8, 240, 648, 380, 18)];
  return (
    <AppFeatureScene {...p} id="D08" title="El reproductor" shots={[s0, s1, s2, s2b, s3, s4, s5, s6, s7]} tagSize={40} tagGap={14}
      taps={[{ f: fDos - 8, x: 332, y: 1250 }, { f: fTemp - 22, x: 596, y: 1250 }, { f: s3.at + 6, x: 250, y: 482 }]}
      focusExtra={[{ from: fRep, to: fDos - 10, y: 1150, s: 1.12 }]}
      tags={[
        { word: 'dos', label: 'Hasta 2x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        { word: 'incluso', label: 'Y automático por la noche', icon: ic(<ClockIcon size={32} />) },
        { word: 'capitulos', label: 'Capítulos', icon: ic(<ListIcon size={32} />) },
        { word: 'marcadores', label: 'Marcadores con notas', icon: ic(<NoteIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
      ]} />
  );
};

// D09 · También para leer: el filtro «E-books» (192 de los resultados de «Sapiens»), el lector (Mono Sapiens) y sus ajustes:
// tema claro, oscuro o sepia (sepia a los 114,9 s de la toma), tamaño de letra (100 % → 105 %) y la tipografía OpenDyslexic.
export const D09Leer: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('D09', w, n);
  const fLeer = at('leer');
  const fEbooks = at('ebooks');
  const fModo = at('modo');
  const fSepia = at('sepia');
  const fTamano = at('tamano');
  const fTipo = at('tipografia');
  // El filtro «E-books» se marca a los 39,14 s de la toma (la hoja se cierra a los 41,1 s).
  const s0 = align('23_sapiens', 39.14, fLeer + 2, 40, { hold: 41.0 });
  s0.marks = [markOn(s0, fLeer + 4, fEbooks - 6, 8, 448, 648, 60, 14)];
  const s1: Shot = { rec: '24_ebook', at: fEbooks - 6, start: 72.0, hold: 76.5 };
  const pre = fSepia - (fModo - 6);
  const s2 = align('24_ebook', 114.9, fSepia, pre, { hold: 117.6 });
  s2.marks = [markOn(s2, fModo, fTamano - 6, 8, 700, 648, 146, 16)];
  const s3 = align('24_ebook', 118.6, fTamano + 20, 26, { hold: 125 });
  s3.marks = [markOn(s3, fTamano, fTipo - 6, 8, 1138, 648, 130, 16), markOn(s3, fTipo, p.dur + 20, 336, 1028, 312, 82, 14)];
  return (
    <AppFeatureScene {...p} id="D09" title="También para leer" side="left" shots={[s0, s1, s2, s3]} titleSize={100} tagSize={42} tagGap={18}
      taps={[{ f: fLeer - 1, x: 622, y: 478 }]}
      tags={[
        { word: 'leer', label: 'Ebooks en la misma cuota', icon: ic(<BookIcon size={32} />) },
        { word: 'modo', label: 'Modo oscuro o sepia', icon: ic(<MoonIcon size={32} />) },
        { word: 'tamano', label: 'Tamaño de letra', icon: ic(<FontIcon size={32} />) },
        { word: 'tipografia', label: 'Tipografía para dislexia', icon: ic(<FontIcon size={32} />) },
      ]} />
  );
};

// Fase en carrusel (como en la introducción).
const usePhase = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: easeInOut });
  const visible = frame >= from - 4 && frame <= to + 2;
  const style: React.CSSProperties = {
    opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`,
    filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined,
  };
  return { visible, style };
};

// Perfil con su propio depósito de horas (el mismo que el plan).
const ProfileCard: React.FC<{ at: number; label: string; tint: string; kid?: boolean; fill: number }> = ({ at, label, tint, kid = false, fill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 180 } });
  if (frame < at - 2) return <div style={{ width: 200 }} />;
  return (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '24px 0 22px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
      opacity: s, transform: `translateY(${((1 - s) * 40).toFixed(2)}px) scale(${(0.8 + 0.2 * s).toFixed(4)})` }}>
      <span style={{ width: 86, height: 86, borderRadius: '50%', background: tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {kid ? <KidIcon size={48} /> : <UserIcon size={48} />}
      </span>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>{label}</div>
      <HoursMeter left={fill} total={20} w={160} h={40} fill={tint === BB_SOFT ? BB : tint} />
    </div>
  );
};

// D10 · Las horas (ayuda de BookBeat, 14/10/2026): se cuentan a velocidad normal (un libro de 10 h gasta 10 h aunque lo
// escuches más rápido), leer también gasta (el tiempo de un ebook se estima por su texto), lo que no uses se pierde el día del
// pago, y cada perfil tiene las mismas horas que el plan; hay perfil infantil. En el móvil: «Hours» (19 h 53 m que quedan),
// el consumo en la web de la cuenta y «Profiles» (hasta cuatro perfiles más).
export const D10Horas: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D10', w, n);
  const fHoras = at('horas');
  const fCuentan = at('cuentan');
  const fNormal = at('normal');
  const fLibro = at('libro');
  const fGasta = at('gasta');
  const fEscuches = at('escuches');
  const fLeer = at('leer');
  const fGasta2 = at('gasta', 1);
  const fUses = at('uses');
  const fPierde = at('pierde');
  const fVarios = at('varios');
  const fPerfil = at('perfil');
  const fMismas = at('mismas');
  const fInfantil = at('infantil');
  const A = usePhase(-10, fLeer - 8);
  const B = usePhase(fLeer - 8, fVarios - 8);
  const C = usePhase(fVarios - 8, dur + 20);
  // Móvil: «Hours», el consumo en la web de la cuenta («0h and 7min out of 20h… Time left: 19h and 53min») y «Profiles».
  const s0: Shot = { rec: '16_horas', at: 0, start: 0.6, hold: 3.9 };
  s0.marks = [markOn(s0, fHoras + 2, fLeer - 10, 8, 136, 648, 170, 18)];
  const s1: Shot = { rec: '16_horas', at: fLeer - 6, start: 8.0, hold: 22.5 };
  s1.marks = [markOn(s1, fLeer, fVarios - 10, 8, 615, 648, 360, 18)];
  const s2: Shot = { rec: '18_perfiles_web', at: fVarios - 6, start: 4.0, hold: 11.3 };
  s2.marks = [markOn(s2, fPerfil - 2, dur + 20, 8, 536, 648, 112, 16)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: 1, cx, top, enter: 'rise', exit: 'none',
    focus: [{ from: fHoras + 4, to: fLeer - 10, y: 221, s: 1.4 }, { from: fLeer + 2, to: fVarios - 10, y: 795, s: 1.3 }, { from: fPerfil, to: dur, y: 592, s: 1.32 }],
  });
  // Fase A: un libro de 10 h gasta 10 h, a 1x o a 2x.
  const sBook = spring({ frame: frame - (fLibro - 4), fps, config: { damping: 14, stiffness: 180 } });
  const drain1 = interpolate(frame, [fGasta - 2, fGasta + 24], [0, 1], { ...clamp, easing: easeInOut });
  const fast = interpolate(frame, [fEscuches - 4, fEscuches + 6], [0, 1], { ...clamp, easing: easeInOut });
  const sMeterA = spring({ frame: frame - (fNormal - 8), fps, config: { damping: 15, stiffness: 160 } });
  const minus = spring({ frame: frame - (fGasta + 6), fps, config: { damping: 12, stiffness: 200 } });
  // Fase B: leer también gasta (3 h más) y lo que sobra a fin de mes se pierde.
  const drain2 = interpolate(frame, [fGasta2 - 6, fGasta2 + 18], [0, 1], { ...clamp, easing: easeInOut });
  const lost = interpolate(frame, [fPierde - 6, fPierde + 16], [0, 1], { ...clamp, easing: easeInOut });
  const sRead = spring({ frame: frame - (fLeer - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sCal = spring({ frame: frame - (fUses - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sLost = spring({ frame: frame - fPierde, fps, config: { damping: 11, stiffness: 210 } });
  const leftB = (10 - 3 * drain2) / 20 * (1 - lost);
  const sHead = spring({ frame: frame - (fMismas - 6), fps, config: { damping: 15, stiffness: 170 } });
  return (
    <BkbStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <MaskTitle text={'Se cuentan a\nvelocidad normal'} hi="normal" at={Math.max(0, fCuentan - 6)} size={92} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 50, opacity: sBook, transform: `translateY(${((1 - sBook) * 30).toFixed(2)}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 28px 14px 16px', borderRadius: 24, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>
              <span style={{ width: 54, height: 68, borderRadius: 10, background: BB, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><HeadphonesIcon size={32} /></span>
              Libro de 10 h
            </div>
            {/* 1x ⇄ 2x: se escuche como se escuche, gasta lo mismo. */}
            <div style={{ position: 'relative', display: 'flex', padding: 6, borderRadius: 999, background: '#EFEFF3', fontFamily: font.sans, fontWeight: 700, fontSize: 34 }}>
              <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6 + 100 * fast, width: 100, borderRadius: 999, background: BB_INK }} />
              {['1x', '2x'].map((t, k) => (
                <span key={t} style={{ position: 'relative', width: 100, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: (k === 0 ? 1 - fast : fast) > 0.5 ? '#fff' : color.ink2 }}><SpeedIcon size={26} c={(k === 0 ? 1 - fast : fast) > 0.5 ? '#fff' : color.ink2} />{t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 34, alignSelf: 'flex-start', opacity: sMeterA, transform: `translateY(${((1 - sMeterA) * 24).toFixed(2)}px)` }}>
            <HoursMeter left={(20 - 10 * drain1) / 20} total={20} w={760} h={80} fill={BB} />
            <div style={{ position: 'absolute', right: -10, top: -54, padding: '8px 18px', borderRadius: 16, background: BB_RED, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 32,
              opacity: minus, transform: `translateY(${((1 - minus) * 16).toFixed(2)}px) scale(${(0.6 + 0.4 * minus).toFixed(4)})` }}>−10 h</div>
          </div>
          <div style={{ marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink2, opacity: fast }}>Lo escuches como lo escuches</div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, alignSelf: 'flex-start', padding: '14px 30px 14px 16px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sRead, transform: `translateY(${((1 - sRead) * 24).toFixed(2)}px)` }}>
            <span style={{ width: 58, height: 58, borderRadius: '50%', background: BB_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><BookIcon size={34} c={BB_DEEP} /></span>
            Leer también gasta
          </div>
          <div style={{ position: 'relative', marginTop: 44, alignSelf: 'flex-start' }}>
            <HoursMeter left={leftB} total={20} w={760} h={80} fill={lost > 0.02 ? `rgba(205,150,255,${(1 - 0.7 * lost).toFixed(3)})` : BB} label={lost > 0.5 ? '0 h' : undefined} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, opacity: sCal, transform: `translateY(${((1 - sCal) * 24).toFixed(2)}px)` }}>
            <span style={{ width: 70, height: 70, borderRadius: 18, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CalendarIcon size={42} /></span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>Lo que no uses en el mes…</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', marginTop: 22, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#FDECEC', border: '2px solid rgba(229,72,77,0.3)',
            fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sLost, transform: `translateY(${((1 - sLost) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * sLost).toFixed(4)})`, transformOrigin: 'left center' }}>
            <CrossIcon size={42} /> …se pierde: no se acumula
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <MaskTitle text={'Cada perfil, con\nlas horas de tu plan'} hi="horas" at={Math.max(0, fPerfil - 8)} size={84} />
          <div style={{ display: 'flex', gap: 18, marginTop: 50, opacity: sHead }}>
            <ProfileCard at={fPerfil - 2} label="Tú" tint={BB} fill={1} />
            <ProfileCard at={fPerfil + 6} label="Perfil 2" tint={BB_YELLOW} fill={1} />
            <ProfileCard at={fPerfil + 12} label="Perfil 3" tint={BB_GREEN} fill={1} />
            <ProfileCard at={fInfantil - 4} label="Infantil" tint={BB_SOFT} kid fill={1} />
          </div>
          <div style={{ marginTop: 34, minHeight: 80 }}>
            <Chip at={fInfantil - 2} label="Y perfil infantil" icon={<KidIcon size={32} />} size={38} accent={BB_GREEN_SOFT} reserve />
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fLibro - 2} volume={0.6} />
      <Sfx name="draw" at={fGasta - 2} volume={0.45} dur={24} fade={8} />
      <Sfx name="hit_soft" at={fGasta + 8} volume={0.55} />
      <Sfx name="swipe" at={fEscuches - 4} volume={0.5} />
      <Sfx name="whoosh_soft" at={fLeer - 10} volume={0.5} />
      <Sfx name="draw" at={fGasta2 - 6} volume={0.4} dur={20} fade={6} />
      <Sfx name="ui_pop" at={fUses - 2} volume={0.55} />
      <Sfx name="cross" at={fPierde + 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={fVarios - 10} volume={0.5} />
      {[0, 6, 12].map((k) => <Sfx key={`p${k}`} name="ui_pop" at={fPerfil + k} volume={0.5} />)}
      <Sfx name="sparkle" at={fInfantil} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <ChangeTicks value={(f) => String(Math.round(20 - 10 * interpolate(f, [fGasta - 2, fGasta + 24], [0, 1], { ...clamp, easing: easeInOut })))} from={fGasta - 2} to={fGasta + 26} volume={0.35} />
    </BkbStage>
  );
};

export { CheckIcon, BB_GREEN };

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeOut } from '../../lib/anim';
import { HeadphonesIcon, MicIcon } from '../../components/Icons';
import {
  BookmarkIcon, CarIcon, ClockIcon, DownloadIcon, InfinityIcon, KidIcon, ListIcon, LockIcon, MoonIcon, SearchIcon, SpeedIcon, StarIcon, UserIcon,
} from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { align, AppFeatureScene, AU, AU_DEEP, AU_SOFT, AudibleMark, markOn, Shot } from './kit';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;
type IP = { size?: number; c?: string };
// Altavoz con ondas (Dolby Atmos / sonido envolvente).
const AtmosIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9.5h3l4-3.5v12l-4-3.5H4z" /><path d="M15 9a4 4 0 0 1 0 6" /><path d="M17.8 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);
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

// G05 · La portada (novedades, tendencias y pódcasts) y Descubrir: Top 20 del día, géneros, series y autores, y «Explorar
// por duración» (con el filtro «Menos de 3» horas).
export const G05Portada: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('G05', w, n);
  const fPortada = at('portada');
  const fNov = at('novedades');
  const fTend = at('tendencias');
  const fPod = at('podcasts');
  const fDesc = at('descubrir');
  const fTop = at('top');
  const fGen = at('generos');
  const fSeries = at('series');
  const fAut = at('autores');
  const fDur = at('duracion');
  const fExpl = at('explorar');
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 2.0, hold: 15 };
  // La portada sube hasta «Novedades» con la palabra (desplazamiento real de la toma: 5,8–6,6 s); fila a 620–1100.
  const s1 = align('01_inicio_scroll', 6.7, fNov + 2, 60, { hold: 7.0 });
  s1.marks = [markOn(s1, fNov + 4, fTend - 6, 10, 606, 654, 500, 24)];
  // «Títulos en tendencia» (cabecera a 490, portadas 530–850 y títulos hasta 960).
  const s2: Shot = { rec: '01_inicio_scroll', at: fTend - 6, start: 18.2, hold: 18.24 };
  s2.marks = [markOn(s2, fTend + 2, fPod - 6, 10, 470, 654, 500, 24)];
  // «Los podcasts más populares» (cabecera a 758, portadas 790–1110 y títulos hasta 1210).
  const s2b: Shot = { rec: '01_inicio_scroll', at: fPod - 6, start: 12.4, hold: 12.44 };
  s2b.marks = [markOn(s2b, fPod + 2, fDesc - 6, 10, 736, 654, 486, 24)];
  // Descubrir: cabecera y accesos (Todas las categorías, Top 20, Novedades, Explorar por duración).
  const s3: Shot = { rec: '03_descubrir', at: fDesc - 6, start: 1.0, hold: 1.2 };
  s3.marks = [markOn(s3, fDesc + 2, fTop - 8, 12, 150, 640, 136, 22)];
  const s4: Shot = { rec: '04_top20', at: fTop - 6, start: 1.5, hold: 6.0 };
  s4.marks = [markOn(s4, fTop + 2, fGen - 6, 14, 160, 636, 180, 20)];
  const s5: Shot = { rec: '03_descubrir', at: fGen - 6, start: 1.2, hold: 1.24 };
  s5.marks = [markOn(s5, fGen + 2, fSeries - 6, 12, 420, 640, 670, 24)];
  // «Explora por serie» (cabecera a ~480 y la cuadrícula hasta 1200) y «Autores populares» (725–1230).
  const s6: Shot = { rec: '03_descubrir', at: fSeries - 6, start: 22.0, hold: 22.04 };
  s6.marks = [markOn(s6, fSeries + 2, fAut - 6, 12, 455, 640, 760, 24)];
  const s6b: Shot = { rec: '03_descubrir', at: fAut - 6, start: 25.4, hold: 25.44 };
  s6b.marks = [markOn(s6b, fAut + 2, fExpl - 6, 12, 700, 640, 530, 24)];
  // El acceso «Explorar por duración» y la página con el filtro «Menos de 3» horas (El arte de la guerra, 2 h…).
  const s7: Shot = { rec: '03_descubrir', at: fExpl - 6, start: 1.2, hold: 1.24 };
  s7.marks = [markOn(s7, fExpl, fDur - 6, 20, 296, 304, 54, 27)];
  const s8: Shot = { rec: '22_duracion', at: fDur - 6, start: 31.8, hold: 40 };
  s8.marks = [markOn(s8, fDur + 2, p.dur + 20, 10, 170, 650, 310, 24)];
  return (
    <AppFeatureScene {...p} id="G05" title="Portada y Descubrir" kicker="La app" shots={[s0, s1, s2, s2b, s3, s4, s5, s6, s6b, s7, s8]}
      taps={[{ f: fDesc - 8, x: 410, y: 1390 }, { f: fTop - 8, x: 392, y: 240 }, { f: fDur - 10, x: 172, y: 322 }]}
      focusExtra={[{ from: fPortada, to: fNov - 2, y: 640, s: 1.05 }]}
      tags={[
        { word: 'novedades', label: 'Novedades y tendencias', icon: ic(<StarIcon size={32} />) },
        { word: 'podcasts', label: 'Pódcasts', icon: ic(<MicIcon size={32} />) },
        { word: 'top', label: 'Top 20 del día', icon: ic(<ListIcon size={32} />) },
        { word: 'generos', label: 'Géneros, series y autores', icon: ic(<GridIcon size={32} />) },
        { word: 'duracion', label: 'Explorar por duración', icon: ic(<ClockIcon size={32} />) },
      ]} titleSize={100} tagSize={42} tagGap={16} />
  );
};

// G06 · Audible Originals: Drácula (Claudia Salas y Asier Etxeandia; reparto completo, efectos y Dolby Atmos) y Umbra Dei
// (Daniel Grao y Nadia de Santiago; Dolby Atmos); y sus pódcasts propios, como «¿Por qué matamos?», de Carles Porta.
export const G06Originals: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('G06', w, n);
  const fSello = at('sello');
  const fOrig = at('originals');
  const fDrac = at('dracula');
  const fClaudia = at('claudia');
  const fUmbra = at('umbra');
  const fDaniel = at('daniel');
  const fActores = at('actores');
  const fDolby = at('dolby');
  const fPod = at('podcasts');
  const fPorque = at('matamos');
  // La fila «Novedades» de la portada, con Drácula y su sello «audible ORIGINAL».
  const s0: Shot = { rec: '01_inicio_scroll', at: 0, start: 11.4, hold: 12.4 };
  s0.marks = [markOn(s0, fSello, fDrac - 6, 8, 236, 330, 440, 22)];
  const fProd = at('producciones');
  // Fichas reales: «Interpretado por Asier Etxeandia, Claudia Salas y más» y «Narrado por Daniel Grao, Nadia de Santiago y más».
  const s1: Shot = { rec: '05_dracula', at: fDrac - 6, start: 2.8, hold: 6.6 };
  s1.marks = [markOn(s1, fClaudia - 2, fUmbra - 6, 340, 950, 312, 96, 16)];
  const s2: Shot = { rec: '07_umbra_dei', at: fUmbra - 6, start: 3.9, hold: 7.6 };
  s2.marks = [markOn(s2, fDaniel - 2, fProd - 6, 320, 920, 330, 112, 16)];
  // La ficha de Drácula desplazada (8,0–8,5 s): «Reparto completo · Efectos de sonido · Adaptación» y el sello Dolby Atmos.
  const s3: Shot = { rec: '05_dracula', at: fProd - 4, start: 7.9, hold: 9.6 };
  s3.marks = [markOn(s3, fActores, fDolby - 2, 48, 270, 592, 62, 16), markOn(s3, fDolby, fPod - 6, 246, 370, 172, 40, 12)];
  // Los pódcasts más populares de la portada: «¿Por qué matamos?» (audible ORIGINAL).
  const s4: Shot = { rec: '01_inicio_scroll', at: fPod - 6, start: 12.4, hold: 12.44 };
  s4.marks = [markOn(s4, fPod + 2, p.dur + 20, 10, 736, 654, 486, 22)];
  return (
    <AppFeatureScene {...p} id="G06" title="Audible Originals" side="left" shots={[s0, s1, s2, s3, s4]} titleSize={100} tagSize={42} tagGap={18}
      tags={[
        { word: 'dracula', label: 'Drácula', sub: 'Con Claudia Salas y Asier Etxeandia', icon: ic(<AudibleMark size={34} />) },
        { word: 'umbra', label: 'Umbra Dei', sub: 'Con Daniel Grao y Nadia de Santiago', icon: ic(<AudibleMark size={34} />) },
        { word: 'actores', label: 'Actores y Dolby Atmos', icon: ic(<AtmosIcon size={32} />) },
        { word: 'podcasts', label: '¿Por qué matamos?', sub: 'Pódcast de Carles Porta', icon: ic(<MicIcon size={32} />) },
      ]} />
  );
};

// Nota de los oyentes por separado: Los Huérfanos en audible.es (4,5 de media; interpretación 4,6 e historia 4,4).
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
      {item(0, 'Narración', '4,6', <MicIcon size={34} c={AU_DEEP} />)}
      {item(1, 'Historia', '4,4', <StarIcon size={34} c={AU_DEEP} />)}
    </div>
  );
};

// G07 · Buscador y fichas: busca por título o autor («Umbra Dei»), el filtro «Incluido» (solo lo que entra en tu plan: de
// 46 a 38 resultados) y la ficha (Los huérfanos: narrador, duración y nota), con la nota de narración y de historia aparte.
export const G07Buscar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('G07', w, n);
  const fBuscas = at('buscas');
  const fTitulo = at('titulo');
  const fFiltrar = at('filtrar');
  const fPlan = at('plan');
  const fFicha = at('ficha');
  const fNarra = at('narra');
  const fDura = at('dura');
  const fNota = at('nota');
  const fNarr2 = at('narracion');
  const fAutor = at('autor');
  // Buscador: «Umbra Dei» aparece de golpe a los 11,8 s de la toma (sugerencias: Umbra Dei, El camino de la bruja con su
  // etiqueta «CATÁLOGO EXTENDIDO»…) y los resultados («Resultados (46)») a los 14,5 s.
  const s0: Shot = { rec: '06_buscar', at: 0, start: 11.8 - fTitulo / 50, hold: 13.0 };
  s0.marks = [markOn(s0, fTitulo + 4, fAutor - 6, 78, 46, 576, 80, 40)];
  const s0b: Shot = { rec: '06_buscar', at: fAutor - 6, start: 14.6, hold: 14.64 };
  s0b.marks = [markOn(s0b, fAutor + 2, fFiltrar - 22, 10, 326, 654, 240, 22)];
  // El filtro «Incluido»: el toque real cae a los ~6,03 s de la toma (a los 6,06 s la lista se queda cargando y a los 6,59 s
  // salen los 38 resultados). La toma empieza medio segundo antes, con el filtro a la vista.
  const s1 = align('08_incluido', 6.03, fFiltrar + 4, 24, { hold: 17 });
  // Una marca cada vez (MarkLayer solo dibuja una): el filtro activo «Incluido ×» y, con «plan», «Resultados (38)».
  s1.marks = [markOn(s1, fFiltrar + 34, fPlan - 2, 450, 222, 184, 56, 28), markOn(s1, fPlan, fFicha - 6, 10, 322, 300, 54, 14)];
  // La ficha: narrador (Eugenio Gómez), duración (12 h 46 min) y nota (4,5 con 283 valoraciones).
  const s2: Shot = { rec: '02_huerfanos_ficha', at: fFicha - 6, start: 2.2, hold: 4.6 };
  s2.marks = [
    markOn(s2, fNarra - 2, fDura - 4, 388, 836, 236, 76, 16),
    markOn(s2, fDura - 2, fNota - 4, 206, 724, 252, 44, 12),
    markOn(s2, fNota - 2, p.dur + 20, 138, 762, 388, 48, 12),
  ];
  const keys = Array.from({ length: 7 }, (_, i) => Math.round(fTitulo - 14 + i * 2));
  return (
    <AppFeatureScene {...p} id="G07" title="Buscador y fichas" shots={[s0, s0b, s1, s2]} keys={keys} titleSize={100}
      taps={[{ f: fFiltrar + 4, x: 526, y: 250 }]}
      focusExtra={[{ from: fBuscas, to: fTitulo - 2, y: 300, s: 1.1 }]}
      tags={[
        { word: 'titulo', label: 'Por título o autor', icon: ic(<SearchIcon size={32} />) },
        { word: 'filtrar', label: 'Solo lo incluido', icon: ic(<FilterIcon size={32} />) },
        { word: 'narra', label: 'Narrador, duración y nota', icon: ic(<UserIcon size={32} />) },
      ]}
      extra={<SplitRating at={fNarr2 - 4} />} />
  );
};

// G08 · Reproductor: velocidad hasta 3,5x (la hoja real: 1,5x y, arrastrando, 3,50), temporizador (30 min), capítulos,
// marcadores con notas («Marcador añadido · Agregar nota»), modo coche y descargas (menú «Descargar» y «Descargados»).
export const G08Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('G08', w, n);
  const fRep = at('reproductor');
  const fTres = at('tres');
  const fVel = at('velocidad');
  const fTemp = at('temporizador');
  const fCap = at('capitulos');
  const fMarc = at('marcadores');
  const fCoche = at('coche');
  const fDesc = at('descargas');
  const fCon = at('conexion');
  const fMedia = at('media');
  const s0: Shot = { rec: '12_reproductor', at: 0, start: 5.6, hold: 17.5 };
  // La hoja de velocidad: el valor pasa de 3,45 a 3,50 a los 26,3 s de la toma, justo con «media».
  const s1 = align('13_velocidad', 26.3, fMedia, 44, { hold: 30 });
  s1.marks = [markOn(s1, fTres - 4, fTemp - 6, 8, 1098, 650, 196, 20)];
  // Temporizador: la hoja (5 a 60 min, fin del capítulo…) y, tras elegir 30 min, la cuenta atrás «29:58» y el aviso.
  const s2: Shot = { rec: '14_temporizador', at: fTemp - 6, start: 4.6, hold: 4.64 };
  s2.marks = [markOn(s2, fTemp + 2, fTemp + 34, 16, 1030, 632, 150, 18)];
  const s2b: Shot = { rec: '14_temporizador', at: fTemp + 36, start: 14.2, hold: 15.6 };
  s2b.marks = [markOn(s2b, fTemp + 40, fCap - 6, 104, 280, 456, 70, 35)];
  const s3: Shot = { rec: '15_capitulos', at: fCap - 6, start: 4.0, hold: 4.04 };
  s3.marks = [markOn(s3, fCap + 2, fMarc - 20, 14, 250, 636, 520, 22)];
  // «Marcador añadido · Agregar nota»: el aviso real tras pulsar «+ Favoritos». En la toma, el toque cae a los ~20,56 s y el aviso
  // sube entre 20,60 y 20,70 s; el círculo del toque va justo antes, con el botón todavía a la vista.
  const s4 = align('16_marcadores', 20.56, fMarc + 6, 24, { hold: 23.4 });
  s4.marks = [markOn(s4, fMarc + 14, fCoche - 6, 20, 1330, 624, 96, 20)];
  const s5: Shot = { rec: '12_reproductor', at: fCoche - 6, start: 9.0, hold: 17.5 };
  s5.marks = [markOn(s5, fCoche, fDesc - 12, 172, 1328, 156, 92, 20)];
  // El menú «⋮» (arriba a la derecha): la cámara sube con «y descargas», el toque cae ahí y el menú entra con un corte (en la
  // toma, el menú aparece entre 1,7 y 2,0 s).
  const s6: Shot = { rec: '17_descargar', at: fDesc + 2, start: 1.8, hold: 4.4, fade: 0 };
  s6.marks = [markOn(s6, fDesc + 14, fCon - 2, 136, 128, 512, 64, 14)];
  const s7: Shot = { rec: '18_biblioteca', at: fCon - 2, start: 21.4, hold: 31 };
  s7.marks = [markOn(s7, fCon + 4, p.dur + 20, 10, 170, 646, 200, 18)];
  return (
    <AppFeatureScene {...p} id="G08" title="El reproductor" side="left" shots={[s0, s1, s2, s2b, s3, s4, s5, s6, s7]} tagSize={40} tagGap={14}
      taps={[{ f: fMedia - 48, x: 82, y: 1372 }, { f: fTemp + 30, x: 122, y: 1140 }, { f: fMarc + 6, x: 582, y: 1372 }, { f: fDesc - 2, x: 626, y: 84 }]}
      focusExtra={[{ from: fRep, to: fTres - 10, y: 1150, s: 1.12 }, { from: fDesc - 12, to: fDesc + 4, x: 520, y: 180, s: 1.3 }]}
      tags={[
        { word: 'tres', label: 'Hasta 3,5x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        { word: 'capitulos', label: 'Capítulos', icon: ic(<ListIcon size={32} />) },
        { word: 'marcadores', label: 'Marcadores con notas', icon: ic(<NoteIcon size={32} />) },
        { word: 'coche', label: 'Modo coche', icon: ic(<CarIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
      ]} />
  );
};

// Sin reloj: a 1x o a 3x, el mismo «∞» (Premium no cuenta horas).
const NoClock: React.FC<{ at: number; atTriple: number; atNada: number; dimAt: number }> = ({ at, atTriple, atNada, dimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 160 } });
  const sD = spring({ frame: frame - atTriple, fps, config: { damping: 13, stiffness: 200 } });
  const sN = spring({ frame: frame - atNada, fps, config: { damping: 11, stiffness: 210 } });
  const off = interpolate(frame, [dimAt, dimAt + 14], [0, 1], { ...clamp, easing: easeOut });
  if (frame < at - 2) return <div style={{ height: 170 }} />;
  const pill = (label: string, sp: number, hot: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', borderRadius: 22, background: hot ? color.ink : '#fff', color: hot ? '#fff' : color.ink, border: hot ? 'none' : `1px solid ${color.line}`,
      fontFamily: font.sans, fontWeight: 700, fontSize: 34, opacity: sp, transform: `translateY(${((1 - sp) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sp).toFixed(4)})` }}>
      <SpeedIcon size={34} c={hot ? '#fff' : color.ink} /> {label}
    </div>
  );
  return (
    <div style={{ marginTop: 34, height: 170, display: 'flex', alignItems: 'center', gap: 18, opacity: 1 - 0.62 * off, filter: off > 0.01 ? `grayscale(${off.toFixed(3)})` : undefined }}>
      {pill('1x', s, false)}
      {pill('3x', sD, true)}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderRadius: 22, background: AU_SOFT, color: AU_DEEP, fontFamily: font.sans, fontWeight: 700, fontSize: 36,
        opacity: sN, transform: `scale(${(0.6 + 0.4 * sN).toFixed(4)}) rotate(${((1 - sN) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
        <InfinityIcon size={40} c={AU} /> No se gasta nada
      </div>
    </div>
  );
};

// G09 · Sin reloj (a velocidad normal o al triple no se gasta nada) y, para los peques, el perfil infantil: solo los títulos
// que tú compartas (la hoja real «Comparte historias con tus hijos»).
export const G09SinReloj: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => p.lead + wf('G09', w, n);
  const fReloj = at('reloj');
  const fNormal = at('normal');
  const fTriple = at('triple');
  const fNada = at('nada');
  const fPeques = at('peques');
  const fPerfil = at('perfil');
  const fSolo = at('solo');
  const fComp = at('compartas');
  // La hoja de velocidad a 1,00 («velocidad normal») y a 3,50 («al triple»): se escuche como se escuche, no se gasta nada.
  const s0: Shot = { rec: '13_velocidad', at: 0, start: 2.5, hold: 2.54 };
  s0.marks = [markOn(s0, fNormal - 4, fTriple - 6, 8, 1098, 650, 196, 20)];
  const s0b: Shot = { rec: '13_velocidad', at: fTriple - 6, start: 27.0, hold: 27.04 };
  s0b.marks = [markOn(s0b, fTriple - 2, fPeques - 6, 8, 1098, 650, 196, 20)];
  // Perfil (cabecera sin nombre ni iniciales: tools/aud_cover.py), pestaña «Perfil» → «Crea un Perfil Infantil» → la hoja.
  const s1: Shot = { rec: '20_perfil_infantil', at: fPeques - 6, start: 9.2, hold: 10.4 };
  s1.marks = [markOn(s1, fPerfil - 2, fSolo - 8, 10, 730, 646, 92, 18)];
  const s2: Shot = { rec: '20_perfil_infantil', at: fSolo - 6, start: 12.4, hold: 22 };
  s2.marks = [markOn(s2, fSolo + 2, p.dur + 20, 36, 890, 604, 250, 22)];
  const pulse = interpolate(frame, [fNada, fNada + 10], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AppFeatureScene {...p} id="G09" title="Aquí no hay reloj" side="left" shots={[s0, s0b, s1, s2]} titleSize={100} tagSize={42} tagGap={18}
      taps={[{ f: fSolo - 12, x: 330, y: 770 }]}
      tags={[
        { word: 'reloj', label: 'Sin límite de horas', icon: ic(<InfinityIcon size={32} c={pulse > 0.5 ? AU : color.ink} />) },
        { word: 'perfil', label: 'Perfil infantil', icon: ic(<KidIcon size={32} />) },
        { word: 'solo', label: 'Solo lo que tú compartas', icon: ic(<LockIcon size={32} />) },
      ]}
      extra={<NoClock at={fNormal - 2} atTriple={fTriple - 2} atNada={fNada - 2} dimAt={fPerfil - 2} />} />
  );
};

export { HeadphonesIcon, BookmarkIcon };

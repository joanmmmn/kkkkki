import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { clamp, easeOut } from '../../lib/anim';
import { BookIcon, HeadphonesIcon } from '../../components/Icons';
import { BookmarkIcon, ClockIcon, DownloadIcon, GlobeIcon, InfinityIcon, KidIcon, ListIcon, LockIcon, MoonIcon, SearchIcon, SpeedIcon, StarIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { align, AppFeatureScene, markOn, Shot, ST, ST_DEEP, ST_SOFT, StorytelMark } from './kit';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;
type IP = { size?: number; c?: string };
const CameraIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5z" /><circle cx="12" cy="13.5" r="3.6" />
  </svg>
);
const TrophyIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4.2" /><path d="M17 6h2.5a2.5 2.5 0 0 1-2.5 4.2" />
    <path d="M12 14v3.5" /><path d="M8.5 20.5h7" /><path d="M9.5 20.5l.6-3h3.8l.6 3" />
  </svg>
);
// Rotulador: «la frase marcada».
const HighlightIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4.5l5 5-8.5 8.5H6v-5z" /><path d="M3 21h9" stroke={ST} strokeWidth={3} />
  </svg>
);

// A04 · La portada: el top 50 del día, lo más nuevo y las pestañas (series, ebooks, inglés, catalán e infantil).
export const A04Portada: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('A04', w, n);
  const fPortada = at('portada');
  const fTop = at('top');
  const fNuevo = at('nuevo');
  const fPest = at('pestanas');
  const fSeries = at('series');
  const fEbooks = at('ebooks');
  const fIngles = at('ingles');
  const fInf = at('infantil');
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 9.0, hold: 23 };
  // «top cincuenta»: la portada sube hasta el top 50 con la palabra (desplazamiento real de la grabación, 3,0–4,4 s de la
  // toma) y vuelve a subir hasta «Los títulos del momento» con «lo más nuevo» (8,2–10,1 s).
  const s1 = align('01_inicio_scroll', 3.0, fTop, 4, { hold: 7.5 });
  s1.marks = [markOn(s1, fTop + 22, fNuevo - 4, 10, 190, 654, 300, 24)];
  const s2 = align('01_inicio_scroll', 8.2, fNuevo - 2, 4, { hold: 13 });
  s2.marks = [markOn(s2, fNuevo + 46, fPest - 6, 10, 975, 654, 340, 24)];
  const s3: Shot = { rec: '02_inicio_top2', at: fPest - 8, start: 1.0, hold: 6.5 };
  s3.marks = [markOn(s3, fPest + 2, fSeries - 6, 8, 122, 656, 66, 33)];
  const s4: Shot = { rec: '03_series', at: fSeries - 6, start: 3.0, hold: 8.5 };
  s4.marks = [markOn(s4, fSeries + 2, fEbooks - 4, 66, 126, 126, 58, 29)];
  const s5: Shot = { rec: '04_ebooks', at: fEbooks - 6, start: 4.5, hold: 10.5 };
  s5.marks = [markOn(s5, fEbooks + 2, fIngles - 4, 520, 126, 132, 58, 29), markOn(s5, fIngles, fInf - 6, 194, 126, 312, 58, 29)];
  const s6: Shot = { rec: '05_infantil', at: fInf - 6, start: 4.0, hold: 11.5 };
  s6.marks = [markOn(s6, fInf + 2, p.dur + 20, 14, 128, 150, 60, 30)];
  return (
    <AppFeatureScene {...p} id="A04" title="La portada" kicker="La app" shots={[s0, s1, s2, s3, s4, s5, s6]}
      focusExtra={[{ from: fPortada, to: fTop - 2, y: 640, s: 1.05 }]}
      tags={[
        { word: 'top', label: 'Top 50 del día', icon: ic(<ListIcon size={32} />) },
        { word: 'nuevo', label: 'Lo más nuevo', icon: ic(<StarIcon size={32} />) },
        { word: 'pestanas', label: 'Series y ebooks', icon: ic(<BookIcon size={32} />) },
        { word: 'ingles', label: 'En inglés y en catalán', icon: ic(<GlobeIcon size={32} />) },
        { word: 'infantil', label: 'Zona infantil', icon: ic(<KidIcon size={32} />) },
      ]} titleSize={104} tagSize={42} tagGap={16} />
  );
};

// A05 · Storytel Originals: la sección «Solo en Storytel», «Producidos por Storytel», La Suelta (Juan Gómez-Jurado) y
// Modo Noche (ficción sonora con actores; «Mejor Podcast del año 2023 otorgado por Podcast Days», según la propia ficha).
export const A05Originals: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('A05', w, n);
  const fSello = at('sello');
  const fOrig = at('originals');
  const fSolo = at('solo');
  const fSuelta = at('suelta');
  const fJuan = at('juan');
  const fModo = at('modo');
  const fActores = at('actores');
  const fMejor = at('mejor');
  const s0: Shot = { rec: '01_inicio_scroll', at: 0, start: 28.4, hold: 31 };
  s0.marks = [markOn(s0, fSello, fOrig - 4, 14, 345, 636, 845, 26)];
  const s1: Shot = { rec: '20_explorar', at: fOrig - 6, start: 19.0, hold: 41 };
  s1.marks = [markOn(s1, fSolo - 2, fSuelta - 6, 12, 125, 646, 930, 26)];
  const s2: Shot = { rec: '11_suelta', at: fSuelta - 6, start: 22.6, hold: 32 };
  s2.marks = [markOn(s2, fSuelta + 2, fJuan - 4, 122, 122, 420, 418, 22), markOn(s2, fJuan - 2, fModo - 6, 18, 688, 470, 46, 14)];
  const s3: Shot = { rec: '21_modo_noche', at: fModo - 6, start: 15.4, hold: 38 };
  s3.marks = [markOn(s3, fModo + 2, fActores - 4, 12, 270, 646, 60, 16), markOn(s3, fActores - 2, fMejor - 6, 286, 325, 374, 44, 12), markOn(s3, fMejor - 2, p.dur + 20, 14, 740, 640, 60, 14)];
  return (
    <AppFeatureScene {...p} id="A05" title="Storytel Originals" side="left" shots={[s0, s1, s2, s3]} titleSize={100}
      tags={[
        { word: 'solo', label: 'Solo en Storytel', icon: ic(<StorytelMark size={28} />) },
        { word: 'suelta', label: 'La Suelta', sub: 'La primera serie sonora de Juan Gómez-Jurado', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'modo', label: 'Modo Noche', sub: 'Ficción sonora con actores', icon: ic(<MoonIcon size={32} />) },
        { word: 'mejor', label: 'Mejor pódcast de 2023', sub: 'Podcast Days', icon: ic(<TrophyIcon size={34} />) },
      ]} />
  );
};

// A06 · Buscador y fichas: busca por título o autor («Bernarda Alba»), con la cámara (aviso «Busca con tu cámara») y la ficha:
// «Escuchar» y «Leer», el narrador, la duración y la nota.
export const A06Buscar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('A06', w, n);
  const fBuscas = at('buscas');
  const fTitulo = at('titulo');
  const fCamara = at('camara');
  const fFicha = at('ficha');
  const fEsc = at('escucharlo');
  const fLeer = at('leerlo');
  const fDos = at('dos');
  const fNarra = at('narra');
  const fDura = at('dura');
  const fNota = at('nota');
  // Buscador limpio; «Bernarda Alba» aparece escrito a los 1,40 s de la toma (con «título») y los resultados, a los 2,8 s.
  const s0: Shot = { rec: '12_bernarda_buscar', at: 0, start: Math.max(0, 1.4 - (fTitulo + 2) / 50), hold: 10.4 };
  const fRes = fTitulo + 2 + Math.round(1.4 * 50);
  s0.marks = [markOn(s0, fTitulo + 4, fRes - 2, 18, 62, 630, 92, 14), markOn(s0, fRes, fCamara - 6, 12, 245, 640, 200, 18)];
  const keys = Array.from({ length: 13 }, (_, i) => Math.round(fTitulo - 14 + i * 1.2));
  const s1: Shot = { rec: '10_buscar', at: fCamara - 6, start: 4.0, hold: 16.5 };
  s1.marks = [markOn(s1, fCamara + 2, fFicha - 6, 120, 60, 536, 222, 20)];
  const s2: Shot = { rec: '13_bernarda_ficha', at: fFicha - 6, start: 3.0, hold: 13.2 };
  s2.marks = [
    markOn(s2, fEsc - 2, fLeer - 4, 14, 742, 314, 72, 36),
    markOn(s2, fLeer - 2, fDos - 4, 330, 742, 320, 72, 36),
    markOn(s2, fDos - 2, fNarra - 6, 10, 738, 646, 80, 40),
    markOn(s2, fNarra - 2, fDura - 4, 280, 690, 190, 44, 12),
    markOn(s2, fDura - 2, fNota - 4, 345, 838, 200, 70, 16),
    markOn(s2, fNota - 2, p.dur + 20, 14, 560, 340, 70, 16),
  ];
  return (
    <AppFeatureScene {...p} id="A06" title="Buscador y fichas" shots={[s0, s1, s2]} keys={keys} titleSize={100}
      taps={[{ f: fCamara + 4, x: 600, y: 108 }]}
      focusExtra={[{ from: fBuscas, to: fTitulo - 2, y: 300, s: 1.1 }]}
      tags={[
        { word: 'titulo', label: 'Por título o autor', icon: ic(<SearchIcon size={32} />) },
        { word: 'camara', label: 'O con la cámara', icon: ic(<CameraIcon size={32} />) },
        { word: 'escucharlo', label: 'Escuchar, leer o las dos', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'narra', label: 'Narrador, duración y nota', icon: ic(<StarIcon size={32} />) },
      ]} />
  );
};

// A07 · Reproductor: velocidad (1x a 2x; se elige 2x), temporizador (30 min), capítulos, marcadores y descargas.
export const A07Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('A07', w, n);
  const fRep = at('reproductor');
  const fUna = at('una');
  const fVel = at('velocidad');
  const fTemp = at('temporizador');
  const fCap = at('capitulos');
  const fMarc = at('marcadores');
  const fDesc = at('descargas');
  const fCon = at('conexion');
  const s0: Shot = { rec: '14_reproductor', at: 0, start: 14.0, hold: 21 };
  // Hoja de velocidad: se abre con «una» y el 2x se marca (38,8 s de la toma) justo después de «velocidad».
  const s1: Shot = { rec: '14_reproductor', at: fUna - 8, start: 29.0, hold: 34 };
  s1.marks = [markOn(s1, fUna, fVel - 2, 10, 760, 646, 450, 22)];
  const s2 = align('14_reproductor', 38.8, fVel + 4, 6, { hold: 46 });
  s2.marks = [markOn(s2, fVel + 4, fTemp - 6, 10, 1118, 646, 84, 18)];
  // Se cierra la hoja de velocidad (fundido al reproductor ya en 2x) y el toque en la luna abre el temporizador (20,35 s).
  const s3: Shot = { rec: '15_reproductor2', at: fTemp - 6, start: 19.9, hold: 30 };
  s3.marks = [markOn(s3, fTemp + 22, fCap - 6, 10, 560, 646, 650, 22)];
  const s4: Shot = { rec: '15_reproductor2', at: fCap - 6, start: 66.0, hold: 75 };
  s4.marks = [markOn(s4, fCap + 2, fMarc - 6, 30, 132, 606, 700, 22)];
  const s5: Shot = { rec: '15_reproductor2', at: fMarc - 6, start: 53.0, hold: 61 };
  s5.marks = [markOn(s5, fMarc + 2, fDesc - 6, 12, 140, 640, 110, 18)];
  const s6: Shot = { rec: '15_reproductor2', at: fDesc - 6, start: 80.0, hold: 93 };
  s6.marks = [markOn(s6, fDesc + 2, fCon + 4, 20, 1206, 76, 76, 38)];
  const s7: Shot = { rec: '19_biblioteca', at: fCon - 2, start: 10.4, hold: 20.5 };
  s7.marks = [markOn(s7, fCon + 4, p.dur + 20, 10, 590, 646, 240, 18)];
  return (
    <AppFeatureScene {...p} id="A07" title="El reproductor" side="left" shots={[s0, s1, s2, s3, s4, s5, s6, s7]}
      taps={[{ f: fUna - 8, x: 60, y: 1130 }, { f: fVel + 4, x: 620, y: 1160 }, { f: fTemp, x: 606, y: 1130 }]}
      focusExtra={[{ from: fRep, to: fUna - 10, y: 1100, s: 1.12 }]}
      tags={[
        { word: 'una', label: 'De 1x a 2x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        { word: 'capitulos', label: 'Capítulos y marcadores', icon: ic(<BookmarkIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
      ]} />
  );
};

// A08 · Leer y escuchar: «Leer desde aquí» abre el ebook en el mismo punto con la frase marcada; y buscando una palabra
// («limonada») el resultado lleva al minuto exacto del audio (00:04:02).
export const A08Leer: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('A08', w, n);
  const fEbook = at('ebook');
  const fPulsas = at('pulsas');
  const fAqui = at('aqui');
  const fSigues = at('sigues');
  const fFrase = at('frase');
  const fIncluso = at('incluso');
  const fBuscar = at('buscar');
  const fLleva = at('lleva');
  const fMinuto = at('minuto');
  // El toque real en «Leer desde aquí» (94,62 s de la toma) cae con «aquí».
  const s0 = align('15_reproductor2', 94.62, fAqui + 2, Math.max(10, fAqui + 2), { hold: 94.62 + 0.1 });
  s0.marks = [markOn(s0, fPulsas - 2, fAqui + 2, 22, 1306, 620, 108, 30)];
  const s1: Shot = { rec: '16_lectura', at: fAqui + 4, start: 2.4, hold: 24 };
  s1.marks = [markOn(s1, fFrase - 4, fIncluso - 4, 14, 334, 636, 174, 14)];
  const s2: Shot = { rec: '18_buscar_audio', at: fBuscar - 6, start: 18.0, hold: 28.8 };
  s2.marks = [markOn(s2, fBuscar + 4, fLleva - 2, 10, 196, 646, 180, 18), markOn(s2, fLleva, fMinuto + 6, 520, 196, 136, 44, 12)];
  // El toque en el resultado (29,56 s) abre el reproductor en 00:04:02 con «minuto».
  const s3 = align('18_buscar_audio', 29.7, fMinuto + 4, 6, { hold: 40 });
  s3.marks = [markOn(s3, fMinuto + 8, p.dur + 20, 16, 975, 632, 90, 16)];
  return (
    <AppFeatureScene {...p} id="A08" title="Escucha y lee" shots={[s0, s1, s2, s3]} titleSize={104}
      taps={[{ f: fAqui + 2, x: 330, y: 1355 }, { f: fMinuto + 2, x: 330, y: 280 }]}
      focusExtra={[{ from: fEbook, to: fPulsas - 4, y: 1150, s: 1.1 }]}
      tags={[
        { word: 'pulsas', label: '«Leer desde aquí»', icon: ic(<BookIcon size={32} />) },
        { word: 'frase', label: 'La frase, marcada', icon: ic(<HighlightIcon size={32} />) },
        { word: 'buscar', label: 'Busca una palabra…', icon: ic(<SearchIcon size={32} />) },
        { word: 'lleva', label: '…y salta a ese minuto', icon: ic(<ClockIcon size={32} />) },
      ]} />
  );
};

// Sin reloj: dos velocidades y el mismo contador de horas gastadas (0 h), frente a «∞».
const NoClock: React.FC<{ at: number; atDoble: number; atNada: number; dimAt: number }> = ({ at, atDoble, atNada, dimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 160 } });
  const sD = spring({ frame: frame - atDoble, fps, config: { damping: 13, stiffness: 200 } });
  const sN = spring({ frame: frame - atNada, fps, config: { damping: 11, stiffness: 210 } });
  // Cuando la voz pasa a la zona infantil, se apaga como las etiquetas que ya no tocan.
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
      {pill('2x', sD, true)}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderRadius: 22, background: ST_SOFT, color: ST_DEEP, fontFamily: font.sans, fontWeight: 700, fontSize: 36,
        opacity: sN, transform: `scale(${(0.6 + 0.4 * sN).toFixed(4)}) rotate(${((1 - sN) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
        <InfinityIcon size={40} c={ST} /> 0 h gastadas
      </div>
    </div>
  );
};

// A08B · Sin reloj (a 1x o a 2x no se gasta nada) y, para los peques, la zona infantil y el modo infantil con PIN.
export const A08BSinReloj: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => p.lead + wf('A08B', w, n);
  const fReloj = at('reloj');
  const fNormal = at('normal');
  const fDoble = at('doble');
  const fNada = at('nada');
  const fPeques = at('peques');
  const fZona = at('zona');
  const fModo = at('modo');
  const fProtege = at('protege');
  const fPin = at('pin');
  const s0: Shot = { rec: '15_reproductor2', at: 0, start: 8.0, hold: 19.5 };
  s0.marks = [markOn(s0, fReloj, fDoble - 2, 16, 975, 632, 90, 16), markOn(s0, fDoble, fPeques - 6, 18, 1095, 110, 70, 20)];
  const s1: Shot = { rec: '05_infantil', at: fPeques - 6, start: 4.0, hold: 11.5 };
  s1.marks = [markOn(s1, fZona - 2, fModo - 6, 10, 240, 646, 860, 24)];
  const s2: Shot = { rec: '06_perfil_kids', at: fModo - 6, start: 6.0, hold: 11.0 };
  s2.marks = [markOn(s2, fModo + 2, fProtege + 2, 12, 812, 644, 78, 18)];
  // El toque en el interruptor (13,9 s de la toma) abre «Agregar código» con «protege».
  const s3 = align('06_perfil_kids', 13.9, fProtege + 4, 6, { hold: 24 });
  s3.marks = [markOn(s3, fPin - 4, p.dur + 20, 110, 160, 444, 220, 22)];
  const pulse = interpolate(frame, [fNada, fNada + 10], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AppFeatureScene {...p} id="A08B" title="Aquí no hay reloj" side="left" shots={[s0, s1, s2, s3]} titleSize={100} tagSize={42} tagGap={18}
      taps={[{ f: fProtege + 4, x: 585, y: 852 }]}
      tags={[
        { word: 'reloj', label: 'Sin límite de horas', icon: ic(<InfinityIcon size={32} c={pulse > 0.5 ? ST : color.ink} />) },
        { word: 'zona', label: 'Zona infantil', icon: ic(<KidIcon size={32} />) },
        { word: 'modo', label: 'Modo infantil con PIN', icon: ic(<LockIcon size={32} />) },
      ]}
      extra={<NoClock at={fNormal - 2} atDoble={fDoble - 2} atNada={fNada - 2} dimAt={fZona - 2} />} />
  );
};

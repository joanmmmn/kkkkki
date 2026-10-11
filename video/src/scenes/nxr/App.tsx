import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx, STEM } from '../../components/Sfx';
import { HeadphonesIcon, BookIcon, MicIcon } from '../../components/Icons';
import {
  BookmarkIcon, ChartIcon, DownloadIcon, FontIcon, KidIcon, ListIcon, LockIcon, MoonIcon, SearchIcon, SpeedIcon, StarIcon, UserIcon, WifiOffIcon, ClockIcon, SyncIcon,
} from '../../components/Icons2';
import { wf } from './timeline';
import { AppPhone, FeatureTag, PhoneKey, Shot, Tap, APP_W } from './kit';

type P = { lead: number; dur: number };
export type TagDef = { word: string; nth?: number; label: string; icon: React.ReactNode; out?: string };

// Escena tipo de la app: el móvil con las tomas reales a un lado y, al otro, las funciones que la voz va nombrando.
export const AppFeatureScene: React.FC<P & {
  id: string; title: string; kicker?: string; tags: TagDef[]; side?: 'left' | 'right'; shots: Shot[]; cam?: PhoneKey[]; taps?: Tap[]; extra?: React.ReactNode;
}> = ({ lead, dur, id, title, kicker, tags, side = 'right', shots, cam, taps, extra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf(id, w, n);
  const sT = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const phoneLeft = side === 'right';
  const defaultCam: PhoneKey[] = [
    { f: 0, rx: 6, ry: phoneLeft ? 22 : -22, rz: phoneLeft ? -2 : 2, s: 0.94, x: phoneLeft ? -40 : 40, y: 30 },
    { f: 26, rx: 2, ry: phoneLeft ? 10 : -10, rz: 0, s: 1, x: 0, y: 0 },
    { f: dur, rx: 1, ry: phoneLeft ? 6 : -6, rz: 0, s: 1.015, x: 0, y: -6 },
  ];
  const tagFrames = tags.map((t) => at(t.word, t.nth ?? 0));
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <div style={{ position: 'absolute', top: 96, [phoneLeft ? 'left' : 'right']: 270 } as React.CSSProperties}>
          <AppPhone shots={shots} w={385} cam={cam ?? defaultCam} taps={taps} />
        </div>
        <div style={{ position: 'absolute', top: 210, [phoneLeft ? 'left' : 'right']: phoneLeft ? 960 : 780, width: 820 } as React.CSSProperties}>
          {kicker && (
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: color.muted, opacity: sT, marginBottom: 14 }}>{kicker}</div>
          )}
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, letterSpacing: -3, lineHeight: 1.02, color: color.ink, opacity: sT, transform: `translateY(${(1 - sT) * 30}px)`, filter: `blur(${(1 - sT) * 8}px)` }}>{title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginTop: 44 }}>
            {tags.map((t, i) => (
              <FeatureTag key={t.label} at={tagFrames[i]} out={t.out ? at(t.out) : undefined} icon={t.icon} size={36} from={phoneLeft ? 'right' : 'left'}>{t.label}</FeatureTag>
            ))}
          </div>
          {extra}
        </div>
      </AbsoluteFill>
      {tagFrames.map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.8} />)}
    </Stage>
  );
};

// Toma cuyo instante `clipT` (s) de la grabación cae justo en el fotograma `f` de la escena; empieza `pre` fotogramas antes.
const align = (rec: string, clipT: number, f: number, pre = 10, extra: Partial<Shot> = {}): Shot => {
  const at = Math.max(0, f - pre);
  return { rec, at, start: Math.max(0, clipT - (f - at) / 50), ...extra };
};
// Coordenadas del clic (pantalla del ordenador, 1456×819) → píxeles de la grabación (664×1440).
const tapXY = (cx: number, cy: number) => ({ x: cx * 1.7582 - 948, y: cy * 1.7582 });
const tap = (f: number, cx: number, cy: number): Tap => ({ f, ...tapXY(cx, cy) });
const ic = (n: React.ReactNode) => n;

// R04 · Portada (recomendaciones) y El Librarian (asistente con IA): toque en su tarjeta, petición y respuesta.
export const R04Inicio: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R04', w, n);
  const fGustos = at('gustos');
  const fSabes = at('sabes');
  const fLib = at('librarian');
  const fDesc = at('describes');
  const fProp = at('propone');
  // Tarjeta de El Librarian: el toque cae en el segundo 5,86 de la toma y la hoja se abre justo después.
  const libAt = Math.max(fGustos + 20, fSabes - 6);
  const fTapLib = Math.max(libAt + 30, fLib - 4);
  // Enviar la petición (segundo 15,58 de la toma «b»): al acabar de teclear, o antes de la respuesta.
  const fSend = Math.min(fDesc + 78, fProp - 26);
  const shots: Shot[] = [
    { rec: '01_inicio', at: 0, start: 14.5, hold: 22.0, marks: [{ from: fGustos - 30, to: libAt + 8, x: 10, y: 286, w: 500, h: 62, r: 14 }] },
    { rec: '02_librarian_tap', at: libAt, start: Math.max(0, 5.86 - (fTapLib - libAt) / 50) },
    { rec: '02_librarian_b', at: fDesc - 6, start: 5.1, rate: 1.4, hold: 7.6 },
    align('02_librarian_b', 15.58, fSend, 6),
    align('02_librarian_b', 24.4, fProp, 4),
  ];
  return (
    <AppFeatureScene {...p} id="R04" title="Portada y El Librarian" kicker="La app" shots={shots}
      taps={[{ f: fTapLib - 2, x: 200, y: 505 }, { f: fSend - 2, x: 588, y: 1364 }]}
      tags={[
        { word: 'recomienda', label: 'Recomendaciones para ti', icon: ic(<StarIcon size={32} />) },
        { word: 'librarian', label: 'El Librarian: asistente con IA', icon: ic(<SyncIcon size={32} />) },
        { word: 'describes', label: 'Pídele libros con tus palabras', icon: ic(<SearchIcon size={32} />) },
      ]} />
  );
};

// R04B · Buscador (autor, narrador) y filtros: idioma, formato y categoría.
export const R04Buscar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R04B', w, n);
  const fNarr = at('narrador');
  const fFil = at('filtrar');
  const fIdi = at('idioma');
  const fFor = at('formato');
  const fCat = at('categoria');
  // Búsqueda «galdos»: toque en el campo (13,12 s), tecleo y resultados (15,1 s).
  const s1: Shot = { rec: '03_buscar', at: 0, start: 12.9, hold: 16.5 };
  // Búsqueda por narrador: «german gijon» y la fila «Germán Gijón» (2,42 s) que se resalta.
  const s2: Shot = { ...align('14_narrador', 2.42, fNarr, 28), hold: 5.0 };
  s2.marks = [{ from: fNarr + 6 - s2.at, to: fFil - s2.at, x: 10, y: 146, w: 644, h: 68, r: 14 }];
  // Categoría con chips de idioma: se pulsa «Español» (41,82 s).
  const s3: Shot = { ...align('17_categorias', 41.82, fIdi, Math.max(12, fIdi - (fFil - 6))), hold: 44.6 };
  // Hoja de filtros: toque en «Audiolibro» (58,6 s) y corte seco al resultado ya marcado (61,9 s), sin la espera de carga.
  const fTapAudio = Math.max(s3.at + 24, fFor + 2);
  const s4: Shot = { rec: '17_categorias', at: Math.max(s3.at + 10, fIdi + 18), start: 0, hold: 58.6 };
  s4.start = Math.max(0, 58.6 - (fTapAudio - s4.at) / 50);
  const s5: Shot = {
    rec: '17_categorias', at: fTapAudio + 1, start: 61.9, hold: 62.6, fade: 0,
    marks: [
      { from: 0, to: fCat - 2 - (fTapAudio + 1), x: 10, y: 366, w: 644, h: 256, r: 14 },
      { from: fCat - 2 - (fTapAudio + 1), to: p.dur - (fTapAudio + 1) + 10, x: 10, y: 668, w: 644, h: 356, r: 14 },
    ],
  };
  return (
    <AppFeatureScene {...p} id="R04B" title="Buscador y filtros" side="left" shots={[s1, s2, s3, s4, s5]}
      taps={[{ f: 9, x: 200, y: 192 }, { f: fIdi - 2, x: 204, y: 373 }, { f: fTapAudio - 2, x: 616, y: 571 }]}
      tags={[
        { word: 'titulo', label: 'Título o autor', icon: ic(<SearchIcon size={32} />) },
        { word: 'narrador', label: 'También por narrador', icon: ic(<MicIcon size={32} />) },
        { word: 'filtrar', label: 'Idioma, formato y categoría', icon: ic(<ListIcon size={32} />) },
      ]} />
  );
};

// R05 · Ficha del libro (Esperando al diluvio, de Dolores Redondo): formatos, narradores, duración y valoraciones.
export const R05Ficha: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R05', w, n);
  const fEbook = at('ebook');
  const fQuien = at('quien');
  const fNarra = at('narra');
  const fDura = at('dura');
  const fNota = at('nota');
  // La toma 2 empieza con el desplazamiento (11,6 s) para que se asiente justo cuando la voz dice «narra».
  const s2At = Math.max(fEbook + 40, fNarra - 64);
  const shots: Shot[] = [
    { rec: '13_diluvio', at: 0, start: 0.3, hold: 11.0, marks: [{ from: fEbook - 4, to: s2At + 8, x: 14, y: 524, w: 636, h: 94, r: 18 }] },
    {
      rec: '13_diluvio', at: s2At, start: 11.5, hold: 13.2,
      marks: [
        { from: fNarra - 2 - s2At, to: fDura - 2 - s2At, x: 10, y: 556, w: 644, h: 76, r: 14 },
        { from: fDura - 2 - s2At, to: fNota - 2 - s2At, x: 10, y: 648, w: 644, h: 76, r: 14 },
        { from: fNota - 2 - s2At, to: p.dur - s2At + 10, x: 10, y: 786, w: 644, h: 266, r: 16 },
      ],
    },
  ];
  return (
    <AppFeatureScene {...p} id="R05" title="La ficha de cada libro" shots={shots}
      tags={[
        { word: 'ebook', label: 'Ebook, audiolibro o los dos', icon: ic(<BookIcon size={32} />) },
        { word: 'narra', label: 'Narrador y duración', icon: ic(<MicIcon size={32} />) },
        { word: 'nota', label: 'Valoraciones de lectores', icon: ic(<StarIcon size={32} />) },
      ]} />
  );
};

// R06 · Leer: tamaño de letra, fondo oscuro o gris, tipografía, márgenes y marcadores con nota
// (Juan Martín el Empecinado, de Galdós). Cada toma arranca justo antes del toque real en la app.
export const R06Leer: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R06', w, n);
  const fTam = at('tamano');
  const fOsc = at('oscuro');
  const fGris = at('gris');
  const fTipo = at('tipografia');
  const fMarg = at('margenes');
  const fMarc = at('marcadores');
  const fNotas = at('notas');
  const fAa = Math.max(20, fTam - 30);
  const marc = align('05_leer', 94.0, fMarc + 2, 30, { hold: 97.8 });
  marc.marks = [{ from: fNotas - 2 - marc.at, to: p.dur - marc.at + 10, x: 18, y: 1350, w: 628, h: 78, r: 16 }];
  const shots: Shot[] = [
    { rec: '05_leer', at: 0, start: Math.max(15.7, 18.14 - fAa / 50), hold: 20.0 },
    align('05_leer', 32.4, fTam + 4, 12, { hold: 34.4 }),
    align('05_leer', 37.2, fOsc + 4, 12, { hold: 48.9 }),
    align('05_leer', 49.54, fGris + 4, 12, { hold: 52.5 }),
    align('05_leer', 52.74, fTipo + 4, 12, { hold: 56.2 }),
    align('05_leer', 59.58, fMarg + 4, 12, { hold: 70.0 }),
    marc,
  ];
  return (
    <AppFeatureScene {...p} id="R06" title="Leer" kicker="Lector de ebooks" side="left" shots={shots}
      taps={[
        { f: fAa - 2, x: 256, y: 1277 }, { f: fTam + 2, x: 501, y: 747 }, { f: fOsc + 2, x: 332, y: 869 }, { f: fGris + 2, x: 520, y: 869 },
        { f: fTipo + 2, x: 262, y: 1120 }, { f: fMarg + 2, x: 551, y: 996 }, { f: fMarc, x: 403, y: 1276 },
      ]}
      tags={[
        { word: 'tamano', label: 'Tamaño de letra', icon: ic(<FontIcon size={32} />) },
        { word: 'oscuro', label: 'Fondo blanco, gris u oscuro', icon: ic(<BookIcon size={32} />) },
        { word: 'tipografia', label: 'Tipografías y márgenes', icon: ic(<ListIcon size={32} />) },
        { word: 'marcadores', label: 'Marcadores con notas', icon: ic(<BookmarkIcon size={32} />) },
      ]} />
  );
};

// R07 · Escuchar: arranca con unos segundos del audiolibro (narración real) y repasa el reproductor.
const R07_START = 5.0;
export const R07Escuchar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R07', w, n);
  const fVel = at('velocidad');
  const fCero = at('cero');
  const fDos = at('dos');
  const fSaltos = at('saltos');
  const fCaps = at('capitulos');
  const fMarc = at('marcadores');
  const fTemp = at('temporizador');
  const fParar = at('parar');
  const fFinal = at('final');
  const fFinCap = at('capitulo', 1);
  // Velocidad: toque en «1,0x» y la hoja con la lista (0,4x arriba).
  const vel = align('06_escuchar', 20.14, fVel - 2, 12, { hold: 28.5 });
  vel.marks = [{ from: fCero - 2 - vel.at, to: fDos + 16 - vel.at, x: 10, y: 288, w: 644, h: 66, r: 12 }];
  // Saltos de 15 s: el reproductor (ya a 1,5x) con los dos botones resaltados.
  const sal: Shot = { rec: '06_escuchar', at: fSaltos - 6, start: 61.0, hold: 63.5 };
  sal.marks = [{ from: 8, to: fCaps - 2 - sal.at, x: 148, y: 830, w: 368, h: 108, r: 54 }];
  // Capítulos y marcadores (pestaña «Marcapáginas»).
  // (Antes de abrir la hoja, la toma ya muestra el temporizador activo: entramos con la hoja de capítulos ya abierta.)
  const caps: Shot = { rec: '06_escuchar', at: fCaps - 4, start: 101.84, hold: 112.5 };
  const marc = align('06_escuchar', 113.16, fMarc - 2, 8, { hold: 125.0 });
  marc.marks = [{ from: 14, to: fTemp - 4 - marc.at, x: 12, y: 376, w: 640, h: 96, r: 14 }];
  // Temporizador: la hoja se abre (63,9 s); «Fin del capítulo» se resalta y se pulsa (76,02 s) y aparece la cuenta atrás.
  const temp = align('06_escuchar', 63.9, fTemp - 2, 10, { hold: 75.5 });
  const finAt = Math.max(temp.at + 20, fParar - 10);
  const fTapFin = Math.max(finAt + 30, fFinal + 2);
  const fin: Shot = {
    rec: '06_escuchar', at: finAt, start: Math.max(0, 76.02 - (fTapFin - finAt) / 50),
    marks: [
      { from: fParar - 2 - finAt, to: fTapFin + 4 - finAt, x: 12, y: 908, w: 640, h: 68, r: 12 },
      { from: Math.max(fTapFin + 16, fFinCap - 2) - finAt, to: p.dur - finAt + 10, x: 120, y: 262, w: 424, h: 172, r: 22 },
    ],
  };
  const shots: Shot[] = [{ rec: '06_escuchar', at: 0, start: R07_START, hold: 19.8 }, vel, sal, caps, marc, temp, fin];
  return (
    <>
      <AppFeatureScene {...p} id="R07" title="Escuchar" kicker="Reproductor" shots={shots}
        taps={[
          { f: fVel - 4, x: 252, y: 1198 }, { f: fCaps - 8, x: 571, y: 1198 }, { f: fMarc - 4, x: 482, y: 200 },
          { f: fTemp - 4, x: 91, y: 1198 }, { f: fTapFin - 2, x: 180, y: 942 },
        ]}
        tags={[
          { word: 'velocidad', label: 'Velocidad de 0,4x a 2x', icon: ic(<SpeedIcon size={32} />) },
          { word: 'saltos', label: 'Saltos de 15 segundos', icon: ic(<ClockIcon size={32} />) },
          { word: 'capitulos', label: 'Capítulos y marcadores', icon: ic(<ListIcon size={32} />) },
          { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        ]} />
      {/* Narración real del audiolibro (unos segundos, por debajo de la voz) */}
      {(!STEM || STEM === 'sfx') && (
        <Sequence from={0} durationInFrames={p.lead + 40} layout="none">
          <Audio src={staticFile('nxr/rec/06_escuchar/video.mp4')} trimBefore={Math.round(R07_START * 50)} volume={(f) => (f < 8 ? f / 8 : f > p.lead + 10 ? Math.max(0, 1 - (f - p.lead - 10) / 30) : 1) * 0.55} />
        </Sequence>
      )}
    </>
  );
};

// R08 · Sin conexión: el filtro «Descargas» de la biblioteca y los ajustes de descarga (datos o solo wifi).
export const R08Offline: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R08', w, n);
  const fDesc = at('descargan');
  const fCon = at('conexion');
  const fEl = at('eliges');
  const fDatos = at('datos');
  const fSolo = at('solo', 1);
  const fWifi = at('wifi');
  // Biblioteca: el chip «Descargas» se pulsa en el segundo 14,4 de la toma; a los 17,4 la toma pasa a «Listas» (se congela antes).
  const fTap = fDesc - 2;
  const setAt = Math.max(fTap + 30, fEl - 6);
  const lib: Shot = {
    rec: '07_biblioteca', at: 0, start: Math.max(0, 14.4 - fTap / 50), hold: 17.2,
    marks: [{ from: fCon - 4, to: setAt + 8, x: 12, y: 350, w: 640, h: 166, r: 16 }],
  };
  // Ajustes › Descargas: «Solo Wi-Fi» queda marcado en el segundo 13,15 de la toma.
  const fSel = fWifi - 2;
  const set: Shot = {
    rec: '09_descargas', at: setAt, start: Math.max(0, 13.15 - (fSel - setAt) / 50),
    marks: [
      { from: fDatos - 2 - setAt, to: fSolo - 2 - setAt, x: 10, y: 314, w: 644, h: 98, r: 14 },
      { from: fSolo - 2 - setAt, to: p.dur - setAt + 10, x: 10, y: 420, w: 644, h: 98, r: 14 },
    ],
  };
  return (
    <AppFeatureScene {...p} id="R08" title="Sin conexión" kicker="Descargas" side="left" shots={[lib, set]}
      taps={[{ f: fTap - 3, x: 293, y: 284 }, { f: fSel - 4, x: 605, y: 467 }]}
      tags={[
        { word: 'descargan', label: 'Se descargan solos', icon: ic(<DownloadIcon size={32} />) },
        { word: 'conexion', label: 'Lee y escucha sin internet', icon: ic(<WifiOffIcon size={32} />) },
        { word: 'wifi', label: 'Solo con wifi, si quieres', icon: ic(<SyncIcon size={32} />) },
      ]} />
  );
};

// R09 · Perfiles: los perfiles de la cuenta, los tres tipos, el inicio infantil y el PIN.
export const R09Perfiles: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R09', w, n);
  const fPerf = at('perfiles');
  const fAdulto = at('adulto');
  const fJuv = at('juvenil');
  const fInf = at('infantil');
  const fInf2 = at('infantil', 1);
  const fPin = at('pin');
  // Perfil de la cuenta: toque en el avatar (0,48 s de la toma, fotograma 24) y la página de perfiles.
  const perf: Shot = { rec: '08_perfil', at: 0, start: 0, hold: 12.0 };
  perf.marks = [{ from: fPerf - 2, to: fAdulto - 14, x: 14, y: 376, w: 636, h: 226, r: 16 }];
  // Configuración del perfil infantil: Adulto, Juvenil y Niños (se resaltan al nombrarlos).
  const tipos = align('19_tipos_perfil', 1.8, fAdulto - 8, 16, { hold: 15.0 });
  tipos.marks = [
    { from: fAdulto - tipos.at, to: fJuv - 2 - tipos.at, x: 16, y: 396, w: 632, h: 114, r: 14 },
    { from: fJuv - 2 - tipos.at, to: fInf - 2 - tipos.at, x: 16, y: 520, w: 632, h: 154, r: 14 },
    { from: fInf - 2 - tipos.at, to: fInf2 - 6 - tipos.at, x: 16, y: 690, w: 632, h: 114, r: 14 },
  ];
  const pin: Shot = { rec: '18_pin', at: fPin - 30, start: 16.6, hold: 18.8, marks: [{ from: 28, to: p.dur - (fPin - 30) + 10, x: 10, y: 1296, w: 644, h: 140, r: 14 }] };
  const shots: Shot[] = [perf, tipos, { rec: '12_infantil_home', at: fInf2 - 10, start: 0.4, hold: 13.0 }, pin];
  return (
    <AppFeatureScene {...p} id="R09" title="Perfiles y niños" shots={shots}
      taps={[{ f: 22, x: 617, y: 93 }, { f: fAdulto - 10, x: 166, y: 710 }]}
      tags={[
        { word: 'perfiles', label: 'Hasta 3 perfiles más', icon: ic(<UserIcon size={32} />) },
        { word: 'adulto', label: 'Adulto, juvenil o infantil', icon: ic(<KidIcon size={32} />) },
        { word: 'pin', label: 'PIN para el perfil infantil', icon: ic(<LockIcon size={32} />) },
      ]} />
  );
};

// R10 · Cómo cuenta las horas (texto real de la app, resaltado línea a línea).
export const R10Horas: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('R10', w, n);
  const fComp = at('comparten');
  const fGuard = at('guardan');
  const fDoble = at('doble');
  const sheetAt = Math.max(0, fComp - 26);
  // La hoja «¿Cómo calculamos el tiempo?» aparece en el segundo ~20,6 de la toma.
  const shots: Shot[] = [
    { rec: '11_actividad', at: 0, start: 1.0 },
    {
      rec: '11_actividad', at: sheetAt, start: 20.4,
      marks: [
        { from: fComp - sheetAt - 2, to: fGuard - sheetAt - 4, x: 12, y: 630, w: 640, h: 82, r: 12 },
        { from: fGuard - sheetAt - 2, to: fDoble - sheetAt - 4, x: 12, y: 750, w: 640, h: 120, r: 12 },
        { from: fDoble - sheetAt - 2, to: p.dur - sheetAt + 10, x: 12, y: 940, w: 640, h: 118, r: 12 },
      ],
    },
  ];
  return (
    <AppFeatureScene {...p} id="R10" title="Ojo con las horas" side="left" shots={shots}
      tags={[
        { word: 'comparten', label: 'Se comparten entre perfiles', icon: ic(<UserIcon size={32} />) },
        { word: 'guardan', label: 'Las que no gastas se guardan', icon: ic(<ChartIcon size={32} />) },
        { word: 'doble', label: 'A 2x, cada hora cuenta doble', icon: ic(<SpeedIcon size={32} />) },
      ]} />
  );
};

export const _APP_W = APP_W;

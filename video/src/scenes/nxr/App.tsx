import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { HeadphonesIcon, BookIcon, MicIcon as MicIcon2 } from '../../components/Icons';
import {
  BookmarkIcon, ChartIcon, DownloadIcon, FontIcon, KidIcon, ListIcon, LockIcon, MoonIcon, PlaneIcon, SearchIcon, SpeedIcon, StarIcon, SyncIcon, UserIcon, WifiOffIcon, ClockIcon,
} from '../../components/Icons2';
import { wf } from './timeline';
import { AppPhone, FeatureTag, PhoneKey, Tap } from './kit';
import { Mark } from '../../components/ScreenClip';

type P = { lead: number; dur: number };
export type TagDef = { word: string; nth?: number; label: string; icon: React.ReactNode; out?: string };

// Escena tipo de la app: el móvil con la grabación a un lado y, al otro, las funciones que la voz va nombrando.
export const AppFeatureScene: React.FC<P & {
  id: string; rec: string; startAt?: number; title: string; kicker?: string; tags: TagDef[]; side?: 'left' | 'right';
  cam?: PhoneKey[]; taps?: Tap[]; marks?: Mark[]; playbackRate?: number; extra?: React.ReactNode;
}> = ({ lead, dur, id, rec, startAt = 0, title, kicker, tags, side = 'right', cam, taps, marks, playbackRate, extra }) => {
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
          <AppPhone rec={rec} startAt={startAt} w={385} cam={cam ?? defaultCam} taps={taps} marks={marks} playbackRate={playbackRate} placeholder={title} />
        </div>
        <div style={{ position: 'absolute', top: 210, [phoneLeft ? 'left' : 'right']: phoneLeft ? 900 : 860, width: 820 } as React.CSSProperties}>
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

const ic = (n: React.ReactNode) => n;

// R04 · Portada y buscador.
export const R04Inicio: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R04" rec="01_inicio" title="Portada y buscador" kicker="La app"
    tags={[
      { word: 'recomienda', label: 'Recomendaciones para ti', icon: ic(<StarIcon size={32} />) },
      { word: 'listas', label: 'Novedades, listas y categorías', icon: ic(<ListIcon size={32} />) },
      { word: 'buscador', label: 'Título, autor o narrador', icon: ic(<SearchIcon size={32} />) },
    ]} />
);

// R05 · Ficha del libro.
export const R05Ficha: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R05" rec="02_ficha" title="Ficha de cada libro" side="left"
    tags={[
      { word: 'ebook', label: 'Ebook, audiolibro o los dos', icon: ic(<BookIcon size={32} />) },
      { word: 'narra', label: 'Narrador y duración', icon: ic(<MicIcon2 size={32} />) },
      { word: 'opinan', label: 'Opiniones de lectores', icon: ic(<StarIcon size={32} />) },
    ]} />
);

// R06 · Leer.
export const R06Leer: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R06" rec="03_leer" title="Leer" kicker="Lector de ebooks"
    tags={[
      { word: 'tamano', label: 'Tamaño y tipo de letra', icon: ic(<FontIcon size={32} />) },
      { word: 'fondo', label: 'Color de fondo y márgenes', icon: ic(<BookIcon size={32} />) },
      { word: 'marcadores', label: 'Marcadores', icon: ic(<BookmarkIcon size={32} />) },
      { word: 'sincroniza', label: 'Progreso sincronizado', icon: ic(<SyncIcon size={32} />) },
    ]} />
);

// R07 · Escuchar.
export const R07Escuchar: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R07" rec="04_escuchar" title="Escuchar" kicker="Reproductor" side="left"
    tags={[
      { word: 'velocidad', label: 'Velocidad de 0,5x a 2x', icon: ic(<SpeedIcon size={32} />) },
      { word: 'saltos', label: 'Saltos de 15 segundos', icon: ic(<ClockIcon size={32} />) },
      { word: 'capitulos', label: 'Capítulos y marcadores', icon: ic(<ListIcon size={32} />) },
      { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
    ]} />
);

// R08 · Sin conexión.
export const R08Offline: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R08" rec="05_descargas" title="Sin conexión" kicker="Descargas"
    tags={[
      { word: 'descargan', label: 'Se descargan en el móvil', icon: ic(<DownloadIcon size={32} />) },
      { word: 'conexion', label: 'Lee y escucha sin internet', icon: ic(<WifiOffIcon size={32} />) },
      { word: 'avion', label: 'Avión, metro o playa', icon: ic(<PlaneIcon size={32} />) },
    ]} />
);

// R09 · Perfiles y modo infantil.
export const R09Perfiles: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R09" rec="06_perfiles" title="Perfiles y niños" side="left"
    tags={[
      { word: 'perfiles', label: 'Hasta 3 perfiles más', icon: ic(<UserIcon size={32} />) },
      { word: 'infantil', label: 'Perfil infantil (menores de 12)', icon: ic(<KidIcon size={32} />) },
      { word: 'pin', label: 'PIN para salir', icon: ic(<LockIcon size={32} />) },
    ]} />
);

// R10 · Estadísticas.
export const R10Stats: React.FC<P> = (p) => (
  <AppFeatureScene {...p} id="R10" rec="07_estadisticas" title="Tus estadísticas"
    tags={[
      { word: 'cuanto', label: 'Lo que lees y escuchas cada mes', icon: ic(<ChartIcon size={32} />) },
      { word: 'categorias', label: 'Tus categorías favoritas', icon: ic(<HeadphonesIcon size={32} />) },
    ]} />
);

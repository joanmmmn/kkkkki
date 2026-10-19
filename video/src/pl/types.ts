// Especificación de una reseña de SonorBooks Polska. Cada plataforma es un archivo de datos (src/pl/specs/<pieza>.tsx):
// el texto de la voz está en public/pl/<pieza>/vo/vo.json y las animaciones se enganchan a sus palabras con «cues».
import type React from 'react';

// Palabra de la locución de la escena (prefijo, sin tildes ni mayúsculas) y, si se repite, qué aparición (0 = la primera).
export type Cue = string | [string, number];

// Toma de pantalla grabada con tools/record.mjs en public/pl/<pieza>/rec/<clip>/.
export type RecRef = {
  clip: string;
  start?: number; // segundo de la grabación en el que empieza la toma
  rate?: number; // velocidad
  holdAt?: number; // segundo en el que se congela la imagen
  mobile?: boolean; // grabación con viewport de móvil (430×932): se enseña en un teléfono
  url?: string; // texto de la barra de direcciones del navegador (por defecto el dominio de la plataforma)
  cursor?: boolean; // dibujar el cursor (por defecto sí en escritorio)
};
// Cambio de toma dentro de una escena: desde la palabra `at`, se ve `rec`.
export type Cut = { at: Cue; rec: RecRef };
// Marco amarillo sobre la grabación (píxeles CSS del viewport grabado: 1920×1080 en escritorio, 430×932 en móvil).
export type MarkSpec = { at: Cue; until?: Cue; x: number; y: number; w: number; h: number; label?: string; r?: number };
// Acercamiento de la cámara virtual a un punto de la grabación.
export type ZoomSpec = { at: Cue; zoom: number; x: number; y: number };
// Etiqueta (píldora) que aparece con una palabra.
export type TagSpec = { at: Cue; label: string; sub?: string; icon?: IconName; tone?: 'plain' | 'good' | 'bad' | 'accent' };

export type IconName =
  | 'book' | 'headphones' | 'music' | 'mic' | 'phone' | 'tablet' | 'laptop' | 'globe' | 'search' | 'clock' | 'user' | 'kid' | 'lock'
  | 'download' | 'wifiOff' | 'moon' | 'speed' | 'bookmark' | 'list' | 'font' | 'sync' | 'car' | 'watch' | 'cast' | 'ereader' | 'pdf'
  | 'star' | 'chart' | 'card' | 'mail' | 'calendar' | 'infinity' | 'link' | 'doc' | 'check' | 'cross' | 'heart' | 'speaker' | 'library'
  | 'gift' | 'family' | 'coin' | 'play' | 'sparkle' | 'school' | 'radio' | 'tv';

type Base = {
  id: string; // ID de la locución (A01, B03…)
  bump?: string; // título del separador de sección que abre la escena
  tin?: 'push' | 'slide' | 'cut';
  extra?: number; // fotogramas de más al final
  lead?: number; // segundos antes de que empiece la voz
  title?: string; // título corto de la escena (arriba)
  kicker?: string;
  // Audio real que suena en la escena (p. ej. un fragmento de un audiolibro de dominio público), desde `lead`.
  // La escena dura al menos `dur` segundos aunque no tenga locución (si no hay locución, deja su `text` vacío en vo.json).
  audio?: { src: string; dur: number; volume?: number };
};

export type HookScene = Base & { kind: 'hook'; title: string; hi?: string[]; rec?: RecRef; cuts?: Cut[]; promises: TagSpec[]; badge?: string };
export type IntroScene = Base & {
  kind: 'intro'; facts: TagSpec[]; big?: { at: Cue; value: number; decimals?: number; prefix?: string; suffix?: string; label: string }; rec?: RecRef; cuts?: Cut[];
};
// features: «!texto» se pinta con una cruz (lo que el plan no incluye).
export type PlanSpec = { at: Cue; name: string; price: string; period: string; note?: string; features: string[]; best?: boolean; badge?: string };
export type PlansScene = Base & { kind: 'plans'; plans: PlanSpec[]; footer?: TagSpec[] };
export type RecScene = Base & { kind: 'rec'; rec: RecRef; cuts?: Cut[]; marks?: MarkSpec[]; zooms?: ZoomSpec[]; tags?: TagSpec[]; side?: 'left' | 'right' };
export type FeaturesScene = Base & { kind: 'features'; items: TagSpec[]; cols?: number };
export type StatScene = Base & { kind: 'stat'; at: Cue; value: string; unit?: string; label: string; tags?: TagSpec[]; count?: { from: number; to: number; decimals?: number } };
export type DevicesScene = Base & { kind: 'devices'; items: (TagSpec & { ok: boolean })[] };
export type StoreSpec = { at: Cue; store: 'google' | 'apple'; rating: number; count: string };
export type RatingsScene = Base & { kind: 'ratings'; stores: StoreSpec[]; likes: TagSpec[]; dislikes: TagSpec[]; notes?: TagSpec[] };
export type ProsConsScene = Base & { kind: 'proscons'; pros: TagSpec[]; cons: TagSpec[] };
export type VerdictScene = Base & { kind: 'verdict'; question?: string; yes: TagSpec[]; no: TagSpec[]; alts?: { at: Cue; names: string[]; label?: string } };
export type StepSpec = { at: Cue; title: string; sub?: string; rec?: RecRef };
export type StepsScene = Base & { kind: 'steps'; steps: StepSpec[]; rec?: RecRef; marks?: MarkSpec[]; zooms?: ZoomSpec[]; note?: TagSpec };
export type OutroScene = Base & { kind: 'outro'; rec?: RecRef; cta: string; ctaAt: Cue; tags?: TagSpec[]; signAt: Cue };

export type SceneSpec = HookScene | IntroScene | PlansScene | RecScene | FeaturesScene | StatScene | DevicesScene | RatingsScene | ProsConsScene | VerdictScene | StepsScene | OutroScene;

export type PlatformSpec = {
  slug: string; // carpeta en public/pl/
  name: string; // nombre de la plataforma
  domain: string; // dominio que se ve en la barra del navegador
  color: string; deep: string; soft: string; // colores de marca
  logo: string; logoRatio: number; logoWhite?: string; // public/pl/<pieza>/img/…
  tileBg?: string; // fondo del icono de app (por defecto el color de marca)
  tileLogoWhite?: boolean; // logo blanco en el icono
  kicker: string; // «Recenzja Storytel»
  music: string; // public/… (lecho musical ya montado a las secciones)
  scenes: SceneSpec[];
  chapters: { label: string; from: string }[];
  extra?: Record<string, React.ReactNode>;
};

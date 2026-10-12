import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { HeadphonesIcon, HeartIcon, MicIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, DownloadIcon, ListIcon, LockIcon, MoonIcon, PhoneIcon, SearchIcon, SpeedIcon, StarIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { align, AppFeatureScene, markOn, PV, PV_DEEP, Shot } from './kit';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;
// Coordenadas del clic en la pantalla del ordenador (1456×819, BlueStacks a pantalla completa) → píxeles de la grabación.
const tapXY = (cx: number, cy: number) => ({ x: Math.round(cx * 1.7582 - 948), y: Math.round(cy * 1.7582) });

// K04 · Primeros pasos y portada: eliges pódcasts, audiolibros o los dos; «Recopilando tus intereses» y la portada
// (populares, novedades y los favoritos de los editores).
export const K04Portada: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('K04', w, n);
  const fPod = at('podcasts');
  const fAud = at('audiolibros');
  const fPortada = at('portada');
  const fPop = at('populares');
  const fNov = at('novedades');
  const fEdit = at('editores');
  // Toques reales: «Podcasts» se marca en el segundo 29,14 de la toma y «Audiolibros» en el 37,42.
  const s0: Shot = { rec: '00_gustos', at: 0, start: Math.max(0, 29.14 - (fPod + 2) / 50), hold: 29.6 };
  const s1 = align('00_gustos', 37.42, fAud + 2, 12, { hold: 39.6 });
  const s2: Shot = { rec: '03_recopilando', at: Math.max(s1.at + 20, fPortada - 22), start: 1.9, hold: 9.6 };
  const s3 = align('04_inicio', 13.5, fPop, 12, { hold: 14.3 });
  s3.marks = [markOn(s3, fPop, fNov - 4, 16, 478, 480, 510, 26)];
  const s4 = align('04_inicio', 22.0, fNov, 8, { hold: 22.6 });
  s4.marks = [markOn(s4, fNov, fEdit - 4, 10, 236, 470, 810, 26)];
  const s5 = align('04_inicio', 16.2, fEdit, 8, { hold: 17.0 });
  s5.marks = [markOn(s5, fEdit, p.dur + 10, 14, 256, 636, 990, 26)];
  const tP = tapXY(640, 194);
  const tA = tapXY(640, 428);
  return (
    <AppFeatureScene {...p} id="K04" title="Primeros pasos" kicker="La app" shots={[s0, s1, s2, s3, s4, s5]}
      taps={[{ f: fPod + 1, ...tP }, { f: fAud + 1, ...tA }]}
      focusExtra={[{ from: 4, to: fAud + 30, y: 560, s: 1.18 }]}
      tags={[
        { word: 'podcasts', label: 'Pódcasts, audiolibros o los dos', icon: ic(<HeartIcon size={32} c={color.ink} />) },
        { word: 'portada', label: 'Una portada a tu gusto', icon: ic(<StarIcon size={32} />) },
        { word: 'populares', label: 'Populares y novedades', icon: ic(<ListIcon size={32} />) },
        { word: 'editores', label: 'Los favoritos de los editores', icon: ic(<HeadphonesIcon size={32} />) },
      ]} />
  );
};

// K05 · Pódcasts exclusivos: el sello «Solo en podimo», clips en vídeo, los títulos que nombra la voz y
// «Entre el cielo y las nubes» (Podimo Original, premiado en los Ondas).
export const K05Exclusivos: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('K05', w, n);
  const fExcl = at('exclusivos');
  const fVideo = at('video');
  const fMimi = at('mimicidios');
  const fMalas = at('malas');
  const fVida = at('vida');
  const fEntre = at('entre');
  const fOndas = at('ondas');
  const s0: Shot = { rec: '04_inicio', at: 0, start: 13.4, hold: 14.2 };
  s0.marks = [markOn(s0, fExcl - 2, fVideo - 4, 22, 548, 470, 440, 26)];
  const s1 = align('04_inicio', 29.8, fVideo, 8, { hold: 32.5 });
  s1.marks = [markOn(s1, fVideo + 2, fMimi - 4, 14, 8, 636, 700, 26)];
  const s2 = align('01_int_pod', 24.0, fMimi, 8, { hold: 25.0 });
  s2.marks = [
    markOn(s2, fMimi, fMalas - 2, 336, 292, 292, 270, 22),
    markOn(s2, fMalas, fVida - 2, 32, 580, 292, 345, 22),
    markOn(s2, fVida, fEntre - 4, 336, 953, 292, 345, 22),
  ];
  const s3 = align('11_podcast', 16.6, fEntre, 10, { hold: 31 });
  s3.marks = [markOn(s3, fEntre + 2, fOndas - 2, 12, 748, 236, 58, 29), markOn(s3, fOndas, p.dur + 10, 12, 930, 640, 124, 18)];
  return (
    <AppFeatureScene {...p} id="K05" title="Pódcasts exclusivos" side="left" shots={[s0, s1, s2, s3]}
      tags={[
        { word: 'exclusivos', label: 'Solo en Podimo', icon: ic(<MicIcon size={32} />) },
        { word: 'video', label: 'Muchos, también en vídeo', icon: ic(<PhoneIcon size={32} />) },
        { word: 'mimicidios', label: 'Mimicidios, Malas personas…', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'ondas', label: 'Premiado en los Ondas', icon: ic(<StarIcon size={32} />) },
      ]} />
  );
};

// K06 · Audiolibros: categorías (thriller, novedades, biografías, desarrollo personal), búsqueda «Carles Porta» y ficha
// de «Le llamaban padre» (narrador, duración y valoración).
export const K06Audiolibros: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('K06', w, n);
  const fThr = at('thrillers');
  const fNov = at('novedades');
  const fBio = at('biografias');
  const fDes = at('desarrollo');
  const fBuscas = at('buscas');
  const fTitulo = at('titulo');
  const fFicha = at('ficha');
  const fNarra = at('narra');
  const fDura = at('dura');
  const fOpinan = at('opinan');
  const s0: Shot = { rec: '05_buscar', at: 0, start: 13.0, hold: 21.6 };
  s0.marks = [
    markOn(s0, fThr - 2, fNov - 2, 14, 688, 636, 88, 16),
    markOn(s0, fNov, fBio - 2, 14, 320, 636, 128, 18),
    markOn(s0, fBio, fDes - 2, 14, 1036, 636, 90, 16),
    markOn(s0, fDes, fBuscas - 4, 14, 862, 636, 90, 16),
  ];
  // El texto «Carles Porta» aparece entero en el segundo 24,5 de la toma: se teclea justo antes (sonido) y entra ahí.
  const s1 = align('05_buscar', 24.5, fTitulo + 6, 22, { hold: 33 });
  s1.marks = [markOn(s1, fTitulo + 30, fFicha - 4, 6, 212, 652, 122, 16)];
  const keys = Array.from({ length: 12 }, (_, i) => fTitulo + 6 - 22 + i * 2);
  const s2 = align('06_ficha', 0.6, fFicha, 6, { hold: 9.4 });
  s2.marks = [
    markOn(s2, fNarra - 2, fDura - 2, 182, 822, 300, 46, 14),
    markOn(s2, fDura, fOpinan - 2, 14, 1244, 410, 48, 14),
    markOn(s2, fOpinan, p.dur + 10, 196, 733, 272, 46, 14),
  ];
  return (
    <AppFeatureScene {...p} id="K06" title="Audiolibros" shots={[s0, s1, s2]} keys={keys}
      taps={[{ f: s1.at + 4, x: 300, y: 176 }]}
      tags={[
        { word: 'thrillers', label: 'Thriller, biografías y más', icon: ic(<ListIcon size={32} />) },
        { word: 'buscas', label: 'Busca por título o autor', icon: ic(<SearchIcon size={32} />) },
        { word: 'narra', label: 'Narrador y duración', icon: ic(<MicIcon size={32} />) },
        { word: 'opinan', label: 'Valoración de los oyentes', icon: ic(<StarIcon size={32} />) },
      ]} />
  );
};

// K07 · Reproductor: velocidad (0,75x a 2x), capítulos, descarga y temporizador para dormir.
export const K07Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('K07', w, n);
  const fVel = at('velocidad');
  const fCap = at('capitulos');
  const fDesc = at('descargas');
  const fTemp = at('temporizador');
  const s0: Shot = { rec: '08_reproductor', at: 0, start: 18.4, hold: 21 };
  const s1 = align('09_velocidad', 1.4, fVel, 8, { hold: 5.5 });
  s1.marks = [markOn(s1, fVel + 2, fCap - 4, 276, 672, 320, 480, 18)];
  const s2 = align('10_capitulos', 3.0, fCap, 8, { hold: 9.5 });
  s2.marks = [markOn(s2, fCap + 2, fDesc - 4, 8, 806, 648, 560, 18)];
  const s3 = align('09_velocidad', 12.4, fDesc, 8, { hold: 14 });
  s3.marks = [markOn(s3, fDesc + 2, fTemp - 4, 22, 716, 620, 84, 42)];
  const s4 = align('08_reproductor', 4.0, fTemp, 10, { hold: 15 });
  s4.marks = [markOn(s4, fTemp + 2, p.dur + 10, 26, 636, 612, 580, 22)];
  return (
    <AppFeatureScene {...p} id="K07" title="El reproductor" side="left" shots={[s0, s1, s2, s3, s4]}
      tags={[
        { word: 'velocidad', label: 'Velocidad hasta 2x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'capitulos', label: 'Capítulos', icon: ic(<ListIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
      ]} />
  );
};

// Contador de la prueba a 2x: tiempo real frente a tiempo de audiolibro gastado (el reloj de la app baja el doble).
const DoubleClock: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 160 } });
  if (frame < at - 1) return <div style={{ height: 150 }} />;
  const real = Math.floor(Math.max(0, (frame - at - 8) / fps));
  const fmt = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`;
  const row = (label: string, val: string, hot: boolean, w: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ width: 230, fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 14, borderRadius: 7, background: '#EEE', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, w)}%`, background: hot ? PV : color.ink, borderRadius: 7 }} />
      </div>
      <div style={{ width: 92, textAlign: 'right', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: hot ? PV_DEEP : color.ink, fontVariantNumeric: 'tabular-nums' }}>{val}</div>
    </div>
  );
  return (
    <div style={{ marginTop: 34, width: 700, padding: '24px 30px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
      display: 'flex', flexDirection: 'column', gap: 16, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      {row('Tiempo real', fmt(real), false, (real / 20) * 100)}
      {row('Gastado a 2x', fmt(real * 2), true, ((real * 2) / 20) * 100)}
    </div>
  );
};

// K08 · Ojo con las horas: el reloj del reproductor, «19h 56m restantes · Se reinicia cada mes» y, a 2x, el reloj
// bajando el doble de rápido (grabado: 44 s menos en unos 22 s reales).
export const K08Horas: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('K08', w, n);
  const fReloj = at('reloj');
  const fVeinte = at('veinte');
  const fRein = at('reinician');
  const fAcum = at('acumulan');
  const fDoble = at('doble');
  const s0: Shot = { rec: '08_reproductor', at: 0, start: 17.6, hold: 40 };
  s0.marks = [markOn(s0, fReloj - 2, fVeinte - 6, 92, 58, 196, 68, 34)];
  const s1 = align('13_membresia', 2.4, fVeinte, 10, { hold: 26 });
  s1.marks = [markOn(s1, fVeinte, fDoble - 6, 22, 438, 620, 122, 18)];
  const s2 = align('09_velocidad', 50.0, fDoble, 10, {});
  s2.marks = [markOn(s2, fDoble, p.dur + 10, 92, 58, 196, 68, 34), markOn(s2, fDoble + 8, p.dur + 10, 486, 58, 92, 68, 34)];
  return (
    <AppFeatureScene {...p} id="K08" title="Ojo con las horas" shots={[s0, s1, s2]}
      focusExtra={[]}
      tags={[
        { word: 'reloj', label: 'Lo que te queda este mes', icon: ic(<ClockIcon size={32} />) },
        { word: 'reinician', label: 'Se reinician el día 1', icon: ic(<CalendarIcon size={32} />) },
        { word: 'acumulan', label: 'No se acumulan', icon: ic(<LockIcon size={32} />) },
        { word: 'doble', label: 'A 2x, el reloj baja el doble', icon: ic(<SpeedIcon size={32} />) },
      ]}
      extra={<DoubleClock at={fDoble + 4} />} />
  );
};


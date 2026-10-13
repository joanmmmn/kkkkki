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
// Copa (premio Ondas).
const TrophyIcon: React.FC<{ size?: number; c?: string }> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4.2" /><path d="M17 6h2.5a2.5 2.5 0 0 1-2.5 4.2" />
    <path d="M12 14v3.5" /><path d="M8.5 20.5h7" /><path d="M9.5 20.5l.6-3h3.8l.6 3" />
  </svg>
);
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
  // «…y la portada se adapta a ti»: la portada aparece con la palabra (sin la pantalla de carga, casi negra).
  const s2: Shot = { rec: '15_inicio_top', at: Math.max(s1.at + 24, fPortada - 8), start: 3.0, hold: 15 };
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
        { word: 'premiado', label: 'Premiado en los Ondas', sub: 'Podcast Revelación 2025', icon: ic(<TrophyIcon size={34} />) },
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

// Prueba a 2x (v2): dos cronómetros. A la izquierda, el tiempo real; a la derecha, el reloj de Podimo, que con la
// velocidad a 2x gira el doble de rápido (grabado en la app: 44 s menos en unos 22 s reales).
const Dial: React.FC<{ label: string; t: number; hot: boolean; s: number; size?: number }> = ({ label, t, hot, s, size = 196 }) => {
  const r = size / 2;
  const ang = (t / 60) * 360; // una vuelta por minuto
  const c = hot ? PV : color.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: s, transform: `translateY(${((1 - s) * 30).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={r} cy={r} r={r - 6} fill="#fff" stroke={hot ? PV : '#E6E6E6'} strokeWidth={hot ? 6 : 4} />
        {Array.from({ length: 60 }, (_, i) => {
          const big = i % 5 === 0;
          const a = (i / 60) * Math.PI * 2;
          const r1 = r - 16, r2 = r - (big ? 34 : 24);
          return <line key={i} x1={r + r1 * Math.sin(a)} y1={r - r1 * Math.cos(a)} x2={r + r2 * Math.sin(a)} y2={r - r2 * Math.cos(a)} stroke={big ? color.ink : '#C9C9C9'} strokeWidth={big ? 4 : 2} strokeLinecap="round" />;
        })}
        {/* sector recorrido */}
        <path d={`M ${r} ${r} L ${r} ${r - (r - 40)} A ${r - 40} ${r - 40} 0 ${ang % 360 > 180 ? 1 : 0} 1 ${r + (r - 40) * Math.sin((ang * Math.PI) / 180)} ${r - (r - 40) * Math.cos((ang * Math.PI) / 180)} Z`}
          fill={hot ? 'rgba(168,155,237,0.28)' : 'rgba(16,16,16,0.08)'} />
        <line x1={r} y1={r} x2={r + (r - 46) * Math.sin((ang * Math.PI) / 180)} y2={r - (r - 46) * Math.cos((ang * Math.PI) / 180)} stroke={c} strokeWidth={7} strokeLinecap="round" />
        <circle cx={r} cy={r} r={11} fill={c} />
      </svg>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: hot ? PV_DEEP : color.ink, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        0:{String(Math.floor(t)).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: hot ? PV_DEEP : color.ink2 }}>{label}</div>
    </div>
  );
};
const DoubleClock: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sA = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 160 } });
  const sB = spring({ frame: frame - at - 5, fps, config: { damping: 15, stiffness: 160 } });
  if (frame < at - 1) return <div style={{ height: 316 }} />;
  const real = Math.max(0, (frame - at - 10) / fps);
  const badge = spring({ frame: frame - at - 12, fps, config: { damping: 10, stiffness: 220 } });
  return (
    <div style={{ marginTop: 26, height: 290, display: 'flex', alignItems: 'center', gap: 34 }}>
      <Dial label="Tiempo real" t={real} hot={false} s={sA} />
      <div style={{ padding: '10px 20px', borderRadius: 999, background: color.ink, color: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 40,
        opacity: badge, transform: `scale(${(0.5 + 0.5 * badge).toFixed(4)})` }}>×2</div>
      <Dial label="Reloj de Podimo" t={real * 2} hot s={sB} />
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
    <AppFeatureScene {...p} id="K08" title="Ojo con las horas" shots={[s0, s1, s2]} titleSize={96} tagSize={42} tagGap={16}
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


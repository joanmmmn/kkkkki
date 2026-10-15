import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { clamp } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, HeadphonesIcon } from '../../components/Icons';
import {
  BookmarkIcon, ClockIcon, DownloadIcon, GlobeIcon, LaptopIcon, ListIcon, MoonIcon, PhoneIcon, SearchIcon, SpeedIcon, StarIcon, TabletIcon, UserIcon, WatchIcon,
} from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { align, AppFeatureScene, markOn, MaskTitle, Sheen, Shot, SP, SP_DEEP, SP_INK, SP_SOFT, SpoStage } from './kit';

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
const CameraIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10.5H4z" /><circle cx="12" cy="13.5" r="3.4" />
  </svg>
);
const SkipIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12a7 7 0 1 1-2.05-4.95" /><path d="M17.5 3.5v4h-4" /><text x="12" y="15.2" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={c} stroke="none" fontFamily="Ubuntu, sans-serif">15</text>
  </svg>
);
// Pestaña «Buscar» de la barra inferior y tarjeta «Audiolibros» de Buscar (px de la toma, 664×1440).
const TAB_BUSCAR = { x: 192, y: 1335, w: 110, h: 100 };
const TILE_AUD = { x: 22, y: 416, w: 300, h: 120 };

// U08 · La sección Audiolibros: Buscar → «Audiolibros» (novedades y tendencias, géneros de «Explora sin límites», listas de los
// editores y autores populares).
export const U08Seccion: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('U08', w, n);
  const fBuscar = at('buscar');
  const fSeccion = at('seccion');
  const fAud = at('audiolibros', 1);
  const fNov = at('novedades');
  const fGen = at('generos');
  const fListas = at('listas');
  const fAutores = at('autores');
  // Buscar: el toque en «Audiolibros» (a los 7,8 s de la toma) cae justo después de que la voz lo diga.
  const tapF = fAud + 6;
  const s0: Shot = { rec: '00_buscar', at: 0, start: Math.max(0, 7.8 - tapF / 50), hold: 8.2 };
  s0.marks = [markOn(s0, fBuscar - 2, fSeccion - 4, TAB_BUSCAR.x, TAB_BUSCAR.y, TAB_BUSCAR.w, TAB_BUSCAR.h, 22), markOn(s0, fSeccion - 2, tapF + 2, TILE_AUD.x, TILE_AUD.y, TILE_AUD.w, TILE_AUD.h, 22)];
  const s1: Shot = { rec: '01_hub', at: tapF + 22, start: 0.1, hold: 3.4 };
  s1.marks = [markOn(s1, fNov - 2, fGen - 8, 8, 408, 648, 424, 22)];
  const s2: Shot = { rec: '01_hub', at: fGen - 6, start: 4.4, hold: 17.5 };
  s2.marks = [markOn(s2, fGen, fListas - 6, 8, 430, 648, 790, 22)];
  const s3: Shot = { rec: '01_hub', at: fListas - 6, start: 43.6, hold: 55.5 };
  s3.marks = [markOn(s3, fListas, fAutores - 4, 8, 490, 648, 330, 22), markOn(s3, fAutores, p.dur + 20, 8, 880, 648, 330, 22)];
  return (
    <AppFeatureScene {...p} id="U08" title={'La sección\nAudiolibros'} hi="Audiolibros" shots={[s0, s1, s2, s3]} titleSize={96} tagSize={38} tagGap={14}
      taps={[{ f: tapF, x: 171, y: 476 }]}
      tags={[
        { word: 'buscar', label: 'En Buscar', icon: ic(<SearchIcon size={30} />) },
        { word: 'audiolibros', nth: 1, label: 'Toca «Audiolibros»', icon: ic(<HeadphonesIcon size={30} />) },
        { word: 'novedades', label: 'Novedades y tendencias', icon: ic(<StarIcon size={30} />) },
        { word: 'generos', label: 'Géneros', icon: ic(<GridIcon size={30} />) },
        { word: 'listas', label: 'Listas de sus editores', icon: ic(<ListIcon size={30} />) },
        { word: 'autores', label: 'Autores populares', icon: ic(<UserIcon size={30} />) },
      ]} />
  );
};

// U09 · Buscar y fichas: sin filtro salen antes pódcasts y listas («tres mundos posteguillo»: episodios de entrevistas y reseñas);
// con el filtro Audiolibros, el libro. La ficha de Reina Roja: «Incluido con Premium», duración (11 h 46 min), narradora (Nikki García) y nota (★ 4,8);
// «Prueba el libro» reproduce una muestra gratis, sin gastar horas.
export const U09Buscar: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('U09', w, n);
  const fAntes = at('antes');
  const fFiltro = at('filtro');
  const fAud = at('audiolibros');
  const fFicha = at('ficha');
  const fIncl = at('incluido');
  const fCuanto = at('cuanto');
  const fQuien = at('quien');
  const fNota = at('nota');
  const fEscuchar = at('escuchar');
  const fMuestra = at('muestra');
  // «tres mundos posteguillo» sin filtro: antes salen episodios de pódcasts (entrevistas y reseñas del libro).
  const s0: Shot = { rec: '18_tres_mundos', at: 0, start: 2.0, hold: 9.5 };
  s0.marks = [markOn(s0, fAntes - 2, fFiltro - 10, 8, 196, 648, 345, 20)];
  // El toque en «Audiolibros» (fila de filtros ya arrastrada) cae a los 12,45 s de la toma; a los 13,1 s ya está filtrado y el
  // filtro se ha movido a la izquierda.
  const s1 = align('18_tres_mundos', 12.45, fAud + 2, 34, { hold: 24.5 });
  s1.marks = [markOn(s1, fAud + 36, fFicha - 8, 88, 128, 134, 56, 28)];
  const s2: Shot = { rec: '03_reina_ficha', at: fFicha - 6, start: 1.0, hold: 17.5 };
  s2.marks = [
    markOn(s2, fIncl - 4, fCuanto - 4, 14, 504, 322, 40, 12),
    markOn(s2, fCuanto - 2, fQuien - 4, 288, 666, 156, 46, 14),
    markOn(s2, fQuien - 2, fNota - 4, 14, 1188, 334, 42, 12),
    markOn(s2, fNota - 2, fMuestra - 10, 14, 666, 140, 46, 14),
  ];
  const s3: Shot = { rec: '04_muestra', at: fMuestra - 6, start: 1.0, hold: 14.0 };
  s3.marks = [markOn(s3, fMuestra, p.dur + 20, 100, 330, 464, 470, 24)];
  return (
    <AppFeatureScene {...p} id="U09" title="Buscar y fichas" side="left" shots={[s0, s1, s2, s3]} titleSize={100} tagSize={40} tagGap={16}
      taps={[{ f: fAud + 2, x: 330, y: 156 }, { f: fEscuchar - 2, x: 330, y: 1062 }]}
      tags={[
        { word: 'antes', label: 'Antes salen pódcasts y listas', icon: ic(<ListIcon size={32} />) },
        { word: 'filtro', label: 'Filtro «Audiolibros»', icon: ic(<FilterIcon size={32} />) },
        { word: 'incluido', label: 'Si está incluido', icon: ic(<CheckIcon size={32} />) },
        { word: 'cuanto', label: 'Duración, narrador y nota', icon: ic(<ClockIcon size={32} />) },
        { word: 'muestra', label: 'Muestra gratis', sub: 'Sin gastar horas', icon: ic(<HeadphonesIcon size={32} />) },
      ]} />
  );
};

// U10 · Reproductor: velocidad de 0,5x a 3,5x (la hoja «Velocidad» real: 0,5x y 3,5x), temporizador, capítulos, saltos de 15 s
// y descargas (el botón de descarga de la ficha).
export const U10Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('U10', w, n);
  const fCero = at('cero');
  const fTres = at('tres');
  const fTemp = at('temporizador');
  const fCap = at('capitulos');
  const fSaltos = at('saltos');
  const fDesc = at('descargas');
  const s0: Shot = { rec: '05_reproductor', at: 0, start: 12.0, hold: 17.5 };
  const s1: Shot = { rec: '06_velocidad', at: fCero - 8, start: 23.0, hold: 33.0 };
  s1.marks = [markOn(s1, fCero - 2, fTres - 6, 24, 1050, 616, 232, 22)];
  const s2: Shot = { rec: '06_velocidad', at: fTres - 4, start: 10.0, hold: 19.5 };
  s2.marks = [markOn(s2, fTres, fTemp - 6, 24, 1050, 616, 232, 22)];
  const s3: Shot = { rec: '07_temporizador', at: fTemp - 6, start: 0.6, hold: 3.1 };
  s3.marks = [markOn(s3, fTemp, fCap - 6, 16, 812, 632, 618, 22)];
  const s4: Shot = { rec: '08_capitulos', at: fCap - 6, start: 1.0, hold: 13.5 };
  s4.marks = [markOn(s4, fCap, fSaltos - 6, 8, 148, 648, 612, 22)];
  const s5: Shot = { rec: '09_pausa', at: fSaltos - 6, start: 0.5, hold: 2.5 };
  s5.marks = [markOn(s5, fSaltos, fDesc - 6, 136, 1158, 392, 104, 52)];
  const s6: Shot = { rec: '03_reina_ficha', at: fDesc - 6, start: 20.0, hold: 29.0 };
  s6.marks = [markOn(s6, fDesc, p.dur + 20, 92, 228, 62, 62, 31)];
  return (
    <AppFeatureScene {...p} id="U10" title="El reproductor" shots={[s0, s1, s2, s3, s4, s5, s6]} tagSize={40} tagGap={16}
      taps={[{ f: fCero - 12, x: 60, y: 1210 }, { f: fTemp - 8, x: 605, y: 1210 }, { f: fCap - 8, x: 118, y: 937 }]}
      tags={[
        { word: 'cero', label: 'De 0,5x a 3,5x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', icon: ic(<MoonIcon size={32} />) },
        { word: 'capitulos', label: 'Capítulos', icon: ic(<ListIcon size={32} />) },
        { word: 'saltos', label: 'Saltos de 15 segundos', icon: ic(<SkipIcon size={32} />) },
        { word: 'descargas', label: 'Descargas sin conexión', icon: ic(<DownloadIcon size={32} />) },
      ]} />
  );
};

// U11 · «Encuentra la página» (ficha de Los tres mundos y su hoja: «Escanear para escuchar» y «Buscar página»).
export const U11Pagina: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('U11', w, n);
  const fEnc = at('encuentra');
  const fEsc = at('escaneas');
  const fReves = at('reves');
  const s0: Shot = { rec: '19_tres_mundos_ficha', at: 0, start: 1.0, hold: 11.0 };
  s0.marks = [markOn(s0, fEnc - 2, fEsc - 10, 24, 858, 266, 52, 26)];
  const s1: Shot = { rec: '20_encuentra_pagina', at: fEsc - 6, start: 1.0, hold: 13.0 };
  s1.marks = [markOn(s1, fEsc, fReves - 6, 128, 1254, 408, 62, 31), markOn(s1, fReves, p.dur + 20, 128, 1358, 408, 58, 29)];
  return (
    <AppFeatureScene {...p} id="U11" title="Encuentra la página" hi="página" side="left" shots={[s0, s1]} titleSize={96} tagSize={40} tagGap={18}
      taps={[{ f: fEsc - 8, x: 156, y: 884 }]}
      tags={[
        { word: 'curiosa', label: 'Una función curiosa', icon: ic(<StarIcon size={32} />) },
        { word: 'escaneas', label: 'Escanea una página', sub: 'De tu libro en papel o del ebook', icon: ic(<CameraIcon size={32} />) },
        { word: 'sigues', label: 'Y sigues escuchando desde ahí', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'reves', label: 'O al revés: en qué página ibas', icon: ic(<BookmarkIcon size={32} />) },
      ]} />
  );
};

// Dibujo de cada dispositivo con un reproductor en miniatura (portada verde con ecualizador).
const MiniPlayer: React.FC<{ w: number; h: number; frame: number; seed: number }> = ({ w, h, frame, seed }) => {
  const m = Math.min(w, h);
  const eq = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame / (5.2 + i * 0.9) + seed + i * 1.7));
  return (
    <div style={{ width: w, height: h, borderRadius: m * 0.12, background: 'linear-gradient(160deg, #1f1f1f 0%, #0b0b0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: m * 0.08, padding: m * 0.08, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: m * 0.5, height: m * 0.5, borderRadius: m * 0.07, background: `linear-gradient(135deg, ${SP} 0%, #0FA84A 100%)`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: m * 0.03, paddingBottom: m * 0.08, boxSizing: 'border-box' }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: m * 0.05, height: m * 0.25 * eq(i), borderRadius: m * 0.025, background: SP_INK }} />)}
      </div>
      {w > h * 1.1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: m * 0.05 }}>
          <div style={{ height: m * 0.06, width: '80%', borderRadius: 99, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ height: m * 0.045, width: '55%', borderRadius: 99, background: 'rgba(255,255,255,0.35)' }} />
          <div style={{ position: 'relative', height: Math.max(3, m * 0.03), width: '100%', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: m * 0.04 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(30 + ((frame * 0.25 + seed * 20) % 60)).toFixed(1)}%`, borderRadius: 99, background: SP }} />
          </div>
        </div>
      )}
    </div>
  );
};
const DeviceArt: React.FC<{ kind: number; frame: number }> = ({ kind, frame }) => {
  if (kind === 0) return <div style={{ width: 92, height: 176, borderRadius: 20, background: '#2a2b30', padding: 6, boxSizing: 'border-box' }}><MiniPlayer w={80} h={164} frame={frame} seed={1} /></div>;
  if (kind === 1) return <div style={{ width: 200, height: 150, borderRadius: 18, background: '#2a2b30', padding: 8, boxSizing: 'border-box' }}><MiniPlayer w={184} h={134} frame={frame} seed={2} /></div>;
  if (kind === 2) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 210, height: 132, borderRadius: '12px 12px 0 0', background: '#2a2b30', padding: 7, boxSizing: 'border-box' }}><MiniPlayer w={196} h={118} frame={frame} seed={3} /></div>
        <div style={{ width: 248, height: 14, borderRadius: '0 0 12px 12px', background: '#3a3b40' }} />
      </div>
    );
  }
  if (kind === 3) {
    return (
      <div style={{ width: 214, height: 150, borderRadius: 14, background: '#2a2b30', overflow: 'hidden' }}>
        <div style={{ height: 22, display: 'flex', alignItems: 'center', gap: 5, padding: '0 9px' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}</div>
        <div style={{ padding: '0 7px 7px' }}><MiniPlayer w={200} h={121} frame={frame} seed={4} /></div>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: 120, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', left: 30, top: 0, width: 60, height: 190, borderRadius: 20, background: 'linear-gradient(180deg, #3a3b42 0%, #24252a 100%)' }} />
      <div style={{ position: 'relative', width: 110, height: 124, borderRadius: 32, background: '#1b1c20', padding: 8, boxSizing: 'border-box' }}><MiniPlayer w={94} h={108} frame={frame} seed={5} /></div>
    </div>
  );
};

// U12 · Dispositivos (ayuda de Spotify, 15/10/2026): móvil, tablet, ordenador (app de escritorio), el reproductor web y Apple Watch.
export const U12Dispositivos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U12', w, n);
  const items = [
    { f: at('movil'), title: 'Móvil', icon: <PhoneIcon size={30} c={SP_DEEP} /> },
    { f: at('tablet'), title: 'Tablet', icon: <TabletIcon size={30} c={SP_DEEP} /> },
    { f: at('ordenador'), title: 'Ordenador', icon: <LaptopIcon size={30} c={SP_DEEP} /> },
    { f: at('web'), title: 'Web', icon: <GlobeIcon size={30} c={SP_DEEP} /> },
    { f: at('apple'), title: 'Apple Watch', icon: <WatchIcon size={30} c={SP_DEEP} /> },
  ];
  const CW = 316;
  const GAP = 26;
  return (
    <SpoStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskTitle text="¿Dónde se escuchan?" hi="escuchan?" at={2} size={88} align="center" />
        <div style={{ display: 'flex', gap: GAP, marginTop: 60, perspective: 2200 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 6, fps, config: { damping: 14, stiffness: 150 } });
            const next = i < items.length - 1 ? items[i + 1].f : it.f + 400;
            const act = interpolate(frame, [it.f - 2, it.f + 8, next - 6, next], [0, 1, 1, i === items.length - 1 ? 1 : 0], clamp);
            return (
              <div key={it.title} style={{ position: 'relative', width: CW, height: 400, borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, overflow: 'hidden',
                boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${SP}, 0 ${(36 + 24 * act).toFixed(1)}px ${(80 + 20 * act).toFixed(1)}px rgba(16,16,16,${(0.1 + 0.05 * act).toFixed(3)})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 34, boxSizing: 'border-box',
                opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 12 * act).toFixed(2)}px) rotateY(${((1 - s) * (i < 2 ? -30 : 30)).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 250, background: `radial-gradient(ellipse at 50% 60%, rgba(30,215,96,${(0.1 + 0.16 * act).toFixed(3)}) 0%, rgba(30,215,96,0) 65%)` }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 36, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DeviceArt kind={i} frame={frame} /></div>
                <Sheen at={it.f + 4} radius={40} tint="rgba(30,215,96,0.22)" />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, letterSpacing: -0.6 }}>
                  <span style={{ width: 46, height: 46, borderRadius: '50%', background: SP_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</span>
                  {it.title}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 2} volume={0.7} />)}
      {items.map((it) => <Sfx key={`w${it.title}`} name="whoosh_soft" at={it.f - 3} volume={0.3} />)}
      <Sfx name="sparkle" at={items[4].f + 6} volume={0.5} />
    </SpoStage>
  );
};

export { BookIcon };

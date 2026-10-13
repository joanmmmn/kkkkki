import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { At, eIO, eOut, Fleuron, follow, GoldText, lerp, paperBg, project, ramp, Rig, seg, Space, sp, T } from './kit';
import { ChapterCard } from './frames';
import { Download, Lock, People, Person } from './glyphs';
import { scene, w } from './timeline';
import { BAR, Cursor, InkRing, Lift, Nav, navState, PageId, Pages, Ripple, Slip, UI, VH, VW, Window } from './web';

// ---------------------------------------------------------------------------------------------------------------
// Plano F (S08–S10): capítulo II, cómo se usa, paso a paso, en la web real de LibriVox.
// Paso 1: entrar en librivox.org → «Browse the catalog» → «Language» → «Spanish».
// Paso 2: buscar («leyendas») → «Solo» / «Collaborative».
// Paso 3: la ficha de las Leyendas de Bécquer → lector y duración → «Play» → MP3, ZIP y M4B → sin restricciones.
// Entre pasos, la cámara se aparta y aparece el número del paso, en oro; luego vuelve a entrar en la página.
// ---------------------------------------------------------------------------------------------------------------
const K = 1.35; // tamaño de la ventana en el mundo (px por píxel CSS)
const WH = VH + BAR;
// Punto de la ventana (u: x CSS; vv: y CSS bajo la barra) en el mundo
const WX = (u: number) => (u - VW / 2) * K;
const WY = (vv: number) => (BAR + vv - WH / 2) * K;

// Número de paso (en el mundo, a la izquierda de la ventana)
const Step: React.FC<{ n: string; title: string; at: number; out: number }> = ({ n, title, at, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sp(frame, at - 4, fps, 90, 20);
  const b = ramp(frame, at + 6, at + 26, eOut);
  const g = ramp(frame, out, out + 22, eIO);
  const o = Math.min(a, 1) * (1 - g);
  if (o <= 0.01) return null;
  const sweep = ramp(frame, at, at + 60, eIO);
  return (
    <At x={-1450} y={-40 - g * 40} z={60 + (1 - a) * -200} w={760} h={600} ry={8} o={o}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transformStyle: 'preserve-3d' }}>
        <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.creamSoft, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>Paso</div>
        <div style={{ transform: `scale(${0.92 + 0.08 * a})`, transformStyle: 'preserve-3d', marginTop: -6 }}><GoldText text={n} size={300} on={1} sweep={sweep} /></div>
        <div style={{ marginTop: 6, fontFamily: T.serif, fontSize: 64, lineHeight: 1.08, color: T.cream, textAlign: 'center', opacity: b, transform: `translateY(${(1 - b) * 18}px)`, whiteSpace: 'pre-line' }}>{title}</div>
        <div style={{ marginTop: 22, opacity: b }}><Fleuron at={at + 14} w={300} color={T.gold} /></div>
      </div>
    </At>
  );
};

// Etiqueta de archivo (como las de una biblioteca): formato en grande, qué es y un cordel
const TAG_W = 330, TAG_H = 196;
const FileTag: React.FC<{ fmt: string; line: string; sub: string }> = ({ fmt, line, sub }) => (
  <div style={{ position: 'relative', width: TAG_W, height: TAG_H, borderRadius: 10, ...paperBg(T.paper), boxShadow: '0 24px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(120,100,70,0.25)' }}>
    <div style={{ position: 'absolute', left: 22, top: 20, width: 20, height: 20, borderRadius: 10, background: '#2a2018', boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6), 0 0 0 4px rgba(169,140,90,0.35)' }} />
    <div style={{ position: 'absolute', right: 22, top: 18, color: T.teal }}><Download size={34} c={T.teal} w={2.2} /></div>
    <div style={{ position: 'absolute', left: 26, top: 46, fontFamily: T.serif, fontWeight: 500, fontSize: 84, lineHeight: 1, color: T.teal, letterSpacing: -1 }}>{fmt}</div>
    <div style={{ position: 'absolute', left: 28, right: 18, top: 134, fontFamily: T.serif, fontSize: 26, lineHeight: 1.05, color: T.ink, whiteSpace: 'nowrap' }}>{line}</div>
    <div style={{ position: 'absolute', left: 28, right: 18, top: 163, fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, color: T.inkSoft, whiteSpace: 'nowrap' }}>{sub}</div>
  </div>
);

export const Web: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o9 = scene('S08').dur;
  const o10 = o9 + scene('S09').dur;
  const w8 = (word: string, n = 0) => w('S08', 'K08', word, n);
  const w9 = (word: string, n = 0) => o9 + w('S09', 'K09', word, n);
  const w10 = (word: string, n = 0) => o10 + w('S10', 'K10', word, n);
  // Paso 1
  const fP1 = w8('Paso'), fLib = w8('librivox'), fOrg = w8('org'), fIng = w8('inglés'), fSenc = w8('sencilla');
  const fBrowse = w8('Browse'), fLang = w8('Language'), fSpan = w8('Spanish'), fAhi = w8('ahí');
  // Paso 2
  const fP2 = w9('Paso'), fEscribe = w9('escribe'), fBuscador = w9('buscador'), fDebajo = w9('Debajo'), fSolo = w9('Solo'), fCollab = w9('Collaborative');
  // Paso 3
  const fP3 = w10('Paso'), fAbre = w10('abre'), fFicha = w10('ficha'), fCada = w10('Cada'), fLector = w10('lector'), fDuracion = w10('duración');
  const fPlay = w10('Play'), fNaveg = w10('navegador'), fPara = w10('Para'), fTitulo = w10('título'), fMP3 = w10('MP3');
  const fWhole = w10('Whole'), fZIP = w10('ZIP'), fM4B = w10('M4B'), fRecuerda = w10('recuerda'), fSin = w10('Sin'), fTuyos = w10('tuyos');

  // ---- Escritura: dirección y búsqueda
  const URL = 'librivox.org';
  const urlStart = fLib + 1, urlStep = Math.max(3, Math.floor((fOrg + 8 - urlStart) / URL.length));
  const urlN = Math.max(0, Math.min(URL.length, Math.floor((frame - urlStart) / urlStep) + 1));
  const fGo = urlStart + URL.length * urlStep + 8; // Intro
  const Q = 'leyendas';
  const qStart = fEscribe + 8, qStep = 6;
  const qN = Math.max(0, Math.min(Q.length, Math.floor((frame - qStart) / qStep) + 1));
  const fEnter = Math.max(qStart + Q.length * qStep + 10, fBuscador + 8);

  // ---- Navegación
  const fClickLang = fLang + 10, fClickSpan = fSpan + 8, fClickTitle = fFicha + 8;
  const navs: Nav[] = [
    { at: 0, page: 'blank', url: '' },
    { at: fGo, page: 'home', url: 'librivox.org' },
    { at: fClickLang + 6, page: 'lang', url: 'librivox.org/search?search_category=language' },
    { at: fClickSpan + 6, page: 'es', url: 'librivox.org/search?primary_key=5&search_category=language' },
    { at: fEnter, page: 'sl', url: 'librivox.org/search?q=leyendas' },
    { at: fClickTitle + 6, page: 'book', url: 'librivox.org/leyendas-by-gustavo-adolfo-becquer/' },
  ];
  const nav = navState(frame, navs);
  // Desplazamiento de cada página
  const fZipScroll = fWhole - 46, fM4BScroll = fM4B - 34;
  const scroll = (page: PageId, f: number) => {
    switch (page) {
      case 'home': return seg(f, [[fSenc + 4, 0], [fBrowse - 8, 494]]);
      case 'lang': return seg(f, [[fClickLang + 14, 0], [fSpan - 10, 306]]);
      case 'es': return seg(f, [[fAhi + 6, 0], [o9 - 4, 1060], [fP2 + 30, 1060], [fP2 + 92, 0]], eIO);
      case 'sl': return seg(f, [[fEnter + 24, 0], [fSolo - 14, 565], [fCollab - 34, 565], [fCollab - 6, 271]]);
      case 'book': return seg(f, [[fCada - 8, 0], [fCada + 52, 990], [fZipScroll, 990], [fZipScroll + 44, 202], [fM4BScroll, 202], [fM4BScroll + 34, 686]]);
      default: return 0;
    }
  };
  const sc = scroll(nav.cur.page, frame);
  const vy = (y: number) => BAR + y - sc; // de coordenadas de página a la ventana

  // ---- Cámara
  const P = { x: -600, y: -20, z: -800, rx: 2, ry: 14 };
  const cam = follow(frame, [
    { f: 0, x: -780, y: -40, z: -1000, rx: 4, ry: 20 },
    { f: fP1 + 30, ...P },
    { f: urlStart - 6, x: -420, y: -276, z: 600, rx: 3, ry: 6 },
    { f: fGo + 4, x: -400, y: -270, z: 610, rx: 3, ry: 5 },
    { f: fGo + 52, x: 0, y: -10, z: -190, rx: 1, ry: -2 },
    { f: fSenc, x: 0, y: -20, z: -120, rx: 1, ry: 0 },
    { f: fBrowse + 6, x: 0, y: 0, z: 260, rx: 4, ry: -2 },
    { f: fLang + 4, x: 190, y: 0, z: 420, rx: 3, ry: -7 },
    { f: fClickLang + 34, x: 150, y: 0, z: 330, rx: 3, ry: -4 },
    { f: fClickSpan + 40, x: 0, y: 20, z: -150, rx: 4, ry: -4 },
    { f: o9 - 2, x: 40, y: 40, z: -40, rx: 8, ry: -8 },
    { f: fP2 + 26, ...P },
    { f: fEscribe - 30, ...P },
    { f: fEscribe + 6, x: 182, y: -159, z: 560, rx: 3, ry: -7 },
    { f: fEnter + 30, x: 40, y: 0, z: -120, rx: 2, ry: -2 },
    { f: fSolo - 10, x: 150, y: 60, z: 330, rx: 4, ry: -5 },
    { f: fCollab - 4, x: 150, y: 0, z: 340, rx: 3, ry: -4 },
    { f: fP3 + 22, ...P },
    { f: fP3 + 40, ...P },
    { f: fFicha - 2, x: 0, y: 0, z: 380, rx: 3, ry: 2 },
    { f: fClickTitle + 40, x: 0, y: 0, z: -150, rx: 2, ry: 0 },
    { f: fCada + 56, x: 150, y: 0, z: 330, rx: 4, ry: -4 },
    { f: fPlay - 6, x: -108, y: 0, z: 400, rx: 3, ry: 4 },
    { f: fTitulo - 6, x: -40, y: 0, z: 400, rx: 3, ry: 2 },
    { f: fZipScroll + 44, x: -250, y: 0, z: 420, rx: 3, ry: 9 },
    { f: fM4BScroll + 34, x: -260, y: 0, z: 420, rx: 4, ry: 9 },
    { f: fSin - 10, x: -240, y: 0, z: 380, rx: 4, ry: 7 },
    { f: fSin + 40, x: 0, y: 0, z: -1150, rx: 2, ry: -6 },
    { f: dur, x: 30, y: 0, z: -1250, rx: 2, ry: -7 },
  ], 4.4);
  const camObj = { x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry };

  // ---- Ventana: aparece detrás de la portadilla
  const win = sp(frame, 30, fps, 70, 20);
  const dim = ramp(frame, fSin - 6, fSin + 30, eIO);

  // ---- Cursor (coordenadas de la ventana)
  const cur = follow(frame, [
    { f: 0, x: 1180, y: 700 },
    { f: fBrowse + 20, x: 1180, y: 700 },
    { f: fLang - 2, x: 985, y: BAR + 326 },
    { f: fClickLang + 14, x: 985, y: BAR + 326 },
    { f: fSpan - 6, x: 500, y: BAR + 320 },
    { f: fClickSpan + 30, x: 1150, y: BAR + 420 },
    { f: fEscribe - 16, x: 1000, y: BAR + 190 },
    { f: fEscribe - 2, x: 900, y: BAR + 109 },
    { f: fEnter + 20, x: 1150, y: BAR + 300 },
    { f: fP3 + 50, x: 760, y: BAR + 440 },
    { f: fFicha - 4, x: 612, y: BAR + 311 },
    { f: fClickTitle + 30, x: 700, y: BAR + 440 },
    { f: fPlay - 8, x: 457, y: BAR + 327 },
    { f: fPara + 10, x: 520, y: BAR + 340 },
    { f: fTitulo - 4, x: 540, y: BAR + 329 },
    { f: fZipScroll + 40, x: 325, y: BAR + 337 },
    { f: fM4BScroll + 30, x: 226, y: BAR + 338 },
  ], 5.5);
  const curO = Math.min(
    ramp(frame, fBrowse + 18, fBrowse + 30) * (1 - ramp(frame, fClickSpan + 20, fClickSpan + 34))
      + ramp(frame, fEscribe - 20, fEscribe - 10) * (1 - ramp(frame, fEnter + 8, fEnter + 20))
      + ramp(frame, fP3 + 46, fP3 + 56) * (1 - ramp(frame, fClickTitle + 8, fClickTitle + 20))
      + ramp(frame, fPlay - 30, fPlay - 18) * (1 - ramp(frame, fSin - 20, fSin - 6)),
    1,
  );
  const clicks = [fClickLang, fClickSpan, fEscribe - 1, fClickTitle, fPlay + 2, w10('Whole') + 18, fM4B + 10];
  const press = Math.max(0, ...clicks.map((c) => 1 - Math.abs(frame - c) / 4));

  // ---- Elementos que se levantan
  const L = (a: number, b: number, k = 140) => Math.min(sp(frame, a, fps, k, 22), 1) * (1 - ramp(frame, b, b + 16, eIO));
  const liftTabs = L(fBrowse - 4, fClickLang + 4);
  const liftLang = L(fLang - 10, fClickLang + 4);
  const liftSpan = L(fSpan - 14, fClickSpan + 4);
  const liftSearch = L(fEscribe - 12, fEnter - 2);
  const liftSolo = L(fSolo - 10, fCollab - 14);
  const liftLey = L(fCollab - 10, fClickTitle + 4);
  const liftRow = L(fCada + 30, fZipScroll - 4);
  const liftZip = L(fWhole - 8, fM4BScroll - 4);
  const liftM4B = L(fM4B - 8, fSin - 10);
  const playing = ramp(frame, fPlay + 4, fPlay + 16, eOut) * (1 - ramp(frame, fZipScroll - 6, fZipScroll + 6));

  // Lista en español: las filas se levantan un poco al pasar por el centro (ola)
  const ES_ROWS = [307.8, 401.8, 495.8, 589.8, 683.8, 777.8, 874.8, 971.8, 1068.8, 1165.8, 1262.8, 1359.8, 1453.8, 1547.8, 1641.8, 1735.8];
  const wave = nav.cur.page === 'es' && frame > fAhi && frame < fP2 + 30;

  // ---- Etiquetas de archivo (en pantalla): salen del enlace y se quedan a la derecha; al final, juntas en el centro
  const src = (u: number, y: number, z: number) => project(camObj, WX(u), WY(y - sc), z * 1.0);
  const tags = [
    { fmt: 'MP3', line: 'El rayo de luna', sub: 'cada capítulo, un archivo', at: fMP3 - 26, from: [549, 1318, 60], slot: [1700, 290] },
    { fmt: 'ZIP', line: 'Leyendas · 290 MB', sub: 'el libro entero', at: fZIP - 28, from: [325, 539, 70], slot: [1700, 520] },
    { fmt: 'M4B', line: 'audiolibro', sub: 'con capítulos y marcador', at: fM4B + 30, from: [227, 1023, 70], slot: [1700, 750] },
  ];
  const fan = ramp(frame, fSin - 4, fSin + 34, eIO);
  const FAN = [[700, 640, -7], [960, 610, 0], [1220, 640, 7]];

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={camObj}>
          <Step n="1" title={'Entra en\nlibrivox.org'} at={fP1 - 2} out={urlStart - 10} />
          <Step n="2" title={'Busca un título\no un autor'} at={fP2 - 2} out={fEscribe - 22} />
          <Step n="3" title={'Escúchalo\no descárgalo'} at={fP3 - 2} out={fP3 + 44} />
          {/* la ventana del navegador */}
          <At x={0} y={(1 - win) * 120} z={(1 - win) * -500} w={VW} h={WH} s={K} o={Math.min(1, win * 1.4)}>
            <Window url={nav.cur.url} typed={nav.cur.page === 'blank' ? URL.slice(0, urlN) : null} caret={nav.cur.page === 'blank' && frame >= urlStart - 10} load={nav.load} loading={nav.loading}
              glare={ramp(frame, fGo + 4, fGo + 60, eIO)}>
              <Pages navs={navs} scroll={scroll} />
            </Window>
            {/* --- Paso 1 --- */}
            {nav.cur.page === 'home' && (
              <>
                <Slip text="audiolibros gratis de dominio público" at={fIng - 2} x={640} y={vy(280)} z={30} size={26} out={fBrowse - 30} />
                <Slip text="lo leen voluntarios" at={fIng + 22} x={415} y={vy(450)} z={30} size={24} out={fBrowse - 30} />
                <Slip text="escuchar" at={fIng + 30} x={829} y={vy(450)} z={30} size={26} out={fBrowse - 30} />
                <Lift id="home" box={[155, 784, 970, 72]} scroll={sc} lift={liftTabs} z={45} />
                <Slip text="explorar el catálogo" at={fBrowse + 4} x={352} y={vy(797)} z={70} size={22} anchor="left" out={fClickLang + 2} />
                <Lift id="home" box={[880, 809.7, 240, 42.4]} scroll={sc} lift={liftLang} z={95} pad={2} />
                <Slip text="idioma" at={fLang + 2} x={1000} y={vy(896)} z={110} size={24} out={fClickLang + 6} />
              </>
            )}
            {nav.cur.page === 'lang' && (
              <>
                <Lift id="lang" box={[430, 605.4, 690, 75]} scroll={sc} lift={liftSpan} z={60} />
                <InkRing box={[450, vy(613), 62, 22]} at={fSpan} z={64 * liftSpan} out={fClickSpan + 4} />
              </>
            )}
            {wave && ES_ROWS.map((y, i) => {
              const c = y + 44 - sc - 330;
              const k = Math.max(0, 1 - Math.abs(c) / 190);
              const e = k * k * (3 - 2 * k) * ramp(frame, fAhi + 4, fAhi + 20) * (1 - ramp(frame, o9 - 20, o9 + 10));
              return <Lift key={i} id="es" box={[430, y, 690, 89]} scroll={sc} lift={e} z={34} glow={0.35} />;
            })}
            {/* --- Paso 2 --- */}
            {(nav.cur.page === 'es' || (nav.cur.page === 'sl' && nav.p < 1)) && liftSearch > 0 && (
              <Lift id="es" box={[835, 91, 250, 35]} scroll={sc} lift={liftSearch} z={70} pad={6}>
                <div style={{ position: 'absolute', left: 8, top: 8, width: 222, height: 31, background: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', paddingLeft: 7, fontFamily: UI, fontSize: 14.5, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {qN === 0 ? <span style={{ color: '#9a9a9a', fontSize: 13.5 }}>Search by Author, Title or Reader</span> : Q.slice(0, qN)}
                  <span style={{ display: 'inline-block', width: 1.2, height: 16, marginLeft: 1, background: '#333', opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />
                </div>
              </Lift>
            )}
            {nav.cur.page === 'es' && <Slip text="título, autor o lector" at={fEscribe + 22} x={818} y={vy(108)} z={90} size={22} anchor="right" out={fEnter - 4} />}
            {nav.cur.page === 'sl' && (
              <>
                <Lift id="sl" box={[430, 939.4, 690, 89]} scroll={sc} lift={liftSolo} z={55} />
                <InkRing box={[641.6, vy(991.4), 22, 12]} at={fSolo - 2} z={58 * liftSolo} padX={9} padY={7} out={fCollab - 16} />
                <Slip text="una sola voz" at={fSolo + 6} x={736} y={vy(997)} z={60 * liftSolo + 6} size={22} anchor="left" out={fCollab - 16}
                  icon={<Person size={24} c={T.teal} w={2} />} />
                <Lift id="sl" box={[430, 563.4, 690, 89]} scroll={sc} lift={liftLey} z={60} />
                <InkRing box={[641.6, vy(615.4), 64.2, 12]} at={fCollab - 2} z={63 * liftLey} padX={9} padY={7} out={fClickTitle} />
                <Slip text="varias voces" at={fCollab + 8} x={778} y={vy(621)} z={66 * liftLey + 6} size={22} anchor="left" out={fClickTitle}
                  icon={<People size={26} c={T.teal} w={2} />} />
              </>
            )}
            {/* --- Paso 3 --- */}
            {nav.cur.page === 'book' && (
              <>
                <Lift id="book" box={[430, 1292, 690, 71]} scroll={sc} lift={liftRow} z={55}>
                  {/* reproduciendo: botón de pausa y una barra con onda */}
                  {playing > 0 && (
                    <div style={{ position: 'absolute', left: 4, top: 4, width: 690, height: 71, opacity: playing }}>
                      <div style={{ position: 'absolute', left: 18, top: 13, width: 17, height: 21, background: '#f4f4ef' }} />
                      <div style={{ position: 'absolute', left: 21, top: 15, width: 4, height: 15, background: '#333' }} />
                      <div style={{ position: 'absolute', left: 28, top: 15, width: 4, height: 15, background: '#333' }} />
                      <div style={{ position: 'absolute', left: 70, right: 200, top: 46, height: 18, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {Array.from({ length: 64 }, (_, k) => {
                          const done = k / 64 < 0.04 + (frame - fPlay) / 2600;
                          const h = 3 + 13 * Math.abs(Math.sin(k * 0.9 + frame / 3.2) * Math.sin(k * 0.37 + 1.3));
                          return <div key={k} style={{ width: 3, height: h, borderRadius: 2, background: done ? T.teal : 'rgba(46,109,125,0.3)' }} />;
                        })}
                      </div>
                    </div>
                  )}
                </Lift>
                <InkRing box={[870, vy(1310), 40, 18]} at={fLector - 4} z={58 * liftRow} padX={12} padY={9} out={fPlay - 10} />
                <Slip text="lector" at={fLector} x={890} y={vy(1270)} z={62 * liftRow + 6} size={24} out={fPlay - 10} />
                <InkRing box={[1033, vy(1310), 58, 18]} at={fDuracion - 4} z={58 * liftRow} padX={10} padY={9} seed={3} out={fPlay - 10} />
                <Slip text="duración" at={fDuracion} x={1062} y={vy(1270)} z={62 * liftRow + 6} size={24} out={fPlay - 10} />
                <Slip text="suena en el navegador" at={fNaveg - 6} x={470} y={vy(1392)} z={62 * liftRow + 6} size={24} anchor="left" out={fTitulo - 8} />
                <InkRing box={[499, vy(1310), 100, 16]} at={fTitulo} z={58 * liftRow} padX={12} padY={9} seed={5} out={fZipScroll - 6} />
                <Lift id="book" box={[155, 518, 215, 40]} scroll={sc} lift={liftZip} z={65} />
                <Lift id="book" box={[155, 1009, 160, 52]} scroll={sc} lift={liftM4B} z={65} />
                <Slip text="recuerda por dónde vas" at={fRecuerda - 4} x={330} y={vy(1035)} z={70 * liftM4B + 6} size={24} anchor="left" out={fSin - 12} />
              </>
            )}
            <Cursor x={cur.x} y={cur.y} o={curO} press={press} />
            {clicks.map((c, i) => <Ripple key={i} x={cur.x} y={cur.y} at={c} />)}
          </At>
        </Rig>
      </Space>
      {/* al final: la ventana se oscurece y quedan los tres archivos */}
      <AbsoluteFill style={{ background: `rgba(8,6,4,${0.72 * dim})`, backdropFilter: dim > 0.01 ? `blur(${5 * dim}px)` : undefined, pointerEvents: 'none' }} />
      {tags.map((t, i) => {
        const p = ramp(frame, t.at, t.at + 34, eIO);
        if (p <= 0) return null;
        const s0 = src(t.from[0], t.from[1], t.from[2]);
        const arc = Math.sin(p * Math.PI) * -90;
        let x = lerp(s0.x, t.slot[0], p), y = lerp(s0.y, t.slot[1], p) + arc;
        let s = lerp(0.22, 0.8, p), r = lerp(-10, -3 + i * 2, p);
        x = lerp(x, FAN[i][0], fan); y = lerp(y, FAN[i][1], fan); s = lerp(s, 1, fan); r = lerp(r, FAN[i][2], fan);
        return (
          <div key={t.fmt} style={{ position: 'absolute', left: x - TAG_W / 2, top: y - TAG_H / 2, transform: `scale(${s}) rotate(${r}deg)`, opacity: Math.min(1, p * 3) }}>
            <FileTag fmt={t.fmt} line={t.line} sub={t.sub} />
          </div>
        );
      })}
      {/* sin restricciones */}
      {(() => {
        const a = sp(frame, fSin - 2, fps, 110, 20);
        const b = ramp(frame, fTuyos - 30, fTuyos - 10, eOut);
        const open = ramp(frame, fSin + 14, fSin + 26, eOut);
        if (a <= 0.01) return null;
        return (
          <AbsoluteFill style={{ alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: 118, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, a), transform: `translateY(${(1 - a) * 30}px)` }}>
              <div style={{ transform: `rotate(${-6 * open}deg)`, filter: `drop-shadow(0 0 ${18 * open}px rgba(255,214,150,0.6))` }}><Lock size={124} c={T.gold} w={1.5} open={open} /></div>
              <div style={{ marginTop: 10, fontFamily: T.serif, fontSize: 92, color: T.cream, lineHeight: 1 }}>Sin restricciones</div>
              <div style={{ marginTop: 16, fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.gold, opacity: b, transform: `translateY(${(1 - b) * 12}px)` }}>los archivos son tuyos</div>
            </div>
          </AbsoluteFill>
        );
      })()}
      <ChapterCard n="II" title="Cómo se usa, paso a paso" />
      {/* sonido */}
      {[fP1, fP2, fP3].map((f, i) => <Sfx key={`s${i}`} name="soft_impact" at={f + 2} volume={0.42} />)}
      {[fP1, fP2, fP3].map((f, i) => <Sfx key={`d${i}`} name="dust_shimmer" at={f + 6} volume={0.35} />)}
      <Sfx name="typing" at={urlStart - 2} volume={0.5} trimAfter={URL.length * urlStep + 4} />
      <Sfx name="typing" at={qStart - 2} volume={0.5} trimAfter={Q.length * qStep + 4} />
      {navs.slice(1).map((n, i) => <Sfx key={`n${i}`} name="paper_slide" at={n.at} volume={0.35} />)}
      {clicks.map((c, i) => <Sfx key={`c${i}`} name="mouse_click" at={c} volume={0.6} />)}
      {[fBrowse - 4, fLang - 10, fSpan - 14, fEscribe - 12, fSolo - 10, fCollab - 10, fCada + 30, fWhole - 8, fM4B - 8].map((f, i) => <Sfx key={`l${i}`} name="paper_lift" at={f} volume={0.3} />)}
      {[fIng, fBrowse + 4, fLang + 2, fSpan, fEscribe + 22, fSolo + 4, fCollab + 6, fLector, fDuracion, fNaveg - 6, fTitulo, fRecuerda].map((f, i) => <Sfx key={`p${i}`} name="pen_scratch" at={f} volume={0.22} />)}
      {tags.map((t, i) => <Sfx key={`t${i}`} name="file_pop" at={t.at + 30} volume={0.5} />)}
      {tags.map((t, i) => <Sfx key={`w${i}`} name="phone_whoosh" at={t.at} volume={0.32} />)}
      <Sfx name="deep_whoosh" at={fSin - 4} volume={0.4} />
      <Sfx name="soft_impact" at={fSin + 14} volume={0.5} />
    </AbsoluteFill>
  );
};

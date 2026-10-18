import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx, STEM } from '../../components/Sfx';
import MAP from '../../../public/eb/map/ccaa.json';
import LV_CLIPS from '../../../public/lv/audio/clips.json';
import { wf } from './timeline';
import {
  color, font, Kicker, markOn, MaskTitle, MpStage, MShot, PagePane, PageKey, PageMark, PlatformScene, PKey, PLAT, PlatTile, SceneProps, shadow, ToneChip, Tone, useSpring, WebPane,
} from './kit';

type P = SceneProps;
type Row = { word: string; nth?: number; tone: Tone; label: string; sub?: string };

// Escena de plataforma «web»: un navegador (o una ilustración) a un lado y la ficha al otro (icono, título y etiquetas).
const WebPlatformScene: React.FC<P & {
  id: string; k: PKey; title: string; hi?: string | string[]; model?: string; rows: Row[]; visual: React.ReactNode; side?: 'left' | 'right'; titleSize?: number; tagSize?: number; headerAt?: number; noHeader?: boolean; extra?: React.ReactNode;
}> = ({ lead, dur, id, k, title, hi, model, rows, visual, side = 'right', titleSize = 100, tagSize = 40, headerAt, noHeader = false, extra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf(id, w, n);
  const rowFrames = rows.map((r) => at(r.word, r.nth ?? 0) - 3);
  const hAt = headerAt ?? 3;
  const hp = spring({ frame: frame - hAt, fps, config: { damping: 15, stiffness: 160 } });
  const textLeft = side === 'right';
  return (
    <MpStage tint={PLAT[k].c}>
      <AbsoluteFill>
        {visual}
        <div style={{ position: 'absolute', top: 0, height: 1080, left: textLeft ? 1180 : 120, width: 680, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!noHeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: hp, transform: `translateY(${(1 - hp) * 24}px)` }}>
              <PlatTile k={k} size={84} style={{ transform: `scale(${0.8 + 0.2 * hp}) rotate(${(1 - hp) * -12}deg)` }} />
              {model && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: color.muted }}>{model}</div>}
            </div>
          )}
          <MaskTitle text={title} hi={hi} at={hAt + 4} size={titleSize} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginTop: 36 }}>
            {rows.map((r, i) => <ToneChip key={r.label} at={rowFrames[i]} dimAt={rowFrames[i + 1]} tone={r.tone} label={r.label} sub={r.sub} size={tagSize} />)}
          </div>
          {extra}
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={hAt + 1} volume={0.5} />
      {rowFrames.map((f, i) => <Sfx key={i} name={rows[i].tone === 'warn' ? 'tick_soft' : 'ui_pop'} at={f + 1} volume={0.65} />)}
    </MpStage>
  );
};

// El panel del navegador a la izquierda, centrado en vertical, con una entrada suave.
const PaneSlot: React.FC<{ children: React.ReactNode; w: number; left?: number }> = ({ children, w, left = 90 }) => {
  const frame = useCurrentFrame();
  const s = useSpring(2, 17, 120);
  const h = (w * 9) / 16 + w * 0.03;
  const bob = Math.sin(frame / 60) * 3;
  return (
    <div style={{ position: 'absolute', left, top: (1080 - h) / 2 + bob, opacity: Math.min(1, s * 1.3),
      transform: `perspective(2400px) rotateY(${((1 - s) * 18 + 4).toFixed(2)}deg) rotateX(1.5deg) translateX(${(1 - s) * -80}px) scale(${0.94 + 0.06 * s})`, transformOrigin: 'left center' }}>
      {children}
    </div>
  );
};

// Z11 · Spotify: 12 h incluidas en Premium desde el 7/10, que no se acumulan y solo son del titular; Audiolibros+ añade 15 h.
// La app real (grabación de la reseña de Spotify, cuenta Premium de Joan; tomas sin datos personales): la sección Audiolibros,
// la ficha de Reina Roja («Incluido con Premium») y «Tiempo de escucha de audiolibros» (12 h, Audiolibros+ y recargas).
export const Z11Spotify: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z11', w, n);
  const fNov = at('novedad');
  const fDoce = at('doce');
  const fAcum = at('acumulan');
  const fDuo = at('duo');
  const fEst = at('estudiantes');
  const fPlus = at('audiolibros+');
  const s0: MShot = { dir: 'spo', rec: '01_hub', at: 0, start: 0.6, hold: 3.4 };
  const s1: MShot = { dir: 'spo', rec: '03_reina_ficha', at: fDoce - 8, start: 1.0, hold: 17.5 };
  s1.marks = [markOn(s1, fDoce, fAcum - 6, 14, 504, 322, 40, 12)];
  const s2: MShot = { dir: 'spo', rec: '10_horas', at: fAcum - 6, start: 1.0, hold: 14.0 };
  s2.marks = [markOn(s2, fAcum, fPlus - 8, 20, 312, 624, 150, 18)];
  const s3: MShot = { dir: 'spo', rec: '10_horas', at: fPlus - 6, start: 16.0, hold: 26.0 };
  s3.marks = [markOn(s3, fPlus, p.dur + 20, 22, 438, 620, 324, 20)];
  return (
    <PlatformScene {...p} id="Z11" k="spotify" model="Novedad · desde el 7/10" title="Spotify" side="left" shots={[s0, s1, s2, s3]} titleSize={110} headerAt={p.lead - 4}
      rows={[
        { word: 'doce', tone: 'best', label: '12 h al mes en Premium', sub: 'Sin pagar nada más' },
        { word: 'acumulan', tone: 'warn', label: 'No se acumulan', sub: 'Duo y Familiar: solo el titular · Estudiantes: no' },
        { word: 'audiolibros+', tone: 'price', label: 'Audiolibros+: +15 h', sub: '8,99 € al mes' },
      ]}
      overlay={<><Sfx name="whoosh_soft" at={fNov} volume={0.3} /><Sfx name="tick_soft" at={fDuo} volume={0.2} /><Sfx name="tick_soft" at={fEst} volume={0.2} /></>}
    />
  );
};

// Z14 · ElevenReader: tu PDF (El rayo de luna) se convierte en audio con una voz de IA; 10 h gratis, Ultra sin límite y
// la importación que salta cabeceras y pies de página.
export const Z14ElevenReader: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('Z14', w, n);
  const fPdf = at('pdf');
  const fSubes = at('subes');
  const fLee = at('lee');
  const fGratis = at('gratis');
  const fUltra = at('ultra');
  const fImp = at('importar');
  const fCab = at('cabeceras');
  const sDoc = useSpring(fPdf - 10, 16, 140);
  const fly = interpolate(frame, [fSubes - 2, fSubes + 22], [0, 1], { ...clamp, easing: easeInOut });
  const play = interpolate(frame, [fLee, fLee + 30], [0, 1], { ...clamp, easing: easeOut });
  const strike = interpolate(frame, [fCab - 2, fCab + 14], [0, 1], { ...clamp, easing: easeOut });
  const pageW = 470;
  const pageH = (pageW * 1821) / 1284;
  const bars = 46;
  return (
    <WebPlatformScene {...p} id="Z14" k="elevenreader" model="Tus propios libros" title="ElevenReader" titleSize={100} headerAt={p.lead + 10}
      visual={
        <div style={{ position: 'absolute', left: 150, top: 0, width: 900, height: 1080 }}>
          {/* La página del PDF */}
          <div style={{ position: 'absolute', left: 60, top: (1080 - pageH) / 2 - 30 * fly, width: pageW, height: pageH, borderRadius: 10, overflow: 'hidden', background: '#fff',
            boxShadow: '0 50px 110px rgba(16,16,16,0.22), 0 0 0 1px rgba(16,16,16,0.06)', opacity: Math.min(1, sDoc * 1.3),
            transform: `perspective(1800px) rotateY(${(1 - sDoc) * 30 + 8 - 8 * fly}deg) rotateZ(${(1 - sDoc) * -6}deg) translateX(${fly * -20}px) scale(${0.9 + 0.1 * sDoc})` }}>
            <Img src={staticFile('er/img/rayo-01.png')} style={{ width: pageW, height: pageH, display: 'block' }} />
            {/* Cabecera y pie tachados (importación inteligente de Ultra) */}
            {[{ y: 0.012, h: 0.04 }, { y: 0.955, h: 0.035 }].map((r, i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${r.y * 100}%`, height: `${r.h * 100}%`, background: `rgba(229,72,77,${0.16 * strike})` }}>
                <div style={{ position: 'absolute', left: '6%', top: '50%', height: 4, width: `${88 * strike}%`, background: color.red, borderRadius: 2 }} />
              </div>
            ))}
            <div style={{ position: 'absolute', left: 14, top: 14, padding: '6px 14px', borderRadius: 8, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 18, opacity: sDoc }}>PDF</div>
          </div>
          {/* El reproductor de ElevenReader: la voz lee el texto */}
          <div style={{ position: 'absolute', left: 430, top: 300 + (1 - fly) * 60, width: 420, padding: '28px 30px', borderRadius: 30, background: '#111', color: '#fff', boxShadow: '0 40px 90px rgba(16,16,16,0.35)',
            opacity: fly, transform: `scale(${0.85 + 0.15 * fly})` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26 }}>El rayo de luna</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Voz con IA · ElevenReader</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 90, marginTop: 18 }}>
              {Array.from({ length: bars }, (_, i) => {
                const hgt = 14 + 62 * Math.abs(Math.sin(i * 1.7 + frame / 5) * Math.cos(i * 0.6 + frame / 9)) * play;
                const on = i / bars < play * ((frame - fLee) / 220 + 0.15);
                return <div key={i} style={{ flex: 1, height: Math.max(6, hgt), borderRadius: 3, background: on ? '#FFFFFF' : 'rgba(255,255,255,0.28)' }} />;
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
              <span style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={22} height={22} viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="#111" /></svg>
              </span>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22 }}>{frame > fUltra ? '4,0x' : '1,0x'}</span>
            </div>
          </div>
        </div>
      }
      rows={[
        { word: 'subes', tone: 'best', label: 'Tus PDF y ebooks, en audio', sub: 'Con voces de inteligencia artificial' },
        { word: 'gratis', tone: 'price', label: 'Gratis: 10 h al mes' },
        { word: 'ultra', tone: 'price', label: 'Ultra: tus archivos sin límite', sub: 'Y 20 h al mes de su catálogo' },
        { word: 'importar', tone: 'trick', label: 'Salta cabeceras y pies', sub: 'Al importar un PDF, con Ultra' },
      ]}
      extra={<><Sfx name="page_turn" at={fPdf - 6} volume={0.6} /><Sfx name="whoosh_soft" at={fSubes + 8} volume={0.7} /><Sfx name="shimmer" at={fLee} volume={0.5} /><Sfx name="pencil_strike" at={fCab} volume={0.6} /><Sfx name="pencil_strike" at={fCab + 6} volume={0.5} /><Sfx name="tick_soft" at={fImp} volume={0.2} /></>}
    />
  );
};

// ——— Mapa de España por comunidades (es-atlas, IGN; el mismo de la guía de eBiblio) ———
type Region = { id: string; name: string; d: string; c: [number, number] };
const REGIONS = (MAP as unknown as { regions: Region[] }).regions;
const CANARY = (MAP as unknown as { canaryBorder: string }).canaryBorder;
const CENTER: Record<string, [number, number]> = { Canarias: [300, 1040], 'Illes Balears': [1440, 470], Ceuta: [779, 897], Melilla: [994, 960], Galicia: [592, 170], Andalucía: [850, 735] };
const centerOf = (r: Region): [number, number] => CENTER[r.name] ?? r.c;
const OWN: Record<string, string> = { 'Cataluña': 'Biblio Digital', 'País Vasco': 'eLiburutegia' };

// Z15 · eBiblio: con el carné de la biblioteca te llevas audiolibros actuales; 21 días o a la cola; Cataluña y el País Vasco, con su servicio.
export const Z15eBiblio: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('Z15', w, n);
  const fCarne = at('carne');
  const fComunidad = at('comunidad');
  const fActuales = at('actuales');
  const fFunciona = at('ejemplar');
  const fLibre = at('libre');
  const fCola = at('cola');
  const fCat = at('cataluna');
  const sCard = useSpring(fCarne - 8, 14, 150);
  const sLogo = useSpring(p.lead + 2, 15, 140);
  const logoOut = interpolate(frame, [fComunidad - 10, fComunidad + 8], [0, 1], { ...clamp, easing: easeInOut });
  const W = 860;
  const k = W / 1600;
  // Las comunidades se encienden en cascada con «comunidad»; Cataluña y el País Vasco se rayan con su nombre.
  const reveal = (i: number) => spring({ frame: frame - fComunidad - i * 2, fps, config: { damping: 14, stiffness: 160 } });
  const own = interpolate(frame, [fCat - 4, fCat + 14], [0, 1], { ...clamp, easing: easeOut });
  // La estantería: 3 ejemplares, se los llevan (21 días) y el cuarto lector hace cola.
  const lend = (i: number) => spring({ frame: frame - fLibre - i * 6, fps, config: { damping: 15, stiffness: 160 } });
  const queue = spring({ frame: frame - fCola + 2, fps, config: { damping: 12, stiffness: 180 } });
  const shelfIn = useSpring(fFunciona - 6, 16, 150);
  // Tres tiempos: el mapa (comunidades), la estantería (cómo funciona) y otra vez el mapa con Cataluña y el País Vasco.
  const backMap = interpolate(frame, [fCat - 14, fCat + 4], [0, 1], { ...clamp, easing: easeInOut });
  const mapVis = Math.max(1 - shelfIn, backMap);
  const shelfVis = shelfIn * (1 - backMap);
  return (
    <WebPlatformScene {...p} id="Z15" k="ebiblio" model="Gratis con el carné" title="eBiblio" titleSize={110} headerAt={p.lead - 4}
      visual={
        <div style={{ position: 'absolute', left: 110, top: 70, width: W, height: 940 }}>
          <svg width={W} height={1200 * k} viewBox="0 0 1600 1200" style={{ position: 'absolute', left: 0, top: 30, overflow: 'visible', opacity: mapVis, transform: `scale(${0.92 + 0.08 * mapVis})`, transformOrigin: '50% 50%' }}>
            <defs>
              <pattern id="mp-hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#E8E2DA" /><rect width="7" height="16" fill="#CFC6BA" /></pattern>
            </defs>
            {REGIONS.map((r, i) => {
              const s = reveal(i);
              if (frame < fComunidad - 2) return null;
              const [cx, cy] = centerOf(r);
              const isOwn = Boolean(OWN[r.name]);
              const fill = isOwn && own > 0 ? '#E8E2DA' : PLAT.ebiblio.c;
              return (
                <g key={r.id} transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * Math.min(1.06, s)}) translate(${-cx} ${-cy})`} opacity={Math.min(1, s * 2)}>
                  <path d={r.d} fill={fill} stroke="#FFFDF8" strokeWidth={3} strokeLinejoin="round" />
                  {isOwn && own > 0 && <path d={r.d} fill="url(#mp-hatch)" opacity={own} stroke="#FFFDF8" strokeWidth={3} />}
                </g>
              );
            })}
            <path d={CANARY} fill="none" stroke="#9A9BA6" strokeWidth={2.5} strokeDasharray="10 8" opacity={frame > fComunidad ? 0.6 : 0} />
            {Object.entries(OWN).map(([name, svc]) => {
              const r = REGIONS.find((x) => x.name === name)!;
              const [cx, cy] = centerOf(r);
              return (
                <g key={name} opacity={own} transform={`translate(${cx + (name === 'Cataluña' ? 40 : -10)} ${cy - (name === 'Cataluña' ? 120 : 110)})`}>
                  <rect x={-210} y={-52} width={420} height={88} rx={44} fill={color.ink} />
                  <text x={0} y={8} textAnchor="middle" fontFamily="Ubuntu" fontWeight={700} fontSize={46} fill="#fff">{svc}</text>
                </g>
              );
            })}
          </svg>
          {/* Arranque: el logotipo de eBiblio en grande, hasta que aparece el mapa */}
          {frame < fComunidad + 12 && (
            <div style={{ position: 'absolute', left: 130, top: 300, width: 600, height: 340, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, sLogo * 1.3) * (1 - logoOut), transform: `translateY(${(1 - sLogo) * 60 - logoOut * 40}px) scale(${(0.9 + 0.1 * sLogo) * (1 - 0.08 * logoOut)})` }}>
              <Img src={staticFile('eb/img/ebiblio_logo.png')} style={{ width: 440, height: (440 * 240) / 492, display: 'block' }} />
            </div>
          )}
          {/* El carné */}
          <div style={{ position: 'absolute', left: 470, top: 650, width: 360, height: 220, borderRadius: 24, background: `linear-gradient(140deg, ${PLAT.ebiblio.c} 0%, #C85A3C 100%)`, boxShadow: '0 30px 70px rgba(16,16,16,0.25)',
            opacity: Math.min(1, sCard * 1.3) * (1 - shelfIn), transform: `rotate(${-8 + 8 * sCard}deg) translateY(${(1 - sCard) * 120}px)`, transformOrigin: 'left top', padding: 26, boxSizing: 'border-box', color: '#fff' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>Carné de biblioteca</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 22, opacity: 0.85, marginTop: 6 }}>Biblioteca pública · gratis</div>
            <div style={{ position: 'absolute', left: 26, bottom: 26, display: 'flex', gap: 3 }}>
              {Array.from({ length: 26 }, (_, i) => <span key={i} style={{ width: i % 3 ? 3 : 6, height: 44, background: 'rgba(255,255,255,0.9)' }} />)}
            </div>
          </div>
          {/* La estantería: 3 ejemplares, 21 días y la cola */}
          {frame >= fFunciona - 8 && shelfVis > 0.001 && (
            <div style={{ position: 'absolute', left: 30, top: 300, width: 820, opacity: shelfVis, transform: `translateY(${(1 - shelfIn) * 60}px) scale(${0.96 + 0.04 * shelfVis})` }}>
              <div style={{ display: 'flex', gap: 26, alignItems: 'flex-end', height: 230, padding: '0 30px', borderBottom: `14px solid #C9B8A5` }}>
                {[0, 1, 2].map((i) => {
                  const l = lend(i);
                  return (
                    <div key={i} style={{ width: 120, height: 180, borderRadius: 10, background: i === 1 ? '#C85A3C' : PLAT.ebiblio.c, boxShadow: '0 12px 30px rgba(16,16,16,0.18)', transform: `translate(${l * (360 - i * 40)}px, ${-l * 60}px) rotate(${l * 10}deg)`, opacity: 1 - 0.2 * l,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14, boxSizing: 'border-box' }}>
                      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 18, color: '#fff' }}>Ejemplar {i + 1}</span>
                    </div>
                  );
                })}
                <div style={{ marginLeft: 'auto', padding: '14px 24px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34, alignSelf: 'center',
                  opacity: interpolate(frame, [fLibre + 10, fLibre + 24], [0, 1], clamp) }}>21 días</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, opacity: frame < fCola - 2 ? 0 : queue, transform: `translateX(${(1 - queue) * -40}px)` }}>
                <span style={{ width: 70, height: 70, borderRadius: 18, background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32 }}>4</span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>Si no queda ninguno, a la cola</span>
              </div>
            </div>
          )}
        </div>
      }
      rows={[
        { word: 'carne', tone: 'best', label: 'Gratis con el carné', sub: 'De la biblioteca pública de tu comunidad' },
        { word: 'actuales', tone: 'best', label: 'Novedades y superventas', sub: 'Con los mismos narradores · sin anuncios' },
        { word: 'libre', tone: 'info', label: '21 días por préstamo', sub: 'O a la cola, si están todos prestados' },
        { word: 'cataluna', tone: 'info', label: 'Cataluña y País Vasco', sub: 'Biblio Digital y eLiburutegia' },
      ]}
      extra={<>
        <Sfx name="whoosh_soft" at={fCarne - 6} volume={0.6} />
        {REGIONS.map((_, i) => (i % 3 === 0 ? <Sfx key={i} name="tick_soft" at={fComunidad + i * 2 + 4} volume={0.25} /> : null))}
        <Sfx name="sparkle" at={fActuales} volume={0.4} />
        {[0, 1, 2].map((i) => <Sfx key={`l${i}`} name="swipe" at={fLibre + i * 6 + 6} volume={0.5} />)}
        <Sfx name="pop" at={fCola} volume={0.6} />
        <Sfx name="stamp" at={fCat + 4} volume={0.5} />
      </>}
    />
  );
};

// Z16 · eBiblio, el truco: en el catálogo, «Audiolibros» y «Títulos disponibles» (la web real de eBiblio Madrid).
export const Z16eBiblioTruco: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z16', w, n);
  const fAudio = at('audiolibros');
  const fDisp = at('disponibles');
  const fAhora = at('ahora');
  // madrid.ebiblio.es/resources?nature=audio (sin y con «Títulos disponibles»), 1280 px de ancho, capturas del 14/10/2026.
  const keys: PageKey[] = [
    { f: 0, y: 0 },
    { f: fAudio - 6, y: 0, zoom: 1.0 },
    { f: fAudio + 16, y: 120, zoom: 1.7, x: 190 },
    { f: fAhora - 10, y: 120, zoom: 1.7, x: 190 },
    { f: fAhora + 16, y: 300, zoom: 1.25, x: 880 },
  ];
  const marks: PageMark[] = [
    { from: fAudio, to: fDisp - 4, x: 84, y: 458, w: 92, h: 32, r: 8 },
    { from: fDisp, to: fAhora - 6, x: 54, y: 280, w: 272, h: 38, r: 10 },
    { from: fAhora, to: p.dur + 20, x: 1040, y: 496, w: 166, h: 104, r: 12 },
  ];
  return (
    <WebPlatformScene {...p} id="Z16" k="ebiblio" title="Sin esperar" hi="esperar" noHeader titleSize={104}
      visual={<PaneSlot w={1010}><PagePane src="eb/web/mavail.png" cssW={1280} cssH={2400} width={1010} url="madrid.ebiblio.es/resources" keys={keys} marks={marks} /></PaneSlot>}
      rows={[
        { word: 'audiolibros', tone: 'trick', label: 'Marca «Audiolibros»' },
        { word: 'disponibles', tone: 'trick', label: 'Y «Títulos disponibles»', sub: 'Solo lo que te llevas ahora mismo' },
      ]}
      extra={<><Sfx name="click" at={fAudio + 4} volume={0.6} /><Sfx name="click" at={fDisp + 4} volume={0.6} /><Sfx name="zoom_in" at={fAudio + 8} volume={0.4} /></>}
    />
  );
};

// Z17 · LibriVox: arranca con la voz real de Omar (voluntario) leyendo a Bécquer; 21.000 audiolibros libres, más de 550 en
// español, y el truco del RSS en tu app de pódcasts.
export const Z17LibriVox: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('Z17', w, n);
  const fClasicos = at('clasicos');
  const fEsp = at('espanol');
  const fApp = at('app');
  const fRss = at('rss');
  const fPodcast = at('podcasts');
  const clip = (LV_CLIPS as unknown as Record<string, { words: [number, number, string][]; dur: number }>).omar_cold;
  const COLD = 12;
  const tCold = (frame - COLD) / fps;
  const coldOut = interpolate(frame, [p.lead - 22, p.lead - 2], [0, 1], { ...clamp, easing: easeInOut });
  // Página del libro (Leyendas, de Bécquer) en librivox.org: 1280 px de ancho, 2535 de alto. El RSS está a la altura 602.
  const keys: PageKey[] = [
    { f: 0, y: 200 },
    { f: fClasicos - 4, y: 200 },
    { f: fEsp + 10, y: 230, zoom: 1.0 },
    { f: fRss - 16, y: 300, zoom: 1.0 },
    { f: fRss + 10, y: 360, zoom: 1.9, x: 300 },
  ];
  const marks: PageMark[] = [{ from: fRss + 6, to: p.dur + 20, x: 280, y: 598, w: 92, h: 34, r: 8 }];
  const sPane = useSpring(p.lead - 4, 17, 120);
  const copy = spring({ frame: frame - fPodcast + 2, fps, config: { damping: 13, stiffness: 180 } });
  return (
    <MpStage tint={PLAT.librivox.c}>
      <AbsoluteFill>
        {/* Arranque en frío: la voz real de Omar y su frase, palabra a palabra */}
        {coldOut < 1 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - coldOut, transform: `scale(${1 - 0.05 * coldOut})` }}>
            <div style={{ width: 1300, textAlign: 'center', fontFamily: font.serif, fontSize: 70, lineHeight: 1.25, color: '#2a2418' }}>
              {clip.words.map(([s, , w], i) => (
                <span key={i} style={{ color: tCold >= s ? '#2a2418' : 'rgba(42,36,24,0.22)', background: tCold >= s && tCold < (clip.words[i + 1]?.[0] ?? 99) ? color.yellowSoft : 'transparent', borderRadius: 8, padding: '0 4px' }}>{w} </span>
              ))}
            </div>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2,
              opacity: interpolate(frame, [COLD + 10, COLD + 30], [0, 1], clamp) }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: color.red, opacity: 0.5 + 0.5 * Math.sin(frame / 6) }} />
              Omar, voluntario de LibriVox · Bécquer, «El rayo de luna»
            </div>
          </AbsoluteFill>
        )}
        {frame >= p.lead - 24 && (
          <>
            <div style={{ position: 'absolute', left: 90, top: (1080 - (1010 * 9) / 16 - 30) / 2, opacity: Math.min(1, sPane * 1.3), transform: `perspective(2400px) rotateY(${((1 - sPane) * 18 + 4).toFixed(2)}deg) translateX(${(1 - sPane) * -80}px)`, transformOrigin: 'left center' }}>
              <PagePane src="lv/web/book.png" cssW={1280} cssH={2535} width={1010} url="librivox.org · Leyendas" keys={keys} marks={marks} />
            </div>
            {/* El RSS viaja a una app de pódcasts */}
            {frame >= fPodcast - 4 && (
              <div style={{ position: 'absolute', left: 640, top: 690, padding: '18px 26px', borderRadius: 26, background: '#fff', boxShadow: shadow.float, display: 'flex', alignItems: 'center', gap: 16,
                opacity: copy, transform: `translate(${(1 - copy) * -200}px, ${(1 - copy) * -120}px) scale(${0.7 + 0.3 * copy})` }}>
                <span style={{ width: 56, height: 56, borderRadius: 14, background: '#8E44EC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><circle cx="12" cy="11" r="3" /><path d="M7.5 15.5a6.5 6.5 0 1 1 9 0M12 14v7" strokeLinecap="round" /></svg>
                </span>
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink }}>Leyendas · LibriVox</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 20, color: color.ink2 }}>En tu app de pódcasts · capítulos y descargas</div>
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ position: 'absolute', top: 0, height: 1080, left: 1180, width: 680, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: interpolate(frame, [p.lead - 20, p.lead], [0, 1], clamp) }}>
          <LvHeader at={p.lead - 6} />
          <MaskTitle text="LibriVox" at={p.lead} size={110} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginTop: 36 }}>
            {([
              { word: 'clasicos', tone: 'best', label: '+21.000 audiolibros libres', sub: 'Voces de voluntarios · sin registro' },
              { word: 'espanol', tone: 'info', label: '+550 en español', sub: 'El Quijote, La Regenta, Bécquer…' },
              { word: 'rss', tone: 'trick', label: 'Pega su RSS en tu app de pódcasts', sub: 'Y lo escuchas como un pódcast' },
            ] as Row[]).map((r, i, arr) => <ToneChip key={r.label} at={at(r.word) - 3} dimAt={arr[i + 1] ? at(arr[i + 1].word) - 3 : undefined} tone={r.tone} label={r.label} sub={r.sub} size={40} />)}
          </div>
        </div>
      </AbsoluteFill>
      {(!STEM || STEM === 'vo') && (
        <Sequence from={COLD} layout="none" name="lv:omar">
          <Audio src={staticFile('lv/audio/omar_cold.mp3')} volume={0.95} />
        </Sequence>
      )}
      <Sfx name="whoosh_soft" at={p.lead - 14} volume={0.6} />
      <Sfx name="ui_pop" at={at('clasicos') - 2} volume={0.6} />
      <Sfx name="ui_pop" at={at('espanol') - 2} volume={0.6} />
      <Sfx name="zoom_in" at={fRss + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fRss - 2} volume={0.6} />
      <Sfx name="whoosh_fast" at={fPodcast} volume={0.6} />
      <Sfx name="tick_soft" at={fApp} volume={0.2} />
    </MpStage>
  );
};
const LvHeader: React.FC<{ at: number }> = ({ at }) => {
  const s = useSpring(at, 15, 160);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: s, transform: `translateY(${(1 - s) * 24}px)` }}>
      <PlatTile k="librivox" size={84} />
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: color.muted }}>Clásicos gratis</div>
    </div>
  );
};

// Z18 · El Libro Total: casi 6.700 audiolibros gratis y sin cuenta; la audiolectura (el texto se resalta mientras suena).
export const Z18ElLibroTotal: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z18', w, n);
  const fAudiolect = at('audiolectura');
  const fResalta = at('resalta');
  const fClasicos = at('clasicos');
  const sPane = useSpring(2, 17, 120);
  // Grabación real de ellibrototal.com (Crimen y castigo): a los 9,5 s empieza la audiolectura con el texto resaltado.
  const start = Math.max(0, 9.4 - (fAudiolect - 4) / 50);
  return (
    <WebPlatformScene {...p} id="Z18" k="elt" model="Clásicos gratis" title="El Libro Total" titleSize={96} side="left" headerAt={p.lead - 4}
      visual={
        <div style={{ position: 'absolute', right: 90, top: (1080 - (1010 * 9) / 16 - 30) / 2, opacity: Math.min(1, sPane * 1.3), transform: `perspective(2400px) rotateY(${(-(1 - sPane) * 18 - 4).toFixed(2)}deg) translateX(${(1 - sPane) * 80}px)`, transformOrigin: 'right center' }}>
          <WebPane src="elt/rec/03_reader/video.mp4" width={1010} url="ellibrototal.com" startAt={start}
            camera={[{ f: 0, zoom: 1, x: 960, y: 540 }, { f: fResalta - 6, zoom: 1, x: 960, y: 540 }, { f: fResalta + 18, zoom: 1.45, x: 960, y: 520 }, { f: fClasicos - 6, zoom: 1.45, x: 960, y: 520 }, { f: fClasicos + 18, zoom: 1, x: 960, y: 540 }]} />
        </div>
      }
      rows={[
        { word: 'seis', tone: 'best', label: '≈6.700 audiolibros gratis', sub: 'Sin cuenta · voces humanas' },
        { word: 'audiolectura', tone: 'best', label: 'Audiolectura', sub: 'El texto se resalta mientras suena' },
        { word: 'clasicos', tone: 'warn', label: 'Clásicos y relatos cortos', sub: 'Y el audio necesita conexión' },
      ]}
      extra={<Sfx name="zoom_in" at={fResalta + 10} volume={0.5} />}
    />
  );
};

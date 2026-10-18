import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { LaptopIcon } from '../../components/Icons2';
import { wf } from './timeline';
import {
  align, Burst, Card, color, font, markOn, MaskTitle, MpStage, MShot, Odometer, PlatformScene, PlatLogo, PlatTile, PLAT, SceneProps, shadow, Sheen, ToneChip, useSpring,
} from './kit';

type P = SceneProps;

// Portátil con el reproductor web de Audible (ilustración: «También en el ordenador»). Entra deslizándose desde abajo.
const LaptopPlayer: React.FC<{ at: number; x: number; y: number; w?: number }> = ({ at, x, y, w = 420 }) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, 15, 150);
  if (frame < at - 2) return null;
  const h = w * 0.62;
  const prog = interpolate(frame, [at, at + 400], [0.18, 0.42], clamp);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * 6}deg) scale(${0.85 + 0.15 * s})`, filter: s < 0.97 ? `blur(${((1 - s) * 6).toFixed(2)}px)` : undefined }}>
      <div style={{ width: w, height: h, borderRadius: 18, background: '#1b1b1d', padding: 12, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(16,16,16,0.3)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 8, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 30, background: '#F2F2F3', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
            <span style={{ marginLeft: 12, padding: '3px 14px', borderRadius: 6, background: '#E6E6E8', fontFamily: font.sans, fontSize: 13, color: color.ink2 }}>audible.es · reproductor web</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', background: 'linear-gradient(160deg, #FFF6E8 0%, #fff 70%)' }}>
            <div style={{ width: 96, height: 96, borderRadius: 10, background: 'linear-gradient(150deg, #2B1B12 0%, #7A2A12 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: font.serif, fontSize: 22, color: '#F7D9A8', letterSpacing: 1 }}>Drácula</span>
            </div>
            <div style={{ flex: 1 }}>
              <PlatLogo k="audible" width={110} />
              <div style={{ height: 8, borderRadius: 4, background: '#EEE', marginTop: 18, overflow: 'hidden' }}>
                <div style={{ width: `${prog * 100}%`, height: '100%', background: PLAT.audible.c }} />
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, borderRadius: '50%', background: PLAT.audible.c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="#fff" /></svg>
                </span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 16, color: color.ink2 }}>1,0x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: w * 1.16, height: 16, marginLeft: -w * 0.08, borderRadius: '0 0 16px 16px', background: 'linear-gradient(180deg, #C9CACD 0%, #9C9DA1 100%)' }} />
    </div>
  );
};

// Z03 · Audible: Premium sin límite, sus Originals (Drácula, Dolby Atmos), 3,5x y escuchar en el ordenador.
export const Z03Audible: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z03', w, n);
  const fPrem = at('premium');
  const fOrig = at('originals');
  const fProd = at('actores');
  const fDolby = at('dolby');
  const fAlgo = at('algo');
  const fOrd = at('ordenador');
  const s0: MShot = { dir: 'aud', rec: '00_inicio_top', at: 0, start: 2.0, hold: 15 };
  // La fila «Novedades» con Drácula y su sello «audible ORIGINAL»; después, su ficha (reparto y Dolby Atmos).
  const s1: MShot = { dir: 'aud', rec: '01_inicio_scroll', at: fOrig - 8, start: 11.4, hold: 12.4 };
  s1.marks = [markOn(s1, fOrig, fProd - 8, 8, 236, 330, 440, 22)];
  const s2: MShot = { dir: 'aud', rec: '05_dracula', at: fProd - 6, start: 7.9, hold: 9.6 };
  s2.marks = [markOn(s2, fProd + 2, fDolby - 2, 48, 270, 592, 62, 16), markOn(s2, fDolby, fAlgo - 8, 246, 370, 172, 40, 12)];
  return (
    <PlatformScene {...p} id="Z03" k="audible" model="Tarifa plana" title="Audible" shots={[s0, s1, s2]} titleSize={110} headerAt={p.lead - 4}
      focusExtra={[]}
      rows={[
        { word: 'nueve', tone: 'price', label: '9,99 € al mes', sub: 'Premium · sin límite de horas' },
        { word: 'noventa', nth: 1, tone: 'info', label: 'Más de 90.000 títulos', sub: 'Audiolibros, pódcasts y Originals' },
        { word: 'originals', tone: 'best', label: 'Audible Originals', sub: 'Drácula: actores y Dolby Atmos' },
        { word: 'ordenador', tone: 'best', label: 'También en el ordenador', sub: 'Desde su web' },
      ]}
      overlay={<LaptopPlayer at={fOrd - 6} x={250} y={700} w={430} />}
      extra={<Sfx name="whoosh_soft" at={fOrd - 2} volume={0.7} />}
    />
  );
};

// Z04 · Audible, la letra pequeña: el catálogo extendido, Standard, el truco del día 1 y los 90 días con Prime.
export const Z04AudibleOjo: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('Z04', w, n);
  const fOjo = at('ojo');
  const fAlg = at('algunos');
  const fExt = at('extendido');
  const fAparte = at('aparte');
  const fLibro = at('libro');
  const fStd = at('standard');
  const fTruco = at('truco');
  const fCanc = at('cancelas');
  const fSigues = at('sigues');
  const fPrime = at('prime');
  const s0: MShot = { dir: 'aud', rec: '10_posteguillo', at: 0, start: 5.0, hold: 15 };
  s0.marks = [markOn(s0, fExt - 6, fAparte - 2, 120, 330, 270, 40, 10)];
  const s1: MShot = { dir: 'aud', rec: '11_tres_mundos', at: fAparte - 6, start: 3.0, hold: 18 };
  s1.marks = [markOn(s1, fAparte + 2, fLibro - 6, 30, 934, 604, 104, 18)];
  // El plan Standard, tal como lo ofrece la app (19_suscripcion, 28–34 s: «1 audiolibro mensual · 6,99 €/mes»).
  const s2: MShot = { dir: 'aud', rec: '19_suscripcion', at: fLibro - 8, start: 28.0, hold: 34.0 };
  s2.marks = [markOn(s2, fStd, fTruco - 6, 20, 496, 624, 568, 22)];
  // «Has cancelado tu plan… finaliza el 13 de noviembre» (la toma limpia, 18,3–22,3 s).
  const s3: MShot = { dir: 'aud', rec: '19_suscripcion', at: fTruco - 8, start: 18.3, hold: 22.3 };
  s3.marks = [markOn(s3, fCanc - 2, fSigues - 4, 14, 140, 636, 180, 22), markOn(s3, fSigues - 2, fPrime - 6, 30, 470, 604, 150, 22)];
  const sPrime = spring({ frame: frame - fPrime + 2, fps, config: { damping: 11, stiffness: 200 } });
  return (
    <PlatformScene {...p} id="Z04" k="audible" title="La letra pequeña" hi="pequeña" noHeader shots={[s0, s1, s2, s3]} titleSize={96}
      rows={[
        { word: 'ojo', tone: 'warn', label: 'Premium no lo incluye todo' },
        { word: 'extendido', tone: 'warn', label: 'El catálogo extendido, aparte', sub: 'Los tres mundos: 15,10 € con descuento' },
        { word: 'standard', tone: 'price', label: 'Standard: 6,99 € al mes', sub: 'Un libro al mes, mientras sigas suscrito' },
        { word: 'truco', tone: 'trick', label: 'Cancela el día 1', sub: 'Sigues escuchando hasta que acaba la prueba' },
      ]}
      extra={frame >= fPrime - 4 ? (
        <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 30px 18px 18px', borderRadius: 999, background: color.ink, color: '#fff', alignSelf: 'flex-start',
          transform: `scale(${0.6 + 0.4 * sPrime}) rotate(${(1 - sPrime) * -8}deg)`, opacity: Math.min(1, sPrime * 1.4), transformOrigin: 'left center', boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
          <span style={{ width: 66, height: 66, borderRadius: '50%', background: PLAT.audible.c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>90</span>
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40 }}>días gratis con Amazon Prime</span>
        </div>
      ) : null}
      overlay={<><Sfx name="stamp" at={fPrime + 2} volume={0.7} /><Burst at={fPrime + 4} x={1010} y={905} r={40} n={26} seed="prime" /></>}
    />
  );
};

// Z05 · Storytel: 8,99 € sin límite, audiolibros y ebooks, «Leer desde aquí» y buscar una palabra que salta al minuto del audio.
export const Z05Storytel: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z05', w, n);
  const fRival = at('rival');
  const fLees = at('lees');
  const fEstrella = at('estrella');
  const fLeer = at('leer');
  const fDonde = at('donde');
  const fBuscas = at('buscas');
  const fLleva = at('lleva');
  const fMinuto = at('minuto');
  const s0: MShot = { dir: 'str', rec: '00_inicio_top', at: 0, start: 1.0, hold: 14 };
  // «Leer desde aquí» en el reproductor y el ebook con la frase marcada.
  const s1 = align('str', '15_reproductor2', 94.62, fLeer + 2, 20, { hold: 94.72 });
  s1.marks = [markOn(s1, fEstrella + 6, fLeer + 2, 22, 1306, 620, 108, 30)];
  const s2: MShot = { dir: 'str', rec: '16_lectura', at: fLeer + 4, start: 2.4, hold: 24 };
  s2.marks = [markOn(s2, fDonde - 4, fBuscas - 6, 14, 334, 636, 174, 14)];
  // «Buscar en el libro» y el salto al minuto del audio.
  const s3: MShot = { dir: 'str', rec: '18_buscar_audio', at: fBuscas - 6, start: 18.0, hold: 28.8 };
  s3.marks = [markOn(s3, fBuscas + 4, fLleva - 2, 10, 196, 646, 180, 18), markOn(s3, fLleva, fMinuto + 4, 520, 196, 136, 44, 12)];
  const s4 = align('str', '18_buscar_audio', 29.7, fMinuto + 4, 6, { hold: 40 });
  s4.marks = [markOn(s4, fMinuto + 8, p.dur + 20, 16, 975, 632, 90, 16)];
  return (
    <PlatformScene {...p} id="Z05" k="storytel" model="Tarifa plana" title="Storytel" side="left" shots={[s0, s1, s2, s3, s4]} titleSize={110} headerAt={p.lead - 4}
      rows={[
        { word: 'ocho', tone: 'price', label: '8,99 € al mes', sub: 'Sin límite de horas' },
        { word: 'lees', tone: 'best', label: 'Audiolibros y ebooks', sub: 'En la misma cuota · +650.000 títulos' },
        { word: 'leer', tone: 'best', label: '«Leer desde aquí»', sub: 'Sigues en el ebook donde ibas' },
        { word: 'buscas', tone: 'trick', label: 'Busca una palabra', sub: 'Y salta a ese minuto del audio' },
      ]}
      overlay={<Sfx name="whoosh_soft" at={fRival} volume={0.4} />}
    />
  );
};

// Z06 · Storytel en casa: Family entre tres (≈ 7 € por persona), y lo malo: ni ordenador ni web, 7 días de prueba y el corte al cancelar.
export const Z06StorytelOjo: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z06', w, n);
  const fTres = at('tres');
  const fFamily = at('family');
  const fSiete = at('siete');
  const fBib = at('biblioteca');
  const fMalo = at('malo');
  const fOrd = at('ordenador');
  const fPrueba = at('prueba');
  const fSolo = at('siete', 1);
  const fCuidado = at('cancelas');
  const fMomento = at('momento');
  const sFam = useSpring(fTres - 6, 15, 150);
  const split = interpolate(frame, [fFamily, fFamily + 26], [0, 1], { ...clamp, easing: easeInOut });
  const sMalo = useSpring(fMalo - 6, 15, 150);
  const people = [0, 1, 2];
  const bad = [
    { f: fOrd, label: 'Ni ordenador ni web', sub: 'Solo la app' },
    { f: fSolo, label: 'Prueba de solo 7 días', sub: 'Pide tarjeta' },
    { f: fCuidado, label: 'Cancela el último día', sub: 'Si cancelas en la prueba, pierdes el acceso al momento' },
  ];
  return (
    <MpStage tint={PLAT.storytel.c}>
      <AbsoluteFill>
        {/* Family */}
        <div style={{ position: 'absolute', left: 130, top: 170, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26 }}>
            <PlatTile k="storytel" size={70} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: color.muted }}>Si sois tres en casa</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 38, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '40px 46px', position: 'relative', overflow: 'hidden',
            opacity: Math.min(1, sFam * 1.3), transform: `translateY(${(1 - sFam) * 60}px)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: -2, color: color.ink }}>Family</span>
              <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2 }}>3 cuentas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, opacity: 1 - split * 0.55 }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: -4, color: PLAT.storytel.deep, textDecoration: split > 0.6 ? 'none' : undefined }}>20,99 €</span>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2 }}>al mes</span>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 30 }}>
              {people.map((i) => {
                const s = spring({ frame: frame - fFamily - i * 5, fps, config: { damping: 13, stiffness: 190 } });
                const lib = spring({ frame: frame - fBib - i * 4, fps, config: { damping: 13, stiffness: 190 } });
                return (
                  <div key={i} style={{ flex: 1, borderRadius: 26, background: PLAT.storytel.soft, padding: '24px 18px', textAlign: 'center', opacity: frame < fFamily - 2 ? 0.35 : 0.35 + 0.65 * s, transform: `translateY(${(1 - s) * 20}px)` }}>
                    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={PLAT.storytel.deep} strokeWidth={1.8}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" /></svg>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -2, color: color.ink, marginTop: 6 }}>
                      {frame >= fFamily ? <Odometer text="7,00" at={fFamily + 4 + i * 3} size={52} dur={24} /> : '—'}<span style={{ fontSize: 30 }}> €</span>
                    </div>
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.ink2, marginTop: 6, opacity: lib }}>su biblioteca</div>
                  </div>
                );
              })}
            </div>
            <Sheen at={fFamily + 20} radius={38} />
          </div>
        </div>
        {/* Lo malo */}
        <div style={{ position: 'absolute', left: 1000, top: 0, height: 1080, width: 800, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
          <div style={{ opacity: sMalo, transform: `translateY(${(1 - sMalo) * 30}px)` }}>
            <MaskTitle text="Lo malo" hi="malo" at={fMalo - 4} size={96} />
          </div>
          {bad.map((b, i) => <ToneChip key={b.label} at={b.f - 3} tone="warn" label={b.label} sub={b.sub} size={40} dimAt={bad[i + 1]?.f} reserve />)}
        </div>
      </AbsoluteFill>
      <Sfx name="card_flip" at={fTres - 2} volume={0.7} />
      {people.map((i) => <Sfx key={i} name="pop" at={fFamily + i * 5 + 2} volume={0.5} />)}
      <ChangeTicks value={(f) => String(Math.floor(interpolate(f, [fFamily + 4, fFamily + 30], [0, 7], clamp)))} from={fFamily + 4} to={fFamily + 34} volume={0.6} />
      <Sfx name="whoosh_soft" at={fMalo - 4} volume={0.6} />
      {bad.map((b) => <Sfx key={b.label} name="tick_soft" at={b.f - 2} volume={0.7} />)}
      <Sfx name="fail" at={fMomento} volume={0.5} />
    </MpStage>
  );
};

// Z07 · Podimo: 4,99 € con 20 h, sus pódcasts exclusivos y el reloj de horas que se reinicia el día 1.
export const Z07Podimo: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z07', w, n);
  const fBarato = at('barato');
  const fEcon = at('economica');
  const fPod = at('podcasts');
  const fMimi = at('mimicidios');
  const fEntre = at('entre');
  const fEso = at('eso');
  const fAcum = at('acumulan');
  const s0: MShot = { dir: 'pdr', rec: '15_inicio_top', at: 0, start: 3.0, hold: 15 };
  const s1: MShot = { dir: 'pdr', rec: '04_inicio', at: fPod - 8, start: 13.4, hold: 14.2 };
  s1.marks = [markOn(s1, fPod, fMimi - 6, 22, 548, 470, 440, 26)];
  const s2 = align('pdr', '01_int_pod', 24.0, fMimi, 8, { hold: 25.0 });
  s2.marks = [markOn(s2, fMimi, fEntre - 4, 336, 292, 292, 270, 22)];
  const s3 = align('pdr', '11_podcast', 16.6, fEntre, 10, { hold: 31 });
  s3.marks = [markOn(s3, fEntre + 2, fEso - 6, 12, 930, 640, 124, 18)];
  const s4 = align('pdr', '13_membresia', 2.4, fEso + 4, 10, { hold: 26 });
  s4.marks = [markOn(s4, fEso + 8, p.dur + 20, 22, 438, 620, 122, 18)];
  return (
    <PlatformScene {...p} id="Z07" k="podimo" model="Por horas" title="Podimo" shots={[s0, s1, s2, s3, s4]} titleSize={110} headerAt={p.lead - 4}
      rows={[
        { word: 'cuatro', tone: 'price', label: '4,99 € al mes', sub: '20 h de audiolibros · la más económica' },
        { word: 'podcasts', tone: 'best', label: 'Pódcasts exclusivos', sub: 'Mimicidios · Entre el cielo y las nubes' },
        { word: 'acumulan', tone: 'warn', label: 'Las horas no se acumulan', sub: 'Se reinician el día 1 de cada mes' },
      ]}
      overlay={<Sfx name="whoosh_soft" at={fBarato} volume={0.3} />}
      extra={<Sfx name="coins" at={fEcon} volume={0.5} />}
    />
  );
};

// Z08 · Nextory: 1,4 millones de títulos (todo Planeta), tres planes, cuatro perfiles y El Librarian (IA).
export const Z08Nextory: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z08', w, n);
  const fPlaneta = at('planeta');
  const fDiez = at('diez');
  const fPerf = at('perfiles');
  const fLib = at('librarian');
  const fCuentas = at('cuentas');
  const fProp = at('propone');
  const s0: MShot = { dir: 'nxr', rec: '01_inicio', at: 0, start: 12.6, hold: 21.0 };
  const s1: MShot = { dir: 'nxr', rec: '08_perfil', at: fPerf - 8, start: 2.0, hold: 12.0 };
  s1.marks = [markOn(s1, fPerf, fLib - 8, 14, 376, 636, 226, 16)];
  const s2: MShot = { dir: 'nxr', rec: '02_librarian_b', at: fLib - 6, start: 5.1, rate: 1.4, hold: 7.6 };
  const s3 = align('nxr', '02_librarian_b', 15.58, fCuentas + 20, 6);
  const s4 = align('nxr', '02_librarian_b', 24.4, fProp, 4);
  return (
    <PlatformScene {...p} id="Z08" k="nextory" model="Por horas o sin límite" title="Nextory" shots={[s0, s1, s2, s3, s4]} titleSize={110} headerAt={p.lead - 4} exit="glide"
      focusExtra={[{ from: fCuentas, to: fProp - 4, y: 1340, s: 1.3 }, { from: fProp + 4, to: p.dur - 30, y: 760, s: 1.25 }]}
      rows={[
        { word: 'millon', tone: 'info', label: '+1,4 millones de títulos', sub: 'Con todo el catálogo de Planeta' },
        { word: 'diez', tone: 'price', label: '5,99 € · 10 h  ·  7,99 € · 30 h', sub: 'O sin límite desde 9,99 €' },
        { word: 'perfiles', tone: 'best', label: '4 perfiles y modo infantil' },
        { word: 'librarian', tone: 'best', label: 'El Librarian (IA)', sub: 'Le cuentas qué te apetece y te propone libros' },
      ]}
      overlay={<Sfx name="sparkle" at={fPlaneta} volume={0.4} />}
      extra={<Sfx name="tick_soft" at={fDiez} volume={0.3} />}
    />
  );
};

// Z09 · Nextory guarda las horas que no gastas (la hoja real «¿Cómo calculamos el tiempo?»); Podimo, BookBeat y Spotify, no.
export const Z09NextoryHoras: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('Z09', w, n);
  const fVentaja = at('ventaja');
  const fPod = at('podimo');
  const fGastas = at('gastas');
  const fGuardan = at('guardan');
  const fSig = at('siguiente');
  const fLeer = at('leer');
  const sheetAt = Math.max(2, fGastas - 30);
  const s0: MShot = { dir: 'nxr', rec: '11_actividad', at: 0, start: 1.0 };
  const s1: MShot = { dir: 'nxr', rec: '11_actividad', at: sheetAt, start: 20.4 };
  s1.marks = [markOn(s1, fGastas - 2, fLeer - 4, 12, 750, 640, 120, 12), markOn(s1, fLeer - 2, p.dur + 10, 12, 630, 640, 82, 12)];
  // Barras de un mes y el siguiente: en Nextory lo que sobra pasa; en las otras tres se pierde.
  const sBars = spring({ frame: frame - fVentaja + 4, fps, config: { damping: 16, stiffness: 150 } });
  const move = interpolate(frame, [fGuardan, fSig + 10], [0, 1], { ...clamp, easing: easeInOut });
  const others: ('podimo' | 'bookbeat' | 'spotify')[] = ['podimo', 'bookbeat', 'spotify'];
  return (
    <PlatformScene {...p} id="Z09" k="nextory" title="Lo que sobra, se guarda" hi="guarda" noHeader shots={[s0, s1]} titleSize={84} enter="glide"
      rows={[
        { word: 'leer', tone: 'warn', label: 'Leer también gasta horas' },
      ]}
      extra={
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18, opacity: Math.min(1, sBars * 1.3), transform: `translateY(${(1 - sBars) * 30}px)` }}>
          {/* Nextory */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <PlatTile k="nextory" size={76} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MonthBar label="Octubre" used={0.6} carry={move} color={PLAT.nextory.c} />
              <svg width={44} height={30} viewBox="0 0 44 30" style={{ opacity: move }}><path d="M2 15h36M28 5l10 10-10 10" stroke={PLAT.nextory.deep} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <MonthBar label="Noviembre" used={0} carryIn={move} color={PLAT.nextory.c} />
            </div>
          </div>
          {others.map((k, i) => {
            const s = spring({ frame: frame - fPod - i * 5, fps, config: { damping: 15, stiffness: 180 } });
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: frame < fPod - 2 ? 0 : s }}>
                <PlatTile k={k} size={76} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MonthBar label="Octubre" used={0.6} lost={move} color={PLAT[k].c} />
                  <span style={{ width: 44, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.red, opacity: move }}>✕</span>
                  <MonthBar label="Noviembre" used={0} color={PLAT[k].c} />
                </div>
              </div>
            );
          })}
        </div>
      }
      overlay={<><Sfx name="whoosh_soft" at={fGuardan} volume={0.6} /><Sfx name="success" at={fSig + 4} volume={0.6} /></>}
    />
  );
};

// Barra de horas de un mes: lo usado (gris), lo que sobra (color) y, si `carry`, lo que sobra viaja al mes siguiente.
const MonthBar: React.FC<{ label: string; used: number; carry?: number; carryIn?: number; lost?: number; color: string }> = ({ label, used, carry = 0, carryIn = 0, lost = 0, color: c }) => {
  const W = 300;
  const left = 1 - used;
  return (
    <div style={{ width: W }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: color.ink2, marginBottom: 8 }}>{label}</div>
      <div style={{ width: W, height: 30, borderRadius: 15, background: '#EDEDED', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${used * 100}%`, background: '#BDBDBD' }} />
        {left > 0 && used > 0 && (
          <div style={{ position: 'absolute', left: `${used * 100}%`, top: 0, bottom: 0, width: `${left * 100}%`, background: c, opacity: 1 - Math.max(carry, lost) * 0.85,
            transform: `translateX(${carry * 40}px)` }} />
        )}
        {carryIn > 0 && (
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${0.4 * carryIn * 100}%`, background: c }} />
        )}
      </div>
    </div>
  );
};

// Z10 · BookBeat: tres paquetes de horas con ebooks, perfiles con horas propias (4,99 €), la app en inglés y 16.500 audiolibros en español.
export const Z10BookBeat: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z10', w, n);
  const fHoras = at('horas');
  const fPerfil = at('perfil');
  const fPero = at('pero');
  const fIngles = at('ingles');
  const fMillon = at('millon');
  const fFaltan = at('faltan');
  const s0: MShot = { dir: 'bkb', rec: '27_cambiar_plan', at: 0, start: 2.0, hold: 19.5 };
  s0.marks = [markOn(s0, fHoras + 4, fPerfil - 8, 88, 560, 488, 245, 18)];
  const s1: MShot = { dir: 'bkb', rec: '18_perfiles_web', at: fPerfil - 8, start: 4.0, hold: 11.3 };
  s1.marks = [markOn(s1, fPerfil, fPero - 6, 8, 536, 648, 112, 16)];
  const s2 = align('bkb', '04_inspiration', 0.8, fIngles - 4, 20, { hold: 16.0 });
  s2.marks = [markOn(s2, fIngles + 2, fMillon - 6, 18, 215, 545, 405, 16)];
  const s3: MShot = { dir: 'bkb', rec: '09_sombra_ficha', at: fMillon - 6, start: 2.0, hold: 10 };
  return (
    <PlatformScene {...p} id="Z10" k="bookbeat" model="Por horas" title="BookBeat" side="left" shots={[s0, s1, s2, s3]} titleSize={110} headerAt={p.lead - 4}
      rows={[
        { word: 'veinte', tone: 'price', label: '20 h · 6,99 €   50 h · 9,99 €', sub: 'O 100 h por 14,99 € · con ebooks' },
        { word: 'perfil', tone: 'best', label: 'Cada perfil, sus horas', sub: 'Perfil extra: 4,99 € al mes' },
        { word: 'ingles', tone: 'warn', label: 'La app, en inglés', sub: 'En España no se puede cambiar' },
        { word: 'dieciseis', tone: 'warn', label: '≈16.500 audiolibros en español', sub: 'Faltan muchos de los más buscados' },
      ]}
      overlay={<Sfx name="fail" at={fFaltan} volume={0.3} />}
    />
  );
};

// Z12 · Audiobooks.com: un crédito al mes, tuyo para siempre; Los tres mundos con un crédito y más de 10.000 gratis.
export const Z12Audiobooks: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z12', w, n);
  const fCredito = at('credito');
  const fSiempre = at('siempre');
  const fCompensa = at('compensa');
  const fTres = at('tres');
  const fEntra = at('entra');
  const fCuenta = at('registrarte');
  const fDiez = at('diez');
  const s0: MShot = { dir: 'abc', rec: 'perfil_prueba', at: 0, start: 3.0, hold: 12 };
  s0.marks = [markOn(s0, fCredito - 2, fCompensa - 8, 66, 546, 528, 100, 26)];
  const s1: MShot = { dir: 'abc', rec: 'tres_mundos_ficha', at: fTres - 6, start: 2.0, hold: 12 };
  s1.marks = [markOn(s1, fTres + 2, fCuenta - 6, 22, 768, 620, 236, 24)];
  const s2: MShot = { dir: 'abc', rec: 'cuenta_gratis', at: fCuenta - 6, start: 2.0, hold: 18 };
  s2.marks = [markOn(s2, fCuenta + 2, p.dur + 20, 34, 300, 596, 150, 22)];
  return (
    <PlatformScene {...p} id="Z12" k="audiobooks" model="Con créditos" title="Audiobooks.com" shots={[s0, s1, s2]} titleSize={96} headerAt={p.lead - 4} exit="glide"
      rows={[
        { word: 'catorce', tone: 'price', label: '14,95 $ al mes (≈13 €)', sub: '1 crédito = el audiolibro que quieras' },
        { word: 'siempre', tone: 'best', label: 'Tuyo para siempre', sub: 'Aunque te des de baja' },
        { word: 'tres', tone: 'best', label: 'Los tres mundos: 1 crédito', sub: 'En Audible se paga aparte' },
        { word: 'registrarte', tone: 'best', label: '+10.000 audiolibros gratis', sub: 'Con una cuenta gratis, sin suscripción' },
      ]}
      overlay={<><Sfx name="coins" at={fCredito} volume={0.6} /><Sfx name="success" at={fEntra} volume={0.4} /><Sfx name="sparkle" at={fDiez} volume={0.4} /></>}
      extra={<Sfx name="tick_soft" at={fSiempre} volume={0.2} />}
    />
  );
};

// Z13 · Audiobooks.com, el ajuste: el buscador solo enseña libros en inglés hasta que lo cambias en Ajustes.
export const Z13AudiobooksAjuste: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('Z13', w, n);
  const fBusc = at('buscador');
  const fIngles = at('ingles');
  const fAjustes = at('ajustes');
  const s0 = align('abc', 'elon_buscar_en', 15.9, fBusc, Math.min(10, fBusc), { hold: 36 });
  s0.marks = [markOn(s0, fIngles - 2, fAjustes - 8, 14, 294, 628, 232, 26)];
  const s1: MShot = { dir: 'abc', rec: 'ajustes_ingles', at: fAjustes - 6, start: 4.0, hold: 16 };
  s1.marks = [markOn(s1, fAjustes + 2, p.dur + 20, 12, 814, 640, 92, 24)];
  return (
    <PlatformScene {...p} id="Z13" k="audiobooks" title="Haz esto lo primero" hi="primero" noHeader shots={[s0, s1]} titleSize={92} enter="glide"
      rows={[
        { word: 'ingles', tone: 'warn', label: 'Solo enseña libros en inglés' },
        { word: 'ajustes', tone: 'trick', label: 'Cámbialo en Ajustes', sub: '«Only show English-language results»' },
      ]}
    />
  );
};

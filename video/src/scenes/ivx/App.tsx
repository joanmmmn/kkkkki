import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, HeadphonesIcon, MicIcon } from '../../components/Icons';
import { CarIcon, ClockIcon, DownloadIcon, ListIcon, MoonIcon, SpeedIcon, StarIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { align, AppFeatureScene, BluePlay, Crown, Diamond, IV, IV_DEEP, IV_SOFT, markOn, Odometer, odometerShown, PLUS, PLUS_DEEP, PLUS_SOFT, RadioIcon, Shot, Tap, VolumeIcon } from './kit';

type P = SceneProps;
const ic = (n: React.ReactNode) => n;

// W05 · La app por dentro: Inicio te recomienda programas («Especialmente para ti»), Explorar (categorías y el ranking) y los
// iVoox Originals, sus programas propios: Casus Belli y Universo de Misterios.
export const W05App: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('W05', w, n);
  const fInicio = at('inicio');
  const fRecom = at('recomienda');
  const fExplorar = at('explorar');
  const fCateg = at('categorias');
  const fRank = at('rankings');
  const fOrig = at('originals');
  const fPropios = at('propios');
  const fCasus = at('casus');
  const fUniverso = at('universo');
  const s0: Shot = { rec: 'inicio_3', at: 0, start: 2.0, hold: 30 };
  s0.marks = [markOn(s0, fRecom - 2, fExplorar - 8, 0, 870, 664, 380, 22)];
  const s1: Shot = { rec: 'explorar_carta', at: fExplorar - 6, start: 4.0, hold: 15 };
  s1.marks = [markOn(s1, fCateg - 2, fRank - 6, 16, 380, 632, 932, 24)];
  const s2: Shot = { rec: 'ranking', at: fRank - 6, start: 4.2, hold: 22 };
  s2.marks = [markOn(s2, fRank + 2, fOrig - 8, 0, 190, 664, 360, 18)];
  // Originals desplazados (desde 16,5 s de la toma): Casus Belli y Universo de Misterios a la vista.
  const s3: Shot = { rec: 'originals', at: fOrig - 6, start: 17.0, hold: 31 };
  s3.marks = [markOn(s3, fCasus - 2, fUniverso - 4, 20, 416, 196, 262, 22), markOn(s3, fUniverso - 2, p.dur + 20, 448, 722, 196, 262, 22)];
  return (
    <AppFeatureScene {...p} id="W05" title="La app por dentro" hi="app" shots={[s0, s1, s2, s3]} titleSize={100} tagSize={42} tagGap={18}
      focusExtra={[{ from: fInicio, to: fRecom - 4, y: 700, s: 1.06 }, { from: fOrig + 2, to: fCasus - 6, y: 640, s: 1.1 }]}
      tags={[
        { word: 'inicio', label: 'Inicio te recomienda programas', icon: ic(<StarIcon size={32} />) },
        { word: 'explorar', label: 'Explorar: categorías y rankings', icon: ic(<ListIcon size={32} />) },
        { word: 'originals', label: 'iVoox Originals', sub: 'Casus Belli · Universo de Misterios', icon: ic(<MicIcon size={32} />) },
      ]}
      overlay={<><Sfx name="tick_soft" at={fPropios} volume={0.4} /><Sfx name="ui_pop" at={fCasus - 2} volume={0.45} /><Sfx name="ui_pop" at={fUniverso - 2} volume={0.45} /></>} />
  );
};

// W06 · Casi todo se escucha gratis y se descarga (La ContraHistoria: el episodio gratis se descarga, «Descargando en Mi iVoox»).
// Pero el play azul es exclusivo de Plus: «Héroe de cuatro patrias» (1:03:01) solo deja oír 7:05 sin Plus.
export const W06Exclusivo: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('W06', w, n);
  const fGratis = at('gratis');
  const fDesc = at('descargar');
  const fOjo = at('ojo');
  const fPlay = at('play');
  const fExcl = at('exclusivo');
  const fContra = at('contrahistoria');
  const fHora = at('hora');
  const fSolo = at('solo');
  const fSiete = at('siete');
  // La descarga del episodio gratis (el aviso sale a los 17,5 s de la toma) cae con «descargar».
  const s0 = align('contrahistoria_descarga', 17.4, fDesc, fDesc, { hold: 26 });
  s0.marks = [markOn(s0, fGratis - 4, fOjo - 6, 10, 858, 644, 128, 18)];
  const s1: Shot = { rec: 'contrahistoria_ficha', at: fOjo - 6, start: 3.0, hold: 15 };
  s1.marks = [markOn(s1, fPlay - 2, fContra - 6, 548, 664, 92, 92, 46), markOn(s1, fContra - 2, fSolo - 8, 14, 656, 636, 130, 18)];
  // El reproductor: «00:06 … 07:05» (el avance) con el play a medias.
  const s2: Shot = { rec: 'contrahistoria_avance', at: fSolo - 8, start: 6.0, hold: 15 };
  s2.marks = [markOn(s2, fSolo - 2, p.dur + 20, 22, 1186, 620, 58, 16)];
  const sCard = spring({ frame: frame - (fSiete - 8), fps, config: { damping: 14, stiffness: 170 } });
  return (
    <AppFeatureScene {...p} id="W06" title="Gratis… menos el play azul" hi="azul" side="left" shots={[s0, s1, s2]} titleSize={86} tagSize={40} tagGap={16}
      focusExtra={[{ from: fDesc + 6, to: fOjo - 8, y: 920, s: 1.3 }]}
      tags={[
        { word: 'gratis', label: 'Casi todo se escucha gratis', icon: ic(<HeadphonesIcon size={32} />) },
        { word: 'descargar', label: 'Y se descarga', icon: ic(<DownloadIcon size={32} />) },
        { word: 'play', label: 'Play azul: exclusivo de Plus', icon: ic(<BluePlay size={40} />), accent: PLUS_SOFT },
        { word: 'solo', label: 'Sin Plus, solo un avance', icon: ic(<ClockIcon size={32} />) },
      ]}
      extra={
        frame >= fSiete - 10 ? (
          <div style={{ marginTop: 28, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 22, padding: '20px 32px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
            opacity: sCard, transform: `translateY(${((1 - sCard) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <Odometer text="7" at={fSiete - 6} size={84} color={PLUS_DEEP} spins={1} />
              <span style={{ fontSize: 38, color: PLUS_DEEP }}>min</span>
              <span style={{ fontSize: 34, color: color.ink2, marginLeft: 8 }}>de 1 h 03 min</span>
            </div>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="success" at={fDesc + 10} volume={0.35} />
          <Sfx name="hit_soft" at={fOjo} volume={0.45} />
          <Sfx name="tick_soft" at={fExcl} volume={0.5} />
          <Sfx name="ui_pop" at={fHora} volume={0.4} />
          <ChangeTicks value={(f) => odometerShown('7', fSiete - 6, fps, f)} from={fSiete - 6} to={fSiete + 30} volume={0.45} />
        </>
      } />
  );
};

// W07 · El reproductor (la hoja «Configuración»): velocidad de 0,5x a 3x, apagado automático de 0 a 120 minutos y, con Premium,
// «Potenciar volumen del audio» (se activa a los 20 s de la toma) y el modo coche (botones grandes; la velocidad pasa a 2x).
export const W07Reproductor: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('W07', w, n);
  const fRep = at('reproductor');
  const fMedia = at('media');
  const fTemp = at('temporizador');
  const fDos = at('dos');
  const fPremium = at('premium');
  const fPot = at('potenciar');
  const fModo = at('modo');
  const fBotones = at('botones');
  const s0: Shot = { rec: 'config_reproductor', at: 0, start: 8.0, hold: 19.4 };
  s0.marks = [markOn(s0, fMedia - 2, fTemp - 6, 92, 616, 500, 146, 18), markOn(s0, fTemp - 2, fPremium - 6, 92, 806, 500, 146, 18)];
  const s1 = align('config_reproductor', 20.0, fPot + 6, 30, { hold: 24.0 });
  s1.marks = [markOn(s1, fPot - 2, fModo - 6, 92, 552, 500, 50, 14)];
  // Modo coche: arranca a 1x y la velocidad pasa a 2x (≈18 s de la toma) con «botones grandes».
  const s2 = align('modo_coche', 17.6, fBotones + 4, 40, { hold: 28 });
  s2.marks = [markOn(s2, fModo + 2, p.dur + 20, 30, 872, 604, 460, 30)];
  const taps: Tap[] = [{ f: s1.at + Math.round((20.0 - s1.start) * 50) - 2, x: 520, y: 576 }, { f: s2.at + Math.round((17.9 - s2.start) * 50), x: 332, y: 1258 }];
  return (
    <AppFeatureScene {...p} id="W07" title="El reproductor" hi="reproductor" shots={[s0, s1, s2]} taps={taps} tagSize={40} tagGap={14}
      focusExtra={[{ from: fRep, to: fMedia - 6, y: 780, s: 1.08 }]}
      tags={[
        { word: 'media', label: 'De 0,5x a 3x', icon: ic(<SpeedIcon size={32} />) },
        { word: 'temporizador', label: 'Temporizador para dormir', sub: 'Hasta 2 horas', icon: ic(<MoonIcon size={32} />) },
        { word: 'potenciar', label: 'Potenciar el volumen', sub: 'Con Premium', icon: ic(<VolumeIcon size={32} />) },
        { word: 'modo', label: 'Modo coche', sub: 'Con Premium', icon: ic(<CarIcon size={32} />) },
      ]}
      overlay={<><Sfx name="tick_soft" at={fDos} volume={0.45} /><Sfx name="ui_pop" at={fPremium} volume={0.35} /></>} />
  );
};

// W08 · Radio en directo: la pestaña «Radios en directo», las nacionales (SER, COPE, Onda Cero, RNE…) y las locales y musicales.
export const W08Radio: React.FC<P> = (p) => {
  const at = (w: string, n = 0) => p.lead + wf('W08', w, n);
  const fRadio = at('radio');
  const fSer = at('ser');
  const fNacional = at('nacional');
  const fLocales = at('locales');
  const fMusicales = at('musicales');
  const s0: Shot = { rec: 'radios_tab', at: 0, start: 1.0, hold: 13 };
  s0.marks = [markOn(s0, fRadio - 2, fSer - 10, 400, 286, 200, 66, 20)];
  const s1: Shot = { rec: 'radios_nacionales', at: fSer - 8, start: 7.0, hold: 16 }; // la parrilla carga hacia los 6 s
  s1.marks = [markOn(s1, fSer - 2, fNacional - 6, 18, 212, 628, 244, 22), markOn(s1, fNacional - 4, fLocales - 8, 18, 518, 210, 276, 22)];
  const s2: Shot = { rec: 'radios_tab', at: fLocales - 8, start: 9.0, hold: 13 };
  s2.marks = [markOn(s2, fLocales - 2, fMusicales - 4, 18, 546, 312, 146, 18), markOn(s2, fMusicales - 2, p.dur + 20, 18, 870, 628, 440, 22)];
  return (
    <AppFeatureScene {...p} id="W08" title="Radio en directo" hi="directo" side="left" shots={[s0, s1, s2]} titleSize={100} tagSize={42} tagGap={18}
      tags={[
        { word: 'radio', label: 'La radio, en directo', icon: ic(<RadioIcon size={32} />) },
        { word: 'ser', label: 'SER · COPE · Onda Cero · RNE', icon: ic(<CheckIcon size={30} c={IV} />), accent: IV_SOFT },
        { word: 'locales', label: 'Locales y musicales', icon: ic(<HeadphonesIcon size={32} />) },
      ]}
      overlay={<><Sfx name="tick_soft" at={at('cope')} volume={0.35} /><Sfx name="tick_soft" at={at('onda')} volume={0.35} /><Sfx name="tick_soft" at={fNacional} volume={0.35} /></>} />
  );
};

// W09 · ¿Y los audiolibros? Sección propia con clásicos (Rimas de dentro de Unamuno, La casa Usher de Poe, el Quijote), pero muchos
// son de Plus: al darle al play sale «Escucha sin límites con iVoox Plus · Por solo 9,99 €/mes» y, sin pagar, un avance
// (Usher: 6:49 de 29:42; el Quijote se corta en 7:39). Un buen extra, no una plataforma de audiolibros.
export const W09Audiolibros: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('W09', w, n);
  const fSeccion = at('seccion');
  const fClasicos = at('clasicos');
  const fPoe = at('poe');
  const fUnamuno = at('unamuno');
  const fQuijote = at('quijote');
  const fExcl = at('exclusivos');
  const fPlay = at('play');
  const fSusc = at('suscribirte');
  const fSin = at('sin');
  const fPrimeros = at('primeros');
  const fExtra = at('extra');
  const fPlat = at('plataforma');
  const s0: Shot = { rec: 'audiolibros_2', at: 0, start: 3.6, hold: 16.5 };
  s0.marks = [markOn(s0, fSeccion - 2, fClasicos - 8, 0, 200, 664, 900, 20)];
  // Desplazada (desde 21 s de la toma): Rimas de dentro (Unamuno) arriba; Usher (Poe) y el Quijote en «Nuestra recomendación».
  const s1: Shot = { rec: 'audiolibros_2', at: fClasicos - 8, start: 22.0, hold: 29.5, fade: 8 };
  s1.marks = [markOn(s1, fPoe - 2, fUnamuno - 4, 278, 800, 244, 310, 22), markOn(s1, fUnamuno - 2, fQuijote - 4, 20, 364, 244, 286, 22), markOn(s1, fQuijote - 2, fExcl - 8, 538, 800, 126, 310, 22)];
  const s2: Shot = { rec: 'usher_ficha_2', at: fExcl - 8, start: 2.0, hold: 11 };
  s2.marks = [markOn(s2, fExcl - 2, fSusc - 10, 548, 700, 92, 280, 30)];
  const tapF = fPlay + 4;
  const s3: Shot = { rec: 'plus_oferta', at: tapF + 4, start: 3.2, hold: 22, fade: 4 }; // la oferta sale a los 3 s de la toma
  s3.marks = [markOn(s3, fSusc - 2, fSin - 6, 40, 214, 480, 186, 18)];
  const s4: Shot = { rec: 'usher_avance', at: fSin - 6, start: 4.0, hold: 15 };
  s4.marks = [markOn(s4, fPrimeros - 6, fExtra - 8, 22, 1186, 620, 58, 16)];
  const s5: Shot = { rec: 'quijote_avance', at: fExtra - 8, start: 36.0, hold: 49 };
  s5.marks = [markOn(s5, fExtra, p.dur + 20, 22, 1186, 620, 58, 16)];
  const taps: Tap[] = [{ f: tapF, x: 592, y: 746 }];
  const sCard = spring({ frame: frame - (fExtra - 6), fps, config: { damping: 14, stiffness: 170 } });
  const strike = interpolate(frame, [fPlat + 2, fPlat + 16], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AppFeatureScene {...p} id="W09" title="¿Y los audiolibros?" hi="audiolibros" shots={[s0, s1, s2, s3, s4, s5]} taps={taps} titleSize={92} tagSize={40} tagGap={14}
      tags={[
        { word: 'seccion', label: 'Tienen su propia sección', icon: ic(<BookIcon size={32} />) },
        { word: 'clasicos', label: 'Muchos clásicos', sub: 'Poe · Unamuno · el Quijote', icon: ic(<StarIcon size={32} />) },
        { word: 'exclusivos', label: 'Muchos, exclusivos de Plus', icon: ic(<Diamond size={34} />), accent: PLUS_SOFT },
        { word: 'sin', label: 'Sin pagar: los primeros minutos', icon: ic(<ClockIcon size={32} />) },
      ]}
      extra={
        frame >= fExtra - 8 ? (
          <div style={{ marginTop: 26, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 18, padding: '18px 30px', borderRadius: 26, background: color.ink, color: '#fff', boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 34, opacity: sCard, transform: `translateY(${((1 - sCard) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <Crown size={36} />
            <span>Un buen extra… <span style={{ position: 'relative', color: '#FFB79C', opacity: interpolate(frame, [fPlat - 6, fPlat], [0, 1], clamp) }}>
              no una plataforma de audiolibros
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 4, borderRadius: 2, background: IV, transform: `scaleX(${strike.toFixed(4)})`, transformOrigin: 'left center' }} />
            </span></span>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="tick_soft" at={fPoe} volume={0.45} />
          <Sfx name="tick_soft" at={fUnamuno} volume={0.45} />
          <Sfx name="tick_soft" at={fQuijote} volume={0.45} />
          <Sfx name="whoosh_soft" at={tapF + 4} volume={0.45} />
          <Sfx name="hit_soft" at={fSusc} volume={0.45} />
          <Sfx name="ui_pop" at={fExtra - 4} volume={0.6} />
        </>
      } />
  );
};

export { Crown, IV_DEEP, PLUS };

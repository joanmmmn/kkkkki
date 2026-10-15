import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { typeTimesSpoken } from '../../lib/typing';
import { ChangeTicks, Keystrokes, Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { CamKey, ScreenClip } from '../../components/ScreenClip';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, PhoneIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AppPhone, Burst, Chip, Crown, IV, IV_DEEP, IV_HOT, IV_INK, IV_SOFT, IvxLogo, IvxStage, LinkBadge, markOn, MaskTitle, Odometer, odometerShown, PhoneHalo, PhoneKey, Shot } from './kit';
import ms10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;

// X01 · «¿Quieres probar Premium? En su web, el primer mes es gratis»: la insignia naranja con la corona y «1 mes gratis»; debajo,
// ivoox.com.
export const X01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X01', w, n);
  const fPrem = at('premium');
  const fWeb = at('web');
  const fPrimer = at('primer');
  const fGratis = at('gratis');
  const LAND = fGratis + 4;
  const badgeAt = fPrimer - 10;
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 150 } });
  const sWeb = spring({ frame: frame - fWeb + 4, fps, config: { damping: 13, stiffness: 180 } });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  const word = interpolate(frame, [fGratis - 4, fGratis + 6], [0, 1], { ...clamp, easing: easeOut });
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 96, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30).toFixed(2)}px)` }}>
          <IvxLogo width={260} />
        </div>
        {frame < badgeAt + 4 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
            <MaskTitle text="¿Quieres probar Premium?" hi="Premium" at={lead - 4} size={112} align="center" out={badgeAt - 2} />
          </div>
        )}
        <div style={{ position: 'relative', width: 560, height: 560, marginTop: 30, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={IV} opacity={0.16} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 72, borderRadius: '50%', background: `linear-gradient(160deg, ${IV_HOT} 0%, ${IV} 100%)`, boxShadow: '0 40px 100px rgba(244,95,49,0.45)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={74} style={{ filter: 'brightness(0) invert(1)', marginBottom: 6 }} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -7, lineHeight: 0.9, color: '#fff' }}>1 mes</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: -1, marginTop: 6, opacity: word, transform: `translateY(${((1 - word) * 16).toFixed(2)}px)` }}>gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={960} y={570} r={210} seed="x01" colors={[IV, color.yellow, IV_HOT, '#101010']} />
        <div style={{ position: 'absolute', bottom: 92, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 30).toFixed(2)}px) scale(${(0.86 + 0.14 * sWeb).toFixed(4)})` }}>
          <GlobeIcon size={44} /> ivoox.com
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fPrem} volume={0.6} />
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND - 4} volume={0.6} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.7} />
    </IvxStage>
  );
};

// X02 · Elige el plan (la página de Premium de ivoox.com, desde España: mensual seleccionado y luego el anual) y, al acabar el mes
// gratis, se renueva solo: 3,99 €/mes o 39,90 €/año. A la izquierda, la línea de tiempo: mes 1 gratis y después, el cobro.
export const X02Plan: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X02', w, n);
  const fMensual = at('mensual');
  const fAnual = at('anual');
  const fAcabar = at('acabar');
  const fRenueva = at('renueva');
  const fTres = at('tres');
  const fTreinta = at('treinta');
  const s0: Shot = { rec: 'web_premium', at: 0, start: 24.0, hold: 35 };
  s0.marks = [markOn(s0, fMensual - 4, fAnual - 6, 22, 896, 620, 204, 26)];
  const s1: Shot = { rec: 'web_premium', at: fAnual - 6, start: 13.0, hold: 21.4, fade: 6 };
  s1.marks = [markOn(s1, fAnual - 2, fTres - 8, 22, 672, 620, 208, 26)];
  const s2: Shot = { rec: 'web_premium', at: fTres - 8, start: 26.0, hold: 35, fade: 6 };
  s2.marks = [markOn(s2, fTres - 2, fTreinta - 6, 22, 896, 620, 204, 26)];
  const s3: Shot = { rec: 'web_premium', at: fTreinta - 6, start: 15.0, hold: 21.4, fade: 6 };
  s3.marks = [markOn(s3, fTreinta - 2, dur + 20, 22, 672, 620, 208, 26)];
  const cam: PhoneKey[] = [{ f: 0, rx: 8, ry: 26, rz: -3, s: 0.92, x: 60, y: 40 }, { f: 24, rx: 2, ry: 9, rz: 0, s: 1, x: 0, y: 0 }, { f: dur, rx: 1.5, ry: 6, rz: 0, s: 1.02, x: 0, y: -6 }];
  const sTitle = spring({ frame: frame - (fAcabar - 10), fps, config: { damping: 15, stiffness: 160 } });
  const months = [0, 1, 2, 3];
  const sM = (i: number) => spring({ frame: frame - (fAcabar - 4 + i * 6), fps, config: { damping: 13, stiffness: 200 } });
  const fill = interpolate(frame, [fRenueva - 4, fRenueva + 20], [0, 1], { ...clamp, easing: easeInOut });
  const sYear = spring({ frame: frame - (fTreinta - 4), fps, config: { damping: 13, stiffness: 180 } });
  // «Desde el mes 2» entra con «se renueva»; hasta que la voz dice el precio, la cifra queda en blanco («–,––»), nunca «0,00».
  const sPay = spring({ frame: frame - (fRenueva - 6), fps, config: { damping: 15, stiffness: 160 } });
  return (
    <IvxStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={1400} cy={540} strength={0.9} />
        <div style={{ position: 'absolute', left: 1400 - 215, top: 70 }}>
          <AppPhone shots={[s0, s1, s2, s3]} w={430} cam={cam} dim={0.62} float={[20, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 960, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Chip at={fMensual - 3} dimAt={fAnual - 3} label="Plan mensual" icon={<CalendarIcon size={30} />} size={38} reserve />
            <Chip at={fAnual - 3} dimAt={fAcabar - 3} label="O el anual" icon={<CalendarIcon size={30} />} size={38} reserve />
          </div>
          <div style={{ marginTop: 50, opacity: sTitle, transform: `translateY(${((1 - sTitle) * 30).toFixed(2)}px)` }}>
            <MaskTitle text="Después, se renueva solo" hi="solo" at={fAcabar - 8} size={78} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
            {months.map((i) => {
              const s = sM(i);
              const free = i === 0;
              const paid = !free && fill > (i - 1) / 3;
              return (
                <div key={i} style={{ width: 190, height: 150, borderRadius: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: free ? '#E3F5EA' : paid ? IV_SOFT : '#F4F4F4', border: `2px solid ${free ? 'rgba(31,157,85,0.4)' : paid ? 'rgba(244,95,49,0.45)' : 'transparent'}`,
                  opacity: Math.min(1, s * 1.5), transform: `translateY(${((1 - s) * 30).toFixed(2)}px) scale(${(0.8 + 0.2 * s).toFixed(4)})`, fontFamily: font.sans, fontWeight: 700 }}>
                  <span style={{ fontSize: 26, color: color.ink2 }}>Mes {i + 1}</span>
                  <span style={{ fontSize: free ? 40 : 38, color: free ? color.green : paid ? IV_DEEP : color.muted }}>{free ? 'Gratis' : paid ? '3,99 €' : '—'}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 44, fontFamily: font.sans, fontWeight: 700, color: color.ink,
            opacity: sPay, transform: `translateY(${((1 - sPay) * 24).toFixed(2)}px)` }}>
            <span style={{ fontSize: 40, color: color.ink2 }}>Desde el mes 2:</span>
            {frame >= fTres - 6 ? <Odometer text="3,99" at={fTres - 6} size={84} color={IV_DEEP} style={{ letterSpacing: -3 }} /> : <span style={{ fontSize: 84, color: '#E2E2E2' }}>–,––</span>}
            <span style={{ fontSize: 40, color: IV_DEEP }}>€/mes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink2,
            opacity: sYear, transform: `translateX(${((1 - sYear) * -20).toFixed(2)}px)` }}>
            o <span style={{ color: color.ink }}>39,90 €</span> al año con el plan anual
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="ui_pop" at={fMensual - 2} volume={0.6} />
      <Sfx name="ui_tap" at={fAnual - 2} volume={0.5} />
      {months.map((i) => <Sfx key={i} name="tick_soft" at={fAcabar - 2 + i * 6} volume={0.5} />)}
      <Sfx name="hit_soft" at={fRenueva} volume={0.5} />
      <ChangeTicks value={(f) => odometerShown('3,99', fTres - 6, fps, f)} from={fTres - 6} to={fTres + 30} volume={0.45} />
      <Sfx name="coins" at={fTres + 22} volume={0.35} />
      <Sfx name="ui_pop" at={fTreinta - 2} volume={0.6} />
    </IvxStage>
  );
};

// X03 · Darse de baja. En la web: tu cuenta → «Servicios contratados» → «Dar de baja», al menos un día antes de la renovación. En la
// app: Ajustes («Cancelar servicio premium», captura real, sin pulsarlo). Si pagaste en Google Play o en la App Store, en la tienda.
// Sigues con Premium hasta que acaba lo pagado.
export const X03Baja: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X03', w, n);
  const fBaja = at('baja');
  const fWeb = at('web');
  const fCuenta = at('cuenta');
  const fServ = at('servicios');
  const fDar = at('dar', 1); // «Dar de baja» (la primera es «darte»)
  const fMenos = at('menos');
  const fApp = at('app');
  const fAjustes = at('ajustes');
  const fGoogle = at('google');
  const fStore = at('store');
  const fTienda = at('tienda');
  const fSeguiras = at('seguiras');
  const fPagaste = at('pagaste', 1);
  const sTitle = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 160 } });
  const sStep = (f: number) => spring({ frame: frame - f, fps, config: { damping: 13, stiffness: 190 } });
  const sDay = spring({ frame: frame - (fMenos - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sStore = spring({ frame: frame - (fGoogle - 6), fps, config: { damping: 14, stiffness: 170 } });
  const sStore2 = spring({ frame: frame - (fStore - 4), fps, config: { damping: 14, stiffness: 170 } });
  const sTienda = spring({ frame: frame - (fTienda - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sKeep = spring({ frame: frame - (fSeguiras - 6), fps, config: { damping: 14, stiffness: 160 } });
  const keepBar = interpolate(frame, [fSeguiras, fPagaste + 10], [0, 1], { ...clamp, easing: easeInOut });
  // Móvil con los Ajustes de la app (ya desplazados: el nombre de la cuenta no sale).
  const s0: Shot = { rec: 'ajustes_cancelar', at: 0, start: 1.0, hold: 13 };
  s0.marks = [markOn(s0, fAjustes - 2, dur + 20, 18, 612, 640, 96, 20)];
  const phoneIn = spring({ frame: frame - (fApp - 8), fps, config: { damping: 16, stiffness: 140 } });
  const cam: PhoneKey[] = [{ f: 0, rx: 4, ry: -14, rz: 2, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -9, rz: 0.5, s: 1.03, x: 0, y: -6 }];
  const step = (f: number, n: number, label: string, last = false) => {
    const s = sStep(f);
    return (
      <React.Fragment key={label}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px 14px 14px', borderRadius: 999, background: last ? IV : '#fff', color: last ? '#fff' : color.ink, border: last ? 'none' : `1px solid ${color.line}`,
          boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', opacity: s, transform: `translateY(${((1 - s) * 20).toFixed(2)}px) scale(${(0.85 + 0.15 * s).toFixed(4)})` }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: last ? 'rgba(255,255,255,0.25)' : IV_SOFT, color: last ? '#fff' : IV_DEEP, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{n}</span>
          {label}
        </div>
        {!last && <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.muted, opacity: sStep(f + 8) }}>→</span>}
      </React.Fragment>
    );
  };
  const box: React.CSSProperties = { padding: '28px 34px', borderRadius: 36, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, boxSizing: 'border-box', width: 1180 };
  const head = (icon: React.ReactNode, text: string, s: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: s }}>
      <span style={{ width: 54, height: 54, borderRadius: 16, background: IV_INK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>{text}
    </div>
  );
  return (
    <IvxStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 110, top: 70, opacity: sTitle, transform: `translateY(${((1 - sTitle) * 24).toFixed(2)}px)` }}>
          <MaskTitle text="Cómo darte de baja" hi="baja" at={fBaja - 14} size={84} />
        </div>
        <div style={{ position: 'absolute', left: 110, top: 210, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Web */}
          <div style={{ ...box, opacity: sStep(fWeb - 6), transform: `translateY(${((1 - sStep(fWeb - 6)) * 30).toFixed(2)}px)` }}>
            {head(<GlobeIcon size={34} c="#fff" />, 'En la web, ivoox.com', 1)}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'nowrap' }}>
              {step(fCuenta - 4, 1, 'Tu cuenta')}
              {step(fServ - 4, 2, '«Servicios contratados»')}
              {step(fDar - 4, 3, '«Dar de baja»', true)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: IV_DEEP, opacity: sDay, transform: `translateX(${((1 - sDay) * -20).toFixed(2)}px)` }}>
              <CalendarIcon size={36} c={IV_DEEP} /> Al menos 1 día antes de la renovación
            </div>
          </div>
          {/* App y tiendas */}
          <div style={{ display: 'flex', gap: 22 }}>
            <div style={{ ...box, width: 420, opacity: sStep(fApp - 6), transform: `translateY(${((1 - sStep(fApp - 6)) * 30).toFixed(2)}px)` }}>
              {head(<PhoneIcon size={34} c="#fff" />, 'En la app', 1)}
              <div style={{ marginTop: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sStep(fAjustes - 4) }}>Ajustes →</div>
              <div style={{ marginTop: 6, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: IV_DEEP, opacity: sStep(fAjustes + 4) }}>«Cancelar servicio premium»</div>
            </div>
            <div style={{ ...box, width: 738, opacity: sStore, transform: `translateY(${((1 - sStore) * 30).toFixed(2)}px)` }}>
              {head(<CardIcon size={34} c="#fff" />, 'Si pagaste en una tienda', 1)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
                <div style={{ padding: '12px 24px', borderRadius: 18, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>Google Play</div>
                <div style={{ padding: '12px 24px', borderRadius: 18, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30, opacity: sStore2 }}>App Store</div>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2, opacity: sTienda }}>→ Suscripciones</span>
              </div>
            </div>
          </div>
          {/* Sigues con Premium hasta el final de lo pagado */}
          <div style={{ ...box, display: 'flex', alignItems: 'center', gap: 22, background: '#E9F7EF', border: '2px solid rgba(31,157,85,0.3)', opacity: sKeep, transform: `translateY(${((1 - sKeep) * 30).toFixed(2)}px)` }}>
            <CheckIcon size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>Sigues con Premium hasta que acaba lo que ya pagaste</div>
              <div style={{ position: 'relative', height: 14, borderRadius: 7, background: 'rgba(31,157,85,0.18)', marginTop: 14, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(100 * keepBar).toFixed(1)}%`, borderRadius: 7, background: color.green }} />
              </div>
            </div>
          </div>
        </div>
        {/* Móvil: Ajustes de la app */}
        {frame >= fApp - 10 && (
          <div style={{ position: 'absolute', left: 1450, top: 150, opacity: Math.min(1, phoneIn * 1.4), transform: `translateX(${((1 - phoneIn) * 200).toFixed(2)}px)` }}>
            <PhoneHalo cam={cam} cx={1640} cy={540} strength={0.7} />
            <AppPhone shots={[s0]} w={360} cam={cam} dim={0.6} />
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="ui_pop" at={fWeb - 4} volume={0.6} />
      <Sfx name="snap_in" at={fCuenta - 2} volume={0.6} />
      <Sfx name="snap_in" at={fServ - 2} volume={0.6} />
      <Sfx name="click" at={fDar} volume={0.8} />
      <Sfx name="tick_soft" at={fMenos} volume={0.6} />
      <Sfx name="whoosh_soft" at={fApp - 8} volume={0.6} />
      <Sfx name="ui_pop" at={fAjustes - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fGoogle - 4} volume={0.6} />
      <Sfx name="ui_pop" at={fStore - 2} volume={0.5} />
      <Sfx name="success" at={fSeguiras + 4} volume={0.5} />
    </IvxStage>
  );
};

// X04 · ¿Buscas audiolibros? En SonorBooks comparas precio, horas y días gratis (la comparativa de plataformas, grabación real) y
// la reseña completa por escrito, en la descripción.
export const X04Compara: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X04', w, n);
  const fBuscas = at('buscas');
  const fSonor = at('sonorbooks');
  const fPrecio = at('precio');
  const fHoras = at('horas');
  const fDias = at('dias');
  const fDesc = at('descripcion');
  const fResena = at('resena');
  const W = 1400;
  const sWin = spring({ frame: frame - (fSonor - 10), fps, config: { damping: 18, stiffness: 120 } });
  const sQ = spring({ frame: frame - fBuscas, fps, config: { damping: 15, stiffness: 160 } });
  const qOut = interpolate(frame, [fSonor - 12, fSonor], [0, 1], { ...clamp, easing: easeInOut });
  // La comparativa baja de arriba abajo, acelerada (la grabación tarda 38 s en recorrerla).
  const rate = 7.5;
  const cam: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fPrecio - fSonor, zoom: 1.12, x: 760, y: 560 }, { f: fDias - fSonor + 20, zoom: 1.1, x: 960, y: 560 }];
  const shrink = interpolate(frame, [fDesc - 10, fDesc + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <IvxStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Buscas audiolibros?" hi="audiolibros" at={2} size={104} align="center" />
          </div>
        )}
        {frame >= fSonor - 12 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 120, opacity: sWin, transform: `translateY(${((1 - sWin) * 80 - 60 * shrink).toFixed(2)}px) scale(${((0.94 + 0.06 * sWin) * (1 - 0.12 * shrink)).toFixed(4)})`, transformOrigin: '50% 0%' }}>
            <TiltWindow width={W} url="sonorbooks.com/es/plataformas" ry={-3} rx={2}>
              <Sequence from={fSonor - 10} layout="none">
                <ScreenClip src="str/web/10_sb_plataformas/video.mp4" width={W} startAt={Math.max(0, ms10.marks.scroll - 0.6)} playbackRate={rate} showCursor={false} camera={cam} />
              </Sequence>
            </TiltWindow>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 10 }}>
          <Chip at={fPrecio - 3} dimAt={fDesc - 3} label="Precio" icon={<CardIcon size={30} />} size={34} reserve />
          <Chip at={fHoras - 3} dimAt={fDesc - 3} label="Horas" icon={<ClockIcon size={30} />} size={34} reserve />
          <Chip at={fDias - 3} dimAt={fDesc - 3} label="Días gratis" icon={<CalendarIcon size={30} />} size={34} reserve />
          <LinkBadge at={fDesc - 3} label="En la descripción" size={34} reserve />
          <Chip at={fResena - 3} label="Reseña completa por escrito" icon={<DocIcon size={30} />} size={34} reserve />
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fBuscas} volume={0.6} />
      <Sfx name="whoosh_soft" at={fSonor - 10} volume={0.7} />
      <Sfx name="ui_pop" at={fPrecio - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fHoras - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDias - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDesc - 1} volume={0.8} />
      <Sfx name="sparkle" at={fResena - 2} volume={0.8} />
    </IvxStage>
  );
};

// X05 · Cierre de marca con espacio libre para la pantalla final de YouTube (sin aviso de afiliado: iVoox no está en SonorBooks y
// este vídeo no lleva enlaces de afiliado).
export const X05Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X05', w, n);
  const fDonde = at('donde');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fSonor = at('sonorbooks');
  const fEn = fSonor - 6; // «en» va justo antes de «SonorBooks» (buscar «en» daría con «Encuentra»)
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fEn - 4]], 'x05');
  const end = fSonor + 34;
  return (
    <IvxStage>
      <Phase from={0} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text={query} times={keys} placeholder="Busca un libro" />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fDonde, fps }) }}>Dónde escucharlo, y a qué precio</div>
        </AbsoluteFill>
      </Phase>
      <Phase from={end} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 190, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - end - 30, fps }) }}><Pill size={40}>sonorbooks.com</Pill></div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="logo_sting" at={4} />
      <Keystrokes text={query} times={keys} volume={0.9} seed="x05" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </IvxStage>
  );
};

export { CrossIcon, Easing, UserIcon };

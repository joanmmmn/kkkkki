import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon, BookIcon } from '../../components/Icons';
import { ClockIcon, GlobeIcon, InfinityIcon, PhoneIcon, TabletIcon, UserIcon } from '../../components/Icons2';
import { NextoryLogo } from '../nx/common';
import { wf } from './timeline';
import { AppPhone, BigTitle, CountUp, FeatureTag } from './kit';

type P = { lead: number; dur: number };
const useSpring = (at: number, damping = 16, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

// R01 · Gancho: el móvil entra girando con la app; a la izquierda la pregunta y lo que vas a ver.
export const R01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('R01', w, n);
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fGratis = at('treinta');
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', right: 250, top: 70 }}>
          <AppPhone rec="01_inicio" startAt={0.5} w={410}
            cam={[{ f: 0, rx: 14, ry: -38, rz: 6, s: 0.86, x: 120, y: 60 }, { f: 34, rx: 4, ry: -16, rz: 2, s: 1, x: 0, y: 0 }, { f: dur, rx: 3, ry: -11, rz: 1.5, s: 1.02, x: -6, y: -4 }]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 250, width: 900 }}>
          <NextoryLogo width={250} style={{ marginBottom: 34, opacity: useSpring(lead) }} />
          <BigTitle text="¿Merece la pena Nextory?" hi="Nextory?" at={lead + 2} size={118} />
          <div style={{ display: 'flex', gap: 18, marginTop: 56, flexWrap: 'wrap' }}>
            <FeatureTag at={fBueno} icon={<CheckIcon size={30} c={color.green} />} size={34}>Lo bueno</FeatureTag>
            <FeatureTag at={fMalo} icon={<CrossIcon size={30} />} size={34}>Lo malo</FeatureTag>
            <FeatureTag at={fGratis} size={34} dark>30 días gratis</FeatureTag>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_deep" at={4} />
      <Sfx name="ui_pop" at={fBueno} />
      <Sfx name="ui_pop" at={fMalo} />
      <Sfx name="sparkle" at={fGratis} />
    </Stage>
  );
};

// R02 · Qué es: marca, catálogo, formatos, el relevo de Nubico y en qué dispositivos funciona.
export const R02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('R02', w, n);
  const fMillon = at('millon');
  const fAudio = at('audiolibros');
  const fEbooks = at('ebooks');
  const fIdiomas = at('idiomas');
  const fNubico = at('nubico');
  const fMovil = at('movil');
  const fWeb = at('web');
  // Tres fases que se relevan con un fundido: A (marca y catálogo), B (Nubico → Nextory) y C (dispositivos).
  const xA = interpolate(frame, [fNubico - 12, fNubico + 2], [0, 1], { ...clamp, easing: easeInOut });
  const xB = interpolate(frame, [fMovil - 12, fMovil + 2], [0, 1], { ...clamp, easing: easeInOut });
  const sLogo = useSpring(lead);
  const sNub = useSpring(fNubico);
  const strike = interpolate(frame, [fNubico + 14, fNubico + 30], [0, 1], { ...clamp, easing: easeOut });
  const sMovil = useSpring(fMovil);
  const sWeb = useSpring(fWeb, 12, 200);
  const formats = [
    { f: fAudio, icon: <HeadphonesIcon size={46} />, label: 'Audiolibros' },
    { f: fEbooks, icon: <BookIcon size={46} />, label: 'Ebooks' },
    { f: fIdiomas, icon: <GlobeIcon size={46} />, label: 'Varios idiomas' },
  ];
  return (
    <Stage tone="warm">
      {/* Fase A: marca, catálogo y formatos */}
      {xA < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - xA, transform: `translateY(${-xA * 60}px) scale(${1 - 0.06 * xA})`, filter: xA > 0 ? `blur(${xA * 10}px)` : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: sLogo, transform: `translateY(${(1 - sLogo) * 30}px)` }}>
            <NextoryLogo width={320} />
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.muted, borderLeft: `2px solid ${color.line}`, paddingLeft: 26 }}>Estocolmo · desde 2015</div>
          </div>
          <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 700, fontSize: 170, letterSpacing: -7, color: color.ink, opacity: useSpring(fMillon - 6) }}>
            +<CountUp to={1.4} decimals={1} from={fMillon - 6} dur={34} suffix=" M" />
            <span style={{ fontSize: 58, letterSpacing: -1, color: color.ink2, marginLeft: 18 }}>títulos</span>
          </div>
          <div style={{ display: 'flex', gap: 26, marginTop: 34 }}>
            {formats.map((x) => (
              <FeatureTag key={x.label} at={x.f} icon={x.icon} size={40} from="up" reserve>{x.label}</FeatureTag>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {/* Bloque 2: Nubico → Nextory */}
      {frame >= fNubico - 14 && xB < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: sNub * (1 - xB), transform: `translateY(${-xB * 60}px) scale(${1.25 - 0.06 * xB})`, filter: xB > 0 ? `blur(${xB * 10}px)` : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '30px 48px', background: '#fff', borderRadius: 32, boxShadow: shadow.card, border: `1px solid ${color.line}`, transform: `scale(${0.9 + 0.1 * sNub})` }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, color: color.muted, fontWeight: 500, marginRight: 6 }}>En España</div>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: '#9AA0A6' }}>
              Nubico
              <div style={{ position: 'absolute', left: -6, right: -6, top: '52%', height: 6, background: color.red, borderRadius: 3, transform: `scaleX(${strike})`, transformOrigin: 'left' }} />
            </div>
            <svg width="90" height="40" viewBox="0 0 90 40"><path d={`M4 20 H ${4 + 70 * strike}`} stroke={color.ink} strokeWidth="5" strokeLinecap="round" /><path d="M66 8 L80 20 L66 32" stroke={color.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={strike} /></svg>
            <NextoryLogo width={230} style={{ opacity: strike }} />
            <div style={{ fontFamily: font.sans, fontSize: 26, color: color.muted, fontWeight: 500, maxWidth: 220, lineHeight: 1.2 }}>el servicio de lectura de Movistar</div>
          </div>
        </AbsoluteFill>
      )}
      {/* Bloque 3: dispositivos */}
      {frame >= fMovil - 12 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 44, opacity: sMovil, transform: `translateY(${(1 - sMovil) * 60}px) scale(1.25)` }}>
            {[{ i: <PhoneIcon size={84} />, l: 'Móvil', ok: true }, { i: <TabletIcon size={84} />, l: 'Tablet', ok: true }, { i: <GlobeIcon size={84} />, l: 'Web', ok: false }].map((d, k) => {
              const s = d.ok ? 1 : sWeb;
              return (
                <div key={d.l} style={{ width: 250, height: 250, borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, position: 'relative',
                  opacity: d.ok ? 1 : 0.35 + 0.65 * s, filter: d.ok ? undefined : `grayscale(${s})`, transform: `translateY(${k * 0})` }}>
                  {d.i}
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>{d.l}</div>
                  <div style={{ position: 'absolute', top: -18, right: -18, transform: `scale(${d.ok ? spring({ frame: frame - fMovil - 8 - k * 5, fps: 50, config: { damping: 12, stiffness: 200 } }) : s})` }}>
                    {d.ok ? <CheckIcon size={64} /> : <CrossIcon size={64} />}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="counter" at={fMillon - 6} />
      {formats.map((x) => <Sfx key={x.label} name="ui_pop" at={x.f} />)}
      <Sfx name="whoosh_soft" at={fNubico - 4} />
      <Sfx name="pencil_strike" at={fNubico + 14} />
      <Sfx name="snap_in" at={fMovil} />
      <Sfx name="cross" at={fWeb} />
    </Stage>
  );
};

// R03 · Planes: tres tarjetas con precio, horas y perfiles a la vez.
export const R03Planes: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('R03', w, n);
  const fMini = at('mini');
  const fStd = at('standard');
  const fUnl = at('unlimited');
  const fOjo = at('ojo');
  const fPerfiles = at('perfiles');
  const fVez = at('vez');
  const plans = [
    { name: 'Mini', price: 5.99, hours: '10 h', fill: 10 / 30, f: fMini, sim: 1 },
    { name: 'Standard', price: 7.99, hours: '30 h', fill: 1, f: fStd, sim: 1 },
    { name: 'Unlimited', price: 9.99, hours: 'Sin límite', fill: -1, f: fUnl, sim: 4, from: true },
  ];
  const sOjo = spring({ frame: frame - fOjo, fps: 50, config: { damping: 16, stiffness: 160 } });
  const up = interpolate(frame, [fOjo - 8, fOjo + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${-up * 60}px) scale(1.12)` }}>
        <div style={{ display: 'flex', gap: 40 }}>
          {plans.map((p, i) => {
            const s = spring({ frame: frame - p.f + 4, fps: 50, config: { damping: 15, stiffness: 150 } });
            const bar = interpolate(frame, [p.f + 4, p.f + 30], [0, 1], { ...clamp, easing: easeOut });
            const hot = p.name === 'Unlimited';
            return (
              <div key={p.name} style={{ width: 430, padding: '40px 40px 34px', borderRadius: 40, background: hot ? color.ink : '#fff', color: hot ? '#fff' : color.ink, boxShadow: shadow.card, border: hot ? 'none' : `1px solid ${color.line}`,
                opacity: s, transform: `translateY(${(1 - s) * 80}px) scale(${0.92 + 0.08 * s})`, filter: `blur(${(1 - s) * 8}px)` }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: -1 }}>{p.name}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, letterSpacing: -4, marginTop: 14, color: hot ? color.yellow : color.ink, lineHeight: 1 }}>
                  {p.from && <span style={{ fontSize: 30, letterSpacing: 0, fontWeight: 500, marginRight: 10, color: 'rgba(255,255,255,0.7)' }}>desde</span>}
                  <CountUp to={p.price} decimals={2} from={p.f} dur={22} />
                  <span style={{ fontSize: 40, letterSpacing: -1 }}> €</span>
                </div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: hot ? 'rgba(255,255,255,0.65)' : color.muted, marginTop: 6 }}>al mes</div>
                {/* horas */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30 }}>
                  {p.fill < 0 ? <InfinityIcon size={50} c={color.yellow} /> : <ClockIcon size={44} c={hot ? '#fff' : color.ink} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34 }}>{p.hours}</div>
                    {p.fill >= 0 && (
                      <div style={{ height: 10, borderRadius: 5, background: hot ? 'rgba(255,255,255,0.18)' : '#EEE', marginTop: 8, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.fill * bar * 100}%`, background: color.yellow, borderRadius: 5 }} />
                      </div>
                    )}
                  </div>
                </div>
                {/* perfiles */}
                <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${hot ? 'rgba(255,255,255,0.15)' : color.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {[0, 1, 2, 3].map((k) => {
                    const lit = interpolate(frame, [fVez + k * 4, fVez + k * 4 + 10], [0, 1], clamp);
                    const on = k < p.sim ? Math.max(interpolate(frame, [fPerfiles, fPerfiles + 10], [0, 1], clamp) * (k === 0 ? 1 : 0), lit) : 0;
                    const shown = interpolate(frame, [fPerfiles + k * 3, fPerfiles + k * 3 + 10], [0, 1], clamp);
                    return (
                      <div key={k} style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: shown,
                        background: on > 0.5 ? color.yellow : hot ? 'rgba(255,255,255,0.1)' : '#F2F2F2', transform: `scale(${0.8 + 0.2 * shown})` }}>
                        <UserIcon size={30} c={on > 0.5 ? color.ink : hot ? 'rgba(255,255,255,0.45)' : '#B5B5B5'} />
                      </div>
                    );
                  })}
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, marginLeft: 8, opacity: interpolate(frame, [fVez, fVez + 12], [0, 1], clamp), color: hot ? color.yellow : color.ink2 }}>
                    {p.sim === 1 ? '1 a la vez' : 'hasta 4 a la vez'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* «Ojo»: las horas cuentan igual leyendo que escuchando */}
      {frame >= fOjo - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '18px 34px', borderRadius: 999, background: color.yellow, boxShadow: '0 16px 40px rgba(255,202,5,0.35)', fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink,
            opacity: sOjo * interpolate(frame, [fPerfiles - 6, fPerfiles + 4], [1, 0], clamp), transform: `translateY(${(1 - sOjo) * 40}px)` }}>
            <BookIcon size={44} /> <span>+</span> <HeadphonesIcon size={44} /> <span>= las mismas horas</span>
          </div>
        </AbsoluteFill>
      )}
      {plans.map((p) => <Sfx key={p.name} name="card_flip" at={p.f} />)}
      <Sfx name="hit_soft" at={fOjo} />
      <Sfx name="tick_soft" at={fVez} />
    </Stage>
  );
};

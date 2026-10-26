import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { Kicker } from '../nxr/App';
import { LinkBadge } from '../nxr/kit';
import { wf } from './timeline';
import { color, font, MaskTitle, MpStage, PKey, PlatTile, SceneProps, shadow, Stamp, StepList, ToneChip } from './kit';

type P = SceneProps;
export const EIGHT: PKey[] = ['audible', 'storytel', 'spotify', 'podimo', 'nextory', 'bookbeat', 'audiobooks', 'ivoox'];

// X01 · Gancho: «¿No encuentras el botón?» y las ocho suscripciones canceladas de verdad, con lo que trae el vídeo.
export const X01Hook: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (x: string, n = 0) => lead + wf('X01', x, n);
  const fHemos = w('Hemos'), fCanc = w('cancelado'), fOcho = w('ocho'), fUna = w('una', 1), fDonde = w('dónde'), fOfertas = w('ofertas'), fPierdes = w('pierdes');
  const aOut = fHemos - 6;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const stampAt = (i: number) => fOcho + 2 + i * Math.max(5, Math.round((fUna + 16 - fOcho) / 8));
  return (
    <MpStage>
      {/* 1 · La pregunta */}
      <Phase from={0} to={aOut} out={10} noIn>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60 }}>
          <MaskTitle text={'¿No encuentras el botón\nde cancelar?'} hi="cancelar?" at={lead - 10} size={112} align="center" />
          <div style={{ display: 'flex', gap: 22, opacity: interpolate(frame, [lead + 30, lead + 50], [0, 1], clamp) }}>
            {['Ajustes', 'Cuenta', 'Suscripción', '¿Cancelar?'].map((t, i) => (
              <div key={t} style={{ padding: '18px 34px', borderRadius: 999, background: i === 3 ? 'rgba(229,72,77,0.08)' : '#fff', border: `2px dashed ${i === 3 ? '#E5484D' : color.line}`, boxShadow: i === 3 ? 'none' : shadow.soft,
                fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: i === 3 ? '#E5484D' : color.ink2, opacity: i === 3 ? 0.5 + 0.5 * pulse : 1,
                transform: `translateY(${Math.sin((frame + i * 9) / 11) * 5}px)` }}>{t}</div>
            ))}
          </div>
        </AbsoluteFill>
      </Phase>
      {/* 2 · Ocho suscripciones, canceladas de verdad */}
      <Phase from={aOut - 2} to={dur + 2} out={1}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 130, top: 120 }}>
            <Kicker at={4} text="Lo hemos hecho de verdad" />
            <MaskTitle text={'8 suscripciones,\ncanceladas una a una'} hi="canceladas" at={6} size={84} />
          </div>
          <div style={{ position: 'absolute', left: 130, top: 470, display: 'grid', gridTemplateColumns: 'repeat(4, 156px)', columnGap: 64, rowGap: 40 }}>
            {EIGHT.map((k, i) => {
              const s = spring({ frame: frame - fCanc - i * 3, fps, config: { damping: 13, stiffness: 190 } });
              return (
                <div key={k} style={{ position: 'relative', opacity: frame < fCanc - 1 ? 0 : s, transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + 0.2 * s})` }}>
                  <PlatTile k={k} size={156} />
                  <div style={{ position: 'absolute', left: 58, top: 86, width: 130, height: 130 }}><Stamp at={stampAt(i) - aOut} size={130} /></div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 1080, top: 400, display: 'flex', flexDirection: 'column', gap: 30 }}>
            <ToneChip at={fDonde - aOut - 3} tone="info" label="Dónde está el botón" sub="App por app, paso a paso" size={44} />
            <ToneChip at={fOfertas - aOut - 3} tone="price" label="Las ofertas para que te quedes" sub="Y cómo seguir sin aceptarlas" size={44} />
            <ToneChip at={fPierdes - aOut - 3} tone="warn" label="Qué pierdes al cancelar" sub="Sobre todo, en la prueba gratis" size={44} />
          </div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="whoosh_soft" at={lead - 10} volume={0.5} />
      <Sfx name="whoosh_soft" at={aOut} volume={0.55} />
      {EIGHT.map((_, i) => <Sfx key={i} name="stamp" at={stampAt(i) + 2} volume={0.45} />)}
      <Sfx name="ui_pop" at={fDonde - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fOfertas - 2} volume={0.6} />
      <Sfx name="tick_soft" at={fPierdes - 2} volume={0.6} />
    </MpStage>
  );
};

const PathCard: React.FC<{ at: number; title: string; sub: string; icon: React.ReactNode; steps: { at: number; label: string }[]; x: number }> = ({ at, title, sub, icon, steps, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: 380, width: 780, padding: '40px 46px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted }}>{sub}</div>
        </div>
      </div>
      <StepList steps={steps} size={34} width={690} gap={8} />
    </div>
  );
};
const PlayIcon = () => (<svg width="38" height="38" viewBox="0 0 24 24"><path d="M6 3.5v17l14-8.5z" fill={color.yellow} /></svg>);
const GearIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color.yellow} strokeWidth={2.2}><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" strokeLinecap="round" /></svg>
);

// X02 · Antes de nada: si pagas por Google Play o el App Store, se cancela en la tienda (rutas de las dos); borrar la app no cancela.
export const X02Tiendas: React.FC<P> = ({ lead }) => {
  const w = (x: string, n = 0) => lead + wf('X02', x, n);
  const fTienda = w('tienda'), fAndroid = w('Android'), fGoogle = w('Google', 1), fPerfil = w('perfil'), fPagos = w('Pagos'), fSus1 = w('suscripciones');
  const fIphone = w('iPhone'), fAjustes = w('Ajustes'), fNombre = w('nombre'), fSus2 = w('Suscripciones', 1), fOjo = w('ojo');
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 96 }}>
          <Kicker at={lead - 6} text="Antes de nada" />
          <MaskTitle text="¿Te suscribiste desde la tienda?" hi="tienda?" at={lead - 2} size={80} />
          <div style={{ marginTop: 18 }}><Words text="Entonces se cancela en la tienda, no en la app." start={fTienda - 4} stagger={2} size={38} weight={500} color={color.ink2} align="left" /></div>
        </div>
        <PathCard at={fAndroid - 4} x={130} title="Android" sub="Google Play" icon={<PlayIcon />} steps={[
          { at: fGoogle, label: 'Abre Google Play' }, { at: fPerfil, label: 'Tu perfil' }, { at: fPagos, label: 'Pagos y suscripciones' },
          { at: fSus1 + 16, label: 'Suscripciones › la app' }, { at: fSus1 + 34, label: 'Cancelar suscripción' },
        ]} />
        <PathCard at={fIphone - 4} x={1010} title="iPhone" sub="App Store" icon={<GearIcon />} steps={[
          { at: fAjustes, label: 'Ajustes' }, { at: fNombre, label: 'Tu nombre' }, { at: fSus2, label: 'Suscripciones › la app' }, { at: fSus2 + 22, label: 'Cancelar suscripción' },
        ]} />
        <div style={{ position: 'absolute', left: 130, top: 930 }}>
          <ToneChip at={fOjo - 2} tone="warn" label="Borrar la app no cancela nada" sub="Sigues pagando hasta que canceles" size={40} />
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={lead - 6} volume={0.45} />
      {[fAndroid, fIphone].map((f, i) => <Sfx key={i} name="card_flip" at={f - 2} volume={0.5} />)}
      {[fGoogle, fPerfil, fPagos, fSus1 + 16, fSus1 + 34, fAjustes, fNombre, fSus2, fSus2 + 22].map((f, i) => <Sfx key={`p${i}`} name="ui_pop" at={f - 1} volume={0.5} />)}
      <Sfx name="tick_soft" at={fOjo} volume={0.65} />
    </MpStage>
  );
};

const Column: React.FC<{ at: number; title: string; tiles: { k: PKey; at: number }[]; x: number; w: number; tone: 'app' | 'mix' | 'web' }> = ({ at, title, tiles, x, w, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
  if (frame < at - 1) return null;
  const accent = tone === 'app' ? '#1F9D55' : tone === 'mix' ? color.yellow : color.ink;
  return (
    <div style={{ position: 'absolute', left: x, top: 330, width: w, height: 360, padding: '34px 36px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s})` }}>
      <div style={{ width: 60, height: 8, borderRadius: 4, background: accent, marginBottom: 18 }} />
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, letterSpacing: -1, lineHeight: 1.1, marginBottom: 30 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        {tiles.map((t) => {
          const q = spring({ frame: frame - t.at, fps, config: { damping: 13, stiffness: 200 } });
          return <PlatTile key={t.k} k={t.k} size={104} style={{ opacity: frame < t.at - 1 ? 0 : q, transform: `scale(${0.7 + 0.3 * q})` }} />;
        })}
      </div>
    </div>
  );
};

// X11 · Resumen: dónde se cancela cada una y la regla de la prueba gratis.
export const X11Resumen: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (x: string, n = 0) => lead + wf('X11', x, n);
  const fIv = w('iVoox'), fSt = w('Storytel'), fPo = w('Podimo'), fNx = w('Nextory'), fBb = w('BookBeat'), fAu = w('Audible'), fSp = w('Spotify'), fAbc = w('Audiobooks.com');
  const fPrueba = w('prueba'), fHazlo = w('hazlo');
  const sB = spring({ frame: frame - fPrueba + 6, fps, config: { damping: 16, stiffness: 150 } });
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 90 }}>
          <Kicker at={lead - 6} text="En resumen" />
          <MaskTitle text="¿Dónde se cancela cada una?" hi="cancela" at={lead - 2} size={80} />
        </div>
        <Column at={fIv - 4} x={130} w={440} title="Sin salir de la app" tone="app" tiles={[{ k: 'ivoox', at: fIv }]} />
        <Column at={fSt - 4} x={600} w={600} title="La app te manda a su web" tone="mix" tiles={[{ k: 'storytel', at: fSt }, { k: 'podimo', at: fPo }, { k: 'nextory', at: fNx }, { k: 'bookbeat', at: fBb }]} />
        <Column at={fAu - 4} x={1230} w={560} title="Solo en la web" tone="web" tiles={[{ k: 'audible', at: fAu }, { k: 'spotify', at: fSp }, { k: 'audiobooks', at: fAbc }]} />
        {frame >= fPrueba - 7 && (
          <div style={{ position: 'absolute', left: 130, top: 740, width: 1660, padding: '34px 44px', borderRadius: 34, background: color.ink, display: 'flex', alignItems: 'center', gap: 40,
            opacity: Math.min(1, sB * 1.4), transform: `translateY(${(1 - sB) * 40}px)` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', lineHeight: 1.15, letterSpacing: -0.8, flex: 1 }}>
              ¿En la prueba gratis? En la mayoría, <span style={{ color: color.yellow }}>pierdes el acceso al cancelar</span>.
            </div>
            <ToneChip at={fHazlo - 3} tone="trick" label="Cancela un par de días antes" sub="De que acabe la prueba" size={38} />
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={lead - 6} volume={0.45} />
      {[fIv, fSt, fPo, fNx, fBb, fAu, fSp, fAbc].map((f, i) => <Sfx key={i} name="ui_pop" at={f} volume={0.5} />)}
      {[fIv, fSt, fAu].map((f, i) => <Sfx key={`c${i}`} name="card_flip" at={f - 4} volume={0.4} />)}
      <Sfx name="tick_soft" at={fPrueba - 4} volume={0.6} />
    </MpStage>
  );
};

// X12 · Cierre: el artículo con todos los pasos, las reseñas en el canal y SonorBooks (pantalla final: la marca arriba, abajo libre).
export const X12Cierre: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (x: string, n = 0) => lead + wf('X12', x, n);
  const fArt = w('artículo'), fRes = w('reseña'), fCanal = w('canal'), fBuscas = w('buscas'), fSonor = w('SonorBooks'), fCompara = w('comparas');
  const p1Out = fBuscas - 8;
  return (
    <MpStage>
      <Phase from={0} to={p1Out} out={10} noIn>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 130, top: 150 }}>
            <Kicker at={lead - 6} text="Guía completa" />
            <MaskTitle text={'Todos los pasos,\ncon capturas'} hi="capturas" at={lead - 2} size={92} />
            <div style={{ marginTop: 36 }}><LinkBadge at={fArt - 6} label="En el artículo de la descripción" size={38} /></div>
          </div>
          <div style={{ position: 'absolute', left: 130, top: 700 }}>
            {frame >= fRes - 4 && (
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink2, marginBottom: 24, opacity: interpolate(frame, [fRes - 4, fRes + 8], [0, 1], clamp) }}>
                Y la reseña de cada una, <span style={{ background: color.yellow, padding: '0 8px', borderRadius: 6 }}>en el canal</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 22 }}>
              {EIGHT.map((k, i) => {
                const s = spring({ frame: frame - fRes - i * 3, fps, config: { damping: 13, stiffness: 190 } });
                return <PlatTile key={k} k={k} size={120} style={{ opacity: frame < fRes - 1 ? 0 : s, transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})` }} />;
              })}
            </div>
          </div>
        </AbsoluteFill>
      </Phase>
      {/* Pantalla final: la marca en la mitad de arriba; abajo, sitio para los elementos de YouTube. */}
      <Phase from={p1Out - 2} to={dur + 2} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 140, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={140} delay={fSonor - p1Out - 10} />
          <Words text="Compara precios y pruebas gratis de todas." start={fCompara - p1Out - 4} stagger={3} size={56} weight={500} />
          <div style={{ opacity: spring({ frame: frame - fCompara - 30, fps }), marginTop: 6 }}><Pill size={38}>sonorbooks.com</Pill></div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="ui_pop" at={fArt - 4} volume={0.6} />
      {EIGHT.map((_, i) => <Sfx key={i} name="tick_soft" at={fRes + i * 3 + 4} volume={0.35} />)}
      <Sfx name="whoosh_soft" at={p1Out} volume={0.6} />
      <Sfx name="logo_sting" at={fSonor - 6} volume={0.8} />
      {fCanal > 0 && null}
    </MpStage>
  );
};

export { easeInOut, easeOut };

import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { BrowserWindow } from '../../components/BrowserWindow';
import { LinkBadge } from '../nxr/kit';
import { Butterfly, color, F, Flight, Marker, P, PaperStage, ramp, rampOut, Reveal, SERIES, shadow, sp } from './kit';
import { CaribHouse, Headphones } from './Icons';
import { sceneClock } from './timeline';

const NARR = [
  { n: 'Gustavo Bonfigli', d: '17 h 29 min', s: 'Recomendada en SonorBooks', w: 'Gustavo' },
  { n: 'Juan Pablo Raba', d: '13 h 17 min', s: 'Actor colombiano', w: 'Juan' },
  { n: 'A varias voces', d: '15 h 25 min', s: 'Cuatro narradores', w: 'versión' },
];

// ——— AUDIO · W33–W34 ———
export const AudioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AUDIO');
  const fMac = c.at('W33', 'Macondo');
  const fVoz = c.at('W33', 'voz');
  const fCasa = c.at('W33', 'casa');
  const fAud = c.at('W33', 'audiolibro');
  const fTres = c.at('W33', 'tres');
  const fSon = c.at('W34', 'Sónorbuks');
  const fComp = c.at('W34', 'comparas');
  const fPlat = c.at('W34', 'plataformas');
  const fPrueba = c.at('W34', 'prueba');
  const fEnl = c.at('W34', 'enlace');
  const fArt = c.at('W34', 'artículo');
  const web = ramp(frame, fSon - 16, fSon + 4);
  const W = 1400;
  const k = W / 1600;
  const cam = [
    { f: 0, s: 0.92, x: 0, y: 30 },
    { f: fComp - 14, s: 1, x: 0, y: 0 },
    { f: fComp + 8, s: 1.75, x: -(1148 * k - W / 2) * 1.75, y: -(540 * k - 394) * 1.75 },
    { f: fPlat - 8, s: 1.75, x: -(1148 * k - W / 2) * 1.75, y: -(540 * k - 394) * 1.75 },
    { f: fPlat + 14, s: 1.6, x: -(1120 * k - W / 2) * 1.6, y: -(800 * k - 394) * 1.6 },
    { f: fEnl - 8, s: 1.6, x: -(1120 * k - W / 2) * 1.6, y: -(800 * k - 394) * 1.6 },
    { f: fEnl + 20, s: 0.8, x: 0, y: -70 },
  ];
  const kk = (p: string) => keyframes(frame, cam, p, easeInOut);
  const box = (x: number, y: number, w: number, h: number, a: number, b: number) => {
    const p = interpolate(frame, [a, a + 10, b - 8, b], [0, 1, 1, 0], clamp);
    if (p <= 0) return null;
    return <div style={{ position: 'absolute', left: x * k - 8, top: y * k - 8, width: w * k + 16, height: h * k + 16, borderRadius: 12, border: `${5 / kk('s')}px solid ${color.yellow}`, boxShadow: `0 0 0 4000px rgba(16,16,16,${0.3 * p})`, opacity: p, transform: `scale(${1.05 - 0.05 * p})` }} />;
  };
  const showNarr = frame > fComp - 16;
  return (
    <PaperStage>
      {/* Escucharlo en voz alta: tres narraciones */}
      <AbsoluteFill style={{ opacity: 1 - web }}>
        <div style={{ position: 'absolute', left: 140, top: 210, width: 640 }}>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 52, color: P.ink2, opacity: rampOut(frame, fMac - 6, fMac + 8) }}>Entrar en Macondo</div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 96, color: P.ink, lineHeight: 1.02, marginTop: 10 }}><Reveal text="en voz alta" at={fVoz - 4} /></div>
          <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 26, opacity: rampOut(frame, fAud - 6, fAud + 8), transform: `scale(${0.9 + 0.1 * sp(frame, fAud - 6)})`, transformOrigin: 'left' }}>
            <Headphones s={150} />
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 46, color: P.ink, lineHeight: 1.1 }}>Audiolibro<br /><span style={{ fontWeight: 500, color: P.sepia }}>en español</span></div>
          </div>
        </div>
        {/* la casa de los abuelos, donde las historias se contaban en voz alta */}
        <div style={{ position: 'absolute', left: 1040, top: 330, opacity: rampOut(frame, fMac + 4, fMac + 22) * (1 - ramp(frame, fTres - 16, fTres - 4)), transform: `scale(${0.94 + 0.06 * sp(frame, fMac + 4, 16, 140)})`, transformOrigin: '50% 100%' }}>
          <CaribHouse w={640} glow={ramp(frame, fVoz - 4, fVoz + 20)} />
        </div>
        {frame > fCasa + 4 && frame < fTres && (
          <>
            <Butterfly x={1700} y={330 - (frame - fCasa) * 0.9} size={62} seed="au1" rot={-14} opacity={rampOut(frame, fCasa + 4, fCasa + 16) * (1 - ramp(frame, fTres - 16, fTres - 4))} />
            <Butterfly x={1110 + Math.sin(frame / 20) * 14} y={300 - (frame - fCasa) * 0.6} size={44} seed="au2" rot={18} opacity={rampOut(frame, fCasa + 12, fCasa + 24) * (1 - ramp(frame, fTres - 16, fTres - 4))} />
          </>
        )}
        <div style={{ position: 'absolute', left: 900, top: 200, width: 880, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 32, letterSpacing: 6, textTransform: 'uppercase', color: P.sepia, opacity: rampOut(frame, fTres - 6, fTres + 6) }}>Tres narraciones</div>
          {NARR.map((n, i) => {
            const at = c.at('W33', n.w) - 6;
            const s = sp(frame, at, 14, 160);
            if (frame < at - 2) return null;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '24px 30px', background: '#FFFDF7', borderRadius: 24, boxShadow: shadow.card, transform: `translateX(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 2), borderLeft: `10px solid ${[P.yellow, P.terra, P.jungle2][i]}` }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: P.paper2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={40} height={40} viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zm-7 9a7 7 0 0 0 14 0M12 19v3" stroke={P.ink} strokeWidth={2} fill="none" strokeLinecap="round" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 48, color: P.ink, lineHeight: 1.05 }}>{n.n}</div>
                  <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: P.sepia, marginTop: 4 }}>{n.s}</div>
                </div>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: P.ink }}>{n.d}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* La ficha en SonorBooks */}
      <AbsoluteFill style={{ opacity: web, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `translate(${kk('x')}px, ${kk('y')}px) scale(${kk('s')})` }}>
          <BrowserWindow width={W} url="sonorbooks.com/es/audiolibro/cien-anos-de-soledad">
            <Img src={staticFile('hdl/web/ficha_top.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: showNarr ? 0 : 1 }} />
            <Img src={staticFile('hdl/web/ficha_narr.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: showNarr ? 1 : 0 }} />
            {box(856, 420, 584, 108, fComp - 2, fComp + 22)}
            {box(856, 528, 584, 84, fComp + 12, fComp + 36)}
            {box(856, 612, 584, 78, fComp + 26, fPlat - 2)}
            {box(806, 768, 634, 90, fPlat + 8, fEnl + 2)}
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center', opacity: web }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 20px', background: '#fff', borderRadius: 999, boxShadow: shadow.float, opacity: rampOut(frame, fEnl - 6, fEnl + 6), fontFamily: F.sans, fontWeight: 700, fontSize: 36 }}>
          <LogoIcon size={46} /> sonorbooks.com
        </div>
        <LinkBadge at={fEnl} size={36} />
        <div style={{ padding: '14px 30px', background: P.yellow, borderRadius: 999, boxShadow: shadow.float, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: P.ink, opacity: rampOut(frame, fArt - 6, fArt + 6), transform: `translateY(${(1 - rampOut(frame, fArt - 6, fArt + 6)) * 20}px)` }}>+ el artículo con las fuentes</div>
      </div>
      <Flight pts={[[-100, 900], [500, 700], [800, 420], [760, 360]]} a={fAud - 10} b={fAud + 50} size={50} seed="au" hold={frame < fSon - 10} />
      <Sfx name="ui_pop" at={fAud - 4} volume={0.6} />
      {NARR.map((n, i) => <Sfx key={i} name="card_flip" at={c.at('W33', n.w) - 4} volume={0.6} />)}
      <Sfx name="whoosh_soft" at={fSon - 14} volume={0.6} />
      <Sfx name="zoom_in" at={fComp - 4} volume={0.5} />
      <Sfx name="focus" at={fComp} volume={0.5} />
      <Sfx name="focus" at={fPlat + 8} volume={0.5} />
      <Sfx name="zoom_out" at={fEnl + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fEnl + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fArt} volume={0.5} />
    </PaperStage>
  );
};

// ——— OUTRO · W35 ———
// Cierre de la serie a la izquierda; la mitad derecha queda libre para la pantalla final de YouTube.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('W35');
  const fProx = c.at('W35', 'próximo');
  const fCom = c.at('W35', 'comentarios');
  const brand = sp(frame, c.voEnd('W35') + 20, 18, 140);
  return (
    <PaperStage>
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 130 }}>
        <div style={{ width: 820 }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 64, color: P.ink, opacity: rampOut(frame, f0, f0 + 12) * (1 - 0.55 * ramp(frame, fProx - 24, fProx - 10)) }}>
            <Reveal text={`«${SERIES}»`} at={f0} step={3} />
          </div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 84, color: P.ink, lineHeight: 1.05, marginTop: 18 }}>
            <Reveal text="¿Qué libro contamos en el próximo episodio?" at={fProx - 20} step={2} />
          </div>
          <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderRadius: 999, background: P.ink, color: '#fff', fontFamily: F.sans, fontWeight: 700, fontSize: 34, opacity: rampOut(frame, fCom - 6, fCom + 8) }}>
            <svg width={36} height={36} viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill={P.yellow} /></svg>
            Déjalo en los comentarios
          </div>
          <div style={{ marginTop: 70, opacity: brand, transform: `translateY(${(1 - brand) * 20}px)` }}>
            <Logo size={84} delay={c.voEnd('W35') + 20} />
            <div style={{ marginTop: 30 }}>
              <Words text="Tu próxima historia te está esperando." start={c.voEnd('W35') + 30} stagger={4} size={54} weight={700} align="left" />
            </div>
            <div style={{ marginTop: 30, opacity: sp(frame, c.voEnd('W35') + 60) }}><Pill size={36}>sonorbooks.com</Pill></div>
          </div>
        </div>
      </AbsoluteFill>
      <Butterfly x={1700} y={180 + Math.sin(frame / 20) * 10} size={70} seed="out" flap={0.8} opacity={0.0} />
      <Sfx name="hdl_flutter" at={f0 + 4} volume={0.6} />
      <Sfx name="ui_pop" at={fCom - 4} volume={0.6} />
      <Sfx name="logo_sting" at={c.voEnd('W35') + 22} volume={0.9} />
    </PaperStage>
  );
};

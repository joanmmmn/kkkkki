import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { E, eIO, eOut, lerp, pop, ramp, Room } from './kit';
import { Door, Phone, PlainCover, Plant } from './props';
import { Sticker } from './A_Open';
import { Bubble } from './H_Step2';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano K (T11): a los 21 días se devuelve solo. Un calendario de taco pasa del día 1 al 21; el audiolibro sale del
// móvil y vuelve por la puerta de la biblioteca («Devuelto»); sin multas; «Renovar» no está; pero si nadie lo espera,
// «Prestar» otra vez.
// ---------------------------------------------------------------------------------------------------------------
export const Return: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T11', 'B12', word, n);
  const fVeint = at('veintiún'), fDev = at('devuelve'), fSolo = at('solo'), fMultas = at('multas'), fNada = at('nada'), fNo = at('No'), fRen = at('renovar');
  const fPero = at('pero'), fNadie = at('nadie'), fVuelves = at('vuelves'), fPedir = at('pedir');
  const cal = pop(frame, 2, fps, 140, 15);
  const day = Math.max(1, Math.min(21, Math.round(lerp(1, 21, ramp(frame, 8, fVeint + 24, (t) => t * t * (3 - 2 * t))))));
  const flip = (frame >= 8 && frame <= fVeint + 24) ? (frame % 3) / 3 : 0;
  // el audiolibro vuelve: del móvil a la puerta
  const fly = ramp(frame, fDev - 6, fSolo + 14, eIO);
  const doorOpen = ramp(frame, fDev - 10, fDev + 6, eOut) * (1 - ramp(frame, fSolo + 14, fSolo + 28, eIO));
  const back = pop(frame, fSolo + 8, fps, 240, 13); // sello «Devuelto»
  const fine = pop(frame, fMultas - 8, fps, 220, 13);
  const strike = ramp(frame, fMultas + 4, fMultas + 14, eIO);
  const relax = pop(frame, fNada - 6, fps, 200, 13);
  const ren = pop(frame, fNo - 4, fps, 200, 14);
  const renX = ramp(frame, fRen, fRen + 10, eOut);
  const queue0 = pop(frame, fNadie - 6, fps, 170, 14);
  const again = pop(frame, fVuelves - 8, fps, 200, 13);
  const press = ramp(frame, fPedir - 4, fPedir, eOut) * (1 - ramp(frame, fPedir, fPedir + 8, eOut));
  const comeBack = ramp(frame, fPedir + 2, fPedir + 24, eIO);
  const leftOut = ramp(frame, fNo - 16, fNo - 2, eIO); // el calendario y la multa se apartan para dejar sitio
  const [x0, y0] = [1320, 470]; // portada en el móvil
  const [x1, y1] = [540, 560]; // puerta
  const bx = fly < 1 ? lerp(x0, x1, fly) : lerp(x1, x0, comeBack);
  const by = fly < 1 ? lerp(y0, y1, fly) - Math.sin(fly * Math.PI) * 220 : lerp(y1, y0, comeBack) - Math.sin(comeBack * Math.PI) * 220;
  const showBook = (fly > 0 && fly < 1) || (comeBack > 0 && comeBack < 1);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Room wall={E.lilacPale} floor={E.lilac} base={E.violet} floorY={880}>
        <div style={{ position: 'absolute', left: 960 - 560, top: 80, width: 1120, height: 1120, borderRadius: '50%', background: E.lilac, opacity: 0.35 }} />
        {/* puerta de la biblioteca */}
        <div style={{ position: 'absolute', left: 540 - 140 - 22, top: 880 - 520 - 22 }}>
          <Door w={280} h={520} casingW={22} leaf={E.plum} casing={E.paper} open={doorOpen * 0.55} plate={<div style={{ padding: '6px 14px', borderRadius: 8, background: E.mustard, fontFamily: E.font, fontWeight: 700, fontSize: 24, color: E.ink }}>Biblioteca</div>} />
        </div>
        <div style={{ position: 'absolute', left: 130, top: 880 - 330 }}><Plant size={230} pot={E.coral} seed={8} /></div>
        {/* calendario de taco */}
        <div style={{ position: 'absolute', left: 860, top: 160, transform: `translateY(${(1 - Math.min(1, cal)) * -400}px) scale(${1 - leftOut * 0.3})`, transformOrigin: '50% 0%' }}>
          <div style={{ position: 'relative', width: 260, height: 300 }}>
            <div style={{ position: 'absolute', left: 0, top: 30, width: 260, height: 270, borderRadius: 18, background: E.paper, boxShadow: `8px 8px 0 ${E.plum}` }} />
            <div style={{ position: 'absolute', left: 0, top: 30, width: 260, height: 70, borderRadius: '18px 18px 0 0', background: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 700, fontSize: 30, color: E.paper }}>Día</div>
            {[60, 180].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 12, width: 20, height: 40, borderRadius: 10, background: E.ink2 }} />)}
            <div style={{ position: 'absolute', left: 0, top: 100, width: 260, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 140, color: day === 21 ? E.coral : E.ink, letterSpacing: '-0.04em' }}>{day}</div>
            {flip > 0 && <div style={{ position: 'absolute', left: 0, top: 100, width: 260, height: 200, background: E.paper, transformOrigin: '50% 0%', transform: `perspective(600px) rotateX(${flip * 100}deg)`, opacity: 0.9, borderBottom: `2px solid ${E.boneDeep}` }} />}
          </div>
        </div>
        {/* móvil */}
        <div style={{ position: 'absolute', left: 1180, top: 210 }}>
          <Phone w={300}>
            <div style={{ padding: '54px 18px', fontFamily: E.ui }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: E.ink, marginBottom: 16 }}>Mis libros</div>
              <div style={{ opacity: fly > 0.02 && comeBack < 0.98 ? 0.15 : 1 }}><PlainCover w={130} title="El otoño del patriarca" bg={E.coral} accent={E.mustard} /></div>
              {again > 0.01 && (
                <div style={{ marginTop: 26, width: 180, height: 50, borderRadius: 10, background: E.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700,
                  transform: `scale(${(0.8 + 0.2 * Math.min(1.05, again)) * (1 - press * 0.06)})`, opacity: Math.min(1, again * 2) }}>Prestar otra vez</div>
              )}
            </div>
          </Phone>
        </div>
        {/* audiolibro en vuelo */}
        {showBook && <div style={{ position: 'absolute', left: bx - 65, top: by - 65, transform: `rotate(${(fly < 1 ? fly : comeBack) * 360 * (fly < 1 ? -1 : 1)}deg)` }}><PlainCover w={130} title="El otoño del patriarca" bg={E.coral} accent={E.mustard} /></div>}
        {back > 0.01 && <Sticker x={540 - 120} y={260} s={back} bg={E.green} rot={-8} size={240}><div style={{ fontSize: 40, fontWeight: 800 }}>Devuelto</div></Sticker>}
        {/* sin multas */}
        {fine > 0.01 && (
          <div style={{ position: 'absolute', left: 860 + 300, top: 560, width: 260, padding: '18px 22px', borderRadius: 14, background: E.paper, boxShadow: `6px 6px 0 ${E.ink}`, fontFamily: E.font,
            transform: `rotate(${4 + (1 - Math.min(1, fine)) * 20}deg) scale(${0.8 + 0.2 * Math.min(1.05, fine)})`, opacity: Math.min(1, fine * 2) * (1 - leftOut) }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: E.inkSoft }}>Multa</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: E.ink }}>0 €</div>
            <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 8, borderRadius: 4, background: E.coral, transformOrigin: '0 50%', transform: `rotate(-12deg) scaleX(${strike})` }} />
          </div>
        )}
        {/* no se renueva / nadie esperando */}
        {ren > 0.01 && (
          <div style={{ position: 'absolute', left: 820, top: 610, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px', borderRadius: 14, background: '#E3DED8', color: '#9A948C', fontFamily: E.font, fontWeight: 700, fontSize: 36,
            transform: `scale(${0.8 + 0.2 * Math.min(1.05, ren)})`, opacity: Math.min(1, ren * 2) * (1 - ramp(frame, fPero - 4, fPero + 8, eIO)) }}>
            Renovar
            <svg width="40" height="40" viewBox="0 0 24 24" style={{ opacity: renX }}><circle cx="12" cy="12" r="10" fill={E.coral} /><path d="M8 8 L16 16 M16 8 L8 16" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
          </div>
        )}
        {queue0 > 0.01 && (
          <div style={{ position: 'absolute', left: 840, top: 600, display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, queue0 * 2), transform: `scale(${0.8 + 0.2 * Math.min(1.05, queue0)})` }}>
            <div style={{ width: 90, height: 104, borderRadius: '50% 50% 40% 40%', background: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 40, color: E.paper }}>0</div>
            <div style={{ fontFamily: E.font, fontWeight: 700, fontSize: 36, color: E.ink, lineHeight: 1.1 }}>Nadie<br />esperando</div>
          </div>
        )}
      </Room>
      {relax > 0.01 && <Bubble x={960 + 30} y={950} s={relax * (1 - ramp(frame, fNo - 8, fNo, eIO))} text="Sin hacer nada" bg={E.plum} size={34} />}
      <Sfx name="calendar_flip" at={8} volume={0.8} />
      <Sfx name="door_open" at={fDev - 10} volume={0.5} />
      <Sfx name="whoosh_soft" at={fDev - 4} volume={0.6} />
      <Sfx name="door_thud" at={fSolo + 16} volume={0.6} />
      <Sfx name="sticker_slap" at={fSolo + 10} volume={0.8} />
      <Sfx name="paper_slide" at={fMultas - 8} volume={0.6} />
      <Sfx name="pencil_strike" at={fMultas + 4} volume={0.6} />
      <Sfx name="fail" at={fRen} volume={0.35} />
      <Sfx name="pop_bright" at={fNadie - 4} volume={0.4} />
      <Sfx name="phone_tap" at={fPedir} volume={0.7} />
      <Sfx name="whoosh_soft" at={fPedir + 2} volume={0.5} />
      <Sfx name="success" at={fPedir + 22} volume={0.4} />
    </AbsoluteFill>
  );
};

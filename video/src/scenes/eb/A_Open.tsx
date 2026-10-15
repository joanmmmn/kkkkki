import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { Burst, clamp01, E, EbLogo, eIO, eOut, es, lerp, pop, ramp, Room, Stip, sway } from './kit';
import { Door, LibCard, Phone, PlainCover, Plant } from './props';
import { LibraryHall, Pocket } from './world';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano A (T01): arranque en frío. Una puerta en una pared rosa; el carné toca el lector («bip»), la puerta se abre
// hacia dentro y la cámara entra en una biblioteca luminosa: novedades y superventas, los mismos que en las apps de
// pago. 529.948 audiolibros prestados en 2025, sin pagar y sin anuncios. «Esto es eBiblio»: la biblioteca entera
// se encoge dentro de un móvil, que se guarda en el bolsillo.
// ---------------------------------------------------------------------------------------------------------------
const DX = 960, DY = 600; // centro del hueco de la puerta en la pantalla (a escala 1)
const DW = 300, DH = 560, CW = 26;
const zoomLog = (a: number, b: number, p: number) => Math.exp(lerp(Math.log(a), Math.log(b), p));

export const Open: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T01', 'B01', word, n);
  const at2 = (word: string, n = 0) => w('T01', 'B02', word, n);
  const fCarne = at('carné'), fBib = at('biblioteca'), fAudio = at('audiolibros'), fGratis = at('gratis'), fMovil = at('móvil');
  const fNov = at('Novedades'), fSuper = at('superventas'), fMismos = at('mismos'), fPago = at('pago');
  const fPrest = at2('prestaron'), fMil = at2('mil'), fSin = at2('Sin'), fAnun = at2('anuncios'), fEsto = at2('Esto'), fEb = at2('eBiblio');
  const fBibP = at2('biblioteca'), fBolsillo = at2('bolsillo');

  // --- 1. La puerta (pared rosa) -----------------------------------------------------------------------------
  const tap = fBib + 2; // el carné toca el lector
  const open = ramp(frame, tap + 16, tap + 70, eIO);
  // cámara: se acerca despacio, y al abrirse la puerta cruza el umbral (zoom logarítmico)
  const zPre = interpolate(frame, [0, tap], [1, 1.1], clamp);
  const zIn = ramp(frame, tap + 40, fGratis + 4, (t) => t * t * (3 - 2 * t));
  const zw = zoomLog(zPre, 9, zIn);
  const wallVisible = zIn < 0.995;
  // interior: se ve por el hueco (más pequeño, más lejos) y llega a pantalla completa
  const zi = zoomLog(0.42, 1, zIn);
  const drift = ramp(frame, fGratis, fEsto, eIO); // dentro, la cámara se sigue acercando muy despacio
  const flash = ramp(frame, fAudio - 10, fAudio, eOut) * (1 - ramp(frame, fAudio, fAudio + 16, eIO));

  // carné: entra girando desde abajo a la derecha y se apoya en el lector
  const card = pop(frame, fCarne - 14, fps, 120, 15);
  const cardOut = ramp(frame, tap + 10, tap + 34, eIO);
  const cx = lerp(1700, 1222, Math.min(1, card)) + cardOut * 260, cy = lerp(1150, 618, Math.min(1, card)) + cardOut * 140;
  const press = ramp(frame, tap - 4, tap, eOut) * (1 - ramp(frame, tap, tap + 8, eOut));
  const led = frame >= tap ? 1 : 0;

  // --- 2. Dentro: novedades, superventas y «los mismos que en las apps de pago» -----------------------------
  const novS = pop(frame, fNov - 6, fps, 150, 13);
  const supS = pop(frame, fSuper - 6, fps, 150, 13);
  const appS = pop(frame, fMismos - 10, fps, 120, 16);
  const eqS = pop(frame, fPago - 10, fps, 180, 12);
  const eqOut = ramp(frame, fPrest - 22, fPrest - 6, eIO);
  const hot = ramp(frame, fMismos - 4, fMismos + 18, eOut); // tres libros salen de la balda

  // --- 3. 529.948 · sin pagar · sin anuncios ------------------------------------------------------------------
  const cnt = ramp(frame, fPrest - 6, fMil + 10, (t) => 1 - Math.pow(1 - t, 3));
  const cntS = pop(frame, fPrest - 14, fps, 140, 16);
  const cntOut = ramp(frame, fSin - 8, fSin + 10, eIO);
  const zero = pop(frame, w('T01', 'B02', 'nada') - 6, fps, 260, 12);
  const strike = ramp(frame, fSin + 2, fSin + 16, eIO);
  const ads = pop(frame, fAnun - 4, fps, 260, 12);

  // --- 4. «Esto es eBiblio» y el bolsillo ------------------------------------------------------------------
  const circ = ramp(frame, fEsto - 6, fEsto + 22, eIO); // círculo ciruela que cubre la sala
  const logoS = pop(frame, fEb - 8, fps, 150, 12);
  const sub = ramp(frame, fBibP - 6, fBibP + 12, eOut);
  const shrink = ramp(frame, fBibP + 30, fBolsillo - 6, eIO); // la pantalla ciruela se encoge hasta ser la del móvil
  const pocketIn = pop(frame, fBolsillo - 26, fps, 110, 15);
  const dip = ramp(frame, fBolsillo - 8, fBolsillo + 14, eIO);
  // pantalla ciruela: de 1920×1080 a la pantalla del móvil (ancho 280 → pantalla de 252×546)
  const PW = 280, PK = PW / 400, PSW = PW - 40 * PK, PSH = (780 * PSW) / 360;
  const phoneCX = 960, phoneCY = lerp(520, 580, dip);
  const scrW = lerp(1920, PSW, shrink), scrH = lerp(1080, PSH, shrink), scrR = lerp(0, 40 * PK, shrink);
  const scrX = lerp(960, phoneCX, shrink), scrY = lerp(540, phoneCY, shrink);
  const phoneO = ramp(frame, fBibP + 52, fBolsillo - 14, eIO);
  const POCKET_TOP = 650; // boca del bolsillo
  const pk = 1 - Math.min(1, pocketIn);
  return (
    <AbsoluteFill style={{ background: E.pink, overflow: 'hidden' }}>
      {/* sala (detrás de la pared) */}
      {open > 0.001 && (
        <AbsoluteFill style={{ transform: `translate(${(1 - zIn) * (DX - 960) - drift * 40}px, ${(1 - zIn) * (DY - 540)}px) scale(${zi * (1 + drift * 0.05)})`, transformOrigin: '960px 540px' }}>
          <LibraryHall signs={
            <>
              <HangSign x={280} y={150} text="Novedades" bg={E.mustard} s={novS} seed={1} />
              <HangSign x={1640} y={150} text="Superventas" bg={E.coral} color={E.paper} s={supS} seed={2} />
            </>
          }>
            {/* tres libros que salen de la balda izquierda (los mismos que en la app) */}
            {hot > 0.01 && [E.coral, E.mustard, E.violet].map((c, i) => (
              <div key={i} style={{ position: 'absolute', left: 120 + i * 120, top: 300 + (1 - hot) * 20, transform: `translateY(${-hot * 30}px) scale(${1 + hot * 0.12})`, opacity: hot }}>
                <PlainCover w={110} title={['Novela', 'Thriller', 'Ensayo'][i]} bg={c} accent={i === 1 ? E.plum : E.pink} />
              </div>
            ))}
          </LibraryHall>
          {/* móvil «apps de pago» */}
          {appS > 0.01 && (
            <div style={{ position: 'absolute', left: 1430, top: 390 + (1 - appS) * 700, transform: `rotate(${(1 - appS) * 10 + 3}deg)` }}>
              <div style={{ position: 'absolute', left: 150, top: -96, whiteSpace: 'nowrap', transform: 'translateX(-50%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 999, background: E.ink, color: E.paper, fontFamily: E.font, fontWeight: 600, fontSize: 34, position: 'relative' }}>
                  Apps de pago: desde <span style={{ color: E.mustardLight }}>9,99 €/mes</span>
                  <div style={{ position: 'absolute', left: 18, right: 18, top: '52%', height: 6, borderRadius: 3, background: E.coral, transformOrigin: '0 50%', transform: `scaleX(${strike})` }} />
                </div>
              </div>
              <Phone w={300}>
                <div style={{ padding: '58px 22px', fontFamily: E.ui }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: E.ink, marginBottom: 18 }}>Audiolibros</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[E.coral, E.mustard, E.violet].map((c, i) => <PlainCover key={i} w={96} title={['Novela', 'Thriller', 'Ensayo'][i]} bg={c} accent={i === 1 ? E.plum : E.pink} />)}
                  </div>
                  {[0, 1, 2].map((r) => <div key={r} style={{ marginTop: 26, height: 18, width: [260, 210, 240][r], borderRadius: 9, background: '#ECE7E2' }} />)}
                </div>
              </Phone>
              {/* «0 €» y «sin anuncios» */}
              {zero > 0.01 && <Sticker x={270} y={-160} s={zero} bg={E.coral} rot={-12} size={150}><div style={{ fontSize: 54, fontWeight: 800 }}>0 €</div></Sticker>}
              {ads > 0.01 && <Sticker x={-120} y={300} s={ads} bg={E.plum} rot={-8} size={190}><div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.05, textAlign: 'center' }}>Sin<br />anuncios</div></Sticker>}
            </div>
          )}
          {/* signo igual entre la balda y el móvil */}
          {eqS > 0.01 && (
            <div style={{ position: 'absolute', left: 1050, top: 420, transform: `scale(${eqS * (1 - eqOut)})`, opacity: Math.min(1, eqS) * (1 - eqOut) }}>
              <div style={{ width: 150, height: 150, borderRadius: '50%', background: E.mustard, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 120, color: E.ink, lineHeight: 1, paddingTop: 8, boxSizing: 'border-box' }}>=</div>
            </div>
          )}
          {/* contador */}
          {cntS > 0.01 && (
            <div style={{ position: 'absolute', left: 960 - 470, top: 300, width: 940, height: 330, borderRadius: 40, background: E.paper, opacity: Math.min(1, cntS) * (1 - cntOut),
              transform: `translateY(${(1 - Math.min(1, cntS)) * 60 - cntOut * 40}px) scale(${0.9 + 0.1 * Math.min(1, cntS)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `14px 14px 0 ${E.coral}` }}>
              <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 196, lineHeight: 1, color: E.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{es(529948 * cnt)}</div>
              <div style={{ fontFamily: E.font, fontWeight: 600, fontSize: 44, color: E.plum, marginTop: 6 }}>audiolibros prestados en 2025</div>
            </div>
          )}
        </AbsoluteFill>
      )}
      {/* destello al cruzar el umbral */}
      {flash > 0.01 && <AbsoluteFill style={{ background: '#FFF8E8', opacity: flash * 0.45 }} />}

      {/* pared con la puerta */}
      {wallVisible && (
        <AbsoluteFill style={{ transform: `scale(${zw})`, transformOrigin: `${DX}px ${DY}px` }}>
          <WallWithDoor open={open} frame={frame} />
          {/* lector de carné */}
          <div style={{ position: 'absolute', left: 1192, top: 560, width: 76, height: 118, borderRadius: 14, background: E.ink2 }}>
            <Stip kind="h" flip o={0.3} />
            <div style={{ position: 'absolute', left: 30, top: 14, width: 16, height: 16, borderRadius: '50%', background: led ? '#57D18B' : '#A33', boxShadow: led ? '0 0 22px 6px rgba(87,209,139,0.65)' : 'none' }} />
            <svg style={{ position: 'absolute', left: 18, top: 46 }} width="40" height="50" viewBox="0 0 40 50">
              {[8, 15, 22].map((r, i) => <path key={i} d={`M${8 + i * 6} ${25 - r * 0.8} Q ${8 + i * 6 + r * 0.6} 25 ${8 + i * 6} ${25 + r * 0.8}`} stroke={E.paper} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={0.85} />)}
            </svg>
          </div>
          <Burst at={tap} x={1230} y={590} r={70} color={'#57D18B'} />
          {card > 0.01 && cardOut < 1 && (
            <div style={{ position: 'absolute', left: cx - 140, top: cy - 88, transform: `perspective(900px) rotateY(${(1 - Math.min(1, card)) * 70 - 8}deg) rotateZ(${(1 - Math.min(1, card)) * 30 - 6 + cardOut * 20}deg) scale(${1 - press * 0.06})`, opacity: 1 - cardOut }}>
              <LibCard w={280} shine={ramp(frame, fCarne, fCarne + 30, eIO)} />
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* «Esto es eBiblio»: círculo ciruela, logotipo, y la pantalla que se encoge hasta el móvil del bolsillo */}
      {circ > 0.001 && (
        <AbsoluteFill>
          {shrink > 0.001 && <AbsoluteFill style={{ background: E.pinkPale }}>
            <Stip kind="r" o={0.12} />
          </AbsoluteFill>}
          {/* el vaquero (detrás del móvil) */}
          {pocketIn > 0.01 && (
            <div style={{ position: 'absolute', left: -50, right: -50, top: POCKET_TOP - 120 + pk * 700, height: 900, background: E.violet, borderRadius: '40px 40px 0 0' }}>
              <Stip kind="v" o={0.18} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: '#6E4F8A' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 0, borderTop: `2.5px dashed ${E.mustardLight}` }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, height: 0, borderTop: `2.5px dashed ${E.mustardLight}` }} />
              </div>
              {[380, 1010, 1640].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: -10, width: 34, height: 92, borderRadius: 8, background: '#7F5E9B', boxShadow: '0 4px 0 rgba(15,21,33,0.2)' }} />)}
            </div>
          )}
          {/* cuerpo del móvil */}
          <div style={{ position: 'absolute', left: scrX - scrW / 2 - 20 * PK * shrink, top: scrY - scrH / 2 - 20 * PK * shrink, width: scrW + 40 * PK * shrink, height: scrH + 40 * PK * shrink,
            borderRadius: lerp(0, 58 * PK, shrink), background: E.ink2, opacity: phoneO }} />
          <div style={{ position: 'absolute', left: scrX - scrW / 2, top: scrY - scrH / 2, width: scrW, height: scrH, borderRadius: scrR, overflow: 'hidden',
            clipPath: circ < 1 ? `circle(${circ * 1150}px at 960px 540px)` : undefined, background: E.plum }}>
            <Stip kind="r" o={0.16} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -58%) scale(${lerp(1, PSW / 1920 * 2.2, shrink)})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ transform: `scale(${0.6 + 0.4 * Math.min(1.2, logoS)})`, opacity: Math.min(1, logoS * 2) }}><EbLogo w={640} white /></div>
              <div style={{ marginTop: 40, fontFamily: E.font, fontWeight: 600, fontSize: 58, color: E.paper, opacity: sub * (1 - clamp01(shrink * 3)), transform: `translateY(${(1 - sub) * 20}px)`, whiteSpace: 'nowrap' }}>La biblioteca pública, en tu bolsillo</div>
            </div>
          </div>
          {/* delantera del bolsillo: tapa la parte de abajo del móvil */}
          {pocketIn > 0.01 && (
            <div style={{ position: 'absolute', left: 960 - 230, top: POCKET_TOP + pk * 700 }}>
              <Pocket w={460} color={'#8B6BA7'} />
              <div style={{ position: 'absolute', left: 0, top: -2, width: 460, height: 30, background: 'linear-gradient(180deg, rgba(15,21,33,0.28), rgba(15,21,33,0))' }} />
            </div>
          )}
        </AbsoluteFill>
      )}

      <Sfx name="whoosh_soft" at={fCarne - 12} volume={0.6} />
      <Sfx name="nfc_beep" at={tap} volume={1} />
      <Sfx name="door_open" at={tap + 16} volume={0.9} />
      <Sfx name="light_swell" at={fAudio - 18} volume={0.8} />
      <Sfx name="deep_whoosh" at={tap + 44} volume={0.5} />
      <Sfx name="cardboard_pop" at={fNov - 4} volume={0.8} />
      <Sfx name="cardboard_pop" at={fSuper - 4} volume={0.7} />
      <Sfx name="phone_whoosh" at={fMismos - 6} volume={0.8} />
      <Sfx name="pop_bright" at={fPago - 8} volume={0.6} />
      <Sfx name="counter" at={fPrest - 4} volume={0.55} trimAfter={Math.max(10, fMil + 8 - fPrest)} />
      <Sfx name="soft_impact" at={fMil + 8} volume={0.5} />
      <Sfx name="pencil_strike" at={fSin + 2} volume={0.6} />
      <Sfx name="sticker_slap" at={w('T01', 'B02', 'nada') - 2} volume={0.9} />
      <Sfx name="sticker_slap" at={fAnun} volume={0.9} />
      <Sfx name="reveal_whoosh" at={fEsto - 4} volume={0.45} />
      <Sfx name="logo_sting" at={fEb - 4} volume={0.8} />
      <Sfx name="pocket_slide" at={fBolsillo - 6} volume={0.9} />
      {/* (ganchos de tiempo sin usar: fMovil, fGratis) */}
      {fMovil < 0 && fGratis < 0 ? null : null}
    </AbsoluteFill>
  );
};

// Pared rosa con la puerta, un cuadro, una planta y el zócalo
const WallWithDoor: React.FC<{ open: number; frame: number }> = ({ open, frame }) => (
  <Room wall={E.pink} floor={E.coral} base={E.pinkDeep} floorY={880} hole={[DX - DW / 2, DY - DH / 2, DW, DH]}>
    {/* cuadro */}
    <div style={{ position: 'absolute', left: 300, top: 250, width: 230, height: 280, background: E.paper, padding: 16, boxSizing: 'border-box', transform: `rotate(${sway(frame, 3, 0.6, 0.03)}deg)` }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', background: E.mustardPale, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 30, top: 40, width: 120, height: 120, borderRadius: '50%', background: E.coral }} />
        <div style={{ position: 'absolute', left: 90, top: 120, width: 90, height: 130, background: E.plum }} />
        <Stip kind="v" o={0.18} />
      </div>
    </div>
    {/* cartel sobre la puerta */}
    <div style={{ position: 'absolute', left: DX - 170, top: 214, width: 340, height: 56, borderRadius: 10, background: E.plum, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 600, fontSize: 30, color: E.paper, letterSpacing: '0.01em' }}>Biblioteca pública</div>
    {/* puerta */}
    <div style={{ position: 'absolute', left: DX - DW / 2 - CW, top: DY - DH / 2 - CW }}>
      <Door w={DW} h={DH} casingW={CW} leaf={E.plum} casing={E.paper} open={open} hollow />
    </div>
    {/* plantas */}
    <div style={{ position: 'absolute', left: 560, top: 470 }}><Plant size={290} pot={E.mustard} seed={1} /></div>
    <div style={{ position: 'absolute', left: 1430, top: 520 }}><Plant size={250} pot={E.plum} seed={4} leaf={E.oliveMid} leaf2={E.olive} /></div>
  </Room>
);

// Cartel colgante con su texto (aparece con un rebote y se balancea)
export const HangSign: React.FC<{ x: number; y: number; text: string; bg: string; color?: string; s: number; seed: number }> = ({ x, y, text, bg, color = E.ink, s, seed }) => {
  const frame = useCurrentFrame();
  if (s <= 0.01) return null;
  const rot = sway(frame, seed, 2.5, 0.06) + (1 - Math.min(1, s)) * 25;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${Math.min(1.1, s)})`, opacity: Math.min(1, s * 2) }}>
      <div style={{ position: 'absolute', left: -120, top: -200, width: 2, height: 200, background: E.ink2 }} />
      <div style={{ position: 'absolute', left: 118, top: -200, width: 2, height: 200, background: E.ink2 }} />
      <div style={{ position: 'absolute', left: -150, top: 0, width: 300, height: 84, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 700, fontSize: 40, color }}>
        {text}
      </div>
    </div>
  );
};

// Pegatina redonda que se estampa con un golpe
export const Sticker: React.FC<{ x: number; y: number; s: number; bg: string; color?: string; rot?: number; size?: number; children: React.ReactNode }> = ({ x, y, s, bg, color = E.paper, rot = 0, size = 160, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: bg, color, fontFamily: E.font, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: `rotate(${rot + (1 - Math.min(1, s)) * -30}deg) scale(${lerp(1.8, 1, clamp01(s))})`, opacity: clamp01(s * 2.5), boxShadow: `6px 6px 0 ${E.ink}` }}>
    {children}
  </div>
);

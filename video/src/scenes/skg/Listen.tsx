import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { BrowserWindow } from '../../components/BrowserWindow';
import { LogoIcon } from '../../components/Logo';
import { MaskTitle, LinkBadge } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, color, Fact, font, KR, MiniIcon, ramp, rampOut, shadow, SkStage } from './kit';
import { FlatCover } from './Genres';
import { sceneClock } from './timeline';

const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Onda de audio animada.
const Wave: React.FC<{ w: number; h: number; n?: number; c?: string; amp?: number }> = ({ w, h, n = 48, c = color.ink, amp = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', gap: w / n * 0.35 }}>
      {Array.from({ length: n }).map((_, i) => {
        const v = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.55 + frame / 6) * Math.sin(i * 0.17 + frame / 13));
        return <div key={i} style={{ flex: 1, height: h * v * amp, minHeight: 4, borderRadius: 4, background: c }} />;
      })}
    </div>
  );
};

const Narrator: React.FC<{ at: number; name: string; tag: string; books: string; initials: string }> = ({ at, name, tag, books, initials }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, 15, 170);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '24px 34px 24px 24px', background: '#fff', borderRadius: 28, boxShadow: shadow.card, border: `1px solid ${color.line}`,
      opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.92 + 0.08 * s})` }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: color.ink, color: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 38, flexShrink: 0 }}>{initials}</div>
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>{name}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: KR, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}><MiniIcon kind="mic" size={26} c={KR} />{tag}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink2, marginTop: 6 }}>{books}</div>
      </div>
    </div>
  );
};

// ——— VOCES · G34–G35 ———
// Polaco: G34 «Po polsku audiobooki Kinga wydają głównie Albatros i Prószyński. I King ma u nas swoje głosy: Leszek Filipowicz
// przeczytał prawie dwadzieścia jego książek, Jan Peszek całą trylogię o Billu Hodgesie, a Mateusz Drozda wszystkie tomy „Mrocznej Wieży”.»
// G35 «A Zbigniew Zapasiewicz czyta „Zieloną milę” i cztery opowieści z „Czterech pór roku”, w tym „Skazanych na Shawshank”.»
// Sin fotos de los lectores: iniciales y ondas de voz (como el español).
export const Voces: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VOCES');
  const fNov = c.at('G34', 'audiobooki');
  const fEsp = c.at('G34', 'Kinga');
  const fPRH = c.at('G34', 'Albatros');
  const fLat = c.at('G34', 'głosy');
  const fFil = c.at('G34', 'Leszek');
  const fPes = c.at('G34', 'Jan');
  const fDro = c.at('G34', 'Mateusz');
  const fZap = c.at('G35', 'Zbigniew');
  const fMila = c.at('G35', 'Zieloną');
  const fPory = c.at('G35', 'cztery');
  const fShaw = c.at('G35', 'Skazanych');
  const grid = ['resplandor', 'it', 'misery', 'milla', 'd2263', 'apocalipsis', 'doctor', 'mercedes', 'cuento', 'holly', 'salem', 'visitante'];
  const toVoices = ramp(frame, fLat - 16, fLat + 4);
  const toCard = ramp(frame, fZap - 14, fZap + 6);
  return (
    <SkStage>
      {/* Fase 1: King en audiobook, en polaco */}
      <AbsoluteFill style={{ opacity: 1 - toVoices, transform: `scale(${1 - 0.06 * toVoices})`, filter: toVoices > 0.01 ? `blur(${toVoices * 8}px)` : undefined }}>
        <div style={{ position: 'absolute', left: 140, top: 130, display: 'flex', alignItems: 'center', gap: 34 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp(frame, 2, 11, 200)})` }}><MiniIcon kind="head" size={70} /></div>
          <MaskTitle text="King po polsku" at={4} size={110} />
        </div>
        <div style={{ position: 'absolute', left: 140, top: 320, display: 'grid', gridTemplateColumns: 'repeat(6, 160px)', gap: 30 }}>
          {grid.map((k, i) => {
            const s = sp(frame, fNov - 6 + i * 2.5, 14, 190);
            return (
              <div key={k} style={{ position: 'relative', opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
                <FlatCover b={BOOKS[k]} w={160} />
                <div style={{ position: 'absolute', right: -10, bottom: -10, width: 46, height: 46, borderRadius: '50%', background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp(frame, fEsp - 4 + i * 1.5, 10, 220)})` }}>
                  <MiniIcon kind="head" size={26} c={color.yellow} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 1260, top: 380, width: 560, opacity: rampOut(frame, fPRH - 6, fPRH + 10), transform: `translateX(${(1 - rampOut(frame, fPRH - 6, fPRH + 10)) * 30}px)` }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: color.muted, textTransform: 'uppercase' }}>Wydają głównie</div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: color.ink, marginTop: 10 }}>Albatros<br />i Prószyński</div>
          <div style={{ marginTop: 40 }}><Wave w={460} h={90} c={color.ink} /></div>
        </div>
      </AbsoluteFill>
      {/* Fase 2: voces */}
      {toVoices > 0 && (
        <AbsoluteFill style={{ opacity: toVoices * (1 - toCard), transform: `scale(${1 - 0.05 * toCard})`, filter: toCard > 0.01 ? `blur(${toCard * 8}px)` : undefined }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}>
            <Kicker at={fLat - 8} text="Lektorzy" style={{ justifyContent: 'center' }} />
            <MaskTitle text="King ma u nas swoje głosy" at={fLat - 6} size={88} align="center" hi={['głosy']} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', gap: 28 }}>
            <Narrator at={Math.min(fFil - 4, fLat + 10)} name="Leszek Filipowicz" tag="19 tytułów" books="m.in. To, Outsider, Uniesienie" initials="LF" />
            <Narrator at={fPes - 4} name="Jan Peszek" tag="3 tomy" books="trylogia o Billu Hodgesie" initials="JP" />
            <Narrator at={fDro - 4} name="Mateusz Drozda" tag="7 tomów" books="cała „Mroczna Wieża”" initials="MD" />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center', opacity: rampOut(frame, fFil, fFil + 20) }}>
            <Wave w={900} h={70} c="rgba(16,16,16,0.22)" n={70} />
          </div>
        </AbsoluteFill>
      )}
      {/* Fase 3: Zbigniew Zapasiewicz */}
      {toCard > 0 && (
        <AbsoluteFill style={{ opacity: toCard, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90 }}>
          <div style={{ position: 'relative', width: 380, height: 450, transform: `translateY(${(1 - sp(frame, fZap - 8)) * 60}px)`, opacity: sp(frame, fZap - 8) }}>
            <div style={{ position: 'absolute', left: 0, top: 0 }}><FlatCover b={BOOKS.milla} w={260} rot={-4} /></div>
            <div style={{ position: 'absolute', left: 130, top: 60, opacity: sp(frame, fPory - 6), transform: `translateX(${(1 - sp(frame, fPory - 6)) * 40}px)` }}><FlatCover b={BOOKS.cuatro} w={250} rot={4} /></div>
          </div>
          <div style={{ width: 800 }}>
            <Kicker at={fZap - 8} text="Lektor" />
            <MaskTitle text="Zbigniew Zapasiewicz" at={fZap - 6} size={84} />
            <div style={{ marginTop: 34, background: '#fff', borderRadius: 28, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '30px 36px', opacity: rampOut(frame, fMila - 8, fMila + 6) }}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Fact at={fMila - 2} icon={<MiniIcon kind="book" size={28} />} label="Zielona mila" sub="15 h 35 min" size={34} />
                <Fact at={fPory - 2} icon={<MiniIcon kind="book" size={28} />} label="Cztery pory roku" sub="4 opowieści" size={34} />
                <Fact at={fShaw - 4} icon={<MiniIcon kind="film" size={28} />} label="Skazani na Shawshank" sub="w tym" size={34} accent={color.yellow} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={4} volume={0.6} />
      {grid.map((_, i) => (i % 3 === 0 ? <Sfx key={i} name="tick_soft" at={Math.round(fNov - 6 + i * 2.5)} volume={0.5} /> : null))}
      <Sfx name="shimmer" at={fEsp} volume={0.5} />
      <Sfx name="ui_pop" at={fPRH} volume={0.6} />
      <Sfx name="whoosh_soft" at={fLat - 12} volume={0.6} />
      <Sfx name="ui_pop" at={Math.min(fFil - 4, fLat + 10) + 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPes - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDro - 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={fZap - 10} volume={0.6} />
      <Sfx name="card_flip" at={fMila - 6} volume={0.6} />
      <Sfx name="card_flip" at={fPory - 6} volume={0.6} />
      <Sfx name="success" at={fShaw} volume={0.45} />
    </SkStage>
  );
};

// ——— WEB · G36 · SonorBooks: narrador, duración y dónde escucharlo ———
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('WEB');
  const fSonor = c.at('G36', 'sonorbooks');
  const fNarr = c.at('G36', 'lektora');
  const fDur = c.at('G36', 'czas');
  const fDonde = c.at('G36', 'gdzie');
  const fEnlace = c.voEnd('G36') + 6;
  const toFicha = ramp(frame, fNarr - 22, fNarr - 6);
  // Encuadre (coordenadas de la página a 1600×900, ventana de 1400 px de ancho → factor 0,875).
  const W = 1400;
  const k = W / 1600;
  const cam = [
    { f: 0, s: 0.96, x: 0, y: 30 },
    { f: fNarr - 20, s: 1, x: 0, y: 0 },
    { f: fNarr + 6, s: 1.9, x: -(1100 * k - W / 2) * 1.9, y: -(366 * k - 400) * 1.9 },
    { f: fDonde - 6, s: 1.9, x: -(1100 * k - W / 2) * 1.9, y: -(366 * k - 400) * 1.9 },
    { f: fDonde + 14, s: 1.5, x: -(1110 * k - W / 2) * 1.5, y: -(560 * k - 400) * 1.5 },
    { f: fEnlace - 8, s: 1.5, x: -(1110 * k - W / 2) * 1.5, y: -(560 * k - 400) * 1.5 },
    { f: fEnlace + 20, s: 0.86, x: 0, y: -40 },
  ];
  const kk = (p: string) => keyframes(frame, cam, p, easeInOut);
  const box = (x: number, y: number, w: number, h: number, a: number, b: number) => {
    const p = interpolate(frame, [a, a + 10, b - 8, b], [0, 1, 1, 0], clamp);
    if (p <= 0) return null;
    return <div style={{ position: 'absolute', left: x * k - 10, top: y * k - 10, width: w * k + 20, height: h * k + 20, borderRadius: 14, border: `${5 / kk('s')}px solid ${color.yellow}`, boxShadow: `0 0 0 ${4000}px rgba(16,16,16,${0.35 * p})`, opacity: p, transform: `scale(${1.06 - 0.06 * p})` }} />;
  };
  return (
    <SkStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `translate(${kk('x')}px, ${kk('y')}px) scale(${kk('s')})`, opacity: sp(frame, 0, 18, 140) }}>
          <BrowserWindow width={W} url={frame < fNarr - 14 ? 'sonorbooks.pl/audiobooki/?q=stephen+king' : 'sonorbooks.pl/audiobook/lsnienie/'}>
            <Img src={staticFile('skg/web/buscar.png')} style={{ position: 'absolute', left: 0, top: -interpolate(frame, [fSonor, fNarr - 22], [0, 120], { ...clamp, easing: easeInOut }), width: W, opacity: 1 - toFicha }} />
            <Img src={staticFile('skg/web/lsnienie.png')} style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: toFicha }} />
            {box(785, 355, 660, 36, fNarr - 2, fDonde)}
            {box(790, 395, 650, 345, fDonde + 6, fEnlace + 4)}
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 20px', background: '#fff', borderRadius: 999, boxShadow: shadow.float, opacity: rampOut(frame, fEnlace - 6, fEnlace + 6), fontFamily: font.sans, fontWeight: 700, fontSize: 36 }}>
          <LogoIcon size={46} /> sonorbooks.pl
        </div>
        <LinkBadge at={fEnlace} size={36} label="Link w opisie" />
      </div>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="zoom_in" at={fNarr - 2} volume={0.5} />
      <Sfx name="focus" at={fNarr} volume={0.6} />
      <Sfx name="focus" at={fDonde + 8} volume={0.6} />
      <Sfx name="zoom_out" at={fEnlace + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fEnlace + 2} volume={0.7} />
      {fDur > 0 && null}
    </SkStage>
  );
};
export const _l = { easeOut };

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { CheckIcon } from '../../components/Icons';
import { clamp, easeInOut, fmtEs } from '../../lib/anim';
import { BookPage, Chip, CropLv, LvLogo, LvTag, row } from './common';
import { itemAt, itemEnd, w } from './timeline';

const ID = 'Y01';

// Y01 · Arranque en frío con la voz real de un voluntario (Omar leyendo «El rayo de luna») → «¿Cómo puede ser?»
export const Y01Hook: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipAt = itemAt(ID, 'omar_cold');
  const clipEnd = itemEnd(ID, 'omar_cold');
  const at = (word: string, n = 0) => w(ID, 'L01', word, n);
  const fEsto = itemAt(ID, 'L01');
  const fIA = at('inteligencia');
  const fOmar = at('Omar');
  const fVol = at('voluntario');
  const fLV = at('LibriVox');
  const fMil = at('veintiún');
  const fGratis = at('gratis');
  const fLegal = at('legales');
  const fSin = at('registrarte') - 6;
  const fComo = at('Cómo', 1) - 4;

  // La página: protagonista durante el fragmento; luego sube y se aparta.
  const pageOut = interpolate(frame, [fOmar - 14, fOmar + 28], [0, 1], { ...clamp, easing: easeInOut });
  const zoom = interpolate(frame, [0, clipEnd], [1.0, 1.06], clamp);
  const iaS = spring({ frame: frame - fEsto, fps, config: { damping: 15, stiffness: 170 } });
  const iaOut = interpolate(frame, [fOmar - 10, fOmar + 10], [0, 1], { ...clamp, easing: easeInOut });
  const rowS = spring({ frame: frame - fOmar + 2, fps, config: { damping: 17, stiffness: 140 } });
  const rowOut = interpolate(frame, [fLV - 14, fLV + 14], [0, 1], { ...clamp, easing: easeInOut });
  const logoS = spring({ frame: frame - fLV + 4, fps, config: { damping: 14, stiffness: 150 } });
  const cnt = interpolate(frame, [fMil - 6, fMil + 30], [0, 21000], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cntS = spring({ frame: frame - fMil + 8, fps, config: { damping: 16, stiffness: 160 } });
  const out = interpolate(frame, [fComo - 10, fComo + 14], [0, 1], { ...clamp, easing: easeInOut });
  const q = spring({ frame: frame - fComo, fps, config: { damping: 13, stiffness: 160 } });
  const r = row('El rayo de luna');
  const r8 = row('El monte de las ánimas');
  const r10 = row('¡Es raro!');
  const K = 1500 / (r8.row[2] + 16);

  return (
    <Stage tone="warm">
      {/* Página del libro: el texto se resalta al ritmo de la voz del voluntario */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${pageOut * -460}px) scale(${zoom - pageOut * 0.16})`, opacity: 1 - pageOut * 0.85, filter: pageOut > 0.01 ? `blur(${pageOut * 3}px)` : undefined }}>
        <BookPage clip="omar_cold" clipAt={clipAt} title="El rayo de luna" author="Gustavo Adolfo Bécquer · Leyendas" width={1260} size={56}
          after="Lo que puedo decir es que en su fondo hay una verdad, una verdad muy triste…" />
      </AbsoluteFill>
      <LvTag at={clipAt + 12} until={fEsto + 30} voice="Omar Mojica" y={880} />

      <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.05})`, filter: out > 0.01 ? `blur(${out * 3}px)` : undefined }}>
        {/* «No es una IA: es una persona» */}
        <div style={{ position: 'absolute', left: 960, top: 110, transform: `translateX(-50%) scale(${0.8 + 0.2 * iaS})`, opacity: iaS * (1 - iaOut), padding: '18px 40px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 50, boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
          No es una IA: <span style={{ color: color.yellow }}>es una persona</span>
        </div>

        {/* La fila de la ficha de LibriVox: «El rayo de luna», leída por Omar */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: rowS * (1 - rowOut), transform: `translateY(${(1 - rowS) * 60 - rowOut * 80}px) scale(${0.92 + 0.08 * rowS})` }}>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: color.ink2, marginBottom: 18 }}>librivox.org · <i>Leyendas</i>, de Bécquer</div>
          <div style={{ position: 'relative', boxShadow: shadow.card, borderRadius: 18, overflow: 'hidden' }}>
            {/* Filas 08 a 10 de la ficha; la 09 («El rayo de luna», Omar) destacada */}
            <CropLv name="book" box={[r8.row[0] - 8, r8.row[1] - 4, r8.row[2] + 16, r10.row[1] + r10.row[3] - r8.row[1] + 8]} width={1500} radius={18} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: (r.row[1] - r8.row[1]) * K, background: 'rgba(252,250,243,0.72)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: (r.row[1] - r8.row[1] + r.row[3] + 4) * K, bottom: 0, background: 'rgba(252,250,243,0.72)' }} />
            <div style={{ position: 'absolute', left: (r.readerBox[0] - r8.row[0] + 8) * K - 10, top: (r.row[1] - r8.row[1] + 4) * K + 10, width: 270, height: r.row[3] * K - 20, borderRadius: 16, boxShadow: `0 0 0 6px ${color.yellow}`, opacity: interpolate(frame, [fVol - 8, fVol + 8], [0, 1], { ...clamp, easing: easeInOut }) }} />
          </div>
          <div style={{ marginTop: 26, opacity: interpolate(frame, [fVol - 4, fVol + 8], [0, 1], clamp) }}><Chip at={fVol - 4} size={34} bg={color.yellow}>Voluntario · sin cobrar</Chip></div>
        </AbsoluteFill>

        {/* LibriVox + 21.000 audiolibros + gratis, legales, sin registro */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, opacity: logoS }}>
          <div style={{ transform: `translateY(${(1 - logoS) * -40}px) scale(${0.85 + 0.15 * logoS})` }}><LvLogo width={560} /></div>
          <div style={{ opacity: cntS, transform: `translateY(${(1 - cntS) * 30}px)`, display: 'flex', alignItems: 'baseline', gap: 22, fontFamily: font.sans }}>
            <span style={{ fontSize: 46, fontWeight: 500, color: color.ink2 }}>más de</span>
            <span style={{ fontSize: 150, fontWeight: 700, letterSpacing: -5, fontVariantNumeric: 'tabular-nums' }}>{fmtEs(Math.round(cnt / 100) * 100)}</span>
            <span style={{ fontSize: 56, fontWeight: 700 }}><Highlight start={fMil + 24}>audiolibros</Highlight></span>
          </div>
          <div style={{ display: 'flex', gap: 26 }}>
            {[['Gratis', fGratis], ['Legales', fLegal], ['Sin registrarte', fSin]].map(([t, f]) => (
              <Chip key={t as string} at={(f as number) - 2} size={42}><CheckIcon size={44} />{t}</Chip>
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {frame >= fComo - 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
          <div style={{ transform: `scale(${0.85 + 0.15 * q})`, opacity: q }}>
            <Words text="¿Cómo puede" start={fComo - 4} size={140} weight={700} style={{ display: 'inline' }} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 140, letterSpacing: -2 }}><Highlight start={fComo + 10} dur={16}>ser?</Highlight></span>
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="page_turn" at={2} volume={0.7} />
      <Sfx name="ui_pop" at={clipAt + 12} volume={0.5} />
      <Sfx name="whoosh_soft" at={fEsto} volume={0.8} />
      <Sfx name="pop_bright" at={fIA + 4} volume={0.8} />
      <Sfx name="paper_slide" at={fOmar - 4} />
      <Sfx name="marker" at={fVol} />
      <Sfx name="logo_sting" at={fLV} volume={0.8} />
      <Sfx name="counter" at={fMil - 4} trimAfter={40} />
      <Sfx name="tick" at={fGratis} />
      <Sfx name="tick" at={fLegal} />
      <Sfx name="tick" at={fSin} />
      <Sfx name="whoosh_deep" at={fComo - 6} volume={0.7} />
      <Sfx name="marker" at={fComo + 10} />
    </Stage>
  );
};

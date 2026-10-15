import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { E, EbLogo, Grain, Stip } from './kit';
import { Door, LibCard, Phone, Plant } from './props';
import { AppPlayer } from './app';

loadBrandFonts();

// ---------------------------------------------------------------------------------------------------------------
// Miniatura del vídeo de eBiblio (y portada del artículo), en el mundo del vídeo («la puerta»): una pared rosa con la
// puerta abierta de la biblioteca, luz cálida y, dentro, un móvil con un audiolibro sonando; el carné delante.
// «Audiolibros GRATIS con el carné de tu biblioteca». El amarillo de SonorBooks, solo en la marca.
// ---------------------------------------------------------------------------------------------------------------
const FLOOR = 606;
const DW = 300, DH = 452, CW = 24;
const DX = 852, DY = FLOOR - DH - CW; // esquina del marco

const Design: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, overflow: 'hidden', background: E.pink }}>
    {/* pared y suelo */}
    <Stip kind="r" o={0.2} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: E.coral }}>
      <Stip kind="v" o={0.22} />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR - 18, height: 18, background: E.pinkDeep }} />
    {/* cartel de la biblioteca, con el logotipo de eBiblio */}
    <div style={{ position: 'absolute', left: DX + CW + DW / 2 - 150, top: DY - 104, width: 300, height: 84, borderRadius: 14, background: E.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 6px 0 ${E.pinkDeep}` }}>
      <EbLogo w={176} />
    </div>
    {/* planta a la izquierda de la puerta */}
    <div style={{ position: 'absolute', left: DX - 196, top: FLOOR - 236 }}><Plant size={230} pot={E.mustard} seed={1} /></div>
    {/* la puerta abierta: dentro, luz y el móvil con un audiolibro */}
    <div style={{ position: 'absolute', left: DX, top: DY }}>
      <Door w={DW} h={DH} casingW={CW} leaf={E.plum} casing={E.paper} open={0.86} glow={1}
        inside={
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 70% at 55% 42%, #FFFBF0 0%, #FBE7C2 55%, #F2C98F 100%)' }}>
            <div style={{ position: 'absolute', left: 64, top: 30, transform: 'rotate(4deg)' }}>
              <Phone w={196}><AppPlayer progress={0.34} speed="1,25×" timer="15 min" /></Phone>
            </div>
          </div>
        } />
    </div>
    {/* el carné, delante */}
    <div style={{ position: 'absolute', left: 1030, top: 452, transform: 'rotate(-11deg)', filter: 'drop-shadow(10px 12px 0 rgba(15,21,33,0.22))' }}>
      <LibCard w={236} />
    </div>
    {/* 0 € */}
    <div style={{ position: 'absolute', left: 1128, top: 110, width: 128, height: 128, borderRadius: '50%', background: E.mustard, color: E.ink, fontFamily: E.font, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(10deg)', boxShadow: `6px 6px 0 ${E.ink}`, fontWeight: 800, fontSize: 50, letterSpacing: '-0.02em', paddingTop: 6, boxSizing: 'border-box' }}>0&nbsp;€</div>

    {/* marca */}
    <div style={{ position: 'absolute', left: 52, top: 40, display: 'flex', alignItems: 'center', gap: 12, background: color.ink, border: `2px solid ${color.yellow}`, borderRadius: 999, padding: '8px 22px 8px 13px' }}>
      <LogoIcon size={40} />
      <span style={{ color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28 }}>SonorBooks</span>
    </div>
    {/* titular */}
    <div style={{ position: 'absolute', left: 50, top: 124, fontFamily: E.font, color: E.ink }}>
      <div style={{ fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: '-0.035em' }}>Audiolibros</div>
      <div style={{ fontWeight: 800, fontSize: 196, lineHeight: 0.92, letterSpacing: '-0.045em', color: E.paper, textShadow: `8px 8px 0 ${E.ink}`, marginTop: 6, marginLeft: -6 }}>GRATIS</div>
      <div style={{ display: 'inline-block', marginTop: 30, padding: '12px 26px 14px', borderRadius: 18, background: E.plum, color: E.paper, fontWeight: 700, fontSize: 40, letterSpacing: '-0.015em', boxShadow: `6px 6px 0 ${E.ink}` }}>
        con el carné de tu biblioteca
      </div>
      <div style={{ marginTop: 26, fontWeight: 600, fontSize: 34, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'inline-block', width: 34, height: 6, borderRadius: 3, background: E.ink }} />
        cómo usar eBiblio, paso a paso
      </div>
    </div>
    <Grain o={0.45} />
  </div>
);

// Composiciones: EBCover (1280×720), EBCover1080 (1920×1080), EBCoverOG (1200×630).
export const EBCover: React.FC = () => {
  const { width, height } = useVideoConfig();
  const k = Math.max(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: E.pink, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Design />
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, Img, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { cover, GoldText, img3, paperBg, T } from './kit';

loadBrandFonts();

// ---------------------------------------------------------------------------------------------------------------
// Miniatura del vídeo nuevo de LibriVox (y portada del artículo), con el mismo mundo que el vídeo: una biblioteca de
// noche, un libro abierto bajo un haz de luz y la palabra que suena subrayada; «GRATIS» en oro y un sello de lacre.
// ---------------------------------------------------------------------------------------------------------------
const WORDS = 'Yo no sé si esto es una historia que parece cuento o un cuento que parece historia; lo que puedo decir es que en su fondo hay una verdad…'.split(' ');
const ON = 15; // «parece»

const Book: React.FC = () => (
  <div style={{ position: 'absolute', left: 596, top: 196, width: 700, height: 470, transform: 'perspective(1500px) rotateX(16deg) rotateY(-16deg) rotateZ(4deg) scale(0.92)', transformStyle: 'preserve-3d' }}>
    <div style={{ position: 'absolute', left: -16, top: -14, width: 732, height: 498, borderRadius: 12, background: 'linear-gradient(135deg, #5a2a22, #3b1913 60%, #2c120e)', boxShadow: '0 50px 90px rgba(0,0,0,0.7)' }} />
    {/* izquierda: la portada de las Leyendas */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 350, height: 470, ...paperBg(T.paper), borderRadius: '8px 2px 2px 8px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0) 78%, rgba(90,60,20,0.25) 100%)' }} />
      <Img src={cover('5079')} style={{ position: 'absolute', left: 45, top: 70, width: 260, height: 260, borderRadius: 4, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 352, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.teal }}>leído por Omar</div>
    </div>
    {/* derecha: el texto, con la palabra que suena */}
    <div style={{ position: 'absolute', left: 350, top: 0, width: 350, height: 470, ...paperBg(T.paper), borderRadius: '2px 8px 8px 2px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(0,0,0,0) 80%, rgba(90,60,20,0.25) 100%)' }} />
      <div style={{ position: 'absolute', left: 36, right: 30, top: 44, fontFamily: T.serif, fontSize: 27, lineHeight: 1.5, color: T.inkFaint }}>
        {WORDS.map((wd, i) => (
          <span key={i} style={{ position: 'relative', color: i <= ON ? T.ink : T.inkFaint }}>
            {wd}
            {i === ON && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 1, height: 3, background: T.teal, borderRadius: 2 }} />}
            {i < WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
    {/* luz cálida */}
    <div style={{ position: 'absolute', left: -16, top: -14, width: 732, height: 498, borderRadius: 12, background: 'radial-gradient(70% 60% at 60% 30%, rgba(255,232,180,0.18) 0%, rgba(0,0,0,0) 70%)' }} />
  </div>
);

const Design: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, overflow: 'hidden' }}>
    {/* biblioteca de noche */}
    <div style={{ position: 'absolute', inset: -40, backgroundImage: `url(${img3('shelves.jpg')})`, backgroundSize: '2160px 900px', backgroundPosition: '-300px -60px', filter: 'blur(3px) brightness(0.5) saturate(0.9)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 75% at 72% 40%, rgba(255,200,130,0.28) 0%, rgba(255,200,130,0) 60%), linear-gradient(90deg, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.75) 40%, rgba(8,6,4,0.25) 70%, rgba(8,6,4,0.5) 100%)' }} />
    <div style={{ position: 'absolute', left: 760, top: -200, width: 320, height: 1200, transform: 'rotate(-24deg)', transformOrigin: '160px 0', background: 'linear-gradient(90deg, rgba(255,214,150,0) 0%, rgba(255,214,150,0.12) 50%, rgba(255,214,150,0) 100%)' }} />
    <Book />
    {/* sello de lacre: más de 21.000 libros */}
    <div style={{ position: 'absolute', left: 1060, top: 22, width: 190, height: 190, borderRadius: '50%', transform: 'rotate(12deg)',
      background: 'radial-gradient(circle at 38% 32%, #d4544a 0%, #a8322a 45%, #7a1f19 100%)', boxShadow: '0 16px 36px rgba(0,0,0,0.55), inset 0 0 0 10px rgba(0,0,0,0.12), inset 0 0 0 13px rgba(255,190,170,0.25)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff2e8', textAlign: 'center', lineHeight: 1, fontFamily: T.serif }}>
      <span style={{ fontSize: 26, fontStyle: 'italic' }}>más de</span>
      <span style={{ fontSize: 56, fontWeight: 600, letterSpacing: -1, marginTop: 4 }}>21.000</span>
      <span style={{ fontSize: 26, fontStyle: 'italic', marginTop: 6 }}>libros</span>
    </div>
    {/* marca */}
    <div style={{ position: 'absolute', left: 58, top: 44, display: 'flex', alignItems: 'center', gap: 12, background: color.ink, border: `2px solid ${color.yellow}`, borderRadius: 999, padding: '8px 22px 8px 13px' }}>
      <LogoIcon size={40} />
      <span style={{ color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28 }}>SonorBooks</span>
    </div>
    {/* titular */}
    <div style={{ position: 'absolute', left: 56, top: 128, color: T.cream }}>
      <div style={{ fontFamily: '"TeX Gyre Heros", Helvetica, Arial, sans-serif', fontSize: 80, letterSpacing: -2, lineHeight: 1 }}>Libri<b>Vox</b></div>
      <div style={{ fontFamily: T.serif, fontSize: 64, lineHeight: 1, marginTop: 30 }}>Audiolibros</div>
      <div style={{ marginTop: -4, marginLeft: -6 }}><GoldText text="GRATIS" size={176} sweep={0.42} layers={12} /></div>
      <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 64, lineHeight: 1, marginTop: -6 }}>y legales</div>
      <div style={{ display: 'inline-block', marginTop: 34, padding: '10px 26px 12px', borderRadius: 999, border: `3px solid ${T.gold}`, fontFamily: T.serif, fontSize: 40, color: T.gold }}>cómo se usa, paso a paso</div>
    </div>
  </div>
);

// Composiciones: LVGuideCover (1280×720), LVGuideCover1080 (1920×1080), LVGuideCoverOG (1200×630).
export const LVGuideCover: React.FC = () => {
  const { width, height } = useVideoConfig();
  const k = Math.max(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: T.night, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Design />
      </div>
    </AbsoluteFill>
  );
};

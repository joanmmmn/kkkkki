import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Grow } from '../../components/Grow';
import { CheckIcon, HeadphonesIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { EltPlate } from '../elt2/Cover';
import { EverandIcon, Pop } from './ui';

const Plan: React.FC<{ name: string; price: string; what: React.ReactNode; dim?: boolean; hot?: boolean; icon?: React.ReactNode }> = ({ name, price, what, dim, hot, icon }) => (
  <div style={{ width: 500, height: 500, boxSizing: 'border-box', padding: '40px 44px', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `${hot ? 4 : 1}px solid ${hot ? color.yellow : color.line}`, opacity: dim ? 0.55 : 1, fontFamily: font.sans, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 48, fontWeight: 700, height: 80 }}>{icon}{name}</div>
    <div style={{ marginTop: 26, fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{price}</div>
    <div style={{ fontSize: 34, color: color.ink2, marginTop: 4 }}>al mes</div>
    <div style={{ marginTop: 'auto' }}>{what}</div>
  </div>
);

// R11 · ¿Para quién es? 1-2 libros al mes y novedades → Plus. Si escuchas más: Audible 9,99 € y Storytel 8,99 € ilimitados. Clásicos gratis: El Libro Total.
export const R11Who: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R11', w, n, fb);
  const fUno = at('uno', 0, 2.08);
  const fNov = at('novedades', 0, 4.0);
  const fPlus = at('Plus', 0, 5.2);
  const fComp = at('compensar', 0, 5.8);
  const fSi2 = at('Si', 1, 6.83);
  const fAud = at('Audible', 0, 8.0);
  const fIlim = at('ilimitada', 0, 9.2);
  const fSt = at('Storytel', 0, 13.36);
  const fY = at('Y', 0, 16.88);
  const fClas = at('clasicos', 0, 17.24);
  const fElt = at('El', 0, 19.44);
  const pB = fSi2 - 6;
  const pC = fY - 4;
  const ok = spring({ frame: frame - fComp, fps, config: { damping: 10, stiffness: 200 } });
  const big = (t: string) => <div style={{ fontSize: 44, fontWeight: 700 }}>{t}</div>;
  return (
    <Stage tone="warm">
      <Phase from={0} to={pB}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60, fontFamily: font.sans }}>
          <Words text="¿Para quién es?" start={2} size={110} weight={700} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
            <Pop at={fUno - 8}>
              <div style={{ width: 740, padding: '40px 50px', boxSizing: 'border-box', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 56, fontWeight: 700 }}><HeadphonesIcon size={64} /> <span style={{ whiteSpace: 'nowrap' }}>1 o 2 libros al mes</span></div>
                <Pop at={fNov - 6}><div style={{ fontSize: 46, fontWeight: 500, color: color.ink2 }}>+ buscas novedades</div></Pop>
              </div>
            </Pop>
            <Pop at={fPlus - 10}>
              <svg width="90" height="50" viewBox="0 0 90 50"><path d="M4 25h74M60 8l18 17-18 17" stroke={color.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Pop>
            <Pop at={fPlus - 6}>
              <div style={{ position: 'relative', width: 540, padding: '40px 50px', boxSizing: 'border-box', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `4px solid ${color.yellow}`, display: 'flex', alignItems: 'center', gap: 26 }}>
                <EverandIcon size={110} />
                <div>
                  <div style={{ fontSize: 56, fontWeight: 700 }}>Plus</div>
                  <div style={{ fontSize: 36, color: color.ink2 }}>14,99 € · 3 libros</div>
                </div>
                <div style={{ position: 'absolute', right: -26, top: -26, transform: `scale(${ok}) rotate(${(1 - ok) * -30}deg)` }}><CheckIcon size={80} /></div>
              </div>
            </Pop>
          </div>
          <div style={{ height: 60 }}><Pop at={fComp + 2}><div style={{ fontSize: 46, fontWeight: 700 }}>Puede compensar</div></Pop></div>
        </AbsoluteFill>
      </Phase>

      <Phase from={pB} to={pC}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50, fontFamily: font.sans }}>
          <Words text="Si escuchas más…" start={4} size={92} weight={700} />
          <div style={{ display: 'flex' }}>
            <Grow at={6} w={500} first>
              <Plan name="Everand Plus" icon={<EverandIcon size={56} />} price="14,99 €" what={big('3 libros')} dim={frame >= fAud} />
            </Grow>
            <Grow at={fAud - pB - 6} w={500} gap={44}>
              <Plan name="Audible" price="9,99 €" hot what={<div><div style={{ fontSize: 44, fontWeight: 700 }}><span style={{ background: color.yellow, padding: '0 10px', borderRadius: 10 }}>Ilimitado</span></div><div style={{ fontSize: 28, color: color.muted, marginTop: 8 }}>de su catálogo</div></div>} />
            </Grow>
            <Grow at={fSt - pB - 6} w={500} gap={44}>
              <Plan name="Storytel" price="8,99 €" hot what={<div style={{ fontSize: 44, fontWeight: 700 }}><span style={{ background: color.yellow, padding: '0 10px', borderRadius: 10 }}>Ilimitado</span></div>} />
            </Grow>
          </div>
          <div style={{ fontSize: 26, color: color.muted, opacity: spring({ frame: frame - fIlim, fps }) }}>Precios en España, octubre de 2026</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={pC} to={dur}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50, fontFamily: font.sans }}>
          <Pop at={fClas - pC - 6}><div style={{ fontSize: 80, fontWeight: 700 }}>¿Clásicos gratis?</div></Pop>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <Pop at={fElt - pC - 10} from={0.6}><EltPlate w={700} rotate={-3} /></Pop>
            <Pop at={fElt - pC + 4} from={0.5}>
              <div style={{ fontSize: 200, fontWeight: 700, letterSpacing: -8, lineHeight: 1 }}>0 €</div>
              <div style={{ fontSize: 40, fontWeight: 500, color: color.ink2 }}>y legal · ver nuestra reseña</div>
            </Pop>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_soft" at={2} volume={0.7} />
      <Sfx name="card_flip" at={fUno - 6} />
      <Sfx name="ui_pop" at={fNov - 4} />
      <Sfx name="whoosh_fast" at={fPlus - 10} volume={0.6} />
      <Sfx name="card_flip" at={fPlus - 4} />
      <Sfx name="success" at={fComp} />
      <Sfx name="swipe" at={pB} />
      <Sfx name="card_flip" at={fAud - 4} />
      <Sfx name="marker" at={fIlim} />
      <Sfx name="card_flip" at={fSt - 4} />
      <Sfx name="swipe" at={pC} />
      <Sfx name="ui_pop" at={fClas - 4} />
      <Sfx name="whoosh_deep" at={fElt - 10} volume={0.7} />
      <Sfx name="sparkle" at={fElt + 6} />
    </Stage>
  );
};

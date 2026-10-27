import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeOut } from '../../lib/anim';
import { EverandBadge, EV_LIME, Pop, ScribdBadge, Strike } from './ui';

// Muro de portadas de la portada de everand.com, desenfocado y en deriva lenta.
const Wall: React.FC<{ dim: number }> = ({ dim }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -260 - t * 9, top: -380, display: 'flex', gap: 0, transform: 'rotate(-8deg)', filter: 'blur(3px) saturate(1.1)', opacity: 0.55 * dim }}>
        {[0, 1, 2, 3].map((i) => <Img key={i} src={staticFile('evd/img/hero_collage.jpg')} style={{ width: 760, display: 'block' }} />)}
      </div>
      <div style={{ position: 'absolute', left: -200 - t * 9, top: 380, display: 'flex', transform: 'rotate(-8deg)', filter: 'blur(3px) saturate(1.1)', opacity: 0.55 * dim }}>
        {[0, 1, 2, 3].map((i) => <Img key={i} src={staticFile('evd/img/hero_collage.jpg')} style={{ width: 760, display: 'block' }} />)}
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(18,19,22,0.72) 0%, rgba(18,19,22,0.9) 60%, rgba(18,19,22,0.97) 100%)' }} />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: font.sans, fontSize: 34, letterSpacing: 8, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>{children}</div>
);

// R01 · «El Netflix de los libros» → hoy se llama Everand → con el plan más barato, un libro al mes. Sí: uno.
export const R01Hook: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R01', w, n, fb);
  const fScribd = at('Scribd', 0, 1.12);
  const fEl = at('el', 0, 2.4);
  const fNetflix = at('Netflix', 0, 2.64);
  const fHoy = at('Hoy', 0, 4.32);
  const fEverand = at('Everand', 0, 5.12);
  const fY = at('y', 0, 6.12);
  const fPlan = at('plan', 0, 6.56);
  const fLibro = at('libro', 0, 8.16);
  const fMes = at('mes', 0, 8.56);
  const fSi = at('Si', 0, 9.28);
  const fUno = at('uno', 0, 9.92);
  const fQue = at('Que', 0, 10.72);
  const fY2 = at('Y', 0, 11.92);
  const fPena = at('pena', 0, 13.04);
  // Golpe del «1»: crece y sacude la cámara al decir «Sí: uno».
  const big = spring({ frame: frame - fSi + 2, fps, config: { damping: 13, stiffness: 150 } });
  const shake = frame >= fUno ? Math.exp(-(frame - fUno) / 6) * Math.sin((frame - fUno) * 2.4) * 10 : 0;
  const ring = interpolate(frame, [fEverand, fEverand + 26], [0, 1], clamp);
  const quote = ['«el', 'Netflix', 'de', 'los', 'libros»'];
  // Dentro de cada Phase el contador vuelve a 0: los instantes que se pasan a sus hijos van relativos a su inicio.
  const p2 = fHoy - 2;
  const p3 = fY - 2;
  const p4 = fQue - 2;
  return (
    <Stage tone="night">
      <Wall dim={1} />
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
        <Phase from={0} to={fHoy - 2}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
            <Pop at={2}><Kicker>DURANTE AÑOS, A</Kicker></Pop>
            <Pop at={fScribd - 4}><ScribdBadge size={84} /></Pop>
            <Pop at={fScribd + 14}><Kicker>LO LLAMARON</Kicker></Pop>
            <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 150, color: '#fff', display: 'flex', gap: 34, lineHeight: 1.05, marginTop: 6 }}>
              {quote.map((w, i) => {
                const s = spring({ frame: frame - (w === 'Netflix' ? fNetflix : fEl + i * 4) + 3, fps, config: { damping: 18, stiffness: 170 } });
                return (
                  <span key={w} style={{ display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 50}px)`, filter: `blur(${(1 - s) * 10}px)` }}>
                    {w === 'Netflix' ? <Highlight start={fNetflix + 10} dur={12} fill="rgba(255,202,5,0.85)" height={0.3}>{w}</Highlight> : w}
                  </span>
                );
              })}
            </div>
          </AbsoluteFill>
        </Phase>

        <Phase from={p2} to={p3}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60 }}>
            <Kicker>HOY SE LLAMA</Kicker>
            <div style={{ display: 'flex', alignItems: 'center', gap: 70 }}>
              <div style={{ position: 'relative', opacity: interpolate(frame, [fEverand - 6, fEverand + 8], [1, 0.45], clamp) }}>
                <ScribdBadge size={74} />
                <Strike at={fHoy + 14 - p2} thick={10} rotate={-8} />
              </div>
              <svg width="90" height="50" viewBox="0 0 90 50" style={{ opacity: interpolate(frame, [fHoy + 18, fHoy + 26], [0, 1], clamp) }}>
                <path d="M4 25h74M60 8l18 17-18 17" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="140" strokeDashoffset={140 * (1 - interpolate(frame, [fHoy + 18, fEverand - 2], [0, 1], { ...clamp, easing: easeOut }))} />
              </svg>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -10, top: -10, width: 172, height: 172, borderRadius: 44, border: `8px solid ${EV_LIME}`, opacity: (1 - ring) * (frame >= fEverand ? 1 : 0), transform: `scale(${1 + ring * 0.6})` }} />
                <Pop at={fEverand - 3 - p2} from={0.6}><EverandBadge size={152} dark /></Pop>
              </div>
            </div>
          </AbsoluteFill>
        </Phase>

        <Phase from={p3} to={p4}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
            <Pop at={2}><div style={{ fontFamily: font.sans, fontSize: 52, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Con su plan más barato</div></Pop>
            <div style={{ display: 'flex', alignItems: 'center', gap: 90, height: 520 }}>
              <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1, opacity: 1 - big, transform: `scale(${1 - 0.4 * big})`, width: 330 * (1 - big), overflow: 'visible' }}>
                <Pop at={fPlan - p3}>∞</Pop>
                <Strike at={fPlan + 16 - p3} thick={16} rotate={-12} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
                <Pop at={fLibro - 6 - p3} from={0.4}>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 400 + 110 * big, lineHeight: 0.8, color: color.yellow, textShadow: '0 20px 60px rgba(255,202,5,0.35)' }}>1</div>
                </Pop>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, marginBottom: 6 }}>
                  <Pop at={fMes - 6 - p3}><div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: '#fff' }}>libro<br /><span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>al mes</span></div></Pop>
                  <div style={{ height: 120 }}>
                    {frame >= fSi - 2 && (
                      <Pop at={fSi - 2 - p3} from={1.6} rise={0} damping={12}>
                        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, color: color.ink, background: color.yellow, padding: '4px 36px 12px', borderRadius: 22, transform: 'rotate(-3deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>Sí: uno.</div>
                      </Pop>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </Phase>

        <Phase from={p4} to={dur} out={1}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
            <Words text="¿Qué ha pasado?" start={2} size={130} weight={700} color="#fff" />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: '#fff', opacity: spring({ frame: frame - fY2 + 3, fps }), transform: `translateY(${(1 - spring({ frame: frame - fY2 + 3, fps })) * 40}px)` }}>
              ¿Y sigue mereciendo <Highlight start={fPena + 4 - p4} dur={12}>la pena?</Highlight>
            </div>
          </AbsoluteFill>
        </Phase>
      </AbsoluteFill>

      <Sfx name="whoosh_soft" at={2} volume={0.8} />
      <Sfx name="ui_pop" at={fScribd - 2} />
      <Sfx name="page_riffle" at={fEl} volume={0.7} />
      <Sfx name="marker" at={fNetflix + 10} />
      <Sfx name="swipe" at={fHoy - 2} />
      <Sfx name="pencil_strike" at={fHoy + 14} />
      <Sfx name="whoosh_fast" at={fHoy + 18} volume={0.7} />
      <Sfx name="logo_sting" at={fEverand - 2} />
      <Sfx name="swipe" at={fY - 2} />
      <Sfx name="pop" at={fPlan} />
      <Sfx name="cross" at={fPlan + 16} />
      <Sfx name="hit_soft" at={fLibro - 4} />
      <Sfx name="impact" at={fSi} />
      <Sfx name="stamp" at={fSi + 2} />
      <Sfx name="bass_drop" at={fUno} volume={0.8} />
      <Sfx name="whoosh_soft" at={fQue - 2} />
      <Sfx name="ui_pop" at={fY2} />
      <Sfx name="marker" at={fPena + 4} />
    </Stage>
  );
};

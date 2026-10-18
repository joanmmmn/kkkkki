import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { typeTimesSpoken } from '../../lib/typing';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Typewriter, Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { wf } from './timeline';
import { color, font, Kicker, LinkBadge, MaskTitle, MpStage, PKey, PLAT, PlatTile, SceneProps, shadow, Sheen, useSpring } from './kit';
import { ELEVEN } from './Intro';

type P = SceneProps;

// Fila del veredicto: perfil → plataforma (icono, nombre y por qué).
const Pick: React.FC<{ at: number; who: string; k: PKey; extra?: PKey; why: string; dimAt?: number; w?: number }> = ({ at, who, k, extra, why, dimAt, w = 820 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 170 } });
  const line = interpolate(frame, [at + 4, at + 16], [0, 1], { ...clamp, easing: easeOut });
  const dim = dimAt !== undefined ? interpolate(frame, [dimAt - 2, dimAt + 10], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  return (
    <div style={{ width: w, display: 'flex', alignItems: 'center', gap: 18, opacity: frame < at - 1 ? 0.0 : Math.min(1, s * 1.4) * (1 - 0.45 * dim), transform: `translateX(${(1 - s) * -40}px) scale(${1 - 0.03 * dim})`, transformOrigin: 'left center' }}>
      <div style={{ width: 420, padding: '16px 26px', borderRadius: 22, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34, lineHeight: 1.12, flexShrink: 0 }}>{who}</div>
      <div style={{ width: 40 * line, height: 4, borderRadius: 2, background: color.yellow, flexShrink: 0 }} />
      <PlatTile k={k} size={82} />
      {extra && <PlatTile k={extra} size={82} />}
      <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, lineHeight: 1.2, color: color.ink2, opacity: line }}>{why}</div>
    </div>
  );
};

// Z24 · Veredicto: cuál te conviene según cómo escuches.
export const Z24Veredicto: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('Z24', w, n);
  const picks = [
    { f: at('mucho'), who: 'Escuchas mucho', k: 'storytel' as PKey, extra: 'audible' as PKey, why: 'Storytel 8,99 € (y ebooks) · Audible 9,99 € (Originals)' },
    { f: at('uno'), who: 'Uno o dos libros al mes', k: 'podimo' as PKey, why: '4,99 € con 20 h' },
    { f: at('lees'), who: 'Lees tanto como escuchas', k: 'nextory' as PKey, why: 'Ebooks y audiolibros, 4 perfiles' },
    { f: at('ingles'), who: 'También en inglés', k: 'bookbeat' as PKey, why: 'Catálogo enorme en otros idiomas' },
    { f: at('spotify'), who: 'Ya pagas Spotify Premium', k: 'spotify' as PKey, why: 'Empieza por tus 12 h al mes' },
    { f: at('tuyos'), who: 'Quieres que sean tuyos', k: 'audiobooks' as PKey, why: 'Un crédito = un libro para siempre' },
  ];
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, top: 80 }}>
          <Kicker at={lead - 6} text="Veredicto" />
          <MaskTitle text="¿Cuál te conviene?" hi="conviene" at={lead - 3} size={92} />
        </div>
        <div style={{ position: 'absolute', left: 130, top: 270, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {picks.map((p, i) => <Pick key={p.who} at={p.f - 3} who={p.who} k={p.k} extra={p.extra} why={p.why} dimAt={picks[i + 1] ? picks[i + 1].f - 3 : undefined} w={1660} />)}
        </div>
      </AbsoluteFill>
      {picks.map((p) => <Sfx key={p.who} name="ui_pop" at={p.f - 2} volume={0.65} />)}
      <Sfx name="whoosh_soft" at={lead - 6} volume={0.5} />
    </MpStage>
  );
};

// Z25 · Sin pagar nada: eBiblio para novedades (con espera), LibriVox y El Libro Total para clásicos y ElevenReader para tus PDF.
export const Z25Gratis: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z25', w, n);
  const cards: { k: PKey; f: number; t: string; s: string }[] = [
    { k: 'ebiblio', f: at('ebiblio'), t: 'Novedades', s: 'Si no te importa esperar' },
    { k: 'librivox', f: at('librivox'), t: 'Clásicos', s: 'Voces de voluntarios' },
    { k: 'elt', f: at('total'), t: 'Clásicos', s: 'Con audiolectura' },
    { k: 'elevenreader', f: at('elevenreader'), t: 'Tus PDF', s: 'Gratis 10 h al mes' },
  ];
  const W = 400, G = 26;
  const x0 = (1920 - (4 * W + 3 * G)) / 2;
  return (
    <MpStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: x0, top: 150 }}>
          <Kicker at={lead - 4} text="Veredicto · gratis" />
          <MaskTitle text="¿Y sin pagar nada?" hi="nada" at={lead - 2} size={92} />
        </div>
        {cards.map((c, i) => {
          const s = spring({ frame: frame - c.f + 3, fps, config: { damping: 14, stiffness: 160 } });
          return (
            <div key={c.k} style={{ position: 'absolute', left: x0 + i * (W + G), top: 420, width: W, height: 420, borderRadius: 34, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`,
              padding: '36px 34px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, opacity: frame < c.f - 3 ? 0 : Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 70}px) rotate(${(1 - s) * (i % 2 ? 4 : -4)}deg)` }}>
              <PlatTile k={c.k} size={110} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.5, color: color.ink, marginTop: 14 }}>{c.t}</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>{c.s}</div>
              <div style={{ marginTop: 'auto', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.green }}>0 €</div>
              <Sheen at={c.f + 10} radius={34} />
            </div>
          );
        })}
      </AbsoluteFill>
      {cards.map((c) => <Sfx key={c.k} name="card_flip" at={c.f - 2} volume={0.6} />)}
    </MpStage>
  );
};

// Z26 · Cierre: las diez reseñas en el canal, el artículo en la descripción, la pregunta para los comentarios y la marca
// (buscador «Tu próximo libro» y «Tu próxima historia te está esperando»). La mitad de abajo queda libre al final (pantalla final).
export const Z26Cierre: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('Z26', w, n);
  const fDiez = at('once');
  const fCanal = at('canal');
  const fArt = at('articulo');
  const fCual = at('usas');
  const fComent = at('comentarios');
  const fEncuentra = at('encuentra');
  const fTu = at('tu', 1);
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fSonor = at('sonorbooks');
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fSonor - 8]], 'z26');
  const end = fSonor + 34;
  const sAsk = spring({ frame: frame - fCual + 2, fps, config: { damping: 12, stiffness: 190 } });
  const p1Out = fEncuentra - 6;
  return (
    <MpStage>
      {/* 1 · Las diez reseñas y el artículo */}
      <Phase from={0} to={p1Out}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 130, top: 110 }}>
            <Kicker at={2} text="En el canal" />
            <MaskTitle text="Las once, reseñadas a fondo" hi="once" at={5} size={84} />
          </div>
          <div style={{ position: 'absolute', left: 130, top: 330, display: 'grid', gridTemplateColumns: 'repeat(6, 150px)', gap: 26 }}>
            {ELEVEN.map((k, i) => {
              const s = spring({ frame: frame - fDiez - i * 3, fps, config: { damping: 13, stiffness: 190 } });
              return <PlatTile key={k} k={k} size={150} style={{ opacity: frame < fDiez - 1 ? 0 : s, transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + 0.2 * s})` }} />;
            })}
          </div>
          <div style={{ position: 'absolute', left: 130, top: 720 }}>
            <LinkBadge at={fArt - 6} label="La comparativa entera, en la descripción" size={36} />
          </div>
          {frame >= fCual - 4 && (
            <div style={{ position: 'absolute', right: 140, top: 420, width: 560, padding: '34px 38px', borderRadius: '36px 36px 36px 8px', background: color.yellow, boxShadow: '0 30px 70px rgba(16,16,16,0.2)',
              opacity: Math.min(1, sAsk * 1.4), transform: `scale(${0.7 + 0.3 * sAsk}) rotate(${(1 - sAsk) * -6}deg)`, transformOrigin: 'left bottom' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, letterSpacing: -1.5, color: color.ink }}>¿Cuál usas tú?</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink, marginTop: 10, opacity: interpolate(frame, [fComent - 4, fComent + 10], [0, 1], clamp) }}>Cuéntanoslo en los comentarios 👇</div>
            </div>
          )}
        </AbsoluteFill>
      </Phase>
      {/* 2 · El buscador de SonorBooks */}
      <Phase from={p1Out - 2} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={p1Out + 2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text={query} times={keys} placeholder="Busca un libro" />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fEncuentra, fps }) }}>Dónde escucharlo, y a qué precio</div>
        </AbsoluteFill>
      </Phase>
      {/* 3 · La marca, en la mitad de arriba (abajo, la pantalla final de YouTube) */}
      <Phase from={end} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 150, flexDirection: 'column', gap: 30, background: '#fff' }}>
          <Logo size={140} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={58} weight={500} />
          <div style={{ opacity: spring({ frame: frame - end - 30, fps }) }}><Pill size={38}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 20, color: color.muted, marginTop: -4, opacity: spring({ frame: frame - end - 50, fps }) }}>
            Enlaces de afiliado en la descripción: si contratas, SonorBooks puede recibir una comisión, sin coste para ti.
          </div>
        </AbsoluteFill>
      </Phase>
      {ELEVEN.map((_, i) => <Sfx key={i} name="tick_soft" at={fDiez + i * 3 + 4} volume={0.35} />)}
      <Sfx name="ui_pop" at={fArt - 4} volume={0.6} />
      <Sfx name="pop" at={fCual} volume={0.7} />
      <Sfx name="whoosh_soft" at={p1Out} volume={0.6} />
      <Sfx name="logo_sting" at={p1Out + 6} />
      <Keystrokes text={query} times={keys} volume={0.9} seed="z26" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
      {fCanal > 0 && null}
    </MpStage>
  );
};

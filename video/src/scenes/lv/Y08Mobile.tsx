import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words, Typewriter } from '../../components/Kinetic';
import { Phone } from '../../components/Phone';
import { CrossIcon, CheckIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { IcDownload } from '../er/icons';
import { clamp, easeOut } from '../../lib/anim';
import { B, Chip, Cover, LvWeb, lvw, markOn } from './common';
import { w } from './timeline';

const ID = 'Y08';
const FPS = 50;
const RSS = 'librivox.org/rss/5079';
const EPS = B['book:readers'].slice(0, 8);

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return `${h * 60 + m} min`; };

// App de pódcasts genérica (sin marca) con el RSS del libro: los capítulos son episodios y se descargan.
const PodcastApp: React.FC<{ typeAt: number; feedAt: number; dlAt: number; offAt: number }> = ({ typeAt, feedAt, dlAt, offAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const feed = spring({ frame: frame - feedAt, fps, config: { damping: 18, stiffness: 150 } });
  const off = spring({ frame: frame - offAt, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F7F6F2', fontFamily: font.sans, color: color.ink, padding: '64px 26px 0' }}>
      <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Pódcasts</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderRadius: 16, background: '#fff', border: `2px solid ${frame < feedAt ? color.yellow : color.line}`, fontSize: 22 }}>
        <span style={{ color: color.muted, whiteSpace: 'nowrap' }}>URL</span>
        <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden' }}><Typewriter text={RSS} start={typeAt} cps={30} caret={frame < feedAt} /></span>
      </div>
      <div style={{ opacity: feed, transform: `translateY(${(1 - feed) * 40}px)` }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', margin: '24px 0 14px' }}>
          <Cover id="5079" size={124} />
          <div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Leyendas</div>
            <div style={{ fontSize: 20, color: color.ink2 }}>Gustavo Adolfo Bécquer</div>
            <div style={{ fontSize: 18, color: color.muted, marginTop: 4 }}>LibriVox · 22 episodios</div>
          </div>
        </div>
        {EPS.map((e, i) => {
          const d = interpolate(frame, [dlAt + i * 5, dlAt + i * 5 + 22], [0, 1], { ...clamp, easing: easeOut });
          const sIn = spring({ frame: frame - feedAt - 6 - i * 3, fps, config: { damping: 18, stiffness: 170 } });
          return (
            <div key={e.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 4px', borderBottom: `1px solid ${color.line}`, opacity: sIn, transform: `translateX(${(1 - sIn) * 30}px)` }}>
              <div style={{ width: 34, fontSize: 18, fontWeight: 700, color: color.muted }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                <div style={{ fontSize: 17, color: color.muted }}>{e.reader} · {mins((e as unknown as { time: string }).time)}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: d >= 1 ? color.green : '#fff', border: d >= 1 ? 'none' : `2px solid ${color.line}`, position: 'relative' }}>
                {d >= 1 ? <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : <IcDownload size={22} w={2.4} />}
                {d > 0 && d < 1 && <svg width="48" height="48" style={{ position: 'absolute', left: -2, top: -2, transform: 'rotate(-90deg)' }}><circle cx="24" cy="24" r="21" fill="none" stroke={color.green} strokeWidth="4" strokeDasharray={132} strokeDashoffset={132 * (1 - d)} /></svg>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 26, right: 26, bottom: 46, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 20, background: color.ink, color: '#fff', fontSize: 24, fontWeight: 700, opacity: off, transform: `translateY(${(1 - off) * 40}px)` }}>
        <svg width="34" height="34" viewBox="0 0 24 24"><path d="M2.5 13.5 21 6l-7.5 18-2.2-7.7z" fill={color.yellow} /></svg>
        Descargado: se escucha sin conexión
      </div>
    </div>
  );
};

// Y08 · En el móvil: no hay app oficial · el botón RSS en una app de pódcasts · apps gratuitas de terceros.
export const Y08Mobile: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L08', word, n);
  const fApp = at('app');
  const fWeb = at('único');
  const fRSS = at('truco') - 8;
  const fCopia = at('copia');
  const fPega = at('pégalo') - 6;
  const fEpis = at('episodio');
  const fDesc = at('descargarlo');
  const fSin = at('conexión') - 6;
  const fPref = at('prefieres') - 6;
  const fOtros = at('otros');
  const noS = spring({ frame: frame - fApp + 4, fps, config: { damping: 14, stiffness: 180 } });
  const qS = spring({ frame: frame - fWeb + 2, fps, config: { damping: 16, stiffness: 150 } });
  const rss = B['book:btn:RSS'];
  const s = (f: number) => (f - fRSS) / FPS;
  const linkS = spring({ frame: frame - fCopia - 6, fps, config: { damping: 15, stiffness: 160 } });
  const phoneS = spring({ frame: frame - fPega, fps, config: { damping: 18, stiffness: 130 } });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fRSS}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <Words text="¿Y en el móvil?" start={0} size={104} weight={700} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 40px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, fontFamily: font.sans, fontSize: 52, fontWeight: 700, opacity: noS, transform: `scale(${0.85 + 0.15 * noS})` }}>
            <CrossIcon size={62} /> No hay app oficial
          </div>
          <div style={{ maxWidth: 1300, textAlign: 'center', fontFamily: font.serif, fontSize: 56, fontStyle: 'italic', color: color.ink2, opacity: qS, transform: `translateY(${(1 - qS) * 24}px)` }}>
            «Nuestro único canal oficial es la web LibriVox.org»
            <div style={{ fontFamily: font.sans, fontStyle: 'normal', fontSize: 26, color: color.muted, marginTop: 14 }}>LibriVox, septiembre de 2026</div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fRSS} to={fPega}>
        <AbsoluteFill>
          <LvWeb states={[{ at: 0, src: lvw('book') }]} page="book" width={1500} y={20}
            camera={[{ f: 0, zoom: 1.2, x: 330, y: 560 }, { f: 30, zoom: 1.75, x: 330, y: 600 }]}
            marks={[markOn(rss, 4, 400, 8)]}
            cursor={[{ t: 0, x: 600, y: 700, down: false }, { t: s(fCopia - 8), x: rss[0] + 40, y: rss[1] + 14, down: false }, { t: s(fCopia - 2), x: rss[0] + 40, y: rss[1] + 14, down: true }, { t: s(fCopia + 4), x: rss[0] + 40, y: rss[1] + 14, down: false }]}
            overlay={(f) => {
              const m = spring({ frame: f - (fCopia - fRSS), fps, config: { damping: 18, stiffness: 220 } });
              return (
                <div style={{ position: 'absolute', left: rss[0] + 46, top: rss[1] + 22, width: 252, padding: '6px 0', borderRadius: 8, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.22)', fontFamily: font.sans, fontSize: 12, opacity: m, transform: `scale(${0.9 + 0.1 * m})`, transformOrigin: '0 0' }}>
                  {['Abrir enlace en una pestaña nueva', 'Copiar dirección del enlace', 'Guardar enlace como…'].map((t, i) => (
                    <div key={t} style={{ padding: '6px 14px', background: i === 1 ? color.yellowSoft : 'transparent', fontWeight: i === 1 ? 700 : 400 }}>{t}</div>
                  ))}
                </div>
              );
            }} />
          <div style={{ position: 'absolute', left: 960, top: 930, transform: `translateX(-50%) translateY(${(1 - linkS) * 30}px)`, opacity: linkS, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 36, fontWeight: 700, boxShadow: shadow.float }}>
            Copiado: <span style={{ color: color.yellow }}>{RSS}</span>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fPega} to={fPref}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90 }}>
          <div style={{ transform: `translateY(${(1 - phoneS) * 160}px) rotate(${(1 - phoneS) * 6}deg)` }}>
            <Phone height={880}>
              <PodcastApp typeAt={4} feedAt={fEpis - fPega - 30} dlAt={fDesc - fPega} offAt={fSin - fPega} />
            </Phone>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 640 }}>
            <Chip at={6} size={40}>Pega el enlace RSS</Chip>
            <Chip at={fEpis - fPega - 10} size={40}>Capítulo = episodio</Chip>
            <Chip at={fDesc - fPega - 4} size={40} bg={color.yellow}>Descárgalo</Chip>
            <Chip at={fSin - fPega} size={40} bg={color.ink} fg="#fff">Sin conexión</Chip>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fPref} to={dur} out={6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 46 }}>
          <Words text="¿Prefieres una app?" start={0} size={92} weight={700} />
          <div style={{ display: 'flex', gap: 30 }}>
            {[0, 1, 2].map((i) => {
              const s2 = spring({ frame: frame - fPref - 10 - i * 6, fps, config: { damping: 15, stiffness: 170 } });
              return (
                <div key={i} style={{ width: 420, padding: '30px 30px', borderRadius: 32, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, display: 'flex', alignItems: 'center', gap: 22, opacity: s2, transform: `translateY(${(1 - s2) * 50}px)` }}>
                  <div style={{ width: 96, height: 96, borderRadius: 24, background: [color.yellow, color.ink, '#E9E4D4'][i], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="54" height="54" viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={i === 1 ? '#fff' : color.ink} strokeWidth="2" /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={i === 1 ? '#fff' : color.ink} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={i === 1 ? '#fff' : color.ink} /></svg>
                  </div>
                  <div style={{ fontFamily: font.sans }}>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>App de terceros</div>
                    <div style={{ fontSize: 24, color: color.ink2 }}>gratis · catálogo de LibriVox</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fOtros, fps }) }}>
            <CheckIcon size={40} /> Funcionan porque todo es de dominio público, pero no son de LibriVox
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="cross" at={fApp} />
      <Sfx name="paper_slide" at={fWeb} volume={0.7} />
      <Sfx name="zoom_in" at={fRSS + 2} volume={0.7} />
      <Sfx name="marker" at={fRSS + 6} />
      <Sfx name="mouse_click" at={fCopia - 2} />
      <Sfx name="ui_pop" at={fCopia + 8} />
      <Sfx name="whoosh_soft" at={fPega} />
      <Sfx name="typing" at={fPega + 4} trimAfter={34} />
      <Sfx name="notify" at={fEpis - 30} volume={0.7} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} name="tick_soft" at={fDesc + 22 + i * 5} volume={0.6} />)}
      <Sfx name="success" at={fSin + 6} volume={0.6} />
      <Sfx name="whoosh_soft" at={fPref} />
      <Sfx name="ui_pop" at={fPref + 10} />
      <Sfx name="ui_pop" at={fPref + 16} />
      <Sfx name="ui_pop" at={fPref + 22} />
    </Stage>
  );
};

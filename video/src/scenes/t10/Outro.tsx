import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Stage } from '../../components/Stage';
import { LinkBadge, MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BONE, BOOKS10, DIM, KickerN, Night, RED, color, font, ocen, shadow } from './kit';
import { Img } from 'remotion';
import { COVERS, CoverArt } from './fx';
import { Browser, Cursor, PAGES, Ring, viewAt } from './web';
import { sceneClock } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });

const TipIcon: React.FC<{ kind: 'moon' | 'head' | 'phone'; size: number }> = ({ kind, size }) => {
  const p = { stroke: color.ink, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === 'moon' && <path d="M17.5 15.5A7.5 7.5 0 0 1 9 4.6a7.5 7.5 0 1 0 8.5 10.9z" {...p} />}
      {kind === 'head' && (<><path d="M4 15v-3a8 8 0 0 1 16 0v3" {...p} /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /></>)}
      {kind === 'phone' && (<><rect x="7" y="2.5" width="10" height="19" rx="2" {...p} /><path d="M3 3l18 18" {...p} strokeWidth={2.4} /></>)}
    </svg>
  );
};

// Consejo de escucha (noche).
export const Tip: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TIP');
  const tips = [
    { k: 'moon' as const, t: 'W nocy', at: c.at('X111', 'nocy') - 6 },
    { k: 'head' as const, t: 'W słuchawkach', at: c.at('X111', 'słuchawkach') - 6 },
    { k: 'phone' as const, t: 'Bez zerkania w telefon', at: c.at('X111', 'zerkania') - 6 },
  ];
  return (
    <AbsoluteFill>
      <Night red={0.5}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <KickerN at={c.part('X111')} text="Żeby naprawdę zadziałało" />
          <div style={{ display: 'flex', gap: 44, marginTop: 50 }}>
            {tips.map((tp) => {
              const s = sp(frame, tp.at, 14, 170);
              return (
                <div key={tp.t} style={{ width: 470, padding: '48px 30px', borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center', opacity: s,
                  transform: `translateY(${((1 - s) * 60 + Math.sin(frame / 26 + tp.at) * 6).toFixed(1)}px) rotate(${((1 - s) * -6).toFixed(2)}deg) scale(${(0.85 + 0.15 * s).toFixed(3)})` }}>
                  <div style={{ width: 130, height: 130, borderRadius: '50%', background: color.yellow, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TipIcon kind={tp.k} size={74} /></div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: tp.t.length > 12 ? 42 : 50, lineHeight: 1.1, color: BONE, marginTop: 30 }}>{tp.t}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Night>
      {tips.map((tp) => <Sfx key={tp.t} name="ui_pop" at={tp.at + 1} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// v6 (Joan, 18/10): todo lo de cómo escucharlas, comprimido en una sola pantalla al final. Polaco: pantalla POSŁUCHAJ.
// Las diez de un vistazo: quién la lee, nota de Audioteka (siempre con su número de ocen), duración y cómo empezar (dossier):
// ZA DARMO (Poe, Wolne Lektury) · W ABONAMENCIE (7 títulos: suscripción de Storytel PL y/o Audioteka Klub) · DO KUPIENIA (Hendrix, Salem, en Audioteka). Voz: X112A.
const ACCESS = { free: { t: 'ZA DARMO', bg: '#16A34A', fg: '#fff' }, sub: { t: 'W ABONAMENCIE', bg: '#FFCA05', fg: '#101010' }, buy: { t: 'DO KUPIENIA', bg: 'rgba(255,255,255,0.12)', fg: 'rgba(239,232,220,0.8)' } };
export const Escucha: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ESCUCHA');
  const f0 = c.part('X112A');
  // sellos: los de la suscripción caen con «dziś»; el de Poe, con «darmo»; los de compra, entre medias
  const today = c.at('X112A', 'dziś') - 8;
  const darmo = c.at('X112A', 'darmo') - 8;
  const rows = BOOKS10;
  const push = 1 + 0.025 * ramp(frame, f0, c.dur, (t) => t);
  return (
    <AbsoluteFill>
      <Night red={0.45}>
        <AbsoluteFill style={{ transform: `scale(${push.toFixed(4)})` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <KickerN at={f0 - 4} text="Posłuchaj" />
            <MaskTitle text="Wszystkie dziesięć w wersji audio" at={f0 + 2} size={70} color={BONE} hi="audio" align="center" />
          </div>
          <div style={{ position: 'absolute', left: 70, right: 70, top: 236, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(5, 140px)', columnGap: 36, rowGap: 12 }}>
            {rows.map((b, i) => {
              const s = sp(frame, f0 + 4 + i * 4, 15, 170);
              const n = b.narr[0];
              const A = ACCESS[n.access];
              const qa = n.access === 'free' ? darmo : n.access === 'sub' ? today + i * 2 : today + 24 + i;
              const q = sp(frame, qa, 11, 230);
              return (
                <div key={b.n} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, padding: '14px 20px 14px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.11)',
                  opacity: Math.min(1, s * 1.4), transform: `translateX(${((1 - s) * (i < 5 ? -60 : 60)).toFixed(1)}px)` }}>
                  <div style={{ position: 'relative', flexShrink: 0, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 22px rgba(0,0,0,0.5)' }}><CoverArt name={COVERS[11 - b.n][0]} size={112} /></div>
                  <span style={{ position: 'absolute', left: 4, top: 4, minWidth: 40, height: 40, borderRadius: 999, background: b.n === 1 ? RED : color.yellow, color: b.n === 1 ? '#fff' : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 22,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>{b.n}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: b.title.length > 22 ? 27 : 31, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.n === 9 ? 'Opowiadania Poego' : b.title}</div>
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 22, color: DIM, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.role ? `${n.role}: ` : 'Czyta '}{n.who}</div>
                    {n.extra && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 19, color: color.yellow, marginTop: 6, whiteSpace: 'nowrap' }}>{n.extra}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    {n.votes > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#fff', whiteSpace: 'nowrap' }}>
                        <svg width={24} height={24} viewBox="0 0 24 24" style={{ alignSelf: 'center' }}><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill={color.yellow} /></svg>
                        {n.rating.toFixed(1).replace('.', ',')}
                        <span style={{ fontWeight: 500, fontSize: 19, color: DIM }}>{n.votesLabel ?? `${n.votes} ${ocen(n.votes)}`}</span>
                      </div>
                    ) : (
                      <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 21, color: DIM, whiteSpace: 'nowrap' }}>{n.source}</div>
                    )}
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 21, color: DIM, whiteSpace: 'nowrap' }}>{n.dur}</div>
                    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 18, letterSpacing: 1, padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap',
                      background: A.bg, color: A.fg, opacity: Math.min(1, q * 1.5), transform: `scale(${(0.6 + 0.4 * q).toFixed(3)})`, transformOrigin: '100% 50%' }}>
                      {A.t}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1006, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 20, color: DIM, opacity: ramp(frame, f0 + 30, f0 + 50) }}>
            Oceny i czas: Audioteka · abonament: Storytel lub Audioteka Klub · stan na 19.10.2026
          </div>
        </AbsoluteFill>
      </Night>
      <Sfx name="whoosh_soft" at={f0 - 6} volume={0.6} />
      {rows.map((_, i) => <Sfx key={i} name="tick_soft" at={f0 + 6 + i * 4} volume={0.28} />)}
      <Sfx name="sparkle" at={today} volume={0.4} />
      {rows.map((b, i) => (b.narr[0].access === 'sub' ? <Sfx key={`g${b.n}`} name="ui_pop" at={today + i * 2 + 1} volume={0.2} /> : null))}
      <Sfx name="success" at={darmo} volume={0.4} />
    </AbsoluteFill>
  );
};

// sonorbooks.pl (vuelve la luz: el mundo claro de la marca). X112B: «Na sonorbooks.pl porównasz, gdzie posłuchać audiobooka
// i za ile. Linki do wszystkich dziesięciu historii są w opisie.» Categoría Horror → clic en «Porównaj opcje» de «Dziecko Rosemary»
// → ficha (opciones analizadas = gdzie; precio = za ile) → las diez con «Linki w opisie». Sin blog ni pruebas gratis (dossier).
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('WEB');
  const f0 = c.part('X112B');
  const at = (w: string, n = 0) => c.at('X112B', w, n);
  const por = at('porównasz');
  const gdzie = at('gdzie');
  const ile = at('za');
  const links = at('Linki') - 8;
  const click = por - 4;
  const win = sp(frame, f0 - 6, 15, 110);
  const mix = ramp(frame, click + 2, click + 14);
  const toGrid = ramp(frame, links - 10, links + 16);
  const view = viewAt(frame, mix < 0.5 ? [
    { at: f0 - 6, cx: 720, cy: 480, z: 1 },
    { at: click - 30, cx: 640, cy: 650, z: 1.35, dur: 22 },
  ] : [
    { at: click + 2, cx: 720, cy: 415, z: 1 },
    { at: gdzie - 8, cx: 1010, cy: 690, z: 1.75, dur: 16 },
    { at: ile - 8, cx: 1080, cy: 470, z: 1.9, dur: 16 },
  ]);
  const hKey = f0 + 2;
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        {/* titular */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'center', opacity: (frame >= hKey ? 1 : 0) * (1 - toGrid) }}>
          <MaskTitle text="Gdzie posłuchać i za ile" at={hKey} size={76} hi="ile" align="center" />
        </div>
        {/* la ventana con la web */}
        <div style={{ position: 'absolute', left: 230, top: 160, transformOrigin: '0 0', perspective: 2200,
          transform: `translate(${(-170 * toGrid).toFixed(1)}px, ${(110 * toGrid).toFixed(1)}px) scale(${(1 - 0.4 * toGrid).toFixed(4)})` }}>
          <div style={{ transform: `translateY(${((1 - win) * 220).toFixed(1)}px) rotateX(${((1 - win) * 24).toFixed(2)}deg)`, opacity: Math.min(1, win * 1.5), transformOrigin: '50% 100%' }}>
            <Browser page={PAGES.horror} page2={PAGES.rosemary} mix={mix} w={1460} h={860} view={view} overlay={mix < 0.5 ? (
              <>
                <Ring x={487} y={579} w={220} h={220} at={click - 26} out={click + 6} />
                <Cursor from={[980, 860]} to={[592, 914]} at={click - 24} click={click} />
              </>
            ) : (
              <>
                <Ring x={728} y={704} w={572} h={50} at={gdzie - 2} out={ile - 8} />
                <Ring x={966} y={440} w={330} h={98} at={ile - 2} out={links} />
              </>
            )} />
          </div>
        </div>
        {/* las diez, con sus enlaces en la descripción */}
        {toGrid > 0 && (
          <div style={{ position: 'absolute', left: 1090, top: 110, width: 720, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, opacity: toGrid }}>
            {BOOKS10.slice().reverse().map((b, i) => {
              const s = sp(frame, links - 6 + i * 3, 14, 160);
              return (
                <div key={b.n} style={{ position: 'relative', height: 232, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: shadow.card, opacity: s,
                  transform: `translateY(${((1 - s) * 30 + Math.sin(frame / 30 + i) * 3 * s).toFixed(1)}px) scale(${(0.9 + 0.1 * s).toFixed(3)})` }}>
                  <div style={{ position: 'absolute', left: 0, top: 0 }}><CoverArt name={COVERS[11 - b.n][0]} size={166} /></div>
                  <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, height: 40, borderRadius: 10, background: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width={18} height={18} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" /></svg>
                    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 17, color: '#fff' }}>Link w opisie</span>
                  </div>
                  <div style={{ position: 'absolute', right: 8, top: 8, minWidth: 34, height: 34, borderRadius: 999, background: b.n === 1 ? RED : color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 18, color: b.n === 1 ? '#fff' : color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>{b.n}</div>
                </div>
              );
            })}
          </div>
        )}
        {toGrid > 0 && (
          <div style={{ position: 'absolute', left: 120, top: 90, opacity: toGrid }}>
            <LinkBadge at={links} label="Wszystkie linki w opisie" size={38} />
          </div>
        )}
      </Stage>
      <Sfx name="whoosh_soft" at={f0 - 4} volume={0.6} />
      <Sfx name="zoom_in" at={click - 30} volume={0.45} />
      <Sfx name="click" at={click} volume={0.8} />
      <Sfx name="swipe" at={click + 2} volume={0.5} />
      <Sfx name="snap_in" at={gdzie} volume={0.5} />
      <Sfx name="snap_in" at={ile} volume={0.5} />
      <Sfx name="whoosh_deep" at={links - 8} volume={0.5} />
      <Sfx name="snap_in" at={links} volume={0.7} />
    </AbsoluteFill>
  );
};


// Pregunta final: cuál ha dado más miedo y qué historias siguen.
export const Coment: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('COMENT');
  const f0 = c.part('X113');
  const g = c.at('X113', 'historiach') - 8;
  const genres = ['Fantastyka', 'Thriller', 'Science fiction', 'Romans', 'Historia', 'Klasyka'];
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <svg width={110} height={110} viewBox="0 0 24 24"><path d="M4 5.5h16v10H9l-5 4z" fill={color.yellow} stroke={color.ink} strokeWidth={1.6} strokeLinejoin="round" /></svg>
            <MaskTitle text="Która przestraszyła cię najbardziej?" at={f0 + 2} size={80} hi="najbardziej" />
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink2, marginTop: 70, opacity: ramp(frame, g - 4, g + 10) }}>I o jakich historiach mamy opowiedzieć następnym razem?</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 34, flexWrap: 'wrap', justifyContent: 'center', width: 1500 }}>
            {genres.map((gn, i) => {
              const s = sp(frame, g + 4 + i * 4, 14, 190);
              return <span key={gn} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, padding: '14px 32px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, color: color.ink, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{gn}</span>;
            })}
          </div>
        </AbsoluteFill>
      </Stage>
      <Sfx name="pop" at={f0 + 4} volume={0.6} />
      {genres.map((gn, i) => <Sfx key={gn} name="tick_soft" at={g + 4 + i * 4} volume={0.6} />)}
    </AbsoluteFill>
  );
};

// Cierre de marca: mitad de abajo libre para la pantalla final de YouTube.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('OUTRO');
  const f0 = c.part('X114');
  const end = sp(frame, f0 + 110, 18, 140);
  return (
    <AbsoluteFill>
      <Stage tone="warm">
        <AbsoluteFill style={{ justifyContent: 'flex-start', paddingLeft: 130, paddingTop: 110 }}>
          <div style={{ width: 1100 }}>
            <Logo size={90} delay={2} />
            <div style={{ marginTop: 36, width: 740 }}>
              <Words text="Twoja następna historia już na ciebie czeka." start={f0} stagger={4} size={62} weight={700} align="left" />
            </div>
            <div style={{ marginTop: 30, opacity: sp(frame, f0 + 40), display: 'flex', gap: 18, alignItems: 'center' }}>
              <Pill size={36}>sonorbooks.pl</Pill>
              <div style={{ opacity: end, display: 'flex', alignItems: 'center', gap: 14, marginLeft: 20 }}>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink }}>Wkrótce kolejne historie.</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
      <Sfx name="logo_sting" at={4} volume={0.9} />
      <Sfx name="sparkle" at={f0 + 40} volume={0.4} />
    </AbsoluteFill>
  );
};

export const _o = { DIM, easeOut };

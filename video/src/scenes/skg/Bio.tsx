import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, fmtEs, keyframes } from '../../lib/anim';
import { Sfx, ChangeTicks, Keystrokes } from '../../components/Sfx';
import { Chip, MaskTitle, Burst } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, Cam, color, CoverIcon, font, KR, KR_DEEP, MiniIcon, NOVELS, PAPER, ramp, rampOut, shadow, SkNight, SkStage, Snow, Spine } from './kit';
import { sceneClock } from './timeline';
import geo from './geo.json';

export const NOVEL_YEARS = [1974, 1975, 1977, 1977, 1978, 1979, 1979, 1980, 1981, 1981, 1982, 1982, 1983, 1983, 1983, 1984, 1984, 1984, 1986, 1987, 1987, 1987, 1989,
  1991, 1991, 1992, 1992, 1994, 1995, 1996, 1996, 1996, 1997, 1998, 1999, 2001, 2001, 2002, 2003, 2004, 2004, 2005, 2006, 2006, 2007, 2008, 2009, 2011, 2012, 2013,
  2013, 2014, 2014, 2015, 2016, 2017, 2018, 2018, 2019, 2021, 2021, 2022, 2023, 2025];

// ——— MAINE · G05 ———
// EE. UU. continental en gris; Maine en amarillo. La cámara viaja hasta Maine, cae el alfiler de Portland (1947) y aparecen
// los pueblos inventados de sus libros. Con «inviernos largos» empieza a nevar; con «esconden algo», una ventana se enciende.
type P2 = [number, number];
const ME = geo.pts as unknown as Record<string, P2>;
export const Maine: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MAINE');
  const fNac = c.at('G05', 'nació');
  const fPort = c.at('G05', 'Pórtland');
  const fMaine = c.at('G05', 'Méin', 1);
  const fPueb = c.at('G05', 'pueblos');
  const fInv = c.at('G05', 'inviernos');
  const fVec = c.at('G05', 'vecinos');
  const fEsc = c.at('G05', 'esconden');
  // Cámara: de todo el país a Maine (centro de Maine a la izquierda del encuadre, el texto a la derecha).
  const center: P2 = [1606, 236];
  const target: P2 = [640, 560];
  const S = 4.4;
  const keys = [
    { f: 0, s: 1, x: 0, y: 0 },
    { f: Math.max(20, fNac - 10), s: 1.02, x: 0, y: 0 },
    { f: fPort + 6, s: S, x: target[0] - 960 - S * (center[0] - 960), y: target[1] - 540 - S * (center[1] - 540) },
    { f: c.dur, s: S * 1.05, x: target[0] - 960 - S * 1.05 * (center[0] - 960) - 10, y: target[1] - 540 - S * 1.05 * (center[1] - 540) },
  ];
  const k = (p: string) => keyframes(frame, keys, p, easeInOut);
  const cs = k('s'), cx = k('x'), cy = k('y');
  const toScreen = (p: P2): P2 => [960 + cs * (p[0] - 960) + cx, 540 + cs * (p[1] - 540) + cy];
  const port = toScreen(ME.portland);
  const pinS = spring({ frame: frame - (fPort + 4), fps: 50, config: { damping: 11, stiffness: 200 } });
  const towns = [
    { k: 'derry', label: 'Derry', at: fMaine + 10, left: false },
    { k: 'castlerock', label: 'Castle Rock', at: fMaine + 18, left: true },
    { k: 'salemslot', label: "Salem's Lot", at: fMaine + 26, left: false },
  ];
  const snow = ramp(frame, fInv - 6, fInv + 30);
  const yearCard = rampOut(frame, fPort + 8, fPort + 22);
  return (
    <SkStage>
      <AbsoluteFill style={{ transform: `translate(${cx}px, ${cy}px) scale(${cs})`, transformOrigin: '50% 50%' }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {geo.states.map((s: { name: string; d: string }) => (
            <path key={s.name} d={s.d} fill={s.name === 'Maine' ? color.yellow : '#ECEAE4'} stroke="#FFFFFF" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={geo.maine} fill="none" stroke={color.ink} strokeWidth={2.2} vectorEffect="non-scaling-stroke" opacity={ramp(frame, fNac, fPort)} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 35% 50%, rgba(24,34,52,0.55) 0%, rgba(14,20,32,0.88) 100%)', opacity: snow }} />
      <AbsoluteFill style={{ transform: `translate(${cx}px, ${cy}px) scale(${cs})`, transformOrigin: '50% 50%', opacity: snow }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={geo.maine} fill="#F2C200" stroke={color.ink} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
        </svg>
      </AbsoluteFill>
      <Snow n={160} wind={0.9} opacity={0.95 * snow} seed="maine" />
      {/* Etiqueta de Maine (antes del zoom) */}
      <div style={{ position: 'absolute', left: toScreen([1640, 200])[0] + 20, top: toScreen([1640, 200])[1] - 70, opacity: rampOut(frame, 16, 30) * (1 - ramp(frame, fNac + 10, fPort - 10)) }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, background: '#fff', padding: '10px 22px', borderRadius: 999, boxShadow: shadow.float }}>Maine</div>
      </div>
      {/* Pueblos inventados */}
      {towns.map((t, i) => {
        const p = toScreen(ME[t.k]);
        const s = spring({ frame: frame - t.at, fps: 50, config: { damping: 12, stiffness: 200 } });
        const lit = i === 0 ? ramp(frame, fEsc - 4, fEsc + 6) : 0;
        if (frame < t.at) return null;
        return (
          <div key={t.k} style={{ position: 'absolute', left: p[0], top: p[1] }}>
            <div style={{ position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: '50%', border: `4px dashed ${color.ink}`, background: 'rgba(255,255,255,0.7)', transform: `scale(${s})` }} />
            {/* casita */}
            <svg width="54" height="50" viewBox="0 0 70 64" style={{ position: 'absolute', left: -27, top: -86, opacity: rampOut(frame, fPueb - 4 + i * 4, fPueb + 10 + i * 4), transform: `translateY(${(1 - rampOut(frame, fPueb - 4 + i * 4, fPueb + 10 + i * 4)) * 14}px)` }}>
              <path d="M8 30 35 8l27 22v30H8z" fill={color.ink} />
              <rect x="20" y="36" width="12" height="12" rx="2" fill={lit > 0 ? `rgba(255,202,5,${0.25 + 0.75 * lit})` : '#4A4A4A'} />
              <rect x="40" y="36" width="12" height="24" rx="2" fill="#4A4A4A" />
              <path d="M6 31 35 7l29 24" stroke={'#fff'} strokeWidth={3} fill="none" opacity={snow * 0.9} />
            </svg>
            <div style={{ position: 'absolute', ...(t.left ? { right: 30 } : { left: 30 }), top: -22, fontFamily: font.sans, fontWeight: 700, fontSize: 34, whiteSpace: 'nowrap', opacity: s, transform: `translateX(${(1 - s) * -14}px)`,
              color: snow > 0.5 ? '#fff' : color.ink, textShadow: snow > 0.5 ? '0 2px 10px rgba(0,0,0,0.6)' : '0 0 8px #fff, 0 0 16px #fff' }}>{t.label}</div>
          </div>
        );
      })}
      {/* Portland */}
      {frame >= fPort && (
        <div style={{ position: 'absolute', left: port[0], top: port[1] }}>
          <svg width="64" height="80" viewBox="0 0 24 30" style={{ position: 'absolute', left: -32, top: -78, transform: `translateY(${(1 - pinS) * -80}px)`, opacity: Math.min(1, pinS * 3) }}>
            <path d="M12 29s9-8.4 9-16a9 9 0 1 0-18 0c0 7.6 9 16 9 16z" fill={KR} stroke="#fff" strokeWidth="1.6" />
            <circle cx="12" cy="13" r="3.4" fill="#fff" />
          </svg>
          <div style={{ position: 'absolute', left: 44, top: -66, opacity: yearCard, transform: `translateX(${(1 - yearCard) * -16}px)` }}>
            <div style={{ background: color.ink, color: '#fff', borderRadius: 20, padding: '14px 24px', boxShadow: shadow.float, whiteSpace: 'nowrap' }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40 }}>Portland</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.yellow }}>Nace en 1947</div>
            </div>
          </div>
        </div>
      )}
      {/* Rótulo de los pueblos */}
      <div style={{ position: 'absolute', left: 1160, top: 190, width: 660, padding: '46px 48px 54px', background: '#fff', borderRadius: 32, boxShadow: shadow.card, opacity: rampOut(frame, fMaine + 8, fMaine + 22), transform: `translateY(${(1 - rampOut(frame, fMaine + 8, fMaine + 22)) * 30}px)` }}>
        <Kicker at={fMaine + 8} text="Pueblos inventados" />
        <MaskTitle text="El Maine de sus libros" at={fMaine + 12} size={72} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44, alignItems: 'flex-start' }}>
          <Chip at={fPueb - 2} label="Pueblos pequeños" icon={<MiniIcon kind="pin" size={30} />} dimAt={fInv} />
          <Chip at={fInv - 2} label="Inviernos largos" icon={<CoverIcon kind="stars" size={30} c={color.ink} sw={2} />} dimAt={fVec} />
          <Chip at={fVec - 2} label="Vecinos que esconden algo" icon={<CoverIcon kind="eye" size={30} c={color.ink} sw={2} />} accent={KR} />
        </div>
      </div>
      <Sfx name="zoom_in" at={fPort - 8} volume={0.7} />
      <Sfx name="stamp" at={fPort + 6} volume={0.45} />
      {towns.map((t) => <Sfx key={t.k} name="ui_pop" at={t.at + 1} volume={0.6} />)}
      <Sfx name="sk_wind" at={fInv - 10} volume={0.9} dur={c.dur - fInv + 10} fade={30} />
      <Sfx name="sk_heart" at={fEsc + 2} volume={0.7} />
    </SkStage>
  );
};

// ——— CARRIE · G06–G07 ———
// Pizarra de clase → máquina de escribir de noche → las páginas a la papelera → Tabitha las rescata → Carrie (1974).
export const CarrieOrigin: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CARRIE');
  const fIng = c.at('G06', 'inglés');
  const fEscr = c.at('G06', 'escribía');
  const fTiro = c.at('G06', 'tiró');
  const fBas = c.at('G06', 'basura');
  const fRel = c.at('G06', 'relato');
  const fChica = c.at('G06', 'chica');
  const fTab = c.at('G07', 'Tábita');
  const fResc = c.at('G07', 'rescató');
  const fSeg = c.at('G07', 'seguir');
  const fKeri = c.at('G07', 'Kéri');
  const fPrim = c.at('G07', 'primera');
  const fSal = c.at('G07', 'Salió');
  const fCuat = c.at('G07', 'cuatro');
  const fVida = c.at('G07', 'vida');
  const night = ramp(frame, fEscr - 14, fEscr + 10);
  // Hoja de papel: se escribe (escribía), se arruga y vuela a la papelera (tiró) y vuelve (rescató).
  const crumple = ramp(frame, fTiro - 2, fTiro + 12) * (1 - ramp(frame, fResc + 6, fResc + 24));
  const flyOut = ramp(frame, fTiro + 8, fBas + 24, easeInOut);
  const flyBack = ramp(frame, fResc - 4, fResc + 18, easeInOut);
  const fly = flyOut * (1 - flyBack);
  const toBook = ramp(frame, fKeri - 22, fKeri + 2);
  const paperPos = (t: number): [number, number] => {
    // de la máquina (960, 430) a la papelera (1420, 760) en arco
    const x = 960 + (1420 - 960) * t;
    const y = 330 + (660 - 330) * t - Math.sin(Math.PI * t) * 260;
    return [x, y];
  };
  const [px, py] = paperPos(fly);
  const typed = Math.round(interpolate(frame, [fEscr + 4, fTiro - 6], [0, 7], clamp));
  const keyTimes = Array.from({ length: 14 }).map((_, i) => Math.round(fEscr + 4 + i * ((fTiro - 10 - fEscr) / 14)));
  const book = spring({ frame: frame - (fKeri - 6), fps: 50, config: { damping: 15, stiffness: 120 } });
  const spin = interpolate(frame, [fKeri - 6, fKeri + 40, c.dur], [-160, -16, -8], { ...clamp, easing: easeOut });
  const yearIn = spring({ frame: frame - fCuat + 6, fps: 50, config: { damping: 12, stiffness: 190 } });
  const rays = ramp(frame, fVida - 4, fVida + 20);
  return (
    <AbsoluteFill>
      <SkStage />
      <AbsoluteFill style={{ opacity: night }}><SkNight lamp={[960, 360]} dust={false} /></AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.03, x: 0, y: 0 }, { f: fEscr, s: 1, x: 0, y: 0 }, { f: fTiro, s: 1.06, x: -40, y: 20 }, { f: fKeri - 10, s: 1, x: 0, y: 0 }, { f: c.dur, s: 1.05, x: 0, y: -10 }]}>
        {/* Pizarra */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - night, transform: `scale(${1 - night * 0.05})` }}>
          <div style={{ width: 1120, height: 560, borderRadius: 26, background: '#24473A', border: '22px solid #8A6A45', boxShadow: shadow.card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.08), rgba(0,0,0,0.12))' }} />
            <div style={{ position: 'absolute', left: 70, top: 60, fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: 'rgba(255,255,255,0.88)' }}>English</div>
            <div style={{ position: 'absolute', left: 70, top: 160, width: 880 * rampOut(frame, 6, 40), height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 70, top: 220, fontFamily: font.sans, fontWeight: 500, fontSize: 46, color: 'rgba(255,255,255,0.8)', opacity: rampOut(frame, fIng - 10, fIng + 6) }}>
              Profesor de inglés en un instituto de Maine
            </div>
            <div style={{ position: 'absolute', right: 70, bottom: 50, fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: 'rgba(255,255,255,0.9)', opacity: rampOut(frame, 10, 30) }}>1971</div>
            <div style={{ position: 'absolute', left: 60, bottom: 16, width: 160, height: 20, borderRadius: 6, background: '#F3EEE2' }} />
          </div>
        </AbsoluteFill>
        {/* Escritorio de noche: máquina de escribir y hoja */}
        {night > 0.01 && (
          <AbsoluteFill style={{ opacity: night }}>
            <div style={{ position: 'absolute', left: 960 - 300, top: 420, opacity: 1 - toBook, transform: `scale(${1 - toBook * 0.2})`, transformOrigin: '50% 80%' }}>
              <CoverIcon kind="typewriter" size={600} c={'#E9E2D2'} sw={0.8} />
            </div>
            {/* papelera */}
            <svg width="220" height="240" viewBox="0 0 220 240" style={{ position: 'absolute', left: 1310, top: 600, opacity: (1 - toBook) * rampOut(frame, fTiro - 10, fTiro + 6) }}>
              <path d="M20 30h180l-20 200H40z" fill="#3B3E44" stroke="#5A5E66" strokeWidth="4" />
              <path d="M20 30h180" stroke="#7A7E86" strokeWidth="8" strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${55 + k * 28} 50 L${62 + k * 24} 215`} stroke="#4C5058" strokeWidth="5" />)}
            </svg>
            {/* hoja */}
            {(fly < 0.995 || flyBack > 0) && toBook < 0.98 && (
              <div style={{ position: 'absolute', left: px - 170, top: py - 200, width: 340, height: 440, transform: `scale(${1 - 0.72 * crumple - 0.1 * fly}) rotate(${crumple * 160 + fly * 220}deg)`, opacity: 1 - toBook,
                filter: crumple > 0.05 ? `url(#crumple)` : undefined }}>
                <div style={{ position: 'absolute', inset: 0, background: PAPER, borderRadius: 4 + crumple * 160, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 34, top: 40, fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 30, color: '#222' }}>CARRIE</div>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ position: 'absolute', left: 34, top: 100 + i * 26, height: 9, borderRadius: 4, background: 'rgba(30,30,30,0.55)', width: i < typed * 2 ? 250 - ((i * 37) % 70) : 0 }} />
                  ))}
                  {crumple > 0.05 && <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(${37}deg, rgba(0,0,0,${0.08 * crumple}) 0 14px, rgba(255,255,255,${0.1 * crumple}) 14px 28px)` }} />}
                </div>
              </div>
            )}
            {/* Rótulos */}
            <div style={{ position: 'absolute', left: 1240, top: 300, opacity: rampOut(frame, fRel - 4, fRel + 10) * (1 - ramp(frame, fTab - 10, fTab)) }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: '#fff' }}>Un relato</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 38, color: 'rgba(255,255,255,0.7)', opacity: rampOut(frame, fChica - 4, fChica + 10) }}>sobre una chica con poderes</div>
            </div>
            <div style={{ position: 'absolute', left: 200, top: 300, opacity: rampOut(frame, fTab - 2, fTab + 12) * (1 - ramp(frame, fKeri - 24, fKeri - 10)) }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: color.yellow, textTransform: 'uppercase' }}>Su mujer</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 72, color: '#fff' }}>Tabitha</div>
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: 'rgba(255,255,255,0.75)', opacity: rampOut(frame, fSeg - 6, fSeg + 8) }}>«Sigue con ella»</div>
            </div>
          </AbsoluteFill>
        )}
        {/* Carrie, el libro */}
        {frame >= fKeri - 8 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
            <div style={{ position: 'absolute', left: 960 - 700, top: 540 - 700, width: 1400, height: 1400, borderRadius: '50%', opacity: rays * 0.9,
              background: 'repeating-conic-gradient(from 0deg, rgba(255,202,5,0.16) 0deg 6deg, rgba(255,202,5,0) 6deg 18deg)', transform: `rotate(${frame * 0.15}deg) scale(${0.8 + 0.2 * rays})`,
              WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0) 62%)', maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0) 62%)' }} />
            <div style={{ transform: `translateY(${(1 - book) * 160}px) scale(${0.7 + 0.3 * book})`, opacity: Math.min(1, book * 2) }}>
              <Book3D b={BOOKS.carrie} w={340} h={510} d={48} ry={spin} rx={4} shine={ramp(frame, fPrim, fPrim + 30)} />
            </div>
            <div style={{ width: 560 }}>
              <Kicker at={fPrim - 4} text="Su primera novela publicada" style={{ color: 'rgba(255,255,255,0.75)' }} />
              <MaskTitle text="Carrie" at={fKeri - 2} size={150} color="#fff" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, transform: `scale(${0.6 + 0.4 * yearIn})`, opacity: Math.min(1, yearIn * 2), transformOrigin: 'left center' }}>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: color.ink, background: color.yellow, padding: '4px 28px', borderRadius: 18 }}>1974</span>
              </div>
              <div style={{ marginTop: 26, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: 'rgba(255,255,255,0.85)', opacity: rampOut(frame, fVida - 6, fVida + 10) }}>…y le cambió la vida.</div>
            </div>
          </AbsoluteFill>
        )}
      </Cam>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="crumple"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale={60 * crumple} /></filter>
        </defs>
      </svg>
      <Burst at={fCuat + 4} x={420} y={560} r={180} n={40} seed="carrie" />
      <Sfx name="draw" at={6} volume={0.4} dur={30} fade={8} />
      <Sfx name="whoosh_soft" at={fEscr - 12} volume={0.5} />
      <Keystrokes text={'x'.repeat(keyTimes.length)} times={keyTimes} volume={0.7} seed="carrie-keys" />
      <Sfx name="sk_typebell" at={fTiro - 8} volume={0.7} />
      <Sfx name="sk_crumple" at={fTiro} volume={0.9} />
      <Sfx name="swipe" at={fTiro + 16} volume={0.8} />
      <Sfx name="sk_bin" at={fBas + 10} volume={0.9} />
      <Sfx name="sk_uncrumple" at={fResc} volume={0.9} />
      <Sfx name="whoosh_deep" at={fKeri - 6} volume={0.7} />
      <Sfx name="hit_soft" at={fKeri} volume={0.8} />
      <Sfx name="stamp" at={fCuat + 2} volume={0.5} />
      <Sfx name="sparkle" at={fCuat + 4} volume={0.7} />
      <Sfx name="shimmer" at={fVida - 2} volume={0.5} />
    </AbsoluteFill>
  );
};

// ——— BACHMAN · G08 ———
const BACHMAN = ['Rabia', 'La larga marcha', 'Carretera maldita', 'El fugitivo', 'Maleficio', 'Posesión', 'Blaze'];
export const Bachman: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('BACHMAN');
  const fParado = c.at('G08', 'parado');
  const fMientras = c.at('G08', 'Mientras');
  const fDos = c.at('G08', 'dos');
  const fDia = c.at('G08', 'día');
  const fSiete = c.at('G08', 'siete');
  const fNombre = c.at('G08', 'nombre');
  const fRich = c.at('G08', 'Ríchard');
  const fComp = c.at('G08', 'comprobar');
  const fContaban = c.at('G08', 'contaban');
  const fFirma = c.at('G08', 'firma');
  const fLibrero = c.at('G08', 'librero');
  const fOch = c.at('G08', 'ochenta');
  // Fase 1: línea temporal 1974–2025 que se llena de lomos (0 → fMientras)
  const p1out = ramp(frame, fMientras - 14, fMientras + 4);
  const x0 = 180, x1 = 1740;
  const yx = (y: number) => x0 + ((y - 1974) / (2026 - 1974)) * (x1 - x0);
  const stackIdx: number[] = [];
  const perYear: Record<number, number> = {};
  NOVEL_YEARS.forEach((y) => { perYear[y] = (perYear[y] ?? 0) + 1; stackIdx.push(perYear[y] - 1); });
  // Fase 2: Mientras escribo y las 2.000 palabras (fMientras → fSiete)
  const p2in = ramp(frame, fMientras - 8, fMientras + 8);
  const p2out = ramp(frame, fSiete - 12, fSiete + 4);
  const words = interpolate(frame, [fMientras + 6, fDia + 14], [0, 2000], { ...clamp, easing: easeOut });
  // Fase 3: los siete Bachman (fSiete → fin)
  const p3in = ramp(frame, fSiete - 6, fSiete + 10);
  const reveal = ramp(frame, fLibrero + 6, fLibrero + 22);
  const bachOut = ramp(frame, fLibrero - 4, fLibrero + 6);
  const scaleQ = ramp(frame, fComp - 6, fComp + 8) * (1 - ramp(frame, fLibrero - 12, fLibrero));
  return (
    <SkStage>
      {/* Fase 1 */}
      {p1out < 1 && (
        <AbsoluteFill style={{ opacity: 1 - p1out, transform: `translateY(${-p1out * 40}px)`, filter: p1out > 0.01 ? `blur(${p1out * 8}px)` : undefined }}>
          <div style={{ position: 'absolute', left: x0, right: 1920 - x1, top: 800, height: 4, background: color.ink, borderRadius: 2 }} />
          {[1974, 1980, 1990, 2000, 2010, 2020].map((y) => (
            <div key={y} style={{ position: 'absolute', left: yx(y) - 60, width: 120, top: 820, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2 }}>{y}</div>
          ))}
          {NOVEL_YEARS.map((y, i) => {
            const a = -6 + i * 0.85;
            const s = spring({ frame: frame - a, fps: 50, config: { damping: 13, stiffness: 220 } });
            if (frame < a) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: yx(y) - 11 + stackIdx[i] * 4, top: 800 - 180 - stackIdx[i] * 12, transform: `translateY(${(1 - s) * -200}px) rotate(${stackIdx[i] * 4}deg)`, transformOrigin: 'bottom center', opacity: s }}>
                <Spine title="" w={22} h={180} bg={['#7A0A12', '#1B2838', '#2D5A3D', '#3B3E44', '#B07D2B', '#4A2E80'][i % 6]} author={false} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center' }}>
            <MaskTitle text="No ha parado" at={2} size={120} align="center" />
          </div>
        </AbsoluteFill>
      )}
      {/* Fase 2 */}
      {p2in > 0 && p2out < 1 && (
        <AbsoluteFill style={{ opacity: p2in * (1 - p2out), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 110, transform: `scale(${0.96 + 0.04 * p2in})` }}>
          <Book3D b={BOOKS.mientras} w={300} h={450} d={40} ry={interpolate(frame, [fMientras - 8, fSiete], [-40, -14], clamp)} rx={4} />
          <div style={{ width: 760 }}>
            <Kicker at={fMientras} text="Mientras escribo (2000)" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 210, letterSpacing: -9, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{fmtEs(Math.round(words / 10) * 10)}</span>
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, marginTop: -10 }}>palabras <span style={{ background: color.yellow, padding: '0 14px', borderRadius: 10 }}>al día</span></div>
            <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: 12, borderRadius: 6, background: 'rgba(16,16,16,0.12)', width: 700 - (i % 3) * 90, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color.ink, width: `${Math.max(0, Math.min(1, words / 2000 * 6 - i)) * 100}%`, borderRadius: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* Fase 3 */}
      {p3in > 0 && (
        <AbsoluteFill style={{ opacity: p3in }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
            <MaskTitle text="Siete novelas con otro nombre" at={fSiete - 2} size={84} align="center" />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 26 }}>
            {BACHMAN.map((t, i) => {
              const s = spring({ frame: frame - (fSiete + 2 + i * 3), fps: 50, config: { damping: 14, stiffness: 180 } });
              const flip = ramp(frame, fLibrero + i * 3, fLibrero + 14 + i * 3);
              const b: BookDef = { ...BOOKS.bachman, title: t, author: flip > 0.5 ? 'Stephen King' : 'Richard Bachman', bg: flip > 0.5 ? '#2B2238' : '#CBC3B5', fg: flip > 0.5 ? '#F1E6D2' : '#1D1D1D', accent: flip > 0.5 ? color.yellow : '#1D1D1D', icon: 'mask' };
              return (
                <div key={t} style={{ transform: `translateY(${(1 - s) * 90}px) rotateY(${Math.sin(flip * Math.PI) * 0}deg)`, opacity: s }}>
                  <div style={{ transform: `scaleX(${Math.abs(Math.cos(flip * Math.PI))})` }}>
                    <Book3D b={b} w={200} h={300} d={30} ry={-12 + i * 4} rx={3} floorShadow />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center', gap: 30, alignItems: 'center' }}>
            <div style={{ opacity: rampOut(frame, fRich - 4, fRich + 10) * (1 - bachOut), fontFamily: font.sans, fontWeight: 700, fontSize: 62, color: color.ink, display: 'flex', alignItems: 'center', gap: 22 }}>
              <span style={{ width: 84, height: 84, borderRadius: '50%', background: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CoverIcon kind="mask" size={56} c={color.yellow} sw={2} /></span>
              Richard Bachman
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', gap: 26, opacity: scaleQ }}>
            <Chip at={fComp + 2} label="¿Por la historia?" icon={<MiniIcon kind="book" size={30} />} dimAt={fContaban + 20} />
            <Chip at={fFirma - 4} label="¿O por la firma?" icon={<CoverIcon kind="pencil" size={30} c={color.ink} sw={2} />} />
          </div>
          {/* revelado */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 740, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: reveal }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 62, color: color.ink }}>Lo descubrió un librero</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 90, color: '#fff', background: KR, padding: '0 26px', borderRadius: 16,
              transform: `rotate(-4deg) scale(${1.4 - 0.4 * spring({ frame: frame - fOch, fps: 50, config: { damping: 10, stiffness: 240 } })})`, opacity: rampOut(frame, fOch - 2, fOch + 2), boxShadow: `0 20px 40px ${KR_DEEP}55` }}>1985</span>
          </div>
        </AbsoluteFill>
      )}
      {Array.from({ length: 10 }).map((_, k) => <Sfx key={k} name="tick_soft" at={Math.round(-6 + k * 6 * 0.85) + 8} volume={0.45} />)}
      <Sfx name="whoosh_soft" at={fMientras - 6} volume={0.6} />
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fMientras + 6, fDia + 14], [0, 2000], { ...clamp, easing: easeOut }) / 100))} from={fMientras + 6} to={fDia + 14} volume={0.55} />
      <Sfx name="sk_typing" at={fDos} volume={0.5} />
      <Sfx name="whoosh_soft" at={fSiete - 8} volume={0.6} />
      {BACHMAN.map((_, i) => <Sfx key={`b${i}`} name="sk_book_slide" at={fSiete + 4 + i * 3} volume={0.5} />)}
      <Sfx name="ui_pop" at={fComp + 3} volume={0.6} />
      <Sfx name="ui_pop" at={fFirma - 3} volume={0.6} />
      {BACHMAN.map((_, i) => <Sfx key={`f${i}`} name="card_flip" at={fLibrero + 7 + i * 3} volume={0.55} />)}
      <Sfx name="stamp" at={fOch} volume={0.7} />
      {fNombre > 0 && null}
    </SkStage>
  );
};
export const _bio = { random, KR, easeOut, Snow, SkNight };

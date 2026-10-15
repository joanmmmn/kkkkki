import React from 'react';
import { E, EbLogo } from './kit';
import { PlainCover } from './props';

// ---------------------------------------------------------------------------------------------------------------
// Recreaciones simplificadas de la app eBiblio (De Marque) para Android, a partir de la guía oficial y de las capturas
// de su ficha en Google Play: pantallas de 360×780 dp. Son recreaciones (no capturas): portadas genéricas.
// ---------------------------------------------------------------------------------------------------------------
export const RED = '#B30D0A';
const ui = E.ui;

export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontFamily: ui, fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#222' }}>
    <span>10:30</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="14" height="12" viewBox="0 0 14 12"><path d="M1 11 L13 11 L13 1 Z" fill={dark ? '#fff' : '#333'} /></svg>
      <svg width="20" height="11" viewBox="0 0 20 11"><rect x="0.5" y="0.5" width="17" height="10" rx="2" fill="none" stroke={dark ? '#fff' : '#333'} /><rect x="2" y="2" width="12" height="7" fill={dark ? '#fff' : '#333'} /></svg>
    </span>
  </div>
);
const TopBar: React.FC<{ title: string; back?: boolean; right?: React.ReactNode }> = ({ title, back = true, right }) => (
  <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', fontFamily: ui, fontSize: 20, fontWeight: 500, color: '#222' }}>
    {back && <svg width="22" height="22" viewBox="0 0 24 24"><path d="M20 12 H5 M11 5 L4 12 L11 19" stroke="#444" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    <span style={{ flex: 1 }}>{title}</span>
    {right}
  </div>
);

export const LIBS = ['Andalucía', 'Aragón', 'Asturias', 'Canarias', 'Cantabria', 'Castilla y León', 'Castilla-La Mancha', 'Ceuta', 'Comunitat Valenciana', 'Extremadura', 'Galicia', 'Illes Balears', 'La Rioja', 'Madrid', 'Melilla', 'Murcia', 'Navarra'];

// Lista de bibliotecas: se escribe `query` y se pulsa la de Madrid (`tap` 0..1)
export const AppLibraries: React.FC<{ query: string; tap?: number; caret?: boolean }> = ({ query, tap = 0, caret }) => {
  const list = LIBS.filter((l) => l.toLowerCase().startsWith(query.toLowerCase()));
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <StatusBar />
      <TopBar title="Bibliotecas" />
      <div style={{ margin: '4px 16px 10px', height: 44, borderRadius: 22, background: '#EEEDEC', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontFamily: ui, fontSize: 16, color: query ? '#222' : '#999' }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke="#777" strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke="#777" strokeWidth="2.4" strokeLinecap="round" /></svg>
        {query || 'Búsqueda'}
        {caret && <span style={{ display: 'inline-block', width: 2, height: 20, background: '#222', marginLeft: -6 }} />}
      </div>
      {list.map((l) => {
        const isM = l === 'Madrid';
        return (
          <div key={l} style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: ui, fontSize: 17, color: '#222', background: isM && tap > 0 ? `rgba(179,13,10,${0.12 * tap})` : undefined }}>
            <span style={{ flex: 1 }}>eBiblio {l}</span>
            {isM && tap > 0.5
              ? <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke={RED} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19" stroke={RED} strokeWidth="2.4" strokeLinecap="round" /></svg>}
          </div>
        );
      })}
    </div>
  );
};

// Inicio de sesión
export const AppLogin: React.FC<{ user: string; pass: number; press?: number; caretUser?: boolean }> = ({ user, pass, press = 0, caretUser }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: ui }}>
    <StatusBar />
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}><EbLogo w={170} /></div>
    <div style={{ margin: '70px 28px 0' }}>
      {[['Usuario', user, caretUser], ['Contraseña', '•'.repeat(pass), false]].map(([l, v, c]) => (
        <div key={l as string} style={{ height: 52, border: '1.5px solid #CFCFCF', borderRadius: 6, marginBottom: 16, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 17, color: v ? '#222' : '#888', letterSpacing: v && l === 'Contraseña' ? '0.2em' : undefined }}>
          {(v as string) || (l as string)}
          {c && <span style={{ display: 'inline-block', width: 2, height: 22, background: '#222', marginLeft: 2 }} />}
        </div>
      ))}
      <div style={{ marginTop: 18, marginLeft: 'auto', width: 150, height: 46, borderRadius: 4, background: RED, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500,
        transform: `scale(${1 - press * 0.06})`, filter: press > 0 ? `brightness(${1 - press * 0.15})` : undefined }}>Conexión</div>
    </div>
  </div>
);

// Mis libros: la portada del audiolibro prestado (con los días que quedan)
export const AppMyBooks: React.FC<{ hold?: number; menu?: number; download?: number }> = ({ hold = 0, menu = 0, download = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: ui }}>
    <StatusBar />
    <TopBar title="Mis libros" back={false} right={<svg width="22" height="22" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke="#444" strokeWidth="2.2" fill="none" /><path d="M15.5 15.5 L21 21" stroke="#444" strokeWidth="2.2" strokeLinecap="round" /></svg>} />
    <div style={{ display: 'flex', gap: 22, padding: '0 18px', fontSize: 14, fontWeight: 500, color: '#555', borderBottom: '1px solid #E5E5E5' }}>
      {['Libros', 'Autores', 'Categorías', 'Colecciones'].map((t, i) => <div key={t} style={{ padding: '10px 0', color: i === 0 ? RED : '#555', borderBottom: i === 0 ? `3px solid ${RED}` : '3px solid transparent' }}>{t}</div>)}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, padding: 18 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 98, transform: i === 0 ? `scale(${1 - hold * 0.05})` : undefined }}>
          <div style={{ position: 'relative' }}>
            <PlainCover w={98} title={['El otoño del patriarca', 'Novela', 'Ensayo'][i]} bg={[E.coral, E.violet, E.olive][i]} accent={E.mustard} />
            <div style={{ position: 'absolute', left: 4, bottom: 4, padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11 }}>{['21 días', '9 días', '15 días'][i]}</div>
            {i === 0 && (
              <div style={{ position: 'absolute', right: 4, top: 4, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /><rect x="3" y="14" width="5" height="7" rx="2" fill="#fff" /><rect x="16" y="14" width="5" height="7" rx="2" fill="#fff" /></svg>
              </div>
            )}
            {i === 0 && download > 0 && (
              <div style={{ position: 'absolute', left: 4, top: 4, width: 24, height: 24, borderRadius: '50%', background: E.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${download})` }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 4 V15 M7 10 L12 15 L17 10 M5 20 H19" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: '#333', marginTop: 5, lineHeight: 1.2 }}>{['El otoño del patriarca', 'Novela', 'Ensayo'][i]}</div>
        </div>
      ))}
    </div>
    <BottomNav active={1} />
    {menu > 0 && (
      <>
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.35 * menu})` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, background: '#fff', borderRadius: '16px 16px 0 0', transform: `translateY(${(1 - menu) * 260}px)`, padding: '18px 0' }}>
          {['Descargar', 'Devolver', 'Detalles'].map((t, i) => (
            <div key={t} style={{ height: 58, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', fontSize: 18, color: '#222', background: i === 0 && download > 0 ? 'rgba(46,139,87,0.12)' : undefined }}>
              <svg width="22" height="22" viewBox="0 0 24 24">{i === 0 ? <path d="M12 4 V15 M7 10 L12 15 L17 10 M5 20 H19" stroke="#444" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : i === 1 ? <path d="M9 14 L4 9 L9 4 M4 9 H15 A5 5 0 0 1 15 19 H11" stroke="#444" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <circle cx="12" cy="12" r="8" stroke="#444" strokeWidth="2.2" fill="none" />}</svg>
              {t}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

export const BottomNav: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 66, borderTop: '1px solid #E5E5E5', display: 'flex', fontFamily: ui, fontSize: 11.5, background: '#fff' }}>
    {['Inicio', 'Mis libros', 'Catálogos', 'Configuración'].map((t, i) => (
      <div key={t} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: i === active ? RED : '#666' }}>
        <div style={{ width: 22, height: 18, borderRadius: 4, background: i === active ? RED : '#999', opacity: 0.85 }} />
        {t}
      </div>
    ))}
  </div>
);

// Reproductor: `hi` resalta un control: 'speed' | 'back' | 'fwd' | 'timer' | 'play'
export const AppPlayer: React.FC<{ progress: number; playing?: boolean; hi?: Partial<Record<'speed' | 'back' | 'fwd' | 'timer' | 'play', number>>; speed?: string; timer?: string; offline?: number }> = ({ progress, playing = true, hi = {}, speed = '1,0×', timer, offline = 0 }) => {
  const ring = (k: keyof typeof hi) => (hi[k] ? `0 0 0 ${4 * (hi[k] ?? 0)}px ${E.mustard}, 0 0 0 ${10 * (hi[k] ?? 0)}px rgba(224,174,69,0.25)` : 'none');
  const t = Math.floor(progress * 9 * 3600);
  const fmt = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: ui }}>
      <StatusBar />
      <TopBar title="" right={offline > 0 ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: E.green, opacity: offline }}><svg width="18" height="18" viewBox="0 0 24 24"><path d="M2 2 L22 22 M12 18 h0.01 M8.5 14.5 a5 5 0 0 1 7 0 M5 11 a10 10 0 0 1 4-2.3 M19 11 a10 10 0 0 0 -3-2" stroke={E.green} strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>Sin conexión</div> : null} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <PlainCover w={250} title="El otoño del patriarca" author="Audiolibro" bg={E.coral} accent={E.mustard} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 18, fontWeight: 500, color: '#222' }}>El otoño del patriarca</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 13, color: '#777' }}>Capítulo 1</div>
      {/* progreso */}
      <div style={{ margin: '22px 26px 6px', height: 4, borderRadius: 2, background: '#E2E2E2', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: RED, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: `${progress * 100}%`, top: -6, width: 16, height: 16, marginLeft: -8, borderRadius: '50%', background: RED }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 26px', fontSize: 12, color: '#777' }}><span>{fmt(t)}</span><span>9:00:00</span></div>
      {/* controles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, marginTop: 18 }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#333', border: '2px solid #333', boxShadow: ring('back') }}>−30</div>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: ring('play') }}>
          {playing ? <svg width="30" height="30" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" /></svg>
            : <svg width="30" height="30" viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z" fill="#fff" /></svg>}
        </div>
        <div style={{ width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#333', border: '2px solid #333', boxShadow: ring('fwd') }}>+30</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '28px 30px 0', fontSize: 14, color: '#444' }}>
        <div style={{ padding: '8px 14px', borderRadius: 18, border: '1.5px solid #BBB', fontWeight: 700, boxShadow: ring('speed') }}>{speed}</div>
        <div style={{ padding: '8px 14px', borderRadius: 18, border: '1.5px solid #BBB', display: 'flex', alignItems: 'center', gap: 6, boxShadow: ring('timer') }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" stroke="#444" strokeWidth="2.2" fill="none" /><path d="M12 9 V13 L15 15 M9 2 H15" stroke="#444" strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>{timer ?? 'Temporizador'}
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 18, border: '1.5px solid #BBB' }}>
          <svg width="16" height="18" viewBox="0 0 16 20"><path d="M2 2 H14 V18 L8 13 L2 18 Z" stroke="#444" strokeWidth="2" fill="none" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
};

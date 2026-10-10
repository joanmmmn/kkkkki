import React from 'react';
import { color, font } from '../brand/tokens';

// Ventana de navegador minimalista y clara para enmarcar las grabaciones (la UI de ELT es oscura).
export const BrowserWindow: React.FC<{ width: number; url?: string; children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({
  width, url = 'ellibrototal.com', children, style, dark = false,
}) => {
  const bar = Math.round(width * 0.03);
  const height = (width * 9) / 16 + bar;
  return (
    <div style={{ width, height, borderRadius: width * 0.014, overflow: 'hidden', background: dark ? '#1b1d21' : '#F6F6F7', boxShadow: '0 60px 120px rgba(16,16,16,0.22), 0 18px 40px rgba(16,16,16,0.12), 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
      <div style={{ height: bar, display: 'flex', alignItems: 'center', padding: `0 ${bar * 0.6}px`, gap: bar * 0.32, position: 'relative' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{ width: bar * 0.36, height: bar * 0.36, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: bar * 0.62, width: width * 0.34, borderRadius: bar * 0.2, background: dark ? '#2a2d33' : '#E9E9EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: bar * 0.2, fontFamily: font.sans, fontSize: bar * 0.36, color: dark ? '#cfd3da' : color.ink2 }}>
          <svg width={bar * 0.3} height={bar * 0.3} viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10H7zm2 0h6V7a3 3 0 0 0-6 0v3z" fill="currentColor" /></svg>
          {url}
        </div>
      </div>
      <div style={{ width, height: (width * 9) / 16, position: 'relative', overflow: 'hidden', background: color.eltNavy }}>{children}</div>
    </div>
  );
};

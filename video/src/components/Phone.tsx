import React from 'react';

// Marco de iPhone minimalista para grabaciones móviles (contenido 430x932 CSS).
export const Phone: React.FC<{ height: number; children: React.ReactNode; style?: React.CSSProperties; ratio?: number }> = ({ height, children, style, ratio = 932 / 430 }) => {
  const width = height / ratio;
  const bezel = height * 0.018;
  return (
    <div style={{ width: width + bezel * 2, height: height + bezel * 2, borderRadius: height * 0.075, background: '#0c0c0d', padding: bezel, boxShadow: '0 60px 120px rgba(16,16,16,0.28), 0 0 0 2px #2a2a2c inset', position: 'relative', ...style }}>
      <div style={{ width, height, borderRadius: height * 0.062, overflow: 'hidden', position: 'relative', background: '#000' }}>
        {children}
        <div style={{ position: 'absolute', top: height * 0.012, left: '50%', transform: 'translateX(-50%)', width: width * 0.3, height: height * 0.036, borderRadius: 999, background: '#000', zIndex: 10 }} />
      </div>
    </div>
  );
};

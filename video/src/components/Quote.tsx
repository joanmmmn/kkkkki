import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../brand/tokens';

// Cita en serif cursiva con autor y fuente (estilo de las reseñas del V7).
export const Quote: React.FC<{ text: string; author: string; source?: string; delay?: number; width?: number; avatar?: React.ReactNode; stars?: number }> = ({
  text, author, source, delay = 0, width = 820, avatar, stars,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 140 } });
  return (
    <div style={{ width, display: 'flex', gap: 26, alignItems: 'flex-start', background: '#fff', borderRadius: 26, padding: '30px 36px', boxShadow: '0 24px 60px rgba(16,16,16,0.10)', border: `1px solid ${color.line}`, opacity: s, transform: `translateX(${(1 - s) * 50}px)`, filter: `blur(${(1 - s) * 5}px)` }}>
      {avatar}
      <div>
        {stars !== undefined && (
          <div style={{ color: color.yellow, fontSize: 28, letterSpacing: 4, marginBottom: 8 }}>{'★★★★★'.slice(0, stars)}<span style={{ color: '#DDD' }}>{'★★★★★'.slice(stars)}</span></div>
        )}
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, lineHeight: 1.25, color: color.ink }}>«{text}»</div>
        <div style={{ fontFamily: font.sans, fontSize: 22, marginTop: 14, color: color.ink }}>
          <b>{author}</b>{source && <span style={{ color: color.muted }}> · {source}</span>}
        </div>
      </div>
    </div>
  );
};

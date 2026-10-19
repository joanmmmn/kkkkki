// Reseñas de SonorBooks Polska: una entrada por pieza. Cada spec se registra como composición PL-<pieza>
// (vídeo 1920×1080, render a 1440p con SCALE=1.333…) y PLThumb-<pieza> (miniatura 1280×720).
import type { PlatformSpec } from '../types';
import type { ThumbSpec } from '../Thumb';

export type PLPiece = { spec: PlatformSpec; thumb: ThumbSpec; thumbB?: ThumbSpec };

const ctx = (require as unknown as { context: (p: string, deep: boolean, re: RegExp) => { keys(): string[]; (k: string): { piece: PLPiece } } })
  .context('./', false, /^\.\/(?!index)[a-z0-9-]+\.tsx$/);
export const PL_PIECES: PLPiece[] = ctx.keys().map((k) => ctx(k).piece).filter(Boolean);

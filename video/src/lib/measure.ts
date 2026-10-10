// Ancho de un texto con la fuente de marca (canvas), para animar huecos de elementos con ancho propio.
const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;
export const textWidth = (text: string, size: number, weight = 700, family = 'Ubuntu') => {
  const f = `${weight} ${size}px ${family}`;
  const key = `${f}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * size * 0.6;
  ctx.font = f;
  const w = ctx.measureText(text).width;
  if (document.fonts.check(f)) cache.set(key, w); // solo se cachea cuando la fuente real ya está cargada
  return w;
};

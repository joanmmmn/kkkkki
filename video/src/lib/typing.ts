import { random } from 'remotion';

// Tecleo «humano» y determinista: fotograma en que aparece cada carácter de `text`. El primero cae en `start` y el último
// en `start + span`; entre pulsaciones el ritmo varía ±30 %, después de un espacio hay una pausa algo mayor y nunca caen
// dos caracteres en el mismo fotograma. Las mismas cifras mueven el texto y colocan el sonido de cada tecla.
export const typeTimes = (text: string, start: number, span: number, seed: string): number[] => {
  const chars = Array.from(text);
  const raw = [0];
  for (let k = 1; k < chars.length; k++) raw.push(raw[k - 1] + (0.7 + 0.6 * random(`${seed}-${k}`)) * (chars[k - 1] === ' ' ? 1.45 : 1));
  const sc = chars.length > 1 ? span / raw[raw.length - 1] : 0;
  const out: number[] = [];
  raw.forEach((r, k) => out.push(k === 0 ? start : Math.max(out[k - 1] + 1, start + Math.round(r * sc))));
  return out;
};

// Igual, pero cada palabra se teclea mientras la voz la dice: `words[i]` = [desde, hasta] (fotogramas) de la palabra i.
export const typeTimesSpoken = (text: string, words: [number, number][], seed: string): number[] => {
  const parts = text.split(' ');
  const out: number[] = [];
  parts.forEach((w, i) => {
    const chunk = i < parts.length - 1 ? `${w} ` : w;
    const [a, b] = words[Math.min(i, words.length - 1)];
    for (const t of typeTimes(chunk, a, Math.max(Array.from(chunk).length - 1, b - a), `${seed}-${i}`)) {
      out.push(out.length ? Math.max(out[out.length - 1] + 1, t) : t);
    }
  });
  return out;
};

// Caracteres escritos en el fotograma f.
export const typedCount = (times: number[], f: number) => {
  let n = 0;
  while (n < times.length && times[n] <= f) n++;
  return n;
};

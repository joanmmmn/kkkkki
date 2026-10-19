// Trozos de los subtítulos grabados del vertical, con las mismas reglas que tools/t10_meta.py (.srt):
// espacio duro tras una palabra de una letra y entre cifra y palabra; no se corta tras una preposición o una conjunción,
// entre un adjetivo y su sustantivo, dentro de un nombre propio ni dentro de un título entre comillas; sin trozos sueltos.
const NOCUT = new Set(['do', 'od', 'na', 'za', 'po', 'pod', 'nad', 'przed', 'przez', 'przy', 'dla', 'bez', 'ku', 'we', 'ze', 'oraz', 'ani', 'albo',
  'lub', 'czy', 'że', 'żeby', 'który', 'która', 'które', 'którego', 'jak', 'gdy', 'kiedy', 'co', 'nie', 'ponad', 'nawet', 'tylko',
  'tę', 'ten', 'ta', 'to', 'tym', 'tego', 'jego', 'jej', 'ich', 'swój', 'swoje', 'pewien', 'jedno', 'jedna', 'jeden', 'sam',
  'tak', 'aż', 'coraz', 'już', 'jeszcze', 'wciąż', 'by', 'tylu', 'gdyby', 'choć', 'bo', 'ale']);
const KEEP = new Set(['muszą|pokonać', 'małych|dzieci', 'dwoje|małych', 'jedno|spojrzenie', 'lat|później', 'pisze|krótko', 'absolutna|topka']);
const LETTER = /[a-zA-ZąęłńóśźżĄĘŁŃÓŚŹŻ]/;
const endsSentence = (w: string) => /[.?!…]$/.test(w.replace(/[”"»]+$/, ''));
const lastTok = (w: string) => w.split(' ').pop() ?? w;
const bare = (w: string) => w.toLowerCase().replace(/[,.„”:;!?…]/g, '');

export const glueWords = (text: string): string[] => {
  const words: string[] = [];
  for (const w of text.split(' ')) {
    const prev = words[words.length - 1];
    const last = prev ? lastTok(prev) : '';
    const single = last.replace(/[„”"«»–-]/g, '').length === 1 && LETTER.test(last);
    if (prev && (single || (/^\d+$/.test(last) && LETTER.test(w[0] ?? '')))) words[words.length - 1] = `${prev} ${w}`;
    else words.push(w);
  }
  return words;
};

const cutCost = (words: string[], k: number) => {
  const l = words[k - 1];
  const r = words[k];
  const lt = lastTok(l);
  let c = endsSentence(l) ? 0 : /[,:;]$/.test(lt) || r === '–' || lt === '–' ? 3 : /”$/.test(lt) ? 8 : 12;
  if (c === 12 && /(ych|ymi|imi|ego|emu|ym|im|kiej|nej|wej|tej|łej|rej|dej|giej)$/.test(lt.toLowerCase())) c += 8;
  if (NOCUT.has(bare(lt)) && LETTER.test(lt.slice(-1))) c += 30;
  const r0 = bare(r.split(' ')[0]);
  if (KEEP.has(`${bare(lt)}|${r0}`)) c += 40;
  if (['je', 'go', 'mu', 'mi', 'ci', 'się'].includes(r0) && !endsSentence(l)) c += 10;
  const left = words.slice(0, k).join(' ');
  if ((left.match(/„/g) ?? []).length > (left.match(/”/g) ?? []).length) c += 25;
  if (/^[A-ZĄĘŁŃÓŚŹŻ]/.test(lt) && /^[„]?[A-ZĄĘŁŃÓŚŹŻ]/.test(r) && LETTER.test(lt.slice(-1))) c += 25;
  return c;
};

/** Trozos de una línea de hasta `max` caracteres, elegidos con programación dinámica. */
export const chunkWords = (words: string[], max = 28): string[] => {
  const n = words.length;
  const best: [number, number][] = Array.from({ length: n + 1 }, () => [Infinity, -1]);
  best[0] = [0, -1];
  for (let i = 1; i <= n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      const cue = words.slice(j, i);
      const len = cue.join(' ').length;
      if (len > max && i - j > 1) break;
      if (best[j][0] === Infinity) continue;
      let c = best[j][0] + 10 + (len < 10 && n > 1 ? 30 : len < 16 ? (16 - len) / 2 : 0);
      const inner = cue.slice(0, -1).some(endsSentence);
      if (inner) c += 20; // en un trozo de una línea, una frase por trozo
      if (i < n) c += 1.6 * cutCost(words, i);
      if (c < best[i][0]) best[i] = [c, j];
    }
  }
  const out: string[] = [];
  for (let i = n; i > 0; i = best[i][1]) out.unshift(words.slice(best[i][1], i).join(' '));
  return out;
};

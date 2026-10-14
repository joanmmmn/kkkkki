import { continueRender, delayRender, staticFile } from 'remotion';

const faces: Array<[string, string, string, string]> = [
  // familia, archivo, peso, estilo
  ['Ubuntu', 'Ubuntu-300', '300', 'normal'],
  ['Ubuntu', 'Ubuntu-400', '400', 'normal'],
  ['Ubuntu', 'Ubuntu-400i', '400', 'italic'],
  ['Ubuntu', 'Ubuntu-500', '500', 'normal'],
  ['Ubuntu', 'Ubuntu-700', '700', 'normal'],
  ['EB Garamond', 'EBGaramond-400', '400 500', 'normal'],
  ['EB Garamond', 'EBGaramond-400i', '400 500', 'italic'],
  // eBiblio: Poppins (titulares de su identidad) y Roboto (recreaciones de la app de Android)
  ['Poppins', 'Poppins-400', '400', 'normal'],
  ['Poppins', 'Poppins-500', '500', 'normal'],
  ['Poppins', 'Poppins-600', '600', 'normal'],
  ['Poppins', 'Poppins-700', '700', 'normal'],
  ['Poppins', 'Poppins-800', '800', 'normal'],
  ['Roboto', 'Roboto-400', '400', 'normal'],
  ['Roboto', 'Roboto-500', '500', 'normal'],
  ['Roboto', 'Roboto-700', '700', 'normal'],
];

let loaded = false;
export const loadBrandFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Cargando fuentes de marca');
  const all: Promise<unknown>[] = [];
  for (const [family, file, weight, style] of faces) {
    for (const subset of ['latin', 'latin-ext']) {
      const f = new FontFace(family, `url(${staticFile(`fonts/${file}-${subset}.woff2`)}) format('woff2')`, {
        weight, style,
        unicodeRange: subset === 'latin'
          ? 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
          : 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
      });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      all.push(f.load());
    }
  }
  Promise.all(all).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
};

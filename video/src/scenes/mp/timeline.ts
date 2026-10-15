import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/mp/vo/vo.json';

// «Las mejores plataformas de audiolibros en español»: el vídeo definitivo de SonorBooks España, hecho con el material de las
// diez reseñas (grabaciones de las apps, datos comprobados y sistema visual). Sin locución, las duraciones y los tiempos de
// palabra se estiman (≈13 caracteres/s a velocidad 1,13) y se ajustan solos cuando llega la voz.
const CPS = 13;
export const sec = (s: number) => Math.round(s * FPS);
const textOf = (id: string) => (cfg.scenes as { id: string; text: string }[]).find((s) => s.id === id)?.text ?? '';
export const hasVO = (id: string) => Boolean(VOS[id]);
export const speechFrames = (id: string) => (hasVO(id) ? voSpeechFrames(id) : sec(textOf(id).length / CPS));
export const fullFrames = (id: string) => (hasVO(id) ? voFrames(id) : sec(textOf(id).length / CPS + 0.25));

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const estSec = (id: string, word: string, nth = 0) => {
  const t = norm(textOf(id));
  const w = norm(word);
  let i = -1;
  for (let k = 0; k <= nth; k++) { i = t.indexOf(w, i + 1); if (i < 0) break; }
  return Math.max(0, i) / CPS;
};
const voScale = (id: string) => (hasVO(id) ? (VOS[id].speechEnd ?? VOS[id].duration) / Math.max(0.1, textOf(id).length / CPS) : 1);
// Fotograma (relativo al inicio de la locución) de una palabra: exacto con locución, estimado sin ella.
export const wf = (id: string, word: string, nth = 0) => wordFrame(id, word, nth, (estSec(id, word, nth) || 0.001) * voScale(id));

export type VoPart = { id: string; at: number };
// `bump`: título del separador de sección que tapa el arranque de la escena (la escena se dibuja desde `pre`).
// `tin`: cómo entra la escena si no hay separador ('push' = acercamiento con desenfoque, 'cut' = corte, el móvil enlaza solo).
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number; bump?: string; kicker?: string; pre: number; tin: 'push' | 'cut' | 'slide' };
const LEAD = sec(0.12);
const TAIL = sec(0.34);
export const BUMP_PRE = 12;
const simple = (id: string, extra = 0, lead = LEAD, bump?: string, tin: SceneDef['tin'] = 'push', kicker?: string): SceneDef => ({
  id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra, bump, kicker, pre: bump ? BUMP_PRE : 0, tin: bump ? 'cut' : tin,
});

export const MP_SCENES: SceneDef[] = [
  simple('Z01', 30, sec(1.6)),
  simple('Z02', 26, sec(0.4), undefined, 'push'),
  simple('Z03', 14, sec(0.55), 'Sin límite de horas', 'cut', 'Tarifa plana'),
  simple('Z04', 16, sec(0.2), undefined, 'cut'),
  simple('Z05', 14, sec(0.3), undefined, 'slide'),
  simple('Z06', 20, sec(0.25), undefined, 'push'),
  simple('Z07', 16, sec(0.55), 'Pagar por horas', 'cut', 'Paquetes de horas'),
  simple('Z08', 14, sec(0.3), undefined, 'slide'),
  simple('Z09', 18, sec(0.2), undefined, 'cut'),
  simple('Z10', 14, sec(0.3), undefined, 'slide'),
  simple('Z11', 20, sec(0.3), undefined, 'push'),
  simple('Z12', 14, sec(0.55), 'Créditos y tus archivos', 'cut', 'Otras formas de escuchar'),
  simple('Z13', 12, sec(0.15), undefined, 'cut'),
  simple('Z14', 18, sec(0.3), undefined, 'push'),
  simple('Z15', 16, sec(0.55), 'Gratis de verdad', 'cut', 'Sin pagar nada'),
  simple('Z16', 12, sec(0.2), undefined, 'cut'),
  simple('Z17', 16, sec(0.4) + sec(5.6), undefined, 'push'),
  simple('Z18', 18, sec(0.3), undefined, 'slide'),
  simple('Z19', 18, sec(0.55), 'Los trucos', 'cut', 'Valen para todas'),
  simple('Z20', 18, sec(0.3), undefined, 'push'),
  simple('Z21', 16, sec(0.3), undefined, 'slide'),
  simple('Z22', 24, sec(0.3), undefined, 'push'),
  simple('Z23', 18, sec(0.3), undefined, 'slide'),
  simple('Z24', 20, sec(0.55), '¿Cuál te conviene?', 'cut', 'Veredicto'),
  simple('Z25', 16, sec(0.2), undefined, 'cut'),
  simple('Z26', 190, sec(0.3), undefined, 'push'),
];
export const MP_BUMPS = MP_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const MP_APP = ['Z03', 'Z04', 'Z08', 'Z09', 'Z12', 'Z13'];

export const mpStart = (id: string) => {
  let a = 0;
  for (const s of MP_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const MP_TOTAL = MP_SCENES.reduce((a, s) => a + s.dur, 0);
export const mpVoIntervals = () => MP_SCENES.flatMap((s) => s.vo.map((v) => [mpStart(s.id) + v.at, mpStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/mp_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const MP_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Las 4 formas de pagar un audiolibro', from: 'Z02' },
  { label: 'Audible: sin límite, Originals y el truco del día 1', from: 'Z03' },
  { label: 'Storytel: leer y escuchar sin límite', from: 'Z05' },
  { label: 'Podimo: la más barata (y sus pódcasts)', from: 'Z07' },
  { label: 'Nextory: las horas que no gastas se guardan', from: 'Z08' },
  { label: 'BookBeat: horas para cada perfil', from: 'Z10' },
  { label: 'Spotify: 12 horas incluidas en Premium', from: 'Z11' },
  { label: 'Audiobooks.com: libros tuyos para siempre', from: 'Z12' },
  { label: 'ElevenReader: tus PDF en audio', from: 'Z14' },
  { label: 'eBiblio: audiolibros gratis con el carné', from: 'Z15' },
  { label: 'LibriVox y El Libro Total: clásicos gratis', from: 'Z17' },
  { label: 'Truco 1: acelerar no ahorra horas', from: 'Z19' },
  { label: 'Truco 2: cuándo cancelar la prueba', from: 'Z20' },
  { label: 'Truco 3 y 4: web, no app, y encadenar pruebas', from: 'Z21' },
  { label: 'Truco 5: busca el libro antes de pagar', from: 'Z23' },
  { label: '¿Cuál te conviene?', from: 'Z24' },
];

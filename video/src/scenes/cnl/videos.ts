import cfg from './videos.json';
import { sec, speechFrames } from './timeline';
import type { PKey } from '../mp/kit';

// Un tutorial por plataforma (v2, 28/10/2026): el tramo de la plataforma desde el primer fotograma («Para cancelar la suscripción
// de X…») → tiendas (sin voz, si aplica) → promo de SonorBooks (pruebas gratis, algunas exclusivas) → pantalla final.
// Las mismas cuentas están en tools/cnl_music.py (video_scenes): si cambian aquí, cambian allí.
export type PlatVideo = { k: PKey; comp: string; slug: string; name: string; seg: string; store: boolean; piece: [string, string, number]; promo: string; feat: PKey; cards: PKey[] };
export const VIDEOS = cfg.videos as PlatVideo[];
export const T = cfg.timing;

export type VScene = { kind: 'seg' | 'store' | 'promo' | 'end'; id: string; lead: number; dur: number; skip: number; tin: 'push' | 'slide' | 'cut' };
export const STORE_DUR = sec(T.store);
export const END_DUR = sec(T.end);
// Fotogramas del sello «Cancelada» al final del tramo (desde el inicio de la escena).
export const doneAt = (v: PlatVideo) => sec(T.lead) + speechFrames(v.seg) + 2;
export const scenesOf = (v: PlatVideo): VScene[] => {
  const lead = sec(T.lead);
  const pl = sec(T.promoLead);
  const out: VScene[] = [{ kind: 'seg', id: v.seg, lead, dur: lead + speechFrames(v.seg) + sec(T.done), skip: 0, tin: 'push' }];
  if (v.store) out.push({ kind: 'store', id: 'T', lead: 0, dur: STORE_DUR, skip: 0, tin: 'push' });
  out.push({ kind: 'promo', id: v.promo, lead: pl, dur: pl + speechFrames(v.promo) + sec(T.promoTail), skip: 0, tin: 'slide' });
  out.push({ kind: 'end', id: 'E', lead: 0, dur: END_DUR, skip: 0, tin: 'push' });
  return out;
};
export const totalOf = (v: PlatVideo) => scenesOf(v).reduce((a, s) => a + s.dur, 0);
export const startsOf = (v: PlatVideo) => {
  let a = 0;
  return scenesOf(v).map((s) => { const at = a; a += s.dur; return at; });
};

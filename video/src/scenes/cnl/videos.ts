import cfg from './videos.json';
import { CNL_SCENES, sec, speechFrames } from './timeline';
import type { PKey } from '../mp/kit';

// Un tutorial por plataforma: entrada propia → tramo de la plataforma → tiendas (sin voz) → cierre propio con la pantalla final.
export type PlatVideo = { k: PKey; comp: string; slug: string; name: string; hook: string; seg: string; cut: number; close: string; store: boolean; piece: [string, string, number] };
export const VIDEOS = cfg.videos as PlatVideo[];

export type VScene = { kind: 'hook' | 'seg' | 'store' | 'close'; id: string; lead: number; dur: number; skip: number; tin: 'push' | 'slide' | 'cut' };
const TAIL = sec(0.34);
export const STORE_DUR = 320;
export const scenesOf = (v: PlatVideo): VScene[] => {
  const hl = sec(0.5);
  const seg = CNL_SCENES.find((s) => s.id === v.seg)!;
  const skip = v.cut > 0 ? seg.lead + sec(v.cut) : 0;
  const cl = sec(0.4);
  const out: VScene[] = [
    { kind: 'hook', id: v.hook, lead: hl, dur: hl + speechFrames(v.hook) + TAIL + 14, skip: 0, tin: 'push' },
    { kind: 'seg', id: v.seg, lead: seg.lead, dur: seg.dur - skip, skip, tin: 'slide' },
  ];
  if (v.store) out.push({ kind: 'store', id: 'T', lead: 0, dur: STORE_DUR, skip: 0, tin: 'push' });
  out.push({ kind: 'close', id: v.close, lead: cl, dur: cl + speechFrames(v.close) + TAIL + 260, skip: 0, tin: 'push' });
  return out;
};
export const totalOf = (v: PlatVideo) => scenesOf(v).reduce((a, s) => a + s.dur, 0);
export const startsOf = (v: PlatVideo) => {
  let a = 0;
  return scenesOf(v).map((s) => { const at = a; a += s.dur; return at; });
};

import React from 'react';
import type { SceneProps } from './kit';
import { Z01Hook, Z02Modelos } from './Intro';
import { Z03Audible, Z04AudibleOjo, Z05Storytel, Z06StorytelOjo, Z07Podimo, Z08Nextory, Z09NextoryHoras, Z10BookBeat, Z12Audiobooks, Z13AudiobooksAjuste } from './Platforms';
import { Z11Spotify, Z14ElevenReader, Z15eBiblio, Z16eBiblioTruco, Z17LibriVox, Z18ElLibroTotal } from './Free';
import { Z19Velocidad, Z20Cancelar, Z21WebApp, Z22Encadenar, Z23Busca } from './Tricks';
import { Z24Veredicto, Z25Gratis, Z26Cierre } from './Verdict';

export const MP_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  Z01: Z01Hook, Z02: Z02Modelos,
  Z03: Z03Audible, Z04: Z04AudibleOjo, Z05: Z05Storytel, Z06: Z06StorytelOjo,
  Z07: Z07Podimo, Z08: Z08Nextory, Z09: Z09NextoryHoras, Z10: Z10BookBeat, Z11: Z11Spotify,
  Z12: Z12Audiobooks, Z13: Z13AudiobooksAjuste, Z14: Z14ElevenReader,
  Z15: Z15eBiblio, Z16: Z16eBiblioTruco, Z17: Z17LibriVox, Z18: Z18ElLibroTotal,
  Z19: Z19Velocidad, Z20: Z20Cancelar, Z21: Z21WebApp, Z22: Z22Encadenar, Z23: Z23Busca,
  Z24: Z24Veredicto, Z25: Z25Gratis, Z26: Z26Cierre,
};

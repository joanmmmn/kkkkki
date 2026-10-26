import React from 'react';
import type { SceneProps } from './kit';
import { X01Hook, X02Tiendas, X11Resumen, X12Cierre } from './Intro';
import { X03Audible, X04Storytel, X05Spotify, X06Podimo, X07Nextory, X08BookBeat, X09Audiobooks, X10iVoox } from './Platforms';

export const CNL_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  X01: X01Hook, X02: X02Tiendas,
  X03: X03Audible, X04: X04Storytel, X05: X05Spotify, X06: X06Podimo, X07: X07Nextory, X08: X08BookBeat, X09: X09Audiobooks, X10: X10iVoox,
  X11: X11Resumen, X12: X12Cierre,
};

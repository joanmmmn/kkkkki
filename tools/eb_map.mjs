// Mapa de España por comunidades autónomas para el vídeo de eBiblio: trazados SVG ya proyectados (cónica conforme con
// Canarias junto a la península, como en los mapas del IGN), centroides y cajas. Datos: es-atlas (IGN, licencia MIT).
// Uso: node tools/eb_map.mjs <carpeta con node_modules de d3-geo, topojson-client y d3-composite-projections> <es-atlas/es/autonomous_regions.json>
// Escribe video/public/eb/map/ccaa.json (coordenadas en un lienzo de 1600×1200).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const [mods, atlas] = process.argv.slice(2);
const imp = (m, f) => import(path.resolve(mods, 'node_modules', m, f));
const { geoPath, geoCentroid } = await imp('d3-geo', 'src/index.js');
const { feature, mesh } = await imp('topojson-client', 'src/index.js');
const { geoConicConformalSpain } = createRequire(path.resolve(mods, 'package.json'))('d3-composite-projections');
const topo = JSON.parse(fs.readFileSync(atlas, 'utf8'));
const W = 1600, H = 1200, PAD = 40;
const NAMES = {
  '01': 'Andalucía', '02': 'Aragón', '03': 'Asturias', '04': 'Illes Balears', '05': 'Canarias', '06': 'Cantabria',
  '07': 'Castilla y León', '08': 'Castilla-La Mancha', '09': 'Cataluña', '10': 'Comunitat Valenciana', '11': 'Extremadura',
  '12': 'Galicia', '13': 'Madrid', '14': 'Murcia', '15': 'Navarra', '16': 'País Vasco', '17': 'La Rioja', '18': 'Ceuta', '19': 'Melilla',
};
const all = feature(topo, topo.objects.autonomous_regions);
all.features = all.features.filter((f) => NAMES[f.id]);
const proj = geoConicConformalSpain().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], all);
const gp = geoPath(proj);
const r1 = (v) => Math.round(v * 10) / 10;
const shorten = (d) => d.replace(/\d+\.\d+/g, (n) => String(r1(+n)));
const regions = all.features.map((f) => {
  const [[x0, y0], [x1, y1]] = gp.bounds(f);
  const c = gp.centroid(f);
  return { id: f.id, name: NAMES[f.id], d: shorten(gp(f)), c: [r1(c[0]), r1(c[1])], box: [r1(x0), r1(y0), r1(x1 - x0), r1(y1 - y0)], area: Math.round(gp.area(f)) };
});
// costa exterior (para el contorno grueso) y fronteras interiores
const outline = shorten(gp(mesh(topo, topo.objects.autonomous_regions, (a, b) => a === b && a.id !== '20')));
const inner = shorten(gp(mesh(topo, topo.objects.autonomous_regions, (a, b) => a !== b && a.id !== '20' && b.id !== '20')));
const out = { w: W, h: H, regions, outline, inner, canaryBorder: shorten(proj.getCompositionBorders()), source: 'es-atlas 0.6.0 (IGN), proyección geoConicConformalSpain' };
fs.mkdirSync('video/public/eb/map', { recursive: true });
fs.writeFileSync('video/public/eb/map/ccaa.json', JSON.stringify(out));
console.log(regions.map((r) => `${r.id} ${r.name} c=${r.c} box=${r.box} area=${r.area}`).join('\n'));
console.log('bytes', JSON.stringify(out).length);

// Genera los guiones de grabación (tools/record.mjs) del tutorial de Nextory, sincronizados con la locución.
// Tiempos en segundos de escena (la voz empieza a los 0,12 s). Los clics en páginas de Nextory son simulados (fakeClick).
import fs from 'node:fs';
import { SHELL, injectJs, walletButtonsJs, collapseCardJs, expandCardJs, selectPlanJs, blockJs } from '../../tools/nxpage.mjs';
const D = 'captures/nextory/dom/';
const FICHA = 'https://sonorbooks.com/es/audiolibro/como-dejar-de-pensar-demasiado/';
const LANDING = 'https://nextory.com/es/collab/partner/lecturasgratis30';
const base = { viewport: [1920, 1080], slowmo: 3 };
const prepShell = (file, extra = []) => [
  { go: SHELL }, { wait: 1200 }, { clickText: 'Permitir las cookies necesarias', dur: 10 }, { wait: 600 },
  { eval: injectJs(D + file) }, { eval: blockJs }, ...extra.map((e) => ({ eval: e })), { wait: 900 },
];
const scripts = {
  '10_hook_ficha': { ...base, steps: [
    { go: FICHA }, { wait: 1200 }, { clickText: 'Entendido', dur: 10 }, { wait: 800 }, { move: [700, 640], dur: 10 },
    { record: true }, { wait: 450 }, { mark: 'to_box' }, { move: [1040, 552], dur: 950 }, { wait: 1450 }, { mark: 'end' },
  ] },
  '11_ficha_click': { ...base, steps: [
    { go: FICHA }, { wait: 1200 }, { clickText: 'Entendido', dur: 10 }, { wait: 800 }, { move: [1040, 552], dur: 10 },
    { record: true }, { wait: 1500 }, { mark: 'to_btn' }, { move: [1272, 648], dur: 550 }, { wait: 170 },
    { mark: 'click' }, { fakeClick: true }, { wait: 2500 }, { mark: 'end' },
  ] },
  '12_oferta': { ...base, steps: [
    { go: LANDING }, { wait: 3000 }, { move: [1320, 880], dur: 10 },
    { record: true }, { wait: 300 }, { mark: 'to_cookie' }, { move: [673, 692], dur: 850 }, { wait: 300 },
    { mark: 'click_cookie' }, { click: true }, { wait: 500 }, { mark: 'to_cta' }, { move: [143, 555], dur: 850 }, { wait: 200 },
    { mark: 'click_cta' }, { click: true }, { wait: 2600 }, { mark: 'end' },
  ] },
  '13_registro': { ...base, steps: [
    { go: SHELL }, { wait: 1200 }, { clickText: 'Permitir las cookies necesarias', dur: 10 }, { wait: 600 }, { eval: blockJs },
    { eval: "document.querySelectorAll('input').forEach((i) => { i.spellcheck = false; i.setAttribute('spellcheck', 'false'); })" },
    { clickSel: 'main input[type=email], main input[name*=mail i], main input[autocomplete=email]', dur: 10 }, { move: [1010, 262], dur: 10 }, { wait: 400 },
    { record: true }, { wait: 150 }, { mark: 'type' }, { type: 'tucorreo@ejemplo.com', delay: 52 }, { wait: 150 },
    { mark: 'to_cont' }, { move: [960, 385], dur: 500 }, { wait: 170 }, { mark: 'click_cont' }, { fakeClick: true }, { wait: 3700 }, { mark: 'end' },
  ] },
  '14_plan': { ...base, steps: [
    ...prepShell('planinfo.main.html'), { move: [1190, 470], dur: 10 },
    { record: true }, { wait: 3550 }, { mark: 'to_cont1' }, { move: [960, 298], dur: 550 }, { wait: 450 },
    { mark: 'click_cont1' }, { fakeClick: true }, { wait: 150 }, { eval: injectJs(D + 'planform.main.html') }, { mark: 'planform' },
    { wait: 450 }, { mark: 'to_std' }, { move: [960, 406], dur: 600 }, { wait: 350 }, { mark: 'click_std' }, { fakeClick: true },
    { eval: selectPlanJs('STANDARD') }, { wait: 1750 }, { mark: 'to_cont2' }, { move: [960, 675], dur: 600 }, { wait: 400 },
    { mark: 'click_cont2' }, { fakeClick: true }, { wait: 1000 }, { mark: 'end' },
  ] },
  '15_pago': { ...base, steps: [
    ...prepShell('pago.main.html'), { move: [1190, 470], dur: 10 },
    { record: true }, { wait: 500 }, { mark: 'to_bullet' }, { move: [1110, 182], dur: 550 }, { wait: 1550 },
    { mark: 'to_cont' }, { move: [960, 274], dur: 450 }, { wait: 200 }, { mark: 'click_cont' }, { fakeClick: true }, { wait: 100 },
    { eval: injectJs(D + 'payment.main.html') }, { eval: walletButtonsJs }, { eval: collapseCardJs }, { mark: 'confirma' },
    { mark: 'to_card' }, { move: [1175, 350], dur: 450 }, { wait: 150 }, { mark: 'click_card' }, { fakeClick: true },
    { eval: expandCardJs }, { mark: 'expand' }, { wait: 250 }, { mark: 'to_number' }, { move: [1157, 462], dur: 400 },
    { mark: 'fill' }, { wait: 1450 }, { mark: 'to_pay' }, { move: [1175, 735], dur: 550 }, { wait: 50 },
    { mark: 'click_pay' }, { fakeClick: true }, { wait: 2400 }, { mark: 'end' },
  ] },
};
for (const [name, s] of Object.entries(scripts)) fs.writeFileSync(`captures/nextory/${name}.json`, JSON.stringify(s, null, 1));
console.log('guiones:', Object.keys(scripts).join(', '));

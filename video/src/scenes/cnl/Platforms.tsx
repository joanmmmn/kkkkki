import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeInOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { CancelScene, color, font, PhoneStage, SceneProps, shot, Tap, WebPage, WebShots, webZoom, wm } from './kit';

type P = SceneProps;
const WEB_W = 1180;
const WebStage: React.FC<{ pages: WebPage[]; dur: number; from?: number }> = ({ pages, dur, from = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + 16], [0, 1], { ...clamp, easing: easeInOut });
  const fy = Math.sin(frame / 46) * 4;
  return (
    <div style={{ position: 'absolute', left: 70, top: 190 + fy, opacity: p, transform: `translateX(${(1 - p) * -60}px) perspective(2400px) rotateY(${(1 - p) * 8 + 2}deg)`, transformOrigin: 'left center' }}>
      <WebShots pages={pages} width={WEB_W} dur={dur} />
    </div>
  );
};

// X03 · Audible: en la app no se puede (la propia app manda a la web); en audible.es, Detalles de la suscripción y Cancelar.
// La cuenta de las capturas ya estaba cancelada (desde la prueba de la reseña), así que se ve el estado final, no el botón.
export const X03Audible: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const w = (x: string, n = 0) => p.lead + wf('X03', x, n);
  const fPuede = w('puede'), fPropia = w('propia'), fWeb = w('audible.es'), fCuenta = w('cuenta'), fDet = w('Detalles'), fCanc = w('Cancelar');
  const fPausa = w('pausa'), fNo = w('No,'), fFin = w('Finalizar'), fPagabas = w('pagabas');
  const s0 = shot('19_suscripcion', 0, 18.0, 22.0, [[fPropia - 8, fWeb + 4, 40, 860, 600, 48, 12]], 'aud');
  const phoneOut = interpolate(frame, [fWeb - 8, fWeb + 8], [0, 1], { ...clamp, easing: easeInOut });
  const pages: WebPage[] = [{
    at: fWeb - 6, src: 'cnl/web/aud_account.png', url: 'audible.es/account/overview',
    marks: [wm(fDet - 4, fCanc - 6, 436, 147, 108, 20), wm(fCanc - 4, fPausa - 8, 584, 146, 434, 232, 6)],
    camera: webZoom(fWeb - 6, [{ a: fDet - 8, b: fCanc - 8, x: 600, y: 230, z: 1.85 }, { a: fCanc - 4, b: p.dur + 20, x: 800, y: 262, z: 1.7 }]),
  }];
  return (
    <CancelScene {...p} k="audible" web
      stage={(
        <>
          {phoneOut < 1 && (
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - phoneOut, transform: `translateX(${-phoneOut * 80}px)` }}>
              <PhoneStage dur={p.dur} to={fWeb + 8} shots={[s0]} cx={660} enter={p.enter} />
            </div>
          )}
          <WebStage pages={pages} dur={p.dur} from={fWeb - 6} />
          {frame >= fCanc && (
            <div style={{ position: 'absolute', left: 820, top: 860, padding: '12px 22px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 24,
              opacity: interpolate(frame, [fCanc, fCanc + 12], [0, 1], clamp) }}>Nuestra cuenta, ya cancelada</div>
          )}
        </>
      )}
      steps={[
        { at: fCuenta, label: 'audible.es › Tu cuenta', where: 'web' },
        { at: fDet, label: 'Detalles de la suscripción', where: 'web' },
        { at: fCanc, label: 'Cancelar suscripción', where: 'web' },
        { at: fNo, label: '«No, gracias, prefiero cancelar»', where: 'web' },
        { at: fFin, label: 'Finalizar cancelación', where: 'web' },
      ]}
      notes={[
        { at: fPuede, tone: 'warn', label: 'En la app no se puede', sub: 'Te manda a su web' },
        { at: fPausa, tone: 'info', label: 'Antes, una oferta', sub: 'Una pausa o un descuento' },
        { at: fPagabas, tone: 'best', label: 'Sigues hasta fin de mes', sub: 'Lo comprado es tuyo' },
      ]}
      extra={<Sfx name="whoosh_soft" at={fWeb - 6} volume={0.45} />}
    />
  );
};

// X04 · Storytel: Perfil › Configuración › Suscripción; la app pide iniciar sesión en la web; allí Suscripción › Cancelar › Confirmar.
export const X04Storytel: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X04', x, n);
  const fPerfil = w('Perfil'), fRueda = w('rueda'), fSus = w('Suscripción'), fPide = w('pide'), fIniciar = w('iniciar'), fAlli = w('allí');
  const fSus2 = w('Suscripción', 1), fCanc = w('Cancelar'), fConf = w('Confirmar'), fOjo = w('Ojo');
  const shots = [
    shot('str_app', 0, 8.0, 11.5, [[fPerfil - 60, fPerfil, 556, 88, 60, 60, 30]]),
    shot('str_app', fPerfil + 3, 15.0, 15.5, [[fPerfil + 6, fRueda + 20, 556, 88, 58, 58, 29]]),
    shot('str_app', fRueda + 22, 24.0, 24.5, [[fRueda + 24, fSus + 8, 20, 410, 620, 86]]),
    shot('str_app', fSus + 10, 31.0, 31.5, [[fSus + 12, fPide - 4, 14, 176, 630, 74]]),
    shot('str_app', fPide - 2, 38.0, 43.5, [[fPide, fIniciar + 22, 30, 186, 575, 170], [fIniciar + 26, fAlli - 4, 258, 290, 330, 36, 10]]),
    shot('str_web1', fAlli - 2, 0.5, 6.0, [[fAlli + 2, fSus2 + 20, 30, 676, 580, 86]]),
    shot('str_web2', fSus2 + 22, 4.0, 13.5, [[fSus2 + 26, fConf - 6, 430, 860, 135, 58, 12]]),
    shot('str_web2', fConf - 4, 27.5, 29.5, [[fConf - 2, fConf + 50, 150, 822, 330, 86, 43]]),
    shot('str_web2', fConf + 52, 31.5, 40.0, [[fConf + 56, p.dur + 10, 60, 690, 545, 45, 12]]),
  ];
  const taps: Tap[] = [
    { f: fPerfil - 2, x: 586, y: 117 }, { f: fRueda + 18, x: 584, y: 117 }, { f: fSus + 6, x: 320, y: 453 }, { f: fPide - 6, x: 300, y: 212 },
    { f: fAlli - 6, x: 420, y: 308 }, { f: fSus2 + 18, x: 320, y: 718 }, { f: fConf - 8, x: 497, y: 889 }, { f: fConf + 48, x: 315, y: 865 },
  ];
  return (
    <CancelScene {...p} k="storytel"
      stage={<PhoneStage dur={p.dur} shots={shots} taps={taps} enter={p.enter} />}
      steps={[
        { at: fPerfil, label: 'Perfil', where: 'app' },
        { at: fRueda, label: 'Configuración (la rueda)', where: 'app' },
        { at: fSus, label: 'Suscripción', where: 'app' },
        { at: fPide, label: 'Iniciar sesión en su web', where: 'app' },
        { at: fSus2, label: 'Suscripción', where: 'web' },
        { at: fCanc, label: 'Cancelar', where: 'web' },
        { at: fConf, label: 'Confirmar cancelación', where: 'web' },
      ]}
      notes={[{ at: fOjo, tone: 'warn', label: 'En la prueba, se acaba al momento', sub: '«Tu suscripción finalizará de inmediato»' }]}
    />
  );
};

// X05 · Spotify: en la web, Cancelar suscripción › Continuar › «Sí, cancelar». Duo/Familiar: a todos. Free al acabar el mes; Audiolibros+ también.
export const X05Spotify: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X05', x, n);
  const fCuenta = w('cuenta'), fCanc = w('Cancelar'), fEns = w('enseña'), fCont = w('Continuar'), fSi = w('Sí'), fTit = w('titular'), fFree = w('Free'), fAud = w('Audiolibros');
  const pages: WebPage[] = [
    { at: 0, src: 'cnl/web/spo_account.png', url: 'spotify.com/es/account/overview', marks: [wm(fCanc - 4, fEns - 6, 502, 340, 446, 32)],
      camera: webZoom(0, [{ a: fCuenta - 6, b: fEns, x: 724, y: 330, z: 1.9 }]) },
    { at: fEns - 4, src: 'cnl/web/spo_change.png', url: 'spotify.com/es/account/cancel', marks: [wm(fEns, fCont - 8, 640, 118, 178, 108), wm(fCont - 6, fSi - 8, 740, 455, 66, 24, 12)],
      camera: webZoom(fEns - 4, [{ a: fEns - 4, b: fSi, x: 728, y: 300, z: 1.75 }]) },
    { at: fSi - 8, src: 'cnl/web/spo_duo.png', url: 'spotify.com/es/account/cancel', marks: [wm(fSi - 6, fTit - 6, 738, 313, 72, 24, 12), wm(fTit - 4, fFree - 8, 556, 194, 342, 98)],
      camera: webZoom(fSi - 8, [{ a: fSi - 8, b: fFree, x: 728, y: 262, z: 2.0 }]) },
    { at: fFree - 6, src: 'cnl/web/spo_done.png', url: 'spotify.com/es/account/cancel/confirm', marks: [wm(fFree - 2, p.dur + 10, 494, 110, 364, 40)],
      camera: webZoom(fFree - 6, [{ a: fFree - 6, b: p.dur + 20, x: 700, y: 200, z: 1.75 }]) },
  ];
  return (
    <CancelScene {...p} k="spotify" web
      stage={<WebStage pages={pages} dur={p.dur} />}
      steps={[
        { at: fCuenta, label: 'spotify.com › Tu cuenta', where: 'web' },
        { at: fCanc, label: 'Cancelar suscripción', where: 'web' },
        { at: fCont, label: 'Continuar', where: 'web' },
        { at: fSi, label: '«Sí, cancelar»', where: 'web' },
      ]}
      notes={[
        { at: fTit, tone: 'warn', label: 'Duo o Familiar: a todos', sub: 'Si eres el titular' },
        { at: fFree, tone: 'info', label: 'Pasas a Free', sub: 'Al acabar el mes pagado' },
        { at: fAud, tone: 'info', label: 'Audiolibros+, también', sub: 'Se cancela con Premium' },
      ]}
    />
  );
};

// X06 · Podimo: Configuración › Gestionar suscripción › Cancelar (la app lleva a la web con la sesión iniciada); oferta, encuesta y «¿seguro?».
export const X06Podimo: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X06', x, n);
  const fConf = w('Configuración'), fGest = w('Gestionar'), fPulsar = w('pulsar'), fCanc = w('Cancelar'), fDice = w('dice'), fPero = w('pero'), fPulsa = w('Pulsa');
  const fCanc2 = w('Cancelar', 1), fOferta = w('oferta'), fEnc = w('encuesta'), fUlt = w('último'), fPrueba = w('prueba'), fPierdes = w('pierdes'), fPasas = w('pasas');
  const shots = [
    shot('pod_menu', 0, 3.0, 8.0, [[fConf - 60, fConf - 6, 548, 84, 66, 66, 33]]),
    shot('pod_menu', fConf - 6, 15.0, 15.5, [[fConf - 4, fGest - 6, 312, 232, 292, 70, 14]]),
    shot('pod_config', fGest - 6, 3.8, 4.5, [[fGest - 4, fPulsar + 16, 27, 646, 572, 104, 16]]),
    shot('pod_memb', fPulsar + 18, 6.0, 6.5, [[fPulsar + 20, fDice, 30, 1080, 560, 60, 14]]),
    shot('pod_memb', fDice, 31.0, 31.5, [[fDice + 2, fPero - 2, 60, 590, 545, 215, 24], [fPero + 2, fPulsa - 6, 88, 824, 455, 78, 39]]),
    shot('pod_web', fPulsa - 6, 22.0, 26.0, [[fPulsa - 2, fCanc2 + 22, 420, 1296, 185, 96, 20]]),
    shot('pod_web', fCanc2 + 24, 38.0, 39.0, [[fCanc2 + 26, fOferta - 10, 40, 1335, 585, 66, 33]]),
    shot('pod_web', fOferta - 10, 52.0, 53.0, [[fOferta - 6, fEnc - 10, 30, 950, 570, 350, 24]]),
    shot('pod_web', fEnc - 8, 76.0, 77.0, [[fEnc - 4, fUlt - 6, 20, 920, 620, 370, 20]]),
    shot('pod_web', fUlt - 4, 92.0, 93.0, [[fUlt - 2, fPrueba - 4, 30, 1326, 575, 86, 43], [fPrueba - 2, fPierdes + 20, 20, 1030, 620, 95, 14]]),
    shot('pod_web', fPierdes + 22, 110.0, 111.0, [[fPierdes + 26, fPasas - 4, 20, 1100, 620, 200, 20]]),
    shot('pod_web', fPasas - 2, 132.0, 133.0, [[fPasas, p.dur + 10, 30, 275, 570, 265, 24]]),
  ];
  const taps: Tap[] = [
    { f: fConf - 8, x: 581, y: 116 }, { f: fGest - 8, x: 458, y: 267 }, { f: fPulsar + 14, x: 310, y: 698 }, { f: fDice - 2, x: 167, y: 1109 },
    { f: fPulsa - 8, x: 315, y: 862 }, { f: fCanc2 + 20, x: 512, y: 1344 }, { f: fOferta - 12, x: 332, y: 1368 }, { f: fEnc - 10, x: 332, y: 1368 },
    { f: fUlt - 6, x: 330, y: 1368 }, { f: fPierdes + 20, x: 318, y: 1369 },
  ];
  return (
    <CancelScene {...p} k="podimo"
      stage={<PhoneStage dur={p.dur} shots={shots} taps={taps} enter={p.enter} />}
      steps={[
        { at: fConf, label: 'Tu foto › Configuración', where: 'app' },
        { at: fGest, label: 'Gestionar suscripción', where: 'app' },
        { at: fCanc, label: 'Cancelar suscripción', where: 'app' },
        { at: fCanc2, label: 'Cancelar suscripción', where: 'web' },
        { at: fEnc, label: 'Encuesta › Continuar', where: 'web' },
        { at: fUlt, label: '«¿Seguro?» › Cancelar suscripción', where: 'web' },
      ]}
      notes={[
        { at: fOferta, tone: 'price', label: 'Oferta: 3 meses por 1 €', sub: 'Si sigues: «Cancelar suscripción»' },
        { at: fPrueba, tone: 'warn', label: 'En la prueba, lo pierdes al momento', sub: 'Pasas al plan Gratis' },
      ]}
    />
  );
};

// X07 · Nextory: Editar cuenta › Cambiar (la app solo manda a la web); en Mis páginas, Cancela tu suscripción; oferta de 15 días y 5 horas.
export const X07Nextory: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X07', x, n);
  const fEdit = w('Editar'), fCamb = w('Cambiar'), fSolo = w('solo'), fAlli = w('Allí'), fMis = w('Mis'), fCanc = w('Cancela'), fPrimero = w('Primero'), fLuego = w('luego');
  const fOferta = w('oferta'), fQuince = w('quince'), fSigue = w('Sigue'), fCont = w('Continuar'), fElige = w('elige'), fMotivo = w('motivo'), fMarca = w('marca'), fConfirma = w('confirma'), fPrueba = w('prueba');
  const shots = [
    shot('nx_app', 0, 4.0, 8.0, [[fEdit - 70, fEdit - 8, 570, 100, 60, 60, 30]]),
    shot('nx_app', fEdit - 8, 26.0, 26.5, [[fEdit - 6, fCamb - 6, 30, 382, 600, 72, 16]]),
    shot('nx_sub', fCamb - 6, 4.0, 12.0, [[fCamb - 4, fSolo - 2, 520, 340, 100, 44, 12]]),
    shot('nx_sheet', fSolo, 6.0, 7.0, [[fSolo + 2, fAlli + 4, 24, 1090, 620, 225, 20]]),
    shot('nx_web', fAlli + 6, 4.0, 5.0, [[fMis, fPrimero - 8, 80, 424, 240, 42, 10]]),
    shot('nx_web', fPrimero - 8, 22.0, 23.0, [[fPrimero - 4, fLuego - 6, 20, 190, 624, 305, 20]]),
    shot('nx_web', fLuego - 6, 33.0, 35.0, [[fOferta - 6, fSigue - 6, 36, 684, 588, 136, 16]]),
    shot('nx_web', fSigue - 4, 50.0, 51.0, [[fSigue - 2, fElige - 6, 36, 652, 588, 90, 30]]),
    shot('nx_web', fElige - 6, 72.0, 73.0, [[fElige - 4, fMarca - 6, 76, 572, 510, 90, 14]]),
    shot('nx_web', fMarca - 6, 89.0, 89.5, [[fMarca - 4, fMarca + 34, 90, 1100, 470, 76, 14]]),
    shot('nx_end', fMarca + 36, 2.1, 2.6, [[fMarca + 38, fConfirma - 4, 76, 720, 510, 80, 14], [fConfirma - 2, fPrueba - 12, 168, 843, 325, 90, 45]]),
    shot('nx_end', fPrueba - 10, 5.0, 6.5, [[fPrueba - 8, p.dur + 10, 50, 340, 570, 170, 20]]),
  ];
  const taps: Tap[] = [
    { f: fEdit - 10, x: 600, y: 130 }, { f: fCamb - 8, x: 330, y: 418 }, { f: fSolo - 4, x: 571, y: 362 }, { f: fPrimero - 10, x: 198, y: 445 },
    { f: fLuego - 8, x: 330, y: 1064 }, { f: fElige - 8, x: 330, y: 697 }, { f: fMarca - 8, x: 330, y: 617 }, { f: fMarca + 34, x: 122, y: 1138 },
    { f: fPrueba - 14, x: 330, y: 888 },
  ];
  return (
    <CancelScene {...p} k="nextory"
      stage={<PhoneStage dur={p.dur} shots={shots} taps={taps} enter={p.enter} />}
      steps={[
        { at: fEdit, label: 'Tu perfil › Editar cuenta', where: 'app' },
        { at: fCamb, label: 'Cambiar', where: 'app' },
        { at: fMis, label: 'Mis páginas', where: 'web' },
        { at: fCanc, label: 'Cancela tu suscripción', where: 'web' },
        { at: fCont, label: 'Continuar con la cancelación', where: 'web' },
        { at: fMotivo, label: 'Un motivo', where: 'web' },
        { at: fMarca, label: '«Lo entiendo» y confirmar', where: 'web' },
      ]}
      notes={[
        { at: fQuince, tone: 'price', label: 'Oferta: 15 días gratis y 5 horas', sub: 'Si sigues: «Continuar con la cancelación»' },
        { at: fPrueba, tone: 'warn', label: 'En la prueba, se corta al momento' },
      ]}
    />
  );
};

// X08 · BookBeat: Profile › Account Information (abre su web, en inglés); MENU › Manage subscription › Cancel free trial; motivo y Confirm.
export const X08BookBeat: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X08', x, n);
  const fProf = w('Profile'), fAbre = w('abre'), fMenu = w('menú'), fManage = w('Manage'), fCancel = w('Cancel'), fAvisa = w('avisa'), fLuego = w('Luego');
  const fCont = w('Continue'), fMotivo = w('motivo'), fConfirm = w('Confirm'), fApunta = w('apúntate');
  const shots = [
    shot('bkb_profile', 0, 1.0, 8.0, [[fProf, fAbre - 6, 20, 960, 610, 78, 14]]),
    shot('bkb_load', fAbre - 6, 0.2, 1.9),
    shot('bkb_account', fAbre + 20, 1.0, 8.0, [[fMenu - 16, fManage - 6, 556, 190, 62, 60, 14]]),
    shot('bkb_menu', fManage - 6, 3.0, 4.0, [[fManage - 4, fCancel - 8, 20, 710, 270, 46, 10]]),
    shot('bkb_manage', fCancel - 8, 20.4, 21.0, [[fCancel - 6, fAvisa - 6, 24, 800, 584, 156, 16]]),
    shot('bkb_cancel', fAvisa - 6, 8.0, 9.0, [[fAvisa - 4, fLuego - 4, 30, 330, 580, 180, 16]]),
    shot('bkb_cancel', fLuego - 2, 26.0, 27.0, [[fLuego, fMotivo - 8, 24, 698, 586, 90, 8]]),
    shot('bkb_cancel', fMotivo - 8, 53.0, 54.0, [[fMotivo - 6, fConfirm - 12, 24, 552, 586, 92, 8]]),
    shot('bkb_cancel', fConfirm - 10, 76.0, 77.0, [[fConfirm - 8, fConfirm + 40, 24, 1100, 586, 90, 8]]),
    shot('bkb_cancel', fConfirm + 42, 93.0, 95.0, [[fConfirm + 46, p.dur + 10, 40, 670, 584, 210, 16]]),
  ];
  const taps: Tap[] = [
    { f: fAbre - 8, x: 320, y: 999 }, { f: fManage - 8, x: 587, y: 220 }, { f: fCancel - 10, x: 140, y: 733 }, { f: fAvisa - 8, x: 316, y: 878 },
    { f: fMotivo - 10, x: 317, y: 743 }, { f: fConfirm - 12, x: 317, y: 1348 }, { f: fConfirm + 40, x: 317, y: 1145 },
  ];
  return (
    <CancelScene {...p} k="bookbeat"
      stage={<PhoneStage dur={p.dur} shots={shots} taps={taps} enter={p.enter} />}
      steps={[
        { at: fProf, label: 'Profile › Account Information', where: 'app' },
        { at: fManage, label: 'MENU › Manage subscription', where: 'web' },
        { at: fCancel, label: 'Cancel free trial', where: 'web' },
        { at: fCont, label: 'Continue cancellation', where: 'web' },
        { at: fMotivo, label: 'Un motivo', where: 'web' },
        { at: fConfirm, label: 'Confirm cancellation', where: 'web' },
      ]}
      notes={[
        { at: fAvisa, tone: 'warn', label: 'En la prueba, se acaba en el acto' },
        { at: fApunta, tone: 'warn', label: 'No avisa antes de cobrar', sub: 'Apúntate la fecha' },
      ]}
    />
  );
};

// X09 · Audiobooks.com: solo en la web; My Account › Cancel Subscription; aviso del libro de la prueba, «Email Me Instead» y Confirm Cancel.
export const X09Audiobooks: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X09', x, n);
  const fMy = w('My'), fAbajo = w('abajo'), fCancel = w('Cancel'), fAvisa = w('avisa'), fPerd = w('perderás'), fSolo = w('solo', 1), fEmail = w('Email');
  const fCont = w('Continue'), fMotivo = w('motivo'), fConfirm = w('Confirm'), fInm = w('inmediato');
  const pages: WebPage[] = [
    { at: 0, src: 'cnl/web/abc_account.png', url: 'audiobooks.com/account', cssH: 1278,
      keys: [{ f: 0, y: 0, zoom: 1.15, x: 900 }, { f: fAbajo - 12, y: 0, zoom: 1.15, x: 900 }, { f: fAbajo + 14, y: 459, zoom: 1.8, x: 440 }, { f: fAvisa, y: 459, zoom: 1.8, x: 440 }],
      pmarks: [{ from: fMy - 4, to: fAbajo - 8, x: 1022, y: 26, w: 68, h: 24, r: 8 }, { from: fAbajo + 16, to: fAvisa, x: 384, y: 856, w: 100, h: 26, r: 8 }] },
    { at: fAvisa - 4, src: 'cnl/web/abc_sure.png', url: 'audiobooks.com/account/cancel', cssH: 1548,
      keys: [{ f: fAvisa - 4, y: 0, zoom: 1.5, x: 728 }, { f: fSolo - 12, y: 0, zoom: 1.5, x: 728 }, { f: fSolo + 14, y: 729, zoom: 1.75, x: 728 }],
      pmarks: [{ from: fAvisa, to: fSolo - 12, x: 508, y: 254, w: 440, h: 36, r: 8 }, { from: fEmail - 4, to: fCont - 6, x: 482, y: 1174, w: 494, h: 70, r: 10 }, { from: fCont - 4, to: fMotivo - 8, x: 650, y: 1268, w: 148, h: 38, r: 10 }] },
    { at: fMotivo - 6, src: 'cnl/web/abc_reasons.png', url: 'audiobooks.com/account/cancel', marks: [wm(fMotivo - 2, fConfirm - 6, 350, 226, 174, 22, 8), wm(fConfirm - 4, fInm - 4, 662, 666, 124, 34, 10)],
      camera: webZoom(fMotivo - 6, [{ a: fMotivo - 6, b: fInm, x: 640, y: 450, z: 1.6 }]) },
    { at: fInm - 4, src: 'cnl/web/abc_done.png', url: 'audiobooks.com/account/cancel/confirmation', marks: [wm(fInm, p.dur + 10, 350, 132, 370, 30, 8)],
      camera: webZoom(fInm - 4, [{ a: fInm - 4, b: p.dur + 20, x: 620, y: 260, z: 1.8 }]) },
  ];
  return (
    <CancelScene {...p} k="audiobooks" web
      stage={<WebStage pages={pages} dur={p.dur} />}
      steps={[
        { at: fMy, label: 'My Account', where: 'web' },
        { at: fCancel, label: 'Cancel Subscription', where: 'web' },
        { at: fCont, label: 'Continue to Cancel', where: 'web' },
        { at: fMotivo, label: 'Un motivo', where: 'web' },
        { at: fConfirm, label: 'Confirm Cancel', where: 'web' },
      ]}
      notes={[
        { at: fPerd, tone: 'warn', label: 'Pierdes el libro de la prueba' },
        { at: fEmail, tone: 'trick', label: '«Email Me Instead»', sub: 'Te avisa antes de cobrar' },
        { at: fInm, tone: 'warn', label: 'Es inmediato' },
      ]}
    />
  );
};

// X10 · iVoox, la más fácil: la rueda de Ajustes › Cancelar servicio premium › Cancelar suscripción › Cancelar Premium.
export const X10iVoox: React.FC<P> = (p) => {
  const w = (x: string, n = 0) => p.lead + wf('X10', x, n);
  const fIv = w('iVoox'), fRueda = w('rueda'), fC1 = w('Cancelar'), fC2 = w('Cancelar', 1), fC3 = w('Cancelar', 2), fMant = w('Mantienes');
  const shots = [
    shot('ivx_home', 0, 2.0, 4.5, [[fIv + 10, fRueda + 18, 545, 52, 60, 60, 30]]),
    shot('ivx_ajustes', fRueda + 20, 6.0, 7.0, [[fRueda + 22, fC1 + 50, 20, 884, 620, 78, 14]]),
    shot('ivx_cancel', fC1 + 52, 8.0, 9.0, [[fC2 - 10, fC2 + 50, 190, 1088, 250, 52, 12]]),
    shot('ivx_cancel', fC2 + 52, 28.0, 29.0, [[fC3 - 10, fC3 + 50, 364, 810, 196, 46, 10]]),
    shot('ivx_cancel', fC3 + 52, 39.0, 45.0, [[fC3 + 56, p.dur + 10, 40, 612, 548, 282, 12]]),
  ];
  const taps: Tap[] = [{ f: fRueda + 18, x: 575, y: 82 }, { f: fC1 + 50, x: 330, y: 923 }, { f: fC2 + 50, x: 315, y: 1113 }, { f: fC3 + 50, x: 462, y: 831 }];
  return (
    <CancelScene {...p} k="ivoox"
      stage={<PhoneStage dur={p.dur} shots={shots} taps={taps} enter={p.enter} />}
      steps={[
        { at: fRueda, label: 'La rueda de Ajustes', where: 'app' },
        { at: fC1, label: 'Cancelar servicio premium', where: 'app' },
        { at: fC2, label: 'Cancelar suscripción', where: 'app' },
        { at: fC3, label: 'Cancelar Premium', where: 'app' },
      ]}
      notes={[{ at: fMant, tone: 'best', label: 'Acceso 30 días más', sub: 'Desde el último cobro' }]}
    />
  );
};

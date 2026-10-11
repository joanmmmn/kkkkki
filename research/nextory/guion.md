# Tutorial · Cómo conseguir 30 días gratis de Nextory desde SonorBooks

- **Formato:** YouTube 16:9 (1080p50, ~70 s) + vertical 9:16 para TikTok, Reels y Shorts (~58 s, con subtítulos).
- **Enfoque (Joan, 11/10/2026):** el usuario está en la ficha de un audiolibro y la recomendación es Nextory.
- **Voz:** «Martin Osborne – Polished and Energetic» (`D7dkYvH17OKLgp4SLulf`), `eleven_v4`, estabilidad 0,3, similitud 0,75, velocidad 1,13. Comprobada con Whisper: se entiende todo, también sobre la música.
- **Música:** ElevenLabs Music con secciones alineadas a las escenas (`video/public/music/nx_bed.plan.json`).

## Guion

| Escena | Paso | Locución |
|---|---|---|
| N01 | Gancho | ¿SonorBooks te recomienda Nextory? Así consigues 30 días gratis, en lugar de 14. |
| N02 | 1 · SonorBooks | En la ficha del audiolibro, pulsa «Empezar prueba gratuita». |
| N03 | 2 · Oferta | Acepta solo las cookies necesarias y pulsa «30 días gratis». |
| N04 | 3 · Cuenta | Escribe tu correo, pulsa «Continuar» y crea una contraseña. |
| N05 | 4 · Plan | Tu oferta: 30 días con 15 horas de escucha. Pulsa «Continuar» y elige tu plan: solo lo pagarás si sigues después de la prueba. |
| N06 | 5 · Pago | En el pago, fíjate: hoy no pagas nada. Elige tarjeta, rellena tus datos y pulsa «Inicia tu prueba gratuita». |
| N07 | ¡Listo! | ¡Y listo! Descarga la app de Nextory, entra con tu correo y a escuchar. |
| N08 | Consejo | Si no quieres seguir, cancela en «Mis páginas» antes de que acabe la prueba. Ojo: al cancelar, pierdes el acceso al momento. |
| N09 | Cierre | Y para saber dónde escuchar cualquier audiolibro, y a qué precio, búscalo en SonorBooks. Tu próxima historia te está esperando. |

## Recorrido real comprobado (11/10/2026)

1. Ficha de SonorBooks («Cómo dejar de pensar demasiado»): «Nuestra recomendación · Nextory · 0 € · 30 días de prueba» → «Empezar prueba gratuita» (`/salir/nextory/` → filify.co → `nextory.com/es/collab/partner/lecturasgratis30`). El botón de la portada lleva al mismo sitio.
2. Oferta: «¡30 días gratis para leer y escuchar!», hasta 15 h, «A partir de 7,99 € al mes tras el periodo de prueba», para nuevos usuarios o sin cuenta activa en 6 meses. Banner de cookies (Cookiebot).
3. «Crea tu cuenta» (`/es/profile/registration?code=lecturasgratis30`): correo, casilla de ofertas activada por defecto, «Continuar», o Apple/Google. Después, contraseña.
4. «Tu oferta» (`/es/register/planinfo`): prueba de 30 días con 15 h · cancela en cualquier momento.
5. «Elige tu plan» (`/es/register/planform`): Unlimited desde 9,99 €/mes (preseleccionado), Standard 7,99 €/mes (30 h), Mini 5,99 €/mes (10 h). Ojo: SonorBooks dice «desde 7,99 €/mes».
6. «Pago» (`/es/register/payment-mode`): «No pagas nada hasta el 09/11/2026» → «Confirma tu cuenta»: Apple Pay, Google Pay, tarjeta de crédito, PayPal; botón «Inicia tu prueba gratuita».
7. Ayuda de Nextory: si se cancela durante la prueba, la suscripción deja de funcionar inmediatamente. Se cancela en «Mis páginas» (Suscripción y pago).

## Cómo se grabó

- SonorBooks, la oferta y «Crea tu cuenta»: grabaciones 4K con `tools/record.mjs`, sincronizadas con la locución. El correo es de ejemplo (`tucorreo@ejemplo.com`) y el formulario no se envía (`fakeClick`).
- «Tu oferta», «Elige tu plan», «Pago» y «Confirma tu cuenta»: el `<main>` de cada pantalla se capturó en el navegador de Joan con una sesión de Nextory iniciada (sin rellenar nada) y se reconstruye en 4K con `tools/nxpage.mjs` sobre la página pública de registro (mismo CSS). Los campos de tarjeta son iframes de Adyen: no se capturan y en el vídeo se ven enmascarados.
- No se creó ninguna cuenta ni se usó ninguna tarjeta. La contraseña, la confirmación y la app se explican con animaciones de SonorBooks.

# Revisión local — 8 de noviembre de 2026

- 28 originales extraídos y revisados en hoja de contacto; categorías asignadas a partir de contenido visible. Se corrigió orientación EXIF durante la exportación y se conservaron dimensiones de entrada y salida.
- 28/28 imágenes web: respuesta HTTP 200 mediante el optimizador de Next.js, decodificación válida y proporción comprobada. 10,36 MB de WebP fuente.
- Filtros probados en navegador: Todas 28; Historias 10; Espacios 7; Luz y naturaleza 7; Encuentros 4.
- Visor: apertura, avance con flecha derecha, cierre con Escape y devolución del foco verificados. Usa modal nativo para contener foco y bloquear el fondo.
- Revisión visual a 390 × 844, 768 × 1024 y 1440 × 1000. Sin desbordamiento horizontal en las tres medidas. Imágenes completas, sin estirar; visor con object-fit contain.
- Manrope e Inter verificadas mediante estilos calculados en escritorio y móvil. Archivos locales con next/font; ninguna fuente externa.
- Sin mensajes de error ni advertencias en consola durante la revisión.
- Contactos vacíos ocultos. Anclas internas reales. No hay formulario de envío.
- Compilación de producción y comprobación TypeScript correctas. Auditoría npm: cero vulnerabilidades tras actualizar Sharp.
- Flash de 160 ms, revelación y exclusión por prefers-reduced-motion revisados en código; ausencia de repetición al filtrar y abrir visor verificada. No se simuló la preferencia del sistema ni se midió la animación con instrumentación temporal.
- Contraste: texto grafito y gris oscuro sobre blanco cálido, contorno de foco visible. No se hizo una auditoría WCAG automatizada ni una prueba con lector de pantalla; el comportamiento táctil se revisó con viewport móvil, sin dispositivo físico.

No se creó repositorio remoto, no se hizo push y no se publicó en ningún alojamiento.

## Actualización: introducción de 2,6 segundos

Se sustituyó el flash anterior por la secuencia completa oscuro → flash radial con pico blanco → UNA FOTO MÁS → portada. Componente React único en el layout, sin modificar las 28 fotos ni las fuentes.

Comprobaciones adicionales:
- Capturas sucesivas de navegador y estilos calculados: flash sin marca, aparición gradual de la marca, marca quieta con opacidad 1 y desvanecimiento de la capa sobre la portada. Manrope 600.
- Una sesión nueva reproduce la entrada; recarga de la misma sesión no la repite.
- Escape y botón de salto probados durante la entrada. Se comprueba eliminación del overlay, retiro de inert y restauración del overflow.
- Final automático libera inert y scroll, elimina la capa y conserva las 28 fotografías.
- Filtro Historias (10), retorno a Todas (28), apertura del visor, avance y Escape probados después de saltar.
- A 320 px: marca completa, ancho de texto con padding de aproximadamente 274 px; sin desbordamiento horizontal. Captura local en qa/intro-mobile.png.
- Compilación de producción y TypeScript correctos. Pruebas del bootstrap: sesión nueva, vista, preferencia de movimiento reducido y almacenamiento bloqueado.

Límites: la herramienta de navegador disponible no expone emulación de prefers-reduced-motion, JavaScript desactivado o bloqueo de sessionStorage. Esos casos se verificaron mediante el código y las pruebas del bootstrap; no se simularon como preferencias reales del navegador. No se realizó una medición de tiempos con herramientas de rendimiento: las fases usan las duraciones CSS declaradas y se inspeccionaron con capturas sucesivas.

## Refinamiento vigente: continuidad cálida, espacio y navegación

Esta sección sustituye las decisiones visuales de introducción registradas antes. La versión actual usa #F4F2ED en web e intro, velo grafito translúcido, flash exclusivamente radial y marca grafito. No hay pantalla negra ni rectángulo blanco uniforme. Se retiraron los keyframes anteriores. La cabecera aparece cuando la marca central ya se ha retirado.

Causas corregidas: contraste de fondos durante el desvanecimiento; exceso de escala del título y separaciones; sustitución inmediata de la galería; cambio de src del visor antes de descargar la foto, y recreación/transición residual del elemento al terminar el fundido. Se separaron Gallery y PhotoViewer; se conserva el elemento de imagen ya decodificado.

Verificación realizada:
- Secuencia observada mediante capturas sucesivas en una sesión nueva, tanto en desarrollo (Strict Mode) como en producción. Fondo computado #F4F2ED. No se detectó solapamiento entre marca central y cabecera en las muestras.
- En producción: 19 muestras de la introducción; coordenada superior de la figura de portada constante (319,15625 px). Ambas fotos cargadas al terminar. Las dimensiones están reservadas; no se observaron saltos de composición. No se midió CLS con una herramienta de rendimiento.
- Recarga en la misma sesión entra directamente. Se comprobó el desmontaje de la capa, retiro de inert y restitución del overflow.
- Botón de salto y Escape probados. Visor con flechas, cierre y retorno del foco a la foto de origen.
- Filtros en producción: 10 Historias, 7 Espacios, 7 Luz y naturaleza, 4 Encuentros y 28 Todas. En la muestra de transición a Historias, la barra se mantuvo en 352,390625 px antes y después, con foco en Historias; la galería nunca quedó vacía en las muestras.
- Se detectó y corrigió una opacidad residual al confirmar la foto del visor. En la compilación final, los cambios a las fotos 2 y 3 terminaron con la imagen cargada y opacidad 1. Durante la revisión del fundido se observaron las dos imágenes cargadas y opacidades complementarias.
- Revisión visual a 320 y 390 px (móvil), 768 px (tableta) y 1440 px (escritorio), con filtros completos y sin desbordamiento horizontal. Se observaron también los espacios de la portada, archivo, mirada y contacto.
- Fuentes locales Manrope e Inter conservadas; rangos de peso declarados explícitamente. No hay descargas de fuentes de CDN.
- Compilación de producción y TypeScript correctos. Las cuatro pruebas de bootstrap pasan.

Límites: sin emulación real de movimiento reducido, JavaScript desactivado o almacenamiento bloqueado en la herramienta de navegador. Esos casos se revisaron en CSS/React y en las pruebas de bootstrap. No se hizo perfil de FPS, captura de todos los fotogramas, prueba en dispositivo físico ni simulación de conexión lenta; las afirmaciones visuales corresponden a las muestras observadas en local.

Se mantiene el proyecto local, sin push ni publicación.

## Versión vigente: cámara instantánea, impresión y marca (3,5 s)

Sustituye la introducción anterior. SVG propio sin logotipos comerciales; foto IMG_3667.jpg reutilizada desde /photos/22.webp en su proporción horizontal. Flash pequeño junto al módulo de luz, sin iluminar la pantalla. Papel animado con transform dentro de un recorte situado en la ranura; cuerpo opaco por delante. Misma base #F4F2ED en toda la secuencia. El nombre usa Manrope 600, clamp(24px, 4vw, 48px), espaciado 0,10 em.

Verificado realmente:
- Compilación de producción correcta, incluida comprobación TypeScript. Las cuatro pruebas del bootstrap pasan.
- Secuencia completa observada en producción mediante 33 muestras: salida del papel, revelado, nombre y portada. Se guardaron capturas de impresión y composición final en qa/. La posición superior del espacio reservado para la escena permaneció constante (167,40625 px en la prueba de escritorio). No hubo marca central y cabecera simultáneamente visibles en las muestras.
- Cámara de 180 px en escritorio y 140 px en viewport móvil de 390 × 844. El papel aparece por debajo de la ranura, sin atravesar el objetivo; papel y nombre separados. Foto de impresión cargada durante las muestras.
- Pantalla muy baja de 320 × 280: cámara reducida a 100 px, escena de 19,09 a 196,91 px; el botón de salto empieza a 212 px, sin solapamiento. Sin desbordamiento horizontal. Captura qa/camera-low-mobile.png.
- Escape probado en pantalla baja y Saltar introducción en móvil normal. Ambos desmontan la capa, retiran inert y restauran overflow. El foco vuelve al contenido.
- Recarga en la misma sesión no repite la introducción. Filtrar y abrir visor tampoco la reinician.
- Filtros en navegador: Historias 10, Espacios 7, Luz y naturaleza 7, Encuentros 4, Todas 28.
- Visor: apertura, avance por flecha derecha a 2/28 con imagen cargada, cierre con Escape y retorno del foco a la fotografía original.
- Sin mensajes de error ni advertencias en la consola consultada de producción.

Límites: no se pudo emular prefers-reduced-motion, JavaScript desactivado ni almacenamiento bloqueado en el navegador disponible; se comprobaron en el código y las cuatro pruebas de bootstrap. Tampoco se simuló una descarga fallida/lenta de la miniatura: el fallback de papel cálido, dimensiones reservadas y temporizador independiente está implementado y revisado en código. No se afirma una medición de FPS o captura de todos los fotogramas.

No se añadieron librerías, no se modificaron las 28 fotografías, no se hizo push y no se publicó.

## Versión vigente: cámara animada → disparo y flash → marca → web (3 s)

Se retiraron la impresión, el papel, la fotografía y su precarga de la introducción. Solo cambiaron IntroAnimation y los tokens/keyframes específicos de entrada; la composición del portafolio, fuentes, 28 fotos, filtros y visor permanecen.

Verificación realizada:
- Compilación de producción correcta con TypeScript. Las cuatro pruebas del bootstrap pasan.
- Escritorio: 25 muestras de la secuencia completa. El núcleo del flash y su módulo SVG compartían exactamente el centro (desplazamiento medido x=0, y=0). La cámara entra, encuadra y dispara; después se lee la marca y aparece la portada. No se observaron cámara y marca, ni nombre central y cabecera, superpuestos de forma confusa en las muestras.
- Móvil final de 390 × 844: 34 muestras; cámara de 140 px, sin desbordamiento horizontal. Cero imágenes dentro de la introducción. Desmontaje final y retiro de inert comprobados.
- Pantalla baja 320 × 280: nombre entre 89,86 y 126,25 px; botón de salto desde 212 px, sin solapamiento ni desbordamiento.
- Escape y botón de salto probados; ambos eliminan la capa y restauran inert y overflow.
- Recarga en la misma sesión: no vuelve la introducción. Filtros y visor tampoco la reinician.
- Filtro Historias devuelve 10; Todas devuelve 28. Visor: flecha derecha llega a 2/28 con imagen cargada; Escape cierra y devuelve el foco a la fotografía de origen.
- Sin errores ni advertencias en la consola de producción consultada.

Límites: no se emuló movimiento reducido, JavaScript desactivado o bloqueo de almacenamiento en el navegador disponible. Se revisaron en el código y las pruebas de bootstrap. No se hizo una medición de FPS ni captura de todos los fotogramas; las observaciones corresponden a las muestras capturadas en local.

Sin nuevas dependencias, sin push y sin publicación.

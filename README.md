# UNA FOTO MÁS

Portafolio en Next.js App Router, TypeScript y Tailwind CSS. Incluye 28 fotografías optimizadas, filtros, visor y una introducción con cámara SVG animada. Compatible con Vercel, sin base de datos ni servicios externos obligatorios.

Repositorio: https://github.com/Juan-ia-hash/una-foto-mas (público). Subir el código a GitHub no despliega la web por sí solo; el despliegue en Vercel se realiza posteriormente, con autorización del propietario.

## Requisitos y ejecución local

Node.js **24.x** (archivo `.nvmrc`) y npm. Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000. Si el puerto está ocupado:

```sh
npm run dev -- --port 3001
```

Para comprobar la versión de producción:

```sh
npm run build
npm start
```

El build regenera los tipos de Next.js. Para comprobar TypeScript y las pruebas de arranque:

```sh
npm run check
node --test scripts/test-intro-bootstrap.mjs
```

Con un servidor en el puerto 3000, `node scripts/verify-images.mjs` verifica las 28 respuestas del optimizador, su decodificación y sus proporciones.

## Estructura y fotografías

- `app/`: página, layout, estilos y fuentes locales con sus licencias OFL.
- `components/IntroAnimation.tsx`: cámara SVG, disparo, flash, marca y revelación.
- `components/Gallery.tsx`: filtros y cuadrícula en orden de lectura por filas.
- `components/PhotoViewer.tsx`: visor con teclado y carga de fotos adyacentes.
- `data/photos.ts`: catálogo editable con original, archivo web, identificador, título editorial, categoría, alt, ancho, alto y orden.
- `data/image-metadata.json`: dimensiones de entrada, orientación EXIF y dimensiones web.
- `public/photos/`: **28 WebP**, aproximadamente 10,36 MB en total, necesarios para desplegar.
- `data/contact.ts`: datos de contacto configurables.
- `REVISION.md`: registro histórico de pruebas y sus límites; las secciones finales describen la versión más reciente.

El ZIP y los originales se conservan solo en el espacio de trabajo del propietario, excluidos de Git. No son necesarios para clonar, ejecutar o desplegar.

Para cambiar una foto, exportar una copia WebP con orientación aplicada y actualizar el catálogo con sus dimensiones reales, categoría y descripción. Conservar el original fuera del repositorio. Las proporciones se respetan en la galería y el visor. No añadir lugares, nombres o fechas no comprobados. Las dos fotos de portada se referencian por nombre original en `app/page.tsx`.

Opcionalmente, con los originales en `originales/una foto mas/`, `npm run images` normaliza EXIF, limita el lado mayor a 2200 px sin ampliar y exporta WebP a calidad 84. También crea una hoja de contacto en `qa/`. Esas carpetas están ignoradas. `node scripts/catalog.mjs` reproduce el catálogo inicial y **sobrescribe** los textos y el orden; actualizar ese script antes de usarlo sobre un catálogo personalizado.

## Introducción actual

Secuencia de **3 segundos**: cámara animada → disparo con flash localizado → **UNA FOTO MÁS** → portada. No contiene papel ni fotografía impresa. **No hay botón «Saltar introducción»**; Escape permite finalizarla antes.

Usa React, SVG y CSS, sin librerías de animación. Duraciones y curvas están centralizadas en `app/globals.css`. Cámara de 180 px en escritorio y 140 px en móvil, con adaptación a pantallas bajas. El fondo de intro y web es `#F4F2ED`. La portada permanece montada debajo, con dimensiones reservadas, y no se solapan la marca central y la cabecera.

La clave `sessionStorage` es `una-foto-mas:intro-seen`. Se reproduce una vez por sesión; recargar, filtrar, navegar o abrir el visor no la reinicia. Para verla de nuevo, abrir una sesión nueva. El final automático o Escape desmontan la capa y restauran scroll, interacción y foco. Con movimiento reducido se entra directamente. Si falla el almacenamiento, la web continúa sin persistencia. Sin JavaScript la capa está oculta por defecto; si solo ejecuta el bootstrap, CSS libera la pantalla tras 4 segundos.

## Diseño y tipografías fijas

**Manrope** para marca, títulos, navegación, botones y filtros. **Inter** para párrafos, pies y auxiliares. Mantener estas dos familias en todos los tamaños; no añadir una tercera, serif ni cursivas decorativas.

Se cargan una sola vez con `next/font/local` en `app/layout.tsx`, mediante variables globales y WOFF2 locales. Rangos Manrope 200–800 e Inter 100–900, precarga y `display: optional`. No se usan fuentes de CDN. La asignación central y los tokens están en `app/globals.css`.

Galería de 3/2/1 columnas con fotos completas y orden de teclado coherente. Los filtros conservan la cuadrícula durante la carga inicial de la categoría entrante. El visor mantiene la foto actual hasta preparar la siguiente, con fundido breve y precarga solo de las dos vecinas. Escape, flechas, foco visible y retorno del foco al cerrar. Movimiento reducido elimina desplazamientos, escalas y transiciones.

## Configurar contacto

Editar `data/contact.ts`: correo real en `email`, URL HTTPS completa en `instagram` y dígitos internacionales sin `+` ni espacios en `whatsapp`. Dejar vacíos los datos desconocidos. Los enlaces vacíos se ocultan; Instagram y WhatsApp validan formato. No hay formulario ni envío simulado.

No se necesitan variables de entorno, claves ni `.env.example`.

## Cambios posteriores en GitHub

Antes de modificar, actualizar la rama y revisar el estado. Si hay trabajo local, conservarlo antes de integrar cambios remotos. Crear una rama para cambios nuevos, compilar, revisar archivos y abrir un pull request cuando corresponda. No usar push forzado ni incluir originales, ZIP, secretos, cachés o compilaciones. El lockfile y `.nvmrc` forman parte del proyecto; instalar con `npm ci`.

## Desplegar después en Vercel

Solo cuando el propietario lo autorice:

1. En Vercel, importar `Juan-ia-hash/una-foto-mas` desde GitHub.
2. Elegir **Next.js** y la raíz del repositorio como directorio del proyecto.
3. Seleccionar **Node.js 24.x**, instalación `npm ci` y compilación `npm run build`.
4. Mantener el directorio de salida predeterminado de Next.js; no configurar `out` ni exportación estática.
5. No añadir variables de entorno: esta versión no las requiere.
6. Desplegar y revisar fotos, introducción, filtros, visor y contacto en la vista previa antes de asignar un dominio.

Vercel se ocupa del optimizador de `next/image`. No hace falta un `vercel.json` para esta configuración. Este proyecto no depende de Sites ni de otro alojamiento.

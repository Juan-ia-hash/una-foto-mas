import fs from 'node:fs';
const meta=JSON.parse(fs.readFileSync('data/image-metadata.json','utf8'));
const descriptions=[
['Encuentros','Ideas compartidas','Personas sentadas en una sala siguiendo una presentación proyectada.'],
['Encuentros','La atención','Público reunido en las butacas de un auditorio.'],
['Encuentros','Tomar la palabra','Ponente junto a un atril frente al público.'],
['Luz y naturaleza','Entre la hierba','Oveja de lana abundante entre la vegetación.'],
['Encuentros','Desde la última fila','Vista desde las butacas hacia una mesa de ponentes.'],
['Luz y naturaleza','Un sol cercano','Disco solar amarillo entre nubes de tonos anaranjados.'],
['Luz y naturaleza','Antes de la noche','Sol sobre la silueta oscura de la vegetación.'],
['Luz y naturaleza','El camino verde','Sendero estrecho con barandas de madera rodeado de vegetación.'],
['Historias','Una mirada de cerca','Detalle de un ojo iluminado con el reflejo de una ventana.'],
['Espacios','Luz entre edificios','Recorrido entre edificios y palmeras iluminado por el sol bajo.'],
['Historias','Caminar juntos','Pareja vestida de boda caminando entre edificios y palmeras.'],
['Espacios','La última luz del pasaje','Pasaje urbano con árboles y luz cálida al fondo.'],
['Luz y naturaleza','El día se despide','Atardecer entre ramas y siluetas de árboles.'],
['Historias','Todo en un abrazo','Pareja abrazada y ramo de flores, en blanco y negro.'],
['Luz y naturaleza','Un lugar para quedarse','Banco de madera entre vegetación bajo la luz del sol.'],
['Historias','Antes del sí','Pareja entre árboles y sillas de ceremonia, en blanco y negro.'],
['Historias','Todo preparado','Sillas de madera y flores dispuestas para una ceremonia en un jardín.'],
['Historias','Rodeados de afecto','Pareja durante una ceremonia al aire libre con invitados.'],
['Historias','El momento de firmar','Pareja junto a una mesa de ceremonia rodeada de invitados.'],
['Historias','Bajo un arco verde','Pareja abrazada bajo un arco vegetal iluminado de noche.'],
['Historias','Los pequeños detalles','Mesa con flores y detalles decorativos en una celebración.'],
['Historias','Hacia lo que viene','Pareja de boda de espaldas caminando por una pasarela junto al agua.'],
['Espacios','Geometría en la plaza','Vista elevada de una plaza con árboles redondeados y pavimento geométrico.'],
['Espacios','El ritmo del rojo','Escalera de barandas rojas vista a través de varios niveles.'],
['Espacios','Líneas que invitan a seguir','Vista horizontal del interior curvo de una escalera roja.'],
['Espacios','Un rostro entre páginas','Libro con un retrato en portada sobre una estantería.'],
['Espacios','Historias en los estantes','Estanterías de biblioteca con libros iluminados por luz cálida.'],
['Luz y naturaleza','Verde en silencio','Detalle de hojas carnosas de una planta suculenta.']];
const order=[25,14,8,23,18,2,10,4,22,24,6,3,16,27,15,11,7,1,20,26,13,17,28,19,12,5,21,9];
const photos=order.map((n,i)=>({...meta[n-1],category:descriptions[n-1][0],title:descriptions[n-1][1],alt:descriptions[n-1][2],order:i+1}));
fs.writeFileSync('data/photos.ts',`export const categories = ['Todas','Historias','Espacios','Luz y naturaleza','Encuentros'] as const;\nexport const photos = ${JSON.stringify(photos,null,2)};\n`);

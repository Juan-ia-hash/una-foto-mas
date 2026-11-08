import sharp from 'sharp';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
const root='originales/una foto mas';
const files=(await readdir(root)).filter(f=>/jpe?g$/i.test(f));
await mkdir('public/photos',{recursive:true});await mkdir('qa',{recursive:true});
const info=[];const tiles=[];
for(let i=0;i<files.length;i++){
 const f=files[i], id=String(i+1).padStart(2,'0');const meta=await sharp(`${root}/${f}`).metadata();
 const out=await sharp(`${root}/${f}`).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toFile(`public/photos/${id}.webp`);
 info.push({id,original:f,src:`/photos/${id}.webp`,width:out.width,height:out.height,originalWidth:meta.width,originalHeight:meta.height,exifOrientation:meta.orientation??1});
 const thumb=await sharp(`${root}/${f}`).rotate().resize(220,150,{fit:'contain',background:'#eee'}).jpeg().toBuffer();
 tiles.push({input:thumb,left:(i%4)*240,top:Math.floor(i/4)*185});
 const label=Buffer.from(`<svg width="240" height="35"><rect width="240" height="35" fill="white"/><text x="5" y="20" font-size="11">${id} · ${f.replaceAll('&','&amp;')}</text></svg>`);
 tiles.push({input:label,left:(i%4)*240,top:Math.floor(i/4)*185+150});
}
await sharp({create:{width:960,height:Math.ceil(files.length/4)*185,channels:3,background:'white'}}).composite(tiles).png().toFile('qa/contact-sheet.png');
await writeFile('data/image-metadata.json',JSON.stringify(info,null,2));
console.log(`Prepared ${info.length} photographs`);

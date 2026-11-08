import fs from 'node:fs/promises';
import sharp from 'sharp';
const items=JSON.parse(await fs.readFile('data/image-metadata.json','utf8'));
const results=await Promise.all(items.map(async p=>{const res=await fetch(`http://127.0.0.1:3000/_next/image?url=${encodeURIComponent(p.src)}&w=1080&q=75`);if(!res.ok)throw new Error(`${p.src}: ${res.status}`);const meta=await sharp(Buffer.from(await res.arrayBuffer())).metadata();if(Math.abs(meta.width/meta.height-p.width/p.height)>.005)throw new Error(`Aspect ratio ${p.id}`);return p.id}));
console.log(`HTTP 200, valid image decoding and aspect ratios: ${results.length}/28`);
const total=(await Promise.all(items.map(p=>fs.stat(`public${p.src}`)))).reduce((n,p)=>n+p.size,0);console.log(`Web images: ${(total/1024/1024).toFixed(2)} MB`);

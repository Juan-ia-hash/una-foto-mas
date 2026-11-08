import type { Metadata } from 'next';
import localFont from 'next/font/local';
import IntroAnimation from '../components/IntroAnimation';
import './globals.css';
const manrope=localFont({src:'./fonts/manrope-latin-wght-normal.woff2',variable:'--font-manrope',weight:'200 800',display:'optional'});
const inter=localFont({src:'./fonts/inter-latin-wght-normal.woff2',variable:'--font-inter',weight:'100 900',display:'optional'});
export const metadata:Metadata={title:'UNA FOTO MÁS — Una forma de mirar',description:'Personas, lugares y pequeños detalles. Un archivo de fotografía para detenerse a mirar.'};

// Runs before body paint. With JS disabled/blocked the overlay stays hidden by default.
// Do not mark storage here: React records it when playback actually starts.
const introBootstrap = `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){var seen=false;try{seen=sessionStorage.getItem('una-foto-mas:intro-seen')!==null}catch(e){}if(!seen)document.documentElement.dataset.intro='pending'}}catch(e){}})();`;

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es" suppressHydrationWarning className={`${manrope.variable} ${inter.variable}`}>
    <head><script dangerouslySetInnerHTML={{__html:introBootstrap}} /></head>
    <body><IntroAnimation /><div id="portfolio-content">{children}</div></body>
  </html>;
}

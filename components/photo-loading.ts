import { getImageProps } from 'next/image';
import { photos } from '../data/photos';

export type Photo = (typeof photos)[number];
export const gallerySizes = '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 44vw, 29vw';
export const viewerSizes = '95vw';

/** Match next/image's responsive request; never fetch a second full-resolution original. */
export function preparePhoto(photo: Photo, sizes: string, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(); return; }
    const image = new window.Image();
    const { props } = getImageProps({ src: photo.src, width: photo.width, height: photo.height, alt: photo.alt, sizes });
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener('abort', finish);
      resolve();
    };
    image.onload = () => { image.decode().catch(() => {}).then(finish); };
    image.onerror = finish;
    signal.addEventListener('abort', finish, { once: true });
    image.decoding = 'async';
    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
  });
}

export function waitFor(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(); return; }
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
  });
}

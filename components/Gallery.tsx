'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { photos, categories } from '../data/photos';
import PhotoViewer from './PhotoViewer';
import { gallerySizes, preparePhoto, waitFor } from './photo-loading';

type Category = (typeof categories)[number];
export default function Gallery() {
  const [category, setCategory] = useState<Category>('Todas');
  const [requested, setRequested] = useState<Category>('Todas');
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const [active, setActive] = useState<number | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const visible = useMemo(() => photos.filter(photo => category === 'Todas' || photo.category === category), [category]);

  useEffect(() => () => {
    requestId.current++;
    controller.current?.abort();
    timers.current.forEach(clearTimeout);
  }, []);

  const selectCategory = async (next: Category) => {
    if (next === requested) return;
    const token = ++requestId.current;
    controller.current?.abort();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const abort = new AbortController();
    controller.current = abort;
    setRequested(next);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = getComputedStyle(document.documentElement);
    const exitDuration = reduced ? 0 : parseFloat(root.getPropertyValue('--duration-filter-out')) || 120;
    const enterDuration = reduced ? 0 : parseFloat(root.getPropertyValue('--duration-filter-in')) || 240;
    if (gallery.current) gallery.current.style.minHeight = `${gallery.current.getBoundingClientRect().height}px`;
    setPhase('leaving');
    const candidates = photos.filter(photo => next === 'Todas' || photo.category === next);
    // Keep the previous grid visible while the first incoming row is prepared.
    await Promise.all([
      waitFor(exitDuration, abort.signal),
      Promise.race([
        Promise.all(candidates.slice(0, 6).map(photo => preparePhoto(photo, gallerySizes, abort.signal))),
        waitFor(parseFloat(root.getPropertyValue('--gallery-load-timeout')) || 1400, abort.signal),
      ]),
    ]);
    if (abort.signal.aborted || token !== requestId.current) return;
    abort.abort();
    setCategory(next);
    setPhase('entering');
    timers.current.push(setTimeout(() => {
      if (token !== requestId.current) return;
      setPhase('idle');
      if (gallery.current) gallery.current.style.minHeight = '';
    }, enterDuration));
  };

  const close = () => setActive(null);

  return <>
    <div className="filter-bar"><div className="filters" aria-label="Filtrar fotografías">
      {categories.map(item => <button key={item} type="button" aria-pressed={requested === item} onClick={() => void selectCategory(item)}>{item}</button>)}
    </div><p role="status" aria-live="polite">{String(visible.length).padStart(2, '0')} fotografías</p></div>
    <div ref={gallery} className={`gallery-shell ${phase}`} aria-busy={phase !== 'idle'}>
      <div className="gallery">{visible.map((photo, index) => <figure key={photo.id}>
        <button className="photo-button" aria-label={`Abrir ${photo.title}`} onClick={event => {
            requestId.current++; controller.current?.abort(); timers.current.forEach(clearTimeout);
            setRequested(category); setPhase('idle'); if (gallery.current) gallery.current.style.minHeight = '';
            opener.current = event.currentTarget; setActive(index);
          }}>
          <Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes={gallerySizes} />
          <span className="photo-open" aria-hidden="true">↗</span>
        </button><figcaption><span>{photo.title}</span><span>{photo.category}</span></figcaption>
      </figure>)}</div>
    </div>
    {active !== null && <PhotoViewer photos={visible} initialIndex={active} onClose={close} returnFocus={opener.current} />}
  </>;
}

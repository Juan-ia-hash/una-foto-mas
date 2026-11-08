'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { preparePhoto, viewerSizes, type Photo } from './photo-loading';

type Props = { photos: Photo[]; initialIndex: number; onClose: () => void; returnFocus: HTMLElement | null };
export default function PhotoViewer({ photos, initialIndex, onClose, returnFocus }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [displayed, setDisplayed] = useState(initialIndex);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [crossfading, setCrossfading] = useState(false);
  const [loading, setLoading] = useState(false);
  const requested = useRef(initialIndex);
  const requestId = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closed = useRef(false);

  useEffect(() => {
    closed.current = false;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      closed.current = true;
      requestId.current++;
      pending.current?.abort();
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      element?.close();
      document.body.style.overflow = overflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // Only immediate neighbours, not the entire archive.
    for (const step of [-1, 1]) void preparePhoto(photos[(displayed + step + photos.length) % photos.length], viewerSizes, controller.signal);
    return () => controller.abort();
  }, [displayed, photos]);

  const move = async (step: number) => {
    const next = (requested.current + step + photos.length) % photos.length;
    requested.current = next;
    const token = ++requestId.current;
    pending.current?.abort();
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setIncoming(null);
    setCrossfading(false);
    if (next === displayed) { setLoading(false); return; }
    setLoading(true);
    const controller = new AbortController();
    pending.current = controller;
    await preparePhoto(photos[next], viewerSizes, controller.signal);
    if (controller.signal.aborted || token !== requestId.current || closed.current) return;
    setIncoming(next);
  };

  const revealIncoming = (index: number) => {
    if (index !== incoming || closed.current) return;
    setCrossfading(true);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0
      : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-viewer')) || 180;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setDisplayed(index);
      setIncoming(null);
      setCrossfading(false);
      setLoading(false);
    }, duration);
  };

  return <dialog ref={dialog} className="viewer" aria-label="Visor de fotografías"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); void move(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <div className="viewer-top"><span>UNA FOTO MÁS</span><button autoFocus onClick={onClose} aria-label="Cerrar visor">Cerrar ×</button></div>
    <div className={`viewer-image ${crossfading ? 'is-crossfading' : ''}`} aria-busy={loading}>
      {[displayed, ...(incoming !== null && incoming !== displayed ? [incoming] : [])].map(index =>
        <Image key={photos[index].id}
          className={index === displayed ? 'viewer-current' : `viewer-incoming ${crossfading ? 'is-ready' : ''}`}
          src={photos[index].src} width={photos[index].width} height={photos[index].height}
          alt={index === displayed ? photos[index].alt : ''} aria-hidden={index !== displayed || undefined}
          sizes={viewerSizes} loading="eager"
          onLoad={index !== displayed ? () => revealIncoming(index) : undefined}
          onError={index !== displayed ? () => { setIncoming(null); setLoading(false); requested.current = displayed; } : undefined} />
      )}
    </div>
    <div className="viewer-bottom">
      <button onClick={() => void move(-1)} aria-label="Fotografía anterior">←</button>
      <div aria-live="polite"><p>{photos[displayed].title}</p><span>{displayed + 1} / {photos.length} · {photos[displayed].category}</span></div>
      <button onClick={() => void move(1)} aria-label="Fotografía siguiente">→</button>
    </div>
  </dialog>;
}

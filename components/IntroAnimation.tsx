'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'una-foto-mas:intro-seen';
type IntroState = 'checking' | 'playing' | 'done';

export default function IntroAnimation() {
  const [state, setState] = useState<IntroState>('checking');
  // An idempotence guard, not a second playback state. Strict Mode can replay effects.
  const checked = useRef(false);
  const release = useRef<(() => void) | null>(null);


  const finish = useCallback(() => {
    release.current?.();
    release.current = null;
    delete document.documentElement.dataset.intro;
    setState('done');
  }, []);

  useLayoutEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem(STORAGE_KEY) !== null; } catch { /* Optional storage. */ }
    if (reduced || seen) { finish(); return; }
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* Playback remains usable. */ }
    setState('playing');
  }, [finish]);

  useLayoutEffect(() => {
    if (state !== 'playing') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { finish(); return; }
    const root = document.documentElement;
    const content = document.getElementById('portfolio-content');
    const previousInert = content?.inert ?? false;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = root.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root.dataset.intro = 'playing';
    if (content) content.inert = true;
    document.body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';


    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); finish(); }
    };
    const onMotionChange = () => { if (motion.matches) finish(); };
    document.addEventListener('keydown', onKeyDown);
    motion.addEventListener('change', onMotionChange);
    const duration = parseFloat(getComputedStyle(root).getPropertyValue('--intro-total')) || 3000;
    // Do not wait for photographs or all fonts. Intrinsic dimensions reserve their space.
    const timer = window.setTimeout(finish, duration);
    let released = false;
    const cleanup = () => {
      if (released) return;
      released = true;
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      motion.removeEventListener('change', onMotionChange);
      if (content) content.inert = previousInert;
      document.body.style.overflow = bodyOverflow;
      root.style.overflow = rootOverflow;
      delete root.dataset.intro;
      if (document.activeElement === document.body) {
        const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus : content?.querySelector<HTMLElement>('.brand');
        target?.focus({ preventScroll: true });
      }
    };
    release.current = cleanup;
    return () => { cleanup(); release.current = null; };
  }, [state, finish]);

  if (state === 'done') return null;
  return <div className="intro" data-state={state} role="region" aria-label="Introducción de UNA FOTO MÁS"
    onAnimationEnd={event => {
      if (event.target === event.currentTarget && event.animationName === 'intro-reveal') finish();
    }}>
    <div className="intro-scene" aria-hidden="true">
      <div className="camera-stage">
        <svg className="camera-svg" viewBox="0 0 180 138" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="camera-flash-halo">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".18" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".48" stopColor="#ffe7b8" stopOpacity=".48" />
              <stop offset="1" stopColor="#ffe7b8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="camera-flash-core">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".45" stopColor="#fff" stopOpacity=".95" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="camera-entry">
            <g className="camera-frame">
              <g className="camera-recoil">
                <g className="camera-shutter"><rect x="135" y="17" width="19" height="10" rx="3" fill="var(--ink)" /></g>
                <rect x="8" y="24" width="164" height="110" rx="14" fill="var(--paper)" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 113H171" stroke="currentColor" strokeWidth="1" opacity=".2" />
                <rect x="24" y="42" width="27" height="15" rx="3" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
                <path d="M29 46H46M29 50H46M29 53H46" stroke="currentColor" strokeWidth=".7" opacity=".24" />
                <rect x="134" y="43" width="20" height="13" rx="3" stroke="currentColor" strokeWidth="1.4" />
                <rect x="139" y="47" width="10" height="5" rx="1" fill="currentColor" opacity=".16" />
                <g className="camera-lens">
                  <circle cx="90" cy="77" r="31" fill="var(--paper)" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="90" cy="77" r="24" stroke="currentColor" strokeWidth="1" />
                  <circle cx="90" cy="77" r="16" fill="currentColor" />
                  <circle cx="85" cy="72" r="4" fill="var(--paper)" opacity=".48" />
                </g>
                <circle cx="145" cy="91" r="3" fill="currentColor" opacity=".4" />
                {/* Shared SVG coordinates keep light centred on the flash at every size. */}
                <g transform="translate(37.5 49.5)">
                  <circle className="camera-flash-halo" r="68" fill="url(#camera-flash-halo)" />
                  <circle className="camera-flash-core" r="12" fill="url(#camera-flash-core)" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <p className="intro-name">UNA FOTO MÁS</p>
    </div>
  </div>;
}

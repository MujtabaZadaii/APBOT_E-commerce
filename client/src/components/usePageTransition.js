import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';
export function usePageTransition() {
  const isTransitioningRef = useRef(false);
  const transitionTo = useCallback((onSwitchView) => {
    if (isTransitioningRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      onSwitchView();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    isTransitioningRef.current = true;
    const overlay = document.createElement('div');
    overlay.className = 'sable-page-transition-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '99999',
      background: 'var(--bone)',
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      pointerEvents: 'none'
    });
    document.body.appendChild(overlay);
    const tl = gsap.timeline({
      onComplete: () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        isTransitioningRef.current = false;
      }
    });
    tl.to(overlay, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.35,
      ease: 'power3.inOut',
      onComplete: () => {
        onSwitchView();
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
      }
    })
    .to(overlay, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 0.35,
      ease: 'power3.inOut',
      delay: 0.05
    });
  }, []);
  return { transitionTo };
}

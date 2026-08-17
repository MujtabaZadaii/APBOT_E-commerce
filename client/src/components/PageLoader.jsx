import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function PageLoader({ onComplete }) {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const lettersRef = useRef([]);
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (onComplete) onComplete();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
      gsap.set(lettersRef.current, { opacity: 0, y: 24, letterSpacing: '0.6em' });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
      tl.to(lettersRef.current, {
        opacity: 1,
        y: 0,
        letterSpacing: '0.35em',
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out'
      })
      .to(progressRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      }, '-=0.2')
      .to(lettersRef.current, {
        y: -15,
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.in'
      }, '+=0.1')
      .to(containerRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.6,
        ease: 'power4.inOut'
      }, '-=0.15');
    }, containerRef);
    return () => ctx.revert();
  }, [onComplete]);
  return (
    <div
      ref={containerRef}
      className="sable-page-loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'var(--bone)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        pointerEvents: 'all'
      }}
    >
      <div style={{ position: 'relative', textAlign: 'center', width: '280px' }}>
        <div
          style={{
            fontFamily: 'Archivo, sans-serif',
            fontWeight: 800,
            fontSize: '36px',
            lineHeight: 1,
            color: 'var(--ink)',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
          {['S', 'A', 'B', 'L', 'E'].map((char, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
        </div>
        {}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(16, 16, 16, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            ref={progressRef}
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--ink)',
              transformOrigin: 'left'
            }}
          />
        </div>
      </div>
    </div>
  );
}

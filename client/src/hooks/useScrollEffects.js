import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function useScrollEffects(onHeroReady) {
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    if (isReducedMotion) {
      document.querySelectorAll('.hv, .rv, .product-card').forEach((el) => {
        el.classList.add('on', 'in');
        gsap.set(el, { opacity: 1, y: 0, clipPath: 'none', scale: 1 });
      });
      return () => {
        lenis.destroy();
        window.lenis = null;
        gsap.ticker.remove(updateLenis);
      };
    }
    const ctx = gsap.context(() => {
      let bar = document.getElementById('prog');
      const nav = document.querySelector('nav');
      if (nav && !bar) {
        bar = document.createElement('i');
        bar.id = 'prog';
        nav.appendChild(bar);
      }
      if (bar) {
        gsap.to(bar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
          }
        });
      }
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
      heroTl
        .fromTo('.ann', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('nav', { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('#h1', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.3')
        .fromTo('#wb', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.2 }, '-=0.8')
        .fromTo('#hm', 
          { opacity: 0, y: 40, scale: 1.05, clipPath: 'inset(15% 0% 0% 0%)' }, 
          { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.out' }, 
          '-=1.0'
        )
        .fromTo('#h2', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.9')
        .fromTo('#h3', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.8');
      gsap.to('#hm', {
        y: -35,
        scale: 1.035,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      gsap.to('#wb', {
        y: 65,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      const revealElements = gsap.utils.toArray('.rv');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
      ScrollTrigger.batch('.card', {
        start: 'top 90%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: 'auto'
            }
          );
        }
      });
      const seasonImg = document.getElementById('seasonImg');
      if (seasonImg) {
        gsap.to(seasonImg, {
          scale: 1.12,
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#season',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
      const lookbookFigures = gsap.utils.toArray('#look figure');
      lookbookFigures.forEach((fig) => {
        const img = fig.querySelector('img');
        const speed = parseFloat(fig.dataset.speed || 0.05);
        if (img) {
          gsap.fromTo(
            img,
            {
              clipPath: 'inset(35% 0% 0% 0%)',
              scale: 1.06
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: fig,
                start: 'top 90%',
                end: 'top 35%',
                scrub: 0.8
              }
            }
          );
        }
        gsap.to(fig, {
          y: speed * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: fig,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
      const clothVideo = document.querySelector('#cloth video');
      if (clothVideo) {
        ScrollTrigger.create({
          trigger: '#cloth',
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            if (!clothVideo.src && clothVideo.dataset.src) {
              clothVideo.src = clothVideo.dataset.src;
            }
            clothVideo.play().catch(() => {});
          },
          onLeave: () => clothVideo.pause(),
          onEnterBack: () => clothVideo.play().catch(() => {}),
          onLeaveBack: () => clothVideo.pause()
        });
      }
      const countNums = gsap.utils.toArray('#atelier .acount b');
      countNums.forEach((numEl) => {
        const targetVal = parseInt(numEl.dataset.to || '0', 10);
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: '#atelier',
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: targetVal,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                numEl.textContent = Math.round(obj.val);
              }
            });
          }
        });
      });
    });
    return () => {
      ctx.revert();
      lenis.destroy();
      window.lenis = null;
      gsap.ticker.remove(updateLenis);
    };
  }, []);
}

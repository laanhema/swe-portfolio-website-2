import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = (targetHash?: string) => {
  const initialHashRef = useRef(targetHash);

  useLayoutEffect(() => {
    const navEntries = typeof performance !== 'undefined' ? performance.getEntriesByType('navigation') : [];
    const isReload = navEntries.length > 0
      ? (navEntries[0] as PerformanceNavigationTiming).type === 'reload'
      : (typeof performance !== 'undefined' && (performance as unknown as { navigation?: { type?: number } }).navigation?.type === 1);

    const hash = initialHashRef.current;
    const targetId = (!isReload && hash) ? hash.replace(/^#/, '') : '';
    const targetElement = targetId ? document.getElementById(targetId) : null;

    if (targetElement) {
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      targetElement.scrollIntoView({ behavior: 'instant' });
      html.style.scrollBehavior = prevBehavior;
    }

    const isPreceding = (el: HTMLElement) => {
      if (!targetElement) return false;
      if (el === targetElement || targetElement.contains(el)) return false;
      const position = el.compareDocumentPosition(targetElement);
      return (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    };

    // Setup generic fade-in-up animations for sections
    const elements = gsap.utils.toArray<HTMLElement>('.animate-on-scroll');

    elements.forEach((el) => {
      if (isPreceding(el)) {
        gsap.set(el, { y: 0, opacity: 1 });
      } else {
        gsap.fromTo(
          el,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    ScrollTrigger.refresh();

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};

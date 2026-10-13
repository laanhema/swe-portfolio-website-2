import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = () => {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const elements = gsap.utils.toArray<HTMLElement>('.animate-on-scroll');

      elements.forEach((el) => {
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
      });
    });

    return () => {
      mm.revert();
    };
  }, []);
};

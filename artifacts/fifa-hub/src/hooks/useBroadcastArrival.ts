import { useEffect, useRef } from 'react';

/**
 * Hook to apply the broadcast-enter effect to an element or its children
 * when it scrolls into view.
 */
export function useBroadcastArrival<T extends HTMLElement>(stagger: number = 60, selector?: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = selector 
      ? Array.from(ref.current.querySelectorAll(selector)) 
      : [ref.current];

    if (elements.length === 0) return;

    elements.forEach((el, i) => {
      // Make sure the element has the base class
      if (!el.classList.contains('broadcast-enter')) {
        el.classList.add('broadcast-enter');
      }

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              el.classList.add('fired');
            }, i * stagger);
            obs.unobserve(el);
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
    });

    return () => {
      // Browsers cleanup intersection observers automatically on node removal,
      // but for strict mode or dynamic re-renders, it's good practice.
    };
  }, [stagger, selector]);

  return ref;
}

import { useEffect } from 'react';

export interface ArrivalStep {
  selector: string;
  delay: number;
  stagger?: number;
}

/**
 * Orchestrates a staggered arrival sequence for data-dense pages.
 * Simulates a live broadcast feed coming online.
 */
export function useDataArrival(sequence: ArrivalStep[], trigger: any = true) {
  useEffect(() => {
    if (!trigger) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ selector, delay, stagger = 0 }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, i) => {
        // Ensure base class is present
        if (!el.classList.contains('broadcast-enter')) {
          el.classList.add('broadcast-enter');
        }

        const t = setTimeout(() => {
          el.classList.add('fired');
        }, delay + i * stagger);
        
        timeouts.push(t);
      });
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [sequence, trigger]);
}

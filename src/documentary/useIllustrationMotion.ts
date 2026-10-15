import { useEffect, useRef } from 'react';

export function useIllustrationMotion() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    document.documentElement.classList.add('documentary-motion');
    let visible = false;
    const update = () => { element.dataset.visible = String(visible && !document.hidden); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    }) : null;
    if (observer) observer.observe(element);
    else { visible = true; update(); }
    document.addEventListener('visibilitychange', update);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      document.documentElement.classList.remove('documentary-motion');
      element.dataset.visible = 'false';
    };
  }, []);
  return ref;
}

import { useEffect } from 'react';

export const useIntersectionObserver = (
  targetRef: React.RefObject<HTMLDivElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    }, options);

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [targetRef, onIntersect, options]);
};

import { useEffect, useState, useRef, RefObject } from 'react';

const useOnScreen = (ref: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), { threshold: 1 });
  }, []);

  useEffect(() => {
    observerRef.current && ref.current && observerRef.current.observe(ref.current);

    return () => {
      observerRef.current && observerRef.current.disconnect();
    };
  }, [ref]);

  return [isOnScreen, setIsOnScreen] as const;
};

export default useOnScreen;

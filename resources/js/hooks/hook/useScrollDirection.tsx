import { useState, useEffect } from "react";

const useScrollDirection = (): boolean => {
  const [isScrollingUp, setIsScrollingUp] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const handleScroll = (): void => {
      const currentScrollY: number = window.scrollY;

      const scrollThreshold = window.innerWidth <= 768 ? 300 : 250;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      if (scrollDelta > 10) {
        if (currentScrollY < scrollThreshold) {
          setIsScrollingUp(true);
        } else {
          setIsScrollingUp(currentScrollY < lastScrollY);
        }
        setLastScrollY(currentScrollY);
      }
    };

    const debouncedHandleScroll = (): void => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", debouncedHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return isScrollingUp;
};

export default useScrollDirection;

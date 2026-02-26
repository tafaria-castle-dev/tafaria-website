import { useEffect, useRef, useState } from 'react';

const useScrollDirection = (): boolean => {
    const [isScrollingUp, setIsScrollingUp] = useState<boolean>(true);
    const lastScrollY = useRef<number>(0);
    const scrollUpDistance = useRef<number>(0);

    const NEAR_TOP_THRESHOLD = window?.innerWidth <= 768 ? 300 : 250;
    const SCROLL_UP_REVEAL_DISTANCE = 1550;

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        const handleScroll = (): void => {
            const currentScrollY = window.scrollY;
            const diff = currentScrollY - lastScrollY.current;

            if (Math.abs(diff) < 5) return;

            if (currentScrollY < NEAR_TOP_THRESHOLD) {
                scrollUpDistance.current = 0;
                setIsScrollingUp(true);
            } else if (diff < 0) {
                scrollUpDistance.current += Math.abs(diff);
                if (scrollUpDistance.current >= SCROLL_UP_REVEAL_DISTANCE) {
                    setIsScrollingUp(true);
                }
            } else {
                scrollUpDistance.current = 0;
                setIsScrollingUp(false);
            }

            lastScrollY.current = currentScrollY;
        };

        const debouncedHandleScroll = (): void => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 10);
        };

        window.addEventListener('scroll', debouncedHandleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return isScrollingUp;
};

export default useScrollDirection;

'use client';
import useScrollDirection from '@/hooks/hook/useScrollDirection';

const HeaderAndStories: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const isScrollingUp = useScrollDirection();
    return (
        <div
            id="header-and-stories"
            className={`sticky top-0 z-10 w-full transition-transform duration-300 ease-in-out ${isScrollingUp ? 'translate-y-0' : '-translate-y-full'} `}
        >
            {children}
        </div>
    );
};

export default HeaderAndStories;

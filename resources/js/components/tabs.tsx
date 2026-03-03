import { useDropdown } from '@/hooks/DropdownContext';
import useScrollDirection from '@/hooks/hook/useScrollDirection';
import { useNavigation } from '@/hooks/NavigationContext';
import { Category, Image, Video } from '@/types';
import { useEffect, useRef, useState } from 'react';
import ImageAndVideoGallery from './new-components/Gallery';

const barlowCondensedStyle = {
    fontFamily: '"Barlow Condensed", sans-serif',
    fontWeight: '600',
};
interface TabComponentProps {
    images: Image[];
    categories: Category[];
    videos: Video[];
}
const TabComponent: React.FC<TabComponentProps> = ({
    images,
    categories,
    videos,
}) => {
    const [activeTab, setActiveTab] = useState('Images');
    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef<HTMLDivElement>(null);

    const { addToHistory } = useNavigation();
    const getCurrentPath = () => {
        return window.location.pathname;
    };

    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const currentPath = getCurrentPath();
        addToHistory(currentPath);
    }, []);
    useEffect(() => {
        setIsMobileView(window.innerWidth < 640);
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                const rect = stickyRef.current.getBoundingClientRect();
                const expectedTop = isMobileView ? 255 : 312;
                const tolerance = 5;

                const currentlySticky =
                    Math.abs(rect.top - expectedTop) <= tolerance;
                setIsSticky(currentlySticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeTab, isMobileView]);

    const { isDropdownOpen } = useDropdown();
    const isScrollingUp = useScrollDirection();

    return (
        <div className="mt-3">
            <ImageAndVideoGallery
                images={images}
                categories={categories}
                videos={videos}
            />
        </div>
    );
};

export default TabComponent;

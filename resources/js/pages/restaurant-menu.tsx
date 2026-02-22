import { useEffect, useRef, useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    measurement_unit?: string;
    category_id: string;
    description?: string;
}

interface MenuCategory {
    id: string;
    name: string;
    menu_id: string;
    parent_category_id?: string | null;
    items?: MenuItem[];
    subcategories?: MenuCategory[];
}

interface Menu {
    id: string;
    name: string;
    header_image: string;
    footer_image: string;
    footer_transform?: string;
    categories?: MenuCategory[];
}

const MenuDisplay: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [landingImage, setLandingImage] = useState<string | null>(null);
    const menuOrder = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snacks & Kids Menu',
        'Wine List',
        'Non Alcoholic Drinks',
        'Alcoholic Beverages',
        'Hot Beverages',
        'Mocktails & Cocktails',
    ] as const;

    const categoryOrder = [
        'Starters',
        'Soups & Salads',
        'Main Selection',
        'Desert',
        'Brandy',
        'Apperatives',
    ];

    const footerTransforms: { [key: string]: string } = {
        Breakfast: ' translateY(75%) rotate(-90deg) scale(1.38)',
        Lunch: ' translateY(40%) rotate(5deg) scale(1.42)',
        Dinner: ' translateY(52%) rotate(0deg) scale(2.4)',
        'Snacks & Kids Menu': 'translateY(30%) rotate(0deg) scale(1)',
        'Wine List': 'translateY(48%) rotate(-45deg) scale(1)',
        'Non Alcoholic Drinks':
            'translateX(-38%) translateY(38%) rotate(0deg) scale(1)',
        'Alcoholic Beverages':
            'translateX(38%) translateY(38%) rotate(0deg) scale(1)',
        'Hot Beverages': 'translateY(43%) rotate(0deg) scale(1)',
        'Mocktails & Cocktails':
            'translateX(38%) translateY(38%) rotate(0deg) scale(1)',
    };
    const fetchLandingImage = async () => {
        try {
            const response = await fetch(
                'https://website-cms.tafaria.com/api/menu-images',
            );
            const data = await response.json();
            if (data.image_path) {
                setLandingImage(data.image_path);
            }
        } catch (error) {
            console.error('Failed to fetch landing image');
        }
    };
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch(
                    'https://website-cms.tafaria.com/api/menus',
                );
                const data = await response.json();
                let fetchedMenus: Menu[] = data.data || [];
                fetchedMenus = fetchedMenus
                    .map((menu) => ({
                        ...menu,
                        footer_transform:
                            footerTransforms[menu.name] ||
                            'translateX(-50%) translateY(68%) rotate(-5deg) scale(1.4)',
                    }))
                    .sort((a, b) => {
                        const indexA = menuOrder.indexOf(a.name as any);
                        const indexB = menuOrder.indexOf(b.name as any);
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    });

                setMenus(fetchedMenus);
            } catch (error) {
                console.error('Failed to fetch menus');
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
        fetchLandingImage();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 2) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sortCategories = (categories: MenuCategory[]): MenuCategory[] => {
        if (!categories) return [];
        return [...categories].sort((a, b) => {
            const indexA = categoryOrder.indexOf(a.name);
            const indexB = categoryOrder.indexOf(b.name);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    };

    const scrollToMenu = (menuId: string) => {
        const element = menuRefs.current[menuId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-amber-50">
                <div className="text-2xl font-bold text-amber-900">
                    Loading Menu...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black py-6">
            <div
                className="mx-auto mb-6 flex w-screen max-w-3xl flex-col items-center justify-center overflow-hidden bg-cover bg-center p-6"
                style={{
                    backgroundImage: `url('/background-image.jpg')`,
                }}
            >
                <img
                    src="/menu-header.png"
                    alt="Menu Header"
                    className="mb-12 h-22 w-auto object-contain drop-shadow-2xl"
                />
                {landingImage && (
                    <img
                        src={landingImage}
                        alt="Landing"
                        className="mb-8 h-50 object-contain drop-shadow-2xl"
                    />
                )}
                <div className="flex w-full flex-col items-center space-y-4">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => scrollToMenu(menu.id)}
                            className="min-w-[280px] rounded-full bg-[#ecd18e] px-8 py-3 text-center text-2xl font-semibold text-amber-900 shadow-md transition-colors hover:bg-amber-300"
                        >
                            {menu.name}
                        </button>
                    ))}
                </div>
                <div className="mt-16">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="mb-12 h-72 w-auto object-contain drop-shadow-2xl"
                    />
                </div>
            </div>

            {menus.map((currentMenu) => (
                <div
                    key={currentMenu.id}
                    ref={(el) => {
                        menuRefs.current[currentMenu.id] = el;
                    }}
                    className="relative mx-auto mb-6 min-h-screen w-screen max-w-3xl overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/background-image.jpg')`,
                    }}
                >
                    <div className="relative flex min-h-screen flex-col pb-64">
                        {currentMenu.header_image && (
                            <div className="px-8 pt-10">
                                <img
                                    src={currentMenu.header_image}
                                    alt={currentMenu.name}
                                    className="h-22 w-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto px-8 pt-8">
                            <div className="">
                                {sortCategories(
                                    currentMenu.categories?.filter(
                                        (cat) => !cat.parent_category_id,
                                    ) || [],
                                ).map((category) => (
                                    <div key={category.id} className="mb-14">
                                        <div className="relative border-t-2 border-b-2 border-[#8B0000] pt-2 pb-2">
                                            <h2 className="px-1 text-4xl font-bold tracking-wider text-[#8B0000]">
                                                {category.name
                                                    .split('(')[0]
                                                    .trim()}
                                                {category.name.includes(
                                                    '(',
                                                ) && (
                                                    <span className="mb-2 text-xl font-normal italic">
                                                        (
                                                        {
                                                            category.name.split(
                                                                '(',
                                                            )[1]
                                                        }
                                                    </span>
                                                )}
                                            </h2>
                                        </div>

                                        {category.items &&
                                            category.items.length > 0 && (
                                                <div className="mt-8 space-y-4">
                                                    {category.items.map(
                                                        (item) => (
                                                            <div
                                                                key={item.id}
                                                                className="pb-1"
                                                            >
                                                                <div className="flex items-baseline justify-between">
                                                                    <span className="pr-4 text-2xl leading-relaxed font-medium text-black">
                                                                        {
                                                                            item.name
                                                                        }
                                                                        {item.measurement_unit && (
                                                                            <span className="ml-2 text-lg text-black italic">
                                                                                (
                                                                                {
                                                                                    item.measurement_unit
                                                                                }

                                                                                )
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className="text-2xl font-bold text-black tabular-nums">
                                                                        {parseInt(
                                                                            item.price.toString(),
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {item.description && (
                                                                    <p className="mt-1 text-base text-gray-700 italic">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                        {category.subcategories &&
                                            category.subcategories.length >
                                                0 && (
                                                <div className="mt-12 space-y-12">
                                                    {sortCategories(
                                                        category.subcategories,
                                                    ).map((sub) => (
                                                        <div key={sub.id}>
                                                            <div className="relative pb-3">
                                                                <h3
                                                                    className="pl-4 text-2xl font-bold text-[#8B0000] uppercase"
                                                                    style={{
                                                                        fontFamily:
                                                                            '"UnifrakturMaguntia", "Cinzel Decorative", serif',
                                                                    }}
                                                                >
                                                                    {sub.name}
                                                                </h3>
                                                                <div className="absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-4 border-[#8B0000]"></div>
                                                                <div className="absolute top-1/2 right-3 left-3 -translate-y-1/2 border-t-2 border-[#A0522D] opacity-80"></div>
                                                            </div>

                                                            {sub.items &&
                                                                sub.items
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mt-6 space-y-5">
                                                                        {sub.items.map(
                                                                            (
                                                                                item,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        item.id
                                                                                    }
                                                                                    className="pb-4"
                                                                                >
                                                                                    <div className="flex items-baseline justify-between">
                                                                                        <span className="pr-4 text-xl leading-relaxed font-medium text-amber-900">
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-2xl font-bold text-amber-900 tabular-nums">
                                                                                            {
                                                                                                item.price
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    {item.description && (
                                                                                        <p className="mt-1 text-sm text-amber-800 italic">
                                                                                            {
                                                                                                item.description
                                                                                            }
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {currentMenu.footer_image && (
                            <div
                                className="background-transparent pointer-events-none absolute bottom-0 left-1/2 z-3 -translate-x-1/2 overflow-hidden"
                                style={{
                                    transform: currentMenu.footer_transform,
                                }}
                            >
                                <img
                                    src={currentMenu.footer_image}
                                    alt="Footer decoration"
                                    className="background-transparent h-auto w-96 object-cover object-center drop-shadow-2xl md:w-[420px]"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed right-8 bottom-8 z-50 rounded-full bg-[#ecd18e] p-4 shadow-lg transition-all hover:scale-110 hover:bg-amber-300"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="h-6 w-6 text-amber-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}

            {menus.length === 0 && (
                <div className="flex h-screen items-center justify-center bg-amber-50">
                    <div className="text-2xl font-bold text-amber-900">
                        No menus available
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuDisplay;

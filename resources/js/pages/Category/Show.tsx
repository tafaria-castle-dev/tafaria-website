import BlogCard from '@/components/blogcard';
import BlogPostCard from '@/components/blogpostcard';
import Cart from '@/components/cart/cart';
import LoadingComponent from '@/components/loader';
import AboutUsPage from '@/components/new-components/About';
import ArtsPage from '@/components/new-components/Arts';
import EventsPage from '@/components/new-components/Events';
import GoDreamPage from '@/components/new-components/goDream';
import StayWithUs from '@/components/new-components/StayWithUs';
import { useInertiaLoading } from '@/hooks/useInertiaLoading';
import {
    AboutUs,
    Amenity,
    Art,
    ArtFacility,
    ArtsEnquiry,
    ArtsExperience,
    ArtsPackage,
    Category,
    DayVisitPackage,
    Dining,
    EventAddon,
    EventPage,
    Metadata,
    Package,
    Schemas,
    SchoolAdditional,
    SchoolProgram,
    TafariaPhilosophy,
    Video,
} from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiChevronUp } from 'react-icons/fi';

interface CategoryProps {
    category: Category;
    metadata: Metadata;
    schemas: Schemas;
    events: EventPage[];
    schoolPrograms: SchoolProgram[];
    packages: Package[];
    videos: Video[];
    dining: Dining[];
    amenities: Amenity[];
    schoolAdditional: SchoolAdditional[];
    eventAddons: EventAddon[];
    aboutUs: AboutUs[];
    tafariaPhilosophy: TafariaPhilosophy[];
    arts: Art[];
    artsPackages: ArtsPackage[];
    artsExperiences: ArtsExperience[];
    artsEnquiry: ArtsEnquiry[];
    artFacilities: ArtFacility[];
    dayVisitPackages: DayVisitPackage[];
}

const useMobileDetect = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    return isMobile;
};
const DatePickerModal: React.FC<{
    selectedDate: string;
    setSelectedDate: (v: string) => void;
    onClose: () => void;
}> = ({ selectedDate, setSelectedDate, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const nextMonth = addDays(currentMonth, 30);
    const month1Start = startOfMonth(currentMonth);
    const month1End = endOfMonth(currentMonth);
    const month2Start = startOfMonth(nextMonth);
    const month2End = endOfMonth(nextMonth);
    const days1 = eachDayOfInterval({ start: month1Start, end: month1End });
    const days2 = eachDayOfInterval({ start: month2Start, end: month2End });

    const handleDateClick = (date: Date) => {
        const formatted = format(date, 'yyyy-MM-dd');
        setSelectedDate(formatted);
        onClose();
    };

    const renderMonth = (days: Date[], monthDate: Date) => (
        <div className="flex-1">
            <div className="mb-2 text-center">
                <h3 className="text-lg font-semibold text-[#93723c]">
                    {format(monthDate, 'MMMM yyyy')}
                </h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((day, i) => {
                    const isSelected =
                        selectedDate &&
                        format(day, 'yyyy-MM-dd') === selectedDate;
                    const isToday = isSameDay(day, new Date());
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dayWithoutTime = new Date(day);
                    dayWithoutTime.setHours(0, 0, 0, 0);
                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(day)}
                            disabled={dayWithoutTime < today}
                            className={`rounded-lg p-2 text-center transition-colors ${
                                isSelected
                                    ? 'bg-[#93723c] text-white'
                                    : 'text-black'
                            } ${isToday ? 'font-bold text-[#93723c]' : ''} ${
                                dayWithoutTime < today
                                    ? 'cursor-not-allowed text-gray-400'
                                    : 'hover:bg-gray-300'
                            }`}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            <div
                className="fixed inset-0 z-[250] bg-black/40"
                onClick={onClose}
            />
            <div
                ref={dropdownRef}
                className="fixed top-1/2 left-1/2 z-[260] max-h-[90vh] w-auto -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={() =>
                            setCurrentMonth(addDays(currentMonth, -30))
                        }
                        className="rounded p-2 hover:bg-gray-100"
                    >
                        <ChevronLeft size={25} color="#93723c" />
                    </button>

                    <button
                        onClick={() =>
                            setCurrentMonth(addDays(currentMonth, 30))
                        }
                        className="rounded p-2 hover:bg-gray-100"
                    >
                        <ChevronRight size={25} color="#93723c" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
                    {renderMonth(days1, currentMonth)}
                    <div className="hidden sm:block sm:w-px sm:bg-gray-200" />
                    {renderMonth(days2, nextMonth)}
                </div>
            </div>
        </>
    );
};
export default function CategoryShow({
    category,
    metadata,
    schemas,
    videos,
    events,
    schoolPrograms,
    schoolAdditional,
    packages,
    dining,
    amenities,
    eventAddons,
    aboutUs,
    tafariaPhilosophy,
    arts,
    artsPackages,
    artsExperiences,
    artsEnquiry,
    artFacilities,
    dayVisitPackages,
}: CategoryProps) {
    const [collapseAll, setCollapseAll] = useState(false);
    const [hasExpandedPosts, setHasExpandedPosts] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const slug = category?.slug || '';
    const type = category?.name?.toLowerCase() || 'blogs';
    let cardSlug = '';

    if (type === 'images') {
        cardSlug = 'images';
    } else if (type === 'videos') {
        cardSlug = 'videos';
    } else {
        cardSlug = type;
    }
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        schoolName: '',
        personName: '',
        personPhone: '',
        grade: '',
        numberOfStudents: '',
        dateOfVisit: format(new Date(), 'yyyy-MM-dd'),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerTriggerRef = useRef<HTMLDivElement | null>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.schoolName.trim() || !formData.personName.trim()) {
            toast.error('School name and contact person are required');
            return;
        }

        const numStudents = Number(formData.numberOfStudents);
        if (isNaN(numStudents) || numStudents < 1) {
            toast.error('Please enter a valid number of students');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'https://website-cms.tafaria.com/api/admin/student-visits/book',
                {
                    ...formData,
                    numberOfStudents: numStudents,
                },
            );

            if (response.status === 200 || response.status === 201) {
                toast.success(
                    'Booking request sent successfully! Our team will contact you soon.',
                    {
                        duration: 8000,
                    },
                );
                setShowBookingModal(false);
                setFormData({
                    schoolName: '',
                    personName: '',
                    personPhone: '',
                    grade: '',
                    numberOfStudents: '',
                    dateOfVisit: format(new Date(), 'yyyy-MM-dd'),
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to send booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const sortedPosts =
        category?.posts?.sort(
            (a, b) => (a.priority || 0) - (b.priority || 0),
        ) || [];

    let introPostTitle = category.name;
    if (category.description) {
        const nameLower = category.name?.toLowerCase() || '';
        if (
            nameLower.includes('student visit') ||
            nameLower.includes('students visit') ||
            nameLower.includes("student's visit") ||
            nameLower.includes('godream')
        ) {
            introPostTitle = "Student's Educational Tours";
        } else if (nameLower.includes('stay with us')) {
            introPostTitle = 'About Tafaria Country Lodge';
        } else if (nameLower.includes('book a conference')) {
            introPostTitle = 'About Tafaria Conference Center';
        }
    }
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDatePicker) setShowDatePicker(false);
                if (showBookingModal) setShowBookingModal(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showDatePicker, showBookingModal]);
    useEffect(() => {
        if (slug === 'rates') {
            router.visit('/rates');
        }
    }, [slug]);
    const introPost = category.description
        ? {
              slug: '',
              title: introPostTitle,
              content: category.description,
              images: [],
              videos: [],
              created_at: category.created_at,
          }
        : null;

    const displayPosts = introPost ? [introPost, ...sortedPosts] : sortedPosts;

    const isMobile = useMobileDetect();
    const isLoading = useInertiaLoading();
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        if (cardSlug && cardRefs.current[cardSlug]) {
            const element = cardRefs.current[cardSlug];
            if (!element) return;

            const scrollSettings = {
                headerHeight: isMobile ? 280 : 80,
                scrollDelay: isMobile ? 50 : 100,
                extraOffset: isMobile ? 20 : 0,
                behavior: isMobile ? 'auto' : ('smooth' as ScrollBehavior),
            };

            const timer = setTimeout(() => {
                try {
                    const elementRect = element.getBoundingClientRect();
                    const offsetPosition =
                        elementRect.top +
                        window.pageYOffset -
                        scrollSettings.headerHeight -
                        scrollSettings.extraOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: scrollSettings.behavior,
                    });
                } catch (error) {
                    console.error('Scroll error:', error);
                    element.scrollIntoView();
                }
            }, scrollSettings.scrollDelay);

            return () => clearTimeout(timer);
        }
    }, [cardSlug, category, isMobile]);

    useEffect(() => {
        if (collapseAll) {
            const timer = setTimeout(() => {
                setCollapseAll(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [collapseAll]);

    const handleCollapseAll = () => {
        setCollapseAll(true);
        setHasExpandedPosts(false);
    };

    if (!category) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-gray-300 border-t-[#94723C]"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">
                    Category Not Found!
                </p>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="w-full">
                <LoadingComponent />
            </div>
        );
    }

    return (
        <div className="w-full">
            {showDatePicker && (
                <DatePickerModal
                    selectedDate={formData.dateOfVisit}
                    setSelectedDate={(date) =>
                        setFormData((prev) => ({ ...prev, dateOfVisit: date }))
                    }
                    onClose={() => setShowDatePicker(false)}
                />
            )}
            {showBookingModal && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setShowBookingModal(false)}
                >
                    <div
                        className={`relative w-full max-w-lg scale-100 transform overflow-hidden rounded-2xl bg-white opacity-100 shadow-2xl shadow-[#93723c]/40 transition-all duration-300`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-[#93723c] to-[#7a5e32] px-6 py-5 text-white">
                            <h2 className="text-2xl font-bold">
                                Book Educational Tour
                            </h2>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6 text-black"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    School Name *
                                </label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-[#93723c] focus:ring-2 focus:ring-[#93723c]/60"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Grade / Level
                                    </label>
                                    <input
                                        type="text"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Grade 6, Form 2, Year 9"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-[#93723c] focus:ring-2 focus:ring-[#93723c]/60"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Number of Students *
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfStudents"
                                        value={formData.numberOfStudents}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-[#93723c] focus:ring-2 focus:ring-[#93723c]/60"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Visit Date *
                                </label>
                                <div
                                    ref={datePickerTriggerRef}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 transition hover:border-[#93723c]"
                                    onClick={() => setShowDatePicker(true)}
                                >
                                    <svg
                                        className="h-5 w-5 text-[#93723c]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="flex-1 text-gray-800">
                                        {formData.dateOfVisit
                                            ? format(
                                                  new Date(
                                                      formData.dateOfVisit,
                                                  ),
                                                  'dd MMM yyyy',
                                              )
                                            : 'Select date'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    name="personName"
                                    value={formData.personName}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-[#93723c] focus:ring-2 focus:ring-[#93723c]/60"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Your Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="personPhone"
                                    value={formData.personPhone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-[#93723c] focus:ring-2 focus:ring-[#93723c]/60"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowBookingModal(false)}
                                    className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#93723c] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[#7a5e32] hover:shadow-lg hover:shadow-[#93723c]/40 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit Booking'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {type === 'blogs' && hasExpandedPosts && (
                <button
                    onClick={handleCollapseAll}
                    className="fixed top-1/2 right-4 z-50 -translate-y-1/2 transform rounded-full bg-transparent px-4 py-2 font-semibold text-gray-700 transition-colors hover:text-[#902729]"
                    aria-label="Collapse All"
                >
                    Collapse All
                    <FiChevronUp className="ml-2 inline-block text-2xl text-[#902729]" />
                </button>
            )}

            <div className="">
                {category && category.name === 'Gift Shop' && <Cart />}

                {category && type !== 'videos' && type !== 'images' && (
                    <div className="relative flex flex-col items-center">
                        {slug.toLowerCase() === 'accommodation' && (
                            <StayWithUs
                                packages={packages}
                                dining={dining}
                                amenities={amenities}
                                dayVisitPackages={dayVisitPackages}
                            />
                        )}
                        {slug.toLowerCase() === 'godream' && (
                            <GoDreamPage
                                schoolPrograms={schoolPrograms}
                                schoolAdditional={schoolAdditional}
                            />
                        )}
                        {slug.toLowerCase() === 'conference' && (
                            <>
                                <EventsPage
                                    events={events}
                                    eventAddons={eventAddons}
                                />
                                <AboutUsPage
                                    aboutUs={aboutUs}
                                    tafariaPhilosophy={tafariaPhilosophy}
                                />{' '}
                            </>
                        )}

                        {slug.toLowerCase() === 'arts' && (
                            <ArtsPage
                                arts={arts}
                                artsPackages={artsPackages}
                                artsExperiences={artsExperiences}
                                artsEnquiry={artsEnquiry}
                                artFacilities={artFacilities}
                            />
                        )}

                        <div className="container mx-auto overflow-x-auto pb-4">
                            {slug.toLowerCase() !== 'blogs' && (
                                <h1 className="p-4 text-3xl font-bold text-[#902729]">
                                    {category.name} Blogs
                                </h1>
                            )}
                            {displayPosts?.map((item, index) => (
                                <div key={index}>
                                    <div
                                        ref={(el) => {
                                            if (el)
                                                cardRefs.current[item.slug] =
                                                    el;
                                        }}
                                        className="flex-shrink-0 snap-start"
                                    >
                                        {slug === 'blogs' ? (
                                            <BlogPostCard
                                                id={item.slug}
                                                imageUrls={item.images || []}
                                                videoUrls={item.videos || []}
                                                slug={item.slug}
                                                type={slug}
                                                title={item.title}
                                                created_at={
                                                    item.created_at || ''
                                                }
                                                content={item.content}
                                                forceCollapse={collapseAll}
                                                onToggle={(expanded) => {
                                                    if (expanded) {
                                                        setHasExpandedPosts(
                                                            true,
                                                        );
                                                    } else if (
                                                        !expanded &&
                                                        !collapseAll
                                                    ) {
                                                        setHasExpandedPosts(
                                                            displayPosts?.some(
                                                                (post, i) => {
                                                                    if (
                                                                        i ===
                                                                        index
                                                                    )
                                                                        return false;
                                                                    const ref =
                                                                        cardRefs
                                                                            .current[
                                                                            post
                                                                                .slug
                                                                        ];
                                                                    return (
                                                                        ref &&
                                                                        ref.getAttribute(
                                                                            'data-expanded',
                                                                        ) ===
                                                                            'true'
                                                                    );
                                                                },
                                                            ) || false,
                                                        );
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <BlogCard
                                                id={item.slug}
                                                imageUrls={item.images || []}
                                                videoUrls={item.videos || []}
                                                slug={item.slug}
                                                type={slug}
                                                title={item.title}
                                                created_at={
                                                    item.created_at || ''
                                                }
                                                content={item.content}
                                                index={index}
                                                videos={videos}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export interface User {
    id: string;
    name: string;
    idnumber?: string | null;
    avatar_id?: string | null;
    avatar_extension?: string | null;
    avatar_width?: number | null;
    avatar_height?: number | null;
    someFile_id?: string | null;
    someFile_extension?: string | null;
    someFile_filesize?: number | null;
    someFile_filename?: string | null;
    email: string;
    password: string;
    posts?: Post[] | null;
    tag?: Tag[] | null;
    created_at?: string | null;
}
export interface Schemas {
    organization: string | object;
    localBusiness: string | object;
    breadcrumb: string | object;
    siteNavigation: string | object;
    jsonLd: string | object;
}

export interface About {
    id: string;
    title?: string | null;
    name: string;
    content: string;
    created_at?: string | null;
}

export interface Category {
    id: string;
    name: string;
    priority: number | null;
    description?: string | null;
    image_path: string | null;
    width?: number | null;
    height?: number | null;
    extension?: string | null;
    posts?: Post[] | null;
    galleries?: Gallery[] | null;
    giftShops?: GiftShop[] | null;
    slug: string;
    created_at?: string | null;
}

export interface Offer {
    id: string;
    name: string;
    priority?: number | null;
    description?: string | null;
    image_id?: string | null;
    image_path?: string | null;
    width?: number | null;
    height?: number | null;
    extension?: string | null;
    slug: string;
}

export interface LeisureActivity {
    id: string;
    name: string;
    priority?: number | null;
    description?: string | null;
    image_id?: string | null;
    image_extension?: string | null;
    image_width?: number | null;
    image_height?: number | null;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    priority?: number | null;
    showBookVisitButton?: boolean | null;
    buttonMessage?: string | null;
    bookingMessage?: string | null;
    author?: User | null;
    categories?: Category[] | null;
    videolinks?: VideoLink[] | null;
    images?: Image[] | null;
    videos?: Video[] | null;
    created_at?: string | null;
    updated_at?: string | null;
    publishedAt?: string | null;
    status?: 'published' | 'draft' | 'archived' | null;
    slug: string;
}

export interface Tag {
    id: string;
    title?: string | null;
    priority?: number | null;
    author?: User | null;
    videolinks?: VideoLink[] | null;
    images?: Image[] | null;
    singleImage?: Image[] | null;
    videos?: Video[] | null;
    created_at?: string | null;
    updated_at?: string | null;
    publishedAt?: string | null;
    status?: 'published' | 'draft' | 'archived' | null;
    slug: string;
}

export interface Image {
    id: string;
    title: string;
    description?: string | null;
    priority?: number | null;
    updated_at?: string | null;
    optimizedSize?: number | null;
    image_id?: string | null;
    image_path?: string | null;
    width?: number | null;
    height?: number | null;
    extension?: string | null;
    post?: Post | null;
    tag?: Tag | null;
    tags?: Tag[] | null;
    herosection?: HeroSection | null;
    slug: string;
}
export interface Metadata {
    title: string;
    description: string;
    keywords?: string[];
    openGraph?: {
        title: string;
        description: string;
        url: string;
        siteName: string;
        images: { url: string; width: number; height: number; alt: string }[];
        locale: string;
        type: string;
    };
    twitter?: {
        card: string;
        title: string;
        description: string;
        creator: string;
        site: string;
        images: string[];
    };
    robots?: {
        index: boolean;
        follow: boolean;
        nocache: boolean;
        googleBot: {
            index: boolean;
            follow: boolean;
            noimageindex: boolean;
            'max-video-preview': number;
            'max-image-preview': string;
            'max-snippet': number;
        };
    };
    icons?: {
        icon: { url: string; sizes?: string; type?: string }[];
        apple: string;
    };
    alternates?: {
        canonical: string;
    };
}
export interface ImageGift {
    id: string;
    title: string;
    description?: string | null;
    image_id?: string | null;
    image_path?: string;
    width?: number | null;
    height?: number | null;
    extension?: string | null;
    giftShop?: GiftShop | null;
    slug: string;
    quantity?: number;
}

export interface ImageAgent {
    id: string;
    title: string;
    description?: string | null;
    image_id?: string | null;
    image_extension?: string | null;
    image_width?: number | null;
    image_height?: number | null;
    slug: string;
}

export interface VideoGift {
    id: string;
    title: string;
    description?: string | null;
    video_id?: string | null;
    video_extension?: string | null;
    video_filesize?: number | null;
    video_filename?: string | null;
    giftShop?: GiftShop | null;
    slug: string;
}

export interface GiftShop {
    id: string;
    title: string;
    description?: string | null;
    dimensions?: string | null;
    amount?: number | null;
    images?: ImageGift[] | null;
    videos?: VideoGift[] | null;
    categories?: Category | null;
    slug: string;
}

export interface VideoLink {
    id: string;
    title: string;
    description?: string | null;
    link: string;
    herosection?: HeroSection[] | null;
    post?: Post[] | null;
    tag?: Tag[] | null;
}

export interface Video {
    id: string;
    title: string;
    description?: string | null;
    video_path;
    slug: string;
}

export interface Gallery {
    id: string;
    title?: string | null;
    description?: string | null;
    type?: string | null;
    image_id?: string | null;
    file_id?: string | null;
    image_width?: number | null;
    image_height?: number | null;
    extension?: string | null;
    file_size?: number | null;
    file_filename?: string | null;
    categories?: Category[] | null;
    slug?: string | null;
}

export interface BlogImage {
    id: string;
    title: string;
    image_id?: string | null;
    image_width?: number | null;
    image_height?: number | null;
    extension?: string | null;
    updated_at?: string | null;
}

export interface HeroSection {
    id: string;
    title: string;
    name: string;
    subtitle: string;
    priority?: number | null;
    images?: Image[] | null;
    videos?: Video[] | null;
    videolinks?: VideoLink[] | null;
    created_at?: string | null;
    updated_at?: string | null;
    publishedAt?: string | null;
    status?: 'published' | 'draft' | 'archived' | null;
    slug: string;
}

export interface ApiResource {
    id: number;
    created_at?: string;
    updated_at?: string;
}

export interface PackageItem extends ApiResource {
    package_id: number;
    image?: string;
    title?: string;
    description?: string;
}

export interface Package extends ApiResource {
    title: string;
    subtitle?: string;
    items?: PackageItem[];
    image?: string;
    description?: string;
    button_message?: string;
}

export interface Dining extends ApiResource {
    image?: string;
    description?: string;
}

export interface Amenity extends ApiResource {
    title?: string;
    subtitle?: string;
    image?: string;
}

export interface SchoolProgram extends ApiResource {
    title?: string;
    subtitle?: string;
    button_message?: string;
    programs_title?: string;
    what_you_get_message?: string;
    programs?: Program[];
}

export interface Program extends ApiResource {
    school_program_id: number;
    image?: string;
    badge_content?: string;
    title?: string;
    description?: string;
}

export interface SchoolAdditional extends ApiResource {
    title?: string;
    description?: string;
    button_message?: string;
}

export interface EventPage extends ApiResource {
    title?: string;
    subtitle?: string;
    button_message?: string;
    customer_proposal_contents?: string;
    items?: EventItem[];
}

export interface EventItem extends ApiResource {
    event_id: number;
    image?: string;
    badge_content?: string;
    title?: string;
    subtitle?: string;
    description?: string;
}

export interface EventAddon extends ApiResource {
    title?: string;
    subtitle?: string;
    button_message?: string;
    addons?: Addon[];
}

export interface Addon extends ApiResource {
    event_addon_id: number;
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
}

export interface AdditionalDetail extends ApiResource {
    opening_hours?: string;
    what_to_carry?: string;
    how_to_get_here_description?: string;
}

export interface AboutUs extends ApiResource {
    title?: string;
    subtitle?: string;
    image?: string;
    description?: string;
    why_tafaria?: string;
    mission?: string;
    differentiators?: string;
}

export interface TafariaPhilosophy extends ApiResource {
    title?: string;
    philosophies?: Philosophy[];
}

export interface Philosophy extends ApiResource {
    tafaria_philosophy_id: number;
    title?: string;
    subtitle?: string;
}

export interface Art extends ApiResource {
    title?: string;
    description?: string;
}

export interface ArtsPackage extends ApiResource {
    title?: string;
    subtitle?: string;
    items?: ArtsPackageItem[];
}

export interface ArtsPackageItem extends ApiResource {
    arts_package_id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    badge_content?: string;
    image?: string;
    button_message?: string;
}

export interface ArtFacility extends ApiResource {
    title?: string;
    subtitle?: string;
    facilities?: Facility[];
}

export interface Facility extends ApiResource {
    art_facility_id: number;
    title?: string;
    subtitle?: string;
    image?: string;
}

export interface ArtsExperience extends ApiResource {
    title?: string;
    subtitle?: string;
    items?: ExperienceItem[];
}

export interface ExperienceItem extends ApiResource {
    arts_experience_id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    badge_content?: string;
    image?: string;
    button_message?: string;
}

export interface ArtsEnquiry extends ApiResource {
    title?: string;
    description?: string;
}
export interface DayVisitPackage {
    id: number;
    title: string;
    subtitle: string | null;
    items: DayVisitPackageItem[];
}

export interface DayVisitPackageItem {
    id: number;
    package_id: number;
    image: string | null;
    pax: number | null;
    price: number | null;
    price_per_extra_pax: number | null;
    title: string | null;
    badge_content: string | null;
    description: string | null;
    button_message: string | null;
}

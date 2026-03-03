import { Category, Image, Video } from '@/types';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

interface ImageGalleryProps {
    images: Image[];
    categories: Category[];
    videos: Video[];
}

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov'];

function isImage(item: Image | Video): item is Image {
    return 'image_path' in item;
}

function isVideoFile(item: Image | Video): boolean {
    if (isImage(item)) {
        return VIDEO_EXTENSIONS.includes((item.extension ?? '').toLowerCase());
    }
    return true;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .tabs {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 24px 0 32px;
  }
  .tab-btn {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.3);
    color: #7a5520;
    padding: 10px 24px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .tab-btn.active {
    background: #b8924b;
    color: white;
    border-color: #b8924b;
  }

  .filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 16px 0 32px;
    align-items: center;
    justify-content: center;
  }
  .chip {
    border: 1px solid rgba(184,146,75,0.25);
    background: rgba(255,255,255,0.7);
    border-radius: 999px;
    padding: 6px 16px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #5a3e2b;
  }
  .chip:hover { transform: translateY(-1px); }
  .chip.active {
    background: rgba(184,146,75,0.22);
    border-color: rgba(184,146,75,0.65);
    color: #7a5520;
  }

  .gallery-grid {
    margin-top: 16px;
    display: grid;
    gap: 28px 20px;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    justify-content: center;
  }
  @media (max-width: 980px) { .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 560px) { .gallery-grid { grid-template-columns: 1fr; } }

  .card {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: white;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.14);
  }

  .media-wrapper {
    position: relative;
    background: #f9f7f2;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .media-wrapper img,
  .media-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .play-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    background: rgba(90,62,43,0.85);
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    color: white;
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

 .share-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #25d366;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  z-index: 3;
}

.share-btn:hover {
  background: #1da851;
  transform: scale(1.1);
}
  .card-body {
    padding: 16px 18px;
  }
  .card-title {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 1.15rem;
    color: #5a3e2b;
    margin-bottom: 6px;
  }
  .card-desc {
    font-size: 0.9rem;
    color: #6b5a4a;
    line-height: 1.4;
  }

  .lb {
    position: fixed;
    inset: 0;
    background: rgba(12,12,12,0.9);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .lb-inner {
    width: min(1150px, 100%);
    max-height: 94vh;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .lb-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255,255,255,0.92);
  }
  .lb-title { font-size: 15px; font-weight: 600; }
  .lb-close {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    color: white;
    padding: 8px 18px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 700;
  }
  .lb-stage {
    position: relative;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    max-height: 78vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lb-stage img,
  .lb-stage video {
    max-width: 100%;
    max-height: 78vh;
    object-fit: contain;
  }
  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 52px;
    height: 52px;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    color: white;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
  }
  .lb-prev { left: 16px; }
  .lb-next { right: 16px; }

  .scroll-top {
    position: fixed;
    right: 28px;
    bottom: 100px;
    width: 52px;
    height: 52px;
    background: #b8924b;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    box-shadow: 0 6px 20px rgba(184,146,75,0.4);
    cursor: pointer;
    z-index: 99;
  }
`;

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.08,
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};

function Lightbox({
    items,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    items: (Image | Video)[];
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const item = items[index];
    const closeRef = useRef<HTMLButtonElement>(null);
    const startX = useRef<number | null>(null);

    useEffect(() => {
        closeRef.current?.focus({ preventScroll: true });
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose, onNext, onPrev]);

    if (!item) return null;

    const src = isImage(item) ? item.image_path : item.video_path;
    const isVid = isVideoFile(item);

    return (
        <div
            className="lb"
            onClick={(e) =>
                (e.target as HTMLElement).classList.contains('lb') && onClose()
            }
            onTouchStart={(e) =>
                (startX.current = e.touches[0]?.clientX ?? null)
            }
            onTouchEnd={(e) => {
                if (startX.current === null) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
                if (Math.abs(dx) > 60) dx < 0 ? onNext() : onPrev();
                startX.current = null;
            }}
        >
            <div className="lb-inner">
                <div className="lb-top">
                    <div className="lb-title">{item.title}</div>
                    <button
                        ref={closeRef}
                        className="lb-close"
                        onClick={onClose}
                    >
                        Close ✕
                    </button>
                </div>

                <div className="lb-stage">
                    <button className="lb-nav lb-prev" onClick={onPrev}>
                        ‹
                    </button>
                    {isVid ? (
                        <video src={src} controls playsInline autoPlay />
                    ) : (
                        <img src={src} alt={item.title} />
                    )}
                    <button className="lb-nav lb-next" onClick={onNext}>
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}

function MediaCard({
    item,
    onOpen,
    index,
}: {
    item: Image | Video;
    onOpen: () => void;
    index: number;
}) {
    const isVid = isVideoFile(item);
    const src = isImage(item) ? item.image_path : item.video_path;

    const shareText = `Check this out 😍: ${item.title} → https://www.tafaria.com/gallery/${item.slug}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    return (
        <motion.div
            className="masonry-item card my-2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            onClick={onOpen}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            <div className="media-wrapper">
                {isVid ? (
                    <>
                        <video
                            src={src}
                            preload="metadata"
                            muted
                            loop
                            playsInline
                        />
                        <div className="play-badge">▶</div>
                    </>
                ) : (
                    <img src={src} alt={item.title} loading="lazy" />
                )}

                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Share on WhatsApp"
                >
                    <FiShare2 size={20} />
                </a>
            </div>

            <div className="card-body">
                <div className="card-title">{item.title}</div>
                {item.description && (
                    <div className="card-desc">{item.description}</div>
                )}
            </div>
        </motion.div>
    );
}

const PAGE_SIZE = 24;

export default function ImageAndVideoGallery({
    images,
    categories,
    videos,
}: ImageGalleryProps) {
    const [tab, setTab] = useState<'images' | 'videos'>('images');
    const [activeFilter, setActiveFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [lbIndex, setLbIndex] = useState<number | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const sortedImages = [...images].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    );

    const filteredImages =
        activeFilter === 'all'
            ? sortedImages
            : sortedImages.filter((img) => img.category?.name === activeFilter);

    const displayedImages = filteredImages.slice(0, page * PAGE_SIZE);
    const hasMoreImages = displayedImages.length < filteredImages.length;

    const displayedVideos = videos.slice(0, page * PAGE_SIZE);
    const hasMoreVideos = displayedVideos.length < videos.length;

    const { ref: sentinelRef } = useInView({
        threshold: 0.8,
        onChange: (inView) => {
            if (inView) {
                if (tab === 'images' && hasMoreImages) setPage((p) => p + 1);
                if (tab === 'videos' && hasMoreVideos) setPage((p) => p + 1);
            }
        },
    });

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setPage(1);
        setLbIndex(null);
    }, [tab, activeFilter]);

    const prevItem = () => {
        if (lbIndex === null) return;
        const total = tab === 'images' ? filteredImages.length : videos.length;
        setLbIndex((prev) => (prev! - 1 + total) % total);
    };

    const nextItem = () => {
        if (lbIndex === null) return;
        const total = tab === 'images' ? filteredImages.length : videos.length;
        setLbIndex((prev) => (prev! + 1) % total);
    };

    const items = tab === 'images' ? filteredImages : videos;
    const displayed = tab === 'images' ? displayedImages : displayedVideos;

    const sortedCategories = [...categories].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    );

    return (
        <>
            <style>{styles}</style>

            <section className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="h1 mb-4 text-[#5a3e2b]">
                        {tab === 'images'
                            ? 'See Us In Pictures'
                            : 'See Us In Videos'}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        A visual journey through Tafaria Castle & Center for the
                        Arts
                    </p>

                    <div className="tabs">
                        <button
                            className={`tab-btn ${tab === 'images' ? 'active' : ''}`}
                            onClick={() => setTab('images')}
                        >
                            Pictures
                        </button>
                        <button
                            className={`tab-btn ${tab === 'videos' ? 'active' : ''}`}
                            onClick={() => setTab('videos')}
                        >
                            Videos
                        </button>
                    </div>

                    {tab === 'images' && (
                        <div
                            className="filters"
                            aria-label="Image category filters"
                        >
                            <button
                                className={`chip ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                All
                            </button>
                            {sortedCategories
                                .filter(
                                    (f) =>
                                        f.name !== 'Blogs' &&
                                        !f.name.includes('Story') &&
                                        !f.name.includes('Our') &&
                                        f.name !== 'Rates',
                                )
                                .map((cat) => (
                                    <button
                                        key={cat.name}
                                        className={`chip ${activeFilter === cat.name ? 'active' : ''}`}
                                        onClick={() =>
                                            setActiveFilter(cat.name)
                                        }
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="px-5 pb-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {displayed.length === 0 ? (
                            <p className="py-20 text-center text-lg text-gray-500">
                                No {tab} found.
                            </p>
                        ) : (
                            <div className="masonry">
                                {displayed.map((item, i) => (
                                    <MediaCard
                                        key={item.id}
                                        item={item}
                                        onOpen={() => setLbIndex(i)}
                                        index={i}
                                    />
                                ))}
                            </div>
                        )}

                        {(tab === 'images' ? hasMoreImages : hasMoreVideos) && (
                            <div ref={sentinelRef} className="h-20" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>

            {showScrollTop && (
                <button
                    className="scroll-top"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}

            {lbIndex !== null && (
                <Lightbox
                    items={items}
                    index={lbIndex}
                    onClose={() => setLbIndex(null)}
                    onPrev={prevItem}
                    onNext={nextItem}
                />
            )}
        </>
    );
}

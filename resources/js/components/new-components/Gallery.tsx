import { Category, Image } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

interface ImageGalleryProps {
    images: Image[];
    categories: Category[];
}

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov'];

function isVideo(image: Image): boolean {
    return VIDEO_EXTENSIONS.includes((image.extension ?? '').toLowerCase());
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');



  .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; align-items:center;justify-content:center; }
  .chip {
    border: 1px solid rgba(184,146,75,0.25);
    background: rgba(255,255,255,0.7);
    border-radius: 999px;
    padding: 6px 16px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.08s ease, background 0.2s ease, border-color 0.2s ease;
    color: #5a3e2b;
  }
  .chip:hover { transform: translateY(-1px); }
  .chip.active {
    background: rgba(184,146,75,0.18);
    border-color: rgba(184,146,75,0.6);
    color: #7a5520;
  }

.gallery-grid {
  margin-top: 24px;
  display: grid;
  gap: 24px 16px;                   
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  justify-content: center;           
}
  @media (max-width: 980px) { .gallery-grid  { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 560px) { .gallery-grid  { grid-template-columns: 1fr; } }

.thumb {
  position: relative;
  overflow: hidden;
  background: #f9f7f2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;                      
}

.thumb img,
.thumb video {
  width: 100%;
  height: auto;
  max-width: 420px;                 
  object-fit: contain;
  object-position: center;
  display: block;
}

  .thumb img[src$=".jpg"]:not([width]),
.thumb img[src$=".jpeg"]:not([width]),
.thumb img[src$=".png"]:not([width]) {
  min-width: 340px;
}
  .thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.38));
    pointer-events: none;
  }
  .thumb-content { 
    position: absolute;
    bottom: 12px;
    left: 12px;
    z-index: 1;
  }

  .hover-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: 2;
    padding: 16px;
    text-align: center;
  }

  .hover-overlay h3 { color: #fff; font-weight: 700; font-family: 'Cinzel', serif; font-size: 0.95rem; margin-bottom: 6px; }
  .hover-overlay p { color: rgba(255,255,255,0.85); font-size: 0.8rem; margin-bottom: 12px; }

  .share-btn {
    background: #25d366;
    border: none;
    border-radius: 999px;
    padding: 8px;
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s ease;
  }
  .share-btn:hover { background: #1da851; }

  .play {
    width: 38px; height: 38px; border-radius: 999px;
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(90,62,43,0.88); color: #fff;
    border: 1px solid rgba(255,255,255,0.3); font-weight: 900; font-size: 14px;
  }


  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 12px; }

  .btn-tertiary {
    background: rgba(184,146,75,0.12);
    color: #7a5520;
    border: 1px solid rgba(184,146,75,0.3);
  }

  .load-sentinel { height: 60px; }

  .scroll-top {
    position: fixed; right: 24px; bottom: 80px;
    background: #b8924b; color: #fff;
    border: none; border-radius: 999px;
    width: 44px; height: 44px;
    font-size: 20px; cursor: pointer;
    box-shadow: 0 4px 16px rgba(184,146,75,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 99;
    transition: background 0.2s ease;
  }
  .scroll-top:hover { background: #8a6830; }

  .lb {
    position: fixed; inset: 0;
    background: rgba(10,10,10,0.82);
    z-index: 1000; padding: 18px;
    display: flex; align-items: center; justify-content: center;
  }
  .lb-inner {
    width: min(1050px, 100%);
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 12px;
  }
  .lb-top {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    color: rgba(255,255,255,0.92);
  }
  .lb-title { font-size: 14px; font-weight: 700; }
  .lb-close {
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.95);
    border-radius: 999px;
    padding: 10px 16px;
    cursor: pointer; font-weight: 800; font-size: 14px;
    transition: background 0.2s ease;
  }
  .lb-close:hover { background: rgba(255,255,255,0.16); }

  .lb-stage {
    position: relative; border-radius: 18px; overflow: hidden;
    background: #111;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 14px 50px rgba(0,0,0,0.4);
    min-height: 320px;
    display: flex; align-items: center; justify-content: center;
  }
  .lb-stage img,
  .lb-stage video {
    max-width: 100%;
    max-height: 76vh;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .lb-stage video { background: #000; }

  .lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 44px; height: 44px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(0,0,0,0.32); color: rgba(255,255,255,0.95);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 900; user-select: none;
    transition: background 0.15s ease;
    z-index: 2;
  }
  .lb-nav:hover { background: rgba(0,0,0,0.5); }
  .lb-prev { left: 12px; }
  .lb-next { right: 12px; }

  .lb-bottom {
    display: flex; align-items: center; justify-content: space-between;
    color: rgba(255,255,255,0.9); gap: 12px;
  }
  .lb-caption { font-size: 13px; opacity: 0.9; }
  .lb-count { font-size: 12px; opacity: 0.7; }

  @media (max-width: 560px) {
    .lb { padding: 10px; }
    .lb-stage { border-radius: 14px; }
  }
`;

function Lightbox({
    items,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    items: Image[];
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

    if (!item || !item.image_path) return null;

    return (
        <div
            className="lb"
            role="dialog"
            aria-label="Gallery viewer"
            onClick={(e) => {
                if ((e.target as HTMLElement).classList.contains('lb'))
                    onClose();
            }}
            onTouchStart={(e) => {
                startX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
                if (startX.current === null) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
                if (Math.abs(dx) > 55) dx < 0 ? onNext() : onPrev();
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
                    <button
                        className="lb-nav lb-prev"
                        onClick={onPrev}
                        aria-label="Previous"
                    >
                        ‹
                    </button>
                    <button
                        className="lb-nav lb-next"
                        onClick={onNext}
                        aria-label="Next"
                    >
                        ›
                    </button>
                    {isVideo(item) ? (
                        <video
                            src={item.image_path}
                            controls
                            playsInline
                            preload="metadata"
                        />
                    ) : (
                        <img
                            src={item.image_path}
                            alt={item.title}
                            loading="eager"
                            width={item.width ?? undefined}
                            height={item.height ?? undefined}
                        />
                    )}
                </div>

                <div className="lb-bottom">
                    <div className="lb-caption">{item.description ?? ''}</div>
                    <div className="lb-count">
                        {index + 1} / {items.length}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MediaCard({ item, onOpen }: { item: Image; onOpen: () => void }) {
    const shareText = `See this 😍: ${item.title} - View it here: https://www.tafaria.com/gallery/${item.slug}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const video = isVideo(item);

    if (!item.image_path) return null;

    return (
        <div
            className="card"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            <div className="thumb">
                {video ? (
                    <video
                        src={item.image_path}
                        preload="metadata"
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        loading="lazy"
                        src={item.image_path}
                        alt={item.title}
                        width={item.width ?? undefined}
                        height={item.height ?? undefined}
                    />
                )}
                <div className="thumb-overlay" />
                <div
                    className="hover-overlay"
                    onClick={(e) => e.stopPropagation()}
                >
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn"
                        aria-label="Share on WhatsApp"
                    >
                        <FiShare2 size={20} />
                    </a>
                </div>
                <div className="thumb-content">
                    {video && <span className="play">▶</span>}
                </div>
            </div>

            <div className="card-body">
                <div className="h3" style={{ marginBottom: 6 }}>
                    {item.title}
                </div>
                {item.description && (
                    <div className="small">{item.description}</div>
                )}
            </div>
        </div>
    );
}

const PAGE_SIZE = 20;

export default function ImageGallery({
    images,
    categories,
}: ImageGalleryProps) {
    const sorted = [...images].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    );

    const [activeFilter, setActiveFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [lbIndex, setLbIndex] = useState<number | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const filtered =
        activeFilter === 'all'
            ? sorted
            : sorted.filter((img) => img.category?.name == activeFilter);

    const displayed = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = displayed.length < filtered.length;

    const { ref: sentinelRef } = useInView({
        threshold: 1.0,
        onChange: (inView) => {
            if (inView && hasMore) setPage((p) => p + 1);
        },
    });

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function handleFilterChange(value: string) {
        setActiveFilter(value);
        setPage(1);
        setLbIndex(null);
    }

    function prevItem() {
        setLbIndex((i) =>
            i === null ? null : (i - 1 + filtered.length) % filtered.length,
        );
    }

    function nextItem() {
        setLbIndex((i) => (i === null ? null : (i + 1) % filtered.length));
    }

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <section className="py-0">
                    <div className="container">
                        <h1 className="h1">See Us In Pictures</h1>
                        <p className="p m-0">
                            A visual tour of Tafaria Castle & Center for the
                            Arts
                        </p>

                        <div className="filters" aria-label="Gallery filters">
                            <button
                                className={`chip ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('all')}
                                aria-pressed={activeFilter === 'all'}
                            >
                                All
                            </button>
                            {categories
                                .filter(
                                    (f) =>
                                        f.name !== 'Blogs' &&
                                        f.name !== 'Rates',
                                )
                                .map((f) => (
                                    <button
                                        key={f.name}
                                        className={`chip ${activeFilter === f.name ? 'active' : ''}`}
                                        onClick={() =>
                                            handleFilterChange(f.name)
                                        }
                                        aria-pressed={activeFilter === f.name}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </section>

                <section className="section-sm" style={{ paddingTop: 0 }}>
                    <div className="container">
                        {filtered.length === 0 ? (
                            <p className="small" style={{ padding: '40px 0' }}>
                                No items found for this filter.
                            </p>
                        ) : (
                            <div className="gallery-grid">
                                {displayed.map((img, i) => (
                                    <MediaCard
                                        key={img.id}
                                        item={img}
                                        onOpen={() => setLbIndex(i)}
                                    />
                                ))}
                            </div>
                        )}

                        {hasMore && (
                            <div ref={sentinelRef} className="load-sentinel" />
                        )}
                    </div>
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
                        items={filtered}
                        index={lbIndex}
                        onClose={() => setLbIndex(null)}
                        onPrev={prevItem}
                        onNext={nextItem}
                    />
                )}
            </div>
        </>
    );
}

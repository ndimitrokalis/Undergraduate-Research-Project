import { useRef, useState, useEffect } from 'react';

export default function Carousel({ children }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      observer.disconnect();
    };
  }, [children]);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    const item = el.querySelector(':scope > *');
    if (!item) return;
    const itemWidth = item.offsetWidth + 16;
    el.scrollBy({ left: direction * itemWidth * 5, behavior: 'smooth' });
  }

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-6 z-10 w-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity rounded-r"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-6 z-10 w-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity rounded-l"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

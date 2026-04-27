"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { testimonials } from "@/lib/data/testimonials";

const VISIBLE_COUNT_LG = 3;
const VISIBLE_COUNT_MD = 2;
const AUTO_ROTATE_MS = 5000;

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT_LG);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;
  const maxIndex = total - visibleCount;

  // Responsive visible count
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(VISIBLE_COUNT_LG);
      else if (w >= 640) setVisibleCount(VISIBLE_COUNT_MD);
      else setVisibleCount(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Clamp index when visibleCount changes
  useEffect(() => {
    setIndex((prev) => Math.min(prev, total - visibleCount));
  }, [visibleCount, total]);

  const next = useCallback(() => {
    setIndex((prev) => (prev >= total - visibleCount ? 0 : prev + 1));
  }, [total, visibleCount]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev <= 0 ? total - visibleCount : prev - 1));
  }, [total, visibleCount]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, AUTO_ROTATE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next]);

  const dotCount = total - visibleCount + 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cards */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(index / visibleCount) * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="flex h-full flex-col justify-between rounded-xl border border-[#00487B] bg-navy p-8">
                {/* Quote mark */}
                <svg
                  className="mb-4 h-8 w-8 text-cyan opacity-60"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>

                <p className="flex-1 text-base leading-relaxed text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <p className="mt-6 text-sm font-medium text-cyan">
                  — {t.attribution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00487B] text-muted transition-colors hover:border-cyan hover:text-cyan"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-cyan" : "w-2 bg-[#00487B]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00487B] text-muted transition-colors hover:border-cyan hover:text-cyan"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

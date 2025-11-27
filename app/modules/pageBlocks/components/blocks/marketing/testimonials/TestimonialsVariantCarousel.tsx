"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import { TestimonialsBlockDto } from "./TestimonialsBlockUtils";

export default function TestimonialsVariantCarousel({ item }: { readonly item: TestimonialsBlockDto }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (!autoRotate || item.items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % item.items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, item.items.length]);

  const handleNext = () => {
    setAutoRotate(false);
    setActiveIndex((prev) => (prev + 1) % item.items.length);
  };

  const handlePrev = () => {
    setAutoRotate(false);
    setActiveIndex((prev) => (prev - 1 + item.items.length) % item.items.length);
  };

  const handleDotClick = (index: number) => {
    setAutoRotate(false);
    setActiveIndex(index);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-blueprint-bg-elevated to-blueprint-bg-base">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {item.headline && (
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blueprint-text-primary mb-4">
                {item.headline}
              </h2>
              {item.subheadline && (
                <p className="text-xl text-blueprint-text-secondary">
                  {item.subheadline}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 md:p-12"
            >
              {/* Quote */}
              <div className="mb-8">
                <svg
                  className="w-10 h-10 text-blueprint-accent mb-4 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl md:text-2xl text-blueprint-text-secondary italic leading-relaxed">
                  {item.items[activeIndex].quote}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.items[activeIndex].avatar}
                  alt={item.items[activeIndex].name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blueprint-accent/30"
                />
                <div>
                  <p className="font-semibold text-lg text-blueprint-text-primary">
                    {item.items[activeIndex].name}
                  </p>
                  {item.items[activeIndex].role && (
                    <p className="text-sm text-blueprint-text-muted">
                      {item.items[activeIndex].role}
                      {item.items[activeIndex].company && `, ${item.items[activeIndex].company}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Stars (if provided) */}
              {item.items[activeIndex].stars && (
                <div className="mt-4 flex items-center gap-1">
                  {[...new Array(5)].map((_, i) => (
                    <svg
                      key={`star-${i}`}
                      className={`w-5 h-5 ${
                        i < (item.items[activeIndex].stars || 0)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows (hidden on mobile if only 1 testimonial) */}
          {item.items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 rounded-full glass-card hover:bg-white/20 transition-all"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-6 h-6 text-blueprint-text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 rounded-full glass-card hover:bg-white/20 transition-all"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-6 h-6 text-blueprint-text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Navigation Dots */}
          {item.items.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {item.items.map((testimonial, i) => (
                <button
                  key={`dot-${i}-${testimonial.name}`}
                  onClick={() => handleDotClick(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex
                      ? "w-8 bg-blueprint-accent"
                      : "w-2 bg-blueprint-text-muted/50 hover:bg-blueprint-text-muted"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

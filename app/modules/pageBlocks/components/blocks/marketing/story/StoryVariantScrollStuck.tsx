"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { use3DTilt } from "~/hooks/use3DTilt";
import { StoryBlockDto } from "./StoryBlockUtils";

export default function StoryVariantScrollStuck({ item }: { item: StoryBlockDto }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

  // Use IntersectionObserver to detect active phase as user scrolls
  useEffect(() => {
    const observers = phaseRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentPhase(index);
          }
        },
        { threshold: 0.5, rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const getAccentColor = (accentColor: "primary" | "secondary" | "tertiary") => {
    switch (accentColor) {
      case "primary":
        return "blueprint-accent";
      case "secondary":
        return "blueprint-accent-secondary";
      case "tertiary":
        return "blueprint-accent-tertiary";
    }
  };

  const getGradientColors = (phase: number) => {
    const colors = item.phases[phase];
    switch (colors.accentColor) {
      case "tertiary":
        return "from-orange-500/20 to-purple-500/20";
      case "primary":
        return "from-purple-500/20 to-green-500/20";
      case "secondary":
        return "from-green-500/20 to-purple-500/20";
      default:
        return "from-purple-500/20 to-green-500/20";
    }
  };

  return (
    <section ref={containerRef} className="relative bg-blueprint-bg-base py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {item.headline && (
          <div className="mb-20 text-center">
            <motion.h2
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blueprint-text-primary via-blueprint-accent to-blueprint-text-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                ],
              }}
              style={{ textShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
            >
              {item.headline}
            </motion.h2>
            {item.subheadline && (
              <p className="text-xl text-blueprint-text-secondary">
                {item.subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Sticky Visual Area with 3D Tilt */}
          <div className="sticky top-20 h-[600px] hidden lg:block">
            <motion.div
              className="relative h-full rounded-2xl overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Morphing */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  background: `linear-gradient(135deg, ${
                    currentPhase === 0
                      ? "rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2)"
                      : currentPhase === 1
                      ? "rgba(168, 85, 247, 0.2), rgba(16, 185, 129, 0.2)"
                      : "rgba(16, 185, 129, 0.2), rgba(168, 85, 247, 0.2)"
                  })`,
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {/* Visual Content */}
              <div className="relative z-10 flex items-center justify-center h-full p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhase}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="text-center"
                  >
                    {/* Phase Visual - Image or Placeholder */}
                    <div className="glass-card-strong p-8 rounded-xl">
                      {item.phases[currentPhase].visual?.type === "image" && item.phases[currentPhase].visual?.src ? (
                        <img
                          src={item.phases[currentPhase].visual.src}
                          alt={item.phases[currentPhase].visual.alt || `Phase ${currentPhase + 1}`}
                          className="w-full h-96 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                          <p className="text-blueprint-text-muted text-sm">
                            {item.phases[currentPhase].visual?.description || `Phase ${currentPhase + 1}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phase Indicator */}
                    <motion.div
                      className="mt-8 flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {item.phases.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            idx === currentPhase
                              ? `w-12 bg-${getAccentColor(item.phases[currentPhase].accentColor)}`
                              : "w-2 bg-blueprint-text-muted/30"
                          }`}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Scrolling Text (3 Phases) */}
          <div className="space-y-[100vh]">
            {item.phases.map((phase, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  phaseRefs.current[idx] = el;
                }}
                className="min-h-screen flex items-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full"
                >
                  {/* Phase Number Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full glass-card"
                    whileInView={{ scale: [0.9, 1.05, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <span
                      className={`w-2 h-2 bg-${getAccentColor(
                        phase.accentColor
                      )} rounded-full animate-pulse-slow`}
                    />
                    <span className="text-blueprint-text-muted text-sm">
                      Phase {idx + 1} von {item.phases.length}
                    </span>
                  </motion.div>

                  {/* Phase Headline */}
                  <h3
                    className={`text-3xl md:text-4xl font-bold text-blueprint-text-primary mb-6`}
                  >
                    <span className={`text-${getAccentColor(phase.accentColor)}`}>
                      {phase.headline}
                    </span>
                  </h3>

                  {/* Phase Description */}
                  <p className="text-lg text-blueprint-text-secondary leading-relaxed max-w-xl">
                    {phase.text}
                  </p>

                  {/* Mobile Visual (shown below text on mobile) */}
                  <div className="lg:hidden mt-8">
                    <div className="glass-card p-8 rounded-xl">
                      {phase.visual?.type === "image" && phase.visual?.src ? (
                        <img
                          src={phase.visual.src}
                          alt={phase.visual.alt || `Phase ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                          <p className="text-blueprint-text-muted text-sm">
                            {phase.visual?.description || `Phase ${idx + 1}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

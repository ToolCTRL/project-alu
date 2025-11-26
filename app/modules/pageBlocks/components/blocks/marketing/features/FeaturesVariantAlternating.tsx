import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useRef } from "react";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import type { FeaturesBlockDto, FeatureDto } from "./FeaturesBlockUtils";

interface Props {
  item: FeaturesBlockDto;
}

// Akzentfarben-Mapping
const accentClasses = {
  primary: {
    icon: "text-blueprint-accent",
    border: "border-blueprint-accent/30",
    glow: "hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)]", // Purple glow
  },
  secondary: {
    icon: "text-blueprint-accent-secondary",
    border: "border-blueprint-accent-secondary/30",
    glow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)]",
  },
  tertiary: {
    icon: "text-blueprint-accent-tertiary",
    border: "border-blueprint-accent-tertiary/30",
    glow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.3)]",
  },
};

// Connector Line Component with Scroll Animation
function ConnectorLine({ index }: { readonly index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-px h-32 hidden lg:block">
      <svg
        className="w-full h-full"
        viewBox="0 0 2 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`purple-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="128"
          stroke={`url(#purple-gradient-${index})`}
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// Feature Card Component with 3D Tilt Effect
function FeatureCard({
  feature,
  accent,
}: {
  readonly feature: FeatureDto;
  readonly accent: (typeof accentClasses)["primary"];
}) {
  useTranslation();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Throttled mouse move handler (60fps = ~16ms)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (throttleRef.current) return;

    throttleRef.current = setTimeout(() => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max ±7°)
      const newRotateY = ((x - centerX) / centerX) * 7;
      const newRotateX = -((y - centerY) / centerY) * 7;

      setRotateX(newRotateX);
      setRotateY(newRotateY);

      throttleRef.current = null;
    }, 16);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }
  }, []);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`glass-card-hover p-8 ${accent.border} ${accent.glow} transition-all duration-300`}
    >
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-blueprint-bg-elevated">
        {feature.image?.src ? (
          <img
            src={feature.image.src}
            alt={feature.image.alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback: Icon Placeholder
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`w-32 h-32 ${accent.icon} opacity-20`}
              dangerouslySetInnerHTML={{
                __html:
                  feature.icon ||
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>',
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function FeaturesVariantAlternating({ item }: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-blueprint-bg-base">
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <ScrollReveal>
          <div className="text-center">
            {item.subheadline && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
                {t(item.subheadline)}
              </p>
            )}
            {item.headline && (
              <motion.h2
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-blueprint-text-primary via-blueprint-accent to-blueprint-text-primary bg-clip-text text-transparent lg:text-5xl"
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
                {t(item.headline)}
              </motion.h2>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
        {item.items.map((feature, index) => {
          const isEven = index % 2 === 0;
          const accent = accentClasses[feature.accentColor || "primary"];
          const totalFeatures = item.items.length;

          return (
            <div key={`feature-${feature.name}-${index}`} className="relative">
              <ScrollReveal delay={index * 0.1}>
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center group`}>
                  {/* Text Content */}
                  <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    {/* Phase Indicator - NEW */}
                    <motion.div
                      className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full glass-card text-sm"
                      whileInView={{ scale: [0.9, 1.05, 1] }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <motion.span
                        className="w-2 h-2 bg-blueprint-accent rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="text-blueprint-text-muted">
                        Schritt {index + 1} von {totalFeatures}
                      </span>
                    </motion.div>

                    {/* Breathing Icon - NEW */}
                    {feature.icon && (
                      <div className="relative inline-flex mb-6">
                        {/* Glowing Rotating Background */}
                        <motion.div
                          className={`absolute inset-0 w-16 h-16 bg-gradient-to-br from-blueprint-accent/30 to-blueprint-accent/10 rounded-xl blur-sm`}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          aria-hidden="true"
                        />

                        {/* Breathing Icon (front) */}
                        <motion.div
                          className={`relative z-10 p-3 rounded-xl glass-card ${accent.icon}`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          dangerouslySetInnerHTML={{ __html: feature.icon }}
                        />
                      </div>
                    )}

                    {/* Headline */}
                    <h3 className="text-feature-headline mb-6">
                      {t(feature.name)}
                    </h3>

                    {/* Description */}
                    {feature.description && (
                      <p className="text-body-large mb-8">
                        {t(feature.description)}
                      </p>
                    )}

                  </div>

                  {/* Image/Illustration with 3D Tilt */}
                  <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <FeatureCard feature={feature} accent={accent} />
                  </div>
                </div>
              </ScrollReveal>

              {/* Connector Lines with Scroll Animation - only between cards, not after last */}
              {index < totalFeatures - 1 && <ConnectorLine index={index} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

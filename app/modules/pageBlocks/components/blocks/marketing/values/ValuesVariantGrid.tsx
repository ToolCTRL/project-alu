"use client";

import { motion } from "framer-motion";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import { use3DTilt } from "~/hooks/use3DTilt";
import { ValuesBlockDto } from "./ValuesBlockUtils";

// Color configuration
const getAccentColor = (accentColor: "primary" | "secondary" | "tertiary") => {
  switch (accentColor) {
    case "primary":
      return {
        text: "text-blueprint-accent",
        bg: "from-blueprint-accent/30 to-blueprint-accent/10",
        glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      };
    case "secondary":
      return {
        text: "text-blueprint-accent-secondary",
        bg: "from-green-500/30 to-green-500/10",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
      };
    case "tertiary":
      return {
        text: "text-blueprint-accent-tertiary",
        bg: "from-orange-500/30 to-orange-500/10",
        glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      };
  }
};

// Value Card Component with 3D Tilt Effect
function ValueCard({ value }: { readonly value: any }) {
  const colors = getAccentColor(value.accentColor);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

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
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-8 group cursor-pointer h-full flex flex-col"
    >
      {/* Breathing Icon */}
      <div className="relative inline-flex mb-6">
        {/* Glowing Rotating Background */}
        <motion.div
          className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-xl blur-sm`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Breathing Icon (front) */}
        <motion.div
          className={`relative z-10 p-4 rounded-xl glass-card ${colors.text}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          dangerouslySetInnerHTML={{ __html: value.icon }}
        />
      </div>

      {/* Headline */}
      <h3 className="text-xl font-bold mb-3 text-blueprint-text-primary">
        {value.headline}
      </h3>

      {/* Description (expands on hover) */}
      <motion.div
        className="overflow-hidden"
        initial={{ maxHeight: "200px" }}
        whileHover={{ maxHeight: "500px" }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-blueprint-text-secondary leading-relaxed">
          {value.description}
        </p>
      </motion.div>

      {/* Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.glow} pointer-events-none`}
        style={{ zIndex: -1 }}
      />
    </motion.div>
  );
}

export default function ValuesVariantGrid({ item }: { readonly item: ValuesBlockDto }) {

  return (
    <section className="py-24 bg-gradient-to-b from-blueprint-bg-base to-blueprint-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {item.headline && (
          <ScrollReveal>
            <div className="text-center mb-16">
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
          </ScrollReveal>
        )}

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {item.items.map((value, i) => (
            <ScrollReveal key={`value-${value.headline}-${i}`} delay={i * 0.1}>
              <ValueCard value={value} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

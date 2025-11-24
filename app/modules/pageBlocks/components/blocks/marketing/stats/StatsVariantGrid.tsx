"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "~/components/ui/animations/AnimatedCounter";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import { StatsBlockDto } from "./StatsBlockUtils";

export default function StatsVariantGrid({ item }: { item: StatsBlockDto }) {
  const getAccentColor = (accentColor?: "primary" | "secondary" | "tertiary") => {
    switch (accentColor) {
      case "primary":
        return "text-blueprint-accent";
      case "secondary":
        return "text-blueprint-accent-secondary";
      case "tertiary":
        return "text-blueprint-accent-tertiary";
      default:
        return "text-blueprint-accent";
    }
  };

  const getGlowColor = (accentColor?: "primary" | "secondary" | "tertiary") => {
    switch (accentColor) {
      case "primary":
        return [
          "0 0 20px rgba(168, 85, 247, 0.3)",
          "0 0 40px rgba(168, 85, 247, 0.6)",
          "0 0 20px rgba(168, 85, 247, 0.3)",
        ];
      case "secondary":
        return [
          "0 0 20px rgba(16, 185, 129, 0.3)",
          "0 0 40px rgba(16, 185, 129, 0.6)",
          "0 0 20px rgba(16, 185, 129, 0.3)",
        ];
      case "tertiary":
        return [
          "0 0 20px rgba(245, 158, 11, 0.3)",
          "0 0 40px rgba(245, 158, 11, 0.6)",
          "0 0 20px rgba(245, 158, 11, 0.3)",
        ];
      default:
        return [
          "0 0 20px rgba(168, 85, 247, 0.3)",
          "0 0 40px rgba(168, 85, 247, 0.6)",
          "0 0 20px rgba(168, 85, 247, 0.3)",
        ];
    }
  };

  return (
    <section className="py-24 bg-blueprint-bg-elevated">
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

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {item.items.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="text-center glass-card p-8">
                <motion.div
                  className={`text-5xl font-bold mb-2 ${getAccentColor(stat.accentColor)}`}
                  animate={{
                    textShadow: getGlowColor(stat.accentColor),
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    duration={2000}
                  />
                </motion.div>
                <p className="text-blueprint-text-secondary">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

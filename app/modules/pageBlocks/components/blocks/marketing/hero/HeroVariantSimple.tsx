import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { HeroBlockDto } from "./HeroBlockUtils";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import ProductHuntBadge from "../launch/ProductHuntBadge";
import { motion } from "framer-motion";
import HybridBackground from "~/components/ui/backgrounds/HybridBackground";

export default function HeroVariantSimple({ item }: { item: HeroBlockDto }) {
  const { t } = useTranslation();

  // Meisterwerk Animation Variants (simpler, cleaner)
  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.4,
      },
    },
  };

  return (
    <section className="hero-meisterwerk relative overflow-hidden bg-purple-900">
      {/* TEST: Mega visible red circle - If you see this, Hero is loading! */}
      <div className="fixed top-10 left-10 w-48 h-48 bg-red-600 rounded-full z-[9999] animate-pulse flex items-center justify-center text-white font-bold text-2xl">
        TEST
      </div>

      {/* Modern Hybrid Background - Morphing Blobs + Grid + Glow Lines */}
      <HybridBackground />

      {/* Content */}
      <div className="hero-meisterwerk__content">
        <motion.div className="mb-4" variants={heroVariants} initial="hidden" animate="visible">
          {item.topText && (
            <span className="block text-sm font-semibold uppercase tracking-wide sm:text-base lg:text-sm xl:text-base text-gray-400">
              {t(item.topText.text ?? "")}{" "}
              {item.topText.link && (
                <ButtonEvent
                  to={item.topText.link.href ?? ""}
                  className="text-primary relative font-semibold"
                  event={{
                    action: "click",
                    category: "hero",
                    label: item.topText.link.text ?? "",
                    value: item.topText.link.href ?? "",
                  }}
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t(item.topText.link.text ?? "")} <span aria-hidden="true">&rarr;</span>
                </ButtonEvent>
              )}
            </span>
          )}
        </motion.div>

        {item.headline && (
          <motion.h1 className="hero-meisterwerk__headline" variants={heroVariants} initial="hidden" animate="visible">
            {t(item.headline)}
          </motion.h1>
        )}

        {item.subheadline && (
          <motion.p
            className="mt-4 text-center text-2xl font-semibold text-blueprint-accent sm:text-3xl"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            {t(item.subheadline)}
          </motion.p>
        )}

        {item.description && (
          <motion.h2 className="hero-meisterwerk__description" variants={descriptionVariants} initial="hidden" animate="visible">
            {t(item.description)}
          </motion.h2>
        )}

        {item.cta && item.cta.length > 0 && (
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {item.cta.map((cta, idx) => {
              return (
                <motion.div key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <ButtonEvent
                    to={cta.href}
                    target={cta.target}
                    className={clsx(
                      "w-full sm:w-auto",
                      cta.isPrimary
                        ? "btn-primary inline-flex justify-center px-8 py-4 text-lg font-semibold shadow-lg"
                        : "border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-[var(--accent-hover)] inline-flex justify-center rounded-lg px-8 py-4 text-lg font-medium backdrop-blur-sm focus:outline-hidden transition-colors"
                    )}
                    event={{ action: "click", category: "hero", label: cta.text ?? "", value: cta.href ?? "" }}
                  >
                    {t(cta.text)}
                  </ButtonEvent>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {item.bottomText && (
          <motion.div className="mt-8 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
            <span className="text-sm text-gray-400">
              {t(item.bottomText.text ?? "")}{" "}
              {item.bottomText.link?.href && (
                <ButtonEvent
                  to={item.bottomText.link.href ?? ""}
                  target={item.bottomText.link.target}
                  className="text-sm hover:underline link-with-glow"
                  event={{ action: "click", category: "hero", label: item.bottomText.link.text ?? "", value: item.bottomText.link.href ?? "" }}
                >
                  {t(item.bottomText.link.text ?? "")}
                </ButtonEvent>
              )}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

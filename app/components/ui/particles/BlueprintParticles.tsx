import { useCallback, useMemo, useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function BlueprintParticles() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device for performance optimization
    const checkMobile = () => {
      setIsMobile(globalThis.innerWidth < 768);
    };
    checkMobile();
    globalThis.addEventListener('resize', checkMobile);
    return () => globalThis.removeEventListener('resize', checkMobile);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: isMobile ? 30 : 60, // Reduce FPS on mobile
      particles: {
        number: {
          value: isMobile ? 30 : 80, // Reduce particles on mobile (30 vs 80)
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        color: {
          value: "#a855f7", // Purple instead of Blue
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
        },
        size: {
          value: { min: 1, max: 3 },
        },
        links: {
          enable: true,
          distance: isMobile ? 100 : 150, // Shorter links on mobile
          color: "#a855f7", // Purple instead of Blue
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: isMobile ? 0.3 : 0.5, // Slower on mobile
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: {
            default: "bounce" as const,
          },
        },
      },
      interactivity: {
        detectsOn: "canvas" as const,
        events: {
          onHover: {
            enable: !isMobile, // Disable hover on mobile
            mode: "grab",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.4,
            },
          },
        },
      },
      detectRetina: true,
    }),
    [isMobile]
  );

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Particles id="blueprint-particles" init={particlesInit} options={options} />
    </div>
  );
}

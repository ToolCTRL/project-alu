import { useMemo } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";

type BlobConfig = {
  size: number;
  top: string;
  left: string;
  color: string;
  blur: number;
  opacity: number;
  duration?: number;
  delay?: number;
};

type RayConfig = {
  color: string;
  opacity: number;
  rotate: string;
  spread?: string;
};

type ThemeConfig = {
  key: string;
  base: string;
  blobs: BlobConfig[];
  rays?: RayConfig[];
  accents?: Array<{ size: number; top: string; left: string; color: string; blur?: number; opacity?: number }>;
  gridOpacity?: number;
  overlayOpacity?: number;
};

const THEMES: ThemeConfig[] = [
  {
    key: "accounts",
    base: "linear-gradient(135deg, #0b1a2a 0%, #0f2335 55%, #0b1d2c 100%)",
    blobs: [
      { size: 840, top: "12%", left: "14%", color: "rgba(72, 186, 255, 0.44)", blur: 100, opacity: 0.8, duration: 24, delay: 0 },
      { size: 760, top: "58%", left: "64%", color: "rgba(255, 196, 120, 0.42)", blur: 120, opacity: 0.75, duration: 26, delay: 3 },
      { size: 600, top: "72%", left: "36%", color: "rgba(100, 230, 200, 0.28)", blur: 110, opacity: 0.64, duration: 22, delay: 5 },
    ],
    rays: [
      { color: "rgba(72, 186, 255, 0.26)", opacity: 0.55, rotate: "-12deg", spread: "170%" },
      { color: "rgba(255, 196, 120, 0.22)", opacity: 0.5, rotate: "14deg", spread: "150%" },
    ],
    accents: [
      { size: 500, top: "26%", left: "48%", color: "rgba(255, 255, 255, 0.08)", blur: 65, opacity: 0.55 },
      { size: 420, top: "70%", left: "24%", color: "rgba(72, 186, 255, 0.18)", blur: 55, opacity: 0.55 },
    ],
    gridOpacity: 0.07,
    overlayOpacity: 0.9,
  },
  {
    key: "dashboard",
    base: "linear-gradient(140deg, #071025 0%, #0c1830 60%, #0a1428 100%)",
    blobs: [
      { size: 820, top: "8%", left: "10%", color: "rgba(79, 209, 255, 0.34)", blur: 95, opacity: 0.78, duration: 22, delay: 0 },
      { size: 760, top: "12%", left: "66%", color: "rgba(255, 183, 94, 0.4)", blur: 115, opacity: 0.74, duration: 26, delay: 3 },
      { size: 700, top: "60%", left: "56%", color: "rgba(51, 220, 154, 0.28)", blur: 125, opacity: 0.7, duration: 24, delay: 5 },
    ],
    rays: [
      { color: "rgba(79, 209, 255, 0.26)", opacity: 0.55, rotate: "-15deg", spread: "175%" },
      { color: "rgba(255, 183, 94, 0.24)", opacity: 0.5, rotate: "18deg", spread: "160%" },
    ],
    accents: [
      { size: 520, top: "26%", left: "42%", color: "rgba(255, 255, 255, 0.08)", blur: 65, opacity: 0.6 },
      { size: 440, top: "68%", left: "18%", color: "rgba(79, 209, 255, 0.18)", blur: 55, opacity: 0.6 },
    ],
    gridOpacity: 0.075,
    overlayOpacity: 0.9,
  },
  {
    key: "crm",
    base: "linear-gradient(135deg, #1a1025 0%, #241433 55%, #2c123a 100%)",
    blobs: [
      { size: 860, top: "12%", left: "18%", color: "rgba(255, 120, 186, 0.48)", blur: 105, opacity: 0.82, duration: 24, delay: 0 },
      { size: 780, top: "58%", left: "70%", color: "rgba(255, 196, 110, 0.46)", blur: 125, opacity: 0.78, duration: 28, delay: 4 },
      { size: 560, top: "72%", left: "30%", color: "rgba(125, 155, 255, 0.32)", blur: 110, opacity: 0.64, duration: 22, delay: 6 },
    ],
    accents: [
      { size: 520, top: "26%", left: "50%", color: "rgba(255, 255, 255, 0.08)", blur: 65, opacity: 0.55 },
      { size: 440, top: "70%", left: "22%", color: "rgba(255, 120, 186, 0.18)", blur: 60, opacity: 0.55 },
    ],
    rays: [
      { color: "rgba(255, 120, 186, 0.3)", opacity: 0.62, rotate: "-10deg", spread: "170%" },
      { color: "rgba(125, 155, 255, 0.2)", opacity: 0.52, rotate: "16deg", spread: "150%" },
    ],
    gridOpacity: 0.075,
    overlayOpacity: 0.9,
  },
  {
    key: "metrics",
    base: "linear-gradient(135deg, #03151f 0%, #062533 55%, #05202c 100%)",
    blobs: [
      { size: 900, top: "16%", left: "22%", color: "rgba(80, 210, 255, 0.46)", blur: 115, opacity: 0.82, duration: 26, delay: 1 },
      { size: 740, top: "56%", left: "58%", color: "rgba(120, 255, 200, 0.32)", blur: 130, opacity: 0.72, duration: 24, delay: 4 },
      { size: 620, top: "70%", left: "78%", color: "rgba(255, 255, 160, 0.28)", blur: 115, opacity: 0.68, duration: 28, delay: 6 },
    ],
    rays: [
      { color: "rgba(80, 210, 255, 0.26)", opacity: 0.55, rotate: "-8deg", spread: "175%" },
      { color: "rgba(120, 255, 200, 0.22)", opacity: 0.5, rotate: "14deg", spread: "155%" },
    ],
    accents: [
      { size: 520, top: "30%", left: "48%", color: "rgba(255, 255, 255, 0.08)", blur: 65, opacity: 0.6 },
      { size: 360, top: "72%", left: "24%", color: "rgba(79, 209, 255, 0.18)", blur: 55, opacity: 0.6 },
    ],
    gridOpacity: 0.07,
    overlayOpacity: 0.9,
  },
  {
    key: "settings",
    base: "linear-gradient(135deg, #0f1025 0%, #171a35 55%, #1d2040 100%)",
    blobs: [
      { size: 780, top: "16%", left: "22%", color: "rgba(164, 196, 255, 0.46)", blur: 105, opacity: 0.8, duration: 24, delay: 0 },
      { size: 680, top: "62%", left: "64%", color: "rgba(255, 168, 210, 0.32)", blur: 120, opacity: 0.7, duration: 26, delay: 3 },
      { size: 560, top: "72%", left: "34%", color: "rgba(160, 235, 255, 0.26)", blur: 110, opacity: 0.62, duration: 24, delay: 5 },
    ],
    rays: [{ color: "rgba(164, 196, 255, 0.26)", opacity: 0.55, rotate: "-14deg", spread: "175%" }],
    accents: [
      { size: 520, top: "28%", left: "46%", color: "rgba(255, 255, 255, 0.08)", blur: 60, opacity: 0.55 },
      { size: 380, top: "70%", left: "24%", color: "rgba(164, 196, 255, 0.2)", blur: 55, opacity: 0.55 },
    ],
    gridOpacity: 0.06,
    overlayOpacity: 0.9,
  },
  {
    key: "default",
    base: "linear-gradient(135deg, #08111f 0%, #0a1322 55%, #08101f 100%)",
    blobs: [
      { size: 760, top: "18%", left: "16%", color: "rgba(79, 209, 255, 0.34)", blur: 95, opacity: 0.76, duration: 24, delay: 1 },
      { size: 700, top: "64%", left: "68%", color: "rgba(255, 183, 94, 0.32)", blur: 110, opacity: 0.7, duration: 26, delay: 4 },
    ],
    accents: [
      { size: 480, top: "28%", left: "50%", color: "rgba(255, 255, 255, 0.07)", blur: 60, opacity: 0.55 },
      { size: 360, top: "68%", left: "22%", color: "rgba(79, 209, 255, 0.16)", blur: 55, opacity: 0.55 },
    ],
    gridOpacity: 0.065,
    overlayOpacity: 0.86,
  },
];

function getRouteKey(pathname: string): string {
  if (pathname.startsWith("/admin/accounts")) return "accounts";
  if (pathname.startsWith("/admin/dashboard")) return "dashboard";
  if (pathname.startsWith("/admin/crm")) return "crm";
  if (pathname.startsWith("/admin/metrics")) return "metrics";
  if (pathname.startsWith("/admin/entities")) return "build";
  if (pathname.startsWith("/admin/workflow")) return "build";
  if (pathname.startsWith("/admin/api")) return "build";
  if (pathname.startsWith("/admin/events")) return "build";
  if (pathname.startsWith("/admin/playground")) return "build";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return "default";
}

export function RouteBackground() {
  const location = useLocation();
  const theme = useMemo(() => {
    const key = getRouteKey(location.pathname);
    return THEMES.find((t) => t.key === key) ?? THEMES.find((t) => t.key === "default")!;
  }, [location.pathname]);

  return (
    <div className={clsx("pointer-events-none fixed inset-0 z-0", theme.key)} style={{ opacity: theme.overlayOpacity ?? 0.8 }}>
      <div className="absolute inset-0" style={{ background: theme.base }} />

      {theme.rays?.map((ray) => (
        <div
          key={`ray-${ray.rotate}-${ray.color}`}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${ray.rotate}, transparent 15%, ${ray.color} 45%, transparent 65%)`,
            opacity: ray.opacity,
            filter: "blur(50px)",
            transform: "translate3d(0,0,0)",
            height: ray.spread ?? "140%",
            width: ray.spread ?? "140%",
            top: "-20%",
            left: "-20%",
          }}
        />
      ))}

      {theme.blobs.map((blob) => (
        <div
          key={`blob-${blob.top}-${blob.left}-${blob.color}`}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 60%)`,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            animation: `floaty ${blob.duration ?? 24}s ease-in-out infinite`,
            animationDelay: `${blob.delay ?? 0}s`,
            transform: "translate3d(0,0,0)",
          }}
        />
      ))}

      {theme.gridOpacity && theme.gridOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: theme.gridOpacity,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "160px 160px",
          }}
        />
      )}

      {theme.accents?.map((accent) => (
        <div
          key={`accent-${accent.top}-${accent.left}-${accent.color}`}
          className="absolute rounded-full"
          style={{
            width: accent.size,
            height: accent.size,
            top: accent.top,
            left: accent.left,
            border: `1px solid ${accent.color}`,
            filter: `blur(${accent.blur ?? 45}px)`,
            opacity: accent.opacity ?? 0.5,
          }}
        />
      ))}
    </div>
  );
}

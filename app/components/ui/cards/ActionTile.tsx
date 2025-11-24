import clsx from "clsx";
import { ReactNode } from "react";
import { use3DTilt } from "~/hooks/use3DTilt";

type ActionTileTone = "accent" | "neutral" | "outline";

export type ActionTileProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  hint?: string;
  tone?: ActionTileTone;
  onClick?: () => void;
  href?: string;
  actionLabel?: string;
  className?: string;
  disableTilt?: boolean;
};

export function ActionTile({ title, description, hint, icon, tone = "accent", onClick, href, actionLabel = "Öffnen", className, disableTilt }: ActionTileProps) {
  const tilt = disableTilt ? null : use3DTilt({ maxAngle: 8 });
  const baseContent = (
    <div className="flex w-full items-start gap-4 text-left pr-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>{hint ?? "quick action"}</span>
        </div>
        <p className="text-lg font-semibold text-white">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {icon && <div className="mr-3 rounded-2xl bg-white/5 p-3 text-white">{icon}</div>}
    </div>
  );

  const toneClasses: Record<ActionTileTone, string> = {
    accent: "border-white/20 bg-white/8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-white/40 hover:bg-white/12 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
    neutral: "border-white/15 bg-white/6 backdrop-blur-lg shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:border-white/30 hover:bg-white/10 hover:shadow-[0_10px_32px_rgba(0,0,0,0.35)]",
    outline: "border-dashed border-white/20 bg-white/4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:border-white/30 hover:bg-white/8 hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]",
  };

  const commonClasses = clsx(
    "group flex flex-col gap-4 rounded-[var(--radius-lg,1.25rem)] border p-4 text-card-foreground transition will-change-transform",
    toneClasses[tone],
    className
  );

  if (href) {
    return (
      <a
        href={href}
      className={commonClasses}
      onMouseMove={tilt ? tilt.handleMouseMove : undefined}
      onMouseLeave={tilt ? tilt.handleMouseLeave : undefined}
      style={tilt ? { transformStyle: "preserve-3d" } : undefined}
    >
      {baseContent}
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{actionLabel}</span>
    </a>
  );
  }

  return (
    <button
      type="button"
      className={commonClasses}
      onClick={onClick}
      onMouseMove={tilt ? tilt.handleMouseMove : undefined}
      onMouseLeave={tilt ? tilt.handleMouseLeave : undefined}
      style={tilt ? { transformStyle: "preserve-3d" } : undefined}
    >
      {baseContent}
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{actionLabel}</span>
    </button>
  );
}

export default ActionTile;

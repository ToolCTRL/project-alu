import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ReactNode, useMemo } from "react";
import clsx from "clsx";
import { use3DTilt } from "~/hooks/use3DTilt";

type TrendDirection = "up" | "down" | "flat";

export type KpiCardAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  delta?: {
    label?: string;
    value: string;
    direction?: TrendDirection;
  };
  badge?: string;
  icon?: ReactNode;
  tone?: "accent" | "neutral";
  actions?: KpiCardAction[];
  sparkline?: number[];
  className?: string;
  footnote?: string;
};

export function KpiCard({ title, value, subtitle, delta, badge, icon, tone = "accent", actions, sparkline, className, footnote }: Readonly<KpiCardProps>) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt({ maxAngle: 10 });
  const sparklinePoints = useMemo(() => {
    if (!sparkline || sparkline.length === 0) {
      return null;
    }
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = Math.max(max - min, 1);
    return sparkline
      .map((point, index) => {
        const x = (index / (sparkline.length - 1 || 1)) * 100;
        const y = 100 - ((point - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [sparkline]);

  const TrendIcon = delta?.direction === "down" ? ArrowDownRight : ArrowUpRight;
  const trendTone = delta?.direction === "down" ? "text-rose-400" : "text-emerald-400";

  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/5 bg-card/80 p-5 text-card-foreground shadow-[var(--shadow-soft,0px_20px_40px_rgba(7,12,20,0.35))] ring-1 ring-white/5 transition-transform duration-200 will-change-transform",
        tone === "accent" ? "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,var(--color-accent,rgba(249,115,22,0.28)),transparent_60%)] before:opacity-50 before:content-['']" : "",
        "[&>div]:relative",
        className
      )}
      aria-label={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {badge && <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">{badge}</span>}
            <span>{title}</span>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-white">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {footnote && <p className="text-xs text-muted-foreground/80">{footnote}</p>}
        </div>
        {icon && <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white">{icon}</div>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {delta && (
          <span className={clsx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs", trendTone)}>
            {delta.direction !== "flat" && <TrendIcon className="h-4 w-4" />}
            <span className="font-semibold">{delta.value}</span>
            {delta.label && <span className="text-muted-foreground">{delta.label}</span>}
          </span>
        )}
        {actions?.map((action) => {
          if (action.href) {
            return (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/5"
              >
                {action.label}
              </a>
            );
          }
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              {action.label}
            </button>
          );
        })}
      </div>

      {sparklinePoints && (
        <div className="mt-5 h-16 w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="kpiCardGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent, #f97316)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-accent-secondary, #3b82f6)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#kpiCardGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
            />
            <polygon
              fill="url(#kpiCardGradient)"
              points={`${sparklinePoints} 100,100 0,100`}
              opacity="0.3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}

export default KpiCard;

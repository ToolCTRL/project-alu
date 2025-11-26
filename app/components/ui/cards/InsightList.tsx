import clsx from "clsx";
import { ReactNode } from "react";
import { use3DTilt } from "~/hooks/use3DTilt";

export type InsightTone = "positive" | "warning" | "info" | "neutral";

export type InsightListItem = {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  meta?: string;
  icon?: ReactNode;
  tone?: InsightTone;
  actionLabel?: string;
  href?: string;
  onAction?: () => void;
};

const toneClasses: Record<InsightTone, string> = {
  positive: "text-emerald-300",
  warning: "text-amber-300",
  info: "text-sky-300",
  neutral: "text-slate-300",
};

export function InsightList({ items, title, description, className }: Readonly<{ items: InsightListItem[]; title?: string; description?: string; className?: string }>) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt({ maxAngle: 6 });
  return (
    <div
      className={clsx(
        "space-y-4 rounded-[var(--radius-lg,1.25rem)] border border-white/5 bg-card/80 p-5 text-card-foreground transition-transform duration-200 will-change-transform",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {(title || description) && (
        <header className="space-y-1">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-white/20">
            {item.icon && <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/80">{item.icon}</div>}
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.badge && <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-white/90">{item.badge}</span>}
                  {item.meta && <span>{item.meta}</span>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className={clsx("inline-flex items-center gap-2", toneClasses[item.tone ?? "info"])}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {item.tone === "warning" && "Achtung"}
                  {item.tone === "positive" && "Gesund"}
                  {item.tone === "info" && "Hinweis"}
                  {item.tone === "neutral" && "Info"}
                </span>
                {item.actionLabel && (
                  <>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white transition hover:border-white/30 hover:bg-white/5"
                      >
                        {item.actionLabel}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onAction}
                        className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white transition hover:border-white/30 hover:bg-white/5"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightList;

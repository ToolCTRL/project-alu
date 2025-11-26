import clsx from "clsx";
import { ReactNode } from "react";
import { use3DTilt } from "~/hooks/use3DTilt";

export type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export type EmptyStateCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  background?: "grid" | "plain";
  className?: string;
  actions?: EmptyStateAction[];
  eyebrow?: string;
};

const variantClasses: Record<NonNullable<EmptyStateAction["variant"]>, string> = {
  primary: "bg-white text-slate-900 hover:bg-slate-100",
  secondary: "border border-white/20 text-white hover:border-white/40",
};

export function EmptyStateCard({ title, description, icon, background = "grid", className, actions, eyebrow }: Readonly<EmptyStateCardProps>) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt({ maxAngle: 8 });
  return (
    <div
      role="presentation"
      className={clsx(
        "relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-8 text-center text-card-foreground shadow-[var(--shadow-soft,0px_20px_40px_rgba(7,12,20,0.35))] transition-transform duration-200 will-change-transform",
        background === "grid" && "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)] before:opacity-80 before:content-['']",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative space-y-4">
        {eyebrow && <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{eyebrow}</p>}
        {icon && <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">{icon}</div>}
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        {description && <p className="mx-auto max-w-xl text-base text-muted-foreground">{description}</p>}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {actions.map((action) => {
              if (action.href) {
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className={clsx(
                      "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition",
                      variantClasses[action.variant ?? "primary"]
                    )}
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
                  className={clsx(
                    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition",
                    variantClasses[action.variant ?? "primary"]
                  )}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyStateCard;

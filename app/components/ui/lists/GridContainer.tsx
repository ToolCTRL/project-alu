import clsx from "clsx";
import { GridLayoutDto } from "~/application/dtos/layout/GridLayoutDto";

type Props = GridLayoutDto & {
  children: React.ReactNode;
  className?: string;
};

function getGapClass(gap?: string) {
  if (gap === "xs") return "gap-2";
  if (gap === "sm") return "gap-4";
  if (gap === "md") return "gap-6";
  if (gap === "lg") return "gap-8";
  if (gap === "xl") return "gap-10";
  return "";
}

function getColumnsClass(columns?: number) {
  if (!columns) return "";
  return `grid-cols-${columns}`;
}

function getResponsiveColumnsClass(prefix: string, cols?: number) {
  if (!cols) return "";
  return `${prefix}:grid-cols-${cols}`;
}

export default function GridContainer({ children, className, columns, sm, md, lg, xl, xl2, gap }: Props) {
  return (
    <div
      className={clsx(
        className,
        "grid",
        getGapClass(gap),
        getColumnsClass(columns),
        getResponsiveColumnsClass("sm", sm),
        getResponsiveColumnsClass("md", md),
        getResponsiveColumnsClass("lg", lg),
        getResponsiveColumnsClass("xl", xl),
        getResponsiveColumnsClass("2xl", xl2)
      )}
    >
      {children}
    </div>
  );
}

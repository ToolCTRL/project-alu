import clsx from "clsx";
import { GridLayoutDto } from "~/application/dtos/layout/GridLayoutDto";

type Props = GridLayoutDto & {
  children: React.ReactNode;
  className?: string;
};

const gapClasses: Record<string, string> = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
};

function getGridColClass(cols: number | undefined, prefix: string = ""): string | false {
  if (!cols) return false;
  const prefixStr = prefix ? `${prefix}:` : "";
  return `${prefixStr}grid-cols-${cols}`;
}

export default function GridContainer({ children, className, columns, sm, md, lg, xl, xl2, gap }: Props) {
  return (
    <div
      className={clsx(
        className,
        "grid",
        gap && gapClasses[gap],
        getGridColClass(columns),
        getGridColClass(sm, "sm"),
        getGridColClass(md, "md"),
        getGridColClass(lg, "lg"),
        getGridColClass(xl, "xl"),
        getGridColClass(xl2, "2xl")
      )}
    >
      {children}
    </div>
  );
}

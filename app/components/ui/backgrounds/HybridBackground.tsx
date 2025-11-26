import clsx from "clsx";
import { ReactNode } from "react";

type HybridBackgroundProps = Readonly<{
  children?: ReactNode;
  className?: string;
}>;

export default function HybridBackground({ children, className }: HybridBackgroundProps) {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(49,198,246,0.12),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(247,160,66,0.1),transparent_36%)]" />
      <div className="bg-blob bg-blob--1 pointer-events-none absolute" />
      <div className="bg-blob bg-blob--2 pointer-events-none absolute" />
      <div className="relative">{children}</div>
    </div>
  );
}

import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function ParticlesBackground({ children, className }: Readonly<Props>) {
  // Placeholder: renders children directly
  return <div className={className}>{children}</div>;
}

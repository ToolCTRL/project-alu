import { Link } from "react-router";
import clsx from "clsx";
import { ReactNode } from "react";
import { Button } from "../button";

interface Props {
  type?: "button" | "submit";
  to: string | undefined;
  children: ReactNode;
  className?: string;
  target?: string;
  role?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  reloadDocument?: boolean;
  autoFocus?: boolean;
  prefetch?: "intent" | "render" | "none";
  disabled?: boolean;
  isLoading?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>) => void;
}
export default function LinkOrAhref({
  type = "button",
  to,
  target,
  children,
  className,
  role,
  rel,
  onClick,
  reloadDocument,
  autoFocus,
  prefetch,
  disabled,
  isLoading,
  onMouseEnter,
  onMouseLeave,
}: Readonly<Props>) {
  if ((!to && !onClick) || (to && disabled)) {
    return (
      <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </div>
    );
  }

  if (to === undefined) {
    return (
      <Button
        type={type}
        onClick={onClick}
        className={clsx(className, isLoading && "base-spinner cursor-not-allowed")}
        role={role}
        autoFocus={autoFocus}
        disabled={disabled}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Button>
    );
  }

  return (
    <Link
      reloadDocument={reloadDocument}
      onClick={onClick}
      to={to}
      target={target}
      className={className}
      role={role}
      autoFocus={autoFocus}
      prefetch={prefetch}
      rel={rel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

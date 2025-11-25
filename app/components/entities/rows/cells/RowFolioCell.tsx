import { Link } from "react-router";
import NumberUtils from "~/utils/shared/NumberUtils";

function formatFolioText(prefix: string, folio: number): string {
  return `${prefix}-${NumberUtils.pad(folio ?? 0, 4)}`;
}

export default function RowFolioCell({
  prefix,
  folio,
  href,
  onClick,
}: Readonly<{ prefix: string; folio: number; href?: string; onClick?: () => void }>) {
  const text = formatFolioText(prefix, folio);
  const className =
    "hover border-border text-muted-foreground hover:text-foreground bg-secondary rounded-md border border-b px-1 py-0.5 text-center text-sm hover:underline";

  if (href) {
    return (
      <Link
        to={href}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={className}
      >
        {text}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={className}
      >
        {text}
      </button>
    );
  }

  return <div>{text}</div>;
}

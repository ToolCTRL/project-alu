import RatingBadge from "~/components/ui/badges/RatingBadge";
import NumberUtils, { NumberFormatType } from "~/utils/shared/NumberUtils";

export function getNumberAsStringValue({ value, format, currencySymbol }: { value?: number | null; format?: NumberFormatType; currencySymbol?: string }) {
  if (!value) {
    return "";
  }
  switch (format) {
    case "integer":
      return NumberUtils.intFormat(value);
    case "decimal":
      return NumberUtils.decimalFormat(value);
    case "currency":
      return `${currencySymbol ?? NumberUtils.defaultCurrencySymbol}${NumberUtils.decimalFormat(value)}`;
    case "percentage":
      return `${NumberUtils.decimalFormat(value)}%`;
    default:
      return value.toString();
  }
}

function getFormattedNumberContent(value: number, format?: NumberFormatType, currencySymbol?: string): JSX.Element | number {
  if (!format) {
    return value;
  }

  if (format === "integer") {
    return <span>{NumberUtils.intFormat(value)}</span>;
  }

  if (format === "decimal") {
    return <span>{NumberUtils.decimalFormat(value)}</span>;
  }

  if (format === "currency") {
    return (
      <span>
        <span>{currencySymbol ?? NumberUtils.defaultCurrencySymbol}</span>
        {NumberUtils.decimalFormat(value)}
      </span>
    );
  }

  if (format === "percentage") {
    return <span>{NumberUtils.decimalFormat(value)}%</span>;
  }

  if (format === "rating") {
    return (
      <span>
        <RatingBadge value={value} />
      </span>
    );
  }

  return value;
}

export default function RowNumberCell({
  value,
  format,
  currencySymbol,
}: Readonly<{ value?: number | null; format?: NumberFormatType; currencySymbol?: string }>) {
  if (value === null || value === undefined) {
    return <div></div>;
  }

  return <div>{getFormattedNumberContent(value, format, currencySymbol)}</div>;
}

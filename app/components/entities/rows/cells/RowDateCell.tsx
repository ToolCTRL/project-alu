import DateUtils, { DateFormatType } from "~/utils/shared/DateUtils";

function formatDateToIso(value: Date): string {
  try {
    const date = new Date(value);
    return date.toISOString().split("T")[0];
  } catch {
    return value.toISOString().split("T")[0];
  }
}

export function getDateAsString({ value, format }: { value?: Date | null; format?: DateFormatType }) {
  if (!value) {
    return "";
  }
  if (!format) {
    return formatDateToIso(value);
  }
  switch (format) {
    case "YYYY-MM-DD":
      return DateUtils.dateYMD(value);
    case "DD-MM-YYYY":
      return DateUtils.dateDMY(value);
    case "MM-DD-YYYY":
      return DateUtils.dateMDY(value);
    case "diff":
      return DateUtils.dateAgo(value);
    default:
      return value.toString();
  }
}

function getFormattedDateContent(value: Date, format?: DateFormatType): JSX.Element | string {
  if (!format) {
    return formatDateToIso(value);
  }

  if (format === "YYYY-MM-DD") {
    return <span>{DateUtils.dateYMD(value)}</span>;
  }

  if (format === "DD-MM-YYYY") {
    return <span>{DateUtils.dateDMY(value)}</span>;
  }

  if (format === "MM-DD-YYYY") {
    return <span>{DateUtils.dateMDY(value)}</span>;
  }

  if (format === "diff") {
    return <span>{DateUtils.dateAgo(value)}</span>;
  }

  return "";
}

export default function RowDateCell({ value, format }: Readonly<{ value?: Date | null; format?: DateFormatType }>) {
  if (!value) {
    return <div></div>;
  }

  return <div>{getFormattedDateContent(value, format)}</div>;
}

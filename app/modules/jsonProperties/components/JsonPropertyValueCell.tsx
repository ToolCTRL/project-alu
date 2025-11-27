import DateCell from "~/components/ui/dates/DateCell";
import { JsonValue } from "../dtos/JsonPropertiesValuesDto";
import { JsonPropertyDto } from "../dtos/JsonPropertyTypeDto";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";

function renderBooleanValue(value: JsonValue): JSX.Element | null {
  const booleanValue = value === "true" || value === true || value === 1 || value === "1";
  if (booleanValue) {
    return <CheckIcon className="h-4 w-4" />;
  }
  return <XIcon className="h-4 w-4" />;
}

function renderDateValue(value: JsonValue): JSX.Element {
  try {
    const date = new Date(value as string);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return <div><DateCell date={date} /></div>;
  } catch (error) {
    console.warn("Failed to parse date value:", value, error);
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return <div className="text-muted-foreground">{stringValue}</div>;
  }
}

function renderSelectValue(property: JsonPropertyDto, value: JsonValue): string {
  if (!property.options) {
    return value as string;
  }
  const option = property.options.find((o) => o.value === value);
  return option?.name || (value as string);
}

function renderMultiselectValue(property: JsonPropertyDto, value: JsonValue): JSX.Element | string | null {
  if (!Array.isArray(value)) {
    return null;
  }
  if (!property.options) {
    const stringified = value.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(", ");
    return <div className="text-muted-foreground">{stringified}</div>;
  }
  const values = value.map((v) => {
    const option = property.options?.find((o) => o.value === v);
    return option?.name || (typeof v === 'object' ? JSON.stringify(v) : String(v));
  });
  return values.join(", ");
}

export default function JsonPropertyValueCell({ property, value }: Readonly<{ readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }>) {
  if (value === null || value === undefined) {
    return null;
  }

  switch (property.type) {
    case "string":
      return value as string;
    case "number":
      return value as number;
    case "boolean":
      return renderBooleanValue(value);
    case "image":
      return value ? <img src={value as string} alt="" className="h-8 w-8 object-cover" /> : null;
    case "date":
      return value ? renderDateValue(value) : null;
    case "select":
      return renderSelectValue(property, value);
    case "multiselect":
      return renderMultiselectValue(property, value);
    default:
      return value as string;
  }
}

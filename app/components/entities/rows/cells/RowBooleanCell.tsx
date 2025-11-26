import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import { BooleanFormatType } from "~/utils/shared/BooleanUtils";

function getTranslatedText(key: string, fallback: string, t?: TFunction): string {
  return t ? t(key) : fallback;
}

function getFormatLabels(format: BooleanFormatType, t?: TFunction): { trueLabel: string; falseLabel: string } {
  switch (format) {
    case "yesNo":
      return {
        trueLabel: getTranslatedText("shared.yes", "Yes", t),
        falseLabel: getTranslatedText("shared.no", "No", t),
      };
    case "trueFalse":
      return {
        trueLabel: getTranslatedText("shared.true", "True", t),
        falseLabel: getTranslatedText("shared.false", "False", t),
      };
    case "enabledDisabled":
      return {
        trueLabel: getTranslatedText("shared.enabled", "Enabled", t),
        falseLabel: getTranslatedText("shared.disabled", "Disabled", t),
      };
    case "onOff":
      return {
        trueLabel: getTranslatedText("shared.on", "On", t),
        falseLabel: getTranslatedText("shared.off", "Off", t),
      };
    case "activeInactive":
      return {
        trueLabel: getTranslatedText("shared.active", "Active", t),
        falseLabel: getTranslatedText("shared.inactive", "Inactive", t),
      };
    default:
      return { trueLabel: "", falseLabel: "" };
  }
}

export function getBooleanAsStringValue({ value, format, t }: { value?: boolean; format?: BooleanFormatType; t?: TFunction }) {
  const effectiveFormat = format ?? "yesNo";
  const labels = getFormatLabels(effectiveFormat, t);
  return value ? labels.trueLabel : labels.falseLabel;
}
export default function RowBooleanCell({ value, format }: Readonly<{ value?: boolean; format?: BooleanFormatType }>) {
  const { t } = useTranslation();
  if (!format) {
    return <div>{value ? <CheckIcon className="h-4 w-4 text-teal-500" /> : <XIcon className="text-muted-foreground h-4 w-4" />}</div>;
  }
  const title = getBooleanAsStringValue({ value, format, t });
  const color = value ? Colors.GREEN : Colors.GRAY;
  return (
    <SimpleBadge title={title} color={color} />
  );
}

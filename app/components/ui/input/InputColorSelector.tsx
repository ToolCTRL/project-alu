import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import { getColors } from "~/utils/shared/ColorUtils";
import ColorBadge from "../badges/ColorBadge";
import InputSelector from "./InputSelector";

interface Props {
  readonly name?: string;
  readonly title?: string;
  readonly value?: string | number;
  readonly setValue?: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  readonly className?: string;
  readonly withColorNames?: boolean;
  readonly withSearch?: boolean;
  readonly selectPlaceholder?: string;
  readonly required?: boolean;
}
export default function InputColorSelector({
  name,
  title,
  value,
  setValue,
  className,
  withColorNames = true,
  withSearch = false,
  selectPlaceholder,
  required,
}: Props) {
  const { t } = useTranslation();
  return (
    <InputSelector
      className={className}
      name={name ?? "color"}
      title={title ?? t("models.group.color")}
      withSearch={withSearch}
      selectPlaceholder={selectPlaceholder ?? t("models.group.color")}
      value={value}
      setValue={setValue}
      required={required}
      options={
        getColors(true).map((color) => {
          return {
            name: (
              <div className="flex items-center space-x-2">
                <ColorBadge color={color} />
                {withColorNames && <div>{t("app.shared.colors." + Colors[color])}</div>}
              </div>
            ),
            value: color,
          };
        }) ?? []
      }
    ></InputSelector>
  );
}

import { ReactNode, useRef, useState } from "react";
import clsx from "~/utils/shared/ClassesUtils";
import HintTooltip from "../tooltips/HintTooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../select";
import ColorBadge from "../badges/ColorBadge";
import { useTranslation } from "react-i18next";
import { Input } from "../input";
import { cn } from "~/lib/utils";

type OptionValue = string | number | undefined;

interface Props {
  readonly name?: string;
  readonly title?: string;
  readonly withLabel?: boolean;
  readonly options: {
    name: string | ReactNode;
    value: OptionValue;
    disabled?: boolean;
    component?: ReactNode;
    color?: number;
  }[];
  readonly value?: OptionValue;
  readonly setValue?: React.Dispatch<React.SetStateAction<OptionValue>>;
  readonly defaultValue?: OptionValue;
  readonly className?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly help?: string;
  readonly hint?: ReactNode;
  readonly borderless?: boolean;
  readonly autoFocus?: boolean;
  readonly placeholder?: string;
  readonly withColors?: boolean;
  readonly withSearch?: boolean;
  readonly selectClassName?: string;
}
export default function InputSelect({
  name,
  title,
  withLabel = true,
  value,
  defaultValue,
  options,
  setValue,
  className,
  required,
  disabled,
  help,
  hint,
  borderless,
  autoFocus,
  placeholder,
  withColors,
  withSearch = true,
  selectClassName,
}: Props) {
  const { t } = useTranslation();
  const refSearch = useRef<HTMLInputElement>(null);
  const [inputSearch, setInputSearch] = useState("");
  const filteredOptions = () => {
    if (!inputSearch.trim()) {
      return options;
    }
    return options.filter((item) => {
      return (
        item.name?.toString().toLowerCase().includes(inputSearch.toLowerCase()) || item.value?.toString().toLowerCase().includes(inputSearch.toLowerCase())
      );
    });
  };
  return (
    <div className={clsx(className, "")}>
      {withLabel && title && (
        <label htmlFor={name} className="flex justify-between space-x-2 truncate text-xs font-medium">
          <div className="flex items-center space-x-1 truncate">
            <div className="flex space-x-1 truncate">
              <div className="truncate">{title}</div>
              {required && title && <div className="ml-1 text-red-500">*</div>}
            </div>

            {help && <HintTooltip text={help} />}
          </div>
          {hint}
        </label>
      )}
      <div className={clsx(withLabel && title && "mt-1")}>
        <Select
          // id={name}
          name={name}
          value={value?.toString()}
          defaultValue={defaultValue?.toString()}
          onValueChange={(e) => (setValue ? setValue(e) : null)}
          // autoFocus={autoFocus}
          disabled={disabled}
          required={required}
        >
          <SelectTrigger
            type="button"
            className={cn("w-full", selectClassName)}
            // onClick={() => {
            //   if (refSearch.current) {
            //     setTimeout(() => {
            //       refSearch.current?.focus();
            //       refSearch.current?.select();
            //     }, 2000);
            //   }
            // }}
          >
            <SelectValue placeholder={withLabel ? placeholder || `${t("shared.select")}...` : title || `${t("shared.select")}...`} />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-auto">
            {withSearch && options.length > 30 && (
              <Input
                ref={refSearch}
                autoFocus
                type="text"
                className="mb-1 px-2 py-1.5"
                placeholder={t("shared.search")}
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyDownCapture={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
              />
            )}
            <SelectGroup>
              {filteredOptions().length === 0 && (
                <SelectItem disabled value={"{empty}"}>
                  <div className="text-center text-gray-400">{t("shared.noRecords")}</div>
                </SelectItem>
              )}
              {filteredOptions().map((item) => {
                return (
                  <SelectItem key={item.value} disabled={item.disabled} value={item.value?.toString() ?? ""}>
                    {item.component || (
                      <div className="flex items-center space-x-2">
                        {withColors && <ColorBadge color={item.color} />}
                        <div>{item.name}</div>
                      </div>
                    )}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

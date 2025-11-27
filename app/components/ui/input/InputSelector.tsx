import { Ref, forwardRef, useImperativeHandle, useRef, ReactNode, Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "../badges/ColorBadge";
import HintTooltip from "../tooltips/HintTooltip";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";

export interface RefInputSelector {
  focus: () => void;
}

type OptionValue = string | number | undefined;

interface Props {
  readonly name?: string;
  readonly title?: string;
  readonly value?: OptionValue;
  readonly defaultValue?: OptionValue;
  readonly disabled?: boolean;
  readonly options: { name: string | ReactNode; value: OptionValue; color?: Colors; disabled?: boolean }[];
  readonly setValue?: React.Dispatch<React.SetStateAction<OptionValue>>;
  readonly className?: string;
  readonly withSearch?: boolean;
  readonly withLabel?: boolean;
  readonly withColors?: boolean;
  readonly selectPlaceholder?: string;
  readonly onNew?: () => void;
  readonly onNewRoute?: string;
  readonly required?: boolean;
  readonly help?: string;
  readonly hint?: ReactNode;
  readonly icon?: string;
  readonly borderless?: boolean;
  readonly darkMode?: boolean;
  readonly autoFocus?: boolean;
  readonly readOnly?: boolean;
  readonly isLoading?: boolean;
}
const InputSelector = (
  {
    name,
    title,
    value,
    defaultValue,
    options,
    disabled,
    setValue,
    className,
    withSearch = true,
    withLabel = true,
    withColors = false,
    selectPlaceholder,
    onNew,
    required,
    onNewRoute,
    help,
    hint,
    icon,
    borderless,
    darkMode,
    autoFocus,
    readOnly,
    isLoading,
  }: Props,
  ref: Ref<RefInputSelector>
) => {
  const { t } = useTranslation();

  const button = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState<{ name: string | ReactNode; value: OptionValue; color?: Colors }>();

  useEffect(() => {
    const selected = options?.find((f) => f.value === value);
    setSelected(selected);
  }, [options, value]);

  useEffect(() => {
    if (selected && setValue && value !== selected?.value) {
      setValue(selected?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useImperativeHandle(ref, () => ({ focus }));
  function focus() {
    setTimeout(() => {
      button.current?.focus();
      button.current?.click();
    }, 1);
  }

  return (
    <div>
        {withLabel && title && (
          <label htmlFor={name} className="mb-1 flex justify-between space-x-2 text-xs font-medium">
            <div className=" flex items-center space-x-1">
              <div className="truncate">
                {title}
                {required && <span className="ml-1 text-red-500">*</span>}
              </div>

              {help && <HintTooltip text={help} />}
            </div>
            {hint}
          </label>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative w-full" autoFocus={autoFocus} disabled={disabled || readOnly}>
              <input type="hidden" name={name} value={selected?.value ?? ""} hidden readOnly />

              {icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EntityIcon className="text-muted-foreground h-5 w-5" icon={icon} />
                </div>
              )}

              <span className="inline-flex w-full items-center space-x-2 truncate pr-4">
                {withColors && selected && <ColorBadge color={selected?.color ?? Colors.UNDEFINED} />}
                <div className="truncate">
                  {selected ? (
                    <span>{selected?.name}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {isLoading ? <Fragment>{t("shared.loading")}...</Fragment> : <Fragment>{selectPlaceholder ?? t("shared.select")}...</Fragment>}
                    </span>
                  )}
                </div>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 w-56 overflow-auto">
            {title && (
              <Fragment>
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </Fragment>
            )}
            <DropdownMenuGroup>
              {options.map((item) => (
                <DropdownMenuItem key={item.value} onClick={() => setSelected(item)}>
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
};

export default forwardRef(InputSelector);

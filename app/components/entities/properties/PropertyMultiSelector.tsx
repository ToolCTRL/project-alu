import { ReactNode, useEffect, useState } from "react";
import InputCombobox from "~/components/ui/input/InputCombobox";
import { RowValueMultipleDto } from "~/application/dtos/entities/RowValueMultipleDto";
import InputCheckboxCards from "~/components/ui/input/InputCheckboxCards";

interface Props {
  readonly name: string;
  readonly title: string;
  readonly options: { value: string; name: string | null; color: number }[];
  readonly subtype?: "combobox" | "checkboxCards";
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly value?: RowValueMultipleDto[];
  readonly onSelected?: (item: RowValueMultipleDto[]) => void;
}

const PropertyMultiSelector = ({ name, title, options, subtype, disabled, value, onSelected, required }: Props) => {
  const [actualValue, setActualValue] = useState<(string | number)[]>([]);

  useEffect(() => {
    const selection = value?.map((f) => f.value) ?? [];
    const sortedSelection = [...selection].sort((a, b) => String(a).localeCompare(String(b)));
    const sortedActual = [...actualValue].sort((a, b) => String(a).localeCompare(String(b)));
    if (sortedSelection.join(",") !== sortedActual.join(",")) {
      setActualValue(selection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (onSelected) {
      // onSelected can be called here if needed
    }
  }, [actualValue, onSelected]);

  if (!subtype || subtype === "combobox") {
    return (
      <>
        <InputCombobox
          name={name}
          title={title}
          value={actualValue}
          onChange={setActualValue}
          options={options}
          disabled={disabled}
          withSearch={false}
          withLabel={true}
          required={required}
        />
        {actualValue?.map((item, idx) => (
          <input
            key={`${name}-${item}-${idx}`}
            type="hidden"
            name={name + `[]`}
            value={JSON.stringify({
              value: item,
              order: idx,
            })}
          />
        ))}
      </>
    );
  }

  if (subtype === "checkboxCards") {
    return (
      <>
        <InputCheckboxCards
          name={name}
          title={title}
          value={actualValue}
          onChange={setActualValue}
          options={options.map((f) => ({
            value: f.value,
            name: f.name ?? f.value,
          }))}
          disabled={disabled}
          required={required}
        />
        {actualValue?.map((item, idx) => (
          <input
            key={`${name}-${item}-${idx}`}
            type="hidden"
            name={name + `[]`}
            value={JSON.stringify({
              value: item,
              order: idx,
            })}
          />
        ))}
      </>
    );
  }

  return null;
};

export default PropertyMultiSelector;

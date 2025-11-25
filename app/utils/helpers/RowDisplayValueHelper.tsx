import { Link } from "react-router";
import { TFunction } from "i18next";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { InputType } from "~/application/enums/shared/InputType";
import InputNumber from "~/components/ui/input/InputNumber";
import InputSelect from "~/components/ui/input/InputSelect";
import InputText from "~/components/ui/input/InputText";

function renderReadOnlyValue<T>(header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  const value = header.formattedValue ? header.formattedValue(item, idxRow) : header.value(item, idxRow);

  if (header.href !== undefined && header.href(item)) {
    return (
      <Link
        onClick={(e) => {
          e.stopPropagation();
        }}
        to={header.href(item) ?? ""}
        className="focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed border-transparent"
      >
        <span>{value}</span>
      </Link>
    );
  }
  return <span>{value}</span>;
}

function renderTextInput<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  return (
    <InputText
      borderless={header.inputBorderless}
      withLabel={false}
      name={header.name}
      title={t(header.title)}
      value={header.value(item, idxRow)}
      disabled={header.editable && !header.editable(item, idxRow)}
      setValue={(e) => {
        if (header.setValue) {
          header.setValue(e, idxRow);
        }
      }}
      required={!header.inputOptional}
    />
  );
}

function renderNumberInput<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  return (
    <InputNumber
      borderless={header.inputBorderless}
      withLabel={false}
      name={header.name}
      title={t(header.title)}
      value={header.value(item, idxRow)}
      disabled={header.editable && !header.editable(item)}
      setValue={(e) => {
        if (header.setValue) {
          header.setValue(e, idxRow);
        }
      }}
      required={!header.inputOptional}
      step={header.inputNumberStep}
    />
  );
}

function renderSelectInput<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  return (
    <InputSelect
      borderless={header.inputBorderless}
      withLabel={false}
      name={header.name}
      title={t(header.title)}
      value={header.value(item, idxRow)}
      setValue={(e) => {
        if (header.setValue) {
          header.setValue(Number(e), idxRow);
        }
      }}
      options={header.options ?? []}
      required={!header.inputOptional}
      disabled={header.editable && !header.editable(item)}
    />
  );
}

function renderEditableInput<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  if (header.type === undefined || header.type === InputType.TEXT) {
    return renderTextInput(t, header, item, idxRow);
  }
  if (header.type === InputType.NUMBER) {
    return renderNumberInput(t, header, item, idxRow);
  }
  if (header.type === InputType.SELECT) {
    return renderSelectInput(t, header, item, idxRow);
  }
  return <></>;
}

function displayRowValue<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  if (!header.setValue) {
    return renderReadOnlyValue(header, item, idxRow);
  }
  return renderEditableInput(t, header, item, idxRow);
}

export default {
  displayRowValue,
};

import { RowMedia, RowValueMultiple, RowValueRange } from "@prisma/client";
import { Ref, useImperativeHandle, useRef, useState, useEffect, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { MediaDto } from "~/application/dtos/entities/MediaDto";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import InputDate, { RefInputDate } from "~/components/ui/input/InputDate";
import InputNumber, { RefInputNumber } from "~/components/ui/input/InputNumber";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import { PropertyWithDetails, EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputMedia from "~/components/ui/input/InputMedia";
import PropertyAttributeHelper from "~/utils/helpers/PropertyAttributeHelper";
import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import { marked } from "marked";
import { RowValueMultipleDto } from "~/application/dtos/entities/RowValueMultipleDto";
import InputMultiText, { RefInputMultiText } from "~/components/ui/input/InputMultiText";
import PropertyMultiSelector from "../properties/PropertyMultiSelector";
import InputRangeNumber from "~/components/ui/input/ranges/InputRangeNumber";
import { RowValueRangeDto } from "~/application/dtos/entities/RowValueRangeDto";
import InputRangeDate from "~/components/ui/input/ranges/InputRangeDate";
import { getSeparator } from "~/utils/shared/SeparatorUtils";
import InputTextSubtype from "~/components/ui/input/subtypes/InputTextSubtype";
import { PromptFlowWithDetails } from "~/modules/promptBuilder/db/promptFlows.db.server";
import InputSelect from "~/components/ui/input/InputSelect";
import InputRadioGroupCards from "~/components/ui/input/InputRadioGroupCards";

export interface RefRowValueInput {
  focus: () => void;
}

interface Props {
  selected: PropertyWithDetails | undefined;
  entity: EntityWithDetails;
  textValue: string | undefined;
  numberValue: number | undefined;
  dateValue: Date | undefined;
  booleanValue: boolean | undefined;
  multiple: RowValueMultiple[] | undefined;
  range: RowValueRange | undefined;
  initialMedia?: RowMedia[];
  initialOption?: string;
  onChange?: (value: string | number | Date | boolean | undefined | null) => void;
  onChangeOption?: (option: string | undefined) => void;
  onChangeMedia?: (option: MediaDto[]) => void;
  onChangeMultiple?: (option: RowValueMultipleDto[]) => void;
  onChangeRange?: (option: RowValueRangeDto | undefined) => void;
  readOnly: boolean;
  className?: string;
  autoFocus?: boolean;
  promptFlows?: { rowId: string | undefined; prompts: PromptFlowWithDetails[] };
}

function useFocusHandlers(selected: PropertyWithDetails | undefined) {
  const numberInput = useRef<RefInputNumber>(null);
  const textInput = useRef<RefInputText>(null);
  const dateInput = useRef<RefInputDate>(null);

  const focus = () => {
    if (selected?.type === PropertyType.TEXT) {
      textInput.current?.input.current?.focus();
    } else if (selected?.type === PropertyType.NUMBER) {
      numberInput.current?.input.current?.focus();
    } else if (selected?.type === PropertyType.DATE) {
      dateInput.current?.input.current?.focus();
    }
  };

  return { focus, numberInput, textInput, dateInput };
}

function useMediaChangeEffect(selected: PropertyWithDetails | undefined, onChangeMedia: ((option: MediaDto[]) => void) | undefined) {
  const [media, setMedia] = useState<MediaDto[]>([]);

  useEffect(() => {
    if (selected?.type === PropertyType.MEDIA && onChangeMedia) {
      onChangeMedia(media);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  return { media, setMedia };
}

function renderPropertyInput(
  selected: PropertyWithDetails,
  props: {
    textValue?: string;
    numberValue?: number;
    dateValue?: Date;
    booleanValue?: boolean;
    multiple?: RowValueMultiple[];
    range?: RowValueRange;
    initialMedia?: RowMedia[];
    initialOption?: string;
    onChange?: (value: string | number | Date | boolean | undefined | null) => void;
    onChangeOption?: (option: string | undefined) => void;
    onChangeMultiple?: (option: RowValueMultipleDto[]) => void;
    onChangeRange?: (option: RowValueRangeDto | undefined) => void;
    readOnly: boolean;
    className?: string;
    autoFocus?: boolean;
    promptFlows?: { rowId?: string; prompts: PromptFlowWithDetails[] };
    t: any;
    setMedia: (media: MediaDto[]) => void;
    numberInput: Ref<RefInputNumber>;
    textInput: Ref<RefInputText>;
    dateInput: Ref<RefInputDate>;
    multipleInput: Ref<RefInputMultiText>;
  }
) {
  const {
    textValue,
    numberValue,
    dateValue,
    booleanValue,
    multiple,
    range,
    initialMedia,
    initialOption,
    onChange,
    onChangeOption,
    onChangeMultiple,
    onChangeRange,
    readOnly,
    className,
    autoFocus,
    promptFlows,
    t,
    setMedia,
    numberInput,
    dateInput,
    multipleInput,
  } = props;

  switch (selected.type) {
    case PropertyType.TEXT:
      return (
        <TextPropertyInput
          selected={selected}
          textValue={textValue}
          readOnly={readOnly}
          className={className}
          onChange={onChange}
          autoFocus={autoFocus}
          promptFlows={promptFlows}
          t={t}
        />
      );
    case PropertyType.NUMBER:
      return (
        <NumberPropertyInput
          ref={numberInput}
          selected={selected}
          numberValue={numberValue}
          readOnly={readOnly}
          className={className}
          onChange={onChange}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.DATE:
      return (
        <DatePropertyInput
          ref={dateInput}
          selected={selected}
          dateValue={dateValue}
          readOnly={readOnly}
          className={className}
          onChange={onChange}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.SELECT:
      return (
        <SelectPropertyInput
          selected={selected}
          initialOption={initialOption}
          textValue={textValue}
          readOnly={readOnly}
          className={className}
          onChange={onChange}
          onChangeOption={onChangeOption}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.BOOLEAN:
      return (
        <BooleanPropertyInput
          selected={selected}
          booleanValue={booleanValue}
          readOnly={readOnly}
          className={className}
          onChange={onChange}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.MEDIA:
      return (
        <MediaPropertyInput
          selected={selected}
          initialMedia={initialMedia}
          readOnly={readOnly}
          className={className}
          setMedia={setMedia}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.MULTI_SELECT:
      return (
        <MultiSelectPropertyInput
          selected={selected}
          multiple={multiple}
          readOnly={readOnly}
          onChangeMultiple={onChangeMultiple}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.MULTI_TEXT:
      return (
        <MultiTextPropertyInput
          ref={multipleInput}
          selected={selected}
          multiple={multiple}
          readOnly={readOnly}
          className={className}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.RANGE_NUMBER:
      return (
        <RangeNumberPropertyInput
          selected={selected}
          range={range}
          readOnly={readOnly}
          className={className}
          onChangeRange={onChangeRange}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.RANGE_DATE:
      return (
        <RangeDatePropertyInput
          selected={selected}
          range={range}
          readOnly={readOnly}
          className={className}
          onChangeRange={onChangeRange}
          autoFocus={autoFocus}
          t={t}
        />
      );
    case PropertyType.FORMULA:
      return (
        <FormulaPropertyInput selected={selected} textValue={textValue} numberValue={numberValue} dateValue={dateValue} booleanValue={booleanValue} />
      );
    default:
      return <div className={className}>Not supported</div>;
  }
}

const RowValueInput = (
  {
    entity,
    selected,
    textValue,
    numberValue,
    dateValue,
    booleanValue,
    multiple,
    range,
    initialMedia,
    initialOption,
    onChange,
    onChangeOption,
    onChangeMedia,
    onChangeMultiple,
    onChangeRange,
    className,
    readOnly,
    autoFocus,
    promptFlows,
  }: Props,
  ref: Ref<RefRowValueInput>
) => {
  const { t } = useTranslation();
  const { focus, numberInput, textInput, dateInput } = useFocusHandlers(selected);
  const { setMedia } = useMediaChangeEffect(selected, onChangeMedia);
  const multipleInput = useRef<RefInputMultiText>(null);

  useImperativeHandle(ref, () => ({ focus }));

  if (!selected) {
    return <div className={className}>No property selected</div>;
  }

  return renderPropertyInput(selected, {
    textValue,
    numberValue,
    dateValue,
    booleanValue,
    multiple,
    range,
    initialMedia,
    initialOption,
    onChange,
    onChangeOption,
    onChangeMultiple,
    onChangeRange,
    readOnly,
    className,
    autoFocus,
    promptFlows,
    t,
    setMedia,
    numberInput,
    textInput,
    dateInput,
    multipleInput,
  });
};

function TextPropertyInput({
  selected,
  textValue,
  readOnly,
  className,
  onChange,
  autoFocus,
  promptFlows,
  t,
}: {
  selected: PropertyWithDetails;
  textValue?: string;
  readOnly: boolean;
  className?: string;
  onChange?: (value: string | number | Date | boolean | undefined | null) => void;
  autoFocus?: boolean;
  promptFlows?: { rowId: string | undefined; prompts: PromptFlowWithDetails[] };
  t: any;
}) {
  const editor = PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Editor) ?? "";
  const isSpecialEditor = ["monaco", "wysiwyg", "iframe"].includes(editor);

  if (isSpecialEditor && readOnly) {
    if (editor === "iframe") {
      return (
        <div className="overflow-auto">
          <iframe title={t(selected.title)} src={textValue} className="h-96 w-full" />
        </div>
      );
    }
    if (["monaco", "wysiwyg"].includes(editor)) {
      return (
        <div className="overflow-auto">
          <label className="mb-1 flex justify-between space-x-2 truncate text-xs font-medium">
            <span>{t(selected.title)}</span>
          </label>
          <div className="prose border-border bg-secondary h-auto rounded-md border p-3">
            <div dangerouslySetInnerHTML={{ __html: marked(textValue ?? "") ?? "" }} />
          </div>
        </div>
      );
    }
  }

  return (
    <InputTextSubtype
      subtype={selected.subtype as any}
      name={selected.name}
      title={t(selected.title)}
      value={textValue}
      setValue={(e) => (onChange ? onChange(e.toString()) : undefined)}
      required={selected.isRequired}
      className={className}
      readOnly={readOnly}
      disabled={readOnly}
      pattern={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Pattern)}
      minLength={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min)}
      maxLength={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Max)}
      rows={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Rows)}
      placeholder={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Placeholder)}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      uppercase={PropertyAttributeHelper.getPropertyAttributeValue_Boolean(selected, PropertyAttributeName.Uppercase)}
      lowercase={PropertyAttributeHelper.getPropertyAttributeValue_Boolean(selected, PropertyAttributeName.Lowercase)}
      password={PropertyAttributeHelper.getPropertyAttributeValue_Boolean(selected, PropertyAttributeName.Password)}
      editor={editor}
      editorLanguage={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.EditorLanguage)}
      editorSize={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.EditorSize) as any}
      autoFocus={autoFocus}
      promptFlows={promptFlows}
    />
  );
}

const NumberPropertyInput = forwardRef<
  RefInputNumber,
  {
    selected: PropertyWithDetails;
    numberValue?: number;
    readOnly: boolean;
    className?: string;
    onChange?: (value: string | number | Date | boolean | undefined | null) => void;
    autoFocus?: boolean;
    t: any;
  }
>(({ selected, numberValue, readOnly, className, onChange, autoFocus, t }, ref) => {
  return (
    <InputNumber
      ref={ref}
      name={selected.name}
      title={t(selected.title)}
      required={selected.isRequired}
      value={numberValue}
      setValue={(e) => (onChange ? onChange(Number(e)) : undefined)}
      disabled={readOnly}
      className={className}
      readOnly={readOnly}
      min={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min)}
      max={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Max)}
      step={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Step)}
      placeholder={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Placeholder)}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
      canUnset={true}
    />
  );
});

const DatePropertyInput = forwardRef<
  RefInputDate,
  {
    selected: PropertyWithDetails;
    dateValue?: Date;
    readOnly: boolean;
    className?: string;
    onChange?: (value: string | number | Date | boolean | undefined | null) => void;
    autoFocus?: boolean;
    t: any;
  }
>(({ selected, dateValue, readOnly, className, onChange, autoFocus, t }, ref) => {
  return (
    <InputDate
      ref={ref}
      required={selected.isRequired}
      name={selected.name}
      title={t(selected.title)}
      value={dateValue}
      onChange={(e) => (onChange ? onChange(e) : undefined)}
      className={className}
      readOnly={readOnly}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
    />
  );
});

function SelectPropertyInput({
  selected,
  initialOption,
  textValue,
  readOnly,
  className,
  onChange,
  onChangeOption,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  initialOption?: string;
  textValue?: string;
  readOnly: boolean;
  className?: string;
  onChange?: (value: string | number | Date | boolean | undefined | null) => void;
  onChangeOption?: (option: string | undefined) => void;
  autoFocus?: boolean;
  t: any;
}) {
  const handleSelectChange = (e: string | undefined) => {
    if (onChange) {
      onChange(e?.toString() ?? "");
    }
    if (onChangeOption) {
      onChangeOption(e?.toString());
    }
  };

  if (!selected.subtype || selected.subtype === "dropdown") {
    return (
      <InputSelect
        name={selected.name}
        title={t(selected.title)}
        required={selected.isRequired}
        value={initialOption}
        defaultValue={textValue}
        setValue={handleSelectChange}
        disabled={readOnly}
        className={className}
        hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
        help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
        autoFocus={autoFocus}
        options={selected.options.map((f) => ({
          name: f.name ?? f.value,
          value: f.value,
        }))}
      />
    );
  }

  if (selected.subtype === "radioGroupCards") {
    return (
      <InputRadioGroupCards
        title={t(selected.title)}
        name={selected.name}
        value={initialOption}
        defaultValue={textValue}
        disabled={readOnly}
        required={selected.isRequired}
        options={selected.options.map((f) => ({
          value: f.value,
          name: f.name ?? f.value,
        }))}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
          if (onChangeOption) {
            onChangeOption(e);
          }
        }}
      />
    );
  }

  return null;
}

function BooleanPropertyInput({
  selected,
  booleanValue,
  readOnly,
  className,
  onChange,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  booleanValue?: boolean;
  readOnly: boolean;
  className?: string;
  onChange?: (value: string | number | Date | boolean | undefined | null) => void;
  autoFocus?: boolean;
  t: any;
}) {
  return (
    <InputCheckbox
      asToggle={true}
      name={selected.name}
      title={t(selected.title)}
      required={selected.isRequired}
      value={booleanValue}
      setValue={(e) => (onChange ? onChange(e as boolean) : undefined)}
      disabled={readOnly}
      className={className}
      readOnly={readOnly}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
    />
  );
}

function MediaPropertyInput({
  selected,
  initialMedia,
  readOnly,
  className,
  setMedia,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  initialMedia?: RowMedia[];
  readOnly: boolean;
  className?: string;
  setMedia: (media: MediaDto[]) => void;
  autoFocus?: boolean;
  t: any;
}) {
  return (
    <InputMedia
      name={selected.name}
      title={selected.title}
      initialMedia={initialMedia}
      className={className}
      disabled={readOnly}
      onSelected={(e) => setMedia(e)}
      readOnly={readOnly}
      required={selected.isRequired || (PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min) ?? 0) > 0}
      min={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min)}
      max={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Max)}
      accept={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.AcceptFileTypes)}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      autoFocus={autoFocus}
    />
  );
}

function MultiSelectPropertyInput({
  selected,
  multiple,
  readOnly,
  onChangeMultiple,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  multiple?: RowValueMultiple[];
  readOnly: boolean;
  onChangeMultiple?: (option: RowValueMultipleDto[]) => void;
  autoFocus?: boolean;
  t: any;
}) {
  return (
    <PropertyMultiSelector
      subtype={selected.subtype as any}
      name={selected.name}
      title={selected.title}
      required={selected.isRequired}
      options={selected.options}
      value={multiple}
      onSelected={(e) => (onChangeMultiple ? onChangeMultiple(e) : undefined)}
      disabled={readOnly}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
    />
  );
}

const MultiTextPropertyInput = forwardRef<
  RefInputMultiText,
  {
    selected: PropertyWithDetails;
    multiple?: RowValueMultiple[];
    readOnly: boolean;
    className?: string;
    autoFocus?: boolean;
    t: any;
  }
>(({ selected, multiple, readOnly, className, autoFocus, t }, ref) => {
  return (
    <InputMultiText
      ref={ref}
      name={selected.name}
      title={t(selected.title)}
      value={multiple}
      required={selected.isRequired}
      className={className}
      readOnly={readOnly}
      disabled={readOnly}
      pattern={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Pattern)}
      minLength={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min)}
      maxLength={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Max)}
      rows={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Rows)}
      placeholder={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Placeholder)}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      uppercase={PropertyAttributeHelper.getPropertyAttributeValue_Boolean(selected, PropertyAttributeName.Uppercase)}
      lowercase={PropertyAttributeHelper.getPropertyAttributeValue_Boolean(selected, PropertyAttributeName.Lowercase)}
      autoFocus={autoFocus}
      separator={getSeparator(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Separator))}
    />
  );
});

function RangeNumberPropertyInput({
  selected,
  range,
  readOnly,
  className,
  onChangeRange,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  range?: RowValueRange;
  readOnly: boolean;
  className?: string;
  onChangeRange?: (option: RowValueRangeDto | undefined) => void;
  autoFocus?: boolean;
  t: any;
}) {
  return (
    <InputRangeNumber
      name={selected.name}
      title={t(selected.title)}
      required={selected.isRequired}
      valueMin={range?.numberMin ? Number(range.numberMin) : undefined}
      valueMax={range?.numberMax ? Number(range.numberMax) : undefined}
      onChangeMin={(e) => {
        if (onChangeRange) {
          onChangeRange({
            dateMin: null,
            dateMax: null,
            numberMin: Number(e),
            numberMax: range?.numberMax ? Number(range.numberMax) : null,
          });
        }
      }}
      onChangeMax={(e) => {
        if (onChangeRange) {
          onChangeRange({
            dateMin: null,
            dateMax: null,
            numberMax: Number(e),
            numberMin: range?.numberMin ? Number(range.numberMin) : null,
          });
        }
      }}
      disabled={readOnly}
      className={className}
      readOnly={readOnly}
      min={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Min)}
      max={PropertyAttributeHelper.getPropertyAttributeValue_Number(selected, PropertyAttributeName.Max)}
      step={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Step)}
      placeholder={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Placeholder)}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
    />
  );
}

function RangeDatePropertyInput({
  selected,
  range,
  readOnly,
  className,
  onChangeRange,
  autoFocus,
  t,
}: {
  selected: PropertyWithDetails;
  range?: RowValueRange;
  readOnly: boolean;
  className?: string;
  onChangeRange?: (option: RowValueRangeDto | undefined) => void;
  autoFocus?: boolean;
  t: any;
}) {
  return (
    <InputRangeDate
      required={selected.isRequired}
      name={selected.name}
      title={t(selected.title)}
      valueMin={range?.dateMin ?? undefined}
      valueMax={range?.dateMax ?? undefined}
      onChangeMin={(e) => {
        if (onChangeRange) {
          onChangeRange({
            dateMin: e,
            dateMax: range?.dateMax ?? null,
            numberMin: null,
            numberMax: null,
          });
        }
      }}
      onChangeMax={(e) => {
        if (onChangeRange) {
          onChangeRange({
            dateMin: range?.dateMin ?? null,
            dateMax: e,
            numberMin: null,
            numberMax: null,
          });
        }
      }}
      className={className}
      readOnly={readOnly}
      hint={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HintText) ?? "")}
      help={t(PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.HelpText) ?? "")}
      icon={PropertyAttributeHelper.getPropertyAttributeValue_String(selected, PropertyAttributeName.Icon)}
      autoFocus={autoFocus}
    />
  );
}

function FormulaPropertyInput({
  selected,
  textValue,
  numberValue,
  dateValue,
  booleanValue,
}: {
  selected: PropertyWithDetails;
  textValue?: string;
  numberValue?: number;
  dateValue?: Date;
  booleanValue?: boolean;
}) {
  if (!selected.formula) {
    return <div className="text-red-500">Unknown formula</div>;
  }

  return <InputFormulaValue property={selected} textValue={textValue} numberValue={numberValue} dateValue={dateValue} booleanValue={booleanValue} />;
}

function InputFormulaValue(props: { property: PropertyWithDetails; textValue?: string; numberValue?: number; dateValue?: Date; booleanValue?: boolean }) {
  const resultAs = props.property.formula?.resultAs;

  if (resultAs === "string") {
    return <InputText name={props.property.name} title={props.property.title} defaultValue={props.textValue} readOnly={true} />;
  }
  if (resultAs === "number") {
    return <InputNumber name={props.property.name} title={props.property.title} defaultValue={props.numberValue} readOnly={true} canUnset={true} />;
  }
  if (resultAs === "date") {
    return <InputDate name={props.property.name} title={props.property.title} value={props.dateValue} readOnly={true} />;
  }
  if (resultAs === "boolean") {
    return <InputCheckbox asToggle={true} name={props.property.name} title={props.property.title} value={props.booleanValue} readOnly={true} />;
  }
  return null;
}

export default forwardRef(RowValueInput);

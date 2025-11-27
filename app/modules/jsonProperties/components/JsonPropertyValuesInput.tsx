import InputText from "~/components/ui/input/InputText";
import { JsonPropertyDto } from "../dtos/JsonPropertyTypeDto";
import { JsonPropertiesValuesDto, JsonValue } from "../dtos/JsonPropertiesValuesDto";
import InputNumber from "~/components/ui/input/InputNumber";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputDate from "~/components/ui/input/InputDate";
import InputImage from "~/components/ui/input/InputImage";
import InputSelect from "~/components/ui/input/InputSelect";
import InputCombobox from "~/components/ui/input/InputCombobox";
import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import clsx from "clsx";
import NovelEditor from "~/modules/novel/ui/editor";
import InputGroup from "~/components/ui/forms/InputGroup";

export default function JsonPropertyValuesInput({
  prefix = "attributes",
  properties,
  attributes,
}: readonly {
  readonly prefix?: string;
  readonly properties: JsonPropertyDto[] | JsonValue | null;
  readonly attributes: JsonPropertiesValuesDto | null;
}) {
  let propertiesObj = properties as JsonPropertyDto[] | null;
  if (!propertiesObj) {
    return null;
  }
  const groups: { name: string; properties: JsonPropertyDto[] }[] = [];
  propertiesObj.forEach((property) => {
    let group = groups.find((g) => g.name === property.group);
    if (!group) {
      group = { name: property.group || "", properties: [] };
      groups.push(group);
    }
    group.properties.push(property);
  });
  return (
    <Fragment>
      {groups.map((group) => {
        return (
          <Fragment key={group.name || "default"}>
            {group.name ? (
              <InputGroup title={group.name} className="space-y-2">
                <GroupInputs prefix={prefix} properties={group.properties} attributes={attributes} />
              </InputGroup>
            ) : (
              <GroupInputs prefix={prefix} properties={group.properties} attributes={attributes} />
            )}
          </Fragment>
        );
      })}
    </Fragment>
  );
}

function GroupInputs({ prefix, properties, attributes }: readonly { readonly prefix: string; readonly properties: JsonPropertyDto[]; readonly attributes: JsonPropertiesValuesDto | null }) {
  let propertiesObj = properties as JsonPropertyDto[] | null;
  return (
    <Fragment>
      {propertiesObj?.map((property) => {
        return (
          <div key={property.name}>
            <JsonPropertyInput prefix={prefix} property={property} attributes={attributes} />
          </div>
        );
      })}
    </Fragment>
  );
}

function getValueOrDefault<T>(value: JsonValue | undefined, defaultValue: JsonValue | undefined, converter: (val: JsonValue) => T): T | undefined {
  const actualValue = value === undefined ? undefined : converter(value);
  const actualDefault = defaultValue === undefined ? undefined : converter(defaultValue);
  return actualValue ?? actualDefault;
}

function StringInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const stringValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
  return (
    <div>
      <InputText name={`${prefix}[${property.name}]`} title={t(property.title)} defaultValue={stringValue} required={property.required} />
    </div>
  );
}

function NumberInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const numberValue = getValueOrDefault(value, property.defaultValue, (v) => v as number);
  return (
    <div>
      <InputNumber name={`${prefix}[${property.name}]`} title={t(property.title)} defaultValue={numberValue} required={property.required} />
    </div>
  );
}

function BooleanInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const booleanValue = getValueOrDefault(
    value,
    property.defaultValue,
    (v) => v === "true" || v === true || v === 1 || v === "1"
  );
  return (
    <div>
      <InputCheckbox name={`${prefix}[${property.name}]`} title={t(property.title)} value={booleanValue} required={property.required} />
    </div>
  );
}

function DateInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const dateValue = getValueOrDefault(value, property.defaultValue, (v) => new Date(v as string));
  return (
    <div>
      <InputDate name={`${prefix}[${property.name}]`} title={t(property.title)} defaultValue={dateValue} required={property.required} />
    </div>
  );
}

function ImageInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const imageValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
  return (
    <div>
      <InputImage name={`${prefix}[${property.name}]`} title={t(property.title)} defaultValue={imageValue} required={property.required} />
    </div>
  );
}

function SelectInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const stringValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
  const selectOptions = property.options?.filter((f) => f.value) || [];
  return (
    <div>
      <InputSelect
        name={`${prefix}[${property.name}]`}
        title={t(property.title)}
        defaultValue={stringValue}
        required={property.required}
        options={selectOptions}
        placeholder={`${t("shared.select")}...`}
      />
    </div>
  );
}

function WysiwygInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const stringValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
  return (
    <div>
      <InputText
        name={`${prefix}[${property.name}]`}
        title={t(property.title)}
        defaultValue={stringValue}
        required={property.required}
        editor="wysiwyg"
        editorSize="md"
      />
    </div>
  );
}

function MonacoInput({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: JsonValue | undefined }) {
  const { t } = useTranslation();
  const stringValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
  return (
    <div>
      <InputText
        name={`${prefix}[${property.name}]`}
        title={t(property.title)}
        defaultValue={stringValue}
        required={property.required}
        editor="monaco"
        editorLanguage="markdown"
        editorSize="md"
      />
    </div>
  );
}

function JsonPropertyInput({ prefix, property, attributes }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly attributes: JsonPropertiesValuesDto | null }) {
  const value: JsonValue | undefined = attributes ? attributes[property.name] : undefined;

  switch (property.type) {
    case "string":
      return <StringInput prefix={prefix} property={property} value={value} />;
    case "number":
      return <NumberInput prefix={prefix} property={property} value={value} />;
    case "boolean":
      return <BooleanInput prefix={prefix} property={property} value={value} />;
    case "date":
      return <DateInput prefix={prefix} property={property} value={value} />;
    case "image":
      return <ImageInput prefix={prefix} property={property} value={value} />;
    case "select":
      return <SelectInput prefix={prefix} property={property} value={value} />;
    case "multiselect": {
      const arrValue = value === undefined ? [] : (value as Array<string>);
      const defaultArrValue = property.defaultValue === undefined ? [] : (property.defaultValue as Array<string>);
      const finalValue = value === undefined && defaultArrValue.length > 0 ? defaultArrValue : arrValue;
      return <JsonMultiSelectInput prefix={prefix} property={property} initial={finalValue} />;
    }
    case "wysiwyg":
      return <WysiwygInput prefix={prefix} property={property} value={value} />;
    case "monaco":
      return <MonacoInput prefix={prefix} property={property} value={value} />;
    case "content": {
      const stringValue = getValueOrDefault(value, property.defaultValue, (v) => v as string);
      return <ContentForm prefix={prefix} property={property} value={stringValue} />;
    }
    default:
      return null;
  }
}

function JsonMultiSelectInput({ prefix, property, initial }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly initial: string[] }) {
  const { t } = useTranslation();
  const [actualValue, setActualValue] = useState<(string | number)[]>(initial);
  return (
    <div>
      {actualValue?.map((item) => {
        return <input key={item} type="hidden" name={`${prefix}[${property.name}][]`} value={item} />;
      })}
      <InputCombobox
        title={t(property.title)}
        value={actualValue}
        onChange={setActualValue}
        required={property.required}
        options={property.options?.filter((f) => f.value) || []}
        withSearch={false}
      />
    </div>
  );
}

function ContentForm({ prefix, property, value }: readonly { readonly prefix: string; readonly property: JsonPropertyDto; readonly value: string | undefined }) {
  const [content, setContent] = useState(value);
  const [contentType, setContentType] = useState("wysiwyg");

  return (
    <div className="space-y-2">
      <div className="grid gap-3">
        <div className="space-y-2">
          <div className="flex justify-between space-x-2">
            <div className="flex items-center space-x-1">
              <button type="button" onClick={() => setContentType("wysiwyg")} className="text-muted-foreground text-xs hover:underline">
                <div className={clsx(contentType === "wysiwyg" ? "font-bold" : "")}>WYSIWYG</div>
              </button>
              <div>•</div>
              <button type="button" onClick={() => setContentType("markdown")} className="text-muted-foreground text-xs hover:underline">
                <div className={clsx(contentType === "markdown" ? "font-bold" : "")}>Markdown</div>
              </button>
            </div>
          </div>
          <input name="contentType" value={contentType} readOnly hidden />
          {contentType === "wysiwyg" && (
            <div className="h-[calc(100vh-320px)] overflow-y-auto">
              <input type="hidden" name="content" value={content} hidden readOnly />
              <NovelEditor content={content} onChange={(e) => setContent(e.html ?? "")} usingLocalStorage={false} />
            </div>
          )}
          {contentType === "markdown" && (
            <InputText
              className="col-span-12 h-[calc(100vh-320px)] overflow-y-auto"
              rows={6}
              editor="monaco"
              editorLanguage="markdown"
              editorTheme="vs-dark"
              editorFontSize={14}
              name="content"
              value={content}
              setValue={(e) => setContent(e.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}

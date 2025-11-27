import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import { Colors } from "~/application/enums/shared/Colors";
import { PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import PropertyAttributeHelper from "~/utils/helpers/PropertyAttributeHelper";
import { SelectOptionsDisplay } from "~/utils/shared/SelectOptionsUtils";

// Helper: Get TypeScript type for property
function getPropertyType(property: PropertyWithDetails, imports: string[]): string {
  const makeOptional = (t: string) => property.isRequired ? t : `${t} | undefined`;

  switch (property.type) {
    case PropertyType.TEXT:
    case PropertyType.SELECT:
      return makeOptional("string");
    case PropertyType.NUMBER:
      return makeOptional("number");
    case PropertyType.DATE:
      return makeOptional("Date");
    case PropertyType.BOOLEAN:
      return makeOptional("boolean");
    case PropertyType.MEDIA: {
      imports.push(`import { MediaDto } from "~/application/dtos/entities/MediaDto";`);
      const isSingleMedia = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1;
      return isSingleMedia ? makeOptional("MediaDto") : makeOptional("MediaDto[]");
    }
    case PropertyType.MULTI_SELECT:
    case PropertyType.MULTI_TEXT:
      imports.push(`import { RowValueMultipleDto } from "~/application/dtos/entities/RowValueMultipleDto";`);
      return "RowValueMultipleDto[]";
    case PropertyType.RANGE_NUMBER:
    case PropertyType.RANGE_DATE:
      imports.push(`import { RowValueRangeDto } from "~/application/dtos/entities/RowValueRangeDto";`);
      return makeOptional("RowValueRangeDto");
    default:
      console.log(`Unknown property type: ${PropertyType[property.type]}`);
      return "unknown";
  }
}

function type({ code, imports, property }: { code: string[]; imports: string[]; property: PropertyWithDetails }) {
  const typeStr = getPropertyType(property, imports);
  const comments: string[] = [property.isRequired ? "required" : "optional"];
  property.attributes
    .filter((f) => f.value)
    .forEach((attribute) => {
      comments.push(`${attribute.name}: ${attribute.value}`);
    });
  code.push(`  ${property.name}: ${typeStr}; // ${comments.join(", ")}`);
}

// Helper: Generate row-to-DTO conversion code
function generateRowToDtoCode(property: PropertyWithDetails): string {
  const name = property.name;
  const fallback = (val: string) => property.isRequired ? ` ?? ${val}` : ``;

  switch (property.type) {
    case PropertyType.TEXT:
    case PropertyType.SELECT:
      return `${name}: RowValueHelper.getText({ entity, row, name: "${name}" })${fallback('""')},`;
    case PropertyType.NUMBER:
      return `${name}: RowValueHelper.getNumber({ entity, row, name: "${name}" })${fallback('0')},`;
    case PropertyType.DATE:
      return `${name}: RowValueHelper.getDate({ entity, row, name: "${name}" })${fallback('new Date()')},`;
    case PropertyType.BOOLEAN:
      return `${name}: RowValueHelper.getBoolean({ entity, row, name: "${name}" }) ?? false,`;
    case PropertyType.MEDIA: {
      const isSingle = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1;
      if (isSingle) {
        return property.isRequired
          ? `${name}: RowValueHelper.getFirstMedia({ entity, row, name: "${name}" }) as MediaDto,`
          : `${name}: RowValueHelper.getFirstMedia({ entity, row, name: "${name}" }),`;
      }
      return `${name}: RowValueHelper.getMedia({ entity, row, name: "${name}" }),`;
    }
    case PropertyType.MULTI_SELECT:
    case PropertyType.MULTI_TEXT:
      return `${name}: RowValueHelper.getMultiple({ entity, row, name: "${name}" }),`;
    case PropertyType.RANGE_NUMBER:
      return `${name}: RowValueHelper.getNumberRange({ entity, row, name: "${name}" }),`;
    case PropertyType.RANGE_DATE:
      return `${name}: RowValueHelper.getDateRange({ entity, row, name: "${name}" }),`;
    default:
      return "";
  }
}

function rowToDto({ code, property }: { code: string[]; property: PropertyWithDetails }) {
  const propertyCode = generateRowToDtoCode(property);
  const comment = property.isRequired ? "required" : "optional";
  code.push(propertyCode ? `${propertyCode} // ${comment}` : "");
}

// Helper: Generate form-to-DTO conversion code
function generateFormToDtoCode(property: PropertyWithDetails): string {
  const name = property.name;
  switch (property.type) {
    case PropertyType.TEXT:
    case PropertyType.SELECT:
      return `${name}: FormHelper.getText(form, "${name}"),`;
    case PropertyType.NUMBER:
      return `${name}: FormHelper.getNumber(form, "${name}"),`;
    case PropertyType.DATE:
      return `${name}: FormHelper.getDate(form, "${name}"),`;
    case PropertyType.BOOLEAN:
      return `${name}: FormHelper.getBoolean(form, "${name}"),`;
    case PropertyType.MEDIA: {
      const isSingle = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1;
      return isSingle
        ? `${name}: FormHelper.getFormFirstMedia(form, "${name}"),`
        : `${name}: FormHelper.getFormMedia(form, "${name}"),`;
    }
    case PropertyType.MULTI_SELECT:
    case PropertyType.MULTI_TEXT:
      return `${name}: FormHelper.getMultiple(form, "${name}"),`;
    case PropertyType.RANGE_NUMBER:
      return `${name}: FormHelper.getNumberRange(form, "${name}"),`;
    case PropertyType.RANGE_DATE:
      return `${name}: FormHelper.getDateRange(form, "${name}"),`;
    default:
      return `${name}: undefined, // TODO: ${PropertyType[property.type]} not implemented`;
  }
}

function formToDto({ code, property }: { code: string[]; property: PropertyWithDetails }) {
  const propertyCode = generateFormToDtoCode(property);
  const comment = property.isRequired ? "required" : "optional";
  code.push(`${propertyCode} // ${comment}`);
}

function createDtoToRow({ code, property }: { code: string[]; property: PropertyWithDetails }) {
  const optionalChaining = property.isRequired ? "" : "?";
  let propertyCode = ``;
  if (property.type === PropertyType.TEXT) {
    propertyCode = `{ name: "${property.name}", value: data.${property.name} },`;
  } else if (property.type === PropertyType.NUMBER) {
    propertyCode = `{ name: "${property.name}", value: data.${property.name}${optionalChaining}.toString() },`;
  } else if (property.type === PropertyType.DATE) {
    propertyCode = `{ name: "${property.name}", value: data.${property.name}${optionalChaining}.toISOString() },`;
  } else if (property.type === PropertyType.SELECT) {
    propertyCode = `{ name: "${property.name}", value: data.${property.name} },`;
  } else if (property.type === PropertyType.BOOLEAN) {
    propertyCode = `{ name: "${property.name}", value: data.${property.name}${optionalChaining}.toString() },`;
  } else if (property.type === PropertyType.MEDIA) {
    if (PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1) {
      propertyCode = `{ name: "${property.name}", media: data.${property.name} ? [data.${property.name}] : [] },`;
    } else {
      propertyCode = `{ name: "${property.name}", media: data.${property.name} },`;
    }
  } else if (property.type === PropertyType.MULTI_SELECT) {
    propertyCode = `{ name: "${property.name}", multiple: data.${property.name} },`;
  } else if (property.type === PropertyType.RANGE_NUMBER) {
    propertyCode = `{ name: "${property.name}", range: data.${property.name} },`;
  } else if (property.type === PropertyType.RANGE_DATE) {
    propertyCode = `{ name: "${property.name}", range: data.${property.name} },`;
  } else if (property.type === PropertyType.MULTI_TEXT) {
    propertyCode = `{ name: "${property.name}", multiple: data.${property.name} },`;
  }
  code.push(propertyCode);
}

function updateDtoToRow({ code, property }: { code: string[]; property: PropertyWithDetails }) {
  let propertyCode = `if (data.${property.name} !== undefined) {\n`;

  if (property.type === PropertyType.TEXT) {
    propertyCode += `values.push({ name: "${property.name}", textValue: data.${property.name} });`;
  } else if (property.type === PropertyType.NUMBER) {
    propertyCode += `values.push({ name: "${property.name}", numberValue: data.${property.name} });`;
  } else if (property.type === PropertyType.DATE) {
    propertyCode += `values.push({ name: "${property.name}", dateValue: data.${property.name} });`;
  } else if (property.type === PropertyType.SELECT) {
    propertyCode += `values.push({ name: "${property.name}", textValue: data.${property.name} });`;
  } else if (property.type === PropertyType.BOOLEAN) {
    propertyCode += `values.push({ name: "${property.name}", booleanValue: data.${property.name} });`;
  } else if (property.type === PropertyType.MEDIA) {
    if (PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1) {
      propertyCode += `values.push({ name: "${property.name}", media: data.${property.name} ? [data.${property.name} as RowMedia] : [] });`;
    } else {
      propertyCode += `values.push({ name: "${property.name}", media: data.${property.name} ? data.${property.name} as RowMedia[] : [] });`;
    }
  } else if (property.type === PropertyType.MULTI_SELECT) {
    propertyCode += `values.push({ name: "${property.name}", multiple: data.${property.name} });`;
  } else if (property.type === PropertyType.RANGE_NUMBER) {
    propertyCode += `values.push({ name: "${property.name}", range: data.${property.name} });`;
  } else if (property.type === PropertyType.RANGE_DATE) {
    propertyCode += `values.push({ name: "${property.name}", range: data.${property.name} });`;
  } else if (property.type === PropertyType.MULTI_TEXT) {
    propertyCode += `values.push({ name: "${property.name}", multiple: data.${property.name} });`;
  }

  propertyCode = propertyCode + `\n}`;

  code.push(propertyCode);
}

function getColor(color: number) {
  return "Colors." + Colors[color];
}

// Helper: Build base props for form inputs
function buildBaseProps(property: PropertyWithDetails, index: number): string[] {
  const props: string[] = [];
  if (property.isRequired) props.push(`required`);
  if (index === 0) props.push(`autoFocus`);
  props.push("disabled={isDisabled()}");
  return props;
}

// Helper: Generate UI form code for TEXT property
function uiFormText(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  const min = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Min) ?? 0;
  const max = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) ?? 0;
  const defaultValue = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.DefaultValue);
  const value = defaultValue ? `item?.${property.name} ?? (!item ? "${defaultValue}" : undefined)` : `item?.${property.name}`;
  props.push(`defaultValue={${value}}`);

  const placeholder = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.Placeholder);
  if (placeholder) props.push(`placeholder="${placeholder}"`);
  if (min > 0) props.push(`minLength={${min}}`);
  if (max > 0) props.push(`maxLength={${max}}`);

  const rows = property.attributes.find((f) => f.name === PropertyAttributeName.Rows);
  if (rows) props.push(`rows={${PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Rows)}}`);

  const pattern = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.Pattern);
  if (pattern) props.push(`pattern="${pattern}"`);

  const editor = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.Editor);
  if (editor === "monaco") {
    props.push(`editor="monaco" editorLanguage="markdown"`);
  } else if (editor === "wysiwyg") {
    props.push(`editor="wysiwyg" autoFocus={false}`);
  }

  if (!property.subtype || property.subtype === "singleLine") {
    imports.push(`import InputText from "~/components/ui/input/InputText";`);
    code.push(`<InputText name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
  } else {
    imports.push(`import InputTextSubtype from "~/components/ui/input/subtypes/InputTextSubtype";`);
    code.push(`<InputTextSubtype subtype="${property.subtype}" name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
  }
}

// Helper: Generate UI form code for other property types (extracted to reduce complexity)
function uiFormOtherTypes(code: string[], imports: string[], property: PropertyWithDetails, props: string[], index: number) {
  const min = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Min) ?? 0;
  const max = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) ?? 0;

  const typeHandlers: Record<PropertyType, () => void> = {
    [PropertyType.NUMBER]: () => uiFormNumber(code, imports, property, props, min, max),
    [PropertyType.DATE]: () => uiFormDate(code, imports, property, props),
    [PropertyType.SELECT]: () => uiFormSelect(code, imports, property, props),
    [PropertyType.BOOLEAN]: () => uiFormBoolean(code, imports, property, props),
    [PropertyType.MEDIA]: () => uiFormMedia(code, imports, property, props, min, max),
    [PropertyType.MULTI_SELECT]: () => uiFormMultiType(code, imports, property, props),
    [PropertyType.MULTI_TEXT]: () => uiFormMultiType(code, imports, property, props),
    [PropertyType.RANGE_NUMBER]: () => uiFormRange(code, imports, property, props),
    [PropertyType.RANGE_DATE]: () => uiFormRange(code, imports, property, props),
  } as Record<PropertyType, () => void>;

  const handler = typeHandlers[property.type];
  if (handler) {
    handler();
  } else {
    code.push(`/* TODO: ${property.name} (${PropertyType[property.type]}) */`);
  }
}

// Helper: Handle NUMBER type
function uiFormNumber(code: string[], imports: string[], property: PropertyWithDetails, props: string[], min: number, max: number) {
  imports.push(`import InputNumber from "~/components/ui/input/InputNumber";`);
  const defaultValue = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.DefaultValue);
  const value = defaultValue ? `item?.${property.name} ?? (!item ? ${defaultValue} : undefined)` : `item?.${property.name}`;
  props.push(`defaultValue={${value}}`);
  if (min > 0) props.push(`min={${min}}`);
  if (max > 0) props.push(`max={${max}}`);
  const step = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Step);
  if (step) props.push(`step="${step}"`);
  code.push(`<InputNumber name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
}

// Helper: Handle DATE type
function uiFormDate(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  imports.push(`import InputDate from "~/components/ui/input/InputDate";`);
  code.push(`<InputDate name="${property.name}" title={t("${property.title}")} defaultValue={item?.${property.name}} ${props.join(" ")} />`);
}

// Separate handlers for complex types
function uiFormSelect(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  const defaultValue = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.DefaultValue);
  const value = defaultValue ? `item?.${property.name} ?? (!item ? "${defaultValue}" : undefined)` : `item?.${property.name}`;
  props.push(`defaultValue={${value}}`);
  const withColors = property.options.some((f) => f.color);
  imports.push(`import { Colors } from "~/application/enums/shared/Colors";`);
  props.push(`options={[${property.options.map((option) => {
    const optionName = option.name === null ? `"${option.value}"` : `"${option.name}"`;
    const optionValue = option.value;
    const colorValue = getColor(option.color);
    return `{ name: ${optionName}, value: "${optionValue}", color: ${colorValue} }`;
  })}]}`);

  if (!property.subtype || property.subtype === "dropdown") {
    props.push(`withColors={${withColors ? "true" : "false"}}`);
    imports.push(`import InputSelect from "~/components/ui/input/InputSelect";`);
    code.push(`<InputSelect name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
  } else if (property.subtype === "radioGroupCards") {
    imports.push(`import InputRadioGroupCards from "~/components/ui/input/InputRadioGroupCards";`);
    code.push(`<InputRadioGroupCards name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
  }
}

function uiFormBoolean(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  imports.push(`import InputCheckbox from "~/components/ui/input/InputCheckbox";`);
  const defaultValue = PropertyAttributeHelper.getPropertyAttributeValue_Boolean(property, PropertyAttributeName.DefaultValue);
  const value = defaultValue ? `item?.${property.name} ?? (!item ? ${defaultValue} : undefined)` : `item?.${property.name}`;
  props.push(`value={${value}}`);
  code.push(`<InputCheckbox name="${property.name}" title={t("${property.title}")} asToggle ${props.join(" ")} />`);
}

function uiFormMedia(code: string[], imports: string[], property: PropertyWithDetails, props: string[], min: number, max: number) {
  imports.push(`import InputMedia from "~/components/ui/input/InputMedia";`);
  if (PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1) {
    props.push(`initialMedia={item?.${property.name} ? [item?.${property.name}] : []}`);
  } else {
    props.push(`initialMedia={item?.${property.name}}`);
  }
  const acceptFileTypes = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.AcceptFileTypes);
  if (min > 0) props.push(`min={${min}}`);
  if (max > 0) props.push(`max={${max}}`);
  if (acceptFileTypes) props.push(`accept="${acceptFileTypes}"`);
  const maxSize = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.MaxSize) ?? 0;
  if (maxSize > 0) props.push(`maxSize={${maxSize}}`);
  code.push(`<InputMedia name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
}

function uiFormMultiType(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  if (property.type === PropertyType.MULTI_SELECT) {
    props.push(`value={item?.${property.name}}`);
    imports.push(`import { Colors } from "~/application/enums/shared/Colors";`);
    props.push(`options={[${property.options.map((option) => {
      const optionName = option.name === null ? `"${option.value}"` : `"${option.name}"`;
      const optionValue = option.value;
      const colorValue = getColor(option.color);
      return `{ name: ${optionName}, value: "${optionValue}", color: ${colorValue} }`;
    })}]}`);
    imports.push(`import PropertyMultiSelector from "~/components/entities/properties/PropertyMultiSelector";`);
    if (!property.subtype || property.subtype === "combobox") {
      code.push(`<PropertyMultiSelector name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
    } else if (property.subtype === "checkboxCards") {
      code.push(`<PropertyMultiSelector subtype="checkboxCards" name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
    }
  } else if (property.type === PropertyType.MULTI_TEXT) {
    imports.push(`import InputMultiText from "~/components/ui/input/InputMultiText";`);
    const separator = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.Separator);
    if (separator) props.push(`separator="${separator}"`);
    props.push(`value={item?.${property.name}}`);
    code.push(`<InputMultiText name="${property.name}" title={t("${property.title}")} ${props.join(" ")} />`);
  }
}

function uiFormRange(code: string[], imports: string[], property: PropertyWithDetails, props: string[]) {
  if (property.type === PropertyType.RANGE_NUMBER) {
    imports.push(`import InputRangeNumber from "~/components/ui/input/ranges/InputRangeNumber";`);
    code.push(`<InputRangeNumber name="${property.name}" title={t("${property.title}")} ${props.join(" ")} defaultValueMin={item?.${property.name}?.numberMin ? Number(item.${property.name}.numberMin) : undefined} defaultValueMax={item?.${property.name}?.numberMax ? Number(item.${property.name}.numberMax) : undefined} />`);
  } else if (property.type === PropertyType.RANGE_DATE) {
    imports.push(`import InputRangeDate from "~/components/ui/input/ranges/InputRangeDate";`);
    code.push(`<InputRangeDate name="${property.name}" title={t("${property.title}")} ${props.join(" ")} defaultValueMin={item?.${property.name}?.dateMin} defaultValueMax={item?.${property.name}?.dateMax} />`);
  }
}

function uiForm({ code, imports, property, index }: { code: string[]; imports: string[]; property: PropertyWithDetails; index: number }) {
  if (!property.showInCreate) {
    code.push(`{item && (`);
  }

  const props = buildBaseProps(property, index);

  if (property.type === PropertyType.TEXT) {
    uiFormText(code, imports, property, props);
  } else {
    uiFormOtherTypes(code, imports, property, props, index);
  }

  if (!property.showInCreate) {
    // render if row exists only
    code.push(`)}`);
  }
}

function uiCell({ code, imports, property }: { code: string[]; imports: string[]; property: PropertyWithDetails }) {
  const props: string[] = [];

  if (property.type === PropertyType.TEXT) {
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <div className="max-w-sm truncate">{item.${property.name}}</div>,
          },`);
  } else if (property.type === PropertyType.NUMBER) {
    imports.push(`import RowNumberCell from "~/components/entities/rows/cells/RowNumberCell";`);
    const format = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.FormatNumber);
    if (format) {
      props.push(`format="${format}"`);
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowNumberCell value={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.DATE) {
    imports.push(`import RowDateCell from "~/components/entities/rows/cells/RowDateCell";`);
    const format = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.FormatDate);
    if (format) {
      props.push(`format="${format}"`);
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowDateCell value={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.SELECT) {
    imports.push(
      `import RowSelectedOptionCell from "~/components/entities/rows/cells/RowSelectedOptionCell";`,
      `import { Colors } from "~/application/enums/shared/Colors";`
    );
    const optionName = (option: { name: string | null; value: string }) => option.name === null ? "null" : `"${option.name}"`;
    const optionValue = (option: { value: string }) => option.value;
    const optionsStr = property.options.map((option) => `{ name: ${optionName(option)}, value: "${optionValue(option)}", color: ${getColor(option.color)} }`).join(", ");
    props.push(`options={[${optionsStr}]}`);
    let display: SelectOptionsDisplay = "Value";
    const formatAttr = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.SelectOptions);
    if (formatAttr) {
      display = formatAttr as SelectOptionsDisplay;
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowSelectedOptionCell value={item?.${property.name}} display="${display}" ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.BOOLEAN) {
    imports.push(`import RowBooleanCell from "~/components/entities/rows/cells/RowBooleanCell";`);
    const format = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.FormatBoolean);
    if (format) {
      props.push(`format="${format}"`);
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowBooleanCell value={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.MEDIA) {
    imports.push(`import RowMediaCell from "~/components/entities/rows/cells/RowMediaCell";`);
    if (PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Max) === 1) {
      code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowMediaCell media={item.${property.name} ? [item.${property.name}] : []} ${props.join(" ")} />,
          },`);
    } else {
      code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowMediaCell media={item.${property.name}} ${props.join(" ")} />,
          },`);
    }
  } else if (property.type === PropertyType.MULTI_SELECT || property.type === PropertyType.MULTI_TEXT) {
    imports.push(`import PropertyMultipleValueBadge from "~/components/entities/properties/PropertyMultipleValueBadge";`);
    const optionName = (option: { name: string | null; value: string }) => option.name === null ? "null" : `"${option.name}"`;
    const optionValue = (option: { value: string }) => option.value;
    const optionsStr = property.options.map((option) => `{ name: ${optionName(option)}, value: "${optionValue(option)}" }`).join(", ");
    props.push(`options={[${optionsStr}]}`);
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <PropertyMultipleValueBadge values={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.RANGE_NUMBER) {
    imports.push(`import RowRangeNumberCell from "~/components/entities/rows/cells/RowRangeNumberCell";`);
    const format = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.FormatNumber);
    if (format) {
      props.push(`format="${format}"`);
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowRangeNumberCell value={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else if (property.type === PropertyType.RANGE_DATE) {
    imports.push(`import RowRangeDateCell from "~/components/entities/rows/cells/RowRangeDateCell";`);
    const format = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.FormatDate);
    if (format) {
      props.push(`format="${format}"`);
    }
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <RowRangeDateCell value={item.${property.name}} ${props.join(" ")} />,
          },`);
  } else {
    code.push(`{
            name: "${property.name}",
            title: t("${property.title}"),
            value: (item) => <div> /* TODO: ${property.name} (${PropertyType[property.type]}) */</div>,
          },`);
  }
}

function getSchemaType(propertyType: PropertyType): string {
  const typeMap: Record<number, string> = {
    [PropertyType.TEXT]: "String",
    [PropertyType.SELECT]: "String",
    [PropertyType.NUMBER]: "Decimal",
    [PropertyType.DATE]: "DateTime",
    [PropertyType.BOOLEAN]: "Boolean",
  };
  return typeMap[propertyType] || "TODO";
}

function schema({ code, property }: { code: string[]; property: PropertyWithDetails }) {
  const schemaType = getSchemaType(property.type);
  const nullable = property.isRequired ? "" : "?";
  code.push(`  ${property.name} ${schemaType}${nullable}`);
}

export default {
  type,
  rowToDto,
  formToDto,
  createDtoToRow,
  updateDtoToRow,
  uiForm,
  uiCell,
  schema,
};

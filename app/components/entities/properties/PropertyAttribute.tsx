import { useTranslation } from "react-i18next";
import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import InputNumber from "~/components/ui/input/InputNumber";
import InputSelector from "~/components/ui/input/InputSelector";
import InputText from "~/components/ui/input/InputText";
import PropertyAttributeHelper from "~/utils/helpers/PropertyAttributeHelper";

interface Props {
  readonly name: PropertyAttributeName;
  readonly title: string;
  readonly value: string | undefined;
  readonly setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  readonly className?: string;
}

function getInputType(name: PropertyAttributeName) {
  const isNumberAttr = [
    PropertyAttributeName.Min,
    PropertyAttributeName.Max,
    PropertyAttributeName.MaxSize,
    PropertyAttributeName.Rows,
    PropertyAttributeName.Columns,
  ].includes(name);

  if (isNumberAttr) return 'number';

  const isBooleanAttr = [
    PropertyAttributeName.Uppercase,
    PropertyAttributeName.Lowercase,
    PropertyAttributeName.Password
  ].includes(name);

  if (isBooleanAttr) return 'boolean';

  const isSelectorAttr = PropertyAttributeHelper.getPropertyAttributeOptions(name).length > 0;

  if (isSelectorAttr) return 'selector';

  return 'text';
}

export default function PropertyAttribute({ name, title, value, setValue, className }: Props) {
  const { t } = useTranslation();

  const inputType = getInputType(name);

  const getPlaceholder = () => {
    if (name === PropertyAttributeName.Step) {
      return "0.01";
    }
    return "";
  };

  const getDescription = () => {
    if (name === PropertyAttributeName.Uppercase) {
      return "Force text to be uppercase";
    }
    if (name === PropertyAttributeName.Lowercase) {
      return "Force text to be lowercase";
    }
    return "";
  };

  const removeButton = value ? (
    <button type="button" onClick={() => setValue("")} className="text-muted-foreground text-xs hover:text-red-500">
      {t("shared.remove")}
    </button>
  ) : null;

  if (inputType === 'number') {
    return (
      <InputNumber
        className={className}
        name={name}
        title={title}
        value={Number(value)}
        setValue={(e) => setValue(e?.toString())}
        max={name === PropertyAttributeName.Columns ? 12 : undefined}
        hint={removeButton}
      />
    );
  }

  if (inputType === 'boolean') {
    return (
      <InputCheckboxWithDescription
        className={className}
        description={getDescription()}
        name={name}
        title={title}
        value={value === "true"}
        setValue={(e) => setValue(e ? "true" : "false")}
      />
    );
  }

  if (inputType === 'selector') {
    return (
      <InputSelector
        className={className}
        withSearch={false}
        name={name}
        title={title}
        value={value}
        setValue={(e) => setValue(e?.toString())}
        options={PropertyAttributeHelper.getPropertyAttributeOptions(name)}
        hint={removeButton}
      />
    );
  }

  return (
    <InputText
      className={className}
      name={name}
      title={title}
      value={value}
      setValue={(e) => setValue(e.toString())}
      placeholder={getPlaceholder()}
      hint={removeButton}
    />
  );
}

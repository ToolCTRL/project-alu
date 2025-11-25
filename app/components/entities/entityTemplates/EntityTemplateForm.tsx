import { EntityTemplate } from "@prisma/client";
import { useSubmit } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import FormGroup from "~/components/ui/forms/FormGroup";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputDate from "~/components/ui/input/InputDate";
import InputNumber from "~/components/ui/input/InputNumber";
import InputSelector from "~/components/ui/input/InputSelector";
import InputText from "~/components/ui/input/InputText";
import { EntityWithDetails, PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import PropertyAttributeHelper from "~/utils/helpers/PropertyAttributeHelper";
import NovelEditor from "~/modules/novel/ui/editor";

interface Props {
  entity: EntityWithDetails;
  item?: EntityTemplate;
}

function renderTextProperty(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  updateConfig: (value: any) => void,
  t: (key: string) => string
) {
  const isWysiwyg = PropertyAttributeHelper.getPropertyAttributeValue_String(property, PropertyAttributeName.Editor) === "wysiwyg";
  if (isWysiwyg) {
    return (
      <div className="h-52 overflow-y-auto">
        <div>
          <label htmlFor={property.name} className="text-muted-foreground mb-1 block text-xs font-medium">
            {t(property.title)}
          </label>
          <NovelEditor autoFocus={false} content={config[property.name]} onChange={(e) => updateConfig(e.html)} />
        </div>
      </div>
    );
  }
  return <InputText name={property.name} title={t(property.title)} value={config[property.name]} setValue={updateConfig} />;
}

function renderBooleanProperty(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  updateConfig: (value: any) => void,
  t: (key: string) => string
) {
  let boolValue = config[property.name];
  if (config[property.name] === "false") {
    boolValue = false;
  } else if (config[property.name] === "true") {
    boolValue = true;
  }
  return <InputCheckbox name={property.name} title={t(property.title)} value={boolValue} setValue={updateConfig} />;
}

function renderDateProperty(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  updateConfig: (value: any) => void,
  t: (key: string) => string
) {
  return <InputDate name={property.name} title={t(property.title)} value={config[property.name]} onChange={updateConfig} />;
}

function renderNumberProperty(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  updateConfig: (value: any) => void,
  t: (key: string) => string
) {
  return <InputNumber name={property.name} title={t(property.title)} value={config[property.name]} setValue={updateConfig} />;
}

function renderSelectProperty(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  updateConfig: (value: any) => void,
  t: (key: string) => string
) {
  return <InputSelector name={property.name} title={t(property.title)} value={config[property.name]} setValue={updateConfig} options={property.options} />;
}

function renderPropertyInput(
  property: PropertyWithDetails,
  config: { [key: string]: any },
  setConfig: (config: { [key: string]: any }) => void,
  t: (key: string) => string
) {
  const updateConfig = (value: any) => setConfig({ ...config, [property.name]: value });

  if (property.type === PropertyType.TEXT) {
    return renderTextProperty(property, config, updateConfig, t);
  }

  if (property.type === PropertyType.BOOLEAN) {
    return renderBooleanProperty(property, config, updateConfig, t);
  }

  if (property.type === PropertyType.DATE) {
    return renderDateProperty(property, config, updateConfig, t);
  }

  if (property.type === PropertyType.NUMBER) {
    return renderNumberProperty(property, config, updateConfig, t);
  }

  if (property.type === PropertyType.SELECT) {
    return renderSelectProperty(property, config, updateConfig, t);
  }

  return <div>Property type not supported for template values: {PropertyType[property.type]}</div>;
}

export default function EntityTemplateForm({ entity, item }: Props) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const [title, setTitle] = useState<string>(item?.title ?? "");
  const [config, setConfig] = useState<{ [key: string]: any }>(item?.config ? JSON.parse(item?.config) : {});

  function onSubmit(formData: FormData) {
    formData.set("config", JSON.stringify(config));
    submit(formData, {
      method: "post",
    });
  }
  return (
    <FormGroup onSubmit={onSubmit} id={item?.id} editing={true}>
      <InputText name="title" title="Title" value={title} setValue={setTitle} required />
      {entity.properties
        .filter((f) => !f.isDefault)
        .sort((a, b) => a.order - b.order)
        .map((property) => (
          <div key={property.name}>{renderPropertyInput(property, config, setConfig, t)}</div>
        ))}
    </FormGroup>
  );
}

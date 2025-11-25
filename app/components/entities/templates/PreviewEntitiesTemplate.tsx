import { useTranslation } from "react-i18next";
import TableSimple from "~/components/ui/tables/TableSimple";
import { EntitiesTemplateDto, TemplateEntityDto } from "~/modules/templates/EntityTemplateDto";

function findParentRelationships(template: EntitiesTemplateDto, item: TemplateEntityDto) {
  return template.relationships.filter((f) => f.parent === item.name) ?? [];
}

function findChildRelationships(template: EntitiesTemplateDto, item: TemplateEntityDto) {
  return template.relationships.filter((f) => f.child === item.name) ?? [];
}

function NameCell(item: TemplateEntityDto) {
  return (
    <div className="flex items-baseline space-x-1">
      <div>{item.name}</div>
      <div className="text-xs italic">({item.slug})</div>
    </div>
  );
}

function TitleCell({ item, t }: { item: TemplateEntityDto; t: (key: string) => string }) {
  return (
    <div className="flex items-baseline space-x-1">
      <div>{t(item.title)}</div>
      <div className="text-xs italic">({t(item.titlePlural)})</div>
    </div>
  );
}

function ViewsCell(item: TemplateEntityDto) {
  return <div>{item.views?.map((i) => i.title + (i.isDefault ? " (default)" : "")).join(", ")}</div>;
}

export default function PreviewEntitiesTemplate({ template }: Readonly<{ template: EntitiesTemplateDto }>) {
  const { t } = useTranslation();
  return (
    <TableSimple
      items={template.entities}
      headers={[
        { name: "prefix", title: "Prefix", value: (i) => i.prefix },
        {
          name: "name",
          title: "Name",
          value: (i) => <NameCell {...i} />,
        },
        {
          name: "title",
          title: "Title",
          value: (i) => <TitleCell item={i} t={t} />,
        },
        {
          name: "properties",
          title: "Properties",
          value: (i) => i.properties.map((i) => `${i.title}${i.isRequired ? "*" : ""} [${i.type}]`).join(", "),
          className: "text-xs",
        },
        {
          name: "parents",
          title: "Parents",
          value: (item) =>
            findChildRelationships(template, item)
              .map((i) => i.parent)
              .join(", "),
          className: "text-xs",
        },
        {
          name: "children",
          title: "Children",
          value: (item) =>
            findParentRelationships(template, item)
              .map((i) => i.child)
              .join(", "),
          className: "text-xs",
        },
        {
          name: "views",
          title: "Views",
          value: (item) => <ViewsCell {...item} />,
        },
      ]}
    />
  );
}

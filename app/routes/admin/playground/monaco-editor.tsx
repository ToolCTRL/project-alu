import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MonacoEditor, { MonacoAutoCompletion } from "~/components/editors/MonacoEditor";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  allEntities: EntityWithDetails[];
};

function getPropertyAutocompletions(entity: EntityWithDetails, t: (key: string) => string) {
  const sortedProperties = entity.properties.filter((f) => !f.isDefault).sort((a, b) => a.order - b.order);
  return sortedProperties.map<MonacoAutoCompletion>((property) => {
    const label = `row.${entity.name}.${property.name}`;
    return {
      label,
      kind: "Value",
      documentation: t(property.title),
      insertText: `{{${label}}}`,
    };
  });
}

function getChildAutocompletions(entity: EntityWithDetails, allEntities: EntityWithDetails[], t: (key: string) => string) {
  const completions: MonacoAutoCompletion[] = [];
  entity.childEntities.forEach((child) => {
    const childEntity = allEntities.find((f) => f.id === child.childId);
    if (!childEntity) {
      return;
    }

    const sortedChildProperties = childEntity.properties.filter((f) => !f.isDefault).sort((a, b) => a.order - b.order);
    sortedChildProperties.forEach((property) => {
      const label = `row.${entity.name}.${childEntity.name}.${property.name}`;
      completions.push({
        label,
        kind: "Value",
        documentation: t(property.title),
        insertText: `{{${label}}}`,
      });
    });
  });
  return completions;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const allEntities = await getAllEntities({ tenantId: null, active: true });
  const data: LoaderData = {
    allEntities,
  };
  return data;
};

export default function PlaygroundMonacoEditorRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  const [value, setValue] = useState("");
  const [autocompletions, setAutocompletions] = useState<MonacoAutoCompletion[]>([]);

  useEffect(() => {
    const sortedEntities = [...data.allEntities].sort((a, b) => a.order - b.order);
    const completions = sortedEntities.flatMap((entity) => [
      ...getPropertyAutocompletions(entity, t),
      ...getChildAutocompletions(entity, data.allEntities, t),
    ]);

    setAutocompletions(completions);
  }, [data.allEntities, t]);

  return (
    <div className="h-[calc(100vh-100px)]">
      <MonacoEditor theme="vs-dark" fontSize={15} value={value} onChange={(e) => setValue(e)} autocompletions={autocompletions} />
    </div>
  );
}

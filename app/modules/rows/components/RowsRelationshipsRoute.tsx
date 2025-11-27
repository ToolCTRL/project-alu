import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Kanban from "~/components/ui/lists/Kanban";
import UnderConstruction from "~/components/ui/misc/UnderConstruction";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import RowHelper from "~/utils/helpers/RowHelper";
import { Rows_Relationships } from "../routes/Rows_Relationships.server";
import { useLoaderData } from "react-router";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";

export default function RowsRelationshipsRoute() {
  const data = useLoaderData<Rows_Relationships.LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="flex overflow-hidden overflow-x-auto">
        {data.entitiesData.map((entityData) => (
          <EntityRowsRelationships className="w-64" key={entityData.rowsData.entity.id} data={entityData.rowsData} />
        ))}
      </div>
      <UnderConstruction title="TODO: Relationship Views" description="Use case: Click Company to view its Contacts or Opportunities" />
    </div>
  );
}

function EntityRowCard({ entity, item, t }: { entity: EntityWithDetails; item: RowWithDetails; t: (key: string) => string }) {
  return (
    <div className="hover:bg-secondary border-border bg-background group w-full truncate rounded-md border p-3 text-left shadow-2xs">
      <div className="flex items-center justify-between space-x-2">
        <button className="grow truncate text-left" type="button">
          <div>{RowHelper.getTextDescription({ entity, item, t })}</div>
        </button>
      </div>
    </div>
  );
}

function EntityRowsRelationships({ data, className }: Readonly<{ data: RowsApi.GetRowsData; className?: string }>) {
  const { t } = useTranslation();
  return (
    <div className={clsx(className)}>
      {data?.entity && (
        <Kanban
          columns={[
            {
              name: "entity",
              title: t(data?.entity.titlePlural ?? ""),
              items: data?.items ?? [],
              card: (item) => <EntityRowCard entity={data.entity!} item={item} t={t} />,
            },
          ]}
        />
      )}
    </div>
  );
}

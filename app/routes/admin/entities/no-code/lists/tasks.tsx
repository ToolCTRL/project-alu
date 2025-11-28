import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { RowTaskWithDetails } from "~/utils/db/entities/rowTasks.db.server";
import RowHelper from "~/utils/helpers/RowHelper";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { getUserInfo } from "~/utils/session.server";
import DateUtils from "~/utils/shared/DateUtils";

type LoaderData = {
  tasks: RowTaskWithDetails[];
  allEntities: EntityWithDetails[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdOrNull({ request, params });
  const userInfo = await getUserInfo(request);

  const tasks = await RowsApi.getTasks({
    assignedOrCreatedUserId: userInfo.userId,
  });
  const data: LoaderData = {
    tasks,
    allEntities: await getAllEntities({ tenantId, active: true }),
  };
  return data;
};

const TaskRowComponent = ({ allEntities, task }: { allEntities: EntityWithDetails[]; task: RowTaskWithDetails }) => {
  const { t } = useTranslation();
  const [entity] = useState(allEntities.find((f) => f.id === task.row.entityId));
  return <div>{entity && RowHelper.getTextDescription({ entity, item: task.row, t })}</div>;
};

const TaskTitleCell = ({ task }: { task: RowTaskWithDetails }) => <div className="w-full">{task.title}</div>;

const TaskCompletedCell = ({ task }: { task: RowTaskWithDetails }) => (
  <div>{task.completed ? <CheckIcon className="text-muted-foreground h-4 w-4" /> : <XIcon className="text-muted-foreground h-4 w-4" />}</div>
);

const buildHeaders = (t: ReturnType<typeof useTranslation>["t"], allEntities: EntityWithDetails[]) =>
  [
    {
      name: "row",
      title: t("models.row.object"),
      value: (i: RowTaskWithDetails) => <TaskRowComponent allEntities={allEntities} task={i} />,
    },
    {
      name: "task",
      title: t("models.rowTask.object"),
      value: (i: RowTaskWithDetails) => <TaskTitleCell task={i} />,
      className: "w-full",
    },
    {
      name: "completed",
      title: t("models.rowTask.completed"),
      value: (i: RowTaskWithDetails) => <TaskCompletedCell task={i} />,
    },
    {
      name: "createdAt",
      title: t("shared.createdAt"),
      value: (item: RowTaskWithDetails) => DateUtils.dateAgo(item.createdAt),
      className: "text-muted-foreground text-xs",
      breakpoint: "sm",
      sortable: true,
    },
  ] as const;

export default function TasksRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <div className="space-y-5 p-8">
      <div className="flex items-center justify-between space-x-2">
        <h3 className="text-foreground grow text-lg font-medium leading-6">{t("models.rowTask.plural")}</h3>
      </div>
      <TableSimple
        items={data.tasks}
        headers={buildHeaders(t, data.allEntities)}
      />
    </div>
  );
}

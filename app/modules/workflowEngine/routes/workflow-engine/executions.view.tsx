import { Link, useLoaderData, useNavigation, useParams, useSubmit } from "react-router";
import { useRef } from "react";
import TenantBadge from "~/components/core/tenants/TenantBadge";
import DateCell from "~/components/ui/dates/DateCell";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TableSimple from "~/components/ui/tables/TableSimple";
import WorkflowResultBadge from "~/modules/workflowEngine/components/executions/WorkflowResultBadge";
import { WorkflowExecutionWithDetails } from "~/modules/workflowEngine/db/workflowExecutions.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import DateUtils from "~/utils/shared/DateUtils";
import { WorkflowsExecutionsApi } from "./executions.api.server";
import { useTranslation } from "react-i18next";

function ExecutionTypeCell({ type }: { readonly type: string }) {
  return <div>{type}</div>;
}

function ExecutionStatusCell({ execution }: { readonly execution: WorkflowExecutionWithDetails }) {
  return (
    <div className="flex max-w-xs flex-col truncate">
      <WorkflowResultBadge
        createdAt={execution.createdAt}
        startedAt={execution.createdAt}
        completedAt={execution.endedAt}
        status={execution.status}
        error={execution.error}
      />
    </div>
  );
}

function ExecutionTenantCell({ tenant }: { readonly tenant: WorkflowExecutionWithDetails["tenant"] }) {
  return tenant ? <TenantBadge item={tenant} /> : <span className="text-muted-foreground italic">Admin</span>;
}

function ExecutionDurationCell({ createdAt, endedAt }: { readonly createdAt: Date; readonly endedAt: Date | null }) {
  return <>{DateUtils.getDurationInSeconds({ start: createdAt, end: endedAt })}</>;
}

function ExecutionBlockRunsCell({ count }: { readonly count: number }) {
  return <div>{count === 1 ? <span>1 block run</span> : <span>{count} block runs</span>}</div>;
}

function ExecutionCreatedAtCell({ date }: { readonly date: Date }) {
  return <DateCell date={date} />;
}

function ExecutionEndedAtCell({ date }: { readonly date: Date | null }) {
  return <DateCell date={date} />;
}

function ExecutionWorkflowCell({ execution, params }: { readonly execution: WorkflowExecutionWithDetails; readonly params: any }) {
  return (
    <Link className="truncate font-medium hover:underline" to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${execution.workflow.id}`)}>
      {execution.workflow.name}
    </Link>
  );
}

const renderExecutionTypeCell = (i: WorkflowExecutionWithDetails) => <ExecutionTypeCell type={i.type} />;
const renderExecutionStatusCell = (i: WorkflowExecutionWithDetails) => <ExecutionStatusCell execution={i} />;
const renderExecutionTenantCell = (i: WorkflowExecutionWithDetails) => <ExecutionTenantCell tenant={i.tenant} />;
const renderExecutionDurationCell = (i: WorkflowExecutionWithDetails) => <ExecutionDurationCell createdAt={i.createdAt} endedAt={i.endedAt} />;
const renderExecutionBlockRunsCell = (i: WorkflowExecutionWithDetails) => <ExecutionBlockRunsCell count={i.blockRuns.length} />;
const renderExecutionCreatedAtCell = (i: WorkflowExecutionWithDetails) => <ExecutionCreatedAtCell date={i.createdAt} />;
const renderExecutionEndedAtCell = (i: WorkflowExecutionWithDetails) => <ExecutionEndedAtCell date={i.endedAt} />;
const renderExecutionWorkflowCell = (params: any) => (i: WorkflowExecutionWithDetails) => <ExecutionWorkflowCell execution={i} params={params} />;

const makeExecutionHeaders = (params: any, tenantTitle: string) => [
  {
    name: "type",
    title: "Type",
    value: renderExecutionTypeCell,
  },
  {
    name: "status",
    title: "Status",
    value: renderExecutionStatusCell,
  },
  {
    name: "tenant",
    title: tenantTitle,
    value: renderExecutionTenantCell,
  },
  {
    name: "duration",
    title: "Duration",
    value: renderExecutionDurationCell,
  },
  {
    name: "blockRuns",
    title: "Block runs",
    value: renderExecutionBlockRunsCell,
  },
  {
    name: "createdAt",
    title: "Created at",
    value: renderExecutionCreatedAtCell,
  },
  {
    name: "endedAt",
    title: "Ended at",
    value: renderExecutionEndedAtCell,
  },
  {
    name: "workflow",
    title: "Workflow",
    value: renderExecutionWorkflowCell(params),
  },
];

export default function WorkflowsExecutionsView() {
  const { t } = useTranslation();
  const data = useLoaderData<WorkflowsExecutionsApi.LoaderData>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const params = useParams();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete(item: WorkflowExecutionWithDetails) {
    confirmDelete.current?.setValue(item);
    confirmDelete.current?.show("Delete execution?", "Delete", "Cancel", `Are you sure you want to delete this execution?`);
  }
  function onDeleteConfirm(item: WorkflowExecutionWithDetails) {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title={`Workflow Executions`}
      withHome={false}
      buttons={
        <InputFilters filters={data.filterableProperties} />
      }
    >
        <TableSimple
          items={data.items}
          actions={[
            {
            title: "Delete",
            onClick: (_idx, i) => (onDelete ? onDelete(i) : undefined),
            destructive: true,
            disabled: (i) => navigation.state === "submitting" && navigation.formData?.get("id") === i.id,
            hidden: () => !!params.tenant,
          },
          {
            title: "Details",
            onClickRoute: (_idx, i) => UrlUtils.getModulePath(params, `workflow-engine/workflows/${i.workflowId}/executions?executionId=${i.id}`),
            firstColumn: true,
          },
          ]}
          headers={makeExecutionHeaders(params, t("models.tenant.object"))}
        />
        <ConfirmModal ref={confirmDelete} onYes={onDeleteConfirm} destructive />
      </EditPageLayout>
    );
  }

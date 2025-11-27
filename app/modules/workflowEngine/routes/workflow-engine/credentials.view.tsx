import { WorkflowCredential } from "@prisma/client";
import { MetaFunction, useLoaderData, Outlet, useSubmit } from "react-router";
import { useRef } from "react";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import DateCell from "~/components/ui/dates/DateCell";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TableSimple from "~/components/ui/tables/TableSimple";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";

const renderCredentialNameCell = (item: WorkflowCredential) => <CredentialNameCell name={item.name} />;
const renderCredentialValueCell = () => <CredentialValueCell />;
const renderCredentialDateCell = (item: WorkflowCredential) => <CredentialDateCell date={item.createdAt} />;

const credentialHeaders = [
  {
    title: "Name",
    name: "name",
    value: renderCredentialNameCell,
  },
  {
    title: "Value",
    name: "value",
    className: "w-full",
    value: renderCredentialValueCell,
  },
  {
    title: "Created At",
    name: "createdAt",
    value: renderCredentialDateCell,
  },
];
import { WorkflowsCredentialsApi } from "./credentials.api.server";

export const meta: MetaFunction = () => [{ title: "Workflow Credentials" }];

function CredentialNameCell({ name }: { readonly name: string }) {
  return <div className="select-all">{`{{$credentials.${name}}}`}</div>;
}

function CredentialValueCell() {
  return <div className="max-w-sm truncate">{"".padEnd(36, "*")}</div>;
}

function CredentialDateCell({ date }: { readonly date: Date }) {
  return <DateCell date={date} />;
}

export default function WorkflowsCredentialsView() {
  const data = useLoaderData<WorkflowsCredentialsApi.LoaderData>();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete(item: WorkflowCredential) {
    confirmDelete.current?.setValue(item);
    confirmDelete.current?.show("Are you sure you want to delete this workflow?", "Delete", "No", "All blocks and executions will be deleted.");
  }
  function onDeleteConfirm(item: WorkflowDto) {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", item.id.toString() ?? "");
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title="Credentials"
      buttons={
        <ButtonPrimary to="new">New</ButtonPrimary>
      }
    >
      <div className="space-y-3">
        <TableSimple
          headers={credentialHeaders}
          items={data.items}
          actions={[
            {
              title: "Delete",
              onClick: (_, i) => onDelete(i),
              destructive: true,
            },
          ]}
        />
      </div>
      <Outlet />

      <ConfirmModal ref={confirmDelete} onYes={onDeleteConfirm} destructive />
    </EditPageLayout>
  );
}

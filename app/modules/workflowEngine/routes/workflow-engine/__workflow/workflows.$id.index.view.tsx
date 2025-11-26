import { Link, useActionData, useLoaderData, useParams, useSubmit } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import WorkflowBuilder from "~/modules/workflowEngine/components/workflows/WorkflowBuilder";
import WorkflowEditorSidebar from "~/modules/workflowEngine/components/workflows/WorkflowEditorSidebar";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";
import { WorkflowBlockType } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowConditionsGroupDto } from "~/modules/workflowEngine/dtos/WorkflowConditionDtos";
import UrlUtils from "~/utils/app/UrlUtils";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowsIdIndexApi } from "./workflows.$id.index.api.server";

export default function WorkflowsIdIndexView() {
  const data = useLoaderData<WorkflowsIdIndexApi.LoaderData>();
  const actionData = useActionData<WorkflowsIdIndexApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();

  const [workflow, setWorkflow] = useState<WorkflowDto>(data.item);
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlockDto | null>(null);
  const [addingNextBlockFrom, setAddingNextBlockFrom] = useState<{ fromBlock: WorkflowBlockDto; condition: string | null } | null>(null);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  useEffect(() => {
    setWorkflow(data.item);
    if (selectedBlock) {
      setSelectedBlock(data.item.blocks.find((x) => x.id === selectedBlock.id) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.item]);

  useEffect(() => {
    if (selectedBlock === null && addingNextBlockFrom !== null) {
      setAddingNextBlockFrom(null);
    }
  }, [addingNextBlockFrom, selectedBlock]);

  function onSave(workflow: WorkflowDto) {
    const form = new FormData();
    form.append("action", "save");
    form.append("workflow", JSON.stringify(workflow));
    submit(form, {
      method: "post",
    });
  }

  function onSaveBlock(block: WorkflowBlockDto) {
    const form = new FormData();
    form.set("action", "update-block");
    form.set("id", block.id);
    form.append("block", JSON.stringify(block));
    submit(form, {
      method: "post",
    });
  }

  function onAddBlock({ type, from, condition }: { type: WorkflowBlockType; from: WorkflowBlockDto | undefined; condition: string | null }) {
    const form = new FormData();
    form.set("action", "add-block");
    form.set("type", type);
    if (condition) {
      form.set("condition", condition);
    }
    if (from) {
      form.set("fromBlockId", from.id);
    }
    submit(form, {
      method: "post",
    });
  }

  function onConnectBlocks(params: { fromBlockId: string; toBlockId: string; condition: string | null }) {
    const form = new FormData();
    form.set("action", "connect-blocks");
    form.set("fromBlockId", params.fromBlockId);
    form.set("toBlockId", params.toBlockId);
    if (params.condition) {
      form.set("condition", params.condition);
    }

    submit(form, {
      method: "post",
    });
  }

  function onDeleteBlock(id: string) {
    const form = new FormData();
    form.set("action", "delete-block");
    form.set("id", id);
    submit(form, {
      method: "post",
    });
  }

  function onDeleteConnection(params: { fromBlockId: string; toBlockId: string } | { id: string }) {
    const form = new FormData();
    form.set("action", "delete-connection");
    if ("id" in params) {
      form.set("id", params.id);
    } else {
      form.set("fromBlockId", params.fromBlockId);
      form.set("toBlockId", params.toBlockId);
    }
    submit(form, {
      method: "post",
    });
  }

  function onUpdateConditionsGroups(blockId: string, conditionsGroups: WorkflowConditionsGroupDto[]) {
    const form = new FormData();
    form.set("action", "update-conditions-groups");
    form.set("blockId", blockId);
    form.set("conditionsGroups", JSON.stringify(conditionsGroups));
    submit(form, {
      method: "post",
    });
  }

  function onToggle(enabled: boolean) {
    const form = new FormData();
    form.set("action", "toggle");
    form.set("enabled", enabled ? "true" : "false");
    submit(form, {
      method: "post",
    });
  }

  const description = workflow.description?.trim() || "No description added yet.";

  return (
    <div className="min-h-screen bg-[#070e1a]/20 text-slate-50 pb-40">
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur">
          <div className="space-y-1">
            <BreadcrumbSimple
              menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: workflow.name }]}
            />
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Workflow</div>
            <div className="text-2xl font-semibold leading-tight md:text-3xl text-white">{workflow.name}</div>
            <p className="max-w-3xl text-sm text-slate-300">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 shadow-sm ring-1 ring-white/10">
              <InputCheckbox
                disabled={!WorkflowUtils.isReady(workflow) && workflow.status !== "live"}
                asToggle
                value={workflow.status === "live"}
                setValue={(checked) => onToggle(Boolean(checked))}
              />
              <div className="text-xs font-semibold uppercase tracking-wide text-white/80">{workflow.status === "live" ? "Live" : "Draft"}</div>
            </div>
            <SimpleBadge title={WorkflowUtils.getStatusTitle(workflow)} color={WorkflowUtils.getStatusColor(workflow)} />
            <Link
              to={`executions`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              View executions
            </Link>
            <div className="rounded-full border border-white/10 bg-white/5 px-1 py-1 shadow-sm">
              <WorkflowRunDropdown workflow={workflow} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <StatCard label="Blocks" value={workflow.blocks.length.toString()} hint="Nodes in this flow" />
          <StatCard label="Executions" value={workflow._count.executions.toString()} hint="Runs recorded" />
          <StatCard
            label="Last update"
            value={workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleDateString() : "--"}
            hint="Version freshness"
          />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-2 pt-1 text-slate-200">
                <div className="px-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Flow canvas</div>
                  <p className="text-sm text-slate-300">Drag, connect und tune deine Blocks. Links laufen, rechts konfigurieren.</p>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    to={`executions`}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                  >
                    Executions
                  </Link>
                  <WorkflowRunDropdown workflow={workflow} />
                </div>
              </div>
              <div className="h-[64vh] min-h-[380px] max-h-[70vh] px-1 pb-1">
                <div className="h-full rounded-xl border border-dashed border-white/10 bg-transparent">
                  <WorkflowBuilder
                    workflow={workflow}
                    selectedBlock={selectedBlock}
                    workflowExecution={null}
                    onSelectedBlock={setSelectedBlock}
                    onConnectBlocks={onConnectBlocks}
                    onDeleteConnection={(id) => onDeleteConnection({ id })}
                    onDeleteBlock={onDeleteBlock}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0c1322]/80 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="border-b border-white/5 bg-[#0e172a] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Inspector</div>
              <p className="text-sm text-slate-300">Blocks, Conditions, Inputs und Credentials bearbeiten.</p>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-2 pb-2 pt-1">
              <WorkflowEditorSidebar
                workflow={workflow}
                onSave={onSave}
                selectedBlock={selectedBlock}
                addingNextBlockFrom={addingNextBlockFrom}
                onSelectedBlock={(block) => {
                  setSelectedBlock(block);
                }}
                onSaveBlock={onSaveBlock}
                onSetTrigger={(type) => {
                  onAddBlock({ type: type, from: undefined, condition: null });
                  setAddingNextBlockFrom(null);
                }}
                onAddBlock={({ from, type, condition }) => {
                  onAddBlock({ type: type, from: from, condition });
                  setAddingNextBlockFrom(null);
                }}
                onAddingNextBlock={(data) => {
                  setAddingNextBlockFrom(data);
                }}
                onDeleteBlock={onDeleteBlock}
                onDeleteConnection={onDeleteConnection}
                onUpdateConditionsGroups={onUpdateConditionsGroups}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: Readonly<{ label: string; value: string; hint?: string }>) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white shadow-md ring-1 ring-inset ring-white/10 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-white/70">{label}</div>
      <div className="mt-1 text-xl font-semibold leading-tight">{value}</div>
      {hint && <div className="text-xs text-white/70">{hint}</div>}
    </div>
  );
}

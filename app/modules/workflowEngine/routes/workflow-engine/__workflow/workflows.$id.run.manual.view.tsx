import { Link, useActionData, useLoaderData, useParams, useSubmit } from "react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Colors } from "~/application/enums/shared/Colors";
import MonacoEditor from "~/components/editors/MonacoEditor";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import WorkflowInputExamplesDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowInputExamplesDropdown";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowBlockExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowBlockExecutionDto";
import { WorkflowBlockTypes } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsIdRunManualApi } from "./workflows.$id.run.manual.api.server";
import { WorkflowDto } from "../../../dtos/WorkflowDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";

export default function WorkflowsIdRunManualView() {
  const data = useLoaderData<WorkflowsIdRunManualApi.LoaderData>();
  const actionData = useActionData<WorkflowsIdRunManualApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [execution, setExecution] = useState<WorkflowExecutionDto | null>(null);
  const [inputData, setInputData] = useState("{}");

  useEffect(() => {
    if (data.workflow.inputExamples.length > 0) {
      setSelectedTemplate(data.workflow.inputExamples[0].title);
      setInputData(JSON.stringify(data.workflow.inputExamples[0].input, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.workflow.inputExamples.length]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }

    if (actionData?.execution) {
      setExecution(actionData.execution);
      actionData?.execution?.executionAlerts.forEach((executionAlert) => {
        if (executionAlert.type === "error") {
          toast.error(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        } else {
          toast.success(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        }
      });
    }
  }, [actionData]);

  function onExecute() {
    const form = new FormData();
    form.append("action", "execute");
    form.append("input", inputData);
    submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <div className="border-border bg-background w-full border-b px-4 py-2 shadow-2xs">
        <BreadcrumbSimple
          menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: data.workflow.name }]}
        />
      </div>
      <div className="border-border bg-background w-full border-b px-4 py-2 shadow-2xs">
        <div className="flex justify-between">
          <Link
            to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions`)}
            className="hover:bg-secondary bg-background text-foreground/80 rounded px-2 py-1 text-sm font-semibold shadow-2xs ring-1 ring-inset ring-gray-300"
          >
            <span className="mr-1">&larr;</span> Back to executions
          </Link>
          <WorkflowRunDropdown workflow={data.workflow} />
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-2 p-4">
        <div className="flex justify-between space-x-2">
          <div className="text-lg font-semibold">Run Workflow Manually</div>
        </div>

        {execution ? null : (
          <div>
            <div className="space-y-1">
              <div className="flex items-center justify-between space-x-2">
                <div className="text-sm font-medium">{selectedTemplate || "Input Data"}</div>
                {data.workflow.inputExamples.length > 0 && (
                  <WorkflowInputExamplesDropdown
                    workflow={data.workflow}
                    onSelected={(item) => {
                      setSelectedTemplate(item.title);
                      setInputData(JSON.stringify(item.input, null, 2));
                    }}
                  />
                )}
              </div>
              <div className="border-border overflow-hidden rounded-md border">
                <MonacoEditor className="h-20" theme="light" value={inputData} onChange={setInputData} hideLineNumbers tabSize={2} language="json" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <LoadingButton actionName="execute" onClick={onExecute} disabled={!WorkflowUtils.canRun(data.workflow)}>
                Run {!WorkflowUtils.canRun(data.workflow) && <span className="ml-1 text-xs opacity-50"> (not live)</span>}
              </LoadingButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                target="_blank"
                to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions?executionId=${execution.id}`)}
                className="border-border bg-background flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <div className="flex justify-center">
                  <div className=" ">View execution flow</div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExecution(null);
                }}
                className="border-border bg-background flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
              >
                <div className="flex justify-center">
                  <div className=" ">Run again</div>
                </div>
              </button>
            </div>
            <WorkflowRun workflow={execution} />
            <div className="text-foreground font-medium">Blocks executed ({execution.blockRuns.length})</div>
            <div className="w-full space-y-1">
              {execution.blockRuns.map((blockRun) => {
                return <BlockRun key={blockRun.id} workflow={data.workflow} blockRun={blockRun} />;
              })}
            </div>
          </div>
        )}

        {actionData?.error && <ErrorBanner title="Error" text={actionData.error} />}
      </div>
    </div>
  );
}

function BlockRun({ workflow, blockRun }: Readonly<{ workflow: WorkflowDto; blockRun: WorkflowBlockExecutionDto }>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const block = workflow.blocks.find((x) => x.id === blockRun.workflowBlockId);
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block?.type);
  if (!block || !workflowBlock) {
    return null;
  }
  const getErrorOrOutput = () => {
    if (blockRun.error) {
      return <div className="truncate text-xs text-red-600">{blockRun.error}</div>;
    }
    if (blockRun.output) {
      return <div className="text-muted-foreground truncate text-xs">{JSON.stringify({ output: blockRun.output })}</div>;
    }
    return null;
  };

  const getStatusBadge = () => {
    if (block.type === "if") {
      return blockRun.output?.condition ? <SimpleBadge title="True" color={Colors.BLUE} /> : <SimpleBadge title="False" color={Colors.ORANGE} />;
    }
    if (block.type === "switch") {
      return <SimpleBadge title={blockRun.output?.condition?.toString()} color={Colors.BLUE} />;
    }
    const statusMap = {
      running: { title: "Running", color: Colors.YELLOW },
      error: { title: "Error", color: Colors.RED },
      success: { title: "Success", color: Colors.GREEN },
    };
    const status = statusMap[blockRun.status as keyof typeof statusMap];
    return status ? <SimpleBadge title={status.title} color={status.color} /> : <SimpleBadge title="Unknown Status" color={Colors.GRAY} />;
  };

  return (
    <div className="space-y-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className={clsx(
          "hover:bg-secondary border-border bg-background cursor-pointer select-none overflow-hidden rounded-md border p-2 w-full text-left",
          isExpanded ? "rounded-b-none" : "rounded-md"
        )}
      >
        <div className="flex justify-between space-x-2">
          <div className="flex items-center space-x-1 truncate">
            <div className="flex items-center space-x-2 truncate">
              <workflowBlock.icon className="text-muted-foreground h-4 w-4 shrink-0" />
              <div className="text-foreground/80 shrink-0 truncate text-xs font-medium">[{workflowBlock.name}]</div>
              {getErrorOrOutput()}
            </div>
            <div className="text-muted-foreground text-sm">{block.description || ""}</div>
          </div>

          <div className="shrink-0">{getStatusBadge()}</div>
        </div>
      </button>
      {isExpanded && (
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
          className="border-border bg-secondary/90 overflow-hidden rounded-md rounded-t-none border p-2 w-full text-left"
        >
          {blockRun.error && <ErrorBanner title="Error" text={blockRun.error} />}
          <InputOutput input={blockRun.input} output={blockRun.output} />
        </button>
      )}
    </div>
  );
}

function WorkflowRun({ workflow }: Readonly<{ workflow: WorkflowExecutionDto }>) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="border-border bg-background flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed hover:border-gray-800"
      >
        <div className="flex justify-center"> Workflow Input and Output</div>
      </button>
      {isExpanded && (
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
            }
          }}
          className="border-border bg-secondary/90 overflow-hidden rounded-md border p-2"
        >
          <InputOutput input={workflow.input} output={workflow.output} />
        </div>
      )}
    </div>
  );
}

function InputOutput({ input, output }: Readonly<{ input?: any; output?: any }>) {
  return (
    <div className="space-y-1">
      {!input || JSON.stringify(input) === "{}" ? (
        <div className="border-border flex flex-col items-center border bg-gray-200 p-3">
          <div className="text-muted-foreground text-center text-xs">No input</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-foreground/80 text-xs font-medium">Input</div>
            <button
              type="button"
              className="hover:text-muted-foreground text-foreground/80 text-xs font-medium"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(input))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(input, null, 2)}</pre>
          </div>
        </div>
      )}

      {!output || JSON.stringify(output) === "{}" ? (
        <div className="border-border flex flex-col items-center border bg-gray-200 p-3">
          <div className="text-muted-foreground text-center text-xs">No output</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-foreground/80 text-xs font-medium">Outputs</div>
            <button
              type="button"
              className="hover:text-muted-foreground text-foreground/80 text-xs font-medium"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(output))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(output, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

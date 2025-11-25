import { db } from "~/utils/db.server";
import { updateWorkflowExecution } from "../db/workflowExecutions.db.server";
import { WorkflowExecutionDto } from "../dtos/WorkflowExecutionDto";
import WorkflowExecutionUtils from "../helpers/WorkflowExecutionUtils";
import WorkflowsService from "./WorkflowsService";
import WorkflowBlockService from "./blocks/WorkflowBlockService";
import WorkflowVariablesAndCredentialsService from "./WorkflowVariablesAndCredentialsService";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import { WorkflowStatus } from "../dtos/WorkflowStatus";

async function getOrCreateExecution(
  workflow: any,
  session: { tenantId: string | null; userId: string | null },
  type: "manual" | "api",
  input: { [key: string]: any } | null,
  execution?: { id: string } | null,
  appliesToAllTenants?: boolean
) {
  if (execution) {
    return execution;
  }
  return await db.workflowExecution.create({
    data: {
      tenantId: session.tenantId,
      workflowId: workflow.id,
      type,
      input: JSON.stringify(input),
      status: "running",
      output: null,
      duration: null,
      endedAt: null,
      error: null,
      appliesToAllTenants,
    },
  });
}

function getFirstBlock(workflow: any, fromBlockId?: string | null): WorkflowBlockDto {
  if (fromBlockId) {
    const firstBlock = workflow.blocks.find((f: any) => f.id === fromBlockId);
    if (!firstBlock) {
      throw new Error("Workflow has no block with id " + fromBlockId);
    }
    return firstBlock;
  }

  const firstBlock = workflow.blocks.find((f: any) => f.isTrigger);
  if (!firstBlock) {
    throw new Error("Workflow has no trigger block");
  }
  return firstBlock;
}

async function getSessionData(session: { tenantId: string | null; userId: string | null }) {
  const tenant = session.tenantId
    ? await db.tenant.findFirstOrThrow({ where: { OR: [{ slug: session.tenantId }, { id: session.tenantId }] } }).catch(() => null)
    : null;
  const user = session.userId ? await db.user.findUnique({ where: { id: session.userId } }) : null;
  return { tenant, user };
}

async function execute(
  workflowId: string,
  {
    type,
    input,
    session,
    execution,
    fromBlockId,
    appliesToAllTenants,
  }: {
    type: "manual" | "api";
    input: { [key: string]: any } | null;
    session: { tenantId: string | null; userId: string | null };
    execution?: { id: string } | null;
    fromBlockId?: string | null;
    appliesToAllTenants?: boolean;
  }
): Promise<WorkflowExecutionDto> {
  const workflow = await WorkflowsService.get(workflowId, session);
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const executionRecord = await getOrCreateExecution(workflow, session, type, input, execution, appliesToAllTenants);
  const firstBlock = getFirstBlock(workflow, fromBlockId);
  const { tenant, user } = await getSessionData(session);

  const startTime = performance.now();
  let error: string | null = null;
  let result: {
    status: WorkflowStatus;
    workflowContext: { [key: string]: any };
  } = { status: "running", workflowContext: {} };

  try {
    result = await WorkflowBlockService.execute({
      workflowContext: {
        $params: input,
        $session: {
          tenant: tenant ? { id: tenant.id, name: tenant.name } : null,
          user: user ? { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
        },
        $vars: await WorkflowVariablesAndCredentialsService.getVariablesContext({ tenantId: session.tenantId }),
        $credentials: await WorkflowVariablesAndCredentialsService.getCredentialsContext({ tenantId: session.tenantId }),
      },
      workflowExecutionId: executionRecord.id,
      workflow,
      block: firstBlock,
      fromBlock: null,
      session,
    });
  } catch (e: any) {
    error = e.message;
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(e.stack);
    }
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  delete result.workflowContext.$credentials;
  const updatedExecution = await updateWorkflowExecution(executionRecord.id, {
    status: error ? "error" : result.status,
    output: JSON.stringify(result.workflowContext),
    duration: Math.round(duration),
    error,
  });

  return WorkflowExecutionUtils.rowToDto(updatedExecution);
}

export default {
  execute,
};

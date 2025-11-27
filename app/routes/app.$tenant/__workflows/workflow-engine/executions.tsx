import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsExecutionsApi } from "~/modules/workflowEngine/routes/workflow-engine/executions.api.server";
import WorkflowsExecutionsView from "~/modules/workflowEngine/routes/workflow-engine/executions.view";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => WorkflowsExecutionsApi.loader(args);
export const action = (args: ActionFunctionArgs) => WorkflowsExecutionsApi.action(args);

const WorkflowsExecutions = () => <WorkflowsExecutionsView />;
export default WorkflowsExecutions;

export function ErrorBoundary() {
  return <ServerError />;
}

import { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsVariablesApi } from "~/modules/workflowEngine/routes/workflow-engine/variables.api.server";
import WorkflowsVariablesView from "~/modules/workflowEngine/routes/workflow-engine/variables.view";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => WorkflowsVariablesApi.loader(args);

export default function WorkflowsVariablesRoute() {
  return <WorkflowsVariablesView />;
}

export function ErrorBoundary() {
  return <ServerError />;
}

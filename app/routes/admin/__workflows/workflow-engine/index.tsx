import { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowEngineIndexApi } from "~/modules/workflowEngine/routes/workflow-engine/index.api.server";
import WorkflowEngineIndexView from "~/modules/workflowEngine/routes/workflow-engine/index.view";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => WorkflowEngineIndexApi.loader(args);

export default function WorkflowEngineIndexRoute() {
  return <WorkflowEngineIndexView />;
}

export function ErrorBoundary() {
  return <ServerError />;
}

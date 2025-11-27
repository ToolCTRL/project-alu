import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIdIndexApi } from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.index.api.server";
import WorkflowsIdIndexView from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.index.view";
import "reactflow/dist/style.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => WorkflowsIdIndexApi.loader(args);
export const action = (args: ActionFunctionArgs) => WorkflowsIdIndexApi.action(args);

const WorkflowsIdIndex = () => <WorkflowsIdIndexView />;
export default WorkflowsIdIndex;

export function ErrorBoundary() {
  return <ServerError />;
}

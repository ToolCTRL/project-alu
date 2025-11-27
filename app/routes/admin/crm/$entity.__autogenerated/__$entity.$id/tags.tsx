import { ActionFunction, LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import RowTagsRoute from "~/modules/rows/components/RowTagsRoute";
import { Rows_Tags } from "~/modules/rows/routes/Rows_Tags.server";
export { serverTimingHeaders as headers } from "~/modules/metrics/utils/defaultHeaders.server";

export const loader = (args: LoaderFunctionArgs) => Rows_Tags.loader(args);
export const action: ActionFunction = (args) => Rows_Tags.action(args);

export default function AdminCrmEntityTagsRoute() {
  return <RowTagsRoute />;
}

export function ErrorBoundary() {
  return <ServerError />;
}

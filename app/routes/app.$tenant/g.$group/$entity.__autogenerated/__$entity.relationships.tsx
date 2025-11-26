import { LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { Rows_Relationships } from "~/modules/rows/routes/Rows_Relationships.server";
import RowsRelationshipsRoute from "~/modules/rows/components/RowsRelationshipsRoute";
export { serverTimingHeaders as headers } from "~/modules/metrics/utils/defaultHeaders.server";

export const loader = (args: LoaderFunctionArgs) => Rows_Relationships.loader(args);

export default function GroupEntityRelationships() {
  return <RowsRelationshipsRoute />;

export function ErrorBoundary() {
  return <ServerError />;
}

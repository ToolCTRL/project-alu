import { LoaderFunctionArgs } from "react-router";
import { Rows_Export } from "~/modules/rows/routes/Rows_Export.server";
export { serverTimingHeaders as headers } from "~/modules/metrics/utils/defaultHeaders.server";

export const loader = (args: LoaderFunctionArgs) => Rows_Export.loader(args);

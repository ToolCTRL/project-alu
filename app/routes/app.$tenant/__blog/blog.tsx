import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { BlogRoutesIndexApi } from "~/modules/blog/routes/api/BlogRoutes.Index.Api";
import BlogView from "~/modules/blog/routes/views/BlogRoutes.Index.View";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => BlogRoutesIndexApi.loader(args);

export default function Blog() {
  return <BlogView />;
}

export function ErrorBoundary() {
  return <ServerError />;
}

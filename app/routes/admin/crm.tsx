import { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import CrmService from "~/modules/crm/services/CrmService";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  title: string;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const data: LoaderData = {
    title: `CRM | ${process.env.APP_NAME}`,
  };
  const tenantId = await getTenantIdOrNull({ request, params });
  await verifyUserHasPermission(request, "admin.entities.view", tenantId);
  await CrmService.validate(tenantId);
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function CrmRoute() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <ServerError />;
}

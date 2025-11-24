import { LoaderFunctionArgs, redirect } from "react-router";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "tenant.entities.view", tenantId);
  return redirect(`/admin/entities?tenantId=${params.tenant}`);
};

export default function TenantAdminEntitiesRoute() {
  return null;
}

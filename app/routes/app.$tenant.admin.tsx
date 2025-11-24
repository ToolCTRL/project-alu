import { useEffect } from "react";
import { LoaderFunctionArgs } from "react-router";
import { Outlet, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import AppLayout from "~/components/app/AppLayout";
import { loadAppData } from "~/utils/data/.server/appData";
import { useAppData } from "~/utils/data/useAppData";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { getTranslations } from "~/locale/i18next.server";
import { TenantAdminSidebar } from "~/application/sidebar/TenantAdminSidebar";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import ServerError from "~/components/ui/errors/ServerError";

export { serverTimingHeaders as headers };

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "app.$tenant.admin");
  const { t } = await getTranslations(request);
  const data = await time(loadAppData({ request, params, t, time }), "loadAppData");
  const tenantId = await time(getTenantIdFromUrl(params), "getTenantIdFromUrl");
  await time(verifyUserHasPermission(request, "tenant.dashboard.view", tenantId), "verifyUserHasPermission");
  return Response.json(data, { headers: getServerTimingHeader() });
};

export default function TenantAdminRoute() {
  const data = useAppData();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (!data.currentTenant) {
      navigate("/app");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.currentTenant]);

  return (
    <AppLayout layout="admin" menuItems={TenantAdminSidebar({ t, tenantSlug: params.tenant ?? "" })}>
      <Outlet />
    </AppLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}

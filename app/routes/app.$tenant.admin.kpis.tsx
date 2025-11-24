import { LoaderFunctionArgs } from "react-router";
import { useTranslation } from "react-i18next";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "tenant.dashboard.view", tenantId);
  return null;
};

export default function TenantAdminKpisRoute() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("kpis.title", { defaultValue: "KPIs" })}</h1>
        <p className="text-muted-foreground">{t("kpis.description", { defaultValue: "Tenant-level KPIs and health overview." })}</p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {t("kpis.empty", { defaultValue: "Add widgets and reports scoped to this tenant here." })}
      </div>
    </div>
  );
}

import { LoaderFunctionArgs, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { ButtonPrimary } from "~/components/ui/buttons/ButtonPrimary";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "tenant.dashboard.view", tenantId);
  return null;
};

export default function TenantAdminIndexRoute() {
  const { t } = useTranslation();
  const params = useParams();
  const basePath = `/app/${params.tenant}/admin`;
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("app.sidebar.dashboard")}</h1>
        <p className="text-muted-foreground">
          {t("tenant.admin.description", { defaultValue: "Tenant-level administration with scoped permissions." })}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonPrimary to={`${basePath}/kpis`}>{t("kpis.title", { defaultValue: "KPIs" })}</ButtonPrimary>
        <ButtonPrimary to={`/app/${params.tenant}/settings/members`}>{t("app.sidebar.team")}</ButtonPrimary>
        <ButtonPrimary to={`/app/${params.tenant}/settings/subscription`}>{t("app.sidebar.subscription")}</ButtonPrimary>
      </div>
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">
          {t("tenant.admin.scope", {
            defaultValue: "Actions here apply only to the active tenant. Use the operator console for platform-wide changes.",
          })}
        </p>
        <div className="mt-3 text-sm">
          <Link className="text-primary hover:underline" to="/admin">
            {t("tenant.admin.operatorLink", { defaultValue: "Go to operator console" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

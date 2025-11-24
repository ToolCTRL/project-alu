import { LoaderFunctionArgs } from "react-router";
import { useTranslation } from "react-i18next";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "tenant.support.view", tenantId);
  return null;
};

export default function TenantAdminSupportRoute() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("support.title", { defaultValue: "Support" })}</h1>
        <p className="text-muted-foreground">
          {t("support.description", { defaultValue: "Tenant-scoped support, SLAs, and escalation paths." })}
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        {t("support.empty", { defaultValue: "Link your help center, chat, or playbooks for this tenant." })}
      </div>
    </div>
  );
}

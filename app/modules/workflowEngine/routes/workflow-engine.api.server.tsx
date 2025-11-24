import { LoaderFunctionArgs } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export namespace WorkflowEngineApi {
  type LoaderData = {
    metatags: MetaTagsDto;
  };

  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const permissionName = tenantId ? ("tenant.workflows.view" as const) : ("admin.workflows.view" as const);
    await verifyUserHasPermission(request, permissionName, tenantId);
    const appConfiguration = await getAppConfiguration({ request });
    if (params.tenant && !appConfiguration.app.features.tenantWorkflows) {
      throw Response.json({ error: "Workflows are disabled" }, { status: 400 });
    }
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
    };
    return data;
  };
}

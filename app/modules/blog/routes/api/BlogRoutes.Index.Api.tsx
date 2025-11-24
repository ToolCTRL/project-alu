import { LoaderFunctionArgs } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { BlogPostWithDetails, getAllBlogPosts } from "../../db/blog.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace BlogRoutesIndexApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: BlogPostWithDetails[];
  };

  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    if (tenantId !== null) {
      throw Response.json({ error: "Blog management is operator-only" }, { status: 403 });
    }
    await verifyUserHasPermission(request, "admin.blog.view");
    const items = await getAllBlogPosts({ tenantId: null });
    const data: LoaderData = {
      metatags: [{ title: `Blog | ${process.env.APP_NAME}` }],
      items,
    };
    return data;
  };
}

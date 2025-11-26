import { BlogCategory, BlogTag } from "@prisma/client";
import { MetaFunction, ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getTranslations } from "~/locale/i18next.server";
import { BlogApi } from "~/utils/api/.server/BlogApi";
import FormHelper from "~/utils/helpers/FormHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { storeSupabaseFile } from "~/utils/integrations/supabaseService";
import { getUserInfo } from "~/utils/session.server";
import { BlogPostWithDetails, getBlogPost, updateBlogPost, deleteBlogPost } from "../../db/blog.db.server";
import { getAllBlogCategories } from "../../db/blogCategories.db.server";
import { getAllBlogTags } from "../../db/blogTags.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import UrlUtils from "~/utils/app/UrlUtils";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace BlogRoutesEditApi {
  export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

  export type LoaderData = {
    metatags: MetaTagsDto;
    item: BlogPostWithDetails;
    categories: BlogCategory[];
    tags: BlogTag[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    if (tenantId !== null) {
      throw Response.json({ error: "Blog management is operator-only" }, { status: 403 });
    }
    await verifyUserHasPermission(request, "admin.blog.view");
    const item = await getBlogPost({ tenantId, idOrSlug: params.id ?? "" });
    if (!item) {
      throw redirect(UrlUtils.getModulePath(params, "blog"));
    }

    const data: LoaderData = {
      metatags: [{ title: `Blog | ${process.env.APP_NAME}` }],
      item,
      categories: await getAllBlogCategories(tenantId),
      tags: await getAllBlogTags(tenantId),
    };
    return data;
  };

  export type ActionData = {
    error?: string;
    createdPost?: BlogPostWithDetails | null;
  };
  // Helper function to handle blog post editing
  async function handleEdit(form: FormData, params: any, tenantId: string | null, userInfo: any) {
    if (tenantId === null) {
      await verifyUserHasPermission({ request: null } as any, "admin.blog.update");
    }

    const blogPost = await getBlogPost({ tenantId, idOrSlug: params.id ?? "" });
    if (!blogPost) {
      return redirect(UrlUtils.getModulePath(params, "blog"));
    }

    const value = form.get("new-category");
    const newCategoryValue = value != null ? String(value) : "";
    const addingCategoryName = newCategoryValue;
    let category: BlogCategory | null = null;
    if (addingCategoryName) {
      category = await BlogApi.getCategory({ tenantId, idOrName: { name: addingCategoryName } });
      if (!category) {
        category = await BlogApi.createCategory({ tenantId, name: addingCategoryName });
      }
    }

    const authorId = blogPost.authorId ?? userInfo.userId;
    const categoryFormValue = form.get("category");
    const categoryValue = categoryFormValue != null ? String(categoryFormValue) : "";
    const categoryId = categoryValue;
    const slugFormValue = form.get("slug");
    const slugValue = slugFormValue != null ? String(slugFormValue) : "";
    const slug = slugValue;
    const tagsFormValue = form.get("tags");
    const tagsValue = tagsFormValue != null ? String(tagsFormValue) : "";
    const tags = tagsValue;

    const titleValue = form.get("title") ?? "";
    const descriptionValue = form.get("description") ?? "";
    const dateValue = form.get("date") ?? "";
    const imageValue = form.get("image") ?? "";
    const contentValue = form.get("content") ?? "";
    const readingTimeValue = form.get("reading-time") ?? "";
    const contentTypeValue = form.get("contentType") ?? "";

    const updated = await updateBlogPost(blogPost.id, {
      slug,
      title: titleValue,
      description: descriptionValue,
      date: new Date(dateValue),
      image: await storeSupabaseFile({ bucket: "blog", content: imageValue, id: slug }),
      content: contentValue,
      readingTime: readingTimeValue,
      published: FormHelper.getBoolean(form, "published"),
      categoryId: categoryId.length ? categoryId : category?.id ?? null,
      tagNames: tags.split(",").filter((f) => f.trim() != ""),
      contentType: contentTypeValue,
      authorId,
    });

    return redirect(UrlUtils.getBlogPath(params, updated.slug));
  }

  // Helper function to handle blog post deletion
  async function handleDelete(params: any, tenantId: string | null, request: Request) {
    if (tenantId === null) {
      await verifyUserHasPermission(request, "admin.blog.delete");
    }
    await deleteBlogPost(params.id ?? "");
    return redirect(UrlUtils.getModulePath(params, "blog"));
  }

  export const action: ActionFunction = async ({ request, params }) => {
    await requireAuth({ request, params });
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    if (tenantId !== null) {
      return Response.json({ error: "Blog management is operator-only" }, { status: 403 });
    }
    const userInfo = await getUserInfo(request);
    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";

    try {
      if (action === "edit") {
        return await handleEdit(form, params, tenantId, userInfo);
      } else if (action === "delete") {
        return await handleDelete(params, tenantId, request);
      } else {
        return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
      }
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  };
}

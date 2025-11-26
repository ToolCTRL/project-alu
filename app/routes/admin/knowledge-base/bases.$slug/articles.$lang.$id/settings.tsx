import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from "react-router";
import { useSubmit } from "react-router";
import { useRef } from "react";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { getTranslations } from "~/locale/i18next.server";
import KbArticleSettingsForm from "~/modules/knowledgeBase/components/bases/KbArticleSettingsForm";
import {
  KnowledgeBaseArticleSimple,
  KnowledgeBaseArticleWithDetails,
  deleteKnowledgeBaseArticle,
  getAllKnowledgeBaseArticlesSimple,
  getFeaturedKnowledgeBaseArticles,
  getKbArticleById,
  getKbArticleBySlug,
  updateKnowledgeBaseArticle,
} from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { KnowledgeBaseCategorySimple, getAllKnowledgeBaseCategoriesSimple } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { getAllKnowledgeBaseNames } from "~/modules/knowledgeBase/db/knowledgeBase.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  knowledgeBase: KnowledgeBaseDto;
  item: KnowledgeBaseArticleWithDetails;
  allKnowledgeBases: { id: string; title: string }[];
  allArticles: KnowledgeBaseArticleSimple[];
  allCategories: KnowledgeBaseCategorySimple[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const { t } = await getTranslations(request);
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
    request,
  });
  if (!knowledgeBase) {
    throw redirect("/admin/knowledge-base/bases");
  }
  const item = await getKbArticleById(params.id!);
  if (!item) {
    throw redirect(`/admin/knowledge-base/bases/${params.slug!}/articles`);
  }
  const allCategories = await getAllKnowledgeBaseCategoriesSimple();
  let allArticles = await getAllKnowledgeBaseArticlesSimple();
  const data: LoaderData = {
    metatags: [{ title: `${t("shared.settings")}: ${item.title} | ${knowledgeBase.title} | ${t("knowledgeBase.title")} | ${process.env.APP_NAME}` }],
    knowledgeBase,
    item,
    allKnowledgeBases: await getAllKnowledgeBaseNames(),
    allArticles,
    allCategories,
  };
  return data;
};

const stringOrEmpty = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

async function calculateFeaturedOrder(item: KnowledgeBaseArticleWithDetails, isFeatured: boolean, knowledgeBaseId: string, language: string) {
  if (isFeatured) {
    if (item.featuredOrder) {
      return item.featuredOrder;
    }
    const featuredArticles = await getFeaturedKnowledgeBaseArticles({
      knowledgeBaseId,
      language,
    });
    const maxOrder = featuredArticles.length > 0 ? Math.max(...featuredArticles.map((p) => p.featuredOrder ?? 0)) : 0;
    return maxOrder + 1;
  }
  return null;
}

async function handleEditAction(request: Request, params: any, form: FormData, item: KnowledgeBaseArticleWithDetails) {
  const knowledgeBaseId = stringOrEmpty(form.get("knowledgeBaseId"));
  const categoryId = stringOrEmpty(form.get("categoryId"));
  const sectionId = stringOrEmpty(form.get("sectionId"));
  const language = stringOrEmpty(form.get("language"));
  const slug = stringOrEmpty(form.get("slug"));
  const title = stringOrEmpty(form.get("title"));
  const description = stringOrEmpty(form.get("description"));
  const seoImage = stringOrEmpty(form.get("seoImage"));
  const isFeatured = Boolean(form.get("isFeatured"));
  const relatedArticles = form.getAll("relatedArticles[]").map(String);

  const knowledgeBase = await KnowledgeBaseService.getById({ id: knowledgeBaseId, request });
  if (knowledgeBase == null) {
    return Response.json({ error: "Knowledge base not found" }, { status: 400 });
  }

  const existingLanguage = KnowledgeBaseUtils.supportedLanguages.find((f) => f.value === language);
  if (existingLanguage == null) {
    return Response.json({ error: "Language not found: " + language }, { status: 400 });
  }

  const existing = await getKbArticleBySlug({
    knowledgeBaseId,
    slug,
    language,
  });
  if (existing && existing.id !== item.id) {
    return Response.json({ error: "Slug already exists" }, { status: 400 });
  }

  const featuredOrder = await calculateFeaturedOrder(item, isFeatured, knowledgeBaseId, language);

  await updateKnowledgeBaseArticle(item.id, {
    categoryId: categoryId?.length ? categoryId : null,
    sectionId: sectionId?.length ? sectionId : null,
    slug,
    title,
    description,
    order: item.order,
    language,
    featuredOrder,
    seoImage,
    relatedArticles,
  });

  return redirect(`/admin/knowledge-base/bases/${knowledgeBase.slug}/articles/${language}/${item.id}`);
}

async function handleDeleteAction(request: Request, params: any, item: KnowledgeBaseArticleWithDetails) {
  await verifyUserHasPermission(request, "admin.kb.delete");
  const kb = await KnowledgeBaseService.get({ slug: params.slug!, request });
  await deleteKnowledgeBaseArticle(item.id);
  return redirect(`/admin/knowledge-base/bases/${kb.slug}/articles/${params.lang}`);
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.update");
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  const item = await getKbArticleById(params.id!);
  if (item == null) {
    return Response.json({ error: "Article not found" }, { status: 400 });
  }

  if (action === "edit") {
    return handleEditAction(request, params, form, item);
  } else if (action === "delete") {
    return handleDeleteAction(request, params, item);
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete() {
    confirmDelete.current?.show("Delete article?", "Delete", "Cancel", `Are you sure you want to delete the article "${data.item.title}"?`);
  }

  function onConfirmedDelete() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <KbArticleSettingsForm
        allKnowledgeBases={data.allKnowledgeBases}
        allArticles={data.allArticles}
        allCategories={data.allCategories}
        item={data.item}
        onDelete={onDelete}
      />

      <ConfirmModal ref={confirmDelete} onYes={onConfirmedDelete} destructive />
    </div>
  );
}

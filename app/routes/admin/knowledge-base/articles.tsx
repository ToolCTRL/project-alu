import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData, Link, useNavigate, useOutlet, useParams, useSubmit } from "react-router";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import DateCell from "~/components/ui/dates/DateCell";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import TableSimple from "~/components/ui/tables/TableSimple";
import {
  KnowledgeBaseArticleWithDetails,
  getAllKnowledgeBaseArticlesWithPagination,
  getKbArticleById,
  updateKnowledgeBaseArticle,
} from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { getAllKnowledgeBaseCategories, updateKnowledgeBaseCategory } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { updateKnowledgeBaseCategorySection } from "~/modules/knowledgeBase/db/kbCategorySections.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { getUserInfo } from "~/utils/session.server";
import NumberUtils from "~/utils/shared/NumberUtils";
import Dropdown from "~/components/ui/dropdowns/Dropdown";
import { Menu } from "@headlessui/react";
import clsx from "clsx";

type LoaderData = {
  knowledgeBases: KnowledgeBaseDto[];
  items: KnowledgeBaseArticleWithDetails[];
  pagination: PaginationDto;
  filterableProperties: FilterablePropertyDto[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "title",
      title: "Title",
    },
    {
      name: "description",
      title: "Description",
    },
    {
      name: "categoryId",
      title: "Category",
      options: [
        { value: "null", name: "{null}" },
        ...(await getAllKnowledgeBaseCategories({ knowledgeBaseSlug: undefined, language: undefined })).map((item) => {
          return {
            value: item.id,
            name: item.title,
          };
        }),
      ],
    },
    {
      name: "content",
      title: "Content",
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const filtered = {
    title: filters.properties.find((f) => f.name === "title")?.value ?? filters.query ?? undefined,
    description: filters.properties.find((f) => f.name === "description")?.value ?? filters.query ?? undefined,
    categoryId: filters.properties.find((f) => f.name === "categoryId")?.value ?? undefined,
    content: filters.properties.find((f) => f.name === "content")?.value ?? filters.query ?? undefined,
  };
  const { items, pagination } = await getAllKnowledgeBaseArticlesWithPagination({
    knowledgeBaseSlug: undefined,
    language: undefined,
    pagination: currentPagination,
    filters: {
      title: filtered.title,
      description: filtered.description,
      categoryId: filtered.categoryId === "null" ? null : filtered.categoryId,
      content: filtered.content,
    },
  });
  const data: LoaderData = {
    knowledgeBases: await KnowledgeBaseService.getAll({ request }),
    items,
    pagination,
    filterableProperties,
  };
  return data;
};

type ActionData = {
  error?: string;
};

const stringOrEmpty = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

async function handleNewArticle(request: Request, form: FormData, userInfo: any) {
  await verifyUserHasPermission(request, "admin.kb.create");
  const kbId = stringOrEmpty(form.get("kbId"));
  const kb = await KnowledgeBaseService.getById({ id: kbId, request });
  if (kb == null) {
    return Response.json({ error: "Knowledge base not found" }, { status: 404 });
  }
  const created = await KnowledgeBaseService.newArticle({
    kb,
    params: {
      lang: kb.languages.length > 0 ? kb.languages[0] : "en",
    },
    userId: userInfo.userId,
    position: "last",
  });
  return redirect(`/admin/knowledge-base/bases/${kb.slug}/articles/${KnowledgeBaseUtils.defaultLanguage}/${created.id}/edit`);
}

async function handleSetOrders(form: FormData, updateFunction: (id: string, data: any) => Promise<any>) {
  const items: { id: string; order: number }[] = form.getAll("orders[]").map((orderData: FormDataEntryValue) => {
    return JSON.parse(orderData.toString());
  });

  await Promise.all(
    items.map(async ({ id, order }) => {
      await updateFunction(id, { order: Number(order) });
    })
  );
  return Response.json({ updated: true });
}

async function handleToggleFeatured(request: Request, form: FormData) {
  const id = form.get("id") as string;
  const isFeatured = form.get("isFeatured") === "true";

  const item = await getKbArticleById(id);
  if (!item) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const kb = await KnowledgeBaseService.getById({ id: item.knowledgeBaseId, request });
  if (!kb) {
    return Response.json({ error: "Knowledge base not found" }, { status: 404 });
  }

  let featuredOrder = item.featuredOrder;
  if (isFeatured && !item.featuredOrder) {
    const featuredArticles = await KnowledgeBaseService.getFeaturedArticles({
      kb,
      params: {},
      request,
    });
    const maxOrder = featuredArticles.length > 0 ? Math.max(...featuredArticles.map((p) => p.featuredOrder ?? 0)) : 0;
    featuredOrder = maxOrder + 1;
  } else if (!isFeatured) {
    featuredOrder = null;
  }

  await updateKnowledgeBaseArticle(item.id, { featuredOrder });
  return Response.json({ success: "Updated" });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.update");
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  if (action === "new") {
    return await handleNewArticle(request, form, userInfo);
  } else if (action === "set-orders") {
    return await handleSetOrders(form, updateKnowledgeBaseCategory);
  } else if (action === "set-section-orders") {
    return await handleSetOrders(form, updateKnowledgeBaseCategorySection);
  } else if (action === "toggle") {
    return await handleToggleFeatured(request, form);
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
};

const ArticleTitleCell = ({ item }: { item: KnowledgeBaseArticleWithDetails }) => (
  <div className="space-y-1">
    <Link to={`/admin/knowledge-base/bases/${item.knowledgeBase.slug}/articles/${item.language}/${item.id}`} className="flex items-center space-x-2 font-medium hover:underline">
      <div>{item.publishedAt ? <ColorBadge size="sm" color={Colors.TEAL} /> : <ColorBadge size="sm" color={Colors.GRAY} />}</div>
      <div>{item.title}</div>
    </Link>
  </div>
);

const ArticleCategoryCell = ({ item }: { item: KnowledgeBaseArticleWithDetails }) => (
  <div>
    {item.category ? (
      <div className="flex flex-col">
        <div>{item.category.title}</div>
        {item.section && <div className="text-muted-foreground text-xs">{item.section.title}</div>}
      </div>
    ) : (
      <Link to={`${item.id}/settings`} className="text-muted-foreground text-xs italic hover:underline">
        No category
      </Link>
    )}
  </div>
);

const ArticleCreatedByCell = ({ item }: { item: KnowledgeBaseArticleWithDetails }) => (
  <div className="flex flex-col">
    <DateCell date={item.createdAt} displays={["ymd"]} />
    <div>
      {item.createdByUser ? (
        <div>
          {item.createdByUser.firstName} {item.createdByUser.lastName}
        </div>
      ) : (
        <div className="text-muted-foreground text-xs italic hover:underline">No author</div>
      )}
    </div>
  </div>
);

export default function ArticlesListRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const submit = useSubmit();

  function onToggle(item: KnowledgeBaseArticleWithDetails, isFeatured: boolean) {
    const form = new FormData();
    form.set("action", "toggle");
    form.set("isFeatured", isFeatured ? "true" : "false");
    form.set("id", item.id.toString());
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title={`Articles (${data.pagination.totalItems})`}
      withHome={false}
      menu={[{ title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" }, { title: "Articles" }]}
      buttons={
        <>
          <InputFilters filters={data.filterableProperties} />
          <Dropdown
            right={false}
            // onClick={() => alert("Dropdown click")}
            button={
              <div className="flex items-center space-x-2">
                <div>{t("knowledgeBase.article.new")}</div>
                <PlusIcon className="h-5 w-5" />
              </div>
            }
            btnClassName={clsx(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
              "h-9 px-4 py-2"
            )}
            disabled={data.knowledgeBases.length === 0}
            options={
              <div className="h-64 overflow-auto">
                {data.knowledgeBases.map((kb) => {
                  return (
                    <Menu.Item key={kb.id}>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            const form = new FormData();
                            form.set("action", "new");
                            form.set("kbId", kb.id.toString());
                            submit(form, {
                              method: "post",
                            });
                          }}
                          className={clsx("w-full text-left", active ? "text-foreground bg-secondary/90" : "text-foreground/80", "block px-4 py-2 text-sm")}
                        >
                          {kb.title}
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
            }
          ></Dropdown>
        </>
      }
    >
      <div className="space-y-2">
        <TableSimple
          items={data.items}
          pagination={data.pagination}
          actions={[
            {
              title: "Settings",
              onClickRoute: (_, item) => `/admin/knowledge-base/bases/${item.language}/articles/${KnowledgeBaseUtils.defaultLanguage}/${item.id}/settings`,
            },
            {
              title: "Edit",
              onClickRoute: (_, item) => `/admin/knowledge-base/bases/${item.language}/articles/${KnowledgeBaseUtils.defaultLanguage}/${item.id}/edit`,
            },
          ]}
          headers={[
            {
              title: t("knowledgeBase.title"),
              value: (i) => i.knowledgeBase.title,
            },

            // {
            //   name: "language",
            //   title: "Language",
            //   value: (i) => KnowledgeBaseUtils.getLanguageName(i.language),
            // },
            {
              name: "title",
              title: "Title",
              className: "w-full",
              value: (i) => <ArticleTitleCell item={i} />,
            },
            {
              name: "category",
              title: "Category",
              value: (i) => <ArticleCategoryCell item={i} />,
            },
            {
              title: t("shared.language"),
              value: (i) => i.language,
            },
            {
              name: "characters",
              title: "Characters",
              value: (i) => NumberUtils.intFormat(i.contentPublishedAsText.length),
            },
            {
              name: "views",
              title: "Views",
              value: (i) => i._count.views,
            },
            {
              name: "upvotes",
              title: "Upvotes",
              value: (i) => i._count.upvotes,
            },
            {
              name: "downvotes",
              title: "Downvotes",
              value: (i) => i._count.downvotes,
            },
            {
              name: "featured",
              title: "Featured",
              value: (i) => <InputCheckbox asToggle value={Boolean(i.featuredOrder)} setValue={(checked) => onToggle(i, Boolean(checked))} />,
            },
            {
              name: "createdBy",
              title: t("shared.createdBy"),
              value: (i) => <ArticleCreatedByCell item={i} />,
            },
          ]}
        />
      </div>

      <ActionResultModal actionData={actionData} showSuccess={false} />

      <SlideOverWideEmpty
        title={"Article settings"}
        open={!!outlet}
        onClose={() => {
          navigate(".", { replace: true });
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{outlet}</div>
        </div>
      </SlideOverWideEmpty>
    </EditPageLayout>
  );
}

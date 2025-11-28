import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData, useSubmit } from "react-router";
import { useRef } from "react";
import ServerError from "~/components/ui/errors/ServerError";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import KnowledgeBaseForm from "~/modules/knowledgeBase/components/bases/KnowledgeBaseForm";
import { getKnowledgeBaseBySlug, updateKnowledgeBase } from "~/modules/knowledgeBase/db/knowledgeBase.db.server";
import { KbNavLinkDto } from "~/modules/knowledgeBase/dtos/KbNavLinkDto";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: KnowledgeBaseDto;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const item = await KnowledgeBaseService.getById({ id: params.id!, request });
  if (!item) {
    return redirect("/admin/knowledge-base/bases");
  }
  const data: LoaderData = {
    item,
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
async function handleEdit(request: Request, params: any, form: FormData, item: KnowledgeBaseDto) {
  let basePath = form.get("basePath") as string;
  let slug = form.get("slug") as string;
  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const defaultLanguage = form.get("defaultLanguage") as string;
  const layout = form.get("layout") as string;
  const color = Number(form.get("color") ?? "");
  const enabled = Boolean(form.get("enabled"));
  const languages = form.getAll("languages[]").map(String);
  const links: KbNavLinkDto[] = form.getAll("links[]").map((l) => JSON.parse(l.toString()));
  const logo = form.get("logo") as string;
  const seoImage = form.get("seoImage") as string;

  if (languages.length === 0) {
    return Response.json({ error: "At least one language is required" }, { status: 400 });
  }

  if (!basePath.startsWith("/")) {
    basePath = "/" + basePath;
  }
  if (slug.startsWith("/")) {
    slug = slug.substring(1);
  }

  const existing = await getKnowledgeBaseBySlug(slug);
  if (existing && existing.id !== item.id) {
    return Response.json({ error: "Slug already exists" }, { status: 400 });
  }

  try {
    await updateKnowledgeBase(item.id, {
      basePath,
      slug,
      title,
      description,
      defaultLanguage,
      layout,
      color,
      enabled,
      languages: JSON.stringify(languages),
      links: JSON.stringify(links),
      logo,
      seoImage,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return Response.json({ error: errorMessage }, { status: 400 });
  }

  return redirect("/admin/knowledge-base/bases");
}

async function handleDelete(request: Request, item: KnowledgeBaseDto) {
  await verifyUserHasPermission(request, "admin.kb.delete");
  try {
    await KnowledgeBaseService.del(item);
    return redirect("/admin/knowledge-base/bases");
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.update");
  const form = await request.formData();
  const action = form.get("action")?.toString();

  const item = await KnowledgeBaseService.getById({ id: params.id!, request });
  if (!item) {
    return redirect("/admin/knowledge-base/bases");
  }

  if (action === "edit") {
    return handleEdit(request, params, form, item);
  } else if (action === "delete") {
    return handleDelete(request, item);
  } else {
    return Response.json({ error: "Invalid form" }, { status: 400 });
  }
};

export default function KnowledgeBaseEdit() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete() {
    confirmDelete.current?.show("Delete knowledge base?", "Delete", "Cancel", `Are you sure you want to delete knowledge base "${data.item.title}"?`);
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
      <KnowledgeBaseForm item={data.item} onDelete={onDelete} />
      <ActionResultModal actionData={actionData} showSuccess={false} />
      <ConfirmModal ref={confirmDelete} onYes={onConfirmedDelete} destructive />
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}

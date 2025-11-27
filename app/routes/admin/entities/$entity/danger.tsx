import { ActionFunction, LoaderFunctionArgs, redirect, useActionData, useLoaderData, useSubmit } from "react-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { getTranslations } from "~/locale/i18next.server";
import { cache } from "~/utils/cache.server";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { deleteEntity, EntityWithDetails, getEntityBySlug } from "~/utils/db/entities/entities.db.server";
import { countRows, deleteRows } from "~/utils/db/entities/rows.db.server";
import { deleteEntityPermissions } from "~/utils/db/permissions/permissions.db.server";
import { getUserRoles } from "~/utils/db/permissions/userRoles.db.server";
import { getUser } from "~/utils/db/users.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { getUserInfo } from "~/utils/session.server";

type LoaderData = {
  entity: EntityWithDetails;
  count: number;
  tenantId: string | null;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId");
  const permissionName = tenantId ? ("tenant.entities.view" as const) : ("admin.entities.view" as const);
  await verifyUserHasPermission(request, permissionName, tenantId);
  const entity = await getEntityBySlug({ tenantId, slug: params.entity! });
  const data: LoaderData = {
    entity,
    tenantId,
    count: await countRows({ entityId: entity.id, tenantId }),
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId");
  const permissionName = tenantId ? ("tenant.entities.delete" as const) : ("admin.entities.delete" as const);
  await verifyUserHasPermission(request, permissionName, tenantId);
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);
  const user = await getUser(userInfo.userId);
  if (!user?.admin && !tenantId) {
    const userRoles = await getUserRoles(userInfo.userId);
    if (!userRoles.some((f) => f.role.name === DefaultAdminRoles.SuperAdmin)) {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  }
  const entity = await getEntityBySlug({ tenantId, slug: params.entity! });
  const form = await request.formData();
  const action = form.get("action");
  if (action === "delete-all-rows") {
    await deleteRows(entity.id, tenantId ?? undefined);
    return Response.json({ success: t("shared.deleted") });
  } else if (action === "delete") {
    if (tenantId) {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
    try {
      const count = await countRows({ entityId: entity.id, tenantId });
      if (count > 0) {
        return Response.json({ error: `Entity ${entity.name} cannot be deleted because it has ${count} rows` }, { status: 400 });
      }
      await deleteEntityPermissions(entity);
      await deleteEntity(entity.id ?? "");
      cache.clear();
      return redirect("/admin/entities");
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  }
  return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
};

export default function EntityDangerRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const adminData = useAppOrAdminData();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete(action: string) {
    confirmDelete.current?.setValue(action);
    const title = action === "delete"
      ? `Delete ${t(data.entity.title)} entity`
      : `Delete ${t(data.entity.title)} rows (${data.count})`;
    const button = action === "delete"
      ? `Delete ${t(data.entity.title)} entity`
      : `Delete ${t(data.entity.title)} rows (${data.count})`;
    confirmDelete.current?.show(title, button, t("shared.cancel"), t("shared.warningCannotUndo"));
  }

  function onDeleteConfirmed(action: string) {
    const form = new FormData();
    form.set("action", action);
    submit(form, {
      method: "post",
    });
  }

  const hasDeletePermission = getUserHasPermission(adminData, data.tenantId ? "tenant.entities.delete" : "admin.entities.delete");
  const canDelete = hasDeletePermission && (adminData.user?.admin === true || adminData.isSuperAdmin || !!data.tenantId);

  return (
    <div className="space-y-3">
      <div className="md:py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-medium leading-6">Danger</h3>
        </div>
        <p className="pt-2 text-sm text-red-900 dark:text-red-500">These actions cannot be undone.</p>
      </div>

      <div className="flex items-center space-x-2">
        <ButtonPrimary disabled={!canDelete || data.count > 0} destructive onClick={() => onDelete("delete")}>
          Delete {data.entity.title} entity
        </ButtonPrimary>

        <ButtonPrimary disabled={!canDelete || data.count === 0} destructive onClick={() => onDelete("delete-all-rows")}>
          Delete {data.count} rows (SuperAdmin only)
        </ButtonPrimary>
      </div>

      <ConfirmModal ref={confirmDelete} onYes={onDeleteConfirmed} destructive />
      <ActionResultModal actionData={actionData} showSuccess={false} />
    </div>
  );
}

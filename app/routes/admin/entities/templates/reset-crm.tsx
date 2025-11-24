import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { useActionData, useSubmit } from "react-router";
import { useTranslation } from "react-i18next";
import { getTranslations } from "~/locale/i18next.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { deleteAllEntities } from "~/utils/db/entities/entities.db.server";
import { CRM_PIPELINE_TEMPLATE } from "~/modules/templates/defaultEntityTemplates";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { useRef } from "react";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import { importEntitiesFromTemplate } from "~/utils/services/.server/entitiesTemplatesService";
import { getUserInfo } from "~/utils/session.server";

type ActionData = {
  success?: string;
  error?: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.delete");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.entities.delete");
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);
  try {
    await deleteAllEntities();
    await importEntitiesFromTemplate({ template: CRM_PIPELINE_TEMPLATE, createdByUserId: userInfo.userId });
    return { success: t("shared.saved") };
  } catch (e: any) {
    return { error: e.message ?? "Failed to reset CRM entities" };
  }
};

export default function ResetCrmEntities() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();
  const modal = useRef<RefConfirmModal>(null);

  function onReset() {
    modal.current?.show(
      t("shared.delete"),
      t("shared.confirm"),
      t("shared.cancel"),
      t("Are you sure? This will delete all entities and recreate the CRM pipeline."),
      true
    );
  }

  function onConfirm() {
    const form = new FormData();
    form.append("action", "reset");
    submit(form, { method: "post" });
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Reset CRM Entities</h1>
      <p className="text-sm text-muted-foreground">
        This will delete all existing entities and recreate Companies, Persons, Opportunities, and Tickets with default properties and relationships.
      </p>
      <ButtonPrimary destructive onClick={onReset}>
        {t("shared.delete")} &amp; Recreate CRM Entities
      </ButtonPrimary>
      <ConfirmModal ref={modal} destructive onYes={onConfirm} />
      <ActionResultModal actionData={actionData} />
    </div>
  );
}

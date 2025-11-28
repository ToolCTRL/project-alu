import { redirect } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { PageBlockActionArgs } from "~/modules/pageBlocks/dtos/PageBlockActionArgs";
import { PageBlockLoaderArgs } from "~/modules/pageBlocks/dtos/PageBlockLoaderArgs";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { getAllEntities, getEntityByName } from "~/utils/db/entities/entities.db.server";
import { getEntityPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import RowHelper from "~/utils/helpers/RowHelper";
import { getUserInfo } from "~/utils/session.server";
import { BlockVariableService } from "../../../shared/variables/BlockVariableService.server";
import { RowsNewBlockData } from "./RowsNewBlockUtils";
import EntityHelper from "~/utils/helpers/EntityHelper";

type CreateFormValues = {
  entityName: string;
  tenantId: string | null;
  redirectTo: string;
  onCreatedRedirect: FormDataEntryValue | null;
};

function parseCreateForm(form: FormData): CreateFormValues {
  const entityNameValue = form.get("rows-entity");
  const tenantIdValue = form.get("rows-tenant");
  const redirectToValue = form.get("rows-redirectTo");

  return {
    entityName: typeof entityNameValue === "string" ? entityNameValue : "",
    tenantId: typeof tenantIdValue === "string" && tenantIdValue !== "" ? tenantIdValue : null,
    redirectTo: typeof redirectToValue === "string" ? redirectToValue : "",
    onCreatedRedirect: form.get("onCreatedRedirect"),
  };
}

function resolveOnCreatedRoute(entity: any, routes: ReturnType<typeof EntityHelper.getRoutes>) {
  if (!entity?.onCreated || entity.onCreated === "redirectToOverview") return routes?.overview;
  if (entity.onCreated === "redirectToEdit") return routes?.edit;
  if (entity.onCreated === "redirectToList") return routes?.list;
  if (entity.onCreated === "redirectToNew") return "NEW_REPLACE";
  return null;
}

async function handlePostCreateRedirect({
  formValues,
  entity,
  newRow,
  request,
  params,
}: {
  formValues: CreateFormValues;
  entity: any;
  newRow: any;
  request: Request;
  params: any;
}) {
  if (formValues.redirectTo) {
    return redirect(formValues.redirectTo.replace(":id", newRow.id.toString()));
  }

  if (!formValues.onCreatedRedirect) {
    return Response.json({ newRow });
  }

  if (formValues.onCreatedRedirect === "addAnother") {
    return Response.json({ saveAndAdd: true, newRow });
  }

  const routes = EntityHelper.getRoutes({ routes: EntitiesApi.getNoCodeRoutes({ request, params }), entity, item: newRow });
  if (!routes) return Response.json({ newRow });

  const destination = resolveOnCreatedRoute(entity, routes);
  if (destination === "NEW_REPLACE") {
    return Response.json({ newRow, replace: true });
  }
  if (destination) {
    return redirect(destination);
  }
  return Response.json({ newRow });
}

export namespace RowsNewBlockService {
  export async function load({ request, params, block }: PageBlockLoaderArgs): Promise<RowsNewBlockData> {
    const entityName = BlockVariableService.getValue({ request, params, variable: block?.rowsNew?.variables?.entityName });
    const tenantId = BlockVariableService.getValue({ request, params, variable: block?.rowsNew?.variables?.tenantId });

    const userId = (await getUserInfo(request)).userId;
    const entity = await getEntityByName({ tenantId, name: entityName });
    const entityData = await EntitiesApi.get({
      entity,
      tenantId,
      userId,
    });
    return {
      entityData,
      allEntities: await getAllEntities({ tenantId }),
      relationshipRows: await RowsApi.getRelationshipRows({ entity, tenantId, userId }),
    };
  }
  export async function create({ request, params, form }: PageBlockActionArgs) {
    const formValues = parseCreateForm(form);

    const userInfo = await getUserInfo(request);
    const entity = await getEntityByName({ tenantId: formValues.tenantId, name: formValues.entityName });

    const { t } = await getTranslations(request);
    await verifyUserHasPermission(request, getEntityPermission(entity, "create"), formValues.tenantId);
    const rowValues = RowHelper.getRowPropertiesFromForm({ t, entity, form });
    const newRow = await RowsApi.create({
      entity,
      tenantId: formValues.tenantId,
      userId: userInfo.userId,
      rowValues,
    });
    return handlePostCreateRedirect({ formValues, entity, newRow, request, params });
  }
}

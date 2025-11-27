import { ActionFunction, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import { Colors } from "~/application/enums/shared/Colors";
import PropertyForm from "~/components/entities/properties/PropertyForm";
import { getTranslations } from "~/locale/i18next.server";
import { getAllFormulas } from "~/modules/formulas/db/formulas.db.server";
import { FormulaDto } from "~/modules/formulas/dtos/FormulaDto";
import FormulaHelpers from "~/modules/formulas/utils/FormulaHelpers";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { PropertyWithDetails, EntityWithDetails, getEntityBySlug } from "~/utils/db/entities/entities.db.server";
import { deleteProperty, getProperty, updateProperty, updatePropertyAttributes, updatePropertyOptions } from "~/utils/db/entities/properties.db.server";
import { validateProperty } from "~/utils/helpers/PropertyHelper";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

type LoaderData = {
  entity: EntityWithDetails;
  item: PropertyWithDetails;
  formulas: FormulaDto[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const tenantId = await getTenantIdOrNull({ request, params });
  const entity = await getEntityBySlug({ tenantId, slug: params.entity ?? "" });
  const item = await getProperty(params.id ?? "");
  if (!item || item.tenantId !== tenantId) {
    return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}`));
  }
  const data: LoaderData = {
    entity,
    item,
    formulas: (await getAllFormulas()).map((formula) => FormulaHelpers.getFormulaDto(formula)),
  };
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });

async function validatePropertyData(
  name: string,
  title: string,
  type: PropertyType,
  formulaId: string | null,
  entity: EntityWithDetails,
  existing: PropertyWithDetails
) {
  if (["id", "folio", "createdAt", "createdByUser", "sort", "page", "q", "v", "redirect", "tags"].includes(name)) {
    return name + " is a reserved property name";
  }
  if ([PropertyType.FORMULA].includes(type) && !formulaId) {
    return "Select a formula";
  }
  const errors = await validateProperty(name, title, entity.properties, existing);
  if (errors.length > 0) {
    return errors.join(", ");
  }
  return null;
}

async function handleEditProperty(params: any, form: FormData, existing: PropertyWithDetails, entity: EntityWithDetails) {
  const name = typeof form.get("name") === "string" ? form.get("name") : "";
  const title = typeof form.get("title") === "string" ? form.get("title") : "";
  const type = Number(form.get("type")) as PropertyType;
  const subtype = (typeof form.get("subtype") === "string" ? form.get("subtype") : "") || null;
  const order = Number(form.get("order"));
  let isRequired = Boolean(form.get("is-required"));
  const isHidden = Boolean(form.get("is-hidden"));
  const isDisplay = Boolean(form.get("is-display"));
  const isReadOnly = Boolean(form.get("is-read-only"));
  const canUpdate = Boolean(form.get("can-update"));
  const showInCreate = Boolean(form.get("show-in-create"));
  const formulaValue = form.get("formula-id");
  const formulaIdRaw = typeof formulaValue === "string" ? formulaValue : "";
  let formulaId = formulaIdRaw || null;

  if (type === PropertyType.FORMULA) {
    isRequired = false;
  } else {
    formulaId = null;
  }

  const validationError = await validatePropertyData(name, title, type, formulaId, entity, existing);
  if (validationError) {
    return badRequest({ error: validationError });
  }

  if (name?.includes(" ")) {
    return badRequest({ error: "Property names cannot contain spaces" });
  }
  if (name?.includes("-")) {
    return badRequest({ error: "Property names cannot contain: -" });
  }

  const options: { order: number; value: string; name?: string; color?: Colors }[] = form.getAll("options[]").map((f: FormDataEntryValue) => {
    if (typeof f !== "string") {
      throw new TypeError("options[] entries must be JSON strings");
    }
    return JSON.parse(f);
  });
  const attributes: { name: string; value: string }[] = form.getAll("attributes[]").map((f: FormDataEntryValue) => {
    if (typeof f !== "string") {
      throw new TypeError("attributes[] entries must be JSON strings");
    }
    return JSON.parse(f);
  });

  try {
    await updateProperty(params.id ?? "", {
      name,
      title,
      type,
      subtype,
      order,
      isDefault: existing?.isDefault ?? false,
      isRequired,
      isHidden,
      isDisplay,
      isReadOnly,
      canUpdate,
      showInCreate,
      formulaId,
    });
    await updatePropertyOptions(params.id ?? "", options);
    await updatePropertyAttributes(params.id ?? "", attributes);
    return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}`));
  } catch (e: any) {
    return badRequest({ error: e.message });
  }
}

async function handleDeleteProperty(params: any, form: FormData, t: any) {
  const idValue = form.get("id");
  const id = typeof idValue === "string" ? idValue : "";
  const existingProperty = await getProperty(id);
  if (!existingProperty) {
    return badRequest({ error: t("shared.notFound") });
  }
  await deleteProperty(id);
  return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}`));
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdOrNull({ request, params });

  const entity = await getEntityBySlug({ tenantId, slug: params.entity ?? "" });

  const existing = await getProperty(params.id ?? "");
  if (!existing || existing.tenantId !== tenantId) {
    return badRequest({ error: t("shared.notFound") });
  }

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  if (action === "edit") {
    return handleEditProperty(params, form, existing, entity);
  }
  if (action === "delete") {
    return handleDeleteProperty(params, form, t);
  }
  return badRequest({ error: t("shared.invalidForm") });
};

export default function EditEntityPropertyRoute() {
  const data = useLoaderData<LoaderData>();
  const appOrAdminData = useAppOrAdminData();
  return <PropertyForm item={data.item} properties={[]} entities={appOrAdminData.entities} formulas={data.formulas} />;
}

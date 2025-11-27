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
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { validateProperty } from "~/utils/helpers/PropertyHelper";

type LoaderData = {
  entity: EntityWithDetails;
  item: PropertyWithDetails;
  formulas: FormulaDto[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity ?? "" });
  const item = await getProperty(params.id ?? "");
  if (!item) {
    return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/properties`));
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

const stringOrEmpty = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

function validatePropertyName(name: string) {
  const reservedNames = ["id", "folio", "createdAt", "createdByUser", "sort", "page", "q", "v", "redirect", "tags"];
  if (reservedNames.includes(name)) {
    return `${name} is a reserved property name`;
  }
  if (name?.includes(" ")) {
    return "Property names cannot contain spaces";
  }
  if (name?.includes("-")) {
    return "Property names cannot contain: -";
  }
  return null;
}

function processFormData(form: FormData, type: PropertyType) {
  let isRequired = Boolean(form.get("is-required"));
  const formulaIdValue = form.get("formula-id");
  let formulaId = stringOrEmpty(formulaIdValue);

  if (type === PropertyType.FORMULA) {
    isRequired = false;
  } else {
    formulaId = "";
  }

  return { isRequired, formulaId };
}

async function handleEdit(
  params: any,
  form: FormData,
  name: string,
  title: string,
  type: PropertyType,
  existing: PropertyWithDetails | null,
  entity: EntityWithDetails
) {
  const nameError = validatePropertyName(name);
  if (nameError) {
    return badRequest({ error: nameError });
  }

  const subtype = stringOrEmpty(form.get("subtype"));
  const order = Number(form.get("order"));
  const isHidden = Boolean(form.get("is-hidden"));
  const isDisplay = Boolean(form.get("is-display"));
  const isReadOnly = Boolean(form.get("is-read-only"));
  const canUpdate = Boolean(form.get("can-update"));
  const showInCreate = Boolean(form.get("show-in-create"));
  const { isRequired, formulaId } = processFormData(form, type);

  const options: { order: number; value: string; name?: string; color?: Colors }[] = form.getAll("options[]").map((f: FormDataEntryValue) => {
    const value = typeof f === "string" ? f : f.toString();
    return JSON.parse(value);
  });

  const attributes: { name: string; value: string }[] = form.getAll("attributes[]").map((f: FormDataEntryValue) => {
    const value = typeof f === "string" ? f : f.toString();
    return JSON.parse(value);
  });

  if (type === PropertyType.FORMULA && formulaId === "") {
    return badRequest({ error: "Select a formula" });
  }

  const errors = await validateProperty(name, title, entity.properties, existing);
  if (errors.length > 0) {
    return badRequest({ error: errors.join(", ") });
  }

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
  return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/properties`));
}

async function handleDelete(params: any, form: FormData, t: any) {
  await verifyUserHasPermission(request, "admin.entities.delete");
  const id = stringOrEmpty(form.get("id"));
  const existingProperty = await getProperty(id);
  if (!existingProperty) {
    return badRequest({ error: t("shared.notFound") });
  }
  await deleteProperty(id);
  return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/properties`));
}

export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.entities.update");
  const { t } = await getTranslations(request);

  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity ?? "" });
  const existing = await getProperty(params.id ?? "");

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const name = form.get("name")?.toString() ?? "";
  const title = form.get("title")?.toString() ?? "";
  const type = Number(form.get("type")) as PropertyType;

  if (action === "edit") {
    try {
      return await handleEdit(params, form, name, title, type, existing, entity);
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  }

  if (action === "delete") {
    return await handleDelete(params, form, t);
  }

  return badRequest({ error: t("shared.invalidForm") });
};

export default function EditEntityPropertyRoute() {
  const data = useLoaderData<LoaderData>();
  const appOrAdminData = useAppOrAdminData();
  return <PropertyForm item={data.item} properties={[]} entities={appOrAdminData.entities} formulas={data.formulas} />;
}

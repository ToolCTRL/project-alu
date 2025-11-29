import { ActionFunctionArgs, LoaderFunctionArgs, useActionData, useLoaderData, useSearchParams, useSubmit } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { TenantWithDetails, adminGetAllTenants, getTenant } from "~/utils/db/tenants.db.server";
import TableSimple from "~/components/ui/tables/TableSimple";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import NumberUtils from "~/utils/shared/NumberUtils";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import EntitiesSingleton from "~/modules/rows/repositories/EntitiesSingleton";
import { toast } from "sonner";
import { db } from "~/utils/db.server";
import MenuWithPopper from "~/components/ui/dropdowns/MenuWithPopper";
import { ApiKey, Prisma, Row, RowValue } from "@prisma/client";
import { Colors } from "~/application/enums/shared/Colors";
import InputCombobox from "~/components/ui/input/InputCombobox";
import { DefaultEntityTypes } from "~/application/dtos/shared/DefaultEntityTypes";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type TenantDataDto = {
  entity: EntityWithDetails;
  tenant: TenantWithDetails;
  activeRows: number;
  shadowRows: number;
};
type LoaderData = {
  allEntities: EntityWithDetails[];
  allTenants: TenantWithDetails[];
  items: TenantDataDto[];
  isDevelopment: boolean;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const allEntities = await getAllEntities({ tenantId: null, types: [DefaultEntityTypes.All, DefaultEntityTypes.AppOnly] });
  const allTenants = await adminGetAllTenants();
  const items: TenantDataDto[] = [];
  const activeRows = await db.row.groupBy({
    by: ["entityId", "tenantId"],
    _count: { id: true },
    where: { deletedAt: null },
  });
  const shadowRows = await db.row.groupBy({
    by: ["entityId", "tenantId"],
    _count: { id: true },
    where: { deletedAt: { not: null } },
  });
  for (const entity of allEntities) {
    for (const tenant of allTenants) {
      items.push({
        entity,
        tenant,
        activeRows: activeRows.find((f) => f.entityId === entity.id && f.tenantId === tenant.id)?._count?.id ?? 0,
        shadowRows: shadowRows.find((f) => f.entityId === entity.id && f.tenantId === tenant.id)?._count?.id ?? 0,
      });
    }
  }
  const data: LoaderData = {
    allEntities,
    allTenants,
    items,
    isDevelopment: process.env.NODE_ENV !== "production",
  };
  return data;
};

const BATCH_SIZE = 10_000;

type ActionData = {
  error?: string;
  success?: string;
};
async function handleCreateRows(
  entity: EntityWithDetails,
  tenant: TenantWithDetails,
  numberOfRows: number,
  type: string | undefined,
  t: any
) {
  const status = { totalRows: 0 };
  const start = performance.now();
  const apiKeys = type === "apiKeyLog" ? await db.apiKey.findMany({ where: { tenantId: tenant.id } }) : [];

  for (let i = 0; i < numberOfRows; i += BATCH_SIZE) {
    await Promise.all(
      Array.from({ length: Math.min(BATCH_SIZE, numberOfRows - i) }).map(async (_, idx) => {
        if (type === "apiKeyLog") {
          await createFakeApiKeyLog({ entity, tenantId: tenant.id, idx: i + idx, status, apiKeys });
        } else {
          await createFakeRow({ entity, tenantId: tenant.id, idx: i + idx, status });
        }
      })
    );
  }

  const end = performance.now();
  const formattedTime = `${NumberUtils.intFormat(end - start)}ms`;
  return Response.json({ success: `${status.totalRows} ${t(entity.titlePlural)} created (${tenant.name}) in ${formattedTime}` });
}

async function handleUpdateRows(entity: EntityWithDetails, tenant: TenantWithDetails, numberOfRows: number, t: any) {
  const start = performance.now();
  let rows = await db.row.findMany({
    where: { entityId: entity.id, tenantId: tenant.id, deletedAt: null },
    include: { values: true },
  });
  rows = rows.slice(0, numberOfRows);
  if (rows.length === 0) {
    return Response.json({ error: "No rows found" }, { status: 400 });
  }

  const status = { totalRows: 0 };
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    await Promise.all(
      rows.slice(i, i + BATCH_SIZE).map(async (row, idx) => {
        await updateFakeRow(row, { entity, idx: i + idx, status });
      })
    );
  }

  const end = performance.now();
  const formattedTime = `${NumberUtils.intFormat(end - start)}ms`;
  return Response.json({ success: `${status.totalRows} ${t(entity.titlePlural)} updated (${tenant.name}) in ${formattedTime}` });
}

async function handleDeleteRows(entity: EntityWithDetails, tenant: TenantWithDetails, numberOfRows: number, shadow: boolean, t: any) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not allowed in production" }, { status: 400 });
  }

  let rowsToDelete = await db.row.findMany({
    where: { entityId: entity.id, tenantId: tenant.id, ...(shadow ? { deletedAt: null } : {}) },
  });
  rowsToDelete = rowsToDelete.slice(0, numberOfRows);
  if (rowsToDelete.length === 0) {
    return Response.json({ error: "No rows found" }, { status: 400 });
  }

  const start = performance.now();
  for (let i = 0; i < rowsToDelete.length; i += BATCH_SIZE) {
    if (shadow) {
      await db.row.updateMany({
        where: { id: { in: rowsToDelete.slice(i, i + BATCH_SIZE).map((f) => f.id) } },
        data: { deletedAt: new Date() },
      });
    } else {
      await db.row.deleteMany({
        where: { id: { in: rowsToDelete.slice(i, i + BATCH_SIZE).map((f) => f.id) } },
      });
    }
  }

  const end = performance.now();
  const formattedTime = `${NumberUtils.intFormat(end - start)}ms`;
  return Response.json({ success: `${rowsToDelete.length} ${t(entity.titlePlural)} deleted (${tenant.name}) in ${formattedTime}` });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();
  const allEntities = await getAllEntities({ tenantId: null });
  const entityId = form.get("entityId")?.toString() ?? "";
  const tenantId = form.get("tenantId")?.toString() ?? "";
  const entity = allEntities.find((e) => e.id === entityId);
  if (!entity) {
    return Response.json({ error: "Entity not found" }, { status: 400 });
  }
  const tenant = await getTenant(tenantId);
  if (!tenant) {
    return Response.json({ error: "Tenant not found" }, { status: 400 });
  }

  try {
    const numberOfRows = Number(form.get("numberOfRows")?.toString());
    if (action === "create-rows") {
      const type = form.get("type")?.toString();
      return await handleCreateRows(entity, tenant, numberOfRows, type, t);
    } else if (action === "update-rows") {
      return await handleUpdateRows(entity, tenant, numberOfRows, t);
    } else if (action === "delete-rows") {
      return await handleDeleteRows(entity, tenant, numberOfRows, false, t);
    } else if (action === "shadow-delete-rows") {
      return await handleDeleteRows(entity, tenant, numberOfRows, true, t);
    }
    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};

function createFakePropertyValue(property: any, idx: number): Prisma.RowValueUncheckedCreateWithoutRowInput {
  const propertyId = property.id;
  const typeHandlers: Record<PropertyType, () => Prisma.RowValueUncheckedCreateWithoutRowInput> = {
    [PropertyType.TEXT]: () => ({ propertyId, textValue: `Fake ${idx}` }),
    [PropertyType.NUMBER]: () => ({ propertyId, numberValue: idx.toString() }),
    [PropertyType.BOOLEAN]: () => ({ propertyId, booleanValue: idx % 2 === 0 }),
    [PropertyType.DATE]: () => ({ propertyId, dateValue: new Date().toISOString() }),
    [PropertyType.SELECT]: () => {
      const firstOption = property.options.length > 0 ? property.options[0] : null;
      return { propertyId, textValue: firstOption?.value ?? idx.toString() };
    },
    [PropertyType.MEDIA]: () => ({ propertyId, media: { create: { title: "Fake", name: "Fake", file: "Fake", type: "Fake" } } }),
    [PropertyType.RANGE_DATE]: () => ({ propertyId, range: { create: { dateMin: new Date(), dateMax: new Date(), numberMin: null, numberMax: null } } }),
    [PropertyType.RANGE_NUMBER]: () => ({ propertyId, range: { create: { dateMin: null, dateMax: null, numberMin: 1, numberMax: 2 } } }),
  };

  const handler = typeHandlers[property.type as PropertyType];
  if (!handler) {
    throw new TypeError(`[Unknown] Unknown property type ${PropertyType[property.type]}`);
  }
  return handler();
}

async function ensureFakeRowTag(entity: EntityWithDetails) {
  let tag = entity.tags.find((f) => f.value === "fake-row");
  if (!tag) {
    tag = await db.entityTag.create({
      data: {
        entityId: entity.id,
        value: "fake-row",
        color: Colors.RED,
      },
    });
    entity.tags.push(tag);
  }
  tag = entity.tags.find((f) => f.value === "fake-row");
  if (!tag) {
    throw new TypeError("Could not create tag: fake-row");
  }
  return tag;
}

async function createFakeRow({ entity, tenantId, idx, status }: { entity: EntityWithDetails; tenantId: string; idx: number; status: { totalRows: number } }) {
  const tag = await ensureFakeRowTag(entity);
  const values = entity.properties.map((property) => createFakePropertyValue(property, idx));
  const row = await db.row.create({
    data: {
      entityId: entity.id,
      tenantId,
      folio: idx,
      order: idx,
      values: {
        create: values,
      },
      permissions: { create: { tenantId, access: "delete" } },
      tags: { create: { tagId: tag.id } },
    },
  });
  status.totalRows++;

  await Promise.all(
    entity.childEntities.map(async (childRel) => {
      const childEntity = EntitiesSingleton.getInstance()
        .getEntities()
        .find((e) => e.id === childRel.childId);
      if (!childEntity) {
        return;
      }
      const childRow = await createFakeRow({ entity: childEntity, tenantId, idx, status });
      status.totalRows++;

      return await db.rowRelationship.create({
        data: {
          relationshipId: childRel.id,
          parentId: row.id,
          childId: childRow.id,
          metadata: null,
        },
      });
    })
  );
  return row;
}

async function createFakeApiKeyLog({
  entity,
  tenantId,
  idx,
  status,
  apiKeys,
}: {
  entity: EntityWithDetails;
  tenantId: string;
  idx: number;
  status: { totalRows: number };
  apiKeys: ApiKey[];
}) {
  if (apiKeys.length === 0) {
    throw new TypeError("No API keys found");
  }
  const firstApiKey = apiKeys[0];
  const apiKeyLog = await db.apiKeyLog.create({
    data: {
      apiKeyId: firstApiKey.id,
      tenantId,
      ip: "fake-ip",
      endpoint: "/fake-endpoint",
      method: "fake-method",
      params: `{ "fake": "params" }`,
      status: 200,
      duration: 1, // 1 ms
      error: null,
    },
  });
  status.totalRows++;
  return apiKeyLog;
}

function createUpdatePropertyValue(property: any, value: RowValue, idx: number): Prisma.RowValueUpdateWithWhereUniqueWithoutRowInput | null {
  const typeHandlers: Record<PropertyType, () => Prisma.RowValueUpdateWithWhereUniqueWithoutRowInput> = {
    [PropertyType.TEXT]: () => ({ where: { id: value.id }, data: { textValue: "Updated " + value.textValue } }),
    [PropertyType.NUMBER]: () => ({ where: { id: value.id }, data: { numberValue: idx + 100 } }),
    [PropertyType.BOOLEAN]: () => ({ where: { id: value.id }, data: { booleanValue: idx % 2 !== 0 } }),
    [PropertyType.DATE]: () => ({ where: { id: value.id }, data: { dateValue: new Date().toISOString() } }),
    [PropertyType.SELECT]: () => {
      const firstOption = property.options.length > 0 ? property.options[0] : null;
      return { where: { id: value.id }, data: { textValue: firstOption?.value ?? idx.toString() } };
    },
    [PropertyType.MEDIA]: () => ({ where: { id: value.id }, data: { media: { create: { title: "Fake", name: "Fake", file: "Fake", type: "Fake" } } } }),
    [PropertyType.RANGE_DATE]: () => ({ where: { id: value.id }, data: { range: { create: { dateMin: new Date(), dateMax: new Date(), numberMin: null, numberMax: null } } } }),
    [PropertyType.RANGE_NUMBER]: () => ({ where: { id: value.id }, data: { range: { create: { dateMin: null, dateMax: null, numberMin: 1, numberMax: 2 } } } }),
  };

  const handler = typeHandlers[property.type as PropertyType];
  if (!handler) {
    throw new TypeError(`[Unknown] Unknown property type ${PropertyType[property.type]}`);
  }
  return handler();
}

async function updateFakeRow(
  row: Row & { values: RowValue[] },
  { entity, idx, status }: { entity: EntityWithDetails; idx: number; status: { totalRows: number } }
) {
  const values: Prisma.RowValueUpdateWithWhereUniqueWithoutRowInput[] = [];
  for (const property of entity.properties) {
    const value = row.values.find((f) => f.propertyId === property.id);
    if (!value) {
      continue;
    }
    const updateValue = createUpdatePropertyValue(property, value, idx);
    if (updateValue) {
      values.push(updateValue);
    }
  }
  await db.row.update({
    where: { id: row.id },
    data: {
      values: {
        update: values,
      },
    },
  });
  status.totalRows++;

  return row;
}

interface ActionsCellProps {
  readonly item: TenantDataDto;
  readonly onCreateRows: (item: TenantDataDto, numberOfRows: number, type?: "apiKeyLog") => void;
  readonly onUpdateRows: (item: TenantDataDto, numberOfRows: number) => void;
  readonly onDeleteRows: (item: TenantDataDto, options: { shadow: boolean; numberOfRows: number }) => void;
}

function ActionsCell({ item, onCreateRows, onUpdateRows, onDeleteRows }: ActionsCellProps) {
  return (
    <div className="flex items-center space-x-2">
      <MenuWithPopper
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hover:bg-secondary border-border bg-background rounded-md border px-2 py-1.5 font-medium"
        options={[1, 10, 100, 1_000, 10_000, 100_000].map((numberOfRows) => {
          const formattedCount = NumberUtils.intFormat(numberOfRows);
          return {
            title: numberOfRows === 1 ? "1 row" : `${formattedCount} rows`,
            onClick: () => onCreateRows(item, numberOfRows),
          };
        })}
        button={<>Create</>}
      />
      <MenuWithPopper
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hover:bg-secondary border-border bg-background rounded-md border px-2 py-1.5 font-medium"
        options={[1, 10, 100, 1_000, 10_000, 100_000].map((numberOfRows) => {
          const formattedCount = NumberUtils.intFormat(numberOfRows);
          return {
            title: numberOfRows === 1 ? "1 row" : `${formattedCount} rows`,
            onClick: () => onUpdateRows(item, numberOfRows),
          };
        })}
        button={<>Update</>}
      />
      <MenuWithPopper
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hover:bg-secondary border-border bg-background rounded-md border px-2 py-1.5 font-medium"
        options={[1, 10, 100, 1_000, 10_000, 100_000].map((numberOfRows) => {
          const formattedCount = NumberUtils.intFormat(numberOfRows);
          return {
            title: numberOfRows === 1 ? "1 row" : `${formattedCount} rows`,
            onClick: () => onDeleteRows(item, { shadow: true, numberOfRows }),
            className: "text-orange-600",
          };
        })}
        button={<>Shadow Delete</>}
      />
      <MenuWithPopper
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hover:bg-secondary border-border bg-background rounded-md border px-2 py-1.5 font-medium"
        options={[1, 10, 100, 1_000, 10_000, 100_000].map((numberOfRows) => {
          const formattedCount = NumberUtils.intFormat(numberOfRows);
          return {
            title: numberOfRows === 1 ? "1 row" : `${formattedCount} rows`,
            onClick: () => onDeleteRows(item, { shadow: false, numberOfRows }),
            className: "text-red-600",
          };
        })}
        button={<>Delete</>}
      />
      <MenuWithPopper
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hover:bg-secondary border-border bg-background rounded-md border px-2 py-1.5 font-medium"
        options={[1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000].map((numberOfRows) => {
          const formattedCount = NumberUtils.intFormat(numberOfRows);
          return {
            title: numberOfRows === 1 ? "1 API log" : `${formattedCount} API logs`,
            onClick: () => onCreateRows(item, numberOfRows, "apiKeyLog"),
          };
        })}
        button={<>Create API Logs</>}
      />
    </div>
  );
}

export default function FakeRowsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }
  }, [actionData]);

  function getTenantIds() {
    const ids = searchParams.get("tenantIds")?.split(",") ?? [];
    return ids.filter(Boolean);
  }

  function getEntityIds() {
    const ids = searchParams.get("entityIds")?.split(",") ?? [];
    return ids.filter(Boolean);
  }

  function filteredItems() {
    const tenantIds = getTenantIds();
    const entityIds = getEntityIds();
    return data.items.filter((f) => {
      if (!tenantIds.includes(f.tenant.id)) {
        return false;
      }
      if (!entityIds.includes(f.entity.id)) {
        return false;
      }
      return true;
    });
  }

  const onCreateRows = useCallback((item: TenantDataDto, numberOfRows: number, type?: "apiKeyLog") => {
    const form = new FormData();
    form.set("action", "create-rows");
    form.set("entityId", item.entity.id);
    form.set("tenantId", item.tenant.id);
    form.set("numberOfRows", String(numberOfRows));
    if (type) {
      form.set("type", type);
    }
    submit(form, {
      method: "post",
    });
  }, [submit]);

  const onUpdateRows = useCallback((item: TenantDataDto, numberOfRows: number) => {
    const form = new FormData();
    form.set("action", "update-rows");
    form.set("entityId", item.entity.id);
    form.set("tenantId", item.tenant.id);
    form.set("numberOfRows", String(numberOfRows));
    submit(form, {
      method: "post",
    });
  }, [submit]);

  const onDeleteRows = useCallback((item: TenantDataDto, { shadow, numberOfRows }: { shadow: boolean; numberOfRows: number }) => {
    const form = new FormData();
    if (shadow) {
      form.set("action", "shadow-delete-rows");
    } else {
      form.set("action", "delete-rows");
    }
    form.set("entityId", item.entity.id);
    form.set("tenantId", item.tenant.id);
    form.set("numberOfRows", String(numberOfRows));

    submit(form, {
      method: "post",
    });
  }, [submit]);

  const tableHeaders = useMemo(
    () => [
      {
        name: "entity",
        title: "Entity",
        value: (i: TenantDataDto) => t(i.entity.title),
      },
      {
        name: "tenant",
        title: "Tenant",
        className: "w-full",
        value: (i: TenantDataDto) => i.tenant.name,
      },
      {
        name: "activeRows",
        title: "Active Rows",
        value: (i: TenantDataDto) => NumberUtils.intFormat(i.activeRows),
      },
      {
        name: "shadowRows",
        title: "Shadow Rows",
        value: (i: TenantDataDto) => NumberUtils.intFormat(i.shadowRows),
      },
      {
        name: "totalRows",
        title: "Total Rows",
        value: (i: TenantDataDto) => NumberUtils.intFormat(i.activeRows + i.shadowRows),
      },
      {
        name: "actions",
        title: "",
        value: (i: TenantDataDto) => (
          <ActionsCell item={i} onCreateRows={onCreateRows} onUpdateRows={onUpdateRows} onDeleteRows={onDeleteRows} />
        ),
      },
    ],
    [onCreateRows, onDeleteRows, onUpdateRows, t]
  );
  return (
    <EditPageLayout title="Testing">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <InputCombobox
            title="Tenants"
            value={getTenantIds()}
            selectPlaceholder="Select tenants"
            options={data.allTenants.map((f) => {
              return {
                value: f.id,
                name: f.name,
              };
            })}
            onChange={(value) => {
              if (value) {
                searchParams.set("tenantIds", value.join(","));
              } else {
                searchParams.delete("tenantIds");
              }
              setSearchParams(searchParams);
            }}
          />

          <InputCombobox
            title="Entities"
            value={getEntityIds()}
            selectPlaceholder="Select entities"
            options={data.allEntities.map((f) => {
              return {
                value: f.id,
                name: f.name,
              };
            })}
            onChange={(value) => {
              if (value) {
                searchParams.set("entityIds", value.join(","));
              } else {
                searchParams.delete("entityIds");
              }
              setSearchParams(searchParams);
            }}
          />
        </div>
        {filteredItems().length === 0 ? (
          <div>Select at least one tenant and one entity</div>
        ) : (
          <TableSimple
            items={filteredItems()}
            headers={tableHeaders}
          />
        )}
      </div>
    </EditPageLayout>
  );
}

import { ActionFunction, LoaderFunctionArgs, useLoaderData, Link } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import TableSimple from "~/components/ui/tables/TableSimple";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { getRowsWithPagination } from "~/utils/helpers/.server/RowPaginationService";
import { useTranslation } from "react-i18next";
import RowHelper from "~/utils/helpers/RowHelper";
import DateUtils from "~/utils/shared/DateUtils";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import InputFilters from "~/components/ui/input/InputFilters";
import ActivityHistoryIcon from "~/components/ui/icons/entities/ActivityHistoryIcon";
import { adminGetAllTenantsIdsAndNames } from "~/utils/db/tenants.db.server";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { useCallback, useMemo } from "react";

type LoaderData = {
  items: RowWithDetails[];
  pagination: PaginationDto;
  entities: EntityWithDetails[];
  filterableProperties: FilterablePropertyDto[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const { t } = await getTranslations(request);
  const entities = await getAllEntities({ tenantId: null });
  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "entity",
      title: t("models.entity.object"),
      options: entities.map((i) => {
        return {
          value: i.id,
          name: i.name,
        };
      }),
    },
    {
      name: "tenantId",
      title: t("models.tenant.object"),
      options: [
        { name: "{Admin}", value: "null" },
        ...(await adminGetAllTenantsIdsAndNames()).map((i) => {
          return { value: i.id, name: i.name };
        }),
      ],
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const filterTenantId = filters.properties.find((f) => f.name === "tenantId")?.value;
  const { items, pagination } = await getRowsWithPagination({
    page: currentPagination.page,
    pageSize: currentPagination.pageSize,
    rowWhere: {
      entityId: filters.properties.find((f) => f.name === "entity")?.value ?? undefined,
      tenantId: filterTenantId === "null" ? null : filterTenantId ?? undefined,
    },
  });
  const data: LoaderData = {
    entities,
    items,
    pagination,
    filterableProperties,
  };
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  return badRequest({ error: t("shared.invalidForm") });
};

const formatCreatedAt = (item: RowWithDetails) => (
  <div className="flex flex-col">
    <div>{DateUtils.dateYMD(item.createdAt)}</div>
    <div className="text-xs">{DateUtils.dateAgo(item.createdAt)}</div>
  </div>
);

const TenantCell = ({ item }: { item: RowWithDetails }) =>
  item.tenant ? (
    <Link to={`/app/${item.tenant?.slug}`} className="focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed border-transparent">
      {item.tenant.name}
    </Link>
  ) : (
    <div>-</div>
  );

const LogsCell = ({ item }: { item: RowWithDetails }) => (
  <Link to={`/admin/entities/logs?rowId=${item.id}`}>
    <ActivityHistoryIcon className="hover:text-theme-800 text-muted-foreground h-4 w-4" />
  </Link>
);

const DetailsCell = ({ item }: { item: RowWithDetails }) => <ShowPayloadModalButton title="Details" description={"Details"} payload={JSON.stringify(item)} />;

export default function AdminEntityRowsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const findEntity = useCallback((item: RowWithDetails) => data.entities.find((e) => e.id === item.entityId), [data.entities]);
  const renderObject = useCallback((item: RowWithDetails) => <DetailsCell item={item} />, []);
  const renderTenant = useCallback((item: RowWithDetails) => <TenantCell item={item} />, []);
  const renderEntity = useCallback((i: RowWithDetails) => t(findEntity(i)?.title ?? ""), [findEntity, t]);
  const renderFolio = useCallback((i: RowWithDetails) => RowHelper.getRowFolio(findEntity(i), i), [findEntity]);
  const renderDescription = useCallback(
    (i: RowWithDetails) => RowHelper.getTextDescription({ entity: findEntity(i)!, item: i, t }),
    [findEntity, t]
  );
  const renderLogs = useCallback((item: RowWithDetails) => <LogsCell item={item} />, []);
  const renderCreatedBy = useCallback((item: RowWithDetails) => item.createdByUser?.email ?? (item.createdByApiKey ? "API" : "?"), []);
  const renderCreatedAt = useCallback((item: RowWithDetails) => DateUtils.dateAgo(item.createdAt), []);
  const headers = useMemo(
    () => [
      {
        name: "object",
        title: "Object",
        value: renderObject,
      },
      {
        name: "tenant",
        title: t("models.tenant.object"),
        value: renderTenant,
        breakpoint: "sm",
      },
      {
        name: "entity",
        title: t("models.entity.object"),
        value: renderEntity,
      },
      {
        name: "folio",
        title: t("models.row.folio"),
        value: renderFolio,
      },
      {
        name: "description",
        title: t("shared.description"),
        value: renderDescription,
      },
      {
        name: "logs",
        title: t("models.log.plural"),
        value: renderLogs,
      },
      {
        name: "createdByUser",
        title: t("shared.createdBy"),
        value: renderCreatedBy,
        className: "text-muted-foreground text-xs",
        breakpoint: "sm",
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: renderCreatedAt,
        formattedValue: formatCreatedAt,
        className: "text-muted-foreground text-xs",
        breakpoint: "sm",
        sortable: true,
      },
    ],
    [renderCreatedAt, renderCreatedBy, renderDescription, renderEntity, renderFolio, renderLogs, renderObject, renderTenant, t]
  );
  return (
    <div className="mx-auto w-full max-w-5xl space-y-3 px-4 py-2 pb-6 sm:px-6 sm:pt-3 lg:px-8 xl:max-w-full">
      <div className="md:border-border md:border-b md:py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-medium leading-6">{t("models.row.plural")}</h3>
          <div className="flex items-center space-x-2">
            <InputFilters withSearch={false} filters={data.filterableProperties} />
          </div>
        </div>
      </div>

      <TableSimple headers={headers} items={data.items} pagination={data.pagination} />
    </div>
  );
}

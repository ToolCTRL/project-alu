import { Prisma } from "@prisma/client";
import { Params } from "react-router";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { db } from "~/utils/db.server";
import { adminGetAllTenantsIdsAndNames } from "~/utils/db/tenants.db.server";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { ApiCallSummaryDto } from "../dtos/ApiCallSummaryDto";
import ApiKeyLogUtils from "../utils/ApiKeyLogUtils";
import { ApiKeyLogDto } from "../dtos/ApiKeyLogDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";

async function getSummary({ request, params }: { request: Request; params: Params }) {
  const { filterableProperties, whereFilters, allTenants } = await getFilters({ request, params });
  const searchParams = new URL(request.url).searchParams;
  let groupBy = ApiKeyLogUtils.getGroupByValues(searchParams);
  let items: ApiCallSummaryDto[] = [];
  if (groupBy.length > 0) {
    try {
      const data = await db.apiKeyLog.groupBy({
        by: groupBy.map((x) => x as Prisma.ApiKeyLogScalarFieldEnum),
        where: whereFilters,
        _avg: { duration: true },
        _count: { _all: true },
        orderBy: {
          _avg: { duration: "desc" },
        },
      });
      items = data.map((x) => x as ApiCallSummaryDto);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log({ error: e.message });
      throw new Error("Invalid group by: " + groupBy.join(", "));
    }
  }
  return { items, allTenants, filterableProperties };
}

async function getDetails({ request, params }: { request: Request; params: Params }): Promise<{
  items: ApiKeyLogDto[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
}> {
  const { filterableProperties, whereFilters } = await getFilters({ request, params });

  const urlSearchParams = new URL(request.url).searchParams;
  const pagination = getPaginationFromCurrentUrl(urlSearchParams);

  const include: Prisma.ApiKeyLogInclude = {
    apiKey: {
      select: { alias: true, tenant: { select: { id: true, name: true } } },
    },
  };
  if (!whereFilters.tenantId) {
    include.tenant = { select: { id: true, name: true, slug: true } };
  }
  const items = await db.apiKeyLog.findMany({
    take: pagination.pageSize,
    skip: pagination.pageSize * (pagination.page - 1),
    where: whereFilters,
    include,
    orderBy: pagination.sortedBy.length
      ? pagination.sortedBy.map((x) => ({
          [x.name]: x.direction,
        }))
      : { createdAt: "desc" },
  });
  const totalItems = await db.apiKeyLog.count({
    where: whereFilters,
  });

  return {
    items: items as ApiKeyLogDto[],
    filterableProperties,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
    },
  };
}

async function getGroupBys(tenantId: string | null) {
  const allMethods = [
    { name: "GET", value: "GET" },
    { name: "POST", value: "POST" },
    { name: "PUT", value: "PUT" },
    { name: "PATCH", value: "PATCH" },
    { name: "DELETE", value: "DELETE" },
  ];

  return {
    allMethods,
  };
}
async function getFilterableProperties(tenantId: string | null) {
  const { allMethods } = await getGroupBys(tenantId);
  const filterableProperties: FilterablePropertyDto[] = [
    { name: "method", title: "Method", options: allMethods },
    {
      name: "endpoint",
      title: "Endpoint",
    },
    {
      name: "params",
      title: "Params",
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "apiKeyId",
      title: "API Key",
    },
  ];
  let allTenants: { id: string; name: string; slug: string }[] = [];
  if (tenantId === null) {
    allTenants = await adminGetAllTenantsIdsAndNames();
    filterableProperties.unshift({
      name: "tenantId",
      title: "models.tenant.object",
      options: [
        { value: "null", name: "{null}" },
        ...allTenants.map((item) => {
          return {
            value: item.id,
            name: item.name,
          };
        }),
      ],
    });
  }
  return { filterableProperties, allTenants };
}

async function getFilters({ request, params }: { request: Request; params: Params }) {
  const tenantId = await getTenantIdOrNull({ request, params });
  const { filterableProperties, allTenants } = await getFilterableProperties(tenantId);
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const q = filters.query || "";

  const AND_filters: Prisma.ApiKeyLogWhereInput[] = [];
  filterableProperties.forEach((filter) => {
    const value = filters.properties.find((f) => f.name === filter.name)?.value;
    if (value) {
      let formattedValue = filter.name === "status" ? Number(value) : value;
      AND_filters.push({
        [filter.name]: value === "null" ? null : formattedValue,
      });
    }
  });

  const OR_filters: Prisma.ApiKeyLogWhereInput[] = [];
  if (q) {
    OR_filters.push(
      { ip: { contains: q, mode: "insensitive" } },
      { endpoint: { contains: q, mode: "insensitive" } },
      { method: { contains: q, mode: "insensitive" } },
      { params: { contains: q, mode: "insensitive" } },
      { error: { contains: q, mode: "insensitive" } }
    );
  }
  const whereFilters: Prisma.ApiKeyLogWhereInput = {};
  if (OR_filters.length > 0) {
    whereFilters.OR = OR_filters;
  }
  if (AND_filters.length > 0) {
    whereFilters.AND = AND_filters;
  }
  if (tenantId) {
    whereFilters.tenantId = tenantId;
  }

  return { filterableProperties, whereFilters, allTenants };
}

async function deleteMany(ids: string[]) {
  return await db.apiKeyLog.deleteMany({
    where: { id: { in: ids } },
  });
}

export default {
  getSummary,
  getDetails,
  deleteMany,
};

import { Prisma } from "@prisma/client";
import { LoaderFunctionArgs, useLoaderData, Link, useSearchParams } from "react-router";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import ServerError from "~/components/ui/errors/ServerError";
import InputCombobox from "~/components/ui/input/InputCombobox";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { FilterableValueLink } from "~/components/ui/links/FilterableValueLink";
import TableSimple from "~/components/ui/tables/TableSimple";
import SpeedBadge from "~/modules/metrics/components/SpeedBadge";
import MetricService from "~/modules/metrics/services/MetricService";
import { db } from "~/utils/db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import NumberUtils from "~/utils/shared/NumberUtils";

const defaultGroupBy = ["function"];

type ItemDto = {
  userId: string | null;
  tenantId: string | null;
  function: string;
  route: string;
  url: string;
  env: string;
  type: string;
  _avg: {
    duration: number | null;
  };
  _count: {
    _all: number;
  };
};

type LoaderData = {
  items: ItemDto[];
  users: { id: string; email: string }[];
  tenants: { id: string; name: string }[];
  filterableProperties: FilterablePropertyDto[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.metrics.view");
  const { filterableProperties, whereFilters } = await MetricService.getFilters({ request });
  const searchParams = new URL(request.url).searchParams;

  let users: { id: string; email: string }[] = [];
  let tenants: { id: string; name: string }[] = [];

  let groupBy = getGroupByValues(searchParams);
  let items: ItemDto[] = [];
  if (groupBy.length > 0) {
    const data = await db.metricLog.groupBy({
      by: groupBy.map((x) => x as Prisma.MetricLogScalarFieldEnum),
      where: whereFilters,
      _avg: { duration: true },
      _count: { _all: true },
      orderBy: {
        _avg: { duration: "desc" },
      },
    });
    items = data.map((x) => x as ItemDto);
    const userIds: string[] = [];
    const tenantIds: string[] = [];
    for (const item of items) {
      if (item.userId && !userIds.includes(item.userId)) {
        userIds.push(item.userId);
      }
      if (item.tenantId && !tenantIds.includes(item.tenantId)) {
        tenantIds.push(item.tenantId);
      }
    }
    users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true },
    });
    tenants = await db.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, name: true },
    });
  }
  const data: LoaderData = {
    items,
    users,
    tenants,
    filterableProperties,
  };
  return data;
};

function getGroupByValues(searchParams: URLSearchParams) {
  const groupByValues = searchParams
    .getAll("groupBy")
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const groupBy: Prisma.MetricLogScalarFieldEnum[] = [];
  for (const param of groupByValues) {
    if (Object.keys(Prisma.MetricLogScalarFieldEnum).includes(param)) {
      groupBy.push(param as Prisma.MetricLogScalarFieldEnum);
    }
  }
  return groupBy.length > 0 ? groupBy.map((x) => x.toString()) : defaultGroupBy;
}

const FunctionCell = ({ functionName }: { functionName: string }) => (
  <div className={clsx(functionName === "_unidentifiedFunction_" && "text-red-500")}>
    <FilterableValueLink name="function" value={functionName} />
  </div>
);

const CountCell = ({ link, count }: { link: string; count: number }) => (
  <Link to={link} className="hover:underline">
    {NumberUtils.intFormat(count)}
  </Link>
);

const SpeedCell = ({ duration }: { duration: number }) => <SpeedBadge duration={duration} />;

const DurationCell = ({ duration }: { duration: number }) => (
  <div>{NumberUtils.custom(duration, "0,0.001")} ms</div>
);

function makeFilterableValueRenderer(
  name: string,
  valueSelector: (item: ItemDto) => string | null | undefined
): (item: ItemDto) => JSX.Element {
  return (item: ItemDto) => <FilterableValueLink name={name} value={valueSelector(item) ?? ""} />;
}

function buildHeaders({
  groupBy,
  getUser,
  getTenant,
  getCountLink,
}: {
  groupBy: string[];
  getUser: (item: ItemDto) => { id: string; email: string } | undefined;
  getTenant: (item: ItemDto) => { id: string; name: string } | undefined;
  getCountLink: (item: ItemDto, currentGroupBy: string[]) => string;
}): RowHeaderDisplayDto<ItemDto>[] {
  const headerList: RowHeaderDisplayDto<ItemDto>[] = [];
  const currentGroupBy = groupBy.length === 0 ? defaultGroupBy : groupBy;

  if (currentGroupBy.includes("env")) {
    headerList.push({
      name: "env",
      title: "Env",
      value: makeFilterableValueRenderer("env", (item) => item.env),
    });
  }
  if (currentGroupBy.includes("type")) {
    headerList.push({
      name: "type",
      title: "Type",
      value: makeFilterableValueRenderer("type", (item) => item.type),
    });
  }
  if (currentGroupBy.includes("route")) {
    headerList.push({
      name: "route",
      title: "Route name",
      value: makeFilterableValueRenderer("route", (item) => item.route),
    });
  }
  if (currentGroupBy.includes("url")) {
    headerList.push({
      name: "url",
      title: "URL",
      value: makeFilterableValueRenderer("url", (item) => item.url),
    });
  }
  if (currentGroupBy.includes("function")) {
    headerList.push({
      name: "function",
      title: "Function",
      value: (item) => <FunctionCell functionName={item.function} />,
      className: "w-full",
    });
  }
  if (currentGroupBy.includes("userId")) {
    headerList.push({
      name: "userId",
      title: "User",
      value: (item) => <FilterableValueLink name="userId" value={getUser(item)?.email ?? ""} />,
    });
  }
  if (currentGroupBy.includes("tenantId")) {
    headerList.push({
      name: "tenantId",
      title: "Tenant",
      value: (item) => <FilterableValueLink name="tenantId" value={getTenant(item)?.name ?? ""} />,
    });
  }
  headerList.push(
    {
      name: "count",
      title: "Count",
      value: (item) => <CountCell link={getCountLink(item, currentGroupBy)} count={Number(item._count._all)} />,
    },
    {
      name: "speed",
      title: "Speed",
      value: (item) => <SpeedCell duration={Number(item._avg.duration)} />,
    },
    {
      name: "duration",
      title: "Avg. duration",
      value: (item) => <DurationCell duration={Number(item._avg.duration)} />,
    }
  );

  return headerList;
}

export default function MetricsSummary() {
  const data = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupBy, setGroupBy] = useState<string[]>(getGroupByValues(searchParams));
  const getUser = useCallback((item: ItemDto) => data.users.find((x) => x.id === item.userId), [data.users]);
  const getTenant = useCallback((item: ItemDto) => data.tenants.find((x) => x.id === item.tenantId), [data.tenants]);
  const getCountLink = useCallback(
    (item: ItemDto, currentGroupBy: string[]) => {
      const searchParams = new URLSearchParams();
      searchParams.set("pageSize", "100");
      currentGroupBy.forEach((groupBy) => {
        if (groupBy === "function") {
          searchParams.append("function", item.function);
        } else if (groupBy === "route") {
          searchParams.append("route", item.route);
        } else if (groupBy === "url") {
          searchParams.append("url", item.url);
        } else if (groupBy === "env") {
          searchParams.append("env", item.env);
        } else if (groupBy === "type") {
          searchParams.append("type", item.type);
        } else if (groupBy === "userId") {
          searchParams.append("userId", item.userId ?? "null");
        } else if (groupBy === "tenantId") {
          searchParams.append("tenantId", item.tenantId ?? "null");
        }
      });
      return `/admin/metrics/logs?${searchParams.toString()}`;
    },
    []
  );

  useEffect(() => {
    if (getGroupByValues(searchParams).sort((a, b) => a.localeCompare(b)).join(",") !== groupBy.sort((a, b) => a.localeCompare(b)).join(",")) {
      searchParams.delete("groupBy");
      groupBy.forEach((by) => {
        searchParams.append("groupBy", by);
      });
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  const headers = useMemo(
    () =>
      buildHeaders({
        groupBy,
        getUser,
        getTenant,
        getCountLink,
      }),
    [getCountLink, getTenant, getUser, groupBy]
  );

  return (
    <EditPageLayout
        tabs={[
          {
            name: "Summary",
            routePath: "/admin/metrics/summary",
          },
          {
            name: "All logs",
            routePath: "/admin/metrics/logs",
          },
          {
            name: "Settings",
            routePath: "/admin/metrics/settings",
          },
        ]}
      >
        <div className="space-y-2">
          <div className="flex w-full items-center space-x-2">
            <InputCombobox
              name="groupBy"
              prefix="Group by: "
              selectPlaceholder="Select group by"
              options={[
                { value: "env", name: "Env" },
                { value: "type", name: "Type" },
                { value: "route", name: "Route" },
                { value: "url", name: "URL" },
                { value: "userId", name: "User" },
                { value: "tenantId", name: "Tenant" },
                { value: "function", name: "Function" },
              ]}
              value={groupBy}
              onChange={(value) => {
                setGroupBy(value as string[]);
              }}
            />
            <div className="grow">{/* <InputSearchWithURL /> */}</div>
            <InputFilters size="sm" filters={data.filterableProperties} />
          </div>
          {groupBy.length === 0 ? (
            <WarningBanner title="Group by" text="Please select at least one group by" />
          ) : (
            <TableSimple items={data.items} headers={headers} />
          )}
        </div>
      </EditPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}

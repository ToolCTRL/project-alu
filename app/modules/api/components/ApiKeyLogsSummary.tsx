import { Link, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import ApiKeyLogUtils from "../utils/ApiKeyLogUtils";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { ApiCallSummaryDto } from "../dtos/ApiCallSummaryDto";
import ApiKeyLogsConstants from "../utils/ApiKeyLogsConstants";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { FilterableValueLink } from "~/components/ui/links/FilterableValueLink";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import InputCombobox from "~/components/ui/input/InputCombobox";
import InputFilters from "~/components/ui/input/InputFilters";
import TableSimple from "~/components/ui/tables/TableSimple";
import NumberUtils from "~/utils/shared/NumberUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import ApiUtils from "~/utils/app/ApiUtils";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import ApiCallSpeedBadge from "./ApiCallSpeedBadge";
import { useTranslation } from "react-i18next";

interface Props {
  readonly data: {
    items: ApiCallSummaryDto[];
    allTenants: { id: string; name: string }[];
    filterableProperties: FilterablePropertyDto[];
  };
}

function MethodCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return (
    <FilterableValueLink name="method" value={item.method}>
      <SimpleBadge title={item.method} color={ApiUtils.getMethodColor(item.method)} underline />
    </FilterableValueLink>
  );
}

function EndpointCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return <FilterableValueLink name="endpoint" value={item.endpoint} />;
}

function ParamsCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return <FilterableValueLink name="params" value={item.params} />;
}

function StatusCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return (
    <FilterableValueLink name="status" value={item.status?.toString() ?? "{null}"}>
      <SimpleBadge title={item.status?.toString() ?? "?"} color={item.status?.toString().startsWith("4") ? Colors.RED : Colors.GREEN} />
    </FilterableValueLink>
  );
}

function TenantCell({ item, allTenants }: { readonly item: ApiCallSummaryDto; readonly allTenants: { id: string; name: string }[] }) {
  const tenant = allTenants.find((x) => x.id === item.tenantId);
  return <FilterableValueLink name="tenantId" value={tenant?.name ?? ""} />;
}

function DurationCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return item._avg.duration === null ? (
    <span className="text-muted-foreground text-xs italic">-</span>
  ) : (
    <div>{NumberUtils.custom(Number(item._avg.duration), "0,0.001")} ms</div>
  );
}

function SpeedCell({ item }: { readonly item: ApiCallSummaryDto }) {
  return item._avg.duration === null ? (
    <span className="text-muted-foreground text-xs italic">-</span>
  ) : (
    <ApiCallSpeedBadge duration={Number(item._avg.duration)} />
  );
}

export default function ApiKeyLogsSummary({ data }: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupBy, setGroupBy] = useState<string[]>(ApiKeyLogUtils.getGroupByValues(searchParams));

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<ApiCallSummaryDto>[]>([]);

  useEffect(() => {
    const sortedGroupBy = ApiKeyLogUtils.getGroupByValues(searchParams).sort((a, b) => a.localeCompare(b));
    const sortedCurrentGroupBy = groupBy.slice().sort((a, b) => a.localeCompare(b));
    if (sortedGroupBy.join(",") !== sortedCurrentGroupBy.join(",")) {
      searchParams.delete("groupBy");
      groupBy.forEach((by) => {
        searchParams.append("groupBy", by);
      });
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  useEffect(() => {
    const headers: RowHeaderDisplayDto<ApiCallSummaryDto>[] = [];
    let currentGroupBy = groupBy;
    if (currentGroupBy.length === 0) {
      currentGroupBy = ApiKeyLogsConstants.DEFAULT_GROUP_BY;
    }
    const getCountLink = (item: ApiCallSummaryDto) => {
      const searchParams = new URLSearchParams();
      currentGroupBy.forEach((groupBy) => {
        if (groupBy === "method") {
          searchParams.append("method", item.method);
        } else if (groupBy === "endpoint") {
          searchParams.append("endpoint", item.endpoint);
        } else if (groupBy === "params") {
          searchParams.append("params", item.params);
        } else if (groupBy === "status") {
          searchParams.append("status", item.status?.toString() ?? "{null}");
        }
      });
      return UrlUtils.getModulePath(params, `api/logs?${searchParams.toString()}`);
    };
    if (groupBy.includes("method")) {
      headers.push({
        name: "method",
        title: "Method",
        value: (item) => <MethodCell item={item} />,
      });
    }
    if (groupBy.includes("endpoint")) {
      headers.push({
        name: "endpoint",
        title: "Endpoint",
        value: (item) => <EndpointCell item={item} />,
      });
    }
    if (groupBy.includes("params")) {
      headers.push({
        name: "params",
        title: "Params",
        value: (item) => <ParamsCell item={item} />,
      });
    }
    if (groupBy.includes("status")) {
      headers.push({
        name: "status",
        title: "Status",
        value: (item) => <StatusCell item={item} />,
      });
    }
    if (groupBy.includes("tenantId")) {
      headers.push({
        name: "tenantId",
        title: "Tenant",
        value: (item) => <TenantCell item={item} allTenants={data.allTenants} />,
      });
    }
    headers.push(
      {
        name: "apiCalls",
        title: "API calls",
        align: "right",
        value: (item) => (
          <div className="flex justify-end text-right">
            <Link to={getCountLink(item)} className="hover:underline">
              {NumberUtils.intFormat(Number(item._count._all))} {item._count._all === 1 ? "call" : "calls"}
            </Link>
          </div>
        ),
      },
      {
        name: "duration",
        title: "Avg. duration",
        value: (item) => <DurationCell item={item} />,
      },
      {
        name: "speed",
        title: "Speed",
        value: (item) => <SpeedCell item={item} />,
      },
      {
        name: "actions",
        title: "",
        value: (item) => (
          <Link to={getCountLink(item)} className="hover:underline">
            {t("shared.details")} <span className="ml-1">&rarr;</span>
          </Link>
        ),
      }
    );

    setHeaders(headers);
  }, [data, groupBy, params, t]);

  return (
    <div className="space-y-2">
      <div className="flex w-full items-center space-x-2">
        <InputCombobox
          name="groupBy"
          prefix="Group by: "
          selectPlaceholder="Select group by"
          options={[
            { value: "method", name: "Method" },
            { value: "endpoint", name: "Endpoint" },
            { value: "params", name: "Params" },
            { value: "status", name: "Status" },
            { value: "tenantId", name: "Tenant" },
          ]}
          value={groupBy}
          onChange={(value) => {
            setGroupBy(value as string[]);
          }}
        />
        <div className="grow"></div>
        <InputFilters filters={data.filterableProperties} />
      </div>
      {groupBy.length === 0 ? (
        <WarningBanner title="Group by" text="Please select at least one group by" />
      ) : (
        <TableSimple items={data.items} headers={headers} />
      )}
    </div>
  );
}
